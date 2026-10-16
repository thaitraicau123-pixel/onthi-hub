import React, { useState, useEffect, useMemo } from 'react';
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
  Coins,
  Flag,
  Award,
  FileCheck,
  LayoutGrid,
  ShieldCheck,
  Share2,
  ChevronLeft,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/storage';
import { playClockTick, playCountdownWarningBeep } from '../utils/pomodoroAudio';
import { explainQuizQuestionWithAi } from '../utils/aiTutor';
import { recordMistake } from '../utils/mistakeTracker';
import { getCurrentUser } from '../utils/firebaseConfig';
import { recordStudyTimeLog } from '../utils/hanoiTime';

// Helper to synthesize a full 60-question exam or 10-question quick exam
function buildExamQuestions(course, mode = 'official_60') {
  const staticQuestions = (course.quizQuestions?.length ? course.quizQuestions : course.previewQuiz) || [];
  const cards = course.previewCards?.length ? course.previewCards : (course.cards || []);

  const targetCount = mode === 'official_60' ? 60 : Math.min(10, Math.max(5, staticQuestions.length || cards.length));
  const result = [...staticQuestions];

  if (result.length < targetCount && cards.length > 0) {
    let cardIdx = 0;
    while (result.length < targetCount) {
      const card = cards[cardIdx % cards.length];
      const correctAns = (card.back || '').split('\n')[0].replace(/📌|💡|✨|👉|✅|❌/g, '').trim();

      // Gather 3 distractors from other cards
      const otherAnswers = cards
        .filter((_, i) => (i % cards.length) !== (cardIdx % cards.length))
        .map((c) => (c.back || '').split('\n')[0].replace(/📌|💡|✨|👉|✅|❌/g, '').trim())
        .filter((ans) => ans && ans !== correctAns && ans.length > 3);

      const pickedDistractors = [];
      const shuffledOthers = [...otherAnswers].sort(() => 0.5 - Math.random());
      for (const d of shuffledOthers) {
        if (!pickedDistractors.includes(d)) {
          pickedDistractors.push(d);
          if (pickedDistractors.length === 3) break;
        }
      }

      while (pickedDistractors.length < 3) {
        pickedDistractors.push(`Phương án ${pickedDistractors.length + 1} theo quy định hiện hành`);
      }

      const allOptions = [correctAns, ...pickedDistractors].sort(() => 0.5 - Math.random());
      const correctIndex = allOptions.indexOf(correctAns);

      result.push({
        id: `gen_${result.length + 1}`,
        question: card.front,
        options: allOptions,
        correct: correctIndex >= 0 ? correctIndex : 0,
        explanation: card.back || 'Căn cứ theo hệ thống tài liệu chuẩn hóa OnThiHub.',
        tag: card.tag || 'Kiến thức trọng tâm'
      });

      cardIdx++;
    }
  }

  return result.slice(0, targetCount);
}

