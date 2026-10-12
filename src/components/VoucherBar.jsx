import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Clock, Check, Zap } from 'lucide-react';
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
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.2 } });
      setClaimedList(getClaimedVouchers());
    }
  };

  return (
    <div className="bg-[#fcf7ec] border border-[#eadfcb] rounded-3xl p-4 sm:p-5 shadow-lg mb-6 text-[#28071a]">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Flash Sale Countdown */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff5f38] to-[#f02c85] text-white flex items-center justify-center font-bold shadow-md shadow-pink-900/30">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-black text-[#f02c85] uppercase tracking-wide">
                Flash Sale Giờ Vàng
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#f02c85] text-white animate-pulse">
                -70%
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-[#7a5a6b] mt-0.5 font-bold">
              <Clock className="w-3.5 h-3.5 text-[#ff5f38]" />
              <span>Kết thúc trong: <strong className="font-mono text-[#28071a] font-black">{formatTimer(timeLeft)}</strong></span>
            </div>
          </div>
        </div>

        {/* Voucher Cards Carousel / Grid */}
        <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-1 scrollbar-none">
          {AVAILABLE_VOUCHERS.map((v) => {
            const isClaimed = claimedList.includes(v.id);
            return (
              <div
                key={v.id}
                className="bg-white rounded-2xl p-3 border border-[#eadfcb] shadow-xs flex items-center space-x-3 shrink-0 min-w-[210px]"
              >
                <div className="w-8 h-8 rounded-xl bg-[#fcf5e5] text-[#f02c85] flex items-center justify-center font-bold">
                  <Tag className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black text-[#28071a] truncate">{v.discountText}</div>
                  <div className="text-[10px] text-[#7a5a6b] truncate">{v.desc}</div>
                </div>
                <button
                  onClick={() => handleClaim(v.id)}
                  disabled={isClaimed}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all shrink-0 ${
                    isClaimed
                      ? 'bg-[#f02c85]/15 text-[#f02c85] cursor-default'
                      : 'bg-[#f02c85] hover:bg-[#dc1f74] text-white shadow-xs'
                  }`}
                >
                  {isClaimed ? (
                    <span className="flex items-center space-x-0.5">
                      <Check className="w-3 h-3" />
                      <span>Đã Lưu</span>
                    </span>
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
