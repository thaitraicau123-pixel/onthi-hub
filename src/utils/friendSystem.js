// =========================================================================
// ONTHIHUB FRIEND SYSTEM & SOCIAL STUDY CONNECTIONS
// Quản lý cơ chế Kết bạn, Lời mời kết bạn, Danh sách bạn bè & Gợi ý bạn học
// Tương thích trải nghiệm mạng xã hội hiện đại (Facebook / Zalo / Discord)
// Đồng bộ đa tầng: LocalStorage + Cross-tab Broadcast + Cloud SSE Relay (ntfy.sh)
// =========================================================================

import { ADMIN_EMAIL } from './wallet';
import {
  ADMIN_PARTICIPANT,
  isSameUser,
  matchesUserIdentifier,
  KVDB_BASE_URL,
  isDefaultActiveStudent,
  sendDirectMessage
} from './directMessaging';

export const FRIENDS_STORAGE_KEY = 'onthi_friends_v2';
export const FRIEND_REQUESTS_STORAGE_KEY = 'onthi_friend_requests_v2';
export const FRIEND_BROADCAST_CHANNEL = 'onthi_hub_friends_sync_v2';
export const FRIEND_CLOUD_RELAY_TOPIC = 'onthi_hub_friends_relay_v2';

/**
 * Tạo mã khoá cặp bạn bè duy nhất giữa 2 người (Chuẩn hóa canonical)
 */
export function getFriendPairKey(idA, idB) {
  if (!idA || !idB) return 'pair_default';
  const cleanA = typeof idA === 'object' ? idA.email || idA.id || '' : String(idA);
  const cleanB = typeof idB === 'object' ? idB.email || idB.id || '' : String(idB);
  const sorted = [cleanA.toLowerCase().trim(), cleanB.toLowerCase().trim()].sort();
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
    const seen = new Set();
    const unique = [];
    for (const p of pairs) {
      if (!p || !p.key || seen.has(p.key)) continue;
      seen.add(p.key);
      unique.push(p);
    }
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(unique));
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
    const seen = new Set();
    const unique = [];
    for (const r of requests) {
      if (!r || !r.id || seen.has(r.id)) continue;
      seen.add(r.id);
      unique.push(r);
    }
    localStorage.setItem(FRIEND_REQUESTS_STORAGE_KEY, JSON.stringify(unique));
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

  // 3. Đồng bộ KVDB Edge Singapore
  (async () => {
    try {
      let recent = [];
      try {
        const res = await fetch(`${KVDB_BASE_URL}/index_recent_friends`, { cache: 'no-store' });
        if (res.ok) recent = await res.json();
      } catch (e) {}

      if (!Array.isArray(recent)) recent = [];
      recent.push({ type: 'friend_update', ...payload, time: Date.now() });
      if (recent.length > 50) recent = recent.slice(-50);

      await fetch(`${KVDB_BASE_URL}/index_recent_friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recent)
      });
    } catch (e) {}

    // 4. Dự phòng ntfy nếu khả dụng
    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 2000) : null;
      fetch(`https://ntfy.sh/${FRIEND_CLOUD_RELAY_TOPIC}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'friend_update', ...payload }),
        signal: controller ? controller.signal : undefined
      })
        .catch(() => {})
        .finally(() => {
          if (timeoutId) clearTimeout(timeoutId);
        });
    } catch (e) {}
  })();
}

/**
 * Lấy trạng thái quan hệ bạn bè giữa 2 tài khoản
 * @returns {'admin' | 'self' | 'friends' | 'sent' | 'received' | 'none'}
 */
