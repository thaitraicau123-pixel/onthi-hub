// =========================================================================
// ONTHIHUB DIRECT MESSAGING & REAL-TIME PEER-TO-PEER CHAT ENGINE
// Hỗ trợ nhắn tin riêng 1-1 giữa các học viên, tác giả bộ thẻ và Admin
// Kèm tính năng đính kèm & chia sẻ bộ thẻ Flashcard trực tiếp trong tin nhắn
// =========================================================================

import { getHanoiTimeString, formatHanoiDateTime, formatHanoiRelativeTime } from './hanoiTime';
import { getOrCreateCommunityClientId } from '../data/communityData';

export const DM_STORAGE_KEY = 'onthi_direct_messages_v2';
export const DM_BROADCAST_CHANNEL = 'onthi_hub_direct_chat_v2';
export const DM_CLOUD_RELAY_TOPIC = 'onthi_hub_dm_relay_v2';

// Trợ lý học tập ảo mặc định luôn sẵn sàng hỗ trợ
export const ASSISTANT_PARTICIPANT = {
  id: 'assistant_onthi',
  name: 'Trợ Lý Học Tập OnThiHub',
  email: 'troly@onthihub.vn',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=OnThiTutor',
  role: 'bot',
  tier: 'ultra',
  isOnline: true,
  badge: '🤖 AI Tutor'
};

// Ban quản trị hỗ trợ
export const ADMIN_PARTICIPANT = {
  id: 'admin_onthi',
  name: 'Ban Quản Trị OnThiHub',
  email: 'hotro@onthihub.vn',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminSupport',
  role: 'admin',
  tier: 'ultra',
  isOnline: true,
  badge: '🛡️ Admin'
};

/**
 * Lấy đối tượng thông tin người tham gia từ user hiện tại
 */
export function getCurrentUserParticipant(user) {
  if (user && (user.email || user.displayName || user.uid)) {
    const email = user.email || `${user.uid || 'guest'}@onthihub.vn`;
    const name = user.displayName || email.split('@')[0];
    return {
      id: user.uid || email,
      email,
      name,
      avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      role: user.role || 'student',
      tier: user.tier || 'free'
    };
  }

  // Khách vãng lai / học viên chưa đăng nhập
  const clientId = getOrCreateCommunityClientId();
  const shortCode = clientId.slice(-4).toUpperCase();
  return {
    id: clientId,
    email: `${clientId}@student.onthihub.vn`,
    name: `Bạn Học #${shortCode}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(clientId)}`,
    role: 'student',
    tier: 'free'
  };
}

/**
 * Tạo ID cuộc hội thoại duy nhất giữa 2 người tham gia (luôn đồng nhất bất kể ai bắt đầu trước)
 */
export function getConversationId(idA, idB) {
  if (!idA || !idB) return 'conv_default';
  const sorted = [String(idA), String(idB)].sort();
  return `conv_${sorted[0]}__${sorted[1]}`;
}

/**
 * Đọc tất cả tin nhắn từ LocalStorage
 */
