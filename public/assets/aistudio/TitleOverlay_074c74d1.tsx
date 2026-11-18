import React from 'react';
import { MetropolisTitleEmblem } from './Icons';

interface TitleOverlayProps {
  onStartStarter: () => void;
  onStartBlank: () => void;
}

export function TitleOverlay({ onStartStarter, onStartBlank }: TitleOverlayProps) {
  return (
    <div className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 sm:p-10">
      {/* Upper-left calm negative-space region framing the live isometric city */}
      <div className="flex flex-col items-start gap-4 max-w-md pointer-events-auto">
        <MetropolisTitleEmblem />

        <div className="flex flex-wrap items-center gap-3 mt-1">
          <button
            type="button"
            data-start="true"
            onClick={(e) => {
              e.currentTarget.blur();
              onStartStarter();
            }}
            className="px-6 py-3 bg-[#d99b38] hover:bg-[#eab150] active:translate-y-px text-[#161a22] font-extrabold text-sm tracking-wider uppercase rounded border-2 border-[#fde68a] retro-bevel cursor-pointer transition-transform"
          >
            Enter Oakwood
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onStartBlank();
            }}
            className="px-4 py-3 bg-[#1f2633]/92 hover:bg-[#2a3344] text-[#f3e5c0] font-semibold text-xs tracking-wider uppercase rounded border border-[#525f76] retro-bevel cursor-pointer transition-colors"
          >
            Blank Parcel
          </button>
        </div>
      </div>

      {/* Single flat control-hint line in bottom safe margin */}
      <div className="flex justify-center">
        <p className="text-[11px] sm:text-xs font-mono tracking-wider uppercase text-[#f3e5c0]/90 bg-[#141923]/80 px-4 py-1.5 rounded border border-[#3a4457]">
          WASD Pan · Scroll Zoom · Q/E Rotate · X Interior Cutaway · Esc Pause
        </p>
      </div>
    </div>
  );
}
