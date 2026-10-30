import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share, X, Check, Sparkles } from 'lucide-react';
import { playSound } from '../utils/storage';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently (within 48 hours)
    const dismissedTime = localStorage.getItem('onthi_pwa_prompt_dismissed');
    if (dismissedTime && Date.now() - Number(dismissedTime) < 48 * 3600 * 1000) {
      return;
    }

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for Android / Chrome beforeinstallprompt event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If on iOS and not standalone, show friendly install tip after 3 seconds
    if (isIosDevice) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    playSound('flip');
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      playSound('success');
      setShowPrompt(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('onthi_pwa_prompt_dismissed', String(Date.now()));
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <aside aria-label="Cài đặt ứng dụng di động" className="fixed bottom-20 left-3 right-3 sm:left-6 sm:right-auto sm:bottom-6 z-40 max-w-sm bg-white dark:bg-slate-900 border border-[#2383e2]/30 dark:border-sky-500/30 rounded-2xl p-3.5 shadow-xl shadow-blue-500/10 animate-fade-in text-[#37352f] dark:text-white">
      <div className="flex items-start space-x-3">
        {/* App Icon */}
        <img
          src="/icons/icon-192x192.png"
          alt="PromptMMO App"
          className="w-11 h-11 rounded-xl shadow-xs shrink-0 object-cover border border-[#e9e9e8] dark:border-white/10"
        />

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center space-x-1.5 flex-wrap">
            <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white truncate">
              Cài Đặt PromptMMO Cho Điện Thoại
            </h4>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-sky-950/70 text-[#2383e2] dark:text-sky-300 border border-blue-200 dark:border-sky-700/50">
              PWA App
            </span>
          </div>

          <p className="text-[11px] text-[#787774] dark:text-slate-300 mt-0.5 leading-snug">
            {isIOS ? (
              <>
                Bấm nút <Share className="w-3 h-3 inline text-[#2383e2] mx-0.5" /> <strong>Chia sẻ</strong> trên Safari ➔ Chọn <strong>"Thêm vào MH chính"</strong> để dùng app toàn màn hình.
              </>
            ) : (
              'Truy cập kho Prompt tức thì từ màn hình chính, sao chép prompt 1 chạm & mượt mà như app gốc.'
            )}
          </p>

          <div className="flex items-center space-x-2 mt-2">
            {!isIOS && deferredPrompt && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-3 py-1.5 bg-[#2383e2] hover:bg-[#1a73e8] active:scale-95 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Cài Đặt Ngay</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDismiss}
              className="px-2.5 py-1.5 bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 text-[#787774] dark:text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Để Sau
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-2.5 right-2.5 p-1 text-[#9b9a97] hover:text-[#37352f] dark:hover:text-white rounded-md transition-colors cursor-pointer"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
