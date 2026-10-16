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
  Shield
} from 'lucide-react';
import { playSound } from '../utils/storage';
import { recordStudyAction, completeDailyQuest } from '../utils/gamification';
import { isUserAdmin } from '../utils/adminGuard';
import {
  getCommunityPosts,
  addCommunityPost,
  toggleLikeCommunityPost,
  addCommentToCommunityPost,
  subscribeToCommunityPosts,
  deleteCommunityPost,
  togglePinCommunityPost,
  deleteCommunityComment
} from '../data/communityData';
import { ActionableEmptyState } from '../components/UIStateFeedback';
import confetti from 'canvas-confetti';

export default function CommunityView({ user }) {
  const isAdmin = isUserAdmin(user);
  const [posts, setPosts] = useState(() => getCommunityPosts());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('cong-chuc');
  const [likedPosts, setLikedPosts] = useState([1]);
  const [commentInputs, setCommentInputs] = useState({});
  const [copiedPostId, setCopiedPostId] = useState(null);
  const postInputRef = useRef(null);

  // Real-time synchronization (Firebase Firestore + Cloud Relay)
  useEffect(() => {
    const unsubscribe = subscribeToCommunityPosts((updatedPosts) => {
      setPosts(updatedPosts);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

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
    const isLiked = likedPosts.includes(postId);
    const updatedLiked = isLiked ? likedPosts.filter(id => id !== postId) : [...likedPosts, postId];
    setLikedPosts(updatedLiked);

    const updated = toggleLikeCommunityPost(postId, !isLiked);
    setPosts(updated);
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const catMap = {
      'cong-chuc': '🏛️ Công Chức',
      'it': '💻 IT & Tech',
      'ngoai-ngu': '🌍 Ngoại Ngữ',
      'meo-thi': '💡 Mẹo Ôn Thi'
    };

    const newPost = {
      id: 'post_' + Date.now(),
      author: user?.displayName || 'Người Học Ẩn Danh',
      avatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: user?.tier ? `Học Viên ${user.tier.toUpperCase()}` : 'Thành Viên Cộng Đồng',
      category: newPostCategory,
      categoryLabel: catMap[newPostCategory] || 'Hỏi Đáp',
      isPinned: false,
      time: 'Vừa xong',
      createdAt: new Date().toISOString(),
      content: newPostText.trim(),
      likes: 1,
      comments: []
    };

    addCommunityPost(newPost);
    setNewPostText('');
    playSound('success');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.4 } });
    recordStudyAction(25);
  };

  const handleAddComment = (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const newComment = {
      author: user?.displayName || 'Bạn Học',
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* NOTION PAGE HEADER */}
      <div className="space-y-2 pb-2 border-b border-[#e9e9e8]">
        <div className="text-4xl select-none">💬</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#37352f] tracking-tight">
          Diễn Đàn Thảo Luận & Chia Sẻ Kinh Nghiệm
        </h1>
        <p className="text-sm text-[#787774] font-normal">
          Giao lưu, hỏi đáp câu hỏi khó, xin tài liệu và chia sẻ bí quyết đỗ kỳ thi tuyển dụng.
        </p>
      </div>

      {/* NOTION CALLOUT TIP */}
      <div className="notion-callout flex items-start gap-3">
        <span className="text-lg">💡</span>
        <div className="text-xs text-[#37352f] leading-relaxed">
          <strong>Mẹo cộng đồng:</strong> Tích cực đặt câu hỏi và giải đáp thắc mắc sẽ được tặng <strong>+25 XP</strong> kinh nghiệm và tăng uy tín học viên trong bảng xếp hạng.
        </div>
      </div>

      {/* SEARCH & FILTER TABS (Notion Control Bar) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-[#e9e9e8]">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#9b9a97] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi, đề thi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f7f6f5] hover:bg-[#f0efed] focus:bg-white text-[#37352f] rounded-lg border border-[#e9e9e8] focus:border-[#2383e2] outline-none transition-all placeholder:text-[#9b9a97]"
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
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 flex items-center space-x-1 ${
                activeCategory === cat.id
                  ? 'bg-[#37352f] text-white shadow-2xs'
                  : 'bg-[#f7f6f5] hover:bg-[#f0efed] text-[#5a5955] border border-[#e9e9e8]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CREATE POST INPUT BOX (Notion Block Card) */}
      <form onSubmit={handleAddPost} className="bg-white rounded-xl p-4 border border-[#e9e9e8] shadow-2xs space-y-3">
        <div className="flex items-center space-x-3">
          <img
            src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border border-[#e9e9e8]"
          />
          <input
            ref={postInputRef}
            type="text"
            placeholder="Bạn đang ôn kỳ thi nào? Đặt câu hỏi hoặc chia sẻ tài liệu..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#f7f6f5] hover:bg-[#f0efed] focus:bg-white text-[#37352f] border border-[#e9e9e8] rounded-lg outline-none focus:border-[#2383e2] transition-colors placeholder:text-[#9b9a97]"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          {/* Post category selection */}
          <div className="flex items-center space-x-2 text-xs">
            <Tag className="w-3.5 h-3.5 text-[#787774]" />
            <select
              value={newPostCategory}
              onChange={(e) => setNewPostCategory(e.target.value)}
              className="text-xs bg-[#f7f6f5] border border-[#e9e9e8] rounded-md px-2 py-1 text-[#37352f] font-medium outline-none cursor-pointer hover:bg-[#f0efed]"
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
            className="px-3.5 py-1.5 bg-[#2383e2] hover:bg-[#1a73e8] disabled:opacity-40 text-white rounded-md text-xs font-medium shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Đăng bài (+25 XP)</span>
          </button>
        </div>
      </form>

      {/* POSTS FEED */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <ActionableEmptyState
            icon={MessageSquare}
            badge="DIỄN ĐÀN THẢO LUẬN"
            title={searchQuery ? `Không tìm thấy bài viết nào khớp với "${searchQuery}"` : 'Chưa có bài viết nào trong chủ đề này'}
            description="Hãy là người đầu tiên đặt câu hỏi ôn thi hoặc chia sẻ tài liệu hữu ích cho cộng đồng bạn học!"
            primaryAction={{
              label: 'Viết Bài / Đặt Câu Hỏi Ngay',
              onClick: () => {
                if (postInputRef.current) {
                  postInputRef.current.focus();
                  postInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              },
              icon: Sparkles
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
            const isLiked = likedPosts.includes(post.id);
            return (
              <div
                key={post.id}
                className="bg-white rounded-xl p-4 sm:p-5 border border-[#e9e9e8] hover:border-[#c5c4c0] shadow-2xs space-y-3 transition-colors"
              >
                {/* Post Author & Admin Controls */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-8 h-8 rounded-full object-cover border border-[#e9e9e8] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#37352f] truncate">{post.author}</h4>
                        {post.isPinned && (
                          <span className="notion-tag notion-tag-yellow text-[10px] flex items-center space-x-0.5">
                            <Pin className="w-2.5 h-2.5" />
                            <span>Ghim</span>
                          </span>
                        )}
                        {post.categoryLabel && (
                          <span className="notion-tag notion-tag-blue text-[10px]">
                            {post.categoryLabel}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-[#787774]">
                        <span>{post.role}</span>
                        <span>•</span>
                        <span>{post.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* ADMIN DIRECT MODERATION TOOLBAR */}
                  {isAdmin && (
                    <div className="flex items-center space-x-1.5 shrink-0 bg-[#f7f6f5] p-1 rounded-lg border border-[#e9e9e8]">
                      <button
                        onClick={() => handleTogglePin(post.id)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                          post.isPinned
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-white text-[#5a5955] hover:bg-[#e9e9e8]'
                        }`}
                        title={post.isPinned ? 'Bỏ ghim bài viết (Admin)' : 'Ghim bài lên đầu diễn đàn (Admin)'}
                      >
                        <Pin className="w-3 h-3" />
                        <span className="hidden sm:inline">{post.isPinned ? 'Bỏ ghim' : 'Ghim'}</span>
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id, post.author)}
                        className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-rose-200/60 rounded text-[11px] font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                        title="Xóa vĩnh viễn bài viết này khỏi hệ thống (Admin)"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Xóa</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <p className="text-xs sm:text-sm text-[#37352f] leading-relaxed whitespace-pre-line font-normal">
                  {post.content}
                </p>

                {/* Likes & Comments Count Bar */}
                <div className="pt-2 border-t border-[#f0efed] flex items-center justify-between text-xs text-[#787774]">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1.5 px-2 py-1 rounded-md transition-colors ${
                        isLiked ? 'text-rose-600 bg-rose-50' : 'hover:bg-[#f7f6f5] hover:text-[#37352f]'
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
                    className="hover:bg-[#f7f6f5] hover:text-[#37352f] px-2 py-1 rounded-md flex items-center space-x-1 text-xs transition-colors"
                  >
                    {copiedPostId === post.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-medium">Đã sao chép link!</span>
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
                  <div className="pt-2 space-y-2 border-t border-[#f0efed]">
                    {post.comments.map((cm, cIdx) => (
                      <div key={cIdx} className="p-2.5 bg-[#fbfbfa] rounded-lg text-xs space-y-0.5 border border-[#e9e9e8] group">
                        <div className="flex items-center justify-between">
                          <strong className="text-[#37352f] block font-medium">{cm.author}</strong>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteComment(post.id, cIdx)}
                              className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors opacity-70 group-hover:opacity-100"
                              title="Xóa bình luận spam này (Admin)"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <p className="text-[#5a5955] font-normal">{cm.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                <div className="pt-1 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Viết câu trả lời hoặc thảo luận..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    className="flex-1 px-3 py-1.5 text-xs bg-[#f7f6f5] hover:bg-[#f0efed] focus:bg-white text-[#37352f] border border-[#e9e9e8] rounded-md outline-none focus:border-[#2383e2] transition-colors placeholder:text-[#9b9a97]"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-3 py-1.5 bg-[#37352f] hover:bg-[#201f1d] text-white rounded-md text-xs font-medium transition-colors"
                  >
                    Gửi
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
