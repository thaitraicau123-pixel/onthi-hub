/**
 * BuiThai AI Studio - User Dashboard View Module
 * Hiện thực hóa Màn hình Quản lý Người dùng chuẩn Clean SaaS UI Enterprise
 * Hỗ trợ các Phân hệ Tương tác:
 * 1. Tổng quan (overview)
 * 2. Đơn hàng (orders)
 * 3. Thẻ quà tặng (giftcards)
 * 4. Giới thiệu bạn bè (referral)
 * 5. Bảo mật & Mật khẩu (security)
 * 6. Hồ sơ cá nhân (profile)
 */

(function () {
  'use strict';

  window.ShopVietViews = window.ShopVietViews || {};

  // Tab đang hoạt động mặc định
  let activeTab = 'overview';
  let activeModalOrder = null;
  let currentOrderFilter = 'all'; // 'all' | 'completed' | 'pending'
  let orderSearchQuery = '';
  let selectedDepositAmount = 200000;

  function escHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Cấu hình ngân hàng MBBank chuẩn theo quy định hệ thống Bùi Thái
  const BANK_CONFIG = {
    bankName: 'MBBank (Ngân hàng TMCP Quân Đội)',
    shortName: 'MBBank',
    accountNumber: '0986019623',
    accountName: 'BUI THAI',
    bin: '970422'
  };
  const TECHCOMBANK_CONFIG = BANK_CONFIG;

  // Dữ liệu đơn hàng mẫu mặc định cho tài khoản Admin Bùi Thái
  const DEFAULT_INITIAL_ORDERS = [
    {
      id: '#DJ20268421',
      productId: 'combo-web-ui-toolkit',
      productName: 'Hộp Công Cụ Prompt Thiết Kế Web Thượng Lưu & UI 60fps (Haute-Couture)',
      date: '28/10/2026',
      price: 89000,
      total: 89000,
      status: 'completed',
      statusText: 'Hoàn tất',
      unlockedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      userEmail: 'thaitraicau123@gmail.com',
      deliveryInfo: {
        account: 'thaitraicau123@gmail.com',
        licenseKey: 'HAUTE-COUTURE-WEB-MASTER-2026',
        note: 'Hộp Công Cụ Master Prompt chuẩn Haute-Couture Web, Song Font Be Vietnam Pro, Apple Liquid Glass và Emil Kowalski Motion 60fps.',
        warranty: 'Bản quyền & Hỗ trợ trọn đời',
        guide: '1. Bấm nút 1-Click Copy Master Prompt\n2. Dán vào Custom Instructions của ChatGPT/Claude/Cursor\n3. Chọn câu lệnh Cheat Sheet để bắt đầu tác chiến.'
      }
    },
    {
      id: '#DJ20266102',
      productId: 'skill-tiktok-hooks',
      productName: 'TikTok & Shorts Viral Hook (4 Công Thức Giữ Chân 3s Đầu)',
      date: '15/10/2026',
      price: 25000,
      total: 25000,
      status: 'completed',
      statusText: 'Hoàn tất',
      unlockedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      userEmail: 'thaitraicau123@gmail.com',
      deliveryInfo: {
        account: 'thaitraicau123@gmail.com',
        licenseKey: 'TIKTOK-HOOK-VIRAL-KIT-2026',
        note: 'Bộ 4 công thức viết kịch bản mở đầu 3 giây tăng tỉ lệ xem hết video.',
        warranty: 'Hỗ trợ trọn đời',
        guide: '1. Mở tài liệu công thức Hook\n2. Điền chủ đề video của bạn vào mẫu\n3. Xuất kịch bản cho CapCut.'
      }
    },
    {
      id: '#DJ20265210',
      productId: 'skill-seo-affiliate',
      productName: 'SEO Review & Affiliate Marketing Prompts (8 Mẫu Viết Bài)',
      date: '10/10/2026',
      price: 79000,
      total: 79000,
      status: 'completed',
      statusText: 'Hoàn tất',
      userEmail: 'thaitraicau123@gmail.com',
      deliveryInfo: {
        account: 'thaitraicau123@gmail.com',
        licenseKey: 'SEO-AFFILIATE-PROMPT-KIT-VIP',
        note: 'Trọn bộ 8 mẫu prompt viết bài review affiliate Shopee, TikTok Shop chuẩn SEO.',
        warranty: 'Hỗ trợ trọn đời',
        guide: '1. Mở file tài liệu đính kèm\n2. Thay đổi thông tin sản phẩm cần review\n3. Copy prompt vào ChatGPT/Claude để sinh bài viết.'
      }
    }
  ];

  /**
   * Lấy User hiện tại từ State (nếu chưa đăng nhập thì trả về Guest)
   */
  function getCurrentUser() {
    if (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user && window.ShopVietState.state.user.isLoggedIn) {
      return window.ShopVietState.state.user;
    }
    return {
      name: 'Khách hàng',
      email: '',
      balance: 0,
      phone: '',
      isLoggedIn: false,
      role: 'Khách',
      avatar: 'K',
      twoFactorEnabled: false
    };
  }

  /**
   * Lấy danh sách đơn hàng được cô lập 100% của chính user hiện tại
   */
  function getUserOrders(user) {
    if (!user || !user.isLoggedIn || !user.email) {
      return [];
    }
    const userEmail = user.email.toLowerCase().trim();

    // Dùng hàm getUserOrders chuẩn của ShopVietState để lọc cô lập 100% theo userEmail
    let allOrders = [];
    if (window.ShopVietState && typeof window.ShopVietState.getUserOrders === 'function') {
      allOrders = window.ShopVietState.getUserOrders(userEmail);
    } else if (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.orders) {
      allOrders = window.ShopVietState.state.orders.filter(function (ord) {
        const ordEmail = (ord.userEmail || (ord.customer && ord.customer.email) || '').trim().toLowerCase();
        return ordEmail === userEmail;
      });
    }

    return allOrders.map(function (ord, idx) {
      const rawCode = ord.orderCode || ord.memo || ord.paymentMemo || ord.id || `DJ2026${idx + 100}`;
      const id = rawCode.startsWith('#') ? rawCode : '#' + rawCode;
      const productName = ord.productName || (ord.product ? ord.product.name : (ord.items && ord.items[0] ? ord.items[0].name : 'Gói dịch vụ AI Pro'));
      const date = ord.createdAtFormatted ? (ord.createdAtFormatted.includes(' ') ? ord.createdAtFormatted.split(' ')[1] : ord.createdAtFormatted) : (ord.date ? (ord.date.includes(' ') ? ord.date.split(' ')[0] : ord.date) : (ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN')));
      const total = ord.amount || ord.total || ord.price || 0;
      const status = ord.status || 'completed';
      const statusText = status === 'pending_review' ? 'Chờ duyệt' : (status === 'pending' || status === 'pending_payment' ? 'Chờ thanh toán' : 'Hoàn tất');
      const isXu = (ord.paymentMethod && ord.paymentMethod.includes('Xu')) || (ord.amount && !ord.price);
      const totalFormatted = isXu ? (total.toLocaleString('vi-VN') + ' Xu') : (total.toLocaleString('vi-VN') + 'đ');
      const deliveryInfo = ord.deliveryInfo || {
        account: ord.userEmail || user.email,
        licenseKey: ord.licenseKey || `KEY-${id.replace('#', '')}-AI-PRO-2026`,
        note: ord.deliveryType || 'Kích hoạt tự động qua email hoặc link mời bản quyền.',
        warranty: 'Bảo hành 1 đổi 1 suốt thời gian sử dụng',
        guide: 'Đăng nhập vào dịch vụ chính thức và bắt đầu sử dụng. Cần trợ giúp vui lòng liên hệ CSKH 24/7.'
      };

      // Tính toán thời hạn 1 ngày (24 giờ) kể từ khi mở khóa
      let unlockTime = null;
      if (ord.unlockedAt) {
        unlockTime = new Date(ord.unlockedAt).getTime();
      } else if (ord.paidAt) {
        unlockTime = new Date(ord.paidAt).getTime();
      } else if (ord.approvedAt) {
        unlockTime = new Date(ord.approvedAt).getTime();
      } else if (status === 'completed') {
        unlockTime = ord.createdAt ? new Date(ord.createdAt).getTime() : Date.now();
      }

      const oneDayMs = 24 * 60 * 60 * 1000;
      const isCompleted = status === 'completed';
      const remainingMs = unlockTime ? (unlockTime + oneDayMs - Date.now()) : 0;
      const isExpired = false;

      let remainingHours = 0;
      let remainingMinutes = 0;
      if (isCompleted && !isExpired && remainingMs > 0) {
        remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
        remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      }

      return {
        id: id,
        productId: ord.productId || 'prod-ai',
        productName: productName,
        date: date,
        total: total,
        totalFormatted: totalFormatted,
        status: status,
        statusText: statusText,
        userEmail: ord.userEmail || user.email,
        unlockedAt: ord.unlockedAt || (isCompleted ? new Date(unlockTime || Date.now()).toISOString() : null),
        expiresAt: null,
        isExpired: isExpired,
        remainingHours: remainingHours,
        remainingMinutes: remainingMinutes,
        remainingMs: remainingMs,
        deliveryInfo: deliveryInfo,
        customDeliveryLink: ord.customDeliveryLink || (ord.deliveryInfo && ord.deliveryInfo.customDeliveryLink) || '',
        adminMessage: ord.adminMessage || (ord.deliveryInfo && ord.deliveryInfo.adminMessage) || '',
        licenseKey: ord.licenseKey || (ord.deliveryInfo && ord.deliveryInfo.licenseKey) || ''
      };
    });
  }

  /**
   * Quản lý Lịch sử biến động số dư Ví trong LocalStorage theo tài khoản độc lập
   */
  function getWalletTransactions(userEmail) {
    if (!userEmail) return [];
    const cleanEmail = userEmail.trim().toLowerCase();
    const key = 'shopviet247_wallet_tx_' + cleanEmail;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Lỗi đọc lịch sử ví:', e);
    }

    return [];
  }

  /**
   * Quản lý Giftcodes đã sử dụng của User
   */
  function getUsedGiftcodes(userEmail) {
    const key = 'shopviet247_used_giftcodes_' + (userEmail || 'default');
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function addUsedGiftcode(userEmail, code, amount) {
    const key = 'shopviet247_used_giftcodes_' + (userEmail || 'default');
    let list = getUsedGiftcodes(userEmail);
    list.push({
      code: code,
      amount: amount,
      usedAt: new Date().toLocaleString('vi-VN')
    });
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {}
  }

  /**
   * Tạo Fallback SVG mã QR MBBank Napas 24/7
   */
  function getFallbackQrSvg(amount, memo) {
    return `
      <svg class="w-48 h-48 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" rx="16" fill="white"/>
        <!-- Corner Finder Patterns -->
        <rect x="15" y="15" width="46" height="46" rx="8" fill="#004b91"/>
        <rect x="23" y="23" width="30" height="30" rx="4" fill="white"/>
        <rect x="29" y="29" width="18" height="18" rx="2" fill="#004b91"/>

        <rect x="139" y="15" width="46" height="46" rx="8" fill="#004b91"/>
        <rect x="147" y="23" width="30" height="30" rx="4" fill="white"/>
        <rect x="153" y="29" width="18" height="18" rx="2" fill="#004b91"/>

        <rect x="15" y="139" width="46" height="46" rx="8" fill="#004b91"/>
        <rect x="23" y="147" width="30" height="30" rx="4" fill="white"/>
        <rect x="29" y="153" width="18" height="18" rx="2" fill="#004b91"/>

        <!-- QR Data Blocks -->
        <rect x="75" y="20" width="12" height="12" rx="2" fill="#1e293b"/>
        <rect x="95" y="20" width="12" height="12" rx="2" fill="#1e293b"/>
        <rect x="115" y="20" width="12" height="12" rx="2" fill="#1e293b"/>
        <rect x="75" y="40" width="20" height="10" rx="2" fill="#1e293b"/>
        <rect x="105" y="40" width="15" height="10" rx="2" fill="#1e293b"/>
        
        <rect x="20" y="75" width="15" height="12" rx="2" fill="#1e293b"/>
        <rect x="45" y="75" width="12" height="20" rx="2" fill="#1e293b"/>
        <rect x="145" y="75" width="18" height="12" rx="2" fill="#1e293b"/>
        <rect x="170" y="75" width="12" height="20" rx="2" fill="#1e293b"/>

        <rect x="75" y="145" width="20" height="12" rx="2" fill="#1e293b"/>
        <rect x="105" y="145" width="15" height="12" rx="2" fill="#1e293b"/>
        <rect x="135" y="145" width="25" height="12" rx="2" fill="#1e293b"/>
        <rect x="170" y="145" width="12" height="12" rx="2" fill="#1e293b"/>
        <rect x="75" y="165" width="35" height="15" rx="2" fill="#1e293b"/>
        <rect x="120" y="165" width="25" height="15" rx="2" fill="#1e293b"/>
        <rect x="155" y="165" width="25" height="15" rx="2" fill="#1e293b"/>

        <!-- MBBank Napas Badge in Center -->
        <rect x="62" y="78" width="76" height="44" rx="8" fill="#0071E3" stroke="white" stroke-width="2"/>
        <text x="100" y="96" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="white" text-anchor="middle" letter-spacing="0.5">MBBANK</text>
        <text x="100" y="112" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#bae6fd" text-anchor="middle">VIETQR 24/7</text>
      </svg>
    `;
  }

  const dashboardView = {
    /**
     * Render HTML giao diện Dashboard 2 cột hoàn chỉnh
     */
    render: function (params) {
      if (params && params.tab) {
        activeTab = params.tab === 'wallet' ? 'orders' : params.tab;
      } else if (activeTab === 'wallet') {
        activeTab = 'orders';
      }

      const user = getCurrentUser();
      if (user && user.isLoggedIn && user.email) {
        if (window.ShopVietState && typeof window.ShopVietState.syncOrdersFromCloud === 'function') {
          window.ShopVietState.syncOrdersFromCloud(user.email).catch(function () {});
          window.ShopVietState.syncLocalOrdersToCloud(user.email).catch(function () {});
        }
      }
      const userOrders = getUserOrders(user);
      const orderCount = userOrders.length;
      const userBalanceFormatted = (user.balance || 0).toLocaleString('vi-VN') + 'đ';

      return `
        <div class="py-4 sm:py-6 animate-fade-in font-sans">
          
          <!-- Bố cục Màn hình Dashboard 2 cột: Sidebar (3-4 cols) & Nội dung (8-9 cols) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            <!-- ================= a. SIDEBAR BÊN TRÁI ================= -->
            <aside class="lg:col-span-4 xl:col-span-3 space-y-4">
              
              <div class="bg-white dark:bg-[#111520] rounded-xl p-5 border border-slate-900/10 dark:border-white/10 shadow-2xs flex flex-col items-center text-center">
                <div id="sidebarUserAvatar" class="w-14 h-14 rounded-full bg-[#0071E3] text-white font-black flex items-center justify-center text-xl shadow-xs select-none border-2 border-white dark:border-slate-800">
                  ${(user.avatar && user.avatar.length <= 2) ? user.avatar.toUpperCase() : ((user.name || 'C').trim().charAt(0).toUpperCase())}
                </div>
                <h2 id="sidebarUserName" class="text-base font-bold text-slate-900 dark:text-white mt-2.5 truncate max-w-[200px]">
                  ${user.name || 'Bùi Thái'}
                </h2>
                <p id="sidebarUserEmail" class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 break-all">
                  ${user.email || 'thaitraicau123@gmail.com'}
                </p>
                <p class="mt-2 text-xs font-semibold text-[#0071E3] dark:text-[#3B9EFF]">
                  ${user.role || 'Thành viên VIP'}
                </p>
              </div>

              <nav class="bg-white dark:bg-[#111520] rounded-xl p-2.5 border border-slate-900/10 dark:border-white/10 shadow-2xs space-y-1 text-sm font-medium">
                <button type="button" data-tab="overview" id="tabBtn-overview" class="dashboard-tab-btn w-full ${activeTab === 'overview' ? 'bg-blue-50/90 dark:bg-slate-800 text-[#0071E3] dark:text-[#3B9EFF] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'} rounded-xl px-4 py-2.5 flex items-center justify-between transition-all text-left cursor-pointer">
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <rect width="7" height="9" x="3" y="3" rx="1" />
                      <rect width="7" height="5" x="14" y="3" rx="1" />
                      <rect width="7" height="9" x="14" y="12" rx="1" />
                      <rect width="7" height="5" x="3" y="16" rx="1" />
                    </svg>
                    <span>Tổng quan</span>
                  </div>
                </button>

                <button type="button" data-tab="orders" id="tabBtn-orders" class="dashboard-tab-btn w-full ${activeTab === 'orders' ? 'bg-blue-50/90 dark:bg-slate-800 text-[#0071E3] dark:text-[#3B9EFF] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'} rounded-xl px-4 py-2.5 flex items-center justify-between transition-all text-left cursor-pointer">
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <span>Đơn hàng</span>
                  </div>
                  <span id="sidebarOrderBadge" class="text-xs font-mono font-bold tabular-nums text-slate-500 dark:text-slate-400">
                    ${orderCount}
                  </span>
                </button>

                <button type="button" data-tab="seller" id="tabBtn-seller" class="dashboard-tab-btn w-full ${activeTab === 'seller' ? 'bg-blue-50/90 dark:bg-slate-800 text-[#0071E3] dark:text-[#3B9EFF] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'} rounded-xl px-4 py-2.5 flex items-center justify-between transition-all text-left cursor-pointer">
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path d="M3 9l2-5h14l2 5" />
                      <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
                      <path d="M9 21V13h6v8" />
                    </svg>
                    <span>Kênh Người Bán &amp; Rút Xu</span>
                  </div>
                </button>

                <button type="button" data-tab="referral" id="tabBtn-referral" class="dashboard-tab-btn w-full ${activeTab === 'referral' ? 'bg-blue-50/90 dark:bg-slate-800 text-[#0071E3] dark:text-[#3B9EFF] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'} rounded-xl px-4 py-2.5 flex items-center justify-between transition-all text-left cursor-pointer">
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>Cộng Tác Viên (25%)</span>
                  </div>
                </button>

                <button type="button" data-tab="security" id="tabBtn-security" class="dashboard-tab-btn w-full ${activeTab === 'security' ? 'bg-blue-50/90 dark:bg-slate-800 text-[#0071E3] dark:text-[#3B9EFF] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'} rounded-xl px-4 py-2.5 flex items-center justify-between transition-all text-left cursor-pointer">
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Bảo mật & Mật khẩu</span>
                  </div>
                </button>

                <button type="button" data-tab="profile" id="tabBtn-profile" class="dashboard-tab-btn w-full ${activeTab === 'profile' ? 'bg-blue-50/90 dark:bg-slate-800 text-[#0071E3] dark:text-[#3B9EFF] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'} rounded-xl px-4 py-2.5 flex items-center justify-between transition-all text-left cursor-pointer">
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    <span>Hồ sơ cá nhân</span>
                  </div>
                </button>

                <!-- "Đăng xuất" an toàn -->
                <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" id="logoutBtn" class="w-full text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl px-4 py-2.5 flex items-center gap-3 transition-colors text-left cursor-pointer font-semibold">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                    <span>Đăng xuất</span>
                  </button>
                </div>

              </nav>

            </aside>

            <!-- ================= b. KHU VỰC NỘI DUNG CHÍNH (8-9 COLS) ================= -->
            <main id="dashboardMainArea" class="lg:col-span-8 xl:col-span-9 space-y-6">
              ${dashboardView.renderTabContent(activeTab, user, userOrders)}
            </main>

          </div>

          <!-- ================= MODAL XEM CHI TIẾT ĐƠN HÀNG & LICENSE KEY ================= -->
          <div id="orderDetailModal" class="hidden fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4">
            <div class="bg-white dark:bg-[#111520] border border-slate-900/10 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-slide-up relative">
              
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs font-mono font-bold text-[#0071E3] dark:text-[#3B9EFF] tabular-nums" id="modalOrderId">#DJ20268421</span>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-0.5" id="modalOrderProduct">
                    ChatGPT Plus 1 Tháng
                  </h3>
                </div>
                <button type="button" id="closeDetailModalBtn" aria-label="Đóng chi tiết đơn hàng" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <!-- Hộp Bàn Giao Tài Khoản & Key Kích Hoạt -->
              <div class="space-y-3 bg-slate-50/80 dark:bg-[#090B10]/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Thông tin bàn giao bản quyền</span>
                  <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Bảo hành 1 đổi 1
                  </span>
                </div>

                <!-- Khối thông báo khi đơn đang chờ duyệt giao dịch -->
                <div id="modalOrderWaitingNotice" class="hidden p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 text-slate-800 dark:text-slate-200 text-xs font-medium space-y-1">
                  <div class="flex items-center gap-2 font-bold text-[#0071E3] dark:text-[#3B9EFF]">
                    <svg class="w-4 h-4 animate-spin text-[#0071E3] dark:text-[#3B9EFF] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-linecap="round"></circle>
                      <polyline points="12 6 12 12 14 14"></polyline>
                    </svg>
                    <span>Đang chờ Admin phê duyệt giao dịch</span>
                  </div>
                  <p class="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 pl-6">
                    Đơn hàng của bạn đang được Ban quản trị đối soát giao dịch MBBank và chuẩn bị bàn giao đường link bản quyền riêng. Vui lòng quay lại sau ít phút.
                  </p>
                </div>

                <!-- Tài khoản / Email -->
                <div>
                  <span class="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Tài khoản / Email bàn giao:</span>
                  <div class="flex items-center justify-between gap-2 mt-1">
                    <code id="modalOrderAccount" class="text-xs font-mono font-bold text-slate-900 dark:text-white select-all bg-white dark:bg-[#0B0F17] px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 flex-1 truncate">
                      cuong.account@chatgpt.vip
                    </code>
                    <button type="button" id="copyAccountBtn" class="px-3 py-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold shrink-0 cursor-pointer transition-colors">
                      Sao chép
                    </button>
                  </div>
                </div>

                <!-- Password / Key / Đường link -->
                <div>
                  <span class="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Đường link / Key kích hoạt bàn giao riêng:</span>
                  <div class="flex items-center justify-between gap-2 mt-1">
                    <code id="modalOrderKey" class="text-xs font-mono font-bold text-[#0071E3] dark:text-[#3B9EFF] select-all bg-white dark:bg-[#0B0F17] px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 flex-1 truncate">
                      p***_OpenAI_SecuredKey_8942
                    </code>
                    <a id="openOrderLinkBtn" href="#" target="_blank" rel="noopener noreferrer" class="hidden px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 transition shadow-sm items-center gap-1 inline-flex">
                      <span>Mở link ↗</span>
                    </a>
                    <button type="button" id="copyKeyBtn" class="px-3 py-1.5 rounded-lg bg-[#0071E3] text-white hover:bg-[#0062C8] dark:bg-[#3B9EFF] dark:hover:bg-[#2B8EF0] text-xs font-semibold shrink-0 cursor-pointer shadow-sm transition-colors">
                      Sao chép Key
                    </button>
                  </div>
                </div>
              </div>

              <!-- Hướng dẫn sử dụng 1 đổi 1 -->
              <div class="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pt-1">
                <div class="font-bold text-slate-800 dark:text-slate-200">Hướng dẫn sử dụng & Bảo hành:</div>
                <div id="modalOrderGuide" class="bg-slate-50/80 dark:bg-[#090B10]/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 text-xs whitespace-pre-line leading-relaxed">
                  Đăng nhập chính thức tại trang chủ dịch vụ. Sản phẩm được bảo hành 1 đổi 1 trong suốt thời gian kích hoạt.
                </div>
              </div>

              <!-- Nút hỗ trợ & Đóng -->
              <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-800/80">
                <button type="button" id="closeDetailModalBtn2" class="px-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  Đóng
                </button>
                <button type="button" onclick="ShopVietState.showToast('CSKH Zalo / Hotline 0986.019.623 sẵn sàng hỗ trợ 24/7', 'info')" class="px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0062C8] dark:bg-[#3B9EFF] dark:hover:bg-[#2B8EF0] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors">
                  <span>Hỗ trợ kỹ thuật 24/7</span>
                </button>
              </div>

            </div>
          </div>

          <!-- ================= MODAL NẠP TIỀN VIETQR MBBANK ================= -->
          <div id="vietQrModal" class="hidden fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4">
            <div class="bg-white dark:bg-[#111520] border border-slate-900/10 dark:border-white/10 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-slide-up relative">
              
              <div class="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-slate-800/80">
                <div>
                  <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Nạp tiền VietQR MBBank</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Tự động 5s</span>
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quét mã bằng app MBBank hoặc bất kỳ ứng dụng ngân hàng nào</p>
                </div>
                <button type="button" id="closeVietQrModalBtn" aria-label="Đóng cửa sổ nạp VietQR" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <!-- VietQR MBBank Visual Box -->
              <div class="flex flex-col items-center bg-slate-50/80 dark:bg-[#090B10]/85 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-center">
                
                <div id="techcombankQrContainer" class="p-2.5 bg-white rounded-xl shadow-md border border-slate-200/80 mb-3">
                  <img id="techcombankQrImg" src="https://img.vietqr.io/image/970422-0986019623-compact2.png?amount=${selectedDepositAmount}&addInfo=NAPXU%20${encodeURIComponent(user.name ? user.name.replace(/\s+/g, '').toUpperCase() : 'BT2026')}&accountName=BUI%20THAI" alt="VietQR MBBank 0986019623" class="w-48 h-48 object-contain rounded-lg" onerror="this.outerHTML=ShopVietViews.dashboard.getQrFallbackHtml()">
                </div>

                <!-- Bảng thông tin thanh toán MBBank -->
                <div class="w-full space-y-2 text-xs text-left bg-white/90 dark:bg-[#0B0F17]/90 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                  <div class="flex justify-between items-center">
                    <span class="text-slate-500 dark:text-slate-400">Ngân hàng:</span>
                    <strong class="text-slate-900 dark:text-white font-semibold">MBBank (BIN: 970422)</strong>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-500 dark:text-slate-400">Số tài khoản:</span>
                    <div class="flex items-center gap-1.5">
                      <strong class="font-mono text-[#0071E3] dark:text-[#3B9EFF] font-extrabold text-sm select-all tabular-nums">0986019623</strong>
                      <button type="button" onclick="navigator.clipboard.writeText('0986019623'); ShopVietState.showToast('Đã sao chép STK MBBank: 0986019623', 'success')" class="text-[#0071E3] dark:text-[#3B9EFF] text-[11px] hover:underline font-bold cursor-pointer">Copy</button>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-500 dark:text-slate-400">Chủ tài khoản:</span>
                    <strong class="text-slate-900 dark:text-white font-bold uppercase">BUI THAI</strong>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-500 dark:text-slate-400">Nội dung CK:</span>
                    <div class="flex items-center gap-1.5">
                      <strong id="depositMemoText" class="font-mono text-[#0071E3] dark:text-[#3B9EFF] bg-blue-500/10 px-2 py-0.5 rounded font-bold">NAPXU ${user.name ? user.name.replace(/\s+/g, '').toUpperCase() : 'BT2026'}</strong>
                      <button type="button" onclick="ShopVietViews.dashboard.copyDepositMemo()" class="text-[#0071E3] dark:text-[#3B9EFF] text-[11px] hover:underline font-bold cursor-pointer">Copy</button>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Thông báo lịch duyệt Thứ 3, Thứ 5, Thứ 6 -->
              <div class="p-3.5 rounded-xl bg-blue-500/8 border border-blue-500/20 text-slate-700 dark:text-slate-300 text-xs flex items-start gap-2.5 my-2">
                <svg class="w-4 h-4 text-[#0071E3] dark:text-[#3B9EFF] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <div class="leading-relaxed">
                  <span class="font-bold text-slate-900 dark:text-white">Lưu ý lịch duyệt tiền xu:</span>
                  Vào <strong>Thứ 3, Thứ 5 và Thứ 6</strong>, do Admin Bùi Thái vướng lịch học & công tác nên có thể duyệt muộn hơn bình thường một chút. Các ngày còn lại duyệt siêu tốc trong 3-5 phút. Mọi giao dịch chuyển khoản đều được bảo đảm khớp lệnh 100%.
                </div>
              </div>

              <!-- Các nút nạp nhanh 9k, 18k, 45k, 99k -->
              <div class="space-y-1.5">
                <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Chọn nhanh số tiền nạp:</span>
                <div class="grid grid-cols-4 gap-2 tabular-nums">
                  <button type="button" data-amount="9000" class="deposit-amount-btn py-2 text-xs font-bold rounded-xl border-2 border-[#0071E3] dark:border-[#3B9EFF] bg-blue-50/80 dark:bg-blue-950/50 text-[#0071E3] dark:text-[#3B9EFF] transition-all cursor-pointer">9.000đ</button>
                  <button type="button" data-amount="18000" class="deposit-amount-btn py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-blue-50/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all cursor-pointer">18.000đ</button>
                  <button type="button" data-amount="45000" class="deposit-amount-btn py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-blue-50/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all cursor-pointer">45.000đ</button>
                  <button type="button" data-amount="99000" class="deposit-amount-btn py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-blue-50/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all cursor-pointer">99.000đ</button>
                </div>
              </div>

              <!-- Nút xác nhận nạp tiền tự động -->
              <div class="pt-2">
                <button type="button" id="confirmDepositBtn" class="w-full py-3 rounded-xl bg-[#0071E3] hover:bg-[#0062C8] dark:bg-[#3B9EFF] dark:hover:bg-[#2B8EF0] text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Tôi đã chuyển khoản thành công</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      `;
    },

    /**
     * Render Nội dung tương ứng cho từng Tab
     */
    renderTabContent: function (tabKey, user, orders) {
      user = user || getCurrentUser();
      orders = orders || getUserOrders(user);

      switch (tabKey) {
        case 'wallet':
        case 'orders':
          return this.renderOrdersTab(user, orders);
        case 'seller':
          return this.renderSellerTab(user);
        case 'referral':
          return this.renderReferralTab(user);
        case 'giftcards':
          return this.renderOverviewTab(user, orders);
        case 'security':
          return this.renderSecurityTab(user);
        case 'profile':
          return this.renderProfileTab(user);
        case 'overview':
        default:
          return this.renderOverviewTab(user, orders);
      }
    },

    // ==========================================
    // TAB 1: TỔNG QUAN (OVERVIEW)
    // ==========================================
    renderOverviewTab: function (user, orders) {
      const orderCount = orders.length;
      const pendingCount = orders.filter(o => o.status === 'pending').length;
      const recentOrders = orders.slice(0, 5);

      return `
        <!-- Header: Tiêu đề lớn & nút thao tác nhanh -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Tổng quan tài khoản
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Tài khoản <span class="font-semibold text-slate-800 dark:text-slate-200">${user.name || 'Bùi Thái'}</span> · Quản lý đơn hàng và mã kích hoạt tự động.
            </p>
          </div>

          <!-- Nút thao tác nhanh: "Mua tiếp" -->
          <div class="flex items-center gap-2.5 shrink-0">
            <button type="button" id="overviewBuyMoreBtn" class="bg-[#0071E3] hover:bg-[#0062C8] dark:bg-[#3B9EFF] dark:hover:bg-[#2B8EF0] text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Mua tiếp</span>
            </button>
          </div>
        </div>

        <!-- 3 Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <!-- Thẻ 1: Trạng thái tài khoản -->
          <div class="bg-white dark:bg-[#111520] rounded-xl p-5 border border-slate-900/10 dark:border-white/10 shadow-2xs relative overflow-hidden group hover:border-emerald-300/80 dark:hover:border-emerald-700/70 transition-all">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Trạng thái tài khoản
              </span>
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
            </div>
            <div class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              <span>Thành viên chính thức</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Đã kích hoạt bảo mật & bảo hành 1 đổi 1
            </p>
          </div>

          <!-- Thẻ 2: Đơn hàng đã mua -->
          <div class="bg-white dark:bg-[#111520] rounded-xl p-5 border border-slate-900/10 dark:border-white/10 shadow-2xs relative overflow-hidden group hover:border-[#0071E3]/50 dark:hover:border-[#3B9EFF]/50 transition-all">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Đơn hàng đã mua
              </span>
              <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0071E3] dark:text-[#3B9EFF] flex items-center justify-center">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1="12" x2="12" y1="22" y2="12" />
                </svg>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tabular-nums">
              ${orderCount}
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 truncate">
              Đơn hàng của tài khoản ${user.email || ''}
            </p>
          </div>

          <!-- Thẻ 3: Đang chờ thanh toán -->
          <div class="bg-white dark:bg-[#111520] rounded-xl p-5 border border-slate-900/10 dark:border-white/10 shadow-2xs relative overflow-hidden group hover:border-[#0071E3]/50 dark:hover:border-[#3B9EFF]/50 transition-all">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Đang chờ thanh toán
              </span>
              <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0071E3] dark:text-[#3B9EFF] flex items-center justify-center">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tabular-nums">
              ${pendingCount}
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              ${pendingCount > 0 ? 'Vui lòng hoàn tất trước khi hết hạn' : 'Không có đơn nào chờ thanh toán'}
            </p>
          </div>

        </div>

        <!-- Bảng Đơn hàng gần đây -->
        <div class="bg-white dark:bg-[#111520] rounded-xl border border-slate-900/10 dark:border-white/10 shadow-2xs overflow-hidden">
          
          <div class="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Lịch sử đơn hàng gần nhất</span>
              <span class="text-xs font-normal text-slate-400 tabular-nums">(${recentOrders.length} đơn)</span>
            </h3>
            <button type="button" id="overviewViewAllOrdersLink" class="text-xs font-semibold text-[#0071E3] dark:text-[#3B9EFF] hover:underline flex items-center gap-1 cursor-pointer">
              <span>Xem tất cả đơn hàng</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="bg-slate-50/80 dark:bg-[#090B10]/70 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800/80">
                <tr>
                  <th scope="col" class="py-3 px-4 sm:px-5">MÃ ĐƠN HÀNG</th>
                  <th scope="col" class="py-3 px-4">SẢN PHẨM</th>
                  <th scope="col" class="py-3 px-4">NGÀY ĐẶT</th>
                  <th scope="col" class="py-3 px-4">TỔNG TIỀN</th>
                  <th scope="col" class="py-3 px-4">TRẠNG THÁI</th>
                  <th scope="col" class="py-3 px-4 sm:px-5 text-right">THAO TÁC</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                ${recentOrders.length === 0 ? `
                  <tr>
                    <td colspan="6" class="py-12 text-center text-slate-400">
                      <div class="flex flex-col items-center justify-center space-y-2">
                        <svg class="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                          <path d="M3 6h18" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        <p class="text-xs font-semibold text-slate-600 dark:text-slate-400">Tài khoản này chưa có đơn hàng nào</p>
                        <button type="button" onclick="window.ShopVietState.navigate('home', { scrollTo: '#productsSection' })" class="text-xs font-bold text-[#0071E3] dark:text-[#3B9EFF] hover:underline cursor-pointer">
                          Khám phá sản phẩm ngay →
                        </button>
                      </div>
                    </td>
                  </tr>
                ` : recentOrders.map(function (order) {
                  return `
                    <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td class="py-3.5 px-4 sm:px-5 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap tabular-nums">
                        ${order.id}
                      </td>
                      <td class="py-3.5 px-4 max-w-[240px]">
                        <div class="font-semibold text-slate-900 dark:text-white truncate" title="${order.productName}">
                          ${order.productName}
                        </div>
                        <div class="text-[11px] text-slate-400 truncate">
                          ${order.deliveryInfo && order.deliveryInfo.account ? 'Bàn giao: ' + order.deliveryInfo.account : 'Kích hoạt tự động'}
                        </div>
                      </td>
                      <td class="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap tabular-nums">
                        ${order.date}
                      </td>
                      <td class="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap tabular-nums">
                        ${order.totalFormatted}
                      </td>
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        ${order.status === 'pending_review' ? `
                          <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <svg class="w-3.5 h-3.5 animate-[spin_3s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" stroke-width="2" stroke-dasharray="4 2"/>
                              <polyline points="12 6 12 12 15 14" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <span>Chờ duyệt</span>
                          </span>
                        ` : (order.status === 'pending' || order.status === 'pending_payment') ? `
                          <span class="text-xs font-semibold text-[#0071E3] dark:text-[#3B9EFF]">
                            Chờ thanh toán
                          </span>
                        ` : `
                          <span class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400"><svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Hoàn tất</span></span>
                        `}
                      </td>
                      <td class="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                        <button type="button" data-order-id="${order.id}" class="view-order-detail-btn inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0071E3] dark:hover:text-[#3B9EFF] bg-slate-100/90 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                          <span>Xem chi tiết</span>
                          <span>→</span>
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

        </div>
      `;
    },

    // ==========================================
    // TAB 2: ĐƠN HÀNG (ORDERS)
    // ==========================================
    renderOrdersTab: function (user, orders) {
      let filteredOrders = orders;
      if (currentOrderFilter === 'completed') {
        filteredOrders = filteredOrders.filter(o => o.status === 'completed');
      } else if (currentOrderFilter === 'pending') {
        filteredOrders = filteredOrders.filter(o => o.status === 'pending' || o.status === 'pending_review');
      }

      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        filteredOrders = filteredOrders.filter(o => 
          o.id.toLowerCase().includes(q) || 
          o.productName.toLowerCase().includes(q) ||
          (o.deliveryInfo && o.deliveryInfo.account && o.deliveryInfo.account.toLowerCase().includes(q))
        );
      }

      const totalCount = orders.length;
      const completedCount = orders.filter(o => o.status === 'completed').length;
      const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'pending_review').length;

      return `
        <!-- Header Quản lý đơn hàng -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Quản lý Đơn hàng
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Xem toàn bộ các đơn hàng đã đặt, nhận License key bản quyền và bảo hành 1 đổi 1.
            </p>
          </div>

          <button type="button" onclick="window.ShopVietState.navigate('home', { scrollTo: '#productsSection' })" class="bg-[#0071E3] hover:bg-[#0062C8] dark:bg-[#3B9EFF] dark:hover:bg-[#2B8EF0] text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer self-start sm:self-auto">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Đặt mua thêm</span>
          </button>
        </div>

        <!-- Thanh công cụ: Bộ lọc trạng thái & Ô Tìm kiếm -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <!-- Bộ lọc 3 trạng thái -->
          <div class="inline-flex p-1 rounded-xl bg-slate-100/90 dark:bg-[#090B10] border border-slate-200/70 dark:border-slate-800/80 text-xs font-semibold tabular-nums">
            <button type="button" data-order-filter="all" class="order-filter-btn px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentOrderFilter === 'all' ? 'bg-white dark:bg-[#0B0F17] text-[#0071E3] dark:text-[#3B9EFF] shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
              Tất cả (${totalCount})
            </button>
            <button type="button" data-order-filter="completed" class="order-filter-btn px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentOrderFilter === 'completed' ? 'bg-white dark:bg-[#0B0F17] text-[#0071E3] dark:text-[#3B9EFF] shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
              Hoàn tất (${completedCount})
            </button>
            <button type="button" data-order-filter="pending" class="order-filter-btn px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentOrderFilter === 'pending' ? 'bg-white dark:bg-[#0B0F17] text-[#0071E3] dark:text-[#3B9EFF] shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
              Chờ thanh toán (${pendingCount})
            </button>
          </div>

          <!-- Ô tìm kiếm đơn hàng -->
          <div class="relative w-full sm:w-64">
            <input type="text" id="orderSearchInput" value="${orderSearchQuery}" placeholder="Tìm mã đơn, tên sản phẩm..." class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-[#0B0F17]/90 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0071E3] dark:focus:ring-[#3B9EFF]">
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

        </div>

        <!-- Bảng danh sách đơn hàng chi tiết -->
        <div class="bg-white dark:bg-[#111520] rounded-xl border border-slate-900/10 dark:border-white/10 shadow-2xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="bg-slate-50/80 dark:bg-[#090B10]/70 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800/80">
                <tr>
                  <th scope="col" class="py-3 px-4 sm:px-5">MÃ ĐƠN HÀNG</th>
                  <th scope="col" class="py-3 px-4">SẢN PHẨM & TÀI KHOẢN</th>
                  <th scope="col" class="py-3 px-4">NGÀY ĐẶT</th>
                  <th scope="col" class="py-3 px-4">TỔNG TIỀN</th>
                  <th scope="col" class="py-3 px-4">TRẠNG THÁI</th>
                  <th scope="col" class="py-3 px-4 sm:px-5 text-right">THAO TÁC</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                ${filteredOrders.length === 0 ? `
                  <tr>
                    <td colspan="6" class="py-12 text-center text-slate-400">
                      <div class="flex flex-col items-center justify-center space-y-2">
                        <svg class="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                          <path d="M3 6h18" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        <p class="text-sm">Không tìm thấy đơn hàng nào phù hợp</p>
                      </div>
                    </td>
                  </tr>
                ` : filteredOrders.map(function (order) {
                  return `
                    <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td class="py-3.5 px-4 sm:px-5 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap tabular-nums">
                        ${order.id}
                      </td>
                      <td class="py-3.5 px-4 max-w-[280px]">
                        <div class="font-semibold text-slate-900 dark:text-white truncate" title="${order.productName}">
                          ${order.productName}
                        </div>
                        <div class="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 truncate">
                          <span class="truncate">${order.deliveryInfo && order.deliveryInfo.account ? order.deliveryInfo.account : order.userEmail}</span>
                          ${order.status === 'completed' ? `<span class="shrink-0 font-mono text-[10px] text-[#0071E3] dark:text-[#3B9EFF]">· v1.0.4</span>` : ''}
                        </div>
                      </td>
                      <td class="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap tabular-nums">
                        ${order.date}
                      </td>
                      <td class="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap tabular-nums">
                        ${order.totalFormatted}
                      </td>
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        ${order.status === 'pending_review' ? `
                          <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <svg class="w-3.5 h-3.5 animate-[spin_3s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" stroke-width="2" stroke-dasharray="4 2"/>
                              <polyline points="12 6 12 12 15 14" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <span>Chờ duyệt</span>
                          </span>
                        ` : (order.status === 'pending' || order.status === 'pending_payment') ? `
                          <span class="text-xs font-semibold text-[#0071E3] dark:text-[#3B9EFF]">
                            Chờ thanh toán
                          </span>
                        ` : `
                          <span class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400"><svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Mở khóa vĩnh viễn</span></span>
                        `}
                      </td>
                      <td class="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                        <div class="inline-flex items-center justify-end gap-1.5">
                          ${(() => {
                            if (order.status !== 'completed' || order.isExpired) return '';
                            const prodObj = (window.ShopVietData && typeof window.ShopVietData.getProductById === 'function')
                              ? window.ShopVietData.getProductById(order.productId)
                              : null;
                            const dlUrl = (prodObj && prodObj.downloadUrl) || (order.unlockedPayload && order.unlockedPayload.downloadUrl) || '';
                            const dlName = (prodObj && prodObj.zipFileName) || (order.unlockedPayload && order.unlockedPayload.zipFileName) || '';
                            if (!dlUrl) return '';
                            return `<button type="button" onclick="ShopVietViews.modal && ShopVietViews.modal.downloadProtectedAsset && ShopVietViews.modal.downloadProtectedAsset('${dlUrl}', '${dlName}', '${order.productId || ''}')" class="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 px-2.5 py-1.5 rounded-lg transition cursor-pointer"><svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg><span>ZIP</span></button>`;
                          })()}
                          <button type="button" data-order-id="${order.id}" class="view-order-detail-btn inline-flex items-center gap-1.5 text-xs font-bold ${order.isExpired ? 'text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300' : 'text-white bg-[#0071E3] hover:bg-[#0062C8] dark:bg-[#3B9EFF] dark:hover:bg-[#2B8EF0] shadow-sm active:scale-95'} px-3.5 py-1.5 rounded-lg transition-all cursor-pointer">
                            <span>${order.isExpired ? 'Biên nhận' : 'Xem & Dùng'}</span>
                            <span>→</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    },

    // ==========================================
    // TAB 3: VÍ CỦA TÔI (ĐÃ CHUYỂN HƯỚNG HOÀN TOÀN SANG ĐƠN HÀNG)
    // ==========================================
    renderWalletTab: function (user, orders) {
      orders = orders || getUserOrders(user);
      return this.renderOrdersTab(user, orders);
    },

    // ==========================================
    // TAB 4: CỘNG TÁC VIÊN 25% (REFERRAL)
    // ==========================================
    renderReferralTab: function (user) {
      const cleanEmail = String((user && user.email) || '').trim().toLowerCase();
      const stats = (window.ShopVietState && typeof window.ShopVietState.getReferralStats === 'function')
        ? window.ShopVietState.getReferralStats(cleanEmail)
        : {
            refCode: 'BT' + (cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'CREATOR'),
            clicks: 0,
            signups: 0,
            orders: 0,
            commissionXu: 0,
            earnings: []
          };
      const refCode = stats.refCode || 'BTCREATOR';
      const siteOrigin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://www.promptmmo.store';
      const referralLink = `${siteOrigin}/?ref=${encodeURIComponent(refCode)}`;
      const ctvEarnings = Array.isArray(stats.earnings) ? stats.earnings : [];

      return `
        <!-- Header Cộng Tác Viên 25% -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Cộng Tác Viên (25% Hoa Hồng)
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Chia sẻ liên kết giới thiệu cá nhân để nhận ngay 25% giá trị Xu trên mọi đơn hàng thành công.
            </p>
          </div>
          <button
            type="button"
            onclick="ShopVietViews.dashboard.switchTab('seller')"
            class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shrink-0 self-start sm:self-auto"
          >
            Rút Xu về ngân hàng →
          </button>
        </div>

        <!-- Khung link giới thiệu chuyên nghiệp -->
        <div class="bg-white dark:bg-[#111520] p-6 rounded-xl border border-slate-900/10 dark:border-white/10 shadow-2xs space-y-4">
          <div class="flex items-center gap-2 text-[#0071E3] dark:text-[#3B9EFF] font-bold text-sm">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>Đường link Cộng Tác Viên độc quyền của bạn</span>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div class="relative flex-1">
              <label for="referralLinkInput" class="sr-only">Đường link Cộng Tác Viên</label>
              <input type="text" id="referralLinkInput" readonly value="${escHtml(referralLink)}" class="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/80 dark:bg-[#090B10] font-mono text-xs sm:text-sm text-slate-900 dark:text-white font-semibold select-all focus:outline-none">
            </div>
            <button type="button" id="copyReferralLinkBtn" class="bg-[#0071E3] hover:bg-[#0062C8] dark:bg-[#3B9EFF] dark:hover:bg-[#2B8EF0] text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              <span>Sao chép link</span>
            </button>
          </div>

          <p class="text-xs text-slate-500 dark:text-slate-400">
            Mã CTV của bạn: <strong class="font-mono text-[#0071E3] dark:text-[#3B9EFF] text-sm">${escHtml(refCode)}</strong> · Hệ thống tự động cộng 25% Xu vào Ví Xu của bạn ngay khi người được giới thiệu hoàn tất thanh toán (chặn tự giới thiệu).
          </p>
        </div>

        <!-- 3 Thẻ Thống Kê Giới Thiệu Thực Tế -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
          <div class="bg-white dark:bg-[#111520] rounded-xl p-5 border border-slate-900/10 dark:border-white/10 shadow-2xs">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Số lượt click</span>
            <div id="ctvStatClicks" class="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">${Number(stats.clicks || 0).toLocaleString('vi-VN')}</div>
            <p class="text-xs text-slate-400 mt-1">Lượt truy cập qua link CTV của bạn</p>
          </div>

          <div class="bg-white dark:bg-[#111520] rounded-xl p-5 border border-slate-900/10 dark:border-white/10 shadow-2xs">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Đăng ký / Đơn phát sinh</span>
            <div id="ctvStatSignups" class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">${Number(stats.signups || 0).toLocaleString('vi-VN')} <span class="text-base font-bold text-slate-400">/ ${Number(stats.orders || 0).toLocaleString('vi-VN')} đơn</span></div>
            <p class="text-xs text-slate-400 mt-1">Tài khoản đăng ký &amp; đơn hàng CTV</p>
          </div>

          <div class="bg-white dark:bg-[#111520] rounded-xl p-5 border border-slate-900/10 dark:border-white/10 shadow-2xs">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Hoa hồng CTV đã nhận</span>
            <div id="ctvStatCommission" class="text-3xl font-extrabold text-[#0071E3] dark:text-[#3B9EFF] mt-2">${Number(stats.commissionXu || 0).toLocaleString('vi-VN')} Xu</div>
            <p class="text-xs text-slate-400 mt-1">Đã cộng thẳng vào Ví Xu khả dụng</p>
          </div>
        </div>

        <!-- Chính sách nhận thưởng 3 bước -->
        <div class="bg-white dark:bg-[#111520] rounded-xl p-6 border border-slate-900/10 dark:border-white/10 shadow-2xs space-y-4">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            Quy trình kiếm 25% hoa hồng Cộng Tác Viên:
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
            <div class="p-4 rounded-xl bg-slate-50/80 dark:bg-[#090B10]/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
              <div class="w-7 h-7 rounded-lg bg-[#0071E3] dark:bg-[#3B9EFF] text-white font-bold flex items-center justify-center text-sm tabular-nums">1</div>
              <div class="font-bold text-slate-900 dark:text-white text-sm">Gửi liên kết CTV</div>
              <p class="text-slate-500 dark:text-slate-400">Chia sẻ link <code>/?ref=${escHtml(refCode)}</code> qua Facebook, TikTok, Zalo hoặc nhóm cộng đồng.</p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50/80 dark:bg-[#090B10]/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
              <div class="w-7 h-7 rounded-lg bg-[#0071E3] dark:bg-[#3B9EFF] text-white font-bold flex items-center justify-center text-sm tabular-nums">2</div>
              <div class="font-bold text-slate-900 dark:text-white text-sm">Khách đăng ký &amp; mua hàng</div>
              <p class="text-slate-500 dark:text-slate-400">Hệ thống tự động ghi nhận mã giới thiệu trên trình duyệt của khách trong suốt phiên mua sắm.</p>
            </div>

            <div class="p-4 rounded-xl bg-emerald-500/8 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-1.5">
              <div class="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm tabular-nums">3</div>
              <div class="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Nhận ngay 25% giá trị đơn</div>
              <p class="text-emerald-700 dark:text-emerald-300/90">Hoa hồng Xu cộng tức thì vào ví của bạn, rút tiền mặt về ngân hàng từ 20.000 Xu.</p>
            </div>
          </div>
        </div>

        <!-- Lịch sử hoa hồng CTV -->
        <div class="bg-white dark:bg-[#111520] rounded-xl border border-slate-900/10 dark:border-white/10 shadow-2xs overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Lịch sử hoa hồng CTV 25%</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-50/80 dark:bg-[#090B10]/70 font-bold text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200/80 dark:border-slate-800/80">
                <tr>
                  <th scope="col" class="py-3 px-4">Mã đơn</th>
                  <th scope="col" class="py-3 px-4">Sản phẩm</th>
                  <th scope="col" class="py-3 px-4">Hoa hồng nhận</th>
                  <th scope="col" class="py-3 px-4">Thời gian</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                ${ctvEarnings.length === 0 ? `
                  <tr>
                    <td colspan="4" class="py-8 text-center text-slate-400">Chưa có giao dịch hoa hồng CTV nào. Hãy chia sẻ link giới thiệu ở trên để bắt đầu kiếm Xu.</td>
                  </tr>
                ` : ctvEarnings.map(function (item) {
                  return `
                    <tr>
                      <td class="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">${escHtml(item.orderId || item.id)}</td>
                      <td class="py-3 px-4">${escHtml(item.productName || 'Sản phẩm Studio')}</td>
                      <td class="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">+${Number(item.amountXu || 0).toLocaleString('vi-VN')} Xu</td>
                      <td class="py-3 px-4 text-slate-400 tabular-nums">${item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : ''}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    },

    // ==========================================
    // TAB 5: KÊNH NGƯỜI BÁN SÀN CREATOR (80/20) & RÚT XU
    // ==========================================
    renderSellerTab: function (user) {
      const cleanEmail = String((user && user.email) || '').trim().toLowerCase();
      const users = (window.ShopVietState && typeof window.ShopVietState.getUsersDB === 'function')
        ? window.ShopVietState.getUsersDB()
        : [];
      const dbUser = users.find(function (u) { return u && u.email && u.email.trim().toLowerCase() === cleanEmail; });
      const availableXu = dbUser ? Math.max(0, Number(dbUser.balance) || 0) : Math.max(0, Number((user && user.balance) || 0));

      const allListings = (window.ShopVietState && typeof window.ShopVietState.getMarketplaceListings === 'function')
        ? window.ShopVietState.getMarketplaceListings(true)
        : [];
      const myListings = allListings.filter(function (item) {
        return item && item.sellerEmail && item.sellerEmail.trim().toLowerCase() === cleanEmail;
      });
      const approvedCount = myListings.filter(function (l) { return l.status === 'approved'; }).length;
      const pendingCount = myListings.filter(function (l) { return l.status === 'pending'; }).length;

      const myEarnings = (window.ShopVietState && typeof window.ShopVietState.getMarketplaceEarnings === 'function')
        ? window.ShopVietState.getMarketplaceEarnings(cleanEmail)
        : [];
      const totalEarnedXu = myEarnings.reduce(function (sum, item) {
        return sum + Math.max(0, Number(item && item.amountXu) || 0);
      }, 0);

      const myWithdrawals = (window.ShopVietState && typeof window.ShopVietState.getWithdrawals === 'function')
        ? window.ShopVietState.getWithdrawals(cleanEmail)
        : [];

      const minWd = (window.ShopVietMarketplace && window.ShopVietMarketplace.MIN_WITHDRAWAL_XU) || 20000;

      return `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Kênh Người Bán (80/20) &amp; Rút Xu
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Đăng bán mã nguồn, workflow n8n, template hoặc prompt nhận 80% doanh thu. Rút tiền về ngân hàng từ ${minWd.toLocaleString('vi-VN')} Xu.
            </p>
          </div>
          <button
            type="button"
            id="sellerNewListingBtn"
            onclick="if(window.ShopVietViews && window.ShopVietViews.modal) window.ShopVietViews.modal.openSubmitListingModal()"
            class="lg-btn-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer shrink-0 self-start sm:self-auto"
          >
            + Đăng bán sản phẩm mới
          </button>
        </div>

        <!-- 3 KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
          <div class="bg-white dark:bg-[#111520] rounded-xl p-5 border border-slate-900/10 dark:border-white/10 shadow-2xs">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Số dư Ví Xu khả dụng</span>
            <div id="sellerAvailableBalance" class="text-2xl sm:text-3xl font-extrabold text-[#0071E3] dark:text-[#3B9EFF] mt-2">${availableXu.toLocaleString('vi-VN')} Xu</div>
            <p class="text-xs text-slate-400 mt-1">Có thể dùng mua hàng hoặc rút tiền mặt</p>
          </div>

          <div class="bg-white dark:bg-[#111520] rounded-xl p-5 border border-slate-900/10 dark:border-white/10 shadow-2xs">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Tổng thu nhập Creator &amp; CTV</span>
            <div id="sellerTotalEarned" class="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">${totalEarnedXu.toLocaleString('vi-VN')} Xu</div>
            <p class="text-xs text-slate-400 mt-1">80% doanh thu bán hàng + 25% CTV</p>
          </div>

          <div class="bg-white dark:bg-[#111520] rounded-xl p-5 border border-slate-900/10 dark:border-white/10 shadow-2xs">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Sản phẩm của bạn</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">${myListings.length}</div>
            <p class="text-xs text-slate-400 mt-1">${approvedCount} đang bán · ${pendingCount} chờ duyệt</p>
          </div>
        </div>

        <!-- Form Yêu Cầu Rút Xu Về Ngân Hàng -->
        <div class="bg-white dark:bg-[#111520] rounded-xl p-6 border border-slate-900/10 dark:border-white/10 shadow-2xs space-y-4">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Gửi yêu cầu rút Xu về tài khoản ngân hàng</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tỷ giá 1 Xu = 1 VNĐ · Tối thiểu ${minWd.toLocaleString('vi-VN')} Xu/lần. Admin chuyển khoản 24/7 và hoàn lại 100% Xu nếu hủy lệnh.</p>
          </div>

          <div id="wdErrorAlert" role="alert" class="hidden p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-semibold text-rose-700 dark:text-rose-300"></div>

          <form id="withdrawalRequestForm" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="wdBankName" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Ngân hàng nhận</label>
              <select id="wdBankName" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-[#090B10] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]">
                <option value="MBBank">MBBank (Quân Đội)</option>
                <option value="Techcombank">Techcombank</option>
                <option value="Vietcombank">Vietcombank</option>
                <option value="BIDV">BIDV</option>
                <option value="ACB">ACB</option>
                <option value="VPBank">VPBank</option>
                <option value="TPBank">TPBank</option>
                <option value="MoMo">Ví MoMo</option>
              </select>
            </div>

            <div>
              <label for="wdAmountXu" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Số Xu muốn rút (tối thiểu ${minWd.toLocaleString('vi-VN')})</label>
              <input id="wdAmountXu" type="number" min="${minWd}" step="1000" required placeholder="${minWd}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-[#090B10] text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3] tabular-nums" />
            </div>

            <div>
              <label for="wdAccountNumber" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Số tài khoản / SĐT ví</label>
              <input id="wdAccountNumber" type="text" required minlength="6" placeholder="Ví dụ: 0986019623" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-[#090B10] text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]" />
            </div>

            <div>
              <label for="wdAccountHolder" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tên chủ tài khoản (Không dấu)</label>
              <input id="wdAccountHolder" type="text" required minlength="2" placeholder="Ví dụ: NGUYEN VAN A" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-[#090B10] text-sm uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]" />
            </div>

            <div class="sm:col-span-2 flex items-center justify-between gap-3 pt-1">
              <span class="text-xs text-slate-500 dark:text-slate-400">Xu sẽ được tạm giữ ngay khi gửi lệnh để đảm bảo đối soát chính xác.</span>
              <button type="submit" id="wdSubmitBtn" class="lg-btn-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer shrink-0">
                Gửi lệnh rút Xu
              </button>
            </div>
          </form>
        </div>

        <!-- Bảng Sản phẩm đã đăng trên Sàn Creator -->
        <div class="bg-white dark:bg-[#111520] rounded-xl border border-slate-900/10 dark:border-white/10 shadow-2xs overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Sản phẩm bạn đã gửi lên Sàn Creator (${myListings.length})</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-50/80 dark:bg-[#090B10]/70 font-bold text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200/80 dark:border-slate-800/80">
                <tr>
                  <th scope="col" class="py-3 px-4">Sản phẩm</th>
                  <th scope="col" class="py-3 px-4">Danh mục</th>
                  <th scope="col" class="py-3 px-4">Giá bán</th>
                  <th scope="col" class="py-3 px-4">Trạng thái</th>
                  <th scope="col" class="py-3 px-4">Ghi chú kiểm duyệt</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                ${myListings.length === 0 ? `
                  <tr>
                    <td colspan="5" class="py-8 text-center text-slate-400">
                      Bạn chưa đăng bán sản phẩm nào. Bấm "+ Đăng bán sản phẩm mới" để chia sẻ sản phẩm và nhận 80% doanh thu.
                    </td>
                  </tr>
                ` : myListings.map(function (item) {
                  const st = item.status || 'pending';
                  const stBadge = st === 'approved'
                    ? '<span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold">Đã duyệt · Đang bán</span>'
                    : (st === 'rejected'
                      ? '<span class="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold">Từ chối</span>'
                      : '<span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">Chờ Admin duyệt</span>');
                  return `
                    <tr>
                      <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">${escHtml(item.name)}</td>
                      <td class="py-3 px-4">${escHtml(item.tag || item.category || 'Tool & n8n')}</td>
                      <td class="py-3 px-4 font-bold tabular-nums">${Number(item.price || 0).toLocaleString('vi-VN')} Xu</td>
                      <td class="py-3 px-4 whitespace-nowrap">${stBadge}</td>
                      <td class="py-3 px-4 text-slate-500 dark:text-slate-400">${escHtml(item.moderationNote || (st === 'pending' ? 'Đang chờ Admin kiểm tra link bàn giao' : '—'))}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bảng Lịch sử rút tiền -->
        <div class="bg-white dark:bg-[#111520] rounded-xl border border-slate-900/10 dark:border-white/10 shadow-2xs overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Lịch sử lệnh rút Xu (${myWithdrawals.length})</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-50/80 dark:bg-[#090B10]/70 font-bold text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200/80 dark:border-slate-800/80">
                <tr>
                  <th scope="col" class="py-3 px-4">Mã lệnh</th>
                  <th scope="col" class="py-3 px-4">Tài khoản nhận</th>
                  <th scope="col" class="py-3 px-4">Số Xu rút</th>
                  <th scope="col" class="py-3 px-4">Trạng thái</th>
                  <th scope="col" class="py-3 px-4">Ghi chú</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                ${myWithdrawals.length === 0 ? `
                  <tr>
                    <td colspan="5" class="py-8 text-center text-slate-400">Chưa có lệnh rút tiền nào.</td>
                  </tr>
                ` : myWithdrawals.map(function (wd) {
                  const st = wd.status || 'pending';
                  const stBadge = st === 'completed'
                    ? '<span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold">Đã chuyển khoản</span>'
                    : (st === 'rejected'
                      ? '<span class="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold">Từ chối · Đã hoàn Xu</span>'
                      : '<span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">Đang chờ xử lý</span>');
                  return `
                    <tr>
                      <td class="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">${escHtml(wd.id)}</td>
                      <td class="py-3 px-4">${escHtml(wd.bankName)} · <span class="font-mono">${escHtml(wd.accountNumber)}</span> (${escHtml(wd.accountHolder)})</td>
                      <td class="py-3 px-4 font-bold tabular-nums text-[#0071E3] dark:text-[#3B9EFF]">${Number(wd.amountXu || 0).toLocaleString('vi-VN')} Xu</td>
                      <td class="py-3 px-4 whitespace-nowrap">${stBadge}</td>
                      <td class="py-3 px-4 text-slate-500 dark:text-slate-400">${escHtml(wd.note || wd.moderationNote || '—')}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    },

    renderGiftcardsTab: function (user) { return ""; },

    // ==========================================
    // TAB 6: BẢO MẬT & MẬT KHẨU (SECURITY)
    // ==========================================
    renderSecurityTab: function (user) {
      return `
        <!-- Header Bảo mật -->
        <div class="pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Bảo mật & Mật khẩu
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Quản lý và cập nhật mật khẩu tài khoản của bạn để đảm bảo an toàn tối đa.
          </p>
        </div>

        <!-- Form Đổi Mật Khẩu -->
        <div class="bg-white dark:bg-[#111520] rounded-xl p-6 border border-slate-900/10 dark:border-white/10 shadow-2xs space-y-4">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0071E3] dark:text-[#3B9EFF] flex items-center justify-center">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Thay đổi mật khẩu đăng nhập</h2>
          </div>

          <form id="changePasswordForm" class="space-y-4 max-w-lg">
            
            <div>
              <label for="currentPasswordInput" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Mật khẩu hiện tại
              </label>
              <input type="password" id="currentPasswordInput" placeholder="Nhập mật khẩu hiện tại (Mặc định: 12345678)" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-[#090B10] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3] dark:focus:ring-[#3B9EFF]">
            </div>

            <div>
              <label for="newPasswordInput" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Mật khẩu mới
              </label>
              <input type="password" id="newPasswordInput" placeholder="Tối thiểu 6 ký tự bảo mật" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-[#090B10] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3] dark:focus:ring-[#3B9EFF]">
            </div>

            <div>
              <label for="confirmNewPasswordInput" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Xác nhận mật khẩu mới
              </label>
              <input type="password" id="confirmNewPasswordInput" placeholder="Nhập lại mật khẩu mới" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-[#090B10] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3] dark:focus:ring-[#3B9EFF]">
            </div>

            <button type="submit" id="updatePasswordBtn" class="bg-[#0071E3] hover:bg-[#0062C8] dark:bg-[#3B9EFF] dark:hover:bg-[#2B8EF0] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer">
              Cập nhật mật khẩu
            </button>
          </form>
        </div>
      `;
    },

    // ==========================================
    // TAB 7: HỒ SƠ CÁ NHÂN (PROFILE)
    // ==========================================
    renderProfileTab: function (user) {
      const avatars = ['C', 'H', 'VIP', 'AI', 'PRO', 'DEV'];

      return `
        <!-- Header Hồ sơ cá nhân -->
        <div class="pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Hồ sơ cá nhân
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Cập nhật thông tin tài khoản, số điện thoại liên hệ và ảnh đại diện hiển thị trên toàn hệ thống.
          </p>
        </div>

        <div class="bg-white dark:bg-[#111520] rounded-xl p-6 border border-slate-900/10 dark:border-white/10 shadow-2xs space-y-6">
          
          <!-- Avatar Selector -->
          <div class="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-200/70 dark:border-slate-800/80">
            <div id="profileAvatarPreview" class="w-16 h-16 rounded-full bg-[#090B10] text-white font-black text-2xl flex items-center justify-center shadow-md border-2 border-[#0071E3] dark:border-[#3B9EFF]">
              ${(user.avatar && user.avatar.length <= 3) ? user.avatar.toUpperCase() : ((user.name || 'C').trim().charAt(0).toUpperCase())}
            </div>
            
            <div class="space-y-2 text-center sm:text-left">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">Chọn ảnh đại diện / Ký hiệu:</span>
              <div class="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                ${avatars.map(function (av) {
                  return `
                    <button type="button" data-avatar="${av}" class="profile-avatar-option w-8 h-8 rounded-lg border ${user.avatar === av ? 'border-[#0071E3] dark:border-[#3B9EFF] bg-[#0071E3] dark:bg-[#3B9EFF] text-white' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'} text-xs font-bold transition-all hover:scale-105 cursor-pointer">
                      ${av}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Form Chỉnh sửa thông tin -->
          <form id="profileEditForm" class="space-y-4 max-w-lg">
            
            <div>
              <label for="profileNameInput" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Họ và tên
              </label>
              <input type="text" id="profileNameInput" value="${user.name || 'Bùi Thái'}" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-[#090B10] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3] dark:focus:ring-[#3B9EFF]">
            </div>

            <div>
              <label for="profileEmailInput" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Địa chỉ Email (Cố định tài khoản)
              </label>
              <input type="email" id="profileEmailInput" readonly value="${user.email || 'thaitraicau123@gmail.com'}" class="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#090B10]/60 text-sm text-slate-500 dark:text-slate-400 font-mono focus:outline-none cursor-not-allowed">
            </div>

            <div>
              <label for="profilePhoneInput" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Số điện thoại liên hệ
              </label>
              <input type="tel" id="profilePhoneInput" value="${user.phone || '0986019623'}" class="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-[#090B10] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3] dark:focus:ring-[#3B9EFF] tabular-nums">
            </div>

            <div class="pt-2">
              <button type="submit" id="saveProfileBtn" class="bg-[#0071E3] hover:bg-[#0062C8] dark:bg-[#3B9EFF] dark:hover:bg-[#2B8EF0] text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Lưu thông tin hồ sơ</span>
              </button>
            </div>

          </form>

        </div>
      `;
    },

    /**
     * Khởi tạo các sự kiện tương tác sau khi mount view
     */
    afterRender: function () {
      const user = getCurrentUser();
      const userOrders = getUserOrders(user);

      // 1. Chuyển đổi qua lại giữa 7 Tab trên Sidebar
      const tabButtons = document.querySelectorAll('.dashboard-tab-btn');
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-tab');
          this.switchTab(tab);
        });
      });

      // 2. Nút Đăng xuất
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          if (window.ShopVietState && typeof window.ShopVietState.logout === 'function') {
            window.ShopVietState.logout();
          } else if (window.ShopVietState) {
            if (window.ShopVietState.state && window.ShopVietState.state.user) {
              window.ShopVietState.state.user.isLoggedIn = false;
            }
            window.ShopVietState.save();
            window.ShopVietState.showToast('Bạn đã đăng xuất tài khoản an toàn', 'info');
            window.ShopVietState.navigate('home');
          }
        });
      }

      // 3. Khởi tạo modal chi tiết và modal VietQR MBBank
      this.bindModalEvents(user, userOrders);

      // 4. Khởi tạo sự kiện riêng cho từng Tab hiện tại
      this.bindTabEvents(activeTab, user, userOrders);
    },

    /**
     * Chuyển tab mượt mà không load lại trang
     */
    switchTab: function (tabKey) {
      if (tabKey === 'wallet') {
        tabKey = 'orders';
      }
      activeTab = tabKey;
      const user = getCurrentUser();
      const userOrders = getUserOrders(user);

      // Cập nhật class active trên các nút menu sidebar
      const tabButtons = document.querySelectorAll('.dashboard-tab-btn');
      tabButtons.forEach(btn => {
        const t = btn.getAttribute('data-tab');
        if (t === tabKey) {
          btn.className = 'dashboard-tab-btn w-full bg-blue-50/90 dark:bg-slate-800/90 text-[#0071E3] dark:text-[#3B9EFF] font-bold shadow-xs rounded-xl px-4 py-2.5 flex items-center justify-between transition-all text-left cursor-pointer';
        } else {
          btn.className = 'dashboard-tab-btn w-full text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white rounded-xl px-4 py-2.5 flex items-center justify-between transition-all text-left cursor-pointer';
        }
      });

      // Render nội dung tab vào main container
      const mainArea = document.getElementById('dashboardMainArea');
      if (mainArea) {
        mainArea.style.opacity = '0';
        mainArea.style.transform = 'translateY(6px)';
        mainArea.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

        setTimeout(() => {
          mainArea.innerHTML = this.renderTabContent(tabKey, user, userOrders);
          mainArea.style.opacity = '1';
          mainArea.style.transform = 'translateY(0)';

          // Cập nhật số lượng đơn hàng trên badge sidebar
          const badge = document.getElementById('sidebarOrderBadge');
          if (badge) {
            badge.textContent = userOrders.length;
          }

          // Tái gắn sự kiện cho tab mới
          this.bindTabEvents(tabKey, user, userOrders);
          this.bindModalEvents(user, userOrders);
        }, 80);
      }
    },

    /**
     * Làm mới nội dung tab hiện tại ngay lập tức khi có dữ liệu đơn hàng mới từ Cloud
     */
    refreshActiveTab: function () {
      const user = getCurrentUser();
      const userOrders = getUserOrders(user);
      const mainArea = document.getElementById('dashboardMainArea');
      if (mainArea) {
        mainArea.innerHTML = this.renderTabContent(activeTab, user, userOrders);
        this.bindTabEvents(activeTab, user, userOrders);
        this.bindModalEvents(user, userOrders);
      }
      const badge = document.getElementById('sidebarOrderBadge');
      if (badge) {
        badge.textContent = userOrders.length;
      }
    },

    /**
     * Gắn sự kiện chi tiết theo từng tab
     */
    bindTabEvents: function (tabKey, user, userOrders) {
      if (tabKey === 'wallet') {
        tabKey = 'orders';
      }
      if (tabKey === 'overview') {
        this.bindOverviewEvents();
      } else if (tabKey === 'orders') {
        this.bindOrdersEvents(user, userOrders);
      } else if (tabKey === 'seller') {
        this.bindSellerEvents(user);
      } else if (tabKey === 'referral') {
        this.bindReferralEvents(user);
      } else if (tabKey === 'security') {
        this.bindSecurityEvents(user);
      } else if (tabKey === 'profile') {
        this.bindProfileEvents(user);
      }
    },

    /**
     * Sự kiện cho Tab 1: Tổng quan
     */
    bindOverviewEvents: function () {
      const qrBtn = document.getElementById('overviewOpenQrBtn');
      const vietQrModal = document.getElementById('vietQrModal');
      if (qrBtn && vietQrModal) {
        qrBtn.addEventListener('click', () => {
          vietQrModal.classList.remove('hidden');
        });
      }

      const buyMoreBtn = document.getElementById('overviewBuyMoreBtn');
      if (buyMoreBtn) {
        buyMoreBtn.addEventListener('click', () => {
          window.ShopVietState.navigate('home', { scrollTo: '#productsSection' });
        });
      }

      const viewAllOrdersLink = document.getElementById('overviewViewAllOrdersLink');
      if (viewAllOrdersLink) {
        viewAllOrdersLink.addEventListener('click', () => {
          this.switchTab('orders');
        });
      }
    },

    /**
     * Sự kiện cho Tab 2: Đơn hàng
     */
    bindOrdersEvents: function (user, userOrders) {
      // 1. Bộ lọc trạng thái đơn hàng
      const filterBtns = document.querySelectorAll('.order-filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          currentOrderFilter = btn.getAttribute('data-order-filter');
          this.switchTab('orders');
        });
      });

      // 2. Ô tìm kiếm đơn hàng realtime
      const searchInput = document.getElementById('orderSearchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          orderSearchQuery = e.target.value;
          const mainArea = document.getElementById('dashboardMainArea');
          if (mainArea) {
            mainArea.innerHTML = this.renderOrdersTab(user, userOrders);
            this.bindOrdersEvents(user, userOrders);
            this.bindModalEvents(user, userOrders);
          }
        });
      }
    },

    /**
     * Sự kiện cho Tab 3: Ví của tôi (Đã vô hiệu hóa)
     */
    bindWalletEvents: function (user) {
      // Đã vô hiệu hóa tính năng Ví
    },

    /**
     * Sự kiện cho Tab 4: Cộng Tác Viên 25%
     */
    bindReferralEvents: function (user) {
      const copyBtn = document.getElementById('copyReferralLinkBtn');
      const linkInput = document.getElementById('referralLinkInput');
      if (copyBtn && linkInput) {
        copyBtn.addEventListener('click', () => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(linkInput.value.trim()).catch(function () {});
          }
          window.ShopVietState.showToast('Đã sao chép link Cộng Tác Viên 25% của bạn.', 'success');
        });
      }
    },

    /**
     * Sự kiện cho Tab 5: Kênh Người Bán & Rút Xu
     */
    bindSellerEvents: function (user) {
      const form = document.getElementById('withdrawalRequestForm');
      if (!form) return;
      const self = this;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const errEl = document.getElementById('wdErrorAlert');
        if (errEl) {
          errEl.classList.add('hidden');
          errEl.textContent = '';
        }

        const bankName = (document.getElementById('wdBankName') || {}).value || '';
        const amountXu = (document.getElementById('wdAmountXu') || {}).value || '';
        const accountNumber = (document.getElementById('wdAccountNumber') || {}).value || '';
        const accountHolder = (document.getElementById('wdAccountHolder') || {}).value || '';

        if (!window.ShopVietState || typeof window.ShopVietState.requestWithdrawal !== 'function') {
          if (errEl) {
            errEl.textContent = 'Tính năng rút Xu chưa sẵn sàng.';
            errEl.classList.remove('hidden');
          }
          return;
        }

        const res = window.ShopVietState.requestWithdrawal({
          bankName: bankName,
          amountXu: amountXu,
          accountNumber: accountNumber,
          accountHolder: accountHolder
        });

        if (!res || !res.valid) {
          if (errEl) {
            errEl.textContent = (res && Array.isArray(res.errors) && res.errors.length > 0)
              ? res.errors.join(' • ')
              : 'Yêu cầu rút Xu không hợp lệ.';
            errEl.classList.remove('hidden');
          }
          return;
        }

        if (typeof window.ShopVietState.showToast === 'function') {
          window.ShopVietState.showToast('Đã gửi lệnh rút Xu thành công! Admin sẽ đối soát và chuyển khoản sớm nhất.', 'success');
        }
        self.refreshActiveTab();
      });
    },

    /**
     * Sự kiện cho Tab 6: Bảo mật & Mật khẩu
     */
    bindSecurityEvents: function (user) {
      // 1. Form đổi mật khẩu
      const form = document.getElementById('changePasswordForm');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const currentPass = document.getElementById('currentPasswordInput').value;
          const newPass = document.getElementById('newPasswordInput').value;
          const confirmPass = document.getElementById('confirmNewPasswordInput').value;

          if (newPass.length < 6) {
            window.ShopVietState.showToast('Mật khẩu mới phải có tối thiểu 6 ký tự', 'warning');
            return;
          }

          if (newPass !== confirmPass) {
            window.ShopVietState.showToast('Mật khẩu xác nhận không khớp với mật khẩu mới', 'error');
            return;
          }

          // Kiểm tra và cập nhật trong cloud users sync
          try {
            const CLOUD_USERS_KEY = 'shopviet247_cloud_users_sync';
            let users = [];
            const raw = localStorage.getItem(CLOUD_USERS_KEY);
            if (raw) users = JSON.parse(raw);
            const idx = users.findIndex(u => u.email === user.email);
            if (idx > -1) {
              users[idx].password = newPass;
            } else {
              users.push({ email: user.email, password: newPass, name: user.name });
            }
            localStorage.setItem(CLOUD_USERS_KEY, JSON.stringify(users));
          } catch (err) {}

          window.ShopVietState.showToast('Cập nhật mật khẩu tài khoản thành công. Hãy ghi nhớ mật khẩu mới.', 'success');
          form.reset();
        });
      }
    },

    /**
     * Sự kiện cho Tab 7: Hồ sơ cá nhân
     */
    bindProfileEvents: function (user) {
      // 1. Chọn avatar
      const avatarOptions = document.querySelectorAll('.profile-avatar-option');
      const avatarPreview = document.getElementById('profileAvatarPreview');

      avatarOptions.forEach(opt => {
        opt.addEventListener('click', () => {
          const chosen = opt.getAttribute('data-avatar');
          avatarOptions.forEach(o => {
            o.className = 'profile-avatar-option w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all hover:scale-105 cursor-pointer';
          });
          opt.className = 'profile-avatar-option w-8 h-8 rounded-lg border-2 border-[#0071E3] dark:border-[#3B9EFF] bg-[#0071E3] dark:bg-[#3B9EFF] text-white text-xs font-bold transition-all hover:scale-105 cursor-pointer';

          if (avatarPreview) {
            avatarPreview.textContent = chosen;
          }
          window.ShopVietState.state.user.avatar = chosen;
        });
      });

      // 2. Form cập nhật thông tin cá nhân
      const profileForm = document.getElementById('profileEditForm');
      if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const nameInput = document.getElementById('profileNameInput');
          const phoneInput = document.getElementById('profilePhoneInput');

          const newName = nameInput ? nameInput.value.trim() : user.name;
          const newPhone = phoneInput ? phoneInput.value.trim() : user.phone;

          if (!newName) {
            window.ShopVietState.showToast('Vui lòng nhập Họ và tên của bạn', 'warning');
            return;
          }

          // Cập nhật State toàn cục
          window.ShopVietState.state.user = window.ShopVietState.state.user || {};
          window.ShopVietState.state.user.name = newName;
          window.ShopVietState.state.user.phone = newPhone;
          if (!window.ShopVietState.state.user.avatar) {
            window.ShopVietState.state.user.avatar = newName.charAt(0).toUpperCase();
          }

          window.ShopVietState.save();

          // Đồng bộ sang Cloud Firestore nếu có
          if (window.ShopVietFirebase && typeof window.ShopVietFirebase.syncUserToCloud === 'function') {
            window.ShopVietFirebase.syncUserToCloud(window.ShopVietState.state.user);
          }

          // Cập nhật giao diện Sidebar Dashboard
          const sidebarUserName = document.getElementById('sidebarUserName');
          const sidebarUserAvatar = document.getElementById('sidebarUserAvatar');
          if (sidebarUserName) sidebarUserName.textContent = newName;
          if (sidebarUserAvatar) sidebarUserAvatar.textContent = (window.ShopVietState.state.user.avatar || 'C').toUpperCase();

          // Cập nhật Header Profile UI ngay lập tức
          if (window.ShopVietApp && typeof window.ShopVietApp.updateHeaderAuthUI === 'function') {
            window.ShopVietApp.updateHeaderAuthUI();
          }
          window.ShopVietState.notify('user_login', window.ShopVietState.state.user);

          window.ShopVietState.showToast('Cập nhật hồ sơ cá nhân thành công', 'success');
        });
      }
    },

    /**
     * Gắn sự kiện các Modal: License Key & VietQR MBBank
     */
    bindModalEvents: function (user, userOrders) {
      // 1. Modal Xem chi tiết đơn hàng
      const detailBtns = document.querySelectorAll('.view-order-detail-btn');
      const orderDetailModal = document.getElementById('orderDetailModal');
      const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
      const closeDetailModalBtn2 = document.getElementById('closeDetailModalBtn2');

      detailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const orderId = btn.getAttribute('data-order-id');
          const allOrders = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.orders) || [];
          const origOrder = allOrders.find(o => o.id === orderId);
          const found = (userOrders && userOrders.find(o => o.id === orderId)) || origOrder || (userOrders && userOrders[0]);

          if (found) {
            const currentStatus = found.status || (origOrder && origOrder.status);
            const isCompleted = currentStatus === 'completed';
            const unlockTime = found.unlockedAt ? new Date(found.unlockedAt).getTime() : ((origOrder && origOrder.unlockedAt) ? new Date(origOrder.unlockedAt).getTime() : (found.paidAt ? new Date(found.paidAt).getTime() : Date.now()));
            const oneDayMs = 24 * 60 * 60 * 1000;
            const remainingMs = (unlockTime + oneDayMs) - Date.now();
            const isExpired = false;

            // Nếu đơn hoàn tất và còn trong hạn 24h: Mở trực tiếp Giao diện Mở Khóa Bản Quyền Kỹ Năng
            if (isCompleted && !isExpired && window.ShopVietViews && window.ShopVietViews.modal && typeof window.ShopVietViews.modal.renderUnlockedSkillView === 'function') {
              window.ShopVietViews.modal.renderUnlockedSkillView(found);
              return;
            }
          }

          if (found && orderDetailModal) {
            const modalOrderId = document.getElementById('modalOrderId');
            const modalOrderProduct = document.getElementById('modalOrderProduct');
            const modalOrderAccount = document.getElementById('modalOrderAccount');
            const modalOrderKey = document.getElementById('modalOrderKey');
            const modalOrderGuide = document.getElementById('modalOrderGuide');
            const modalOrderWaitingNotice = document.getElementById('modalOrderWaitingNotice');
            const openOrderLinkBtn = document.getElementById('openOrderLinkBtn');
            const copyKeyBtn = document.getElementById('copyKeyBtn');

            const delInfo = found.deliveryInfo || (origOrder && origOrder.deliveryInfo) || {
              account: (user && user.email) || 'thaitraicau123@gmail.com',
              licenseKey: 'SV-LICENSE-KEY-VIP-2026',
              guide: 'Đăng nhập vào trang chủ và bắt đầu sử dụng. Bảo hành 1 đổi 1.'
            };

            if (modalOrderId) modalOrderId.textContent = found.id;
            if (modalOrderProduct) modalOrderProduct.textContent = found.productName;
            if (modalOrderAccount) modalOrderAccount.textContent = delInfo.account || (user && user.email) || 'thaitraicau123@gmail.com';

            const deliveryLink = found.customDeliveryLink || (origOrder && origOrder.customDeliveryLink) || (found.deliveryInfo && found.deliveryInfo.licenseKey) || found.licenseKey || (delInfo && delInfo.licenseKey) || '';

            const currentStatus = found.status || (origOrder && origOrder.status);
            const isCompleted = currentStatus === 'completed';
            const unlockTime = found.unlockedAt ? new Date(found.unlockedAt).getTime() : ((origOrder && origOrder.unlockedAt) ? new Date(origOrder.unlockedAt).getTime() : (found.paidAt ? new Date(found.paidAt).getTime() : (found.approvedAt ? new Date(found.approvedAt).getTime() : Date.now())));
            const oneDayMs = 24 * 60 * 60 * 1000;
            const remainingMs = (unlockTime + oneDayMs) - Date.now();
            const isExpired = false;
            const remHours = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60)));
            const remMinutes = Math.max(0, Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60)));

            if (currentStatus === 'pending_review') {
              if (modalOrderWaitingNotice) {
                modalOrderWaitingNotice.classList.remove('hidden');
                modalOrderWaitingNotice.innerHTML = `
                  <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
                    <svg class="w-4 h-4 text-amber-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2" stroke-dasharray="4 2"/></svg>
                    <span>Đang chờ Admin Bùi Thái duyệt thanh toán và mở khóa bản quyền...</span>
                  </div>
                `;
              }
              if (copyKeyBtn) copyKeyBtn.classList.add('hidden');
              if (openOrderLinkBtn) openOrderLinkBtn.classList.add('hidden');
              if (modalOrderKey) {
                modalOrderKey.textContent = 'Đang chờ Admin đối soát & bàn giao...';
              }
            } else if (isExpired) {
              // ĐƠN HÀNG ĐÃ TỰ ĐỘNG NIÊM PHONG SAU 24 GIỜ (1 NGÀY)
              if (modalOrderWaitingNotice) {
                modalOrderWaitingNotice.classList.remove('hidden');
                modalOrderWaitingNotice.innerHTML = `
                  <div class="p-3.5 rounded-xl bg-blue-500/8 border border-blue-500/20 text-slate-800 dark:text-slate-200 text-xs space-y-2">
                    <div class="font-bold flex items-center gap-1.5 text-[#0071E3] dark:text-[#3B9EFF]">
                      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z"/></svg>
                      <span>Đơn hàng đã tự động niêm phong do quá hạn 24 giờ</span>
                    </div>
                    <p class="leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
                      Theo chính sách bảo mật nội dung của Bùi Thái Studio, bản quyền và prompt chỉ mở khóa xem trong 24 giờ sau khi thanh toán. Nếu anh/chị cần hỗ trợ hoặc gia hạn xem lại, vui lòng liên hệ Admin Bùi Thái.
                    </p>
                    <div class="pt-1">
                      <a href="https://zalo.me/0986019623" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0071E3] hover:bg-[#0062C8] dark:bg-[#3B9EFF] dark:hover:bg-[#2B8EF0] text-white text-xs font-bold shadow-xs">
                        <span>Liên hệ Zalo 0986019623 để gia hạn</span>
                        <span>→</span>
                      </a>
                    </div>
                  </div>
                `;
              }
              if (copyKeyBtn) copyKeyBtn.classList.add('hidden');
              if (openOrderLinkBtn) openOrderLinkBtn.classList.add('hidden');
              if (modalOrderKey) {
                modalOrderKey.textContent = '•••••••••••••••• (ĐÃ TỰ ĐỘNG NIÊM PHONG SAU 24H)';
              }
            } else {
              // ĐANG MỞ KHÓA HOÀN TOÀN TRONG 24H (1 NGÀY)
              if (modalOrderWaitingNotice) {
                modalOrderWaitingNotice.classList.remove('hidden');
                modalOrderWaitingNotice.innerHTML = `
                  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5 font-bold">
                      <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Bản quyền vĩnh viễn · Mở khóa trọn đời</span>
                    </div>
                    <span class="text-[11px] font-semibold">Đã mở khóa</span>
                  </div>
                `;
              }
              if (copyKeyBtn) copyKeyBtn.classList.remove('hidden');
              if (modalOrderKey) {
                modalOrderKey.textContent = deliveryLink || 'KEY-PRO-ACTIVE';
              }
              if (openOrderLinkBtn) {
                if (deliveryLink && (deliveryLink.startsWith('http://') || deliveryLink.startsWith('https://'))) {
                  openOrderLinkBtn.classList.remove('hidden');
                  openOrderLinkBtn.href = deliveryLink;
                } else {
                  openOrderLinkBtn.classList.add('hidden');
                }
              }
            }

            const adminMsg = found.adminMessage || (origOrder && origOrder.adminMessage) || (delInfo && delInfo.adminMessage);
            if (modalOrderGuide) {
              if (adminMsg) {
                modalOrderGuide.innerHTML = `
                  <div class="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-200/80 dark:border-slate-800/80">
                    <div class="flex items-center gap-2 font-bold text-[#0071E3] dark:text-[#3B9EFF]">
                      <div class="w-6 h-6 rounded-lg bg-blue-500/10 text-[#0071E3] dark:text-[#3B9EFF] flex items-center justify-center shrink-0 border border-blue-500/20">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          <circle cx="9" cy="10" r="1" fill="currentColor"/>
                          <circle cx="12" cy="10" r="1" fill="currentColor"/>
                          <circle cx="15" cy="10" r="1" fill="currentColor"/>
                        </svg>
                      </div>
                      <span class="text-xs tracking-tight">Lời nhắn từ Admin Bùi Thái:</span>
                    </div>
                    <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Chính chủ
                    </span>
                  </div>
                  <div class="p-2.5 rounded-xl bg-white/90 dark:bg-[#0B0F17]/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs mb-2">
                    <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic select-text">${adminMsg}</p>
                  </div>
                  <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] pt-1.5 border-t border-slate-200/70 dark:border-slate-800/80">
                    <svg class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="m9 12 2 2 4-4"/>
                    </svg>
                    <span>Chính sách: Bảo hành 1 đổi 1 suốt thời gian sử dụng. Hỗ trợ kỹ thuật 24/7.</span>
                  </div>`;
              } else {
                modalOrderGuide.innerHTML = `
                  <div class="space-y-2">
                    <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">${delInfo.guide || 'Sản phẩm được kích hoạt tự động. Bảo hành 1 đổi 1 trong suốt thời gian sử dụng.'}</p>
                    <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] pt-1.5 border-t border-slate-200/70 dark:border-slate-800/80">
                      <svg class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="m9 12 2 2 4-4"/>
                      </svg>
                      <span>Chính sách: Bảo hành 1 đổi 1 suốt thời gian sử dụng. Hỗ trợ kỹ thuật 24/7.</span>
                    </div>
                  </div>`;
              }
            }

            orderDetailModal.classList.remove('hidden');
          }
        });
      });

      const closeDetail = () => {
        if (orderDetailModal) orderDetailModal.classList.add('hidden');
      };
      if (closeDetailModalBtn) closeDetailModalBtn.addEventListener('click', closeDetail);
      if (closeDetailModalBtn2) closeDetailModalBtn2.addEventListener('click', closeDetail);

      // Copy tài khoản & Copy Key trong modal
      const copyAccountBtn = document.getElementById('copyAccountBtn');
      if (copyAccountBtn) {
        copyAccountBtn.addEventListener('click', () => {
          const el = document.getElementById('modalOrderAccount');
          if (el) {
            navigator.clipboard.writeText(el.textContent.trim());
            window.ShopVietState.showToast('Đã sao chép Email tài khoản', 'success');
          }
        });
      }

      const copyKeyBtn = document.getElementById('copyKeyBtn');
      if (copyKeyBtn) {
        copyKeyBtn.addEventListener('click', () => {
          const el = document.getElementById('modalOrderKey');
          if (el) {
            navigator.clipboard.writeText(el.textContent.trim());
            window.ShopVietState.showToast('Đã sao chép License Key thành công', 'success');
          }
        });
      }

      // 2. Modal Nạp tiền VietQR MBBank
      const vietQrModal = document.getElementById('vietQrModal');
      const closeVietQrModalBtn = document.getElementById('closeVietQrModalBtn');
      if (closeVietQrModalBtn && vietQrModal) {
        closeVietQrModalBtn.addEventListener('click', () => {
          vietQrModal.classList.add('hidden');
        });
      }

      // Nút chọn nhanh số tiền nạp
      const amountBtns = document.querySelectorAll('.deposit-amount-btn');
      amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const amt = parseInt(btn.getAttribute('data-amount'), 10);
          selectedDepositAmount = amt;

          amountBtns.forEach(b => {
            b.className = 'deposit-amount-btn py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-blue-50/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all cursor-pointer';
          });
          btn.className = 'deposit-amount-btn py-2 text-xs font-bold rounded-xl border-2 border-[#0071E3] dark:border-[#3B9EFF] bg-blue-50/80 dark:bg-blue-950/50 text-[#0071E3] dark:text-[#3B9EFF] transition-all cursor-pointer';

          // Cập nhật ảnh QR MBBank
          this.updateMBBankQr(amt, user);
        });
      });

      // Nút xác nhận nạp tiền tự động
      const confirmDepositBtn = document.getElementById('confirmDepositBtn');
      if (confirmDepositBtn) {
        confirmDepositBtn.addEventListener('click', () => {
          this.handleQuickDeposit(selectedDepositAmount);
        });
      }
    },

    /**
     * Cập nhật ảnh VietQR MBBank theo số tiền
     */
    updateMBBankQr: function (amount, user) {
      user = user || getCurrentUser();
      const memo = 'NAP ' + (user.name ? user.name.replace(/\s+/g, '').toUpperCase() : 'THAIBUI2026');
      const qrImg = document.getElementById('techcombankQrImg');
      if (qrImg) {
        const url = `https://img.vietqr.io/image/970422-0986019623-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(TECHCOMBANK_CONFIG.accountName)}`;
        qrImg.src = url;
      }
    },

    /**
     * Sao chép cú pháp nạp tiền
     */
    copyDepositMemo: function () {
      const el = document.getElementById('depositMemoText');
      if (el) {
        const text = el.textContent.trim();
        navigator.clipboard.writeText(text);
        window.ShopVietState.showToast(`Đã sao chép cú pháp chuyển khoản: ${text}`, 'success');
      }
    },

    /**
     * Trả về HTML Fallback khi ảnh QR api.vietqr.io lỗi
     */
    getQrFallbackHtml: function () {
      const user = getCurrentUser();
      const memo = 'NAP ' + (user.name ? user.name.replace(/\s+/g, '').toUpperCase() : 'THAIBUI2026');
      return getFallbackQrSvg(selectedDepositAmount, memo);
    },

    /**
     * Xử lý Nạp thành công số tiền vào ví
     */
    handleQuickDeposit: function (amount) {
      const user = getCurrentUser();
      amount = amount || selectedDepositAmount || 200000;
      const memo = 'NAP ' + (user.name ? user.name.replace(/\s+/g, '').toUpperCase() : 'THAIBUI2026');

      // Tạo yêu cầu nạp tiền xu và đẩy lên Firebase + ntfy để Admin Bùi Thái duyệt
      let topup = null;
      if (window.ShopVietState && typeof window.ShopVietState.createTopupRequest === 'function') {
        topup = window.ShopVietState.createTopupRequest({
          amount: amount,
          bank: 'MBBank (0986019623)',
          accountNumber: '0986019623',
          accountName: 'BUI THAI',
          method: 'MBBank VietQR 24/7',
          memo: memo,
          userEmail: user.email,
          userName: user.name
        });
      }

      // Nếu createTopupRequest chưa gọi ntfy thì mới gọi fallback
      if (!topup && window.BuiThaiNtfy && typeof window.BuiThaiNtfy.notifyDepositRequest === 'function') {
        window.BuiThaiNtfy.notifyDepositRequest({
          amount: amount,
          userEmail: user.email,
          userName: user.name,
          memo: memo,
          bank: 'MBBank (0986019623)'
        });
      }

      // Thêm giao dịch chờ duyệt vào lịch sử ví
      addWalletTransaction(user.email, {
        id: (topup && topup.id) || ('TX-DEP-' + Math.random().toString(36).substring(2, 7).toUpperCase()),
        type: 'deposit',
        typeName: 'Nạp tiền VietQR MBBank',
        amount: amount,
        amountFormatted: `+${amount.toLocaleString('vi-VN')}đ`,
        balanceAfter: (window.ShopVietState.state.user && window.ShopVietState.state.user.balance) || 0,
        date: new Date().toLocaleString('vi-VN'),
        status: 'pending_approval',
        statusText: 'Chờ Admin duyệt',
        note: `Đã chuyển khoản MBBank (STK: ${TECHCOMBANK_CONFIG.accountNumber}) - Chờ duyệt số dư`
      });

      // Ẩn modal VietQR
      const vietQrModal = document.getElementById('vietQrModal');
      if (vietQrModal) vietQrModal.classList.add('hidden');

      window.ShopVietState.showToast(`Đã gửi yêu cầu nạp +${amount.toLocaleString('vi-VN')} Xu lên Firebase. Admin Bùi Thái đã nhận được thông báo và sẽ duyệt ngay.`, 'success');

      // Cập nhật tab nếu đang ở overview
      if (activeTab === 'overview') {
        this.switchTab('overview');
      }
    }
  };

  // Gắn vào window.ShopVietViews.dashboard
  window.ShopVietViews.dashboard = dashboardView;

})();
