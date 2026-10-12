import React, { useState } from 'react';
import CourseCard from '../components/CourseCard';
import ComboBanner from '../components/ComboBanner';
import TestimonialsFaq from '../components/TestimonialsFaq';
import VoucherBar from '../components/VoucherBar';
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
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Trophy,
  Gamepad2,
  Flame,
  ChevronDown,
  Globe,
  Tag,
  Gift
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
    <div className="space-y-8 sm:space-y-12 animate-fade-in pb-16">
      
      {/* =========================================================
          WAYGROUND / QUIZIZZ HERO SECTION
          ========================================================= */}
      <section className="space-y-6">
        
        {/* Top 2 Callout Action Cards (Exactly like Wayground screenshot) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          <button
            onClick={() => onSwitchTab('create')}
            className="px-6 sm:px-8 py-3.5 rounded-2xl bg-[#f02c85] hover:bg-[#dc1f74] text-white font-black text-xs sm:text-sm shadow-xl shadow-pink-950/50 transition-transform transform hover:scale-105 active:scale-95 text-center flex items-center space-x-2"
          >
            <span>HỌC VIÊN • TẠO THẺ & ÔN THI MIỄN PHÍ</span>
          </button>

          <button
            onClick={() => onSwitchTab('marketplace')}
            className="px-6 sm:px-8 py-3.5 rounded-2xl bg-[#fcf5e5] hover:bg-[#faebd0] text-[#2c081c] font-black text-xs sm:text-sm shadow-lg border border-amber-300/80 transition-transform transform hover:scale-105 active:scale-95 text-center flex items-center space-x-2"
          >
            <span>CREATOR / GIẢNG VIÊN • ĐĂNG BÁN THẺ LẤY XU</span>
          </button>
        </div>

        {/* GIANT WARM VANILLA IVORY CARD (The iconic Wayground Prompt Container) */}
        <div className="bg-[#fcf7ec] rounded-3xl p-6 sm:p-10 border border-[#eadfcb] shadow-2xl text-[#28071a] relative overflow-hidden">
          
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Heading in Wayground Charcoal Plum */}
            <div className="text-center sm:text-left">
              <span className="text-xs font-black tracking-widest uppercase text-[#f02c85] block mb-1">
                AI FLASHCARD GENERATOR • MÔ HÌNH HỌC TẬP THÔNG MINH
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#28071a] tracking-tight leading-tight">
                Create with prompt or text
              </h2>
              <p className="text-xs sm:text-sm text-[#7a5a6b] mt-1.5 font-medium">
                Nhập bất kỳ điều luật công chức, câu hỏi phỏng vấn IT hoặc từ vựng ngoại ngữ nào để tạo bộ thẻ học ngay.
              </p>
            </div>

            {/* Prompt Input Box (White Card Container inside Ivory Card) */}
            <form onSubmit={handleQuickGenerate} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#eadfcb] shadow-sm space-y-4">
              
              <div className="relative">
                <textarea
                  rows={3}
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="Nhập chủ đề hoặc tài liệu cần học (ví dụ: 50 câu trắc nghiệm Luật Cán bộ công chức 2026, Từ vựng IELTS 7.5, Kiến thức System Design...)"
                  className="w-full text-sm sm:text-base text-[#28071a] placeholder:text-slate-400 font-bold bg-transparent border-0 outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Bottom Row inside the Prompt Box: Category Dropdown & Gradient Action Button */}
              <div className="pt-3 border-t border-[#f4ecd8] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                {/* Subject Selector Dropdown */}
                <div className="flex items-center space-x-2">
                  <div className="relative inline-block">
                    <select
                      value={quickSubject}
                      onChange={(e) => setQuickSubject(e.target.value)}
                      className="appearance-none bg-[#fcf5e5] border border-[#eadfcb] text-[#2c081c] font-black text-xs sm:text-sm rounded-xl px-4 py-2.5 pr-8 outline-none cursor-pointer hover:bg-[#faebd0] transition-colors"
                    >
                      <option value="cong-chuc">🏛️ Công Chức 2026</option>
                      <option value="it-tech">💻 IT & System Design</option>
                      <option value="ngoai-ngu">🌍 IELTS / TOEIC / JLPT</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#2c081c] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <span className="text-[11px] font-bold text-[#7a5a6b] hidden md:inline">
                    Thuật toán Lặp lại ngắt quãng Anki
                  </span>
                </div>

                {/* SUNSET GRADIENT ACTION BUTTON (Wayground "Generate Activity" style) */}
                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-2xl btn-wayground-sunset text-white font-black text-xs sm:text-sm shadow-xl shadow-pink-900/30 flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>✨ Generate Activity (Tạo Bộ Thẻ)</span>
                </button>

              </div>

            </form>

            {/* Standards / Curriculum Badges (Wayground bottom badges) */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#7a5a6b] mr-1">Chuẩn đề thi:</span>
                {[
                  'Nghị định 138/2020/NĐ-CP',
                  'Luật Cán bộ, công chức 2008',
                  'IELTS Band 8.0 Oxford',
                  'Redis Redlock & B-Tree Index'
                ].map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-lg bg-[#f5ecd8] text-[#3d132b] font-bold text-[11px] border border-[#eadfcb]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#f5ecd8] text-[#3d132b] font-bold text-[11px] border border-[#eadfcb]">
                <Globe className="w-3.5 h-3.5 text-[#f02c85]" />
                <span>Vietnamese 🇻🇳</span>
              </div>
            </div>

            {/* Quick Feature Shortcuts */}
            <div className="flex flex-wrap gap-2.5 pt-2 border-t border-[#eadfcb]/80">
              <button
                onClick={() => onSwitchTab('marketplace')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#f02c85] text-white font-black text-xs hover:brightness-110 flex items-center space-x-1.5 shadow-sm transform hover:scale-105 active:scale-95 transition-transform"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>⚡ Flash Sale 24h (-65%)</span>
              </button>

              <button
                onClick={onOpenBlindBox}
                className="px-4 py-2 rounded-xl bg-[#28071a] text-amber-300 font-black text-xs hover:bg-[#3d0c27] flex items-center space-x-1.5 shadow-sm transform hover:scale-105 active:scale-95 transition-transform"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>🎁 Khui Túi Mù (5 Xu)</span>
              </button>

              <button
                onClick={() => onBuyCombo(COMBO_PACKAGE)}
                className="px-4 py-2 rounded-xl bg-white text-[#28071a] font-bold text-xs border border-[#eadfcb] hover:bg-slate-50 flex items-center space-x-1.5 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span>Combo VIP (189K)</span>
              </button>

              <button
                onClick={() => onOpenMatchGame(allCourses[0])}
                className="px-4 py-2 rounded-xl bg-[#f02c85] text-white font-bold text-xs hover:bg-[#dc1f74] flex items-center space-x-1.5 shadow-sm"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Chơi Nối Thẻ</span>
              </button>

              <button
                onClick={onOpenLeaderboard}
                className="px-4 py-2 rounded-xl bg-white text-[#28071a] font-bold text-xs border border-[#eadfcb] hover:bg-slate-50 flex items-center space-x-1.5 shadow-xs"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Bảng Vàng</span>
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          WAYGROUND CERTIFIED TRUST BADGES & PLATFORM HEADLINE SECTION
          (Exact reproduction from wayground.com/?lng=vi screenshot)
          ========================================================= */}
      <section className="bg-[#fcf7ec] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-12 border border-[#eadfcb] shadow-2xl text-[#28071a] space-y-8 sm:space-y-10">
        
        {/* ROW OF 7 CERTIFICATION & TRUST BADGES */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 items-center justify-items-center">
            
            {/* 1. ISTE Seal */}
            <div className="w-full h-20 sm:h-24 rounded-2xl bg-[#f5ecd8] border border-[#e2d5bd] p-2 flex flex-col items-center justify-center text-center shadow-xs hover:scale-105 transition-transform">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-black mb-1">
                ▲
              </div>
              <span className="text-[10px] font-black text-teal-800 tracking-wider">ISTE SEAL</span>
              <span className="text-[8px] text-[#7a5a6b] font-bold">ALIGNED 2025</span>
            </div>

            {/* 2. LEVEL 3 ESSA */}
            <div className="w-full h-20 sm:h-24 rounded-2xl bg-[#f5ecd8] border border-[#e2d5bd] p-2 flex flex-col items-center justify-center text-center shadow-xs hover:scale-105 transition-transform">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black mb-1">
                ★ 3
              </div>
              <span className="text-[10px] font-black text-amber-800 tracking-wider">LEVEL 3 ESSA</span>
              <span className="text-[8px] text-[#7a5a6b] font-bold">STANDARDS</span>
            </div>

            {/* 3. COMMON SENSE */}
            <div className="w-full h-20 sm:h-24 rounded-2xl bg-[#f5ecd8] border border-[#e2d5bd] p-2 flex flex-col items-center justify-center text-center shadow-xs hover:scale-105 transition-transform">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black mb-1">
                ✓
              </div>
              <span className="text-[10px] font-black text-emerald-800 tracking-wider">COMMON SENSE</span>
              <span className="text-[8px] text-[#7a5a6b] font-bold">SELECTION</span>
            </div>

            {/* 4. TECH & LEARNING WINNER */}
            <div className="w-full h-20 sm:h-24 rounded-2xl bg-[#f5ecd8] border border-[#e2d5bd] p-2 flex flex-col items-center justify-center text-center shadow-xs hover:scale-105 transition-transform">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-black mb-1">
                🏆
              </div>
              <span className="text-[10px] font-black text-emerald-900 tracking-wider">TECH & LEARNING</span>
              <span className="text-[8px] text-[#7a5a6b] font-bold">2025 WINNER</span>
            </div>

            {/* 5. EDTECH AWARDS */}
            <div className="w-full h-20 sm:h-24 rounded-2xl bg-[#f5ecd8] border border-[#e2d5bd] p-2 flex flex-col items-center justify-center text-center shadow-xs hover:scale-105 transition-transform">
              <div className="w-8 h-8 rounded-full bg-[#f02c85] text-white flex items-center justify-center text-xs font-black mb-1">
                ◆
              </div>
              <span className="text-[10px] font-black text-[#f02c85] tracking-wider">EDTECH AWARD</span>
              <span className="text-[8px] text-[#7a5a6b] font-bold">LEADERSHIP</span>
            </div>

            {/* 6. AICPA SOC 2 */}
            <div className="w-full h-20 sm:h-24 rounded-2xl bg-[#f5ecd8] border border-[#e2d5bd] p-2 flex flex-col items-center justify-center text-center shadow-xs hover:scale-105 transition-transform">
              <div className="w-8 h-8 rounded-full bg-sky-700 text-white flex items-center justify-center text-xs font-black mb-1">
                🛡️
              </div>
              <span className="text-[10px] font-black text-sky-900 tracking-wider">AICPA SOC 2</span>
              <span className="text-[8px] text-[#7a5a6b] font-bold">TYPE II SECURE</span>
            </div>

            {/* 7. Sensiba ISO 27001 */}
            <div className="w-full h-20 sm:h-24 rounded-2xl bg-[#f5ecd8] border border-[#e2d5bd] p-2 flex flex-col items-center justify-center text-center shadow-xs hover:scale-105 transition-transform">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-black mb-1">
                ⚙️
              </div>
              <span className="text-[10px] font-black text-slate-900 tracking-wider">Sensiba</span>
              <span className="text-[8px] text-[#7a5a6b] font-bold">ISO 27001 COMPLIANT</span>
            </div>

          </div>

          <p className="text-center text-xs sm:text-sm font-bold text-[#44122d]">
            Được các giáo viên & sĩ tử tin dùng <span className="font-black text-[#f02c85]">90% trường đại học & kỳ thi tuyển dụng</span> tại Việt Nam và Hơn 150 quốc gia.
          </p>
        </div>

        {/* MASSIVE WAYGROUND HEADLINE */}
        <div className="text-center max-w-4xl mx-auto space-y-4 pt-4 sm:pt-6 border-t border-[#eadfcb]">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#28071a] tracking-tight leading-snug sm:leading-tight">
            Một nền tảng hỗ trợ cho quá trình giảng dạy & ôn thi toàn diện nhất của bạn.
          </h1>
          <p className="text-xs sm:text-base text-[#6f4b5f] max-w-2xl mx-auto font-medium">
            Hợp nhất AI Flashcard, bộ đề thi trắc nghiệm bấm giờ, sàn mua bán tài liệu C2C và thi đua xếp hạng liên tục.
          </p>
        </div>

        {/* WAYGROUND FEATURE SELECTOR PILL BUTTONS (Interactive Bar) */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          
          {/* Active: Trí tuệ nhân tạo */}
          <button
            onClick={() => onSwitchTab('create')}
            className="px-5 py-2.5 rounded-full bg-[#28071a] text-white font-black text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-transform transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Trí tuệ nhân tạo</span>
          </button>

          {/* Đánh giá / Thi thử */}
          <button
            onClick={() => onOpenQuiz(allCourses[0])}
            className="px-5 py-2.5 rounded-full bg-[#f5ecd8] hover:bg-[#ebdcc2] text-[#28071a] border border-[#eadfcb] font-black text-xs sm:text-sm flex items-center space-x-2 transition-transform transform hover:scale-105"
          >
            <span>📝 Đánh giá</span>
          </button>

          {/* Bài thuyết trình / Slide */}
          <button
            onClick={() => onOpenFlashcards(allCourses[0])}
            className="px-5 py-2.5 rounded-full bg-[#f5ecd8] hover:bg-[#ebdcc2] text-[#28071a] border border-[#eadfcb] font-black text-xs sm:text-sm flex items-center space-x-2 transition-transform transform hover:scale-105"
          >
            <span>📊 Bài thuyết trình</span>
          </button>

          {/* Bài tập về nhà */}
          <button
            onClick={() => onSwitchTab('library')}
            className="px-5 py-2.5 rounded-full bg-[#f5ecd8] hover:bg-[#ebdcc2] text-[#28071a] border border-[#eadfcb] font-black text-xs sm:text-sm flex items-center space-x-2 transition-transform transform hover:scale-105"
          >
            <span>📚 Bài tập về nhà</span>
          </button>

          {/* Thẻ học từ vựng (Flashcard) */}
          <button
            onClick={() => onOpenFlashcards(allCourses[0])}
            className="px-5 py-2.5 rounded-full bg-[#f02c85] text-white font-black text-xs sm:text-sm shadow-md shadow-pink-900/30 flex items-center space-x-2 transition-transform transform hover:scale-105"
          >
            <span>🗂️ Thẻ học từ vựng</span>
          </button>

          {/* Đấu trường Game */}
          <button
            onClick={() => onOpenMatchGame(allCourses[0])}
            className="px-5 py-2.5 rounded-full bg-[#f5ecd8] hover:bg-[#ebdcc2] text-[#28071a] border border-[#eadfcb] font-black text-xs sm:text-sm flex items-center space-x-2 transition-transform transform hover:scale-105"
          >
            <span>🎮 Game Nối Thẻ</span>
          </button>

          {/* Chợ C2C */}
          <button
            onClick={() => onSwitchTab('marketplace')}
            className="px-5 py-2.5 rounded-full bg-[#f5ecd8] hover:bg-[#ebdcc2] text-[#28071a] border border-[#eadfcb] font-black text-xs sm:text-sm flex items-center space-x-2 transition-transform transform hover:scale-105"
          >
            <span>🛒 Chợ Thẻ C2C</span>
          </button>

          {/* Vietnamese Selector */}
          <div className="flex items-center space-x-1 px-4 py-2 rounded-full bg-[#f5ecd8] text-[#28071a] border border-[#eadfcb] font-bold text-xs sm:text-sm cursor-pointer hover:bg-[#ebdcc2]">
            <Globe className="w-3.5 h-3.5 text-[#f02c85]" />
            <span>Vietnamese 🇻🇳</span>
            <ChevronDown className="w-3 h-3 text-[#28071a] ml-1" />
          </div>

        </div>

      </section>

      {/* FLASH SALE VOUCHERS */}
      <VoucherBar />

      {/* =========================================================
          CATEGORY FILTER & SEARCH BAR (Warm Cream Card)
          ========================================================= */}
      <section className="bg-[#fcf7ec] rounded-3xl p-4 sm:p-5 border border-[#eadfcb] shadow-md text-[#28071a]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#f02c85] text-white shadow-md shadow-pink-900/30'
                      : 'bg-white text-[#28071a] border border-[#eadfcb] hover:bg-[#f6ebd5]'
                  }`}
                >
                  {getCategoryIcon(cat.icon, active)}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm đề thi, bộ thẻ..."
              value={searchHome}
              onChange={(e) => setSearchHome(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white text-[#28071a] font-bold placeholder:text-slate-400 border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85]"
            />
          </div>

        </div>
      </section>

      {/* =========================================================
          COURSES CATALOG (Wayground Theme Cards)
          ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Kho Bộ Đề & Flashcard Tiêu Chuẩn ({filtered.length})
            </h3>
            <p className="text-xs text-rose-200/70 mt-0.5">
              Học thử lật thẻ 3D và thi trắc nghiệm tính giờ miễn phí trước khi mở khóa toàn bộ.
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-[#fcf7ec] rounded-3xl border border-[#eadfcb] p-6 text-[#7a5a6b] text-xs">
            Không tìm thấy tài liệu phù hợp với từ khóa "{searchHome}".
            <button
              onClick={() => {
                setSearchHome('');
                setSelectedCategory('all');
              }}
              className="block mx-auto mt-3 px-4 py-1.5 bg-[#f02c85] text-white text-xs font-bold rounded-lg"
            >
              Xem tất cả
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
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
