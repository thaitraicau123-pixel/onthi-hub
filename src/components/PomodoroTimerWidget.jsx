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
import confetti from 'canvas-confetti';

const MODES = {
  focus: { label: 'Tập Trung', duration: 25 * 60, color: 'from-blue-500 to-indigo-600' },
  shortBreak: { label: 'Nghỉ Ngắn', duration: 5 * 60, color: 'from-emerald-500 to-teal-600' },
  longBreak: { label: 'Nghỉ Dài', duration: 15 * 60, color: 'from-blue-500 to-cyan-600' }
};

export default function PomodoroTimerWidget({ onBonusReward }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('focus');
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.duration);
  const [isActive, setIsActive] = useState(false);
  const [completionToast, setCompletionToast] = useState('');
  
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

      // Reward +50 XP rèn luyện (KHÔNG CỘNG XU THEO YÊU CẦU CỦA ADMIN)
      recordStudyAction(50);
      if (onBonusReward) onBonusReward();

      setCompletionToast('🎉 Chúc mừng bạn đã hoàn thành 25 phút tập trung (+50 XP)! Hãy nghỉ ngơi 5 phút nhé.');
      setTimeout(() => setCompletionToast(''), 7000);

      // Auto switch to short break
      setCurrentMode('shortBreak');
      setSecondsLeft(MODES.shortBreak.duration);
    } else {
      setCompletionToast('☕ Hết giờ nghỉ ngơi rồi! Bắt đầu phiên tập trung mới nào!');
      setTimeout(() => setCompletionToast(''), 7000);

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
      {/* Toast Notification when minimized */}
      {!isOpen && completionToast && (
        <div className="fixed bottom-36 md:bottom-20 right-5 z-40 max-w-xs bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-bounce flex items-center space-x-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{completionToast}</span>
        </div>
      )}

      {/* FLOATING PILL BUTTON (Always accessible in bottom right) */}
      {!isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-5 z-40 animate-fade-in">
          <button
            onClick={() => {
              getAudioContext();
              setIsOpen(true);
            }}
            className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-full shadow-lg font-medium text-xs sm:text-sm transition-all border ${
              isActive
                ? 'bg-[#2383e2] text-white border-[#2383e2] shadow-blue-500/20'
                : 'bg-white hover:bg-[#f7f6f5] text-[#37352f] border-[#e9e9e8]'
            }`}
            title="Đồng hồ Pomodoro tập trung học"
          >
            <Timer className={`w-4 h-4 ${isActive ? 'animate-spin text-white' : 'text-[#2383e2]'}`} style={{ animationDuration: '6s' }} />
            <span className="font-mono tracking-wider font-semibold">{formatTime(secondsLeft)}</span>
            
            {/* Sound Icon on floating button */}
            {isTickSoundEnabled ? (
              <Volume2 className={`w-3.5 h-3.5 ${isActive ? 'text-blue-100' : 'text-[#787774]'}`} />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}

            {completedSessions > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-200">
                🍅 {completedSessions}
              </span>
            )}
          </button>
        </div>
      )}

      {/* EXPANDED POMODORO FOCUS DASHBOARD */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-96 bg-white rounded-xl sm:shadow-2xl border border-[#e9e9e8] overflow-hidden flex flex-col text-[#37352f]">
          
          {/* Header */}
          <div className="bg-[#fbfbfa] text-[#37352f] px-5 py-4 flex items-center justify-between border-b border-[#e9e9e8]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2383e2]/10 text-[#2383e2] flex items-center justify-center font-bold">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold tracking-tight">Đồng Hồ Pomodoro</h4>
                <p className="text-[10px] text-[#787774]">Tập trung học sâu • Tích lũy +50 XP rèn luyện</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Quick Sound Toggle in Header */}
              <button
                onClick={toggleMasterSound}
                className={`p-1.5 rounded-md border transition-colors ${
                  isTickSoundEnabled
                    ? 'bg-[#2383e2] text-white border-[#2383e2]'
                    : 'bg-white text-[#787774] border-[#e9e9e8] hover:text-[#37352f]'
                }`}
                title={isTickSoundEnabled ? 'Tắt âm thanh đồng hồ' : 'Bật âm thanh tích tắc'}
              >
                {isTickSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-black/5 rounded-md transition-colors"
                title="Thu nhỏ thành nút nổi"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Completion Toast in Dashboard */}
          {completionToast && (
            <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                <span>{completionToast}</span>
              </div>
              <button
                onClick={() => setCompletionToast('')}
                className="p-1 text-emerald-200 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="p-2.5 bg-[#f7f6f5] border-b border-[#e9e9e8] flex items-center gap-1.5 text-xs font-medium">
            <button
              onClick={() => switchMode('focus')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                currentMode === 'focus'
                  ? 'bg-[#37352f] text-white font-semibold shadow-xs'
                  : 'bg-white text-[#787774] border border-[#e9e9e8] hover:text-[#37352f]'
              }`}
            >
              🍅 Tập Trung (25p)
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                currentMode === 'shortBreak'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'bg-white text-[#787774] border border-[#e9e9e8] hover:text-[#37352f]'
              }`}
            >
              ☕ Nghỉ (5p)
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                currentMode === 'longBreak'
                  ? 'bg-[#37352f] text-white font-semibold shadow-xs'
                  : 'bg-white text-[#787774] border border-[#e9e9e8] hover:text-[#37352f]'
              }`}
            >
              🌴 Dài (15p)
            </button>
          </div>

          {/* Timer Display Area */}
          <div className="p-6 text-center flex flex-col items-center justify-center bg-white">
            
            {/* Circular Dial */}
            <div className="relative w-44 h-44 rounded-full border-4 border-[#e9e9e8] bg-[#fbfbfa] flex flex-col items-center justify-center my-1">
              <div
                className="absolute inset-0 rounded-full border-4 border-[#2383e2] transition-all duration-1000"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${progressPercent >= 25 ? '100% 0%,' : ''} ${progressPercent >= 50 ? '100% 100%,' : ''} ${progressPercent >= 75 ? '0% 100%,' : ''} 0% 0%)`,
                  opacity: isActive ? 1 : 0.3
                }}
              />
              <span className="text-4xl font-mono font-bold text-[#37352f] tracking-tight">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-[11px] font-semibold text-[#2383e2] mt-1 uppercase tracking-wider">
                {MODES[currentMode].label}
              </span>

              {/* Sound status tag inside clock */}
              <div className="mt-1 flex items-center space-x-1 text-[10px] text-[#787774]">
                {isTickSoundEnabled ? (
                  <span className="text-emerald-700 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{ambientSound === 'tick' ? 'Tích tắc ⏱️' : ambientSound === 'rain' ? 'Mưa 🌧️' : ambientSound === 'waves' ? 'Sóng 🌊' : ambientSound === 'cafe' ? 'Cafe ☕' : ambientSound === 'alpha' ? 'Alpha 🧠' : 'Âm thanh'}</span>
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
                className="p-2.5 rounded-lg bg-white hover:bg-black/5 border border-[#e9e9e8] text-[#787774] transition-colors"
                title="Đặt lại đồng hồ"
              >
                <RotateCcw className="w-4 h-4 text-[#787774]" />
              </button>

              <button
                onClick={toggleTimer}
                className={`px-6 py-2.5 rounded-lg text-white font-semibold text-xs shadow-xs flex items-center space-x-1.5 transition-colors ${
                  isActive
                    ? 'bg-[#37352f] hover:bg-[#201f1d]'
                    : 'bg-[#2383e2] hover:bg-[#1a73e8]'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>TẠM DỪNG</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>BẮT ĐẦU</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Sound Controls Bar (Tick-Tock & White Noise Presets) */}
          <div className="px-5 py-3.5 bg-[#f7f6f5] border-t border-[#e9e9e8] space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#37352f] font-semibold flex items-center space-x-1.5">
                <Volume2 className="w-4 h-4 text-[#2383e2]" />
                <span>Âm thanh đồng hồ:</span>
              </span>

              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="text-[11px] font-medium text-[#2383e2] hover:underline flex items-center space-x-1"
              >
                <Sliders className="w-3 h-3" />
                <span>{Math.round(clockVolume * 100)}% âm lượng</span>
              </button>
            </div>

            {/* Volume slider toggle */}
            {showVolumeSlider && (
              <div className="bg-white p-2.5 rounded-lg border border-[#e9e9e8] flex items-center space-x-3 animate-fade-in">
                <span className="text-[10px] text-[#787774]">Nhỏ</span>
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
                  className="w-full accent-[#2383e2] cursor-pointer"
                />
                <span className="text-[10px] text-[#787774]">Lớn</span>
              </div>
            )}

            {/* Sound Preset Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-0.5">
              {[
                { id: 'tick', label: '⏱️ Tích tắc', title: 'Tiếng đồng hồ quả lắc đếm từng giây' },
                { id: 'rain', label: '🌧️ Mưa rào', title: 'Tiếng mưa rơi trắng dịu êm' },
                { id: 'waves', label: '🌊 Sóng biển', title: 'Tiếng sóng biển thư thái' },
                { id: 'cafe', label: '☕ Quán Cafe', title: 'Tiếng quán cafe Lofi & ly tách' },
                { id: 'alpha', label: '🧠 Sóng Alpha', title: 'Tần số 432Hz & 10Hz tăng cường trí nhớ' },
                { id: 'none', label: '🔇 Tắt âm', title: 'Tắt âm thanh hoàn toàn' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSoundMode(s.id)}
                  title={s.title}
                  className={`py-1.5 px-1 rounded-md font-medium text-[10px] sm:text-[11px] text-center transition-all ${
                    ambientSound === s.id && isTickSoundEnabled
                      ? 'bg-[#2383e2] text-white shadow-xs'
                      : s.id === 'none' && !isTickSoundEnabled
                      ? 'bg-[#37352f] text-white shadow-xs'
                      : 'bg-white text-[#37352f] border border-[#e9e9e8] hover:bg-black/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Pomodoro Milestones */}
          <div className="px-5 py-2.5 bg-[#fbfbfa] border-t border-[#e9e9e8] flex items-center justify-between text-xs text-[#37352f]">
            <span className="flex items-center space-x-1.5 text-[#787774]">
              <Award className="w-3.5 h-3.5 text-[#2383e2]" />
              <span>Hôm nay hoàn thành:</span>
            </span>
            <span className="font-semibold text-amber-700 font-mono">
              🍅 {completedSessions} phiên (+{completedSessions * 50} XP)
            </span>
          </div>

        </div>
      )}
    </>
  );
}
