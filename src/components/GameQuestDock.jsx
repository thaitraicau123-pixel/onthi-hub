import React, { useEffect, useCallback } from 'react';
import { playSound } from '../utils/storage';

/**
 * GameQuestDock - Cartoon 3D Game / Arcade UI Component
 * Exact recreation of the reference screenshot featuring:
 * 1. Top Diamond Currency Pill with faceted glowing crystal, bold stroke counter, and tactile green '+' button.
 * 2. 4 Squircle 3D Physical Game Action Cards with hotkey badges ([U], [B], [M], [H]),
 *    tactile bottom bevel extrusion, glossy top highlight, bubble polka dots, and bubble text stroke.
 *    - [U] UNITS (Sword icon) -> Flashcards
 *    - [B] ITEMS (Peppermint candy icon) -> Timed Quiz
 *    - [M] AREAS (Pennant flag icon) -> Virtual Study Room
 *    - [H] SHOP (Diamonds hoard + "DEAL!" ribbon) -> Marketplace / Chợ Thẻ
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
  // Safe trigger handlers with audio feedback
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

  // Global Hotkeys: [U], [B], [M], [H]
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is inside an input, textarea, or contentEditable element
      const activeTag = document.activeElement?.tagName;
      const isInput =
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        activeTag === 'SELECT' ||
        document.activeElement?.isContentEditable;
      if (isInput) return;

      // Ignore if modifier keys (Ctrl, Cmd, Alt) are held
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
    <div className={`w-full max-w-4xl mx-auto flex flex-col items-center gap-4 select-none ${className}`}>
      {/* =========================================================================
          TOP CURRENCY DIAMOND PILL (DEEP PURPLE GRADIENT + 3D BOTTOM BEVEL)
          ========================================================================= */}
      <div className="game-pill-purple game-dots-pattern px-4 py-2 sm:px-6 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-6 min-w-[220px] sm:min-w-[270px]">
        {/* Left: Multifaceted Sparkling Diamond */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main Diamond Facets */}
            <path d="M12 16L24 4L36 16L24 44L12 16Z" fill="#00a8e8" />
            <path d="M24 4L12 16H24V4Z" fill="#5ce1e6" />
            <path d="M24 4L36 16H24V4Z" fill="#bbf2f6" />
            <path d="M12 16L24 44V16H12Z" fill="#0077b6" />
            <path d="M36 16L24 44V16H36Z" fill="#0096c7" />
            {/* Top Gloss Highlight */}
            <path d="M20 9L24 4L28 9L24 14L20 9Z" fill="#ffffff" fillOpacity="0.8" />
            {/* Outer Dark Contour */}
            <path
              d="M12 16L24 4L36 16L24 44L12 16Z"
              stroke="#0b2545"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M12 16H36" stroke="#0b2545" strokeWidth="2.5" />
            <path d="M24 4V44" stroke="#0b2545" strokeWidth="2.5" />
          </svg>

          {/* Twinkle Sparkles */}
          <span
            className="absolute -top-1 -right-1 text-white text-xs font-black animate-spin"
            style={{ animationDuration: '6s' }}
          >
            ✦
          </span>
          <span
            className="absolute -bottom-1 -left-1 text-cyan-200 text-[10px] font-black animate-pulse"
          >
            ✦
          </span>
        </div>

        {/* Center: Large White Chunky Value with Dark Outline */}
        <div className="flex items-center space-x-1">
          <span className="game-text-stroke text-white font-black text-2xl sm:text-3xl tracking-wider font-mono">
            {typeof walletBalance === 'number' ? walletBalance.toLocaleString('vi-VN') : walletBalance}
          </span>
          <span className="text-[11px] font-extrabold text-purple-200 tracking-wider uppercase ml-1 opacity-90 hidden sm:inline">
            XU
          </span>
        </div>

        {/* Right: Tactile Lime-Green '+' Button */}
        <button
          type="button"
          onClick={handlePlusClick}
          title="Nạp thêm xu / Quản lý ví (Nhấn để nạp)"
          className="game-plus-btn w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
          aria-label="Nạp xu"
        >
          <span className="text-white font-black text-xl sm:text-2xl leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
            +
          </span>
        </button>
      </div>

      {/* =========================================================================
          4 GAME NAVIGATION CARDS (2x2 GRID / SQUIRCLE BUTTONS)
          BLUE [U] UNITS | PINK [B] ITEMS | GREEN [M] AREAS | GOLD [H] SHOP
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
        {/* ================= CARD 1: BLUE [U] - UNITS / FLASHCARDS ================= */}
        <button
          type="button"
          onClick={handleUnitsClick}
          className="game-card-3d game-card-blue game-dots-pattern min-h-[136px] sm:min-h-[156px] group"
          title="Nhấn phím [U] hoặc bấm chuột để mở Bộ Thẻ Ôn Tập"
        >
          {/* Top Row: Hotkey Badge */}
          <div className="w-full flex items-center justify-between">
            <span className="game-key-badge">[U]</span>
            <span className="text-[10px] font-bold text-sky-200/90 tracking-wider uppercase hidden sm:inline">
              FLASHCARD
            </span>
          </div>

          {/* Center Graphic: Cartoon Sword with Sparkles */}
          <div className="my-auto relative flex items-center justify-center group-hover:scale-110 transition-transform duration-150">
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)] -rotate-12"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Blade */}
              <path
                d="M48 6L56 14L28 42L20 34L48 6Z"
                fill="#f1f5f9"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Blade Center Ridge & Shadow */}
              <path d="M48 6L24 38" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <path d="M24 38L20 34L48 6Z" fill="#cbd5e1" />
              {/* Tip Specular Shine */}
              <path d="M52 10L55 13L46 12Z" fill="#ffffff" />
              {/* Golden Crossguard */}
              <path
                d="M16 32L34 50L30 54L12 36L16 32Z"
                fill="#fbbf24"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle cx="23" cy="43" r="2.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.2" />
              {/* Hilt Grip */}
              <path
                d="M14 38L7 45L11 49L18 42Z"
                fill="#334155"
                stroke="#0f172a"
                strokeWidth="2"
              />
              {/* Pommel Gold Ball */}
              <circle cx="7" cy="49" r="4" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
            </svg>

            {/* Sparkle Glint */}
            <span
              className="absolute -top-1 -right-1 text-white text-sm font-black animate-ping"
              style={{ animationDuration: '3s' }}
            >
              ✦
            </span>
          </div>

          {/* Bottom Label: UNITS */}
          <div className="w-full text-center">
            <span className="game-text-stroke text-white font-black text-lg sm:text-xl tracking-wider uppercase block leading-tight">
              UNITS
            </span>
            <span className="text-[11px] font-extrabold text-blue-100 tracking-tight block">
              Bộ Thẻ
            </span>
          </div>
        </button>

        {/* ================= CARD 2: PINK [B] - ITEMS / QUIZ ================= */}
        <button
          type="button"
          onClick={handleItemsClick}
          className="game-card-3d game-card-pink game-dots-pattern min-h-[136px] sm:min-h-[156px] group"
          title="Nhấn phím [B] hoặc bấm chuột để mở Đề Thi Trắc Nghiệm"
        >
          {/* Top Row: Hotkey Badge */}
          <div className="w-full flex items-center justify-between">
            <span className="game-key-badge">[B]</span>
            <span className="text-[10px] font-bold text-pink-200/90 tracking-wider uppercase hidden sm:inline">
              QUIZ
            </span>
          </div>

          {/* Center Graphic: Striped Peppermint Candy Powerup */}
          <div className="my-auto relative flex items-center justify-center group-hover:scale-110 transition-transform duration-150">
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Candy Left Wrapper Fan */}
              <path
                d="M18 32L6 22V42L18 32Z"
                fill="#f472b6"
                stroke="#3f071e"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path d="M10 26L16 32L10 38" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

              {/* Candy Right Wrapper Fan */}
              <path
                d="M46 32L58 22V42L46 32Z"
                fill="#f472b6"
                stroke="#3f071e"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path d="M54 26L48 32L54 38" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

              {/* Candy Round Disc Base */}
              <circle
                cx="32"
                cy="32"
                r="18"
                fill="#ffffff"
                stroke="#3f071e"
                strokeWidth="2.8"
              />

              {/* Red Peppermint Swirl Segments */}
              <path
                d="M32 14C36 18 38 24 32 32C26 40 28 46 32 50C22.0589 50 14 41.9411 14 32C14 22.0589 22.0589 14 32 14Z"
                fill="#e11d48"
              />
              <path
                d="M50 32C46 36 40 38 32 32C24 26 18 28 14 32C14 22.0589 22.0589 14 32 14C41.9411 14 50 22.0589 50 32Z"
                fill="#e11d48"
                fillOpacity="0.4"
              />

              {/* Gloss Highlight Arc */}
              <path
                d="M22 20C25 17 30 16 35 17"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Sparkle Glint */}
            <span
              className="absolute -top-1 -right-1 text-white text-sm font-black animate-ping"
              style={{ animationDuration: '3.2s' }}
            >
              ✦
            </span>
          </div>

          {/* Bottom Label: ITEMS */}
          <div className="w-full text-center">
            <span className="game-text-stroke text-white font-black text-lg sm:text-xl tracking-wider uppercase block leading-tight">
              ITEMS
            </span>
            <span className="text-[11px] font-extrabold text-pink-100 tracking-tight block">
              Thi Thử
            </span>
          </div>
        </button>

        {/* ================= CARD 3: GREEN [M] - AREAS / STUDY ROOM ================= */}
        <button
          type="button"
          onClick={handleAreasClick}
          className="game-card-3d game-card-green game-dots-pattern min-h-[136px] sm:min-h-[156px] group"
          title="Nhấn phím [M] hoặc bấm chuột để mở Phòng Tự Học"
        >
          {/* Top Row: Hotkey Badge */}
          <div className="w-full flex items-center justify-between">
            <span className="game-key-badge">[M]</span>
            <span className="text-[10px] font-bold text-emerald-200/90 tracking-wider uppercase hidden sm:inline">
              ARENA
            </span>
          </div>

          {/* Center Graphic: Pennant Flag on Pole */}
          <div className="my-auto relative flex items-center justify-center group-hover:scale-110 transition-transform duration-150">
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Flagpole Wood Base */}
              <path
                d="M20 10V52"
                stroke="#5c3d1e"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M21 12V50"
                stroke="#a16207"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Golden Finial Ball */}
              <circle cx="20" cy="10" r="4.5" fill="#facc15" stroke="#422006" strokeWidth="2" />

              {/* Triangular Pennant Flag */}
              <path
                d="M22 13L52 25L22 37V13Z"
                fill="#ffffff"
                stroke="#14532d"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Red Stripes on Pennant */}
              <path
                d="M22 19L36 25L22 31V19Z"
                fill="#dc2626"
              />
              <path
                d="M36 25L46 25L22 35"
                stroke="#facc15"
                strokeWidth="2"
              />

              {/* Grass Patch at Ground */}
              <path
                d="M12 53C16 50 24 50 28 53H12Z"
                fill="#15803d"
                stroke="#052e16"
                strokeWidth="2"
              />
            </svg>

            {/* Sparkle Glint */}
            <span
              className="absolute -top-1 -right-1 text-white text-sm font-black animate-ping"
              style={{ animationDuration: '3.5s' }}
            >
              ✦
            </span>
          </div>

          {/* Bottom Label: AREAS */}
          <div className="w-full text-center">
            <span className="game-text-stroke text-white font-black text-lg sm:text-xl tracking-wider uppercase block leading-tight">
              AREAS
            </span>
            <span className="text-[11px] font-extrabold text-emerald-100 tracking-tight block">
              Phòng Học
            </span>
          </div>
        </button>

        {/* ================= CARD 4: ORANGE/GOLD [H] - SHOP / MARKETPLACE ================= */}
        <button
          type="button"
          onClick={handleShopClick}
          className="game-card-3d game-card-orange game-dots-pattern min-h-[136px] sm:min-h-[156px] group relative"
          title="Nhấn phím [H] hoặc bấm chuột để mở Sàn Chợ Thẻ & Ví Xu"
        >
          {/* Top Row: Hotkey Badge + Floating "DEAL!" Ribbon */}
          <div className="w-full flex items-center justify-between">
            <span className="game-key-badge">[H]</span>
            {/* Floating DEAL! Ribbon with bounce */}
            <span className="game-deal-pill">
              DEAL!
            </span>
          </div>

          {/* Center Graphic: Diamond Pile & Gold Coins */}
          <div className="my-auto relative flex items-center justify-center group-hover:scale-110 transition-transform duration-150">
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Back Gold Coins */}
              <ellipse cx="22" cy="44" rx="10" ry="5" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
              <ellipse cx="42" cy="44" rx="10" ry="5" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
              <ellipse cx="32" cy="47" rx="12" ry="6" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />

              {/* Left Blue Diamond */}
              <path
                d="M18 36L26 26L34 36L26 48L18 36Z"
                fill="#38bdf8"
                stroke="#082f49"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M18 36H34" stroke="#082f49" strokeWidth="1.5" />
              <path d="M26 26V48" stroke="#082f49" strokeWidth="1.5" />

              {/* Right Cyan Diamond */}
              <path
                d="M30 36L38 26L46 36L38 48L30 36Z"
                fill="#0284c7"
                stroke="#082f49"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Center Large Glowing Diamond */}
              <path
                d="M24 28L32 16L40 28L32 44L24 28Z"
                fill="#67e8f9"
                stroke="#082f49"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path d="M24 28L32 16H40L32 28H24Z" fill="#a5f3fc" />
              <path d="M24 28H40" stroke="#082f49" strokeWidth="2" />
              <path d="M32 16V44" stroke="#082f49" strokeWidth="2" />

              {/* Specular White Sparkle */}
              <circle cx="32" cy="22" r="2" fill="#ffffff" />
            </svg>

            {/* Sparkle Glint */}
            <span
              className="absolute -top-1 -right-1 text-white text-sm font-black animate-ping"
              style={{ animationDuration: '2.8s' }}
            >
              ✦
            </span>
          </div>

          {/* Bottom Label: SHOP */}
          <div className="w-full text-center">
            <span className="game-text-stroke text-white font-black text-lg sm:text-xl tracking-wider uppercase block leading-tight">
              SHOP
            </span>
            <span className="text-[11px] font-extrabold text-amber-100 tracking-tight block">
              Chợ Thẻ
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
