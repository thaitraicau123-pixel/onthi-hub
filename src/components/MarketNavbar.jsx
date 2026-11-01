import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Cpu,
  Sliders,
  FolderLock,
  Coins,
  Flame,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Menu,
  X,
  Scroll,
  Tv
} from 'lucide-react';
import { playClick, playHoverTick, playSuccess, isSoundMuted, toggleSoundMute } from '../utils/soundEngine';
import { performDailyCheckIn } from '../utils/userTier';
import { getStreakInfo } from '../utils/gamification';

export default function MarketNavbar({
  activeTab,
  onSwitchTab,
  walletBalance = 20,
  onOpenWallet,
  onSwitchToDeck,
  sleepMode,
  onToggleTheme,
  onShowToast
}) {
  const [muted, setMuted] = useState(() => isSoundMuted());
  const [streakInfo, setStreakInfo] = useState(() => getStreakInfo());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleMuteChange = (e) => {
      setMuted(e.detail?.muted ?? isSoundMuted());
    };
    window.addEventListener('sound-mute-change', handleMuteChange);
    window.addEventListener('thai-sound-mute-change', handleMuteChange);
    return () => {
      window.removeEventListener('sound-mute-change', handleMuteChange);
      window.removeEventListener('thai-sound-mute-change', handleMuteChange);
    };
  }, []);

  const handleToggleSound = () => {
    const next = toggleSoundMute();
    setMuted(next);
    if (!next) playClick();
  };

  const handleCheckIn = () => {
    playSuccess();
    const res = performDailyCheckIn();
    if (res.success) {
      onShowToast?.(`🎉 ${res.message}! Nhận ngay ${res.reward || 5} Xu!`);
      setStreakInfo(getStreakInfo());
    } else {
      onShowToast?.(`🔥 ${res.message || 'Bạn đã điểm danh hôm nay rồi!'}`);
    }
  };

  const navLinks = [
    { id: 'marketplace', label: 'Chợ Prompts', icon: ShoppingBag },
    { id: 'skills', label: 'Kho AI Skills', icon: Cpu, badge: '238+' },
    { id: 'studio', label: 'Prompt Studio', icon: Sliders },
    { id: 'library', label: 'Kho Của Tôi', icon: FolderLock },
    { id: 'wallet', label: 'Ví Xu', icon: Coins }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-white/85 dark:bg-stone-950/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              playClick();
              onSwitchTab('marketplace');
            }}
            onMouseEnter={playHoverTick}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-black font-extrabold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-stone-900 dark:text-white tracking-tight text-base flex items-center gap-1.5 leading-none">
                CHỢ PROMPTS
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                  MMO
                </span>
              </span>
              <span className="text-[10px] font-mono text-stone-400 tracking-wider uppercase mt-0.5">
                STUDIO EDITION
              </span>
            </div>
          </button>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    playClick();
                    onSwitchTab(link.id);
                  }}
                  onMouseEnter={playHoverTick}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-black shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Status Actions & Pills */}
        <div className="flex items-center gap-2">
          
          {/* LOOKBOOK 60FPS SWITCH BUTTON (BÙI THÁI STUDIO) */}
          <button
            type="button"
            onClick={() => {
              playSuccess();
              onSwitchToDeck?.();
            }}
            onMouseEnter={playHoverTick}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-500/25 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold hover:bg-amber-500 hover:text-black transition-all cursor-pointer active:scale-95 shadow-xs"
            title="Mở Chế Độ Trình Chiếu Lookbook 60fps"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Lookbook 60fps</span>
          </button>

          {/* VÍ XU PILL */}
          <button
            type="button"
            onClick={() => {
              playClick();
              onOpenWallet?.();
            }}
            onMouseEnter={playHoverTick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold hover:bg-amber-500/20 transition-all cursor-pointer"
            title="Xem số dư & nạp Xu"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-mono-numbers">{walletBalance}</span>
            <span className="text-[10px] font-normal text-stone-500">Xu</span>
          </button>

          {/* STREAK & ĐIỂM DANH */}
          <button
            type="button"
            onClick={handleCheckIn}
            onMouseEnter={playHoverTick}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-700 dark:text-orange-400 text-xs font-mono font-semibold hover:bg-orange-500/20 transition-all cursor-pointer"
            title="Bấm để điểm danh nhận Xu mỗi ngày"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span>{streakInfo?.currentStreak || 1} ngày</span>
          </button>

          {/* SOUND TOGGLE */}
          <button
            type="button"
            onClick={handleToggleSound}
            onMouseEnter={playHoverTick}
            className="w-8 h-8 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-all cursor-pointer"
            title={muted ? 'Bật âm thanh Haptic' : 'Tắt âm thanh'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-500" />}
          </button>

          {/* DARK / LIGHT THEME TOGGLE */}
          <button
            type="button"
            onClick={() => {
              playClick();
              onToggleTheme?.();
            }}
            onMouseEnter={playHoverTick}
            className="w-8 h-8 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-all cursor-pointer"
            title="Đổi giao diện Sáng / Tối"
          >
            {sleepMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 p-4 space-y-2 animate-studio-rise">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  playClick();
                  onSwitchTab(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold ${
                  isActive
                    ? 'bg-amber-500 text-black font-bold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <button
              onClick={() => {
                onSwitchToDeck?.();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold text-center"
            >
              Mở Chế Độ Trình Chiếu Lookbook
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
