import React, { useState } from 'react';
import {
  X,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Mail,
  QrCode
} from 'lucide-react';
import {
  getWalletBalance,
  getWithdrawableBalance,
  createDepositRequest,
  createWithdrawalRequest,
  getTransactions,
  ADMIN_EMAIL,
  COIN_RATE_VND,
  MIN_WITHDRAW_XU,
  MAX_WITHDRAW_DAILY_XU,
  WITHDRAW_FEE_PERCENT,
  calculateWithdrawalFee
} from '../utils/wallet';
import { generateVietQRUrl, getBankConfig, playSound } from '../utils/storage';
import { useModalDismiss } from '../hooks/useModalDismiss';

export default function WalletModal({ user, onClose, onBalanceUpdated }) {
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' | 'withdraw' | 'history'
  const [balance, setBalance] = useState(getWalletBalance());
  const [withdrawableBalance, setWithdrawableBalanceState] = useState(getWithdrawableBalance());
  
  // Deposit state
  const [depositXu, setDepositXu] = useState(50);
  const [depositResult, setDepositResult] = useState(null);

  // Withdraw state
  const [withdrawXu, setWithdrawXu] = useState(MIN_WITHDRAW_XU);
  const [bankName, setBankName] = useState('MB Bank');
  const [accountNo, setAccountNo] = useState('');
  const [accountName, setAccountName] = useState('');
  const [withdrawMsg, setWithdrawMsg] = useState({ text: '', isError: false });

  const bankConfig = getBankConfig();
  const transactions = getTransactions();
  const withdrawNum = parseInt(withdrawXu, 10) || 0;
  const feeCalc = calculateWithdrawalFee(withdrawNum);
  const bonusCoins = Math.max(0, balance - withdrawableBalance);

  // Create Deposit Request
  const handleCreateDeposit = async () => {
    const { tx, emailData } = await createDepositRequest({
      xuAmount: depositXu,
      userEmail: user?.email || 'khach_nap@onthihub.vn',
      userId: user?.uid || null
    });
    setDepositResult({ tx, emailData });
    playSound('flip');
  };

  // Create Withdrawal Request
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
      setWithdrawMsg({ text: `Hạn mức rút tối đa mỗi ngày là ${MAX_WITHDRAW_DAILY_XU} Xu (${(MAX_WITHDRAW_DAILY_XU * COIN_RATE_VND).toLocaleString()} VNĐ)!`, isError: true });
      return;
    }
    if (withdrawableBalance < amount) {
      setWithdrawMsg({ text: `Số dư rút được không đủ! Bạn hiện có ${withdrawableBalance} Xu có thể rút (từ bán tài liệu C2C hoặc tiền nạp). ${bonusCoins > 0 ? `${bonusCoins} Xu còn lại là Xu học tập nội bộ chỉ dùng trên web.` : ''}`, isError: true });
      return;
    }

    const res = await createWithdrawalRequest({
      xuAmount: amount,
      bankName,
      accountNo: accountNo.trim(),
      accountName: accountName.trim().toUpperCase(),
      userEmail: user?.email || 'creator@onthihub.vn',
      userId: user?.uid || null
    });

    if (res.success) {
      playSound('success');
      setBalance(getWalletBalance());
      setWithdrawableBalanceState(getWithdrawableBalance());
      if (typeof onBalanceUpdated === 'function') onBalanceUpdated();
      setWithdrawMsg({
        text: `🎉 Lệnh rút ${amount} Xu đã được tạo thành công! Mã: ${res.tx.id}. Thực nhận: ${res.tx.netAmountVnd?.toLocaleString() || (amount * COIN_RATE_VND).toLocaleString()}đ (sau phí vận hành). Thông báo đã được gửi tự động đến Admin để đối soát & chuyển khoản.`,
        isError: false
      });
      setAccountNo('');
      setAccountName('');
    } else {
      setWithdrawMsg({ text: res.message, isError: true });
    }
  };

  // Close on Escape key
  useModalDismiss(onClose);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto cursor-pointer"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-200 cursor-default"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Ví Xu ÔnThiHub
              </h4>
              <p className="text-[11px] text-slate-500">
                1 Xu = 1.000 VNĐ • Dùng mua bán trên Sàn và nâng cấp gói
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg border border-slate-200 bg-white transition-colors cursor-pointer"
            title="Đóng (hoặc nhấn Esc, bấm ra ngoài)"
          >
            <span>Đóng</span>
            <kbd className="hidden sm:inline text-[10px] font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-500">Esc</kbd>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-amber-100 uppercase tracking-wider block">
                Tổng Số Dư Trong Ví:
              </span>
              <div className="mt-1 flex items-baseline space-x-2">
                <span className="text-3xl sm:text-4xl font-black">{balance} Xu</span>
                <span className="text-xs text-amber-100 font-medium">
                  ~ {(balance * COIN_RATE_VND).toLocaleString()} VNĐ
                </span>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-xs space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-amber-100">Khả dụng rút về:</span>
                <strong className="text-white font-black text-sm">{withdrawableBalance} Xu</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-amber-200/80">Xu học tập (nội bộ):</span>
                <span className="text-amber-200 font-semibold">{bonusCoins} Xu</span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-amber-100">
            Xu rút được tích lũy từ doanh thu bán tài liệu trên Sàn C2C & nạp tiền thực tế.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('deposit');
              setDepositResult(null);
            }}
            className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center space-x-1.5 transition-colors ${
              activeTab === 'deposit'
                ? 'border-amber-500 text-amber-700 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nạp Xu (VietQR)</span>
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center space-x-1.5 transition-colors ${
              activeTab === 'withdraw'
                ? 'border-amber-500 text-amber-700 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
            <span>Rút Tiền Về Ngân Hàng</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center space-x-1.5 transition-colors ${
              activeTab === 'history'
                ? 'border-amber-500 text-amber-700 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Lịch Sử ({transactions.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: NẠP XU */}
          {activeTab === 'deposit' && (
            <div>
              {!depositResult ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-2">
                      Chọn gói Xu muốn nạp:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[20, 50, 100, 200].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setDepositXu(num)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            depositXu === num
                              ? 'border-amber-500 bg-amber-50 text-amber-900 font-black ring-1 ring-amber-500'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span className="text-sm font-bold block">{num} Xu</span>
                          <span className="text-[10px] text-slate-400">{(num * 1000).toLocaleString()}đ</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Số lượng Xu nhận:</span>
                      <strong className="text-amber-700">{depositXu} Xu</strong>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Số tiền chuyển khoản:</span>
                      <strong className="text-emerald-600">{(depositXu * COIN_RATE_VND).toLocaleString()}đ</strong>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateDeposit}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Tạo Lệnh Nạp & Quét VietQR</span>
                  </button>

                  <p className="text-[11px] text-slate-400 text-center">
                    Sau khi quét mã, yêu cầu nạp sẽ tự động thông báo tới <strong>{ADMIN_EMAIL}</strong> để duyệt.
                  </p>
                </div>
              ) : (
                /* QR Code Display for Deposit */
                <div className="text-center space-y-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Lệnh Nạp: {depositResult.tx.id}
                  </span>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
                    <img
                      src={generateVietQRUrl({
                        bank: bankConfig.bank,
                        accountNo: bankConfig.accountNo,
                        accountName: bankConfig.accountName,
                        amount: depositResult.tx.amountVnd,
                        memo: depositResult.tx.id
                      })}
                      alt="VietQR Deposit"
                      className="w-44 h-44 mx-auto object-contain bg-white p-2 rounded-xl"
                    />
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <p>Số tiền: <strong className="text-emerald-600 font-bold">{depositResult.tx.amountVnd.toLocaleString()}đ</strong></p>
                    <p>Nội dung CK: <strong className="text-amber-900 font-mono font-bold bg-amber-100 px-2 py-0.5 rounded">{depositResult.tx.id}</strong></p>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 space-y-2 text-left">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        Hệ thống đã gửi thông báo tự động tới Admin qua Web Push & Email. Bạn hãy chuyển khoản đúng nội dung trên, Xu sẽ được cộng ngay sau khi Admin duyệt.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setDepositResult(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-semibold"
                  >
                    Tạo lệnh nạp khác
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RÚT TIỀN */}
          {activeTab === 'withdraw' && (
            <form onSubmit={handleCreateWithdrawal} className="space-y-3 text-xs">
              {withdrawMsg.text && (
                <div className={`p-3 rounded-xl border text-xs font-semibold ${
                  withdrawMsg.isError
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  {withdrawMsg.text}
                </div>
              )}

              {/* POLICY NOTE */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
                <p className="font-bold">⚡ Quy định rút tiền bảo vệ nền tảng:</p>
                <p>• Hạn mức rút: Tối thiểu <strong>{MIN_WITHDRAW_XU} Xu</strong> ({(MIN_WITHDRAW_XU * COIN_RATE_VND).toLocaleString()}đ), tối đa <strong>{MAX_WITHDRAW_DAILY_XU} Xu</strong>/ngày.</p>
                <p>• Phí nền tảng & vận hành: <strong>{WITHDRAW_FEE_PERCENT}%</strong> (tối thiểu 5.000đ) để chi trả chi phí chuyển khoản và duy trì máy chủ.</p>
                <p>• Nguồn rút: Chỉ rút Xu từ doanh thu bán tài liệu C2C hoặc số dư nạp. Xu thưởng thi đấu & khuyến mãi là Xu học tập nội bộ.</p>
              </div>

              {withdrawableBalance < MIN_WITHDRAW_XU && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800">
                  Số dư khả dụng để rút hiện tại của bạn là <strong>{withdrawableBalance} Xu</strong>. Bạn cần đạt tối thiểu <strong>{MIN_WITHDRAW_XU} Xu</strong> từ doanh thu bán tài liệu để yêu cầu rút tiền.
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">
                    Số lượng Xu muốn rút (Tối thiểu {MIN_WITHDRAW_XU} - Tối đa {MAX_WITHDRAW_DAILY_XU} Xu):
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Rút được: <strong className="text-amber-700 font-bold">{withdrawableBalance} Xu</strong>
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="number"
                    min={MIN_WITHDRAW_XU}
                    max={Math.min(withdrawableBalance, MAX_WITHDRAW_DAILY_XU)}
                    value={withdrawXu}
                    onChange={(e) => setWithdrawXu(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-amber-500 font-bold"
                    required
                  />
                  <span className="font-bold text-slate-500 shrink-0 text-xs">
                    = {((Number(withdrawXu) || 0) * COIN_RATE_VND).toLocaleString()} VNĐ
                  </span>
                </div>

                {/* Realtime Fee Breakdown Card */}
                {withdrawNum >= MIN_WITHDRAW_XU && (
                  <div className="mb-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Số tiền quy đổi:</span>
                      <span>{feeCalc.grossAmountVnd.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-rose-600">
                      <span>Phí sàn & đối soát ({WITHDRAW_FEE_PERCENT}%):</span>
                      <span>-{feeCalc.feeAmountVnd.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-slate-200 text-xs">
                      <span>Thực nhận về tài khoản ngân hàng:</span>
                      <span>{feeCalc.netAmountVnd.toLocaleString()} VNĐ</span>
                    </div>
                  </div>
                )}

                {/* Quick pills */}
                <div className="flex flex-wrap gap-1.5">
                  {[100, 200, 300, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWithdrawXu(amt)}
                      disabled={withdrawableBalance < amt}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
                        Number(withdrawXu) === amt
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {amt} Xu ({amt}k)
                    </button>
                  ))}
                  {withdrawableBalance >= MIN_WITHDRAW_XU && (
                    <button
                      type="button"
                      onClick={() => setWithdrawXu(Math.min(withdrawableBalance, MAX_WITHDRAW_DAILY_XU))}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                        Number(withdrawXu) === Math.min(withdrawableBalance, MAX_WITHDRAW_DAILY_XU)
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      Rút Tối Đa ({Math.min(withdrawableBalance, MAX_WITHDRAW_DAILY_XU)} Xu)
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ngân hàng thụ hưởng:</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-amber-500"
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
                <label className="font-semibold text-slate-700 block mb-1">Số tài khoản ngân hàng:</label>
                <input
                  type="text"
                  placeholder="Nhập số tài khoản..."
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên chủ tài khoản (in hoa):</label>
                <input
                  type="text"
                  placeholder="VD: NGUYEN VAN A"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-amber-500 font-mono uppercase"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={withdrawableBalance < MIN_WITHDRAW_XU || Number(withdrawXu) < MIN_WITHDRAW_XU || Number(withdrawXu) > MAX_WITHDRAW_DAILY_XU || Number(withdrawXu) > withdrawableBalance}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>
                    Xác Nhận Rút {Number(withdrawXu) || 0} Xu (Thực nhận: {feeCalc.netAmountVnd.toLocaleString()}đ)
                  </span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Lệnh rút tối thiểu {MIN_WITHDRAW_XU} Xu. Hệ thống thông báo tự động đến Admin để đối soát & chuyển khoản 24/7.
              </p>
            </form>
          )}

          {/* TAB 3: LỊCH SỬ GIAO DỊCH */}
          {activeTab === 'history' && (
            <div className="space-y-2.5">
              {transactions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Chưa có giao dịch nào.</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-800">{tx.id}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          tx.type === 'deposit' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {tx.type === 'deposit' ? 'Nạp Xu' : 'Rút Tiền'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString('vi-VN')} {new Date(tx.createdAt).toLocaleTimeString('vi-VN')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-slate-900 block">
                        {tx.type === 'deposit' ? '+' : '-'}{tx.xuAmount} Xu
                      </span>
                      <span className={`text-[10px] font-bold ${
                        tx.status === 'approved' ? 'text-emerald-600' : tx.status === 'rejected' ? 'text-rose-600' : 'text-amber-600'
                      }`}>
                        {tx.status === 'approved' ? 'Đã duyệt ✅' : tx.status === 'rejected' ? 'Bị từ chối ❌' : 'Chờ duyệt chay ⏳'}
                      </span>
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
