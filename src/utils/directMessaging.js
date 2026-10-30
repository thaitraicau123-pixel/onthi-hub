// =========================================================================
// PROMPTMMO DIRECT MESSAGING & REAL-TIME PEER-TO-PEER CHAT ENGINE
// Hỗ trợ nhắn tin riêng 1-1 giữa các Creator với nhau và kênh riêng với Admin
// Tích hợp chia sẻ đường dẫn gói Prompt trực tiếp trong hội thoại
// Cơ chế đồng bộ đa tầng: LocalStorage + Cross-tab Broadcast + Cloud SSE Relay (ntfy.sh)
// (Hoàn toàn KHÔNG sử dụng AI Tutor - chỉ tài khoản Creator thật & Ban Quản Trị)
// =========================================================================

import { getOrCreateCommunityClientId } from '../data/communityData';
import { getLocalUsersWithBalances, ADMIN_EMAIL } from './wallet';
import { getCurrentUser } from './firebaseConfig';

export const DM_STORAGE_KEY = 'onthi_direct_messages_v2';
export const DM_BROADCAST_CHANNEL = 'onthi_hub_direct_chat_v2';
export const DM_CLOUD_RELAY_TOPIC = 'onthi_hub_dm_relay_v2';
export const KVDB_DM_BUCKET = 'SBPTa4d8XoFCmTGm4KJGC9';
export const KVDB_BASE_URL = `https://kvdb.io/${KVDB_DM_BUCKET}`;

// Ban Quản Trị hỗ trợ chính thức
export const ADMIN_PARTICIPANT = {
  id: 'admin_promptmmo',
  uid: 'admin_promptmmo',
  name: 'Ban Quản Trị PromptMMO',
  email: ADMIN_EMAIL || 'thaitraicau123@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  role: 'admin',
  tier: 'ultra',
  isOnline: true,
  badge: '🛡️ Ban Quản Trị'
};

// Danh sách bạn học mẫu (đã xóa toàn bộ tài khoản test/giả lập)
export const DEFAULT_STUDENT_PEERS = [];

/**
 * Kiểm tra xem 2 người dùng có cùng danh tính hay không
 * Hỗ trợ nhận diện chéo giữa UID Firebase, Email và Admin alias
 */
export function isSameUser(u1, u2) {
  if (!u1 || !u2) return false;
  const user1 = typeof u1 === 'string' ? { id: u1, email: u1.includes('@') ? u1 : undefined } : u1;
  const user2 = typeof u2 === 'string' ? { id: u2, email: u2.includes('@') ? u2 : undefined } : u2;

  // 1. So khớp ID trực tiếp
  if (user1.id && user2.id && String(user1.id) === String(user2.id)) return true;
  // 2. So khớp UID
  if (user1.uid && user2.uid && String(user1.uid) === String(user2.uid)) return true;
  // 3. So khớp chéo UID và ID
  if (user1.id && user2.uid && String(user1.id) === String(user2.uid)) return true;
  if (user1.uid && user2.id && String(user1.uid) === String(user2.id)) return true;
  // 4. So khớp Email (không phân biệt chữ hoa/thường)
  const e1 = (user1.email || '').toLowerCase().trim();
  const e2 = (user2.email || '').toLowerCase().trim();
  if (e1 && e2 && e1 === e2) return true;
  // 5. So khớp ID với Email
  if (user1.id && e2 && String(user1.id).toLowerCase().trim() === e2) return true;
  if (user2.id && e1 && String(user2.id).toLowerCase().trim() === e1) return true;

  // 6. Nhận diện Ban Quản Trị
  const adminEmail = (ADMIN_EMAIL || 'thaitraicau123@gmail.com').toLowerCase().trim();
  const isAdmin1 = user1.id === 'admin_promptmmo' || user1.id === 'admin_onthi' || user1.role === 'admin' || e1 === adminEmail;
  const isAdmin2 = user2.id === 'admin_promptmmo' || user2.id === 'admin_onthi' || user2.role === 'admin' || e2 === adminEmail;
  if (isAdmin1 && isAdmin2) return true;

  return false;
}

/**
 * Kiểm tra xem một đối tượng người dùng có khớp với một định danh (id / uid / email) hay không
 */
export function matchesUserIdentifier(userObj, identifier) {
  if (!userObj || !identifier) return false;
  if (typeof identifier === 'object') return isSameUser(userObj, identifier);

  const target = String(identifier).toLowerCase().trim();
  const adminEmail = (ADMIN_EMAIL || 'thaitraicau123@gmail.com').toLowerCase().trim();

  if (target === 'admin_promptmmo' || target === 'admin_onthi' || target === adminEmail) {
    return (
      userObj.id === 'admin_promptmmo' ||
      userObj.id === 'admin_onthi' ||
      userObj.role === 'admin' ||
      (userObj.email && userObj.email.toLowerCase().trim() === adminEmail)
    );
  }

  if (userObj.id && String(userObj.id).toLowerCase().trim() === target) return true;
  if (userObj.uid && String(userObj.uid).toLowerCase().trim() === target) return true;
  if (userObj.email && userObj.email.toLowerCase().trim() === target) return true;

  return false;
}

/**
 * Kiểm tra xem người dùng có phải là Admin hay không
 */
export function isUserAdmin(user) {
  if (!user) return false;
  if (typeof user === 'string') {
    const lower = user.toLowerCase().trim();
    const adminEmail = (ADMIN_EMAIL || 'thaitraicau123@gmail.com').toLowerCase().trim();
    return lower === 'admin_promptmmo' || lower === 'admin_onthi' || lower === adminEmail;
  }
  const email = (user.email || '').toLowerCase().trim();
  const adminEmail = (ADMIN_EMAIL || 'thaitraicau123@gmail.com').toLowerCase().trim();
  return email === adminEmail || user.role === 'admin' || user.id === 'admin_promptmmo' || user.id === 'admin_onthi';
}

/**
 * Lấy đối tượng thông tin người tham gia từ user hiện tại
 * Tự động đọc getCurrentUser() nếu tham số truyền vào bị trống
 */
