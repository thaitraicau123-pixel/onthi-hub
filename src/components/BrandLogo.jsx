import React from 'react';

export default function BrandLogo({ size = 28, className = '', themeIcon = null }) {
  // If theme has a custom emoji icon and caller wants emoji, or render the unified vector logo
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-lg sm:rounded-xl bg-gradient-to-tr from-[#2383e2] to-[#1a73e8] p-1 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 transform transition-transform hover:scale-105 active:scale-95 ${className}`}
      title="ÔnThiHub - Nền Tảng Học & Thi Chuẩn"
    >
      {/* Book Vector Icon matching favicon.svg 100% */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-white"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
        <path d="M6 14h6" />
      </svg>
      {/* Sparkle micro-badge */}
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 border border-white" />
    </div>
  );
}
