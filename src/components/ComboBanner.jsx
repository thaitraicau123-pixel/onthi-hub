import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Zap, Coins } from 'lucide-react';
import { COMBO_PACKAGE } from '../data/coursesData';

export default function ComboBanner({ isPurchased, onBuyCombo }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="relative rounded-3xl bg-gradient-to-br from-[#4d1033] via-[#28071a] to-[#1a0411] text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-[#f02c85]/30">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f02c85]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ff5f38]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Info & Features */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f02c85]/20 border border-[#f02c85]/30 text-rose-200 text-xs font-black mb-4">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>GÓI TIẾT KIỆM ĐƯỢC 78% HỌC VIÊN LỰA CHỌN</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Sở Hữu Trọn Đời Tất Cả Tài Liệu & Flashcard
            </h2>

            <p className="mt-3 text-sm sm:text-base text-rose-100/80 max-w-xl leading-relaxed font-medium">
              Không cần mua lẻ từng bộ. Mở khóa toàn bộ kho tài liệu Công chức, IT và Ngoại ngữ với 1 lần thanh toán duy nhất bằng Xu trong ví. Nhận toàn bộ bản cập nhật đề thi mới suốt năm 2026.
            </p>

            {/* Checkmark List */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-rose-100">
              {COMBO_PACKAGE.features.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#f02c85] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing Box */}
          <div className="lg:col-span-5">
            <div className="bg-[#1f0413]/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#f02c85]/30 text-center flex flex-col items-center">
              
              <span className="text-xs uppercase font-black text-amber-300 tracking-wider bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
                ƯU ĐÃI ĐỘC QUYỀN HÔM NAY
              </span>

              <div className="mt-4 flex items-baseline justify-center space-x-2">
                <Coins className="w-8 h-8 text-amber-400 fill-amber-400 self-center shrink-0" />
                <span className="text-3xl sm:text-5xl font-black text-white">
                  {COMBO_PACKAGE.priceXu} Xu
                </span>
                <span className="text-sm sm:text-base text-rose-300/60 line-through font-bold">
                  {COMBO_PACKAGE.originalPriceXu} Xu
                </span>
              </div>

              <p className="text-xs text-emerald-400 font-bold mt-1">
                Tiết kiệm ngay {COMBO_PACKAGE.originalPriceXu - COMBO_PACKAGE.priceXu} Xu (Giảm {COMBO_PACKAGE.discountPercent}%)
              </p>

              {isPurchased ? (
                <div className="mt-6 w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-500 text-white flex items-center justify-center space-x-2 shadow-lg">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Bạn Đã Sở Hữu Gói VIP Này</span>
                </div>
              ) : (
                <button
                  onClick={() => onBuyCombo(COMBO_PACKAGE)}
                  className="mt-6 w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base text-white btn-wayground-sunset shadow-xl shadow-pink-900/40 hover:opacity-95 transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
                >
                  <Coins className="w-5 h-5 fill-white text-white" />
                  <span>MỞ KHÓA COMBO VIP ({COMBO_PACKAGE.priceXu} XU)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              <div className="mt-4 flex items-center justify-center space-x-1.5 text-[11px] text-rose-300/60">
                <ShieldCheck className="w-3.5 h-3.5 text-[#f02c85]" />
                <span>Mở khóa tự động trong 3 giây • Bảo hành cập nhật trọn đời</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
