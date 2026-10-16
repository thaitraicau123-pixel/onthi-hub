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
  Clock
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
  onOpenTargetClock
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
      id: 'action-target-clock',
      title: 'Đồng Hồ Mục Tiêu & Vết Thời Gian (Giờ Hà Nội)',
      desc: 'Xem giờ thực tế Việt Nam, đặt mục tiêu học và xem nhật ký vết thời gian',
      icon: Clock,
      category: 'Thời gian & Mục tiêu',
      badge: 'Giờ Hà Nội',
      onSelect: () => {
        onOpenTargetClock?.();
        onClose();
      }
    },
    {
      id: 'action-theme',
      title: 'Đổi Chủ Đề Nền & Giao Diện (16 Phong Cách)',
      desc: 'Thay đổi hình nền, bảng màu và icon nhỏ (như Messenger & Instagram)',
      icon: Palette,
      category: 'Giao diện',
      badge: '10 Themes',
      onSelect: () => {
        onOpenThemePicker?.();
        onClose();
      }
    },
    {
      id: 'action-library',
      title: 'Tủ Thẻ & Tài Liệu Của Tôi',
      desc: 'Xem các bộ flashcard đã sở hữu và ôn tập theo SM-2',
      icon: FolderHeart,
      category: 'Không gian học',
      badge: 'Khuyên dùng',
      onSelect: () => {
        onSelectTab('library');
        onClose();
      }
    },
    {
      id: 'action-due',
      title: 'Ôn Toàn Bộ Thẻ Đến Hạn (Spaced Repetition)',
      desc: 'Củng cố trí nhớ ngắt quãng chống quên lãng',
      icon: Layers,
      category: 'Học tập',
      badge: 'SM-2',
      onSelect: () => {
        onSelectTab('library');
        onClose();
      }
    },
    {
      id: 'action-create',
      title: 'Studio Tạo Thẻ Bằng AI (Gemini & OpenAI)',
      desc: 'Dán tài liệu hoặc nhập chủ đề để tạo thẻ tự động trong 5 giây',
      icon: PlusSquare,
      category: 'Công cụ AI',
      badge: 'AI 3.5',
      onSelect: () => {
        onSelectTab('create');
        onClose();
      }
    },
    {
      id: 'action-analytics',
      title: 'Trung Tâm Phân Tích & Tiến Độ Học Tập',
      desc: 'Xem biểu đồ nhớ sâu, chuỗi streak và dự báo ôn tập 7 ngày',
      icon: BarChart2,
      category: 'Thống kê',
      badge: 'Mới',
      onSelect: () => {
        onOpenAnalytics?.();
        onClose();
      }
    },
    {
      id: 'action-marketplace',
      title: 'Chợ Thẻ Flashcard C2C',
      desc: 'Tìm mua bộ đề thi chuẩn từ cộng đồng hoặc tự đăng bán kiếm Xu',
      icon: Store,
      category: 'Sàn C2C',
      badge: 'HOT',
      onSelect: () => {
        onSelectTab('marketplace');
        onClose();
      }
    },
    {
      id: 'action-mistakes',
      title: 'Sổ Tay Câu Sai & Điểm Yếu',
      desc: 'Xem lại các câu trắc nghiệm làm sai và AI chẩn đoán lỗ hổng',
      icon: BookMarked,
      category: 'Ôn luyện',
      onSelect: () => {
        onOpenMistakes?.();
        onClose();
      }
    },
    {
      id: 'action-leaderboard',
      title: 'Bảng Vàng Thi Đua & Chuỗi Học Tập (Streak)',
      desc: 'Xem thứ hạng tuần, tích lũy XP và nhận huy hiệu danh giá',
      icon: Trophy,
      category: 'Cộng đồng',
      onSelect: () => {
        onOpenLeaderboard?.();
        onClose();
      }
    },
    {
      id: 'action-blindbox',
      title: 'Túi Mù Tri Thức (Blind Box)',
      desc: '100% có quà: voucher VIP, Xu hoàn lại và bộ thẻ hiếm',
      icon: Gift,
      category: 'Minigame',
      onSelect: () => {
        onOpenBlindBox?.();
        onClose();
      }
    },
    {
      id: 'action-wallet',
      title: 'Ví Xu & Nạp Tiền VietQR',
      desc: 'Quản lý số dư Xu, lịch sử giao dịch và nạp tiền tự động',
      icon: Coins,
      category: 'Tài chính',
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
      desc: `${c.categoryLabel || 'Tài liệu'} • ${c.previewCards?.length || 0} thẻ Anki • ${c.previewQuiz?.length || 0} trắc nghiệm`,
      icon: Layers,
      category: 'Khóa học & Bộ thẻ',
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
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-[#e9e9e8] overflow-hidden flex flex-col max-h-[80vh] z-10 text-[#37352f]">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#e9e9e8] bg-[#fbfbfa]">
          <Search className="w-4 h-4 text-[#787774] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Tìm bộ thẻ, câu hỏi hoặc thao tác nhanh (gõ để tìm)..."
            className="w-full text-sm bg-transparent outline-none placeholder:text-[#9b9a97] text-[#37352f]"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-xs text-[#9b9a97] hover:text-[#37352f] p-1 rounded cursor-pointer mr-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f1f1ef] text-[#787774] border border-[#e3e2e0]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 divide-y divide-[#f1f1ef]">
          {combinedItems.length === 0 ? (
            <div className="py-12 text-center text-[#787774] space-y-2">
              <Search className="w-8 h-8 text-[#9b9a97] mx-auto opacity-50" />
              <p className="text-sm font-medium">Không tìm thấy kết quả nào khớp với "{query}"</p>
              <p className="text-xs text-[#9b9a97]">Hãy thử tìm kiếm với từ khóa khác như "Công chức", "IELTS", "AI", "Ví Xu"</p>
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
                        ? 'bg-[#f1f1ef] text-[#37352f]'
                        : 'hover:bg-[#f7f6f5] text-[#37352f]'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-white border-[#d0d0ce] text-[#2383e2]'
                          : 'bg-[#f7f6f5] border-[#e9e9e8] text-[#787774]'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-xs sm:text-sm truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#edf3ec] text-[#448361] border border-[#d3e5d7] shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#787774] truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {isSelected && (
                        <span className="flex items-center text-[10px] text-[#787774] font-medium space-x-1">
                          <span>Mở</span>
                          <CornerDownLeft className="w-3 h-3 text-[#2383e2]" />
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
        <div className="px-4 py-2.5 bg-[#fbfbfa] border-t border-[#e9e9e8] flex items-center justify-between text-[11px] text-[#787774]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <kbd className="px-1 py-0.5 rounded bg-white border border-[#e9e9e8] font-mono text-[9px]">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-white border border-[#e9e9e8] font-mono text-[9px]">↓</kbd>
              <span>Di chuyển</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#e9e9e8] font-mono text-[9px]">↵</kbd>
              <span>Chọn</span>
            </span>
          </div>

          <span className="text-[10px] text-[#9b9a97]">
            Notion Quick Command • OnThiHub
          </span>
        </div>

      </div>
    </div>
  );
}