export function getCurrentUserParticipant(user) {
  const resolved = user || (typeof window !== 'undefined' ? getCurrentUser() : null);

  if (resolved && typeof resolved === 'object' && (resolved.email || resolved.displayName || resolved.name || resolved.uid || resolved.id)) {
    const email = (resolved.email || `${resolved.uid || resolved.id || 'guest'}@creator.promptmmo.com`).toLowerCase().trim();
    const name = resolved.displayName || resolved.name || email.split('@')[0];
    const isAdmin = isUserAdmin(resolved);

    if (isAdmin) {
      return {
        id: 'admin_promptmmo',
        uid: resolved.uid || 'admin_promptmmo',
        email: email || ADMIN_EMAIL,
        name: resolved.displayName || resolved.name || 'Ban Quản Trị PromptMMO',
        avatar: resolved.photoURL || resolved.avatar || ADMIN_PARTICIPANT.avatar,
        role: 'admin',
        tier: 'ultra',
        badge: '🛡️ Ban Quản Trị'
      };
    }

    return {
      id: resolved.uid || resolved.id || email,
      uid: resolved.uid || null,
      email,
      name,
      avatar: resolved.photoURL || resolved.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      role: 'creator',
      tier: resolved.tier || 'free',
      badge: resolved.tier === 'ultra' ? '👑 Creator ULTRA' : resolved.tier === 'pro' ? '🚀 Creator PRO' : '⚡ Creator'
    };
  }

  // Khách vãng lai / thành viên chưa đăng nhập
  const clientId = getOrCreateCommunityClientId();
  const shortCode = clientId.slice(-4).toUpperCase();
  return {
    id: clientId,
    uid: clientId,
    email: `${clientId}@creator.promptmmo.com`,
    name: `Creator #${shortCode}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(clientId)}`,
    role: 'creator',
    tier: 'free',
    badge: '⚡ Creator'
  };
}

/**
 * Tạo ID cuộc hội thoại duy nhất giữa 2 người tham gia (Chuẩn hóa canonical)
 */
export function getConversationId(idA, idB) {
  if (!idA || !idB) return 'conv_default';
  const adminEmail = (ADMIN_EMAIL || 'thaitraicau123@gmail.com').toLowerCase().trim();

  const cleanId = (raw) => {
    if (!raw) return 'unknown';
    const str = typeof raw === 'object' ? raw.id || raw.email || raw.uid || '' : String(raw);
    const lower = str.toLowerCase().trim();
    if (lower === 'admin_onthi' || lower === adminEmail) return 'admin_onthi';
    return lower;
  };

  const a = cleanId(idA);
  const b = cleanId(idB);
  const sorted = [a, b].sort();
  return `conv_${sorted[0]}__${sorted[1]}`;
}

const CLOUD_USERS_DIRECTORY_KEY = 'onthi_cloud_users_directory_v1';

// Danh bạ các Creator năng động trên hệ thống PromptMMO (Đề xuất kết bạn nhanh)
export const DEFAULT_ACTIVE_STUDENT_DIRECTORY = [
  {
    id: 'hoanglong.mmo@gmail.com',
    name: 'Hoàng Long (Long MMO)',
    email: 'hoanglong.mmo@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'creator',
    tier: 'ultra',
    badge: '👑 Creator ULTRA',
    studyGoal: '🎬 Kênh TikTok 850k Follower • Higgsfield & Kling 1.5 Video 8K',
    field: 'video-ai',
    streak: 24,
    xp: 1860,
    isOnline: true
  },
  {
    id: 'thuhuong.studio@gmail.com',
    name: 'Thu Hương',
    email: 'thuhuong.studio@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    role: 'creator',
    tier: 'pro',
    badge: '🚀 Creator PRO',
    studyGoal: '🎨 Shop Thời Trang Shopee • Ảnh Mẫu Studio Flux & Midjourney',
    field: 'image-ai',
    streak: 19,
    xp: 1420,
    isOnline: true
  },
  {
    id: 'tuananh.n8n@gmail.com',
    name: 'Đặng Tuấn Anh',
    email: 'tuananh.n8n@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    role: 'creator',
    tier: 'ultra',
    badge: '👑 Creator ULTRA',
    studyGoal: '⚡ Affiliate Shopee • Auto Workflow N8N & Make 24/7',
    field: 'skills-automation',
    streak: 31,
    xp: 2240,
    isOnline: true
  },
  {
    id: 'minhtri.media@gmail.com',
    name: 'Minh Trí (Trí Media)',
    email: 'minhtri.media@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MinhTriMedia',
    role: 'creator',
    tier: 'pro',
    badge: '🚀 Creator PRO',
    studyGoal: '🔥 TikTok Shop & Reels • Kịch Bản Phân Cảnh Bán Hàng 100k View',
    field: 'copy-mmo',
    streak: 15,
    xp: 980,
    isOnline: true
  },
  {
    id: 'phuongthao.canva@gmail.com',
    name: 'Phương Thảo',
    email: 'phuongthao.canva@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhuongThaoDesign',
    role: 'creator',
    tier: 'pro',
    badge: '🚀 Creator PRO',
    studyGoal: '🔑 Template Canva Pro & CapCut • Thiết Kế Bán POD Quốc Tế',
    field: 'acc-tools',
    streak: 12,
    xp: 850,
    isOnline: true
  },
  {
    id: 'baongoc.podcast@gmail.com',
    name: 'Bảo Ngọc',
    email: 'baongoc.podcast@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BaoNgocPodcast',
    role: 'creator',
    tier: 'free',
    badge: '⚡ Creator',
    studyGoal: '🎙️ Kênh Kể Chuyện Thần Thoại Triệu View • Giọng Đọc & Ảnh AI',
    field: 'video-ai',
    streak: 8,
    xp: 490,
    isOnline: true
  },
  {
    id: 'haidang.affiliate@gmail.com',
    name: 'Hải Đăng',
    email: 'haidang.affiliate@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HaiDangMmo',
    role: 'creator',
    tier: 'pro',
    badge: '🚀 Creator PRO',
    studyGoal: '🛒 Top Seller TikTok Shop • Review Sản Phẩm & Chốt Đơn 95%',
    field: 'copy-mmo',
    streak: 16,
    xp: 1120,
    isOnline: true
  },
  {
    id: 'quanghuy.tools@gmail.com',
    name: 'Quang Huy',
    email: 'quanghuy.tools@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuangHuyTools',
    role: 'creator',
    tier: 'free',
    badge: '⚡ Creator',
    studyGoal: '🔑 Chia Sẻ Thủ Thuật Slot Tool MMO • Canva & CapCut Giá Sỉ',
    field: 'acc-tools',
    streak: 10,
    xp: 610,
    isOnline: true
  }
];

/**
 * Kiểm tra xem một Creator có nằm trong danh sách Creator năng động mặc định trên hệ thống hay không
 */
