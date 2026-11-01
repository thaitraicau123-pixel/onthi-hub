import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Video,
  Camera,
  Flame,
  Bot,
  Code2,
  Sliders,
  Send,
  Zap,
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { playClick, playSuccess, playHoverTick } from '../utils/soundEngine';

const ENGINES = [
  { id: 'video', name: 'Video AI (Higgsfield & Kling 8K)', icon: Video, color: 'text-amber-500', defaultRatio: '--ar 16:9' },
  { id: 'image', name: 'Ảnh Studio (Flux.1 & Midjourney v6)', icon: Camera, color: 'text-emerald-500', defaultRatio: '--ar 4:5' },
  { id: 'tiktok', name: 'Kịch Bản TikTok & Livestream', icon: Flame, color: 'text-red-500', defaultRatio: 'Khung 9:16' },
  { id: 'automation', name: 'Workflow N8N & AI Agent', icon: Bot, color: 'text-cyan-500', defaultRatio: 'Webhook JSON' },
  { id: 'code', name: 'Fullstack Web & AppSec Code', icon: Code2, color: 'text-purple-500', defaultRatio: 'React 19 / TS' }
];

const STYLES = [
  { id: 'cinematic', label: 'Cinematic 8K Anamorphic', tags: 'cinematic, 8k resolution, anamorphic lens flare, photorealistic, 60fps motion blur' },
  { id: 'studio', label: 'E-Commerce Studio Lighting', tags: 'commercial studio lighting, soft natural shadows, Hasselblad H6D-100c, clean minimalist backdrop' },
  { id: 'cyber', label: 'Cyberpunk Neon Obsidian', tags: 'cyberpunk aesthetic, deep obsidian black, vibrant amber and cyan neon accents, rainy reflections' },
  { id: 'editorial', label: 'Editorial Magazine Lookbook', tags: 'high-fashion lookbook, editorial portrait, 35mm film grain, muted warm tones, Vogue aesthetic' },
  { id: 'minimal', label: 'Apple Minimalist Clean', tags: 'ultra-clean minimalism, premium typography, soft ambient occlusion, white titanium accents' }
];

const CAMERAS = [
  { id: 'orbit', label: 'Camera Orbit 360', param: 'slow 360-degree orbit camera move' },
  { id: 'drone', label: 'Drone Hyperlapse', param: 'dramatic bird-eye drone hyperlapse tracking shot' },
  { id: 'macro', label: 'Macro Cận Cảnh Chi Tiết', param: 'extreme macro close-up, sharp textural details, shallow depth of field f/1.4' },
  { id: 'fpv', label: 'FPV Lướt Mượt Mà', param: 'dynamic FPV smooth gliding camera movement through the scene' }
];

