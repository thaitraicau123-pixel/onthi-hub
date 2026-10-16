import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Zap, Coins, Check } from 'lucide-react';
import { COMBO_PACKAGE } from '../data/coursesData';

export default function ComboBanner({ isPurchased, onBuyCombo }) {
  return (
    <section className="w-full my-6 select-none">
      <div className="relative rounded-2xl bg-[#fbfbfa] dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/15 text-[#37352f] dark:text-white p-5 sm:p-7 shadow-2xs">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Info & Features */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#f4f0f7] dark:bg-purple-950/70 border border-[#e3d7ec] dark:border-purple-500/40 text-[#9065b0] dark:text-purple-300 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#9065b0] dark:text-purple-300" />
              <span>GÓI TIẾT KIỆM ĐƯỢC 78% HỌC VIÊN LỰA CHỌN</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#37352f] dark:text-white leading-snug">
              Sở Hữu Trọn Đời Tất Cả Tài Liệu & Flashcard
            </h2>

            <p className="text-xs sm:text-sm text-[#787774] dark:text-slate-300 leading-relaxed">
              Mở khóa toàn bộ kho tài liệu Công chức 2026, IT và Ngoại ngữ với 1 lần thanh toán duy nhất bằng Xu trong ví. Nhận toàn bộ bản cập nhật đề thi mới suốt năm.
            </p>

            {/* Checkmark List */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5a5751] dark:text-slate-200">
              {COMBO_PACKAGE.features.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#448361] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing Box */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-800/95 rounded-xl p-5 sm:p-6 border border-[#e9e9e8] dark:border-white/15 shadow-2xs text-center flex flex-col items-center space-y-3">
              
              <span className="text-[10px] uppercase font-bold text-[#cc782f] dark:text-amber-300 tracking-wider bg-[#faece3] dark:bg-amber-950/70 px-2.5 py-0.5 rounded border border-[#f3d6c1] dark:border-amber-600/40">
                ƯU ĐÃI ĐỘC QUYỀN HÔM NAY
              </span>

              <div className="flex items-baseline justify-center space-x-2">
                <Coins className="w-6 h-6 text-amber-500 fill-amber-400 self-center shrink-0" />
                <span className="text-3xl font-extrabold text-[#37352f] dark:text-white">
                  {COMBO_PACKAGE.priceXu} Xu
                </span>
                <span className="text-xs text-[#9b9a97] dark:text-slate-400 line-through font-medium">
                  {COMBO_PACKAGE.originalPriceXu} Xu
                </span>
              </div>

              <p className="text-[11px] text-[#448361] dark:text-emerald-400 font-semibold">
                Tiết kiệm ngay {COMBO_PACKAGE.originalPriceXu - COMBO_PACKAGE.priceXu} Xu (Giảm {COMBO_PACKAGE.discountPercent}%)
              </p>

              {isPurchased ? (
                <div className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs bg-[#edf3ec] dark:bg-emerald-950/60 text-[#448361] dark:text-emerald-300 border border-[#d3e5d7] dark:border-emerald-600/40 flex items-center justify-center space-x-1.5">
                  <Check className="w-4 h-4" />
                  <span>Bạn Đã Sở Hữu Gói All-Access</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onBuyCombo(COMBO_PACKAGE)}
                  className="w-full py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm bg-gradient-to-r from-[#2383e2] to-indigo-600 hover:from-[#1a73e8] hover:to-indigo-500 text-white shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99]"
                >
                  <Coins className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Kích Hoạt Combo All-Access ({COMBO_PACKAGE.priceXu} Xu)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <p className="text-[10px] text-[#9b9a97] dark:text-slate-400">
                Thanh toán an toàn • Truy cập vĩnh viễn trên mọi thiết bị
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
