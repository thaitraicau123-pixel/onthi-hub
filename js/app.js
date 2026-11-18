/**
 * Bùi Thái AI Studio - Main Application Entrypoint
 * Thiết lập các Event Listener, khởi tạo Header, phím tắt và Router
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  console.log('[Bùi Thái AI Studio] Khởi tạo Shell ứng dụng SaaS Clean...');

  // 1. Nạp trạng thái từ LocalStorage & Khởi động Theme
  const state = window.ShopVietState.load();

  // 2. Lắng nghe các nút trên Header & Render trạng thái Auth Dynamic
  setupHeaderEvents();
  updateHeaderAuthUI();

  // 3. Lắng nghe phím tắt toàn cục (Ctrl+K, Esc)
  setupKeyboardShortcuts();

  // 4. Kiểm tra deep-link (?product=, ?filter=, ?q=) & Kích hoạt Router
  const urlParams = new URLSearchParams(window.location.search || '');
  const sharedProductId = (urlParams.get('product') || '').trim();
  const sharedFilter = (urlParams.get('filter') || '').trim();
  const sharedQuery = (urlParams.get('q') || '').trim();

  if (sharedFilter) state.activeFilter = sharedFilter;
  if (sharedQuery) state.searchQuery = sharedQuery;

  const initialView = sharedProductId ? 'home' : (state.currentView || 'home');
  window.ShopVietState.navigate(initialView);

  if (sharedProductId && window.ShopVietViews && window.ShopVietViews.modal && typeof window.ShopVietViews.modal.open === 'function') {
    setTimeout(function () {
      window.ShopVietViews.modal.open(sharedProductId);
    }, 60);
  }

  // 5. Khởi tạo Icons Lucide
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // 6. Đăng ký state subscription để đồng bộ UI
  window.ShopVietState.subscribe(function (event, payload) {
    if (event === 'cart_updated') {
      window.ShopVietState.updateCartBadge();
    }
    if (event === 'user_login' || event === 'user_logout' || event === 'user_balance_updated' || event === 'topups_updated' || event === 'view_changed') {
      updateHeaderAuthUI();
    }
    if (event === 'view_changed' && payload) {
      if (payload.view === 'blog') {
        setActiveNav('navBlog');
      } else if (payload.view === 'home') {
        if (payload.params && payload.params.scrollTo === '#productsSection') {
          setActiveNav('navProducts');
        } else {
          setActiveNav('navHome');
        }
      } else {
        setActiveNav(null);
      }
    }
  });

  console.log('[Bùi Thái AI Studio] Ứng dụng đã sẵn sàng hoạt động.');
});

/**
 * Quản lý trạng thái Active Tab dạng Viên Thuốc Đen (Floating Pill)
 * @param {string|null} activeId - 'navHome' | 'navProducts' | 'navBlog' | 'navSupport'
 */
function setActiveNav(activeId) {
  const navIds = ['navHome', 'navProducts', 'navBlog'];
  const activeClasses = ['text-[#0071E3]', 'dark:text-[#3B9EFF]', 'border-b-2', 'border-[#0071E3]', 'dark:border-[#3B9EFF]', 'font-semibold'];
  const inactiveClasses = ['text-slate-600', 'dark:text-slate-300', 'hover:text-slate-900', 'dark:hover:text-white', 'border-b-2', 'border-transparent'];

  navIds.forEach(function (id) {
    const btn = document.getElementById(id);
    if (!btn) return;

    if (id === activeId) {
      inactiveClasses.forEach(function (cls) { btn.classList.remove(cls); });
      activeClasses.forEach(function (cls) { btn.classList.add(cls); });
    } else {
      activeClasses.forEach(function (cls) { btn.classList.remove(cls); });
      inactiveClasses.forEach(function (cls) { btn.classList.add(cls); });
    }
  });
}
window.setActiveNav = setActiveNav;

/**
 * Thiết lập các sự kiện trên Header
 */
