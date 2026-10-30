import React, { useState, useMemo } from 'react';
import CourseCard from '../components/CourseCard';
import ComboBanner from '../components/ComboBanner';
import TestimonialsFaq from '../components/TestimonialsFaq';
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
    <div className="space-y-6 animate-fade-in pb-16 text-[#37352f] dark:text-[#f8fafc]">
      
      {/* =========================================================
          HERO GLASS DASHBOARD CARD: PROMPT & SKILL MMO MARKETPLACE
          ========================================================= */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-[#e9e9e8] dark:border-white/15 shadow-3d-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
              <span>🚀 PROMPTMMO v4.0 • CHỢ PROMPT & AI SKILLS THỰC CHIẾN</span>
              <span className="text-amber-400">•</span>
              <span>1,000+ Prompt Đã Test Ra Kết Quả</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Chợ Prompt & AI Skills Kiếm Tiền MMO
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Hơn 1,000+ Prompt Higgsfield & Kling 1.5 Video 8K, Mẫu ảnh studio Flux & Midjourney, Kịch bản TikTok Shop triệu view và Workflow N8N tự động hóa kiếm tiền cho Creator & Dân MMO.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => allCourses[0] && onOpenFlashcards(allCourses[0])}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-white text-white" />
              <span>Xem Prompt Bestseller</span>
            </button>

            <button
              type="button"
              onClick={() => onSwitchTab('wallet')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Coins className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Nạp Xu Siêu Tốc</span>
            </button>

            {onOpenBlindBox && (
              <button
                type="button"
                onClick={onOpenBlindBox}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-white/15 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5 text-purple-500" />
                <span>Nhận Xu Free</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Feature highlight tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          <div
            onClick={() => setSelectedCategory('video-ai')}
            className="text-left p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/60 dark:to-slate-900 border border-amber-300/70 dark:border-amber-500/40 hover:border-amber-500 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <span>🎬 Video AI Triệu View</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-600 text-white animate-pulse">
                HIGGSFIELD & KLING
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Prompt video 8K chuẩn điện ảnh, góc quay Drone, Hyperlapse và Hook 3s giữ chân người xem 95%.
            </p>
          </div>

          <div
            onClick={() => setSelectedCategory('image-ai')}
            className="text-left p-3.5 rounded-xl bg-gradient-to-br from-sky-500/10 via-blue-500/10 to-indigo-500/10 dark:from-sky-950/60 dark:to-slate-900 border border-sky-300/70 dark:border-sky-500/40 hover:border-sky-500 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                <span>🎨 Ảnh Studio Chuẩn Mall</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-sky-600 text-white">
                FLUX & MIDJOURNEY
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Mockup mỹ phẩm, người mẫu thời trang Á Đông, banner Shopee/TikTok Shop không tốn tiền studio.
            </p>
          </div>

          <div
            onClick={() => setSelectedCategory('copy-mmo')}
            className="text-left p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-sky-500/10 dark:from-emerald-950/60 dark:to-slate-900 border border-emerald-300/70 dark:border-emerald-500/40 hover:border-emerald-500 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <span>✍️ Kịch Bản Chốt Đơn</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white">
                X3 CHUYỂN ĐỔI
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Prompt kịch bản 60s bảng 2 cột, 100 câu hook hút mắt và kịch bản MC Livestream đẩy đỉnh doanh số.
            </p>
          </div>

          <div
            onClick={() => setSelectedCategory('skills-automation')}
            className="text-left p-3.5 rounded-xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 dark:from-purple-950/60 dark:to-slate-900 border border-purple-300/70 dark:border-purple-500/40 hover:border-purple-500 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                <span>⚡ AI Skills & Auto N8N</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-purple-600 text-white">
                AUTO 24/7
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Bộ cỗ máy cào sản phẩm bán chạy, viết bài tự động và AI Agent trả lời inbox fanpage chốt đơn tự động.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          KHO PROMPT & AI SKILLS TIÊU CHUẨN (CATALOG SECTION)
          ========================================================= */}
      <section id="catalog-section" className="space-y-4">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#e9e9e8] dark:border-white/15 shadow-2xs space-y-3.5">
          {/* Row 1: Title & Verified Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f0efed] dark:border-white/10">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>🔥 Chợ Prompt & AI Skills Tiêu Chuẩn</span>
                <span className="text-xs font-normal text-slate-500">({sortedAndFiltered.length} sản phẩm)</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Bấm <strong className="text-amber-600 dark:text-amber-400">&ldquo;Xem Prompt Mẫu&rdquo;</strong> trên từng gói để xem trước câu lệnh tiếng Anh & tham số kỹ thuật trước khi mở khóa.
              </p>
            </div>
            <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-500/40 self-start sm:self-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Prompt Test Chuẩn 100%</span>
            </span>
          </div>

          {/* Row 2: Category Tabs + Search & Sort Controls */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Notion Database Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
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
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-2xs font-bold'
                        : 'bg-[#f7f6f5] dark:bg-slate-800/80 text-[#5a5955] dark:text-slate-300 hover:text-[#37352f] dark:hover:text-white hover:bg-[#efefed] dark:hover:bg-slate-700 border border-[#e9e9e8] dark:border-white/10'
                    }`}
                  >
                    {getCategoryIcon(cat.icon, active)}
                    <span>{cat.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-white dark:bg-slate-900 text-[#787774] dark:text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#9b9a97] dark:text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm kiếm Prompt Higgsfield, Kling, Flux..."
                  value={searchHome}
                  onChange={(e) => setSearchHome(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#f7f6f5] dark:bg-slate-800 text-[#37352f] dark:text-white placeholder:text-[#9b9a97] dark:placeholder:text-slate-400 border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 dark:focus:border-amber-400 transition-all"
                />
                {searchHome && (
                  <button
                    type="button"
                    onClick={() => setSearchHome('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#9b9a97] hover:text-[#37352f] dark:hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1.5 px-2.5 text-xs bg-[#f7f6f5] dark:bg-slate-800 text-[#37352f] dark:text-white border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none cursor-pointer"
              >
                <option value="popular">Bán chạy nhất 🔥</option>
                <option value="rating">Đánh giá cao ⭐</option>
                <option value="price_asc">Giá Xu thấp ➔ cao</option>
                <option value="price_desc">Giá Xu cao ➔ thấp</option>
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
        <section className="lg:col-span-7 bg-white/95 dark:bg-slate-900/90 rounded-2xl p-5 border border-[#e9e9e8] dark:border-white/15 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">✍️</span>
            <div>
              <h3 className="text-sm font-bold text-[#37352f] dark:text-white">
                Studio Đăng Bán Prompt & AI Skills (Hưởng 80% Lợi Nhuận)
              </h3>
              <p className="text-xs text-[#787774] dark:text-slate-300">
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
              className="w-full px-3 py-2 text-xs bg-[#f7f6f5] dark:bg-slate-800 text-[#37352f] dark:text-white placeholder:text-[#9b9a97] dark:placeholder:text-slate-400 border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:border-amber-500 transition-all"
            />
            <div className="flex items-center justify-between gap-2">
              <select
                value={quickSubject}
                onChange={(e) => setQuickSubject(e.target.value)}
                className="py-1.5 px-2.5 text-xs bg-[#f7f6f5] dark:bg-slate-800 text-[#37352f] dark:text-white border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none cursor-pointer"
              >
                <option value="video-ai">🎬 Video AI (Higgsfield/Kling)</option>
                <option value="image-ai">🎨 Ảnh Studio (Flux/Midjourney)</option>
                <option value="copy-mmo">✍️ Kịch Bản & Content</option>
                <option value="skills-automation">⚡ AI Skills & Auto N8N</option>
                <option value="acc-tools">🔑 Tool & Tài Khoản MMO</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mở Studio Đăng Bán</span>
              </button>
            </div>
          </form>
        </section>

        {/* Right: 4 Quick Mini Tiles (5 cols) */}
        <section className="lg:col-span-5 grid grid-cols-2 gap-2.5">
          {/* Card 1: Video AI Hot */}
          <div
            onClick={() => {
              setSelectedCategory('video-ai');
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/15 shadow-2xs hover:border-amber-500 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col justify-between select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50 flex items-center justify-center mb-2">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white">Video AI 8K</h4>
              <p className="text-[11px] text-[#787774] dark:text-slate-300 mt-0.5">Higgsfield & Kling</p>
            </div>
          </div>

          {/* Card 2: Chợ Prompt C2C */}
          <div
            onClick={() => onSwitchTab('marketplace')}
            className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/15 shadow-2xs hover:border-emerald-500 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col justify-between select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#edf3ec] dark:bg-emerald-950/70 text-[#448361] dark:text-emerald-300 border border-[#d3e5d7] dark:border-emerald-700/50 flex items-center justify-center mb-2">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white">Chợ Prompt C2C</h4>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/40">HOT</span>
              </div>
              <p className="text-[11px] text-[#787774] dark:text-slate-300 mt-0.5">Sàn mua bán Creator</p>
            </div>
          </div>

          {/* Card 3: Túi Mù May Mắn */}
          <div
            onClick={onOpenBlindBox}
            className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/15 shadow-2xs hover:border-purple-500 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col justify-between select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#f4f0f7] dark:bg-purple-950/70 text-[#9065b0] dark:text-purple-300 border border-[#e3d7ec] dark:border-purple-700/50 flex items-center justify-center mb-2">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white">Túi Mù May Mắn</h4>
              <p className="text-[11px] text-[#787774] dark:text-slate-300 mt-0.5">Nhận Xu Free Mỗi Ngày</p>
            </div>
          </div>

          {/* Card 4: Ví Xu & Nạp Thẻ */}
          <div
            onClick={() => onSwitchTab('wallet')}
            className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/15 shadow-2xs hover:border-sky-500 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col justify-between select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#e7f3f8] dark:bg-sky-950/70 text-[#2b7aa1] dark:text-sky-300 border border-[#cbe3ed] dark:border-sky-700/50 flex items-center justify-center mb-2">
              <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white">Ví Xu VietQR</h4>
              <p className="text-[11px] text-[#787774] dark:text-slate-300 mt-0.5">Nạp tự động 3 giây</p>
            </div>
          </div>
        </section>
      </div>

      {/* Combo VIP Banner */}
      <ComboBanner
        onBuyCombo={onBuyCombo}
        isPurchased={isCoursePurchased(COMBO_PACKAGE.id)}
      />

      {/* Testimonials & FAQs */}
      <TestimonialsFaq />

    </div>
  );
}
