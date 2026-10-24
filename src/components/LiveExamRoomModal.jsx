import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Clock,
  Calendar,
  Users,
  Trophy,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Flag,
  Award,
  Share2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Volume2,
  VolumeX,
  Coins,
  MessageSquare,
  Crown
} from 'lucide-react';
import { addCommunityPost } from '../data/communityData';
import {
  SCHEDULED_LIVE_EXAMS,
  getLiveExamStatus,
  getRegisteredLiveExams,
  registerForLiveExam,
  unregisterFromLiveExam,
  submitLiveExamResult,
  getLiveExamLeaderboard,
  getSavedLiveExamResults
} from '../data/liveExamData';
import { COURSES_DATA } from '../data/coursesData';
import { useModalDismiss } from '../hooks/useModalDismiss';
import { playSound } from '../utils/storage';
import { playClockTick, playCountdownWarningBeep } from '../utils/pomodoroAudio';
import confetti from 'canvas-confetti';

export default function LiveExamRoomModal({
  isOpen,
  onClose,
  user,
  allCourses = [],
  onOpenShareAchievement,
  onShowToast,
  onOpenDirectChat
}) {
  useModalDismiss(onClose, isOpen);

  const [selectedExamId, setSelectedExamId] = useState(SCHEDULED_LIVE_EXAMS[0].id);
  const activeExam = useMemo(() => {
    return SCHEDULED_LIVE_EXAMS.find((e) => e.id === selectedExamId) || SCHEDULED_LIVE_EXAMS[0];
  }, [selectedExamId]);

  const [registrations, setRegistrations] = useState(() => getRegisteredLiveExams());
  const myRegistration = useMemo(() => {
    return registrations.find((r) => r.examId === activeExam.id);
  }, [registrations, activeExam.id]);

  // Exam state: 'lobby' | 'exam' | 'result'
  const [viewState, setViewState] = useState('lobby');
  const [hasPostedStatus, setHasPostedStatus] = useState(false);

  // Real-time live status from Hanoi Clock
  const [liveInfo, setLiveInfo] = useState(() => getLiveExamStatus(activeExam));

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveInfo(getLiveExamStatus(activeExam));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeExam]);

  // Build question set based on activeExam.baseCourseId
  const questions = useMemo(() => {
    const all = allCourses.length > 0 ? allCourses : COURSES_DATA;
    const base = all.find((c) => c.id === activeExam.baseCourseId || String(c.id).includes(activeExam.baseCourseId)) || all[0];
    const rawQuestions = base?.previewQuiz || base?.quizQuestions || [];
    const cards = base?.previewCards || base?.cards || [];

    const targetCount = activeExam.questionCount || 40;
    const list = [...rawQuestions];

    if (list.length < targetCount && cards.length > 0) {
      let cardIdx = 0;
      while (list.length < targetCount) {
        const card = cards[cardIdx % cards.length];
        const correctAns = (card.back || '').split('\n')[0].replace(/📌|💡|✨|👉|✅|❌/g, '').trim();
        const otherAnswers = cards
          .filter((_, i) => (i % cards.length) !== (cardIdx % cards.length))
          .map((c) => (c.back || '').split('\n')[0].replace(/📌|💡|✨|👉|✅|❌/g, '').trim())
          .filter((ans) => ans && ans !== correctAns && ans.length > 3);

        const distractors = [];
        const shuffled = [...otherAnswers].sort(() => 0.5 - Math.random());
        for (const d of shuffled) {
          if (!distractors.includes(d)) {
            distractors.push(d);
            if (distractors.length === 3) break;
          }
        }
        while (distractors.length < 3) {
          distractors.push(`Phương án ${distractors.length + 1} theo quy chế hiện hành`);
        }

        const options = [correctAns, ...distractors].sort(() => 0.5 - Math.random());
        const correctIndex = options.indexOf(correctAns);

        list.push({
          id: `live_${list.length + 1}`,
          question: card.front,
          options,
          correct: correctIndex >= 0 ? correctIndex : 0,
          explanation: card.back || 'Căn cứ theo hệ thống tài liệu chuẩn hóa OnThiHub.',
          tag: card.tag || 'Kiến thức trọng tâm'
        });

        cardIdx++;
      }
    }

    return list.slice(0, targetCount);
  }, [activeExam, allCourses]);

  // Active Exam Run States
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedIndices, setFlaggedIndices] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(activeExam.durationMinutes * 60);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showSwitchWarning, setShowSwitchWarning] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState(() => getLiveExamLeaderboard(activeExam.id));

  // Anti-cheat visibility listener
  useEffect(() => {
    if (viewState !== 'exam') return;

    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          setShowSwitchWarning(true);
          playSound('flip');
          return next;
        });
      }
    };

    const handleBlur = () => {
      setTabSwitchCount((prev) => {
        const next = prev + 1;
        setShowSwitchWarning(true);
        return next;
      });
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [viewState]);

  // Exam Countdown Timer
  useEffect(() => {
    if (viewState !== 'exam') return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        if (prev === 60) {
          playCountdownWarningBeep();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [viewState]);

  const handleRegister = () => {
    const res = registerForLiveExam(activeExam.id, user);
    if (res) {
      setRegistrations(getRegisteredLiveExams());
      playSound('success');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
      onShowToast?.(`🎉 Bạn đã đăng ký thành công! Số báo danh của bạn: ${res.candidateNumber}`);
    }
  };

  const handleStartExam = () => {
    if (!myRegistration) {
      handleRegister();
    }
    playSound('flip');
    setViewState('exam');
    setCurrentQIndex(0);
    setUserAnswers({});
    setFlaggedIndices({});
    setTabSwitchCount(0);
    setShowSwitchWarning(false);
    setSecondsRemaining(activeExam.durationMinutes * 60);
  };

  const handleSelectAnswer = (qIndex, optionIndex) => {
    playSound('click');
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex
    }));
  };

  const toggleFlag = (idx) => {
    playSound('click');
    setFlaggedIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const timeSpent = activeExam.durationMinutes * 60 - secondsRemaining;
    const candidateNumber = myRegistration?.candidateNumber || 'SBD-ONTHI';

    const result = submitLiveExamResult({
      examId: activeExam.id,
      user,
      candidateNumber,
      score: correctCount,
      totalQuestions: questions.length,
      timeSpentSeconds: timeSpent,
      tabSwitchCount
    });

    setExamResult(result);
    setLeaderboard(getLiveExamLeaderboard(activeExam.id));
    setHasPostedStatus(false);
    setViewState('result');
    playSound('success');

    if (result.passed) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    }
  };

  const handlePostStatusToCommunity = () => {
    if (!examResult || hasPostedStatus) return;
    const rankTitle =
      examResult.rank === 1
        ? '👑 THỦ KHOA TOÀN QUỐC'
        : examResult.rank === 2
        ? '🥈 Á KHOA TOÀN QUỐC'
        : examResult.rank === 3
        ? '🥉 TOP 3 BẢNG VÀNG'
        : examResult.rank <= 10
        ? `⭐ TOP ${examResult.rank} TOÀN QUỐC`
        : examResult.passed
        ? '🎖️ ĐẠT TIÊU CHUẨN SÁT HẠCH'
        : '🔥 THÍ SINH NỖ LỰC';

    const candidateName = myRegistration?.userName || user?.displayName || user?.email?.split('@')[0] || 'Thí Sinh OnThiHub';
    const candidateNumber = myRegistration?.candidateNumber || examResult.candidateNumber || 'SBD-ONTHI';

    const postContent =
      `🎉 [VINH DANH THI ĐẤU TOÀN QUỐC 2026] Thí sinh ${candidateName} (${candidateNumber}) vừa hoàn thành xuất sắc kỳ thi "${activeExam.title}":\n\n` +
      `• Kết quả: ${examResult.score}/${examResult.totalQuestions} câu đúng (${examResult.percentage}%)\n` +
      `• Xếp hạng: Hạng #${examResult.rank} Toàn Quốc\n` +
      `• Danh hiệu: ${rankTitle}\n` +
      `• Mã chứng nhận: ${examResult.certCode}\n\n` +
      `Chúc mừng thí sinh đã hoàn thành kỳ thi sát hạch trực tiếp! Mọi người cùng vào chúc mừng, thả tim và kết bạn trao đổi kinh nghiệm ôn thi nhé! 🚀`;

    addCommunityPost({
      id: 'post_exam_' + Date.now(),
      author: candidateName,
      authorEmail: user?.email || `${candidateNumber.toLowerCase()}@onthihub.vn`,
      role: 'student',
      avatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      category: activeExam.baseCourseId || 'meo-thi',
      categoryLabel: '🏆 Bảng Vàng Toàn Quốc',
      badge: rankTitle,
      content: postContent,
      createdAt: new Date().toISOString(),
      likes: 1,
      likedBy: [user?.email || 'thisinh@onthihub.vn'],
      comments: []
    });

    setHasPostedStatus(true);
    playSound('success');
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    onShowToast?.('🎉 Đã đăng Status vinh danh lên Diễn Đàn Cộng Đồng thành công! Mọi người đã có thể xem và chúc mừng bạn.');
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in select-none text-slate-900 dark:text-white">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl h-[94vh] sm:h-[88vh] bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 overflow-hidden flex flex-col z-10"
      >
        {/* ROOM TOPBAR */}
        <header className="px-4 py-3 sm:px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 font-black">
              <span>🏛️</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  Phòng Thi Trực Tiếp Toàn Quốc
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span>LIVE ICT</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Đồng bộ chuẩn Giờ Hà Nội (GMT+7) • Cạnh tranh Bảng Vàng & Cấp Chứng Nhận
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {myRegistration && (
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/80 text-[#2383e2] dark:text-sky-300 border border-sky-200 dark:border-sky-700 text-xs font-mono font-bold">
                {myRegistration.candidateNumber}
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* EXAM TABS SELECTOR (Only in lobby or result view) */}
        {viewState !== 'exam' && (
          <div className="px-4 sm:px-6 pt-2 pb-0 bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {SCHEDULED_LIVE_EXAMS.map((exam) => {
              const isSelected = exam.id === selectedExamId;
              return (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => {
                    setSelectedExamId(exam.id);
                    setViewState('lobby');
                    playSound('click');
                  }}
                  className={`py-2 px-3 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 border-t border-x ${
                    isSelected
                      ? 'bg-white dark:bg-[#0f172a] text-[#2383e2] dark:text-sky-400 border-slate-200 dark:border-white/15 border-b-transparent shadow-xs -mb-[1px]'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{exam.badge.split(' ')[0]}</span>
                  <span>{exam.title}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* =========================================================
            STATE 1: LOBBY & REGISTRATION SCREEN
            ========================================================= */}
        {viewState === 'lobby' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Countdown Banner to Next Exam Occurrence */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${activeExam.badgeColor}`}>
                  {activeExam.badge}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {activeExam.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeExam.subject} • Quy mô <strong>{activeExam.questionCount} câu</strong> trắc nghiệm trong <strong>{activeExam.durationMinutes} phút</strong>.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Lịch thi: {activeExam.dayOfWeek === 0 ? 'Chủ Nhật' : activeExam.dayOfWeek === 6 ? 'Thứ Bảy' : 'Hàng ngày'} lúc <strong>{activeExam.startTimeStr} (Giờ Hà Nội)</strong></span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span><strong>{activeExam.registeredBaseCount + registrations.length}</strong> thí sinh đã đăng ký</span>
                  </span>
                </div>
              </div>

              {/* Countdown Clocks */}
              <div className="shrink-0 text-center bg-slate-800/80 p-4 rounded-xl border border-slate-700 shadow-md">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  ĐẾM NGƯỢC GIỜ MỞ ĐỀ
                </span>
                <div className="flex items-center space-x-1.5 font-mono text-xl sm:text-2xl font-black text-sky-400">
                  <div className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                    {String(liveInfo.countdown.days).padStart(2, '0')}
                    <span className="block text-[8px] font-sans text-slate-400">NGÀY</span>
                  </div>
                  <span>:</span>
                  <div className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                    {String(liveInfo.countdown.hours).padStart(2, '0')}
                    <span className="block text-[8px] font-sans text-slate-400">GIỜ</span>
                  </div>
                  <span>:</span>
                  <div className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                    {String(liveInfo.countdown.minutes).padStart(2, '0')}
                    <span className="block text-[8px] font-sans text-slate-400">PHÚT</span>
                  </div>
                  <span>:</span>
                  <div className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 text-emerald-400">
                    {String(liveInfo.countdown.seconds).padStart(2, '0')}
                    <span className="block text-[8px] font-sans text-slate-400">GIÂY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration & Quick Launch Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Candidate Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">THẺ BÁO DANH CÁ NHÂN</span>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>

                {myRegistration ? (
                  <div className="p-3 bg-sky-50 dark:bg-sky-950/60 rounded-xl border border-sky-200 dark:border-sky-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-600 dark:text-slate-300">Số báo danh:</span>
                      <strong className="font-mono text-base text-[#2383e2] dark:text-sky-300">{myRegistration.candidateNumber}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-600 dark:text-slate-300">Thí sinh:</span>
                      <strong className="text-slate-900 dark:text-white truncate max-w-[140px]">{myRegistration.userName}</strong>
                    </div>
                    <span className="inline-block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                      ✓ Đã điểm danh sẵn sàng vào phòng thi
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Bạn chưa đăng ký kỳ thi này. Hãy nhận Số Báo Danh (SBD) để lưu tên vào Bảng Vàng toàn quốc!
                    </p>
                    <button
                      type="button"
                      onClick={handleRegister}
                      className="w-full py-2 bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      Đăng Ký Nhận SBD Miễn Phí
                    </button>
                  </div>
                )}
              </div>

              {/* Card 2: Rewards Pool */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">QUỸ THƯỞNG GÓI HỘI VIÊN & BẢNG VÀNG</span>
                  <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/60 dark:to-yellow-950/40 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800/60">
                    <span className="font-semibold">🥇 Top 1 Thủ Khoa</span>
                    <strong className="font-black text-amber-700 dark:text-amber-300">
                      {activeExam.rewards?.top1?.name || 'Gói Hội Viên ULTRA 👑'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200">
                    <span>🥈 Top 2 Toàn Quốc</span>
                    <strong className="font-bold text-sky-600 dark:text-sky-300">
                      {activeExam.rewards?.top2?.name || 'Gói Hội Viên PRO 🚀'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200">
                    <span>🥉 Top 3 Toàn Quốc</span>
                    <strong className="font-bold text-sky-600 dark:text-sky-300">
                      {activeExam.rewards?.top3?.name || 'Gói Hội Viên PRO 🚀'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Card 3: Instant Launch Button */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    LUYỆN TẬP KHÔNG CẦN CHỜ
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Không muốn chờ đến giờ thi chính thức? Bạn có thể mở ngay đề thi mô phỏng chuẩn 60 câu để cọ xát ngay bây giờ!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStartExam}
                  className="w-full mt-3 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Vào Phòng Thi Ngay</span>
                </button>
              </div>

            </div>

            {/* Exam Rules & Real-time Leaderboard Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Rules */}
              <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800/90 shadow-2xs space-y-3">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>Quy Chế Phòng Thi & Chống Gian Lận (Anti-Cheat)</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {activeExam.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Leaderboard Table Preview */}
              <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Bảng Vàng Thi Thử Gần Nhất</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Top Điểm Cao</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-white/10 text-xs">
                  {leaderboard.slice(0, 4).map((record, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[11px] ${
                          idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <strong className="block text-slate-900 dark:text-white truncate max-w-[140px]">{record.userName}</strong>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{record.candidateNumber}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <strong className="text-emerald-600 dark:text-emerald-400 font-black">{record.score}/{record.totalQuestions}</strong>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400">{Math.floor(record.timeSpentSeconds / 60)}p {record.timeSpentSeconds % 60}s</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================
            STATE 2: ACTIVE EXAM SCREEN
            ========================================================= */}
        {viewState === 'exam' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-[#090d16]">
            
            {/* Exam Status Bar */}
            <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Câu hỏi:</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">{currentQIndex + 1} / {questions.length}</span>
                <span className="text-xs text-slate-400">({Object.keys(userAnswers).length} đã làm)</span>
              </div>

              {/* Anti-cheat warning alert if switched tab */}
              {tabSwitchCount > 0 && (
                <div className="hidden sm:flex items-center space-x-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 text-[11px] font-bold animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Phát hiện rời tab: {tabSwitchCount} lần</span>
                </div>
              )}

              {/* Countdown Timer */}
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono font-black text-sm text-sky-600 dark:text-sky-400 border border-slate-200 dark:border-white/10">
                <Clock className="w-4 h-4" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>

              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Nộp Bài Thi
              </button>
            </div>

            {/* Anti-cheat warning modal alert */}
            {showSwitchWarning && (
              <div className="bg-rose-500 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-fade-in shrink-0">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>CẢNH BÁO: Hệ thống phát hiện bạn vừa rời khỏi màn hình thi ({tabSwitchCount} lần). Theo quy chế phòng thi, việc chuyển tab nhiều lần sẽ bị ghi nhận vào biên bản thi!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSwitchWarning(false)}
                  className="text-white hover:text-slate-200 ml-2 font-black cursor-pointer"
                >
                  Đã hiểu ✕
                </button>
              </div>
            )}

            {/* Exam Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col md:flex-row gap-4">
              
              {/* Question & Options Area */}
              <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/70 text-[#2383e2] dark:text-sky-300 font-bold">
                      {questions[currentQIndex]?.tag || 'Trắc nghiệm'}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleFlag(currentQIndex)}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                        flaggedIndices[currentQIndex]
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{flaggedIndices[currentQIndex] ? 'Đã cắm cờ xem lại' : 'Cắm cờ'}</span>
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                    Câu {currentQIndex + 1}: {questions[currentQIndex]?.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2.5 pt-2">
                    {questions[currentQIndex]?.options.map((option, optIdx) => {
                      const isSelected = userAnswers[currentQIndex] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(currentQIndex, optIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start space-x-3 cursor-pointer ${
                            isSelected
                              ? 'bg-sky-50 dark:bg-sky-950/80 border-[#2383e2] text-[#1458a6] dark:text-sky-300 font-bold ring-1 ring-[#2383e2]'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected
                              ? 'bg-[#2383e2] text-white'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/15'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug pt-0.5">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question Next/Prev Bar */}
                <div className="pt-4 mt-6 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-xs font-semibold disabled:opacity-40 flex items-center space-x-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Câu trước</span>
                  </button>

                  <button
                    type="button"
                    disabled={currentQIndex === questions.length - 1}
                    onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="px-3.5 py-1.5 rounded-lg bg-[#2383e2] text-white text-xs font-bold disabled:opacity-40 flex items-center space-x-1 cursor-pointer shadow-xs"
                  >
                    <span>Câu tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Map Sidebar */}
              <div className="w-full md:w-64 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-white/10 shadow-sm shrink-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2.5 uppercase tracking-wider">
                    Bản Đồ Câu Hỏi ({Object.keys(userAnswers).length}/{questions.length})
                  </h4>

                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-1.5 max-h-64 md:max-h-80 overflow-y-auto pr-1">
                    {questions.map((_, idx) => {
                      const isDone = userAnswers[idx] !== undefined;
                      const isFlagged = flaggedIndices[idx];
                      const isCurrent = currentQIndex === idx;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentQIndex(idx)}
                          className={`h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer relative ${
                            isCurrent
                              ? 'ring-2 ring-[#2383e2] font-black'
                              : ''
                          } ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {idx + 1}
                          {isFlagged && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/10 text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-emerald-600" />
                    <span>Đã trả lời</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-amber-500" />
                    <span>Đã cắm cờ xem lại</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================
            STATE 3: RESULTS & LIVE LEADERBOARD
            ========================================================= */}
        {viewState === 'result' && examResult && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Result Header Hero */}
            <div className={`p-6 rounded-2xl border text-center space-y-3 ${
              examResult.passed
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-100'
            }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-md ${
                examResult.passed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {examResult.passed ? <Trophy className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
              </div>

              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 shadow-2xs border border-current">
                  {examResult.passed ? '🏆 ĐẠT TIÊU CHUẨN THI SÁT HẠCH' : '⚠️ CHƯA ĐẠT TIÊU CHUẨN'}
                </span>

                <h3 className="text-2xl font-black mt-2">
                  {examResult.passed ? 'Chúc Mừng Bạn Đã Vượt Qua Kỳ Thi!' : 'Cần Tiếp Tục Ôn Luyện Thêm!'}
                </h3>
                <p className="text-xs mt-1">
                  Số báo danh: <strong>{examResult.candidateNumber}</strong> • Hoàn thành trong <strong>{Math.floor(examResult.timeSpentSeconds / 60)} phút {examResult.timeSpentSeconds % 60} giây</strong>
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center space-x-6 pt-2">
                <div>
                  <span className="text-[11px] block font-bold">Số câu đúng</span>
                  <strong className="text-2xl font-black">{examResult.score} / {examResult.totalQuestions}</strong>
                </div>
                <div className="w-px h-8 bg-current opacity-20" />
                <div>
                  <span className="text-[11px] block font-bold">Tỷ lệ chính xác</span>
                  <strong className="text-2xl font-black">{examResult.percentage}%</strong>
                </div>
                <div className="w-px h-8 bg-current opacity-20" />
                <div>
                  <span className="text-[11px] block font-bold">Xếp hạng</span>
                  <strong className="text-2xl font-black text-amber-500">#{examResult.rank} Toàn Quốc</strong>
                </div>
              </div>

              {examResult.rewardedMembership && (
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-amber-500/15 border border-amber-400/50 text-amber-900 dark:text-amber-200 text-xs font-bold inline-flex items-center gap-2 shadow-xs">
                  <Crown className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                  <span>🎉 Chúc mừng bạn được trao tặng: <strong>{examResult.rewardedMembership}</strong> & Vinh danh Bảng Vàng!</span>
                </div>
              )}

              {/* Quick Share Achievement Action & Up Status */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                {/* 1. UP STATUS TO COMMUNITY FORUM */}
                <button
                  type="button"
                  onClick={handlePostStatusToCommunity}
                  disabled={hasPostedStatus}
                  className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 transition-all cursor-pointer ${
                    hasPostedStatus
                      ? 'bg-emerald-700 opacity-90 cursor-default'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95'
                  }`}
                  title="Đăng bài vinh danh kết quả thi trực tiếp lên Diễn đàn Cộng Đồng học viên"
                >
                  {hasPostedStatus ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>✓ Đã Đăng Status Diễn Đàn</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>📢 Đăng Status Lên Diễn Đàn</span>
                    </>
                  )}
                </button>

                {/* 2. SHARE CERTIFICATE 2X */}
                {onOpenShareAchievement && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenShareAchievement({
                        type: 'exam_passed',
                        title: activeExam.title,
                        subtitle: activeExam.subject,
                        score: examResult.score,
                        maxScore: examResult.totalQuestions,
                        percentage: examResult.percentage,
                        passed: examResult.passed,
                        candidateName: myRegistration?.userName || 'Thí Sinh OnThiHub',
                        certCode: examResult.certCode
                      });
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Khoe Thẻ Ảnh 2x</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setViewState('lobby')}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-white/15 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Quay Lại Sảnh Thi
                </button>
              </div>
            </div>

            {/* Live Leaderboard Table */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Bảng Xếp Hạng Kỳ Thi Trực Tiếp Toàn Quốc</span>
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{leaderboard.length} thí sinh nộp bài</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/10 text-xs">
                {leaderboard.map((r, idx) => {
                  const isMe = r.candidateNumber === myRegistration?.candidateNumber;
                  return (
                    <div
                      key={idx}
                      className={`py-2.5 px-2 flex items-center justify-between rounded-lg ${
                        isMe ? 'bg-sky-50 dark:bg-sky-950/60 font-bold' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                          idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-sm font-bold text-slate-900 dark:text-white block">
                            {r.userName} {isMe && '(Bạn)'}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{r.candidateNumber}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block">
                          {r.score}/{r.totalQuestions} ({r.percentage}%)
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {Math.floor(r.timeSpentSeconds / 60)}p {r.timeSpentSeconds % 60}s
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
