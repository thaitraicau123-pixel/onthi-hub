import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Sparkles,
  Lock,
  Maximize2,
  Minimize2,
  Search,
  Bot,
  Copy,
  Check,
  Star,
  Share2,
  MessageCircle,
  GitBranch,
  FolderGit2,
  Code,
  Terminal,
  Cpu,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight,
  Send,
  Zap,
  Tag,
  ShieldCheck,
  FileCode
} from 'lucide-react';
import {
  exportMarkdownFile,
  exportCsvFile,
  exportAnkiDeckFile,
  printSummaryGuide,
  playSound
} from '../utils/storage';
import { recordStudyAction, completeDailyQuest } from '../utils/gamification';
import { explainFlashcardWithAi } from '../utils/aiTutor';
import { copyFlashcardShareLink } from '../utils/shareLink';
import confetti from 'canvas-confetti';

/**
 * Intelligent parser for MMO prompt data
 * Extracts raw prompt, parameters (--ar, --motion, camera), and deployment tips
 */
function parsePromptDetails(text) {
  if (!text) {
    return {
      rawPrompt: '',
      parametersText: '',
      tipsText: '',
      flags: {},
      rawFull: ''
    };
  }

  let rawPrompt = text;
  let parametersText = '';
  let tipsText = '';

  // Extract PROMPT: section if present
  const promptMatch = text.match(/PROMPT:\s*([\s\S]*?)(?=\n\n(?:📌|THAM SỐ|Mẹo|LƯU Ý)|$)/i);
  if (promptMatch) {
    rawPrompt = promptMatch[1].trim();
  }

  // Extract THAM SỐ section
  const paramMatch = text.match(/(?:📌\s*THAM SỐ GỢI Ý:|THAM SỐ GỢI Ý:|THAM SỐ:)\s*([\s\S]*?)(?=\n\n(?:Mẹo|LƯU Ý|Ứng dụng)|$)/i);
  if (paramMatch) {
    parametersText = paramMatch[1].trim();
  }

  // Extract Tips section
  const tipsMatch = text.match(/(?:Mẹo|LƯU Ý|Ứng dụng|Chiến lược):\s*([\s\S]*)/i);
  if (tipsMatch) {
    tipsText = tipsMatch[1].trim();
  }

  // Extract command flags like --ar 16:9, --motion 7, --v 6.0, --camera zoom-in
  const flags = {};
  const flagRegex = /--([a-zA-Z0-9_-]+)\s+([^\s-]+)/g;
  let match;
  while ((match = flagRegex.exec(text)) !== null) {
    flags[match[1]] = match[2];
  }

  return {
    rawPrompt: rawPrompt || text,
    parametersText,
    tipsText,
    flags,
    rawFull: text
  };
}

/**
 * Helper to slugify text for GitHub-like file paths
 */
