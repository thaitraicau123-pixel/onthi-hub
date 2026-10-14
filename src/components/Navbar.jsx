import React, { useState } from 'react';
import {
  Menu,
  X,
  BookOpen,
  Home,
  Store,
  PlusSquare,
  FolderHeart,
  Wallet,
  Sparkles,
  User,
  Gift,
  KeyRound,
  Flame,
  Bell,
  Users,
  Check,
  Volume2,
  VolumeX,
  Coins,
  ChevronRight,
  Trophy,
  Gamepad2,
  ShieldCheck,
  ArrowRight,
  BookMarked
} from 'lucide-react';
import { performDailyCheckIn, getUserQuota, getUserTier } from '../utils/userTier';
import { getStreakInfo, getUserNotifications, markNotificationsAsRead } from '../utils/gamification';
import { playSound, isSoundMuted, toggleSoundMute } from '../utils/storage';
import { getUnmasteredMistakesCount } from '../utils/mistakeTracker';
import { APP_VERSION, isChangelogUnread } from '../data/changelogData';
import { isUserAdmin } from '../utils/adminGuard';
import confetti from 'canvas-confetti';

export default function Navbar({
  activeTab,
  onSelectTab,
  purchasedCount,
  walletBalance,
  user,
  onOpenAuth,
  onCheckInCompleted,
  onOpenLeaderboard,
  onOpenBlindBox,
  onOpenMistakes,
  onOpenChangelog
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const quota = getUserQuota();
  const streakInfo = getStreakInfo();
  const currentTier = getUserTier();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => getUserNotifications());
  const [isMuted, setIsMuted] = useState(() => isSoundMuted());

  const handleToggleMute = () => {
    const next = toggleSoundMute();
    setIsMuted(next);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const unmasteredMistakesCount = getUnmasteredMistakesCount();

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

  const handleNavigate = (tabId) => {
    playSound('flip');
    onSelectTab(tabId);
    setIsDrawerOpen(false);
  };

  // Primary desktop nav items (clean, single-line, sleek)
  const primaryDesktopNav = [
    { id: 'home', label: 'Trang Chủ', icon: Home },
    { id: 'marketplace', label: 'Chợ Thẻ C2C', icon: Store, badge: 'HOT' },
    { id: 'library', label: 'Tủ Của Tôi', icon: FolderHeart, count: purchasedCount },
    { id: 'community', label: 'Diễn Đàn', icon: Users }
  ];

  // Full categorization for 3D Drawer Menu
  const menuSections = [
    {
      title: 'Học Tập & Ôn Thi',
      items: [
        { id: 'home', label: 'Trang Chủ & Đề Thi Chuẩn', icon: Home, desc: 'Kho đề công chức 2026, IT, ngoại ngữ' },
        { id: 'marketplace', label: 'Chợ Thẻ C2C', icon: Store, badge: 'HOT', desc: 'Sàn thương mại điện tử mua bán thẻ' },
        { id: 'library', label: 'Tủ Thẻ Của Tôi', icon: FolderHeart, count: purchasedCount, desc: 'Thẻ đã mua & file xuất Anki' },
        { id: 'mistakes', label: 'Sổ Tay Câu Sai & Điểm Yếu', icon: BookMarked, badge: unmasteredMistakesCount > 0 ? `${unmasteredMistakesCount}` : '', desc: 'Luyện lại câu sai & khắc phục lỗ hổng kiến thức', action: () => { setIsDrawerOpen(false); onOpenMistakes?.(); } },
        { id: 'create', label: 'Studio Tạo Thẻ', icon: PlusSquare, desc: 'Biến ghi chú & tài liệu thành bộ thẻ học' }
      ]
    },
    {
      title: 'Cộng Đồng & Thử Thách',
      items: [
        { id: 'blindbox', label: '🎁 Túi Mù Tri Thức (Blind Box)', icon: Gift, desc: '100% trúng hoàn Xu, quà khủng & nổ hũ Jackpot', action: () => { setIsDrawerOpen(false); onOpenBlindBox?.(); } },
        { id: 'community', label: 'Diễn Đàn Học Viên', icon: Users, desc: 'Hỏi đáp đề thi, mẹo nhớ lâu' },
        { id: 'changelog', label: `✨ Bản Tin Cập Nhật Web (${APP_VERSION})`, icon: Sparkles, desc: 'Xem toàn bộ tính năng và bản sửa lỗi vừa phát hành', action: () => { setIsDrawerOpen(false); onOpenChangelog?.(); } },
        { id: 'leaderboard', label: 'Bảng Vàng & Nhiệm Vụ Ngày', icon: Trophy, desc: 'Cạnh tranh XP & giữ chuỗi streak', action: onOpenLeaderboard },
        { id: 'plans', label: 'Gói Hội Viên Plus / Pro / Ultra', icon: Sparkles, desc: 'Mở rộng hạn mức & quyền Creator' }
      ]
    },
    {
      title: 'Tài Chính & Giao Dịch',
      items: [
        { id: 'wallet', label: 'Ví Xu ÔnThiHub', icon: Wallet, highlight: `${walletBalance} Xu`, desc: 'Nạp & Rút tiền qua VietQR tự động' }
      ]
    }
  ];

  const userIsAdmin = isUserAdmin(user);

  // Dynamically attach Secret Admin Section ONLY for authorized Admin account
  const sectionsToRender = userIsAdmin
    ? [
        ...menuSections,
        {
          title: '👑 Đặc Quyền Quản Trị Hệ Thống',
          items: [
            {
              id: 'admin',
              label: 'Cửa Sổ Quản Trị Viên (Admin Portal)',
              icon: ShieldCheck,
              badge: 'ADMIN',
              desc: 'Duyệt nạp/rút tiền, duyệt sàn C2C, cấu hình đám mây & API'
            }
          ]
        }
      ]
    : menuSections;

  return (
    <>
      {/* =========================================================
          TOP NAVIGATION HEADER (TINH GIẢN, GỌN GÀNG, SANG TRỌNG)
          ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#ffffff]/90 backdrop-blur-xl border-b border-[#2383e2]/15 shadow-md shadow-black/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            
            {/* LEFT: 3-LINE HAMBURGER BUTTON & CLEAN LOGO */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
              {/* Hamburger Button (Thanh 3 Que Ngang) */}
              <button
                onClick={() => {
                  playSound('flip');
                  setIsDrawerOpen(true);
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all hover:scale-105 active:scale-95 shadow-xs flex items-center justify-center group"
                title="Mở Menu tính năng (Thanh 3 que ngang)"
              >
                <div className="w-4 h-3.5 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-[#2383e2] group-hover:bg-white rounded-full transition-colors"></span>
                  <span className="w-3/4 h-0.5 bg-white group-hover:bg-[#2383e2] rounded-full transition-colors"></span>
                  <span className="w-full h-0.5 bg-[#2383e2] group-hover:bg-white rounded-full transition-colors"></span>
                </div>
              </button>

              {/* Brand Logo - Streamlined */}
              <div
                onClick={() => handleNavigate('home')}
                className="flex items-center space-x-2 cursor-pointer select-none"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#2383e2] to-[#1a73e8] flex items-center justify-center text-white shadow-md shadow-blue-900/30 transform transition-transform hover:scale-105">
                  <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
                    ÔnThi<span className="text-[#2383e2]">Hub</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound('flip');
                      onOpenChangelog?.();
                    }}
                    className="relative text-[9px] font-black px-2 py-0.5 rounded-full bg-[#2383e2]/20 hover:bg-[#2383e2] text-[#2383e2] hover:text-white border border-[#2383e2]/40 uppercase transition-all flex items-center space-x-1 cursor-pointer"
                    title="Bấm để xem Bảng Tin Tính Năng Mới (What's New)"
                  >
                    <span>{APP_VERSION}</span>
                    {isChangelogUnread() && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* CENTER: DESKTOP PRIMARY TABS (Segmented Pill - Never Wraps) */}
            <nav className="hidden lg:flex items-center space-x-1 bg-white/5 p-1 rounded-2xl border border-white/10">
              {primaryDesktopNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`whitespace-nowrap flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#2383e2] text-white shadow-sm font-black'
                        : 'text-[#37352f]/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-rose-300'}`} />
                    <span>{item.label}</span>

                    {item.badge && (
                      <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 animate-pulse">
                        {item.badge}
                      </span>
                    )}

                    {item.count > 0 && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-white text-[#2383e2]">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* RIGHT: COMPACT UTILITIES TOOLBAR */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              
              {/* BẢNG TIN CẬP NHẬT (WHAT'S NEW) */}
              <button
                onClick={() => {
                  playSound('flip');
                  onOpenChangelog?.();
                }}
                className="relative flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 hover:from-amber-500/30 hover:to-pink-500/30 text-amber-200 border border-amber-400/30 text-xs font-black transition-transform transform hover:scale-105 active:scale-95 whitespace-nowrap shadow-xs"
                title="Bấm để xem Bảng Tin Tính Năng Cập Nhật Mới"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="hidden lg:inline">Bản Mới</span>
                {isChangelogUnread() && (
                  <span className="w-2 h-2 rounded-full bg-[#2383e2] animate-ping ml-0.5"></span>
                )}
              </button>

              {/* SỔ TAY CÂU SAI - Compact Pill */}
              {unmasteredMistakesCount > 0 && (
                <button
                  onClick={() => {
                    playSound('flip');
                    onOpenMistakes?.();
                  }}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-transform transform hover:scale-105 active:scale-95 whitespace-nowrap"
                  title="Mở Sổ Tay Câu Sai & Điểm Yếu"
                >
                  <BookMarked className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden md:inline">Câu Sai</span>
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                    {unmasteredMistakesCount}
                  </span>
                </button>
              )}

              {/* TÚI MÙ (BLIND BOX) - Sleek Compact Button */}
              <button
                onClick={() => {
                  playSound('flip');
                  onOpenBlindBox?.();
                }}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#2383e2] hover:brightness-110 text-white text-xs font-black shadow-xs transition-transform transform hover:scale-105 active:scale-95 whitespace-nowrap"
                title="Khui Túi Mù Tri Thức 100% Trúng Thưởng"
              >
                <Gift className="w-3.5 h-3.5 animate-bounce" />
                <span className="hidden sm:inline">Túi Mù</span>
              </button>

              {/* VÍ XU - Sleek Compact Pill */}
              <button
                onClick={() => handleNavigate('wallet')}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/25 text-xs font-bold font-mono transition-transform transform hover:scale-105 active:scale-95 whitespace-nowrap"
                title="Bấm để mở Ví Xu & nạp/rút tiền"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{walletBalance} Xu</span>
              </button>

              {/* DUOLINGO STREAK - Compact Pill */}
              <button
                onClick={onOpenLeaderboard}
                className="hidden sm:flex items-center space-x-1 px-2 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/25 text-xs font-bold transition-transform transform hover:scale-105 active:scale-95 whitespace-nowrap"
                title="Chuỗi ngày học tập liên tiếp"
              >
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                <span>{streakInfo.streak}d</span>
              </button>

              {/* NOTIFICATION BELL */}
              <div className="relative">
                <button
                  onClick={handleOpenNotifications}
                  className="relative p-2 rounded-xl text-[#37352f]/80 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                  title="Thông báo hệ thống"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#2383e2] text-white rounded-full text-[8px] font-black flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#ffffff] rounded-2xl shadow-2xl border border-[#2383e2]/30 p-3 z-50 animate-spring-3d text-xs space-y-2 text-[#37352f]">
                    <div className="flex items-center justify-between border-b border-[#2383e2]/20 pb-2 px-1">
                      <strong className="text-white font-bold">Thông Báo Của Bạn</strong>
                      <span className="text-[10px] text-rose-300 font-medium">Đã đọc tất cả</span>
                    </div>

                    <div className="space-y-1.5 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 bg-[#f7f6f5] hover:bg-[#efeeec] rounded-xl transition-colors space-y-0.5 border border-[#2383e2]/10"
                        >
                          <div className="font-bold text-white text-xs">{n.title}</div>
                          <p className="text-[11px] text-[#787774]">{n.message}</p>
                          <span className="text-[10px] text-rose-400 block pt-0.5">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* USER PROFILE PILL - Matched with Image 2 (Khách / User) */}
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 p-1 sm:pr-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition-all transform hover:scale-105 active:scale-95"
                title="Quản lý Tài khoản"
              >
                {user ? (
                  <>
                    <img
                      src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full object-cover border border-[#2383e2]"
                    />
                    <span className="hidden sm:inline max-w-[85px] truncate text-[11px] font-bold">
                      {user.displayName || user.email.split('@')[0]}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-[#4f46e5] text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                      K
                    </div>
                    <span className="hidden sm:inline text-[11px] font-bold text-[#37352f]">
                      Khách
                    </span>
                  </>
                )}
              </button>

              {/* ADMIN SPECIAL BADGE (ONLY FOR VERIFIED ADMIN ACCOUNT) */}
              {userIsAdmin && (
                <button
                  onClick={() => handleNavigate('admin')}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-400/30 text-amber-300 border border-amber-400/50 text-xs font-black transition-transform transform hover:scale-105 active:scale-95 shadow-md shadow-amber-950/40 cursor-pointer"
                  title="Cửa sổ Quản trị viên (Chỉ tài khoản Admin mới thấy)"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>👑 Admin</span>
                </button>
              )}

            </div>

          </div>
        </div>
      </header>


      {/* =========================================================
          3D SLIDE-OUT DRAWER MENU (BẤM THANH 3 QUE NGANG NẢY RA 3D)
          ========================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
          
          {/* Backdrop Blur */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* 3D Drawer Panel */}
          <div className="absolute inset-y-0 left-0 max-w-sm sm:max-w-md w-full bg-[#ffffff] text-white shadow-2xl border-r border-[#2383e2]/30 flex flex-col justify-between z-10 animate-drawer-3d overflow-hidden">
            
            {/* Drawer Top Header */}
            <div className="p-5 border-b border-[#2383e2]/20 flex items-center justify-between bg-[#fbfbfa]">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#2383e2] flex items-center justify-center text-white shadow-md shadow-blue-900/40">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight uppercase">ÔnThiHub Menu</h3>
                  <p className="text-[10px] text-[#787774]/60">Khám phá toàn bộ tính năng ôn thi</p>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl text-[#787774] hover:text-white hover:bg-white/10 transition-colors"
                title="Đóng menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-6">
              
              {/* User Status & 3D Check-in Card (Wayground Sunset Gradient) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'guest'}`}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full border-2 border-white/60 object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-black truncate">{user?.displayName || 'Học Viên ÔnThiHub'}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-yellow-200 uppercase">
                          Gói: {currentTier.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-amber-300 block font-mono">{walletBalance} Xu</span>
                      <span className="text-[10px] text-[#37352f]">Số dư khả dụng</span>
                    </div>
                  </div>

                  {/* 3D Check-in Button inside Drawer */}
                  <button
                    onClick={handleCheckIn}
                    className={`mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-black shadow-md flex items-center justify-center space-x-2 transition-transform transform active:scale-95 ${
                      quota.isCheckedInToday
                        ? 'bg-white/20 text-[#37352f] cursor-default'
                        : 'bg-[#f7f6f5] hover:bg-[#efeeec] text-[#37352f] animate-pulse'
                    }`}
                  >
                    <Gift className="w-4 h-4 text-rose-600" />
                    <span>{quota.isCheckedInToday ? '✓ Đã Điểm Danh Hôm Nay' : `🎁 Điểm Danh (+${quota.tierConfig?.checkInBonus || 1} Lượt Tạo Thẻ AI)`}</span>
                  </button>
                </div>
              </div>

              {/* Categorized Menu Sections */}
              {sectionsToRender.map((section, sIdx) => (
                <div key={sIdx} className="space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#ff70aa] px-1">
                    {section.title}
                  </span>

                  <div className="space-y-1.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.action) {
                              item.action();
                              setIsDrawerOpen(false);
                            } else {
                              handleNavigate(item.id);
                            }
                          }}
                          className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all btn-3d ${
                            isActive
                              ? 'bg-[#2383e2] text-white shadow-lg shadow-blue-950/60 border border-blue-400/40'
                              : 'bg-[#f7f6f5] hover:bg-[#efeeec] text-[#37352f] border border-[#2383e2]/15'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isActive ? 'bg-white text-[#2383e2] shadow-xs' : 'bg-[#efeeec] text-[#2383e2]'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center space-x-1.5">
                                <span className="text-xs sm:text-sm font-bold truncate">{item.label}</span>
                                {item.badge && (
                                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950">
                                    {item.badge}
                                  </span>
                                )}
                                {item.count > 0 && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white text-[#2383e2]">
                                    {item.count}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-rose-300/70 truncate mt-0.5">{item.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {item.highlight && (
                              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                {item.highlight}
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-rose-400" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            </div>

            {/* Drawer Footer Controls */}
            <div className="p-4 bg-[#fbfbfa] border-t border-[#2383e2]/20 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#787774]">
                
                {/* Quizizz Style Indicator */}
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#f7f6f5] border border-[#2383e2]/30 text-[#37352f]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Quizizz Style</span>
                </div>

                {/* Sound Mute Toggle */}
                <button
                  onClick={handleToggleMute}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                    isMuted
                      ? 'border-rose-400/40 text-rose-400 bg-rose-950/40'
                      : 'border-[#2383e2]/30 text-[#37352f] bg-[#f7f6f5] hover:bg-[#efeeec]'
                  }`}
                  title="Bật/Tắt âm thanh"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isMuted ? 'Tắt Âm' : 'Bật Âm'}</span>
                </button>

                {/* Secret Admin Portal Key */}
                <button
                  onClick={() => handleNavigate('admin')}
                  className="p-2 rounded-xl text-rose-400 hover:text-[#787774] hover:bg-white/10 transition-colors"
                  title="⚙️ Secret Admin Portal (Ctrl+Shift+A)"
                >
                  <KeyRound className="w-4 h-4" />
                </button>

              </div>

              <div className="text-center text-[10px] text-rose-400/60">
                ÔnThiHub v2.2 • Tinh Giản & Hiện Đại
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          MOBILE STICKY BOTTOM NAVIGATION BAR (GỌN GÀNG, TINH TẾ)
          ========================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-t border-[#2383e2]/20 px-3 py-2 flex items-center justify-around shadow-lg">
        
        <button
          onClick={() => handleNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'home' ? 'text-[#2383e2] font-black' : 'text-[#787774]/70'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'scale-110' : ''}`} />
          <span className="mt-0.5">Trang Chủ</span>
        </button>

        <button
          onClick={() => handleNavigate('marketplace')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all relative ${
            activeTab === 'marketplace' ? 'text-[#2383e2] font-black' : 'text-[#787774]/70'
          }`}
        >
          <div className="relative">
            <Store className={`w-5 h-5 ${activeTab === 'marketplace' ? 'scale-110' : ''}`} />
            <span className="absolute -top-1 -right-2 w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
          </div>
          <span className="mt-0.5">Chợ C2C</span>
        </button>

        <button
          onClick={() => handleNavigate('library')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all relative ${
            activeTab === 'library' ? 'text-[#2383e2] font-black' : 'text-[#787774]/70'
          }`}
        >
          <div className="relative">
            <FolderHeart className={`w-5 h-5 ${activeTab === 'library' ? 'scale-110' : ''}`} />
            {purchasedCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#2383e2] text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {purchasedCount}
              </span>
            )}
          </div>
          <span className="mt-0.5">Tủ Của Tôi</span>
        </button>

        {/* 4th Mobile button: 3-line Menu (Hamburger) to open Drawer */}
        <button
          onClick={() => {
            playSound('flip');
            setIsDrawerOpen(true);
          }}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold text-[#37352f] hover:text-white transition-all"
        >
          <div className="w-4 h-3.5 flex flex-col justify-between my-0.5">
            <span className="w-full h-0.5 bg-[#2383e2] rounded-full"></span>
            <span className="w-3/4 h-0.5 bg-white rounded-full"></span>
            <span className="w-full h-0.5 bg-[#2383e2] rounded-full"></span>
          </div>
          <span className="mt-0.5">Menu ☰</span>
        </button>

      </div>
    </>
  );
}
