import React from 'react';
import { ShieldCheck, Mail, Phone } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { APP_VERSION } from '../data/changelogData';

function Footer({ onOpenAdmin, onSwitchTab }) {
  const handleNav = (tab) => (e) => {
    e.preventDefault();
    if (onSwitchTab) {
      onSwitchTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-50/80 dark:bg-[#0c0c0e]/80 backdrop-blur-xl text-slate-500 dark:text-zinc-400 py-10 border-t border-black/[0.06] dark:border-white/[0.08] text-xs transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2.5 text-[#37352f] dark:text-white mb-3">
              <BrandLogo size={28} className="shadow-xs" />
              <span className="text-base font-extrabold text-[#37352f] dark:text-white tracking-tight">
                PromptMMO
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40">
                {APP_VERSION}
              </span>
            </div>
            <p className="text-[#787774] dark:text-slate-400 text-xs max-w-sm leading-relaxed mb-4">
              Chợ Prompt & AI Skills thực chiến hàng đầu cho Creator, Video Editor & Dân MMO. Tuyển tập Prompt Higgsfield, Kling 1.5 video 8K, Flux/Midjourney ảnh studio thương mại và Workflow N8N tự động hóa kiếm tiền 24/7.
            </p>
            <div className="flex items-center space-x-2 text-[#448361] dark:text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Thanh toán tự động qua VietQR • Nhận Prompt & Cập nhật trọn đời</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#37352f] dark:text-white font-bold text-xs mb-3 uppercase tracking-wider">
              Danh Mục Prompt
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#marketplace" onClick={handleNav('marketplace')} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer">
                  🎬 Video AI Triệu View (Higgsfield & Kling)
                </a>
              </li>
              <li>
                <a href="#marketplace" onClick={handleNav('marketplace')} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer">
                  🎨 Ảnh AI Studio (Flux.1 & Midjourney)
                </a>
              </li>
              <li>
                <a href="#marketplace" onClick={handleNav('marketplace')} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer">
                  ✍️ Kịch Bản TikTok Shop & Livestream
                </a>
              </li>
              <li>
                <a href="#skills" onClick={handleNav('skills')} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer">
                  ⚡ Kho 238+ AI Skills & Agents
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
            <span>© 2026 PromptMMO {APP_VERSION}. Nền tảng mua bán Prompt & AI Skills thực chiến.</span>
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

export default React.memo(Footer);
