import React, { useState, useEffect, lazy, Suspense } from 'react';
import NotionSidebar from './components/NotionSidebar';
import NotionTopbar from './components/NotionTopbar';
import HomeView from './views/HomeView';
import ThemeAtmosphereBackground from './components/ThemeAtmosphereBackground';
import ThemeWeatherCanvas from './components/ThemeWeatherCanvas';
import PomodoroTimerWidget from './components/PomodoroTimerWidget';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import Footer from './components/Footer';

// Lazy loaded views (Zero initial bundle cost)
const MarketplaceView = lazy(() => import('./views/MarketplaceView'));
const CommunityView = lazy(() => import('./views/CommunityView'));
const CreateStudioView = lazy(() => import('./views/CreateStudioView'));
const LibraryView = lazy(() => import('./views/LibraryView'));
const WalletView = lazy(() => import('./views/WalletView'));
const PlansView = lazy(() => import('./views/PlansView'));
const AdminView = lazy(() => import('./views/AdminView'));

// Lazy loaded interactive modals (Loaded on-demand only when opened)
const FlashcardModal = lazy(() => import('./components/FlashcardModal'));
const QuizModal = lazy(() => import('./components/QuizModal'));
const MatchGameModal = lazy(() => import('./components/MatchGameModal'));
const LeaderboardModal = lazy(() => import('./components/LeaderboardModal'));
const PaymentModal = lazy(() => import('./components/PaymentModal'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const BlindBoxModal = lazy(() => import('./components/BlindBoxModal'));
const PassDeckModal = lazy(() => import('./components/PassDeckModal'));
const SellDeckModal = lazy(() => import('./components/SellDeckModal'));
const MistakeNotebookModal = lazy(() => import('./components/MistakeNotebookModal'));
const ChangelogModal = lazy(() => import('./components/ChangelogModal'));
const CommandPaletteModal = lazy(() => import('./components/CommandPaletteModal'));
const AnalyticsModal = lazy(() => import('./components/AnalyticsModal'));
const ThemePickerModal = lazy(() => import('./components/ThemePickerModal'));
const TargetStudyClockModal = lazy(() => import('./components/TargetStudyClockModal'));
const CheatSheetModal = lazy(() => import('./components/CheatSheetModal'));
const VirtualStudyRoomModal = lazy(() => import('./components/VirtualStudyRoomModal'));
const DirectChatModal = lazy(() => import('./components/DirectChatModal'));

function ViewLoadingFallback() {
  return (
    <div className="py-24 flex flex-col items-center justify-center space-y-3 animate-fade-in text-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#2383e2]/30 border-t-[#2383e2] animate-spin"></div>
      <p className="text-xs text-[#787774] dark:text-slate-400 font-medium">Đang tải...</p>
    </div>
  );
}

function ModalLoadingFallback() {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center animate-fade-in">
      <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-[#e9e9e8] dark:border-white/10">
        <div className="w-5 h-5 rounded-full border-2 border-[#2383e2]/30 border-t-[#2383e2] animate-spin"></div>
        <span className="text-xs font-semibold text-[#37352f] dark:text-white">Đang mở...</span>
      </div>
    </div>
  );
}

import { COURSES_DATA, COMBO_PACKAGE } from './data/coursesData';
import { getMarketplaceDecks, subscribeToMarketplaceDecks } from './data/marketplaceData';
import { isChangelogUnread } from './data/changelogData';
import { getPurchasedCourses, isCoursePurchased } from './utils/storage';
import { getCurrentUser } from './utils/firebaseConfig';
import {
  getWalletBalance,
  subscribeToTransactions,
  checkAndApplyApprovedTransactions
} from './utils/wallet';
import { playSound } from './utils/storage';
import { isUserAdmin, PRIMARY_ADMIN_EMAIL } from './utils/adminGuard';
import {
  getSelectedTheme,
  applyTheme,
  subscribeToTheme,
  isWeatherEffectsEnabled,
  setWeatherEffectsEnabled,
  subscribeToWeatherToggle,
  getSleepMode,
  subscribeToSleepMode
} from './utils/themeManager';
import { parseUrlParameters } from './utils/shareLink';
import confetti from 'canvas-confetti';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Current Active Tab: 'home' | 'marketplace' | 'community' | 'create' | 'library' | 'wallet' | 'plans' | 'admin'
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(20);
  const [customDecks, setCustomDecks] = useState([]);
  const [marketplaceDecks, setMarketplaceDecks] = useState(() => getMarketplaceDecks());

  // Focused Overlay Modals
  const [activeFlashcardCourse, setActiveFlashcardCourse] = useState(null);
  const [activeQuizCourse, setActiveQuizCourse] = useState(null);
  const [activeMatchGameCourse, setActiveMatchGameCourse] = useState(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [activePaymentItem, setActivePaymentItem] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBlindBoxOpen, setIsBlindBoxOpen] = useState(false);
  const [activePassCourse, setActivePassCourse] = useState(null);
  const [activeSellCourse, setActiveSellCourse] = useState(null);
  const [isMistakesNotebookOpen, setIsMistakesNotebookOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(() => isChangelogUnread());
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentTheme, setCurrentTheme] = useState(() => getSelectedTheme());
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [isWeatherEnabled, setIsWeatherEnabled] = useState(() => isWeatherEffectsEnabled());
  const [sleepMode, setSleepMode] = useState(() => getSleepMode());
  const [isTargetClockOpen, setIsTargetClockOpen] = useState(false);
  const [activeCheatSheetCourse, setActiveCheatSheetCourse] = useState(null);
  const [isStudyRoomOpen, setIsStudyRoomOpen] = useState(false);
  const [isDirectChatOpen, setIsDirectChatOpen] = useState(false);
  const [directChatPartner, setDirectChatPartner] = useState(null);
  const [directChatAttachDeck, setDirectChatAttachDeck] = useState(null);
  const [initialCardIndex, setInitialCardIndex] = useState(null);

  const handleOpenDirectChat = (partner = null, attachDeck = null) => {
    setDirectChatPartner(partner);
    setDirectChatAttachDeck(attachDeck);
    setIsDirectChatOpen(true);
  };

  // Sync initial state
  useEffect(() => {
    setPurchasedCourses(getPurchasedCourses());
    setUser(getCurrentUser());
    setWalletBalance(getWalletBalance());
    setMarketplaceDecks(getMarketplaceDecks());

    // Initialize & subscribe to theme changes
    applyTheme(currentTheme.id);
    const unsubTheme = subscribeToTheme((newTheme) => {
      setCurrentTheme(newTheme);
    });

    const unsubWeather = subscribeToWeatherToggle((enabled) => {
      setIsWeatherEnabled(enabled);
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
    const unsubTxs = subscribeToTransactions(() => {
      const activeUser = getCurrentUser();
      const res = checkAndApplyApprovedTransactions(activeUser?.email);
      if (res.newlyCreditedCoins > 0) {
        setWalletBalance(getWalletBalance());
        playSound('success');
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
        showToast(`🎉 Lệnh nạp tiền đã được Admin duyệt! Bạn được cộng +${res.newlyCreditedCoins} Xu vào ví.`);
      }
    });

    // Global real-time listener for C2C marketplace decks (Firebase Firestore + Cloud Relay)
    const unsubMarket = subscribeToMarketplaceDecks((decks) => {
      setMarketplaceDecks(decks);
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (typeof unsubTxs === 'function') unsubTxs();
      if (typeof unsubMarket === 'function') unsubMarket();
      if (typeof unsubTheme === 'function') unsubTheme();
      if (typeof unsubWeather === 'function') unsubWeather();
      if (typeof unsubSleep === 'function') unsubSleep();
    };
  }, []);

  const refreshState = () => {
    setWalletBalance(getWalletBalance());
    setPurchasedCourses(getPurchasedCourses());
    setMarketplaceDecks(getMarketplaceDecks());
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handlePaymentSuccess = (itemId) => {
    refreshState();
    showToast('🎉 Mở khóa thành công! Bạn có thể vào "Tủ Của Tôi" để học ngay.');
  };

  const handleDeckCreated = (newDeck) => {
    setCustomDecks((prev) => [newDeck, ...prev]);
    showToast(`🎉 Tạo thành công bộ thẻ "${newDeck.title}"!`);
    refreshState();
  };

  const allAvailableCourses = [...customDecks, ...marketplaceDecks, ...COURSES_DATA];

  // Tự động nhận diện đường dẫn chia sẻ bộ thẻ Flashcard (?deck=...&card=...&tab=...)
  useEffect(() => {
    const { deckId, cardIndex, tab, chatWith } = parseUrlParameters();

    if (tab && ['home', 'marketplace', 'community', 'create', 'library', 'wallet', 'plans', 'admin'].includes(tab)) {
      setActiveTab(tab);
    }

    if (deckId) {
      const allDecks = [...customDecks, ...marketplaceDecks, ...COURSES_DATA];
      const targetDeck = allDecks.find((c) => String(c.id) === String(deckId));
      if (targetDeck) {
        setInitialCardIndex(cardIndex);
        setActiveFlashcardCourse(targetDeck);
        playSound('flip');
        showToast(`🔗 Đang mở bộ thẻ được chia sẻ: ${targetDeck.title}`);
      }
    }

    if (chatWith) {
      setIsDirectChatOpen(true);
    }

    const handlePopState = () => {
      const { deckId: popDeckId, cardIndex: popCardIndex } = parseUrlParameters();
      if (popDeckId) {
        const allDecks = [...customDecks, ...marketplaceDecks, ...COURSES_DATA];
        const targetDeck = allDecks.find((c) => String(c.id) === String(popDeckId));
        if (targetDeck) {
          setInitialCardIndex(popCardIndex);
          setActiveFlashcardCourse(targetDeck);
        }
      } else {
        setActiveFlashcardCourse(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [marketplaceDecks.length, customDecks.length]);

  return (
    <div 
      className={`min-h-screen ${currentTheme.bgClass} ${currentTheme.textClass} flex flex-col md:flex-row antialiased selection:bg-[#cce5ff] selection:text-[#37352f] transition-colors duration-500 relative`}
      style={{ backgroundImage: currentTheme.wallpaperGlow }}
    >
      {/* 4K UHD Photorealistic Wallpaper Background (e.g. Super Mario 3D, Kimi no Na wa, Cyberpunk 4K) */}
      {currentTheme.bgImageUrl && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-all duration-700 select-none"
          style={{ backgroundImage: `url(${currentTheme.bgImageUrl})` }}
        >
          {/* Calibrated Overlay for Crisp Contrast & Pristine Text Readability in both Sleep Mode & Day Mode */}
          <div className={`absolute inset-0 ${currentTheme.bgOverlayClass || 'bg-black/35 backdrop-blur-[0.5px]'} ${sleepMode === 'dark' ? 'bg-slate-950/40 backdrop-blur-[1px]' : 'bg-slate-950/15'}`} />
        </div>
      )}

      {/* 60fps Particle Weather Engine (Snow, Petals, Stardust, Fireflies, Mario Stars) */}
      <ThemeWeatherCanvas weatherType={currentTheme.weatherType} isEnabled={isWeatherEnabled} />

      {/* High-Fidelity Themed Atmosphere Illustrated Artwork */}
      <ThemeAtmosphereBackground theme={currentTheme} />
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl bg-[#2e2e2e] text-white shadow-xl text-xs sm:text-sm font-semibold border border-[#4a4a4a] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Backdrop for Sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-2xs md:hidden"
        />
      )}

      {/* Notion Collapsible Sidebar (Left) */}
      <NotionSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsSidebarOpen(false);
          }
        }}
        purchasedCount={purchasedCourses.length}
        walletBalance={walletBalance}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenBlindBox={() => setIsBlindBoxOpen(true)}
        onOpenMistakes={() => setIsMistakesNotebookOpen(true)}
        onOpenChangelog={() => setIsChangelogOpen(true)}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        currentTheme={currentTheme}
        onOpenThemePicker={() => setIsThemePickerOpen(true)}
        onOpenTargetClock={() => setIsTargetClockOpen(true)}
        onOpenStudyRoom={() => setIsStudyRoomOpen(true)}
        onOpenCheatSheet={(c) => setActiveCheatSheetCourse(c || allAvailableCourses[0] || COURSES_DATA[0])}
        onOpenDirectChat={() => handleOpenDirectChat()}
      />

      {/* Right Canvas: Notion Topbar + Main Canvas + Footer (Softly Translucent to Showcase Background Artwork) */}
      <div className={`flex-1 min-w-0 flex flex-col min-h-screen bg-transparent relative z-10 transition-colors duration-500`}>
        
        {/* Notion Topbar with Breadcrumbs & Compact Utility Pills */}
        <NotionTopbar
          sidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
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
          isWeatherEnabled={isWeatherEnabled}
          onToggleWeather={() => setWeatherEffectsEnabled(!isWeatherEnabled)}
          onOpenTargetClock={() => setIsTargetClockOpen(true)}
          onOpenStudyRoom={() => setIsStudyRoomOpen(true)}
          onOpenDirectChat={() => handleOpenDirectChat()}
        />

        {/* MAIN NOTION PAGE CANVAS */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <Suspense fallback={<ViewLoadingFallback />}>
            {/* TAB 1: TRANG CHỦ / ĐỀ THI CHÍNH QUY */}
            {activeTab === 'home' && (
              <HomeView
                onOpenFlashcards={(c) => setActiveFlashcardCourse(c)}
                onOpenQuiz={(c) => setActiveQuizCourse(c)}
                onBuyCourse={(c) => setActivePaymentItem(c)}
                onBuyCombo={(combo) => setActivePaymentItem(combo)}
                onSwitchTab={setActiveTab}
                onOpenMatchGame={(c) => setActiveMatchGameCourse(c || allAvailableCourses[0])}
                onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
                onOpenBlindBox={() => setIsBlindBoxOpen(true)}
                onOpenTargetClock={() => setIsTargetClockOpen(true)}
                onOpenCheatSheet={(c) => setActiveCheatSheetCourse(c || allAvailableCourses[0] || COURSES_DATA[0])}
                onOpenStudyRoom={() => setIsStudyRoomOpen(true)}
                allCourses={allAvailableCourses}
                onShowToast={showToast}
                walletBalance={walletBalance}
                onOpenWallet={() => setActiveTab('wallet')}
              />
            )}

            {/* TAB 2: SÀN MUA BÁN C2C */}
            {activeTab === 'marketplace' && (
              <MarketplaceView
                user={user}
                marketplaceDecks={marketplaceDecks}
                onOpenCreateDeck={() => setActiveTab('create')}
                onOpenFlashcardSample={(sampleDeck) => setActiveFlashcardCourse(sampleDeck)}
                onBalanceUpdated={refreshState}
                onOpenWallet={() => setActiveTab('wallet')}
                onOpenBlindBox={() => setIsBlindBoxOpen(true)}
                onOpenDirectChat={handleOpenDirectChat}
                onShowToast={showToast}
              />
            )}

            {/* TAB 3: DIỄN ĐÀN THẢO LUẬN & HỎI ĐÁP CỘNG ĐỒNG */}
            {activeTab === 'community' && (
              <CommunityView
                user={user}
                onOpenPricing={() => {
                  setActiveTab('plans');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenDirectChat={handleOpenDirectChat}
                onShowToast={showToast}
              />
            )}

            {/* TAB 4: STUDIO TẠO THẺ AI & THỦ CÔNG */}
            {activeTab === 'create' && (
              <CreateStudioView
                user={user}
                onDeckCreated={handleDeckCreated}
                onOpenPricing={() => setActiveTab('plans')}
                onSwitchTab={setActiveTab}
              />
            )}

            {/* TAB 5: TỦ THẺ CỦA TÔI */}
            {activeTab === 'library' && (
              <LibraryView
                purchasedCourses={purchasedCourses}
                allCourses={allAvailableCourses}
                onOpenFlashcards={(c) => setActiveFlashcardCourse(c)}
                onOpenQuiz={(c) => setActiveQuizCourse(c)}
                onOpenMatchGame={(c) => setActiveMatchGameCourse(c)}
                onOpenPassDeck={(course) => setActivePassCourse(course)}
                onOpenSellDeck={(course) => setActiveSellCourse(course)}
                onOpenMistakes={() => setIsMistakesNotebookOpen(true)}
                onOpenCheatSheet={(course) => setActiveCheatSheetCourse(course)}
                onSwitchTab={setActiveTab}
                onOpenDirectChat={handleOpenDirectChat}
                onShowToast={showToast}
              />
            )}

            {/* TAB 6: VÍ XU & NẠP/RÚT TIỀN */}
            {activeTab === 'wallet' && (
              <WalletView
                user={user}
                onBalanceUpdated={refreshState}
              />
            )}

            {/* TAB 7: GÓI HỘI VIÊN PLUS / PRO / ULTRA */}
            {activeTab === 'plans' && (
              <PlansView
                onTierUpgraded={() => {
                  refreshState();
                  showToast('🎉 Nâng cấp gói thành viên thành công!');
                }}
                onPayVietQR={(planItem) => {
                  setActivePaymentItem(planItem);
                }}
                onOpenWallet={() => {
                  setActiveTab('wallet');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* TAB 8: SECRET ADMIN PORTAL (PROTECTED) */}
            {activeTab === 'admin' && (
              <AdminView
                user={user}
                onBackToHome={() => setActiveTab('home')}
                onOpenChangelog={() => setIsChangelogOpen(true)}
                onOpenDirectChat={handleOpenDirectChat}
              />
            )}
          </Suspense>
        </main>

        {/* Minimal Notion Footer */}
        <Footer onOpenAdmin={() => setActiveTab('admin')} />
      </div>

      {/* OVERLAY MODALS FOR FOCUSED INTERACTION */}
      <Suspense fallback={<ModalLoadingFallback />}>
        {/* 1. 3D Flashcard Player */}
        {activeFlashcardCourse && (
          <FlashcardModal
            course={activeFlashcardCourse}
            isPurchased={isCoursePurchased(activeFlashcardCourse.id)}
            onClose={() => {
              setActiveFlashcardCourse(null);
              setInitialCardIndex(null);
            }}
            onOpenCheatSheet={(c) => setActiveCheatSheetCourse(c)}
            onBuy={(c) => setActivePaymentItem(c)}
            initialCardIndex={initialCardIndex}
            onOpenDirectChat={handleOpenDirectChat}
          />
        )}

        {/* 2. Timed Quiz Mock Exam */}
        {activeQuizCourse && (
          <QuizModal
            course={activeQuizCourse}
            isPurchased={isCoursePurchased(activeQuizCourse.id)}
            onClose={() => setActiveQuizCourse(null)}
            onBuy={(c) => setActivePaymentItem(c)}
          />
        )}

        {/* 3. Viral Match Game (Ghép thẻ siêu tốc kiểu Quizlet) */}
        {activeMatchGameCourse && (
          <MatchGameModal
            course={activeMatchGameCourse}
            onClose={() => setActiveMatchGameCourse(null)}
          />
        )}

        {/* 4. Duolingo Leaderboard & Streak Modal */}
        {isLeaderboardOpen && (
          <LeaderboardModal
            onClose={() => setIsLeaderboardOpen(false)}
          />
        )}

        {/* 5. Coin Purchase Modal */}
        {activePaymentItem && (
          <PaymentModal
            item={activePaymentItem}
            isCombo={activePaymentItem.id === COMBO_PACKAGE.id}
            onClose={() => setActivePaymentItem(null)}
            onPaymentSuccess={handlePaymentSuccess}
            onOpenWallet={() => {
              setActivePaymentItem(null);
              setActiveTab('wallet');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToLibrary={() => {
              setActivePaymentItem(null);
              setActiveTab('library');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 6. Firebase Auth Modal */}
        {isAuthOpen && (
          <AuthModal
            user={user}
            onAuthChange={(u) => {
              setUser(u);
              refreshState();
            }}
            onClose={() => setIsAuthOpen(false)}
            onOpenPricing={() => {
              setIsAuthOpen(false);
              setActiveTab('plans');
            }}
            onOpenWallet={() => {
              setIsAuthOpen(false);
              setActiveTab('wallet');
            }}
            onOpenAdmin={() => {
              setIsAuthOpen(false);
              setActiveTab('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 8. Blind Box (Hộp Mù / Túi Mù Tri Thức) */}
        {isBlindBoxOpen && (
          <BlindBoxModal
            onClose={() => setIsBlindBoxOpen(false)}
            onRewardClaimed={() => {
              refreshState();
              showToast('🎉 Mở túi mù thành công! Phần thưởng đã được cập nhật.');
            }}
            onOpenWallet={() => {
              setIsBlindBoxOpen(false);
              setActiveTab('wallet');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToLibrary={() => {
              setIsBlindBoxOpen(false);
              setActiveTab('library');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToStudio={() => {
              setIsBlindBoxOpen(false);
              setActiveTab('create');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToPlans={() => {
              setIsBlindBoxOpen(false);
              setActiveTab('plans');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 9. Pass Lại Bộ Thẻ (C2C Resale) */}
        {activePassCourse && (
          <PassDeckModal
            course={activePassCourse}
            user={user}
            onClose={() => setActivePassCourse(null)}
            onPassSuccess={(res) => {
              refreshState();
              setActiveTab('marketplace');
              showToast(`🎉 Bộ thẻ "${res?.title || ''}" đã chính thức lên Sàn C2C!`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 10. Bán Thẻ Trực Tiếp Từ Tủ (C2C Direct Sell) */}
        {activeSellCourse && (
          <SellDeckModal
            course={activeSellCourse}
            user={user}
            onClose={() => setActiveSellCourse(null)}
            onSellSuccess={(res) => {
              refreshState();
              setActiveTab('marketplace');
              showToast(`🎉 Bộ thẻ "${res?.title || ''}" đã chính thức lên Sàn C2C!`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 11. Sổ Tay Câu Sai & Điểm Yếu (Mistake Notebook) */}
        {isMistakesNotebookOpen && (
          <MistakeNotebookModal
            onClose={() => setIsMistakesNotebookOpen(false)}
            onStartFlashcardPractice={(deck) => setActiveFlashcardCourse(deck)}
            onStartQuizPractice={(deck) => setActiveQuizCourse(deck)}
          />
        )}

        {/* 12. Bảng Tin Cập Nhật Tính Năng Mới (What's New / Changelog) */}
        {isChangelogOpen && (
          <ChangelogModal
            onClose={() => setIsChangelogOpen(false)}
            onOpenWallet={() => {
              setIsChangelogOpen(false);
              setActiveTab('wallet');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBlindBox={() => {
              setIsChangelogOpen(false);
              setIsBlindBoxOpen(true);
            }}
            onOpenAdmin={() => {
              setIsChangelogOpen(false);
              setActiveTab('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenMatchGame={(c) => {
              setIsChangelogOpen(false);
              setActiveMatchGameCourse(c || allAvailableCourses[0]);
            }}
            onOpenLibrary={() => {
              setIsChangelogOpen(false);
              setActiveTab('library');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 13. Notion Spotlight Command Palette (Ctrl+K) */}
        {isCommandPaletteOpen && (
          <CommandPaletteModal
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            allCourses={allAvailableCourses}
            purchasedCourses={purchasedCourses}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenFlashcards={(c) => setActiveFlashcardCourse(c)}
            onOpenQuiz={(c) => setActiveQuizCourse(c)}
            onOpenMatchGame={(c) => setActiveMatchGameCourse(c)}
            onOpenMistakes={() => setIsMistakesNotebookOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenBlindBox={() => setIsBlindBoxOpen(true)}
            onOpenWallet={() => {
              setActiveTab('wallet');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAnalytics={() => setIsAnalyticsOpen(true)}
            onOpenThemePicker={() => setIsThemePickerOpen(true)}
            onOpenTargetClock={() => setIsTargetClockOpen(true)}
            onOpenStudyRoom={() => setIsStudyRoomOpen(true)}
            onOpenCheatSheet={(c) => setActiveCheatSheetCourse(c || allAvailableCourses[0] || COURSES_DATA[0])}
            onOpenDirectChat={() => handleOpenDirectChat()}
          />
        )}

        {/* 14. Learning Analytics & Mastery Dashboard */}
        {isAnalyticsOpen && (
          <AnalyticsModal
            isOpen={isAnalyticsOpen}
            onClose={() => setIsAnalyticsOpen(false)}
            allCourses={allAvailableCourses}
            purchasedCourses={purchasedCourses}
            onOpenDueCards={(deck) => setActiveFlashcardCourse(deck)}
          />
        )}

        {/* 16. Messenger / Instagram Style Theme & Atmospheric Background Picker */}
        {isThemePickerOpen && (
          <ThemePickerModal
            isOpen={isThemePickerOpen}
            onClose={() => setIsThemePickerOpen(false)}
            currentTheme={currentTheme}
            onSelectTheme={(theme) => {
              setCurrentTheme(theme);
              showToast(`🎨 Đã đổi sang giao diện: ${theme.name}`);
            }}
          />
        )}

        {/* 17. Target Study Clock & Study Time History Trace Modal (Đồng bộ Giờ Hà Nội ICT GMT+7) */}
        {isTargetClockOpen && (
          <TargetStudyClockModal
            isOpen={isTargetClockOpen}
            onClose={() => setIsTargetClockOpen(false)}
            onOpenPomodoro={() => {
              showToast('⏱️ Hãy bấm vào widget Pomodoro ở góc dưới màn hình để bắt đầu học!');
            }}
            onOpenQuiz={() => {
              if (allAvailableCourses[0]) {
                setActiveQuizCourse(allAvailableCourses[0]);
              }
            }}
            onOpenStudyRoom={() => setIsStudyRoomOpen(true)}
            onOpenCheatSheet={() => setActiveCheatSheetCourse(allAvailableCourses[0] || COURSES_DATA[0])}
            onOpenFlashcards={() => setActiveFlashcardCourse(allAvailableCourses[0] || COURSES_DATA[0])}
          />
        )}

        {/* 19. 1-Page High-Yield Cheat Sheet Modal v3.0 */}
        {activeCheatSheetCourse && (
          <CheatSheetModal
            initialCourseId={typeof activeCheatSheetCourse === 'string' ? activeCheatSheetCourse : activeCheatSheetCourse?.id}
            allCourses={allAvailableCourses}
            onClose={() => setActiveCheatSheetCourse(null)}
          />
        )}

        {/* 20. Virtual Study Room v3.0 (Study With Me + Live Flashcards + Web Audio) Modal */}
        {isStudyRoomOpen && (
          <VirtualStudyRoomModal
            user={user}
            allCourses={allAvailableCourses}
            onClose={() => setIsStudyRoomOpen(false)}
            onOpenCheatSheet={(courseId) => {
              setIsStudyRoomOpen(false);
              setActiveCheatSheetCourse(courseId || allAvailableCourses[0]?.id || 'pldc');
            }}
          />
        )}

        {/* 21. Direct Messages & 1-on-1 Peer Chat Modal */}
        {isDirectChatOpen && (
          <DirectChatModal
            isOpen={isDirectChatOpen}
            onClose={() => {
              setIsDirectChatOpen(false);
              setDirectChatPartner(null);
              setDirectChatAttachDeck(null);
            }}
            currentUser={user}
            targetPartner={directChatPartner}
            initialAttachedDeck={directChatAttachDeck}
            allCourses={allAvailableCourses}
            onOpenFlashcards={(deck) => {
              setIsDirectChatOpen(false);
              setActiveFlashcardCourse(deck);
            }}
            onShowToast={showToast}
          />
        )}
      </Suspense>

      {/* 15. Floating Pomodoro Focus Timer Widget */}
      <PomodoroTimerWidget onBonusReward={refreshState} />

      {/* 18. Mobile PWA Install Prompt Banner */}
      <PwaInstallPrompt />

    </div>
  );
}