export function getFriendshipStatus(currentUserId, targetUserId) {
  if (!currentUserId || !targetUserId) return 'none';
  if (isSameUser(currentUserId, targetUserId)) return 'self';

  // Ban Quản Trị OnThiHub luôn luôn kết nối chính thức không cần kết bạn
  if (isSameUser(currentUserId, ADMIN_PARTICIPANT) || isSameUser(targetUserId, ADMIN_PARTICIPANT)) {
    return 'admin';
  }

  const curObj = typeof currentUserId === 'object' ? currentUserId : { id: currentUserId, email: currentUserId };
  const tgtObj = typeof targetUserId === 'object' ? targetUserId : { id: targetUserId, email: targetUserId };

  // 1. Kiểm tra đã là bạn bè chính thức chưa
  const pairs = getAllFriendPairs();
  const pairKey = getFriendPairKey(curObj, tgtObj);
  const isFriend = pairs.some(
    (p) =>
      p.key === pairKey ||
      (isSameUser(p.userA, curObj) && isSameUser(p.userB, tgtObj)) ||
      (isSameUser(p.userB, curObj) && isSameUser(p.userA, tgtObj)) ||
      (p.userAId && matchesUserIdentifier(curObj, p.userAId) && matchesUserIdentifier(tgtObj, p.userBId)) ||
      (p.userBId && matchesUserIdentifier(curObj, p.userBId) && matchesUserIdentifier(tgtObj, p.userAId))
  );

  if (isFriend) return 'friends';

  // 2. Kiểm tra lời mời kết bạn đang chờ (Pending)
  const requests = getAllFriendRequests();

  // Đang gửi lời mời cho đối phương
  const outgoing = requests.find(
    (r) =>
      r.status === 'pending' &&
      (isSameUser(r.sender, curObj) || matchesUserIdentifier(curObj, r.senderId)) &&
      (isSameUser(r.receiver, tgtObj) || matchesUserIdentifier(tgtObj, r.receiverId))
  );
  if (outgoing) return 'sent';

  // Nhận lời mời từ đối phương
  const incoming = requests.find(
    (r) =>
      r.status === 'pending' &&
      (isSameUser(r.sender, tgtObj) || matchesUserIdentifier(tgtObj, r.senderId)) &&
      (isSameUser(r.receiver, curObj) || matchesUserIdentifier(curObj, r.receiverId))
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
  if (!sender || !receiver || isSameUser(sender, receiver)) {
    return { success: false, reason: 'invalid_users' };
  }

  // Không áp dụng kết bạn với Admin (Admin luôn mở chat)
  if (isSameUser(receiver, ADMIN_PARTICIPANT) || isSameUser(sender, ADMIN_PARTICIPANT)) {
    return { success: false, reason: 'admin_bypass' };
  }

  const curStatus = getFriendshipStatus(sender, receiver);
  if (curStatus === 'friends') {
    return { success: false, reason: 'already_friends' };
  }

  // Nếu đối phương đã từng gửi lời mời cho mình -> Tự động chấp nhận ngay lập tức! (Double handshake)
  if (curStatus === 'received') {
    return acceptFriendRequest(sender, receiver);
  }

  // Nếu gửi kết bạn tới các Bạn Học Năng Động trên web -> Tự động đồng ý kết bạn ngay lập tức & gửi lời chào!
  if (isDefaultActiveStudent(receiver)) {
    const res = acceptFriendRequest(receiver, sender);
    try {
      sendDirectMessage({
        sender: receiver,
        receiver: sender,
        text: `🤝 Chào ${sender.name || 'bạn'}! Mình là ${receiver.name} (${receiver.studyGoal || 'Học viên ÔnThiHub'}). Mình đã đồng ý kết bạn rồi, cùng ôn tập và bấm [⚔️ Thách Đấu 1v1] so tài nhé! 🔥`,
        isAutoReply: true
      });
    } catch (e) {}
    return { ...res, autoAccepted: true };
  }

  // Tạo lời mời mới
  const requests = getAllFriendRequests();
  const newReq = {
    id: `freq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    senderId: sender.id || sender.email,
    sender: {
      id: sender.id || sender.email,
      uid: sender.uid || null,
      name: sender.name || (sender.email ? sender.email.split('@')[0] : 'Bạn Học'),
      email: sender.email || `${sender.id}@onthihub.vn`,
      avatar: sender.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(sender.id || 'student')}`,
      role: sender.role || 'student',
      tier: sender.tier || 'free',
      badge: sender.badge || '🎓 Học Viên',
      studyGoal: sender.studyGoal || ''
    },
    receiverId: receiver.id || receiver.email,
    receiver: {
      id: receiver.id || receiver.email,
      uid: receiver.uid || null,
      name: receiver.name || (receiver.email ? receiver.email.split('@')[0] : 'Bạn Học'),
      email: receiver.email || `${receiver.id}@onthihub.vn`,
      avatar: receiver.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(receiver.id || 'student')}`,
      role: receiver.role || 'student',
      tier: receiver.tier || 'free',
      badge: receiver.badge || '🎓 Học Viên',
      studyGoal: receiver.studyGoal || ''
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

  const curObj = typeof currentUserId === 'object' ? currentUserId : { id: currentUserId, email: currentUserId };
  const reqObj = typeof requesterId === 'object' ? requesterId : { id: requesterId, email: requesterId };

  const requests = getAllFriendRequests();
  // Xóa lời mời kết bạn giữa 2 bên
  const updatedRequests = requests.filter(
    (r) =>
      !(
        (isSameUser(r.sender, reqObj) || matchesUserIdentifier(reqObj, r.senderId)) &&
        (isSameUser(r.receiver, curObj) || matchesUserIdentifier(curObj, r.receiverId))
      ) &&
      !(
        (isSameUser(r.sender, curObj) || matchesUserIdentifier(curObj, r.senderId)) &&
        (isSameUser(r.receiver, reqObj) || matchesUserIdentifier(reqObj, r.receiverId))
      )
  );
  saveAllFriendRequests(updatedRequests);

  // Thêm vào danh sách bạn bè chính thức
  const pairs = getAllFriendPairs();
  const pairKey = getFriendPairKey(curObj, reqObj);

  if (!pairs.some((p) => p.key === pairKey)) {
    const newPair = {
      key: pairKey,
      userA: curObj,
      userB: reqObj,
      userAId: curObj.id || curObj.email,
      userBId: reqObj.id || reqObj.email,
      createdAt: new Date().toISOString()
    };
    saveAllFriendPairs([...pairs, newPair]);
  }

  broadcastFriendUpdate({ action: 'request_accepted', userA: curObj, userB: reqObj, pairKey });
  return { success: true };
}

/**
 * Từ chối lời mời kết bạn
 */
export function declineFriendRequest(currentUserId, requesterId) {
  if (!currentUserId || !requesterId) return { success: false };

  const curObj = typeof currentUserId === 'object' ? currentUserId : { id: currentUserId, email: currentUserId };
  const reqObj = typeof requesterId === 'object' ? requesterId : { id: requesterId, email: requesterId };

  const requests = getAllFriendRequests();
  const updated = requests.filter(
    (r) =>
      !(
        (isSameUser(r.sender, reqObj) || matchesUserIdentifier(reqObj, r.senderId)) &&
        (isSameUser(r.receiver, curObj) || matchesUserIdentifier(curObj, r.receiverId))
      )
  );
  saveAllFriendRequests(updated);
  broadcastFriendUpdate({ action: 'request_declined', userA: curObj, userB: reqObj });
  return { success: true };
}

/**
 * Thu hồi lời mời kết bạn đã gửi
 */
export function cancelFriendRequest(currentUserId, targetUserId) {
  if (!currentUserId || !targetUserId) return { success: false };

  const curObj = typeof currentUserId === 'object' ? currentUserId : { id: currentUserId, email: currentUserId };
  const tgtObj = typeof targetUserId === 'object' ? targetUserId : { id: targetUserId, email: targetUserId };

  const requests = getAllFriendRequests();
  const updated = requests.filter(
    (r) =>
      !(
        (isSameUser(r.sender, curObj) || matchesUserIdentifier(curObj, r.senderId)) &&
        (isSameUser(r.receiver, tgtObj) || matchesUserIdentifier(tgtObj, r.receiverId))
      )
  );
  saveAllFriendRequests(updated);
  broadcastFriendUpdate({ action: 'request_cancelled', userA: curObj, userB: tgtObj });
  return { success: true };
}

/**
 * Hủy kết bạn (Unfriend)
 */
export function unfriend(currentUserId, targetUserId) {
  if (!currentUserId || !targetUserId) return { success: false };

  const curObj = typeof currentUserId === 'object' ? currentUserId : { id: currentUserId, email: currentUserId };
  const tgtObj = typeof targetUserId === 'object' ? targetUserId : { id: targetUserId, email: targetUserId };

  const pairs = getAllFriendPairs();
  const pairKey = getFriendPairKey(curObj, tgtObj);
  const updated = pairs.filter(
    (p) =>
      p.key !== pairKey &&
      !(isSameUser(p.userA, curObj) && isSameUser(p.userB, tgtObj)) &&
      !(isSameUser(p.userB, curObj) && isSameUser(p.userA, tgtObj))
  );
  saveAllFriendPairs(updated);
  broadcastFriendUpdate({ action: 'unfriend', userA: curObj, userB: tgtObj, pairKey });
  return { success: true };
}

/**
 * Lấy danh sách các bạn học đã là bạn bè với người dùng
 */
export function getFriendsList(currentUserId, allDirectoryUsers = []) {
  if (!currentUserId) return [];
  const curObj = typeof currentUserId === 'object' ? currentUserId : { id: currentUserId, email: currentUserId };
  const pairs = getAllFriendPairs();

  const friendUserObjects = [];
  pairs.forEach((p) => {
    let partner = null;
    if (isSameUser(p.userA, curObj)) partner = p.userB;
    else if (isSameUser(p.userB, curObj)) partner = p.userA;
    else if (p.userAId && matchesUserIdentifier(curObj, p.userAId)) partner = p.userB || { id: p.userBId, email: p.userBId };
    else if (p.userBId && matchesUserIdentifier(curObj, p.userBId)) partner = p.userA || { id: p.userAId, email: p.userAId };

    if (partner && !isSameUser(partner, curObj) && !isSameUser(partner, ADMIN_PARTICIPANT)) {
      // Tìm thông tin chi tiết nhất trong allDirectoryUsers nếu có
      const matched = allDirectoryUsers.find((u) => isSameUser(u, partner));
      const finalObj = matched || {
        id: partner.id || partner.email,
        name: partner.name || (partner.email ? partner.email.split('@')[0] : 'Bạn Học'),
        email: partner.email || `${partner.id}@onthihub.vn`,
        avatar: partner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(partner.id || 'friend')}`,
        role: partner.role || 'student',
        tier: partner.tier || 'free',
        badge: partner.badge || '🎓 Học Viên',
        studyGoal: partner.studyGoal || ''
      };

      if (!friendUserObjects.some((f) => isSameUser(f, finalObj))) {
        friendUserObjects.push(finalObj);
      }
    }
  });

  return friendUserObjects;
}

