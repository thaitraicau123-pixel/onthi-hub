import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  FolderHeart,
  Store,
  PlusSquare,
  BookMarked,
  Trophy,
  Gift,
  Timer,
  BarChart2,
  ArrowRight,
  Layers,
  PlayCircle,
  Gamepad2,
  Coins,
  X,
  CornerDownLeft,
  Command,
  Palette,
  Clock,
  Users,
  FileText,
  MessageCircle,
  Share2
} from 'lucide-react';
import { playSound } from '../utils/storage';

export default function CommandPaletteModal({
  isOpen,
  onClose,
  allCourses = [],
  purchasedCourses = [],
  onSelectTab,
  onOpenFlashcards,
  onOpenQuiz,
  onOpenMatchGame,
  onOpenMistakes,
  onOpenLeaderboard,
  onOpenBlindBox,
  onOpenWallet,
  onOpenAnalytics,
  onOpenThemePicker,
  onOpenTargetClock,
  onOpenStudyRoom,
  onOpenCheatSheet,
  onOpenDirectChat,
  onOpenLiveExamRoom,
  onOpenShareAchievement
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const quickActions = [
    {
      id: 'action-direct-chat',
      title: 'Tin Nhắn Trực Tiếp & Hỏi Đáp 1-1',
      desc: 'Nhắn tin riêng giữa người mua & người bán, trao đổi prompt hoặc hỗ trợ kỹ thuật',
      icon: MessageCircle,
      category: 'Giao tiếp & Hỗ trợ',
      badge: 'Chat 1-1',
      onSelect: () => {
        onOpenDirectChat?.();
        onClose();
      }
    },
    {
      id: 'action-theme',
      title: 'Đổi Chủ Đề Nền & Giao Diện (16 Phong Cách)',
      desc: 'Thay đổi hình nền Cyberpunk, Lofi, Neon và bảng màu yêu thích',
      icon: Palette,
      category: 'Giao diện',
      badge: '16 Themes',
      onSelect: () => {
        onOpenThemePicker?.();
        onClose();
      }
    },
    {
      id: 'action-library',
      title: 'Kho Prompt & AI Skills Của Tôi',
      desc: 'Xem các bộ Prompt đã mở khóa và 1-Click sao chép',
      icon: FolderHeart,
      category: 'Kho cá nhân',
      badge: 'Đã mua',
      onSelect: () => {
        onSelectTab('library');
        onClose();
      }
    },
    {
      id: 'action-create',
      title: 'Studio Đăng Bán Prompt (Hưởng 80% Lãi)',
      desc: 'Đăng bán câu lệnh Prompt AI hoặc Workflow N8N để kiếm Xu thụ động',
      icon: PlusSquare,
      category: 'Công cụ Creator',
      badge: '80% LÃI',
      onSelect: () => {
        onSelectTab('create');
        onClose();
      }
    },
    {
      id: 'action-marketplace',
      title: 'Chợ Prompt & AI Skills C2C',
      desc: 'Tìm mua Prompt từ cộng đồng hoặc giao dịch trực tiếp giữa thành viên',
      icon: Store,
      category: 'Sàn C2C',
      badge: 'HOT',
      onSelect: () => {
        onSelectTab('marketplace');
        onClose();
      }
    },
    {
      id: 'action-leaderboard',
      title: 'Bảng Vàng Doanh Thu Creator',
      desc: 'Xem thứ hạng Creator bán chạy nhất và giữ chuỗi hoạt động',
      icon: Trophy,
      category: 'Bảng xếp hạng',
      onSelect: () => {
        onOpenLeaderboard?.();
        onClose();
      }
    },
    {
      id: 'action-blindbox',
      title: 'Túi Mù May Mắn (Nhận Xu Free)',
      desc: '100% trúng Xu thưởng mỗi ngày để mở khóa prompt',
      icon: Gift,
      category: 'Phần thưởng',
      badge: 'Free Xu',
      onSelect: () => {
        onOpenBlindBox?.();
        onClose();
      }
    },
    {
      id: 'action-wallet',
      title: 'Ví Xu PromptMMO (Nạp & Rút Tiền)',
      desc: 'Nạp tiền tự động qua VietQR hoặc yêu cầu rút tiền về tài khoản ngân hàng',
      icon: Wallet,
      category: 'Tài chính',
      badge: 'VietQR',
      onSelect: () => {
        onOpenWallet?.();
        onClose();
      }
    }
  ];

  // Search through actions and courses
  const trimmedQuery = query.toLowerCase().trim();

  const filteredActions = quickActions.filter((act) => {
    if (!trimmedQuery) return true;
    return (
      act.title.toLowerCase().includes(trimmedQuery) ||
      act.desc.toLowerCase().includes(trimmedQuery) ||
      act.category.toLowerCase().includes(trimmedQuery)
    );
  });

  const filteredCourses = allCourses
    .filter((c) => {
      if (!trimmedQuery) return false;
      return (
        c.title.toLowerCase().includes(trimmedQuery) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(trimmedQuery)) ||
        (c.categoryLabel && c.categoryLabel.toLowerCase().includes(trimmedQuery))
      );
    })
    .slice(0, 5);

  const combinedItems = [
    ...filteredActions.map((a) => ({ ...a, itemType: 'action' })),
    ...filteredCourses.map((c) => ({
      id: `course-${c.id}`,
      title: c.title,
      desc: `${c.categoryLabel || 'Prompt'} • ${c.previewCards?.length || 0} Prompts thực chiến`,
      icon: Layers,
      category: 'Gói Prompt & Skills MMO',
      courseData: c,
      itemType: 'course',
      onSelect: () => {
        onOpenFlashcards?.(c);
        onClose();
      }
    }))
  ];

  // Keyboard navigation inside Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + combinedItems.length) % Math.max(1, combinedItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = combinedItems[selectedIndex];
        if (selected) {
          playSound('click');
          selected.onSelect();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, combinedItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Spotlight Window */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-[#e9e9e8] dark:border-white/15 overflow-hidden flex flex-col max-h-[80vh] z-10 text-[#37352f] dark:text-white"
      >
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#e9e9e8] dark:border-white/10 bg-[#fbfbfa] dark:bg-slate-950/70">
          <Search className="w-4 h-4 text-[#787774] dark:text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Tìm gói prompt, công cụ hoặc thao tác nhanh (gõ để tìm)..."
            className="w-full text-sm bg-transparent outline-none placeholder:text-[#9b9a97] dark:placeholder:text-slate-500 text-[#37352f] dark:text-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-xs text-[#9b9a97] hover:text-[#37352f] dark:hover:text-white p-1 rounded cursor-pointer mr-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f1f1ef] dark:bg-slate-800 text-[#787774] dark:text-slate-400 border border-[#e3e2e0] dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 divide-y divide-[#f1f1ef] dark:divide-white/5">
          {combinedItems.length === 0 ? (
            <div className="py-12 text-center text-[#787774] dark:text-slate-400 space-y-2">
              <Search className="w-8 h-8 text-[#9b9a97] dark:text-slate-600 mx-auto opacity-50" />
              <p className="text-sm font-medium">Không tìm thấy kết quả nào khớp với "{query}"</p>
              <p className="text-xs text-[#9b9a97] dark:text-slate-500">Hãy thử tìm kiếm với từ khóa khác như "Kling", "Midjourney", "TikTok", "Ví Xu"</p>
            </div>
          ) : (
            <div className="space-y-1">
              {combinedItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const IconComponent = item.icon || Sparkles;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      playSound('click');
                      item.onSelect();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#f1f1ef] dark:bg-slate-800 text-[#37352f] dark:text-white'
                        : 'hover:bg-[#f7f6f5] dark:hover:bg-slate-800/60 text-[#37352f] dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-white dark:bg-slate-700 border-[#d0d0ce] dark:border-slate-600 text-[#2383e2] dark:text-sky-400'
                          : 'bg-[#f7f6f5] dark:bg-slate-800 border-[#e9e9e8] dark:border-white/10 text-[#787774] dark:text-slate-400'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-xs sm:text-sm truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#edf3ec] dark:bg-emerald-950/80 text-[#448361] dark:text-emerald-300 border border-[#d3e5d7] dark:border-emerald-800/60 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#787774] dark:text-slate-400 truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {isSelected && (
                        <span className="flex items-center text-[10px] text-[#787774] dark:text-slate-400 font-medium space-x-1">
                          <span>Mở</span>
                          <CornerDownLeft className="w-3 h-3 text-[#2383e2] dark:text-sky-400" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Keyboard Hints */}
        <div className="px-4 py-2.5 bg-[#fbfbfa] dark:bg-slate-950/80 border-t border-[#e9e9e8] dark:border-white/10 flex items-center justify-between text-[11px] text-[#787774] dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-[#e9e9e8] dark:border-slate-700 font-mono text-[9px] text-[#787774] dark:text-slate-300">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-[#e9e9e8] dark:border-slate-700 font-mono text-[9px] text-[#787774] dark:text-slate-300">↓</kbd>
              <span>Di chuyển</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-[#e9e9e8] dark:border-slate-700 font-mono text-[9px] text-[#787774] dark:text-slate-300">↵</kbd>
              <span>Chọn</span>
            </span>
          </div>

          <span className="text-[10px] text-[#9b9a97] dark:text-slate-500">
            Quick Command • PromptMMO
          </span>
        </div>

      </div>
    </div>
  );
}
