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
  Sun,
  Moon,
  Coffee,
  Volume2,
  VolumeX,
  Coins,
  ChevronRight,
  Trophy,
  Gamepad2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { performDailyCheckIn, getUserQuota, getUserTier } from '../utils/userTier';
import { getStreakInfo, getUserNotifications, markNotificationsAsRead } from '../utils/gamification';
import { playSound, isSoundMuted, toggleSoundMute } from '../utils/storage';
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
  theme = 'light',
  onCycleTheme
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

  // Primary desktop nav items (clean & spacious)
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
        { id: 'create', label: 'Studio Tạo Thẻ AI', icon: PlusSquare, desc: 'Biến tài liệu thành flashcard trong 3s' }
      ]
    },
    {
      title: 'Cộng Đồng & Thử Thách',
      items: [
        { id: 'blindbox', label: '🎁 Túi Mù Tri Thức (Blind Box)', icon: Gift, desc: '100% trúng hoàn Xu, quà khủng & nổ hũ Jackpot', action: () => { setIsDrawerOpen(false); onOpenBlindBox?.(); } },
        { id: 'community', label: 'Diễn Đàn Học Viên', icon: Users, desc: 'Hỏi đáp đề thi, mẹo nhớ lâu' },
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

  return (
    <>
      {/* =========================================================
          TOP NAVIGATION HEADER (Wayground / Quizizz Style)
          ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#240618]/95 backdrop-blur-md border-b border-[#f02c85]/20 shadow-lg shadow-black/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
            
            {/* LEFT: 3-LINE HAMBURGER BUTTON (THANH 3 QUE NGANG) & LOGO */}
            <div className="flex items-center space-x-3">
              {/* Hamburger Button (Thanh 3 Que Ngang) */}
              <button
                onClick={() => {
                  playSound('flip');
                  setIsDrawerOpen(true);
                }}
                className="p-2 sm:p-2.5 rounded-2xl bg-[#360b24] hover:bg-[#4d1033] text-white border border-[#f02c85]/30 transition-all transform hover:scale-105 active:scale-95 shadow-xs flex items-center justify-center group"
                title="Mở Menu điều hướng (Thanh 3 que ngang)"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-[#f02c85] group-hover:bg-white rounded-full transition-colors"></span>
                  <span className="w-3/4 h-0.5 bg-white group-hover:bg-[#f02c85] rounded-full transition-colors"></span>
                  <span className="w-full h-0.5 bg-[#f02c85] group-hover:bg-white rounded-full transition-colors"></span>
                </div>
              </button>

              {/* Brand Logo (WAYGROUND / Quizizz Style) */}
              <div
                onClick={() => handleNavigate('home')}
                className="flex items-center space-x-2.5 cursor-pointer shrink-0"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#f02c85] flex items-center justify-center text-white shadow-md shadow-pink-900/40 transform transition-transform hover:scale-105">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xl sm:text-2xl font-black text-[#f02c85] tracking-tight uppercase">
                      ÔnThiHub
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#f02c85]/20 text-[#ff80b5] border border-[#f02c85]/30 uppercase">
                      v2.2
                    </span>
                  </div>
                  <p className="text-[10px] text-rose-200/60 hidden sm:block font-medium">
                    Học Tập & Sàn Flashcard Tri Thức
                  </p>
                </div>
              </div>
            </div>

            {/* CENTER: DESKTOP PRIMARY TABS (Wayground style) */}
            <nav className="hidden lg:flex items-center space-x-1.5 h-full">
              {primaryDesktopNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`relative flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                      isActive
                        ? 'bg-[#f02c85] text-white shadow-md shadow-pink-900/50'
                        : 'text-rose-100/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-rose-300'}`} />
                    <span>{item.label}</span>

                    {item.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 animate-pulse">
                        {item.badge}
                      </span>
                    )}

                    {item.count > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white text-[#f02c85]">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* RIGHT: ESSENTIAL UTILITIES (Wayground Cream & Pink Buttons) */}
            <div className="flex items-center space-x-2 sm:space-x-2.5">
              
              {/* QUICK BLIND BOX BUTTON */}
              <button
                onClick={() => {
                  playSound('flip');
                  onOpenBlindBox?.();
                }}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#f02c85] hover:brightness-110 text-white text-xs font-black shadow-md shadow-pink-900/40 transition-transform transform hover:scale-105 active:scale-95"
                title="Khui Túi Mù Tri Thức 100% Trúng Thưởng"
              >
                <Gift className="w-3.5 h-3.5 animate-bounce" />
                <span>Túi Mù (5 Xu)</span>
              </button>

              {/* WALLET XU PILL (Warm Cream Button - like Wayground "Nhận báo giá") */}
              <button
                onClick={() => handleNavigate('wallet')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#fcf5e5] hover:bg-[#f6ebd5] text-[#2c081c] border border-amber-300/80 text-xs font-black shadow-sm transition-transform transform hover:scale-105 active:scale-95"
                title="Bấm để mở Ví Xu & nạp/rút tiền"
              >
                <Coins className="w-4 h-4 text-amber-600" />
                <span className="font-mono">{walletBalance} Xu</span>
              </button>

              {/* DUOLINGO STREAK BUTTON */}
              <button
                onClick={onOpenLeaderboard}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-[#ff5f38]/20 hover:bg-[#ff5f38]/30 text-[#ff8c70] border border-[#ff5f38]/40 text-xs font-black transition-transform transform hover:scale-105 active:scale-95"
                title="Chuỗi ngày học tập liên tiếp"
              >
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{streakInfo.streak}d</span>
              </button>

              {/* NOTIFICATION BELL */}
              <div className="relative">
                <button
                  onClick={handleOpenNotifications}
                  className="relative p-2 rounded-xl text-rose-100/80 hover:text-white hover:bg-white/10 border border-white/15 transition-colors"
                  title="Thông báo hệ thống"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f02c85] text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#260619] rounded-2xl shadow-2xl border border-[#f02c85]/30 p-3 z-50 animate-spring-3d text-xs space-y-2 text-rose-100">
                    <div className="flex items-center justify-between border-b border-[#f02c85]/20 pb-2 px-1">
                      <strong className="text-white font-bold">Thông Báo Của Bạn</strong>
                      <span className="text-[10px] text-rose-300 font-medium">Đã đọc tất cả</span>
                    </div>

                    <div className="space-y-1.5 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 bg-[#360b24] hover:bg-[#4d1033] rounded-xl transition-colors space-y-0.5 border border-[#f02c85]/10"
                        >
                          <div className="font-bold text-white text-xs">{n.title}</div>
                          <p className="text-[11px] text-rose-200">{n.message}</p>
                          <span className="text-[10px] text-rose-400 block pt-0.5">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* USER AUTH / SIGN IN (Electric Hot Pink - like Wayground "Đăng ký") */}
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-[#f02c85] hover:bg-[#dc1f74] shadow-md shadow-pink-900/40 transition-transform transform hover:scale-105 active:scale-95"
              >
                {user ? (
                  <>
                    <img
                      src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt="Avatar"
                      className="w-5 h-5 rounded-full object-cover border border-white"
                    />
                    <span className="hidden sm:inline max-w-[80px] truncate">{user.displayName || user.email.split('@')[0]}</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">Đăng ký / Đăng nhập</span>
                  </>
                )}
              </button>

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
          <div className="absolute inset-y-0 left-0 max-w-sm sm:max-w-md w-full bg-[#260619] text-white shadow-2xl border-r border-[#f02c85]/30 flex flex-col justify-between z-10 animate-drawer-3d overflow-hidden">
            
            {/* Drawer Top Header */}
            <div className="p-5 border-b border-[#f02c85]/20 flex items-center justify-between bg-[#1d0413]">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#f02c85] flex items-center justify-center text-white shadow-md shadow-pink-900/40">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight uppercase">ÔnThiHub Menu</h3>
                  <p className="text-[10px] text-rose-200/60">Khám phá toàn bộ tính năng ôn thi</p>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl text-rose-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Đóng menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-6">
              
              {/* User Status & 3D Check-in Card (Wayground Sunset Gradient) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#ff5f38] via-[#e61e78] to-[#990a4a] text-white shadow-xl shadow-pink-950/50 relative overflow-hidden">
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
                      <span className="text-[10px] text-rose-100">Số dư khả dụng</span>
                    </div>
                  </div>

                  {/* 3D Check-in Button inside Drawer */}
                  <button
                    onClick={handleCheckIn}
                    className={`mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-black shadow-md flex items-center justify-center space-x-2 transition-transform transform active:scale-95 ${
                      quota.isCheckedInToday
                        ? 'bg-white/20 text-rose-100 cursor-default'
                        : 'bg-[#fff7e6] hover:bg-[#faebd0] text-[#2c081c] animate-pulse'
                    }`}
                  >
                    <Gift className="w-4 h-4 text-rose-600" />
                    <span>{quota.isCheckedInToday ? '✓ Đã Điểm Danh Hôm Nay (+5 Xu)' : '🎁 Điểm Danh Nhận Quà (+5 Xu)'}</span>
                  </button>
                </div>
              </div>

              {/* Categorized Menu Sections */}
              {menuSections.map((section, sIdx) => (
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
                              ? 'bg-[#f02c85] text-white shadow-lg shadow-pink-950/60 border border-pink-400/40'
                              : 'bg-[#340b22] hover:bg-[#481132] text-rose-50 border border-[#f02c85]/15'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isActive ? 'bg-white text-[#f02c85] shadow-xs' : 'bg-[#4d1033] text-[#ff80b5]'
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
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white text-[#f02c85]">
                                    {item.count}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-rose-300/70 truncate mt-0.5">{item.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {item.highlight && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#fff7e6] text-[#2c081c]">
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

            {/* Drawer Bottom Bar: Theme Switcher, Sound Mute, Admin Hotkey */}
            <div className="p-4 bg-[#1d0413] border-t border-[#f02c85]/20 space-y-3">
              <div className="flex items-center justify-between">
                
                {/* Theme Switcher 3-Button Group */}
                <div className="flex items-center space-x-1 bg-[#340b22] p-1 rounded-xl border border-[#f02c85]/20 shadow-xs">
                  <button
                    onClick={onCycleTheme}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-100 hover:text-white transition-colors"
                    title="Chuyển chế độ giao diện"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Ban Đêm</span>
                      </>
                    ) : theme === 'sepia' ? (
                      <>
                        <Coffee className="w-3.5 h-3.5 text-amber-500" />
                        <span>Giấy Ấm</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Quizizz Style</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Sound Mute Toggle */}
                <button
                  onClick={handleToggleMute}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                    isMuted
                      ? 'border-rose-400/40 text-rose-400 bg-rose-950/40'
                      : 'border-[#f02c85]/30 text-rose-100 bg-[#340b22] hover:bg-[#481132]'
                  }`}
                  title="Bật/Tắt âm thanh"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isMuted ? 'Tắt Âm' : 'Bật Âm'}</span>
                </button>

                {/* Secret Admin Portal Key */}
                <button
                  onClick={() => handleNavigate('admin')}
                  className="p-2 rounded-xl text-rose-400 hover:text-rose-200 hover:bg-white/10 transition-colors"
                  title="⚙️ Secret Admin Portal (Ctrl+Shift+A)"
                >
                  <KeyRound className="w-4 h-4" />
                </button>

              </div>

              <div className="text-center text-[10px] text-rose-400/60">
                ÔnThiHub v2.2 • Phong cách Wayground & Quizizz
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          MOBILE STICKY BOTTOM NAVIGATION BAR (WAYGROUND PLUM THEME)
          ========================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#240618]/95 backdrop-blur-md border-t border-[#f02c85]/20 px-3 py-2 flex items-center justify-around shadow-lg">
        
        <button
          onClick={() => handleNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'home' ? 'text-[#f02c85] font-black' : 'text-rose-200/70'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'scale-110' : ''}`} />
          <span className="mt-0.5">Trang Chủ</span>
        </button>

        <button
          onClick={() => handleNavigate('marketplace')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all relative ${
            activeTab === 'marketplace' ? 'text-[#f02c85] font-black' : 'text-rose-200/70'
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
            activeTab === 'library' ? 'text-[#f02c85] font-black' : 'text-rose-200/70'
          }`}
        >
          <div className="relative">
            <FolderHeart className={`w-5 h-5 ${activeTab === 'library' ? 'scale-110' : ''}`} />
            {purchasedCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#f02c85] text-white rounded-full text-[9px] flex items-center justify-center font-bold">
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
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold text-rose-100 hover:text-white transition-all"
        >
          <div className="w-5 h-4 flex flex-col justify-between my-0.5">
            <span className="w-full h-0.5 bg-[#f02c85] rounded-full"></span>
            <span className="w-3/4 h-0.5 bg-white rounded-full"></span>
            <span className="w-full h-0.5 bg-[#f02c85] rounded-full"></span>
          </div>
          <span className="mt-0.5">Menu ☰</span>
        </button>

      </div>
    </>
  );
}