function setupHeaderEvents() {
  const brandLogoLink = document.getElementById('brandLogoLink');
  const navHome = document.getElementById('navHome');
  const navProducts = document.getElementById('navProducts');
  const navBlog = document.getElementById('navBlog');
  const navSupport = document.getElementById('navSupport');
  const searchTriggerBtn = document.getElementById('header-search-btn') || document.getElementById('searchTriggerBtn');
  const cartBtn = document.getElementById('cartBtn');
  const langToggleBtn = document.getElementById('header-lang-btn') || document.getElementById('langToggleBtn');
  const themeToggleBtn = document.getElementById('headerThemeToggle') || document.getElementById('themeToggleBtn');
  const dashboardBtn = document.getElementById('header-dashboard-link') || document.getElementById('dashboardBtn');

  // Click Logo -> Về Home
  if (brandLogoLink) {
    brandLogoLink.addEventListener('click', function (e) {
      e.preventDefault();
      setActiveNav('navHome');
      window.ShopVietState.navigate('home');
    });
  }

  // Click "Trang chủ"
  if (navHome) {
    navHome.addEventListener('click', function (e) {
      e.preventDefault();
      setActiveNav('navHome');
      window.ShopVietState.navigate('home');
    });
  }

  // Click "Sản phẩm" -> Cuộn tới danh mục sản phẩm
  if (navProducts) {
    navProducts.addEventListener('click', function (e) {
      e.preventDefault();
      setActiveNav('navProducts');
      if (window.ShopVietState.state.currentView !== 'home') {
        window.ShopVietState.navigate('home', { scrollTo: '#productsSection' });
      } else {
        const sec = document.getElementById('productsSection');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Click "Blog"
  if (navBlog) {
    navBlog.addEventListener('click', function (e) {
      e.preventDefault();
      setActiveNav('navBlog');
      window.ShopVietState.navigate('blog');
    });
  }

  // Click "Liên hệ & Hỗ trợ" -> Mở trực tiếp Zalo CSKH 0986019623
  if (navSupport) {
    navSupport.addEventListener('click', function (e) {
      e.preventDefault();
      setActiveNav('navSupport');
      window.open('https://zalo.me/0986019623', '_blank');
    });
  }

  // Click Tìm kiếm
  if (searchTriggerBtn) {
    searchTriggerBtn.addEventListener('click', function (e) {
      e.preventDefault();
      triggerQuickSearch();
    });
  }

  // Click Giỏ hàng -> Mở trang Checkout
  if (cartBtn) {
    cartBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.ShopVietState.navigate('checkout');
    });
  }

  // Click Đổi ngôn ngữ (Tương thích Lucian UX/UI Prompt #267 Dropdown)
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.Lucian267 && typeof window.Lucian267.toggleDropdown === 'function') {
        window.Lucian267.toggleDropdown();
        return;
      }
      window.ShopVietState.toggleLang();
    });
  }

  // Click Đổi Theme Sáng / Tối (Circular-Reveal Dark Mode - Lucian UX/UI Prompt #219)
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function (e) {
      e.preventDefault();

      // Bắt tọa độ click chính xác từ sự kiện chuột hoặc tâm nút bấm
      const rect = themeToggleBtn.getBoundingClientRect();
      const cx = (typeof e.clientX === 'number' && e.clientX > 0)
        ? e.clientX
        : (rect.left + rect.width / 2);
      const cy = (typeof e.clientY === 'number' && e.clientY > 0)
        ? e.clientY
        : (rect.top + rect.height / 2);

      // Tính bán kính tối đa bao phủ toàn bộ màn hình từ tâm (cx, cy)
      const maxRadius = Math.hypot(
        Math.max(cx, window.innerWidth - cx),
        Math.max(cy, window.innerHeight - cy)
      );

      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 1. Trường hợp hỗ trợ View Transitions API và không bật prefers-reduced-motion
      if (document.startViewTransition && !prefersReducedMotion) {
        const transition = document.startViewTransition(() => {
          window.ShopVietState.toggleTheme();
        });

        transition.ready.then(() => {
          const isDark = document.documentElement.classList.contains('dark');
          const clipPathForward = [
            `circle(0px at ${cx}px ${cy}px)`,
            `circle(${maxRadius}px at ${cx}px ${cy}px)`
          ];
          const clipPathReverse = [
            `circle(${maxRadius}px at ${cx}px ${cy}px)`,
            `circle(0px at ${cx}px ${cy}px)`
          ];

          if (isDark) {
            // Khi chuyển sang Dark: old(root) ở z-index 9999 thu về button
            document.documentElement.animate(
              {
                clipPath: clipPathReverse
              },
              {
                duration: 700,
                easing: 'cubic-bezier(.65, 0, .35, 1)',
                pseudoElement: '::view-transition-old(root)'
              }
            );
          }

          // Kích hoạt chuẩn animate trên ::view-transition-new(root)
          document.documentElement.animate(
            {
              clipPath: clipPathForward
            },
            {
              duration: 700,
              easing: 'cubic-bezier(.65, 0, .35, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        }).catch((err) => {
          console.warn('[Lucian #219] View transition error:', err);
        });
        return;
      }

      // 2. Trường hợp prefers-reduced-motion: reduce -> Đổi tức thì không animation
      if (prefersReducedMotion) {
        window.ShopVietState.toggleTheme();
        return;
      }

      // 3. Fallback cho trình duyệt chưa có View Transitions: Overlay bung tròn clipPath
      const currentTheme = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.theme) || 'light';
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      const targetBgColor = targetTheme === 'dark' ? '#090B10' : '#F5F5F7';

      const overlay = document.createElement('div');
      overlay.className = 'circular-theme-overlay';
      overlay.style.backgroundColor = targetBgColor;
      overlay.style.clipPath = `circle(0px at ${cx}px ${cy}px)`;
      document.body.appendChild(overlay);

      // Kích hoạt chuyển động bung tròn mở rộng ra toàn màn hình
      requestAnimationFrame(() => {
        overlay.style.clipPath = `circle(${maxRadius}px at ${cx}px ${cy}px)`;
      });

      // Cập nhật state theme bên dưới khi vòng tròn phủ ~50%
      setTimeout(() => {
        window.ShopVietState.toggleTheme();
      }, 250);

      // Dọn dẹp overlay sau khi kết thúc 700ms transition
      setTimeout(() => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 750);
    });
  }

  // Click Dashboard
  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.ShopVietState.navigate('dashboard');
    });
  }

  // Click Cổng Quản Trị Bí Mật (Header & Footer) - Phân quyền DUY NHẤT thaitraicau123@gmail.com
  const adminPortalHeaderBtn = document.getElementById('adminPortalHeaderBtn');
  const adminPortalFooterBtn = document.getElementById('adminPortalFooterBtn');
  
  function handleAdminClick(e) {
    e.preventDefault();
    const u = window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user;
    const isExactAdmin = Boolean(u && u.isLoggedIn && u.email && u.email.trim().toLowerCase() === 'thaitraicau123@gmail.com');
    if (!isExactAdmin) {
      try {
        sessionStorage.removeItem('shopviet_admin_authenticated');
        localStorage.removeItem('shopviet_admin_authenticated');
      } catch (err) {}
      if (window.ShopVietState && typeof window.ShopVietState.showToast === 'function') {
        window.ShopVietState.showToast('Truy cập bị từ chối: Cổng quản trị chỉ dành riêng cho tài khoản thaitraicau123@gmail.com', 'error');
      }
      return;
    }
    if (window.ShopVietViews && window.ShopVietViews.admin) {
      window.ShopVietViews.admin.open();
    }
  }

  if (adminPortalHeaderBtn) {
    adminPortalHeaderBtn.addEventListener('click', handleAdminClick);
  }
  if (adminPortalFooterBtn) {
    adminPortalFooterBtn.addEventListener('click', handleAdminClick);
  }
}