export function getAllMessages() {
  try {
    const raw = localStorage.getItem(DM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}

  // Tin nhắn mẫu chào mừng khởi tạo lần đầu nếu chưa có tin nào
  const initialMessages = [
    {
      id: 'msg_welcome_ai_1',
      conversationId: getConversationId('assistant_onthi', 'default_user'),
      sender: ASSISTANT_PARTICIPANT,
      receiverId: 'default_user',
      text: 'Chào bạn! Mình là Trợ lý Học tập ÔnThiHub 🚀. Bạn có thể nhắn tin hỏi về kiến thức ôn thi, chia sẻ kinh nghiệm học tập hoặc bấm nút "Chia sẻ bộ thẻ" bên dưới để trao đổi tài liệu trực tiếp nhé!',
      sharedDeck: {
        id: 'cbcc-2026',
        title: 'Bộ Thẻ Trọng Tâm Luật Cán Bộ, Công Chức 2026',
        cardsCount: 60,
        categoryLabel: 'Công Chức',
        icon: '🏛️',
        priceXu: 29
      },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      isRead: false
    }
  ];

  try {
    localStorage.setItem(DM_STORAGE_KEY, JSON.stringify(initialMessages));
  } catch (e) {}

  return initialMessages;
}

/**
 * Lưu danh sách tin nhắn vào LocalStorage
 */
function saveAllMessages(messages) {
  try {
    localStorage.setItem(DM_STORAGE_KEY, JSON.stringify(messages.slice(-500))); // Giữ 500 tin nhắn gần nhất
  } catch (e) {}
}

/**
 * Lấy danh sách các cuộc hội thoại của người dùng hiện tại
 * @param {Object} currentUser
 * @returns {Array<Object>}
 */
export function getUserConversations(currentUser) {
  const current = getCurrentUserParticipant(currentUser);
  const allMsgs = getAllMessages();
  const convMap = new Map();

  // Luôn đảm bảo có cuộc hội thoại với Trợ lý AI và Ban Quản Trị
  const assistantConvId = getConversationId(current.id, ASSISTANT_PARTICIPANT.id);
  const adminConvId = getConversationId(current.id, ADMIN_PARTICIPANT.id);

  convMap.set(assistantConvId, {
    conversationId: assistantConvId,
    partner: ASSISTANT_PARTICIPANT,
    lastMessage: null,
    unreadCount: 0,
    updatedAt: 0
  });

  convMap.set(adminConvId, {
    conversationId: adminConvId,
    partner: ADMIN_PARTICIPANT,
    lastMessage: null,
    unreadCount: 0,
    updatedAt: 0
  });

  allMsgs.forEach((msg) => {
    // Kiểm tra tin nhắn thuộc về người dùng hiện tại
    const isSender = msg.sender?.id === current.id;
    const isReceiver = msg.receiverId === current.id || (msg.receiver && msg.receiver.id === current.id);
    const isUniversalWelcome = msg.receiverId === 'default_user';

    if (!isSender && !isReceiver && !isUniversalWelcome) return;

    let convId = msg.conversationId;
    let partner = isSender ? msg.receiver : msg.sender;

    if (isUniversalWelcome) {
      convId = assistantConvId;
      partner = ASSISTANT_PARTICIPANT;
    }

    if (!partner) return;

    const existing = convMap.get(convId) || {
      conversationId: convId,
      partner,
      lastMessage: null,
      unreadCount: 0,
      updatedAt: 0
    };

    const msgTime = new Date(msg.createdAt).getTime() || 0;
    if (!existing.lastMessage || msgTime > existing.updatedAt) {
      existing.lastMessage = msg;
      existing.updatedAt = msgTime;
    }

    // Đếm tin chưa đọc nếu mình là người nhận
    if ((isReceiver || isUniversalWelcome) && !msg.isRead) {
      existing.unreadCount = (existing.unreadCount || 0) + 1;
    }

    convMap.set(convId, existing);
  });

  // Chuyển Map thành mảng và sắp xếp theo tin mới nhất
  return Array.from(convMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Lấy lịch sử tin nhắn trong một cuộc hội thoại cụ thể
 */
export function getConversationMessages(conversationId, currentUserId) {
  if (!conversationId) return [];
  const allMsgs = getAllMessages();
  
  return allMsgs.filter((msg) => {
    if (msg.conversationId === conversationId) return true;
    // Cho phép hiển thị tin nhắn chào mừng mẫu nếu đang ở cuộc trò chuyện với bot
    if (conversationId.includes('assistant_onthi') && msg.conversationId === 'conv_assistant_onthi__default_user') {
      return true;
    }
    return false;
  }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Gửi tin nhắn trực tiếp
 * @param {Object} params
 * @param {Object} params.sender - Thông tin người gửi
 * @param {Object} params.receiver - Thông tin người nhận
 * @param {string} params.text - Nội dung tin nhắn
 * @param {Object|null} [params.sharedDeck=null] - Bộ thẻ flashcard đính kèm (nếu có)
 * @returns {Object} Tin nhắn vừa tạo
 */
export function sendDirectMessage({ sender, receiver, text, sharedDeck = null }) {
  if (!sender || !receiver || (!text?.trim() && !sharedDeck)) {
    return null;
  }

  const conversationId = getConversationId(sender.id, receiver.id);
  const nowIso = new Date().toISOString();

  const newMsg = {
    id: `dm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    conversationId,
    sender: {
      id: sender.id,
      name: sender.name,
      email: sender.email,
      avatar: sender.avatar,
      role: sender.role || 'student',
      tier: sender.tier || 'free'
    },
    receiver: {
      id: receiver.id,
      name: receiver.name,
      email: receiver.email,
      avatar: receiver.avatar,
      role: receiver.role || 'student',
      tier: receiver.tier || 'free'
    },
    receiverId: receiver.id,
    text: (text || '').trim(),
    sharedDeck: sharedDeck ? {
      id: sharedDeck.id,
      title: sharedDeck.title,
      cardsCount: sharedDeck.cardsCount || (sharedDeck.cards ? sharedDeck.cards.length : (sharedDeck.previewCards ? sharedDeck.previewCards.length : 0)),
      categoryLabel: sharedDeck.categoryLabel || 'Kiến Thức',
      icon: sharedDeck.icon || '📚',
      priceXu: sharedDeck.priceXu !== undefined ? sharedDeck.priceXu : 0
    } : null,
    createdAt: nowIso,
    isRead: false
  };

  // 1. Lưu cục bộ
  const allMsgs = getAllMessages();
  const updatedMsgs = [...allMsgs, newMsg];
  saveAllMessages(updatedMsgs);

  // 2. Phát sự kiện BroadcastChannel để đồng bộ tab khác trên cùng máy
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel(DM_BROADCAST_CHANNEL);
      bc.postMessage({ type: 'new_message', message: newMsg });
      bc.close();
    } catch (e) {}
  }

  // 3. Phát CustomEvent cho ứng dụng hiện tại
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('onthi-dm-message-sent', { detail: newMsg }));
  }

  // 4. Đồng bộ Cloud Relay (ntfy) nếu gửi cho người dùng khác
  if (receiver.id !== 'assistant_onthi' && receiver.id !== sender.id) {
    try {
      fetch(`https://ntfy.sh/${DM_CLOUD_RELAY_TOPIC}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ type: 'direct_message', message: newMsg })
      }).catch(() => {});
    } catch (e) {}
  }

  // 5. Nếu gửi tin cho Trợ lý AI (assistant_onthi), tự động phản hồi thông minh sau 800ms
  if (receiver.id === 'assistant_onthi') {
    setTimeout(() => {
      triggerAssistantAutoReply(sender, text, sharedDeck);
    }, 800);
  }

  return newMsg;
}

/**
 * Phản hồi tự động thông minh của Trợ lý AI Ôn Thi
 */
function triggerAssistantAutoReply(userSender, userText, userSharedDeck) {
  let replyText = 'Cảm ơn bạn đã nhắn tin! Bạn có thể luyện tập thẻ Anki hoặc thi thử trắc nghiệm 60 câu Vòng 1 bất cứ lúc nào nhé!';
  const lower = (userText || '').toLowerCase();

  if (userSharedDeck) {
    replyText = `Cảm ơn bạn đã chia sẻ bộ thẻ "${userSharedDeck.title}"! Bộ thẻ này rất hữu ích cho các bạn học viên cùng phòng ôn luyện. Chúc bạn học tốt và nhớ sâu nhé! 🌟`;
  } else if (lower.includes('chào') || lower.includes('hello') || lower.includes('hi')) {
    replyText = `Chào ${userSender.name}! Mình có thể giúp gì cho lộ trình ôn thi của bạn hôm nay? Bạn có thể mở mục "Trang Chủ" để thi thử hoặc vào "Phòng Tự Học Ảo" để cày bài cùng mọi người nhé!`;
  } else if (lower.includes('công chức') || lower.includes('luật') || lower.includes('vòng 1')) {
    replyText = `Về kỳ thi Công chức 2026 Vòng 1 Kiến thức chung, bạn nên tập trung vào: Luật Cán bộ, công chức (sửa đổi 2019), Luật Tổ chức Chính phủ, Nghị định 138/2020 và Hiến pháp 2013 nhé! Bạn có thể vào "Phao Cứu Sinh 1 Trang" để xem các mốc thời hạn và số liệu dễ nhầm. 📄`;
  } else if (lower.includes('xu') || lower.includes('nạp') || lower.includes('rút') || lower.includes('tiền')) {
    replyText = `Tỷ giá nạp là 1 Xu = 1.000đ. Bạn có thể bấm vào biểu tượng [🪙 Ví Xu] trên thanh menu trên cùng để tạo lệnh nạp hoặc rút tiền. Hệ thống duyệt tự động chỉ sau 1-2 phút!`;
  } else if (lower.includes('pass') || lower.includes('chợ') || lower.includes('bán')) {
    replyText = `Sau khi học xong một bộ thẻ, bạn có thể vào "Chợ Thẻ C2C" hoặc "Tủ Của Tôi" để Pass lại bộ thẻ nhận Xu về ví, giúp tiết kiệm chi phí cho các bạn học viên khóa sau! 🔁`;
  }

  const botMsg = {
    id: `dm_bot_${Date.now()}`,
    conversationId: getConversationId(userSender.id, ASSISTANT_PARTICIPANT.id),
    sender: ASSISTANT_PARTICIPANT,
    receiver: userSender,
    receiverId: userSender.id,
    text: replyText,
    sharedDeck: null,
    createdAt: new Date().toISOString(),
    isRead: false
  };

  const allMsgs = getAllMessages();
  saveAllMessages([...allMsgs, botMsg]);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('onthi-dm-message-sent', { detail: botMsg }));
  }
}

