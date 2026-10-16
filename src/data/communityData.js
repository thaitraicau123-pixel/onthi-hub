import { getFirestoreDb, collection, doc, setDoc, onSnapshot, query, getDocs, deleteDoc } from '../utils/firebaseConfig.js';

const COMMUNITY_STORAGE_KEY = 'onthi_community_posts_v2';
export const DELETED_POSTS_STORAGE_KEY = 'onthi_deleted_community_posts_v1';
const CLOUD_COMMUNITY_TOPIC = 'onthi_hub_community_v2';

export const INITIAL_COMMUNITY_POSTS = [
  {
    id: 'post_init_1',
    author: 'Nguyễn Văn Hùng',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'Đỗ Thủ Khoa Khối Sở 2025',
    category: 'cong-chuc',
    categoryLabel: '🏛️ Công Chức',
    isPinned: true,
    time: '2 giờ trước',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    content: 'Kinh nghiệm thi đỗ Vòng 1 Công Chức 54/60 câu: Tuyệt đối không học thuộc lòng từng từ trong Luật! Hãy dùng bộ thẻ Anki để nhớ các "con số then chốt": thời hạn kỷ luật 2 năm / 5 năm, thời gian tập sự 12 tháng, cơ cấu đại biểu Quốc hội. Nhìn đáp án là khoanh được ngay trong 3 giây. Ai cần file tóm tắt cứ comment mình gửi nhé!',
    likes: 128,
    comments: [
      { author: 'Trần Thảo', text: 'Cảm ơn anh nhiều ạ, em đang cày Luật Cán bộ công chức mà hay bị lú mấy con số thời hạn quá!' },
      { author: 'Lê Minh', text: 'Cho em xin file tóm tắt qua email với ạ: leminh99@gmail.com' }
    ]
  },
  {
    id: 'post_init_2',
    author: 'Trần Minh Tuấn',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    role: 'Senior Dev tại FPT Software',
    category: 'it',
    categoryLabel: '💻 IT & Tech',
    isPinned: false,
    time: '5 giờ trước',
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    content: 'Vừa hoàn thành vòng phỏng vấn Technical System Design chiều nay: Người ta hỏi rất sâu về Cache Stampede (Thundering herd) và Distributed Lock dùng Redis Redlock. May mà hôm trước vừa ôn trọn bộ thẻ Backend Master trên ÔnThiHub, trả lời mạch lạc nên được sếp khen ngay tại chỗ!',
    likes: 94,
    comments: [
      { author: 'Hoàng Long', text: 'Phần Redis Redlock xử lý clock drift thế nào anh nhỉ?' }
    ]
  },
  {
    id: 'post_init_3',
    author: 'Lê Thuỳ Linh',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    role: 'IELTS 8.0 Overall',
    category: 'ngoai-ngu',
    categoryLabel: '🌍 Ngoại Ngữ',
    isPinned: false,
    time: 'Hôm qua',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    content: 'Mẹo học từ vựng IELTS C1/C2 không bao giờ quên: Đừng học từ đơn lẻ! Luôn học cả cụm Collocation (ví dụ: "exacerbate the environmental crisis" thay vì chỉ học mỗi "exacerbate"). Bộ thẻ 1200 từ vựng trên web có sẵn âm thanh phát âm bản xứ, mình vừa chạy bộ vừa nghe ngấm cực kỳ tiện.',
    likes: 76,
    comments: []
  }
];

// Helper to remove undefined fields for Firestore
function sanitizeForFirestore(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    return { ...obj };
  }
}

// Timeout helper
function withTimeout(promise, ms = 2500) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ]);
}

// Deleted post tombstone helpers
export function getDeletedPostIds() {
  try {
    const raw = localStorage.getItem(DELETED_POSTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String);
    }
  } catch (e) {}
  return [];
}

