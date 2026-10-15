import React, { useState, useEffect } from 'react';
import NotionSidebar from './components/NotionSidebar';
import NotionTopbar from './components/NotionTopbar';
import HomeView from './views/HomeView';
import MarketplaceView from './views/MarketplaceView';
import CommunityView from './views/CommunityView';
import CreateStudioView from './views/CreateStudioView';
import LibraryView from './views/LibraryView';
import WalletView from './views/WalletView';
import PlansView from './views/PlansView';
import AdminView from './views/AdminView';

import FlashcardModal from './components/FlashcardModal';
import QuizModal from './components/QuizModal';
import MatchGameModal from './components/MatchGameModal';
import LeaderboardModal from './components/LeaderboardModal';
import PaymentModal from './components/PaymentModal';
import AuthModal from './components/AuthModal';
import BlindBoxModal from './components/BlindBoxModal';
import PassDeckModal from './components/PassDeckModal';
import SellDeckModal from './components/SellDeckModal';
import MistakeNotebookModal from './components/MistakeNotebookModal';
import ChangelogModal from './components/ChangelogModal';
import CommandPaletteModal from './components/CommandPaletteModal';
import AnalyticsModal from './components/AnalyticsModal';
import ThemePickerModal from './components/ThemePickerModal';
import ThemeAtmosphereBackground from './components/ThemeAtmosphereBackground';
import PomodoroTimerWidget from './components/PomodoroTimerWidget';
import Footer from './components/Footer';

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
import { getSelectedTheme, applyTheme, subscribeToTheme } from './utils/themeManager';
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
        const activeUser = getCurrentUser();
        if (!isUserAdmin(activeUser)) {
          playSound('flip');
          showToast(`⛔ Từ chối truy cập: Cửa sổ quản trị chỉ dành riêng cho tài khoản Admin (${PRIMARY_ADMIN_EMAIL}).`);
          return;
        }
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

  return (
    <div 
      className={`min-h-screen ${currentTheme.bgClass} ${currentTheme.textClass} flex flex-col md:flex-row antialiased selection:bg-[#cce5ff] selection:text-[#37352f] transition-colors duration-500 relative`}
      style={{ backgroundImage: currentTheme.wallpaperGlow }}
    >
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
        />

        {/* MAIN NOTION PAGE CANVAS */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          
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
              allCourses={allAvailableCourses}
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
            />
          )}

          {/* TAB 3: DIỄN ĐÀN THẢO LUẬN & HỎI ĐÁP CỘNG ĐỒNG */}
          {activeTab === 'community' && (
            <CommunityView
              user={user}
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
              onSwitchTab={setActiveTab}
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
            />
          )}

        </main>

        {/* Minimal Notion Footer */}
        <Footer />
      </div>

      {/* OVERLAY MODALS FOR FOCUSED INTERACTION */}
      
      {/* 1. 3D Flashcard Player */}
      {activeFlashcardCourse && (
        <FlashcardModal
          course={activeFlashcardCourse}
          isPurchased={isCoursePurchased(activeFlashcardCourse.id)}
          onClose={() => setActiveFlashcardCourse(null)}
          onBuy={(c) => setActivePaymentItem(c)}
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
      />

      {/* 14. Learning Analytics & Mastery Dashboard */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        allCourses={allAvailableCourses}
        purchasedCourses={purchasedCourses}
        onOpenDueCards={(deck) => setActiveFlashcardCourse(deck)}
      />

      {/* 15. Floating Pomodoro Focus Timer Widget */}
      <PomodoroTimerWidget onBonusReward={refreshState} />

      {/* 16. Messenger / Instagram Style Theme & Atmospheric Background Picker */}
      <ThemePickerModal
        isOpen={isThemePickerOpen}
        onClose={() => setIsThemePickerOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={(theme) => {
          setCurrentTheme(theme);
          showToast(`🎨 Đã đổi sang giao diện: ${theme.name}`);
        }}
      />

    </div>
  );
}
