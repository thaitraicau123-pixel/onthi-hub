// Lucian UX/UI Prompt #219 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#219

import React, { useRef } from 'react';

/**
 * CircularRevealDarkMode (Lucian UX/UI Prompt #219)
 * Circular-reveal theme toggle button with spinning sun/moon icons
 * and view-transition circular expansion across the page.
 */
export default function CircularRevealDarkMode({
  sleepMode = 'light',
  onToggle,
  playSound,
  className = '',
  title,
  ariaLabel
}) {
  const buttonRef = useRef(null);
  const isDark = sleepMode === 'dark';

  const handleToggle = (e) => {
    playSound?.('click');

    const button = buttonRef.current;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!button || prefersReducedMotion || !document.startViewTransition) {
      // Fallback or reduced-motion: instant toggle
      onToggle?.();
      return;
    }

    // Measure button position for circular origin
    const rect = button.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Set origin coordinates on root for CSS variables
    document.documentElement.style.setProperty('--u219-cx', `${cx}px`);
    document.documentElement.style.setProperty('--u219-cy', `${cy}px`);

    const right = window.innerWidth - cx;
    const bottom = window.innerHeight - cy;
    const maxRadius = Math.hypot(Math.max(cx, right), Math.max(cy, bottom));

    // Native View Transition with circular clip-path animation
    const transition = document.startViewTransition(() => {
      onToggle?.();
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${cx}px ${cy}px)`,
            `circle(${maxRadius}px at ${cx}px ${cy}px)`
          ]
        },
        {
          duration: 700,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });
  };

  const defaultTitle = isDark
    ? 'Chế độ Ban đêm. Bấm chuyển sang Ban ngày ☀️'
    : 'Chế độ Ban ngày. Bấm chuyển sang Ban đêm 🌙';

  const defaultAria = isDark
    ? 'Chuyển sang chế độ ban ngày'
    : 'Chuyển sang chế độ ban đêm';

  return (
    <>
      <style>{`
        /* Scoped styles for Lucian UX/UI #219 Circular-reveal toggle */
        .u219-tg {
          width: 32px;
          height: 32px;
          border: 0;
          border-radius: 10px;
          background: var(--card, #ffffff);
          box-shadow: inset 0 0 0 1px var(--ln, rgba(22, 21, 27, 0.09));
          color: var(--fg, #14151a);
          display: grid;
          place-items: center;
          cursor: pointer;
          padding: 0;
          transition: background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, transform 0.15s ease;
          position: relative;
          user-select: none;
        }
        .u219-tg:hover {
          transform: scale(1.04);
        }
        .u219-tg:active {
          transform: scale(0.95);
        }
        :root.dark .u219-tg,
        [data-sleep-mode="dark"] .u219-tg {
          --card: #171925;
          --ln: rgba(255, 255, 255, 0.14);
          --fg: #ecedf5;
        }
        .u219-tg:focus-visible {
          outline: 2px solid var(--ac, #6a57f2);
          outline-offset: 2px;
        }
        .u219-tg svg {
          width: 16px;
          height: 16px;
          display: block;
          transition: transform 0.6s cubic-bezier(0.3, 1.4, 0.5, 1);
        }
        .u219-tg.is-dark svg {
          transform: rotate(-90deg);
        }
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
        ::view-transition-old(root) {
          z-index: 1;
        }
        ::view-transition-new(root) {
          z-index: 9999;
        }
        @media (prefers-reduced-motion: reduce) {
          .u219-tg,
          .u219-tg svg {
            transition: none !important;
          }
          ::view-transition-old(root),
          ::view-transition-new(root) {
            animation: none !important;
          }
        }
      `}</style>

      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`u219-tg ${isDark ? 'is-dark' : ''} ${className}`}
        title={title || defaultTitle}
        aria-label={ariaLabel || defaultAria}
        aria-pressed={isDark}
        tabIndex={0}
      >
        {isDark ? (
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M13.5 9.8A5.6 5.6 0 0 1 6.2 2.5a5.6 5.6 0 1 0 7.3 7.3z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="3" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M8 1.5v1.4M8 13.1v1.4M1.5 8h1.4M13.1 8h1.4M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
            </g>
          </svg>
        )}
      </button>
    </>
  );
}
