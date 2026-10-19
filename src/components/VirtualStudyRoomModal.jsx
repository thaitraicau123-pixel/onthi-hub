import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCw,
  Send,
  Flame,
  Trophy,
  X,
  CheckCircle2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Layers,
  Eye,
  Check,
  Radio
} from 'lucide-react';
import { useModalDismiss } from '../hooks/useModalDismiss';
import { playSound } from '../utils/storage';
import { recordStudyAction } from '../utils/gamification';
import { getHanoiTimeString, recordStudyTimeLog } from '../utils/hanoiTime';
import { COURSES_DATA } from '../data/coursesData';
import confetti from 'canvas-confetti';

const STUDYROOM_STORAGE_KEY = 'onthi_v3_studyroom_state';
const STUDYROOM_CHEERS_KEY = 'onthi_v3_studyroom_cheers';
const STUDYROOM_RELAY_TOPIC = 'onthi_hub_studyroom_v3';

const PEER_STUDENTS = [
  {
    id: 'peer_1',
    name: 'Nguyễn Văn Nam',
    city: 'Hà Nội 🏛️',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    subject: 'Luật Cán Bộ, Công Chức 2026',
    tag: '🏛️ Công Chức',
    minutesFocused: 45,
    streak: 14
  },
  {
    id: 'peer_2',
    name: 'Trần Thu Hà',
    city: 'TP. Hồ Chí Minh 🌆',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    subject: 'IELTS Academic Collocations 8.0',
    tag: '🌍 Ngoại Ngữ',
    minutesFocused: 32,
    streak: 21
  },
  {
    id: 'peer_3',
    name: 'Lê Minh Đức',
    city: 'Đà Nẵng 🏖️',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    subject: 'System Design & Distributed Cache',
    tag: '💻 IT & Tech',
    minutesFocused: 60,
    streak: 9
  },
  {
    id: 'peer_4',
    name: 'Phạm Thảo Vy',
    city: 'Cần Thơ 🌾',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    subject: 'Kanji JLPT N2: 650 Chữ Hán',
    tag: '🇯🇵 Tiếng Nhật',
    minutesFocused: 38,
    streak: 26
  },
  {
    id: 'peer_5',
    name: 'Hoàng Tuấn Anh',
    city: 'Hải Phòng ⚓',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    subject: 'Thi thử trắc nghiệm Vòng 1 (54/60 câu)',
    tag: '🏛️ Công Chức',
    minutesFocused: 52,
    streak: 16
  },
  {
    id: 'peer_6',
    name: 'Đặng Phương Linh',
    city: 'Huế 🏮',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    subject: 'Thuật Ngữ Y Khoa & Luật KCB 2023',
    tag: '🏥 Y Dược',
    minutesFocused: 35,
    streak: 11
  }
];

const PRESET_CHEERS = [
  { text: '🔥 Cố lên đỗ công chức nhé cả phòng!', icon: '🔥', xp: 15 },
  { text: '🎯 Tập trung 100%, tắt điện thoại cày đề!', icon: '🎯', xp: 15 },
  { text: '🚀 Cháy hết mình hôm nay, quyết đỗ!', icon: '🚀', xp: 15 },
  { text: '🏆 Chúc cả phòng vượt vũ môn thành công!', icon: '🏆', xp: 15 },
  { text: '☕ Mời cả phòng ly cafe tỉnh táo cày đêm!', icon: '☕', xp: 20 }
];

const INITIAL_CHEERS = [
  { id: 'c1', author: 'Trần Thu Hà (TP.HCM)', text: '🔥 Chúc cả phòng hôm nay hoàn thành 100% mục tiêu thẻ Anki nhé!', time: 'Vừa xong', icon: '🔥' },
  { id: 'c2', author: 'Nguyễn Văn Nam (Hà Nội)', text: '🎯 Đang cày các mốc thời hạn Luật Cán bộ công chức, dễ nhớ hẳn!', time: '2 phút trước', icon: '🎯' },
  { id: 'c3', author: 'Lê Minh Đức (Đà Nẵng)', text: '☕ Bật tiếng mưa rơi + Sóng Alpha học tập trung cực kỳ!', time: '5 phút trước', icon: '☕' }
];

