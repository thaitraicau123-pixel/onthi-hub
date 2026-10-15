import React, { useState } from 'react';
import {
  PanelLeft,
  Flame,
  Gift,
  Bell,
  Volume2,
  VolumeX,
  Coins,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  Sparkles,
  BarChart2,
  Palette
} from 'lucide-react';
import { performDailyCheckIn } from '../utils/userTier';
import { getStreakInfo, getUserNotifications, markNotificationsAsRead } from '../utils/gamification';
import { playSound, isSoundMuted, toggleSoundMute } from '../utils/storage';
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
  onOpenThemePicker
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => getUserNotifications());
  const [isMuted, setIsMuted] = useState(() => isSoundMuted());
  const streakInfo = getStreakInfo();

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
    <header className="sticky top-0 z-30 h-11 bg-white/90 backdrop-blur-md border-b border-[#e9e9e8] flex items-center justify-between px-3 sm:px-5 select-none text-xs text-[#37352f]">
      {/* LEFT: SIDEBAR TOGGLE & NOTION BREADCRUMB */}
      <div className="flex items-center space-x-2 min-w-0">
        
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => {
            playSound('click');
            onToggleSidebar();
          }}
          className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-[rgba(55,53,47,0.08)] rounded-md transition-colors shrink-0"
          title={sidebarOpen ? "Thu gọn thanh bên" : "Mở rộng thanh bên (Ctrl + \\)"}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Notion Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 truncate">
          <span
            onClick={() => onSelectTab('home')}
            className="text-[#787774] hover:text-[#37352f] cursor-pointer transition-colors truncate"
          >
            🎓 Ôn Thi Hub
          </span>
          <span className="text-[#9b9a97]">/</span>
          <span className="font-semibold text-[#37352f] flex items-center space-x-1 truncate">
            <span className="text-sm shrink-0">{currentBreadcrumb.emoji}</span>
            <span className="truncate">{currentBreadcrumb.title}</span>
          </span>
        </nav>
      </div>

      {/* RIGHT: COMPACT NOTION UTILITY BADGES */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
        
        {/* Quick Command Palette Search Button */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenSearch?.();
          }}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#f7f6f5] hover:bg-[#efefed] text-[#787774] hover:text-[#37352f] border border-[#e9e9e8] text-xs transition-all cursor-pointer shadow-2xs"
          title="Mở thanh tìm kiếm & lệnh nhanh (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#9b9a97]" />
          <span>Tìm nhanh</span>
          <kbd className="text-[9px] font-mono px-1 py-0.2 rounded bg-white text-[#9b9a97] border border-[#e3e2e0]">
            Ctrl+K
          </kbd>
        </button>

        {/* Theme Picker Button (Messenger / Instagram Theme Style) */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenThemePicker?.();
          }}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 border border-purple-200/80 transition-all font-semibold shadow-2xs cursor-pointer touch-3d"
          title="Đổi chủ đề nền & icon (10 Themes Messenger / Instagram)"
        >
          <Palette className="w-3.5 h-3.5 text-purple-600" />
          <span className="hidden sm:inline">Chủ Đề</span>
        </button>

        {/* Analytics Dashboard Button */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenAnalytics?.();
          }}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#f4f0f7] hover:bg-[#eae3f1] text-[#9065b0] border border-[#e3d7ec] transition-all font-semibold shadow-2xs cursor-pointer touch-3d"
          title="Xem phân tích & tiến độ học tập SM-2"
        >
          <BarChart2 className="w-3.5 h-3.5 text-[#9065b0]" />
          <span className="hidden sm:inline">Tiến Độ</span>
        </button>

        {/* Wallet Balance Pill */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onSelectTab('wallet');
          }}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#fbf3db] hover:bg-[#f8eed0] text-[#976d57] border border-[#f4e4b7] transition-all font-semibold shadow-2xs touch-3d cursor-pointer"
          title="Bấm để mở Ví Xu & nạp tiền"
        >
          <Coins className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>{walletBalance} Xu</span>
        </button>

        {/* Streak Pill */}
        <button
          type="button"
          onClick={() => {
            playSound('flip');
            onOpenLeaderboard?.();
          }}
          className="hidden sm:flex items-center space-x-1.5 px-2 py-1 rounded-md bg-[#faece3] hover:bg-[#f6dfd2] text-[#cc782f] border border-[#f3d6c1] transition-all font-semibold touch-3d cursor-pointer"
          title={`Chuỗi học tập liên tục: ${streakInfo.currentStreak} ngày`}
        >
          <span className="text-xs select-none">{currentTheme?.icons?.streak || '🔥'}</span>
          <span>{streakInfo.currentStreak} ngày</span>
        </button>

        {/* Daily Check-in Button */}
        <button
          type="button"
          onClick={handleCheckIn}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#edf3ec] hover:bg-[#e0ece0] text-[#448361] border border-[#d3e5d7] transition-all font-semibold shadow-2xs cursor-pointer touch-3d"
          title="Điểm danh mỗi ngày nhận Xu miễn phí"
        >
          <span className="text-xs select-none">{currentTheme?.icons?.checkin || '🎁'}</span>
          <span>Điểm Danh</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={handleToggleMute}
          className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-[rgba(55,53,47,0.08)] rounded-md transition-colors"
          title={isMuted ? "Bật âm thanh hiệu ứng" : "Tắt âm thanh"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#787774]" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={handleOpenNotifications}
            className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-[rgba(55,53,47,0.08)] rounded-md transition-colors relative"
            title="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#d44c47] ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-[#e9e9e8] p-3 space-y-2 z-50 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-[#e9e9e8]">
                <span className="font-bold text-xs text-[#37352f]">Thông Báo</span>
                <span className="text-[10px] text-[#787774]">{notifications.length} tin</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-[#9b9a97] py-4">Chưa có thông báo nào</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2 rounded-lg bg-[#f7f6f5] hover:bg-[#efefed] transition-colors text-xs space-y-1 border border-[#e9e9e8]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#37352f] line-clamp-1">{notif.title}</span>
                        <span className="text-[9px] text-[#9b9a97]">{notif.time || 'Vừa xong'}</span>
                      </div>
                      <p className="text-[#787774] text-[11px] leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Auth Button */}
        {user ? (
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center space-x-1.5 p-1 rounded-md hover:bg-[rgba(55,53,47,0.08)] transition-colors cursor-pointer"
            title="Tài khoản cá nhân"
          >
            <div className="w-6 h-6 rounded-full bg-[#37352f] text-white flex items-center justify-center font-bold text-[11px]">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="px-2.5 py-1 rounded-md bg-[#2383e2] hover:bg-[#1d6fc2] text-white font-semibold text-xs shadow-2xs transition-colors"
          >
            Đăng Nhập
          </button>
        )}

      </div>
    </header>
  );
}
