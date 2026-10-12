import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Mail,
  Coins,
  Store,
  Sliders,
  RefreshCw,
  ExternalLink,
  Save,
  ArrowLeft,
  AlertTriangle,
  Repeat,
  Trash2,
  FileSearch
} from 'lucide-react';
import {
  getTransactions,
  adminApproveTransaction,
  adminRejectTransaction,
  getAdminNotifications,
  ADMIN_EMAIL,
  COIN_RATE_VND
} from '../utils/wallet';
import { getTierLimits, saveTierLimits } from '../utils/userTier';
import { getMarketplaceDecks, adminUpdateMarketplaceDeck } from '../data/marketplaceData';
import { checkDeckDuplication } from '../utils/duplicateChecker';
import { playSound } from '../utils/storage';

export default function AdminView({ onBackToHome }) {
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'tiers' | 'marketplace' | 'notifications'
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tierLimits, setTierLimits] = useState({});
  const [marketDecks, setMarketDecks] = useState([]);
  const [marketFilter, setMarketFilter] = useState('all'); // 'all' | 'duplicates' | 'pass' | 'clean'
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const reloadData = () => {
    setTransactions(getTransactions());
    setNotifications(getAdminNotifications());
    setTierLimits(getTierLimits());
    setMarketDecks(getMarketplaceDecks());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleApprove = (txId) => {
    if (adminApproveTransaction(txId)) {
      playSound('success');
      reloadData();
    }
  };

  const handleReject = (txId) => {
    const reason = prompt('Nhập lý do từ chối giao dịch:', 'Thông tin chuyển khoản không trùng khớp');
    if (reason !== null) {
      if (adminRejectTransaction(txId, reason)) {
        reloadData();
      }
    }
  };

  const handleSaveTierLimits = (e) => {
    e.preventDefault();
    if (saveTierLimits(tierLimits)) {
      playSound('success');
      setSaveSuccessMsg('Đã lưu cấu hình giới hạn các gói thành công!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  const handleToggleDeck = (deckId, currentStatus) => {
    adminUpdateMarketplaceDeck(deckId, { isApproved: !currentStatus });
    reloadData();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* ADMIN HEADER (Wayground Dark Velvet Wine Card) */}
      <div className="bg-[#260619] border border-[#f02c85]/40 text-white p-6 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#f02c85] flex items-center justify-center font-bold shadow-md shadow-pink-900/40">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                CỬA SỔ QUẢN TRỊ VIÊN (SECRET ADMIN PORTAL)
              </h2>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-[#f02c85]/20 text-[#ff80b5] border border-[#f02c85]/30">
                Duyệt Chay 24/7
              </span>
            </div>
            <p className="text-xs text-rose-200/70 mt-0.5 font-medium">
              Email nhận thông báo hệ thống: <strong className="text-amber-300 font-mono">{ADMIN_EMAIL}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={reloadData}
            className="p-2.5 text-rose-200/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onBackToHome}
            className="px-4 py-2 bg-[#360b24] hover:bg-[#4d1033] border border-[#f02c85]/30 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#f02c85]" />
            <span>Quay Lại Trang Chủ</span>
          </button>
        </div>
      </div>

      {/* ADMIN TABS SWITCHER (Wayground Warm Cream Container) */}
      <div className="bg-[#fcf7ec] rounded-3xl border border-[#eadfcb] shadow-xl overflow-hidden text-[#28071a]">
        <div className="flex border-b border-[#eadfcb] bg-[#f5ecd8]/70 text-xs sm:text-sm font-black overflow-x-auto">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'transactions'
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Duyệt Nạp & Rút Tiền</span>
            {transactions.filter(t => t.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#f02c85] text-white rounded-full text-[10px]">
                {transactions.filter(t => t.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tiers')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'tiers'
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#f02c85]" />
            <span>Tùy Chỉnh Giới Hạn Gói (Free/Plus/Pro/Ultra)</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'marketplace'
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Quản Lý Sàn C2C ({marketDecks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'notifications'
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <Mail className="w-4 h-4 text-[#f02c85]" />
            <span>Nhật Ký Gmail ({notifications.length})</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-6 sm:p-8">
          
          {/* TAB 1: DUYỆT NẠP & RÚT */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-[#28071a]">Danh Sách Lệnh Nạp / Rút Chờ Duyệt Chay</h4>
                  <p className="text-xs text-[#7a5a6b] font-medium">
                    Khi khách nạp hoặc rút tiền, thông báo sẽ gửi về <strong className="text-[#f02c85]">{ADMIN_EMAIL}</strong>.
                  </p>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-xl bg-white text-[#28071a] border border-[#eadfcb]">
                  Tổng {transactions.length} lệnh
                </span>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#eadfcb]">
                  <Coins className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-[#7a5a6b] font-bold">Chưa có giao dịch nạp / rút nào.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#eadfcb] overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f5ecd8] border-b border-[#eadfcb] text-[#28071a] uppercase tracking-wider font-black">
                      <tr>
                        <th className="p-3">Mã GD</th>
                        <th className="p-3">Loại</th>
                        <th className="p-3">Số Lượng</th>
                        <th className="p-3">Khách Hàng / Ngân Hàng</th>
                        <th className="p-3">Trạng Thái</th>
                        <th className="p-3 text-right">Thao Tác Duyệt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eadfcb]/60">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-[#fcf7ec]/60 transition-colors">
                          <td className="p-3 font-mono font-black text-[#28071a]">
                            {tx.id}
                            <span className="block text-[10px] text-[#7a5a6b] font-normal">
                              {new Date(tx.createdAt).toLocaleTimeString('vi-VN')} {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              tx.type === 'deposit'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {tx.type === 'deposit' ? 'NẠP XU' : 'RÚT TIỀN'}
                            </span>
                          </td>
                          <td className="p-3">
                            <strong className="text-[#28071a] font-black">{tx.xuAmount} Xu</strong>
                            <span className="block text-[11px] text-[#7a5a6b] font-bold">
                              ~{(tx.amountVnd || tx.xuAmount * COIN_RATE_VND).toLocaleString()}đ
                            </span>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="text-[#28071a] font-black truncate">{tx.userEmail}</div>
                            {tx.type === 'withdraw' && tx.details && (
                              <div className="text-[11px] text-[#4e2f41] bg-[#fcf7ec] p-2 rounded-xl mt-1 border border-[#eadfcb]">
                                <span className="font-black text-[#28071a]">{tx.details.bankName}</span> • STK: <span className="font-mono font-black text-[#f02c85]">{tx.details.accountNo}</span>
                                <div className="text-[#7a5a6b]">Chủ TK: {tx.details.accountName}</div>
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            {tx.status === 'pending' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black animate-pulse">
                                Chờ Duyệt Chay
                              </span>
                            )}
                            {tx.status === 'approved' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                                Đã Duyệt ✅
                              </span>
                            )}
                            {tx.status === 'rejected' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black" title={tx.rejectReason}>
                                Từ Chối ❌
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {tx.status === 'pending' ? (
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => handleApprove(tx.id)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-black shadow-xs flex items-center space-x-1"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Duyệt</span>
                                </button>
                                <button
                                  onClick={() => handleReject(tx.id)}
                                  className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-[11px] font-black border border-rose-300 flex items-center space-x-1"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Từ chối</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-[#7a5a6b] text-[11px] italic font-bold">Hoàn tất</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TÙY CHỈNH GIỚI HẠN GÓI */}
          {activeTab === 'tiers' && (
            <form onSubmit={handleSaveTierLimits} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-[#28071a]">
                    Cấu Hình Giới Hạn Từng Gói (Free, Plus, Pro, Ultra)
                  </h4>
                  <p className="text-xs text-[#7a5a6b] font-medium">
                    Chỉnh sửa số lượt tạo thẻ mỗi ngày, lượt thưởng khi điểm danh hàng ngày và phí sàn C2C.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 btn-wayground-sunset text-white text-xs font-black rounded-xl shadow-md flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Cấu Hình</span>
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black rounded-xl">
                  {saveSuccessMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(tierLimits).map((tierKey) => {
                  const cfg = tierLimits[tierKey];
                  return (
                    <div key={tierKey} className="p-4 bg-white rounded-2xl border border-[#eadfcb] space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-[#eadfcb] pb-2">
                        <span className="text-xs font-black uppercase text-[#28071a] tracking-wide">
                          {cfg.name}
                        </span>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pink-100 text-[#f02c85] border border-pink-200">
                          {tierKey}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="text-[11px] font-bold text-[#7a5a6b] block mb-1">
                            Lượt tạo/ngày:
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={cfg.dailyLimit}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setTierLimits(prev => ({
                                ...prev,
                                [tierKey]: { ...prev[tierKey], dailyLimit: val }
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 border border-[#eadfcb] rounded-lg text-xs font-black bg-[#fcf7ec] text-[#28071a]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#7a5a6b] block mb-1">
                            Thưởng điểm danh:
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={cfg.checkInBonus}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setTierLimits(prev => ({
                                ...prev,
                                [tierKey]: { ...prev[tierKey], checkInBonus: val }
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 border border-[#eadfcb] rounded-lg text-xs font-black bg-[#fcf7ec] text-[#28071a]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#7a5a6b] block mb-1">
                            Phí sàn (%):
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={cfg.marketplaceFee}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setTierLimits(prev => ({
                                ...prev,
                                [tierKey]: { ...prev[tierKey], marketplaceFee: val }
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 border border-[#eadfcb] rounded-lg text-xs font-black bg-[#fcf7ec] text-[#28071a]"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </form>
          )}

          {/* TAB 3: QUẢN LÝ SÀN C2C & KIỂM TRA TRÙNG LẶP */}
          {activeTab === 'marketplace' && (() => {
            const decksWithDup = marketDecks.map((d) => ({
              ...d,
              dupCheck: checkDeckDuplication(d, d.id)
            }));

            const duplicateCount = decksWithDup.filter(d => d.dupCheck.similarityScore >= 55).length;
            const passCount = decksWithDup.filter(d => d.isPassDeck === true).length;
            const cleanCount = decksWithDup.filter(d => d.dupCheck.similarityScore < 30).length;

            const filteredDecks = decksWithDup.filter((d) => {
              if (marketFilter === 'duplicates') return d.dupCheck.similarityScore >= 55;
              if (marketFilter === 'pass') return d.isPassDeck === true;
              if (marketFilter === 'clean') return d.dupCheck.similarityScore < 30;
              return true;
            });

            return (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-black text-[#28071a]">
                      Quản Lý & Kiểm Duyệt Trùng Lặp Sàn Flashcard C2C
                    </h4>
                    <p className="text-xs text-[#7a5a6b] font-medium">
                      Hệ thống tự động đối chiếu Jaccard & N-gram để phát hiện đạo văn hoặc sao chép thẻ trái phép.
                    </p>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-black">
                    <button
                      onClick={() => setMarketFilter('all')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        marketFilter === 'all'
                          ? 'bg-[#28071a] text-white shadow-xs'
                          : 'bg-white text-[#28071a] border border-[#eadfcb] hover:bg-[#faebd0]'
                      }`}
                    >
                      Tất cả ({marketDecks.length})
                    </button>

                    <button
                      onClick={() => setMarketFilter('duplicates')}
                      className={`px-3 py-1.5 rounded-xl flex items-center space-x-1 transition-all ${
                        marketFilter === 'duplicates'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Trùng Lặp ({duplicateCount})</span>
                    </button>

                    <button
                      onClick={() => setMarketFilter('pass')}
                      className={`px-3 py-1.5 rounded-xl flex items-center space-x-1 transition-all ${
                        marketFilter === 'pass'
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      <span>Thẻ Pass ({passCount})</span>
                    </button>

                    <button
                      onClick={() => setMarketFilter('clean')}
                      className={`px-3 py-1.5 rounded-xl flex items-center space-x-1 transition-all ${
                        marketFilter === 'clean'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Độc Bản ({cleanCount})</span>
                    </button>
                  </div>
                </div>

                {filteredDecks.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-[#eadfcb] text-xs text-[#7a5a6b]">
                    Không có bộ thẻ nào trong danh mục lọc này.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filteredDecks.map((deck) => (
                      <div
                        key={deck.id}
                        className={`p-4 bg-white rounded-2xl border flex flex-col justify-between shadow-xs transition-all ${
                          deck.dupCheck.similarityScore >= 55
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-[#eadfcb]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#fcf7ec] text-[#28071a] border border-[#eadfcb]">
                              {deck.categoryName || deck.category}
                            </span>
                            <span className="text-xs font-black text-[#f02c85]">
                              {deck.priceXu} Xu (~{(deck.priceXu * 1000).toLocaleString()}đ)
                            </span>
                          </div>

                          <h5 className="text-xs font-black text-[#28071a] line-clamp-1">
                            {deck.title}
                          </h5>
                          <p className="text-[11px] text-[#4e2f41] mt-1 line-clamp-2 font-medium">
                            {deck.description}
                          </p>

                          <div className="mt-2 text-[10px] text-[#7a5a6b] font-bold">
                            Tác giả: <strong>{deck.authorName}</strong> • Đã bán: {deck.salesCount || 0} lượt
                          </div>

                          {/* Pass Deck indicator */}
                          {deck.isPassDeck && (
                            <div className="mt-2 p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-[11px]">
                              <span className="font-black flex items-center space-x-1">
                                <Repeat className="w-3.5 h-3.5 text-purple-600" />
                                <span>Thẻ Pass C2C từ học viên: {deck.passSellerName}</span>
                              </span>
                              {deck.passNote && (
                                <span className="text-[10px] text-purple-700 italic block mt-0.5">
                                  "{deck.passNote}"
                                </span>
                              )}
                            </div>
                          )}

                          {/* Duplicate Detection Alert Badge */}
                          {deck.dupCheck.similarityScore >= 55 ? (
                            <div className="mt-2.5 p-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-[11px] font-bold">
                              <div className="flex items-center space-x-1 font-black text-rose-900">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                <span>CẢNH BÁO TRÙNG LẶP CAO ({deck.dupCheck.similarityScore}%)</span>
                              </div>
                              <div className="mt-0.5 text-[10px] text-rose-700 font-medium">
                                {deck.dupCheck.reason}
                              </div>
                              <div className="mt-0.5 text-[10px] text-rose-600 truncate">
                                Bộ đối chiếu: <strong>{deck.dupCheck.matchedDeck?.title}</strong> ({deck.dupCheck.matchedDeck?.source})
                              </div>
                            </div>
                          ) : deck.dupCheck.similarityScore >= 30 ? (
                            <div className="mt-2 p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold flex items-center space-x-1">
                              <span>ℹ️ Tương đồng vừa phải ({deck.dupCheck.similarityScore}%) với:</span>
                              <span className="truncate max-w-[150px] font-black">{deck.dupCheck.matchedDeck?.title}</span>
                            </div>
                          ) : (
                            <div className="mt-2 inline-flex items-center space-x-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Độc bản an toàn ({deck.dupCheck.similarityScore}% trùng lặp)</span>
                            </div>
                          )}
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="mt-3 pt-2.5 border-t border-[#eadfcb] flex items-center justify-between">
                          <span className={`text-[11px] font-black ${deck.isApproved !== false ? 'text-emerald-700' : 'text-slate-400'}`}>
                            {deck.isApproved !== false ? 'Đang hiển thị trên sàn' : 'Đang tạm ẩn'}
                          </span>
                          
                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => handleToggleDeck(deck.id, deck.isApproved !== false)}
                              className={`px-3 py-1 text-xs font-black rounded-lg ${
                                deck.isApproved !== false
                                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {deck.isApproved !== false ? 'Tạm Ẩn' : 'Duyệt Lại'}
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 4: HÒM THƯ GMAIL ADMIN */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Lịch Sử Thông Báo Đã Gửi Về Gmail: <span className="text-rose-600 font-mono">{ADMIN_EMAIL}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Mỗi khi có khách nạp/rút tiền, hệ thống tự động ghi nhật ký và gửi email thông báo chi tiết.
                  </p>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <Mail className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Chưa có thông báo email nào được ghi nhận.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
                            Gửi tới: {n.targetEmail}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900 mt-1">{n.subject}</h5>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{n.timestamp}</span>
                        </div>
                        <a
                          href={`mailto:${n.targetEmail}?subject=${encodeURIComponent(n.subject)}&body=${encodeURIComponent(n.body)}`}
                          className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 bg-white hover:bg-indigo-50 rounded-md shrink-0 flex items-center space-x-1 border border-indigo-200"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Mở Mail</span>
                        </a>
                      </div>
                      <pre className="mt-3 p-3 bg-white rounded-xl text-[11px] text-slate-700 font-mono whitespace-pre-wrap border border-slate-200">
                        {n.body}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