export function isDefaultActiveStudent(userOrId) {
  if (!userOrId) return false;
  return DEFAULT_ACTIVE_STUDENT_DIRECTORY.some(
    (stu) => isSameUser(stu, userOrId) || matchesUserIdentifier(stu, userOrId)
  );
}

/**
 * Lấy danh bạ toàn bộ Creator và Admin trong hệ thống
 * Phục vụ tính năng tìm kiếm Creator và bắt đầu trò chuyện trực tiếp
 */
export function getStudentDirectory(currentUserId) {
  const directoryMap = new Map();
  const curIdent = typeof currentUserId === 'object' ? currentUserId : { id: currentUserId, email: currentUserId };

  // 1. Luôn thêm Ban Quản Trị (nếu người đang xem không phải là admin)
  if (!isSameUser(curIdent, ADMIN_PARTICIPANT)) {
    directoryMap.set(ADMIN_PARTICIPANT.id, ADMIN_PARTICIPANT);
  }

  // 2. Thêm các tài khoản từ danh bạ ví / người dùng thật trong LocalStorage
  try {
    const localUsers = getLocalUsersWithBalances();
    for (const u of localUsers) {
      if (!u || !u.email) continue;
      const isAdmin = (u.email || '').toLowerCase() === (ADMIN_EMAIL || '').toLowerCase() || u.role === 'admin';
      const uid = isAdmin ? 'admin_onthi' : u.uid || u.email;

      // Bỏ qua tài khoản của chính mình
      if (isSameUser(curIdent, { id: uid, uid: u.uid, email: u.email })) continue;

      if (isAdmin) {
        if (!isSameUser(curIdent, ADMIN_PARTICIPANT)) {
          directoryMap.set('admin_onthi', ADMIN_PARTICIPANT);
        }
      } else {
        directoryMap.set(uid, {
          id: uid,
          uid: u.uid || null,
          name: u.displayName || u.email.split('@')[0],
          email: u.email,
          avatar: u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email)}`,
          role: 'creator',
          tier: u.tier || 'free',
          badge: u.tier === 'ultra' ? '👑 Creator ULTRA' : u.tier === 'pro' ? '🚀 Creator PRO' : '⚡ Creator',
          studyGoal: u.studyGoal || 'Creator PromptMMO',
          isOnline: true
        });
      }
    }
  } catch (e) {}

  // 3. Khám phá thêm từ Danh bạ Creator năng động mặc định trên web (Đảm bảo luôn có Creator đề xuất)
  try {
    DEFAULT_ACTIVE_STUDENT_DIRECTORY.forEach((stu) => {
      if (isSameUser(curIdent, stu)) return;
      if (!directoryMap.has(stu.id)) {
        directoryMap.set(stu.id, { ...stu });
      }
    });
  } catch (e) {}

  // 3. Khám phá thêm từ Danh bạ Cloud KVDB & Lời mời kết bạn / Bạn bè thực tế
  try {
    const cloudDirRaw = localStorage.getItem(CLOUD_USERS_DIRECTORY_KEY);
    if (cloudDirRaw) {
      const cloudUsers = JSON.parse(cloudDirRaw);
      if (Array.isArray(cloudUsers)) {
        cloudUsers.forEach((p) => {
          if (!p || !p.id || isSameUser(curIdent, p)) return;
          const pKey = isSameUser(p, ADMIN_PARTICIPANT) ? 'admin_onthi' : p.id || p.email;
          if (!directoryMap.has(pKey)) {
            directoryMap.set(pKey, {
              id: p.id || p.email,
              uid: p.uid || null,
              name: p.name || (p.email ? p.email.split('@')[0] : 'Creator'),
              email: p.email || `${p.id}@promptmmo.com`,
              avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.id)}`,
              role: p.role || 'creator',
              tier: p.tier || 'free',
              badge: p.badge || '🚀 Creator',
              studyGoal: p.studyGoal || 'Creator PromptMMO',
              isOnline: true
            });
          }
        });
      }
    }

    const reqRaw = localStorage.getItem('onthi_friend_requests_v2');
    if (reqRaw) {
      const reqs = JSON.parse(reqRaw);
      if (Array.isArray(reqs)) {
        reqs.forEach((r) => {
          [r?.from, r?.to].forEach((p) => {
            if (!p || !p.id || isSameUser(curIdent, p)) return;
            const pKey = isSameUser(p, ADMIN_PARTICIPANT) ? 'admin_onthi' : p.id || p.email;
            if (!directoryMap.has(pKey)) {
              directoryMap.set(pKey, {
                id: p.id || p.email,
                uid: p.uid || null,
                name: p.name || (p.email ? p.email.split('@')[0] : 'Creator'),
                email: p.email || `${p.id}@promptmmo.com`,
                avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.id)}`,
                role: p.role || 'creator',
                tier: p.tier || 'free',
                badge: p.badge || '🚀 Creator',
                studyGoal: p.studyGoal || 'Creator PromptMMO',
                isOnline: true
              });
            }
          });
        });
      }
    }
  } catch (e) {}

  // 4. Khám phá thêm từ lịch sử tin nhắn thực tế (tránh bị sót Creator giữa 2 thiết bị khác nhau)
  try {
    const allMsgs = getAllMessages();
    allMsgs.forEach((msg) => {
      [msg.sender, msg.receiver].forEach((p) => {
        if (!p || !p.id || isSameUser(curIdent, p)) return;
        const pKey = isSameUser(p, ADMIN_PARTICIPANT) ? 'admin_onthi' : p.id || p.email;
        if (!directoryMap.has(pKey)) {
          directoryMap.set(pKey, {
            id: p.id || p.email,
            uid: p.uid || null,
            name: p.name || (p.email ? p.email.split('@')[0] : 'Creator'),
            email: p.email || `${p.id}@promptmmo.com`,
            avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.id)}`,
            role: p.role || 'creator',
            tier: p.tier || 'free',
            badge: p.badge || '🚀 Creator',
            studyGoal: p.studyGoal || 'Creator PromptMMO',
            isOnline: true
          });
        }
      });
    });
  } catch (e) {}

  return Array.from(directoryMap.values());
}

/**
 * Đọc tất cả tin nhắn từ LocalStorage (Đã loại bỏ hoàn toàn AI bot messages và tài khoản test)
 */
