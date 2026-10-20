import React, { useEffect, useCallback } from 'react';
import { playSound } from '../utils/storage';

/**
 * GameQuestDock - Cartoon 3D Game / Arcade UI Component
 * Exact 1:1 reproduction of the reference screenshot featuring:
 * 1. Top Diamond Currency Pill:
 *    - Deep purple capsule with dark polka dots
 *    - Oversized tilted blue diamond on the left with 4-point star sparkle and flare streaks
 *    - Chunky white bubble counter with heavy black stroke
 *    - Lime-green squircle button with bold white '+'
 * 2. 2x2 Grid of 4 Squircle 3D Game Action Cards:
 *    - Floating Keycaps on top-left: [U], [B], [M], [H] (white puffy squircles with black letters)
 *    - Inner cushion line (border-white/35) and polka dots
 *    - Blue Card (U): Cartoon steel sword with purple hilt & golden crossguard/pommel -> "UNITS"
 *    - Pink Card (B): Cartoon peppermint candy with red spiral swirl & wrapper frills -> "ITEMS"
 *    - Green Card (M): Hot pink waving flag on candy-striped pole with gold ball -> "AREAS"
 *    - Orange Card (H): Floating "DEAL!" ribbon + Pyramid pile of cut blue diamonds with sparkles -> "SHOP"
 */
