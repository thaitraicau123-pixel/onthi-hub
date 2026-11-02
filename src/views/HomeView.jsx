import React, { useState, useMemo } from 'react';
import CourseCard from '../components/CourseCard';
import ComboBanner from '../components/ComboBanner';
import { CATEGORIES, COURSES_DATA, COMBO_PACKAGE } from '../data/coursesData';
import { isCoursePurchased } from '../utils/storage';
import {
  Sparkles,
  Gamepad2,
  Code2,
  TrendingUp,
  Activity,
  Languages,
  Search,
  ArrowRight,
  Zap,
  CheckCircle2,
  Trophy,
  Flame,
  ChevronDown,
  Gift,
  Store,
  ShieldCheck,
  BrainCircuit,
  Coins,
  Video,
  Camera,
  Layers,
  FileText
} from 'lucide-react';
import { ActionableEmptyState } from '../components/UIStateFeedback';

export default function HomeView({
  onOpenFlashcards,
  onOpenQuiz,
  onBuyCourse,
  onBuyCombo,
  onSwitchTab,
  onOpenMatchGame,
  onOpenLeaderboard,
  onOpenBlindBox,
  allCourses = COURSES_DATA,
  onShowToast,
  onOpenDirectChat
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchHome, setSearchHome] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'rating' | 'price_asc' | 'price_desc'
  const [quickPrompt, setQuickPrompt] = useState('Cinematic slow drone hyperlapse qua thành phố Tokyo cyberpunk mưa đêm ánh đèn neon phản chiếu 8k');
  const [quickSubject, setQuickSubject] = useState('video-ai');

  const sortedAndFiltered = useMemo(() => {
    const term = searchHome.toLowerCase().trim();
    const filtered = allCourses.filter((c) => {
      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
      const matchTerm =
        !term ||
        c.title.toLowerCase().includes(term) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(term)) ||
        (c.categoryLabel && c.categoryLabel.toLowerCase().includes(term));
      return matchCat && matchTerm;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.studentsCount || b.salesCount || 0) - (a.studentsCount || a.salesCount || 0);
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'price_asc') {
        return (a.priceXu || 0) - (b.priceXu || 0);
      }
      if (sortBy === 'price_desc') {
        return (b.priceXu || 0) - (a.priceXu || 0);
      }
      return 0;
    });
  }, [allCourses, selectedCategory, searchHome, sortBy]);

  const getCategoryIcon = (iconName, active) => {
    const iconColor = active ? 'text-white' : 'text-[#787774]';
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 className={`w-4 h-4 ${iconColor}`} />;
      case 'Code2':
        return <Code2 className={`w-4 h-4 ${iconColor}`} />;
      case 'TrendingUp':
        return <TrendingUp className={`w-4 h-4 ${iconColor}`} />;
      case 'Activity':
        return <Activity className={`w-4 h-4 ${iconColor}`} />;
      case 'Languages':
        return <Languages className={`w-4 h-4 ${iconColor}`} />;
      default:
        return <Sparkles className={`w-4 h-4 ${iconColor}`} />;
    }
  };

  const handleQuickGenerate = (e) => {
    e.preventDefault();
    try {
      if (quickPrompt.trim()) {
        const draftPayload = JSON.stringify({
          topic: quickPrompt.trim(),
          category: quickSubject || 'video-ai'
        });
        localStorage.setItem('promptmmo_quick_studio_draft', draftPayload);
        localStorage.setItem('onthi_quick_studio_draft', draftPayload);
      }
    } catch {
      // ignore storage errors
    }
    onSwitchTab('create');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 text-slate-900 dark:text-zinc-100 max-w-7xl mx-auto">
      
      {/* =========================================================
          HERO: APPLE LIQUID GLASS PROMPT & AI SKILLS STUDIO
          ========================================================= */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-[#141419]/70 backdrop-blur-2xl shadow-xl overflow-hidden">
        {/* Subtle Ambient Refraction Highlight */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#007aff]/10 dark:bg-[#0a84ff]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-[11px] font-mono tracking-wider uppercase font-semibold text-slate-600 dark:text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>PromptMMO Studio • AI Skills & Workflows</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
            Chợ Prompt AI & Kỹ Nghệ Tự Động Hóa
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
            Hơn 1,000+ Prompt Higgsfield & Kling Video 8K, Mẫu ảnh studio Flux & Midjourney, và AI Workflows N8N thực chiến được kiểm chứng chuyển đổi cho Creator & Solopreneurs.
          </p>

          {/* Quick CTA Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => allCourses[0] && onOpenFlashcards(allCourses[0])}
              className="apple-btn-prominent px-6 py-3 rounded-full text-xs font-bold shadow-lg flex items-center space-x-2 cursor-pointer transition-transform active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-white text-white" />
              <span>Khám Phá Prompt Bestseller</span>
            </button>

            <button
              type="button"
              onClick={() => onSwitchTab('wallet')}
              className="apple-btn-secondary px-6 py-3 rounded-full text-xs font-bold flex items-center space-x-2 cursor-pointer transition-transform active:scale-[0.98]"
            >
              <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Ví Xu & Nạp Tiền Siêu Tốc</span>
            </button>
          </div>

          {/* 4 Apple Liquid Glass Metric Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full pt-6 mt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.04]">
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">1,200+</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">Prompt Kiểm Định</div>
            </div>
            <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.04]">
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400 tabular-nums">99.4%</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">Đánh Giá 5★</div>
            </div>
            <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.04]">
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">&lt;0.4s</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">Mở Khóa Tức Thì</div>
            </div>
            <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.04]">
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#007aff] dark:text-[#0a84ff] tabular-nums">100%</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">Bảo Mật Kép Anti-F12</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          KHO PROMPT & AI SKILLS TIÊU CHUẨN (CATALOG SECTION)
          ========================================================= */}
      <section id="catalog-section" className="space-y-5">
        <div className="apple-card rounded-2xl p-4 sm:p-6 border border-black/[0.06] dark:border-white/[0.08] shadow-sm space-y-4">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Kho Prompt & AI Skills Tiêu Chuẩn</span>
                <span className="text-xs font-mono font-medium text-slate-400 dark:text-zinc-500 tabular-nums">
                  ({sortedAndFiltered.length} sản phẩm)
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Bấm vào từng gói để xem trước câu lệnh tiếng Anh & tham số kỹ thuật trước khi mở khóa.
              </p>
            </div>
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0 self-start sm:self-center">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Prompt Test Chuẩn 100%</span>
            </div>
          </div>

          {/* Segmented Category Filter & Search Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="apple-segmented-container flex flex-wrap items-center gap-1">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id;
                const count = cat.id === 'all'
                  ? allCourses.length
                  : allCourses.filter(c => c.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`apple-segmented-item flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                      active ? 'active' : ''
                    }`}
                  >
                    {getCategoryIcon(cat.icon, active)}
                    <span>{cat.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                      active
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        : 'bg-black/[0.04] dark:bg-white/[0.08] text-slate-400 dark:text-zinc-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search & Sort */}
            <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm kiếm Prompt Higgsfield, Kling, Flux..."
                  value={searchHome}
                  onChange={(e) => setSearchHome(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs bg-black/[0.03] dark:bg-white/[0.06] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 border border-black/[0.06] dark:border-white/[0.08] rounded-full outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-[#007aff] transition-all"
                />
                {searchHome && (
                  <button
                    type="button"
                    onClick={() => setSearchHome('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2 px-3 text-xs bg-black/[0.03] dark:bg-white/[0.06] text-slate-900 dark:text-white border border-black/[0.06] dark:border-white/[0.08] rounded-full outline-none cursor-pointer font-semibold"
              >
                <option value="popular">Bestseller 🔥</option>
                <option value="rating">Đánh giá cao ⭐</option>
                <option value="price_asc">Giá Xu: Thấp ➔ Cao</option>
                <option value="price_desc">Giá Xu: Cao ➔ Thấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {sortedAndFiltered.length === 0 ? (
          <ActionableEmptyState
            title="Không tìm thấy sản phẩm Prompt phù hợp"
            description="Hãy thử đổi từ khóa tìm kiếm hoặc bấm xem tất cả các danh mục Prompt."
            actionText="Xem Tất Cả Prompt"
            onAction={() => {
              setSearchHome('');
              setSelectedCategory('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedAndFiltered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isPurchased={isCoursePurchased(course.id)}
                onOpenFlashcards={onOpenFlashcards}
                onOpenQuiz={onOpenQuiz}
                onBuy={onBuyCourse}
                onShowToast={onShowToast}
                onOpenDirectChat={onOpenDirectChat}
              />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          CREATOR STUDIO QUICK DRAFT BANNER & 4 MINI TILES
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Quick Draft Studio (7 cols) */}
        <section className="lg:col-span-7 apple-card rounded-3xl p-5 sm:p-6 border border-black/[0.06] dark:border-white/[0.08] shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl p-2 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">✍️</span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Studio Đăng Bán Prompt & AI Skills (Hưởng 80% Lợi Nhuận)
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Bạn sở hữu Prompt hay hoặc Workflow tự động hóa? Đăng lên chợ để kiếm Xu hoa hồng thụ động mỗi khi có người mua.
              </p>
            </div>
          </div>

          <form onSubmit={handleQuickGenerate} className="space-y-3">
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="Nhập tên hoặc câu lệnh prompt bạn muốn đăng bán..."
              className="w-full px-3.5 py-2 text-xs bg-black/[0.03] dark:bg-white/[0.06] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 border border-black/[0.06] dark:border-white/[0.08] rounded-xl outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-amber-500 transition-all"
            />
            <div className="flex items-center justify-between gap-2.5">
              <select
                value={quickSubject}
                onChange={(e) => setQuickSubject(e.target.value)}
                className="py-2 px-3 text-xs bg-black/[0.03] dark:bg-white/[0.06] text-slate-900 dark:text-white border border-black/[0.06] dark:border-white/[0.08] rounded-xl outline-none cursor-pointer font-semibold"
              >
                <option value="video-ai">🎬 Video AI (Higgsfield/Kling)</option>
                <option value="image-ai">🎨 Ảnh Studio (Flux/Midjourney)</option>
                <option value="copy-mmo">✍️ Kịch Bản & Content</option>
                <option value="skills-automation">⚡ AI Skills & Auto N8N</option>
                <option value="acc-tools">🔑 Tool & Tài Khoản MMO</option>
              </select>

              <button
                type="submit"
                className="apple-btn-prominent px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mở Studio Đăng Bán</span>
              </button>
            </div>
          </form>
        </section>

        {/* Right: 4 Quick Mini Tiles (5 cols) */}
        <section className="lg:col-span-5 grid grid-cols-2 gap-3">
          {/* Card 1: Video AI Hot */}
          <div
            onClick={() => {
              setSelectedCategory('video-ai');
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-4 rounded-2xl apple-card border border-black/[0.06] dark:border-white/[0.08] hover:border-amber-500/40 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col justify-between select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Video AI 8K</h4>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Higgsfield & Kling</p>
            </div>
          </div>

          {/* Card 2: Kho Của Tôi */}
          <div
            onClick={() => onSwitchTab('library')}
            className="p-4 rounded-2xl apple-card border border-black/[0.06] dark:border-white/[0.08] hover:border-emerald-500/40 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col justify-between select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Kho Của Tôi</h4>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">PRO</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Prompt & Code đã mở khóa</p>
            </div>
          </div>

          {/* Card 3: Túi Mù May Mắn */}
          <div
            onClick={onOpenBlindBox}
            className="p-4 rounded-2xl apple-card border border-black/[0.06] dark:border-white/[0.08] hover:border-purple-500/40 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col justify-between select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Túi Mù May Mắn</h4>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Nhận Xu Free Mỗi Ngày</p>
            </div>
          </div>

          {/* Card 4: Ví Xu & Nạp Thẻ */}
          <div
            onClick={() => onSwitchTab('wallet')}
            className="p-4 rounded-2xl apple-card border border-black/[0.06] dark:border-white/[0.08] hover:border-sky-500/40 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col justify-between select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2">
              <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Ví Xu VietQR</h4>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Nạp tự động 3 giây</p>
            </div>
          </div>
        </section>
      </div>

      {/* Combo VIP Banner */}
      <ComboBanner
        onBuyCombo={onBuyCombo}
        isPurchased={isCoursePurchased(COMBO_PACKAGE.id)}
      />

    </div>
  );
}
