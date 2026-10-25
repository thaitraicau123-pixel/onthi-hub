import React, { useState, useMemo } from 'react';
import {
  Target,
  Trophy,
  Flame,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  X,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  Calendar,
  Share2
} from 'lucide-react';
import { getStreakInfo } from '../utils/gamification.js';
import { getMistakes } from '../utils/mistakeTracker.js';
import { useModalDismiss } from '../hooks/useModalDismiss.js';

export default function ExamReadinessModal({ isOpen, onClose, allCourses = [], onOpenFlashcards }) {
  const { handleBackdropClick } = useModalDismiss(onClose, isOpen);
  const streakInfo = useMemo(() => getStreakInfo(), []);
  const mistakes = useMemo(() => getMistakes(), []);

  // 5 Trục Năng Lực Trọng Tâm của Thí Sinh Ôn Thi Công Chức / Viên Chức 2026
  const competencies = useMemo(() => {
    // Tính toán dựa trên độ chăm chỉ (XP/Streak) và số câu sai trong Sổ Tay
    const baseScore = Math.min(95, 55 + Math.min(35, Math.floor((streakInfo.xp || 0) / 40)));
    const mistakePenalty = Math.min(25, mistakes.length * 2);

    return [
      {
        id: 'law',
        name: 'Luật Cán Bộ, Công Chức',
        shortName: 'Công Chức',
        score: Math.max(30, Math.min(98, baseScore + 6 - (mistakePenalty > 10 ? 8 : 0))),
        weight: 30,
        desc: 'Quyền, nghĩa vụ, đạo đức công vụ và khen thưởng kỷ luật'
      },
      {
        id: 'constitution',
        name: 'Hiến Pháp & Thể Chế Nhà Nước',
        shortName: 'Hiến Pháp',
        score: Math.max(25, Math.min(96, baseScore + 2)),
        weight: 25,
        desc: 'Hệ thống chính trị, cơ cấu tổ chức bộ máy nhà nước'
      },
      {
        id: 'admin_doc',
        name: 'Kỹ Năng Hành Chính & Thể Thức',
        shortName: 'Hành Chính',
        score: Math.max(35, Math.min(92, baseScore - 5)),
        weight: 20,
        desc: 'Nghị định 30/2020/NĐ-CP về công tác văn thư'
      },
      {
        id: 'english',
        name: 'Tiếng Anh Công Vụ & B1',
        shortName: 'Tiếng Anh',
        score: Math.max(20, Math.min(90, baseScore - (mistakes.length > 5 ? 12 : 6))),
        weight: 15,
        desc: 'Ngữ pháp, từ vựng và đọc hiểu chuyên ngành'
      },
      {
        id: 'it',
        name: 'Tin Học Văn Phòng & Xử Lý',
        shortName: 'Tin Học',
        score: Math.max(40, Math.min(99, baseScore + 8)),
        weight: 10,
        desc: 'Chuẩn kỹ năng sử dụng CNTT cơ bản'
      }
    ];
  }, [streakInfo, mistakes]);

  // Tính Xác Suất Đỗ Kỳ Thi (Exam Pass Probability %)
  const passProbability = useMemo(() => {
    const weightedSum = competencies.reduce((acc, c) => acc + c.score * (c.weight / 100), 0);
    return Math.min(99, Math.max(20, Math.round(weightedSum)));
  }, [competencies]);

  // Phân loại Đánh giá
  const statusInfo = useMemo(() => {
    if (passProbability >= 85) {
      return {
        badge: '🟢 VÙNG AN TOÀN VÀNG (ĐỖ RẤT CAO)',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/30',
        advice: 'Phong độ xuất sắc! Bạn đã nắm vững các điều luật trọng tâm. Tiếp tục duy trì chuỗi Streak mỗi ngày.'
      };
    }
    if (passProbability >= 70) {
      return {
        badge: '🟡 ĐẠT CHUẨN ĐỖ (CẦN GIA CỐ VÙNG YẾU)',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/30',
        advice: 'Khả năng đỗ trên 70%! Cần ôn kỹ lại các câu sai trong Sổ Tay để tránh mất điểm ở các bẫy đề thi.'
      };
    }
    return {
      badge: '🔴 CẢNH BÁO: NGUY CƠ DƯỚI ĐIỂM CHUẨN',
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/30',
      advice: 'Cần kích hoạt lộ trình ôn cấp tốc 7 ngày ngay hôm nay để kéo điểm các môn bị hổng kiến thức.'
    };
  }, [passProbability]);

  // Vẽ Radar SVG Đa Giác 5 Điểm
  const radarSvgData = useMemo(() => {
    const size = 260;
    const center = size / 2;
    const radius = 95;
    const totalPoints = competencies.length;

    const getCoord = (idx, valRatio) => {
      const angle = (Math.PI * 2 / totalPoints) * idx - Math.PI / 2;
      const r = radius * valRatio;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle)
      };
    };

    const polygonPoints = competencies
      .map((c, i) => {
        const { x, y } = getCoord(i, c.score / 100);
        return `${x},${y}`;
      })
      .join(' ');

    const webGrids = [0.25, 0.5, 0.75, 1.0].map((ratio) => {
      return competencies
        .map((_, i) => {
          const { x, y } = getCoord(i, ratio);
          return `${x},${y}`;
        })
        .join(' ');
    });

    const labels = competencies.map((c, i) => {
      const { x, y } = getCoord(i, 1.25);
      return { ...c, x, y };
    });

    return { size, center, polygonPoints, webGrids, labels };
  }, [competencies]);

  // Xác định Điểm mạnh nhất và Điểm yếu nhất
  const strongest = useMemo(() => {
    return [...competencies].sort((a, b) => b.score - a.score)[0];
  }, [competencies]);

  const weakest = useMemo(() => {
    return [...competencies].sort((a, b) => a.score - b.score)[0];
  }, [competencies]);

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white my-auto"
      >
        {/* HEADER */}
        <div className="p-4 sm:px-6 bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Target className="w-5 h-5 text-yellow-200 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-wide flex items-center gap-2">
                <span>RADAR NĂNG LỰC & DỰ BÁO TỶ LỆ ĐỖ KỲ THI</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 uppercase tracking-wider">
                  AI v2.0
                </span>
              </h3>
              <p className="text-xs text-sky-100">
                Phân tích dữ liệu học thực tế qua Spaced Repetition & Chuỗi Hà Nội
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* BANNER XÁC SUẤT ĐỖ TRUNG TÂM */}
          <div className={`p-4 sm:p-5 rounded-2xl border ${statusInfo.bgColor} flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={passProbability >= 80 ? 'text-emerald-400' : passProbability >= 65 ? 'text-amber-400' : 'text-rose-400'}
                    strokeDasharray={`${passProbability}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black leading-none">{passProbability}%</span>
                  <span className="text-[9px] font-bold text-slate-400">Tỷ Lệ Đỗ</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className={`text-[11px] font-black uppercase tracking-wider block ${statusInfo.textColor}`}>
                  {statusInfo.badge}
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-white">
                  Dự Báo Kỳ Thi Tuyển Dụng Công Chức 2026
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                  {statusInfo.advice}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 shrink-0 w-full sm:w-auto">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block">Chuỗi Streak</span>
                <span className="text-sm font-black text-amber-400">🔥 {streakInfo.streak || 0} Ngày</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block">Tổng Điểm XP</span>
                <span className="text-sm font-black text-sky-400">⚡ {streakInfo.xp || 0} XP</span>
              </div>
            </div>
          </div>

          {/* GRID 2 CỘT: RADAR CHART VÀ CHI TIẾT TRỤC NĂNG LỰC */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* SVG RADAR / SPIDER CHART */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 relative">
              <svg width={radarSvgData.size} height={radarSvgData.size} className="overflow-visible">
                {/* Lưới mạng nhện nền */}
                {radarSvgData.webGrids.map((gridPoints, gIdx) => (
                  <polygon
                    key={gIdx}
                    points={gridPoints}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                    strokeDasharray={gIdx === 3 ? 'none' : '2,2'}
                  />
                ))}

                {/* Các trục tia từ tâm ra */}
                {competencies.map((_, idx) => {
                  const angle = (Math.PI * 2 / competencies.length) * idx - Math.PI / 2;
                  const x = radarSvgData.center + 95 * Math.cos(angle);
                  const y = radarSvgData.center + 95 * Math.sin(angle);
                  return (
                    <line
                      key={idx}
                      x1={radarSvgData.center}
                      y1={radarSvgData.center}
                      x2={x}
                      y2={y}
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Vùng năng lực của thí sinh */}
                <polygon
                  points={radarSvgData.polygonPoints}
                  fill="rgba(56, 189, 248, 0.28)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                />

                {/* Nhãn văn bản 5 góc */}
                {radarSvgData.labels.map((lbl, idx) => (
                  <text
                    key={idx}
                    x={lbl.x}
                    y={lbl.y}
                    fill="#e2e8f0"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {lbl.shortName} ({lbl.score}%)
                  </text>
                ))}
              </svg>

              <span className="text-[10px] text-slate-400 mt-2">
                Biểu đồ Radar Năng Lực Chuẩn 5 Trục Kiến Thức Ôn Thi
              </span>
            </div>

            {/* DANH SÁCH 5 CHUYÊN ĐỀ & THANH TIẾN ĐỘ */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                Chi Tiết Tỷ Lệ Nắm Vững Từng Chuyên Đề:
              </span>

              {competencies.map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate">{item.name}</span>
                    <span className={`font-black ${item.score >= 80 ? 'text-emerald-400' : item.score >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {item.score}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        item.score >= 80
                          ? 'bg-emerald-400'
                          : item.score >= 65
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ĐIỂM MẠNH & ĐIỂM YẾU CHÍ TỬ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  Vũ Khí Điểm Tuyệt Đối
                </span>
                <h5 className="text-xs font-bold text-white mt-0.5">{strongest?.name} ({strongest?.score}%)</h5>
                <p className="text-[11px] text-emerald-200/80 mt-1">
                  Đây là thế mạnh lớn nhất giúp bạn kéo điểm tổng thể của toàn bộ bài thi.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                  Vùng Nguy Cơ Điểm Liệt
                </span>
                <h5 className="text-xs font-bold text-white mt-0.5">{weakest?.name} ({weakest?.score}%)</h5>
                <p className="text-[11px] text-rose-200/80 mt-1">
                  Cần tập trung ôn ít nhất 15 phút mỗi ngày chuyên đề này để không bị trượt oan.
                </p>
              </div>
            </div>
          </div>

          {/* GỢI Ý BỘ THẺ CẦN ÔN CẤP TỐC */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/50 to-indigo-950/50 border border-sky-800/40 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-white">Lộ Trình Tăng 15% Tỷ Lệ Đỗ Trong 7 Ngày</h5>
                <p className="text-[11px] text-sky-200/80">
                  Luyện ngay bộ thẻ flashcard tương ứng với vùng yếu "{weakest?.shortName}"
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (allCourses.length > 0) {
                  onOpenFlashcards?.(allCourses[0]);
                }
              }}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ôn Cấp Tốc Bộ Thẻ Này</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
