import React, { useState } from 'react';
import {
  X,
  Repeat,
  Coins,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { passDeckToMarketplace } from '../data/marketplaceData';
import { getUserTier, getTierLimits } from '../utils/userTier';
import { playSound } from '../utils/storage';
import confetti from 'canvas-confetti';
import { useModalDismiss } from '../hooks/useModalDismiss';

export default function PassDeckModal({
  course,
  user,
  onClose,
  onPassSuccess
}) {
  const [resellPriceXu, setResellPriceXu] = useState(() => {
    // Default suggested price is ~50-60% of original price (min 2 Xu)
    const originalXu = course.priceXu || 4;
    return Math.max(2, Math.round(originalXu * 0.6) || 2);
  });
  const [passNote, setPassNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userTier = getUserTier();
  const tierConfig = getTierLimits()[userTier] || getTierLimits().free;
  const feePercent = tierConfig.marketplaceFee || 10;
  const netEarnings = Math.max(1, Math.round(resellPriceXu * (1 - feePercent / 100)));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!course) return;
    if (resellPriceXu < 2) {
      alert('Giá pass tối thiểu là 2 Xu (~2.000đ)!');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = passDeckToMarketplace({
        originalCourse: course,
        passPriceXu: resellPriceXu,
        passNote: passNote.trim() || 'Học viên đã hoàn thành khóa ôn tập và pass lại cho bạn hữu cùng chí hướng!',
        sellerUser: {
          name: user?.displayName || 'Học Bá Ôn Thi',
          displayName: user?.displayName || 'Học Bá Ôn Thi',
          email: user?.email || '',
          photoURL: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          avatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          tier: userTier
        }
      });

      playSound('success');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onPassSuccess?.(res);
      onClose();
    } catch (err) {
      alert('Có lỗi xảy ra khi niêm yết pass bộ thẻ.');
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
        className="relative w-full max-w-lg bg-white rounded-xl border border-[#e9e9e8] shadow-2xl overflow-hidden my-6 text-[#37352f] cursor-default"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#fbfbfa] border-b border-[#e9e9e8] text-[#37352f]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#2383e2]/10 text-[#2383e2] flex items-center justify-center">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#37352f]">
                Pass Lại Bộ Thẻ Đã Học (C2C Resale)
              </h3>
              <p className="text-[11px] text-[#787774]">
                Dành cho người mua: Đã thi xong, pass lại kiếm Xu nạp ví
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs text-[#787774] hover:text-[#37352f] hover:bg-black/5 rounded-md border border-[#e9e9e8] bg-white transition-colors cursor-pointer"
            title="Đóng (hoặc nhấn Esc, bấm ra ngoài)"
          >
            <span>Đóng</span>
            <kbd className="hidden sm:inline text-[10px] font-mono bg-[#f0efed] px-1 py-0.5 rounded text-[#787774]">Esc</kbd>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          
          {/* Deck Summary Card */}
          <div className="p-4 rounded-lg bg-[#f7f6f5] border border-[#e9e9e8]">
            <span className="notion-tag notion-tag-green text-[10px] font-semibold">
              BỘ THẺ BẠN ĐÃ MUA & SỞ HỮU
            </span>
            <h4 className="text-sm font-bold text-[#37352f] mt-1.5 leading-snug">
              {course.title}
            </h4>
            <p className="text-xs text-[#787774] mt-0.5 line-clamp-2">
              {course.subtitle || course.description}
            </p>
            <div className="mt-2 text-[11px] text-[#787774] flex items-center space-x-2">
              <span>{course.previewCards?.length || course.cardCount || 50} thẻ ôn tập</span>
              <span>•</span>
              <span>Bản quyền gốc: {course.authorName || 'Ban Quản Trị OnThiHub'}</span>
            </div>
          </div>

          {/* Price setting */}
          <div>
            <label className="text-xs font-semibold text-[#37352f] flex items-center justify-between mb-1.5">
              <span>Giá bạn muốn pass lại (Xu):</span>
              <span className="text-[11px] text-[#2383e2] font-medium">1 Xu = 1.000đ</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="2"
                max="200"
                value={resellPriceXu}
                onChange={(e) => setResellPriceXu(Math.max(1, parseInt(e.target.value, 10) || 0))}
                className="w-full px-4 py-2 bg-white border border-[#e9e9e8] rounded-lg text-sm font-semibold text-[#37352f] outline-none focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-amber-700">
                Xu (~{(resellPriceXu * 1000).toLocaleString()}đ)
              </span>
            </div>
            <p className="text-[11px] text-[#787774] mt-1">
              💡 Gợi ý: Đặt giá từ 40% - 70% giá gốc để có học viên khác mua ngay trong ngày!
            </p>
          </div>

          {/* Pass Note / Motivation */}
          <div>
            <label className="text-xs font-semibold text-[#37352f] block mb-1.5">
              Lời nhắn pass lại / Review kết quả ôn thi:
            </label>
            <textarea
              rows="3"
              value={passNote}
              onChange={(e) => setPassNote(e.target.value)}
              placeholder="VD: Mình vừa thi đậu công chức đợt vừa rồi được 56 điểm! Bộ thẻ này tóm tắt cực sát đề thi thật, pass lại cho các bạn khóa sau ôn gấp..."
              className="w-full p-3 bg-white border border-[#e9e9e8] rounded-lg text-xs text-[#37352f] outline-none focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] resize-none"
            />
          </div>

          {/* Financial Breakdown */}
          <div className="p-3.5 rounded-lg bg-[#f7f6f5] border border-[#e9e9e8] space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[#787774]">
              <span>Giá niêm yết pass:</span>
              <span className="text-[#37352f] font-semibold">{resellPriceXu} Xu</span>
            </div>
            <div className="flex items-center justify-between text-[#787774]">
              <span>Phí sàn nền tảng ({tierConfig.name} {feePercent}%):</span>
              <span className="text-rose-600 font-semibold">-{Math.round(resellPriceXu * (feePercent / 100))} Xu</span>
            </div>
            <div className="border-t border-[#e9e9e8] pt-1.5 flex items-center justify-between font-semibold text-emerald-800 text-sm">
              <span>Bạn thực nhận khi có người mua:</span>
              <span className="text-base text-emerald-700">+{netEarnings} Xu</span>
            </div>
          </div>

          {/* Rules info */}
          <div className="flex items-start space-x-2 text-[11px] text-[#787774] p-2.5 bg-[#fbfbfa] rounded-lg border border-[#e9e9e8]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Quy tắc cộng đồng: Chỉ học viên đã mua khóa mới được quyền pass lại. Bộ thẻ sẽ được đăng tải công khai trên Chợ C2C với nhãn "Học viên Pass lại".
            </span>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#e9e9e8] text-xs font-medium text-[#787774] hover:bg-black/5 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <Repeat className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang Niêm Yết...' : 'Xác Nhận Đăng Pass'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
