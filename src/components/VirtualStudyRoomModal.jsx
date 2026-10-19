import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Clock,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCw,
  Send,
  Coffee,
  Flame,
  Target,
  Trophy,
  X,
  CheckCircle2,
  Smile,
  Shield,
  MapPin,
  BookOpen
} from 'lucide-react';
import { useModalDismiss } from '../hooks/useModalDismiss';
import { playSound } from '../utils/storage';
import { recordStudyAction } from '../utils/gamification';
import { getHanoiTimeString, getHanoiDateString } from '../utils/hanoiTime';
import confetti from 'canvas-confetti';

const PEER_STUDENTS = [
  {
    id: 'peer_1',
    name: 'Nguyễn Văn Nam',
    city: 'Hà Nội 🏛️',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    subject: 'Luật Cán Bộ, Công Chức 2026',
    tag: '🏛️ Công Chức',
    minutesFocused: 42,
    streak: 12
  },
  {
    id: 'peer_2',
    name: 'Trần Thu Hà',
    city: 'TP. Hồ Chí Minh 🌆',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    subject: 'IELTS Academic Collocations 8.0',
    tag: '🌍 Ngoại Ngữ',
    minutesFocused: 28,
    streak: 19
  },
  {
    id: 'peer_3',
    name: 'Lê Minh Đức',
    city: 'Đà Nẵng 🏖️',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    subject: 'System Design & Distributed Cache',
    tag: '💻 IT & Tech',
    minutesFocused: 55,
    streak: 7
  },
  {
    id: 'peer_4',
    name: 'Phạm Thảo Vy',
    city: 'Cần Thơ 🌾',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    subject: 'Kanji JLPT N2: 650 Chữ Hán',
    tag: '🇯🇵 Tiếng Nhật',
    minutesFocused: 35,
    streak: 24
  },
  {
    id: 'peer_5',
    name: 'Hoàng Tuấn Anh',
    city: 'Hải Phòng ⚓',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    subject: 'Thi thử trắc nghiệm Vòng 1 (54/60 câu)',
    tag: '🏛️ Công Chức',
    minutesFocused: 48,
    streak: 15
  },
  {
    id: 'peer_6',
    name: 'Đặng Phương Linh',
    city: 'Huế 🏮',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    subject: 'Thuật Ngữ Y Khoa & Luật KCB 2023',
    tag: '🏥 Y Dược',
    minutesFocused: 30,
    streak: 9
  }
];

const PRESET_CHEERS = [
  { text: '🔥 Cố lên đỗ công chức nhé!', icon: '🔥', xp: 15 },
  { text: '🎯 Tập trung 100%, không lướt top top!', icon: '🎯', xp: 15 },
  { text: '🚀 Cháy hết mình hôm nay!', icon: '🚀', xp: 15 },
  { text: '🏆 Đỗ nguyện vọng 1 bạn ơi!', icon: '🏆', xp: 15 },
  { text: '☕ Mời cả phòng ly cafe tỉnh táo!', icon: '☕', xp: 20 }
];

