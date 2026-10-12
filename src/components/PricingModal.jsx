import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../data/plans';
import { getUserTier, setUserTier } from '../utils/userTier';
import { getWalletBalance, deductWalletCoins } from '../utils/wallet';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/storage';

export default function PricingModal({ onClose, onTierUpgraded, onPayVietQR }) {
  const currentTier = getUserTier();
  const walletBalance = getWalletBalance();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleUpgradeWithXu = (plan) => {
    if (walletBalance < plan.priceXu) {
      alert(`Số dư ví Xu của bạn (${walletBalance} Xu) không đủ để nâng cấp gói này (${plan.priceXu} Xu). Hãy nạp thêm Xu hoặc chọn thanh toán qua VietQR!`);
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
      onClose();
    }
  };

  const handleUpgradeWithVietQR = (plan) => {
    onClose();
    onPayVietQR({
      id: `plan_${plan.id}`,
      title: `Nâng Cấp Hội Viên: ${plan.name}`,
      categoryLabel: 'Gói Hội Viên',
      price: plan.priceVnd,
      originalPrice: Math.round(plan.priceVnd * 1.5)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-6 text-center bg-gradient-to-b from-indigo-50/80 to-white border-b border-slate-100">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>NÂNG CẤP TÀI KHOẢN HỌC TẬP</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            Mở Khóa Giới Hạn Luyện Thi & Đặc Quyền Creator
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Học tập không giới hạn cùng trợ lý Flashcard Anki, hưởng phí sàn ưu đãi khi đăng bán tài liệu trên chợ C2C.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = currentTier === plan.id;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative border ${
                  plan.isPopular
                    ? 'border-indigo-500 shadow-xl ring-2 ring-indigo-500/20 bg-gradient-to-b from-indigo-50/30 to-white'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h4 className="text-base font-bold text-slate-900">{plan.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{plan.tagline}</p>

                  <div className="mt-4 mb-4">
                    {plan.priceVnd === 0 ? (
                      <span className="text-2xl font-black text-slate-900">Miễn Phí</span>
                    ) : (
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                          {plan.priceVnd.toLocaleString()}đ
                        </span>
                        <span className="text-xs text-slate-400">/{plan.period}</span>
                      </div>
                    )}
                    {plan.priceXu > 0 && (
                      <div className="text-[11px] text-amber-600 font-bold mt-0.5">
                        hoặc <strong>{plan.priceXu} Xu</strong>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100">
                  {isCurrent ? (
                    <div className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold text-center">
                      Đang Sử Dụng
                    </div>
                  ) : plan.priceVnd === 0 ? (
                    <button
                      onClick={() => {
                        setUserTier('free');
                        onTierUpgraded('free');
                        onClose();
                      }}
                      className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold"
                    >
                      Chọn Gói Free
                    </button>
                  ) : (
                    <div className="space-y-1.5">
                      <button
                        onClick={() => handleUpgradeWithVietQR(plan)}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        Thanh toán VietQR ({plan.priceVnd / 1000}K)
                      </button>

                      <button
                        onClick={() => handleUpgradeWithXu(plan)}
                        className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors"
                      >
                        Dùng {plan.priceXu} Xu (Có {walletBalance})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-center space-x-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Kích hoạt tự động sau 3 giây • Đổi gói hoặc hủy bất kỳ lúc nào</span>
        </div>

      </div>
    </div>
  );
}
