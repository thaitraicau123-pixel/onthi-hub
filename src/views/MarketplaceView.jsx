import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Check,
  Coins,
  TrendingUp,
  Sparkles,
  Users,
  Heart,
  ArrowUpDown,
  Zap,
  Clock,
  Gift,
  Repeat,
  Flame,
  BadgePercent,
  RefreshCw,
  Trash2,
  MessageCircle,
  Share2
} from 'lucide-react';
import {
  getMarketplaceDecks,
  purchaseMarketplaceDeck,
  subscribeToMarketplaceDecks,
  fetchCloudRelayMarketplaceDecks,
  mergeAndSaveMarketplaceDecks,
  deleteMarketplaceDeck
} from '../data/marketplaceData';
import { isUserAdmin } from '../utils/adminGuard';
import { isCoursePurchased } from '../utils/storage';
import { playSound } from '../utils/storage';
import { getLikedDeckIds, toggleLikeDeck } from '../utils/gamification';
import { getDailyDeals } from '../utils/dailyDeals';
import { copyFlashcardShareLink } from '../utils/shareLink';
import { CardGridSkeleton } from '../components/UIStateFeedback';
import confetti from 'canvas-confetti';

export default function MarketplaceView({
  user,
  marketplaceDecks,
  onOpenCreateDeck,
  onOpenFlashcardSample,
  onBalanceUpdated,
  onOpenWallet,
  onOpenBlindBox,
  onOpenDirectChat,
  onShowToast
}) {
  const [decks, setDecks] = useState(() => getMarketplaceDecks().filter(d => d.isApproved !== false));
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // default to 'newest' so newly passed/created decks appear ON TOP!
  const [likedIds, setLikedIds] = useState(() => getLikedDeckIds());

  const canDeleteDeck = (deck) => {
    if (isUserAdmin(user)) return true;
    if (user?.displayName && (deck.authorName === user.displayName || deck.passSellerName === user.displayName)) return true;
    if (user?.email && (deck.authorEmail === user.email || deck.passSellerEmail === user.email)) return true;
    return false;
  };

  const handleDeleteDeck = (e, deck) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc muốn XÓA VĨNH VIỄN bộ thẻ "${deck.title}" khỏi Chợ Thẻ không?\nThao tác này sẽ gỡ bỏ thẻ trên toàn bộ hệ thống.`)) {
      deleteMarketplaceDeck(deck.id);
      playSound('flip');
      setDecks((prev) => prev.filter((d) => d.id !== deck.id));
    }
  };

  const [isSyncing, setIsSyncing] = useState(false);

  // Real-time synchronization across all devices (Firebase Firestore + Cloud Relay v3)
  useEffect(() => {
    const unsubscribe = subscribeToMarketplaceDecks((updatedDecks) => {
      setDecks(updatedDecks.filter(d => d.isApproved !== false));
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Update when prop changes
  useEffect(() => {
    if (Array.isArray(marketplaceDecks) && marketplaceDecks.length > 0) {
      setDecks(marketplaceDecks.filter(d => d.isApproved !== false));
    }
  }, [marketplaceDecks]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    playSound('flip');
    try {
      const cloudDecks = await fetchCloudRelayMarketplaceDecks();
      if (cloudDecks.length > 0) {
        const merged = mergeAndSaveMarketplaceDecks(cloudDecks);
        setDecks(merged.filter(d => d.isApproved !== false));
        playSound('success');
      } else {
        setDecks(getMarketplaceDecks().filter(d => d.isApproved !== false));
      }
    } catch (e) {
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Daily Flash Deals & Countdown
  const [dailyData, setDailyData] = useState(() => getDailyDeals());
  const [secondsRemaining, setSecondsRemaining] = useState(() => getDailyDeals().secondsLeft);

  useEffect(() => {
    const updateCountdown = () => {
      const fresh = getDailyDeals();
      setSecondsRemaining(fresh.secondsLeft);
      if (fresh.secondsLeft <= 1) {
        setDailyData(fresh);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        updateCountdown();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', updateCountdown);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', updateCountdown);
    };
  }, []);

  const formatCountdown = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const reloadDecks = () => {
    setDecks(getMarketplaceDecks().filter(d => d.isApproved !== false));
  };

  const handleToggleLike = (deckId) => {
    const isNowLiked = toggleLikeDeck(deckId);
    setLikedIds(getLikedDeckIds());
    playSound('flip');
  };

  const passDecks = decks.filter(d => d.isPassDeck === true);

  const filtered = decks
    .filter((d) => {
      let matchCat = true;
      if (activeCategory === 'pass') {
        matchCat = d.isPassDeck === true;
      } else if (activeCategory !== 'all') {
        matchCat = d.category === activeCategory;
      }

      const term = searchQuery.toLowerCase().trim();
      const matchSearch =
        !term ||
        d.title.toLowerCase().includes(term) ||
        (d.description && d.description.toLowerCase().includes(term)) ||
        (d.authorName && d.authorName.toLowerCase().includes(term)) ||
        (d.passSellerName && d.passSellerName.toLowerCase().includes(term));
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        const idA = String(a.id || '');
        const idB = String(b.id || '');
        return idB.localeCompare(idA);
      }
      if (sortBy === 'price_asc') return a.priceXu - b.priceXu;
      if (sortBy === 'price_desc') return b.priceXu - a.priceXu;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return (b.salesCount || 0) - (a.salesCount || 0);
    });

  const handleBuy = (deck) => {
    const res = purchaseMarketplaceDeck(deck);
    if (res.success) {
      playSound('success');
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
      alert(res.message);
      onBalanceUpdated();
      reloadDecks();
    } else {
      if (confirm(`${res.message}\n\nBạn có muốn mở Ví để nạp thêm Xu ngay không?`)) {
        onOpenWallet();
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 text-[#37352f] dark:text-[#f8fafc]">
      
      {/* 1. NOTION PAGE HEADER */}
      <div className="space-y-2 pb-3 border-b border-[#e9e9e8] dark:border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37352f] dark:text-white tracking-tight flex items-center gap-2.5">
              <span>🏪</span>
              <span>Chợ Thẻ & Sàn Flashcard C2C</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#787774] dark:text-slate-300 leading-relaxed max-w-xl">
              Sàn thương mại điện tử trao đổi, mua bán và pass lại bộ thẻ flashcard giữa học viên. Hỗ trợ rút tiền thật về VietQR và mở túi mù nhận quà.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenBlindBox}
              className="px-3 py-1.5 bg-[#fbf3db] dark:bg-amber-950/80 hover:bg-[#f6ebd0] dark:hover:bg-amber-900 text-[#976d57] dark:text-amber-300 border border-[#f4e4b7] dark:border-amber-500/40 rounded-lg text-xs font-bold shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-[#cc782f] dark:text-amber-400" />
              <span>🎁 Khui Túi Mù (5 Xu)</span>
            </button>

            <button
              type="button"
              onClick={onOpenCreateDeck}
              className="px-3.5 py-1.5 bg-[#2383e2] hover:bg-[#1a73e8] text-white rounded-lg text-xs font-bold shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Đăng Bán Bộ Thẻ</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DAILY FLASH DEALS SECTION (Notion Callout) */}
      <section className="bg-white/95 dark:bg-slate-900/90 border border-[#e9e9e8] dark:border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xs text-[#37352f] dark:text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4 border-b border-[#e9e9e8] dark:border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#faece3] dark:bg-amber-950/70 border border-[#f3d6c1] dark:border-amber-500/40 text-[#cc782f] dark:text-amber-400 flex items-center justify-center shadow-2xs shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-[#37352f] dark:text-white uppercase tracking-wider">
                  Ưu Đãi Theo Ngày (Flash Deals 24h)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#faece3] dark:bg-amber-950/80 text-[#cc782f] dark:text-amber-300 border border-[#f3d6c1] dark:border-amber-500/40">
                  {dailyData.dateStr}
                </span>
              </div>
              <p className="text-[11px] text-[#787774] dark:text-slate-300">
                Giá ưu đãi xoay tua mỗi 24 giờ. Tự động làm mới vào nửa đêm!
              </p>
            </div>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center space-x-1.5 bg-[#f7f6f5] dark:bg-slate-800 px-3 py-1 rounded-lg border border-[#e9e9e8] dark:border-white/15 text-xs text-[#787774] dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-[#cc782f] dark:text-amber-400" />
            <span>Kết thúc trong:</span>
            <span className="font-mono font-bold text-[#37352f] dark:text-white">
              {formatCountdown(secondsRemaining)}
            </span>
          </div>
        </div>

        {/* Daily Deal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {dailyData.deals.map((deal) => {
            const isOwned = isCoursePurchased(deal.id);
            return (
              <div
                key={deal.id}
                className="bg-[#fbfbfa] dark:bg-slate-800/80 border border-[#e9e9e8] dark:border-white/10 hover:border-[#c5c4c0] dark:hover:border-white/25 rounded-xl p-4 transition-all flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 text-[10px] font-bold">
                      {deal.badge}
                    </span>
                    <span className="text-xs text-[#787774] dark:text-slate-300 font-medium">
                      {deal.categoryLabel}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#37352f] dark:text-white leading-snug">
                    {deal.title}
                  </h4>
                  <p className="text-xs text-[#787774] dark:text-slate-300 mt-1 line-clamp-2">
                    {deal.subtitle}
                  </p>

                  {/* Stock progress meter */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-[#787774] dark:text-slate-300 mb-1">
                      <span>Đã bán {deal.soldPercent}%</span>
                      <span className="text-[#2383e2] dark:text-sky-400 font-semibold">Chỉ còn {deal.stockRemaining} suất cuối</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#e9e9e8] dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2383e2] dark:bg-sky-400 rounded-full transition-all"
                        style={{ width: `${deal.soldPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing & Buy Action */}
                <div className="mt-4 pt-3 border-t border-[#e9e9e8] dark:border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-base font-extrabold text-[#37352f] dark:text-white">
                        {deal.priceXu} Xu
                      </span>
                      <span className="text-xs text-[#9b9a97] dark:text-slate-400 line-through">
                        {deal.originalPriceXu} Xu
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-semibold">
                      Tiết kiệm {deal.originalPriceXu - deal.priceXu} Xu ({deal.discountPercent}% OFF)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {deal.previewCards && deal.previewCards.length > 0 && (
                      <button
                        onClick={() => onOpenFlashcardSample(deal)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#e9e9e8] dark:border-white/15 bg-white dark:bg-slate-700 hover:bg-[#f0efed] dark:hover:bg-slate-600 text-[#37352f] dark:text-white text-xs font-semibold cursor-pointer"
                      >
                        Xem Thử
                      </button>
                    )}

                    {isOwned ? (
                      <span className="px-3 py-1.5 bg-[#edf3ec] dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-[#d3e5d2] dark:border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã Sở Hữu</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuy(deal)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-bold shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Mua ({deal.priceXu} Xu)</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* C2C PASS DECKS SHOWCASE SECTION */}
      {passDecks.length > 0 && (
        <section className="bg-white/95 dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-[#e9e9e8] dark:border-white/15 shadow-2xs text-[#37352f] dark:text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0efed] dark:border-white/10 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f4f0f7] dark:bg-purple-950/70 border border-[#e3d7ec] dark:border-purple-500/40 flex items-center justify-center">
                <Repeat className="w-4 h-4 text-[#9065b0] dark:text-purple-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-[#37352f] dark:text-white uppercase tracking-wide">
                    🔁 Sàn Pass Lại Thẻ Học Viên ({passDecks.length})
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/40 text-[10px] font-bold">
                    LIVE C2C
                  </span>
                </div>
                <p className="text-xs text-[#787774] dark:text-slate-300">
                  Bộ thẻ do học viên thi đỗ pass lại với giá ưu đãi. 100% bản quyền từ tác giả.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveCategory('pass');
                const el = document.getElementById('marketplace-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="self-start sm:self-auto px-3 py-1 rounded-lg bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 border border-[#e9e9e8] dark:border-white/15 text-xs font-semibold text-[#37352f] dark:text-white transition-colors cursor-pointer"
            >
              Xem tất cả ({passDecks.length}) thẻ pass →
            </button>
          </div>

          {/* Quick Mini Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {passDecks.slice(0, 3).map((pDeck) => {
              const isOwned = isCoursePurchased(pDeck.id);
              return (
                <div
                  key={pDeck.id}
                  className="bg-[#fbfbfa] dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-[#e9e9e8] dark:border-white/10 hover:border-[#c5c4c0] dark:hover:border-white/25 rounded-xl p-3.5 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 truncate">
                        <img
                          src={pDeck.passSellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={pDeck.passSellerName}
                          className="w-5 h-5 rounded-full object-cover border border-[#e9e9e8] dark:border-white/15 shrink-0"
                        />
                        <span className="text-[11px] text-[#787774] dark:text-slate-300 truncate">
                          Pass bởi: <strong className="text-[#37352f] dark:text-white">{pDeck.passSellerName}</strong>
                        </span>
                      </div>
                      {canDeleteDeck(pDeck) && (
                        <button
                          onClick={(e) => handleDeleteDeck(e, pDeck)}
                          className="p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-500 transition-colors ml-2 shrink-0 cursor-pointer"
                          title="Xóa bộ thẻ pass này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-[#37352f] dark:text-white line-clamp-1">
                      {pDeck.title}
                    </h4>
                    {pDeck.passNote && (
                      <p className="text-[11px] text-[#787774] dark:text-slate-300 italic line-clamp-1 mt-0.5">
                        &ldquo;{pDeck.passNote}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#f0efed] dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#37352f] dark:text-white">
                      {pDeck.priceXu} Xu <span className="text-[10px] text-[#9b9a97] dark:text-slate-400 line-through font-normal">({pDeck.originalPriceXu || 25} Xu)</span>
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const res = await copyFlashcardShareLink({
                            deckId: pDeck.id,
                            deckTitle: pDeck.title,
                            useNativeShare: true
                          });
                          if (res.success) {
                            playSound('success');
                            onShowToast?.(res.message);
                          }
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-[#2383e2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Chia sẻ đường dẫn bộ thẻ này"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {onOpenDirectChat && pDeck.passSellerName && (
                        <button
                          type="button"
                          onClick={() => {
                            onOpenDirectChat({
                              id: pDeck.passSellerEmail || pDeck.passSellerName,
                              name: pDeck.passSellerName,
                              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(pDeck.passSellerName)}`
                            }, pDeck);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors cursor-pointer"
                          title={`Hỏi người bán (${pDeck.passSellerName})`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onOpenFlashcardSample(pDeck)}
                        className="px-2 py-1 rounded-md bg-white dark:bg-slate-700 hover:bg-[#f0efed] dark:hover:bg-slate-600 border border-[#e9e9e8] dark:border-white/10 text-[10px] font-semibold text-[#37352f] dark:text-white cursor-pointer"
                      >
                        Học Thử
                      </button>
                      {isOwned ? (
                        <span className="px-2 py-1 rounded-md bg-[#edf3ec] dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold">
                          Đã Mua
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBuy(pDeck)}
                          className="px-2.5 py-1 rounded-md bg-[#2383e2] hover:bg-[#1a73e8] text-[10px] font-bold text-white shadow-2xs cursor-pointer"
                        >
                          Mua ({pDeck.priceXu} Xu)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. FILTER & SEARCH (Notion Control Bar) */}
      <section id="marketplace-catalog" className="bg-white/95 dark:bg-slate-900/90 rounded-2xl p-3.5 sm:p-4 border border-[#e9e9e8] dark:border-white/15 shadow-2xs text-[#37352f] dark:text-white space-y-3">
        {/* Tier 1: Category Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', name: '📋 Tất cả chợ' },
            { id: 'pass', name: `🔁 Góc Pass Lại (${passDecks.length})` },
            { id: 'ngoai-ngu', name: '🌍 Ngoại ngữ & SAT' },
            { id: 'it-tech', name: '💻 IT & Lập Trình' },
            { id: 'cong-chuc', name: '🏛️ Công Chức & Ngành Y' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-semibold ${
                activeCategory === tab.id
                  ? 'bg-[#2383e2] text-white shadow-2xs font-bold'
                  : 'bg-[#f7f6f5] dark:bg-slate-800 text-[#5a5955] dark:text-slate-300 border border-[#e9e9e8] dark:border-white/10 hover:bg-[#f0efed] dark:hover:bg-slate-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tier 2: Search Input, Sorting & Refresh Actions */}
        <div className="pt-2.5 border-t border-[#f0efed] dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#9b9a97] dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm bộ thẻ hoặc người pass..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-[#37352f] dark:text-white border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:border-[#2383e2] dark:focus:border-sky-400 transition-colors placeholder:text-[#9b9a97] dark:placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9b9a97] dark:text-slate-400 hover:text-[#37352f] dark:hover:text-white text-xs w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Controls: Sorting Dropdown & Realtime Refresh Button */}
          <div className="flex items-center space-x-2 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 text-[#37352f] dark:text-white font-semibold rounded-lg border border-[#e9e9e8] dark:border-white/15 outline-none cursor-pointer transition-colors"
            >
              <option value="newest">✨ Mới nhất (Vừa lên sàn)</option>
              <option value="sales">🔥 Bán chạy nhất</option>
              <option value="rating">⭐ Đánh giá cao</option>
              <option value="price_asc">📈 Giá Xu tăng dần</option>
              <option value="price_desc">📉 Giá Xu giảm dần</option>
            </select>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              title="Đồng bộ danh sách bộ thẻ từ đám mây thời gian thực"
              className={`px-3 py-1.5 rounded-lg border border-[#e9e9e8] dark:border-white/15 bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 text-[#37352f] dark:text-white transition-colors flex items-center space-x-1.5 shrink-0 text-xs font-semibold cursor-pointer ${
                isSyncing ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#2383e2] dark:text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm Mới</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT GRID (Spacious 3-Column Layout) */}
      <section>
        {isSyncing ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs text-[#787774] dark:text-slate-300 animate-pulse px-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2383e2] dark:text-sky-400" />
              <span>Đang đồng bộ dữ liệu thời gian thực từ máy chủ đám mây...</span>
            </div>
            <CardGridSkeleton count={3} cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900/90 rounded-2xl border border-[#e9e9e8] dark:border-white/15 p-8 text-[#37352f] dark:text-white shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#f7f6f5] dark:bg-slate-800 border border-[#e9e9e8] dark:border-white/15 flex items-center justify-center mx-auto text-[#787774] dark:text-slate-300">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#37352f] dark:text-white">
                {searchQuery ? `Không tìm thấy bộ thẻ nào khớp với "${searchQuery}"` : 'Chưa có bộ thẻ nào trong danh mục này'}
              </h4>
              <p className="text-xs text-[#787774] dark:text-slate-300 mt-1 max-w-md mx-auto">
                {searchQuery
                  ? 'Hãy thử kiểm tra lại từ khóa hoặc xóa bộ lọc để xem toàn bộ danh mục.'
                  : 'Hãy là người tiên phong đăng bán hoặc pass lại bộ thẻ đầu tiên để nhận Xu từ cộng đồng!'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {(activeCategory !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 border border-[#e9e9e8] dark:border-white/15 text-xs font-semibold text-[#37352f] dark:text-white transition-colors cursor-pointer"
                >
                  ✨ Xem tất cả ({decks.length})
                </button>
              )}

              <button
                type="button"
                onClick={onOpenCreateDeck}
                className="px-3.5 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-xs font-bold text-white transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tạo Bộ Thẻ Mới</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#787774] dark:text-slate-300 px-1">
              <span>Đang hiển thị <strong className="text-[#37352f] dark:text-white">{filtered.length}</strong> bộ thẻ ôn tập</span>
              {(activeCategory !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-[#2383e2] dark:text-sky-400 hover:underline font-semibold text-xs cursor-pointer"
                >
                  Xóa bộ lọc ✕
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((deck) => {
              const isOwned = isCoursePurchased(deck.id);
              const isLiked = likedIds.includes(deck.id);
              return (
                <div
                  key={deck.id}
                  className={`bg-white/95 dark:bg-slate-900/90 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group shadow-2xs hover:shadow-xs hover:border-[#c5c4c0] dark:hover:border-white/25 ${
                    deck.isPassDeck
                      ? 'border-[#e0d6eb] dark:border-purple-500/40'
                      : 'border-[#e9e9e8] dark:border-white/15'
                  }`}
                >
                  <div className="p-4 sm:p-5">
                    
                    {/* Pass badge or Category */}
                    {deck.isPassDeck && (
                      <div className="mb-2">
                        <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/40 text-[10px] font-bold inline-flex items-center space-x-1">
                          <Repeat className="w-2.5 h-2.5" />
                          <span>HỌC VIÊN PASS LẠI</span>
                        </span>
                      </div>
                    )}

                    {/* Creator / Reseller Info */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center space-x-2 min-w-0">
                        <img
                          src={deck.isPassDeck ? (deck.passSellerAvatar || deck.authorAvatar) : (deck.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80')}
                          alt={deck.authorName}
                          className="w-6 h-6 rounded-full object-cover border border-[#e9e9e8] dark:border-white/15 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-[#37352f] dark:text-white truncate block">
                            {deck.isPassDeck ? deck.passSellerName : deck.authorName}
                          </span>
                          <span className="text-[10px] text-[#787774] dark:text-slate-400 block">
                            {deck.isPassDeck ? `Bản quyền: ${deck.authorName}` : (deck.categoryName || 'Cộng đồng')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-0.5">
                        {canDeleteDeck(deck) && (
                          <button
                            onClick={(e) => handleDeleteDeck(e, deck)}
                            className="p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-500 transition-colors cursor-pointer"
                            title="Xóa bộ thẻ này khỏi Chợ Thẻ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleLike(deck.id)}
                          className="p-1 rounded-md hover:bg-[#f7f6f5] dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Thả tim"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-[#9b9a97] dark:text-slate-400 hover:text-rose-500'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Pass Note quote if available */}
                    {deck.isPassDeck && deck.passNote && (
                      <div className="p-2 rounded-lg bg-[#fbfbfa] dark:bg-slate-800/80 border border-[#e9e9e8] dark:border-white/10 text-[11px] text-[#5a5955] dark:text-slate-300 italic mb-2">
                        &ldquo;{deck.passNote}&rdquo;
                      </div>
                    )}

                    {/* Title & Desc */}
                    <h4 className="text-sm sm:text-base font-bold text-[#37352f] dark:text-white group-hover:text-[#2383e2] dark:group-hover:text-sky-400 line-clamp-2 leading-snug transition-colors">
                      {deck.title}
                    </h4>
                    <p className="text-xs text-[#787774] dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {deck.description}
                    </p>

                    {/* Stats */}
                    <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-[#787774] dark:text-slate-300">
                      <div className="flex items-center space-x-0.5 text-amber-600 dark:text-amber-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{deck.rating || 5.0}</span>
                      </div>
                      <span>•</span>
                      <span>{deck.cardCount} thẻ</span>
                      <span>•</span>
                      <span>Đã bán: {deck.salesCount || 0}</span>
                    </div>

                  </div>

                  {/* Footer Action */}
                  <div className="p-3.5 sm:px-5 bg-[#fbfbfa] dark:bg-slate-800/70 border-t border-[#f0efed] dark:border-white/10 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline space-x-1.5">
                        <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400 self-center shrink-0" />
                        <span className="text-base font-extrabold text-[#37352f] dark:text-white">
                          {deck.priceXu} Xu
                        </span>
                        {deck.originalPriceXu && deck.originalPriceXu > deck.priceXu && (
                          <span className="text-[11px] text-[#9b9a97] dark:text-slate-400 line-through">
                            {deck.originalPriceXu} Xu
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const res = await copyFlashcardShareLink({
                            deckId: deck.id,
                            deckTitle: deck.title,
                            useNativeShare: true
                          });
                          if (res.success) {
                            playSound('success');
                            onShowToast?.(res.message);
                          }
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-[#2383e2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Chia sẻ đường dẫn bộ thẻ này"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {onOpenDirectChat && deck.authorName && (
                        <button
                          type="button"
                          onClick={() => {
                            onOpenDirectChat({
                              id: deck.authorEmail || deck.authorName,
                              name: deck.authorName,
                              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(deck.authorName)}`
                            }, deck);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors cursor-pointer"
                          title={`Nhắn tin hỏi tác giả (${deck.authorName})`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {((deck.previewCards && deck.previewCards.length > 0) || (deck.sampleCards && deck.sampleCards.length > 0)) && (
                        <button
                          onClick={() => onOpenFlashcardSample({
                            ...deck,
                            previewCards: deck.previewCards || deck.sampleCards || []
                          })}
                          className="px-2.5 py-1.5 rounded-lg border border-[#e9e9e8] dark:border-white/15 bg-white dark:bg-slate-700 text-[#37352f] dark:text-white text-xs font-semibold hover:bg-[#f7f6f5] dark:hover:bg-slate-600 cursor-pointer"
                        >
                          Xem Thử
                        </button>
                      )}

                      {isOwned ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#edf3ec] dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-[#d3e5d7] dark:border-emerald-500/40 text-xs font-semibold">
                          <Check className="w-3 h-3" />
                          <span>Đã Mua</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBuy(deck)}
                          className="px-3 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-bold shadow-2xs flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Mua ({deck.priceXu} Xu)</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
