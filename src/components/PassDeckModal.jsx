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

      alert(`🎉 Đăng pass bộ thẻ thành công!\n\nBộ thẻ "${course.title}" đã được niêm yết tại mục "🔁 Góc Pass Lại Học Viên" với giá ${resellPriceXu} Xu.\nKhi có người mua, bạn sẽ nhận được ${netEarnings} Xu vào ví.`);

      onPassSuccess?.(res);
      onClose();
    } catch (err) {
      alert('Có lỗi xảy ra khi niêm yết pass bộ thẻ.');
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
            <div className="w-9 h-9 rounded-2xl bg-[#f02c85] flex items-center justify-center shadow-md">
              <Repeat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight">
                PASS LẠI BỘ THẺ ĐÃ HỌC (C2C RESALE)
              </h3>
              <p className="text-[11px] text-pink-200/80 font-medium">
                Dành cho người mua: Đã thi xong, pass lại kiếm Xu nạp ví
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
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              BỘ THẺ BẠN ĐÃ MUA & SỞ HỮU
            </span>
            <h4 className="text-sm font-black text-[#28071a] mt-1.5 leading-snug">
              {course.title}
            </h4>
            <p className="text-xs text-[#7a5a6b] mt-0.5 line-clamp-2 font-medium">
              {course.subtitle || course.description}
            </p>
            <div className="mt-2 text-[11px] text-[#7a5a6b] font-bold flex items-center space-x-2">
              <span>{course.previewCards?.length || course.cardCount || 50} thẻ ôn tập</span>
              <span>•</span>
              <span>Bản quyền gốc: {course.authorName || 'Giảng viên ÔnThiHub'}</span>
            </div>
          </div>

          {/* Price setting */}
          <div>
            <label className="text-xs font-black text-[#28071a] flex items-center justify-between mb-1.5">
              <span>Giá bạn muốn pass lại (Xu):</span>
              <span className="text-[11px] text-[#f02c85] font-bold">1 Xu = 1.000đ</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="2"
                max="200"
                value={resellPriceXu}
                onChange={(e) => setResellPriceXu(Math.max(1, parseInt(e.target.value, 10) || 0))}
                className="w-full px-4 py-2.5 bg-white border border-[#eadfcb] rounded-xl text-sm font-black text-[#28071a] outline-none focus:border-[#f02c85]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-amber-600">
                Xu (~{(resellPriceXu * 1000).toLocaleString()}đ)
              </span>
            </div>
            <p className="text-[11px] text-[#7a5a6b] mt-1 font-medium">
              💡 Gợi ý: Đặt giá từ 40% - 70% giá gốc để có học viên khác mua ngay trong ngày!
            </p>
          </div>

          {/* Pass Note / Motivation */}
          <div>
            <label className="text-xs font-black text-[#28071a] block mb-1.5">
              Lời nhắn pass lại / Review kết quả ôn thi:
            </label>
            <textarea
              rows="3"
              value={passNote}
              onChange={(e) => setPassNote(e.target.value)}
              placeholder="VD: Mình vừa thi đậu công chức đợt vừa rồi được 56 điểm! Bộ thẻ này tóm tắt cực sát đề thi thật, pass lại cho các bạn khóa sau ôn gấp..."
              className="w-full p-3 bg-white border border-[#eadfcb] rounded-xl text-xs font-medium text-[#28071a] outline-none focus:border-[#f02c85] resize-none"
            />
          </div>

          {/* Financial Breakdown */}
          <div className="p-3.5 rounded-2xl bg-[#f5ecd8] border border-[#eadfcb] space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-bold text-[#7a5a6b]">
              <span>Giá niêm yết pass:</span>
              <span className="text-[#28071a] font-black">{resellPriceXu} Xu</span>
            </div>
            <div className="flex items-center justify-between font-bold text-[#7a5a6b]">
              <span>Phí sàn nền tảng ({tierConfig.name} {feePercent}%):</span>
              <span className="text-rose-600 font-black">-{Math.round(resellPriceXu * (feePercent / 100))} Xu</span>
            </div>
            <div className="border-t border-[#eadfcb] pt-1.5 flex items-center justify-between font-black text-emerald-800 text-sm">
              <span>Bạn thực nhận khi có người mua:</span>
              <span className="text-base text-emerald-700">+{netEarnings} Xu</span>
            </div>
          </div>

          {/* Rules info */}
          <div className="flex items-start space-x-2 text-[11px] text-[#7a5a6b] font-medium p-2 bg-white/60 rounded-xl">
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
              className="px-4 py-2.5 rounded-xl border border-[#eadfcb] text-xs font-bold text-[#7a5a6b] hover:bg-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl btn-wayground-sunset text-white text-xs font-black shadow-md flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
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
