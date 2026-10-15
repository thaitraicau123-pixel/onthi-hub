import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, FileText, Layers, PlayCircle, Download, Check, Coins } from 'lucide-react';
import { getSelectedTheme, subscribeToTheme } from '../utils/themeManager';

export default function CourseCard({
  course,
  isPurchased,
  onOpenFlashcards,
  onOpenQuiz,
  onBuy
}) {
  const [hasSnowCaps, setHasSnowCaps] = useState(() => !!getSelectedTheme()?.hasSnowCaps);

  useEffect(() => {
    const unsub = subscribeToTheme((theme) => {
      setHasSnowCaps(!!theme?.hasSnowCaps);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

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
    <div className="bg-white rounded-xl border border-[#e9e9e8] hover:border-[#c5c4c0] card-3d shadow-3d-sm hover:shadow-3d-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden group select-none relative">
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
          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#e7f3f8] text-[#2b7aa1] border border-[#cbe3ed]">
            {categoryLabel}
          </span>
          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#faece3] text-[#cc782f] border border-[#f3d6c1]">
            {badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-[#37352f] group-hover:text-[#2383e2] transition-colors line-clamp-2 leading-snug">
          {course.title}
        </h3>

        {/* Subtitle */}
        {course.subtitle && (
          <p className="mt-1.5 text-xs text-[#787774] line-clamp-2 leading-relaxed">
            {course.subtitle}
          </p>
        )}

        {/* Social Proof Stats */}
        <div className="mt-3 flex items-center space-x-2.5 text-xs text-[#787774]">
          <div className="flex items-center space-x-1 text-amber-600 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{rating}</span>
            <span className="text-[#9b9a97] font-normal">({reviewsCount})</span>
          </div>
          <span className="text-[#e9e9e8]">•</span>
          <span className="text-[#787774]">
            {studentsCount} người học
          </span>
        </div>

        {/* Highlights List */}
        <ul className="mt-3.5 space-y-1 text-xs text-[#5a5751] border-t border-[#e9e9e8]/70 pt-2.5">
          {highlights.slice(0, 2).map((item, idx) => (
            <li key={idx} className="flex items-start space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#448361] shrink-0 mt-0.5" />
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>

        {/* Format Tags */}
        <div className="mt-3 flex flex-wrap gap-1 pt-1">
          {formatList.map((fmt, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1 text-[10px] px-1.5 py-0.5 bg-[#f1f1ef] text-[#5a5751] border border-[#e3e2e0] rounded"
            >
              <FileText className="w-3 h-3 text-[#787774]" />
              <span>{fmt}</span>
            </span>
          ))}
        </div>

      </div>

      {/* Pricing & Footer Actions */}
      <div className="p-4 sm:p-5 pt-3 bg-[#faf9f8] border-t border-[#e9e9e8] mt-auto space-y-3">
        
        {/* Price Row */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1.5">
            <Coins className="w-4 h-4 text-amber-500 fill-amber-400 self-center shrink-0" />
            <span className="text-lg font-bold text-[#37352f]">
              {priceXu} Xu
            </span>
            {originalPriceXu > priceXu && (
              <span className="text-xs text-[#9b9a97] line-through">
                {originalPriceXu} Xu
              </span>
            )}
          </div>

          {isPurchased ? (
            <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 bg-[#edf3ec] text-[#448361] rounded-md border border-[#d3e5d7]">
              <Check className="w-3 h-3" />
              <span>Đã Mở Khóa</span>
            </span>
          ) : (
            discountPercent > 0 && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-[#fdebec] text-[#d44c47] rounded border border-[#f9c9cb]">
                -{discountPercent}%
              </span>
            )
          )}
        </div>

        {/* Interactive Preview Buttons */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onOpenFlashcards(course)}
            className="flex items-center justify-center space-x-1 py-1.5 px-2 text-xs font-semibold text-[#37352f] bg-white hover:bg-[#efefed] rounded-lg border border-[#e9e9e8] transition-colors shadow-2xs touch-3d cursor-pointer"
          >
            <Layers className="w-3 h-3 text-[#2383e2]" />
            <span>Xem Thẻ</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenQuiz(course)}
            className="flex items-center justify-center space-x-1 py-1.5 px-2 text-xs font-semibold text-[#37352f] bg-white hover:bg-[#efefed] rounded-lg border border-[#e9e9e8] transition-colors shadow-2xs touch-3d cursor-pointer"
          >
            <PlayCircle className="w-3 h-3 text-[#cc782f]" />
            <span>Thi Thử</span>
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
