import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Users,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  Heart,
  Coffee,
  CloudRain,
  Radio,
  CheckCircle2,
  Award,
  Send,
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  FileText
} from 'lucide-react';
import { useModalDismiss } from '../hooks/useModalDismiss';
import { getHanoiTimeString, recordStudyTimeLog } from '../utils/hanoiTime';
import { recordStudyAction, getStreakInfo } from '../utils/gamification';
import { playSound } from '../utils/storage';
import { COURSES_DATA } from '../data/coursesData';
import confetti from 'canvas-confetti';

const STUDY_ROOM_TOPIC = 'onthi_hub_studyroom_v3';
const CHEER_STORAGE_KEY = 'onthi_study_room_cheers_v3';
const CLIENT_ID_KEY = 'onthi_studyroom_client_id_v3';

function getOrCreateRoomClientId() {
  try {
    let id = localStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      id = 'stu_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
      localStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return 'stu_live';
  }
}

const CHEER_EMOJIS = [
  { emoji: '🔥', label: 'Cháy hết mình!', text: '🔥 Cùng cày đêm quyết đỗ kỳ thi này nhé!' },
  { emoji: '💪', label: 'Cố lên sỹ tử!', text: '💪 Kiên trì thêm 1 Pomodoro nữa nào!' },
  { emoji: '☕', label: 'Mời ly Cafe!', text: '☕ Mời cả phòng ly cafe tỉnh táo ôn bài!' },
  { emoji: '🎯', label: 'Quyết đỗ!', text: '🎯 Nhớ kỹ các mốc số liệu, nhìn câu nào khoanh trúng câu đó!' },
  { emoji: '❤️', label: 'Thả tim!', text: '❤️ Thả tim tiếp năng lượng tích cực cho mọi người!' }
];

