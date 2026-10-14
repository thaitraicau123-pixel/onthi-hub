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
import { APP_VERSION, isChangelogUnread } from '../data/changelogData';
import { playSound } from '../utils/storage';

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
  onOpenAnalytics
}) {
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const userIsAdmin = isUserAdmin(user);
  const currentTier = getUserTier();
  const unmasteredMistakesCount = getUnmasteredMistakesCount();

  const handleNavClick = (tabId) => {
    playSound('flip');
    onSelectTab(tabId);
  };

  const workspaceNavItems = [
    { id: 'home', label: 'Trang Chủ', icon: Home, emoji: '🏠', desc: 'Đề thi chuẩn & Khám phá' },
    { id: 'library', label: 'Tủ Thẻ Của Tôi', icon: FolderHeart, emoji: '📚', count: purchasedCount, desc: 'Thẻ đã mua & Anki' },
    { id: 'create', label: 'Studio Tạo Thẻ AI', icon: PlusSquare, emoji: '✍️', desc: 'Tạo thẻ ghi nhớ tự động' },
    { id: 'marketplace', label: 'Chợ Thẻ C2C', icon: Store, emoji: '🏪', badge: 'HOT', desc: 'Sàn mua bán thẻ' },
    { id: 'community', label: 'Cộng Đồng Học Viên', icon: Users, emoji: '💬', desc: 'Thảo luận & Hỏi đáp' },
  ];

  const toolsNavItems = [
    {
      id: 'analytics',
      label: 'Tiến Độ & Phân Tích',
      emoji: '📊',
      action: onOpenAnalytics,
      desc: 'Tỷ lệ nhớ sâu SM-2 & Biểu đồ học'
    },
    {
      id: 'mistakes',
      label: 'Sổ Tay Câu Sai',
      emoji: '📓',
      badge: unmasteredMistakesCount > 0 ? `${unmasteredMistakesCount}` : null,
      badgeColor: 'notion-pill-red',
      action: onOpenMistakes,
      desc: 'Ôn tập câu sai & điểm yếu'
    },
    {
      id: 'leaderboard',
      label: 'Bảng Vàng & Streak',
      emoji: '🏆',
      action: onOpenLeaderboard,
      desc: 'Bảng xếp hạng & Chuỗi học tập'
    },
    {
      id: 'blindbox',
      label: 'Túi Mù Tri Thức',
      emoji: '🎁',
      action: onOpenBlindBox,
      desc: '100% trúng quà & nổ hũ Xu'
    },
    {
      id: 'changelog',
      label: `Bản Tin Cập Nhật`,
      emoji: '✨',
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
      emoji: '🪙',
      highlight: `${walletBalance} Xu`
    },
    {
      id: 'plans',
      label: 'Gói Hội Viên',
      icon: Sparkles,
      emoji: '⚡',
      badge: currentTier.name !== 'FREE' ? currentTier.name : null,
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
      className="fixed md:sticky top-0 left-0 w-64 h-screen shrink-0 bg-[#f7f6f5] border-r border-[#e9e9e8] text-[#37352f] flex flex-col justify-between select-none z-40 transition-all duration-200 text-sm shadow-xl md:shadow-none"
      aria-label="Thanh bên điều hướng Notion"
    >
      {/* TOP SECTION: WORKSPACE SWITCHER & SEARCH */}
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        
        {/* Workspace Switcher Header */}
        <div className="p-3 border-b border-[#e9e9e8]/70 flex items-center justify-between">
          <div
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-[rgba(55,53,47,0.08)] cursor-pointer flex-1 min-w-0 transition-colors"
            title="Đổi workspace hoặc thông tin tài khoản"
          >
            <div className="w-6 h-6 rounded-md bg-white border border-[#e9e9e8] shadow-2xs flex items-center justify-center text-sm shrink-0">
              🎓
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center space-x-1">
                <span className="font-bold text-xs text-[#37352f] truncate tracking-tight">
                  Ôn Thi Hub
                </span>
                <ChevronsUpDown className="w-3 h-3 text-[#9b9a97] shrink-0" />
              </div>
              <span className="text-[10px] text-[#787774] truncate">
                {user ? user.email || user.displayName : 'Khách vãng lai'}
              </span>
            </div>
          </div>

          {/* Collapse sidebar button */}
          <button
            onClick={() => {
              playSound('click');
              onToggle();
            }}
            className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-[rgba(55,53,47,0.08)] rounded-md transition-colors"
            title="Thu gọn thanh bên (Ctrl + \)"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Search Bar */}
        <div className="px-3 pt-3 pb-1">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onOpenSearch ? onOpenSearch() : handleNavClick('home');
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-[#787774] bg-white border border-[#e9e9e8] hover:border-[#d0d0ce] rounded-lg shadow-2xs transition-all hover:text-[#37352f]"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-[#9b9a97]" />
              <span>Tìm kiếm nhanh...</span>
            </div>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f1f1ef] text-[#787774] border border-[#e3e2e0]">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* SECTION 1: WORKSPACE */}
        <div className="px-2 pt-3 pb-1">
          <div className="px-2 pb-1.5 text-[11px] font-bold text-[#9b9a97] uppercase tracking-wider">
            Không gian học tập
          </div>
          <nav className="space-y-0.5">
            {workspaceNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors group text-left ${
                    isActive
                      ? 'bg-[rgba(55,53,47,0.08)] text-[#37352f] font-bold'
                      : 'text-[#5a5751] hover:bg-[rgba(55,53,47,0.06)] hover:text-[#37352f]'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-sm shrink-0 leading-none">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded notion-pill-orange">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded notion-pill-gray">
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
        <div className="px-2 pt-3 pb-1">
          <div className="px-2 pb-1.5 text-[11px] font-bold text-[#9b9a97] uppercase tracking-wider">
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
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-[#5a5751] hover:bg-[rgba(55,53,47,0.06)] hover:text-[#37352f] transition-colors group text-left"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-sm shrink-0 leading-none">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${item.badgeColor || 'notion-pill-gray'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SECTION 3: ACCOUNT & FINANCE */}
        <div className="px-2 pt-3 pb-1">
          <div className="px-2 pb-1.5 text-[11px] font-bold text-[#9b9a97] uppercase tracking-wider">
            Tài khoản & Thanh toán
          </div>
          <nav className="space-y-0.5">
            {accountNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors group text-left ${
                    isActive
                      ? 'bg-[rgba(55,53,47,0.08)] text-[#37352f] font-bold'
                      : 'text-[#5a5751] hover:bg-[rgba(55,53,47,0.06)] hover:text-[#37352f]'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-sm shrink-0 leading-none">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.highlight && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded notion-pill-yellow shrink-0">
                      {item.highlight}
                    </span>
                  )}

                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${item.badgeColor || 'notion-pill-purple'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* BOTTOM SECTION: USER PROFILE & COLLAPSE FOOTER */}
      <div className="p-3 border-t border-[#e9e9e8] bg-[#f7f6f5] space-y-2 shrink-0">
        
        {/* User Card */}
        <div
          onClick={onOpenAuth}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-[rgba(55,53,47,0.08)] cursor-pointer transition-colors"
          title="Xem thông tin tài khoản & thiết lập"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#37352f] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : '👤'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#37352f] truncate">
                {user ? (user.displayName || user.email.split('@')[0]) : 'Đăng nhập'}
              </span>
              <span className="text-[10px] text-[#787774] flex items-center space-x-1">
                <span>Ví:</span>
                <strong className="text-amber-600 font-bold">{walletBalance} Xu</strong>
              </span>
            </div>
          </div>
          
          <Settings className="w-3.5 h-3.5 text-[#9b9a97] hover:text-[#37352f]" />
        </div>

        {/* Bottom subtle label */}
        <div className="flex items-center justify-between px-2 text-[10px] text-[#9b9a97]">
          <span>Ôn Thi Hub v{APP_VERSION}</span>
          <span className="text-[#b8b7b4]">Notion UI Mode</span>
        </div>

      </div>
    </aside>
  );
}
