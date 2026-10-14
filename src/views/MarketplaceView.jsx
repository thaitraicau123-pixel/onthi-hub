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
  Trash2
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
import { CardGridSkeleton } from '../components/UIStateFeedback';
import confetti from 'canvas-confetti';

export default function MarketplaceView({
  user,
  marketplaceDecks,
  onOpenCreateDeck,
  onOpenFlashcardSample,
  onBalanceUpdated,
  onOpenWallet,
  onOpenBlindBox
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
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          const fresh = getDailyDeals();
          setDailyData(fresh);
          return fresh.secondsLeft;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
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
    <div className="space-y-6 animate-fade-in pb-12 text-[#37352f]">
      
      {/* 1. NOTION PAGE HEADER */}
      <div className="space-y-3 pb-2 border-b border-[#e9e9e8]">
        <div className="text-4xl select-none">🏪</div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37352f] tracking-tight">
              Chợ Thẻ & Sàn Flashcard C2C
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#787774] leading-relaxed max-w-xl">
              Sàn thương mại điện tử trao đổi, mua bán và pass lại bộ thẻ flashcard giữa học viên. Hỗ trợ rút tiền thật về VietQR và mở túi mù nhận quà.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenBlindBox}
              className="px-3 py-1.5 bg-[#fbf3db] hover:bg-[#f6ebd0] text-[#976d57] border border-[#f4e4b7] rounded-md text-xs font-semibold shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-[#cc782f]" />
              <span>🎁 Khui Túi Mù (5 Xu)</span>
            </button>

            <button
              type="button"
              onClick={onOpenCreateDeck}
              className="px-3.5 py-1.5 bg-[#2e2e2e] hover:bg-[#1a1a1a] text-white rounded-md text-xs font-semibold shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Đăng Bán Bộ Thẻ</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DAILY FLASH DEALS SECTION (Notion Callout) */}
      <section className="bg-[#fbfbfa] border border-[#e9e9e8] rounded-xl p-4 sm:p-5 shadow-2xs text-[#37352f] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4 border-b border-[#e9e9e8] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#e9e9e8] text-[#cc782f] flex items-center justify-center shadow-2xs shrink-0">
              <Zap className="w-4 h-4 text-[#cc782f]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs sm:text-sm font-bold text-[#37352f] uppercase tracking-wider">
                  Ưu Đãi Theo Ngày (Flash Deals 24h)
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-[#faece3] text-[#cc782f] border border-[#f3d6c1]">
                  {dailyData.dateStr}
                </span>
              </div>
              <p className="text-[11px] text-[#787774]">
                Giá ưu đãi xoay tua mỗi 24 giờ. Tự động làm mới vào nửa đêm!
              </p>
            </div>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-md border border-[#e9e9e8] text-xs text-[#787774]">
            <Clock className="w-3.5 h-3.5 text-[#cc782f]" />
            <span>Kết thúc trong:</span>
            <span className="font-mono font-bold text-[#37352f]">
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
                className="bg-white border border-[#e9e9e8] hover:border-[#c5c4c0] rounded-xl p-4 transition-all flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="notion-tag notion-tag-yellow text-[10px] font-semibold">
                      {deal.badge}
                    </span>
                    <span className="text-xs text-[#787774]">
                      {deal.categoryLabel}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-[#37352f] leading-snug">
                    {deal.title}
                  </h4>
                  <p className="text-xs text-[#787774] mt-1 line-clamp-2">
                    {deal.subtitle}
                  </p>

                  {/* Stock progress meter */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-[#787774] mb-1">
                      <span>Đã bán {deal.soldPercent}%</span>
                      <span className="text-[#2383e2] font-medium">Chỉ còn {deal.stockRemaining} suất cuối</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#f0efed] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2383e2] rounded-full transition-all"
                        style={{ width: `${deal.soldPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing & Buy Action */}
                <div className="mt-4 pt-3 border-t border-[#f0efed] flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-base font-bold text-[#37352f]">
                        {deal.priceXu} Xu
                      </span>
                      <span className="text-xs text-[#9b9a97] line-through">
                        {deal.originalPriceXu} Xu
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 block font-medium">
                      Tiết kiệm {deal.originalPriceXu - deal.priceXu} Xu ({deal.discountPercent}% OFF)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {deal.previewCards && deal.previewCards.length > 0 && (
                      <button
                        onClick={() => onOpenFlashcardSample(deal)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#e9e9e8] bg-[#f7f6f5] hover:bg-[#f0efed] text-[#37352f] text-xs font-medium cursor-pointer"
                      >
                        Xem Thử
                      </button>
                    )}

                    {isOwned ? (
                      <span className="px-3 py-1.5 bg-[#edf3ec] text-emerald-800 border border-[#d3e5d2] rounded-lg text-xs font-medium flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã Sở Hữu</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuy(deal)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-medium shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
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
        <section className="bg-white rounded-xl p-4 sm:p-5 border border-[#e9e9e8] shadow-2xs text-[#37352f] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0efed] pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f7f6f5] border border-[#e9e9e8] flex items-center justify-center">
                <Repeat className="w-4 h-4 text-[#2383e2]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#37352f] uppercase tracking-wide">
                    🔁 Sàn Pass Lại Thẻ Học Viên ({passDecks.length})
                  </h3>
                  <span className="notion-tag notion-tag-purple text-[10px]">
                    LIVE C2C
                  </span>
                </div>
                <p className="text-xs text-[#787774]">
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
              className="self-start sm:self-auto px-3 py-1 rounded-md bg-[#f7f6f5] hover:bg-[#f0efed] border border-[#e9e9e8] text-xs font-medium text-[#37352f] transition-colors cursor-pointer"
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
                  className="bg-[#fbfbfa] hover:bg-white border border-[#e9e9e8] hover:border-[#c5c4c0] rounded-xl p-3.5 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 truncate">
                        <img
                          src={pDeck.passSellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={pDeck.passSellerName}
                          className="w-5 h-5 rounded-full object-cover border border-[#e9e9e8] shrink-0"
                        />
                        <span className="text-[11px] text-[#787774] truncate">
                          Pass bởi: <strong className="text-[#37352f]">{pDeck.passSellerName}</strong>
                        </span>
                      </div>
                      {canDeleteDeck(pDeck) && (
                        <button
                          onClick={(e) => handleDeleteDeck(e, pDeck)}
                          className="p-1 rounded-md hover:bg-rose-50 text-rose-500 transition-colors ml-2 shrink-0 cursor-pointer"
                          title="Xóa bộ thẻ pass này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-[#37352f] line-clamp-1">
                      {pDeck.title}
                    </h4>
                    {pDeck.passNote && (
                      <p className="text-[11px] text-[#787774] italic line-clamp-1 mt-0.5">
                        "{pDeck.passNote}"
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#f0efed] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#37352f]">
                      {pDeck.priceXu} Xu <span className="text-[10px] text-[#9b9a97] line-through">({pDeck.originalPriceXu || 25} Xu)</span>
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onOpenFlashcardSample(pDeck)}
                        className="px-2 py-1 rounded-md bg-[#f7f6f5] hover:bg-[#f0efed] text-[10px] font-medium text-[#37352f] cursor-pointer"
                      >
                        Học Thử
                      </button>
                      {isOwned ? (
                        <span className="px-2 py-1 rounded-md bg-[#edf3ec] text-emerald-800 text-[10px] font-medium">
                          Đã Mua
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBuy(pDeck)}
                          className="px-2.5 py-1 rounded-md bg-[#37352f] hover:bg-[#201f1d] text-[10px] font-medium text-white shadow-2xs cursor-pointer"
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
      <section id="marketplace-catalog" className="bg-white rounded-xl p-3.5 border border-[#e9e9e8] shadow-2xs text-[#37352f] space-y-3">
        {/* Tier 1: Category Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', name: 'Tất cả chợ' },
            { id: 'pass', name: `🔁 Góc Pass Lại (${passDecks.length})` },
            { id: 'ngoai-ngu', name: 'Ngoại ngữ & SAT' },
            { id: 'it-tech', name: 'IT & Lập Trình' },
            { id: 'cong-chuc', name: 'Công Chức & Ngành Y' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-[#37352f] text-white shadow-2xs font-semibold'
                  : 'bg-[#f7f6f5] text-[#5a5955] border border-[#e9e9e8] hover:bg-[#f0efed]'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tier 2: Search Input, Sorting & Refresh Actions */}
        <div className="pt-2 border-t border-[#f0efed] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#9b9a97] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm bộ thẻ hoặc người pass..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#f7f6f5] hover:bg-[#f0efed] focus:bg-white text-[#37352f] border border-[#e9e9e8] rounded-lg outline-none focus:border-[#2383e2] transition-colors placeholder:text-[#9b9a97]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9b9a97] hover:text-[#37352f] text-xs w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
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
              className="px-3 py-1.5 text-xs bg-[#f7f6f5] hover:bg-[#f0efed] text-[#37352f] font-medium rounded-lg border border-[#e9e9e8] outline-none cursor-pointer transition-colors"
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
              className={`px-3 py-1.5 rounded-lg border border-[#e9e9e8] bg-[#f7f6f5] hover:bg-[#f0efed] text-[#37352f] transition-colors flex items-center space-x-1.5 shrink-0 text-xs font-medium cursor-pointer ${
                isSyncing ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#2383e2] ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm Mới</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT GRID (Notion Database Gallery Cards) */}
      <section>
        {isSyncing ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs text-[#787774] animate-pulse px-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2383e2]" />
              <span>Đang đồng bộ dữ liệu thời gian thực từ máy chủ đám mây...</span>
            </div>
            <CardGridSkeleton count={4} cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#e9e9e8] p-8 text-[#37352f] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#f7f6f5] border border-[#e9e9e8] flex items-center justify-center mx-auto text-[#787774]">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#37352f]">
                {searchQuery ? `Không tìm thấy bộ thẻ nào khớp với "${searchQuery}"` : 'Chưa có bộ thẻ nào trong danh mục này'}
              </h4>
              <p className="text-xs text-[#787774] mt-1 max-w-md mx-auto">
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
                  className="px-3.5 py-1.5 rounded-lg bg-[#f7f6f5] hover:bg-[#f0efed] border border-[#e9e9e8] text-xs font-medium text-[#37352f] transition-colors cursor-pointer"
                >
                  ✨ Xem tất cả ({decks.length})
                </button>
              )}

              <button
                type="button"
                onClick={onOpenCreateDeck}
                className="px-3.5 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-xs font-medium text-white transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tạo Bộ Thẻ Mới</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#787774] px-1">
              <span>Đang hiển thị <strong>{filtered.length}</strong> bộ thẻ ôn tập</span>
              {(activeCategory !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-[#2383e2] hover:underline font-medium text-xs cursor-pointer"
                >
                  Xóa bộ lọc ✕
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((deck) => {
              const isOwned = isCoursePurchased(deck.id);
              const isLiked = likedIds.includes(deck.id);
              return (
                <div
                  key={deck.id}
                  className={`bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group shadow-2xs hover:shadow-xs hover:border-[#c5c4c0] ${
                    deck.isPassDeck
                      ? 'border-[#e0d6eb]'
                      : 'border-[#e9e9e8]'
                  }`}
                >
                  <div className="p-4">
                    
                    {/* Pass badge or Category */}
                    {deck.isPassDeck && (
                      <div className="mb-2">
                        <span className="notion-tag notion-tag-purple text-[10px] inline-flex items-center space-x-1">
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
                          className="w-6 h-6 rounded-full object-cover border border-[#e9e9e8] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-semibold text-[#37352f] truncate block">
                            {deck.isPassDeck ? deck.passSellerName : deck.authorName}
                          </span>
                          <span className="text-[10px] text-[#787774] block">
                            {deck.isPassDeck ? `Bản quyền: ${deck.authorName}` : (deck.categoryName || 'Cộng đồng')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-0.5">
                        {canDeleteDeck(deck) && (
                          <button
                            onClick={(e) => handleDeleteDeck(e, deck)}
                            className="p-1 rounded-md hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                            title="Xóa bộ thẻ này khỏi Chợ Thẻ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleLike(deck.id)}
                          className="p-1 rounded-md hover:bg-[#f7f6f5] transition-colors cursor-pointer"
                          title="Thả tim"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-[#9b9a97] hover:text-rose-500'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Pass Note quote if available */}
                    {deck.isPassDeck && deck.passNote && (
                      <div className="p-2 rounded-lg bg-[#fbfbfa] border border-[#e9e9e8] text-[11px] text-[#5a5955] italic mb-2">
                        "{deck.passNote}"
                      </div>
                    )}

                    {/* Title & Desc */}
                    <h4 className="text-xs sm:text-sm font-semibold text-[#37352f] group-hover:text-[#2383e2] line-clamp-2 leading-snug transition-colors">
                      {deck.title}
                    </h4>
                    <p className="text-xs text-[#787774] mt-1 line-clamp-2 leading-relaxed">
                      {deck.description}
                    </p>

                    {/* Stats */}
                    <div className="mt-2.5 flex items-center space-x-1.5 text-[11px] text-[#787774]">
                      <div className="flex items-center space-x-0.5 text-amber-600 font-medium">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{deck.rating || 5.0}</span>
                      </div>
                      <span>•</span>
                      <span>{deck.cardCount} thẻ</span>
                      <span>•</span>
                      <span>Đã bán: {deck.salesCount || 0}</span>
                    </div>

                  </div>

                  {/* Footer Action */}
                  <div className="p-3 bg-[#fbfbfa] border-t border-[#f0efed] flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-sm font-bold text-[#37352f]">
                          {deck.priceXu} Xu
                        </span>
                        {deck.originalPriceXu && deck.originalPriceXu > deck.priceXu && (
                          <span className="text-[11px] text-[#9b9a97] line-through">
                            {deck.originalPriceXu} Xu
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#787774] block">
                        Ví Xu
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {((deck.previewCards && deck.previewCards.length > 0) || (deck.sampleCards && deck.sampleCards.length > 0)) && (
                        <button
                          onClick={() => onOpenFlashcardSample({
                            ...deck,
                            previewCards: deck.previewCards || deck.sampleCards || []
                          })}
                          className="px-2 py-1 rounded-md border border-[#e9e9e8] bg-white text-[#37352f] text-xs font-medium hover:bg-[#f7f6f5] cursor-pointer"
                        >
                          Xem Thử
                        </button>
                      )}

                      {isOwned ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#edf3ec] text-emerald-800 text-xs font-medium">
                          <Check className="w-3 h-3" />
                          <span>Đã Mua</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBuy(deck)}
                          className="px-3 py-1 rounded-md bg-[#37352f] hover:bg-[#201f1d] text-white text-xs font-medium shadow-2xs flex items-center space-x-1 transition-colors cursor-pointer"
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
