import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Heart,
  Share2,
  Send,
  Sparkles,
  Users,
  Flame,
  CheckCircle2,
  Pin,
  Search,
  Tag,
  RotateCw,
  Trash2,
  Lock,
  Crown,
  ArrowRight
} from 'lucide-react';
import { playSound } from '../utils/storage';
import { recordStudyAction } from '../utils/gamification';
import { isUserAdmin } from '../utils/adminGuard';
import { getUserTier, canUserParticipateInCommunity } from '../utils/userTier';
import { formatHanoiDateTime, formatHanoiRelativeTime } from '../utils/hanoiTime';
import {
  getCommunityPosts,
  addCommunityPost,
  toggleLikeCommunityPost,
  addCommentToCommunityPost,
  subscribeToCommunityPosts,
  deleteCommunityPost,
  togglePinCommunityPost,
  deleteCommunityComment,
  getLocalLikedPostIds,
  saveLocalLikedPostIds,
  getOrCreateCommunityClientId
} from '../data/communityData';
import { ActionableEmptyState } from '../components/UIStateFeedback';
import confetti from 'canvas-confetti';

export default function CommunityView({ user, onOpenPricing }) {
  const isAdmin = isUserAdmin(user);
  const currentTier = (user?.tier || getUserTier() || 'free').toLowerCase();
  const canParticipate = canUserParticipateInCommunity(user);
  const isFreeUser = !canParticipate;
  const userIdentifier = user?.email || user?.uid || getOrCreateCommunityClientId();

  const [posts, setPosts] = useState(() => getCommunityPosts());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('cong-chuc');
  const [likedPosts, setLikedPosts] = useState(() => {
    const localLiked = getLocalLikedPostIds();
    const currentPosts = getCommunityPosts();
    const fromPosts = currentPosts
      .filter(p => Array.isArray(p.likedBy) && p.likedBy.includes(userIdentifier))
      .map(p => String(p.id));
    return Array.from(new Set([...localLiked, ...fromPosts]));
  });
  const [commentInputs, setCommentInputs] = useState({});
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [, setTimeTick] = useState(0);
  const postInputRef = useRef(null);

  // Dynamic real-time relative time ticker (updates every 30 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTick(t => t + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Real-time synchronization (Firebase Firestore + Cloud Relay)
  useEffect(() => {
    const unsubscribe = subscribeToCommunityPosts((updatedPosts) => {
      setPosts(updatedPosts);
      // Synchronize liked state in real-time from server post likedBy
      setLikedPosts(prevLiked => {
        const fromPosts = updatedPosts
          .filter(p => Array.isArray(p.likedBy) && p.likedBy.includes(userIdentifier))
          .map(p => String(p.id));
        const combined = Array.from(new Set([...prevLiked, ...fromPosts]));
        saveLocalLikedPostIds(combined);
        return combined;
      });
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [userIdentifier]);

  const handleSharePost = (post) => {
    playSound('success');
    navigator.clipboard.writeText(`${window.location.origin}/#post-${post.id}`);
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const handleDeletePost = async (postId, author) => {
    if (window.confirm(`[Admin] Bạn có chắc muốn XÓA VĨNH VIỄN bài viết của "${author || 'người dùng'}" không?\nBài viết sẽ bị xóa và đồng bộ trên tất cả thiết bị.`)) {
      playSound('flip');
      const updated = await deleteCommunityPost(postId);
      setPosts(updated);
    }
  };

  const handleTogglePin = async (postId) => {
    playSound('flip');
    const updated = await togglePinCommunityPost(postId);
    setPosts(updated);
  };

  const handleDeleteComment = async (postId, commentIndex) => {
    if (window.confirm(`[Admin] Bạn có chắc muốn xóa bình luận này không?`)) {
      playSound('flip');
      const updated = await deleteCommunityComment(postId, commentIndex);
      setPosts(updated);
    }
  };

  const handleLike = (postId) => {
    playSound('flip');
    const strId = String(postId);
    const isLiked = likedPosts.includes(strId);
    const updatedLiked = isLiked ? likedPosts.filter(id => id !== strId) : [...likedPosts, strId];
    setLikedPosts(updatedLiked);
    saveLocalLikedPostIds(updatedLiked);

    const updated = toggleLikeCommunityPost(strId, !isLiked, userIdentifier);
    setPosts(updated);
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (isFreeUser) {
      playSound('flip');
      alert('🔒 Diễn đàn cộng đồng chỉ dành cho thành viên có gói Plus, Pro hoặc Ultra để bảo vệ cộng đồng khỏi tin nhắn rác & spam. Vui lòng nâng cấp gói để tham gia đăng bài!');
      if (onOpenPricing) onOpenPricing();
      return;
    }
    if (!newPostText.trim()) return;

    const catMap = {
      'cong-chuc': '🏛️ Công Chức',
      'it': '💻 IT & Tech',
      'ngoai-ngu': '🌍 Ngoại Ngữ',
      'meo-thi': '💡 Mẹo Ôn Thi'
    };

    const tierLabels = {
      plus: 'Học Viên PLUS ⭐',
      pro: 'Chuyên Gia PRO 🚀',
      ultra: 'Creator ULTRA 👑'
    };

    const nowIso = new Date().toISOString();
    const newPost = {
      id: 'post_' + Date.now(),
      author: user?.displayName || 'Bạn Học OnThiHub',
      avatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: isAdmin ? 'Quản Trị Viên (Admin) 🛡️' : (tierLabels[currentTier] || 'Học Viên VIP ⭐'),
      category: newPostCategory,
      categoryLabel: catMap[newPostCategory] || 'Hỏi Đáp',
      isPinned: false,
      time: 'Vừa xong',
      createdAt: nowIso,
      content: newPostText.trim(),
      likes: 1,
      likedBy: [userIdentifier],
      comments: []
    };

    addCommunityPost(newPost);
    setLikedPosts(prev => {
      const next = Array.from(new Set([...prev, String(newPost.id)]));
      saveLocalLikedPostIds(next);
      return next;
    });
    setNewPostText('');
    playSound('success');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.4 } });
    recordStudyAction(25);
  };

  const handleAddComment = (postId) => {
    if (isFreeUser) {
      playSound('flip');
      alert('🔒 Bạn cần nâng cấp lên gói Plus, Pro hoặc Ultra để tham gia bình luận trên diễn đàn!');
      if (onOpenPricing) onOpenPricing();
      return;
    }
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const tierBadges = {
      plus: ' (PLUS ⭐)',
      pro: ' (PRO 🚀)',
      ultra: ' (ULTRA 👑)'
    };
    const authorBadge = isAdmin ? ' (Admin 🛡️)' : (tierBadges[currentTier] || '');

    const newComment = {
      author: (user?.displayName || 'Bạn Học') + authorBadge,
      text,
      createdAt: new Date().toISOString()
    };

    const updated = addCommentToCommunityPost(postId, newComment);
    setPosts(updated);
    setCommentInputs({ ...commentInputs, [postId]: '' });
    playSound('flip');
    recordStudyAction(15);
  };

  const filteredPosts = posts.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const term = searchQuery.toLowerCase().trim();
    const matchSearch = !term || p.content.toLowerCase().includes(term) || p.author.toLowerCase().includes(term);
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16 text-[#37352f] dark:text-[#f8fafc]">
      
      {/* NOTION PAGE HEADER */}
      <div className="space-y-2 pb-3 border-b border-[#e9e9e8] dark:border-white/10">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ĐỒNG BỘ THỜI GIAN THỰC • CỘNG ĐỒNG SĨ TỬ 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37352f] dark:text-white tracking-tight flex items-center gap-2.5">
          <span>💬</span>
          <span>Diễn Đàn Thảo Luận & Chia Sẻ Kinh Nghiệm</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#787774] dark:text-slate-300 font-normal">
          Giao lưu, hỏi đáp câu hỏi khó, xin tài liệu và chia sẻ bí quyết đỗ kỳ thi tuyển dụng theo thời gian thực.
        </p>
      </div>

      {/* NOTION CALLOUT TIP */}
      <div className="bg-sky-50/90 dark:bg-slate-900/90 border border-sky-200/80 dark:border-white/10 rounded-xl p-3.5 flex items-start gap-3 shadow-2xs">
        <span className="text-lg leading-none">💡</span>
        <div className="text-xs text-[#37352f] dark:text-slate-200 leading-relaxed">
          <strong>Mẹo cộng đồng:</strong> Tích cực đặt câu hỏi và giải đáp thắc mắc sẽ được tặng <strong className="text-emerald-700 dark:text-emerald-400">+25 XP</strong> kinh nghiệm và tăng uy tín học viên trong bảng xếp hạng.
        </div>
      </div>

      {/* SEARCH & FILTER TABS (Notion Control Bar) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/90 p-2.5 rounded-xl border border-[#e9e9e8] dark:border-white/10 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#9b9a97] dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi, đề thi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700/80 focus:bg-white dark:focus:bg-slate-800 text-[#37352f] dark:text-white rounded-lg border border-[#e9e9e8] dark:border-white/15 focus:border-[#2383e2] dark:focus:border-sky-400 outline-none transition-all placeholder:text-[#9b9a97] dark:placeholder:text-slate-400"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'Tất Cả', icon: '📋' },
            { id: 'cong-chuc', label: 'Công Chức', icon: '🏛️' },
            { id: 'it', label: 'IT & Tech', icon: '💻' },
            { id: 'ngoai-ngu', label: 'Ngoại Ngữ', icon: '🌍' },
            { id: 'meo-thi', label: 'Mẹo Ôn Thi', icon: '💡' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 flex items-center space-x-1 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#2383e2] text-white shadow-2xs'
                  : 'bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 text-[#5a5955] dark:text-slate-300 border border-[#e9e9e8] dark:border-white/10'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CREATE POST INPUT BOX (OR VIP RESTRICTION FOR FREE TIER) */}
      {isFreeUser ? (
        <div className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-700/60">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="text-sm font-bold text-[#37352f] dark:text-amber-100">
                  Diễn đàn chỉ mở cho thành viên gói Plus, Pro & Ultra
                </h3>
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-600/50 text-[10px] font-bold">
                  Tài khoản Free (Chỉ đọc)
                </span>
              </div>
              <p className="text-xs text-[#5a5955] dark:text-slate-300 leading-relaxed">
                Để bảo vệ cộng đồng học tập văn minh, chia sẻ kinh nghiệm chất lượng cao và ngăn chặn tin rác / spam, tính năng <strong>đăng bài thảo luận</strong> và <strong>bình luận</strong> được giới hạn riêng cho học viên có gói hội viên. Bạn vẫn có thể đọc toàn bộ bài viết và mẹo thi trên diễn đàn!
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between flex-wrap gap-2">
            <div className="text-[11px] text-[#787774] dark:text-slate-300 flex items-center space-x-1.5">
              <span>💡 Gói Plus chỉ từ <strong>29.000đ / 29 Xu</strong> mở khóa full quyền đăng bài, hỏi đáp & tạo thẻ AI.</span>
            </div>
            <button
              type="button"
              onClick={onOpenPricing}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Nâng Cấp Gói Để Thảo Luận</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleAddPost} className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-[#e9e9e8] dark:border-white/10 shadow-2xs space-y-3">
          <div className="flex items-center space-x-3">
            <img
              src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border border-[#e9e9e8] dark:border-white/15 shrink-0"
            />
            <input
              ref={postInputRef}
              type="text"
              placeholder="Bạn đang ôn kỳ thi nào? Đặt câu hỏi hoặc chia sẻ tài liệu..."
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700/80 focus:bg-white dark:focus:bg-slate-800 text-[#37352f] dark:text-white border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:border-[#2383e2] dark:focus:border-sky-400 transition-colors placeholder:text-[#9b9a97] dark:placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {/* Post category selection */}
            <div className="flex items-center space-x-2 text-xs">
              <Tag className="w-3.5 h-3.5 text-[#787774] dark:text-slate-400" />
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value)}
                className="text-xs bg-[#f7f6f5] dark:bg-slate-800 border border-[#e9e9e8] dark:border-white/15 rounded-md px-2.5 py-1 text-[#37352f] dark:text-white font-semibold outline-none cursor-pointer hover:bg-[#f0efed] dark:hover:bg-slate-700"
              >
                <option value="cong-chuc">🏛️ Công Chức</option>
                <option value="it">💻 IT & Tech</option>
                <option value="ngoai-ngu">🌍 Ngoại Ngữ</option>
                <option value="meo-thi">💡 Mẹo Ôn Thi</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!newPostText.trim()}
              className="px-3.5 py-1.5 bg-[#2383e2] hover:bg-[#1a73e8] disabled:opacity-40 text-white rounded-md text-xs font-bold shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Đăng bài (+25 XP)</span>
            </button>
          </div>
        </form>
      )}

      {/* POSTS FEED */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <ActionableEmptyState
            icon={MessageSquare}
            badge="DIỄN ĐÀN THẢO LUẬN"
            title={searchQuery ? `Không tìm thấy bài viết nào khớp với "${searchQuery}"` : 'Chưa có bài viết nào trong chủ đề này'}
            description="Hãy là người đầu tiên đặt câu hỏi ôn thi hoặc chia sẻ tài liệu hữu ích cho cộng đồng bạn học!"
            primaryAction={{
              label: isFreeUser ? 'Nâng Cấp Gói Để Thảo Luận' : 'Viết Bài / Đặt Câu Hỏi Ngay',
              onClick: () => {
                if (isFreeUser) {
                  if (onOpenPricing) onOpenPricing();
                  return;
                }
                if (postInputRef.current) {
                  postInputRef.current.focus();
                  postInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              },
              icon: isFreeUser ? Crown : Sparkles
            }}
            secondaryAction={(activeCategory !== 'all' || searchQuery) ? {
              label: 'Xem Tất Cả Bài Viết',
              onClick: () => {
                setActiveCategory('all');
                setSearchQuery('');
              },
              icon: RotateCw
            } : null}
          />
        ) : (
          filteredPosts.map((post) => {
            const isLiked = likedPosts.includes(String(post.id)) || (Array.isArray(post.likedBy) && post.likedBy.includes(userIdentifier));
            return (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-900/90 rounded-xl p-4 sm:p-5 border border-[#e9e9e8] dark:border-white/10 hover:border-[#c5c4c0] dark:hover:border-white/20 shadow-2xs space-y-3 transition-colors"
              >
                {/* Post Author & Admin Controls */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-8 h-8 rounded-full object-cover border border-[#e9e9e8] dark:border-white/15 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white truncate">{post.author}</h4>
                        {post.isPinned && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 text-[10px] font-bold flex items-center space-x-0.5">
                            <Pin className="w-2.5 h-2.5" />
                            <span>Ghim</span>
                          </span>
                        )}
                        {post.categoryLabel && (
                          <span className="px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/40 text-[10px] font-semibold">
                            {post.categoryLabel}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-[#787774] dark:text-slate-400">
                        <span>{post.role}</span>
                        <span>•</span>
                        <span title={formatHanoiDateTime(post.createdAt || post.time)}>
                          {formatHanoiRelativeTime(post.createdAt || post.time)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ADMIN DIRECT MODERATION TOOLBAR */}
                  {isAdmin && (
                    <div className="flex items-center space-x-1.5 shrink-0 bg-[#f7f6f5] dark:bg-slate-800 p-1 rounded-lg border border-[#e9e9e8] dark:border-white/10">
                      <button
                        onClick={() => handleTogglePin(post.id)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                          post.isPinned
                            ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 hover:bg-amber-200'
                            : 'bg-white dark:bg-slate-700 text-[#5a5955] dark:text-slate-200 hover:bg-[#e9e9e8] dark:hover:bg-slate-600'
                        }`}
                        title={post.isPinned ? 'Bỏ ghim bài viết (Admin)' : 'Ghim bài lên đầu diễn đàn (Admin)'}
                      >
                        <Pin className="w-3 h-3" />
                        <span className="hidden sm:inline">{post.isPinned ? 'Bỏ ghim' : 'Ghim'}</span>
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id, post.author)}
                        className="px-2 py-1 bg-white dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:text-rose-700 border border-rose-200/60 dark:border-rose-500/30 rounded text-[11px] font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                        title="Xóa vĩnh viễn bài viết này khỏi hệ thống (Admin)"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Xóa</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <p className="text-xs sm:text-sm text-[#37352f] dark:text-slate-100 leading-relaxed whitespace-pre-line font-normal">
                  {post.content}
                </p>

                {/* Likes & Comments Count Bar */}
                <div className="pt-2 border-t border-[#f0efed] dark:border-white/10 flex items-center justify-between text-xs text-[#787774] dark:text-slate-400">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer font-semibold ${
                        isLiked
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200/70 dark:border-rose-500/30'
                          : 'hover:bg-[#f7f6f5] dark:hover:bg-slate-800 hover:text-[#37352f] dark:hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{post.likes} Yêu thích</span>
                    </button>

                    <div className="flex items-center space-x-1.5 px-2 py-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments.length} Bình luận</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSharePost(post)}
                    className="hover:bg-[#f7f6f5] dark:hover:bg-slate-800 hover:text-[#37352f] dark:hover:text-white px-2.5 py-1 rounded-md flex items-center space-x-1 text-xs transition-colors cursor-pointer"
                  >
                    {copiedPostId === post.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Đã sao chép link!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Chia sẻ</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Comments Section */}
                {post.comments.length > 0 && (
                  <div className="pt-2 space-y-2 border-t border-[#f0efed] dark:border-white/10">
                    {post.comments.map((cm, cIdx) => (
                      <div key={cIdx} className="p-2.5 bg-[#fbfbfa] dark:bg-slate-800/70 rounded-lg text-xs space-y-0.5 border border-[#e9e9e8] dark:border-white/10 group">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-2 min-w-0">
                            <strong className="text-[#37352f] dark:text-white block font-semibold truncate">{cm.author}</strong>
                            {cm.createdAt && (
                              <span className="text-[10px] text-[#9b9a97] dark:text-slate-400 shrink-0" title={formatHanoiDateTime(cm.createdAt)}>
                                • {formatHanoiRelativeTime(cm.createdAt)}
                              </span>
                            )}
                          </div>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteComment(post.id, cIdx)}
                              className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                              title="Xóa bình luận spam này (Admin)"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <p className="text-[#5a5955] dark:text-slate-200 font-normal">{cm.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input or VIP Notice */}
                {isFreeUser ? (
                  <div className="pt-2 flex items-center justify-between p-2.5 bg-[#fbfbfa] dark:bg-slate-800/50 border border-[#e9e9e8] dark:border-white/10 rounded-lg text-xs text-[#787774] dark:text-slate-300">
                    <div className="flex items-center space-x-2 min-w-0">
                      <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="truncate">Chỉ học viên gói <strong>Plus, Pro, Ultra</strong> mới có thể gửi bình luận.</span>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenPricing}
                      className="text-xs font-bold text-[#2383e2] dark:text-sky-400 hover:underline cursor-pointer flex items-center space-x-0.5 shrink-0 ml-2"
                    >
                      <span>Nâng cấp</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="pt-1 flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Viết câu trả lời hoặc thảo luận..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      className="flex-1 px-3 py-1.5 text-xs bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700/80 focus:bg-white dark:focus:bg-slate-800 text-[#37352f] dark:text-white border border-[#e9e9e8] dark:border-white/15 rounded-md outline-none focus:border-[#2383e2] dark:focus:border-sky-400 transition-colors placeholder:text-[#9b9a97] dark:placeholder:text-slate-400"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-3.5 py-1.5 bg-[#2383e2] hover:bg-[#1a73e8] text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Gửi
                    </button>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
