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
    <div className="bg-[#fcf7ec] border border-[#eadfcb] rounded-3xl p-3.5 sm:p-4 shadow-sm mb-4 text-[#28071a] relative overflow-hidden">
      {/* Decorative subtle background aura */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br from-amber-200/20 to-pink-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4 relative z-10">
        
        {/* Left: Refined Educational Voucher Header */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff5f38] to-[#f02c85] text-white flex items-center justify-center font-bold shadow-sm shadow-[#f02c85]/20 shrink-0">
            <Ticket className="w-5 h-5 fill-white/20 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-black text-[#28071a] tracking-tight">
                Ưu Đãi Trợ Giá Ôn Thi
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff5f38] to-[#f02c85] text-white shadow-2xs">
                ⚡ Giờ Vàng
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-[#7a5a6b] mt-0.5 font-bold">
              <Clock className="w-3 h-3 text-[#ff5f38]" />
              <span>Đổi mới sau: <strong className="font-mono text-[#f02c85] font-black">{formatTimer(timeLeft)}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Voucher Tickets (Silky scroll, no ugly scrollbar) */}
        <div className="flex items-center gap-2.5 overflow-x-auto w-full lg:w-auto pb-0.5 scrollbar-none no-scrollbar">
          {AVAILABLE_VOUCHERS.map((v) => {
            const isClaimed = claimedList.includes(v.id);
            return (
              <div
                key={v.id}
                className={`rounded-2xl p-2.5 sm:p-3 border transition-all flex items-center space-x-2.5 shrink-0 min-w-[215px] sm:min-w-[225px] relative group ${
                  isClaimed
                    ? 'bg-white/85 border-[#eadfcb] opacity-90'
                    : 'bg-white border-[#eadfcb] hover:border-[#f02c85]/40 hover:shadow-xs'
                }`}
              >
                {/* Ticket Left Badge */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#fcf5e5] to-[#fdecf4] text-[#f02c85] border border-[#eadfcb]/60 flex items-center justify-center font-black shrink-0">
                  <Tag className="w-3.5 h-3.5" />
                </div>

                {/* Ticket Info */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="text-xs font-black text-[#28071a] truncate flex items-center gap-1">
                    <span>{v.discountText}</span>
                  </div>
                  <div className="text-[10px] text-[#7a5a6b] truncate font-medium">{v.desc}</div>
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
    </div>
  );
}