/**
 * Thiết lập phím tắt
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function (e) {
    // Ctrl + Shift + A hoặc Cmd + Shift + A -> Mở Portal Admin Bí Mật (Bảo mật: DUY NHẤT thaitraicau123@gmail.com)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      const u = window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.user;
      const isExactAdmin = Boolean(u && u.isLoggedIn && u.email && u.email.trim().toLowerCase() === 'thaitraicau123@gmail.com');
      if (!isExactAdmin) {
        try {
          sessionStorage.removeItem('shopviet_admin_authenticated');
          localStorage.removeItem('shopviet_admin_authenticated');
        } catch (err) {}
        if (window.ShopVietState && typeof window.ShopVietState.showToast === 'function') {
          window.ShopVietState.showToast('Truy cập bị từ chối: Cổng quản trị chỉ dành riêng cho tài khoản thaitraicau123@gmail.com', 'error');
        }
        return;
      }
      if (window.ShopVietViews && window.ShopVietViews.admin) {
        window.ShopVietViews.admin.open();
      }
      return;
    }

    // Ctrl + K hoặc Cmd + K -> Mở tìm kiếm
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      triggerQuickSearch();
    }

    // Phím Escape -> Đóng modal nếu đang mở
    if (e.key === 'Escape') {
      const modalMount = document.getElementById('modalMount');
      if (modalMount && modalMount.innerHTML.trim() !== '') {
        modalMount.innerHTML = '';
      }
      const adminMount = document.getElementById('adminMount');
      if (adminMount && adminMount.innerHTML.trim() !== '') {
        adminMount.innerHTML = '';
      }
    }
  });
}

/**
 * Mở hộp tìm kiếm nhanh (Tích hợp Lucian #027 Expanding Top-Bar Search)
 */