/**
 * Đánh dấu tất cả tin nhắn trong cuộc hội thoại là đã đọc
 */
export function markConversationAsRead(conversationId, currentUserId) {
  if (!conversationId) return;
  const allMsgs = getAllMessages();
  let changed = false;

  const updated = allMsgs.map((msg) => {
    if (msg.conversationId === conversationId || (conversationId.includes('assistant_onthi') && msg.conversationId === 'conv_assistant_onthi__default_user')) {
      if (msg.receiverId === currentUserId || msg.receiverId === 'default_user' || (msg.receiver && msg.receiver.id === currentUserId)) {
        if (!msg.isRead) {
          changed = true;
          return { ...msg, isRead: true };
        }
      }
    }
    return msg;
  });

  if (changed) {
    saveAllMessages(updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('onthi-dm-read-updated'));
    }
  }
}

/**
 * Tính tổng số tin nhắn chưa đọc của người dùng hiện tại
 */
export function getUnreadDirectMessagesCount(currentUserId) {
  if (!currentUserId) return 0;
  const allMsgs = getAllMessages();
  return allMsgs.filter((msg) => {
    const isReceiver = msg.receiverId === currentUserId || (msg.receiver && msg.receiver.id === currentUserId) || msg.receiverId === 'default_user';
    return isReceiver && !msg.isRead;
  }).length;
}

