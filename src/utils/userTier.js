// Tier Limits & Quotas configuration (Admin can customize)
import { getHanoiDateString, recordStudyTimeLog } from './hanoiTime.js';
import { isUserAdmin } from './adminGuard.js';

const TIER_LIMITS_KEY = 'onthi_tier_limits';
const USER_TIER_KEY = 'onthi_user_tier';
const USER_QUOTA_KEY = 'onthi_user_quota';

export const DEFAULT_TIER_LIMITS = {
  free: {
    name: 'Gói Free (Học Sinh / Khởi Đầu)',
    dailyLimit: 3,        // Chỉ 3 lượt tạo thẻ AI/thủ công mỗi ngày
    checkInBonus: 1,      // Điểm danh mỗi ngày chỉ tặng duy nhất +1 lượt tạo thẻ miễn phí (ít thôi để tối ưu lợi nhuận)
    marketplaceFee: 15,   // Phí sàn 15% khi bán thẻ
    color: 'slate',
    badge: 'Miễn Phí'
  },
  plus: {
    name: 'Gói Plus (Cày Đề & Thi Thử)',
    dailyLimit: 20,       // 20 lượt tạo mỗi ngày
    checkInBonus: 2,      // Điểm danh tặng 2 lượt
    marketplaceFee: 10,   // Phí sàn 10%
    color: 'blue',
    badge: 'Thành Viên Plus ⭐'
  },
  pro: {
    name: 'Gói Pro (Chuyên Sâu & Luyện Thi)',
    dailyLimit: 50,       // 50 lượt tạo mỗi ngày
    checkInBonus: 3,      // Điểm danh tặng 3 lượt
    marketplaceFee: 7,    // Phí sàn 7%
    color: 'indigo',
    badge: 'Chuyên Gia Pro 🚀'
  },
  ultra: {
    name: 'Gói Ultra (Creator & Full Quyền VIP)',
    dailyLimit: 9999,     // Không giới hạn
    checkInBonus: 5,      // Điểm danh tặng 5 lượt
    marketplaceFee: 3,    // Phí sàn chỉ 3%
    color: 'amber',
    badge: 'Creator Ultra 👑'
  }
};

// Get current tier configuration (Customizable by Admin)
export function getTierLimits() {
  try {
    const raw = localStorage.getItem(TIER_LIMITS_KEY);
    return raw ? { ...DEFAULT_TIER_LIMITS, ...JSON.parse(raw) } : DEFAULT_TIER_LIMITS;
  } catch (e) {
    return DEFAULT_TIER_LIMITS;
  }
}

// Admin saves updated tier configuration
export function saveTierLimits(newLimits) {
  try {
    localStorage.setItem(TIER_LIMITS_KEY, JSON.stringify(newLimits));
    return true;
  } catch (e) {
    console.error('Failed to save tier limits', e);
    return false;
  }
}

// Get user current tier
export function getUserTier() {
  try {
    return localStorage.getItem(USER_TIER_KEY) || 'free';
  } catch (e) {
    return 'free';
  }
}

// Set user tier
export function setUserTier(tier) {
  try {
    localStorage.setItem(USER_TIER_KEY, tier);
  } catch (e) {
    console.error('Failed to set user tier', e);
  }
}

// Check if user has permission to post threads or write comments in community forum
// Admin is always allowed; regular students must have a paid tier ('plus', 'pro', 'ultra')
export function canUserParticipateInCommunity(user) {
  if (isUserAdmin(user)) return true;
  const tier = (user?.tier || getUserTier() || 'free').toLowerCase();
  return ['plus', 'pro', 'ultra'].includes(tier);
}

// Get Today String (YYYY-MM-DD theo múi giờ Hà Nội GMT+7)
function getTodayString() {
  return getHanoiDateString();
}