export function saveDeletedPostId(postId) {
  if (!postId) return;
  const current = getDeletedPostIds();
  const strId = String(postId);
  if (!current.includes(strId)) {
    const updated = [...current, strId];
    try {
      localStorage.setItem(DELETED_POSTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  }
}

// Get all posts from localStorage (filtering out deleted tombstones)
export function getCommunityPosts() {
  const deletedSet = new Set(getDeletedPostIds());
  try {
    const raw = localStorage.getItem(COMMUNITY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(p => !deletedSet.has(String(p.id)));
      }
    }
  } catch (e) {}

  const initialActive = INITIAL_COMMUNITY_POSTS.filter(p => !deletedSet.has(String(p.id)));
  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(initialActive));
  } catch (e) {}
  return initialActive;
}

// Sync single post to Firebase Firestore
export async function syncPostToFirestore(post) {
  try {
    const db = getFirestoreDb();
    if (db && post?.id) {
      const clean = sanitizeForFirestore(post);
      await withTimeout(setDoc(doc(db, 'community_posts', String(post.id)), clean, { merge: true }), 2500);
    }
  } catch (e) {
    // Firestore might be in local mode or offline, handled gracefully
  }
}

// Broadcast action to Cloud Relay (cross-device stream)
export async function broadcastCommunityActionToCloud(action, payload) {
  if (typeof fetch === 'undefined') return;
  try {
    const clean = sanitizeForFirestore(payload);
    await fetch('https://ntfy.sh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: CLOUD_COMMUNITY_TOPIC,
        message: JSON.stringify({ action, data: clean, timestamp: new Date().toISOString() }),
        title: `COMMUNITY_${action}`
      })
    });
  } catch (e) {}
}

// Fetch cross-device posts and updates from Cloud Relay
export async function fetchCloudRelayCommunityEvents() {
  if (typeof fetch === 'undefined') return [];
  try {
    const res = await fetch(`https://ntfy.sh/${CLOUD_COMMUNITY_TOPIC}/json?poll=1`);
    if (!res.ok) return [];
    const text = await res.text();
    const lines = text.trim().split('\n');
    const events = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        if (json.event === 'message' && json.message) {
          let body = typeof json.message === 'string' ? JSON.parse(json.message) : json.message;
          if (body && body.action) {
            events.push(body);
          }
        }
      } catch (e) {}
    }
    return events;
  } catch (e) {
    return [];
  }
}

