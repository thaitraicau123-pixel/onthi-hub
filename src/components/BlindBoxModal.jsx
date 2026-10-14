import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Gift,
  Coins,
  Flame,
  Award,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Copy,
  Zap,
  Trophy,
  ExternalLink
} from 'lucide-react';
import {
  BLIND_BOXES,
  openBlindBox,
  openMultipleBlindBoxes,
  getRecentBlindBoxWinners
} from '../utils/blindBox';
import { getWalletBalance } from '../utils/wallet';
import { getAudioContext } from '../utils/pomodoroAudio';
import confetti from 'canvas-confetti';

// High-fidelity synth audio for unboxing suspense & fanfare
function playSynthSound(type = 'shake') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;

    if (type === 'shake') {
      // Crisp rattle impulses
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'tear') {
      // Tape peeling swoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.18);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'reveal') {
      // Shimmering celestial bell chord
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.3, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.65);
      });
    } else if (type === 'jackpot') {
      // Epic triumphant royal trumpet fanfare
      const melody = [392, 523.25, 659.25, 783.99, 1046.50];
      melody.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.45, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.75);
      });
    }
  } catch (e) {}
}

export default function BlindBoxModal({
  onClose,
  onRewardClaimed,
  onOpenWallet
}) {
  const [selectedBoxId, setSelectedBoxId] = useState('silver');
  const [unboxingStage, setUnboxingStage] = useState('idle'); // 'idle' | 'shaking' | 'revealed'
  const [revealRewards, setRevealRewards] = useState([]);
  const [walletBalance, setWalletBalance] = useState(() => getWalletBalance());
  const [isMuted, setIsMuted] = useState(false);
  const [showDropRates, setShowDropRates] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const [recentWinners, setRecentWinners] = useState(() => getRecentBlindBoxWinners());

  const selectedBox = BLIND_BOXES.find(b => b.id === selectedBoxId) || BLIND_BOXES[0];

  // Rotate ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setRecentWinners(getRecentBlindBoxWinners());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleStartUnboxing = (count = 1) => {
    const neededXu = selectedBox.costXu * count;
    if (walletBalance < neededXu) {
      if (confirm(`Số dư không đủ! Cần ${neededXu} Xu để mở ${count === 1 ? selectedBox.name : `Combo x${count}`}. Bạn có muốn mở Ví để nạp thêm Xu ngay không?`)) {
        onClose();
        onOpenWallet();
      }
      return;
    }

    setUnboxingStage('shaking');
    setRevealRewards([]);

    // Sound suspense sequence
    if (!isMuted) {
      playSynthSound('tear');
      setTimeout(() => playSynthSound('shake'), 250);
      setTimeout(() => playSynthSound('shake'), 550);
      setTimeout(() => playSynthSound('shake'), 850);
    }

    setTimeout(() => {
      const res = count === 1
        ? openBlindBox(selectedBox.id)
        : openMultipleBlindBoxes(selectedBox.id, count);

      if (res.success) {
        setRevealRewards(res.rewards || [res.reward]);
        setWalletBalance(getWalletBalance());
        setUnboxingStage('revealed');
        onRewardClaimed?.();

        const hasJackpot = (res.rewards || [res.reward]).some(r => r.type === 'jackpot');

        if (!isMuted) {
          if (hasJackpot) {
            playSynthSound('jackpot');
          } else {
            playSynthSound('reveal');
          }
        }

        confetti({
          particleCount: hasJackpot ? 180 : 90,
          spread: 85,
          origin: { y: 0.55 },
          colors: ['#2383e2', '#3b82f6', '#ffd700', '#ffffff', '#10b981']
        });
      } else {
        setUnboxingStage('idle');
        alert(res.message);
      }
    }, 1200);
  };

  const handleResetToIdle = () => {
    setUnboxingStage('idle');
    setRevealRewards([]);
  };

  const handleCopyVoucher = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-[#e9e9e8] rounded-xl shadow-2xl overflow-hidden my-4 sm:my-6 text-[#37352f] flex flex-col">
        
        {/* 1. TOP TICKER: RECENT BIG WINNERS MARQUEE */}
        <div className="bg-[#fbfbfa] border-b border-[#e9e9e8] px-4 py-1.5 flex items-center justify-between text-[11px] overflow-hidden text-[#787774]">
          <div className="flex items-center space-x-2 truncate">
            <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-amber-700 font-semibold shrink-0">Nổ Hũ Gần Đây:</span>
            <span className="text-[#787774] truncate">
              {recentWinners[0]?.user} vừa trúng <strong className="text-amber-700">{recentWinners[0]?.reward}</strong> ({recentWinners[0]?.time})
            </span>
          </div>

          <button
            onClick={() => setShowDropRates(!showDropRates)}
            className="text-[10px] text-[#2383e2] hover:underline font-semibold flex items-center space-x-1 shrink-0 ml-2"
          >
            <Info className="w-3 h-3" />
            <span>Tỷ Lệ Rơi</span>
          </button>
        </div>

        {/* 2. MODAL HEADER */}
        <div className="relative z-10 flex items-center justify-between p-4 sm:p-5 border-b border-[#e9e9e8] bg-[#fbfbfa]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-[#37352f]">
                  Túi Mù & Hộp Mù Tri Thức (Blind Box)
                </h3>
                <span className="notion-tag notion-tag-yellow text-[10px] font-semibold">
                  100% TRÚNG THƯỞNG
                </span>
              </div>
              <p className="text-xs text-[#787774]">
                Khui quà ngẫu nhiên: Hoàn Xu có lãi, trọn bộ đề thi hiếm, voucher và Jackpot 100 Xu!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-black/5 rounded-md transition-colors"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#2383e2]" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-black/5 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3. DROP RATES TRANSPARENCY POPUP (DRAWER) */}
        {showDropRates && (
          <div className="bg-[#f7f6f5] border-b border-[#e9e9e8] p-4 animate-fade-in text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#37352f] flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-[#2383e2]" />
                <span>Bảng Tỷ Lệ Rơi Thưởng Minh Bạch ({selectedBox.name})</span>
              </span>
              <button
                onClick={() => setShowDropRates(false)}
                className="text-[11px] text-[#787774] hover:text-[#37352f]"
              >
                Đóng ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedBox.dropRates?.map((dr, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white border border-[#e9e9e8] flex items-center justify-between">
                  <span className="text-[11px] text-[#37352f] font-medium truncate mr-2">{dr.name}</span>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className="notion-tag notion-tag-blue text-[9px] font-semibold">
                      {dr.rarity}
                    </span>
                    <span className="font-mono font-bold text-amber-700 text-xs">{dr.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. MODAL BODY */}
        <div className="relative z-10 p-4 sm:p-6 space-y-4 bg-white">
          
          {/* User Wallet Balance Bar */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#f7f6f5] border border-[#e9e9e8] text-xs">
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="text-[#787774]">Số dư ví của bạn:</span>
              <span className="text-[#37352f] font-bold text-sm">{walletBalance} Xu</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenWallet();
              }}
              className="px-3 py-1 bg-white hover:bg-black/5 text-[#2383e2] border border-[#e9e9e8] rounded-md font-semibold text-[11px] transition-all"
            >
              + Nạp Thêm Xu
            </button>
          </div>

          {/* STAGE A: SELECTION & UNBOXING STAGE */}
          {unboxingStage !== 'revealed' ? (
            <div>
              
              {/* 3 Box Selector Tabs */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-4">
                {BLIND_BOXES.map((b) => {
                  const isSelected = b.id === selectedBoxId;
                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        if (unboxingStage === 'idle') {
                          setSelectedBoxId(b.id);
                        }
                      }}
                      disabled={unboxingStage !== 'idle'}
                      className={`relative p-3 rounded-lg border transition-all flex flex-col items-center text-center cursor-pointer ${
                        isSelected
                          ? `bg-[#fbfbfa] border-[#2383e2] ring-1 ring-[#2383e2] shadow-xs`
                          : 'bg-white border-[#e9e9e8] hover:border-[#c5c4c0]'
                      }`}
                    >
                      <span className="absolute -top-2.5 right-1 text-[8px] sm:text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#37352f] text-white">
                        {b.badge}
                      </span>
                      <div className="text-3xl sm:text-4xl my-1 transform hover:scale-105 transition-transform">
                        {b.icon}
                      </div>
                      <h4 className="text-[11px] sm:text-xs font-bold text-[#37352f] mt-1 leading-tight line-clamp-1">
                        {b.name}
                      </h4>
                      <span className="text-[10px] text-amber-700 font-medium mt-0.5">
                        {b.subname}
                      </span>
                      <div className="mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#f7f6f5] border border-[#e9e9e8] text-[#37352f]">
                        {b.costXu} Xu
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Visualizer Stage */}
              <div className="p-6 rounded-xl bg-[#fbfbfa] border border-[#e9e9e8] text-center relative overflow-hidden">
                
                {/* Interactive Blind Box Illustration */}
                <div className="relative z-10 py-2">
                  <div
                    onClick={() => {
                      if (unboxingStage === 'idle') {
                        handleStartUnboxing(1);
                      }
                    }}
                    className={`inline-block select-none cursor-pointer transition-all duration-300 ${
                      unboxingStage === 'shaking'
                        ? 'animate-bounce scale-110 rotate-6'
                        : 'hover:scale-105'
                    }`}
                  >
                    <div className="relative">
                      <span className="text-6xl sm:text-7xl drop-shadow-md">
                        {selectedBox.icon}
                      </span>
                      {unboxingStage === 'idle' && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 bg-[#37352f] text-white rounded-full text-[10px] font-medium shadow-xs">
                          ✨ Chạm để lắc hộp ✨
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold mt-4 text-[#37352f]">
                    {selectedBox.name}
                  </h3>
                  <p className="text-xs text-[#787774] max-w-md mx-auto mt-1">
                    {selectedBox.description}
                  </p>
                </div>

                {/* Rewards preview pill badges */}
                <div className="mt-4 pt-3 border-t border-[#e9e9e8] flex flex-wrap items-center justify-center gap-1.5">
                  <span className="text-[10px] text-[#787774] font-medium uppercase tracking-wider mr-1">
                    Quà trong hộp:
                  </span>
                  {selectedBox.expectedRewards.map((rw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-white border border-[#e9e9e8] text-[11px] font-medium text-amber-800"
                    >
                      ✨ {rw}
                    </span>
                  ))}
                </div>

                {/* DUAL ACTION BUTTONS: MỞ 1 HỘP (x1) & MỞ COMBO (x5) */}
                <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  
                  {/* Button 1: Single Open */}
                  <button
                    onClick={() => handleStartUnboxing(1)}
                    disabled={unboxingStage !== 'idle'}
                    className={`w-full sm:w-auto flex-1 max-w-xs py-2.5 px-5 rounded-lg font-semibold text-xs sm:text-sm text-white shadow-xs flex items-center justify-center space-x-1.5 transition-colors ${
                      unboxingStage === 'shaking'
                        ? 'bg-blue-400 cursor-wait'
                        : 'bg-[#2383e2] hover:bg-[#1a73e8]'
                    }`}
                  >
                    {unboxingStage === 'shaking' ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Đang khui hồi hộp...</span>
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4" />
                        <span>Khui 1 Hộp ({selectedBox.costXu} Xu)</span>
                      </>
                    )}
                  </button>

                  {/* Button 2: Combo x5 */}
                  <button
                    onClick={() => handleStartUnboxing(5)}
                    disabled={unboxingStage !== 'idle'}
                    className={`w-full sm:w-auto flex-1 max-w-xs py-2.5 px-5 rounded-lg font-semibold text-xs sm:text-sm text-white shadow-xs flex items-center justify-center space-x-1.5 transition-colors ${
                      unboxingStage === 'shaking'
                        ? 'opacity-40 cursor-not-allowed'
                        : 'bg-[#37352f] hover:bg-[#201f1d]'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Khui Combo x5 ({selectedBox.costXu * 5} Xu)</span>
                  </button>

                </div>

                <p className="text-[10px] text-[#787774] mt-2">
                  Cam kết 100% trúng thưởng hoàn Xu, thẻ Anki hoặc mã giảm giá. Không bao giờ tay trắng!
                </p>

              </div>
            </div>
          ) : (
            /* STAGE B: REWARDS REVEALED */
            <div className="animate-fade-in text-center p-5 sm:p-6 rounded-xl bg-[#fbfbfa] border border-[#e9e9e8]">
              
              <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold tracking-wider uppercase border border-amber-200 mb-3">
                {revealRewards.length > 1 ? `🎉 CHÚC MỪNG BẠN ĐÃ NHẬN ĐƯỢC ${revealRewards.length} PHẦN THƯỞNG!` : revealRewards[0]?.rarityLabel}
              </div>

              {/* Multi-Reward Grid or Single Hero Card */}
              {revealRewards.length === 1 ? (
                /* Single Card Hero */
                <div className="py-2">
                  <div className="text-6xl my-2 animate-bounce">
                    {revealRewards[0].icon}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#37352f]">
                    {revealRewards[0].title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#787774] max-w-md mx-auto mt-1 leading-relaxed">
                    {revealRewards[0].description}
                  </p>

                  {/* Copy Voucher code action if applicable */}
                  {revealRewards[0].code && (
                    <div className="mt-3 inline-flex items-center space-x-2 p-2 rounded-lg bg-white border border-[#e9e9e8]">
                      <span className="font-mono font-bold text-amber-700 text-sm">
                        {revealRewards[0].code}
                      </span>
                      <button
                        onClick={() => handleCopyVoucher(revealRewards[0].code)}
                        className="px-2.5 py-1 bg-[#37352f] text-white rounded-md text-xs font-medium flex items-center space-x-1 hover:bg-[#201f1d]"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedCode === revealRewards[0].code ? 'Đã chép!' : 'Sao chép'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Multi Combo Grid (x5) */
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 my-3">
                  {revealRewards.map((rw, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-white border border-[#e9e9e8] flex flex-col items-center justify-between text-center"
                    >
                      <span className="text-[9px] font-semibold uppercase text-amber-700">
                        Hộp #{idx + 1}
                      </span>
                      <div className="text-3xl my-1.5">
                        {rw.icon}
                      </div>
                      <h4 className="text-[11px] font-bold text-[#37352f] leading-tight">
                        {rw.title}
                      </h4>
                      <span className="text-[9px] text-[#787774] mt-1 line-clamp-2">
                        {rw.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#e9e9e8] flex items-center justify-center gap-2">
                <button
                  onClick={handleResetToIdle}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-black/5 text-[#787774] text-xs font-medium border border-[#e9e9e8] flex items-center space-x-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khui Thêm Hộp Khác</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Nhận Quà & Đóng</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
