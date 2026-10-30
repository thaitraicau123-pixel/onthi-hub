import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
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
const LeaderboardModal = lazy(() => import('./components/LeaderboardModal'));
const PaymentModal = lazy(() => import('./components/PaymentModal'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const BlindBoxModal = lazy(() => import('./components/BlindBoxModal'));
const PassDeckModal = lazy(() => import('./components/PassDeckModal'));
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
  getTransactions,
  subscribeToTransactions,
  checkAndApplyApprovedTransactions,
  sendBrowserDesktopNotification,
  requestBrowserNotificationPermission
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
import {
  subscribeToDirectMessages,
  getCurrentUserParticipant,
  isSameUser,
  matchesUserIdentifier
} from './utils/directMessaging';
import { subscribeToFriendEvents } from './utils/friendSystem';
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
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [activePaymentItem, setActivePaymentItem] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBlindBoxOpen, setIsBlindBoxOpen] = useState(false);
  const [activePassCourse, setActivePassCourse] = useState(null);
  const [activeSellCourse, setActiveSellCourse] = useState(null);
  const [isChangelogOpen, setIsChangelogOpen] = useState(() => isChangelogUnread());
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastActionPartner, setToastActionPartner] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(() => getSelectedTheme());
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [isWeatherEnabled, setIsWeatherEnabled] = useState(() => isWeatherEffectsEnabled());
  const [sleepMode, setSleepMode] = useState(() => getSleepMode());
  const [isDirectChatOpen, setIsDirectChatOpen] = useState(false);
  const [activeShareAchievement, setActiveShareAchievement] = useState(null);
  const [directChatPartner, setDirectChatPartner] = useState(null);
  const [directChatAttachDeck, setDirectChatAttachDeck] = useState(null);
  const [directChatAttachAchievement, setDirectChatAttachAchievement] = useState(null);
  const [initialCardIndex, setInitialCardIndex] = useState(null);

  const handleOpenDirectChat = (partner = null, attachDeck = null, attachAchievement = null) => {
    setDirectChatPartner(partner);
    setDirectChatAttachDeck(attachDeck);
    setDirectChatAttachAchievement(attachAchievement);
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

    // Global listener for cross-device transaction approvals & real-time Admin alerts
    const seenTxIds = new Set();
    try {
      const initTxs = getTransactions();
      initTxs.forEach((t) => {
        if (t && t.id) seenTxIds.add(t.id);
      });
    } catch (e) {}

    const unsubTxs = subscribeToTransactions((latestTxs) => {
      const activeUser = getCurrentUser();

      // 1. Phía Creator / Thành viên: Nhận thông báo khi lệnh nạp tiền được duyệt để cộng Xu
      const res = checkAndApplyApprovedTransactions(activeUser?.email);
      if (res.newlyCreditedCoins > 0) {
        setWalletBalance(getWalletBalance());
        playSound('success');
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
        showToast(`🎉 Lệnh nạp tiền đã được Admin duyệt! Bạn được cộng +${res.newlyCreditedCoins} Xu vào ví.`);
      }

      // 2. Phía Admin: Reo chuông + Toast + Desktop Notification khi có thành viên gửi lệnh nạp mới
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

          // Rung chuông âm thanh chuông ngân to rõ ràng
          playSound('bell');

          // Hiện Toast nổi bật trên web
          showToast(`🔔 [LỆNH ${isDeposit ? 'NẠP XU' : 'RÚT TIỀN'} MỚI] ${first.userEmail || 'Creator'}: ${first.xuAmount} Xu (~${(first.amountVnd || first.xuAmount * 1000).toLocaleString('vi-VN')}đ). Mã: ${first.id}`);

          // Bắn thông báo đẩy ra màn hình máy tính (Windows / Mac Desktop Notification)
          sendBrowserDesktopNotification({
            title: `🔔 [PromptMMO] Có Lệnh ${isDeposit ? 'Nạp Xu' : 'Rút Tiền'} Mới: ${first.id}`,
            body: `Thành viên: ${first.userEmail || 'Chưa cung cấp'}\nSố lượng: ${first.xuAmount} Xu (~${(first.amountVnd || first.xuAmount * 1000).toLocaleString('vi-VN')} VNĐ)\nBấm vào trang Admin để duyệt ngay.`,
            tag: first.id
          });
        }
      }
    });

    // Global real-time listener for C2C marketplace decks (Firebase Firestore + Cloud Relay)
    const unsubMarket = subscribeToMarketplaceDecks((decks) => {
      setMarketplaceDecks(decks);
    });

    // Global real-time listener for incoming direct messages (Chime + Interactive Toast + Desktop Notification)
    const seenNotifyMsgIds = new Set();
    const unsubDM = subscribeToDirectMessages(null, (incomingMsg) => {
      if (!incomingMsg || !incomingMsg.id || seenNotifyMsgIds.has(incomingMsg.id)) return;
      const curParticipant = getCurrentUserParticipant(getCurrentUser());
      if (isSameUser(incomingMsg.sender, curParticipant)) return;

      const isForMe =
        isSameUser(incomingMsg.receiver, curParticipant) ||
        matchesUserIdentifier(incomingMsg.receiver, curParticipant) ||
        (isUserAdmin(curParticipant) && (incomingMsg.receiverId === 'admin_promptmmo' || incomingMsg.receiverId === 'admin_onthi' || incomingMsg.receiver?.id === 'admin_onthi'));

      if (isForMe) {
        seenNotifyMsgIds.add(incomingMsg.id);
        playSound('bell');
        const senderName = incomingMsg.sender?.name || 'Thành viên';
        const isPvp = !!incomingMsg.pvpChallenge;
        const msgSnippet = incomingMsg.pvpChallenge
          ? `⚔️ Đã gửi lời mời Thách Đấu: ${incomingMsg.pvpChallenge.deckTitle || 'Thử thách'}!`
          : incomingMsg.sharedAchievement
          ? '🏆 Đã gửi Bằng Khen Kỷ Lục Hoàng Gia 4K!'
          : incomingMsg.sharedDeck
          ? `📇 Đã chia sẻ Gói Prompt: ${incomingMsg.sharedDeck.title}`
          : incomingMsg.text || 'Tin nhắn mới';

        const toastTitle = isPvp
          ? `⚔️ [THÁCH ĐẤU] ${senderName}: ${msgSnippet}`
          : `💬 [TIN NHẮN MỚI] ${senderName}: ${msgSnippet}`;

        showToast(toastTitle, incomingMsg.sender);

        sendBrowserDesktopNotification({
          title: isPvp ? `⚔️ [PromptMMO] Thách đấu từ ${senderName}` : `💬 [PromptMMO] Tin nhắn mới từ ${senderName}`,
          body: msgSnippet,
          tag: incomingMsg.id
        });
      }
    });

    // Global real-time listener for incoming friend requests & friend acceptances
    const seenFriendEventIds = new Set();
    const unsubFriends = subscribeToFriendEvents(null, (friendData) => {
      if (!friendData || friendData.type !== 'friend_update') return;
      const curParticipant = getCurrentUserParticipant(getCurrentUser());

      if (friendData.action === 'request_sent' && friendData.request) {
        const req = friendData.request;
        if (seenFriendEventIds.has(req.id)) return;
        if (
          (isSameUser(req.receiver, curParticipant) || matchesUserIdentifier(curParticipant, req.receiverId)) &&
          !isSameUser(req.sender, curParticipant)
        ) {
          seenFriendEventIds.add(req.id);
          playSound('bell');
          const senderName = req.sender?.name || 'Thành viên';
          showToast(`🤝 [LỜI MỜI KẾT BẠN] ${senderName} muốn kết bạn cùng trao đổi với bạn!`, req.sender);
          sendBrowserDesktopNotification({
            title: `🤝 [PromptMMO] Lời mời kết bạn từ ${senderName}`,
            body: req.message || 'Chào bạn, kết bạn cùng trao đổi trên PromptMMO nhé!',
            tag: req.id
          });
        }
      } else if (friendData.action === 'request_accepted' && friendData.pairKey) {
        const eventKey = `acc_${friendData.pairKey}`;
        if (seenFriendEventIds.has(eventKey)) return;
        const isMeA = isSameUser(friendData.userA, curParticipant);
        const isMeB = isSameUser(friendData.userB, curParticipant);
        if (isMeA || isMeB) {
          seenFriendEventIds.add(eventKey);
          const newFriend = isMeA ? friendData.userB : friendData.userA;
          if (newFriend && !isSameUser(newFriend, curParticipant)) {
            playSound('success');
            showToast(`🎉 [BẠN BÈ MỚI] Bạn và ${newFriend.name} đã trở thành bạn bè!`, newFriend);
          }
        }
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (typeof unsubTxs === 'function') unsubTxs();
      if (typeof unsubMarket === 'function') unsubMarket();
      if (typeof unsubDM === 'function') unsubDM();
      if (typeof unsubFriends === 'function') unsubFriends();
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

  const showToast = (msg, actionPartner = null) => {
    setToastMessage(msg);
    setToastActionPartner(actionPartner);
    setTimeout(() => {
      setToastMessage('');
      setToastActionPartner(null);
    }, 5000);
  };

  const handlePaymentSuccess = (itemId) => {
    refreshState();
    showToast('🎉 Mở khóa thành công! Bạn có thể vào "Tủ Của Tôi" để sử dụng ngay.');
  };

  const handleDeckCreated = (newDeck) => {
    setCustomDecks((prev) => [newDeck, ...prev]);
    showToast(`🎉 Tạo thành công gói Prompt "${newDeck.title}"!`);
    refreshState();
  };

  const allAvailableCourses = useMemo(() => {
    return [...customDecks, ...marketplaceDecks, ...COURSES_DATA].map((c) => {
      const cards = c.cards || c.previewCards || c.sampleCards || c.flashcards || [];
      const quiz = c.quiz || c.previewQuiz || c.questions || [];
      const count = c.cardsCount || c.cardCount || cards.length;
      return {
        ...c,
        cards,
        previewCards: c.previewCards || cards,
        sampleCards: c.sampleCards || cards,
        flashcards: c.flashcards || cards,
        cardsCount: count,
        cardCount: count,
        quiz,
        previewQuiz: c.previewQuiz || quiz,
        questions: c.questions || quiz
      };
    });
  }, [customDecks, marketplaceDecks]);

  // Tự động nhận diện đường dẫn chia sẻ gói Prompt (?deck=...&card=...&tab=...)
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
        showToast(`🔗 Đang mở gói Prompt được chia sẻ: ${targetDeck.title}`);
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
      
      {/* Toast Notification (Interactive when message or friend request arrives) */}
      {toastMessage && (
        <div
          onClick={() => {
            if (toastActionPartner) {
              handleOpenDirectChat(toastActionPartner);
              setToastMessage('');
              setToastActionPartner(null);
            }
          }}
          className={`fixed top-14 right-4 sm:right-6 z-50 max-w-md flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#18191d]/95 backdrop-blur-md text-white shadow-2xl text-xs sm:text-sm font-semibold border border-white/15 animate-fade-in ${
            toastActionPartner ? 'cursor-pointer hover:border-sky-400/60 transition-all' : ''
          }`}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate sm:whitespace-normal">{toastMessage}</span>
          </div>
          {toastActionPartner && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDirectChat(toastActionPartner);
                setToastMessage('');
                setToastActionPartner(null);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-[11px] font-bold shrink-0 shadow-xs cursor-pointer"
            >
              Mở Chat →
            </button>
          )}
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
        onOpenChangelog={() => setIsChangelogOpen(true)}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        currentTheme={currentTheme}
        onOpenThemePicker={() => setIsThemePickerOpen(true)}
        onOpenDirectChat={() => handleOpenDirectChat()}
        onOpenShareAchievement={(data) => setActiveShareAchievement(data)}
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
          onOpenDirectChat={() => handleOpenDirectChat()}
        />

        {/* MAIN NOTION PAGE CANVAS */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <Suspense fallback={<ViewLoadingFallback />}>
            {/* TAB 1: TRANG CHỦ / PROMPT & SKILLS CHÍNH QUY */}
            {activeTab === 'home' && (
              <HomeView
                onOpenFlashcards={(c) => setActiveFlashcardCourse(c)}
                onBuyCourse={(c) => setActivePaymentItem(c)}
                onBuyCombo={(combo) => setActivePaymentItem(combo)}
                onSwitchTab={setActiveTab}
                onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
                onOpenBlindBox={() => setIsBlindBoxOpen(true)}
                allCourses={allAvailableCourses}
                onShowToast={showToast}
                onOpenDirectChat={handleOpenDirectChat}
                onOpenShareAchievement={(data) => setActiveShareAchievement(data)}
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
                onOpenPassDeck={(course) => setActivePassCourse(course)}
                onOpenSellDeck={(course) => setActiveSellCourse(course)}
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
            onBuy={(c) => setActivePaymentItem(c)}
            initialCardIndex={initialCardIndex}
            onOpenDirectChat={handleOpenDirectChat}
          />
        )}

        {/* 4. Duolingo Leaderboard & Streak Modal */}
        {isLeaderboardOpen && (
          <LeaderboardModal
            onClose={() => setIsLeaderboardOpen(false)}
            onOpenShareAchievement={(data) => setActiveShareAchievement(data)}
          />
        )}

        {/* 5. Coin Purchase Modal */}
        {activePaymentItem && (
          <PaymentModal
            item={activePaymentItem}
            isCombo={activePaymentItem.id === COMBO_PACKAGE.id}
            user={user}
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

        {/* 9. Pass Lại Gói Prompt (C2C Resale) */}
        {activePassCourse && (
          <PassDeckModal
            course={activePassCourse}
            user={user}
            onClose={() => setActivePassCourse(null)}
            onPassSuccess={(res) => {
              refreshState();
              setActiveTab('marketplace');
              showToast(`🎉 Gói Prompt "${res?.title || ''}" đã chính thức lên Sàn C2C!`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 10. Bán Gói Prompt Trực Tiếp Từ Tủ (C2C Direct Sell) */}
        {activeSellCourse && (
          <SellDeckModal
            course={activeSellCourse}
            user={user}
            onClose={() => setActiveSellCourse(null)}
            onSellSuccess={(res) => {
              refreshState();
              setActiveTab('marketplace');
              showToast(`🎉 Gói Prompt "${res?.title || ''}" đã chính thức lên Sàn C2C!`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenBlindBox={() => setIsBlindBoxOpen(true)}
            onOpenWallet={() => {
              setActiveTab('wallet');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAnalytics={() => setIsAnalyticsOpen(true)}
            onOpenThemePicker={() => setIsThemePickerOpen(true)}
            onOpenDirectChat={() => handleOpenDirectChat()}
            onOpenShareAchievement={(data) => setActiveShareAchievement(data)}
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

        {/* 21. Direct Messages & 1-on-1 Peer Chat Modal */}
        {isDirectChatOpen && (
          <DirectChatModal
            isOpen={isDirectChatOpen}
            onClose={() => {
              setIsDirectChatOpen(false);
              setDirectChatPartner(null);
              setDirectChatAttachDeck(null);
              setDirectChatAttachAchievement(null);
            }}
            currentUser={user}
            targetPartner={directChatPartner}
            initialAttachedDeck={directChatAttachDeck}
            initialAttachedAchievement={directChatAttachAchievement}
            allCourses={allAvailableCourses}
            onOpenFlashcards={(deck) => {
              setIsDirectChatOpen(false);
              setActiveFlashcardCourse(deck);
            }}
            onOpenShareAchievement={(ach) => setActiveShareAchievement(ach)}
            onShowToast={showToast}
          />
        )}

        {/* 23. Share Achievement & Certificate Canvas Card Modal */}
        {activeShareAchievement && (
          <ShareAchievementModal
            isOpen={Boolean(activeShareAchievement)}
            onClose={() => setActiveShareAchievement(null)}
            achievementData={activeShareAchievement}
            onOpenDirectChat={handleOpenDirectChat}
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
