import React, { useState, useEffect, useRef } from 'react';
import {
  PanelLeft,
  Bell,
  Volume2,
  VolumeX,
  Coins,
  Search,
  BarChart2,
  Palette,
  Clock,
  User,
  MessageCircle,
  ChevronDown,
  Wrench,
  Sparkles,
  Trophy,
  X,
  FileText,
  Tv
} from 'lucide-react';
import { performDailyCheckIn } from '../utils/userTier';
import { getStreakInfo, getUserNotifications, markNotificationsAsRead } from '../utils/gamification';
import { playSound, isSoundMuted, toggleSoundMute } from '../utils/storage';
import { getSleepMode, toggleSleepMode, subscribeToSleepMode, isDayTheme } from '../utils/themeManager';
import CircularRevealDarkMode from './CircularRevealDarkMode';
import { getHanoiTimeString } from '../utils/hanoiTime';
import { getUnreadDirectMessagesCount, subscribeToDirectMessages, getCurrentUserParticipant } from '../utils/directMessaging';
import { getIncomingRequestsCount, subscribeToFriendEvents } from '../utils/friendSystem';
import confetti from 'canvas-confetti';

export default function NotionTopbar({
  sidebarOpen,
  onToggleSidebar,
  activeTab,
  onSelectTab,
  walletBalance = 0,
  user,
  onOpenAuth,
  onCheckInCompleted,
  onOpenLeaderboard,
  onOpenChangelog,
  onOpenSearch,
  onOpenAnalytics,
  currentTheme,
  onOpenThemePicker,
  isWeatherEnabled = true,
  onToggleWeather,
  onOpenDirectChat,
  onSwitchToDeck
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [notifications, setNotifications] = useState(() => getUserNotifications());
  const [isMuted, setIsMuted] = useState(() => isSoundMuted());
  const [sleepMode, setSleepMode] = useState(() => getSleepMode());
  const [hanoiTime, setHanoiTime] = useState(() => getHanoiTimeString(new Date(), false));
  const [unreadDmCount, setUnreadDmCount] = useState(() => getUnreadDirectMessagesCount(user?.uid || user?.email));
  const [pendingRequestsCount, setPendingRequestsCount] = useState(() => getIncomingRequestsCount(user?.uid || user?.email));

  const toolsMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Click outside & Escape key listeners to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target)) {
        setShowToolsMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowToolsMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const curParticipant = getCurrentUserParticipant(user);
    const updateCounts = () => {
      setUnreadDmCount(getUnreadDirectMessagesCount(curParticipant));
      setPendingRequestsCount(getIncomingRequestsCount(curParticipant));
    };
    updateCounts();
    const unsubDm = subscribeToDirectMessages(curParticipant, updateCounts);
    const unsubFriends = subscribeToFriendEvents(curParticipant, updateCounts);
    return () => {
      if (typeof unsubDm === 'function') unsubDm();
      if (typeof unsubFriends === 'function') unsubFriends();
    };
  }, [user]);
  const streakInfo = getStreakInfo();

  useEffect(() => {
    const unsub = subscribeToSleepMode((mode) => {
      setSleepMode(mode);
    });

    const updateTime = () => {
      const nextTime = getHanoiTimeString(new Date(), false);
      setHanoiTime((prev) => (prev !== nextTime ? nextTime : prev));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        updateTime();
      }
    };
    document.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus);

    return () => {
      if (typeof unsub === 'function') unsub();
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleToggleMute = () => {
    const next = toggleSoundMute();
    setIsMuted(next);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleCheckIn = () => {
    const res = performDailyCheckIn();
    if (res.success) {
      playSound('success');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.3 }
      });
      alert(res.message);
      if (onCheckInCompleted) onCheckInCompleted();
    } else {
      alert(res.message);
    }
  };

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      markNotificationsAsRead();
      setNotifications(getUserNotifications());
    }
  };

  // Tab Breadcrumb Configuration
  const breadcrumbMap = {
    home: { emoji: '⚡', title: 'Trang Chủ & Kho Prompt' },
    library: { emoji: '📁', title: 'Kho Prompt Của Tôi' },
    create: { emoji: '✍️', title: 'Studio Đăng Bán Prompt' },
    marketplace: { emoji: '🏪', title: 'Chợ Prompt C2C' },
    community: { emoji: '💬', title: 'Cộng Đồng Creator MMO' },
    wallet: { emoji: '🪙', title: 'Ví Xu PromptMMO' },
    plans: { emoji: '⚡', title: 'Gói Hội Viên VIP' },
    admin: { emoji: '👑', title: 'Cửa Sổ Quản Trị Hệ Thống' }
  };

  const currentBreadcrumb = breadcrumbMap[activeTab] || breadcrumbMap.home;

  return (
    <header className="sticky top-0 z-30 h-14 apple-glass border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between px-3 sm:px-6 select-none text-xs text-slate-900 dark:text-zinc-100 transition-colors duration-300 relative">
      {/* Festive Snow Cap Drip on Header */}
      {currentTheme?.hasSnowCaps && (
        <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none overflow-hidden z-40">
          <svg className="w-full h-2.5" preserveAspectRatio="none" viewBox="0 0 1000 10" fill="none">
            <path
              d="M0 0 L1000 0 L1000 3 Q950 8 900 3 Q850 0 800 5 Q750 9 700 3 Q650 0 600 6 Q550 9 500 3 Q450 0 400 6 Q350 9 300 3 Q250 0 200 6 Q150 9 100 3 Q50 0 0 3 Z"
              fill="#ffffff"
              fillOpacity="0.88"
            />
          </svg>
        </div>
      )}

      {/* Spooky Halloween Spiderweb Decor */}
      {currentTheme?.hasWebDecor && (
        <div className="absolute top-0 right-0 w-16 h-11 pointer-events-none overflow-hidden z-40 opacity-70">
          <svg viewBox="0 0 100 70" className="w-full h-full fill-none stroke-purple-400/50" strokeWidth="1.2">
            <path d="M100 0 Q60 5 40 35 Q15 50 0 70" />
            <path d="M100 0 Q75 10 65 30 Q40 50 10 70" />
            <path d="M100 0 L40 35 M100 0 L65 30" strokeWidth="1" />
            <path d="M90 0 C85 12 75 20 60 20" />
            <path d="M75 0 C70 24 55 35 35 35" />
            <circle cx="40" cy="35" r="2" fill="#c084fc" />
          </svg>
        </div>
      )}

      {/* LEFT: SIDEBAR TOGGLE & APPLE HIG BREADCRUMB */}
      <div className="flex items-center space-x-2.5 min-w-0">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => {
            playSound('click');
            onToggleSidebar();
          }}
          className="p-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-[0.95] rounded-xl transition-all shrink-0 cursor-pointer"
          title={sidebarOpen ? "Thu gọn thanh bên" : "Mở rộng thanh bên (Ctrl + \\)"}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Apple Style Segmented Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 truncate">
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-slate-600 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] font-semibold tracking-tight transition-all cursor-pointer"
          >
            <span className="text-amber-500 font-bold">⚡</span>
            <span>PromptMMO</span>
          </button>
          <span className="text-slate-300 dark:text-zinc-600 select-none">/</span>
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] font-bold text-slate-900 dark:text-white truncate">
            <span className="text-sm shrink-0">{currentBreadcrumb.emoji}</span>
            <span className="truncate tracking-tight">{currentBreadcrumb.title}</span>
          </div>
        </nav>
      </div>

      {/* RIGHT: APPLE TRANSLUCENT FUNCTIONAL TOOLBAR */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
        
        {/* Apple Spotlight Search Capsule */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenSearch?.();
          }}
          className="h-8 px-2.5 sm:px-3 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] active:scale-[0.97] text-slate-700 dark:text-zinc-200 border border-black/[0.06] dark:border-white/[0.08] flex items-center space-x-2 transition-all cursor-pointer"
          title="Tìm kiếm nhanh Prompt, AI tool & kỹ năng (Ctrl+K)"
          aria-label="Spotlight Search"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 shrink-0" />
          <span className="text-[11px] font-medium hidden md:inline text-slate-600 dark:text-zinc-300">Tìm kiếm...</span>
          <kbd className="text-[10px] font-medium font-mono px-1.5 py-0.5 rounded-md bg-white/80 dark:bg-zinc-800/80 shadow-2xs text-slate-500 dark:text-zinc-400 border border-black/[0.06] dark:border-white/[0.08] hidden lg:inline">
            ⌘K
          </kbd>
        </button>

        {/* BÙI THÁI STUDIO SIGNATURE: LOOKBOOK 60FPS DECK */}
        {onSwitchToDeck && (
          <button
            type="button"
            onClick={() => {
              playSound('flip');
              onSwitchToDeck();
            }}
            className="h-8 px-2.5 sm:px-3 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-500/25 to-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500 hover:text-black active:scale-[0.97] transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 shadow-xs"
            title="Mở Chế Độ Trình Chiếu Lookbook 60fps (Bùi Thái Studio)"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold font-mono hidden sm:inline">Lookbook 60fps</span>
          </button>
        )}

        {/* APPLE AMBER PILL: VÍ XU */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onSelectTab('wallet');
          }}
          className="apple-pill-amber h-8 px-2.5 sm:px-3 rounded-full flex items-center space-x-1.5 active:scale-[0.97] transition-all cursor-pointer shrink-0"
          title={`Ví Xu PromptMMO: ${walletBalance} Xu (Bấm để nạp/rút tiền)`}
          aria-label="Ví Xu"
        >
          <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
          <span className="text-[11px] font-black font-mono">{walletBalance}</span>
          <span className="text-[10px] font-bold hidden sm:inline">Xu</span>
        </button>

        {/* APPLE ORANGE PILL: CHUỖI ĐĂNG NHẬP */}
        <button
          type="button"
          onClick={() => {
            playSound('flip');
            onOpenLeaderboard?.();
          }}
          className="hidden sm:flex h-8 px-2.5 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/25 items-center space-x-1.5 font-bold active:scale-[0.97] transition-all cursor-pointer shrink-0"
          title={`Chuỗi tương tác liên tục: ${streakInfo.streak} ngày (Bấm mở Bảng Vàng)`}
          aria-label="Chuỗi ngày"
        >
          <span className="text-xs select-none">{currentTheme?.icons?.streak || '🔥'}</span>
          <span className="text-[11px] font-black font-mono">{streakInfo.streak}</span>
          <span className="text-[10px] font-bold hidden md:inline">ngày</span>
        </button>

        {/* APPLE EMERALD PILL: ĐIỂM DANH */}
        <button
          type="button"
          onClick={handleCheckIn}
          className="hidden xl:flex apple-pill-emerald h-8 px-3 rounded-full items-center space-x-1.5 font-bold active:scale-[0.97] transition-all cursor-pointer shrink-0"
          title="Điểm danh nhận Xu thưởng miễn phí mỗi ngày"
          aria-label="Điểm danh"
        >
          <span className="text-xs select-none">{currentTheme?.icons?.checkin || '🎁'}</span>
          <span className="text-[11px] font-semibold">Điểm danh</span>
        </button>

        {/* AUDIO MUTE / UNMUTE */}
        <button
          type="button"
          onClick={handleToggleMute}
          className="hidden md:flex w-8 h-8 rounded-full text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-[0.95] items-center justify-center transition-all cursor-pointer shrink-0"
          title={isMuted ? "Âm thanh: Đang tắt (Bấm để bật)" : "Âm thanh: Đang bật (Bấm để tắt)"}
          aria-label="Bật/Tắt âm thanh"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-500" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>

        {/* DAY / NIGHT SLEEP MODE CONTROLS */}
        {isDayTheme(currentTheme?.id) ? (
          <CircularRevealDarkMode
            sleepMode={sleepMode}
            onToggle={() => {
              const nextMode = toggleSleepMode();
              setSleepMode(nextMode);
            }}
            playSound={playSound}
            className="hidden sm:grid shrink-0"
          />
        ) : null}

        {/* NOTIFICATION BELL */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={handleOpenNotifications}
            className="w-8 h-8 rounded-full text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-[0.95] flex items-center justify-center transition-all relative cursor-pointer shrink-0"
            title="Thông báo hệ thống"
            aria-label="Thông báo"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 apple-glass-floating rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl p-3 space-y-2 z-50 text-left animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Thông Báo Hệ Thống</span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400">{notifications.length} tin</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 dark:text-zinc-400 py-4">Chưa có thông báo nào</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors text-xs space-y-1 border border-black/[0.04] dark:border-white/[0.06]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{notif.title}</span>
                        <span className="text-[9px] text-slate-500 dark:text-zinc-400 shrink-0 ml-1">{notif.time || 'Vừa xong'}</span>
                      </div>
                      <p className="text-slate-600 dark:text-zinc-300 text-[11px] leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* USER PROFILE / AUTH BUTTON */}
        {user ? (
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-8 h-8 rounded-full hover:opacity-90 active:scale-[0.95] flex items-center justify-center transition-all cursor-pointer shrink-0"
            title={`Tài khoản: ${user.displayName || user.email}`}
            aria-label="Tài khoản cá nhân"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-1 ring-black/10 dark:ring-white/20">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="apple-btn-prominent h-8 px-3 rounded-full text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shrink-0"
            title="Đăng Nhập / Đăng Ký Tài Khoản"
            aria-label="Đăng Nhập"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng nhập</span>
          </button>
        )}

      </div>
    </header>
  );
}
