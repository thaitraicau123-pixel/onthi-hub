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
  Crown,
  Gem
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

const THEMES = [
  { id: 'royal_gold', label: 'Hoàng Gia 24K', icon: Crown, color: 'from-amber-500 to-yellow-600', ring: 'ring-amber-400' },
  { id: 'crimson_glory', label: 'Chiến Thần Lửa', icon: Flame, color: 'from-red-600 to-amber-500', ring: 'ring-red-500' },
  { id: 'cyber_diamond', label: 'Kim Cương 2026', icon: Gem, color: 'from-sky-500 to-purple-600', ring: 'ring-sky-400' }
];

export default function ShareAchievementModal({
  isOpen,
  onClose,
  achievementData,
  onOpenDirectChat,
  onShowToast
}) {
  useModalDismiss(onClose, isOpen);

  const [selectedTheme, setSelectedTheme] = useState(() =>
    achievementData?.type === 'streak' ? 'crimson_glory' : 'royal_gold'
  );
  const [canvasRef, setCanvasRef] = useState(null);
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !achievementData) return;

    let isMounted = true;
    setIsGenerating(true);
    setCopiedSuccess(false);

    generateAchievementCanvas({
      ...achievementData,
      theme: selectedTheme
    })
      .then((canvas) => {
        if (!isMounted || !canvas) return;
        setCanvasRef(canvas);
        setPreviewDataUrl(canvas.toDataURL('image/png'));
        setIsGenerating(false);

        // Confetti celebration
        confetti({
          particleCount: 55,
          spread: 75,
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
  }, [isOpen, achievementData, selectedTheme]);

  const handleSelectTheme = (themeId) => {
    if (themeId === selectedTheme) return;
    playSound('flip');
    setSelectedTheme(themeId);
  };

  const handleDownload = () => {
    if (!canvasRef) return;
    playSound('success');
    const slug = (achievementData?.title || 'thanh-tich')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    downloadCanvasImage(canvasRef, `promptmmo-${selectedTheme}-${slug}.png`);
    onShowToast?.('📥 Đã tải chứng nhận hoàng gia 4K về máy!');
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
      title: achievementData?.title || 'Bảng Vàng Kỷ Lục PromptMMO',
      text: `🏆 Bảng vàng vinh danh thành tích trong ${achievementData?.title || 'PromptMMO'}! Cùng thử sức nhé!`
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
    const payload = {
      ...achievementData,
      theme: selectedTheme
    };
    onOpenDirectChat(null, null, payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#090d16] text-white rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col max-h-[96vh] z-10"
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-slate-950 via-[#0f172a] to-slate-950 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                  Bằng Khen & Chứng Nhận Hoàng Gia
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                  Retina 4K
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Thiết kế mạ vàng 24K sang trọng bậc nhất để đăng Story, Facebook & gửi bạn học
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Switcher Bar */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <span className="text-[11px] font-bold text-amber-200/80 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chọn Phong Cách:</span>
          </span>

          <div className="flex items-center gap-1.5">
            {THEMES.map((th) => {
              const Icon = th.icon;
              const isActive = selectedTheme === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => handleSelectTheme(th.id)}
                  className={`px-2.5 py-1.2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? `bg-gradient-to-r ${th.color} text-slate-950 font-black shadow-md scale-102 ring-1 ${th.ring}`
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{th.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body / Image Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col items-center justify-center bg-gradient-to-b from-[#050811] via-[#090d16] to-[#020409]">
          {isGenerating ? (
            <div className="py-24 text-center space-y-3">
              <RefreshCw className="w-9 h-9 text-amber-400 animate-spin mx-auto" />
              <p className="text-xs text-amber-200 font-bold tracking-wide">
                Đang mạ vàng & render chứng nhận đồ họa 4K...
              </p>
            </div>
          ) : previewDataUrl ? (
            <div className="relative max-w-xs sm:max-w-sm rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(251,191,36,0.18)] border-2 border-amber-400/40 hover:border-amber-400 transition-all hover:scale-[1.01]">
              <img
                src={previewDataUrl}
                alt="Chứng Nhận Kỷ Lục Hoàng Gia"
                className="w-full h-auto object-contain block"
              />
            </div>
          ) : (
            <div className="py-16 text-center text-rose-400 text-xs font-semibold">
              Không thể tạo ảnh xem trước. Vui lòng bấm thử lại!
            </div>
          )}
        </div>

        {/* Footer Actions Grid */}
        <div className="p-3.5 sm:px-6 bg-slate-950 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating || !previewDataUrl}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-black shadow-lg flex items-center justify-center space-x-1.5 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải Ảnh PNG 4K</span>
            </button>

            <button
              type="button"
              onClick={handleCopyImage}
              disabled={isGenerating || !previewDataUrl}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-amber-500/30 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Sao chép trực tiếp vào clipboard để dán (Ctrl+V) vào Zalo / Messenger / Facebook"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Đã Sao Chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-300" />
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
                <span>Chia Sẻ Story</span>
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
