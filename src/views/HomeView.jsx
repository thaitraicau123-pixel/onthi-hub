import React, { useState, useMemo } from 'react';
import CourseCard from '../components/CourseCard';
import ComboBanner from '../components/ComboBanner';
import TestimonialsFaq from '../components/TestimonialsFaq';
import ExamCountdownBanner from '../components/ExamCountdownBanner';
import GameQuestDock from '../components/GameQuestDock';
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
  onOpenCheatSheet,
  onOpenStudyRoom,
  allCourses,
  onShowToast,
  walletBalance = 100,
  onOpenWallet
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchHome, setSearchHome] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'rating' | 'price_asc' | 'price_desc'
  const [quickPrompt, setQuickPrompt] = useState('60 câu hỏi trọng tâm Luật Cán bộ, công chức 2026 và Nghị định 138');
  const [quickSubject, setQuickSubject] = useState('cong-chuc');

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
          3D CARTOON GAME QUEST DOCK (ARCADE 3D STYLE)
          ========================================================= */}
      <GameQuestDock
        walletBalance={walletBalance}
        onOpenFlashcards={() => allCourses[0] && onOpenFlashcards(allCourses[0])}
        onOpenQuiz={() => allCourses[0] && onOpenQuiz(allCourses[0])}
        onOpenStudyRoom={onOpenStudyRoom}
        onOpenShop={() => onSwitchTab('marketplace')}
        onOpenWallet={onOpenWallet || (() => onSwitchTab('wallet'))}
      />

      {/* =========================================================
          HERO GLASS DASHBOARD CARD: HIGH-CONTRAST + 1-CLICK STUDY
          ========================================================= */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-[#e9e9e8] dark:border-white/15 shadow-3d-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-500/40 text-[#1458a6] dark:text-sky-300 text-[11px] font-bold">
              <span>🚀 ONTHIHUB v3.0 • KHÔNG GIAN ÔN LUYỆN THÔNG MINH 2026</span>
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

        {/* =========================================================
            TRUNG TÂM TĂNG TỐC v3.0 (3 TÍNH NĂNG ĐỘT PHÁ MỚI)
            ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => onOpenStudyRoom && onOpenStudyRoom()}
            className="text-left p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-sky-500/10 dark:from-emerald-950/60 dark:to-slate-900 border border-emerald-300/70 dark:border-emerald-500/40 hover:border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <span>👥 Phòng Tự Học Ảo v3.0</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-white animate-pulse">
                LIVE 24/7
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Vừa bật tiếng mưa/sóng não Alpha + Pomodoro vừa lật thẻ Anki trực tiếp trong phòng cùng sỹ tử.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onOpenCheatSheet && onOpenCheatSheet(allCourses[0]?.id || 'pldc')}
            className="text-left p-3.5 rounded-xl bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-purple-500/10 dark:from-sky-950/60 dark:to-slate-900 border border-sky-300/70 dark:border-sky-500/40 hover:border-sky-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                <span>📄 Phao Cứu Sinh 1 Trang</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-sky-600 text-white">
                IN A4 + CHE ĐÁP ÁN
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Tóm tắt toàn bộ mốc số liệu, thời hạn dễ nhầm • Chế độ làm mờ tự kiểm tra & Xuất PDF in 1 trang.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onOpenTargetClock && onOpenTargetClock()}
            className="text-left p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/60 dark:to-slate-900 border border-amber-300/70 dark:border-amber-500/40 hover:border-amber-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <span>🗺️ Lộ Trình Đích 30 Ngày</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-white">
                MÁY TÍNH CHIA LỊCH
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Tự động chia số thẻ cần học mỗi ngày trước kỳ thi & lưu vết thời gian học theo Giờ Hà Nội.
            </p>
          </button>
        </div>
      </div>

      {/* Countdown đếm ngược ngày thi thực chiến (Đồng bộ Giờ Hà Nội) */}
      <ExamCountdownBanner onOpenTargetModal={onOpenTargetClock} />

      {/* =========================================================
          KHO BỘ ĐỀ & FLASHCARD TIÊU CHUẨN (UNIFIED HEADER + CATALOG)
          ========================================================= */}
      <section id="catalog-section" className="space-y-4">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#e9e9e8] dark:border-white/15 shadow-2xs space-y-3.5">
          {/* Row 1: Title & Verified Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f0efed] dark:border-white/10">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                📚 Kho Bộ Đề & Flashcard Tiêu Chuẩn ({sortedAndFiltered.length} bộ đề)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Bấm <strong className="text-[#2383e2] dark:text-sky-400">&ldquo;Lật Thẻ&rdquo;</strong>, <strong className="text-[#cc782f] dark:text-amber-400">&ldquo;Thi Thử&rdquo;</strong> hoặc <strong className="text-emerald-600 dark:text-emerald-400">&ldquo;Tóm Tắt&rdquo;</strong> trên từng bộ đề để học thử miễn phí trước khi mở khóa.
              </p>
            </div>
            <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-500/40 self-start sm:self-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Đã kiểm duyệt 2026</span>
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
                        ? 'bg-[#2383e2] text-white shadow-2xs font-bold'
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
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 text-[#9b9a97] dark:text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tài liệu..."
                  value={searchHome}
                  onChange={(e) => setSearchHome(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#f7f6f5] dark:bg-slate-800 text-[#37352f] dark:text-white placeholder:text-[#9b9a97] dark:placeholder:text-slate-400 border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#2383e2] dark:focus:border-sky-400 transition-all"
                />
                {searchHome && (
                  <button
                    type="button"
                    onClick={() => setSearchHome('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#787774] dark:text-slate-400 hover:text-[#37352f] dark:hover:text-white text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-2.5 pr-7 py-1.5 text-xs bg-[#f7f6f5] dark:bg-slate-800 text-[#37352f] dark:text-white font-semibold border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:border-[#2383e2] dark:focus:border-sky-400 hover:bg-[#efefed] dark:hover:bg-slate-700 cursor-pointer transition-colors"
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
                onOpenCheatSheet={onOpenCheatSheet}
                onBuy={onBuyCourse}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          TIỆN ÍCH MỞ RỘNG & TẠO THẺ AI NHANH
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: AI Flashcard Generator (7 cols) */}
        <section className="lg:col-span-7 bg-white/95 dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-[#e9e9e8] dark:border-white/15 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base">✨</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#37352f] dark:text-white">
                Studio Tạo Thẻ Tự Động (AI Flashcards)
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f4f0f7] dark:bg-purple-950/70 text-[#9065b0] dark:text-purple-300 border border-[#e3d7ec] dark:border-purple-600/40">
              Anki SM-2
            </span>
          </div>

          <form onSubmit={handleQuickGenerate} className="bg-[#fbfbfa] dark:bg-slate-800/90 rounded-xl p-3.5 border border-[#e9e9e8] dark:border-white/10 space-y-3 flex-1 flex flex-col justify-between">
            <textarea
              rows={2}
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="Nhập chủ đề hoặc tài liệu cần học (ví dụ: 60 câu hỏi Luật Cán bộ công chức 2026, Từ vựng IELTS 7.5, System Design...)"
              className="w-full text-xs sm:text-sm text-[#37352f] dark:text-white placeholder:text-[#9b9a97] dark:placeholder:text-slate-400 font-medium bg-transparent border-0 outline-none resize-none leading-relaxed"
            />

            <div className="pt-2.5 border-t border-[#e9e9e8] dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="relative inline-block">
                <select
                  value={quickSubject}
                  onChange={(e) => setQuickSubject(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-700/80 border border-[#e9e9e8] dark:border-white/15 text-[#37352f] dark:text-white font-semibold text-xs rounded-lg px-3 py-1.5 pr-7 outline-none cursor-pointer hover:bg-[#efefed] dark:hover:bg-slate-700 transition-colors"
                >
                  <option value="cong-chuc">🏛️ Công Chức 2026</option>
                  <option value="it-tech">💻 IT & System Design</option>
                  <option value="ngoai-ngu">🌍 IELTS / TOEIC / JLPT</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#787774] dark:text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tạo Bộ Thẻ Ngay</span>
              </button>
            </div>
          </form>
        </section>

        {/* Right: 4 Quick Action Mini Tiles in a 2x2 grid (5 cols) */}
        <section className="lg:col-span-5 grid grid-cols-2 gap-2.5">
          {/* Card 1: Đề Thi Công Chức 2026 */}
          <div
            onClick={() => {
              setSelectedCategory('cong-chuc');
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/15 shadow-2xs hover:border-[#2383e2] dark:hover:border-sky-400 cursor-pointer transition-all flex flex-col justify-between select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#fbf3db] dark:bg-amber-950/70 text-[#c29243] dark:text-amber-300 border border-[#f4e4b7] dark:border-amber-700/50 flex items-center justify-center mb-2">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white">Đề Công Chức</h4>
              <p className="text-[11px] text-[#787774] dark:text-slate-300 mt-0.5">Nghị định 138/2020</p>
            </div>
          </div>

          {/* Card 2: Chợ Thẻ C2C */}
          <div
            onClick={() => onSwitchTab('marketplace')}
            className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/15 shadow-2xs hover:border-emerald-500 cursor-pointer transition-all flex flex-col justify-between select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#edf3ec] dark:bg-emerald-950/70 text-[#448361] dark:text-emerald-300 border border-[#d3e5d7] dark:border-emerald-700/50 flex items-center justify-center mb-2">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white">Chợ Thẻ C2C</h4>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/40">HOT</span>
              </div>
              <p className="text-[11px] text-[#787774] dark:text-slate-300 mt-0.5">Mua bán & Pass thẻ</p>
            </div>
          </div>

          {/* Card 3: Túi Mù Tri Thức */}
          <div
            onClick={onOpenBlindBox}
            className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/15 shadow-2xs hover:border-purple-500 cursor-pointer transition-all flex flex-col justify-between select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#f4f0f7] dark:bg-purple-950/70 text-[#9065b0] dark:text-purple-300 border border-[#e3d7ec] dark:border-purple-700/50 flex items-center justify-center mb-2">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white">Túi Mù Tri Thức</h4>
              <p className="text-[11px] text-[#787774] dark:text-slate-300 mt-0.5">100% trúng quà & Xu</p>
            </div>
          </div>

          {/* Card 4: Game Nối Thẻ */}
          <div
            onClick={() => onOpenMatchGame(allCourses[0])}
            className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/15 shadow-2xs hover:border-sky-500 cursor-pointer transition-all flex flex-col justify-between select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#e7f3f8] dark:bg-sky-950/70 text-[#2b7aa1] dark:text-sky-300 border border-[#cbe3ed] dark:border-sky-700/50 flex items-center justify-center mb-2">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white">Game Nối Thẻ</h4>
              <p className="text-[11px] text-[#787774] dark:text-slate-300 mt-0.5">Học nhanh qua phản xạ</p>
            </div>
          </div>
        </section>
      </div>

      {/* Combo VIP Banner */}
      <ComboBanner onBuyCombo={onBuyCombo} />

      {/* Testimonials & FAQs */}
      <TestimonialsFaq />

    </div>
  );
}