export default function VirtualStudyRoomModal({
  user,
  onClose,
  allCourses = [],
  onOpenCheatSheet
}) {
  const { handleBackdropClick } = useModalDismiss(onClose, true);
  const clientId = useMemo(() => getOrCreateRoomClientId(), []);

  // Available decks for in-room study
  const studyDecks = useMemo(() => {
    const base = allCourses && allCourses.length > 0 ? allCourses : COURSES_DATA;
    return base.filter(c => c && c.cards && c.cards.length > 0);
  }, [allCourses]);

  const [selectedDeckId, setSelectedDeckId] = useState(() => studyDecks[0]?.id || 'pldc');
  const currentDeck = useMemo(
    () => studyDecks.find(d => d.id === selectedDeckId) || studyDecks[0],
    [studyDecks, selectedDeckId]
  );

  // In-room Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardsReviewedInRoom, setCardsReviewedInRoom] = useState(0);

  // Room View Mode: 'split' (Study Deck + Real Online Peers) | 'desks' (Real Peers Grid)
  const [roomTab, setRoomTab] = useState('split');

  // Pomodoro state inside the Study Room
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('🔥 Đang cày Flashcard Anki');
  const [ambientMode, setAmbientMode] = useState('off'); // 'off' | 'rain' | 'cafe' | 'alpha'
  const [ambientVolume, setAmbientVolume] = useState(0.5);
  const [hanoiTime, setHanoiTime] = useState(() => getHanoiTimeString(new Date(), true));
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [sessionMinutesEarned, setSessionMinutesEarned] = useState(0);
  const [customCheerInput, setCustomCheerInput] = useState('');

  // Real online peers (populated ONLY from real users via Cloud Relay, zero bots)
  const [onlinePeersMap, setOnlinePeersMap] = useState({});

  // Real cheers (filter out any legacy bot cheers c1, c2, c3)
  const [cheers, setCheers] = useState(() => {
    try {
      // Remove legacy v1 bot storage key
      localStorage.removeItem('onthi_study_room_cheers_v1');
      const saved = localStorage.getItem(CHEER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(c => c && !['c1', 'c2', 'c3'].includes(c.id));
        }
      }
    } catch {}
    return [];
  });

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Học viên ÔnThiHub';
  const userAvatar = user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;
  const userStreak = useMemo(() => getStreakInfo()?.streak || 0, []);

  const spawnFloatingEmoji = (emojiChar) => {
    const floatId = Date.now() + Math.random();
    const randomLeft = 18 + Math.floor(Math.random() * 64);
    setFloatingHearts(prev => [...prev.slice(-12), { id: floatId, emoji: emojiChar, left: randomLeft }]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== floatId));
    }, 2400);
  };

  const KVDB_STUDYROOM_URL = 'https://kvdb.io/SBPTa4d8XoFCmTGm4KJGC9/index_studyroom_events';

  // Broadcast real user presence to Study Room Cloud Relay (KVDB Singapore Edge + ntfy fallback)
  const broadcastPresence = () => {
    const payload = {
      type: 'study_room_presence',
      clientId,
      name: displayName,
      avatar: userAvatar,
      subject: currentDeck ? `${currentDeck.icon || '📚'} ${currentDeck.title}` : selectedStatus,
      tag: selectedStatus,
      streak: userStreak,
      minutesFocused: sessionMinutesEarned,
      updatedAt: Date.now()
    };

    (async () => {
      try {
        let events = [];
        try {
          const res = await fetch(KVDB_STUDYROOM_URL, { cache: 'no-store' });
          if (res.ok) events = await res.json();
        } catch {}
        if (!Array.isArray(events)) events = [];
        events = events.filter(
          (ev) => !(ev?.type === 'study_room_presence' && ev?.clientId === clientId) && Date.now() - (ev?.updatedAt || Date.now()) < 30 * 60 * 1000
        );
        events.push(payload);
        if (events.length > 60) events = events.slice(-60);
        await fetch(KVDB_STUDYROOM_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(events)
        });
      } catch {}
    })();

    fetch(`https://ntfy.sh/${STUDY_ROOM_TOPIC}`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  };

  // Live Hanoi clock ticker
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setHanoiTime(getHanoiTimeString(new Date(), true));
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Broadcast presence on join and every 60 seconds
  useEffect(() => {
    broadcastPresence();
    const presenceInterval = setInterval(() => {
      broadcastPresence();
    }, 60000);
    return () => clearInterval(presenceInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeckId, selectedStatus, sessionMinutesEarned]);

  // Real-time Cloud Sync (SSE + recent poll) for real cheers & real online peers
  useEffect(() => {
    let es = null;
    let isMounted = true;

    const processIncomingPayload = (data) => {
      if (!data || !isMounted) return;
      if (data.type === 'study_room_presence' && data.clientId && data.clientId !== clientId) {
        // Only keep peers active within the last 30 minutes
        if (Date.now() - (data.updatedAt || 0) < 30 * 60 * 1000) {
          setOnlinePeersMap(prev => ({
            ...prev,
            [data.clientId]: data
          }));
        }
      } else if (data.type === 'study_room_cheer' && data.cheer) {
        setCheers(prev => {
          if (prev.some(item => item.id === data.cheer.id)) return prev;
          const next = [data.cheer, ...prev].slice(0, 30);
          try {
            localStorage.setItem(CHEER_STORAGE_KEY, JSON.stringify(next));
          } catch {}
          return next;
        });
        if (data.cheer.emoji) {
          spawnFloatingEmoji(data.cheer.emoji);
        }
      }
    };

    const syncFromKvdb = async () => {
      try {
        const res = await fetch(KVDB_STUDYROOM_URL, { cache: 'no-store' });
        if (!res.ok || !isMounted) return;
        const list = await res.json();
        if (Array.isArray(list)) {
          list.forEach((item) => processIncomingPayload(item));
        }
      } catch {}
    };

    syncFromKvdb();
    const kvdbInterval = setInterval(syncFromKvdb, 4000);

    // 1. Poll recent 30m history from ntfy
    fetch(`https://ntfy.sh/${STUDY_ROOM_TOPIC}/json?poll=1&since=30m`)
      .then(res => res.text())
      .then(text => {
        if (!isMounted || !text) return;
        const lines = text.trim().split('\n');
        lines.forEach(line => {
          try {
            const event = JSON.parse(line);
            if (event.event === 'message' && event.message) {
              const data = JSON.parse(event.message);
              processIncomingPayload(data);
            }
          } catch {}
        });
      })
      .catch(() => {});

    // 2. Open real-time SSE stream
    try {
      es = new EventSource(`https://ntfy.sh/${STUDY_ROOM_TOPIC}/sse`);
      es.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (!parsed.message) return;
          const data = JSON.parse(parsed.message);
          processIncomingPayload(data);
        } catch {}
      };
    } catch {}

    return () => {
      isMounted = false;
      clearInterval(kvdbInterval);
      if (es) {
        try { es.close(); } catch {}
      }
    };
  }, [clientId]);

  const realOnlinePeers = useMemo(() => {
    const now = Date.now();
    return Object.values(onlinePeersMap).filter(p => now - (p.updatedAt || 0) < 30 * 60 * 1000);
  }, [onlinePeersMap]);

  // Pomodoro timer countdown
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playSound('success');
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          recordStudyTimeLog({
            type: 'pomodoro',
            title: `Phiên Phòng Tự Học Ảo v3.0 (${selectedStatus})`,
            durationMinutes: 25,
            xpGained: 50
          });
          recordStudyAction(50, 'Hoàn thành 25 phút học tại Phòng Tự Học Ảo v3.0');
          setSessionMinutesEarned((m) => m + 25);
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, selectedStatus]);

  // Web Audio API Ambient Sound Generator (Rain / Cafe / Alpha Wave)
  const stopAmbientAudio = () => {
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
      gainNodeRef.current = null;
    }
  };

  const startAmbientAudio = (mode, vol = ambientVolume) => {
    stopAmbientAudio();
    if (mode === 'off') return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.value = Math.max(0.05, Math.min(1, vol));
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (mode === 'alpha') {
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();
        const gainOsc = ctx.createGain();
        oscLeft.type = 'sine';
        oscRight.type = 'sine';
        oscLeft.frequency.value = 200;
        oscRight.frequency.value = 210; // 10Hz Alpha wave difference
        gainOsc.gain.value = 0.06;
        oscLeft.connect(gainOsc);
        oscRight.connect(gainOsc);
        gainOsc.connect(masterGain);
        oscLeft.start();
        oscRight.start();
      }

      const bufferSize = 2 * ctx.sampleRate;
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
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.035;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = mode === 'rain' ? 950 : mode === 'cafe' ? 420 : 600;

      const noiseGain = ctx.createGain();
      noiseGain.gain.value = mode === 'rain' ? 0.35 : mode === 'cafe' ? 0.22 : 0.12;

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);
      whiteNoise.start(0);
    } catch {
      // Ignore audio errors if blocked by browser autoplay policy
    }
  };

  const handleSelectAmbient = (mode) => {
    const next = ambientMode === mode ? 'off' : mode;
    setAmbientMode(next);
    startAmbientAudio(next, ambientVolume);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setAmbientVolume(val);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = val;
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientAudio();
    };
  }, []);

  const handleSendCheer = (cheerItem) => {
    playSound('click');
    const newCheer = {
      id: 'cheer_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      user: displayName,
      text: cheerItem.text,
      emoji: cheerItem.emoji || '🔥',
      time: getHanoiTimeString(new Date(), false)
    };

    setCheers((prev) => {
      const next = [newCheer, ...prev].slice(0, 30);
      try {
        localStorage.setItem(CHEER_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    spawnFloatingEmoji(newCheer.emoji);

    // Broadcast to real study room peers via KVDB Singapore Edge + ntfy fallback
    const cheerPayload = { type: 'study_room_cheer', cheer: newCheer, updatedAt: Date.now() };
    (async () => {
      try {
        let events = [];
        try {
          const res = await fetch(KVDB_STUDYROOM_URL, { cache: 'no-store' });
          if (res.ok) events = await res.json();
        } catch {}
        if (!Array.isArray(events)) events = [];
        events.push(cheerPayload);
        if (events.length > 60) events = events.slice(-60);
        await fetch(KVDB_STUDYROOM_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(events)
        });
      } catch {}
    })();

    fetch(`https://ntfy.sh/${STUDY_ROOM_TOPIC}`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(cheerPayload)
    }).catch(() => {});
  };

  const handleCustomCheerSubmit = (e) => {
    e.preventDefault();
    const trimmed = customCheerInput.trim();
    if (!trimmed) return;
    handleSendCheer({ emoji: '💬', text: trimmed });
    setCustomCheerInput('');
  };

  // In-room Flashcard navigation & rating
  const totalDeckCards = currentDeck?.cards?.length || 0;
  const safeCardIndex = totalDeckCards > 0 ? Math.min(cardIndex, totalDeckCards - 1) : 0;
  const activeCard = currentDeck?.cards?.[safeCardIndex] || null;

  const handleNextCard = () => {
    if (!totalDeckCards) return;
    playSound('flip');
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % totalDeckCards);
  };

  const handlePrevCard = () => {
    if (!totalDeckCards) return;
    playSound('flip');
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + totalDeckCards) % totalDeckCards);
  };

  const handleMarkRemembered = () => {
    playSound('success');
    setCardsReviewedInRoom((c) => c + 1);
    recordStudyAction(10, `Ôn thẻ "${currentDeck?.title}" trong Phòng Tự Học Ảo`);
    spawnFloatingEmoji('⚡');
    handleNextCard();
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <style>{`
        @keyframes onthiFloatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 1; }
          100% { transform: translateY(-220px) scale(1.35); opacity: 0; }
        }
        .animate-onthi-float {
          animation: onthiFloatUp 2.2s ease-out forwards;
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl bg-slate-900 text-white rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-auto"
      >
        {/* Floating Cheer Emojis */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-30">
          {floatingHearts.map((item) => (
            <div
              key={item.id}
              style={{ left: `${item.left}%` }}
              className="absolute bottom-14 text-3xl sm:text-4xl animate-onthi-float"
            >
              {item.emoji}
            </div>
          ))}
        </div>

        {/* HEADER */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-slate-950" />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h2 className="text-sm sm:text-lg font-black tracking-tight text-white">
                  Phòng Tự Học Ảo 24/7 (Study With Me v3.0)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{realOnlinePeers.length + 1} sỹ tử đang trực tuyến</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Giờ Hà Nội: <strong className="text-amber-300 font-mono">{hanoiTime}</strong> • Đã ôn: <strong className="text-emerald-300">{cardsReviewedInRoom} thẻ</strong> • Tích lũy: <strong className="text-sky-300">{sessionMinutesEarned} phút</strong>
              </p>
            </div>
          </div>

          {/* Ambient Audio Controls + Close */}
          <div className="flex items-center flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectAmbient('rain')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 border transition-all cursor-pointer ${
                ambientMode === 'rain'
                  ? 'bg-sky-500/30 text-sky-200 border-sky-400 shadow-sm'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>🌧️ Mưa Rơi</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectAmbient('cafe')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 border transition-all cursor-pointer ${
                ambientMode === 'cafe'
                  ? 'bg-amber-500/30 text-amber-200 border-amber-400 shadow-sm'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>☕ Quán Cafe</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectAmbient('alpha')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 border transition-all cursor-pointer ${
                ambientMode === 'alpha'
                  ? 'bg-purple-500/30 text-purple-200 border-purple-400 shadow-sm'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>🧠 Sóng Alpha</span>
            </button>

            {ambientMode !== 'off' && (
              <div className="flex items-center space-x-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={handleVolumeChange}
                  className="w-14 accent-emerald-400 cursor-pointer"
                  title="Âm lượng nhạc nền"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                stopAmbientAudio();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-200 border border-white/10 text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <span>Rời Phòng</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SUB-NAVIGATION BAR: POMODORO COMPACT + MODE SWITCHER */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          {/* Compact Live Pomodoro Bar */}
          <div className="flex items-center flex-wrap gap-2.5">
            <div className="flex items-center space-x-2 bg-indigo-950/80 border border-indigo-500/30 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">
                ⏱️ POMODORO:
              </span>
              <span className="font-mono text-lg font-black text-amber-300">
                {formatTimer(secondsLeft)}
              </span>
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center space-x-1 cursor-pointer ${
                  isRunning ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
                }`}
              >
                {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isRunning ? 'Tạm dừng' : 'Tiếp tục'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setSecondsLeft(25 * 60);
                }}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
                title="Đặt lại 25 phút"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs font-bold text-white outline-none focus:border-sky-400"
            >
              <option value="🔥 Đang cày Flashcard Anki">🔥 Đang cày Flashcard Anki</option>
              <option value="🏛️ Đang ôn Luật Công chức 2026">🏛️ Đang ôn Luật Công chức 2026</option>
              <option value="🎯 Đang giải Đề Thi Thử">🎯 Đang giải Đề Thi Thử</option>
              <option value="📄 Đang nhẩm Bảng Tóm Tắt 1 Trang">📄 Đang nhẩm Bảng Tóm Tắt 1 Trang</option>
            </select>
          </div>

          {/* Room View Switcher */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRoomTab('split')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 cursor-pointer transition-all ${
                roomTab === 'split'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>⚡ Bàn Cày Thẻ Trực Tiếp</span>
            </button>
            <button
              type="button"
              onClick={() => setRoomTab('desks')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 cursor-pointer transition-all ${
                roomTab === 'desks'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>👥 Bàn Học Trực Tuyến ({realOnlinePeers.length + 1})</span>
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {roomTab === 'split' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Column (7 cols): In-Room Interactive Flashcard Study Desk */}
              <div className="lg:col-span-7 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-800/90 via-slate-900 to-indigo-950/80 border border-sky-500/30 shadow-xl space-y-4">
                {/* Deck Selector & Cheatsheet Shortcut */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
                    <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
                    <select
                      value={selectedDeckId}
                      onChange={(e) => {
                        setSelectedDeckId(e.target.value);
                        setCardIndex(0);
                        setIsFlipped(false);
                      }}
                      className="bg-slate-950/90 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-extrabold text-sky-200 outline-none focus:border-sky-400 w-full"
                    >
                      {studyDecks.map((deck) => (
                        <option key={deck.id} value={deck.id}>
                          {deck.icon} {deck.title} ({deck.cards?.length || 0} thẻ)
                        </option>
                      ))}
                    </select>
                  </div>

                  {onOpenCheatSheet && (
                    <button
                      type="button"
                      onClick={() => onOpenCheatSheet(selectedDeckId)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 text-xs font-extrabold flex items-center space-x-1 cursor-pointer shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>📄 Mở Phao 1 Trang</span>
                    </button>
                  )}
                </div>

                {/* Interactive Flashcard Box */}
                {activeCard ? (
                  <div
                    onClick={() => {
                      playSound('flip');
                      setIsFlipped(!isFlipped);
                    }}
                    className={`min-h-[230px] sm:min-h-[260px] rounded-2xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer transition-all select-none border ${
                      isFlipped
                        ? 'bg-gradient-to-br from-emerald-950/90 to-slate-900 border-emerald-400/50 shadow-lg shadow-emerald-950/50'
                        : 'bg-gradient-to-br from-slate-900 to-indigo-950/90 border-sky-400/40 hover:border-sky-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-sky-300">
                        Thẻ #{safeCardIndex + 1} / {totalDeckCards}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full font-extrabold ${
                        isFlipped ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {isFlipped ? '💡 ĐÁP ÁN & GIẢI THÍCH' : '❓ CÂU HỎI (BẤM ĐỂ LẬT)'}
                      </span>
                    </div>

                    <div className="my-auto py-4 text-center space-y-3">
                      {!isFlipped ? (
                        <h3 className="text-base sm:text-xl font-black text-white leading-relaxed">
                          {activeCard.front}
                        </h3>
                      ) : (
                        <div className="space-y-2.5 animate-fade-in">
                          <div className="text-base sm:text-lg font-black text-emerald-300 leading-relaxed">
                            👉 {activeCard.back}
                          </div>
                          {activeCard.detail && (
                            <p className="text-xs sm:text-sm text-slate-300 bg-black/30 p-3 rounded-xl border border-white/10 leading-relaxed">
                              💡 {activeCard.detail}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center text-[11px] text-slate-400 font-semibold gap-1.5">
                      <RotateCw className="w-3.5 h-3.5 text-sky-400" />
                      <span>Chạm vào thẻ để lật mặt trước / mặt sau (Vừa nghe tiếng mưa vừa học)</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    Bộ thẻ này hiện chưa có câu hỏi.
                  </div>
                )}

                {/* Card Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handlePrevCard}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Thẻ trước</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextCard}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Thẻ tiếp</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleMarkRemembered}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã Nhớ (+10 XP & Qua Thẻ)</span>
                  </button>
                </div>
              </div>

              {/* Right Column (5 cols): Real Online Peers & Live Cheer Chat */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                {/* Quick Cheer Buttons */}
                <div className="p-4 rounded-2xl bg-slate-800/70 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                      <span>Thả Tim & Gửi Lời Cổ Vũ Thời Gian Thực:</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">Đồng bộ Cloud Thật</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {CHEER_EMOJIS.map((item) => (
                      <button
                        key={item.emoji}
                        type="button"
                        onClick={() => handleSendCheer(item)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-white/10 hover:border-indigo-400/50 text-[11px] font-bold flex items-center space-x-1 transition-all active:scale-95 cursor-pointer"
                      >
                        <span>{item.emoji}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Cheer Input */}
                  <form onSubmit={handleCustomCheerSubmit} className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={customCheerInput}
                      onChange={(e) => setCustomCheerInput(e.target.value)}
                      placeholder="Nhập lời chúc hoặc mục tiêu học tối nay..."
                      maxLength={120}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-white/15 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center space-x-1 cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi</span>
                    </button>
                  </form>
                </div>

                {/* Live Cheer Feed (100% Real Messages) */}
                <div className="p-4 rounded-2xl bg-slate-800/70 border border-white/10 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Bảng Tin Cổ Vũ Trực Tiếp ({cheers.length})</span>
                    </h4>
                  </div>

                  {cheers.length === 0 ? (
                    <div className="my-auto py-8 text-center text-slate-400 text-xs space-y-1">
                      <p className="font-bold text-slate-300">Chưa có tin nhắn cổ vũ nào trong phiên này.</p>
                      <p className="text-[11px]">Hãy bấm nút thả tim hoặc gửi lời chúc đầu tiên để khích lệ tinh thần học tập!</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {cheers.map((c) => (
                        <div
                          key={c.id}
                          className="text-xs px-3 py-2 rounded-xl bg-slate-900/90 border border-white/5 flex items-start justify-between gap-2"
                        >
                          <div className="leading-relaxed">
                            <strong className="text-sky-300">{c.user}:</strong>{' '}
                            <span className="text-slate-200">{c.text}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">{c.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* FULL DESKS VIEW: ONLY REAL USERS (YOU + REAL ONLINE PEERS) */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Current User Desk */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border-2 border-emerald-400/60 flex items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={userAvatar}
                        alt={displayName}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-400 text-slate-950">
                        BẠN
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-white truncate">
                        {displayName}
                      </h4>
                      <p className="text-[11px] text-emerald-300 font-semibold truncate mt-0.5">
                        {selectedStatus}
                      </p>
                      <span className="inline-block mt-1 text-[10px] text-slate-300">
                        Đã ôn {cardsReviewedInRoom} thẻ • {sessionMinutesEarned} phút
                      </span>
                    </div>
                  </div>
                </div>

                {/* Other Real Online Users */}
                {realOnlinePeers.map((peer) => (
                  <div
                    key={peer.clientId}
                    className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-white/10 flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-white/20"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-white truncate">
                            {peer.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate mt-0.5">
                          📖 {peer.subject}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {peer.streak > 0 && (
                            <span className="text-[10px] font-bold text-amber-300 flex items-center">
                              🔥 {peer.streak} ngày
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-black text-emerald-300">
                        {peer.minutesFocused || 0}p
                      </div>
                      <span className="text-[10px] text-slate-400 block">tập trung</span>
                    </div>
                  </div>
                ))}
              </div>

              {realOnlinePeers.length === 0 && (
                <div className="p-6 rounded-2xl bg-slate-800/40 border border-white/10 text-center space-y-1.5">
                  <p className="text-xs font-bold text-slate-200">
                    Hiện chỉ có mình bạn đang ngồi trong Phòng Tự Học Ảo lúc này.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Phòng học đồng bộ người thật 100% (không dùng bot ảo). Khi có học viên khác mở Phòng Tự Học trên thiết bị của họ, bàn học của họ sẽ tự động xuất hiện tại đây!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Mỗi thẻ bấm <strong>&ldquo;Đã Nhớ&rdquo;</strong> cộng <strong>+10 XP</strong> • Hoàn thành 25p Pomodoro cộng <strong>+50 XP</strong> vào chuỗi Streak.
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Đồng bộ thời gian thực qua Cloud Relay • Không dùng Bot
          </span>
        </div>
      </div>
    </div>
  );
}
