import React from 'react';
import { VICTORY_HAPPINESS, VICTORY_POPULATION } from '../game/catalog';
import type { HudSnapshot } from '../game/types';

interface StatusModalProps {
  hud: HudSnapshot;
  onResume: () => void;
  onSaveCity: () => void;
  onLoadCity: () => void;
  onResetStarter: () => void;
  onResetBlank: () => void;
  onReturnTitle: () => void;
  onContinueEndless: () => void;
}

export function StatusModal({
  hud,
  onResume,
  onSaveCity,
  onLoadCity,
  onResetStarter,
  onResetBlank,
  onReturnTitle,
  onContinueEndless,
}: StatusModalProps) {
  if (hud.screen !== 'paused' && hud.screen !== 'gameover') return null;

  const isVictory = hud.screen === 'gameover' && hud.outcome === 'victory';
  const isBankrupt = hud.screen === 'gameover' && hud.outcome === 'bankrupt';

  return (
    <div className="fixed inset-0 z-30 bg-[#0d1118]/75 flex items-center justify-center p-4">
      <div
        className="w-full max-w-md bg-[#1a212d] border-2 border-[#8c6427] rounded p-6 retro-bevel text-[#f4efe6]"
        role="dialog"
        aria-modal="true"
      >
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#e5a93b] mb-1">
          {isVictory
            ? 'Municipal Charter Granted'
            : isBankrupt
              ? 'Municipal Insolvency'
              : 'Simulation Paused'}
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">
          {isVictory
            ? 'Metropolis Charter Achieved!'
            : isBankrupt
              ? 'Treasury Exhausted'
              : 'Mayor’s Office'}
        </h2>
        <p className="text-xs text-[#cbd5e1] mb-4">
          {isVictory
            ? `You grew your town past ${VICTORY_POPULATION} citizens with ${VICTORY_HAPPINESS}%+ satisfaction.`
            : isBankrupt
              ? 'Daily upkeep exceeded municipal tax revenue. Reorganize zoning or start a fresh district.'
              : 'City simulation is halted. Inspect interiors, save your city archive, or start a new parcel.'}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#111620] rounded p-2.5 text-center retro-inset">
            <div className="text-[10px] uppercase text-[#94a3b8]">Treasury</div>
            <div className="text-base font-extrabold tabular-nums text-[#fde68a]">
              ${Math.round(hud.metrics.funds).toLocaleString()}
            </div>
          </div>
          <div className="bg-[#111620] rounded p-2.5 text-center retro-inset">
            <div className="text-[10px] uppercase text-[#94a3b8]">Citizens</div>
            <div className="text-base font-extrabold tabular-nums text-white">
              {Math.round(hud.metrics.population)}
            </div>
          </div>
          <div className="bg-[#111620] rounded p-2.5 text-center retro-inset">
            <div className="text-[10px] uppercase text-[#94a3b8]">Day</div>
            <div className="text-base font-extrabold tabular-nums text-[#93c5fd]">
              {hud.metrics.day}
            </div>
          </div>
        </div>

        <div className="bg-[#111620] rounded p-2.5 mb-4 retro-inset space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8]">
            Charter Milestones
          </div>
          {hud.milestones.map((m) => (
            <div key={m.id} className="flex items-center justify-between text-xs">
              <span className={m.completed ? 'text-[#86efac] line-through opacity-80' : 'text-[#e2e8f0]'}>
                {m.completed ? '✓ ' : '• '}
                {m.title}
              </span>
              <span className="font-mono text-[11px] text-[#fde68a]">+${m.reward}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {hud.screen === 'paused' && (
            <button
              type="button"
              onClick={onResume}
              className="w-full py-2.5 rounded bg-[#d99b38] hover:bg-[#eab150] text-[#161a22] font-extrabold text-sm uppercase tracking-wider border border-[#fde68a] cursor-pointer"
            >
              Resume City
            </button>
          )}

          {isVictory && (
            <button
              type="button"
              data-start="true"
              onClick={onContinueEndless}
              className="w-full py-2.5 rounded bg-[#2f6f4e] hover:bg-[#3a875f] text-white font-extrabold text-sm uppercase tracking-wider border border-[#6ee7b7]/50 cursor-pointer"
            >
              Continue Endless Mode
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            {hud.screen === 'paused' && (
              <button
                type="button"
                onClick={onSaveCity}
                className="py-2 rounded bg-[#264638] hover:bg-[#2f5746] text-[#bbf7d0] font-bold text-xs uppercase tracking-wider border border-[#4ade80]/30 cursor-pointer"
              >
                Save City
              </button>
            )}
            <button
              type="button"
              disabled={!hud.hasSavedCity}
              onClick={onLoadCity}
              className={`${
                hud.screen === 'paused' ? '' : 'col-span-2'
              } py-2 rounded bg-[#263143] hover:bg-[#324057] disabled:opacity-40 text-[#f4efe6] font-bold text-xs uppercase tracking-wider border border-[#4a5568] cursor-pointer`}
            >
              Load Saved City
            </button>
          </div>

          <button
            type="button"
            data-start={hud.screen === 'gameover' && !isVictory ? 'true' : undefined}
            onClick={onResetStarter}
            className="w-full py-2.5 rounded bg-[#263143] hover:bg-[#324057] text-[#f4efe6] font-bold text-xs uppercase tracking-wider border border-[#4a5568] cursor-pointer"
          >
            Restart Oakwood Town
          </button>

          <button
            type="button"
            onClick={onResetBlank}
            className="w-full py-2 rounded bg-[#1f2735] hover:bg-[#2a3447] text-[#cbd5e1] font-semibold text-xs uppercase tracking-wider border border-[#3b475c] cursor-pointer"
          >
            New Blank Parcel
          </button>

          <button
            type="button"
            onClick={onReturnTitle}
            className="w-full py-2 rounded text-[#94a3b8] hover:text-white font-semibold text-xs uppercase tracking-wider cursor-pointer"
          >
            Return to Title
          </button>
        </div>
      </div>
    </div>
  );
}
