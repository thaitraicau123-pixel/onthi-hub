import React, { useState } from 'react';
import {
  X,
  Tag,
  Coins,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Store
} from 'lucide-react';
import { publishDeckToMarketplace } from '../data/marketplaceData';
import { getUserTier, getTierLimits } from '../utils/userTier';
import { playSound } from '../utils/storage';
import confetti from 'canvas-confetti';
import { useModalDismiss } from '../hooks/useModalDismiss';

export default function SellDeckModal({
  course,
  user,
  onClose,
  onSellSuccess
}) {
  const [sellTitle, setSellTitle] = useState(course?.title || '');
  const [sellPriceXu, setSellPriceXu] = useState(() => {
    return Math.max(2, course?.priceXu ? Math.min(course.priceXu, 50) : 15);
  });
  const [sellCategory, setSellCategory] = useState(course?.category || 'video-ai');
  const [sellDescription, setSellDescription] = useState(
    course?.subtitle || course?.description || 'Gói Prompt AI & Kịch bản thực chiến do Creator chia sẻ.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userTier = getUserTier();
  const tierConfig = getTierLimits()[userTier] || getTierLimits().free;
  const feePercent = tierConfig.marketplaceFee || 10;
  const netEarnings = Math.max(1, Math.round(sellPriceXu * (1 - feePercent / 100)));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!course) return;

    if (!sellTitle.trim()) {
      alert('Vui lòng nhập tiêu đề gói prompt!');
      return;
    }

    if (sellPriceXu < 2) {
      alert('Giá bán tối thiểu là 2 Xu (~2.000đ)!');
      return;
    }

    setIsSubmitting(true);

    try {
      const cardsList = course.previewCards || course.cards || course.sampleCards || [];
      const quizList = course.previewQuiz || course.quiz || [];

      const newMarketDeck = publishDeckToMarketplace({
        title: sellTitle.trim(),
        description: sellDescription.trim() || `Gói Prompt do ${user?.displayName || 'Creator'} chia sẻ.`,
        category: sellCategory,
        categoryName:
          sellCategory === 'video-ai'
            ? 'Video AI Triệu View'
            : sellCategory === 'image-ai'
            ? 'Ảnh AI Studio'
            : sellCategory === 'copy-mmo'
            ? 'Kịch Bản Content MMO'
            : sellCategory === 'skills-automation'
            ? 'AI Skills & Auto'
            : 'Tool & Tài Khoản MMO',
        categoryLabel:
          sellCategory === 'video-ai'
            ? 'Video AI Triệu View'
            : sellCategory === 'image-ai'
            ? 'Ảnh AI Studio'
            : sellCategory === 'copy-mmo'
            ? 'Kịch Bản Content MMO'
            : sellCategory === 'skills-automation'
            ? 'AI Skills & Auto'
            : 'Tool & Tài Khoản MMO',
        priceXu: Math.max(2, parseInt(sellPriceXu, 10) || 15),
        cardCount: cardsList.length || course.cardCount || 10,
        authorName: user?.displayName || course.authorName || 'Creator PromptMMO',
        authorEmail: user?.email || '',
        authorAvatar:
          user?.photoURL ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        authorTier: userTier,
        cards: cardsList,
        previewCards: cardsList,
        sampleCards: cardsList,
        previewQuiz: quizList,
        isCustomUserDeck: true
      });

      playSound('success');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onSellSuccess?.(newMarketDeck);
      onClose();
    } catch (err) {
      alert('Có lỗi xảy ra khi đăng bán gói Prompt: ' + (err.message || 'Lỗi mạng'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close on Escape key
  useModalDismiss(onClose);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto cursor-pointer"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-[#e9e9e8] dark:border-white/10 shadow-2xl overflow-hidden my-6 text-[#37352f] dark:text-slate-100 cursor-default"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#fbfbfa] dark:bg-slate-900/90 border-b border-[#e9e9e8] dark:border-white/10 text-[#37352f] dark:text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#2383e2]/10 dark:bg-blue-500/20 text-[#2383e2] dark:text-blue-400 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#37352f] dark:text-white">
                Đăng Bán Gói Prompt Lên Chợ C2C
              </h3>
              <p className="text-[11px] text-[#787774] dark:text-slate-400">
                Kiếm Xu vào ví khi Creator khác mua gói Prompt của bạn (Nhận tới 80% Xu)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs text-[#787774] dark:text-slate-300 hover:text-[#37352f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-slate-800 rounded-md border border-[#e9e9e8] dark:border-white/10 bg-white dark:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng (hoặc nhấn Esc, bấm ra ngoài)"
          >
            <span>Đóng</span>
            <kbd className="hidden sm:inline text-[10px] font-mono bg-[#f0efed] dark:bg-slate-700 px-1 py-0.5 rounded text-[#787774] dark:text-slate-300">Esc</kbd>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          
          {/* Deck Summary Card */}
          <div className="p-4 rounded-lg bg-[#f7f6f5] dark:bg-slate-800/80 border border-[#e9e9e8] dark:border-white/10">
            <div className="flex items-center justify-between">
              <span className="notion-tag notion-tag-blue text-[10px] font-semibold">
                GÓI PROMPT CỦA BẠN
              </span>
              <span className="text-[11px] font-medium text-[#787774] dark:text-slate-400">
                {course?.previewCards?.length || course?.cardCount || 10} Prompts thực chiến
              </span>
            </div>
            
            <div className="mt-2.5">
              <label className="text-[11px] font-semibold text-[#787774] dark:text-slate-400 block mb-1">
                Tiêu đề hiển thị trên sàn:
              </label>
              <input
                type="text"
                value={sellTitle}
                onChange={(e) => setSellTitle(e.target.value)}
                placeholder="VD: 50+ Prompt Video 8K Higgsfield & Kling 1.5 Triệu View..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-[#e9e9e8] dark:border-white/10 rounded-lg text-xs font-semibold text-[#37352f] dark:text-white outline-none focus:border-[#2383e2] dark:focus:border-blue-400 focus:ring-1 focus:ring-[#2383e2]"
              />
            </div>
          </div>

          {/* Pricing & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Price setting */}
            <div>
              <label className="text-xs font-semibold text-[#37352f] dark:text-slate-200 flex items-center justify-between mb-1.5">
                <span>Giá bán (Xu):</span>
                <span className="text-[10px] text-[#2383e2] dark:text-blue-400 font-semibold">1 Xu = 1.000đ</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="2"
                  max="200"
                  value={sellPriceXu}
                  onChange={(e) => setSellPriceXu(Math.max(1, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-[#e9e9e8] dark:border-white/10 rounded-lg text-xs font-semibold text-[#37352f] dark:text-white outline-none focus:border-[#2383e2] dark:focus:border-blue-400 focus:ring-1 focus:ring-[#2383e2]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-amber-700 dark:text-amber-400">
                  Xu
                </span>
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="text-xs font-semibold text-[#37352f] dark:text-slate-200 block mb-1.5">
                Danh mục Prompt & Skills:
              </label>
              <select
                value={sellCategory}
                onChange={(e) => setSellCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-[#e9e9e8] dark:border-white/10 rounded-lg text-xs font-semibold text-[#37352f] dark:text-white outline-none focus:border-[#2383e2] dark:focus:border-blue-400 focus:ring-1 focus:ring-[#2383e2] cursor-pointer"
              >
                <option value="video-ai">🎬 Video AI Triệu View</option>
                <option value="image-ai">🎨 Ảnh AI Chuẩn Studio</option>
                <option value="copy-mmo">✍️ Kịch Bản & Content MMO</option>
                <option value="skills-automation">⚡ AI Skills & Auto</option>
                <option value="acc-tools">🔑 Tool & Tài Khoản MMO</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-[#37352f] dark:text-slate-200 block mb-1.5">
              Mô tả ngắn thu hút người mua:
            </label>
            <textarea
              rows="2"
              value={sellDescription}
              onChange={(e) => setSellDescription(e.target.value)}
              placeholder="Tóm tắt Use Case, công cụ hỗ trợ và mẹo quay dựng kiếm triệu view..."
              className="w-full p-2.5 bg-white dark:bg-slate-800 border border-[#e9e9e8] dark:border-white/10 rounded-lg text-xs text-[#37352f] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#2383e2] dark:focus:border-blue-400 focus:ring-1 focus:ring-[#2383e2] resize-none"
            />
          </div>

          {/* Financial Breakdown */}
          <div className="p-3.5 rounded-lg bg-[#f7f6f5] dark:bg-slate-800/80 border border-[#e9e9e8] dark:border-white/10 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[#787774] dark:text-slate-400">
              <span>Giá niêm yết bán:</span>
              <span className="text-[#37352f] dark:text-white font-semibold">{sellPriceXu} Xu (~{(sellPriceXu * 1000).toLocaleString()}đ)</span>
            </div>
            <div className="flex items-center justify-between text-[#787774] dark:text-slate-400">
              <span>Phí sàn nền tảng ({tierConfig.name} {feePercent}%):</span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">-{Math.round(sellPriceXu * (feePercent / 100))} Xu</span>
            </div>
            <div className="border-t border-[#e9e9e8] dark:border-white/10 pt-1.5 flex items-center justify-between font-semibold text-emerald-800 dark:text-emerald-400 text-sm">
              <span>Bạn thực nhận mỗi lượt mua:</span>
              <span className="text-base text-emerald-700 dark:text-emerald-400">+{netEarnings} Xu</span>
            </div>
          </div>

          {/* Real-time Firebase Sync notice */}
          <div className="flex items-start space-x-2 text-[11px] text-[#787774] dark:text-slate-400 p-2.5 bg-[#fbfbfa] dark:bg-slate-800/50 rounded-lg border border-[#e9e9e8] dark:border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              🔥 <strong>Tự động đưa lên Firebase:</strong> Gói Prompt sẽ xuất hiện ngay lập tức trên Chợ Prompt C2C cho toàn bộ cộng đồng MMO nhìn thấy và mua!
            </span>
          </div>

          {/* Submit buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#e9e9e8] dark:border-white/10 text-xs font-medium text-[#787774] dark:text-slate-300 hover:bg-black/5 dark:hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang Đăng Lên Sàn...' : 'Xác Nhận Đăng Bán Ngay'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
