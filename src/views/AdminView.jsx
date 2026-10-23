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
  FileSearch,
  Database,
  Key,
  Copy,
  Check,
  Flame,
  Info,
  Code,
  Gift,
  Cpu,
  Send,
  BellRing,
  Smartphone,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  MessageSquare,
  Pin,
  Clock,
  Search,
  Download,
  ThumbsUp,
  UserCheck,
  Users,
  User,
  PlusCircle,
  MinusCircle,
  WalletCards,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Filter,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Unlock,
  LayoutGrid,
  List,
  MessageCircle
} from 'lucide-react';
import {
  isUserAdmin,
  getAdminEmail,
  maskApiKey,
  PRIMARY_ADMIN_EMAIL,
  isAdminSessionAuthenticated,
  verifyAdminPassword,
  logoutAdminSession
} from '../utils/adminGuard';
import {
  getCommunityPosts,
  deleteCommunityPost,
  togglePinCommunityPost,
  deleteCommunityComment,
  clearSpamCommunityPosts
} from '../data/communityData';
import {
  formatHanoiDateTime,
  getStudyTimeLogs,
  getHanoiNowComponents
} from '../utils/hanoiTime';
import { BLIND_BOXES } from '../utils/blindBox';
import {
  getTransactions,
  fetchFirestoreTransactions,
  subscribeToTransactions,
  adminApproveTransaction,
  adminRejectTransaction,
  getAdminNotifications,
  requestBrowserNotificationPermission,
  sendBrowserDesktopNotification,
  ADMIN_EMAIL,
  ADMIN_PHONE,
  ADMIN_NTFY_TOPIC,
  COIN_RATE_VND,
  getTelegramConfig,
  saveTelegramConfig,
  getAllUsersWithBalances,
  getLocalUsersWithBalances,
  adminDirectAdjustUserBalance,
  getUserBalanceForEmail,
  adminDeleteUser,
  purgeAllTestAccounts,
  adminUpdateUserStatusAndTier,
  promoteUserTier,
  demoteUserTier,
  toggleUserSuspension
} from '../utils/wallet';
import { getTierLimits, saveTierLimits } from '../utils/userTier';
import { getMarketplaceDecks, adminUpdateMarketplaceDeck, deleteMarketplaceDeck } from '../data/marketplaceData';
import { checkDeckDuplication } from '../utils/duplicateChecker';
import { playSound } from '../utils/storage';
import {
  getFirebaseConfig,
  saveFirebaseConfig,
  testFirebaseConnection,
  isRealFirebaseConfigured
} from '../utils/firebaseConfig';
import {
  getGeminiApiKey,
  saveGeminiApiKey,
  getOpenAIApiKey,
  saveOpenAIApiKey,
  hasValidAiKey,
  testGeminiApiKey,
  testOpenAiApiKey,
  API_KEY_LINKS
} from '../utils/aiApiKey';

