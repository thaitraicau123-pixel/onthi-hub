import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, MessageCircle, HelpCircle } from 'lucide-react';
import { TESTIMONIALS, FAQS } from '../data/coursesData';

export default function TestimonialsFaq() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-slate-50/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/15 py-10 sm:py-16 px-4 sm:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto">
        
        {/* TESTIMONIALS SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/40">
            Học Viên Nói Gì Về ÔnThiHub
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            Hơn 12,500+ Học Viên Đã Tự Tin Thi Đỗ & Pass Phỏng Vấn
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Kết quả thực tế từ những người đã kiên trì ôn luyện cùng Flashcard Anki mỗi ngày.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14 sm:mb-20">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-white/15 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center space-x-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/20"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{item.role}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-500/30 px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ SECTION */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-500/40">
              Câu Hỏi Thường Gặp
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2">
              Giải Đáp Mọi Thắc Mắc Trước Khi Mua
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-white/15 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-indigo-600 dark:text-sky-400 shrink-0 ml-3" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-300 shrink-0 ml-3" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-200 leading-relaxed border-t border-slate-100 dark:border-white/10 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
