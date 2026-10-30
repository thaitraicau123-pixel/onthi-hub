import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  RotateCw,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Download,
  Scissors,
  FileText,
  Sparkles,
  Lock,
  Maximize2,
  Minimize2,
  Layers,
  Search,
  Bot,
  Copy,
  Check,
  Pause,
  Star,
  Headphones,
  Share2,
  MessageCircle,
  MoreHorizontal,
  Mic,
  MicOff
} from 'lucide-react';
import { exportAnkiDeckFile, printFlashcardCutoutSheet, playSound } from '../utils/storage';
import { recordStudyAction, completeDailyQuest } from '../utils/gamification';
import { explainFlashcardWithAi } from '../utils/aiTutor';
import { recordCardReview, getNextIntervalPreview, getCardSrs } from '../utils/spacedRepetition';
import { recordMistake, markMistakeMastered } from '../utils/mistakeTracker';
import { copyFlashcardShareLink } from '../utils/shareLink';
import confetti from 'canvas-confetti';

/**
 * Helper to parse bracket tags from front card text
 * e.g. "[Logistics] Công thức là gì?" -> { tag: "Logistics", cleanQuestion: "Công thức là gì?" }
 */
function parseFrontText(text, fallbackTag) {
  if (!text) return { tag: fallbackTag || 'Prompt', cleanQuestion: '' };
  const match = text.match(/^\[(.*?)\]\s*(.*)$/s);
  if (match) {
    return { tag: match[1], cleanQuestion: match[2] };
  }
  return { tag: fallbackTag || 'Prompt', cleanQuestion: text };
}

