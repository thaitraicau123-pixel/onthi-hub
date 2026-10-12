import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, Sparkles, LogOut, ShieldCheck, Check } from 'lucide-react';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logoutUser,
  getCurrentUser
} from '../utils/firebaseConfig';
import { getUserTier } from '../utils/userTier';
import { getWalletBalance } from '../utils/wallet';
import { playSound } from '../utils/storage';

export default function AuthModal({ user, onAuthChange, onClose, onOpenPricing, onOpenWallet }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentTier = getUserTier();
  const walletBalance = getWalletBalance();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      let res;
      if (isRegister) {
        res = await registerWithEmail(email, password, displayName);
      } else {
        res = await loginWithEmail(email, password);
      }

      if (res.success) {
        playSound('success');
        onAuthChange(res.user);
        onClose();
      } else {
        setErrorMsg('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        playSound('success');
        onAuthChange(res.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập Google thất bại.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-spring-3d">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {user ? 'Tài Khoản Học Viên' : (isRegister ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập Firebase')}
              </h4>
              <p className="text-[11px] text-slate-500">
                {user ? 'Quản lý thông tin & gói hội viên' : 'Đồng bộ tiến độ học & số dư ví Xu'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {user ? (
            /* LOGGED IN USER PROFILE */
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full border border-slate-200 bg-white"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {user.displayName || user.email}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase">
                      Tier: {currentTier.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      • {user.provider || 'Firebase Auth'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Quick Summary */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-amber-700 font-semibold block">Số dư ví của bạn:</span>
                  <strong className="text-base text-amber-900 font-black">{walletBalance} Xu</strong>
                  <span className="text-[10px] text-slate-500 ml-1">(~{(walletBalance * 1000).toLocaleString()}đ)</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenWallet();
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-xs"
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
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Nâng Cấp Gói (Plus / Pro / Ultra)</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5"
                >
                  <LogOut className="w-4 h-4 text-slate-400" />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            </div>
          ) : (
            /* LOGIN / REGISTER FORM */
            <div>
              {errorMsg && (
                <div className="p-2.5 mb-4 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {errorMsg}
                </div>
              )}

              {/* Google 1-Click Login */}
              <button
                type="button"
                onClick={handleGoogleSubmit}
                disabled={loading}
                className="w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center space-x-2 transition-all shadow-xs mb-4"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Tiếp tục với Google</span>
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative px-3 bg-white text-[11px] font-semibold text-slate-400 uppercase">
                  hoặc email
                </span>
              </div>

              {/* Form Email / Pass */}
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {isRegister && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Họ và tên / Biệt danh:
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"
                        required={isRegister}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email:</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="ban@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mật khẩu:</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isRegister ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập'}</span>
                </button>
              </form>

              {/* Toggle Register / Login */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  {isRegister ? 'Đã có tài khoản? Đăng nhập ngay' : 'Chưa có tài khoản? Đăng ký nhận 20 Xu miễn phí'}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
