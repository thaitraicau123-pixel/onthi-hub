import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Download,
  AlertCircle,
  Clock,
  CheckCircle2,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  generateVietQRUrl,
  validateCoupon,
  savePurchasedCourse,
  getSavedEmail,
  getBankConfig,
  saveBankConfig,
  playSound
} from '../utils/storage';

export default function PaymentModal({
  item, // Course object or COMBO_PACKAGE
  isCombo = false,
  onClose,
  onPaymentSuccess
}) {
  const [email, setEmail] = useState(getSavedEmail() || '');
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState({ text: '', isError: false });
  const [discountAmount, setDiscountAmount] = useState(0);
  
  // Unique memo code for each order
  const [orderCode] = useState(() => 'ONTHI' + Math.floor(100000 + Math.random() * 900000));
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // Bank Info from localStorage
  const [bankConfig, setBankConfig] = useState(() => getBankConfig());
  const [showBankEditor, setShowBankEditor] = useState(false);
  const [customBank, setCustomBank] = useState(bankConfig.bank);
  const [customAccNo, setCustomAccNo] = useState(bankConfig.accountNo);
  const [customAccName, setCustomAccName] = useState(bankConfig.accountName);

  const handleSaveBank = (e) => {
    e.preventDefault();
    const updated = {
      ...bankConfig,
      bank: customBank.trim().toUpperCase(),
      accountNo: customAccNo.trim(),
      accountName: customAccName.trim().toUpperCase()
    };
    setBankConfig(updated);
    saveBankConfig(updated);
    setShowBankEditor(false);
  };

  const originalPrice = item.price;
  const finalPrice = Math.max(10000, originalPrice - discountAmount);

  // QR Code Image URL
  const qrUrl = generateVietQRUrl({
    bank: bankConfig.bank,
    accountNo: bankConfig.accountNo,
    accountName: bankConfig.accountName,
    amount: finalPrice,
    memo: orderCode
  });

  // Countdown timer
  useEffect(() => {
    if (isPaid || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaid, timeLeft]);

  // Copy helper
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Apply Coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!coupon.trim()) return;
    const res = validateCoupon(coupon, originalPrice);
    if (res.valid) {
      setDiscountAmount(res.discount);
      setCouponMsg({ text: res.message, isError: false });
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  // Verify Payment Simulation / Real Check
  const handleVerifyPayment = () => {
    setIsVerifying(true);
    
    // Simulate real bank webhook check (takes 2 seconds)
    setTimeout(() => {
      setIsVerifying(false);
      setIsPaid(true);
      playSound('success');

      // Save to localStorage
      savePurchasedCourse(item.id, email);

      // Trigger Confetti
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });

      if (onPaymentSuccess) {
        onPaymentSuccess(item.id);
      }
    }, 1800);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-200 animate-spring-3d">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {isPaid ? 'Mở Khóa Thành Công!' : 'Thanh Toán Tự Động VietQR'}
              </h4>
              <p className="text-xs text-slate-500">
                {isPaid ? 'Đơn hàng đã được ghi nhận' : 'Kích hoạt ngay trong 3 giây qua ngân hàng'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          
          {isPaid ? (
            /* SUCCESS STATE */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                Giao Dịch Thành Công • Mã Đơn {orderCode}
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Chúc Mừng Bạn Đã Sở Hữu Bản Quyền!
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Tài liệu <strong>"{item.title}"</strong> đã được mở khóa vĩnh viễn trên trình duyệt này và sẵn sàng để tải về.
              </p>

              {/* Action Buttons for Download / Study */}
              <div className="mt-6 space-y-3 max-w-sm mx-auto">
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Vào Học Trực Tiếp Ngay Bây Giờ</span>
                </button>

                <p className="text-[11px] text-slate-400">
                  Bạn có thể vào mục <strong>"Tủ tài liệu"</strong> ở góc trên bất cứ lúc nào để tải lại file hoặc học tiếp.
                </p>
              </div>
            </div>
          ) : (
            /* PAYMENT CHECKOUT STEP */
            <div>
              
              {/* Product Summary Card */}
              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-indigo-700 uppercase">
                    {isCombo ? 'Gói Khuyến Mãi VIP' : item.categoryLabel || 'Bộ Tài Liệu'}
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                    {item.title}
                  </h5>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="text-base sm:text-lg font-black text-indigo-700">
                    {finalPrice.toLocaleString()}đ
                  </div>
                  {discountAmount > 0 && (
                    <span className="text-[11px] text-rose-500 line-through">
                      {originalPrice.toLocaleString()}đ
                    </span>
                  )}
                </div>
              </div>

              {/* Email & Coupon Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email nhận link & bảo hành:
                  </label>
                  <input
                    type="email"
                    placeholder="vidu@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã giảm giá (Thử: <span className="text-indigo-600 font-bold">KHAITRUONG</span>):
                  </label>
                  <form onSubmit={handleApplyCoupon} className="flex space-x-1.5">
                    <input
                      type="text"
                      placeholder="Nhập mã..."
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white uppercase font-semibold"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shrink-0"
                    >
                      Áp dụng
                    </button>
                  </form>
                  {couponMsg.text && (
                    <p className={`text-[10px] mt-1 ${couponMsg.isError ? 'text-rose-600' : 'text-emerald-600'} font-medium`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>
              </div>

              {/* VietQR Display & Bank Info */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                
                {/* QR Code */}
                <div className="shrink-0 text-center">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 inline-block">
                    <img
                      src={qrUrl}
                      alt="VietQR Chuyển Khoản"
                      className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-center space-x-1 text-[11px] text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Hết hạn trong: <strong className="text-amber-600">{formatTimer(timeLeft)}</strong></span>
                  </div>
                </div>

                {/* Transfer Details */}
                <div className="flex-1 w-full space-y-2 text-xs">
                  
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Ngân hàng:</span>
                      <strong className="text-slate-800">{bankConfig.bankName}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Số tài khoản:</span>
                      <strong className="text-sm font-mono text-indigo-700 tracking-wide">{bankConfig.accountNo}</strong>
                    </div>
                    <button
                      onClick={() => handleCopy(bankConfig.accountNo, 'acc')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold flex items-center space-x-1"
                    >
                      {copiedField === 'acc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'acc' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Chủ tài khoản:</span>
                      <strong className="text-slate-800">{bankConfig.accountName}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-amber-700 font-semibold block">Nội dung chuyển khoản (bắt buộc):</span>
                      <strong className="text-sm font-mono text-amber-900 tracking-wider font-black">{orderCode}</strong>
                    </div>
                    <button
                      onClick={() => handleCopy(orderCode, 'memo')}
                      className="px-2 py-1 rounded bg-amber-200 hover:bg-amber-300 text-amber-900 text-[11px] font-bold flex items-center space-x-1"
                    >
                      {copiedField === 'memo' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'memo' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Số tiền cần chuyển:</span>
                      <strong className="text-sm text-emerald-600 font-black">{finalPrice.toLocaleString()}đ</strong>
                    </div>
                    <button
                      onClick={() => handleCopy(finalPrice.toString(), 'amount')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold flex items-center space-x-1"
                    >
                      {copiedField === 'amount' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'amount' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* Bank Customization Accordion (For Shop Owner) */}
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={() => setShowBankEditor(!showBankEditor)}
                  className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 underline"
                >
                  {showBankEditor ? 'Đóng cấu hình' : '⚙️ Đổi STK nhận tiền (Dành cho chủ web)'}
                </button>

                {showBankEditor && (
                  <form onSubmit={handleSaveBank} className="mt-2 p-3 bg-white rounded-xl border border-indigo-200 text-left space-y-2 text-xs shadow-sm">
                    <p className="font-bold text-slate-800 text-[11px]">Cài đặt tài khoản ngân hàng nhận tiền thật:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 block">Mã Ngân Hàng:</label>
                        <input
                          type="text"
                          placeholder="MB, VCB, TCB, VPB..."
                          value={customBank}
                          onChange={(e) => setCustomBank(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono uppercase"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">Số Tài Khoản:</label>
                        <input
                          type="text"
                          placeholder="0123456789"
                          value={customAccNo}
                          onChange={(e) => setCustomAccNo(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">Tên Chủ TK:</label>
                        <input
                          type="text"
                          placeholder="NGUYEN VAN A"
                          value={customAccName}
                          onChange={(e) => setCustomAccName(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded uppercase font-mono"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold"
                      >
                        Lưu Cấu Hình STK
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Status & Verify Button */}
              <div className="mt-5 space-y-3">
                <button
                  onClick={handleVerifyPayment}
                  disabled={isVerifying}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-200 flex items-center justify-center space-x-2 transition-all disabled:opacity-75"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang kiểm tra giao dịch với ngân hàng...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tôi Đã Chuyển Khoản • Kiểm Tra & Mở Khóa Ngay</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hệ thống tự động kích hoạt 24/7 qua SePay / VietQR. Hoàn tiền 100% nếu tài liệu lỗi.</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