export default function FlashcardModal({
  course,
  isPurchased,
  onClose,
  onOpenCheatSheet,
  onBuy,
  initialCardIndex = null,
  onOpenDirectChat
}) {
  const allDeckCards = course?.previewCards?.length
    ? course.previewCards
    : (course?.cards?.length ? course.cards : (course?.flashcards?.length ? course.flashcards : (course?.sampleCards || [])));

  // Starred / Favorite Cards State
  const starredKey = `onthi_starred_cards_${course?.id || 'default'}`;
  const [starredCardIds, setStarredCardIds] = useState(() => {
    try {
      const saved = localStorage.getItem(starredKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [onlyStarredMode, setOnlyStarredMode] = useState(false);

  const starredCards = useMemo(() => {
    return allDeckCards.filter((card, idx) => {
      const cardId = card.id !== undefined ? card.id : idx;
      return starredCardIds.includes(cardId);
    });
  }, [allDeckCards, starredCardIds]);

  const cards = onlyStarredMode && starredCards.length > 0 ? starredCards : allDeckCards;

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialCardIndex !== null && initialCardIndex !== undefined && !isNaN(initialCardIndex)) {
      return Math.min(Math.max(0, Number(initialCardIndex)), Math.max(0, allDeckCards.length - 1));
    }
    return 0;
  });

  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [topicDrawerOpen, setTopicDrawerOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [topicSearchTerm, setTopicSearchTerm] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('ALL');
  const [shareToast, setShareToast] = useState('');

  // Audio Podcast State
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlaySeconds, setAutoPlaySeconds] = useState(3);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [_isSpeakingNow, setIsSpeakingNow] = useState(false);

  // AI Tutor State
  const [aiExplanations, setAiExplanations] = useState({});
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [copiedAiText, setCopiedAiText] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // SRS Stats
  const [_reviewedStats, setReviewedStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  const modalContainerRef = useRef(null);
  const moreMenuRef = useRef(null);

  // Voice Q&A / Speech-to-Text State
  const [isListening, setIsListening] = useState(false);
  const [voiceResult, setVoiceResult] = useState(null);
  const recognitionRef = useRef(null);

  const handleStartVoiceCheck = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói (Web Speech API). Bạn hãy sử dụng Google Chrome trên máy tính hoặc điện thoại nhé!');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);
      setVoiceResult(null);
      playSound('click');

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        const targetAnswer = currentCard.back || '';

        const normalize = (s) =>
          s
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, ' ')
            .trim()
            .split(/\s+/)
            .filter(Boolean);
        const spokenWords = new Set(normalize(spoken));
        const targetWords = normalize(targetAnswer);
        let matchCount = 0;
        targetWords.forEach((w) => {
          if (spokenWords.has(w)) matchCount++;
        });

        const similarity = targetWords.length > 0 ? Math.round((matchCount / targetWords.length) * 100) : 50;
        const isMatch = similarity >= 35;

        setVoiceResult({ spokenText: spoken, similarity, isMatch });
        setIsListening(false);

        if (isMatch) {
          playSound('success');
          try {
            confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });
          } catch (e) {}
          setIsFlipped(true);
        } else {
          playSound('error');
          setIsFlipped(true);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Close more menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setIsMoreMenuOpen(false);
      }
    };
    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMoreMenuOpen]);

  // Current Card Data
  const currentCard = cards[currentIndex] || { front: '', back: '', tag: '' };
  const currentCardId = currentCard.id !== undefined ? currentCard.id : currentIndex;
  const isCurrentCardStarred = starredCardIds.includes(currentCardId);

  // Parsed Front
  const parsedFront = useMemo(() => {
    return parseFrontText(currentCard.front, currentCard.tag);
  }, [currentCard.front, currentCard.tag]);

  const toggleStarCurrentCard = () => {
    playSound('flip');
    setStarredCardIds((prev) => {
      const exists = prev.includes(currentCardId);
      const next = exists ? prev.filter((id) => id !== currentCardId) : [...prev, currentCardId];
      try {
        localStorage.setItem(starredKey, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Safe Speech Synthesis with Vietnamese Voice Fallback
  const handleSpeak = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/\[.*?\]/g, '').replace(/[•*#_`]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speechRate;

      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find((v) => v.lang.includes('vi') || v.lang.includes('VIE'));
      if (viVoice) {
        utterance.voice = viVoice;
      }
      utterance.lang = 'vi-VN';

      utterance.onstart = () => setIsSpeakingNow(true);
      utterance.onend = () => setIsSpeakingNow(false);
      utterance.onerror = () => setIsSpeakingNow(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeakingNow(false);
    }
  };

  // Target Deck & Card Index for SRS
  const targetDeckId = currentCard.originalDeckId || course?.id || 'default';
  const targetCardIndex = currentCard.originalCardIndex !== undefined ? currentCard.originalCardIndex : currentIndex;
  const currentSrs = getCardSrs(targetDeckId, targetCardIndex);

  const againInterval = getNextIntervalPreview(targetDeckId, targetCardIndex, 'again');
  const hardInterval = getNextIntervalPreview(targetDeckId, targetCardIndex, 'hard');
  const goodInterval = getNextIntervalPreview(targetDeckId, targetCardIndex, 'good');
  const easyInterval = getNextIntervalPreview(targetDeckId, targetCardIndex, 'easy');

  // Navigation handlers
  const goToNext = () => {
    if (!cards || cards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const goToPrev = () => {
    if (!cards || cards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const toggleFlip = () => {
    playSound('flip');
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (autoSpeak) {
      handleSpeak(nextFlipped ? currentCard.back : currentCard.front);
    }
  };

  const handleAskAiTutor = async () => {
    setAiDrawerOpen(true);
    setAiError('');

    if (aiExplanations[currentIndex]) return;

    setIsAiLoading(true);
    try {
      const res = await explainFlashcardWithAi({
        front: currentCard.front,
        back: currentCard.back,
        tag: currentCard.tag,
        title: course.title
      });

      if (res.success) {
        setAiExplanations((prev) => ({ ...prev, [currentIndex]: res.content }));
        playSound('success');
      } else {
        setAiError(res.message);
      }
    } catch (e) {
      setAiError(e.message || 'Lỗi kết nối Trợ lý AI');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyAiText = () => {
    const text = aiExplanations[currentIndex] || '';
    navigator.clipboard.writeText(text);
    playSound('success');
    setCopiedAiText(true);
    setTimeout(() => setCopiedAiText(false), 2500);
  };

  const handleCopyPrompt = async (text) => {
    if (!text) return;
    let promptText = text;
    const match = text.match(/PROMPT:\s*([\s\S]*?)(?=\n\n📌|\n\n💡|$)/i);
    if (match && match[1].trim()) {
      promptText = match[1].trim();
    }
    try {
      await navigator.clipboard.writeText(promptText);
      playSound('success');
      setCopiedPrompt(true);
      setShareToast('📋 Đã sao chép Prompt thành công! Dán ngay vào Higgsfield, Midjourney hoặc Claude.');
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.3 } });
      } catch (e) {}
      setTimeout(() => {
        setCopiedPrompt(false);
        setShareToast('');
      }, 3500);
    } catch (err) {
      try {
        navigator.clipboard.writeText(text);
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2500);
      } catch (e) {}
    }
  };

  // Rate spaced repetition
  const handleRate = (type) => {
    setReviewedStats((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    recordCardReview(targetDeckId, targetCardIndex, type);

    if (type === 'again') {
      recordMistake({
        type: 'flashcard',
        deckId: targetDeckId,
        deckTitle: course.title,
        question: currentCard.front,
        answer: currentCard.back,
        tag: currentCard.tag
      });
    } else if (currentCard.mistakeId && (type === 'good' || type === 'easy')) {
      markMistakeMastered(currentCard.mistakeId);
    }

    recordStudyAction(5);
    completeDailyQuest('review_cards');
    goToNext();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleFlip();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === '1') {
        handleRate('again');
      } else if (e.key === '2') {
        handleRate('hard');
      } else if (e.key === '3') {
        handleRate('good');
      } else if (e.key === '4') {
        handleRate('easy');
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (aiDrawerOpen) setAiDrawerOpen(false);
        else if (topicDrawerOpen) setTopicDrawerOpen(false);
        else if (isMoreMenuOpen) setIsMoreMenuOpen(false);
        else onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, cards.length, aiDrawerOpen, topicDrawerOpen, isMoreMenuOpen]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalContainerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Auto-play podcast mode loop
  useEffect(() => {
    if (!isAutoPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingNow(false);
      return;
    }

    if (!isFlipped) {
      handleSpeak(currentCard.front);
      const flipTimer = setTimeout(() => {
        setIsFlipped(true);
      }, autoPlaySeconds * 1000);
      return () => clearTimeout(flipTimer);
    } else {
      handleSpeak(currentCard.back);
      const nextTimer = setTimeout(() => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % (cards.length || 1));
      }, (autoPlaySeconds + 1) * 1000);
      return () => clearTimeout(nextTimer);
    }
  }, [isAutoPlaying, currentIndex, isFlipped, autoPlaySeconds, speechRate, cards.length]);

  // Topic drawer filtering
  const uniqueTags = useMemo(() => {
    const set = new Set();
    cards.forEach((c) => {
      if (c.tag) set.add(c.tag);
    });
    return Array.from(set);
  }, [cards]);

  const tagCounts = useMemo(() => {
    const counts = {};
    cards.forEach((c) => {
      if (c.tag) counts[c.tag] = (counts[c.tag] || 0) + 1;
    });
    return counts;
  }, [cards]);

  const filteredCardItems = useMemo(() => {
    return cards
      .map((card, idx) => ({ card, idx }))
      .filter(({ card, idx }) => {
        const cardId = card.id !== undefined ? card.id : idx;
        if (selectedTagFilter === 'STARRED') {
          return starredCardIds.includes(cardId);
        }
        if (selectedTagFilter !== 'ALL') {
          return card.tag === selectedTagFilter;
        }
        return true;
      })
      .filter(({ card }) => {
        if (!topicSearchTerm.trim()) return true;
        const term = topicSearchTerm.toLowerCase();
        return (
          (card.front && card.front.toLowerCase().includes(term)) ||
          (card.back && card.back.toLowerCase().includes(term)) ||
          (card.tag && card.tag.toLowerCase().includes(term))
        );
      });
  }, [cards, selectedTagFilter, topicSearchTerm, starredCardIds]);

  const handleJumpToCard = (targetIdx) => {
    setCurrentIndex(targetIdx);
    setIsFlipped(false);
    setTopicDrawerOpen(false);
    playSound('flip');
  };

  // Progress percentage
  const progressPercent = Math.round(((currentIndex + 1) / (cards.length || 1)) * 100);

  return (
    <div
      ref={modalContainerRef}
      onClick={(e) => {
        if (!isFullscreen && e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto ${
        isFullscreen ? '!p-0' : 'cursor-pointer'
      }`}
    >
      {!isFullscreen && <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />}
      
      {/* =========================================================================
          MAIN MODAL CONTAINER (PREMIUM OBSIDIAN GLASS THEME)
          ========================================================================= */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${
          isFullscreen ? 'max-w-none h-full !rounded-none' : 'max-w-3xl rounded-3xl max-h-[94vh] cursor-default'
        } bg-[#111827] text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden border border-slate-700/80 animate-spring-3d`}
      >
        
        {/* =========================================================================
            HEADER: CLEAN, SPACIOUS, UNIFIED TOOLBAR
            ========================================================================= */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#162032] shrink-0">
          
          {/* Left Side: Index Pill + Title + SRS badge */}
          <div className="flex items-center space-x-3 min-w-0">
            {/* Progress Counter Pill */}
            <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-bold text-xs tracking-wider shrink-0 font-mono">
              {currentIndex + 1} / {cards.length}
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm sm:text-base font-extrabold text-white truncate max-w-[200px] sm:max-w-xs">
                  {course.title}
                </h4>
                {onlyStarredMode ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                    ⭐ Đang ôn sao
                  </span>
                ) : currentSrs.totalReviews > 0 ? (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 shrink-0">
                    🧠 SM-2: {currentSrs.intervalDays}d
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 shrink-0">
                    ✨ Thẻ Mới
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Action Cluster */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* 1. Podcast Hands-Free Mode */}
            <button
              onClick={() => {
                const next = !isAutoPlaying;
                setIsAutoPlaying(next);
                if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsSpeakingNow(false);
                }
                if (next) playSound('flip');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                isAutoPlaying
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white border-indigo-500 shadow-md ring-2 ring-sky-400'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700'
              }`}
              title="Chế độ Podcast tự động đọc câu hỏi & đáp án rảnh tay"
            >
              <Headphones className={`w-3.5 h-3.5 ${isAutoPlaying ? 'animate-bounce text-white' : 'text-indigo-400'}`} />
              <span className="hidden sm:inline">{isAutoPlaying ? 'Đang Phát' : 'Podcast'}</span>
            </button>

            {/* 2. Starred Filter Toggle */}
            <button
              onClick={() => {
                if (starredCardIds.length === 0) {
                  alert('⭐ Bạn chưa đánh dấu sao thẻ nào! Hãy bấm biểu tượng ngôi sao ⭐ trên góc thẻ để ghim lại câu khó và ôn cấp tốc.');
                  return;
                }
                const nextMode = !onlyStarredMode;
                setOnlyStarredMode(nextMode);
                setCurrentIndex(0);
                setIsFlipped(false);
                playSound('flip');
              }}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                onlyStarredMode
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm font-black ring-2 ring-amber-300'
                  : starredCardIds.length > 0
                  ? 'border-amber-500/50 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                  : 'border-slate-700 bg-slate-800/80 text-slate-400 hover:bg-slate-700'
              }`}
              title="Bật/Tắt chế độ chỉ ôn các thẻ đã đánh dấu sao ⭐"
            >
              <Star className={`w-3.5 h-3.5 ${onlyStarredMode || starredCardIds.length > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">({starredCardIds.length})</span>
            </button>

            {/* 3. Auto-speak Audio Toggle */}
            <button
              onClick={() => {
                setAutoSpeak(!autoSpeak);
                playSound('click');
              }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center border transition-colors cursor-pointer ${
                autoSpeak
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
              title={autoSpeak ? "Tự động phát âm khi lật thẻ: Đang Bật" : "Tự động phát âm khi lật thẻ: Đang Tắt"}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            {/* 4. More Options Dropdown (Cleans up 6 buttons into a sleek popover) */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center border transition-colors cursor-pointer ${
                  isMoreMenuOpen
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Các công cụ & tùy chọn bổ sung"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Popover Menu */}
              {isMoreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#1a2336] border border-slate-700/80 shadow-2xl p-2 z-50 text-xs space-y-1 animate-scale-up">
                  
                  {/* Mục Lục */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setTopicDrawerOpen(true);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 transition-colors text-left cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Mục Lục Thẻ ({cards.length})</span>
                  </button>

                  {/* Cheatsheet */}
                  {onOpenCheatSheet && (
                    <button
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        onOpenCheatSheet(course);
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 transition-colors text-left cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Tóm Tắt 1 Trang (Cheatsheet)</span>
                    </button>
                  )}

                  {/* Chia Sẻ Link */}
                  <button
                    onClick={async () => {
                      setIsMoreMenuOpen(false);
                      const res = await copyFlashcardShareLink({
                        deckId: course.id,
                        deckTitle: course.title,
                        cardIndex: currentIndex,
                        useNativeShare: true
                      });
                      if (res.success) {
                        playSound('success');
                        try {
                          confetti({ particleCount: 35, spread: 40, origin: { y: 0.2 } });
                        } catch (e) {}
                        setShareToast('🔗 ' + res.message);
                        setTimeout(() => setShareToast(''), 3500);
                      }
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 transition-colors text-left cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Sao Chép Link Thẻ Này</span>
                  </button>

                  {/* Nhắn Tin Trực Tiếp */}
                  {onOpenDirectChat && (
                    <button
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        onClose();
                        onOpenDirectChat(null, course);
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 transition-colors text-left cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>Gửi Qua Tin Nhắn Chat</span>
                    </button>
                  )}

                  <div className="border-t border-slate-700/60 my-1" />

                  {/* File Export */}
                  {isPurchased && (
                    <button
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        exportAnkiDeckFile(course.title, cards);
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 transition-colors text-left cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Xuất File .txt / Prompt List</span>
                    </button>
                  )}

                  {/* In Kịch Bản / Prompt */}
                  {isPurchased && (
                    <button
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        printFlashcardCutoutSheet(course);
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 transition-colors text-left cursor-pointer"
                    >
                      <Scissors className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>In Kịch Bản / Prompt Ra Giấy</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 5. Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors hidden sm:inline-flex cursor-pointer"
              title={isFullscreen ? 'Thoát toàn màn hình' : 'Học toàn màn hình (Focus Mode)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* 6. Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-rose-500/80 hover:border-rose-500 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hairline Animated Progress Bar */}
        <div className="w-full h-1 bg-slate-800/90 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Share Link Toast Banner */}
        {shareToast && (
          <div className="bg-sky-500/20 border-b border-sky-500/40 px-4 py-2 flex items-center justify-between text-xs text-sky-200 font-bold animate-fade-in">
            <span>{shareToast}</span>
            <button onClick={() => setShareToast('')} className="text-slate-400 hover:text-white p-0.5 cursor-pointer ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Banner if in Starred-Only mode */}
        {onlyStarredMode && (
          <div className="px-5 py-2 bg-amber-500/15 border-b border-amber-500/30 text-amber-200 flex items-center justify-between text-xs font-semibold animate-fade-in">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Đang trong chế độ <strong>Ôn Cấp Tốc Các Thẻ Ghim Sao ({cards.length} thẻ)</strong></span>
            </div>
            <button
              onClick={() => {
                setOnlyStarredMode(false);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="text-[11px] text-amber-300 underline hover:text-amber-100 font-bold cursor-pointer"
            >
              Quay lại toàn bộ ({allDeckCards.length} thẻ)
            </button>
          </div>
        )}

        {/* Audio Podcast Mini-Player Strip */}
        {isAutoPlaying && (
          <div className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-800/50 text-white flex flex-wrap items-center justify-between gap-3 text-xs shadow-inner animate-fade-in">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4 text-sky-300 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sky-200 truncate">
                    🎧 Podcast Học Thụ Động • Thẻ {currentIndex + 1}/{cards.length}
                  </span>
                  <div className="flex items-end space-x-0.5 h-3 shrink-0">
                    <span className="w-1 bg-sky-400 rounded-full animate-bounce h-2" />
                    <span className="w-1 bg-indigo-400 rounded-full animate-bounce h-3.5 delay-75" />
                    <span className="w-1 bg-pink-400 rounded-full animate-bounce h-2.5 delay-150" />
                    <span className="w-1 bg-sky-300 rounded-full animate-bounce h-3 delay-100" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  {isFlipped ? '🔊 Đang đọc: Mặt sau (Đáp án & Căn cứ)' : '🔊 Đang đọc: Mặt trước (Câu hỏi)'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 ml-auto">
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsSpeakingNow(false);
                }}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
                title="Tạm dừng Podcast"
              >
                <Pause className="w-3 h-3 fill-white" />
                <span>Dừng</span>
              </button>

              <div className="flex items-center space-x-1 text-[11px] bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
                <span className="text-slate-400 text-[10px]">Tốc độ:</span>
                {[0.8, 1.0, 1.25].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSpeechRate(rate)}
                    className={`px-1.5 py-0.2 rounded font-bold transition-colors cursor-pointer ${
                      speechRate === rate ? 'bg-sky-500 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center space-x-1 text-[11px] bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
                <span className="text-slate-400 text-[10px]">Nghỉ:</span>
                {[2, 3, 5].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setAutoPlaySeconds(sec)}
                    className={`px-1.5 py-0.2 rounded font-bold transition-colors cursor-pointer ${
                      autoPlaySeconds === sec ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preview Notice Bar for Non-Purchased Courses */}
        {!isPurchased && (
          <div className="px-5 py-2.5 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border-b border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center space-x-2 min-w-0">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">
                Đang học thử <strong>{cards.length} thẻ mẫu</strong> • Mở khóa toàn bộ <strong>350+ thẻ & tài liệu</strong>.
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onBuy(course);
              }}
              className="px-3.5 py-1 font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg shrink-0 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Mở Khóa Toàn Bộ ({course.priceXu || 25} Xu)
            </button>
          </div>
        )}

        {/* =========================================================================
            CARD BODY: FLOATING TACTILE 3D CARD
            ========================================================================= */}
        <div className="p-4 sm:p-7 flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#0e1626] to-[#0a0f1d] min-h-[360px] sm:min-h-[420px]">
          
          <div
            onClick={toggleFlip}
            className="w-full max-w-xl h-72 sm:h-84 cursor-pointer perspective-1000 select-none group focus:outline-none"
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? "Đang xem mặt sau, bấm để lật lại" : "Đang xem mặt trước, bấm để lật xem đáp án"}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                toggleFlip();
              }
            }}
          >
            <div
              className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              
              {/* ================= FRONT SIDE ================= */}
              <div
                className={`absolute inset-0 backface-hidden p-6 sm:p-8 flex flex-col justify-between rounded-3xl bg-[#1e293b]/95 border border-slate-700/80 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-opacity duration-200 ${
                  isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                }`}
              >
                {/* Top Row: Tag Badge + Action Buttons */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wide uppercase">
                    {parsedFront.tag || 'Prompt Mẫu'}
                  </span>
                  
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarCurrentCard();
                      }}
                      className="p-2 hover:bg-slate-700/80 rounded-xl transition-colors cursor-pointer"
                      title={isCurrentCardStarred ? 'Bỏ đánh dấu sao' : 'Đánh dấu sao thẻ này'}
                    >
                      <Star className={`w-4 h-4 ${isCurrentCardStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-400'}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(currentCard.front);
                      }}
                      className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-700/80 rounded-xl transition-colors cursor-pointer"
                      title="Đọc thông tin prompt"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Text (Large, crisp, legible) */}
                <div className="my-auto text-center px-4 py-3 max-h-[190px] overflow-y-auto">
                  <p className="text-xl sm:text-2xl font-extrabold text-white leading-relaxed tracking-tight whitespace-pre-line">
                    {parsedFront.cleanQuestion || (cards.length === 0 ? 'Gói Prompt chưa có nội dung' : 'Prompt trống')}
                  </p>
                </div>

                {/* Flip Hint */}
                <div className="text-center text-xs text-amber-400/90 flex items-center justify-center space-x-2 font-medium">
                  <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-amber-400" />
                  <span>Chạm hoặc bấm [Phím Cách] để xem câu lệnh Prompt & thông số kỹ thuật</span>
                </div>
              </div>

              {/* ================= BACK SIDE ================= */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 p-6 sm:p-8 flex flex-col justify-between rounded-3xl bg-[#1e293b]/95 border-2 border-amber-500/60 shadow-[0_16px_40px_rgba(245,158,11,0.25)] backdrop-blur-xl transition-opacity duration-200 ${
                  isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Top Row: Answer Badge + Action Buttons */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 tracking-wide uppercase">
                    ✨ Câu Lệnh Prompt & Tham Số
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarCurrentCard();
                      }}
                      className="p-2 hover:bg-slate-700/80 rounded-xl transition-colors cursor-pointer"
                      title={isCurrentCardStarred ? 'Bỏ đánh dấu sao' : 'Đánh dấu sao thẻ này'}
                    >
                      <Star className={`w-4 h-4 ${isCurrentCardStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-400'}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyPrompt(currentCard.back);
                      }}
                      className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-xs flex items-center space-x-1 transition-all shadow-sm cursor-pointer"
                      title="Sao chép prompt"
                    >
                      {copiedPrompt ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                      <span>{copiedPrompt ? 'Đã Copy!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Answer Text */}
                <div className="my-auto py-3 max-h-[170px] overflow-y-auto px-2">
                  <div className="text-sm sm:text-base text-slate-100 leading-relaxed whitespace-pre-line font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 text-left">
                    {currentCard.back || (cards.length === 0 ? 'Chưa có prompt' : 'Trống')}
                  </div>
                </div>

                {/* 1-Click Copy Banner Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyPrompt(currentCard.back);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  {copiedPrompt ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-white" />}
                  <span>{copiedPrompt ? '🎉 ĐÃ SAO CHÉP PROMPT THÀNH CÔNG!' : '📋 SAO CHÉP PROMPT 1-CHẠM'}</span>
                </button>

                {/* Flip Back Hint */}
                <div className="text-center sm:text-right text-[11px] text-slate-400 font-medium flex items-center justify-center sm:justify-end space-x-1.5 pt-1">
                  <RotateCw className="w-3 h-3 text-slate-400" />
                  <span>Chạm để lật lại tên Prompt</span>
                </div>
              </div>

            </div>
          </div>

          {/* Voice Review Feedback Strip */}
          {isListening && (
            <div className="mt-3 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>🎙️ Đang lắng nghe... Hãy nói to đáp án vào mic!</span>
            </div>
          )}

          {voiceResult && (
            <div className="mt-3 max-w-xl w-full p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs space-y-1 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">Bạn vừa nói:</span>
                <span className={`font-black ${voiceResult.isMatch ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {voiceResult.isMatch ? '🎉 Trả lời chuẩn xác' : '⚡ Cần bổ sung thêm'} ({voiceResult.similarity}% khớp)
                </span>
              </div>
              <p className="text-white italic">"{voiceResult.spokenText}"</p>
            </div>
          )}

          {/* Navigation Controls: Prev / Next buttons */}
          <div className="mt-4 sm:mt-5 flex items-center space-x-5">
            <button
              onClick={goToPrev}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
              title="Thẻ trước [Phím Mũi tên trái]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">
              {cards.length > 0 ? `${currentIndex + 1} / ${cards.length}` : '0 / 0'}
            </span>
            <button
              onClick={goToNext}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
              title="Thẻ tiếp theo [Phím Mũi tên phải]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Ask AI Tutor Button */}
          <div className="mt-3.5">
            <button
              onClick={handleAskAiTutor}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Hỏi Trợ Lý AI Chuyên Gia (Bản Chất & Mẹo Nhớ)</span>
            </button>
          </div>

        </div>

        {/* =========================================================================
            FOOTER: 4 SRS SPACED REPETITION RATING BUTTONS (CLEAN TACTILE CARDS)
            ========================================================================= */}
        <div className="px-5 py-4 border-t border-slate-800 bg-[#162032] shrink-0">
          <div className="text-center mb-3">
            <span className="text-xs text-slate-400 font-semibold">
              Đánh giá mức độ ghi nhớ (Spaced Repetition):
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-xl mx-auto">
            
            {/* 1. Học Lại (Again) */}
            <button
              onClick={() => handleRate('again')}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-rose-200 transition-all cursor-pointer active:scale-95 group"
            >
              <span className="text-xs sm:text-sm font-black group-hover:scale-105 transition-transform">Học Lại</span>
              <span className="text-[10px] text-rose-400/90 font-bold hidden sm:inline">(Phím 1 • {againInterval})</span>
            </button>

            {/* 2. Khó (Hard) */}
            <button
              onClick={() => handleRate('hard')}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 transition-all cursor-pointer active:scale-95 group"
            >
              <span className="text-xs sm:text-sm font-black group-hover:scale-105 transition-transform">Khó</span>
              <span className="text-[10px] text-amber-400/90 font-bold hidden sm:inline">(Phím 2 • {hardInterval})</span>
            </button>

            {/* 3. Tốt (Good) */}
            <button
              onClick={() => handleRate('good')}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 hover:text-sky-200 transition-all cursor-pointer active:scale-95 group"
            >
              <span className="text-xs sm:text-sm font-black group-hover:scale-105 transition-transform">Tốt</span>
              <span className="text-[10px] text-sky-400/90 font-bold hidden sm:inline">(Phím 3 • {goodInterval})</span>
            </button>

            {/* 4. Dễ Nhớ (Easy) */}
            <button
              onClick={() => handleRate('easy')}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 transition-all cursor-pointer active:scale-95 group"
            >
              <span className="text-xs sm:text-sm font-black group-hover:scale-105 transition-transform">Dễ Nhớ</span>
              <span className="text-[10px] text-emerald-400/90 font-bold hidden sm:inline">(Phím 4 • {easyInterval})</span>
            </button>

          </div>
        </div>

      </div>

      {/* =========================================================================
          AI TUTOR DRAWER
          ========================================================================= */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] bg-[#1e293b] rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col text-slate-100">
            
            {/* Drawer Header */}
            <div className="px-5 py-3.5 bg-[#162032] text-white flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-tight flex items-center space-x-1.5">
                    <span>Trợ Lý Chuyên Gia Prompt AI</span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Pro Turbo
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-normal">
                    Phân tích góc quay, thông số camera & mẹo lên triệu view
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                {aiExplanations[currentIndex] && (
                  <button
                    onClick={handleCopyAiText}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                    title="Copy nội dung giải thích"
                  >
                    {copiedAiText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={() => setAiDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs sm:text-sm">
              <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 uppercase tracking-wider">
                  NỘI DUNG PROMPT ĐANG XEM
                </span>
                <p className="mt-2 font-bold text-white text-sm">
                  {currentCard.front}
                </p>
                <div className="mt-1.5 text-xs text-slate-300 whitespace-pre-line border-t border-slate-800 pt-2">
                  {currentCard.back}
                </div>
              </div>

              {/* Loading indicator */}
              {isAiLoading && (
                <div className="py-10 flex flex-col items-center justify-center space-y-2.5">
                  <div className="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-400 animate-pulse">
                    Đang kết nối hệ thống AI PromptMMO phân tích cú pháp & tối ưu hóa kịch bản...
                  </p>
                </div>
              )}

              {/* Error */}
              {aiError && (
                <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                  {aiError}
                </div>
              )}

              {/* Explanation */}
              {aiExplanations[currentIndex] && (
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
                  {aiExplanations[currentIndex]}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-5 py-3 bg-[#162032] border-t border-slate-700 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                💡 Nhớ nhanh theo phương pháp Spaced Repetition
              </span>
              <button
                onClick={() => setAiDrawerOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold cursor-pointer"
              >
                Đóng lại
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TOPIC & CONCEPT EXPLORER DRAWER
          ========================================================================= */}
      {topicDrawerOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-[#162032] h-full shadow-2xl flex flex-col animate-slide-left border-l border-slate-700 text-slate-100">
            
            {/* Drawer Header */}
            <div className="px-5 py-3.5 border-b border-slate-700 bg-[#111827] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Mục Lục & Sơ Đồ Chủ Đề</h4>
                  <p className="text-[11px] text-slate-400">
                    Tổng cộng {cards.length} Prompt & Kịch bản
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTopicDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-3.5 bg-[#111827] border-b border-slate-800 space-y-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={topicSearchTerm}
                  onChange={(e) => setTopicSearchTerm(e.target.value)}
                  placeholder="Tìm từ khóa câu hỏi, khái niệm..."
                  className="w-full pl-8 pr-7 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {topicSearchTerm && (
                  <button
                    onClick={() => setTopicSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Tag Badges Bar */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedTagFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedTagFilter === 'ALL'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Tất cả ({cards.length})
                </button>
                <button
                  onClick={() => setSelectedTagFilter(selectedTagFilter === 'STARRED' ? 'ALL' : 'STARRED')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors flex items-center space-x-1 cursor-pointer ${
                    selectedTagFilter === 'STARRED'
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>Đã Đánh Dấu ({starredCardIds.length})</span>
                </button>
                {uniqueTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTagFilter(t)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedTagFilter === t
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {t} ({tagCounts[t] || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Cards List */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2 bg-[#162032]">
              {filteredCardItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  {selectedTagFilter === 'STARRED'
                    ? 'Bạn chưa đánh dấu sao thẻ nào. Hãy bấm biểu tượng ngôi sao trên thẻ để lưu lại!'
                    : 'Không tìm thấy thẻ nào phù hợp từ khóa.'}
                </div>
              ) : (
                filteredCardItems.map(({ card, idx }) => {
                  const isCurrent = idx === currentIndex;
                  const isStarred = starredCardIds.includes(card.id !== undefined ? card.id : idx);
                  const srs = getCardSrs(
                    card.originalDeckId || course.id,
                    card.originalCardIndex !== undefined ? card.originalCardIndex : idx
                  );
                  return (
                    <div
                      key={idx}
                      onClick={() => handleJumpToCard(idx)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                          : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-slate-400 flex items-center space-x-1">
                          {isStarred && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                          <span>#{idx + 1} {card.tag ? `• ${card.tag}` : ''}</span>
                        </span>
                        {isCurrent ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Đang xem
                          </span>
                        ) : srs.totalReviews > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Đã ôn {srs.totalReviews} lần
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            Thẻ mới
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-2 leading-relaxed">
                        {card.front}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-[#111827] border-t border-slate-700 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Hiển thị {filteredCardItems.length}/{cards.length} thẻ
              </span>
              <button
                onClick={() => setTopicDrawerOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-700 text-white font-bold text-xs hover:bg-slate-600 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