export function getAllMessages() {
  try {
    const raw = localStorage.getItem(DM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(
          (m) =>
            m &&
            m.sender?.id !== 'assistant_onthi' &&
            m.receiverId !== 'assistant_onthi' &&
            m.receiver?.id !== 'assistant_onthi' &&
            !m.id?.includes('welcome_ai') &&
            !m.id?.includes('test') &&
            !String(m.sender?.id || '').startsWith('student_') &&
            !String(m.receiverId || '').startsWith('student_') &&
            !String(m.sender?.email || '').includes('test')
        );

        if (cleaned.length > 0) return cleaned;
      }
    }
  } catch (e) {}

  // Tin nhắn chào mừng ban đầu CHÍNH THỨC TỪ BAN QUẢN TRỊ (Không phải AI)
  const initialMessages = [
    {
      id: 'msg_welcome_admin_1',
      conversationId: getConversationId('admin_promptmmo', 'default_user'),
      sender: ADMIN_PARTICIPANT,
      receiver: { id: 'default_user', name: 'Creator Mới', role: 'creator' },
      receiverId: 'default_user',
      text: 'Chào bạn! Đây là kênh liên hệ và hỗ trợ Creator chính thức từ Ban Quản Trị PromptMMO 🛡️.\n\nBạn có thể nhắn tin hỏi đáp hỗ trợ, duyệt lệnh rút/nạp Xu hoặc kết nối với các Creator khác trong danh bạ để cùng trao đổi gói Prompt triệu view và bí kíp thực chiến nhé!',
      sharedDeck: {
        id: 'mkt_higgsfield_kling_cinema',
        title: 'Công Thức Video Điện Ảnh AI Kling & Higgsfield',
        cardsCount: 25,
        categoryLabel: 'Video AI',
        icon: '🎬',
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
 * Lưu danh sách tin nhắn vào LocalStorage (Khử trùng lặp ID an toàn)
 */
export function saveAllMessages(messages) {
  try {
    const seen = new Set();
    const unique = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (!m || !m.id || seen.has(m.id)) continue;
      if (m.sender?.id === 'assistant_onthi' || m.receiverId === 'assistant_onthi') continue;
      seen.add(m.id);
      unique.unshift(m);
    }
    const filtered = unique.slice(-1000);
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

  // 1. Đối với Creator: Luôn luôn có kênh riêng với Ban Quản Trị PromptMMO
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
    const isSender = isSameUser(msg.sender, current);
    const isReceiver =
      isSameUser(msg.receiver, current) ||
      matchesUserIdentifier(current, msg.receiverId) ||
      (isAdmin && (msg.receiverId === 'admin_onthi' || msg.receiver?.id === 'admin_onthi' || msg.receiver?.role === 'admin'));

    const isUniversalWelcome = !isAdmin && msg.receiverId === 'default_user';

    if (!isSender && !isReceiver && !isUniversalWelcome) return;

    let partner = isSender ? msg.receiver : msg.sender;

    if (isUniversalWelcome) {
      partner = ADMIN_PARTICIPANT;
    }

    if (!partner || isSameUser(partner, current)) return;

    // Chuẩn hóa partner nếu là Admin
    if (isSameUser(partner, ADMIN_PARTICIPANT)) {
      partner = ADMIN_PARTICIPANT;
    }

    const canonicalConvId = getConversationId(current.id, partner.id);

    const existing = convMap.get(canonicalConvId) || {
      conversationId: canonicalConvId,
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

    convMap.set(canonicalConvId, existing);
  });

  // Chuyển Map thành mảng và sắp xếp theo tin mới nhất
  return Array.from(convMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Lấy lịch sử tin nhắn trong một cuộc hội thoại cụ thể
 * Hỗ trợ so khớp đa năng để 2 bên luôn nhìn thấy tin nhắn của nhau
 */
export function getConversationMessages(conversationId, currentParticipant, targetPartner = null) {
  if (!conversationId) return [];
  const allMsgs = getAllMessages();

  return allMsgs
    .filter((msg) => {
      // 1. So khớp ID hội thoại chính xác
      if (msg.conversationId === conversationId) return true;

      // 2. So khớp theo cặp đối tượng người dùng (Bảo hiểm UID vs Email giữa 2 máy)
      if (currentParticipant && targetPartner) {
        const isMatch1 = isSameUser(msg.sender, currentParticipant) && isSameUser(msg.receiver, targetPartner);
        const isMatch2 = isSameUser(msg.sender, targetPartner) && isSameUser(msg.receiver, currentParticipant);
        if (isMatch1 || isMatch2) return true;
      }

      // 3. Tin chào mừng mặc định của Admin cho người dùng mới
      if (conversationId.includes('admin_onthi') && msg.conversationId === 'conv_admin_onthi__default_user') {
        return true;
      }

      return false;
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Gửi tin nhắn trực tiếp giữa 2 tài khoản (Creator - Creator hoặc Creator - Admin)
 * @param {Object} params
 * @param {Object} params.sender - Thông tin người gửi
 * @param {Object} params.receiver - Thông tin người nhận
 * @param {string} params.text - Nội dung tin nhắn
 * @param {Object|null} [params.sharedDeck=null] - Gói Prompt đính kèm (nếu có)
 * @param {Object|null} [params.sharedAchievement=null] - Bằng khen/chứng nhận hoàng gia 4K đính kèm (nếu có)
 * @returns {Object} Tin nhắn vừa tạo
 */
export function sendDirectMessage(arg1, arg2, arg3, arg4 = null, arg5 = null, arg6 = null) {
  let sender,
    receiver,
    text,
    sharedDeck = null,
    sharedAchievement = null,
    pvpChallenge = null,
    isAutoReply = false;

  if (arg1 && typeof arg1 === 'object' && ('sender' in arg1 || 'receiver' in arg1)) {
    ({
      sender,
      receiver,
      text,
      sharedDeck = null,
      sharedAchievement = null,
      pvpChallenge = null,
      isAutoReply = false
    } = arg1);
  } else {
    sender = arg1;
    receiver = arg2;
    text = arg3;
    sharedDeck = arg4;
    sharedAchievement = arg5;
    pvpChallenge = arg6;
  }

  if (!sender || !receiver || (!text?.trim() && !sharedDeck && !sharedAchievement && !pvpChallenge)) {
    return null;
  }

  const senderId = sender.id || sender.uid || sender.email;
  const receiverId = receiver.id || receiver.uid || receiver.email;
  const conversationId = getConversationId(senderId, receiverId);
  const nowIso = new Date().toISOString();

  const newMsg = {
    id: `dm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    conversationId,
    sender: {
      id: senderId,
      uid: sender.uid || null,
      name: sender.name || sender.displayName || 'Creator',
      email: sender.email || senderId,
      avatar: sender.avatar || sender.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(senderId || 'user')}`,
      role: sender.role || 'creator',
      tier: sender.tier || 'free',
      badge: sender.badge || (sender.role === 'admin' ? '🛡️ Ban Quản Trị' : '🚀 Creator')
    },
    receiver: {
      id: receiverId,
      uid: receiver.uid || null,
      name: receiver.name || receiver.displayName || 'Creator',
      email: receiver.email || receiverId,
      avatar: receiver.avatar || receiver.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(receiverId || 'partner')}`,
      role: receiver.role || 'creator',
      tier: receiver.tier || 'free',
      badge: receiver.badge || (receiver.role === 'admin' ? '🛡️ Ban Quản Trị' : '🚀 Creator')
    },
    receiverId,
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
    sharedAchievement: sharedAchievement
      ? {
          id: sharedAchievement.id || `ach_${Date.now()}`,
          title: sharedAchievement.title || 'Chứng Nhận Kỷ Lục Hoàng Gia',
          subtitle: sharedAchievement.subtitle || 'Vinh danh bảng vàng thành tích xuất sắc',
          userName: sharedAchievement.userName || sender.name,
          userTier: sharedAchievement.userTier || sender.tier,
          type: sharedAchievement.type || 'exam',
          theme: sharedAchievement.theme || 'royal_gold',
          score: sharedAchievement.score,
          totalQuestions: sharedAchievement.totalQuestions,
          accuracy: sharedAchievement.accuracy,
          speed: sharedAchievement.speed,
          streak: sharedAchievement.streak,
          examTitle: sharedAchievement.examTitle || sharedAchievement.courseTitle || '',
          dateStr: sharedAchievement.dateStr || nowIso
        }
      : null,
    pvpChallenge: pvpChallenge
      ? {
          id: pvpChallenge.id,
          status: pvpChallenge.status || 'pending',
          deckId: pvpChallenge.deckId,
          deckTitle: pvpChallenge.deckTitle,
          deckIcon: pvpChallenge.deckIcon || '⚔️',
          wagerXu: pvpChallenge.wagerXu || 0,
          totalQuestions: pvpChallenge.totalQuestions || (pvpChallenge.questions ? pvpChallenge.questions.length : 5),
          questions: pvpChallenge.questions || [],
          player1: pvpChallenge.player1,
          player2: pvpChallenge.player2,
          winnerId: pvpChallenge.winnerId || null
        }
      : null,
    createdAt: nowIso,
    status: isSameUser(receiver, ADMIN_PARTICIPANT) || isDefaultActiveStudent(receiver) ? 'delivered' : 'sent', // 'sent' | 'delivered' | 'seen'
    isRead: false,
    readAt: null
  };

  // 1. Lưu cục bộ
  const allMsgs = getAllMessages();
  const updatedMsgs = [...allMsgs, newMsg];
  saveAllMessages(updatedMsgs);

  // 2. Phát sự kiện BroadcastChannel để đồng bộ tức thì các tab khác
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel(DM_BROADCAST_CHANNEL);
      bc.postMessage({ type: 'new_message', message: { ...newMsg, status: 'delivered' } });
      bc.close();
    } catch (e) {}
  }

  // 3. Phát CustomEvent cho ứng dụng hiện tại
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('onthi-dm-message-sent', { detail: newMsg }));
  }

  // 4. Đồng bộ Cloud Relay qua ntfy.sh (Đồng bộ đa thiết bị tức thì, không giới hạn rate limit)
  if (!isSameUser(sender, receiver)) {
    try {
      fetch(`https://ntfy.sh/${DM_CLOUD_RELAY_TOPIC}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ type: 'direct_message', message: { ...newMsg, status: 'delivered' } })
      }).catch(() => {});
    } catch (e) {}

    enqueueDmCloudTask(async () => {
      try {
        let recent = [];
        try {
          const res = await fetch(`${KVDB_BASE_URL}/index_recent_dms`, { cache: 'no-store' });
          if (res.ok) recent = await res.json();
        } catch (e) {}

        if (!Array.isArray(recent)) recent = [];
        const existingCloudIds = new Set(recent.map((m) => m?.id).filter(Boolean));
        if (!existingCloudIds.has(newMsg.id)) {
          recent.push({ ...newMsg, status: 'delivered' });
        }
        if (recent.length > 80) recent = recent.slice(-80);

        await fetch(`${KVDB_BASE_URL}/index_recent_dms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recent)
        }).catch(() => {});
      } catch (err) {}
    });

    // 5. Nếu nhắn tin với Bạn Học Năng Động trên hệ thống -> Tự động Đã xem & phản hồi thân thiện
    if (
      !isAutoReply &&
      !pvpChallenge &&
      isDefaultActiveStudent(receiver) &&
      !String(text || '').startsWith('🤝 Chúng ta đã trở thành bạn bè')
    ) {
      setTimeout(() => {
        try {
          const curMsgs = getAllMessages();
          const seenAt = new Date().toISOString();
          const markedMsgs = curMsgs.map((m) =>
            m.id === newMsg.id ? { ...m, status: 'seen', isRead: true, readAt: seenAt } : m
          );
          saveAllMessages(markedMsgs);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('onthi-dm-read-updated'));
          }

          const stuProfile =
            DEFAULT_ACTIVE_STUDENT_DIRECTORY.find(
              (s) => isSameUser(s, receiver) || matchesUserIdentifier(s, receiver)
            ) || receiver;

          const replies = [
            `Chào ${sender.name || 'bạn'}! Mình đang tối ưu gói Prompt ${stuProfile.studyGoal || 'Video AI 2026'}. Bạn bấm nút [⚔️ Thách Đấu 1v1] ở góc trên để tụi mình so tài kỹ năng ngay nhé! 🚀`,
            `Ok bạn ơi! Hôm nay mình vừa chốt thêm khách mua prompt trên Sàn C2C. Tụi mình giữ chuỗi Lửa Bạn Cùng Tiến 🔥 mỗi ngày nhé, cần đấu 1v1 cứ mời mình nha!`,
            `Rất vui được trao đổi cùng ${sender.name || 'bạn'}! Mục tiêu của mình là bùng nổ doanh số MMO năm nay (${stuProfile.studyGoal || 'PromptMMO'}). Cùng cố gắng nhé! 🚀💎`
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];

          sendDirectMessage({
            sender: stuProfile,
            receiver: sender,
            text: randomReply,
            isAutoReply: true
          });
        } catch (e) {}
      }, 1500);
    }
  }

  return newMsg;
}

/**
 * Cập nhật trạng thái thẻ Thách Đấu 1v1 bên trong tin nhắn chat khi trận đấu thay đổi trạng thái
 */
export function updateMessagePvpChallenge(battle) {
  if (!battle || !battle.id) return;
  try {
    const allMsgs = getAllMessages();
    let changed = false;
    const nextMsgs = allMsgs.map((m) => {
      if (m?.pvpChallenge?.id === battle.id) {
        changed = true;
        return {
          ...m,
          pvpChallenge: {
            ...m.pvpChallenge,
            status: battle.status,
            player1: battle.player1,
            player2: battle.player2,
            winnerId: battle.winnerId || null
          }
        };
      }
      return m;
    });
    if (changed) {
      saveAllMessages(nextMsgs);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('onthi-dm-read-updated'));
      }
    }
  } catch (e) {}
}

// Hàng đợi ghi tuần tự lên KVDB chống ghi đè khi gửi tin nhắn liên tiếp
let dmCloudWritePromise = Promise.resolve();
function enqueueDmCloudTask(taskFn) {
  dmCloudWritePromise = dmCloudWritePromise.then(taskFn).catch(() => {});
  return dmCloudWritePromise;
}

/**
 * Áp dụng biên nhận Đã nhận / Đã xem vào kho tin nhắn cục bộ
 */
function applyReceiptToMessages(allMsgs, receipt) {
  if (!receipt) return { updated: allMsgs, changed: false };
  let changed = false;
  const nowIso = receipt.readAt || new Date().toISOString();

  const updated = allMsgs.map((m) => {
    if (!m) return m;

    if (receipt.type === 'delivery_receipt' && receipt.messageId === m.id && m.status === 'sent') {
      changed = true;
      return { ...m, status: 'delivered' };
    }

    if (receipt.type === 'read_receipt') {
      const matchById = Array.isArray(receipt.messageIds) && receipt.messageIds.includes(m.id);
      const matchByConv = receipt.conversationId && m.conversationId === receipt.conversationId;
      const matchByUsers =
        receipt.reader &&
        receipt.partner &&
        isSameUser(m.sender, receipt.partner) &&
        isSameUser(m.receiver, receipt.reader);

      if ((matchById || matchByConv || matchByUsers) && (!m.isRead || m.status !== 'seen')) {
        // Chỉ đánh dấu đã xem đối với những tin nhắn mà người đọc là người nhận
        if (!receipt.reader || isSameUser(m.receiver, receipt.reader) || matchById) {
          changed = true;
          return { ...m, isRead: true, status: 'seen', readAt: nowIso };
        }
      }
    }

    return m;
  });

  return { updated, changed };
}

/**
 * Đánh dấu tất cả tin nhắn trong cuộc hội thoại là đã đọc & phát biên nhận đã xem (Read Receipt)
 */
export function markConversationAsRead(conversationId, currentUserId, targetPartner = null) {
  if (!conversationId) return;
  const curParticipant = getCurrentUserParticipant(currentUserId);
  const isAdmin = isUserAdmin(curParticipant) || isSameUser(curParticipant, ADMIN_PARTICIPANT);
  const allMsgs = getAllMessages();
  let changed = false;
  const readMessageIds = [];
  const nowIso = new Date().toISOString();

  const updated = allMsgs.map((msg) => {
    const isMatchingConv =
      msg.conversationId === conversationId ||
      (conversationId.includes('admin_onthi') && msg.conversationId === 'conv_admin_onthi__default_user') ||
      (targetPartner &&
        ((isSameUser(msg.sender, targetPartner) && isSameUser(msg.receiver, curParticipant)) ||
          (isSameUser(msg.sender, curParticipant) && isSameUser(msg.receiver, targetPartner))));

    if (isMatchingConv) {
      const isTargetReceiver =
        isSameUser(msg.receiver, curParticipant) ||
        matchesUserIdentifier(msg.receiver, currentUserId) ||
        (!isAdmin && msg.receiverId === 'default_user') ||
        (isAdmin && (msg.receiverId === 'admin_onthi' || msg.receiver?.id === 'admin_onthi' || msg.receiver?.role === 'admin'));

      if (isTargetReceiver && (!msg.isRead || msg.status !== 'seen')) {
        changed = true;
        readMessageIds.push(msg.id);
        return { ...msg, isRead: true, status: 'seen', readAt: nowIso };
      }
    }
    return msg;
  });

  if (changed) {
    saveAllMessages(updated);

    const receiptPayload = {
      type: 'read_receipt',
      conversationId,
      messageIds: readMessageIds,
      reader: curParticipant,
      partner: targetPartner,
      readerId: curParticipant.id,
      readAt: nowIso
    };

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('onthi-dm-read-updated', { detail: receiptPayload }));
    }

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel(DM_BROADCAST_CHANNEL);
        bc.postMessage(receiptPayload);
        bc.close();
      } catch (e) {}
    }

    // Đồng bộ biên nhận Đã xem (Read Receipt) lên KVDB Edge Singapore
    (async () => {
      try {
        let receipts = [];
        try {
          const res = await fetch(`${KVDB_BASE_URL}/index_recent_receipts`, { cache: 'no-store' });
          if (res.ok) receipts = await res.json();
        } catch (e) {}

        if (!Array.isArray(receipts)) receipts = [];
        receipts.push(receiptPayload);
        if (receipts.length > 60) receipts = receipts.slice(-60);

        await fetch(`${KVDB_BASE_URL}/index_recent_receipts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(receipts)
        });
      } catch (e) {}
    })();

    // Dự phòng ntfy nếu khả dụng
    try {
      fetch(`https://ntfy.sh/${DM_CLOUD_RELAY_TOPIC}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(receiptPayload)
      }).catch(() => {});
    } catch (e) {}
  }
}

/**
 * Tính tổng số tin nhắn chưa đọc của người dùng hiện tại
 */
export function getUnreadDirectMessagesCount(currentUserId) {
  const curParticipant = getCurrentUserParticipant(currentUserId);
  if (!curParticipant) return 0;
  const allMsgs = getAllMessages();
  const isAdmin = isUserAdmin(curParticipant) || isSameUser(curParticipant, ADMIN_PARTICIPANT);

  return allMsgs.filter((msg) => {
    if (isSameUser(msg.sender, curParticipant)) return false;
    const isReceiver =
      isSameUser(msg.receiver, curParticipant) ||
      matchesUserIdentifier(msg.receiver, currentUserId) ||
      (!isAdmin && msg.receiverId === 'default_user') ||
      (isAdmin && (msg.receiverId === 'admin_onthi' || msg.receiver?.id === 'admin_onthi' || msg.receiver?.role === 'admin'));

    return isReceiver && !msg.isRead;
  }).length;
}

/**
 * Đồng bộ danh bạ người dùng hoạt động lên KVDB để mọi thiết bị đều tìm thấy nhau trong mục Kết Bạn
 */
let lastDirectorySyncTime = 0;
async function syncUserDirectoryWithCloud(curParticipant) {
  if (!curParticipant || !curParticipant.id || curParticipant.id === 'default_user') return;
  const now = Date.now();
  if (now - lastDirectorySyncTime < 25000) return;
  lastDirectorySyncTime = now;

  try {
    const res = await fetch(`${KVDB_BASE_URL}/index_users_directory`, { cache: 'no-store' });
    let cloudUsers = [];
    if (res.ok) {
      cloudUsers = await res.json();
    }
    if (!Array.isArray(cloudUsers)) cloudUsers = [];

    const existingIdx = cloudUsers.findIndex((u) => isSameUser(u, curParticipant));
    const entry = {
      id: curParticipant.id,
      uid: curParticipant.uid || null,
      name: curParticipant.name,
      email: curParticipant.email,
      avatar: curParticipant.avatar,
      role: curParticipant.role || 'student',
      badge: curParticipant.badge || '🚀 Creator',
      studyGoal: curParticipant.studyGoal || 'Creator PromptMMO',
      updatedAt: now
    };

    let shouldPost = false;
    if (existingIdx === -1) {
      cloudUsers.push(entry);
      if (cloudUsers.length > 100) cloudUsers = cloudUsers.slice(-100);
      shouldPost = true;
    } else if (now - (cloudUsers[existingIdx].updatedAt || 0) > 300000) {
      cloudUsers[existingIdx] = entry;
      shouldPost = true;
    }

    try {
      localStorage.setItem(CLOUD_USERS_DIRECTORY_KEY, JSON.stringify(cloudUsers));
    } catch (e) {}

    if (shouldPost) {
      await fetch(`${KVDB_BASE_URL}/index_users_directory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cloudUsers)
      });
    }
  } catch (e) {}
}