export default function GameQuestDock({
  walletBalance = 100,
  onOpenFlashcards,
  onOpenQuiz,
  onOpenStudyRoom,
  onOpenShop,
  onOpenWallet,
  className = ''
}) {
  const handleUnitsClick = useCallback(() => {
    playSound('flip');
    if (onOpenFlashcards) onOpenFlashcards();
  }, [onOpenFlashcards]);

  const handleItemsClick = useCallback(() => {
    playSound('click');
    if (onOpenQuiz) onOpenQuiz();
  }, [onOpenQuiz]);

  const handleAreasClick = useCallback(() => {
    playSound('click');
    if (onOpenStudyRoom) onOpenStudyRoom();
  }, [onOpenStudyRoom]);

  const handleShopClick = useCallback(() => {
    playSound('success');
    if (onOpenShop) onOpenShop();
  }, [onOpenShop]);

  const handlePlusClick = useCallback((e) => {
    e.stopPropagation();
    playSound('success');
    if (onOpenWallet) onOpenWallet();
  }, [onOpenWallet]);

  // Global Hotkeys: U, B, M, H
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName;
      const isInput =
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        activeTag === 'SELECT' ||
        document.activeElement?.isContentEditable;
      if (isInput) return;

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();
      if (key === 'u') {
        e.preventDefault();
        handleUnitsClick();
      } else if (key === 'b') {
        e.preventDefault();
        handleItemsClick();
      } else if (key === 'm') {
        e.preventDefault();
        handleAreasClick();
      } else if (key === 'h') {
        e.preventDefault();
        handleShopClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUnitsClick, handleItemsClick, handleAreasClick, handleShopClick]);

  return (
    <div className={`w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center gap-4 select-none ${className}`}>
      
      {/* =========================================================================
          TOP CURRENCY DIAMOND PILL (DEEP PURPLE + OVERSIZED DIAMOND + GREEN '+')
          ========================================================================= */}
      <div className="relative w-full max-w-[320px] sm:max-w-[350px] h-14 sm:h-16 rounded-full bg-gradient-to-b from-[#6925a9] via-[#4d1483] to-[#340b5c] border-[3.5px] border-[#140526] shadow-[0_5px_0_#140526,0_10px_22px_rgba(0,0,0,0.4)] flex items-center justify-between px-3 sm:px-4">
        {/* Subtle darker polka dots on pill */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute left-[38%] top-[25%] w-4 h-4 rounded-full bg-black/15" />
          <div className="absolute left-[58%] top-[55%] w-3.5 h-3.5 rounded-full bg-black/15" />
          <div className="absolute left-[75%] top-[20%] w-4 h-4 rounded-full bg-black/15" />
        </div>

        {/* Left: Oversized Tilted Blue Diamond with Sparkles & Flares */}
        <div className="relative -ml-3 sm:-ml-4 -mt-1 shrink-0 flex items-center justify-center">
          {/* Yellow Speed Flares behind diamond */}
          <div className="absolute -left-3 top-1 flex flex-col space-y-1.5 pointer-events-none opacity-90">
            <div className="w-3.5 h-1.5 bg-amber-300 rounded-full rotate-[-15deg] shadow-sm" />
            <div className="w-4 h-1.5 bg-amber-400 rounded-full rotate-[-10deg] shadow-sm ml-1" />
          </div>

          <svg
            className="w-14 h-14 sm:w-16 sm:h-16 -rotate-6 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Crown & Pavilion Facets */}
            <path d="M16 22L32 8L48 22L32 56L16 22Z" fill="#0284c7" />
            <path d="M32 8L16 22H32V8Z" fill="#38bdf8" />
            <path d="M32 8L48 22H32V8Z" fill="#7dd3fc" />
            <path d="M16 22L32 56V22H16Z" fill="#0369a1" />
            <path d="M48 22L32 56V22H48Z" fill="#0284c7" />
            {/* Top Shine highlight */}
            <path d="M26 14L32 8L38 14L32 19L26 14Z" fill="#ffffff" fillOpacity="0.85" />
            {/* Chunky Outer & Inner Outlines */}
            <path
              d="M16 22L32 8L48 22L32 56L16 22Z"
              stroke="#141416"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            <path d="M16 22H48" stroke="#141416" strokeWidth="3" />
            <path d="M32 8V56" stroke="#141416" strokeWidth="3" />
          </svg>

          {/* 4-Point Star Sparkle on Diamond */}
          <span
            className="absolute top-1 right-2 text-white text-base font-black pointer-events-none animate-pulse"
            style={{ textShadow: '0 0 6px rgba(255,255,255,0.9)' }}
          >
            ✦
          </span>
        </div>

        {/* Center: White Chunky Number with Heavy Dark Stroke */}
        <div className="flex-1 text-center px-1">
          <span className="game-cartoon-pill-title text-2xl sm:text-3xl tracking-wider">
            {typeof walletBalance === 'number' ? walletBalance.toLocaleString('vi-VN') : walletBalance}
          </span>
        </div>

        {/* Right: Tactile Lime-Green Squircle '+' Button */}
        <button
          type="button"
          onClick={handlePlusClick}
          title="Nạp thêm xu / Quản lý ví (Nhấn để nạp)"
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-[#7ce029] via-[#54c414] to-[#3ca009] border-[3px] border-[#140526] shadow-[0_3px_0_#140526,0_5px_8px_rgba(0,0,0,0.3)] flex items-center justify-center shrink-0 cursor-pointer active:translate-y-1 active:shadow-[0_1px_0_#140526] transition-transform"
          aria-label="Nạp xu"
        >
          <span className="text-white font-black text-2xl sm:text-3xl leading-none drop-shadow-[0_2px_0_#140526] -mt-0.5">
            +
          </span>
        </button>
      </div>

      {/* =========================================================================
          2x2 GRID OF 4 SQUIRCLE 3D GAME ACTION CARDS
          [U] UNITS (Blue)   |   [B] ITEMS (Pink)
          [M] AREAS (Green)  |   [H] SHOP (Orange)
          ========================================================================= */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4.5 w-full max-w-[340px] sm:max-w-[370px]">
        
        {/* ================= CARD 1: BLUE [U] - UNITS ================= */}
        <button
          type="button"
          onClick={handleUnitsClick}
          className="relative rounded-[28px] border-[3.5px] border-[#141416] p-3 aspect-square flex flex-col items-center justify-between bg-gradient-to-b from-[#56b4f7] via-[#338be0] to-[#1f73ce] shadow-[0_8px_0_#0f0f11,0_14px_20px_rgba(0,0,0,0.35)] cursor-pointer active:translate-y-1.5 active:shadow-[0_2px_0_#0f0f11] transition-transform group outline-none"
          title="Nhấn phím [U] hoặc click để mở Bộ Thẻ (UNITS)"
        >
          {/* Inner Cushion Ring */}
          <div className="game-inner-cushion" />

          {/* Polka dots texture */}
          <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
            <div className="absolute left-[20%] top-[25%] w-3.5 h-3.5 rounded-full bg-black/10" />
            <div className="absolute right-[22%] top-[35%] w-4 h-4 rounded-full bg-black/10" />
            <div className="absolute left-[28%] bottom-[30%] w-3 h-3 rounded-full bg-black/10" />
            <div className="absolute right-[25%] bottom-[25%] w-3.5 h-3.5 rounded-full bg-black/10" />
          </div>

          {/* Floating Keycap: U (Top-Left) */}
          <div className="absolute -top-2.5 -left-2.5 z-20 w-8 h-8 sm:w-9 sm:h-9 game-keycap flex items-center justify-center">
            U
          </div>

          {/* Center Graphic: Authentic Cartoon Sword */}
          <div className="my-auto relative flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
            <svg
              className="w-16 h-16 sm:w-18 sm:h-18 drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="rotate(45, 32, 32)">
                {/* Blade Right Half (Shaded) */}
                <path d="M32 6 L38 14 L38 36 L32 36 Z" fill="#cbd5e1" />
                {/* Blade Left Half (Highlight) */}
                <path d="M32 6 L26 14 L26 36 L32 36 Z" fill="#ffffff" />
                {/* Center Spine line */}
                <line x1="32" y1="7" x2="32" y2="36" stroke="#94a3b8" strokeWidth="1.5" />
                {/* Blade Outer Outline */}
                <path d="M32 6 L38 14 L38 36 L26 36 L26 14 Z" stroke="#141416" strokeWidth="3" strokeLinejoin="round" />

                {/* Crossguard (Perpendicular Golden Rounded Bar) */}
                <rect x="16" y="35" width="32" height="7" rx="3.5" fill="#fbbf24" stroke="#141416" strokeWidth="3" />
                {/* Crossguard Highlight */}
                <line x1="20" y1="37" x2="44" y2="37" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />

                {/* Grip (Purple Handle) */}
                <rect x="28.5" y="42" width="7" height="11" rx="2" fill="#8b5cf6" stroke="#141416" strokeWidth="2.8" />
                {/* Grip Wraps */}
                <line x1="29.5" y1="46" x2="34.5" y2="46" stroke="#6d28d9" strokeWidth="1.5" />
                <line x1="29.5" y1="49.5" x2="34.5" y2="49.5" stroke="#6d28d9" strokeWidth="1.5" />

                {/* Pommel (Golden Round Ball) */}
                <circle cx="32" cy="56" r="5" fill="#fbbf24" stroke="#141416" strokeWidth="2.8" />
                {/* Pommel Specular Highlight */}
                <circle cx="30.5" cy="54.5" r="1.2" fill="#ffffff" />
              </g>

              {/* Sparkle Star near tip */}
              <text x="46" y="14" fill="#ffffff" fontSize="12" fontWeight="bold">✦</text>
            </svg>
          </div>

          {/* Bottom Label: UNITS */}
          <div className="w-full text-center z-10 -mb-0.5">
            <span className="game-cartoon-title text-lg sm:text-xl">
              UNITS
            </span>
          </div>
        </button>

        {/* ================= CARD 2: PINK [B] - ITEMS ================= */}
        <button
          type="button"
          onClick={handleItemsClick}
          className="relative rounded-[28px] border-[3.5px] border-[#141416] p-3 aspect-square flex flex-col items-center justify-between bg-gradient-to-b from-[#f85694] via-[#e22f77] to-[#c91c5c] shadow-[0_8px_0_#0f0f11,0_14px_20px_rgba(0,0,0,0.35)] cursor-pointer active:translate-y-1.5 active:shadow-[0_2px_0_#0f0f11] transition-transform group outline-none"
          title="Nhấn phím [B] hoặc click để mở Đề Thi (ITEMS)"
        >
          {/* Inner Cushion Ring */}
          <div className="game-inner-cushion" />

          {/* Polka dots texture */}
          <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
            <div className="absolute left-[20%] top-[25%] w-3.5 h-3.5 rounded-full bg-black/10" />
            <div className="absolute right-[22%] top-[35%] w-4 h-4 rounded-full bg-black/10" />
            <div className="absolute left-[28%] bottom-[30%] w-3 h-3 rounded-full bg-black/10" />
            <div className="absolute right-[25%] bottom-[25%] w-3.5 h-3.5 rounded-full bg-black/10" />
          </div>

          {/* Floating Keycap: B (Top-Left) */}
          <div className="absolute -top-2.5 -left-2.5 z-20 w-8 h-8 sm:w-9 sm:h-9 game-keycap flex items-center justify-center">
            B
          </div>

          {/* Center Graphic: Authentic Cartoon Peppermint Candy */}
          <div className="my-auto relative flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
            <svg
              className="w-16 h-16 sm:w-18 sm:h-18 drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath id="candy-disc-clip">
                  <circle cx="32" cy="32" r="15.5" />
                </clipPath>
              </defs>

              <g transform="rotate(-6, 32, 32)">
                {/* Left Wrapper Frill */}
                <path
                  d="M19 32 L7 20 C8.5 24 7 28 8.5 32 C7 36 8.5 40 7 44 L19 32 Z"
                  fill="#f472b6"
                  stroke="#141416"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                <path d="M10 24 L17 31" stroke="#db2777" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M10 40 L17 33" stroke="#db2777" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M8.5 32 L18 32" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

                {/* Right Wrapper Frill */}
                <path
                  d="M45 32 L57 20 C55.5 24 57 28 55.5 32 C57 36 55.5 40 57 44 L45 32 Z"
                  fill="#f472b6"
                  stroke="#141416"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                <path d="M54 24 L47 31" stroke="#db2777" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M54 40 L47 33" stroke="#db2777" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M55.5 32 L46 32" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

                {/* Central Round Candy Disc Base */}
                <circle
                  cx="32"
                  cy="32"
                  r="15.5"
                  fill="#ffffff"
                  stroke="#141416"
                  strokeWidth="3.2"
                />

                {/* Clipped Peppermint Spiral Swirls */}
                <g clipPath="url(#candy-disc-clip)">
                  <path
                    d="M32 32 C35 24, 30 18, 32 16 C37 16, 43 20, 43 26 C43 30, 37 32, 32 32 Z"
                    fill="#e11d48"
                  />
                  <path
                    d="M32 32 C29 40, 34 46, 32 48 C27 48, 21 44, 21 38 C21 34, 27 32, 32 32 Z"
                    fill="#e11d48"
                  />
                  <path
                    d="M32 32 C24 29, 18 34, 16 32 C16 27, 20 21, 26 21 C30 21, 32 27, 32 32 Z"
                    fill="#e11d48"
                  />
                  <path
                    d="M32 32 C40 35, 46 30, 48 32 C48 37, 44 43, 38 43 C34 43, 32 37, 32 32 Z"
                    fill="#e11d48"
                  />
                  <circle cx="32" cy="32" r="3" fill="#e11d48" />

                  {/* Gloss Highlight Arc */}
                  <path
                    d="M22 22 A 12 12 0 0 1 36 17"
                    stroke="#ffffff"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                  <circle cx="21" cy="24" r="1.5" fill="#ffffff" />
                </g>

                {/* Re-stroke outer disc for crisp border */}
                <circle
                  cx="32"
                  cy="32"
                  r="15.5"
                  stroke="#141416"
                  strokeWidth="3.2"
                  fill="none"
                />
              </g>

              {/* Sparkle Star near Candy */}
              <text x="47" y="16" fill="#ffffff" fontSize="12" fontWeight="bold">✦</text>
            </svg>
          </div>

          {/* Bottom Label: ITEMS */}
          <div className="w-full text-center z-10 -mb-0.5">
            <span className="game-cartoon-title text-lg sm:text-xl">
              ITEMS
            </span>
          </div>
        </button>

        {/* ================= CARD 3: GREEN [M] - AREAS ================= */}
        <button
          type="button"
          onClick={handleAreasClick}
          className="relative rounded-[28px] border-[3.5px] border-[#141416] p-3 aspect-square flex flex-col items-center justify-between bg-gradient-to-b from-[#62d72d] via-[#43be17] to-[#2ea808] shadow-[0_8px_0_#0f0f11,0_14px_20px_rgba(0,0,0,0.35)] cursor-pointer active:translate-y-1.5 active:shadow-[0_2px_0_#0f0f11] transition-transform group outline-none"
          title="Nhấn phím [M] hoặc click để mở Phòng Học (AREAS)"
        >
          {/* Inner Cushion Ring */}
          <div className="game-inner-cushion" />

          {/* Polka dots texture */}
          <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
            <div className="absolute left-[20%] top-[25%] w-3.5 h-3.5 rounded-full bg-black/10" />
            <div className="absolute right-[22%] top-[35%] w-4 h-4 rounded-full bg-black/10" />
            <div className="absolute left-[28%] bottom-[30%] w-3 h-3 rounded-full bg-black/10" />
            <div className="absolute right-[25%] bottom-[25%] w-3.5 h-3.5 rounded-full bg-black/10" />
          </div>

          {/* Floating Keycap: M (Top-Left) */}
          <div className="absolute -top-2.5 -left-2.5 z-20 w-8 h-8 sm:w-9 sm:h-9 game-keycap flex items-center justify-center">
            M
          </div>

          {/* Center Graphic: Authentic Cartoon Pink Waving Flag on Candy-Striped Pole */}
          <div className="my-auto relative flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
            <svg
              className="w-16 h-16 sm:w-18 sm:h-18 drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath id="pole-clip">
                  <rect x="18" y="12" width="6" height="42" rx="3" />
                </clipPath>
              </defs>

              {/* Grassy Ground Mound at Base */}
              <ellipse cx="21" cy="54" rx="10" ry="4" fill="#15803d" stroke="#141416" strokeWidth="2.5" />
              <ellipse cx="21" cy="53" rx="7" ry="2" fill="#22c55e" />

              {/* Diagonal Candy-Striped Flagpole */}
              <rect x="18" y="12" width="6" height="42" rx="3" fill="#ffffff" stroke="#141416" strokeWidth="2.8" />
              <g clipPath="url(#pole-clip)">
                <line x1="12" y1="18" x2="30" y2="10" stroke="#ef4444" strokeWidth="4" />
                <line x1="12" y1="26" x2="30" y2="18" stroke="#ef4444" strokeWidth="4" />
                <line x1="12" y1="34" x2="30" y2="26" stroke="#ef4444" strokeWidth="4" />
                <line x1="12" y1="42" x2="30" y2="34" stroke="#ef4444" strokeWidth="4" />
                <line x1="12" y1="50" x2="30" y2="42" stroke="#ef4444" strokeWidth="4" />
                <line x1="12" y1="58" x2="30" y2="50" stroke="#ef4444" strokeWidth="4" />
              </g>
              {/* Outer re-stroke for clean outline */}
              <rect x="18" y="12" width="6" height="42" rx="3" stroke="#141416" strokeWidth="2.8" fill="none" />

              {/* Golden Finial Ball at Top */}
              <circle cx="21" cy="11" r="5" fill="#fbbf24" stroke="#141416" strokeWidth="2.8" />
              <circle cx="19.5" cy="9.5" r="1.3" fill="#ffffff" />

              {/* Hot Pink Waving Flag fluttering to the right */}
              {/* Flag Back shadow / depth fold */}
              <path
                d="M23 15 C32 13, 38 18, 48 16 C53 19, 51 26, 54 31 C44 33, 38 27, 23 33 Z"
                fill="#db2777"
              />
              {/* Main Flag Body with Billowing Wave */}
              <path
                d="M23 14 C33 11, 39 17, 50 14 C52 20, 50 25, 52 31 C43 33, 35 26, 23 31 Z"
                fill="#f472b6"
                stroke="#141416"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              {/* Top Crest Gloss Highlight */}
              <path
                d="M25 16 C34 13, 40 18, 48 15"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Bottom ripple highlight */}
              <path
                d="M26 28 C34 25, 41 30, 48 29"
                stroke="#fbcfe8"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Sparkle Star near Flag Tip */}
              <text x="49" y="12" fill="#ffffff" fontSize="12" fontWeight="bold">✦</text>
            </svg>
          </div>

          {/* Bottom Label: AREAS */}
          <div className="w-full text-center z-10 -mb-0.5">
            <span className="game-cartoon-title text-lg sm:text-xl">
              AREAS
            </span>
          </div>
        </button>

        {/* ================= CARD 4: ORANGE/GOLD [H] - SHOP ================= */}
        <button
          type="button"
          onClick={handleShopClick}
          className="relative rounded-[28px] border-[3.5px] border-[#141416] p-3 aspect-square flex flex-col items-center justify-between bg-gradient-to-b from-[#fbb028] via-[#e8810c] to-[#d96b00] shadow-[0_8px_0_#0f0f11,0_14px_20px_rgba(0,0,0,0.35)] cursor-pointer active:translate-y-1.5 active:shadow-[0_2px_0_#0f0f11] transition-transform group outline-none"
          title="Nhấn phím [H] hoặc click để mở Chợ Thẻ & Xu (SHOP)"
        >
          {/* Inner Cushion Ring */}
          <div className="game-inner-cushion" />

          {/* Polka dots texture */}
          <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
            <div className="absolute left-[20%] top-[25%] w-3.5 h-3.5 rounded-full bg-black/10" />
            <div className="absolute right-[22%] top-[35%] w-4 h-4 rounded-full bg-black/10" />
            <div className="absolute left-[28%] bottom-[30%] w-3 h-3 rounded-full bg-black/10" />
            <div className="absolute right-[25%] bottom-[25%] w-3.5 h-3.5 rounded-full bg-black/10" />
          </div>

          {/* Floating Keycap: H (Top-Left) */}
          <div className="absolute -top-2.5 -left-2.5 z-20 w-8 h-8 sm:w-9 sm:h-9 game-keycap flex items-center justify-center">
            H
          </div>

          {/* Floating Coral-Red DEAL! Ribbon (Top-Right) */}
          <div className="absolute -top-3 -right-2 z-20 bg-gradient-to-b from-[#ff5376] to-[#dc2626] border-[2.5px] border-[#18181b] shadow-[0_3px_0_#18181b] px-2.5 py-0.5 rounded-full rotate-6 animate-pulse">
            <span className="text-white font-black text-[11px] tracking-wider leading-none drop-shadow-[0_1px_0_#18181b]">
              DEAL!
            </span>
          </div>

          {/* Center Graphic: Authentic Cartoon Diamond Pyramid Hoard */}
          <div className="my-auto relative flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
            <svg
              className="w-16 h-16 sm:w-18 sm:h-18 drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Golden Coins at Base */}
              <ellipse cx="20" cy="47" rx="8" ry="4" fill="#fbbf24" stroke="#141416" strokeWidth="2.4" />
              <ellipse cx="44" cy="47" rx="8" ry="4" fill="#fbbf24" stroke="#141416" strokeWidth="2.4" />
              <ellipse cx="32" cy="50" rx="10" ry="4.5" fill="#f59e0b" stroke="#141416" strokeWidth="2.4" />
              <ellipse cx="32" cy="49" rx="8" ry="3.5" fill="#fef08a" />

              {/* Bottom Row Diamonds (Left & Right) */}
              {/* Bottom Left Diamond */}
              <g transform="translate(13, 31) rotate(-8 10 12) scale(0.72)">
                <path d="M4 10 L10 2 L18 2 L24 10 L14 26 Z" fill="#0284c7" stroke="#141416" strokeWidth="2.8" strokeLinejoin="round" />
                <path d="M10 2 L18 2 L20 10 L8 10 Z" fill="#bae6fd" />
                <path d="M4 10 L10 2 L8 10 Z" fill="#38bdf8" />
                <path d="M18 2 L24 10 L20 10 Z" fill="#38bdf8" />
                <path d="M8 10 L14 26 L20 10 Z" fill="#0369a1" />
                <path d="M4 10 L14 26 L8 10 Z" fill="#075985" />
              </g>

              {/* Bottom Right Diamond */}
              <g transform="translate(34, 31) rotate(8 10 12) scale(0.72)">
                <path d="M4 10 L10 2 L18 2 L24 10 L14 26 Z" fill="#0284c7" stroke="#141416" strokeWidth="2.8" strokeLinejoin="round" />
                <path d="M10 2 L18 2 L20 10 L8 10 Z" fill="#bae6fd" />
                <path d="M4 10 L10 2 L8 10 Z" fill="#38bdf8" />
                <path d="M18 2 L24 10 L20 10 Z" fill="#38bdf8" />
                <path d="M8 10 L14 26 L20 10 Z" fill="#0369a1" />
                <path d="M20 10 L14 26 L24 10 Z" fill="#075985" />
              </g>

              {/* Middle Row Diamonds */}
              {/* Mid Left Diamond */}
              <g transform="translate(17, 21) rotate(-4 11 13) scale(0.8)">
                <path d="M4 10 L10 2 L18 2 L24 10 L14 26 Z" fill="#0284c7" stroke="#141416" strokeWidth="2.8" strokeLinejoin="round" />
                <path d="M10 2 L18 2 L20 10 L8 10 Z" fill="#bae6fd" />
                <path d="M4 10 L10 2 L8 10 Z" fill="#38bdf8" />
                <path d="M18 2 L24 10 L20 10 Z" fill="#38bdf8" />
                <path d="M8 10 L14 26 L20 10 Z" fill="#0369a1" />
                <circle cx="14" cy="6" r="1.2" fill="#ffffff" />
              </g>

              {/* Mid Right Diamond */}
              <g transform="translate(30, 21) rotate(4 11 13) scale(0.8)">
                <path d="M4 10 L10 2 L18 2 L24 10 L14 26 Z" fill="#0284c7" stroke="#141416" strokeWidth="2.8" strokeLinejoin="round" />
                <path d="M10 2 L18 2 L20 10 L8 10 Z" fill="#bae6fd" />
                <path d="M4 10 L10 2 L8 10 Z" fill="#38bdf8" />
                <path d="M18 2 L24 10 L20 10 Z" fill="#38bdf8" />
                <path d="M8 10 L14 26 L20 10 Z" fill="#0369a1" />
                <circle cx="14" cy="6" r="1.2" fill="#ffffff" />
              </g>

              {/* Grand Top Peak Diamond */}
              <g transform="translate(23.5, 9) scale(0.92)">
                <path d="M4 10 L10 2 L18 2 L24 10 L14 27 Z" fill="#0284c7" stroke="#141416" strokeWidth="3" strokeLinejoin="round" />
                <path d="M10 2 L18 2 L20 10 L8 10 Z" fill="#e0f2fe" />
                <path d="M4 10 L10 2 L8 10 Z" fill="#7dd3fc" />
                <path d="M18 2 L24 10 L20 10 Z" fill="#38bdf8" />
                <path d="M8 10 L14 27 L20 10 Z" fill="#0284c7" />
                <path d="M4 10 L14 27 L8 10 Z" fill="#0369a1" />
                <path d="M20 10 L14 27 L24 10 Z" fill="#075985" />
                <circle cx="14" cy="5" r="1.6" fill="#ffffff" />
                <circle cx="9" cy="9" r="1" fill="#ffffff" />
              </g>

              {/* Sparkle Stars floating above the hoard */}
              <text x="13" y="15" fill="#ffffff" fontSize="13" fontWeight="bold">✦</text>
              <text x="47" y="18" fill="#ffffff" fontSize="11" fontWeight="bold">✦</text>
            </svg>
          </div>

          {/* Bottom Label: SHOP */}
          <div className="w-full text-center z-10 -mb-0.5">
            <span className="game-cartoon-title text-lg sm:text-xl">
              SHOP
            </span>
          </div>
        </button>

      </div>
    </div>
  );
}
