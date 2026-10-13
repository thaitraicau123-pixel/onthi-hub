import React, { useState, useEffect } from 'react';
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
  addWalletCoins
} from '../utils/wallet';

export default function PaymentModal({
  item,
  isCombo = false,
  onClose,
  onPaymentSuccess,
  onOpenWallet,
  onGoToLibrary
}) {
  if (!item) return null;

  const [walletBalance, setWalletBalance] = useState(() => getWalletBalance());
  const [isPurchasedSuccess, setIsPurchasedSuccess] = useState(false);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [isSimulatingTopup, setIsSimulatingTopup] = useState(false);

  // Pure Coin Pricing
  const priceXu = item.priceXu !== undefined
    ? Number(item.priceXu)
    : item.price
    ? Math.max(5, Math.round(item.price / 3000))
    : 25;

  const originalPriceXu = item.originalPriceXu !== undefined
    ? Number(item.originalPriceXu)
    : Math.round(priceXu * 2.5);

  const discountXu = Math.max(0, originalPriceXu - priceXu);
  const hasEnoughCoins = walletBalance >= priceXu;
  const missingCoins = Math.max(0, priceXu - walletBalance);

  // Quick Top-up Selection
  const defaultTopupTier = missingCoins > 0 ? Math.max(20, Math.ceil(missingCoins / 10) * 10) : 50;
  const [topupAmount, setTopupAmount] = useState(defaultTopupTier);
  const [topupOrderCode] = useState(() => 'XU' + Math.floor(100000 + Math.random() * 900000));
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

  const handleSimulateTopup = () => {
    setIsSimulatingTopup(true);
    setTimeout(() => {
      addWalletCoins(topupAmount);
      const updated = getWalletBalance();
      setWalletBalance(updated);
      setIsSimulatingTopup(false);
      setIsTopupOpen(false);
      playSound('success');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      alert(`🎉 Nạp thành công ${topupAmount} Xu vào ví! Hiện bạn có ${updated} Xu, có thể mở khóa bộ thẻ ngay.`);
    }, 1200);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#fcf7ec] rounded-3xl border-2 border-[#eadfcb] shadow-2xl overflow-hidden flex flex-col text-[#28071a] animate-scale-up my-auto">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#240618] via-[#380b23] to-[#240618] text-white flex items-center justify-between border-b border-[#f02c85]/40 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shadow-xs">
              <Coins className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Mở Khóa Tài Liệu Bằng Xu
              </h3>
              <p className="text-[11px] text-pink-200/80 font-medium">
                Nền tảng chỉ chấp nhận thanh toán bằng Xu ÔnThiHub
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-pink-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          
          {/* SUCCESS STATE */}
          {isPurchasedSuccess ? (
            <div className="py-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                  GIAO DỊCH HOÀN TẤT 100%
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#28071a] mt-1">
                  Mở Khóa Thành Công!
                </h3>
                <p className="text-xs text-[#7a5a6b] font-medium mt-1 max-w-sm mx-auto leading-relaxed">
                  Bộ thẻ <strong>"{item.title}"</strong> đã được chuyển vĩnh viễn vào Tủ Tài Liệu của bạn.
                </p>
              </div>

              {/* Remaining Coins Info */}
              <div className="p-3 bg-white rounded-2xl border border-[#eadfcb] max-w-xs mx-auto text-xs flex items-center justify-between shadow-2xs">
                <span className="text-[#7a5a6b] font-bold">Số dư ví còn lại:</span>
                <strong className="text-[#28071a] font-black flex items-center space-x-1">
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
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-wayground-sunset text-white text-xs font-black shadow-md flex items-center justify-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Vào Tủ Học Ngay</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#eadfcb] bg-white hover:bg-slate-100 text-[#28071a] text-xs font-bold"
                >
                  Đóng Lại
                </button>
              </div>
            </div>
          ) : (
            /* NORMAL PURCHASE FLOW */
            <>
              {/* Item Card Recap */}
              <div className="p-4 bg-white rounded-2xl border border-[#eadfcb] shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#f02c85]/10 text-[#f02c85] border border-[#f02c85]/20">
                    {item.categoryLabel || (isCombo ? 'GÓI COMBO VIP' : 'TÀI LIỆU CHỌN LỌC')}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-black text-[#28071a] line-clamp-2 leading-snug">
                  {item.title}
                </h4>

                {item.subtitle && (
                  <p className="text-xs text-[#7a5a6b] line-clamp-2 font-medium">
                    {item.subtitle}
                  </p>
                )}

                {/* Price Pill */}
                <div className="pt-2 border-t border-[#eadfcb]/60 flex items-baseline justify-between">
                  <span className="text-xs text-[#7a5a6b] font-bold">Giá mở khóa bằng Xu:</span>
                  <div className="flex items-baseline space-x-2">
                    <div className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
                      <strong className="text-lg sm:text-xl font-black text-[#28071a]">
                        {priceXu} Xu
                      </strong>
                    </div>
                    {originalPriceXu > priceXu && (
                      <span className="text-xs text-[#99798b] line-through font-bold">
                        {originalPriceXu} Xu
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Wallet Balance Box */}
              <div className={`p-4 rounded-2xl border transition-all ${
                hasEnoughCoins
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/70 border-rose-300 text-rose-950'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#5c3e4f]">Số dư ví của bạn:</span>
                  <div className="flex items-center space-x-1">
                    <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <strong className="text-base font-black text-[#28071a]">
                      {walletBalance} Xu
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-black/10">
                  <span className="font-medium text-[#7a5a6b]">
                    {hasEnoughCoins ? 'Số dư sau khi thanh toán:' : 'Trạng thái ví:'}
                  </span>
                  {hasEnoughCoins ? (
                    <strong className="text-emerald-700 font-black">
                      Còn {walletBalance - priceXu} Xu (Đủ Xu)
                    </strong>
                  ) : (
                    <strong className="text-rose-700 font-black">
                      Thiếu {missingCoins} Xu (Cần nạp thêm)
                    </strong>
                  )}
                </div>
              </div>

              {/* Not Enough Coins Alert & Top-up Drawer */}
              {!hasEnoughCoins && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2 font-medium">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Trang web chỉ chấp nhận Tiền Xu để bảo vệ bản quyền. Bạn có thể nạp thêm Xu qua VietQR để mở khóa ngay bộ thẻ.
                    </p>
                  </div>

                  {!isTopupOpen ? (
                    <button
                      onClick={() => setIsTopupOpen(true)}
                      className="w-full py-3 px-4 rounded-2xl bg-[#f02c85] hover:bg-[#dc1f74] text-white text-xs font-black shadow-md flex items-center justify-center space-x-2 transition-transform transform hover:scale-[1.02] active:scale-95"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Nạp Thêm Xu Ngay (Quét VietQR)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    /* Embedded VietQR Quick Topup Panel */
                    <div className="p-4 bg-white rounded-2xl border-2 border-[#f02c85]/40 shadow-md space-y-3 text-xs animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-[#eadfcb]">
                        <div className="flex items-center space-x-2">
                          <QrCode className="w-4 h-4 text-[#f02c85]" />
                          <strong className="font-black text-[#28071a]">
                            Nạp Xu Nhanh Bằng VietQR (Tự Động)
                          </strong>
                        </div>
                        <button
                          onClick={() => setIsTopupOpen(false)}
                          className="text-[#7a5a6b] hover:text-[#28071a] font-bold"
                        >
                          Thu gọn
                        </button>
                      </div>

                      {/* Select Top-up Tier */}
                      <div>
                        <span className="font-bold text-[#7a5a6b] block mb-1.5 text-[11px]">
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
                              className={`p-2 rounded-xl text-xs font-black border text-center transition-all ${
                                topupAmount === tier.xu
                                  ? 'bg-[#28071a] text-white border-[#28071a] shadow-xs'
                                  : 'bg-[#fcf7ec] border-[#eadfcb] text-[#28071a] hover:bg-amber-100/50'
                              }`}
                            >
                              <div>{tier.xu} Xu</div>
                              <div className="text-[10px] font-normal opacity-80 mt-0.5">
                                {(tier.xu * 1000).toLocaleString()}đ
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* QR Code Display */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <div className="w-32 h-32 bg-white rounded-xl border border-[#eadfcb] p-1.5 shrink-0 flex items-center justify-center shadow-xs">
                          <img
                            src={qrUrl}
                            alt="VietQR Topup"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="space-y-1.5 text-[11px] flex-1">
                          <div>
                            <span className="text-[#7a5a6b] block">Số tiền chuyển:</span>
                            <strong className="text-sm font-black text-[#f02c85]">
                              {(topupAmount * 1000).toLocaleString()} VNĐ
                            </strong>
                          </div>
                          <div>
                            <span className="text-[#7a5a6b] block">Nội dung chuyển khoản (Bắt buộc):</span>
                            <div className="flex items-center space-x-1.5 mt-0.5">
                              <code className="px-2 py-1 bg-amber-100 rounded-lg font-mono font-black text-amber-900 text-xs">
                                NAPXU {topupOrderCode}
                              </code>
                              <button
                                type="button"
                                onClick={() => handleCopy(`NAPXU ${topupOrderCode}`)}
                                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                                title="Copy cú pháp"
                              >
                                {copiedMemo ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
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
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
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
                    className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white btn-wayground-sunset shadow-lg shadow-pink-900/30 hover:opacity-95 transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
                  >
                    <Coins className="w-5 h-5 fill-white" />
                    <span>Xác Nhận Mở Khóa ({priceXu} Xu)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#7a5a6b] text-center font-medium">
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
