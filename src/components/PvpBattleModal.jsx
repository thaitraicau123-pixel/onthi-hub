import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Swords,
  Trophy,
  Clock,
  Flame,
  Zap,
  CheckCircle2,
  XCircle,
  X,
  Coins,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Shield,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/storage.js';
import {
  createPvpChallenge,
  acceptPvpChallenge,
  declinePvpChallenge,
  submitPvpProgress,
  subscribeToBattle,
  getBattleById
} from '../utils/pvpBattle.js';
import { getCurrentUserCoins } from '../utils/wallet.js';

export default function PvpBattleModal({
  isOpen,
  onClose,
  currentUser,
  targetPartner,
  allCourses = [],
  initialBattle = null,
  onOpenDirectChat
}) {
  const currentUserId = currentUser?.uid || currentUser?.email || 'my_user';
  const currentUserName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Học Viên';
  const currentUserAvatar =
    currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUserName)}`;

  // Trạng thái trận đấu
  const [battle, setBattle] = useState(initialBattle);
  const [selectedDeckId, setSelectedDeckId] = useState(() => allCourses[0]?.id || '');
  const [questionCount, setQuestionCount] = useState(5);
  const [wagerXu, setWagerXu] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Trạng thái thi đấu trực tiếp
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const timerRef = useRef(null);

  // Số dư Xu hiện tại của người chơi
  const userCoins = useMemo(() => getCurrentUserCoins(currentUser), [currentUser, battle]);

  // Bộ thẻ được chọn để thách đấu
  const selectedDeck = useMemo(() => {
    return allCourses.find((c) => c.id === selectedDeckId) || allCourses[0] || null;
  }, [allCourses, selectedDeckId]);

  // Lắng nghe cập nhật của trận đấu thời gian thực
  useEffect(() => {
    if (!battle?.id) return;
    const unsub = subscribeToBattle(battle.id, (updated) => {
      setBattle(updated);
      if (updated.status === 'finished' && updated.winnerId === currentUserId) {
        playSound('success');
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    });
    return () => unsub();
  }, [battle?.id, currentUserId]);

  // Xác định vai trò của người chơi hiện tại trong trận đấu
  const isPlayer1 = battle?.player1?.id === currentUserId;
  const isPlayer2 = battle?.player2?.id === currentUserId;
  const myPlayer = isPlayer1 ? battle?.player1 : battle?.player2;
  const opponentPlayer = isPlayer1 ? battle?.player2 : battle?.player1;

  // Đếm ngược 15 giây cho mỗi câu hỏi khi đang trong trận đấu
  useEffect(() => {
    if (battle?.status !== 'in_progress' || myPlayer?.isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(15);
    setQuestionStartTime(Date.now());
    setSelectedOption(null);
    setIsAnswered(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQIndex, battle?.status, myPlayer?.isFinished]);

  // Khi hết thời gian cho 1 câu
  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setCombo(0);
    playSound('error');

    const isLastQuestion = currentQIndex >= (battle?.questions?.length || 1) - 1;
    submitPvpProgress(battle.id, currentUserId, {
      questionIndex: currentQIndex,
      isCorrect: false,
      timeSpentMs: 15000,
      isFinished: isLastQuestion
    });

    setTimeout(() => {
      if (!isLastQuestion) {
        setCurrentQIndex((prev) => prev + 1);
      }
    }, 1200);
  };

  // Người chơi chọn một đáp án
  const handleSelectOption = (optionIndex) => {
    if (isAnswered || battle?.status !== 'in_progress' || myPlayer?.isFinished) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setIsAnswered(true);
    setSelectedOption(optionIndex);

    const question = battle.questions[currentQIndex];
    const isCorrect = optionIndex === question.correctIndex;
    const timeSpent = Date.now() - questionStartTime;

    if (isCorrect) {
      playSound('success');
      setCombo((prev) => prev + 1);
      if (combo >= 2) {
        try {
          confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
        } catch (e) {}
      }
    } else {
      playSound('error');
      setCombo(0);
    }

    const isLastQuestion = currentQIndex >= (battle?.questions?.length || 1) - 1;
    submitPvpProgress(battle.id, currentUserId, {
      questionIndex: currentQIndex,
      isCorrect,
      timeSpentMs: timeSpent,
      isFinished: isLastQuestion
    });

    setTimeout(() => {
      if (!isLastQuestion) {
        setCurrentQIndex((prev) => prev + 1);
      }
    }, 1200);
  };

  // Tạo trận thách đấu mới
  const handleCreateChallenge = async () => {
    if (!targetPartner) {
      setErrorMsg('Vui lòng chọn bạn học để gửi lời thách đấu!');
      return;
    }
    if (!selectedDeck) {
      setErrorMsg('Vui lòng chọn một bộ thẻ ôn thi!');
      return;
    }

    // Trích xuất câu hỏi từ bộ thẻ (hoặc giả lập trắc nghiệm từ Flashcard)
    let rawCards = selectedDeck.cards || selectedDeck.sampleCards || [];
    if (rawCards.length === 0) {
      setErrorMsg('Bộ thẻ này chưa có đủ nội dung câu hỏi!');
      return;
    }

    setIsCreating(true);
    setErrorMsg('');

    try {
      const shuffled = [...rawCards].sort(() => 0.5 - Math.random()).slice(0, questionCount);
      const generatedQuestions = shuffled.map((card, idx) => {
        const correctText = card.back || card.answer || 'Đáp án chính xác theo quy định pháp luật.';
        const fakeWrong = [
          'Chưa có quy định cụ thể tại văn bản này.',
          'Thuộc thẩm quyền quyết định của cơ quan cấp trên.',
          'Thời hạn thực hiện tối đa không quá 30 ngày làm việc.'
        ];
        const allOpts = [correctText, ...fakeWrong].sort(() => 0.5 - Math.random());
        return {
          id: `q_${idx}_${Date.now()}`,
          prompt: card.front || card.question || `Câu hỏi trọng tâm số ${idx + 1}`,
          options: allOpts,
          correctIndex: allOpts.indexOf(correctText),
          explanation: card.note || card.explanation || 'Theo quy định trọng tâm của bộ tài liệu ôn thi.'
        };
      });

      const newBattle = await createPvpChallenge({
        sender: {
          id: currentUserId,
          name: currentUserName,
          avatar: currentUserAvatar,
          email: currentUser?.email
        },
        receiver: targetPartner,
        deckId: selectedDeck.id,
        deckTitle: selectedDeck.title,
        deckIcon: selectedDeck.icon || '⚔️',
        questions: generatedQuestions,
        wagerXu
      });

      setBattle(newBattle);
      playSound('success');
    } catch (err) {
      setErrorMsg(err.message || 'Không thể tạo lời thách đấu. Vui lòng thử lại!');
      playSound('error');
    } finally {
      setIsCreating(false);
    }
  };

  // Chấp nhận lời thách đấu từ bạn học
  const handleAccept = async () => {
    try {
      playSound('click');
      const updated = await acceptPvpChallenge(battle.id, {
        id: currentUserId,
        name: currentUserName,
        avatar: currentUserAvatar,
        email: currentUser?.email
      });
      setBattle(updated);
      playSound('success');
    } catch (err) {
      alert(err.message || 'Không thể chấp nhận thách đấu!');
    }
  };

  // Từ chối lời thách đấu
  const handleDecline = async () => {
    try {
      playSound('click');
      await declinePvpChallenge(battle.id, currentUser);
      onClose();
    } catch (err) {}
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && battle?.status !== 'in_progress') onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white"
      >
        {/* =========================================================
            HEADER ARENA
            ========================================================= */}
        <div className="p-4 sm:px-6 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Swords className="w-5 h-5 text-yellow-200 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-wide flex items-center gap-2">
                <span>ĐẤU TRƯỜNG 1v1 ĐỐI KHÁNG</span>
                {battle?.wagerXu > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    <span>Cược {battle.wagerXu} Xu</span>
                  </span>
                )}
              </h3>
              <p className="text-xs text-rose-100 truncate">
                {battle?.deckTitle ? `Bộ đề: ${battle.deckTitle}` : 'So tài trắc nghiệm thời gian thực'}
              </p>
            </div>
          </div>

          {battle?.status !== 'in_progress' && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* =========================================================
            CASE 1: FORM CẤU HÌNH TẠO THÁCH ĐẤU MỚI
            ========================================================= */}
        {!battle && (
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
            {/* Đối thủ thi đấu */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={targetPartner?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=opponent'}
                  alt={targetPartner?.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Đối thủ thách đấu
                  </span>
                  <h4 className="text-sm font-bold text-white">{targetPartner?.name || 'Bạn học'}</h4>
                  <p className="text-xs text-slate-400">{targetPartner?.email}</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black">
                VS 1v1
              </div>
            </div>

            {/* Chọn bộ đề */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Chọn Bộ Đề Thi Đấu:</label>
              <select
                value={selectedDeckId}
                onChange={(e) => setSelectedDeckId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white outline-none focus:border-amber-400"
              >
                {allCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon || '📚'} {c.title} ({c.cardsCount || c.cards?.length || 0} thẻ)
                  </option>
                ))}
              </select>
            </div>

            {/* Số lượng câu hỏi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Số Lượng Câu Hỏi Đối Kháng:</label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      questionCount === cnt
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-[1.02]'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {cnt} Câu
                  </button>
                ))}
              </div>
            </div>

            {/* Mức cược Xu */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Mức Cược Xu (Tùy chọn):</label>
                <span className="text-xs text-amber-400 font-bold">Số dư của bạn: {userCoins} Xu</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 10, 20, 50].map((xu) => (
                  <button
                    key={xu}
                    type="button"
                    disabled={xu > userCoins}
                    onClick={() => setWagerXu(xu)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      wagerXu === xu
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-md'
                        : xu > userCoins
                        ? 'opacity-40 bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {xu === 0 ? 'Giao Hữu' : `${xu} Xu`}
                  </button>
                ))}
              </div>
              {wagerXu > 0 && (
                <p className="text-[11px] text-amber-300/80 bg-amber-950/30 p-2.5 rounded-xl border border-amber-800/40">
                  ⚡ <strong>Quy tắc cược:</strong> Người thắng ẵm trọn {Math.round(wagerXu * 2 * 0.9)} Xu (đã trừ 10%
                  phí sàn duy trì máy chủ OnThiHub). Nếu hòa điểm & thời gian, hệ thống hoàn trả 100% Xu cho cả 2 bên.
                </p>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="button"
              disabled={isCreating}
              onClick={handleCreateChallenge}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm shadow-lg flex items-center justify-center space-x-2 cursor-pointer transition-transform active:scale-98"
            >
              <Swords className="w-4 h-4" />
              <span>{isCreating ? 'Đang tạo phòng đấu...' : 'Gửi Lời Thách Đấu Ngay! 🔥'}</span>
            </button>
          </div>
        )}

        {/* =========================================================
            CASE 2: TRẠNG THÁI CHỜ ĐỐI THỦ CHẤP NHẬN
            ========================================================= */}
        {battle?.status === 'pending' && (
          <div className="p-6 text-center space-y-5 my-auto">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-red-500 to-amber-500 flex items-center justify-center text-3xl shadow-lg">
                ⚔️
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {isPlayer1 ? 'Đã Gửi Lời Thách Đấu!' : 'Bạn Nhận Được Lời Thách Đấu 1v1!'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                {isPlayer1
                  ? `Đang chờ ${battle.player2.name} chấp nhận lời mời để bắt đầu trận đấu...`
                  : `${battle.player1.name} muốn so tài cùng bạn với bộ đề "${battle.deckTitle}" (${battle.totalQuestions} câu • ${
                      battle.wagerXu > 0 ? `Cược ${battle.wagerXu} Xu` : 'Giao hữu'
                    })`}
              </p>
            </div>

            {isPlayer2 ? (
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-white font-black text-xs shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Chấp Nhận & Thi Đấu Ngay</span>
                </button>
                <button
                  type="button"
                  onClick={handleDecline}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
                >
                  Từ Chối
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-amber-300 font-medium animate-pulse">
                  <Clock className="w-4 h-4" />
                  <span>Đối thủ đang nhận thông báo trên khung chat...</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            CASE 3: ĐANG TRONG TRẬN ĐẤU (LIVE 1v1 MATCH)
            ========================================================= */}
        {battle?.status === 'in_progress' && (
          <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4 overflow-y-auto">
            {/* SCOREBOARD TRỰC TIẾP GIỮA 2 BÊN */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md">
              {/* Player 1 (You) */}
              <div className="flex items-center space-x-2.5">
                <img
                  src={myPlayer?.avatar}
                  alt={myPlayer?.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white truncate">{myPlayer?.name} (Bạn)</span>
                    {combo >= 2 && (
                      <span className="text-[10px] font-black px-1.5 rounded-full bg-orange-500 text-white animate-bounce">
                        x{combo} 🔥
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-black text-emerald-400">
                    {myPlayer?.score || 0} Điểm{' '}
                    <span className="text-[10px] text-slate-400 font-normal">
                      (Câu {Math.min(currentQIndex + 1, battle.totalQuestions)}/{battle.totalQuestions})
                    </span>
                  </span>
                </div>
              </div>

              {/* Player 2 (Opponent) */}
              <div className="flex items-center space-x-2.5 justify-end text-right">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-200 truncate block">{opponentPlayer?.name}</span>
                  <span className="text-sm font-black text-rose-400">
                    {opponentPlayer?.score || 0} Điểm{' '}
                    <span className="text-[10px] text-slate-400 font-normal">
                      {opponentPlayer?.isFinished ? '(Đã nộp)' : `(Câu ${opponentPlayer?.currentQuestion || 0})`}
                    </span>
                  </span>
                </div>
                <img
                  src={opponentPlayer?.avatar}
                  alt={opponentPlayer?.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-rose-400"
                />
              </div>
            </div>

            {/* THANH ĐẾM NGƯỢC THỜI GIAN 15 GIÂY */}
            {!myPlayer?.isFinished && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Thời gian câu hỏi:</span>
                  </span>
                  <span className={timeLeft <= 4 ? 'text-rose-400 font-black animate-ping' : 'text-amber-400'}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                      timeLeft <= 4
                        ? 'bg-rose-500'
                        : timeLeft <= 8
                        ? 'bg-amber-400'
                        : 'bg-gradient-to-r from-emerald-400 to-sky-400'
                    }`}
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* NỘI DUNG CÂU HỎI */}
            {!myPlayer?.isFinished && battle.questions[currentQIndex] ? (
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 min-h-[90px] flex items-center justify-center text-center">
                  <h4 className="text-sm sm:text-base font-extrabold text-white leading-relaxed">
                    {battle.questions[currentQIndex].prompt}
                  </h4>
                </div>

                {/* 4 ĐÁP ÁN TRẮC NGHIỆM */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {battle.questions[currentQIndex].options.map((optText, optIdx) => {
                    const isCorrect = optIdx === battle.questions[currentQIndex].correctIndex;
                    const isChosen = selectedOption === optIdx;

                    let btnStyle = 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-100';
                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-400 shadow-md font-bold';
                      } else if (isChosen) {
                        btnStyle = 'bg-rose-600 text-white border-rose-400 shadow-md font-bold';
                      } else {
                        btnStyle = 'opacity-40 bg-slate-800 border-slate-800 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-3.5 rounded-2xl border text-xs sm:text-sm text-left transition-all cursor-pointer flex items-start space-x-2.5 active:scale-98 ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center font-black shrink-0 text-xs">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1 leading-snug">{optText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* KHI BẠN ĐÃ LÀM XONG NHƯNG ĐỐI THỦ CHƯA LÀM XONG */
              <div className="p-8 text-center space-y-4 my-auto">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">Bạn Đã Hoàn Thành Bài Thi!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Điểm số của bạn: <strong>{myPlayer?.score || 0}</strong>/{battle.totalQuestions}. Đang chờ đối thủ{' '}
                    <strong>{opponentPlayer?.name}</strong> nộp bài để công bố kết quả...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            CASE 4: KẾT QUẢ CHUNG CUỘC (BATTLE FINISHED)
            ========================================================= */}
        {battle?.status === 'finished' && (
          <div className="p-6 sm:p-8 text-center space-y-6 my-auto overflow-y-auto">
            {battle.winnerId === currentUserId ? (
              <div className="space-y-2">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 shadow-2xl animate-bounce">
                  <Trophy className="w-10 h-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-amber-300">🎉 CHIẾN THẮNG TUYỆT ĐỐI!</h3>
                <p className="text-xs text-slate-300">
                  Bạn đã xuất sắc vượt qua {opponentPlayer?.name} với phản xạ nhanh nhạy và kiến thức vững vàng!
                </p>
                {battle.wagerXu > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400/20 border border-amber-400 text-amber-300 text-sm font-black">
                    <Coins className="w-4 h-4" />
                    <span>+Nhận {battle.winningXu} Xu Thưởng! 💰</span>
                  </div>
                )}
              </div>
            ) : battle.winnerId === 'tie' ? (
              <div className="space-y-2">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-800 flex items-center justify-center text-3xl shadow-lg">
                  🤝
                </div>
                <h3 className="text-xl font-black text-sky-300">TỶ SỐ HÒA CÂN NÃO!</h3>
                <p className="text-xs text-slate-300">
                  Cả hai bạn học đều có điểm số và tốc độ tương đương nhau! (Đã hoàn lại 100% Xu cược).
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-800 flex items-center justify-center text-3xl shadow-lg">
                  ⚔️
                </div>
                <h3 className="text-xl font-black text-rose-300">SUÝT NỮA LÀ THẮNG RỒI!</h3>
                <p className="text-xs text-slate-300">
                  {opponentPlayer?.name} đã bứt phá tốc độ ở những câu cuối! Ôn luyện thêm và phục thù ngay nhé!
                </p>
              </div>
            )}

            {/* BẢNG SO SÁNH ĐIỂM CHI TIẾT */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 max-w-md mx-auto">
              <div className="text-left space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Bạn</span>
                <h5 className="text-sm font-bold text-white truncate">{myPlayer?.name}</h5>
                <p className="text-lg font-black text-emerald-400">{myPlayer?.score || 0} Điểm</p>
                <p className="text-[10px] text-slate-400">
                  ⏱️ {Math.round((myPlayer?.timeSpentMs || 0) / 1000)}s
                </p>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Đối thủ</span>
                <h5 className="text-sm font-bold text-white truncate">{opponentPlayer?.name}</h5>
                <p className="text-lg font-black text-rose-400">{opponentPlayer?.score || 0} Điểm</p>
                <p className="text-[10px] text-slate-400">
                  ⏱️ {Math.round((opponentPlayer?.timeSpentMs || 0) / 1000)}s
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setBattle(null);
                  setCurrentQIndex(0);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thách Đấu Lại (Rematch)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDirectChat?.(targetPartner);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
              >
                Về Khung Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
