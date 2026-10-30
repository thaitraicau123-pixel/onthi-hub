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
  getWithdrawableBalance,
  calculateWithdrawalFee,
  createDepositRequest,
  createWithdrawalRequest,
  getTransactions,
  subscribeToTransactions,
  checkAndApplyApprovedTransactions,
  ADMIN_EMAIL,
  ADMIN_PHONE,
  COIN_RATE_VND,
  MIN_WITHDRAW_XU,
  MAX_WITHDRAW_DAILY_XU,
  WITHDRAW_FEE_PERCENT
} from '../utils/wallet';
import { generateVietQRUrl, getBankConfig, playSound } from '../utils/storage';
import { ActionableEmptyState } from '../components/UIStateFeedback';
import confetti from 'canvas-confetti';

export default function WalletView({ user, onBalanceUpdated }) {
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' | 'withdraw' | 'history'
  const [balance, setBalance] = useState(getWalletBalance());
  const [withdrawableBalance, setWithdrawableBalance] = useState(() => getWithdrawableBalance());
  const [transactions, setTransactions] = useState(() => getTransactions());

  // Deposit state
  const [depositXu, setDepositXu] = useState(50);
  const [depositEmail, setDepositEmail] = useState(() => user?.email || '');
  const [depositResult, setDepositResult] = useState(null);
  const [isDepositing, setIsDepositing] = useState(false);

  // Withdraw state (default min 100 Xu)
  const [withdrawXu, setWithdrawXu] = useState(100);
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
    const targetEmail = depositEmail.trim() || user?.email || 'khach_nap@promptmmo.com';
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
    const amount = parseInt(withdrawXu, 10);
    if (isNaN(amount) || amount < MIN_WITHDRAW_XU) {
      setWithdrawMsg({ text: `Số lượng rút tối thiểu phải là ${MIN_WITHDRAW_XU} Xu (${(MIN_WITHDRAW_XU * COIN_RATE_VND).toLocaleString()} VNĐ)!`, isError: true });
      return;
    }
    if (amount > MAX_WITHDRAW_DAILY_XU) {
      setWithdrawMsg({ text: `Hạn mức rút tối đa là ${MAX_WITHDRAW_DAILY_XU} Xu / ngày (${(MAX_WITHDRAW_DAILY_XU * COIN_RATE_VND).toLocaleString()} VNĐ)!`, isError: true });
      return;
    }
    if (balance < amount) {
      setWithdrawMsg({ text: `Số dư ví không đủ! Bạn hiện có ${balance} Xu, cần tối thiểu ${amount} Xu để rút.`, isError: true });
      return;
    }
    if (withdrawableBalance < amount) {
      setWithdrawMsg({
        text: `Số dư Xu đủ điều kiện rút của bạn hiện là ${withdrawableBalance} Xu. Các khoản Xu khuyến mãi (tân thủ 20 Xu, điểm danh, giải thưởng) là Xu nội bộ chỉ dùng để mở khóa các gói Prompt trên web, không quy đổi thành tiền mặt!`,
        isError: true
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      const res = await createWithdrawalRequest({
        xuAmount: amount,
        bankName,
        accountNo: accountNo.trim(),
        accountName: accountName.trim().toUpperCase(),
        userEmail: user?.email || depositEmail || 'creator@promptmmo.com',
        userId: user?.uid || null
      });

      if (res.success) {
        playSound('success');
        setBalance(getWalletBalance());
        setWithdrawableBalance(getWithdrawableBalance());
        if (onBalanceUpdated) onBalanceUpdated();
        setLastWithdrawTx(res);
        setWithdrawMsg({
          text: `🎉 Lệnh rút ${amount} Xu đã tạo thành công! Thực nhận về STK: ${(res.feeInfo?.netVnd || (amount * 900)).toLocaleString()}đ (sau khấu trừ 10% phí sàn ${(res.feeInfo?.feeVnd || (amount * 100)).toLocaleString()}đ). Mã lệnh: ${res.tx.id}. BQT sẽ đối soát và xử lý trong 12h-24h!`,
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
          <span>Ví Xu & Cổng Giao Dịch PromptMMO</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#787774] dark:text-slate-300 font-normal">
          Quản lý số dư Xu cá nhân, nạp tiền tự động qua VietQR mở khóa Prompt & rút doanh thu bán Prompt về ngân hàng.
        </p>
      </div>

      {/* APPLE BALANCE CARD WITH CLEAR CLASSIFICATION */}
      <div className="apple-card rounded-3xl border border-black/[0.06] dark:border-white/[0.08] p-6 sm:p-7 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-1">
            <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>TỔNG SỐ DƯ TÀI KHOẢN</span>
          </div>
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">{balance} Xu</span>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
              ~ {(balance * COIN_RATE_VND).toLocaleString()} VNĐ
            </span>
          </div>
          
          {/* Sub-balances breakdown */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="apple-pill-emerald inline-flex items-center space-x-1.5 px-3 py-1 rounded-full font-bold">
              <span>💵 Đủ ĐK rút tiền:</span>
              <strong className="font-mono">{withdrawableBalance} Xu</strong>
            </span>
            <span className="apple-pill-blue inline-flex items-center space-x-1.5 px-3 py-1 rounded-full font-semibold" title="Xu tặng tân thủ, điểm danh & mở hộp mù">
              <span>🎁 Xu thưởng nội bộ:</span>
              <strong className="font-mono">{Math.max(0, balance - withdrawableBalance)} Xu</strong>
            </span>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2.5 w-full sm:w-auto shrink-0">
          <button
            onClick={() => {
              setActiveTab('deposit');
              setDepositResult(null);
            }}
            className="apple-btn-prominent flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Nạp Thêm Xu</span>
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className="apple-btn-secondary flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
            <span>Rút Tiền Mặt</span>
          </button>
        </div>
      </div>

      {/* TABS CONTAINER (Apple Segmented Styling) */}
      <div className="apple-card rounded-3xl border border-black/[0.06] dark:border-white/[0.08] shadow-sm overflow-hidden">
        
        {/* Tab switch header */}
        <div className="flex border-b border-black/[0.06] dark:border-white/[0.08] px-4 pt-3 bg-black/[0.02] dark:bg-white/[0.02] text-xs font-medium overflow-x-auto scrollbar-none gap-2">
          <button
            onClick={() => {
              setActiveTab('deposit');
              setDepositResult(null);
            }}
            className={`py-2 px-3.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-[0.98] ${
              activeTab === 'deposit'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Nạp Xu (VietQR)</span>
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className={`py-2 px-3.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-[0.98] ${
              activeTab === 'withdraw'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Rút Tiền Về Ngân Hàng</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-3.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-[0.98] ${
              activeTab === 'history'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
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
              {/* POLICY BANNER: ANTI-LOSS & FAIR-USE RULES */}
              <div className="p-4 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 rounded-xl text-xs space-y-2 text-left">
                <div className="flex items-center space-x-2 font-extrabold text-amber-900 dark:text-amber-200">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Quy Chế Rút Tiền Về Ngân Hàng (Chống Lỗ & Chống Gian Lận)</span>
                </div>
                <ul className="text-amber-800 dark:text-amber-300 text-[11px] list-disc list-inside space-y-1">
                  <li>Hạn mức rút: Tối thiểu <strong className="font-bold underline text-amber-900 dark:text-white">{MIN_WITHDRAW_XU} Xu</strong> (= {(MIN_WITHDRAW_XU * COIN_RATE_VND).toLocaleString()}đ), tối đa <strong>{MAX_WITHDRAW_DAILY_XU} Xu / lần / ngày</strong>.</li>
                  <li>Tỷ lệ quy đổi: <strong>1 Xu = 1.000 VNĐ</strong> • Phí nền tảng & xử lý Napas: <strong className="font-bold text-rose-600 dark:text-rose-400">{WITHDRAW_FEE_PERCENT}%</strong> (tối thiểu 5.000đ).</li>
                  <li>Phân loại nguồn Xu: Chỉ áp dụng rút tiền cho <strong>Xu doanh thu bán Prompt C2C</strong> hoặc <strong>Xu nạp thực tế</strong>. Các khoản Xu tặng tân thủ (20 Xu), điểm danh mỗi ngày, giải thưởng là Xu nội bộ chỉ dùng để mở khóa gói Prompt trên web.</li>
                  <li>Thời gian xét duyệt: Ban Quản Trị đối soát và duyệt chuyển khoản thủ công trong <strong>12h - 24h</strong> ngày làm việc.</li>
                </ul>
              </div>

              {withdrawableBalance < MIN_WITHDRAW_XU && (
                <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2.5">
                  <Coins className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p>
                      Số dư Xu đủ điều kiện rút hiện tại của bạn là <strong className="text-amber-600 dark:text-amber-400">{withdrawableBalance} Xu</strong> (yêu cầu tối thiểu <strong>{MIN_WITHDRAW_XU} Xu</strong>).
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      💡 Xu khuyến mãi (tân thủ 20 Xu, điểm danh, mở hộp mù, giải đấu) là Xu nội bộ. Hãy chia sẻ và bán thêm gói Prompt trên Chợ C2C để tích lũy Xu doanh thu có thể rút!
                    </p>
                  </div>
                </div>
              )}

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
                      Đang chờ duyệt
                    </span>
                  </div>

                  <p className="text-[#787774] dark:text-slate-300 text-xs leading-relaxed">
                    Mã giao dịch: <strong className="font-mono text-[#37352f] dark:text-white">{lastWithdrawTx.tx.id}</strong>. Số tiền thực nhận: <strong className="text-emerald-700 dark:text-emerald-400">{(lastWithdrawTx.feeInfo?.netVnd || (lastWithdrawTx.tx.xuAmount * 900)).toLocaleString()} VNĐ</strong> (đã khấu trừ 10% phí sàn). BQT sẽ xử lý trong 12h-24h!
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-[#37352f] dark:text-slate-200">
                      Số lượng Xu muốn rút (Tối thiểu {MIN_WITHDRAW_XU} Xu, Tối đa {MAX_WITHDRAW_DAILY_XU} Xu):
                    </label>
                    <span className="text-[11px] text-[#787774] dark:text-slate-400">
                      Được rút: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{withdrawableBalance} Xu</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="number"
                      min={MIN_WITHDRAW_XU}
                      max={Math.min(MAX_WITHDRAW_DAILY_XU, withdrawableBalance)}
                      value={withdrawXu}
                      onChange={(e) => setWithdrawXu(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:border-[#2383e2] dark:focus:border-sky-400 font-bold bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-[#37352f] dark:text-white transition-colors"
                      required
                    />
                    <span className="text-[#787774] dark:text-slate-300 shrink-0 text-xs font-semibold">
                      = {((Number(withdrawXu) || 0) * COIN_RATE_VND).toLocaleString()} VNĐ
                    </span>
                  </div>

                  {/* REALTIME FEE & NET PAYOUT CARD */}
                  {Number(withdrawXu) > 0 && (() => {
                    const feeInfo = calculateWithdrawalFee(withdrawXu);
                    return (
                      <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-white/10 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span>Số Xu yêu cầu rút:</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {Number(withdrawXu)} Xu (= {feeInfo.grossVnd.toLocaleString()}đ)
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span>Phí nền tảng & xử lý Napas (10%):</span>
                          <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                            -{feeInfo.feeVnd.toLocaleString()}đ
                          </span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between font-extrabold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                          <span>Số tiền thực nhận chuyển về tài khoản:</span>
                          <span className="font-mono text-sm sm:text-base">
                            {feeInfo.netVnd.toLocaleString()} VNĐ
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* QUICK SELECT PILLS */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {[100, 200, 300, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setWithdrawXu(amt)}
                        disabled={withdrawableBalance < amt}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
                          Number(withdrawXu) === amt
                            ? 'bg-[#2383e2] text-white border-[#2383e2]'
                            : 'bg-[#f7f6f5] dark:bg-slate-800 text-[#37352f] dark:text-slate-200 border-[#e9e9e8] dark:border-white/10 hover:bg-[#ebeae8] dark:hover:bg-slate-700'
                        }`}
                      >
                        {amt} Xu ({amt}k)
                      </button>
                    ))}
                    {withdrawableBalance >= MIN_WITHDRAW_XU && (
                      <button
                        type="button"
                        onClick={() => setWithdrawXu(Math.min(MAX_WITHDRAW_DAILY_XU, withdrawableBalance))}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors cursor-pointer ${
                          Number(withdrawXu) === Math.min(MAX_WITHDRAW_DAILY_XU, withdrawableBalance)
                            ? 'bg-[#2383e2] text-white border-[#2383e2]'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-100'
                        }`}
                      >
                        Rút Hết Đủ ĐK ({Math.min(MAX_WITHDRAW_DAILY_XU, withdrawableBalance)} Xu)
                      </button>
                    )}
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
                    disabled={withdrawableBalance < MIN_WITHDRAW_XU || Number(withdrawXu) < MIN_WITHDRAW_XU || Number(withdrawXu) > MAX_WITHDRAW_DAILY_XU || isWithdrawing}
                    className="w-full py-2.5 bg-[#2383e2] hover:bg-[#1a73e8] text-white rounded-xl font-bold shadow-2xs flex items-center justify-center space-x-1.5 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{isWithdrawing ? 'Đang tạo lệnh...' : `Xác nhận rút ${Number(withdrawXu) || 0} Xu (Thực nhận ${calculateWithdrawalFee(withdrawXu).netVnd.toLocaleString()}đ)`}</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#787774] dark:text-slate-400 text-center font-normal">
                  Hạn mức: {MIN_WITHDRAW_XU} - {MAX_WITHDRAW_DAILY_XU} Xu/ngày • Phí nền tảng {WITHDRAW_FEE_PERCENT}% • Admin đối soát & duyệt chuyển khoản trong 12h - 24h.
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
