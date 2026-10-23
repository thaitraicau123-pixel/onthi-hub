// =========================================================================
// ONTHIHUB FRIEND SYSTEM & SOCIAL STUDY CONNECTIONS
// Quản lý cơ chế Kết bạn, Lời mời kết bạn, Danh sách bạn bè & Gợi ý bạn học
// Tương thích trải nghiệm mạng xã hội hiện đại (Facebook / Zalo / Discord)
// =========================================================================

import { ADMIN_EMAIL } from './wallet';
import { ADMIN_PARTICIPANT } from './directMessaging';

export const FRIENDS_STORAGE_KEY = 'onthi_friends_v2';
export const FRIEND_REQUESTS_STORAGE_KEY = 'onthi_friend_requests_v2';
export const FRIEND_BROADCAST_CHANNEL = 'onthi_hub_friends_sync_v2';
export const FRIEND_CLOUD_RELAY_TOPIC = 'onthi_hub_friends_relay_v2';

/**
 * Tạo mã khoá cặp bạn bè duy nhất giữa 2 người
 */
export function getFriendPairKey(idA, idB) {
  if (!idA || !idB) return 'pair_default';
  const sorted = [String(idA), String(idB)].sort();
  return `friend_${sorted[0]}__${sorted[1]}`;
}

/**
 * Đọc tất cả các cặp bạn bè đã kết nối (Đã loại bỏ dữ liệu test/mẫu)
 */
export function getAllFriendPairs() {
  try {
    const raw = localStorage.getItem(FRIENDS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Lọc sạch bất kỳ cặp bạn bè test/mẫu nào
        const cleaned = parsed.filter(
          (p) =>
            p &&
            !String(p.userAId || '').startsWith('student_') &&
            !String(p.userBId || '').startsWith('student_') &&
            !String(p.userAId || '').includes('test') &&
            !String(p.userBId || '').includes('test')
        );
        if (cleaned.length !== parsed.length) {
          saveAllFriendPairs(cleaned);
        }
        return cleaned;
      }
    }
  } catch (e) {}

  return [];
}

/**
 * Lưu danh sách các cặp bạn bè
 */
function saveAllFriendPairs(pairs) {
  try {
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(pairs));
  } catch (e) {}
}

/**
 * Đọc tất cả lời mời kết bạn (Đã loại bỏ dữ liệu test/mẫu)
 */
export function getAllFriendRequests() {
  try {
    const raw = localStorage.getItem(FRIEND_REQUESTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Lọc sạch lời mời kết bạn test/mẫu
        const cleaned = parsed.filter(
          (r) =>
            r &&
            !String(r.id || '').includes('init') &&
            !String(r.senderId || '').startsWith('student_') &&
            !String(r.receiverId || '').startsWith('student_') &&
            !String(r.sender?.email || '').includes('test')
        );
        if (cleaned.length !== parsed.length) {
          saveAllFriendRequests(cleaned);
        }
        return cleaned;
      }
    }
  } catch (e) {}

  return [];
}

/**
 * Lưu danh sách lời mời kết bạn
 */