function triggerQuickSearch() {
  if (window.Lucian027 && typeof window.Lucian027.open === 'function') {
    window.Lucian027.open();
    return;
  }
  const modalMount = document.getElementById('modalMount');
  if (!modalMount) return;

  modalMount.innerHTML = `
    <div id="quickSearchBackdrop" class="fixed inset-0 z-50 bg-slate-950/75 flex items-start justify-center pt-20 px-4 animate-fade-in" onclick="if(event.target === this) this.parentElement.innerHTML = ''">
      <div class="bg-white dark:bg-[#111520] border border-slate-900/10 dark:border-white/10 shadow-xl rounded-2xl w-full max-w-2xl overflow-hidden animate-slide-up">
        
        <!-- Search Input Bar -->
        <div class="p-4 border-b border-slate-200/70 dark:border-white/10 flex items-center gap-3">
          <svg class="w-5 h-5 text-[#0071E3] dark:text-[#3B9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            id="searchInputBox" 
            placeholder="Tìm mã nguồn Metropolis 1998, Diet Soda 3D, hoặc Master Prompts..." 
            class="flex-1 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-base"
            autocomplete="off"
            autofocus
          >
          <span class="text-[11px] font-mono font-semibold bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg">ESC</span>
        </div>

        <!-- Quick Tags -->
        <div class="p-4 bg-slate-100/60 dark:bg-white/[0.03] flex flex-wrap gap-2 text-xs">
          <span class="text-slate-500 self-center font-medium mr-1">Gợi ý nhanh:</span>
          <button class="search-tag-chip px-3 py-1 rounded-lg bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#3B9EFF]/15 dark:text-[#60A5FA] font-semibold hover:bg-[#0071E3]/20 transition">Metropolis 1998 (15k)</button>
          <button class="search-tag-chip px-3 py-1 rounded-lg bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#3B9EFF]/15 dark:text-[#60A5FA] font-semibold hover:bg-[#0071E3]/20 transition">Diet Soda 3D (15k)</button>
          <button class="search-tag-chip px-3 py-1 rounded-lg bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-300/70 transition">Web Thượng Lưu (9k)</button>
          <button class="search-tag-chip px-3 py-1 rounded-lg bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-300/70 transition">N8N Automation (9k)</button>
          <button class="search-tag-chip px-3 py-1 rounded-lg bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-300/70 transition">246+ Pixel VFX (9k)</button>
        </div>

        <!-- Search Results List -->
        <div id="searchResultsContainer" class="max-h-80 overflow-y-auto p-2 divide-y divide-slate-200/60 dark:divide-white/10">
          <div class="p-6 text-center text-slate-400 text-sm">
            Nhập tên mã nguồn hoặc bộ công cụ bạn muốn tìm kiếm...
          </div>
        </div>

      </div>
    </div>
  `;

  const input = document.getElementById('searchInputBox');
  const resultsContainer = document.getElementById('searchResultsContainer');
  const tagChips = document.querySelectorAll('.search-tag-chip');

  if (input) {
    input.focus();
    input.addEventListener('input', function (e) {
      renderSearchResults(e.target.value.trim(), resultsContainer);
    });
  }

  tagChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      if (input) {
        input.value = chip.textContent;
        renderSearchResults(chip.textContent, resultsContainer);
      }
    });
  });
}

