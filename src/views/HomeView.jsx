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
  GraduationCap
} from 'lucide-react';

export default function HomeView({
  onOpenFlashcards,
  onOpenQuiz,
  onBuyCourse,
  onBuyCombo,
  onSwitchTab,
  onOpenMatchGame,
  onOpenLeaderboard,
  onOpenBlindBox,
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
    const iconColor = active ? 'text-white' : 'text-[#f02c85]';
    switch (iconName) {
      case 'Landmark':
        return <Landmark className={`w-4 h-4 ${iconColor}`} />;
      case 'Code2':
        return <Code2 className={`w-4 h-4 ${iconColor}`} />;
      case 'Languages':
        return <Languages className={`w-4 h-4 ${iconColor}`} />;
      default:
        return <Sparkles className={`w-4 h-4 ${iconColor}`} />;
    }
  };

  const handleQuickGenerate = (e) => {
    e.preventDefault();
    onSwitchTab('create');
  };

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in pb-16">
      
      {/* =========================================================
          HERO SECTION: AI GENERATOR (TINH GIẢN & TẬP TRUNG)
          ========================================================= */}
      <section className="bg-[#fcf7ec] rounded-3xl p-6 sm:p-8 border border-[#eadfcb] shadow-xl text-[#28071a] relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-5">
          
          {/* Header text */}
          <div className="text-center sm:text-left space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#f02c85]/10 text-[#f02c85] border border-[#f02c85]/20 text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI FLASHCARD GENERATOR • THUẬT TOÁN ANKI SM-2</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#28071a] tracking-tight leading-tight">
              Tạo bộ flashcard thông minh chỉ với 1 lời nhắc
            </h2>
            
            <p className="text-xs sm:text-sm text-[#7a5a6b] font-medium max-w-2xl">
              Nhập bất kỳ điều luật công chức 2026, câu hỏi phỏng vấn IT hoặc từ vựng ngoại ngữ nào để hệ thống tự động sinh câu hỏi trắc nghiệm & thẻ nhớ 3D.
            </p>
          </div>

          {/* AI Prompt Input Box */}
          <form onSubmit={handleQuickGenerate} className="bg-white rounded-2xl p-4 sm:p-5 border border-[#eadfcb] shadow-xs space-y-3">
            <textarea
              rows={2}
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="Nhập chủ đề hoặc tài liệu cần học (ví dụ: 60 câu hỏi Luật Cán bộ công chức 2026, Từ vựng IELTS 7.5, System Design...)"
              className="w-full text-xs sm:text-sm text-[#28071a] placeholder:text-slate-400 font-bold bg-transparent border-0 outline-none resize-none leading-relaxed"
            />

            <div className="pt-3 border-t border-[#f4ecd8] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Subject Dropdown */}
              <div className="relative inline-block">
                <select
                  value={quickSubject}
                  onChange={(e) => setQuickSubject(e.target.value)}
                  className="appearance-none bg-[#fcf5e5] border border-[#eadfcb] text-[#2c081c] font-black text-xs rounded-xl px-3.5 py-2 pr-8 outline-none cursor-pointer hover:bg-[#faebd0] transition-colors"
                >
                  <option value="cong-chuc">🏛️ Công Chức 2026</option>
                  <option value="it-tech">💻 IT & System Design</option>
                  <option value="ngoai-ngu">🌍 IELTS / TOEIC / JLPT</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#2c081c] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl btn-wayground-sunset text-white font-black text-xs shadow-md shadow-pink-900/25 flex items-center justify-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                <span>Tạo Bộ Thẻ Ngay</span>
              </button>
            </div>
          </form>

        </div>
      </section>

      {/* Countdown đếm ngược ngày thi thực chiến */}
      <ExamCountdownBanner />

      {/* =========================================================
          4-CARD QUICK ACTION HUB (SẮP XẾP GỌN GÀNG, ĐẦY ĐỦ TIỆN ÍCH)
          ========================================================= */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Đề Thi Công Chức 2026 */}
        <div
          onClick={() => {
            setSelectedCategory('cong-chuc');
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-4 rounded-2xl bg-[#fcf7ec] border border-[#eadfcb] shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Landmark className="w-4.5 h-4.5" />
          </div>
          <h4 className="text-xs sm:text-sm font-black text-[#28071a]">Đề Thi Công Chức</h4>
          <p className="text-[11px] text-[#7a5a6b] font-medium mt-0.5">Chuẩn Nghị định 138/2020</p>
        </div>

        {/* Card 2: Chợ Thẻ C2C */}
        <div
          onClick={() => onSwitchTab('marketplace')}
          className="p-4 rounded-2xl bg-[#fcf7ec] border border-[#eadfcb] shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Store className="w-4.5 h-4.5" />
          </div>
          <div className="flex items-center space-x-1.5">
            <h4 className="text-xs sm:text-sm font-black text-[#28071a]">Chợ Thẻ C2C</h4>
            <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full bg-emerald-500 text-white">HOT</span>
          </div>
          <p className="text-[11px] text-[#7a5a6b] font-medium mt-0.5">Mua bán & Pass lại thẻ</p>
        </div>

        {/* Card 3: Túi Mù Tri Thức */}
        <div
          onClick={onOpenBlindBox}
          className="p-4 rounded-2xl bg-[#fcf7ec] border border-[#eadfcb] shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-800 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Gift className="w-4.5 h-4.5 animate-bounce" />
          </div>
          <h4 className="text-xs sm:text-sm font-black text-[#28071a]">Túi Mù (5 Xu)</h4>
          <p className="text-[11px] text-[#7a5a6b] font-medium mt-0.5">100% trúng hoàn Xu & VIP</p>
        </div>

        {/* Card 4: Game Nối Thẻ */}
        <div
          onClick={() => onOpenMatchGame(allCourses[0])}
          className="p-4 rounded-2xl bg-[#fcf7ec] border border-[#eadfcb] shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-[#f02c85] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-4.5 h-4.5" />
          </div>
          <h4 className="text-xs sm:text-sm font-black text-[#28071a]">Game Nối Thẻ</h4>
          <p className="text-[11px] text-[#7a5a6b] font-medium mt-0.5">Học nhanh qua phản xạ</p>
        </div>

      </section>

      {/* FLASH SALE VOUCHERS STRIP */}
      <VoucherBar />

      {/* =========================================================
          CATEGORY FILTER & SEARCH BAR (Warm Cream Card)
          ========================================================= */}
      <section id="catalog-section" className="bg-[#fcf7ec] rounded-3xl p-3.5 sm:p-4 border border-[#eadfcb] shadow-sm text-[#28071a]">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
          
          {/* Category Tabs: flex-wrap so all 4 categories are 100% visible at a glance without scrolling */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
                  className={`flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl text-xs font-black transition-all duration-150 ${
                    active
                      ? 'bg-[#f02c85] text-white shadow-sm'
                      : 'bg-white text-[#28071a] border border-[#eadfcb] hover:border-[#f02c85]/40 hover:bg-[#faf4e6]'
                  }`}
                >
                  {getCategoryIcon(cat.icon, active)}
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-[#f4ebd7] text-[#7a5a6b]'
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
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm đề thi, bộ thẻ..."
                value={searchHome}
                onChange={(e) => setSearchHome(e.target.value)}
                className="w-full pl-8 pr-7 py-2 text-xs bg-white text-[#28071a] font-bold placeholder:text-slate-400 border border-[#eadfcb] rounded-2xl outline-none focus:border-[#f02c85] shadow-2xs transition-all"
              />
              {searchHome && (
                <button
                  type="button"
                  onClick={() => setSearchHome('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ×
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-7 py-2 text-xs bg-white text-[#28071a] font-black border border-[#eadfcb] rounded-2xl outline-none focus:border-[#f02c85] hover:bg-[#faf4e6] cursor-pointer shadow-2xs transition-colors"
              >
                <option value="popular">🔥 Bán chạy</option>
                <option value="rating">⭐ Đánh giá cao</option>
                <option value="price_asc">🪙 Giá: Thấp → Cao</option>
                <option value="price_desc">💎 Giá: Cao → Thấp</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#7a5a6b] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          COURSES CATALOG (TINH GỌN & DỄ TIẾP CẬN)
          ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Kho Bộ Đề & Flashcard Tiêu Chuẩn ({sortedAndFiltered.length})
            </h3>
            <p className="text-xs text-rose-200/70 mt-0.5">
              Học thử lật thẻ 3D và thi trắc nghiệm tính giờ miễn phí trước khi mở khóa toàn bộ.
            </p>
          </div>
        </div>

        {sortedAndFiltered.length === 0 ? (
          <div className="text-center py-10 bg-[#fcf7ec] rounded-2xl border border-[#eadfcb] p-6 text-[#7a5a6b] text-xs">
            Không tìm thấy tài liệu phù hợp với từ khóa "{searchHome}".
            <button
              onClick={() => {
                setSearchHome('');
                setSelectedCategory('all');
              }}
              className="block mx-auto mt-2 px-4 py-1.5 bg-[#f02c85] text-white text-xs font-bold rounded-lg"
            >
              Xem tất cả
            </button>
          </div>
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
