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
  Scissors
} from 'lucide-react';
import { exportAnkiDeckFile, printSummaryGuide, printFlashcardCutoutSheet, playSound } from '../utils/storage';
import { recordStudyAction, completeDailyQuest } from '../utils/gamification';

export default function FlashcardModal({
  course,
  isPurchased,
  onClose,
  onBuy
}) {
  const cards = course.previewCards || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [reviewedStats, setReviewedStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  const currentCard = cards[currentIndex] || {};

  // Reset flip when navigating
  const goToNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const goToPrev = () => {
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
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
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  // Rate spaced repetition
  const handleRate = (type) => {
    setReviewedStats((prev) => ({ ...prev, [type]: prev[type] + 1 }));
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200 animate-spring-3d">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              {currentIndex + 1}/{cards.length}
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                {course.title}
              </h4>
              <p className="text-xs text-slate-500">
                {currentCard.tag || 'Thẻ Flashcard Anki'} • Dùng phím Space để lật thẻ
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
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
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

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
              Mở Khóa Toàn Bộ ({course.price ? `${Math.round(course.price / 1000)}K` : `${course.priceXu || 25} Xu`})
            </button>
          </div>
        )}

        {/* Card Body - 3D Flip Area */}
        <div className="p-4 sm:p-8 flex-1 flex flex-col items-center justify-center bg-slate-50 min-h-[340px] sm:min-h-[400px]">
          
          <div
            onClick={toggleFlip}
            className="w-full max-w-xl h-72 sm:h-80 cursor-pointer perspective-1000 select-none group"
          >
            <div
              className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-2xl shadow-md border ${
                isFlipped ? 'rotate-y-180 border-indigo-300 shadow-indigo-100' : 'border-slate-200 hover:border-slate-300'
              } bg-white`}
            >
              
              {/* Front Side */}
              <div className="absolute inset-0 backface-hidden p-6 sm:p-8 flex flex-col justify-between rounded-2xl bg-white">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Mặt trước (Câu hỏi / Từ khóa)
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(currentCard.front);
                    }}
                    className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    title="Phát âm thanh"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-auto text-center px-2">
                  <p className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug whitespace-pre-line">
                    {currentCard.front}
                  </p>
                </div>

                <div className="text-center text-xs text-slate-400 flex items-center justify-center space-x-1.5">
                  <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Chạm hoặc bấm [Space] để lật đáp án</span>
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 p-6 sm:p-8 flex flex-col justify-between rounded-2xl bg-indigo-50/40 border border-indigo-100 overflow-y-auto">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    Mặt sau (Giải thích / Đáp án)
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(currentCard.back);
                    }}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                    title="Phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-auto py-2">
                  <div className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                    {currentCard.back}
                  </div>
                </div>

                <div className="text-right text-[11px] text-indigo-500 font-medium">
                  Chạm để lật lại mặt trước
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
              {currentIndex + 1} / {cards.length}
            </span>
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-xs"
              title="Thẻ tiếp theo [Phím Mũi tên phải]"
            >
              <ChevronRight className="w-5 h-5" />
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
              <span className="text-[10px] text-rose-400 hidden sm:inline">(Phím 1 • 1m)</span>
            </button>

            <button
              onClick={() => handleRate('hard')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 transition-colors"
            >
              <span className="text-xs sm:text-sm font-bold">Khó</span>
              <span className="text-[10px] text-amber-500 hidden sm:inline">(Phím 2 • 10m)</span>
            </button>

            <button
              onClick={() => handleRate('good')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 transition-colors"
            >
              <span className="text-xs sm:text-sm font-bold">Tốt</span>
              <span className="text-[10px] text-blue-400 hidden sm:inline">(Phím 3 • 1d)</span>
            </button>

            <button
              onClick={() => handleRate('easy')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition-colors"
            >
              <span className="text-xs sm:text-sm font-bold">Dễ Nhớ</span>
              <span className="text-[10px] text-emerald-500 hidden sm:inline">(Phím 4 • 4d)</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
