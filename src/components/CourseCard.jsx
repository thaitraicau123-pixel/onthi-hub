import React, { memo, useState } from 'react';
import { Star, CheckCircle, FileText, Layers, PlayCircle, Download, Check, Coins, Share2, MessageCircle, FolderGit2, Code } from 'lucide-react';
import { getSelectedTheme } from '../utils/themeManager';
import { copyFlashcardShareLink } from '../utils/shareLink';
import { playSound } from '../utils/storage';

function CourseCard({
  course,
  isPurchased,
  onOpenFlashcards,
  onOpenQuiz,
  onOpenCheatSheet,
  onBuy,
  onShowToast,
  onOpenDirectChat
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const hasSnowCaps = !!getSelectedTheme()?.hasSnowCaps;

  if (!course) return null;

  // Safe Fallback Calculations
  const rating = course.rating || 4.9;
  const reviewsCount = course.reviewsCount || course.salesCount || 128;
  const studentsCount = (course.studentsCount || course.salesCount || 360).toLocaleString();
  const categoryLabel = course.categoryLabel || course.categoryName || 'Prompt MMO';
  const badge = course.badge || (course.salesCount ? `Đã bán ${course.salesCount}` : 'Hot Trend 🔥');

  const highlights = Array.isArray(course.highlights) && course.highlights.length > 0
    ? course.highlights
    : [
        'Prompt chuẩn quốc tế có tham số Camera & Tỉ lệ khung hình',
        '1-Click Copy siêu tốc đưa ngay vào Higgsfield, Midjourney, Claude',
        'Tặng kèm mẹo tiếng Việt & công thức tối ưu chuyển đổi'
      ];

  const formatList = Array.isArray(course.format) && course.format.length > 0
    ? course.format
    : ['Prompt Chuẩn', 'Tham Số Kỹ Thuật', '1-Click Copy'];

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
    <div className="apple-card rounded-2xl border border-black/[0.06] dark:border-white/[0.08] hover:border-[#007aff]/40 dark:hover:border-[#0a84ff]/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none relative text-slate-900 dark:text-zinc-100">
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
      
      {/* Top Banner with Apple Semantic Pills */}
      <div className="p-4 sm:p-5 pb-3 flex-1 flex flex-col">
        
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <span className="apple-pill-blue text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            {categoryLabel}
          </span>
          <div className="flex items-center space-x-1.5">
            <span className="apple-pill-amber text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {badge}
            </span>
            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                const res = await copyFlashcardShareLink({
                  deckId: course.id,
                  deckTitle: course.title,
                  useNativeShare: true
                });
                if (res.success) {
                  playSound('success');
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                  onShowToast?.(res.message);
                }
              }}
              className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-medium text-slate-500 dark:text-zinc-400 hover:text-[#007aff] dark:hover:text-[#0a84ff] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-[0.95] transition-all cursor-pointer"
              title="Sao chép đường dẫn chia sẻ gói prompt này"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Đã chép</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Link</span>
                </>
              )}
            </button>
            {onOpenDirectChat && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playSound('click');
                  onOpenDirectChat(null, course);
                }}
                className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-medium text-slate-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10 active:scale-[0.95] transition-all cursor-pointer"
                title="Gửi đính kèm gói prompt này vào tin nhắn trò chuyện"
              >
                <MessageCircle className="w-3 h-3" />
                <span className="hidden sm:inline">Gửi chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#0a84ff] transition-colors line-clamp-2 leading-snug tracking-tight">
          {course.title}
        </h3>

        {/* Subtitle */}
        {course.subtitle && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {course.subtitle}
          </p>
        )}

        {/* Social Proof Stats */}
        <div className="mt-3 flex items-center space-x-2 text-xs text-slate-500 dark:text-zinc-400 font-medium">
          <div className="flex items-center space-x-1 text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{rating}</span>
            <span className="text-slate-400 dark:text-zinc-500 font-normal">({reviewsCount})</span>
          </div>
          <span className="text-slate-300 dark:text-zinc-700">•</span>
          <span>
            {studentsCount} Creator dùng
          </span>
        </div>

        {/* Highlights List */}
        <ul className="mt-3.5 space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 border-t border-black/[0.06] dark:border-white/[0.08] pt-2.5">
          {highlights.slice(0, 2).map((item, idx) => (
            <li key={idx} className="flex items-start space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>

        {/* Format Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
          {formatList.map((fmt, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 bg-black/[0.03] dark:bg-white/[0.06] text-slate-600 dark:text-zinc-300 border border-black/[0.04] dark:border-white/[0.06] rounded-md"
            >
              <FileText className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
              <span>{fmt}</span>
            </span>
          ))}
        </div>

      </div>

      {/* Pricing & Footer Actions */}
      <div className="p-4 sm:p-5 pt-3 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.08] mt-auto space-y-3">
        
        {/* Price Row */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1.5">
            <Coins className="w-4 h-4 text-amber-500 fill-amber-400 self-center shrink-0" />
            <span className="text-lg font-bold font-mono text-slate-900 dark:text-white tracking-tight">
              {priceXu} Xu
            </span>
            {originalPriceXu > priceXu && (
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono line-through">
                {originalPriceXu} Xu
              </span>
            )}
          </div>

          {isPurchased ? (
            <span className="apple-pill-emerald text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Đã Mở Khóa</span>
            </span>
          ) : (
            discountPercent > 0 && (
              <span className="apple-pill-rose text-[10px] font-bold px-2 py-0.5 rounded-full">
                -{discountPercent}%
              </span>
            )
          )}
        </div>

        {/* Interactive Preview Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOpenFlashcards(course)}
            className="apple-btn-secondary py-2 px-2.5 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer"
            title="Mở GitHub-style Repository xem code prompt và thông số kỹ thuật"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Repo Prompt</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenDirectChat?.(null, course)}
            className="apple-btn-secondary py-2 px-2.5 text-[11px] font-semibold text-[#007aff] dark:text-[#0a84ff] rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer"
            title="Nhắn tin với người bán hoặc hỗ trợ kỹ thuật"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#007aff] dark:text-[#0a84ff]" />
            <span>Tư Vấn 1-1</span>
          </button>
        </div>

        {/* Buy or Download Button */}
        {isPurchased ? (
          <button
            type="button"
            onClick={() => onOpenFlashcards(course)}
            className="apple-pill-emerald w-full py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Mở Repo & Copy Prompt</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onBuy(course)}
            className="apple-btn-prominent w-full py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Coins className="w-3.5 h-3.5 text-white fill-white" />
            <span>Mở Khóa Prompt ({priceXu} Xu)</span>
          </button>
        )}

      </div>

    </div>
  );
}

export default memo(CourseCard);
