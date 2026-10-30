import React from 'react';

export default function BrandLogo({ size = 28, className = '', themeIcon = null }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 p-1 flex items-center justify-center text-white shadow-md shadow-amber-500/25 shrink-0 transform transition-transform hover:scale-105 active:scale-95 ${className}`}
      title="PromptMMO - Chợ Prompt & AI Skills Thực Chiến"
    >
      {/* AI Sparkles & Terminal Lightning Vector */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-white"
      >
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
      </svg>
      {/* Gold micro-badge */}
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-white" />
    </div>
  );
}