export default function VirtualStudyRoomModal({
  user,
  onClose,
  onOpenFlashcards
}) {
  const [onlineCount, setOnlineCount] = useState(() => Math.floor(38 + Math.random() * 12));
  const [hanoiClock, setHanoiClock] = useState(() => getHanoiTimeString(new Date(), true));
  const [userStatus, setUserStatus] = useState('Đang cày thẻ Anki SM-2 cùng phòng');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [userMinutes, setUserMinutes] = useState(15);
  
  // Pomodoro Timer State
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(true);
  const [pomoPhase, setPomoPhase] = useState('focus'); // 'focus' | 'break'

  // Floating Reactions State
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [recentCheers, setRecentCheers] = useState([
    { author: 'Trần Thu Hà', text: 'Chúc cả phòng thi đỗ điểm cao!', time: '1 phút trước' },
    { author: 'Nguyễn Văn Nam', text: 'Cày nốt 30 thẻ Luật rồi nghỉ ăn tối thôi!', time: '3 phút trước' }
  ]);

  // Ambient Audio State (Synthesized via Web Audio API)
  const [ambientTrack, setAmbientTrack] = useState('none'); // 'none' | 'rain' | 'cafe'
  const audioContextRef = useRef(null);
  const noiseNodeRef = useRef(null);

  // Modal Dismiss Hook
  const { handleBackdropClick } = useModalDismiss(onClose, true);

  // Hanoi live clock & small online jitter
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setHanoiClock(getHanoiTimeString(new Date(), true));
    }, 1000);

    const countTimer = setInterval(() => {
      setOnlineCount(prev => Math.max(30, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 15000);

    const focusTimer = setInterval(() => {
      setUserMinutes(m => m + 1);
    }, 60000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(countTimer);
      clearInterval(focusTimer);
    };
  }, []);

  // Pomodoro countdown
  useEffect(() => {
    let timer = null;
    if (isPomoRunning) {
      timer = setInterval(() => {
        setPomoSeconds(sec => {
          if (sec <= 1) {
            playSound('success');
            if (pomoPhase === 'focus') {
              setPomoPhase('break');
              confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
              recordStudyAction(50);
              return 5 * 60;
            } else {
              setPomoPhase('focus');
              return 25 * 60;
            }
          }
          return sec - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPomoRunning, pomoPhase]);

  // Synthesized Ambient Sound Player (No heavy external mp3s needed)
  useEffect(() => {
    if (ambientTrack === 'none') {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Pink noise / Rain simulator buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for rain warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(ambientTrack === 'rain' ? 800 : 450, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();
      noiseNodeRef.current = whiteNoise;
    } catch (e) {
      console.warn('Web Audio ambient noise warning:', e);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [ambientTrack]);

  const handleSendCheer = (cheer) => {
    playSound('flip');
    recordStudyAction(cheer.xp);

    // Add floating emoji
    const id = Date.now() + Math.random();
    const newEmoji = {
      id,
      icon: cheer.icon,
      left: 15 + Math.random() * 70
    };
    setFloatingEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 2500);

    // Add to feed
    setRecentCheers(prev => [
      { author: user?.displayName || 'Bạn', text: cheer.text, time: 'Vừa xong' },
      ...prev.slice(0, 4)
    ]);
  };

  const formatPomoTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-up relative"
      >
        {/* FLOATING EMOJI CANNON LAYER */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
          {floatingEmojis.map(emoji => (
            <span
              key={emoji.id}
              style={{ left: `${emoji.left}%` }}
              className="absolute bottom-16 text-3xl sm:text-4xl animate-float-up select-none filter drop-shadow-md"
            >
              {emoji.icon}
            </span>
          ))}
        </div>

        {/* TOP STATUS HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600/80 border border-indigo-400/40 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
                📚
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center space-x-2">
                  <span>Phòng Tự Học Chung Ảo (Study With Me)</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>{onlineCount} SĨ TỬ ĐANG CÀY ĐỀ</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5 flex items-center space-x-2">
                <span>🇻🇳 Giờ Hà Nội: <strong>{hanoiClock}</strong></span>
                <span>•</span>
                <span>Học chung nhịp Pomodoro • Cổ vũ tăng sĩ khí</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Ambient Sound Switcher */}
            <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setAmbientTrack(ambientTrack === 'rain' ? 'none' : 'rain')}
                className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                  ambientTrack === 'rain' ? 'bg-cyan-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="Tiếng mưa rơi thư giãn tập trung"
              >
                <span>🌧️ Mưa Rơi</span>
              </button>
              <button
                type="button"
                onClick={() => setAmbientTrack(ambientTrack === 'cafe' ? 'none' : 'cafe')}
                className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                  ambientTrack === 'cafe' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="Tiếng quán cafe học bài ấm cúng"
              >
                <span>☕ Quán Cafe</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Đóng phòng học (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* POMODORO SPRINT BAR */}
        <div className="px-5 py-3.5 bg-indigo-50 dark:bg-slate-800/80 border-b border-indigo-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center space-x-3">
            <span className="text-xl">⏱️</span>
            <div>
              <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                {pomoPhase === 'focus' ? '🎯 CHU KỲ CÀY SÂU (DEEP FOCUS)' : '☕ NGHỈ NGƠI TỈNH TÁO (SHORT BREAK)'}
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Toàn phòng cùng tập trung trong 25 phút. Không chuyển tab, không lướt mạng xã hội!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-3.5 py-1 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-slate-700 shadow-2xs font-mono text-base font-black text-indigo-700 dark:text-indigo-400">
              {formatPomoTime(pomoSeconds)}
            </div>

            <button
              type="button"
              onClick={() => setIsPomoRunning(!isPomoRunning)}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              title={isPomoRunning ? 'Tạm dừng' : 'Tiếp tục'}
            >
              {isPomoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setPomoSeconds(25 * 60);
                setPomoPhase('focus');
                playSound('flip');
              }}
              className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Đặt lại 25 phút"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: STUDY DESKS & LIVE FEED */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
          
          {/* USER'S STUDY DESK (BÀN CỦA BẠN) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-white to-sky-50/80 dark:from-slate-800 dark:to-slate-800/90 border-2 border-[#2383e2]/40 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <img
                  src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                  alt="Your Avatar"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#2383e2] shadow-xs"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      Bàn học của bạn ({user?.displayName || 'Sĩ Tử OnThiHub'})
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                      BÀN CỦA BẠN ⭐
                    </span>
                  </div>

                  {isEditingStatus ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="text"
                        value={userStatus}
                        onChange={(e) => setUserStatus(e.target.value)}
                        placeholder="Nhập mục tiêu học hôm nay..."
                        className="px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#2383e2]"
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingStatus(false)}
                        className="px-2 py-1 bg-[#2383e2] text-white rounded-lg text-xs font-bold"
                      >
                        Lưu
                      </button>
                    </div>
                  ) : (
                    <p
                      onClick={() => setIsEditingStatus(true)}
                      className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer hover:underline flex items-center space-x-1 mt-0.5"
                      title="Bấm để chỉnh sửa trạng thái"
                    >
                      <span>📝 Trạng thái: <strong>"{userStatus}"</strong></span>
                      <span className="text-[10px] text-sky-600 font-bold ml-1">(đổi)</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs shrink-0">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-center min-w-[90px]">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">Đã tập trung</span>
                  <span className="text-sm font-black text-[#2383e2]">{userMinutes} phút</span>
                </div>

                {onOpenFlashcards && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenFlashcards();
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Lật Thẻ Ngay</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* PEER STUDY DESKS GRID (CÁC BÀN HỌC BẠN BÈ) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Bàn Học Sĩ Tử Đang Online ({PEER_STUDENTS.length})</span>
              </h4>
              <span className="text-[11px] text-slate-500">Tự động làm mới mỗi chu kỳ học</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PEER_STUDENTS.map((peer) => (
                <div
                  key={peer.id}
                  className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white dark:border-slate-900" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {peer.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          ({peer.city})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate mt-0.5">
                        📖 {peer.subject}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                          {peer.tag}
                        </span>
                        <span className="text-[10px] text-amber-600 font-bold">
                          🔥 Streak {peer.streak} ngày
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-[10px] text-slate-400 font-mono">Đã cày</span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {peer.minutesFocused}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHEER CANNON & ROOM FEED */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cheer Buttons */}
            <div className="md:col-span-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2.5">
              <span className="text-xs font-black text-slate-900 dark:text-white block uppercase tracking-wider">
                🎉 Bắn Lời Cổ Vũ Đồng Đội (+15 XP):
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_CHEERS.map((cheer, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendCheer(cheer)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold transition-all transform active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>{cheer.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Room Cheer Feed */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
              <span className="text-xs font-black text-slate-900 dark:text-white block uppercase tracking-wider">
                💬 Tin Cổ Vũ Vừa Gửi:
              </span>
              <div className="space-y-1.5 text-xs">
                {recentCheers.map((c, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{c.author}</span>
                      <span>{c.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-800 dark:text-slate-200 mt-0.5 font-medium">
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-[#fbfbfa] dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-slate-500">
            💡 Phòng học mở 24/7. Bạn có thể bật tab chạy ngầm để nghe tiếng mưa thư giãn khi làm bài!
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2383e2] hover:bg-[#1a73e8] text-white font-bold transition-colors cursor-pointer"
          >
            Đã Hiểu & Tiếp Tục Học (Esc)
          </button>
        </div>

      </div>
    </div>
  );
}
