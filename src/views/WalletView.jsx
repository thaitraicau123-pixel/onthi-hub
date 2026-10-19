import React, { useState, useEffect } from 'react';
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
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import {
  getWalletBalance,
  createDepositRequest,
  createWithdrawalRequest,
  getTransactions,
  subscribeToTransactions,
  checkAndApplyApprovedTransactions,
  ADMIN_EMAIL,
  ADMIN_PHONE,
  COIN_RATE_VND
} from '../utils/wallet';
import { generateVietQRUrl, getBankConfig, playSound } from '../utils/storage';
import { ActionableEmptyState } from '../components/UIStateFeedback';
import confetti from 'canvas-confetti';

export default function WalletView({ user, onBalanceUpdated }) {
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' | 'withdraw' | 'history'
  const [balance, setBalance] = useState(getWalletBalance());
  const [transactions, setTransactions] = useState(() => getTransactions());

  // Deposit state
  const [depositXu, setDepositXu] = useState(50);
  const [depositEmail, setDepositEmail] = useState(() => user?.email || '');
  const [depositResult, setDepositResult] = useState(null);
  const [isDepositing, setIsDepositing] = useState(false);

  // Withdraw state
  const [withdrawXu, setWithdrawXu] = useState(20);
  const [bankName, setBankName] = useState('MB Bank');
  const [accountNo, setAccountNo] = useState('');
  const [accountName, setAccountName] = useState('');
  const [withdrawMsg, setWithdrawMsg] = useState({ text: '', isError: false });
  const [lastWithdrawTx, setLastWithdrawTx] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const bankConfig = getBankConfig();

  // Listen to Firestore & Cloud Relay transactions in real-time
  useEffect(() => {
    const unsub = subscribeToTransactions((latestTxs) => {
      setTransactions(latestTxs);
      const res = checkAndApplyApprovedTransactions(depositEmail || user?.email);
      if (res.newlyCreditedCoins > 0) {
        const nextBal = getWalletBalance();
        setBalance(nextBal);
        if (onBalanceUpdated) onBalanceUpdated();
        playSound('success');
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [user, depositEmail, onBalanceUpdated]);

  const handleCreateDeposit = async () => {
    setIsDepositing(true);
    const targetEmail = depositEmail.trim() || user?.email || 'khach_nap@onthihub.vn';
    try {
      const res = await createDepositRequest({
        xuAmount: depositXu,
        userEmail: targetEmail,
        userId: user?.uid || null
      });
      setDepositResult(res);
      playSound('flip');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleCreateWithdrawal = async (e) => {
    e.preventDefault();
    if (!accountNo.trim() || !accountName.trim()) {
      setWithdrawMsg({ text: 'Vui lòng điền đầy đủ số tài khoản và tên chủ thẻ!', isError: true });
      return;
    }
    if (withdrawXu < 10) {
      setWithdrawMsg({ text: 'Số lượng rút tối thiểu là 10 Xu (10.000 VNĐ)!', isError: true });
      return;
    }

    setIsWithdrawing(true);
    try {
      const res = await createWithdrawalRequest({
        xuAmount: parseInt(withdrawXu, 10),
        bankName,
        accountNo: accountNo.trim(),
        accountName: accountName.trim().toUpperCase(),
        userEmail: user?.email || depositEmail || 'creator@onthihub.vn',
        userId: user?.uid || null
      });

      if (res.success) {
        playSound('success');
        setBalance(getWalletBalance());
        if (onBalanceUpdated) onBalanceUpdated();
        setLastWithdrawTx(res);
        setWithdrawMsg({
          text: `🎉 Lệnh rút ${withdrawXu} Xu (${(withdrawXu * COIN_RATE_VND).toLocaleString()}đ) đã tạo thành công! Mã lệnh: ${res.tx.id}. Hệ thống đã gửi thông báo tự động đến Admin để xử lý chuyển tiền về tài khoản.`,
          isError: false
        });
        setAccountNo('');
        setAccountName('');
      } else {
        setWithdrawMsg({ text: res.message, isError: true });
      }
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16 text-[#37352f] dark:text-[#f8fafc]">
      
      {/* NOTION PAGE HEADER */}
      <div className="space-y-2 pb-3 border-b border-[#e9e9e8] dark:border-white/10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37352f] dark:text-white tracking-tight flex items-center gap-2.5">
          <span>🪙</span>
          <span>Ví Xu & Giao Dịch</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#787774] dark:text-slate-300 font-normal">
          Quản lý số dư Xu cá nhân, nạp tiền tự động qua VietQR và rút doanh thu bán bộ thẻ.
        </p>
      </div>

      {/* NOTION BALANCE CARD */}
      <div className="bg-white/95 dark:bg-slate-900/90 rounded-2xl border border-[#e9e9e8] dark:border-white/15 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-[#787774] dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>SỐ DƯ KHẢ DỤNG</span>
          </div>
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#37352f] dark:text-white">{balance} Xu</span>
            <span className="text-xs sm:text-sm text-[#787774] dark:text-slate-300 font-medium">
              ~ {(balance * COIN_RATE_VND).toLocaleString()} VNĐ
            </span>
          </div>
          <p className="mt-1.5 text-xs text-[#787774] dark:text-slate-300 max-w-sm">
            1 Xu = 1.000 VNĐ. Dùng để mở khóa bộ thẻ, mua sắm trên Sàn C2C hoặc nâng cấp tài khoản.
          </p>
        </div>

        <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={() => {
              setActiveTab('deposit');
              setDepositResult(null);
            }}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-bold shadow-2xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Nạp Thêm Xu</span>
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 text-[#37352f] dark:text-white border border-[#e9e9e8] dark:border-white/15 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-[#787774] dark:text-slate-300" />
            <span>Rút Tiền Mặt</span>
          </button>
        </div>
      </div>

      {/* TABS CONTAINER (Notion Workspace Container) */}
      <div className="bg-white/95 dark:bg-slate-900/90 rounded-2xl border border-[#e9e9e8] dark:border-white/15 shadow-2xs overflow-hidden">
        
        {/* Tab switch header */}
        <div className="flex border-b border-[#e9e9e8] dark:border-white/10 px-4 pt-2 bg-[#fbfbfa] dark:bg-slate-800/70 text-xs font-medium overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('deposit');
              setDepositResult(null);
            }}
            className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'deposit'
                ? 'border-[#2383e2] dark:border-sky-400 text-[#2383e2] dark:text-sky-400 font-bold'
                : 'border-transparent text-[#787774] dark:text-slate-400 hover:text-[#37352f] dark:hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Nạp Xu (VietQR)</span>
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'withdraw'
                ? 'border-[#2383e2] dark:border-sky-400 text-[#2383e2] dark:text-sky-400 font-bold'
                : 'border-transparent text-[#787774] dark:text-slate-400 hover:text-[#37352f] dark:hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Rút Tiền Về Ngân Hàng</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-[#2383e2] dark:border-sky-400 text-[#2383e2] dark:text-sky-400 font-bold'
                : 'border-transparent text-[#787774] dark:text-slate-400 hover:text-[#37352f] dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Lịch Sử ({transactions.length})</span>
          </button>
        </div>

        {/* Tab content */}
        <div className="p-5 sm:p-6">
          
          {/* TAB 1: NẠP XU */}
          {activeTab === 'deposit' && (
            <div>
              {!depositResult ? (
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-[#37352f] dark:text-slate-200 block mb-2.5">
                      Chọn gói Xu muốn nạp qua ngân hàng:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[20, 50, 100, 200].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setDepositXu(num)}
                          className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                            depositXu === num
                              ? 'border-[#2383e2] dark:border-sky-400 bg-[#e7f3f8] dark:bg-sky-950/80 text-[#2b7aa1] dark:text-sky-300 font-bold ring-1 ring-[#2383e2] dark:ring-sky-400'
                              : 'border-[#e9e9e8] dark:border-white/15 bg-[#fbfbfa] dark:bg-slate-800/80 hover:bg-[#f7f6f5] dark:hover:bg-slate-800 text-[#37352f] dark:text-white'
                          }`}
                        >
                          <span className="text-base font-extrabold block">{num} Xu</span>
                          <span className="text-xs text-[#787774] dark:text-slate-300">{(num * 1000).toLocaleString()}đ</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#fbfbfa] dark:bg-slate-800/80 rounded-xl border border-[#e9e9e8] dark:border-white/10 text-xs text-[#37352f] dark:text-slate-200 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#787774] dark:text-slate-300">Số lượng Xu nhận được:</span>
                      <strong className="text-[#2383e2] dark:text-sky-400 font-bold">{depositXu} Xu</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#787774] dark:text-slate-300">Số tiền thanh toán VietQR:</span>
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{(depositXu * COIN_RATE_VND).toLocaleString()}đ</strong>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#37352f] dark:text-slate-200 block mb-1.5">
                      Email / Số điện thoại nhận Xu:
                    </label>
                    <input
                      type="text"
                      value={depositEmail}
                      onChange={(e) => setDepositEmail(e.target.value)}
                      placeholder="VD: hocsinh@gmail.com hoặc 098xxxxxxx"
                      className="w-full px-3 py-2 rounded-lg border border-[#e9e9e8] dark:border-white/15 bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-xs text-[#37352f] dark:text-white outline-none focus:border-[#2383e2] dark:focus:border-sky-400 transition-colors placeholder:text-[#9b9a97] dark:placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    onClick={handleCreateDeposit}
                    disabled={isDepositing}
                    className="w-full py-2.5 bg-[#2383e2] hover:bg-[#1a73e8] text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isDepositing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                    <span>{isDepositing ? 'Đang tạo lệnh...' : 'Tạo Lệnh Nạp & Quét Mã VietQR'}</span>
                  </button>

                  <p className="text-xs text-[#787774] dark:text-slate-400 text-center font-normal">
                    Sau khi quét mã, lệnh sẽ tự động đồng bộ lên Firebase và gửi thông báo tới <strong className="text-[#37352f] dark:text-slate-200">{ADMIN_EMAIL}</strong> để duyệt.
                  </p>
                </div>
              ) : (
                (() => {
                  const liveTx = transactions.find((t) => t.id === depositResult.tx.id) || depositResult.tx;
                  const isApproved = liveTx.status === 'approved';
                  return (
                    <div className="text-center space-y-4">
                      {isApproved ? (
                        <div className="p-4 bg-[#edf3ec] dark:bg-emerald-950/60 border border-[#d3e5d2] dark:border-emerald-500/40 rounded-xl text-emerald-950 dark:text-emerald-200 text-center space-y-1 animate-fade-in">
                          <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mx-auto" />
                          <h4 className="font-bold text-xs sm:text-sm">GIAO DỊCH ĐÃ ĐƯỢC ADMIN PHÊ DUYỆT!</h4>
                          <p className="text-xs text-emerald-800 dark:text-emerald-300">
                            Đã cộng +{liveTx.xuAmount} Xu vào ví của bạn. Số dư hiện tại: {balance} Xu.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 text-xs font-bold">
                            Lệnh Nạp: {depositResult.tx.id}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 text-xs font-bold flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                            <span>Đang chờ Admin duyệt</span>
                          </span>
                        </div>
                      )}

                      <div className="p-3 bg-white rounded-xl border border-[#e9e9e8] dark:border-white/15 inline-block shadow-2xs">
                        <img
                          src={generateVietQRUrl({
                            bank: bankConfig.bank,
                            accountNo: bankConfig.accountNo,
                            accountName: bankConfig.accountName,
                            amount: depositResult.tx.amountVnd,
                            memo: depositResult.tx.id
                          })}
                          alt="VietQR Deposit"
                          className="w-48 h-48 mx-auto object-contain bg-white p-1 rounded-lg"
                        />
                      </div>

                      <div className="text-xs sm:text-sm text-[#37352f] dark:text-slate-200 space-y-1">
                        <p>
                          Số tiền chuyển: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{depositResult.tx.amountVnd.toLocaleString()}đ</strong>
                        </p>
                        <p>
                          Nội dung chuyển khoản: <strong className="font-mono text-[#2383e2] dark:text-sky-300 bg-[#e7f3f8] dark:bg-sky-950/80 px-2 py-0.5 rounded border border-[#bfe1f1] dark:border-sky-500/40">{depositResult.tx.id}</strong>
                        </p>
                      </div>

                      <div className="bg-[#fbfbfa] dark:bg-slate-800/80 border border-[#e9e9e8] dark:border-white/10 rounded-xl p-3.5 text-xs space-y-1.5 text-left max-w-md mx-auto">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                            ✓
                          </span>
                          <strong className="text-[#37352f] dark:text-white text-xs">
                            Đã đồng bộ lên Firebase Realtime
                          </strong>
                        </div>

                        <p className="text-[#787774] dark:text-slate-300 leading-relaxed">
                          Bạn chỉ cần chuyển khoản đúng số tiền và nội dung <strong className="text-[#37352f] dark:text-white">{depositResult.tx.id}</strong> ở trên. Hệ thống sẽ tự động cộng Xu vào ví ngay khi xác nhận!
                        </p>
                      </div>

                      <button
                        onClick={() => setDepositResult(null)}
                        className="text-xs text-[#2383e2] dark:text-sky-400 hover:underline font-semibold cursor-pointer"
                      >
                        Quay lại chọn gói nạp khác
                      </button>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* TAB 2: RÚT TIỀN */}
          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              {lastWithdrawTx && (
                <div className="p-3.5 bg-[#edf3ec] dark:bg-emerald-950/50 border border-[#d3e5d2] dark:border-emerald-500/40 rounded-xl text-xs space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        ✓
                      </span>
                      <strong className="text-[#37352f] dark:text-white text-xs">
                        Đã tạo lệnh rút tiền thành công
                      </strong>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                      Đang xử lý
                    </span>
                  </div>

                  <p className="text-[#787774] dark:text-slate-300 text-xs leading-relaxed">
                    Mã giao dịch: <strong className="font-mono text-[#37352f] dark:text-white">{lastWithdrawTx.tx.id}</strong>. Tiền sẽ được chuyển về tài khoản ngân hàng của bạn trong ít phút!
                  </p>
                </div>
              )}

              <form onSubmit={handleCreateWithdrawal} className="space-y-3.5 text-xs text-[#37352f] dark:text-white">
                {withdrawMsg.text && (
                  <div className={`p-3 rounded-lg border font-medium ${
                    withdrawMsg.isError
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300'
                      : 'bg-[#edf3ec] dark:bg-emerald-950/50 border-[#d3e5d2] dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                  }`}>
                    {withdrawMsg.text}
                  </div>
                )}

                <div>
                  <label className="font-semibold text-[#37352f] dark:text-slate-200 block mb-1">
                    Số lượng Xu muốn rút (Khả dụng: {balance} Xu):
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="10"
                      max={balance}
                      value={withdrawXu}
                      onChange={(e) => setWithdrawXu(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:border-[#2383e2] dark:focus:border-sky-400 font-bold bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-[#37352f] dark:text-white transition-colors"
                      required
                    />
                    <span className="text-[#787774] dark:text-slate-300 shrink-0 text-xs font-semibold">
                      = {(withdrawXu * COIN_RATE_VND).toLocaleString()} VNĐ
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#37352f] dark:text-slate-200 block mb-1">Ngân hàng nhận tiền:</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:border-[#2383e2] dark:focus:border-sky-400 text-xs bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 text-[#37352f] dark:text-white font-semibold transition-colors cursor-pointer"
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
                  <label className="font-semibold text-[#37352f] dark:text-slate-200 block mb-1">Số tài khoản ngân hàng:</label>
                  <input
                    type="text"
                    placeholder="Nhập số tài khoản..."
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:border-[#2383e2] dark:focus:border-sky-400 font-mono text-xs bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-[#37352f] dark:text-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#37352f] dark:text-slate-200 block mb-1">Tên chủ tài khoản (in hoa):</label>
                  <input
                    type="text"
                    placeholder="VD: NGUYEN VAN A"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:border-[#2383e2] dark:focus:border-sky-400 font-mono uppercase text-xs bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-[#37352f] dark:text-white transition-colors"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={balance < 10 || isWithdrawing}
                    className="w-full py-2.5 bg-[#2383e2] hover:bg-[#1a73e8] text-white rounded-xl font-bold shadow-2xs flex items-center justify-center space-x-1.5 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{isWithdrawing ? 'Đang tạo lệnh...' : 'Xác nhận rút tiền về tài khoản'}</span>
                  </button>
                </div>

                <p className="text-xs text-[#787774] dark:text-slate-400 text-center font-normal">
                  Hệ thống xử lý duyệt và chuyển khoản 24/7.
                </p>
              </form>
            </div>
          )}

          {/* TAB 3: LỊCH SỬ GIAO DỊCH */}
          {activeTab === 'history' && (
            <div className="space-y-2.5">
              {transactions.length === 0 ? (
                <ActionableEmptyState
                  icon={Clock}
                  badge="LỊCH SỬ GIAO DỊCH"
                  title="Chưa có giao dịch nạp hoặc rút Xu nào"
                  description="Mọi biến động số dư khi nạp tiền qua VietQR, rút tiền về tài khoản hoặc nhận thưởng nhiệm vụ sẽ được lưu vết minh bạch tại đây."
                  primaryAction={{
                    label: 'Nạp Xu Vào Ví Ngay',
                    onClick: () => setActiveTab('deposit'),
                    icon: ArrowDownLeft
                  }}
                />
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-3.5 bg-[#fbfbfa] dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-[#e9e9e8] dark:border-white/10 flex items-center justify-between text-xs transition-colors">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#37352f] dark:text-white font-mono">{tx.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'deposit'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
                            : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40'
                        }`}>
                          {tx.type === 'deposit' ? 'Nạp Xu' : 'Rút Tiền'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#787774] dark:text-slate-400 block mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString('vi-VN')} {new Date(tx.createdAt).toLocaleTimeString('vi-VN')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-[#37352f] dark:text-white block">
                        {tx.type === 'deposit' ? '+' : '-'}{tx.xuAmount} Xu
                      </span>
                      <div className="flex items-center justify-end space-x-1.5 mt-0.5">
                        <span className={`text-[11px] font-semibold ${
                          tx.status === 'approved' ? 'text-emerald-700 dark:text-emerald-400' : tx.status === 'rejected' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {tx.status === 'approved' ? 'Đã duyệt ✅' : tx.status === 'rejected' ? 'Bị từ chối ❌' : 'Chờ duyệt ⏳'}
                        </span>
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
