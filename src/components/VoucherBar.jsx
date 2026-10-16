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
    <div className="bg-[#fbfbfa] dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/15 rounded-xl p-3 sm:p-4 text-[#37352f] dark:text-white shadow-2xs">
      {/* Top row: Title + Timer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#e9e9e8] dark:border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 border border-[#e9e9e8] dark:border-white/15 shadow-2xs text-[#37352f] dark:text-white flex items-center justify-center shrink-0">
            <Ticket className="w-3.5 h-3.5 text-[#cc782f] dark:text-amber-400" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white">
              Ưu Đãi Trợ Giá Ôn Thi (Tự động áp dụng khi thanh toán)
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#faece3] dark:bg-amber-950/70 text-[#cc782f] dark:text-amber-300 border border-[#f3d6c1] dark:border-amber-600/40">
              ⚡ Giờ Vàng
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] text-[#787774] dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-[#e9e9e8] dark:border-white/15">
          <Clock className="w-3 h-3 text-[#cc782f] dark:text-amber-400" />
          <span>Hết hạn sau: <strong className="font-mono text-[#37352f] dark:text-white font-bold">{formatTimer(timeLeft)}</strong></span>
        </div>
      </div>

      {/* 3 Voucher Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {AVAILABLE_VOUCHERS.map((v) => {
          const isClaimed = claimedList.includes(v.id);
          return (
            <div
              key={v.id}
              className={`rounded-lg p-2.5 border transition-all flex items-center justify-between gap-2 ${
                isClaimed
                  ? 'bg-white dark:bg-slate-800/80 border-[#e9e9e8] dark:border-white/15'
                  : 'bg-white dark:bg-slate-800/95 border-[#e9e9e8] dark:border-white/15 hover:border-[#c5c4c0] dark:hover:border-white/30 hover:shadow-2xs'
              }`}
            >
              {/* Ticket Left Badge & Info */}
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-7 h-7 rounded-md bg-[#f1f1ef] dark:bg-slate-700 text-[#787774] dark:text-amber-300 border border-[#e3e2e0] dark:border-white/10 flex items-center justify-center shrink-0">
                  <Tag className="w-3.5 h-3.5" />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#37352f] dark:text-white truncate">
                    {v.discountText}
                  </div>
                  <div className="text-[10px] text-[#787774] dark:text-slate-300 truncate">
                    {v.shortDesc || v.desc}
                  </div>
                </div>
              </div>

              {/* Ticket Claim Action */}
              <button
                type="button"
                onClick={() => handleClaim(v.id)}
                disabled={isClaimed}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all shrink-0 flex items-center space-x-1 ${
                  isClaimed
                    ? 'bg-[#edf3ec] dark:bg-emerald-950/70 text-[#448361] dark:text-emerald-300 border border-[#d3e5d7] dark:border-emerald-600/40 cursor-default'
                    : 'bg-[#2383e2] hover:bg-[#1a73e8] text-white shadow-2xs cursor-pointer'
                }`}
              >
                {isClaimed ? (
                  <>
                    <Check className="w-3 h-3" />
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