/**
 * Hiển thị kết quả tìm kiếm tức thì
 */
function renderSearchResults(keyword, container) {
  if (!container) return;
  if (!keyword) {
    container.innerHTML = '<div class="p-6 text-center text-slate-400 text-sm">Nhập tên mã nguồn hoặc bộ công cụ bạn muốn tìm kiếm...</div>';
    return;
  }

  const prods = window.ShopVietData ? window.ShopVietData.products : [];
  const lower = keyword.toLowerCase();
  const matched = prods.filter(function (p) {
    return p.name.toLowerCase().includes(lower) || p.desc.toLowerCase().includes(lower) || p.tag.toLowerCase().includes(lower);
  });

  if (matched.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-400 space-y-2">
        <p class="text-sm">Không tìm thấy sản phẩm nào khớp với "<strong>${keyword}</strong>"</p>
        <p class="text-xs text-slate-500">Thử tìm với từ khóa: Metropolis 1998, Diet Soda 3D, Fullstack, N8N...</p>
      </div>
    `;
    return;
  }

  container.innerHTML = matched.map(function (p) {
    return `
      <div class="p-3 hover:bg-slate-100/80 dark:hover:bg-white/5 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition group" onclick="ShopVietApp.selectSearchedProduct('${p.id}')">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center p-2 shrink-0">
            ${window.ShopVietData ? window.ShopVietData.getBrandIcon(p.iconType) : ''}
          </div>
          <div>
            <h5 class="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#0071E3] dark:group-hover:text-[#3B9EFF] transition-colors line-clamp-1">${p.name}</h5>
            <span class="text-xs text-slate-500">${p.tag} · Mở khóa tức thì</span>
          </div>
        </div>
        <div class="text-right shrink-0">
          <span class="text-sm font-mono font-bold tabular-nums text-[#0071E3] dark:text-[#3B9EFF]">${window.ShopVietState.formatCurrency(p.price)}</span>
        </div>
      </div>
    `;
  }).join('');
}

// Namespace phương thức bổ trợ toàn cục
window.ShopVietApp = {
  selectSearchedProduct: function (productId) {
    const modalMount = document.getElementById('modalMount');
    if (modalMount) modalMount.innerHTML = '';

    if (window.ShopVietViews && window.ShopVietViews.modal && typeof window.ShopVietViews.modal.openQuickBuy === 'function') {
      window.ShopVietViews.modal.openQuickBuy(productId);
    } else {
      window.ShopVietState.addToCart(productId, 1);
      window.ShopVietState.navigate('checkout');
    }
  },
  updateHeaderAuthUI: updateHeaderAuthUI
};

/**
 * Cập nhật Header Dynamic Profile / Đăng nhập theo trạng thái thực tế của người dùng
 */
function updateHeaderAuthUI() {
  const container = document.getElementById('headerAuthContainer');
  if (!container) return;

  const user = window.ShopVietState && window.ShopVietState.state ? window.ShopVietState.state.user : null;
  const isLoggedIn = Boolean(user && user.isLoggedIn === true);
  const adminBalEl = document.getElementById('adminSessionBalanceText');
  if (adminBalEl && user) {
    adminBalEl.textContent = (Number(user.balance || 0).toLocaleString('vi-VN')) + ' Xu';
  }
  const isAdminUser = Boolean(window.ShopVietState && typeof window.ShopVietState.isAdmin === 'function' && window.ShopVietState.isAdmin());

  // Quản lý hiển thị nút Dashboard trên Header (Chỉ hiện khi đã đăng nhập)
  const dashboardLinkBtn = document.getElementById('header-dashboard-link');
  if (dashboardLinkBtn) {
    if (isLoggedIn) {
      dashboardLinkBtn.classList.remove('hidden');
    } else {
      dashboardLinkBtn.classList.add('hidden');
    }
  }

  // Cập nhật ẩn/hiển thị cổng Portal Admin trên Header và Footer (Chỉ thaitraicau123@gmail.com)
  const adminHeaderBtn = document.getElementById('adminPortalHeaderBtn');
  if (adminHeaderBtn) {
    if (isAdminUser) {
      adminHeaderBtn.classList.remove('hidden');
      adminHeaderBtn.classList.add('hidden', 'sm:inline-flex');
    } else {
      adminHeaderBtn.classList.add('hidden');
      adminHeaderBtn.classList.remove('sm:inline-flex');
    }
  }
  const adminFooterBtn = document.getElementById('adminPortalFooterBtn');
  if (adminFooterBtn) {
    if (isAdminUser) {
      adminFooterBtn.classList.remove('hidden');
    } else {
      adminFooterBtn.classList.add('hidden');
    }
  }

  if (!isLoggedIn) {
    // ==================== TRẠNG THÁI 1: KHÁCH VÃNG LAI (CHƯA ĐĂNG NHẬP) ====================
    container.innerHTML = `
      <div class="flex items-center gap-1 sm:gap-2">
        <button type="button" onclick="if(window.openDepositModal) window.openDepositModal(); else if(window.ShopVietViews && window.ShopVietViews.modal) window.ShopVietViews.modal.openDepositModal();" class="px-2 py-2 sm:px-3 text-[11px] sm:text-xs font-semibold text-[#0071E3] dark:text-[#3B9EFF] bg-[#0071E3]/8 hover:bg-[#0071E3]/14 border border-[#0071E3]/25 rounded-lg transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap" title="Nạp Xu VietQR MBBank 0986019623">
          <span>Nạp Xu</span>
        </button>
        <button id="headerLoginBtn" type="button" aria-label="Đăng nhập tài khoản" class="px-2.5 py-2 sm:px-3.5 text-xs sm:text-sm font-semibold text-[#1D1D1F] hover:bg-slate-100 dark:text-[#F5F5F7] dark:hover:bg-white/10 rounded-lg border border-slate-900/10 dark:border-white/10 bg-white dark:bg-[#111520] transition-colors cursor-pointer select-none flex items-center gap-1.5 whitespace-nowrap" title="Đăng nhập">
          <svg class="w-4 h-4 shrink-0 text-[#525866] dark:text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
          </svg>
          <span class="hidden md:inline">Đăng nhập</span>
        </button>
        <button id="headerRegisterBtn" type="button" aria-label="Đăng ký tài khoản" class="hidden sm:inline-flex lg-btn-primary rounded-lg px-2.5 py-2 sm:px-3.5 items-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer select-none whitespace-nowrap" title="Đăng ký">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 8v6M22 11h-6"/>
          </svg>
          <span class="hidden md:inline">Đăng ký</span>
        </button>
      </div>
    `;

    const loginBtn = document.getElementById('headerLoginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.ShopVietState.navigate('login', { mode: 'login' });
      });
    }

    const registerBtn = document.getElementById('headerRegisterBtn');
    if (registerBtn) {
      registerBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.ShopVietState.navigate('login', { mode: 'register' });
      });
    }
  } else {
    // ==================== TRẠNG THÁI 2: ĐÃ ĐĂNG NHẬP ====================
    const displayName = user.name || 'Bùi Thái';
    const email = user.email || 'thaitraicau123@gmail.com';
    const avatarChar = (user.avatar && user.avatar.length <= 2) ? user.avatar : displayName.charAt(0).toUpperCase();

    container.innerHTML = `
      <div class="relative flex items-center gap-1.5 sm:gap-2 shrink-0">
        <!-- Số dư Ví Xu Cá Nhân & Nút Nạp Xu 1-Chạm -->
        <div class="flex items-center gap-1 sm:gap-1.5 p-1 rounded-lg bg-[#0071E3]/8 text-[#0071E3] dark:text-[#60A5FA] border border-[#0071E3]/25 text-xs font-semibold font-mono shrink-0">
          <div onclick="if(window.ShopVietState && typeof window.ShopVietState.syncTopupsFromCloud === 'function'){ window.ShopVietState.syncTopupsFromCloud(true); } else { window.ShopVietState.navigate('dashboard', { tab: 'wallet' }); }" class="flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 cursor-pointer hover:bg-[#0071E3]/15 rounded-md transition-colors select-none" title="Đồng bộ số dư mới nhất">
            <span id="headerUserBalanceText" class="tabular-nums font-bold">${Number(user.balance || 0).toLocaleString('vi-VN')} Xu</span>
          </div>
          <button type="button" onclick="if(window.ShopVietViews && window.ShopVietViews.modal && typeof window.ShopVietViews.modal.openDepositModal === 'function'){ window.ShopVietViews.modal.openDepositModal(); } else { window.ShopVietState.navigate('dashboard', { tab: 'wallet' }); }" class="px-2 py-0.5 rounded-md bg-[#0071E3] hover:bg-[#0062C4] text-white text-[10px] font-bold uppercase transition-colors cursor-pointer shrink-0" title="Nạp thêm Xu VietQR">
            + Nạp
          </button>
        </div>

        <!-- Nút User Profile Badge (Click mở Dropdown) -->
        <button id="headerUserMenuBtn" type="button" class="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-1.5 sm:pr-2.5 rounded-lg border border-slate-900/10 dark:border-white/10 bg-white dark:bg-[#111520] hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-pointer group shrink-0">
          <div class="w-7 h-7 rounded-md bg-[#0071E3] text-white font-bold text-xs flex items-center justify-center shrink-0">
            ${avatarChar}
          </div>
          <span class="text-xs sm:text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] max-w-[80px] sm:max-w-[120px] truncate select-none hidden sm:inline">
            ${displayName}
          </span>
          <svg id="userMenuChevron" class="w-3.5 h-3.5 text-[#525866] dark:text-[#9CA3AF] transition-transform duration-150 shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <!-- Dropdown Menu Tài Khoản -->
        <div id="headerUserDropdown" class="hidden absolute right-0 top-full mt-2 w-60 rounded-xl lg-glass-elevated py-2 z-50">
          
          <!-- Thông tin User tóm tắt -->
          <div class="px-4 py-2.5 border-b border-slate-200/70 dark:border-white/10">
            <div class="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">Bùi Thái Studio Member</div>
            <p class="text-xs font-bold text-slate-900 dark:text-white truncate">${displayName}</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${email}</p>
          </div>

          <!-- Ví Xu Cá Nhân -->
          <div class="px-4 py-2.5 bg-[#0071E3]/5 border-b border-slate-200/70 dark:border-white/10 flex items-center justify-between">
            <div onclick="if(window.ShopVietState && typeof window.ShopVietState.syncTopupsFromCloud === 'function'){ window.ShopVietState.syncTopupsFromCloud(true); }" class="cursor-pointer group" title="Bấm để đồng bộ số dư">
              <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                Số dư Ví Xu
              </span>
              <p class="text-sm font-mono font-bold tabular-nums text-[#0071E3] dark:text-[#60A5FA]">${Number(user.balance || 0).toLocaleString('vi-VN')} Xu</p>
            </div>
            <button onclick="if(window.ShopVietViews && window.ShopVietViews.modal && typeof window.ShopVietViews.modal.openDepositModal === 'function'){ window.ShopVietViews.modal.openDepositModal(); } else { window.ShopVietState.navigate('dashboard', { tab: 'wallet' }); }" class="px-2.5 py-1 rounded-lg bg-[#0071E3] hover:bg-[#005BB5] text-white font-semibold text-[10px] transition-colors cursor-pointer">
              + Nạp Xu
            </button>
          </div>

          <!-- Các chức năng Menu -->
          <div class="py-1 text-xs">
            <button id="dropdownDashboardBtn" type="button" class="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/5 flex items-center gap-2.5 transition-colors cursor-pointer font-medium">
              <svg class="w-4 h-4 text-[#0071E3] dark:text-[#3B9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              <span>Dashboard (Tổng quan)</span>
            </button>

            <button id="dropdownProfileBtn" type="button" class="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/5 flex items-center gap-2.5 transition-colors cursor-pointer">
              <svg class="w-4 h-4 text-[#0071E3] dark:text-[#3B9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Trang cá nhân</span>
            </button>

            <button id="dropdownOrdersBtn" type="button" class="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/5 flex items-center gap-2.5 transition-colors cursor-pointer">
              <svg class="w-4 h-4 text-[#0071E3] dark:text-[#3B9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span>Đơn hàng của tôi</span>
            </button>

            <button type="button" onclick="if(window.ShopVietViews && window.ShopVietViews.modal) window.ShopVietViews.modal.openPolicy('refund');" class="w-full px-4 py-2 text-left text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2.5 transition-colors cursor-pointer font-medium">
              <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <span>Chính sách & Hoàn tiền</span>
            </button>

            ${isAdminUser ? `
            <button id="dropdownAdminBtn" type="button" class="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/5 flex items-center gap-2.5 transition-colors cursor-pointer">
              <svg class="w-4 h-4 text-[#0071E3] dark:text-[#3B9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span>Portal Admin</span>
            </button>
            ` : ''}
          </div>

          <!-- Đăng xuất -->
          <div class="pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <button id="dropdownLogoutBtn" type="button" class="w-full px-4 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 font-medium transition-colors cursor-pointer">
              <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" x2="9" y1="12" y2="12"/>
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>

        </div>
      </div>
    `;

    // Gắn sự kiện các nút
    const userMenuBtn = document.getElementById('headerUserMenuBtn');
    const userDropdown = document.getElementById('headerUserDropdown');
    const chevron = document.getElementById('userMenuChevron');
    const quickDashboardBtn = document.getElementById('headerDashboardQuickBtn');

    if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isHidden = userDropdown.classList.contains('hidden');
        if (isHidden) {
          userDropdown.classList.remove('hidden');
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        } else {
          userDropdown.classList.add('hidden');
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      });
    }

    if (quickDashboardBtn) {
      quickDashboardBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.ShopVietState.navigate('dashboard');
      });
    }

    // Các mục bên trong Dropdown
    const dashboardDropdownBtn = document.getElementById('dropdownDashboardBtn');
    const profileBtn = document.getElementById('dropdownProfileBtn');
    const ordersBtn = document.getElementById('dropdownOrdersBtn');
    const adminBtn = document.getElementById('dropdownAdminBtn');
    const logoutBtn = document.getElementById('dropdownLogoutBtn');

    if (dashboardDropdownBtn) {
      dashboardDropdownBtn.addEventListener('click', function () {
        if (userDropdown) userDropdown.classList.add('hidden');
        window.ShopVietState.navigate('dashboard', { tab: 'overview' });
      });
    }

    if (profileBtn) {
      profileBtn.addEventListener('click', function () {
        if (userDropdown) userDropdown.classList.add('hidden');
        window.ShopVietState.navigate('dashboard', { tab: 'profile' });
      });
    }

    if (ordersBtn) {
      ordersBtn.addEventListener('click', function () {
        if (userDropdown) userDropdown.classList.add('hidden');
        window.ShopVietState.navigate('dashboard', { tab: 'orders' });
      });
    }

    if (adminBtn) {
      adminBtn.addEventListener('click', function () {
        if (userDropdown) userDropdown.classList.add('hidden');
        if (window.ShopVietViews && window.ShopVietViews.admin) {
          window.ShopVietState.navigate('admin');
        } else {
          window.ShopVietState.navigate('dashboard', { tab: 'overview' });
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        if (userDropdown) userDropdown.classList.add('hidden');
        window.ShopVietState.logout();
      });
    }

    // Lắng nghe click ngoài document để đóng dropdown
    document.addEventListener('click', function (e) {
      if (userDropdown && !userDropdown.classList.contains('hidden')) {
        if (!container.contains(e.target)) {
          userDropdown.classList.add('hidden');
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      }
    });
  }

  // Tái tạo icon nếu có
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}
