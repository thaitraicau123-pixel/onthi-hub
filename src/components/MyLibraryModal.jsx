import React from 'react';
import {
  X,
  FolderHeart,
  Layers,
  PlayCircle,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { exportAnkiDeckFile, printSummaryGuide } from '../utils/storage';
import { useModalDismiss } from '../hooks/useModalDismiss';

export default function MyLibraryModal({
  purchasedCourses,
  allCourses,
  onClose,
  onOpenFlashcards,
  onOpenQuiz,
  onExplore
}) {
  const isComboUser = purchasedCourses.includes('combo-all-access');
  const unlockedList = isComboUser
    ? allCourses
    : allCourses.filter((c) => purchasedCourses.includes(c.id));

  // Close on Escape key
  useModalDismiss(onClose);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto cursor-pointer"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 cursor-default"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <FolderHeart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Tủ Tài Liệu & Thẻ Đã Mở Khóa ({unlockedList.length})
              </h4>
              <p className="text-xs text-slate-500">
                Toàn bộ tài liệu bạn sở hữu được lưu vĩnh viễn trên trình duyệt này
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg border border-slate-200 bg-white transition-colors cursor-pointer"
            title="Đóng (hoặc nhấn Esc, bấm ra ngoài)"
          >
            <span>Đóng</span>
            <kbd className="hidden sm:inline text-[10px] font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-500">Esc</kbd>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          
          {isComboUser && (
            <div className="p-3.5 mb-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center space-x-2.5 text-xs text-amber-900">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong>Tài Khoản VIP Trọn Đời:</strong> Bạn có quyền truy cập không giới hạn vào TẤT CẢ các bộ tài liệu hiện tại và tương lai.
              </div>
            </div>
          )}

          {unlockedList.length === 0 ? (
            /* Empty State */
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Tủ tài liệu của bạn đang trống
              </h4>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Bạn chưa mở khóa bộ tài liệu nào. Hãy tham khảo các bộ Flashcard & Đề thi tuyển dụng chuẩn bên ngoài nhé!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExplore();
                }}
                className="mt-5 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md inline-flex items-center space-x-1.5"
              >
                <span>Khám Phá Tài Liệu Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* List of Unlocked Items */
            <div className="space-y-3.5">
              {unlockedList.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Bản Quyền Đã Mở Khóa
                    </span>
                    <h5 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                      {course.title}
                    </h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {course.previewCards?.length || 0} thẻ Anki • {course.previewQuiz?.length || 0} câu trắc nghiệm
                    </p>
                  </div>

                  {/* Actions for this course */}
                  <div className="flex items-center flex-wrap gap-1.5 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenFlashcards(course);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center space-x-1"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Học Thẻ</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenQuiz(course);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center space-x-1"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Thi Thử</span>
                    </button>

                    <button
                      onClick={() => exportAnkiDeckFile(course.title, course.previewCards)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1"
                      title="Tải file nạp vào Anki"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải Anki</span>
                    </button>

                    <button
                      onClick={() => printSummaryGuide(course)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1"
                      title="Xuất file PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
