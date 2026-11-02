/**
 * BuiThai AI Studio - Secret Admin Portal View Module
 * Tá»‡p: js/views/admin.js
 * 
 * Cá»•ng Quáº£n Trá»‹ BÃ­ Máº­t (buithai123) chuáº©n xÃ¡c theo phong cÃ¡ch áº¢nh 3:
 * - Báº£o máº­t truy cáº­p: PhÃ­m táº¯t Ctrl + Shift + A, Hash #admin, MÃ£ PIN xÃ¡c thá»±c (buithai123 / admin2026)
 * - Header Modal chuáº©n áº¢nh 3: Icon bÃ¡nh rÄƒng gradient tÃ­m/xanh, TiÃªu Ä‘á» "PhiÃªn quáº£n trá»‹ (buithai123)", Badge "Admin Session", DÃ²ng phá»¥ "Báº¡n váº«n Ä‘ang dÃ¹ng tÃ i khoáº£n Minh Cuong â€¢ PhiÃªn: 59:54 â€¢ Cáº¥u hÃ¬nh: v12", nÃºt LÃ m má»›i, Vá» Trang chá»§, ÄÄƒng xuáº¥t
 * - Tab 1: GiÃ¡ & gÃ³i (Quáº£n lÃ½ sáº£n pháº©m: thÃªm/sá»­a/xÃ³a, giÃ¡ bÃ¡n, giÃ¡ gá»‘c, tá»“n kho, tráº¡ng thÃ¡i, áº£nh/icon, lÆ°u localStorage, realtime cáº­p nháº­t view Home)
 * - Tab 2: Thanh toÃ¡n VietQR & ÄÆ¡n hÃ ng (Duyá»‡t Ä‘Æ¡n, xem áº£nh bill, thá»‘ng kÃª doanh thu)
 * - Tab 3: Cáº¥u hÃ¬nh VietQR (Cáº¥u hÃ¬nh STK, Chá»§ TK, NgÃ¢n hÃ ng, Live VietQR Preview)
 */

