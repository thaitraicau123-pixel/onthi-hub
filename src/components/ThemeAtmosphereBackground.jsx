import React from 'react';

/**
 * ThemeAtmosphereBackground
 * Full-color, rich, expressive Messenger & Instagram style illustrated background wallpapers.
 * Features charming kawaii character mascots (like the Avocado theme in Messenger),
 * soft glowing auras, rich color fills, and delightful thematic personality.
 */
export default function ThemeAtmosphereBackground({ theme }) {
  if (!theme) return null;
  const themeId = theme.id || 'default';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 transition-opacity duration-700 ease-in-out"
    >
      {/* =========================================================================
          1. BOTANICAL GARDEN / AVOCADO THEME (EXACT MATCH TO MESSENGER AVOCADO CHAT)
          ========================================================================= */}
      {themeId === 'botanical-garden' && (
        <div className="absolute inset-0 opacity-[0.92] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Messenger Avocado Soft Halo Glow */}
              <filter id="avocado-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor="#7ca895" floodOpacity="0.55" />
              </filter>
              <filter id="seed-shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#2e1f13" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* AVOCADO 1: Large Sleepy Avocado (Top-Left, Peeking In - Just like Messenger) */}
            <g transform="translate(-20, -10) scale(1.15)" filter="url(#avocado-glow)">
              {/* Stem and Little Leaf */}
              <path d="M100 38 Q95 18 80 12" stroke="#4a3728" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M86 16 C68 12 62 25 78 30 C90 32 94 22 86 16 Z" fill="#466859" stroke="#355245" strokeWidth="1.5" />

              {/* Outer Dark Green Skin */}
              <path
                d="M100 35 C135 35 155 65 155 105 C155 135 140 155 170 195 C205 240 185 305 130 325 C65 345 20 300 15 235 C10 165 45 135 55 100 C65 60 70 35 100 35 Z"
                fill="#547b6e"
                stroke="#3d5e53"
                strokeWidth="4"
              />

              {/* Inner Light Mint / Cream Flesh */}
              <path
                d="M100 48 C128 48 143 72 143 108 C143 135 128 152 154 190 C184 230 166 288 120 306 C66 322 30 284 26 230 C22 170 50 144 60 110 C68 75 75 48 100 48 Z"
                fill="#9ec4b5"
              />

              {/* Rosy Cheeks */}
              <ellipse cx="68" cy="145" rx="10" ry="7" fill="#f8a5ab" fillOpacity="0.5" />
              <ellipse cx="132" cy="145" rx="10" ry="7" fill="#f8a5ab" fillOpacity="0.5" />

              {/* Sleepy Eyes (u_u / lashes) */}
              <path d="M72 135 Q82 146 92 135" stroke="#374d44" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M78 141 L76 146" stroke="#374d44" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M86 141 L88 146" stroke="#374d44" strokeWidth="2.5" strokeLinecap="round" />

              <path d="M108 135 Q118 146 128 135" stroke="#374d44" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M114 141 L112 146" stroke="#374d44" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M122 141 L124 146" stroke="#374d44" strokeWidth="2.5" strokeLinecap="round" />

              {/* Cute little mouth */}
              <path d="M98 152 Q100 156 102 152" stroke="#374d44" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Rich Brown Avocado Seed (with 3D highlight) */}
              <g filter="url(#seed-shadow)">
                <ellipse cx="100" cy="235" rx="42" ry="46" fill="#5c4028" stroke="#48321e" strokeWidth="2.5" />
                {/* 3D Crescent Highlight */}
                <path d="M80 205 C95 195 118 200 126 215 C118 206 100 204 86 215 Z" fill="#875f3d" />
                {/* Bottom Shadow Crescent */}
                <path d="M72 245 C80 270 120 270 128 245 C120 262 80 262 72 245 Z" fill="#3a2818" />
              </g>
            </g>

            {/* AVOCADO 2: Tilted Happy Avocado (Right Side, Peeking - Exact Messenger Layout) */}
            <g transform="translate(1080, 220) rotate(-14) scale(0.95)" filter="url(#avocado-glow)">
              <path d="M100 38 Q108 20 122 14" stroke="#4a3728" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <path d="M115 16 C132 12 138 25 122 30 C110 32 106 22 115 16 Z" fill="#466859" stroke="#355245" strokeWidth="1.5" />

              <path
                d="M100 35 C135 35 155 65 155 105 C155 135 140 155 170 195 C205 240 185 305 130 325 C65 345 20 300 15 235 C10 165 45 135 55 100 C65 60 70 35 100 35 Z"
                fill="#547b6e"
                stroke="#3d5e53"
                strokeWidth="4"
              />
              <path
                d="M100 48 C128 48 143 72 143 108 C143 135 128 152 154 190 C184 230 166 288 120 306 C66 322 30 284 26 230 C22 170 50 144 60 110 C68 75 75 48 100 48 Z"
                fill="#9ec4b5"
              />

              {/* Eyes with wink: Left wink, Right happy open eye */}
              <ellipse cx="70" cy="142" rx="9" ry="6" fill="#f8a5ab" fillOpacity="0.5" />
              <ellipse cx="130" cy="142" rx="9" ry="6" fill="#f8a5ab" fillOpacity="0.5" />

              <path d="M72 134 Q82 144 92 134" stroke="#374d44" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="118" cy="132" r="4.5" fill="#374d44" />
              <circle cx="120" cy="130" r="1.5" fill="#ffffff" />

              {/* Cute smiling mouth */}
              <path d="M94 148 Q100 158 106 148" stroke="#374d44" strokeWidth="2.8" strokeLinecap="round" fill="none" />

              {/* Seed */}
              <g filter="url(#seed-shadow)">
                <ellipse cx="100" cy="235" rx="42" ry="46" fill="#5c4028" stroke="#48321e" strokeWidth="2.5" />
                <path d="M80 205 C95 195 118 200 126 215 C118 206 100 204 86 215 Z" fill="#875f3d" />
              </g>
            </g>

            {/* AVOCADO 3: Bottom Left Avocado (Chilling with sleepy cute face) */}
            <g transform="translate(80, 520) rotate(12) scale(0.85)" filter="url(#avocado-glow)">
              <path d="M100 38 Q95 18 80 12" stroke="#4a3728" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <path d="M86 16 C68 12 62 25 78 30 C90 32 94 22 86 16 Z" fill="#466859" stroke="#355245" strokeWidth="1.5" />

              <path
                d="M100 35 C135 35 155 65 155 105 C155 135 140 155 170 195 C205 240 185 305 130 325 C65 345 20 300 15 235 C10 165 45 135 55 100 C65 60 70 35 100 35 Z"
                fill="#547b6e"
                stroke="#3d5e53"
                strokeWidth="4"
              />
              <path
                d="M100 48 C128 48 143 72 143 108 C143 135 128 152 154 190 C184 230 166 288 120 306 C66 322 30 284 26 230 C22 170 50 144 60 110 C68 75 75 48 100 48 Z"
                fill="#9ec4b5"
              />

              <ellipse cx="70" cy="144" rx="8" ry="6" fill="#f8a5ab" fillOpacity="0.5" />
              <ellipse cx="130" cy="144" rx="8" ry="6" fill="#f8a5ab" fillOpacity="0.5" />
              <path d="M72 135 Q82 145 92 135" stroke="#374d44" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M108 135 Q118 145 128 135" stroke="#374d44" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M98 150 Q100 154 102 150" stroke="#374d44" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              <g filter="url(#seed-shadow)">
                <ellipse cx="100" cy="235" rx="42" ry="46" fill="#5c4028" stroke="#48321e" strokeWidth="2.5" />
                <path d="M80 205 C95 195 118 200 126 215 C118 206 100 204 86 215 Z" fill="#875f3d" />
              </g>
            </g>

            {/* AVOCADO 4: Bottom Right Avocado (Peeking up from bottom) */}
            <g transform="translate(980, 560) rotate(-8) scale(0.8)" filter="url(#avocado-glow)">
              <path d="M100 38 Q108 20 122 14" stroke="#4a3728" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <path d="M115 16 C132 12 138 25 122 30 C110 32 106 22 115 16 Z" fill="#466859" />

              <path
                d="M100 35 C135 35 155 65 155 105 C155 135 140 155 170 195 C205 240 185 305 130 325 C65 345 20 300 15 235 C10 165 45 135 55 100 C65 60 70 35 100 35 Z"
                fill="#547b6e"
                stroke="#3d5e53"
                strokeWidth="4"
              />
              <path
                d="M100 48 C128 48 143 72 143 108 C143 135 128 152 154 190 C184 230 166 288 120 306 C66 322 30 284 26 230 C22 170 50 144 60 110 C68 75 75 48 100 48 Z"
                fill="#9ec4b5"
              />

              <ellipse cx="70" cy="144" rx="8" ry="6" fill="#f8a5ab" fillOpacity="0.5" />
              <ellipse cx="130" cy="144" rx="8" ry="6" fill="#f8a5ab" fillOpacity="0.5" />
              <circle cx="82" cy="135" r="4" fill="#374d44" />
              <circle cx="118" cy="135" r="4" fill="#374d44" />
              <path d="M96 148 Q100 156 104 148" stroke="#374d44" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              <g filter="url(#seed-shadow)">
                <ellipse cx="100" cy="235" rx="42" ry="46" fill="#5c4028" stroke="#48321e" strokeWidth="2.5" />
              </g>
            </g>

            {/* Floating Soft Ambient Green Halo Spheres (Messenger Style) */}
            <circle cx="480" cy="160" r="14" fill="#7ca895" fillOpacity="0.25" filter="url(#avocado-glow)" />
            <circle cx="780" cy="320" r="10" fill="#7ca895" fillOpacity="0.2" filter="url(#avocado-glow)" />
            <circle cx="340" cy="560" r="16" fill="#7ca895" fillOpacity="0.2" filter="url(#avocado-glow)" />
          </svg>
        </div>
      )}

      {/* =========================================================================
          2. LOFI CAFE: KAWAII BOBA TEA CUP & STEAMING COFFEE MUG MASCOTS
          ========================================================================= */}
      {themeId === 'lofi-cafe' && (
        <div className="absolute inset-0 opacity-[0.9] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="cafe-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#d97706" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Cute Boba Milk Tea Cup (Top-Left) */}
            <g transform="translate(60, 40) rotate(-6) scale(1)" filter="url(#cafe-glow)">
              {/* Pink Bent Straw */}
              <path d="M120 10 L120 40 L105 80" stroke="#f472b6" strokeWidth="12" strokeLinecap="round" fill="none" />
              {/* Cup Lid Dome */}
              <ellipse cx="100" cy="65" rx="60" ry="16" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2" />
              {/* Cup Body */}
              <path d="M45 65 L60 210 Q62 230 100 230 Q138 230 140 210 L155 65 Z" fill="#edd6be" stroke="#d5b292" strokeWidth="3" />
              {/* Rich Iced Milk Tea Layer */}
              <path d="M48 90 L59 205 Q62 225 100 225 Q138 225 141 205 L152 90 Z" fill="#d4976a" />
              {/* Milk swirl top */}
              <path d="M48 90 Q100 110 152 90 Q100 75 48 90 Z" fill="#fff7ed" />
              {/* Glossy Tapioca Boba Pearls */}
              {[
                { cx: 75, cy: 195, r: 10 },
                { cx: 98, cy: 205, r: 11 },
                { cx: 122, cy: 198, r: 10 },
                { cx: 85, cy: 175, r: 9.5 },
                { cx: 110, cy: 180, r: 10.5 },
                { cx: 130, cy: 178, r: 9 }
              ].map((p, i) => (
                <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#29180c" />
              ))}
              {/* Kawaii Face on Cup */}
              <circle cx="82" cy="135" r="4.5" fill="#382417" />
              <circle cx="84" cy="133" r="1.5" fill="#ffffff" />
              <circle cx="118" cy="135" r="4.5" fill="#382417" />
              <circle cx="120" cy="133" r="1.5" fill="#ffffff" />
              <ellipse cx="73" cy="144" rx="7" ry="5" fill="#fca5a5" fillOpacity="0.6" />
              <ellipse cx="127" cy="144" rx="7" ry="5" fill="#fca5a5" fillOpacity="0.6" />
              <path d="M95 142 Q100 150 105 142" stroke="#382417" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>

            {/* Steaming Coffee Mug Character (Bottom-Right) */}
            <g transform="translate(1080, 520) rotate(8) scale(0.95)" filter="url(#cafe-glow)">
              {/* Saucer */}
              <ellipse cx="100" cy="170" rx="75" ry="16" fill="#f5ede2" stroke="#d5c2ad" strokeWidth="2.5" />
              {/* Mug Body */}
              <path d="M45 80 Q40 145 100 150 Q160 145 155 80 Z" fill="#ffffff" stroke="#d5c2ad" strokeWidth="3" />
              {/* Handle */}
              <path d="M152 90 Q185 90 180 120 Q175 140 145 135" stroke="#d5c2ad" strokeWidth="6" strokeLinecap="round" fill="none" />
              {/* Coffee Surface & Heart Latte Art */}
              <ellipse cx="100" cy="80" rx="55" ry="14" fill="#6f3e1b" />
              <path d="M100 82 C93 74 80 74 80 82 C80 91 100 98 100 98 C100 98 120 91 120 82 C120 74 107 74 100 82 Z" fill="#fff7ed" />
              {/* Kawaii Sleepy Face */}
              <path d="M78 115 Q86 122 94 115" stroke="#6f3e1b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M106 115 Q114 122 122 115" stroke="#6f3e1b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <ellipse cx="70" cy="122" rx="7" ry="5" fill="#fca5a5" fillOpacity="0.6" />
              <ellipse cx="130" cy="122" rx="7" ry="5" fill="#fca5a5" fillOpacity="0.6" />
              {/* Rising Steam Heart */}
              <path d="M100 55 C90 40 75 40 75 52 C75 64 100 74 100 74 C100 74 125 64 125 52 C125 40 110 40 100 55 Z" fill="#f59e0b" fillOpacity="0.3" className="animate-steam-1" />
            </g>

            {/* Glazed Pink Strawberry Donut (Top-Right) */}
            <g transform="translate(1120, 60) scale(0.85)" filter="url(#cafe-glow)">
              <circle cx="80" cy="80" r="60" fill="#f3af65" stroke="#d48835" strokeWidth="3" />
              <circle cx="80" cy="80" r="50" fill="#f472b6" />
              <circle cx="80" cy="80" r="22" fill="#fbf7f0" stroke="#d48835" strokeWidth="2.5" />
              {/* Sprinkles */}
              <line x1="60" y1="45" x2="70" y2="40" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" />
              <line x1="95" y1="42" x2="105" y2="48" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
              <line x1="115" y1="75" x2="125" y2="70" stroke="#a7f3d0" strokeWidth="4" strokeLinecap="round" />
              <line x1="50" y1="95" x2="60" y2="102" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      )}

      {/* =========================================================================
          3. SAKURA BLOSSOM: KAWAII SLEEPING KITTY & MOCHI DANGO SKEWER
          ========================================================================= */}
      {themeId === 'sakura-blossom' && (
        <div className="absolute inset-0 opacity-[0.9] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="sakura-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#f472b6" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Adorable Chubby White Kitten Sleeping (Top-Left) */}
            <g transform="translate(60, 45) scale(1)" filter="url(#sakura-glow)">
              {/* Kitty Body */}
              <ellipse cx="110" cy="115" rx="75" ry="55" fill="#ffffff" stroke="#fbcfe8" strokeWidth="3" />
              {/* Fluffy Tail Curled */}
              <path d="M180 115 C200 90 205 135 175 140" stroke="#ffffff" strokeWidth="18" strokeLinecap="round" fill="none" />
              <path d="M180 115 C200 90 205 135 175 140" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Kitty Head */}
              <circle cx="75" cy="85" r="45" fill="#ffffff" stroke="#fbcfe8" strokeWidth="3" />
              {/* Left & Right Ears */}
              <polygon points="45,55 35,20 70,45" fill="#ffffff" stroke="#fbcfe8" strokeWidth="3" />
              <polygon points="50,50 42,28 65,46" fill="#fca5a5" />
              <polygon points="90,45 115,20 110,55" fill="#ffffff" stroke="#fbcfe8" strokeWidth="3" />
              <polygon points="95,46 110,28 105,50" fill="#fca5a5" />
              {/* Sakura Blossom on Ear */}
              <g transform="translate(108, 45) scale(0.7)">
                {[0, 72, 144, 216, 288].map((ang, i) => (
                  <path key={i} d="M0 0 C-6 -16 6 -16 0 -22 C-6 -16 6 -16 0 0" transform={`rotate(${ang})`} fill="#f472b6" />
                ))}
                <circle cx="0" cy="0" r="3" fill="#fbbf24" />
              </g>
              {/* Cute Sleeping Face: (- w -) */}
              <path d="M52 85 Q62 93 72 85" stroke="#472233" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M82 85 Q92 93 102 85" stroke="#472233" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <polygon points="76,92 78,95 80,92" fill="#f43f5e" />
              <path d="M74 97 Q77 101 80 97 Q83 101 86 97" stroke="#472233" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Whiskers & Blush */}
              <line x1="38" y1="88" x2="22" y2="86" stroke="#fbcfe8" strokeWidth="2" strokeLinecap="round" />
              <line x1="38" y1="94" x2="22" y2="98" stroke="#fbcfe8" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="48" cy="95" rx="7" ry="5" fill="#fca5a5" fillOpacity="0.6" />
              <ellipse cx="106" cy="95" rx="7" ry="5" fill="#fca5a5" fillOpacity="0.6" />
            </g>

            {/* Tri-Color Mochi Dango Skewer (Bottom-Right) */}
            <g transform="translate(1100, 520) rotate(-18) scale(0.9)" filter="url(#sakura-glow)">
              {/* Wooden Stick */}
              <line x1="30" y1="30" x2="160" y2="160" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
              {/* Pink Dango (Happy) */}
              <circle cx="60" cy="60" r="24" fill="#f472b6" stroke="#db2777" strokeWidth="2.5" />
              <circle cx="53" cy="58" r="2.5" fill="#831843" />
              <circle cx="67" cy="58" r="2.5" fill="#831843" />
              <path d="M57 65 Q60 69 63 65" stroke="#831843" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* White Dango (Wink) */}
              <circle cx="95" cy="95" r="24" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2.5" />
              <path d="M88 93 Q92 97 96 93" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="104" cy="93" r="2.5" fill="#4b5563" />
              {/* Green Matcha Dango (Sleepy) */}
              <circle cx="130" cy="130" r="24" fill="#86efac" stroke="#16a34a" strokeWidth="2.5" />
              <path d="M122 128 Q126 134 130 128" stroke="#14532d" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M134 128 Q138 134 142 128" stroke="#14532d" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>
      )}

      {/* =========================================================================
          4. COSMIC GALAXY: CHIBI ASTRONAUT & BABY SATURN MASCOT
          ========================================================================= */}
      {themeId === 'cosmic-galaxy' && (
        <div className="absolute inset-0 opacity-[0.95] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="cosmic-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor="#c084fc" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Chibi Astronaut Mascot (Top-Left) */}
            <g transform="translate(60, 50) rotate(8) scale(1.05)" filter="url(#cosmic-glow)">
              {/* Star Balloon Tether */}
              <path d="M110 50 Q130 20 150 10" stroke="#c084fc" strokeWidth="2" strokeDasharray="3 3" fill="none" />
              <polygon points="150,0 156,12 168,14 158,22 162,34 150,26 138,34 142,22 132,14 144,12" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
              {/* Backpack Oxygen Tank */}
              <rect x="35" y="65" width="22" height="60" rx="8" fill="#a855f7" stroke="#7e22ce" strokeWidth="2" />
              {/* Chubby Suit Body */}
              <rect x="50" y="70" width="55" height="60" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
              {/* Cute Bubble Helmet */}
              <circle cx="78" cy="50" r="36" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
              {/* Gold/Cyan Mirrored Visor with Smiley Face Reflection */}
              <ellipse cx="78" cy="50" rx="26" ry="20" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
              <ellipse cx="74" cy="46" rx="20" ry="12" fill="#0369a1" />
              {/* Visor Cute Reflection: (^ o ^) */}
              <path d="M66 48 Q70 54 74 48" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M78 48 Q82 54 86 48" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Waving Hand Mitten */}
              <circle cx="118" cy="75" r="11" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* Feet */}
              <rect x="52" y="125" width="22" height="18" rx="8" fill="#a855f7" />
              <rect x="80" y="125" width="22" height="18" rx="8" fill="#a855f7" />
            </g>

            {/* Baby Saturn Character (Bottom-Right) */}
            <g transform="translate(1080, 500) rotate(-14) scale(1)" filter="url(#cosmic-glow)">
              {/* Planet Rings Behind */}
              <ellipse cx="100" cy="100" rx="90" ry="26" fill="none" stroke="#f472b6" strokeWidth="10" strokeOpacity="0.4" transform="rotate(-15 100 100)" />
              {/* Purple Planet Body */}
              <circle cx="100" cy="100" r="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="3" />
              {/* Planet Rings Front */}
              <path d="M15 100 A90 26 0 0 0 185 100" fill="none" stroke="#f472b6" strokeWidth="10" strokeLinecap="round" transform="rotate(-15 100 100)" />
              {/* Kawaii Sleepy Face */}
              <path d="M80 94 Q88 102 96 94" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M106 94 Q114 102 122 94" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
              <ellipse cx="74" cy="102" rx="7" ry="5" fill="#ec4899" />
              <ellipse cx="128" cy="102" rx="7" ry="5" fill="#ec4899" />
              <path d="M98 106 Q101 110 104 106" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>
      )}

      {/* =========================================================================
          5. SUNSET WAVES: CHUBBY BABY WHALE & SUNNY SMILE MASCOT
          ========================================================================= */}
      {themeId === 'sunset-waves' && (
        <div className="absolute inset-0 opacity-[0.9] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="sunset-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#f97316" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Chubby Baby Blue Whale (Bottom-Left) */}
            <g transform="translate(60, 520) scale(1)" filter="url(#sunset-glow)">
              {/* Heart Water Sprout */}
              <path d="M90 35 C80 20 65 20 65 32 C65 44 90 55 90 55 C90 55 115 44 115 32 C115 20 100 20 90 35 Z" fill="#38bdf8" />
              <path d="M90 55 L90 70" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
              {/* Whale Body */}
              <path d="M20 120 C20 70 80 60 140 70 C190 80 210 110 240 90 C240 120 220 145 190 145 C140 145 70 150 20 120 Z" fill="#60a5fa" stroke="#3b82f6" strokeWidth="3" />
              {/* White Belly */}
              <path d="M40 125 C70 140 120 142 170 135 C140 145 90 145 40 125 Z" fill="#ffffff" />
              {/* Waving Flipper */}
              <ellipse cx="100" cy="125" rx="20" ry="10" fill="#3b82f6" transform="rotate(20 100 125)" />
              {/* Shiny Kawaii Eye & Rosy Cheek */}
              <circle cx="65" cy="98" r="5" fill="#1e3a8a" />
              <circle cx="67" cy="96" r="1.8" fill="#ffffff" />
              <ellipse cx="60" cy="108" rx="8" ry="5" fill="#fca5a5" fillOpacity="0.7" />
              <path d="M75 106 Q82 112 88 106" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>

            {/* Smiling Sun with Sunglasses (Top-Right) */}
            <g transform="translate(1120, 50) scale(0.95)" filter="url(#sunset-glow)">
              {/* Sun Body */}
              <circle cx="80" cy="80" r="55" fill="#f59e0b" stroke="#d97706" strokeWidth="3" />
              {/* Cool Dark Sunglasses */}
              <rect x="42" y="65" width="34" height="24" rx="6" fill="#1e293b" />
              <rect x="84" y="65" width="34" height="24" rx="6" fill="#1e293b" />
              <line x1="74" y1="72" x2="84" y2="72" stroke="#1e293b" strokeWidth="4" />
              <line x1="46" y1="70" x2="60" y2="84" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="88" y1="70" x2="102" y2="84" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              {/* Smile & Rosy Cheeks */}
              <ellipse cx="38" cy="96" rx="8" ry="5" fill="#ef4444" fillOpacity="0.5" />
              <ellipse cx="122" cy="96" rx="8" ry="5" fill="#ef4444" fillOpacity="0.5" />
              <path d="M70 102 Q80 114 90 102" stroke="#78350f" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>
      )}

      {/* =========================================================================
          6. CYBERPUNK NEON: RETRO CHIBI ROBOT & PIXEL HEART
          ========================================================================= */}
      {themeId === 'cyberpunk-neon' && (
        <div className="absolute inset-0 opacity-[0.95] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#06b6d4" floodOpacity="0.65" />
              </filter>
            </defs>

            {/* Chibi CRT Monitor Robot (Top-Left) */}
            <g transform="translate(60, 45) rotate(-6) scale(1)" filter="url(#neon-glow)">
              {/* Antenna */}
              <line x1="85" y1="35" x2="85" y2="15" stroke="#06b6d4" strokeWidth="4" />
              <circle cx="85" cy="12" r="7" fill="#ec4899" />
              {/* Monitor Head */}
              <rect x="35" y="35" width="100" height="85" rx="18" fill="#1e293b" stroke="#06b6d4" strokeWidth="3.5" />
              {/* Glowing CRT Face Screen */}
              <rect x="45" y="45" width="80" height="65" rx="10" fill="#0f172a" stroke="#0891b2" strokeWidth="2" />
              {/* Pixel Face: ( ^ o ^ ) */}
              <path d="M58 70 L65 62 L72 70" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M98 70 L105 62 L112 70" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <ellipse cx="85" cy="84" rx="8" ry="7" fill="#22d3ee" />
              {/* Pink Pixel Blush */}
              <rect x="54" y="80" width="8" height="5" fill="#f43f5e" />
              <rect x="108" y="80" width="8" height="5" fill="#f43f5e" />
              {/* Robot Body */}
              <rect x="55" y="125" width="60" height="45" rx="12" fill="#1e293b" stroke="#06b6d4" strokeWidth="3" />
              <circle cx="85" cy="148" r="8" fill="#ec4899" />
            </g>

            {/* Glowing Pixel Heart (Bottom-Right) */}
            <g transform="translate(1120, 520) scale(0.9)" filter="url(#neon-glow)">
              <path
                d="M50 20 L70 20 L70 30 L80 30 L80 20 L100 20 L100 40 L90 40 L90 50 L80 50 L80 60 L70 60 L70 70 L60 70 L60 60 L50 60 L50 50 L40 50 L40 40 L30 40 L30 20 L50 20 Z"
                fill="#ec4899"
                stroke="#f43f5e"
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>
      )}

      {/* =========================================================================
          7. LEMON CITRUS: CHUBBY SUNNY LEMON & JUICY ORANGE WHEEL MASCOTS
          ========================================================================= */}
      {themeId === 'lemon-citrus' && (
        <div className="absolute inset-0 opacity-[0.9] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="citrus-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#f59e0b" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Chubby Kawaii Lemon Character (Top-Left) */}
            <g transform="translate(60, 45) rotate(10) scale(1)" filter="url(#citrus-glow)">
              {/* Little Green Leaf */}
              <path d="M95 35 C110 15 130 25 125 40 C115 45 105 40 95 35 Z" fill="#84cc16" stroke="#65a30d" strokeWidth="2" />
              {/* Lemon Body */}
              <path
                d="M30 100 C30 60 70 35 100 35 C130 35 170 60 170 100 C170 140 130 165 100 165 C70 165 30 140 30 100 Z"
                fill="#fde047"
                stroke="#eab308"
                strokeWidth="3.5"
              />
              {/* Big Sparkling Kawaii Eyes */}
              <ellipse cx="78" cy="95" rx="7" ry="10" fill="#713f12" />
              <circle cx="76" cy="91" r="3" fill="#ffffff" />
              <ellipse cx="122" cy="95" rx="7" ry="10" fill="#713f12" />
              <circle cx="120" cy="91" r="3" fill="#ffffff" />
              {/* Blush & Big Smile */}
              <ellipse cx="65" cy="108" rx="8" ry="6" fill="#fb7185" fillOpacity="0.6" />
              <ellipse cx="135" cy="108" rx="8" ry="6" fill="#fb7185" fillOpacity="0.6" />
              <path d="M90 108 Q100 124 110 108 Z" fill="#e11d48" stroke="#be123c" strokeWidth="2" />
            </g>

            {/* Smiling Orange Wheel (Bottom-Right) */}
            <g transform="translate(1080, 520) scale(0.95)" filter="url(#citrus-glow)">
              {/* Orange Rind */}
              <circle cx="80" cy="80" r="65" fill="#ffedd5" stroke="#f97316" strokeWidth="6" />
              <circle cx="80" cy="80" r="54" fill="#fb923c" />
              <circle cx="80" cy="80" r="12" fill="#fff7ed" />
              {/* Pulp wedges */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
                <path key={i} d="M80 80 L75 32 A48 48 0 0 1 85 32 Z" transform={`rotate(${ang} 80 80)`} fill="#ea580c" />
              ))}
              {/* Cute Winking Face */}
              <circle cx="70" cy="74" r="3.5" fill="#ffffff" />
              <path d="M85 74 Q90 80 95 74" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>
      )}

      {/* =========================================================================
          8. NORDIC FROST: BABY PENGUIN IN WINTER EARMUFFS & SNOWFLAKES
          ========================================================================= */}
      {themeId === 'nordic-frost' && (
        <div className="absolute inset-0 opacity-[0.92] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="frost-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#38bdf8" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Baby Penguin in Earmuffs & Scarf (Bottom-Left) */}
            <g transform="translate(60, 500) scale(1.05)" filter="url(#frost-glow)">
              {/* Fluffy Earmuff Band */}
              <path d="M45 55 Q75 15 105 55" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="42" cy="58" r="14" fill="#fb7185" stroke="#e11d48" strokeWidth="2" />
              <circle cx="108" cy="58" r="14" fill="#fb7185" stroke="#e11d48" strokeWidth="2" />
              {/* Penguin Body */}
              <ellipse cx="75" cy="115" rx="42" ry="52" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
              {/* White Belly */}
              <ellipse cx="75" cy="120" rx="28" ry="38" fill="#ffffff" />
              {/* Striped Winter Scarf */}
              <rect x="45" y="85" width="60" height="16" rx="6" fill="#f43f5e" />
              <line x1="58" y1="85" x2="58" y2="101" stroke="#ffffff" strokeWidth="4" />
              <line x1="75" y1="85" x2="75" y2="101" stroke="#ffffff" strokeWidth="4" />
              <line x1="92" y1="85" x2="92" y2="101" stroke="#ffffff" strokeWidth="4" />
              {/* Happy Kawaii Eyes: (> <) */}
              <path d="M58 64 L66 69 L58 74" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M92 64 L84 69 L92 74" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* Orange Beak & Blush */}
              <polygon points="70,72 80,72 75,80" fill="#f97316" />
              <ellipse cx="54" cy="74" rx="6" ry="4" fill="#fb7185" fillOpacity="0.7" />
              <ellipse cx="96" cy="74" rx="6" ry="4" fill="#fb7185" fillOpacity="0.7" />
              {/* Orange Feet */}
              <ellipse cx="62" cy="165" rx="10" ry="6" fill="#f97316" />
              <ellipse cx="88" cy="165" rx="10" ry="6" fill="#f97316" />
            </g>

            {/* Sleepy Polar Bear Cub (Top-Right) */}
            <g transform="translate(1120, 50) scale(0.9)" filter="url(#frost-glow)">
              <circle cx="80" cy="80" r="45" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
              <circle cx="48" cy="50" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="50" cy="52" r="7" fill="#fbcfe8" />
              <circle cx="112" cy="50" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="110" cy="52" r="7" fill="#fbcfe8" />
              {/* Sleepy Eyes & Snout */}
              <path d="M60 80 Q66 86 72 80" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M88 80 Q94 86 100 80" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <ellipse cx="80" cy="92" rx="16" ry="11" fill="#f1f5f9" />
              <ellipse cx="80" cy="88" rx="6" ry="4" fill="#334155" />
            </g>
          </svg>
        </div>
      )}

      {/* =========================================================================
          9. CLASSIC ACADEMIA: SCHOLAR OWL MASCOT & STACK OF KAWAII BOOKS
          ========================================================================= */}
      {themeId === 'classic-academia' && (
        <div className="absolute inset-0 opacity-[0.9] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="academia-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#d97706" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Scholar Owl Mascot (Top-Left) */}
            <g transform="translate(60, 40) scale(1)" filter="url(#academia-glow)">
              {/* Graduation Mortarboard Cap */}
              <polygon points="80,15 130,30 80,45 30,30" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
              <rect x="62" y="38" width="36" height="15" rx="3" fill="#1e293b" />
              {/* Gold Tassel */}
              <path d="M80 30 Q115 35 125 55" stroke="#eab308" strokeWidth="2.5" fill="none" />
              <circle cx="125" cy="57" r="4" fill="#eab308" />
              {/* Owl Body */}
              <ellipse cx="80" cy="95" rx="42" ry="46" fill="#854d0e" stroke="#713f12" strokeWidth="3" />
              <ellipse cx="80" cy="105" rx="28" ry="32" fill="#fef3c7" />
              {/* Big Round Glasses & Eyes */}
              <circle cx="62" cy="78" r="16" fill="#ffffff" stroke="#eab308" strokeWidth="3" />
              <circle cx="62" cy="78" r="6" fill="#451a03" />
              <circle cx="64" cy="76" r="2" fill="#ffffff" />
              <circle cx="98" cy="78" r="16" fill="#ffffff" stroke="#eab308" strokeWidth="3" />
              <circle cx="98" cy="78" r="6" fill="#451a03" />
              <circle cx="100" cy="76" r="2" fill="#ffffff" />
              <line x1="78" y1="78" x2="82" y2="78" stroke="#eab308" strokeWidth="3" />
              {/* Beak & Blush */}
              <polygon points="76,86 84,86 80,94" fill="#ea580c" />
              <ellipse cx="50" cy="92" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.7" />
              <ellipse cx="110" cy="92" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.7" />
            </g>

            {/* Stack of Happy Antique Books (Bottom-Right) */}
            <g transform="translate(1080, 520) scale(0.95)" filter="url(#academia-glow)">
              {/* Bottom Book (Navy) with Kawaii Face */}
              <rect x="20" y="110" width="120" height="30" rx="5" fill="#1e3a8a" stroke="#172554" strokeWidth="2.5" />
              <rect x="35" y="115" width="100" height="20" rx="3" fill="#fef3c7" />
              {/* Cute Smiling Face on Bottom Book */}
              <circle cx="70" cy="125" r="2.5" fill="#1e3a8a" />
              <circle cx="95" cy="125" r="2.5" fill="#1e3a8a" />
              <path d="M80 126 Q82 130 85 126" stroke="#1e3a8a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              {/* Middle Book (Emerald) */}
              <rect x="30" y="85" width="105" height="26" rx="5" fill="#065f46" stroke="#064e3b" strokeWidth="2.5" />
              <rect x="42" y="90" width="88" height="16" rx="3" fill="#fef3c7" />
              {/* Top Book (Burgundy) */}
              <rect x="40" y="62" width="90" height="24" rx="5" fill="#881337" stroke="#4c0519" strokeWidth="2.5" />
              <rect x="50" y="67" width="76" height="14" rx="3" fill="#fef3c7" />
            </g>
          </svg>
        </div>
      )}

      {/* =========================================================================
          10. NOTION MINIMALIST: KAWAII NOTION NOTEBOOK & CHILL TEACUP
          ========================================================================= */}
      {themeId === 'default' && (
        <div className="absolute inset-0 opacity-[0.88] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="notion-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#3b82f6" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Cute Notion Notebook Mascot (Top-Left) */}
            <g transform="translate(60, 45) rotate(-6) scale(1)" filter="url(#notion-glow)">
              {/* Yellow Pencil Tucked behind ear */}
              <polygon points="120,20 135,35 70,100 55,85" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
              <polygon points="120,20 135,35 142,28 127,13" fill="#f43f5e" />
              {/* Notebook Body */}
              <rect x="40" y="40" width="85" height="110" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
              {/* Bookmark Ribbon */}
              <path d="M55 40 L55 75 L62 68 L70 75 L70 40 Z" fill="#ef4444" />
              {/* Spiral Binder Rings */}
              {[50, 70, 90, 110, 130].map((y, i) => (
                <rect key={i} x="34" y={y} width="12" height="6" rx="3" fill="#94a3b8" />
              ))}
              {/* Kawaii Face: (• ‿ •) */}
              <circle cx="72" cy="95" r="4.5" fill="#1e293b" />
              <circle cx="74" cy="93" r="1.5" fill="#ffffff" />
              <circle cx="102" cy="95" r="4.5" fill="#1e293b" />
              <circle cx="104" cy="93" r="1.5" fill="#ffffff" />
              <ellipse cx="65" cy="103" rx="7" ry="5" fill="#fca5a5" fillOpacity="0.6" />
              <ellipse cx="109" cy="103" rx="7" ry="5" fill="#fca5a5" fillOpacity="0.6" />
              <path d="M82 104 Q87 112 92 104" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>

            {/* Cute Steaming Teacup (Bottom-Right) */}
            <g transform="translate(1100, 520) scale(0.95)" filter="url(#notion-glow)">
              <ellipse cx="80" cy="130" rx="60" ry="14" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2.5" />
              <path d="M35 70 Q30 115 80 120 Q130 115 125 70 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
              <path d="M123 78 Q145 78 140 100 Q135 112 115 110" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              {/* Cute Winking Face */}
              <circle cx="65" cy="92" r="3.5" fill="#334155" />
              <path d="M85 92 Q90 98 95 92" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <ellipse cx="58" cy="98" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.6" />
              <ellipse cx="102" cy="98" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.6" />
              <path d="M72 102 Q76 106 80 102" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