export default function QuizModal({
  course,
  isPurchased,
  onClose,
  onBuy
}) {
  const [examMode, setExamMode] = useState('official_60'); // 'official_60' | 'quick_10'
  const totalDuration = examMode === 'official_60' ? 3600 : 600; // 60 mins vs 10 mins

  const questions = useMemo(() => {
    return buildExamQuestions(course, examMode);
  }, [course, examMode]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalDuration);
  const [isBubbleSheetOpen, setIsBubbleSheetOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('ALL'); // 'ALL' | 'WRONG' | 'FLAGGED'
  const [copiedCert, setCopiedCert] = useState(false);

  // AI Tutor State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiExplanations, setAiExplanations] = useState({});
  const [aiError, setAiError] = useState('');
  const [copiedAiText, setCopiedAiText] = useState(false);
  const [activeAiQuestionIdx, setActiveAiQuestionIdx] = useState(0);

  const currentUser = getCurrentUser();
  const candidateName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Học Viên OnThiHub';
  const certCode = useMemo(() => 'OT26-' + Math.floor(100000 + Math.random() * 900000), [isSubmitted]);

  // Reset exam when mode changes
  const handleSwitchMode = (mode) => {
    if (mode === examMode) return;
    if (Object.keys(selectedAnswers).length > 0 && !isSubmitted) {
      if (!window.confirm('Chuyển chế độ sẽ làm lại bài từ đầu. Bạn có chắc chắn muốn chuyển?')) return;
    }
    setExamMode(mode);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setIsSubmitted(false);
    setTimeLeft(mode === 'official_60' ? 3600 : 600);
    playSound('flip');
  };

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
        // Sound for exam clock countdown in final 15 seconds
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
  const isFlagged = Boolean(flaggedQuestions[currentIndex]);

  const handleToggleFlag = (idx = currentIndex) => {
    setFlaggedQuestions((prev) => {
      const next = { ...prev };
      if (next[idx]) delete next[idx];
      else next[idx] = true;
      playSound('click');
      return next;
    });
  };

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

  // Calculate score and pass status according to Decree 138/2020 (>= 50%)
  const score = Object.keys(selectedAnswers).reduce((acc, qIdx) => {
    const q = questions[qIdx];
    return acc + (q && selectedAnswers[qIdx] === q.correct ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / (questions.length || 1)) * 100);
  const isPassed = percentage >= 50; // Nghị định 138: >= 50% số câu đỗ Vòng 1

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      const unanswered = questions.length - Object.keys(selectedAnswers).length;
      if (!window.confirm(`Bạn còn ${unanswered} câu chưa làm. Bạn có chắc chắn muốn nộp bài ngay bây giờ?`)) {
        return;
      }
    }

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

    // Lưu vết thời gian làm bài thi trắc nghiệm theo Giờ Hà Nội
    const timeSpentMinutes = Math.max(1, Math.round((totalDuration - timeLeft) / 60));
    recordStudyTimeLog({
      type: 'quiz',
      title: `Thi thử trắc nghiệm: ${course.title} (${score}/${questions.length} câu - ${isPassed ? 'ĐỖ' : 'CHƯA ĐẠT'})`,
      durationMinutes: timeSpentMinutes,
      xpGained: isPassed ? 50 : 25,
      metadata: { courseId: course.id, score, totalQuestions: questions.length, isPassed }
    });

    if (isPassed) {
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.55 }
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setTimeLeft(examMode === 'official_60' ? 3600 : 600);
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
        } else if (e.key === 'f' || e.key === 'F') {
          handleToggleFlag();
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
  }, [currentIndex, isSubmitted, questions.length, currentQ, flaggedQuestions]);

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

  const handleCopyCertificate = () => {
    const certText = `🏆 CHỨNG NHẬN KẾT QUẢ THI TUYỂN CÔNG CHỨC 2026 - ONTHIHUB\n` +
      `Thí sinh: ${candidateName}\n` +
      `Môn thi: ${course.title}\n` +
      `Kết quả: ${isPassed ? 'ĐỖ VÒNG 1 (ĐẠT TIÊU CHUẨN)' : 'CHƯA ĐẠT'}\n` +
      `Điểm số: ${score}/${questions.length} câu (${percentage}%)\n` +
      `Mã chứng chỉ: ${certCode}\n` +
      `Tra cứu tại: https://onthi-hub.vercel.app/`;
    navigator.clipboard.writeText(certText);
    playSound('success');
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2500);
  };

  const filteredReviewIndices = useMemo(() => {
    return questions.map((_, i) => i).filter((i) => {
      const userAns = selectedAnswers[i];
      const isCorrect = userAns === questions[i].correct;
      if (reviewFilter === 'WRONG') return !isCorrect;
      if (reviewFilter === 'FLAGGED') return Boolean(flaggedQuestions[i]);
      return true;
    });
  }, [questions, selectedAnswers, flaggedQuestions, reviewFilter]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in cursor-pointer"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-200 dark:border-white/15 animate-spring-3d text-slate-900 dark:text-white cursor-default"
      >
        
        {/* =========================================================
            TOPBAR: EXAM HEADER & REALTIME CLOCK & MODE SWITCHER
            ========================================================= */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 gap-3">
          
          {/* Left: Mode Badge & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
              {examMode === 'official_60' ? '60' : '10'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white line-clamp-1">
                  {course.title}
                </h4>
                {examMode === 'official_60' ? (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 dark:bg-purple-900/90 dark:text-purple-100 border border-purple-300 dark:border-purple-500/50">
                    🏛️ Chuẩn NĐ 138/2020
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 dark:bg-amber-900/90 dark:text-amber-100 border border-amber-300 dark:border-amber-500/50">
                    ⚡ Cấp Tốc
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-200 font-semibold">
                {examMode === 'official_60' ? '60 câu • 60 phút • Đúng ≥ 30 câu đỗ Vòng 1' : '10 câu trọng tâm • 10 phút'}
              </p>
            </div>
          </div>

          {/* Right: Controls & Mode Switcher */}
          <div className="flex items-center justify-between sm:justify-end space-x-2 shrink-0">
            
            {/* Mode Switcher Buttons */}
            {!isSubmitted && (
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-300 dark:border-white/20 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('official_60')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold ${
                    examMode === 'official_60'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                  }`}
                  title="Chế độ 60 câu / 60 phút mô phỏng kỳ thi tuyển công chức thật"
                >
                  🏛️ 60 Câu (60p)
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('quick_10')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold ${
                    examMode === 'quick_10'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                  }`}
                  title="Chế độ thi thử ôn nhanh 10 câu trọng tâm"
                >
                  ⚡ 10 Câu
                </button>
              </div>
            )}

            {/* Realtime Clock Countdown */}
            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-black shadow-2xs border ${
              timeLeft <= 300
                ? 'bg-rose-100 text-rose-950 border-rose-400 dark:bg-rose-950/90 dark:text-rose-200 animate-pulse'
                : 'bg-amber-100 text-amber-950 border-amber-400 dark:bg-amber-950/90 dark:text-amber-200 dark:border-amber-500/60'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono text-sm font-black">{formatTime(timeLeft)}</span>
            </div>

            {/* Bubble Sheet Matrix Trigger */}
            <button
              onClick={() => setIsBubbleSheetOpen(!isBubbleSheetOpen)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black flex items-center space-x-1 border transition-all cursor-pointer ${
                isBubbleSheetOpen
                  ? 'bg-purple-600 text-white border-purple-700'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 hover:bg-slate-100'
              }`}
              title="Mở phiếu trả lời trắc nghiệm (lưới câu hỏi)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phiếu ({Object.keys(selectedAnswers).length}/{questions.length})</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 transition-colors cursor-pointer"
              title="Đóng phòng thi (hoặc nhấn Esc, bấm ra ngoài)"
            >
              <span>Đóng</span>
              <kbd className="hidden sm:inline text-[10px] font-mono bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-600 dark:text-slate-300">Esc</kbd>
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Progress Bar of Time Remaining */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft <= 300 ? 'bg-rose-500' : 'bg-purple-600'
            }`}
            style={{ width: `${Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100))}%` }}
          />
        </div>

        {/* =========================================================
            MAIN EXAM WORKSPACE WITH OPTIONAL BUBBLE SHEET MATRIX
            ========================================================= */}
        <div className="flex-1 flex overflow-hidden bg-white dark:bg-slate-900">
          
          {/* Question Solving Column */}
          <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-4">
            
            {isSubmitted ? (
              /* =========================================================
                 EXAM RESULTS & DECREE 138 OFFICIAL CERTIFICATE SCREEN
                 ========================================================= */
              <div className="py-4 space-y-6 animate-fade-in max-w-2xl mx-auto">
                
                {/* Result Hero Banner */}
                <div className={`p-6 rounded-2xl border text-center space-y-3 ${
                  isPassed
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-400 dark:border-emerald-600/60 text-emerald-950 dark:text-emerald-100'
                    : 'bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-400 dark:border-rose-600/60 text-rose-950 dark:text-rose-100'
                }`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-md ${
                    isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    {isPassed ? <Trophy className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                  </div>

                  <div>
                    <span className={`text-[11px] uppercase tracking-wider font-black px-3 py-1 rounded-full border ${
                      isPassed
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/90 dark:text-emerald-100'
                        : 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-900/90 dark:text-rose-100'
                    }`}>
                      {isPassed ? '🏆 ĐẠT TIÊU CHUẨN VÒNG 1 (ĐỦ ĐIỀU KIỆN VÀO VÒNG 2)' : '⚠️ CHƯA ĐẠT TIÊU CHUẨN VÒNG 1'}
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white mt-2">
                      {isPassed ? 'Chúc Mừng Bạn Đã Đỗ Kỳ Thi Thử!' : 'Cần Rèn Luyện Thêm Để Thi Đỗ!'}
                    </h3>

                    <p className="text-sm mt-1 text-slate-800 dark:text-slate-200 font-semibold">
                      Theo <strong>Nghị định 138/2020/NĐ-CP</strong>, thí sinh cần trả lời đúng từ 50% số câu hỏi (≥ 30/60 câu) để vượt qua Vòng 1.
                    </p>
                  </div>

                  {/* Score Breakdown Pill */}
                  <div className="flex items-center justify-center space-x-6 pt-2">
                    <div>
                      <span className="text-[11px] text-slate-700 dark:text-slate-300 block font-bold">Số câu đúng</span>
                      <strong className={`text-2xl font-black ${isPassed ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                        {score} / {questions.length}
                      </strong>
                    </div>
                    <div className="w-px h-8 bg-slate-300 dark:bg-white/20" />
                    <div>
                      <span className="text-[11px] text-slate-700 dark:text-slate-300 block font-bold">Tỷ lệ đạt</span>
                      <strong className="text-2xl font-black text-purple-700 dark:text-purple-300">
                        {percentage}%
                      </strong>
                    </div>
                    <div className="w-px h-8 bg-slate-300 dark:bg-white/20" />
                    <div>
                      <span className="text-[11px] text-slate-700 dark:text-slate-300 block font-bold">Thời gian làm bài</span>
                      <strong className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                        {formatTime(totalDuration - timeLeft)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* OFFICIAL ELECTRONIC CERTIFICATE CARD */}
                {isPassed && (
                  <div className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-2 border-amber-400 dark:border-amber-500 shadow-md text-left space-y-4">
                    {/* Top Certificate Header */}
                    <div className="flex items-start justify-between border-b border-amber-200 dark:border-white/10 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 dark:text-amber-300">
                            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM • ONTHIHUB 2026
                          </span>
                          <h4 className="text-base sm:text-lg font-black text-slate-950 dark:text-white uppercase tracking-tight">
                            GIẤY CHỨNG NHẬN ĐẠT CHUẨN VÒNG 1
                          </h4>
                        </div>
                      </div>

                      {/* Official Red Stamp Seal */}
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-rose-600 text-rose-600 flex flex-col items-center justify-center rotate-12 shrink-0 select-none opacity-90 font-black">
                        <span className="text-[8px] font-black uppercase">ĐÃ ĐẠT</span>
                        <span className="text-[10px] font-black leading-none">2026</span>
                        <span className="text-[7px] font-bold">ONTHIHUB</span>
                      </div>
                    </div>

                    {/* Candidate Info Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400 block text-[11px] font-bold">Họ và tên thí sinh:</span>
                        <strong className="text-sm font-black text-slate-950 dark:text-white">{candidateName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400 block text-[11px] font-bold">Môn thi sát hạch:</span>
                        <strong className="text-sm font-black text-purple-700 dark:text-purple-300">{course.title}</strong>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400 block text-[11px] font-bold">Kết quả thẩm định:</span>
                        <strong className="font-black text-emerald-700 dark:text-emerald-300">ĐẠT ({score}/{questions.length} câu - {percentage}%)</strong>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400 block text-[11px] font-bold">Mã tra cứu điện tử:</span>
                        <code className="font-mono font-black text-amber-800 dark:text-amber-300">{certCode}</code>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-200 dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-700 dark:text-slate-300 flex items-center space-x-1 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Chứng chỉ được xác thực bởi Hệ thống Khảo thí OnThiHub</span>
                      </span>

                      <button
                        type="button"
                        onClick={handleCopyCertificate}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        {copiedCert ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span>{copiedCert ? 'Đã Sao Chép!' : 'Chia Sẻ Chứng Nhận'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Filter Controls for Reviewing Questions */}
                <div className="flex items-center justify-between pt-2">
                  <h4 className="text-sm font-black text-slate-950 dark:text-white">
                    Xem Lại Toàn Bộ Câu Hỏi ({filteredReviewIndices.length}/{questions.length})
                  </h4>

                  <div className="flex items-center space-x-1 text-xs">
                    {[
                      { id: 'ALL', label: 'Tất cả' },
                      { id: 'WRONG', label: `Câu sai (${questions.length - score})` },
                      { id: 'FLAGGED', label: `Cắm cờ (${Object.keys(flaggedQuestions).length})` }
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setReviewFilter(f.id)}
                        className={`px-2.5 py-1 rounded-md font-black text-xs transition-colors cursor-pointer ${
                          reviewFilter === f.id
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Question Cards List */}
                <div className="space-y-3 text-left">
                  {filteredReviewIndices.map((idx) => {
                    const q = questions[idx];
                    const userAns = selectedAnswers[idx];
                    const isCorrect = userAns === q.correct;
                    const isFlag = Boolean(flaggedQuestions[idx]);

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border transition-all ${
                          isCorrect
                            ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-white/15'
                            : 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start space-x-2">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="text-xs sm:text-sm font-black text-slate-950 dark:text-white leading-relaxed">
                                Câu {idx + 1}: {q.question}
                              </p>
                              <div className="mt-2 space-y-1 text-xs">
                                <p className="text-emerald-700 dark:text-emerald-300 font-black">
                                  ✅ Đáp án đúng: {q.options[q.correct]}
                                </p>
                                {!isCorrect && (
                                  <p className="text-rose-700 dark:text-rose-300 font-bold">
                                    ❌ Bạn đã chọn: {userAns !== undefined ? q.options[userAns] : '(Chưa chọn)'}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {isFlag && (
                            <span className="p-1 rounded bg-amber-100 text-amber-900 shrink-0" title="Câu đã cắm cờ">
                              <Flag className="w-3.5 h-3.5 fill-amber-500" />
                            </span>
                          )}
                        </div>

                        {/* Explanation Box */}
                        <div className="mt-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-medium">
                          💡 <strong>Căn cứ lý giải:</strong> {q.explanation}
                        </div>

                        <button
                          onClick={() => handleAskAiTutor(idx)}
                          className="mt-2.5 text-[11px] font-black text-sky-800 dark:text-sky-200 bg-sky-100 dark:bg-sky-950/80 hover:bg-sky-200 border border-sky-300 dark:border-sky-500/50 px-3 py-1.5 rounded-lg inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                          <span>Hỏi AI Bóc Mẽ Bẫy Đề & Mẹo Khoanh 10 Giây</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Làm Lại Đề Này (Reset)</span>
                  </button>

                  {!isPurchased && (
                    <button
                      onClick={() => {
                        onClose();
                        onBuy(course);
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                    >
                      <Coins className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span>Mở Khóa Toàn Bộ Kho Đề ({course.priceXu || 25} Xu)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            ) : (
              /* =========================================================
                 ACTIVE QUESTION SOLVING INTERFACE (HIGH CONTRAST)
                 ========================================================= */
              <div className="space-y-4 text-left">
                
                {/* Question Header & Flag Toggle */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-black shadow-xs">
                      Câu hỏi {currentIndex + 1} / {questions.length}
                    </span>
                    {currentQ.tag && (
                      <span className="hidden sm:inline-block text-xs font-bold text-slate-700 dark:text-slate-300">
                        • {currentQ.tag}
                      </span>
                    )}
                  </div>

                  {/* Flag Question Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleFlag()}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center space-x-1.5 border transition-all cursor-pointer ${
                      isFlagged
                        ? 'bg-amber-400 text-slate-950 border-2 border-amber-600 font-black shadow-xs ring-2 ring-amber-300'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 hover:bg-slate-100 font-bold'
                    }`}
                    title="Cắm cờ câu này để xem lại trước khi nộp bài"
                  >
                    <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-950 text-amber-950' : 'text-slate-400'}`} />
                    <span>{isFlagged ? 'Đã Cắm Cờ 🚩' : 'Cắm Cờ'}</span>
                  </button>
                </div>

                {/* Question Statement */}
                <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white leading-relaxed whitespace-pre-line pt-1">
                  {currentQ.question}
                </h3>

                {/* 4 Multiple Choice Options (High Contrast Solid Cards) */}
                <div className="space-y-3 pt-2">
                  {currentQ.options?.map((opt, optIdx) => {
                    const isSelected = currentSelected === optIdx;
                    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-4 text-left rounded-xl text-xs sm:text-sm transition-all border flex items-center space-x-3.5 cursor-pointer shadow-2xs ${
                          isSelected
                            ? 'border-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-950/90 shadow-sm ring-2 ring-purple-400/40'
                            : 'border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-white/40 hover:bg-slate-50 dark:hover:bg-slate-750'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20'
                        }`}>
                          {optionLetters[optIdx] || optIdx + 1}
                        </span>
                        <span className={`flex-1 leading-relaxed text-xs sm:text-sm ${
                          isSelected
                            ? 'text-purple-950 dark:text-purple-100 font-extrabold'
                            : 'text-slate-900 dark:text-white font-semibold'
                        }`}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Hotkeys Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                  <span>⌨️ Phím tắt: <strong>1, 2, 3, 4</strong> (hoặc <strong>A, B, C, D</strong>) để chọn • <strong>F</strong> để cắm cờ</span>
                  <span>Phím <strong>← / →</strong> để chuyển câu</span>
                </div>

                {/* Instant Explanation Hint if Answered */}
                {isAnswered && (
                  <div className="p-3.5 bg-purple-50 dark:bg-purple-950/80 rounded-xl border border-purple-300 dark:border-purple-600/50 text-xs space-y-2 animate-fade-in">
                    <div className="flex items-center space-x-1.5 font-black text-purple-950 dark:text-purple-100">
                      <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Căn cứ lý giải câu hỏi:</span>
                    </div>
                    <p className="leading-relaxed text-slate-900 dark:text-slate-100 font-medium">
                      {currentQ.explanation}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAskAiTutor(currentIndex)}
                      className="mt-1 text-[11px] font-black text-sky-800 dark:text-sky-200 bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-sky-300 dark:border-sky-500/50 inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                      <span>✨ Bóc Mẽ Chiêu Trò Cài Bẫy & Mẹo 10s Bằng AI</span>
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* =========================================================
              COLLAPSIBLE BUBBLE SHEET QUESTION MATRIX (LƯỚI CÂU HỎI)
              ========================================================= */}
          {isBubbleSheetOpen && !isSubmitted && (
            <div className="w-72 sm:w-80 border-l border-slate-300 dark:border-white/15 bg-slate-100 dark:bg-slate-900 p-4 flex flex-col justify-between overflow-y-auto animate-slide-left shrink-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-300 dark:border-white/15">
                  <span className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <LayoutGrid className="w-3.5 h-3.5 text-purple-600" />
                    <span>Phiếu Làm Bài ({questions.length} câu)</span>
                  </span>
                  <button
                    onClick={() => setIsBubbleSheetOpen(false)}
                    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-xs font-black"
                  >
                    ✕
                  </button>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-900 dark:text-slate-100 font-bold pb-2 border-b border-slate-300 dark:border-white/15">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-600"></span>
                    <span>Đã làm ({Object.keys(selectedAnswers).length})</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-amber-400 ring-1 ring-amber-600"></span>
                    <span>Cắm cờ 🚩 ({Object.keys(flaggedQuestions).length})</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-white dark:bg-slate-800 border border-slate-400"></span>
                    <span>Chưa làm ({questions.length - Object.keys(selectedAnswers).length})</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-purple-600"></span>
                    <span>Đang chọn</span>
                  </div>
                </div>

                {/* The 60-bubble Matrix Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 max-h-[50vh] overflow-y-auto pr-1">
                  {questions.map((_, i) => {
                    const isAns = selectedAnswers[i] !== undefined;
                    const isFlag = Boolean(flaggedQuestions[i]);
                    const isCurr = currentIndex === i;

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setCurrentIndex(i);
                        }}
                        className={`h-8 rounded-lg text-xs font-black transition-all relative flex items-center justify-center cursor-pointer ${
                          isCurr
                            ? 'bg-purple-600 text-white ring-2 ring-purple-300 shadow-sm'
                            : isFlag
                            ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-600 font-black'
                            : isAns
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 hover:bg-slate-200'
                        }`}
                      >
                        <span>{i + 1}</span>
                        {isFlag && (
                          <span className="absolute -top-1 -right-1 text-[8px]">🚩</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button Inside Bubble Sheet Drawer */}
              <div className="pt-3 border-t border-slate-300 dark:border-white/15">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Nộp Bài Ngay ({Object.keys(selectedAnswers).length}/{questions.length})</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* =========================================================
            BOTTOM ACTIONS BAR
            ========================================================= */}
        {!isSubmitted && (
          <div className="p-3.5 px-5 border-t border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 flex items-center justify-between">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-white/20 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 flex items-center space-x-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu Trước</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsBubbleSheetOpen(!isBubbleSheetOpen)}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-white/20 text-xs font-black text-slate-900 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-1 sm:hidden cursor-pointer"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Phiếu</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Câu Tiếp Theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Nộp Bài & Chấm Điểm</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* =========================================================
          AI TUTOR EXAM DRILL SLIDE-OVER DRAWER
          ========================================================= */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white">
            
            {/* Header */}
            <div className="px-5 py-3.5 bg-white dark:bg-slate-900 flex items-center justify-between border-b border-slate-200 dark:border-white/15">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-300 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight flex items-center space-x-1.5">
                    <span>Trợ Lý Giảng Viên AI OnThiHub</span>
                    <span className="notion-tag notion-tag-blue text-[10px]">
                      Pro Turbo
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                    Câu {activeAiQuestionIdx + 1} • Bóc mẽ bẫy đề thi & mẹo khoanh 10s
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                {aiExplanations[activeAiQuestionIdx] && (
                  <button
                    onClick={handleCopyAiText}
                    className="p-1.5 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Copy nội dung giải thích"
                  >
                    {copiedAiText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={() => setAiDrawerOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs sm:text-sm">
              {questions[activeAiQuestionIdx] && (
                <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-white/15 space-y-2">
                  <span className="notion-tag notion-tag-gray text-[10px]">
                    CÂU HỎI {activeAiQuestionIdx + 1}
                  </span>
                  <p className="font-black text-slate-950 dark:text-white text-xs sm:text-sm">
                    {questions[activeAiQuestionIdx].question}
                  </p>
                  
                  <div className="pt-2 border-t border-slate-300 dark:border-white/15 flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-600/50 font-black text-[11px]">
                      ✅ Đáp án đúng: {questions[activeAiQuestionIdx].options?.[questions[activeAiQuestionIdx].correct]}
                    </span>
                    {selectedAnswers[activeAiQuestionIdx] !== undefined && selectedAnswers[activeAiQuestionIdx] !== questions[activeAiQuestionIdx].correct && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-600/50 font-black text-[11px]">
                        ❌ Bạn đã chọn: {questions[activeAiQuestionIdx].options?.[selectedAnswers[activeAiQuestionIdx]]}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {isAiLoading && (
                <div className="py-10 flex flex-col items-center justify-center space-y-2.5">
                  <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 animate-pulse font-semibold">
                    Hệ thống AI đang soi bẫy thi & tổng hợp quy tắc khoanh nhanh 10 giây...
                  </p>
                </div>
              )}

              {aiError && (
                <div className="p-3.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-950 text-xs font-bold">
                  {aiError}
                </div>
              )}

              {aiExplanations[activeAiQuestionIdx] && (
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-white/15 text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed whitespace-pre-line space-y-2 font-medium">
                  {aiExplanations[activeAiQuestionIdx]}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/15 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                🎯 Luyện phản xạ nhận diện bẫy đề thi thật cùng OnThiHub
              </span>
              <button
                onClick={() => setAiDrawerOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-black cursor-pointer"
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
