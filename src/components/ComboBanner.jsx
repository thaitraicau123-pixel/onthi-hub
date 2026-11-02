import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Coins, Check } from 'lucide-react';
import { COMBO_PACKAGE } from '../data/coursesData';

export default function ComboBanner({ isPurchased, onBuyCombo }) {
  return (
    <section className="w-full my-8 select-none">
      <div className="relative rounded-3xl bg-white/70 dark:bg-[#141419]/70 backdrop-blur-2xl border border-black/[0.06] dark:border-white/[0.08] text-slate-900 dark:text-zinc-100 p-6 sm:p-9 shadow-xl overflow-hidden">
        
        {/* Soft Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Info & Features */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-[11px] font-mono tracking-wider uppercase font-semibold text-slate-600 dark:text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>GÓI VIP ALL-ACCESS • 85% CREATOR LỰA CHỌN</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Sở Hữu Trọn Đời Toàn Bộ Kho Master Prompts (Bùi Thái AI Studio)
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-xl">
              Mở khóa trọn đời toàn bộ 6 Hộp Công Cụ Master Prompts (101 Thẻ Prompt Thực Chiến): Web Haute-Couture UI 60fps, Siêu Lập Trình Viên Fullstack AppSec, Content SEO E-E-A-T, Luận Văn Điểm A+, Clean Code Starter. Cập nhật prompt v8.5 mới trọn đời không phát sinh phí.
            </p>

            {/* Checkmark List */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-zinc-300 font-medium">
              {COMBO_PACKAGE.features.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing Box */}
          <div className="lg:col-span-5">
            <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-2xl p-6 sm:p-7 border border-black/[0.06] dark:border-white/[0.08] text-center flex flex-col items-center space-y-3.5 shadow-sm">
              
              <span className="text-[10px] font-mono uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                ƯU ĐÃI ĐỘC QUYỀN TRỌN ĐỜI
              </span>

              <div className="flex items-baseline justify-center space-x-2">
                <Coins className="w-6 h-6 text-amber-500 fill-amber-400 self-center shrink-0" />
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {COMBO_PACKAGE.priceXu} Xu
                </span>
                <span className="text-sm text-slate-400 dark:text-zinc-500 font-mono line-through tabular-nums font-medium">
                  {COMBO_PACKAGE.originalPriceXu} Xu
                </span>
              </div>

              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono tabular-nums">
                Tiết kiệm ngay {COMBO_PACKAGE.originalPriceXu - COMBO_PACKAGE.priceXu} Xu (Giảm {COMBO_PACKAGE.discountPercent}%)
              </p>

              {isPurchased ? (
                <div className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center justify-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Bạn Đã Sở Hữu Gói All-Access</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onBuyCombo(COMBO_PACKAGE)}
                  className="apple-btn-prominent w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 cursor-pointer shadow-lg active:scale-[0.98] transition-transform"
                >
                  <Coins className="w-4 h-4 text-white fill-white" />
                  <span>Kích Hoạt Combo All-Access ({COMBO_PACKAGE.priceXu} Xu)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
                Thanh toán qua Ví Xu • Mở khóa tự động trong 3 giây
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
