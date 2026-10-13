import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Mail,
  Coins,
  Settings,
  Store,
  Sliders,
  Bell,
  RefreshCw,
  ExternalLink,
  Save,
  Trash2
} from 'lucide-react';
import {
  getTransactions,
  fetchFirestoreTransactions,
  subscribeToTransactions,
  adminApproveTransaction,
  adminRejectTransaction,
  getAdminNotifications,
  ADMIN_EMAIL,
  ADMIN_PHONE,
  COIN_RATE_VND
} from '../utils/wallet';
import { getTierLimits, saveTierLimits } from '../utils/userTier';
import { getMarketplaceDecks, adminUpdateMarketplaceDeck } from '../data/marketplaceData';
import { playSound } from '../utils/storage';

export default function AdminModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'tiers' | 'marketplace' | 'notifications'
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tierLimits, setTierLimits] = useState({});
  const [marketDecks, setMarketDecks] = useState([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Reload data
  const reloadData = async () => {
    setTransactions(getTransactions());
    setNotifications(getAdminNotifications());
    setTierLimits(getTierLimits());
    setMarketDecks(getMarketplaceDecks());
    try {
      const fresh = await fetchFirestoreTransactions();
      if (fresh) setTransactions(fresh);
    } catch (e) {}
  };

  useEffect(() => {
    reloadData();
    const unsub = subscribeToTransactions((latest) => {
      setTransactions(latest);
    });
    return () => unsub();
  }, []);

  // Handle Approve
  const handleApprove = async (txId) => {
    if (await adminApproveTransaction(txId)) {
      playSound('success');
      reloadData();
    }
  };

  // Handle Reject
  const handleReject = async (txId) => {
    const reason = prompt('Nhập lý do từ chối giao dịch:', 'Thông tin chuyển khoản không trùng khớp');
    if (reason !== null) {
      if (await adminRejectTransaction(txId, reason)) {
        reloadData();
      }
    }
  };

  // Save Tier Limits
  const handleSaveTierLimits = (e) => {
    e.preventDefault();
    if (saveTierLimits(tierLimits)) {
      playSound('success');
      setSaveSuccessMsg('Đã lưu cấu hình giới hạn các gói thành công!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  // Toggle Marketplace Deck Approval
  const handleToggleDeck = (deckId, currentStatus) => {
    adminUpdateMarketplaceDeck(deckId, { isApproved: !currentStatus });
    reloadData();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-300">
        
        {/* Admin Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center font-bold shadow-md shadow-rose-900">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black tracking-wide">
                  CỬA SỔ QUẢN TRỊ VIÊN (SECRET ADMIN PORTAL)
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Duyệt Chay 24/7
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium flex items-center space-x-2">
                <span>Admin Phone: <strong className="text-amber-300 font-mono font-bold">{ADMIN_PHONE}</strong></span>
                <span>•</span>
                <span>Email: <strong className="text-amber-300 font-mono">{ADMIN_EMAIL}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={reloadData}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-slate-50 gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'transactions'
                ? 'border-indigo-600 text-indigo-700 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Duyệt Nạp & Rút Tiền</span>
            {transactions.filter(t => t.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px]">
                {transactions.filter(t => t.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tiers')}
            className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'tiers'
                ? 'border-indigo-600 text-indigo-700 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span>Tùy Chỉnh Giới Hạn Gói (Free/Plus/Pro/Ultra)</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'marketplace'
                ? 'border-indigo-600 text-indigo-700 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4 text-emerald-500" />
            <span>Quản Lý Sàn Thẻ C2C ({marketDecks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'notifications'
                ? 'border-indigo-600 text-indigo-700 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4 text-rose-500" />
            <span>Hòm Thư Gmail ({notifications.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100/50">
          
          {/* TAB 1: DUYỆT NẠP & RÚT TIỀN */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Danh Sách Lệnh Nạp / Rút Chờ Duyệt Chay</h4>
                  <p className="text-xs text-slate-500">
                    Khi khách nạp hoặc rút tiền, thông báo sẽ gửi về <strong className="text-indigo-600">{ADMIN_EMAIL}</strong>.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200">
                  Tổng {transactions.length} lệnh
                </span>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <Coins className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-semibold">Chưa có giao dịch nạp / rút nào.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-3">Mã GD</th>
                        <th className="p-3">Loại</th>
                        <th className="p-3">Số Lượng</th>
                        <th className="p-3">Khách Hàng / Ngân Hàng</th>
                        <th className="p-3">Trạng Thái</th>
                        <th className="p-3 text-right">Thao Tác Duyệt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-900">
                            {tx.id}
                            <span className="block text-[10px] text-slate-400 font-normal">
                              {new Date(tx.createdAt).toLocaleTimeString('vi-VN')} {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.type === 'deposit'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {tx.type === 'deposit' ? 'NẠP XU' : 'RÚT TIỀN'}
                            </span>
                          </td>
                          <td className="p-3">
                            <strong className="text-slate-900 font-black">{tx.xuAmount} Xu</strong>
                            <span className="block text-[11px] text-slate-500 font-semibold">
                              ~{(tx.amountVnd || tx.xuAmount * COIN_RATE_VND).toLocaleString()}đ
                            </span>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="text-slate-800 font-semibold truncate">{tx.userEmail}</div>
                            {tx.type === 'withdraw' && tx.details && (
                              <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded mt-1 border border-slate-200">
                                <span className="font-bold text-slate-900">{tx.details.bankName}</span> • STK: <span className="font-mono font-bold text-indigo-700">{tx.details.accountNo}</span>
                                <div className="text-slate-500">Chủ TK: {tx.details.accountName}</div>
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            {tx.status === 'pending' && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold animate-pulse">
                                Chờ Duyệt Chay
                              </span>
                            )}
                            {tx.status === 'approved' && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Đã Duyệt ✅
                              </span>
                            )}
                            {tx.status === 'rejected' && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold" title={tx.rejectReason}>
                                Từ Chối ❌
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {tx.status === 'pending' ? (
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => handleApprove(tx.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs flex items-center space-x-1"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Duyệt</span>
                                </button>
                                <button
                                  onClick={() => handleReject(tx.id)}
                                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[11px] font-bold border border-rose-200 flex items-center space-x-1"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Từ chối</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">Hoàn tất</span>
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

          {/* TAB 2: TÙY CHỈNH GIỚI HẠN CỦA GÓI */}
          {activeTab === 'tiers' && (
            <form onSubmit={handleSaveTierLimits} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Cấu Hình Giới Hạn Từng Gói (Free, Plus, Pro, Ultra)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Chỉnh sửa số lượt tạo thẻ mỗi ngày, lượt thưởng khi điểm danh hàng ngày và phí sàn C2C.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Cấu Hình</span>
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg">
                  {saveSuccessMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(tierLimits).map((tierKey) => {
                  const cfg = tierLimits[tierKey];
                  return (
                    <div key={tierKey} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-extrabold uppercase text-slate-900 tracking-wide">
                          {cfg.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          Mã: {tierKey}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="text-[11px] font-medium text-slate-500 block mb-1">
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
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-500 block mb-1">
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
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-500 block mb-1">
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
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </form>
          )}

          {/* TAB 3: QUẢN LÝ SÀN THẺ C2C */}
          {activeTab === 'marketplace' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Quản Lý Bộ Thẻ Do Cộng Đồng Đăng Bán</h4>
                  <p className="text-xs text-slate-500">Admin có thể ẩn/hiện hoặc kiểm duyệt các bộ thẻ trên sàn.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {marketDecks.map((deck) => (
                  <div key={deck.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {deck.categoryName || deck.category}
                        </span>
                        <span className="text-xs font-black text-amber-600">
                          {deck.priceXu} Xu (~{(deck.priceXu * 1000).toLocaleString()}đ)
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{deck.title}</h5>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{deck.description}</p>
                      <div className="mt-2 text-[10px] text-slate-400">
                        Tác giả: <strong>{deck.authorName}</strong> • Đã bán: {deck.salesCount || 0} lượt
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className={`text-[11px] font-bold ${deck.isApproved !== false ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {deck.isApproved !== false ? 'Đang hiển thị trên sàn' : 'Đang tạm ẩn'}
                      </span>
                      <button
                        onClick={() => handleToggleDeck(deck.id, deck.isApproved !== false)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg ${
                          deck.isApproved !== false
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {deck.isApproved !== false ? 'Tạm Ẩn' : 'Hiện Lại'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HÒM THƯ THÔNG BÁO & GMAIL ADMIN */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Nhật Ký Thông Báo (ntfy.sh & Gmail: <span className="text-rose-600 font-mono">{ADMIN_EMAIL}</span>)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Mỗi khi có khách nạp/rút tiền, hệ thống tự động đẩy thông báo qua Web Push, Email và lưu lại nhật ký tại đây.
                  </p>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <Mail className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Chưa có thông báo nào được ghi nhận.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                              Mã: {n.code}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-50 text-[#f02c85]">
                              {n.type === 'deposit' ? 'NẠP XU' : 'RÚT TIỀN'}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 mt-1">{n.subject}</h5>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{n.timestamp}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <a
                            href={`mailto:${n.targetEmail}?subject=${encodeURIComponent(n.subject)}&body=${encodeURIComponent(n.body)}`}
                            className="px-2 py-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded flex items-center space-x-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Mail</span>
                          </a>
                        </div>
                      </div>
                      <pre className="mt-3 p-3 bg-slate-50 rounded-lg text-[11px] text-slate-700 font-mono whitespace-pre-wrap border border-slate-100">
                        {n.body || n.zaloMessage}
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
