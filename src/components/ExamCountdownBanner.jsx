import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Target,
  Edit3,
  X,
  Check,
  Flame,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Zap
} from 'lucide-react';
import { playSound } from '../utils/storage';
import {
  getHanoiDateString,
  getHanoiTimeString,
  parseHanoiTargetTimestamp,
  calculateHanoiCountdown,
  getUpcomingDefaultExamDate,
  getStoredExamTarget,
  saveStoredExamTarget,
  DEFAULT_EXAM_NAME,
  DEFAULT_EXAM_TIME
} from '../utils/hanoiTime';
import { useModalDismiss } from '../hooks/useModalDismiss';

export default function ExamCountdownBanner({ onStartReview, onOpenTargetModal }) {
  // Stored target state with auto-rollover if past
  const [examTarget, setExamTarget] = useState(() => getStoredExamTarget());
  const { name: examName, date: examDate, time: examTime = DEFAULT_EXAM_TIME } = examTarget;

  // Real-time calculation state
  const [timeLeft, setTimeLeft] = useState(() => {
    const ts = parseHanoiTargetTimestamp(examDate, examTime);
    return calculateHanoiCountdown(ts);
  });
  const [hanoiClock, setHanoiClock] = useState(() => getHanoiTimeString(new Date(), true));
  const [tickColon, setTickColon] = useState(true);

  // Modal configuration state
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [inputName, setInputName] = useState(examName);
  const [inputDate, setInputDate] = useState(examDate);
  const [inputTime, setInputTime] = useState(examTime);

  // Close config modal on Escape key
  useModalDismiss(() => setShowConfigModal(false), showConfigModal);

  // Real-time 1-second ticker synchronized with Hanoi ICT (UTC+7)
  // With visibilitychange & window focus listeners to prevent background tab drift
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const targetTs = parseHanoiTargetTimestamp(examDate, examTime);
      const countdown = calculateHanoiCountdown(targetTs);

      setTimeLeft(countdown);
      setHanoiClock(getHanoiTimeString(now, true));
      setTickColon((prev) => !prev);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    // Re-synchronize immediately when returning to the tab from background
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        updateCountdown();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    // Sync if target is changed from other components (like TargetStudyClockModal)
    const handleTargetChanged = (e) => {
      if (e.detail) {
        setExamTarget(e.detail);
        setInputName(e.detail.name);
        setInputDate(e.detail.date);
        setInputTime(e.detail.time || DEFAULT_EXAM_TIME);
        updateCountdown();
      }
    };
    window.addEventListener('onthi-target-exam-changed', handleTargetChanged);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      window.removeEventListener('onthi-target-exam-changed', handleTargetChanged);
    };
  }, [examDate, examTime]);

  // Form submit in config modal
  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!inputName.trim() || !inputDate) return;

    const updated = saveStoredExamTarget({
      name: inputName.trim(),
      date: inputDate,
      time: inputTime || DEFAULT_EXAM_TIME
    });

    setExamTarget(updated);
    setShowConfigModal(false);
    playSound('success');
  };

  // Quick rollover button if target has expired
  const handleQuickRollover = (days = 45) => {
    const newDate = getUpcomingDefaultExamDate(days);
    const updated = saveStoredExamTarget({
      name: examName,
      date: newDate,
      time: examTime || DEFAULT_EXAM_TIME
    });
    setExamTarget(updated);
    setInputDate(newDate);
    playSound('success');
  };

  // Popular presets computed dynamically from current Hanoi date
  const PRESETS = [
    { name: '🏛️ Thi Công Chức 2026 (Kiến Thức Chung)', days: 45, time: '08:00' },
    { name: '🌍 Thi IELTS Academic Đợt Tới', days: 30, time: '08:30' },
    { name: '💻 Phỏng Vấn IT / Software Engineer', days: 14, time: '09:00' },
    { name: '🇯🇵 Kỳ Thi Năng Lực JLPT N2/N3', days: 60, time: '08:00' },
    { name: '⚡ Ôn Thi Nước Rút Cấp Tốc', days: 7, time: '07:30' }
  ];

  // Micro progress within the current minute (0-59s) for real-time visual proof
  const secondsProgressPercent = ((timeLeft.seconds / 59) * 100).toFixed(1);

  // Formatted date string for display: DD/MM/YYYY
  const displayDateStr = examDate ? examDate.split('-').reverse().join('/') : '--/--/----';

  return (
    <>
      <div className="bg-[#fbfbfa] dark:bg-slate-900/95 p-3.5 sm:p-4 rounded-xl border border-[#e9e9e8] dark:border-white/15 text-[#37352f] dark:text-white flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 shadow-2xs transition-colors relative overflow-hidden">
        
        {/* Subtle top indicator for active live sync */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 opacity-80" />

        {/* Left: Exam Info & Hanoi Real-Time Badge */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-[#e9e9e8] dark:border-white/15 shadow-2xs text-[#37352f] dark:text-white flex items-center justify-center text-lg shrink-0">
            ⏳
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>ĐỒNG HỒ ĐẾM NGƯỢC THỜI GIAN THỰC</span>
              </span>
              <button
                type="button"
                onClick={onOpenTargetModal}
                className="text-[10px] bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-600/50 px-2 py-0.5 rounded font-extrabold flex items-center space-x-1 cursor-pointer transition-colors"
                title="Bấm để mở Đồng hồ mục tiêu & xem vết thời gian học tập theo Giờ Hà Nội"
              >
                <span>🇻🇳</span>
                <span className="font-mono">{hanoiClock}</span>
              </button>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
              {examName}
            </h4>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium flex items-center space-x-1 mt-0.5">
              <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>
                Ngày thi: <strong>{displayDateStr}</strong> lúc <strong>{examTime}</strong> (Giờ Hà Nội)
              </span>
            </p>
          </div>
        </div>

        {/* Center: Live Timer Blocks or Expired Celebration */}
        {timeLeft.isExpired ? (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-600 text-amber-900 dark:text-amber-200 text-xs font-bold shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Kỳ thi đã đến mốc!</span>
            <button
              type="button"
              onClick={() => handleQuickRollover(45)}
              className="ml-2 px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black cursor-pointer shadow-xs"
            >
              Đặt Đợt Tiếp Theo (+45d)
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center shrink-0">
            <div className="flex items-center space-x-1 sm:space-x-1.5 text-center">
              {/* Days */}
              <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-[#e9e9e8] dark:border-white/15 min-w-[46px] sm:min-w-[50px] shadow-2xs">
                <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {timeLeft.days}
                </span>
                <span className="block text-[8px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  Ngày
                </span>
              </div>

              {/* Colon */}
              <span className={`font-bold text-sm transition-opacity duration-300 ${tickColon ? 'text-slate-400 dark:text-slate-500 opacity-100' : 'text-slate-300 dark:text-slate-600 opacity-30'}`}>
                :
              </span>

              {/* Hours */}
              <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-[#e9e9e8] dark:border-white/15 min-w-[46px] sm:min-w-[50px] shadow-2xs">
                <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="block text-[8px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  Giờ
                </span>
              </div>

              {/* Colon */}
              <span className={`font-bold text-sm transition-opacity duration-300 ${tickColon ? 'text-slate-400 dark:text-slate-500 opacity-100' : 'text-slate-300 dark:text-slate-600 opacity-30'}`}>
                :
              </span>

              {/* Minutes */}
              <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-[#e9e9e8] dark:border-white/15 min-w-[46px] sm:min-w-[50px] shadow-2xs">
                <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[8px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  Phút
                </span>
              </div>

              {/* Colon */}
              <span className={`font-bold text-sm transition-opacity duration-300 ${tickColon ? 'text-slate-400 dark:text-slate-500 opacity-100' : 'text-slate-300 dark:text-slate-600 opacity-30'}`}>
                :
              </span>

              {/* Seconds - Prominently highlighted with live real-time ticking */}
              <div className="px-2 py-1 rounded-lg bg-sky-50/80 dark:bg-sky-950/50 border border-sky-300 dark:border-sky-500/40 min-w-[46px] sm:min-w-[50px] shadow-2xs relative overflow-hidden">
                <span className="text-base sm:text-lg font-bold text-[#2383e2] dark:text-sky-400 font-mono">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[8px] uppercase tracking-wider text-sky-700 dark:text-sky-300 font-bold">
                  Giây
                </span>
              </div>
            </div>

            {/* Real-time continuous seconds progress bar */}
            <div className="w-full max-w-[210px] h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5" title="Nhịp đếm giây thời gian thực">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-700 ease-linear"
                style={{ width: `${secondsProgressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={() => {
              setInputName(examName);
              setInputDate(examDate);
              setInputTime(examTime);
              setShowConfigModal(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-[#efefed] dark:hover:bg-slate-700 border border-[#e9e9e8] dark:border-white/15 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center space-x-1 shadow-2xs cursor-pointer"
            title="Tùy chỉnh kỳ thi mục tiêu & giờ thi của bạn"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Đổi Mục Tiêu</span>
          </button>
        </div>

      </div>

      {/* Target Config Modal */}
      {showConfigModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowConfigModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-[#37352f] dark:text-white cursor-pointer"
        >
          <div className="fixed inset-0 -z-10" onClick={() => setShowConfigModal(false)} aria-hidden="true" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-[#e9e9e8] dark:border-white/15 shadow-2xl p-6 space-y-4 cursor-default max-h-[92vh] overflow-y-auto"
          >
            
            <div className="flex items-center justify-between border-b border-[#e9e9e8] dark:border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-[#2383e2] dark:text-sky-400" />
                <h4 className="font-bold text-sm text-[#37352f] dark:text-white">Thiết Lập Kỳ Thi Mục Tiêu</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs text-[#787774] dark:text-slate-300 hover:text-[#37352f] dark:hover:text-white hover:bg-[#efefed] dark:hover:bg-slate-800 rounded-lg border border-[#e9e9e8] dark:border-white/15 transition-colors cursor-pointer"
                title="Đóng (hoặc nhấn Esc, bấm ra ngoài)"
              >
                <span>Đóng</span>
                <kbd className="hidden sm:inline text-[10px] font-mono bg-[#f0efed] dark:bg-slate-800 px-1 py-0.5 rounded text-[#787774] dark:text-slate-400">Esc</kbd>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-medium text-[#37352f] dark:text-white">
              
              {/* Presets */}
              <div>
                <label className="text-[#787774] dark:text-slate-300 block mb-1.5 font-semibold">
                  Chọn nhanh kỳ thi phổ biến (Tự động tính ngày từ hôm nay):
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const targetDateStr = getUpcomingDefaultExamDate(p.days);
                        setInputName(p.name);
                        setInputDate(targetDateStr);
                        setInputTime(p.time || '08:00');
                      }}
                      className="p-2 text-left rounded-lg bg-[#fbfbfa] dark:bg-slate-800/80 hover:bg-[#f7f6f5] dark:hover:bg-slate-800 border border-[#e9e9e8] dark:border-white/10 text-[#37352f] dark:text-slate-200 text-xs transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="line-clamp-1 font-medium">{p.name}</span>
                      <span className="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/40 text-[10px] font-bold shrink-0 ml-2">
                        Còn +{p.days} ngày
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-[#37352f] dark:text-slate-200 block mb-1 font-semibold">Tên kỳ thi của bạn:</label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Ví dụ: Thi Công Chức 2026..."
                  className="w-full p-2 rounded-lg border border-[#e9e9e8] dark:border-white/15 bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700/80 focus:bg-white dark:focus:bg-slate-800 text-[#37352f] dark:text-white outline-none focus:border-[#2383e2] dark:focus:border-sky-400 transition-colors"
                  required
                />
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Date */}
                <div>
                  <label className="text-[#37352f] dark:text-slate-200 block mb-1 font-semibold">Ngày thi chính thức:</label>
                  <input
                    type="date"
                    min={getHanoiDateString()}
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#e9e9e8] dark:border-white/15 bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700/80 focus:bg-white dark:focus:bg-slate-800 text-[#37352f] dark:text-white outline-none focus:border-[#2383e2] dark:focus:border-sky-400 transition-colors"
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="text-[#37352f] dark:text-slate-200 block mb-1 font-semibold">Giờ bắt đầu làm bài:</label>
                  <input
                    type="time"
                    value={inputTime}
                    onChange={(e) => setInputTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#e9e9e8] dark:border-white/15 bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700/80 focus:bg-white dark:focus:bg-slate-800 text-[#37352f] dark:text-white outline-none focus:border-[#2383e2] dark:focus:border-sky-400 transition-colors font-mono"
                    required
                  />
                </div>
              </div>

              {/* Real-time preview calculation */}
              {(() => {
                const previewTs = parseHanoiTargetTimestamp(inputDate, inputTime);
                const previewCountdown = calculateHanoiCountdown(previewTs);
                return (
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>Thời gian còn lại tính đến thời điểm này:</span>
                    <strong className="text-[#2383e2] dark:text-sky-400 font-mono">
                      {previewCountdown.isExpired
                        ? 'Đã qua'
                        : `${previewCountdown.days}d ${previewCountdown.hours}h ${previewCountdown.minutes}m`}
                    </strong>
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#e9e9e8] dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 border border-[#e9e9e8] dark:border-white/15 text-[#787774] dark:text-slate-300 hover:text-[#37352f] dark:hover:text-white text-xs transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  Lưu & Đếm Ngược Thời Gian Thực
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}
