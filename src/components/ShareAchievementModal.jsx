import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Share2,
  Sparkles,
  Trophy,
  Flame,
  Award,
  MessageCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  generateAchievementCanvas,
  downloadCanvasImage,
  copyCanvasImageToClipboard,
  shareCanvasImageNative
} from '../utils/achievementImage';
import { useModalDismiss } from '../hooks/useModalDismiss';
import { playSound } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function ShareAchievementModal({
  isOpen,
  onClose,
  achievementData,
  onOpenDirectChat,
  onShowToast
}) {
  useModalDismiss(onClose, isOpen);

  const [canvasRef, setCanvasRef] = useState(null);
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !achievementData) return;

    let isMounted = true;
    setIsGenerating(true);
    setCopiedSuccess(false);

    generateAchievementCanvas(achievementData)
      .then((canvas) => {
        if (!isMounted || !canvas) return;
        setCanvasRef(canvas);
        setPreviewDataUrl(canvas.toDataURL('image/png'));
        setIsGenerating(false);

        // Confetti celebration
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 }
        });
      })
      .catch((err) => {
        console.error('Lỗi sinh ảnh thành tích:', err);
        setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, achievementData]);

  const handleDownload = () => {
    if (!canvasRef) return;
    playSound('success');
    const slug = (achievementData?.title || 'thanh-tich')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    downloadCanvasImage(canvasRef, `onthihub-${slug}.png`);
    onShowToast?.('📥 Đã tải ảnh chứng nhận thành tích về máy!');
  };

  const handleCopyImage = async () => {
    if (!canvasRef) return;
    playSound('flip');
    const res = await copyCanvasImageToClipboard(canvasRef);
    if (res.success) {
      playSound('success');
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
      onShowToast?.(res.message);
    } else {
      onShowToast?.(res.message);
    }
  };

  const handleNativeShare = async () => {
    if (!canvasRef) return;
    playSound('flip');
    const res = await shareCanvasImageNative(canvasRef, {
      title: achievementData?.title || 'Thành tích ÔnThiHub',
      text: `🏆 Mình vừa đạt kết quả xuất sắc trong ${achievementData?.title || 'kỳ thi'} trên OnThiHub! Cùng ôn thi nhé!`
    });
    if (res.success) {
      playSound('success');
      onShowToast?.('Đã mở bảng chia sẻ!');
    }
  };

  const handleSendToChat = () => {
    if (!onOpenDirectChat) return;
    playSound('click');
    onClose();
    onOpenDirectChat(null, {
      id: 'achievement_share',
      title: `🏆 Giấy Chứng Nhận: ${achievementData?.title || 'Thành tích'} (${achievementData?.percentage || 100}%)`,
      categoryLabel: 'Thành Tích Học Tập',
      previewCards: []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-fade-in select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#0f172a] text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[94vh] z-10"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                <span>Khoe Thành Tích & Chứng Nhận</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Ảnh chuẩn 4:5 sắc nét để đăng Facebook, Instagram Story & gửi bạn học
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Image Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center bg-slate-950/70">
          {isGenerating ? (
            <div className="py-24 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-semibold">Đang xuất thẻ chứng nhận đồ họa...</p>
            </div>
          ) : previewDataUrl ? (
            <div className="relative max-w-xs sm:max-w-sm rounded-xl overflow-hidden shadow-2xl border border-slate-700/80 hover:border-sky-500/50 transition-colors">
              <img
                src={previewDataUrl}
                alt="Chứng Nhận Thành Tích"
                className="w-full h-auto object-contain block"
              />
            </div>
          ) : (
            <div className="py-16 text-center text-rose-400 text-xs">
              Không thể tạo ảnh xem trước. Vui lòng thử lại!
            </div>
          )}
        </div>

        {/* Footer Actions Grid */}
        <div className="p-4 sm:px-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating || !previewDataUrl}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải Ảnh PNG</span>
            </button>

            <button
              type="button"
              onClick={handleCopyImage}
              disabled={isGenerating || !previewDataUrl}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Sao chép trực tiếp vào clipboard để dán (Ctrl+V) vào Zalo / Messenger"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Đã Sao Chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao Chép Ảnh</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {typeof navigator !== 'undefined' && Boolean(navigator.share) && (
              <button
                type="button"
                onClick={handleNativeShare}
                disabled={isGenerating || !previewDataUrl}
                className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia Sẻ</span>
              </button>
            )}

            {onOpenDirectChat && (
              <button
                type="button"
                onClick={handleSendToChat}
                className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Gửi Vào Chat</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
