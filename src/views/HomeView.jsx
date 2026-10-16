import React, { useState } from 'react';
import CourseCard from '../components/CourseCard';
import ComboBanner from '../components/ComboBanner';
import TestimonialsFaq from '../components/TestimonialsFaq';
import VoucherBar from '../components/VoucherBar';
import ExamCountdownBanner from '../components/ExamCountdownBanner';
import { CATEGORIES, COURSES_DATA, COMBO_PACKAGE } from '../data/coursesData';
import { isCoursePurchased } from '../utils/storage';
import {
  Sparkles,
  Landmark,
  Code2,
  Languages,
  Search,
  ArrowRight,
  Zap,
  CheckCircle2,
  Trophy,
  Gamepad2,
  Flame,
  ChevronDown,
  Gift,
  Store,
  ShieldCheck,
  BrainCircuit,
  GraduationCap,
  RotateCw,
  Activity,
  TrendingUp
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
  onOpenTargetClock,
  allCourses
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchHome, setSearchHome] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'rating' | 'price_asc' | 'price_desc'
  const [quickPrompt, setQuickPrompt] = useState('60 câu hỏi trọng tâm Luật Cán bộ, công chức 2026 và Nghị định 138');
  const [quickSubject, setQuickSubject] = useState('cong-chuc');

  const filtered = allCourses.filter((c) => {
    const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
    const term = searchHome.toLowerCase().trim();
    const matchTerm =
      !term ||
      c.title.toLowerCase().includes(term) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(term)) ||
      (c.categoryLabel && c.categoryLabel.toLowerCase().includes(term));
    return matchCat && matchTerm;
  });

  const sortedAndFiltered = [...filtered].sort((a, b) => {
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

  const getCategoryIcon = (iconName, active) => {
    const iconColor = active ? 'text-white' : 'text-[#787774]';
    switch (iconName) {
      case 'Landmark':
        return <Landmark className={`w-4 h-4 ${iconColor}`} />;
      case 'Gamepad2':
        return <Gamepad2 className={`w-4 h-4 ${iconColor}`} />;
      case 'Code2':
        return <Code2 className={`w-4 h-4 ${iconColor}`} />;
      case 'Languages':
        return <Languages className={`w-4 h-4 ${iconColor}`} />;
      case 'Activity':
        return <Activity className={`w-4 h-4 ${iconColor}`} />;
      case 'TrendingUp':
        return <TrendingUp className={`w-4 h-4 ${iconColor}`} />;
      default:
        return <Sparkles className={`w-4 h-4 ${iconColor}`} />;
    }
  };

  const handleQuickGenerate = (e) => {
    e.preventDefault();
    onSwitchTab('create');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 text-[#37352f] dark:text-[#f8fafc]">
      
      {/* =========================================================
          HERO GLASS DASHBOARD CARD: HIGH-CONTRAST + 1-CLICK STUDY
          ========================================================= */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-[#e9e9e8] dark:border-white/15 shadow-3d-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-500/40 text-[#1458a6] dark:text-sky-300 text-[11px] font-bold">
              <span>🏠 KHÔNG GIAN ÔN LUYỆN THÔNG MINH 2026</span>
              <span className="text-sky-400">•</span>
              <span>{allCourses.reduce((sum, c) => sum + (c.cardsCount || (c.flashcards ? c.flashcards.length : 0)), 0).toLocaleString()}+ Thẻ Anki</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Kho Đề Thi & Bộ Thẻ Chuẩn Hóa
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Hệ thống tài liệu ôn thi trắc nghiệm công chức 2026, IT, Y khoa và ngoại ngữ ứng dụng thuật toán lặp lại ngắt quãng (Spaced Repetition SM-2).
            </p>
          </div>

          {/* 1-Click Quick Study Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => allCourses[0] && onOpenFlashcards(allCourses[0])}
              className="px-3.5 py-2 rounded-xl bg-[#2383e2] hover:bg-[#1a73e8] text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Ôn Nhanh 10 Thẻ Trọng Tâm</span>
            </button>

            <button
              type="button"
              onClick={() => allCourses[0] && onOpenQuiz(allCourses[0])}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Thi Thử Cấp Tốc</span>
            </button>

            {onOpenLeaderboard && (
              <button
                type="button"
                onClick={onOpenLeaderboard}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-white/15 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Bảng Vàng</span>
              </button>
            )}
          </div>
        </div>

        {/* High-Contrast Callout Box */}
        <div className="bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-white/10 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-200 flex items-start space-x-2.5">
          <span className="text-base leading-none">💡</span>
          <div className="leading-relaxed">
            <strong>Mẹo ôn thi hiệu quả:</strong> Bạn có thể bấm <span className="font-bold text-[#2383e2] dark:text-sky-400">"Xem Thẻ"</span> hoặc <span className="font-bold text-[#cc782f] dark:text-amber-400">"Thi Thử"</span> trên từng bộ tài liệu để kiểm tra kiến thức trước khi mở khóa trọn bộ, hoặc lưu mã giảm Xu ở thanh Giờ Vàng bên dưới.
          </div>
        </div>
      </div>

      {/* =========================================================
          NOTION AI GENERATOR WIDGET (TINH GIẢN & TẬP TRUNG)
          ========================================================= */}
      <section className="bg-[#fbfbfa] dark:bg-slate-900/90 rounded-xl p-4 sm:p-5 border border-[#e9e9e8] dark:border-white/10 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-base">✨</span>
            <span className="text-xs font-bold text-[#37352f] dark:text-white uppercase tracking-wider">
              Studio Tạo Thẻ Tự Động (AI Flashcards)
            </span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f4f0f7] dark:bg-purple-950/70 text-[#9065b0] dark:text-purple-300 border border-[#e3d7ec] dark:border-purple-600/40">
            Anki SM-2
          </span>
        </div>

        {/* AI Prompt Input Box */}
        <form onSubmit={handleQuickGenerate} className="bg-white dark:bg-slate-800/90 rounded-lg p-3 sm:p-4 border border-[#e9e9e8] dark:border-white/10 shadow-2xs space-y-3">
          <textarea
            rows={2}
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            placeholder="Nhập chủ đề hoặc tài liệu cần học (ví dụ: 60 câu hỏi Luật Cán bộ công chức 2026, Từ vựng IELTS 7.5, System Design...)"
            className="w-full text-xs sm:text-sm text-[#37352f] dark:text-white placeholder:text-[#9b9a97] dark:placeholder:text-slate-400 font-medium bg-transparent border-0 outline-none resize-none leading-relaxed"
          />

          <div className="pt-2.5 border-t border-[#f1f1ef] dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Subject Dropdown */}
            <div className="relative inline-block">
              <select
                value={quickSubject}
                onChange={(e) => setQuickSubject(e.target.value)}
                className="appearance-none bg-[#f7f6f5] dark:bg-slate-700/80 border border-[#e9e9e8] dark:border-white/10 text-[#37352f] dark:text-white font-semibold text-xs rounded-md px-3 py-1.5 pr-7 outline-none cursor-pointer hover:bg-[#efefed] dark:hover:bg-slate-700 transition-colors"
              >
                <option value="cong-chuc">🏛️ Công Chức 2026</option>
                <option value="it-tech">💻 IT & System Design</option>
                <option value="ngoai-ngu">🌍 IELTS / TOEIC / JLPT</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#787774] dark:text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-[#2e2e2e] dark:bg-indigo-600 hover:bg-[#1a1a1a] dark:hover:bg-indigo-500 text-white font-semibold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tạo Bộ Thẻ Ngay</span>
            </button>
          </div>
        </form>
      </section>

      {/* Countdown đếm ngược ngày thi thực chiến (Đồng bộ Giờ Hà Nội) */}
      <ExamCountdownBanner onOpenTargetModal={onOpenTargetClock} />

      {/* =========================================================
          4-CARD QUICK ACTION TILES (NOTION DATABASE ITEMS)
          ========================================================= */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        
        {/* Card 1: Đề Thi Công Chức 2026 */}
        <div
          onClick={() => {
            setSelectedCategory('cong-chuc');
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/10 shadow-3d-sm hover:shadow-3d-md card-3d touch-3d cursor-pointer transition-all group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#fbf3db] dark:bg-amber-950/70 text-[#c29243] dark:text-amber-300 border border-[#f4e4b7] dark:border-amber-700/50 flex items-center justify-center mb-2">
            <Landmark className="w-4 h-4" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white">Đề Thi Công Chức</h4>
          <p className="text-[11px] text-[#787774] dark:text-slate-200 mt-0.5">Chuẩn Nghị định 138/2020</p>
        </div>

        {/* Card 2: Chợ Thẻ C2C */}
        <div
          onClick={() => onSwitchTab('marketplace')}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/10 shadow-3d-sm hover:shadow-3d-md card-3d touch-3d cursor-pointer transition-all group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#edf3ec] dark:bg-emerald-950/70 text-[#448361] dark:text-emerald-300 border border-[#d3e5d7] dark:border-emerald-700/50 flex items-center justify-center mb-2">
            <Store className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white">Chợ Thẻ C2C</h4>
            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded notion-pill-orange">HOT</span>
          </div>
          <p className="text-[11px] text-[#787774] dark:text-slate-200 mt-0.5">Mua bán & Pass lại thẻ</p>
        </div>

        {/* Card 3: Túi Mù Tri Thức */}
        <div
          onClick={onOpenBlindBox}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/10 shadow-3d-sm hover:shadow-3d-md card-3d touch-3d cursor-pointer transition-all group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f4f0f7] dark:bg-purple-950/70 text-[#9065b0] dark:text-purple-300 border border-[#e3d7ec] dark:border-purple-700/50 flex items-center justify-center mb-2">
            <Gift className="w-4 h-4" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white">Túi Mù Tri Thức</h4>
          <p className="text-[11px] text-[#787774] dark:text-slate-200 mt-0.5">100% trúng hoàn Xu & VIP</p>
        </div>

        {/* Card 4: Game Nối Thẻ */}
        <div
          onClick={() => onOpenMatchGame(allCourses[0])}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/10 shadow-3d-sm hover:shadow-3d-md card-3d touch-3d cursor-pointer transition-all group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#e7f3f8] dark:bg-sky-950/70 text-[#2b7aa1] dark:text-sky-300 border border-[#cbe3ed] dark:border-sky-700/50 flex items-center justify-center mb-2">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white">Game Nối Thẻ</h4>
          <p className="text-[11px] text-[#787774] dark:text-slate-200 mt-0.5">Học nhanh qua phản xạ</p>
        </div>

      </section>

      {/* FLASH SALE VOUCHERS STRIP */}
      <VoucherBar />

      {/* =========================================================
          CATEGORY FILTER & SEARCH CONTROLS (NOTION DATABASE TABS)
          ========================================================= */}
      <section id="catalog-section" className="bg-[#fbfbfa] dark:bg-slate-900/90 rounded-xl p-3 sm:p-4 border border-[#e9e9e8] dark:border-white/10 shadow-2xs text-[#37352f] dark:text-[#f8fafc]">
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
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-white dark:bg-slate-800 text-[#37352f] dark:text-white shadow-2xs border border-[#e9e9e8] dark:border-white/15 font-bold'
                      : 'text-[#787774] dark:text-slate-300 hover:text-[#37352f] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-medium ${
                    active
                      ? 'bg-[#f1f1ef] dark:bg-slate-700 text-[#37352f] dark:text-white'
                      : 'bg-[#f1f1ef] dark:bg-slate-800 text-[#9b9a97] dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#9b9a97] dark:text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                value={searchHome}
                onChange={(e) => setSearchHome(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-slate-800 text-[#37352f] dark:text-white placeholder:text-[#9b9a97] dark:placeholder:text-slate-400 border border-[#e9e9e8] dark:border-white/15 rounded-md outline-none focus:border-[#2383e2] dark:focus:border-sky-400 shadow-2xs transition-all"
              />
              {searchHome && (
                <button
                  type="button"
                  onClick={() => setSearchHome('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#787774] dark:text-slate-400 hover:text-[#37352f] dark:hover:text-white text-xs font-bold"
                >
                  ×
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-2.5 pr-7 py-1.5 text-xs bg-white dark:bg-slate-800 text-[#37352f] dark:text-white font-semibold border border-[#e9e9e8] dark:border-white/15 rounded-md outline-none focus:border-[#2383e2] dark:focus:border-sky-400 hover:bg-[#efefed] dark:hover:bg-slate-700 cursor-pointer shadow-2xs transition-colors"
              >
                <option value="popular">🔥 Bán chạy</option>
                <option value="rating">⭐ Đánh giá cao</option>
                <option value="price_asc">🪙 Giá: Thấp → Cao</option>
                <option value="price_desc">💎 Giá: Cao → Thấp</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#787774] dark:text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          COURSES CATALOG (TINH GỌN & DỄ TIẾP CẬN)
          ========================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 rounded-xl border border-[#e9e9e8] dark:border-white/15 shadow-2xs">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              📚 Kho Bộ Đề & Flashcard Tiêu Chuẩn ({sortedAndFiltered.length} bộ đề)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Học thử lật thẻ 3D và thi trắc nghiệm tính giờ miễn phí trước khi mở khóa toàn bộ.
            </p>
          </div>
          <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-500/40 self-start sm:self-center">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Đã kiểm duyệt 2026</span>
          </span>
        </div>

        {sortedAndFiltered.length === 0 ? (
          <ActionableEmptyState
            icon={Search}
            badge="KẾT QUẢ TÌM KIẾM"
            title={searchHome ? `Không tìm thấy tài liệu phù hợp với "${searchHome}"` : 'Chưa có bộ đề nào trong danh mục này'}
            description="Hãy thử kiểm tra lại chính tả hoặc quay về xem toàn bộ kho tài liệu chuẩn của OnThiHub."
            primaryAction={{
              label: `Xem Tất Cả (${allCourses.length} Bộ Đề)`,
              onClick: () => {
                setSearchHome('');
                setSelectedCategory('all');
              },
              icon: RotateCw
            }}
            secondaryAction={{
              label: 'Yêu Cầu AI Soạn Thẻ Mới',
              onClick: () => onSwitchTab('create'),
              icon: Sparkles
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
              />
            ))}
          </div>
        )}
      </section>

      {/* Combo VIP Banner */}
      <ComboBanner onBuyCombo={onBuyCombo} />

      {/* Testimonials & FAQs */}
      <TestimonialsFaq />

    </div>
  );
}