function saveAllFriendRequests(requests) {
  try {
    localStorage.setItem(FRIEND_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {}
}

/**
 * Phát sự kiện cập nhật hệ thống bạn bè tới các tab và ứng dụng
 */
function broadcastFriendUpdate(payload = {}) {
  // 1. Cục bộ
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('onthi-friend-updated', { detail: payload }));
  }

  // 2. Cross-tab BroadcastChannel
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel(FRIEND_BROADCAST_CHANNEL);
      bc.postMessage({ type: 'friend_update', ...payload });
      bc.close();
    } catch (e) {}
  }

  // 3. Cloud Relay
  try {
    fetch(`https://ntfy.sh/${FRIEND_CLOUD_RELAY_TOPIC}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'friend_update', ...payload })
    }).catch(() => {});
  } catch (e) {}
}

/**
 * Lấy trạng thái quan hệ bạn bè giữa 2 tài khoản
 * @returns {'admin' | 'self' | 'friends' | 'sent' | 'received' | 'none'}
 */
export function getFriendshipStatus(currentUserId, targetUserId) {
  if (!currentUserId || !targetUserId) return 'none';
  if (currentUserId === targetUserId) return 'self';

  // Ban Quản Trị OnThiHub luôn luôn kết nối chính thức không cần kết bạn
  if (
    currentUserId === 'admin_onthi' ||
    targetUserId === 'admin_onthi' ||
    targetUserId === ADMIN_PARTICIPANT.id ||
    targetUserId === ADMIN_EMAIL
  ) {
    return 'admin';
  }

  const curId = String(currentUserId);
  const tgtId = String(targetUserId);

  // 1. Kiểm tra đã là bạn bè chính thức chưa
  const pairs = getAllFriendPairs();
  const pairKey = getFriendPairKey(curId, tgtId);
  const isFriend = pairs.some(
    (p) =>
      p.key === pairKey ||
      (p.userAId === curId && p.userBId === tgtId) ||
      (p.userBId === curId && p.userAId === tgtId) ||
      ((curId === 'default_user' || tgtId === 'default_user') && p.key.includes(tgtId))
  );

  if (isFriend) return 'friends';

  // 2. Kiểm tra lời mời kết bạn đang chờ (Pending)
  const requests = getAllFriendRequests();

  // Đang gửi lời mời cho đối phương
  const outgoing = requests.find(
    (r) =>
      r.status === 'pending' &&
      r.senderId === curId &&
      (r.receiverId === tgtId || (r.receiver && r.receiver.id === tgtId))
  );
  if (outgoing) return 'sent';

  // Nhận lời mời từ đối phương
  const incoming = requests.find(
    (r) =>
      r.status === 'pending' &&
      (r.senderId === tgtId || (r.sender && r.sender.id === tgtId)) &&
      (r.receiverId === curId || r.receiverId === 'default_user' || (r.receiver && r.receiver.id === curId))
  );
  if (incoming) return 'received';

  return 'none';
}

/**
 * Gửi lời mời kết bạn (hoặc tự động kết bạn nếu đối phương cũng đã gửi lời mời)
 * @param {Object} params
 * @param {Object} params.sender - Thông tin người gửi
 * @param {Object} params.receiver - Thông tin người nhận
 * @param {string} [params.message] - Lời nhắn làm quen
 */
export function sendFriendRequest({ sender, receiver, message = '' }) {
  if (!sender || !receiver || sender.id === receiver.id) {
    return { success: false, reason: 'invalid_users' };
  }

  // Không áp dụng kết bạn với Admin (Admin luôn mở chat)
  if (receiver.id === 'admin_onthi' || sender.id === 'admin_onthi') {
    return { success: false, reason: 'admin_bypass' };
  }

  const curStatus = getFriendshipStatus(sender.id, receiver.id);
  if (curStatus === 'friends') {
    return { success: false, reason: 'already_friends' };
  }

  // Nếu đối phương đã từng gửi lời mời cho mình -> Tự động chấp nhận ngay lập tức! (Double handshake)
  if (curStatus === 'received') {
    return acceptFriendRequest(sender.id, receiver.id);
  }

  // Tạo lời mời mới
  const requests = getAllFriendRequests();
  const newReq = {
    id: `freq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    senderId: sender.id,
    sender: {
      id: sender.id,
      name: sender.name,
      email: sender.email,
      avatar: sender.avatar,
      role: sender.role || 'student',
      tier: sender.tier || 'free',
      badge: sender.badge || '🎓 Học Viên',
      studyGoal: sender.studyGoal || ''
    },
    receiverId: receiver.id,
    receiver: {
      id: receiver.id,
      name: receiver.name,
      email: receiver.email,
      avatar: receiver.avatar,
      role: receiver.role || 'student',
      tier: receiver.tier || 'free',
      badge: receiver.badge || '🎓 Học Viên'
    },
    message: (message || '').trim() || 'Chào bạn! Mình muốn kết bạn cùng ôn thi trên OnThiHub nhé! 📚',
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  saveAllFriendRequests([...requests, newReq]);
  broadcastFriendUpdate({ action: 'request_sent', request: newReq });

  return { success: true, request: newReq };
}

/**
 * Chấp nhận lời mời kết bạn
 */
export function acceptFriendRequest(currentUserId, requesterId) {
  if (!currentUserId || !requesterId) return { success: false };

  const requests = getAllFriendRequests();
  // Xóa hoặc chuyển trạng thái lời mời
  const updatedRequests = requests.filter(
    (r) =>
      !(
        (r.senderId === requesterId || r.sender?.id === requesterId) &&
        (r.receiverId === currentUserId || r.receiverId === 'default_user' || r.receiver?.id === currentUserId)
      ) &&
      !(
        (r.senderId === currentUserId || r.sender?.id === currentUserId) &&
        (r.receiverId === requesterId || r.receiver?.id === requesterId)
      )
  );
  saveAllFriendRequests(updatedRequests);

  // Thêm vào danh sách bạn bè chính thức
  const pairs = getAllFriendPairs();
  const pairKey = getFriendPairKey(currentUserId, requesterId);

  if (!pairs.some((p) => p.key === pairKey)) {
    const newPair = {
      key: pairKey,
      userAId: currentUserId,
      userBId: requesterId,
      createdAt: new Date().toISOString()
    };
    saveAllFriendPairs([...pairs, newPair]);
  }

  broadcastFriendUpdate({ action: 'request_accepted', userAId: currentUserId, userBId: requesterId });
  return { success: true };
}

/**
 * Từ chối lời mời kết bạn
 */
export function declineFriendRequest(currentUserId, requesterId) {
  if (!currentUserId || !requesterId) return { success: false };

  const requests = getAllFriendRequests();
  const updated = requests.filter(
    (r) =>
      !(
        (r.senderId === requesterId || r.sender?.id === requesterId) &&
        (r.receiverId === currentUserId || r.receiverId === 'default_user' || r.receiver?.id === currentUserId)
      )
  );
  saveAllFriendRequests(updated);
  broadcastFriendUpdate({ action: 'request_declined', userAId: currentUserId, userBId: requesterId });
  return { success: true };
}

/**
 * Thu hồi lời mời kết bạn đã gửi
 */
export function cancelFriendRequest(currentUserId, targetUserId) {
  if (!currentUserId || !targetUserId) return { success: false };

  const requests = getAllFriendRequests();
  const updated = requests.filter(
    (r) =>
      !(
        (r.senderId === currentUserId || r.sender?.id === currentUserId) &&
        (r.receiverId === targetUserId || r.receiver?.id === targetUserId)
      )
  );
  saveAllFriendRequests(updated);
  broadcastFriendUpdate({ action: 'request_cancelled', userAId: currentUserId, userBId: targetUserId });
  return { success: true };
}

/**
 * Hủy kết bạn (Unfriend)
 */
export function unfriend(currentUserId, targetUserId) {
  if (!currentUserId || !targetUserId) return { success: false };

  const pairs = getAllFriendPairs();
  const pairKey = getFriendPairKey(currentUserId, targetUserId);
  const updated = pairs.filter(
    (p) =>
      p.key !== pairKey &&
      !(p.userAId === currentUserId && p.userBId === targetUserId) &&
      !(p.userBId === currentUserId && p.userAId === targetUserId)
  );
  saveAllFriendPairs(updated);
  broadcastFriendUpdate({ action: 'unfriend', userAId: currentUserId, userBId: targetUserId });
  return { success: true };
}

/**
 * Lấy danh sách các bạn học đã là bạn bè với người dùng
 */
export function getFriendsList(currentUserId, allDirectoryUsers = []) {
  if (!currentUserId) return [];
  const curId = String(currentUserId);
  const pairs = getAllFriendPairs();

  const friendIds = new Set();
  pairs.forEach((p) => {
    if (p.userAId === curId) friendIds.add(p.userBId);
    else if (p.userBId === curId) friendIds.add(p.userAId);
    else if (curId === 'default_user') {
      if (p.userAId === 'default_user') friendIds.add(p.userBId);
      if (p.userBId === 'default_user') friendIds.add(p.userAId);
    }
  });

  // Khớp với thông tin người dùng trong danh bạ thực tế
  const result = [];
  friendIds.forEach((fId) => {
    if (fId === curId || fId === 'admin_onthi') return;
    const found = allDirectoryUsers.find((u) => u.id === fId || u.email === fId);
    if (found) {
      if (!result.some((r) => r.id === found.id)) {
        result.push(found);
      }
    }
  });

  return result;
}

/**
 * Lấy danh sách lời mời kết bạn gửi đến người dùng hiện tại
 */
export function getIncomingFriendRequests(currentUserId) {
  if (!currentUserId) return [];
  const curId = String(currentUserId);
  const requests = getAllFriendRequests();

  return requests.filter(
    (r) =>
      r.status === 'pending' &&
      (r.receiverId === curId || r.receiverId === 'default_user' || (r.receiver && r.receiver.id === curId)) &&
      r.senderId !== curId
  );
}

/**
 * Đếm số lượng lời mời kết bạn chưa xử lý
 */
export function getIncomingRequestsCount(currentUserId) {
  return getIncomingFriendRequests(currentUserId).length;
}

/**
 * Lấy danh sách gợi ý bạn học (Những học viên chưa kết bạn và chưa gửi lời mời)
 */
export function getSuggestedFriends(currentUserId, allDirectoryUsers = []) {
  if (!currentUserId) return [];
  const curId = String(currentUserId);
  const uniqueMap = new Map();

  allDirectoryUsers.forEach((u) => {
    if (!u || !u.id || u.id === curId || u.id === 'admin_onthi' || u.role === 'admin') return;
    const status = getFriendshipStatus(curId, u.id);
    if (status === 'none') {
      uniqueMap.set(u.id, u);
    }
  });

  return Array.from(uniqueMap.values());
}

/**
 * Đăng ký lắng nghe sự kiện bạn bè theo thời gian thực
 */
export function subscribeToFriendEvents(currentUserId, onUpdate) {
  const handleLocal = (e) => {
    if (typeof onUpdate === 'function') onUpdate(e.detail);
  };
  window.addEventListener('onthi-friend-updated', handleLocal);

  let bc = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      bc = new BroadcastChannel(FRIEND_BROADCAST_CHANNEL);
      bc.onmessage = (event) => {
        if (typeof onUpdate === 'function') onUpdate(event.data);
      };
    } catch (e) {}
  }

  return () => {
    window.removeEventListener('onthi-friend-updated', handleLocal);
    if (bc) bc.close();
  };
}
