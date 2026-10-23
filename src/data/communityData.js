import { getFirestoreDb, collection, doc, setDoc, onSnapshot, query, getDocs, deleteDoc } from '../utils/firebaseConfig.js';

const COMMUNITY_STORAGE_KEY = 'onthi_community_posts_v2';
export const DELETED_POSTS_STORAGE_KEY = 'onthi_deleted_community_posts_v1';
export const COMMUNITY_LIKED_STORAGE_KEY = 'onthi_community_liked_posts_v1';
export const COMMUNITY_CLIENT_ID_KEY = 'onthi_community_client_id_v1';
const CLOUD_COMMUNITY_TOPIC = 'onthi_hub_community_v2';

export const INITIAL_COMMUNITY_POSTS = [];


// Client unique ID helper for anonymous/guest community participation
export function getOrCreateCommunityClientId() {
  try {
    if (typeof localStorage !== 'undefined') {
      let id = localStorage.getItem(COMMUNITY_CLIENT_ID_KEY);
      if (!id) {
        id = 'client_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
        localStorage.setItem(COMMUNITY_CLIENT_ID_KEY, id);
      }
      return id;
    }
  } catch (e) {}
  return 'client_student_' + Math.random().toString(36).substring(2, 8);
}

// Get user liked post IDs from local storage
export function getLocalLikedPostIds() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(COMMUNITY_LIKED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(String);
      }
    }
  } catch (e) {}
  return [];
}

// Save user liked post IDs to local storage
export function saveLocalLikedPostIds(likedIds) {
  try {
    if (typeof localStorage !== 'undefined' && Array.isArray(likedIds)) {
      localStorage.setItem(COMMUNITY_LIKED_STORAGE_KEY, JSON.stringify(Array.from(new Set(likedIds.map(String)))));
    }
  } catch (e) {}
}

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

// Test and censorship artifact detection
export function isTestPost(post) {
  if (!post) return false;
  const idStr = String(post.id || '').toLowerCase();
  const authorStr = String(post.author || '').toLowerCase();
  const contentStr = String(post.content || '').toLowerCase();
  if (idStr.startsWith('post_init_') || idStr.startsWith('test_') || idStr.startsWith('temp_') || idStr.includes('test_post')) return true;
  if (authorStr.includes('test user') || authorStr.includes('spammer') || authorStr.includes('zombie')) return true;
  if (contentStr.includes('test kiểm duyệt') || contentStr.includes('kiểm duyệt bài viết') || contentStr.includes('resurrection test') || contentStr.includes('bình luận spam')) return true;
  return false;
}

export function isTestComment(comment) {
  if (!comment) return false;
  const authorStr = String(comment.author || '').toLowerCase();
  const textStr = String(comment.text || '').toLowerCase();
  if (authorStr.includes('spammer') || authorStr.includes('test user')) return true;
  if (textStr.includes('bình luận spam') || textStr.includes('test kiểm duyệt')) return true;
  return false;
}

// Immediate purge of test/moderation artifacts from storage
export function purgeTestCommunityData() {
  const deletedSet = new Set(getDeletedPostIds());
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(COMMUNITY_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach(p => {
          if (isTestPost(p)) {
            deletedSet.add(String(p.id));
            saveDeletedPostId(p.id);
          }
        });
        const cleanList = parsed
          .filter(p => !deletedSet.has(String(p.id)) && !isTestPost(p))
          .map(p => {
            // Normalize old bot-inflated likes on initial posts
            if (p.id === 'post_init_1' && (p.likes > 20 || !p.likedBy)) {
              p.likes = 0;
              p.role = 'Ban Quản Trị OnThiHub';
              p.likedBy = [];
            }
            if (p.id === 'post_init_2' && (p.likes > 20 || !p.likedBy)) {
              p.likes = 0;
              p.role = 'Ban Quản Trị OnThiHub';
              p.likedBy = [];
            }
            if (p.id === 'post_init_3' && (p.likes > 20 || !p.likedBy)) {
              p.likes = 0;
              p.role = 'Ban Quản Trị OnThiHub';
              p.likedBy = [];
            }
            return {
              ...p,
              likedBy: Array.isArray(p.likedBy) ? p.likedBy : [],
              likes: typeof p.likes === 'number' ? p.likes : (Array.isArray(p.likedBy) ? p.likedBy.length : 0),
              comments: (p.comments || []).filter(c => !isTestComment(c))
            };
          });
        localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(cleanList));
      }
    }
  } catch (e) {}
}

