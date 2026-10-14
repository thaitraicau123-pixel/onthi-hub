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
  Star
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
  const cards = course?.previewCards?.length
    ? course.previewCards
    : (course?.cards?.length ? course.cards : (course?.sampleCards || []));
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

  // Auto-Play Hands-Free Runner State
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlaySeconds, setAutoPlaySeconds] = useState(3);

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
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Auto detect language
    if (course.id.includes('ielts') || course.id.includes('toeic')) {
      utterance.lang = 'en-US';
    } else if (course.id.includes('jlpt')) {
      utterance.lang = 'ja-JP';
    } else if (course.id.includes('hsk')) {
      utterance.lang = 'zh-CN';
    } else {
      utterance.lang = 'vi-VN';
    }

    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Auto-play hands-free runner effect
  useEffect(() => {
    if (!isAutoPlaying) return;

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
        setCurrentIndex((prev) => (prev + 1) % cards.length);
      }, autoPlaySeconds * 1000);
      return () => clearTimeout(nextTimer);
    }
  }, [isAutoPlaying, currentIndex, isFlipped, autoPlaySeconds]);

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

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const next = !isAutoPlaying;
                setIsAutoPlaying(next);
                if (next) playSound('flip');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 border transition-all ${
                isAutoPlaying
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Chế độ tự động lật & đọc thẻ rảnh tay"
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />}
              <span className="hidden sm:inline">{isAutoPlaying ? 'Tạm Dừng' : '▶ Rảnh Tay'}</span>
            </button>

            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 border transition-colors ${
                autoSpeak
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
              title="Tự động phát âm khi lật thẻ"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{autoSpeak ? 'Tự Đọc: BẬT' : 'Tự Đọc: TẮT'}</span>
            </button>

            {isPurchased && (
              <>
                <button
                  onClick={() => exportAnkiDeckFile(course.title, cards)}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200"
                  title="Xuất file .txt nhập vào Anki"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Anki</span>
                </button>
                <button
                  onClick={() => printFlashcardCutoutSheet(course)}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200"
                  title="In bảng cắt thẻ giấy A4"
                >
                  <Scissors className="w-3.5 h-3.5 text-indigo-600" />
                  <span>In Thẻ Cắt A4</span>
                </button>
                <button
                  onClick={() => printSummaryGuide(course)}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200"
                  title="In tài liệu hoặc xuất PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In / PDF</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                setTopicDrawerOpen(true);
                setSelectedTagFilter(selectedTagFilter === 'STARRED' ? 'ALL' : 'STARRED');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 border transition-colors ${
                starredCardIds.length > 0
                  ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
              title="Xem danh sách các thẻ đã đánh dấu sao quan trọng"
            >
              <Star className={`w-3.5 h-3.5 ${starredCardIds.length > 0 ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Sao ({starredCardIds.length})</span>
            </button>

            <button
              onClick={() => setTopicDrawerOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
              title="Mục lục các chủ đề và danh sách thẻ"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Chủ Đề ({uniqueTags.length})</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors hidden sm:inline-flex"
              title={isFullscreen ? 'Thoát toàn màn hình' : 'Học toàn màn hình (Focus Mode)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hands-Free Auto-Play Active Notification Bar */}
        {isAutoPlaying && (
          <div className="px-5 py-2 bg-gradient-to-r from-rose-500 via-[#f02c85] to-pink-600 text-white flex items-center justify-between text-xs font-bold animate-fade-in shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>🎧 Đang chạy Chế độ Rảnh Tay (Tự động lật & đọc thẻ sau {autoPlaySeconds}s)</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px]">
              <span>Tốc độ:</span>
              {[2, 3, 5].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setAutoPlaySeconds(sec)}
                  className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
                    autoPlaySeconds === sec
                      ? 'bg-white text-rose-600 font-black shadow-xs'
                      : 'text-rose-100 hover:bg-white/20'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preview Notice Bar for Non-purchased */}
        {!isPurchased && (
          <div className="px-5 py-2.5 bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border-b border-amber-200/70 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-amber-900 font-medium">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Đang xem thử <strong>{cards.length} thẻ mẫu</strong>. Trọn bộ gồm <strong>350+ thẻ</strong> và file tải về.
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onBuy(course);
              }}
              className="px-3 py-1 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shrink-0 shadow-xs"
            >
              Mở Khóa Toàn Bộ ({course.priceXu || 25} Xu)
            </button>
          </div>
        )}

        {/* Card Body - 3D Flip Area */}
        <div className="p-4 sm:p-8 flex-1 flex flex-col items-center justify-center bg-slate-50 min-h-[340px] sm:min-h-[400px]">
          
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
                className={`absolute inset-0 backface-hidden p-6 sm:p-8 flex flex-col justify-between rounded-3xl bg-white border-2 border-slate-200 shadow-xl transition-opacity duration-200 ${
                  isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200 text-[11px]">
                    Mặt trước (Câu hỏi / Từ khóa)
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarCurrentCard();
                      }}
                      className="p-2 hover:bg-amber-50 rounded-full transition-colors cursor-pointer"
                      title={isCurrentCardStarred ? 'Bỏ đánh dấu sao' : 'Đánh dấu sao thẻ này (quan trọng)'}
                    >
                      <Star className={`w-4 h-4 ${isCurrentCardStarred ? 'fill-amber-400 text-amber-500' : 'text-slate-300 hover:text-amber-400'}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(currentCard.front);
                      }}
                      className="p-2 hover:text-[#f02c85] hover:bg-pink-50 rounded-full transition-colors cursor-pointer"
                      title="Phát âm thanh"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="my-auto text-center px-3 py-2 max-h-[170px] overflow-y-auto">
                  <p className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug whitespace-pre-line">
                    {currentCard.front || (cards.length === 0 ? 'Bộ thẻ chưa có nội dung' : 'Thẻ trống')}
                  </p>
                </div>

                <div className="text-center text-xs text-slate-400 flex items-center justify-center space-x-1.5 font-medium">
                  <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-[#f02c85]" />
                  <span>Chạm hoặc bấm [Phím Cách] để lật đáp án</span>
                </div>
              </div>

              {/* Back Side */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 p-6 sm:p-8 flex flex-col justify-between rounded-3xl bg-white border-2 border-[#f02c85]/40 shadow-xl shadow-pink-100/50 transition-opacity duration-200 ${
                  isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                  <span className="px-2.5 py-1 rounded-full bg-pink-50 text-[#f02c85] font-bold border border-pink-200 text-[11px]">
                    Mặt sau (Giải thích / Đáp án)
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarCurrentCard();
                      }}
                      className="p-2 hover:bg-amber-50 rounded-full transition-colors cursor-pointer"
                      title={isCurrentCardStarred ? 'Bỏ đánh dấu sao' : 'Đánh dấu sao thẻ này (quan trọng)'}
                    >
                      <Star className={`w-4 h-4 ${isCurrentCardStarred ? 'fill-amber-400 text-amber-500' : 'text-pink-300 hover:text-amber-400'}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(currentCard.back);
                      }}
                      className="p-2 text-[#f02c85] hover:bg-pink-50 rounded-full transition-colors cursor-pointer"
                      title="Phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="my-auto py-2 max-h-[170px] overflow-y-auto pr-1">
                  <div className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line font-normal text-left sm:text-center">
                    {currentCard.back || (cards.length === 0 ? 'Chưa có đáp án' : 'Trống')}
                  </div>
                </div>

                <div className="text-center sm:text-right text-[11px] text-[#f02c85] font-semibold flex items-center justify-center sm:justify-end space-x-1">
                  <RotateCw className="w-3 h-3 text-[#f02c85]" />
                  <span>Chạm để lật lại mặt trước</span>
                </div>
              </div>

            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={goToPrev}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-xs"
              title="Thẻ trước [Phím Mũi tên trái]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-500">
              {cards.length > 0 ? `${currentIndex + 1} / ${cards.length}` : '0 / 0'}
            </span>
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-xs"
              title="Thẻ tiếp theo [Phím Mũi tên phải]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Ask AI Tutor Button */}
          <div className="mt-3 flex items-center space-x-2">
            <button
              onClick={handleAskAiTutor}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 via-[#f02c85] to-pink-500 hover:brightness-110 text-white text-xs font-black shadow-md flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] bg-[#fcf7ec] rounded-3xl border-2 border-[#eadfcb] shadow-2xl overflow-hidden flex flex-col text-[#28071a]">
            
            {/* Drawer Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#240618] to-[#450a29] text-white flex items-center justify-between border-b border-[#f02c85]/30">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#f02c85] flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight flex items-center space-x-1.5">
                    <span>Trợ Lý Gia Sư AI OnThiHub</span>
                    <span className="text-[10px] bg-pink-500/30 text-pink-200 border border-pink-400/40 px-2 py-0.2 rounded-full font-bold">
                      Pro Turbo
                    </span>
                  </h4>
                  <p className="text-[11px] text-pink-200/80 font-medium">
                    Phân tích bản chất, mẹo nhớ siêu tốc & bẫy đề thi
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {aiExplanations[currentIndex] && (
                  <button
                    onClick={handleCopyAiText}
                    className="p-2 text-pink-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    title="Copy nội dung giải thích"
                  >
                    {copiedAiText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={() => setAiDrawerOpen(false)}
                  className="p-2 text-pink-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
              
              {/* Card Context Recap */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#eadfcb] shadow-2xs">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-pink-100 text-[#f02c85]">
                  NỘI DUNG THẺ ĐANG HỌC
                </span>
                <p className="mt-1 font-black text-[#28071a]">
                  {currentCard.front}
                </p>
                <div className="mt-1.5 text-xs text-[#7a5a6b] whitespace-pre-line border-t border-[#eadfcb]/60 pt-1.5">
                  {currentCard.back}
                </div>
              </div>

              {/* AI Content Loading State */}
              {isAiLoading && (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 border-4 border-[#f02c85] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-[#7a5a6b] animate-pulse">
                    Đang kết nối hệ thống AI OnThiHub phân tích bẫy thi & sáng tác mẹo nhớ...
                  </p>
                </div>
              )}

              {/* AI Error */}
              {aiError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                  {aiError}
                </div>
              )}

              {/* AI Explanation Formatted Result */}
              {aiExplanations[currentIndex] && (
                <div className="p-5 bg-white rounded-2xl border border-[#eadfcb] shadow-xs text-xs sm:text-sm text-[#28071a] leading-relaxed whitespace-pre-line font-medium space-y-2">
                  {aiExplanations[currentIndex]}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-5 py-3 bg-[#f5ecd8] border-t border-[#eadfcb] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#7a5a6b] font-bold">
                💡 Nhớ nhanh theo phương pháp Spaced Repetition (Lặp lại ngắt quãng)
              </span>
              <button
                onClick={() => setAiDrawerOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#28071a] text-white text-xs font-bold hover:bg-[#3d0c27]"
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
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
            
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-[#28071a] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#f02c85] flex items-center justify-center shadow-md">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Mục Lục & Sơ Đồ Chủ Đề</h4>
                  <p className="text-[11px] text-pink-200/80 font-medium">
                    Tổng cộng {cards.length} thẻ ghi nhớ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTopicDrawerOpen(false)}
                className="p-2 text-pink-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 bg-[#fcf7ec] border-b border-[#eadfcb] space-y-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={topicSearchTerm}
                  onChange={(e) => setTopicSearchTerm(e.target.value)}
                  placeholder="Tìm từ khóa câu hỏi, khái niệm..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#eadfcb] rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f02c85] shadow-2xs"
                />
                {topicSearchTerm && (
                  <button
                    onClick={() => setTopicSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Tag Badges Bar */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedTagFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                    selectedTagFilter === 'ALL'
                      ? 'bg-[#28071a] text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-[#eadfcb] hover:bg-slate-100'
                  }`}
                >
                  Tất cả ({cards.length})
                </button>
                <button
                  onClick={() => setSelectedTagFilter(selectedTagFilter === 'STARRED' ? 'ALL' : 'STARRED')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors flex items-center space-x-1 ${
                    selectedTagFilter === 'STARRED'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-white text-amber-800 border border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>Đã Đánh Dấu ({starredCardIds.length})</span>
                </button>
                {uniqueTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTagFilter(t)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                      selectedTagFilter === t
                        ? 'bg-[#f02c85] text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-[#eadfcb] hover:bg-slate-100'
                    }`}
                  >
                    {t} ({tagCounts[t] || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Cards List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#fdfcf9]">
              {filteredCardItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">
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
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-pink-50/80 border-[#f02c85] shadow-xs ring-1 ring-[#f02c85]'
                          : 'bg-white border-[#eadfcb] hover:border-[#d9c7ab] hover:bg-amber-50/30'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-black text-slate-400 flex items-center space-x-1">
                          {isStarred && (
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          )}
                          <span>#{idx + 1} {card.tag ? `• ${card.tag}` : ''}</span>
                        </span>
                        {isCurrent ? (
                          <span className="font-bold text-[#f02c85] bg-pink-100 px-1.5 py-0.5 rounded">
                            Đang xem
                          </span>
                        ) : srs.totalReviews > 0 ? (
                          <span className="font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                            Đã ôn {srs.totalReviews} lần
                          </span>
                        ) : (
                          <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            Thẻ mới
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed">
                        {card.front}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-[#f5ecd8] border-t border-[#eadfcb] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#7a5a6b] font-bold">
                Hiển thị {filteredCardItems.length}/{cards.length} thẻ
              </span>
              <button
                onClick={() => setTopicDrawerOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-[#28071a] text-white font-bold text-xs hover:bg-[#3d0c27] transition-colors"
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
