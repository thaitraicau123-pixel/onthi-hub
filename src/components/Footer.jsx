import React from 'react';
import { BookOpen, ShieldCheck, Mail, Phone, Heart } from 'lucide-react';

export default function Footer({ onOpenAdmin }) {
  return (
    <footer className="bg-[#f7f6f5] text-[#787774] py-10 border-t border-[#e9e9e8] text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 text-[#37352f] mb-3">
              <div className="w-7 h-7 rounded-md bg-white border border-[#e9e9e8] shadow-2xs flex items-center justify-center text-sm">
                🎓
              </div>
              <span className="text-base font-bold text-[#37352f] tracking-tight">Ôn Thi Hub</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#f1f1ef] text-[#787774] border border-[#e3e2e0]">
                Workspace
              </span>
            </div>
            <p className="text-[#787774] text-xs max-w-sm leading-relaxed mb-4">
              Nền tảng cung cấp kho tài liệu số, bộ đề thi chuẩn hóa và Flashcard Anki ứng dụng thuật toán Spaced Repetition số 1 Việt Nam. Hỗ trợ hàng ngàn học viên thi đỗ công chức, nâng band ngoại ngữ và đỗ offer IT.
            </p>
            <div className="flex items-center space-x-2 text-[#448361] font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#448361]" />
              <span>Thanh toán tự động 100% qua VietQR • Bảo hành cập nhật trọn đời</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#37352f] font-bold text-xs mb-3 uppercase tracking-wider">Danh Mục Tài Liệu</h4>
            <ul className="space-y-2">
              <li><a href="#cong-chuc" className="hover:text-[#2383e2] transition-colors">Đề Thi Công Chức 2026</a></li>
              <li><a href="#it-tech" className="hover:text-[#2383e2] transition-colors">Phỏng Vấn IT & System Design</a></li>
              <li><a href="#ngoai-ngu" className="hover:text-[#2383e2] transition-colors">Từ Vựng IELTS 7.5+ & TOEIC</a></li>
              <li><a href="#ngoai-ngu" className="hover:text-[#2383e2] transition-colors">Kanji JLPT N3 - N2 Siêu Tốc</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[#37352f] font-bold text-xs mb-3 uppercase tracking-wider">Hỗ Trợ Kỹ Thuật 24/7</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#2383e2]" />
                <span>Hotline Hỗ Trợ: <a href="tel:0986019623" className="text-[#37352f] hover:text-[#2383e2] transition-colors font-bold">0986019623</a></span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#2383e2]" />
                <span>Email: <a href="mailto:thaitraicau123@gmail.com" className="text-[#37352f] hover:text-[#2383e2] transition-colors">thaitraicau123@gmail.com</a></span>
              </li>
              <li className="text-[#9b9a97] pt-1">
                Thời gian hỗ trợ: 8:00 - 23:00 hàng ngày (kể cả Thứ 7, CN)
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#e9e9e8] flex flex-col sm:flex-row items-center justify-between text-[#9b9a97] text-[11px] gap-2">
          <p className="flex items-center space-x-1.5">
            <span>© 2026 ÔnThiHub. Thiết kế theo tiêu chuẩn giao diện Notion tối giản & tập trung.</span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="opacity-0 hover:opacity-100 transition-opacity p-0.5 text-[#9b9a97] hover:text-[#37352f] cursor-default focus:opacity-100"
                title="Quản trị"
                tabIndex={-1}
              >
                •
              </button>
            )}
          </p>
          <p className="flex items-center space-x-1">
            <span>Xây dựng cho sĩ tử Việt Nam</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
