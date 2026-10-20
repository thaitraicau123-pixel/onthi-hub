import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Send,
  MessageCircle,
  Search,
  Sparkles,
  Layers,
  BookOpen,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Users,
  ChevronLeft,
  Flame,
  ArrowRight,
  ShieldCheck,
  Paperclip,
  ExternalLink
} from 'lucide-react';
import { useModalDismiss } from '../hooks/useModalDismiss';
import {
  getCurrentUserParticipant,
  getUserConversations,
  getConversationMessages,
  sendDirectMessage,
  markConversationAsRead,
  subscribeToDirectMessages,
  getConversationId,
  ASSISTANT_PARTICIPANT,
  ADMIN_PARTICIPANT
} from '../utils/directMessaging';
import { formatHanoiRelativeTime, formatHanoiDateTime } from '../utils/hanoiTime';
import { copyFlashcardShareLink } from '../utils/shareLink';
import { playSound } from '../utils/storage';
import confetti from 'canvas-confetti';

const QUICK_PROMPTS = [
  '👋 Chào bạn!',
  '📚 Bạn đang ôn kỳ thi nào thế?',
  '💡 Cùng trao đổi đề thi nhé!',
  '🔥 Chúc bạn ôn thi đạt kết quả cao!'
];

export default function DirectChatModal({
  isOpen,
  onClose,
  currentUser,
  targetPartner = null,
  initialAttachedDeck = null,
  allCourses = [],
  onOpenFlashcards,
  onShowToast
}) {
  const { handleBackdropClick } = useModalDismiss(onClose, isOpen);
  const currentParticipant = useMemo(() => getCurrentUserParticipant(currentUser), [currentUser]);

  const [conversations, setConversations] = useState(() => getUserConversations(currentUser));
  const [activePartner, setActivePartner] = useState(() => targetPartner || ASSISTANT_PARTICIPANT);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedDeck, setAttachedDeck] = useState(initialAttachedDeck);
  const [showDeckPicker, setShowDeckPicker] = useState(false);
  const [copiedLinkDeckId, setCopiedLinkDeckId] = useState(null);
  const [mobileShowChat, setMobileShowChat] = useState(Boolean(targetPartner));

  const messagesEndRef = useRef(null);

  // Cập nhật khi targetPartner hoặc initialAttachedDeck từ ngoài truyền vào
  useEffect(() => {
    if (targetPartner) {
      setActivePartner(targetPartner);
      setMobileShowChat(true);
    }
  }, [targetPartner]);

  useEffect(() => {
    if (initialAttachedDeck) {
      setAttachedDeck(initialAttachedDeck);
    }
  }, [initialAttachedDeck]);

  // Tải danh sách hội thoại
  const refreshConversations = () => {
    const list = getUserConversations(currentUser);
    setConversations(list);
  };

  // Tải tin nhắn của cuộc hội thoại đang chọn
  useEffect(() => {
    if (!isOpen || !activePartner) return;
    const convId = getConversationId(currentParticipant.id, activePartner.id);
    const msgs = getConversationMessages(convId, currentParticipant.id);
    setMessages(msgs);
    markConversationAsRead(convId, currentParticipant.id);
    refreshConversations();
  }, [isOpen, activePartner, currentParticipant.id]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Đăng ký lắng nghe tin nhắn thời gian thực
  useEffect(() => {
    if (!isOpen) return;
    const unsub = subscribeToDirectMessages(currentParticipant.id, (newMsg) => {
      refreshConversations();
      if (activePartner && newMsg) {
        const curConvId = getConversationId(currentParticipant.id, activePartner.id);
        if (newMsg.conversationId === curConvId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          markConversationAsRead(curConvId, currentParticipant.id);
          playSound('click');
        }
      }
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [isOpen, activePartner, currentParticipant.id]);

  // Gửi tin nhắn
  const handleSendMessage = (e) => {
    e?.preventDefault?.();
    if (!inputText.trim() && !attachedDeck) return;

    playSound('click');
    const sent = sendDirectMessage({
      sender: currentParticipant,
      receiver: activePartner,
      text: inputText,
      sharedDeck: attachedDeck
    });

    if (sent) {
      setMessages((prev) => [...prev, sent]);
      setInputText('');
      setAttachedDeck(null);
      refreshConversations();
    }
  };

  // Chọn bộ thẻ đính kèm
  const handleSelectDeckToAttach = (deck) => {
    setAttachedDeck(deck);
    setShowDeckPicker(false);
    playSound('flip');
  };

  // Sao chép link bộ thẻ trong bong bóng chat
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

  // Lọc hội thoại theo tìm kiếm
  const filteredConversations = conversations.filter((c) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      c.partner?.name?.toLowerCase().includes(term) ||
      c.partner?.email?.toLowerCase().includes(term) ||
      c.lastMessage?.text?.toLowerCase().includes(term)
    );
  });

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-[92vh] sm:h-[82vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 flex overflow-hidden text-slate-900 dark:text-white"
      >
        {/* =========================================================
            LEFT COLUMN: CONVERSATION LIST (SIDEBAR)
            ========================================================= */}
        <aside
          className={`w-full sm:w-80 border-r border-slate-200 dark:border-white/10 flex flex-col bg-slate-50/80 dark:bg-slate-950/60 shrink-0 ${
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
                  <span>Tin Nhắn Trực Tiếp</span>
                </h2>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {currentParticipant.name}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="sm:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-2.5 border-b border-slate-200 dark:border-white/10">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm bạn học, tin nhắn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:border-[#2383e2] dark:focus:border-sky-400 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Không tìm thấy cuộc trò chuyện nào.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activePartner?.id === conv.partner?.id;
                const hasUnread = conv.unreadCount > 0;
                return (
                  <button
                    key={conv.conversationId}
                    type="button"
                    onClick={() => {
                      setActivePartner(conv.partner);
                      setMobileShowChat(true);
                      playSound('click');
                    }}
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
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {conv.partner?.name}
                        </span>
                        {conv.lastMessage?.createdAt && (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {formatHanoiRelativeTime(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <p className={`text-[11px] truncate ${
                          hasUnread ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {conv.lastMessage?.sharedDeck ? (
                            <span className="text-[#2383e2] dark:text-sky-400 font-semibold flex items-center gap-1">
                              <span>📇 Đã chia sẻ bộ thẻ</span>
                            </span>
                          ) : conv.lastMessage?.text ? (
                            conv.lastMessage.text
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
        </aside>

        {/* =========================================================
            RIGHT COLUMN: ACTIVE CHAT WINDOW
            ========================================================= */}
        <main
          className={`flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0 ${
            !mobileShowChat ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Active Chat Header */}
          <header className="p-3 sm:px-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
            <div className="flex items-center space-x-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setMobileShowChat(false)}
                className="sm:hidden p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
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
                  {activePartner?.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-600/40">
                      {activePartner.badge}
                    </span>
                  )}
                  {activePartner?.tier === 'ultra' && !activePartner?.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      👑 ULTRA
                    </span>
                  )}
                  {activePartner?.tier === 'pro' && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300">
                      🚀 PRO
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                  🟢 Đang hoạt động • Trực tuyến
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
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
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Đóng (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Deck Picker Dropdown Popup */}
          {showDeckPicker && (
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-white/10 animate-fade-in text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#2383e2] dark:text-sky-400" />
                  <span>Chọn bộ thẻ để đính kèm vào tin nhắn:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowDeckPicker(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5"
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
                          {deck.categoryLabel || 'Kiến Thức'} • {deck.cardsCount || (deck.cards ? deck.cards.length : 0)} Thẻ
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
                    Gửi lời chào hoặc bấm vào các câu gợi ý nhanh bên dưới để trao đổi kinh nghiệm ôn thi nhé!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender?.id === currentParticipant.id;
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

                    <div className={`max-w-[85%] sm:max-w-[70%] space-y-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                      {/* Sender name for group clarity if partner */}
                      {!isMe && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold px-1">
                          {msg.sender?.name}
                        </span>
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
                          <div className={`mt-2 p-3 rounded-xl border transition-all ${
                            isMe
                              ? 'bg-white/15 border-white/30 text-white'
                              : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-white/15 text-slate-900 dark:text-white'
                          }`}>
                            <div className="flex items-start space-x-2.5">
                              <div className="w-9 h-9 rounded-lg bg-white/20 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0 border border-white/20 dark:border-white/10">
                                {msg.sharedDeck.icon || '📚'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className={`text-[10px] font-black uppercase tracking-wider block ${
                                  isMe ? 'text-blue-100' : 'text-[#2383e2] dark:text-sky-400'
                                }`}>
                                  {msg.sharedDeck.categoryLabel || 'Bộ Thẻ Anki'} • {msg.sharedDeck.cardsCount || 0} Thẻ
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
                                  const targetCourse = allCourses.find((c) => c.id === msg.sharedDeck.id) || msg.sharedDeck;
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
                      </div>

                      {/* Timestamp */}
                      <span className={`text-[9px] text-slate-400 dark:text-slate-500 block px-1 ${
                        isMe ? 'text-right' : 'text-left'
                      }`}>
                        {formatHanoiDateTime(msg.createdAt, false)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 pt-2 pb-1 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-white/10 flex items-center space-x-1.5 overflow-x-auto text-xs no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
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
                    {attachedDeck.cardsCount || (attachedDeck.cards ? attachedDeck.cards.length : 0)} Thẻ Flashcard
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
              placeholder={`Nhắn tin cho ${activePartner?.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-white border border-transparent focus:border-[#2383e2] dark:focus:border-sky-400 rounded-xl outline-none transition-colors placeholder:text-slate-400"
              autoFocus
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() && !attachedDeck}
              className="px-4 py-2 bg-[#2383e2] hover:bg-[#1a73e8] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs shrink-0 active:scale-95"
            >
              <span>Gửi</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