/**
 * Lấy danh sách lời mời kết bạn gửi đến người dùng hiện tại
 */
export function getIncomingFriendRequests(currentUserId) {
  if (!currentUserId) return [];
  const curObj = typeof currentUserId === 'object' ? currentUserId : { id: currentUserId, email: currentUserId };
  const requests = getAllFriendRequests();

  return requests.filter(
    (r) =>
      r.status === 'pending' &&
      (isSameUser(r.receiver, curObj) || matchesUserIdentifier(curObj, r.receiverId)) &&
      !isSameUser(r.sender, curObj)
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
  const curObj = typeof currentUserId === 'object' ? currentUserId : { id: currentUserId, email: currentUserId };

  // Tự động nâng cấp các lời mời đã gửi cho Học Viên Năng Động trên web thành Bạn Bè chính thức
  try {
    const pendingReqs = getAllFriendRequests();
    pendingReqs.forEach((r) => {
      if (r.status === 'pending' && isDefaultActiveStudent(r.receiver)) {
        acceptFriendRequest(r.receiver, r.sender);
      }
    });
  } catch (e) {}

  const uniqueMap = new Map();

  allDirectoryUsers.forEach((u) => {
    if (!u || !u.id || isSameUser(u, curObj) || isSameUser(u, ADMIN_PARTICIPANT)) return;
    uniqueMap.set(u.id || u.email, u);
  });

  const list = Array.from(uniqueMap.values());
  const orderWeight = { none: 0, received: 1, sent: 2, friends: 3 };
  return list.sort((a, b) => {
    const stA = getFriendshipStatus(curObj, a);
    const stB = getFriendshipStatus(curObj, b);
    return (orderWeight[stA] ?? 9) - (orderWeight[stB] ?? 9);
  });
}

/**
 * Đồng bộ các lời mời và cặp bạn bè từ Cloud Relay về thiết bị (KVDB Singapore Edge + ntfy fallback)
 */
export async function syncFriendDataFromCloud(currentUserId) {
  if (!currentUserId) return;

  // 1. Đồng bộ qua KVDB Singapore Edge (Ưu tiên số 1)
  try {
    const res = await fetch(`${KVDB_BASE_URL}/index_recent_friends`, { cache: 'no-store' });
    if (res.ok) {
      const recentFriends = await res.json();
      if (Array.isArray(recentFriends) && recentFriends.length > 0) {
        let hasChanges = false;
        const requests = getAllFriendRequests();
        const pairs = getAllFriendPairs();
        const newEventsForMe = [];

        for (const data of recentFriends) {
          if (!data || data.type !== 'friend_update') continue;

          if (data.action === 'request_sent' && data.request) {
            const req = data.request;
            if (!requests.some((r) => r.id === req.id)) {
              requests.push(req);
              hasChanges = true;
              newEventsForMe.push(data);
            }
          } else if (data.action === 'request_accepted' && data.pairKey) {
            if (!pairs.some((p) => p.key === data.pairKey)) {
              pairs.push({
                key: data.pairKey,
                userA: data.userA,
                userB: data.userB,
                userAId: data.userA?.id || data.userA?.email,
                userBId: data.userB?.id || data.userB?.email,
                createdAt: new Date().toISOString()
              });
              hasChanges = true;
              newEventsForMe.push(data);
            }
          }
        }

        if (hasChanges) {
          saveAllFriendRequests(requests);
          saveAllFriendPairs(pairs);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('onthi-friend-updated'));
            newEventsForMe.forEach((evt) => {
              window.dispatchEvent(new CustomEvent('onthi-friend-cloud-received', { detail: evt }));
            });
          }
        }
      }
    }
  } catch (e) {}
}

