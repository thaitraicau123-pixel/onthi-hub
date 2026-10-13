import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Target, Edit3, X, Check, Flame } from 'lucide-react';
import { playSound } from '../utils/storage';

const EXAM_NAME_KEY = 'onthi_target_exam_name';
const EXAM_DATE_KEY = 'onthi_target_exam_date';

// Default target: 45 days in future
const getDefaultDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 45);
  return d.toISOString().split('T')[0];
};

export default function ExamCountdownBanner({ onStartReview }) {
  const [examName, setExamName] = useState(() => {
    return localStorage.getItem(EXAM_NAME_KEY) || 'Kỳ Thi Công Chức 2026 (Vòng 1 Kiến Thức Chung)';
  });
  const [examDate, setExamDate] = useState(() => {
    return localStorage.getItem(EXAM_DATE_KEY) || getDefaultDate();
  });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [inputName, setInputName] = useState(examName);
  const [inputDate, setInputDate] = useState(examDate);

  // Real-time ticking countdown
  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(`${examDate}T08:00:00`).getTime();
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [examDate]);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!inputName.trim() || !inputDate) return;

    localStorage.setItem(EXAM_NAME_KEY, inputName.trim());
    localStorage.setItem(EXAM_DATE_KEY, inputDate);
    setExamName(inputName.trim());
    setExamDate(inputDate);
    setShowConfigModal(false);
    playSound('success');
  };

  const PRESETS = [
    { name: '🏛️ Thi Công Chức 2026 (Kiến Thức Chung)', days: 45 },
    { name: '🌍 Thi IELTS Academic Đợt Cuối Năm', days: 30 },
    { name: '💻 Phỏng Vấn IT / Software Engineer', days: 14 },
    { name: '🇯🇵 Kỳ Thi Năng Lực JLPT N2/N3', days: 60 }
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-[#240618] via-[#430c2c] to-[#1e0413] p-4 sm:p-5 rounded-3xl border border-[#f02c85]/40 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Info */}
        <div className="flex items-center space-x-3.5 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f02c85] to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
            ⏳
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-pink-300">
                ĐỒNG HỒ ĐẾM NGƯỢC NGÀY THI
              </span>
              <span className="text-[10px] bg-pink-500/20 text-pink-200 border border-pink-400/30 px-2 py-0.2 rounded-full font-bold">
                Mục tiêu
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-white mt-0.5 line-clamp-1">
              {examName}
            </h4>
            <p className="text-[11px] text-pink-200/80 font-medium flex items-center space-x-1 mt-0.5">
              <Calendar className="w-3 h-3 text-pink-400" />
              <span>Ngày thi dự kiến: {examDate.split('-').reverse().join('/')}</span>
            </p>
          </div>
        </div>

        {/* Center: Live Timer Blocks */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-center shrink-0">
          <div className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 min-w-[56px] shadow-xs">
            <span className="text-xl sm:text-2xl font-black text-[#ff85ba]">{timeLeft.days}</span>
            <span className="block text-[9px] uppercase tracking-wider text-pink-200/80 font-bold">Ngày</span>
          </div>
          <span className="text-pink-300 font-bold text-lg">:</span>
          <div className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 min-w-[56px] shadow-xs">
            <span className="text-xl sm:text-2xl font-black text-amber-300">{timeLeft.hours}</span>
            <span className="block text-[9px] uppercase tracking-wider text-pink-200/80 font-bold">Giờ</span>
          </div>
          <span className="text-pink-300 font-bold text-lg">:</span>
          <div className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 min-w-[56px] shadow-xs">
            <span className="text-xl sm:text-2xl font-black text-emerald-300">{timeLeft.minutes}</span>
            <span className="block text-[9px] uppercase tracking-wider text-pink-200/80 font-bold">Phút</span>
          </div>
          <span className="text-pink-300 font-bold text-lg">:</span>
          <div className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 min-w-[56px] shadow-xs">
            <span className="text-xl sm:text-2xl font-black text-sky-300 font-mono">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="block text-[9px] uppercase tracking-wider text-pink-200/80 font-bold">Giây</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end shrink-0">
          <button
            onClick={() => {
              setInputName(examName);
              setInputDate(examDate);
              setShowConfigModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-pink-200 hover:text-white text-xs font-bold transition-colors flex items-center space-x-1"
            title="Tùy chỉnh ngày thi mục tiêu của bạn"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Đổi Mục Tiêu</span>
          </button>
        </div>

      </div>

      {/* Target Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-[#28071a]">
          <div className="relative w-full max-w-md bg-[#fcf7ec] rounded-3xl border-2 border-[#eadfcb] shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#eadfcb] pb-3">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-[#f02c85]" />
                <h4 className="font-black text-sm text-[#28071a]">Thiết Lập Kỳ Thi Mục Tiêu</h4>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-bold">
              
              {/* Presets */}
              <div>
                <label className="text-[#7a5a6b] block mb-1.5">Chọn nhanh kỳ thi phổ biến:</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const targetD = new Date();
                        targetD.setDate(targetD.getDate() + p.days);
                        setInputName(p.name);
                        setInputDate(targetD.toISOString().split('T')[0]);
                      }}
                      className="p-2 text-left rounded-xl bg-white hover:bg-pink-50 border border-[#eadfcb] text-[#28071a] font-bold text-xs transition-colors flex items-center justify-between"
                    >
                      <span className="line-clamp-1">{p.name}</span>
                      <span className="text-[10px] text-[#f02c85] font-black shrink-0 ml-2">Còn ~{p.days}d</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-[#28071a] block mb-1">Tên kỳ thi của bạn:</label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Ví dụ: Thi Công Chức 2026..."
                  className="w-full p-2.5 rounded-xl border border-[#eadfcb] bg-white text-[#28071a] outline-none font-bold"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-[#28071a] block mb-1">Ngày thi chính thức:</label>
                <input
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#eadfcb] bg-white text-[#28071a] outline-none font-bold"
                  required
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#eadfcb]">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#eadfcb] text-slate-600 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-wayground-sunset text-white text-xs font-black shadow-md"
                >
                  Lưu & Đếm Ngược
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}