// Merge remote posts and updates into local cache
export function mergeAndSaveCommunityPosts(remotePostsOrEvents) {
  const deletedSet = new Set(getDeletedPostIds());
  const current = getCommunityPosts();
  const map = new Map();

  // 1. Initial posts (exclude deleted tombstones)
  INITIAL_COMMUNITY_POSTS.forEach(p => {
    if (!deletedSet.has(String(p.id))) {
      map.set(String(p.id), { ...p });
    }
  });

  // 2. Current local posts (exclude deleted tombstones)
  current.forEach(p => {
    if (!deletedSet.has(String(p.id))) {
      map.set(String(p.id), { ...p });
    }
  });

  // 3. Process remote items
  if (Array.isArray(remotePostsOrEvents)) {
    for (const item of remotePostsOrEvents) {
      if (!item) continue;

      // Handle delete action event first
      if (item.action === 'delete_post' && item.data?.postId) {
        const delId = String(item.data.postId);
        deletedSet.add(delId);
        saveDeletedPostId(delId);
        map.delete(delId);
        continue;
      }

      // Case A: Full post object (from Firestore)
      if (item.id && item.content) {
        const strId = String(item.id);
        if (deletedSet.has(strId)) continue; // Never re-insert deleted post

        const existing = map.get(strId);
        if (!existing) {
          map.set(strId, item);
        } else {
          // Merge comments and likes keeping highest
          const combinedComments = [...(existing.comments || [])];
          (item.comments || []).forEach(rc => {
            if (!combinedComments.some(c => c.text === rc.text && c.author === rc.author)) {
              combinedComments.push(rc);
            }
          });
          map.set(strId, {
            ...existing,
            ...item,
            likes: Math.max(existing.likes || 0, item.likes || 0),
            comments: combinedComments
          });
        }
      }
      // Case B: Action event (from Cloud Relay)
      else if (item.action && item.data) {
        if (item.action === 'add_post' && item.data.id) {
          const strId = String(item.data.id);
          if (!deletedSet.has(strId) && !map.has(strId)) {
            map.set(strId, item.data);
          }
        } else if (item.action === 'pin_post' && item.data.postId) {
          const strId = String(item.data.postId);
          const target = map.get(strId);
          if (target) {
            target.isPinned = !!item.data.isPinned;
            map.set(strId, target);
          }
        } else if (item.action === 'delete_comment' && item.data.postId && item.data.commentIndex !== undefined) {
          const strId = String(item.data.postId);
          const target = map.get(strId);
          if (target && Array.isArray(target.comments)) {
            const idx = Number(item.data.commentIndex);
            if (idx >= 0 && idx < target.comments.length) {
              const updatedComments = [...target.comments];
              updatedComments.splice(idx, 1);
              target.comments = updatedComments;
              map.set(strId, target);
            }
          }
        } else if (item.action === 'like_post' && item.data.postId) {
          const strId = String(item.data.postId);
          const target = map.get(strId);
          if (target) {
            target.likes = (target.likes || 0) + (item.data.isLiked ? 1 : -1);
            if (target.likes < 0) target.likes = 0;
            map.set(strId, target);
          }
        } else if (item.action === 'comment_post' && item.data.postId && item.data.comment) {
          const strId = String(item.data.postId);
          const target = map.get(strId);
          if (target) {
            target.comments = target.comments || [];
            if (!target.comments.some(c => c.text === item.data.comment.text && c.author === item.data.comment.author)) {
              target.comments.push(item.data.comment);
            }
            map.set(strId, target);
          }
        }
      }
    }
  }

  // Sort: Pinned first, then newest
  const mergedList = Array.from(map.values()).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    const timeA = new Date(a.createdAt || 0).getTime() || (typeof a.id === 'number' ? a.id : 0);
    const timeB = new Date(b.createdAt || 0).getTime() || (typeof b.id === 'number' ? b.id : 0);
    return timeB - timeA;
  });

  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(mergedList));
  } catch (e) {}

  return mergedList;
}

// Add a new post
export function addCommunityPost(post) {
  const current = getCommunityPosts();
  const newPost = {
    ...post,
    id: post.id || 'post_' + Date.now(),
    createdAt: post.createdAt || new Date().toISOString(),
    likes: post.likes || 1,
    comments: post.comments || []
  };

  const updated = [newPost, ...current];
  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  // Sync to Firebase & Cloud Relay
  syncPostToFirestore(newPost);
  broadcastCommunityActionToCloud('add_post', newPost);

  return newPost;
}

// Like a post
export function toggleLikeCommunityPost(postId, isLiked) {
  const current = getCommunityPosts();
  const updated = current.map(p => {
    if (String(p.id) === String(postId)) {
      const newLikes = isLiked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 0) - 1);
      const updatedPost = { ...p, likes: newLikes };
      syncPostToFirestore(updatedPost);
      return updatedPost;
    }
    return p;
  });

  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  broadcastCommunityActionToCloud('like_post', { postId, isLiked });
  return updated;
}

// Add comment to a post
export function addCommentToCommunityPost(postId, comment) {
  const current = getCommunityPosts();
  let updatedPost = null;
  const updated = current.map(p => {
    if (String(p.id) === String(postId)) {
      const comments = [...(p.comments || []), comment];
      updatedPost = { ...p, comments };
      syncPostToFirestore(updatedPost);
      return updatedPost;
    }
    return p;
  });

  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  broadcastCommunityActionToCloud('comment_post', { postId, comment });
  return updated;
}

// Delete a community post permanently (Admin control)
export async function deleteCommunityPost(postId) {
  if (!postId) return getCommunityPosts();
  const strId = String(postId);

  // 1. Record tombstone so sync cycles do not resurrect it
  saveDeletedPostId(strId);

  // 2. Remove from local list
  const current = getCommunityPosts().filter(p => String(p.id) !== strId);
  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {}

  // 3. Delete from Firebase Firestore if available
  try {
    const db = getFirestoreDb();
    if (db) {
      await withTimeout(deleteDoc(doc(db, 'community_posts', strId)), 2500);
    }
  } catch (e) {
    // Graceful fallback if offline
  }

  // 4. Broadcast deletion to Cloud Relay
  broadcastCommunityActionToCloud('delete_post', { postId: strId });

  return current;
}

