import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import NotionSidebar from './components/NotionSidebar';
import NotionTopbar from './components/NotionTopbar';
import HomeView from './views/HomeView';
import PromptEditorialDeck from './components/PromptEditorialDeck';
import ThemeAtmosphereBackground from './components/ThemeAtmosphereBackground';
import StudioLoadingScreen from './components/StudioLoadingScreen';
import TabTransitionOverlay from './components/TabTransitionOverlay';
import Footer from './components/Footer';

// Lazy loaded views (Zero initial bundle cost)
const MarketplaceView = lazy(() => import('./views/MarketplaceView'));
const SkillsArmoryView = lazy(() => import('./views/SkillsArmoryView'));
const PromptStudioView = lazy(() => import('./views/PromptStudioView'));
const CommunityView = lazy(() => import('./views/CommunityView'));
const LibraryView = lazy(() => import('./views/LibraryView'));
const WalletView = lazy(() => import('./views/WalletView'));
const PlansView = lazy(() => import('./views/PlansView'));
const AdminView = lazy(() => import('./views/AdminView'));

// Lazy loaded interactive modals
const LeaderboardModal = lazy(() => import('./components/LeaderboardModal'));
const PaymentModal = lazy(() => import('./components/PaymentModal'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const BlindBoxModal = lazy(() => import('./components/BlindBoxModal'));
const SellDeckModal = lazy(() => import('./components/SellDeckModal'));
const ChangelogModal = lazy(() => import('./components/ChangelogModal'));
const CommandPaletteModal = lazy(() => import('./components/CommandPaletteModal'));
const AnalyticsModal = lazy(() => import('./components/AnalyticsModal'));
const ThemePickerModal = lazy(() => import('./components/ThemePickerModal'));
const DirectChatModal = lazy(() => import('./components/DirectChatModal'));
const ShareAchievementModal = lazy(() => import('./components/ShareAchievementModal'));

function ViewLoadingFallback() {
  return (
    <div className="py-24 flex flex-col items-center justify-center space-y-3 animate-fade-in text-center">
      <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin"></div>
      <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">Đang tải...</p>
    </div>
  );
}

function ModalLoadingFallback() {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center animate-fade-in">
      <div className="bg-white dark:bg-stone-900 px-6 py-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-stone-200 dark:border-stone-800">
        <div className="w-5 h-5 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin"></div>
        <span className="text-xs font-semibold text-stone-900 dark:text-white font-mono">Đang mở...</span>
      </div>
    </div>
  );
}

import { COURSES_DATA, COMBO_PACKAGE } from './data/coursesData';
import { getMarketplaceDecks, subscribeToMarketplaceDecks } from './data/marketplaceData';
import { isChangelogUnread } from './data/changelogData';
import { getPurchasedCourses } from './utils/storage';
import { getCurrentUser } from './utils/firebaseConfig';
import {
  getWalletBalance,
  getTransactions,
  subscribeToTransactions,
  checkAndApplyApprovedTransactions,
  sendBrowserDesktopNotification,
  requestBrowserNotificationPermission
} from './utils/wallet';
import { playSound, playSuccess, playFlip } from './utils/soundEngine';
import { isUserAdmin } from './utils/adminGuard';
import {
  getSelectedTheme,
  applyTheme,
  subscribeToTheme,
  getSleepMode,
  subscribeToSleepMode
} from './utils/themeManager';
import confetti from 'canvas-confetti';
import { CheckCircle2 } from 'lucide-react';

const TAB_INFO_MAP = {
  home: { id: 'home', emoji: '⚡', label: 'Trang Chủ & Dịch Vụ Bùi Thái' },
  marketplace: { id: 'marketplace', emoji: '🏪', label: 'Chợ Prompts & Sàn C2C' },
  skills: { id: 'skills', emoji: '🤖', label: 'Kho 238+ AI Skills' },
  studio: { id: 'studio', emoji: '💡', label: 'Prompt Studio & Ideator' },
  library: { id: 'library', emoji: '📁', label: 'Kho Prompt Của Tôi' },
  community: { id: 'community', emoji: '💬', label: 'Cộng Đồng MMO & Creator' },
  wallet: { id: 'wallet', emoji: '🪙', label: 'Ví Xu PromptMMO' },
  plans: { id: 'plans', emoji: '⚡', label: 'Gói Hội Viên VIP' },
  admin: { id: 'admin', emoji: '👑', label: 'Cửa Sổ Quản Trị Hệ Thống' }
};

export default function App() {
  // ─── 1. CHẾ ĐỘ 2-IN-1: 'scroll' (Notion Workspace chuẩn onthi-hub.vercel.app) | 'slide' (Lookbook 60fps Bùi Thái Studio) ───
  const [viewMode, setViewMode] = useState('scroll');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Active Tab: 'home' | 'marketplace' | 'skills' | 'studio' | 'library' | 'community' | 'wallet' | 'plans' | 'admin'
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(20);
  const [marketplaceDecks, setMarketplaceDecks] = useState(() => getMarketplaceDecks());

  // Focused Overlay Modals
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [activePaymentItem, setActivePaymentItem] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBlindBoxOpen, setIsBlindBoxOpen] = useState(false);
  const [activeSellCourse, setActiveSellCourse] = useState(null);
  const [isChangelogOpen, setIsChangelogOpen] = useState(() => isChangelogUnread());
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentTheme, setCurrentTheme] = useState(() => getSelectedTheme());
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [sleepMode, setSleepMode] = useState(() => getSleepMode());
  const [isDirectChatOpen, setIsDirectChatOpen] = useState(false);
  const [activeShareAchievement, setActiveShareAchievement] = useState(null);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  const [targetTabInfo, setTargetTabInfo] = useState(null);

  const handleSelectTab = (newTab) => {
    if (!newTab || newTab === activeTab) return;

    playFlip();
    const info = TAB_INFO_MAP[newTab] || { id: newTab, emoji: '⚡', label: 'Không Gian Làm Việc' };
    setTargetTabInfo(info);
    setIsTabTransitioning(true);

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }

    setTimeout(() => {
      setActiveTab(newTab);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 140);

    setTimeout(() => {
      setIsTabTransitioning(false);
    }, 320);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3200);
  };

  const refreshState = () => {
    setWalletBalance(getWalletBalance());
    setPurchasedCourses(getPurchasedCourses());
    setMarketplaceDecks(getMarketplaceDecks());
    setUser(getCurrentUser());
  };

  // Sync initial state
  useEffect(() => {
    refreshState();

    applyTheme(currentTheme.id);
    const unsubTheme = subscribeToTheme((newTheme) => {
      setCurrentTheme(newTheme);
    });

    const unsubSleep = subscribeToSleepMode((mode) => {
      setSleepMode(mode);
    });

    // Notion Hotkeys:
    // 1. Ctrl + \ toggles Notion Sidebar
    // 2. Ctrl + K / Cmd + K opens Spotlight Command Palette
    // 3. Ctrl + Shift + A switches to Admin Tab
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === '\\' || e.code === 'Backslash')) {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActiveTab((prev) => (prev === 'admin' ? 'home' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Global listener for cross-device transaction approvals
    const seenTxIds = new Set();
    try {
      const initTxs = getTransactions();
      initTxs.forEach((t) => {
        if (t && t.id) seenTxIds.add(t.id);
      });
    } catch (e) {}

    const unsubTxs = subscribeToTransactions((latestTxs) => {
      const activeUser = getCurrentUser();

      const res = checkAndApplyApprovedTransactions(activeUser?.email);
      if (res.newlyCreditedCoins > 0) {
        setWalletBalance(getWalletBalance());
        playSuccess();
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
        showToast(`🎉 Lệnh nạp tiền đã được duyệt! Bạn được cộng +${res.newlyCreditedCoins} Xu vào ví.`);
      }

      const isAdmin = isUserAdmin(activeUser);
      if (isAdmin && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        requestBrowserNotificationPermission();
      }
      if (isAdmin && Array.isArray(latestTxs)) {
        const newPending = latestTxs.filter((t) => t && t.status === 'pending' && !seenTxIds.has(t.id));
        if (newPending.length > 0) {
          newPending.forEach((t) => seenTxIds.add(t.id));
          const first = newPending[0];
          const isDeposit = first.type === 'deposit';

          playSound('coin');
          showToast(`🔔 [LỆNH ${isDeposit ? 'NẠP XU' : 'RÚT TIỀN'} MỚI] ${first.userEmail || 'Creator'}: ${first.xuAmount} Xu`);

          sendBrowserDesktopNotification({
            title: `🔔 [PromptMMO] Lệnh ${isDeposit ? 'Nạp Xu' : 'Rút Tiền'} Mới: ${first.id}`,
            body: `Thành viên: ${first.userEmail || 'Chưa cung cấp'}\nSố lượng: ${first.xuAmount} Xu`,
            tag: first.id
          });
        }
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (typeof unsubTheme === 'function') unsubTheme();
      if (typeof unsubSleep === 'function') unsubSleep();
      if (typeof unsubTxs === 'function') unsubTxs();
    };
  }, []);

  // Switch to Scroll View
  const handleSwitchToScroll = (targetCategory = null) => {
    setViewMode('scroll');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (targetCategory === 'skills') {
      setActiveTab('skills');
    } else {
      setActiveTab('home');
    }
  };

  // Switch to Lookbook Deck View (Bùi Thái Studio)
  const handleSwitchToDeck = (slideIndex = 0) => {
    playFlip();
    setCurrentSlide(slideIndex);
    setViewMode('slide');
    window.scrollTo({ top: 0, behavior: 'instant' });
    showToast('Đang mở Chế Độ Trình Chiếu Lookbook 60fps (Bùi Thái Studio)!');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative text-stone-900 selection:bg-[#FF2E00] selection:text-white bg-[#fbf9f5] cream-grid">
      
      {/* ─── BÙI THÁI STUDIO HAUTE-COUTURE LOADING SCREEN TRANSITION ─── */}
      {showLoadingScreen && (
        <StudioLoadingScreen onFinish={() => setShowLoadingScreen(false)} />
      )}

      {/* ─── BÙI THÁI STUDIO TAB TRANSITION SCREEN ─── */}
      <TabTransitionOverlay
        isTransitioning={isTabTransitioning}
        targetTabInfo={targetTabInfo}
      />

      {/* ─── THEME ATMOSPHERE BACKGROUND ─── */}
      <ThemeAtmosphereBackground currentTheme={currentTheme} />

      {/* ─── TOAST NOTIFICATION ─── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-stone-900/95 dark:bg-stone-800/95 text-white shadow-2xl border border-white/10 backdrop-blur-xl animate-studio-rise text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          1. CHẾ ĐỘ SLIDE TRÌNH CHIẾU LOOKBOOK 60FPS (BÙI THÁI STUDIO)
         ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'slide' ? (
        <PromptEditorialDeck
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          onSwitchToScroll={handleSwitchToScroll}
          onNotify={showToast}
          onSelectCategory={(cat) => handleSwitchToScroll(cat)}
        />
      ) : (
        /* ══════════════════════════════════════════════════════════════════════
            2. CHẾ ĐỘ NOTION WORKSPACE (CHUẨN ONTHI-HUB.VERCEL.APP)
           ══════════════════════════════════════════════════════════════════════ */
        <div className="flex-1 flex min-h-screen relative z-10 animate-studio-rise">
          
          {/* Mobile Backdrop for Sidebar */}
          {isSidebarOpen && (
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/20 backdrop-blur-2xs md:hidden"
            />
          )}

          {/* NOTION COLLAPSIBLE SIDEBAR (LEFT) */}
          <NotionSidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            purchasedCount={purchasedCourses.length}
            walletBalance={walletBalance}
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenSearch={() => setIsCommandPaletteOpen(true)}
            currentTheme={currentTheme}
            onSwitchToDeck={() => handleSwitchToDeck(0)}
          />

          {/* RIGHT CANVAS: NOTION TOPBAR + MAIN CANVAS + FOOTER */}
          <div className="flex-1 min-w-0 flex flex-col min-h-screen bg-transparent relative z-10 transition-colors duration-500">
            
            {/* NOTION TOPBAR */}
            <NotionTopbar
              sidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              walletBalance={walletBalance}
              user={user}
              onOpenAuth={() => setIsAuthOpen(true)}
              onCheckInCompleted={refreshState}
              onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
              onOpenChangelog={() => setIsChangelogOpen(true)}
              onOpenSearch={() => setIsCommandPaletteOpen(true)}
              onOpenAnalytics={() => setIsAnalyticsOpen(true)}
              currentTheme={currentTheme}
              onOpenThemePicker={() => setIsThemePickerOpen(true)}
              isWeatherEnabled={false}
              onToggleWeather={() => {}}
              onOpenDirectChat={() => setIsDirectChatOpen(true)}
              onSwitchToDeck={() => handleSwitchToDeck(0)}
            />

            {/* MAIN NOTION PAGE CANVAS */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
              <div key={activeTab} className="animate-studio-rise">
                <Suspense fallback={<ViewLoadingFallback />}>
                
                {/* TAB 1: TRANG CHỦ & DỊCH VỤ BÙI THÁI + PROMPT THỰC CHIẾN */}
                {activeTab === 'home' && (
                  <HomeView
                    onOpenFlashcards={(c) => setActivePaymentItem(c)}
                    onBuyCourse={(c) => setActivePaymentItem(c)}
                    onBuyCombo={(combo) => setActivePaymentItem(combo)}
                    onSwitchTab={handleSelectTab}
                    onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
                    allCourses={COURSES_DATA}
                    onShowToast={showToast}
                    onOpenDirectChat={() => setIsDirectChatOpen(true)}
                  />
                )}

                {/* TAB 2: CHỢ PROMPT C2C */}
                {activeTab === 'marketplace' && (
                  <MarketplaceView
                    user={user}
                    marketplaceDecks={marketplaceDecks}
                    onOpenCreateDeck={() => handleSelectTab('studio')}
                    onOpenFlashcardSample={(sampleDeck) => {
                      showToast(`Prompt: ${sampleDeck.title}`);
                    }}
                    onBalanceUpdated={refreshState}
                    onOpenWallet={() => handleSelectTab('wallet')}
                    onOpenDirectChat={() => setIsDirectChatOpen(true)}
                    onShowToast={showToast}
                  />
                )}

                {/* TAB 3: KHO 238+ AI SKILLS & SUBAGENTS */}
                {activeTab === 'skills' && (
                  <SkillsArmoryView
                    onShowToast={showToast}
                  />
                )}

                {/* TAB 4: PROMPT STUDIO & IDEATOR SANDBOX */}
                {activeTab === 'studio' && (
                  <PromptStudioView
                    onShowToast={showToast}
                    onSwitchTab={handleSelectTab}
                  />
                )}

                {/* TAB 5: KHO PROMPT CỦA TÔI */}
                {activeTab === 'library' && (
                  <LibraryView
                    purchasedCourses={purchasedCourses}
                    allCourses={COURSES_DATA}
                    onOpenFlashcards={(c) => {
                      if (c) setActivePaymentItem(c);
                    }}
                    onOpenSellDeck={(c) => setActiveSellCourse(c)}
                    onShowToast={showToast}
                    onSwitchTab={handleSelectTab}
                    onOpenDirectChat={() => setIsDirectChatOpen(true)}
                  />
                )}

                {/* TAB 6: CỘNG ĐỒNG MMO & AI */}
                {activeTab === 'community' && (
                  <CommunityView
                    user={user}
                    onOpenAuth={() => setIsAuthOpen(true)}
                    onShowToast={showToast}
                    onBalanceUpdated={refreshState}
                    onOpenDirectChat={() => setIsDirectChatOpen(true)}
                    onOpenShareAchievement={(data) => setActiveShareAchievement(data)}
                  />
                )}

                {/* TAB 7: VÍ XU & NẠP TIỀN VIETQR */}
                {activeTab === 'wallet' && (
                  <WalletView
                    walletBalance={walletBalance}
                    user={user}
                    onOpenAuth={() => setIsAuthOpen(true)}
                    onShowToast={showToast}
                    onBalanceUpdated={refreshState}
                  />
                )}

                {/* TAB 8: GÓI HỘI VIÊN VIP */}
                {activeTab === 'plans' && (
                  <PlansView
                    user={user}
                    walletBalance={walletBalance}
                    onOpenAuth={() => setIsAuthOpen(true)}
                    onOpenWallet={() => handleSelectTab('wallet')}
                    onShowToast={showToast}
                    onBalanceUpdated={refreshState}
                  />
                )}

                {/* TAB 9: QUẢN TRỊ VIÊN ADMIN */}
                {activeTab === 'admin' && (
                  <AdminView
                    user={user}
                    onCloseAdmin={() => handleSelectTab('home')}
                    onShowToast={showToast}
                    onBalanceUpdated={refreshState}
                    onOpenAuth={() => setIsAuthOpen(true)}
                  />
                )}

              </Suspense>
              </div>
            </main>

            {/* NOTION FOOTER */}
            <Footer
              currentTheme={currentTheme}
              onOpenAdmin={() => handleSelectTab('admin')}
              onSwitchTab={handleSelectTab}
            />

          </div>
        </div>
      )}

      {/* ─── MODALS ─── */}
      <Suspense fallback={<ModalLoadingFallback />}>
        {/* PAYMENT MODAL */}
        {activePaymentItem && (
          <PaymentModal
            item={activePaymentItem}
            walletBalance={walletBalance}
            user={user}
            onClose={() => setActivePaymentItem(null)}
            onSuccess={() => {
              setActivePaymentItem(null);
              refreshState();
              showToast('🎉 Mở khóa thành công!');
            }}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenWallet={() => {
              setActivePaymentItem(null);
              setActiveTab('wallet');
            }}
          />
        )}

        {/* AUTH MODAL */}
        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            user={user}
            onAuthChange={(newUser) => {
              setUser(newUser);
              refreshState();
            }}
            onClose={() => setIsAuthOpen(false)}
            onSuccess={() => {
              setIsAuthOpen(false);
              refreshState();
              showToast('🎉 Đăng nhập thành công!');
            }}
            onOpenPricing={() => {
              setIsAuthOpen(false);
              setIsPricingOpen(true);
            }}
            onOpenWallet={() => {
              setIsAuthOpen(false);
              setActiveTab('wallet');
            }}
            onOpenAdmin={() => {
              setIsAuthOpen(false);
              setActiveTab('admin');
            }}
          />
        )}

        {/* BLIND BOX MODAL (HỘP MÙ MAY MẮN) */}
        {isBlindBoxOpen && (
          <BlindBoxModal
            isOpen={isBlindBoxOpen}
            onClose={() => setIsBlindBoxOpen(false)}
            walletBalance={walletBalance}
            onOpenWallet={() => {
              setIsBlindBoxOpen(false);
              setActiveTab('wallet');
            }}
            onRewardReceived={(reward) => {
              refreshState();
              showToast(`🎁 Nhận thưởng Hộp Mù: ${reward.label || 'Quà đặc biệt'}!`);
            }}
          />
        )}

        {/* LEADERBOARD MODAL (BẢNG VÀNG DOANH THU) */}
        {isLeaderboardOpen && (
          <LeaderboardModal
            isOpen={isLeaderboardOpen}
            onClose={() => setIsLeaderboardOpen(false)}
            user={user}
          />
        )}

        {/* CHANGELOG MODAL */}
        {isChangelogOpen && (
          <ChangelogModal
            isOpen={isChangelogOpen}
            onClose={() => setIsChangelogOpen(false)}
          />
        )}

        {/* SELL DECK MODAL */}
        {activeSellCourse && (
          <SellDeckModal
            course={activeSellCourse}
            user={user}
            onClose={() => setActiveSellCourse(null)}
            onSellSuccess={() => {
              setActiveSellCourse(null);
              refreshState();
              showToast('🎉 Đăng bán thành công!');
            }}
          />
        )}

        {/* COMMAND PALETTE MODAL (CTRL + K) */}
        {isCommandPaletteOpen && (
          <CommandPaletteModal
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            courses={COURSES_DATA}
            onSelectCourse={(c) => {
              setIsCommandPaletteOpen(false);
              setActivePaymentItem(c);
            }}
            onSelectTab={(tab) => {
              setIsCommandPaletteOpen(false);
              if (tab === 'slide') {
                handleSwitchToDeck(0);
              } else {
                handleSelectTab(tab);
              }
            }}
          />
        )}

        {/* ANALYTICS MODAL */}
        {isAnalyticsOpen && (
          <AnalyticsModal
            isOpen={isAnalyticsOpen}
            onClose={() => setIsAnalyticsOpen(false)}
          />
        )}

        {/* THEME PICKER MODAL */}
        {isThemePickerOpen && (
          <ThemePickerModal
            isOpen={isThemePickerOpen}
            onClose={() => setIsThemePickerOpen(false)}
            currentTheme={currentTheme}
            onSelectTheme={(theme) => {
              setCurrentTheme(theme);
              applyTheme(theme.id);
              showToast(`Đã áp dụng chủ đề: ${theme.name}`);
            }}
          />
        )}

        {/* DIRECT CHAT MODAL */}
        {isDirectChatOpen && (
          <DirectChatModal
            isOpen={isDirectChatOpen}
            onClose={() => setIsDirectChatOpen(false)}
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            onShowToast={showToast}
          />
        )}

        {/* SHARE ACHIEVEMENT MODAL */}
        {activeShareAchievement && (
          <ShareAchievementModal
            achievement={activeShareAchievement}
            onClose={() => setActiveShareAchievement(null)}
            onShowToast={showToast}
          />
        )}
      </Suspense>

    </div>
  );
}
