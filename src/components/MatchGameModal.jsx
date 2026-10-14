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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-[#e9e9e8] text-[#37352f]">
        
        {/* Game Header (Notion Minimalist) */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-[#fbfbfa] text-[#37352f] border-b border-[#e9e9e8] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#e7f3f8] text-[#2b7aa1] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm sm:text-base font-bold text-[#37352f] uppercase tracking-tight">
                  Game Ghép Thẻ Siêu Tốc
                </h4>
                <span className="notion-tag notion-tag-blue text-[10px]">
                  Match Mode
                </span>
              </div>
              <p className="text-[11px] text-[#787774] line-clamp-1">
                {course.title}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Pronunciation toggle */}
            <button
              type="button"
              onClick={() => setAutoSpeech(!autoSpeech)}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                autoSpeech
                  ? 'bg-[#2383e2] text-white shadow-2xs'
                  : 'bg-[#f7f6f5] hover:bg-[#f0efed] text-[#787774]'
              }`}
              title={autoSpeech ? 'Phát âm khi chạm: BẬT' : 'Phát âm khi chạm: TẮT'}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Stopwatch Timer */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#f7f6f5] border border-[#e9e9e8] text-[#37352f] rounded-lg text-xs font-mono font-semibold">
              <Timer className="w-3.5 h-3.5 text-[#2383e2]" />
              <span className="text-[#37352f] text-xs">{timer.toFixed(1)}s</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-[#f0efed] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Best Record Ribbon */}
        {bestTime !== null && !isGameOver && (
          <div className="px-5 sm:px-6 py-2 bg-[#fbfbfa] border-b border-[#e9e9e8] flex items-center justify-between text-[11px] text-[#787774]">
            <span className="flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Kỷ lục cá nhân tốt nhất: <strong className="text-amber-700 font-mono font-semibold">{bestTime.toFixed(1)}s</strong></span>
            </span>
            <span>Chạm 2 thẻ tương ứng để triệt tiêu</span>
          </div>
        )}

        {/* Game Arena */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-white flex flex-col justify-center">
          {isGameOver ? (
            /* Win Screen */
            <div className="text-center py-6 sm:py-8 max-w-md mx-auto space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-2xl bg-[#fbf3db] text-[#cc782f] flex items-center justify-center mx-auto shadow-2xs">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                {isNewRecord ? (
                  <span className="notion-tag notion-tag-yellow text-xs font-semibold">
                    🏆 PHÁ KỶ LỤC CÁ NHÂN MỚI!
                  </span>
                ) : (
                  <span className="notion-tag notion-tag-green text-xs font-semibold">
                    🎉 Hoàn Thành Xuất Sắc!
                  </span>
                )}

                <h3 className="text-2xl sm:text-3xl font-bold text-[#37352f] mt-2.5">
                  Thời Gian: <span className="text-[#2383e2] font-mono">{timer.toFixed(1)}s</span>
                </h3>

                <p className="text-xs text-[#787774] mt-1 font-normal">
                  Bạn nhận được <strong className="text-emerald-700 font-semibold">+60 XP</strong> và duy trì chuỗi Streak học tập hôm nay!
                </p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-2.5">
                <button
                  onClick={initGame}
                  className="px-4 py-2 bg-[#2383e2] hover:bg-[#1a73e8] text-white rounded-lg text-xs font-medium shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Chơi Lại Vòng Này</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#f7f6f5] border border-[#e9e9e8] hover:bg-[#f0efed] text-[#37352f] rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  Đóng Lại
                </button>
              </div>
            </div>
          ) : (
            /* Grid of Tiles */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
              {tiles.map((tile) => {
                const isMatched = matchedIds.includes(tile.pairId);
                const isSelected = selectedTile?.tileId === tile.tileId;
                const isWrong = wrongPair.includes(tile.tileId);

                if (isMatched) {
                  return (
                    <div
                      key={tile.tileId}
                      className="h-24 sm:h-28 rounded-xl border border-dashed border-[#d3e5d7] bg-[#edf3ec] flex items-center justify-center opacity-40 transition-all pointer-events-none"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                  );
                }

                return (
                  <button
                    key={tile.tileId}
                    onClick={() => handleTileClick(tile)}
                    className={`h-24 sm:h-28 p-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center text-center transition-all select-none shadow-2xs cursor-pointer ${
                      isSelected
                        ? 'border-[#2383e2] bg-[#e7f3f8] text-[#37352f] ring-2 ring-[#2383e2] font-semibold'
                        : isWrong
                        ? 'border-[#f9c9cb] bg-[#fdebec] text-[#d44c47] ring-1 ring-[#d44c47] animate-shake'
                        : 'border-[#e9e9e8] bg-[#fbfbfa] hover:border-[#c5c4c0] hover:bg-white text-[#37352f]'
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
        <div className="px-5 sm:px-6 py-2.5 bg-[#fbfbfa] border-t border-[#e9e9e8] flex items-center justify-between text-xs text-[#787774] shrink-0">
          <span>Tiến độ ghép: <strong className="text-[#37352f] font-semibold">{matchedIds.length} / {totalPairs} cặp</strong></span>
          <button
            onClick={initGame}
            className="text-xs font-medium text-[#2383e2] hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xáo lại đề</span>
          </button>
        </div>

      </div>
    </div>
  );
}