(function () {
  'use strict';

  // Khá»Ÿi táº¡o namespace toÃ n cá»¥c
  window.ShopVietViews = window.ShopVietViews || {};

  // Háº±ng sá»‘ báº£o máº­t vÃ  lÆ°u trá»¯
  const STORAGE_KEYS = {
    ADMIN_AUTH: 'shopviet_admin_authenticated',
    PRODUCTS: 'shopviet_admin_products',
    VIETQR_CONFIG: 'shopviet_vietqr_config',
    ACTIVE_TAB: 'shopviet_admin_active_tab'
  };

  // MÃ£ PIN quáº£n trá»‹ há»£p lá»‡
  const VALID_PINS = ['buithai123', 'admin2026'];

  // Cáº¥u hÃ¬nh VietQR máº·c Ä‘á»‹nh - Chuáº©n Techcombank 6688686866688 BUI THAI
  const DEFAULT_VIETQR_CONFIG = {
    bankId: '970407', // Techcombank BIN 970407
    bin: '970407',
    bankName: 'Techcombank (NgÃ¢n hÃ ng TMCP Ká»¹ ThÆ°Æ¡ng Viá»‡t Nam)',
    shortName: 'Techcombank',
    accountNumber: '6688686866688',
    accountName: 'BUI THAI',
    memoPrefix: 'NAPXU',
    brandColor: '#E92429'
  };

  // HÃ m kiá»ƒm tra quyá»n Admin tá»‘i cao: Chá»‰ email thaitraicau123@gmail.com
  function isAllowedAdminUser() {
    const u = window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user;
    return Boolean(u && u.isLoggedIn && u.email === 'thaitraicau123@gmail.com');
  }

  // Danh sÃ¡ch ngÃ¢n hÃ ng há»— trá»£ VietQR
  const SUPPORTED_BANKS = [
    { id: '970422', code: 'MB', name: 'MB Bank (NgÃ¢n hÃ ng QuÃ¢n Äá»™i)' },
    { id: '970407', code: 'TCB', name: 'Techcombank' },
    { id: '970436', code: 'VCB', name: 'Vietcombank' },
    { id: '970415', code: 'CTG', name: 'VietinBank' },
    { id: '970418', code: 'BIDV', name: 'BIDV' },
    { id: '970416', code: 'ACB', name: 'ACB (NgÃ¢n hÃ ng Ã ChÃ¢u)' },
    { id: '970432', code: 'VPB', name: 'VPBank' },
    { id: '970423', code: 'TPB', name: 'TPBank' },
    { id: '970454', code: 'VIB', name: 'VIB (Quá»‘c Táº¿)' },
    { id: '970407', code: 'STB', name: 'Techcombank' }
  ];

  // KhÃ´i phá»¥c sáº£n pháº©m tá»« LocalStorage náº¿u Ä‘Ã£ cÃ³ trÆ°á»›c Ä‘Ã³
  function restoreProductsFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS) || localStorage.getItem('shopviet_custom_products');
      if (saved && window.ShopVietData) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasNewSkills = parsed.some(function (p) {
            return p && p.id === 'combo-web-ui-toolkit';
          });
          if (hasNewSkills) {
            window.ShopVietData.products = parsed;
          }
        }
      }
    } catch (e) {
      console.warn('[Admin Restore Products Error]:', e);
    }
  }

  // Khá»Ÿi Ä‘á»™ng khÃ´i phá»¥c dá»¯ liá»‡u
  restoreProductsFromStorage();

  // Biáº¿n tráº¡ng thÃ¡i ná»™i bá»™ cá»§a Admin Module
  let currentActiveTab = 'pricing'; // 'pricing' | 'orders' | 'vietqr' | 'vouchers' | 'schedules'
  let sessionCountdownSeconds = 59 * 60 + 54; // 59:54
  let sessionIntervalTimer = null;
  let editingProductId = null; // null = táº¡o má»›i, string = sá»­a

  // Lá»‹ch sá»­ & Tráº¡ng thÃ¡i Tráº¡m PhÃ¡t SÃ³ng Thá»i Gian Thá»±c (Realtime Sync Hub)
  function getBroadcastHistory() {
    try {
      const saved = localStorage.getItem('shopviet_broadcast_history');
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      }
    } catch (e) {}
    return [
      {
        id: 'hist-init',
        type: 'system_init',
        title: 'Khá»Ÿi Ä‘á»™ng tráº¡m phÃ¡t sÃ³ng',
        detail: 'Tráº¡m Realtime Sync Hub Ä‘Ã£ sáºµn sÃ ng hoáº¡t Ä‘á»™ng (shopviet_realtime_sync)',
        time: new Date().toLocaleTimeString('vi-VN'),
        date: new Date().toLocaleDateString('vi-VN'),
        timestamp: Date.now(),
        status: 'delivered'
      }
    ];
  }

  function getBroadcastTypeTitle(type) {
    switch (type) {
      case 'products_updated': return 'ðŸ“¦ Cáº­p nháº­t Sáº£n pháº©m';
      case 'vietqr_updated': return 'ðŸ’³ Cáº­p nháº­t Cáº¥u hÃ¬nh VietQR';
      case 'orders_updated': return 'ðŸ“‹ Cáº­p nháº­t ÄÆ¡n hÃ ng & License';
      case 'vouchers_updated': return 'ðŸŽ Cáº­p nháº­t MÃ£ giáº£m giÃ¡';
      case 'schedules_updated': return 'ðŸ“… Cáº­p nháº­t Lá»‹ch háº¹n khÃ¡ch';
      case 'test_ping': return 'âš¡ PhÃ¡t TÃ­n Hiá»‡u Thá»­ Nghiá»‡m (Ping)';
      default: return 'ðŸ“¡ TÃ­n hiá»‡u Realtime';
    }
  }

  function recordBroadcast(type, detail) {
    const timeStr = new Date().toLocaleTimeString('vi-VN');
    const dateStr = new Date().toLocaleDateString('vi-VN');
    const ts = Date.now();
    try {
      localStorage.setItem('shopviet_last_broadcast_time', new Date().toISOString());
      localStorage.setItem('shopviet_last_broadcast_type', type);
      const history = getBroadcastHistory();
      history.unshift({
        id: 'bc-' + ts,
        type: type,
        title: getBroadcastTypeTitle(type),
        detail: detail || 'Äá»“ng bá»™ dá»¯ liá»‡u thá»i gian thá»±c lÃªn má»i mÃ¡y khÃ¡ch',
        time: timeStr,
        date: dateStr,
        timestamp: ts,
        status: 'delivered'
      });
      if (history.length > 25) history.pop();
      localStorage.setItem('shopviet_broadcast_history', JSON.stringify(history));
    } catch (e) {}
  }

  function getLastBroadcastTimeDisplay() {
    try {
      const saved = localStorage.getItem('shopviet_last_broadcast_time');
      if (saved) {
        const d = new Date(saved);
        if (!isNaN(d.getTime())) {
          return d.toLocaleTimeString('vi-VN') + ' ' + d.toLocaleDateString('vi-VN');
        }
      }
    } catch (e) {}
    return 'Vá»«a má»›i Ä‘Ã¢y (Live)';
  }

  // Láº¥y cáº¥u hÃ¬nh VietQR hiá»‡n táº¡i
  function getVietQRConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIETQR_CONFIG);
      if (saved) return Object.assign({}, DEFAULT_VIETQR_CONFIG, JSON.parse(saved));
    } catch (e) {
      console.warn('[Get VietQR Config Error]:', e);
    }
    return DEFAULT_VIETQR_CONFIG;
  }

  // LÆ°u cáº¥u hÃ¬nh VietQR
  function saveVietQRConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEYS.VIETQR_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.warn('[Save VietQR Config Error]:', e);
    }
  }

  // Kiá»ƒm tra tráº¡ng thÃ¡i xÃ¡c thá»±c Admin (há»— trá»£ kiá»ƒm tra trá»±c tiáº¿p quyá»n tá»« ShopVietState.isAdmin)
  function isAuthenticated() {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true' ||
           localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true' ||
           (window.ShopVietState && typeof window.ShopVietState.isAdmin === 'function' && window.ShopVietState.isAdmin());
  }

  // Äáº·t tráº¡ng thÃ¡i xÃ¡c thá»±c
  function setAuthenticated(status) {
    if (status) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  }

  // Helper Ä‘á»‹nh dáº¡ng tiá»n VNÄ
  function formatVND(num) {
    return (Number(num) || 0).toLocaleString('vi-VN') + ' Ä‘';
  }

  // Helper Ä‘á»‹nh dáº¡ng thá»i gian phiÃªn
  function formatSessionTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Helper Ä‘á»‹nh dáº¡ng ngÃ y giá» chuáº©n Viá»‡t Nam
  function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  // Helper Toast
  function notify(msg, type) {
    if (window.ShopVietState && typeof window.ShopVietState.showToast === 'function') {
      window.ShopVietState.showToast(msg, type);
    } else {
      alert(msg);
    }
  }

  // =========================================================================
  // GIAO DIá»†N MODAL NHáº¬P MÃƒ PIN XÃC THá»°C Báº¢O Máº¬T
  // =========================================================================
  function renderPinAuthModal() {
    return `
      <div id="adminPinBackdrop" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div id="adminPinCard" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-slide-up relative overflow-hidden">
          
          <!-- Decorative Top Glow -->
          <div class="absolute -top-20 -left-20 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -top-20 -right-20 w-44 h-44 bg-violet-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Header -->
          <div class="text-center space-y-3 relative z-10">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-amber-900/20">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">Cá»•ng Quáº£n Trá»‹ BÃ­ Máº­t</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Vui lÃ²ng nháº­p mÃ£ PIN quáº£n trá»‹ viÃªn (buithai123)</p>
            </div>
          </div>

          <!-- PIN Form -->
          <form id="adminPinForm" class="mt-6 space-y-4 relative z-10" onsubmit="event.preventDefault(); window.ShopVietViews.admin.submitPin();">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">MÃ£ PIN xÃ¡c thá»±c</label>
              <div class="relative">
                <input 
                  type="password" 
                  id="adminPinInput" 
                  placeholder="Nháº­p mÃ£ PIN bÃ­ máº­t..." 
                  autocomplete="current-password"
                  autofocus
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8A5F26] text-sm tracking-widest font-mono"
                >
                <button 
                  type="button" 
                  id="adminTogglePinEye" 
                  onclick="window.ShopVietViews.admin.togglePinVisibility()" 
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <svg id="adminEyeSvg" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <p id="adminPinError" class="text-xs text-rose-500 font-medium mt-1.5 hidden flex items-center gap-1">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>MÃ£ PIN khÃ´ng chÃ­nh xÃ¡c! Vui lÃ²ng thá»­ láº¡i.</span>
              </p>
            </div>

            <!-- Hint Box -->
            <div class="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
              <span>Gá»£i Ã½ mÃ£ PIN máº·c Ä‘á»‹nh:</span>
              <code class="font-mono font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 cursor-pointer" onclick="document.getElementById('adminPinInput').value='buithai123'">buithai123</code>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 pt-2">
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.close()" 
                class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Há»§y bá»
              </button>
              <button 
                type="submit" 
                class="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-md shadow-amber-900/20 flex items-center justify-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" x2="3" y1="12" y2="12"/>
                </svg>
                <span>VÃ o Quáº£n Trá»‹</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    `;
  }

  // =========================================================================
  // GIAO DIá»†N PHIÃŠN QUáº¢N TRá»Š MODAL CHUáº¨N XÃC THEO PHONG CÃCH áº¢NH 3
  // =========================================================================
  function renderAdminPortalModal() {
    const products = (window.ShopVietData && window.ShopVietData.products) || [];
    const orders = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.orders) || [];
    const vouchers = (window.ShopVietState && window.ShopVietState.getVouchers) ? window.ShopVietState.getVouchers() : [];
    const schedules = (window.ShopVietState && window.ShopVietState.getSchedules) ? window.ShopVietState.getSchedules() : [];
    const vietqr = getVietQRConfig();

    return `
      <div id="adminPortalBackdrop" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fade-in">
        <div id="adminPortalContainer" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-7xl h-[92vh] max-h-[920px] flex flex-col overflow-hidden animate-slide-up">
          
          <!-- ==================== HEADER MODAL CHUáº¨N áº¢NH 3 ==================== -->
          <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-950/70 shrink-0">
            
            <!-- Left Info Cluster -->
            <div class="flex items-center gap-3.5">
              <!-- Icon BÃ¡nh RÄƒng CÃ i Äáº·t TÃ­m/Xanh -->
              <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-amber-900/15 shrink-0">
                <svg class="w-6 h-6 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>

              <!-- TiÃªu Ä‘á» lá»›n & DÃ²ng phá»¥ -->
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <span>PhiÃªn quáº£n trá»‹ (buithai123)</span>
                  </h2>
                  <!-- Badge xanh Admin Session -->
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Admin Session
                  </span>
                </div>
                <!-- DÃ²ng phá»¥ chuáº©n áº¢nh 3 -->
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Báº¡n váº«n Ä‘ang dÃ¹ng tÃ i khoáº£n <strong class="text-slate-700 dark:text-slate-200">Minh Cuong</strong> â€¢ PhiÃªn: <span id="adminSessionTimer" class="font-mono font-semibold text-indigo-600 dark:text-indigo-400">${formatSessionTime(sessionCountdownSeconds)}</span> â€¢ Cáº¥u hÃ¬nh: <span class="font-semibold text-slate-700 dark:text-slate-300">v12</span>
                </p>
              </div>
            </div>

            <!-- Cá»¥m NÃºt Pháº£i: LÃ m Má»›i, Vá» Trang Chá»§, ÄÄƒng Xuáº¥t (ÄÃ£ tinh gá»n chuáº©n Clean SaaS, báº£o toÃ n 100% logic ngáº§m) -->
            <div class="flex items-center gap-2">
              <!-- NÃºt LÃ m Má»›i -->
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.refreshData()" 
                title="LÃ m má»›i dá»¯ liá»‡u (Refresh)"
                class="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold flex items-center gap-1.5"
              >
                <svg class="w-4 h-4 text-slate-500 hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                  <path d="M16 21h5v-5"/>
                </svg>
                <span class="hidden sm:inline">LÃ m má»›i</span>
              </button>

              <!-- NÃºt Vá» Trang Chá»§ -->
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.close()" 
                class="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span>Vá» Trang chá»§</span>
              </button>

              <!-- NÃºt ÄÄƒng Xuáº¥t (ThoÃ¡t Admin) -->
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.logout()" 
                class="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" x2="9" y1="12" y2="12"/>
                </svg>
                <span>ÄÄƒng xuáº¥t</span>
              </button>
            </div>

          </div>

          <!-- ==================== THANH TAB ÄIá»€U HÆ¯á»šNG NGANG ==================== -->
          <div class="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 overflow-x-auto shrink-0">
            <!-- Tab 1: GiÃ¡ & gÃ³i -->
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.switchTab('pricing')" 
              id="adminTabBtn-pricing"
              class="admin-nav-tab px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${currentActiveTab === 'pricing' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              <span>GiÃ¡ & gÃ³i</span>
              <span class="px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-semibold">${products.length}</span>
            </button>

            <!-- Tab 2: Thanh toÃ¡n VietQR & ÄÆ¡n hÃ ng -->
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.switchTab('orders')" 
              id="adminTabBtn-orders"
              class="admin-nav-tab px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${currentActiveTab === 'orders' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <span>Thanh toÃ¡n VietQR & ÄÆ¡n hÃ ng</span>
              <span class="px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-semibold" id="adminOrderTabBadge">${orders.length}</span>
            </button>

            <!-- Tab 3: Cáº¥u hÃ¬nh VietQR -->
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.switchTab('vietqr')" 
              id="adminTabBtn-vietqr"
              class="admin-nav-tab px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${currentActiveTab === 'vietqr' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span>Cáº¥u hÃ¬nh VietQR</span>
            </button>

            <!-- Tab 4: MÃ£ quÃ  táº·ng & Giáº£m giÃ¡ -->
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.switchTab('vouchers')" 
              id="adminTabBtn-vouchers"
              class="admin-nav-tab px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${currentActiveTab === 'vouchers' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
              <span>MÃ£ quÃ  táº·ng & Giáº£m giÃ¡</span>
              <span class="px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-semibold" id="adminVoucherTabBadge">${vouchers.length}</span>
            </button>

            <!-- Tab 5: Quáº£n lÃ½ khÃ¡ch & Háº¹n lá»‹ch (Excel) -->
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.switchTab('schedules')" 
              id="adminTabBtn-schedules"
              class="admin-nav-tab px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${currentActiveTab === 'schedules' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
              </svg>
              <span>Háº¹n lá»‹ch khÃ¡ch (Excel)</span>
              <span class="px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-[10px] text-emerald-700 dark:text-emerald-300 font-bold" id="adminScheduleTabBadge">${schedules.length}</span>
            </button>
          </div>

          <!-- ==================== BODY CONTENT THEO TAB ==================== -->
          <div id="adminTabContent" class="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50">
            ${renderTabBody(currentActiveTab)}
          </div>

        </div>
      </div>
    `;
  }

  // Helper render Tab Body
  function renderTabBody(tabName) {
    if (tabName === 'orders') {
      return renderTabOrders();
    } else if (tabName === 'vietqr') {
      return renderTabVietQR();
    } else if (tabName === 'vouchers') {
      return renderTabVouchers();
    } else if (tabName === 'schedules') {
      return renderTabSchedules();
    } else if (tabName === 'realtime') {
      return renderTabRealtime();
    }
    return renderTabPricing();
  }

  // =========================================================================
  // TAB 1: GIÃ & GÃ“I (QUáº¢N LÃ Sáº¢N PHáº¨M)
  // =========================================================================
  function renderTabPricing() {
    const products = (window.ShopVietData && window.ShopVietData.products) || [];

    return `
      <div class="space-y-5">
        
        <!-- Toolbar PhÃ­a TrÃªn: NÃºt ThÃªm Sáº£n Pháº©m Má»›i & Ã” TÃ¬m Kiáº¿m -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          
          <div class="flex items-center gap-2">
            <!-- NÃºt + ThÃªm sáº£n pháº©m má»›i theo Ä‘Ãºng yÃªu cáº§u Ä‘á» bÃ i -->
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.openProductModal(null)" 
              class="bg-indigo-600 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>ThÃªm sáº£n pháº©m má»›i</span>
            </button>

            <!-- NÃºt KhÃ´i phá»¥c dá»¯ liá»‡u gá»‘c -->
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.resetDefaultProducts()" 
              title="KhÃ´i phá»¥c danh sÃ¡ch sáº£n pháº©m máº«u ban Ä‘áº§u"
              class="p-2 sm:px-3 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition"
            >
              KhÃ´i phá»¥c máº«u
            </button>
          </div>

          <!-- Ã” TÃ¬m kiáº¿m sáº£n pháº©m -->
          <div class="relative flex-1 max-w-sm">
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              id="adminProductSearchInput" 
              oninput="window.ShopVietViews.admin.filterProductTable(this.value)" 
              placeholder="TÃ¬m kiáº¿m sáº£n pháº©m theo tÃªn, danh má»¥c..." 
              class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
            >
          </div>

        </div>

        <!-- Báº£ng Danh SÃ¡ch Sáº£n Pháº©m Trá»±c Quan -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-50 dark:bg-slate-950/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th class="py-3 px-3.5 w-16 text-center">áº¢NH / ICON</th>
                  <th class="py-3 px-4">TÃŠN Sáº¢N PHáº¨M</th>
                  <th class="py-3 px-3.5">DANH Má»¤C</th>
                  <th class="py-3 px-3.5">GIÃ BÃN (VNÄ)</th>
                  <th class="py-3 px-3.5">GIÃ Gá»C (VNÄ)</th>
                  <th class="py-3 px-3 text-center">Tá»’N KHO</th>
                  <th class="py-3 px-3 text-center">TRáº NG THÃI</th>
                  <th class="py-3 px-4 text-right">THAO TÃC</th>
                </tr>
              </thead>
              <tbody id="adminProductTableBody" class="divide-y divide-slate-100 dark:divide-slate-800/80">
                ${products.map(renderProductTableRow).join('')}
              </tbody>
            </table>
          </div>

          ${products.length === 0 ? `
            <div class="py-12 text-center text-slate-400 text-sm">
              ChÆ°a cÃ³ sáº£n pháº©m nÃ o. HÃ£y báº¥m "+ ThÃªm sáº£n pháº©m má»›i" Ä‘á»ƒ báº¯t Ä‘áº§u!
            </div>
          ` : ''}
        </div>

      </div>
    `;
  }

  // Render 1 dÃ²ng trong báº£ng sáº£n pháº©m
  function renderProductTableRow(prod) {
    const iconSvg = (window.ShopVietData && typeof window.ShopVietData.getBrandIcon === 'function') 
      ? window.ShopVietData.getBrandIcon(prod.iconType || 'gemini') 
      : `<svg class="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/></svg>`;

    let statusBadge = '';
    if (prod.status === 'out_of_stock' || prod.stock <= 0) {
      statusBadge = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50">Háº¿t hÃ ng</span>`;
    } else if (prod.status === 'low_stock' || prod.stock <= 5) {
      statusBadge = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50">Sáº¯p háº¿t</span>`;
    } else {
      statusBadge = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50">CÃ²n hÃ ng</span>`;
    }

    return `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
        <!-- áº¢NH / ICON -->
        <td class="py-3 px-3.5 text-center">
          <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2 mx-auto border border-slate-200 dark:border-slate-700 shadow-sm">
            ${iconSvg}
          </div>
        </td>

        <!-- TÃŠN Sáº¢N PHáº¨M -->
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">${prod.name}</div>
          <div class="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
            <span>ID: <code class="font-mono text-slate-400">${prod.id}</code></span>
            ${prod.badge ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${prod.badgeColor || 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'} shadow-xs inline-block">${prod.badge}</span>` : ''}
          </div>
        </td>

        <!-- DANH Má»¤C -->
        <td class="py-3 px-3.5">
          <span class="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            ${prod.tag || 'AI Tool'}
          </span>
        </td>

        <!-- GIÃ BÃN -->
        <td class="py-3 px-3.5 font-bold text-indigo-600 dark:text-indigo-400">
          ${formatVND(prod.price)}
        </td>

        <!-- GIÃ Gá»C -->
        <td class="py-3 px-3.5 text-slate-400 line-through text-xs">
          ${formatVND(prod.oldPrice || prod.price * 2)}
        </td>

        <!-- Tá»’N KHO -->
        <td class="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
          ${prod.stock}
        </td>

        <!-- TRáº NG THÃI -->
        <td class="py-3 px-3 text-center">
          ${statusBadge}
        </td>

        <!-- THAO TÃC -->
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.openProductModal('${prod.id}')" 
              class="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition flex items-center gap-1"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <span>Sá»­a</span>
            </button>
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.deleteProduct('${prod.id}')" 
              class="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold transition"
              title="XÃ³a sáº£n pháº©m"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  // =========================================================================
  // TAB 2: THANH TOÃN VIETQR & ÄÆ N HÃ€NG
  // =========================================================================
  function renderTabOrders() {
    const orders = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.orders) || [];
    
    // TÃ­nh toÃ¡n thá»‘ng kÃª nhanh chuáº©n xÃ¡c
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount || o.total) || 0), 0);
    const completedCount = orders.filter(o => o.status === 'completed').length;
    const pendingReviewCount = orders.filter(o => o.status === 'pending_review').length;
    const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'pending_payment' || o.status === 'pending_review').length;

    return `
      <div class="space-y-5">
        
        <!-- Thá»‘ng KÃª 3 Khá»‘i -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
            <div>
              <div class="text-xs font-medium text-slate-500">Tá»•ng ÄÆ¡n HÃ ng</div>
              <div class="text-xl font-black text-slate-900 dark:text-white mt-0.5">${orders.length} Ä‘Æ¡n</div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <div class="text-xs font-medium text-slate-500">ÄÃ£ HoÃ n Táº¥t</div>
              <div class="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">${completedCount} Ä‘Æ¡n</div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div class="text-xs font-medium text-slate-500">Chá» Duyá»‡t Giao Dá»‹ch</div>
              <div class="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">${pendingReviewCount} Ä‘Æ¡n</div>
            </div>
          </div>
        </div>

        <!-- KHU Vá»°C 1: TRáº M THÃ”NG BÃO Äáº¨Y NTFY (ZERO-CONFIG MOBILE PUSH) -->
        <div class="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-900/90 rounded-2xl p-4 sm:p-5 border border-amber-200/80 dark:border-amber-900/40 shadow-sm">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#8A5F26] text-white flex items-center justify-center shrink-0 shadow-sm">
                <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-bold text-slate-900 dark:text-white text-sm">Tráº¡m ThÃ´ng BÃ¡o Äáº©y Äiá»‡n Thoáº¡i (ntfy.sh)</h4>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Realtime Active
                  </span>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Má»—i khi cÃ³ khÃ¡ch náº¡p xu hoáº·c Ä‘áº·t mua skill, mÃ¡y Ä‘iá»‡n thoáº¡i cá»§a anh ThÃ¡i sáº½ rung chuÃ´ng ngay tá»©c kháº¯c!
                </p>
                <div class="flex items-center gap-2 mt-2 text-[11px] font-mono text-amber-800 dark:text-amber-300">
                  <span>Topic cÃ¡ nhÃ¢n:</span>
                  <code class="px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800 border border-amber-200 dark:border-amber-800/60 font-bold">buithai_studio_0986019623</code>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 w-full md:w-auto">
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.testNtfyNotification && window.ShopVietViews.admin.testNtfyNotification()"
                class="flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#8A5F26] hover:bg-[#704B2A] shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span>ðŸ”” Báº¯n ThÃ´ng BÃ¡o Thá»­</span>
              </button>
              <a 
                href="https://ntfy.sh/buithai_studio_0986019623" 
                target="_blank" 
                class="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 shadow-xs transition flex items-center justify-center gap-1.5"
                title="Má»Ÿ ntfy.sh Ä‘á»ƒ Ä‘Äƒng kÃ½ nháº­n thÃ´ng bÃ¡o trÃªn Ä‘iá»‡n thoáº¡i hoáº·c trÃ¬nh duyá»‡t"
              >
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                <span>Má»Ÿ App ntfy</span>
              </a>
            </div>
          </div>
        </div>

        <!-- KHU Vá»°C 2: DUYá»†T Náº P TIá»€N XU TECHCOMBANK VIETQR (FIREBASE CLOUD SYNC) -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                ðŸ’°
              </div>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white text-sm">Duyá»‡t YÃªu Cáº§u Náº¡p Xu Techcombank 6688686866688 (Firebase Cloud)</h4>
                <span class="text-xs text-slate-500">KhÃ¡ch chuyá»ƒn khoáº£n VietQR xong, anh ThÃ¡i báº¥m Duyá»‡t Ä‘á»ƒ kÃ­ch hoáº¡t xu</span>
              </div>
            </div>
            
            <!-- Form náº¡p xu nhanh cho khÃ¡ch -->
            <div class="flex items-center gap-2 flex-wrap">
              <input type="text" id="adminManualCoinEmail" placeholder="Email khÃ¡ch..." class="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-40 focus:outline-none focus:ring-1 focus:ring-emerald-500">
              <input type="number" id="adminManualCoinAmount" placeholder="Sá»‘ xu..." value="100000" class="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-24 focus:outline-none focus:ring-1 focus:ring-emerald-500">
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.manualAddCoins && window.ShopVietViews.admin.manualAddCoins()"
                class="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition"
              >
                + Cá»™ng Xu
              </button>
            </div>
          </div>

          <!-- Danh sÃ¡ch yÃªu cáº§u náº¡p xu -->
          <div class="p-4">
            ${(function() {
              const topups = (window.ShopVietState && typeof window.ShopVietState.getTopupRequests === 'function') ? window.ShopVietState.getTopupRequests() : [];
              if (topups.length === 0) {
                return `
                  <div class="py-6 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-1.5">
                    <svg class="w-7 h-7 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    <span>Hiá»‡n chÆ°a cÃ³ yÃªu cáº§u náº¡p xu nÃ o má»›i. Khi khÃ¡ch quÃ©t mÃ£ VietQR náº¡p tiá»n, danh sÃ¡ch sáº½ hiá»‡n á»Ÿ Ä‘Ã¢y Ä‘á»ƒ anh duyá»‡t!</span>
                  </div>
                `;
              }
              return `
                <div class="overflow-x-auto">
                  <table class="w-full text-xs text-left">
                    <thead class="text-slate-400 uppercase font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                      <tr>
                        <th class="py-2 px-2">MÃƒ YÃŠU Cáº¦U</th>
                        <th class="py-2 px-2">KHÃCH HÃ€NG</th>
                        <th class="py-2 px-2">Sá» XU Náº P</th>
                        <th class="py-2 px-2">Ná»˜I DUNG CK</th>
                        <th class="py-2 px-2">TRáº NG THÃI</th>
                        <th class="py-2 px-2 text-right">THAO TÃC</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      ${topups.map(function(t) {
                        const isPending = t.status === 'pending_approval';
                        return `
                          <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            <td class="py-2.5 px-2 font-mono font-bold text-slate-900 dark:text-white">${t.id}</td>
                            <td class="py-2.5 px-2">
                              <div class="font-bold text-slate-900 dark:text-white">${t.userName || t.userEmail}</div>
                              <div class="text-[10px] text-slate-400 font-mono">${t.userEmail}</div>
                            </td>
                            <td class="py-2.5 px-2 font-bold text-emerald-600 dark:text-emerald-400">+${(t.amount || 0).toLocaleString('vi-VN')} Xu</td>
                            <td class="py-2.5 px-2 font-mono text-[11px] text-slate-600 dark:text-slate-300">${t.memo || 'NAP TIEN'}</td>
                            <td class="py-2.5 px-2">
                              ${isPending ? `
                                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                  Chá» duyá»‡t
                                </span>
                              ` : `
                                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                                  âœ“ ÄÃ£ duyá»‡t
                                </span>
                              `}
                            </td>
                            <td class="py-2.5 px-2 text-right">
                              ${isPending ? `
                                <div class="flex items-center justify-end gap-1.5">
                                  <button 
                                    type="button" 
                                    onclick="window.ShopVietViews.admin.approveTopup && window.ShopVietViews.admin.approveTopup('${t.id}')"
                                    class="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition cursor-pointer"
                                  >
                                    ✓ Duyệt Nạp Xu
                                  </button>
                                  <button 
                                    type="button" 
                                    onclick="window.ShopVietViews.admin.rejectTopup && window.ShopVietViews.admin.rejectTopup('${t.id}')"
                                    class="px-2 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
                                    title="Từ chối yêu cầu"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ` : (t.status === 'rejected' ? `
                                <span class="text-[11px] text-rose-500 font-medium">Đã từ chối</span>
                              ` : `
                                <span class="text-[11px] text-slate-400">Đã cộng vào ví</span>
                              `)}
                            </td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              `;
            })()}
          </div>
        </div>

        <!-- Báº£ng Danh SÃ¡ch ÄÆ¡n HÃ ng -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white text-sm">Danh SÃ¡ch ÄÆ¡n HÃ ng VietQR Má»›i Nháº¥t</h4>
              <span class="text-xs text-slate-500">Äá»“ng bá»™ tá»± Ä‘á»™ng tá»« há»‡ thá»‘ng thanh toÃ¡n</span>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.refreshOrdersTab && window.ShopVietViews.admin.refreshOrdersTab()" 
                id="adminRefreshOrdersBtn"
                class="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                title="Báº¥m Ä‘á»ƒ táº£i láº¡i Ä‘Æ¡n hÃ ng má»›i nháº¥t tá»©c thÃ¬"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                <span>LÃ m má»›i Ä‘Æ¡n hÃ ng</span>
              </button>
              <button 
                type="button" 
                onclick="window.requestAdminNotificationPermission && window.requestAdminNotificationPermission(true)" 
                id="adminPushNotifToggleBtn"
                class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${typeof Notification !== 'undefined' && Notification.permission === 'granted' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'}"
                title="Báº­t/Kiá»ƒm tra thÃ´ng bÃ¡o PWA trÃªn mÃ n hÃ¬nh khÃ³a iPhone (iOS 16.4+) vÃ  Desktop"
              >
                <span>ðŸ””</span>
                <span id="adminPushNotifStatusText">${typeof Notification !== 'undefined' && Notification.permission === 'granted' ? 'ThÃ´ng bÃ¡o iPhone: Äang báº­t' : 'Báº­t ThÃ´ng BÃ¡o iPhone'}</span>
              </button>
              <button 
                type="button" 
                onclick="window.testAdminPushNotification && window.testAdminPushNotification()" 
                id="adminPushNotifTestBtn"
                class="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                title="Báº¥m Ä‘á»ƒ kiá»ƒm tra iPhone nháº­n thÃ´ng bÃ¡o tá»©c thÃ¬ trÃªn mÃ n hÃ¬nh khÃ³a"
              >
                <span>âš¡</span>
                <span>Thá»­ nghiá»‡m thÃ´ng bÃ¡o iPhone</span>
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-50 dark:bg-slate-950/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th class="py-3 px-4">MÃƒ ÄÆ N</th>
                  <th class="py-3 px-3.5">NGÃ€Y Táº O</th>
                  <th class="py-3 px-3.5">KHÃCH HÃ€NG</th>
                  <th class="py-3 px-4">GÃ“I Sáº¢N PHáº¨M</th>
                  <th class="py-3 px-3.5">Sá» TIá»€N</th>
                  <th class="py-3 px-3 text-center">TRáº NG THÃI</th>
                  <th class="py-3 px-3 text-center">BILL CHUYá»‚N KHOáº¢N</th>
                  <th class="py-3 px-4 text-right">THAO TÃC</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
                ${orders.length > 0 ? orders.map(renderOrderTableRow).join('') : `
                  <tr>
                    <td colspan="8" class="py-12 text-center text-slate-400">ChÆ°a cÃ³ Ä‘Æ¡n hÃ ng nÃ o phÃ¡t sinh</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  // Render 1 dÃ²ng trong báº£ng Ä‘Æ¡n hÃ ng
  function renderOrderTableRow(order, index) {
    let rawCode = order.orderCode || order.memo || order.paymentMemo || order.id || `DJ2026${index + 100}`;
    if (rawCode === 'ORD-TEST-999' || rawCode.startsWith('ORD-TEST')) {
      rawCode = 'DJ2026889';
    }
    const code = rawCode.startsWith('#') ? rawCode : '#' + rawCode;
    const dateStr = order.createdAtFormatted || order.date || 'HÃ´m nay';
    const customerEmail = order.userEmail || (order.user && order.user.email) || (order.customer && order.customer.email) || (order.email) || 'thaitraicau123@gmail.com';
    const customerName = order.customerName || (order.user && order.user.name) || (order.customer && order.customer.name) || 'BÃ¹i ThÃ¡i';
    const productName = order.productName || (order.items && order.items[0] && order.items[0].name) || 'Antigravity + Gemini Pro';
    const amount = order.amount || order.total || order.price || 69000;
    const isCompleted = order.status === 'completed';

    return `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
        <!-- MÃƒ ÄÆ N -->
        <td class="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
          ${code}
        </td>

        <!-- NGÃ€Y Táº O -->
        <td class="py-3 px-3.5 text-xs text-slate-500">
          ${dateStr}
        </td>

        <!-- KHÃCH HÃ€NG -->
        <td class="py-3 px-3">
          <div class="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[200px]" title="${customerEmail}">
            ${customerEmail}
          </div>
          <div class="text-[10px] text-slate-400 font-medium">
            ${customerName} â€¢ VietQR Techcombank
          </div>
        </td>

        <!-- GÃ“I Sáº¢N PHáº¨M -->
        <td class="py-3 px-4 max-w-xs">
          <div class="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">${productName}</div>
          ${order.licenseKey ? `<div class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 line-clamp-1 mt-0.5">Key: ${order.licenseKey}</div>` : ''}
        </td>

        <!-- Sá» TIá»€N -->
        <td class="py-3 px-3.5 font-bold text-slate-900 dark:text-white">
          ${formatVND(amount)}
        </td>

        <!-- TRáº NG THÃI -->
        <td class="py-3 px-3 text-center">
          ${order.status === 'completed' ? `
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              âœ“ HoÃ n táº¥t
            </span>
          ` : order.status === 'rejected' ? `
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              âœ• ÄÃ£ tá»« chá»‘i
            </span>
          ` : order.status === 'pending_review' ? `
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 backdrop-blur-xs shadow-xs">
              <svg class="w-3.5 h-3.5 animate-[spin_3s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke-width="2" stroke-dasharray="4 2"/>
                <polyline points="12 6 12 12 15 14" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>Chá» duyá»‡t</span>
            </span>
          ` : `
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
              Chá» thanh toÃ¡n
            </span>
          `}
        </td>

        <!-- BILL CHUYá»‚N KHOáº¢N -->
        <td class="py-3 px-3 text-center">
          <button 
                type="button" 
                onclick="window.ShopVietViews.admin.viewBillModal('${code}', '${amount}')" 
                class="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <span>Xem bill</span>
          </button>
        </td>

        <!-- THAO TÃC -->
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5 flex-wrap">
            ${!isCompleted ? `
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.openDeliveryModal('${code}')" 
                class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Duyá»‡t Ä‘Æ¡n</span>
              </button>
              ${order.status !== 'rejected' ? `
                <button 
                  type="button" 
                  onclick="window.ShopVietViews.admin.rejectOrder('${code}')" 
                  class="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 font-bold text-xs shadow-sm transition flex items-center gap-1 cursor-pointer"
                  title="Tá»« chá»‘i Ä‘Æ¡n hÃ ng & hoÃ n tráº£ láº¡i sá»‘ lÆ°á»£ng vÃ o kho"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  <span>âœ• Tá»« chá»‘i</span>
                </button>
              ` : ''}
            ` : `
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.openDeliveryModal('${code}')" 
                class="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition flex items-center gap-1 cursor-pointer" 
                title="Sá»­a link báº£n quyá»n riÃªng hoáº·c gá»­i láº¡i tin nháº¯n dáº·n dÃ²"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                <span>TÃ¹y chá»‰nh gá»­i link</span>
              </button>
            `}
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.deleteOrder('${order.id || code}')" 
              title="XÃ³a Ä‘Æ¡n hÃ ng" 
              class="p-2 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-all cursor-pointer shrink-0 ml-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
          ${order.customDeliveryLink ? `
            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono mt-1">ÄÃ£ gá»­i link riÃªng</span>
          ` : order.status === 'rejected' ? `
            <span class="text-[10px] text-rose-500 dark:text-rose-400 block font-medium mt-1">ÄÃ£ tá»« chá»‘i Ä‘Æ¡n</span>
          ` : isCompleted ? `
            <span class="text-[10px] text-slate-400 block font-medium mt-1">ÄÃ£ kÃ­ch hoáº¡t</span>
          ` : ''}
        </td>
      </tr>
    `;
  }

  // =========================================================================
  // TAB 3: Cáº¤U HÃŒNH VIETQR
  // =========================================================================
  function renderTabVietQR() {
    const config = getVietQRConfig();
    const qrPreviewUrl = `https://api.vietqr.io/image/${config.bankId}-${config.accountNumber}-compact2.png?amount=69000&accountName=${encodeURIComponent(config.accountName)}&addInfo=${encodeURIComponent(config.memoPrefix + ' DEMO')}`;

    return `
      <div class="max-w-4xl mx-auto space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <!-- Cá»™t TrÃ¡i: Form Chá»‰nh Sá»­a ThÃ´ng Tin NgÃ¢n HÃ ng -->
          <div class="md:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <svg class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span>Cáº¥u hÃ¬nh tÃ i khoáº£n nháº­n tiá»n VietQR</span>
              </h3>
              <p class="text-xs text-slate-500 mt-1">ThÃ´ng tin nÃ y sáº½ Ä‘Æ°á»£c gáº¯n tá»± Ä‘á»™ng vÃ o mÃ£ QR táº¡o ra khi khÃ¡ch báº¥m Äáº·t HÃ ng.</p>
            </div>

            <form id="adminVietQRForm" onsubmit="event.preventDefault(); window.ShopVietViews.admin.saveVietQRSettings();" class="space-y-4 pt-2">
              
              <!-- Chá»n NgÃ¢n HÃ ng -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">NgÃ¢n hÃ ng thá»¥ hÆ°á»Ÿng</label>
                <select 
                  id="adminVietQRBank" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8A5F26] font-medium"
                  onchange="window.ShopVietViews.admin.updateQRPreview()"
                >
                  ${SUPPORTED_BANKS.map(b => `
                    <option value="${b.id}" ${b.id === config.bankId ? 'selected' : ''}>${b.name} (${b.code})</option>
                  `).join('')}
                </select>
              </div>

              <!-- Sá»‘ TÃ i Khoáº£n (STK) -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Sá»‘ tÃ i khoáº£n (STK)</label>
                <input 
                  type="text" 
                  id="adminVietQRAccountNumber" 
                  value="${config.accountNumber}" 
                  placeholder="VÃ­ dá»¥: 00223366888" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8A5F26] font-mono font-bold"
                  oninput="window.ShopVietViews.admin.updateQRPreview()"
                >
              </div>

              <!-- TÃªn Chá»§ TÃ i Khoáº£n -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">TÃªn chá»§ tÃ i khoáº£n (In hoa khÃ´ng dáº¥u)</label>
                <input 
                  type="text" 
                  id="adminVietQRAccountName" 
                  value="${config.accountName}" 
                  placeholder="VÃ­ dá»¥: NGUYEN VAN HUY" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8A5F26] uppercase font-semibold"
                  oninput="window.ShopVietViews.admin.updateQRPreview()"
                >
              </div>

              <!-- Tiá»n Tá»‘ Lá»i Nháº¯n Chuyá»ƒn Khoáº£n -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Tiá»n tá»‘ cÃº phÃ¡p chuyá»ƒn khoáº£n</label>
                <input 
                  type="text" 
                  id="adminVietQRMemoPrefix" 
                  value="${config.memoPrefix}" 
                  placeholder="VÃ­ dá»¥: THAIBUI" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8A5F26] font-mono font-bold uppercase"
                  oninput="window.ShopVietViews.admin.updateQRPreview()"
                >
                <span class="text-[11px] text-slate-400 mt-1 block">VÃ­ dá»¥ táº¡o ná»™i dung: <code>${config.memoPrefix} DJ202688</code></span>
              </div>

              <!-- NÃºt LÆ°u -->
              <div class="pt-2">
                <button 
                  type="submit" 
                  class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-amber-900/15 transition flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  <span>LÆ°u Cáº¥u HÃ¬nh VietQR</span>
                </button>
              </div>

            </form>
          </div>

          <!-- Cá»™t Pháº£i: Live VietQR Preview -->
          <div class="md:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Xem TrÆ°á»›c MÃ£ VietQR Live</span>
            
            <div class="p-3 bg-white rounded-2xl shadow-lg border border-slate-200 max-w-[240px] w-full">
              <img 
                id="adminVietQRPreviewImg" 
                src="${qrPreviewUrl}" 
                alt="VietQR Preview" 
                class="w-full h-auto rounded-xl object-contain"
                onerror="this.src='https://api.vietqr.io/image/970422-00223366888-compact2.png'"
              >
            </div>

            <div class="text-xs text-slate-500 space-y-1">
              <div class="font-bold text-slate-900 dark:text-white" id="adminPreviewBankTitle">${config.bankName}</div>
              <div class="font-mono" id="adminPreviewSTK">STK: ${config.accountNumber}</div>
              <div class="font-semibold text-indigo-600 dark:text-indigo-400" id="adminPreviewOwner">${config.accountName}</div>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  // =========================================================================
  // TAB 4: MÃƒ QUÃ€ Táº¶NG & GIáº¢M GIÃ (VOUCHERS & GIFTS)
  // =========================================================================
  function renderTabVouchers() {
    const vouchers = (window.ShopVietState && window.ShopVietState.getVouchers) ? window.ShopVietState.getVouchers() : [];
    
    // Thá»‘ng kÃª nhanh
    const totalCount = vouchers.length;
    const usedCount = vouchers.filter(v => v.isUsed).length;
    const availableCount = totalCount - usedCount;
    const totalDiscountGiven = vouchers.filter(v => v.isUsed).reduce((sum, v) => sum + (Number(v.value) || 0), 0);

    return `
      <div class="space-y-5">
        
        <!-- Thá»‘ng KÃª 4 Khá»‘i Tháº» Hiá»‡n Äáº¡i -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- Tá»•ng mÃ£ -->
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            </div>
            <div>
              <div class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Tá»•ng mÃ£ voucher</div>
              <div class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5" id="adminVoucherTotalCount">${totalCount} mÃ£</div>
            </div>
          </div>

          <!-- Sáºµn sÃ ng dÃ¹ng -->
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <div class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">ChÆ°a sá»­ dá»¥ng</div>
              <div class="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5" id="adminVoucherAvailableCount">${availableCount} mÃ£</div>
            </div>
          </div>

          <!-- ÄÃ£ dÃ¹ng -->
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">ÄÃ£ sá»­ dá»¥ng</div>
              <div class="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5" id="adminVoucherUsedCount">${usedCount} mÃ£</div>
            </div>
          </div>

          <!-- Tá»•ng tiá»n Ä‘Ã£ giáº£m -->
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div>
              <div class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Tá»•ng tiá»n Ä‘Ã£ giáº£m</div>
              <div class="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5" id="adminVoucherTotalDiscount">${formatVND(totalDiscountGiven)}</div>
            </div>
          </div>
        </div>

        <!-- Toolbar PhÃ­a TrÃªn: NÃºt + Táº¡o mÃ£ má»›i & Ã” TÃ¬m kiáº¿m -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          
          <div class="flex items-center gap-2">
            <!-- NÃºt + Táº¡o mÃ£ má»›i -->
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.openVoucherModal()" 
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Táº¡o mÃ£ má»›i</span>
            </button>

            <!-- NÃºt Náº¡p mÃ£ máº·c Ä‘á»‹nh máº«u -->
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.resetDefaultVouchers()" 
              title="KhÃ´i phá»¥c mÃ£ máº«u náº¿u rá»—ng"
              class="p-2 sm:px-3 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition"
            >
              KhÃ´i phá»¥c máº«u
            </button>
          </div>

          <!-- Ã” TÃ¬m kiáº¿m voucher -->
          <div class="relative flex-1 max-w-sm">
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              id="adminVoucherSearchInput" 
              oninput="window.ShopVietViews.admin.filterVouchers(this.value)" 
              placeholder="TÃ¬m mÃ£ voucher, ngÆ°á»i dÃ¹ng, loáº¡i mÃ£..." 
              class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8A5F26] font-medium"
            >
          </div>

        </div>

        <!-- Báº£ng Danh SÃ¡ch Voucher -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h4 class="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 12 20 22 4 22 4 12"/>
                <rect x="2" y="7" width="20" height="5"/>
                <line x1="12" y1="22" x2="12" y2="7"/>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
              <span>Kho mÃ£ quÃ  táº·ng & giáº£m giÃ¡</span>
              <span class="text-xs px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold" id="adminVoucherTableBadge">${vouchers.length} mÃ£</span>
            </h4>
            <span class="text-xs text-slate-500">MÃ£ cÃ³ hiá»‡u lá»±c Ã¡p dá»¥ng táº¡i trang Äáº·t hÃ ng & Náº¡p vÃ­</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm" id="adminVoucherTable">
              <thead class="bg-slate-50 dark:bg-slate-950/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th class="py-3 px-4">MÃƒ VOUCHER</th>
                  <th class="py-3 px-3.5">LOáº I MÃƒ</th>
                  <th class="py-3 px-3.5">GIÃ TRá»Š GIáº¢M</th>
                  <th class="py-3 px-3.5 text-center">TRáº NG THÃI</th>
                  <th class="py-3 px-4">NGÆ¯á»œI ÄÃƒ DÃ™NG (EMAIL)</th>
                  <th class="py-3 px-3.5">ÄÆ N HÃ€NG</th>
                  <th class="py-3 px-3.5">THá»œI GIAN</th>
                  <th class="py-3 px-4 text-right">THAO TÃC</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80" id="adminVoucherTableTbody">
                ${vouchers.length > 0 ? vouchers.map(renderVoucherTableRow).join('') : `
                  <tr>
                    <td colspan="8" class="py-12 text-center text-slate-400">
                      <div class="flex flex-col items-center justify-center gap-2">
                        <svg class="w-10 h-10 text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /></svg>
                        <span>ChÆ°a cÃ³ mÃ£ voucher nÃ o. HÃ£y báº¥m "+ Táº¡o mÃ£ má»›i" Ä‘á»ƒ thÃªm mÃ£ Ä‘áº§u tiÃªn!</span>
                      </div>
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  // Render 1 dÃ²ng trong báº£ng voucher
  function renderVoucherTableRow(v) {
    const isUsed = !!v.isUsed;
    const isPercent = v.type === 'percent_discount' || (v.percent !== undefined && v.percent !== null);
    const typeLabel = v.type === 'wallet_gift' 
      ? 'Náº¡p tiá»n vÃ o vÃ­' 
      : (isPercent ? 'Giáº£m theo % Ä‘Æ¡n hÃ ng' : 'Giáº£m sá»‘ tiá»n cá»‘ Ä‘á»‹nh (VNÄ)');
    const typeBadge = v.type === 'wallet_gift' 
      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800'
      : (isPercent 
        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
        : 'bg-amber-50 text-[#8A5F26] dark:bg-amber-950/40 dark:text-[#BE9455] border-amber-200 dark:border-amber-800');

    const discountText = isPercent ? `-${v.percent || v.value}%` : `-${formatVND(v.value)}`;

    return `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors" data-code="${(v.code || '').toLowerCase()}" data-user="${(v.usedBy || '').toLowerCase()}">
        <!-- MÃƒ VOUCHER -->
        <td class="py-3 px-4">
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60">${v.code}</span>
            <button 
              type="button" 
              onclick="navigator.clipboard.writeText('${v.code}'); window.ShopVietState.showToast('ÄÃ£ sao chÃ©p mÃ£ ${v.code}!', 'info');" 
              title="Sao chÃ©p mÃ£"
              class="text-slate-400 hover:text-indigo-600 transition p-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
        </td>

        <!-- LOáº I MÃƒ -->
        <td class="py-3 px-3.5">
          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${typeBadge}">
            ${typeLabel}
          </span>
        </td>

        <!-- GIÃ TRá»Š GIáº¢M -->
        <td class="py-3 px-3.5 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
          ${discountText}
        </td>

        <!-- TRáº NG THÃI -->
        <td class="py-3 px-3.5 text-center">
          ${isUsed ? `
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              ÄÃ£ sá»­ dá»¥ng
            </span>
          ` : `
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ChÆ°a sá»­ dá»¥ng
            </span>
          `}
        </td>

        <!-- NGÆ¯á»œI ÄÃƒ DÃ™NG (EMAIL) -->
        <td class="py-3 px-4">
          ${isUsed && v.usedBy ? `
            <div class="flex items-center gap-1.5">
              <div class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                ${v.usedBy.charAt(0).toUpperCase()}
              </div>
              <span class="font-medium text-slate-800 dark:text-slate-200 text-xs">${v.usedBy}</span>
            </div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">ÄÃ£ Ä‘Æ°á»£c giáº£m ${discountText}</div>
          ` : `
            <span class="text-slate-400 text-xs">-</span>
          `}
        </td>

        <!-- ÄÆ N HÃ€NG -->
        <td class="py-3 px-3.5">
          ${v.orderCode ? `
            <span class="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">${v.orderCode}</span>
          ` : `
            <span class="text-slate-400">-</span>
          `}
        </td>

        <!-- THá»œI GIAN -->
        <td class="py-3 px-3.5 text-xs text-slate-500">
          ${isUsed && v.usedAt ? `
            <div class="font-medium text-slate-700 dark:text-slate-300">${formatDateTime(v.usedAt)}</div>
            <div class="text-[10px] text-slate-400">Táº¡o: ${formatDateTime(v.createdAt)}</div>
          ` : `
            <div>Táº¡o: ${formatDateTime(v.createdAt)}</div>
          `}
        </td>

        <!-- THAO TÃC -->
        <td class="py-3 px-4 text-right">
          <button 
            type="button" 
            onclick="window.ShopVietViews.admin.deleteVoucher('${v.code}')" 
            title="XÃ³a voucher" 
            class="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </td>
      </tr>
    `;
  }

  // =========================================================================
  // TAB 5: QUáº¢N LÃ KHÃCH & Háº¸N Lá»ŠCH (EXCEL / SPREADSHEET)
  // =========================================================================
  function renderTabSchedules() {
    const schedules = (window.ShopVietState && window.ShopVietState.getSchedules) ? window.ShopVietState.getSchedules() : [];
    
    // Thá»‘ng kÃª háº¡n dÃ¹ng
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activeCount = 0;
    let expiringCount = 0;
    let expiredCount = 0;

    schedules.forEach(s => {
      const exp = new Date(s.expireDate);
      exp.setHours(0, 0, 0, 0);
      const diffMs = exp.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (daysLeft > 7) {
        activeCount++;
      } else if (daysLeft > 0) {
        expiringCount++;
      } else {
        expiredCount++;
      }
    });

    return `
      <div class="space-y-5">
        
        <!-- Thá»‘ng KÃª 4 Khá»‘i Tháº» Hiá»‡n Äáº¡i -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- Tá»•ng khÃ¡ch háº¹n lá»‹ch -->
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Tá»•ng khÃ¡ch háº¹n lá»‹ch</div>
              <div class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">${schedules.length} khÃ¡ch</div>
            </div>
          </div>

          <!-- Äang hoáº¡t Ä‘á»™ng -->
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Äang sá»­ dá»¥ng (>7 ngÃ y)</div>
              <div class="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">${activeCount} khÃ¡ch</div>
            </div>
          </div>

          <!-- Sáº¯p háº¿t háº¡n -->
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
              <div class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Sáº¯p háº¿t háº¡n (â‰¤7 ngÃ y)</div>
              <div class="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">${expiringCount} khÃ¡ch</div>
            </div>
          </div>

          <!-- ÄÃ£ háº¿t háº¡n -->
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <div>
              <div class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">ÄÃ£ háº¿t háº¡n</div>
              <div class="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">${expiredCount} khÃ¡ch</div>
            </div>
          </div>
        </div>

        <!-- Toolbar PhÃ­a TrÃªn: NÃºt + ThÃªm email khÃ¡ch hÃ ng, Xuáº¥t Excel & Ã” TÃ¬m kiáº¿m -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          
          <div class="flex items-center flex-wrap gap-2">
            <!-- NÃºt + ThÃªm email khÃ¡ch hÃ ng -->
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.openScheduleModal(null)" 
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>ThÃªm email khÃ¡ch hÃ ng</span>
            </button>

            <!-- NÃºt Xuáº¥t Excel (CSV) -->
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.exportSchedulesToExcel()" 
              class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
              title="Xuáº¥t báº£ng tÃ­nh hiá»‡n táº¡i ra file CSV tÆ°Æ¡ng thÃ­ch Microsoft Excel"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <polyline points="9 15 12 18 15 15"/>
              </svg>
              <span>Xuáº¥t Excel</span>
            </button>

            <!-- NÃºt KhÃ´i phá»¥c dá»¯ liá»‡u máº«u -->
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.resetDefaultSchedules()" 
              title="KhÃ´i phá»¥c danh sÃ¡ch háº¹n lá»‹ch máº«u" 
              class="p-2 sm:px-3 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition shrink-0"
            >
              KhÃ´i phá»¥c máº«u
            </button>
          </div>

          <!-- Ã” TÃ¬m Kiáº¿m Email khÃ¡ch, Quáº£n lÃ½, GÃ³i -->
          <div class="relative w-full sm:w-72">
            <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              id="adminScheduleSearchInput"
              oninput="window.ShopVietViews.admin.filterSchedules(this.value)" 
              placeholder="TÃ¬m email khÃ¡ch, slot, gÃ³i..." 
              class="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8A5F26] transition-all"
            >
          </div>

        </div>

        <!-- Báº£ng TÃ­nh Excel ThÃ´ng Minh (Smart Spreadsheet Table) -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/>
                </svg>
                <span>Báº£ng tÃ­nh Excel quáº£n lÃ½ khÃ¡ch & háº¹n lá»‹ch slot</span>
              </span>
              <span class="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 text-xs font-semibold" id="adminScheduleTableBadge">
                ${schedules.length} báº£n ghi
              </span>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Click trá»±c tiáº¿p vÃ o Ã´ Ä‘á»ƒ sá»­a & áº¥n nÃºt <b>LÆ°u</b> (hoáº·c Enter) Ä‘á»ƒ Ä‘á»“ng bá»™ tá»©c thÃ¬ lÃªn ÄÃ¡m MÃ¢y Cloud</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50 text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                  <th class="py-3 px-3 text-center w-12">STT</th>
                  <th class="py-3 px-3.5">Email KhÃ¡ch HÃ ng</th>
                  <th class="py-3 px-3.5">Email Quáº£n LÃ½ / Slot</th>
                  <th class="py-3 px-3.5">GÃ³i Dá»‹ch Vá»¥</th>
                  <th class="py-3 px-3 text-center">NgÃ y Báº¯t Äáº§u</th>
                  <th class="py-3 px-3 text-center">NgÃ y Háº¿t Háº¡n</th>
                  <th class="py-3 px-3.5 text-center">Tráº¡ng ThÃ¡i Háº¡n DÃ¹ng</th>
                  <th class="py-3 px-3 text-right">Thao TÃ¡c</th>
                </tr>
              </thead>
              <tbody id="adminScheduleTableTbody" class="divide-y divide-slate-100 dark:divide-slate-800/60">
                ${schedules.length > 0 ? schedules.map((s, idx) => renderScheduleTableRow(s, idx)).join('') : `
                  <tr>
                    <td colspan="8" class="py-12 text-center text-slate-400">ChÆ°a cÃ³ lá»‹ch háº¹n khÃ¡ch hÃ ng nÃ o Ä‘Æ°á»£c táº¡o</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  // Render 1 dÃ²ng trong Báº£ng Excel Háº¹n Lá»‹ch vá»›i Inline Editable & NÃºt LÆ°u Cloud
  function renderScheduleTableRow(s, index) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(s.expireDate);
    exp.setHours(0, 0, 0, 0);
    const diffMs = exp.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let statusBadge = '';
    if (daysLeft > 7) {
      statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-sm"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>CÃ²n ${daysLeft} ngÃ y</span>`;
    } else if (daysLeft > 0) {
      statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800 shadow-sm animate-pulse"><span class="w-2 h-2 rounded-full bg-amber-500"></span>Sáº¯p háº¿t (${daysLeft} ngÃ y)</span>`;
    } else {
      statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-800 shadow-sm"><span class="w-2 h-2 rounded-full bg-rose-500"></span>ÄÃ£ háº¿t háº¡n</span>`;
    }

    const customerEmail = s.customerEmail || 'thaitraicau123@gmail.com';
    const customerName = s.customerName || 'BÃ¹i ThÃ¡i';
    const managerEmail = s.managerEmail || 'slot1-pro@shopviet.vip';
    const serviceName = s.serviceName || '[1 ThÃ¡ng] Gemini Argon 4 Pro + 5TB Drive';
    const notes = s.notes || '';

    return `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors" data-id="${s.id}" data-customer="${customerEmail.toLowerCase()}" data-manager="${managerEmail.toLowerCase()}" data-service="${serviceName.toLowerCase()}" data-notes="${notes.toLowerCase()}">
        <!-- STT -->
        <td class="py-2.5 px-3 text-center font-mono text-slate-400 font-semibold text-xs">
          ${index + 1}
        </td>

        <!-- EMAIL KHÃCH HÃ€NG (INLINE EDITABLE) -->
        <td class="py-2 px-3">
          <input 
            type="text" 
            id="sched-customer-${s.id}" 
            value="${customerEmail}" 
            placeholder="thaitraicau123@gmail.com"
            onkeydown="if(event.key==='Enter') window.ShopVietViews.admin.saveInlineSchedule('${s.id}')"
            title="Click trá»±c tiáº¿p vÃ o Ã´ Ä‘á»ƒ sá»­a Email KhÃ¡ch HÃ ng (Enter Ä‘á»ƒ LÆ°u)"
            class="w-full bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#8A5F26] focus:bg-white dark:focus:bg-slate-900 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 dark:text-white focus:outline-none transition-all"
          />
          <div class="px-2 text-[10px] text-slate-400 font-medium truncate max-w-[200px]" title="${customerName}">
            ${customerName}
          </div>
        </td>

        <!-- EMAIL QUáº¢N LÃ / SLOT (INLINE EDITABLE) -->
        <td class="py-2 px-3">
          <input 
            type="text" 
            id="sched-manager-${s.id}" 
            value="${managerEmail}" 
            placeholder="slot1-pro@shopviet.vip"
            onkeydown="if(event.key==='Enter') window.ShopVietViews.admin.saveInlineSchedule('${s.id}')"
            title="Click trá»±c tiáº¿p vÃ o Ã´ Ä‘á»ƒ sá»­a Email Slot (Enter Ä‘á»ƒ LÆ°u)"
            class="w-full bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 hover:border-indigo-400 focus:border-[#8A5F26] focus:bg-white dark:focus:bg-slate-900 rounded-lg px-2.5 py-1 text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 focus:outline-none transition-all"
          />
        </td>

        <!-- GÃ“I Dá»ŠCH Vá»¤ (INLINE EDITABLE) -->
        <td class="py-2 px-3 max-w-[220px]">
          <input 
            type="text" 
            id="sched-service-${s.id}" 
            value="${serviceName}" 
            placeholder="TÃªn gÃ³i dá»‹ch vá»¥..."
            onkeydown="if(event.key==='Enter') window.ShopVietViews.admin.saveInlineSchedule('${s.id}')"
            title="Click trá»±c tiáº¿p vÃ o Ã´ Ä‘á»ƒ sá»­a GÃ³i Dá»‹ch Vá»¥ (Enter Ä‘á»ƒ LÆ°u)"
            class="w-full bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#8A5F26] focus:bg-white dark:focus:bg-slate-900 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none transition-all"
          />
          ${notes ? `<div class="px-2 text-[10px] text-slate-400 line-clamp-1 italic">${notes}</div>` : ''}
        </td>

        <!-- NGÃ€Y Báº®T Äáº¦U (INLINE EDITABLE) -->
        <td class="py-2 px-2 text-center">
          <input 
            type="date" 
            id="sched-start-${s.id}" 
            value="${s.startDate || ''}" 
            onchange="window.ShopVietViews.admin.updateScheduleDaysLeftBadge('${s.id}')"
            onkeydown="if(event.key==='Enter') window.ShopVietViews.admin.saveInlineSchedule('${s.id}')"
            title="Click Ä‘á»ƒ chá»n NgÃ y báº¯t Ä‘áº§u"
            class="bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#8A5F26] focus:bg-white dark:focus:bg-slate-900 rounded-lg px-1.5 py-1 text-xs font-mono text-slate-600 dark:text-slate-400 focus:outline-none transition-all"
          />
        </td>

        <!-- NGÃ€Y Háº¾T Háº N (INLINE EDITABLE) -->
        <td class="py-2 px-2 text-center">
          <input 
            type="date" 
            id="sched-expire-${s.id}" 
            value="${s.expireDate || ''}" 
            onchange="window.ShopVietViews.admin.updateScheduleDaysLeftBadge('${s.id}')"
            onkeydown="if(event.key==='Enter') window.ShopVietViews.admin.saveInlineSchedule('${s.id}')"
            title="Click Ä‘á»ƒ chá»n NgÃ y háº¿t háº¡n"
            class="bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#8A5F26] focus:bg-white dark:focus:bg-slate-900 rounded-lg px-1.5 py-1 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none transition-all"
          />
        </td>

        <!-- TRáº NG THÃI Háº N DÃ™NG (Tá»° Äá»˜NG Cáº¬P NHáº¬T Tá»¨C THÃŒ) -->
        <td class="py-2 px-3.5 text-center whitespace-nowrap" id="sched-badge-cell-${s.id}">
          ${statusBadge}
        </td>

        <!-- THAO TÃC: NÃšT LÆ¯U CLOUD (THAY NÃšT BÃšT CHÃŒ) & NÃšT XÃ“A -->
        <td class="py-2 px-3 text-right whitespace-nowrap">
          <div class="flex items-center justify-end gap-1.5">
            <button 
              type="button" 
              id="btn-save-sched-${s.id}" 
              onclick="window.ShopVietViews.admin.saveInlineSchedule('${s.id}')" 
              title="LÆ°u thay Ä‘á»•i dÃ²ng nÃ y lÃªn ÄÃ¡m mÃ¢y Cloud (khÃ´ng máº¥t khi reset hoáº·c Ä‘á»•i mÃ¡y)" 
              class="px-2.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              <span>LÆ°u</span>
            </button>
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.deleteSchedule('${s.id}')" 
              title="XÃ³a lá»‹ch háº¹n" 
              class="p-1.5 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  // =========================================================================
  // MODAL THÃŠM / Sá»¬A KHÃCH HÃ€NG Háº¸N Lá»ŠCH EXCEL (#adminAddScheduleModal)
  // =========================================================================
  function renderScheduleModal(scheduleId) {
    let schedule = null;
    if (scheduleId) {
      const list = (window.ShopVietState && window.ShopVietState.getSchedules) ? window.ShopVietState.getSchedules() : [];
      schedule = list.find(s => s.id === scheduleId);
    }

    const isEdit = !!schedule;
    const customerEmail = schedule ? schedule.customerEmail : 'thaitraicau123@gmail.com';
    const customerName = schedule ? schedule.customerName : 'BÃ¹i ThÃ¡i';
    const managerEmail = schedule ? schedule.managerEmail : 'slot1-pro@shopviet.vip';
    const serviceName = schedule ? schedule.serviceName : '[1 ThÃ¡ng] Gemini Argon 4 Pro + 5TB Drive';
    const startDate = schedule ? schedule.startDate : new Date().toISOString().split('T')[0];
    const defaultExpire = new Date();
    defaultExpire.setMonth(defaultExpire.getMonth() + 1);
    const expireDate = schedule ? schedule.expireDate : defaultExpire.toISOString().split('T')[0];
    const notes = schedule ? schedule.notes : '';

    return `
      <div id="adminAddScheduleModal" class="fixed inset-0 z-[65] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-slide-up">
          
          <!-- Header Modal -->
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/70">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div>
                <h3 class="font-extrabold text-base text-slate-900 dark:text-white">${isEdit ? 'Cáº­p Nháº­t Lá»‹ch Háº¹n KhÃ¡ch HÃ ng' : 'ThÃªm Email KhÃ¡ch HÃ ng VÃ o Báº£ng Excel'}</h3>
                <p class="text-xs text-slate-500">${isEdit ? `MÃ£ lá»‹ch: ${schedule.id}` : 'Quáº£n lÃ½ lá»‹ch háº¹n slot báº£n quyá»n trá»±c tiáº¿p trÃªn báº£ng tÃ­nh'}</p>
              </div>
            </div>

            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.closeScheduleModal()" 
              class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Body Form -->
          <form id="scheduleForm" onsubmit="event.preventDefault(); window.ShopVietViews.admin.saveScheduleFromModal('${scheduleId || ''}');" class="p-6 space-y-4 text-xs sm:text-sm">
            
            <!-- Email & TÃªn khÃ¡ch hÃ ng -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email KhÃ¡ch HÃ ng (*)</label>
                <input 
                  type="email" 
                  id="modalSchCustomerEmail" 
                  required 
                  value="${customerEmail}"
                  placeholder="thaitraicau123@gmail.com" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
                >
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">TÃªn KhÃ¡ch HÃ ng</label>
                <input 
                  type="text" 
                  id="modalSchCustomerName" 
                  value="${customerName}"
                  placeholder="BÃ¹i ThÃ¡i" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
                >
              </div>
            </div>

            <!-- Email Quáº£n LÃ½ (Slot) -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Quáº£n LÃ½ Slot (*)</label>
              <input 
                type="text" 
                id="modalSchManagerEmail" 
                required 
                value="${managerEmail}"
                placeholder="slot1-pro@shopviet.vip hoáº·c admin-slot@shopviet.vip" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-semibold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
              >
              <p class="text-[11px] text-slate-400 mt-1">DÃ¹ng Ä‘á»ƒ phÃ¢n chia slot quáº£n trá»‹ vÃ  thÃ´ng bÃ¡o khi gia háº¡n.</p>
            </div>

            <!-- GÃ³i Dá»‹ch Vá»¥ -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">GÃ³i Dá»‹ch Vá»¥ (*)</label>
              <select 
                id="modalSchService" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26] font-semibold"
              >
                <option value="[1 ThÃ¡ng] Gemini Argon 4 Pro + 5TB Drive" ${serviceName.includes('Argon') || serviceName.includes('Gemini') ? 'selected' : ''}>[1 ThÃ¡ng] Gemini Argon 4 Pro + 5TB Drive</option>
                <option value="[1 NÄƒm] Gemini Argon 4 Pro + 2TB Google One" ${serviceName.includes('1 NÄƒm] Gemini') ? 'selected' : ''}>[1 NÄƒm] Gemini Argon 4 Pro + 2TB Google One</option>
                <option value="Cursor Pro 1 ThÃ¡ng ChÃ­nh Chá»§" ${serviceName.includes('Cursor') ? 'selected' : ''}>Cursor Pro 1 ThÃ¡ng ChÃ­nh Chá»§</option>
                <option value="ChatGPT Plus ChÃ­nh Chá»§ GPT-4o" ${serviceName.includes('ChatGPT') ? 'selected' : ''}>ChatGPT Plus ChÃ­nh Chá»§ GPT-4o</option>
                <option value="Canva Pro Edu 1 NÄƒm VÄ©nh Viá»…n" ${serviceName.includes('Canva') ? 'selected' : ''}>Canva Pro Edu 1 NÄƒm VÄ©nh Viá»…n</option>
                <option value="CapCut Pro 1 NÄƒm Báº£n Quyá»n" ${serviceName.includes('CapCut') ? 'selected' : ''}>CapCut Pro 1 NÄƒm Báº£n Quyá»n</option>
                <option value="Claude 3.5 Sonnet / Opus Pro" ${serviceName.includes('Claude') ? 'selected' : ''}>Claude 3.5 Sonnet / Opus Pro</option>
              </select>
            </div>

            <!-- NgÃ y báº¯t Ä‘áº§u & NgÃ y háº¿t háº¡n -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">NgÃ y Báº¯t Äáº§u</label>
                <input 
                  type="date" 
                  id="modalSchStartDate" 
                  value="${startDate}" 
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
                >
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">NgÃ y Háº¿t Háº¡n (*)</label>
                <input 
                  type="date" 
                  id="modalSchExpireDate" 
                  required 
                  value="${expireDate}" 
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
                >
              </div>
            </div>

            <!-- NÃºt chá»n nhanh thá»i háº¡n -->
            <div>
              <span class="block text-[11px] font-bold text-slate-500 mb-1.5">Chá»n nhanh thá»i háº¡n (tÃ­nh tá»« ngÃ y báº¯t Ä‘áº§u):</span>
              <div class="flex flex-wrap gap-1.5">
                <button type="button" onclick="window.ShopVietViews.admin.setScheduleQuickExpire(1)" class="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition">+1 ThÃ¡ng</button>
                <button type="button" onclick="window.ShopVietViews.admin.setScheduleQuickExpire(3)" class="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition">+3 ThÃ¡ng</button>
                <button type="button" onclick="window.ShopVietViews.admin.setScheduleQuickExpire(6)" class="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition">+6 ThÃ¡ng</button>
                <button type="button" onclick="window.ShopVietViews.admin.setScheduleQuickExpire(12)" class="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition">+1 NÄƒm</button>
                <button type="button" onclick="window.ShopVietViews.admin.setScheduleQuickExpire(18)" class="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition">+18 ThÃ¡ng</button>
              </div>
            </div>

            <!-- Ghi ChÃº -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ghi ChÃº</label>
              <textarea 
                id="modalSchNotes" 
                rows="2" 
                placeholder="KhÃ¡ch VIP nÃ¢ng cáº¥p chÃ­nh chá»§, cáº§n gá»i nháº¯c trÆ°á»›c 3 ngÃ y..." 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
              >${notes}</textarea>
            </div>

            <!-- Footer Buttons -->
            <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.closeScheduleModal()" 
                class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition text-xs"
              >
                Há»§y
              </button>
              <button 
                type="submit" 
                class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 text-xs"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                <span>LÆ°u vÃ o báº£ng Excel</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 6: TRáº M PHÃT SÃ“NG THá»œI GIAN THá»°C (REALTIME SYNC HUB)
  // =========================================================================
  function renderTabRealtime() {
    const products = (window.ShopVietData && window.ShopVietData.products) || [];
    const vouchers = (window.ShopVietState && window.ShopVietState.getVouchers) ? window.ShopVietState.getVouchers() : [];
    const orders = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.orders) || [];
    const lastTimeDisplay = getLastBroadcastTimeDisplay();
    const history = getBroadcastHistory();

    return `
      <div class="max-w-5xl mx-auto space-y-6 animate-fade-in">
        
        <!-- BANNER TRáº M PHÃT SÃ“NG REALTIME CHÃNH -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18110A] via-slate-900 to-emerald-950 p-6 sm:p-8 text-white border border-amber-700/25 shadow-2xl">
          <!-- Background Glow Effect -->
          <div class="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-3">
              <div class="flex flex-wrap items-center gap-2.5">
                <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
                    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
                    <circle cx="12" cy="2"/>
                    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
                    <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>Tráº¡m PhÃ¡t SÃ³ng Thá»i Gian Thá»±c (Realtime Sync Hub)</span>
                  </h3>
                  <p class="text-xs text-slate-300 font-medium">Trung tÃ¢m phÃ¡t tÃ­n hiá»‡u Ä‘á»“ng bá»™ Ä‘a tab, Ä‘a thiáº¿t bá»‹ vÃ  Cloud Realtime tá»©c thÃ¬</p>
                </div>
              </div>

              <!-- Badges -->
              <div class="flex flex-wrap items-center gap-2 pt-1">
                <!-- Huy hiá»‡u ðŸŸ¢ PhÃ¡t sÃ³ng Live Active -->
                <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm shadow-sm">
                  <span class="relative flex h-2.5 w-2.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                  </span>
                  <span>ðŸŸ¢ PhÃ¡t sÃ³ng Live Active</span>
                </span>

                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-slate-200 border border-white/10">
                  <svg class="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  <span>KÃªnh: shopviet_realtime_sync</span>
                </span>

                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-slate-200 border border-white/10">
                  <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  <span>Äá»™ trá»…: &lt; 30ms</span>
                </span>
              </div>
            </div>

            <!-- NÃºt HÃ nh Äá»™ng PhÃ¡t SÃ³ng Ná»•i Báº­t -->
            <div class="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <!-- NÃšT MASTER PHá»¤ TRONG TRáº M REALTIME HUB -->
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.masterPublish()" 
                class="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-900/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span class="relative flex h-2.5 w-2.5 shrink-0">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <svg class="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                  <path d="M12 9V4s3.03.55 4 2c1.08 1.62 0 5 0 5"/>
                </svg>
                <span>ðŸš€ XUáº¤T Báº¢N &amp; Äá»’NG Bá»˜ TOÃ€N Cáº¦U Tá»¨C THÃŒ</span>
              </button>

              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.broadcastTestPing()" 
                class="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg class="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <span>âš¡ PhÃ¡t TÃ­n Hiá»‡u Äá»“ng Bá»™ Thá»­ Nghiá»‡m (Broadcast Test Ping)</span>
              </button>

              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.broadcastProductsSync()" 
                class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                  <path d="M16 21h5v-5"/>
                </svg>
                <span>PhÃ¡t sÃ³ng Ä‘á»“ng bá»™ láº¡i toÃ n bá»™ Sáº£n pháº©m</span>
              </button>
            </div>
          </div>
        </div>

        <!-- BENTO THÃ”NG Sá» TRáº M PHÃT SÃ“NG (4 CARD) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Sá»‘ lÆ°á»£ng sáº£n pháº©m Ä‘ang Ä‘á»“ng bá»™ -->
          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sáº£n pháº©m Ä‘á»“ng bá»™</span>
              <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white" id="adminRealtimeProductCount">${products.length}</div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Äang phÃ¡t trá»±c tiáº¿p tá»›i táº¥t cáº£ mÃ¡y khÃ¡ch</span>
              </p>
            </div>
          </div>

          <!-- Card 2: Thá»i gian phÃ¡t sÃ³ng cuá»‘i cÃ¹ng -->
          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Láº§n phÃ¡t sÃ³ng cuá»‘i</span>
              <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono" id="adminRealtimeLastBroadcast">${lastTimeDisplay}</div>
              <p class="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <span>âš¡ Cáº­p nháº­t tá»± Ä‘á»™ng khi Admin lÆ°u</span>
              </p>
            </div>
          </div>

          <!-- Card 3: Cáº¥u hÃ¬nh VietQR hiá»‡n thá»i -->
          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">VietQR Live Target</span>
              <div class="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-sm font-bold text-slate-900 dark:text-white truncate">6688686866688</div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">BUI THAI (STB)</p>
            </div>
          </div>

          <!-- Card 4: GÃ³i Voucher & ÄÆ¡n hÃ ng -->
          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Há»‡ sinh thÃ¡i Ä‘á»“ng bá»™</span>
              <div class="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-base font-bold text-slate-900 dark:text-white">${vouchers.length} Vouchers â€¢ ${orders.length} ÄÆ¡n</div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Äá»“ng bá»™ Ä‘a luá»“ng 2 chiá»u</p>
            </div>
          </div>
        </div>

        <!-- Cá»˜T CHá»¨C NÄ‚NG PHÃT SÃ“NG NHANH & NHáº¬T KÃ BROADCAST -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- TrÃ¡i: Khá»‘i Ä‘iá»u khiá»ƒn phÃ¡t sÃ³ng thá»§ cÃ´ng -->
          <div class="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>Khá»‘i Äiá»u Khiá»ƒn TÃ­n Hiá»‡u Thá»§ CÃ´ng</span>
              </h4>
              <p class="text-xs text-slate-500 mt-0.5">Báº¥m Ä‘á»ƒ Ã©p phÃ¡t sÃ³ng tÃ­n hiá»‡u tá»›i táº¥t cáº£ tab & client Ä‘ang má»Ÿ trang.</p>
            </div>

            <div class="space-y-2.5 pt-1">
              <!-- NÃºt 1: Test Ping -->
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.broadcastTestPing()" 
                class="w-full px-4 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-bold text-xs flex items-center justify-between transition cursor-pointer"
              >
                <div class="flex items-center gap-2.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>âš¡ PhÃ¡t TÃ­n Hiá»‡u Äá»“ng Bá»™ Thá»­ Nghiá»‡m</span>
                </div>
                <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-800/60">Test Ping</span>
              </button>

              <!-- NÃºt 2: PhÃ¡t sÃ³ng Sáº£n pháº©m -->
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.broadcastProductsSync()" 
                class="w-full px-4 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 font-bold text-xs flex items-center justify-between transition cursor-pointer"
              >
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  <span>ðŸ“¦ PhÃ¡t SÃ³ng Äá»“ng Bá»™ Láº¡i Sáº£n Pháº©m</span>
                </div>
                <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-200/60 dark:bg-indigo-800/60">${products.length} GÃ³i</span>
              </button>

              <!-- NÃºt 3: PhÃ¡t sÃ³ng VietQR -->
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.broadcastVietQRSync()" 
                class="w-full px-4 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 font-bold text-xs flex items-center justify-between transition cursor-pointer"
              >
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  <span>ðŸ’³ PhÃ¡t SÃ³ng Cáº¥u HÃ¬nh VietQR Má»›i</span>
                </div>
                <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-200/60 dark:bg-sky-800/60">Techcombank</span>
              </button>

              <!-- NÃºt 4: Äá»“ng bá»™ Cloud 2 chiá»u toÃ n há»‡ thá»‘ng -->
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.syncCloudAll()" 
                class="w-full px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-between transition cursor-pointer"
              >
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
                  <span>â˜ï¸ Äá»“ng Bá»™ 2 Chiá»u Cloud REST API</span>
                </div>
                <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">REST Sync</span>
              </button>
            </div>

            <!-- Giáº£i thÃ­ch cÆ¡ cháº¿ -->
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 leading-relaxed">
              <p class="font-semibold text-slate-700 dark:text-slate-300">ðŸ’¡ CÆ¡ cháº¿ Tá»± Äá»™ng PhÃ¡t SÃ³ng:</p>
              <p>Má»—i khi báº¡n LÆ°u/Sá»­a/XÃ³a sáº£n pháº©m, Cáº­p nháº­t VietQR, Táº¡o Voucher hoáº·c Duyá»‡t ÄÆ¡n trong Admin Portal, há»‡ thá»‘ng sáº½ <strong>tá»± Ä‘á»™ng phÃ¡t tÃ­n hiá»‡u</strong> qua BroadcastChannel & Cloud Event Bus.</p>
              <p>Táº¥t cáº£ khÃ¡ch hÃ ng Ä‘ang xem trang chá»§, giá» hÃ ng hoáº·c cá»•ng thanh toÃ¡n sáº½ nháº­n Ä‘Æ°á»£c dá»¯ liá»‡u má»›i nháº¥t mÃ  <strong>khÃ´ng cáº§n báº¥m F5</strong> táº£i láº¡i trang!</p>
            </div>
          </div>

          <!-- Pháº£i: Nháº­t kÃ½ phÃ¡t sÃ³ng trá»±c quan (Broadcast History) -->
          <div class="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <svg class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    <span>Nháº­t KÃ½ TÃ­n Hiá»‡u PhÃ¡t SÃ³ng Gáº§n Nháº¥t</span>
                  </h4>
                  <p class="text-xs text-slate-500 mt-0.5">LÆ°u váº¿t cÃ¡c Ä‘á»£t phÃ¡t sÃ³ng tá»± Ä‘á»™ng vÃ  thá»§ cÃ´ng cá»§a Admin Portal</p>
                </div>
                <button 
                  type="button" 
                  onclick="window.ShopVietViews.admin.clearBroadcastHistory()" 
                  class="text-[11px] font-semibold text-slate-400 hover:text-rose-500 transition"
                  title="XÃ³a lá»‹ch sá»­"
                >
                  XÃ³a log
                </button>
              </div>

              <!-- Danh sÃ¡ch log -->
              <div class="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                ${history.map(item => `
                  <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 flex items-start justify-between gap-3 text-xs">
                    <div class="space-y-0.5">
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-slate-800 dark:text-slate-200">${item.title}</span>
                        <span class="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">Delivered</span>
                      </div>
                      <p class="text-slate-500 dark:text-slate-400 text-[11px]">${item.detail}</p>
                    </div>
                    <div class="text-right shrink-0">
                      <span class="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 block">${item.time}</span>
                      <span class="text-[10px] text-slate-400 block">${item.date || ''}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Footer log -->
            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between text-[11px] text-slate-400">
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>WebSockets & BroadcastChannel Sync Active</span>
              </span>
              <span class="font-mono">BuiThai AI Studio Cloud v12</span>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  // =========================================================================
  // MODAL Táº O MÃƒ QUÃ€ Táº¶NG & GIáº¢M GIÃ Má»šI (#adminCreateVoucherModal)
  // =========================================================================
  function renderCreateVoucherModal() {
    return `
      <div id="adminCreateVoucherModal" class="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-slide-up">
          
          <!-- Header Modal -->
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/70">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 12 20 22 4 22 4 12" />
                  <rect x="2" y="7" width="20" height="5" />
                  <line x1="12" y1="22" x2="12" y2="7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
              </div>
              <div>
                <h3 class="font-extrabold text-base text-slate-900 dark:text-white">Táº¡o MÃ£ QuÃ  Táº·ng & Giáº£m GiÃ¡ Má»›i</h3>
                <p class="text-xs text-slate-500">MÃ£ cÃ³ hiá»‡u lá»±c sá»­ dá»¥ng ngay láº­p tá»©c</p>
              </div>
            </div>

            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.closeVoucherModal()" 
              class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Body Form -->
          <form id="createVoucherForm" onsubmit="event.preventDefault(); window.ShopVietViews.admin.createVoucherSubmit(event);" class="p-6 space-y-4 text-xs sm:text-sm">
            
            <!-- MÃ£ Code & NÃºt Random -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">MÃ£ Voucher (*)</label>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  id="voucherCodeInput" 
                  required 
                  placeholder="VÃ­ dá»¥: DISCOUNT20K, VIP100K..." 
                  class="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
                >
                <button 
                  type="button" 
                  onclick="window.ShopVietViews.admin.generateRandomVoucherCode()" 
                  class="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition shrink-0"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                  <span>Sinh ngáº«u nhiÃªn</span>
                </button>
              </div>
              <p class="text-[11px] text-slate-400 mt-1">MÃ£ tá»± Ä‘á»™ng chuyá»ƒn thÃ nh chá»¯ HOA khÃ´ng dáº¥u.</p>
            </div>

            <!-- Loáº¡i MÃ£ -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Loáº¡i mÃ£ (*)</label>
              <select 
                id="voucherTypeInput" 
                onchange="window.ShopVietViews.admin.onVoucherTypeChange(this.value)"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26] font-medium"
              >
                <option value="percent_discount" selected>Giáº£m theo pháº§n trÄƒm (%) - Máº·c Ä‘á»‹nh</option>
                <option value="order_discount">Giáº£m sá»‘ tiá»n cá»‘ Ä‘á»‹nh (VNÄ)</option>
                <option value="wallet_gift">MÃ£ quÃ  táº·ng náº¡p tiá»n vÃ o VÃ­</option>
              </select>
            </div>

            <!-- GiÃ¡ trá»‹ giáº£m -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1" id="voucherValueLabel">GiÃ¡ trá»‹ giáº£m (% hoáº·c VNÄ) (*)</label>
              <input 
                type="number" 
                id="voucherValueInput" 
                required 
                min="1" 
                max="99" 
                step="1" 
                value="20" 
                placeholder="Nháº­p sá»‘ % (VD: 20 tá»©c giáº£m 20%) hoáº·c sá»‘ tiá»n VNÄ (VD: 20000)" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-[#8A5F26] text-base"
              >
              <!-- CÃ¡c nÃºt chá»n nhanh -->
              <div class="flex items-center gap-1.5 mt-2 flex-wrap" id="voucherQuickSelectBtns">
                <span class="text-[11px] text-slate-400">Chá»n nhanh:</span>
                <button type="button" onclick="document.getElementById('voucherValueInput').value = 10; window.ShopVietViews.admin.generateRandomVoucherCode();" class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600">10%</button>
                <button type="button" onclick="document.getElementById('voucherValueInput').value = 20; window.ShopVietViews.admin.generateRandomVoucherCode();" class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600">20%</button>
                <button type="button" onclick="document.getElementById('voucherValueInput').value = 30; window.ShopVietViews.admin.generateRandomVoucherCode();" class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600">30%</button>
                <button type="button" onclick="document.getElementById('voucherValueInput').value = 50; window.ShopVietViews.admin.generateRandomVoucherCode();" class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600">50%</button>
                <button type="button" onclick="document.getElementById('voucherValueInput').value = 20000; window.ShopVietViews.admin.generateRandomVoucherCode();" class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600">20k</button>
                <button type="button" onclick="document.getElementById('voucherValueInput').value = 50000; window.ShopVietViews.admin.generateRandomVoucherCode();" class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600">50k</button>
              </div>
            </div>

            <!-- Thiáº¿t láº­p dÃ¹ng 1 láº§n -->
            <div class="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <div>
                <div class="font-bold text-slate-800 dark:text-slate-200 text-xs">Giá»›i háº¡n sá»­ dá»¥ng 1 láº§n</div>
                <div class="text-[11px] text-slate-500">Má»—i mÃ£ chá»‰ Ä‘Æ°á»£c 1 khÃ¡ch nháº­p thÃ nh cÃ´ng 1 láº§n duy nháº¥t</div>
              </div>
              <input type="checkbox" id="voucherSingleUseInput" checked class="w-4 h-4 text-indigo-600 rounded">
            </div>

            <!-- Footer Buttons -->
            <div class="pt-2 flex items-center justify-end gap-2">
              <button 
                type="button" 
                onclick="window.ShopVietViews.admin.closeVoucherModal()" 
                class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
              >
                Há»§y bá»
              </button>
              <button 
                type="submit" 
                class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Táº¡o mÃ£ ngay</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    `;
  }

  // =========================================================================
  // MODAL POPUP: CHá»ˆNH Sá»¬A & THÃŠM Má»šI Sáº¢N PHáº¨M
  // =========================================================================
  function renderProductEditModal(productId) {
    const isEdit = !!productId;
    let prod = {
      id: `prod-${Date.now().toString().slice(-4)}`,
      name: '',
      category: 'cat_gemini',
      tag: 'Gemini - Antigravity - Veo',
      price: 69000,
      oldPrice: 250000,
      discount: '-72%',
      stock: 100,
      status: 'in_stock',
      iconType: 'gemini',
      imageUrl: '',
      badge: 'BÃ¡n cháº¡y nháº¥t',
      warranty: '18 thÃ¡ng (1 Ä‘á»•i 1)',
      desc: 'MÃ´ táº£ tÃ­nh nÄƒng gÃ³i sáº£n pháº©m báº£n quyá»n tá»± Ä‘á»™ng 24/7...',
      benefits: [
        'KÃ­ch hoáº¡t qua link má»i chÃ­nh chá»§ Google',
        'TÃ­ch há»£p Antigravity 2.0 & Veo Video AI',
        'Báº£o hÃ nh chÃ­nh chá»§ 1 Ä‘á»•i 1',
        'Tá»± Ä‘á»™ng cáº¥p link ngay sau khi thanh toÃ¡n'
      ],
      usageGuide: 'Sau khi thanh toÃ¡n thÃ nh cÃ´ng, há»‡ thá»‘ng tá»± Ä‘á»™ng gá»­i link kÃ­ch hoáº¡t báº£n quyá»n trá»±c tiáº¿p vÃ o email Ä‘Äƒng kÃ½ cá»§a báº¡n. Chá»‰ cáº§n click vÃ o link Ä‘á»ƒ tham gia nhÃ³m gia Ä‘Ã¬nh chÃ­nh chá»§ cá»§a Google. Thá»i gian kÃ­ch hoáº¡t tá»« 1-5 phÃºt 24/7.'
    };

    if (isEdit && window.ShopVietData && window.ShopVietData.products) {
      const found = window.ShopVietData.products.find(p => p.id === productId);
      if (found) {
        prod = Object.assign({}, found);
        if (!prod.benefits || !Array.isArray(prod.benefits) || prod.benefits.length === 0) {
          prod.benefits = [
            'KÃ­ch hoáº¡t qua link má»i chÃ­nh chá»§ Google',
            'TÃ­ch há»£p Antigravity 2.0 & Veo Video AI',
            'Báº£o hÃ nh chÃ­nh chá»§ 1 Ä‘á»•i 1',
            'Tá»± Ä‘á»™ng cáº¥p link ngay sau khi thanh toÃ¡n'
          ];
        }
        if (!prod.usageGuide) {
          prod.usageGuide = prod.instructions || prod.desc || '';
        }
      }
    }

    // Nháº­n diá»‡n Badge chuáº©n & cháº¿ Ä‘á»™ tÃ¹y chá»‰nh
    const standardBadges = ['BÃ¡n cháº¡y nháº¥t', 'HOT', 'Ráº» vÃ´ Ä‘á»‹ch', 'Má»›i ra máº¯t', 'KhuyÃªn dÃ¹ng', 'Flash Sale'];
    const currentBadge = (prod.badge || 'BÃ¡n cháº¡y nháº¥t').trim();
    const matchedStandard = standardBadges.find(b => b.toLowerCase() === currentBadge.toLowerCase());
    const isCustom = !matchedStandard && currentBadge !== '';
    const badgeSelectValue = isCustom ? 'custom' : (matchedStandard || 'BÃ¡n cháº¡y nháº¥t');

    return `
      <div id="productEditBackdrop" class="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/70">
            <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="flex items-center gap-1.5">
                ${isEdit 
                  ? `<svg class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>Chá»‰nh Sá»­a Sáº£n Pháº©m</span>` 
                  : `<svg class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>ThÃªm Sáº£n Pháº©m Má»›i</span>`
                }
              </span>
              <code class="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">${prod.id}</code>
            </h3>
            <button 
              type="button" 
              onclick="document.getElementById('productEditBackdrop').remove()" 
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Body Form -->
          <form id="productEditForm" onsubmit="event.preventDefault(); window.ShopVietViews.admin.saveProduct('${prod.id}', ${isEdit});" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
            
            <!-- TÃªn sáº£n pháº©m -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">TÃªn sáº£n pháº©m (*)</label>
              <input 
                type="text" 
                id="editProdName" 
                value="${prod.name.replace(/"/g, '&quot;')}" 
                required 
                placeholder="VÃ­ dá»¥: [LINK] Antigravity + Gemini Pro 18 ThÃ¡ng" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26] font-semibold"
              >
            </div>

            <!-- GiÃ¡ BÃ¡n & GiÃ¡ Gá»‘c -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">GiÃ¡ bÃ¡n (VNÄ) (*)</label>
                <input 
                  type="number" 
                  id="editProdPrice" 
                  value="${prod.price}" 
                  required 
                  min="0" 
                  step="1000" 
                  placeholder="VÃ­ dá»¥: 69000" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
                >
              </div>

              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">GiÃ¡ gá»‘c niÃªm yáº¿t (VNÄ)</label>
                <input 
                  type="number" 
                  id="editProdOldPrice" 
                  value="${prod.oldPrice || prod.price * 2}" 
                  min="0" 
                  step="1000" 
                  placeholder="VÃ­ dá»¥: 250000" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
                >
              </div>
            </div>

            <!-- Danh Má»¥c & Tag -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Danh má»¥c sáº£n pháº©m</label>
                <select 
                  id="editProdCategory" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
                >
                  <option value="cat_gemini" ${prod.category === 'cat_gemini' ? 'selected' : ''}>Gemini Pro & Antigravity</option>
                  <option value="cat_cursor" ${prod.category === 'cat_cursor' ? 'selected' : ''}>Cursor New</option>
                  <option value="cat_chatgpt" ${prod.category === 'cat_chatgpt' ? 'selected' : ''}>ChatGPT Plus</option>
                  <option value="cat_canva" ${prod.category === 'cat_canva' ? 'selected' : ''}>Canva Pro</option>
                  <option value="cat_capcut" ${prod.category === 'cat_capcut' ? 'selected' : ''}>Capcut Pro</option>
                  <option value="cat_api" ${prod.category === 'cat_api' ? 'selected' : ''}>API AI Coding</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">NhÃ£n Tag bá»™ lá»c</label>
                <input 
                  type="text" 
                  id="editProdTag" 
                  value="${prod.tag || 'Táº¥t cáº£'}" 
                  placeholder="VÃ­ dá»¥: Cursor New, Capcut, Canva..." 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
                >
              </div>
            </div>

            <!-- Tá»“n Kho & Tráº¡ng ThÃ¡i -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sá»‘ lÆ°á»£ng tá»“n kho</label>
                <input 
                  type="number" 
                  id="editProdStock" 
                  value="${prod.stock || 100}" 
                  min="0" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26] font-bold"
                >
              </div>

              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tráº¡ng thÃ¡i kho hÃ ng</label>
                <select 
                  id="editProdStatus" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
                >
                  <option value="in_stock" ${prod.status === 'in_stock' ? 'selected' : ''}>CÃ²n hÃ ng (In Stock)</option>
                  <option value="low_stock" ${prod.status === 'low_stock' ? 'selected' : ''}>Sáº¯p háº¿t hÃ ng (Low Stock)</option>
                  <option value="out_of_stock" ${prod.status === 'out_of_stock' ? 'selected' : ''}>Háº¿t hÃ ng (Out of Stock)</option>
                </select>
              </div>
            </div>

            <!-- áº¢NH Äáº I DIá»†N Sáº¢N PHáº¨M (Táº¢I LÃŠN FILE HOáº¶C DÃN URL) -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  <svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>áº¢nh Ä‘áº¡i diá»‡n sáº£n pháº©m (Táº£i lÃªn hoáº·c URL)</span>
                </label>
                <span class="text-[11px] text-slate-400">Æ¯u tiÃªn áº£nh vuÃ´ng 1:1 hoáº·c 16:9</span>
              </div>

              <div class="flex items-center gap-4">
                <!-- Khung Preview áº¢nh Trá»±c Quan -->
                <div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  <img 
                    id="adminProdImagePreview" 
                    src="${prod.imageUrl || ''}" 
                    alt="Xem trÆ°á»›c áº£nh" 
                    class="${prod.imageUrl ? '' : 'hidden'} w-full h-full object-cover"
                  />
                  <div id="adminProdImagePlaceholder" class="${prod.imageUrl ? 'hidden' : 'flex'} flex-col items-center justify-center text-slate-400 p-2 text-center">
                    <svg class="w-6 h-6 mb-1 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    <span class="text-[9px] font-medium leading-tight">ChÆ°a cÃ³ áº£nh</span>
                  </div>
                </div>

                <!-- Cá»™t NÃºt HÃ nh Äá»™ng & Input URL -->
                <div class="flex-1 space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="file" id="adminProdFileInput" accept="image/*" class="hidden" onchange="window.ShopVietViews.admin.handleProductImageUpload(this)">
                    <button 
                      type="button" 
                      onclick="document.getElementById('adminProdFileInput').click()" 
                      class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200/60 dark:border-indigo-800 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span>Chá»n áº£nh tá»« mÃ¡y...</span>
                    </button>
                    <button 
                      type="button" 
                      onclick="window.ShopVietViews.admin.clearProductImage()" 
                      class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium text-xs transition cursor-pointer"
                      title="XÃ³a áº£nh vá» máº·c Ä‘á»‹nh"
                    >
                      XÃ³a áº£nh
                    </button>
                  </div>
                  
                  <div>
                    <input 
                      type="text" 
                      id="editProdImageUrl" 
                      value="${prod.imageUrl || ''}" 
                      placeholder="Hoáº·c dÃ¡n link URL áº£nh (https://...)" 
                      oninput="window.ShopVietViews.admin.handleProductImageUrlInput(this.value)"
                      class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8A5F26] font-mono"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Icon Loáº¡i ThÆ°Æ¡ng Hiá»‡u -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">ThÆ°Æ¡ng hiá»‡u / Icon nháº­n diá»‡n</label>
              <select 
                id="editProdIconType" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
              >
                <option value="gemini" ${prod.iconType === 'gemini' ? 'selected' : ''}>Gemini / Google AI</option>
                <option value="cursor" ${prod.iconType === 'cursor' ? 'selected' : ''}>Cursor IDE</option>
                <option value="chatgpt" ${prod.iconType === 'chatgpt' ? 'selected' : ''}>ChatGPT / OpenAI</option>
                <option value="api" ${prod.iconType === 'api' ? 'selected' : ''}>API Token Coding</option>
                <option value="canva" ${prod.iconType === 'canva' ? 'selected' : ''}>Canva Pro</option>
                <option value="capcut" ${prod.iconType === 'capcut' ? 'selected' : ''}>Capcut Pro</option>
                <option value="copilot" ${prod.iconType === 'copilot' ? 'selected' : ''}>GitHub Copilot</option>
                <option value="server" ${prod.iconType === 'server' ? 'selected' : ''}>VPS / Server Cloud</option>
              </select>
            </div>

            <!-- Badge & Báº£o hÃ nh -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Huy hiá»‡u ná»•i báº­t (Top-Right Bookmark Ribbon)</label>
                <select 
                  id="editProdBadgeSelect" 
                  onchange="const c = document.getElementById('editProdBadgeCustomWrap'); if(c) { c.classList.toggle('hidden', this.value !== 'custom'); const hid = document.getElementById('editProdBadge'); if(hid && this.value !== 'custom') hid.value = this.value; }"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26] font-semibold text-xs sm:text-sm cursor-pointer"
                >
                  <option value="BÃ¡n cháº¡y nháº¥t" ${badgeSelectValue === 'BÃ¡n cháº¡y nháº¥t' ? 'selected' : ''}>â­ BÃ¡n cháº¡y nháº¥t (Best Seller - VÃ ng Gold hoÃ ng gia)</option>
                  <option value="HOT" ${badgeSelectValue === 'HOT' ? 'selected' : ''}>ðŸ”¥ HOT (Cá»±c hot - Äá» Cam rá»±c lá»­a AI)</option>
                  <option value="Ráº» vÃ´ Ä‘á»‹ch" ${badgeSelectValue === 'Ráº» vÃ´ Ä‘á»‹ch' ? 'selected' : ''}>ðŸ·ï¸ Ráº» vÃ´ Ä‘á»‹ch (SiÃªu tiáº¿t kiá»‡m - Xanh Emerald & Tag kim cÆ°Æ¡ng)</option>
                  <option value="Má»›i ra máº¯t" ${badgeSelectValue === 'Má»›i ra máº¯t' ? 'selected' : ''}>âœ¨ Má»›i ra máº¯t (New Arrival - Xanh Sky Cyber & Sparkle)</option>
                  <option value="KhuyÃªn dÃ¹ng" ${badgeSelectValue === 'KhuyÃªn dÃ¹ng' ? 'selected' : ''}>ðŸ‘‘ KhuyÃªn dÃ¹ng (Äáº·c quyá»n VIP - TÃ­m hoÃ ng gia & VÆ°Æ¡ng miá»‡n)</option>
                  <option value="Flash Sale" ${badgeSelectValue === 'Flash Sale' ? 'selected' : ''}>âš¡ Flash Sale (Giáº£m sá»‘c - Há»“ng Äá» & Tia chá»›p)</option>
                  <option value="custom" ${badgeSelectValue === 'custom' ? 'selected' : ''}>âœï¸ TÃ¹y chá»‰nh chá»¯ riÃªng...</option>
                </select>
                <div id="editProdBadgeCustomWrap" class="${isCustom ? '' : 'hidden'} mt-1.5">
                  <input 
                    type="text" 
                    id="editProdBadgeCustom" 
                    value="${isCustom ? currentBadge.replace(/"/g, '&quot;') : ''}"
                    placeholder="Nháº­p tÃªn huy hiá»‡u riÃªng (VD: PhiÃªn báº£n VIP, Limited...)" 
                    oninput="const hid = document.getElementById('editProdBadge'); if(hid) hid.value = this.value.trim();"
                    class="w-full px-3.5 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#8A5F26]"
                  />
                </div>
                <input type="hidden" id="editProdBadge" value="${currentBadge.replace(/"/g, '&quot;')}" />
              </div>

              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Thá»i háº¡n báº£o hÃ nh</label>
                <input 
                  type="text" 
                  id="editProdWarranty" 
                  value="${prod.warranty || '18 thÃ¡ng (1 Ä‘á»•i 1)'}" 
                  placeholder="VÃ­ dá»¥: 18 thÃ¡ng (1 Ä‘á»•i 1)" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
                >
              </div>
            </div>

            <!-- MÃ´ táº£ sáº£n pháº©m -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">MÃ´ táº£ chi tiáº¿t</label>
              <textarea 
                id="editProdDesc" 
                rows="3" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26]"
              >${prod.desc || ''}</textarea>
            </div>

            <!-- Äáº·c quyá»n khi mua táº¡i BÃ¹i ThÃ¡i AI Studio (Má»—i dÃ²ng má»™t Ä‘áº·c quyá»n) -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Äáº·c quyá»n khi mua táº¡i BÃ¹i ThÃ¡i AI Studio (Má»—i dÃ²ng má»™t Ä‘áº·c quyá»n)</span>
              </label>
              <textarea 
                id="editProdBenefits" 
                rows="3" 
                placeholder="VÃ­ dá»¥:&#10;KÃ­ch hoáº¡t qua link má»i chÃ­nh chá»§ Google&#10;TÃ­ch há»£p Antigravity 2.0 & Veo Video AI&#10;Báº£o hÃ nh chÃ­nh chá»§ 1 Ä‘á»•i 1&#10;Tá»± Ä‘á»™ng cáº¥p link ngay sau khi thanh toÃ¡n"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26] font-sans text-xs sm:text-sm"
              >${(Array.isArray(prod.benefits) ? prod.benefits.join('\n') : (prod.benefits || ''))}</textarea>
            </div>

            <!-- MÃ´ táº£ & HÆ°á»›ng dáº«n sá»­ dá»¥ng -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span>MÃ´ táº£ & HÆ°á»›ng dáº«n sá»­ dá»¥ng</span>
              </label>
              <textarea 
                id="editProdUsageGuide" 
                rows="3" 
                placeholder="Nháº­p thÃ´ng tin hÆ°á»›ng dáº«n sá»­ dá»¥ng, Ä‘iá»u kiá»‡n báº£o hÃ nh hoáº·c cÃ¡ch nháº­n tÃ i khoáº£n..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8A5F26] font-sans text-xs sm:text-sm"
              >${prod.usageGuide || prod.desc || ''}</textarea>
            </div>

            <!-- NÃºt HÃ nh Äá»™ng -->
            <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button 
                type="button" 
                onclick="document.getElementById('productEditBackdrop').remove()" 
                class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Há»§y bá»
              </button>
              <button 
                type="submit" 
                class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-amber-900/15 transition flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>LÆ°u Sáº£n Pháº©m</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    `;
  }

  // =========================================================================
  // MODAL XEM áº¢NH BILL CHUYá»‚N KHOáº¢N
  // =========================================================================
  function renderBillModal(orderCode, amount) {
    const config = getVietQRConfig();
    return `
      <div id="adminBillBackdrop" class="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onclick="if(event.target === this) this.remove()">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up p-6 text-center space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>

          <div>
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">HÃ³a Ä‘Æ¡n Ä‘iá»‡n tá»­ VietQR</span>
            <h4 class="text-lg font-black text-slate-900 dark:text-white mt-1">ÄÃ£ XÃ¡c Thá»±c Thanh ToÃ¡n</h4>
            <div class="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">${formatVND(amount)}</div>
          </div>

          <!-- ThÃ´ng tin chuyá»ƒn khoáº£n -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-left text-xs space-y-2 border border-slate-100 dark:border-slate-800">
            <div class="flex justify-between">
              <span class="text-slate-400">MÃ£ Ä‘Æ¡n hÃ ng:</span>
              <span class="font-mono font-bold text-slate-800 dark:text-slate-200">${orderCode}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">NgÃ¢n hÃ ng nháº­n:</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">${config.bankName.split(' ')[0]} Bank</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Chá»§ tÃ i khoáº£n:</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">${config.accountName}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Ná»™i dung CK:</span>
              <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">${config.memoPrefix} ${orderCode.replace('#', '')}</span>
            </div>
          </div>

          <button 
            type="button" 
            onclick="document.getElementById('adminBillBackdrop').remove()" 
            class="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs transition"
          >
            ÄÃ³ng
          </button>
        </div>
      </div>
    `;
  }

  // Modal Admin Duyá»‡t ÄÆ¡n & Gá»­i Link RiÃªng Cho KhÃ¡ch
  function renderDeliveryModal(order) {
    const code = order.orderCode || order.id || 'ORDER';
    const customerEmail = order.userEmail || (order.customer && order.customer.email) || (order.user && order.user.email) || (order.email) || 'thaitraicau123@gmail.com';
    const customerName = order.customerName || (order.user && order.user.name) || (order.customer && order.customer.name) || 'BÃ¹i ThÃ¡i';
    const productName = order.productName || (order.items && order.items[0] && order.items[0].name) || 'GÃ³i Báº£n Quyá»n Pro';
    const amount = order.amount || order.total || order.price || 69000;
    const currentLink = order.customDeliveryLink || (order.licenseKey && order.licenseKey.startsWith('http') ? order.licenseKey : '') || 'https://one.google.com/inv/gemini-pro-shopskill247-vip';
    const currentMsg = order.adminMessage || (order.deliveryInfo && order.deliveryInfo.guide) || 'Cáº£m Æ¡n báº¡n Ä‘Ã£ mua hÃ ng táº¡i BÃ¹i ThÃ¡i AI Studio! Báº¡n báº¥m vÃ o Ä‘Æ°á»ng link trÃªn Ä‘á»ƒ kÃ­ch hoáº¡t báº£n quyá»n nhÃ©.';

    return `
      <div id="adminDeliveryBackdrop" class="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onclick="if(event.target === this) this.remove()">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up p-6 space-y-5 relative" onclick="event.stopPropagation()">
          <!-- Close button -->
          <button 
            type="button" 
            onclick="document.getElementById('adminDeliveryBackdrop').remove()" 
            class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition cursor-pointer text-sm"
          >
            âœ•
          </button>

          <!-- Header -->
          <div class="flex items-start gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-inner">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Duyá»‡t ÄÆ¡n & Gá»­i Link RiÃªng Cho KhÃ¡ch</h3>
              <div class="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">#${code}</div>
            </div>
          </div>

          <!-- TÃ³m táº¯t Ä‘Æ¡n hÃ ng -->
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 text-xs">
            <div class="flex justify-between items-center">
              <span class="text-slate-500">KhÃ¡ch hÃ ng:</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">${customerName} <span class="text-slate-400 font-normal">(${customerEmail})</span></span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500">GÃ³i sáº£n pháº©m:</span>
              <span class="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">${productName}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500">Sá»‘ tiá»n thanh toÃ¡n:</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">${formatVND(amount)}</span>
            </div>
          </div>

          <!-- Form nháº­p liá»‡u -->
          <div class="space-y-4">
            <div>
              <label class="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <svg class="w-3.5 h-3.5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span>Link kÃ­ch hoáº¡t báº£n quyá»n riÃªng:</span>
              </label>
              <input 
                type="text" 
                id="adminDeliveryLinkInput" 
                value="${currentLink}" 
                placeholder="https://one.google.com/inv/gemini-..." 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-[#8A5F26] outline-none"
              />
              <p class="text-[11px] text-slate-400 mt-1">ÄÆ°á»ng dáº«n nÃ y sáº½ hiá»ƒn thá»‹ trá»±c tiáº¿p cho khÃ¡ch hÃ ng trong trang ÄÆ¡n hÃ ng / Báº£n quyá»n Ä‘á»ƒ há» kÃ­ch hoáº¡t ngay.</p>
            </div>

            <div>
              <label class="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <svg class="w-3.5 h-3.5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <circle cx="9" cy="10" r="1" fill="currentColor"/>
                  <circle cx="12" cy="10" r="1" fill="currentColor"/>
                  <circle cx="15" cy="10" r="1" fill="currentColor"/>
                </svg>
                <span>Lá»i nháº¯n / HÆ°á»›ng dáº«n dáº·n dÃ² riÃªng cho khÃ¡ch:</span>
              </label>
              <textarea 
                id="adminDeliveryMessageInput" 
                rows="3" 
                placeholder="Lá»i nháº¯n kÃ¨m theo cho khÃ¡ch..." 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#8A5F26] outline-none resize-none"
              >${currentMsg}</textarea>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button 
              type="button" 
              onclick="document.getElementById('adminDeliveryBackdrop').remove()" 
              class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Há»§y
            </button>
            <button 
              type="button" 
              onclick="window.ShopVietViews.admin.submitApproveWithDelivery('${code}')" 
              class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>PhÃª duyá»‡t & gá»­i ngay</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CONTROLLER LOGIC: CÃC HÃ€M Xá»¬ LÃ Sá»° KIá»†N ADMIN
  // =========================================================================
  window.ShopVietViews.admin = {
    // Duyá»‡t yÃªu cáº§u náº¡p xu tá»« Firebase Cloud
    approveTopup: function (topupId) {
      if (window.ShopVietState && typeof window.ShopVietState.approveTopupRequest === 'function') {
        const ok = window.ShopVietState.approveTopupRequest(topupId);
        if (ok) {
          notify(`✅ Đã duyệt nạp xu thành công cho #${topupId}! Tiền đã cộng vào ví khách.`, 'success');
          const tabContent = document.getElementById('adminTabContent');
          if (tabContent && currentActiveTab === 'orders') {
            tabContent.innerHTML = renderTabOrders();
          }
        }
      }
    },

    rejectTopup: function (topupId) {
      if (window.ShopVietState && typeof window.ShopVietState.rejectTopupRequest === 'function') {
        const ok = window.ShopVietState.rejectTopupRequest(topupId);
        if (ok) {
          notify(`Đã từ chối yêu cầu nạp #${topupId}!`, 'info');
          const tabContent = document.getElementById('adminTabContent');
          if (tabContent && currentActiveTab === 'orders') {
            tabContent.innerHTML = renderTabOrders();
          }
        }
      }
    },

    // Báº¯n thÃ´ng bÃ¡o ntfy thá»­ nghiá»‡m
    testNtfyNotification: async function () {
      notify('Äang gá»­i tÃ­n hiá»‡u thÃ´ng bÃ¡o ntfy vá» Ä‘iá»‡n thoáº¡i anh ThÃ¡i...', 'info');
      if (window.BuiThaiNtfy && typeof window.BuiThaiNtfy.testNotification === 'function') {
        const ok = await window.BuiThaiNtfy.testNotification();
        if (ok) {
          notify('ðŸ”” ÄÃ£ báº¯n thÃ´ng bÃ¡o ntfy thÃ nh cÃ´ng! HÃ£y kiá»ƒm tra Ä‘iá»‡n thoáº¡i cá»§a anh ngay nhÃ©.', 'success');
        } else {
          notify('KhÃ´ng thá»ƒ káº¿t ná»‘i ntfy.sh lÃºc nÃ y. HÃ£y kiá»ƒm tra láº¡i káº¿t ná»‘i máº¡ng.', 'warning');
        }
      }
    },

    // Náº¡p xu thá»§ cÃ´ng cho khÃ¡ch hÃ ng
    manualAddCoins: function () {
      const emailInput = document.getElementById('adminManualCoinEmail');
      const amountInput = document.getElementById('adminManualCoinAmount');
      const email = (emailInput ? emailInput.value : '').trim().toLowerCase();
      const amount = Number(amountInput ? amountInput.value : 0);

      if (!email || !amount || amount <= 0) {
        notify('Vui lÃ²ng nháº­p email há»£p lá»‡ vÃ  sá»‘ xu lá»›n hÆ¡n 0!', 'warning');
        return;
      }

      const users = window.ShopVietState ? window.ShopVietState.getUsersDB() : [];
      const user = users.find(u => u.email && u.email.toLowerCase() === email);
      const curBalance = user ? (user.balance || 0) : 0;
      const newBalance = curBalance + amount;

      if (window.ShopVietState && typeof window.ShopVietState.updateUserBalance === 'function') {
        window.ShopVietState.updateUserBalance(email, newBalance);
        notify(`ÄÃ£ náº¡p thÃ nh cÃ´ng +${amount.toLocaleString('vi-VN')} Xu cho tÃ i khoáº£n ${email}! Sá»‘ dÆ° má»›i: ${newBalance.toLocaleString('vi-VN')} Xu.`, 'success');
        if (emailInput) emailInput.value = '';
        if (amountInput) amountInput.value = '100000';
        const tabContent = document.getElementById('adminTabContent');
        if (tabContent && currentActiveTab === 'orders') {
          tabContent.innerHTML = renderTabOrders();
        }
      }
    },
    // 1. Má»Ÿ Cá»•ng Portal Admin
    open: function () {
      // Kiá»ƒm tra báº£o máº­t tÃ i khoáº£n admin
      if (!isAllowedAdminUser()) {
        notify('Truy cáº­p bá»‹ tá»« chá»‘i: Cá»•ng quáº£n trá»‹ chá»‰ dÃ nh riÃªng cho tÃ i khoáº£n thaitraicau123@gmail.com!', 'error');
        if (window.location.hash === '#admin') {
          window.location.hash = '#home';
        }
        this.close();
        return;
      }

      let modalMount = document.getElementById('adminMount');
      if (!modalMount) {
        modalMount = document.createElement('div');
        modalMount.id = 'adminMount';
        document.body.appendChild(modalMount);
      }

      // Khi lÃ  thaitraicau123@gmail.com, cáº¥p quyá»n xÃ¡c thá»±c vÃ  má»Ÿ tháº³ng phiÃªn quáº£n trá»‹
      setAuthenticated(true);
      window.ShopVietViews.admin.isOpen = true;
      modalMount.innerHTML = renderAdminPortalModal();
      this.startSessionTimer();
    },

    // 2. ÄÃ³ng Cá»•ng Portal Admin
    close: function () {
      window.ShopVietViews.admin.isOpen = false;
      const modalMount = document.getElementById('adminMount');
      if (modalMount) modalMount.innerHTML = '';
      if (sessionIntervalTimer) clearInterval(sessionIntervalTimer);

      // Náº¿u URL Ä‘ang lÃ  #admin thÃ¬ reset hash vá» trang hiá»‡n táº¡i
      if (window.location.hash === '#admin') {
        history.replaceState(null, null, ' ');
      }
    },

    // 3. Render há»— trá»£ SPA View Router náº¿u gá»i qua ShopVietState.navigate('admin')
    render: function () {
      if (!isAllowedAdminUser()) {
        notify('Truy cáº­p bá»‹ tá»« chá»‘i: Cá»•ng quáº£n trá»‹ chá»‰ dÃ nh riÃªng cho tÃ i khoáº£n thaitraicau123@gmail.com!', 'error');
        setTimeout(() => {
          if (window.ShopVietState) window.ShopVietState.navigate('home');
        }, 50);
        return `
          <div class="max-w-lg mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/50 text-center space-y-4 shadow-xl">
            <div class="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3 class="text-lg font-black text-slate-900 dark:text-white">Truy Cáº­p Bá»‹ Tá»« Chá»‘i</h3>
            <p class="text-xs text-slate-500 leading-relaxed">Cá»•ng quáº£n trá»‹ Portal Admin chá»‰ dÃ nh riÃªng cho tÃ i khoáº£n quáº£n trá»‹ viÃªn tá»‘i cao: <br><strong class="text-rose-600 dark:text-rose-400 font-mono">thaitraicau123@gmail.com</strong></p>
            <div class="pt-2">
              <button onclick="ShopVietState.navigate('home')" class="px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-indigo-600 font-semibold text-xs">Vá» Trang Chá»§</button>
            </div>
          </div>
        `;
      }
      setAuthenticated(true);
      return renderAdminPortalModal();
    },

    // 4. afterRender
    afterRender: function () {
      if (isAuthenticated()) {
        this.startSessionTimer();
        if (typeof window.requestAdminNotificationPermission === 'function') {
          window.requestAdminNotificationPermission();
        }
      }
    },

    // 5. XÃ¡c thá»±c mÃ£ PIN
    submitPin: function () {
      const pinInput = document.getElementById('adminPinInput');
      const errEl = document.getElementById('adminPinError');
      const cardEl = document.getElementById('adminPinCard');

      if (!pinInput) return;
      const entered = pinInput.value.trim();

      if (VALID_PINS.includes(entered)) {
        setAuthenticated(true);
        notify('XÃ¡c thá»±c quyá»n Quáº£n trá»‹ viÃªn (buithai123) thÃ nh cÃ´ng!', 'success');
        if (typeof window.requestAdminNotificationPermission === 'function') {
          window.requestAdminNotificationPermission();
        }
        this.open();
      } else {
        if (errEl) errEl.classList.remove('hidden');
        if (cardEl) {
          cardEl.classList.add('animate-bounce');
          setTimeout(() => cardEl.classList.remove('animate-bounce'), 600);
        }
        pinInput.focus();
        pinInput.select();
      }
    },

    // 6. áº¨n/Hiá»‡n PIN
    togglePinVisibility: function () {
      const pinInput = document.getElementById('adminPinInput');
      if (!pinInput) return;
      if (pinInput.type === 'password') {
        pinInput.type = 'text';
      } else {
        pinInput.type = 'password';
      }
    },

    // 7. ÄÄƒng xuáº¥t Admin
    logout: function () {
      setAuthenticated(false);
      this.close();
      notify('ÄÃ£ Ä‘Äƒng xuáº¥t khá»i PhiÃªn Quáº£n Trá»‹ an toÃ n!', 'info');
    },

    // 8. Chuyá»ƒn Tab (5 Tab kinh doanh cá»‘t lÃµi, tá»± Ä‘á»™ng fallback mÆ°á»£t vá» pricing náº¿u gá»i realtime hoáº·c overview)
    switchTab: function (tabKey) {
      if (tabKey === 'realtime' || tabKey === 'overview' || !tabKey) {
        tabKey = 'pricing';
      }
      currentActiveTab = tabKey;
      const tabContent = document.getElementById('adminTabContent');
      if (tabContent) {
        tabContent.innerHTML = renderTabBody(tabKey);
      }

      // Cáº­p nháº­t style tab button
      document.querySelectorAll('.admin-nav-tab').forEach(btn => {
        btn.className = 'admin-nav-tab px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200';
      });
      const activeBtn = document.getElementById(`adminTabBtn-${tabKey}`);
      if (activeBtn) {
        activeBtn.className = 'admin-nav-tab px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30';
      }
    },

    // 9. LÃ m má»›i dá»¯ liá»‡u kÃ¨m Ä‘á»“ng bá»™ tá»« ÄÃ¡m MÃ¢y
    refreshData: async function () {
      if (window.ShopVietState && typeof window.ShopVietState.syncAllFromCloud === 'function') {
        await window.ShopVietState.syncAllFromCloud().catch(function () {});
      }
      restoreProductsFromStorage();
      const tabContent = document.getElementById('adminTabContent');
      if (tabContent) {
        tabContent.innerHTML = renderTabBody(currentActiveTab);
      }
      notify('ÄÃ£ lÃ m má»›i dá»¯ liá»‡u vÃ  Ä‘á»“ng bá»™ vá»›i ÄÃ¡m MÃ¢y!', 'info');
    },

    // 9b. Äá»“ng bá»™ ÄÃ¡m MÃ¢y 2 chiá»u tá»©c thÃ¬ cho ToÃ n Há»‡ Thá»‘ng (Sáº£n pháº©m, Voucher, Excel, ÄÆ¡n hÃ ng)
    syncCloudAll: async function () {
      const btn = document.getElementById('adminCloudSyncBtn');
      const icon = document.getElementById('adminCloudSyncIcon');
      const text = document.getElementById('adminCloudSyncText');
      if (icon) icon.classList.add('animate-spin');
      if (text) text.textContent = 'Äang Ä‘á»“ng bá»™...';
      if (btn) btn.disabled = true;

      try {
        if (window.ShopVietState && typeof window.ShopVietState.syncAllFromCloud === 'function') {
          await window.ShopVietState.syncAllFromCloud();
        }
        if (window.ShopVietState && typeof window.ShopVietState.pushAllToCloud === 'function') {
          await window.ShopVietState.pushAllToCloud();
        }
        restoreProductsFromStorage();
        const tabContent = document.getElementById('adminTabContent');
        if (tabContent) {
          tabContent.innerHTML = renderTabBody(currentActiveTab);
        }
        notify('ÄÃ£ Ä‘á»“ng bá»™ toÃ n há»‡ thá»‘ng (Sáº£n pháº©m, Voucher, Excel, ÄÆ¡n hÃ ng) lÃªn Cloud thÃ nh cÃ´ng!', 'success');
      } catch (err) {
        console.error('[Admin Cloud Sync Error]:', err);
        notify('Lá»—i trong quÃ¡ trÃ¬nh Ä‘á»“ng bá»™ Cloud: ' + (err.message || err), 'error');
      } finally {
        if (icon) icon.classList.remove('animate-spin');
        if (text) text.textContent = 'Äá»“ng bá»™ Cloud';
        if (btn) btn.disabled = false;
      }
    },

    // 9c. LÃ m má»›i Ä‘Æ¡n hÃ ng VietQR tá»©c thÃ¬ tá»« ÄÃ¡m MÃ¢y
    refreshOrdersTab: async function () {
      const btn = document.getElementById('adminRefreshOrdersBtn');
      let svg = null;
      if (btn) {
        btn.disabled = true;
        svg = btn.querySelector('svg');
        if (svg) svg.classList.add('animate-spin');
      }

      try {
        if (window.ShopVietState && typeof window.ShopVietState.syncAllFromCloud === 'function') {
          await window.ShopVietState.syncAllFromCloud(true);
        }
      } catch (e) {
        console.warn('[Admin] refreshOrdersTab sync error:', e);
      }

      const tabContent = document.getElementById('adminTabContent');
      if (tabContent && currentActiveTab === 'orders') {
        tabContent.innerHTML = renderTabOrders();
      }

      const tabBadge = document.getElementById('adminOrderTabBadge');
      if (tabBadge && window.ShopVietState && typeof window.ShopVietState.getOrders === 'function') {
        tabBadge.textContent = window.ShopVietState.getOrders().length;
      }

      if (btn) {
        btn.disabled = false;
        if (svg) svg.classList.remove('animate-spin');
      }

      notify('ÄÃ£ cáº­p nháº­t danh sÃ¡ch Ä‘Æ¡n hÃ ng má»›i nháº¥t!', 'success');
    },

    // 10. Má»Ÿ Modal ThÃªm / Sá»­a Sáº£n pháº©m
    openProductModal: function (productId) {
      const existing = document.getElementById('productEditBackdrop');
      if (existing) existing.remove();

      const container = document.createElement('div');
      container.innerHTML = renderProductEditModal(productId);
      document.body.appendChild(container.firstElementChild);
    },

    // 10.0 NÃ©n áº£nh báº±ng HTML5 Canvas siÃªu nháº¹ (< 25KB WebP/JPEG)
    compressImage: function (file, maxWidth, maxHeight, quality) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > maxWidth || height > maxHeight) {
              if (width / height > maxWidth / maxHeight) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            // Xuáº¥t ra WebP hoáº·c JPEG dung lÆ°á»£ng siÃªu nháº¹ < 25KB
            const compressedDataUrl = canvas.toDataURL('image/webp', quality || 0.85);
            resolve(compressedDataUrl);
          };
        };
      });
    },

    // 10.1 Xá»­ lÃ½ Táº£i áº£nh sáº£n pháº©m tá»« mÃ¡y (Tá»± Ä‘á»™ng nÃ©n Canvas siÃªu nháº¹)
    handleProductImageUpload: async function (input) {
      if (!input || !input.files || !input.files[0]) return;
      const file = input.files[0];
      try {
        const compressedDataUrl = await this.compressImage(file, 256, 256, 0.85);
        const preview = document.getElementById('adminProdImagePreview');
        const placeholder = document.getElementById('adminProdImagePlaceholder');
        const urlInput = document.getElementById('editProdImageUrl');
        if (preview) {
          preview.src = compressedDataUrl;
          preview.classList.remove('hidden');
        }
        if (placeholder) {
          placeholder.classList.add('hidden');
          placeholder.classList.remove('flex');
        }
        if (urlInput) {
          urlInput.value = compressedDataUrl;
        }
        console.log('[ShopVietAdmin] ÄÃ£ nÃ©n áº£nh thÃ nh cÃ´ng vá»›i Canvas WebP 256x256 siÃªu nháº¹!');
      } catch (err) {
        console.warn('[ShopVietAdmin] Lá»—i nÃ©n áº£nh:', err);
      }
    },

    // 10.2 Xá»­ lÃ½ Nháº­p URL áº£nh trá»±c tiáº¿p
    handleProductImageUrlInput: function (url) {
      const preview = document.getElementById('adminProdImagePreview');
      const placeholder = document.getElementById('adminProdImagePlaceholder');
      const trimmed = (url || '').trim();
      if (trimmed) {
        if (preview) {
          preview.src = trimmed;
          preview.classList.remove('hidden');
        }
        if (placeholder) {
          placeholder.classList.add('hidden');
          placeholder.classList.remove('flex');
        }
      } else {
        if (preview) {
          preview.src = '';
          preview.classList.add('hidden');
        }
        if (placeholder) {
          placeholder.classList.remove('hidden');
          placeholder.classList.add('flex');
        }
      }
    },

    // 10.3 XÃ³a áº£nh Ä‘áº¡i diá»‡n sáº£n pháº©m
    clearProductImage: function () {
      const urlInput = document.getElementById('editProdImageUrl');
      const fileInput = document.getElementById('adminProdFileInput');
      const preview = document.getElementById('adminProdImagePreview');
      const placeholder = document.getElementById('adminProdImagePlaceholder');
      if (urlInput) urlInput.value = '';
      if (fileInput) fileInput.value = '';
      if (preview) {
        preview.src = '';
        preview.classList.add('hidden');
      }
      if (placeholder) {
        placeholder.classList.remove('hidden');
        placeholder.classList.add('flex');
      }
    },

    // 11. LÆ°u Sáº£n Pháº©m (ThÃªm hoáº·c Sá»­a)
    saveProduct: function (productId, isEdit) {
      const name = document.getElementById('editProdName').value.trim();
      const price = Number(document.getElementById('editProdPrice').value) || 0;
      const oldPrice = Number(document.getElementById('editProdOldPrice').value) || (price * 2);
      const category = document.getElementById('editProdCategory').value;
      const tag = document.getElementById('editProdTag').value.trim();
      const stock = Number(document.getElementById('editProdStock').value) || 0;
      const status = document.getElementById('editProdStatus').value;
      const iconType = document.getElementById('editProdIconType').value;
      
      // Äá»c giÃ¡ trá»‹ badge thÃ´ng minh tá»« Dropdown & Custom Input
      const badgeSelect = document.getElementById('editProdBadgeSelect');
      const badgeCustom = document.getElementById('editProdBadgeCustom');
      let badge = 'BÃ¡n cháº¡y nháº¥t';
      if (badgeSelect) {
        if (badgeSelect.value === 'custom') {
          badge = (badgeCustom && badgeCustom.value.trim()) ? badgeCustom.value.trim() : 'TÃ¹y chá»‰nh';
        } else {
          badge = badgeSelect.value;
        }
      } else if (document.getElementById('editProdBadge')) {
        badge = document.getElementById('editProdBadge').value.trim() || 'BÃ¡n cháº¡y nháº¥t';
      }

      // Tá»± Ä‘á»™ng gÃ¡n badgeColor theo loáº¡i Mark chuáº©n BÃ¹i ThÃ¡i AI Studio
      function getMarkBadgeColor(bName) {
        const b = (bName || '').toLowerCase();
        if (b.includes('hot') || b.includes('thá»‹nh hÃ nh')) {
          return 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 text-white shadow-rose-500/30';
        }
        if (b.includes('ráº»') || b.includes('tiáº¿t kiá»‡m')) {
          return 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-emerald-500/30';
        }
        if (b.includes('má»›i') || b.includes('new')) {
          return 'bg-gradient-to-r from-amber-600 via-[#8A5F26] to-[#6e4b1e] text-white shadow-amber-500/30';
        }
        if (b.includes('khuyÃªn dÃ¹ng') || b.includes('pro') || b.includes('vip')) {
          return 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white shadow-violet-500/30';
        }
        if (b.includes('flash') || b.includes('sale')) {
          return 'bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white shadow-pink-500/30';
        }
        if (b.includes('bÃ¡n cháº¡y') || b.includes('best seller')) {
          return 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-white shadow-amber-500/30';
        }
        return 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-slate-800 text-white shadow-amber-900/25';
      }

      const badgeColor = getMarkBadgeColor(badge);
      const isBestSeller = Boolean(badge.toLowerCase().includes('bÃ¡n cháº¡y') || badge.toLowerCase().includes('best seller'));

      const warranty = document.getElementById('editProdWarranty').value.trim();
      const desc = document.getElementById('editProdDesc').value.trim();
      const imageUrlInput = document.getElementById('editProdImageUrl');
      const imageUrl = imageUrlInput ? imageUrlInput.value.trim() : '';

      const benefitsRaw = document.getElementById('editProdBenefits') ? document.getElementById('editProdBenefits').value : '';
      const benefits = benefitsRaw.split('\n').map(s => s.trim()).filter(Boolean);
      const usageGuide = document.getElementById('editProdUsageGuide') ? document.getElementById('editProdUsageGuide').value.trim() : '';

      if (!name) {
        notify('Vui lÃ²ng nháº­p tÃªn sáº£n pháº©m!', 'warning');
        return;
      }

      // TÃ­nh % discount
      let discount = '';
      if (oldPrice > price) {
        const pct = Math.round((1 - price / oldPrice) * 100);
        discount = `-${pct}%`;
      }

      window.ShopVietData = window.ShopVietData || {};
      window.ShopVietData.products = window.ShopVietData.products || [];

      if (isEdit) {
        // Cáº­p nháº­t sáº£n pháº©m cÅ©
        const idx = window.ShopVietData.products.findIndex(p => p.id === productId);
        if (idx > -1) {
          window.ShopVietData.products[idx] = Object.assign({}, window.ShopVietData.products[idx], {
            name,
            price,
            oldPrice,
            discount,
            category,
            tag,
            stock,
            status,
            iconType,
            badge,
            badgeColor,
            isBestSeller,
            warranty,
            desc,
            imageUrl,
            benefits: benefits.length > 0 ? benefits : (window.ShopVietData.products[idx].benefits || [
              'KÃ­ch hoáº¡t qua link má»i chÃ­nh chá»§ Google',
              'TÃ­ch há»£p Antigravity 2.0 & Veo Video AI',
              'Báº£o hÃ nh chÃ­nh chá»§ 1 Ä‘á»•i 1',
              'Tá»± Ä‘á»™ng cáº¥p link ngay sau khi thanh toÃ¡n'
            ]),
            usageGuide: usageGuide || desc || ''
          });
        }
      } else {
        // Táº¡o sáº£n pháº©m má»›i
        const newProd = {
          id: productId,
          name,
          category,
          tag: tag || 'Táº¥t cáº£',
          price,
          oldPrice,
          discount,
          stock,
          status,
          rating: 5.0,
          reviewsCount: 1,
          soldCount: 0,
          badge: badge || 'BÃ¡n cháº¡y nháº¥t',
          badgeColor: badgeColor,
          isBestSeller: isBestSeller,
          autoDelivery: false,
          warranty: warranty || '12 thÃ¡ng (1 Ä‘á»•i 1)',
          desc,
          benefits: benefits.length > 0 ? benefits : [
            'KÃ­ch hoáº¡t qua link má»i chÃ­nh chá»§ Google',
            'TÃ­ch há»£p Antigravity 2.0 & Veo Video AI',
            'Báº£o hÃ nh chÃ­nh chá»§ 1 Ä‘á»•i 1',
            'Tá»± Ä‘á»™ng cáº¥p link ngay sau khi thanh toÃ¡n'
          ],
          usageGuide: usageGuide || desc || '',
          iconType: iconType || 'gemini',
          imageUrl: imageUrl || '',
          features: benefits.length > 0 ? benefits : [
            'Báº£n quyá»n kÃ­ch hoáº¡t nhanh chÃ³ng 24/7',
            'Báº£o hÃ nh 1 Ä‘á»•i 1 nhanh chÃ³ng',
            'Há»— trá»£ ká»¹ thuáº­t qua Zalo 0986019623'
          ]
        };
        window.ShopVietData.products.unshift(newProd);
      }

      // LÆ°u trá»¯ xuá»‘ng localStorage vÃ  Ä‘á»“ng bá»™ ÄÃ¡m MÃ¢y Äa Thiáº¿t Bá»‹
      try {
        const jsonStr = JSON.stringify(window.ShopVietData.products);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, jsonStr);
        localStorage.setItem('shopviet_custom_products', jsonStr);
        localStorage.setItem('shopviet_admin_products', jsonStr);
        if (window.ShopVietState && typeof window.ShopVietState.saveCustomProducts === 'function') {
          window.ShopVietState.saveCustomProducts(window.ShopVietData.products);
        }
      } catch (e) {
        console.warn('[Save Products LocalStorage Error]:', e);
      }

      if (window.ShopVietState && typeof window.ShopVietState.pushAllToCloud === 'function') {
        window.ShopVietState.pushAllToCloud().catch(function (e) {
          console.warn('[Admin Save Product Cloud Sync Error]:', e);
        });
      }

      // ÄÃ³ng modal sá»­a
      const editModal = document.getElementById('productEditBackdrop');
      if (editModal) editModal.remove();

      // Cáº­p nháº­t láº¡i báº£ng tab pricing trong admin
      const tabContent = document.getElementById('adminTabContent');
      if (tabContent && currentActiveTab === 'pricing') {
        tabContent.innerHTML = renderTabPricing();
      }

      // Náº¾U NGÆ¯á»œI DÃ™NG ÄANG á»ž TRANG CHá»¦ (HOME), Tá»° Äá»˜NG RE-RENDER NGAY Láº¬P Tá»¨C
      if (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.currentView === 'home') {
        window.ShopVietState.navigate('home');
      }

      // PHÃT SÃ“NG TÃN HIá»†U Äá»’NG Bá»˜ REALTIME Tá»šI Táº¤T Cáº¢ MÃY KHÃCH
      if (window.ShopVietState && window.ShopVietState.broadcastAdminChange) {
        window.ShopVietState.broadcastAdminChange('products_updated', {
          productId: productId,
          productName: name,
          action: isEdit ? 'edit' : 'create',
          count: window.ShopVietData.products.length,
          timestamp: Date.now()
        });
      }
      recordBroadcast('products_updated', `LÆ°u sáº£n pháº©m "${name}"`);

      notify(`ÄÃ£ lÆ°u sáº£n pháº©m "${name.slice(0, 30)}..." vÃ  Ä‘á»“ng bá»™ Cloud thÃ nh cÃ´ng!`, 'success');
      notify('âš¡ ÄÃ£ phÃ¡t sÃ³ng dá»¯ liá»‡u thay Ä‘á»•i lÃªn Cloud Realtime thÃ nh cÃ´ng! Má»i mÃ¡y khÃ¡ch Ä‘ang cáº­p nháº­t tá»©c thÃ¬.', 'success');
    },

    // 12. XÃ³a Sáº£n Pháº©m
    deleteProduct: function (productId) {
      if (!confirm('Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a sáº£n pháº©m nÃ y khá»i há»‡ thá»‘ng khÃ´ng?')) return;

      if (window.ShopVietData && window.ShopVietData.products) {
        window.ShopVietData.products = window.ShopVietData.products.filter(p => p.id !== productId);
        try {
          const jsonStr = JSON.stringify(window.ShopVietData.products);
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, jsonStr);
          localStorage.setItem('shopviet_custom_products', jsonStr);
        } catch (e) {
          console.warn('[Delete Product LocalStorage Error]:', e);
        }

        if (window.ShopVietState && typeof window.ShopVietState.pushAllToCloud === 'function') {
          window.ShopVietState.pushAllToCloud().catch(function (e) {
            console.warn('[Admin Delete Product Cloud Sync Error]:', e);
          });
        }

        // Cáº­p nháº­t láº¡i báº£ng tab pricing
        const tabContent = document.getElementById('adminTabContent');
        if (tabContent && currentActiveTab === 'pricing') {
          tabContent.innerHTML = renderTabPricing();
        }

        // Cáº­p nháº­t láº¡i view home náº¿u Ä‘ang má»Ÿ
        if (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.currentView === 'home') {
          window.ShopVietState.navigate('home');
        }

        // PHÃT SÃ“NG TÃN HIá»†U Äá»’NG Bá»˜ REALTIME Tá»šI Táº¤T Cáº¢ MÃY KHÃCH
        if (window.ShopVietState && window.ShopVietState.broadcastAdminChange) {
          window.ShopVietState.broadcastAdminChange('products_updated', {
            productId: productId,
            action: 'delete',
            count: window.ShopVietData.products.length,
            timestamp: Date.now()
          });
        }
        recordBroadcast('products_updated', `XÃ³a sáº£n pháº©m ID: ${productId}`);

        notify('ÄÃ£ xÃ³a sáº£n pháº©m vÃ  Ä‘á»“ng bá»™ Cloud thÃ nh cÃ´ng!', 'info');
        notify('âš¡ ÄÃ£ phÃ¡t sÃ³ng dá»¯ liá»‡u thay Ä‘á»•i lÃªn Cloud Realtime thÃ nh cÃ´ng! Má»i mÃ¡y khÃ¡ch Ä‘ang cáº­p nháº­t tá»©c thÃ¬.', 'success');
      }
    },

    // 13. KhÃ´i phá»¥c sáº£n pháº©m máº·c Ä‘á»‹nh
    resetDefaultProducts: function () {
      if (!confirm('KhÃ´i phá»¥c toÃ n bá»™ danh sÃ¡ch sáº£n pháº©m vá» máº«u máº·c Ä‘á»‹nh ban Ä‘áº§u?')) return;
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      location.reload();
    },

    // 14. Lá»c báº£ng sáº£n pháº©m theo tá»« khÃ³a
    filterProductTable: function (keyword) {
      const tbody = document.getElementById('adminProductTableBody');
      if (!tbody) return;

      const prods = (window.ShopVietData && window.ShopVietData.products) || [];
      const clean = (keyword || '').toLowerCase().trim();

      const matched = prods.filter(p => {
        return p.name.toLowerCase().includes(clean) || 
               (p.tag && p.tag.toLowerCase().includes(clean)) ||
               (p.category && p.category.toLowerCase().includes(clean)) ||
               p.id.toLowerCase().includes(clean);
      });

      tbody.innerHTML = matched.map(renderProductTableRow).join('');
    },

    // 15. Duyá»‡t hoÃ n táº¥t Ä‘Æ¡n hÃ ng
    approveOrder: function (orderCode) {
      if (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.orders) {
        const ord = window.ShopVietState.state.orders.find(o => (o.orderCode === orderCode || o.id === orderCode || o.orderCode === '#' + orderCode || ('#' + o.orderCode) === orderCode));
        if (ord) {
          ord.status = 'completed';
          ord.statusText = 'ÄÃ£ hoÃ n táº¥t';
          ord.unlockedAt = new Date().toISOString();
          ord.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
          if (!ord.licenseKey) {
            ord.licenseKey = `KEY-${Date.now().toString().slice(-6)}-PRO-ACTIVE`;
          }
          if (window.BuiThaiNtfy && typeof window.BuiThaiNtfy.notifyNewOrder === 'function') {
            window.BuiThaiNtfy.notifyNewOrder(ord);
          }
          window.ShopVietState.save();
          if (window.ShopVietFirebase && typeof window.ShopVietFirebase.syncOrderToCloud === 'function') {
            window.ShopVietFirebase.syncOrderToCloud(ord).catch(() => {});
          }
          if (window.ShopVietState && typeof window.ShopVietState.pushAllToCloud === 'function') {
            window.ShopVietState.pushAllToCloud().catch(() => {});
          }
        }
      }

      // Re-render tab orders
      const tabContent = document.getElementById('adminTabContent');
      if (tabContent && currentActiveTab === 'orders') {
        tabContent.innerHTML = renderTabOrders();
      }

      if (window.ShopVietState && window.ShopVietState.broadcastAdminChange) {
        window.ShopVietState.broadcastAdminChange('orders_updated', {
          orderCode: orderCode,
          status: 'completed',
          timestamp: Date.now()
        });
      }
      recordBroadcast('orders_updated', `Duyá»‡t Ä‘Æ¡n hÃ ng ${orderCode}`);

      notify(`ÄÃ£ duyá»‡t hoÃ n táº¥t vÃ  kÃ­ch hoáº¡t license cho Ä‘Æ¡n hÃ ng ${orderCode}!`, 'success');
      notify('âš¡ ÄÃ£ phÃ¡t sÃ³ng dá»¯ liá»‡u thay Ä‘á»•i lÃªn Cloud Realtime thÃ nh cÃ´ng! Má»i mÃ¡y khÃ¡ch Ä‘ang cáº­p nháº­t tá»©c thÃ¬.', 'success');
    },

    // 15a. Tá»« chá»‘i Ä‘Æ¡n hÃ ng & Tá»± Ä‘á»™ng hoÃ n tráº£ sá»‘ lÆ°á»£ng vÃ o kho
    rejectOrder: function (orderCode) {
      if (!confirm(`Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n tá»« chá»‘i Ä‘Æ¡n hÃ ng #${orderCode}?\n\nNáº¿u Ä‘Æ¡n Ä‘Ã£ Ä‘Æ°á»£c ghi nháº­n trá»« kho, sá»‘ lÆ°á»£ng sáº£n pháº©m sáº½ Ä‘Æ°á»£c tá»± Ä‘á»™ng hoÃ n tráº£ láº¡i vÃ o kho ngay láº­p tá»©c.`)) {
        return;
      }

      let ord = null;
      if (window.ShopVietState && window.ShopVietState.state && Array.isArray(window.ShopVietState.state.orders)) {
        ord = window.ShopVietState.state.orders.find(o => (o.orderCode === orderCode || o.id === orderCode || o.orderCode === '#' + orderCode || ('#' + o.orderCode) === orderCode));
      }
      if (!ord && window.ShopVietState && Array.isArray(window.ShopVietState.orders)) {
        ord = window.ShopVietState.orders.find(o => (o.orderCode === orderCode || o.id === orderCode || o.orderCode === '#' + orderCode || ('#' + o.orderCode) === orderCode));
      }

      let restoredStockInfo = '';

      if (ord) {
        ord.status = 'rejected';
        ord.statusText = 'ÄÃ£ tá»« chá»‘i';
        ord.rejectedAt = new Date().toISOString();

        // Tá»± Ä‘á»™ng hoÃ n tráº£ sá»‘ lÆ°á»£ng láº¡i cho sáº£n pháº©m tÆ°Æ¡ng á»©ng trong kho náº¿u trÆ°á»›c Ä‘Ã³ Ä‘Ã£ bá»‹ trá»« kho
        if (ord.stockDeducted) {
          const boughtItem = (ord.items && ord.items[0]) || null;
          const prodId = boughtItem ? boughtItem.id : (ord.productId || (ord.product && ord.product.id));
          const buyQty = (boughtItem && boughtItem.quantity) || ord.quantity || 1;

          if (prodId && window.ShopVietData && Array.isArray(window.ShopVietData.products)) {
            const targetProd = window.ShopVietData.products.find(p => p.id === prodId);
            if (targetProd) {
              const prevStock = typeof targetProd.stock === 'number' ? targetProd.stock : parseInt(targetProd.stock, 10) || 10;
              targetProd.stock = prevStock + buyQty;
              if (targetProd.stock > 0 && targetProd.status === 'out_of_stock') {
                targetProd.status = 'in_stock';
              }

              // 1. LÆ°u Ä‘á»“ng bá»™ vÃ o LocalStorage
              const jsonStr = JSON.stringify(window.ShopVietData.products);
              try {
                localStorage.setItem('shopviet_custom_products', jsonStr);
                localStorage.setItem('shopviet_admin_products', jsonStr);
                localStorage.setItem('shopviet247_custom_products_v1', jsonStr);
              } catch (e) {}

              // 2. Cáº­p nháº­t State
              if (window.ShopVietState && typeof window.ShopVietState.saveCustomProducts === 'function') {
                window.ShopVietState.saveCustomProducts(window.ShopVietData.products);
              }

              // 3. Äáº©y lÃªn GitHub Cloud Storage
              if (window.ShopVietState && typeof window.ShopVietState.pushAllToCloud === 'function') {
                window.ShopVietState.pushAllToCloud(true).catch(() => {});
              }

              // 4. PhÃ¡t sÃ³ng Realtime cáº­p nháº­t tá»“n kho
              if (window.ShopVietState && window.ShopVietState.broadcastAdminChange) {
                window.ShopVietState.broadcastAdminChange('products_updated', {
                  productId: targetProd.id,
                  productName: targetProd.name,
                  newStock: targetProd.stock,
                  timestamp: Date.now()
                });
              }

              // 5. Cáº­p nháº­t láº¡i view home náº¿u Ä‘ang má»Ÿ
              if (window.ShopVietViews && window.ShopVietViews.home && typeof window.ShopVietViews.home.renderProducts === 'function') {
                window.ShopVietViews.home.renderProducts();
              }

              restoredStockInfo = ` (ÄÃ£ hoÃ n láº¡i +${buyQty} vÃ o kho: hiá»‡n cÃ²n ${targetProd.stock} gÃ³i)`;
            }
          }
          ord.stockDeducted = false;
        }

        // LÆ°u Ä‘Æ¡n hÃ ng vÃ o State
        if (window.ShopVietState && typeof window.ShopVietState.save === 'function') {
          window.ShopVietState.save();
        }

        // Äá»“ng bá»™ Firebase Firestore & Cloud
        if (window.ShopVietFirebase && typeof window.ShopVietFirebase.syncOrderToCloud === 'function') {
          window.ShopVietFirebase.syncOrderToCloud(ord).catch(() => {});
        }
        if (window.ShopVietState && typeof window.ShopVietState.pushAllToCloud === 'function') {
          window.ShopVietState.pushAllToCloud().catch(() => {});
        }
      }

      // Re-render láº¡i tab orders trong Admin
      const tabContent = document.getElementById('adminTabContent');
      if (tabContent && currentActiveTab === 'orders') {
        tabContent.innerHTML = renderTabOrders();
      }

      // PhÃ¡t sÃ³ng orders_updated
      if (window.ShopVietState && window.ShopVietState.broadcastAdminChange) {
        window.ShopVietState.broadcastAdminChange('orders_updated', {
          orderCode: orderCode,
          status: 'rejected',
          timestamp: Date.now()
        });
      }
      recordBroadcast('orders_updated', `Tá»« chá»‘i Ä‘Æ¡n hÃ ng #${orderCode}`);

      notify(`ÄÃ£ tá»« chá»‘i Ä‘Æ¡n hÃ ng #${orderCode}!${restoredStockInfo}`, 'info');
      notify('âš¡ ÄÃ£ cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng vÃ  phÃ¡t sÃ³ng Realtime Cloud thÃ nh cÃ´ng!', 'success');
    },

    // 15b. Má»Ÿ Modal Admin Duyá»‡t ÄÆ¡n & Gá»­i Link RiÃªng Cho KhÃ¡ch
    openDeliveryModal: function (orderCode) {
      let ord = null;
      if (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.orders) {
        ord = window.ShopVietState.state.orders.find(o => (o.orderCode === orderCode || o.id === orderCode || o.orderCode === '#' + orderCode || ('#' + o.orderCode) === orderCode));
      }
      if (!ord) {
        ord = {
          orderCode: orderCode,
          id: orderCode,
          customerName: 'KhÃ¡ch hÃ ng',
          productName: 'GÃ³i Báº£n Quyá»n VIP',
          amount: 69000
        };
      }

      const existing = document.getElementById('adminDeliveryBackdrop');
      if (existing) existing.remove();

      const container = document.createElement('div');
      container.innerHTML = renderDeliveryModal(ord);
      document.body.appendChild(container.firstElementChild);
    },

    // 15c. XÃ¡c nháº­n PhÃª Duyá»‡t & Gá»­i Link
    submitApproveWithDelivery: function (orderCode) {
      const linkInput = document.getElementById('adminDeliveryLinkInput');
      const msgInput = document.getElementById('adminDeliveryMessageInput');
      const deliveryLink = (linkInput ? linkInput.value : '').trim();
      const message = (msgInput ? msgInput.value : '').trim();

      if (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.orders) {
        let ord = window.ShopVietState.state.orders.find(o => (o.orderCode === orderCode || o.id === orderCode || o.orderCode === '#' + orderCode || ('#' + o.orderCode) === orderCode));
        if (ord) {
          ord.status = 'completed';
          ord.statusText = 'ÄÃ£ hoÃ n táº¥t';
          ord.customDeliveryLink = deliveryLink;
          ord.adminMessage = message;
          ord.licenseKey = deliveryLink || ord.licenseKey || 'KEY-PRO-ACTIVE';
          ord.approvedAt = new Date().toISOString();
          ord.unlockedAt = new Date().toISOString();
          ord.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
          if (window.BuiThaiNtfy && typeof window.BuiThaiNtfy.notifyNewOrder === 'function') {
            window.BuiThaiNtfy.notifyNewOrder(ord);
          }
          
          const customerEmail = (ord.customer && typeof ord.customer === 'object' && ord.customer.email) || 
                                (ord.user && ord.user.email) || 
                                (typeof ord.customer === 'string' && ord.customer.includes('@') ? ord.customer : 'thaitraicau123@gmail.com');

          ord.deliveryInfo = {
            account: customerEmail,
            licenseKey: deliveryLink || ord.licenseKey || 'KEY-PRO-ACTIVE',
            guide: message
          };

          window.ShopVietState.save();

          // Äá»“ng bá»™ náº¿u cÃ³ Cloud Sync / Firebase
          if (window.ShopVietFirebase && typeof window.ShopVietFirebase.syncOrderToCloud === 'function') {
            window.ShopVietFirebase.syncOrderToCloud(ord).catch(() => {});
          }
          if (window.ShopVietState && typeof window.ShopVietState.pushAllToCloud === 'function') {
            window.ShopVietState.pushAllToCloud().catch(() => {});
          }
        }
      }

      // ÄÃ³ng modal #adminDeliveryBackdrop
      const modal = document.getElementById('adminDeliveryBackdrop');
      if (modal) modal.remove();

      // Re-render láº¡i tab orders trong admin
      const tabContent = document.getElementById('adminTabContent');
      if (tabContent && currentActiveTab === 'orders') {
        tabContent.innerHTML = renderTabOrders();
      }

      if (window.ShopVietState && window.ShopVietState.broadcastAdminChange) {
        window.ShopVietState.broadcastAdminChange('orders_updated', {
          orderCode: orderCode,
          status: 'completed',
          timestamp: Date.now()
        });
      }
      recordBroadcast('orders_updated', `Giao link Ä‘Æ¡n hÃ ng #${orderCode}`);

      notify(`ÄÃ£ phÃª duyá»‡t Ä‘Æ¡n hÃ ng #${orderCode} vÃ  bÃ n giao link riÃªng thÃ nh cÃ´ng!`, 'success');
      notify('âš¡ ÄÃ£ phÃ¡t sÃ³ng dá»¯ liá»‡u thay Ä‘á»•i lÃªn Cloud Realtime thÃ nh cÃ´ng! Má»i mÃ¡y khÃ¡ch Ä‘ang cáº­p nháº­t tá»©c thÃ¬.', 'success');
    },

    // XÃ³a vÄ©nh viá»…n Ä‘Æ¡n hÃ ng
    deleteOrder: function (orderId) {
      if (!orderId) return;
      if (!confirm(`Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a vÄ©nh viá»…n Ä‘Æ¡n hÃ ng #${orderId} khá»i há»‡ thá»‘ng?`)) {
        return;
      }
      if (window.ShopVietState && window.ShopVietState.deleteOrder) {
        const res = window.ShopVietState.deleteOrder(orderId);
        if (res && res.success) {
          if (typeof window.ShopVietState.pushAllToCloud === 'function') {
            window.ShopVietState.pushAllToCloud().catch(function () {});
          }
          if (window.ShopVietState && window.ShopVietState.broadcastAdminChange) {
            window.ShopVietState.broadcastAdminChange('orders_updated', {
              action: 'delete',
              orderCode: orderId,
              timestamp: Date.now()
            });
          }
          recordBroadcast('orders_updated', `XÃ³a Ä‘Æ¡n hÃ ng #${orderId}`);

          const tabContent = document.getElementById('adminTabContent');
          if (tabContent && currentActiveTab === 'orders') {
            tabContent.innerHTML = renderTabOrders();
          } else {
            this.switchTab('orders');
          }

          const tabBadge = document.getElementById('adminOrderTabBadge');
          if (tabBadge && window.ShopVietState.getOrders) {
            tabBadge.textContent = window.ShopVietState.getOrders().length;
          }

          notify(`ÄÃ£ xÃ³a Ä‘Æ¡n hÃ ng #${orderId} thÃ nh cÃ´ng!`, 'success');
          notify('âš¡ ÄÃ£ phÃ¡t sÃ³ng dá»¯ liá»‡u thay Ä‘á»•i lÃªn Cloud Realtime thÃ nh cÃ´ng! Má»i mÃ¡y khÃ¡ch Ä‘ang cáº­p nháº­t tá»©c thÃ¬.', 'success');
        } else {
          notify((res && res.message) || 'KhÃ´ng thá»ƒ xÃ³a Ä‘Æ¡n hÃ ng!', 'error');
        }
      }
    },

    // 16. Xem hÃ³a Ä‘Æ¡n / Bill
    viewBillModal: function (orderCode, amount) {
      const existing = document.getElementById('adminBillBackdrop');
      if (existing) existing.remove();

      const container = document.createElement('div');
      container.innerHTML = renderBillModal(orderCode, amount);
      document.body.appendChild(container.firstElementChild);
    },

    // 17. Cáº­p nháº­t preview VietQR khi gÃµ form
    updateQRPreview: function () {
      const bankSelect = document.getElementById('adminVietQRBank');
      const accountInput = document.getElementById('adminVietQRAccountNumber');
      const ownerInput = document.getElementById('adminVietQRAccountName');
      const memoInput = document.getElementById('adminVietQRMemoPrefix');
      const previewImg = document.getElementById('adminVietQRPreviewImg');
      const previewTitle = document.getElementById('adminPreviewBankTitle');
      const previewSTK = document.getElementById('adminPreviewSTK');
      const previewOwner = document.getElementById('adminPreviewOwner');

      if (!bankSelect || !accountInput || !ownerInput) return;

      const bankId = bankSelect.value;
      const bankName = bankSelect.options[bankSelect.selectedIndex].text;
      const account = accountInput.value.trim() || '00223366888';
      const owner = ownerInput.value.trim().toUpperCase() || 'NGUYEN VAN HUY';
      const memo = (memoInput ? memoInput.value.trim().toUpperCase() : 'THAIBUI') || 'THAIBUI';

      if (previewTitle) previewTitle.textContent = bankName;
      if (previewSTK) previewSTK.textContent = `STK: ${account}`;
      if (previewOwner) previewOwner.textContent = owner;

      if (previewImg) {
        previewImg.src = `https://api.vietqr.io/image/${bankId}-${account}-compact2.png?amount=69000&accountName=${encodeURIComponent(owner)}&addInfo=${encodeURIComponent(memo + ' DEMO')}`;
      }
    },

    // 18. LÆ°u cáº¥u hÃ¬nh VietQR
    saveVietQRSettings: function () {
      const bankSelect = document.getElementById('adminVietQRBank');
      const accountInput = document.getElementById('adminVietQRAccountNumber');
      const ownerInput = document.getElementById('adminVietQRAccountName');
      const memoInput = document.getElementById('adminVietQRMemoPrefix');

      const selectedBank = SUPPORTED_BANKS.find(b => b.id === bankSelect.value) || { name: bankSelect.options[bankSelect.selectedIndex].text, code: 'STB' };

      const config = {
        bankId: bankSelect.value,
        bin: bankSelect.value,
        bankName: selectedBank.name || bankSelect.options[bankSelect.selectedIndex].text,
        shortName: selectedBank.code || 'Techcombank',
        accountNumber: accountInput.value.trim(),
        accountName: ownerInput.value.trim().toUpperCase(),
        memoPrefix: memoInput.value.trim().toUpperCase() || 'THAIBUI',
        brandColor: '#004b91'
      };

      saveVietQRConfig(config);

      // PHÃT SÃ“NG TÃN HIá»†U Äá»’NG Bá»˜ REALTIME Tá»šI Táº¤T Cáº¢ MÃY KHÃCH
      if (window.ShopVietState && window.ShopVietState.broadcastAdminChange) {
        window.ShopVietState.broadcastAdminChange('vietqr_updated', {
          config: config,
          timestamp: Date.now()
        });
      }
      recordBroadcast('vietqr_updated', `Cáº­p nháº­t VietQR ${config.shortName} - ${config.accountNumber} (${config.accountName})`);

      notify('ÄÃ£ lÆ°u cáº¥u hÃ¬nh tÃ i khoáº£n VietQR thÃ nh cÃ´ng! CÃ¡c luá»“ng thanh toÃ¡n sáº½ cáº­p nháº­t tá»©c thÃ¬.', 'success');
      notify('âš¡ ÄÃ£ phÃ¡t sÃ³ng dá»¯ liá»‡u thay Ä‘á»•i lÃªn Cloud Realtime thÃ nh cÃ´ng! Má»i mÃ¡y khÃ¡ch Ä‘ang cáº­p nháº­t tá»©c thÃ¬.', 'success');
    },

    // 19. Bá»™ Ä‘áº¿m thá»i gian phiÃªn (Session Countdown)
    startSessionTimer: function () {
      if (sessionIntervalTimer) clearInterval(sessionIntervalTimer);
      sessionIntervalTimer = setInterval(() => {
        sessionCountdownSeconds--;
        if (sessionCountdownSeconds <= 0) {
          sessionCountdownSeconds = 60 * 60;
        }
        const timerEl = document.getElementById('adminSessionTimer');
        if (timerEl) {
          timerEl.textContent = formatSessionTime(sessionCountdownSeconds);
        }
      }, 1000);
    },

    // 20. Quáº£n lÃ½ mÃ£ quÃ  táº·ng & giáº£m giÃ¡ (Vouchers)
    openVoucherModal: function () {
      const existing = document.getElementById('adminCreateVoucherModal');
      if (existing) existing.remove();

      const container = document.createElement('div');
      container.innerHTML = renderCreateVoucherModal();
      document.body.appendChild(container.firstElementChild);
      this.generateRandomVoucherCode();
    },

    closeVoucherModal: function () {
      const modal = document.getElementById('adminCreateVoucherModal');
      if (modal) modal.remove();
    },

    onVoucherTypeChange: function (type) {
      const valInput = document.getElementById('voucherValueInput');
      const label = document.getElementById('voucherValueLabel');
      if (type === 'percent_discount') {
        if (label) label.textContent = 'GiÃ¡ trá»‹ giáº£m (% pháº§n trÄƒm) (*)';
        if (valInput) {
          valInput.min = '1';
          valInput.max = '99';
          valInput.step = '1';
          valInput.value = '20';
          valInput.placeholder = 'VÃ­ dá»¥: 20 tá»©c giáº£m 20%';
        }
      } else {
        if (label) label.textContent = 'Sá»‘ tiá»n giáº£m (VNÄ) (*)';
        if (valInput) {
          valInput.min = '1000';
          valInput.removeAttribute('max');
          valInput.step = '1000';
          valInput.value = '20000';
          valInput.placeholder = 'VÃ­ dá»¥: 20000, 50000, 100000...';
        }
      }
      this.generateRandomVoucherCode();
    },

    generateRandomVoucherCode: function () {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let randomPart = '';
      for (let i = 0; i < 4; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const valInput = document.getElementById('voucherValueInput');
      const typeInput = document.getElementById('voucherTypeInput');
      const isPercent = typeInput ? typeInput.value === 'percent_discount' : true;
      const rawVal = valInput ? parseInt(valInput.value, 10) || 20 : 20;
      let prefix = 'SV20';
      if (isPercent) {
        prefix = 'SV' + Math.min(99, Math.max(1, rawVal)) + 'P';
      } else {
        prefix = 'SV' + Math.round(rawVal / 1000) + 'K';
      }
      const codeInput = document.getElementById('voucherCodeInput');
      if (codeInput) {
        codeInput.value = prefix + '-' + randomPart;
      }
    },

    createVoucherSubmit: function (e) {
      if (e && e.preventDefault) e.preventDefault();
      const codeInput = document.getElementById('voucherCodeInput');
      const typeInput = document.getElementById('voucherTypeInput');
      const valInput = document.getElementById('voucherValueInput');
      const singleUseInput = document.getElementById('voucherSingleUseInput');

      if (!codeInput || !valInput) return;

      const code = codeInput.value.trim().toUpperCase();
      const type = typeInput ? typeInput.value : 'percent_discount';
      const rawVal = parseInt(valInput.value, 10) || 0;
      const singleUse = singleUseInput ? singleUseInput.checked : true;

      if (!code) {
        notify('Vui lÃ²ng nháº­p mÃ£ voucher!', 'error');
        return;
      }
      if (rawVal <= 0) {
        notify('GiÃ¡ trá»‹ giáº£m pháº£i lá»›n hÆ¡n 0!', 'error');
        return;
      }

      if (type === 'percent_discount' && (rawVal < 1 || rawVal > 99)) {
        notify('MÃ£ giáº£m theo pháº§n trÄƒm pháº£i tá»« 1% Ä‘áº¿n 99%!', 'error');
        return;
      }

      const vouchers = (window.ShopVietState && window.ShopVietState.getVouchers) ? window.ShopVietState.getVouchers() : [];
      const exists = vouchers.some(function (v) {
        return v.code && v.code.trim().toUpperCase() === code;
      });
      if (exists) {
        notify(`MÃ£ voucher "${code}" Ä‘Ã£ tá»“n táº¡i trong há»‡ thá»‘ng!`, 'error');
        return;
      }

      let newVoucher;
      if (type === 'percent_discount') {
        const percent = Math.min(99, Math.max(1, rawVal));
        newVoucher = {
          code: code,
          type: 'percent_discount',
          percent: percent,
          value: percent,
          singleUse: singleUse,
          isUsed: false,
          usedBy: null,
          usedAt: null,
          orderCode: null,
          createdAt: new Date().toISOString()
        };
      } else {
        newVoucher = {
          code: code,
          type: type,
          value: rawVal,
          singleUse: singleUse,
          isUsed: false,
          usedBy: null,
          usedAt: null,
          orderCode: null,
          createdAt: new Date().toISOString()
        };
      }

      // LÆ°u state cá»¥c bá»™ ngay láº­p tá»©c (0ms)
      vouchers.unshift(newVoucher);
      if (window.ShopVietState && window.ShopVietState.saveVouchers) {
        window.ShopVietState.saveVouchers(vouchers);
      }

      // =======================================================================
      // PHÆ¯Æ NG PHÃP 1: Optimistic UI 0ms - ÄÃ³ng modal ngay láº­p tá»©c & báº¯n thÃ´ng bÃ¡o
      // =======================================================================
      this.closeVoucherModal();

      const labelText = type === 'percent_discount' ? `${newVoucher.percent}%` : formatVND(rawVal);
      notify(`ÄÃ£ táº¡o thÃ nh cÃ´ng mÃ£ voucher "${code}" giáº£m ${labelText}! Tá»± Ä‘á»™ng Ä‘á»“ng bá»™ toÃ n há»‡ thá»‘ng.`, 'success');
      notify('âš¡ ÄÃ£ phÃ¡t sÃ³ng dá»¯ liá»‡u thay Ä‘á»•i lÃªn Cloud Realtime thÃ nh cÃ´ng! Má»i mÃ¡y khÃ¡ch Ä‘ang cáº­p nháº­t tá»©c thÃ¬.', 'success');

      // PhÃ¡t sÃ³ng realtime broadcast ná»™i bá»™
      if (window.ShopVietState && window.ShopVietState.broadcastAdminChange) {
        window.ShopVietState.broadcastAdminChange('vouchers_updated', {
          action: 'create',
          code: code,
          timestamp: Date.now()
        });
      }
      recordBroadcast('vouchers_updated', `Táº¡o voucher ${code}`);

      // =======================================================================
      // PHÆ¯Æ NG PHÃP 3: Targeted Micro-DOM Update - 0ms mÆ°á»£t mÃ  khÃ´ng giáº­t lag
      // =======================================================================
      const tabBadge = document.getElementById('adminVoucherTabBadge');
      if (tabBadge) {
        tabBadge.textContent = vouchers.length;
      }
      const tableBadge = document.getElementById('adminVoucherTableBadge');
      if (tableBadge) {
        tableBadge.textContent = `${vouchers.length} mÃ£`;
      }
      const totalCountEl = document.getElementById('adminVoucherTotalCount');
      if (totalCountEl) {
        totalCountEl.textContent = `${vouchers.length} mÃ£`;
      }
      const availableCountEl = document.getElementById('adminVoucherAvailableCount');
      if (availableCountEl) {
        const avail = vouchers.filter(v => !v.isUsed).length;
        availableCountEl.textContent = `${avail} mÃ£`;
      }

      // Cáº­p nháº­t báº£ng trá»±c tiáº¿p náº¿u Ä‘ang hiá»ƒn thá»‹
      const tbody = document.getElementById('adminVoucherTableTbody') || document.getElementById('adminVouchersTableBody');
      if (tbody) {
        // XÃ³a dÃ²ng thÃ´ng bÃ¡o rá»—ng náº¿u cÃ³
        const emptyRow = tbody.querySelector('td[colspan]');
        if (emptyRow && emptyRow.closest('tr')) {
          emptyRow.closest('tr').remove();
        }

        // Táº¡o dÃ²ng DOM má»›i
        const tempTable = document.createElement('tbody');
        tempTable.innerHTML = renderVoucherTableRow(newVoucher);
        const newRow = tempTable.firstElementChild;
        if (newRow) {
          // Hiá»‡u á»©ng highlight tÃ­m nháº¹ Ãªm Ã¡i
          newRow.classList.add('bg-indigo-100/70', 'dark:bg-indigo-950/70', 'transition-all', 'duration-700');
          tbody.prepend(newRow);
          setTimeout(() => {
            newRow.classList.remove('bg-indigo-100/70', 'dark:bg-indigo-950/70');
          }, 1200);
        }
      } else {
        // Náº¿u khÃ´ng cÃ³ báº£ng trÃªn DOM nhÆ°ng Ä‘ang á»Ÿ tab vouchers thÃ¬ render láº¡i tab body
        const tabContent = document.getElementById('adminTabContent');
        if (tabContent && currentActiveTab === 'vouchers') {
          tabContent.innerHTML = renderTabVouchers();
        }
      }

      // =======================================================================
      // PHÆ¯Æ NG PHÃP 2: Non-blocking Async I/O - Cháº¡y ngáº§m 100%, khÃ´ng await cháº·n luá»“ng UI
      // =======================================================================
      if (window.ShopVietState && typeof window.ShopVietState.pushAllToCloud === 'function') {
        window.ShopVietState.pushAllToCloud().catch(function (err) {
          console.warn('[Admin] Background pushAllToCloud error:', err);
        });
      }
    },

    deleteVoucher: function (code) {
      if (!confirm(`Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a mÃ£ voucher "${code}" khá»i há»‡ thá»‘ng?`)) {
        return;
      }
      if (window.ShopVietState && window.ShopVietState.deleteVoucher) {
        const res = window.ShopVietState.deleteVoucher(code);
        if (res.success) {
          // PHÆ¯Æ NG PHÃP 2: Non-blocking Cloud push cháº¡y ngáº§m
          if (window.ShopVietState && typeof window.ShopVietState.pushAllToCloud === 'function') {
            window.ShopVietState.pushAllToCloud().catch(function (err) {
              console.warn('[Admin] Background pushAllToCloud error:', err);
            });
          }
          if (window.ShopVietState && window.ShopVietState.broadcastAdminChange) {
            window.ShopVietState.broadcastAdminChange('vouchers_updated', {
              action: 'delete',
              code: code,
              timestamp: Date.now()
            });
          }
          recordBroadcast('vouchers_updated', `XÃ³a voucher ${code}`);

          const vouchers = (window.ShopVietState && window.ShopVietState.getVouchers) ? window.ShopVietState.getVouchers() : [];

          // PHÆ¯Æ NG PHÃP 3: Targeted Micro-DOM Update
          const tabBadge = document.getElementById('adminVoucherTabBadge');
          if (tabBadge) {
            tabBadge.textContent = vouchers.length;
          }
          const tableBadge = document.getElementById('adminVoucherTableBadge');
          if (tableBadge) {
            tableBadge.textContent = `${vouchers.length} mÃ£`;
          }
          const totalCountEl = document.getElementById('adminVoucherTotalCount');
          if (totalCountEl) {
            totalCountEl.textContent = `${vouchers.length} mÃ£`;
          }
          const availableCountEl = document.getElementById('adminVoucherAvailableCount');
          if (availableCountEl) {
            const avail = vouchers.filter(v => !v.isUsed).length;
            availableCountEl.textContent = `${avail} mÃ£`;
          }

          const tbody = document.getElementById('adminVoucherTableTbody') || document.getElementById('adminVouchersTableBody');
          if (tbody) {
            const row = tbody.querySelector(`tr[data-code="${code.toLowerCase()}"]`);
            if (row) {
              row.style.transition = 'all 0.3s ease';
              row.style.opacity = '0';
              row.style.transform = 'scale(0.95)';
              setTimeout(() => {
                row.remove();
                if (vouchers.length === 0) {
                  tbody.innerHTML = `
                    <tr>
                      <td colspan="8" class="py-12 text-center text-slate-400">
                        <div class="flex flex-col items-center justify-center gap-2">
                          <svg class="w-10 h-10 text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /></svg>
                          <span>ChÆ°a cÃ³ mÃ£ voucher nÃ o. HÃ£y báº¥m "+ Táº¡o mÃ£ má»›i" Ä‘á»ƒ thÃªm mÃ£ Ä‘áº§u tiÃªn!</span>
                        </div>
                      </td>
                    </tr>
                  `;
                }
              }, 300);
            }
          } else if (currentActiveTab === 'vouchers') {
            this.switchTab('vouchers');
          }

          notify(`ÄÃ£ xÃ³a mÃ£ voucher "${code}" thÃ nh cÃ´ng!`, 'info');
          notify('âš¡ ÄÃ£ phÃ¡t sÃ³ng dá»¯ liá»‡u thay Ä‘á»•i lÃªn Cloud Realtime thÃ nh cÃ´ng! Má»i mÃ¡y khÃ¡ch Ä‘ang cáº­p nháº­t tá»©c thÃ¬.', 'success');
        } else {
          notify(res.message || 'KhÃ´ng thá»ƒ xÃ³a mÃ£!', 'error');
        }
      }
    },

    resetDefaultVouchers: function () {
      if (window.ShopVietState && window.ShopVietState.saveVouchers) {
        const list = [
          {
            code: 'VIP20P',
            type: 'percent_discount',
            percent: 20,
            value: 20,
            singleUse: true,
            isUsed: false,
            usedBy: null,
            usedAt: null,
            orderCode: null,
            createdAt: '2026-03-20T00:00:00.000Z'
          },
          {
            code: 'DISCOUNT20K',
            type: 'order_discount',
            value: 20000,
            singleUse: true,
            isUsed: false,
            usedBy: null,
            usedAt: null,
            orderCode: null,
            createdAt: '2026-03-20T00:00:00.000Z'
          },
          {
            code: 'VIP50K',
            type: 'order_discount',
            value: 50000,
            singleUse: true,
            isUsed: false,
            usedBy: null,
            usedAt: null,
            orderCode: null,
            createdAt: '2026-03-20T00:00:00.000Z'
          }
        ];
        window.ShopVietState.saveVouchers(list);
        if (window.ShopVietState && typeof window.ShopVietState.pushAllToCloud === 'function') {
          window.ShopVietState.pushAllToCloud().catch(function () {});
        }
        this.switchTab('vouchers');
        const tabBadge = document.getElementById('adminVoucherTabBadge');
        if (tabBadge) {
          tabBadge.textContent = list.length;
        }
        notify('ÄÃ£ khÃ´i phá»¥c danh sÃ¡ch voucher máº«u ban Ä‘áº§u!', 'success');
      }
    },

    filterVouchers: function (query) {
      const q = (query || '').trim().toLowerCase();
      const rows = document.querySelectorAll('#adminVoucherTableTbody tr');
      let matchCount = 0;
      rows.forEach(row => {
        const code = row.getAttribute('data-code') || '';
        const user = row.getAttribute('data-user') || '';
        const text = row.innerText.toLowerCase();
        if (!q || code.includes(q) || user.includes(q) || text.includes(q)) {
          row.style.display = '';
          matchCount++;
        } else {
          row.style.display = 'none';
        }
      });
      const badge = document.getElementById('adminVoucherTableBadge');
      if (badge) {
        badge.textContent = `${matchCount} mÃ£`;
      }
    },

    // ==================== QUáº¢N LÃ Lá»ŠCH Háº¸N KHÃCH & SLOT EXCEL ====================
    openScheduleModal: function (scheduleId) {
      this.closeScheduleModal();
      const div = document.createElement('div');
      div.id = 'adminScheduleModalContainer';
      div.innerHTML = renderScheduleModal(scheduleId);
      document.body.appendChild(div);
    },

    closeScheduleModal: function () {
      const modal = document.getElementById('adminAddScheduleModal');
      if (modal) modal.remove();
      const cont = document.getElementById('adminScheduleModalContainer');
      if (cont) cont.remove();
    },

    setScheduleQuickExpire: function (months) {
      const startInput = document.getElementById('modalSchStartDate');
      let baseDate = new Date();
      if (startInput && startInput.value) {
        const parsed = new Date(startInput.value);
        if (!isNaN(parsed.getTime())) {
          baseDate = parsed;
        }
      }
      const expDate = new Date(baseDate);
      expDate.setMonth(expDate.getMonth() + Number(months));
      const expInput = document.getElementById('modalSchExpireDate');
      if (expInput) {
        expInput.value = expDate.toISOString().split('T')[0];
      }
    },

    saveScheduleFromModal: function (scheduleId) {
      const emailInput = document.getElementById('modalSchCustomerEmail');
      const nameInput = document.getElementById('modalSchCustomerName');
      const managerInput = document.getElementById('modalSchManagerEmail');
      const serviceInput = document.getElementById('modalSchService');
      const startInput = document.getElementById('modalSchStartDate');
      const expInput = document.getElementById('modalSchExpireDate');
      const notesInput = document.getElementById('modalSchNotes');

      if (!emailInput || !expInput) return;

      const customerEmail = emailInput.value.trim().toLowerCase();
      const customerName = (nameInput ? nameInput.value : '').trim() || customerEmail.split('@')[0];
      const managerEmail = (managerInput ? managerInput.value : '').trim() || 'admin-slot@shopviet.vip';
      const serviceName = (serviceInput ? serviceInput.value : '').trim() || '[1 ThÃ¡ng] Gemini Argon 4 Pro + 5TB Drive';
      const startDate = (startInput ? startInput.value : '').trim() || new Date().toISOString().split('T')[0];
      const expireDate = expInput.value.trim();
      const notes = (notesInput ? notesInput.value : '').trim();

      if (!customerEmail || !customerEmail.includes('@')) {
        notify('Vui lÃ²ng nháº­p Ä‘á»‹a chá»‰ email khÃ¡ch hÃ ng há»£p lá»‡!', 'error');
        return;
      }
      if (!expireDate) {
        notify('Vui lÃ²ng chá»n ngÃ y háº¿t háº¡n cho khÃ¡ch!', 'error');
        return;
      }

      const scheduleData = {
        customerEmail: customerEmail,
        customerName: customerName,
        managerEmail: managerEmail,
        serviceName: serviceName,
        startDate: startDate,
        expireDate: expireDate,
        notes: notes
      };

      if (window.ShopVietState) {
        if (scheduleId) {
          window.ShopVietState.updateSchedule(scheduleId, scheduleData);
          notify(`ÄÃ£ cáº­p nháº­t lá»‹ch háº¹n cho ${customerEmail}!`, 'success');
        } else {
          window.ShopVietState.addSchedule(scheduleData);
          notify(`ÄÃ£ thÃªm ${customerEmail} vÃ o báº£ng tÃ­nh Excel!`, 'success');
        }

        if (typeof window.ShopVietState.pushAllToCloud === 'function') {
          window.ShopVietState.pushAllToCloud().catch(function () {});
        }

        if (window.ShopVietState && window.ShopVietState.broadcastAdminChange) {
          window.ShopVietState.broadcastAdminChange('schedules_updated', {
            id: scheduleId || 'new',
            customer: customerEmail,
            timestamp: Date.now()
          });
        }
        recordBroadcast('schedules_updated', `Lá»‹ch háº¹n: ${customerEmail}`);
        notify('âš¡ ÄÃ£ phÃ¡t sÃ³ng dá»¯ liá»‡u thay Ä‘á»•i lÃªn Cloud Realtime thÃ nh cÃ´ng! Má»i mÃ¡y khÃ¡ch Ä‘ang cáº­p nháº­t tá»©c thÃ¬.', 'success');

        this.closeScheduleModal();
        this.switchTab('schedules');

        const tabBadge = document.getElementById('adminScheduleTabBadge');
        if (tabBadge && window.ShopVietState.getSchedules) {
          tabBadge.textContent = window.ShopVietState.getSchedules().length;
        }
      }
    },

    deleteSchedule: function (id) {
      if (!confirm('Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a lá»‹ch háº¹n nÃ y khá»i báº£ng Excel khÃ´ng?')) {
        return;
      }
      if (window.ShopVietState && window.ShopVietState.deleteSchedule) {
        const ok = window.ShopVietState.deleteSchedule(id);
        if (ok) {
          if (typeof window.ShopVietState.pushAllToCloud === 'function') {
            window.ShopVietState.pushAllToCloud().catch(function () {});
          }
          if (window.ShopVietState && window.ShopVietState.broadcastAdminChange) {
            window.ShopVietState.broadcastAdminChange('schedules_updated', {
              id: id,
              action: 'delete',
              timestamp: Date.now()
            });
          }
          recordBroadcast('schedules_updated', `XÃ³a lá»‹ch háº¹n ID: ${id}`);
          this.switchTab('schedules');
          const tabBadge = document.getElementById('adminScheduleTabBadge');
          if (tabBadge && window.ShopVietState.getSchedules) {
            tabBadge.textContent = window.ShopVietState.getSchedules().length;
          }
          notify('ÄÃ£ xÃ³a lá»‹ch háº¹n khá»i báº£ng Excel thÃ nh cÃ´ng!', 'info');
          notify('âš¡ ÄÃ£ phÃ¡t sÃ³ng dá»¯ liá»‡u thay Ä‘á»•i lÃªn Cloud Realtime thÃ nh cÃ´ng! Má»i mÃ¡y khÃ¡ch Ä‘ang cáº­p nháº­t tá»©c thÃ¬.', 'success');
        } else {
          notify('KhÃ´ng tÃ¬m tháº¥y lá»‹ch háº¹n cáº§n xÃ³a!', 'error');
        }
      }
    },

    // ==================== INLINE EDIT & SAVE SCHEDULE CLOUD ====================
    saveInlineSchedule: async function (id) {
      const customerInput = document.getElementById(`sched-customer-${id}`);
      const managerInput = document.getElementById(`sched-manager-${id}`);
      const serviceInput = document.getElementById(`sched-service-${id}`);
      const startInput = document.getElementById(`sched-start-${id}`);
      const expireInput = document.getElementById(`sched-expire-${id}`);
      const saveBtn = document.getElementById(`btn-save-sched-${id}`);

      if (!customerInput || !managerInput || !expireInput) return;

      const customerEmail = customerInput.value.trim().toLowerCase();
      const managerEmail = managerInput.value.trim();
      const serviceName = serviceInput ? serviceInput.value.trim() : '';
      const startDate = startInput ? startInput.value.trim() : '';
      const expireDate = expireInput.value.trim();

      if (!customerEmail || !customerEmail.includes('@')) {
        notify('Vui lÃ²ng nháº­p Email KhÃ¡ch HÃ ng há»£p lá»‡!', 'error');
        customerInput.focus();
        return;
      }
      if (!managerEmail) {
        notify('Vui lÃ²ng nháº­p Email Quáº£n LÃ½ / Slot!', 'error');
        managerInput.focus();
        return;
      }
      if (!expireDate) {
        notify('Vui lÃ²ng chá»n NgÃ y Háº¿t Háº¡n!', 'error');
        expireInput.focus();
        return;
      }

      const schedules = (window.ShopVietState && window.ShopVietState.getSchedules) ? window.ShopVietState.getSchedules() : [];
      const item = schedules.find(s => s.id === id);
      if (!item) {
        notify('KhÃ´ng tÃ¬m tháº¥y báº£n ghi cáº§n lÆ°u!', 'error');
        return;
      }

      // Cáº­p nháº­t giÃ¡ trá»‹
      item.customerEmail = customerEmail;
      item.managerEmail = managerEmail;
      if (serviceName) item.serviceName = serviceName;
      if (startDate) item.startDate = startDate;
      item.expireDate = expireDate;

      // Cáº­p nháº­t thuá»™c tÃ­nh dataset dÃ²ng Ä‘á»ƒ tÃ¬m kiáº¿m chuáº©n xÃ¡c
      const tr = document.querySelector(`tr[data-id="${id}"]`);
      if (tr) {
        tr.setAttribute('data-customer', customerEmail.toLowerCase());
        tr.setAttribute('data-manager', managerEmail.toLowerCase());
        tr.setAttribute('data-service', serviceName.toLowerCase());
      }

      // 1. LÆ°u LocalStorage ngay láº­p tá»©c
      if (window.ShopVietState && window.ShopVietState.saveSchedules) {
        window.ShopVietState.saveSchedules(schedules);
      }

      // 2. Cáº­p nháº­t badge háº¡n dÃ¹ng tá»©c thÃ¬ trÃªn giao diá»‡n
      this.updateScheduleDaysLeftBadge(id);

      // 3. Hiá»‡u á»©ng nÃºt LÆ°u ÄÃ¡m MÃ¢y: Äang lÆ°u... -> ÄÃ£ lÆ°u âœ“
      let originalBtnHTML = '';
      if (saveBtn) {
        originalBtnHTML = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.classList.remove('bg-emerald-50', 'text-emerald-700', 'dark:bg-emerald-950/60', 'dark:text-emerald-400', 'border-emerald-300', 'dark:border-emerald-800');
        saveBtn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
        saveBtn.innerHTML = `
          <svg class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Äang lÆ°u...</span>
        `;
      }

      // 4. Äáº©y ngay lÃªn Cloud REST Ä‘á»ƒ khÃ´ng bá»‹ máº¥t khi reset trang web hoáº·c Ä‘Äƒng nháº­p trÃªn mÃ¡y khÃ¡c
      try {
        if (window.ShopVietState && typeof window.ShopVietState.pushAllToCloud === 'function') {
          await window.ShopVietState.pushAllToCloud();
        }
        if (saveBtn) {
          saveBtn.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
          saveBtn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600');
          saveBtn.innerHTML = `
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>ÄÃ£ lÆ°u âœ“</span>
          `;
          setTimeout(() => {
            saveBtn.disabled = false;
            saveBtn.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-600');
            saveBtn.classList.add('bg-emerald-50', 'text-emerald-700', 'dark:bg-emerald-950/60', 'dark:text-emerald-400', 'border-emerald-300', 'dark:border-emerald-800');
            saveBtn.innerHTML = originalBtnHTML;
          }, 2000);
        }
        notify(`ÄÃ£ lÆ°u "${managerEmail}" lÃªn ÄÃ¡m mÃ¢y Cloud thÃ nh cÃ´ng! KhÃ´ng bá»‹ máº¥t dá»¯ liá»‡u khi Ä‘á»•i mÃ¡y.`, 'success');
      } catch (err) {
        console.warn('[Save Inline Schedule Cloud Sync Error]:', err);
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
          saveBtn.classList.add('bg-emerald-50', 'text-emerald-700', 'dark:bg-emerald-950/60', 'dark:text-emerald-400', 'border-emerald-300', 'dark:border-emerald-800');
          saveBtn.innerHTML = originalBtnHTML;
        }
        notify(`ÄÃ£ lÆ°u cá»¥c bá»™! ÄÃ¡m mÃ¢y sáº½ tá»± Ä‘á»“ng bá»™ khi cÃ³ káº¿t ná»‘i máº¡ng.`, 'info');
      }
    },

    updateScheduleDaysLeftBadge: function (id) {
      const expireInput = document.getElementById(`sched-expire-${id}`);
      const badgeCell = document.getElementById(`sched-badge-cell-${id}`);
      if (!expireInput || !badgeCell || !expireInput.value) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const exp = new Date(expireInput.value);
      exp.setHours(0, 0, 0, 0);
      const diffMs = exp.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      let statusBadge = '';
      if (daysLeft > 7) {
        statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-sm"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>CÃ²n ${daysLeft} ngÃ y</span>`;
      } else if (daysLeft > 0) {
        statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800 shadow-sm animate-pulse"><span class="w-2 h-2 rounded-full bg-amber-500"></span>Sáº¯p háº¿t (${daysLeft} ngÃ y)</span>`;
      } else {
        statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-800 shadow-sm"><span class="w-2 h-2 rounded-full bg-rose-500"></span>ÄÃ£ háº¿t háº¡n</span>`;
      }
      badgeCell.innerHTML = statusBadge;
    },

    quickEditSchedule: function (id, field) {
      const list = (window.ShopVietState && window.ShopVietState.getSchedules) ? window.ShopVietState.getSchedules() : [];
      const item = list.find(s => s.id === id);
      if (!item) return;

      if (field === 'managerEmail') {
        const newVal = prompt('Nháº­p Email Quáº£n LÃ½ / Slot má»›i:', item.managerEmail);
        if (newVal !== null && newVal.trim()) {
          window.ShopVietState.updateSchedule(id, { managerEmail: newVal.trim() });
          if (typeof window.ShopVietState.pushAllToCloud === 'function') {
            window.ShopVietState.pushAllToCloud().catch(function () {});
          }
          this.switchTab('schedules');
          notify('ÄÃ£ cáº­p nháº­t Email Quáº£n LÃ½!', 'success');
        }
      } else if (field === 'expireDate') {
        const newVal = prompt('Nháº­p NgÃ y Háº¿t Háº¡n má»›i (YYYY-MM-DD):', item.expireDate);
        if (newVal !== null && newVal.trim()) {
          window.ShopVietState.updateSchedule(id, { expireDate: newVal.trim() });
          if (typeof window.ShopVietState.pushAllToCloud === 'function') {
            window.ShopVietState.pushAllToCloud().catch(function () {});
          }
          this.switchTab('schedules');
          notify('ÄÃ£ cáº­p nháº­t NgÃ y Háº¿t Háº¡n!', 'success');
        }
      }
    },

    exportSchedulesToExcel: function () {
      const schedules = (window.ShopVietState && window.ShopVietState.getSchedules) ? window.ShopVietState.getSchedules() : [];
      if (!schedules || schedules.length === 0) {
        notify('Danh sÃ¡ch khÃ¡ch hÃ ng Ä‘ang trá»‘ng, khÃ´ng thá»ƒ xuáº¥t file!', 'warning');
        return;
      }

      const BOM = '\uFEFF';
      let csv = BOM + 'STT,MÃ£ Lá»‹ch,Email KhÃ¡ch HÃ ng,TÃªn KhÃ¡ch HÃ ng,Email Quáº£n LÃ½ (Slot),GÃ³i Dá»‹ch Vá»¥,NgÃ y Báº¯t Äáº§u,NgÃ y Háº¿t Háº¡n,Sá»‘ NgÃ y CÃ²n Láº¡i,Tráº¡ng ThÃ¡i Háº¡n DÃ¹ng,Ghi ChÃº\r\n';
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const escapeCsv = function (str) {
        return `"${String(str || '').replace(/"/g, '""')}"`;
      };

      schedules.forEach(function (s, idx) {
        const exp = new Date(s.expireDate);
        exp.setHours(0, 0, 0, 0);
        const diffMs = exp.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const status = daysLeft > 7 ? `CÃ²n ${daysLeft} ngÃ y` : (daysLeft > 0 ? `Sáº¯p háº¿t (${daysLeft} ngÃ y)` : 'ÄÃ£ háº¿t háº¡n');

        const row = [
          idx + 1,
          escapeCsv(s.id),
          escapeCsv(s.customerEmail),
          escapeCsv(s.customerName),
          escapeCsv(s.managerEmail),
          escapeCsv(s.serviceName),
          escapeCsv(s.startDate),
          escapeCsv(s.expireDate),
          daysLeft,
          escapeCsv(status),
          escapeCsv(s.notes)
        ];
        csv += row.join(',') + '\r\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'danh_sach_khach_hang_shopviet247.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      notify('ÄÃ£ xuáº¥t danh sÃ¡ch khÃ¡ch hÃ ng sang file Excel (CSV) thÃ nh cÃ´ng!', 'success');
    },

    filterSchedules: function (query) {
      const q = (query || '').trim().toLowerCase();
      const rows = document.querySelectorAll('#adminScheduleTableTbody tr');
      let matchCount = 0;
      rows.forEach(row => {
        const custInp = row.querySelector('[id^="sched-customer-"]');
        const mgrInp = row.querySelector('[id^="sched-manager-"]');
        const srvInp = row.querySelector('[id^="sched-service-"]');
        const customer = (custInp ? custInp.value : row.getAttribute('data-customer') || '').toLowerCase();
        const manager = (mgrInp ? mgrInp.value : row.getAttribute('data-manager') || '').toLowerCase();
        const service = (srvInp ? srvInp.value : row.getAttribute('data-service') || '').toLowerCase();
        const notes = (row.getAttribute('data-notes') || '').toLowerCase();
        const text = row.innerText.toLowerCase();
        if (!q || customer.includes(q) || manager.includes(q) || service.includes(q) || notes.includes(q) || text.includes(q)) {
          row.style.display = '';
          matchCount++;
        } else {
          row.style.display = 'none';
        }
      });
      const badge = document.getElementById('adminScheduleTableBadge');
      if (badge) {
        badge.textContent = `${matchCount} báº£n ghi`;
      }
    },

    resetDefaultSchedules: function () {
      if (window.ShopVietState && window.ShopVietState.saveSchedules) {
        const DEFAULT_SCHEDULES = [
          {
            id: 'SCH-001',
            customerEmail: 'thaitraicau123@gmail.com',
            customerName: 'BÃ¹i ThÃ¡i',
            managerEmail: 'slot1-pro@shopviet.vip',
            serviceName: '[1 ThÃ¡ng] Gemini Argon 4 Pro + 5TB Drive',
            startDate: '2026-10-29',
            expireDate: '2026-11-29',
            notes: 'KhÃ¡ch VIP nÃ¢ng cáº¥p chÃ­nh chá»§'
          },
          {
            id: 'SCH-002',
            customerEmail: 'huy.dev99@gmail.com',
            customerName: 'Nguyá»…n Huy',
            managerEmail: 'slot2-cursor@shopviet.vip',
            serviceName: 'Cursor Pro 1 ThÃ¡ng ChÃ­nh Chá»§',
            startDate: '2026-10-25',
            expireDate: '2026-11-01',
            notes: 'Sáº¯p háº¿t háº¡n cáº§n nháº¯c gia háº¡n'
          }
        ];
        window.ShopVietState.saveSchedules(DEFAULT_SCHEDULES);
        if (typeof window.ShopVietState.pushAllToCloud === 'function') {
          window.ShopVietState.pushAllToCloud().catch(function () {});
        }
        this.switchTab('schedules');
        const tabBadge = document.getElementById('adminScheduleTabBadge');
        if (tabBadge) {
          tabBadge.textContent = DEFAULT_SCHEDULES.length;
        }
        notify('ÄÃ£ khÃ´i phá»¥c danh sÃ¡ch háº¹n lá»‹ch máº«u ban Ä‘áº§u!', 'success');
      }
    },

    // 21. PhÃ¡t tÃ­n hiá»‡u thá»­ nghiá»‡m Realtime Hub (Broadcast Test Ping)
    broadcastTestPing: function () {
      const payload = {
        msg: 'Admin vá»«a gá»­i tÃ­n hiá»‡u Ä‘á»“ng bá»™!',
        time: new Date().toLocaleTimeString('vi-VN'),
        timestamp: Date.now()
      };
      if (window.ShopVietState && typeof window.ShopVietState.broadcastAdminChange === 'function') {
        window.ShopVietState.broadcastAdminChange('test_ping', payload);
      } else {
        try {
          if (typeof BroadcastChannel !== 'undefined') {
            const bc = new BroadcastChannel('shopviet_realtime_sync');
            bc.postMessage({ type: 'test_ping', payload: payload, timestamp: Date.now() });
            bc.close();
          }
        } catch (e) {}
        window.dispatchEvent(new CustomEvent('shopviet_realtime_change', { detail: { type: 'test_ping', payload: payload } }));
      }
      recordBroadcast('test_ping', 'Admin vá»«a gá»­i tÃ­n hiá»‡u Ä‘á»“ng bá»™!');
      notify('âš¡ ÄÃ£ phÃ¡t sÃ³ng dá»¯ liá»‡u thay Ä‘á»•i lÃªn Cloud Realtime thÃ nh cÃ´ng! Má»i mÃ¡y khÃ¡ch Ä‘ang cáº­p nháº­t tá»©c thÃ¬.', 'success');
      if (currentActiveTab === 'realtime') {
        const tabContent = document.getElementById('adminTabContent');
        if (tabContent) tabContent.innerHTML = renderTabRealtime();
      }
    },

    // 22. PhÃ¡t sÃ³ng Ä‘á»“ng bá»™ láº¡i toÃ n bá»™ Sáº£n pháº©m
    broadcastProductsSync: function () {
      const prods = (window.ShopVietData && window.ShopVietData.products) || [];
      const payload = {
        action: 'sync_all',
        count: prods.length,
        timestamp: Date.now()
      };
      if (window.ShopVietState && typeof window.ShopVietState.broadcastAdminChange === 'function') {
        window.ShopVietState.broadcastAdminChange('products_updated', payload);
      } else {
        try {
          if (typeof BroadcastChannel !== 'undefined') {
            const bc = new BroadcastChannel('shopviet_realtime_sync');
            bc.postMessage({ type: 'products_updated', payload: payload, timestamp: Date.now() });
            bc.close();
          }
        } catch (e) {}
        window.dispatchEvent(new CustomEvent('shopviet_realtime_change', { detail: { type: 'products_updated', payload: payload } }));
      }
      recordBroadcast('products_updated', `Äá»“ng bá»™ toÃ n bá»™ ${prods.length} sáº£n pháº©m`);
      notify('âš¡ ÄÃ£ phÃ¡t sÃ³ng dá»¯ liá»‡u thay Ä‘á»•i lÃªn Cloud Realtime thÃ nh cÃ´ng! Má»i mÃ¡y khÃ¡ch Ä‘ang cáº­p nháº­t tá»©c thÃ¬.', 'success');
      if (currentActiveTab === 'realtime') {
        const tabContent = document.getElementById('adminTabContent');
        if (tabContent) tabContent.innerHTML = renderTabRealtime();
      }
    },

    // 23. PhÃ¡t sÃ³ng Ä‘á»“ng bá»™ Cáº¥u hÃ¬nh VietQR
    broadcastVietQRSync: function () {
      const config = getVietQRConfig();
      const payload = {
        config: config,
        timestamp: Date.now()
      };
      if (window.ShopVietState && typeof window.ShopVietState.broadcastAdminChange === 'function') {
        window.ShopVietState.broadcastAdminChange('vietqr_updated', payload);
      } else {
        try {
          if (typeof BroadcastChannel !== 'undefined') {
            const bc = new BroadcastChannel('shopviet_realtime_sync');
            bc.postMessage({ type: 'vietqr_updated', payload: payload, timestamp: Date.now() });
            bc.close();
          }
        } catch (e) {}
        window.dispatchEvent(new CustomEvent('shopviet_realtime_change', { detail: { type: 'vietqr_updated', payload: payload } }));
      }
      recordBroadcast('vietqr_updated', `Cáº­p nháº­t cáº¥u hÃ¬nh VietQR (${config.accountName} - ${config.accountNumber})`);
      notify('âš¡ ÄÃ£ phÃ¡t sÃ³ng dá»¯ liá»‡u thay Ä‘á»•i lÃªn Cloud Realtime thÃ nh cÃ´ng! Má»i mÃ¡y khÃ¡ch Ä‘ang cáº­p nháº­t tá»©c thÃ¬.', 'success');
      if (currentActiveTab === 'realtime') {
        const tabContent = document.getElementById('adminTabContent');
        if (tabContent) tabContent.innerHTML = renderTabRealtime();
      }
    },

    // 24. XÃ³a nháº­t kÃ½ phÃ¡t sÃ³ng
    clearBroadcastHistory: function () {
      localStorage.removeItem('shopviet_broadcast_history');
      notify('ÄÃ£ xÃ³a sáº¡ch nháº­t kÃ½ phÃ¡t sÃ³ng!', 'info');
      if (currentActiveTab === 'realtime') {
        const tabContent = document.getElementById('adminTabContent');
        if (tabContent) tabContent.innerHTML = renderTabRealtime();
      }
    },

    // 25. MASTER ACTION: XUáº¤T Báº¢N & Äá»’NG Bá»˜ TOÃ€N Cáº¦U Tá»¨C THÃŒ
    masterPublish: async function () {
      const btn = document.getElementById('adminMasterPublishBtn');
      const icon = document.getElementById('adminMasterPublishIcon');
      const text = document.getElementById('adminMasterPublishText');

      if (btn) btn.disabled = true;
      if (text) text.textContent = 'Äang xuáº¥t báº£n lÃªn Cloud...';
      if (icon) icon.classList.add('animate-spin');

      try {
        const now = Date.now();
        const isoNow = new Date(now).toISOString();

        // 1. Láº¥y toÃ n bá»™ sáº£n pháº©m hiá»‡n táº¡i, cáº­p nháº­t updatedAt
        const prods = (window.ShopVietData && window.ShopVietData.products) || [];
        if (window.ShopVietState) {
          window.ShopVietState.setLastUpdatedAt(now);
          if (typeof window.ShopVietState.saveCustomProducts === 'function') {
            window.ShopVietState.saveCustomProducts(prods);
          }
        }

        // 2. Äáº©y toÃ n bá»™ dá»¯ liá»‡u trá»±c tiáº¿p lÃªn GitHub Cloud Storage & Fallback REST
        let pushSuccess = false;
        if (window.ShopVietState && typeof window.ShopVietState.pushAllToCloud === 'function') {
          pushSuccess = await window.ShopVietState.pushAllToCloud(false);
        }

        // 3. PhÃ¡t sÃ³ng realtime tÃ­n hiá»‡u master_publish tá»›i táº¥t cáº£ thiáº¿t bá»‹
        if (window.ShopVietState && typeof window.ShopVietState.broadcastAdminChange === 'function') {
          window.ShopVietState.broadcastAdminChange('master_publish', {
            action: 'master_publish',
            products: prods,
            count: prods.length,
            timestamp: now,
            updatedAt: now,
            isoTimestamp: isoNow,
            source: 'admin_master_publish'
          }, true);
        }

        // 4. Ghi nháº­n nháº­t kÃ½ phÃ¡t sÃ³ng trong Admin Portal
        recordBroadcast('master_publish', `Xuáº¥t báº£n toÃ n cáº§u (${prods.length} sáº£n pháº©m)`);

        // 5. Hiá»ƒn thá»‹ Toast / Modal thÃ nh cÃ´ng rá»±c rá»¡
        notify('ðŸŽ‰ ÄÃ£ phÃ¡t sÃ³ng cáº­p nháº­t dá»¯ liá»‡u tá»›i toÃ n bá»™ cÃ¡c thiáº¿t bá»‹ Ä‘ang truy cáº­p!', 'success');

        // Báº¯n CustomEvent shopviet_realtime_update Ä‘á»ƒ mÃ n hÃ¬nh Home nháº¥p nhÃ¡y phÃ¡t sÃ¡ng
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
          try {
            window.dispatchEvent(new CustomEvent('shopviet_realtime_update', {
              detail: {
                type: 'master_publish',
                message: 'ðŸ”” Cá»­a hÃ ng vá»«a cáº­p nháº­t sáº£n pháº©m má»›i!',
                updatedAt: now
              }
            }));
          } catch (eEvt) {}
        }

        // Cáº­p nháº­t láº¡i tab realtime náº¿u Ä‘ang má»Ÿ
        if (currentActiveTab === 'realtime') {
          const tabContent = document.getElementById('adminTabContent');
          if (tabContent) tabContent.innerHTML = renderTabRealtime();
        }
      } catch (err) {
        console.warn('[Admin Master Publish Error]:', err);
        notify('Lá»—i xuáº¥t báº£n lÃªn ÄÃ¡m MÃ¢y: ' + (err.message || 'Vui lÃ²ng kiá»ƒm tra káº¿t ná»‘i máº¡ng!'), 'error');
      } finally {
        if (btn) btn.disabled = false;
        if (text) text.textContent = 'ðŸš€ XUáº¤T Báº¢N & Äá»’NG Bá»˜ TOÃ€N Cáº¦U Tá»¨C THÃŒ';
        if (icon) icon.classList.remove('animate-spin');
      }
    },

    // Helper export ra ngoÃ i
    getVietQRConfig: getVietQRConfig,
    isAllowedAdminUser: isAllowedAdminUser,
    requestAdminNotificationPermission: function(userInit) { return window.requestAdminNotificationPermission(userInit); },
    triggerAdminOrderNotification: function(order) { return window.triggerAdminOrderNotification(order); },
    testAdminPushNotification: function() { return window.testAdminPushNotification && window.testAdminPushNotification(); }
  };

  // =========================================================================
  // MODULE PWA PUSH NOTIFICATION IPHONE CHO ADMIN (iOS 16.4+ & DESKTOP)
  // =========================================================================

  /**
   * Cáº­p nháº­t UI nÃºt tráº¡ng thÃ¡i thÃ´ng bÃ¡o iPhone trong tab ÄÆ¡n hÃ ng
   */
  function updateAdminNotifButtonUI(status) {
    const textEl = document.getElementById('adminPushNotifStatusText');
    const btnEl = document.getElementById('adminPushNotifToggleBtn');
    if (!textEl || !btnEl) return;
    if (status === 'granted') {
      textEl.textContent = 'ThÃ´ng bÃ¡o iPhone: Äang báº­t';
      btnEl.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
    } else if (status === 'denied') {
      textEl.textContent = 'ThÃ´ng bÃ¡o iPhone: ÄÃ£ bá»‹ cháº·n';
      btnEl.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
    } else {
      textEl.textContent = 'Báº­t ThÃ´ng BÃ¡o iPhone';
      btnEl.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800';
    }
  }

  /**
   * Tá»± Ä‘á»™ng xin quyá»n Push Notification cho Admin khi Ä‘Äƒng nháº­p hoáº·c truy cáº­p Admin
   * Chá»‰ kÃ­ch hoáº¡t cho tÃ i khoáº£n thaitraicau123@gmail.com hoáº·c cÃ³ role admin
   */
  window.requestAdminNotificationPermission = async function (userInitiated = false) {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      if (userInitiated && window.ShopVietState && window.ShopVietState.showToast) {
        window.ShopVietState.showToast('TrÃ¬nh duyá»‡t khÃ´ng há»— trá»£ Web Notification API.', 'info');
      }
      return false;
    }

    const currentUser = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user) ||
                        (window.ShopVietState && window.ShopVietState.currentUser);
    const isAdmin = Boolean(currentUser && (currentUser.email === 'thaitraicau123@gmail.com' || currentUser.role === 'admin'));

    if (!isAdmin) {
      console.log('[PWA-Admin-Notify] Bá» qua xin quyá»n vÃ¬ tÃ i khoáº£n hiá»‡n táº¡i khÃ´ng pháº£i lÃ  Admin (thaitraicau123@gmail.com).');
      return false;
    }

    if (Notification.permission === 'granted') {
      updateAdminNotifButtonUI('granted');
      if (userInitiated && window.ShopVietState && window.ShopVietState.showToast) {
        window.ShopVietState.showToast('ðŸ”” ThÃ´ng bÃ¡o PWA iPhone Admin Ä‘Ã£ Ä‘Æ°á»£c báº­t sáºµn sÃ ng!', 'success');
      }
      return true;
    }

    if (Notification.permission === 'denied') {
      updateAdminNotifButtonUI('denied');
      if (userInitiated && window.ShopVietState && window.ShopVietState.showToast) {
        window.ShopVietState.showToast('Báº¡n Ä‘Ã£ táº¯t quyá»n thÃ´ng bÃ¡o trÃªn trÃ¬nh duyá»‡t. HÃ£y vÃ o CÃ i Ä‘áº·t Ä‘á»ƒ cho phÃ©p!', 'warning');
      }
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      updateAdminNotifButtonUI(permission);
      if (permission === 'granted') {
        if (window.ShopVietState && window.ShopVietState.showToast) {
          window.ShopVietState.showToast('ðŸ”” ÄÃ£ kÃ­ch hoáº¡t thÃ´ng bÃ¡o Ä‘Æ¡n hÃ ng PWA cho iPhone cá»§a Admin!', 'success');
        }
        return true;
      }
      return false;
    } catch (err) {
      console.warn('[PWA-Admin-Notify] Lá»—i khi xin quyá»n Notification:', err);
      return false;
    }
  };

  /**
   * Thá»­ nghiá»‡m Native Push Notification trÃªn mÃ n hÃ¬nh khÃ³a iPhone vÃ  Desktop
   */
  window.testAdminPushNotification = async function () {
    if (typeof window.requestAdminNotificationPermission === 'function') {
      const granted = await window.requestAdminNotificationPermission(true);
      if (!granted && typeof Notification !== 'undefined' && Notification.permission !== 'granted') return;
    }
    const testCode = 'DJ2026' + Math.floor(1000 + Math.random() * 9000);
    const mockOrder = {
      orderCode: testCode,
      id: '#' + testCode,
      amount: 69000,
      status: 'pending_review'
    };
    if (typeof window.triggerAdminOrderNotification === 'function') {
      await window.triggerAdminOrderNotification(mockOrder, true);
    }
    if (window.ShopVietState && window.ShopVietState.showToast) {
      window.ShopVietState.showToast('ðŸš€ ÄÃ£ gá»­i thÃ´ng bÃ¡o iPhone thá»­ nghiá»‡m! HÃ£y kiá»ƒm tra mÃ n hÃ¬nh khÃ³a hoáº·c Notification Center.', 'success');
    }
  };

  /**
   * KÃ­ch hoáº¡t Native PWA Push Notification cho iPhone cá»§a Admin (iOS 16.4+) & Desktop
   * Chá»‰ phÃ¡t khi tÃ i khoáº£n hiá»‡n táº¡i lÃ  thaitraicau123@gmail.com hoáº·c cÃ³ role admin (hoáº·c khi admin test trá»±c tiáº¿p)
   */
  window.triggerAdminOrderNotification = async function (order, isTest = false) {
    if (!order) return;

    // 1. Kiá»ƒm tra quyá»n: Chá»‰ tÃ i khoáº£n admin (thaitraicau123@gmail.com) má»›i nháº­n thÃ´ng bÃ¡o (trá»« khi test trá»±c tiáº¿p)
    const currentUser = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user) ||
                        (window.ShopVietState && window.ShopVietState.currentUser);
    const isAdmin = Boolean(currentUser && (currentUser.email === 'thaitraicau123@gmail.com' || currentUser.role === 'admin'));

    if (!isAdmin && !isTest) {
      console.log('[PWA-Admin-Notify] Bá» qua vÃ¬ tÃ i khoáº£n hiá»‡n táº¡i khÃ´ng pháº£i lÃ  Admin (thaitraicau123@gmail.com).');
      return;
    }

    const rawCode = order.orderCode || order.memo || order.paymentMemo || order.id || 'DJ202688';
    const cleanCode = rawCode.replace(/^#/, '');
    const orderCode = '#' + cleanCode;
    const rawAmount = order.amount || order.total || 69000;
    const amountStr = typeof rawAmount === 'number' 
      ? new Intl.NumberFormat('vi-VN').format(rawAmount) 
      : rawAmount;

    // TiÃªu Ä‘á» & ná»™i dung chuáº©n chá»‰ theo yÃªu cáº§u
    const title = `ðŸ”” ÄÆ¡n hÃ ng má»›i ${orderCode} - Chá» duyá»‡t!`;
    const body = `KhÃ¡ch vá»«a bÃ¡o chuyá»ƒn khoáº£n ${amountStr}Ä‘. Báº¥m Ä‘á»ƒ vÃ o duyá»‡t Ä‘Æ¡n ngay!`;

    console.log('[PWA-Admin-Notify] PhÃ¡t thÃ´ng bÃ¡o PWA Admin:', title, body);

    // PhÃ¡t Ã¢m thanh chuÃ´ng bÃ¡o tinh táº¿ (Web Audio API)
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      }
    } catch (e) {}

    // Rung pháº£n há»“i haptic náº¿u há»— trá»£
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate([200, 100, 200, 100, 200]);
      } catch (e) {}
    }

    if (!('Notification' in window)) {
      console.warn('[PWA-Admin-Notify] KhÃ´ng há»— trá»£ Notification API.');
      return;
    }

    // Náº¿u chÆ°a xin quyá»n, thá»­ xin quyá»n
    if (Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch (e) {}
    }

    if (Notification.permission !== 'granted') {
      console.warn('[PWA-Admin-Notify] Quyá»n thÃ´ng bÃ¡o chÆ°a Ä‘Æ°á»£c cáº¥p.');
      return;
    }

    const options = {
      body: body,
      icon: './icon-192.png',
      badge: './favicon.svg',
      vibrate: [200, 100, 200, 100, 200],
      tag: `order-${cleanCode}`,
      renotify: true,
      requireInteraction: true,
      data: {
        url: './#admin',
        orderCode: orderCode
      }
    };

    // Æ¯u tiÃªn ServiceWorker showNotification (iOS 16.4+ standalone Home Screen & Desktop)
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if (reg && typeof reg.showNotification === 'function') {
          await reg.showNotification(title, options);
          console.log('[PWA-Admin-Notify] ÄÃ£ gá»­i thÃ´ng bÃ¡o qua ServiceWorker showNotification.');
          return;
        }
      }
    } catch (swErr) {
      console.warn('[PWA-Admin-Notify] ServiceWorker showNotification error, fallback:', swErr);
    }

    // Fallback: new Notification()
    try {
      const notif = new Notification(title, options);
      notif.onclick = function (e) {
        e.preventDefault();
        window.focus();
        if (window.location.hash !== '#admin') {
          window.location.hash = '#admin';
        }
        if (window.ShopVietViews && window.ShopVietViews.admin && typeof window.ShopVietViews.admin.switchTab === 'function') {
          window.ShopVietViews.admin.switchTab('orders');
        }
        notif.close();
      };
    } catch (err) {
      console.error('[PWA-Admin-Notify] Notification error:', err);
    }
  };

  // =========================================================================
  // ADMIN CLOUD ORDER WATCHER: Láº®NG NGHE ÄÆ N HÃ€NG Má»šI CHá»œ DUYá»†T Tá»¨C THÃŒ
  // =========================================================================
  (function initAdminCloudOrderWatcher() {
    function getNotifiedList() {
      try {
        const raw = localStorage.getItem('admin_notified_orders');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    function markAsNotified(code) {
      if (!code) return;
      try {
        const clean = String(code).replace(/^#/, '');
        const list = getNotifiedList();
        if (!list.includes(clean)) {
          list.push(clean);
          if (list.length > 500) list.shift();
          localStorage.setItem('admin_notified_orders', JSON.stringify(list));
        }
      } catch (e) {}
    }

    // Náº¡p Ä‘Æ¡n hÃ ng má»›i vÃ o State, kÃ­ch hoáº¡t notification vÃ  cáº­p nháº­t giao diá»‡n Admin náº¿u Ä‘ang má»Ÿ
    function ingestOrderIntoStateAndNotify(ord, changeDocId) {
      if (!ord) return;
      const rawCode = ord.orderCode || ord.memo || ord.paymentMemo || ord.id || changeDocId;
      const cleanCode = rawCode ? String(rawCode).replace(/^#/, '') : '';

      // 1. Tá»± Ä‘á»™ng náº¡p hoáº·c cáº­p nháº­t vÃ o State
      if (window.ShopVietState && window.ShopVietState.state) {
        window.ShopVietState.state.orders = window.ShopVietState.state.orders || [];
        const existingIdx = window.ShopVietState.state.orders.findIndex(function (o) {
          const oCode = String(o.orderCode || o.memo || o.paymentMemo || o.rawCode || o.id || '').replace(/^#/, '');
          return oCode && cleanCode && oCode === cleanCode;
        });

        if (existingIdx > -1) {
          window.ShopVietState.state.orders[existingIdx] = Object.assign({}, window.ShopVietState.state.orders[existingIdx], ord);
        } else {
          window.ShopVietState.state.orders.unshift(ord);
        }

        // Cáº­p nháº­t cáº£ máº£ng root náº¿u cÃ³
        if (Array.isArray(window.ShopVietState.orders)) {
          const rootIdx = window.ShopVietState.orders.findIndex(function (o) {
            const oCode = String(o.orderCode || o.memo || o.paymentMemo || o.rawCode || o.id || '').replace(/^#/, '');
            return oCode && cleanCode && oCode === cleanCode;
          });
          if (rootIdx > -1) {
            window.ShopVietState.orders[rootIdx] = Object.assign({}, window.ShopVietState.orders[rootIdx], ord);
          } else {
            window.ShopVietState.orders.unshift(ord);
          }
        }

        if (typeof window.ShopVietState.save === 'function') {
          window.ShopVietState.save();
        }
      }

      // 2. PhÃ¡t thÃ´ng bÃ¡o iPhone náº¿u chÆ°a thÃ´ng bÃ¡o
      const notifiedList = getNotifiedList();
      if (cleanCode && !notifiedList.includes(cleanCode)) {
        console.log('[AdminWatcher] PhÃ¡t hiá»‡n Ä‘Æ¡n hÃ ng má»›i qua Realtime Watcher:', cleanCode);
        markAsNotified(cleanCode);
        if (typeof window.triggerAdminOrderNotification === 'function') {
          window.triggerAdminOrderNotification(ord);
        }
      }

      // 3. Náº¿u admin Ä‘ang á»Ÿ tab orders thÃ¬ tá»± Ä‘á»™ng re-render báº£ng Ä‘Æ¡n hÃ ng ngay láº­p tá»©c
      const tabContent = document.getElementById('adminTabContent');
      if (tabContent && currentActiveTab === 'orders') {
        tabContent.innerHTML = renderTabOrders();
      }
      const tabBadge = document.getElementById('adminOrderTabBadge');
      if (tabBadge && window.ShopVietState && typeof window.ShopVietState.getOrders === 'function') {
        tabBadge.textContent = window.ShopVietState.getOrders().length;
      }
    }

    function checkPendingReviewOrders() {
      // Cho phÃ©p cháº¡y kiá»ƒm tra thÃ´ng bÃ¡o náº¿u Admin Portal Ä‘ang má»Ÿ hoáº·c session timer Ä‘ang cháº¡y hoáº·c user lÃ  admin
      const currentUser = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user) ||
                          (window.ShopVietState && window.ShopVietState.currentUser);
      const isUserAdmin = Boolean(currentUser && (currentUser.email === 'thaitraicau123@gmail.com' || currentUser.role === 'admin'));
      const isAdminPortalActive = Boolean(
        (window.location.hash && window.location.hash.includes('admin')) ||
        (window.ShopVietViews && window.ShopVietViews.admin && window.ShopVietViews.admin.isOpen) ||
        document.getElementById('adminPortalModal') ||
        (document.getElementById('adminMount') && document.getElementById('adminMount').children.length > 0) ||
        (typeof isAuthenticated === 'function' && isAuthenticated()) ||
        Boolean(sessionIntervalTimer)
      );

      if (!isUserAdmin && !isAdminPortalActive) return;

      // Äá»“ng bá»™ tá»« Cloud Orders Cache náº¿u cÃ³ Ä‘Æ¡n hÃ ng má»›i
      try {
        const rawCloud = localStorage.getItem('shopviet247_cloud_orders_sync');
        if (rawCloud) {
          const cloudOrders = JSON.parse(rawCloud);
          if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
            cloudOrders.forEach(function (cord) {
              if (cord && cord.status === 'pending_review') {
                ingestOrderIntoStateAndNotify(cord, cord.id);
              }
            });
          }
        }
      } catch (e) {}

      const orders = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.orders) || [];
      const notifiedList = getNotifiedList();

      orders.forEach(function (ord) {
        if (ord && (ord.status === 'pending_review')) {
          const rawCode = ord.orderCode || ord.memo || ord.paymentMemo || ord.id;
          const cleanCode = rawCode ? String(rawCode).replace(/^#/, '') : '';
          if (cleanCode && !notifiedList.includes(cleanCode)) {
            console.log('[AdminWatcher] PhÃ¡t hiá»‡n Ä‘Æ¡n hÃ ng má»›i chá» duyá»‡t chÆ°a thÃ´ng bÃ¡o:', cleanCode);
            markAsNotified(cleanCode);
            if (typeof window.triggerAdminOrderNotification === 'function') {
              window.triggerAdminOrderNotification(ord);
            }
          }
        }
      });
    }

    // 1. QuÃ©t Ä‘á»‹nh ká»³ má»—i 2.5 giÃ¢y khi Admin Ä‘ang má»Ÿ app
    setInterval(checkPendingReviewOrders, 2500);

    // 2. Láº¯ng nghe Firestore Realtime onSnapshot náº¿u cÃ³ ShopVietFirebase
    function setupFirestoreOrderListener() {
      try {
        if (window.ShopVietFirebase && window.ShopVietFirebase.db && typeof window.ShopVietFirebase.db.collection === 'function') {
          window.ShopVietFirebase.db.collection('orders').where('status', '==', 'pending_review')
            .onSnapshot(function (snapshot) {
              snapshot.docChanges().forEach(function (change) {
                if (change.type === 'added' || change.type === 'modified') {
                  const ord = change.doc.data();
                  ingestOrderIntoStateAndNotify(ord, change.doc.id);
                }
              });
            }, function (err) {
              console.warn('[AdminWatcher] Firestore snapshot listener:', err.message);
            });
        }
      } catch (e) {
        console.warn('[AdminWatcher] Firestore setup warning:', e);
      }
    }
    setTimeout(setupFirestoreOrderListener, 2000);

    // 3. Láº¯ng nghe Storage Event (khi khÃ¡ch hÃ ng Ä‘áº·t Ä‘Æ¡n trÃªn cÃ¹ng trÃ¬nh duyá»‡t hoáº·c tab khÃ¡c)
    window.addEventListener('storage', function (e) {
      if (e.key === 'shopviet247_cloud_orders_sync' || e.key === 'shopviet_orders' || e.key === 'shopviet247_state_v1') {
        checkPendingReviewOrders();
        const tabContent = document.getElementById('adminTabContent');
        if (tabContent && currentActiveTab === 'orders') {
          tabContent.innerHTML = renderTabOrders();
        }
      }
    });

    // 4. Láº¯ng nghe BroadcastChannel / Custom Event
    window.addEventListener('shopviet_realtime_update', function (e) {
      if (e && e.detail && e.detail.payload) {
        const p = e.detail.payload;
        if (p.order && p.order.status === 'pending_review') {
          ingestOrderIntoStateAndNotify(p.order, p.order.id);
        } else if (p.orderCode && p.status === 'pending_review') {
          checkPendingReviewOrders();
          const tabContent = document.getElementById('adminTabContent');
          if (tabContent && currentActiveTab === 'orders') {
            tabContent.innerHTML = renderTabOrders();
          }
        }
      }
    });

    // 5. Láº¯ng nghe orders_updated trá»±c tiáº¿p
    window.addEventListener('orders_updated', function (e) {
      const order = e && e.detail && (e.detail.order || e.detail);
      if (order && order.status === 'pending_review') {
        ingestOrderIntoStateAndNotify(order, order.id);
      } else {
        checkPendingReviewOrders();
        const tabContent = document.getElementById('adminTabContent');
        if (tabContent && currentActiveTab === 'orders') {
          tabContent.innerHTML = renderTabOrders();
        }
      }
    });
  })();

  // Tá»± Ä‘á»™ng láº¯ng nghe phÃ­m táº¯t toÃ n cá»¥c vÃ  Hash khi file script Ä‘Æ°á»£c náº¡p
  window.addEventListener('keydown', function (e) {
    // Ctrl + Shift + A hoáº·c Cmd + Shift + A -> Má»Ÿ Portal Admin BÃ­ Máº­t
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      window.ShopVietViews.admin.open();
    }
  });

  window.addEventListener('hashchange', function () {
    if (window.location.hash === '#admin') {
      window.ShopVietViews.admin.open();
    }
  });

  // Kiá»ƒm tra ngay khi táº£i trang náº¿u URL cÃ³ hash #admin
  if (window.location.hash === '#admin') {
    window.addEventListener('DOMContentLoaded', function () {
      setTimeout(() => window.ShopVietViews.admin.open(), 200);
    });
  }

})();