// Auto-run cleanup on module initialization
purgeTestCommunityData();

// Get all posts from localStorage (filtering out deleted tombstones and test content)
export function getCommunityPosts() {
  const deletedSet = new Set(getDeletedPostIds());
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(COMMUNITY_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .filter(p => !deletedSet.has(String(p.id)) && !isTestPost(p))
          .map(p => ({
            ...p,
            likedBy: Array.isArray(p.likedBy) ? p.likedBy : [],
            likes: typeof p.likes === 'number' ? p.likes : (Array.isArray(p.likedBy) ? p.likedBy.length : 0),
            comments: (p.comments || []).filter(c => !isTestComment(c)).map(c => ({
              ...c,
              replies: Array.isArray(c.replies) ? c.replies.filter(r => !isTestComment(r)) : []
            }))
          }));
      }
    }
  } catch (e) {}

  const initialActive = INITIAL_COMMUNITY_POSTS
    .filter(p => !deletedSet.has(String(p.id)) && !isTestPost(p))
    .map(p => ({
      ...p,
      likedBy: Array.isArray(p.likedBy) ? p.likedBy : [],
      likes: typeof p.likes === 'number' ? p.likes : (Array.isArray(p.likedBy) ? p.likedBy.length : 0),
      comments: (p.comments || []).filter(c => !isTestComment(c)).map(c => ({
        ...c,
        replies: Array.isArray(c.replies) ? c.replies.filter(r => !isTestComment(r)) : []
      }))
    }));
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(initialActive));
    }
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

      // Filter out and discard test/spam artifacts immediately
      if (isTestPost(item) || isTestPost(item?.data)) {
        const testId = item.id || item.data?.id || item.data?.postId;
        if (testId) {
          deletedSet.add(String(testId));
          saveDeletedPostId(testId);
          map.delete(String(testId));
        }
        continue;
      }

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
          const itemLikedBy = Array.isArray(item.likedBy) ? item.likedBy : [];
          const itemLikes = typeof item.likes === 'number' ? item.likes : itemLikedBy.length;
          map.set(strId, {
            ...item,
            likedBy: itemLikedBy,
            likes: itemLikes
          });
        } else {
          // Merge comments
          const combinedComments = [...(existing.comments || [])];
          (item.comments || []).forEach(rc => {
            if (!combinedComments.some(c => c.text === rc.text && c.author === rc.author)) {
              combinedComments.push(rc);
            }
          });

          // Merge likedBy union
          const existingLikedBy = Array.isArray(existing.likedBy) ? existing.likedBy : [];
          const itemLikedBy = Array.isArray(item.likedBy) ? item.likedBy : [];
          const combinedLikedBy = Array.from(new Set([...existingLikedBy, ...itemLikedBy]));
          const effectiveLikes = combinedLikedBy.length > 0
            ? combinedLikedBy.length
            : Math.max(existing.likes || 0, item.likes || 0);

          map.set(strId, {
            ...existing,
            ...item,
            likedBy: combinedLikedBy,
            likes: effectiveLikes,
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
            target.likedBy = Array.isArray(target.likedBy) ? [...target.likedBy] : [];
            const uid = item.data.userIdentifier;
            if (uid) {
              const hasUid = target.likedBy.includes(uid);
              if (item.data.isLiked) {
                if (!hasUid) {
                  target.likedBy.push(uid);
                  target.likes = (target.likes || 0) + 1;
                }
              } else {
                if (hasUid) {
                  target.likedBy = target.likedBy.filter(u => u !== uid);
                  target.likes = Math.max(0, (target.likes || 0) - 1);
                }
              }
            } else if (typeof item.data.likes === 'number') {
              target.likes = item.data.likes;
            } else {
              target.likes = Math.max(0, (target.likes || 0) + (item.data.isLiked ? 1 : -1));
            }
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
        } else if (item.action === 'reply_comment' && item.data.postId && item.data.reply) {
          const strId = String(item.data.postId);
          const target = map.get(strId);
          if (target && Array.isArray(target.comments)) {
            let targetComment = null;
            if (item.data.commentId) {
              targetComment = target.comments.find(c => c.id === item.data.commentId);
            }
            if (!targetComment && item.data.commentIndex !== undefined && target.comments[item.data.commentIndex]) {
              targetComment = target.comments[item.data.commentIndex];
            }
            if (targetComment) {
              targetComment.replies = targetComment.replies || [];
              if (!targetComment.replies.some(r => (r.id && r.id === item.data.reply.id) || (r.text === item.data.reply.text && r.author === item.data.reply.author))) {
                targetComment.replies.push(item.data.reply);
              }
              map.set(strId, target);
            }
          }
        } else if (item.action === 'delete_reply' && item.data.postId && item.data.commentIndex !== undefined && item.data.replyIndex !== undefined) {
          const strId = String(item.data.postId);
          const target = map.get(strId);
          if (target && Array.isArray(target.comments) && target.comments[item.data.commentIndex]) {
            const targetComment = target.comments[item.data.commentIndex];
            if (Array.isArray(targetComment.replies) && targetComment.replies[item.data.replyIndex]) {
              targetComment.replies.splice(item.data.replyIndex, 1);
              map.set(strId, target);
            }
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
    likes: typeof post.likes === 'number' ? post.likes : (Array.isArray(post.likedBy) ? post.likedBy.length : 1),
    likedBy: Array.isArray(post.likedBy) ? post.likedBy : [],
    comments: (post.comments || []).map(c => ({
      ...c,
      createdAt: c.createdAt || new Date().toISOString()
    }))
  };

  const updated = [newPost, ...current];
  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  // Sync to Firebase & Cloud Relay (only for genuine user posts, NEVER broadcast test artifacts)
  if (!isTestPost(newPost)) {
    syncPostToFirestore(newPost);
    broadcastCommunityActionToCloud('add_post', newPost);
  }

  return newPost;
}

// Like or unlike a post with real-time user-level deduplication
export function toggleLikeCommunityPost(postId, isLiked, userIdentifier = null) {
  const current = getCommunityPosts();
  const uid = userIdentifier || getOrCreateCommunityClientId();
  const strId = String(postId);
  let updatedTargetPost = null;

  const updated = current.map(p => {
    if (String(p.id) === strId) {
      const existingLikedBy = Array.isArray(p.likedBy) ? [...p.likedBy] : [];
      const hasLiked = existingLikedBy.includes(uid);
      let nextLikedBy = existingLikedBy;
      let nextLikes = typeof p.likes === 'number' ? p.likes : 0;

      if (isLiked) {
        if (!hasLiked) {
          nextLikedBy = [...existingLikedBy, uid];
          nextLikes = nextLikes + 1;
        }
      } else {
        if (hasLiked) {
          nextLikedBy = existingLikedBy.filter(u => u !== uid);
          nextLikes = Math.max(0, nextLikes - 1);
        } else if (nextLikes > 0 && !userIdentifier) {
          nextLikes = Math.max(0, nextLikes - 1);
        }
      }

      updatedTargetPost = {
        ...p,
        likes: nextLikes,
        likedBy: nextLikedBy
      };
      return updatedTargetPost;
    }
    return p;
  });

  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  // Update local user's liked post IDs
  const localLiked = getLocalLikedPostIds();
  const nextLocalLiked = isLiked
    ? Array.from(new Set([...localLiked, strId]))
    : localLiked.filter(id => id !== strId);
  saveLocalLikedPostIds(nextLocalLiked);

  if (updatedTargetPost) {
    syncPostToFirestore(updatedTargetPost);
    broadcastCommunityActionToCloud('like_post', {
      postId: strId,
      isLiked,
      userIdentifier: uid,
      likes: updatedTargetPost.likes,
      likedBy: updatedTargetPost.likedBy
    });
  }

  return updated;
}

// Add comment to a post
export function addCommentToCommunityPost(postId, comment) {
  const current = getCommunityPosts();
  let updatedPost = null;
  const newComment = {
    id: comment.id || 'cm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    ...comment,
    replies: Array.isArray(comment.replies) ? comment.replies : []
  };

  const updated = current.map(p => {
    if (String(p.id) === String(postId)) {
      const comments = [...(p.comments || []), newComment];
      updatedPost = { ...p, comments };
      syncPostToFirestore(updatedPost);
      return updatedPost;
    }
    return p;
  });

  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  broadcastCommunityActionToCloud('comment_post', { postId, comment: newComment });
  return updated;
}

// Add reply to a comment (Threaded replies)
export function addReplyToCommunityComment(postId, commentIndexOrId, reply) {
  const current = getCommunityPosts();
  let updatedPost = null;
  const newReply = {
    id: reply.id || 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    author: reply.author,
    text: reply.text,
    createdAt: reply.createdAt || new Date().toISOString(),
    replyTo: reply.replyTo || null
  };

  const updated = current.map(p => {
    if (String(p.id) === String(postId) && Array.isArray(p.comments)) {
      const newComments = p.comments.map((cm, idx) => {
        const isMatch = (cm.id && cm.id === commentIndexOrId) || idx === Number(commentIndexOrId);
        if (isMatch) {
          const replies = [...(cm.replies || []), newReply];
          return { ...cm, replies };
        }
        return cm;
      });
      updatedPost = { ...p, comments: newComments };
      syncPostToFirestore(updatedPost);
      return updatedPost;
    }
    return p;
  });

  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  broadcastCommunityActionToCloud('reply_comment', {
    postId: String(postId),
    commentIndex: typeof commentIndexOrId === 'number' ? commentIndexOrId : undefined,
    commentId: typeof commentIndexOrId === 'string' ? commentIndexOrId : undefined,
    reply: newReply
  });
  return updated;
}

// Delete a specific reply from a comment (Admin / Author control)
export async function deleteCommunityCommentReply(postId, commentIndex, replyIndex) {
  if (!postId || commentIndex === undefined || replyIndex === undefined) return getCommunityPosts();
  const strId = String(postId);
  let updatedPost = null;

  const current = getCommunityPosts().map(p => {
    if (String(p.id) === strId && Array.isArray(p.comments) && p.comments[commentIndex]) {
      const newComments = [...p.comments];
      const targetCm = { ...newComments[commentIndex] };
      if (Array.isArray(targetCm.replies) && targetCm.replies[replyIndex]) {
        const newReplies = [...targetCm.replies];
        newReplies.splice(replyIndex, 1);
        targetCm.replies = newReplies;
        newComments[commentIndex] = targetCm;
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
    broadcastCommunityActionToCloud('delete_reply', { postId: strId, commentIndex, replyIndex });
  }

  return current;
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

// Bulk delete or spam cleanup - purges test posts and spam, keeping authentic initial posts
export function clearSpamCommunityPosts(filterFn) {
  const current = getCommunityPosts();
  const toDelete = typeof filterFn === 'function' ? current.filter(filterFn) : [];
  toDelete.forEach(p => {
    saveDeletedPostId(p.id);
    if (!isTestPost(p)) {
      broadcastCommunityActionToCloud('delete_post', { postId: String(p.id) });
    }
  });

  let remaining = current.filter(p => !toDelete.some(d => String(d.id) === String(p.id)) && !isTestPost(p));
  if (remaining.length === 0) {
    remaining = [...INITIAL_COMMUNITY_POSTS];
  }
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