// Get user quota state
export function getUserQuota() {
  const today = getTodayString();
  const tier = getUserTier();
  const limits = getTierLimits()[tier] || DEFAULT_TIER_LIMITS.free;

  try {
    const raw = localStorage.getItem(USER_QUOTA_KEY);
    let quota = raw ? JSON.parse(raw) : null;

    if (!quota || quota.date !== today) {
      // New day: reset daily quota, keep carryover bonus
      quota = {
        date: today,
        usedToday: 0,
        bonusEarned: quota && quota.bonusEarned ? quota.bonusEarned : 0,
        lastCheckInDate: quota ? quota.lastCheckInDate : ''
      };
      localStorage.setItem(USER_QUOTA_KEY, JSON.stringify(quota));
    }

    const totalAllowed = limits.dailyLimit + (quota.bonusEarned || 0);
    const remaining = Math.max(0, totalAllowed - (quota.usedToday || 0));

    return {
      tier,
      tierConfig: limits,
      dailyLimit: limits.dailyLimit,
      usedToday: quota.usedToday || 0,
      bonusEarned: quota.bonusEarned || 0,
      totalAllowed,
      remaining,
      canCreate: remaining > 0,
      isCheckedInToday: quota.lastCheckInDate === today
    };
  } catch (e) {
    return {
      tier: 'free',
      tierConfig: DEFAULT_TIER_LIMITS.free,
      dailyLimit: 5,
      usedToday: 0,
      bonusEarned: 0,
      totalAllowed: 5,
      remaining: 5,
      canCreate: true,
      isCheckedInToday: false
    };
  }
}

// Consume quota when creating a flashcard deck
export function consumeUserQuota(count = 1) {
  const quotaInfo = getUserQuota();
  if (quotaInfo.remaining < count) return false;

  const today = getTodayString();
  const raw = localStorage.getItem(USER_QUOTA_KEY);
  let quota = raw ? JSON.parse(raw) : { date: today, usedToday: 0, bonusEarned: 0 };
  
  quota.usedToday = (quota.usedToday || 0) + count;
  localStorage.setItem(USER_QUOTA_KEY, JSON.stringify(quota));
  return true;
}

// Perform Daily Check-in (Điểm danh cộng lượt tạo free)
export function performDailyCheckIn() {
  const today = getTodayString();
  const quotaInfo = getUserQuota();

  if (quotaInfo.isCheckedInToday) {
    return { success: false, message: 'Hôm nay bạn đã điểm danh rồi! Hãy quay lại vào ngày mai nhé.' };
  }

  const bonusAmount = quotaInfo.tierConfig.checkInBonus;
  const raw = localStorage.getItem(USER_QUOTA_KEY);
  let quota = raw ? JSON.parse(raw) : { date: today, usedToday: 0, bonusEarned: 0 };

  quota.bonusEarned = (quota.bonusEarned || 0) + bonusAmount;
  quota.lastCheckInDate = today;
  localStorage.setItem(USER_QUOTA_KEY, JSON.stringify(quota));

  // Lưu vết thời gian điểm danh vào hệ thống Giờ Hà Nội
  recordStudyTimeLog({
    type: 'checkin',
    title: 'Điểm danh hàng ngày nhận thưởng lượt tạo thẻ',
    durationMinutes: 1,
    xpGained: 25
  });

  return {
    success: true,
    bonus: bonusAmount,
    message: `🎉 Điểm danh thành công! Bạn được cộng thêm +${bonusAmount} lượt tạo thẻ Flashcard hôm nay!`
  };
}

// Add bonus AI generation quota (from rewards, blind boxes, gifts)
export function addUserAiQuotaBonus(amount = 5) {
  const today = getTodayString();
  const raw = localStorage.getItem(USER_QUOTA_KEY);
  let quota = raw ? JSON.parse(raw) : { date: today, usedToday: 0, bonusEarned: 0 };

  quota.bonusEarned = (quota.bonusEarned || 0) + amount;
  localStorage.setItem(USER_QUOTA_KEY, JSON.stringify(quota));
  return quota.bonusEarned;
}
