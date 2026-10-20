import React, { useState, useEffect } from 'react';
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
  User
} from 'lucide-react';
import { performDailyCheckIn } from '../utils/userTier';
import { getStreakInfo, getUserNotifications, markNotificationsAsRead } from '../utils/gamification';
import { playSound, isSoundMuted, toggleSoundMute } from '../utils/storage';
import { getSleepMode, toggleSleepMode, subscribeToSleepMode, isDayTheme } from '../utils/themeManager';
import { getHanoiTimeString } from '../utils/hanoiTime';
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
  onOpenStudyRoom
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => getUserNotifications());
  const [isMuted, setIsMuted] = useState(() => isSoundMuted());
  const [sleepMode, setSleepMode] = useState(() => getSleepMode());
  const [hanoiTime, setHanoiTime] = useState(() => getHanoiTimeString(new Date(), false));
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

      {/* RIGHT: ICON-ONLY COLLAPSED TOOLBAR */}
      <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
        
        {/* Quick Command Palette Search Button (Icon Only) */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenSearch?.();
          }}
          className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
          title="Tìm nhanh & lệnh (Ctrl+K)"
          aria-label="Tìm nhanh (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-600 dark:text-sky-400" />
        </button>

        {/* Live Virtual Study Room Button (Icon Only) */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenStudyRoom?.();
          }}
          className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-600/50 flex items-center justify-center transition-all shadow-2xs cursor-pointer relative"
          title="Phòng tự học chung ảo trực tuyến (Live 24/7)"
          aria-label="Phòng tự học ảo Live"
        >
          <span className="relative flex items-center justify-center">
            <span className="text-sm select-none">🎧</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
          </span>
        </button>

        {/* Theme Picker Button (Icon Only) */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenThemePicker?.();
          }}
          className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-500/40 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
          title="Đổi chủ đề không gian học & icon (16 Themes 3D 4K)"
          aria-label="Đổi chủ đề"
        >
          <Palette className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300" />
        </button>

        {/* Chế Độ Ngủ 🌙 / Ban Ngày ☀️ Controls (Icon Only) */}
        {isDayTheme(currentTheme?.id) ? (
          <button
            type="button"
            onClick={() => {
              playSound('click');
              const nextMode = toggleSleepMode();
              setSleepMode(nextMode);
            }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-2xs cursor-pointer border ${
              sleepMode === 'dark'
                ? 'bg-indigo-950/90 text-indigo-100 border-indigo-400/50 hover:bg-indigo-900'
                : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
            }`}
            title={
              sleepMode === 'dark'
                ? 'Chế độ Ban đêm. Bấm chuyển sang Ban ngày ☀️'
                : 'Chế độ Ban ngày. Bấm chuyển sang Ban đêm 🌙'
            }
            aria-label="Chế độ Ban đêm / Ban ngày"
          >
            <span className="text-sm select-none">{sleepMode === 'dark' ? '🌙' : '☀️'}</span>
          </button>
        ) : (
          <div
            className="w-8 h-8 rounded-lg bg-indigo-950/90 text-indigo-100 border border-indigo-400/40 shadow-2xs flex items-center justify-center text-sm"
            title="Chủ đề 3D 4K chạy Chế độ tối cinema."
          >
            🌙
          </div>
        )}

        {/* Dynamic Weather & Atmosphere Particle Toggle Button (Icon Only) */}
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
          const info = weatherInfoMap[currentTheme.weatherType] || { icon: '✨', label: 'Hiệu Ứng' };

          return (
            <button
              type="button"
              onClick={() => {
                playSound('click');
                onToggleWeather?.();
              }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-2xs cursor-pointer border ${
                isWeatherEnabled
                  ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-500/40 hover:bg-sky-200 dark:hover:bg-sky-900'
                  : 'bg-slate-200/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-white/10 opacity-60'
              }`}
              title={
                isWeatherEnabled
                  ? `Hiệu ứng: ${info.label} (Bấm để tắt)`
                  : `Hiệu ứng: ${info.label} (Bấm để bật)`
              }
              aria-label="Hiệu ứng thời tiết"
            >
              <span className="text-sm select-none">{info.icon}</span>
            </button>
          );
        })()}

        {/* Live Hanoi Clock & Target Study Goal (Icon Only) */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenTargetClock?.();
          }}
          className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/50 flex items-center justify-center shadow-2xs cursor-pointer"
          title={`Giờ Hà Nội: ${hanoiTime} • Bấm mở Đồng hồ mục tiêu & Vết thời gian`}
          aria-label="Đồng hồ Giờ Hà Nội"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        </button>

        {/* Analytics Dashboard Button (Icon Only) */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenAnalytics?.();
          }}
          className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-500/40 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
          title="Xem phân tích & tiến độ học tập SM-2"
          aria-label="Tiến độ học tập"
        >
          <BarChart2 className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-300" />
        </button>

        {/* Wallet Balance Pill (Icon Only) */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onSelectTab('wallet');
          }}
          className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
          title={`Ví Xu: ${walletBalance} Xu (Bấm để nạp/rút tiền)`}
          aria-label="Ví Xu"
        >
          <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500" />
        </button>

        {/* Streak Pill (Icon Only) */}
        <button
          type="button"
          onClick={() => {
            playSound('flip');
            onOpenLeaderboard?.();
          }}
          className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/80 hover:bg-orange-200 dark:hover:bg-orange-900 text-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-500/40 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
          title={`Chuỗi học tập liên tục: ${streakInfo.streak} ngày (Bấm mở Bảng Vàng)`}
          aria-label="Chuỗi học tập"
        >
          <span className="text-sm select-none">{currentTheme?.icons?.streak || '🔥'}</span>
        </button>

        {/* Daily Check-in Button (Icon Only) */}
        <button
          type="button"
          onClick={handleCheckIn}
          className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
          title="Điểm danh mỗi ngày nhận Xu miễn phí"
          aria-label="Điểm danh nhận Xu"
        >
          <span className="text-sm select-none">{currentTheme?.icons?.checkin || '🎁'}</span>
        </button>

        {/* Audio Mute/Unmute (Icon Only) */}
        <button
          type="button"
          onClick={handleToggleMute}
          className="w-8 h-8 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          title={isMuted ? "Bật âm thanh hiệu ứng" : "Tắt âm thanh"}
          aria-label="Bật/Tắt âm thanh"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          )}
        </button>

        {/* Notification Bell (Icon Only) */}
        <div className="relative">
          <button
            type="button"
            onClick={handleOpenNotifications}
            className="w-8 h-8 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10 flex items-center justify-center transition-colors relative cursor-pointer"
            title="Thông báo hệ thống"
            aria-label="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-white/15 p-3 space-y-2 z-50 text-left">
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

        {/* User Profile / Auth Button (Icon Only) */}
        {user ? (
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/70 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
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
            className="w-8 h-8 rounded-lg bg-[#2383e2] hover:bg-[#1d6fc2] text-white flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
            title="Đăng Nhập / Quản lý Tài Khoản"
            aria-label="Đăng Nhập"
          >
            <User className="w-4 h-4" />
          </button>
        )}

      </div>
    </header>
  );
}