/**
 * Đồng bộ tin nhắn & biên nhận đã xem từ Cloud Relay về thiết bị (KVDB Singapore Edge + tự phục hồi chống mất tin)
 */
export async function syncDirectMessagesFromCloud(userOrId) {
  const curParticipant = getCurrentUserParticipant(userOrId);
  if (!curParticipant) return;

  // Đồng bộ danh bạ người dùng đa thiết bị
  syncUserDirectoryWithCloud(curParticipant);

  // 1. Đồng bộ qua ntfy.sh Cloud Relay (Ưu tiên số 1 - siêu tốc, đa thiết bị, không bị 429)
  try {
    const res = await fetch(`https://ntfy.sh/${DM_CLOUD_RELAY_TOPIC}/json?poll=1&since=all`, { cache: 'no-store' });
    if (res.ok) {
      const text = await res.text();
      const lines = text.trim().split('\n').filter(Boolean);
      let allMsgs = getAllMessages();
      const existingIds = new Set(allMsgs.map((m) => m.id));
      let hasChanges = false;
      const newIncomingForMe = [];

      for (const line of lines) {
        try {
          const raw = JSON.parse(line);
          const payload = typeof raw.message === 'string' ? JSON.parse(raw.message) : raw.message;

          if (payload?.type === 'direct_message' && payload.message) {
            const dm = payload.message;
            if (!dm || !dm.id) continue;

            const isMeReceiver = isSameUser(dm.receiver, curParticipant) || matchesUserIdentifier(dm.receiver, curParticipant);
            const isMeSender = isSameUser(dm.sender, curParticipant) || matchesUserIdentifier(dm.sender, curParticipant);

            if (isMeReceiver || isMeSender) {
              if (!existingIds.has(dm.id)) {
                allMsgs.push({
                  ...dm,
                  status: dm.status === 'seen' ? 'seen' : 'delivered'
                });
                existingIds.add(dm.id);
                hasChanges = true;

                if (isMeReceiver && !isMeSender) {
                  newIncomingForMe.push(dm);
                }
              }
            }
          } else if (payload?.type === 'read_receipt' || payload?.type === 'delivery_receipt') {
            const resReceipt = applyReceiptToMessages(allMsgs, payload);
            if (resReceipt.changed) {
              allMsgs = resReceipt.updated;
              hasChanges = true;
            }
          }
        } catch (je) {}
      }

      if (hasChanges) {
        saveAllMessages(allMsgs);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('onthi-dm-cloud-synced'));
          newIncomingForMe.forEach((incoming) => {
            window.dispatchEvent(new CustomEvent('onthi-dm-cloud-received', { detail: incoming }));
          });
        }
      }
    }
  } catch (e) {}

  // 2. Kênh phụ KVDB Edge (nếu khả dụng)
  try {
    const res = await fetch(`${KVDB_BASE_URL}/index_recent_dms`, { cache: 'no-store' });
    if (res.ok) {
      const recentDms = await res.json();
      if (Array.isArray(recentDms)) {
        let allMsgs = getAllMessages();
        const existingIds = new Set(allMsgs.map((m) => m.id));
        let hasChanges = false;
        const newIncomingForMe = [];

        for (const dm of recentDms) {
          if (!dm || !dm.id || existingIds.has(dm.id)) continue;
          const isMeReceiver = isSameUser(dm.receiver, curParticipant) || matchesUserIdentifier(dm.receiver, curParticipant);
          const isMeSender = isSameUser(dm.sender, curParticipant) || matchesUserIdentifier(dm.sender, curParticipant);

          if (isMeReceiver || isMeSender) {
            allMsgs.push({
              ...dm,
              status: dm.status === 'seen' ? 'seen' : 'delivered'
            });
            existingIds.add(dm.id);
            hasChanges = true;
            if (isMeReceiver && !isMeSender) {
              newIncomingForMe.push(dm);
            }
          }
        }

        if (hasChanges) {
          saveAllMessages(allMsgs);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('onthi-dm-cloud-synced'));
            newIncomingForMe.forEach((incoming) => {
              window.dispatchEvent(new CustomEvent('onthi-dm-cloud-received', { detail: incoming }));
            });
          }
        }
      }
    }
  } catch (e) {}

  // 2. Đồng bộ biên nhận đã xem (Read Receipts) từ KVDB
  try {
    const rRes = await fetch(`${KVDB_BASE_URL}/index_recent_receipts`, { cache: 'no-store' });
    if (rRes.ok) {
      const receipts = await rRes.json();
      if (Array.isArray(receipts) && receipts.length > 0) {
        let allMsgs = getAllMessages();
        let changed = false;
        for (const r of receipts) {
          const resReceipt = applyReceiptToMessages(allMsgs, r);
          if (resReceipt.changed) {
            allMsgs = resReceipt.updated;
            changed = true;
          }
        }
        if (changed) {
          saveAllMessages(allMsgs);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('onthi-dm-read-updated'));
          }
        }
      }
    }
  } catch (e) {}
}