/**
 * Đăng ký lắng nghe tin nhắn mới theo thời gian thực (Tab Sync + Cloud SSE Relay)
 */
export function subscribeToDirectMessages(currentUserId, onNewMessage) {
  // 1. Lắng nghe CustomEvent cục bộ
  const handleLocal = (e) => {
    if (e.detail && typeof onNewMessage === 'function') {
      onNewMessage(e.detail);
    }
  };
  window.addEventListener('onthi-dm-message-sent', handleLocal);
  window.addEventListener('onthi-dm-read-updated', () => onNewMessage?.(null));

  // 2. Lắng nghe BroadcastChannel (Cross-tab)
  let bc = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      bc = new BroadcastChannel(DM_BROADCAST_CHANNEL);
      bc.onmessage = (event) => {
        if (event.data?.type === 'new_message' && event.data.message) {
          onNewMessage(event.data.message);
        }
      };
    } catch (e) {}
  }

  // 3. Lắng nghe Cloud Relay (SSE via ntfy.sh)
  let es = null;
  try {
    es = new EventSource(`https://ntfy.sh/${DM_CLOUD_RELAY_TOPIC}/sse`);
    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.message) {
          const dm = typeof payload.message === 'string' ? JSON.parse(payload.message) : payload.message;
          if (dm?.type === 'direct_message' && dm.message) {
            const incoming = dm.message;
            // Chỉ nhận nếu tin nhắn gửi cho mình
            if (incoming.receiverId === currentUserId && incoming.sender?.id !== currentUserId) {
              const allMsgs = getAllMessages();
              if (!allMsgs.some((m) => m.id === incoming.id)) {
                saveAllMessages([...allMsgs, incoming]);
                onNewMessage(incoming);
              }
            }
          }
        }
      } catch (err) {}
    };
  } catch (err) {}

  return () => {
    window.removeEventListener('onthi-dm-message-sent', handleLocal);
    if (bc) bc.close();
    if (es) es.close();
  };
}
