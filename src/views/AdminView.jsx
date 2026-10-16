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
  Users
} from 'lucide-react';
import { isUserAdmin, getAdminEmail, maskApiKey, PRIMARY_ADMIN_EMAIL } from '../utils/adminGuard';
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
  ADMIN_EMAIL,
  ADMIN_PHONE,
  ADMIN_NTFY_TOPIC,
  COIN_RATE_VND,
  sendRealEmailToAdmin,
  sendNtfyNotification,
  getTelegramConfig,
  saveTelegramConfig,
  sendTelegramNotification
} from '../utils/wallet';
import { getTierLimits, saveTierLimits } from '../utils/userTier';
import { getMarketplaceDecks, adminUpdateMarketplaceDeck, deleteMarketplaceDeck } from '../data/marketplaceData';
import { checkDeckDuplication } from '../utils/duplicateChecker';
import { playSound } from '../utils/storage';
import {
  getFirebaseConfig,
  saveFirebaseConfig,
  testFirebaseConnection,
  isRealFirebaseConfigured,
  DEFAULT_FIREBASE_CONFIG
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

export default function AdminView({ user, onBackToHome, onOpenChangelog }) {
  const isAdmin = isUserAdmin(user);

  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'tiers' | 'marketplace' | 'notifications' | 'firebase' | 'ai_api'
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tierLimits, setTierLimits] = useState({});
  const [marketDecks, setMarketDecks] = useState([]);
  const [marketFilter, setMarketFilter] = useState('all'); // 'all' | 'duplicates' | 'pass' | 'clean'
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

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

  // Telegram & Real Email State
  const [telegramConfig, setTelegramConfig] = useState(() => getTelegramConfig());
  const [telegramTestMsg, setTelegramTestMsg] = useState('');
  const [emailTestMsg, setEmailTestMsg] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [isSendingTelegramTest, setIsSendingTelegramTest] = useState(false);
  const [ntfyTestMsg, setNtfyTestMsg] = useState('');
  const [isSendingNtfyTest, setIsSendingNtfyTest] = useState(false);
  const [copiedNtfyTopic, setCopiedNtfyTopic] = useState(false);
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);
  const [approvingTxId, setApprovingTxId] = useState(null);

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
      const freshTxs = await fetchFirestoreTransactions();
      if (freshTxs && freshTxs.length > 0) {
        setTransactions(freshTxs);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (!isAdmin) return;
    reloadData();
    // Real-time listener for Firestore & cross-device transactions
    const unsubscribe = subscribeToTransactions((latestTxs) => {
      setTransactions(latestTxs);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [isAdmin]);

  // STRICT ADMIN AUTHORIZATION CHECK: ONLY 1 AUTHORIZED ACCOUNT ALLOWED
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 sm:p-8 bg-white rounded-xl border border-rose-200 text-center text-[#37352f] shadow-lg">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 flex items-center justify-center mx-auto mb-4 border border-rose-300 shadow-sm">
          <ShieldAlert className="w-9 h-9 text-rose-600 animate-pulse" />
        </div>
        <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 bg-rose-200/80 text-rose-900 rounded-full border border-rose-300">
          CẢNH BÁO BẢO MẬT HỆ THỐNG
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-[#37352f] uppercase tracking-tight mt-3 mb-2">
          403 - KHÔNG CÓ QUYỀN TRUY CẬP
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6 font-medium">
          Cửa sổ Quản Trị Viên (Secret Admin Portal) được bảo mật nghiêm ngặt và <strong>chỉ duy nhất 1 tài khoản Admin chính thức</strong> mới có quyền thao tác:
          <br />
          <span className="inline-block mt-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#e9e9e8] font-mono font-bold text-[#2383e2] shadow-xs">
            👑 {PRIMARY_ADMIN_EMAIL}
          </span>
        </p>

        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 mb-6 text-left space-y-1">
          <div className="flex items-center space-x-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Tài khoản hiện tại của bạn:</span>
          </div>
          <p className="font-mono text-slate-800 font-bold pl-5">
            {user?.email ? user.email : '(Chưa đăng nhập tài khoản nào)'}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={onBackToHome}
            className="px-6 py-2.5 rounded-2xl bg-[#2383e2] hover:bg-[#1a73e8] text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Quay Về Trang Chủ
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

  // Reset to Demo
  const handleResetToDemo = () => {
    if (confirm('Bạn có chắc muốn đặt lại cấu hình Firebase về chế độ Thử Nghiệm mặc định?')) {
      saveFirebaseConfig(DEFAULT_FIREBASE_CONFIG);
      setFirebaseConfig(DEFAULT_FIREBASE_CONFIG);
      setRawSnippet('');
      setTestResult(null);
      setFirebaseSaveMsg('Đã đặt lại về chế độ Thử Nghiệm mặc định.');
      setTimeout(() => setFirebaseSaveMsg(''), 3000);
    }
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

  // Test Real Email Delivery to thaitraicau123@gmail.com
  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    setEmailTestMsg('');
    const res = await sendRealEmailToAdmin({
      type: 'deposit',
      code: 'TEST' + Math.floor(100000 + Math.random() * 900000),
      amountXu: 50,
      amountVnd: 50000,
      userEmail: 'hocvien_test@onthihub.vn',
      details: {
        note: 'Email kiểm tra hệ thống thông báo nạp/rút tự động gửi trực tiếp về thaitraicau123@gmail.com'
      }
    });
    setIsSendingTestEmail(false);
    if (res.success) {
      playSound('success');
      setEmailTestMsg('🎉 ĐÃ GỬI THÀNH CÔNG! Hãy mở Gmail thaitraicau123@gmail.com để kiểm tra hòm thư (kể cả mục Thư rác/Spam).');
    } else {
      const msg = res.data?.message || res.error || 'Vui lòng kiểm tra lại kết nối mạng';
      setEmailTestMsg(`ℹ️ Phản hồi từ máy chủ FormSubmit: "${msg}". Nếu đây là lần đầu tiên, FormSubmit đã gửi email có nút "Activate Form" đến thaitraicau123@gmail.com, bạn chỉ cần bấm kích hoạt 1 lần duy nhất.`);
    }
  };

  // Test Real-time Phone Notification via ntfy.sh
  const handleSendTestNtfy = async () => {
    setIsSendingNtfyTest(true);
    setNtfyTestMsg('');
    const res = await sendNtfyNotification({
      title: '🔔 [ÔnThiHub] Chuông Báo Điện Thoại Thử Nghiệm!',
      message: '✅ Kết nối thành công! Khi có khách nạp hoặc rút tiền, thông báo sẽ reo chuông màn hình khóa điện thoại của bạn như thế này.',
      priority: 5,
      tags: ['tada', 'bell']
    });
    setIsSendingNtfyTest(false);
    if (res.success) {
      playSound('success');
      setNtfyTestMsg('🎉 ĐÃ BẮN CHUÔNG THÀNH CÔNG! Hãy kiểm tra màn hình khóa hoặc mở app ntfy trên điện thoại của bạn.');
    } else {
      setNtfyTestMsg('❌ Không thể gửi chuông báo: ' + (res.error || 'Vui lòng kiểm tra kết nối mạng'));
    }
    setTimeout(() => setNtfyTestMsg(''), 10000);
  };

  // Save & Test Telegram Config
  const handleSaveTelegram = (e) => {
    e.preventDefault();
    saveTelegramConfig(telegramConfig);
    playSound('success');
    setTelegramTestMsg('✅ Đã lưu cấu hình Telegram Bot thành công!');
    setTimeout(() => setTelegramTestMsg(''), 4000);
  };

  const handleTestTelegram = async () => {
    setIsSendingTelegramTest(true);
    setTelegramTestMsg('');
    const res = await sendTelegramNotification({
      type: 'deposit',
      code: 'TELEGRAM' + Math.floor(1000 + Math.random() * 9000),
      amountXu: 100,
      amountVnd: 100000,
      userEmail: 'creator@onthihub.vn',
      details: { note: 'Thử nghiệm thông báo Telegram Bot OnThiHub' }
    });
    setIsSendingTelegramTest(false);
    if (res.success) {
      playSound('success');
      setTelegramTestMsg('🚀 Đã gửi tin nhắn Telegram thành công tới điện thoại của bạn!');
    } else {
      setTelegramTestMsg('❌ Gửi thất bại: ' + (res.data?.description || res.error || 'Vui lòng kiểm tra lại Bot Token và Chat ID'));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* ADMIN HEADER (Wayground Dark Velvet Wine Card) */}
      <div className="bg-[#fbfbfa] border border-[#e9e9e8] text-[#37352f] p-6 rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2383e2] flex items-center justify-center font-bold shadow-md shadow-pink-900/40">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                CỬA SỔ QUẢN TRỊ VIÊN (SECRET ADMIN PORTAL)
              </h2>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-50 text-[#2383e2] border border-blue-200">
                Duyệt Chay 24/7
              </span>
            </div>
            <p className="text-xs text-[#787774] mt-1 font-normal flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Admin Phone: <strong className="text-amber-300 font-mono font-black">{ADMIN_PHONE}</strong></span>
              <span>•</span>
              <span>Email: <strong className="text-amber-300 font-mono">{ADMIN_EMAIL}</strong></span>
              <span>•</span>
              <span>Web Push: <a href={ADMIN_NTFY_TOPIC} target="_blank" rel="noreferrer" className="text-cyan-300 font-mono underline hover:text-white">ntfy.sh Topic</a></span>
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
              <span>Bảng Tin Bản Mới (v2.6)</span>
            </button>
          )}
          <button
            onClick={reloadData}
            className="p-2.5 text-[#787774] hover:text-[#37352f] hover:bg-black/5 rounded-xl transition-colors"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onBackToHome}
            className="px-4 py-2 bg-white hover:bg-black/5 border border-[#e9e9e8] text-[#37352f] rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#2383e2]" />
            <span>Quay Lại Trang Chủ</span>
          </button>
        </div>
      </div>

      {/* ADMIN TABS SWITCHER (Wayground Warm Cream Container) */}
      <div className="bg-white rounded-xl border border-[#e9e9e8] shadow-xs overflow-hidden text-[#37352f]">
        <div className="flex border-b border-[#e9e9e8] bg-[#f7f6f5] text-xs sm:text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'transactions'
                ? 'border-[#2383e2] text-[#2383e2] bg-[#ffffff] font-black'
                : 'border-transparent text-[#787774] hover:text-[#37352f]'
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
                ? 'border-[#2383e2] text-[#2383e2] bg-[#ffffff] font-black'
                : 'border-transparent text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <span>Quản Lý Diễn Đàn & Xóa Bài</span>
            <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-full text-[10px] font-bold">
              {communityPosts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tiers')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'tiers'
                ? 'border-[#2383e2] text-[#2383e2] bg-[#ffffff] font-black'
                : 'border-transparent text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#2383e2]" />
            <span>Tùy Chỉnh Giới Hạn Gói (Free/Plus/Pro/Ultra)</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'marketplace'
                ? 'border-[#2383e2] text-[#2383e2] bg-[#ffffff] font-black'
                : 'border-transparent text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Quản Lý Sàn C2C ({marketDecks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('system_logs')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'system_logs'
                ? 'border-[#2383e2] text-[#2383e2] bg-[#ffffff] font-black'
                : 'border-transparent text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Vết Giờ Hà Nội & Nhật Ký ({studyLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'notifications'
                ? 'border-[#2383e2] text-[#2383e2] bg-[#ffffff] font-black'
                : 'border-transparent text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <BellRing className="w-4 h-4 text-[#2383e2]" />
            <span>Nhật Ký Thông Báo ({notifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'firebase'
                ? 'border-[#2383e2] text-[#2383e2] bg-[#ffffff] font-black'
                : 'border-transparent text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <Database className="w-4 h-4 text-amber-500" />
            <span>Cấu Hình Firebase Cloud</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              isRealFirebaseConfigured() ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isRealFirebaseConfigured() ? '🟢 Cloud Thật' : '🟡 Thử Nghiệm'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('blindbox')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'blindbox'
                ? 'border-[#2383e2] text-[#2383e2] bg-[#ffffff] font-black'
                : 'border-transparent text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <Gift className="w-4 h-4 text-purple-600" />
            <span>Tỷ Lệ Túi Mù (Gacha)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800">
              Nhà Cái 80%+
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ai_api')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'ai_api'
                ? 'border-[#2383e2] text-[#2383e2] bg-[#ffffff] font-black'
                : 'border-transparent text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-600" />
            <span>Thẻ API Key AI (ÔnThiHub Cloud)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              hasValidAiKey() ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {hasValidAiKey() ? '🟢 Đã Kích Hoạt' : '🔴 Chưa Có Key'}
            </span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-6 sm:p-8">
          
          {/* TAB 1: DUYỆT NẠP & RÚT */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-black text-[#37352f]">Danh Sách Lệnh Nạp / Rút Chờ Duyệt Chay</h4>
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-0.5"></span>
                      <span>Firebase Realtime Sync</span>
                    </span>
                  </div>
                  <p className="text-xs text-[#787774] font-medium">
                    Tất cả tài khoản/điện thoại nạp rút đều được đưa lên Firebase Firestore và đồng bộ thời gian thực tại đây.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleManualSyncFirebase}
                    disabled={isSyncingFirebase}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#ffffff] border border-[#e9e9e8] text-xs font-black text-[#37352f] shadow-xs transition-colors"
                    title="Đồng bộ lại dữ liệu mới nhất từ Firebase Firestore"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#2383e2] ${isSyncingFirebase ? 'animate-spin' : ''}`} />
                    <span>{isSyncingFirebase ? 'Đang Tải...' : 'Làm Mới Firebase'}</span>
                  </button>
                  <span className="text-xs font-black px-3 py-1 rounded-xl bg-white text-[#37352f] border border-[#e9e9e8]">
                    Tổng {transactions.length} lệnh
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-pink-50 to-amber-50 rounded-2xl border border-[#e9e9e8] text-xs text-[#37352f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-[#2383e2] shrink-0" />
                  <span>
                    Tính năng duyệt tiền đã kết nối <strong>Firebase Firestore (onthi-hub)</strong>. Khi bấm "Duyệt", số dư ví của học viên trên mọi thiết bị sẽ được cộng Xu tức thì!
                  </span>
                </div>
                <a
                  href="https://console.firebase.google.com/project/onthi-hub/firestore"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#2383e2] hover:text-[#1a73e8] font-black underline flex items-center space-x-1 shrink-0 text-[11px]"
                >
                  <span>Mở Firestore Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#e9e9e8]">
                  <Coins className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-[#787774] font-bold">Chưa có giao dịch nạp / rút nào.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#e9e9e8] overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f7f6f5] border-b border-[#e9e9e8] text-[#37352f] uppercase tracking-wider font-black">
                      <tr>
                        <th className="p-3">Mã GD</th>
                        <th className="p-3">Loại</th>
                        <th className="p-3">Số Lượng</th>
                        <th className="p-3">Khách Hàng / Ngân Hàng</th>
                        <th className="p-3">Trạng Thái</th>
                        <th className="p-3 text-right">Thao Tác Duyệt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e9e9e8]/60">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-[#ffffff]/60 transition-colors">
                          <td className="p-3 font-mono font-black text-[#37352f]">
                            {tx.id}
                            <span className="block text-[10px] text-[#787774] font-normal">
                              {new Date(tx.createdAt).toLocaleTimeString('vi-VN')} {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              tx.type === 'deposit'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {tx.type === 'deposit' ? 'NẠP XU' : 'RÚT TIỀN'}
                            </span>
                          </td>
                          <td className="p-3">
                            <strong className="text-[#37352f] font-black">{tx.xuAmount} Xu</strong>
                            <span className="block text-[11px] text-[#787774] font-bold">
                              ~{(tx.amountVnd || tx.xuAmount * COIN_RATE_VND).toLocaleString()}đ
                            </span>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="text-[#37352f] font-black truncate">{tx.userEmail}</div>
                            {tx.type === 'withdraw' && tx.details && (
                              <div className="text-[11px] text-[#787774] bg-[#ffffff] p-2 rounded-xl mt-1 border border-[#e9e9e8]">
                                <span className="font-black text-[#37352f]">{tx.details.bankName}</span> • STK: <span className="font-mono font-black text-[#2383e2]">{tx.details.accountNo}</span>
                                <div className="text-[#787774]">Chủ TK: {tx.details.accountName}</div>
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            {tx.status === 'pending' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black animate-pulse">
                                Chờ Duyệt Chay
                              </span>
                            )}
                            {tx.status === 'approved' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                                Đã Duyệt ✅
                              </span>
                            )}
                            {tx.status === 'rejected' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black" title={tx.rejectReason}>
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
                                  className="px-3 py-1 bg-rose-100 hover:bg-rose-200 disabled:opacity-50 text-rose-700 rounded-lg text-[11px] font-black border border-rose-300 flex items-center space-x-1 transition-all"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Từ chối</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-[#787774] text-[11px] italic font-bold">Hoàn tất</span>
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
                  <div className="p-4 bg-white rounded-xl border border-[#e9e9e8] shadow-xs">
                    <div className="flex items-center justify-between text-[#787774] mb-1">
                      <span className="text-xs font-semibold">Tổng Bài Viết</span>
                      <MessageSquare className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-[#37352f]">{communityPosts.length}</div>
                    <div className="text-[11px] text-[#787774] mt-0.5 font-normal">Đang hoạt động trên web</div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#e9e9e8] shadow-xs">
                    <div className="flex items-center justify-between text-[#787774] mb-1">
                      <span className="text-xs font-semibold">Bài Ghim Đầu Trang</span>
                      <Pin className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-600">{pinnedCount}</div>
                    <div className="text-[11px] text-[#787774] mt-0.5 font-normal">Thông báo & hướng dẫn</div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#e9e9e8] shadow-xs">
                    <div className="flex items-center justify-between text-[#787774] mb-1">
                      <span className="text-xs font-semibold">Tổng Bình Luận</span>
                      <Users className="w-4 h-4 text-[#2383e2]" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-[#2383e2]">{totalComments}</div>
                    <div className="text-[11px] text-[#787774] mt-0.5 font-normal">Tương tác hỏi đáp</div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#e9e9e8] shadow-xs">
                    <div className="flex items-center justify-between text-[#787774] mb-1">
                      <span className="text-xs font-semibold">Lượt Thả Tim</span>
                      <ThumbsUp className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-rose-600">{totalLikes}</div>
                    <div className="text-[11px] text-[#787774] mt-0.5 font-normal">Học viên ủng hộ</div>
                  </div>
                </div>

                {/* Control & Filter Toolbar */}
                <div className="bg-white p-4 rounded-xl border border-[#e9e9e8] shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black text-[#37352f] flex items-center space-x-2">
                        <span>🛡️ Bảng Điều Khiển Kiểm Duyệt Bài Viết Cộng Đồng</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          Admin Quyền Năng
                        </span>
                      </h4>
                      <p className="text-xs text-[#787774] font-medium">
                        Xóa ngay lập tức bài đăng spam, ghim bài hữu ích, và gỡ bình luận tiêu cực. Dữ liệu đồng bộ trực tiếp lên Firebase & Cloud Relay.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <button
                        onClick={reloadData}
                        className="px-3 py-1.5 bg-[#f7f6f5] hover:bg-[#e9e9e8] text-[#37352f] rounded-lg text-xs font-semibold border border-[#e9e9e8] flex items-center space-x-1.5 transition-colors cursor-pointer"
                        title="Tải lại toàn bộ bài viết mới nhất"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Đồng Bộ</span>
                      </button>

                      <button
                        onClick={handleExportCommunityJson}
                        className="px-3 py-1.5 bg-[#f7f6f5] hover:bg-[#e9e9e8] text-[#37352f] rounded-lg text-xs font-semibold border border-[#e9e9e8] flex items-center space-x-1.5 transition-colors cursor-pointer"
                        title="Tải về file JSON sao lưu bài viết"
                      >
                        <Download className="w-3.5 h-3.5 text-[#2383e2]" />
                        <span>Xuất Sao Lưu JSON</span>
                      </button>

                      <button
                        onClick={handleAdminClearSpam}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold border border-rose-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
                        title="Dọn dẹp bài spam và khôi phục bài viết mặc định"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Dọn Rác / Khôi Phục</span>
                      </button>
                    </div>
                  </div>

                  {/* Search and Category Filter */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#f0efed]">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-3.5 h-3.5 text-[#9b9a97] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm bài viết theo nội dung, tác giả, hoặc ID (#post_...)"
                        value={communitySearchQuery}
                        onChange={(e) => setCommunitySearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f7f6f5] hover:bg-[#f0efed] focus:bg-white text-[#37352f] rounded-lg border border-[#e9e9e8] focus:border-[#2383e2] outline-none transition-all placeholder:text-[#9b9a97]"
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
                              ? 'bg-[#37352f] text-white shadow-2xs'
                              : 'bg-[#f7f6f5] hover:bg-[#f0efed] text-[#5a5955] border border-[#e9e9e8]'
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
                  <div className="text-center py-12 bg-white rounded-xl border border-[#e9e9e8] space-y-2">
                    <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-[#37352f]">Không tìm thấy bài viết nào</p>
                    <p className="text-xs text-[#787774]">
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
                          className="bg-white rounded-xl p-4 sm:p-5 border border-[#e9e9e8] hover:border-[#c5c4c0] shadow-xs space-y-3 transition-colors"
                        >
                          {/* Post Header Row */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#f0efed]">
                            <div className="flex items-center space-x-3">
                              <img
                                src={post.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                                alt={post.author}
                                className="w-9 h-9 rounded-full object-cover border border-[#e9e9e8] shrink-0"
                              />
                              <div>
                                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                  <h4 className="text-xs sm:text-sm font-bold text-[#37352f]">{post.author}</h4>
                                  {post.isPinned && (
                                    <span className="notion-tag notion-tag-yellow text-[10px] flex items-center space-x-0.5">
                                      <Pin className="w-2.5 h-2.5" />
                                      <span>Đang Ghim</span>
                                    </span>
                                  )}
                                  <span className="notion-tag notion-tag-blue text-[10px]">
                                    {post.categoryLabel || catMap[post.category] || post.category || 'Hỏi Đáp'}
                                  </span>
                                  <span className="text-[10px] font-mono text-[#9b9a97] bg-[#f7f6f5] px-1.5 py-0.5 rounded border border-[#e9e9e8]">
                                    #{post.id}
                                  </span>
                                </div>
                                <div className="text-[11px] text-[#787774] flex items-center space-x-2 mt-0.5">
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
                                    ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                                    : 'bg-[#f7f6f5] text-[#5a5955] border-[#e9e9e8] hover:bg-[#e9e9e8]'
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
                                className="px-2.5 py-1 bg-[#f7f6f5] hover:bg-[#e9e9e8] text-[#37352f] border border-[#e9e9e8] rounded-md text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                                title="Xem và quản lý các bình luận dưới bài viết"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-[#2383e2]" />
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
                          <div className="p-3 bg-[#fbfbfa] rounded-lg border border-[#e9e9e8] text-xs sm:text-sm text-[#37352f] leading-relaxed whitespace-pre-line font-normal">
                            {post.content}
                          </div>

                          {/* Post Interactions */}
                          <div className="flex items-center justify-between text-xs text-[#787774] pt-1">
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
                            <span className="text-[11px] text-[#9b9a97]">
                              Tình trạng: {post.isPinned ? '📌 Ưu tiên hiển thị' : 'Tiêu chuẩn'}
                            </span>
                          </div>

                          {/* Expandable Comments Management Panel */}
                          {isExpanded && (
                            <div className="pt-3 border-t border-[#e9e9e8] space-y-2 animate-fade-in">
                              <div className="flex items-center justify-between text-xs font-bold text-[#37352f]">
                                <span>Danh Sách Bình Luận ({post.comments?.length || 0})</span>
                                <span className="text-[11px] text-[#787774] font-normal">
                                  Bấm vào biểu tượng thùng rác để xóa bình luận vi phạm
                                </span>
                              </div>

                              {(!post.comments || post.comments.length === 0) ? (
                                <p className="text-xs text-[#787774] italic py-2">
                                  Chưa có bình luận nào dưới bài viết này.
                                </p>
                              ) : (
                                <div className="space-y-1.5">
                                  {post.comments.map((cm, cIdx) => (
                                    <div
                                      key={cIdx}
                                      className="p-2.5 bg-[#f7f6f5] rounded-lg text-xs flex items-start justify-between gap-3 border border-[#e9e9e8]"
                                    >
                                      <div className="space-y-0.5">
                                        <div className="font-bold text-[#37352f] flex items-center space-x-2">
                                          <span>{cm.author}</span>
                                          {cm.createdAt && (
                                            <span className="text-[10px] text-[#9b9a97] font-normal">
                                              {formatHanoiDateTime(cm.createdAt)}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[#5a5955] leading-relaxed font-normal">{cm.text}</p>
                                      </div>

                                      <button
                                        onClick={() => handleAdminDeleteComment(post.id, cIdx)}
                                        className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-100 transition-colors shrink-0"
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
                  <h4 className="text-sm font-black text-[#37352f]">
                    Cấu Hình Giới Hạn Từng Gói (Free, Plus, Pro, Ultra)
                  </h4>
                  <p className="text-xs text-[#787774] font-medium">
                    Chỉnh sửa số lượt tạo thẻ mỗi ngày, lượt thưởng khi điểm danh hàng ngày và phí sàn C2C.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2383e2] hover:bg-[#1a73e8] text-white text-white text-xs font-black rounded-xl shadow-md flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Cấu Hình</span>
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black rounded-xl">
                  {saveSuccessMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(tierLimits).map((tierKey) => {
                  const cfg = tierLimits[tierKey];
                  return (
                    <div key={tierKey} className="p-4 bg-white rounded-2xl border border-[#e9e9e8] space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-[#e9e9e8] pb-2">
                        <span className="text-xs font-black uppercase text-[#37352f] tracking-wide">
                          {cfg.name}
                        </span>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pink-100 text-[#2383e2] border border-pink-200">
                          {tierKey}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="text-[11px] font-bold text-[#787774] block mb-1">
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
                            className="w-full px-2.5 py-1.5 border border-[#e9e9e8] rounded-lg text-xs font-black bg-[#ffffff] text-[#37352f]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#787774] block mb-1">
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
                            className="w-full px-2.5 py-1.5 border border-[#e9e9e8] rounded-lg text-xs font-black bg-[#ffffff] text-[#37352f]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#787774] block mb-1">
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
                            className="w-full px-2.5 py-1.5 border border-[#e9e9e8] rounded-lg text-xs font-black bg-[#ffffff] text-[#37352f]"
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
                    <h4 className="text-sm font-black text-[#37352f]">
                      Quản Lý & Kiểm Duyệt Trùng Lặp Sàn Flashcard C2C
                    </h4>
                    <p className="text-xs text-[#787774] font-medium">
                      Hệ thống tự động đối chiếu Jaccard & N-gram để phát hiện đạo văn hoặc sao chép thẻ trái phép.
                    </p>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-black">
                    <button
                      onClick={() => setMarketFilter('all')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        marketFilter === 'all'
                          ? 'bg-[#37352f] text-white shadow-xs'
                          : 'bg-white text-[#37352f] border border-[#e9e9e8] hover:bg-[#f7f6f5]'
                      }`}
                    >
                      Tất cả ({marketDecks.length})
                    </button>

                    <button
                      onClick={() => setMarketFilter('duplicates')}
                      className={`px-3 py-1.5 rounded-xl flex items-center space-x-1 transition-all ${
                        marketFilter === 'duplicates'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
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
                          : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
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
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Độc Bản ({cleanCount})</span>
                    </button>
                  </div>
                </div>

                {filteredDecks.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-[#e9e9e8] text-xs text-[#787774]">
                    Không có bộ thẻ nào trong danh mục lọc này.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filteredDecks.map((deck) => (
                      <div
                        key={deck.id}
                        className={`p-4 bg-white rounded-2xl border flex flex-col justify-between shadow-xs transition-all ${
                          deck.dupCheck.similarityScore >= 55
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-[#e9e9e8]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#ffffff] text-[#37352f] border border-[#e9e9e8]">
                              {deck.categoryName || deck.category}
                            </span>
                            <span className="text-xs font-black text-[#2383e2]">
                              {deck.priceXu} Xu (~{(deck.priceXu * 1000).toLocaleString()}đ)
                            </span>
                          </div>

                          <h5 className="text-xs font-black text-[#37352f] line-clamp-1">
                            {deck.title}
                          </h5>
                          <p className="text-[11px] text-[#787774] mt-1 line-clamp-2 font-medium">
                            {deck.description}
                          </p>

                          <div className="mt-2 text-[10px] text-[#787774] font-bold">
                            Tác giả: <strong>{deck.authorName}</strong> • Đã bán: {deck.salesCount || 0} lượt
                          </div>

                          {/* Pass Deck indicator */}
                          {deck.isPassDeck && (
                            <div className="mt-2 p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-[11px]">
                              <span className="font-black flex items-center space-x-1">
                                <Repeat className="w-3.5 h-3.5 text-purple-600" />
                                <span>Thẻ Pass C2C từ học viên: {deck.passSellerName}</span>
                              </span>
                              {deck.passNote && (
                                <span className="text-[10px] text-purple-700 italic block mt-0.5">
                                  "{deck.passNote}"
                                </span>
                              )}
                            </div>
                          )}

                          {/* Duplicate Detection Alert Badge */}
                          {deck.dupCheck.similarityScore >= 55 ? (
                            <div className="mt-2.5 p-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-[11px] font-bold">
                              <div className="flex items-center space-x-1 font-black text-rose-900">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                <span>CẢNH BÁO TRÙNG LẶP CAO ({deck.dupCheck.similarityScore}%)</span>
                              </div>
                              <div className="mt-0.5 text-[10px] text-rose-700 font-medium">
                                {deck.dupCheck.reason}
                              </div>
                              <div className="mt-0.5 text-[10px] text-rose-600 truncate">
                                Bộ đối chiếu: <strong>{deck.dupCheck.matchedDeck?.title}</strong> ({deck.dupCheck.matchedDeck?.source})
                              </div>
                            </div>
                          ) : deck.dupCheck.similarityScore >= 30 ? (
                            <div className="mt-2 p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold flex items-center space-x-1">
                              <span>ℹ️ Tương đồng vừa phải ({deck.dupCheck.similarityScore}%) với:</span>
                              <span className="truncate max-w-[150px] font-black">{deck.dupCheck.matchedDeck?.title}</span>
                            </div>
                          ) : (
                            <div className="mt-2 inline-flex items-center space-x-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
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
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-5 rounded-xl border border-teal-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-teal-600 animate-pulse" />
                      <h4 className="text-sm font-black text-teal-900">
                        Đồng Bộ Chuẩn Thời Gian Hà Nội (ICT - GMT+7)
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-teal-200 text-teal-900 text-[10px] font-black">
                        LIVE CLOCK
                      </span>
                    </div>
                    <p className="text-xs text-teal-800 leading-relaxed font-medium">
                      Thời gian hiện tại: <strong>{hanoiNow.dayName}, {hanoiNow.fullFormatted}</strong>.
                      Tất cả các phiên làm bài thi thử, mục tiêu học tập hàng ngày và lịch sử giao dịch đều được ghi nhận chuẩn theo múi giờ Việt Nam.
                    </p>
                  </div>

                  <button
                    onClick={handleClearStudyLogs}
                    className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                  >
                    Xóa Nhật Ký Vết Thời Gian
                  </button>
                </div>

                {/* Study Time Trace Logs Feed */}
                <div className="bg-white rounded-xl border border-[#e9e9e8] overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-[#e9e9e8] bg-[#f7f6f5] flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#37352f]">
                        Nhật Ký Vết Thời Gian Học Tập ({studyLogs.length})
                      </h4>
                      <p className="text-[11px] text-[#787774]">
                        Lưu vết các phiên học, hoàn thành nhiệm vụ và bài thi theo chuẩn giờ Hà Nội
                      </p>
                    </div>
                  </div>

                  {studyLogs.length === 0 ? (
                    <div className="text-center py-10 text-xs text-[#787774] font-medium">
                      Chưa có vết thời gian học tập nào được ghi nhận.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f7f6f5] border-b border-[#e9e9e8] text-[#787774] font-bold">
                          <tr>
                            <th className="p-3">Thời Gian (Hà Nội)</th>
                            <th className="p-3">Hoạt Động</th>
                            <th className="p-3">Thời Lượng</th>
                            <th className="p-3">XP Thưởng</th>
                            <th className="p-3">Mã Vết</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e9e9e8]">
                          {studyLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-[#fbfbfa] transition-colors">
                              <td className="p-3 font-mono font-medium text-[#37352f]">
                                <div>{log.hanoiTime}</div>
                                <span className="text-[10px] text-[#787774]">{log.hanoiDate}</span>
                              </td>
                              <td className="p-3">
                                <div className="font-semibold text-[#37352f]">{log.title || 'Phiên học OnThiHub'}</div>
                                <span className="text-[10px] text-[#787774] uppercase tracking-wider font-bold">
                                  {log.type}
                                </span>
                              </td>
                              <td className="p-3 font-bold text-[#37352f]">
                                {log.durationMinutes} phút
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                  +{log.xpGained} XP
                                </span>
                              </td>
                              <td className="p-3 font-mono text-[10px] text-[#9b9a97]">
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

              {/* CARD 1: CẤU HÌNH GMAIL GỬI TRỰC TIẾP QUA FORMSUBMIT */}
              <div className="p-5 bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-2xl border-2 border-amber-300 shadow-sm space-y-3.5 text-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-[#37352f]">
                        Gửi Email Tự Động Trực Tiếp Về Gmail: <span className="text-[#2383e2] font-mono">{ADMIN_EMAIL}</span>
                      </h5>
                      <span className="text-[11px] text-[#787774] font-medium">
                        Cơ chế tự động qua FormSubmit API • Không cần máy chủ backend • Nhận email trong 1-3 giây
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isSendingTestEmail}
                    onClick={handleSendTestEmail}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${isSendingTestEmail ? 'animate-pulse' : ''}`} />
                    <span>{isSendingTestEmail ? 'Đang Gửi Email...' : 'Gửi Thử Email Đến Gmail Ngay'}</span>
                  </button>
                </div>

                {emailTestMsg && (
                  <div className="p-3 bg-white border border-amber-300 rounded-xl font-bold text-amber-950 text-xs">
                    {emailTestMsg}
                  </div>
                )}

                <div className="p-3 bg-white/90 rounded-xl border border-amber-200 text-[#787774] space-y-1.5 text-[11px] leading-relaxed">
                  <strong className="text-[#37352f] font-black block">
                    ⚠️ Hướng dẫn kích hoạt nhận email lần đầu (Chỉ làm 1 lần duy nhất):
                  </strong>
                  <p>1. Mở hòm thư <strong>{ADMIN_EMAIL}</strong> (vui lòng kiểm tra cả thư mục <strong>Hộp thư đến</strong> và <strong>Thư rác / Spam</strong>).</p>
                  <p>2. Tìm email do máy chủ <strong>FormSubmit</strong> gửi tới với tiêu đề <em>"FormSubmit - Confirm your email address"</em> hoặc <em>"Activate Form"</em>.</p>
                  <p>3. Bấm vào nút <strong>"Activate Form"</strong> trong email đó.</p>
                  <p className="text-emerald-700 font-bold">
                    ✅ Sau khi bấm, máy chủ FormSubmit sẽ kích hoạt vĩnh viễn. Mọi lệnh Nạp tiền và Rút tiền từ học viên trên web sẽ tự động gửi thẳng email chi tiết về Gmail của anh!
                  </p>
                </div>
              </div>

                {/* CARD 2: PUSH CHUÔNG BÁO ĐIỆN THOẠI QUA NTFY.SH */}
              <div className="p-5 sm:p-6 bg-white rounded-2xl border border-[#e9e9e8] shadow-xs space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-900/20">
                      <BellRing className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-black text-[#37352f]">
                        Chuông Báo & Màn Hình Khóa Điện Thoại (ntfy.sh)
                      </h5>
                      <span className="text-[11px] text-[#787774] font-medium">
                        Không cần tài khoản hay mật khẩu • Reo chuông màn hình khóa tức thì khi có khách Nạp / Rút
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      disabled={isSendingNtfyTest}
                      onClick={handleSendTestNtfy}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all disabled:opacity-50"
                    >
                      <BellRing className={`w-3.5 h-3.5 ${isSendingNtfyTest ? 'animate-bounce' : ''}`} />
                      <span>{isSendingNtfyTest ? 'Đang Bắn Chuông...' : '🔔 Bấm Thử Rung Chuông Điện Thoại'}</span>
                    </button>
                    <a
                      href={ADMIN_NTFY_TOPIC}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 font-black text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mở Trang ntfy.sh</span>
                    </a>
                  </div>
                </div>

                {ntfyTestMsg && (
                  <div className="p-3.5 bg-purple-50 border border-purple-200 text-purple-950 font-bold rounded-xl text-xs animate-fade-in flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>{ntfyTestMsg}</span>
                  </div>
                )}

                {/* Giới thiệu cơ chế không cần đăng nhập */}
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="text-purple-950 font-black text-xs block">
                        ❓ Vì sao trên ứng dụng ntfy không có chỗ đăng nhập tài khoản?
                      </strong>
                      <p className="text-[11px] text-purple-900/90 leading-relaxed font-medium">
                        <strong>ntfy</strong> được thiết kế theo cơ chế ẩn danh (Zero-login). 
                        Anh không cần tạo tài khoản hay ghi nhớ mật khẩu! Thay vào đó, 
                        chủ đề (Topic) <code className="bg-purple-200/80 text-purple-950 px-1.5 py-0.5 rounded font-mono font-black">Onthihubbbbb</code> chính là kênh thông báo riêng biệt của website ÔnThiHub.
                      </p>
                    </div>
                  </div>

                  {/* 2 Cột: Quét Mã QR & Các Bước Thao Tác */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-purple-200/80 items-center">
                    
                    {/* Cột 1: Mã QR để quét nhanh trên điện thoại */}
                    <div className="p-3 bg-white rounded-xl border border-purple-200 shadow-2xs flex flex-col items-center text-center">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://ntfy.sh/Onthihubbbbb"
                        alt="QR Code ntfy Onthihubbbbb"
                        className="w-32 h-32 rounded-lg border border-purple-100 mb-2"
                      />
                      <span className="text-[10px] text-purple-900 font-black">
                        Quét mã QR bằng Camera điện thoại
                      </span>
                    </div>

                    {/* Cột 2 & 3: Hướng dẫn 2 bước cực dễ */}
                    <div className="md:col-span-2 space-y-2.5 text-[11px] text-purple-950 font-medium">
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">1</span>
                        <div>
                          <strong>Bước 1: Tải ứng dụng ntfy về điện thoại</strong> (tìm từ khóa <code className="font-mono bg-purple-100 px-1 py-0.2 rounded font-bold">ntfy</code> trên App Store hoặc Google Play, tải hoàn toàn miễn phí).
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">2</span>
                        <div>
                          <strong>Bước 2: Đăng ký nhận thông báo</strong>: Mở app ntfy &gt; Bấm dấu cộng (<strong>+</strong>) ở góc màn hình &gt; Nhập đúng tên chủ đề:
                          <div className="mt-1.5 flex items-center space-x-2">
                            <span className="px-2.5 py-1 bg-white border border-purple-300 font-mono font-black text-purple-700 rounded-lg text-xs">
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
                          <span className="block mt-1 text-[10px] text-purple-800">
                            Sau đó bấm <strong>Subscribe</strong> là xong 100%!
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-[10px] font-bold flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Từ giờ, mỗi khi có khách Nạp hoặc Rút tiền, màn hình khóa điện thoại của anh sẽ reo chuông ting ting ngay lập tức.</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* CARD 3: TÙY CHỌN TELEGRAM BOT TỰ ĐỘNG */}
              <form onSubmit={handleSaveTelegram} className="p-5 bg-white rounded-2xl border border-[#e9e9e8] shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-[#e9e9e8] pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4 text-[#0068ff]" />
                    <h5 className="text-xs font-black uppercase text-[#37352f] tracking-wider">
                      Tùy Chọn: Bắn Tin Nhắn Tức Thì Qua Telegram Bot (Tin Nhắn Riêng)
                    </h5>
                  </div>
                  <label className="flex items-center space-x-1.5 cursor-pointer font-bold text-xs text-[#37352f]">
                    <input
                      type="checkbox"
                      checked={telegramConfig.enabled}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="rounded accent-[#2383e2] w-4 h-4"
                    />
                    <span>Bật gửi qua Telegram</span>
                  </label>
                </div>

                {telegramTestMsg && (
                  <div className="p-3 bg-blue-50 border border-blue-200 text-blue-950 font-bold rounded-xl text-xs">
                    {telegramTestMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#787774] block mb-1">Telegram Bot Token (từ @BotFather):</label>
                    <input
                      type="text"
                      placeholder="VD: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                      value={telegramConfig.botToken}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, botToken: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#e9e9e8] rounded-xl font-mono text-xs bg-[#ffffff] text-[#37352f] outline-none focus:border-[#0068ff]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#787774] block mb-1">Telegram Chat ID của anh (từ @userinfobot):</label>
                    <input
                      type="text"
                      placeholder="VD: 987654321"
                      value={telegramConfig.chatId}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, chatId: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#e9e9e8] rounded-xl font-mono text-xs bg-[#ffffff] text-[#37352f] outline-none focus:border-[#0068ff]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    disabled={isSendingTelegramTest || !telegramConfig.botToken || !telegramConfig.chatId}
                    onClick={handleTestTelegram}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#37352f] font-bold text-xs rounded-xl flex items-center space-x-1 disabled:opacity-40 transition-colors"
                  >
                    <span>{isSendingTelegramTest ? 'Đang gửi...' : 'Gửi Thử Telegram'}</span>
                  </button>
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
                <h5 className="text-xs font-black uppercase text-[#37352f] tracking-wider mb-2">
                  Lịch Sử Các Thông Báo Đã Ghi Nhận ({notifications.length})
                </h5>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#e9e9e8]">
                  <BellRing className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-[#787774] font-bold">Chưa có thông báo nạp/rút nào được ghi nhận.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 bg-white rounded-2xl border border-[#e9e9e8] shadow-2xs">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 uppercase border border-purple-200">
                              Mã: {n.code}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-100 text-[#2383e2]">
                              {n.type === 'deposit' ? 'NẠP XU' : 'RÚT TIỀN'}
                            </span>
                          </div>
                          <h5 className="text-xs font-black text-[#37352f] mt-1.5">{n.subject}</h5>
                          <span className="text-[10px] text-[#787774] block mt-0.5 font-medium">{n.timestamp}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <a
                            href={`mailto:${n.targetEmail}?subject=${encodeURIComponent(n.subject)}&body=${encodeURIComponent(n.body)}`}
                            className="px-2.5 py-1 text-[11px] font-bold text-[#787774] bg-white hover:bg-slate-50 rounded-lg flex items-center space-x-1 border border-[#e9e9e8]"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Mail</span>
                          </a>
                        </div>
                      </div>
                      <pre className="mt-3 p-3 bg-[#ffffff] rounded-xl text-[11px] text-[#37352f] font-mono whitespace-pre-wrap border border-[#e9e9e8]">
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
                    <span>{testingConnection ? 'Đang Kiểm Tra...' : 'Kiểm Tra Kết Nối (Ping)'}</span>
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

              {/* Status Message / Test Result Banner */}
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
              <div className="p-5 bg-white rounded-2xl border border-[#e9e9e8] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-[#2383e2]" />
                    <h5 className="text-xs font-black text-[#37352f] uppercase tracking-wider">
                      Dán Nhanh Mã Cấu Hình từ Firebase Console (Auto-Detect Parser)
                    </h5>
                  </div>
                  <span className="text-[10px] font-bold text-[#787774] bg-[#f7f6f5] px-2 py-0.5 rounded-lg">
                    Hỗ trợ cú pháp JS & JSON
                  </span>
                </div>

                <p className="text-[11px] text-[#787774] leading-relaxed">
                  Vào <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-[#2383e2] font-black underline">console.firebase.google.com</a> ➔ Project Settings ➔ Your apps ➔ Chọn Web app ➔ Sao chép đoạn mã <code>const firebaseConfig = &#123; ... &#125;</code> rồi dán vào ô bên dưới:
                </p>

                <textarea
                  rows="4"
                  value={rawSnippet}
                  onChange={(e) => handleParseSnippet(e.target.value)}
                  placeholder={`// Dán đoạn mã này từ Firebase Console vào đây:\nconst firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "my-app.firebaseapp.com",\n  projectId: "my-app",\n  storageBucket: "my-app.appspot.com",\n  messagingSenderId: "123456789",\n  appId: "1:123456789:web:abcdef"\n};`}
                  className="w-full p-3 font-mono text-xs bg-[#ffffff] border border-[#e9e9e8] rounded-xl outline-none focus:border-[#2383e2] focus:ring-2 focus:ring-[#2383e2]/20 text-[#37352f] leading-relaxed"
                />
              </div>

              {/* Individual Form Fields */}
              <form onSubmit={handleSaveFirebaseConfig} className="p-5 bg-white rounded-2xl border border-[#e9e9e8] space-y-4">
                <div className="flex items-center justify-between border-b border-[#e9e9e8] pb-3">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-amber-500" />
                    <h5 className="text-xs font-black text-[#37352f] uppercase tracking-wider">
                      Chi Tiết Khóa API & Thông Số Firebase
                    </h5>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetToDemo}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline"
                  >
                    Đặt lại về Demo mặc định
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-black text-[#37352f] block">
                        API Key (VITE_FIREBASE_API_KEY):
                      </label>
                      {firebaseConfig.apiKey && (
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
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
                        className="w-full pl-3 pr-10 py-2 text-xs font-mono bg-[#ffffff] border border-[#e9e9e8] rounded-xl outline-none focus:border-[#2383e2]"
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
                    <label className="text-xs font-black text-[#37352f] block mb-1">
                      Project ID (VITE_FIREBASE_PROJECT_ID):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.projectId || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })}
                      placeholder="my-project-id"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#ffffff] border border-[#e9e9e8] rounded-xl outline-none focus:border-[#2383e2]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#37352f] block mb-1">
                      Auth Domain (VITE_FIREBASE_AUTH_DOMAIN):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.authDomain || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value })}
                      placeholder="my-project.firebaseapp.com"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#ffffff] border border-[#e9e9e8] rounded-xl outline-none focus:border-[#2383e2]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#37352f] block mb-1">
                      Storage Bucket (VITE_FIREBASE_STORAGE_BUCKET):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.storageBucket || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, storageBucket: e.target.value })}
                      placeholder="my-project.appspot.com"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#ffffff] border border-[#e9e9e8] rounded-xl outline-none focus:border-[#2383e2]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#37352f] block mb-1">
                      Messaging Sender ID (VITE_FIREBASE_MESSAGING_SENDER_ID):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.messagingSenderId || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, messagingSenderId: e.target.value })}
                      placeholder="1234567890"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#ffffff] border border-[#e9e9e8] rounded-xl outline-none focus:border-[#2383e2]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#37352f] block mb-1">
                      App ID (VITE_FIREBASE_APP_ID):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.appId || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, appId: e.target.value })}
                      placeholder="1:1234567890:web:abcdef..."
                      className="w-full px-3 py-2 text-xs font-mono bg-[#ffffff] border border-[#e9e9e8] rounded-xl outline-none focus:border-[#2383e2]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e9e9e8]">
                  <p className="text-[11px] text-[#787774]">
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
                  <div key={box.id} className="p-5 bg-white rounded-2xl border border-[#e9e9e8] shadow-xs space-y-4">
                    
                    {/* Box Title */}
                    <div className="flex items-center justify-between border-b border-[#e9e9e8] pb-3">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-3xl">{box.icon}</span>
                        <div>
                          <h5 className="text-sm font-black text-[#37352f]">{box.name}</h5>
                          <span className="text-[11px] font-bold text-amber-700">{box.subname}</span>
                        </div>
                      </div>
                      <div className="px-2.5 py-1 rounded-xl bg-amber-400 text-[#37352f] font-black text-xs">
                        {box.costXu} Xu
                      </div>
                    </div>

                    {/* Rates Table */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-[#787774] uppercase tracking-wider block">
                        Tỷ Lệ Rơi Thưởng (Tổng 100%):
                      </span>

                      <div className="space-y-1.5">
                        {box.dropRates.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-[#ffffff] border border-[#e9e9e8] flex items-center justify-between text-xs"
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
                              <span className="font-bold text-[#37352f] text-[11px] truncate">
                                {item.name}
                              </span>
                            </div>

                            <span className="font-mono font-black text-amber-700 shrink-0 text-xs">
                              {item.rate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary Tag */}
                    <div className="p-2.5 rounded-xl bg-[#f7f6f5]/60 text-[11px] text-[#787774] font-medium leading-relaxed">
                      💡 {box.description}
                    </div>

                  </div>
                ))}
              </div>

              {/* Economic Balance & Highlights */}
              <div className="p-5 bg-gradient-to-r from-purple-900/10 via-pink-900/10 to-amber-900/10 rounded-2xl border border-purple-200 space-y-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h5 className="text-xs font-black text-[#37352f] uppercase tracking-wider">
                    Các Điểm Sáng Trong Cơ Chế Rơi Thưởng Mới:
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#37352f]">
                  <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                    <strong className="text-emerald-700 font-bold block">1. Chủ Sàn Luôn Thắng (House Edge 80%)</strong>
                    <p className="text-[11px] text-[#787774]">Phần lớn kết quả (90%+) rơi vào voucher hoặc hoàn xu an ủi (ít hơn tiền mở), đảm bảo chủ sàn luôn thu lãi ròng áp đảo.</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                    <strong className="text-amber-700 font-bold block">2. Tỷ Lệ Đồ Xịn Siêu Thấp (1% - 5%)</strong>
                    <p className="text-[11px] text-[#787774]">Jackpot chỉ 1%, PRO/PLUS chỉ 2%, thẻ đắt tiền chỉ 5%. Hàng trăm người mở mới có 1 người trúng để tạo hiệu ứng viral.</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                    <strong className="text-purple-700 font-bold block">3. Ép Khách Nạp Thêm Tiền Thật</strong>
                    <p className="text-[11px] text-[#787774]">Voucher thưởng (10K - 20%) luôn đi kèm điều kiện đơn hàng tối thiểu (89K - 199K), biến người chơi túi mù thành người nạp tiền mua đề.</p>
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
                <div className="p-5 bg-white rounded-2xl border border-[#e9e9e8] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">✨</span>
                      <div>
                        <strong className="text-sm font-black text-[#37352f] block">
                          Khóa Động Cơ AI ÔnThiHub Cloud (Khuyên Dùng - Tốc Độ Cao)
                        </strong>
                        <span className="text-[11px] text-[#787774] font-medium">
                          Mô hình AI Flash siêu tốc: phân tích và trích xuất cấu trúc đề thi, hỗ trợ tiếng Việt cực chuẩn.
                        </span>
                      </div>
                    </div>

                    <a
                      href={API_KEY_LINKS.gemini}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Cổng Đăng Ký Khóa AI</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-[#787774] block">
                        Khóa bí mật AI Engine Key (Bắt đầu bằng <code className="font-mono text-[#2383e2]">AIzaSy...</code>):
                      </label>
                      {geminiApiKey && (
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
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
                        className="w-full pl-4 pr-10 py-2.5 bg-[#ffffff] border border-[#e9e9e8] rounded-xl text-xs font-mono font-bold text-[#37352f] outline-none focus:border-[#2383e2]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                        title={showGeminiKey ? 'Ẩn khóa' : 'Hiện khóa'}
                      >
                        {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* 3 Steps Guide to get free key */}
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1.5">
                    <strong className="font-black block text-blue-950">📋 Hướng dẫn kích hoạt khóa trong 30 giây:</strong>
                    <ol className="list-decimal pl-4 space-y-1 text-[11px] font-medium">
                      <li>Truy cập <a href={API_KEY_LINKS.gemini} target="_blank" rel="noreferrer" className="font-bold underline text-blue-700">Cổng đăng ký khóa AI Cloud</a> và đăng nhập Gmail.</li>
                      <li>Bấm vào nút <strong>"Get API key"</strong> &gt; chọn <strong>"Create API key in new project"</strong>.</li>
                      <li>Copy chuỗi ký tự dạng <code className="font-mono bg-blue-100 px-1 rounded">AIzaSy...</code> và dán vào ô trên rồi bấm <strong>Lưu Cấu Hình</strong>!</li>
                    </ol>
                  </div>
                </div>

                {/* 2. OpenAI Key Card (Optional) */}
                <div className="p-5 bg-white rounded-2xl border border-[#e9e9e8] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">🤖</span>
                      <div>
                        <strong className="text-sm font-black text-[#37352f] block">
                          OpenAI API Key (Tùy Chọn - GPT-4o / GPT-4o-mini)
                        </strong>
                        <span className="text-[11px] text-[#787774] font-medium">
                          Dành cho trường hợp bạn muốn dùng tài khoản OpenAI Platform trả phí.
                        </span>
                      </div>
                    </div>

                    <a
                      href={API_KEY_LINKS.openai}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-emerald-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Lấy OpenAI Key</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-[#787774] block">
                        OpenAI API Key (Bắt đầu bằng <code className="font-mono text-[#2383e2]">sk-...</code>):
                      </label>
                      {openaiApiKey && (
                        <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
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
                        className="w-full pl-4 pr-10 py-2.5 bg-[#ffffff] border border-[#e9e9e8] rounded-xl text-xs font-mono font-bold text-[#37352f] outline-none focus:border-[#2383e2]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
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

    </div>
  );
}