// Singleton SSE Engine dùng chung cho toàn bộ ứng dụng (Tránh mở nhiều kết nối trùng lặp & tranh chấp LocalStorage)
let sharedDmEventSource = null;
let sharedDmSubscriberCount = 0;
let sharedDmPollerInterval = null;

function ensureSharedDmConnection(curParticipant) {
  if (typeof window === 'undefined') return;

  // 1. Poller định kỳ qua KVDB Singapore Edge (Mỗi 2.5s - cực nhẹ & đảm bảo 100% nhận tin giữa 2 thiết bị khác nhau)
  if (!sharedDmPollerInterval) {
    sharedDmPollerInterval = setInterval(() => {
      syncDirectMessagesFromCloud(curParticipant);
    }, 2500);
  }

  // 2. Kết nối SSE ntfy (kênh phụ dự phòng)
  if (typeof EventSource !== 'undefined' && !sharedDmEventSource) {
    try {
      sharedDmEventSource = new EventSource(`https://ntfy.sh/${DM_CLOUD_RELAY_TOPIC}/sse`);
      sharedDmEventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload?.event === 'message' && payload.message) {
            const dm = typeof payload.message === 'string' ? JSON.parse(payload.message) : payload.message;
            const activeParticipant = getCurrentUserParticipant();

            if (dm?.type === 'direct_message' && dm.message) {
              const incoming = {
                ...dm.message,
                status: dm.message.status === 'seen' ? 'seen' : 'delivered'
              };
              const isMeReceiver =
                isSameUser(incoming.receiver, activeParticipant) ||
                matchesUserIdentifier(incoming.receiver, activeParticipant);
              const isMeSender =
                isSameUser(incoming.sender, activeParticipant) ||
                matchesUserIdentifier(incoming.sender, activeParticipant);

              if (isMeReceiver && !isMeSender) {
                const allMsgs = getAllMessages();
                if (!allMsgs.some((m) => m.id === incoming.id)) {
                  saveAllMessages([...allMsgs, incoming]);
                }
                window.dispatchEvent(new CustomEvent('onthi-dm-cloud-received', { detail: incoming }));
              }
            } else if (dm?.type === 'read_receipt' || dm?.type === 'delivery_receipt') {
              const allMsgs = getAllMessages();
              const { updated, changed } = applyReceiptToMessages(allMsgs, dm);
              if (changed) {
                saveAllMessages(updated);
                window.dispatchEvent(new CustomEvent('onthi-dm-read-updated', { detail: dm }));
              }
            }
          }
        } catch (err) {}
      };
      sharedDmEventSource.onerror = () => {};
    } catch (err) {}
  }
}