// Toggle Pin status of a post (Admin control)
export async function togglePinCommunityPost(postId) {
  if (!postId) return getCommunityPosts();
  const strId = String(postId);
  let updatedPost = null;

  const current = getCommunityPosts().map(p => {
    if (String(p.id) === strId) {
      updatedPost = { ...p, isPinned: !p.isPinned };
      return updatedPost;
    }
    return p;
  });

  // Sort pinned first
  current.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    const timeA = new Date(a.createdAt || 0).getTime() || 0;
    const timeB = new Date(b.createdAt || 0).getTime() || 0;
    return timeB - timeA;
  });

  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {}

  if (updatedPost) {
    syncPostToFirestore(updatedPost);
    broadcastCommunityActionToCloud('pin_post', { postId: strId, isPinned: updatedPost.isPinned });
  }

  return current;
}

// Delete a specific comment from a post (Admin moderation)
export async function deleteCommunityComment(postId, commentIndex) {
  if (!postId || commentIndex === undefined || commentIndex < 0) return getCommunityPosts();
  const strId = String(postId);
  let updatedPost = null;

  const current = getCommunityPosts().map(p => {
    if (String(p.id) === strId && Array.isArray(p.comments)) {
      const newComments = [...p.comments];
      if (commentIndex < newComments.length) {
        newComments.splice(commentIndex, 1);
        updatedPost = { ...p, comments: newComments };
        return updatedPost;
      }
    }
    return p;
  });

  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {}

  if (updatedPost) {
    syncPostToFirestore(updatedPost);
    broadcastCommunityActionToCloud('delete_comment', { postId: strId, commentIndex });
  }

  return current;
}

// Bulk delete or spam cleanup
export function clearSpamCommunityPosts(filterFn) {
  const current = getCommunityPosts();
  const toDelete = typeof filterFn === 'function' ? current.filter(filterFn) : [];
  toDelete.forEach(p => {
    saveDeletedPostId(p.id);
    broadcastCommunityActionToCloud('delete_post', { postId: String(p.id) });
  });

  const remaining = current.filter(p => !toDelete.some(d => String(d.id) === String(p.id)));
  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(remaining));
  } catch (e) {}
  return remaining;
}

// Subscribe to real-time community posts
export function subscribeToCommunityPosts(callback) {
  // Emit local cache immediately
  callback(getCommunityPosts());

  let unsubscribeFirestore = null;
  const db = getFirestoreDb();

  // 1. Firebase Firestore onSnapshot listener
  if (db) {
    try {
      const col = collection(db, 'community_posts');
      unsubscribeFirestore = onSnapshot(
        col,
        (snapshot) => {
          const fbPosts = [];
          snapshot.forEach((d) => {
            const data = d.data();
            if (data && data.id) fbPosts.push(data);
          });
          if (fbPosts.length > 0) {
            const merged = mergeAndSaveCommunityPosts(fbPosts);
            callback(merged);
          }
        },
        (err) => {
          console.warn('Firestore community onSnapshot notice:', err.message);
        }
      );
    } catch (e) {
      console.warn('Firestore community subscription error:', e);
    }
  }

  // 2. Initial Cloud Relay fetch
  fetchCloudRelayCommunityEvents().then((events) => {
    if (events.length > 0) {
      const merged = mergeAndSaveCommunityPosts(events);
      callback(merged);
    }
  });

  // 3. Periodic cloud poller (every 6s)
  const intervalId = setInterval(async () => {
    const events = await fetchCloudRelayCommunityEvents();
    if (events.length > 0) {
      const merged = mergeAndSaveCommunityPosts(events);
      callback(merged);
    }
  }, 6000);

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    clearInterval(intervalId);
  };
}
