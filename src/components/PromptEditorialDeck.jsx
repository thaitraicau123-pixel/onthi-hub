import React, { useEffect, useCallback, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Scroll,
  Sparkles,
  Flame,
  ArrowRight,
  TrendingUp,
  Cpu,
  Video,
  Camera,
  Coins,
  Bot,
  Copy,
  Check,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { playFlip, playSuccess, playHoverTick, playClick, isSoundMuted, toggleSoundMute } from '../utils/soundEngine';

// Graffiti SVG Arrow
const GraffitiArrow = ({ className = "w-10 h-10 text-[#f59e0b]" }) => (
  <svg
    viewBox="0 0 100 80"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M10 50 Q35 15 75 30 Q70 20 62 10 M75 30 Q65 38 60 48" />
  </svg>
);

export default function PromptEditorialDeck({
  currentSlide,
  setCurrentSlide,
  onSwitchToScroll,
  onNotify,
  onSelectCategory
}) {
  const [muted, setMuted] = useState(isSoundMuted());
  const [copiedPromptId, setCopiedPromptId] = useState(null);
  const TOTAL_SLIDES = 7;

  const handleNext = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      playFlip();
      setCurrentSlide(prev => prev + 1);
    } else {
      playSuccess();
      onSwitchToScroll?.();
      onNotify?.('Đang tải chế độ khám phá Chợ Prompts đầy đủ...');
    }
  }, [currentSlide, setCurrentSlide, onSwitchToScroll, onNotify]);

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      playFlip();
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide, setCurrentSlide]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      handlePrev();
    }
  }, [handleNext, handlePrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleToggleSound = () => {
    const next = toggleSoundMute();
    setMuted(next);
    if (!next) playClick();
  };

  const handleCopySample = (id, text) => {
    playSuccess();
    navigator.clipboard?.writeText(text);
    setCopiedPromptId(id);
    onNotify?.('Đã copy Prompt mẫu vào Clipboard!');
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="relative min-h-dvh flex flex-col justify-between bg-stone-950 text-white selection:bg-amber-500 selection:text-black overflow-hidden font-sans">
      
      {/* ─── TOP DECK CONTROLLER ─── */}
      <header className="relative z-50 flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3 sm:px-8 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-bold tracking-wider text-white text-lg sm:text-xl flex items-center gap-2">
              <span className="text-amber-400">CHỢ PROMPTS</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">STUDIO DECK</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
              LOOKBOOK // SLIDE {String(currentSlide + 1).padStart(2, '0')} / {String(TOTAL_SLIDES).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Slide Progress Dots (Desktop) */}
        <div className="hidden lg:flex items-center gap-2">
          {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                playFlip();
                setCurrentSlide(idx);
              }}
              onMouseEnter={playHoverTick}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'w-8 bg-amber-400 shadow-md shadow-amber-500/50'
                  : 'w-2.5 bg-white/20 hover:bg-white/50'
              }`}
              title={`Chuyển tới Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleSound}
            onMouseEnter={playHoverTick}
            title={muted ? "Bật âm thanh Web Audio" : "Tắt âm thanh"}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-stone-300 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={() => {
              playSuccess();
              onSwitchToScroll?.();
              onNotify?.('Đã chuyển sang chế độ Chợ Cuộn Khám Phá!');
            }}
            onMouseEnter={playHoverTick}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold font-mono uppercase text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <Scroll className="h-3.5 w-3.5" />
            <span>Xem Dạng Cuộn</span>
          </button>
        </div>
      </header>

      {/* ─── SLIDE STAGE ─── */}
      <main className="relative flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl aspect-[16/10] min-h-[580px] sm:min-h-[640px] rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-300 border border-white/10 bg-stone-900/90">

          {/* ─── SLIDE 01: COVER // PROMPT MARKETPLACE HERO ─── */}
          {currentSlide === 0 && (
            <div className="h-full w-full bg-[#fbf9f5] text-stone-900 p-6 sm:p-10 flex flex-col justify-between relative animate-studio-rise cream-grid">
              <div className="flex justify-between items-start text-xs font-mono tracking-widest text-stone-500 border-b border-black/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-600">PROMPT MMO</span>
                  <span>// BÙI THÁI STUDIO</span>
                </div>
                <span>HÀ NỘI // 2026</span>
                <span className="font-bold text-black">#01 COVER</span>
              </div>

              <div className="relative flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4">
                <div className="md:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Sàn Giao Dịch Prompt Thực Chiến #1</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-950 leading-none">
                    CHỢ PROMPTS <br/>
                    <span className="text-amber-600 font-display italic font-normal">& AI SKILLS</span>
                  </h1>
                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                    Kho vũ khí tạo tiền & tự động hóa nội dung số: Hơn 1000+ Prompt Video 8K Higgsfield/Kling, Flux.1 Studio ảnh người thật, Kịch bản TikTok Shop nổ đơn và Workflow N8N MMO.
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={handleNext}
                      onMouseEnter={playHoverTick}
                      className="px-5 py-2.5 rounded-xl bg-stone-950 text-white font-semibold text-xs tracking-wide hover:bg-stone-800 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <span>Khám phá Lookbook</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <span className="text-xs text-stone-500 font-mono">Dùng phím Space hoặc phím ➔</span>
                  </div>
                </div>

                <div className="md:col-span-7 flex justify-center relative">
                  <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-stone-900 group">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"
                      alt="AI Visual Art"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                      <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">// ULTRA-REALISTIC AI</div>
                      <div className="text-lg font-bold">Higgsfield & Kling 8K Cinematic Motion</div>
                      <div className="text-xs text-stone-300 mt-1">Biến văn bản thành video điện ảnh triệu view không cần máy quay.</div>
                    </div>
                  </div>
                  <GraffitiArrow className="absolute -bottom-4 -left-6 w-16 h-16 text-amber-600 hidden sm:block" />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-stone-500 border-t border-black/10 pt-3">
                <span>0MB LATENCY // WEB AUDIO HAPTICS</span>
                <span>238+ SKILLS • 1000+ PROMPTS</span>
              </div>
            </div>
          )}

          {/* ─── SLIDE 02: VIDEO AI 8K HIGGSFIELD & KLING ─── */}
          {currentSlide === 1 && (
            <div className="h-full w-full bg-stone-950 text-white p-6 sm:p-10 flex flex-col justify-between relative animate-slide-in-right">
              <div className="flex justify-between items-start text-xs font-mono tracking-widest text-stone-400 border-b border-white/10 pb-3">
                <span className="text-amber-400 flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> PROMPT VIDEO AI 8K</span>
                <span>SLIDE #02</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
                <div className="md:col-span-5 space-y-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono">
                    HIGGSFIELD AI • KLING 1.5 • RUNWAY GEN-3
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    50+ Prompt Video Điện Ảnh 8K <br/>
                    <span className="text-amber-400">Camera Orbit & Drone Hyperlapse</span>
                  </h2>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    Công thức ánh sáng anamorphic, độ sâu trường ảnh f/1.4 và kiểm soát góc máy chuẩn Hollywood. Phù hợp làm trailer game, video phong cảnh và video shorts viral.
                  </p>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-stone-300 relative">
                    <p className="text-amber-300 font-bold mb-1">// PROMPT MẪU 8K:</p>
                    <p className="text-stone-300 line-clamp-3">
                      "Cinematic 8K hyperlapse of a futuristic cyberpunk Hanoi street, rain puddle reflections, neon amber glow, anamorphic lens flare, motion blur, 60fps photorealistic render..."
                    </p>
                    <button
                      onClick={() => handleCopySample('video-sample', "Cinematic 8K hyperlapse of a futuristic cyberpunk Hanoi street, rain puddle reflections, neon amber glow, anamorphic lens flare, motion blur, 60fps photorealistic render --ar 16:9 --v 6.1")}
                      onMouseEnter={playHoverTick}
                      className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded bg-amber-500 text-black font-semibold text-[11px] hover:bg-amber-400 transition-all cursor-pointer"
                    >
                      {copiedPromptId === 'video-sample' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPromptId === 'video-sample' ? 'Đã copy!' : 'Copy Prompt Mẫu'}</span>
                    </button>
                  </div>
                </div>

                <div className="md:col-span-7 grid grid-cols-2 gap-3">
                  <div className="rounded-xl overflow-hidden border border-white/15 aspect-[4/3] group relative">
                    <img src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80" alt="Cinematic 1" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-amber-300">Camera Roll 60fps</div>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/15 aspect-[4/3] group relative">
                    <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" alt="Cinematic 2" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-amber-300">Anamorphic Light</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-stone-500 border-t border-white/10 pt-3">
                <span>GIÁ CHỈ TỪ: 15 XU</span>
                <span className="text-amber-400 cursor-pointer" onClick={() => onSelectCategory?.('video')}>Xem tất cả Prompt Video ➔</span>
              </div>
            </div>
          )}

          {/* ─── SLIDE 03: FLUX.1 & MIDJOURNEY STUDIO ─── */}
          {currentSlide === 2 && (
            <div className="h-full w-full bg-stone-900 text-white p-6 sm:p-10 flex flex-col justify-between relative animate-slide-in-right">
              <div className="flex justify-between items-start text-xs font-mono tracking-widest text-stone-400 border-b border-white/10 pb-3">
                <span className="text-emerald-400 flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" /> ẢNH STUDIO E-COMMERCE</span>
                <span>SLIDE #03</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
                <div className="md:col-span-5 space-y-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                    FLUX.1 PRO • MIDJOURNEY v6.1
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    Ảnh Chụp Sản Phẩm & <br/>
                    <span className="text-emerald-400">Người Mẫu Lookbook Cực Nét</span>
                  </h2>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    Xóa bỏ chi phí thuê studio đắt đỏ. Công thức mô phỏng ánh sáng softbox, bóng đổ tự nhiên và chi tiết da người thật 100% không dị tật ngón tay.
                  </p>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-stone-300">
                    <p className="text-emerald-300 font-bold mb-1">// PROMPT MẪU FLUX:</p>
                    <p className="text-stone-300 line-clamp-3">
                      "Professional commercial studio product shot of a luxury matte perfume bottle resting on raw limestone, soft natural side lighting, depth of field, Hasselblad H6D-100c..."
                    </p>
                    <button
                      onClick={() => handleCopySample('flux-sample', "Professional commercial studio product shot of a luxury matte perfume bottle resting on raw limestone, soft natural side lighting, depth of field, Hasselblad H6D-100c --ar 4:5 --q 2")}
                      onMouseEnter={playHoverTick}
                      className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded bg-emerald-500 text-black font-semibold text-[11px] hover:bg-emerald-400 transition-all cursor-pointer"
                    >
                      {copiedPromptId === 'flux-sample' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPromptId === 'flux-sample' ? 'Đã copy!' : 'Copy Prompt Mẫu'}</span>
                    </button>
                  </div>
                </div>

                <div className="md:col-span-7 grid grid-cols-2 gap-3">
                  <div className="rounded-xl overflow-hidden border border-white/15 aspect-square group relative">
                    <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" alt="Product Studio" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-emerald-300">Mỹ phẩm Studio</div>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/15 aspect-square group relative">
                    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" alt="Fashion Lookbook" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-emerald-300">Người mẫu Thời trang</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-stone-500 border-t border-white/10 pt-3">
                <span>TIẾT KIỆM 95% CHI PHÍ STUDIO</span>
                <span className="text-emerald-400 cursor-pointer" onClick={() => onSelectCategory?.('image')}>Xem kho ảnh Studio ➔</span>
              </div>
            </div>
          )}

          {/* ─── SLIDE 04: TIKTOK SHOP & LIVESTREAM ─── */}
          {currentSlide === 3 && (
            <div className="h-full w-full bg-stone-950 text-white p-6 sm:p-10 flex flex-col justify-between relative animate-slide-in-right">
              <div className="flex justify-between items-start text-xs font-mono tracking-widest text-stone-400 border-b border-white/10 pb-3">
                <span className="text-red-400 flex items-center gap-1.5"><Flame className="w-3.5 h-3.5" /> KỊCH BẢN TIKTOK SHOP</span>
                <span>SLIDE #04</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
                <div className="md:col-span-6 space-y-4">
                  <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-mono">
                    100+ HOOK GIỮ CHÂN 3S • KỊCH BẢN CHỐT ĐƠN
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    Kịch Bản Livestream & <br/>
                    <span className="text-red-400">Review Nổ Hàng Ngàn Đơn</span>
                  </h2>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    Công thức Storytelling xoắn não: Vấn đề nhức nhối ➔ Bước ngoặt bất ngờ ➔ Tung deal xả kho ➔ Thúc giục FOMO. Kèm bảng thoại cho host livestream kéo mắt xem.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-red-400 font-bold">HOOK TÒ MÒ:</div>
                      <div className="text-stone-300 text-[11px] mt-1">"Đừng mua món này nếu bạn chưa biết sự thật sau..."</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-red-400 font-bold">CHỐT DEAL FOMO:</div>
                      <div className="text-stone-300 text-[11px] mt-1">"Chỉ duy nhất 30 slot giảm 50% trong 2 phút này!"</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-6 flex justify-center">
                  <div className="w-full max-w-sm rounded-2xl p-5 bg-gradient-to-br from-red-950/40 via-stone-900 to-black border border-red-500/30 shadow-xl space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-2">
                      <span className="text-red-400 font-bold">CASE STUDY THỰC CHIẾN</span>
                      <span className="text-stone-400">CTR 8.4%</span>
                    </div>
                    <div className="space-y-2 text-xs text-stone-300">
                      <p>✨ Kịch bản review gia dụng thông minh: 1.2M views sau 48h.</p>
                      <p>✨ Thoại livestream thời trang: Tăng tỷ lệ giữ chân từ 18s lên 65s.</p>
                      <p>✨ Kèm theo bộ Prompt tạo giọng đọc AI ElevenLabs cảm xúc tự nhiên.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-stone-500 border-t border-white/10 pt-3">
                <span>DÀNH RIÊNG CHO SELLER TIKTOK / SHOPEE</span>
                <span className="text-red-400 cursor-pointer" onClick={() => onSelectCategory?.('script')}>Xem kịch bản bán hàng ➔</span>
              </div>
            </div>
          )}

          {/* ─── SLIDE 05: N8N & AI AUTOMATION ─── */}
          {currentSlide === 4 && (
            <div className="h-full w-full bg-stone-900 text-white p-6 sm:p-10 flex flex-col justify-between relative animate-slide-in-right">
              <div className="flex justify-between items-start text-xs font-mono tracking-widest text-stone-400 border-b border-white/10 pb-3">
                <span className="text-cyan-400 flex items-center gap-1.5"><Bot className="w-3.5 h-3.5" /> N8N & AI AUTOMATION</span>
                <span>SLIDE #05</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
                <div className="md:col-span-6 space-y-4">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono">
                    AUTOPILOT MMO WORKFLOWS 24/7
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    Workflow Tự Động Hóa N8N <br/>
                    <span className="text-cyan-400">& AI Bot Chăm Sóc Khách</span>
                  </h2>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    Xây dựng cỗ máy kiếm tiền thụ động: Tự động cào xu hướng sản phẩm ➔ Tạo bài viết chuẩn SEO ➔ Bắn tự động lên Web/Fanpage ➔ Bot chốt đơn qua VietQR.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-cyan-300">N8N Webhook</span>
                    <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-cyan-300">Telegram Bot</span>
                    <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-cyan-300">VietQR Auto</span>
                    <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-cyan-300">ChatGPT 4o API</span>
                  </div>
                </div>

                <div className="md:col-span-6">
                  <div className="rounded-xl border border-cyan-500/30 bg-black/50 p-4 font-mono text-xs text-stone-300 space-y-2 shadow-xl">
                    <div className="text-cyan-400 font-bold border-b border-white/10 pb-1">// TIẾN TRÌNH TỰ ĐỘNG HÓA THÀNH CÔNG:</div>
                    <div className="text-emerald-400">✓ Quét 500 bài viết xu hướng đối thủ mỗi 6h</div>
                    <div className="text-emerald-400">✓ AI viết lại content viral 100% không trùng lặp</div>
                    <div className="text-emerald-400">✓ Tự động xuất video ngắn bằng ffmpeg phần cứng NVENC</div>
                    <div className="text-amber-400">➔ Doanh thu tự động chảy về tài khoản ngân hàng</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-stone-500 border-t border-white/10 pt-3">
                <span>TIẾT KIỆM 40 GIỜ LÀM VIỆC / TUẦN</span>
                <span className="text-cyan-400 cursor-pointer" onClick={() => onSelectCategory?.('automation')}>Xem Workflow N8N ➔</span>
              </div>
            </div>
          )}

          {/* ─── SLIDE 06: KHO 238+ AI SKILLS & SUBAGENTS ─── */}
          {currentSlide === 5 && (
            <div className="h-full w-full bg-stone-950 text-white p-6 sm:p-10 flex flex-col justify-between relative animate-slide-in-right">
              <div className="flex justify-between items-start text-xs font-mono tracking-widest text-stone-400 border-b border-white/10 pb-3">
                <span className="text-amber-400 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> KHO 238+ AI SKILLS & SUBAGENTS</span>
                <span>SLIDE #06</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
                <div className="md:col-span-6 space-y-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono">
                    ARGON SOVEREIGN OS & THE AGENCY
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    238+ Kỹ Năng AI Agent <br/>
                    <span className="text-amber-400">Cài Đặt 1-Chạm Siêu Nhanh</span>
                  </h2>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    Trang bị đầy đủ cho Antigravity & Claude: 7 Subagents tinh nhuệ (AppSec Tester, Code Auditor, Flash Coder, HyperFrames Director), 19 bộ skill thiết kế thượng lưu và các công cụ tối ưu phần cứng RTX 4050.
                  </p>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-amber-300 flex items-center justify-between">
                    <span>Lệnh cài: npx skills add &lt;skill-name&gt; -g -y</span>
                    <button
                      onClick={() => handleCopySample('skill-cmd', 'npx skills add vercel-labs/haute-couture-web-engine -g -y')}
                      className="px-2.5 py-1 rounded bg-amber-500 text-black font-semibold text-[11px] cursor-pointer"
                    >
                      Copy mẫu
                    </button>
                  </div>
                </div>

                <div className="md:col-span-6 grid grid-cols-2 gap-2.5 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-amber-400 font-bold">haute-couture</div>
                    <div className="text-stone-400 text-[11px]">Thiết kế giao diện 60fps chống AI-slop</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-emerald-400 font-bold">ponytail</div>
                    <div className="text-stone-400 text-[11px]">Kỷ luật code tối giản 7 nấc YAGNI</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-red-400 font-bold">appsec-tester</div>
                    <div className="text-stone-400 text-[11px]">Săn lỗi bảo mật & RLS ngân hàng</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-cyan-400 font-bold">rtx-nvenc</div>
                    <div className="text-stone-400 text-[11px]">Tăng tốc render MP4 10x bằng GPU</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-stone-500 border-t border-white/10 pt-3">
                <span>TÍCH HỢP 100% CÙNG ANTIGRAVITY</span>
                <span className="text-amber-400 cursor-pointer" onClick={() => onSelectCategory?.('skills')}>Mở Kho AI Skills ➔</span>
              </div>
            </div>
          )}

          {/* ─── SLIDE 07: CTA // CHUYỂN SANG CHỢ CUỘN ─── */}
          {currentSlide === 6 && (
            <div className="h-full w-full bg-[#fbf9f5] text-stone-900 p-6 sm:p-10 flex flex-col justify-between relative animate-studio-rise cream-grid">
              <div className="flex justify-between items-start text-xs font-mono tracking-widest text-stone-500 border-b border-black/10 pb-3">
                <span className="font-bold text-amber-600">SẴN SÀNG KHÁM PHÁ</span>
                <span>#07 KHỞI ĐỘNG</span>
              </div>

              <div className="text-center max-w-2xl mx-auto my-auto space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-800 text-xs font-mono border border-amber-300">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>Tặng 20 Xu Miễn Phí Cho Thành Viên Mới</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-tight">
                  Mở Khóa Ngay Kho Vũ Khí <br/>
                  <span className="text-amber-600 font-display italic">Prompt & AI Skills Thực Chiến</span>
                </h2>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  Bắt đầu ngay hôm nay để đưa hiệu suất sáng tạo nội dung và kinh doanh online của bạn lên tầm cao mới với kho dữ liệu tuyển chọn gắt gao nhất.
                </p>
                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      playSuccess();
                      onSwitchToScroll?.();
                      onNotify?.('Chào mừng bạn đến với Chợ Prompts & Skills!');
                    }}
                    onMouseEnter={playHoverTick}
                    className="px-8 py-3.5 rounded-xl bg-amber-500 text-black font-extrabold text-sm tracking-wide hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/30 flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Vào Chợ Prompts Ngay</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-stone-500 border-t border-black/10 pt-3">
                <span>BÙI THÁI STUDIO // CHỢ PROMPTS 2026</span>
                <span>VIETQR NẠP TỰ ĐỘNG 24/7</span>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ─── BOTTOM CONTROLS & HINT ─── */}
      <footer className="relative z-50 flex items-center justify-between border-t border-white/10 bg-black/80 px-4 py-2.5 sm:px-8 text-xs font-mono text-stone-400 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            onMouseEnter={playHoverTick}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 transition-all ${
              currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 text-white cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Slide Trước</span>
          </button>
          <button
            onClick={handleNext}
            onMouseEnter={playHoverTick}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer font-bold"
          >
            <span className="hidden sm:inline">Slide Tiếp Theo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] text-stone-500">
          <span>Dùng phím</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-stone-300">←</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-stone-300">→</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-stone-300">Space</kbd>
          <span>để lướt slide</span>
        </div>

        <button
          onClick={() => {
            playSuccess();
            onSwitchToScroll?.();
          }}
          className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
        >
          Bỏ qua Lookbook ➔
        </button>
      </footer>

    </div>
  );
}
