// Gamification & Engagement Engine (Duolingo Streak, Quizizz Leaderboard, Shopee Vouchers & Notifications)

const STREAK_KEY = 'onthi_streak_data';
const NOTIFICATIONS_KEY = 'onthi_user_notifications';
const CLAIMED_VOUCHERS_KEY = 'onthi_claimed_vouchers';
const LIKES_KEY = 'onthi_deck_likes';

// 1. STREAK & XP ENGINE (Duolingo style)
export function getStreakInfo() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(STREAK_KEY);
    const data = raw ? JSON.parse(raw) : {
      streak: 3, // Default starting streak for engagement
      lastDate: today,
      highestStreak: 7,
      xp: 450,
      level: 'Chuyên Viên Ôn Thi 🎓'
    };
    return data;
  } catch (e) {
    return { streak: 3, lastDate: '', highestStreak: 7, xp: 450, level: 'Chuyên Viên Ôn Thi 🎓' };
  }
}

export function recordStudyAction(xpGained = 25) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const current = getStreakInfo();
    
    let newStreak = current.streak;
    if (current.lastDate !== today) {
      // New day study action
      newStreak += 1;
    }

    const updated = {
      ...current,
      streak: newStreak,
      lastDate: today,
      highestStreak: Math.max(newStreak, current.highestStreak),
      xp: current.xp + xpGained
    };

    // Calculate level
    if (updated.xp > 2000) updated.level = 'Học Bá Tối Cao 👑';
    else if (updated.xp > 1000) updated.level = 'Thủ Khoa Đề Thi 🏆';
    else if (updated.xp > 500) updated.level = 'Chuyên Viên Cấp Cao 🚀';
    else updated.level = 'Học Viên Chăm Chỉ 🎓';

    localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return null;
  }
}

// 2. WEEKLY LEADERBOARD DATA (Quizizz & Duolingo style)
export const LEADERBOARD_USERS = [
  { rank: 1, name: 'Trần Hoàng Long', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', xp: 3420, streak: 18, badge: 'Thủ Khoa Tuần 🏆', goal: 'Đỗ Chuyên viên Bộ Nội Vụ' },
  { rank: 2, name: 'Lê Thuỳ Linh', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', xp: 2980, streak: 14, badge: 'IELTS 8.5 🌟', goal: 'IELTS Writing 8.0' },
  { rank: 3, name: 'Nguyễn Minh Tuấn', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', xp: 2650, streak: 12, badge: 'Senior Dev 💻', goal: 'Pass FAANG/Tech Lead' },
  { rank: 4, name: 'Phạm Quỳnh Anh', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', xp: 2190, streak: 9, badge: 'Top 10 🔥', goal: 'JLPT N2 160/180' },
  { rank: 5, name: 'Đặng Quốc Huy', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', xp: 1840, streak: 7, badge: 'Top 10 🔥', goal: 'Công chức Thuế 2026' }
];

// 3. SHOPEE STYLE VOUCHERS HUB
export const AVAILABLE_VOUCHERS = [
  { id: 'VOUCHER_5XU', code: 'CHAO2026', discountText: 'Giảm 5 Xu', minOrder: 20, desc: 'Dành cho đơn mở khóa bộ thẻ từ 20 Xu', expires: 'Còn 3 ngày' },
  { id: 'VOUCHER_XU15', code: 'HOIXU15', discountText: 'Hoàn 15% Xu', minOrder: 0, desc: 'Hoàn Xu trực tiếp vào ví sau khi mở khóa', expires: 'Còn 5 ngày' },
  { id: 'VOUCHER_VIP', code: 'VIPMEM', discountText: 'Giảm 15 Xu', minOrder: 50, desc: 'Áp dụng cho gói Combo VIP trọn đời', expires: 'Hôm nay' }
];

export function getClaimedVouchers() {
  try {
    const raw = localStorage.getItem(CLAIMED_VOUCHERS_KEY);
    return raw ? JSON.parse(raw) : ['VOUCHER_20K'];
  } catch (e) {
    return ['VOUCHER_20K'];
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

// 4. NOTIFICATION CENTER (Facebook / Shopee notifications)
export const DEFAULT_NOTIFICATIONS = [
  { id: 'notif_1', title: '🔥 Đố Vui Giờ Vàng!', message: 'Làm 1 bài trắc nghiệm hôm nay để duy trì chuỗi Streak 3 ngày nhé!', time: '10 phút trước', isRead: false, type: 'streak' },
  { id: 'notif_2', title: '🎁 Quà Tặng Tân Thủ', message: 'Bạn được cộng sẵn 20 Xu vào ví để trải nghiệm mua sắm trên chợ C2C.', time: '1 giờ trước', isRead: false, type: 'wallet' },
  { id: 'notif_3', title: '🏛️ Cập Nhật Đề Thi Công Chức 2026', message: 'Ban học thuật vừa thêm 45 câu hỏi mới theo Nghị định 138/2020/NĐ-CP.', time: 'Hôm qua', isRead: true, type: 'content' }
];

export function getUserNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
  } catch (e) {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function markNotificationsAsRead() {
  try {
    const notifs = getUserNotifications().map(n => ({ ...n, isRead: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  } catch (e) {}
}

// 5. SOCIAL LIKES ❤️
export function getLikedDeckIds() {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    return raw ? JSON.parse(raw) : ['mkt_sat_vocab'];
  } catch (e) {
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

// 6. DAILY QUESTS ENGINE (Duolingo Style)
const QUESTS_KEY = 'onthi_daily_quests';

const DEFAULT_QUESTS = [
  { id: 'checkin', title: 'Điểm Danh Hàng Ngày', desc: 'Mở web và bấm nhận quà điểm danh', xp: 25, rewardXu: 5, icon: 'Gift' },
  { id: 'review_cards', title: 'Ôn Tập 5 Thẻ Flashcard', desc: 'Lật và đánh giá mức độ nhớ 5 thẻ', xp: 25, rewardXu: 0, icon: 'Layers' },
  { id: 'match_game', title: 'Hoàn Thành 1 Trận Ghép Thẻ', desc: 'Chơi chế độ Match Game siêu tốc dưới 45s', xp: 50, rewardXu: 2, icon: 'Gamepad2' },
  { id: 'pomodoro', title: 'Tập Trung 1 Phiên Pomodoro', desc: 'Học tập 25 phút không ngắt quãng', xp: 50, rewardXu: 1, icon: 'Timer' }
];

export function getDailyQuests() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(QUESTS_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === today) {
        return data.quests;
      }
    }
    // New day reset
    const fresh = DEFAULT_QUESTS.map(q => ({ ...q, completed: q.id === 'checkin' ? false : false }));
    localStorage.setItem(QUESTS_KEY, JSON.stringify({ date: today, quests: fresh, bonusClaimed: false }));
    return fresh;
  } catch (e) {
    return DEFAULT_QUESTS.map(q => ({ ...q, completed: false }));
  }
}

export function completeDailyQuest(questId) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const quests = getDailyQuests();
    const updated = quests.map(q => {
      if (q.id === questId && !q.completed) {
        recordStudyAction(q.xp);
        return { ...q, completed: true };
      }
      return q;
    });
    localStorage.setItem(QUESTS_KEY, JSON.stringify({ date: today, quests: updated, bonusClaimed: false }));
    return updated;
  } catch (e) {
    return null;
  }
}

// 7. THEME MANAGER (Light, Dark, Sepia)
const THEME_KEY = 'onthi_app_theme';

export function getAppTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch (e) {
    return 'light';
  }
}

export function setAppTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {}
}

