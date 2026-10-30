// Gamification & Engagement Engine (Real Streak, Real-Time Leaderboard & Daily Quests — Zero Bots)
import { getHanoiDateString, recordStudyTimeLog } from './hanoiTime.js';
import { getCurrentUser } from './firebaseConfig.js';

const STREAK_KEY = 'onthi_streak_data_v3';
const NOTIFICATIONS_KEY = 'onthi_user_notifications_v3';
const CLAIMED_VOUCHERS_KEY = 'onthi_claimed_vouchers';
const LIKES_KEY = 'onthi_deck_likes';
export const LEADERBOARD_CLOUD_TOPIC = 'onthi_hub_leaderboard_v3';
export const KVDB_LEADERBOARD_URL = 'https://kvdb.io/SBPTa4d8XoFCmTGm4KJGC9/index_leaderboard_entries';

// 1. STREAK & XP ENGINE (Đồng bộ chuẩn Giờ Hà Nội - 100% Dữ liệu thật)
export function getStreakInfo() {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    const data = raw
      ? JSON.parse(raw)
      : {
          streak: 0,
          lastDate: '',
          highestStreak: 0,
          xp: 0,
          level: 'Creator Mới Khởi Nghiệp 🚀'
        };
    return data;
  } catch {
    return { streak: 0, lastDate: '', highestStreak: 0, xp: 0, level: 'Creator Mới Khởi Nghiệp 🚀' };
  }
}

export function broadcastUserLeaderboardEntry(streakData) {
  try {
    const u = getCurrentUser();
    const clientId = u?.uid || u?.email || localStorage.getItem('onthi_studyroom_client_id_v3') || 'local_user';
    const name = u?.displayName || (u?.email ? u.email.split('@')[0] : 'Creator PromptMMO');
    const avatar = u?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    const entry = {
      type: 'leaderboard_sync',
      clientId,
      name,
      avatar,
      xp: streakData.xp || 0,
      streak: streakData.streak || 0,
      badge: streakData.level || 'Creator Bền Bỉ 🔥',
      goal: 'Bứt phá doanh thu MMO 2026',
      updatedAt: Date.now()
    };

    // 1. Primary: KVDB Singapore Edge
    (async () => {
      try {
        let list = [];
        try {
          const res = await fetch(KVDB_LEADERBOARD_URL, { cache: 'no-store' });
          if (res.ok) list = await res.json();
        } catch {}
        if (!Array.isArray(list)) list = [];
        list = list.filter((item) => item?.clientId !== clientId);
        list.push(entry);
        if (list.length > 60) list = list.slice(-60);
        await fetch(KVDB_LEADERBOARD_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(list)
        });
      } catch {}
    })();

    // 2. Fallback: ntfy
    fetch(`https://ntfy.sh/${LEADERBOARD_CLOUD_TOPIC}`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(entry)
    }).catch(() => {});
  } catch {}
}

export function recordStudyAction(xpGained = 25, activityTitle = 'Phiên sáng tạo & tối ưu Prompt') {
  try {
    const today = getHanoiDateString();
    const current = getStreakInfo();

    let newStreak = current.streak;
    if (current.lastDate !== today) {
      newStreak = (current.streak || 0) + 1;
    }

    const updated = {
      ...current,
      streak: newStreak,
      lastDate: today,
      highestStreak: Math.max(newStreak, current.highestStreak || 0),
      xp: (current.xp || 0) + xpGained
    };

    if (updated.xp > 2000) updated.level = 'Top Creator MMO 👑';
    else if (updated.xp > 1000) updated.level = 'Bậc Thầy Prompt 🏆';
    else if (updated.xp > 500) updated.level = 'Chuyên Gia Nội Dung 🚀';
    else if (updated.xp > 0) updated.level = 'Creator Tích Cực ⚡';
    else updated.level = 'Creator Mới 🌱';

    localStorage.setItem(STREAK_KEY, JSON.stringify(updated));

    if (xpGained >= 10) {
      recordStudyTimeLog({
        type: 'study',
        title: activityTitle,
        durationMinutes: Math.max(1, Math.round(xpGained / 2)),
        xpGained: xpGained
      });
    }

    broadcastUserLeaderboardEntry(updated);
    return updated;
  } catch {
    return null;
  }
}

