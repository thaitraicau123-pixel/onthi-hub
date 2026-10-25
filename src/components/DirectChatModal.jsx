import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Send,
  MessageCircle,
  Search,
  Layers,
  BookOpen,
  Share2,
  Check,
  Users,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  UserCheck,
  UserPlus,
  UserX,
  Clock,
  Heart,
  MessageSquarePlus,
  HelpCircle,
  Bell,
  CheckCheck,
  Crown,
  Swords,
  Coins,
  Flame,
  Trophy,
  Zap
} from 'lucide-react';
import { useModalDismiss } from '../hooks/useModalDismiss';
import { getDuoStreak, markDuoNudged } from '../utils/duoStreak';
import PvpBattleModal from './PvpBattleModal';
import { acceptPvpChallenge, declinePvpChallenge } from '../utils/pvpBattle';
import {
  getCurrentUserParticipant,
  getUserConversations,
  getConversationMessages,
  sendDirectMessage,
  markConversationAsRead,
  subscribeToDirectMessages,
  syncDirectMessagesFromCloud,
  getConversationId,
  getStudentDirectory,
  ADMIN_PARTICIPANT,
  isSameUser,
  matchesUserIdentifier
} from '../utils/directMessaging';
import {
  getFriendshipStatus,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  getFriendsList,
  getIncomingFriendRequests,
  getIncomingRequestsCount,
  getSuggestedFriends,
  subscribeToFriendEvents,
  syncFriendDataFromCloud
} from '../utils/friendSystem';
import { formatHanoiRelativeTime, formatHanoiDateTime } from '../utils/hanoiTime';
import { copyFlashcardShareLink } from '../utils/shareLink';
import { playSound } from '../utils/storage';
import confetti from 'canvas-confetti';

const STUDENT_PROMPTS = [
  '👋 Chào bạn!',
  '📚 Bạn đang ôn kỳ thi nào thế?',
  '💡 Cùng kết bạn trao đổi đề thi nhé!',
  '📇 Bạn có bộ thẻ Flashcard này không?',
  '🔥 Chúc bạn ôn thi đạt điểm cao!'
];

const ADMIN_PROMPTS = [
  '👋 Chào Ban Quản Trị!',
  '💳 Nhờ Admin kiểm tra lệnh nạp/rút Xu',
  '❓ Em cần hỗ trợ về tài liệu & đề thi',
  '🌟 Em có góp ý cải tiến tính năng ứng dụng'
];

