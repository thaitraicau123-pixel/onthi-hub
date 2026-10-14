import React, { useState, useEffect } from 'react';
import {
  X,
  BookMarked,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Trash2,
  AlertCircle,
  HelpCircle,
  Layers,
  Brain,
  Bot,
  Copy,
  Check,
  Volume2
} from 'lucide-react';
import {
  getMistakes,
  markMistakeMastered,
  removeMistake,
  clearMasteredMistakes,
  buildMistakesRetryDeck,
  diagnoseWeaknessesWithAi
} from '../utils/mistakeTracker';
import { playSound } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function MistakeNotebookModal({
  onClose,
  onStartFlashcardPractice,
  onStartQuizPractice
}) {
  const [mistakes, setMistakes] = useState(() => getMistakes());
  const [filterTab, setFilterTab] = useState('unmastered'); // 'unmastered' | 'quiz' | 'flashcard' | 'mastered'
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState('');
  const [aiError, setAiError] = useState('');
  const [copiedReport, setCopiedReport] = useState(false);

  const reloadMistakes = () => {
    setMistakes(getMistakes());
  };

  const unmastered = mistakes.filter(m => !m.mastered);
  const mastered = mistakes.filter(m => m.mastered);
  const quizMistakes = unmastered.filter(m => m.type === 'quiz');
  const flashcardMistakes = unmastered.filter(m => m.type === 'flashcard');

  const displayedList = (() => {
    if (filterTab === 'mastered') return mastered;
    if (filterTab === 'quiz') return quizMistakes;
    if (filterTab === 'flashcard') return flashcardMistakes;
    return unmastered;
  })();

  const handleMarkMastered = (id) => {
    playSound('correct');
    markMistakeMastered(id);
    reloadMistakes();
  };

  const handleRemove = (id) => {
    removeMistake(id);
    reloadMistakes();
  };

  const handleDiagnoseAi = async () => {
    if (unmastered.length === 0) {
      alert('Sổ tay của bạn không có câu sai nào chưa khắc phục!');
      return;
    }

    setIsAiLoading(true);
    setAiError('');
    setAiReport('');

    try {
      const res = await diagnoseWeaknessesWithAi(unmastered);
      if (res.success) {
        setAiReport(res.content);
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

  const handleCopyReport = () => {
    if (!aiReport) return;
    navigator.clipboard.writeText(aiReport);
    playSound('success');
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleStartPracticeAll = (mode = 'flashcard') => {
    const retryDeck = buildMistakesRetryDeck();
    if (!retryDeck || retryDeck.previewCards.length === 0) {
      alert('Không có câu hỏi nào để luyện tập!');
      return;
    }

    playSound('success');
    onClose();
    if (mode === 'quiz' && onStartQuizPractice) {
      onStartQuizPractice(retryDeck);
    } else if (onStartFlashcardPractice) {
      onStartFlashcardPractice(retryDeck);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#e9e9e8] text-[#37352f]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#fbfbfa] border-b border-[#e9e9e8] text-[#37352f] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#2383e2]/10 text-[#2383e2] flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-[#37352f]">
                  Sổ Tay Câu Sai & Điểm Yếu
                </h3>
                <span className="notion-tag notion-tag-red text-[11px] font-semibold">
                  {unmastered.length} câu cần chữa
                </span>
              </div>
              <p className="text-xs text-[#787774]">
                Tập hợp mọi câu trắc nghiệm làm sai và flashcard hay quên để ôn luyện tập trung
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-black/5 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & AI Diagnosis Toolbar */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#e9e9e8] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 p-1 bg-[#f7f6f5] rounded-lg border border-[#e9e9e8] text-xs font-medium w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setFilterTab('unmastered')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                filterTab === 'unmastered' ? 'bg-[#37352f] text-white font-semibold shadow-xs' : 'text-[#787774] hover:text-[#37352f] hover:bg-black/5'
              }`}
            >
              Chưa Thuộc ({unmastered.length})
            </button>
            <button
              onClick={() => setFilterTab('quiz')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                filterTab === 'quiz' ? 'bg-[#37352f] text-white font-semibold shadow-xs' : 'text-[#787774] hover:text-[#37352f] hover:bg-black/5'
              }`}
            >
              Trắc Nghiệm ({quizMistakes.length})
            </button>
            <button
              onClick={() => setFilterTab('flashcard')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                filterTab === 'flashcard' ? 'bg-[#37352f] text-white font-semibold shadow-xs' : 'text-[#787774] hover:text-[#37352f] hover:bg-black/5'
              }`}
            >
              Flashcard ({flashcardMistakes.length})
            </button>
            <button
              onClick={() => setFilterTab('mastered')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                filterTab === 'mastered' ? 'bg-emerald-600 text-white font-semibold shadow-xs' : 'text-[#787774] hover:text-[#37352f] hover:bg-black/5'
              }`}
            >
              Đã Khắc Phục ({mastered.length})
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDiagnoseAi}
              disabled={isAiLoading || unmastered.length === 0}
              className="px-3.5 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-medium shadow-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAiLoading ? 'AI Đang Bắt Bệnh...' : 'AI Bắt Bệnh Lỗ Hổng'}</span>
            </button>

            {unmastered.length > 0 && (
              <button
                onClick={() => handleStartPracticeAll('flashcard')}
                className="px-3.5 py-1.5 rounded-lg bg-[#37352f] hover:bg-[#201f1d] text-white text-xs font-medium shadow-xs flex items-center space-x-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-blue-300 fill-blue-300" />
                <span>Luyện Thẻ Lại ({unmastered.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-white">
          
          {/* AI Cognitive Gap Diagnostic Report Panel */}
          {aiReport && (
            <div className="p-4 sm:p-5 bg-[#f7f6f5] rounded-xl border border-[#e9e9e8] text-[#37352f] space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#e9e9e8] pb-2">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-[#2383e2]" />
                  <h4 className="text-xs font-bold text-[#37352f] uppercase tracking-wider">
                    Báo Cáo Bắt Bệnh Lỗ Hổng Kiến Thức & Phác Đồ (AI OnThiHub Pro)
                  </h4>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleCopyReport}
                    className="p-1.5 text-[#787774] hover:text-[#37352f] rounded-md hover:bg-black/5"
                    title="Copy báo cáo"
                  >
                    {copiedReport ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setAiReport('')}
                    className="p-1.5 text-[#787774] hover:text-[#37352f] rounded-md hover:bg-black/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-[#37352f] leading-relaxed whitespace-pre-line space-y-2">
                {aiReport}
              </div>
            </div>
          )}

          {/* AI Error if any */}
          {aiError && (
            <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {aiError}
            </div>
          )}

          {/* Empty State */}
          {displayedList.length === 0 ? (
            <div className="text-center py-16 bg-[#fbfbfa] rounded-xl border border-[#e9e9e8] p-8">
              <div className="w-14 h-14 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#37352f]">
                {filterTab === 'mastered'
                  ? 'Chưa có câu nào được đánh dấu đã khắc phục'
                  : 'Tuyệt vời! Không có câu hỏi sai nào trong mục này.'}
              </h4>
              <p className="mt-1 text-xs text-[#787774] max-w-sm mx-auto">
                {filterTab === 'mastered'
                  ? 'Khi luyện tập lại và chọn "Đã Nhớ", câu hỏi sẽ xuất hiện tại đây.'
                  : 'Mỗi khi bạn làm sai trắc nghiệm hoặc đánh giá "Học Lại" trên Flashcard, hệ thống sẽ tự động lưu vào đây để bạn chữa lỗi.'}
              </p>
            </div>
          ) : (
            /* List of Mistakes */
            <div className="space-y-3">
              {displayedList.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border transition-all text-xs sm:text-sm space-y-2.5 ${
                    m.mastered
                      ? 'bg-emerald-50/30 border-emerald-200'
                      : 'bg-white border-[#e9e9e8] hover:border-[#2383e2]'
                  }`}
                >
                  {/* Meta Bar */}
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`notion-tag ${
                        m.type === 'quiz' ? 'notion-tag-purple' : 'notion-tag-blue'
                      } text-[10px]`}>
                        {m.type === 'quiz' ? '📝 TRẮC NGHIỆM' : '🗂️ FLASHCARD'}
                      </span>
                      <span className="text-[11px] font-medium text-[#787774] line-clamp-1">
                        {m.deckTitle}
                      </span>
                      {m.failCount > 1 && (
                        <span className="notion-tag notion-tag-red text-[10px]">
                          Sai {m.failCount} lần
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {!m.mastered ? (
                        <button
                          onClick={() => handleMarkMastered(m.id)}
                          className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium text-xs flex items-center space-x-1 transition-colors"
                          title="Đánh dấu đã hiểu bài"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã Nhớ</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-medium text-emerald-700 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã Khắc Phục</span>
                        </span>
                      )}

                      <button
                        onClick={() => handleRemove(m.id)}
                        className="p-1 text-[#787774] hover:text-rose-600 rounded transition-colors"
                        title="Xóa câu này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Question */}
                  <p className="font-semibold text-[#37352f] leading-snug">
                    {m.question}
                  </p>

                  {/* Options / Answers Breakdown */}
                  <div className="space-y-1.5 pt-1">
                    {m.userChoice && m.userChoice !== m.answer && (
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center space-x-2">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Bạn đã chọn sai: <strong>{m.userChoice}</strong></span>
                      </div>
                    )}

                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span>Đáp án chuẩn: <strong>{m.answer}</strong></span>
                        {m.explanation && (
                          <p className="text-[11px] text-emerald-800 mt-0.5 font-normal">
                            💡 {m.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#fbfbfa] border-t border-[#e9e9e8] flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-[#787774]">
            💡 Phương pháp đỉnh cao: Ôn lại toàn bộ lỗi sai trước giờ thi giúp cải thiện từ 1-2 điểm thực chiến
          </span>
          <div className="flex items-center space-x-2">
            {mastered.length > 0 && (
              <button
                onClick={() => {
                  clearMasteredMistakes();
                  reloadMistakes();
                }}
                className="px-3 py-1.5 rounded-lg text-[11px] text-[#787774] hover:text-[#37352f] font-medium"
              >
                Dọn sạch câu đã khắc phục
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#37352f] text-white text-xs font-medium hover:bg-[#201f1d] transition-colors"
            >
              Đóng sổ tay
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