// Singleton SSE & Poller cho sự kiện bạn bè (Tránh mở nhiều kết nối trùng lặp & tranh chấp LocalStorage)
let sharedFriendEventSource = null;
let sharedFriendSubscriberCount = 0;
let sharedFriendPollerInterval = null;

function ensureSharedFriendConnection(currentUserId) {
  if (typeof window === 'undefined') return;

  // 1. Poller định kỳ qua KVDB Singapore Edge (Mỗi 3s)
  if (!sharedFriendPollerInterval) {
    sharedFriendPollerInterval = setInterval(() => {
      syncFriendDataFromCloud(currentUserId);
    }, 3000);
  }

  // 2. Dự phòng SSE ntfy
  if (typeof EventSource !== 'undefined' && !sharedFriendEventSource) {
    try {
      sharedFriendEventSource = new EventSource(`https://ntfy.sh/${FRIEND_CLOUD_RELAY_TOPIC}/sse`);
      sharedFriendEventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload?.event === 'message' && payload.message) {
            const data = typeof payload.message === 'string' ? JSON.parse(payload.message) : payload.message;
            if (data?.type === 'friend_update') {
              window.dispatchEvent(new CustomEvent('onthi-friend-cloud-received', { detail: data }));
            }
          }
        } catch (err) {}
      };
      sharedFriendEventSource.onerror = () => {};
    } catch (err) {}
  }
}

