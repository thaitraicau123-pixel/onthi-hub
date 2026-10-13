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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#fcf7ec] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border-2 border-[#eadfcb] text-[#28071a]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#240618] to-[#450a29] text-white border-b border-[#f02c85]/30 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f02c85] flex items-center justify-center shadow-md">
              <BookMarked className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">
                  Sổ Tay Câu Sai & Điểm Yếu
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/30 text-rose-200 border border-rose-400/40">
                  {unmastered.length} câu cần chữa
                </span>
              </div>
              <p className="text-xs text-pink-200/80 font-medium">
                Tập hợp mọi câu trắc nghiệm làm sai và flashcard hay quên để ôn luyện tập trung
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-pink-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & AI Diagnosis Toolbar */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#eadfcb] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 p-1 bg-[#fcf7ec] rounded-2xl border border-[#eadfcb] text-xs font-bold w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setFilterTab('unmastered')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterTab === 'unmastered' ? 'bg-[#f02c85] text-white font-black shadow-xs' : 'text-[#7a5a6b] hover:text-[#28071a]'
              }`}
            >
              Chưa Thuộc ({unmastered.length})
            </button>
            <button
              onClick={() => setFilterTab('quiz')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterTab === 'quiz' ? 'bg-[#f02c85] text-white font-black shadow-xs' : 'text-[#7a5a6b] hover:text-[#28071a]'
              }`}
            >
              Trắc Nghiệm ({quizMistakes.length})
            </button>
            <button
              onClick={() => setFilterTab('flashcard')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterTab === 'flashcard' ? 'bg-[#f02c85] text-white font-black shadow-xs' : 'text-[#7a5a6b] hover:text-[#28071a]'
              }`}
            >
              Flashcard ({flashcardMistakes.length})
            </button>
            <button
              onClick={() => setFilterTab('mastered')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterTab === 'mastered' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-[#7a5a6b] hover:text-[#28071a]'
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
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-[#f02c85] hover:brightness-110 text-white text-xs font-black shadow-sm flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAiLoading ? 'AI Đang Bắt Bệnh...' : '✨ Gemini Bắt Bệnh Lỗ Hổng'}</span>
            </button>

            {unmastered.length > 0 && (
              <button
                onClick={() => handleStartPracticeAll('flashcard')}
                className="px-4 py-2 rounded-xl bg-[#28071a] hover:bg-[#3d0c27] text-white text-xs font-black shadow-sm flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                <span>Luyện Thẻ Lại ({unmastered.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* AI Cognitive Gap Diagnostic Report Panel */}
          {aiReport && (
            <div className="p-5 bg-gradient-to-r from-[#240618] to-[#3d0a27] rounded-3xl border-2 border-[#f02c85] text-white shadow-xl space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-pink-400/20 pb-2">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-pink-400" />
                  <h4 className="text-sm font-black text-pink-200 uppercase tracking-wider">
                    Báo Cáo Bắt Bệnh Lỗ Hổng Kiến Thức & Phác Đồ (Gemini 3.8 Flash)
                  </h4>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleCopyReport}
                    className="p-1.5 text-pink-200 hover:text-white rounded-lg hover:bg-white/10"
                    title="Copy báo cáo"
                  >
                    {copiedReport ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setAiReport('')}
                    className="p-1.5 text-pink-200 hover:text-white rounded-lg hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-pink-100 leading-relaxed whitespace-pre-line space-y-2 font-medium">
                {aiReport}
              </div>
            </div>
          )}

          {/* AI Error if any */}
          {aiError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
              {aiError}
            </div>
          )}

          {/* Empty State */}
          {displayedList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#eadfcb] p-8 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-[#28071a]">
                {filterTab === 'mastered'
                  ? 'Chưa có câu nào được đánh dấu đã khắc phục'
                  : 'Tuyệt vời! Không có câu hỏi sai nào trong mục này.'}
              </h4>
              <p className="mt-1 text-xs text-[#7a5a6b] max-w-sm mx-auto font-medium">
                {filterTab === 'mastered'
                  ? 'Khi luyện tập lại và chọn "Đã Nhớ", câu hỏi sẽ xuất hiện tại đây.'
                  : 'Mỗi khi bạn làm sai trắc nghiệm hoặc đánh giá "Học Lại" trên Flashcard, hệ thống sẽ tự động lưu vào đây để bạn chữa lỗi.'}
              </p>
            </div>
          ) : (
            /* List of Mistakes */
            <div className="space-y-3.5">
              {displayedList.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all text-xs sm:text-sm space-y-2.5 shadow-2xs ${
                    m.mastered
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-[#eadfcb] hover:border-[#f02c85]'
                  }`}
                >
                  {/* Meta Bar */}
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                        m.type === 'quiz' ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-[#f02c85]'
                      }`}>
                        {m.type === 'quiz' ? '📝 TRẮC NGHIỆM' : '🗂️ FLASHCARD'}
                      </span>
                      <span className="text-[11px] font-bold text-[#7a5a6b] line-clamp-1">
                        {m.deckTitle}
                      </span>
                      {m.failCount > 1 && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px]">
                          Sai {m.failCount} lần
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {!m.mastered ? (
                        <button
                          onClick={() => handleMarkMastered(m.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-black text-xs flex items-center space-x-1 transition-colors"
                          title="Đánh dấu đã hiểu bài"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã Nhớ</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã Khắc Phục</span>
                        </span>
                      )}

                      <button
                        onClick={() => handleRemove(m.id)}
                        className="p-1 text-[#7a5a6b] hover:text-rose-600 rounded transition-colors"
                        title="Xóa câu này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Question */}
                  <p className="font-black text-slate-900 leading-snug">
                    {m.question}
                  </p>

                  {/* Options / Answers Breakdown */}
                  <div className="space-y-1.5 pt-1">
                    {m.userChoice && m.userChoice !== m.answer && (
                      <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center space-x-2">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Bạn đã chọn sai: <strong>{m.userChoice}</strong></span>
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start space-x-2">
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
        <div className="px-6 py-3.5 bg-[#f5ecd8] border-t border-[#eadfcb] flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-[#7a5a6b] font-bold">
            💡 Phương pháp đỉnh cao: Ôn lại toàn bộ lỗi sai trước giờ thi giúp cải thiện từ 1-2 điểm thực chiến
          </span>
          <div className="flex items-center space-x-2">
            {mastered.length > 0 && (
              <button
                onClick={() => {
                  clearMasteredMistakes();
                  reloadMistakes();
                }}
                className="px-3 py-1.5 rounded-xl text-[11px] text-[#7a5a6b] hover:text-[#28071a] font-bold"
              >
                Dọn sạch câu đã khắc phục
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#28071a] text-white text-xs font-bold hover:bg-[#3d0c27]"
            >
              Đóng sổ tay
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
