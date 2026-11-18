import React from 'react';
import type { ToolId, WeatherKind, WeatherPreset } from '../game/types';

export function MetropolisTitleEmblem() {
  return (
    <svg
      viewBox="0 0 460 112"
      className="w-[340px] sm:w-[430px] h-auto drop-shadow-[0_6px_14px_rgba(0,0,0,0.72)]"
      role="img"
      aria-label="Metropolis 1998"
    >
      <defs>
        <linearGradient id="metroGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="48%" stopColor="#e5a93b" />
          <stop offset="100%" stopColor="#9c6316" />
        </linearGradient>
        <linearGradient id="metroSlate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#262f3f" />
          <stop offset="100%" stopColor="#141923" />
        </linearGradient>
      </defs>

      {/* Architectural plaque backing */}
      <rect x="6" y="10" width="448" height="92" rx="4" fill="url(#metroSlate)" stroke="#8c6427" strokeWidth="2.5" />
      <rect x="11" y="15" width="438" height="82" rx="2" fill="none" stroke="#3c4759" strokeWidth="1" />

      {/* Tiny 1998 isometric skyline silhouette on left */}
      <g transform="translate(22, 26)">
        <rect x="4" y="24" width="14" height="36" fill="#3a4c66" stroke="#10151e" strokeWidth="1.5" />
        <rect x="7" y="29" width="3" height="4" fill="#fbbf24" />
        <rect x="12" y="29" width="3" height="4" fill="#fbbf24" />
        <rect x="7" y="37" width="3" height="4" fill="#fbbf24" />
        <rect x="20" y="10" width="18" height="50" fill="#4f637f" stroke="#10151e" strokeWidth="1.5" />
        <rect x="24" y="16" width="4" height="5" fill="#fde68a" />
        <rect x="30" y="16" width="4" height="5" fill="#fde68a" />
        <rect x="24" y="25" width="4" height="5" fill="#fde68a" />
        <rect x="30" y="34" width="4" height="5" fill="#fde68a" />
        <rect x="40" y="28" width="16" height="32" fill="#8f4539" stroke="#10151e" strokeWidth="1.5" />
        <polygon points="38,28 48,18 58,28" fill="#42566e" stroke="#10151e" strokeWidth="1.2" />
      </g>

      {/* Bold 1998 Serif/Display Lockup */}
      <text
        x="266"
        y="55"
        textAnchor="middle"
        fill="url(#metroGold)"
        stroke="#10131a"
        strokeWidth="3.5"
        paintOrder="stroke fill"
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: 900,
          fontSize: '36px',
          letterSpacing: '3px',
        }}
      >
        METROPOLIS
      </text>

      {/* Year Banner */}
      <line x1="112" y1="68" x2="220" y2="68" stroke="#8c6427" strokeWidth="1.5" />
      <text
        x="266"
        y="83"
        textAnchor="middle"
        fill="#f3e5c0"
        style={{
          fontFamily: '"Courier New", monospace',
          fontWeight: 700,
          fontSize: '21px',
          letterSpacing: '8px',
        }}
      >
        1998
      </text>
      <line x1="312" y1="68" x2="420" y2="68" stroke="#8c6427" strokeWidth="1.5" />
    </svg>
  );
}

