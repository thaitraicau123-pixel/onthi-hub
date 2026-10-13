import React, { useState, useEffect } from 'react';
import { Tag, Clock, Check, Ticket } from 'lucide-react';
import { AVAILABLE_VOUCHERS, getClaimedVouchers, claimVoucher } from '../utils/gamification';
import { playSound } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function VoucherBar() {
  const [claimedList, setClaimedList] = useState(() => getClaimedVouchers());
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 7200);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleClaim = (vId) => {
    if (claimVoucher(vId)) {
      playSound('success');
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.3 } });
      setClaimedList(getClaimedVouchers());
    }
  };

  return (
    <div className="bg-[#fcf7ec] border border-[#eadfcb] rounded-3xl p-3 sm:p-4 shadow-sm text-[#28071a] relative overflow-hidden">
      {/* Decorative subtle background aura */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br from-amber-200/20 to-pink-200/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top row: Title + Timer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#eadfcb]/70 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#ff5f38] to-[#f02c85] text-white flex items-center justify-center font-bold shadow-2xs shrink-0">
            <Ticket className="w-4 h-4 fill-white/20 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm font-black text-[#28071a] tracking-tight">
              Ưu Đãi Trợ Giá Ôn Thi
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff5f38] to-[#f02c85] text-white shadow-2xs">
              ⚡ Giờ Vàng
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] text-[#7a5a6b] font-bold bg-white/70 px-2.5 py-1 rounded-xl border border-[#eadfcb]/80">
          <Clock className="w-3.5 h-3.5 text-[#ff5f38]" />
          <span>Hết hạn sau: <strong className="font-mono text-[#f02c85] font-black">{formatTimer(timeLeft)}</strong></span>
        </div>
      </div>

      {/* 3 Voucher Cards Grid - 100% width, zero horizontal scrolling, zero cut-off */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 relative z-10">
        {AVAILABLE_VOUCHERS.map((v) => {
          const isClaimed = claimedList.includes(v.id);
          return (
            <div
              key={v.id}
              className={`rounded-2xl p-2.5 border transition-all flex items-center justify-between gap-2 relative ${
                isClaimed
                  ? 'bg-white/80 border-[#eadfcb] opacity-90'
                  : 'bg-white border-[#eadfcb] hover:border-[#f02c85]/40 hover:shadow-xs'
              }`}
            >
              {/* Ticket Left Badge & Info */}
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#fcf5e5] to-[#fdecf4] text-[#f02c85] border border-[#eadfcb]/60 flex items-center justify-center font-black shrink-0">
                  <Tag className="w-3.5 h-3.5" />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-black text-[#28071a] truncate">
                    {v.discountText}
                  </div>
                  <div className="text-[10px] text-[#7a5a6b] truncate font-medium">
                    {v.shortDesc || v.desc}
                  </div>
                </div>
              </div>

              {/* Ticket Claim Action */}
              <button
                type="button"
                onClick={() => handleClaim(v.id)}
                disabled={isClaimed}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all shrink-0 flex items-center space-x-1 ${
                  isClaimed
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 cursor-default shadow-2xs'
                    : 'bg-[#f02c85] hover:bg-[#dc1f74] text-white shadow-xs hover:scale-105 active:scale-95'
                }`}
              >
                {isClaimed ? (
                  <>
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Đã Lưu</span>
                  </>
                ) : (
                  <span>Lưu Mã</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
