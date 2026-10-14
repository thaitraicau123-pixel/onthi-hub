import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Bot,
  Copy,
  Check,
  Volume2,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/storage';
import { playClockTick, playCountdownWarningBeep } from '../utils/pomodoroAudio';
import { explainQuizQuestionWithAi } from '../utils/aiTutor';
import { recordMistake } from '../utils/mistakeTracker';

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

  // AI Tutor State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiExplanations, setAiExplanations] = useState({});
  const [aiError, setAiError] = useState('');
  const [copiedAiText, setCopiedAiText] = useState(false);
  const [activeAiQuestionIdx, setActiveAiQuestionIdx] = useState(0);

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

    // Automatically record mistakes to notebook
    questions.forEach((q, idx) => {
      const userAns = selectedAnswers[idx];
      if (userAns !== undefined && userAns !== q.correct) {
        recordMistake({
          type: 'quiz',
          deckId: course.id,
          deckTitle: course.title,
          question: q.question,
          answer: q.options[q.correct],
          userChoice: q.options[userAns],
          options: q.options,
          correctIndex: q.correct,
          explanation: q.explanation
        });
      }
    });

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

  // Keyboard navigation & option selection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (!isSubmitted) {
        if (e.key === '1' || e.key === 'a' || e.key === 'A') {
          if (currentQ.options && currentQ.options.length > 0) handleSelectOption(0);
        } else if (e.key === '2' || e.key === 'b' || e.key === 'B') {
          if (currentQ.options && currentQ.options.length > 1) handleSelectOption(1);
        } else if (e.key === '3' || e.key === 'c' || e.key === 'C') {
          if (currentQ.options && currentQ.options.length > 2) handleSelectOption(2);
        } else if (e.key === '4' || e.key === 'd' || e.key === 'D') {
          if (currentQ.options && currentQ.options.length > 3) handleSelectOption(3);
        }
      }

      if (e.key === 'ArrowRight') {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isSubmitted, questions.length, currentQ]);

  const handleAskAiTutor = async (targetIdx = currentIndex) => {
    setActiveAiQuestionIdx(targetIdx);
    setAiDrawerOpen(true);
    setAiError('');

    if (aiExplanations[targetIdx]) {
      return;
    }

    const q = questions[targetIdx];
    if (!q) return;

    setIsAiLoading(true);
    try {
      const res = await explainQuizQuestionWithAi({
        question: q.question,
        options: q.options,
        correct: q.correct,
        userAnswer: selectedAnswers[targetIdx],
        explanation: q.explanation,
        title: course.title
      });

      if (res.success) {
        setAiExplanations((prev) => ({ ...prev, [targetIdx]: res.content }));
        playSound('success');
      } else {
        setAiError(res.message);
      }
    } catch (e) {
      setAiError(e.message || 'Lỗi kết nối Trợ lý AI');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyAiText = () => {
    const text = aiExplanations[activeAiQuestionIdx] || '';
    navigator.clipboard.writeText(text);
    playSound('success');
    setCopiedAiText(true);
    setTimeout(() => setCopiedAiText(false), 2500);
  };

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
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
                          <p className="text-[11px] text-[#787774] bg-[#fbfbfa] p-2 rounded-lg mt-1 border border-[#e9e9e8]">
                            💡 {q.explanation}
                          </p>
                          <button
                            onClick={() => handleAskAiTutor(idx)}
                            className="mt-2 text-[11px] font-medium text-[#2b7aa1] hover:text-[#1a73e8] bg-[#e7f3f8] hover:bg-[#d8ecf5] border border-[#cbe3ed] px-2.5 py-1 rounded-lg inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-[#2383e2]" />
                            <span>Bóc Mẽ Bẫy & Mẹo Khoanh 10s Bằng AI</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-[#e9e9e8] bg-[#f7f6f5] hover:bg-[#f0efed] text-[#37352f] font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
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
                    className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-xs text-white bg-[#2383e2] hover:bg-[#1a73e8] shadow-2xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Coins className="w-4 h-4 text-white" />
                    <span>Mở Khóa Toàn Bộ Đề Thi ({course.priceXu || 25} Xu)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Question Body */
            <div>
              <div className="mb-4">
                <span className="notion-tag notion-tag-blue text-xs font-semibold">
                  Câu hỏi {currentIndex + 1}
                </span>
                <h3 className="mt-2 text-base sm:text-lg font-bold text-[#37352f] leading-snug whitespace-pre-line">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2 mt-4">
                {currentQ.options?.map((opt, optIdx) => {
                  const isSelected = currentSelected === optIdx;
                  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3 text-left rounded-xl text-xs sm:text-sm transition-all border flex items-center space-x-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#2383e2] bg-[#e7f3f8] text-[#37352f] font-medium ring-1 ring-[#2383e2]'
                          : 'border-[#e9e9e8] hover:border-[#c5c4c0] hover:bg-[#fbfbfa] text-[#37352f]'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#2383e2] text-white shadow-2xs'
                          : 'bg-[#f7f6f5] text-[#787774] border border-[#e9e9e8]'
                      }`}>
                        {optionLetters[optIdx] || optIdx + 1}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hotkey Hint Bar */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-[#787774]">
                <span>⌨️ Bấm phím <strong>1, 2, 3, 4</strong> (hoặc <strong>A, B, C, D</strong>) để chọn nhanh</span>
                <span>Phím <strong>← / →</strong> để chuyển câu</span>
              </div>

              {/* If answered, show instant hint/explanation and AI Tutor trigger */}
              {isAnswered && (
                <div className="mt-4 space-y-2.5">
                  <div className="p-3 bg-[#e7f3f8] rounded-xl border border-[#cbe3ed] text-xs text-[#2b7aa1]">
                    <div className="flex items-center space-x-1.5 font-semibold mb-1">
                      <HelpCircle className="w-3.5 h-3.5 text-[#2383e2]" />
                      <span>Gợi ý & Căn cứ giải thích:</span>
                    </div>
                    <p className="leading-relaxed text-[#2b7aa1]">
                      {currentQ.explanation}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAskAiTutor(currentIndex)}
                    className="w-full py-2 px-4 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-medium shadow-2xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>✨ Bóc Mẽ Chiêu Trò Cài Bẫy & Mẹo 10s Bằng Trí Tuệ Nhân Tạo AI</span>
                  </button>
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

      {/* AI Tutor Slide-over Drawer / Modal */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] bg-white rounded-2xl border border-[#e9e9e8] shadow-2xl overflow-hidden flex flex-col text-[#37352f]">
            
            {/* Drawer Header */}
            <div className="px-5 py-3.5 bg-[#fbfbfa] text-[#37352f] flex items-center justify-between border-b border-[#e9e9e8]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e7f3f8] text-[#2b7aa1] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-tight flex items-center space-x-1.5">
                    <span>Trợ Lý Giảng Viên AI OnThiHub</span>
                    <span className="notion-tag notion-tag-blue text-[10px]">
                      Pro Turbo
                    </span>
                  </h4>
                  <p className="text-[11px] text-[#787774] font-normal">
                    Câu {activeAiQuestionIdx + 1} • Bóc mẽ bẫy đề thi & mẹo khoanh 10s
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                {aiExplanations[activeAiQuestionIdx] && (
                  <>
                    <button
                      onClick={() => handleSpeak(aiExplanations[activeAiQuestionIdx])}
                      className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-[#f0efed] rounded-lg transition-colors cursor-pointer"
                      title="Nghe giảng qua giọng đọc AI"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCopyAiText}
                      className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-[#f0efed] rounded-lg transition-colors cursor-pointer"
                      title="Copy nội dung giải thích"
                    >
                      {copiedAiText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setAiDrawerOpen(false)}
                  className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-[#f0efed] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs sm:text-sm">
              
              {/* Question Context Recap */}
              {questions[activeAiQuestionIdx] && (
                <div className="p-3 bg-[#fbfbfa] rounded-xl border border-[#e9e9e8] space-y-2">
                  <span className="notion-tag notion-tag-gray text-[10px]">
                    CÂU HỎI {activeAiQuestionIdx + 1}
                  </span>
                  <p className="font-semibold text-[#37352f]">
                    {questions[activeAiQuestionIdx].question}
                  </p>
                  
                  <div className="pt-2 border-t border-[#f0efed] flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-[#edf3ec] text-[#448361] border border-[#d3e5d7] font-medium text-[11px]">
                      ✅ Đáp án đúng: {questions[activeAiQuestionIdx].options?.[questions[activeAiQuestionIdx].correct]}
                    </span>
                    {selectedAnswers[activeAiQuestionIdx] !== undefined && selectedAnswers[activeAiQuestionIdx] !== questions[activeAiQuestionIdx].correct && (
                      <span className="px-2 py-0.5 rounded-md bg-[#fdebec] text-[#d44c47] border border-[#f9c9cb] font-medium text-[11px]">
                        ❌ Bạn đã chọn: {questions[activeAiQuestionIdx].options?.[selectedAnswers[activeAiQuestionIdx]]}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* AI Content Loading State */}
              {isAiLoading && (
                <div className="py-10 flex flex-col items-center justify-center space-y-2.5">
                  <div className="w-8 h-8 border-3 border-[#2383e2] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-[#787774] animate-pulse">
                    Hệ thống AI đang soi bẫy thi & tổng hợp quy tắc khoanh nhanh 10 giây...
                  </p>
                </div>
              )}

              {/* AI Error */}
              {aiError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {aiError}
                </div>
              )}

              {/* AI Explanation Formatted Result */}
              {aiExplanations[activeAiQuestionIdx] && (
                <div className="p-4 bg-white rounded-xl border border-[#e9e9e8] text-xs sm:text-sm text-[#37352f] leading-relaxed whitespace-pre-line space-y-2">
                  {aiExplanations[activeAiQuestionIdx]}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-5 py-3 bg-[#fbfbfa] border-t border-[#e9e9e8] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#787774]">
                🎯 Luyện phản xạ nhận diện bẫy đề thi thật cùng ÔnThiHub
              </span>
              <button
                onClick={() => setAiDrawerOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-[#37352f] text-white text-xs font-medium hover:bg-[#201f1d] cursor-pointer"
              >
                Đóng lại
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