export function ToolIcon({ tool }: { tool: ToolId }) {
  switch (tool) {
    case 'inspect':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <circle cx="11" cy="11" r="6" fill="#2c3a4f" stroke="#f3e5c0" strokeWidth="2" />
          <path d="M15.5 15.5L20 20" stroke="#e5a93b" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case 'road':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path d="M5 20L9 4H15L19 20H5Z" fill="#3b424d" stroke="#11161f" strokeWidth="1.5" />
          <path d="M12 6V9M12 12V15M12 17.5V19" stroke="#fbbf24" strokeWidth="2" />
        </svg>
      );
    case 'park':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="10.5" y="14" width="3" height="6" fill="#7c5338" />
          <polygon points="12,3 5,15 19,15" fill="#4f9a4b" stroke="#1a3319" strokeWidth="1.4" />
          <polygon points="12,7 7,14 17,14" fill="#63b55e" />
        </svg>
      );
    case 'cottage':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="5" y="11" width="14" height="9" fill="#d9b68c" stroke="#1a1d24" strokeWidth="1.4" />
          <polygon points="3,12 12,4 21,12" fill="#b84a39" stroke="#1a1d24" strokeWidth="1.4" />
          <rect x="10" y="14" width="4" height="6" fill="#6f3926" />
        </svg>
      );
    case 'townhouse':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="5" y="6" width="14" height="14" fill="#a84b3e" stroke="#1a1d24" strokeWidth="1.4" />
          <rect x="4" y="5" width="16" height="2.5" fill="#475569" stroke="#1a1d24" strokeWidth="1" />
          <rect x="7" y="9" width="3" height="3" fill="#fde68a" />
          <rect x="14" y="9" width="3" height="3" fill="#fde68a" />
          <rect x="10" y="14" width="4" height="6" fill="#e2d5c1" />
        </svg>
      );
    case 'apartment':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="5" y="4" width="14" height="16" fill="#9f4a3c" stroke="#1a1d24" strokeWidth="1.5" />
          <rect x="8" y="7" width="3" height="3" fill="#fde68a" />
          <rect x="13" y="7" width="3" height="3" fill="#fde68a" />
          <rect x="8" y="12" width="3" height="3" fill="#fde68a" />
          <rect x="13" y="12" width="3" height="3" fill="#93c5fd" />
        </svg>
      );
    case 'villa':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="3" y="10" width="12" height="10" fill="#e6d3b3" stroke="#1a1d24" strokeWidth="1.4" />
          <polygon points="2,11 9,5 16,11" fill="#b85d3b" stroke="#1a1d24" strokeWidth="1.2" />
          <rect x="15" y="14" width="6" height="6" fill="#38bdf8" stroke="#1a1d24" strokeWidth="1.2" />
        </svg>
      );
    case 'cafe':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="5" y="10" width="14" height="10" fill="#e8dcc8" stroke="#1a1d24" strokeWidth="1.4" />
          <path d="M4 9H20L19 12H5L4 9Z" fill="#7c4a2d" stroke="#1a1d24" strokeWidth="1.2" />
          <rect x="8" y="13" width="4" height="4" fill="#fbbf24" />
          <rect x="14" y="14" width="3" height="6" fill="#5c3621" />
        </svg>
      );
    case 'diner':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="4" y="10" width="16" height="10" fill="#e8dfd1" stroke="#1a1d24" strokeWidth="1.4" />
          <rect x="3" y="8" width="18" height="3.5" fill="#c23e32" stroke="#1a1d24" strokeWidth="1.2" />
          <rect x="7" y="13" width="10" height="4" fill="#60a5fa" />
        </svg>
      );
    case 'supermarket':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="3" y="9" width="18" height="11" fill="#d1c4ad" stroke="#1a1d24" strokeWidth="1.4" />
          <rect x="3" y="6" width="18" height="4" fill="#2e6a9e" stroke="#1a1d24" strokeWidth="1.2" />
          <rect x="6" y="13" width="12" height="6" fill="#7dd3fc" />
        </svg>
      );
    case 'cinema':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="4" y="6" width="16" height="14" fill="#8f2d2d" stroke="#1a1d24" strokeWidth="1.4" />
          <rect x="6" y="8" width="12" height="3.5" fill="#fde047" stroke="#1a1d24" strokeWidth="1" />
          <rect x="8" y="14" width="8" height="6" fill="#1e293b" />
        </svg>
      );
    case 'office':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="6" y="3" width="12" height="17" fill="#52657d" stroke="#141923" strokeWidth="1.5" />
          <line x1="6" y1="8" x2="18" y2="8" stroke="#93c5fd" strokeWidth="1.5" />
          <line x1="6" y1="12" x2="18" y2="12" stroke="#93c5fd" strokeWidth="1.5" />
          <line x1="6" y1="16" x2="18" y2="16" stroke="#fde68a" strokeWidth="1.5" />
        </svg>
      );
    case 'police':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="4" y="7" width="16" height="13" fill="#2b4570" stroke="#1a1d24" strokeWidth="1.4" />
          <polygon points="12,9 13.5,12 16.5,12 14,14 15,17 12,15.2 9,17 10,14 7.5,12 10.5,12" fill="#fbbf24" />
          <rect x="9" y="4" width="6" height="2.5" fill="#3b82f6" />
        </svg>
      );
    case 'hospital':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="4" y="6" width="16" height="14" fill="#f1f5f9" stroke="#1a1d24" strokeWidth="1.4" />
          <rect x="10.5" y="9" width="3" height="8" fill="#dc2626" />
          <rect x="8" y="11.5" width="8" height="3" fill="#dc2626" />
        </svg>
      );
    case 'powerplant':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="4" y="11" width="16" height="9" fill="#8f4539" stroke="#1a1d24" strokeWidth="1.4" />
          <rect x="6" y="4" width="3.5" height="7" fill="#d97706" stroke="#1a1d24" strokeWidth="1.2" />
          <rect x="12" y="4" width="3.5" height="7" fill="#d97706" stroke="#1a1d24" strokeWidth="1.2" />
          <polygon points="13,12 10,16 12.5,16 11,19.5 15.5,15 13,15" fill="#fde047" />
        </svg>
      );
    case 'bulldoze':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="7" y="8" width="11" height="8" rx="1.5" fill="#d97706" stroke="#1a1d24" strokeWidth="1.4" />
          <path d="M4 17H19" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          <path d="M5 10L3 16" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
}

