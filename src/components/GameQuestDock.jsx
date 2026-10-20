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
              className="w-16 h-16 sm:w-18 sm:h-18 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left Candy Wrapper Frill */}
              <path
                d="M20 32L8 23V41L20 32Z"
                fill="#f472b6"
                stroke="#141416"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <path d="M12 28L17 32L12 36" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

              {/* Right Candy Wrapper Frill */}
              <path
                d="M44 32L56 23V41L44 32Z"
                fill="#f472b6"
                stroke="#141416"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <path d="M52 28L47 32L52 36" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

              {/* Central Round Candy Disc */}
              <circle
                cx="32"
                cy="32"
                r="16"
                fill="#ffffff"
                stroke="#141416"
                strokeWidth="3"
              />

              {/* Curved Red Spiral Swirl */}
              <path
                d="M32 16C36 20 37 25 32 32C27 39 28 44 32 48C23.1634 48 16 40.8366 16 32C16 23.1634 23.1634 16 32 16Z"
                fill="#e11d48"
              />
              <path
                d="M48 32C44 36 39 37 32 32C25 27 20 28 16 32C16 23.1634 23.1634 16 32 16C40.8366 16 48 23.1634 48 32Z"
                fill="#e11d48"
                fillOpacity="0.45"
              />

              {/* Gloss Highlight */}
              <path
                d="M24 22C26 20 30 19 34 20"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
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
              className="w-16 h-16 sm:w-18 sm:h-18 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Flagpole Base: Red & White Striped */}
              <defs>
                <pattern id="candy-stripe" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="4" height="8" fill="#ef4444" />
                  <rect x="4" width="4" height="8" fill="#ffffff" />
                </pattern>
              </defs>

              {/* Striped Vertical Pole */}
              <rect
                x="20"
                y="14"
                width="6"
                height="38"
                rx="3"
                fill="url(#candy-stripe)"
                stroke="#141416"
                strokeWidth="2.8"
              />

              {/* Golden Finial Ball at Top */}
              <circle
                cx="23"
                cy="14"
                r="4.5"
                fill="#fbbf24"
                stroke="#141416"
                strokeWidth="2.6"
              />

              {/* Hot Pink Waving Flag fluttering to the right */}
              <path
                d="M25 16 C33 14, 40 20, 50 17 C52 23, 49 28, 51 34 C42 36, 34 30, 25 33 Z"
                fill="#f472b6"
                stroke="#141416"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              {/* Flag Inner Highlight Curve */}
              <path
                d="M27 20 C34 18, 41 23, 48 20"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
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
              className="w-16 h-16 sm:w-18 sm:h-18 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Bottom Row Diamonds */}
              {/* Diamond 1 (Bottom Left) */}
              <g transform="translate(8, 30) scale(0.65)">
                <path d="M8 12L16 4L24 12L16 28L8 12Z" fill="#0284c7" stroke="#141416" strokeWidth="2.8" strokeLinejoin="round" />
                <path d="M16 4L8 12H16V4Z" fill="#38bdf8" />
                <path d="M16 4L24 12H16V4Z" fill="#7dd3fc" />
                <path d="M8 12L16 28V12H8Z" fill="#0369a1" />
              </g>

              {/* Diamond 2 (Bottom Right) */}
              <g transform="translate(36, 30) scale(0.65)">
                <path d="M8 12L16 4L24 12L16 28L8 12Z" fill="#0284c7" stroke="#141416" strokeWidth="2.8" strokeLinejoin="round" />
                <path d="M16 4L8 12H16V4Z" fill="#38bdf8" />
                <path d="M16 4L24 12H16V4Z" fill="#7dd3fc" />
                <path d="M8 12L16 28V12H8Z" fill="#0369a1" />
              </g>

              {/* Middle Row Diamonds */}
              {/* Diamond 3 (Mid Left) */}
              <g transform="translate(14, 20) scale(0.75)">
                <path d="M8 12L16 4L24 12L16 28L8 12Z" fill="#0284c7" stroke="#141416" strokeWidth="2.8" strokeLinejoin="round" />
                <path d="M16 4L8 12H16V4Z" fill="#38bdf8" />
                <path d="M16 4L24 12H16V4Z" fill="#7dd3fc" />
                <path d="M8 12L16 28V12H8Z" fill="#0369a1" />
              </g>

              {/* Diamond 4 (Mid Right) */}
              <g transform="translate(30, 20) scale(0.75)">
                <path d="M8 12L16 4L24 12L16 28L8 12Z" fill="#0284c7" stroke="#141416" strokeWidth="2.8" strokeLinejoin="round" />
                <path d="M16 4L8 12H16V4Z" fill="#38bdf8" />
                <path d="M16 4L24 12H16V4Z" fill="#7dd3fc" />
                <path d="M8 12L16 28V12H8Z" fill="#0369a1" />
              </g>

              {/* Peak Diamond (Top Center) */}
              <g transform="translate(20, 10) scale(0.85)">
                <path d="M8 12L16 4L24 12L16 28L8 12Z" fill="#0284c7" stroke="#141416" strokeWidth="2.8" strokeLinejoin="round" />
                <path d="M16 4L8 12H16V4Z" fill="#38bdf8" />
                <path d="M16 4L24 12H16V4Z" fill="#bae6fd" />
                <path d="M8 12L16 28V12H8Z" fill="#0369a1" />
                {/* Specular White Shine */}
                <circle cx="16" cy="8" r="1.5" fill="#ffffff" />
              </g>

              {/* Star Sparkles above diamonds */}
              <text x="14" y="16" fill="#ffffff" fontSize="11" fontWeight="bold">✦</text>
              <text x="44" y="20" fill="#ffffff" fontSize="10" fontWeight="bold">✦</text>
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
