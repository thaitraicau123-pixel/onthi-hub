import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  LogIn,
  Sparkles,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  KeyRound,
  Coins
} from 'lucide-react';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  sendPasswordReset,
  logoutUser,
  isRealFirebaseConfigured
} from '../utils/firebaseConfig';
import { getUserTier } from '../utils/userTier';
import { getWalletBalance } from '../utils/wallet';
import { playSound } from '../utils/storage';

export default function AuthModal({ user, onAuthChange, onClose, onOpenPricing, onOpenWallet }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isRealFirebase = isRealFirebaseConfigured();
  const currentTier = getUserTier();
  const walletBalance = getWalletBalance();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      let res;
      if (mode === 'register') {
        res = await registerWithEmail(email, password, displayName);
      } else {
        res = await loginWithEmail(email, password);
      }

      if (res.success) {
        playSound('success');
        onAuthChange(res.user);
        onClose();
      } else {
        setErrorMsg(res.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Có lỗi xảy ra trong quá trình xác thực.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        playSound('success');
        onAuthChange(res.user);
        onClose();
      } else {
        setErrorMsg(res.message || 'Đăng nhập Google thất bại.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập Google thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Vui lòng nhập địa chỉ email hợp lệ để nhận liên kết khôi phục.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await sendPasswordReset(email);
      if (res.success) {
        playSound('success');
        setSuccessMsg(res.message || 'Đã gửi liên kết khôi phục mật khẩu về email của bạn!');
      } else {
        setErrorMsg(res.message || 'Không thể gửi email đặt lại mật khẩu.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Có lỗi khi gửi email khôi phục.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    onAuthChange(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#16030e]/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#fcf7ec] text-[#240618] rounded-3xl shadow-2xl overflow-hidden border border-[#eadfcb] animate-spring-3d">
        
        {/* Header - Wayground Deep Velvet Wine */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#240618] text-white border-b border-[#f02c85]/30">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#f02c85] text-white flex items-center justify-center font-bold shadow-md shadow-pink-900/50">
              {user ? <User className="w-5 h-5" /> : (mode === 'forgot' ? <KeyRound className="w-5 h-5" /> : <LogIn className="w-5 h-5" />)}
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black tracking-tight">
                {user ? 'Hồ Sơ Học Viên' : (mode === 'forgot' ? 'Khôi Phục Mật Khẩu' : mode === 'register' ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập Firebase')}
              </h4>
              <p className="text-[11px] text-rose-200/80">
                {user ? 'Quản lý thông tin & đặc quyền tài khoản' : 'Đồng bộ tiến độ học & số dư ví trên Google Cloud'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-rose-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Firebase Status Indicator Badge */}
        <div className="px-6 pt-3 pb-1">
          <div className={`p-2 rounded-xl text-[11px] font-bold flex items-center justify-between border ${
            isRealFirebase
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isRealFirebase ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>
                {isRealFirebase
                  ? '🟢 Firebase Cloud Auth Đang Hoạt Động'
                  : '🟡 Chế Độ Thử Nghiệm (Sẵn Sàng Không Cần Khóa)'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">v13 Modular</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 pt-3">
          
          {user ? (
            /* LOGGED IN USER PROFILE */
            <div className="space-y-4">
              <div className="flex items-center space-x-3.5 p-4 bg-white rounded-2xl border border-[#eadfcb] shadow-xs">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt="Avatar"
                  className="w-13 h-13 rounded-2xl border-2 border-[#f02c85] bg-white shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-[#240618] truncate">
                    {user.displayName || user.email}
                  </h4>
                  <p className="text-xs text-[#7a5a6b] font-medium truncate">{user.email}</p>
                  <div className="flex items-center space-x-1.5 mt-1.5 flex-wrap gap-y-1">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#f02c85] text-white uppercase shadow-xs">
                      Gói: {currentTier.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f5ecd8] text-[#7a5a6b]">
                      ID: {user.uid?.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Quick Summary */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-amber-800 font-bold block flex items-center space-x-1">
                    <Coins className="w-3.5 h-3.5 text-amber-600 inline" />
                    <span>Số dư ví của bạn:</span>
                  </span>
                  <div className="flex items-baseline space-x-1.5 mt-0.5">
                    <strong className="text-lg text-amber-950 font-black">{walletBalance} Xu</strong>
                    <span className="text-[11px] text-[#7a5a6b] font-medium">(~{(walletBalance * 1000).toLocaleString('vi-VN')}đ)</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenWallet();
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-black shadow-md shadow-amber-600/20 transition-all hover:scale-105 active:scale-95"
                >
                  Nạp / Rút Xu
                </button>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenPricing();
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#f02c85] to-[#c71767] hover:from-[#e02078] hover:to-[#b3105a] text-white text-xs font-black rounded-2xl shadow-md shadow-pink-900/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Nâng Cấp Gói (Plus / Pro / Ultra)</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 bg-white hover:bg-[#f5ecd8] border border-[#eadfcb] text-[#7a5a6b] hover:text-[#240618] text-xs font-bold rounded-2xl flex items-center justify-center space-x-2 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Đăng Xuất Khỏi Thiết Bị</span>
                </button>
              </div>
            </div>
          ) : mode === 'forgot' ? (
            /* FORGOT PASSWORD FORM */
            <div className="space-y-4">
              <div className="text-xs text-[#7a5a6b] font-medium leading-relaxed">
                Nhập địa chỉ email đã đăng ký. Hệ thống Firebase Auth sẽ gửi một liên kết an toàn để bạn thiết lập mật khẩu mới ngay lập tức.
              </div>

              {errorMsg && (
                <div className="p-3 text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-3.5">
                <div>
                  <label className="text-xs font-black text-[#240618] block mb-1">
                    Địa chỉ Email nhận liên kết:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7a5a6b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="email-hoc-vien@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] focus:ring-2 focus:ring-[#f02c85]/20 font-medium"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#f02c85] to-[#c71767] hover:from-[#e02078] hover:to-[#b3105a] text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{loading ? 'Đang gửi...' : 'Gửi Email Đặt Lại Mật Khẩu'}</span>
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-black text-[#f02c85] hover:underline flex items-center justify-center space-x-1.5 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại màn hình Đăng Nhập</span>
                </button>
              </div>
            </div>
          ) : (
            /* LOGIN / REGISTER FORM */
            <div className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Google 1-Click Login */}
              <button
                type="button"
                onClick={handleGoogleSubmit}
                disabled={loading}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-[#eadfcb] rounded-2xl text-xs font-black text-[#240618] flex items-center justify-center space-x-2.5 transition-all shadow-xs hover:border-slate-400 active:scale-98 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Đăng nhập 1-Chạm với Google</span>
              </button>

              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#eadfcb]"></div>
                </div>
                <span className="relative px-3 bg-[#fcf7ec] text-[11px] font-black text-[#7a5a6b] uppercase tracking-wider">
                  hoặc qua email & mật khẩu
                </span>
              </div>

              {/* Form Email / Pass */}
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {mode === 'register' && (
                  <div>
                    <label className="text-xs font-black text-[#240618] block mb-1">
                      Họ và tên / Biệt danh học tập:
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#7a5a6b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Ví dụ: Hoàng Long (Thủ Khoa)"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] focus:ring-2 focus:ring-[#f02c85]/20 font-medium"
                        required={mode === 'register'}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-black text-[#240618] block mb-1">Email:</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7a5a6b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="ban@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] focus:ring-2 focus:ring-[#f02c85]/20 font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-black text-[#240618]">Mật khẩu:</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        className="text-[11px] font-bold text-[#f02c85] hover:underline"
                      >
                        Quên mật khẩu?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7a5a6b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Tối thiểu 6 ký tự"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] focus:ring-2 focus:ring-[#f02c85]/20 font-medium"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#f02c85] to-[#c71767] hover:from-[#e02078] hover:to-[#b3105a] text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 mt-4 hover:scale-[1.01] active:scale-98 disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>
                    {loading
                      ? 'Đang xử lý...'
                      : mode === 'register'
                      ? 'Tạo Tài Khoản & Nhận 20 Xu'
                      : 'Đăng Nhập Ngay'}
                  </span>
                </button>
              </form>

              {/* Toggle Register / Login */}
              <div className="mt-4 text-center border-t border-[#eadfcb]/80 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'register' ? 'login' : 'register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs text-[#f02c85] hover:underline font-black"
                >
                  {mode === 'register'
                    ? 'Đã có tài khoản? Đăng nhập ngay'
                    : 'Chưa có tài khoản? Đăng ký nhận 20 Xu miễn phí'}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
