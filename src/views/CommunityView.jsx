import React, { useState, useEffect } from 'react';
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
  Tag
} from 'lucide-react';
import { playSound } from '../utils/storage';
import { recordStudyAction, completeDailyQuest } from '../utils/gamification';
import {
  getCommunityPosts,
  addCommunityPost,
  toggleLikeCommunityPost,
  addCommentToCommunityPost,
  subscribeToCommunityPosts
} from '../data/communityData';
import confetti from 'canvas-confetti';

export default function CommunityView({ user }) {
  const [posts, setPosts] = useState(() => getCommunityPosts());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('cong-chuc');
  const [likedPosts, setLikedPosts] = useState([1]);
  const [commentInputs, setCommentInputs] = useState({});
  const [copiedPostId, setCopiedPostId] = useState(null);

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
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* COMMUNITY HEADER (Wayground Sunset Gradient) */}
      <div className="bg-gradient-to-r from-[#ff5f38] via-[#f02c85] to-[#7d1a52] text-white p-6 sm:p-8 rounded-3xl shadow-2xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-pink-100 text-xs font-black mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>MẠNG XÃ HỘI HỌC VIÊN ÔN THI</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black">Diễn Đàn Thảo Luận & Chia Sẻ Kinh Nghiệm</h2>
          <p className="text-xs sm:text-sm text-pink-100 mt-1 font-medium">
            Giao lưu, hỏi đáp đề thi khó, xin tài liệu và chia sẻ bí quyết đỗ tuyển dụng.
          </p>
        </div>
      </div>

      {/* SEARCH & FILTER TABS (Wayground Warm Cream Bar) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fcf7ec] p-3 rounded-3xl border border-[#eadfcb] shadow-md">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi, đề thi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white text-[#28071a] font-bold rounded-2xl border border-[#eadfcb] focus:border-[#f02c85] outline-none shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none text-xs font-black">
          {[
            { id: 'all', label: 'Tất Cả' },
            { id: 'cong-chuc', label: '🏛️ Công Chức' },
            { id: 'it', label: '💻 IT Tech' },
            { id: 'ngoai-ngu', label: '🌍 Ngoại Ngữ' },
            { id: 'meo-thi', label: '💡 Mẹo Ôn' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#f02c85] text-white shadow-md shadow-pink-900/40'
                  : 'bg-white text-[#28071a] border border-[#eadfcb] hover:bg-[#faebd0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* CREATE POST INPUT BOX (Wayground Warm Cream Container) */}
      <form onSubmit={handleAddPost} className="bg-[#fcf7ec] rounded-3xl p-5 border border-[#eadfcb] shadow-md space-y-3 text-[#28071a]">
        <div className="flex items-center space-x-3">
          <img
            src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border border-[#eadfcb]"
          />
          <input
            type="text"
            placeholder="Bạn đang ôn kỳ thi nào? Đặt câu hỏi hoặc chia sẻ tài liệu..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white text-[#28071a] font-bold border border-[#eadfcb] rounded-2xl outline-none focus:border-[#f02c85]"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          {/* Post category selection */}
          <div className="flex items-center space-x-1.5 text-xs">
            <Tag className="w-3.5 h-3.5 text-[#f02c85]" />
            <select
              value={newPostCategory}
              onChange={(e) => setNewPostCategory(e.target.value)}
              className="text-xs bg-white border border-[#eadfcb] rounded-xl px-2.5 py-1 text-[#28071a] font-bold outline-none cursor-pointer"
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
            className="px-5 py-2 btn-wayground-sunset disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Đăng Bài Lên Diễn Đàn (+25 XP)</span>
          </button>
        </div>
      </form>

      {/* POSTS FEED */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-[#fcf7ec] rounded-3xl border border-[#eadfcb] p-6 text-[#7a5a6b] text-xs font-bold">
            Chưa có bài viết nào trong chủ đề này. Hãy là người đầu tiên đặt câu hỏi!
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isLiked = likedPosts.includes(post.id);
            return (
              <div
                key={post.id}
                className="bg-[#fcf7ec] rounded-3xl p-5 sm:p-6 border border-[#eadfcb] shadow-md space-y-3.5 text-[#28071a]"
              >
                {/* Post Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover border border-[#eadfcb]"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="text-sm font-black text-[#28071a]">{post.author}</h4>
                        {post.isPinned && (
                          <span className="flex items-center space-x-0.5 text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full border border-amber-200">
                            <Pin className="w-3 h-3 text-amber-600" />
                            <span>Ghim</span>
                          </span>
                        )}
                        {post.categoryLabel && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-100 text-[#f02c85] border border-pink-200">
                            {post.categoryLabel}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#f02c85] font-bold block">{post.role}</span>
                      <span className="text-[10px] text-[#7a5a6b] font-medium block">{post.time}</span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-xs sm:text-sm text-[#3b1227] leading-relaxed whitespace-pre-line font-medium">
                  {post.content}
                </p>

                {/* Likes & Comments Count Bar */}
                <div className="pt-2 border-t border-[#eadfcb] flex items-center justify-between text-xs text-[#7a5a6b] font-bold">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1 font-black transition-colors ${
                        isLiked ? 'text-[#f02c85]' : 'text-[#7a5a6b] hover:text-[#f02c85]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#f02c85] text-[#f02c85]' : ''}`} />
                      <span>{post.likes} Yêu thích</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4 text-[#7a5a6b]" />
                      <span>{post.comments.length} Bình luận</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSharePost(post)}
                    className="hover:text-[#28071a] flex items-center space-x-1.5 text-[#7a5a6b] text-xs font-bold transition-all"
                  >
                    {copiedPostId === post.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-black">Đã sao chép link!</span>
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
                  <div className="pt-2 space-y-2 border-t border-[#eadfcb]">
                    {post.comments.map((cm, cIdx) => (
                      <div key={cIdx} className="p-2.5 bg-white rounded-2xl text-xs space-y-0.5 border border-[#eadfcb]">
                        <strong className="text-[#28071a] block font-black">{cm.author}</strong>
                        <p className="text-[#4e2f41] font-medium">{cm.text}</p>
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
                    className="flex-1 px-3 py-1.5 text-xs bg-white text-[#28071a] font-bold border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85]"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-3.5 py-1.5 bg-[#f02c85] hover:bg-[#dc1f74] text-white rounded-xl text-xs font-black transition-colors"
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
