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
          colors: ['#f02c85', '#ff5f38', '#ffd700', '#ffffff', '#a855f7']
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#240618] border-2 border-[#f02c85]/50 rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-6 text-white flex flex-col">
        
        {/* Radiant Backdrop Light Bursts */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#f02c85]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* 1. TOP TICKER: RECENT BIG WINNERS MARQUEE */}
        <div className="bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border-b border-white/10 px-4 py-1.5 flex items-center justify-between text-[11px] overflow-hidden">
          <div className="flex items-center space-x-2 truncate">
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
            <span className="text-amber-300 font-black shrink-0">Nổ Hũ Gần Đây:</span>
            <span className="text-rose-100 font-medium truncate">
              {recentWinners[0]?.user} vừa trúng <strong className="text-amber-300">{recentWinners[0]?.reward}</strong> ({recentWinners[0]?.time})
            </span>
          </div>

          <button
            onClick={() => setShowDropRates(!showDropRates)}
            className="text-[10px] text-pink-300 hover:text-white font-black underline flex items-center space-x-1 shrink-0 ml-2"
          >
            <Info className="w-3 h-3" />
            <span>Tỷ Lệ Rơi</span>
          </button>
        </div>

        {/* 2. MODAL HEADER */}
        <div className="relative z-10 flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f02c85] via-rose-500 to-amber-400 flex items-center justify-center shadow-lg shadow-pink-900/40">
              <Gift className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight uppercase">
                  TÚI MÙ & HỘP MÙ TRI THỨC (BLIND BOX)
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  100% TRÚNG THƯỞNG
                </span>
              </div>
              <p className="text-xs text-rose-200/70 font-medium">
                Khui quà ngẫu nhiên: Hoàn Xu có lãi, trọn bộ đề thi hiếm, voucher và Jackpot 100 Xu!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-rose-200/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-pink-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-rose-200/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3. DROP RATES TRANSPARENCY POPUP (DRAWER) */}
        {showDropRates && (
          <div className="bg-[#1b0413] border-b border-white/15 p-4 animate-fade-in text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-300 uppercase flex items-center space-x-1.5">
                <Info className="w-4 h-4" />
                <span>Bảng Tỷ Lệ Rơi Thưởng Minh Bạch ({selectedBox.name})</span>
              </span>
              <button
                onClick={() => setShowDropRates(false)}
                className="text-[11px] text-rose-300 hover:text-white font-bold"
              >
                Đóng ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {selectedBox.dropRates?.map((dr, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-rose-100 font-bold">{dr.name}</span>
                  <span className="font-mono font-black text-amber-400 text-xs">{dr.rate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. MODAL BODY */}
        <div className="relative z-10 p-4 sm:p-6 space-y-5">
          
          {/* User Wallet Balance Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="text-rose-100 font-medium">Số dư ví của bạn:</span>
              <span className="text-amber-300 font-black text-sm">{walletBalance} Xu</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenWallet();
              }}
              className="px-3 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 rounded-xl font-black text-[11px] transition-all"
            >
              + Nạp Thêm Xu
            </button>
          </div>

          {/* STAGE A: SELECTION & UNBOXING STAGE */}
          {unboxingStage !== 'revealed' ? (
            <div>
              
              {/* 3 Box Selector Tabs */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
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
                      className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center cursor-pointer ${
                        isSelected
                          ? `bg-white/15 ${b.borderColor} ${b.glowColor} shadow-xl scale-102`
                          : 'bg-white/5 border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <span className="absolute -top-2.5 right-1 text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs">
                        {b.badge}
                      </span>
                      <div className="text-3xl sm:text-4xl my-1 transform hover:scale-110 transition-transform">
                        {b.icon}
                      </div>
                      <h4 className="text-[11px] sm:text-xs font-black text-white mt-1 leading-tight line-clamp-1">
                        {b.name}
                      </h4>
                      <span className="text-[10px] text-amber-300 font-bold mt-0.5">
                        {b.subname}
                      </span>
                      <div className="mt-2 text-xs font-black px-2.5 py-0.5 rounded-xl bg-amber-400 text-[#240618] shadow-xs">
                        {b.costXu} Xu
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 3D Visualizer Stage */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/15 text-center relative overflow-hidden">
                
                {/* Rotating Sunburst Ray Background when Shaking */}
                {unboxingStage === 'shaking' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <div className="w-96 h-96 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400 via-rose-500 to-transparent animate-spin-slow rounded-full blur-xl" />
                  </div>
                )}

                {/* Interactive 3D Blind Box Illustration */}
                <div className="relative z-10 py-2">
                  <div
                    onClick={() => {
                      if (unboxingStage === 'idle') {
                        handleStartUnboxing(1);
                      }
                    }}
                    className={`inline-block select-none cursor-pointer transition-all duration-300 ${
                      unboxingStage === 'shaking'
                        ? 'animate-bounce scale-125 rotate-12 filter brightness-125'
                        : 'hover:scale-110 hover:-rotate-3 active:scale-95'
                    }`}
                  >
                    <div className="relative">
                      <span className="text-7xl sm:text-8xl drop-shadow-2xl filter drop-shadow-[0_10px_20px_rgba(240,44,133,0.5)]">
                        {selectedBox.icon}
                      </span>
                      {unboxingStage === 'idle' && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 bg-black/70 backdrop-blur-md rounded-full text-[10px] font-black text-amber-300 border border-amber-400/40 animate-pulse">
                          ✨ Chạm để lắc hộp ✨
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black mt-4 text-white tracking-tight">
                    {selectedBox.name}
                  </h3>
                  <p className="text-xs text-rose-200/80 max-w-md mx-auto mt-1 font-medium">
                    {selectedBox.description}
                  </p>
                </div>

                {/* Rewards preview pill badges */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-center gap-1.5">
                  <span className="text-[10px] text-rose-300/70 font-black uppercase tracking-wider mr-1">
                    Quà trong hộp:
                  </span>
                  {selectedBox.expectedRewards.map((rw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-amber-200"
                    >
                      ✨ {rw}
                    </span>
                  ))}
                </div>

                {/* DUAL ACTION BUTTONS: MỞ 1 HỘP (x1) & MỞ COMBO (x5) */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  
                  {/* Button 1: Single Open */}
                  <button
                    onClick={() => handleStartUnboxing(1)}
                    disabled={unboxingStage !== 'idle'}
                    className={`w-full sm:w-auto flex-1 max-w-xs py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm text-white shadow-xl flex items-center justify-center space-x-2 transition-all transform active:scale-95 ${
                      unboxingStage === 'shaking'
                        ? 'bg-rose-500/50 cursor-wait'
                        : 'bg-gradient-to-r from-amber-400 via-[#f02c85] to-purple-600 hover:brightness-110 shadow-pink-900/50 hover:scale-103'
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
                    className={`w-full sm:w-auto flex-1 max-w-xs py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm text-white shadow-xl flex items-center justify-center space-x-2 transition-all transform active:scale-95 ${
                      unboxingStage === 'shaking'
                        ? 'opacity-40 cursor-not-allowed'
                        : 'bg-[#28071a] hover:bg-[#3d0c27] border-2 border-amber-400 hover:scale-103 shadow-amber-500/20'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Khui Combo x5 ({selectedBox.costXu * 5} Xu)</span>
                  </button>

                </div>

                <p className="text-[10px] text-rose-200/60 mt-2.5 font-medium">
                  Cam kết 100% trúng thưởng hoàn Xu, thẻ Anki hoặc mã giảm giá. Không bao giờ tay trắng!
                </p>

              </div>
            </div>
          ) : (
            /* STAGE B: REWARDS REVEALED (SINGLE OR MULTI COMBO GRID) */
            <div className="animate-fade-in text-center p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-white/15 to-white/5 border-2 border-amber-400 shadow-2xl">
              
              <div className="inline-block px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black tracking-wider uppercase border border-amber-400/40 mb-3 animate-pulse">
                {revealRewards.length > 1 ? `🎉 CHÚC MỪNG BẠN ĐÃ NHẬN ĐƯỢC ${revealRewards.length} PHẦN THƯỞNG!` : revealRewards[0]?.rarityLabel}
              </div>

              {/* Multi-Reward Grid or Single Hero Card */}
              {revealRewards.length === 1 ? (
                /* Single Card Hero */
                <div className="py-2">
                  <div className="text-7xl my-3 animate-bounce">
                    {revealRewards[0].icon}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {revealRewards[0].title}
                  </h2>
                  <p className="text-xs sm:text-sm text-rose-100 max-w-md mx-auto mt-2 leading-relaxed font-medium">
                    {revealRewards[0].description}
                  </p>

                  {/* Copy Voucher code action if applicable */}
                  {revealRewards[0].code && (
                    <div className="mt-4 inline-flex items-center space-x-2 p-2 rounded-xl bg-white/10 border border-white/20">
                      <span className="font-mono font-black text-amber-300 text-sm">
                        {revealRewards[0].code}
                      </span>
                      <button
                        onClick={() => handleCopyVoucher(revealRewards[0].code)}
                        className="px-2.5 py-1 bg-amber-400 text-[#240618] rounded-lg text-xs font-black flex items-center space-x-1 hover:brightness-110"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedCode === revealRewards[0].code ? 'Đã chép!' : 'Sao chép'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Multi Combo Grid (x5) */
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 my-4">
                  {revealRewards.map((rw, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-between hover:bg-white/15 transition-all text-center"
                    >
                      <span className="text-[9px] font-black uppercase text-amber-300">
                        Hộp #{idx + 1}
                      </span>
                      <div className="text-3xl my-1.5 animate-bounce">
                        {rw.icon}
                      </div>
                      <h4 className="text-[11px] font-black text-white leading-tight">
                        {rw.title}
                      </h4>
                      <span className="text-[9px] text-rose-200/80 font-medium mt-1 line-clamp-2">
                        {rw.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-3">
                <button
                  onClick={handleResetToIdle}
                  className="px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-black border border-white/20 flex items-center space-x-1.5 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Khui Thêm Hộp Khác</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-[#f02c85] hover:brightness-110 text-white text-xs font-black shadow-xl shadow-pink-900/40 flex items-center space-x-1.5 transition-all transform hover:scale-105 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
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
