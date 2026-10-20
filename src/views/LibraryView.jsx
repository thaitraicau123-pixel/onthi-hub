import React, { useState, useEffect } from 'react';
import {
  FolderHeart,
  Layers,
  PlayCircle,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  BookOpen,
  Gamepad2,
  Repeat,
  Brain,
  Flame,
  CheckCircle,
  Clock,
  BookMarked,
  Scissors,
  Tag,
  Search,
  RotateCw,
  Store,
  MoreHorizontal,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Share2,
  MessageCircle
} from 'lucide-react';
import {
  exportAnkiDeckFile,
  exportCsvFile,
  exportMarkdownFile,
  printSummaryGuide,
  printFlashcardCutoutSheet,
  playSound
} from '../utils/storage';
import { copyFlashcardShareLink } from '../utils/shareLink';
import { getAllDecksDueStats, buildDueCardsDeck, getDeckDueStats } from '../utils/spacedRepetition';
import { getUnmasteredMistakesCount } from '../utils/mistakeTracker';
import { ActionableEmptyState } from '../components/UIStateFeedback';
import { getSelectedTheme, subscribeToTheme } from '../utils/themeManager';

export default function LibraryView({
  purchasedCourses,
  allCourses,
  onOpenFlashcards,
  onOpenQuiz,
  onOpenMatchGame,
  onOpenPassDeck,
  onOpenSellDeck,
  onOpenMistakes,
  onOpenCheatSheet,
  onSwitchTab,
  onOpenDirectChat,
  onShowToast
}) {
  const [searchLibrary, setSearchLibrary] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('due_first'); // 'due_first' | 'title'
  const [openMenuDeckId, setOpenMenuDeckId] = useState(null);
  const [hasSnowCaps, setHasSnowCaps] = useState(() => !!getSelectedTheme()?.hasSnowCaps);

  useEffect(() => {
    const unsub = subscribeToTheme((theme) => {
      setHasSnowCaps(!!theme?.hasSnowCaps);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const isComboUser = purchasedCourses.includes('combo-all-access');
  const unlockedList = isComboUser
    ? allCourses
    : allCourses.filter((c) => purchasedCourses.includes(c.id));

  const srsStats = getAllDecksDueStats(unlockedList);
  const unmasteredMistakesCount = getUnmasteredMistakesCount();

  const filteredUnlockedList = unlockedList
    .filter((c) => {
      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
      const term = searchLibrary.toLowerCase().trim();
      const matchTerm =
        !term ||
        c.title.toLowerCase().includes(term) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(term)) ||
        (c.categoryLabel && c.categoryLabel.toLowerCase().includes(term));
      return matchCat && matchTerm;
    })
    .sort((a, b) => {
      if (sortBy === 'due_first') {
        const dueA = getDeckDueStats(a).due || 0;
        const dueB = getDeckDueStats(b).due || 0;
        return dueB - dueA;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <div className="space-y-6 animate-fade-in pb-16 text-[#37352f] dark:text-[#f8fafc]">
      
      {/* NOTION PAGE HEADER */}
      <div className="space-y-2 pb-3 border-b border-[#e9e9e8] dark:border-white/10">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37352f] dark:text-white tracking-tight flex items-center gap-2.5">
              <span>📚</span>
              <span>Tủ Thẻ & Tài Liệu Của Tôi</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#787774] dark:text-slate-300 leading-relaxed">
              Lưu trữ vĩnh viễn trên thiết bị của bạn ({unlockedList.length} bộ tài liệu). Bắt đầu học ngay hoặc xuất file nạp vào Anki.
            </p>
          </div>

          {isComboUser && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#fbf3db] dark:bg-amber-950/70 border border-[#f4e4b7] dark:border-amber-600/40 text-[#c29243] dark:text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gói All-Access Trọn Đời</span>
            </div>
          )}
        </div>
      </div>

      {/* NOTION SPACED REPETITION (SM-2) CALLOUT WIDGET */}
      {unlockedList.length > 0 && (
        <div className="bg-white/95 dark:bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-[#e9e9e8] dark:border-white/15 text-[#37352f] dark:text-white shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#f4f0f7] dark:bg-purple-950/70 border border-[#e3d7ec] dark:border-purple-500/40 text-[11px] font-bold text-[#9065b0] dark:text-purple-300">
              <Brain className="w-3.5 h-3.5" />
              <span>SuperMemo SM-2 • Chống Quên Lãng</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#37352f] dark:text-white">
              {srsStats.totalDue > 0 ? (
                <>🎯 Hôm nay có <span className="text-[#d44c47] dark:text-rose-400 font-black">{srsStats.totalDue}</span> thẻ cần ôn tập!</>
              ) : (
                <>🎉 Tuyệt vời! Bạn đã ôn hết tất cả thẻ đến hạn hôm nay!</>
              )}
            </h3>
            <p className="text-xs text-[#787774] dark:text-slate-300 max-w-xl">
              Hệ thống tự động tính chu kỳ lặp lại ngắt quãng để củng cố trí nhớ dài hạn trước ngày thi.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1 text-xs">
              <span className="px-2 py-0.5 rounded bg-[#fdebec] dark:bg-rose-950/70 border border-[#f9c9cb] dark:border-rose-500/40 text-[#d44c47] dark:text-rose-300 font-semibold">
                ⏰ Cần ôn: <strong>{srsStats.totalDue}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#edf3ec] dark:bg-emerald-950/70 border border-[#d3e5d7] dark:border-emerald-500/40 text-[#448361] dark:text-emerald-300 font-semibold">
                🧠 Đã nhớ sâu: <strong>{srsStats.totalLearned}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#fbf3db] dark:bg-amber-950/70 border border-[#f4e4b7] dark:border-amber-500/40 text-[#c29243] dark:text-amber-300 font-semibold">
                ✨ Thẻ mới: <strong>{srsStats.totalNew}</strong>
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {srsStats.totalDue > 0 ? (
              <button
                type="button"
                onClick={() => onOpenFlashcards(buildDueCardsDeck(unlockedList))}
                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#2383e2] hover:bg-[#1a73e8] text-white font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Ôn Toàn Bộ {srsStats.totalDue} Thẻ Đến Hạn</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenFlashcards(buildDueCardsDeck(unlockedList))}
                className="w-full md:w-auto px-4 py-2 rounded-xl bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#efefed] dark:hover:bg-slate-700 border border-[#e9e9e8] dark:border-white/15 text-[#37352f] dark:text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-[#448361] dark:text-emerald-400" />
                <span>Ôn Tập Thêm Luyện Phản Xạ</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* MISTAKES QUICK ACCESS CALLOUT */}
      {unmasteredMistakesCount > 0 && (
        <div className="bg-[#fdebec] dark:bg-rose-950/40 border border-[#f9c9cb] dark:border-rose-500/40 rounded-xl p-3.5 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-[#d44c47] dark:text-rose-300 shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-rose-900/50 border border-[#f9c9cb] dark:border-rose-500/40 text-[#d44c47] dark:text-rose-300 flex items-center justify-center shrink-0">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm block text-[#37352f] dark:text-white">
                Sổ Tay Câu Sai: Có {unmasteredMistakesCount} câu cần khắc phục!
              </span>
              <span className="text-[#787774] dark:text-slate-300 text-[11px]">
                Xem lại câu trắc nghiệm làm sai và nhận chẩn đoán lỗ hổng kiến thức từ AI.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenMistakes}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-[#d44c47] hover:bg-[#c23d38] text-white font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>Mở Sổ Tay ({unmasteredMistakesCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* C2C PASS TIPS CALLOUT */}
      <div className="bg-[#f1f1ef] dark:bg-slate-900/80 border border-[#e9e9e8] dark:border-white/10 rounded-xl p-3 text-xs flex items-center justify-between gap-2.5 text-[#37352f] dark:text-slate-200">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-md bg-white dark:bg-slate-800 border border-[#e9e9e8] dark:border-white/15 text-[#2383e2] dark:text-sky-400 flex items-center justify-center shrink-0">
            <Repeat className="w-3.5 h-3.5" />
          </div>
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold text-[#37352f] dark:text-white">Đã thi đỗ hoặc học xong tài liệu? </span>
            <span className="text-[#787774] dark:text-slate-300">Bạn có thể bấm nút <strong>&ldquo;Tiện ích ➔ Pass Lại Thẻ Cũ&rdquo;</strong> ở mỗi bộ thẻ bên dưới để nhượng lại cho bạn học khác trên Sàn C2C và nhận Xu vào ví!</span>
          </div>
        </div>
      </div>

      {unlockedList.length === 0 ? (
        <ActionableEmptyState
          icon={BookOpen}
          badge="TỦ TÀI LIỆU TRỐNG"
          title="Tủ tài liệu ôn tập của bạn đang chờ đón bộ thẻ đầu tiên"
          description="Bạn chưa mở khóa bộ đề nào. Hãy ghé qua Chợ Thẻ C2C để tìm bộ đề chuẩn thi giá chỉ từ 2 Xu hoặc tự tạo bộ flashcard miễn phí bằng AI!"
          primaryAction={{
            label: 'Vào Chợ Flashcard C2C',
            onClick: () => onSwitchTab('marketplace'),
            icon: Store
          }}
          secondaryAction={{
            label: 'Tự Tạo Thẻ Bằng AI',
            onClick: () => onSwitchTab('create'),
            icon: Sparkles
          }}
        />
      ) : (
        <div className="space-y-4">
          {/* Filter and Search Bar for Library (Notion Control Bar) */}
          <div className="bg-white/95 dark:bg-slate-900/90 p-3 rounded-xl border border-[#e9e9e8] dark:border-white/15 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-[#37352f] dark:text-white">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'Tất Cả' },
                { id: 'cong-chuc', label: '🏛️ Công Chức' },
                { id: 'it-tech', label: '💻 IT & Tech' },
                { id: 'ngoai-ngu', label: '🌍 Ngoại Ngữ' }
              ].map((cat) => {
                const count = cat.id === 'all'
                  ? unlockedList.length
                  : unlockedList.filter(c => c.category === cat.id).length;
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer ${
                      active
                        ? 'bg-[#2383e2] text-white shadow-2xs font-bold'
                        : 'bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 text-[#5a5955] dark:text-slate-300 border border-[#e9e9e8] dark:border-white/10'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] font-bold px-1.5 rounded-full ${
                      active ? 'bg-white/20 text-white' : 'bg-[#e9e9e8] dark:bg-slate-900 text-[#787774] dark:text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & Sort dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-56">
                <Search className="w-3.5 h-3.5 text-[#9b9a97] dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm trong tủ thẻ..."
                  value={searchLibrary}
                  onChange={(e) => setSearchLibrary(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-[#37352f] dark:text-white placeholder:text-[#9b9a97] dark:placeholder:text-slate-400 border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:border-[#2383e2] dark:focus:border-sky-400 transition-colors"
                />
                {searchLibrary && (
                  <button
                    type="button"
                    onClick={() => setSearchLibrary('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9b9a97] dark:text-slate-400 hover:text-[#37352f] dark:hover:text-white text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-xs bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 text-[#37352f] dark:text-white font-semibold border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:border-[#2383e2] dark:focus:border-sky-400 transition-colors cursor-pointer"
              >
                <option value="due_first">⏰ Cần ôn tập trước</option>
                <option value="title">🔤 Tên A → Z</option>
              </select>
            </div>
          </div>

          {/* Results count & quick clear */}
          {(selectedCategory !== 'all' || searchLibrary) && (
            <div className="flex items-center justify-between text-xs text-[#787774] dark:text-slate-300 px-1 font-medium">
              <span>Đang hiển thị {filteredUnlockedList.length} / {unlockedList.length} bộ thẻ</span>
              <button
                type="button"
                onClick={() => { setSelectedCategory('all'); setSearchLibrary(''); }}
                className="text-[#2383e2] dark:text-sky-400 hover:underline font-semibold cursor-pointer"
              >
                Xóa bộ lọc ✕
              </button>
            </div>
          )}

          {/* If search yields 0 items */}
          {filteredUnlockedList.length === 0 ? (
            <ActionableEmptyState
              icon={Search}
              badge="KHÔNG TÌM THẤY"
              title={searchLibrary ? `Không tìm thấy bộ thẻ nào khớp với "${searchLibrary}"` : 'Không có bộ thẻ nào trong danh mục này'}
              description={`Tủ của bạn hiện có ${unlockedList.length} bộ thẻ. Hãy thử kiểm tra lại chính tả hoặc đặt lại bộ lọc.`}
              primaryAction={{
                label: 'Xóa bộ lọc tìm kiếm',
                onClick: () => { setSelectedCategory('all'); setSearchLibrary(''); },
                icon: RotateCw
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUnlockedList.map((course) => {
                const deckSrs = getDeckDueStats(course);
                const isMenuOpen = openMenuDeckId === course.id;

                return (
                  <div
                    key={course.id}
                    className="p-4 sm:p-5 rounded-xl border border-[#e9e9e8] dark:border-white/15 bg-white/95 dark:bg-slate-900/90 hover:border-[#c5c4c0] dark:hover:border-white/25 card-3d shadow-3d-sm hover:shadow-3d-md hover:-translate-y-0.5 transition-all flex flex-col justify-between text-[#37352f] dark:text-white relative overflow-hidden"
                  >
                    {/* Festive Snow Cap Banner */}
                    {hasSnowCaps && (
                      <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none z-10 overflow-hidden">
                        <svg className="w-full h-2.5" preserveAspectRatio="none" viewBox="0 0 400 10" fill="none">
                          <path
                            d="M0 0 L400 0 L400 2 Q370 7 340 3 Q310 0 280 4 Q250 8 220 3 Q190 0 160 5 Q130 8 100 3 Q70 0 40 5 Q20 7 0 2 Z"
                            fill="#ffffff"
                            fillOpacity="0.92"
                          />
                        </svg>
                      </div>
                    )}

                    <div>
                      {/* Top Badges & More Options Menu */}
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#edf3ec] dark:bg-emerald-950/70 text-[#448361] dark:text-emerald-300 border border-[#d3e5d7] dark:border-emerald-500/40">
                            ĐÃ SỞ HỮU
                          </span>
                          {deckSrs.due > 0 ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fdebec] dark:bg-rose-950/70 text-[#d44c47] dark:text-rose-300 border border-[#f9c9cb] dark:border-rose-500/40">
                              ⏰ {deckSrs.due} thẻ cần ôn
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f1f1ef] dark:bg-slate-800 text-[#787774] dark:text-slate-300 border border-[#e3e2e0] dark:border-white/10">
                              ✓ Đã ôn đủ
                            </span>
                          )}
                        </div>

                        {/* More Actions Dropdown & Share Link */}
                        <div className="flex items-center space-x-1 relative">
                          <button
                            type="button"
                            onClick={async () => {
                              const res = await copyFlashcardShareLink({
                                deckId: course.id,
                                deckTitle: course.title,
                                useNativeShare: true
                              });
                              if (res.success) {
                                playSound('success');
                                onShowToast?.(res.message);
                              }
                            }}
                            className="p-1 rounded-md hover:bg-[#efefed] dark:hover:bg-slate-800 text-[#787774] dark:text-slate-300 hover:text-[#2383e2] transition-colors cursor-pointer"
                            title="Sao chép đường dẫn chia sẻ bộ thẻ này"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setOpenMenuDeckId(isMenuOpen ? null : course.id)}
                            className="p-1 rounded-md hover:bg-[#efefed] dark:hover:bg-slate-800 text-[#787774] dark:text-slate-300 hover:text-[#37352f] dark:hover:text-white transition-colors cursor-pointer"
                            title="Tùy chọn khác (In, Tải Anki, Pass lại, Bán thẻ)"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setOpenMenuDeckId(null)}
                              />
                              <div className="absolute right-0 top-7 z-40 w-56 bg-white dark:bg-slate-800 rounded-xl border border-[#e9e9e8] dark:border-white/15 shadow-lg py-1.5 text-xs text-[#37352f] dark:text-white animate-fade-in divide-y divide-[#f1f1ef] dark:divide-white/10">
                                <div className="py-1">
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      setOpenMenuDeckId(null);
                                      const res = await copyFlashcardShareLink({
                                        deckId: course.id,
                                        deckTitle: course.title,
                                        useNativeShare: true
                                      });
                                      if (res.success) {
                                        playSound('success');
                                        onShowToast?.(res.message);
                                      }
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] dark:hover:bg-slate-700 flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <Share2 className="w-3.5 h-3.5 text-[#2383e2] dark:text-sky-400" />
                                    <span>🔗 Sao Chép Link Chia Sẻ</span>
                                  </button>
                                  {onOpenDirectChat && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenMenuDeckId(null);
                                        onOpenDirectChat(null, course);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] dark:hover:bg-slate-700 flex items-center space-x-2 cursor-pointer transition-colors"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                      <span>💬 Gửi Qua Tin Nhắn</span>
                                    </button>
                                  )}
                                </div>
                                <div className="py-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      onOpenSellDeck?.(course);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] dark:hover:bg-slate-700 flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <Tag className="w-3.5 h-3.5 text-[#cc782f] dark:text-amber-400" />
                                    <span>🏷️ Đăng Bán Lên Sàn C2C</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      onOpenPassDeck?.(course);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] dark:hover:bg-slate-700 flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <Repeat className="w-3.5 h-3.5 text-[#9065b0] dark:text-purple-400" />
                                    <span>🔁 Pass Lại Thẻ Cũ</span>
                                  </button>
                                </div>
                                <div className="py-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      exportAnkiDeckFile(course.title, course.previewCards);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] dark:hover:bg-slate-700 flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <Download className="w-3.5 h-3.5 text-[#2383e2] dark:text-sky-400" />
                                    <span>📥 Xuất File Anki (.txt)</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      exportCsvFile(course.title, course.previewCards);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] dark:hover:bg-slate-700 flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#0f7b6c] dark:text-teal-400" />
                                    <span>📊 Xuất File CSV (Quizlet / Excel)</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      exportMarkdownFile(course);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] dark:hover:bg-slate-700 flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#9065b0] dark:text-purple-400" />
                                    <span>📝 Xuất Markdown Notion (.md)</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      onOpenCheatSheet?.(course);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] dark:hover:bg-slate-700 flex items-center space-x-2 cursor-pointer transition-colors text-emerald-700 dark:text-emerald-300 font-semibold"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <span>📄 Xem Cheatsheet 1 Trang</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      printSummaryGuide(course);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] dark:hover:bg-slate-700 flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-[#448361] dark:text-emerald-400" />
                                    <span>🖨️ In Tài Liệu / Xuất PDF</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      printFlashcardCutoutSheet(course);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] dark:hover:bg-slate-700 flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <Scissors className="w-3.5 h-3.5 text-[#d44c47] dark:text-rose-400" />
                                    <span>✂️ In Thẻ Giấy A4 (Học Offline)</span>
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-[#37352f] dark:text-white mt-2.5 line-clamp-2 leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-xs text-[#787774] dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {course.subtitle || course.description}
                      </p>
                      <div className="mt-2.5 text-[11px] text-[#9b9a97] dark:text-slate-400 flex items-center space-x-1.5">
                        <Layers className="w-3 h-3" />
                        <span>{course.previewCards?.length || 0} thẻ Anki • {course.previewQuiz?.length || 0} câu trắc nghiệm</span>
                      </div>
                    </div>

                    {/* Notion Action Bar: Clean & Focused */}
                    <div className="mt-4 pt-3 border-t border-[#e9e9e8] dark:border-white/10 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenFlashcards(course)}
                          className="py-2 px-3 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-2xs transition-colors cursor-pointer touch-3d"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Học Thẻ 3D</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenQuiz(course)}
                          className="py-2 px-3 rounded-lg bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#efefed] dark:hover:bg-slate-700 border border-[#e9e9e8] dark:border-white/15 text-[#37352f] dark:text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer touch-3d"
                        >
                          <PlayCircle className="w-3.5 h-3.5 text-[#cc782f] dark:text-amber-400" />
                          <span>Thi Thử</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => onOpenMatchGame(course)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#efefed] dark:hover:bg-slate-700 border border-[#e9e9e8] dark:border-white/15 text-[#37352f] dark:text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer touch-3d"
                        >
                          <Gamepad2 className="w-3.5 h-3.5 text-[#2383e2] dark:text-sky-400" />
                          <span>Ghép Thẻ (Match)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setOpenMenuDeckId(isMenuOpen ? null : course.id)}
                          className="py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-[#efefed] dark:hover:bg-slate-700 border border-[#e9e9e8] dark:border-white/15 text-[#787774] dark:text-slate-300 hover:text-[#37352f] dark:hover:text-white text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer touch-3d"
                          title="In, Xuất Anki, Pass lại, Bán thẻ"
                        >
                          <span>Tiện ích</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