export default function PromptStudioView({ onShowToast, onSwitchTab }) {
  const [selectedEngine, setSelectedEngine] = useState('video');
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [selectedCamera, setSelectedCamera] = useState('orbit');
  const [subjectText, setSubjectText] = useState('Cyberpunk Hanoi street with neon lights reflecting on wet pavement');
  const [negativeText, setNegativeText] = useState('blurry, distorted hands, extra limbs, low resolution, watermark, oversaturated');
  const [isCopied, setIsCopied] = useState(false);

  // Generate real-time prompt
  const generatedPrompt = useMemo(() => {
    const engine = ENGINES.find(e => e.id === selectedEngine);
    const style = STYLES.find(s => s.id === selectedStyle);
    const cam = CAMERAS.find(c => c.id === selectedCamera);

    if (selectedEngine === 'video') {
      return `Cinematic 8K shot of ${subjectText.trim() || '[Your Subject]'}, ${cam?.param}, ${style?.tags}, highly detailed, octane render, photorealistic realism ${engine?.defaultRatio} --motion 6 --camera zoom in`;
    } else if (selectedEngine === 'image') {
      return `Masterpiece commercial photograph of ${subjectText.trim() || '[Your Subject]'}, ${style?.tags}, shot on 85mm lens, f/1.8 aperture, studio lighting setup, crisp focus ${engine?.defaultRatio} --v 6.1 --style raw --q 2`;
    } else if (selectedEngine === 'tiktok') {
      return `[HOOK 3S]: "Đừng bao giờ bỏ qua video này nếu bạn đang tìm kiếm giải pháp cho ${subjectText.trim() || '[Vấn đề]'}!"\n[BODY STORY]: Dẫn dắt vấn đề thực tế ➔ Điểm nghẽn gây ức chế ➔ Giải pháp bất ngờ với sản phẩm.\n[CALL TO ACTION]: "Chỉ còn 20 suất voucher giảm giá trong giỏ hàng góc trái, bấm ngay kẻo lỡ!"`;
    } else if (selectedEngine === 'automation') {
      return `N8N Workflow Specification:
1. Trigger: Webhook / Cron every 6 hours
2. Action: Scrape top trending items for "${subjectText.trim() || 'Products'}"
3. AI Step: ChatGPT-4o rewrite viral hooks with PAS formula
4. Output: Auto-publish to WordPress & Telegram Channel with VietQR payment link`;
    } else {
      return `Prompt Architecture: Build a production-ready, accessible React 19 component for ${subjectText.trim() || 'Feature'}. Follow Haute Couture design tokens, 60fps Emil Kowalski easing, and fullstack AppSec principles.`;
    }
  }, [selectedEngine, selectedStyle, selectedCamera, subjectText]);

  const handleCopyPrompt = () => {
    playSuccess();
    navigator.clipboard?.writeText(generatedPrompt);
    setIsCopied(true);
    onShowToast?.('Đã copy Prompt hoàn chỉnh vào Clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReset = () => {
    playClick();
    setSubjectText('');
    onShowToast?.('Đã đặt lại dữ liệu phác thảo');
  };

  return (
    <div className="space-y-8 animate-studio-rise pb-20">
      
      {/* ─── HEADER ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-black p-6 sm:p-10 border border-white/10 shadow-2xl text-white">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>PROMPT STUDIO & IDEATOR SANDBOX</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Xưởng Phác Thảo & <br/>
            <span className="text-amber-400 font-display italic font-normal">Tạo Prompt Chuẩn Quốc Tế</span>
          </h1>
          <p className="text-sm text-stone-300 leading-relaxed">
            Kế thừa từ Ideator Sandbox của Bùi Thái Studio. Tự do phối trộn tham số góc quay, phong cách ánh sáng, tỷ lệ khung hình và sinh ra đoạn Prompt hoàn chỉnh trong 1 giây.
          </p>
        </div>
      </div>

      {/* ─── STUDIO BUILDER GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-xs">
          
          {/* 1. Chọn Engine */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>1. Chọn Thể Loại / Engine Mục Tiêu</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ENGINES.map((eng) => {
                const Icon = eng.icon;
                const isSel = selectedEngine === eng.id;
                return (
                  <button
                    key={eng.id}
                    onClick={() => {
                      playClick();
                      setSelectedEngine(eng.id);
                    }}
                    onMouseEnter={playHoverTick}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left ${
                      isSel
                        ? 'bg-amber-500/10 border-amber-500 text-stone-900 dark:text-white shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-amber-500/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${eng.color}`} />
                    <span className="truncate">{eng.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Nhập Ý Tưởng / Chủ Thể */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>2. Mô Tả Ý Tưởng / Chủ Thể (Subject)</span>
              </span>
              <button onClick={handleReset} className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer">
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
            </label>
            <textarea
              rows={3}
              value={subjectText}
              onChange={(e) => setSubjectText(e.target.value)}
              placeholder="Nhập chủ thể bằng tiếng Anh hoặc tiếng Việt (vd: Chiếc đồng hồ xa xỉ đặt trên tảng đá granite, ánh sáng mặt trời rọi qua kẽ lá...)"
              className="w-full p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed font-sans"
            />
          </div>

          {/* 3. Phong Cách Hình Ảnh (Visual Style) */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>3. Phong Cách Thẩm Mỹ & Ánh Sáng</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STYLES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    playClick();
                    setSelectedStyle(st.id);
                  }}
                  onMouseEnter={playHoverTick}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                    selectedStyle === st.id
                      ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-semibold'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-amber-500/40'
                  }`}
                >
                  <div className="font-semibold">{st.label}</div>
                  <div className="text-[10px] text-stone-400 truncate mt-0.5">{st.tags}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Góc Quay Camera (Dành cho Video & Ảnh) */}
          {(selectedEngine === 'video' || selectedEngine === 'image') && (
            <div className="space-y-2.5">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>4. Chuyển Động Camera & Góc Máy</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CAMERAS.map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => {
                      playClick();
                      setSelectedCamera(cam.id);
                    }}
                    onMouseEnter={playHoverTick}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                      selectedCamera === cam.id
                        ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-semibold'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-amber-500/40'
                    }`}
                  >
                    <div>{cam.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Output Stage (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="rounded-2xl bg-stone-950 text-white border border-white/15 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-bold">
                  // LIVE PROMPT OUTPUT
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-400">READY TO USE</span>
            </div>

            {/* Generated Text Box */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm font-mono text-stone-200 leading-relaxed whitespace-pre-wrap max-h-[320px] overflow-y-auto">
              {generatedPrompt}
            </div>

            {/* Negative Prompt */}
            {selectedEngine === 'image' && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-stone-400">// Negative Prompt:</span>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-[11px] font-mono text-stone-400">
                  {negativeText}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleCopyPrompt}
                onMouseEnter={playHoverTick}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-lg ${
                  isCopied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20'
                }`}
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Đã sao chép thành công!' : 'Copy Prompt 1-Chạm'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSuccess();
                  onSwitchTab?.('marketplace');
                  onShowToast?.('Chuyển tới Chợ Prompts để đăng bán!');
                }}
                onMouseEnter={playHoverTick}
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Đăng bán prompt này lên Chợ</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