export default function AdminView({ user: _user, onBackToHome, onOpenChangelog, onOpenDirectChat }) {
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => isAdminSessionAuthenticated());
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const [activeTab, setActiveTab] = useState('user_balances'); // 'user_balances' | 'transactions' | 'tiers' | 'marketplace' | 'notifications' | 'firebase' | 'ai_api'
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tierLimits, setTierLimits] = useState({});
  const [marketDecks, setMarketDecks] = useState([]);
  const [marketFilter, setMarketFilter] = useState('all'); // 'all' | 'duplicates' | 'pass' | 'clean'
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // User Balances & Approvals State (Synchronously initialized with local/cached data for 0ms delay)
  const [userBalancesList, setUserBalancesList] = useState(() => getLocalUsersWithBalances());
  const [isLoadingUserBalances, setIsLoadingUserBalances] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('all'); // 'all' | 'active' | 'locked' | 'vip' | 'pending' | 'balance'
  const [userViewMode, setUserViewMode] = useState('table'); // 'table' | 'cards'
  const [selectedUserHistory, setSelectedUserHistory] = useState(null);
  const [adjustModal, setAdjustModal] = useState({
    isOpen: false,
    user: null,
    type: 'deposit', // 'deposit' | 'withdraw'
    amount: 50,
    reason: ''
  });
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustToast, setAdjustToast] = useState('');
  const [copiedUserEmail, setCopiedUserEmail] = useState('');

  // Status & Tier Modal State
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    user: null,
    tier: 'free',
    role: 'student',
    status: 'active'
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Firebase Config State
  const [firebaseConfig, setFirebaseConfig] = useState(() => getFirebaseConfig());
  const [rawSnippet, setRawSnippet] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedVercelEnv, setCopiedVercelEnv] = useState(false);
  const [firebaseSaveMsg, setFirebaseSaveMsg] = useState('');
  const [showFirebaseKey, setShowFirebaseKey] = useState(false);

  // AI API Key State
  const [geminiApiKey, setGeminiApiKey] = useState(() => getGeminiApiKey());
  const [openaiApiKey, setOpenaiApiKey] = useState(() => getOpenAIApiKey());
  const [testingAiKey, setTestingAiKey] = useState(false);
  const [aiTestResult, setAiTestResult] = useState(null);
  const [aiSaveMsg, setAiSaveMsg] = useState('');
  const [copiedAiEnv, setCopiedAiEnv] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);

  // Telegram Config State
  const [telegramConfig, setTelegramConfig] = useState(() => getTelegramConfig());
  const [telegramSaveMsg, setTelegramSaveMsg] = useState('');
  const [copiedNtfyTopic, setCopiedNtfyTopic] = useState(false);
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);
  const [approvingTxId, setApprovingTxId] = useState(null);

  // Desktop Notification State
  const [desktopNotifStatus, setDesktopNotifStatus] = useState(() =>
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );

  const handleRequestDesktopNotif = async () => {
    const perm = await requestBrowserNotificationPermission();
    setDesktopNotifStatus(perm);
    if (perm === 'granted') {
      sendBrowserDesktopNotification({
        title: '🔔 [OnThiHub] Thông báo đẩy đã kích hoạt!',
        body: 'Máy tính của anh sẽ reo chuông và hiện thông báo ngay khi có học viên nạp hoặc rút Xu.'
      });
      playSound('success');
    }
  };

  // Community Moderation State
  const [communityPosts, setCommunityPosts] = useState(() => getCommunityPosts());
  const [communityCategoryFilter, setCommunityCategoryFilter] = useState('all');
  const [communitySearchQuery, setCommunitySearchQuery] = useState('');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState(null);
  const [communityActionMsg, setCommunityActionMsg] = useState('');

  // Hanoi Time & Study Trace Logs State
  const [studyLogs, setStudyLogs] = useState(() => getStudyTimeLogs());

  const reloadData = async () => {
    setTransactions(getTransactions());
    setNotifications(getAdminNotifications());
    setTierLimits(getTierLimits());
    setMarketDecks(getMarketplaceDecks());
    setFirebaseConfig(getFirebaseConfig());
    setGeminiApiKey(getGeminiApiKey());
    setOpenaiApiKey(getOpenAIApiKey());
    setCommunityPosts(getCommunityPosts());
    setStudyLogs(getStudyTimeLogs());
    try {
      purgeAllTestAccounts();
      const [freshTxs, users] = await Promise.all([
        fetchFirestoreTransactions().catch(() => []),
        getAllUsersWithBalances().catch(() => [])
      ]);
      if (freshTxs && freshTxs.length > 0) {
        setTransactions(freshTxs);
      }
      if (users && users.length > 0) {
        setUserBalancesList(users);
      }
    } catch (e) {}
  };

  useEffect(() => {
    const handleAuthChange = (e) => {
      setAdminAuthenticated(!!e.detail?.authenticated);
    };
    const handleBalanceChange = () => {
      getAllUsersWithBalances().then(setUserBalancesList).catch(() => {});
    };
    window.addEventListener('onthi-admin-auth-change', handleAuthChange);
    window.addEventListener('onthi-user-balance-updated', handleBalanceChange);
    return () => {
      window.removeEventListener('onthi-admin-auth-change', handleAuthChange);
      window.removeEventListener('onthi-user-balance-updated', handleBalanceChange);
    };
  }, []);

  useEffect(() => {
    if (!adminAuthenticated) return;
    reloadData();
    // Real-time listener for Firestore & cross-device transactions
    const unsubscribe = subscribeToTransactions((latestTxs) => {
      setTransactions(latestTxs);
      getAllUsersWithBalances().then(setUserBalancesList).catch(() => {});
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [adminAuthenticated]);

  const handleUnlockAdmin = (e) => {
    e?.preventDefault();
    const trimmed = passwordInput.trim();
    if (!trimmed) {
      setPasswordError('Vui lòng nhập mật mã quản trị viên.');
      return;
    }
    setIsUnlocking(true);
    setTimeout(() => {
      if (verifyAdminPassword(trimmed)) {
        playSound('success');
        setAdminAuthenticated(true);
        setPasswordError('');
        setPasswordInput('');
        reloadData();
      } else {
        playSound('flip');
        setPasswordError('❌ Mật mã quản trị không chính xác! Quyền truy cập bị từ chối.');
        setPasswordInput('');
      }
      setIsUnlocking(false);
    }, 120);
  };

  // STRICT SECRET GATEKEEPER: REQUIRE MASTER PASSWORD CAYPIECE123!
  if (!adminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-14 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-800 dark:text-slate-100 shadow-xl animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-md">
          <Lock className="w-7 h-7 text-amber-400" />
        </div>

        <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
          HỆ THỐNG QUẢN TRỊ BẢO MẬT
        </span>

        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-3 mb-1">
          XÁC THỰC QUẢN TRỊ VIÊN
        </h2>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
          Khu vực giới hạn. Vui lòng nhập mã khóa bí mật để mở khóa bảng điều khiển.
        </p>

        <form onSubmit={handleUnlockAdmin} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
              Mật Mã Quản Trị (Admin Passkey):
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Nhập mật khẩu..."
                className={`w-full px-3.5 py-2.5 pr-10 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border ${
                  passwordError ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#2383e2] font-mono`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-1 animate-shake">
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isUnlocking}
            className="w-full py-2.5 rounded-xl bg-[#2383e2] hover:bg-[#1a73e8] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{isUnlocking ? 'Đang xác thực...' : 'Xác Nhận & Mở Khóa'}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            ← Quay Về Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  const handleManualSyncFirebase = async () => {
    setIsSyncingFirebase(true);
    try {
      const freshTxs = await fetchFirestoreTransactions();
      setTransactions(freshTxs);
      playSound('flip');
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  const handleApprove = async (txId) => {
    setApprovingTxId(txId);
    try {
      const ok = await adminApproveTransaction(txId);
      if (ok) {
        playSound('success');
        await reloadData();
      }
    } finally {
      setApprovingTxId(null);
    }
  };

  const handleReject = async (txId) => {
    const reason = prompt('Nhập lý do từ chối giao dịch:', 'Thông tin chuyển khoản không trùng khớp');
    if (reason !== null) {
      setApprovingTxId(txId);
      try {
        const ok = await adminRejectTransaction(txId, reason);
        if (ok) {
          await reloadData();
        }
      } finally {
        setApprovingTxId(null);
      }
    }
  };

  const filteredUsers = userBalancesList.filter((u) => {
    const q = userSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.displayName || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q) ||
      (u.tier || '').toLowerCase().includes(q) ||
      (u.status || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (userFilter === 'pending') return u.hasPending;
    if (userFilter === 'balance') return (u.currentBalance || 0) > 0;
    if (userFilter === 'vip') return u.tier === 'pro' || u.tier === 'ultra' || u.role === 'admin' || u.role === 'creator';
    if (userFilter === 'active') return u.status !== 'suspended';
    if (userFilter === 'locked') return u.status === 'suspended';
    return true;
  });

  const totalUsersCount = userBalancesList.length;
  const activeUsersCount = userBalancesList.filter((u) => u.status !== 'suspended').length;
  const suspendedUsersCount = userBalancesList.filter((u) => u.status === 'suspended').length;
  const verifiedUsersCount = userBalancesList.filter((u) => u.status === 'verified').length;
  const vipUsersCount = userBalancesList.filter((u) => u.tier === 'pro' || u.tier === 'ultra' || u.role === 'admin' || u.role === 'creator').length;
  const usersWithBalanceCount = userBalancesList.filter((u) => (u.currentBalance || 0) > 0).length;
  const totalCirculatingXu = userBalancesList.reduce((acc, u) => acc + (u.currentBalance || 0), 0);
  const totalDepositedXuAll = userBalancesList.reduce((acc, u) => acc + (u.totalDepositedXu || 0), 0);
  const totalWithdrawnXuAll = userBalancesList.reduce((acc, u) => acc + (u.totalWithdrawnXu || 0), 0);
  const totalPendingUsersCount = userBalancesList.filter((u) => u.hasPending).length;
  const totalPendingRequestsCount = userBalancesList.reduce(
    (acc, u) => acc + (u.pendingDeposits?.length || 0) + (u.pendingWithdrawals?.length || 0),
    0
  );

  const reloadUserBalances = async () => {
    setIsLoadingUserBalances(true);
    try {
      const [freshTxs, users] = await Promise.all([
        fetchFirestoreTransactions().catch(() => []),
        getAllUsersWithBalances().catch(() => [])
      ]);
      if (freshTxs && freshTxs.length > 0) setTransactions(freshTxs);
      if (users && users.length > 0) setUserBalancesList(users);
    } finally {
      setIsLoadingUserBalances(false);
    }
  };

  const handleDirectAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustModal.user || !adjustModal.amount) return;
    setIsAdjusting(true);
    try {
      const res = await adminDirectAdjustUserBalance({
        email: adjustModal.user.email,
        amountChange: adjustModal.amount,
        type: adjustModal.type,
        reason: adjustModal.reason || (adjustModal.type === 'deposit' ? 'Admin cộng Xu trực tiếp' : 'Admin trừ Xu trực tiếp')
      });
      if (res.success) {
        playSound('success');
        setAdjustToast(`✅ Đã ${adjustModal.type === 'deposit' ? 'cộng' : 'trừ'} ${adjustModal.amount} Xu cho ${adjustModal.user.email}!`);
        setAdjustModal({ isOpen: false, user: null, type: 'deposit', amount: 50, reason: '' });
        await reloadData();
        setTimeout(() => setAdjustToast(''), 4000);
      } else {
        alert(res.message || 'Lỗi khi xử lý số dư');
      }
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleDeleteUser = async (u) => {
    if (u.email === PRIMARY_ADMIN_EMAIL) {
      alert('Không thể xóa tài khoản Quản trị viên tối cao (Super Admin)!');
      return;
    }
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản "${u.displayName || u.email}" (${u.email}) không?\n\n• Số dư ví (${u.currentBalance} Xu) và toàn bộ lịch sử giao dịch liên quan sẽ bị xóa sạch khỏi hệ thống.`
    );
    if (!confirmed) return;

    const res = await adminDeleteUser(u.email);
    if (res.success) {
      playSound('flip');
      setAdjustToast(`🗑️ Đã xóa vĩnh viễn tài khoản ${u.email}!`);
      await reloadData();
      setTimeout(() => setAdjustToast(''), 4000);
    } else {
      alert(res.message || 'Không thể xóa tài khoản');
    }
  };


  const handleQuickPromote = async (u) => {
    playSound('flip');
    const res = await promoteUserTier(u.email);
    if (res.success) {
      playSound('success');
      setAdjustToast(`🚀 Đã TĂNG CẤP thành công cho ${u.displayName || u.email} lên gói ${res.tier.toUpperCase()}!`);
      await reloadData();
      setTimeout(() => setAdjustToast(''), 4000);
    } else {
      alert(res.message || 'Không thể tăng cấp');
    }
  };

  const handleQuickDemote = async (u) => {
    playSound('flip');
    const res = await demoteUserTier(u.email);
    if (res.success) {
      playSound('success');
      setAdjustToast(`🔻 Đã GIÁNG CẤP cho ${u.displayName || u.email} xuống gói ${res.tier.toUpperCase()}!`);
      await reloadData();
      setTimeout(() => setAdjustToast(''), 4000);
    } else {
      alert(res.message || 'Không thể giáng cấp');
    }
  };

  const handleQuickToggleSuspension = async (u) => {
    playSound('flip');
    const res = await toggleUserSuspension(u.email);
    if (res.success) {
      playSound('success');
      const isLocked = res.status === 'suspended';
      setAdjustToast(
        isLocked
          ? `🔒 Đã KHÓA / ĐÌNH CHỈ tài khoản ${u.email}!`
          : `🔓 Đã MỞ KHÓA tài khoản ${u.email} hoạt động bình thường!`
      );
      await reloadData();
      setTimeout(() => setAdjustToast(''), 4000);
    } else {
      alert(res.message || 'Không thể thay đổi trạng thái');
    }
  };

  const handleSaveStatusModal = async (e) => {
    e?.preventDefault();
    if (!statusModal.user) return;
    setIsUpdatingStatus(true);
    try {
      const res = await adminUpdateUserStatusAndTier({
        email: statusModal.user.email,
        tier: statusModal.tier,
        role: statusModal.role,
        status: statusModal.status
      });
      if (res.success) {
        playSound('success');
        setAdjustToast(`✅ Đã cập nhật Cấp Bậc (${res.tier.toUpperCase()}) & Trạng Thái (${res.status}) cho ${statusModal.user.email}!`);
        setStatusModal({ isOpen: false, user: null, tier: 'free', role: 'student', status: 'active' });
        await reloadData();
        setTimeout(() => setAdjustToast(''), 4000);
      } else {
        alert(res.message || 'Không thể cập nhật trạng thái');
      }
    } finally {
      setIsUpdatingStatus(false);
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

  const handleDeleteDeck = (deckId, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN bộ thẻ "${title || deckId}" khỏi Sàn Chợ Thẻ không?\nThao tác này sẽ xóa đồng bộ trên tất cả thiết bị của học viên.`)) {
      deleteMarketplaceDeck(deckId);
      playSound('flip');
      reloadData();
    }
  };

  // Community Moderation Actions (Admin Control)
  const handleAdminDeletePost = async (postId, author) => {
    if (window.confirm(`[Admin] Bạn có chắc chắn muốn XÓA VĨNH VIỄN bài viết của "${author || 'người dùng'}" (#${postId}) không?\nBài viết sẽ bị xóa khỏi diễn đàn và đồng bộ trên tất cả thiết bị của học viên.`)) {
      playSound('flip');
      const updated = await deleteCommunityPost(postId);
      setCommunityPosts(updated);
      setCommunityActionMsg(`🗑️ Đã xóa vĩnh viễn bài viết #${postId} thành công!`);
      setTimeout(() => setCommunityActionMsg(''), 4000);
    }
  };

  const handleAdminTogglePin = async (postId) => {
    playSound('flip');
    const updated = await togglePinCommunityPost(postId);
    setCommunityPosts(updated);
  };

  const handleAdminDeleteComment = async (postId, commentIndex) => {
    if (window.confirm(`[Admin] Bạn có chắc muốn xóa bình luận này không?`)) {
      playSound('flip');
      const updated = await deleteCommunityComment(postId, commentIndex);
      setCommunityPosts(updated);
      setCommunityActionMsg(`💬 Đã xóa bình luận thành công!`);
      setTimeout(() => setCommunityActionMsg(''), 4000);
    }
  };

  const handleAdminClearSpam = () => {
    if (window.confirm(`[Admin] Bạn có muốn dọn dẹp các bài viết spam / khôi phục danh sách diễn đàn mặc định?`)) {
      playSound('flip');
      const updated = clearSpamCommunityPosts(() => true);
      setCommunityPosts(updated);
      setCommunityActionMsg(`✨ Đã dọn dẹp và khôi phục diễn đàn về trạng thái sạch sẽ!`);
      setTimeout(() => setCommunityActionMsg(''), 4000);
    }
  };

  const handleExportCommunityJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(communityPosts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `onthi_community_posts_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    playSound('success');
  };

  const handleClearStudyLogs = () => {
    if (window.confirm(`[Admin] Bạn có chắc muốn xóa toàn bộ vết thời gian học tập hệ thống không?`)) {
      try {
        localStorage.removeItem('onthi_study_time_logs_v1');
        setStudyLogs([]);
        playSound('flip');
      } catch (e) {}
    }
  };

  // Firebase Snippet Auto-Parser
  const handleParseSnippet = (snippet) => {
    setRawSnippet(snippet);
    if (!snippet.trim()) return;

    try {
      const extracted = { ...firebaseConfig };
      const apiKeyMatch = snippet.match(/apiKey\s*:\s*["']([^"']+)["']/i);
      const authDomainMatch = snippet.match(/authDomain\s*:\s*["']([^"']+)["']/i);
      const projectIdMatch = snippet.match(/projectId\s*:\s*["']([^"']+)["']/i);
      const storageBucketMatch = snippet.match(/storageBucket\s*:\s*["']([^"']+)["']/i);
      const messagingSenderIdMatch = snippet.match(/messagingSenderId\s*:\s*["']([^"']+)["']/i);
      const appIdMatch = snippet.match(/appId\s*:\s*["']([^"']+)["']/i);

      let foundAny = false;
      if (apiKeyMatch) { extracted.apiKey = apiKeyMatch[1]; foundAny = true; }
      if (authDomainMatch) { extracted.authDomain = authDomainMatch[1]; foundAny = true; }
      if (projectIdMatch) { extracted.projectId = projectIdMatch[1]; foundAny = true; }
      if (storageBucketMatch) { extracted.storageBucket = storageBucketMatch[1]; foundAny = true; }
      if (messagingSenderIdMatch) { extracted.messagingSenderId = messagingSenderIdMatch[1]; foundAny = true; }
      if (appIdMatch) { extracted.appId = appIdMatch[1]; foundAny = true; }

      // Try raw JSON parse if snippet is valid JSON
      try {
        const jsonParsed = JSON.parse(snippet.trim());
        if (jsonParsed.apiKey) {
          Object.assign(extracted, jsonParsed);
          foundAny = true;
        }
      } catch (je) {}

      if (foundAny) {
        setFirebaseConfig(extracted);
        playSound('success');
        setFirebaseSaveMsg('✨ Đã tự động bóc tách các trường từ mã Firebase Console thành công!');
        setTimeout(() => setFirebaseSaveMsg(''), 4000);
      }
    } catch (e) {
      console.warn('Snippet parse warning:', e);
    }
  };

  // Live Ping Connection Test
  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await testFirebaseConnection(firebaseConfig);
      setTestResult(res);
      if (res.success) {
        playSound('success');
      }
    } catch (err) {
      setTestResult({
        success: false,
        isReal: false,
        message: 'Lỗi kiểm tra kết nối: ' + err.message
      });
    } finally {
      setTestingConnection(false);
    }
  };

  // Save to LocalStorage
  const handleSaveFirebaseConfig = (e) => {
    e.preventDefault();
    saveFirebaseConfig(firebaseConfig);
    playSound('success');
    setFirebaseSaveMsg('✅ Đã lưu cấu hình Firebase Cloud vào trình duyệt thành công!');
    setTimeout(() => setFirebaseSaveMsg(''), 4000);
  };


  // Copy for Vercel .env format
  const handleCopyVercelEnv = () => {
    const envString = [
      `VITE_FIREBASE_API_KEY=${firebaseConfig.apiKey || ''}`,
      `VITE_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain || ''}`,
      `VITE_FIREBASE_PROJECT_ID=${firebaseConfig.projectId || ''}`,
      `VITE_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket || ''}`,
      `VITE_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId || ''}`,
      `VITE_FIREBASE_APP_ID=${firebaseConfig.appId || ''}`
    ].join('\n');

    navigator.clipboard.writeText(envString);
    playSound('success');
    setCopiedVercelEnv(true);
    setTimeout(() => setCopiedVercelEnv(false), 3000);
  };

  // AI API Handlers
  const handleSaveAiKey = (e) => {
    e.preventDefault();
    saveGeminiApiKey(geminiApiKey);
    saveOpenAIApiKey(openaiApiKey);
    playSound('success');
    setAiSaveMsg('✅ Đã lưu cấu hình API Key AI thành công! Toàn bộ học viên sẽ dùng key này khi tạo thẻ.');
    setTimeout(() => setAiSaveMsg(''), 4000);
  };

  const handleTestAiKey = async () => {
    setTestingAiKey(true);
    setAiTestResult(null);
    try {
      const messages = [];
      let overallSuccess = false;

      if (geminiApiKey && geminiApiKey.trim()) {
        const geminiRes = await testGeminiApiKey(geminiApiKey);
        messages.push(`Google Gemini: ${geminiRes.message}`);
        if (geminiRes.success) overallSuccess = true;
      }

      if (openaiApiKey && openaiApiKey.trim()) {
        const openaiRes = await testOpenAiApiKey(openaiApiKey);
        messages.push(`OpenAI: ${openaiRes.message}`);
        if (openaiRes.success) overallSuccess = true;
      }

      if (messages.length === 0) {
        messages.push('Chưa nhập API Key Gemini hoặc OpenAI để kiểm tra!');
      }

      setAiTestResult({
        success: overallSuccess,
        message: messages.join('\n\n')
      });

      if (overallSuccess) {
        playSound('success');
      }
    } catch (e) {
      setAiTestResult({ success: false, message: e.message });
    } finally {
      setTestingAiKey(false);
    }
  };

  const handleCopyAiEnv = () => {
    const envStr = [
      `VITE_GEMINI_API_KEY=${geminiApiKey || ''}`,
      `VITE_OPENAI_API_KEY=${openaiApiKey || ''}`
    ].join('\n');
    navigator.clipboard.writeText(envStr);
    playSound('success');
    setCopiedAiEnv(true);
    setTimeout(() => setCopiedAiEnv(false), 3000);
  };

  // Save Telegram Config
  const handleSaveTelegram = (e) => {
    e.preventDefault();
    saveTelegramConfig(telegramConfig);
    playSound('success');
    setTelegramSaveMsg('✅ Đã lưu cấu hình Telegram Bot thành công!');
    setTimeout(() => setTelegramSaveMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* ADMIN HEADER (Wayground Dark Velvet Wine Card) */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 p-6 rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2383e2] flex items-center justify-center font-bold shadow-md shadow-pink-900/40">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                CỬA SỔ QUẢN TRỊ VIÊN (SECRET ADMIN PORTAL)
              </h2>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-50 text-[#2383e2] dark:bg-sky-950/80 dark:text-sky-300 border border-blue-200 dark:border-sky-800">
                Duyệt Chay 24/7
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-normal flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Admin Phone: <strong className="text-amber-700 dark:text-amber-300 font-mono font-black">{ADMIN_PHONE}</strong></span>
              <span>•</span>
              <span>Email: <strong className="text-amber-700 dark:text-amber-300 font-mono font-bold">{ADMIN_EMAIL}</strong></span>
              <span>•</span>
              <span>Web Push: <a href={ADMIN_NTFY_TOPIC} target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 font-mono underline hover:text-sky-800 dark:hover:text-white font-bold">ntfy.sh Topic</a></span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenChangelog && (
            <button
              onClick={onOpenChangelog}
              className="px-3.5 py-2 bg-gradient-to-r from-[#2383e2] to-[#2383e2] hover:opacity-95 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-md shadow-pink-900/40 transition-transform transform hover:scale-105 active:scale-95"
              title="Xem bảng tin cập nhật tính năng mới nhất"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>Bảng Tin Bản Mới (v3.0)</span>
            </button>
          )}
          <button
            onClick={reloadData}
            className="p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              logoutAdminSession();
              setAdminAuthenticated(false);
              playSound('flip');
            }}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/80 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Khóa lại cửa sổ quản trị và đăng xuất phiên"
          >
            <Lock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Khóa Lại (Đăng Xuất)</span>
          </button>
          <button
            onClick={onBackToHome}
            className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#2383e2]" />
            <span>Quay Lại Trang Chủ</span>
          </button>
        </div>
      </div>

      {/* ADMIN TABS SWITCHER (Wayground Warm Cream Container) */}
      <div className="bg-white dark:bg-slate-900/95 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-xs sm:text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('user_balances')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'user_balances'
                ? 'border-[#2383e2] text-[#2383e2] dark:text-sky-400 bg-white dark:bg-slate-800/90 font-black shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-semibold'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Bảng Trạng Thái & Quản Lý Học Viên</span>
            {totalPendingUsersCount > 0 ? (
              <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-black animate-pulse">
                {totalPendingUsersCount} chờ duyệt
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-[10px] font-bold">
                {userBalancesList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'transactions'
                ? 'border-[#2383e2] text-[#2383e2] dark:text-sky-400 bg-white dark:bg-slate-800/90 font-black shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-semibold'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Duyệt Nạp & Rút Tiền</span>
            {transactions.filter(t => t.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#2383e2] text-white rounded-full text-[10px]">
                {transactions.filter(t => t.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'community'
                ? 'border-[#2383e2] text-[#2383e2] dark:text-sky-400 bg-white dark:bg-slate-800/90 font-black shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-semibold'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <span>Quản Lý Diễn Đàn & Xóa Bài</span>
            <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 rounded-full text-[10px] font-bold">
              {communityPosts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tiers')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'tiers'
                ? 'border-[#2383e2] text-[#2383e2] dark:text-sky-400 bg-white dark:bg-slate-800/90 font-black shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-semibold'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#2383e2]" />
            <span>Tùy Chỉnh Giới Hạn Gói (Free/Plus/Pro/Ultra)</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'marketplace'
                ? 'border-[#2383e2] text-[#2383e2] dark:text-sky-400 bg-white dark:bg-slate-800/90 font-black shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-semibold'
            }`}
          >
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Quản Lý Sàn C2C ({marketDecks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('system_logs')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'system_logs'
                ? 'border-[#2383e2] text-[#2383e2] dark:text-sky-400 bg-white dark:bg-slate-800/90 font-black shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-semibold'
            }`}
          >
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Vết Giờ Hà Nội & Nhật Ký ({studyLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'notifications'
                ? 'border-[#2383e2] text-[#2383e2] dark:text-sky-400 bg-white dark:bg-slate-800/90 font-black shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-semibold'
            }`}
          >
            <BellRing className="w-4 h-4 text-[#2383e2]" />
            <span>Nhật Ký Thông Báo ({notifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'firebase'
                ? 'border-[#2383e2] text-[#2383e2] dark:text-sky-400 bg-white dark:bg-slate-800/90 font-black shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-semibold'
            }`}
          >
            <Database className="w-4 h-4 text-amber-500" />
            <span>Cấu Hình Firebase Cloud</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              isRealFirebaseConfigured() ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {isRealFirebaseConfigured() ? '🟢 Cloud Thật' : '🟡 Chưa Cấu Hình'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('blindbox')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'blindbox'
                ? 'border-[#2383e2] text-[#2383e2] dark:text-sky-400 bg-white dark:bg-slate-800/90 font-black shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-semibold'
            }`}
          >
            <Gift className="w-4 h-4 text-purple-600" />
            <span>Tỷ Lệ Túi Mù (Gacha)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Nhà Cái 80%+
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ai_api')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'ai_api'
                ? 'border-[#2383e2] text-[#2383e2] dark:text-sky-400 bg-white dark:bg-slate-800/90 font-black shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-semibold'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-600" />
            <span>Thẻ API Key AI (ÔnThiHub Cloud)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              hasValidAiKey() ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {hasValidAiKey() ? '🟢 Đã Kích Hoạt' : '🔴 Chưa Có Key'}
            </span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-6 sm:p-8">
          
          {/* TAB 0: CHI TIẾT SỐ DƯ HỌC VIÊN & DUYỆT NẠP/RÚT */}
          {activeTab === 'user_balances' && (
            <div className="space-y-6">
              {/* BẢNG TRẠNG THÁI & CHỈ SỐ HỆ THỐNG (STATUS DASHBOARD) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Bảng Trạng Thái & Thống Kê Học Viên
                    </h3>
                  </div>
                  <div className="hidden sm:flex items-center space-x-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">+{totalDepositedXuAll.toLocaleString()} Xu đã nạp</span>
                    <span>•</span>
                    <span className="text-rose-600 dark:text-rose-400 font-black">-{totalWithdrawnXuAll.toLocaleString()} Xu đã rút</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* 1. Tổng Học Viên */}
                  <div className="p-3.5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-[#2383e2] dark:text-sky-400 flex items-center justify-center shrink-0 border border-blue-200/60 dark:border-blue-900/40">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Tổng Học Viên
                      </span>
                      <strong className="text-base font-black text-slate-900 dark:text-white block truncate">
                        {totalUsersCount} nick
                      </strong>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">
                        {verifiedUsersCount > 0 ? `${verifiedUsersCount} nick tích xanh` : 'Hệ thống ghi nhận'}
                      </span>
                    </div>
                  </div>

                  {/* 2. Đang Hoạt Động */}
                  <div className="p-3.5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/60 dark:border-emerald-900/40">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Đang Hoạt Động
                      </span>
                      <strong className="text-base font-black text-emerald-600 dark:text-emerald-400 block truncate">
                        {activeUsersCount} nick
                      </strong>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block">
                        {((activeUsersCount / (totalUsersCount || 1)) * 100).toFixed(0)}% bình thường
                      </span>
                    </div>
                  </div>

                  {/* 3. Bị Khóa / Đình Chỉ */}
                  <div className={`p-3.5 rounded-2xl border shadow-xs flex items-center space-x-3 transition-colors ${
                    suspendedUsersCount > 0
                      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
                  }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      suspendedUsersCount > 0
                        ? 'bg-rose-500 text-white border-rose-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}>
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Đã Bị Khóa
                      </span>
                      <strong className={`text-base font-black block truncate ${
                        suspendedUsersCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {suspendedUsersCount} nick
                      </strong>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">
                        {suspendedUsersCount > 0 ? 'Đình chỉ truy cập' : 'Không có vi phạm'}
                      </span>
                    </div>
                  </div>

                  {/* 4. Cấp Bậc VIP / Ultra */}
                  <div className="p-3.5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200/60 dark:border-purple-900/40">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Gói VIP / Pro
                      </span>
                      <strong className="text-base font-black text-purple-600 dark:text-purple-400 block truncate">
                        {vipUsersCount} nick
                      </strong>
                      <span className="text-[10px] text-purple-700 dark:text-purple-400 font-semibold block">
                        Ultra / Pro / VIP
                      </span>
                    </div>
                  </div>

                  {/* 5. Lệnh Chờ Duyệt */}
                  <div className={`p-3.5 rounded-2xl border shadow-xs flex items-center space-x-3 transition-all ${
                    totalPendingRequestsCount > 0
                      ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/80'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
                  }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      totalPendingRequestsCount > 0
                        ? 'bg-amber-500 text-white border-amber-400 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Chờ Duyệt
                      </span>
                      <strong className={`text-base font-black block truncate ${
                        totalPendingRequestsCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {totalPendingRequestsCount} lệnh
                      </strong>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block truncate">
                        {totalPendingUsersCount} người yêu cầu
                      </span>
                    </div>
                  </div>

                  {/* 6. Tổng Xu Lưu Hành */}
                  <div className="p-3.5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/60 dark:border-amber-900/40">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Tổng Xu Ví
                      </span>
                      <strong className="text-base font-black text-amber-600 dark:text-amber-400 block truncate">
                        {totalCirculatingXu.toLocaleString()} Xu
                      </strong>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block truncate">
                        ~{(totalCirculatingXu * COIN_RATE_VND).toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTROLS BAR: SEARCH, FILTERS, VIEW MODE & ACTIONS */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2 flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên, email, vai trò, cấp bậc, trạng thái..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-8 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2383e2] transition-colors"
                    />
                    {userSearchQuery && (
                      <button
                        onClick={() => setUserSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Filters & View Mode Switcher */}
                <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
                  <div className="flex items-center space-x-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
                    <button
                      onClick={() => setUserFilter('all')}
                      className={`px-3 py-1.5 rounded-lg font-black transition-all ${
                        userFilter === 'all'
                          ? 'bg-[#2383e2] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Tất Cả ({totalUsersCount})
                    </button>
                    <button
                      onClick={() => setUserFilter('active')}
                      className={`px-3 py-1.5 rounded-lg font-black transition-all flex items-center space-x-1 ${
                        userFilter === 'active'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      }`}
                    >
                      <span>🟢 Hoạt Động</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                        {activeUsersCount}
                      </span>
                    </button>
                    <button
                      onClick={() => setUserFilter('locked')}
                      className={`px-3 py-1.5 rounded-lg font-black transition-all flex items-center space-x-1 ${
                        userFilter === 'locked'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                      }`}
                    >
                      <span>🔒 Bị Khóa</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-200">
                        {suspendedUsersCount}
                      </span>
                    </button>
                    <button
                      onClick={() => setUserFilter('vip')}
                      className={`px-3 py-1.5 rounded-lg font-black transition-all ${
                        userFilter === 'vip'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      VIP ({vipUsersCount})
                    </button>
                    <button
                      onClick={() => setUserFilter('pending')}
                      className={`px-3 py-1.5 rounded-lg font-black transition-all flex items-center space-x-1 ${
                        userFilter === 'pending'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                      }`}
                    >
                      <span>⚠️ Chờ Duyệt</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                        {totalPendingUsersCount}
                      </span>
                    </button>
                    <button
                      onClick={() => setUserFilter('balance')}
                      className={`px-3 py-1.5 rounded-lg font-black transition-all ${
                        userFilter === 'balance'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Có Số Dư ({usersWithBalanceCount})
                    </button>
                  </div>

                  {/* View Mode Toggle: Table View vs Card View */}
                  <div className="flex items-center bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => setUserViewMode('table')}
                      className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-black transition-all ${
                        userViewMode === 'table'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Hiển thị dạng Bảng Trạng Thái (Table)"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>Dạng Bảng</span>
                    </button>
                    <button
                      onClick={() => setUserViewMode('cards')}
                      className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-black transition-all ${
                        userViewMode === 'cards'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Hiển thị dạng Ô Thẻ (Cards)"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Dạng Thẻ</span>
                    </button>
                  </div>

                  <button
                    onClick={reloadUserBalances}
                    disabled={isLoadingUserBalances}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 shadow-xs transition-colors shrink-0"
                    title="Đồng bộ lại danh sách và số dư mới nhất từ Firebase & thiết bị"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#2383e2] ${isLoadingUserBalances ? 'animate-spin' : ''}`} />
                    <span>{isLoadingUserBalances ? 'Đang Tải...' : 'Làm Mới'}</span>
                  </button>
                </div>
              </div>

              {/* USER LIST: TABLE VIEW OR CARDS VIEW */}
              {isLoadingUserBalances ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                        <div className="space-y-1.5 flex-1">
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="h-20 bg-slate-100 dark:bg-slate-800/60 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-black text-slate-700 dark:text-slate-300">Không tìm thấy học viên nào phù hợp bộ lọc.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hãy thử xóa từ khóa tìm kiếm hoặc chọn bộ lọc "Tất Cả".</p>
                </div>
              ) : userViewMode === 'table' ? (
                /* BẢNG TRẠNG THÁI & CẤP BẬC TÀI KHOẢN (FULL TABLE VIEW) */
                <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 uppercase tracking-wider font-black">
                        <tr>
                          <th className="p-3.5 whitespace-nowrap">Học Viên</th>
                          <th className="p-3.5 whitespace-nowrap">Email</th>
                          <th className="p-3.5 whitespace-nowrap">Số Dư Ví</th>
                          <th className="p-3.5 whitespace-nowrap">Cấp Bậc (Tier)</th>
                          <th className="p-3.5 whitespace-nowrap">Vai Trò (Role)</th>
                          <th className="p-3.5 whitespace-nowrap">Trạng Thái (Status)</th>
                          <th className="p-3.5 whitespace-nowrap">Yêu Cầu Chờ</th>
                          <th className="p-3.5 whitespace-nowrap text-right">Thao Tác Quản Trị</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
                        {filteredUsers.map((u) => {
                          const isLocked = u.status === 'suspended';
                          return (
                            <tr
                              key={u.email}
                              className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                                u.hasPending ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''
                              }`}
                            >
                              {/* Cột 1: Học Viên */}
                              <td className="p-3.5">
                                <div className="flex items-center space-x-2.5">
                                  <img
                                    src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email)}`}
                                    alt={u.displayName}
                                    className="w-9 h-9 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                                    onError={(e) => {
                                      e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email)}`;
                                    }}
                                  />
                                  <div className="min-w-0">
                                    <div className="flex items-center space-x-1.5 flex-wrap">
                                      <span className="font-black text-slate-900 dark:text-white truncate max-w-[130px] block">
                                        {u.displayName || u.email.split('@')[0]}
                                      </span>
                                      {u.isCurrentDeviceUser && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                                          Thiết bị này
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal block">
                                      {u.transactionCount || 0} lệnh GD
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Cột 2: Email */}
                              <td className="p-3.5">
                                <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                                  <span className="truncate max-w-[140px] sm:max-w-xs">{u.email}</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard?.writeText(u.email);
                                      setCopiedUserEmail(u.email);
                                      setTimeout(() => setCopiedUserEmail(''), 2000);
                                    }}
                                    title="Sao chép email"
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 shrink-0"
                                  >
                                    {copiedUserEmail === u.email ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              </td>

                              {/* Cột 3: Số Dư Ví */}
                              <td className="p-3.5">
                                <strong className="text-amber-600 dark:text-amber-400 font-black text-sm block">
                                  {u.currentBalance.toLocaleString()} Xu
                                </strong>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block">
                                  ~{(u.currentBalance * COIN_RATE_VND).toLocaleString()}đ
                                </span>
                              </td>

                              {/* Cột 4: Cấp Bậc (Tier) */}
                              <td className="p-3.5">
                                <div className="flex items-center space-x-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setStatusModal({ isOpen: true, user: u, tier: u.tier || 'free', role: u.role || 'student', status: u.status || 'active' })}
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border transition-colors ${
                                      u.tier === 'ultra'
                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                                        : u.tier === 'pro'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800'
                                        : u.tier === 'plus'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-sky-300 border-blue-300 dark:border-blue-800'
                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                    }`}
                                    title="Bấm để mở trình tùy chỉnh cấp bậc & status"
                                  >
                                    {u.tier === 'ultra' ? '👑 ULTRA' : u.tier === 'pro' ? '🚀 PRO' : u.tier === 'plus' ? '⭐ PLUS' : 'FREE'}
                                  </button>

                                  {/* Inline Promote / Demote */}
                                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded p-0.5 border border-slate-200 dark:border-slate-700 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleQuickPromote(u)}
                                      disabled={u.tier === 'ultra'}
                                      className="p-0.5 rounded hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-500 hover:text-emerald-600 disabled:opacity-20 transition-colors"
                                      title="Tăng 1 cấp bậc (Promote tier: Free -> Plus -> Pro -> Ultra)"
                                    >
                                      <ChevronUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleQuickDemote(u)}
                                      disabled={u.tier === 'free'}
                                      className="p-0.5 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-500 hover:text-rose-600 disabled:opacity-20 transition-colors"
                                      title="Giáng 1 cấp bậc (Demote tier: Ultra -> Pro -> Plus -> Free)"
                                    >
                                      <ChevronDown className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* Cột 5: Vai Trò (Role) */}
                              <td className="p-3.5">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  u.role === 'admin'
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                    : u.role === 'creator'
                                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                    : u.role === 'vip'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                }`}>
                                  {u.role === 'admin' ? '🛡️ Admin' : u.role === 'creator' ? '🎓 Creator' : u.role === 'vip' ? '💎 VIP' : '👨‍🎓 Học Viên'}
                                </span>
                              </td>

                              {/* Cột 6: Trạng Thái (Status) */}
                              <td className="p-3.5">
                                <div className="flex items-center space-x-1.5">
                                  {isLocked ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                                      🔒 Đã Khóa
                                    </span>
                                  ) : u.status === 'verified' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                                      🔵 Tích Xanh
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                      🟢 Hoạt Động
                                    </span>
                                  )}

                                  {u.email !== PRIMARY_ADMIN_EMAIL && (
                                    <button
                                      onClick={() => handleQuickToggleSuspension(u)}
                                      className={`p-1 rounded-md border transition-colors ${
                                        isLocked
                                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-rose-600'
                                      }`}
                                      title={isLocked ? 'Mở khóa tài khoản này' : 'Khóa / Đình chỉ tài khoản này'}
                                    >
                                      {isLocked ? <Unlock className="w-3 h-3 text-amber-600" /> : <Lock className="w-3 h-3" />}
                                    </button>
                                  )}
                                </div>
                              </td>

                              {/* Cột 7: Yêu Cầu Chờ (Duyệt Nhanh 1-Click) */}
                              <td className="p-3.5">
                                {u.hasPending ? (
                                  <div className="space-y-1">
                                    {u.pendingDeposits?.map((tx) => (
                                      <div key={tx.id} className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                                          NẠP +{tx.xuAmount} Xu
                                        </span>
                                        <button
                                          onClick={() => handleApprove(tx.id)}
                                          disabled={approvingTxId === tx.id}
                                          className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] shadow-xs transition-colors shrink-0"
                                        >
                                          {approvingTxId === tx.id ? '...' : 'Duyệt'}
                                        </button>
                                        <button
                                          onClick={() => handleReject(tx.id)}
                                          disabled={approvingTxId === tx.id}
                                          className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 hover:bg-rose-200 text-[10px] font-black border border-rose-300 shrink-0"
                                        >
                                          Từ chối
                                        </button>
                                      </div>
                                    ))}
                                    {u.pendingWithdrawals?.map((tx) => (
                                      <div key={tx.id} className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 shrink-0">
                                          RÚT -{tx.xuAmount} Xu
                                        </span>
                                        <button
                                          onClick={() => handleApprove(tx.id)}
                                          disabled={approvingTxId === tx.id}
                                          className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] shadow-xs transition-colors shrink-0"
                                        >
                                          {approvingTxId === tx.id ? '...' : 'Duyệt'}
                                        </button>
                                        <button
                                          onClick={() => handleReject(tx.id)}
                                          disabled={approvingTxId === tx.id}
                                          className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 hover:bg-rose-200 text-[10px] font-black border border-rose-300 shrink-0"
                                        >
                                          Từ chối
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-400 dark:text-slate-500 text-[11px] italic font-medium">Không có</span>
                                )}
                              </td>

                              {/* Cột 8: Thao Tác Quản Trị */}
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end space-x-1 flex-wrap gap-y-1">
                                  <button
                                    onClick={() => setAdjustModal({ isOpen: true, user: u, type: 'deposit', amount: 50, reason: '' })}
                                    className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/90 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-black text-[11px] transition-colors"
                                    title="Cộng Xu trực tiếp cho học viên"
                                  >
                                    + Nạp
                                  </button>

                                  <button
                                    onClick={() => setAdjustModal({ isOpen: true, user: u, type: 'withdraw', amount: Math.min(u.currentBalance, 50), reason: '' })}
                                    disabled={u.currentBalance <= 0}
                                    className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/70 dark:hover:bg-rose-900/90 disabled:opacity-30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-black text-[11px] transition-colors"
                                    title="Trừ Xu trực tiếp"
                                  >
                                    - Trừ
                                  </button>

                                  <button
                                    onClick={() => setStatusModal({ isOpen: true, user: u, tier: u.tier || 'free', role: u.role || 'student', status: u.status || 'active' })}
                                    className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/70 dark:hover:bg-blue-900/90 text-[#2383e2] dark:text-sky-300 border border-blue-200 dark:border-blue-800 transition-colors"
                                    title="Tùy chỉnh Cấp Bậc & Status tài khoản"
                                  >
                                    <TrendingUp className="w-3.5 h-3.5" />
                                  </button>

                                  {onOpenDirectChat && (
                                    <button
                                      onClick={() => onOpenDirectChat({
                                        id: u.email,
                                        name: u.displayName || u.email.split('@')[0],
                                        avatar: u.photoURL,
                                        role: u.role,
                                        tier: u.tier
                                      })}
                                      className="p-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/70 dark:hover:bg-sky-900/90 text-[#2383e2] dark:text-sky-300 border border-sky-200 dark:border-sky-800 transition-colors"
                                      title={`Nhắn tin trực tiếp với ${u.displayName || u.email}`}
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  <button
                                    onClick={() => setSelectedUserHistory(u)}
                                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                                    title="Xem lịch sử giao dịch"
                                  >
                                    <History className="w-3.5 h-3.5" />
                                  </button>

                                  {u.email !== PRIMARY_ADMIN_EMAIL && (
                                    <button
                                      onClick={() => handleDeleteUser(u)}
                                      className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition-colors"
                                      title={`Xóa vĩnh viễn tài khoản ${u.email}`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* DẠNG THẺ (CARD VIEW) */
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {filteredUsers.map((u) => (
                    <div
                      key={u.email}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        u.hasPending
                          ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-md ring-2 ring-amber-400/30'
                          : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Card Header: Avatar, Name, Email, Badges */}
                        <div className="flex items-start justify-between gap-3 mb-3.5">
                          <div className="flex items-center space-x-3 min-w-0">
                            <img
                              src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email)}`}
                              alt={u.displayName}
                              className="w-12 h-12 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                              onError={(e) => {
                                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email)}`;
                              }}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center space-x-2 flex-wrap gap-y-0.5">
                                <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                                  {u.displayName || u.email?.split('@')[0]}
                                </h4>
                                {u.isCurrentDeviceUser && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                    Thiết bị này
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                <span className="truncate max-w-[160px] sm:max-w-xs">{u.email}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard?.writeText(u.email);
                                    setCopiedUserEmail(u.email);
                                    setTimeout(() => setCopiedUserEmail(''), 2000);
                                  }}
                                  title="Sao chép email"
                                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                  {copiedUserEmail === u.email ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Badges & Inline Promote/Demote */}
                          <div className="flex flex-col items-end space-y-1.5 shrink-0">
                            {/* Role & Status */}
                            <div className="flex items-center space-x-1">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                u.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                  : u.role === 'creator'
                                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                  : u.role === 'vip'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                              }`}>
                                {u.role === 'admin' ? '🛡️ Admin' : u.role === 'creator' ? '🎓 Creator' : u.role === 'vip' ? '💎 VIP' : '👨‍🎓 Học Viên'}
                              </span>

                              {u.status === 'suspended' ? (
                                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                                  🔒 Đã Khóa
                                </span>
                              ) : u.status === 'verified' ? (
                                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                                  🔵 Tích Xanh
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  🟢 Hoạt Động
                                </span>
                              )}
                            </div>

                            {/* Tier Badge with Inline Promote / Demote Controls */}
                            <div className="flex items-center space-x-1">
                              <button
                                type="button"
                                onClick={() => setStatusModal({ isOpen: true, user: u, tier: u.tier || 'free', role: u.role || 'student', status: u.status || 'active' })}
                                className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/80 dark:hover:bg-blue-900/80 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-900 uppercase transition-colors"
                                title="Bấm để mở trình quản lý cấp bậc & status"
                              >
                                Gói: {u.tier || 'free'}
                              </button>

                              {/* 1-Click Promote / Demote arrows */}
                              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                                <button
                                  type="button"
                                  onClick={() => handleQuickPromote(u)}
                                  disabled={u.tier === 'ultra'}
                                  className="p-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-500 hover:text-emerald-600 disabled:opacity-20 transition-colors"
                                  title="Tăng 1 cấp bậc (Promote tier: Free -> Plus -> Pro -> Ultra)"
                                >
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickDemote(u)}
                                  disabled={u.tier === 'free'}
                                  className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-500 hover:text-rose-600 disabled:opacity-20 transition-colors"
                                  title="Giáng 1 cấp bậc (Demote tier: Ultra -> Pro -> Plus -> Free)"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Balance Display Box */}
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700/80 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                              <Coins className="w-4 h-4 text-amber-500" />
                              <span>Số dư ví khả dụng:</span>
                            </span>
                            <div className="text-right">
                              <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                                {u.currentBalance.toLocaleString()} Xu
                              </span>
                              <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                ~{(u.currentBalance * COIN_RATE_VND).toLocaleString()}đ
                              </span>
                            </div>
                          </div>

                          {/* Financial Sub-metrics */}
                          <div className="grid grid-cols-3 gap-2 pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 text-center text-[11px]">
                            <div>
                              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Tổng Đã Nạp</span>
                              <strong className="text-emerald-600 dark:text-emerald-400 font-black">
                                +{(u.totalDepositedXu || 0).toLocaleString()} Xu
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Tổng Đã Rút</span>
                              <strong className="text-rose-600 dark:text-rose-400 font-black">
                                -{(u.totalWithdrawnXu || 0).toLocaleString()} Xu
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Số Lệnh GD</span>
                              <strong className="text-slate-700 dark:text-slate-300 font-black">
                                {u.transactionCount || 0} lệnh
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* PENDING REQUESTS SECTION & INLINE APPROVAL BUTTONS */}
                        {u.hasPending && (
                          <div className="space-y-2 mb-3 p-3 bg-amber-100/70 dark:bg-amber-950/50 rounded-xl border border-amber-300 dark:border-amber-800">
                            <div className="flex items-center justify-between text-xs font-black text-amber-900 dark:text-amber-200">
                              <span className="flex items-center space-x-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                                <span>Lệnh chờ duyệt của học viên này:</span>
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                                {(u.pendingDeposits?.length || 0) + (u.pendingWithdrawals?.length || 0)} lệnh
                              </span>
                            </div>

                            {/* Pending Deposits */}
                            {u.pendingDeposits?.map((tx) => (
                              <div key={tx.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-xs">
                                <div>
                                  <div className="flex items-center space-x-1.5 flex-wrap">
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                      NẠP XU
                                    </span>
                                    <strong className="font-mono text-slate-800 dark:text-slate-200">#{tx.id}</strong>
                                    <span className="text-slate-400 text-[10px]">• {formatHanoiDateTime(tx.createdAt)}</span>
                                  </div>
                                  <div className="mt-0.5 font-black text-emerald-600 dark:text-emerald-400">
                                    +{tx.xuAmount} Xu <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">(~{(tx.amountVnd || tx.xuAmount * COIN_RATE_VND).toLocaleString()}đ)</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1.5 shrink-0">
                                  <button
                                    onClick={() => handleApprove(tx.id)}
                                    disabled={approvingTxId === tx.id}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs shadow-xs flex items-center space-x-1 transition-all"
                                  >
                                    {approvingTxId === tx.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                    <span>Duyệt Nạp</span>
                                  </button>
                                  <button
                                    onClick={() => handleReject(tx.id)}
                                    disabled={approvingTxId === tx.id}
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-black text-xs border border-rose-300 dark:border-rose-800 transition-all"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Từ Chối</span>
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Pending Withdrawals */}
                            {u.pendingWithdrawals?.map((tx) => (
                              <div key={tx.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-xs">
                                <div>
                                  <div className="flex items-center space-x-1.5 flex-wrap">
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                      RÚT TIỀN
                                    </span>
                                    <strong className="font-mono text-slate-800 dark:text-slate-200">#{tx.id}</strong>
                                    <span className="text-slate-400 text-[10px]">• {formatHanoiDateTime(tx.createdAt)}</span>
                                  </div>
                                  <div className="mt-0.5 font-black text-rose-600 dark:text-rose-400">
                                    -{tx.xuAmount} Xu <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">(~{(tx.amountVnd || tx.xuAmount * COIN_RATE_VND).toLocaleString()}đ)</span>
                                  </div>
                                  {tx.details && (
                                    <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                                      {tx.details.bankName} • STK: <span className="font-mono font-bold text-[#2383e2]">{tx.details.accountNo}</span> ({tx.details.accountName})
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1.5 shrink-0">
                                  <button
                                    onClick={() => handleApprove(tx.id)}
                                    disabled={approvingTxId === tx.id}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs shadow-xs flex items-center space-x-1 transition-all"
                                  >
                                    {approvingTxId === tx.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                    <span>Duyệt Rút</span>
                                  </button>
                                  <button
                                    onClick={() => handleReject(tx.id)}
                                    disabled={approvingTxId === tx.id}
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-black text-xs border border-rose-300 dark:border-rose-800 transition-all"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Từ Chối</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* QUICK ACTION BUTTONS ON EACH BOX ("ở bên cạnh / dưới mỗi ô") */}
                      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => setAdjustModal({ isOpen: true, user: u, type: 'deposit', amount: 50, reason: '' })}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/90 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-black text-xs flex items-center space-x-1 transition-colors"
                            title="Admin cộng Xu trực tiếp cho học viên này"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+ Nạp Xu</span>
                          </button>

                          <button
                            onClick={() => setAdjustModal({ isOpen: true, user: u, type: 'withdraw', amount: Math.min(u.currentBalance, 50), reason: '' })}
                            disabled={u.currentBalance <= 0}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/70 dark:hover:bg-rose-900/90 disabled:opacity-40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-black text-xs flex items-center space-x-1 transition-colors"
                            title="Admin trừ Xu trực tiếp từ học viên này"
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                            <span>- Trừ Xu</span>
                          </button>
                        </div>

                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <button
                            onClick={() => setStatusModal({ isOpen: true, user: u, tier: u.tier || 'free', role: u.role || 'student', status: u.status || 'active' })}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/70 dark:hover:bg-blue-900/90 text-[#2383e2] dark:text-sky-300 border border-blue-200 dark:border-blue-800 font-black text-xs flex items-center space-x-1 transition-colors"
                            title="Tùy chỉnh tăng/giáng cấp bậc gói (Free/Plus/Pro/Ultra), vai trò và trạng thái"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Cấp Bậc & Status</span>
                          </button>

                          {onOpenDirectChat && (
                            <button
                              onClick={() => onOpenDirectChat({
                                id: u.email,
                                name: u.displayName || u.email.split('@')[0],
                                avatar: u.photoURL,
                                role: u.role,
                                tier: u.tier
                              })}
                              className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/70 dark:hover:bg-sky-900/90 text-[#2383e2] dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                              title={`Nhắn tin trực tiếp với ${u.displayName || u.email}`}
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Nhắn Tin</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedUserHistory(u)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-1 transition-colors"
                            title="Xem lịch sử biến động số dư và giao dịch"
                          >
                            <History className="w-3.5 h-3.5" />
                            <span>Lịch Sử GD</span>
                          </button>

                          {u.email !== PRIMARY_ADMIN_EMAIL && (
                            <button
                              onClick={() => handleQuickToggleSuspension(u)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                u.status === 'suspended'
                                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-600'
                              }`}
                              title={u.status === 'suspended' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                            >
                              {u.status === 'suspended' ? <Unlock className="w-3.5 h-3.5 text-amber-600" /> : <Lock className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          {u.email !== PRIMARY_ADMIN_EMAIL && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/80 transition-colors"
                              title={`Xóa vĩnh viễn tài khoản ${u.email}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: DUYỆT NẠP & RÚT */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">Danh Sách Lệnh Nạp / Rút Chờ Duyệt Chay</h4>
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black border border-emerald-200 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-0.5"></span>
                      <span>Firebase Realtime Sync</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Tất cả tài khoản/điện thoại nạp rút đều được đưa lên Firebase Firestore và đồng bộ thời gian thực tại đây.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleManualSyncFirebase}
                    disabled={isSyncingFirebase}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 shadow-xs transition-colors"
                    title="Đồng bộ lại dữ liệu mới nhất từ Firebase Firestore"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#2383e2] ${isSyncingFirebase ? 'animate-spin' : ''}`} />
                    <span>{isSyncingFirebase ? 'Đang Tải...' : 'Làm Mới Firebase'}</span>
                  </button>
                  <span className="text-xs font-black px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    Tổng {transactions.length} lệnh
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/90 dark:bg-slate-800/90 rounded-2xl border border-blue-200 dark:border-blue-500/30 text-xs text-blue-950 dark:text-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-[#2383e2] dark:text-sky-400 shrink-0" />
                  <span>
                    Tính năng duyệt tiền đã kết nối <strong className="font-bold text-blue-900 dark:text-sky-200">Firebase Firestore (onthi-hub)</strong>. Khi bấm "Duyệt", số dư ví của học viên trên mọi thiết bị sẽ được cộng Xu tức thì!
                  </span>
                </div>
                <a
                  href="https://console.firebase.google.com/project/onthi-hub/firestore"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#2383e2] dark:text-sky-400 hover:text-[#1a73e8] dark:hover:text-sky-300 font-black underline flex items-center space-x-1 shrink-0 text-[11px]"
                >
                  <span>Mở Firestore Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Coins className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">Chưa có giao dịch nạp / rút nào.</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 uppercase tracking-wider font-black">
                      <tr>
                        <th className="p-3">Mã GD</th>
                        <th className="p-3">Loại</th>
                        <th className="p-3">Số Lượng</th>
                        <th className="p-3">Khách Hàng / Ngân Hàng</th>
                        <th className="p-3">Trạng Thái</th>
                        <th className="p-3 text-right">Thao Tác Duyệt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                          <td className="p-3 font-mono font-black text-slate-900 dark:text-slate-100">
                            {tx.id}
                            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                              {formatHanoiDateTime(tx.createdAt)}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              tx.type === 'deposit'
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                            }`}>
                              {tx.type === 'deposit' ? 'NẠP XU' : 'RÚT TIỀN'}
                            </span>
                          </td>
                          <td className="p-3">
                            <strong className="text-slate-900 dark:text-slate-100 font-black">{tx.xuAmount} Xu</strong>
                            <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                              ~{(tx.amountVnd || tx.xuAmount * COIN_RATE_VND).toLocaleString()}đ
                            </span>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              <span className="text-slate-900 dark:text-slate-100 font-black truncate max-w-[160px]">{tx.userEmail}</span>
                              {(() => {
                                const customer = userBalancesList.find((u) => (u.email || '').toLowerCase().trim() === (tx.userEmail || '').toLowerCase().trim());
                                const isSuspended = customer?.status === 'suspended';
                                return (
                                  <>
                                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                                      isSuspended
                                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    }`}>
                                      {isSuspended ? '🔒 Khóa' : '🟢 Active'}
                                    </span>
                                    {customer?.tier && customer.tier !== 'free' && (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-sky-300 uppercase">
                                        {customer.tier}
                                      </span>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                            <div className="flex items-center space-x-1.5 mt-0.5 text-[11px]">
                              <span className="text-slate-500 dark:text-slate-400 font-medium">Số dư:</span>
                              <span className="font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200/80 dark:border-amber-900/60">
                                {getUserBalanceForEmail(tx.userEmail).toLocaleString()} Xu
                              </span>
                            </div>
                            {tx.type === 'withdraw' && tx.details && (
                              <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/90 p-2 rounded-xl mt-1 border border-slate-200 dark:border-slate-700">
                                <span className="font-black text-slate-900 dark:text-white">{tx.details.bankName}</span> • STK: <span className="font-mono font-black text-[#2383e2] dark:text-sky-400">{tx.details.accountNo}</span>
                                <div className="text-slate-500 dark:text-slate-400">Chủ TK: {tx.details.accountName}</div>
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            {tx.status === 'pending' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-black animate-pulse">
                                Chờ Duyệt Chay
                              </span>
                            )}
                            {tx.status === 'approved' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-black">
                                Đã Duyệt ✅
                              </span>
                            )}
                            {tx.status === 'rejected' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] font-black" title={tx.rejectReason}>
                                Từ Chối ❌
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {tx.status === 'pending' ? (
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => handleApprove(tx.id)}
                                  disabled={approvingTxId === tx.id}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-[11px] font-black shadow-xs flex items-center space-x-1 transition-all"
                                >
                                  {approvingTxId === tx.id ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="w-3 h-3" />
                                  )}
                                  <span>{approvingTxId === tx.id ? 'Đang duyệt...' : 'Duyệt'}</span>
                                </button>
                                <button
                                  onClick={() => handleReject(tx.id)}
                                  disabled={approvingTxId === tx.id}
                                  className="px-3 py-1 bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 disabled:opacity-50 text-rose-700 dark:text-rose-300 rounded-lg text-[11px] font-black border border-rose-300 dark:border-rose-800 flex items-center space-x-1 transition-all"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Từ chối</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-500 dark:text-slate-400 text-[11px] italic font-bold">Hoàn tất</span>
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

          {/* TAB: QUẢN LÝ CỘNG ĐỒNG & XÓA BÀI (ADMIN MODERATION) */}
          {activeTab === 'community' && (() => {
            const catMap = {
              'cong-chuc': '🏛️ Công Chức',
              'it': '💻 IT & Tech',
              'ngoai-ngu': '🌍 Ngoại Ngữ',
              'meo-thi': '💡 Mẹo Ôn Thi'
            };

            const filteredPosts = communityPosts.filter((post) => {
              const matchCat = communityCategoryFilter === 'all' || post.category === communityCategoryFilter;
              const q = communitySearchQuery.toLowerCase().trim();
              const matchSearch =
                !q ||
                (post.content || '').toLowerCase().includes(q) ||
                (post.author || '').toLowerCase().includes(q) ||
                String(post.id || '').toLowerCase().includes(q);
              return matchCat && matchSearch;
            });

            const totalLikes = communityPosts.reduce((acc, p) => acc + (p.likes || 0), 0);
            const totalComments = communityPosts.reduce((acc, p) => acc + (p.comments?.length || 0), 0);
            const pinnedCount = communityPosts.filter((p) => p.isPinned).length;

            return (
              <div className="space-y-6">
                {/* Status / Feedback Banner */}
                {communityActionMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fade-in shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{communityActionMsg}</span>
                  </div>
                )}

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span className="text-xs font-semibold">Tổng Bài Viết</span>
                      <MessageSquare className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{communityPosts.length}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal">Đang hoạt động trên web</div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span className="text-xs font-semibold">Bài Ghim Đầu Trang</span>
                      <Pin className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">{pinnedCount}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal">Thông báo & hướng dẫn</div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span className="text-xs font-semibold">Tổng Bình Luận</span>
                      <Users className="w-4 h-4 text-[#2383e2]" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-[#2383e2] dark:text-sky-400">{totalComments}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal">Tương tác hỏi đáp</div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span className="text-xs font-semibold">Lượt Thả Tim</span>
                      <ThumbsUp className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">{totalLikes}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal">Học viên ủng hộ</div>
                  </div>
                </div>

                {/* Control & Filter Toolbar */}
                <div className="bg-white dark:bg-slate-800/90 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>🛡️ Bảng Điều Khiển Kiểm Duyệt Bài Viết Cộng Đồng</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          Admin Quyền Năng
                        </span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Xóa ngay lập tức bài đăng spam, ghim bài hữu ích, và gỡ bình luận tiêu cực. Dữ liệu đồng bộ trực tiếp lên Firebase & Cloud Relay.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <button
                        onClick={reloadData}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-600 flex items-center space-x-1.5 transition-colors cursor-pointer"
                        title="Tải lại toàn bộ bài viết mới nhất"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Đồng Bộ</span>
                      </button>

                      <button
                        onClick={handleExportCommunityJson}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-600 flex items-center space-x-1.5 transition-colors cursor-pointer"
                        title="Tải về file JSON sao lưu bài viết"
                      >
                        <Download className="w-3.5 h-3.5 text-[#2383e2] dark:text-sky-400" />
                        <span>Xuất Sao Lưu JSON</span>
                      </button>

                      <button
                        onClick={handleAdminClearSpam}
                        className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-semibold border border-rose-200 dark:border-rose-800 flex items-center space-x-1.5 transition-colors cursor-pointer"
                        title="Dọn dẹp bài spam và khôi phục bài viết mặc định"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        <span>Dọn Rác / Khôi Phục</span>
                      </button>
                    </div>
                  </div>

                  {/* Search and Category Filter */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm bài viết theo nội dung, tác giả, hoặc ID (#post_...)"
                        value={communitySearchQuery}
                        onChange={(e) => setCommunitySearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:border-[#2383e2] outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
                      {[
                        { id: 'all', label: 'Tất Cả' },
                        { id: 'cong-chuc', label: '🏛️ Công Chức' },
                        { id: 'it', label: '💻 IT & Tech' },
                        { id: 'ngoai-ngu', label: '🌍 Ngoại Ngữ' },
                        { id: 'meo-thi', label: '💡 Mẹo Ôn Thi' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setCommunityCategoryFilter(cat.id)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                            communityCategoryFilter === cat.id
                              ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-2xs'
                              : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Posts List */}
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <MessageSquare className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Không tìm thấy bài viết nào</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {communitySearchQuery
                        ? `Không có bài viết nào khớp với từ khóa "${communitySearchQuery}"`
                        : 'Chưa có bài viết nào trong danh mục này'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPosts.map((post) => {
                      const isExpanded = expandedCommentsPostId === post.id;
                      return (
                        <div
                          key={post.id}
                          className="bg-white dark:bg-slate-800/95 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs space-y-3 transition-colors"
                        >
                          {/* Post Header Row */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                            <div className="flex items-center space-x-3">
                              <img
                                src={post.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                                alt={post.author}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                              />
                              <div>
                                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{post.author}</h4>
                                  {post.isPinned && (
                                    <span className="notion-tag notion-tag-yellow text-[10px] flex items-center space-x-0.5">
                                      <Pin className="w-2.5 h-2.5" />
                                      <span>Đang Ghim</span>
                                    </span>
                                  )}
                                  <span className="notion-tag notion-tag-blue text-[10px]">
                                    {post.categoryLabel || catMap[post.category] || post.category || 'Hỏi Đáp'}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                    #{post.id}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-2 mt-0.5">
                                  <span>{post.role || 'Thành Viên'}</span>
                                  <span>•</span>
                                  <span>{formatHanoiDateTime(post.createdAt || new Date())}</span>
                                </div>
                              </div>
                            </div>

                            {/* Admin Action Buttons */}
                            <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                              <button
                                onClick={() => handleAdminTogglePin(post.id)}
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center space-x-1 transition-colors border cursor-pointer ${
                                  post.isPinned
                                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-900'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                                title={post.isPinned ? 'Bỏ ghim bài viết này' : 'Ghim bài viết này lên đầu diễn đàn'}
                              >
                                <Pin className="w-3.5 h-3.5" />
                                <span>{post.isPinned ? 'Bỏ Ghim' : 'Ghim Bài'}</span>
                              </button>

                              <button
                                onClick={() =>
                                  setExpandedCommentsPostId(isExpanded ? null : post.id)
                                }
                                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-md text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                                title="Xem và quản lý các bình luận dưới bài viết"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-[#2383e2] dark:text-sky-400" />
                                <span>Bình luận ({post.comments?.length || 0})</span>
                              </button>

                              <button
                                onClick={() => handleAdminDeletePost(post.id, post.author)}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-bold flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer"
                                title="XÓA VĨNH VIỄN bài viết này khỏi hệ thống"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Xóa Bài</span>
                              </button>
                            </div>
                          </div>

                          {/* Post Content */}
                          <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line font-normal">
                            {post.content}
                          </div>

                          {/* Post Interactions */}
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center space-x-1">
                                <ThumbsUp className="w-3.5 h-3.5 text-rose-500" />
                                <span>{post.likes || 0} lượt thích</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                                <span>{post.comments?.length || 0} bình luận</span>
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                              Tình trạng: {post.isPinned ? '📌 Ưu tiên hiển thị' : 'Tiêu chuẩn'}
                            </span>
                          </div>

                          {/* Expandable Comments Management Panel */}
                          {isExpanded && (
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 animate-fade-in">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                                <span>Danh Sách Bình Luận ({post.comments?.length || 0})</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                                  Bấm vào biểu tượng thùng rác để xóa bình luận vi phạm
                                </span>
                              </div>

                              {(!post.comments || post.comments.length === 0) ? (
                                <p className="text-xs text-slate-500 dark:text-slate-400 italic py-2">
                                  Chưa có bình luận nào dưới bài viết này.
                                </p>
                              ) : (
                                <div className="space-y-1.5">
                                  {post.comments.map((cm, cIdx) => (
                                    <div
                                      key={cIdx}
                                      className="p-2.5 bg-slate-100 dark:bg-slate-900/90 rounded-lg text-xs flex items-start justify-between gap-3 border border-slate-200 dark:border-slate-700"
                                    >
                                      <div className="space-y-0.5">
                                        <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                                          <span>{cm.author}</span>
                                          {cm.createdAt && (
                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                                              {formatHanoiDateTime(cm.createdAt)}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-normal">{cm.text}</p>
                                      </div>

                                      <button
                                        onClick={() => handleAdminDeleteComment(post.id, cIdx)}
                                        className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950/80 transition-colors shrink-0"
                                        title="Xóa bình luận này (Admin)"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 2: TÙY CHỈNH GIỚI HẠN GÓI */}
          {activeTab === 'tiers' && (
            <form onSubmit={handleSaveTierLimits} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Cấu Hình Giới Hạn Từng Gói (Free, Plus, Pro, Ultra)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Chỉnh sửa số lượt tạo thẻ mỗi ngày, lượt thưởng khi điểm danh hàng ngày và phí sàn C2C.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-black rounded-xl shadow-md flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Cấu Hình</span>
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black rounded-xl">
                  {saveSuccessMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(tierLimits).map((tierKey) => {
                  const cfg = tierLimits[tierKey];
                  return (
                    <div key={tierKey} className="p-4 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                        <span className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wide">
                          {cfg.name}
                        </span>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/80 text-[#2383e2] dark:text-sky-300 border border-pink-200 dark:border-pink-800">
                          {tierKey}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
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
                            className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-black bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-[#2383e2]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
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
                            className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-black bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-[#2383e2]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
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
                            className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-black bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-[#2383e2]"
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
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      Quản Lý & Kiểm Duyệt Trùng Lặp Sàn Flashcard C2C
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Hệ thống tự động đối chiếu Jaccard & N-gram để phát hiện đạo văn hoặc sao chép thẻ trái phép.
                    </p>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-black">
                    <button
                      onClick={() => setMarketFilter('all')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        marketFilter === 'all'
                          ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      Tất cả ({marketDecks.length})
                    </button>

                    <button
                      onClick={() => setMarketFilter('duplicates')}
                      className={`px-3 py-1.5 rounded-xl flex items-center space-x-1 transition-all ${
                        marketFilter === 'duplicates'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900'
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
                          : 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900'
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
                          : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Độc Bản ({cleanCount})</span>
                    </button>
                  </div>
                </div>

                {filteredDecks.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    Không có bộ thẻ nào trong danh mục lọc này.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filteredDecks.map((deck) => (
                      <div
                        key={deck.id}
                        className={`p-4 bg-white dark:bg-slate-900/90 rounded-2xl border flex flex-col justify-between shadow-xs transition-all ${
                          deck.dupCheck.similarityScore >= 55
                            ? 'border-rose-400 dark:border-rose-700 bg-rose-50/20 dark:bg-rose-950/20'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                              {deck.categoryName || deck.category}
                            </span>
                            <span className="text-xs font-black text-[#2383e2] dark:text-sky-400">
                              {deck.priceXu} Xu (~{(deck.priceXu * 1000).toLocaleString()}đ)
                            </span>
                          </div>

                          <h5 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
                            {deck.title}
                          </h5>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 font-medium">
                            {deck.description}
                          </p>

                          <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                            Tác giả: <strong>{deck.authorName}</strong> • Đã bán: {deck.salesCount || 0} lượt
                          </div>

                          {/* Pass Deck indicator */}
                          {deck.isPassDeck && (
                            <div className="mt-2 p-2 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 text-[11px]">
                              <span className="font-black flex items-center space-x-1">
                                <Repeat className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                <span>Thẻ Pass C2C từ học viên: {deck.passSellerName}</span>
                              </span>
                              {deck.passNote && (
                                <span className="text-[10px] text-purple-700 dark:text-purple-300 italic block mt-0.5">
                                  "{deck.passNote}"
                                </span>
                              )}
                            </div>
                          )}

                          {/* Duplicate Detection Alert Badge */}
                          {deck.dupCheck.similarityScore >= 55 ? (
                            <div className="mt-2.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-[11px] font-bold">
                              <div className="flex items-center space-x-1 font-black text-rose-900 dark:text-rose-200">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                <span>CẢNH BÁO TRÙNG LẶP CAO ({deck.dupCheck.similarityScore}%)</span>
                              </div>
                              <div className="mt-0.5 text-[10px] text-rose-700 dark:text-rose-300 font-medium">
                                {deck.dupCheck.reason}
                              </div>
                              <div className="mt-0.5 text-[10px] text-rose-600 dark:text-rose-400 truncate">
                                Bộ đối chiếu: <strong>{deck.dupCheck.matchedDeck?.title}</strong> ({deck.dupCheck.matchedDeck?.source})
                              </div>
                            </div>
                          ) : deck.dupCheck.similarityScore >= 30 ? (
                            <div className="mt-2 p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[10px] font-bold flex items-center space-x-1">
                              <span>ℹ️ Tương đồng vừa phải ({deck.dupCheck.similarityScore}%) với:</span>
                              <span className="truncate max-w-[150px] font-black">{deck.dupCheck.matchedDeck?.title}</span>
                            </div>
                          ) : (
                            <div className="mt-2 inline-flex items-center space-x-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Độc bản an toàn ({deck.dupCheck.similarityScore}% trùng lặp)</span>
                            </div>
                          )}
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="mt-3 pt-2.5 border-t border-[#e9e9e8] flex items-center justify-between">
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

                            <button
                              onClick={() => handleDeleteDeck(deck.id, deck.title)}
                              className="px-3 py-1 text-xs font-black rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center space-x-1 transition-colors shadow-xs"
                              title="Xóa vĩnh viễn bộ thẻ này"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Xóa</span>
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

          {/* TAB: VẾT GIỜ HÀ NỘI & NHẬT KÝ HỆ THỐNG */}
          {activeTab === 'system_logs' && (() => {
            const hanoiNow = getHanoiNowComponents();
            return (
              <div className="space-y-6">
                {/* Hanoi Time Engine Status Banner */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/60 dark:to-cyan-950/60 p-5 rounded-xl border border-teal-200 dark:border-teal-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400 animate-pulse" />
                      <h4 className="text-sm font-black text-teal-900 dark:text-teal-200">
                        Đồng Bộ Chuẩn Thời Gian Hà Nội (ICT - GMT+7)
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-teal-200 dark:bg-teal-800 text-teal-900 dark:text-teal-200 text-[10px] font-black">
                        LIVE CLOCK
                      </span>
                    </div>
                    <p className="text-xs text-teal-800 dark:text-teal-300 leading-relaxed font-medium">
                      Thời gian hiện tại: <strong>{hanoiNow.dayName}, {hanoiNow.fullFormatted}</strong>.
                      Tất cả các phiên làm bài thi thử, mục tiêu học tập hàng ngày và lịch sử giao dịch đều được ghi nhận chuẩn theo múi giờ Việt Nam.
                    </p>
                  </div>

                  <button
                    onClick={handleClearStudyLogs}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                  >
                    Xóa Nhật Ký Vết Thời Gian
                  </button>
                </div>

                {/* Study Time Trace Logs Feed */}
                <div className="bg-white dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/90 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Nhật Ký Vết Thời Gian Học Tập ({studyLogs.length})
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Lưu vết các phiên học, hoàn thành nhiệm vụ và bài thi theo chuẩn giờ Hà Nội
                      </p>
                    </div>
                  </div>

                  {studyLogs.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Chưa có vết thời gian học tập nào được ghi nhận.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                          <tr>
                            <th className="p-3">Thời Gian (Hà Nội)</th>
                            <th className="p-3">Hoạt Động</th>
                            <th className="p-3">Thời Lượng</th>
                            <th className="p-3">XP Thưởng</th>
                            <th className="p-3">Mã Vết</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {studyLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                              <td className="p-3 font-mono font-medium text-slate-900 dark:text-slate-100">
                                <div>{log.hanoiTime}</div>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">{log.hanoiDate}</span>
                              </td>
                              <td className="p-3">
                                <div className="font-semibold text-slate-900 dark:text-white">{log.title || 'Phiên học OnThiHub'}</div>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                                  {log.type}
                                </span>
                              </td>
                              <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                                {log.durationMinutes} phút
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold">
                                  +{log.xpGained} XP
                                </span>
                              </td>
                              <td className="p-3 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                                {log.id}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB 4: HÒM THƯ THÔNG BÁO & GMAIL ADMIN */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-black text-[#37352f]">
                    Nhật Ký Thông Báo Giao Dịch (ntfy.sh & Gmail)
                  </h4>
                  <p className="text-xs text-[#787774] font-medium">
                    Mỗi khi có khách nạp/rút tiền, hệ thống tự động đẩy thông báo qua Web Push ntfy.sh, Email và lưu lại nhật ký tại đây.
                  </p>
                </div>
              </div>

              {/* CARD 0: THÔNG BÁO ĐẨY MÀN HÌNH MÁY TÍNH (WINDOWS / CHROME DESKTOP NOTIFICATION) */}
              <div className="p-5 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 rounded-2xl border-2 border-sky-300 dark:border-sky-700/60 shadow-sm space-y-3.5 text-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-xs">
                      <BellRing className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-slate-900 dark:text-sky-100">
                        Thông Báo Đẩy Màn Hình Máy Tính (Windows / Chrome / Edge)
                      </h5>
                      <span className="text-[11px] text-slate-600 dark:text-sky-200/80 font-medium">
                        Reo chuông + Bắn popup góc màn hình ngay cả khi anh đang làm việc ở tab khác hoặc thu nhỏ trình duyệt
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {desktopNotifStatus === 'granted' ? (
                      <button
                        type="button"
                        onClick={() => {
                          sendBrowserDesktopNotification({
                            title: '🔔 [OnThiHub] Kiểm Tra Thông Báo Máy Tính',
                            body: 'Máy tính của anh đã sẵn sàng nhận thông báo Nạp Xu tức thì!'
                          });
                          playSound('click');
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Bắn Thử Thông Báo</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestDesktopNotif}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                      >
                        <BellRing className="w-3.5 h-3.5" />
                        <span>Bật Thông Báo Về Máy Ngay</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-sky-200 dark:border-sky-800 text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
                  <p>
                    <strong>Trạng thái máy tính:</strong>{' '}
                    {desktopNotifStatus === 'granted' ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">✅ ĐÃ BẬT - Máy tính sẽ reo chuông và hiện thông báo khi có học viên nạp/rút tiền</span>
                    ) : desktopNotifStatus === 'denied' ? (
                      <span className="text-rose-600 dark:text-rose-400 font-bold">❌ BỊ CHẶN - Vui lòng bấm vào icon ổ khóa trên thanh địa chỉ trình duyệt để Bật Thông Báo (Allow Notifications)</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">⚠️ CHƯA BẬT - Hãy bấm nút "Bật Thông Báo Về Máy Ngay" ở trên</span>
                    )}
                  </p>
                </div>
              </div>

              {/* CARD 1: CẤU HÌNH GMAIL GỬI TRỰC TIẾP QUA FORMSUBMIT */}
              <div className="p-5 bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/40 dark:to-orange-950/40 rounded-2xl border-2 border-amber-300 dark:border-amber-700/60 shadow-sm space-y-3.5 text-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-slate-900 dark:text-amber-100">
                        Gửi Email Tự Động Trực Tiếp Về Gmail: <span className="text-[#2383e2] dark:text-sky-400 font-mono">{ADMIN_EMAIL}</span>
                      </h5>
                      <span className="text-[11px] text-slate-600 dark:text-amber-200/80 font-medium">
                        Cơ chế tự động qua FormSubmit API • Không cần máy chủ backend • Nhận email trong 1-3 giây
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-amber-200 dark:border-amber-800 text-slate-600 dark:text-slate-300 space-y-1.5 text-[11px] leading-relaxed">
                  <strong className="text-slate-900 dark:text-white font-black block">
                    ⚠️ Hướng dẫn kích hoạt nhận email lần đầu (Chỉ làm 1 lần duy nhất):
                  </strong>
                  <p>1. Mở hòm thư <strong>{ADMIN_EMAIL}</strong> (vui lòng kiểm tra cả thư mục <strong>Hộp thư đến</strong> và <strong>Thư rác / Spam</strong>).</p>
                  <p>2. Tìm email do máy chủ <strong>FormSubmit</strong> gửi tới với tiêu đề <em>&ldquo;FormSubmit - Confirm your email address&rdquo;</em> hoặc <em>&ldquo;Activate Form&rdquo;</em>.</p>
                  <p>3. Bấm vào nút <strong>&ldquo;Activate Form&rdquo;</strong> trong email đó.</p>
                  <p className="text-emerald-700 dark:text-emerald-400 font-bold">
                    ✅ Sau khi bấm, máy chủ FormSubmit sẽ kích hoạt vĩnh viễn. Mọi lệnh Nạp tiền và Rút tiền từ học viên trên web sẽ tự động gửi thẳng email chi tiết về Gmail của anh!
                  </p>
                </div>
              </div>

              {/* CARD 2: PUSH CHUÔNG BÁO ĐIỆN THOẠI QUA NTFY.SH */}
              <div className="p-5 sm:p-6 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-900/20">
                      <BellRing className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        Chuông Báo & Màn Hình Khóa Điện Thoại (ntfy.sh)
                      </h5>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                        Không cần tài khoản hay mật khẩu • Reo chuông màn hình khóa tức thì khi có khách Nạp / Rút
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <a
                      href={ADMIN_NTFY_TOPIC}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-800 font-black text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mở Kênh ntfy.sh</span>
                    </a>
                  </div>
                </div>

                {/* Giới thiệu cơ chế không cần đăng nhập */}
                <div className="p-4 bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-2xl space-y-3">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="text-purple-950 dark:text-purple-200 font-black text-xs block">
                        ❓ Vì sao trên ứng dụng ntfy không có chỗ đăng nhập tài khoản?
                      </strong>
                      <p className="text-[11px] text-purple-900/90 dark:text-purple-300 leading-relaxed font-medium">
                        <strong>ntfy</strong> được thiết kế theo cơ chế ẩn danh (Zero-login). 
                        Anh không cần tạo tài khoản hay ghi nhớ mật khẩu! Thay vào đó, 
                        chủ đề (Topic) <code className="bg-purple-200/80 dark:bg-purple-900/80 text-purple-950 dark:text-purple-200 px-1.5 py-0.5 rounded font-mono font-black">Onthihubbbbb</code> chính là kênh thông báo riêng biệt của website ÔnThiHub.
                      </p>
                    </div>
                  </div>

                  {/* 2 Cột: Quét Mã QR & Các Bước Thao Tác */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-purple-200/80 dark:border-purple-850 items-center">
                    
                    {/* Cột 1: Mã QR để quét nhanh trên điện thoại */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-200 dark:border-purple-800 shadow-2xs flex flex-col items-center text-center">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://ntfy.sh/Onthihubbbbb"
                        alt="QR Code ntfy Onthihubbbbb"
                        className="w-32 h-32 rounded-lg border border-purple-100 dark:border-purple-900 mb-2"
                      />
                      <span className="text-[10px] text-purple-900 dark:text-purple-300 font-black">
                        Quét mã QR bằng Camera điện thoại
                      </span>
                    </div>

                    {/* Cột 2 & 3: Hướng dẫn 2 bước cực dễ */}
                    <div className="md:col-span-2 space-y-2.5 text-[11px] text-purple-950 dark:text-purple-200 font-medium">
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">1</span>
                        <div>
                          <strong>Bước 1: Tải ứng dụng ntfy về điện thoại</strong> (tìm từ khóa <code className="font-mono bg-purple-100 dark:bg-purple-900 px-1 py-0.2 rounded font-bold">ntfy</code> trên App Store hoặc Google Play, tải hoàn toàn miễn phí).
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">2</span>
                        <div>
                          <strong>Bước 2: Đăng ký nhận thông báo</strong>: Mở app ntfy &gt; Bấm dấu cộng (<strong>+</strong>) ở góc màn hình &gt; Nhập đúng tên chủ đề:
                          <div className="mt-1.5 flex items-center space-x-2">
                            <span className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 font-mono font-black text-purple-700 dark:text-purple-300 rounded-lg text-xs">
                              Onthihubbbbb
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText('Onthihubbbbb');
                                setCopiedNtfyTopic(true);
                                playSound('success');
                                setTimeout(() => setCopiedNtfyTopic(false), 2500);
                              }}
                              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-black text-[10px] flex items-center space-x-1"
                            >
                              {copiedNtfyTopic ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedNtfyTopic ? 'Đã Copy!' : 'Copy Tên Chủ Đề'}</span>
                            </button>
                          </div>
                          <span className="block mt-1 text-[10px] text-purple-800 dark:text-purple-300">
                            Sau đó bấm <strong>Subscribe</strong> là xong 100%!
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-900 dark:text-emerald-300 text-[10px] font-bold flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Từ giờ, mỗi khi có khách Nạp hoặc Rút tiền, màn hình khóa điện thoại của anh sẽ reo chuông ting ting ngay lập tức.</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* CARD 3: TÙY CHỌN TELEGRAM BOT TỰ ĐỘNG */}
              <form onSubmit={handleSaveTelegram} className="p-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4 text-[#0068ff]" />
                    <h5 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                      Tùy Chọn: Bắn Tin Nhắn Tức Thì Qua Telegram (Tin Nhắn Riêng)
                    </h5>
                  </div>
                  <label className="flex items-center space-x-1.5 cursor-pointer font-bold text-xs text-slate-900 dark:text-white">
                    <input
                      type="checkbox"
                      checked={telegramConfig.enabled}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="rounded accent-[#2383e2] w-4 h-4"
                    />
                    <span>Bật gửi qua Telegram</span>
                  </label>
                </div>

                {telegramSaveMsg && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200 font-bold rounded-xl text-xs">
                    {telegramSaveMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Telegram Token:</label>
                    <input
                      type="text"
                      placeholder="VD: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                      value={telegramConfig.botToken}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, botToken: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-[#0068ff]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Telegram Chat ID của anh:</label>
                    <input
                      type="text"
                      placeholder="VD: 987654321"
                      value={telegramConfig.chatId}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, chatId: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-[#0068ff]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0068ff] hover:bg-[#0052cc] text-white font-black text-xs rounded-xl shadow-xs flex items-center space-x-1 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Cấu Hình Telegram</span>
                  </button>
                </div>
              </form>

              {/* LỊCH SỬ THÔNG BÁO */}
              <div className="pt-2">
                <h5 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider mb-2">
                  Lịch Sử Các Thông Báo Đã Ghi Nhận ({notifications.length})
                </h5>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <BellRing className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">Chưa có thông báo nạp/rút nào được ghi nhận.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 uppercase border border-purple-200 dark:border-purple-800">
                              Mã: {n.code}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/80 text-[#2383e2] dark:text-sky-300">
                              {n.type === 'deposit' ? 'NẠP XU' : 'RÚT TIỀN'}
                            </span>
                          </div>
                          <h5 className="text-xs font-black text-slate-900 dark:text-white mt-1.5">{n.subject}</h5>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 font-medium">{n.timestamp}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <a
                            href={`mailto:${n.targetEmail}?subject=${encodeURIComponent(n.subject)}&body=${encodeURIComponent(n.body)}`}
                            className="px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center space-x-1 border border-slate-200 dark:border-slate-700"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Mail</span>
                          </a>
                        </div>
                      </div>
                      <pre className="mt-3 p-3 bg-slate-50 dark:bg-slate-950/90 rounded-xl text-[11px] text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap border border-slate-200 dark:border-slate-800">
                        {n.zaloMessage || n.body}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CẤU HÌNH FIREBASE CLOUD */}
          {activeTab === 'firebase' && (
            <div className="space-y-6">
              {/* Header and status banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-[#e9e9e8]">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-amber-500" />
                    <h4 className="text-base font-black text-[#37352f]">
                      Quản Lý & Tích Hợp Firebase Cloud (Google Services)
                    </h4>
                  </div>
                  <p className="text-xs text-[#787774] font-medium leading-relaxed max-w-2xl">
                    Firebase hỗ trợ xác thực tài khoản Google 1-chạm, khôi phục mật khẩu qua Gmail, và đồng bộ dữ liệu ví Xu/tiến độ học lên Firestore Database thực tế.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testingConnection}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center space-x-1.5 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                    <span>{testingConnection ? 'Đang Kiểm Tra...' : 'Kiểm Tra Kết Nối'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyVercelEnv}
                    className="px-4 py-2 bg-[#37352f] hover:bg-[#3d0b28] text-white text-xs font-black rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
                  >
                    {copiedVercelEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-rose-300" />}
                    <span>{copiedVercelEnv ? 'Đã Sao Chép Cho Vercel!' : 'Sao Chép .env Cho Vercel'}</span>
                  </button>
                </div>
              </div>

              {/* Status Message Banner */}
              {firebaseSaveMsg && (
                <div className="p-3.5 text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{firebaseSaveMsg}</span>
                </div>
              )}

              {testResult && (
                <div className={`p-4 rounded-xl text-xs font-bold border flex items-start space-x-2.5 ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p>{testResult.message}</p>
                    {testResult.isReal && (
                      <span className="block mt-1 text-[11px] font-mono text-emerald-700 font-normal">
                        Project ID: {testResult.projectId} • SDK: Firebase v13 Modular
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Paste Snippet Section */}
              <div className="p-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-[#2383e2] dark:text-sky-400" />
                    <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Dán Nhanh Mã Cấu Hình từ Firebase Console (Auto-Detect Parser)
                    </h5>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                    Hỗ trợ cú pháp JS & JSON
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Vào <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-[#2383e2] dark:text-sky-400 font-black underline">console.firebase.google.com</a> ➔ Project Settings ➔ Your apps ➔ Chọn Web app ➔ Sao chép đoạn mã <code>const firebaseConfig = &#123; ... &#125;</code> rồi dán vào ô bên dưới:
                </p>

                <textarea
                  rows="4"
                  value={rawSnippet}
                  onChange={(e) => handleParseSnippet(e.target.value)}
                  placeholder={`// Dán đoạn mã này từ Firebase Console vào đây:\nconst firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "my-app.firebaseapp.com",\n  projectId: "my-app",\n  storageBucket: "my-app.appspot.com",\n  messagingSenderId: "123456789",\n  appId: "1:123456789:web:abcdef"\n};`}
                  className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2383e2] focus:ring-2 focus:ring-[#2383e2]/20 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              {/* Individual Form Fields */}
              <form onSubmit={handleSaveFirebaseConfig} className="p-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-amber-500" />
                    <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Chi Tiết Khóa API & Thông Số Firebase
                    </h5>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-black text-slate-900 dark:text-white block">
                        API Key (VITE_FIREBASE_API_KEY):
                      </label>
                      {firebaseConfig.apiKey && (
                        <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                          🔒 {maskApiKey(firebaseConfig.apiKey)}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showFirebaseKey ? 'text' : 'password'}
                        value={firebaseConfig.apiKey || ''}
                        onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value })}
                        placeholder="AIzaSy..."
                        className="w-full pl-3 pr-10 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2383e2] text-slate-900 dark:text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowFirebaseKey(!showFirebaseKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                        title={showFirebaseKey ? 'Ẩn khóa API' : 'Hiện khóa API'}
                      >
                        {showFirebaseKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-900 dark:text-white block mb-1">
                      Project ID (VITE_FIREBASE_PROJECT_ID):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.projectId || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })}
                      placeholder="my-project-id"
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2383e2] text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-900 dark:text-white block mb-1">
                      Auth Domain (VITE_FIREBASE_AUTH_DOMAIN):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.authDomain || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value })}
                      placeholder="my-project.firebaseapp.com"
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2383e2] text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-900 dark:text-white block mb-1">
                      Storage Bucket (VITE_FIREBASE_STORAGE_BUCKET):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.storageBucket || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, storageBucket: e.target.value })}
                      placeholder="my-project.appspot.com"
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2383e2] text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-900 dark:text-white block mb-1">
                      Messaging Sender ID (VITE_FIREBASE_MESSAGING_SENDER_ID):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.messagingSenderId || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, messagingSenderId: e.target.value })}
                      placeholder="1234567890"
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2383e2] text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-900 dark:text-white block mb-1">
                      App ID (VITE_FIREBASE_APP_ID):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.appId || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, appId: e.target.value })}
                      placeholder="1:1234567890:web:abcdef..."
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2383e2] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Khóa lưu trên máy của bạn sẽ ghi đè cấu hình thử nghiệm và kích hoạt Cloud thật ngay lập tức.
                  </p>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#2383e2] to-[#1a73e8] hover:from-[#1a73e8] hover:to-[#1a73e8] text-white text-xs font-black rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Cấu Hình Firebase</span>
                  </button>
                </div>
              </form>

              {/* 3-Step Firebase Setup Guide */}
              <div className="p-5 bg-[#f7f6f5]/70 rounded-2xl border border-[#e9e9e8] space-y-3">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-[#2383e2]" />
                  <h5 className="text-xs font-black text-[#37352f] uppercase tracking-wider">
                    Hướng Dẫn 3 Bước Tạo Firebase Cho Dự Án:
                  </h5>
                </div>

                <ol className="list-decimal list-inside space-y-2 text-xs text-[#37352f] font-medium leading-relaxed">
                  <li>
                    <strong>Tạo Project:</strong> Truy cập <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-[#2383e2] underline font-bold">console.firebase.google.com</a>, bấm <em>Add project</em> đặt tên là <code>onthihub</code>.
                  </li>
                  <li>
                    <strong>Bật Authentication:</strong> Chọn menu <em>Build ➔ Authentication ➔ Sign-in method</em>, bật <strong>Email/Password</strong> và <strong>Google</strong>.
                  </li>
                  <li>
                    <strong>Lấy Khóa & Đưa lên Vercel:</strong> Vào <em>Project settings ➔ General ➔ Your apps (Web)</em>, sao chép cấu hình rồi bấm nút <strong>"Sao Chép .env Cho Vercel"</strong> ở trên dán vào mục <em>Environment Variables</em> trên Vercel.
                  </li>
                </ol>
              </div>

            </div>
          )}

          {/* TAB 6: QUẢN LÝ TỶ LỆ TÚI MÙ (BLIND BOX GACHA) */}
          {activeTab === 'blindbox' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-[#e9e9e8]">
                <div>
                  <div className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-purple-600" />
                    <h4 className="text-base font-black text-[#37352f]">
                      Quản Lý & Kiểm Soát Tỷ Lệ Rơi Thưởng Túi Mù (Gacha System)
                    </h4>
                  </div>
                  <p className="text-xs text-[#787774] font-medium mt-1 max-w-2xl">
                    Tỷ lệ rơi đã được cân bằng toán học (100% tròn trịa), đảm bảo người chơi có trải nghiệm mở thưởng kích thích, minh bạch, đồng thời giữ vững kinh tế ví Xu của nền tảng.
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200">
                    Thuật Toán: Web Audio 3D & PRNG
                  </span>
                </div>
              </div>

              {/* 3 Box Rate Breakdown Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {BLIND_BOXES.map((box) => (
                  <div key={box.id} className="p-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    
                    {/* Box Title */}
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-3xl">{box.icon}</span>
                        <div>
                          <h5 className="text-sm font-black text-slate-900 dark:text-white">{box.name}</h5>
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{box.subname}</span>
                        </div>
                      </div>
                      <div className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs">
                        {box.costXu} Xu
                      </div>
                    </div>

                    {/* Rates Table */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                        Tỷ Lệ Rơi Thưởng (Tổng 100%):
                      </span>

                      <div className="space-y-1.5">
                        {box.dropRates.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center space-x-1.5 min-w-0 pr-2">
                              <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded shrink-0 ${
                                item.rarity === 'secret' ? 'bg-amber-400 text-slate-950 animate-pulse' :
                                item.rarity === 'legendary' ? 'bg-purple-600 text-white' :
                                item.rarity === 'epic' ? 'bg-rose-500 text-white' :
                                item.rarity === 'rare' ? 'bg-indigo-600 text-white' :
                                'bg-slate-500 text-white'
                              }`}>
                                {item.rarity}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white text-[11px] truncate">
                                {item.name}
                              </span>
                            </div>

                            <span className="font-mono font-black text-amber-700 dark:text-amber-300 shrink-0 text-xs">
                              {item.rate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary Tag */}
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      💡 {box.description}
                    </div>

                  </div>
                ))}
              </div>

              {/* Economic Balance & Highlights */}
              <div className="p-5 bg-gradient-to-r from-purple-900/10 via-pink-900/10 to-amber-900/10 dark:from-purple-950/40 dark:via-pink-950/40 dark:to-amber-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Các Điểm Sáng Trong Cơ Chế Rơi Thưởng Mới:
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-900 dark:text-white">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900 space-y-1">
                    <strong className="text-emerald-700 dark:text-emerald-400 font-bold block">1. Chủ Sàn Luôn Thắng (House Edge 80%)</strong>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Phần lớn kết quả (90%+) rơi vào vé AI Studio hoặc hoàn xu an ủi (ít hơn tiền mở), đảm bảo chủ sàn luôn thu lãi ròng áp đảo.</p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900 space-y-1">
                    <strong className="text-amber-700 dark:text-amber-400 font-bold block">2. Tỷ Lệ Đồ Xịn Siêu Thấp (1% - 5%)</strong>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Jackpot chỉ 1%, PRO/PLUS chỉ 2%, thẻ đắt tiền chỉ 5%. Hàng trăm người mở mới có 1 người trúng để tạo hiệu ứng viral.</p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900 space-y-1">
                    <strong className="text-purple-700 dark:text-purple-400 font-bold block">3. Giữ Chân Học Viên Bằng Phần Thưởng Thực</strong>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Thưởng trực tiếp Xu, vé AI Studio hoặc VIP trọn gói, loại bỏ hoàn toàn các loại voucher ảo khó dùng để tăng độ tin cậy.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: THẺ CẤU HÌNH API KEY AI CLOUD */}
          {activeTab === 'ai_api' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-black text-[#37352f] flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-cyan-600" />
                    <span>Cấu Hình Khóa Động Cơ AI ÔnThiHub Cloud (High Performance)</span>
                  </h4>
                  <p className="text-xs text-[#787774] font-medium mt-0.5">
                    Tích hợp trí tuệ nhân tạo chuyên biệt để tự động trích xuất tài liệu, sách giáo trình thành bộ thẻ Anki thật 100%.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={API_KEY_LINKS.gemini}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-black flex items-center space-x-1.5 shadow-md hover:brightness-110"
                  >
                    <span>Cổng Kích Hoạt Khóa AI</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  
                  <button
                    onClick={handleCopyAiEnv}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#e9e9e8] text-[#37352f] hover:bg-[#f7f6f5] text-xs font-black flex items-center space-x-1.5"
                  >
                    {copiedAiEnv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#2383e2]" />}
                    <span>{copiedAiEnv ? 'Đã Copy .env' : 'Copy .env Vercel'}</span>
                  </button>
                </div>
              </div>

              {aiSaveMsg && (
                <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black rounded-2xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{aiSaveMsg}</span>
                </div>
              )}

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                hasValidAiKey()
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    hasValidAiKey() ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-black text-xs sm:text-sm">
                      {hasValidAiKey() ? '🟢 Đã Kích Hoạt Động Cơ AI Trực Tiếp' : '🟡 Đang Dùng Bộ Sinh Thẻ Ngoại Tuyến (Offline)'}
                    </h5>
                    <p className="text-[11px] opacity-80 font-medium">
                      {hasValidAiKey()
                        ? 'Hệ thống đã nhận diện Khóa AI hợp lệ. Học viên khi bấm "Tạo thẻ AI" sẽ nhận kết quả phân tích trực tiếp từ mô hình trí tuệ nhân tạo điện toán đám mây.'
                        : 'Chưa có Khóa AI. Hệ thống hiện chạy thuật toán mô phỏng thông minh. Hãy nhập Khóa AI Cloud dưới đây để kích hoạt máy chủ thật.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleTestAiKey}
                  disabled={testingAiKey || (!geminiApiKey && !openaiApiKey)}
                  className="px-4 py-2 rounded-xl bg-white border border-current text-xs font-black hover:bg-black/5 disabled:opacity-50 shrink-0"
                >
                  {testingAiKey ? 'Đang Test...' : '⚡ Kiểm Tra Kết Nối'}
                </button>
              </div>

              {/* Test Result Message */}
              {aiTestResult && (
                <div className={`p-3.5 rounded-2xl border text-xs font-bold whitespace-pre-line ${
                  aiTestResult.success
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                    : 'bg-rose-100 border-rose-300 text-rose-800'
                }`}>
                  {aiTestResult.message}
                </div>
              )}

              {/* API Key Form */}
              <form onSubmit={handleSaveAiKey} className="space-y-4">
                
                {/* 1. Cloud AI Key Card */}
                <div className="p-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">✨</span>
                      <div>
                        <strong className="text-sm font-black text-slate-900 dark:text-white block">
                          Khóa Động Cơ AI ÔnThiHub Cloud (Khuyên Dùng - Tốc Độ Cao)
                        </strong>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                          Mô hình AI Flash siêu tốc: phân tích và trích xuất cấu trúc đề thi, hỗ trợ tiếng Việt cực chuẩn.
                        </span>
                      </div>
                    </div>

                    <a
                      href={API_KEY_LINKS.gemini}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-blue-600 dark:text-sky-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Cổng Đăng Ký Khóa AI</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                        Khóa bí mật AI Engine Key (Bắt đầu bằng <code className="font-mono text-[#2383e2] dark:text-sky-400">AIzaSy...</code>):
                      </label>
                      {geminiApiKey && (
                        <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          🔒 {maskApiKey(geminiApiKey)}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showGeminiKey ? 'text' : 'password'}
                        placeholder="AIzaSy..."
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-[#2383e2]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        title={showGeminiKey ? 'Ẩn khóa' : 'Hiện khóa'}
                      >
                        {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* 3 Steps Guide to get free key */}
                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-sky-950/60 border border-blue-200 dark:border-sky-800 text-xs text-blue-900 dark:text-sky-200 space-y-1.5">
                    <strong className="font-black block text-blue-950 dark:text-white">📋 Hướng dẫn kích hoạt khóa trong 30 giây:</strong>
                    <ol className="list-decimal pl-4 space-y-1 text-[11px] font-medium">
                      <li>Truy cập <a href={API_KEY_LINKS.gemini} target="_blank" rel="noreferrer" className="font-bold underline text-blue-700 dark:text-sky-300">Cổng đăng ký khóa AI Cloud</a> và đăng nhập Gmail.</li>
                      <li>Bấm vào nút <strong>"Get API key"</strong> &gt; chọn <strong>"Create API key in new project"</strong>.</li>
                      <li>Copy chuỗi ký tự dạng <code className="font-mono bg-blue-100 dark:bg-sky-900 px-1 rounded">AIzaSy...</code> và dán vào ô trên rồi bấm <strong>Lưu Cấu Hình</strong>!</li>
                    </ol>
                  </div>
                </div>

                {/* 2. OpenAI Key Card (Optional) */}
                <div className="p-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">🤖</span>
                      <div>
                        <strong className="text-sm font-black text-slate-900 dark:text-white block">
                          OpenAI API Key (Tùy Chọn - GPT-4o / GPT-4o-mini)
                        </strong>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                          Dành cho trường hợp bạn muốn dùng tài khoản OpenAI Platform trả phí.
                        </span>
                      </div>
                    </div>

                    <a
                      href={API_KEY_LINKS.openai}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Lấy OpenAI Key</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                        OpenAI API Key (Bắt đầu bằng <code className="font-mono text-[#2383e2] dark:text-sky-400">sk-...</code>):
                      </label>
                      {openaiApiKey && (
                        <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                          🔒 {maskApiKey(openaiApiKey)}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showOpenaiKey ? 'text' : 'password'}
                        placeholder="sk-..."
                        value={openaiApiKey}
                        onChange={(e) => setOpenaiApiKey(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-[#2383e2]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        title={showOpenaiKey ? 'Ẩn khóa' : 'Hiện khóa'}
                      >
                        {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#2383e2] hover:bg-[#1a73e8] text-white text-white text-xs font-black rounded-xl shadow-lg flex items-center space-x-2 transition-transform transform hover:scale-105 active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Cấu Hình Thẻ API</span>
                  </button>
                </div>

              </form>

            </div>
          )}

        </div>

      </div>

      {/* MODAL 1: ADMIN DIRECT BALANCE ADJUSTMENT (+ NẠP XU / - TRỪ XU) */}
      {adjustModal.isOpen && adjustModal.user && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className={`p-2 rounded-2xl ${
                  adjustModal.type === 'deposit'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                }`}>
                  {adjustModal.type === 'deposit' ? <PlusCircle className="w-5 h-5" /> : <MinusCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    {adjustModal.type === 'deposit' ? 'Cộng Xu Cho Học Viên' : 'Trừ Xu Học Viên'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Admin điều chỉnh số dư trực tiếp</p>
                </div>
              </div>
              <button
                onClick={() => setAdjustModal({ ...adjustModal, isOpen: false })}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Target User Info */}
            <div className="my-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Tài Khoản Thụ Hưởng</span>
                <span className="font-black text-xs text-slate-900 dark:text-white block truncate">{adjustModal.user.displayName || adjustModal.user.email}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">{adjustModal.user.email}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Số Dư Hiện Tại</span>
                <span className="font-black text-sm text-amber-600 dark:text-amber-400">
                  {getUserBalanceForEmail(adjustModal.user.email).toLocaleString()} Xu
                </span>
              </div>
            </div>

            {/* Type selector toggle */}
            <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setAdjustModal({ ...adjustModal, type: 'deposit' })}
                className={`py-2 rounded-xl text-xs font-black transition-all ${
                  adjustModal.type === 'deposit'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                + Cộng Xu (Nạp)
              </button>
              <button
                type="button"
                onClick={() => setAdjustModal({ ...adjustModal, type: 'withdraw' })}
                className={`py-2 rounded-xl text-xs font-black transition-all ${
                  adjustModal.type === 'withdraw'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                - Trừ Xu (Rút / Phạt)
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleDirectAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                  Số Lượng Xu Cần {adjustModal.type === 'deposit' ? 'Cộng' : 'Trừ'}:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={adjustModal.type === 'withdraw' ? getUserBalanceForEmail(adjustModal.user.email) : 100000}
                    value={adjustModal.amount}
                    onChange={(e) => setAdjustModal({ ...adjustModal, amount: Math.max(1, parseInt(e.target.value) || 0) })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black text-slate-900 dark:text-white outline-none focus:border-[#2383e2]"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-amber-500">
                    Xu (~{((adjustModal.amount || 0) * COIN_RATE_VND).toLocaleString()}đ)
                  </span>
                </div>

                {/* Quick amount chips */}
                <div className="flex items-center space-x-1.5 mt-2 flex-wrap gap-y-1">
                  {[20, 50, 100, 200, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAdjustModal({ ...adjustModal, amount: amt })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black border transition-colors ${
                        adjustModal.amount === amt
                          ? 'bg-[#2383e2] text-white border-[#2383e2]'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      +{amt} Xu
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                  Lý Do / Ghi Chú:
                </label>
                <input
                  type="text"
                  placeholder={adjustModal.type === 'deposit' ? 'VD: Duyệt chuyển khoản ngoài Momo / Thưởng nhiệm vụ' : 'VD: Duyệt rút tiền mặt / Hoàn hủy giao dịch'}
                  value={adjustModal.reason}
                  onChange={(e) => setAdjustModal({ ...adjustModal, reason: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-[#2383e2]"
                />
              </div>

              {/* Balance Simulation */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs">
                <span className="text-amber-900 dark:text-amber-200 font-bold block">
                  Số dư sau khi thực hiện:
                </span>
                <span className="text-base font-black text-amber-600 dark:text-amber-400">
                  {Math.max(
                    0,
                    getUserBalanceForEmail(adjustModal.user.email) +
                      (adjustModal.type === 'deposit' ? adjustModal.amount : -adjustModal.amount)
                  ).toLocaleString()}{' '}
                  Xu
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModal({ ...adjustModal, isOpen: false })}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting || (adjustModal.type === 'withdraw' && getUserBalanceForEmail(adjustModal.user.email) < adjustModal.amount)}
                  className={`px-5 py-2.5 rounded-xl text-white font-black text-xs shadow-md flex items-center space-x-1.5 transition-all ${
                    adjustModal.type === 'deposit'
                      ? 'bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50'
                      : 'bg-rose-600 hover:bg-rose-700 disabled:opacity-50'
                  }`}
                >
                  {isAdjusting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang Xử Lý...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{adjustModal.type === 'deposit' ? 'Xác Nhận Nạp Xu' : 'Xác Nhận Trừ Xu'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: USER TRANSACTION HISTORY */}
      {selectedUserHistory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 relative max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedUserHistory.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedUserHistory.email)}`}
                  alt={selectedUserHistory.displayName}
                  className="w-10 h-10 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    Lịch Sử Giao Dịch: {selectedUserHistory.displayName || selectedUserHistory.email}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Số dư hiện tại: <strong className="text-amber-600 dark:text-amber-400 font-black">{getUserBalanceForEmail(selectedUserHistory.email).toLocaleString()} Xu</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserHistory(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 my-4 space-y-2.5 pr-1">
              {(!selectedUserHistory.userTxs || selectedUserHistory.userTxs.length === 0) ? (
                <div className="text-center py-12 text-slate-400 text-xs font-bold">
                  Học viên này chưa có phát sinh giao dịch nào.
                </div>
              ) : (
                selectedUserHistory.userTxs.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                          t.type === 'deposit'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {t.type === 'deposit' ? 'NẠP XU' : 'RÚT TIỀN'}
                        </span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">#{t.id}</span>
                        <span className="text-[10px] text-slate-400">{formatHanoiDateTime(t.createdAt)}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 truncate">
                        {t.details?.note || t.details?.method || (t.details?.bankName ? `${t.details.bankName} - ${t.details.accountNo}` : 'Giao dịch hệ thống')}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`font-black text-sm ${t.type === 'deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {t.type === 'deposit' ? '+' : '-'}{t.xuAmount} Xu
                      </div>
                      <span className={`inline-block px-2 py-0.2 rounded-full text-[9px] font-black mt-0.5 ${
                        t.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : t.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {t.status === 'approved' ? 'Đã Duyệt ✅' : t.status === 'pending' ? 'Chờ Duyệt' : 'Từ Chối ❌'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                Tổng cộng {selectedUserHistory.userTxs?.length || 0} giao dịch
              </span>
              <button
                onClick={() => setSelectedUserHistory(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: STATUS & TIER MANAGEMENT (TĂNG CẤP / GIÁNG CẤP / TRẠNG THÁI) */}
      {statusModal.isOpen && statusModal.user && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 relative overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#2383e2] dark:text-sky-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    Tăng / Giáng Cấp & Status Tài Khoản
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Phân quyền, nâng hạ gói dịch vụ và kiểm soát truy cập
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Target User Info */}
            <div className="my-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between shrink-0">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Học Viên</span>
                <span className="font-black text-xs text-slate-900 dark:text-white block truncate">{statusModal.user.displayName || statusModal.user.email}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">{statusModal.user.email}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Số Dư Ví</span>
                <span className="font-black text-sm text-amber-600 dark:text-amber-400">
                  {getUserBalanceForEmail(statusModal.user.email).toLocaleString()} Xu
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveStatusModal} className="overflow-y-auto space-y-4 pr-1 flex-1">
              {/* SECTION 1: CẤP BẬC GÓI (TIER) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                    <span>👑 Cấp Bậc Gói Dịch Vụ:</span>
                  </label>
                  {/* Quick promote & demote buttons */}
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      disabled={statusModal.tier === 'ultra'}
                      onClick={() => {
                        const tiers = ['free', 'plus', 'pro', 'ultra'];
                        const idx = tiers.indexOf(statusModal.tier);
                        if (idx < tiers.length - 1) setStatusModal({ ...statusModal, tier: tiers[idx + 1] });
                      }}
                      className="px-2 py-0.5 rounded-md bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-[10px] font-black disabled:opacity-30 transition-colors flex items-center space-x-0.5"
                    >
                      <ChevronUp className="w-3 h-3" />
                      <span>Tăng 1 Cấp</span>
                    </button>
                    <button
                      type="button"
                      disabled={statusModal.tier === 'free'}
                      onClick={() => {
                        const tiers = ['free', 'plus', 'pro', 'ultra'];
                        const idx = tiers.indexOf(statusModal.tier);
                        if (idx > 0) setStatusModal({ ...statusModal, tier: tiers[idx - 1] });
                      }}
                      className="px-2 py-0.5 rounded-md bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-300 text-[10px] font-black disabled:opacity-30 transition-colors flex items-center space-x-0.5"
                    >
                      <ChevronDown className="w-3 h-3" />
                      <span>Giáng 1 Cấp</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'free', name: 'Free', desc: '3 lượt AI/ngày • Phí 15%' },
                    { key: 'plus', name: 'Plus ⭐', desc: '20 lượt AI/ngày • Phí 10%' },
                    { key: 'pro', name: 'Pro 🚀', desc: '50 lượt AI/ngày • Phí 7%' },
                    { key: 'ultra', name: 'Ultra VIP 👑', desc: 'Không giới hạn • Phí 3%' }
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setStatusModal({ ...statusModal, tier: t.key })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        statusModal.tier === t.key
                          ? 'bg-[#2383e2]/10 border-[#2383e2] ring-2 ring-[#2383e2]/30 shadow-xs'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black ${statusModal.tier === t.key ? 'text-[#2383e2] dark:text-sky-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {t.name}
                        </span>
                        {statusModal.tier === t.key && <Check className="w-3.5 h-3.5 text-[#2383e2] dark:text-sky-400" />}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 2: VAI TRÒ (ROLE) */}
              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-2">
                  🎓 Vai Trò Tài Khoản (Role):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'student', label: '👨‍🎓 Học Viên', desc: 'Người học cơ bản' },
                    { key: 'creator', label: '🎓 Creator', desc: 'Tác giả tạo và bán bộ thẻ' },
                    { key: 'vip', label: '💎 Khách VIP', desc: 'Thành viên ưu tiên' },
                    { key: 'admin', label: '🛡️ Quản Trị Viên', desc: 'Toàn quyền kiểm soát' }
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setStatusModal({ ...statusModal, role: r.key })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        statusModal.role === r.key
                          ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 dark:border-purple-600 ring-2 ring-purple-400/30'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black ${statusModal.role === r.key ? 'text-purple-700 dark:text-purple-300' : 'text-slate-800 dark:text-slate-200'}`}>
                          {r.label}
                        </span>
                        {statusModal.role === r.key && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 3: TRẠNG THÁI HOẠT ĐỘNG (STATUS) */}
              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-2">
                  ⚡ Trạng Thái Hoạt Động (Account Status):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'active', label: '🟢 Hoạt Động', desc: 'Truy cập bình thường' },
                    { key: 'verified', label: '🔵 Tích Xanh', desc: 'Đã xác thực uy tín' },
                    { key: 'suspended', label: '🔴 Khóa / Đình Chỉ', desc: 'Chặn quyền truy cập' }
                  ].map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setStatusModal({ ...statusModal, status: s.key })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        statusModal.status === s.key
                          ? s.key === 'suspended'
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-400/30'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-400/30'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">
                          {s.label}
                        </span>
                        {statusModal.status === s.key && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      </div>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-0.5">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="px-5 py-2.5 rounded-xl bg-[#2383e2] hover:bg-[#1a73e8] text-white font-black text-xs shadow-md flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  {isUpdatingStatus ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang Lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Lưu Cấp Bậc & Status</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION FOR ADJUSTMENTS */}
      {adjustToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-black flex items-center space-x-2 animate-in slide-in-from-bottom">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{adjustToast}</span>
        </div>
      )}

    </div>
  );
}
