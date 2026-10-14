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
    <div className="space-y-6 animate-fade-in pb-16 text-[#37352f]">
      
      {/* NOTION PAGE HEADER */}
      <div className="space-y-3 pb-2 border-b border-[#e9e9e8]">
        <div className="text-4xl select-none">⚡</div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37352f] tracking-tight">
            Gói Hội Viên & Quyền Lợi Đặc Quyền
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#787774] leading-relaxed">
            Mở rộng hạn mức tạo Flashcard AI, mở khóa toàn bộ kho đề thi chính quy và đặc quyền Creator bán thẻ trên Sàn C2C.
          </p>
        </div>
      </div>

      {/* PLANS GRID (Notion Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = currentTier === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-xl p-5 flex flex-col justify-between transition-all duration-200 relative border ${
                plan.isPopular
                  ? 'border-[#2383e2] ring-1 ring-[#2383e2] bg-white shadow-xs'
                  : 'border-[#e9e9e8] bg-white hover:border-[#c5c4c0] shadow-2xs'
              } text-[#37352f]`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#2383e2] text-white text-[10px] font-bold uppercase tracking-wide shadow-2xs">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-[#37352f]">{plan.name}</h3>
                <p className="text-xs text-[#787774] mt-0.5 line-clamp-1">{plan.tagline}</p>

                <div className="mt-4 mb-4">
                  {plan.priceXu === 0 ? (
                    <div>
                      <span className="text-2xl font-bold text-[#37352f]">Miễn Phí</span>
                      <span className="text-[11px] text-[#787774] block mt-0.5">
                        Mặc định cho mọi tài khoản
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-2xl sm:text-3xl font-bold text-[#37352f]">
                          {plan.priceXu} Xu
                        </span>
                        <span className="text-xs text-[#787774]">/{plan.period}</span>
                      </div>
                      <span className="text-[11px] text-[#976d57] font-semibold mt-1 flex items-center space-x-1">
                        <Coins className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                        <span>Thanh toán bằng Ví Xu</span>
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-2 text-xs text-[#5a5751] border-t border-[#e9e9e8] pt-3">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[#e9e9e8]">
                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-lg bg-[#f7f6f5] text-[#787774] text-xs font-semibold text-center border border-[#e9e9e8]">
                    ✓ Trạng Thái Đang Kích Hoạt
                  </div>
                ) : plan.priceXu === 0 ? (
                  <button
                    onClick={() => {
                      setUserTier('free');
                      onTierUpgraded('free');
                    }}
                    className="w-full py-2.5 rounded-lg border border-[#e9e9e8] bg-[#f7f6f5] hover:bg-[#f0efed] text-[#37352f] text-xs font-medium transition-colors cursor-pointer"
                  >
                    Dùng Gói Free
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUpgradeWithXu(plan)}
                      className="w-full py-2.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-medium shadow-2xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Coins className="w-4 h-4 text-white" />
                      <span>Kích Hoạt Gói ({plan.priceXu} Xu)</span>
                    </button>

                    {walletBalance < plan.priceXu ? (
                      <button
                        onClick={onOpenWallet}
                        className="w-full py-1.5 rounded-lg bg-[#fbf3db] hover:bg-[#f6ebd0] text-[#976d57] border border-[#f4e4b7] text-[11px] font-medium transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Wallet className="w-3.5 h-3.5 text-[#cc782f]" />
                        <span>Ví có {walletBalance} Xu • Nạp thêm {plan.priceXu - walletBalance} Xu</span>
                      </button>
                    ) : (
                      <div className="text-[10px] text-center text-[#787774]">
                        Số dư ví: <strong className="text-emerald-700 font-semibold">{walletBalance} Xu</strong> (Đủ điều kiện)
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
      <div className="notion-callout p-3.5 rounded-xl border border-[#e9e9e8] flex items-center justify-center space-x-2 text-xs text-[#37352f] text-center max-w-xl mx-auto shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Kích hoạt tự động ngay sau 3 giây • Bảo hành cập nhật trọn vẹn</span>
      </div>

      {/* CONFIRM UPGRADE WITH XU MODAL */}
      {confirmPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#e9e9e8] shadow-2xl p-6 text-[#37352f] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e9e9e8]">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#e7f3f8] text-[#2b7aa1] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#37352f]">Xác Nhận Nâng Cấp Hội Viên</h3>
              </div>
              <button
                onClick={() => setConfirmPlan(null)}
                className="p-1 text-[#9b9a97] hover:text-[#37352f] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-[#fbfbfa] rounded-xl border border-[#e9e9e8] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#787774]">Gói hội viên:</span>
                <span className="font-semibold text-[#37352f]">{confirmPlan.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#787774]">Chi phí kích hoạt:</span>
                <span className="font-semibold text-[#2383e2]">{confirmPlan.priceXu} Xu</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-[#e9e9e8]">
                <span className="text-[#787774]">Số dư ví hiện tại:</span>
                <span className="font-semibold text-[#37352f]">{walletBalance} Xu</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#787774]">Số dư sau khi trừ:</span>
                <span className="font-semibold text-emerald-700">{walletBalance - confirmPlan.priceXu} Xu</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={() => setConfirmPlan(null)}
                className="flex-1 py-2 rounded-lg border border-[#e9e9e8] bg-[#f7f6f5] hover:bg-[#f0efed] text-[#37352f] font-medium text-xs cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmUpgrade}
                className="flex-1 py-2 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white font-medium text-xs shadow-2xs flex items-center justify-center space-x-1 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#e9e9e8] shadow-2xl p-6 text-[#37352f] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e9e9e8]">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#fbf3db] text-[#cc782f] flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#37352f]">Số Dư Xu Chưa Đủ</h3>
              </div>
              <button
                onClick={() => setInsufficientError(null)}
                className="p-1 text-[#9b9a97] hover:text-[#37352f] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-[#fbfbfa] rounded-xl border border-[#e9e9e8] space-y-2 text-xs">
              <p className="text-[#37352f]">
                Để nâng cấp <strong>{insufficientError.plan.name}</strong>, bạn cần <strong>{insufficientError.needed} Xu</strong>.
              </p>
              <div className="p-2.5 bg-[#fbf3db] rounded-lg border border-[#f4e4b7] flex items-center justify-between font-medium">
                <span className="text-[#976d57]">Hiện có trong ví: {insufficientError.current} Xu</span>
                <span className="text-rose-600 font-semibold">Thiếu: {insufficientError.deficit} Xu</span>
              </div>
              <p className="text-[#787774] text-[11px] leading-relaxed">
                Hệ thống chỉ chấp nhận thanh toán bằng Tiền Xu. Bạn hãy nạp thêm <strong>{insufficientError.deficit} Xu</strong> qua mã VietQR để kích hoạt gói ngay nhé!
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setInsufficientError(null)}
                className="py-2 px-3.5 rounded-lg border border-[#e9e9e8] bg-[#f7f6f5] hover:bg-[#f0efed] text-[#37352f] font-medium text-xs cursor-pointer"
              >
                Để Sau
              </button>
              <button
                onClick={() => {
                  setInsufficientError(null);
                  onOpenWallet?.();
                }}
                className="flex-1 py-2 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white font-medium text-xs shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Nạp {insufficientError.deficit} Xu Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
