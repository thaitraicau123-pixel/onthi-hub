import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Minimize2,
  Maximize2,
  CheckCircle2,
  X,
  Coffee,
  Flame,
  Award,
  Sliders
} from 'lucide-react';
import {
  playClockTick,
  playTimerStartSound,
  playTimerPauseSound,
  playTimerResetSound,
  playCountdownWarningBeep,
  playPomodoroCompletionChime,
  playAmbientSound,
  stopAmbientSound,
  setAmbientSoundVolume,
  getAudioContext
} from '../utils/pomodoroAudio';
import { recordStudyAction } from '../utils/gamification';
import { addWalletCoins } from '../utils/wallet';
import confetti from 'canvas-confetti';

const MODES = {
  focus: { label: 'Tập Trung', duration: 25 * 60, color: 'from-[#ff5f38] to-[#f02c85]' },
  shortBreak: { label: 'Nghỉ Ngắn', duration: 5 * 60, color: 'from-emerald-500 to-teal-600' },
  longBreak: { label: 'Nghỉ Dài', duration: 15 * 60, color: 'from-blue-500 to-cyan-600' }
};

export default function PomodoroTimerWidget({ onBonusReward }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('focus');
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.duration);
  const [isActive, setIsActive] = useState(false);
  
  // SOUND STATES - Default to TICK (Tiếng tích tắc đồng hồ BẬT sẵn)
  const [ambientSound, setAmbientSound] = useState('tick'); // 'tick' | 'rain' | 'waves' | 'cafe' | 'none'
  const [isTickSoundEnabled, setIsTickSoundEnabled] = useState(true);
  const [clockVolume, setClockVolume] = useState(0.5); // 0.1 to 1.0
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const [completedSessions, setCompletedSessions] = useState(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const raw = localStorage.getItem('onthi_pomodoro_stats');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.date === today) return parsed.count || 0;
      }
      return 0;
    } catch (e) {
      return 0;
    }
  });

  // Countdown timer effect with real clock sound every second
  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleCompleteSession();
            return 0;
          }
          const next = prev - 1;

          // 1. Tiếng tích tắc đồng hồ cơ (Tick - Tock) trên từng giây
          if (isTickSoundEnabled && ambientSound === 'tick') {
            const isOdd = next % 2 === 1;
            playClockTick(isOdd, clockVolume);
          }

          // 2. Tiếng bíp cảnh báo đếm ngược 5 giây cuối (5, 4, 3, 2, 1)
          if (next <= 5 && next >= 1 && isTickSoundEnabled) {
            playCountdownWarningBeep(next, clockVolume);
          }

          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, isTickSoundEnabled, ambientSound, clockVolume]);

  // Ambient background sound effect (Rain / Waves / Cafe)
  useEffect(() => {
    if (isTickSoundEnabled && ambientSound !== 'none' && ambientSound !== 'tick') {
      playAmbientSound(ambientSound, clockVolume);
    } else {
      stopAmbientSound();
    }
  }, [isTickSoundEnabled, ambientSound]);

  // Volume slider real-time update
  useEffect(() => {
    if (isTickSoundEnabled && ambientSound !== 'none' && ambientSound !== 'tick') {
      setAmbientSoundVolume(clockVolume);
    }
  }, [clockVolume]);

  const handleCompleteSession = () => {
    setIsActive(false);
    playPomodoroCompletionChime(clockVolume);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    if (currentMode === 'focus') {
      const newCount = completedSessions + 1;
      setCompletedSessions(newCount);
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('onthi_pomodoro_stats', JSON.stringify({ date: today, count: newCount }));

      // Reward +50 XP & +1 Xu
      recordStudyAction(50);
      addWalletCoins(1, 'Thưởng hoàn thành 25 phút Pomodoro tập trung');
      if (onBonusReward) onBonusReward();

      alert('🎉 Chúc mừng bạn đã hoàn thành 25 phút tập trung! Bạn được thưởng +50 XP và +1 Xu vào ví.');
      // Auto switch to short break
      setCurrentMode('shortBreak');
      setSecondsLeft(MODES.shortBreak.duration);
    } else {
      alert('☕ Hết giờ nghỉ ngơi rồi! Sẵn sàng cho phiên tập trung tiếp theo nào!');
      setCurrentMode('focus');
      setSecondsLeft(MODES.focus.duration);
    }
  };

  const switchMode = (modeKey) => {
    getAudioContext();
    setIsActive(false);
    setCurrentMode(modeKey);
    setSecondsLeft(MODES[modeKey].duration);
    playTimerPauseSound(clockVolume * 0.7);
  };

  const toggleTimer = () => {
    getAudioContext(); // Resume Web Audio on user gesture
    if (!isActive) {
      playTimerStartSound(clockVolume);
      setIsActive(true);
      // Ngay lập tức phát tiếng tích tắc hoặc âm thanh tập trung
      if (isTickSoundEnabled) {
        if (ambientSound === 'tick') {
          playClockTick(true, clockVolume);
        } else if (ambientSound !== 'none') {
          playAmbientSound(ambientSound, clockVolume);
        }
      }
    } else {
      playTimerPauseSound(clockVolume);
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    getAudioContext();
    playTimerResetSound(clockVolume);
    setIsActive(false);
    setSecondsLeft(MODES[currentMode].duration);
  };

  const toggleMasterSound = () => {
    getAudioContext();
    const nextState = !isTickSoundEnabled;
    setIsTickSoundEnabled(nextState);
    if (!nextState) {
      stopAmbientSound();
    } else {
      if (ambientSound === 'none') {
        setAmbientSound('tick');
        playClockTick(true, clockVolume);
      } else if (ambientSound === 'tick') {
        playClockTick(true, clockVolume);
      } else {
        playAmbientSound(ambientSound, clockVolume);
      }
    }
  };

  const handleSelectSoundMode = (soundId) => {
    getAudioContext();
    setAmbientSound(soundId);
    if (soundId === 'none') {
      setIsTickSoundEnabled(false);
      stopAmbientSound();
    } else {
      setIsTickSoundEnabled(true);
      if (soundId === 'tick') {
        stopAmbientSound();
        playClockTick(true, clockVolume);
      } else {
        // 'rain' | 'waves' | 'cafe'
        playAmbientSound(soundId, clockVolume);
      }
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((MODES[currentMode].duration - secondsLeft) / MODES[currentMode].duration) * 100;

  return (
    <>
      {/* FLOATING PILL BUTTON (Always accessible in bottom right) */}
      {!isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-5 z-40 animate-fade-in">
          <button
            onClick={() => {
              getAudioContext();
              setIsOpen(true);
            }}
            className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-full shadow-2xl text-white font-black text-xs sm:text-sm transition-all transform hover:scale-105 active:scale-95 border ${
              isActive
                ? 'bg-gradient-to-r from-[#ff5f38] to-[#f02c85] ring-2 ring-pink-400/50 shadow-pink-900/50 animate-pulse border-white/40'
                : 'bg-[#240618] hover:bg-[#360b24] border-[#f02c85]/40 shadow-black/50'
            }`}
            title="Đồng hồ Pomodoro tập trung học"
          >
            <Timer className={`w-4 h-4 ${isActive ? 'animate-spin text-white' : 'text-[#f02c85]'}`} style={{ animationDuration: '6s' }} />
            <span className="font-mono tracking-wider font-black">{formatTime(secondsLeft)}</span>
            
            {/* Sound Icon on floating button */}
            {isTickSoundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-pink-300" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}

            {completedSessions > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black border border-amber-400/30">
                🍅 {completedSessions}
              </span>
            )}
          </button>
        </div>
      )}

      {/* EXPANDED POMODORO FOCUS DASHBOARD (Wayground Aesthetic) */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-96 bg-[#fcf7ec] rounded-3xl sm:shadow-2xl border border-[#eadfcb] overflow-hidden flex flex-col animate-spring-3d text-[#28071a]">
          
          {/* Header */}
          <div className="bg-[#260619] text-white px-5 py-4 flex items-center justify-between border-b border-[#f02c85]/20">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#f02c85] flex items-center justify-center font-bold shadow-md shadow-pink-900/40">
                <Timer className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black tracking-tight uppercase">Đồng Hồ Pomodoro</h4>
                <p className="text-[10px] text-rose-200/70 font-medium">Tập trung học • Thưởng +50 XP & +1 Xu</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Quick Sound Toggle in Header */}
              <button
                onClick={toggleMasterSound}
                className={`p-1.5 rounded-xl border transition-colors ${
                  isTickSoundEnabled
                    ? 'bg-[#f02c85] text-white border-pink-400'
                    : 'bg-[#360b24] text-rose-300 border-[#f02c85]/30 hover:text-white'
                }`}
                title={isTickSoundEnabled ? 'Tắt âm thanh đồng hồ' : 'Bật âm thanh tích tắc'}
              >
                {isTickSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-rose-200/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Thu nhỏ thành nút nổi"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="p-3 bg-[#f5ecd8] border-b border-[#eadfcb] flex items-center gap-1.5 text-xs font-black">
            <button
              onClick={() => switchMode('focus')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                currentMode === 'focus'
                  ? 'bg-[#f02c85] text-white shadow-md shadow-pink-900/30'
                  : 'bg-white text-[#28071a] border border-[#eadfcb] hover:bg-[#faebd0]'
              }`}
            >
              🍅 Tập Trung (25p)
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                currentMode === 'shortBreak'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-[#28071a] border border-[#eadfcb] hover:bg-[#faebd0]'
              }`}
            >
              ☕ Nghỉ (5p)
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                currentMode === 'longBreak'
                  ? 'bg-[#28071a] text-white shadow-md'
                  : 'bg-white text-[#28071a] border border-[#eadfcb] hover:bg-[#faebd0]'
              }`}
            >
              🌴 Dài (15p)
            </button>
          </div>

          {/* Timer Display Area */}
          <div className="p-6 text-center flex flex-col items-center justify-center">
            
            {/* Big Circular Dial with Hot Pink progress */}
            <div className="relative w-48 h-48 rounded-full border-4 border-[#eadfcb] bg-white flex flex-col items-center justify-center shadow-lg my-1">
              <div
                className="absolute inset-0 rounded-full border-4 border-[#f02c85] transition-all duration-1000"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${progressPercent >= 25 ? '100% 0%,' : ''} ${progressPercent >= 50 ? '100% 100%,' : ''} ${progressPercent >= 75 ? '0% 100%,' : ''} 0% 0%)`,
                  opacity: isActive ? 1 : 0.4
                }}
              />
              <span className="text-4xl sm:text-5xl font-mono font-black text-[#28071a] tracking-tight">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-[11px] font-black text-[#f02c85] mt-1 uppercase tracking-wider">
                {MODES[currentMode].label}
              </span>

              {/* Sound status tag inside clock */}
              <div className="mt-1 flex items-center space-x-1 text-[10px] font-bold text-[#7a5a6b]">
                {isTickSoundEnabled ? (
                  <span className="text-emerald-700 flex items-center space-x-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{ambientSound === 'tick' ? 'Tích tắc ⏱️' : ambientSound === 'rain' ? 'Mưa 🌧️' : ambientSound === 'waves' ? 'Sóng 🌊' : 'Cafe ☕'}</span>
                  </span>
                ) : (
                  <span className="text-slate-400">🔇 Tắt tiếng</span>
                )}
              </div>
            </div>

            {/* Play/Pause/Reset Controls */}
            <div className="flex items-center space-x-3 mt-4">
              <button
                onClick={resetTimer}
                className="p-3.5 rounded-2xl bg-white hover:bg-[#faebd0] border border-[#eadfcb] text-[#28071a] transition-colors shadow-xs"
                title="Đặt lại đồng hồ"
              >
                <RotateCcw className="w-5 h-5 text-[#28071a]" />
              </button>

              <button
                onClick={toggleTimer}
                className={`px-8 py-3.5 rounded-2xl text-white font-black text-sm shadow-xl flex items-center space-x-2 transition-transform transform hover:scale-105 active:scale-95 ${
                  isActive
                    ? 'bg-[#28071a] hover:bg-[#3d0c27] shadow-black/20'
                    : 'btn-wayground-sunset shadow-pink-900/30'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5 fill-white" />
                    <span>TẠM DỪNG</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>BẮT ĐẦU</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Sound Controls Bar (Tick-Tock & White Noise Presets) */}
          <div className="px-5 py-3.5 bg-[#f5ecd8] border-t border-[#eadfcb] space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#28071a] font-black flex items-center space-x-1.5">
                <Volume2 className="w-4 h-4 text-[#f02c85]" />
                <span>Âm thanh đồng hồ:</span>
              </span>

              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="text-[11px] font-bold text-[#f02c85] hover:underline flex items-center space-x-1"
              >
                <Sliders className="w-3 h-3" />
                <span>{Math.round(clockVolume * 100)}% âm lượng</span>
              </button>
            </div>

            {/* Volume slider toggle */}
            {showVolumeSlider && (
              <div className="bg-white p-2.5 rounded-xl border border-[#eadfcb] flex items-center space-x-3 animate-fade-in">
                <span className="text-[10px] font-bold text-[#7a5a6b]">Nhỏ</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={clockVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setClockVolume(val);
                    setAmbientSoundVolume(val);
                    if (isTickSoundEnabled && ambientSound === 'tick') {
                      playClockTick(true, val);
                    }
                  }}
                  className="w-full accent-[#f02c85] cursor-pointer"
                />
                <span className="text-[10px] font-bold text-[#7a5a6b]">Lớn</span>
              </div>
            )}

            {/* Sound Preset Buttons */}
            <div className="grid grid-cols-5 gap-1 pt-0.5">
              {[
                { id: 'tick', label: '⏱️ Tích tắc', title: 'Tiếng đồng hồ quả lắc đếm từng giây' },
                { id: 'rain', label: '🌧️ Mưa', title: 'Tiếng mưa rơi trắng dịu êm' },
                { id: 'waves', label: '🌊 Sóng', title: 'Tiếng sóng biển thư thái' },
                { id: 'cafe', label: '☕ Cafe', title: 'Tiếng quán cafe Lofi' },
                { id: 'none', label: '🔇 Tắt', title: 'Tắt âm thanh hoàn toàn' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSoundMode(s.id)}
                  title={s.title}
                  className={`py-1.5 px-1 rounded-xl font-black text-[10px] sm:text-[11px] text-center transition-all ${
                    ambientSound === s.id && isTickSoundEnabled
                      ? 'bg-[#f02c85] text-white shadow-sm'
                      : s.id === 'none' && !isTickSoundEnabled
                      ? 'bg-[#28071a] text-white shadow-sm'
                      : 'bg-white text-[#28071a] border border-[#eadfcb] hover:bg-[#faebd0]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Pomodoro Milestones */}
          <div className="px-5 py-2.5 bg-[#260619] border-t border-[#f02c85]/20 flex items-center justify-between text-xs text-white">
            <span className="flex items-center space-x-1.5 font-bold text-rose-200">
              <Award className="w-3.5 h-3.5 text-[#f02c85]" />
              <span>Hôm nay hoàn thành:</span>
            </span>
            <span className="font-black text-amber-400 font-mono">
              🍅 {completedSessions} phiên (+{completedSessions * 50} XP)
            </span>
          </div>

        </div>
      )}
    </>
  );
}
