import React, { useEffect, useRef, useState } from 'react';
import { GameHud } from './components/GameHud';
import { StatusModal } from './components/StatusModal';
import { TitleOverlay } from './components/TitleOverlay';
import { CityEngine } from './game/CityEngine';
import { INITIAL_MILESTONES, STARTING_FUNDS } from './game/catalog';
import type { HudSnapshot } from './game/types';

const INITIAL_HUD: HudSnapshot = {
  screen: 'title',
  outcome: null,
  metrics: {
    funds: STARTING_FUNDS,
    population: 0,
    jobs: 0,
    powerSupply: 0,
    powerDemand: 0,
    happiness: 78,
    safety: 75,
    health: 75,
    dailyNet: 0,
    day: 1,
    timeOfDay: 0.38,
    demandRes: 45,
    demandCom: 35,
    demandCivic: 20,
    buildingCount: 0,
    taxRate: 'standard',
    activeVehicles: 0,
    activeCitizens: 0,
    weather: 'clear',
  },
  activeTool: 'inspect',
  cutaway: false,
  simSpeed: 1,
  timePreset: 'auto',
  weatherPreset: 'auto',
  selectedBuilding: null,
  selectedIndoorSummary: [],
  milestones: INITIAL_MILESTONES.map((m) => ({ ...m })),
  lastEventBanner: null,
  endlessMode: false,
  muted: false,
  hasSavedCity: false,
};

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<CityEngine | null>(null);
  const [hud, setHud] = useState<HudSnapshot>(INITIAL_HUD);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const params = new URLSearchParams(window.location.search);
    const autostart = params.get('autostart') === '1';

    const engine = new CityEngine(
      container,
      (snapshot) => {
        setHud(snapshot);
      },
      autostart,
    );
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#161b24]">
      {/* Isolated WebGL canvas mount — React never re-renders or tears this down */}
      <div
        ref={mountRef}
        data-testid="city-canvas-mount"
        className="absolute inset-0 w-full h-full"
      />

      {hud.screen === 'title' && (
        <TitleOverlay
          onStartStarter={() => engineRef.current?.startGame()}
          onStartBlank={() => engineRef.current?.resetCity(false)}
        />
      )}

      {hud.screen !== 'title' && (
        <GameHud
          hud={hud}
          onSelectTool={(t) => engineRef.current?.setTool(t)}
          onToggleCutaway={() => engineRef.current?.toggleCutaway()}
          onCycleTime={() => engineRef.current?.cycleTimePreset()}
          onCycleWeather={() => engineRef.current?.cycleWeatherPreset()}
          onSetSpeed={(s) => engineRef.current?.setSimSpeed(s)}
          onRotatePlacement={() => engineRef.current?.rotatePlacement()}
          onRotateCamera={(d) => engineRef.current?.rotateCamera(d)}
          onToggleMute={() => engineRef.current?.toggleMute()}
          onPause={() => engineRef.current?.setPaused(true)}
          onUpgradeBuilding={() => engineRef.current?.upgradeSelectedBuilding()}
          onSetTheme={(theme) => engineRef.current?.setSelectedBuildingTheme(theme)}
          onBulldozeSelected={() => engineRef.current?.bulldozeSelectedBuilding()}
          onCloseInspector={() => engineRef.current?.clearSelection()}
          onSetTaxRate={(rate) => engineRef.current?.setTaxPolicy(rate)}
          onSaveCity={() => engineRef.current?.saveCityToStorage()}
        />
      )}

      <StatusModal
        hud={hud}
        onResume={() => engineRef.current?.setPaused(false)}
        onSaveCity={() => engineRef.current?.saveCityToStorage()}
        onLoadCity={() => engineRef.current?.loadCityFromStorage()}
        onResetStarter={() => engineRef.current?.resetCity(true)}
        onResetBlank={() => engineRef.current?.resetCity(false)}
        onReturnTitle={() => engineRef.current?.returnToTitle()}
        onContinueEndless={() => engineRef.current?.continueEndless()}
      />
    </main>
  );
}
