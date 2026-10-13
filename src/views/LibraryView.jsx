import React, { useState } from 'react';
import {
  FolderHeart,
  Layers,
  PlayCircle,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  BookOpen,
  Gamepad2,
  Repeat,
  Brain,
  Flame,
  CheckCircle,
  Clock,
  BookMarked
} from 'lucide-react';
import { exportAnkiDeckFile, printSummaryGuide } from '../utils/storage';
import { getAllDecksDueStats, buildDueCardsDeck, getDeckDueStats } from '../utils/spacedRepetition';
import { getUnmasteredMistakesCount } from '../utils/mistakeTracker';

export default function LibraryView({
  purchasedCourses,
  allCourses,
  onOpenFlashcards,
  onOpenQuiz,
  onOpenMatchGame,
  onOpenPassDeck,
  onOpenMistakes,
  onSwitchTab
}) {
  const isComboUser = purchasedCourses.includes('combo-all-access');
  const unlockedList = isComboUser
    ? allCourses
    : allCourses.filter((c) => purchasedCourses.includes(c.id));

  const srsStats = getAllDecksDueStats(unlockedList);
  const unmasteredMistakesCount = getUnmasteredMistakesCount();

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* HEADER (Wayground Warm Cream Container) */}
      <div className="flex items-center justify-between bg-[#fcf7ec] p-6 rounded-3xl border border-[#eadfcb] shadow-md text-[#28071a]">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#f02c85] bg-pink-100/70 px-3 py-1 rounded-full border border-pink-200">
            MY WORKSPACE
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#28071a] mt-2">
            Tủ Thẻ & Tài Liệu Của Tôi ({unlockedList.length})
          </h2>
          <p className="text-xs text-[#7a5a6b] mt-0.5 font-medium">
            Lưu trữ vĩnh viễn trên thiết bị của bạn. Bấm để bắt đầu học ngay hoặc tải file nạp vào Anki.
          </p>
        </div>

        {isComboUser && (
          <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-black">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>VIP ALL-ACCESS TRỌN ĐỜI</span>
          </div>
        )}
      </div>

      {/* SPACED REPETITION (SM-2) HERO BANNER */}
      {unlockedList.length > 0 && (
        <div className="bg-gradient-to-r from-[#28071a] via-[#430c2c] to-[#1d0313] p-5 sm:p-6 rounded-3xl border-2 border-[#f02c85]/40 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-[11px] font-black text-pink-300">
              <Brain className="w-3.5 h-3.5 text-pink-400" />
              <span>SUPERMEMO SM-2 • CHỐNG QUÊN LÃNG EBBINGHAUS</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {srsStats.totalDue > 0 ? (
                <>🎯 Hôm Nay Có <span className="text-[#f02c85] text-2xl font-black">{srsStats.totalDue}</span> Thẻ Cần Ôn Tập!</>
              ) : (
                <>🎉 Tuyệt Vời! Bạn Đã Ôn Hết Tất Cả Thẻ Đến Hạn Hôm Nay!</>
              )}
            </h3>
            <p className="text-xs text-pink-200/80 font-medium max-w-xl">
              Hệ thống tự động tính toán chu kỳ lặp lại ngắt quãng (Spaced Repetition) giúp biến trí nhớ ngắn hạn thành trí nhớ vĩnh viễn trước ngày thi.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-pink-900/50 border border-pink-700/50 text-pink-200 font-bold">
                ⏰ Cần ôn: <strong className="text-white">{srsStats.totalDue}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-700/50 text-emerald-300 font-bold">
                🧠 Đã nhớ sâu: <strong className="text-white">{srsStats.totalLearned}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/50 border border-amber-700/50 text-amber-300 font-bold">
                ✨ Thẻ mới: <strong className="text-white">{srsStats.totalNew}</strong>
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {srsStats.totalDue > 0 ? (
              <button
                onClick={() => onOpenFlashcards(buildDueCardsDeck(unlockedList))}
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#f02c85] to-pink-500 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-lg shadow-pink-900/50 flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95"
              >
                <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>Ôn Tập Toàn Bộ {srsStats.totalDue} Thẻ Đến Hạn</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenFlashcards(buildDueCardsDeck(unlockedList))}
                className="w-full md:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-pink-200 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Ôn Tập Thêm Luyện Phản Xạ</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* MISTAKES QUICK ACCESS CARD */}
      {unmasteredMistakesCount > 0 && (
        <div className="bg-gradient-to-r from-rose-950/70 to-purple-950/70 border border-rose-500/40 rounded-2xl p-4 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-rose-100 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-white text-sm block">
                Sổ Tay Câu Sai: Bạn có {unmasteredMistakesCount} câu cần khắc phục!
              </span>
              <span className="text-rose-200/80 font-medium text-[11px]">
                Xem lại câu trắc nghiệm làm sai và nhận chẩn đoán lỗ hổng kiến thức từ AI OnThiHub.
              </span>
            </div>
          </div>

          <button
            onClick={onOpenMistakes}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Mở Sổ Tay Câu Sai ({unmasteredMistakesCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* C2C PASS TIPS BANNER */}
      <div className="bg-gradient-to-r from-purple-950/70 to-pink-950/70 border border-[#f02c85]/40 rounded-2xl p-4 text-xs flex items-center justify-between gap-3 text-pink-100 shadow-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#f02c85] flex items-center justify-center shrink-0 shadow-sm">
            <Repeat className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-black text-white block">Bạn đã ôn thi đỗ hoặc học xong tài liệu?</span>
            <span className="text-pink-200/80 font-medium text-[11px]">Bấm nút "Pass Lại Thẻ Cũ" ở mỗi bộ thẻ bên dưới để nhượng lại cho bạn học khác trên Sàn C2C và nhận Xu vào ví!</span>
          </div>
        </div>
      </div>

      {unlockedList.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-[#fcf7ec] rounded-3xl border border-[#eadfcb] p-8 shadow-md text-[#28071a]">
          <div className="w-16 h-16 rounded-2xl bg-pink-100 text-[#f02c85] flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-8 h-8" />
          </div>
          <h4 className="text-base font-black text-[#28071a]">
            Tủ tài liệu của bạn đang trống
          </h4>
          <p className="mt-1 text-xs text-[#7a5a6b] max-w-sm mx-auto font-medium">
            Bạn chưa mở khóa bộ tài liệu nào. Hãy ghé qua Trang Chủ hoặc Chợ Thẻ C2C để tìm bộ đề phù hợp nhé!
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => onSwitchTab('home')}
              className="px-5 py-2.5 rounded-2xl font-black text-xs text-white bg-[#f02c85] hover:bg-[#dc1f74] shadow-md inline-flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
            >
              <span>Xem Đề Thi Chuẩn</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSwitchTab('marketplace')}
              className="px-5 py-2.5 rounded-2xl font-black text-xs text-[#28071a] bg-white border border-[#eadfcb] hover:bg-[#faebd0] transition-colors"
            >
              Vào Chợ Flashcard C2C
            </button>
          </div>
        </div>
      ) : (
        /* Unlocked Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {unlockedList.map((course) => {
            const deckSrs = getDeckDueStats(course);
            return (
              <div
                key={course.id}
                className="p-5 rounded-3xl border border-[#eadfcb] bg-[#fcf7ec] hover:border-[#f02c85] shadow-md hover:shadow-xl transition-all flex flex-col justify-between text-[#28071a]"
              >
                <div>
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      BẢN QUYỀN ĐÃ MỞ KHÓA
                    </span>
                    {deckSrs.due > 0 ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        ⏰ {deckSrs.due} thẻ cần ôn
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        ✓ Đã ôn đủ
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-black text-[#28071a] mt-2 line-clamp-2 leading-snug">
                    {course.title}
                  </h4>
                <p className="text-xs text-[#7a5a6b] mt-1 line-clamp-2 font-medium">
                  {course.subtitle || course.description}
                </p>
                <div className="mt-3 text-[11px] text-[#7a5a6b] font-bold">
                  {course.previewCards?.length || 0} thẻ Anki • {course.previewQuiz?.length || 0} câu trắc nghiệm
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-[#eadfcb] grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenFlashcards(course)}
                  className="py-2.5 px-3 rounded-xl bg-[#f02c85] hover:bg-[#dc1f74] text-white text-xs font-black flex items-center justify-center space-x-1 shadow-md shadow-pink-900/30 transition-transform transform hover:scale-105 active:scale-95"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Học Thẻ 3D</span>
                </button>

                <button
                  onClick={() => onOpenQuiz(course)}
                  className="py-2.5 px-3 rounded-xl bg-[#28071a] hover:bg-[#3d0c27] text-white text-xs font-black flex items-center justify-center space-x-1 shadow-sm transition-transform transform hover:scale-105 active:scale-95"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-pink-400" />
                  <span>Thi Thử</span>
                </button>

                <button
                  onClick={() => onOpenMatchGame(course)}
                  className="col-span-2 py-2.5 px-3 rounded-xl btn-wayground-sunset text-white text-xs font-black flex items-center justify-center space-x-1 shadow-md transition-transform transform hover:scale-105 active:scale-95"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>🎮 Chơi Nối Thẻ Siêu Tốc (Match Mode)</span>
                </button>

                <button
                  onClick={() => onOpenPassDeck?.(course)}
                  className="col-span-2 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-700 via-[#f02c85] to-pink-600 hover:brightness-110 text-white text-xs font-black flex items-center justify-center space-x-1.5 shadow-sm transition-transform transform hover:scale-102 active:scale-95"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>🔁 Pass Lại Thẻ Cũ (Nhượng Thẻ Nhận Xu)</span>
                </button>

                <button
                  onClick={() => exportAnkiDeckFile(course.title, course.previewCards)}
                  className="py-2 px-2.5 rounded-xl bg-white hover:bg-[#faebd0] border border-[#eadfcb] text-[#28071a] text-xs font-bold flex items-center justify-center space-x-1"
                  title="Xuất file .txt nhập vào Anki"
                >
                  <Download className="w-3.5 h-3.5 text-[#f02c85]" />
                  <span>Tải Anki</span>
                </button>

                <button
                  onClick={() => printSummaryGuide(course)}
                  className="py-2 px-2.5 rounded-xl bg-white hover:bg-[#faebd0] border border-[#eadfcb] text-[#28071a] text-xs font-bold flex items-center justify-center space-x-1"
                  title="In tài liệu hoặc xuất PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-[#f02c85]" />
                  <span>In / PDF</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

    </div>
  );
}
