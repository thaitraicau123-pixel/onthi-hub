import React, { memo } from 'react';
import { Star, CheckCircle, FileText, Layers, PlayCircle, Download, Check, Coins } from 'lucide-react';
import { getSelectedTheme } from '../utils/themeManager';

function CourseCard({
  course,
  isPurchased,
  onOpenFlashcards,
  onOpenQuiz,
  onOpenCheatSheet,
  onBuy
}) {
  const hasSnowCaps = !!getSelectedTheme()?.hasSnowCaps;

  if (!course) return null;

  // Safe Fallback Calculations
  const rating = course.rating || 4.9;
  const reviewsCount = course.reviewsCount || course.salesCount || 128;
  const studentsCount = (course.studentsCount || course.salesCount || 360).toLocaleString();
  const categoryLabel = course.categoryLabel || course.categoryName || 'Tài Liệu Ôn Thi';
  const badge = course.badge || (course.salesCount ? `Đã bán ${course.salesCount}` : 'Đề Chọn Lọc');

  const highlights = Array.isArray(course.highlights) && course.highlights.length > 0
    ? course.highlights
    : [
        'Bộ thẻ ghi nhớ trọng tâm bám sát cấu trúc đề thi',
        'Ứng dụng thuật toán lặp lại ngắt quãng Spaced Repetition',
        'Hỗ trợ chế độ thi trắc nghiệm và ôn rảnh tay'
      ];

  const formatList = Array.isArray(course.format) && course.format.length > 0
    ? course.format
    : ['Thẻ Flashcard 3D', 'File Anki (.apkg)', 'Trắc nghiệm tính giờ'];

  // Pure Platform Coin (Xu) Pricing
  const priceXu = course.priceXu !== undefined
    ? Number(course.priceXu)
    : course.price
    ? Math.max(5, Math.round(course.price / 3000))
    : 25;

  const originalPriceXu = course.originalPriceXu !== undefined
    ? Number(course.originalPriceXu)
    : Math.round(priceXu * 2.5);

  const discountPercent = originalPriceXu > priceXu
    ? Math.round((1 - priceXu / originalPriceXu) * 100)
    : 0;

  return (
    <div className="bg-white/95 dark:bg-[#16122b]/95 backdrop-blur-md rounded-xl border border-[#e9e9e8] dark:border-white/10 hover:border-[#c5c4c0] card-3d shadow-3d-sm hover:shadow-3d-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden group select-none relative text-[#37352f] dark:text-[#f8fafc]">
      {/* Festive Winter Snow Cap Banner */}
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
      
      {/* Top Banner with Notion Pill Badges */}
      <div className="p-4 sm:p-5 pb-3 flex-1 flex flex-col">
        
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#e7f3f8] dark:bg-sky-950/80 text-[#2b7aa1] dark:text-sky-300 border border-[#cbe3ed] dark:border-sky-500/40">
            {categoryLabel}
          </span>
          <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#faece3] dark:bg-amber-950/80 text-[#cc782f] dark:text-amber-300 border border-[#f3d6c1] dark:border-amber-500/40">
            {badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-[#37352f] dark:text-white group-hover:text-[#2383e2] dark:group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
          {course.title}
        </h3>

        {/* Subtitle */}
        {course.subtitle && (
          <p className="mt-1.5 text-xs text-[#787774] dark:text-slate-300 line-clamp-2 leading-relaxed">
            {course.subtitle}
          </p>
        )}

        {/* Social Proof Stats */}
        <div className="mt-3 flex items-center space-x-2.5 text-xs text-[#787774] dark:text-slate-300">
          <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{rating}</span>
            <span className="text-[#9b9a97] dark:text-slate-400 font-normal">({reviewsCount})</span>
          </div>
          <span className="text-[#e9e9e8] dark:text-white/20">•</span>
          <span className="text-[#787774] dark:text-slate-300">
            {studentsCount} người học
          </span>
        </div>

        {/* Highlights List */}
        <ul className="mt-3.5 space-y-1 text-xs text-[#5a5751] dark:text-slate-300 border-t border-[#e9e9e8]/70 dark:border-white/10 pt-2.5">
          {highlights.slice(0, 2).map((item, idx) => (
            <li key={idx} className="flex items-start space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#448361] dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>

        {/* Format Tags */}
        <div className="mt-3 flex flex-wrap gap-1 pt-1">
          {formatList.map((fmt, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1 text-[10px] px-1.5 py-0.5 bg-[#f1f1ef] dark:bg-slate-800/80 text-[#5a5751] dark:text-slate-200 border border-[#e3e2e0] dark:border-white/10 rounded"
            >
              <FileText className="w-3 h-3 text-[#787774] dark:text-slate-400" />
              <span>{fmt}</span>
            </span>
          ))}
        </div>

      </div>

      {/* Pricing & Footer Actions */}
      <div className="p-4 sm:p-5 pt-3 bg-[#faf9f8]/95 dark:bg-[#1a1533]/95 border-t border-[#e9e9e8] dark:border-white/10 mt-auto space-y-3">
        
        {/* Price Row */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1.5">
            <Coins className="w-4 h-4 text-amber-500 fill-amber-400 self-center shrink-0" />
            <span className="text-lg font-bold text-[#37352f] dark:text-white">
              {priceXu} Xu
            </span>
            {originalPriceXu > priceXu && (
              <span className="text-xs text-[#9b9a97] dark:text-slate-400 line-through">
                {originalPriceXu} Xu
              </span>
            )}
          </div>

          {isPurchased ? (
            <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 bg-[#edf3ec] dark:bg-emerald-950/60 text-[#448361] dark:text-emerald-300 rounded-md border border-[#d3e5d7] dark:border-emerald-600/40">
              <Check className="w-3 h-3" />
              <span>Đã Mở Khóa</span>
            </span>
          ) : (
            discountPercent > 0 && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-[#fdebec] dark:bg-rose-950/60 text-[#d44c47] dark:text-rose-300 rounded border border-[#f9c9cb] dark:border-rose-600/40">
                -{discountPercent}%
              </span>
            )
          )}
        </div>

        {/* Interactive Preview Buttons */}
        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => onOpenFlashcards(course)}
            className="flex items-center justify-center space-x-1 py-1.5 px-1.5 text-[11px] font-semibold text-[#37352f] dark:text-white bg-white dark:bg-white/10 hover:bg-[#efefed] dark:hover:bg-white/20 rounded-lg border border-[#e9e9e8] dark:border-white/15 transition-colors shadow-2xs touch-3d cursor-pointer"
            title="Xem trước thẻ Anki"
          >
            <Layers className="w-3 h-3 text-[#2383e2] dark:text-sky-400" />
            <span>Lật Thẻ</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenQuiz(course)}
            className="flex items-center justify-center space-x-1 py-1.5 px-1.5 text-[11px] font-semibold text-[#37352f] dark:text-white bg-white dark:bg-white/10 hover:bg-[#efefed] dark:hover:bg-white/20 rounded-lg border border-[#e9e9e8] dark:border-white/15 transition-colors shadow-2xs touch-3d cursor-pointer"
            title="Thi thử trắc nghiệm 10 câu bấm giờ"
          >
            <PlayCircle className="w-3 h-3 text-[#cc782f] dark:text-amber-400" />
            <span>Thi Thử</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenCheatSheet && onOpenCheatSheet(course)}
            className="flex items-center justify-center space-x-1 py-1.5 px-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg border border-emerald-200 dark:border-emerald-700/60 transition-colors shadow-2xs touch-3d cursor-pointer"
            title="Bảng Cheatsheet tóm tắt 1 trang & In tài liệu cứu sinh"
          >
            <FileText className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Tóm Tắt</span>
          </button>
        </div>

        {/* Buy or Download Button */}
        {isPurchased ? (
          <button
            type="button"
            onClick={() => onOpenFlashcards(course)}
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold text-[#448361] bg-[#edf3ec] hover:bg-[#e0ece0] border border-[#d3e5d7] rounded-lg transition-colors cursor-pointer touch-3d"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Vào Học Bộ Thẻ</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onBuy(course)}
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold text-white bg-[#2e2e2e] hover:bg-[#1a1a1a] rounded-lg shadow-2xs transition-all active:scale-[0.98] cursor-pointer touch-3d btn-3d"
          >
            <Coins className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Mở Khóa ({priceXu} Xu)</span>
          </button>
        )}

      </div>

    </div>
  );
}

export default memo(CourseCard);
