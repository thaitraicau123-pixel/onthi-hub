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
  FileText
} from 'lucide-react';
import {
  exportAnkiDeckFile,
  exportCsvFile,
  exportMarkdownFile,
  printSummaryGuide,
  printFlashcardCutoutSheet
} from '../utils/storage';
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
  onSwitchTab
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
    <div className="space-y-6 animate-fade-in pb-16 text-[#37352f]">
      
      {/* NOTION PAGE HEADER */}
      <div className="space-y-3 pb-2 border-b border-[#e9e9e8]">
        <div className="text-4xl select-none">📚</div>
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37352f] tracking-tight">
              Tủ Thẻ & Tài Liệu Của Tôi
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#787774] leading-relaxed">
              Lưu trữ vĩnh viễn trên thiết bị của bạn ({unlockedList.length} bộ tài liệu). Bắt đầu học ngay hoặc xuất file nạp vào Anki.
            </p>
          </div>

          {isComboUser && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#fbf3db] border border-[#f4e4b7] text-[#c29243] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#c29243]" />
              <span>Gói All-Access Trọn Đời</span>
            </div>
          )}
        </div>
      </div>

      {/* NOTION SPACED REPETITION (SM-2) CALLOUT WIDGET */}
      {unlockedList.length > 0 && (
        <div className="bg-[#fbfbfa] p-4 sm:p-5 rounded-xl border border-[#e9e9e8] text-[#37352f] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#f4f0f7] border border-[#e3d7ec] text-[11px] font-semibold text-[#9065b0]">
              <Brain className="w-3.5 h-3.5 text-[#9065b0]" />
              <span>SuperMemo SM-2 • Chống Quên Lãng</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#37352f]">
              {srsStats.totalDue > 0 ? (
                <>🎯 Hôm nay có <span className="text-[#d44c47] font-extrabold">{srsStats.totalDue}</span> thẻ cần ôn tập!</>
              ) : (
                <>🎉 Tuyệt vời! Bạn đã ôn hết tất cả thẻ đến hạn hôm nay!</>
              )}
            </h3>
            <p className="text-xs text-[#787774] max-w-xl">
              Hệ thống tự động tính chu kỳ lặp lại ngắt quãng để củng cố trí nhớ dài hạn trước ngày thi.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1 text-xs">
              <span className="px-2 py-0.5 rounded bg-[#fdebec] border border-[#f9c9cb] text-[#d44c47] font-semibold">
                ⏰ Cần ôn: <strong>{srsStats.totalDue}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#edf3ec] border border-[#d3e5d7] text-[#448361] font-semibold">
                🧠 Đã nhớ sâu: <strong>{srsStats.totalLearned}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#fbf3db] border border-[#f4e4b7] text-[#c29243] font-semibold">
                ✨ Thẻ mới: <strong>{srsStats.totalNew}</strong>
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {srsStats.totalDue > 0 ? (
              <button
                type="button"
                onClick={() => onOpenFlashcards(buildDueCardsDeck(unlockedList))}
                className="w-full md:w-auto px-4 py-2.5 rounded-lg bg-[#2e2e2e] hover:bg-[#1a1a1a] text-white font-semibold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Ôn Toàn Bộ {srsStats.totalDue} Thẻ Đến Hạn</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenFlashcards(buildDueCardsDeck(unlockedList))}
                className="w-full md:w-auto px-4 py-2 rounded-lg bg-white hover:bg-[#efefed] border border-[#e9e9e8] text-[#37352f] font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <CheckCircle className="w-4 h-4 text-[#448361]" />
                <span>Ôn Tập Thêm Luyện Phản Xạ</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* MISTAKES QUICK ACCESS CALLOUT */}
      {unmasteredMistakesCount > 0 && (
        <div className="bg-[#fdebec] border border-[#f9c9cb] rounded-xl p-3.5 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-[#d44c47] shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#f9c9cb] text-[#d44c47] flex items-center justify-center shrink-0">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm block text-[#37352f]">
                Sổ Tay Câu Sai: Có {unmasteredMistakesCount} câu cần khắc phục!
              </span>
              <span className="text-[#787774] text-[11px]">
                Xem lại câu trắc nghiệm làm sai và nhận chẩn đoán lỗ hổng kiến thức từ AI.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenMistakes}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-[#d44c47] hover:bg-[#c23d38] text-white font-semibold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>Mở Sổ Tay ({unmasteredMistakesCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* C2C PASS TIPS CALLOUT */}
      <div className="bg-[#f1f1ef] border border-[#e9e9e8] rounded-xl p-3 text-xs flex items-center justify-between gap-2.5 text-[#37352f]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-md bg-white border border-[#e9e9e8] text-[#2383e2] flex items-center justify-center shrink-0">
            <Repeat className="w-3.5 h-3.5" />
          </div>
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold">Đã thi đỗ hoặc học xong tài liệu? </span>
            <span className="text-[#787774]">Bạn có thể bấm nút "Pass Lại Thẻ Cũ" ở mỗi bộ thẻ bên dưới để nhượng lại cho bạn học khác trên Sàn C2C và nhận Xu vào ví!</span>
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
          <div className="bg-white p-3 rounded-xl border border-[#e9e9e8] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-[#37352f]">
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
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
                      active
                        ? 'bg-[#37352f] text-white shadow-2xs font-semibold'
                        : 'bg-[#f7f6f5] hover:bg-[#f0efed] text-[#5a5955] border border-[#e9e9e8]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] font-medium px-1.5 rounded-full ${
                      active ? 'bg-white/20 text-white' : 'bg-[#e9e9e8] text-[#787774]'
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
                <Search className="w-3.5 h-3.5 text-[#9b9a97] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm trong tủ thẻ..."
                  value={searchLibrary}
                  onChange={(e) => setSearchLibrary(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#f7f6f5] hover:bg-[#f0efed] focus:bg-white text-[#37352f] placeholder:text-[#9b9a97] border border-[#e9e9e8] rounded-lg outline-none focus:border-[#2383e2] transition-colors"
                />
                {searchLibrary && (
                  <button
                    type="button"
                    onClick={() => setSearchLibrary('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9b9a97] hover:text-[#37352f] text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-xs bg-[#f7f6f5] hover:bg-[#f0efed] text-[#37352f] font-medium border border-[#e9e9e8] rounded-lg outline-none focus:border-[#2383e2] transition-colors cursor-pointer"
              >
                <option value="due_first">⏰ Cần ôn tập trước</option>
                <option value="title">🔤 Tên A → Z</option>
              </select>
            </div>
          </div>

          {/* Results count & quick clear */}
          {(selectedCategory !== 'all' || searchLibrary) && (
            <div className="flex items-center justify-between text-xs text-[#787774] px-1 font-medium">
              <span>Đang hiển thị {filteredUnlockedList.length} / {unlockedList.length} bộ thẻ</span>
              <button
                type="button"
                onClick={() => { setSelectedCategory('all'); setSearchLibrary(''); }}
                className="text-[#2383e2] hover:underline font-semibold cursor-pointer"
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
                    className="p-4 sm:p-5 rounded-xl border border-[#e9e9e8] bg-white hover:border-[#c5c4c0] card-3d shadow-3d-sm hover:shadow-3d-md hover:-translate-y-0.5 transition-all flex flex-col justify-between text-[#37352f] relative overflow-hidden"
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
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#edf3ec] text-[#448361] border border-[#d3e5d7]">
                            ĐÃ SỞ HỮU
                          </span>
                          {deckSrs.due > 0 ? (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#fdebec] text-[#d44c47] border border-[#f9c9cb]">
                              ⏰ {deckSrs.due} thẻ cần ôn
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f1f1ef] text-[#787774] border border-[#e3e2e0]">
                              ✓ Đã ôn đủ
                            </span>
                          )}
                        </div>

                        {/* More Actions Dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setOpenMenuDeckId(isMenuOpen ? null : course.id)}
                            className="p-1 rounded-md hover:bg-[#efefed] text-[#787774] hover:text-[#37352f] transition-colors cursor-pointer"
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
                              <div className="absolute right-0 top-7 z-40 w-56 bg-white rounded-xl border border-[#e9e9e8] shadow-lg py-1.5 text-xs text-[#37352f] animate-fade-in divide-y divide-[#f1f1ef]">
                                <div className="py-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      onOpenSellDeck?.(course);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <Tag className="w-3.5 h-3.5 text-[#cc782f]" />
                                    <span>🏷️ Đăng Bán Lên Sàn C2C</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      onOpenPassDeck?.(course);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <Repeat className="w-3.5 h-3.5 text-[#9065b0]" />
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
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <Download className="w-3.5 h-3.5 text-[#2383e2]" />
                                    <span>📥 Xuất File Anki (.txt)</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      exportCsvFile(course.title, course.previewCards);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#0f7b6c]" />
                                    <span>📊 Xuất File CSV (Quizlet / Excel)</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      exportMarkdownFile(course);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#9065b0]" />
                                    <span>📝 Xuất Markdown Notion (.md)</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      printSummaryGuide(course);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-[#448361]" />
                                    <span>🖨️ In Tài Liệu / Xuất PDF</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDeckId(null);
                                      printFlashcardCutoutSheet(course);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7f6f5] flex items-center space-x-2 cursor-pointer transition-colors"
                                  >
                                    <Scissors className="w-3.5 h-3.5 text-[#d44c47]" />
                                    <span>✂️ In Thẻ Giấy A4 (Học Offline)</span>
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-[#37352f] mt-2.5 line-clamp-2 leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-xs text-[#787774] mt-1 line-clamp-2 leading-relaxed">
                        {course.subtitle || course.description}
                      </p>
                      <div className="mt-2.5 text-[11px] text-[#9b9a97] flex items-center space-x-1.5">
                        <Layers className="w-3 h-3" />
                        <span>{course.previewCards?.length || 0} thẻ Anki • {course.previewQuiz?.length || 0} câu trắc nghiệm</span>
                      </div>
                    </div>

                    {/* Notion Action Bar: Clean & Focused */}
                    <div className="mt-4 pt-3 border-t border-[#e9e9e8] space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenFlashcards(course)}
                          className="py-2 px-3 rounded-lg bg-[#2e2e2e] hover:bg-[#1a1a1a] text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-2xs transition-colors cursor-pointer touch-3d btn-3d"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Học Thẻ 3D</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenQuiz(course)}
                          className="py-2 px-3 rounded-lg bg-white hover:bg-[#efefed] border border-[#e9e9e8] text-[#37352f] text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer touch-3d"
                        >
                          <PlayCircle className="w-3.5 h-3.5 text-[#cc782f]" />
                          <span>Thi Thử</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => onOpenMatchGame(course)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#f7f6f5] hover:bg-[#efefed] border border-[#e9e9e8] text-[#37352f] text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer touch-3d"
                        >
                          <Gamepad2 className="w-3.5 h-3.5 text-[#2383e2]" />
                          <span>Ghép Thẻ (Match)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setOpenMenuDeckId(isMenuOpen ? null : course.id)}
                          className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-[#efefed] border border-[#e9e9e8] text-[#787774] hover:text-[#37352f] text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer touch-3d"
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
