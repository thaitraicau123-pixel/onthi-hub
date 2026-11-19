import React, { useMemo, useState } from 'react';
import {
  BUILDING_CATALOG,
  TOOL_ORDER,
  VICTORY_HAPPINESS,
  VICTORY_POPULATION,
} from '../game/catalog';
import type { BuildingKind, HudSnapshot, InteriorTheme, TaxRate, ToolId } from '../game/types';
import { CutawayIcon, TimeIcon, ToolIcon, WeatherIcon } from './Icons';

interface GameHudProps {
  hud: HudSnapshot;
  onSelectTool: (tool: ToolId) => void;
  onToggleCutaway: () => void;
  onCycleTime: () => void;
  onCycleWeather: () => void;
  onSetSpeed: (speed: 0 | 1 | 2 | 4) => void;
  onRotatePlacement: () => void;
  onRotateCamera: (dir: -1 | 1) => void;
  onToggleMute: () => void;
  onPause: () => void;
  onUpgradeBuilding: () => void;
  onSetTheme: (theme: InteriorTheme) => void;
  onBulldozeSelected: () => void;
  onCloseInspector: () => void;
  onSetTaxRate: (rate: TaxRate) => void;
  onSaveCity: () => void;
}

type DockTab = 'all' | 'civic' | 'residential' | 'commercial';

function getToolLabel(tool: ToolId): { name: string; cost: string; clue: string; hotkey: string } {
  if (tool === 'inspect') {
    return {
      name: 'Inspect',
      cost: 'FREE',
      clue: 'Inspect · Click any building to view & remodel its interior',
      hotkey: '1',
    };
  }
  if (tool === 'bulldoze') {
    return {
      name: 'Bulldoze',
      cost: '+25%',
      clue: 'Bulldoze · Clear tile or building & reclaim 25% materials',
      hotkey: '0',
    };
  }
  const def = BUILDING_CATALOG[tool as BuildingKind];
  return {
    name: def.shortName,
    cost: `$${def.cost}`,
    clue: `${def.name} · ${def.shortDesc} · [R] Rotate`,
    hotkey: def.hotkey,
  };
}

function nextTaxRate(current: TaxRate): TaxRate {
  if (current === 'low') return 'standard';
  if (current === 'standard') return 'high';
  return 'low';
}

function taxLabel(rate: TaxRate): string {
  if (rate === 'low') return 'Tax 5%';
  if (rate === 'high') return 'Tax 13%';
  return 'Tax 9%';
}