export function CutawayIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
      <polygon
        points="12,3 3,8 12,13 21,8"
        fill={active ? '#fbbf24' : '#cbd5e1'}
        stroke="#0f172a"
        strokeWidth="1.4"
      />
      <path d="M4 12V18L12 22L20 18V12" stroke={active ? '#fde68a' : '#94a3b8'} strokeWidth="1.8" />
    </svg>
  );
}

export function TimeIcon({ preset }: { preset: string }) {
  if (preset === 'night') {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
        <path
          d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z"
          fill="#fde68a"
          stroke="#1e293b"
          strokeWidth="1.3"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
      <circle cx="12" cy="12" r="5" fill={preset === 'dusk' ? '#fb923c' : '#facc15'} stroke="#1e293b" strokeWidth="1.2" />
      <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function WeatherIcon({ weather, preset }: { weather: WeatherKind; preset: WeatherPreset }) {
  const effective = preset === 'auto' ? weather : preset;
  if (effective === 'rain') {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
        <path
          d="M6 14H18C19.6 14 21 12.7 21 11C21 9.4 19.8 8.2 18.2 8.1C17.6 5.7 15.5 4 13 4C10.1 4 7.8 6.2 7.6 9C5.6 9.3 4 10.9 4 12.8C4 13.5 4.8 14 6 14Z"
          fill="#94a3b8"
          stroke="#1e293b"
          strokeWidth="1.2"
        />
        <path d="M8 17L7 20M12.5 17L11.5 20M17 17L16 20" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (effective === 'snow') {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
        <path
          d="M12 3V21M4.5 7.5L19.5 16.5M19.5 7.5L4.5 16.5"
          stroke="#e2e8f0"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="2.2" fill="#93c5fd" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
      <circle cx="9.5" cy="9.5" r="4.2" fill="#facc15" />
      <path
        d="M8 17H18C19.3 17 20.5 15.9 20.5 14.5C20.5 13.2 19.5 12.2 18.2 12.1C17.7 10.2 16 8.8 14 8.8C11.7 8.8 9.9 10.5 9.7 12.7C8.1 12.9 6.8 14.2 6.8 15.8C6.8 16.5 7.3 17 8 17Z"
        fill="#e2e8f0"
        stroke="#1e293b"
        strokeWidth="1.1"
      />
    </svg>
  );
}

