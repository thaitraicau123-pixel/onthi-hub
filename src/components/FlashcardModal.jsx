import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCw,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Sparkles,
  Lock,
  CheckCircle2,
  HelpCircle,
  Maximize2,
  Minimize2,
  Layers,
  Search,
  Scissors,
  Bot,
  Copy,
  Check,
  Play,
  Pause,
  Star,
  Headphones,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { exportAnkiDeckFile, printSummaryGuide, printFlashcardCutoutSheet, playSound } from '../utils/storage';
import { recordStudyAction, completeDailyQuest } from '../utils/gamification';
import { explainFlashcardWithAi } from '../utils/aiTutor';
import { recordCardReview, getNextIntervalPreview, getCardSrs } from '../utils/spacedRepetition';
import { recordMistake, markMistakeMastered } from '../utils/mistakeTracker';

export default function FlashcardModal({
  course,
  isPurchased,
  onClose,
  onBuy
}) {
  const allDeckCards = course?.previewCards?.length
    ? course.previewCards
    : (course?.cards?.length ? course.cards : (course?.sampleCards || []));

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

  const starredCards = React.useMemo(() => {
    return allDeckCards.filter((card, idx) => {
      const cardId = card.id !== undefined ? card.id : idx;
      return starredCardIds.includes(cardId);
    });
  }, [allDeckCards, starredCardIds]);

  const cards = onlyStarredMode && starredCards.length > 0 ? starredCards : allDeckCards;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [reviewedStats, setReviewedStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  // AI Tutor State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiExplanations, setAiExplanations] = useState({});
  const [aiError, setAiError] = useState('');
  const [copiedAiText, setCopiedAiText] = useState(false);

  // Audio Podcast / Auto-Play Hands-Free Runner State
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlaySeconds, setAutoPlaySeconds] = useState(3);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isSpeakingNow, setIsSpeakingNow] = useState(false);

  const toggleStarCurrentCard = (e) => {
    e?.stopPropagation?.();
    const currentCard = cards[currentIndex] || {};
    const cardId = currentCard.id !== undefined ? currentCard.id : currentIndex;
    setStarredCardIds((prev) => {
      const isStarred = prev.includes(cardId);
      const next = isStarred ? prev.filter((id) => id !== cardId) : [...prev, cardId];
      try {
        localStorage.setItem(starredKey, JSON.stringify(next));
      } catch (err) {}
      playSound('click');
      return next;
    });
  };

  // Topic Drawer, Search, and Fullscreen State
  const [topicDrawerOpen, setTopicDrawerOpen] = useState(false);
  const [topicSearchTerm, setTopicSearchTerm] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('ALL');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalContainerRef = React.useRef(null);

  // Calculate unique tags & count
  const tagCounts = React.useMemo(() => {
    const counts = {};
    cards.forEach((c) => {
      const tag = (c.tag || 'Khác').trim();
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return counts;
  }, [cards]);

  const uniqueTags = React.useMemo(() => Object.keys(tagCounts), [tagCounts]);

  const filteredCardItems = React.useMemo(() => {
    return cards
      .map((card, idx) => ({ card, idx }))
      .filter(({ card, idx }) => {
        const cardId = card.id !== undefined ? card.id : idx;
        if (selectedTagFilter === 'STARRED') {
          return starredCardIds.includes(cardId);
        }
        const tag = (card.tag || 'Khác').trim();
        if (selectedTagFilter !== 'ALL' && tag !== selectedTagFilter) {
          return false;
        }
        if (!topicSearchTerm.trim()) return true;
        const q = topicSearchTerm.toLowerCase();
        return (
          (card.front || '').toLowerCase().includes(q) ||
          (card.back || '').toLowerCase().includes(q) ||
          tag.toLowerCase().includes(q)
        );
      });
  }, [cards, selectedTagFilter, topicSearchTerm, starredCardIds]);

  const handleJumpToCard = (targetIdx) => {
    playSound('flip');
    setCurrentIndex(targetIdx);
    setIsFlipped(false);
    setTopicDrawerOpen(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalContainerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const currentCard = cards[currentIndex] || {};
  const currentCardId = currentCard.id !== undefined ? currentCard.id : currentIndex;
  const isCurrentCardStarred = starredCardIds.includes(currentCardId);
  const targetDeckId = currentCard.originalDeckId || course.id;
  const targetCardIndex = currentCard.originalCardIndex !== undefined ? currentCard.originalCardIndex : currentIndex;
  const currentSrs = getCardSrs(targetDeckId, targetCardIndex);

  const againInterval = getNextIntervalPreview(targetDeckId, targetCardIndex, 'again');
  const hardInterval = getNextIntervalPreview(targetDeckId, targetCardIndex, 'hard');
  const goodInterval = getNextIntervalPreview(targetDeckId, targetCardIndex, 'good');
  const easyInterval = getNextIntervalPreview(targetDeckId, targetCardIndex, 'easy');

  // Reset flip when navigating
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

    if (aiExplanations[currentIndex]) {
      return;
    }

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
      } else if (e.key === 's' || e.key === 'S') {
        toggleStarCurrentCard();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length, isFlipped, currentCardId, starredCardIds]);

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

  // Audio pronunciation using native Web Speech Synthesis
  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!text) return;
    
    // Clean markdown / bullet icons for natural voice
    const cleanText = text.replace(/📌|💡|✨|🎯|✅|❌|👉|⭐|#|\*/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Auto detect language
    if (course.id?.includes('ielts') || course.id?.includes('toeic')) {
      utterance.lang = 'en-US';
    } else if (course.id?.includes('jlpt')) {
      utterance.lang = 'ja-JP';
    } else if (course.id?.includes('hsk')) {
      utterance.lang = 'zh-CN';
    } else {
      utterance.lang = 'vi-VN';
    }

    utterance.rate = speechRate || 1.0;
    utterance.onstart = () => setIsSpeakingNow(true);
    utterance.onend = () => setIsSpeakingNow(false);
    utterance.onerror = () => setIsSpeakingNow(false);
    window.speechSynthesis.speak(utterance);
  };

  // Audio Podcast Hands-Free runner effect
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

  return (
    <div
      ref={modalContainerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto ${
        isFullscreen ? '!p-0' : ''
      }`}
    >
      <div
        className={`relative w-full ${
          isFullscreen ? 'max-w-none h-full !rounded-none' : 'max-w-3xl rounded-3xl max-h-[92vh]'
        } bg-white shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-spring-3d`}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              {currentIndex + 1}/{cards.length}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                  {course.title}
                </h4>
                {currentSrs.totalReviews > 0 ? (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 shrink-0">
                    🧠 SM-2: Đã ôn {currentSrs.totalReviews} lần • Chu kỳ {currentSrs.intervalDays}d
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
                    ✨ Thẻ Mới
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {currentCard.tag || 'Thẻ Flashcard Anki'} • Dùng phím Space để lật thẻ
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* 1. Podcast Hands-free Audio Button */}
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
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                isAutoPlaying
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white border-indigo-700 shadow-md ring-2 ring-sky-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Chế độ Podcast tự động đọc câu hỏi & đáp án rảnh tay"
            >
              <Headphones className={`w-3.5 h-3.5 ${isAutoPlaying ? 'animate-bounce text-white' : 'text-indigo-600'}`} />
              <span className="hidden sm:inline">{isAutoPlaying ? 'Đang Phát' : '🎧 Podcast Thụ Động'}</span>
            </button>

            {/* 2. Starred Cards Study Filter */}
            <button
              onClick={() => {
                if (starredCardIds.length === 0) {
                  alert('⭐ Bạn chưa đánh dấu sao thẻ nào! Hãy bấm biểu tượng ngôi sao ⭐ trên góc bất kỳ thẻ nào để ghim lại câu khó và ôn cấp tốc.');
                  return;
                }
                const nextMode = !onlyStarredMode;
                setOnlyStarredMode(nextMode);
                setCurrentIndex(0);
                setIsFlipped(false);
                playSound('flip');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                onlyStarredMode
                  ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm font-extrabold ring-2 ring-amber-300'
                  : starredCardIds.length > 0
                  ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
              title="Bật/Tắt chế độ chỉ ôn các thẻ quan trọng đã đánh dấu sao ⭐"
            >
              <Star className={`w-3.5 h-3.5 ${onlyStarredMode || starredCardIds.length > 0 ? 'fill-amber-400 text-amber-600' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {onlyStarredMode ? `Đang Ôn Sao (${cards.length})` : `Thẻ Sao (${starredCardIds.length})`}
              </span>
            </button>

            {/* Auto-speak toggle */}
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`px-2 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 border transition-colors cursor-pointer ${
                autoSpeak
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
              title="Tự động phát âm thanh mỗi khi lật thẻ"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            {isPurchased && (
              <>
                <button
                  onClick={() => exportAnkiDeckFile(course.title, cards)}
                  className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200"
                  title="Xuất file .txt nhập vào Anki"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Anki</span>
                </button>
                <button
                  onClick={() => printFlashcardCutoutSheet(course)}
                  className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200"
                  title="In bảng cắt thẻ giấy A4"
                >
                  <Scissors className="w-3.5 h-3.5 text-indigo-600" />
                  <span>In A4</span>
                </button>
              </>
            )}

            <button
              onClick={() => setTopicDrawerOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
              title="Mục lục các chủ đề và danh sách thẻ"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Mục Lục</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors hidden sm:inline-flex cursor-pointer"
              title={isFullscreen ? 'Thoát toàn màn hình' : 'Học toàn màn hình (Focus Mode)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Banner if in Starred-Only mode */}
        {onlyStarredMode && (
          <div className="px-5 py-1.5 bg-amber-50 border-b border-amber-200 text-amber-900 flex items-center justify-between text-xs font-semibold animate-fade-in">
            <div className="flex items-center space-x-2">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              <span>Đang trong chế độ <strong>Ôn Cấp Tốc Các Thẻ Đã Ghim Sao ({cards.length} thẻ)</strong></span>
            </div>
            <button
              onClick={() => {
                setOnlyStarredMode(false);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="text-[11px] text-amber-800 underline hover:text-amber-950 font-bold cursor-pointer"
            >
              Quay lại toàn bộ ({allDeckCards.length} thẻ)
            </button>
          </div>
        )}

        {/* Enhanced Audio Podcast Mini-Player Strip */}
        {isAutoPlaying && (
          <div className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-800/50 text-white flex flex-wrap items-center justify-between gap-3 text-xs shadow-inner animate-fade-in">
            
            {/* Left: Waveform animation + State status */}
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4 text-sky-300 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sky-200 truncate">
                    🎧 Podcast Học Thụ Động • Thẻ {currentIndex + 1}/{cards.length}
                  </span>
                  {/* Sound Wave Bars */}
                  <div className="flex items-end space-x-0.5 h-3 shrink-0">
                    <span className="w-1 bg-sky-400 rounded-full animate-bounce h-2"></span>
                    <span className="w-1 bg-indigo-400 rounded-full animate-bounce h-3.5 delay-75"></span>
                    <span className="w-1 bg-pink-400 rounded-full animate-bounce h-2.5 delay-150"></span>
                    <span className="w-1 bg-sky-300 rounded-full animate-bounce h-3 delay-100"></span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  {isFlipped ? '🔊 Đang đọc: Mặt sau (Đáp án & Căn cứ)' : '🔊 Đang đọc: Mặt trước (Câu hỏi)'}
                </p>
              </div>
            </div>

            {/* Right: Controls (Play/Pause, Rate, Interval) */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 ml-auto">
              {/* Play / Pause Toggle */}
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsSpeakingNow(false);
                }}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
                title="Tạm dừng chế độ Podcast"
              >
                <Pause className="w-3 h-3 fill-white" />
                <span>Dừng</span>
              </button>

              {/* Speed rate selector */}
              <div className="flex items-center space-x-1 text-[11px] bg-black/30 px-2 py-0.5 rounded-md border border-white/10">
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

              {/* Delay timer selector */}
              <div className="hidden sm:flex items-center space-x-1 text-[11px] bg-black/30 px-2 py-0.5 rounded-md border border-white/10">
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

        {/* Preview Notice Bar for Non-purchased */}
        {!isPurchased && (
          <div className="px-5 py-2 bg-[#fbf3db] border-b border-[#f4e4b7] flex items-center justify-between gap-3 text-xs text-[#976d57]">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-[#cc782f] shrink-0" />
              <span>
                Đang xem thử <strong>{cards.length} thẻ mẫu</strong>. Trọn bộ gồm <strong>350+ thẻ</strong> và file tải về.
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onBuy(course);
              }}
              className="px-3 py-1 font-medium text-white bg-[#cc782f] hover:bg-[#b56722] rounded-md shrink-0 shadow-2xs cursor-pointer"
            >
              Mở Khóa Toàn Bộ ({course.priceXu || 25} Xu)
            </button>
          </div>
        )}

        {/* Card Body - 3D Flip Area */}
        <div className="p-4 sm:p-8 flex-1 flex flex-col items-center justify-center bg-[#fbfbfa] min-h-[340px] sm:min-h-[400px]">
          
          <div
            onClick={toggleFlip}
            className="w-full max-w-xl h-72 sm:h-80 cursor-pointer perspective-1000 select-none group focus:outline-none"
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
              
              {/* Front Side */}
              <div
                className={`absolute inset-0 backface-hidden p-6 sm:p-8 flex flex-col justify-between rounded-2xl bg-white border border-[#e9e9e8] shadow-xs transition-opacity duration-200 ${
                  isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#787774] font-medium uppercase tracking-wider">
                  <span className="notion-tag notion-tag-gray text-[10px]">
                    Mặt trước (Câu hỏi / Từ khóa)
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarCurrentCard();
                      }}
                      className="p-1.5 hover:bg-[#f7f6f5] rounded-lg transition-colors cursor-pointer"
                      title={isCurrentCardStarred ? 'Bỏ đánh dấu sao' : 'Đánh dấu sao thẻ này (quan trọng)'}
                    >
                      <Star className={`w-4 h-4 ${isCurrentCardStarred ? 'fill-amber-400 text-amber-500' : 'text-[#9b9a97] hover:text-amber-400'}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(currentCard.front);
                      }}
                      className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-[#f7f6f5] rounded-lg transition-colors cursor-pointer"
                      title="Phát âm thanh"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="my-auto text-center px-3 py-2 max-h-[170px] overflow-y-auto">
                  <p className="text-lg sm:text-2xl font-bold text-[#37352f] leading-snug whitespace-pre-line">
                    {currentCard.front || (cards.length === 0 ? 'Bộ thẻ chưa có nội dung' : 'Thẻ trống')}
                  </p>
                </div>

                <div className="text-center text-xs text-[#787774] flex items-center justify-center space-x-1.5 font-normal">
                  <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-[#2383e2]" />
                  <span>Chạm hoặc bấm [Phím Cách] để lật đáp án</span>
                </div>
              </div>

              {/* Back Side */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 p-6 sm:p-8 flex flex-col justify-between rounded-2xl bg-white border-2 border-[#2383e2]/40 shadow-xs transition-opacity duration-200 ${
                  isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider">
                  <span className="notion-tag notion-tag-blue text-[10px]">
                    Mặt sau (Giải thích / Đáp án)
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarCurrentCard();
                      }}
                      className="p-1.5 hover:bg-[#f7f6f5] rounded-lg transition-colors cursor-pointer"
                      title={isCurrentCardStarred ? 'Bỏ đánh dấu sao' : 'Đánh dấu sao thẻ này (quan trọng)'}
                    >
                      <Star className={`w-4 h-4 ${isCurrentCardStarred ? 'fill-amber-400 text-amber-500' : 'text-[#9b9a97] hover:text-amber-400'}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(currentCard.back);
                      }}
                      className="p-1.5 text-[#2383e2] hover:bg-[#f7f6f5] rounded-lg transition-colors cursor-pointer"
                      title="Phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="my-auto py-2 max-h-[170px] overflow-y-auto pr-1">
                  <div className="text-sm sm:text-base text-[#37352f] leading-relaxed whitespace-pre-line font-normal text-left sm:text-center">
                    {currentCard.back || (cards.length === 0 ? 'Chưa có đáp án' : 'Trống')}
                  </div>
                </div>

                <div className="text-center sm:text-right text-[11px] text-[#2383e2] font-medium flex items-center justify-center sm:justify-end space-x-1">
                  <RotateCw className="w-3 h-3 text-[#2383e2]" />
                  <span>Chạm để lật lại mặt trước</span>
                </div>
              </div>

            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={goToPrev}
              className="p-2 rounded-full bg-white border border-[#e9e9e8] text-[#787774] hover:text-[#37352f] hover:bg-[#f7f6f5] transition-colors shadow-2xs cursor-pointer"
              title="Thẻ trước [Phím Mũi tên trái]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-medium text-[#787774]">
              {cards.length > 0 ? `${currentIndex + 1} / ${cards.length}` : '0 / 0'}
            </span>
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white border border-[#e9e9e8] text-[#787774] hover:text-[#37352f] hover:bg-[#f7f6f5] transition-colors shadow-2xs cursor-pointer"
              title="Thẻ tiếp theo [Phím Mũi tên phải]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Ask AI Tutor Button */}
          <div className="mt-3 flex items-center space-x-2">
            <button
              onClick={handleAskAiTutor}
              className="px-3.5 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-medium shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Hỏi Trợ Lý AI Chuyên Gia (Bản Chất & Mẹo Nhớ)</span>
            </button>
          </div>

        </div>

        {/* Footer: Spaced Repetition Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white">
          <div className="text-center mb-2.5">
            <span className="text-xs text-slate-400 font-medium">
              Đánh giá mức độ ghi nhớ (Spaced Repetition):
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-xl mx-auto">
            
            <button
              onClick={() => handleRate('again')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition-colors"
            >
              <span className="text-xs sm:text-sm font-bold">Học Lại</span>
              <span className="text-[10px] text-rose-500 font-bold hidden sm:inline">(Phím 1 • {againInterval})</span>
            </button>

            <button
              onClick={() => handleRate('hard')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 transition-colors"
            >
              <span className="text-xs sm:text-sm font-bold">Khó</span>
              <span className="text-[10px] text-amber-500 font-bold hidden sm:inline">(Phím 2 • {hardInterval})</span>
            </button>

            <button
              onClick={() => handleRate('good')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 transition-colors"
            >
              <span className="text-xs sm:text-sm font-bold">Tốt</span>
              <span className="text-[10px] text-blue-500 font-bold hidden sm:inline">(Phím 3 • {goodInterval})</span>
            </button>

            <button
              onClick={() => handleRate('easy')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition-colors"
            >
              <span className="text-xs sm:text-sm font-bold">Dễ Nhớ</span>
              <span className="text-[10px] text-emerald-600 font-bold hidden sm:inline">(Phím 4 • {easyInterval})</span>
            </button>

          </div>
        </div>

      </div>

      {/* AI Tutor Slide-over Drawer / Modal */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] bg-white rounded-2xl border border-[#e9e9e8] shadow-2xl overflow-hidden flex flex-col text-[#37352f]">
            
            {/* Drawer Header */}
            <div className="px-5 py-3.5 bg-[#fbfbfa] text-[#37352f] flex items-center justify-between border-b border-[#e9e9e8]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e7f3f8] text-[#2b7aa1] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-tight flex items-center space-x-1.5">
                    <span>Trợ Lý Gia Sư AI OnThiHub</span>
                    <span className="notion-tag notion-tag-blue text-[10px]">
                      Pro Turbo
                    </span>
                  </h4>
                  <p className="text-[11px] text-[#787774] font-normal">
                    Phân tích bản chất, mẹo nhớ siêu tốc & bẫy đề thi
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                {aiExplanations[currentIndex] && (
                  <button
                    onClick={handleCopyAiText}
                    className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-[#f0efed] rounded-lg transition-colors cursor-pointer"
                    title="Copy nội dung giải thích"
                  >
                    {copiedAiText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={() => setAiDrawerOpen(false)}
                  className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-[#f0efed] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs sm:text-sm">
              
              {/* Card Context Recap */}
              <div className="p-3 bg-[#fbfbfa] rounded-xl border border-[#e9e9e8]">
                <span className="notion-tag notion-tag-gray text-[10px]">
                  NỘI DUNG THẺ ĐANG HỌC
                </span>
                <p className="mt-1 font-semibold text-[#37352f]">
                  {currentCard.front}
                </p>
                <div className="mt-1 text-xs text-[#787774] whitespace-pre-line border-t border-[#f0efed] pt-1">
                  {currentCard.back}
                </div>
              </div>

              {/* AI Content Loading State */}
              {isAiLoading && (
                <div className="py-10 flex flex-col items-center justify-center space-y-2.5">
                  <div className="w-8 h-8 border-3 border-[#2383e2] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-[#787774] animate-pulse">
                    Đang kết nối hệ thống AI OnThiHub phân tích bẫy thi & sáng tác mẹo nhớ...
                  </p>
                </div>
              )}

              {/* AI Error */}
              {aiError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {aiError}
                </div>
              )}

              {/* AI Explanation Formatted Result */}
              {aiExplanations[currentIndex] && (
                <div className="p-4 bg-white rounded-xl border border-[#e9e9e8] text-xs sm:text-sm text-[#37352f] leading-relaxed whitespace-pre-line space-y-2">
                  {aiExplanations[currentIndex]}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-5 py-3 bg-[#fbfbfa] border-t border-[#e9e9e8] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#787774]">
                💡 Nhớ nhanh theo phương pháp Spaced Repetition (Lặp lại ngắt quãng)
              </span>
              <button
                onClick={() => setAiDrawerOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-[#37352f] hover:bg-[#201f1d] text-white text-xs font-medium cursor-pointer"
              >
                Đóng lại
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Topic & Concept Explorer Drawer */}
      {topicDrawerOpen && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left border-l border-[#e9e9e8] text-[#37352f]">
            
            {/* Drawer Header */}
            <div className="px-5 py-3.5 border-b border-[#e9e9e8] bg-[#fbfbfa] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e7f3f8] text-[#2b7aa1] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#37352f]">Mục Lục & Sơ Đồ Chủ Đề</h4>
                  <p className="text-[11px] text-[#787774]">
                    Tổng cộng {cards.length} thẻ ghi nhớ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTopicDrawerOpen(false)}
                className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-[#f0efed] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-3.5 bg-[#fbfbfa] border-b border-[#e9e9e8] space-y-2.5">
              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#9b9a97] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={topicSearchTerm}
                  onChange={(e) => setTopicSearchTerm(e.target.value)}
                  placeholder="Tìm từ khóa câu hỏi, khái niệm..."
                  className="w-full pl-8 pr-7 py-1.5 bg-white border border-[#e9e9e8] rounded-lg text-xs text-[#37352f] placeholder-[#9b9a97] focus:outline-none focus:border-[#2383e2] transition-colors"
                />
                {topicSearchTerm && (
                  <button
                    onClick={() => setTopicSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9b9a97] hover:text-[#37352f] text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Tag Badges Bar */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedTagFilter('ALL')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedTagFilter === 'ALL'
                      ? 'bg-[#37352f] text-white shadow-2xs'
                      : 'bg-white text-[#5a5751] border border-[#e9e9e8] hover:bg-[#f0efed]'
                  }`}
                >
                  Tất cả ({cards.length})
                </button>
                <button
                  onClick={() => setSelectedTagFilter(selectedTagFilter === 'STARRED' ? 'ALL' : 'STARRED')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors flex items-center space-x-1 cursor-pointer ${
                    selectedTagFilter === 'STARRED'
                      ? 'bg-[#fbf3db] text-[#976d57] border border-[#f4e4b7] font-semibold'
                      : 'bg-white text-[#787774] border border-[#e9e9e8] hover:bg-[#f0efed]'
                  }`}
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>Đã Đánh Dấu ({starredCardIds.length})</span>
                </button>
                {uniqueTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTagFilter(t)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedTagFilter === t
                        ? 'bg-[#2383e2] text-white shadow-2xs'
                        : 'bg-white text-[#5a5751] border border-[#e9e9e8] hover:bg-[#f0efed]'
                    }`}
                  >
                    {t} ({tagCounts[t] || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Cards List */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2 bg-[#ffffff]">
              {filteredCardItems.length === 0 ? (
                <div className="py-12 text-center text-[#9b9a97] text-xs font-normal">
                  {selectedTagFilter === 'STARRED'
                    ? 'Bạn chưa đánh dấu sao thẻ nào. Hãy bấm biểu tượng ngôi sao trên thẻ để lưu lại thẻ quan trọng!'
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
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-[#e7f3f8] border-[#2383e2] ring-1 ring-[#2383e2]'
                          : 'bg-white border-[#e9e9e8] hover:border-[#c5c4c0] hover:bg-[#fbfbfa]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-[#787774] flex items-center space-x-1">
                          {isStarred && (
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          )}
                          <span>#{idx + 1} {card.tag ? `• ${card.tag}` : ''}</span>
                        </span>
                        {isCurrent ? (
                          <span className="notion-tag notion-tag-blue text-[10px]">
                            Đang xem
                          </span>
                        ) : srs.totalReviews > 0 ? (
                          <span className="notion-tag notion-tag-purple text-[10px]">
                            Đã ôn {srs.totalReviews} lần
                          </span>
                        ) : (
                          <span className="notion-tag notion-tag-yellow text-[10px]">
                            Thẻ mới
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#37352f] line-clamp-2 leading-relaxed">
                        {card.front}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-[#fbfbfa] border-t border-[#e9e9e8] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#787774]">
                Hiển thị {filteredCardItems.length}/{cards.length} thẻ
              </span>
              <button
                onClick={() => setTopicDrawerOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-[#37352f] text-white font-medium text-xs hover:bg-[#201f1d] transition-colors cursor-pointer"
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
