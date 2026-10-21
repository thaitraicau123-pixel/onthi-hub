// =========================================================================
// ONTHIHUB DIRECT MESSAGING & REAL-TIME PEER-TO-PEER CHAT ENGINE
// Hỗ trợ nhắn tin riêng 1-1 giữa các học viên với nhau và kênh riêng với Admin
// Tích hợp chia sẻ đường dẫn bộ thẻ Flashcard trực tiếp trong hội thoại
// (Hoàn toàn KHÔNG sử dụng AI Tutor - chỉ tài khoản học viên thật & Ban Quản Trị)
// =========================================================================

import { getOrCreateCommunityClientId } from '../data/communityData';
import { getLocalUsersWithBalances, ADMIN_EMAIL } from './wallet';

export const DM_STORAGE_KEY = 'onthi_direct_messages_v2';
export const DM_BROADCAST_CHANNEL = 'onthi_hub_direct_chat_v2';
export const DM_CLOUD_RELAY_TOPIC = 'onthi_hub_dm_relay_v2';

// Ban Quản Trị hỗ trợ chính thức
export const ADMIN_PARTICIPANT = {
  id: 'admin_onthi',
  name: 'Ban Quản Trị OnThiHub',
  email: ADMIN_EMAIL || 'thaitraicau123@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  role: 'admin',
  tier: 'ultra',
  isOnline: true,
  badge: '🛡️ Ban Quản Trị'
};

// Danh sách bạn học mẫu uy tín ban đầu khi người dùng mới mở danh bạ
export const DEFAULT_STUDENT_PEERS = [
  {
    id: 'student_minh_nguyen',
    name: 'Nguyễn Văn Minh',
    email: 'minh.nguyen@onthihub.vn',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MinhNguyen99',
    role: 'student',
    tier: 'pro',
    badge: '🎓 Học Viên PRO',
    studyGoal: 'Ôn thi Công chức Vòng 1 • Khối Hành chính',
    isOnline: true
  },
  {
    id: 'student_lan_anh',
    name: 'Trần Lan Anh',
    email: 'lan.anh.thue@onthihub.vn',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LanAnhThue',
    role: 'student',
    tier: 'ultra',
    badge: '👑 Học Viên ULTRA',
    studyGoal: 'Ôn thi Công chức Thuế 2026',
    isOnline: true
  },
  {
    id: 'student_tuan_kiet',
    name: 'Lê Tuấn Kiệt',
    email: 'tuan.kiet.edu@onthihub.vn',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TuanKietEdu',
    role: 'student',
    tier: 'free',
    badge: '🎓 Học Viên',
    studyGoal: 'Ôn thi Viên chức Ngành GD & Y tế',
    isOnline: false
  }
];

/**
 * Kiểm tra xem người dùng có phải là Admin hay không
 */
export function isUserAdmin(user) {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  const adminEmail = (ADMIN_EMAIL || 'thaitraicau123@gmail.com').toLowerCase().trim();
  return email === adminEmail || user.role === 'admin' || user.id === 'admin_onthi';
}

/**
 * Lấy đối tượng thông tin người tham gia từ user hiện tại
 */
