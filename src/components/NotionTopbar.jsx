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
  FileText
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
  onOpenTargetClock,
  onOpenStudyRoom,
  onOpenDirectChat,
  onOpenLiveExamRoom,
  onOpenExamReadiness
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
    home: { emoji: '🏠', title: 'Trang Chủ & Đề Thi Chuẩn' },
    library: { emoji: '📚', title: 'Tủ Thẻ Của Tôi' },
    create: { emoji: '✍️', title: 'Studio Tạo Thẻ AI' },
    marketplace: { emoji: '🏪', title: 'Chợ Thẻ C2C' },
    community: { emoji: '💬', title: 'Cộng Đồng Học Viên' },
    wallet: { emoji: '🪙', title: 'Ví Xu ÔnThiHub' },
    plans: { emoji: '⚡', title: 'Gói Hội Viên' },
    admin: { emoji: '👑', title: 'Cửa Sổ Quản Trị Hệ Thống' }
  };

  const currentBreadcrumb = breadcrumbMap[activeTab] || breadcrumbMap.home;

  return (
    <header className={`sticky top-0 z-30 h-12 ${currentTheme?.topbarBgClass || 'bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-xl'} border-b ${currentTheme?.borderClass || 'border-[#e9e9e8] dark:border-white/15'} flex items-center justify-between px-3 sm:px-5 select-none text-xs text-slate-900 dark:text-white transition-colors duration-500 relative`}>
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

      {/* LEFT: SIDEBAR TOGGLE & NOTION BREADCRUMB */}
      <div className="flex items-center space-x-2 min-w-0">
        
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => {
            playSound('click');
            onToggleSidebar();
          }}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-900/10 dark:hover:bg-white/10 rounded-md transition-colors shrink-0 cursor-pointer"
          title={sidebarOpen ? "Thu gọn thanh bên" : "Mở rộng thanh bên (Ctrl + \\)"}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Notion Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 truncate">
          <span
            onClick={() => onSelectTab('home')}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold cursor-pointer transition-colors truncate"
          >
            🎓 Ôn Thi Hub
          </span>
          <span className="text-slate-400 dark:text-slate-500">/</span>
          <span className="font-extrabold text-slate-900 dark:text-white flex items-center space-x-1 truncate">
            <span className="text-sm shrink-0">{currentBreadcrumb.emoji}</span>
            <span className="truncate">{currentBreadcrumb.title}</span>
          </span>
        </nav>
      </div>

      {/* RIGHT: CLEAN LABELED TOOLBAR WITH TIỆN ÍCH HUB */}
      <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
        
        {/* Quick Command Palette Search Button */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenSearch?.();
          }}
          className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/15 flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
          title="Tìm nhanh tài liệu, đề thi & lệnh (Ctrl+K)"
          aria-label="Tìm nhanh (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-500 dark:text-sky-400 shrink-0" />
          <span className="text-[11px] font-medium hidden md:inline text-slate-600 dark:text-slate-300">Tìm kiếm...</span>
          <kbd className="text-[9px] font-mono font-bold px-1 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/20 text-slate-500 dark:text-slate-400 hidden lg:inline">
            Ctrl K
          </kbd>
        </button>

        {/* Live Exam Room Button (With Live Label) */}
        {onOpenLiveExamRoom && (
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onOpenLiveExamRoom();
            }}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-600/50 transition-all shadow-2xs cursor-pointer relative"
            title="Phòng thi thử trực tiếp toàn quốc theo lịch hẹn (Live ICT)"
            aria-label="Phòng thi đấu trực tiếp"
          >
            <span className="relative flex items-center justify-center">
              <span className="text-xs select-none">🏛️</span>
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </span>
            <span className="text-[11px] font-extrabold tracking-tight">Thi Đấu</span>
          </button>
        )}

        {/* Exam Readiness & Pass Probability Quick Pill */}
        {onOpenExamReadiness && (
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onOpenExamReadiness();
            }}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-800 dark:text-sky-200 border border-sky-300 dark:border-sky-600/50 transition-all shadow-2xs cursor-pointer"
            title="Radar Năng Lực & Dự Báo Xác Suất Đỗ Kỳ Thi (AI v2.0)"
            aria-label="Dự báo tỷ lệ đỗ"
          >
            <span className="text-xs select-none">🎯</span>
            <span className="text-[11px] font-extrabold tracking-tight">Tỷ Lệ Đỗ</span>
          </button>
        )}

        {/* TIỆN ÍCH & CÔNG CỤ DROPDOWN HUB */}
        <div className="relative" ref={toolsMenuRef}>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setShowToolsMenu(!showToolsMenu);
            }}
            className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-lg border transition-all shadow-2xs cursor-pointer ${
              showToolsMenu
                ? 'bg-[#2383e2] text-white border-[#2383e2]'
                : 'bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/15'
            }`}
            title="Danh mục Tiện ích & Công cụ ôn luyện thông minh"
            aria-label="Menu Tiện ích"
          >
            <Wrench className={`w-3.5 h-3.5 ${showToolsMenu ? 'text-white' : 'text-slate-600 dark:text-sky-400'}`} />
            <span className="text-[11px] font-extrabold hidden md:inline">Tiện Ích</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showToolsMenu ? 'rotate-180 text-white' : 'text-slate-400'}`} />
          </button>

          {/* Quick Tools Dropdown Card */}
          {showToolsMenu && (
            <div className="absolute right-0 mt-1.5 w-80 sm:w-88 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 p-2 space-y-1 z-50 text-left animate-fade-in">
              <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>🛠️ Tiện Ích & Công Cụ Ôn Luyện</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Khám phá các tính năng tăng tốc học tập</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowToolsMenu(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto space-y-1 p-0.5">
                {/* 1. Đổi giao diện 3D 4K */}
                {onOpenThemePicker && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowToolsMenu(false);
                      playSound('click');
                      onOpenThemePicker();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-transparent hover:border-purple-200 dark:hover:border-purple-800/40 transition-colors flex items-start gap-2.5 cursor-pointer group"
                  >
                    <span className="text-lg p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 shrink-0">🎨</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          Đổi Giao Diện 3D 4K
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                          16 Themes
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        Tùy chọn phong cách thẩm mỹ (Cyberpunk, Lofi, Ghibli, Vintage...).
                      </p>
                    </div>
                  </button>
                )}

                {/* 6. Hiệu ứng khí quyển */}
                {currentTheme?.weatherType && currentTheme.weatherType !== 'none' && (() => {
                  const weatherInfoMap = {
                    'mario-stars': { icon: '🍄', label: 'Mario Stars' },
                    'anime-comet': { icon: '🌠', label: 'Sao Băng Tiamat' },
                    snow: { icon: '❄️', label: 'Tuyết Rơi' },
                    halloween: { icon: '🎃', label: 'Halloween' },
                    sakura: { icon: '🌸', label: 'Hoa Đào' },
                    stars: { icon: '✨', label: 'Sao Băng' },
                    fireflies: { icon: '🍃', label: 'Đom Đóm' },
                    'coffee-steam': { icon: '☕', label: 'Hơi Cà Phê' },
                    'digital-rain': { icon: '⚡', label: 'Ma Trận' },
                    'sunset-dust': { icon: '🌅', label: 'Bụi Nắng' },
                    'fizzy-citrus': { icon: '🫧', label: 'Bọt Khí' },
                    'aurora-ice': { icon: '🌌', label: 'Cực Quang' },
                    'autumn-leaves': { icon: '🍂', label: 'Lá Vàng' },
                    'minimal-sparkles': { icon: '✨', label: 'Lấp Lánh' }
                  };
                  const info = weatherInfoMap[currentTheme.weatherType] || { icon: '✨', label: 'Khí Quyển' };
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        onToggleWeather?.();
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-transparent hover:border-sky-200 dark:hover:border-sky-800/40 transition-colors flex items-start gap-2.5 cursor-pointer group"
                    >
                      <span className="text-lg p-1.5 rounded-lg bg-sky-100 dark:bg-sky-900/40 shrink-0">{info.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                            Hiệu Ứng: {info.label}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isWeatherEnabled
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {isWeatherEnabled ? 'Đang Bật' : 'Đã Tắt'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                          Bấm để bật hoặc tắt các hạt rơi chuyển động trên nền giao diện.
                        </p>
                      </div>
                    </button>
                  );
                })()}

                {/* 7. Nhật ký tính năng mới */}
                {onOpenChangelog && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowToolsMenu(false);
                      playSound('click');
                      onOpenChangelog();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-colors flex items-start gap-2.5 cursor-pointer group"
                  >
                    <span className="text-lg p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">📜</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Nhật Ký Bản Nâng Cấp
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                          v3.0
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        Xem danh sách các tính năng và cải tiến vừa được phát hành.
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FINANCIAL STATS: VÍ XU (Clear Balance Display) */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onSelectTab('wallet');
          }}
          className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-500/40 transition-all shadow-2xs cursor-pointer shrink-0"
          title={`Ví Xu OnThiHub: ${walletBalance} Xu (Bấm để nạp/rút tiền)`}
          aria-label="Ví Xu"
        >
          <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
          <span className="text-[11px] font-black font-mono">{walletBalance}</span>
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 hidden sm:inline">Xu</span>
        </button>

        {/* GAMIFICATION STATS: CHUỖI NGÀY HỌC (Streak with Day Count) */}
        <button
          type="button"
          onClick={() => {
            playSound('flip');
            onOpenLeaderboard?.();
          }}
          className="hidden sm:flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/80 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-500/40 transition-all shadow-2xs cursor-pointer shrink-0"
          title={`Chuỗi học tập liên tục: ${streakInfo.streak} ngày (Bấm mở Bảng Vàng)`}
          aria-label="Chuỗi học tập"
        >
          <span className="text-xs select-none">{currentTheme?.icons?.streak || '🔥'}</span>
          <span className="text-[11px] font-black font-mono">{streakInfo.streak}</span>
          <span className="text-[10px] font-bold text-orange-700 dark:text-orange-300 hidden md:inline">ngày</span>
        </button>

        {/* DAILY REWARD: ĐIỂM DANH NHẬN XU (With Clear Label) */}
        <button
          type="button"
          onClick={handleCheckIn}
          className="hidden xl:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/40 transition-all shadow-2xs cursor-pointer shrink-0"
          title="Điểm danh nhận Xu thưởng miễn phí mỗi ngày"
          aria-label="Điểm danh nhận Xu"
        >
          <span className="text-xs select-none">{currentTheme?.icons?.checkin || '🎁'}</span>
          <span className="text-[11px] font-bold">Điểm danh</span>
        </button>

        {/* AUDIO MUTE / UNMUTE */}
        <button
          type="button"
          onClick={handleToggleMute}
          className="hidden md:flex w-8 h-8 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10 items-center justify-center transition-colors cursor-pointer shrink-0"
          title={isMuted ? "Âm thanh: Đang tắt (Bấm để bật)" : "Âm thanh: Đang bật (Bấm để tắt)"}
          aria-label="Bật/Tắt âm thanh"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-500" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          )}
        </button>

        {/* DAY / NIGHT SLEEP MODE CONTROLS (Circular-reveal dark mode #219) */}
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

        {/* DIRECT CHAT & FRIENDS BUTTON */}
        {(() => {
          const totalSocialBadge = (unreadDmCount || 0) + (pendingRequestsCount || 0);
          return (
            <button
              type="button"
              onClick={() => {
                playSound('click');
                onOpenDirectChat?.();
              }}
              className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 dark:hover:bg-sky-900 text-[#2383e2] dark:text-sky-300 border border-sky-300 dark:border-sky-500/40 flex items-center justify-center transition-all shadow-2xs relative cursor-pointer shrink-0"
              title={`Tin nhắn trực tiếp & Bạn học${totalSocialBadge > 0 ? ` (${totalSocialBadge} thông báo mới)` : ''}`}
              aria-label="Tin nhắn và Bạn bè"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#2383e2] dark:text-sky-400" />
              {totalSocialBadge > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-black ring-2 ring-white dark:ring-slate-900 flex items-center justify-center animate-pulse">
                  {totalSocialBadge > 9 ? '9+' : totalSocialBadge}
                </span>
              )}
            </button>
          );
        })()}

        {/* NOTIFICATION BELL */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={handleOpenNotifications}
            className="w-8 h-8 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10 flex items-center justify-center transition-colors relative cursor-pointer shrink-0"
            title="Thông báo hệ thống"
            aria-label="Thông báo"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 p-3 space-y-2 z-50 text-left animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Thông Báo Hệ Thống</span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-300">{notifications.length} tin</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 dark:text-slate-400 py-4">Chưa có thông báo nào</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs space-y-1 border border-slate-200/80 dark:border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{notif.title}</span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 shrink-0 ml-1">{notif.time || 'Vừa xong'}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-200 text-[11px] leading-relaxed">{notif.message}</p>
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
            className="w-8 h-8 rounded-lg hover:bg-slate-200/70 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title={`Tài khoản: ${user.displayName || user.email}`}
            aria-label="Tài khoản cá nhân"
          >
            <div className="w-6 h-6 rounded-full bg-[#2383e2] dark:bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-8 h-8 rounded-lg bg-[#2383e2] hover:bg-[#1d6fc2] text-white flex items-center justify-center shadow-2xs transition-colors cursor-pointer shrink-0"
            title="Đăng Nhập / Quản lý Tài Khoản"
            aria-label="Đăng Nhập"
          >
            <User className="w-3.5 h-3.5" />
          </button>
        )}

      </div>
    </header>
  );
}
