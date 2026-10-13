import React from 'react';
import { BookOpen, ShieldCheck, Mail, Phone, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1c0413] text-rose-200/70 py-12 border-t border-[#f02c85]/20 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2.5 text-white mb-3">
              <div className="w-9 h-9 rounded-2xl bg-[#f02c85] flex items-center justify-center shadow-md shadow-pink-900/40">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white uppercase tracking-tight">ÔnThiHub</span>
            </div>
            <p className="text-rose-200/60 text-xs max-w-sm leading-relaxed mb-4 font-medium">
              Nền tảng cung cấp kho tài liệu số, bộ đề thi chuẩn hóa và Flashcard Anki ứng dụng thuật toán Spaced Repetition số 1 Việt Nam. Hỗ trợ hàng ngàn học viên thi đỗ công chức, nâng band ngoại ngữ và đỗ offer IT.
            </p>
            <div className="flex items-center space-x-2 text-rose-100 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Thanh toán tự động 100% qua VietQR • Bảo hành cập nhật trọn đời</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black text-sm mb-3 uppercase tracking-wider">Danh Mục Tài Liệu</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#cong-chuc" className="hover:text-[#f02c85] transition-colors">Đề Thi Công Chức 2026</a></li>
              <li><a href="#it-tech" className="hover:text-[#f02c85] transition-colors">Phỏng Vấn IT & System Design</a></li>
              <li><a href="#ngoai-ngu" className="hover:text-[#f02c85] transition-colors">Từ Vựng IELTS 7.5+ & TOEIC</a></li>
              <li><a href="#ngoai-ngu" className="hover:text-[#f02c85] transition-colors">Kanji JLPT N3 - N2 Siêu Tốc</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-black text-sm mb-3 uppercase tracking-wider">Hỗ Trợ Kỹ Thuật 24/7</h4>
            <ul className="space-y-2 font-medium">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#f02c85]" />
                <span>Hotline Hỗ Trợ: <strong className="text-white">0388.999.888</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#f02c85]" />
                <span>Email: <span className="text-white">support@onthihub.vn</span></span>
              </li>
              <li className="text-rose-300/50 pt-2 font-medium">
                Thời gian hỗ trợ: 8:00 - 23:00 hàng ngày (kể cả Thứ 7, CN)
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#f02c85]/15 text-center flex flex-col sm:flex-row items-center justify-between text-rose-300/60 text-[11px] gap-2 font-medium">
          <p>© 2026 ÔnThiHub. All rights reserved. Xây dựng cho sĩ tử Việt Nam.</p>
          <p className="flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#f02c85] fill-[#f02c85]" />
            <span>for your career success</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
