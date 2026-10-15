import React from 'react';

/**
 * ThemeAtmosphereBackground
 * High-fidelity atmospheric illustrated background artwork for 10 themes.
 * Renders detailed vector drawings, ambient scene silhouettes, and animated particles.
 * Designed with calibrated opacity and masks so all text and cards remain 100% legible.
 */
export default function ThemeAtmosphereBackground({ theme }) {
  if (!theme) return null;
  const themeId = theme.id || 'default';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 transition-all duration-700 ease-in-out"
    >
      {/* 1. NOTION MINIMALIST: ARCHITECTURAL BLUEPRINT & ISOMETRIC DRAFTING */}
      {themeId === 'default' && (
        <div className="absolute inset-0 opacity-[0.35] transition-opacity duration-700">
          {/* Subtle blueprint dot grid */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="minimal-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#2383e2" fillOpacity="0.18" />
              </pattern>
              <linearGradient id="blueprint-fade" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2383e2" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2383e2" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#minimal-dots)" />

            {/* Architectural Drafting Compass (Top Right) */}
            <g transform="translate(1100, 40) scale(0.85)" stroke="#2383e2" strokeWidth="1.2" fill="none" opacity="0.45">
              <circle cx="120" cy="120" r="80" strokeDasharray="4 4" />
              <circle cx="120" cy="120" r="110" strokeDasharray="2 6" />
              <line x1="20" y1="120" x2="220" y2="120" strokeDasharray="3 3" />
              <line x1="120" y1="20" x2="120" y2="220" strokeDasharray="3 3" />
              {/* Compass legs */}
              <path d="M120 40 L90 180 M120 40 L150 180" strokeWidth="2" strokeLinecap="round" />
              <circle cx="120" cy="40" r="7" fill="#2383e2" fillOpacity="0.3" strokeWidth="2" />
              <path d="M100 130 Q120 140 140 130" strokeWidth="1.5" />
            </g>

            {/* Isometric 3D Wireframe Cube (Top Left) */}
            <g transform="translate(60, 80) scale(0.9)" stroke="#2383e2" strokeWidth="1.2" fill="none" opacity="0.35">
              <path d="M60 20 L110 50 L110 110 L60 140 L10 110 L10 50 Z" />
              <path d="M60 20 L60 80 L110 110 M60 80 L10 110" />
              <circle cx="60" cy="80" r="3" fill="#2383e2" />
            </g>

            {/* Minimalist Open Notebook Line Art (Bottom Left) */}
            <g transform="translate(80, 560) scale(0.95)" stroke="#2383e2" strokeWidth="1.2" fill="none" opacity="0.3">
              <path d="M10 80 Q60 65 110 80 L110 160 Q60 145 10 160 Z" fill="#2383e2" fillOpacity="0.03" />
              <path d="M110 80 Q160 65 210 80 L210 160 Q160 145 110 160 Z" fill="#2383e2" fillOpacity="0.03" />
              <line x1="110" y1="75" x2="110" y2="165" strokeWidth="2" />
              {/* Notebook page lines */}
              <line x1="25" y1="100" x2="95" y2="100" strokeDasharray="2 3" />
              <line x1="25" y1="115" x2="95" y2="115" strokeDasharray="2 3" />
              <line x1="25" y1="130" x2="95" y2="130" strokeDasharray="2 3" />
              <line x1="125" y1="100" x2="195" y2="100" strokeDasharray="2 3" />
              <line x1="125" y1="115" x2="195" y2="115" strokeDasharray="2 3" />
              <line x1="125" y1="130" x2="195" y2="130" strokeDasharray="2 3" />
            </g>

            {/* Subtle Drafting Angle Protractor (Bottom Right) */}
            <g transform="translate(1050, 620) scale(0.8)" stroke="#2383e2" strokeWidth="1" fill="none" opacity="0.35">
              <path d="M30 150 A120 120 0 0 1 270 150 Z" />
              <circle cx="150" cy="150" r="6" strokeWidth="2" />
              <line x1="150" y1="150" x2="235" y2="65" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      )}

      {/* 2. LOFI CAFE: WARM LATTE ART, VINYL GROOVES & COZY STEAM */}
      {themeId === 'lofi-cafe' && (
        <div className="absolute inset-0 opacity-[0.4] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="coffee-steam-grad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#8c532b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Vintage Vinyl Record (Bottom Right) */}
            <g transform="translate(1080, 520) scale(1)" stroke="#8c532b" fill="none" opacity="0.4">
              <circle cx="150" cy="150" r="140" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="120" strokeWidth="0.8" strokeDasharray="5 3" />
              <circle cx="150" cy="150" r="100" strokeWidth="0.8" />
              <circle cx="150" cy="150" r="80" strokeWidth="0.8" strokeDasharray="3 4" />
              <circle cx="150" cy="150" r="60" strokeWidth="1" />
              <circle cx="150" cy="150" r="45" fill="#8c532b" fillOpacity="0.15" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="8" fill="#8c532b" />
              {/* Turntable tonearm */}
              <path d="M40 30 L110 80 L140 120" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="40" cy="30" r="10" fill="#8c532b" fillOpacity="0.3" strokeWidth="2" />
            </g>

            {/* Steaming Coffee Cup with Latte Heart (Top Left) */}
            <g transform="translate(80, 50) scale(0.95)" stroke="#8c532b" fill="none" opacity="0.45">
              {/* Cup body & saucer */}
              <ellipse cx="100" cy="150" rx="65" ry="14" strokeWidth="2" fill="#8c532b" fillOpacity="0.08" />
              <path d="M50 80 Q45 130 100 135 Q155 130 150 80 Z" strokeWidth="2.2" fill="#8c532b" fillOpacity="0.04" />
              <ellipse cx="100" cy="80" rx="50" ry="12" strokeWidth="2" fill="#f4ede1" />
              {/* Cup handle */}
              <path d="M148 90 Q175 90 170 115 Q165 130 138 126" strokeWidth="2.2" strokeLinecap="round" />
              {/* Latte Art Heart */}
              <path d="M100 84 C95 78 85 78 85 84 C85 91 100 97 100 97 C100 97 115 91 115 84 C115 78 105 78 100 84 Z" fill="#8c532b" fillOpacity="0.4" stroke="none" />
              {/* Animated rising steam curls */}
              <path d="M85 65 Q75 45 90 25 T85 5" stroke="url(#coffee-steam-grad)" strokeWidth="2.5" strokeLinecap="round" className="animate-steam-1" />
              <path d="M105 60 Q120 40 105 20 T115 0" stroke="url(#coffee-steam-grad)" strokeWidth="2" strokeLinecap="round" className="animate-steam-2" />
            </g>

            {/* Vintage Desk Gooseneck Lamp Silhouette (Top Right) */}
            <g transform="translate(1120, 30) scale(0.85)" stroke="#8c532b" fill="none" opacity="0.35">
              <path d="M120 220 L160 220" strokeWidth="4" strokeLinecap="round" />
              <path d="M140 220 L140 140 Q140 70 80 70 L40 70" strokeWidth="3" />
              {/* Lampshade */}
              <path d="M40 50 L10 85 L60 85 Z" strokeWidth="2" fill="#8c532b" fillOpacity="0.1" />
              {/* Warm light cone */}
              <polygon points="10,85 60,85 120,220 -50,220" fill="#fef3c7" fillOpacity="0.08" stroke="none" />
            </g>

            {/* Floating Coffee Beans (Scattered) */}
            <g fill="#8c532b" fillOpacity="0.25" stroke="#8c532b" strokeWidth="0.8" opacity="0.5">
              <g transform="translate(260, 220) rotate(25) scale(0.7)">
                <ellipse cx="12" cy="18" rx="10" ry="14" />
                <path d="M12 4 Q16 18 12 32" fill="none" strokeWidth="1.2" />
              </g>
              <g transform="translate(880, 180) rotate(-40) scale(0.6)">
                <ellipse cx="12" cy="18" rx="10" ry="14" />
                <path d="M12 4 Q8 18 12 32" fill="none" strokeWidth="1.2" />
              </g>
              <g transform="translate(420, 680) rotate(15) scale(0.65)">
                <ellipse cx="12" cy="18" rx="10" ry="14" />
                <path d="M12 4 Q16 18 12 32" fill="none" strokeWidth="1.2" />
              </g>
            </g>
          </svg>
        </div>
      )}

      {/* 3. SAKURA BLOSSOM: JAPANESE CHERRY BLOSSOM BRANCH, MT FUJI & FALLING PETALS */}
      {themeId === 'sakura-blossom' && (
        <div className="absolute inset-0 opacity-[0.45] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Mount Fuji Silhouette (Center Horizon) */}
            <g transform="translate(380, 520) scale(1.1)" opacity="0.25">
              {/* Mountain cone */}
              <polygon points="260,30 40,240 480,240" fill="#db4d86" fillOpacity="0.15" />
              {/* Snow cap */}
              <polygon points="260,30 200,95 230,110 260,95 290,110 320,95" fill="#ffffff" fillOpacity="0.75" />
            </g>

            {/* Traditional Japanese Torii Gate (Bottom Left) */}
            <g transform="translate(90, 580) scale(0.7)" stroke="#db4d86" strokeWidth="3" fill="#db4d86" fillOpacity="0.15" opacity="0.35">
              {/* Main Pillars */}
              <line x1="40" y1="40" x2="40" y2="180" strokeWidth="8" strokeLinecap="round" />
              <line x1="160" y1="40" x2="160" y2="180" strokeWidth="8" strokeLinecap="round" />
              {/* Curved Top Lintel (Kasagi) */}
              <path d="M10 40 Q100 20 190 40 L195 25 Q100 5 5 25 Z" strokeWidth="2" />
              {/* Second Lintel (Nuki) */}
              <rect x="25" y="65" width="150" height="12" rx="2" strokeWidth="1" />
              {/* Center Plaque */}
              <rect x="90" y="40" width="20" height="26" fill="#db4d86" fillOpacity="0.4" strokeWidth="1" />
            </g>

            {/* Cherry Blossom Gnarled Branch Reaching from Top Right */}
            <g transform="translate(850, -40) scale(1.15)" opacity="0.6">
              {/* Main branch wood */}
              <path
                d="M450 20 Q320 80 240 60 Q180 50 140 110 Q90 180 20 200"
                stroke="#8b4d66"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M250 65 Q230 140 180 170" stroke="#8b4d66" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M330 75 Q360 150 410 180" stroke="#8b4d66" strokeWidth="3.5" strokeLinecap="round" fill="none" />

              {/* Sakura Flower Clusters */}
              {[
                { cx: 140, cy: 110, s: 1.1, rot: 15 },
                { cx: 80, cy: 175, s: 0.9, rot: -20 },
                { cx: 20, cy: 200, s: 1.2, rot: 45 },
                { cx: 180, cy: 170, s: 1.0, rot: 70 },
                { cx: 245, cy: 60, s: 1.3, rot: 5 },
                { cx: 340, cy: 100, s: 0.85, rot: -35 },
                { cx: 410, cy: 180, s: 1.05, rot: 60 },
              ].map((f, i) => (
                <g key={i} transform={`translate(${f.cx}, ${f.cy}) scale(${f.s}) rotate(${f.rot})`}>
                  {/* 5 petals */}
                  {[0, 72, 144, 216, 288].map((angle, idx) => (
                    <path
                      key={idx}
                      d="M0 0 C-7 -18 7 -18 0 -26 C-7 -18 7 -18 0 0"
                      transform={`rotate(${angle})`}
                      fill="#fbb6ce"
                      stroke="#db4d86"
                      strokeWidth="0.8"
                    />
                  ))}
                  <circle cx="0" cy="0" r="3.5" fill="#f43f5e" />
                  <circle cx="0" cy="0" r="1.5" fill="#fef08a" />
                </g>
              ))}
            </g>

            {/* Falling Sakura Petals (Floating across the screen) */}
            <g fill="#f472b6" fillOpacity="0.45" stroke="#db4d86" strokeWidth="0.6">
              <path d="M180 140 C175 130 190 120 195 130 C200 140 185 150 180 140 Z" className="animate-pulse" />
              <path d="M340 280 C335 270 350 260 355 270 C360 280 345 290 340 280 Z" />
              <path d="M680 190 C675 180 690 170 695 180 C700 190 685 200 680 190 Z" />
              <path d="M520 420 C515 410 530 400 535 410 C540 420 525 430 520 420 Z" />
              <path d="M820 540 C815 530 830 520 835 530 C840 540 825 550 820 540 Z" />
              <path d="M220 620 C215 610 230 600 235 610 C240 620 225 630 220 620 Z" />
            </g>
          </svg>
        </div>
      )}

      {/* 4. COSMIC GALAXY: SPIRAL GALAXY, CONSTELLATIONS, NEBULA & ASTRONAUT */}
      {themeId === 'cosmic-galaxy' && (
        <div className="absolute inset-0 opacity-[0.6] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="galactic-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.6" />
                <stop offset="40%" stopColor="#818cf8" stopOpacity="0.3" />
                <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0f0d1b" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="meteor-trail" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#c084fc" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Glowing Spiral Galaxy (Top Right) */}
            <g transform="translate(1000, 60) scale(1.2)" opacity="0.75">
              <ellipse cx="140" cy="140" rx="140" ry="90" fill="url(#galactic-core)" transform="rotate(-25 140 140)" />
              {/* Spiral galaxy arms */}
              <path
                d="M140 140 Q180 80 240 110 T280 180"
                stroke="#c084fc"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M140 140 Q100 200 40 170 T0 100"
                stroke="#818cf8"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
              <circle cx="140" cy="140" r="14" fill="#ffffff" opacity="0.8" className="animate-pulse" />
            </g>

            {/* Saturn Ringed Planet (Bottom Left) */}
            <g transform="translate(120, 520) scale(0.95)" opacity="0.65">
              {/* Planet sphere */}
              <circle cx="100" cy="100" r="50" fill="#3b2d69" stroke="#c084fc" strokeWidth="1.5" />
              {/* Planet Rings */}
              <ellipse
                cx="100"
                cy="100"
                rx="110"
                ry="32"
                fill="none"
                stroke="#d8b4fe"
                strokeWidth="4"
                transform="rotate(-20 100 100)"
                opacity="0.75"
              />
              <ellipse
                cx="100"
                cy="100"
                rx="90"
                ry="24"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2"
                transform="rotate(-20 100 100)"
                opacity="0.5"
              />
            </g>

            {/* Constellation Charts: Ursa Major & Cassiopeia */}
            <g stroke="#a855f7" strokeWidth="1" fill="#ffffff" opacity="0.45">
              {/* Cassiopeia (Top Center) */}
              <g transform="translate(560, 60)">
                <line x1="20" y1="40" x2="60" y2="15" strokeDasharray="2 3" />
                <line x1="60" y1="15" x2="100" y2="45" strokeDasharray="2 3" />
                <line x1="100" y1="45" x2="140" y2="10" strokeDasharray="2 3" />
                <line x1="140" y1="10" x2="180" y2="35" strokeDasharray="2 3" />
                <circle cx="20" cy="40" r="3" />
                <circle cx="60" cy="15" r="3.5" />
                <circle cx="100" cy="45" r="3" />
                <circle cx="140" cy="10" r="4" className="animate-ping" />
                <circle cx="180" cy="35" r="3" />
              </g>

              {/* Big Dipper (Center Left) */}
              <g transform="translate(80, 240) scale(0.9)">
                <line x1="40" y1="30" x2="90" y2="50" strokeDasharray="2 3" />
                <line x1="90" y1="50" x2="130" y2="80" strokeDasharray="2 3" />
                <line x1="130" y1="80" x2="180" y2="90" strokeDasharray="2 3" />
                <line x1="180" y1="90" x2="230" y2="60" strokeDasharray="2 3" />
                <line x1="230" y1="60" x2="240" y2="110" strokeDasharray="2 3" />
                <line x1="240" y1="110" x2="190" y2="130" strokeDasharray="2 3" />
                <line x1="190" y1="130" x2="180" y2="90" strokeDasharray="2 3" />
                <circle cx="40" cy="30" r="3" />
                <circle cx="90" cy="50" r="3" />
                <circle cx="130" cy="80" r="3.5" />
                <circle cx="180" cy="90" r="3" />
                <circle cx="230" cy="60" r="3.5" />
                <circle cx="240" cy="110" r="3" />
                <circle cx="190" cy="130" r="3.5" />
              </g>
            </g>

            {/* Shooting Star Trail (Diagonal streak) */}
            <g transform="translate(450, 180) rotate(35)" opacity="0.8">
              <line x1="0" y1="0" x2="180" y2="0" stroke="url(#meteor-trail)" strokeWidth="3" strokeLinecap="round" />
              <circle cx="180" cy="0" r="3" fill="#ffffff" />
            </g>

            {/* Floating Deep Space Astronaut Sketch (Center Right) */}
            <g transform="translate(1120, 420) scale(0.7) rotate(15)" stroke="#c084fc" strokeWidth="1.5" fill="none" opacity="0.45">
              {/* Helmet */}
              <circle cx="50" cy="30" r="22" strokeWidth="2" fill="#0f0d1b" />
              <ellipse cx="50" cy="30" rx="15" ry="12" fill="#38bdf8" fillOpacity="0.4" stroke="none" />
              {/* Body suit */}
              <rect x="30" y="52" width="40" height="45" rx="10" strokeWidth="2" fill="#241b47" />
              {/* Backpack oxygen tank */}
              <rect x="20" y="50" width="10" height="42" rx="3" strokeWidth="1.5" />
              {/* Arms */}
              <path d="M30 60 Q10 75 20 95" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M70 60 Q90 75 80 95" strokeWidth="2.5" strokeLinecap="round" />
              {/* Legs */}
              <path d="M40 97 L35 130" strokeWidth="3" strokeLinecap="round" />
              <path d="M60 97 L68 130" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      )}

      {/* 5. BOTANICAL GARDEN: MONSTERA, PALM FRONDS & GLOWING FIREFLIES */}
      {themeId === 'botanical-garden' && (
        <div className="absolute inset-0 opacity-[0.4] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Monstera Deliciosa Giant Leaf (Top Left) */}
            <g transform="translate(-40, -40) scale(1.2)" stroke="#0f8a5f" fill="#0f8a5f" fillOpacity="0.12" opacity="0.6">
              <path
                d="M60 20 C180 -10 280 120 220 280 C180 340 60 320 30 220 C10 160 20 80 60 20 Z"
                strokeWidth="2.5"
              />
              {/* Leaf spine */}
              <path d="M60 20 Q120 180 220 280" stroke="#0f8a5f" strokeWidth="3" fill="none" />
              {/* Leaf slits/holes */}
              <ellipse cx="120" cy="110" rx="30" ry="10" transform="rotate(35 120 110)" fill="#f4f9f5" stroke="#0f8a5f" strokeWidth="1.5" />
              <ellipse cx="150" cy="170" rx="35" ry="12" transform="rotate(25 150 170)" fill="#f4f9f5" stroke="#0f8a5f" strokeWidth="1.5" />
              <ellipse cx="170" cy="230" rx="30" ry="10" transform="rotate(15 170 230)" fill="#f4f9f5" stroke="#0f8a5f" strokeWidth="1.5" />
              <ellipse cx="90" cy="160" rx="25" ry="8" transform="rotate(-45 90 160)" fill="#f4f9f5" stroke="#0f8a5f" strokeWidth="1.5" />
            </g>

            {/* Cascading Palm Fronds (Top Right) */}
            <g transform="translate(1020, -50) scale(1.1)" stroke="#0f8a5f" strokeWidth="1.8" fill="none" opacity="0.55">
              <path d="M300 0 Q180 120 20 200" strokeWidth="3.5" stroke="#0b704c" />
              {[
                { x: 260, y: 30, len: 70, ang: -45 },
                { x: 220, y: 65, len: 85, ang: -40 },
                { x: 180, y: 95, len: 90, ang: -35 },
                { x: 140, y: 125, len: 85, ang: -30 },
                { x: 100, y: 155, len: 75, ang: -25 },
                { x: 60, y: 180, len: 65, ang: -20 },
              ].map((p, i) => (
                <path
                  key={i}
                  d={`M${p.x} ${p.y} q${p.len / 2} 20 ${p.len} 0`}
                  strokeLinecap="round"
                />
              ))}
            </g>

            {/* Greenhouse Arch Glass Windows (Center Background) */}
            <g transform="translate(480, 500) scale(1)" stroke="#0f8a5f" strokeWidth="1" fill="none" opacity="0.2">
              <path d="M0 240 L0 100 A160 160 0 0 1 320 100 L320 240" strokeWidth="2" />
              <line x1="80" y1="240" x2="80" y2="40" />
              <line x1="160" y1="240" x2="160" y2="20" strokeWidth="2" />
              <line x1="240" y1="240" x2="240" y2="40" />
              <line x1="0" y1="160" x2="320" y2="160" />
            </g>

            {/* Glowing Fireflies (Scattered with bioluminescence) */}
            <g fill="#84cc16" opacity="0.75">
              {[
                { cx: 320, cy: 180, r: 4 },
                { cx: 480, cy: 340, r: 3.5 },
                { cx: 860, cy: 260, r: 4.5 },
                { cx: 240, cy: 520, r: 3 },
                { cx: 980, cy: 620, r: 4 },
                { cx: 720, cy: 480, r: 3.5 },
              ].map((f, i) => (
                <g key={i}>
                  <circle cx={f.cx} cy={f.cy} r={f.r * 2.5} fill="#84cc16" fillOpacity="0.2" className="animate-ping" />
                  <circle cx={f.cx} cy={f.cy} r={f.r} fill="#a3e635" />
                </g>
              ))}
            </g>
          </svg>
        </div>
      )}

      {/* 6. SUNSET WAVES: GREAT OCEAN WAVE, GOLDEN SUN & FLYING SEAGULLS */}
      {themeId === 'sunset-waves' && (
        <div className="absolute inset-0 opacity-[0.42] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="sunset-sun-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#fb923c" stopOpacity="0.4" />
                <stop offset="80%" stopColor="#fdba74" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#fdf8f5" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Radiant Setting Sun (Center Horizon) */}
            <g transform="translate(620, 360)">
              <circle cx="100" cy="100" r="140" fill="url(#sunset-sun-glow)" />
              <circle cx="100" cy="100" r="65" fill="#ea580c" fillOpacity="0.3" stroke="#ea580c" strokeWidth="2" />
              {/* Concentric Horizon Rings */}
              <line x1="-150" y1="140" x2="350" y2="140" stroke="#ea580c" strokeWidth="2" strokeDasharray="12 6" opacity="0.4" />
              <line x1="-100" y1="160" x2="300" y2="160" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.3" />
            </g>

            {/* Ukiyo-e Great Ocean Waves (Rolling along bottom edge) */}
            <g transform="translate(0, 560) scale(1)" stroke="#ea580c" strokeWidth="2" fill="none" opacity="0.5">
              {/* Wave crest 1 */}
              <path
                d="M-40 180 Q120 180 220 120 Q290 80 320 30 Q330 0 310 20 Q280 40 250 80 Q180 130 80 140 Z"
                fill="#ea580c"
                fillOpacity="0.08"
              />
              {/* Wave crest 2 */}
              <path
                d="M300 200 Q500 200 620 130 Q700 80 740 20 Q750 -10 720 10 Q680 40 640 90 Q560 140 450 160 Z"
                fill="#ea580c"
                fillOpacity="0.1"
              />
              {/* Wave crest 3 */}
              <path
                d="M720 220 Q920 220 1060 140 Q1140 90 1180 30 Q1200 -5 1170 15 Q1120 50 1080 100 Q980 160 860 180 Z"
                fill="#ea580c"
                fillOpacity="0.08"
              />
            </g>

            {/* Flying Seagull Silhouettes in V-Formation */}
            <g stroke="#ea580c" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.55">
              <path d="M220 160 Q235 145 250 160 Q265 145 280 160" />
              <path d="M270 130 Q282 118 295 130 Q307 118 320 130" transform="scale(0.85)" />
              <path d="M320 170 Q330 160 340 170 Q350 160 360 170" transform="scale(0.75)" />
            </g>

            {/* Swaying Coastal Palm Silhouette (Right Border) */}
            <g transform="translate(1180, 160) scale(0.95)" stroke="#ea580c" strokeWidth="2" fill="none" opacity="0.45">
              <path d="M80 450 Q40 250 20 120" strokeWidth="8" strokeLinecap="round" stroke="#c2410c" />
              {/* Palm fronds */}
              <path d="M20 120 Q-60 80 -120 140" strokeWidth="3" />
              <path d="M20 120 Q-20 40 -60 0" strokeWidth="3" />
              <path d="M20 120 Q60 50 100 20" strokeWidth="3" />
              <path d="M20 120 Q80 100 120 160" strokeWidth="3" />
            </g>
          </svg>
        </div>
      )}

      {/* 7. CYBERPUNK NEON: NEO-TOKYO MATRIX, CIRCUIT HUD & GLITCH TELEMETRY */}
      {themeId === 'cyberpunk-neon' && (
        <div className="absolute inset-0 opacity-[0.55] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cyber-hex" x="0" y="0" width="40" height="69.28" patternUnits="userSpaceOnUse">
                <path
                  d="M40 0 L20 11.55 L0 0 L0 23.09 L20 34.64 L40 23.09 Z M0 46.19 L20 57.74 L40 46.19 L40 69.28 L20 80.83 L0 69.28 Z"
                  stroke="#06b6d4"
                  strokeWidth="0.6"
                  strokeOpacity="0.15"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cyber-hex)" />

            {/* High-tech HUD Targeting Reticle (Top Right) */}
            <g transform="translate(1080, 70) scale(0.95)" stroke="#06b6d4" fill="none" opacity="0.6">
              <circle cx="120" cy="120" r="100" strokeWidth="1.5" strokeDasharray="8 6" />
              <circle cx="120" cy="120" r="80" strokeWidth="1" strokeDasharray="3 4" />
              <circle cx="120" cy="120" r="40" strokeWidth="2" />
              <circle cx="120" cy="120" r="6" fill="#06b6d4" />
              {/* Corner brackets */}
              <path d="M10 40 L10 10 L40 10" strokeWidth="2.5" />
              <path d="M230 40 L230 10 L200 10" strokeWidth="2.5" />
              <path d="M10 200 L10 230 L40 230" strokeWidth="2.5" />
              <path d="M230 200 L230 230 L200 230" strokeWidth="2.5" />
              {/* Angle scale ticks */}
              <line x1="20" y1="120" x2="220" y2="120" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="120" y1="20" x2="120" y2="220" strokeWidth="1" strokeDasharray="4 4" />
            </g>

            {/* Cyberpunk City Skyline Silhouette (Bottom Edge) */}
            <g transform="translate(0, 580)" fill="#090d16" stroke="#06b6d4" strokeWidth="1.2" opacity="0.7">
              <polygon points="40,200 40,90 90,90 90,200" fill="#0c1424" />
              <polygon points="100,200 100,50 160,50 160,200" fill="#0e182c" />
              <line x1="130" y1="50" x2="130" y2="10" stroke="#ec4899" strokeWidth="2" />
              <polygon points="180,200 180,120 230,120 230,200" fill="#0c1424" />
              <polygon points="250,200 250,40 320,40 320,200" fill="#13213a" />
              <circle cx="285" cy="40" r="3" fill="#06b6d4" />
              <polygon points="340,200 340,110 410,110 410,200" fill="#0c1424" />
              <polygon points="430,200 430,70 510,70 510,200" fill="#0e182c" />
              {/* Digital Grid Horizon Line */}
              <line x1="0" y1="200" x2="1600" y2="200" stroke="#06b6d4" strokeWidth="2" />
            </g>

            {/* Glowing Circuit Traces with Pulse Nodes */}
            <g stroke="#06b6d4" strokeWidth="1.5" fill="none" opacity="0.5">
              <path d="M80 60 L140 60 L190 110 L320 110" />
              <circle cx="80" cy="60" r="4" fill="#06b6d4" />
              <circle cx="320" cy="110" r="4" fill="#06b6d4" />

              <path d="M40 340 L120 340 L160 380 L160 480" />
              <circle cx="40" cy="340" r="4" fill="#ec4899" stroke="#ec4899" />
              <circle cx="160" cy="480" r="4" fill="#ec4899" stroke="#ec4899" />
            </g>
          </svg>
        </div>
      )}

      {/* 8. LEMON CITRUS: TRANSLUCENT CITRUS SLICES, FIZZY BUBBLES & SUNBURST */}
      {themeId === 'lemon-citrus' && (
        <div className="absolute inset-0 opacity-[0.38] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Glowing Summer Sunburst (Top Right) */}
            <g transform="translate(1150, 40)" opacity="0.4">
              <circle cx="80" cy="80" r="70" fill="#fef08a" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                <line
                  key={i}
                  x1="80"
                  y1="80"
                  x2={80 + 130 * Math.cos((deg * Math.PI) / 180)}
                  y2={80 + 130 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                />
              ))}
            </g>

            {/* Juicy Sliced Lemon Wheel (Top Left) */}
            <g transform="translate(80, 70) scale(1.1)" stroke="#d97706" fill="none" opacity="0.55">
              {/* Outer Rind */}
              <circle cx="80" cy="80" r="70" strokeWidth="6" stroke="#f59e0b" fill="#fef3c7" fillOpacity="0.15" />
              <circle cx="80" cy="80" r="62" strokeWidth="2" stroke="#fbbf24" />
              <circle cx="80" cy="80" r="10" fill="#f59e0b" />
              {/* 8 Citrus Vesicle Wedges */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
                <path
                  key={idx}
                  d="M80 80 L73 24 A58 58 0 0 1 87 24 Z"
                  transform={`rotate(${angle} 80 80)`}
                  fill="#fef08a"
                  fillOpacity="0.4"
                  stroke="#f59e0b"
                  strokeWidth="1.2"
                />
              ))}
            </g>

            {/* Half Sliced Orange Wheel (Bottom Right) */}
            <g transform="translate(1080, 540) scale(1)" stroke="#ea580c" fill="none" opacity="0.5">
              <path d="M20 100 A80 80 0 0 1 180 100 Z" strokeWidth="5" stroke="#ea580c" fill="#ffedd5" fillOpacity="0.2" />
              <line x1="20" y1="100" x2="180" y2="100" strokeWidth="4" />
              {[30, 60, 90, 120, 150].map((angle, idx) => (
                <line
                  key={idx}
                  x1="100"
                  y1="100"
                  x2={100 + 70 * Math.cos((angle * Math.PI) / 180)}
                  y2={100 - 70 * Math.sin((angle * Math.PI) / 180)}
                  strokeWidth="1.5"
                />
              ))}
            </g>

            {/* Fresh Mint Leaves (Bottom Left) */}
            <g transform="translate(100, 580) scale(0.9)" stroke="#65a30d" fill="#84cc16" fillOpacity="0.2" opacity="0.5">
              <path d="M30 60 C30 10 90 20 110 50 C110 90 50 90 30 60 Z" strokeWidth="2" />
              <path d="M30 60 Q70 50 110 50" strokeWidth="1.8" fill="none" />
              <path d="M80 80 C80 50 130 55 145 75 C145 105 100 105 80 80 Z" strokeWidth="2" />
            </g>

            {/* Effervescent Rising Fizz Bubbles */}
            <g fill="none" stroke="#d97706" strokeWidth="1.2" opacity="0.4">
              {[
                { cx: 320, cy: 350, r: 6 },
                { cx: 335, cy: 280, r: 4 },
                { cx: 480, cy: 450, r: 8 },
                { cx: 720, cy: 380, r: 5 },
                { cx: 860, cy: 220, r: 7 },
                { cx: 940, cy: 480, r: 6 },
              ].map((b, i) => (
                <circle key={i} cx={b.cx} cy={b.cy} r={b.r} />
              ))}
            </g>
          </svg>
        </div>
      )}

      {/* 9. NORDIC FROST: AURORA BOREALIS, SNOWY PINES & CRYSTALLINE FLAKES */}
      {themeId === 'nordic-frost' && (
        <div className="absolute inset-0 opacity-[0.45] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="aurora-glow-1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.25" />
              </linearGradient>
            </defs>

            {/* Aurora Borealis Shimmering Wave (Upper Atmosphere) */}
            <g opacity="0.75">
              <path
                d="M-50 120 Q300 40 700 160 T1500 80 L1500 0 L-50 0 Z"
                fill="url(#aurora-glow-1)"
                filter="blur(16px)"
              />
              <path
                d="M-50 160 Q400 90 850 210 T1600 120 L1600 0 L-50 0 Z"
                fill="url(#aurora-glow-1)"
                filter="blur(24px)"
                opacity="0.6"
              />
            </g>

            {/* Nordic Snowy Pine Forest Silhouette (Bottom Edge) */}
            <g transform="translate(0, 560)" fill="#0284c7" fillOpacity="0.18" stroke="#0284c7" strokeWidth="1" opacity="0.6">
              {[
                { x: 30, h: 140, w: 50 },
                { x: 90, h: 180, w: 60 },
                { x: 160, h: 130, w: 45 },
                { x: 220, h: 160, w: 55 },
                { x: 300, h: 190, w: 65 },
                { x: 800, h: 150, w: 50 },
                { x: 860, h: 190, w: 65 },
                { x: 940, h: 140, w: 45 },
                { x: 1000, h: 175, w: 60 },
                { x: 1080, h: 130, w: 40 },
              ].map((tree, i) => (
                <g key={i} transform={`translate(${tree.x}, ${200 - tree.h})`}>
                  <polygon points={`${tree.w / 2},0 0,${tree.h * 0.4} ${tree.w * 0.2},${tree.h * 0.4} 0,${tree.h * 0.7} ${tree.w * 0.2},${tree.h * 0.7} 0,${tree.h} ${tree.w},${tree.h} ${tree.w * 0.8},${tree.h * 0.7} ${tree.w},${tree.h * 0.7} ${tree.w * 0.8},${tree.h * 0.4} ${tree.w},${tree.h * 0.4}`} />
                </g>
              ))}
            </g>

            {/* Intricate Geometric Snowflakes (Scattered) */}
            <g stroke="#0284c7" strokeWidth="1.2" strokeLinecap="round" opacity="0.45">
              {[
                { cx: 160, cy: 120, s: 0.9 },
                { cx: 480, cy: 220, s: 1.2 },
                { cx: 860, cy: 140, s: 1.0 },
                { cx: 1150, cy: 260, s: 1.1 },
                { cx: 340, cy: 460, s: 0.8 },
                { cx: 980, cy: 480, s: 0.95 },
              ].map((flake, i) => (
                <g key={i} transform={`translate(${flake.cx}, ${flake.cy}) scale(${flake.s})`}>
                  {[0, 60, 120].map((deg, idx) => (
                    <g key={idx} transform={`rotate(${deg})`}>
                      <line x1="-30" y1="0" x2="30" y2="0" />
                      <line x1="-20" y1="-8" x2="-15" y2="0" />
                      <line x1="-20" y1="8" x2="-15" y2="0" />
                      <line x1="20" y1="-8" x2="15" y2="0" />
                      <line x1="20" y1="8" x2="15" y2="0" />
                    </g>
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#0284c7" />
                </g>
              ))}
            </g>
          </svg>
        </div>
      )}

      {/* 10. CLASSIC ACADEMIA: GOTHIC ARCH WINDOWS, ANTIQUE COMPASS & DA VINCI MANUSCRIPT */}
      {themeId === 'classic-academia' && (
        <div className="absolute inset-0 opacity-[0.38] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Grand Gothic Library Cathedral Arched Window (Top Right) */}
            <g transform="translate(1080, 40) scale(0.9)" stroke="#854d0e" strokeWidth="1.5" fill="none" opacity="0.5">
              <path d="M20 280 L20 120 Q20 30 110 10 Q200 30 200 120 L200 280 Z" strokeWidth="3" />
              {/* Gothic tracery interior arches */}
              <path d="M20 120 Q20 70 70 50 Q110 70 110 120" strokeWidth="1.5" />
              <path d="M110 120 Q110 70 150 50 Q200 70 200 120" strokeWidth="1.5" />
              <circle cx="110" cy="55" r="28" strokeWidth="1.8" />
              <circle cx="110" cy="55" r="10" strokeWidth="1" />
              {/* Leaded glass window panes */}
              <line x1="20" y1="160" x2="200" y2="160" strokeDasharray="3 3" />
              <line x1="20" y1="200" x2="200" y2="200" strokeDasharray="3 3" />
              <line x1="20" y1="240" x2="200" y2="240" strokeDasharray="3 3" />
            </g>

            {/* Classical Armillary Sphere / Astrolabe (Top Left) */}
            <g transform="translate(80, 60) scale(0.95)" stroke="#854d0e" strokeWidth="1.2" fill="none" opacity="0.45">
              <circle cx="100" cy="100" r="80" strokeWidth="2" />
              <ellipse cx="100" cy="100" rx="80" ry="35" strokeWidth="1.5" />
              <ellipse cx="100" cy="100" rx="35" ry="80" strokeWidth="1.5" />
              <line x1="100" y1="10" x2="100" y2="190" strokeWidth="2" />
              <line x1="10" y1="100" x2="190" y2="100" strokeWidth="2" />
              <circle cx="100" cy="100" r="16" fill="#854d0e" fillOpacity="0.2" strokeWidth="1.5" />
            </g>

            {/* Vintage Navigational Compass Rose (Bottom Left) */}
            <g transform="translate(100, 520) scale(0.9)" stroke="#854d0e" strokeWidth="1" fill="none" opacity="0.4">
              <circle cx="120" cy="120" r="90" strokeWidth="1.8" />
              <circle cx="120" cy="120" r="75" strokeDasharray="2 3" />
              {/* 8-Point Compass Star */}
              <polygon points="120,30 126,110 120,120 114,110" fill="#854d0e" />
              <polygon points="120,30 120,120 114,110" fill="#713f12" />
              <polygon points="120,210 126,130 120,120 114,130" fill="#854d0e" />
              <polygon points="30,120 110,126 120,120 110,114" fill="#854d0e" />
              <polygon points="210,120 130,126 120,120 130,114" fill="#854d0e" />
              <text x="114" y="22" fill="#854d0e" fontSize="14" fontWeight="bold">N</text>
            </g>

            {/* Da Vinci Style Feather Quill & Parchment (Bottom Right) */}
            <g transform="translate(1080, 560) scale(0.95)" stroke="#854d0e" strokeWidth="1.5" fill="none" opacity="0.45">
              {/* Long curved feather quill */}
              <path d="M140 20 Q120 120 40 220" strokeWidth="3" stroke="#854d0e" strokeLinecap="round" />
              <path d="M140 20 C110 40 90 80 80 130 C90 130 110 90 140 20 Z" fill="#854d0e" fillOpacity="0.15" />
              <path d="M140 20 C150 50 140 90 120 140 C120 130 130 80 140 20 Z" fill="#854d0e" fillOpacity="0.15" />
              {/* Ink splatter drops */}
              <circle cx="35" cy="225" r="3.5" fill="#854d0e" />
              <circle cx="45" cy="235" r="2" fill="#854d0e" />
              <circle cx="25" cy="230" r="1.5" fill="#854d0e" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
