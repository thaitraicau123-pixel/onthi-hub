import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
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
import MistakeNotebookModal from './components/MistakeNotebookModal';
import ChangelogModal from './components/ChangelogModal';
import PomodoroTimerWidget from './components/PomodoroTimerWidget';
import Footer from './components/Footer';

import { COURSES_DATA, COMBO_PACKAGE } from './data/coursesData';
import { getMarketplaceDecks } from './data/marketplaceData';
import { isChangelogUnread } from './data/changelogData';
import { getPurchasedCourses, isCoursePurchased } from './utils/storage';
import { getCurrentUser } from './utils/firebaseConfig';
import { getWalletBalance } from './utils/wallet';
import { getAppTheme, setAppTheme } from './utils/gamification';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Current Active Tab: 'home' | 'marketplace' | 'community' | 'create' | 'library' | 'wallet' | 'plans' | 'admin'
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState(() => getAppTheme());

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
  const [isMistakesNotebookOpen, setIsMistakesNotebookOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(() => isChangelogUnread());
  const [toastMessage, setToastMessage] = useState('');

  // Sync initial state
  useEffect(() => {
    setPurchasedCourses(getPurchasedCourses());
    setUser(getCurrentUser());
    setWalletBalance(getWalletBalance());
    setMarketplaceDecks(getMarketplaceDecks());

    // Secret Hotkey Ctrl + Shift + A switches to Admin Tab
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActiveTab((prev) => (prev === 'admin' ? 'home' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync theme
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'theme-dark' : theme === 'sepia' ? 'theme-sepia' : '';
    setAppTheme(theme);
  }, [theme]);

  const handleCycleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : prev === 'dark' ? 'sepia' : 'light'));
  };

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
    <div className={`min-h-screen bg-[#240618] bg-[radial-gradient(circle_at_50%_0%,_#5c163f_0%,_#380b23_45%,_#1e0413_100%)] flex flex-col text-slate-100 font-sans selection:bg-[#f02c85] selection:text-white ${
      theme === 'dark' ? 'theme-dark' : theme === 'sepia' ? 'theme-sepia' : ''
    }`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-xl text-xs sm:text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modern Tab-based Navbar with Streak and Notifications */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        purchasedCount={purchasedCourses.length}
        walletBalance={walletBalance}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onCheckInCompleted={refreshState}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenBlindBox={() => setIsBlindBoxOpen(true)}
        onOpenMistakes={() => setIsMistakesNotebookOpen(true)}
        onOpenChangelog={() => setIsChangelogOpen(true)}
        theme={theme}
        onCycleTheme={handleCycleTheme}
      />

      {/* MAIN TAB CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-16 md:mb-0">
        
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

        {/* TAB 8: SECRET ADMIN PORTAL */}
        {activeTab === 'admin' && (
          <AdminView
            onBackToHome={() => setActiveTab('home')}
            onOpenChangelog={() => setIsChangelogOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <Footer />

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
          onPassSuccess={() => {
            refreshState();
            showToast('🎉 Đã niêm yết pass bộ thẻ thành công lên Sàn C2C!');
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

      {/* 10. Floating Pomodoro Focus Timer Widget */}
      <PomodoroTimerWidget onBonusReward={refreshState} />

    </div>
  );
}
