import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Search,
  Copy,
  Check,
  Terminal,
  Sparkles,
  Layers,
  Shield,
  Palette,
  Video,
  Scissors,
  Globe,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { SKILLS_CATEGORIES, ALL_SKILLS } from '../data/skillsData';
import { playClick, playSuccess, playHoverTick } from '../utils/soundEngine';

export default function SkillsArmoryView({ onShowToast }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSkillName, setCopiedSkillName] = useState(null);

  // Filter skills
  const filteredSkills = useMemo(() => {
    let list = ALL_SKILLS || [];
    if (selectedCategory !== 'all') {
      const cat = SKILLS_CATEGORIES.find(c => c.id === selectedCategory);
      if (cat) {
        list = cat.skills || [];
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const handleCopyInstall = (skillName) => {
    playSuccess();
    const cmd = `npx skills add ${skillName} -g -y`;
    navigator.clipboard?.writeText(cmd);
    setCopiedSkillName(skillName);
    onShowToast?.(`Đã copy lệnh cài: ${cmd}`);
    setTimeout(() => setCopiedSkillName(null), 2200);
  };

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'system-agency':
        return <Cpu className="w-4 h-4" />;
      case 'design-taste':
        return <Palette className="w-4 h-4" />;
      case 'fullstack-appsec':
        return <Shield className="w-4 h-4" />;
      case 'video-motion':
        return <Video className="w-4 h-4" />;
      case 'ponytail-yagni':
        return <Scissors className="w-4 h-4" />;
      case 'vercel-cloud':
        return <Globe className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 animate-studio-rise pb-20">
      
      {/* ─── HERO HEADER ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-black p-6 sm:p-10 border border-white/10 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/30">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>KHO VŨ KHÍ 238+ AI SKILLS & SUBAGENTS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Kho Kỹ Năng AI Agent <br/>
            <span className="text-amber-400 font-display italic font-normal">Cài Đặt 1-Chạm Toàn Năng</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            Tuyển tập 238+ kỹ năng đặc nhiệm cho Antigravity, Claude Code & AI Agents. Từ thiết kế giao diện Haute Couture 60fps, diệt bug tận gốc, kiểm thử bảo mật AppSec đến nén video RTX 4050 NVENC.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-stone-400">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{ALL_SKILLS?.length || 238} Skills sẵn sàng</span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-stone-300">
              Cú pháp: <code className="text-amber-300">npx skills add &lt;tên-skill&gt; -g -y</code>
            </span>
          </div>
        </div>
      </div>

      {/* ─── SEARCH & FILTER CONTROLS ─── */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm kỹ năng theo tên (vd: haute-couture, ponytail, appsec, nvenc, vercel, figma...)..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              playClick();
              setSelectedCategory('all');
            }}
            onMouseEnter={playHoverTick}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tất cả ({ALL_SKILLS?.length || 238})</span>
          </button>

          {SKILLS_CATEGORIES?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playClick();
                setSelectedCategory(cat.id);
              }}
              onMouseEnter={playHoverTick}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.category}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
                {cat.skills?.length || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── SKILLS GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const isCopied = copiedSkillName === skill.name;
          return (
            <div
              key={skill.name}
              onMouseEnter={playHoverTick}
              className="group relative rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 p-5 shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-stone-900 dark:text-white group-hover:text-amber-500 transition-colors font-mono">
                        {skill.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
                  {skill.desc}
                </p>
              </div>

              {/* Install Action */}
              <div className="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-stone-400 truncate max-w-[170px]">
                  npx skills add {skill.name}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyInstall(skill.name)}
                  onMouseEnter={playHoverTick}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                    isCopied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-amber-500 hover:text-black'
                  }`}
                  title="Copy lệnh cài đặt 1-chạm"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã copy</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy lệnh</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-16 space-y-3 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 p-8">
          <Terminal className="w-10 h-10 text-stone-400 mx-auto" />
          <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">Không tìm thấy kỹ năng phù hợp</p>
          <p className="text-xs text-stone-500">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc danh mục.</p>
        </div>
      )}

    </div>
  );
}
