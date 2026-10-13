import React, { useState, useEffect } from 'react';
import { X, Trophy, Timer, RotateCcw, Sparkles, CheckCircle2, Volume2, Flame, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/storage';
import { recordStudyAction, completeDailyQuest } from '../utils/gamification';

export default function MatchGameModal({ course, onClose }) {
  const [tiles, setTiles] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [wrongPair, setWrongPair] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [autoSpeech, setAutoSpeech] = useState(true);

  const bestTimeKey = `onthi_match_best_time_${course?.id || 'default'}`;
  const [bestTime, setBestTime] = useState(() => {
    try {
      const saved = localStorage.getItem(bestTimeKey);
      return saved ? parseFloat(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Native Speech Synthesis
  const speakText = (text) => {
    if (!autoSpeech || !('speechSynthesis' in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (/^[a-zA-Z\s,.'?!-]+$/.test(text)) {
        utterance.lang = 'en-US';
      } else {
        utterance.lang = 'vi-VN';
      }
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  // Initialize game with 5-6 pairs
  const initGame = () => {
    const rawCards = (course.previewCards || []).slice(0, 6);
    const generatedTiles = [];

    rawCards.forEach((c, idx) => {
      // Question tile
      generatedTiles.push({
        tileId: `front_${idx}`,
        pairId: idx,
        type: 'front',
        text: c.front.length > 90 ? c.front.slice(0, 85) + '...' : c.front,
        fullText: c.front
      });
      // Answer tile
      const backShort = c.back.split('\n')[0];
      generatedTiles.push({
        tileId: `back_${idx}`,
        pairId: idx,
        type: 'back',
        text: backShort.length > 90 ? backShort.slice(0, 85) + '...' : backShort,
        fullText: backShort
      });
    });

    // Shuffle tiles
    generatedTiles.sort(() => Math.random() - 0.5);
    setTiles(generatedTiles);
    setSelectedTile(null);
    setMatchedIds([]);
    setWrongPair([]);
    setTimer(0);
    setIsGameOver(false);
    setIsNewRecord(false);
  };

  useEffect(() => {
    initGame();
  }, [course]);

  // Stopwatch timer
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setTimer((prev) => +(prev + 0.1).toFixed(1));
    }, 100);
    return () => clearInterval(interval);
  }, [isGameOver]);

  // Tile click logic
  const handleTileClick = (tile) => {
    if (isGameOver || matchedIds.includes(tile.pairId) || wrongPair.includes(tile.tileId)) return;

    speakText(tile.text);

    if (!selectedTile) {
      // Select first tile
      setSelectedTile(tile);
      playSound('flip');
      return;
    }

    if (selectedTile.tileId === tile.tileId) {
      // Deselect if clicked same tile
      setSelectedTile(null);
      return;
    }

    // Check if match
    if (selectedTile.pairId === tile.pairId && selectedTile.type !== tile.type) {
      // CORRECT MATCH!
      playSound('correct');
      const newMatched = [...matchedIds, tile.pairId];
      setMatchedIds(newMatched);
      setSelectedTile(null);

      // Check win condition
      const totalPairs = Math.min(course.previewCards?.length || 6, 6);
      if (newMatched.length === totalPairs) {
        setIsGameOver(true);
        playSound('success');
        confetti({ particleCount: 120, spread: 85, origin: { y: 0.55 } });
        recordStudyAction(60); // Award 60 XP
        completeDailyQuest('match_game');

        // Check if new record
        const finalTime = timer;
        if (!bestTime || finalTime < bestTime) {
          setIsNewRecord(true);
          setBestTime(finalTime);
          try {
            localStorage.setItem(bestTimeKey, finalTime.toString());
          } catch (e) {}
        }
      }
    } else {
      // WRONG MATCH
      setWrongPair([selectedTile.tileId, tile.tileId]);
      playSound('flip');
      setTimeout(() => {
        setWrongPair([]);
        setSelectedTile(null);
      }, 700);
    }
  };

  const totalPairs = Math.min(course.previewCards?.length || 6, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#fcf7ec] rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border-2 border-[#eadfcb] text-[#28071a] animate-scale-up">
        
        {/* Game Header (Wayground Velvet Wine) */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-[#240618] via-[#380b23] to-[#240618] text-white border-b border-[#f02c85]/40 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#f02c85] to-[#ff5f38] text-white flex items-center justify-center font-bold shadow-md shadow-pink-900/40">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                  Game Ghép Thẻ Siêu Tốc
                </h4>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#f02c85] text-white">
                  Match Mode
                </span>
              </div>
              <p className="text-[11px] text-pink-200/80 font-medium line-clamp-1">
                {course.title}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Pronunciation toggle */}
            <button
              type="button"
              onClick={() => setAutoSpeech(!autoSpeech)}
              className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                autoSpeech
                  ? 'bg-[#f02c85] text-white'
                  : 'bg-white/10 text-pink-200 hover:text-white'
              }`}
              title={autoSpeech ? 'Phát âm khi chạm: BẬT' : 'Phát âm khi chạm: TẮT'}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Stopwatch Timer */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#f02c85]/20 border border-[#f02c85]/40 text-pink-200 rounded-xl text-xs font-mono font-black shadow-xs">
              <Timer className="w-3.5 h-3.5 text-[#ff80b5]" />
              <span className="text-white text-sm">{timer.toFixed(1)}s</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-rose-200/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Best Record Ribbon */}
        {bestTime !== null && !isGameOver && (
          <div className="px-5 sm:px-6 py-1.5 bg-[#f6ebd5] border-b border-[#eadfcb] flex items-center justify-between text-[11px] text-[#7a5a6b] font-bold">
            <span className="flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Kỷ lục cá nhân tốt nhất: <strong className="text-amber-700 font-mono font-black">{bestTime.toFixed(1)}s</strong></span>
            </span>
            <span>Chạm 2 thẻ tương ứng để triệt tiêu</span>
          </div>
        )}

        {/* Game Arena */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-[#fcf7ec] flex flex-col justify-center">
          {isGameOver ? (
            /* Win Screen */
            <div className="text-center py-6 sm:py-8 max-w-md mx-auto space-y-4 animate-scale-up">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#f02c85] to-[#ff5f38] text-white flex items-center justify-center mx-auto shadow-xl shadow-pink-900/30 animate-bounce">
                <Trophy className="w-10 h-10 fill-white" />
              </div>

              <div>
                {isNewRecord ? (
                  <span className="text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 to-rose-500 px-3.5 py-1 rounded-full shadow-md animate-pulse">
                    🏆 PHÁ KỶ LỤC CÁ NHÂN MỚI!
                  </span>
                ) : (
                  <span className="text-xs font-black uppercase tracking-wider text-[#f02c85] bg-pink-100 px-3 py-1 rounded-full border border-pink-200">
                    🎉 Hoàn Thành Xuất Sắc!
                  </span>
                )}

                <h3 className="text-3xl font-black text-[#28071a] mt-2.5">
                  Thời Gian: <span className="text-[#f02c85] font-mono">{timer.toFixed(1)}s</span>
                </h3>

                <p className="text-xs text-[#7a5a6b] mt-1 font-medium">
                  Bạn nhận được <strong className="text-emerald-700 font-black">+60 XP</strong> và giữ chuỗi Streak học tập hôm nay!
                </p>
              </div>

              <div className="pt-3 flex flex-wrap justify-center gap-3">
                <button
                  onClick={initGame}
                  className="px-6 py-2.5 btn-wayground-sunset text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi Lại Vòng Này</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white border border-[#eadfcb] hover:bg-[#faebd0] text-[#28071a] rounded-xl text-xs font-bold transition-colors"
                >
                  Đóng Lại
                </button>
              </div>
            </div>
          ) : (
            /* Grid of Tiles */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
              {tiles.map((tile) => {
                const isMatched = matchedIds.includes(tile.pairId);
                const isSelected = selectedTile?.tileId === tile.tileId;
                const isWrong = wrongPair.includes(tile.tileId);

                if (isMatched) {
                  return (
                    <div
                      key={tile.tileId}
                      className="h-28 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 flex items-center justify-center opacity-40 transition-all pointer-events-none"
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                  );
                }

                return (
                  <button
                    key={tile.tileId}
                    onClick={() => handleTileClick(tile)}
                    className={`h-28 p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center text-center transition-all duration-200 select-none shadow-xs ${
                      isSelected
                        ? 'border-[#f02c85] bg-pink-100/80 text-[#28071a] ring-2 ring-[#f02c85] scale-102 font-black shadow-md'
                        : isWrong
                        ? 'border-rose-500 bg-rose-100/80 text-rose-900 ring-2 ring-rose-400 animate-shake'
                        : 'border-[#eadfcb] bg-white hover:border-[#f02c85] hover:shadow-md text-[#28071a]'
                    }`}
                  >
                    <span className="line-clamp-4 leading-snug">{tile.text}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-5 sm:px-6 py-3 bg-[#f5ecd8] border-t border-[#eadfcb] flex items-center justify-between text-xs text-[#7a5a6b] font-medium shrink-0">
          <span>Tiến độ ghép: <strong className="text-[#28071a] font-black">{matchedIds.length} / {totalPairs} cặp</strong></span>
          <button
            onClick={initGame}
            className="text-xs font-bold text-[#f02c85] hover:underline flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xáo lại đề</span>
          </button>
        </div>

      </div>
    </div>
  );
}
