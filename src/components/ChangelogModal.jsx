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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#fcf7ec] rounded-3xl border-2 border-[#eadfcb] shadow-2xl overflow-hidden flex flex-col text-[#28071a] animate-scale-up my-auto max-h-[92vh]">
        
        {/* HEADER */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#240618] via-[#380b23] to-[#240618] text-white flex items-center justify-between border-b border-[#f02c85]/40 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#f02c85] to-[#ff4297] flex items-center justify-center text-white shadow-md shadow-pink-900/40">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                  Bảng Tin Cập Nhật Tính Năng Mới
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#f02c85] text-white uppercase">
                  {APP_VERSION}
                </span>
              </div>
              <p className="text-[11px] text-pink-200/80 font-medium">
                Nhật ký nâng cấp và lộ trình hoàn thiện ÔnThiHub 2026
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-rose-200/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Đóng bảng tin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VERSION SELECTOR TABS */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#f6ebd5] border-b border-[#eadfcb] flex items-center space-x-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] font-black text-[#7a5a6b] uppercase tracking-wider shrink-0 mr-1">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[#28071a] text-white shadow-xs'
                    : 'bg-white/80 hover:bg-white text-[#4e2f41] border border-[#eadfcb]'
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          
          {/* Version Banner */}
          <div className="p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl border-2 border-[#f02c85]/20 text-[#28071a] space-y-1.5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-base sm:text-lg font-black text-[#28071a] flex items-center space-x-2">
                <span>{activeRelease.title}</span>
              </h4>
              <span className="text-[11px] font-bold text-[#7a5a6b] bg-white px-2.5 py-0.5 rounded-lg border border-[#eadfcb]">
                📅 {activeRelease.date}
              </span>
            </div>
            <p className="text-xs text-[#5c3e4f] font-medium leading-relaxed">
              {activeRelease.summary}
            </p>
          </div>

          {/* Categorized Updates */}
          <div className="space-y-4">
            {activeRelease.highlights.map((sec, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-2xl border border-[#eadfcb] shadow-xs space-y-2.5 text-left"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-black text-xs sm:text-sm text-[#28071a]">
                    {sec.category}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-[#4e2f41] font-medium">
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
          <div className="p-4 bg-[#fcf5e5] rounded-2xl border border-[#eadfcb] space-y-2.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#7a5a6b] block">
              Trải Nghiệm Nhanh Tính Năng Vừa Thêm:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  handleClose();
                  onOpenWallet?.();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center space-x-1.5 shadow-xs transition-transform hover:scale-105 active:scale-95"
              >
                <Coins className="w-3.5 h-3.5 fill-white" />
                <span>Ví Xu & Nạp Tiền</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  onOpenBlindBox?.();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#f02c85] hover:bg-[#dc1f74] text-white font-black text-xs flex items-center space-x-1.5 shadow-xs transition-transform hover:scale-105 active:scale-95"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Khui Túi Mù Tri Thức</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  onOpenMatchGame?.();
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center space-x-1.5 shadow-xs transition-transform hover:scale-105 active:scale-95"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Game Nối Thẻ</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  onOpenLibrary?.();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center space-x-1.5 shadow-xs transition-transform hover:scale-105 active:scale-95"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>In Thẻ Cắt Giấy A4</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  onOpenAdmin?.();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#28071a] hover:bg-[#3d0c27] text-white font-black text-xs flex items-center space-x-1.5 shadow-xs transition-transform hover:scale-105 active:scale-95"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Quản Trị Admin</span>
              </button>
            </div>
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-[#eadfcb] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <label className="flex items-center space-x-2 text-xs text-[#7a5a6b] font-bold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded accent-[#f02c85] w-4 h-4 cursor-pointer"
            />
            <span>Đã đọc, không tự động hiện lại bảng tin này</span>
          </label>

          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-wayground-sunset text-white text-xs font-black shadow-md hover:opacity-95 transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-1.5"
          >
            <span>Đã Hiểu & Khám Phá Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
