import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  X,
  Search,
  Sparkles,
  Bookmark,
  Share2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useModalDismiss } from '../hooks/useModalDismiss';
import { playSound } from '../utils/storage';
import { recordStudyAction } from '../utils/gamification';
import { getCheatSheetForCourse, CHEATSHEETS_DATA } from '../data/cheatsheetsData';
import { COURSES_DATA } from '../data/coursesData';
import confetti from 'canvas-confetti';

export default function CheatSheetModal({
  course,
  onClose,
  onOpenFlashcards
}) {
  const [selectedCourseId, setSelectedCourseId] = useState(course?.id || 'cc-kien-thuc-chung');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Close on Escape & backdrop click
  const { handleBackdropClick } = useModalDismiss(onClose, true);

  const activeCourse = COURSES_DATA.find(c => c.id === selectedCourseId) || course || COURSES_DATA[0];
  const cheatsheet = getCheatSheetForCourse(activeCourse);

  const handlePrint = () => {
    playSound('flip');
    recordStudyAction(20);
    window.print();
  };

  const handleCopyMarkdown = () => {
    if (!cheatsheet) return;
    playSound('success');
    let md = `# ${cheatsheet.title}\n${cheatsheet.subtitle}\n\n`;
    cheatsheet.sections.forEach(sec => {
      md += `## ${sec.title}\n`;
      sec.items.forEach(it => {
        md += `- **${it.label}**: ${it.value}${it.note ? ` (${it.note})` : ''}\n`;
      });
      md += '\n';
    });
    if (cheatsheet.quickTips?.length) {
      md += `## Mẹo Ôn Thi Cấp Tốc:\n`;
      cheatsheet.quickTips.forEach(tip => {
        md += `- 💡 ${tip}\n`;
      });
    }
    navigator.clipboard.writeText(md);
    setIsCopied(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.4 } });
    setTimeout(() => setIsCopied(false), 2500);
  };

  if (!cheatsheet) return null;

  const q = searchQuery.toLowerCase().trim();
  const filteredSections = cheatsheet.sections.map(sec => ({
    ...sec,
    items: sec.items.filter(it => 
      !q || 
      it.label.toLowerCase().includes(q) || 
      it.value.toLowerCase().includes(q) || 
      (it.note && it.note.toLowerCase().includes(q))
    )
  })).filter(sec => sec.items.length > 0);

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in print:p-0 print:bg-white print:static"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-up print:shadow-none print:border-none print:max-h-none print:w-full"
      >
        {/* HEADER BAR (Hidden during print) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-[#fbfbfa] dark:bg-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2383e2] to-cyan-500 text-white flex items-center justify-center font-bold shadow-md shadow-sky-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  TÀI LIỆU CỨU SINH 1 TRANG
                </span>
                <span className="px-2 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                  {cheatsheet.badge}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white line-clamp-1">
                {cheatsheet.title}
              </h3>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              title="In bản tóm tắt hoặc lưu file PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In 1 Trang / Lưu PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-600 flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Sao chép toàn bộ sang Notion / Apple Notes"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Đã Sao Chép!' : 'Chép Sang Notion'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* COURSE SELECTOR & SEARCH TOOLBAR (Hidden during print) */}
        <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0 print:hidden text-xs">
          {/* Course Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-slate-500 shrink-0 mr-1">Chủ đề:</span>
            {COURSES_DATA.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  playSound('flip');
                  setSelectedCourseId(c.id);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  c.id === selectedCourseId
                    ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {c.categoryLabel?.split(' ')[0] || '📖'} {c.title.split('-')[0]}
              </button>
            ))}
          </div>

          {/* Quick Filter */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tra cứu từ khóa, mốc số..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 outline-none focus:border-[#2383e2] text-xs"
            />
          </div>
        </div>

        {/* PRINTABLE CONTENT BODY */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100 print:overflow-visible print:p-0">
          
          {/* Printable Header Document */}
          <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-3 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#2383e2] uppercase tracking-wider">
                <span>ÔnThiHub.vn</span>
                <span>•</span>
                <span>Tài Liệu Tóm Tắt Trọng Tâm 1 Trang</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
                {cheatsheet.title}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {cheatsheet.subtitle}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                Cập nhật: {cheatsheet.updatedDate}
              </span>
            </div>
          </div>

          {/* Cheatsheet Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
            {filteredSections.map((sec, sIdx) => (
              <div
                key={sIdx}
                className="bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3 print:bg-white print:border-slate-400 print:p-2.5"
              >
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center space-x-1.5 pb-2 border-b border-slate-200/80 dark:border-slate-700">
                  <span>{sec.title}</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {sec.items.map((it, iIdx) => (
                    <div
                      key={iIdx}
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 print:border-slate-200 print:p-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {it.label}:
                        </span>
                        <span className="font-black text-[#2383e2] dark:text-sky-400 text-right shrink-0">
                          {it.value}
                        </span>
                      </div>
                      {it.note && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic leading-relaxed">
                          📌 {it.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips Callout */}
          {cheatsheet.quickTips?.length > 0 && (
            <div className="p-4 bg-amber-50/90 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs space-y-2 print:border-amber-400 print:bg-white">
              <h5 className="font-black text-amber-950 dark:text-amber-200 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Mẹo Sống Còn Trong Phòng Thi:</span>
              </h5>
              <ul className="space-y-1 text-slate-700 dark:text-amber-100/90 list-disc list-inside leading-relaxed text-[11px] sm:text-xs">
                {cheatsheet.quickTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Print Footer Watermark */}
          <div className="hidden print:flex items-center justify-between pt-4 border-t border-slate-300 text-[10px] text-slate-500 font-mono">
            <span>In từ nền tảng ÔnThiHub.vn • Thuật toán Flashcard Anki SM-2 số 1 Việt Nam</span>
            <span>Chúc bạn thi đỗ xuất sắc!</span>
          </div>

        </div>

        {/* FOOTER ACTIONS (Hidden during print) */}
        <div className="p-4 bg-[#fbfbfa] dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 print:hidden text-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            💡 <strong>Mẹo:</strong> Bạn có thể bấm <kbd className="font-mono bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700 dark:text-slate-200">Ctrl + P</kbd> hoặc nút <strong>In 1 Trang</strong> để in ra giấy kẹp vào sổ tay.
          </span>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {onOpenFlashcards && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFlashcards(activeCourse);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Học Flashcard Ngay</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-lg transition-colors cursor-pointer"
            >
              Đóng (Esc)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
