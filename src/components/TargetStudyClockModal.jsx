import React, { useState, useEffect } from 'react';
import {
  Clock,
  Target,
  History,
  X,
  Play,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  Trash2,
  Sparkles,
  Zap,
  Timer,
  BellRing,
  RotateCcw
} from 'lucide-react';
import {
  getHanoiDateString,
  getHanoiTimeString,
  formatHanoiDateTime,
  getHanoiDayOfWeekName,
  getHanoiNowComponents,
  getStudyTimeLogs,
  recordStudyTimeLog,
  clearStudyTimeLogs,
  getTargetStudyClock,
  saveTargetStudyClock,
  calculateTargetClockProgress
} from '../utils/hanoiTime';
import { playSound } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function TargetStudyClockModal({ isOpen, onClose, onOpenPomodoro, onOpenQuiz }) {
  const [activeTab, setActiveTab] = useState('target'); // 'target' | 'logs'
  const [hanoiNow, setHanoiNow] = useState(() => getHanoiNowComponents());
  const [targetClock, setTargetClock] = useState(() => getTargetStudyClock());
  const [progress, setProgress] = useState(() => calculateTargetClockProgress());
  const [logsFilter, setLogsFilter] = useState('today'); // 'today' | 'all'
  const [logs, setLogs] = useState(() => getStudyTimeLogs('today'));
  const [inputMinutes, setInputMinutes] = useState(targetClock.dailyGoalMinutes || 60);
  const [inputEndTime, setInputEndTime] = useState(targetClock.targetEndTime || '23:00');
  const [toastMsg, setToastMsg] = useState('');

  // 1-second live clock ticker for Hanoi time & target countdown
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setHanoiNow(getHanoiNowComponents());
      setProgress(calculateTargetClockProgress());
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Sync logs when open or on log event
  useEffect(() => {
    if (!isOpen) return;

    const refreshLogs = () => {
      setLogs(getStudyTimeLogs(logsFilter === 'today' ? 'today' : null));
      setProgress(calculateTargetClockProgress());
    };

    refreshLogs();

    window.addEventListener('onthi-study-log-added', refreshLogs);
    window.addEventListener('onthi-study-log-cleared', refreshLogs);
    window.addEventListener('onthi-target-clock-change', refreshLogs);

    return () => {
      window.removeEventListener('onthi-study-log-added', refreshLogs);
      window.removeEventListener('onthi-study-log-cleared', refreshLogs);
      window.removeEventListener('onthi-target-clock-change', refreshLogs);
    };
  }, [isOpen, logsFilter]);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSaveGoal = (goalMinutes) => {
    const updated = saveTargetStudyClock({ dailyGoalMinutes: goalMinutes, targetEndTime: inputEndTime });
    setTargetClock(updated);
    setInputMinutes(goalMinutes);
    setProgress(calculateTargetClockProgress());
    playSound('success');
    showToast(`🎯 Đã đặt mục tiêu học ${goalMinutes} phút hôm nay (Giờ Hà Nội)!`);
  };

  const handleSaveEndTime = (e) => {
    e.preventDefault();
    const updated = saveTargetStudyClock({ dailyGoalMinutes: inputMinutes, targetEndTime: inputEndTime });
    setTargetClock(updated);
    setProgress(calculateTargetClockProgress());
    playSound('success');
    showToast(`⏰ Đã cài đặt đồng hồ đích: ${inputEndTime} (Giờ Hà Nội)!`);
  };

  const handleManualQuickLog = (mins = 15) => {
    recordStudyTimeLog({
      type: 'study',
      title: `Phiên tự học tập trung (${mins} phút)`,
      durationMinutes: mins,
      xpGained: mins * 2
    });
    playSound('flip');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    showToast(`✅ Đã lưu vết thời gian: +${mins} phút học tập (+${mins * 2} XP)!`);
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử vết thời gian học tập không?')) {
      clearStudyTimeLogs();
      setLogs([]);
      setProgress(calculateTargetClockProgress());
      playSound('flip');
      showToast('🗑️ Đã xóa sạch nhật ký vết thời gian.');
    }
  };

  // Calculate countdown to targetEndTime
  const calculateTimeToTarget = () => {
    try {
      const [targetH, targetM] = inputEndTime.split(':').map(Number);
      const now = new Date();
      // Format now in Hanoi
      const hanoiTimeStr = getHanoiTimeString(now, true);
      const [curH, curM, curS] = hanoiTimeStr.split(':').map(Number);

      let targetSeconds = targetH * 3600 + targetM * 60;
      let currentSeconds = curH * 3600 + curM * 60 + curS;

      let diff = targetSeconds - currentSeconds;
      if (diff < 0) {
        // Target is past for today (or rolls to tomorrow)
        diff += 24 * 3600;
      }

      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    } catch (e) {
      return '--:--:--';
    }
  };

  const GOAL_PRESETS = [30, 45, 60, 90, 120, 180];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-[#37352f] dark:text-[#f8fafc]">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 transition-colors duration-300">
        
        {/* HEADER: LIVE HANOI CLOCK BADGE & CONTROLS */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Clock className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Đồng Hồ Mục Tiêu & Vết Thời Gian
                </h3>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Giờ Hà Nội (GMT+7)</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Đồng bộ chuẩn thời gian Việt Nam • Lưu vết từng phút học tập & đặt mốc mục tiêu
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-5 pt-2 text-xs font-bold gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('target')}
            className={`pb-2.5 flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'target'
                ? 'border-[#2383e2] text-[#1458a6] dark:text-sky-400 font-extrabold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>🎯 Đồng Hồ Mục Tiêu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`pb-2.5 flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'logs'
                ? 'border-[#2383e2] text-[#1458a6] dark:text-sky-400 font-extrabold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>📜 Vết Thời Gian Học Tập ({logs.length})</span>
          </button>
        </div>

        {/* TOAST MESSAGE */}
        {toastMsg && (
          <div className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 text-center animate-fade-in flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* =========================================================
              TAB 1: ĐỒNG HỒ MỤC TIÊU & LIVE HANOI CLOCK
              ========================================================= */}
          {activeTab === 'target' && (
            <div className="space-y-5">
              
              {/* LIVE DIGITAL HANOI CLOCK DISPLAY */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white shadow-lg border border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative overflow-hidden">
                <div className="relative z-10 space-y-1">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs font-bold text-sky-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>THỜI GIAN THỰC TẾ VIỆT NAM (ICT)</span>
                  </div>
                  <div className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                    {hanoiNow.timeString}
                  </div>
                  <div className="text-xs font-semibold text-slate-300 flex items-center justify-center sm:justify-start space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>{hanoiNow.dayName}, ngày {hanoiNow.dateString.split('-').reverse().join('/')} (Giờ Hà Nội)</span>
                  </div>
                </div>

                {/* Target Countdown Pill */}
                <div className="relative z-10 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center sm:text-right shrink-0">
                  <span className="block text-[10px] uppercase font-bold text-slate-300">
                    Đếm ngược đến đích ({inputEndTime}):
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-amber-300">
                    {calculateTimeToTarget()}
                  </span>
                </div>

                {/* Subtle Decorative Glow Background */}
                <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />
              </div>

              {/* TODAY PROGRESS GOAL CARD */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                      <span>🎯 Tiến Độ Mục Tiêu Học Hôm Nay</span>
                      {progress.isGoalAchieved && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          🏆 Đã Đạt Chuẩn!
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Đã ghi nhận vết thời gian: <strong className="text-indigo-600 dark:text-sky-400 font-extrabold">{progress.todayMinutes} phút</strong> / Mục tiêu <strong className="text-slate-900 dark:text-white font-extrabold">{progress.dailyGoalMinutes} phút</strong>
                    </p>
                  </div>

                  <span className="font-black text-lg text-[#2383e2] dark:text-sky-400">
                    {progress.percent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      progress.isGoalAchieved
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-[#2383e2] to-indigo-500'
                    }`}
                    style={{ width: `${Math.max(5, progress.percent)}%` }}
                  />
                </div>

                {/* Goal Presets */}
                <div className="pt-2">
                  <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Chọn nhanh số phút mục tiêu mỗi ngày:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {GOAL_PRESETS.map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => handleSaveGoal(mins)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          targetClock.dailyGoalMinutes === mins
                            ? 'bg-[#2383e2] text-white border-[#1d6fc2] shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-[#2383e2]'
                        }`}
                      >
                        {mins} phút
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TARGET END TIME CONFIGURATION */}
              <form onSubmit={handleSaveEndTime} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                      <BellRing className="w-4 h-4 text-amber-500" />
                      <span>Đồng Hồ Hẹn Giờ Kết Thúc Ca Học (Giờ Hà Nội)</span>
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Đặt mốc giờ bạn muốn kết thúc buổi học đêm (Ví dụ: 23:00 hoặc 00:30)
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="time"
                    value={inputEndTime}
                    onChange={(e) => setInputEndTime(e.target.value)}
                    className="p-2 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono font-bold text-sm focus:border-[#2383e2] outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#2383e2] hover:bg-[#1a73e8] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    Lưu Giờ Mục Tiêu
                  </button>
                </div>
              </form>

              {/* QUICK STUDY ACTION BUTTONS */}
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="font-bold text-xs text-indigo-950 dark:text-indigo-200">
                    Bắt đầu tích lũy vết thời gian ngay bây giờ:
                  </span>
                  <p className="text-[11px] text-indigo-800 dark:text-indigo-300">
                    Mỗi phút học tập sẽ được hệ thống lưu vết chính xác theo Giờ Hà Nội.
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPomodoro?.();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>Bật Pomodoro 25p</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleManualQuickLog(15)}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 hover:bg-indigo-100 font-bold text-xs transition-all cursor-pointer"
                    title="Ghi nhận nhanh 15 phút ôn sách/vở thủ công"
                  >
                    <span>+15p Học Ngoài</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* =========================================================
              TAB 2: VẾT THỜI GIAN HỌC TẬP (AUDIT TRACE LOGS)
              ========================================================= */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setLogsFilter('today')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      logsFilter === 'today'
                        ? 'bg-[#2383e2] text-white border-[#1d6fc2]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    Hôm Nay ({getStudyTimeLogs('today').length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setLogsFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      logsFilter === 'all'
                        ? 'bg-[#2383e2] text-white border-[#1d6fc2]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    Toàn Bộ Lịch Sử ({getStudyTimeLogs().length})
                  </button>
                </div>

                {logs.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1 font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Vết Thời Gian</span>
                  </button>
                )}
              </div>

              {/* Summary Stats Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-white/10">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">TỔNG THỜI GIAN ĐÃ HỌC</span>
                  <strong className="text-base font-extrabold text-[#2383e2] dark:text-sky-400">
                    {logs.reduce((sum, item) => sum + (item.durationMinutes || 0), 0)} phút
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-white/10">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">SỐ LƯỢT HOẠT ĐỘNG</span>
                  <strong className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {logs.length} phiên
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-white/10 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">TỔNG ĐIỂM XP NHẬN ĐƯỢC</span>
                  <strong className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                    +{logs.reduce((sum, item) => sum + (item.xpGained || 0), 0)} XP
                  </strong>
                </div>
              </div>

              {/* List of trace entries */}
              {logs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 space-y-2">
                  <Clock className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-xs font-semibold">Chưa có vết thời gian nào được ghi nhận {logsFilter === 'today' ? 'trong ngày hôm nay' : ''}.</p>
                  <p className="text-[11px] text-slate-400">Bật Pomodoro hoặc luyện đề trắc nghiệm để hệ thống tự động lưu vết học tập!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {logs.map((log) => {
                    const iconMap = {
                      pomodoro: '⏱️',
                      quiz: '🎯',
                      flashcard: '🗂️',
                      checkin: '🎁',
                      target_goal: '🏆',
                      study: '📖'
                    };
                    const emoji = iconMap[log.type] || '📝';

                    return (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 text-xs transition-colors"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span className="text-lg shrink-0">{emoji}</span>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 dark:text-white block truncate">
                              {log.title}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              {log.hanoiTime} • ngày {log.hanoiDate.split('-').reverse().join('/')} (Giờ Hà Nội)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-200 border border-blue-200 dark:border-blue-700/50">
                            {log.durationMinutes} phút
                          </span>
                          {log.xpGained > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-200 dark:border-amber-700/50">
                              +{log.xpGained} XP
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
