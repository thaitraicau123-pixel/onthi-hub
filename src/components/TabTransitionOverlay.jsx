import React from 'react';
import { Sparkles } from 'lucide-react';

export default function TabTransitionOverlay({ isTransitioning, targetTabInfo }) {
  if (!isTransitioning) return null;

  const emoji = targetTabInfo?.emoji || '⚡';
  const label = targetTabInfo?.label || 'Không Gian Làm Việc';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] bg-[#fbf9f5]/96 text-[#1c1917] flex flex-col justify-between p-6 sm:p-12 cream-grid select-none pointer-events-none transition-opacity duration-200 animate-fade-in"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-black/[0.08] pb-3 text-[11px] font-mono text-stone-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF2E00] animate-ping" />
          <span className="font-bold uppercase tracking-wider text-stone-900">
            BÙI THÁI STUDIO × PROMPTMMO
          </span>
        </div>
        <span className="hidden sm:inline tracking-widest text-amber-700 font-bold uppercase">
          HAUTE-COUTURE TRANSITION // 60FPS
        </span>
      </div>

      {/* Center Animated Hub */}
      <div className="my-auto max-w-md mx-auto w-full text-center space-y-4 animate-studio-rise">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-white shadow-xl border border-stone-200/80 flex items-center justify-center text-3xl sm:text-4xl shadow-amber-500/10">
          <span>{emoji}</span>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-800 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Đang chuyển không gian...</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-display">
            {label}
          </h2>
        </div>

        {/* Rapid Studio Progress Line */}
        <div className="w-36 mx-auto h-1 rounded-full bg-black/[0.06] overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-[#FF2E00] w-full animate-pulse" />
        </div>
      </div>

      {/* Bottom Subtext */}
      <div className="flex items-center justify-between border-t border-black/[0.08] pt-3 text-[10px] font-mono text-stone-500">
        <span>© 2026 DIGITAL ATELIER</span>
        <span className="text-stone-400">EMIL KOWALSKI EASING</span>
      </div>
    </div>
  );
}
