import React, { useState, useEffect } from 'react';
import { X, Trophy, Timer, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
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
        text: c.front.length > 90 ? c.front.slice(0, 85) + '...' : c.front
      });
      // Answer tile
      const backShort = c.back.split('\n')[0];
      generatedTiles.push({
        tileId: `back_${idx}`,
        pairId: idx,
        type: 'back',
        text: backShort.length > 90 ? backShort.slice(0, 85) + '...' : backShort
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
      if (newMatched.length === Math.min(course.previewCards?.length || 6, 6)) {
        setIsGameOver(true);
        playSound('success');
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        recordStudyAction(50); // Award 50 XP
        completeDailyQuest('match_game');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-200 animate-spring-3d">
        
        {/* Game Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900">
                Thử Thách Ghép Thẻ Siêu Tốc (Match Mode)
              </h4>
              <p className="text-[11px] text-slate-500">
                Chạm nối câu hỏi với đáp án tương ứng càng nhanh càng tốt!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-xl text-xs font-mono font-bold">
              <Timer className="w-3.5 h-3.5 text-amber-700" />
              <span>{timer.toFixed(1)}s</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Arena */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100/50 flex flex-col justify-center">
          {isGameOver ? (
            /* Win Screen */
            <div className="text-center py-8 max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto animate-bounce shadow-md">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Xuất Sắc • Phá Kỷ Lục!
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Thời Gian: {timer.toFixed(1)} giây!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Bạn vừa nhận được <strong className="text-indigo-600">+50 XP</strong> và duy trì chuỗi Streak học tập hôm nay!
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={initGame}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi Lại Vòng Này</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Đóng Lại
                </button>
              </div>
            </div>
          ) : (
            /* Grid of Tiles */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {tiles.map((tile) => {
                const isMatched = matchedIds.includes(tile.pairId);
                const isSelected = selectedTile?.tileId === tile.tileId;
                const isWrong = wrongPair.includes(tile.tileId);

                if (isMatched) {
                  return (
                    <div
                      key={tile.tileId}
                      className="h-28 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/30 flex items-center justify-center opacity-40 transition-all pointer-events-none"
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                  );
                }

                return (
                  <button
                    key={tile.tileId}
                    onClick={() => handleTileClick(tile)}
                    className={`h-28 p-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center text-center transition-all duration-200 select-none shadow-xs ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500 scale-102 font-bold shadow-md'
                        : isWrong
                        ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-400 animate-shake'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md text-slate-800'
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
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tiến độ ghép: <strong>{matchedIds.length} / 6 cặp</strong></span>
          <button
            onClick={initGame}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xáo lại đề</span>
          </button>
        </div>

      </div>
    </div>
  );
}
