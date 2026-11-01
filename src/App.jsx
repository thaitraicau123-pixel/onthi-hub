import React, { useState, useEffect, lazy, Suspense } from 'react';
import MarketNavbar from './components/MarketNavbar';
import PromptEditorialDeck from './components/PromptEditorialDeck';
import ThemeAtmosphereBackground from './components/ThemeAtmosphereBackground';
import Footer from './components/Footer';

// Lazy loaded views
const MarketplaceView = lazy(() => import('./views/MarketplaceView'));
const SkillsArmoryView = lazy(() => import('./views/SkillsArmoryView'));
const PromptStudioView = lazy(() => import('./views/PromptStudioView'));
const LibraryView = lazy(() => import('./views/LibraryView'));
const WalletView = lazy(() => import('./views/WalletView'));
const AdminView = lazy(() => import('./views/AdminView'));

// Lazy loaded interactive modals
const PaymentModal = lazy(() => import('./components/PaymentModal'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const BlindBoxModal = lazy(() => import('./components/BlindBoxModal'));
const SellDeckModal = lazy(() => import('./components/SellDeckModal'));
const CommandPaletteModal = lazy(() => import('./components/CommandPaletteModal'));
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center animate-fade-in">
      <div className="bg-white dark:bg-stone-900 px-6 py-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-stone-200 dark:border-stone-800">
        <div className="w-5 h-5 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin"></div>
        <span className="text-xs font-semibold text-stone-900 dark:text-white font-mono">Đang mở...</span>
      </div>
    </div>
  );
}

import { COURSES_DATA } from './data/coursesData';
import { getMarketplaceDecks } from './data/marketplaceData';
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
import { playSound, playSuccess } from './utils/soundEngine';
import { isUserAdmin } from './utils/adminGuard';
import {
  getSelectedTheme,
  applyTheme,
  subscribeToTheme,
  getSleepMode,
  subscribeToSleepMode,
  toggleSleepMode
} from './utils/themeManager';
import confetti from 'canvas-confetti';
import { CheckCircle2, Tv } from 'lucide-react';

