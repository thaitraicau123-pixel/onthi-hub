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
  KeyRound,
  Coins,
  Star,
  Shield,
  Settings,
  Clock,
  Crown,
  Volume2,
  VolumeX,
  Bell,
  RefreshCw,
  Flame,
  Check
} from 'lucide-react';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  sendPasswordReset,
  logoutUser,
  isRealFirebaseConfigured
} from '../utils/firebaseConfig';
import { getUserTier, getTierLimits, setUserTier } from '../utils/userTier';
import { getWalletBalance } from '../utils/wallet';
import { playSound, isSoundMuted, toggleSoundMute } from '../utils/storage';
import { getStreakInfo } from '../utils/gamification';

export default function AuthModal({
  user,
  onAuthChange,
  onClose,
  onOpenPricing,
  onOpenWallet
}) {
  // Tabs: 'profile' | 'tier' | 'security' | 'preferences'
  const [activeTab, setActiveTab] = useState('profile');

  // Auth Form State (when user wants to log in or register)
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Preferences State
  const [soundEnabled, setSoundEnabled] = useState(() => !isSoundMuted());
  const [autoFlip, setAutoFlip] = useState(() => localStorage.getItem('onthi_pref_autoflip') === 'true');
  const [studyReminder, setStudyReminder] = useState(() => localStorage.getItem('onthi_pref_reminder') !== 'false');

  const isRealFirebase = isRealFirebaseConfigured();
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
      tagline: 'Gói học tập cơ bản khởi đầu',
      expiry: 'Vĩnh viễn',
      isTop: false
    },
    plus: {
      title: 'Plus',
      badge: 'PHỔ BIẾN ⭐',
      tagline: 'Cày đề & luyện thi mở rộng',
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
    localStorage.setItem('onthi_pref_autoflip', String(next));
    playSound('click');
  };

  const handleToggleReminder = () => {
    const next = !studyReminder;
    setStudyReminder(next);
    localStorage.setItem('onthi_pref_reminder', String(next));
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
        onAuthChange(res.user);
        setSuccessMsg('Đăng nhập thành công!');
        setTimeout(() => setSuccessMsg(''), 2000);
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
        setSuccessMsg('Đăng nhập Google thành công!');
        setTimeout(() => setSuccessMsg(''), 2000);
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
        setAuthMode('login');
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
      onAuthChange(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#ffffff] text-[#1e1e24] rounded-3xl shadow-2xl overflow-hidden border border-[#eadfcb] animate-spring-3d flex flex-col max-h-[92vh]">
        
        {/* =========================================================
            HEADER: QUẢN LÝ TÀI KHOẢN (Theo phong cách Image 1)
            ========================================================= */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 bg-white">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#4f46e5] text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/25">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#111827]">
                Quản lý Tài khoản
              </h3>
              <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                Hồ sơ, ảnh đại diện, bảo mật & tùy chọn học tập
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================================
            TAB NAVIGATION BAR (Theo phong cách Image 1)
            ========================================================= */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-slate-50/70 overflow-x-auto no-scrollbar gap-1 sm:gap-2">
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
                className={`flex items-center space-x-1.5 py-3 px-3 sm:px-4 text-xs font-bold transition-all relative border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-[#4f46e5] text-[#4f46e5] font-extrabold'
                    : 'border-transparent text-[#6b7280] hover:text-[#111827]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#4f46e5]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Message Banners */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* =========================================================
            TAB CONTENT PANELS
            ========================================================= */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-white">
          
          {/* -------------------------------------------------------
              TAB 2: GÓI & HẠN MỨC (Kế thừa trọn vẹn từ Image 1)
              ------------------------------------------------------- */}
          {activeTab === 'tier' && (
            <div className="space-y-5 animate-fade-in">
              
              {/* THE LUXURY DARK TIER CARD (Corner Brackets, Gold Badge, Clock Pill) */}
              <div className="relative rounded-3xl p-6 sm:p-7 bg-[#0b0f19] text-white shadow-xl border border-slate-800 overflow-hidden">
                
                {/* 4 Decorative Corner Brackets [ ┌ ┐ └ ┘ ] */}
                <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]/60 rounded-tl-sm pointer-events-none"></div>
                <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]/60 rounded-tr-sm pointer-events-none"></div>
                <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]/60 rounded-bl-sm pointer-events-none"></div>
                <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]/60 rounded-br-sm pointer-events-none"></div>

                {/* Top Row Badges */}
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-extrabold tracking-wider uppercase">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>{meta.badge}</span>
                  </div>

                  <div className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 text-xs font-bold border border-white/10">
                    Đang dùng
                  </div>
                </div>

                {/* Main Plan Title */}
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-serif">
                    {meta.title}
                  </h2>
                  <div className="w-12 h-0.5 bg-[#4f46e5] mt-1.5 mb-2.5 rounded-full"></div>
                </div>

                {/* Tagline */}
                <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg leading-relaxed">
                  {meta.tagline}
                </p>

                {/* Expiration Clock Pill */}
                <div className="mt-5 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/70 text-xs text-slate-300 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hạn dùng đến: {meta.expiry}</span>
                </div>

              </div>

              {/* Quyền lợi và Hạn mức tính năng */}
              <div className="space-y-3 pt-1">
                <h4 className="text-sm font-black text-slate-900">
                  Quyền lợi và Hạn mức tính năng
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-bold block text-[11px]">Hạn mức tạo thẻ:</span>
                      <strong className="text-slate-900 text-sm font-black">
                        {currentLimits.dailyLimit === 9999 ? 'Không giới hạn' : `${currentLimits.dailyLimit} thẻ/ngày`}
                      </strong>
                    </div>
                    <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">⚡</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-bold block text-[11px]">Thưởng điểm danh:</span>
                      <strong className="text-slate-900 text-sm font-black">
                        +{currentLimits.checkInBonus} lượt/ngày
                      </strong>
                    </div>
                    <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">🎁</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-bold block text-[11px]">Phí sàn C2C:</span>
                      <strong className="text-slate-900 text-sm font-black">
                        Chỉ {currentLimits.marketplaceFee}%
                      </strong>
                    </div>
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">🏪</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-bold block text-[11px]">Dung lượng lưu trữ:</span>
                      <strong className="text-slate-900 text-sm font-black">
                        Không giới hạn
                      </strong>
                    </div>
                    <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">📦</span>
                  </div>
                </div>

                {/* Quick actions for tier upgrade */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPricing?.();
                    }}
                    className="w-full sm:flex-1 py-3 px-4 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Nâng Cấp Gói Khác (Plus / Pro / Ultra)</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenWallet?.();
                    }}
                    className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>Nạp Xu ({walletBalance} Xu)</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* -------------------------------------------------------
              TAB 1: HỒ SƠ CÁ NHÂN
              ------------------------------------------------------- */}
          {activeTab === 'profile' && (
            <div className="space-y-5 animate-fade-in">
              {user ? (
                /* Đã đăng nhập */
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <img
                      src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt="Avatar"
                      className="w-14 h-14 rounded-2xl border-2 border-[#4f46e5] object-cover bg-white shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-slate-900 truncate">
                        {user.displayName || user.email}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium truncate">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#4f46e5] text-white uppercase">
                          Gói: {currentTier.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                          UID: {user.uid?.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Wallet & Streak stats */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="text-amber-800 font-bold block text-[11px]">Số dư ví:</span>
                        <strong className="text-amber-950 text-base font-black">{walletBalance} Xu</strong>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenWallet?.();
                        }}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-black"
                      >
                        Nạp
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 flex items-center justify-between">
                      <div>
                        <span className="text-orange-800 font-bold block text-[11px]">Chuỗi streak:</span>
                        <strong className="text-orange-950 text-base font-black">{streakInfo.streak} ngày</strong>
                      </div>
                      <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('tier')}
                      className="px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-black transition-colors"
                    >
                      Xem Gói & Hạn Mức
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold transition-colors flex items-center space-x-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng Xuất</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Khách (Chưa đăng nhập) -> Form đăng nhập / Google */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-center justify-between">
                    <div>
                      <strong className="block text-sm font-black text-indigo-900">
                        Chế độ Khách (Guest)
                      </strong>
                      <span className="text-[11px] text-indigo-700 font-medium">
                        Dữ liệu lưu trên máy. Đăng nhập Google để đồng bộ vĩnh viễn trên đám mây.
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-200/80 text-indigo-800 font-black text-[10px] uppercase">
                      Chưa đăng nhập
                    </span>
                  </div>

                  {/* Google 1-Click Sign-In */}
                  <button
                    onClick={handleGoogleSubmit}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 text-xs font-black rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-all hover:border-slate-300 active:scale-98"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Tiếp tục với Tài Khoản Google</span>
                  </button>

                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-slate-200 w-full"></div>
                    <span className="bg-white px-3 text-[11px] font-bold text-slate-400 absolute">hoặc email</span>
                  </div>

                  {/* Email & Password Form */}
                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    {authMode === 'register' && (
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Tên hiển thị:</label>
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#4f46e5]"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Email:</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hocvien@gmail.com"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#4f46e5]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Mật khẩu:</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#4f46e5]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-black rounded-xl shadow-xs transition-colors"
                    >
                      {loading ? 'Đang xử lý...' : (authMode === 'register' ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập')}
                    </button>
                  </form>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
                      className="text-[#4f46e5] font-bold hover:underline"
                    >
                      {authMode === 'register' ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -------------------------------------------------------
              TAB 3: BẢO MẬT
              ------------------------------------------------------- */}
          {activeTab === 'security' && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-slate-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Chứng chỉ an toàn Google Firebase</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Tài khoản của bạn được mã hóa bằng chuẩn an toàn của Google. Không lưu mật khẩu thô và đảm bảo an toàn tuyệt đối.
                </p>
              </div>

              {/* Reset Password Form */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <h5 className="font-bold text-slate-900">Khôi phục & Đặt lại mật khẩu</h5>
                <p className="text-[11px] text-slate-500">
                  Nhập email đăng ký để nhận đường dẫn đặt lại mật khẩu an toàn:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#4f46e5]"
                  />
                  <button
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0"
                  >
                    Gửi mail
                  </button>
                </div>
              </div>

              {user && (
                <div className="pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất tài khoản khỏi thiết bị này</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* -------------------------------------------------------
              TAB 4: TÙY CHỌN HỌC TẬP
              ------------------------------------------------------- */}
          {activeTab === 'preferences' && (
            <div className="space-y-3 animate-fade-in text-xs">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2 font-bold text-slate-900">
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span>Hiệu ứng âm thanh (Lật thẻ & Âm đúng/sai)</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Phát âm thanh sinh động khi lật flashcard và hoàn thành bài thi</span>
                </div>
                <button
                  onClick={handleToggleSound}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${soundEnabled ? 'bg-[#4f46e5]' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2 font-bold text-slate-900">
                    <RefreshCw className="w-4 h-4 text-indigo-600" />
                    <span>Tự động phát lại thẻ theo Spaced Repetition</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Tự động ưu tiên hiện lại các thẻ bạn đánh giá "Khó"</span>
                </div>
                <button
                  onClick={handleToggleAutoFlip}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${autoFlip ? 'bg-[#4f46e5]' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${autoFlip ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2 font-bold text-slate-900">
                    <Bell className="w-4 h-4 text-indigo-600" />
                    <span>Nhắc nhở học tập & Giữ chuỗi streak hàng ngày</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Nhắc bạn mở web điểm danh và nhận Xu mỗi ngày</span>
                </div>
                <button
                  onClick={handleToggleReminder}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${studyReminder ? 'bg-[#4f46e5]' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${studyReminder ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