// 2. WEEKLY LEADERBOARD DATA (No static bots — dynamically populated from real users)
export const LEADERBOARD_USERS = [];

export const AVAILABLE_VOUCHERS = [];

export function getClaimedVouchers() {
  try {
    const raw = localStorage.getItem(CLAIMED_VOUCHERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function claimVoucher(voucherId) {
  const list = getClaimedVouchers();
  if (!list.includes(voucherId)) {
    list.push(voucherId);
    localStorage.setItem(CLAIMED_VOUCHERS_KEY, JSON.stringify(list));
    return true;
  }
  return false;
}

// 4. NOTIFICATION CENTER (Real system notifications only)
export const DEFAULT_NOTIFICATIONS = [];

export function getUserNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function markNotificationsAsRead() {
  try {
    const notifs = getUserNotifications().map(n => ({ ...n, isRead: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  } catch {}
}

// 5. SOCIAL LIKES ❤️
export function getLikedDeckIds() {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleLikeDeck(deckId) {
  const current = getLikedDeckIds();
  const exists = current.includes(deckId);
  const updated = exists ? current.filter(id => id !== deckId) : [...current, deckId];
  localStorage.setItem(LIKES_KEY, JSON.stringify(updated));
  return !exists;
}

// 6. DAILY QUESTS ENGINE
const QUESTS_KEY = 'onthi_daily_quests';

const DEFAULT_QUESTS = [
  { id: 'checkin', title: 'Điểm Danh Hàng Ngày', desc: 'Mở web và bấm nhận quà điểm danh', xp: 25, rewardXu: 5, icon: 'Gift' },
  { id: 'review_cards', title: 'Thực Hành 5 Prompt Thực Chiến', desc: 'Xem và thử nghiệm cú pháp 5 Prompt', xp: 25, rewardXu: 0, icon: 'Layers' },
  { id: 'match_game', title: 'Hoàn Thành 1 Trận Ghép Thẻ', desc: 'Chơi chế độ Match Game siêu tốc dưới 45s', xp: 50, rewardXu: 2, icon: 'Gamepad2' },
  { id: 'pomodoro', title: 'Tập Trung 1 Phiên Pomodoro', desc: 'Làm việc tập trung 25 phút không ngắt quãng', xp: 50, rewardXu: 0, icon: 'Timer' }
];

export function getDailyQuests() {
  try {
    const today = getHanoiDateString();
    const raw = localStorage.getItem(QUESTS_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === today) {
        return data.quests;
      }
    }
    const fresh = DEFAULT_QUESTS.map(q => ({ ...q, completed: false }));
    localStorage.setItem(QUESTS_KEY, JSON.stringify({ date: today, quests: fresh, bonusClaimed: false }));
    return fresh;
  } catch {
    return DEFAULT_QUESTS.map(q => ({ ...q, completed: false }));
  }
}

export function completeDailyQuest(questId) {
  try {
    const today = getHanoiDateString();
    const quests = getDailyQuests();
    const updated = quests.map(q => {
      if (q.id === questId && !q.completed) {
        recordStudyAction(q.xp, `Hoàn thành nhiệm vụ: ${q.title}`);
        return { ...q, completed: true };
      }
      return q;
    });
    localStorage.setItem(QUESTS_KEY, JSON.stringify({ date: today, quests: updated, bonusClaimed: false }));
    return updated;
  } catch {
    return null;
  }
}

export function getAppTheme() {
  return 'quizizz';
}

export function setAppTheme() {}
