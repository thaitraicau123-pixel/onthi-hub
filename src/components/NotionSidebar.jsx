import React, { useState, useEffect } from 'react';
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
import { getStreakInfo, getDailyQuests } from '../utils/gamification';
import { APP_VERSION, isChangelogUnread } from '../data/changelogData';
import { playSound } from '../utils/storage';
import { getUnreadDirectMessagesCount, subscribeToDirectMessages, getCurrentUserParticipant } from '../utils/directMessaging';
import BrandLogo from './BrandLogo';

function NotionSidebar({
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
  onOpenChangelog,
  onOpenSearch,
  onOpenAnalytics,
  currentTheme,
  onOpenThemePicker,
  onOpenDirectChat,
  onOpenShareAchievement
}) {
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const curParticipant = getCurrentUserParticipant(user);
  const [unreadDmCount, setUnreadDmCount] = useState(() => getUnreadDirectMessagesCount(curParticipant));

  useEffect(() => {
    const updateDm = () => {
      setUnreadDmCount(getUnreadDirectMessagesCount(curParticipant));
    };
    updateDm();
    const unsub = subscribeToDirectMessages(curParticipant, updateDm);
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [user]);

  const userIsAdmin = isUserAdmin(user);
  const currentTier = getUserTier();
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
    { id: 'home', label: 'Trang Chủ & Kho Prompt', icon: Home, emoji: icons.home || '⚡', desc: 'Prompt AI & Kịch bản MMO' },
    { id: 'library', label: 'Kho Prompt Của Tôi', icon: FolderHeart, emoji: icons.library || '📁', count: purchasedCount, desc: 'Prompt đã mua & 1-Click Copy' },
    { id: 'create', label: 'Studio Đăng Bán Prompt', icon: PlusSquare, emoji: icons.create || '✍️', badge: '80% LÃI', badgeColor: 'notion-pill-purple', desc: 'Creator đăng bán Prompt kiếm Xu' },
    { id: 'marketplace', label: 'Chợ Prompt C2C', icon: Store, emoji: icons.marketplace || '🏪', badge: 'HOT', desc: 'Sàn mua bán Prompt cộng đồng' },
    { id: 'community', label: 'Cộng Đồng MMO & AI', icon: Users, emoji: icons.community || '💬', desc: 'Thủ thuật, kinh nghiệm & kết bạn' },
  ];

  const toolsNavItems = [
    {
      id: 'direct-messages',
      label: 'Tin Nhắn Trực Tiếp',
      emoji: '💬',
      badge: unreadDmCount > 0 ? `${unreadDmCount} tin mới` : 'Chat 1-1',
      badgeColor: unreadDmCount > 0 ? 'notion-pill-red' : 'notion-pill-blue',
      action: onOpenDirectChat,
      desc: 'Nhắn tin riêng & trao đổi prompt giữa thành viên'
    },
    {
      id: 'blindbox',
      label: 'Túi Mù May Mắn',
      emoji: icons.blindbox || '🎁',
      badge: 'Nhận Xu Free',
      badgeColor: 'notion-pill-yellow',
      action: onOpenBlindBox,
      desc: 'Nhận Xu miễn phí mỗi ngày & nổ hũ'
    },
    {
      id: 'leaderboard',
      label: 'Bảng Vàng Doanh Thu',
      emoji: icons.leaderboard || '🏆',
      badge: `🔥 ${streakInfo.streak}d`,
      badgeColor: 'notion-pill-orange',
      action: onOpenLeaderboard,
      desc: 'Top Creator kiếm Xu nhiều nhất'
    },
    {
      id: 'theme',
      label: 'Đổi Giao Diện Nền',
      emoji: '🎨',
      badge: currentTheme?.name ? currentTheme.name.split(' ')[0] : '16 Themes',
      badgeColor: 'notion-pill-blue',
      action: onOpenThemePicker,
      desc: '16 chủ đề Cyber, Lofi & Neon'
    },
    {
      id: 'changelog',
      label: `Bản Tin Cập Nhật`,
      emoji: icons.changelog || '✨',
      badge: isChangelogUnread() ? 'NEW' : APP_VERSION,
      badgeColor: 'notion-pill-blue',
      action: onOpenChangelog,
      desc: `Phiên bản ${APP_VERSION}`
    }
  ];

  const accountNavItems = [
    {
      id: 'wallet',
      label: 'Ví Xu PromptMMO',
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
      className={`fixed md:sticky top-0 left-0 w-64 h-screen shrink-0 ${currentTheme?.sidebarBgClass || 'bg-[#fbfbfa]/90 dark:bg-[#121214]/90'} backdrop-blur-2xl border-r ${currentTheme?.borderClass || 'border-black/[0.08] dark:border-white/[0.08]'} text-slate-900 dark:text-zinc-100 flex flex-col justify-between select-none z-40 transition-all duration-300 text-sm shadow-2xl md:shadow-none relative`}
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
        <div className="p-3 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <div
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-[0.98] cursor-pointer flex-1 min-w-0 transition-all"
            title="Đổi workspace hoặc thông tin tài khoản"
          >
            <BrandLogo size={28} className="rounded-xl shadow-xs" />
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-[13px] text-slate-900 dark:text-white truncate tracking-tight">
                  PromptMMO
                </span>
                <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 truncate">
                {user ? user.email || user.displayName : 'Chợ Prompt & AI Skills MMO'}
              </span>
            </div>
          </div>

          {/* Collapse sidebar button */}
          <button
            onClick={() => {
              playSound('click');
              onToggle();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-[0.95] rounded-lg transition-all cursor-pointer"
            title="Thu gọn thanh bên (Ctrl + \)"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Apple Style Quick Search Bar */}
        <div className="px-3 pt-3 pb-1.5">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onOpenSearch ? onOpenSearch() : handleNavClick('home');
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-zinc-300 bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.06] dark:hover:bg-white/[0.09] active:scale-[0.98] rounded-xl transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
              <span>Tìm kiếm prompt nhanh...</span>
            </div>
            <kbd className="text-[10px] font-medium font-mono px-1.5 py-0.5 rounded-md bg-white/80 dark:bg-zinc-800/80 text-slate-500 dark:text-zinc-400 border border-black/[0.06] dark:border-white/[0.08]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* SECTION 1: WORKSPACE */}
        <div className="px-2.5 pt-2.5 pb-1">
          <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-zinc-500 uppercase flex items-center justify-between">
            <span>Không gian làm việc MMO</span>
            <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">5 mục</span>
          </div>
          <nav className="space-y-0.5">
            {workspaceNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.desc}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all group text-left cursor-pointer active:scale-[0.98] ${
                    isActive
                      ? 'bg-[#007aff]/10 dark:bg-[#0a84ff]/20 text-[#007aff] dark:text-[#0a84ff] font-semibold'
                      : 'text-slate-700 dark:text-zinc-300 font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-base shrink-0 leading-none">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {item.badge && (
                      <span className="apple-pill-amber text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span className="apple-pill-blue text-[10px] font-bold px-2 py-0.5 rounded-full">
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
          <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
            Công cụ & Thử thách
          </div>
          <nav className="space-y-0.5">
            {toolsNavItems.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playSound('flip');
                    item.action ? item.action() : handleNavClick(item.id);
                  }}
                  title={item.desc}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-[13px] font-medium text-slate-700 dark:text-zinc-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-slate-950 dark:hover:text-white transition-all group text-left cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-base shrink-0 leading-none">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-slate-600 dark:text-zinc-300 shrink-0">
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
          <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
            Tài khoản & Thanh toán
          </div>
          <nav className="space-y-0.5">
            {accountNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all group text-left cursor-pointer active:scale-[0.98] ${
                    isActive
                      ? 'bg-[#007aff]/10 dark:bg-[#0a84ff]/20 text-[#007aff] dark:text-[#0a84ff] font-semibold'
                      : 'text-slate-700 dark:text-zinc-300 font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-base shrink-0 leading-none">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.highlight && (
                    <span className="apple-pill-amber text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {item.highlight}
                    </span>
                  )}

                  {item.badge && (
                    <span className="apple-pill-purple text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* DAILY QUEST MINI WIDGET (Apple Widget Aesthetic) */}
        <div className="mx-3 my-2 p-3 rounded-2xl apple-card border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>🎯</span>
              <span>Mục Tiêu Hôm Nay</span>
            </span>
            <span className="font-bold text-[#007aff] dark:text-[#0a84ff]">
              {completedQuestsCount}/{dailyQuests.length}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.1] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#007aff] to-emerald-500 transition-all duration-500"
              style={{ width: `${Math.max(15, questProgressPercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400 font-medium pt-0.5">
            <span>⚡ {streakInfo.xp} XP</span>
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="text-[#007aff] dark:text-[#0a84ff] font-semibold hover:underline cursor-pointer"
            >
              Xem Bảng Vàng →
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: USER PROFILE & COLLAPSE FOOTER */}
      <div className="p-3 border-t border-black/[0.06] dark:border-white/[0.08] bg-transparent space-y-2 shrink-0">
        
        {/* User Card */}
        <div
          onClick={onOpenAuth}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-[0.98] cursor-pointer transition-all"
          title="Xem thông tin tài khoản & thiết lập"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ring-1 ring-black/10 dark:ring-white/20">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : '👤'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user ? (user.displayName || user.email.split('@')[0]) : 'Đăng nhập / Đăng ký'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 flex items-center space-x-1">
                <span>Ví:</span>
                <strong className="text-amber-600 dark:text-amber-400 font-bold">{walletBalance} Xu</strong>
              </span>
            </div>
          </div>
          
          <Settings className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors" />
        </div>

        {/* Bottom subtle label */}
        <div className="flex items-center justify-between px-2 text-[10px] font-medium text-slate-400 dark:text-zinc-500">
          <span>PromptMMO {APP_VERSION}</span>
          <span>Apple HIG UI</span>
        </div>

      </div>
    </aside>
  );
}

export default React.memo(NotionSidebar);
