import React from 'react';
import { ShieldCheck, Mail, Phone } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { APP_VERSION } from '../data/changelogData';

export default function Footer({ onOpenAdmin }) {
  const scrollToCatalog = (e) => {
    e.preventDefault();
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#f7f6f5]/95 dark:bg-slate-950/90 backdrop-blur-md text-[#787774] dark:text-slate-400 py-10 border-t border-[#e9e9e8] dark:border-white/10 text-xs transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2.5 text-[#37352f] dark:text-white mb-3">
              <BrandLogo size={28} className="shadow-xs" />
              <span className="text-base font-extrabold text-[#37352f] dark:text-white tracking-tight">
                Ôn Thi Hub
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/80 text-[#2383e2] dark:text-sky-300 border border-sky-200 dark:border-sky-500/40">
                {APP_VERSION}
              </span>
            </div>
            <p className="text-[#787774] dark:text-slate-400 text-xs max-w-sm leading-relaxed mb-4">
              Nền tảng kho tài liệu số, bộ đề thi chuẩn hóa và Flashcard Anki ứng dụng thuật toán lặp lại ngắt quãng Spaced Repetition (SM-2). Đồng hành cùng sỹ tử thi đỗ công chức, nâng band ngoại ngữ và chinh phục phỏng vấn IT.
            </p>
            <div className="flex items-center space-x-2 text-[#448361] dark:text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Thanh toán tự động qua VietQR • Bảo hành cập nhật trọn đời</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#37352f] dark:text-white font-bold text-xs mb-3 uppercase tracking-wider">
              Danh Mục Trọng Tâm
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#catalog-section" onClick={scrollToCatalog} className="hover:text-[#2383e2] dark:hover:text-sky-400 transition-colors">
                  🏛️ Đề Thi Công Chức 2026
                </a>
              </li>
              <li>
                <a href="#catalog-section" onClick={scrollToCatalog} className="hover:text-[#2383e2] dark:hover:text-sky-400 transition-colors">
                  💻 Phỏng Vấn IT & System Design
                </a>
              </li>
              <li>
                <a href="#catalog-section" onClick={scrollToCatalog} className="hover:text-[#2383e2] dark:hover:text-sky-400 transition-colors">
                  🌍 Từ Vựng IELTS 7.5+ & TOEIC
                </a>
              </li>
              <li>
                <a href="#catalog-section" onClick={scrollToCatalog} className="hover:text-[#2383e2] dark:hover:text-sky-400 transition-colors">
                  🇯🇵 Kanji JLPT N3 - N2 Siêu Tốc
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[#37352f] dark:text-white font-bold text-xs mb-3 uppercase tracking-wider">
              Hỗ Trợ Kỹ Thuật 24/7
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#2383e2] dark:text-sky-400 shrink-0" />
                <span>
                  Hotline / Zalo:{' '}
                  <a href="tel:0986019623" className="text-[#37352f] dark:text-white hover:text-[#2383e2] dark:hover:text-sky-400 transition-colors font-bold">
                    0986019623
                  </a>
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#2383e2] dark:text-sky-400 shrink-0" />
                <span className="truncate">
                  Email:{' '}
                  <a href="mailto:thaitraicau123@gmail.com" className="text-[#37352f] dark:text-white hover:text-[#2383e2] dark:hover:text-sky-400 transition-colors">
                    thaitraicau123@gmail.com
                  </a>
                </span>
              </li>
              <li className="text-[#9b9a97] dark:text-slate-500 pt-1">
                Thời gian hỗ trợ: 08:00 - 23:00 hàng ngày (kể cả Thứ 7, CN)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#e9e9e8] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-[#9b9a97] dark:text-slate-500 text-[11px] gap-2">
          <p className="flex items-center space-x-1.5">
            <span>© 2026 ÔnThiHub {APP_VERSION}. Thiết kế tối ưu cho trải nghiệm học tập tập trung.</span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="opacity-0 hover:opacity-100 transition-opacity p-0.5 text-[#9b9a97] hover:text-[#37352f] dark:hover:text-white cursor-default focus:opacity-100"
                title="Quản trị"
                tabIndex={-1}
              >
                •
              </button>
            )}
          </p>
          <p className="flex items-center space-x-1">
            <span>Đồng bộ chuẩn Giờ Hà Nội (GMT+7)</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
