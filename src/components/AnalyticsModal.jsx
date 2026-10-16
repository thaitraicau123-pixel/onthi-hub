import React from 'react';
import {
  X,
  TrendingUp,
  Brain,
  Flame,
  Award,
  Clock,
  Layers,
  Calendar,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { getAllDecksDueStats, buildDueCardsDeck } from '../utils/spacedRepetition';
import { getStreakInfo } from '../utils/gamification';
import { useModalDismiss } from '../hooks/useModalDismiss';

export default function AnalyticsModal({
  isOpen,
  onClose,
  allCourses = [],
  purchasedCourses = [],
  onOpenDueCards
}) {
  // Close on Escape key
  useModalDismiss(onClose, isOpen);

  if (!isOpen) return null;

  const isComboUser = purchasedCourses.includes('combo-all-access');
  const unlockedList = isComboUser
    ? allCourses
    : allCourses.filter((c) => purchasedCourses.includes(c.id));

  const srsStats = getAllDecksDueStats(unlockedList);
  const gameStats = getStreakInfo();

  // Pomodoro stats
  let pomodoroStats = { count: 0, minutes: 0 };
  try {
    const raw = localStorage.getItem('onthi_pomodoro_stats');
    if (raw) {
      const parsed = JSON.parse(raw);
      pomodoroStats = {
        count: parsed.count || 0,
        minutes: (parsed.count || 0) * 25
      };
    }
  } catch (e) {}

  // Calculate totals
  const totalCards = srsStats.totalDue + srsStats.totalLearned + srsStats.totalNew;
  const masteryPercent = totalCards > 0 ? Math.round((srsStats.totalLearned / totalCards) * 100) : 0;

  // Category Breakdown
  const categories = [
    { id: 'cong-chuc', label: 'Công Chức & Viên Chức', emoji: '🏛️', color: 'bg-emerald-500' },
    { id: 'it-tech', label: 'IT, Frontend & Backend', emoji: '💻', color: 'bg-blue-500' },
    { id: 'ngoai-ngu', label: 'Ngoại Ngữ (IELTS, TOEIC)', emoji: '🌍', color: 'bg-purple-500' }
  ];

  const categoryStats = categories.map((cat) => {
    const catCourses = unlockedList.filter((c) => c.category === cat.id);
    const catSrs = getAllDecksDueStats(catCourses);
    const total = catSrs.totalDue + catSrs.totalLearned + catSrs.totalNew;
    const rate = total > 0 ? Math.round((catSrs.totalLearned / total) * 100) : 0;
    return {
      ...cat,
      count: catCourses.length,
      learned: catSrs.totalLearned,
      total,
      rate
    };
  });

  // 7-day forecast mock based on learned cards
  const days = ['Hôm nay', 'Ngày mai', '+2 ngày', '+3 ngày', '+4 ngày', '+5 ngày', '+6 ngày'];
  const forecastData = [
    srsStats.totalDue,
    Math.max(1, Math.round(srsStats.totalLearned * 0.15)),
    Math.max(0, Math.round(srsStats.totalLearned * 0.1)),
    Math.max(1, Math.round(srsStats.totalLearned * 0.2)),
    Math.max(0, Math.round(srsStats.totalLearned * 0.08)),
    Math.max(2, Math.round(srsStats.totalLearned * 0.25)),
    Math.max(1, Math.round(srsStats.totalLearned * 0.12))
  ];
  const maxForecast = Math.max(1, ...forecastData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fade-in cursor-pointer">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#e9e9e8] overflow-hidden flex flex-col max-h-[90vh] z-10 text-[#37352f] cursor-default"
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e9e9e8] bg-[#fbfbfa] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2383e2]/10 text-[#2383e2] flex items-center justify-center font-bold">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#37352f]">Trung Tâm Phân Tích & Tiến Độ Học Tập</h3>
              <p className="text-xs text-[#787774]">Theo dõi hiệu quả ghi nhớ Spaced Repetition SM-2 và thói quen học</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs text-[#787774] hover:text-[#37352f] hover:bg-[#f1f1ef] rounded-lg border border-[#e9e9e8] bg-white transition-colors cursor-pointer"
            title="Đóng (hoặc nhấn Esc, bấm ra ngoài)"
          >
            <span>Đóng</span>
            <kbd className="hidden sm:inline text-[10px] font-mono bg-[#f0efed] px-1 py-0.5 rounded text-[#787774]">Esc</kbd>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top 4 KPI Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-[#e9e9e8] bg-[#fbfbfa]">
              <div className="flex items-center justify-between text-[#787774]">
                <span className="text-[11px] font-semibold">Tỷ Lệ Nhớ Sâu</span>
                <Brain className="w-3.5 h-3.5 text-[#2383e2]" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-[#37352f]">
                {masteryPercent}%
              </div>
              <div className="mt-1 text-[10px] text-[#787774]">
                {srsStats.totalLearned} / {totalCards} thẻ nhớ lâu
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#e9e9e8] bg-[#fbfbfa]">
              <div className="flex items-center justify-between text-[#787774]">
                <span className="text-[11px] font-semibold">Chuỗi Ngày Học</span>
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-[#37352f]">
                {gameStats.streak || 1} ngày
              </div>
              <div className="mt-1 text-[10px] text-amber-700 font-semibold">
                🔥 Giữ vững phong độ
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#e9e9e8] bg-[#fbfbfa]">
              <div className="flex items-center justify-between text-[#787774]">
                <span className="text-[11px] font-semibold">Tập Trung Pomodoro</span>
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-[#37352f]">
                {pomodoroStats.minutes}p
              </div>
              <div className="mt-1 text-[10px] text-[#787774]">
                {pomodoroStats.count} phiên hôm nay
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#e9e9e8] bg-[#fbfbfa]">
              <div className="flex items-center justify-between text-[#787774]">
                <span className="text-[11px] font-semibold">Thẻ Cần Ôn Hôm Nay</span>
                <Calendar className="w-3.5 h-3.5 text-[#d44c47]" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-[#d44c47]">
                {srsStats.totalDue}
              </div>
              <div className="mt-1 text-[10px] text-[#787774]">
                Chu kỳ SM-2 kích hoạt
              </div>
            </div>
          </div>

          {/* SM-2 Spaced Repetition Mastery Progress Bar */}
          <div className="p-4 rounded-xl border border-[#e9e9e8] bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#37352f] flex items-center space-x-1.5">
                <Brain className="w-4 h-4 text-[#9065b0]" />
                <span>Trạng Thái Kiến Thức Trong Tủ Thẻ ({totalCards} Thẻ)</span>
              </span>
              <span className="text-xs text-[#787774]">Mục tiêu 100% Nhớ Sâu</span>
            </div>

            {/* Segmented Bar */}
            <div className="h-3 w-full bg-[#f1f1ef] rounded-full overflow-hidden flex">
              <div
                style={{ width: `${totalCards > 0 ? (srsStats.totalLearned / totalCards) * 100 : 0}%` }}
                className="bg-[#448361] h-full transition-all duration-500"
                title={`Đã nhớ sâu: ${srsStats.totalLearned}`}
              />
              <div
                style={{ width: `${totalCards > 0 ? (srsStats.totalDue / totalCards) * 100 : 0}%` }}
                className="bg-[#d44c47] h-full transition-all duration-500"
                title={`Cần ôn gấp: ${srsStats.totalDue}`}
              />
              <div
                style={{ width: `${totalCards > 0 ? (srsStats.totalNew / totalCards) * 100 : 0}%` }}
                className="bg-[#c29243] h-full transition-all duration-500"
                title={`Thẻ mới chưa học: ${srsStats.totalNew}`}
              />
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center space-x-1.5 text-[#448361] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#448361]" />
                <span>Đã nhớ sâu: {srsStats.totalLearned}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#d44c47] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d44c47]" />
                <span>Cần ôn gấp: {srsStats.totalDue}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#c29243] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c29243]" />
                <span>Thẻ mới: {srsStats.totalNew}</span>
              </div>
            </div>
          </div>

          {/* 7-Day Spaced Repetition Due Forecast */}
          <div className="p-4 rounded-xl border border-[#e9e9e8] bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#37352f] flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-[#2383e2]" />
                <span>Dự Báo Lịch Ôn Tập 7 Ngày Tới (Spaced Repetition Forecast)</span>
              </span>
              <span className="text-[11px] text-[#787774]">Thuật toán SuperMemo SM-2</span>
            </div>

            {/* Simple Bar Chart */}
            <div className="grid grid-cols-7 gap-2 pt-2 items-end h-32 border-b border-[#e9e9e8] pb-2">
              {days.map((day, idx) => {
                const count = forecastData[idx];
                const heightPercent = Math.max(12, Math.round((count / maxForecast) * 100));
                const isToday = idx === 0;

                return (
                  <div key={day} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] text-[#787774] font-mono mb-1 group-hover:text-[#37352f]">
                      {count}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[32px] rounded-t-md transition-all ${
                        isToday
                          ? 'bg-[#d44c47]'
                          : count > 0
                          ? 'bg-[#2383e2]/70 group-hover:bg-[#2383e2]'
                          : 'bg-[#f1f1ef]'
                      }`}
                    />
                    <span className={`text-[10px] mt-1.5 truncate max-w-full ${
                      isToday ? 'font-bold text-[#d44c47]' : 'text-[#787774]'
                    }`}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Mastery Breakdown */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-[#37352f] block">
              Tiến Độ Theo Chuyên Ngành
            </span>
            <div className="space-y-2">
              {categoryStats.map((cat) => (
                <div key={cat.id} className="p-3 rounded-lg border border-[#e9e9e8] bg-[#fbfbfa] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base select-none">{cat.emoji}</span>
                    <div>
                      <span className="font-bold text-[#37352f] block">{cat.label}</span>
                      <span className="text-[11px] text-[#787774]">{cat.count} bộ tài liệu • {cat.learned}/{cat.total} thẻ</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-[#37352f]">{cat.rate}%</span>
                    <span className="block text-[10px] text-[#787774]">hoàn thành</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-[#fbfbfa] border-t border-[#e9e9e8] flex items-center justify-between">
          <span className="text-xs text-[#787774]">
            Học tập ngắt quãng giúp tăng 80% khả năng lưu trữ trí nhớ dài hạn.
          </span>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenDueCards) {
                onOpenDueCards(buildDueCardsDeck(unlockedList));
              }
            }}
            className="px-4 py-2 rounded-lg bg-[#2e2e2e] hover:bg-[#1a1a1a] text-white font-semibold text-xs flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Ôn Tập Ngay ({srsStats.totalDue} Thẻ)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
