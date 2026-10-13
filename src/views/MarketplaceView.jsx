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
  RefreshCw
} from 'lucide-react';
import {
  getMarketplaceDecks,
  purchaseMarketplaceDeck,
  subscribeToMarketplaceDecks,
  fetchCloudRelayMarketplaceDecks,
  mergeAndSaveMarketplaceDecks
} from '../data/marketplaceData';
import { isCoursePurchased } from '../utils/storage';
import { playSound } from '../utils/storage';
import { getLikedDeckIds, toggleLikeDeck } from '../utils/gamification';
import { getDailyDeals } from '../utils/dailyDeals';
import confetti from 'canvas-confetti';

export default function MarketplaceView({
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
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* 1. MARKETPLACE HERO BANNER (Wayground / Quizizz Style) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#ff5f38] via-[#f02c85] to-[#7d1a52] text-white p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-pink-100 text-xs font-black mb-3">
              <Store className="w-3.5 h-3.5 text-white" />
              <span>CHỢ TRI THỨC & SÀN FLASHCARD C2C</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Sàn Thương Mại Điện Tử Flashcard C2C
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-pink-100 max-w-xl font-medium">
              Tự do mua bán & pass lại flashcard đã học xong. Rút tiền thật về VietQR, mở túi mù giật thưởng Jackpot 100 Xu!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenBlindBox}
              className="px-5 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[#28071a] hover:brightness-110 rounded-2xl text-xs sm:text-sm font-black shadow-xl flex items-center space-x-2 transform hover:scale-105 active:scale-95 transition-transform"
            >
              <Gift className="w-4 h-4 animate-bounce text-[#28071a]" />
              <span>🎁 Khui Túi Mù (5 Xu)</span>
            </button>

            <button
              onClick={onOpenCreateDeck}
              className="px-5 py-3.5 bg-[#fcf7ec] text-[#28071a] hover:bg-white rounded-2xl text-xs sm:text-sm font-black shadow-xl flex items-center space-x-2 shrink-0 transform hover:scale-105 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4 text-[#f02c85]" />
              <span>Đăng Bán Bộ Thẻ</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. DAILY FLASH DEALS SECTION (Sale Theo Ngày 24h Đếm Ngược) */}
      <section className="bg-gradient-to-r from-[#240618] via-[#3a0a25] to-[#240618] border-2 border-[#f02c85]/40 rounded-3xl p-5 sm:p-7 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f02c85]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f02c85] to-amber-400 flex items-center justify-center shadow-lg shadow-pink-900/40">
              <Zap className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight uppercase">
                  ⚡ FLASH SALE THEO NGÀY - GIẢM TỚI 65%
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {dailyData.dateStr}
                </span>
              </div>
              <p className="text-xs text-rose-200/70 font-medium">
                Giá ưu đãi xoay tua mỗi 24 giờ. Tự động kết thúc vào nửa đêm!
              </p>
            </div>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-rose-100 font-bold">Kết thúc trong:</span>
            <span className="font-mono text-sm sm:text-base font-black text-amber-300 tracking-wider">
              {formatCountdown(secondsRemaining)}
            </span>
          </div>
        </div>

        {/* Daily Deal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyData.deals.map((deal) => {
            const isOwned = isCoursePurchased(deal.id);
            return (
              <div
                key={deal.id}
                className="bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#f02c85] rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-[#240618] shadow-xs">
                      {deal.badge}
                    </span>
                    <span className="text-xs text-rose-200/80 font-bold">
                      {deal.categoryLabel}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                    {deal.title}
                  </h4>
                  <p className="text-xs text-rose-100/70 mt-1 line-clamp-2 font-medium">
                    {deal.subtitle}
                  </p>

                  {/* Stock progress meter */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-rose-200/80 mb-1">
                      <span>Đã bán {deal.soldPercent}%</span>
                      <span className="text-amber-300 font-black">Chỉ còn {deal.stockRemaining} suất cuối</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-[#f02c85] rounded-full transition-all"
                        style={{ width: `${deal.soldPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing & Buy Action */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-black text-amber-300">
                        {deal.priceXu} Xu
                      </span>
                      <span className="text-xs text-rose-200/50 line-through">
                        {deal.originalPriceXu} Xu
                      </span>
                    </div>
                    <span className="text-[10px] text-rose-200/80 block font-bold">
                      Tiết kiệm {deal.originalPriceXu - deal.priceXu} Xu ({deal.discountPercent}% OFF)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {deal.previewCards && deal.previewCards.length > 0 && (
                      <button
                        onClick={() => onOpenFlashcardSample(deal)}
                        className="px-3 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                      >
                        Xem Thử
                      </button>
                    )}

                    {isOwned ? (
                      <span className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-black flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã Sở Hữu</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuy(deal)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-[#f02c85] hover:brightness-110 text-white text-xs font-black shadow-lg shadow-pink-900/40 flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Mua Flash Sale ({deal.priceXu} Xu)</span>
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
        <section className="bg-gradient-to-r from-[#3b0b26] via-[#240618] to-[#450a29] rounded-3xl p-5 sm:p-6 border-2 border-[#f02c85]/50 shadow-xl text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#f02c85] flex items-center justify-center shadow-md">
                <Repeat className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    🔁 Sàn Pass Lại Thẻ Học Viên ({passDecks.length})
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse">
                    LIVE C2C
                  </span>
                </div>
                <p className="text-xs text-rose-200/80 font-medium">
                  Bộ thẻ do học viên thi đỗ nhượng lại với giá siêu rẻ (từ 2 Xu). 100% bản quyền chính chủ.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveCategory('pass');
                const el = document.getElementById('marketplace-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors"
            >
              Xem Tất Cả ({passDecks.length}) Thẻ Pass →
            </button>
          </div>

          {/* Quick Mini Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {passDecks.slice(0, 3).map((pDeck) => {
              const isOwned = isCoursePurchased(pDeck.id);
              return (
                <div
                  key={pDeck.id}
                  className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-3.5 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <img
                        src={pDeck.passSellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt={pDeck.passSellerName}
                        className="w-6 h-6 rounded-full object-cover border border-white/30"
                      />
                      <span className="text-[11px] font-bold text-pink-200 truncate">
                        Pass bởi: <strong className="text-white">{pDeck.passSellerName}</strong>
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-white line-clamp-1">
                      {pDeck.title}
                    </h4>
                    {pDeck.passNote && (
                      <p className="text-[11px] text-rose-200/70 italic line-clamp-1 mt-0.5">
                        "{pDeck.passNote}"
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm font-black text-amber-300">
                      {pDeck.priceXu} Xu <span className="text-[10px] text-rose-200/50 line-through">({pDeck.originalPriceXu || 25} Xu)</span>
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onOpenFlashcardSample(pDeck)}
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white"
                      >
                        Học Thử
                      </button>
                      {isOwned ? (
                        <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          Đã Mua
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBuy(pDeck)}
                          className="px-2.5 py-1 rounded-lg btn-wayground-sunset text-[10px] font-black text-white shadow-xs"
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

      {/* 3. FILTER & SEARCH (Wayground Warm Cream Bar) */}
      <section id="marketplace-catalog" className="bg-[#fcf7ec] rounded-3xl p-4 sm:p-5 border border-[#eadfcb] shadow-md text-[#28071a]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-black scrollbar-none">
            {[
              { id: 'all', name: 'Tất cả chợ' },
              { id: 'pass', name: `🔁 Góc Pass Lại Học Viên (${passDecks.length})` },
              { id: 'ngoai-ngu', name: 'Ngoại ngữ & SAT' },
              { id: 'it-tech', name: 'IT & Lập Trình' },
              { id: 'cong-chuc', name: 'Công Chức & Ngành Y' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeCategory === tab.id
                    ? 'bg-[#f02c85] text-white shadow-md shadow-pink-900/40'
                    : 'bg-white text-[#28071a] border border-[#eadfcb] hover:bg-[#f6ebd5]'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm bộ thẻ hoặc người pass..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white text-[#28071a] font-bold border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs bg-white font-black text-[#28071a] rounded-xl border border-[#eadfcb] outline-none shrink-0 cursor-pointer hover:bg-[#f6ebd5]"
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
              className={`p-2 rounded-xl border border-[#eadfcb] bg-white text-[#28071a] hover:bg-[#f6ebd5] transition-all flex items-center justify-center shrink-0 ${
                isSyncing ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-4 h-4 text-[#f02c85] ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>

        </div>
      </section>

      {/* 4. PRODUCT GRID (Wayground Ivory Cards) */}
      <section>
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-[#fcf7ec] rounded-3xl border border-[#eadfcb] p-8 text-[#28071a]">
            <Store className="w-12 h-12 text-[#f02c85] mx-auto mb-2 opacity-60" />
            <h4 className="text-base font-black">Không tìm thấy bộ thẻ nào phù hợp</h4>
            <p className="text-xs text-[#7a5a6b] mt-1 font-medium">Hãy thử chuyển danh mục hoặc tìm từ khóa khác nhé!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((deck) => {
              const isOwned = isCoursePurchased(deck.id);
              const isLiked = likedIds.includes(deck.id);
              return (
                <div
                  key={deck.id}
                  className={`bg-[#fcf7ec] rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-md hover:shadow-2xl ${
                    deck.isPassDeck
                      ? 'border-[#f02c85]/60 hover:border-[#f02c85]'
                      : 'border-[#eadfcb] hover:border-[#f02c85]'
                  }`}
                >
                  <div className="p-4 sm:p-5">
                    
                    {/* Pass badge or Category */}
                    {deck.isPassDeck && (
                      <div className="mb-2.5">
                        <span className="inline-flex items-center space-x-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs">
                          <Repeat className="w-3 h-3" />
                          <span>HỌC VIÊN PASS LẠI</span>
                        </span>
                      </div>
                    )}

                    {/* Creator / Reseller Info */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <img
                          src={deck.isPassDeck ? (deck.passSellerAvatar || deck.authorAvatar) : (deck.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80')}
                          alt={deck.authorName}
                          className="w-8 h-8 rounded-full object-cover border border-[#eadfcb] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-black text-[#28071a] truncate block">
                            {deck.isPassDeck ? deck.passSellerName : deck.authorName}
                          </span>
                          <span className="text-[10px] text-[#7a5a6b] font-bold block">
                            {deck.isPassDeck ? `Bản quyền gốc: ${deck.authorName}` : (deck.categoryName || 'Cộng đồng')}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleLike(deck.id)}
                        className="p-1.5 rounded-full hover:bg-rose-100 transition-colors"
                        title="Thả tim"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#f02c85] text-[#f02c85]' : 'text-slate-300 hover:text-[#f02c85]'}`} />
                      </button>
                    </div>

                    {/* Pass Note quote if available */}
                    {deck.isPassDeck && deck.passNote && (
                      <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200/70 text-[11px] text-[#28071a] font-medium italic mb-2.5">
                        "{deck.passNote}"
                      </div>
                    )}

                    {/* Title & Desc */}
                    <h4 className="text-sm font-black text-[#28071a] group-hover:text-[#f02c85] line-clamp-2 leading-snug transition-colors">
                      {deck.title}
                    </h4>
                    <p className="text-xs text-[#634857] mt-1 line-clamp-2 leading-relaxed font-medium">
                      {deck.description}
                    </p>

                    {/* Stats */}
                    <div className="mt-3 flex items-center space-x-2 text-[11px] text-[#7a5a6b] font-bold">
                      <div className="flex items-center space-x-0.5 text-amber-500 font-black">
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
                  <div className="p-4 bg-[#f5ecd8]/70 border-t border-[#eadfcb] flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-base font-black text-[#28071a]">
                          {deck.priceXu} Xu
                        </span>
                        {deck.originalPriceXu && deck.originalPriceXu > deck.priceXu && (
                          <span className="text-xs text-slate-400 line-through font-bold">
                            {deck.originalPriceXu} Xu
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#7a5a6b] block font-bold">
                        🪙 Thanh toán qua Ví Xu
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {((deck.previewCards && deck.previewCards.length > 0) || (deck.sampleCards && deck.sampleCards.length > 0)) && (
                        <button
                          onClick={() => onOpenFlashcardSample({
                            ...deck,
                            previewCards: deck.previewCards || deck.sampleCards || []
                          })}
                          className="px-2.5 py-1.5 rounded-xl border border-[#eadfcb] bg-white text-[#28071a] text-xs font-bold hover:bg-[#faebd0]"
                        >
                          Xem Thử
                        </button>
                      )}

                      {isOwned ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black">
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã Mua</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBuy(deck)}
                          className="px-3.5 py-1.5 rounded-xl btn-wayground-sunset text-white text-xs font-black shadow-md flex items-center space-x-1 transition-transform transform hover:scale-105 active:scale-95"
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
        )}
      </section>

    </div>
  );
}
