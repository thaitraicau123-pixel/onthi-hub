import React from 'react';
import { Star, CheckCircle, FileText, Layers, PlayCircle, ShoppingCart, Download, Check } from 'lucide-react';

export default function CourseCard({
  course,
  isPurchased,
  onOpenFlashcards,
  onOpenQuiz,
  onBuy
}) {
  return (
    <div className="bg-[#fcf7ec] rounded-3xl border border-[#eadfcb] shadow-md hover:shadow-2xl hover:border-[#f02c85]/40 transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Top Banner with Badge */}
      <div className="p-5 sm:p-6 pb-4 flex-1 flex flex-col">
        
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center text-[11px] font-black px-2.5 py-1 rounded-lg bg-[#f02c85]/10 text-[#f02c85] border border-[#f02c85]/20">
            {course.categoryLabel}
          </span>
          <span className="inline-flex items-center text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#ff5f38]/15 text-[#e0451f] border border-[#ff5f38]/30">
            {course.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-black text-[#28071a] group-hover:text-[#f02c85] transition-colors line-clamp-2 leading-snug">
          {course.title}
        </h3>

        {/* Subtitle */}
        <p className="mt-2 text-xs sm:text-sm text-[#7a5a6b] line-clamp-2 leading-relaxed font-medium">
          {course.subtitle}
        </p>

        {/* Social Proof Stats */}
        <div className="mt-3.5 flex items-center space-x-3 text-xs text-[#7a5a6b]">
          <div className="flex items-center space-x-1 text-amber-500 font-bold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{course.rating}</span>
            <span className="text-[#99798b] font-normal">({course.reviewsCount})</span>
          </div>
          <span className="text-[#eadfcb]">•</span>
          <span className="font-semibold text-[#5c3e4f]">
            {course.studentsCount.toLocaleString()} người học
          </span>
        </div>

        {/* Highlights List */}
        <ul className="mt-4 space-y-1.5 text-xs text-[#5c3e4f] border-t border-[#eadfcb] pt-3">
          {course.highlights.slice(0, 3).map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#f02c85] shrink-0 mt-0.5" />
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>

        {/* Format Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5 pt-1">
          {course.format.map((fmt, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 bg-white text-[#28071a] border border-[#eadfcb] rounded-lg"
            >
              <FileText className="w-3 h-3 text-[#f02c85]" />
              <span>{fmt}</span>
            </span>
          ))}
        </div>

      </div>

      {/* Pricing & Footer Actions */}
      <div className="p-5 sm:p-6 pt-3 bg-white/70 border-t border-[#eadfcb] mt-auto">
        
        {/* Price Row */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-black text-[#28071a]">
                {course.price.toLocaleString()}đ
              </span>
              <span className="text-xs sm:text-sm text-[#99798b] line-through">
                {course.originalPrice.toLocaleString()}đ
              </span>
            </div>
            <span className="text-[10px] text-[#f02c85] font-black uppercase">
              Tiết kiệm {Math.round((1 - course.price / course.originalPrice) * 100)}%
            </span>
          </div>

          {isPurchased && (
            <span className="inline-flex items-center space-x-1 text-xs font-black px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              <span>Đã Mở Khóa</span>
            </span>
          )}
        </div>

        {/* Interactive Preview Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <button
            onClick={() => onOpenFlashcards(course)}
            className="flex items-center justify-center space-x-1.5 py-2 px-2 text-xs font-black text-[#2c081c] bg-[#fcf5e5] hover:bg-[#faebd0] rounded-xl border border-[#eadfcb] transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#f02c85]" />
            <span>Học Thử Thẻ</span>
          </button>

          <button
            onClick={() => onOpenQuiz(course)}
            className="flex items-center justify-center space-x-1.5 py-2 px-2 text-xs font-black text-[#2c081c] bg-white hover:bg-slate-50 rounded-xl border border-[#eadfcb] transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5 text-[#f02c85]" />
            <span>Thi Thử 5 Câu</span>
          </button>
        </div>

        {/* Buy or Download Button */}
        {isPurchased ? (
          <button
            onClick={() => onOpenFlashcards(course)}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 text-xs sm:text-sm font-black text-white bg-[#f02c85] hover:bg-[#dc1f74] rounded-xl shadow-md shadow-pink-900/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Tải File & Học Full Bộ</span>
          </button>
        ) : (
          <button
            onClick={() => onBuy(course)}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 text-xs sm:text-sm font-black text-white btn-wayground-sunset hover:opacity-95 rounded-xl shadow-lg shadow-pink-900/30 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Mua Ngay ({course.price / 1000}K)</span>
          </button>
        )}

      </div>

    </div>
  );
}
