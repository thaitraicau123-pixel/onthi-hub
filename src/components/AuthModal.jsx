import React, { useState, useEffect } from 'react';
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
  KeyRound,
  Coins,
  Star,
  Shield,
  Settings,
  Clock,
  Crown,
  Volume2,
  Bell,
  RefreshCw,
  Flame,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  sendPasswordReset,
  logoutUser,
  getCurrentUser,
  isRealFirebaseConfigured
} from '../utils/firebaseConfig';
import { getUserTier, getTierLimits } from '../utils/userTier';
import { getWalletBalance } from '../utils/wallet';
import { playSound, isSoundMuted, toggleSoundMute } from '../utils/storage';
import { getStreakInfo } from '../utils/gamification';
import { isUserAdmin } from '../utils/adminGuard';
import { useModalDismiss } from '../hooks/useModalDismiss';

export default function AuthModal({
  user: propUser,
  onAuthChange,
  onClose,
  onSuccess,
  onOpenPricing,
  onOpenWallet,
  onOpenAdmin
}) {
  // Sync active user state
  const [currentUser, setCurrentUser] = useState(() => propUser || getCurrentUser());

  useEffect(() => {
    if (propUser !== undefined) {
      setCurrentUser(propUser);
    }
  }, [propUser]);

  // Tabs for logged-in user: 'profile' | 'tier' | 'security' | 'preferences'
  const [activeTab, setActiveTab] = useState('profile');

  // Auth Form State (when user wants to log in, register, or reset password)
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Preferences State
  const [soundEnabled, setSoundEnabled] = useState(() => !isSoundMuted());
  const [autoFlip, setAutoFlip] = useState(() => (localStorage.getItem('promptmmo_pref_autoflip') ?? localStorage.getItem('onthi_pref_autoflip')) === 'true');
  const [studyReminder, setStudyReminder] = useState(() => (localStorage.getItem('promptmmo_pref_reminder') ?? localStorage.getItem('onthi_pref_reminder')) !== 'false');

  const currentTier = getUserTier();
  const tierLimits = getTierLimits();
  const currentLimits = tierLimits[currentTier] || tierLimits.free;
  const walletBalance = getWalletBalance();
  const streakInfo = getStreakInfo();

  // Tier metadata for luxury card
  const tierMeta = {
    free: {
      title: 'Free',
      badge: 'TIÊU CHUẨN',
      tagline: 'Gói Creator cơ bản khởi đầu',
      expiry: 'Vĩnh viễn',
      isTop: false
    },
    plus: {
      title: 'Plus',
      badge: 'PHỔ BIẾN ⭐',
      tagline: 'Sáng tạo Prompt & MMO mở rộng',
      expiry: '30 ngày tới',
      isTop: false
    },
    pro: {
      title: 'Pro',
      badge: 'CAO CẤP NHẤT',
      tagline: 'Đầy đủ quyền lợi cao cấp nhất cùng AI mở rộng.',
      expiry: '11/12/2026 lúc 08:44',
      isTop: true
    },
    ultra: {
      title: 'Ultra',
      badge: 'CREATOR VIP 👑',
      tagline: 'Đặc quyền tối cao không giới hạn & phí sàn 3%',
      expiry: 'Trọn đời',
      isTop: true
    }
  };

  const meta = tierMeta[currentTier] || tierMeta.free;

  const handleToggleSound = () => {
    const nextMuted = toggleSoundMute();
    setSoundEnabled(!nextMuted);
    if (!nextMuted) playSound('click');
  };

  const handleToggleAutoFlip = () => {
    const next = !autoFlip;
    setAutoFlip(next);
    localStorage.setItem('promptmmo_pref_autoflip', String(next));
    playSound('click');
  };

  const handleToggleReminder = () => {
    const next = !studyReminder;
    setStudyReminder(next);
    localStorage.setItem('promptmmo_pref_reminder', String(next));
    playSound('click');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      let res;
      if (authMode === 'register') {
        res = await registerWithEmail(email, password, displayName);
      } else {
        res = await loginWithEmail(email, password);
      }

      if (res.success) {
        playSound('success');
        setCurrentUser(res.user);
        onAuthChange?.(res.user);
        onSuccess?.();
        setSuccessMsg(authMode === 'register' ? 'Đăng ký thành công!' : 'Đăng nhập thành công!');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setErrorMsg(res.message || 'Thao tác thất bại. Vui lòng kiểm tra lại thông tin.');
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
        setCurrentUser(res.user);
        onAuthChange?.(res.user);
        onSuccess?.();
        setSuccessMsg('Đăng nhập Google thành công!');
        setTimeout(() => {
          onClose();
        }, 800);
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
        setSuccessMsg(res.message || 'Đã gửi liên kết khôi phục tới Gmail của bạn!');
        setTimeout(() => {
          setAuthMode('login');
        }, 2000);
      } else {
        setErrorMsg(res.message || 'Không thể gửi email khôi phục.');
      }
    } catch (err) {
      setErrorMsg('Lỗi gửi email khôi phục mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
      await logoutUser();
      playSound('flip');
      setCurrentUser(null);
      onAuthChange?.(null);
      onClose();
    }
  };

  // Close modal with Escape key
  useModalDismiss(onClose);

  // =========================================================================
  // VIEW A: CHƯA ĐĂNG NHẬP -> CỬA SỔ ĐĂNG NHẬP / ĐĂNG KÝ TỐI GIẢN & CHÍNH GIỮA
  // =========================================================================
  if (!currentUser) {
    return (
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 sm:p-6 transition-all duration-200"
      >
        <div className="flex min-h-full items-center justify-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white dark:bg-[#18181b] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-stone-200/90 dark:border-stone-800 p-6 sm:p-8 my-auto transition-all duration-200"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Đóng (Esc)"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3.5 shadow-md shadow-indigo-500/20">
                {authMode === 'forgot' ? (
                  <KeyRound className="w-6 h-6" />
                ) : authMode === 'register' ? (
                  <User className="w-6 h-6" />
                ) : (
                  <LogIn className="w-6 h-6" />
                )}
              </div>

              <h3 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
                {authMode === 'forgot'
                  ? 'Khôi phục mật khẩu'
                  : authMode === 'register'
                  ? 'Tạo tài khoản mới'
                  : 'Đăng nhập tài khoản'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                {authMode === 'forgot'
                  ? 'Nhập email để nhận liên kết đặt lại mật khẩu an toàn'
                  : 'Tiếp cận kho Prompt MMO & Dịch vụ Web Bùi Thái Studio'}
              </p>
            </div>

            {/* Message Banners */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span className="flex-1">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="flex-1">{successMsg}</span>
              </div>
            )}

            {/* FORGOT PASSWORD FORM */}
            {authMode === 'forgot' ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1.5">
                    Địa chỉ Email:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ban@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Đang gửi...' : 'Gửi liên kết khôi phục'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setAuthMode('login');
                    }}
                    className="inline-flex items-center space-x-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Quay lại đăng nhập</span>
                  </button>
                </div>
              </form>
            ) : (
              /* LOGIN & REGISTER MAIN FORM */
              <div className="space-y-4">
                {/* Google 1-Click Button */}
                <button
                  type="button"
                  onClick={handleGoogleSubmit}
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800/90 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-2.5 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Tiếp tục với Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-stone-200 dark:border-stone-800 w-full"></div>
                  <span className="bg-white dark:bg-[#18181b] px-3 text-[11px] font-medium text-stone-400 dark:text-stone-500 absolute">
                    hoặc với email
                  </span>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  {authMode === 'register' && (
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                        Tên hiển thị:
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Họ và tên của bạn"
                          className="w-full pl-9 pr-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Địa chỉ Email:
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ban@gmail.com"
                        className="w-full pl-9 pr-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                        Mật khẩu:
                      </label>
                      {authMode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setErrorMsg('');
                            setAuthMode('forgot');
                          }}
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          Quên mật khẩu?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 mt-2 bg-stone-900 hover:bg-stone-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <span>{loading ? 'Đang xử lý...' : authMode === 'register' ? 'Tạo Tài Khoản' : 'Đăng Nhập'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Footer Switcher */}
                <div className="pt-2 text-center text-xs text-stone-500 dark:text-stone-400">
                  {authMode === 'register' ? (
                    <span>
                      Đã có tài khoản?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg('');
                          setAuthMode('login');
                        }}
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                      >
                        Đăng nhập
                      </button>
                    </span>
                  ) : (
                    <span>
                      Chưa có tài khoản?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg('');
                          setAuthMode('register');
                        }}
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                      >
                        Đăng ký ngay
                      </button>
                    </span>
                  )}
                </div>

                {/* Guest continuation hint */}
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer"
                  >
                    Tiếp tục duyệt với tư cách Khách (Guest) →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: ĐÃ ĐĂNG NHẬP -> QUẢN LÝ TÀI KHOẢN (HỒ SƠ, HẠN MỨC, BẢO MẬT, TÙY CHỌN)
  // =========================================================================
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 sm:p-6 transition-all duration-200"
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white dark:bg-[#18181b] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-stone-200/90 dark:border-stone-800 overflow-hidden flex flex-col max-h-[88vh] my-auto cursor-default"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-[#18181b]">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-white">
                  Quản lý Tài khoản
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                  Hồ sơ, ảnh đại diện, bảo mật & tùy chọn trải nghiệm
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-stone-500 dark:text-stone-300 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer border border-stone-200/80 dark:border-stone-700 bg-white dark:bg-stone-800/80 shadow-2xs group"
              title="Đóng cửa sổ (Esc)"
            >
              <span className="font-semibold">Đóng</span>
              <kbd className="hidden sm:inline text-[10px] font-mono bg-stone-100 dark:bg-stone-700 px-1 py-0.5 rounded text-stone-500 dark:text-stone-300">Esc</kbd>
              <X className="w-4 h-4 ml-0.5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* TAB NAVIGATION BAR */}
          <div className="flex items-center px-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/50 overflow-x-auto no-scrollbar gap-1 sm:gap-2">
            {[
              { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
              { id: 'tier', label: 'Gói & Hạn mức', icon: Star },
              { id: 'security', label: 'Bảo mật', icon: Shield },
              { id: 'preferences', label: 'Tùy chọn học tập', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSound('click');
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center space-x-1.5 py-3 px-3 sm:px-4 text-xs font-bold transition-all relative border-b-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-extrabold'
                      : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-400 dark:text-stone-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Message Banners */}
          {errorMsg && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB CONTENT PANELS */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-white dark:bg-[#18181b]">
            {/* -------------------------------------------------------
                TAB 1: HỒ SƠ CÁ NHÂN
                ------------------------------------------------------- */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <img
                    src={currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`}
                    alt="Avatar"
                    className="w-14 h-14 rounded-2xl border-2 border-indigo-500 object-cover bg-white dark:bg-stone-800 shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-stone-900 dark:text-white truncate">
                      {currentUser.displayName || currentUser.email}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium truncate">{currentUser.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-600 text-white uppercase">
                        Gói: {currentTier.toUpperCase()}
                      </span>
                      {isUserAdmin(currentUser) && (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase border border-amber-300 shadow-2xs">
                          👑 SUPER ADMIN
                        </span>
                      )}
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        UID: {currentUser.uid?.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wallet & Streak stats */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-amber-800 dark:text-amber-300 font-bold block text-[11px]">Số dư ví:</span>
                      <strong className="text-amber-950 dark:text-amber-100 text-base font-black">{walletBalance} Xu</strong>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenWallet?.();
                      }}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-black cursor-pointer"
                    >
                      Nạp
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-orange-800 dark:text-orange-300 font-bold block text-[11px]">Chuỗi streak:</span>
                      <strong className="text-orange-950 dark:text-orange-100 text-base font-black">{streakInfo.streak} ngày</strong>
                    </div>
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                  </div>
                </div>

                {/* Actions */}
                {isUserAdmin(currentUser) && onOpenAdmin && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>👑 Mở Cửa Sổ Quản Trị (Admin Portal) →</span>
                  </button>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab('tier')}
                    className="px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-black transition-colors cursor-pointer"
                  >
                    Xem Gói & Hạn Mức
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-700 dark:hover:text-rose-300 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------
                TAB 2: GÓI & HẠN MỨC
                ------------------------------------------------------- */}
            {activeTab === 'tier' && (
              <div className="space-y-5">
                {/* THE LUXURY DARK TIER CARD */}
                <div className="relative rounded-3xl p-6 sm:p-7 bg-[#0b0f19] text-white shadow-xl border border-stone-800 overflow-hidden">
                  <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]/60 rounded-tl-sm pointer-events-none"></div>
                  <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]/60 rounded-tr-sm pointer-events-none"></div>
                  <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]/60 rounded-bl-sm pointer-events-none"></div>
                  <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]/60 rounded-br-sm pointer-events-none"></div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-extrabold tracking-wider uppercase">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>{meta.badge}</span>
                    </div>

                    <div className="px-3 py-1 rounded-lg bg-white/10 text-stone-200 text-xs font-bold border border-white/10">
                      Đang dùng
                    </div>
                  </div>

                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-serif">
                      {meta.title}
                    </h2>
                    <div className="w-12 h-0.5 bg-indigo-500 mt-1.5 mb-2.5 rounded-full"></div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-300 font-medium max-w-lg leading-relaxed">
                    {meta.tagline}
                  </p>

                  <div className="mt-5 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 border border-stone-700/70 text-xs text-stone-300 font-mono">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Hạn dùng đến: {meta.expiry}</span>
                  </div>
                </div>

                {/* Quyền lợi và Hạn mức tính năng */}
                <div className="space-y-3 pt-1">
                  <h4 className="text-sm font-black text-stone-900 dark:text-white">
                    Quyền lợi và Hạn mức tính năng
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                      <div>
                        <span className="text-stone-500 dark:text-stone-400 font-bold block text-[11px]">Hạn mức tạo thẻ:</span>
                        <strong className="text-stone-900 dark:text-white text-sm font-black">
                          {currentLimits.dailyLimit === 9999 ? 'Không giới hạn' : `${currentLimits.dailyLimit} thẻ/ngày`}
                        </strong>
                      </div>
                      <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">⚡</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                      <div>
                        <span className="text-stone-500 dark:text-stone-400 font-bold block text-[11px]">Thưởng điểm danh:</span>
                        <strong className="text-stone-900 dark:text-white text-sm font-black">
                          +{currentLimits.checkInBonus} lượt/ngày
                        </strong>
                      </div>
                      <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">🎁</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                      <div>
                        <span className="text-stone-500 dark:text-stone-400 font-bold block text-[11px]">Phí sàn C2C:</span>
                        <strong className="text-stone-900 dark:text-white text-sm font-black">
                          Chỉ {currentLimits.marketplaceFee}%
                        </strong>
                      </div>
                      <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">🏪</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                      <div>
                        <span className="text-stone-500 dark:text-stone-400 font-bold block text-[11px]">Dung lượng lưu trữ:</span>
                        <strong className="text-stone-900 dark:text-white text-sm font-black">
                          Không giới hạn
                        </strong>
                      </div>
                      <span className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 flex items-center justify-center font-bold">📦</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPricing?.();
                      }}
                      className="w-full sm:flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Nâng Cấp Gói Khác (Plus / Pro / Ultra)</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenWallet?.();
                      }}
                      className="w-full sm:w-auto py-3 px-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 border border-transparent dark:border-stone-700 text-xs font-black rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Nạp Xu ({walletBalance} Xu)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------
                TAB 3: BẢO MẬT
                ------------------------------------------------------- */}
            {activeTab === 'security' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center space-x-2 text-stone-900 dark:text-white font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Chứng chỉ an toàn Google Firebase</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                    Tài khoản của bạn được mã hóa bằng chuẩn an toàn của Google. Không lưu mật khẩu thô và đảm bảo an toàn tuyệt đối.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
                  <h5 className="font-bold text-stone-900 dark:text-white">Khôi phục & Đặt lại mật khẩu</h5>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Nhập email đăng ký để nhận đường dẫn đặt lại mật khẩu an toàn:
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ban@gmail.com"
                      className="flex-1 px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                    />
                    <button
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="px-4 py-2 bg-stone-900 dark:bg-indigo-600 hover:bg-stone-800 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Gửi mail
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất tài khoản khỏi thiết bị này</span>
                  </button>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------
                TAB 4: TÙY CHỌN HỌC TẬP & TRẢI NGHIỆM
                ------------------------------------------------------- */}
            {activeTab === 'preferences' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-white">
                      <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Hiệu ứng âm thanh (Web Audio 0MB)</span>
                    </div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">Phát âm thanh click, sao chép prompt và nạp Xu</span>
                  </div>
                  <button
                    onClick={handleToggleSound}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${soundEnabled ? 'bg-indigo-600' : 'bg-stone-300 dark:bg-stone-600'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-white">
                      <RefreshCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Tự động lật thẻ theo Spaced Repetition</span>
                    </div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">Tự động ưu tiên hiện lại các thẻ học tập bạn đánh giá "Khó"</span>
                  </div>
                  <button
                    onClick={handleToggleAutoFlip}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${autoFlip ? 'bg-indigo-600' : 'bg-stone-300 dark:bg-stone-600'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${autoFlip ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-white">
                      <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Nhắc nhở mở web & Giữ chuỗi streak hàng ngày</span>
                    </div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">Nhắc bạn mở web điểm danh và nhận Xu mỗi ngày</span>
                  </div>
                  <button
                    onClick={handleToggleReminder}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${studyReminder ? 'bg-indigo-600' : 'bg-stone-300 dark:bg-stone-600'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${studyReminder ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
