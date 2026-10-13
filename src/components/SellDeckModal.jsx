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

export default function SellDeckModal({
  course,
  user,
  onClose,
  onSellSuccess
}) {
  const [sellTitle, setSellTitle] = useState(course?.title || '');
  const [sellPriceXu, setSellPriceXu] = useState(() => {
    return Math.max(2, course?.priceXu ? Math.min(course.priceXu, 10) : 4);
  });
  const [sellCategory, setSellCategory] = useState(course?.category || 'cong-chuc');
  const [sellDescription, setSellDescription] = useState(
    course?.subtitle || course?.description || 'Bộ thẻ kiến thức trọng tâm do học viên chia sẻ.'
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
      alert('Vui lòng nhập tiêu đề bộ thẻ!');
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
        description: sellDescription.trim() || `Bộ thẻ do ${user?.displayName || 'Cộng đồng'} chia sẻ.`,
        category: sellCategory,
        categoryName:
          sellCategory === 'cong-chuc'
            ? 'Công Chức'
            : sellCategory === 'it-tech'
            ? 'IT & Lập Trình'
            : 'Ngoại Ngữ',
        categoryLabel:
          sellCategory === 'cong-chuc'
            ? 'Thi Công Chức 2026'
            : sellCategory === 'it-tech'
            ? 'IT & Lập Trình'
            : 'Ngoại Ngữ',
        priceXu: Math.max(2, parseInt(sellPriceXu, 10) || 3),
        cardCount: cardsList.length || course.cardCount || 10,
        authorName: user?.displayName || course.authorName || 'Học Viên Chia Sẻ',
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
      alert('Có lỗi xảy ra khi đăng bán bộ thẻ: ' + (err.message || 'Lỗi mạng'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#fcf7ec] rounded-3xl border-2 border-[#eadfcb] shadow-2xl overflow-hidden my-6 text-[#28071a]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#240618] to-[#450a29] text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#ff5f38] to-[#f02c85] flex items-center justify-center shadow-md">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight">
                ĐĂNG BÁN BỘ THẺ LÊN SÀN C2C
              </h3>
              <p className="text-[11px] text-pink-200/80 font-medium">
                Kiếm Xu vào ví khi học viên khác trên toàn quốc mua bộ thẻ của bạn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-pink-200 hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          
          {/* Deck Summary Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#eadfcb] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-pink-100 text-[#f02c85] border border-pink-200">
                BỘ THẺ TỪ TỦ CỦA BẠN
              </span>
              <span className="text-[11px] font-black text-[#7a5a6b]">
                {course?.previewCards?.length || course?.cardCount || 10} thẻ Anki
              </span>
            </div>
            
            <div className="mt-2.5">
              <label className="text-[11px] font-black text-[#7a5a6b] block mb-1">
                Tiêu đề hiển thị trên sàn:
              </label>
              <input
                type="text"
                value={sellTitle}
                onChange={(e) => setSellTitle(e.target.value)}
                placeholder="VD: 50 Thẻ Ghi Nhớ Nhanh Nghị Định 138..."
                className="w-full px-3 py-2 bg-[#fcf7ec] border border-[#eadfcb] rounded-xl text-xs font-black text-[#28071a] outline-none focus:border-[#f02c85]"
              />
            </div>
          </div>

          {/* Pricing & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Price setting */}
            <div>
              <label className="text-xs font-black text-[#28071a] flex items-center justify-between mb-1.5">
                <span>Giá bán (Xu):</span>
                <span className="text-[10px] text-[#f02c85] font-black">1 Xu = 1.000đ</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="2"
                  max="200"
                  value={sellPriceXu}
                  onChange={(e) => setSellPriceXu(Math.max(1, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#eadfcb] rounded-xl text-xs font-black text-[#28071a] outline-none focus:border-[#f02c85]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-amber-600">
                  Xu
                </span>
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="text-xs font-black text-[#28071a] block mb-1.5">
                Danh mục phân loại:
              </label>
              <select
                value={sellCategory}
                onChange={(e) => setSellCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#eadfcb] rounded-xl text-xs font-black text-[#28071a] outline-none focus:border-[#f02c85] cursor-pointer"
              >
                <option value="cong-chuc">🏛️ Công Chức</option>
                <option value="it-tech">💻 IT & Lập Trình</option>
                <option value="ngoai-ngu">🌐 Ngoại Ngữ</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-black text-[#28071a] block mb-1.5">
              Mô tả ngắn thu hút học viên:
            </label>
            <textarea
              rows="2"
              value={sellDescription}
              onChange={(e) => setSellDescription(e.target.value)}
              placeholder="Tóm tắt nội dung trọng tâm và lý do nên học bộ thẻ này..."
              className="w-full p-2.5 bg-white border border-[#eadfcb] rounded-xl text-xs font-medium text-[#28071a] outline-none focus:border-[#f02c85] resize-none"
            />
          </div>

          {/* Financial Breakdown */}
          <div className="p-3.5 rounded-2xl bg-[#f5ecd8] border border-[#eadfcb] space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-bold text-[#7a5a6b]">
              <span>Giá niêm yết bán:</span>
              <span className="text-[#28071a] font-black">{sellPriceXu} Xu (~{(sellPriceXu * 1000).toLocaleString()}đ)</span>
            </div>
            <div className="flex items-center justify-between font-bold text-[#7a5a6b]">
              <span>Phí sàn nền tảng ({tierConfig.name} {feePercent}%):</span>
              <span className="text-rose-600 font-black">-{Math.round(sellPriceXu * (feePercent / 100))} Xu</span>
            </div>
            <div className="border-t border-[#eadfcb] pt-1.5 flex items-center justify-between font-black text-emerald-800 text-sm">
              <span>Bạn thực nhận mỗi lượt mua:</span>
              <span className="text-base text-emerald-700">+{netEarnings} Xu</span>
            </div>
          </div>

          {/* Real-time Firebase Sync notice */}
          <div className="flex items-start space-x-2 text-[11px] text-[#7a5a6b] font-medium p-2.5 bg-white/70 rounded-xl border border-[#eadfcb]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              🔥 <strong>Tự động đưa lên Firebase:</strong> Bộ thẻ sẽ xuất hiện ngay lập tức trên Chợ Thẻ C2C cho toàn bộ người dùng trên cả nước nhìn thấy và mua!
            </span>
          </div>

          {/* Submit buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#eadfcb] text-xs font-bold text-[#7a5a6b] hover:bg-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl btn-wayground-sunset text-white text-xs font-black shadow-md flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
            >
              <Store className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang Đăng Lên Sàn...' : '🚀 Xác Nhận Đăng Bán Ngay'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