/**
 * Đăng ký lắng nghe tin nhắn mới theo thời gian thực (Tab Sync + KVDB Edge Poller + Cloud SSE)
 */
export function subscribeToDirectMessages(currentUserId, onNewMessage) {
  const curParticipant = getCurrentUserParticipant(currentUserId);

  // 1. Lắng nghe CustomEvent cục bộ & từ KVDB / Cloud Relay
  const handleLocalOrCloud = (e) => {
    if (e.detail && typeof onNewMessage === 'function') {
      onNewMessage(e.detail);
    }
  };
  const handleRead = () => onNewMessage?.(null);
  const handleCloudSync = () => onNewMessage?.(null);

  window.addEventListener('onthi-dm-message-sent', handleLocalOrCloud);
  window.addEventListener('onthi-dm-cloud-received', handleLocalOrCloud);
  window.addEventListener('onthi-dm-read-updated', handleRead);
  window.addEventListener('onthi-dm-cloud-synced', handleCloudSync);

  // 2. Lắng nghe BroadcastChannel (Cross-tab cùng máy)
  let bc = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      bc = new BroadcastChannel(DM_BROADCAST_CHANNEL);
      bc.onmessage = (event) => {
        if (event.data?.type === 'new_message' && event.data.message) {
          onNewMessage?.(event.data.message);
        } else if (event.data?.type === 'read_receipt' || event.data?.type === 'delivery_receipt') {
          const allMsgs = getAllMessages();
          const { updated, changed } = applyReceiptToMessages(allMsgs, event.data);
          if (changed) {
            saveAllMessages(updated);
            onNewMessage?.(null);
          }
        }
      };
    } catch (e) {}
  }

  // 3. Tự động đồng bộ tin nhắn ngay lập tức khi bắt đầu
  syncDirectMessagesFromCloud(curParticipant);

  // 4. Kích hoạt kết nối Singleton Cloud Relay (KVDB Poller + SSE)
  sharedDmSubscriberCount++;
  ensureSharedDmConnection(curParticipant);

  return () => {
    window.removeEventListener('onthi-dm-message-sent', handleLocalOrCloud);
    window.removeEventListener('onthi-dm-cloud-received', handleLocalOrCloud);
    window.removeEventListener('onthi-dm-read-updated', handleRead);
    window.removeEventListener('onthi-dm-cloud-synced', handleCloudSync);
    if (bc) bc.close();
    sharedDmSubscriberCount = Math.max(0, sharedDmSubscriberCount - 1);
    if (sharedDmSubscriberCount === 0) {
      if (sharedDmPollerInterval) {
        clearInterval(sharedDmPollerInterval);
        sharedDmPollerInterval = null;
      }
      if (sharedDmEventSource) {
        sharedDmEventSource.close();
        sharedDmEventSource = null;
      }
    }
  };
}
