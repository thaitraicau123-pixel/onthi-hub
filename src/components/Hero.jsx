import React from 'react';
import { Sparkles, ShieldCheck, Zap, DownloadCloud, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Hero({ onSelectCombo, onExplore }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200">
      
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Urgency Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-100/90 border border-indigo-200 text-indigo-800 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>Cập nhật mới nhất kỳ thi Công Chức 2026 & Phỏng vấn IT Quý 4</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] max-w-4xl mx-auto">
          Pass Đề Thi & Chốt Offer Lương Cao Nhờ{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Flashcard Anki Thông Minh
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Đập tan nỗi sợ "học trước quên sau". Áp dụng thuật toán <strong>Lặp lại ngắt quãng (Spaced Repetition)</strong> ghi nhớ chính xác hàng trăm điều luật công chức, câu hỏi phỏng vấn kỹ thuật và từ vựng ngoại ngữ.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <button
            onClick={onSelectCombo}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Nhận Trọn Gói Combo VIP (Chỉ 189K)</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Xem & Học Thử Từng Bộ</span>
          </button>
        </div>

        {/* Feature Highlights Trust Badges */}
        <div className="mt-10 sm:mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          
          <div className="flex items-start space-x-2.5">
            <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">Kích Hoạt Tự Động 3s</p>
              <p className="text-[11px] sm:text-xs text-slate-500">Quét VietQR mở khóa file tức thì</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <DownloadCloud className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">Đầy Đủ File .apkg & PDF</p>
              <p className="text-[11px] sm:text-xs text-slate-500">Dùng trên điện thoại & máy tính</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">Học Trực Tiếp Trên Web</p>
              <p className="text-[11px] sm:text-xs text-slate-500">Lật thẻ 3D & Thi thử bấm giờ</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">Cam Kết Chuẩn Format</p>
              <p className="text-[11px] sm:text-xs text-slate-500">Cập nhật đề thi mới định kỳ</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
