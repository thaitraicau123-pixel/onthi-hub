import React, { useState } from 'react';
import {
  Home,
  Store,
  FolderHeart,
  PlusSquare,
  Users,
  Wallet,
  Sparkles,
  ShieldCheck,
  BookMarked,
  Trophy,
  Gift,
  Clock,
  Search,
  ChevronDown,
  ChevronsUpDown,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  User,
  ExternalLink,
  HelpCircle,
  Settings,
  Bell,
  PanelLeftClose,
  Coins
} from 'lucide-react';
import { isUserAdmin } from '../utils/adminGuard';
import { getUserTier } from '../utils/userTier';
import { getUnmasteredMistakesCount } from '../utils/mistakeTracker';
import { getStreakInfo, getDailyQuests } from '../utils/gamification';
import { APP_VERSION, isChangelogUnread } from '../data/changelogData';
import { playSound } from '../utils/storage';
import BrandLogo from './BrandLogo';

export default function NotionSidebar({
  isOpen,
  onToggle,
  activeTab,
  onSelectTab,
  purchasedCount = 0,
  walletBalance = 0,
  user,
  onOpenAuth,
  onOpenLeaderboard,
  onOpenBlindBox,
  onOpenMistakes,
  onOpenChangelog,
  onOpenSearch,
  onOpenAnalytics,
  currentTheme,
  onOpenThemePicker,
  onOpenTargetClock,
  onOpenStudyRoom,
  onOpenCheatSheet
}) {
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const userIsAdmin = isUserAdmin(user);
  const currentTier = getUserTier();
  const unmasteredMistakesCount = getUnmasteredMistakesCount();
  const streakInfo = getStreakInfo();
  const dailyQuests = getDailyQuests();
  const completedQuestsCount = dailyQuests.filter((q) => q.completed).length;
  const questProgressPercent = Math.round((completedQuestsCount / Math.max(1, dailyQuests.length)) * 100);

  const handleNavClick = (tabId) => {
    playSound('flip');
    onSelectTab(tabId);
  };

  const icons = currentTheme?.icons || {};

  const workspaceNavItems = [
    { id: 'home', label: 'Trang Chủ & Kho Đề', icon: Home, emoji: icons.home || '🏠', desc: 'Đề thi chuẩn & Khám phá' },
    { id: 'library', label: 'Tủ Thẻ Của Tôi', icon: FolderHeart, emoji: icons.library || '📚', count: purchasedCount, desc: 'Thẻ đã mua & Anki' },
    { id: 'create', label: 'Studio Tạo Thẻ AI', icon: PlusSquare, emoji: icons.create || '✍️', badge: 'AI', badgeColor: 'notion-pill-purple', desc: 'Tạo thẻ ghi nhớ tự động' },
    { id: 'marketplace', label: 'Chợ Thẻ C2C', icon: Store, emoji: icons.marketplace || '🏪', badge: 'HOT', desc: 'Sàn mua bán thẻ' },
    { id: 'community', label: 'Cộng Đồng Học Viên', icon: Users, emoji: icons.community || '💬', desc: 'Thảo luận & Hỏi đáp' },
  ];

  const toolsNavItems = [
    {
      id: 'study-room',
      label: 'Phòng Tự Học Ảo',
      emoji: '👥',
      badge: '🟢 Live',
      badgeColor: 'notion-pill-green',
      action: onOpenStudyRoom,
      desc: 'Học cùng 40+ sĩ tử toàn quốc & cổ vũ'
    },
    {
      id: 'cheatsheet',
      label: 'Cheatsheet Cứu Sinh',
      emoji: '📄',
      badge: '1 Trang',
      badgeColor: 'notion-pill-blue',
      action: onOpenCheatSheet,
      desc: 'Tóm tắt trọng tâm & in 1 trang trước giờ thi'
    },
    {
      id: 'target-clock',
      label: 'Đồng Hồ Mục Tiêu',
      emoji: '⏰',
      badge: 'Giờ HN',
      badgeColor: 'notion-pill-green',
      action: onOpenTargetClock,
      desc: 'Giờ Hà Nội, đồng hồ mục tiêu & vết thời gian'
    },
    {
      id: 'theme',
      label: 'Đổi Chủ Đề Nền',
      emoji: '🎨',
      badge: currentTheme?.name ? currentTheme.name.split(' ')[0] : '16 Themes',
      badgeColor: 'notion-pill-blue',
      action: onOpenThemePicker,
      desc: '16 chủ đề 3D 4K & Messenger'
    },
    {
      id: 'analytics',
      label: 'Tiến Độ & Phân Tích',
      emoji: icons.analytics || '📊',
      action: onOpenAnalytics,
      desc: 'Tỷ lệ nhớ sâu SM-2 & Biểu đồ học'
    },
    {
      id: 'mistakes',
      label: 'Sổ Tay Câu Sai',
      emoji: icons.mistakes || '📓',
      badge: unmasteredMistakesCount > 0 ? `${unmasteredMistakesCount} câu` : 'Ôn tập',
      badgeColor: unmasteredMistakesCount > 0 ? 'notion-pill-red' : 'notion-pill-gray',
      action: onOpenMistakes,
      desc: 'Ôn tập câu sai & điểm yếu'
    },
    {
      id: 'leaderboard',
      label: 'Bảng Vàng & Streak',
      emoji: icons.leaderboard || '🏆',
      badge: `🔥 ${streakInfo.streak}d`,
      badgeColor: 'notion-pill-orange',
      action: onOpenLeaderboard,
      desc: 'Bảng xếp hạng & Chuỗi học tập'
    },
    {
      id: 'blindbox',
      label: 'Túi Mù Tri Thức',
      emoji: icons.blindbox || '🎁',
      badge: '100% Trúng',
      badgeColor: 'notion-pill-yellow',
      action: onOpenBlindBox,
      desc: '100% trúng quà & nổ hũ Xu'
    },
    {
      id: 'changelog',
      label: `Bản Tin Cập Nhật`,
      emoji: icons.changelog || '✨',
      badge: isChangelogUnread() ? 'NEW' : null,
      badgeColor: 'notion-pill-blue',
      action: onOpenChangelog,
      desc: `Phiên bản v${APP_VERSION}`
    }
  ];

  const accountNavItems = [
    {
      id: 'wallet',
      label: 'Ví Xu ÔnThiHub',
      icon: Wallet,
      emoji: icons.wallet || '🪙',
      highlight: `${walletBalance} Xu`
    },
    {
      id: 'plans',
      label: 'Gói Hội Viên VIP',
      icon: Sparkles,
      emoji: '⚡',
      badge: currentTier.name !== 'FREE' ? currentTier.name : 'Nâng cấp',
      badgeColor: 'notion-pill-purple'
    }
  ];

  if (userIsAdmin) {
    accountNavItems.push({
      id: 'admin',
      label: 'Cửa Sổ Quản Trị Viên',
      icon: ShieldCheck,
      emoji: '👑',
      badge: 'ADMIN',
      badgeColor: 'notion-pill-yellow'
    });
  }

  if (!isOpen) {
    return null;
  }

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 w-64 h-screen shrink-0 ${currentTheme?.sidebarBgClass || 'bg-[#f7f6f5]/95 dark:bg-[#0f172a]/95'} border-r ${currentTheme?.borderClass || 'border-[#e9e9e8] dark:border-white/15'} text-slate-900 dark:text-white flex flex-col justify-between select-none z-40 transition-all duration-300 text-sm shadow-2xl md:shadow-none backdrop-blur-xl relative`}
      aria-label="Thanh bên điều hướng Notion"
    >
      {/* Festive Snow Cap Drip on Sidebar */}
      {currentTheme?.hasSnowCaps && (
        <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none overflow-hidden z-40">
          <svg className="w-full h-2.5" preserveAspectRatio="none" viewBox="0 0 300 10" fill="none">
            <path
              d="M0 0 L300 0 L300 3 Q270 8 240 3 Q210 0 180 5 Q150 9 120 3 Q90 0 60 6 Q30 9 0 3 Z"
              fill="#ffffff"
              fillOpacity="0.88"
            />
          </svg>
        </div>
      )}

      {/* Spooky Halloween Spiderweb on Sidebar */}
      {currentTheme?.hasWebDecor && (
        <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none overflow-hidden z-40 opacity-70">
          <svg viewBox="0 0 60 60" className="w-full h-full fill-none stroke-purple-400/50" strokeWidth="1.2">
            <path d="M60 0 Q35 5 20 20 Q5 35 0 60" />
            <path d="M60 0 L20 20" strokeWidth="1" />
            <path d="M50 0 C45 8 38 15 28 15" />
            <circle cx="20" cy="20" r="1.5" fill="#c084fc" />
          </svg>
        </div>
      )}

      {/* TOP SECTION: WORKSPACE SWITCHER & SEARCH */}
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        
        {/* Workspace Switcher Header with Synchronized BrandLogo */}
        <div className="p-3 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <div
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-slate-900/5 dark:hover:bg-white/10 cursor-pointer flex-1 min-w-0 transition-colors touch-3d"
            title="Đổi workspace hoặc thông tin tài khoản"
          >
            <BrandLogo size={26} className="shadow-xs" />
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-[13px] text-slate-900 dark:text-white truncate tracking-tight">
                  Ôn Thi Hub
                </span>
                <ChevronsUpDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300 shrink-0" />
              </div>
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">
                {user ? user.email || user.displayName : 'Khách vãng lai • Beta'}
              </span>
            </div>
          </div>

          {/* Collapse sidebar button */}
          <button
            onClick={() => {
              playSound('click');
              onToggle();
            }}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-900/10 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            title="Thu gọn thanh bên (Ctrl + \)"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Search Bar */}
        <div className="px-3 pt-3 pb-1.5">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onOpenSearch ? onOpenSearch() : handleNavClick('home');
            }}
            className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-white/15 hover:border-[#2383e2] dark:hover:border-sky-400 rounded-lg shadow-2xs transition-all hover:text-slate-950 dark:hover:text-white cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-slate-500 dark:text-sky-400" />
              <span>Tìm đề & lệnh nhanh...</span>
            </div>
            <kbd className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/15">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* SECTION 1: WORKSPACE */}
        <div className="px-2.5 pt-2.5 pb-1">
          <div className="px-2 pb-1.5 text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Không gian học tập</span>
            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">5 mục</span>
          </div>
          <nav className="space-y-1">
            {workspaceNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.desc}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[12.5px] transition-all group text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#2383e2]/15 dark:bg-sky-500/25 text-[#1458a6] dark:text-white font-extrabold border-l-[3px] border-[#2383e2] dark:border-sky-400 shadow-2xs'
                      : 'text-slate-800 dark:text-slate-100 font-semibold hover:bg-slate-900/10 dark:hover:bg-white/10 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-base shrink-0 leading-none filter drop-shadow-2xs">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {item.badge && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${item.badgeColor || 'notion-pill-orange'}`}>
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded notion-pill-blue">
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* SECTION 2: TOOLS & GAMIFICATION */}
        <div className="px-2.5 pt-3 pb-1">
          <div className="px-2 pb-1.5 text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Công cụ & Thử thách
          </div>
          <nav className="space-y-1">
            {toolsNavItems.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playSound('flip');
                    item.action ? item.action() : handleNavClick(item.id);
                  }}
                  title={item.desc}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-900/10 dark:hover:bg-white/10 hover:text-slate-950 dark:hover:text-white transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-base shrink-0 leading-none filter drop-shadow-2xs">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ${item.badgeColor || 'notion-pill-gray'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SECTION 3: ACCOUNT & FINANCE */}
        <div className="px-2.5 pt-3 pb-2">
          <div className="px-2 pb-1.5 text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Tài khoản & Thanh toán
          </div>
          <nav className="space-y-1">
            {accountNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[12.5px] transition-all group text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#2383e2]/15 dark:bg-sky-500/25 text-[#1458a6] dark:text-white font-extrabold border-l-[3px] border-[#2383e2] dark:border-sky-400 shadow-2xs'
                      : 'text-slate-800 dark:text-slate-100 font-semibold hover:bg-slate-900/10 dark:hover:bg-white/10 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-base shrink-0 leading-none filter drop-shadow-2xs">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.highlight && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded notion-pill-yellow shrink-0">
                      {item.highlight}
                    </span>
                  )}

                  {item.badge && (
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ${item.badgeColor || 'notion-pill-purple'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* DAILY STUDY PROGRESS MINI WIDGET IN SIDEBAR */}
        <div className="mx-3 my-2 p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-white/15 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
              <span>🎯</span>
              <span>Mục Tiêu Hôm Nay</span>
            </span>
            <span className="font-extrabold text-[#2383e2] dark:text-sky-400">
              {completedQuestsCount}/{dailyQuests.length}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2383e2] to-emerald-500 transition-all duration-500"
              style={{ width: `${ Math.max(15, questProgressPercent) }%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 font-medium pt-0.5">
            <span>⚡ {streakInfo.xp} XP</span>
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="text-[#2383e2] dark:text-sky-400 font-bold hover:underline cursor-pointer"
            >
              Xem Bảng Vàng →
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: USER PROFILE & COLLAPSE FOOTER */}
      <div className="p-3 border-t border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/95 space-y-2 shrink-0">
        
        {/* User Card */}
        <div
          onClick={onOpenAuth}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-900/5 dark:hover:bg-white/10 cursor-pointer transition-colors"
          title="Xem thông tin tài khoản & thiết lập"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#2383e2] dark:bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : '👤'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user ? (user.displayName || user.email.split('@')[0]) : 'Đăng nhập / Đăng ký'}
              </span>
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 flex items-center space-x-1">
                <span>Ví của bạn:</span>
                <strong className="text-amber-600 dark:text-amber-400 font-extrabold">{walletBalance} Xu</strong>
              </span>
            </div>
          </div>
          
          <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" />
        </div>

        {/* Bottom subtle label */}
        <div className="flex items-center justify-between px-2 text-[10px] font-medium text-slate-600 dark:text-slate-300">
          <span>Ôn Thi Hub v{APP_VERSION}</span>
          <span className="text-slate-500 dark:text-slate-400 font-semibold">{currentTheme?.name?.split(' ')[0] || 'Notion'} UI</span>
        </div>

      </div>
    </aside>
  );
}