/**
 * Đăng ký lắng nghe sự kiện bạn bè theo thời gian thực (Tab Sync + KVDB Edge Poller + Cloud SSE)
 */
export function subscribeToFriendEvents(currentUserId, onUpdate) {
  const handleLocalOrCloud = (e) => {
    if (typeof onUpdate === 'function') onUpdate(e.detail);
  };
  window.addEventListener('onthi-friend-updated', handleLocalOrCloud);
  window.addEventListener('onthi-friend-cloud-received', handleLocalOrCloud);

  // 1. Cross-tab BroadcastChannel
  let bc = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      bc = new BroadcastChannel(FRIEND_BROADCAST_CHANNEL);
      bc.onmessage = (event) => {
        if (typeof onUpdate === 'function') onUpdate(event.data);
      };
    } catch (e) {}
  }

  // 2. Tự động đồng bộ lời mời kết bạn ngay khi bắt đầu
  syncFriendDataFromCloud(currentUserId || true);

  // 3. Kích hoạt kết nối Singleton Cloud Relay (KVDB Poller + SSE)
  sharedFriendSubscriberCount++;
  ensureSharedFriendConnection(currentUserId || true);

  return () => {
    window.removeEventListener('onthi-friend-updated', handleLocalOrCloud);
    window.removeEventListener('onthi-friend-cloud-received', handleLocalOrCloud);
    if (bc) bc.close();
    sharedFriendSubscriberCount = Math.max(0, sharedFriendSubscriberCount - 1);
    if (sharedFriendSubscriberCount === 0) {
      if (sharedFriendPollerInterval) {
        clearInterval(sharedFriendPollerInterval);
        sharedFriendPollerInterval = null;
      }
      if (sharedFriendEventSource) {
        sharedFriendEventSource.close();
        sharedFriendEventSource = null;
      }
    }
  };
}
