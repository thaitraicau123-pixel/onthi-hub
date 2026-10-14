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
      <div className="bg-[#fbfbfa] p-4 rounded-xl border border-[#e9e9e8] text-[#37352f] flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        
        {/* Left Info */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-9 h-9 rounded-lg bg-white border border-[#e9e9e8] shadow-2xs text-[#37352f] flex items-center justify-center text-lg shrink-0">
            ⏳
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774]">
                ĐỒNG HỒ ĐẾM NGƯỢC
              </span>
              <span className="text-[10px] bg-[#faece3] text-[#cc782f] border border-[#f3d6c1] px-1.5 py-0.2 rounded font-semibold">
                Mục tiêu thi
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#37352f] mt-0.5 line-clamp-1">
              {examName}
            </h4>
            <p className="text-[11px] text-[#787774] font-medium flex items-center space-x-1 mt-0.5">
              <Calendar className="w-3 h-3 text-[#9b9a97]" />
              <span>Ngày thi dự kiến: {examDate.split('-').reverse().join('/')}</span>
            </p>
          </div>
        </div>

        {/* Center: Live Timer Blocks */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-center shrink-0">
          <div className="px-2.5 py-1 rounded-lg bg-white border border-[#e9e9e8] min-w-[50px] shadow-2xs">
            <span className="text-base sm:text-lg font-bold text-[#37352f]">{timeLeft.days}</span>
            <span className="block text-[8px] uppercase tracking-wider text-[#787774] font-semibold">Ngày</span>
          </div>
          <span className="text-[#9b9a97] font-bold text-sm">:</span>
          <div className="px-2.5 py-1 rounded-lg bg-white border border-[#e9e9e8] min-w-[50px] shadow-2xs">
            <span className="text-base sm:text-lg font-bold text-[#37352f]">{timeLeft.hours}</span>
            <span className="block text-[8px] uppercase tracking-wider text-[#787774] font-semibold">Giờ</span>
          </div>
          <span className="text-[#9b9a97] font-bold text-sm">:</span>
          <div className="px-2.5 py-1 rounded-lg bg-white border border-[#e9e9e8] min-w-[50px] shadow-2xs">
            <span className="text-base sm:text-lg font-bold text-[#37352f]">{timeLeft.minutes}</span>
            <span className="block text-[8px] uppercase tracking-wider text-[#787774] font-semibold">Phút</span>
          </div>
          <span className="text-[#9b9a97] font-bold text-sm">:</span>
          <div className="px-2.5 py-1 rounded-lg bg-white border border-[#e9e9e8] min-w-[50px] shadow-2xs">
            <span className="text-base sm:text-lg font-bold text-[#2383e2] font-mono">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="block text-[8px] uppercase tracking-wider text-[#787774] font-semibold">Giây</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={() => {
              setInputName(examName);
              setInputDate(examDate);
              setShowConfigModal(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#efefed] border border-[#e9e9e8] text-[#37352f] text-xs font-semibold transition-colors flex items-center space-x-1 shadow-2xs cursor-pointer"
            title="Tùy chỉnh ngày thi mục tiêu của bạn"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#787774]" />
            <span>Đổi Mục Tiêu</span>
          </button>
        </div>

      </div>

      {/* Target Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in text-[#37352f]">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#e9e9e8] shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#e9e9e8] pb-3">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-[#2383e2]" />
                <h4 className="font-bold text-sm text-[#37352f]">Thiết Lập Kỳ Thi Mục Tiêu</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="p-1 text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-medium text-[#37352f]">
              
              {/* Presets */}
              <div>
                <label className="text-[#787774] block mb-1.5">Chọn nhanh kỳ thi phổ biến:</label>
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
                      className="p-2 text-left rounded-lg bg-[#fbfbfa] hover:bg-[#f7f6f5] border border-[#e9e9e8] text-[#37352f] text-xs transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="line-clamp-1">{p.name}</span>
                      <span className="notion-tag notion-tag-blue text-[10px] shrink-0 ml-2">Còn ~{p.days}d</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-[#37352f] block mb-1 font-medium">Tên kỳ thi của bạn:</label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Ví dụ: Thi Công Chức 2026..."
                  className="w-full p-2 rounded-lg border border-[#e9e9e8] bg-[#f7f6f5] hover:bg-[#f0efed] focus:bg-white text-[#37352f] outline-none focus:border-[#2383e2] transition-colors"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-[#37352f] block mb-1 font-medium">Ngày thi chính thức:</label>
                <input
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#e9e9e8] bg-[#f7f6f5] hover:bg-[#f0efed] focus:bg-white text-[#37352f] outline-none focus:border-[#2383e2] transition-colors"
                  required
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#e9e9e8]">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#f7f6f5] hover:bg-[#f0efed] border border-[#e9e9e8] text-[#787774] hover:text-[#37352f] text-xs transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-medium shadow-2xs transition-colors cursor-pointer"
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