export default function VirtualStudyRoomModal({
  user,
  allCourses = [],
  onClose,
  onOpenFlashcards,
  onOpenCheatSheet
}) {
  const coursesList = allCourses.length > 0 ? allCourses : COURSES_DATA;

  // Saved room state
  const [savedState] = useState(() => {
    try {
      const raw = localStorage.getItem(STUDYROOM_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  const [onlineCount, setOnlineCount] = useState(() => Math.floor(42 + Math.random() * 14));
  const [hanoiClock, setHanoiClock] = useState(() => getHanoiTimeString(new Date(), true));
  const [userStatus, setUserStatus] = useState(savedState.userStatus || 'Quyết tâm ôn đỗ kỳ thi 2026!');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [userMinutes, setUserMinutes] = useState(savedState.userMinutes || 20);
  const [cardsReviewedInRoom, setCardsReviewedInRoom] = useState(savedState.cardsReviewedInRoom || 0);

  // Room View Mode: 'split' (Study Deck + Peers) | 'desks' (Peers Grid)
  const [activeRoomTab, setActiveRoomTab] = useState('study_here'); // 'study_here' | 'desks'

  // In-Room Mini Flashcard Deck State
  const [selectedCourseId, setSelectedCourseId] = useState(coursesList[0]?.id || 'cc-kien-thuc-chung');
  const activeCourse = coursesList.find(c => c.id === selectedCourseId) || coursesList[0];
  const deckCards = activeCourse?.previewCards || activeCourse?.cards || [];
  const [cardIndex, setCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Pomodoro Timer State
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(true);
  const [pomoPhase, setPomoPhase] = useState('focus'); // 'focus' | 'break'

  // Floating Reactions & Live Cheer Feed
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [customCheerInput, setCustomCheerInput] = useState('');
  const [recentCheers, setRecentCheers] = useState(() => {
    try {
      const raw = localStorage.getItem(STUDYROOM_CHEERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_CHEERS;
  });

  // Ambient Audio Synthesizer (Web Audio API: 'none' | 'rain' | 'cafe' | 'alpha')
  const [ambientTrack, setAmbientTrack] = useState('none');
  const [volume, setVolume] = useState(0.45);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Modal Dismiss Hook
  const { handleBackdropClick } = useModalDismiss(onClose, true);

  // Persist user room state
  useEffect(() => {
    try {
      localStorage.setItem(
        STUDYROOM_STORAGE_KEY,
        JSON.stringify({ userStatus, userMinutes, cardsReviewedInRoom })
      );
    } catch (e) {}
  }, [userStatus, userMinutes, cardsReviewedInRoom]);

  // Live Hanoi clock, online counter & real-time cloud relay cheer sync
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setHanoiClock(getHanoiTimeString(new Date(), true));
    }, 1000);

    const countTimer = setInterval(() => {
      setOnlineCount(prev => Math.max(32, prev + (Math.random() > 0.48 ? 1 : -1)));
    }, 12000);

    const focusTimer = setInterval(() => {
      setUserMinutes(m => m + 1);
    }, 60000);

    // Fetch real-time cheers from Cloud Relay
    const fetchRelayCheers = async () => {
      try {
        const res = await fetch(`https://ntfy.sh/${STUDYROOM_RELAY_TOPIC}/json?poll=1&since=30m`);
        if (!res.ok) return;
        const text = await res.text();
        const lines = text.trim().split('\n').filter(Boolean);
        const incoming = [];
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.event === 'message' && parsed.message) {
              const payload = JSON.parse(parsed.message);
              if (payload && payload.text && payload.author) {
                incoming.push(payload);
              }
            }
          } catch (e) {}
        }
        if (incoming.length > 0) {
          setRecentCheers(prev => {
            const map = new Map();
            [...incoming.reverse(), ...prev].forEach(item => {
              const key = item.id || `${item.author}_${item.text}`;
              if (!map.has(key)) map.set(key, item);
            });
            const merged = Array.from(map.values()).slice(0, 12);
            try {
              localStorage.setItem(STUDYROOM_CHEERS_KEY, JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      } catch (e) {}
    };

    fetchRelayCheers();
    const relayTimer = setInterval(fetchRelayCheers, 10000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(countTimer);
      clearInterval(focusTimer);
      clearInterval(relayTimer);
    };
  }, []);

  // Pomodoro countdown
  useEffect(() => {
    if (!isPomoRunning) return;
    const timer = setInterval(() => {
      setPomoSeconds(sec => {
        if (sec <= 1) {
          playSound('success');
          if (pomoPhase === 'focus') {
            setPomoPhase('break');
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
            recordStudyAction(50);
            recordStudyTimeLog({
              type: 'pomodoro',
              title: 'Hoàn thành 25 phút cày sâu tại Phòng Tự Học Ảo v3',
              durationMinutes: 25,
              xpGained: 50
            });
            return 5 * 60;
          } else {
            setPomoPhase('focus');
            return 25 * 60;
          }
        }
        return sec - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPomoRunning, pomoPhase]);

  // Adjust live volume without restarting AudioContext
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      try {
        gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
      } catch (e) {}
    }
  }, [volume]);

  // Web Audio API Synthesizer for Rain, Cafe, and Alpha Binaural Waves
  useEffect(() => {
    if (ambientTrack === 'none') {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
        gainNodeRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (ambientTrack === 'rain' || ambientTrack === 'cafe') {
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
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(ambientTrack === 'rain' ? 850 : 420, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
      } else if (ambientTrack === 'alpha') {
        // Soft 200Hz + 210Hz (10Hz Alpha Binaural Focus Wave) + gentle warm pad
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.18, ctx.currentTime);

        oscLeft.type = 'sine';
        oscRight.type = 'sine';
        oscLeft.frequency.setValueAtTime(200, ctx.currentTime);
        oscRight.frequency.setValueAtTime(210, ctx.currentTime);

        oscLeft.connect(subGain);
        oscRight.connect(subGain);
        subGain.connect(masterGain);

        oscLeft.start();
        oscRight.start();
      }
    } catch (e) {
      console.warn('Web Audio ambient error:', e);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
        gainNodeRef.current = null;
      }
    };
  }, [ambientTrack]);

  const spawnFloatingEmoji = (icon) => {
    const id = Date.now() + Math.random();
    const newEmoji = {
      id,
      icon: icon || '🔥',
      left: 15 + Math.random() * 70
    };
    setFloatingEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 2400);
  };

  const broadcastCheer = (cheerObj) => {
    try {
      fetch(`https://ntfy.sh/${STUDYROOM_RELAY_TOPIC}`, {
        method: 'POST',
        body: JSON.stringify(cheerObj)
      }).catch(() => {});
    } catch (e) {}
  };

  const handleSendCheer = (cheer) => {
    playSound('flip');
    recordStudyAction(cheer.xp || 15);
    spawnFloatingEmoji(cheer.icon);

    const newEntry = {
      id: 'cheer_' + Date.now(),
      author: user?.displayName || 'Sĩ Tử OnThiHub',
      text: cheer.text,
      time: getHanoiTimeString(new Date(), false),
      icon: cheer.icon || '🔥'
    };

    setRecentCheers(prev => {
      const updated = [newEntry, ...prev.slice(0, 10)];
      try {
        localStorage.setItem(STUDYROOM_CHEERS_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    broadcastCheer(newEntry);
  };

  const handleCustomCheerSubmit = (e) => {
    e.preventDefault();
    const trimmed = customCheerInput.trim();
    if (!trimmed) return;
    handleSendCheer({ text: trimmed, icon: '🚀', xp: 20 });
    setCustomCheerInput('');
  };

  const handleNextInRoomCard = (remembered = true) => {
    playSound(remembered ? 'success' : 'flip');
    if (remembered) {
      setCardsReviewedInRoom(c => c + 1);
      recordStudyAction(10);
      spawnFloatingEmoji('✨');
    }
    setIsCardFlipped(false);
    setCardIndex(prev => (prev + 1) % Math.max(1, deckCards.length));
  };

  const formatPomoTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentCard = deckCards[cardIndex] || {
    front: 'Chưa có thẻ trong bộ này',
    back: 'Hãy chọn bộ đề khác để ôn tập.',
    tag: 'ÔnThiHub v3.0'
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in"
    >
      {/* Inline Keyframes for Floating Emojis */}
      <style>{`
        @keyframes onthiFloatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 1; }
          70% { opacity: 0.95; }
          100% { transform: translateY(-340px) scale(1.35); opacity: 0; }
        }
        .animate-onthi-float {
          animation: onthiFloatUp 2.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[94vh] rounded-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden relative"
      >
        {/* FLOATING EMOJI CANNON LAYER */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
          {floatingEmojis.map(emoji => (
            <span
              key={emoji.id}
              style={{ left: `${emoji.left}%` }}
              className="absolute bottom-14 text-3xl sm:text-4xl animate-onthi-float select-none drop-shadow-lg"
            >
              {emoji.icon}
            </span>
          ))}
        </div>

        {/* TOP HEADER */}
        <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
                👥
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Phòng Tự Học Chung Ảo v3.0
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black flex items-center space-x-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>{onlineCount} SĨ TỬ ONLINE</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5 flex items-center flex-wrap gap-x-2">
                <span>🇻🇳 Giờ Hà Nội: <strong>{hanoiClock}</strong></span>
                <span>•</span>
                <span>Đã thuộc <strong>{cardsReviewedInRoom} thẻ</strong> trong phiên này</span>
              </p>
            </div>
          </div>

          {/* Ambient Audio Controls + Close */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/15 text-xs gap-1">
              <button
                type="button"
                onClick={() => setAmbientTrack(ambientTrack === 'rain' ? 'none' : 'rain')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  ambientTrack === 'rain' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                🌧️ Mưa Rơi
              </button>
              <button
                type="button"
                onClick={() => setAmbientTrack(ambientTrack === 'cafe' ? 'none' : 'cafe')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  ambientTrack === 'cafe' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                ☕ Quán Cafe
              </button>
              <button
                type="button"
                onClick={() => setAmbientTrack(ambientTrack === 'alpha' ? 'none' : 'alpha')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  ambientTrack === 'alpha' ? 'bg-purple-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                🧠 Sóng Alpha
              </button>
              {ambientTrack !== 'none' && (
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-14 accent-sky-400 cursor-pointer mx-1"
                  title="Âm lượng nhạc nền"
                />
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
              title="Đóng phòng học (Esc)"
            >
              <span>Đóng</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* POMODORO & MODE SWITCHER BAR */}
        <div className="px-4 sm:px-6 py-2.5 bg-indigo-50/90 dark:bg-slate-800/90 border-b border-indigo-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0 text-xs">
          {/* Room Mode Tabs */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveRoomTab('study_here');
              }}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeRoomTab === 'study_here'
                  ? 'bg-[#2383e2] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>⚡ Bàn Cày Thẻ Trực Tiếp</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveRoomTab('desks');
              }}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeRoomTab === 'desks'
                  ? 'bg-[#2383e2] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>👥 Danh Sách Bàn Học ({PEER_STUDENTS.length + 1})</span>
            </button>
          </div>

          {/* Pomodoro Timer Controls */}
          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <span className="font-bold text-slate-700 dark:text-slate-200 text-[11px]">
              {pomoPhase === 'focus' ? '🎯 Chu kỳ Pomodoro:' : '☕ Giải lao:'}
            </span>
            <div className="px-3 py-1 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-slate-700 font-mono text-sm font-black text-indigo-700 dark:text-indigo-400">
              {formatPomoTime(pomoSeconds)}
            </div>
            <button
              type="button"
              onClick={() => setIsPomoRunning(!isPomoRunning)}
              className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-2xs cursor-pointer"
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
              className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Đặt lại 25 phút"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* MAIN SCROLLABLE BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/60 dark:bg-slate-900/60 flex-1">
          
          {activeRoomTab === 'study_here' ? (
            /* ============================================================
               MODE 1: BÀN CÀY THẺ TRỰC TIẾP TRONG PHÒNG HỌC (KHÔNG BỊ TẮT NHẠC)
               ============================================================ */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
              
              {/* Left 2 Columns: Live Interactive Flashcard Deck */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Đang ôn bộ đề:</span>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => {
                        setSelectedCourseId(e.target.value);
                        setCardIndex(0);
                        setIsCardFlipped(false);
                        playSound('flip');
                      }}
                      className="text-xs font-bold bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#2383e2] cursor-pointer"
                    >
                      {coursesList.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-[#2383e2] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-sky-800">
                      Thẻ {cardIndex + 1} / {deckCards.length}
                    </span>
                    {onOpenCheatSheet && (
                      <button
                        type="button"
                        onClick={() => onOpenCheatSheet(activeCourse)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
                      >
                        📄 Xem Tóm Tắt 1 Trang
                      </button>
                    )}
                  </div>
                </div>

                {/* Interactive Flashcard Box */}
                <div
                  onClick={() => {
                    playSound('flip');
                    setIsCardFlipped(!isCardFlipped);
                  }}
                  className={`min-h-[210px] sm:min-h-[240px] p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                    isCardFlipped
                      ? 'bg-gradient-to-br from-emerald-50/90 to-teal-50/90 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-300 dark:border-emerald-700'
                      : 'bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/30 border-indigo-200 dark:border-slate-700 hover:border-[#2383e2]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {currentCard.tag || activeCourse?.categoryLabel || 'Trọng tâm'}
                    </span>
                    <span className={isCardFlipped ? 'text-emerald-700 dark:text-emerald-400 font-black' : 'text-indigo-600 dark:text-sky-400 font-black'}>
                      {isCardFlipped ? '💡 ĐÁP ÁN CHUẨN' : '❓ CÂU HỎI (Bấm để lật)'}
                    </span>
                  </div>

                  <div className="my-auto py-4 text-center">
                    <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                      {isCardFlipped ? currentCard.back : currentCard.front}
                    </p>
                  </div>

                  <div className="text-center text-[11px] text-slate-400">
                    {isCardFlipped ? 'Bấm vào thẻ để xem lại câu hỏi' : '👆 Bấm vào bất kỳ đâu trên thẻ để lật xem đáp án'}
                  </div>
                </div>

                {/* Card Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        playSound('flip');
                        setIsCardFlipped(false);
                        setCardIndex(prev => (prev - 1 + deckCards.length) % Math.max(1, deckCards.length));
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Thẻ trước</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playSound('flip');
                        setIsCardFlipped(!isCardFlipped);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isCardFlipped ? 'Lật Câu Hỏi' : 'Lật Đáp Án'}</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleNextInRoomCard(false)}
                      className="px-3.5 py-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 text-amber-900 dark:text-amber-200 text-xs font-bold cursor-pointer"
                    >
                      🔁 Chưa thuộc
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNextInRoomCard(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã Nhớ (+10 XP)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Peers Summary & Cheer Feed */}
              <div className="space-y-4">
                {/* User Mini Status Card */}
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-[#2383e2] dark:text-sky-400">
                      ⭐ Bàn Học Của Bạn
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600">
                      ⏱️ {userMinutes} phút
                    </span>
                  </div>

                  {isEditingStatus ? (
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="text"
                        value={userStatus}
                        onChange={(e) => setUserStatus(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#2383e2]"
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingStatus(false)}
                        className="px-2.5 py-1.5 bg-[#2383e2] text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Lưu
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => setIsEditingStatus(true)}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 cursor-pointer hover:border-[#2383e2] flex items-center justify-between"
                    >
                      <span className="truncate">🎯 "{userStatus}"</span>
                      <span className="text-[10px] text-[#2383e2] font-bold shrink-0 ml-2">Sửa</span>
                    </div>
                  )}
                </div>

                {/* Live Cheer Chat Box */}
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
                  <span className="text-xs font-black text-slate-900 dark:text-white block uppercase tracking-wider">
                    🎉 Tiếp Lửa & Cổ Vũ Phòng Học
                  </span>

                  {/* Custom Cheer Input */}
                  <form onSubmit={handleCustomCheerSubmit} className="flex items-center space-x-1.5">
                    <input
                      type="text"
                      value={customCheerInput}
                      onChange={(e) => setCustomCheerInput(e.target.value)}
                      placeholder="Nhắn lời cổ vũ cho cả phòng..."
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-[#2383e2]"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-[#2383e2] hover:bg-[#1a73e8] text-white rounded-xl cursor-pointer shrink-0"
                      title="Gửi cổ vũ"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {/* Preset Quick Cheers */}
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_CHEERS.slice(0, 3).map((cheer, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendCheer(cheer)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-[11px] font-bold transition-all active:scale-95 cursor-pointer text-left"
                      >
                        {cheer.text}
                      </button>
                    ))}
                  </div>

                  {/* Cheer Stream */}
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 pt-1 border-t border-slate-100 dark:border-slate-700">
                    {recentCheers.map((c, i) => (
                      <div key={c.id || i} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs">
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
          ) : (
            /* ============================================================
               MODE 2: DANH SÁCH BÀN HỌC SĨ TỬ TOÀN QUỐC
               ============================================================ */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {PEER_STUDENTS.map((peer) => (
                  <div
                    key={peer.id}
                    className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-start justify-between gap-3"
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
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                          {peer.name} <span className="text-[10px] font-normal text-slate-500">({peer.city})</span>
                        </span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate mt-0.5">
                          📖 {peer.subject}
                        </p>
                        <div className="flex items-center space-x-2 mt-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                            {peer.tag}
                          </span>
                          <span className="text-[10px] text-amber-600 font-bold">
                            🔥 {peer.streak}d
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">
                        {peer.minutesFocused}m
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSendCheer({ text: `👏 Cổ vũ bạn ${peer.name} cày ${peer.subject}!`, icon: '🔥', xp: 10 })}
                        className="block mt-2 text-[10px] font-bold text-[#2383e2] hover:underline cursor-pointer"
                      >
                        + Cổ vũ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-5 py-3 bg-[#fbfbfa] dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs shrink-0">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            💡 <strong>ÔnThiHub v3.0:</strong> Bạn có thể vừa nghe tiếng mưa rơi / sóng Alpha vừa lật thẻ ngay trong phòng học này!
          </span>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {onOpenFlashcards && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFlashcards(activeCourse);
                }}
                className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 font-bold cursor-pointer"
              >
                Mở Trình Lật 3D Toàn Màn Hình
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-1.5 rounded-xl bg-[#2383e2] hover:bg-[#1a73e8] text-white font-bold transition-colors cursor-pointer"
            >
              Đóng Cửa Sổ (Esc)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