export function getCurrentUserParticipant(user) {
  if (user && (user.email || user.displayName || user.uid)) {
    const email = user.email || `${user.uid || 'guest'}@onthihub.vn`;
    const name = user.displayName || email.split('@')[0];
    const isAdmin = isUserAdmin(user);

    if (isAdmin) {
      return {
        id: 'admin_onthi',
        email: email || ADMIN_EMAIL,
        name: user.displayName || 'Ban Quản Trị OnThiHub',
        avatar: user.photoURL || ADMIN_PARTICIPANT.avatar,
        role: 'admin',
        tier: 'ultra',
        badge: '🛡️ Ban Quản Trị'
      };
    }

    return {
      id: user.uid || email,
      email,
      name,
      avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      role: 'student',
      tier: user.tier || 'free',
      badge: user.tier === 'ultra' ? '👑 Học Viên ULTRA' : user.tier === 'pro' ? '🚀 Học Viên PRO' : '🎓 Học Viên'
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
    tier: 'free',
    badge: '🎓 Học Viên'
  };
}

/**
 * Tạo ID cuộc hội thoại duy nhất giữa 2 người tham gia
 */
export function getConversationId(idA, idB) {
  if (!idA || !idB) return 'conv_default';
  const sorted = [String(idA), String(idB)].sort();
  return `conv_${sorted[0]}__${sorted[1]}`;
}

/**
 * Lấy danh bạ toàn bộ học viên và Admin trong hệ thống
 * Phục vụ tính năng tìm kiếm bạn học và bắt đầu trò chuyện trực tiếp
 */
export function getStudentDirectory(currentUserId) {
  const directoryMap = new Map();

  // 1. Luôn thêm Ban Quản Trị (nếu người đang xem không phải là admin)
  if (currentUserId !== 'admin_onthi') {
    directoryMap.set(ADMIN_PARTICIPANT.id, ADMIN_PARTICIPANT);
  }

  // 2. Thêm các tài khoản từ danh bạ ví / người dùng thật trong LocalStorage
  try {
    const localUsers = getLocalUsersWithBalances();
    for (const u of localUsers) {
      if (!u || !u.email) continue;
      const isAdmin = (u.email || '').toLowerCase() === (ADMIN_EMAIL || '').toLowerCase() || u.role === 'admin';
      const uid = isAdmin ? 'admin_onthi' : (u.uid || u.email);

      // Bỏ qua tài khoản của chính mình
      if (uid === currentUserId || u.email === currentUserId) continue;

      if (isAdmin) {
        if (currentUserId !== 'admin_onthi') {
          directoryMap.set('admin_onthi', ADMIN_PARTICIPANT);
        }
      } else {
        directoryMap.set(uid, {
          id: uid,
          name: u.displayName || u.email.split('@')[0],
          email: u.email,
          avatar: u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email)}`,
          role: 'student',
          tier: u.tier || 'free',
          badge: u.tier === 'ultra' ? '👑 Học Viên ULTRA' : u.tier === 'pro' ? '🚀 Học Viên PRO' : '🎓 Học Viên',
          studyGoal: u.studyGoal || 'Học viên OnThiHub',
          isOnline: true
        });
      }
    }
  } catch (e) {}

  // 3. Bổ sung các bạn học tiêu biểu nếu danh bạ trống
  DEFAULT_STUDENT_PEERS.forEach((peer) => {
    if (peer.id !== currentUserId && !directoryMap.has(peer.id)) {
      directoryMap.set(peer.id, peer);
    }
  });

  return Array.from(directoryMap.values());
}

/**
 * Đọc tất cả tin nhắn từ LocalStorage (Đã loại bỏ hoàn toàn AI bot messages)
 */
export function getAllMessages() {
  try {
    const raw = localStorage.getItem(DM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Lọc sạch mọi tin nhắn từ/gửi cho AI tutor cũ nếu còn sót lại trong cache
        const cleaned = parsed.filter(
          (m) =>
            m &&
            m.sender?.id !== 'assistant_onthi' &&
            m.receiverId !== 'assistant_onthi' &&
            m.receiver?.id !== 'assistant_onthi' &&
            !m.id?.includes('welcome_ai')
        );

        if (cleaned.length > 0) return cleaned;
      }
    }
  } catch (e) {}

  // Tin nhắn chào mừng ban đầu CHÍNH THỨC TỪ BAN QUẢN TRỊ (Không phải AI)
  const initialMessages = [
    {
      id: 'msg_welcome_admin_1',
      conversationId: getConversationId('admin_onthi', 'default_user'),
      sender: ADMIN_PARTICIPANT,
      receiver: { id: 'default_user', name: 'Học Viên Mới', role: 'student' },
      receiverId: 'default_user',
      text: 'Chào bạn! Đây là kênh liên hệ và hỗ trợ học viên chính thức từ Ban Quản Trị OnThiHub 🛡️.\n\nBạn có thể nhắn tin hỏi đáp hỗ trợ, báo lỗi hoặc kết nối với các bạn học viên khác trong danh bạ để cùng trao đổi tài liệu và bộ thẻ Flashcard nhé!',
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
    // Luôn lọc bỏ tin nhắn AI tutor trước khi lưu
    const filtered = messages
      .filter((m) => m && m.sender?.id !== 'assistant_onthi' && m.receiverId !== 'assistant_onthi')
      .slice(-500);
    localStorage.setItem(DM_STORAGE_KEY, JSON.stringify(filtered));
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
  const isAdmin = current.role === 'admin' || current.id === 'admin_onthi';

  // 1. Đối với học viên: Luôn luôn có kênh riêng với Ban Quản Trị OnThiHub
  const adminConvId = getConversationId(current.id, ADMIN_PARTICIPANT.id);
  if (!isAdmin) {
    convMap.set(adminConvId, {
      conversationId: adminConvId,
      partner: ADMIN_PARTICIPANT,
      lastMessage: null,
      unreadCount: 0,
      updatedAt: 0
    });
  }

  // 2. Quét qua lịch sử tin nhắn để tổng hợp các cuộc trò chuyện thực tế
  allMsgs.forEach((msg) => {
    const isSender = msg.sender?.id === current.id;
    const isReceiver =
      msg.receiverId === current.id ||
      (msg.receiver && msg.receiver.id === current.id) ||
      (isAdmin && (msg.receiverId === 'admin_onthi' || msg.receiver?.id === 'admin_onthi'));

    const isUniversalWelcome = !isAdmin && msg.receiverId === 'default_user';

    if (!isSender && !isReceiver && !isUniversalWelcome) return;

    let convId = msg.conversationId;
    let partner = isSender ? msg.receiver : msg.sender;

    if (isUniversalWelcome) {
      convId = adminConvId;
      partner = ADMIN_PARTICIPANT;
    }

    if (!partner || partner.id === current.id) return;

    // Chuẩn hóa partner nếu là Admin
    if (partner.id === 'admin_onthi' || partner.role === 'admin') {
      partner = ADMIN_PARTICIPANT;
    }

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

  return allMsgs
    .filter((msg) => {
      if (msg.conversationId === conversationId) return true;
      // Hiển thị tin chào mừng mặc định của Admin cho người dùng mới
      if (conversationId.includes('admin_onthi') && msg.conversationId === 'conv_admin_onthi__default_user') {
        return true;
      }
      return false;
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Gửi tin nhắn trực tiếp giữa 2 tài khoản (Học viên - Học viên hoặc Học viên - Admin)
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
      tier: sender.tier || 'free',
      badge: sender.badge || (sender.role === 'admin' ? '🛡️ Ban Quản Trị' : '🎓 Học Viên')
    },
    receiver: {
      id: receiver.id,
      name: receiver.name,
      email: receiver.email,
      avatar: receiver.avatar,
      role: receiver.role || 'student',
      tier: receiver.tier || 'free',
      badge: receiver.badge || (receiver.role === 'admin' ? '🛡️ Ban Quản Trị' : '🎓 Học Viên')
    },
    receiverId: receiver.id,
    text: (text || '').trim(),
    sharedDeck: sharedDeck
      ? {
          id: sharedDeck.id,
          title: sharedDeck.title,
          cardsCount:
            sharedDeck.cardsCount ||
            (sharedDeck.cards ? sharedDeck.cards.length : sharedDeck.previewCards ? sharedDeck.previewCards.length : 0),
          categoryLabel: sharedDeck.categoryLabel || 'Kiến Thức',
          icon: sharedDeck.icon || '📚',
          priceXu: sharedDeck.priceXu !== undefined ? sharedDeck.priceXu : 0
        }
      : null,
    createdAt: nowIso,
    isRead: false
  };

  // 1. Lưu cục bộ
  const allMsgs = getAllMessages();
  const updatedMsgs = [...allMsgs, newMsg];
  saveAllMessages(updatedMsgs);

  // 2. Phát sự kiện BroadcastChannel để đồng bộ tức thì các tab khác
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
  if (receiver.id !== sender.id) {
    try {
      fetch(`https://ntfy.sh/${DM_CLOUD_RELAY_TOPIC}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ type: 'direct_message', message: newMsg })
      }).catch(() => {});
    } catch (e) {}
  }

  return newMsg;
}