function slugify(text) {
  if (!text) return 'prompt';
  return text
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 30);
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
  const allDeckCards = useMemo(() => {
    if (course?.cards?.length) {
      return course.cards;
    }
    return course?.previewCards?.length
      ? course.previewCards
      : (course?.flashcards?.length ? course.flashcards : (course?.sampleCards || []));
  }, [course]);

  // Starred Cards State with localStorage persistence
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

  // Selected Prompt Index
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialCardIndex !== null && initialCardIndex !== undefined && !isNaN(initialCardIndex)) {
      return Math.min(Math.max(0, Number(initialCardIndex)), Math.max(0, allDeckCards.length - 1));
    }
    return 0;
  });

  // UI Modes
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'specs' | 'ai'
  const [shareToast, setShareToast] = useState('');
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);

  // AI Prompt Tuning State
  const [aiExplanations, setAiExplanations] = useState({});
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [copiedAiText, setCopiedAiText] = useState(false);
  const [customPromptInput, setCustomPromptInput] = useState('');

  // Audio Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);

  const modalContainerRef = useRef(null);

  // Safe navigation bounded to cards length
  const safeIndex = Math.min(Math.max(0, currentIndex), Math.max(0, cards.length - 1));
  const currentCard = cards[safeIndex] || { front: 'Chưa có prompt', back: '', tag: 'General' };
  const currentCardId = currentCard.id !== undefined ? currentCard.id : safeIndex;
  const isCurrentCardStarred = starredCardIds.includes(currentCardId);

  // Parsed Prompt Details
  const parsedDetails = useMemo(() => {
    return parsePromptDetails(currentCard.back);
  }, [currentCard.back]);

  // Derived Repository Metadata
  const repoSlug = useMemo(() => {
    const raw = course?.title || 'prompt-skill-package';
    return slugify(raw).replace(/_+/g, '-');
  }, [course?.title]);

  const repoAuthor = course?.instructor || course?.author || 'prompt-master';

  // Toggle Star
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

  // Safe Speech Synthesis
  const handleSpeakPrompt = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const textToRead = `${currentCard.front}. Cú pháp prompt: ${parsedDetails.rawPrompt}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find((v) => v.lang.includes('vi') || v.lang.includes('VIE'));
      if (viVoice) utterance.voice = viVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // 1-Click Copy Raw Prompt (For Midjourney / Kling / Higgsfield / Flux)
  const handleCopyRawPrompt = () => {
    if (!isPurchased) {
      playSound('flip');
      if (onBuy) {
        onClose();
        onBuy(course);
      }
      return;
    }
    const text = parsedDetails.rawPrompt || currentCard.back || '';
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedRaw(true);
      playSound('success');
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
      recordStudyAction(5);
      completeDailyQuest('copy_prompt');
      setTimeout(() => setCopiedRaw(false), 2200);
    });
  };

  // 1-Click Copy Full Documentation
  const handleCopyFullDocumentation = () => {
    if (!isPurchased) {
      playSound('flip');
      if (onBuy) {
        onClose();
        onBuy(course);
      }
      return;
    }
    const fullText = `# ${currentCard.front}\n\n## PROMPT:\n${parsedDetails.rawPrompt}\n\n## THAM SỐ:\n${parsedDetails.parametersText || 'Mặc định'}\n\n## HƯỚNG DẪN TRIỂN KHAI:\n${parsedDetails.tipsText || 'Chưa có ghi chú'}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedFull(true);
      playSound('success');
      recordStudyAction(5);
      setTimeout(() => setCopiedFull(false), 2200);
    });
  };

  // AI Prompt Tuning / Customizer
  const handleAskAiOptimizer = async (customRequest = '') => {
    if (!isPurchased) {
      playSound('flip');
      if (onBuy) {
        onClose();
        onBuy(course);
      }
      return;
    }
    if (isAiLoading) return;
    setIsAiLoading(true);
    setAiError('');
    setActiveTab('ai');
    playSound('click');

    try {
      const promptQuery = customRequest
        ? `${currentCard.front} - Yêu cầu tùy biến: ${customRequest}`
        : `${currentCard.front} (Cú pháp: ${parsedDetails.rawPrompt})`;

      const result = await explainFlashcardWithAi({
        deckTitle: course.title,
        question: promptQuery,
        answer: currentCard.back,
        tag: currentCard.tag || 'Prompt Engineering'
      });

      setAiExplanations((prev) => ({
        ...prev,
        [safeIndex]: result
      }));
      playSound('success');
      recordStudyAction(10);
    } catch (err) {
      setAiError('Không thể kết nối AI lúc này. Vui lòng thử lại sau giây lát.');
      playSound('error');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Copy AI Explanation
  const handleCopyAiExplanation = () => {
    const explanation = aiExplanations[safeIndex];
    if (!explanation) return;
    navigator.clipboard.writeText(explanation).then(() => {
      setCopiedAiText(true);
      playSound('click');
      setTimeout(() => setCopiedAiText(false), 2000);
    });
  };

  // Navigation handlers
  const goToNext = () => {
    if (cards.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    playSound('flip');
  };

  const goToPrev = () => {
    if (cards.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    playSound('flip');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleCopyRawPrompt();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        toggleStarCurrentCard();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safeIndex, cards.length, parsedDetails.rawPrompt]);

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

  // Unique tags for filter pills
  const uniqueTags = useMemo(() => {
    const set = new Set();
    cards.forEach((c) => {
      if (c.tag) set.add(c.tag);
    });
    return Array.from(set);
  }, [cards]);

  // Filtered Cards for Prompt Explorer Tree
  const filteredTreeCards = useMemo(() => {
    return cards
      .map((card, idx) => ({ card, originalIndex: idx }))
      .filter(({ card, originalIndex }) => {
        const cardId = card.id !== undefined ? card.id : originalIndex;
        if (selectedTagFilter === 'STARRED') {
          return starredCardIds.includes(cardId);
        }
        if (selectedTagFilter !== 'ALL') {
          return card.tag === selectedTagFilter;
        }
        return true;
      })
      .filter(({ card }) => {
        if (!searchFilter.trim()) return true;
        const q = searchFilter.toLowerCase();
        return (
          (card.front && card.front.toLowerCase().includes(q)) ||
          (card.back && card.back.toLowerCase().includes(q)) ||
          (card.tag && card.tag.toLowerCase().includes(q))
        );
      });
  }, [cards, selectedTagFilter, searchFilter, starredCardIds]);

  // Compute file name for current card
  const currentFileName = useMemo(() => {
    const num = String(safeIndex + 1).padStart(2, '0');
    const slug = slugify(currentCard.front || 'prompt');
    return `${num}_${slug}.prompt`;
  }, [safeIndex, currentCard.front]);

  return (
    <div
      ref={modalContainerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-fade-in ${
        isFullscreen ? '!p-0' : ''
      }`}
    >
      {/* Background click to close */}
      {!isFullscreen && (
        <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
      )}

      {/* =========================================================================
          MAIN REPOSITORY CONTAINER (GITHUB / SKILL DEVELOPER HUB THEME)
          ========================================================================= */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${
          isFullscreen ? 'h-full !rounded-none' : 'max-w-6xl rounded-2xl h-[92vh]'
        } bg-[#0d1117] text-slate-200 border border-slate-700/80 shadow-[0_30px_90px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden font-sans`}
      >
        
        {/* =========================================================================
            1. REPOSITORY TOP BAR (GITHUB BREADCRUMB & METADATA BAR)
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-[#161b22] gap-2 shrink-0">
          
          {/* Left: GitHub Repo Identifier */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <FolderGit2 className="w-4 h-4" />
            </div>

            <div className="flex items-center space-x-1.5 text-xs sm:text-sm min-w-0 overflow-hidden">
              <span className="text-slate-400 font-medium hover:underline cursor-pointer truncate max-w-[110px] sm:max-w-[140px]">
                {repoAuthor}
              </span>
              <span className="text-slate-600 font-bold">/</span>
              <span className="text-white font-bold tracking-tight truncate max-w-[160px] sm:max-w-xs font-mono">
                {repoSlug}
              </span>

              {/* Public Badge */}
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300 hidden sm:inline-flex">
                Public Repo
              </span>

              {/* Branch Pill */}
              <div className="px-2 py-0.5 rounded-md text-[11px] font-mono border border-slate-700 bg-slate-800/80 text-slate-300 flex items-center space-x-1 shrink-0">
                <GitBranch className="w-3 h-3 text-indigo-400" />
                <span>main</span>
              </div>
            </div>
          </div>

          {/* Right: Repository Action Group */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 ml-auto">
            
            {/* Star Repo Button */}
            <button
              type="button"
              onClick={toggleStarCurrentCard}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                isCurrentCardStarred
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700'
              }`}
              title={isCurrentCardStarred ? 'Đã Star (Lưu prompt này)' : 'Star prompt này'}
            >
              <Star className={`w-3.5 h-3.5 ${isCurrentCardStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isCurrentCardStarred ? 'Starred' : 'Star'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 font-mono text-slate-300">
                {starredCardIds.length}
              </span>
            </button>

            {/* Direct Chat with Creator */}
            {onOpenDirectChat && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDirectChat(null, course);
                }}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Nhắn tin trực tiếp với Creator bộ Prompt này"
              >
                <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Hỏi Tác Giả</span>
              </button>
            )}

            {/* Export Dropdown / Action */}
            <button
              type="button"
              onClick={() => {
                exportMarkdownFile(course);
                playSound('success');
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Xuất toàn bộ gói Prompt ra file Markdown (.md) cho Notion / Obsidian"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export .md</span>
            </button>

            {/* Share Link */}
            <button
              type="button"
              onClick={async () => {
                const res = await copyFlashcardShareLink({
                  deckId: course.id,
                  deckTitle: course.title,
                  cardIndex: safeIndex,
                  useNativeShare: false
                });
                if (res.success) {
                  playSound('success');
                  setShareToast('Đã copy đường dẫn liên kết đến Prompt này!');
                  setTimeout(() => setShareToast(''), 3000);
                }
              }}
              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              title="Sao chép link chia sẻ Repo"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors hidden sm:inline-flex cursor-pointer"
              title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-rose-500/80 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Share Link Toast */}
        {shareToast && (
          <div className="px-4 py-2 bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {shareToast}
            </span>
            <button onClick={() => setShareToast('')} className="text-slate-400 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Preview Notice Bar for Non-Purchased Courses */}
        {!isPurchased && (
          <div className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border-b border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center space-x-2 min-w-0">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">
                🔒 <strong>Bản Quyền Master Prompt Bùi Thái AI Studio</strong> • Mở khóa ({course?.priceXu || 25} Xu) để xem toàn văn và sao chép.
              </span>
            </div>
            {onBuy && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBuy(course);
                }}
                className="px-3.5 py-1 font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shrink-0 shadow-md active:scale-95 transition-all cursor-pointer text-xs flex items-center space-x-1.5"
              >
                <Coins className="w-3.5 h-3.5 fill-slate-950" />
                <span>Mở Khóa Toàn Bộ ({course?.priceXu || 25} Xu)</span>
              </button>
            )}
          </div>
        )}

        {/* =========================================================================
            2. SPLIT VIEW: LEFT PROMPT EXPLORER TREE + RIGHT CODE CANVAS
            ========================================================================= */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* =========================================================================
              LEFT PANE: PROMPT EXPLORER & FILE TREE (30% WIDTH)
              ========================================================================= */}
          <div className="w-full md:w-80 lg:w-88 border-b md:border-b-0 md:border-r border-slate-800 bg-[#0d1117] flex flex-col shrink-0 min-h-0">
            
            {/* Search & Tag Filter Bar */}
            <div className="p-3 border-b border-slate-800/80 bg-[#161b22] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center space-x-1.5 uppercase tracking-wider text-[11px] text-slate-400 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Prompt Explorer</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {filteredTreeCards.length}/{cards.length} files
                </span>
              </div>

              {/* Instant Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Lọc file prompt, keywords..."
                  className="w-full pl-8 pr-7 py-1.5 bg-[#0d1117] border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                <button
                  onClick={() => setSelectedTagFilter('ALL')}
                  className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedTagFilter === 'ALL'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Tất cả ({cards.length})
                </button>
                <button
                  onClick={() => setSelectedTagFilter(selectedTagFilter === 'STARRED' ? 'ALL' : 'STARRED')}
                  className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap flex items-center space-x-1 transition-colors cursor-pointer ${
                    selectedTagFilter === 'STARRED'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <span>Starred ({starredCardIds.length})</span>
                </button>
                {uniqueTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTagFilter(t)}
                    className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedTagFilter === t
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Tree List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40">
              {filteredTreeCards.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-mono">
                  Không tìm thấy file prompt nào phù hợp.
                </div>
              ) : (
                filteredTreeCards.map(({ card, originalIndex }) => {
                  const isCurrent = originalIndex === safeIndex;
                  const isStarred = starredCardIds.includes(card.id !== undefined ? card.id : originalIndex);
                  const fileSlug = `${String(originalIndex + 1).padStart(2, '0')}_${slugify(card.front)}.md`;

                  return (
                    <div
                      key={originalIndex}
                      onClick={() => {
                        setCurrentIndex(originalIndex);
                        playSound('click');
                      }}
                      className={`group p-2.5 rounded-xl text-left cursor-pointer transition-all flex items-start space-x-2.5 ${
                        isCurrent
                          ? 'bg-indigo-600/15 border-l-3 border-indigo-500 text-white shadow-sm'
                          : 'hover:bg-slate-800/60 text-slate-300 border-l-3 border-transparent'
                      }`}
                    >
                      {isPurchased ? (
                        <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isCurrent ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      ) : (
                        <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400/80" />
                      )}
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                          <span className="truncate max-w-[140px] text-slate-400">
                            {fileSlug}
                          </span>
                          {isStarred && <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />}
                        </div>
                        <p className={`text-xs font-medium line-clamp-2 leading-snug ${isCurrent ? 'text-white font-semibold' : 'text-slate-300'}`}>
                          {card.front}
                        </p>
                        {card.tag && (
                          <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700/60 text-slate-400 font-mono">
                            #{card.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Tree Footer Shortcut info */}
            <div className="px-3 py-2 border-t border-slate-800/80 bg-[#161b22] text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Phím: [↑/↓] chuyển file</span>
              <span>[C] Copy Prompt</span>
            </div>
          </div>

          {/* =========================================================================
              RIGHT PANE: CODE CANVAS & TECHNICAL SPEC VIEWER (70% WIDTH)
              ========================================================================= */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#0d1117] overflow-y-auto">
            
            {/* File Path & Primary Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-2.5 border-b border-slate-800 bg-[#161b22] gap-2 shrink-0">
              
              {/* File Breadcrumb */}
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 min-w-0">
                <span className="text-slate-500">prompts /</span>
                <span className="font-bold text-white truncate max-w-xs">{currentFileName}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold hidden sm:inline">
                  Ready to Run
                </span>
              </div>

              {/* Action Tabs & 1-Click Copy Cluster */}
              <div className="flex items-center space-x-1.5 shrink-0 ml-auto">
                
                {/* 1-CLICK COPY RAW PROMPT (HERO BUTTON) */}
                {isPurchased ? (
                  <button
                    type="button"
                    onClick={handleCopyRawPrompt}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                      copiedRaw
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-400'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                    }`}
                    title="Sao chép cú pháp Prompt tiếng Anh chuẩn để paste thẳng vào AI tool"
                  >
                    {copiedRaw ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRaw ? 'Đã Copy Prompt!' : '1-Click Copy Prompt'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onBuy) onBuy(course);
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white cursor-pointer active:scale-95"
                    title="Mở khóa bản quyền để sao chép prompt"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Mở Khóa ({course?.priceXu || 25} Xu)</span>
                  </button>
                )}

                {/* Copy All Button */}
                <button
                  type="button"
                  onClick={handleCopyFullDocumentation}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1 transition-colors cursor-pointer"
                  title="Sao chép đầy đủ prompt kèm tham số & mẹo triển khai"
                >
                  {copiedFull ? <Check className="w-3 h-3 text-emerald-400" /> : <FileText className="w-3 h-3 text-slate-400" />}
                  <span className="hidden sm:inline">{copiedFull ? 'Đã Copy Full' : 'Copy Kèm Tham Số'}</span>
                </button>

                {/* Listen TTS Button */}
                <button
                  type="button"
                  onClick={handleSpeakPrompt}
                  className={`p-1.5 rounded-lg text-xs border transition-colors cursor-pointer ${
                    isSpeaking
                      ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title={isSpeaking ? 'Đang đọc... Bấm để dừng' : 'Nghe đọc kịch bản prompt'}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* View Switcher Tabs (Code View / Technical Specs / AI Tuning) */}
            <div className="px-4 sm:px-6 py-2 border-b border-slate-800 bg-[#111620] flex items-center space-x-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer transition-colors ${
                  activeTab === 'code'
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                <span>Code & Cú Pháp</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer transition-colors ${
                  activeTab === 'specs'
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                <span>Thông Số & Chiến Lược MMO</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer transition-colors ${
                  activeTab === 'ai'
                    ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 text-white border border-indigo-500/50 shadow-xs'
                    : 'text-indigo-400 hover:text-indigo-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Prompt Optimizer</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 sm:p-6 flex-1 space-y-6">
              
              {/* Prompt Title & Category Card */}
              <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {currentCard.tag || 'Prompt Thực Chiến'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      #{safeIndex + 1} of {cards.length}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                    {currentCard.front}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={toggleStarCurrentCard}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      isCurrentCardStarred
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
                    }`}
                    title="Ghim yêu thích"
                  >
                    <Star className={`w-4 h-4 ${isCurrentCardStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* ================= TAB 1: CODE & SYNTAX ================= */}
              {activeTab === 'code' && (
                <div className="space-y-4 animate-fade-in">
                  {!isPurchased ? (
                    <div className="rounded-xl border border-amber-500/30 bg-[#090d16] p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                        <Lock className="w-7 h-7" />
                      </div>
                      <div className="space-y-1.5 relative z-10">
                        <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                          BẢN QUYỀN MASTER SYSTEM PROMPT • BÙI THÁI AI STUDIO
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                          {currentCard.front}
                        </h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                          Toàn văn câu lệnh Master System Prompt v8.5 và trọn bộ <strong>{cards.length} câu lệnh Cheat Sheet</strong> được niêm phong bản quyền. Vui lòng thanh toán mở khóa bằng Xu để xem toàn văn và kích hoạt tính năng 1-Click Copy.
                        </p>
                      </div>

                      <div className="pt-2 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                        {onBuy && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onBuy(course);
                            }}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-extrabold text-xs shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
                          >
                            <Coins className="w-4 h-4 fill-slate-950" />
                            <span>Mở Khóa Toàn Bộ Gói Này ({course?.priceXu || 25} Xu)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* The Raw Code Block (GitHub Style) */}
                      <div className="rounded-xl border border-slate-800 bg-[#090d16] overflow-hidden shadow-2xl">
                        {/* Mac Window Header Bar */}
                        <div className="px-4 py-2.5 bg-[#161b22] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                            <span className="text-slate-400 text-[11px] ml-2">prompt_execution_string.txt</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-slate-500 uppercase">UTF-8</span>
                            <button
                              type="button"
                              onClick={handleCopyRawPrompt}
                              className="text-slate-400 hover:text-white text-xs flex items-center space-x-1 cursor-pointer"
                            >
                              {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedRaw ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Code Container */}
                        <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
                          {parsedDetails.rawPrompt || (cards.length === 0 ? 'Chưa có prompt' : 'Trống')}
                        </div>
                      </div>

                      {/* Quick Copy Action Banner */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">Sẵn sàng dán thẳng vào ChatGPT Plus / Claude 3.5 / Cursor</h4>
                            <p className="text-[11px] text-slate-400">Đã tinh chỉnh thông số kỹ thuật và bộ quy tắc cấm kỵ Anti-AI Slop.</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyRawPrompt}
                          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                        >
                          {copiedRaw ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedRaw ? 'ĐÃ COPY THÀNH CÔNG!' : 'COPY CÚ PHÁP NGAY'}</span>
                        </button>
                      </div>
                    </>
                  )}

                  {/* Technical Parameters Quick Grid */}
                  {Object.keys(parsedDetails.flags).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                        <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Flags & Command Parameters Trích Xuất:</span>
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(parsedDetails.flags).map(([key, value]) => (
                          <div key={key} className="p-2.5 rounded-lg bg-[#161b22] border border-slate-800 text-xs font-mono">
                            <span className="text-slate-500">--{key}</span>
                            <p className="font-bold text-white text-sm mt-0.5">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ================= TAB 2: SPECS & STRATEGY ================= */}
              {activeTab === 'specs' && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Parameter Breakdown */}
                  <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                      <Sliders className="w-4 h-4" />
                      <span>Thông Số Kỹ Thuật Đề Xuất Từ Creator</span>
                    </h4>

                    <div className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed font-mono bg-[#0d1117] p-3.5 rounded-lg border border-slate-800">
                      {isPurchased
                        ? (parsedDetails.parametersText || parsedDetails.rawFull)
                        : '🔒 [THÔNG SỐ KỸ THUẬT ĐƯỢC BẢO VỆ BẢN QUYỀN - VUI LÒNG MỞ KHÓA GÓI ĐỂ XEM CHI TIẾT]'}
                    </div>
                  </div>

                  {/* MMO Growth & Monetization Tips */}
                  {parsedDetails.tipsText && (
                    <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 space-y-2.5">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                        <Zap className="w-4 h-4" />
                        <span>Mẹo Giữ Chân Khán Giả & Kiếm Tiền MMO:</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {isPurchased
                          ? parsedDetails.tipsText
                          : '🔒 [MẸO TRIỂN KHAI & CÔNG THỨC CHUYỂN ĐỔI CHỈ HIỂN THỊ KHI ĐÃ MỞ KHÓA]'}
                      </p>
                    </div>
                  )}

                  {/* Compatibility Checklist */}
                  <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Công Cụ Đã Được Test Tương Thích:</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-lg bg-[#0d1117] border border-slate-800 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-slate-200 font-medium">Kling 1.5 HD Video</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0d1117] border border-slate-800 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-slate-200 font-medium">Higgsfield Text-to-Video</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0d1117] border border-slate-800 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-slate-200 font-medium">Midjourney v6.1</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0d1117] border border-slate-800 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-slate-200 font-medium">Flux.1 Schnell & Dev</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0d1117] border border-slate-800 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-slate-200 font-medium">Luma Dream Machine</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0d1117] border border-slate-800 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-slate-200 font-medium">N8N / Make Automation</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ================= TAB 3: AI PROMPT OPTIMIZER ================= */}
              {activeTab === 'ai' && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Optimizer Header */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                          <span>AI Prompt Optimizer & Tuning</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-sky-500/20 text-sky-300 font-mono">
                            Pro
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Biến tấu prompt này cho ngách sản phẩm hoặc chiến dịch video của bạn
                        </p>
                      </div>
                    </div>

                    {aiExplanations[safeIndex] && (
                      <button
                        type="button"
                        onClick={handleCopyAiExplanation}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedAiText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAiText ? 'Đã Copy' : 'Copy AI'}</span>
                      </button>
                    )}
                  </div>

                  {/* Custom Prompt Request Input */}
                  <div className="p-3.5 rounded-xl bg-[#161b22] border border-slate-800 space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">
                      Yêu cầu AI biến tấu theo sản phẩm của bạn:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customPromptInput}
                        onChange={(e) => setCustomPromptInput(e.target.value)}
                        placeholder="Ví dụ: Đổi bối cảnh sang Quán Cà Phê Hội An, hoặc Kể chuyện Lịch sử Việt Nam..."
                        className="flex-1 px-3 py-2 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAskAiOptimizer(customPromptInput);
                        }}
                      />
                      <button
                        type="button"
                        disabled={isAiLoading}
                        onClick={() => handleAskAiOptimizer(customPromptInput)}
                        className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Tối Ưu</span>
                      </button>
                    </div>

                    {/* Preset quick pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleAskAiOptimizer('Biến thành kịch bản bán hàng TikTok Shop')}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      >
                        🛒 Cho TikTok Shop
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAskAiOptimizer('Tối ưu cho Midjourney v6 photorealistic')}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      >
                        🎨 Chuẩn Midjourney 8K
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAskAiOptimizer('Chuyển thành video review phim ngắn')}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      >
                        🎬 Review Phim
                      </button>
                    </div>
                  </div>

                  {/* AI Loading state */}
                  {isAiLoading && (
                    <div className="py-12 flex flex-col items-center justify-center space-y-2.5">
                      <div className="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-slate-400 font-mono animate-pulse">
                        Đang phân tích cú pháp prompt & sinh biến thể tối ưu...
                      </p>
                    </div>
                  )}

                  {/* Error state */}
                  {aiError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                      {aiError}
                    </div>
                  )}

                  {/* AI Explanation result */}
                  {aiExplanations[safeIndex] && (
                    <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-mono space-y-2 shadow-inner">
                      {aiExplanations[safeIndex]}
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Bottom Navigation Toolbar (Prev / Next File) */}
            <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-[#161b22] flex items-center justify-between shrink-0">
              
              <button
                type="button"
                onClick={goToPrev}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Prompt trước [Phím Mũi Tên Trái]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prompt Trước</span>
              </button>

              <div className="text-xs text-slate-400 font-mono">
                Prompt {safeIndex + 1} / {cards.length}
              </div>

              <button
                type="button"
                onClick={goToNext}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Prompt tiếp theo [Phím Mũi Tên Phải]"
              >
                <span>Prompt Kế Tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
