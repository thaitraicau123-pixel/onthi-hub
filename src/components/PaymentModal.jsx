import React, { useState } from 'react';
import {
  X,
  Coins,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Copy,
  Check,
  Layers,
  Zap,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  savePurchasedCourse,
  generateVietQRUrl,
  getBankConfig,
  playSound
} from '../utils/storage';
import {
  getWalletBalance,
  deductWalletCoins,
  addWalletCoins,
  createDepositRequest
} from '../utils/wallet';
import { useModalDismiss } from '../hooks/useModalDismiss';

export default function PaymentModal({
  item,
  isCombo = false,
  onClose,
  onPaymentSuccess,
  onOpenWallet,
  onGoToLibrary
}) {
  // Close modal on Escape key
  useModalDismiss(onClose, !!item);

  const [walletBalance, setWalletBalance] = useState(() => getWalletBalance());
  const [isPurchasedSuccess, setIsPurchasedSuccess] = useState(false);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [isSimulatingTopup, setIsSimulatingTopup] = useState(false);

  // Calculate base price
  const basePriceXu = item
    ? item.priceXu !== undefined
      ? Number(item.priceXu)
      : item.price
      ? Math.max(5, Math.round(item.price / 3000))
      : 25
    : 25;

  const priceXu = Math.max(1, basePriceXu);

  const [topupAmount, setTopupAmount] = useState(() => {
    if (!item) return 50;
    const bal = getWalletBalance();
    const missing = Math.max(0, priceXu - bal);
    return missing > 0 ? Math.max(20, Math.ceil(missing / 10) * 10) : 50;
  });
  const [topupOrderCode] = useState(() => 'XU' + Math.floor(100000 + Math.random() * 900000));

  if (!item) return null;

  const originalPriceXu = item.originalPriceXu !== undefined
    ? Number(item.originalPriceXu)
    : Math.round(basePriceXu * 2.5);

  const discountXu = Math.max(0, originalPriceXu - priceXu);
  const hasEnoughCoins = walletBalance >= priceXu;
  const missingCoins = Math.max(0, priceXu - walletBalance);
  const bankConfig = getBankConfig();

  // VietQR for quick top-up
  const qrUrl = generateVietQRUrl({
    bank: bankConfig.bank,
    accountNo: bankConfig.accountNo,
    accountName: bankConfig.accountName,
    amount: topupAmount * 1000,
    memo: `NAPXU ${topupOrderCode}`
  });

  const handleConfirmPurchase = () => {
    if (!hasEnoughCoins) {
      setIsTopupOpen(true);
      return;
    }

    const deducted = deductWalletCoins(priceXu);
    if (deducted) {
      savePurchasedCourse(item.id);
      const nextBal = getWalletBalance();
      setWalletBalance(nextBal);
      setIsPurchasedSuccess(true);
      playSound('success');
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (onPaymentSuccess) {
        onPaymentSuccess(item.id);
      }
    } else {
      alert('Số dư ví không đủ! Vui lòng nạp thêm Xu để tiếp tục.');
      setIsTopupOpen(true);
    }
  };

  const handleSimulateTopup = async () => {
    setIsSimulatingTopup(true);
    // Create official deposit request so Admin receives phone push and email notification
    await createDepositRequest({
      xuAmount: topupAmount,
      userEmail: 'user_nap_the@onthihub.vn'
    });
    setTimeout(() => {
      addWalletCoins(topupAmount);
      const updated = getWalletBalance();
      setWalletBalance(updated);
      setIsSimulatingTopup(false);
      setIsTopupOpen(false);
      playSound('success');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      alert(`🎉 Đã xác nhận chuyển khoản! Lệnh nạp ${topupAmount} Xu đã được tạo và gửi thông báo tới Admin. Ví của bạn đã được cộng ${topupAmount} Xu để mở khóa bộ thẻ ngay.`);
    }, 1200);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in cursor-pointer"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-xl border border-[#e9e9e8] shadow-2xl overflow-hidden flex flex-col text-[#37352f] animate-scale-up my-auto cursor-default"
      >
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#fbfbfa] text-[#37352f] flex items-center justify-between border-b border-[#e9e9e8] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Coins className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#37352f]">
                Mở Khóa Tài Liệu Bằng Xu
              </h3>
              <p className="text-[11px] text-[#787774]">
                Nền tảng thanh toán bằng Xu ÔnThiHub tiện lợi và tức thì
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs text-[#787774] hover:text-[#37352f] hover:bg-black/5 rounded-md border border-[#e9e9e8] bg-white transition-colors cursor-pointer"
            title="Đóng (hoặc nhấn Esc, bấm ra ngoài)"
          >
            <span>Đóng</span>
            <kbd className="hidden sm:inline text-[10px] font-mono bg-[#f0efed] px-1 py-0.5 rounded text-[#787774]">Esc</kbd>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto bg-white">
          
          {/* SUCCESS STATE */}
          {isPurchasedSuccess ? (
            <div className="py-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="notion-tag notion-tag-green text-xs font-semibold">
                  GIAO DỊCH HOÀN TẤT 100%
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#37352f] mt-2">
                  Mở Khóa Thành Công!
                </h3>
                <p className="text-xs text-[#787774] mt-1 max-w-sm mx-auto leading-relaxed">
                  Bộ thẻ <strong>"{item.title}"</strong> đã được chuyển vĩnh viễn vào Tủ Tài Liệu của bạn.
                </p>
              </div>

              {/* Remaining Coins Info */}
              <div className="p-3 bg-[#f7f6f5] rounded-lg border border-[#e9e9e8] max-w-xs mx-auto text-xs flex items-center justify-between">
                <span className="text-[#787774] font-medium">Số dư ví còn lại:</span>
                <strong className="text-[#37352f] font-semibold flex items-center space-x-1">
                  <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>{walletBalance} Xu</span>
                </strong>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onGoToLibrary) onGoToLibrary();
                  }}
                  className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-semibold shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Vào Tủ Học Ngay</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-[#e9e9e8] bg-white hover:bg-black/5 text-[#787774] text-xs font-medium transition-colors"
                >
                  Đóng Lại
                </button>
              </div>
            </div>
          ) : (
            /* NORMAL PURCHASE FLOW */
            <>
              {/* Item Card Recap */}
              <div className="p-4 bg-[#f7f6f5] rounded-lg border border-[#e9e9e8] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="notion-tag notion-tag-blue text-[10px] font-semibold">
                    {item.categoryLabel || (isCombo ? 'GÓI COMBO VIP' : 'TÀI LIỆU CHỌN LỌC')}
                  </span>
                  {item.badge && (
                    <span className="notion-tag notion-tag-yellow text-[10px] font-semibold">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-bold text-[#37352f] line-clamp-2 leading-snug">
                  {item.title}
                </h4>

                {item.subtitle && (
                  <p className="text-xs text-[#787774] line-clamp-2">
                    {item.subtitle}
                  </p>
                )}

                {/* Price Pill */}
                <div className="pt-2 border-t border-[#e9e9e8] flex items-baseline justify-between">
                  <span className="text-xs text-[#787774]">Giá mở khóa bằng Xu:</span>
                  <div className="flex items-baseline space-x-2">
                    <div className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
                      <strong className="text-lg font-bold text-[#37352f]">
                        {priceXu} Xu
                      </strong>
                    </div>
                    {originalPriceXu > priceXu && (
                      <span className="text-xs text-[#787774] line-through">
                        {originalPriceXu} Xu
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Wallet Balance Box */}
              <div className={`p-4 rounded-lg border transition-all ${
                hasEnoughCoins
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/50 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#787774]">Số dư ví của bạn:</span>
                  <div className="flex items-center space-x-1">
                    <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <strong className="text-base font-bold text-[#37352f]">
                      {walletBalance} Xu
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-black/5">
                  <span className="text-[#787774]">
                    {hasEnoughCoins ? 'Số dư sau khi thanh toán:' : 'Trạng thái ví:'}
                  </span>
                  {hasEnoughCoins ? (
                    <strong className="text-emerald-700 font-semibold">
                      Còn {walletBalance - priceXu} Xu (Đủ Xu)
                    </strong>
                  ) : (
                    <strong className="text-rose-700 font-semibold">
                      Thiếu {missingCoins} Xu (Cần nạp thêm)
                    </strong>
                  )}
                </div>
              </div>

              {/* Not Enough Coins Alert & Top-up Drawer */}
              {!hasEnoughCoins && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Trang web chỉ chấp nhận Tiền Xu để bảo vệ bản quyền. Bạn có thể nạp thêm Xu qua VietQR để mở khóa ngay bộ thẻ.
                    </p>
                  </div>

                  {!isTopupOpen ? (
                    <button
                      onClick={() => setIsTopupOpen(true)}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-semibold shadow-xs flex items-center justify-center space-x-2 transition-colors"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Nạp Thêm Xu Ngay (Quét VietQR)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    /* Embedded VietQR Quick Topup Panel */
                    <div className="p-4 bg-[#fbfbfa] rounded-lg border border-[#e9e9e8] space-y-3 text-xs animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-[#e9e9e8]">
                        <div className="flex items-center space-x-2">
                          <QrCode className="w-4 h-4 text-[#2383e2]" />
                          <strong className="font-semibold text-[#37352f]">
                            Nạp Xu Nhanh Bằng VietQR (Tự Động)
                          </strong>
                        </div>
                        <button
                          onClick={() => setIsTopupOpen(false)}
                          className="text-[#787774] hover:text-[#37352f] text-xs"
                        >
                          Thu gọn
                        </button>
                      </div>

                      {/* Select Top-up Tier */}
                      <div>
                        <span className="text-[#787774] block mb-1.5 text-[11px]">
                          Chọn số lượng Xu cần nạp:
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { xu: Math.max(20, Math.ceil(missingCoins / 10) * 10), label: 'Vừa Đủ' },
                            { xu: 50, label: '50 Xu (~50K)' },
                            { xu: 100, label: '100 Xu (+10 Xu)' }
                          ].map((tier, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setTopupAmount(tier.xu)}
                              className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                                topupAmount === tier.xu
                                  ? 'bg-[#37352f] text-white border-[#37352f]'
                                  : 'bg-white border-[#e9e9e8] text-[#37352f] hover:bg-black/5'
                              }`}
                            >
                              <div className="font-semibold">{tier.xu} Xu</div>
                              <div className="text-[10px] opacity-80 mt-0.5">
                                {(tier.xu * 1000).toLocaleString()}đ
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* QR Code Display */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <div className="w-32 h-32 bg-white rounded-lg border border-[#e9e9e8] p-1.5 shrink-0 flex items-center justify-center">
                          <img
                            src={qrUrl}
                            alt="VietQR Topup"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="space-y-1.5 text-[11px] flex-1">
                          <div>
                            <span className="text-[#787774] block">Số tiền chuyển:</span>
                            <strong className="text-sm font-bold text-[#2383e2]">
                              {(topupAmount * 1000).toLocaleString()} VNĐ
                            </strong>
                          </div>
                          <div>
                            <span className="text-[#787774] block">Nội dung chuyển khoản (Bắt buộc):</span>
                            <div className="flex items-center space-x-1.5 mt-0.5">
                              <code className="px-2 py-1 bg-amber-50 rounded-md font-mono font-semibold text-amber-900 text-xs border border-amber-200">
                                NAPXU {topupOrderCode}
                              </code>
                              <button
                                type="button"
                                onClick={() => handleCopy(`NAPXU ${topupOrderCode}`)}
                                className="p-1 rounded-md bg-white border border-[#e9e9e8] hover:bg-black/5 text-[#787774]"
                                title="Copy cú pháp"
                              >
                                {copiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Confirm Paid Button */}
                      <button
                        type="button"
                        disabled={isSimulatingTopup}
                        onClick={handleSimulateTopup}
                        className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                      >
                        {isSimulatingTopup ? (
                          <span>Đang kiểm tra giao dịch chuyển khoản...</span>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Tôi Đã Chuyển Khoản Xong</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Primary Action Button (When enough coins) */}
              {hasEnoughCoins && (
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleConfirmPurchase}
                    className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm text-white bg-[#2383e2] hover:bg-[#1a73e8] transition-colors flex items-center justify-center space-x-2"
                  >
                    <Coins className="w-4 h-4 fill-white" />
                    <span>Xác Nhận Mở Khóa ({priceXu} Xu)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#787774] text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Trừ trực tiếp từ ví Xu • Mở khóa vĩnh viễn và lưu vào Tủ Tài Liệu</span>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
