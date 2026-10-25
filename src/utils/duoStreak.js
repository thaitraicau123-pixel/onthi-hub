// =========================================================================
// ONTHIHUB DUO STREAK ENGINE (Chuỗi Học Tập Đôi Bạn Cùng Tiến 🔥)
// Theo dõi ngày học chung giữa 2 bạn học, hỗ trợ nhắc học và nâng cấp ngọn lửa
// =========================================================================

import { getHanoiDateString } from './hanoiTime.js';

const DUO_STREAK_STORAGE_KEY = 'onthi_duo_streaks_v1';

function getDuoKey(id1, id2) {
  const a = String(id1 || '').toLowerCase().trim();
  const b = String(id2 || '').toLowerCase().trim();
  const sorted = [a, b].sort();
  return `duo_${sorted[0]}__${sorted[1]}`;
}

export function getAllDuoStreaks() {
  try {
    const raw = localStorage.getItem(DUO_STREAK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveAllDuoStreaks(data) {
  try {
    localStorage.setItem(DUO_STREAK_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

/**
 * Lấy thông tin Chuỗi Bạn Cùng Tiến giữa 2 người dùng
 */
export function getDuoStreak(userIdA, userIdB) {
  if (!userIdA || !userIdB) return { streak: 0, lastDate: '', isStudiedToday: false, flameLevel: 'none' };
  const key = getDuoKey(userIdA, userIdB);
  const all = getAllDuoStreaks();
  const item = all[key] || { streak: 0, lastDate: '', highestStreak: 0, nudgedToday: false };

  const today = getHanoiDateString();
  const isStudiedToday = item.lastDate === today;

  return {
    streak: item.streak || 0,
    lastDate: item.lastDate || '',
    highestStreak: item.highestStreak || item.streak || 0,
    isStudiedToday,
    nudgedToday: Boolean(item.lastNudgeDate === today),
    flameLevel: getDuoStreakFlameLevel(item.streak || 0)
  };
}

/**
 * Phân loại cấp độ ngọn lửa đôi
 */
export function getDuoStreakFlameLevel(streak) {
  if (streak >= 14) return { level: 'diamond', icon: '💎', label: 'Ngọn Lửa Kim Cương', color: 'from-cyan-400 to-indigo-500 text-cyan-200' };
  if (streak >= 7) return { level: 'purple', icon: '⚡', label: 'Ngọn Lửa Tím Siêu Nhiệt', color: 'from-purple-500 to-pink-500 text-purple-200' };
  if (streak >= 3) return { level: 'blaze', icon: '🔥', label: 'Ngọn Lửa Bùng Cháy', color: 'from-amber-500 to-orange-500 text-amber-200' };
  if (streak >= 1) return { level: 'warm', icon: '✨', label: 'Ngọn Lửa Khởi Đầu', color: 'from-yellow-400 to-amber-500 text-yellow-200' };
  return { level: 'none', icon: '💤', label: 'Chưa Thắp Lửa', color: 'from-slate-400 to-slate-500 text-slate-300' };
}

/**
 * Ghi nhận hoạt động học chung giữa 2 bạn học (Ví dụ thi đấu 1v1 hoặc cùng học trong phòng)
 */
export function recordDuoStudyAction(userIdA, userIdB) {
  if (!userIdA || !userIdB) return;
  const key = getDuoKey(userIdA, userIdB);
  const all = getAllDuoStreaks();
  const current = all[key] || { streak: 0, lastDate: '', highestStreak: 0 };
  const today = getHanoiDateString();

  if (current.lastDate === today) {
    return current;
  }

  const newStreak = (current.streak || 0) + 1;
  const updated = {
    ...current,
    streak: newStreak,
    lastDate: today,
    highestStreak: Math.max(newStreak, current.highestStreak || 0)
  };

  all[key] = updated;
  saveAllDuoStreaks(all);
  return updated;
}

/**
 * Đánh dấu đã nhắc học bạn hôm nay
 */
export function markDuoNudged(userIdA, userIdB) {
  if (!userIdA || !userIdB) return;
  const key = getDuoKey(userIdA, userIdB);
  const all = getAllDuoStreaks();
  const current = all[key] || { streak: 0, lastDate: '', highestStreak: 0 };
  const today = getHanoiDateString();

  all[key] = {
    ...current,
    lastNudgeDate: today
  };
  saveAllDuoStreaks(all);
}