export function GameHud({
  hud,
  onSelectTool,
  onToggleCutaway,
  onCycleTime,
  onCycleWeather,
  onSetSpeed,
  onRotatePlacement,
  onRotateCamera,
  onToggleMute,
  onPause,
  onUpgradeBuilding,
  onSetTheme,
  onBulldozeSelected,
  onCloseInspector,
  onSetTaxRate,
  onSaveCity,
}: GameHudProps) {
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [dockTab, setDockTab] = useState<DockTab>('all');
  const { metrics, activeTool, selectedBuilding } = hud;
  const activeMeta = getToolLabel(activeTool);

  const visibleTools = useMemo(() => {
    if (dockTab === 'all') return TOOL_ORDER;
    return TOOL_ORDER.filter((tool) => {
      if (tool === 'inspect' || tool === 'bulldoze') return true;
      const cat = BUILDING_CATALOG[tool as BuildingKind].category;
      if (dockTab === 'civic') return cat === 'civic' || cat === 'infra';
      return cat === dockTab;
    });
  }, [dockTab]);

  const activeMilestone = hud.milestones.find((m) => !m.completed) ?? null;

  const selectedDef = selectedBuilding ? BUILDING_CATALOG[selectedBuilding.kind] : null;
  const upgradeCost =
    selectedBuilding && selectedDef
      ? selectedBuilding.interiorLevel === 1
        ? selectedDef.upgradeCost
        : Math.round(selectedDef.upgradeCost * 1.35)
      : 0;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-3 sm:p-4">
      {/* Top Perimeter Row */}
      <div className="flex items-start justify-between gap-3">
        {/* Top-Left: City Ledger Strip + Next Milestone Strip */}
        <div className="flex flex-col items-start gap-1.5">
          <div className="pointer-events-auto bg-[#171d27]/94 border border-[#4a5568] rounded px-3.5 py-2 retro-bevel flex flex-wrap items-center gap-3.5 sm:gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#a7b3c6]">
                Treasury
              </div>
              <div
                className={`text-lg sm:text-xl font-extrabold tabular-nums leading-tight ${
                  metrics.funds < 0 ? 'text-[#f87171]' : 'text-[#fde68a]'
                }`}
                data-testid="hud-funds"
              >
                ${Math.round(metrics.funds).toLocaleString()}
              </div>
            </div>

            <div className="h-7 w-px bg-[#333d4d]" />

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#a7b3c6]">
                Citizens
              </div>
              <div className="text-lg sm:text-xl font-extrabold tabular-nums leading-tight text-[#f4efe6]">
                <span data-testid="hud-population">{Math.round(metrics.population)}</span>
                <span className="text-xs font-semibold text-[#94a3b8]">/{VICTORY_POPULATION}</span>
              </div>
            </div>

            <div className="h-7 w-px bg-[#333d4d]" />

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#a7b3c6]">
                Power
              </div>
              <div
                className={`text-lg sm:text-xl font-extrabold tabular-nums leading-tight ${
                  metrics.powerDemand > metrics.powerSupply ? 'text-[#f87171]' : 'text-[#86efac]'
                }`}
              >
                {Math.round(metrics.powerDemand)}/{Math.round(metrics.powerSupply)}
              </div>
            </div>

            <div className="h-7 w-px bg-[#333d4d] hidden sm:block" />

            <div className="hidden sm:block">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#a7b3c6]">
                Joy ({VICTORY_HAPPINESS}%)
              </div>
              <div className="text-lg sm:text-xl font-extrabold tabular-nums leading-tight text-[#93c5fd]">
                {Math.round(metrics.happiness)}%
              </div>
            </div>

            <div className="h-7 w-px bg-[#333d4d] hidden md:block" />

            <div className="hidden md:flex items-center gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#a7b3c6]">
                  Safety
                </div>
                <div
                  className="text-sm font-extrabold tabular-nums text-[#7dd3fc]"
                  data-testid="hud-safety"
                >
                  {Math.round(metrics.safety)}%
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#a7b3c6]">
                  Health
                </div>
                <div
                  className="text-sm font-extrabold tabular-nums text-[#86efac]"
                  data-testid="hud-health"
                >
                  {Math.round(metrics.health)}%
                </div>
              </div>
            </div>

            <div className="h-7 w-px bg-[#333d4d] hidden md:block" />

            <div className="hidden md:block">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#a7b3c6]">
                Day {metrics.day}
              </div>
              <div
                className={`text-sm font-bold tabular-nums leading-tight ${
                  metrics.dailyNet >= 0 ? 'text-[#86efac]' : 'text-[#f87171]'
                }`}
              >
                {metrics.dailyNet >= 0 ? `+$${metrics.dailyNet}` : `-$${Math.abs(metrics.dailyNet)}`}
              </div>
            </div>

            <button
              type="button"
              tabIndex={-1}
              data-testid="btn-tax"
              onClick={(e) => {
                e.currentTarget.blur();
                onSetTaxRate(nextTaxRate(metrics.taxRate));
              }}
              title="Click to cycle Municipal Tax Policy (5% Low · 9% Standard · 13% High)"
              className={`hidden sm:inline-flex px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wide border cursor-pointer ${
                metrics.taxRate === 'low'
                  ? 'bg-[#1e3a2f] text-[#86efac] border-[#3b6e56]'
                  : metrics.taxRate === 'high'
                    ? 'bg-[#422323] text-[#fca5a5] border-[#7f3939]'
                    : 'bg-[#222b3a] text-[#fde68a] border-[#3b475c]'
              }`}
            >
              {taxLabel(metrics.taxRate)}
            </button>

            {/* Compact R/C/G Demand Bars */}
            <div className="hidden xl:flex items-end gap-1.5 pl-2 border-l border-[#333d4d]">
              {[
                { label: 'R', val: metrics.demandRes, color: '#4ade80' },
                { label: 'C', val: metrics.demandCom, color: '#60a5fa' },
                { label: 'G', val: metrics.demandCivic, color: '#fbbf24' },
              ].map((bar) => {
                const pct = Math.max(15, Math.min(100, Math.round((bar.val + 100) / 2)));
                return (
                  <div key={bar.label} className="flex flex-col items-center gap-0.5" title={`${bar.label} Demand`}>
                    <div className="w-2 h-6 bg-[#0f141c] rounded-sm overflow-hidden flex items-end border border-[#2d3646]">
                      <div
                        className="w-full"
                        style={{ height: `${pct}%`, backgroundColor: bar.color }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-[#94a3b8]">{bar.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {activeMilestone && (
            <div className="bg-[#171d27]/88 border border-[#4a5568] rounded px-2.5 py-1 text-[11px] text-[#e2e8f0] flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#e5a93b]">
                Milestone
              </span>
              <span className="font-semibold">{activeMilestone.title}</span>
              <span className="font-mono text-[#86efac] font-bold">+${activeMilestone.reward}</span>
            </div>
          )}

          {hud.lastEventBanner && (
            <div
              data-testid="event-banner"
              className="bg-[#171d27]/96 border border-[#e5a93b] text-[#fde68a] px-3 py-1 rounded text-xs font-bold tracking-wide retro-bevel"
            >
              {hud.lastEventBanner}
            </div>
          )}
        </div>

        {/* Top-Right: Compact Utility & View Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#171d27]/94 border border-[#4a5568] rounded p-1.5 retro-bevel">
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleCutaway();
            }}
            aria-label="Toggle Interior Cutaway"
            data-testid="btn-cutaway"
            className={`px-2.5 py-1.5 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 cursor-pointer border ${
              hud.cutaway
                ? 'bg-[#d99b38] text-[#161a22] border-[#fde68a]'
                : 'bg-[#222b3a] text-[#e2e8f0] border-[#3b475c] hover:bg-[#2c374b]'
            }`}
          >
            <CutawayIcon active={hud.cutaway} />
            <span className="hidden sm:inline">Cutaway</span>
            <span className="text-[10px] opacity-75 font-mono">[X]</span>
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onCycleTime();
            }}
            aria-label="Cycle Day and Night Lighting"
            data-testid="btn-time"
            className="px-2.5 py-1.5 rounded text-xs font-bold uppercase tracking-wide bg-[#222b3a] hover:bg-[#2c374b] text-[#e2e8f0] border border-[#3b475c] flex items-center gap-1.5 cursor-pointer"
          >
            <TimeIcon preset={hud.timePreset} />
            <span className="hidden md:inline">{hud.timePreset}</span>
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onCycleWeather();
            }}
            aria-label="Cycle Weather Conditions"
            title="Cycle Weather [V]: Auto · Clear · Rain · Snow"
            data-testid="btn-weather"
            className={`px-2.5 py-1.5 rounded text-xs font-bold uppercase tracking-wide border flex items-center gap-1.5 cursor-pointer ${
              metrics.weather === 'rain'
                ? 'bg-[#1f344d] text-[#93c5fd] border-[#3b82f6]/60'
                : metrics.weather === 'snow'
                  ? 'bg-[#2a384a] text-[#f1f5f9] border-[#cbd5e1]/60'
                  : 'bg-[#222b3a] hover:bg-[#2c374b] text-[#e2e8f0] border-[#3b475c]'
            }`}
          >
            <WeatherIcon weather={metrics.weather} preset={hud.weatherPreset} />
            <span className="hidden md:inline">
              {hud.weatherPreset === 'auto' ? `Auto·${metrics.weather}` : hud.weatherPreset}
            </span>
          </button>

          <div className="flex items-center bg-[#0f141c] rounded border border-[#333d4d] p-0.5">
            {([0, 1, 2, 4] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  onSetSpeed(spd);
                }}
                aria-label={spd === 0 ? 'Pause Time' : `Speed ${spd}x`}
                className={`px-1.5 py-1 rounded text-[11px] font-mono font-bold cursor-pointer ${
                  hud.simSpeed === spd
                    ? 'bg-[#d99b38] text-[#161a22]'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                {spd === 0 ? 'II' : `${spd}x`}
              </button>
            ))}
          </div>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onRotateCamera(-1);
            }}
            aria-label="Rotate Camera Left"
            className="w-8 h-8 rounded bg-[#222b3a] hover:bg-[#2c374b] text-[#e2e8f0] border border-[#3b475c] flex items-center justify-center text-xs font-bold cursor-pointer"
          >
            Q
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onRotateCamera(1);
            }}
            aria-label="Rotate Camera Right"
            className="w-8 h-8 rounded bg-[#222b3a] hover:bg-[#2c374b] text-[#e2e8f0] border border-[#3b475c] flex items-center justify-center text-xs font-bold cursor-pointer"
          >
            E
          </button>

          <button
            type="button"
            tabIndex={-1}
            data-testid="btn-save"
            onClick={(e) => {
              e.currentTarget.blur();
              onSaveCity();
            }}
            aria-label="Save City"
            title="Save City Layout"
            className="hidden sm:flex px-2 h-8 rounded bg-[#222b3a] hover:bg-[#2c374b] text-[#86efac] border border-[#3b475c] items-center justify-center text-[11px] font-bold uppercase cursor-pointer"
          >
            Save
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleMute();
            }}
            aria-label={hud.muted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-8 h-8 rounded bg-[#222b3a] hover:bg-[#2c374b] text-[#e2e8f0] border border-[#3b475c] flex items-center justify-center cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <path d="M4 9H8L13 5V19L8 15H4V9Z" fill="#e2e8f0" />
              {hud.muted ? (
                <path d="M16 9L21 15M21 9L16 15" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M16 8.5C17.5 10 17.5 14 16 15.5M18.5 6C21 9 21 15 18.5 18" stroke="#fde68a" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onPause();
            }}
            aria-label="Pause Menu"
            className="w-8 h-8 rounded bg-[#222b3a] hover:bg-[#2c374b] text-[#e2e8f0] border border-[#3b475c] flex items-center justify-center cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <rect x="6" y="5" width="4" height="14" rx="1" fill="#fde68a" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="#fde68a" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contextual Building Interior Inspector (anchored bottom-right above dock) */}
      {selectedBuilding && selectedDef && (
        <div
          className="pointer-events-auto self-end mb-2 w-72 bg-[#171d27]/96 border-2 border-[#8c6427] rounded p-3.5 retro-bevel"
          data-testid="building-inspector"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#d99b38]">
                Lot ({selectedBuilding.x}, {selectedBuilding.z}) · Lvl {selectedBuilding.interiorLevel}/3
              </div>
              <h2 className="text-base font-extrabold text-[#f4efe6] leading-tight">
                {selectedDef.name}
              </h2>
            </div>
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                onCloseInspector();
              }}
              aria-label="Close Inspector"
              className="w-6 h-6 rounded bg-[#222b3a] hover:bg-[#2f3b4f] text-[#cbd5e1] text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mb-2 text-center">
            <div className="bg-[#10151e] rounded p-1.5 retro-inset">
              <div className="text-[9px] uppercase text-[#94a3b8]">Power</div>
              <div className={`text-xs font-bold ${selectedBuilding.powered ? 'text-[#86efac]' : 'text-[#f87171]'}`}>
                {selectedBuilding.powered ? 'Online' : 'No Grid'}
              </div>
            </div>
            <div className="bg-[#10151e] rounded p-1.5 retro-inset">
              <div className="text-[9px] uppercase text-[#94a3b8]">
                {selectedDef.residents > 0 ? 'Residents' : 'Staff'}
              </div>
              <div className="text-xs font-bold tabular-nums text-[#f4efe6]">
                {selectedBuilding.occupants}
              </div>
            </div>
            <div className="bg-[#10151e] rounded p-1.5 retro-inset">
              <div className="text-[9px] uppercase text-[#94a3b8]">Net/Day</div>
              <div
                className={`text-xs font-bold tabular-nums ${
                  selectedBuilding.dailyRevenue >= 0 ? 'text-[#fde68a]' : 'text-[#f87171]'
                }`}
              >
                {selectedBuilding.dailyRevenue >= 0
                  ? `+$${selectedBuilding.dailyRevenue}`
                  : `-$${Math.abs(selectedBuilding.dailyRevenue)}`}
              </div>
            </div>
          </div>

          {(selectedDef.safetyBonus || selectedDef.healthBonus) && (
            <div className="mb-2 px-2 py-1 rounded bg-[#10151e] border border-[#2a3447] text-[11px] font-semibold flex items-center justify-between text-[#cbd5e1]">
              <span>Civic Service</span>
              <span className="text-[#7dd3fc] font-bold">
                {selectedDef.safetyBonus ? `+${selectedDef.safetyBonus} Safety ` : ''}
                {selectedDef.healthBonus ? `+${selectedDef.healthBonus} Health` : ''}
              </span>
            </div>
          )}

          {hud.selectedIndoorSummary.length > 0 && (
            <div
              className="mb-2.5 px-2 py-1.5 rounded bg-[#10151e] border border-[#2a3447] retro-inset"
              data-testid="inspector-indoor-activity"
            >
              <div className="text-[9px] font-mono uppercase tracking-wider text-[#d99b38] mb-1">
                Indoor Residents ({hud.selectedIndoorSummary.length})
              </div>
              <div className="grid grid-cols-2 gap-1">
                {hud.selectedIndoorSummary.slice(0, 4).map((act, idx) => (
                  <div
                    key={idx}
                    className="text-[10px] text-[#e2e8f0] bg-[#18202c] rounded px-1.5 py-0.5 truncate border border-[#273142]"
                    title={act}
                  >
                    {act}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interior Theme Selector */}
          {selectedBuilding.kind !== 'road' && (
            <div className="mb-3">
              <div className="text-[10px] uppercase tracking-wider text-[#a7b3c6] mb-1">
                Interior Decor Theme
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['classic', 'warm', 'metro'] as InteriorTheme[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onSetTheme(t);
                    }}
                    className={`py-1 rounded text-[11px] font-bold uppercase border cursor-pointer ${
                      selectedBuilding.interiorTheme === t
                        ? 'bg-[#d99b38] text-[#161a22] border-[#fde68a]'
                        : 'bg-[#222b3a] text-[#cbd5e1] border-[#3b475c] hover:bg-[#2c374b]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {selectedBuilding.interiorLevel < 3 ? (
              <button
                type="button"
                tabIndex={-1}
                disabled={metrics.funds < upgradeCost}
                onClick={(e) => {
                  e.currentTarget.blur();
                  onUpgradeBuilding();
                }}
                data-testid="btn-upgrade-interior"
                className="flex-1 py-2 px-2.5 rounded bg-[#2f6f4e] hover:bg-[#3a875f] disabled:opacity-45 text-white text-xs font-bold uppercase tracking-wide border border-[#6ee7b7]/40 cursor-pointer"
              >
                {selectedDef.upgradeName} (${upgradeCost})
              </button>
            ) : (
              <div className="flex-1 py-2 px-2.5 rounded bg-[#1d2533] text-[#fde68a] text-[11px] font-bold uppercase text-center border border-[#4a5568]">
                Max Interior Level
              </div>
            )}

            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                onBulldozeSelected();
              }}
              aria-label="Demolish Selected Building"
              className="py-2 px-2.5 rounded bg-[#7f2929] hover:bg-[#993333] text-white text-xs font-bold uppercase cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Bottom-Center Collapsible Categorized Build & Design Dock */}
      <div className="flex flex-col items-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1">
          {!dockCollapsed &&
            (
              [
                { id: 'all', label: 'All' },
                { id: 'civic', label: 'Roads & Civic' },
                { id: 'residential', label: 'Homes' },
                { id: 'commercial', label: 'Shops' },
              ] as Array<{ id: DockTab; label: string }>
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                tabIndex={-1}
                data-testid={`dock-tab-${tab.id}`}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setDockTab(tab.id);
                }}
                className={`px-2.5 py-0.5 rounded-t border border-b-0 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                  dockTab === tab.id
                    ? 'bg-[#2c384b] border-[#e5a93b] text-[#fde68a]'
                    : 'bg-[#171d27]/95 border-[#4a5568] text-[#94a3b8] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              setDockCollapsed((c) => !c);
            }}
            className="px-3 py-0.5 rounded-t bg-[#171d27]/95 border border-b-0 border-[#4a5568] text-[10px] font-mono uppercase tracking-wider text-[#cbd5e1] hover:text-white cursor-pointer"
          >
            {dockCollapsed ? '▴ Show Build Dock' : '▾ Hide'}
          </button>
        </div>

        {!dockCollapsed && (
          <div className="pointer-events-auto max-w-[96vw] bg-[#171d27]/95 border border-[#4a5568] rounded-b rounded-tr rounded-tl px-2.5 py-2 retro-bevel">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {visibleTools.map((tool) => {
                const meta = getToolLabel(tool);
                const selected = activeTool === tool;
                return (
                  <button
                    key={tool}
                    type="button"
                    tabIndex={-1}
                    data-testid={`tool-${tool}`}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onSelectTool(tool);
                    }}
                    className={`relative shrink-0 min-w-[68px] px-2 py-1.5 rounded border flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
                      selected
                        ? 'bg-[#2c384b] border-[#e5a93b] text-[#fde68a]'
                        : 'bg-[#1e2532] border-[#364154] text-[#dce3ee] hover:bg-[#263041]'
                    }`}
                  >
                    {meta.hotkey && (
                      <span className="absolute top-0.5 left-1 text-[9px] font-mono text-[#94a3b8]">
                        {meta.hotkey}
                      </span>
                    )}
                    <ToolIcon tool={tool} />
                    <span className="text-[10px] font-bold leading-tight whitespace-nowrap">
                      {meta.name}
                    </span>
                    <span className="text-[9px] font-mono tabular-nums text-[#fbbf24]">
                      {meta.cost}
                    </span>
                  </button>
                );
              })}

              {activeTool !== 'inspect' && activeTool !== 'bulldoze' && activeTool !== 'road' && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onRotatePlacement();
                  }}
                  aria-label="Rotate Building"
                  className="shrink-0 px-2.5 py-2 rounded bg-[#222b3a] hover:bg-[#2e3a4e] border border-[#4a5568] text-xs font-mono text-[#fde68a] cursor-pointer"
                >
                  Rot [R]
                </button>
              )}
            </div>

            <div className="text-[11px] text-[#cbd5e1] text-center pt-0.5 border-t border-[#2d3646]">
              {activeMeta.clue}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