/**
 * Đánh dấu tất cả tin nhắn trong cuộc hội thoại là đã đọc
 */
export function markConversationAsRead(conversationId, currentUserId) {
  if (!conversationId) return;
  const allMsgs = getAllMessages();
  let changed = false;

  const updated = allMsgs.map((msg) => {
    const isMatchingConv =
      msg.conversationId === conversationId ||
      (conversationId.includes('admin_onthi') && msg.conversationId === 'conv_admin_onthi__default_user');

    if (isMatchingConv) {
      const isTargetReceiver =
        msg.receiverId === currentUserId ||
        msg.receiverId === 'default_user' ||
        (msg.receiver && msg.receiver.id === currentUserId) ||
        (currentUserId === 'admin_onthi' && (msg.receiverId === 'admin_onthi' || msg.receiver?.id === 'admin_onthi'));

      if (isTargetReceiver && !msg.isRead) {
        changed = true;
        return { ...msg, isRead: true };
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
  const isAdmin = currentUserId === 'admin_onthi';

  return allMsgs.filter((msg) => {
    const isReceiver =
      msg.receiverId === currentUserId ||
      (msg.receiver && msg.receiver.id === currentUserId) ||
      (!isAdmin && msg.receiverId === 'default_user') ||
      (isAdmin && (msg.receiverId === 'admin_onthi' || msg.receiver?.id === 'admin_onthi'));

    return isReceiver && !msg.isRead;
  }).length;
}

/**
 * Đăng ký lắng nghe tin nhắn mới theo thời gian thực (Tab Sync + Cloud SSE Relay)
 */
export function subscribeToDirectMessages(currentUserId, onNewMessage) {
  const isAdmin = currentUserId === 'admin_onthi';

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
            const isMeReceiver =
              incoming.receiverId === currentUserId ||
              (isAdmin && incoming.receiverId === 'admin_onthi');

            if (isMeReceiver && incoming.sender?.id !== currentUserId) {
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
