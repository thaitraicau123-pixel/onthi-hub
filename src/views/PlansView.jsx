import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../data/plans';
import { getUserTier, setUserTier } from '../utils/userTier';
import { getWalletBalance, deductWalletCoins } from '../utils/wallet';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/storage';

export default function PlansView({ onTierUpgraded, onPayVietQR }) {
  const currentTier = getUserTier();
  const walletBalance = getWalletBalance();

  const handleUpgradeWithXu = (plan) => {
    if (walletBalance < plan.priceXu) {
      alert(`Số dư ví Xu (${walletBalance} Xu) không đủ để nâng cấp gói ${plan.name} (${plan.priceXu} Xu). Vui lòng nạp thêm Xu hoặc chọn thanh toán qua VietQR!`);
      return;
    }

    if (confirm(`Xác nhận dùng ${plan.priceXu} Xu để kích hoạt ${plan.name}?`)) {
      deductWalletCoins(plan.priceXu);
      setUserTier(plan.id);
      playSound('success');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
      onTierUpgraded(plan.id);
    }
  };

  const handleUpgradeWithVietQR = (plan) => {
    onPayVietQR({
      id: `plan_${plan.id}`,
      title: `Nâng Cấp Hội Viên: ${plan.name}`,
      categoryLabel: 'Gói Hội Viên',
      priceXu: plan.priceXu,
      price: plan.priceVnd,
      originalPrice: Math.round(plan.priceVnd * 1.5)
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-100/70 text-[#f02c85] text-xs font-black mb-3 border border-pink-200">
          <Sparkles className="w-3.5 h-3.5 fill-[#f02c85]" />
          <span>GÓI NÂNG CẤP HỘI VIÊN 2026</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Chọn Gói Luyện Thi Phù Hợp Với Bạn
        </h2>
        <p className="mt-2 text-xs sm:text-base text-rose-200/80 font-medium">
          Mở rộng hạn mức tạo Flashcard AI, mở khóa kho đề thi chính quy và đặc quyền Creator bán thẻ trên Sàn C2C.
        </p>
      </div>

      {/* PLANS GRID (Wayground Ivory Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = currentTier === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative border ${
                plan.isPopular
                  ? 'border-[#f02c85] shadow-2xl ring-2 ring-[#f02c85]/30 bg-[#fcf7ec] text-[#28071a]'
                  : 'border-[#eadfcb] bg-[#fcf7ec] hover:border-[#f02c85] shadow-md text-[#28071a]'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#f02c85] text-white text-[10px] font-black uppercase tracking-wide shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-lg font-black text-[#28071a]">{plan.name}</h3>
                <p className="text-xs text-[#7a5a6b] mt-1 line-clamp-1 font-medium">{plan.tagline}</p>

                <div className="mt-5 mb-5">
                  {plan.priceVnd === 0 ? (
                    <span className="text-3xl font-black text-[#28071a]">Miễn Phí</span>
                  ) : (
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-[#28071a]">
                        {plan.priceVnd.toLocaleString()}đ
                      </span>
                      <span className="text-xs text-[#7a5a6b] font-bold">/{plan.period}</span>
                    </div>
                  )}
                  {plan.priceXu > 0 && (
                    <div className="text-xs text-amber-600 font-black mt-1">
                      hoặc <strong>{plan.priceXu} Xu</strong> trong ví
                    </div>
                  )}
                </div>

                <ul className="space-y-2.5 text-xs text-[#4e2f41] border-t border-[#eadfcb] pt-4 font-medium">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[#eadfcb]">
                {isCurrent ? (
                  <div className="w-full py-3 rounded-2xl bg-[#f5ecd8] text-[#28071a] text-xs font-black text-center border border-[#eadfcb]">
                    Đang Kích Hoạt
                  </div>
                ) : plan.priceVnd === 0 ? (
                  <button
                    onClick={() => {
                      setUserTier('free');
                      onTierUpgraded('free');
                    }}
                    className="w-full py-3 rounded-2xl border border-[#eadfcb] hover:bg-[#faebd0] text-[#28071a] text-xs font-black transition-colors"
                  >
                    Dùng Gói Free
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUpgradeWithVietQR(plan)}
                      className="w-full py-3 rounded-2xl btn-wayground-sunset text-white text-xs font-black shadow-lg shadow-pink-900/30 transition-transform transform hover:scale-105 active:scale-95"
                    >
                      Thanh toán VietQR ({plan.priceVnd / 1000}K)
                    </button>

                    <button
                      onClick={() => handleUpgradeWithXu(plan)}
                      className="w-full py-2.5 rounded-2xl bg-white hover:bg-[#faebd0] text-[#28071a] border border-[#eadfcb] text-xs font-black transition-colors"
                    >
                      Dùng {plan.priceXu} Xu (Ví có {walletBalance})
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* GUARANTEE NOTE */}
      <div className="p-4 bg-[#fcf7ec] rounded-2xl border border-[#eadfcb] flex items-center justify-center space-x-2 text-xs text-[#28071a] font-bold text-center max-w-xl mx-auto shadow-md">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Kích hoạt tự động sau 3 giây • Bảo hành cập nhật trọn vẹn</span>
      </div>

    </div>
  );
}
