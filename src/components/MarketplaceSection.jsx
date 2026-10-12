import React, { useState } from 'react';
import {
  Store,
  Sparkles,
  Search,
  ShoppingCart,
  Star,
  Layers,
  CheckCircle,
  Plus,
  Coins,
  Check
} from 'lucide-react';
import { getMarketplaceDecks, purchaseMarketplaceDeck } from '../data/marketplaceData';
import { isCoursePurchased } from '../utils/storage';
import { playSound } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function MarketplaceSection({
  onOpenCreateModal,
  onOpenFlashcardSample,
  onBalanceUpdated,
  onOpenWallet
}) {
  const [decks, setDecks] = useState(() => getMarketplaceDecks().filter(d => d.isApproved !== false));
  const [filterCat, setFilterCat] = useState('all');
  const [searchMkt, setSearchMkt] = useState('');

  // Reload decks
  const reloadDecks = () => {
    setDecks(getMarketplaceDecks().filter(d => d.isApproved !== false));
  };

  // Filter
  const filteredDecks = decks.filter((d) => {
    const matchCat = filterCat === 'all' || d.category === filterCat;
    const term = searchMkt.toLowerCase();
    const matchSearch = !term || d.title.toLowerCase().includes(term) || d.description?.toLowerCase().includes(term) || d.authorName?.toLowerCase().includes(term);
    return matchCat && matchSearch;
  });

  // Handle Buy with Xu
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-slate-200">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
            <Store className="w-3.5 h-3.5 text-amber-600" />
            <span>SÀN THƯƠNG MẠI ĐIỆN TỬ FLASHCARD C2C</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Chợ Trao Đổi & Mua Bán Thẻ Bằng Xu
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Nơi học viên và giảng viên tự do đăng bán bộ thẻ tự soạn, kiếm Xu và rút về tài khoản ngân hàng.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng Bán Bộ Thẻ Của Bạn</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          {[
            { id: 'all', name: 'Tất cả chợ' },
            { id: 'ngoai-ngu', name: 'Ngoại ngữ & SAT' },
            { id: 'it-tech', name: 'IT & Data' },
            { id: 'cong-chuc', name: 'Công chức & Ngành Y' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCat(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                filterCat === tab.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm bộ thẻ trên sàn..."
            value={searchMkt}
            onChange={(e) => setSearchMkt(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredDecks.map((deck) => {
          const isOwned = isCoursePurchased(deck.id);
          return (
            <div
              key={deck.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-4 sm:p-5">
                
                {/* Author Info */}
                <div className="flex items-center space-x-2.5 mb-3">
                  <img
                    src={deck.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={deck.authorName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {deck.authorName}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {deck.categoryName || 'Cộng đồng'}
                    </span>
                  </div>
                </div>

                {/* Title & Desc */}
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                  {deck.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {deck.description}
                </p>

                {/* Stats */}
                <div className="mt-3 flex items-center space-x-2 text-[11px] text-slate-500">
                  <div className="flex items-center space-x-0.5 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{deck.rating || 5.0}</span>
                  </div>
                  <span>•</span>
                  <span>{deck.cardCount} thẻ</span>
                  <span>•</span>
                  <span>Đã bán: {deck.salesCount || 0}</span>
                </div>

              </div>

              {/* Pricing & Footer Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-base font-black text-amber-700">
                    {deck.priceXu} Xu
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    ~{(deck.priceXu * 1000).toLocaleString()}đ
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {deck.sampleCards && deck.sampleCards.length > 0 && (
                    <button
                      onClick={() => onOpenFlashcardSample({
                        title: deck.title,
                        previewCards: deck.sampleCards,
                        id: deck.id
                      })}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50"
                      title="Xem trước mẫu"
                    >
                      Xem Thử
                    </button>
                  )}

                  {isOwned ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã Mua</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuy(deck)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1 transition-colors"
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

    </section>
  );
}
