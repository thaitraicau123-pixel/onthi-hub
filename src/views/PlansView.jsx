import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Coins,
  AlertCircle,
  X,
  ArrowRight,
  Wallet
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../data/plans';
import { getUserTier, setUserTier } from '../utils/userTier';
import { getWalletBalance, deductWalletCoins } from '../utils/wallet';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/storage';

export default function PlansView({ onTierUpgraded, onPayVietQR, onOpenWallet }) {
  const currentTier = getUserTier();
  const walletBalance = getWalletBalance();
  const [confirmPlan, setConfirmPlan] = useState(null);
  const [insufficientError, setInsufficientError] = useState(null);

  const handleUpgradeWithXu = (plan) => {
    if (walletBalance < plan.priceXu) {
      playSound('flip');
      setInsufficientError({
        plan,
        needed: plan.priceXu,
        current: walletBalance,
        deficit: plan.priceXu - walletBalance
      });
      return;
    }

    playSound('flip');
    setConfirmPlan(plan);
  };

  const handleConfirmUpgrade = () => {
    if (!confirmPlan) return;
    deductWalletCoins(confirmPlan.priceXu);
    setUserTier(confirmPlan.id);
    playSound('success');
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    });
    onTierUpgraded(confirmPlan.id);
    setConfirmPlan(null);
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
          <span>NÂNG CẤP TRẠNG THÁI STATUS (HỘI VIÊN 2026)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Chọn Gói Luyện Thi Phù Hợp Với Bạn
        </h2>
        <p className="mt-2 text-xs sm:text-base text-rose-200/80 font-medium">
          Mở rộng hạn mức tạo Flashcard AI, mở khóa kho đề thi chính quy và đặc quyền Creator bán thẻ trên Sàn C2C. Thanh toán 100% bằng Tiền Xu.
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
                  {plan.priceXu === 0 ? (
                    <div>
                      <span className="text-3xl font-black text-[#28071a]">Miễn Phí</span>
                      <span className="text-[11px] text-[#7a5a6b] block font-bold mt-1">
                        Mặc định cho mọi tài khoản
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-3xl sm:text-4xl font-black text-[#28071a]">
                          {plan.priceXu} Xu
                        </span>
                        <span className="text-xs text-[#7a5a6b] font-bold">/{plan.period}</span>
                      </div>
                      <span className="text-[11px] text-amber-700 font-bold mt-1 flex items-center space-x-1">
                        <Coins className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                        <span>Thanh toán 100% bằng Ví Xu</span>
                      </span>
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
                    ✓ Trạng Thái Đang Kích Hoạt
                  </div>
                ) : plan.priceXu === 0 ? (
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
                      onClick={() => handleUpgradeWithXu(plan)}
                      className="w-full py-3 rounded-2xl btn-wayground-sunset text-white text-xs font-black shadow-lg shadow-pink-900/30 transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-1.5"
                    >
                      <Coins className="w-4 h-4 fill-amber-300 text-amber-300" />
                      <span>Kích Hoạt Gói ({plan.priceXu} Xu)</span>
                    </button>

                    {walletBalance < plan.priceXu ? (
                      <button
                        onClick={onOpenWallet}
                        className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold transition-colors flex items-center justify-center space-x-1"
                      >
                        <Wallet className="w-3.5 h-3.5 text-amber-700" />
                        <span>Ví có {walletBalance} Xu • Nạp thêm {plan.priceXu - walletBalance} Xu</span>
                      </button>
                    ) : (
                      <div className="text-[10px] text-center text-[#7a5a6b] font-bold">
                        Số dư ví: <strong className="text-emerald-700">{walletBalance} Xu</strong> (Đủ điều kiện)
                      </div>
                    )}
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

      {/* CONFIRM UPGRADE WITH XU MODAL */}
      {confirmPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#fcf7ec] rounded-3xl border-2 border-[#eadfcb] shadow-2xl p-6 text-[#28071a] animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eadfcb]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#f02c85] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 fill-[#f02c85]" />
                </div>
                <h3 className="text-base font-black text-[#28071a]">Xác Nhận Nâng Cấp Hội Viên</h3>
              </div>
              <button
                onClick={() => setConfirmPlan(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#eadfcb] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#7a5a6b] font-medium">Gói hội viên:</span>
                <span className="font-black text-[#28071a]">{confirmPlan.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#7a5a6b] font-medium">Chi phí kích hoạt:</span>
                <span className="font-black text-amber-600">{confirmPlan.priceXu} Xu</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-[#7a5a6b] font-medium">Số dư ví hiện tại:</span>
                <span className="font-black text-[#28071a]">{walletBalance} Xu</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#7a5a6b] font-medium">Số dư sau khi trừ:</span>
                <span className="font-black text-emerald-600">{walletBalance - confirmPlan.priceXu} Xu</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setConfirmPlan(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#eadfcb] bg-white hover:bg-slate-50 text-[#28071a] font-bold text-xs"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmUpgrade}
                className="flex-1 py-2.5 rounded-xl btn-wayground-sunset text-white font-black text-xs shadow-md shadow-pink-900/30 flex items-center justify-center space-x-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận Kích Hoạt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSUFFICIENT COINS MODAL */}
      {insufficientError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#fcf7ec] rounded-3xl border-2 border-[#eadfcb] shadow-2xl p-6 text-[#28071a] animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eadfcb]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Coins className="w-4 h-4 fill-amber-700" />
                </div>
                <h3 className="text-base font-black text-[#28071a]">Số Dư Xu Chưa Đủ</h3>
              </div>
              <button
                onClick={() => setInsufficientError(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#eadfcb] space-y-2 text-xs">
              <p className="text-[#4e2f41]">
                Để nâng cấp <strong>{insufficientError.plan.name}</strong>, bạn cần <strong>{insufficientError.needed} Xu</strong>.
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between font-bold">
                <span className="text-amber-800">Hiện có trong ví: {insufficientError.current} Xu</span>
                <span className="text-rose-600">Thiếu: {insufficientError.deficit} Xu</span>
              </div>
              <p className="text-[#7a5a6b] text-[11px]">
                Hệ thống chỉ chấp nhận thanh toán bằng Tiền Xu. Bạn hãy nạp thêm <strong>{insufficientError.deficit} Xu</strong> qua mã VietQR để kích hoạt gói ngay nhé!
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setInsufficientError(null)}
                className="py-2.5 px-4 rounded-xl border border-[#eadfcb] bg-white hover:bg-slate-50 text-[#28071a] font-bold text-xs"
              >
                Để Sau
              </button>
              <button
                onClick={() => {
                  setInsufficientError(null);
                  onOpenWallet?.();
                }}
                className="flex-1 py-2.5 rounded-xl btn-wayground-sunset text-white font-black text-xs shadow-md flex items-center justify-center space-x-1.5"
              >
                <Wallet className="w-4 h-4 text-amber-200" />
                <span>Mở Ví Nạp {insufficientError.deficit} Xu Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