export default function App() {
  // ─── 1. CHẾ ĐỘ 2-IN-1: 'slide' (Trình Chiếu Lookbook 60fps) | 'scroll' (Chợ Prompts Cuộn) ───
  const [viewMode, setViewMode] = useState('scroll');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Active Tab in Scroll Mode: 'marketplace' | 'skills' | 'studio' | 'library' | 'wallet' | 'admin'
  const [activeTab, setActiveTab] = useState('marketplace');

  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(20);
  const [marketplaceDecks, setMarketplaceDecks] = useState(() => getMarketplaceDecks());

  // Modals
  const [activePaymentItem, setActivePaymentItem] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBlindBoxOpen, setIsBlindBoxOpen] = useState(false);
  const [activeSellCourse, setActiveSellCourse] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentTheme, setCurrentTheme] = useState(() => getSelectedTheme());
  const [sleepMode, setSleepMode] = useState(() => getSleepMode());
  const [isDirectChatOpen, setIsDirectChatOpen] = useState(false);
  const [activeShareAchievement, setActiveShareAchievement] = useState(null);

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

    // Hotkeys:
    // 1. Ctrl + K / Cmd + K opens Spotlight Command Palette
    // 2. Ctrl + Shift + A toggles Admin tab
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActiveTab((prev) => (prev === 'admin' ? 'marketplace' : 'admin'));
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

  const handleToggleTheme = () => {
    toggleSleepMode();
  };

  // Switch to Scroll View
  const handleSwitchToScroll = (targetCategory = null) => {
    setViewMode('scroll');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (targetCategory === 'skills') {
      setActiveTab('skills');
    } else {
      setActiveTab('marketplace');
    }
  };

  // Switch to Lookbook Deck View
  const handleSwitchToDeck = (slideIndex = 0) => {
    setCurrentSlide(slideIndex);
    setViewMode('slide');
    window.scrollTo({ top: 0, behavior: 'instant' });
    showToast('Đang mở Chế Độ Trình Chiếu Lookbook 60fps!');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative text-stone-900 dark:text-stone-100 bg-[#fbf9f5] dark:bg-stone-950 cream-grid">
      
      {/* ─── ATMOSPHERE BACKGROUND ACCENT ─── */}
      <ThemeAtmosphereBackground currentTheme={currentTheme} />

      {/* ─── TOAST NOTIFICATION ─── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-stone-900/95 dark:bg-stone-800/95 text-white shadow-2xl border border-white/10 backdrop-blur-xl animate-studio-rise text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          1. CHẾ ĐỘ SLIDE TRÌNH CHIẾU LOOKBOOK (BÙI THÁI STUDIO)
         ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'slide' ? (
        <PromptEditorialDeck
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          onSwitchToScroll={handleSwitchToScroll}
          onNotify={showToast}
          onSelectCategory={(cat) => {
            handleSwitchToScroll(cat);
          }}
        />
      ) : (
        /* ══════════════════════════════════════════════════════════════════════
            2. CHẾ ĐỘ CUỘN CHỢ KHÁM PHÁ (STREAMLINED UNIFIED MARKETPLACE)
           ══════════════════════════════════════════════════════════════════════ */
        <div className="flex-1 flex flex-col min-h-screen relative z-10 animate-studio-rise">
          
          {/* TOPBAR NAVIGATION BAR */}
          <MarketNavbar
            activeTab={activeTab}
            onSwitchTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            walletBalance={walletBalance}
            onOpenWallet={() => setActiveTab('wallet')}
            onSwitchToDeck={() => handleSwitchToDeck(0)}
            sleepMode={sleepMode}
            onToggleTheme={handleToggleTheme}
            onShowToast={showToast}
          />

          {/* MAIN PAGE CANVAS */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Suspense fallback={<ViewLoadingFallback />}>
              
              {/* TAB 1: CHỢ PROMPTS */}
              {activeTab === 'marketplace' && (
                <MarketplaceView
                  user={user}
                  marketplaceDecks={marketplaceDecks}
                  onOpenCreateDeck={() => setActiveTab('studio')}
                  onOpenFlashcardSample={(sampleDeck) => {
                    showToast(`Prompt: ${sampleDeck.title}`);
                  }}
                  onBalanceUpdated={refreshState}
                  onOpenWallet={() => setActiveTab('wallet')}
                  onOpenBlindBox={() => setIsBlindBoxOpen(true)}
                  onOpenDirectChat={(partner) => {
                    setIsDirectChatOpen(true);
                  }}
                  onShowToast={showToast}
                />
              )}

              {/* TAB 2: KHO 238+ AI SKILLS */}
              {activeTab === 'skills' && (
                <SkillsArmoryView
                  onShowToast={showToast}
                />
              )}

              {/* TAB 3: PROMPT STUDIO & IDEATOR */}
              {activeTab === 'studio' && (
                <PromptStudioView
                  onShowToast={showToast}
                  onSwitchTab={setActiveTab}
                />
              )}

              {/* TAB 4: KHO CỦA TÔI */}
              {activeTab === 'library' && (
                <LibraryView
                  purchasedCourses={purchasedCourses}
                  customDecks={[]}
                  onOpenFlashcardCourse={(c) => {
                    showToast(`Mở prompt: ${c.title}`);
                  }}
                  onOpenSellCourse={(c) => setActiveSellCourse(c)}
                  onShowToast={showToast}
                  onSwitchTab={setActiveTab}
                  onOpenDirectChat={() => setIsDirectChatOpen(true)}
                  onOpenShareAchievement={(data) => setActiveShareAchievement(data)}
                />
              )}

              {/* TAB 5: VÍ XU & NẠP/RÚT */}
              {activeTab === 'wallet' && (
                <WalletView
                  walletBalance={walletBalance}
                  user={user}
                  onOpenAuth={() => setIsAuthOpen(true)}
                  onShowToast={showToast}
                  onBalanceUpdated={refreshState}
                />
              )}

              {/* TAB 6: ADMIN QUẢN TRỊ */}
              {activeTab === 'admin' && (
                <AdminView
                  user={user}
                  onCloseAdmin={() => setActiveTab('marketplace')}
                  onShowToast={showToast}
                  onBalanceUpdated={refreshState}
                  onOpenAuth={() => setIsAuthOpen(true)}
                />
              )}

            </Suspense>
          </main>

          {/* FOOTER */}
          <Footer
            currentTheme={currentTheme}
            onOpenThemePicker={() => {}}
            onSwitchTab={setActiveTab}
          />

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
              showToast('🎉 Mở khóa Prompt thành công!');
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
            onClose={() => setIsAuthOpen(false)}
            onSuccess={() => {
              setIsAuthOpen(false);
              refreshState();
              showToast('🎉 Đăng nhập thành công!');
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

        {/* SELL DECK MODAL */}
        {activeSellCourse && (
          <SellDeckModal
            course={activeSellCourse}
            user={user}
            onClose={() => setActiveSellCourse(null)}
            onSellSuccess={() => {
              setActiveSellCourse(null);
              refreshState();
              showToast('🎉 Đăng bán Prompt lên Chợ thành công!');
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
              setActiveTab('marketplace');
            }}
            onSelectTab={(tab) => {
              setIsCommandPaletteOpen(false);
              if (tab === 'slide') {
                handleSwitchToDeck(0);
              } else {
                setActiveTab(tab);
              }
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
