import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  QrCode,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Coins,
  MessageCircle,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import {
  getWalletBalance,
  createDepositRequest,
  createWithdrawalRequest,
  getTransactions,
  ADMIN_EMAIL,
  ADMIN_PHONE,
  ADMIN_ZALO_LINK,
  COIN_RATE_VND,
  openAdminZaloChat,
  formatAdminZaloMessage
} from '../utils/wallet';
import { generateVietQRUrl, getBankConfig, playSound } from '../utils/storage';

export default function WalletView({ user, onBalanceUpdated }) {
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' | 'withdraw' | 'history'
  const [balance, setBalance] = useState(getWalletBalance());

  // Deposit state
  const [depositXu, setDepositXu] = useState(50);
  const [depositResult, setDepositResult] = useState(null);

  // Withdraw state
  const [withdrawXu, setWithdrawXu] = useState(20);
  const [bankName, setBankName] = useState('MB Bank');
  const [accountNo, setAccountNo] = useState('');
  const [accountName, setAccountName] = useState('');
  const [withdrawMsg, setWithdrawMsg] = useState({ text: '', isError: false });
  const [lastWithdrawTx, setLastWithdrawTx] = useState(null);
  const [copiedZalo, setCopiedZalo] = useState(false);

  const bankConfig = getBankConfig();
  const transactions = getTransactions();

  const handleCreateDeposit = () => {
    const res = createDepositRequest({
      xuAmount: depositXu,
      userEmail: user?.email || 'khach_nap@onthihub.vn'
    });
    setDepositResult(res);
    playSound('flip');
  };

  const handleCreateWithdrawal = (e) => {
    e.preventDefault();
    if (!accountNo.trim() || !accountName.trim()) {
      setWithdrawMsg({ text: 'Vui lòng điền đầy đủ số tài khoản và tên chủ thẻ!', isError: true });
      return;
    }
    if (withdrawXu < 10) {
      setWithdrawMsg({ text: 'Số lượng rút tối thiểu là 10 Xu (10.000 VNĐ)!', isError: true });
      return;
    }

    const res = createWithdrawalRequest({
      xuAmount: parseInt(withdrawXu, 10),
      bankName,
      accountNo: accountNo.trim(),
      accountName: accountName.trim().toUpperCase(),
      userEmail: user?.email || 'creator@onthihub.vn'
    });

    if (res.success) {
      playSound('success');
      setBalance(getWalletBalance());
      onBalanceUpdated();
      setLastWithdrawTx(res);
      setWithdrawMsg({
        text: `🎉 Lệnh rút ${withdrawXu} Xu (${(withdrawXu * COIN_RATE_VND).toLocaleString()}đ) đã tạo thành công! Mã lệnh: ${res.tx.id}. Hãy bấm nút nhắn tin Zalo bên dưới để báo Admin duyệt chuyển tiền ngay.`,
        isError: false
      });
      setAccountNo('');
      setAccountName('');
    } else {
      setWithdrawMsg({ text: res.message, isError: true });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* VIBRANT WALLET CARD (Wayground Sunset Gradient) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#ff5f38] via-[#f02c85] to-[#7d1a52] text-white p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-pink-100 text-xs font-black uppercase tracking-wider mb-1">
              <Wallet className="w-4 h-4 text-white" />
              <span>VÍ XU ÔNTHIHUB</span>
            </div>
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl sm:text-5xl font-black">{balance} Xu</span>
              <span className="text-xs sm:text-sm text-pink-100 font-bold">
                ~ {(balance * COIN_RATE_VND).toLocaleString()} VNĐ
              </span>
            </div>
            <p className="mt-2 text-xs text-pink-100 max-w-sm font-medium">
              Đơn vị tiền tệ chính để giao dịch bộ thẻ trên Sàn C2C và nâng cấp gói hội viên.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveTab('deposit');
                setDepositResult(null);
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-[#fcf7ec] hover:bg-white text-[#28071a] font-black text-xs shadow-md flex items-center justify-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              <span>Nạp Thêm Xu</span>
            </button>

            <button
              onClick={() => setActiveTab('withdraw')}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-xs border border-white/30 flex items-center justify-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4 text-white" />
              <span>Rút Tiền Mặt</span>
            </button>
          </div>
        </div>
      </div>

      {/* TABS CONTAINER (Wayground Warm Cream Container) */}
      <div className="bg-[#fcf7ec] rounded-3xl border border-[#eadfcb] shadow-xl overflow-hidden text-[#28071a]">
        
        {/* Tab switch header */}
        <div className="flex border-b border-[#eadfcb] bg-[#f5ecd8]/70 text-xs sm:text-sm font-black">
          <button
            onClick={() => {
              setActiveTab('deposit');
              setDepositResult(null);
            }}
            className={`flex-1 py-3.5 text-center border-b-2 flex items-center justify-center space-x-2 transition-colors ${
              activeTab === 'deposit'
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            <span>Nạp Xu (VietQR)</span>
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-3.5 text-center border-b-2 flex items-center justify-center space-x-2 transition-colors ${
              activeTab === 'withdraw'
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 text-rose-500" />
            <span>Rút Tiền Về Ngân Hàng</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3.5 text-center border-b-2 flex items-center justify-center space-x-2 transition-colors ${
              activeTab === 'history'
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#f02c85]" />
            <span>Lịch Sử ({transactions.length})</span>
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6 sm:p-8">
          
          {/* TAB 1: NẠP XU */}
          {activeTab === 'deposit' && (
            <div>
              {!depositResult ? (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black text-[#28071a] block mb-3">
                      Chọn gói Xu muốn nạp qua ngân hàng:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[20, 50, 100, 200].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setDepositXu(num)}
                          className={`p-4 rounded-2xl border text-center transition-all ${
                            depositXu === num
                              ? 'border-[#f02c85] bg-pink-100/60 text-[#28071a] font-black ring-2 ring-[#f02c85]/30'
                              : 'border-[#eadfcb] bg-white hover:border-[#f02c85] text-[#28071a]'
                          }`}
                        >
                          <span className="text-base font-black block">{num} Xu</span>
                          <span className="text-xs text-[#7a5a6b] font-bold">{(num * 1000).toLocaleString()}đ</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-[#eadfcb] text-xs sm:text-sm text-[#28071a] space-y-2">
                    <div className="flex justify-between">
                      <span className="font-bold">Số lượng Xu sẽ cộng:</span>
                      <strong className="text-[#f02c85] font-black">{depositXu} Xu</strong>
                    </div>
                    <div className="flex justify-between font-bold text-[#28071a] text-sm">
                      <span>Số tiền chuyển khoản VietQR:</span>
                      <strong className="text-emerald-700 font-black">{(depositXu * COIN_RATE_VND).toLocaleString()}đ</strong>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateDeposit}
                    className="w-full py-3.5 btn-wayground-sunset text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-pink-900/30 flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Tạo Lệnh Nạp & Quét Mã VietQR</span>
                  </button>

                  <p className="text-xs text-[#7a5a6b] text-center font-medium">
                    Sau khi quét mã, lệnh sẽ tự động gửi thông báo tới <strong>{ADMIN_EMAIL}</strong> để duyệt chay.
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Lệnh Nạp Đang Chờ: {depositResult.tx.id}
                  </span>

                  <div className="p-3 bg-white rounded-2xl border border-[#eadfcb] inline-block shadow-md">
                    <img
                      src={generateVietQRUrl({
                        bank: bankConfig.bank,
                        accountNo: bankConfig.accountNo,
                        accountName: bankConfig.accountName,
                        amount: depositResult.tx.amountVnd,
                        memo: depositResult.tx.id
                      })}
                      alt="VietQR Deposit"
                      className="w-52 h-52 mx-auto object-contain bg-white p-2 rounded-xl"
                    />
                  </div>

                  <div className="text-xs sm:text-sm text-[#28071a] space-y-1 font-bold">
                    <p>Số tiền cần chuyển: <strong className="text-emerald-700 font-black">{depositResult.tx.amountVnd.toLocaleString()}đ</strong></p>
                    <p>Nội dung chuyển khoản: <strong className="text-[#f02c85] font-mono font-black bg-pink-100 px-2 py-0.5 rounded">{depositResult.tx.id}</strong></p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-pink-50 border-2 border-[#f02c85]/30 rounded-2xl text-xs space-y-3 text-left max-w-lg mx-auto shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-8 h-8 rounded-xl bg-[#0068ff] text-white flex items-center justify-center font-black text-sm shadow-xs">
                          Z
                        </span>
                        <div>
                          <strong className="text-[#28071a] font-black text-xs block">
                            Báo Admin Duyệt Xu Qua Zalo (0986.019.623)
                          </strong>
                          <span className="text-[#7a5a6b] text-[11px] font-medium">
                            Hotline / Zalo: <strong className="text-[#0068ff] font-mono">{ADMIN_PHONE}</strong>
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Online Duyệt 24/7
                      </span>
                    </div>

                    <p className="text-[11px] text-[#4e2f41] leading-relaxed font-medium">
                      Chuyển khoản xong, bạn chỉ cần bấm nút bên dưới: hệ thống sẽ <strong>tự động sao chép mã {depositResult.tx.id}</strong> và <strong>mở Zalo chat với Admin ({ADMIN_PHONE})</strong> để được duyệt cộng Xu ngay lập tức!
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          openAdminZaloChat(depositResult.zaloMessage);
                          setCopiedZalo(true);
                          setTimeout(() => setCopiedZalo(false), 3000);
                        }}
                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#0068ff] hover:bg-[#0052cc] text-white font-black text-xs shadow-md flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>{copiedZalo ? '✅ Đã Copy & Mở Zalo Admin!' : '💬 Mở Zalo Nhắn Admin (0986.019.623)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(depositResult.zaloMessage);
                          setCopiedZalo(true);
                          setTimeout(() => setCopiedZalo(false), 2000);
                        }}
                        className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white border border-[#eadfcb] text-[#28071a] font-bold text-xs hover:bg-[#f5ecd8] flex items-center justify-center space-x-1"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#7a5a6b]" />
                        <span>Sao Chép</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setDepositResult(null)}
                    className="text-xs text-[#f02c85] hover:underline font-black"
                  >
                    Quay lại chọn gói nạp khác
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RÚT TIỀN */}
          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              {lastWithdrawTx && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-pink-50 border-2 border-[#f02c85]/40 rounded-2xl text-xs space-y-3 shadow-md animate-fade-in text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-8 h-8 rounded-xl bg-[#0068ff] text-white flex items-center justify-center font-black text-sm shadow-xs">
                        Z
                      </span>
                      <div>
                        <strong className="text-[#28071a] font-black text-xs block">
                          Gửi Tin Nhắn Zalo Báo Admin Chuyển Khoản
                        </strong>
                        <span className="text-[#7a5a6b] text-[11px] font-medium">
                          Zalo Admin: <strong className="text-[#0068ff] font-mono">{ADMIN_PHONE}</strong>
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Mã: {lastWithdrawTx.tx.id}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#4e2f41] leading-relaxed font-medium">
                    Bấm nút bên dưới để gửi thông tin số tài khoản và mã rút <strong>{lastWithdrawTx.tx.id}</strong> qua Zalo Admin để được chuyển tiền nhanh nhất:
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        openAdminZaloChat(lastWithdrawTx.zaloMessage);
                        setCopiedZalo(true);
                        setTimeout(() => setCopiedZalo(false), 3000);
                      }}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#0068ff] hover:bg-[#0052cc] text-white font-black text-xs shadow-md flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>{copiedZalo ? '✅ Đã Copy & Mở Zalo Admin!' : '💬 Mở Zalo Báo Admin (0986.019.623) Chuyển Tiền'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(lastWithdrawTx.zaloMessage);
                        setCopiedZalo(true);
                        setTimeout(() => setCopiedZalo(false), 2000);
                      }}
                      className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white border border-[#eadfcb] text-[#28071a] font-bold text-xs hover:bg-[#f5ecd8] flex items-center justify-center space-x-1"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#7a5a6b]" />
                      <span>Sao Chép</span>
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateWithdrawal} className="space-y-4 text-xs sm:text-sm text-[#28071a]">
                {withdrawMsg.text && (
                  <div className={`p-3.5 rounded-2xl border font-bold ${
                    withdrawMsg.isError
                      ? 'bg-rose-100 border-rose-300 text-rose-800'
                      : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  }`}>
                    {withdrawMsg.text}
                  </div>
                )}

                <div>
                  <label className="font-black text-[#28071a] block mb-1">
                    Số lượng Xu muốn rút (Khả dụng: {balance} Xu):
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="10"
                      max={balance}
                      value={withdrawXu}
                      onChange={(e) => setWithdrawXu(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] font-black bg-white text-[#28071a]"
                      required
                    />
                    <span className="font-black text-[#7a5a6b] shrink-0 text-xs sm:text-sm">
                      = {(withdrawXu * COIN_RATE_VND).toLocaleString()} VNĐ
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-black text-[#28071a] block mb-1">Ngân hàng nhận tiền:</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] text-xs sm:text-sm bg-white font-bold text-[#28071a]"
                  >
                    <option value="MB Bank">MB Bank (Ngân Hàng Quân Đội)</option>
                    <option value="Vietcombank">Vietcombank</option>
                    <option value="Techcombank">Techcombank</option>
                    <option value="VPBank">VPBank</option>
                    <option value="ACB">ACB (Á Châu)</option>
                    <option value="BIDV">BIDV</option>
                    <option value="VietinBank">VietinBank</option>
                    <option value="TPBank">TPBank</option>
                  </select>
                </div>

                <div>
                  <label className="font-black text-[#28071a] block mb-1">Số tài khoản ngân hàng:</label>
                  <input
                    type="text"
                    placeholder="Nhập số tài khoản..."
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] font-mono font-bold bg-white text-[#28071a]"
                    required
                  />
                </div>

                <div>
                  <label className="font-black text-[#28071a] block mb-1">Tên chủ tài khoản (in hoa):</label>
                  <input
                    type="text"
                    placeholder="VD: NGUYEN VAN A"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] font-mono uppercase font-bold bg-white text-[#28071a]"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={balance < 10}
                    className="w-full py-3.5 bg-[#f02c85] hover:bg-[#dc1f74] text-white rounded-2xl font-black shadow-lg shadow-pink-900/30 flex items-center justify-center space-x-2 disabled:opacity-50 transition-transform transform hover:scale-105 active:scale-95"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Xác Nhận Rút Tiền Về Tài Khoản</span>
                  </button>
                </div>

                <p className="text-xs text-[#7a5a6b] text-center font-medium">
                  Hotline / Zalo hỗ trợ rút tiền nhanh: <strong className="text-[#0068ff]">{ADMIN_PHONE}</strong> (Duyệt chuyển khoản 24/7).
                </p>
              </form>
            </div>
          )}

          {/* TAB 3: LỊCH SỬ GIAO DỊCH */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-xs text-[#7a5a6b] text-center py-8 font-medium">Chưa có giao dịch nạp / rút nào.</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-3.5 bg-white rounded-2xl border border-[#eadfcb] flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-[#28071a]">{tx.id}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          tx.type === 'deposit' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {tx.type === 'deposit' ? 'Nạp Xu' : 'Rút Tiền'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7a5a6b] block mt-1 font-medium">
                        {new Date(tx.createdAt).toLocaleDateString('vi-VN')} {new Date(tx.createdAt).toLocaleTimeString('vi-VN')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-[#28071a] block">
                        {tx.type === 'deposit' ? '+' : '-'}{tx.xuAmount} Xu
                      </span>
                      <div className="flex items-center justify-end space-x-1.5 mt-0.5">
                        <span className={`text-[11px] font-black ${
                          tx.status === 'approved' ? 'text-emerald-700' : tx.status === 'rejected' ? 'text-rose-600' : 'text-amber-600'
                        }`}>
                          {tx.status === 'approved' ? 'Đã duyệt ✅' : tx.status === 'rejected' ? 'Bị từ chối ❌' : 'Chờ duyệt chay ⏳'}
                        </span>

                        {tx.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => {
                              const msg = formatAdminZaloMessage({
                                type: tx.type,
                                code: tx.id,
                                amountXu: tx.xuAmount,
                                amountVnd: tx.amountVnd,
                                userEmail: tx.userEmail,
                                details: tx.details,
                                timestamp: tx.createdAt
                              });
                              openAdminZaloChat(msg);
                            }}
                            className="px-2 py-0.5 bg-[#0068ff]/10 hover:bg-[#0068ff]/20 text-[#0068ff] font-bold text-[10px] rounded-lg border border-[#0068ff]/30 flex items-center space-x-1 transition-colors"
                            title={`Nhắn Zalo ${ADMIN_PHONE} để duyệt ngay`}
                          >
                            <MessageCircle className="w-3 h-3 text-[#0068ff]" />
                            <span>Báo Zalo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
