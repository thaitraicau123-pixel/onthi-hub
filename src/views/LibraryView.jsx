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
              <span>📁</span>
              <span>Kho Prompt & AI Skills Của Tôi</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#787774] dark:text-slate-300 leading-relaxed">
              Lưu trữ vĩnh viễn ({unlockedList.length} bộ Prompt đã sở hữu). Xem chi tiết câu lệnh tiếng Anh và 1-Click Copy vào Higgsfield, Midjourney, N8N.
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

      {/* APPLE SMART PROMPT REVIEW WIDGET */}
      {unlockedList.length > 0 && (
        <div className="apple-card p-5 sm:p-6 rounded-3xl border border-black/[0.06] dark:border-white/[0.08] text-slate-900 dark:text-zinc-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full apple-pill-purple text-[11px] font-bold">
              <Brain className="w-3.5 h-3.5" />
              <span>Smart Recommendation • Prompt Đề Xuất Sử Dụng</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {srsStats.totalDue > 0 ? (
                <>🎯 Hôm nay có <span className="text-amber-500 font-extrabold">{srsStats.totalDue}</span> prompt đề xuất khai thác nội dung!</>
              ) : (
                <>🎉 Tuyệt vời! Bạn đã khám phá toàn bộ kho prompt sở hữu!</>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xl">
              Hệ thống tự động đề xuất các câu lệnh chất lượng cao để bạn tạo video 8K, mockup ảnh studio và kịch bản triệu view hôm nay.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
              <span className="apple-pill-amber px-2.5 py-0.5 rounded-full font-bold">
                ⏰ Đề xuất dùng: <strong>{srsStats.totalDue}</strong>
              </span>
              <span className="apple-pill-emerald px-2.5 py-0.5 rounded-full font-semibold">
                ✨ Đã copy dùng: <strong>{srsStats.totalLearned}</strong>
              </span>
              <span className="apple-pill-blue px-2.5 py-0.5 rounded-full font-semibold">
                🆕 Mẫu mới sở hữu: <strong>{srsStats.totalNew}</strong>
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {srsStats.totalDue > 0 ? (
              <button
                type="button"
                onClick={() => onOpenFlashcards(buildDueCardsDeck(unlockedList))}
                className="apple-btn-prominent w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-white fill-white" />
                <span>Mở Xem {srsStats.totalDue} Prompt Đề Xuất</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenFlashcards(buildDueCardsDeck(unlockedList))}
                className="apple-btn-secondary w-full md:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Xem Kho Prompt Sở Hữu</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* C2C PASS TIPS CALLOUT */}
      <div className="apple-card rounded-2xl border border-black/[0.06] dark:border-white/[0.08] p-4 text-xs flex items-center justify-between gap-3 text-slate-900 dark:text-zinc-100 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Repeat className="w-4 h-4" />
          </div>
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-white">Đã khai thác xong giá trị của gói Prompt? </span>
            <span className="text-slate-500 dark:text-zinc-400">Bạn có thể bấm nút <strong>&ldquo;Tùy chọn ➔ Pass Lại Prompt C2C&rdquo;</strong> ở mỗi gói bên dưới để nhượng lại cho Creator khác trên Chợ và nhận Xu vào ví!</span>
          </div>
        </div>
      </div>

      {unlockedList.length === 0 ? (
        <ActionableEmptyState
          icon={BookOpen}
          badge="KHO PROMPT TRỐNG"
          title="Kho Prompt của bạn đang chờ đón bộ đầu tiên"
          description="Bạn chưa mở khóa gói Prompt nào. Hãy ghé qua Chợ Prompt C2C để tìm gói prompt chất lượng giá chỉ từ 2 Xu hoặc tự tạo prompt bằng AI!"
          primaryAction={{
            label: 'Vào Chợ Prompt C2C',
            onClick: () => onSwitchTab('marketplace'),
            icon: Store
          }}
          secondaryAction={{
            label: 'Tạo Prompt Bằng AI',
            onClick: () => onSwitchTab('create'),
            icon: Sparkles
          }}
        />
      ) : (
        <div className="space-y-4">
          {/* Filter and Search Bar for Library (Notion Control Bar) */}
          <div className="bg-white/95 dark:bg-slate-900/90 p-3 rounded-xl border border-[#e9e9e8] dark:border-white/15 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-[#37352f] dark:text-white">
            {/* Apple Segmented Category Pills */}
            <div className="apple-segmented-container flex flex-wrap items-center gap-1">
              {[
                { id: 'all', label: 'Tất Cả' },
                { id: 'video-ai', label: '🎬 Video AI' },
                { id: 'image-ai', label: '🎨 Ảnh Studio' },
                { id: 'copy-mmo', label: '✍️ Kịch Bản MMO' },
                { id: 'skills-automation', label: '⚡ N8N & Auto' },
                { id: 'acc-tools', label: '🔑 Tool & Tài Nguyên' }
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
                    className={`apple-segmented-item flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                      active ? 'active' : ''
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      active ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-black/[0.04] dark:bg-white/[0.08] text-slate-400 dark:text-zinc-500'
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
                <option value="due_first">⏰ Đề xuất dùng trước</option>
                <option value="title">🔤 Tên A → Z</option>
              </select>
            </div>
          </div>

          {/* Results count & quick clear */}
          {(selectedCategory !== 'all' || searchLibrary) && (
            <div className="flex items-center justify-between text-xs text-[#787774] dark:text-slate-300 px-1 font-medium">
              <span>Đang hiển thị {filteredUnlockedList.length} / {unlockedList.length} gói Prompt</span>
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
              title={searchLibrary ? `Không tìm thấy gói Prompt nào khớp với "${searchLibrary}"` : 'Không có gói Prompt nào trong danh mục này'}
              description={`Kho của bạn hiện có ${unlockedList.length} gói Prompt. Hãy thử kiểm tra lại chính tả hoặc đặt lại bộ lọc.`}
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
                    className="apple-card rounded-2xl border border-black/[0.06] dark:border-white/[0.08] p-4 sm:p-5 hover:border-[#007aff]/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-slate-900 dark:text-zinc-100 relative overflow-hidden group"
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
                          <span className="apple-pill-emerald text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            ĐÃ SỞ HỮU
                          </span>
                          <span className="apple-pill-blue text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                            ✓ Sẵn sàng Copy
                          </span>
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
                            className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-medium hover:bg-[#efefed] dark:hover:bg-slate-800 text-[#787774] dark:text-slate-300 hover:text-[#2383e2] transition-colors cursor-pointer"
                            title="Sao chép đường dẫn chia sẻ gói Prompt này"
                          >
                            <Share2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Link</span>
                          </button>

                          {onOpenDirectChat && (
                            <button
                              type="button"
                              onClick={() => {
                                playSound('click');
                                onOpenDirectChat(null, course);
                              }}
                              className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-[#787774] dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                              title="Gửi gói Prompt này vào đoạn chat với Creator"
                              aria-label="Chia sẻ qua tin nhắn"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span className="hidden sm:inline">Gửi chat</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setOpenMenuDeckId(isMenuOpen ? null : course.id)}
                            className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium hover:bg-[#efefed] dark:hover:bg-slate-800 text-[#787774] dark:text-slate-300 hover:text-[#37352f] dark:hover:text-white transition-colors cursor-pointer"
                            title="Tùy chọn khác (Xuất file, Pass lại C2C, Bán Prompt)"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Tùy chọn</span>
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
                                    <span>🔁 Pass Lại Prompt C2C</span>
                                  </button>
                                </div>
                                <div className="py-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      exportCsvFile(course.title, course.previewCards);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] dark:hover:bg-slate-700 flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#0f7b6c] dark:text-teal-400" />
                                    <span>📊 Xuất File Excel / CSV</span>
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
                                      printSummaryGuide(course);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] dark:hover:bg-slate-700 flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-[#448361] dark:text-emerald-400" />
                                    <span>🖨️ Xuất File PDF Kịch Bản</span>
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
                        <span>{course.previewCards?.length || 0} Prompts thực chiến</span>
                      </div>
                    </div>

                    {/* Apple Action Bar: Clean & Focused */}
                    <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2">
                      <button
                        type="button"
                        onClick={() => onOpenFlashcards(course)}
                        className="apple-btn-prominent w-full py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Xem & Sao Chép Prompt Siêu Tốc</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpenMenuDeckId(isMenuOpen ? null : course.id)}
                        className="apple-btn-secondary w-full py-2 px-2.5 text-xs font-medium rounded-xl flex items-center justify-center space-x-1 cursor-pointer"
                        title="Xuất file, Pass lại, Bán gói prompt"
                      >
                        <span>Tiện ích mở rộng</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>
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
