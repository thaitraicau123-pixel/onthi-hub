import React, { useState, useEffect } from 'react';
import { X, Check, Palette, Sparkles, Wand2 } from 'lucide-react';
import { THEMES, getSelectedThemeId, applyTheme, getSleepMode, setSleepMode as setGlobalSleepMode, subscribeToSleepMode, isDayTheme } from '../utils/themeManager';
import { playSound } from '../utils/storage';
import confetti from 'canvas-confetti';
import { useModalDismiss } from '../hooks/useModalDismiss';

export default function ThemePickerModal({ isOpen, onClose, currentTheme, onThemeSelect, onSelectTheme }) {
  const currentThemeId = currentTheme?.id || getSelectedThemeId();
  const [sleepMode, setLocalSleepMode] = useState(() => getSleepMode());

  useEffect(() => {
    if (!isOpen) return;
    const unsub = subscribeToSleepMode((mode) => {
      setLocalSleepMode(mode);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [isOpen]);

  const handleSelect = (theme) => {
    playSound('flip');
    const applied = applyTheme(theme.id);
    if (onSelectTheme) onSelectTheme(applied);
    if (onThemeSelect) onThemeSelect(applied);

    // Light celebratory confetti
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleSetSleepMode = (mode) => {
    playSound('click');
    setGlobalSleepMode(mode);
    setLocalSleepMode(mode);
  };

  // Close on Escape key
  useModalDismiss(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in cursor-pointer">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white dark:bg-[#121626] rounded-2xl shadow-3d-floating border border-[#e9e9e8] dark:border-white/10 overflow-hidden flex flex-col max-h-[92vh] z-10 text-[#37352f] dark:text-white cursor-default"
      >
        
        {/* Header (Messenger / Instagram Theme Picker Style) */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#e9e9e8] dark:border-white/10 bg-[#fbfbfa] dark:bg-[#181d33] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-[#37352f] dark:text-white tracking-tight">
                  Chủ Đề & Giao Diện Không Gian Học
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-600/40">
                  {THEMES.length} Chủ Đề Độc Đáo
                </span>
              </div>
              <p className="text-xs text-[#787774] dark:text-slate-300">
                Tự động thay đổi hình vẽ wallpaper, hiệu ứng thời tiết và toàn bộ icon nhỏ theo chủ đề bạn chọn!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs text-[#787774] dark:text-slate-400 hover:text-[#37352f] dark:hover:text-white hover:bg-[#f1f1ef] dark:hover:bg-white/10 rounded-lg border border-[#e9e9e8] dark:border-white/10 bg-white dark:bg-white/5 transition-colors cursor-pointer"
            title="Đóng (hoặc nhấn Esc, bấm ra ngoài)"
          >
            <span>Đóng</span>
            <kbd className="hidden sm:inline text-[10px] font-mono bg-[#f0efed] dark:bg-slate-800 px-1 py-0.5 rounded text-[#787774] dark:text-slate-300">Esc</kbd>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chế Độ Phân Bổ: Ban Ngày (5 chủ đề) & Chế Độ Ngủ 4K (11 chủ đề) */}
        <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">🌙</span>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Cơ Chế Phân Bổ Chế Độ Ban Ngày & Chế Độ Ngủ 4K
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-200 leading-relaxed mt-0.5">
                ☀️ <strong className="text-slate-900 dark:text-white">Chỉ 5 chủ đề chạy Ban Ngày:</strong> Notion Tối Giản, Hoa Anh Đào, Vườn Bơ Xanh, Cà Phê Lofi, Nước Chanh (màu pastel tươi tắn).<br />
                🌙 <strong className="text-slate-900 dark:text-white">11 chủ đề 4K & Rạp Chiếu Phim:</strong> Mario 3D, Your Name, Cyberpunk, Alps, Totoro, Halloween... tự động tối ưu Chế độ ngủ với chữ trắng tương phản tuyệt đối!
              </p>
            </div>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {THEMES.map((theme) => {
              const isSelected = theme.id === currentThemeId;

              return (
                <div
                  key={theme.id}
                  onClick={() => handleSelect(theme)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden card-3d ${
                    isSelected
                      ? 'border-[#2383e2] ring-2 ring-[#2383e2]/20 shadow-3d-md'
                      : theme.isDark
                        ? 'border-white/10 hover:border-white/20 bg-[#141829]'
                        : 'border-[#e9e9e8] hover:border-[#c5c4c0] bg-white'
                  }`}
                  style={{
                    backgroundColor: theme.isDark ? '#141829' : undefined
                  }}
                >
                  {/* Subtle Theme Wallpaper Glow in Card Header */}
                  <div
                    className={`h-16 -mx-4 -mt-4 mb-3 p-3 bg-gradient-to-r ${theme.previewGradient} flex items-center justify-between border-b ${
                      theme.isDark ? 'border-white/10' : 'border-black/5'
                    }`}
                  >
                    {/* Thematic preview chips */}
                    <div className="flex items-center space-x-1.5">
                      <span className="text-lg select-none filter drop-shadow-xs">{theme.icons.logo}</span>
                      <span className="text-lg select-none filter drop-shadow-xs">{theme.icons.workspace}</span>
                      <span className="text-lg select-none filter drop-shadow-xs">{theme.icons.home}</span>
                      <span className="text-lg select-none filter drop-shadow-xs">{theme.icons.streak}</span>
                      <span className="text-lg select-none filter drop-shadow-xs">{theme.icons.due}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {(() => {
                        const weatherBadgeMap = {
                          'mario-stars': { icon: '🍄', label: 'Mario Stars', color: 'bg-rose-100 text-rose-900 border-rose-300' },
                          'anime-comet': { icon: '🌠', label: 'Sao Băng Tiamat', color: 'bg-pink-100 text-pink-900 border-pink-300' },
                          snow: { icon: '❄️', label: 'Tuyết', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
                          halloween: { icon: '🎃', label: 'Halloween', color: 'bg-orange-100 text-orange-900 border-orange-300' },
                          sakura: { icon: '🌸', label: 'Hoa Đào', color: 'bg-pink-100 text-pink-800 border-pink-200' },
                          stars: { icon: '✨', label: 'Sao Băng', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
                          fireflies: { icon: '🍃', label: 'Đom Đóm', color: 'bg-lime-100 text-lime-800 border-lime-200' },
                          'coffee-steam': { icon: '☕', label: 'Hơi Cà Phê', color: 'bg-amber-100 text-amber-900 border-amber-300' },
                          'digital-rain': { icon: '⚡', label: 'Ma Trận', color: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
                          'sunset-dust': { icon: '🌅', label: 'Bụi Nắng', color: 'bg-rose-100 text-rose-800 border-rose-200' },
                          'fizzy-citrus': { icon: '🫧', label: 'Bọt Khí', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
                          'aurora-ice': { icon: '🌌', label: 'Cực Quang', color: 'bg-teal-100 text-teal-800 border-teal-200' },
                          'autumn-leaves': { icon: '🍂', label: 'Lá Vàng', color: 'bg-amber-100 text-amber-800 border-amber-200' },
                          'minimal-sparkles': { icon: '✨', label: 'Tinh Tế', color: 'bg-slate-100 text-slate-800 border-slate-200' },
                        };
                        const w = weatherBadgeMap[theme.weatherType];
                        if (!w) return null;
                        return (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center space-x-0.5 shadow-2xs ${w.color}`}>
                            <span>{w.icon}</span>
                            <span>{w.label}</span>
                          </span>
                        );
                      })()}
                      {isSelected ? (
                        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#2383e2] text-white text-[11px] font-bold shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                          <span>Đang Dùng</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/70 backdrop-blur-2xs text-[#37352f] border border-black/5">
                          {theme.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Theme Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate mr-2">
                        <h4
                          className={`text-sm font-bold tracking-tight truncate ${
                            theme.isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {theme.icons.logo} {theme.name}
                        </h4>
                        {isDayTheme(theme.id) ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                            ☀️ Ban ngày
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-200 border border-indigo-700/60 shrink-0">
                            🌙 Chế độ ngủ 4K
                          </span>
                        )}
                      </div>
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-2xs border border-white shrink-0"
                        style={{ backgroundColor: theme.primaryColor }}
                        title={`Màu chủ đạo: ${theme.primaryColor}`}
                      />
                    </div>

                    <p
                      className={`text-xs line-clamp-2 leading-relaxed ${
                        theme.isDark ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {theme.description}
                    </p>

                    {/* Themed Illustrated Artwork Highlight */}
                    {theme.artDetail && (
                      <div
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1.5 ${
                          theme.isDark
                            ? 'bg-white/10 text-slate-100 border border-white/15'
                            : 'bg-black/5 text-[#423412] border border-black/5'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{theme.artDetail}</span>
                      </div>
                    )}

                    {/* Thematic Icons Strip */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-[11px]">
                      <span className={theme.isDark ? 'text-slate-300 font-semibold' : 'text-slate-500 font-semibold'}>
                        Icon chủ đề:
                      </span>
                      <div className="flex items-center space-x-1 text-xs select-none">
                        <span title="Thẻ">{theme.icons.study3D}</span>
                        <span title="Thi thử">{theme.icons.quiz}</span>
                        <span title="Ghép thẻ">{theme.icons.match}</span>
                        <span title="Tủ thẻ">{theme.icons.library}</span>
                        <span title="Túi mù">{theme.icons.blindbox}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-[#fbfbfa] dark:bg-[#181d33] border-t border-[#e9e9e8] dark:border-white/10 flex items-center justify-between text-xs text-[#787774] dark:text-slate-300 shrink-0">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Chủ đề được lưu tự động trên thiết bị của bạn.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2383e2] hover:bg-[#1a73e8] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Hoàn Tất
          </button>
        </div>

      </div>
    </div>
  );
}
