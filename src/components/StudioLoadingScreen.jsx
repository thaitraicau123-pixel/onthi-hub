import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { playSuccess, playHoverTick, playClick } from '../utils/soundEngine';

export default function StudioLoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [phaseText, setPhaseText] = useState('Đang nạp bảng màu Warm Cream Haute-Couture #fbf9f5...');

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1100; // 1.1s total cinematic warm loader

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawPct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(rawPct);

      if (rawPct < 35) {
        setPhaseText('Đang nạp bảng màu Warm Cream Haute-Couture #fbf9f5...');
      } else if (rawPct < 70) {
        setPhaseText('Khởi tạo Web Audio Synthesizer & Vi Tương Tác 60fps...');
      } else if (rawPct < 98) {
        setPhaseText('Đồng bộ Chợ Prompt C2C & Dịch Vụ Studio Bùi Thái...');
      } else {
        setPhaseText('Sẵn sàng bước vào không gian sáng tạo.');
      }

      if (rawPct >= 100) {
        clearInterval(interval);
        try {
          playSuccess();
        } catch (e) {}

        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onFinish?.();
          }, 500); // 500ms slide-up curtain duration
        }, 150);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [onFinish]);

  const handleSkip = () => {
    try {
      playClick();
    } catch (e) {}
    setIsExiting(true);
    setTimeout(() => {
      onFinish?.();
    }, 300);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[99999] bg-[#fbf9f5] text-[#1c1917] flex flex-col justify-between p-6 sm:p-12 select-none cream-grid cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting ? '-translate-y-full pointer-events-none' : 'translate-y-0'
      }`}
      aria-label="Studio Loading Screen"
    >
      {/* Top Studio Header */}
      <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E00] animate-pulse" />
          <span className="font-mono text-xs font-bold tracking-widest uppercase text-stone-900">
            BÙI THÁI STUDIO × PROMPTMMO
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-stone-500">
          <span>ATELIER KIẾN TRÚC SỐ // 60FPS</span>
        </div>
      </div>

      {/* Center Hero Counter & Status */}
      <div className="my-auto max-w-xl mx-auto w-full py-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Warm Editorial Studio Transition</span>
        </div>

        {/* Big Counter */}
        <div className="space-y-2">
          <div className="font-mono text-6xl sm:text-8xl font-black tracking-tighter text-[#1c1917] tabular-nums">
            {progress}
            <span className="text-3xl sm:text-4xl text-amber-600 font-bold ml-1">%</span>
          </div>
          <p className="text-sm sm:text-base font-medium text-stone-600 font-sans tracking-tight h-6">
            {phaseText}
          </p>
        </div>

        {/* Hairline Progress Bar */}
        <div className="w-full max-w-md mx-auto h-1.5 rounded-full bg-black/[0.06] overflow-hidden p-0.5 border border-black/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 via-[#FF2E00] to-orange-500 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="flex items-center justify-between border-t border-black/[0.08] pt-4 font-mono text-[11px] text-stone-500">
        <div className="flex items-center gap-2">
          <span className="text-amber-700 font-bold">2026 EDITION</span>
          <span>•</span>
          <span>HAUTE-COUTURE WEB & PROMPT MMO</span>
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className="hover:text-black inline-flex items-center gap-1 font-bold underline cursor-pointer"
        >
          <span>Nhấn để vào ngay</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
