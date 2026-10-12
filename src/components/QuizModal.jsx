import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2, AlertCircle, HelpCircle, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/storage';
import { playClockTick, playCountdownWarningBeep } from '../utils/pomodoroAudio';

export default function QuizModal({
  course,
  isPurchased,
  onClose,
  onBuy
}) {
  const questions = course.previewQuiz || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  // Countdown timer with clock ticking sound
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsSubmitted(true);
          return 0;
        }
        const next = prev - 1;
        // Sound for exam clock countdown
        if (next <= 15 && next > 5) {
          playClockTick(next % 2 === 1, 0.25);
        } else if (next <= 5 && next >= 1) {
          playCountdownWarningBeep(next, 0.35);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const currentQ = questions[currentIndex] || {};
  const currentSelected = selectedAnswers[currentIndex];
  const isAnswered = currentSelected !== undefined;

  // Handle option select
  const handleSelectOption = (idx) => {
    if (isSubmitted) return;
    if (idx === currentQ.correct) {
      playSound('correct');
    } else {
      playSound('flip');
    }
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: idx
    }));
  };

  // Calculate score
  const score = Object.keys(selectedAnswers).reduce((acc, qIdx) => {
    const q = questions[qIdx];
    return acc + (selectedAnswers[qIdx] === q.correct ? 1 : 0);
  }, 0);

  const handleSubmit = () => {
    setIsSubmitted(true);
    playSound('success');
    if (score / questions.length >= 0.7) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setTimeLeft(300);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200 animate-spring-3d">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
              Q
            </span>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                Phòng Thi Thử: {course.title}
              </h4>
              <p className="text-xs text-slate-500">
                Làm bài trắc nghiệm tính giờ & xem lời giải chi tiết
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Index Dots */}
        <div className="px-5 py-2.5 bg-slate-100/60 border-b border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  currentIndex === i
                    ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                    : selectedAnswers[i] !== undefined
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Đã làm: {Object.keys(selectedAnswers).length}/{questions.length}
          </span>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-7 flex-1 overflow-y-auto">
          
          {isSubmitted ? (
            /* Results Screen */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Kết Quả Bài Thi Thử
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Bạn đã trả lời đúng{' '}
                <strong className="text-emerald-600 text-lg">{score}</strong> / {questions.length} câu
                ({Math.round((score / questions.length) * 100)}%)
              </p>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-4 max-w-lg mx-auto">
                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correct;
                  return (
                    <div key={idx} className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-start space-x-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Câu {idx + 1}: {q.question}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            Đáp án đúng: <strong>{q.options[q.correct]}</strong>
                          </p>
                          <p className="text-[11px] text-slate-500 bg-white p-2 rounded mt-1 border border-slate-100">
                            💡 {q.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm Lại Đề Này</span>
                </button>

                {!isPurchased && (
                  <button
                    onClick={() => {
                      onClose();
                      onBuy(course);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <span>Mở Khóa Toàn Bộ 600+ Câu ({course.price / 1000}K)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Question Body */
            <div>
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                  Câu hỏi {currentIndex + 1}
                </span>
                <h3 className="mt-2 text-base sm:text-lg font-bold text-slate-900 leading-snug whitespace-pre-line">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5 mt-5">
                {currentQ.options?.map((opt, optIdx) => {
                  const isSelected = currentSelected === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3.5 text-left rounded-xl text-xs sm:text-sm transition-all border ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/70 text-purple-900 font-medium ring-1 ring-purple-500'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* If answered, show instant hint/explanation */}
              {isAnswered && (
                <div className="mt-5 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900">
                  <div className="flex items-center space-x-1.5 font-bold mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Gợi ý & Căn cứ giải thích:</span>
                  </div>
                  <p className="leading-relaxed text-blue-800">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {!isSubmitted && (
          <div className="p-4 px-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              Câu Trước
            </button>

            <div className="flex items-center space-x-2">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                >
                  Câu Tiếp Theo
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                >
                  Nộp Bài & Xem Điểm
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
