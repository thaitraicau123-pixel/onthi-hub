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
  RotateCw
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
    <div className="space-y-6 animate-fade-in pb-16 text-[#37352f]">
      
      {/* =========================================================
          NOTION PAGE HEADER: EMOJI + TITLE + SUBTITLE + CALLOUT
          ========================================================= */}
      <div className="space-y-3 pb-2 border-b border-[#e9e9e8]">
        <div className="text-4xl select-none">🏠</div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37352f] tracking-tight">
            Kho Đề Thi & Bộ Thẻ Chuẩn Hóa
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#787774] leading-relaxed">
            Hệ thống tài liệu ôn thi trắc nghiệm công chức 2026, IT và ngoại ngữ ứng dụng thuật toán lặp lại ngắt quãng (Spaced Repetition).
          </p>
        </div>

        {/* Notion Callout Box */}
        <div className="bg-[#f1f1ef] border border-[#e9e9e8] rounded-lg p-3 text-xs text-[#37352f] flex items-start space-x-2.5">
          <span className="text-base leading-none">💡</span>
          <div className="leading-relaxed">
            <strong>Mẹo ôn thi hiệu quả:</strong> Bạn có thể bấm <span className="font-semibold text-[#2383e2]">"Xem Thẻ"</span> hoặc <span className="font-semibold text-[#cc782f]">"Thi Thử"</span> trên từng bộ tài liệu để kiểm tra kiến thức trước khi mở khóa trọn bộ.
          </div>
        </div>
      </div>

      {/* =========================================================
          NOTION AI GENERATOR WIDGET (TINH GIẢN & TẬP TRUNG)
          ========================================================= */}
      <section className="bg-[#fbfbfa] rounded-xl p-4 sm:p-5 border border-[#e9e9e8] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-base">✨</span>
            <span className="text-xs font-bold text-[#37352f] uppercase tracking-wider">
              Studio Tạo Thẻ Tự Động (AI Flashcards)
            </span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f4f0f7] text-[#9065b0] border border-[#e3d7ec]">
            Anki SM-2
          </span>
        </div>

        {/* AI Prompt Input Box */}
        <form onSubmit={handleQuickGenerate} className="bg-white rounded-lg p-3 sm:p-4 border border-[#e9e9e8] shadow-2xs space-y-3">
          <textarea
            rows={2}
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            placeholder="Nhập chủ đề hoặc tài liệu cần học (ví dụ: 60 câu hỏi Luật Cán bộ công chức 2026, Từ vựng IELTS 7.5, System Design...)"
            className="w-full text-xs sm:text-sm text-[#37352f] placeholder:text-[#9b9a97] font-medium bg-transparent border-0 outline-none resize-none leading-relaxed"
          />

          <div className="pt-2.5 border-t border-[#f1f1ef] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Subject Dropdown */}
            <div className="relative inline-block">
              <select
                value={quickSubject}
                onChange={(e) => setQuickSubject(e.target.value)}
                className="appearance-none bg-[#f7f6f5] border border-[#e9e9e8] text-[#37352f] font-semibold text-xs rounded-md px-3 py-1.5 pr-7 outline-none cursor-pointer hover:bg-[#efefed] transition-colors"
              >
                <option value="cong-chuc">🏛️ Công Chức 2026</option>
                <option value="it-tech">💻 IT & System Design</option>
                <option value="ngoai-ngu">🌍 IELTS / TOEIC / JLPT</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#787774] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-[#2e2e2e] hover:bg-[#1a1a1a] text-white font-semibold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tạo Bộ Thẻ Ngay</span>
            </button>
          </div>
        </form>
      </section>

      {/* Countdown đếm ngược ngày thi thực chiến */}
      <ExamCountdownBanner />

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
          className="p-3.5 rounded-xl bg-white border border-[#e9e9e8] shadow-3d-sm hover:shadow-3d-md card-3d touch-3d cursor-pointer transition-all group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#fbf3db] text-[#c29243] border border-[#f4e4b7] flex items-center justify-center mb-2">
            <Landmark className="w-4 h-4" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-[#37352f]">Đề Thi Công Chức</h4>
          <p className="text-[11px] text-[#787774] mt-0.5">Chuẩn Nghị định 138/2020</p>
        </div>

        {/* Card 2: Chợ Thẻ C2C */}
        <div
          onClick={() => onSwitchTab('marketplace')}
          className="p-3.5 rounded-xl bg-white border border-[#e9e9e8] shadow-3d-sm hover:shadow-3d-md card-3d touch-3d cursor-pointer transition-all group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#edf3ec] text-[#448361] border border-[#d3e5d7] flex items-center justify-center mb-2">
            <Store className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-[#37352f]">Chợ Thẻ C2C</h4>
            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded notion-pill-orange">HOT</span>
          </div>
          <p className="text-[11px] text-[#787774] mt-0.5">Mua bán & Pass lại thẻ</p>
        </div>

        {/* Card 3: Túi Mù Tri Thức */}
        <div
          onClick={onOpenBlindBox}
          className="p-3.5 rounded-xl bg-white border border-[#e9e9e8] shadow-3d-sm hover:shadow-3d-md card-3d touch-3d cursor-pointer transition-all group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f4f0f7] text-[#9065b0] border border-[#e3d7ec] flex items-center justify-center mb-2">
            <Gift className="w-4 h-4" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-[#37352f]">Túi Mù Tri Thức</h4>
          <p className="text-[11px] text-[#787774] mt-0.5">100% trúng hoàn Xu & VIP</p>
        </div>

        {/* Card 4: Game Nối Thẻ */}
        <div
          onClick={() => onOpenMatchGame(allCourses[0])}
          className="p-3.5 rounded-xl bg-white border border-[#e9e9e8] shadow-3d-sm hover:shadow-3d-md card-3d touch-3d cursor-pointer transition-all group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#e7f3f8] text-[#2b7aa1] border border-[#cbe3ed] flex items-center justify-center mb-2">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-[#37352f]">Game Nối Thẻ</h4>
          <p className="text-[11px] text-[#787774] mt-0.5">Học nhanh qua phản xạ</p>
        </div>

      </section>

      {/* FLASH SALE VOUCHERS STRIP */}
      <VoucherBar />

      {/* =========================================================
          CATEGORY FILTER & SEARCH CONTROLS (NOTION DATABASE TABS)
          ========================================================= */}
      <section id="catalog-section" className="bg-[#fbfbfa] rounded-xl p-3 sm:p-4 border border-[#e9e9e8] shadow-2xs text-[#37352f]">
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
                      ? 'bg-white text-[#37352f] shadow-2xs border border-[#e9e9e8] font-bold'
                      : 'text-[#787774] hover:text-[#37352f] hover:bg-white/60'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-medium ${
                    active
                      ? 'bg-[#f1f1ef] text-[#37352f]'
                      : 'bg-[#f1f1ef] text-[#9b9a97]'
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
              <Search className="w-3.5 h-3.5 text-[#9b9a97] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                value={searchHome}
                onChange={(e) => setSearchHome(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white text-[#37352f] placeholder:text-[#9b9a97] border border-[#e9e9e8] rounded-md outline-none focus:border-[#2383e2] shadow-2xs transition-all"
              />
              {searchHome && (
                <button
                  type="button"
                  onClick={() => setSearchHome('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#787774] hover:text-[#37352f] text-xs font-bold"
                >
                  ×
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-2.5 pr-7 py-1.5 text-xs bg-white text-[#37352f] font-semibold border border-[#e9e9e8] rounded-md outline-none focus:border-[#2383e2] hover:bg-[#efefed] cursor-pointer shadow-2xs transition-colors"
              >
                <option value="popular">🔥 Bán chạy</option>
                <option value="rating">⭐ Đánh giá cao</option>
                <option value="price_asc">🪙 Giá: Thấp → Cao</option>
                <option value="price_desc">💎 Giá: Cao → Thấp</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#787774] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
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
            <h3 className="text-lg sm:text-xl font-black text-[#37352f] tracking-tight">
              Kho Bộ Đề & Flashcard Tiêu Chuẩn ({sortedAndFiltered.length})
            </h3>
            <p className="text-xs text-[#787774] mt-0.5">
              Học thử lật thẻ 3D và thi trắc nghiệm tính giờ miễn phí trước khi mở khóa toàn bộ.
            </p>
          </div>
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
