  function getProductById(id) {
    if (!id) return null;
    if (window.ShopVietData && typeof window.ShopVietData.getProductById === 'function') {
      return window.ShopVietData.getProductById(id);
    }
    if (window.ShopVietState && typeof window.ShopVietState.getProductById === 'function') {
      return window.ShopVietState.getProductById(id);
    }
    return null;
  }

/**
 * BuiThai AI Studio - Quick Buy & Direct Skill Delivery Module (Argon Sovereign OS v4.0)
 * Thanh toán 100% bằng Ví Xu (Nạp Xu trước) - Trừ Xu tự động & Mở khóa trực tiếp trên web
 * Không qua link trung gian - Sao chép SKILL.md và tải file .md trực tiếp từ trình duyệt
 */

window.ShopVietViews = window.ShopVietViews || {};

window.ShopVietViews.modal = (function () {
  'use strict';

  const normalizeVoucherCode = (typeof window !== 'undefined' && window.ShopVietNormalizeVoucher)
    ? window.ShopVietNormalizeVoucher
    : function (str) {
        if (!str) return '';
        return String(str)
          .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
          .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '')
          .trim()
          .toUpperCase();
      };
  if (typeof window !== 'undefined' && !window.ShopVietNormalizeVoucher) {
    window.ShopVietNormalizeVoucher = normalizeVoucherCode;
  }

  let currentProduct = null;
  let currentQty = 1;
  let appliedVoucher = null;
  let quickPayTimer = null;
  let lastUnlockedOrder = null;
  let isPurchasing = false; // Khoa chong bam nhieu lan tru nhieu tien

  // ================== NẠP XU: MÃ DO SERVER CẤP + SEPAY ĐỐI SOÁT ==================
  // Ví Xu nằm trên server (Firestore). Client chỉ xin mã nạp và hỏi trạng thái.
  let depositIntent = { memo: '', amount: 0 };

  async function getFirebaseIdToken() {
    try {
      if (window.ShopVietFirebase && typeof window.ShopVietFirebase.getIdToken === 'function') {
        return await window.ShopVietFirebase.getIdToken();
      }
    } catch (e) {}
    return null;
  }

  // Lý do lỗi gần nhất khi gọi /api/topups (hiện trong toast để dễ chẩn đoán).
  var lastTopupError = '';

  async function callTopupApi(idToken, payload) {
    const origin = window.location.origin || '';
    const res = await fetch(origin + '/api/topups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + idToken },
      body: JSON.stringify(payload),
      signal: (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') ? AbortSignal.timeout(10000) : undefined
    }).catch(function () { return null; });

    if (!res) {
      lastTopupError = 'không kết nối được máy chủ';
      console.warn('[Nạp Xu] không gọi được /api/topups (mạng hoặc timeout)');
      return null;
    }

    const json = await res.json().catch(function () { return null; });
    if (!res.ok) {
      lastTopupError = 'mã ' + res.status + (json && (json.reason || json.code) ? ' · ' + (json.reason || json.code) : '');
      console.warn('[Nạp Xu] /api/topups lỗi:', res.status, json);
      return null;
    }
    if (json && json.ok === false) {
      lastTopupError = json.reason || json.code || json.message || 'máy chủ từ chối';
      console.warn('[Nạp Xu] /api/topups trả ok:false:', json);
      return null;
    }
    lastTopupError = '';
    return json;
  }

  async function requestDepositIntent(idToken, amount, userName) {
    if (depositIntent.memo && depositIntent.amount === amount) return depositIntent;
    const payload = depositIntent.memo
      ? { action: 'update_intent', memo: depositIntent.memo, amount: amount }
      : { action: 'create_intent', amount: amount, userName: userName || '' };
    const json = await callTopupApi(idToken, payload);
    if (!json || !json.ok || !json.memo) {
      // Fallback khi serverless 503 / RESOURCE_EXHAUSTED: Tự sinh mã memo hợp lệ và phát ntfy để không bao giờ kẹt modal
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let randomMemo = 'NAPXU';
      for (let i = 0; i < 8; i++) randomMemo += chars.charAt(Math.floor(Math.random() * chars.length));
      depositIntent = { memo: randomMemo, amount: amount };
      try {
        const uEmail = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user && window.ShopVietState.state.user.email) || '';
        fetch('https://ntfy.sh/buithai_studio_0986019623', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: 'buithai_studio_0986019623',
            title: 'INTENT:' + randomMemo,
            message: JSON.stringify({ memo: randomMemo, userEmail: uEmail, userName: userName || uEmail, amount: amount, status: 'pending', createdAt: new Date().toISOString() })
          })
        }).catch(() => {});
      } catch (_) {}
      return depositIntent;
    }
    depositIntent = { memo: json.memo, amount: Number(json.amount) || amount };
    return depositIntent;
  }

  async function fetchDepositIntentStatus(memo) {
    const origin = window.location.origin || '';
    const res = await fetch(origin + '/api/topups?intent=' + encodeURIComponent(memo) + '&_t=' + Date.now(), {
      method: 'GET',
      cache: 'no-store',
      signal: (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') ? AbortSignal.timeout(8000) : undefined
    }).catch(function () { return null; });
    if (!res || !res.ok) return null;
    return res.json().catch(function () { return null; });
  }


  function getExistingActiveOrder(productId, userEmail) {
    if (window.ShopVietState && typeof window.ShopVietState.reloadUserStateFromLocalStorage === 'function') {
      window.ShopVietState.reloadUserStateFromLocalStorage();
    }
    if (!productId) return null;
    const currentUser = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user) || null;

    // BẢO VỆ BẢN QUYỀN 100%: Chưa đăng nhập -> Tuyệt đối không mở khóa
    if (!currentUser || !currentUser.isLoggedIn || !currentUser.email) {
      return null;
    }

    const email = (userEmail || currentUser.email || '').trim().toLowerCase();
    if (!email) return null;

    // 1. Quản trị viên / Chủ Studio Bùi Thái luôn có toàn quyền xem mở khóa mọi sản phẩm
    if (currentUser.role === 'admin' || currentUser.email.trim().toLowerCase() === 'thaitraicau123@gmail.com') {
      const prod = (window.ShopVietData && typeof window.ShopVietData.getProductById === 'function')
        ? window.ShopVietData.getProductById(productId)
        : ((window.ShopVietState && typeof window.ShopVietState.getProductById === 'function') ? window.ShopVietState.getProductById(productId) : null);
      return {
        id: '#ADMIN-ALL-ACCESS',
        orderCode: '#ADMIN-ALL-ACCESS',
        productId: productId,
        productName: prod ? prod.name : 'Hộp Công Cụ Prompts',
        status: 'completed',
        statusText: 'Đã mở khóa (Quyền Quản Trị Viên)',
        userEmail: currentUser.email,
        unlockedPayload: (prod && prod.unlockedPayload) || {}
      };
    }

    // 2. Kiểm tra trong danh sách đơn hàng đã mua chính chủ
    const orders = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.orders) || [];
    return orders.find(function (order) {
      if (!order) return false;
      const orderEmail = (order.userEmail || (order.customer && order.customer.email) || '').trim().toLowerCase();
      // BẮT BUỘC KHỚP EMAIL CHÍNH CHỦ
      if (!orderEmail || orderEmail !== email) return false;
      if (order.status !== 'completed') return false;
      
      const match = (order.productId === productId) || 
        (order.items && order.items.some(function (it) { return it.id === productId || it.productId === productId; }));
      if (!match) return false;
      
      return true;
    }) || null;
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      window.ShopVietViews.modal.close();
    }
  }

  function formatMoney(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) return '0';
    return Number(amount).toLocaleString('vi-VN');
  }

  function escapeHTML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderSafeProductImage(prod, imgClass, fallbackClass) {
    if (window.ShopVietViews && typeof window.ShopVietViews.renderSafeProductImage === 'function') {
      return window.ShopVietViews.renderSafeProductImage(prod, imgClass, fallbackClass);
    }
    imgClass = imgClass || 'w-full h-full object-cover rounded-2xl';
    fallbackClass = fallbackClass || 'relative z-10 w-10 h-10 flex items-center justify-center';
    if (!prod) return '';
    const iconSvg = (window.ShopVietData && typeof window.ShopVietData.getBrandIcon === 'function')
      ? window.ShopVietData.getBrandIcon(prod.iconType)
      : '';

    let rawUrl = (prod.imageUrl || '').trim();
    if (!rawUrl) {
      return `<div class="${fallbackClass}">${iconSvg}</div>`;
    }

    if (rawUrl.startsWith('<svg') || rawUrl.startsWith('<?xml')) {
      return `<div class="${fallbackClass} overflow-hidden">${rawUrl}</div>`;
    }

    let safeSrc = rawUrl;
    if (safeSrc.startsWith('data:image/svg+xml;utf8,') || safeSrc.startsWith('data:image/svg+xml,')) {
      const prefix = safeSrc.startsWith('data:image/svg+xml;utf8,') ? 'data:image/svg+xml;utf8,' : 'data:image/svg+xml,';
      const svgBody = safeSrc.substring(prefix.length);
      safeSrc = prefix + svgBody.replace(/"/g, '%22').replace(/#/g, '%23');
    } else {
      safeSrc = safeSrc.replace(/"/g, '&quot;');
    }

    return `<img src="${safeSrc}" alt="" class="${imgClass}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" /><div style="display:none;" class="${fallbackClass}">${iconSvg}</div>`;
  }

  function getActiveVietQRConfig() {
    if (window.ShopVietState && typeof window.ShopVietState.getVietQRConfig === 'function') {
      return window.ShopVietState.getVietQRConfig();
    }
    return {
      bankId: '970422',
      bin: '970422',
      bankName: 'MBBank (Ngân hàng TMCP Quân Đội)',
      shortName: 'MBBank',
      accountNumber: '0986019623',
      accountName: 'BUI THAI',
      memoPrefix: 'NAP',
      brandColor: '#0071E3'
    };
  }

  function copyToClipboard(text, label) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(() => {
        if (window.ShopVietState && typeof window.ShopVietState.showToast === 'function') {
          window.ShopVietState.showToast(`✓ Đã sao chép ${label || 'nội dung'} vào clipboard!`, 'success');
        }
      }).catch(() => {
        fallbackCopy(text, label);
      });
    } else {
      fallbackCopy(text, label);
    }
  }

  function fallbackCopy(text, label) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      if (window.ShopVietState && typeof window.ShopVietState.showToast === 'function') {
        window.ShopVietState.showToast(`✓ Đã sao chép ${label || 'nội dung'} vào clipboard!`, 'success');
      }
    } catch (err) {
      console.warn('Copy error:', err);
    }
    document.body.removeChild(tempInput);
  }

  function clearPaymentTimer() {
    if (quickPayTimer) {
      clearInterval(quickPayTimer);
      quickPayTimer = null;
    }
  }

  function getGradientClass(iconType) {
    const gradients = {
      gpu: 'from-[#090B10] via-[#0B1220] to-[#0F1B33] border-slate-800/80',
      palette: 'from-[#090B10] via-[#0B1220] to-[#0F1B33] border-slate-800/80',
      server: 'from-[#090B10] via-[#0B1220] to-[#0F1B33] border-slate-800/80',
      video: 'from-[#090B10] via-[#0B151A] to-[#0D2129] border-slate-800/80',
      sparkles: 'from-[#090B10] via-[#0B1220] to-[#0F1B33] border-slate-800/80',
      code: 'from-[#090B10] via-[#0B1220] to-[#0F1B33] border-slate-800/80',
      openjarvis: 'from-[#090B10] via-[#0B1518] to-[#0E2429] border-slate-800/80'
    };
    return gradients[iconType] || 'from-[#090B10] via-[#0B1220] to-[#0F1B33] border-slate-800/80';
  }

  function renderModalGuidePaneHTML(currentProduct, totalXu, userBalance, isSufficient, currentUser) {
    if (!currentProduct) return '';
    const isAllInOne = currentProduct.id === 'skill-combo-allinone';
    const isOpenJarvis = currentProduct.id === 'skill-openjarvis-local-ai';
    const isSourceStarter = !isAllInOne && !isOpenJarvis && (
      String(currentProduct.id || '').startsWith('source-') ||
      String(currentProduct.id || '').startsWith('template-') ||
      Boolean(currentProduct.unlockedPayload && currentProduct.unlockedPayload.codeSnippet) ||
      Boolean(currentProduct.demoUrl)
    );
    const cheatSheet = (currentProduct.unlockedPayload && Array.isArray(currentProduct.unlockedPayload.cheatSheet) && currentProduct.unlockedPayload.cheatSheet.length > 0)
      ? currentProduct.unlockedPayload.cheatSheet
      : ((currentProduct.cheatSheet && Array.isArray(currentProduct.cheatSheet) && currentProduct.cheatSheet.length > 0)
          ? currentProduct.cheatSheet
          : ((currentProduct.unlockedPayload && Array.isArray(currentProduct.unlockedPayload.promptTemplates))
              ? currentProduct.unlockedPayload.promptTemplates
              : []));
    const zipLabel = escapeHTML(currentProduct.zipFileName || (isSourceStarter ? 'starter-source-kit.zip' : 'BuiThai_AI_AllInOne_ZeroSetup_Vault.zip'));

    return `
      <div class="space-y-4 text-xs">

        <!-- QUY TRÌNH GIẢI NÉN CHUẨN -->
        <div class="p-4 rounded-2xl bg-[#0071E3]/[0.06] dark:bg-[#3B9EFF]/[0.08] border border-[#0071E3]/25 dark:border-[#3B9EFF]/25 space-y-2.5">
          <div class="flex items-start gap-2.5">
            <span class="w-9 h-9 rounded-xl bg-[#0071E3] text-white flex items-center justify-center text-lg shrink-0">📦</span>
            <div class="min-w-0">
              <div class="text-[10px] font-bold uppercase tracking-wider text-[#0071E3] dark:text-[#3B9EFF]">
                Quy Trình Trước Khi Khởi Chạy
              </div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Tải Về &amp; Giải Nén File ZIP Ra Thư Mục Riêng
              </h4>
            </div>
          </div>

          <div class="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11.5px] leading-relaxed pl-1">
            <p>
              <strong>Bước 1 — Tải gói:</strong> Sau khi mở khóa trên web, bạn tải trực tiếp file <code class="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 font-mono text-[#0071E3] dark:text-[#3B9EFF]">${zipLabel}</code> về máy.
            </p>
            <p>
              <strong>Bước 2 — Giải nén (Extract All):</strong> Nhấp chuột phải vào file <code class="font-mono">.zip</code> &rarr; chọn <strong>"Extract All..."</strong> ra thư mục độc lập trước khi mở file.
            </p>
            <div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-800 dark:text-rose-300 text-[11px] font-medium">
              Lưu ý: Không mở trực tiếp file HTML hoặc chạy lệnh bên trong file .zip chưa giải nén để tránh lỗi thiếu asset offline.
            </div>
            <p>
              <strong>Bước 3 — Khởi động:</strong>
              ${isOpenJarvis
                ? `Mở thư mục vừa giải nén và chạy <strong class="text-emerald-600 dark:text-emerald-400 font-mono">Cai_Dat_Tu_Dong_OpenJarvis_1Click.bat</strong> để cài đặt tự động.`
                : isSourceStarter
                  ? `Mở terminal trong thư mục vừa giải nén &rarr; chạy <strong class="text-[#0071E3] dark:text-[#3B9EFF] font-mono">npm install &amp;&amp; npm run dev</strong> (hoặc mở trực tiếp <strong class="text-[#0071E3] dark:text-[#3B9EFF] font-mono">index.html</strong> nếu là bản 1-file) để tùy biến code.`
                  : `Nhấp đúp vào <strong class="text-[#0071E3] dark:text-[#3B9EFF] font-mono">BuiThai_AI_Sovereign_Studio_ZeroSetup.html</strong> để khởi chạy offline 100%.`}
            </p>
          </div>
        </div>

        <!-- QUY TRÌNH 3 BƯỚC -->
        <div class="p-4 rounded-2xl bg-white/85 dark:bg-[#0B0F17]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>${isSourceStarter ? '🛠️ Quy Trình 3 Bước Tải Code &amp; Phát Triển Tiếp' : '🚀 Quy Trình 3 Bước Nạp Prompt Vào AI'}</span>
            </h4>
            <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
              ${isSourceStarter ? 'Code Sạch • Mở Rộng Tự Do' : 'Chuẩn Tác Chiến'}
            </span>
          </div>

          ${isSourceStarter ? `
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div class="p-3 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white font-bold flex items-center justify-center text-xs tabular-nums">1</span>
                <div class="font-bold text-slate-900 dark:text-white">Tải Source Starter</div>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Mở khóa 1 lần, tải trọn bộ file .zip chứa mã nguồn sạch, asset 3D/Sprite và tài liệu kiến trúc.</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white font-bold flex items-center justify-center text-xs tabular-nums">2</span>
                <div class="font-bold text-slate-900 dark:text-white">Chạy Local &amp; Build</div>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Giải nén, chạy <code class="font-mono text-[#0071E3] dark:text-[#3B9EFF]">npm install &amp;&amp; npm run dev</code> để tùy chỉnh giao diện, gameplay hoặc logic riêng.</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs tabular-nums">3</span>
                <div class="font-bold text-slate-900 dark:text-white">Nạp Prompt Mở Rộng</div>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Copy Master Prompt + Cheat Sheet đi kèm để Cursor / Claude / AI hiểu đúng kiến trúc và code tiếp cùng bạn.</p>
              </div>
            </div>
          ` : `
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div class="p-3 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white font-bold flex items-center justify-center text-xs tabular-nums">1</span>
                <div class="font-bold text-slate-900 dark:text-white">Copy Master Prompt</div>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Bấm <strong>1-Click Copy</strong> để lấy toàn bộ System Instructions, dán vào ChatGPT / Claude / Cursor.</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white font-bold flex items-center justify-center text-xs tabular-nums">2</span>
                <div class="font-bold text-slate-900 dark:text-white">Chọn Lệnh Cheat Sheet</div>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Thay thế các biến trong ngoặc <code class="text-[#0071E3] dark:text-[#3B9EFF] font-mono">[TÊN_DỰ_ÁN]</code>, <code class="text-[#0071E3] dark:text-[#3B9EFF] font-mono">[MỤC_TIÊU]</code> rồi gửi cho AI.</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs tabular-nums">3</span>
                <div class="font-bold text-slate-900 dark:text-white">Nhận Kết Quả Sạch</div>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">AI tuân thủ chặt kiến trúc, xuất mã nguồn sạch hoặc nội dung chuẩn áp dụng ngay.</p>
              </div>
            </div>
          `}
        </div>

        ${isAllInOne ? `
          <div class="p-4 rounded-2xl bg-white/85 dark:bg-[#0B0F17]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div class="flex items-center justify-between gap-2">
              <div>
                <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>🗺️ Ma Trận 15 Phân Khu: Tra Cứu Nhanh 560+ Master Prompts</span>
                </h4>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Chọn đúng nhóm số thứ tự theo tác vụ thực tế</p>
              </div>
              <span class="text-[11px] font-bold text-[#0071E3] dark:text-[#3B9EFF] shrink-0 tabular-nums">560+ Prompts</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] max-h-72 overflow-y-auto pr-1">
              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-[#0071E3] text-white font-mono font-bold text-[11px] tabular-nums">#001 – #020</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">20 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Hệ Điều Hành Toàn Năng (Argon Sovereign OS)</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Điều phối dự án lớn, phân luồng đa agent, kiến trúc phần mềm từ A–Z.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-slate-800 dark:bg-slate-700 text-white font-mono font-bold text-[11px] tabular-nums">#021 – #131</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">111 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Kỹ Năng Hệ Thống (.gemini Core &amp; Ponytail)</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Viết code tối giản loại bỏ code thừa, diệt bug tận gốc &lt; 0.1s, kiểm tra 4 tầng.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-rose-600 text-white font-mono font-bold text-[11px] tabular-nums">#132 – #377</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">246 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Game Pixel VFX &amp; Sound FX Engine</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">246 chiêu thức hoạt họa game 60fps kèm Sound FX Web Audio 0MB.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-red-600 text-white font-mono font-bold text-[11px] tabular-nums">#378 – #380</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">3 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Pixel Fighter Forge (Đấu Sĩ 48×48)</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Nhân vật đối kháng 48px, bộ combo 4 đòn nối tiếp và 5 Ultimate điện ảnh.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-[#0071E3] text-white font-mono font-bold text-[11px] tabular-nums">#381 – #395</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">15 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Thiết Kế Web UI &amp; Apple Liquid Glass</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Landing Page, Portfolio, Liquid Glass, Typography bản địa tiếng Việt.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-sky-600 text-white font-mono font-bold text-[11px] tabular-nums">#396 – #410</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">15 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Lập Trình Fullstack Vercel &amp; Supabase RLS</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Next.js 15, React 19, PostgreSQL Schema, RLS bảo mật tài chính.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono font-bold text-[11px] tabular-nums">#411 – #425</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">15 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Content SEO E-E-A-T &amp; Affiliate Marketing</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Viết bài chuẩn SEO Top Google, kịch bản video TikTok/Reels.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-teal-600 text-white font-mono font-bold text-[11px] tabular-nums">#426 – #440</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">15 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Nghiên Cứu Học Thuật &amp; Luận Văn Nature</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Trích dẫn Nature/CNS, giải thích bảng hồi quy SPSS, viết luận văn.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-cyan-600 text-white font-mono font-bold text-[11px] tabular-nums">#441 – #455</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">15 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Gia Sư Nhập Môn Lập Trình &amp; Clean Code</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Giải thích thuật toán trực quan, refactor code cũ, viết unit test.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-slate-700 text-white font-mono font-bold text-[11px] tabular-nums">#456 – #470</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">15 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Tự Động Hóa N8N, Webhook &amp; AI Agent</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Quy trình n8n, webhook thanh toán ntfy, worker chạy ngầm 24/7.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-fuchsia-600 text-white font-mono font-bold text-[11px] tabular-nums">#471 – #485</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">15 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Dựng Video Phonk &amp; Beat Sync 60fps</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Bắt beat nhạc Phonk, hiệu ứng RGB Shake và flash drop đồng bộ.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono font-bold text-[11px] tabular-nums">#486 – #500</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">15 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Web Audio Synthesizer (0MB)</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Sinh hiệu ứng âm thanh tương tác thuần Web Audio API, 0ms latency.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-emerald-700 text-white font-mono font-bold text-[11px] tabular-nums">#501 – #515</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">15 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Kinh Tế Game &amp; Hệ Thống Ví Xu</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Cân bằng tokenomics Faucet/Sink, chống rút tiền đúp nguyên tử.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-rose-700 text-white font-mono font-bold text-[11px] tabular-nums">#516 – #530</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">15 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Săn Lỗ Hổng &amp; AppSec Red Team Pentest</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Kiểm thử F12 tampering, XSS, RLS bypass và viết bản vá niêm phong.</p>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 space-y-1 sm:col-span-2">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-slate-800 text-white font-mono font-bold text-[11px] tabular-nums">#531 – #545</span>
                  <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">15 Mẫu</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-bold">Cứu Hộ &amp; Chẩn Đoán Lỗi Root Cause Debugger</strong>
                <p class="text-slate-600 dark:text-slate-400 text-[10.5px]">Sửa lỗi runtime trắng trang, memory leak, diệt tận gốc đúng dòng lỗi.</p>
              </div>
            </div>
          </div>
        ` : `
          <div class="p-4 rounded-2xl bg-white/85 dark:bg-[#0B0F17]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div class="flex items-center justify-between gap-2">
              <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>${isSourceStarter ? '🧩 Kiến Trúc Bộ Mã Nguồn &amp; Quyền Tự Phát Triển' : '🎯 Ứng Dụng Thực Chiến &amp; Danh Mục Mẫu Lệnh'}</span>
              </h4>
              <span class="text-[11px] font-bold text-[#0071E3] dark:text-[#3B9EFF] shrink-0 tabular-nums">${cheatSheet.length || '10+'} Mẫu Lệnh</span>
            </div>

            <p class="text-slate-600 dark:text-slate-400 text-[11.5px] leading-relaxed">
              ${isSourceStarter
                ? `Bộ starter <strong class="text-slate-900 dark:text-white">${escapeHTML(currentProduct.name)}</strong> cung cấp trọn vẹn mã nguồn sạch (không khóa mã, không obfuscate) kèm <strong>${cheatSheet.length || '10+'} câu lệnh phát triển tiếp</strong> để bạn tùy biến và thương mại hóa sản phẩm của riêng mình.`
                : `Hộp công cụ <strong class="text-slate-900 dark:text-white">${escapeHTML(currentProduct.name)}</strong> bao gồm 1 Master System Prompt cốt lõi và <strong>${cheatSheet.length || '10+'} mẫu câu lệnh Cheat Sheet</strong> đã kiểm chứng thực chiến.`}
            </p>

            <div class="space-y-2">
              <span class="font-bold text-slate-800 dark:text-slate-200 text-xs block">📋 Phù hợp nhất khi bạn cần:</span>
              <ul class="space-y-1 text-slate-600 dark:text-slate-400 text-[11px] pl-4 list-disc">
                <li>${isSourceStarter ? `Rút ngắn thời gian dựng nền tảng <strong>${escapeHTML(currentProduct.tag || currentProduct.category || 'Source Starter')}</strong> và phát triển thêm tính năng riêng.` : `Giải quyết chuyên sâu bài toán <strong>${escapeHTML(currentProduct.tag || currentProduct.category || 'AI Tác Chiến')}</strong>.`}</li>
                <li>${isSourceStarter ? 'Tùy biến logic, giao diện, thêm màn chơi hoặc tích hợp API mới trong Cursor / VS Code.' : 'Loại bỏ kết quả chung chung từ AI mặc định và xuất mã nguồn đúng chuẩn kỹ thuật.'}</li>
                <li>Sở hữu trọn đời mã nguồn &amp; bộ tài liệu để dùng cho dự án cá nhân hoặc khách hàng.</li>
              </ul>
            </div>

            ${isOpenJarvis ? `
              <div class="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">⚡</span>
                    <strong class="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
                      Tự Động Cài Đặt 1-Chạm (1-Click Auto Installer)
                    </strong>
                  </div>
                  <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">0 Dòng Lệnh</span>
                </div>
                <div class="text-[11.5px] text-slate-700 dark:text-slate-300 space-y-1 leading-relaxed">
                  <p>• <strong>Cách 1:</strong> Giải nén <code class="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 font-mono text-emerald-900 dark:text-emerald-300">OpenJarvis_AutoInstall_1Click_Vault.zip</code> rồi nhấp đúp <strong class="text-emerald-700 dark:text-emerald-400 font-mono">Cai_Dat_Tu_Dong_OpenJarvis_1Click.bat</strong>.</p>
                  <p>• <strong>Cách 2:</strong> Nhấp đúp <strong class="text-teal-700 dark:text-teal-400 font-mono">Chay_OpenJarvis_Giao_Dien_Web.bat</strong> để mở giao diện chat local.</p>
                  <p>• <strong>Cách 3 (PowerShell):</strong> <code class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] text-[#0071E3] dark:text-[#3B9EFF] select-all">irm https://open-jarvis.github.io/OpenJarvis/install.ps1 | iex</code></p>
                </div>
              </div>
            ` : ''}
          </div>
        `}

        <!-- CAM KẾT BẢO HÀNH & HỖ TRỢ -->
        <div class="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-[#090B10]/90 border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-1.5">
          <div class="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
            <span class="flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Chính Sách Bản Quyền &amp; Hỗ Trợ 24/7</span>
            </span>
            <span class="text-emerald-600 dark:text-emerald-400">Bảo Hành Vĩnh Viễn</span>
          </div>
          <p class="text-slate-500 dark:text-slate-400 text-[10.5px] leading-relaxed">
            • Quyền tải &amp; mở khóa vĩnh viễn gắn liền với tài khoản của bạn.<br>
            • Tự động đồng bộ Cloud Firestore trên mọi thiết bị.<br>
            • Hỗ trợ kỹ thuật 24/7 qua Zalo: <strong class="text-[#0071E3] dark:text-[#3B9EFF] font-mono">0986.019.623</strong> (Admin Bùi Thái).
          </p>
        </div>

      </div>
    `;
  }

  return {
    switchQuickBuyTab: function (tabKey) {
      const btnOverview = document.getElementById('quickBuyTabBtnOverview');
      const btnGuide = document.getElementById('quickBuyTabBtnGuide');
      const paneOverview = document.getElementById('quickBuyPaneOverview');
      const paneGuide = document.getElementById('quickBuyPaneGuide');

      if (!btnOverview || !btnGuide || !paneOverview || !paneGuide) return;

      if (tabKey === 'guide') {
        btnOverview.className = 'px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 cursor-pointer flex items-center gap-1.5';
        btnGuide.className = 'px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 border-[#0071E3] dark:border-[#3B9EFF] text-[#0071E3] dark:text-[#3B9EFF] transition-colors shrink-0 cursor-pointer flex items-center gap-1.5';
        paneOverview.classList.add('hidden');
        paneGuide.classList.remove('hidden');
      } else {
        btnGuide.className = 'px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 cursor-pointer flex items-center gap-1.5';
        btnOverview.className = 'px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 border-[#0071E3] dark:border-[#3B9EFF] text-[#0071E3] dark:text-[#3B9EFF] transition-colors shrink-0 cursor-pointer flex items-center gap-1.5';
        paneGuide.classList.add('hidden');
        paneOverview.classList.remove('hidden');
      }
    },

    selectGalleryImage: function (idx) {
      if (!currentProduct || !Array.isArray(currentProduct.gallery) || !currentProduct.gallery[idx]) return;
      const item = currentProduct.gallery[idx];
      const mainImg = document.getElementById('quickBuyMainGalleryImg');
      const mainCaption = document.getElementById('quickBuyMainGalleryCaption');
      if (mainImg) {
        mainImg.src = item.url || '';
        mainImg.alt = item.label || currentProduct.name || '';
      }
      if (mainCaption) {
        mainCaption.textContent = `${item.label || currentProduct.name || 'Xem trước'} · ${idx + 1}/${currentProduct.gallery.length}`;
      }
      document.querySelectorAll('.quickbuy-gallery-thumb').forEach((btn, i) => {
        if (i === idx) {
          btn.className = 'quickbuy-gallery-thumb shrink-0 rounded-xl overflow-hidden border-2 border-[#0071E3] dark:border-[#3B9EFF] ring-2 ring-[#0071E3]/25 transition cursor-pointer bg-[#090B10]';
        } else {
          btn.className = 'quickbuy-gallery-thumb shrink-0 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 opacity-75 hover:opacity-100 transition cursor-pointer bg-[#090B10]';
        }
      });
    },

    open: function (productOrId) {
      if (window.ShopVietState && typeof window.ShopVietState.reloadUserStateFromLocalStorage === 'function') {
        window.ShopVietState.reloadUserStateFromLocalStorage();
      }
      if (!productOrId) return;

      if (typeof productOrId === 'string') {
        currentProduct = (window.ShopVietData && typeof window.ShopVietData.getProductById === 'function')
          ? window.ShopVietData.getProductById(productOrId)
          : ((window.ShopVietState && typeof window.ShopVietState.getProductById === 'function')
              ? window.ShopVietState.getProductById(productOrId)
              : null);
      } else {
        currentProduct = productOrId;
      }

      if (!currentProduct) {
        if (window.ShopVietState) {
          window.ShopVietState.showToast('Không tìm thấy thông tin sản phẩm!', 'error');
        }
        return;
      }

      currentQty = 1;
      appliedVoucher = null;
      if (window.ShopVietState) {
        window.ShopVietState.appliedQuickBuyVoucher = null;
      }

      const modalMount = document.getElementById('modalMount');
      if (!modalMount) return;

      const currentUser = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user) || null;
      const userBalance = (currentUser && typeof currentUser.balance === 'number') ? currentUser.balance : 0;
      const totalXu = currentProduct.price * currentQty;
      const isSufficient = currentUser && (userBalance >= totalXu);
      const activeOrder = getExistingActiveOrder(currentProduct.id, currentUser ? currentUser.email : '');
      const isAlreadyUnlocked = Boolean(activeOrder);
      const hasGallery = Array.isArray(currentProduct.gallery) && currentProduct.gallery.length > 0;
      const isSourceStarter = String(currentProduct.id || '').startsWith('source-') || String(currentProduct.id || '').startsWith('template-') || Boolean(currentProduct.unlockedPayload && currentProduct.unlockedPayload.codeSnippet);
      const isMetropolis = currentProduct.id === 'source-metropolis-1998-city-builder';

      if (isAlreadyUnlocked && activeOrder) {
        this.renderUnlockedSkillView(activeOrder);
        return;
      }

      modalMount.innerHTML = `
        <div
          id="quickBuyBackdrop"
          class="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 transition-opacity animate-fade-in"
          onclick="if(event.target === this) ShopVietViews.modal.close()"
        >
          <div
            class="max-w-2xl w-full bg-white/92 dark:bg-[#0B0F17]/92 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transform transition-all animate-slide-up flex flex-col max-h-[92vh]"
            onclick="event.stopPropagation()"
          >
            <!-- HEADER MODAL -->
            <div class="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/70 dark:bg-[#090B10]/80">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="w-9 h-9 rounded-xl bg-[#0071E3]/10 dark:bg-[#3B9EFF]/15 text-[#0071E3] dark:text-[#3B9EFF] border border-[#0071E3]/20 flex items-center justify-center text-lg shrink-0">
                  ${isSourceStarter ? '🧩' : '🪙'}
                </span>
                <div class="min-w-0">
                  <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    ${isSourceStarter ? 'Mở Khóa &amp; Tải Mã Nguồn Bằng Ví Xu' : 'Mua Kỹ Năng Bằng Ví Xu'}
                  </h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">Trừ Xu tự động &amp; tải trọn bộ file trực tiếp trên web</p>
                </div>
              </div>

              <button
                type="button"
                onclick="ShopVietViews.modal.close()"
                class="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Đóng (Esc)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- NAVIGATION TABS -->
            <div class="px-5 flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-[#090B10]/50 overflow-x-auto shrink-0">
              <button
                type="button"
                id="quickBuyTabBtnOverview"
                onclick="ShopVietViews.modal.switchQuickBuyTab('overview')"
                class="px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 border-[#0071E3] dark:border-[#3B9EFF] text-[#0071E3] dark:text-[#3B9EFF] transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>⚡ Mở Khóa &amp; Mua Xu</span>
              </button>
              <button
                type="button"
                id="quickBuyTabBtnGuide"
                onclick="ShopVietViews.modal.switchQuickBuyTab('guide')"
                class="px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>📖 Hướng Dẫn &amp; Cài Đặt</span>
              </button>
            </div>

            <!-- BODY MODAL -->
            <div class="p-5 space-y-4 overflow-y-auto flex-1">

              <!-- PANE 1: OVERVIEW -->
              <div id="quickBuyPaneOverview" class="space-y-4">

                <!-- PRODUCT SUMMARY -->
                <div class="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/80 dark:bg-[#090B10]/85 border border-slate-200/80 dark:border-slate-800/80">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    ${renderSafeProductImage(currentProduct, 'w-full h-full object-cover rounded-xl', 'relative z-10 w-10 h-10 flex items-center justify-center text-[#0071E3] dark:text-[#3B9EFF]')}
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap text-[11px]">
                      <span class="font-bold uppercase tracking-wider text-[#0071E3] dark:text-[#3B9EFF]">
                        ${escapeHTML(currentProduct.badge || 'SẢN PHẨM SỐ')}
                      </span>
                      ${currentProduct.tag ? `<span class="text-slate-400">·</span><span class="font-medium text-slate-500 dark:text-slate-400">${escapeHTML(currentProduct.tag)}</span>` : ''}
                    </div>

                    <h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1 leading-snug line-clamp-2">
                      ${escapeHTML(currentProduct.name)}
                    </h4>

                    <div class="flex items-baseline gap-2 mt-1.5">
                      <span class="text-lg sm:text-xl font-extrabold text-[#0071E3] dark:text-[#3B9EFF] font-mono tabular-nums">
                        ${formatMoney(currentProduct.price)} Xu
                      </span>
                      ${currentProduct.oldPrice ? `
                        <span class="text-xs text-slate-400 line-through font-mono tabular-nums">
                          ${formatMoney(currentProduct.oldPrice)}đ
                        </span>
                      ` : ''}
                      ${currentProduct.zipFileSize ? `
                        <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">· ${escapeHTML(currentProduct.zipFileSize)}</span>
                      ` : ''}
                    </div>
                  </div>
                </div>

                ${hasGallery ? `
                  <!-- INTERACTIVE SCREENSHOT GALLERY -->
                  <div class="p-3 rounded-2xl bg-[#090B10] border border-slate-800/90 space-y-2.5">
                    <div class="relative rounded-xl overflow-hidden bg-black border border-slate-800">
                      <img
                        id="quickBuyMainGalleryImg"
                        src="${escapeHTML(currentProduct.gallery[0].url || '')}"
                        alt="${escapeHTML(currentProduct.gallery[0].label || currentProduct.name)}"
                        class="w-full h-52 sm:h-64 object-cover"
                      />
                      <div class="px-3 py-1.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                        <span id="quickBuyMainGalleryCaption" class="truncate font-medium tabular-nums">${escapeHTML(currentProduct.gallery[0].label || currentProduct.name)} · 1/${currentProduct.gallery.length}</span>
                        <span class="text-[10px] font-mono text-[#3B9EFF] shrink-0">Bấm ảnh dưới để đổi góc nhìn</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 overflow-x-auto pb-0.5">
                      ${currentProduct.gallery.map((img, idx) => `
                        <button
                          type="button"
                          onclick="ShopVietViews.modal.selectGalleryImage(${idx})"
                          class="quickbuy-gallery-thumb shrink-0 rounded-xl overflow-hidden transition cursor-pointer bg-[#090B10] ${idx === 0 ? 'border-2 border-[#0071E3] dark:border-[#3B9EFF] ring-2 ring-[#0071E3]/25' : 'border border-slate-700/80 opacity-75 hover:opacity-100'}"
                          title="${escapeHTML(img.label || '')}"
                        >
                          <img src="${escapeHTML(img.url || '')}" alt="${escapeHTML(img.label || '')}" class="w-16 h-11 object-cover block" />
                        </button>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${currentProduct.demoUrl ? `
                  <!-- LIVE DEMO LAUNCHER -->
                  <div class="p-3.5 rounded-2xl bg-[#090B10] border border-[#0071E3]/35 flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <div class="text-xs font-bold text-white flex items-center gap-2 flex-wrap">
                        <span>${isMetropolis ? '🏙️ Bản Chơi Thử Isometric 3D Live' : '🎮 Bản Chơi Thử Live 60fps'}</span>
                        <span class="text-[10px] font-semibold text-[#3B9EFF]">Miễn phí test</span>
                      </div>
                      <div class="text-[11px] text-slate-400 mt-0.5 truncate">
                        ${isMetropolis ? 'Xây dựng Oakwood, Cutaway X-Ray [X], chuyển Ngày/Đêm & kinh tế R/C/I' : 'Trải nghiệm trực tiếp trên trình duyệt trước khi mở khóa'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onclick="ShopVietViews.modal.openGameDemo('${escapeHTML(currentProduct.demoUrl)}', '${escapeHTML(currentProduct.id)}')"
                      class="px-3.5 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0062C4] text-white text-xs font-bold transition active:scale-95 whitespace-nowrap cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <span>Mở Live Demo</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                ` : ''}

                <!-- MÔ TẢ & ĐỐI CHIẾU -->
                <div class="p-4 rounded-2xl bg-white/80 dark:bg-[#090B10]/85 border border-slate-200/80 dark:border-slate-800/80 space-y-3 text-xs">
                  <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                    ${escapeHTML(currentProduct.desc || 'Bộ tài nguyên & mã nguồn chuẩn hóa. Mở khóa một lần để tải file trực tiếp trên web.')}
                  </p>

                  ${currentProduct.beforeAfter ? `
                    <div class="pt-2.5 border-t border-slate-200/70 dark:border-slate-800 space-y-2">
                      <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <span>⚖️ Hiệu quả trước &amp; sau</span>
                      </span>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div class="p-2.5 rounded-xl bg-rose-500/[0.06] dark:bg-rose-950/25 border border-rose-500/20 space-y-1">
                          <div class="font-bold text-rose-700 dark:text-rose-400">Chưa có bộ công cụ</div>
                          <p class="text-[10.5px] leading-relaxed text-slate-600 dark:text-slate-400">
                            ${escapeHTML(currentProduct.beforeAfter.before.summary)}
                          </p>
                        </div>
                        <div class="p-2.5 rounded-xl bg-[#0071E3]/[0.06] dark:bg-[#3B9EFF]/10 border border-[#0071E3]/25 space-y-1">
                          <div class="font-bold text-[#0071E3] dark:text-[#3B9EFF]">Sau khi sở hữu gói</div>
                          <p class="text-[10.5px] leading-relaxed text-slate-700 dark:text-slate-300">
                            ${escapeHTML(currentProduct.beforeAfter.after.summary)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ` : ''}

                  <div class="pt-2.5 border-t border-slate-200/70 dark:border-slate-800 space-y-1.5">
                    <span class="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span class="text-[#0071E3] dark:text-[#3B9EFF]">⚡</span>
                      <span>${isSourceStarter ? 'Bao gồm trong gói Source Starter:' : 'Đặc quyền sở hữu Hộp Công Cụ:'}</span>
                    </span>
                    <ul class="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 pl-4 list-disc">
                      ${isSourceStarter ? `
                        <li><strong>Toàn bộ Source Code sạch (.zip)</strong> giải nén chạy ngay, tự do chỉnh sửa và phát triển tiếp</li>
                        <li><strong>Master Prompt Kiến Trúc + Cheat Sheet</strong> để AI (Cursor/Claude) hiểu codebase và viết tiếp feature mới</li>
                        <li>Sở hữu vĩnh viễn không giới hạn dự án cá nhân hoặc thương mại</li>
                      ` : `
                        <li><strong>1-Click Copy Master Prompt</strong> chuẩn System Instructions</li>
                        <li><strong>Kèm danh mục câu lệnh Cheat Sheet</strong> có sẵn biến thay thế</li>
                        <li>Sử dụng trực tiếp trên <strong>ChatGPT, Claude, Gemini, Cursor AI</strong></li>
                      `}
                    </ul>
                  </div>
                </div>

                <!-- HÌNH THỨC CẤP PHÉP -->
                <div class="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-[#090B10]/85 border border-slate-200/80 dark:border-slate-800/80">
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Hình thức cấp phép:</span>
                  <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>${isSourceStarter ? 'Mã nguồn mở khóa vĩnh viễn (.zip)' : 'Bản quyền vĩnh viễn (1-Click Copy)'}</span>
                  </span>
                </div>

                <!-- VÍ XU -->
                <div id="modalWalletSection">
                  ${!currentUser ? `
                    <div class="p-4 rounded-2xl bg-[#0071E3]/[0.06] dark:bg-[#3B9EFF]/10 border border-[#0071E3]/25 space-y-2.5">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-900 dark:text-white">Bạn chưa đăng nhập Ví Xu</span>
                        <span class="text-[10px] text-slate-500 dark:text-slate-400">Bùi Thái Studio ID</span>
                      </div>
                      <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Đăng nhập tài khoản để quản lý số dư Ví Xu và mở khóa mã nguồn trực tiếp trên trang.
                      </p>
                      <button
                        type="button"
                        onclick="ShopVietViews.modal.goToAuth()"
                        class="w-full py-2.5 px-3 rounded-xl bg-[#0071E3] hover:bg-[#0062C4] text-white font-bold text-xs transition cursor-pointer"
                      >
                        Đăng Nhập / Tạo Tài Khoản Ví Xu
                      </button>
                    </div>
                  ` : isSufficient ? `
                    <div class="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300">Ví Xu của bạn (${escapeHTML(currentUser.name || 'Khách hàng')}):</span>
                        </div>
                        <span class="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
                          ${formatMoney(userBalance)} Xu
                        </span>
                      </div>
                      <p class="text-[11px] text-emerald-700 dark:text-emerald-400">
                        ✓ Đủ số dư! Sau khi mở khóa ví còn <strong class="font-mono tabular-nums">${formatMoney(userBalance - totalXu)} Xu</strong>.
                      </p>
                    </div>
                  ` : `
                    <div class="p-3.5 rounded-2xl bg-slate-100/90 dark:bg-[#090B10] border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-800 dark:text-slate-200">Ví Xu hiện tại:</span>
                        <span class="text-sm font-extrabold text-[#0071E3] dark:text-[#3B9EFF] font-mono tabular-nums">
                          ${formatMoney(userBalance)} Xu
                        </span>
                      </div>
                      <p class="text-[11px] text-slate-600 dark:text-slate-400">
                        Cần nạp thêm <strong class="text-rose-600 dark:text-rose-400 font-mono font-bold tabular-nums">${formatMoney(totalXu - userBalance)} Xu</strong> để mở khóa gói này.
                      </p>
                    </div>
                  `}
                </div>
              </div>

              <!-- PANE 2: GUIDE -->
              <div id="quickBuyPaneGuide" class="space-y-4 hidden">
                ${renderModalGuidePaneHTML(currentProduct, totalXu, userBalance, isSufficient, currentUser)}
              </div>

            </div>

            <!-- FOOTER MODAL -->
            <div class="px-5 py-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#090B10]/90 space-y-2.5 shrink-0">
              ${!currentUser ? `
                <button
                  type="button"
                  onclick="ShopVietViews.modal.goToAuth()"
                  class="w-full py-3.5 px-4 rounded-2xl bg-[#0071E3] hover:bg-[#0062C4] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <span>Đăng Nhập Ví Xu Để Mở Khóa</span>
                </button>
              ` : isAlreadyUnlocked ? `
                <button
                  type="button"
                  onclick="ShopVietViews.modal.openUnlockedDirectly('${escapeHTML(currentProduct.id)}')"
                  class="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 transition-all active:scale-98 cursor-pointer"
                >
                  <span>✓</span>
                  <span>Đã Mở Khóa · Bấm Tải Code &amp; Xem Chi Tiết</span>
                </button>
              ` : isSufficient ? `
                <button
                  type="button"
                  onclick="ShopVietViews.modal.showPurchaseConfirmDialog()"
                  class="w-full py-3.5 px-4 rounded-2xl bg-[#0071E3] hover:bg-[#0062C4] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 transition-all active:scale-98 cursor-pointer tabular-nums"
                >
                  <span>🪙</span>
                  <span>Mua Bằng Xu (-${formatMoney(totalXu)} Xu) · Mở Khóa Ngay</span>
                </button>
              ` : `
                <button
                  type="button"
                  onclick="ShopVietViews.modal.openDepositForShortage(${totalXu - userBalance})"
                  class="w-full py-3.5 px-4 rounded-2xl bg-[#0071E3] hover:bg-[#0062C4] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-98 cursor-pointer tabular-nums"
                >
                  <span>⚡ Nạp ${formatMoney(totalXu - userBalance)} Xu Qua VietQR MBBank</span>
                </button>
              `}

              <div class="text-center text-[11px] text-slate-500 dark:text-slate-400">
                Bằng việc mở khóa, bạn đồng ý với
                <button type="button" onclick="ShopVietViews.modal.openPolicy('terms')" class="underline text-[#0071E3] dark:text-[#3B9EFF] hover:opacity-80 font-medium cursor-pointer">Điều khoản dịch vụ</button>
                và
                <button type="button" onclick="ShopVietViews.modal.openPolicy('refund')" class="underline text-emerald-600 dark:text-emerald-400 font-semibold hover:opacity-80 cursor-pointer">Chính sách hoàn tiền 100%</button>.
              </div>
            </div>

          </div>
        </div>
      `;

      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('keydown', handleKeyDown);
      }
    },

    goToAuth: function () {
      this.close();
      if (window.ShopVietState && typeof window.ShopVietState.navigate === 'function') {
        window.ShopVietState.navigate('auth');
      }
    },

    // Hien thi Pop-up Xac Nhan Tru Xu truoc khi mua (Chong bam nhieu lan)
    showPurchaseConfirmDialog: function () {
      if (window.ShopVietState && typeof window.ShopVietState.reloadUserStateFromLocalStorage === 'function') {
        window.ShopVietState.reloadUserStateFromLocalStorage();
      }
      if (!currentProduct) return;
      const currentUser = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user) || null;
      if (!currentUser) {
        this.goToAuth();
        return;
      }

      // Kiem tra neu da mua va con han 24h
      const activeOrder = getExistingActiveOrder(currentProduct.id, currentUser.email);
      if (activeOrder) {
        this.renderUnlockedSkillView(activeOrder);
        return;
      }

      // ==================== BẢO VỆ CHỐNG SỬA TIỀN QUA F12 DEVTOOLS ====================
      if (window.ShopVietState && typeof window.ShopVietState.verifyUserWallet === 'function') {
        const isLegit = window.ShopVietState.verifyUserWallet(currentUser);
        if (!isLegit) {
          this.closeConfirmDialog();
          if (window.ShopVietState.showToast) {
            window.ShopVietState.showToast('Cảnh báo bảo mật: Dữ liệu số dư ví không hợp lệ! Vui lòng nạp tiền chính quy.', 'error');
          }
          return;
        }
      }

      const totalAmount = currentProduct.price * currentQty;
      const balance = typeof currentUser.balance === 'number' ? currentUser.balance : 0;

      if (balance < totalAmount) {
        if (window.ShopVietState) {
          window.ShopVietState.showToast(`Số dư ví (${formatMoney(balance)} Xu) không đủ! Vui lòng nạp thêm.`, 'warning');
        }
        this.openDepositForShortage(totalAmount - balance);
        return;
      }

      this.closeConfirmDialog();

      const dialogEl = document.createElement('div');
      dialogEl.id = 'confirmPurchaseOverlay';
      dialogEl.className = 'fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 transition-opacity animate-fade-in';
      dialogEl.onclick = function (e) {
        if (e.target === dialogEl) ShopVietViews.modal.closeConfirmDialog();
      };

      dialogEl.innerHTML = `
        <div class="max-w-md w-full bg-white/92 dark:bg-[#0B0F17]/92 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transform transition-all animate-slide-up p-5 sm:p-6 text-center space-y-4" onclick="event.stopPropagation()">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-[#0071E3]/10 dark:bg-[#3B9EFF]/15 text-[#0071E3] dark:text-[#3B9EFF] border border-[#0071E3]/20 flex items-center justify-center text-3xl">
            🪙
          </div>

          <div>
            <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Xác Nhận Mở Khóa Sản Phẩm
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Kiểm tra chi tiết trước khi xác nhận trừ Xu từ ví của bạn
            </p>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 text-left space-y-2 text-xs">
            <div class="flex items-center justify-between gap-2">
              <span class="text-slate-500 dark:text-slate-400">Gói mở khóa:</span>
              <strong class="text-slate-900 dark:text-white font-bold truncate max-w-[210px]">${escapeHTML(currentProduct.name)}</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500 dark:text-slate-400">Giá thanh toán:</span>
              <strong class="text-[#0071E3] dark:text-[#3B9EFF] font-extrabold text-sm font-mono tabular-nums">-${formatMoney(totalAmount)} Xu</strong>
            </div>
            <div class="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800 pt-2">
              <span class="text-slate-500 dark:text-slate-400">Số dư ví hiện tại:</span>
              <span class="font-mono text-slate-700 dark:text-slate-300 font-semibold tabular-nums">${formatMoney(balance)} Xu</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500 dark:text-slate-400">Số dư sau khi mua:</span>
              <strong class="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold tabular-nums">${formatMoney(balance - totalAmount)} Xu</strong>
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-[#0071E3]/[0.06] dark:bg-[#3B9EFF]/10 text-slate-700 dark:text-slate-200 text-[11px] text-left leading-relaxed flex items-center gap-2 border border-[#0071E3]/20">
            <span class="text-sm shrink-0 text-[#0071E3] dark:text-[#3B9EFF]">⚡</span>
            <span>Mở khóa tức thì &amp; sở hữu vĩnh viễn trọn đời. Cam kết <button type="button" onclick="ShopVietViews.modal.openPolicy('refund')" class="underline font-bold text-[#0071E3] dark:text-[#3B9EFF] cursor-pointer">Hoàn tiền 100%</button> trong 24h nếu gặp lỗi kỹ thuật.</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onclick="ShopVietViews.modal.closeConfirmDialog()"
              class="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              id="btnConfirmExecutePurchase"
              type="button"
              onclick="ShopVietViews.modal.executePurchase()"
              class="py-3 px-4 rounded-xl bg-[#0071E3] hover:bg-[#0062C4] text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>⚡ Xác Nhận Mua</span>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(dialogEl);
    },

    closeConfirmDialog: function () {
      const el = document.getElementById('confirmPurchaseOverlay');
      if (el) el.remove();
    },

    payDirectlyWithWallet: function () {
      this.showPurchaseConfirmDialog();
    },

    // Thuc thi tru Xu doc quyen (Co khoa chong spam click)
    executePurchase: function () {
      if (isPurchasing) return;
      if (!currentProduct) return;
      try {

      const currentUser = window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user;
      if (!currentUser || !currentUser.isLoggedIn) {
        this.closeConfirmDialog();
        this.close();
        if (window.ShopVietState) {
          if (typeof window.ShopVietState.showToast === 'function') {
            window.ShopVietState.showToast('Vui lòng đăng nhập tài khoản để mở khóa kỹ năng AI này!', 'info');
          }
          if (typeof window.ShopVietState.navigate === 'function') {
            window.ShopVietState.navigate('login');
          }
        }
        return;
      }

      // Kiem tra phong ngua neu da so huu
      const activeOrder = getExistingActiveOrder(currentProduct.id, currentUser.email);
      if (activeOrder) {
        this.closeConfirmDialog();
        this.renderUnlockedSkillView(activeOrder);
        return;
      }

      // ==================== BẢO VỆ CHỐNG SỬA TIỀN QUA F12 DEVTOOLS ====================
      if (window.ShopVietState && typeof window.ShopVietState.verifyUserWallet === 'function') {
        const isLegit = window.ShopVietState.verifyUserWallet(currentUser);
        if (!isLegit) {
          this.closeConfirmDialog();
          if (window.ShopVietState.showToast) {
            window.ShopVietState.showToast('Cảnh báo bảo mật: Dữ liệu số dư ví không hợp lệ! Vui lòng nạp tiền chính quy.', 'error');
          }
          return;
        }
      }

      const totalAmount = currentProduct.price * currentQty;
      const balance = typeof currentUser.balance === 'number' ? currentUser.balance : 0;

      if (balance < totalAmount) {
        this.closeConfirmDialog();
        if (window.ShopVietState) {
          window.ShopVietState.showToast(`Số dư ví (${formatMoney(balance)} Xu) không đủ! Vui lòng nạp thêm.`, 'warning');
        }
        this.openDepositForShortage(totalAmount - balance);
        return;
      }

      // KHOA NUT NGAY LAP TUC - Chon Spam Click / Double Click
      isPurchasing = true;
      const btn = document.getElementById('btnConfirmExecutePurchase');
      if (btn) {
        btn.disabled = true;
        btn.classList.add('opacity-75', 'cursor-not-allowed');
        btn.innerHTML = `<span class="inline-block animate-spin mr-1">⏳</span> Đang mở khóa...`;
      }

      // 1. Tạo mã đơn hàng chuẩn #DJ2026xxxx
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let suffix = '';
      for (let i = 0; i < 4; i++) suffix += chars.charAt(Math.floor(Math.random() * chars.length));
      const orderCode = `#DJ2026${suffix}`;

      // 2. Trừ số dư Xu trong ví NGUYÊN TỬ (Atomic) & BẮN BROADCAST TOÀN BỘ CÁC TAB KHÁC
      let deductRes = null;
      let newBalance = Math.max(0, balance - totalAmount);
      if (window.ShopVietState && typeof window.ShopVietState.deductUserCoins === 'function') {
        deductRes = window.ShopVietState.deductUserCoins(currentUser.email, totalAmount, {
          orderCode: orderCode,
          productId: currentProduct.id,
          productName: currentProduct.name
        });
        if (deductRes && typeof deductRes.newBalance === 'number') {
          newBalance = deductRes.newBalance;
        }
      } else {
        const newBalance = Math.max(0, balance - totalAmount);
        currentUser.balance = newBalance;
        if (window.ShopVietState) {
          window.ShopVietState.updateUserBalance(currentUser.email, newBalance);
        }
        deductRes = { success: true, newBalance: newBalance };
      }

      if (!deductRes || !deductRes.success) {
        isPurchasing = false;
        this.closeConfirmDialog();
        if (window.ShopVietState) {
          window.ShopVietState.showToast('Giao dịch thất bại: Số dư ví không đủ hoặc ví đang được giao dịch ở tab khác!', 'error');
        }
        return;
      }

      // 3. Khởi tạo đối tượng đơn hàng đã hoàn tất & mở khóa
      const payload = currentProduct.unlockedPayload || {
        fileName: (currentProduct.id || 'prompt') + '.md',
        masterPrompt: currentProduct.masterPrompt || currentProduct.desc || '# Kỹ Năng Tác Chiến',
        skillContent: currentProduct.masterPrompt || currentProduct.desc || '# Kỹ Năng Tác Chiến',
        cheatSheet: currentProduct.cheatSheet || [],
        installCommand: 'echo "Cài đặt thành công"',
        scripts: []
      };
      if (!payload.skillContent) payload.skillContent = payload.masterPrompt || currentProduct.desc || '# Kỹ Năng Tác Chiến';
      if (!payload.masterPrompt) payload.masterPrompt = payload.skillContent || currentProduct.desc || '# Kỹ Năng Tác Chiến';

      const order = {
        id: orderCode,
        orderCode: orderCode,
        rawCode: `DJ2026${suffix}`,
        productId: currentProduct.id,
        productName: currentProduct.name,
        price: currentProduct.price,
        quantity: currentQty,
        amount: totalAmount,
        status: 'completed',
        statusText: 'Hoàn tất (Đã mở khóa)',
        paymentMethod: 'Ví Xu Bùi Thái Studio',
        userEmail: currentUser.email,
        createdAt: new Date().toISOString(),
        createdAtFormatted: new Date().toLocaleDateString('vi-VN'),
        date: new Date().toLocaleDateString('vi-VN'),
        unlockedAt: new Date().toISOString(),
        expiresAt: null,
        unlockedPayload: payload
      };

      lastUnlockedOrder = order;

      // 4. Lưu đơn hàng vào State toàn cục
      if (window.ShopVietState && window.ShopVietState.state) {
        window.ShopVietState.state.orders = window.ShopVietState.state.orders || [];
        window.ShopVietState.state.orders.unshift(order);
        window.ShopVietState.save();
        try {
          localStorage.setItem('shopviet_orders', JSON.stringify(window.ShopVietState.state.orders));
        } catch (e) {}
        if (typeof window.ShopVietState.notify === 'function') {
          window.ShopVietState.notify('order_created', order);
          window.ShopVietState.notify('orders_updated', window.ShopVietState.state.orders);
        }
        if (typeof window.ShopVietState.pushAllToCloud === 'function') {
          window.ShopVietState.pushAllToCloud().catch(console.warn);
        }
      }

      // 4b. Đồng bộ trực tiếp lên Cloud Firestore (Đảm bảo xuất hiện tức thì trên mọi thiết bị / tên miền)
      if (window.ShopVietFirebase && typeof window.ShopVietFirebase.syncOrderToCloud === 'function') {
        window.ShopVietFirebase.syncOrderToCloud(order).catch(console.warn);
      }

      // 5. Gửi thông báo ntfy
      if (window.ShopVietNtfy && typeof window.ShopVietNtfy.send === 'function') {
        window.ShopVietNtfy.send(`Khách mua kỹ năng: ${currentProduct.name}`, `Đã trừ ${formatMoney(totalAmount)} Xu của ${currentUser.name} (${currentUser.email}). Mở khóa trực tiếp!`);
      }

      this.closeConfirmDialog();

      // 6. HIEN THI POP-UP THONG BAO MO KHOA THANH CONG TUC THI
      const successOverlay = document.createElement('div');
      successOverlay.id = 'purchaseSuccessOverlay';
      successOverlay.className = 'fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 transition-opacity animate-fade-in';
      
      successOverlay.innerHTML = `
        <div class="max-w-md w-full bg-white/92 dark:bg-[#0B0F17]/92 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-500/35 p-6 text-center space-y-4 animate-scale-up" onclick="event.stopPropagation()">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center justify-center text-3xl">
            🎉
          </div>
          <div>
            <div class="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              Giao dịch thành công · Đã niêm phong
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">
              Đã Mở Khóa Thành Công!
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
              Đơn hàng <strong class="text-[#0071E3] dark:text-[#3B9EFF] font-mono">${escapeHTML(order.orderCode)}</strong> đã kích hoạt · Đã trừ ${formatMoney(totalAmount)} Xu.
            </p>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 text-xs text-left space-y-1.5">
            <div class="flex items-center justify-between gap-2">
              <span class="text-slate-500 dark:text-slate-400">Sản phẩm:</span>
              <strong class="text-slate-900 dark:text-white font-semibold truncate max-w-[200px]">${escapeHTML(order.productName)}</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500 dark:text-slate-400">Số dư ví còn lại:</span>
              <strong class="font-mono text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">${formatMoney(newBalance)} Xu</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500 dark:text-slate-400">Thời hạn mở khóa:</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-semibold">Sở hữu vĩnh viễn · Trọn đời</span>
            </div>
          </div>

          <button
            type="button"
            onclick="ShopVietViews.modal.finishSuccessCelebration()"
            class="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🚀 Mở Kho Tải Code &amp; Sao Chép Prompt Ngay</span>
          </button>
        </div>
      `;

        document.body.appendChild(successOverlay);
      } catch (err) { 
        console.error("[executePurchase] Lỗi thanh toán:", err);
        isPurchasing = false;
        const btn = document.getElementById("btnConfirmExecutePurchase");
        if (btn) {
          btn.disabled = false;
          btn.classList.remove("opacity-75", "cursor-not-allowed");
          btn.innerHTML = "Xác Nhận Mở Khóa";
        }
        if (window.ShopVietState && typeof window.ShopVietState.showToast === "function") {
          window.ShopVietState.showToast("Giao dịch gặp lỗi kỹ thuật: " + (err && err.message ? err.message : "Vui lòng thử lại"), "error");
        }
      }
    },

    finishSuccessCelebration: function () {
      const el = document.getElementById('purchaseSuccessOverlay');
      if (el) el.remove();
      this.closeConfirmDialog();
      isPurchasing = false;
      if (lastUnlockedOrder) {
        this.renderUnlockedSkillView(lastUnlockedOrder);
      }
    },

    openUnlockedDirectly: function (productId) {
      const currentUser = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user) || null;
      const activeOrder = getExistingActiveOrder(productId, currentUser ? currentUser.email : '');
      if (activeOrder) {
        this.renderUnlockedSkillView(activeOrder);
      } else {
        this.open(productId);
      }
    },

    // ==========================================
    // TÍNH NĂNG NẠP XU VÀO VÍ TECHCOMBANK 0986019623
    // BẮN NTFY TỨC THÌ ĐỂ BÙI THÁI MỞ DUYỆT
    // ==========================================
    openDepositModal: async function (initialAmount) {
      let selectedAmount = Math.max(1000, Math.round((Number(initialAmount) || 9000) / 1000) * 1000);
      const currentUser = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user) || null;

      // Mã nạp do SERVER cấp và gắn với email đã xác thực → SePay cộng đúng ví.
      if (!currentUser || !currentUser.isLoggedIn || !currentUser.email) {
        if (window.ShopVietState && typeof window.ShopVietState.showToast === 'function') {
          window.ShopVietState.showToast('Vui lòng đăng nhập tài khoản để nạp Xu vào ví!', 'info');
        }
        return;
      }

      // Chặn tài khoản bị cấm (Banned)
      const cleanEmail = (currentUser.email || '').trim().toLowerCase();
      if (window.ShopVietState && typeof window.ShopVietState.isUserBanned === 'function') {
        if (window.ShopVietState.isUserBanned(cleanEmail)) {
          alert('🚫 TÀI KHOẢN ĐÃ BỊ KHÓA: Bạn không thể nạp Xu do vi phạm chính sách hệ thống!');
          if (typeof window.ShopVietState.logout === 'function') {
            window.ShopVietState.logout();
          }
          return;
        }
      }

      const idToken = await getFirebaseIdToken();
      if (!idToken) {
        if (window.ShopVietState && typeof window.ShopVietState.showToast === 'function') {
          window.ShopVietState.showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để nạp Xu!', 'warning');
        }
        return;
      }

      const intent = await requestDepositIntent(idToken, selectedAmount, currentUser.name);
      if (!intent) {
        if (window.ShopVietState && typeof window.ShopVietState.showToast === 'function') {
          window.ShopVietState.showToast('Không tạo được mã nạp Xu (' + (lastTopupError || 'lỗi máy chủ') + '). Vui lòng thử lại sau ít giây!', 'error');
        }
        return;
      }

      const memo = intent.memo;
      selectedAmount = Number(intent.amount) || selectedAmount;
      const cooldownRemaining = 0;

      function buildQrUrl(amt) {
        return `https://qr.sepay.vn/img?acc=0986019623&bank=MBBank&amount=${amt}&des=${encodeURIComponent(memo)}&template=compact`;
      }

      const modalMount = document.getElementById('modalMount');
      if (!modalMount) return;

      modalMount.innerHTML = `
        <div
          id="depositBackdrop"
          class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 transition-opacity animate-fade-in"
          onclick="if(event.target === this) ShopVietViews.modal.close()"
        >
          <div
            class="max-w-lg w-full bg-white/92 dark:bg-[#0B0F17]/92 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transform transition-all animate-slide-up flex flex-col max-h-[94vh]"
            onclick="event.stopPropagation()"
          >
            <!-- HEADER NẠP XU -->
            <div class="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/70 dark:bg-[#090B10]/80">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="w-9 h-9 rounded-2xl bg-[#0071E3]/10 dark:bg-[#3B9EFF]/15 text-[#0071E3] dark:text-[#3B9EFF] border border-[#0071E3]/20 flex items-center justify-center text-lg font-bold shrink-0">
                  ⚡
                </span>
                <div class="min-w-0">
                  <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                    <span>Nạp Xu Vào Ví Tự Động</span>
                    <span class="text-[11px] font-semibold text-[#0071E3] dark:text-[#3B9EFF] tabular-nums">· 1 VNĐ = 1 Xu</span>
                  </h3>
                  <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Cổng SePay Tự Động 24/7 · Cộng Xu tức thì 2-5s</span>
                  </p>
                </div>
              </div>
              <button type="button" onclick="ShopVietViews.modal.close()" class="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <!-- BODY NẠP XU -->
            <div class="p-4 sm:p-5 space-y-4 overflow-y-auto text-center flex-1">

              <div class="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-slate-800 dark:text-slate-200 text-xs text-left leading-relaxed flex items-start gap-2.5">
                <span class="text-base shrink-0 text-emerald-600 dark:text-emerald-400">⚡</span>
                <div>
                  <strong class="text-emerald-700 dark:text-emerald-300">Cổng Nạp SePay Tự Động 24/7:</strong>
                  Quét mã QR hoặc chuyển khoản đúng nội dung <span class="font-mono font-bold text-[#0071E3] dark:text-[#3B9EFF] bg-[#0071E3]/10 px-1.5 py-0.5 rounded">${escapeHTML(memo)}</span>. Hệ thống tự động khớp lệnh và cộng Xu sau 2-5 giây.
                </div>
              </div>

              <!-- CHỌN NHANH SỐ TIỀN NẠP -->
              <div class="space-y-1.5 text-left">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Chọn số Xu muốn nạp:</span>
                  <span class="text-[11px] text-[#0071E3] dark:text-[#3B9EFF] font-medium">Cập nhật mã QR tự động</span>
                </div>
                <div class="grid grid-cols-3 gap-2 tabular-nums" id="depositQuickGrid">
                  <button type="button" onclick="ShopVietViews.modal.setDepositAmount(9000)" class="deposit-chip-btn py-2 px-1 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${selectedAmount === 9000 ? 'border-[#0071E3] dark:border-[#3B9EFF] bg-[#0071E3]/10 text-[#0071E3] dark:text-[#3B9EFF]' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}">
                    9.000 Xu <span class="block text-[9px] font-semibold text-emerald-600">Gói Khởi Đầu</span>
                  </button>
                  <button type="button" onclick="ShopVietViews.modal.setDepositAmount(15000)" class="deposit-chip-btn py-2 px-1 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${selectedAmount === 15000 ? 'border-[#0071E3] dark:border-[#3B9EFF] bg-[#0071E3]/10 text-[#0071E3] dark:text-[#3B9EFF]' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}">
                    15.000 Xu <span class="block text-[9px] font-semibold text-[#0071E3] dark:text-[#3B9EFF]">Source Starter</span>
                  </button>
                  <button type="button" onclick="ShopVietViews.modal.setDepositAmount(27000)" class="deposit-chip-btn py-2 px-1 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${selectedAmount === 27000 ? 'border-[#0071E3] dark:border-[#3B9EFF] bg-[#0071E3]/10 text-[#0071E3] dark:text-[#3B9EFF]' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}">
                    27.000 Xu <span class="block text-[9px] font-semibold text-slate-500 dark:text-slate-400">Gói 3 Hộp</span>
                  </button>
                  <button type="button" onclick="ShopVietViews.modal.setDepositAmount(45000)" class="deposit-chip-btn py-2 px-1 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${selectedAmount === 45000 ? 'border-[#0071E3] dark:border-[#3B9EFF] bg-[#0071E3]/10 text-[#0071E3] dark:text-[#3B9EFF]' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}">
                    45.000 Xu <span class="block text-[9px] font-semibold text-slate-500 dark:text-slate-400">Gói 5 Hộp</span>
                  </button>
                  <button type="button" onclick="ShopVietViews.modal.setDepositAmount(69000)" class="deposit-chip-btn py-2 px-1 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${selectedAmount === 69000 ? 'border-[#0071E3] dark:border-[#3B9EFF] bg-[#0071E3]/10 text-[#0071E3] dark:text-[#3B9EFF]' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}">
                    69.000 Xu <span class="block text-[9px] font-normal text-slate-400">Combo Đa Năng</span>
                  </button>
                  <button type="button" onclick="ShopVietViews.modal.setDepositAmount(99000)" class="deposit-chip-btn py-2 px-1 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${selectedAmount === 99000 ? 'border-[#0071E3] dark:border-[#3B9EFF] bg-[#0071E3]/10 text-[#0071E3] dark:text-[#3B9EFF]' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}">
                    99.000 Xu <span class="block text-[9px] font-normal text-slate-400">Gói Khuyên Dùng</span>
                  </button>
                  <button type="button" onclick="ShopVietViews.modal.setDepositAmount(200000)" class="deposit-chip-btn py-2 px-1 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${selectedAmount === 200000 ? 'border-[#0071E3] dark:border-[#3B9EFF] bg-[#0071E3]/10 text-[#0071E3] dark:text-[#3B9EFF]' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}">
                    200.000 Xu <span class="block text-[9px] font-normal text-slate-400">Gói Studio Pro</span>
                  </button>
                </div>
              </div>

              <!-- MÃ VIETQR MBBANK ĐỘNG -->
              <div class="p-3 bg-white rounded-2xl border border-slate-200/90 inline-block shadow-md">
                <img id="mbbankDepositQrImg" src="${buildQrUrl(selectedAmount)}" onerror="this.src='https://img.vietqr.io/image/970422-0986019623-compact2.png?amount=${Number(selectedAmount) || 9000}&addInfo=' + encodeURIComponent('${escapeHTML(memo)}') + '&accountName=BUI%20THAI';" alt="SePay VietQR MBBank 0986019623 BUI THAI" class="w-52 h-52 sm:w-56 sm:h-56 mx-auto object-contain rounded-xl" />
              </div>

              <!-- THÔNG TIN CHUYỂN KHOẢN MBBANK -->
              <div class="space-y-2.5 text-xs text-left bg-slate-50/90 dark:bg-[#090B10] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div class="flex items-center justify-between">
                  <span class="text-slate-500 dark:text-slate-400">Ngân hàng:</span>
                  <strong class="text-slate-800 dark:text-slate-200 font-semibold">MBBank (BIN: 970422)</strong>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-500 dark:text-slate-400">Số tài khoản:</span>
                  <div class="flex items-center gap-1.5">
                    <strong class="font-mono text-[#0071E3] dark:text-[#3B9EFF] font-extrabold text-sm select-all tabular-nums">0986019623</strong>
                    <button type="button" onclick="ShopVietViews.modal.copyField('0986019623', 'Số tài khoản MBBank')" class="px-2 py-0.5 rounded-md bg-[#0071E3]/10 hover:bg-[#0071E3]/20 text-[#0071E3] dark:text-[#3B9EFF] font-bold text-[10px] transition cursor-pointer">Sao chép</button>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-500 dark:text-slate-400">Chủ tài khoản:</span>
                  <strong class="text-slate-800 dark:text-slate-200 uppercase font-bold">BUI THAI</strong>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-500 dark:text-slate-400">Số tiền nạp:</span>
                  <div class="flex items-center gap-1.5">
                    <strong id="mbbankDepositAmountText" class="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-sm tabular-nums">${selectedAmount.toLocaleString('vi-VN')} VNĐ</strong>
                    <button type="button" onclick="ShopVietViews.modal.copyField('${selectedAmount}', 'Số tiền')" class="px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] transition cursor-pointer">Sao chép</button>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-500 dark:text-slate-400">Nội dung chuyển khoản:</span>
                  <div class="flex items-center gap-1.5">
                    <strong class="font-mono text-[#0071E3] dark:text-[#3B9EFF] bg-[#0071E3]/10 px-2 py-0.5 rounded-md font-bold select-all">${escapeHTML(memo)}</strong>
                    <button type="button" onclick="ShopVietViews.modal.copyField('${escapeHTML(memo)}', 'Nội dung chuyển khoản')" class="px-2 py-0.5 rounded-md bg-[#0071E3]/10 hover:bg-[#0071E3]/20 text-[#0071E3] dark:text-[#3B9EFF] font-bold text-[10px] transition cursor-pointer">Sao chép</button>
                  </div>
                </div>
              </div>

            </div>

            <!-- FOOTER NẠP XU -->
            <div class="px-5 py-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#090B10]/90 space-y-2.5 shrink-0">
              <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span class="font-semibold">SePay tự động duyệt 24/7 khi ngân hàng báo có</span>
                </div>
                <span class="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 shrink-0">Tự động 100%</span>
              </div>
              <button
                type="button"
                onclick="ShopVietViews.modal.close()"
                class="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-[#0071E3] dark:hover:bg-[#0062C4] text-white font-bold text-xs transition cursor-pointer"
              >
                Đóng Cửa Sổ (Ví tự cộng sau khi chuyển khoản)
              </button>
            </div>
          </div>
        </div>
      `;

      // Hỏi SERVER trạng thái mã nạp: chỉ khi SePay xác nhận completed mới báo thành công.
      if (window._sepayModalPollTimer) {
        clearInterval(window._sepayModalPollTimer);
        window._sepayModalPollTimer = null;
      }
      const targetEmail = String(currentUser.email || '').trim().toLowerCase();
      window._sepayModalPollTimer = setInterval(async function () {
        const modalEl = document.getElementById('depositBackdrop');
        if (!modalEl) {
          clearInterval(window._sepayModalPollTimer);
          window._sepayModalPollTimer = null;
          return;
        }
        // 1. Kiểm tra trạng thái intent từ API
        const status = await fetchDepositIntentStatus(memo);

        // 2. Kích hoạt syncTopupsFromCloud để cập nhật số dư ví thực tế từ SePay
        let isDone = (status && status.status === 'completed');
        if (!isDone && window.ShopVietState && typeof window.ShopVietState.syncTopupsFromCloud === 'function') {
          await window.ShopVietState.syncTopupsFromCloud(false).catch(() => {});
          const tList = (window.ShopVietState.state && window.ShopVietState.state.topups) || [];
          isDone = tList.some(t => t && t.status === 'completed' && (String(t.memo || '').includes(memo) || String(t.id || '').includes(memo)));
        }

        if (!isDone) return;

        clearInterval(window._sepayModalPollTimer);
        window._sepayModalPollTimer = null;

        // 3. Cưỡng chế cập nhật số dư ví tức thì
        if (window.ShopVietState && typeof window.ShopVietState.syncTopupsFromCloud === 'function') {
          await window.ShopVietState.syncTopupsFromCloud(true).catch(() => {});
        }

        if (window.BuiThaiNtfy && typeof window.BuiThaiNtfy.playChime === 'function') {
          window.BuiThaiNtfy.playChime('deposit');
        }
        if (window.ShopVietState && window.ShopVietState.showToast) {
          const credAmt = Number(status && status.amount) || selectedAmount;
          window.ShopVietState.showToast(`🎉 Nạp xu thành công! SePay đã xác nhận và cộng +${credAmt.toLocaleString('vi-VN')} Xu vào ví.`, 'success');
        }
        ShopVietViews.modal.close();
        if (window.ShopVietState && window.ShopVietState.renderCurrentRoute) {
          window.ShopVietState.renderCurrentRoute(true);
        }
      }, 3000);

      if (cooldownRemaining > 0) {
        let sec = cooldownRemaining;
        const intervalId = setInterval(function () {
          sec--;
          const txt = document.getElementById('txtDepositCooldown');
          const btn = document.getElementById('btnConfirmDepositSent');
          if (!btn) { clearInterval(intervalId); return; }
          if (sec <= 0) {
            clearInterval(intervalId);
            btn.disabled = false;
            btn.className = "w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-900/20 transition active:scale-98 cursor-pointer flex items-center justify-center gap-2";
            btn.onclick = function () { ShopVietViews.modal.confirmDepositSent(selectedAmount, memo); };
            btn.innerHTML = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg><span>TÔI ĐÃ CHUYỂN KHOẢN • BẮN THÔNG BÁO CHO BÙI THÁI DUYỆT</span>`;
          } else if (txt) {
            txt.textContent = `VUI LÒNG ĐỢI (${sec}s) ĐỂ GỬI TIẾP`;
          }
        }, 1000);
      }
    },

    setDepositAmount: function (newAmount) {
      this.openDepositModal(newAmount);
    },

    openDepositForShortage: function (shortageAmount) {
      this.openDepositModal(shortageAmount);
    },

    confirmDepositSent: async function () {
      if (window.ShopVietState && typeof window.ShopVietState.syncTopupsFromCloud === 'function') {
        window.ShopVietState.showToast('⏳ Đang đồng bộ số dư từ SePay...', 'info');
        await window.ShopVietState.syncTopupsFromCloud(true).catch(() => {});
      }
      this.close();
    },

    approveTopupDemo: function (topupId, amount) {
      const currentUser = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user) || { name: 'Bùi Thái', email: 'thaitraicau123@gmail.com' };
      const currentBal = typeof currentUser.balance === 'number' ? currentUser.balance : 0;
      const newBal = currentBal + amount;
      currentUser.balance = newBal;
      if (window.ShopVietState) {
        window.ShopVietState.updateUserBalance(currentUser.email, newBal);
        window.ShopVietState.showToast(`⚡ [Demo] Đã cộng thành công +${formatMoney(amount)} Xu vào ví! Số dư mới: ${formatMoney(newBal)} Xu.`, 'success');
      }
      if (currentProduct) {
        this.open(currentProduct.id);
      } else {
        this.close();
      }
    },

    // GIAO DIỆN MỞ KHÓA BẢN QUYỀN KỸ NĂNG TRỰC TIẾP TRÊN WEB (KHÔNG QUA LINK TRUNG GIAN)
    renderUnlockedSkillView: function (order) {
      const modalMount = document.getElementById('modalMount');
      if (!modalMount) return;

      const prod = this.getProductById(order.productId) || (window.ShopVietData && typeof window.ShopVietData.getProductById === 'function' ? window.ShopVietData.getProductById(order.productId) : null) || {};
      const payload = (order.unlockedPayload && Object.keys(order.unlockedPayload).length > 0) ? order.unlockedPayload : (prod.unlockedPayload || {});
      const cheatSheet = (payload.cheatSheet && payload.cheatSheet.length > 0) ? payload.cheatSheet : (prod.cheatSheet || []);
      const masterPromptText = payload.masterPrompt || payload.skillContent || prod.masterPrompt || (prod.unlockedPayload && (prod.unlockedPayload.masterPrompt || prod.unlockedPayload.skillContent)) || '';

      const prodId = String(order.productId || prod.id || '');
      const isAllInOne = prodId === 'skill-combo-allinone';
      const isOpenJarvis = prodId === 'skill-openjarvis-local-ai';
      const demoTargetUrl = prod.demoUrl || payload.demoUrl || '';
      const isSourceStarter = !isAllInOne && !isOpenJarvis && (
        prodId.startsWith('source-') ||
        prodId.startsWith('template-') ||
        Boolean(payload.codeSnippet) ||
        Boolean(demoTargetUrl)
      );
      const isMetropolis = prodId === 'source-metropolis-1998-city-builder' || String(demoTargetUrl).includes('metropolis-1998');
      const zipHref = prod.downloadUrl || payload.downloadUrl || '';
      const zipName = prod.zipFileName || payload.zipFileName || (isMetropolis ? 'metropolis-1998-source-starter.zip' : 'pixelfx-combat-polish.zip');
      const zipSize = prod.zipFileSize || payload.zipFileSize || '';
      const docUrlRaw = String(prod.docDownloadUrl || payload.docDownloadUrl || '');
      const hasWordDoc = !isSourceStarter && (prodId === 'skill-pixel-vfx-engine' || /\.(docx?|pdf)$/i.test(docUrlRaw));

      modalMount.innerHTML = `
        <div id="unlockedSkillBackdrop" class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in" onclick="if(event.target === this) ShopVietViews.modal.close()">
          <div class="bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] animate-slide-up text-slate-900 dark:text-slate-100">
            
            <!-- HEADER MỞ KHÓA LIQUID GLASS -->
            <div class="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#090B10]/85 space-y-3 shrink-0">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-xl bg-[#0071E3]/10 dark:bg-[#3B9EFF]/15 text-[#0071E3] dark:text-[#3B9EFF] border border-[#0071E3]/25 flex items-center justify-center text-lg font-bold shrink-0">
                    ${isSourceStarter ? '📦' : '🔓'}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap text-xs">
                      <span class="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>Đã mở khóa thành công</span>
                      </span>
                      <span class="text-slate-300 dark:text-slate-700">•</span>
                      <span class="font-mono text-slate-500 dark:text-slate-400 tabular-nums">Đơn ${escapeHTML(order.id || '')}</span>
                    </div>
                    <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                      ${escapeHTML(order.productName || prod.name || 'Hộp Công Cụ Prompts Tác Chiến')}
                    </h3>
                  </div>
                </div>
                <button 
                  type="button" 
                  onclick="ShopVietViews.modal.close()" 
                  class="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                  title="Đóng (Esc)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <!-- NÚT HÀNH ĐỘNG NHANH -->
              <div class="flex items-center gap-2 flex-wrap">
                <button 
                  type="button" 
                  onclick="ShopVietViews.modal.copyMasterPrompt('${escapeHTML(prodId)}')"
                  class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0062C4] dark:bg-[#3B9EFF] dark:hover:bg-[#2A8CEB] text-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                  title="Sao chép toàn bộ Master Prompt"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  <span>Copy Master Prompt</span>
                </button>
                ${zipHref ? `
                  <a 
                    href="${escapeHTML(zipHref)}" 
                    download="${escapeHTML(zipName)}" 
                    class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition active:scale-95 cursor-pointer shadow-sm no-underline tabular-nums"
                    title="Tải gói mã nguồn (.zip)"
                  >
                    <span>📦 Tải .zip${zipSize ? ` (${escapeHTML(zipSize)})` : ''}</span>
                  </a>
                ` : ''}
                ${demoTargetUrl ? `
                  <button 
                    type="button" 
                    onclick="ShopVietViews.modal.openGameDemo('${escapeHTML(demoTargetUrl)}', '${escapeHTML(prodId)}')" 
                    class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition active:scale-95 cursor-pointer border border-slate-700/60"
                    title="Mở bản xem trước trực tiếp"
                  >
                    <span>▶ Live Demo</span>
                  </button>
                ` : ''}
                ${hasWordDoc ? `
                  <a 
                    href="${escapeHTML(docUrlRaw || 'downloads/TRON_BO_246_MASTER_PROMPTS_GAME_PIXEL_VFX_SOUND_FX.docx')}" 
                    download="${escapeHTML(prod.docFileName || payload.docFileName || 'TRON_BO_246_MASTER_PROMPTS_GAME_PIXEL_VFX_SOUND_FX.docx')}" 
                    class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 font-bold text-xs transition active:scale-95 cursor-pointer no-underline"
                    title="Tải tài liệu Word (.docx) về máy"
                  >
                    <span>📄 Tải .docx</span>
                  </a>
                ` : ''}
                <button 
                  type="button" 
                  onclick="ShopVietViews.modal.exportToNotion('${escapeHTML(prodId)}')"
                  class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition cursor-pointer"
                  title="Xuất trọn bộ sang Notion"
                >
                  <span>Xuất Notion</span>
                </button>
                <button 
                  type="button" 
                  onclick="ShopVietViews.modal.downloadCurrentSkillFile('${escapeHTML(prodId)}')"
                  class="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition cursor-pointer"
                  title="Tải file Markdown (.md) về máy"
                >
                  <span>Tải .md</span>
                </button>
              </div>
            </div>

            ${hasWordDoc ? `
              <div class="mx-5 mt-3 p-3.5 rounded-2xl bg-[#0071E3]/5 dark:bg-[#3B9EFF]/10 border border-[#0071E3]/25 dark:border-[#3B9EFF]/25 flex items-center justify-between gap-3 flex-wrap">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-xl bg-[#0071E3] text-white flex items-center justify-center text-lg shadow-sm shrink-0">
                    📄
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      <span>${escapeHTML(prod.docTitle || prod.docFileName || 'Tài Liệu Master Prompts Đi Kèm (.docx / .doc)')}</span>
                    </h4>
                    <p class="text-[11px] text-slate-600 dark:text-slate-400">
                      Tải về máy để mở trực tiếp bằng Microsoft Word, WPS hoặc Google Docs để tra cứu và sao chép nhanh.
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <a 
                    href="${escapeHTML(docUrlRaw || 'downloads/TRON_BO_246_MASTER_PROMPTS_GAME_PIXEL_VFX_SOUND_FX.docx')}" 
                    download="${escapeHTML(prod.docFileName || payload.docFileName || 'TRON_BO_246_MASTER_PROMPTS_GAME_PIXEL_VFX_SOUND_FX.docx')}" 
                    class="px-3.5 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0062C4] text-white font-bold text-xs shadow-sm active:scale-95 transition no-underline flex items-center gap-1.5"
                  >
                    <span>📥 Tải .docx</span>
                  </a>
                  <a 
                    href="downloads/TRON_BO_246_MASTER_PROMPTS_GAME_PIXEL_VFX_SOUND_FX.doc" 
                    download="TRON_BO_246_MASTER_PROMPTS_GAME_PIXEL_VFX_SOUND_FX.doc" 
                    class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-sm active:scale-95 transition no-underline flex items-center gap-1.5"
                  >
                    <span>Bản .doc</span>
                  </a>
                </div>
              </div>
            ` : ''}

            <!-- TABS ĐIỀU HƯỚNG HỘP CÔNG CỤ -->
            <div class="px-5 pt-1 flex items-center gap-1 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#090B10]/70 shrink-0 overflow-x-auto">
              <button id="skillTabBtnFile" onclick="ShopVietViews.modal.switchSkillTab('file')" class="px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 border-[#0071E3] dark:border-[#3B9EFF] text-[#0071E3] dark:text-[#3B9EFF] transition-colors cursor-pointer shrink-0">
                ${isSourceStarter ? 'Master Prompt & Source' : 'Master Prompt'}
              </button>
              <button id="skillTabBtnInstall" onclick="ShopVietViews.modal.switchSkillTab('install')" class="px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0 tabular-nums">
                Cheat Sheet (${cheatSheet.length})
              </button>
              <button id="skillTabBtnScripts" onclick="ShopVietViews.modal.switchSkillTab('scripts')" class="px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0">
                Trước &amp; Sau
              </button>
              <button id="skillTabBtnGuide" onclick="ShopVietViews.modal.switchSkillTab('guide')" class="px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0">
                ${isSourceStarter ? 'Cài Đặt & Chạy Local' : 'Hướng Dẫn Sử Dụng'}
              </button>
            </div>

            <!-- NỘI DUNG TỪNG TAB -->
            <div class="p-5 flex-1 overflow-y-auto space-y-4">
              
              <!-- TAB 1: MASTER PROMPT (1-CLICK COPY) -->
              <div id="skillTabPaneFile" class="space-y-3">
                <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>Độ dài: <strong class="font-mono text-slate-900 dark:text-slate-100 tabular-nums">${masterPromptText.length.toLocaleString('vi-VN')} ký tự</strong></span>
                  </span>
                  <button type="button" onclick="ShopVietViews.modal.copyMasterPrompt('${escapeHTML(prodId)}')" class="text-[#0071E3] dark:text-[#3B9EFF] hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    <span>Sao chép toàn bộ Prompt</span>
                  </button>
                </div>
                <div class="bg-[#090B10] text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-[420px] border border-slate-800/90 select-all leading-relaxed whitespace-pre-wrap">
${escapeHTML(masterPromptText)}
                </div>
              </div>

              <!-- TAB 2: CHEAT SHEET -->
              <div id="skillTabPaneInstall" class="space-y-3 hidden">
                <div class="flex items-center justify-between">
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    Bấm <strong>Sao chép</strong> câu lệnh phù hợp, thay phần trong ngoặc <code>[...]</code> rồi dán vào AI IDE (Cursor, Claude Code, Gemini) để mở rộng tiếp:
                  </p>
                </div>

                ${(isAllInOne || cheatSheet.length > 30) ? `
                  <!-- THANH NÚT LỌC NHANH THEO PHÂN KHU (ALL-IN-ONE VAULT) -->
                  <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold shrink-0 tabular-nums">
                    <button type="button" onclick="ShopVietViews.modal.filterCheatSheet('')" class="px-2.5 py-1 rounded-lg bg-[#0071E3] text-white shrink-0 hover:bg-[#0062C4] transition cursor-pointer">
                      Tất cả (${cheatSheet.length})
                    </button>
                    <button type="button" onclick="ShopVietViews.modal.filterCheatSheetRange(1, 20, 'Hệ Điều Hành #01-#20')" class="px-2.5 py-1 rounded-lg bg-[#0071E3]/10 text-[#0071E3] dark:text-[#3B9EFF] border border-[#0071E3]/25 shrink-0 hover:bg-[#0071E3]/20 transition cursor-pointer">
                      Hệ Điều Hành (#01-#20)
                    </button>
                    <button type="button" onclick="ShopVietViews.modal.filterCheatSheetRange(21, 131, 'Kỹ Năng Gốc #21-#131')" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
                      Kỹ Năng Studio (#21-#131)
                    </button>
                    <button type="button" onclick="ShopVietViews.modal.filterCheatSheetRange(132, 377, 'Game Pixel VFX #132-#377')" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
                      Pixel VFX (#132-#377)
                    </button>
                    <button type="button" onclick="ShopVietViews.modal.filterCheatSheetRange(378, 380, 'Đấu Sĩ 48px #378-#380')" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
                      Đấu Sĩ 48px (#378-#380)
                    </button>
                    <button type="button" onclick="ShopVietViews.modal.filterCheatSheetRange(381, 410, 'Web UI & Fullstack #381-#410')" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
                      Web &amp; Fullstack (#381-#410)
                    </button>
                    <button type="button" onclick="ShopVietViews.modal.filterCheatSheetRange(411, 440, 'SEO & Học Thuật #411-#440')" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
                      SEO &amp; Học Thuật (#411-#440)
                    </button>
                    <button type="button" onclick="ShopVietViews.modal.filterCheatSheetRange(456, 485, 'N8N & Video Phonk #456-#485')" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
                      N8N &amp; Phonk (#456-#485)
                    </button>
                    <button type="button" onclick="ShopVietViews.modal.filterCheatSheetRange(486, 530, 'Âm Thanh & AppSec #486-#530')" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
                      SFX &amp; AppSec (#486-#530)
                    </button>
                    <button type="button" onclick="ShopVietViews.modal.filterCheatSheetRange(531, 545, 'System Prompt #531-#545')" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
                      System Prompt (#531-#545)
                    </button>
                  </div>
                ` : ''}

                <!-- THANH TÌM KIẾM PROMPT -->
                <div class="relative">
                  <input 
                    type="text" 
                    id="cheatSheetSearchInput" 
                    oninput="ShopVietViews.modal.filterCheatSheet(this.value)" 
                    placeholder="🔍 Tìm nhanh trong ${cheatSheet.length} câu lệnh..." 
                    class="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50/90 dark:bg-[#090B10] border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:border-[#0071E3] dark:focus:border-[#3B9EFF] text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  />
                </div>

                <div id="cheatSheetItemsContainer" class="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                  ${cheatSheet.map((item, idx) => `
                    <div 
                      data-cheatsheet-item="true"
                      data-search-text="${escapeHTML(((item.title || '') + ' ' + (item.category || '') + ' ' + (item.template || '') + ' ' + (item.prompt || '') + ' ' + (item.example || '')).toLowerCase())}"
                      class="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#090B10]/90 border border-slate-200/80 dark:border-slate-800/80 space-y-2"
                    >
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 min-w-0">
                          <span class="w-6 h-6 rounded-lg bg-[#0071E3]/10 dark:bg-[#3B9EFF]/15 text-[#0071E3] dark:text-[#3B9EFF] flex items-center justify-center text-[11px] font-mono font-bold tabular-nums shrink-0">${idx + 1}</span>
                          <span class="truncate">${escapeHTML(item.title)}</span>
                        </span>
                        <button 
                          type="button" 
                          onclick="ShopVietViews.modal.copyCheatSheetCommand('${escapeHTML(prodId)}', ${idx})"
                          class="px-2.5 py-1 rounded-lg bg-[#0071E3] hover:bg-[#0062C4] dark:bg-[#3B9EFF] dark:hover:bg-[#2A8CEB] text-white dark:text-slate-950 font-bold text-[11px] shrink-0 transition cursor-pointer"
                        >
                          Copy Mẫu
                        </button>
                      </div>
                      <div class="bg-[#090B10] text-slate-100 p-3 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap select-all border border-slate-800">
${escapeHTML(item.template || item.prompt || "")}
                      </div>
                      ${item.example ? `
                        <p class="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                          💡 Gợi ý: <span class="text-slate-700 dark:text-slate-300 font-mono">${escapeHTML(item.example)}</span>
                        </p>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- TAB 3: TRƯỚC VÀ SAU (BEFORE VS AFTER) -->
              <div id="skillTabPaneScripts" class="space-y-4 hidden">
                ${(prod.beforeAfter && (prod.beforeAfter.before || prod.beforeAfter.after)) ? `
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Cột Trước Khi Dùng -->
                    <div class="p-4 rounded-2xl bg-red-500/5 dark:bg-red-950/20 border border-red-500/20 space-y-2.5">
                      <div class="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                        <span>✕ ${escapeHTML((prod.beforeAfter.before && prod.beforeAfter.before.title) || 'Trước Khi Dùng')}</span>
                      </div>
                      <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        ${escapeHTML((prod.beforeAfter.before && prod.beforeAfter.before.summary) || (typeof prod.beforeAfter.before === 'string' ? prod.beforeAfter.before : 'Tốn nhiều ngày dựng kiến trúc thủ công từ đầu.'))}
                      </p>
                      ${(prod.beforeAfter.before && Array.isArray(prod.beforeAfter.before.points)) ? `
                        <ul class="space-y-1.5 text-xs text-red-700 dark:text-red-300 pl-4 list-disc">
                          ${prod.beforeAfter.before.points.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}
                        </ul>
                      ` : ''}
                    </div>

                    <!-- Cột Sau Khi Dùng -->
                    <div class="p-4 rounded-2xl bg-[#0071E3]/5 dark:bg-[#3B9EFF]/10 border border-[#0071E3]/25 dark:border-[#3B9EFF]/30 space-y-2.5">
                      <div class="flex items-center gap-2 text-[#0071E3] dark:text-[#3B9EFF] font-bold text-sm">
                        <span>✓ ${escapeHTML((prod.beforeAfter.after && prod.beforeAfter.after.title) || 'Sau Khi Dùng Starter / Hộp Công Cụ')}</span>
                      </div>
                      <p class="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                        ${escapeHTML((prod.beforeAfter.after && prod.beforeAfter.after.summary) || (typeof prod.beforeAfter.after === 'string' ? prod.beforeAfter.after : 'Sẵn sàng tùy biến và mở rộng ngay trên codebase chuẩn.'))}
                      </p>
                      ${(prod.beforeAfter.after && Array.isArray(prod.beforeAfter.after.points)) ? `
                        <ul class="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 pl-4 list-disc">
                          ${prod.beforeAfter.after.points.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}
                        </ul>
                      ` : ''}
                    </div>
                  </div>
                ` : '<p class="text-xs text-slate-400">Bảng so sánh hiệu quả đang được cập nhật.</p>'}
              </div>

              <!-- TAB 4: HƯỚNG DẪN SỬ DỤNG CHI TIẾT THEO ĐÚNG DÒNG SẢN PHẨM -->
              <div id="skillTabPaneGuide" class="space-y-4 hidden text-xs leading-relaxed">
                ${isSourceStarter ? `
                  <div class="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-[#090B10] border border-[#0071E3]/30 space-y-3">
                    <div class="flex items-center justify-between gap-2 flex-wrap">
                      <h4 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <span>${isMetropolis ? '🏙️ Quy Trình Chạy & Tùy Biến Source Code Metropolis 1998' : '📦 Quy Trình Giải Nén & Chạy Source Starter'}</span>
                      </h4>
                      <span class="text-[11px] font-mono font-bold text-[#0071E3] dark:text-[#3B9EFF]">
                        ${isMetropolis ? 'React 19 + TypeScript + Three.js' : 'Clean Starter Source'}
                      </span>
                    </div>
                    <div class="space-y-2.5 text-slate-700 dark:text-slate-300">
                      <p class="flex items-start gap-2.5">
                        <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs tabular-nums shrink-0">1</span>
                        <span><strong>Tải gói mã nguồn (.zip):</strong> Bấm nút <strong class="text-emerald-600 dark:text-emerald-400">Tải .zip</strong> ở góc trên cùng bên phải để lưu file <code>${escapeHTML(zipName)}</code> về máy tính.</span>
                      </p>
                      <p class="flex items-start gap-2.5">
                        <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs tabular-nums shrink-0">2</span>
                        <span><strong>Giải nén &amp; mở thư mục dự án:</strong> Chuột phải vào file <code>.zip</code> chọn <strong>Extract All</strong>, sau đó mở thư mục vừa giải nén bằng <strong>VS Code / Cursor / Antigravity</strong>.</span>
                      </p>
                      <p class="flex items-start gap-2.5">
                        <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs tabular-nums shrink-0">3</span>
                        <span>${isMetropolis
                          ? '<strong>Khởi chạy Local Dev Server:</strong> Mở Terminal tại thư mục gốc và chạy lệnh <code class="px-1.5 py-0.5 rounded bg-slate-900 text-[#3B9EFF] font-mono">npm install &amp;&amp; npm run dev</code> (hoặc <code class="px-1.5 py-0.5 rounded bg-slate-900 text-[#3B9EFF] font-mono">bun install &amp;&amp; bun dev</code>), rồi truy cập <code>localhost</code>.'
                          : '<strong>Chạy &amp; Tùy biến ngay:</strong> Với template 1-file HTML, mở trực tiếp file <code>index.html</code> trên trình duyệt hoặc chạy với Live Server / Vite dev server để chỉnh sửa trực quan.'}</span>
                      </p>
                      <p class="flex items-start gap-2.5">
                        <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs tabular-nums shrink-0">4</span>
                        <span><strong>Mở rộng tính năng bằng AI:</strong> Sao chép <strong>Master Prompt</strong> ở Tab 1 hoặc các câu lệnh ở Tab <strong>Cheat Sheet</strong>, dán vào AI Agent của Cursor/Claude để thêm công trình mới, cơ chế mô phỏng hoặc đồng bộ backend theo ý muốn.</span>
                      </p>
                    </div>
                  </div>

                  <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#090B10]/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white">Thành phần đã mở khóa trong gói này</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-1">
                        <strong class="text-[#0071E3] dark:text-[#3B9EFF] block">1. Full Source Code Package</strong>
                        <p class="text-slate-600 dark:text-slate-400 text-[11px]">Toàn bộ mã nguồn sạch, tách module rõ ràng, có thể thương mại hóa hoặc học tập ngay.</p>
                      </div>
                      <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-1">
                        <strong class="text-[#0071E3] dark:text-[#3B9EFF] block">2. Master Prompt Kiến Trúc</strong>
                        <p class="text-slate-600 dark:text-slate-400 text-[11px]">Đặc tả kiến trúc để AI hiểu 100% logic game/app và không phá vỡ cấu trúc cũ khi sửa.</p>
                      </div>
                      <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-1">
                        <strong class="text-[#0071E3] dark:text-[#3B9EFF] block">3. Cheat Sheet (${cheatSheet.length} Mẫu Lệnh)</strong>
                        <p class="text-slate-600 dark:text-slate-400 text-[11px]">Các prompt tinh chỉnh sẵn cho tính năng bổ sung, skin, ánh sáng và tối ưu hiệu năng.</p>
                      </div>
                      <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-1">
                        <strong class="text-[#0071E3] dark:text-[#3B9EFF] block">4. Live Browser Sandbox</strong>
                        <p class="text-slate-600 dark:text-slate-400 text-[11px]">Xem trước trực tiếp trên cả Laptop &amp; Mobile mockup trước khi tinh chỉnh code.</p>
                      </div>
                    </div>
                  </div>
                ` : isOpenJarvis ? `
                  <div class="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-[#090B10] border border-[#0071E3]/30 space-y-3">
                    <div class="flex items-center justify-between gap-2 flex-wrap">
                      <h4 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        🤖 Quy Trình Cài Đặt 1-Click OpenJarvis Local AI
                      </h4>
                      <span class="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">Local &amp; Offline Ready</span>
                    </div>
                    <div class="space-y-2.5 text-slate-700 dark:text-slate-300">
                      <p class="flex items-start gap-2.5">
                        <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs tabular-nums shrink-0">1</span>
                        <span><strong>Tải gói .zip về máy:</strong> Nhấn nút <strong>Tải .zip</strong> ở góc trên cùng bên phải để tải <code>${escapeHTML(zipName)}</code>.</span>
                      </p>
                      <p class="flex items-start gap-2.5">
                        <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs tabular-nums shrink-0">2</span>
                        <span><strong>Giải nén thư mục:</strong> Chuột phải chọn <strong>Extract All</strong> (tránh chạy trực tiếp bên trong file nén).</span>
                      </p>
                      <p class="flex items-start gap-2.5">
                        <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs tabular-nums shrink-0">3</span>
                        <span><strong>Chạy trình cài đặt tự động:</strong> Nhấp đúp file <code>.bat</code> đi kèm để tự động kiểm tra Ollama, nạp cấu hình Local AI Agent và khởi chạy.</span>
                      </p>
                    </div>
                  </div>
                ` : `
                  <!-- BƯỚC 1: QUY TRÌNH TẢI ZIP VÀ GIẢI NÉN -->
                  <div class="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-[#090B10] border border-[#0071E3]/30 space-y-3">
                    <div class="flex items-center justify-between gap-2 flex-wrap">
                      <h4 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        📦 Quy Trình Tải Gói Zero-Setup &amp; Giải Nén
                      </h4>
                      <span class="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        Zero-Setup 100%
                      </span>
                    </div>
                    <div class="space-y-2.5 text-slate-700 dark:text-slate-300">
                      <p class="flex items-start gap-2.5">
                        <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs tabular-nums shrink-0">1</span>
                        <span><strong>Tải file hoặc sao chép Prompt:</strong> Dùng nút <strong>Copy Master Prompt</strong> ở trên, hoặc bấm <strong>Tải .zip / Tải .md</strong> nếu gói có đính kèm tệp offline.</span>
                      </p>
                      <p class="flex items-start gap-2.5">
                        <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs tabular-nums shrink-0">2</span>
                        <span><strong>Giải nén (nếu có file .zip):</strong> Chuột phải vào file vừa tải chọn <strong>Extract All...</strong> ra một thư mục riêng trước khi mở các tệp bên trong.</span>
                      </p>
                      <p class="flex items-start gap-2.5">
                        <span class="w-6 h-6 rounded-lg bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs tabular-nums shrink-0">3</span>
                        <span><strong>Nạp vào AI hoặc mở trực tiếp:</strong></span>
                      </p>
                      <div class="pl-8 space-y-1.5 text-slate-600 dark:text-slate-400 text-[11.5px]">
                        <p>• <strong>Studio Offline HTML:</strong> Nhấp đúp file Studio offline (nếu có) để tìm kiếm và copy 1 chạm không cần mạng.</p>
                        <p>• <strong>Cursor / VS Code / Claude:</strong> Dán trực tiếp vào System Prompt hoặc lưu thành <code>.cursorrules</code> trong thư mục dự án.</p>
                        <p>• <strong>Notion / Docs:</strong> Dùng nút <strong>Xuất Notion</strong> ở thanh tiêu đề để lưu trữ hệ thống lâu dài.</p>
                      </div>
                    </div>
                  </div>

                  ${(isAllInOne || cheatSheet.length > 30) ? `
                    <!-- BẢNG CHỈ MỤC ĐỊNH VỊ NHANH: ALL-IN-ONE 545+ PROMPTS -->
                    <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#090B10]/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div class="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
                        <div>
                          <h4 class="font-bold text-sm text-slate-900 dark:text-white">
                            🗺️ Bảng Chỉ Mục Phân Khu Master Prompts
                          </h4>
                          <p class="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                            Tra cứu nhanh đúng khoảng số thứ tự phù hợp với tác vụ của bạn:
                          </p>
                        </div>
                        <span class="text-xs font-mono font-bold text-[#0071E3] dark:text-[#3B9EFF] tabular-nums">
                          545+ Mẫu Lệnh
                        </span>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1">
                          <div class="flex items-center justify-between tabular-nums">
                            <span class="px-2 py-0.5 rounded-md bg-[#0071E3] text-white font-mono font-bold text-[11px]">#01 – #20</span>
                            <span class="text-[10px] font-bold text-[#0071E3] dark:text-[#3B9EFF]">20 Mẫu</span>
                          </div>
                          <strong class="text-slate-900 dark:text-white block font-bold">Hệ Điều Hành Tác Chiến Toàn Năng</strong>
                          <p class="text-slate-600 dark:text-slate-400 text-[11px]">Khởi tạo dự án tổng hợp từ A-Z, tự động điều phối đa chuyên khoa.</p>
                        </div>

                        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1">
                          <div class="flex items-center justify-between tabular-nums">
                            <span class="px-2 py-0.5 rounded-md bg-slate-800 text-white font-mono font-bold text-[11px]">#21 – #131</span>
                            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">111 Mẫu</span>
                          </div>
                          <strong class="text-slate-900 dark:text-white block font-bold">Kho Kỹ Năng Hệ Thống Studio Core</strong>
                          <p class="text-slate-600 dark:text-slate-400 text-[11px]">Ponytail code tối giản, sửa bug tận gốc, kiểm tra chất lượng trước deploy.</p>
                        </div>

                        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1">
                          <div class="flex items-center justify-between tabular-nums">
                            <span class="px-2 py-0.5 rounded-md bg-slate-800 text-white font-mono font-bold text-[11px]">#132 – #377</span>
                            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">246 Mẫu</span>
                          </div>
                          <strong class="text-slate-900 dark:text-white block font-bold">Game Pixel VFX &amp; Sound FX Engine</strong>
                          <p class="text-slate-600 dark:text-slate-400 text-[11px]">Hiệu ứng chiêu thức game pixel 60fps kèm âm thanh Web Audio 0MB.</p>
                        </div>

                        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1">
                          <div class="flex items-center justify-between tabular-nums">
                            <span class="px-2 py-0.5 rounded-md bg-slate-800 text-white font-mono font-bold text-[11px]">#378 – #380</span>
                            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">3 Mẫu</span>
                          </div>
                          <strong class="text-slate-900 dark:text-white block font-bold">Pixel Fighter Forge (48×48)</strong>
                          <p class="text-slate-600 dark:text-slate-400 text-[11px]">Thiết kế đấu sĩ đối kháng 48px, combo 4 đòn và Ultimate điện ảnh.</p>
                        </div>

                        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1">
                          <div class="flex items-center justify-between tabular-nums">
                            <span class="px-2 py-0.5 rounded-md bg-[#0071E3] text-white font-mono font-bold text-[11px]">#381 – #410</span>
                            <span class="text-[10px] font-bold text-[#0071E3] dark:text-[#3B9EFF]">30 Mẫu</span>
                          </div>
                          <strong class="text-slate-900 dark:text-white block font-bold">Web Liquid Glass &amp; Fullstack RLS</strong>
                          <p class="text-slate-600 dark:text-slate-400 text-[11px]">Next.js 15, React 19, PostgreSQL, Supabase RLS và UI bản địa tiếng Việt.</p>
                        </div>

                        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1">
                          <div class="flex items-center justify-between tabular-nums">
                            <span class="px-2 py-0.5 rounded-md bg-slate-800 text-white font-mono font-bold text-[11px]">#411 – #455</span>
                            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">45 Mẫu</span>
                          </div>
                          <strong class="text-slate-900 dark:text-white block font-bold">SEO E-E-A-T, Luận Văn &amp; Clean Code</strong>
                          <p class="text-slate-600 dark:text-slate-400 text-[11px]">Nội dung chuẩn SEO, nghiên cứu học thuật SPSS/PLS và review thuật toán.</p>
                        </div>

                        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1">
                          <div class="flex items-center justify-between tabular-nums">
                            <span class="px-2 py-0.5 rounded-md bg-slate-800 text-white font-mono font-bold text-[11px]">#456 – #500</span>
                            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">45 Mẫu</span>
                          </div>
                          <strong class="text-slate-900 dark:text-white block font-bold">N8N Automation, Video &amp; Web Audio</strong>
                          <p class="text-slate-600 dark:text-slate-400 text-[11px]">Workflow webhook 24/7, dựng nhịp beat video ngắn và tổng hợp âm thanh code.</p>
                        </div>

                        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1">
                          <div class="flex items-center justify-between tabular-nums">
                            <span class="px-2 py-0.5 rounded-md bg-slate-800 text-white font-mono font-bold text-[11px]">#501 – #545</span>
                            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">45 Mẫu</span>
                          </div>
                          <strong class="text-slate-900 dark:text-white block font-bold">Kinh Tế Ví Xu, AppSec &amp; System Prompts</strong>
                          <p class="text-slate-600 dark:text-slate-400 text-[11px]">Chống race condition, kiểm thử XSS/RLS và kiến trúc System Instructions.</p>
                        </div>
                      </div>
                    </div>
                  ` : ''}
                `}
              </div>

            </div>

            <!-- AI PROMPT STUDIO — viết lại Master Prompt qua Respan Gateway (api/ai.py) -->
            <div id="aiPromptStudio" class="hidden px-5 py-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-[#090B10]/90 space-y-2 shrink-0">
              <div class="flex items-center justify-between gap-2">
                <strong class="text-xs font-bold text-slate-900 dark:text-white">✨ Cá nhân hóa prompt theo dự án của bạn</strong>
                <button
                  type="button"
                  onclick="ShopVietViews.modal.togglePromptStudio(false)"
                  class="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >Đóng</button>
              </div>
              <p class="text-[11px] text-slate-600 dark:text-slate-400">Giữ nguyên khung kiến trúc gốc, tự động điều chỉnh bối cảnh và thông số theo mô tả dự án của bạn.</p>
              <textarea
                id="aiPromptStudioContext"
                rows="2"
                maxlength="1000"
                placeholder="Ví dụ: muốn đổi theme sang thành phố ven biển năm 2005 và thêm hệ thống giao thông đường thủy..."
                class="w-full text-xs p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/40 resize-none"
              ></textarea>
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  id="aiPromptStudioRun"
                  type="button"
                  onclick="ShopVietViews.modal.runPromptStudio('${escapeHTML(prodId)}')"
                  class="px-3.5 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0062C4] dark:bg-[#3B9EFF] dark:hover:bg-[#2A8CEB] text-white dark:text-slate-950 font-bold text-[11px] shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >Tạo bản tối ưu</button>
                <span id="aiPromptStudioStatus" class="text-[11px] text-slate-500 dark:text-slate-400"></span>
              </div>
              <div id="aiPromptStudioResultWrap" class="hidden space-y-2">
                <pre id="aiPromptStudioResult" class="max-h-44 overflow-y-auto whitespace-pre-wrap text-[11px] leading-relaxed p-3 rounded-xl bg-[#090B10] border border-slate-800 text-slate-100"></pre>
                <button
                  type="button"
                  onclick="ShopVietViews.modal.copyPromptStudioResult()"
                  class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                >Sao chép bản tối ưu</button>
              </div>
            </div>

            <!-- FOOTER MỞ KHÓA -->
            <div class="px-5 py-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#090B10]/90 flex items-center justify-between gap-3 flex-wrap shrink-0">
              <button 
                type="button" 
                onclick="ShopVietViews.modal.close(); if(window.ShopVietState){window.ShopVietState.navigate('dashboard', { tab: 'orders' });}" 
                class="text-xs font-bold text-[#0071E3] dark:text-[#3B9EFF] hover:underline cursor-pointer"
              >
                ← Xem lại trong Quản lý Đơn hàng
              </button>
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onclick="ShopVietViews.modal.togglePromptStudio()"
                  class="px-3.5 py-2 rounded-xl bg-[#0071E3]/10 hover:bg-[#0071E3]/20 border border-[#0071E3]/30 text-[#0071E3] dark:text-[#3B9EFF] font-bold text-xs cursor-pointer transition"
                  title="Nhờ AI viết lại prompt cho đúng dự án của bạn"
                >
                  ✨ Cá nhân hóa prompt
                </button>
                <button 
                  type="button" 
                  onclick="ShopVietViews.modal.copyMasterPrompt('${escapeHTML(prodId)}')"
                  class="px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0062C4] dark:bg-[#3B9EFF] dark:hover:bg-[#2A8CEB] text-white dark:text-slate-950 font-bold text-xs cursor-pointer shadow-sm transition"
                >
                  Sao Chép Prompt
                </button>
                <button 
                  type="button" 
                  onclick="ShopVietViews.modal.close()" 
                  class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Đóng
                </button>
              </div>
            </div>

          </div>
        </div>
      `;
    },

    // ==========================================
    // HELPER SAO CHÉP PROMPTS & CHEAT SHEET
    // ==========================================
    copyMasterPrompt: function (productId) {
      const prod = this.getProductById(productId) || (window.ShopVietData && window.ShopVietData.getProductById(productId));
      const payload = (prod && prod.unlockedPayload) || {};
      const text = payload.masterPrompt || payload.skillContent || (prod && prod.desc) || "";
      if (!text) {
        if (window.ShopVietState && typeof window.ShopVietState.showToast === "function") {
          window.ShopVietState.showToast("Không tìm thấy nội dung prompt!", "error");
        }
        return;
      }
      copyToClipboard(text, "100% Master Prompt chuẩn (Dán vào Cursor / Claude / ChatGPT là dùng ngay)");
    },

    // ==========================================
    // AI PROMPT STUDIO (Respan Gateway)
    // Gọi POST /api/ai — server xác thực Firebase ID token rồi mới gọi model.
    // ==========================================
    togglePromptStudio: function (show) {
      const panel = document.getElementById('aiPromptStudio');
      if (!panel) return;
      const shouldShow = typeof show === 'boolean' ? show : panel.classList.contains('hidden');
      panel.classList.toggle('hidden', !shouldShow);
      if (shouldShow) {
        const input = document.getElementById('aiPromptStudioContext');
        if (input) input.focus();
      }
    },

    setPromptStudioStatus: function (message, isError) {
      const status = document.getElementById('aiPromptStudioStatus');
      if (!status) return;
      status.textContent = message || '';
      status.className = 'text-[11px] ' + (isError ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500 dark:text-slate-400');
    },

    runPromptStudio: async function (productId) {
      const prod = this.getProductById(productId) || (window.ShopVietData && window.ShopVietData.getProductById(productId)) || {};
      const payload = prod.unlockedPayload || {};
      const sourcePrompt = payload.masterPrompt || payload.skillContent || '';
      const input = document.getElementById('aiPromptStudioContext');
      const runButton = document.getElementById('aiPromptStudioRun');
      const resultWrap = document.getElementById('aiPromptStudioResultWrap');
      const resultBox = document.getElementById('aiPromptStudioResult');
      const context = (input && input.value ? input.value : '').trim();

      if (!sourcePrompt) {
        this.setPromptStudioStatus('Không tìm thấy nội dung prompt gốc của sản phẩm này.', true);
        return;
      }
      if (context.length < 10) {
        this.setPromptStudioStatus('Hãy mô tả dự án của bạn ít nhất 10 ký tự.', true);
        if (input) input.focus();
        return;
      }

      let token = null;
      try {
        if (window.ShopVietFirebase && typeof window.ShopVietFirebase.getIdToken === 'function') {
          token = await window.ShopVietFirebase.getIdToken();
        }
      } catch (err) {
        token = null;
      }
      if (!token) {
        this.setPromptStudioStatus('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để dùng AI.', true);
        return;
      }

      if (runButton) { runButton.disabled = true; runButton.textContent = 'Đang tối ưu...'; }
      this.setPromptStudioStatus('AI đang viết lại prompt, chờ khoảng 5-15 giây...', false);
      if (resultWrap) resultWrap.classList.add('hidden');

      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({
            prompt: sourcePrompt,
            context: context,
            productName: prod.name || (prod.title || '')
          })
        });
        const data = await res.json().catch(function () { return {}; });
        if (!res.ok || !data.ok || !data.prompt) {
          throw new Error(data.message || 'Máy chủ AI chưa sẵn sàng.');
        }
        if (resultBox) resultBox.textContent = data.prompt;
        if (resultWrap) resultWrap.classList.remove('hidden');
        this.setPromptStudioStatus('Xong — model ' + (data.model || 'gateway') + '. Bấm "Sao chép bản tối ưu" để dùng ngay.', false);
      } catch (err) {
        this.setPromptStudioStatus((err && err.message) || 'Không gọi được trợ lý AI. Vui lòng thử lại.', true);
      } finally {
        if (runButton) { runButton.disabled = false; runButton.textContent = 'Tạo bản tối ưu'; }
      }
    },

    copyPromptStudioResult: function () {
      const resultBox = document.getElementById('aiPromptStudioResult');
      const text = resultBox ? (resultBox.textContent || '') : '';
      if (!text.trim()) {
        if (window.ShopVietState && typeof window.ShopVietState.showToast === 'function') {
          window.ShopVietState.showToast('Chưa có bản tối ưu để sao chép.', 'warning');
        }
        return;
      }
      copyToClipboard(text, 'bản prompt đã tối ưu');
    },

    copyCheatSheetCommand: function (productId, index) {
      const prod = this.getProductById(productId) || (window.ShopVietData && window.ShopVietData.getProductById(productId));
      const payload = (prod && prod.unlockedPayload) || {};
      const list = payload.cheatSheet || [];
      const item = list[index];
      if (!item) return;
      const text = item.template || item.prompt || item.example || "";
      copyToClipboard(text, "mẫu câu lệnh: \"" + item.title + "\"");
    },

    exportToNotion: function (productId) {
      const prod = this.getProductById(productId) || (window.ShopVietData && window.ShopVietData.getProductById(productId));
      if (!prod) return;
      const payload = prod.unlockedPayload || {};
      const cheatSheet = payload.cheatSheet || [];
      const fence = "```";
      const md = [
        "# " + prod.name,
        "> Phân loại: " + (prod.module || "Hộp Công Cụ Prompts Bùi Thái Studio"),
        "> Giá trị mở khóa: " + prod.price.toLocaleString("vi-VN") + " Xu",
        "> Kho GitHub: https://github.com/thaitraicau123-pixel/shoppromt/blob/main/MASTER_PROMPTS.md",
        "",
        "## 1. SO SÁNH HIỆU QUẢ TRƯỚC VÀ SAU",
        prod.beforeAfter ? [
          "### ❌ Trước khi dùng:",
          prod.beforeAfter.before.summary,
          (prod.beforeAfter.before.points || []).map(p => "- " + p).join("\n"),
          "",
          "### ✅ Sau khi dùng:",
          prod.beforeAfter.after.summary,
          (prod.beforeAfter.after.points || []).map(p => "- " + p).join("\n")
        ].join("\n") : "",
        "",
        "## 2. MASTER PROMPT CHUẨN (SYSTEM INSTRUCTIONS)",
        fence + "markdown",
        payload.masterPrompt || payload.skillContent || prod.desc,
        fence,
        "",
        "## 3. DANH MỤC " + cheatSheet.length + " MẪU CÂU LỆNH CHEAT SHEET THỰC CHIẾN",
        cheatSheet.map((c, i) => "### " + (i + 1) + ". " + c.title + "\n" + fence + "text\n" + (c.template || c.prompt || "") + "\n" + fence + "\n*Ví dụ mẫu: " + (c.example || "") + "*\n").join("\n"),
        "",
        "## 4. HƯỚNG DẪN 3 BƯỚC SỬ DỤNG TRONG 30 GIÂY",
        "- Bước 1: Mở Notion, tạo trang mới và nhấn Ctrl + V để dán toàn bộ tài liệu này.",
        "- Bước 2: Sao chép Master Prompt ở Mục 2 dán vào System Instructions của ChatGPT / Claude / Cursor.",
        "- Bước 3: Chọn câu lệnh ở Mục 3, điền thông tin trong dấu [...] và Enter!"
      ].join("\n");

      copyToClipboard(md, "toàn bộ Hộp Công Cụ dạng Notion Markdown (Mở Notion và nhấn Ctrl+V)");
    },

    switchSkillTab: function (tabName) {
      const paneFile = document.getElementById('skillTabPaneFile');
      const paneInstall = document.getElementById('skillTabPaneInstall');
      const paneScripts = document.getElementById('skillTabPaneScripts');
      const paneGuide = document.getElementById('skillTabPaneGuide');
      const btnFile = document.getElementById('skillTabBtnFile');
      const btnInstall = document.getElementById('skillTabBtnInstall');
      const btnScripts = document.getElementById('skillTabBtnScripts');
      const btnGuide = document.getElementById('skillTabBtnGuide');

      if (!paneFile || !paneInstall || !paneScripts) return;

      paneFile.classList.add('hidden');
      paneInstall.classList.add('hidden');
      paneScripts.classList.add('hidden');
      if (paneGuide) paneGuide.classList.add('hidden');

      [btnFile, btnInstall, btnScripts, btnGuide].forEach(b => {
        if (b) {
          b.className = 'px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0';
        }
      });

      const activeBtnClass = 'px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 border-[#0071E3] dark:border-[#3B9EFF] text-[#0071E3] dark:text-[#3B9EFF] transition-colors cursor-pointer shrink-0';
      if (tabName === 'install') {
        paneInstall.classList.remove('hidden');
        if (btnInstall) btnInstall.className = activeBtnClass;
      } else if (tabName === 'scripts') {
        paneScripts.classList.remove('hidden');
        if (btnScripts) btnScripts.className = activeBtnClass;
      } else if (tabName === 'guide' && paneGuide) {
        paneGuide.classList.remove('hidden');
        if (btnGuide) btnGuide.className = activeBtnClass;
      } else {
        paneFile.classList.remove('hidden');
        if (btnFile) btnFile.className = activeBtnClass;
      }
    },

    // Sao chép nội dung file SKILL.md
    copyCurrentSkillContent: function (productId) {
      const prod = (window.ShopVietData && typeof window.ShopVietData.getProductById === 'function')
        ? window.ShopVietData.getProductById(productId)
        : currentProduct;
      const payload = (lastUnlockedOrder && lastUnlockedOrder.unlockedPayload) || (prod && prod.unlockedPayload);
      if (payload && payload.skillContent) {
        copyToClipboard(payload.skillContent, 'nội dung SKILL.md');
      } else {
        copyToClipboard('# Kỹ Năng Tác Chiến Bùi Thái Studio', 'nội dung kỹ năng');
      }
    },

    // Sao chép lệnh cài đặt 1-chạm
    copyCurrentInstallCommand: function (productId) {
      const prod = (window.ShopVietData && typeof window.ShopVietData.getProductById === 'function')
        ? window.ShopVietData.getProductById(productId)
        : currentProduct;
      const payload = (lastUnlockedOrder && lastUnlockedOrder.unlockedPayload) || (prod && prod.unlockedPayload);
      if (payload && payload.installCommand) {
        copyToClipboard(payload.installCommand, 'lệnh cài đặt 1-chạm');
      }
    },

    // Tải file .md trực tiếp từ trình duyệt
    downloadPromptMd: function (productId) { return this.downloadCurrentSkillFile(productId); },
    downloadCurrentSkillFile: function (productId) {
      const prod = (window.ShopVietData && typeof window.ShopVietData.getProductById === 'function')
        ? window.ShopVietData.getProductById(productId)
        : currentProduct;
      const payload = (lastUnlockedOrder && lastUnlockedOrder.unlockedPayload) || (prod && prod.unlockedPayload);
      const promptText = (payload && (payload.masterPrompt || payload.skillContent)) || '';
      if (!payload || !promptText) return;

      const fileName = payload.fileName || 'MASTER_PROMPT.md';
      const blob = new Blob([promptText], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (window.ShopVietState && typeof window.ShopVietState.showToast === 'function') {
        window.ShopVietState.showToast(`✓ Đang tải file ${fileName} về máy tính của bạn!`, 'success');
      }
    },

    // Sao chép Script theo index
    copyScriptIndex: function (scriptIndex, productId) {
      const prod = (window.ShopVietData && typeof window.ShopVietData.getProductById === 'function')
        ? window.ShopVietData.getProductById(productId)
        : currentProduct;
      const payload = (lastUnlockedOrder && lastUnlockedOrder.unlockedPayload) || (prod && prod.unlockedPayload);
      if (payload && payload.scripts && payload.scripts[scriptIndex]) {
        copyToClipboard(payload.scripts[scriptIndex].code, `script ${payload.scripts[scriptIndex].name}`);
      }
    },

    copyField: function (text, label) {
      copyToClipboard(text, label);
    },

    // ==========================================
    // TRUNG TÂM PHÁP LÝ & CHÍNH SÁCH BẢO HÀNH / HOÀN TIỀN
    // Tuân thủ: Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15, Nghị định 356/2025/NĐ-CP (thay thế NĐ 13/2023), 
    // Luật Thương mại điện tử 122/2025/QH15, Nghị định 248/2026/NĐ-CP & Luật BVQLNTD 19/2023/QH15
    // ==========================================
    openPolicy: function (initialTab) {
      const activeTab = initialTab || 'terms';
      const modalMount = document.getElementById('modalMount');
      if (!modalMount) return;

      modalMount.innerHTML = `
        <div id="policyModalBackdrop" class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in" onclick="if(event.target === this) ShopVietViews.modal.close()">
          <div class="bg-white/92 dark:bg-[#0B0F17]/92 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-slide-up text-slate-900 dark:text-slate-100">

            <!-- HEADER CHÍNH SÁCH PHÁP LÝ -->
            <div class="p-4 sm:p-6 bg-slate-50/75 dark:bg-[#090B10]/85 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#0071E3] flex items-center justify-center text-white shadow-md shadow-blue-500/20 text-xl shrink-0">
                  ⚖️
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Trung Tâm Chính Sách &amp; Pháp Lý</h3>
                    <span class="hidden sm:inline text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      · Niêm yết công khai 2026
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    Bùi Thái AI Studio · Luật 91/2025/QH15, NĐ 356/2025/NĐ-CP &amp; Luật TMĐT 122/2025/QH15
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <a
                  href="https://zalo.me/0986019623"
                  target="_blank"
                  class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0071E3] hover:bg-[#0062C4] text-white font-bold text-xs transition"
                >
                  <span>💬 Zalo CSKH</span>
                </a>
                <button
                  type="button"
                  onclick="ShopVietViews.modal.close()"
                  class="w-9 h-9 rounded-xl bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-lg font-bold transition cursor-pointer"
                  title="Đóng (ESC)"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- TAB CONTROLS -->
            <div class="px-4 sm:px-6 flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-[#090B10]/50 shrink-0 overflow-x-auto">
              <button
                id="policyTabBtnTerms"
                onclick="ShopVietViews.modal.switchPolicyTab('terms')"
                class="px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>📜</span> Điều Khoản Dịch Vụ
              </button>
              <button
                id="policyTabBtnRefund"
                onclick="ShopVietViews.modal.switchPolicyTab('refund')"
                class="px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>💰</span> Hoàn Tiền 100% &amp; Bảo Hành
              </button>
              <button
                id="policyTabBtnPrivacy"
                onclick="ShopVietViews.modal.switchPolicyTab('privacy')"
                class="px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>🛡️</span> Bảo Mật Dữ Liệu (Luật 91/2025)
              </button>
              <button
                id="policyTabBtnDispute"
                onclick="ShopVietViews.modal.switchPolicyTab('dispute')"
                class="px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>⚖️</span> Giải Quyết Khiếu Nại
              </button>
            </div>

            <!-- TAB CONTENTS -->
            <div class="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">

              <!-- PANE 1: ĐIỀU KHOẢN DỊCH VỤ -->
              <div id="policyPaneTerms" class="space-y-4">
                <div class="p-3.5 rounded-2xl bg-[#0071E3]/[0.06] dark:bg-[#3B9EFF]/10 border border-[#0071E3]/25">
                  <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-1">📜 ĐIỀU KHOẢN DỊCH VỤ &amp; QUY CHẾ HOẠT ĐỘNG THƯƠNG MẠI ĐIỆN TỬ</h4>
                  <p class="text-xs text-slate-600 dark:text-slate-300">Căn cứ Luật Thương mại điện tử 122/2025/QH15, Nghị định 248/2026/NĐ-CP. Áp dụng tại website <code class="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded">https://www.promptmmo.store/</code>.</p>
                </div>

                <div class="space-y-3">
                  <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-sm">1. Thông tin đơn vị sở hữu &amp; pháp lý</h5>
                    <p class="mt-1 text-slate-600 dark:text-slate-300">
                      - Đơn vị phát triển: <strong>Bùi Thái AI Studio</strong><br>
                      - Người đại diện phụ trách: <strong>Bùi Thái</strong><br>
                      - Địa chỉ liên hệ: Hà Nội, Việt Nam<br>
                      - Hotline/Zalo tiếp nhận CSKH: <strong class="text-[#0071E3] dark:text-[#3B9EFF] font-mono">0986019623</strong><br>
                      - Email hỗ trợ chính thức: <span class="font-mono">thaitraicau123@gmail.com</span><br>
                      - Tài khoản thanh toán thụ hưởng chính thức: MBBank <strong class="font-mono text-slate-900 dark:text-white">0986019623</strong> (Chủ tài khoản: BUI THAI).
                    </p>
                  </div>

                  <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-sm">2. Bản chất dịch vụ &amp; sản phẩm số</h5>
                    <p class="mt-1 text-slate-600 dark:text-slate-300">
                      Bùi Thái AI Studio cung cấp các tài nguyên trí tuệ nhân tạo (AI Prompts), bộ Source Starter mã nguồn sạch (React, Three.js, HTML5/WebGL), công thức tự động hóa và tài liệu lập trình. Mọi sản phẩm được mở khóa và tải trực tiếp trên trình duyệt.
                    </p>
                  </div>

                  <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-sm">3. Cơ chế giao dịch Ví Xu &amp; thanh toán</h5>
                    <p class="mt-1 text-slate-600 dark:text-slate-300">
                      - Đơn vị quy ước nội bộ là <strong>Xu</strong> với tỷ giá cố định: <code class="tabular-nums">1 Xu = 1 VNĐ</code>.<br>
                      - Khách hàng nạp Xu thông qua chuyển khoản ngân hàng VietQR tự động 24/7.<br>
                      - Khi mở khóa sản phẩm, hệ thống trừ Xu tương ứng và cấp quyền mở khóa vĩnh viễn trọn đời.
                    </p>
                  </div>

                  <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-sm">4. Giấy phép sử dụng &amp; Bản quyền mở khóa vĩnh viễn</h5>
                    <p class="mt-1 text-slate-600 dark:text-slate-300">
                      - Người mua được cấp quyền <strong>Mở khóa vĩnh viễn (Lifetime License)</strong> đối với mã nguồn và tài nguyên đã mua.<br>
                      - Khách hàng có toàn quyền tùy biến mã nguồn, áp dụng vào học tập, dự án cá nhân hoặc thương mại cho khách hàng của mình.<br>
                      - <strong>Nghiêm cấm:</strong> Hành vi dùng bot/scraper sao chép hàng loạt kho dữ liệu để đóng gói bán lại cạnh tranh trái phép.
                    </p>
                  </div>

                  <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-sm">5. Giới hạn trách nhiệm</h5>
                    <p class="mt-1 text-slate-600 dark:text-slate-300">
                      Bùi Thái AI Studio cam kết chất lượng mã nguồn và cập nhật định kỳ. Chúng tôi không chịu trách nhiệm đối với gián đoạn hạ tầng bất khả kháng của bên thứ ba.
                    </p>
                  </div>
                </div>
              </div>

              <!-- PANE 2: HOÀN TIỀN 100% & BẢO HÀNH -->
              <div id="policyPaneRefund" class="space-y-4 hidden">
                <div class="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
                  <h4 class="font-bold text-emerald-800 dark:text-emerald-300 text-sm mb-1">💰 CHÍNH SÁCH HOÀN TIỀN 100% TRONG 24 GIỜ &amp; BẢO HÀNH TRỌN ĐỜI</h4>
                  <p class="text-xs text-emerald-700 dark:text-emerald-400">Cam kết bảo vệ 100% quyền lợi người tiêu dùng theo Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15.</p>
                </div>

                <div class="space-y-3">
                  <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-sm">1. Điều kiện được hoàn tiền 100% trong 24 giờ</h5>
                    <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-600 dark:text-slate-300 pl-2">
                      <li>Mã nguồn hoặc Prompt bị lỗi không chạy được như mô tả mà kỹ thuật viên không khắc phục được trong 24 giờ.</li>
                      <li>File tải về (.zip, .md, .docx) bị hỏng hoặc thiếu asset.</li>
                      <li>Sự cố trừ tiền ngân hàng nhưng số dư ví chưa ghi nhận sau khi đối soát.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-sm">2. Thời gian và phương thức xử lý hoàn tiền</h5>
                    <p class="mt-1 text-slate-600 dark:text-slate-300">
                      - <strong>Thời gian hoàn tiền:</strong> Xử lý trong vòng <strong>12 đến 24 giờ</strong> (tối đa 48 giờ).<br>
                      - <strong>Phương thức:</strong> Chuyển khoản ngân hàng trực tiếp hoặc hoàn trả 100% Xu vào ví theo yêu cầu.
                    </p>
                  </div>

                  <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-sm">3. Chính sách Cập Nhật Trọn Đời</h5>
                    <p class="mt-1 text-slate-600 dark:text-slate-300">
                      Mọi đơn hàng đều ở trạng thái <strong>Mở khóa vĩnh viễn</strong> và được hưởng các bản cập nhật nâng cấp trực tiếp trên web hoàn toàn miễn phí.
                    </p>
                  </div>

                  <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-sm">4. Quy trình yêu cầu hoàn tiền 3 bước</h5>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
                      <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-slate-800">
                        <span class="font-bold text-[#0071E3] dark:text-[#3B9EFF]">Bước 1:</span>
                        <p class="text-xs mt-1">Nhắn Zalo <strong class="font-mono">0986019623</strong> hoặc email <span class="font-mono">thaitraicau123@gmail.com</span>.</p>
                      </div>
                      <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-slate-800">
                        <span class="font-bold text-[#0071E3] dark:text-[#3B9EFF]">Bước 2:</span>
                        <p class="text-xs mt-1">Cung cấp Mã đơn hàng (#DJ...) và ảnh chụp lỗi cần khắc phục.</p>
                      </div>
                      <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-slate-800">
                        <span class="font-bold text-emerald-600 dark:text-emerald-400">Bước 3:</span>
                        <p class="text-xs mt-1">Admin kiểm tra và hoàn tiền trong 12 - 24 giờ.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- PANE 3: BẢO MẬT DỮ LIỆU CÁ NHÂN -->
              <div id="policyPanePrivacy" class="space-y-4 hidden">
                <div class="p-3.5 rounded-2xl bg-[#0071E3]/[0.06] dark:bg-[#3B9EFF]/10 border border-[#0071E3]/25">
                  <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-1">🛡️ CHÍNH SÁCH BẢO VỆ DỮ LIỆU CÁ NHÂN (LUẬT SỐ 91/2025/QH15 &amp; NĐ 356/2025/NĐ-CP)</h4>
                  <p class="text-xs text-slate-600 dark:text-slate-300">Cam kết bảo mật tuyệt đối, không chia sẻ hay kinh doanh dữ liệu cá nhân cho bất kỳ bên thứ ba nào.</p>
                </div>

                <div class="space-y-3">
                  <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-sm">1. Nguyên tắc thu thập dữ liệu tối giản</h5>
                    <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-600 dark:text-slate-300 pl-2">
                      <li><strong>Địa chỉ Email:</strong> Định danh tài khoản, lưu quyền sở hữu sản phẩm và khôi phục truy cập.</li>
                      <li><strong>Tên hiển thị:</strong> Cá nhân hóa giao diện.</li>
                      <li><strong>Lịch sử nạp Xu &amp; Đơn hàng:</strong> Đối soát giao dịch và duy trì quyền tải trọn đời.</li>
                    </ul>
                    <p class="mt-1.5 text-rose-600 dark:text-rose-400 font-semibold text-xs">
                      Tuyệt đối không thu thập: Mật khẩu ngân hàng, mã OTP, CCCD/CMND hay vị trí người dùng.
                    </p>
                  </div>

                  <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-sm">2. Biện pháp an toàn &amp; Quyền người dùng</h5>
                    <p class="mt-1 text-slate-600 dark:text-slate-300">
                      - Mã hóa truyền tải SSL/TLS và phân quyền Cloud Firestore.<br>
                      - Khách hàng có quyền tra cứu, chỉnh sửa hoặc yêu cầu xóa dữ liệu qua Zalo <strong>0986019623</strong> (phản hồi tối đa 2 ngày làm việc).
                    </p>
                  </div>
                </div>
              </div>

              <!-- PANE 4: KHIẾU NẠI & TRANH CHẤP -->
              <div id="policyPaneDispute" class="space-y-4 hidden">
                <div class="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#090B10] border border-slate-200 dark:border-slate-800">
                  <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-1">⚖️ CƠ CHẾ TIẾP NHẬN &amp; GIẢI QUYẾT KHIẾU NẠI</h4>
                  <p class="text-xs text-slate-600 dark:text-slate-300">Quy trình xử lý minh bạch, nhanh chóng theo quy định pháp luật thương mại điện tử.</p>
                </div>

                <div class="space-y-3">
                  <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-sm">1. Đầu mối tiếp nhận chính thức</h5>
                    <div class="p-3 rounded-xl bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs mt-1.5">
                      <div>📞 <strong>Hotline/Zalo 24/7:</strong> <a href="https://zalo.me/0986019623" target="_blank" class="font-mono text-[#0071E3] dark:text-[#3B9EFF] font-bold hover:underline">0986019623</a></div>
                      <div>📧 <strong>Email khiếu nại:</strong> <a href="mailto:thaitraicau123@gmail.com" class="font-mono text-slate-800 dark:text-slate-200 hover:underline">thaitraicau123@gmail.com</a></div>
                      <div>🏢 <strong>Chủ quản:</strong> Bùi Thái AI Studio · Hà Nội, Việt Nam</div>
                    </div>
                  </div>

                  <div>
                    <h5 class="font-bold text-slate-900 dark:text-white text-sm">2. Thời gian phản hồi</h5>
                    <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-600 dark:text-slate-300 pl-2">
                      <li><strong>Đối soát nạp Xu:</strong> 30 phút – 2 giờ nếu SePay gặp nghẽn mạng ngân hàng.</li>
                      <li><strong>Hỗ trợ kỹ thuật:</strong> 4 – 12 giờ (tối đa 24 giờ).</li>
                      <li><strong>Hoàn tiền hợp lệ:</strong> 12 – 24 giờ (tối đa 48 giờ).</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            <!-- FOOTER MODAL -->
            <div class="p-4 bg-slate-50/80 dark:bg-[#090B10]/90 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              <div class="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <span>Zalo CSKH: <strong class="text-slate-900 dark:text-white font-mono">0986019623</strong></span>
                <span>·</span>
                <span>MBBank: <strong class="text-[#0071E3] dark:text-[#3B9EFF] font-mono">0986019623</strong></span>
              </div>
              <div class="flex items-center gap-2">
                <a href="https://zalo.me/0986019623" target="_blank" class="px-3.5 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0062C4] text-white font-bold text-xs transition">
                  💬 Nhắn Zalo CSKH
                </a>
                <button type="button" onclick="ShopVietViews.modal.close()" class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer">
                  Đã hiểu &amp; Đóng
                </button>
              </div>
            </div>

          </div>
        </div>
      `;

      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('keydown', handleKeyDown);
      }

      this.switchPolicyTab(activeTab);
    },

    switchPolicyTab: function (tabName) {
      const tabs = ['terms', 'refund', 'privacy', 'dispute'];
      const activeBtnClass = 'px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 border-[#0071E3] dark:border-[#3B9EFF] text-[#0071E3] dark:text-[#3B9EFF] transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer';
      const inactiveBtnClass = 'px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer';

      tabs.forEach(function (t) {
        const pane = document.getElementById('policyPane' + t.charAt(0).toUpperCase() + t.slice(1));
        const btn = document.getElementById('policyTabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
        if (pane) {
          if (t === tabName) {
            pane.classList.remove('hidden');
          } else {
            pane.classList.add('hidden');
          }
        }
        if (btn) {
          btn.className = (t === tabName) ? activeBtnClass : inactiveBtnClass;
        }
      });
    },

    close: function () {
      if (window._sepayModalPollTimer) {
        clearInterval(window._sepayModalPollTimer);
        window._sepayModalPollTimer = null;
      }
      clearPaymentTimer();
      const modalMount = document.getElementById('modalMount');
      if (modalMount) modalMount.innerHTML = '';
      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
        window.removeEventListener('keydown', handleKeyDown);
      }
      currentProduct = null;
      currentQty = 1;
      appliedVoucher = null;
      isPurchasing = false;
      const conf = document.getElementById('confirmPurchaseOverlay');
      if (conf) conf.remove();
      const succ = document.getElementById('purchaseSuccessOverlay');
      if (succ) succ.remove();
    },

    openGameDemo: function (demoUrl, prodId) {
      const url = demoUrl || '/demo/diet-soda/';
      const modalMount = document.getElementById('modalMount');
      if (!modalMount) {
        window.open(url, '_blank');
        return;
      }

      // Lookup product in ShopVietData.products
      let product = null;
      if (window.ShopVietData && Array.isArray(window.ShopVietData.products)) {
        if (prodId) product = window.ShopVietData.products.find(p => p.id === prodId);
        if (!product && url) product = window.ShopVietData.products.find(p => p.demoUrl === url);
      }

      const isDungeon = url.includes('dungeon') || url.includes('thach');
      const isPixel = url.includes('pixelfx');
      const isGame = isDungeon || isPixel;
      const unlockTarget = product ? product.id : (url.includes('metropolis-1998') ? 'source-metropolis-1998-city-builder' : (url.includes('diet-soda') ? 'template-diet-soda-3d-landing' : (isDungeon ? 'prompt-soul-knight-heroes-monsters-200' : 'skill-pixel-vfx-engine')));
      const isMetropolis = url.includes('metropolis-1998') || unlockTarget === 'source-metropolis-1998-city-builder';

      const title = product ? product.name : (isMetropolis ? '🏙️ Source Code Metropolis 1998 Isometric City Builder' : (url.includes('diet-soda') ? '🥤 Template Web 3D Landing Page Diet Soda' : '🎮 Trải Nghiệm 3D Live'));
      const badge = product ? product.badge : (isMetropolis ? 'React 19 + Three.js City Sim' : '3D Web & WebGL Studio');
      const desc = product ? (product.desc || '') : 'Trải nghiệm trực tiếp 60fps trên trình duyệt (Laptop & Mobile), sẵn sàng tải mã nguồn về phát triển tiếp.';
      const currentUser = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user) || null;
      const isUnlocked = Boolean(getExistingActiveOrder(unlockTarget, currentUser ? currentUser.email : ''));
      const unlockButtonLabel = product ? (product.ctaText || `Mở Khóa (${(product.price/1000).toFixed(0)}k Xu)`) : 'Mở Khóa (15k Xu)';
      const techSubline = isMetropolis
        ? 'React 19 + TypeScript + Three.js Isometric · Oakwood / Blank Parcel · X-Ray Cutaway [X]'
        : (isGame
          ? 'Canvas 2D / Web Audio Engine · 60fps Realtime Combat & Particle FX'
          : '1-File HTML thuần · 60fps WebGL/Three.js · Không cần build tool');

      modalMount.innerHTML = `
        <div id="gameDemoBackdrop" class="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-1 sm:p-3 lg:p-4 animate-fade-in" onclick="if(event.target === this) ShopVietViews.modal.close()">
          <div class="bg-[#090B10] border border-slate-800/90 rounded-2xl shadow-2xl w-full max-w-7xl h-[94vh] max-h-[920px] overflow-hidden flex flex-col animate-slide-up text-slate-100">
            
            <!-- Top Navigation & Switcher Bar -->
            <div class="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-800/80 bg-[#0B0F17]/95 flex items-center justify-between gap-3 shrink-0">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0071E3] to-[#3B9EFF] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-sm">BT</span>
                <div class="min-w-0">
                  <h3 class="text-xs sm:text-sm font-bold text-white flex items-center gap-2 truncate">
                    <span class="truncate">${escapeHTML(title)}</span>
                    <span class="hidden md:inline-flex px-2 py-0.5 rounded-md text-[10px] bg-[#0071E3]/15 text-[#3B9EFF] border border-[#0071E3]/30 shrink-0 font-semibold">${escapeHTML(badge)}</span>
                  </h3>
                  <p class="text-[10px] sm:text-[11px] text-slate-400 truncate">${escapeHTML(techSubline)}</p>
                </div>
              </div>

              <!-- Top Device Switcher Controls -->
              <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <div class="hidden sm:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                  <button 
                    type="button" 
                    id="btnViewLaptop"
                    onclick="ShopVietViews.modal.setDeviceMode('laptop')" 
                    class="px-3 py-1.5 rounded-lg bg-[#0071E3]/15 text-[#3B9EFF] border border-[#0071E3]/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    title="Xem trên màn hình Laptop Desktop"
                  >
                    <span>💻</span>
                    <span>Laptop</span>
                  </button>
                  <button 
                    type="button" 
                    id="btnViewMobile"
                    onclick="ShopVietViews.modal.setDeviceMode('mobile')" 
                    class="px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    title="Xem trên khung điện thoại Mobile"
                  >
                    <span>📱</span>
                    <span>Mobile</span>
                  </button>
                </div>

                <a 
                  href="${escapeHTML(url)}" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition no-underline flex items-center gap-1" 
                  title="Mở toàn màn hình trong tab mới"
                >
                  <span>↗</span>
                  <span class="hidden sm:inline">Toàn màn hình</span>
                </a>

                <button 
                  type="button" 
                  onclick="ShopVietViews.modal.close()" 
                  class="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer" 
                  title="Đóng modal"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Modal Body: Split Screen (Stage + Studio Sidebar) -->
            <div class="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 bg-[#05070D]">
              
              <!-- LEFT: Device Interactive Stage -->
              <div class="flex-1 bg-[#05070D] relative flex items-center justify-center p-2 sm:p-4 overflow-hidden min-h-[360px]">
                
                <!-- Laptop Mockup View -->
                <div id="demoLaptopBox" class="w-full h-full max-h-[820px] rounded-xl border border-slate-800/90 bg-[#090B10] shadow-2xl flex flex-col overflow-hidden">
                  <!-- Browser Window Bar -->
                  <div class="px-3 py-1.5 bg-[#0B0F17] border-b border-slate-800 flex items-center justify-between shrink-0">
                    <div class="flex items-center gap-1.5">
                      <span class="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                      <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                    </div>
                    <div class="px-4 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 font-mono tracking-tight flex items-center gap-1.5 max-w-[60%] truncate">
                      <svg class="w-3 h-3 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                      <span class="truncate">live-preview://${escapeHTML(url)}</span>
                    </div>
                    <div class="text-[10px] text-[#3B9EFF] font-mono tabular-nums">60 FPS</div>
                  </div>
                  <!-- Iframe -->
                  <div class="flex-1 w-full bg-black relative">
                    <iframe src="${escapeHTML(url)}" class="w-full h-full border-0" allow="autoplay; fullscreen; accelerometer; gyroscope"></iframe>
                  </div>
                </div>

                <!-- Mobile iPhone Mockup View -->
                <div id="demoMobileBox" style="display: none;" class="w-[340px] sm:w-[375px] h-[640px] sm:h-[720px] max-h-[92vh] rounded-[44px] sm:rounded-[48px] border-[8px] sm:border-[10px] border-slate-800 ring-1 ring-slate-700/80 shadow-2xl bg-black flex flex-col relative overflow-hidden mx-auto shrink-0">
                  <!-- iPhone Status Bar & Dynamic Island -->
                  <div class="pt-2 px-6 flex items-center justify-between text-white text-[11px] font-semibold select-none z-20 shrink-0 tabular-nums">
                    <span>9:41</span>
                    <div class="w-24 h-5 bg-black rounded-full border border-slate-800 flex items-center justify-end px-2">
                      <span class="w-2 h-2 rounded-full bg-emerald-500/80"></span>
                    </div>
                    <div class="flex items-center gap-1 text-[10px]">
                      <span>5G</span>
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
                      <span class="w-4 h-2 border border-white/80 rounded-xs flex items-center p-0.5"><span class="w-full h-full bg-white"></span></span>
                    </div>
                  </div>
                  <!-- Mobile Iframe -->
                  <div class="flex-1 w-full bg-black relative mt-1">
                    <iframe src="${escapeHTML(url)}" class="w-full h-full border-0" allow="autoplay; fullscreen; accelerometer; gyroscope"></iframe>
                  </div>
                  <!-- iPhone Home Indicator -->
                  <div class="py-2 flex justify-center z-20 shrink-0">
                    <div class="w-28 h-1 bg-white/40 rounded-full"></div>
                  </div>
                </div>

              </div>

              <!-- RIGHT: Studio Sidebar -->
              <div class="w-full lg:w-80 xl:w-96 bg-[#0B0F17] border-t lg:border-t-0 lg:border-l border-slate-800/90 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto shrink-0 space-y-4">
                <div class="space-y-4">
                  <div>
                    <div class="text-[10px] font-bold text-[#3B9EFF] uppercase tracking-wider mb-1.5">
                      ${isMetropolis ? 'SOURCE CODE CITY BUILDER · 15K XU' : (isGame ? 'GAME & VFX INTERACTIVE DEMO' : 'TEMPLATE WEB 3D & WEBGL')}
                    </div>
                    <h2 class="text-base sm:text-lg font-bold text-white leading-snug">
                      ${escapeHTML(title)}
                    </h2>
                    <div class="mt-2 text-xs text-slate-300 leading-relaxed font-sans line-clamp-4">
                      ${escapeHTML(desc)}
                    </div>
                  </div>

                  <!-- Device Switcher in Sidebar -->
                  <div class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Chế độ hiển thị (Responsive):</div>
                    <div class="flex items-center gap-1.5">
                      <button 
                        type="button" 
                        id="sideBtnLaptop"
                        onclick="ShopVietViews.modal.setDeviceMode('laptop')" 
                        class="flex-1 py-2 rounded-xl bg-[#0071E3]/15 text-[#3B9EFF] border border-[#0071E3]/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>💻 Laptop</span>
                      </button>
                      <button 
                        type="button" 
                        id="sideBtnMobile"
                        onclick="ShopVietViews.modal.setDeviceMode('mobile')" 
                        class="flex-1 py-2 rounded-xl bg-slate-800/70 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>📱 Mobile</span>
                      </button>
                    </div>
                  </div>

                  <!-- Key Highlights -->
                  <div class="space-y-2 text-xs">
                    <div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Kiến trúc &amp; đặc quyền kỹ thuật:</div>
                    ${isMetropolis ? `
                      <ul class="space-y-1.5 text-slate-300 text-[11px] sm:text-xs">
                        <li class="flex items-start gap-1.5">
                          <span class="text-emerald-400 shrink-0">✓</span>
                          <span>React 19 + TypeScript + Three.js Isometric WebGL chuẩn 60fps</span>
                        </li>
                        <li class="flex items-start gap-1.5">
                          <span class="text-emerald-400 shrink-0">✓</span>
                          <span>Sẵn bản đồ Oakwood / Blank Parcel + chế độ Cutaway X-Ray [X]</span>
                        </li>
                        <li class="flex items-start gap-1.5">
                          <span class="text-emerald-400 shrink-0">✓</span>
                          <span>Chu kỳ Ngày / Đêm / Auto, mô phỏng R/C/I, điện &amp; lưu lượng xe</span>
                        </li>
                        <li class="flex items-start gap-1.5">
                          <span class="text-emerald-400 shrink-0">✓</span>
                          <span>Tải trọn bộ Source Code (.zip) + Master Prompt để phát triển tiếp</span>
                        </li>
                      </ul>
                    ` : `
                      <ul class="space-y-1.5 text-slate-300 text-[11px] sm:text-xs">
                        <li class="flex items-start gap-1.5">
                          <span class="text-emerald-400 shrink-0">✓</span>
                          <span>1-File HTML thuần 100%, 0 build step, mở chạy ngay trên trình duyệt</span>
                        </li>
                        <li class="flex items-start gap-1.5">
                          <span class="text-emerald-400 shrink-0">✓</span>
                          <span>Hiệu ứng WebGL / Canvas 60fps mượt mà trên cả Desktop &amp; Mobile</span>
                        </li>
                        <li class="flex items-start gap-1.5">
                          <span class="text-emerald-400 shrink-0">✓</span>
                          <span>Font bản địa tiếng Việt tối ưu, không lỗi hiển thị dấu</span>
                        </li>
                        <li class="flex items-start gap-1.5">
                          <span class="text-emerald-400 shrink-0">✓</span>
                          <span>Kèm Master Prompt &amp; Cheat Sheet mở rộng không giới hạn trên AI</span>
                        </li>
                      </ul>
                    `}
                  </div>
                </div>

                <!-- Action CTA Controls -->
                <div class="pt-4 border-t border-slate-800/90 space-y-2.5">
                  ${isUnlocked ? `
                    <button 
                      type="button" 
                      onclick="ShopVietViews.modal.copyPrompt('${escapeHTML(unlockTarget)}')" 
                      class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold transition active:scale-95 flex items-center justify-center gap-2 border border-slate-700/80 cursor-pointer"
                    >
                      <span>📋</span>
                      <span>Sao Chép Master Prompt</span>
                    </button>
                  ` : `
                    <button 
                      type="button" 
                      onclick="ShopVietViews.modal.open('${escapeHTML(unlockTarget)}')" 
                      class="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-[#3B9EFF] text-xs font-bold transition active:scale-95 flex items-center justify-center gap-2 border border-[#0071E3]/40 cursor-pointer tabular-nums"
                    >
                      <span>🔒</span>
                      <span>Mở Khóa Trọn Bộ (${product ? (product.price/1000).toFixed(0) : '15'}k Xu)</span>
                    </button>
                  `}

                  <button 
                    type="button" 
                    onclick="ShopVietViews.modal.open('${escapeHTML(unlockTarget)}')" 
                    class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0071E3] to-[#3B9EFF] hover:from-[#0062C4] hover:to-[#2A8CEB] text-white font-bold text-xs shadow-lg shadow-[#0071E3]/25 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 tabular-nums"
                  >
                    <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    <span>${isUnlocked ? '✅ Đã Mở Khóa • Tải Source & Prompt' : escapeHTML(unlockButtonLabel)}</span>
                  </button>
                  <div class="text-[10px] text-center text-slate-400">
                    ${isMetropolis ? 'Bao gồm Source Code (.zip) + Master Prompt + 7 màn hình tham chiếu' : 'Bao gồm toàn bộ file mã nguồn + Master Prompt chi tiết'}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      `;
    },

    setDeviceMode: function (mode) {
      const laptopBox = document.getElementById('demoLaptopBox');
      const mobileBox = document.getElementById('demoMobileBox');
      const btnLaptop = document.getElementById('btnViewLaptop');
      const btnMobile = document.getElementById('btnViewMobile');
      const sideBtnLaptop = document.getElementById('sideBtnLaptop');
      const sideBtnMobile = document.getElementById('sideBtnMobile');

      const activeTopClass = 'px-3 py-1.5 rounded-lg bg-[#0071E3]/15 text-[#3B9EFF] border border-[#0071E3]/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer';
      const inactiveTopClass = 'px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer';
      const activeSideClass = 'flex-1 py-2 rounded-xl bg-[#0071E3]/15 text-[#3B9EFF] border border-[#0071E3]/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer';
      const inactiveSideClass = 'flex-1 py-2 rounded-xl bg-slate-800/70 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer';

      if (mode === 'mobile') {
        if (laptopBox) laptopBox.style.display = 'none';
        if (mobileBox) mobileBox.style.display = 'flex';
        if (btnMobile) btnMobile.className = activeTopClass;
        if (btnLaptop) btnLaptop.className = inactiveTopClass;
        if (sideBtnMobile) sideBtnMobile.className = activeSideClass;
        if (sideBtnLaptop) sideBtnLaptop.className = inactiveSideClass;
      } else {
        if (mobileBox) mobileBox.style.display = 'none';
        if (laptopBox) laptopBox.style.display = 'flex';
        if (btnLaptop) btnLaptop.className = activeTopClass;
        if (btnMobile) btnMobile.className = inactiveTopClass;
        if (sideBtnLaptop) sideBtnLaptop.className = activeSideClass;
        if (sideBtnMobile) sideBtnMobile.className = inactiveSideClass;
      }
    },

    copyPrompt: function (productId) {
      const currentUser = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user) || null;
      const isUnlocked = Boolean(getExistingActiveOrder(productId, currentUser ? currentUser.email : ''));
      if (!isUnlocked) {
        if (window.ShopVietState && window.ShopVietState.showToast) {
          window.ShopVietState.showToast('🔒 Bạn chưa mở khóa sản phẩm này. Vui lòng mở khóa bằng Ví Xu để nhận Master Prompt!', 'warning');
        } else {
          alert('🔒 Bạn chưa mở khóa sản phẩm này. Vui lòng mở khóa bằng Ví Xu để nhận Master Prompt!');
        }
        this.open(productId);
        return;
      }

      let p = window.ShopVietData && Array.isArray(window.ShopVietData.products) ? window.ShopVietData.products.find(item => item.id === productId) : null;
      let prompt = p && p.unlockedPayload && p.unlockedPayload.masterPrompt ? p.unlockedPayload.masterPrompt : (p ? p.desc : '');
      if (!prompt) prompt = "Master Prompt 3D WebGL Template - Bùi Thái Studio";

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(prompt).then(() => {
          if (window.ShopVietState && window.ShopVietState.showToast) {
            window.ShopVietState.showToast('📋 Đã sao chép Master Prompt vào Clipboard!', 'success');
          } else {
            alert('Đã sao chép Master Prompt!');
          }
        }).catch(() => {
          window.prompt('Sao chép Master Prompt:', prompt);
        });
      } else {
        window.prompt('Sao chép Master Prompt:', prompt);
      }
    },

    filterCheatSheetRange: function (start, end, label) {
      const container = document.getElementById('cheatSheetItemsContainer');
      const input = document.getElementById('cheatSheetSearchInput');
      if (input) input.value = '';
      if (!container) return;
      const items = container.querySelectorAll('[data-cheatsheet-item="true"]');
      items.forEach((el, idx) => {
        const num = idx + 1;
        if (num >= start && num <= end) {
          el.style.display = '';
        } else {
          el.style.display = 'none';
        }
      });
      if (window.ShopVietState && window.ShopVietState.showToast) {
        window.ShopVietState.showToast('Đang lọc: ' + label + ' (' + (end - start + 1) + ' câu lệnh)', 'info');
      }
    },

    filterCheatSheet: function (query) {
      const q = (query || '').trim().toLowerCase();
      const container = document.getElementById('cheatSheetItemsContainer');
      if (!container) return;
      const items = container.querySelectorAll('[data-cheatsheet-item="true"]');
      items.forEach(el => {
        const text = el.getAttribute('data-search-text') || el.innerText.toLowerCase();
        if (!q || text.includes(q)) {
          el.style.display = '';
        } else {
          el.style.display = 'none';
        }
      });
    },

    getProductById: getProductById,
    getActiveVietQRConfig: getActiveVietQRConfig
  };

  if (typeof window !== 'undefined') {
    window.openDepositModal = function (amt) {
      if (window.ShopVietViews && window.ShopVietViews.modal && typeof window.ShopVietViews.modal.openDepositModal === 'function') {
        return window.ShopVietViews.modal.openDepositModal(amt);
      }
    };
    window.openPolicyModal = function (tab) {
      if (window.ShopVietViews && window.ShopVietViews.modal && typeof window.ShopVietViews.modal.openPolicy === 'function') {
        return window.ShopVietViews.modal.openPolicy(tab);
      }
    };
    window.openGameDemo = function (url) {
      if (window.ShopVietViews && window.ShopVietViews.modal && typeof window.ShopVietViews.modal.openGameDemo === 'function') {
        return window.ShopVietViews.modal.openGameDemo(url);
      } else {
        window.open(url || '/demo/pixelfx/', '_blank');
      }
    };
  }

})();
