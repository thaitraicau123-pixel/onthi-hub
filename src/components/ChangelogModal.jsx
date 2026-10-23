import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Bell,
  Coins,
  Shield,
  Gamepad2,
  Gift,
  ArrowRight,
  ExternalLink,
  Smartphone,
  Check,
  Scissors
} from 'lucide-react';
import {
  APP_VERSION,
  CHANGELOG_DATA,
  markChangelogAsRead
} from '../data/changelogData';
import { playSound } from '../utils/storage';
import { useModalDismiss } from '../hooks/useModalDismiss';

export default function ChangelogModal({
  onClose,
  onOpenWallet,
  onOpenBlindBox,
  onOpenAdmin,
  onOpenMatchGame,
  onOpenLibrary
}) {
  const [selectedVersion, setSelectedVersion] = useState(APP_VERSION);
  const [dontShowAgain, setDontShowAgain] = useState(true);

  const activeRelease = CHANGELOG_DATA.find((r) => r.version === selectedVersion) || CHANGELOG_DATA[0];

  const handleClose = () => {
    playSound('flip');
    if (dontShowAgain) {
      markChangelogAsRead();
    }
    onClose();
  };

  // Close on Escape key
  useModalDismiss(handleClose);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in cursor-pointer"
    >
      {/* Background click layer */}
      <div className="fixed inset-0 -z-10" onClick={handleClose} aria-hidden="true" />

      {/* Floating hint to dismiss */}
      <div className="fixed top-3 inset-x-0 flex justify-center pointer-events-none select-none z-60">
        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-medium border border-white/20 shadow-md flex items-center space-x-1.5 animate-fade-in">
          <span>💡 Bấm ra khoảng trống bên ngoài hoặc nhấn</span>
          <kbd className="px-1.5 py-0.5 bg-white/20 rounded font-mono text-[10px] text-white">Esc</kbd>
          <span>để đóng</span>
        </span>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl border border-[#e9e9e8] dark:border-white/15 shadow-2xl overflow-hidden flex flex-col text-[#37352f] dark:text-white animate-scale-up my-auto max-h-[92vh] cursor-default"
      >
        
        {/* HEADER */}
        <div className="px-5 sm:px-6 py-4 bg-[#fbfbfa] dark:bg-slate-950/80 text-[#37352f] dark:text-white flex items-center justify-between border-b border-[#e9e9e8] dark:border-white/10 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2383e2]/10 text-[#2383e2] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-[#37352f]">
                  Bảng Tin Cập Nhật Tính Năng Mới
                </h3>
                <span className="notion-tag notion-tag-blue text-[10px] font-semibold uppercase">
                  {APP_VERSION}
                </span>
              </div>
              <p className="text-[11px] text-[#787774]">
                Nhật ký nâng cấp và lộ trình hoàn thiện ÔnThiHub 2026
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#787774] hover:text-[#37352f] hover:bg-black/5 rounded-lg border border-[#e9e9e8] bg-white transition-all cursor-pointer shadow-2xs group"
            title="Đóng bảng tin (hoặc nhấn phím Esc, bấm ra khoảng trống bên ngoài)"
          >
            <span className="font-semibold">Đóng</span>
            <kbd className="hidden sm:inline text-[10px] font-mono bg-[#f0efed] px-1 py-0.5 rounded text-[#787774]">Esc</kbd>
            <X className="w-4 h-4 ml-0.5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* VERSION SELECTOR TABS */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#f7f6f5] dark:bg-slate-950/50 border-b border-[#e9e9e8] dark:border-white/10 flex items-center space-x-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] font-semibold text-[#787774] dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Phiên bản:
          </span>
          {CHANGELOG_DATA.map((rel) => {
            const isSelected = rel.version === selectedVersion;
            return (
              <button
                key={rel.version}
                onClick={() => {
                  playSound('flip');
                  setSelectedVersion(rel.version);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[#37352f] dark:bg-slate-700 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 hover:bg-black/5 dark:hover:bg-slate-700/60 text-[#787774] dark:text-slate-300 border border-[#e9e9e8] dark:border-white/10'
                }`}
              >
                <span>{rel.version}</span>
                {rel.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold text-white ${rel.badgeColor}`}>
                    {rel.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SCROLLABLE CONTENT BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm bg-white dark:bg-slate-900 text-[#37352f] dark:text-white">
          
          {/* Version Banner */}
          <div className="p-4 bg-[#f7f6f5] dark:bg-slate-800/80 rounded-lg border border-[#e9e9e8] dark:border-white/10 text-[#37352f] dark:text-white space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-base font-bold text-[#37352f] dark:text-white flex items-center space-x-2">
                <span>{activeRelease.title}</span>
              </h4>
              <span className="text-[11px] font-medium text-[#787774] dark:text-slate-300 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-md border border-[#e9e9e8] dark:border-slate-600">
                📅 {activeRelease.date}
              </span>
            </div>
            <p className="text-xs text-[#787774] leading-relaxed">
              {activeRelease.summary}
            </p>
          </div>

          {/* Categorized Updates */}
          <div className="space-y-3">
            {activeRelease.highlights.map((sec, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#fbfbfa] rounded-lg border border-[#e9e9e8] space-y-2 text-left"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs sm:text-sm text-[#37352f]">
                    {sec.category}
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs text-[#37352f]">
                  {sec.items.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Quick Shortcuts (Trải nghiệm nhanh) */}
          <div className="p-4 bg-[#f7f6f5] rounded-lg border border-[#e9e9e8] space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787774] block">
              Trải Nghiệm Nhanh Tính Năng Vừa Thêm:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  handleClose();
                  onOpenWallet?.();
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <Coins className="w-3.5 h-3.5 fill-white" />
                <span>Ví Xu & Nạp Tiền</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  onOpenBlindBox?.();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white font-medium text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Khui Túi Mù Tri Thức</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  onOpenMatchGame?.();
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Game Nối Thẻ</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  onOpenLibrary?.();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>In Thẻ Cắt Giấy A4</span>
              </button>
            </div>
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-5 sm:px-6 py-3.5 bg-[#fbfbfa] border-t border-[#e9e9e8] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <label className="flex items-center space-x-2 text-xs text-[#787774] font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded accent-[#2383e2] w-4 h-4 cursor-pointer"
            />
            <span>Đã đọc, không tự động hiện lại bảng tin này</span>
          </label>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#f0efed] hover:bg-[#e3e2e0] text-[#37352f] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              Đóng cửa sổ (Esc)
            </button>
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Đã Hiểu & Khám Phá Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