export default function DirectChatModal({
  isOpen,
  onClose,
  currentUser,
  targetPartner = null,
  initialAttachedDeck = null,
  initialAttachedAchievement = null,
  allCourses = [],
  onOpenFlashcards,
  onOpenShareAchievement,
  onShowToast
}) {
  const { handleBackdropClick } = useModalDismiss(onClose, isOpen);
  const currentParticipant = useMemo(() => getCurrentUserParticipant(currentUser), [currentUser]);
  const isAdmin = currentParticipant.role === 'admin' || currentParticipant.id === 'admin_onthi';

  // Tabs: 'conversations' (Hội thoại) | 'friends' (Bạn bè) | 'requests' (Kết bạn & Lời mời)
  const [sidebarTab, setSidebarTab] = useState('conversations');
  const [conversations, setConversations] = useState(() => getUserConversations(currentUser));
  const [directory, setDirectory] = useState(() => getStudentDirectory(currentParticipant.id));
  
  // Bạn bè & Lời mời
  const [friends, setFriends] = useState(() => getFriendsList(currentParticipant.id, directory));
  const [incomingRequests, setIncomingRequests] = useState(() => getIncomingFriendRequests(currentParticipant.id));
  const [suggestedFriends, setSuggestedFriends] = useState(() => getSuggestedFriends(currentParticipant.id, directory));

  const [activePartner, setActivePartner] = useState(() => {
    if (targetPartner) return targetPartner;
    const list = getUserConversations(currentUser);
    if (list.length > 0 && list[0]?.partner) {
      return list[0].partner;
    }
    return isAdmin ? (getStudentDirectory('admin_onthi')[0] || ADMIN_PARTICIPANT) : ADMIN_PARTICIPANT;
  });

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedDeck, setAttachedDeck] = useState(initialAttachedDeck);
  const [attachedAchievement, setAttachedAchievement] = useState(initialAttachedAchievement);
  const [showDeckPicker, setShowDeckPicker] = useState(false);
  const [copiedLinkDeckId, setCopiedLinkDeckId] = useState(null);
  const [mobileShowChat, setMobileShowChat] = useState(Boolean(targetPartner || initialAttachedAchievement));
  
  // Thêm bạn bè trực tiếp qua Email hoặc tên
  const [addFriendInput, setAddFriendInput] = useState('');
  const [addFriendNote, setAddFriendNote] = useState('');

  // 1v1 PvP Battle Arena State
  const [isPvpModalOpen, setIsPvpModalOpen] = useState(false);
  const [activeBattleForModal, setActiveBattleForModal] = useState(null);

  // Chuỗi ngọn lửa đôi bạn cùng tiến (Duo Streak)
  const partnerDuoStreak = useMemo(() => {
    if (!activePartner || activePartner.role === 'admin' || activePartner.id === 'admin_onthi') {
      return { streak: 0, flameLevel: { icon: '💤', label: 'Chưa Thắp Lửa' } };
    }
    return getDuoStreak(currentParticipant.id, activePartner.id);
  }, [currentParticipant, activePartner, messages]);

  const handleDuoNudge = async () => {
    if (!activePartner) return;
    playSound('click');
    markDuoNudged(currentParticipant.id, activePartner.id);
    await sendDirectMessage(
      currentParticipant,
      activePartner,
      `🔔 [HỐI BẠN HỌC]: Bạn ơi vào web học tập hoặc thách đấu 1v1 một chút hôm nay để giữ chuỗi Ngọn Lửa Đôi Bạn Cùng Tiến ${partnerDuoStreak.flameLevel.icon} nhé! 🔥✨`
    );
    onShowToast?.(`Đã gửi lời nhắc bạn cùng học đến ${activePartner.name}! 🔥`);
  };

  const handleOpenPvpChallenge = (partner, existingBattle = null) => {
    playSound('click');
    setActivePartner(partner);
    setActiveBattleForModal(existingBattle);
    setIsPvpModalOpen(true);
  };

  const [suggestionFilter, setSuggestionFilter] = useState('ALL');

  const handleAcceptAndPlayPvp = async (pvpChallenge) => {
    try {
      playSound('click');
      const updated = await acceptPvpChallenge(pvpChallenge.id, currentUser);
      handleOpenPvpChallenge(activePartner, updated);
      playSound('success');
    } catch (err) {
      alert(err.message || 'Không thể chấp nhận thách đấu!');
    }
  };

  const handleQuickAddAllFriends = () => {
    playSound('success');
    let addedCount = 0;
    filteredSuggestions.forEach((s) => {
      const status = getFriendshipStatus(currentParticipant.id, s.id);
      if (status === 'none') {
        sendFriendRequest({
          sender: currentParticipant,
          receiver: s,
          message: 'Chào bạn, cùng kết bạn ôn thi nhé!'
        });
        addedCount++;
      }
    });
    refreshAllData();
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.4 } });
    } catch (e) {}
    onShowToast?.(`🎉 Đã gửi lời mời kết bạn nhanh đến ${addedCount} bạn học!`);
  };

  const messagesEndRef = useRef(null);

  // Quan hệ bạn bè giữa người dùng hiện tại và activePartner
  const friendshipStatus = useMemo(() => {
    if (!activePartner) return 'none';
    return getFriendshipStatus(currentParticipant, activePartner);
  }, [currentParticipant, activePartner, friends, incomingRequests]);

  // Cập nhật khi targetPartner hoặc initialAttachedDeck / initialAttachedAchievement từ ngoài truyền vào
  useEffect(() => {
    if (targetPartner) {
      setActivePartner(targetPartner);
      setMobileShowChat(true);
      setSidebarTab('conversations');
    }
  }, [targetPartner]);

  useEffect(() => {
    if (initialAttachedDeck) {
      setAttachedDeck(initialAttachedDeck);
    }
  }, [initialAttachedDeck]);

  useEffect(() => {
    if (initialAttachedAchievement) {
      setAttachedAchievement(initialAttachedAchievement);
      setInputText((prev) => prev || `🏆 Mình vừa đạt chứng nhận kỷ lục hoàng gia: ${initialAttachedAchievement.title}! Khoe với bạn nè! ✨`);
      setMobileShowChat(true);
      setSidebarTab('conversations');
    }
  }, [initialAttachedAchievement]);

  // Làm mới tất cả dữ liệu hội thoại, bạn bè và lời mời
  const refreshAllData = () => {
    const convs = getUserConversations(currentUser);
    const dir = getStudentDirectory(currentParticipant.id);
    setConversations(convs);
    setDirectory(dir);
    setFriends(getFriendsList(currentParticipant, dir));
    setIncomingRequests(getIncomingFriendRequests(currentParticipant));
    setSuggestedFriends(getSuggestedFriends(currentParticipant, dir));
  };

  // Tải tin nhắn của cuộc hội thoại đang chọn
  useEffect(() => {
    if (!isOpen || !activePartner) return;
    const convId = getConversationId(currentParticipant.id, activePartner.id);
    const msgs = getConversationMessages(convId, currentParticipant, activePartner);
    setMessages(msgs);
    markConversationAsRead(convId, currentParticipant, activePartner);
    refreshAllData();
  }, [isOpen, activePartner, currentParticipant]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Lắng nghe sự kiện tin nhắn & bạn bè thời gian thực
  useEffect(() => {
    if (!isOpen) return;

    // Tự động đồng bộ tin nhắn & lời mời kết bạn từ Cloud Relay ngay khi mở modal
    syncDirectMessagesFromCloud(currentParticipant);
    syncFriendDataFromCloud(currentParticipant);

    const unsubMessages = subscribeToDirectMessages(currentParticipant, (newMsg) => {
      refreshAllData();
      if (activePartner && newMsg) {
        const curConvId = getConversationId(currentParticipant.id, activePartner.id);
        const isCurrentChatMsg =
          newMsg.conversationId === curConvId ||
          (isSameUser(newMsg.sender, activePartner) && isSameUser(newMsg.receiver, currentParticipant)) ||
          (isSameUser(newMsg.sender, currentParticipant) && isSameUser(newMsg.receiver, activePartner));

        if (isCurrentChatMsg) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          markConversationAsRead(curConvId, currentParticipant, activePartner);
          if (!isSameUser(newMsg.sender, currentParticipant)) {
            playSound('bell');
          }
        }
      } else if (activePartner && !newMsg) {
        // Cập nhật trạng thái 'Đã xem' hoặc đồng bộ nền
        const curConvId = getConversationId(currentParticipant.id, activePartner.id);
        const msgs = getConversationMessages(curConvId, currentParticipant, activePartner);
        setMessages(msgs);
      }
    });

    const unsubFriends = subscribeToFriendEvents(currentParticipant, () => {
      refreshAllData();
    });

    return () => {
      if (typeof unsubMessages === 'function') unsubMessages();
      if (typeof unsubFriends === 'function') unsubFriends();
    };
  }, [isOpen, activePartner, currentParticipant]);

  // Gửi tin nhắn
  const handleSendMessage = (e) => {
    e?.preventDefault?.();
    const textToSend = inputText.trim();
    if (!textToSend && !attachedDeck && !attachedAchievement) return;

    // Tự động phân giải đối tác nếu activePartner bị khuyết
    let partner = activePartner;
    if (!partner) {
      partner = isAdmin ? (directory[0] || ADMIN_PARTICIPANT) : ADMIN_PARTICIPANT;
      setActivePartner(partner);
    }
    if (!partner) return;

    // Tránh gửi tin nhắn cho chính mình nếu đang là Admin
    if (isSameUser(currentParticipant, partner)) {
      if (directory.length > 0) {
        partner = directory[0];
        setActivePartner(partner);
      } else {
        onShowToast?.('⚠️ Hãy chọn một bạn học viên trong danh bạ để gửi tin nhắn nhé!');
        return;
      }
    }

    playSound('click');

    // Lưu tạm các đính kèm để dọn dẹp form ngay lập tức
    const deckAttachment = attachedDeck;
    const achAttachment = attachedAchievement;
    setInputText('');
    setAttachedDeck(null);
    setAttachedAchievement(null);

    // Nếu chưa kết bạn và không phải Admin, gửi kèm lời mời kết bạn tự động để kết nối MXH mượt mà
    if (friendshipStatus === 'none' && !isSameUser(partner, ADMIN_PARTICIPANT)) {
      sendFriendRequest({
        sender: currentParticipant,
        receiver: partner,
        message: textToSend || 'Chào bạn, kết bạn cùng ôn thi nhé!'
      });
    }

    const sent = sendDirectMessage({
      sender: currentParticipant,
      receiver: partner,
      text: textToSend,
      sharedDeck: deckAttachment,
      sharedAchievement: achAttachment
    });

    if (sent) {
      setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
      refreshAllData();
    }
  };

  // Chọn đối tác trò chuyện
  const handleSelectPartner = (partner) => {
    setActivePartner(partner);
    setMobileShowChat(true);
    setSidebarTab('conversations');
    playSound('click');
  };

  // Xử lý gửi lời mời kết bạn từ nút bấm
  const handleSendFriendRequest = (targetUser, introMsg = '') => {
    playSound('click');
    const res = sendFriendRequest({
      sender: currentParticipant,
      receiver: targetUser,
      message: introMsg || `Chào ${targetUser.name}! Mình muốn kết bạn cùng ôn thi trên OnThiHub 📚`
    });
    if (res.success) {
      refreshAllData();
      onShowToast?.(`Đã gửi lời mời kết bạn tới ${targetUser.name}!`);
    }
  };

  // Xử lý chấp nhận lời mời kết bạn
  const handleAcceptRequest = (requester) => {
    playSound('success');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const res = acceptFriendRequest(currentParticipant, requester);
    if (res.success) {
      // Gửi một tin nhắn chào mừng bạn mới tự động
      sendDirectMessage({
        sender: currentParticipant,
        receiver: requester,
        text: '🤝 Chúng ta đã trở thành bạn bè trên OnThiHub! Rất vui được cùng bạn ôn tập và chia sẻ tài liệu nhé! 🎉'
      });

      refreshAllData();
      setActivePartner(requester);
      setMobileShowChat(true);
      setSidebarTab('conversations');
      onShowToast?.(`Đã trở thành bạn bè với ${requester.name}! 🎉`);
    }
  };

  // Xử lý gửi lời mời kết bạn trực tiếp qua form nhập Email/Tên
  const handleManualAddFriend = (e) => {
    e?.preventDefault?.();
    const raw = addFriendInput.trim();
    if (!raw) {
      onShowToast?.('Vui lòng nhập địa chỉ Email hoặc tên bạn học!');
      return;
    }

    if (matchesUserIdentifier(currentParticipant, raw)) {
      onShowToast?.('Không thể gửi lời mời kết bạn cho chính mình!');
      return;
    }

    if (raw.toLowerCase() === 'thaitraicau123@gmail.com' || raw === 'admin_onthi') {
      onShowToast?.('Ban Quản Trị luôn sẵn sàng trò chuyện tại tab Hội Thoại mà không cần kết bạn!');
      return;
    }

    const cleanEmail = raw.includes('@') ? raw.toLowerCase().trim() : `${raw.toLowerCase().trim()}@student.onthihub.vn`;
    const found = directory.find((u) => matchesUserIdentifier(u, raw) || matchesUserIdentifier(u, cleanEmail));
    const targetUser = found || {
      id: cleanEmail,
      name: raw.includes('@') ? raw.split('@')[0] : raw,
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
      role: 'student',
      tier: 'free',
      badge: '🎓 Học Viên'
    };

    const status = getFriendshipStatus(currentParticipant, targetUser);
    if (status === 'friends') {
      onShowToast?.(`Bạn và ${targetUser.name} đã là bạn bè chính thức rồi! 🎉`);
      setAddFriendInput('');
      return;
    }
    if (status === 'sent') {
      onShowToast?.(`Bạn đã gửi lời mời kết bạn tới ${targetUser.name} trước đó rồi!`);
      setAddFriendInput('');
      return;
    }
    if (status === 'received') {
      handleAcceptRequest(targetUser);
      setAddFriendInput('');
      return;
    }

    handleSendFriendRequest(targetUser, addFriendNote);
    setAddFriendInput('');
    setAddFriendNote('');
  };

  // Xử lý từ chối lời mời
  const handleDeclineRequest = (requester) => {
    playSound('click');
    declineFriendRequest(currentParticipant.id, requester.id);
    refreshAllData();
    onShowToast?.(`Đã bỏ qua lời mời kết bạn từ ${requester.name}.`);
  };

  // Chọn bộ thẻ đính kèm
  const handleSelectDeckToAttach = (deck) => {
    setAttachedDeck(deck);
    setShowDeckPicker(false);
    playSound('flip');
  };

  // Sao chép link bộ thẻ trong tin nhắn
  const handleCopyDeckLink = async (e, deck) => {
    e.stopPropagation();
    const res = await copyFlashcardShareLink({
      deckId: deck.id,
      deckTitle: deck.title
    });
    if (res.success) {
      playSound('success');
      setCopiedLinkDeckId(deck.id);
      setTimeout(() => setCopiedLinkDeckId(null), 2500);
      onShowToast?.(res.message);
    }
  };

  // Lọc hội thoại
  const filteredConversations = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return conversations;
    return conversations.filter(
      (c) =>
        c.partner?.name?.toLowerCase().includes(term) ||
        c.partner?.email?.toLowerCase().includes(term) ||
        c.lastMessage?.text?.toLowerCase().includes(term)
    );
  }, [conversations, searchQuery]);

  // Lọc bạn bè
  const filteredFriends = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return friends;
    return friends.filter(
      (f) =>
        f.name?.toLowerCase().includes(term) ||
        f.email?.toLowerCase().includes(term) ||
        f.studyGoal?.toLowerCase().includes(term)
    );
  }, [friends, searchQuery]);

  // Lọc gợi ý kết bạn
  const filteredSuggestions = useMemo(() => {
    let list = suggestedFriends;
    if (suggestionFilter !== 'ALL') {
      list = list.filter((s) => s.field === suggestionFilter || (s.studyGoal || '').toLowerCase().includes(suggestionFilter.toLowerCase()));
    }
    const term = searchQuery.toLowerCase().trim();
    if (!term) return list;
    return list.filter(
      (s) =>
        s.name?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.studyGoal?.toLowerCase().includes(term)
    );
  }, [suggestedFriends, suggestionFilter, searchQuery]);

  // Tổng số tin nhắn chưa đọc
  const totalUnread = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  const incomingCount = incomingRequests.length;
  const quickPrompts = activePartner?.role === 'admin' ? ADMIN_PROMPTS : STUDENT_PROMPTS;

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-[92vh] sm:h-[84vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 flex overflow-hidden text-slate-900 dark:text-white"
      >
        {/* =========================================================
            LEFT COLUMN: CONVERSATIONS, FRIENDS & FRIEND REQUESTS
            ========================================================= */}
        <aside
          className={`w-full sm:w-80 border-r border-slate-200 dark:border-white/10 flex flex-col bg-slate-50/90 dark:bg-slate-950/70 shrink-0 ${
            mobileShowChat ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#2383e2]/10 dark:bg-sky-950/80 text-[#2383e2] dark:text-sky-400 flex items-center justify-center border border-[#2383e2]/20 dark:border-sky-500/30">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Tin Nhắn & Bạn Học</span>
                </h2>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[130px] font-medium">{currentParticipant.name}</span>
                  <span className="px-1 py-0.2 rounded text-[9px] font-black bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {isAdmin ? '🛡️ Admin' : '🎓 Học Viên'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="sm:hidden p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switcher: 3 Tabs (Hội Thoại / Bạn Bè / Kết Bạn) */}
          <div className="p-1.5 border-b border-slate-200 dark:border-white/10 grid grid-cols-3 gap-1 bg-slate-100/60 dark:bg-slate-900/60">
            <button
              type="button"
              onClick={() => {
                setSidebarTab('conversations');
                playSound('click');
              }}
              className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                sidebarTab === 'conversations'
                  ? 'bg-white dark:bg-slate-800 text-[#2383e2] dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Hội Thoại</span>
              {totalUnread > 0 && (
                <span className="px-1 py-0.1 rounded-full bg-[#2383e2] text-white text-[9px] font-black shrink-0">
                  {totalUnread}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setSidebarTab('friends');
                playSound('click');
              }}
              className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                sidebarTab === 'friends'
                  ? 'bg-white dark:bg-slate-800 text-[#2383e2] dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Bạn Bè</span>
              <span className="text-[10px] opacity-70">({friends.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSidebarTab('requests');
                playSound('click');
              }}
              className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer relative ${
                sidebarTab === 'requests'
                  ? 'bg-white dark:bg-slate-800 text-[#2383e2] dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 shrink-0" />
              <span>Kết Bạn</span>
              {incomingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black shrink-0 animate-pulse">
                  {incomingCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Box */}
          <div className="p-2 border-b border-slate-200 dark:border-white/10">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  sidebarTab === 'conversations'
                    ? 'Tìm tin nhắn, người gửi...'
                    : sidebarTab === 'friends'
                    ? 'Tìm trong danh sách bạn bè...'
                    : 'Tìm bạn học theo tên, email...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:border-[#2383e2] dark:focus:border-sky-400 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* TAB 1: DANH SÁCH HỘI THOẠI GẦN ĐÂY */}
          {sidebarTab === 'conversations' && (
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <MessageSquarePlus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Chưa có cuộc trò chuyện nào
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Kết bạn cùng các bạn học viên để bắt đầu trao đổi bộ thẻ!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSidebarTab('requests')}
                    className="px-3 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Tìm & Kết Bạn Ngay</span>
                  </button>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = activePartner?.id === conv.partner?.id;
                  const hasUnread = conv.unreadCount > 0;
                  const isPartnerAdmin = conv.partner?.role === 'admin' || conv.partner?.id === 'admin_onthi';
                  const partnerStatus = getFriendshipStatus(currentParticipant.id, conv.partner?.id);

                  return (
                    <button
                      key={conv.conversationId}
                      type="button"
                      onClick={() => handleSelectPartner(conv.partner)}
                      className={`w-full p-3 text-left flex items-start space-x-3 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#2383e2]/10 dark:bg-sky-950/50 border-l-3 border-[#2383e2] dark:border-sky-400'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={conv.partner?.avatar}
                          alt={conv.partner?.name}
                          className="w-10 h-10 rounded-full object-cover bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-white/10"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center space-x-1.5 min-w-0 truncate">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {conv.partner?.name}
                            </span>
                            {isPartnerAdmin ? (
                              <span className="px-1 py-0.2 rounded text-[8px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 shrink-0">
                                ADMIN
                              </span>
                            ) : partnerStatus === 'friends' ? (
                              <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 shrink-0">
                                BẠN BÈ
                              </span>
                            ) : null}
                          </div>
                          {conv.lastMessage?.createdAt && (
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {formatHanoiRelativeTime(conv.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-1 mt-0.5">
                          <p
                            className={`text-[11px] truncate flex items-center gap-1 ${
                              hasUnread
                                ? 'font-bold text-slate-900 dark:text-white'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {conv.lastMessage && isSameUser(conv.lastMessage.sender, currentParticipant) && (
                              <span className="shrink-0 inline-flex items-center">
                                {conv.lastMessage.status === 'seen' || conv.lastMessage.isRead ? (
                                  <CheckCheck className="w-3 h-3 text-sky-400 mr-0.5" title="Đã xem" />
                                ) : conv.lastMessage.status === 'delivered' ? (
                                  <CheckCheck className="w-3 h-3 text-slate-400 mr-0.5" title="Đã nhận" />
                                ) : (
                                  <Check className="w-3 h-3 text-slate-400 mr-0.5" title="Đã gửi" />
                                )}
                              </span>
                            )}
                            {conv.lastMessage?.sharedAchievement ? (
                              <span className="text-amber-600 dark:text-amber-400 font-semibold truncate">
                                👑 Bằng Khen Hoàng Gia 4K
                              </span>
                            ) : conv.lastMessage?.sharedDeck ? (
                              <span className="text-[#2383e2] dark:text-sky-400 font-semibold truncate">
                                📇 Đã chia sẻ bộ thẻ
                              </span>
                            ) : conv.lastMessage?.text ? (
                              <span className="truncate">{conv.lastMessage.text}</span>
                            ) : (
                              <span className="italic text-slate-400">Bắt đầu trò chuyện...</span>
                            )}
                          </p>

                          {hasUnread && (
                            <span className="px-1.5 py-0.2 rounded-full bg-[#2383e2] text-white text-[9px] font-black shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: DANH SÁCH BẠN BÈ ĐÃ KẾT NỐI */}
          {sidebarTab === 'friends' && (
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 p-2 space-y-1.5">
              {/* Kênh hỗ trợ chính thức Ban Quản Trị OnThiHub */}
              {!isAdmin && (
                <div
                  onClick={() => handleSelectPartner(ADMIN_PARTICIPANT)}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/40 dark:to-orange-950/30 border border-rose-200 dark:border-rose-900/60 cursor-pointer hover:shadow-xs transition-all flex items-center justify-between gap-2"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={ADMIN_PARTICIPANT.avatar}
                        alt="Ban Quản Trị"
                        className="w-9 h-9 rounded-full object-cover border-2 border-rose-300 dark:border-rose-700"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-black text-rose-900 dark:text-rose-200 truncate">
                          Ban Quản Trị OnThiHub
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                      </div>
                      <span className="text-[10px] text-rose-700/80 dark:text-rose-300/80 block truncate">
                        Kênh hỗ trợ chính thức 24/7
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-rose-600 text-white shrink-0 shadow-xs">
                    Nhắn tin
                  </span>
                </div>
              )}

              <div className="pt-1">
                <span className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-wider">
                  Bạn Bè Cùng Học ({filteredFriends.length})
                </span>
              </div>

              {filteredFriends.length === 0 ? (
                <div className="p-4 text-center space-y-2">
                  <p className="text-xs text-slate-400">Chưa có bạn bè nào trong danh sách</p>
                  <button
                    type="button"
                    onClick={() => setSidebarTab('requests')}
                    className="text-xs font-bold text-[#2383e2] hover:underline cursor-pointer"
                  >
                    + Khám phá & kết bạn với các bạn học viên khác
                  </button>
                </div>
              ) : (
                filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => handleSelectPartner(friend)}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-all flex items-center justify-between gap-2 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-9 h-9 rounded-full object-cover bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-white/10"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {friend.name}
                          </span>
                          {friend.tier === 'ultra' && (
                            <span className="px-1 py-0.2 rounded text-[8px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              👑 ULTRA
                            </span>
                          )}
                          {friend.tier === 'pro' && (
                            <span className="px-1 py-0.2 rounded text-[8px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                              🚀 PRO
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                          {friend.studyGoal || friend.email}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-50 dark:bg-sky-950/80 text-[#2383e2] dark:text-sky-300 hover:bg-[#2383e2] hover:text-white dark:hover:bg-sky-600 transition-colors shrink-0 cursor-pointer shadow-2xs"
                    >
                      Nhắn tin
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: LỜI MỜI KẾT BẠN & GỢI Ý BẠN HỌC */}
          {sidebarTab === 'requests' && (
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 p-2 space-y-3">
              {/* PHẦN 0: FORM THÊM BẠN TRỰC TIẾP QUA EMAIL HOẶC TÊN */}
              <form
                onSubmit={handleManualAddFriend}
                className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-sky-200 dark:border-sky-500/30 space-y-2 shadow-xs"
              >
                <div className="flex items-center space-x-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-[#2383e2] dark:text-sky-400" />
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    Kết Bạn Nhanh Qua Email / Tên:
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Nhập email bạn học (vd: banhoc@gmail.com)..."
                    value={addFriendInput}
                    onChange={(e) => setAddFriendInput(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:border-[#2383e2] dark:focus:border-sky-400 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Kết bạn</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  ⚡ Bạn của bạn dù ở trên điện thoại hay máy tính khác, lời mời sẽ gửi tức thì qua Cloud Relay!
                </p>
              </form>

              {/* PHẦN 1: LỜI MỜI KẾT BẠN ĐANG CHỜ PHÊ DUYỆT */}
              {incomingRequests.length > 0 && (
                <div className="space-y-2 pb-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black uppercase text-rose-500 flex items-center gap-1 tracking-wider">
                      <Bell className="w-3 h-3" />
                      <span>Lời Mời Kết Bạn ({incomingRequests.length})</span>
                    </span>
                  </div>

                  {incomingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-2.5 rounded-xl bg-gradient-to-br from-amber-50/80 to-rose-50/50 dark:from-amber-950/30 dark:to-rose-950/20 border border-amber-200 dark:border-amber-800/40 space-y-2 animate-fade-in"
                    >
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={req.sender?.avatar}
                          alt={req.sender?.name}
                          className="w-10 h-10 rounded-full object-cover bg-slate-200 border border-amber-300"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                            {req.sender?.name}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                            {req.sender?.studyGoal || 'Học viên OnThiHub'}
                          </span>
                        </div>
                      </div>

                      {req.message && (
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 p-2 rounded-lg border border-amber-100 dark:border-white/5 italic">
                          "{req.message}"
                        </p>
                      )}

                      <div className="flex items-center space-x-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAcceptRequest(req.sender)}
                          className="flex-1 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1 cursor-pointer active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Đồng ý</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineRequest(req.sender)}
                          className="py-1.5 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                        >
                          <span>Bỏ qua</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PHẦN 2: GỢI Ý BẠN HỌC ÔN THI */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Gợi Ý Bạn Học Ôn Thi ({filteredSuggestions.length})
                  </span>
                  {filteredSuggestions.length > 0 && (
                    <button
                      type="button"
                      onClick={handleQuickAddAllFriends}
                      className="px-2 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 dark:hover:bg-sky-900 text-[#2383e2] dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
                      title="Gửi lời mời kết bạn nhanh tới toàn bộ danh sách đang hiển thị"
                    >
                      <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>Kết Bạn Nhanh Tất Cả</span>
                    </button>
                  )}
                </div>

                {/* Filter Chips by Major */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px]">
                  {[
                    { id: 'ALL', label: '🌟 Tất Cả' },
                    { id: 'cong-chuc', label: '🏛️ Công Chức & Thuế' },
                    { id: 'ngoai-ngu', label: '🌍 Ngoại Ngữ / IELTS' },
                    { id: 'y-te', label: '🏥 Y Tế & Dược' },
                    { id: 'it-tech', label: '💻 CNTT & Tin Học' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSuggestionFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap cursor-pointer transition-all ${
                        suggestionFilter === tab.id
                          ? 'bg-[#2383e2] text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {filteredSuggestions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 leading-relaxed">
                    Không tìm thấy bạn học trong chuyên mục này. Bạn có thể chọn chuyên mục khác hoặc nhập email ở trên để kết bạn nhé!
                  </div>
                ) : (
                  filteredSuggestions.map((suggested) => {
                    const status = getFriendshipStatus(currentParticipant.id, suggested.id);
                    return (
                      <div
                        key={suggested.id}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/10 transition-all flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                          <div className="relative shrink-0">
                            <img
                              src={suggested.avatar}
                              alt={suggested.name}
                              className="w-10 h-10 rounded-full object-cover bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-white/10"
                            />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {suggested.name}
                              </span>
                              {suggested.tier === 'ultra' && (
                                <span className="px-1 py-0.2 rounded text-[8px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                  👑 ULTRA
                                </span>
                              )}
                              {suggested.tier === 'pro' && (
                                <span className="px-1 py-0.2 rounded text-[8px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                                  🚀 PRO
                                </span>
                              )}
                              {suggested.streak > 0 && (
                                <span className="px-1 py-0.2 rounded text-[8px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 flex items-center gap-0.5">
                                  <Flame className="w-2.5 h-2.5 fill-amber-500" />
                                  <span>{suggested.streak} ngày</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                              {suggested.studyGoal || suggested.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          {status === 'friends' ? (
                            <button
                              type="button"
                              onClick={() => handleSelectPartner(suggested)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-50 dark:bg-sky-950/80 text-[#2383e2] dark:text-sky-300 hover:bg-[#2383e2] hover:text-white transition-colors cursor-pointer"
                            >
                              Nhắn tin
                            </button>
                          ) : status === 'sent' ? (
                            <button
                              type="button"
                              onClick={() => {
                                cancelFriendRequest(currentParticipant.id, suggested.id);
                                refreshAllData();
                                playSound('click');
                              }}
                              className="px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 cursor-pointer transition-colors"
                              title="Hủy lời mời"
                            >
                              Đã gửi • Hủy
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSendFriendRequest(suggested)}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#2383e2] hover:bg-[#1a73e8] text-white shadow-xs transition-all flex items-center space-x-1 cursor-pointer shrink-0 active:scale-95"
                                title="Gửi lời mời kết bạn"
                              >
                                <UserPlus className="w-3 h-3" />
                                <span>Kết bạn</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenPvpChallenge(suggested)}
                                className="px-2 py-1 rounded-lg text-[10px] font-black bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-xs transition-all flex items-center space-x-1 cursor-pointer shrink-0 active:scale-95"
                                title="Thách đấu trắc nghiệm 1v1 ngay lập tức"
                              >
                                <Swords className="w-3 h-3 text-yellow-200" />
                                <span className="hidden sm:inline">Đấu 1v1</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </aside>

        {/* =========================================================
            RIGHT COLUMN: ACTIVE CHAT WINDOW
            ========================================================= */}
        <main
          className={`flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0 ${
            !mobileShowChat ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <header className="p-3 sm:px-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
            <div className="flex items-center space-x-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setMobileShowChat(false)}
                className="sm:hidden p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Quay lại danh sách hội thoại"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={activePartner?.avatar}
                  alt={activePartner?.name}
                  className="w-9 h-9 rounded-full object-cover bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-white/10"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {activePartner?.name}
                  </h3>

                  {activePartner?.role === 'admin' || activePartner?.id === 'admin_onthi' ? (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-700 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                      <span>Ban Quản Trị</span>
                    </span>
                  ) : friendshipStatus === 'friends' ? (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Bạn Bè</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-slate-400" />
                      <span>Học Viên</span>
                    </span>
                  )}

                  {/* Duo Streak Flame Badge */}
                  {activePartner?.role !== 'admin' && activePartner?.id !== 'admin_onthi' && (
                    <button
                      type="button"
                      onClick={handleDuoNudge}
                      className="px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      title={
                        partnerDuoStreak.streak > 0
                          ? `Chuỗi bạn cùng tiến: ${partnerDuoStreak.streak} ngày liên tiếp!`
                          : 'Bấm để nhắc bạn cùng học ngay hôm nay để thắp lửa!'
                      }
                    >
                      <span>{partnerDuoStreak.flameLevel.icon}</span>
                      <span>{partnerDuoStreak.streak > 0 ? `Chuỗi ${partnerDuoStreak.streak}N` : 'Nhắc học'}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-[10px]">
                  {activePartner?.role === 'admin' ? (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">
                      🛡️ Kênh hỗ trợ chính thức • Duyệt lệnh & giải đáp
                    </span>
                  ) : friendshipStatus === 'friends' ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      🟢 Bạn bè • Đang hoạt động
                    </span>
                  ) : friendshipStatus === 'sent' ? (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      ⏳ Đang chờ đối phương chấp nhận kết bạn
                    </span>
                  ) : friendshipStatus === 'received' ? (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      📩 Đã gửi lời mời kết bạn cho bạn
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal">
                      Chưa kết bạn • Có thể gửi lời mời kết bạn
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              {/* Nút Kết Bạn nhanh trên header nếu chưa là bạn bè */}
              {activePartner?.role !== 'admin' && activePartner?.id !== 'admin_onthi' && (
                <>
                  {friendshipStatus === 'none' && (
                    <button
                      type="button"
                      onClick={() => handleSendFriendRequest(activePartner)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-300 text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                      title="Gửi lời mời kết bạn"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Kết Bạn</span>
                    </button>
                  )}
                  {friendshipStatus === 'received' && (
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(activePartner)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-xs animate-bounce"
                      title="Chấp nhận kết bạn"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Đồng Ý Kết Bạn</span>
                    </button>
                  )}
                </>
              )}

              {/* 1v1 PvP Battle Challenge Button */}
              {activePartner?.role !== 'admin' && activePartner?.id !== 'admin_onthi' && (
                <button
                  type="button"
                  onClick={() => handleOpenPvpChallenge(activePartner)}
                  className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black flex items-center space-x-1 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Thách đấu trắc nghiệm 1v1 đối kháng trực tiếp"
                >
                  <Swords className="w-3.5 h-3.5 text-yellow-200" />
                  <span className="hidden sm:inline">Thách Đấu 1v1</span>
                </button>
              )}

              {/* Quick Attach / Share Deck Button */}
              <button
                type="button"
                onClick={() => setShowDeckPicker(!showDeckPicker)}
                className="px-2.5 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 dark:hover:bg-sky-900 text-[#2383e2] dark:text-sky-300 border border-sky-200 dark:border-sky-500/40 text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                title="Gửi đính kèm một bộ thẻ Flashcard vào cuộc trò chuyện"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chia Sẻ Bộ Thẻ</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Đóng (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* BANNER NGỮ CẢNH: TRẠNG THÁI KẾT BẠN */}
          {activePartner?.role !== 'admin' && activePartner?.id !== 'admin_onthi' && (
            <>
              {friendshipStatus === 'received' && (
                <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/40 border-b border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs animate-fade-in">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Bell className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-amber-900 dark:text-amber-200 truncate font-medium">
                      <strong>{activePartner?.name}</strong> đã gửi lời mời kết bạn cho bạn!
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(activePartner)}
                      className="px-2.5 py-1 rounded-md bg-[#2383e2] hover:bg-[#1a73e8] text-white font-bold text-[11px] shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Đồng ý</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeclineRequest(activePartner)}
                      className="px-2 py-1 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] cursor-pointer"
                    >
                      Bỏ qua
                    </button>
                  </div>
                </div>
              )}

              {friendshipStatus === 'sent' && (
                <div className="px-4 py-1.5 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between text-xs">
                  <span className="text-blue-800 dark:text-blue-200 text-[11px]">
                    ⏳ Đã gửi lời mời kết bạn tới <strong>{activePartner?.name}</strong>. Tin nhắn của bạn sẽ được hiển thị ngay.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      cancelFriendRequest(currentParticipant.id, activePartner.id);
                      refreshAllData();
                      playSound('click');
                    }}
                    className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Thu hồi lời mời
                  </button>
                </div>
              )}

              {friendshipStatus === 'none' && (
                <div className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                    💡 Hai bạn chưa kết bạn với nhau.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSendFriendRequest(activePartner)}
                    className="text-[11px] font-bold text-[#2383e2] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Gửi lời mời kết bạn</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Deck Picker Dropdown Popup */}
          {showDeckPicker && (
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-white/10 animate-fade-in text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#2383e2] dark:text-sky-400" />
                  <span>Chọn bộ thẻ ôn tập để đính kèm vào tin nhắn:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowDeckPicker(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="max-h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1">
                {(allCourses.length > 0 ? allCourses : []).slice(0, 10).map((deck) => (
                  <div
                    key={deck.id}
                    onClick={() => handleSelectDeckToAttach(deck)}
                    className="p-2 bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-white/10 hover:border-[#2383e2] transition-colors cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="text-base shrink-0">{deck.icon || '📚'}</span>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white block truncate text-xs">
                          {deck.title}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                          {deck.categoryLabel || 'Kiến Thức'} •{' '}
                          {deck.cardsCount || (deck.cards ? deck.cards.length : (deck.previewCards ? deck.previewCards.length : 0))} Thẻ
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#2383e2] dark:text-sky-400 shrink-0">
                      Chọn +
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[#faf9f8] dark:bg-[#0c1017]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-[#2383e2] dark:text-sky-400 flex items-center justify-center border border-sky-200 dark:border-sky-500/30">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Bắt đầu cuộc trò chuyện với {activePartner?.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                    {activePartner?.role === 'admin'
                      ? 'Gửi câu hỏi hoặc yêu cầu hỗ trợ trực tiếp tới Ban Quản Trị OnThiHub để được giải đáp nhanh chóng.'
                      : friendshipStatus === 'friends'
                      ? 'Hai bạn đã là bạn bè! Hãy cùng chia sẻ kinh nghiệm học và đính kèm bộ thẻ flashcard nhé!'
                      : 'Gửi lời chào làm quen! Tin nhắn đầu tiên sẽ gửi kèm lời mời kết bạn để hai bạn dễ dàng kết nối.'}
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = isSameUser(msg.sender, currentParticipant);
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end space-x-2 ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* Partner Avatar for incoming messages */}
                    {!isMe && (
                      <img
                        src={msg.sender?.avatar || activePartner?.avatar}
                        alt={msg.sender?.name}
                        className="w-7 h-7 rounded-full object-cover bg-slate-200 dark:bg-slate-800 shrink-0 mb-1 border border-slate-200 dark:border-white/10"
                      />
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[70%] space-y-1.5 ${
                        isMe ? 'items-end' : 'items-start'
                      }`}
                    >
                      {/* Sender name badge for partner */}
                      {!isMe && (
                        <div className="flex items-center space-x-1.5 px-1">
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">
                            {msg.sender?.name}
                          </span>
                          {msg.sender?.badge && (
                            <span className="text-[9px] text-slate-400 font-medium">
                              ({msg.sender.badge})
                            </span>
                          )}
                        </div>
                      )}

                      {/* Main Message Bubble */}
                      <div
                        className={`rounded-2xl p-3 text-xs leading-relaxed break-words shadow-2xs ${
                          isMe
                            ? 'bg-[#2383e2] text-white rounded-br-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-bl-xs'
                        }`}
                      >
                        {msg.text && (
                          <p className="whitespace-pre-line font-normal">{msg.text}</p>
                        )}

                        {/* Shared Flashcard Deck Card inside chat */}
                        {msg.sharedDeck && (
                          <div
                            className={`mt-2 p-3 rounded-xl border transition-all ${
                              isMe
                                ? 'bg-white/15 border-white/30 text-white'
                                : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-white/15 text-slate-900 dark:text-white'
                            }`}
                          >
                            <div className="flex items-start space-x-2.5">
                              <div className="w-9 h-9 rounded-lg bg-white/20 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0 border border-white/20 dark:border-white/10">
                                {msg.sharedDeck.icon || '📚'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span
                                  className={`text-[10px] font-black uppercase tracking-wider block ${
                                    isMe ? 'text-blue-100' : 'text-[#2383e2] dark:text-sky-400'
                                  }`}
                                >
                                  {msg.sharedDeck.categoryLabel || 'Bộ Thẻ Anki'} •{' '}
                                  {msg.sharedDeck.cardsCount || (msg.sharedDeck.cards ? msg.sharedDeck.cards.length : (msg.sharedDeck.previewCards ? msg.sharedDeck.previewCards.length : 0))} Thẻ
                                </span>
                                <h4 className="text-xs sm:text-sm font-bold truncate mt-0.5">
                                  {msg.sharedDeck.title}
                                </h4>
                              </div>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-white/20 dark:border-white/10 flex items-center justify-between gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  const targetCourse =
                                    allCourses.find((c) => c.id === msg.sharedDeck.id) ||
                                    msg.sharedDeck;
                                  onOpenFlashcards?.(targetCourse);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-transform active:scale-95 ${
                                  isMe
                                    ? 'bg-white text-[#2383e2] hover:bg-blue-50 shadow-xs'
                                    : 'bg-[#2383e2] hover:bg-[#1a73e8] text-white shadow-xs'
                                }`}
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Mở Học Ngay</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={(e) => handleCopyDeckLink(e, msg.sharedDeck)}
                                className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1 cursor-pointer ${
                                  isMe
                                    ? 'hover:bg-white/20 text-white'
                                    : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}
                                title="Sao chép đường dẫn chia sẻ bộ thẻ này"
                              >
                                {copiedLinkDeckId === msg.sharedDeck.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Đã chép link</span>
                                  </>
                                ) : (
                                  <>
                                    <Share2 className="w-3 h-3" />
                                    <span>Lấy Link</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Shared 4K Royal Achievement Certificate Card inside chat */}
                        {msg.sharedAchievement && (
                          <div
                            className={`mt-2 p-3 rounded-2xl border transition-all shadow-md relative overflow-hidden ${
                              msg.sharedAchievement.theme === 'crimson_glory'
                                ? 'bg-gradient-to-br from-red-950/80 via-slate-900 to-amber-950/80 border-red-500/40 text-white'
                                : msg.sharedAchievement.theme === 'cyber_diamond'
                                ? 'bg-gradient-to-br from-sky-950/80 via-slate-900 to-indigo-950/80 border-sky-400/40 text-white'
                                : 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-yellow-950/80 border-amber-400/50 text-white'
                            }`}
                          >
                            <div className="flex items-start space-x-2.5">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border shadow-md ${
                                  msg.sharedAchievement.theme === 'crimson_glory'
                                    ? 'bg-gradient-to-br from-red-500 to-amber-600 text-white border-red-400'
                                    : msg.sharedAchievement.theme === 'cyber_diamond'
                                    ? 'bg-gradient-to-br from-sky-400 to-purple-600 text-white border-sky-300'
                                    : 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 border-amber-300'
                                }`}
                              >
                                <Crown className="w-5 h-5 fill-current" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    Bằng Khen Hoàng Gia 4K
                                  </span>
                                  {msg.sharedAchievement.score !== undefined && (
                                    <span className="text-[10px] font-bold text-emerald-300">
                                      {msg.sharedAchievement.score}/{msg.sharedAchievement.totalQuestions || 60} Câu ({msg.sharedAchievement.accuracy || 100}%)
                                    </span>
                                  )}
                                  {msg.sharedAchievement.streak > 0 && (
                                    <span className="text-[10px] font-bold text-amber-300">
                                      🔥 Chuỗi {msg.sharedAchievement.streak} Ngày
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-xs sm:text-sm font-black truncate mt-1 text-amber-100">
                                  {msg.sharedAchievement.title}
                                </h4>
                                <p className="text-[10px] text-slate-300 truncate">
                                  Thí sinh: {msg.sharedAchievement.userName || msg.sender?.name}
                                </p>
                              </div>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => onOpenShareAchievement?.(msg.sharedAchievement)}
                                className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 text-xs font-black shadow-md flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>👑 Xem Bằng Khen 4K Retina</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 1v1 PvP Challenge Invitation Card */}
                        {msg.pvpChallenge && (
                          <div className="mt-2 p-3 rounded-2xl border transition-all shadow-md relative overflow-hidden bg-gradient-to-br from-red-950/85 via-slate-900 to-amber-950/85 border-red-500/40 text-white">
                            <div className="flex items-start space-x-2.5">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center text-lg shrink-0 border border-red-400 shadow-md">
                                <Swords className="w-5 h-5 text-yellow-200 fill-current animate-pulse" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-red-500/30 text-rose-300 border border-red-500/40">
                                    Thách Đấu 1v1 Đối Kháng
                                  </span>
                                  {msg.pvpChallenge.wagerXu > 0 ? (
                                    <span className="text-[10px] font-black text-amber-300 px-1.5 py-0.2 rounded bg-amber-400/20 border border-amber-400/30 flex items-center gap-1">
                                      <Coins className="w-3 h-3" />
                                      <span>Cược {msg.pvpChallenge.wagerXu} Xu</span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-sky-300">
                                      🤝 Giao Hữu
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-xs sm:text-sm font-black truncate mt-1 text-amber-100">
                                  {msg.pvpChallenge.deckTitle}
                                </h4>
                                <p className="text-[10px] text-slate-300 truncate">
                                  {msg.pvpChallenge.totalQuestions || 5} Câu hỏi trắc nghiệm đối kháng
                                </p>
                              </div>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-2">
                              {!isMe && msg.pvpChallenge.status === 'pending' ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleAcceptAndPlayPvp(msg.pvpChallenge)}
                                    className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-black shadow-md flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 transition-all animate-pulse"
                                  >
                                    <Swords className="w-3.5 h-3.5 text-yellow-200" />
                                    <span>⚔️ Chấp Nhận & Thi Đấu Ngay</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      try {
                                        playSound('click');
                                        await declinePvpChallenge(msg.pvpChallenge.id, currentUser);
                                        refreshAllData();
                                      } catch (e) {
                                        alert(e.message || 'Không thể từ chối');
                                      }
                                    }}
                                    className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                                  >
                                    Từ chối
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleOpenPvpChallenge(activePartner, msg.pvpChallenge)}
                                  className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-black shadow-md flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
                                >
                                  <Swords className="w-3.5 h-3.5" />
                                  <span>
                                    {msg.pvpChallenge.status === 'finished'
                                      ? '🏆 Xem Kết Quả Trận Đấu'
                                      : msg.pvpChallenge.status === 'in_progress'
                                      ? '🔥 Vào Đấu Trường Ngay'
                                      : isMe
                                      ? '⚔️ Vào Phòng Chờ / Hối Bạn Học'
                                      : '⚔️ Chấp Nhận & Thi Đấu Ngay'}
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Timestamp & Delivery Status Badge */}
                      <div
                        className={`flex items-center space-x-1.5 px-1 ${
                          isMe ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <span className="text-[9px] text-slate-400 dark:text-slate-500">
                          {formatHanoiDateTime(msg.createdAt, false)}
                        </span>

                        {isMe && (
                          <>
                            {msg.status === 'seen' || msg.isRead ? (
                              <span
                                className="inline-flex items-center gap-0.5 text-[9px] text-sky-400 dark:text-sky-300 font-semibold"
                                title={msg.readAt ? `Đã xem lúc ${formatHanoiDateTime(msg.readAt, false)}` : 'Đã xem'}
                              >
                                <CheckCheck className="w-3 h-3 text-sky-400" />
                                <span>Đã xem</span>
                              </span>
                            ) : msg.status === 'delivered' ? (
                              <span
                                className="inline-flex items-center gap-0.5 text-[9px] text-slate-400 dark:text-slate-400 font-medium"
                                title="Đã nhận"
                              >
                                <CheckCheck className="w-3 h-3 text-slate-400" />
                                <span>Đã nhận</span>
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-0.5 text-[9px] text-slate-400 dark:text-slate-400 font-medium"
                                title="Đã gửi"
                              >
                                <Check className="w-3 h-3 text-slate-400" />
                                <span>Đã gửi</span>
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 pt-2 pb-1 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-white/10 flex items-center space-x-1.5 overflow-x-auto text-xs no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(prompt);
                  playSound('click');
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 border border-slate-200/60 dark:border-white/10"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Attached Deck Preview Pill (before sending) */}
          {attachedDeck && (
            <div className="mx-3 mt-1.5 p-2 rounded-xl bg-sky-50 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-500/40 flex items-center justify-between text-xs animate-fade-in">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-base shrink-0">{attachedDeck.icon || '📚'}</span>
                <div className="min-w-0">
                  <span className="font-bold text-[#2383e2] dark:text-sky-300 block truncate">
                    Đang đính kèm: {attachedDeck.title}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {attachedDeck.cardsCount ||
                      (attachedDeck.cards ? attachedDeck.cards.length : (attachedDeck.previewCards ? attachedDeck.previewCards.length : 0))}{' '}
                    Thẻ Flashcard
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAttachedDeck(null)}
                className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                title="Bỏ đính kèm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Attached Achievement Preview Pill (before sending) */}
          {attachedAchievement && (
            <div className="mx-3 mt-1.5 p-2 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/80 dark:to-yellow-950/60 border border-amber-300 dark:border-amber-500/50 flex items-center justify-between text-xs animate-fade-in shadow-xs">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-base shrink-0">👑</span>
                <div className="min-w-0">
                  <span className="font-bold text-amber-900 dark:text-amber-200 block truncate">
                    Đính kèm Bằng Khen Hoàng Gia: {attachedAchievement.title}
                  </span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400">
                    {attachedAchievement.score !== undefined ? `${attachedAchievement.score}/${attachedAchievement.totalQuestions || 60} Câu` : 'Vinh Danh Kỷ Lục'} • Định dạng 4K Retina
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAttachedAchievement(null)}
                className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                title="Bỏ đính kèm bằng khen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Message Input Footer Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white dark:bg-slate-900 flex items-center space-x-2 border-t border-slate-200 dark:border-white/10"
          >
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => setShowDeckPicker(!showDeckPicker)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
              title="Đính kèm bộ thẻ Flashcard"
            >
              <Layers className="w-4 h-4 text-[#2383e2] dark:text-sky-400" />
            </button>

            {/* Text Input */}
            <input
              type="text"
              placeholder={
                activePartner?.role === 'admin'
                  ? 'Nhắn tin hỏi đáp với Ban Quản Trị OnThiHub...'
                  : friendshipStatus === 'friends'
                  ? `Nhắn tin cho bạn ${activePartner?.name || 'học'}...`
                  : `Gửi lời chào làm quen tới ${activePartner?.name || 'bạn học'}...`
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-white border border-transparent focus:border-[#2383e2] dark:focus:border-sky-400 rounded-xl outline-none transition-colors placeholder:text-slate-400"
              autoFocus
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() && !attachedDeck && !attachedAchievement}
              className="px-4 py-2 bg-[#2383e2] hover:bg-[#1a73e8] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs shrink-0 active:scale-95"
            >
              <span>Gửi</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </main>
      </div>

      {/* 1v1 PvP BATTLE ARENA MODAL */}
      {isPvpModalOpen && (
        <PvpBattleModal
          isOpen={isPvpModalOpen}
          onClose={() => setIsPvpModalOpen(false)}
          currentUser={currentUser}
          targetPartner={activePartner}
          allCourses={allCourses}
          initialBattle={activeBattleForModal}
          onOpenDirectChat={(p) => {
            setIsPvpModalOpen(false);
            if (p) setActivePartner(p);
          }}
        />
      )}
    </div>
  );
}
