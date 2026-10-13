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
  MessageCircle,
  Send,
  BellRing,
  Smartphone
} from 'lucide-react';
import { BLIND_BOXES } from '../utils/blindBox';
import {
  getTransactions,
  adminApproveTransaction,
  adminRejectTransaction,
  getAdminNotifications,
  ADMIN_EMAIL,
  ADMIN_PHONE,
  ADMIN_ZALO_LINK,
  ADMIN_NTFY_TOPIC,
  COIN_RATE_VND,
  openAdminZaloChat,
  formatAdminZaloMessage,
  sendRealEmailToAdmin,
  getTelegramConfig,
  saveTelegramConfig,
  sendTelegramNotification
} from '../utils/wallet';
import { getTierLimits, saveTierLimits } from '../utils/userTier';
import { getMarketplaceDecks, adminUpdateMarketplaceDeck } from '../data/marketplaceData';
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
  API_KEY_LINKS
} from '../utils/aiApiKey';

export default function AdminView({ onBackToHome }) {
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

  // AI API Key State
  const [geminiApiKey, setGeminiApiKey] = useState(() => getGeminiApiKey());
  const [openaiApiKey, setOpenaiApiKey] = useState(() => getOpenAIApiKey());
  const [testingAiKey, setTestingAiKey] = useState(false);
  const [aiTestResult, setAiTestResult] = useState(null);
  const [aiSaveMsg, setAiSaveMsg] = useState('');
  const [copiedAiEnv, setCopiedAiEnv] = useState(false);

  // Telegram & Real Email State
  const [telegramConfig, setTelegramConfig] = useState(() => getTelegramConfig());
  const [telegramTestMsg, setTelegramTestMsg] = useState('');
  const [emailTestMsg, setEmailTestMsg] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [isSendingTelegramTest, setIsSendingTelegramTest] = useState(false);

  const reloadData = () => {
    setTransactions(getTransactions());
    setNotifications(getAdminNotifications());
    setTierLimits(getTierLimits());
    setMarketDecks(getMarketplaceDecks());
    setFirebaseConfig(getFirebaseConfig());
    setGeminiApiKey(getGeminiApiKey());
    setOpenaiApiKey(getOpenAIApiKey());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleApprove = (txId) => {
    if (adminApproveTransaction(txId)) {
      playSound('success');
      reloadData();
    }
  };

  const handleReject = (txId) => {
    const reason = prompt('Nhập lý do từ chối giao dịch:', 'Thông tin chuyển khoản không trùng khớp');
    if (reason !== null) {
      if (adminRejectTransaction(txId, reason)) {
        reloadData();
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
      const res = await testGeminiApiKey(geminiApiKey);
      setAiTestResult(res);
      if (res.success) {
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
      <div className="bg-[#260619] border border-[#f02c85]/40 text-white p-6 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#f02c85] flex items-center justify-center font-bold shadow-md shadow-pink-900/40">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                CỬA SỔ QUẢN TRỊ VIÊN (SECRET ADMIN PORTAL)
              </h2>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-[#f02c85]/20 text-[#ff80b5] border border-[#f02c85]/30">
                Duyệt Chay 24/7
              </span>
            </div>
            <p className="text-xs text-rose-200/80 mt-1 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Hotline / Zalo: <a href={ADMIN_ZALO_LINK} target="_blank" rel="noreferrer" className="text-amber-300 font-mono font-black underline hover:text-white">💬 {ADMIN_PHONE}</a></span>
              <span>•</span>
              <span>Email: <strong className="text-amber-300 font-mono">{ADMIN_EMAIL}</strong></span>
              <span>•</span>
              <span>Web Push: <a href={ADMIN_NTFY_TOPIC} target="_blank" rel="noreferrer" className="text-cyan-300 font-mono underline hover:text-white">ntfy.sh Topic</a></span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={ADMIN_ZALO_LINK}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-[#0068ff] hover:bg-[#0052cc] text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-md transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>Mở Zalo ({ADMIN_PHONE})</span>
          </a>
          <button
            onClick={reloadData}
            className="p-2.5 text-rose-200/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onBackToHome}
            className="px-4 py-2 bg-[#360b24] hover:bg-[#4d1033] border border-[#f02c85]/30 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#f02c85]" />
            <span>Quay Lại Trang Chủ</span>
          </button>
        </div>
      </div>

      {/* ADMIN TABS SWITCHER (Wayground Warm Cream Container) */}
      <div className="bg-[#fcf7ec] rounded-3xl border border-[#eadfcb] shadow-xl overflow-hidden text-[#28071a]">
        <div className="flex border-b border-[#eadfcb] bg-[#f5ecd8]/70 text-xs sm:text-sm font-black overflow-x-auto">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'transactions'
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Duyệt Nạp & Rút Tiền</span>
            {transactions.filter(t => t.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#f02c85] text-white rounded-full text-[10px]">
                {transactions.filter(t => t.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tiers')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'tiers'
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#f02c85]" />
            <span>Tùy Chỉnh Giới Hạn Gói (Free/Plus/Pro/Ultra)</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'marketplace'
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Quản Lý Sàn C2C ({marketDecks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'notifications'
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-[#0068ff]" />
            <span>Nhật Ký Zalo & Mail ({notifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase')}
            className={`py-3.5 px-5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'firebase'
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
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
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
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
                ? 'border-[#f02c85] text-[#f02c85] bg-[#fcf7ec] font-black'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-600" />
            <span>Thẻ API Key AI (Gemini / OpenAI)</span>
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
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-[#28071a]">Danh Sách Lệnh Nạp / Rút Chờ Duyệt Chay</h4>
                  <p className="text-xs text-[#7a5a6b] font-medium">
                    Khi khách nạp hoặc rút tiền, thông báo sẽ gửi về Zalo <a href={ADMIN_ZALO_LINK} target="_blank" rel="noreferrer" className="text-[#0068ff] font-mono font-bold hover:underline">{ADMIN_PHONE}</a>, Web Push và <strong className="text-[#f02c85]">{ADMIN_EMAIL}</strong>.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={ADMIN_ZALO_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-[#0068ff] hover:bg-[#0052cc] text-white text-xs font-black rounded-xl shadow-xs flex items-center space-x-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>Chat Zalo Admin ({ADMIN_PHONE})</span>
                  </a>
                  <span className="text-xs font-black px-3 py-1 rounded-xl bg-white text-[#28071a] border border-[#eadfcb]">
                    Tổng {transactions.length} lệnh
                  </span>
                </div>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#eadfcb]">
                  <Coins className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-[#7a5a6b] font-bold">Chưa có giao dịch nạp / rút nào.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#eadfcb] overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f5ecd8] border-b border-[#eadfcb] text-[#28071a] uppercase tracking-wider font-black">
                      <tr>
                        <th className="p-3">Mã GD</th>
                        <th className="p-3">Loại</th>
                        <th className="p-3">Số Lượng</th>
                        <th className="p-3">Khách Hàng / Ngân Hàng</th>
                        <th className="p-3">Trạng Thái</th>
                        <th className="p-3 text-right">Thao Tác Duyệt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eadfcb]/60">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-[#fcf7ec]/60 transition-colors">
                          <td className="p-3 font-mono font-black text-[#28071a]">
                            {tx.id}
                            <span className="block text-[10px] text-[#7a5a6b] font-normal">
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
                            <strong className="text-[#28071a] font-black">{tx.xuAmount} Xu</strong>
                            <span className="block text-[11px] text-[#7a5a6b] font-bold">
                              ~{(tx.amountVnd || tx.xuAmount * COIN_RATE_VND).toLocaleString()}đ
                            </span>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="text-[#28071a] font-black truncate">{tx.userEmail}</div>
                            {tx.type === 'withdraw' && tx.details && (
                              <div className="text-[11px] text-[#4e2f41] bg-[#fcf7ec] p-2 rounded-xl mt-1 border border-[#eadfcb]">
                                <span className="font-black text-[#28071a]">{tx.details.bankName}</span> • STK: <span className="font-mono font-black text-[#f02c85]">{tx.details.accountNo}</span>
                                <div className="text-[#7a5a6b]">Chủ TK: {tx.details.accountName}</div>
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
                                  className="px-2.5 py-1 bg-[#0068ff] hover:bg-[#0052cc] text-white rounded-lg text-[11px] font-black shadow-xs flex items-center space-x-1"
                                  title="Mở Zalo và sao chép nội dung giao dịch"
                                >
                                  <MessageCircle className="w-3 h-3 fill-white" />
                                  <span>Zalo</span>
                                </button>
                                <button
                                  onClick={() => handleApprove(tx.id)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-black shadow-xs flex items-center space-x-1"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Duyệt</span>
                                </button>
                                <button
                                  onClick={() => handleReject(tx.id)}
                                  className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-[11px] font-black border border-rose-300 flex items-center space-x-1"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Từ chối</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-[#7a5a6b] text-[11px] italic font-bold">Hoàn tất</span>
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

          {/* TAB 2: TÙY CHỈNH GIỚI HẠN GÓI */}
          {activeTab === 'tiers' && (
            <form onSubmit={handleSaveTierLimits} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-[#28071a]">
                    Cấu Hình Giới Hạn Từng Gói (Free, Plus, Pro, Ultra)
                  </h4>
                  <p className="text-xs text-[#7a5a6b] font-medium">
                    Chỉnh sửa số lượt tạo thẻ mỗi ngày, lượt thưởng khi điểm danh hàng ngày và phí sàn C2C.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 btn-wayground-sunset text-white text-xs font-black rounded-xl shadow-md flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
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
                    <div key={tierKey} className="p-4 bg-white rounded-2xl border border-[#eadfcb] space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-[#eadfcb] pb-2">
                        <span className="text-xs font-black uppercase text-[#28071a] tracking-wide">
                          {cfg.name}
                        </span>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pink-100 text-[#f02c85] border border-pink-200">
                          {tierKey}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="text-[11px] font-bold text-[#7a5a6b] block mb-1">
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
                            className="w-full px-2.5 py-1.5 border border-[#eadfcb] rounded-lg text-xs font-black bg-[#fcf7ec] text-[#28071a]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#7a5a6b] block mb-1">
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
                            className="w-full px-2.5 py-1.5 border border-[#eadfcb] rounded-lg text-xs font-black bg-[#fcf7ec] text-[#28071a]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#7a5a6b] block mb-1">
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
                            className="w-full px-2.5 py-1.5 border border-[#eadfcb] rounded-lg text-xs font-black bg-[#fcf7ec] text-[#28071a]"
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
                    <h4 className="text-sm font-black text-[#28071a]">
                      Quản Lý & Kiểm Duyệt Trùng Lặp Sàn Flashcard C2C
                    </h4>
                    <p className="text-xs text-[#7a5a6b] font-medium">
                      Hệ thống tự động đối chiếu Jaccard & N-gram để phát hiện đạo văn hoặc sao chép thẻ trái phép.
                    </p>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-black">
                    <button
                      onClick={() => setMarketFilter('all')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        marketFilter === 'all'
                          ? 'bg-[#28071a] text-white shadow-xs'
                          : 'bg-white text-[#28071a] border border-[#eadfcb] hover:bg-[#faebd0]'
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
                  <div className="p-8 text-center bg-white rounded-2xl border border-[#eadfcb] text-xs text-[#7a5a6b]">
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
                            : 'border-[#eadfcb]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#fcf7ec] text-[#28071a] border border-[#eadfcb]">
                              {deck.categoryName || deck.category}
                            </span>
                            <span className="text-xs font-black text-[#f02c85]">
                              {deck.priceXu} Xu (~{(deck.priceXu * 1000).toLocaleString()}đ)
                            </span>
                          </div>

                          <h5 className="text-xs font-black text-[#28071a] line-clamp-1">
                            {deck.title}
                          </h5>
                          <p className="text-[11px] text-[#4e2f41] mt-1 line-clamp-2 font-medium">
                            {deck.description}
                          </p>

                          <div className="mt-2 text-[10px] text-[#7a5a6b] font-bold">
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
                        <div className="mt-3 pt-2.5 border-t border-[#eadfcb] flex items-center justify-between">
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
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 4: HÒM THƯ ZALO & GMAIL ADMIN */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-black text-[#28071a]">
                    Nhật Ký Thông Báo Giao Dịch (Zalo: <a href={ADMIN_ZALO_LINK} target="_blank" rel="noreferrer" className="text-[#0068ff] font-mono font-bold hover:underline">{ADMIN_PHONE}</a> & Gmail)
                  </h4>
                  <p className="text-xs text-[#7a5a6b] font-medium">
                    Mỗi khi có khách nạp/rút tiền, hệ thống tự động đẩy thông báo qua Zalo {ADMIN_PHONE}, Web Push ntfy.sh và lưu lại nhật ký.
                  </p>
                </div>
                <a
                  href={ADMIN_ZALO_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-[#0068ff] hover:bg-[#0052cc] text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Mở Zalo Admin</span>
                </a>
              </div>

              {/* CARD 1: CẤU HÌNH GMAIL GỬI TRỰC TIẾP QUA FORMSUBMIT */}
              <div className="p-5 bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-2xl border-2 border-amber-300 shadow-sm space-y-3.5 text-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-[#28071a]">
                        Gửi Email Tự Động Trực Tiếp Về Gmail: <span className="text-[#f02c85] font-mono">{ADMIN_EMAIL}</span>
                      </h5>
                      <span className="text-[11px] text-[#7a5a6b] font-medium">
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

                <div className="p-3 bg-white/90 rounded-xl border border-amber-200 text-[#4e2f41] space-y-1.5 text-[11px] leading-relaxed">
                  <strong className="text-[#28071a] font-black block">
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
              <div className="p-5 bg-white rounded-2xl border border-[#eadfcb] shadow-xs space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <BellRing className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-[#28071a]">
                        Rung Chuông & Báo Màn Hình Khóa Điện Thoại (Miễn phí 100% qua ntfy.sh)
                      </h5>
                      <span className="text-[11px] text-[#7a5a6b] font-medium">
                        Không cần đăng ký tài khoản • Rung chuông điện thoại ngay tức thì khi có khách đặt lệnh
                      </span>
                    </div>
                  </div>

                  <a
                    href={ADMIN_NTFY_TOPIC}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mở Kênh Nhận Chuông Báo</span>
                  </a>
                </div>

                <p className="text-[11px] text-[#7a5a6b] leading-relaxed">
                  💡 Anh có thể cài ứng dụng <strong>ntfy</strong> (trên App Store hoặc Google Play), sau đó bấm dấu cộng (+) và nhập chủ đề: <code className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-mono font-bold">onthihub_admin_0986019623</code>. Điện thoại của anh sẽ reo chuông báo mỗi khi có đơn nạp/rút!
                </p>
              </div>

              {/* CARD 3: TÙY CHỌN TELEGRAM BOT TỰ ĐỘNG */}
              <form onSubmit={handleSaveTelegram} className="p-5 bg-white rounded-2xl border border-[#eadfcb] shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-[#eadfcb] pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4 text-[#0068ff]" />
                    <h5 className="text-xs font-black uppercase text-[#28071a] tracking-wider">
                      Tùy Chọn: Bắn Tin Nhắn Tức Thì Qua Telegram Bot (Tin Nhắn Riêng)
                    </h5>
                  </div>
                  <label className="flex items-center space-x-1.5 cursor-pointer font-bold text-xs text-[#28071a]">
                    <input
                      type="checkbox"
                      checked={telegramConfig.enabled}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="rounded accent-[#f02c85] w-4 h-4"
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
                    <label className="font-bold text-[#7a5a6b] block mb-1">Telegram Bot Token (từ @BotFather):</label>
                    <input
                      type="text"
                      placeholder="VD: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                      value={telegramConfig.botToken}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, botToken: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#eadfcb] rounded-xl font-mono text-xs bg-[#fcf7ec] text-[#28071a] outline-none focus:border-[#0068ff]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#7a5a6b] block mb-1">Telegram Chat ID của anh (từ @userinfobot):</label>
                    <input
                      type="text"
                      placeholder="VD: 987654321"
                      value={telegramConfig.chatId}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, chatId: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#eadfcb] rounded-xl font-mono text-xs bg-[#fcf7ec] text-[#28071a] outline-none focus:border-[#0068ff]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    disabled={isSendingTelegramTest || !telegramConfig.botToken || !telegramConfig.chatId}
                    onClick={handleTestTelegram}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#28071a] font-bold text-xs rounded-xl flex items-center space-x-1 disabled:opacity-40 transition-colors"
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
                <h5 className="text-xs font-black uppercase text-[#28071a] tracking-wider mb-2">
                  Lịch Sử Các Thông Báo Đã Ghi Nhận ({notifications.length})
                </h5>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#eadfcb]">
                  <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-[#7a5a6b] font-bold">Chưa có thông báo nạp/rút nào được ghi nhận.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 bg-white rounded-2xl border border-[#eadfcb] shadow-2xs">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#0068ff]/10 text-[#0068ff] uppercase border border-[#0068ff]/20">
                              Zalo: {n.targetPhone || ADMIN_PHONE}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-100 text-[#f02c85]">
                              {n.type === 'deposit' ? 'NẠP XU' : 'RÚT TIỀN'} ({n.code})
                            </span>
                          </div>
                          <h5 className="text-xs font-black text-[#28071a] mt-1.5">{n.subject}</h5>
                          <span className="text-[10px] text-[#7a5a6b] block mt-0.5 font-medium">{n.timestamp}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => openAdminZaloChat(n.zaloMessage || n.body)}
                            className="px-2.5 py-1 text-[11px] font-black text-white bg-[#0068ff] hover:bg-[#0052cc] rounded-lg flex items-center space-x-1 shadow-xs"
                          >
                            <MessageCircle className="w-3 h-3 fill-white" />
                            <span>Mở Zalo</span>
                          </button>
                          <a
                            href={`mailto:${n.targetEmail}?subject=${encodeURIComponent(n.subject)}&body=${encodeURIComponent(n.body)}`}
                            className="px-2.5 py-1 text-[11px] font-bold text-[#7a5a6b] bg-white hover:bg-slate-50 rounded-lg flex items-center space-x-1 border border-[#eadfcb]"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Mail</span>
                          </a>
                        </div>
                      </div>
                      <pre className="mt-3 p-3 bg-[#fcf7ec] rounded-xl text-[11px] text-[#28071a] font-mono whitespace-pre-wrap border border-[#eadfcb]">
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-[#eadfcb]">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-amber-500" />
                    <h4 className="text-base font-black text-[#28071a]">
                      Quản Lý & Tích Hợp Firebase Cloud (Google Services)
                    </h4>
                  </div>
                  <p className="text-xs text-[#7a5a6b] font-medium leading-relaxed max-w-2xl">
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
                    className="px-4 py-2 bg-[#28071a] hover:bg-[#3d0b28] text-white text-xs font-black rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
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
              <div className="p-5 bg-white rounded-2xl border border-[#eadfcb] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-[#f02c85]" />
                    <h5 className="text-xs font-black text-[#28071a] uppercase tracking-wider">
                      Dán Nhanh Mã Cấu Hình từ Firebase Console (Auto-Detect Parser)
                    </h5>
                  </div>
                  <span className="text-[10px] font-bold text-[#7a5a6b] bg-[#f5ecd8] px-2 py-0.5 rounded-lg">
                    Hỗ trợ cú pháp JS & JSON
                  </span>
                </div>

                <p className="text-[11px] text-[#7a5a6b] leading-relaxed">
                  Vào <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-[#f02c85] font-black underline">console.firebase.google.com</a> ➔ Project Settings ➔ Your apps ➔ Chọn Web app ➔ Sao chép đoạn mã <code>const firebaseConfig = &#123; ... &#125;</code> rồi dán vào ô bên dưới:
                </p>

                <textarea
                  rows="4"
                  value={rawSnippet}
                  onChange={(e) => handleParseSnippet(e.target.value)}
                  placeholder={`// Dán đoạn mã này từ Firebase Console vào đây:\nconst firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "my-app.firebaseapp.com",\n  projectId: "my-app",\n  storageBucket: "my-app.appspot.com",\n  messagingSenderId: "123456789",\n  appId: "1:123456789:web:abcdef"\n};`}
                  className="w-full p-3 font-mono text-xs bg-[#fcf7ec] border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] focus:ring-2 focus:ring-[#f02c85]/20 text-[#28071a] leading-relaxed"
                />
              </div>

              {/* Individual Form Fields */}
              <form onSubmit={handleSaveFirebaseConfig} className="p-5 bg-white rounded-2xl border border-[#eadfcb] space-y-4">
                <div className="flex items-center justify-between border-b border-[#eadfcb] pb-3">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-amber-500" />
                    <h5 className="text-xs font-black text-[#28071a] uppercase tracking-wider">
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
                    <label className="text-xs font-black text-[#28071a] block mb-1">
                      API Key (VITE_FIREBASE_API_KEY):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.apiKey || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value })}
                      placeholder="AIzaSy..."
                      className="w-full px-3 py-2 text-xs font-mono bg-[#fcf7ec] border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#28071a] block mb-1">
                      Project ID (VITE_FIREBASE_PROJECT_ID):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.projectId || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })}
                      placeholder="my-project-id"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#fcf7ec] border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#28071a] block mb-1">
                      Auth Domain (VITE_FIREBASE_AUTH_DOMAIN):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.authDomain || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value })}
                      placeholder="my-project.firebaseapp.com"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#fcf7ec] border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#28071a] block mb-1">
                      Storage Bucket (VITE_FIREBASE_STORAGE_BUCKET):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.storageBucket || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, storageBucket: e.target.value })}
                      placeholder="my-project.appspot.com"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#fcf7ec] border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#28071a] block mb-1">
                      Messaging Sender ID (VITE_FIREBASE_MESSAGING_SENDER_ID):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.messagingSenderId || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, messagingSenderId: e.target.value })}
                      placeholder="1234567890"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#fcf7ec] border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#28071a] block mb-1">
                      App ID (VITE_FIREBASE_APP_ID):
                    </label>
                    <input
                      type="text"
                      value={firebaseConfig.appId || ''}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, appId: e.target.value })}
                      placeholder="1:1234567890:web:abcdef..."
                      className="w-full px-3 py-2 text-xs font-mono bg-[#fcf7ec] border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#eadfcb]">
                  <p className="text-[11px] text-[#7a5a6b]">
                    Khóa lưu trên máy của bạn sẽ ghi đè cấu hình thử nghiệm và kích hoạt Cloud thật ngay lập tức.
                  </p>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#f02c85] to-[#c71767] hover:from-[#e02078] hover:to-[#b3105a] text-white text-xs font-black rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Cấu Hình Firebase</span>
                  </button>
                </div>
              </form>

              {/* 3-Step Firebase Setup Guide */}
              <div className="p-5 bg-[#f5ecd8]/70 rounded-2xl border border-[#eadfcb] space-y-3">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-[#f02c85]" />
                  <h5 className="text-xs font-black text-[#28071a] uppercase tracking-wider">
                    Hướng Dẫn 3 Bước Tạo Firebase Cho Dự Án:
                  </h5>
                </div>

                <ol className="list-decimal list-inside space-y-2 text-xs text-[#28071a] font-medium leading-relaxed">
                  <li>
                    <strong>Tạo Project:</strong> Truy cập <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-[#f02c85] underline font-bold">console.firebase.google.com</a>, bấm <em>Add project</em> đặt tên là <code>onthihub</code>.
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-[#eadfcb]">
                <div>
                  <div className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-purple-600" />
                    <h4 className="text-base font-black text-[#28071a]">
                      Quản Lý & Kiểm Soát Tỷ Lệ Rơi Thưởng Túi Mù (Gacha System)
                    </h4>
                  </div>
                  <p className="text-xs text-[#7a5a6b] font-medium mt-1 max-w-2xl">
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
                  <div key={box.id} className="p-5 bg-white rounded-2xl border border-[#eadfcb] shadow-xs space-y-4">
                    
                    {/* Box Title */}
                    <div className="flex items-center justify-between border-b border-[#eadfcb] pb-3">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-3xl">{box.icon}</span>
                        <div>
                          <h5 className="text-sm font-black text-[#28071a]">{box.name}</h5>
                          <span className="text-[11px] font-bold text-amber-700">{box.subname}</span>
                        </div>
                      </div>
                      <div className="px-2.5 py-1 rounded-xl bg-amber-400 text-[#28071a] font-black text-xs">
                        {box.costXu} Xu
                      </div>
                    </div>

                    {/* Rates Table */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-[#7a5a6b] uppercase tracking-wider block">
                        Tỷ Lệ Rơi Thưởng (Tổng 100%):
                      </span>

                      <div className="space-y-1.5">
                        {box.dropRates.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-[#fcf7ec] border border-[#eadfcb] flex items-center justify-between text-xs"
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
                              <span className="font-bold text-[#28071a] text-[11px] truncate">
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
                    <div className="p-2.5 rounded-xl bg-[#f5ecd8]/60 text-[11px] text-[#7a5a6b] font-medium leading-relaxed">
                      💡 {box.description}
                    </div>

                  </div>
                ))}
              </div>

              {/* Economic Balance & Highlights */}
              <div className="p-5 bg-gradient-to-r from-purple-900/10 via-pink-900/10 to-amber-900/10 rounded-2xl border border-purple-200 space-y-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h5 className="text-xs font-black text-[#28071a] uppercase tracking-wider">
                    Các Điểm Sáng Trong Cơ Chế Rơi Thưởng Mới:
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#28071a]">
                  <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                    <strong className="text-emerald-700 font-bold block">1. Chủ Sàn Luôn Thắng (House Edge 80%)</strong>
                    <p className="text-[11px] text-[#7a5a6b]">Phần lớn kết quả (90%+) rơi vào voucher hoặc hoàn xu an ủi (ít hơn tiền mở), đảm bảo chủ sàn luôn thu lãi ròng áp đảo.</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                    <strong className="text-amber-700 font-bold block">2. Tỷ Lệ Đồ Xịn Siêu Thấp (1% - 5%)</strong>
                    <p className="text-[11px] text-[#7a5a6b]">Jackpot chỉ 1%, PRO/PLUS chỉ 2%, thẻ đắt tiền chỉ 5%. Hàng trăm người mở mới có 1 người trúng để tạo hiệu ứng viral.</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                    <strong className="text-purple-700 font-bold block">3. Ép Khách Nạp Thêm Tiền Thật</strong>
                    <p className="text-[11px] text-[#7a5a6b]">Voucher thưởng (10K - 20%) luôn đi kèm điều kiện đơn hàng tối thiểu (89K - 199K), biến người chơi túi mù thành người nạp tiền mua đề.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: THẺ CẤU HÌNH API KEY AI (Google Gemini & OpenAI) */}
          {activeTab === 'ai_api' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-black text-[#28071a] flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-cyan-600" />
                    <span>Cấu Hình Thẻ API Key AI (Google Gemini & OpenAI)</span>
                  </h4>
                  <p className="text-xs text-[#7a5a6b] font-medium mt-0.5">
                    Tích hợp trí tuệ nhân tạo để tự động trích xuất tài liệu, sách giáo trình thành bộ thẻ Anki thật 100%.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={API_KEY_LINKS.gemini}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-black flex items-center space-x-1.5 shadow-md hover:brightness-110"
                  >
                    <span>Lấy Key Google Miễn Phí</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  
                  <button
                    onClick={handleCopyAiEnv}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#eadfcb] text-[#28071a] hover:bg-[#faebd0] text-xs font-black flex items-center space-x-1.5"
                  >
                    {copiedAiEnv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#f02c85]" />}
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
                      {hasValidAiKey() ? '🟢 Đã Kích Hoạt AI Trực Tiếp' : '🟡 Đang Dùng Bộ Sinh Thẻ Ngoại Tuyến (Offline)'}
                    </h5>
                    <p className="text-[11px] opacity-80 font-medium">
                      {hasValidAiKey()
                        ? 'Hệ thống đã nhận diện API Key hợp lệ. Học viên khi bấm "Tạo thẻ AI" sẽ nhận kết quả phân tích trực tiếp từ mô hình ngôn ngữ lớn.'
                        : 'Chưa có API Key. Hệ thống hiện chạy thuật toán mô phỏng thông minh. Hãy nhập Gemini API Key dưới đây để kích hoạt AI thật.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleTestAiKey}
                  disabled={testingAiKey || !geminiApiKey}
                  className="px-4 py-2 rounded-xl bg-white border border-current text-xs font-black hover:bg-black/5 disabled:opacity-50 shrink-0"
                >
                  {testingAiKey ? 'Đang Test...' : '⚡ Kiểm Tra Kết Nối'}
                </button>
              </div>

              {/* Test Result Message */}
              {aiTestResult && (
                <div className={`p-3.5 rounded-2xl border text-xs font-bold ${
                  aiTestResult.success
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                    : 'bg-rose-100 border-rose-300 text-rose-800'
                }`}>
                  {aiTestResult.message}
                </div>
              )}

              {/* API Key Form */}
              <form onSubmit={handleSaveAiKey} className="space-y-4">
                
                {/* 1. Google Gemini Key Card */}
                <div className="p-5 bg-white rounded-2xl border border-[#eadfcb] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">✨</span>
                      <div>
                        <strong className="text-sm font-black text-[#28071a] block">
                          Google Gemini API Key (Khuyên Dùng - Miễn Phí 100%)
                        </strong>
                        <span className="text-[11px] text-[#7a5a6b] font-medium">
                          Mô hình Gemini 1.5 Flash: siêu tốc, miễn phí 15 requests/phút, hỗ trợ tiếng Việt cực chuẩn.
                        </span>
                      </div>
                    </div>

                    <a
                      href={API_KEY_LINKS.gemini}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Lấy Key (Google AI Studio)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#7a5a6b] block mb-1">
                      Khóa bí mật Gemini API Key (Bắt đầu bằng <code className="font-mono text-[#f02c85]">AIzaSy...</code>):
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="AIzaSy..."
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#fcf7ec] border border-[#eadfcb] rounded-xl text-xs font-mono font-bold text-[#28071a] outline-none focus:border-[#f02c85]"
                      />
                    </div>
                  </div>

                  {/* 3 Steps Guide to get free key */}
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1.5">
                    <strong className="font-black block text-blue-950">📋 Hướng dẫn lấy key miễn phí trong 30 giây:</strong>
                    <ol className="list-decimal pl-4 space-y-1 text-[11px] font-medium">
                      <li>Truy cập <a href={API_KEY_LINKS.gemini} target="_blank" rel="noreferrer" className="font-bold underline text-blue-700">Google AI Studio (aistudio.google.com)</a> và đăng nhập Gmail.</li>
                      <li>Bấm vào nút <strong>"Get API key"</strong> &gt; chọn <strong>"Create API key in new project"</strong>.</li>
                      <li>Copy chuỗi ký tự dạng <code className="font-mono bg-blue-100 px-1 rounded">AIzaSy...</code> và dán vào ô trên rồi bấm <strong>Lưu Cấu Hình</strong>!</li>
                    </ol>
                  </div>
                </div>

                {/* 2. OpenAI Key Card (Optional) */}
                <div className="p-5 bg-white rounded-2xl border border-[#eadfcb] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">🤖</span>
                      <div>
                        <strong className="text-sm font-black text-[#28071a] block">
                          OpenAI API Key (Tùy Chọn - GPT-4o / GPT-4o-mini)
                        </strong>
                        <span className="text-[11px] text-[#7a5a6b] font-medium">
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
                    <label className="text-[11px] font-bold text-[#7a5a6b] block mb-1">
                      OpenAI API Key (Bắt đầu bằng <code className="font-mono text-[#f02c85]">sk-...</code>):
                    </label>
                    <input
                      type="password"
                      placeholder="sk-..."
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#fcf7ec] border border-[#eadfcb] rounded-xl text-xs font-mono font-bold text-[#28071a] outline-none focus:border-[#f02c85]"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 btn-wayground-sunset text-white text-xs font-black rounded-xl shadow-lg flex items-center space-x-2 transition-transform transform hover:scale-105 active:scale-95"
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
