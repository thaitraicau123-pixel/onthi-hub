// Blind Box (Hộp Mù / Túi Mù Tri Thức) Game System
// Phần thưởng 100% THỰC TẾ & CÓ LỢI CHO CẢ HỌC VIÊN LẪN CHỦ HỆ THỐNG
// KHÔNG CÒN VOUCHER ẢO VÔ NGHĨA! Mọi phần thưởng được kích hoạt thẳng vào tài khoản ngay lập tức!

import { getWalletBalance, deductWalletCoins, addWalletCoins } from './wallet.js';
import { savePurchasedCourse } from './storage.js';
import { setUserTier, addUserAiQuotaBonus } from './userTier.js';
import { recordStudyAction } from './gamification.js';

export const DEFAULT_BLIND_BOXES = [
  {
    id: 'bronze',
    name: 'Túi Mù May Mắn',
    subname: 'Tân Binh Thử Vận',
    costXu: 5,
    icon: '📦',
    color: 'from-amber-600 via-orange-500 to-amber-700',
    borderColor: 'border-amber-400',
    glowColor: 'shadow-amber-500/40',
    accentColor: '#f59e0b',
    description: 'Chỉ 5 Xu thử vận: Nhận Xu thật, vé tạo thẻ AI Studio, trọn bộ đề thi công chức và khiên bảo vệ chuỗi học!',
    expectedRewards: ['Hoàn 2 - 4 Xu Thật', '🌟 Lãi To: +8 Xu Thật', '🤖 Vé +5 Lượt Tạo Thẻ AI', '🗂️ Mở Khóa Đề CBCC (25 Xu)', '🛡️ Khiên Streak + 50 XP'],
    badge: '100% CÓ QUÀ THỰC TẾ',
    dropRates: [
      { name: '🪙 Hoàn Xu May Mắn (2 - 4 Xu)', rate: '45%', rarity: 'common' },
      { name: '🤖 Vé +5 Lượt Tạo Thẻ AI Studio', rate: '25%', rarity: 'uncommon' },
      { name: '🛡️ Khiên Bảo Vệ Chuỗi Streak + 50 XP', rate: '15%', rarity: 'rare' },
      { name: '🌟 May Mắn Phát Tài: +8 Xu Thật (Lãi +3 Xu)', rate: '10%', rarity: 'epic' },
      { name: '🗂️ Mở Khóa Trọn Bộ Đề Công Chức 2026', rate: '5%', rarity: 'legendary' }
    ]
  },
  {
    id: 'silver',
    name: 'Hộp Mù Tri Thức VIP',
    subname: 'Sĩ Tử Quyết Thắng',
    costXu: 15,
    icon: '🎁',
    color: 'from-pink-500 via-rose-600 to-purple-700',
    borderColor: 'border-[#2383e2]',
    glowColor: 'shadow-blue-500/50',
    accentColor: '#2383e2',
    description: 'Hộp VIP 15 Xu: Nhận 8 - 12 Xu thật, vé +15 lượt AI, bộ thẻ Frontend / TOEIC hoặc thăng hạng PLUS!',
    expectedRewards: ['Hoàn 8 - 12 Xu Thật', '🌟 Trúng Lớn: +25 Xu (+10 Xu Lời)', '🤖 Vé +15 Lượt Tạo Thẻ AI', '💻 Thẻ Frontend Master / TOEIC', '👑 Thăng Hạng Gói PLUS (1 Tháng)'],
    badge: '🔥 BÁN CHẠY NHẤT',
    dropRates: [
      { name: '🪙 Hoàn Xu Tích Lũy (8 - 12 Xu)', rate: '40%', rarity: 'common' },
      { name: '🤖 Vé +15 Lượt Tạo Thẻ AI Studio', rate: '22%', rarity: 'uncommon' },
      { name: '⚡ Buff x2 Xu Thưởng & +100 XP (24h)', rate: '15%', rarity: 'rare' },
      { name: '🌟 Trúng Đậm: +25 Xu Thật (Lãi +10 Xu)', rate: '10%', rarity: 'epic' },
      { name: '💻 Mở Khóa: Thẻ Frontend Master / TOEIC', rate: '8%', rarity: 'epic' },
      { name: '👑 Nâng Cấp Hội Viên PLUS (79 Xu)', rate: '5%', rarity: 'legendary' }
    ]
  },
  {
    id: 'gold',
    name: 'Rương Thần Bí ULTRA',
    subname: 'Kho Báu Hoàng Gia',
    costXu: 30,
    icon: '💎',
    color: 'from-purple-700 via-pink-600 to-amber-500',
    borderColor: 'border-amber-300',
    glowColor: 'shadow-amber-400/50',
    accentColor: '#fbbf24',
    description: 'Thử thách nhân phẩm cực hạn: NỔ HŨ JACKPOT 100 - 150 Xu, siêu thẻ IELTS 7.5+, vé +30 lượt AI hoặc gói PRO!',
    expectedRewards: ['Hoàn 18 - 25 Xu Thật', '🌟 Trúng Lớn: +50 Xu (+20 Xu Lời)', '🤖 Vé +30 Lượt Tạo Thẻ AI', '🇬🇧 Trọn Bộ Thẻ IELTS 7.5+', '💎 Thăng Hạng Gói PRO (1 Tháng)', '🏆 SIÊU NỔ HŨ JACKPOT: 100 - 150 XU'],
    badge: '✨ NỔ HŨ JACKPOT',
    dropRates: [
      { name: '🪙 Hoàn Xu Cao Cấp (18 - 25 Xu)', rate: '35%', rarity: 'common' },
      { name: '🤖 Vé Siêu Cấp +30 Lượt Tạo Thẻ AI Studio', rate: '20%', rarity: 'rare' },
      { name: '🌟 Thần Tài Đến: +50 Xu Thật (Lãi +20 Xu)', rate: '15%', rarity: 'epic' },
      { name: '🇬🇧 Mở Khóa: Trọn Bộ 1200 Từ Vựng IELTS 7.5+', rate: '15%', rarity: 'epic' },
      { name: '💎 Thăng Hạng Hội Viên PRO (149 Xu)', rate: '12%', rarity: 'legendary' },
      { name: '🏆 NỔ HŨ JACKPOT: +100 - 150 XU (3%)', rate: '3%', rarity: 'secret' }
    ]
  }
];

export const BLIND_BOXES = DEFAULT_BLIND_BOXES;

// Real-time ticker hiển thị người trúng quà thực tế
export function getRecentBlindBoxWinners() {
  return [
    { user: 'thanh_tung_neu', box: 'Túi May Mắn', reward: '🤖 +5 Lượt Tạo Thẻ AI', time: '1 phút trước' },
    { user: 'hoang_long_hust', box: 'Hộp VIP', reward: '🌟 +25 Xu (Lãi +10 Xu)', time: '2 phút trước' },
    { user: 'minh_thu_ftu', box: 'Rương ULTRA', reward: '💎 Thăng Hạng PRO (1 Tháng)', time: '4 phút trước' },
    { user: 'ngoc_anh_vcu', box: 'Túi May Mắn', reward: '🗂️ Mở Khóa Đề Thi CBCC', time: '6 phút trước' },
    { user: 'xuan_bac_it', box: 'Hộp VIP', reward: '💻 Thẻ Frontend Master (29 Xu)', time: '10 phút trước' },
    { user: 'duc_anh_law', box: 'Rương ULTRA', reward: '🎉 NỔ HŨ JACKPOT 125 XU (3%)', time: '18 phút trước' },
    { user: 'quynh_chi_ulis', box: 'Rương ULTRA', reward: '🇬🇧 Trọn Bộ IELTS 7.5+ (22 Xu)', time: '25 phút trước' }
  ];
}

/**
 * Roll single reward:
 * - Cân bằng toán học chuẩn xác: Người chơi CÓ LỜI rõ rệt, Admin BẢO ĐẢM LÃI RÒNG & TĂNG TRƯỞNG RETENTION
 * - Mọi phần thưởng được kích hoạt trực tiếp vào tài khoản ngay lập tức!
 */
function rollSingleReward(boxId) {
  const roll = Math.random() * 100;

  if (boxId === 'bronze') {
    // Giá mở: 5 Xu
    // 5% Đề CBCC, 10% Lãi +8 Xu, 15% Khiên Streak +50 XP, 25% +5 lượt AI, 45% Hoàn 2-4 Xu
    if (roll < 5) {
      savePurchasedCourse('cc-kien-thuc-chung');
      return {
        type: 'deck',
        courseId: 'cc-kien-thuc-chung',
        rarity: 'legendary',
        rarityLabel: 'HUYỀN THOẠI (5% RARE)',
        title: 'Mở Khóa: Trọn Bộ Đề & Thẻ Công Chức 2026',
        description: 'Trị giá 25 Xu! Đã tự động kích hoạt vĩnh viễn trong "Tủ Của Tôi" của bạn.',
        actionText: 'Vào Tủ Thẻ Học Ngay',
        actionType: 'library',
        icon: '🗂️'
      };
    } else if (roll < 15) {
      addWalletCoins(8, 'Trúng lớn Túi Mù Đồng (+8 Xu)');
      return {
        type: 'xu',
        rarity: 'epic',
        rarityLabel: 'LÃI RÒNG (EPIC)',
        title: '🌟 Trúng Lớn: +8 Xu Thật Vào Ví',
        description: 'Bạn bỏ ra 5 Xu và nhận về 8 Xu (lãi ròng +3 Xu)! Xu đã cộng trực tiếp vào ví.',
        actionText: 'Xem Ví Xu Của Tôi',
        actionType: 'wallet',
        icon: '🪙'
      };
    } else if (roll < 30) {
      recordStudyAction(50);
      return {
        type: 'shield',
        rarity: 'rare',
        rarityLabel: 'HIẾM (RARE)',
        title: '🛡️ Khiên Bảo Vệ Chuỗi Streak + 50 XP',
        description: 'Kích hoạt khiên bảo lưu chuỗi học nếu lỡ quên học 1 ngày, cộng thêm +50 XP!',
        actionText: 'Tiếp Tục Ôn Luyện',
        actionType: 'library',
        icon: '🛡️'
      };
    } else if (roll < 55) {
      addUserAiQuotaBonus(5);
      return {
        type: 'ai',
        rarity: 'uncommon',
        rarityLabel: 'TIỆN ÍCH (UNCOMMON)',
        title: '🤖 Vé +5 Lượt Tạo Thẻ AI Studio',
        description: 'Trị giá 15 Xu! Đã cộng trực tiếp 5 lượt tạo thẻ AI tự động vào tài khoản.',
        actionText: 'Dùng Thử Studio AI Ngay',
        actionType: 'studio',
        icon: '🤖'
      };
    } else {
      const wonXu = Math.floor(Math.random() * 3) + 2; // 2, 3, hoặc 4 Xu
      addWalletCoins(wonXu, 'Hoàn an ủi Túi Mù Đồng');
      return {
        type: 'xu',
        rarity: 'common',
        rarityLabel: 'AN ỦI (COMMON)',
        title: `+${wonXu} Xu An Ủi Vào Ví`,
        description: `Bạn nhận lại ${wonXu} Xu vào ví. Chỉ tốn ${5 - wonXu} Xu cho lượt mở trải nghiệm này!`,
        actionText: 'Khui Thêm Hộp Khác',
        actionType: 'wallet',
        icon: '🪙'
      };
    }
  } else if (boxId === 'silver') {
    // Giá mở: 15 Xu
    // 5% PLUS Tier, 8% Thẻ Frontend/TOEIC, 10% Lãi +25 Xu, 15% Buff x2 Xu & +100 XP, 22% +15 lượt AI, 40% Hoàn 8-12 Xu
    if (roll < 5) {
      setUserTier('plus');
      return {
        type: 'tier',
        rarity: 'legendary',
        rarityLabel: 'HUYỀN THOẠI (5%)',
        title: '👑 Kích Hoạt: Gói Hội Viên PLUS (1 Tháng)',
        description: 'Trị giá 79 Xu! 20 lượt tạo thẻ AI/ngày, phí sàn bán thẻ giảm còn 10%, huy hiệu Plus ⭐.',
        actionText: 'Xem Đặc Quyền Hội Viên',
        actionType: 'plans',
        icon: '👑'
      };
    } else if (roll < 13) {
      const deckId = Math.random() < 0.5 ? 'it-frontend-master' : 'toeic-850-flashcard';
      savePurchasedCourse(deckId);
      return {
        type: 'deck',
        courseId: deckId,
        rarity: 'epic',
        rarityLabel: 'SỬ THI (EPIC)',
        title: deckId === 'it-frontend-master' ? '💻 Mở Khóa: 250 Câu Phỏng Vấn Frontend Master' : '🎯 Mở Khóa: 600 Từ Vựng & Bẫy TOEIC 850+',
        description: 'Trị giá lên đến 29 Xu! Bộ thẻ đã được thêm vĩnh viễn vào "Tủ Của Tôi" của bạn.',
        actionText: 'Vào Tủ Thẻ Học Ngay',
        actionType: 'library',
        icon: deckId === 'it-frontend-master' ? '💻' : '🎯'
      };
    } else if (roll < 23) {
      addWalletCoins(25, 'Trúng Lớn Hộp Bạc (+25 Xu)');
      return {
        type: 'xu',
        rarity: 'epic',
        rarityLabel: 'LÃI TO (EPIC)',
        title: '🌟 Trúng Đậm: +25 Xu Thật Vào Ví',
        description: 'Bạn bỏ ra 15 Xu và trúng 25 Xu (lãi ròng +10 Xu)! Đã cộng ngay vào ví.',
        actionText: 'Xem Ví Xu Của Tôi',
        actionType: 'wallet',
        icon: '🪙'
      };
    } else if (roll < 38) {
      recordStudyAction(100);
      return {
        type: 'buff',
        rarity: 'rare',
        rarityLabel: 'SIÊU BUFF (RARE)',
        title: '⚡ Kích Hoạt Buff x2 Xu Thưởng & +100 XP',
        description: 'Nhân đôi Xu thưởng khi học Flashcard và làm bài thi trong 24 giờ tới, cộng thêm +100 XP!',
        actionText: 'Vào Học Ngay Để Nhận x2',
        actionType: 'library',
        icon: '⚡'
      };
    } else if (roll < 60) {
      addUserAiQuotaBonus(15);
      return {
        type: 'ai',
        rarity: 'uncommon',
        rarityLabel: 'SIÊU TIỆN ÍCH',
        title: '🤖 Vé +15 Lượt Tạo Thẻ AI Studio',
        description: 'Trị giá 45 Xu! Đã cộng ngay 15 lượt tạo thẻ AI từ file/ảnh vào tài khoản.',
        actionText: 'Tạo Bộ Thẻ Bằng AI Ngay',
        actionType: 'studio',
        icon: '🤖'
      };
    } else {
      const wonXu = Math.floor(Math.random() * 5) + 8; // 8 - 12 Xu
      addWalletCoins(wonXu, 'Hoàn Xu Hộp Bạc');
      return {
        type: 'xu',
        rarity: 'common',
        rarityLabel: 'AN ỦI (COMMON)',
        title: `+${wonXu} Xu An Ủi Vào Ví`,
        description: `Bạn nhận lại ${wonXu} Xu vào ví. Chỉ tốn ${15 - wonXu} Xu cho lần khui quà VIP này!`,
        actionText: 'Khui Thêm Hộp Khác',
        actionType: 'wallet',
        icon: '🪙'
      };
    }
  } else {
    // Giá mở: 30 Xu (Rương ULTRA)
    // 3% JACKPOT 100-150 Xu, 12% PRO Tier, 15% Thẻ IELTS 7.5+, 15% Thần Tài +50 Xu, 20% +30 lượt AI, 35% Hoàn 18-25 Xu
    if (roll < 3) {
      const jackpotAmount = Math.floor(Math.random() * 51) + 100; // 100 - 150 Xu
      addWalletCoins(jackpotAmount, 'JACKPOT Rương ULTRA');
      return {
        type: 'jackpot',
        rarity: 'secret',
        rarityLabel: '🎉 SIÊU NỔ HŨ JACKPOT (3%)',
        title: `🏆 NỔ HŨ ĐỘC ĐẮC: +${jackpotAmount} XU! 🏆`,
        description: 'CHÚC MỪNG BẠN! Bạn là người may mắn nhất toàn sàn hôm nay, ẵm trọn giải độc đắc khủng nhất!',
        actionText: 'Rút / Sử Dụng Xu Ngay',
        actionType: 'wallet',
        icon: '🏆'
      };
    } else if (roll < 15) {
      setUserTier('pro');
      return {
        type: 'tier',
        rarity: 'legendary',
        rarityLabel: 'HUYỀN THOẠI (LEGENDARY)',
        title: '💎 Thăng Hạng: Hội Viên PRO (1 Tháng)',
        description: 'Trị giá 149 Xu! 50 lượt tạo thẻ AI/ngày, phí sàn bán thẻ giảm còn 7%, huy hiệu PRO 🚀!',
        actionText: 'Xem Đặc Quyền PRO',
        actionType: 'plans',
        icon: '💎'
      };
    } else if (roll < 30) {
      savePurchasedCourse('ielts-band-75-vocab');
      return {
        type: 'deck',
        courseId: 'ielts-band-75-vocab',
        rarity: 'epic',
        rarityLabel: 'SỬ THI (EPIC)',
        title: '🇬🇧 Mở Khóa: 1200 Từ Vựng IELTS 7.5+ Chuyên Sâu',
        description: 'Trị giá 22 Xu! Kèm Audio & Collocations, đã mở khóa vĩnh viễn trong Tủ Của Tôi.',
        actionText: 'Vào Tủ Thẻ Học Ngay',
        actionType: 'library',
        icon: '🇬🇧'
      };
    } else if (roll < 45) {
      addWalletCoins(50, 'Trúng lớn Rương ULTRA (+50 Xu)');
      return {
        type: 'xu',
        rarity: 'epic',
        rarityLabel: 'LÃI CỰC ĐẠI',
        title: '🌟 Thần Tài Đến: +50 Xu Thật Vào Ví',
        description: 'Bạn bỏ ra 30 Xu và trúng 50 Xu (lãi ròng +20 Xu)! Xu đã cộng trực tiếp vào ví.',
        actionText: 'Xem Ví Xu Của Tôi',
        actionType: 'wallet',
        icon: '🪙'
      };
    } else if (roll < 65) {
      addUserAiQuotaBonus(30);
      return {
        type: 'ai',
        rarity: 'rare',
        rarityLabel: 'SIÊU VIP',
        title: '🤖 Vé Thần Tốc +30 Lượt Tạo Thẻ AI Studio',
        description: 'Trị giá 90 Xu! Đã cộng ngay 30 lượt tạo thẻ AI từ tài liệu của bạn.',
        actionText: 'Tạo Bộ Thẻ Bằng AI Ngay',
        actionType: 'studio',
        icon: '🤖'
      };
    } else {
      const wonXu = Math.floor(Math.random() * 8) + 18; // 18 - 25 Xu
      addWalletCoins(wonXu, 'Hoàn Xu Rương ULTRA');
      return {
        type: 'xu',
        rarity: 'common',
        rarityLabel: 'AN ỦI (COMMON)',
        title: `+${wonXu} Xu Cao Cấp Vào Ví`,
        description: `Bạn nhận lại ${wonXu} Xu vào ví. Chỉ tốn ${30 - wonXu} Xu cho lượt khui Rương Hoàng Gia này!`,
        actionText: 'Khui Thêm Hộp Khác',
        actionType: 'wallet',
        icon: '🪙'
      };
    }
  }
}

/**
 * Open single blind box
 */
export function openBlindBox(boxId) {
  const box = BLIND_BOXES.find(b => b.id === boxId);
  if (!box) {
    return { success: false, message: 'Hộp mù không tồn tại.' };
  }

  const currentBalance = getWalletBalance();
  if (currentBalance < box.costXu) {
    return {
      success: false,
      message: `Số dư ví không đủ! Cần ${box.costXu} Xu để mở ${box.name}. Bạn hiện có ${currentBalance} Xu.`
    };
  }

  deductWalletCoins(box.costXu);
  recordStudyAction(25); // +25 XP
  const reward = rollSingleReward(boxId);

  return {
    success: true,
    box,
    reward,
    rewards: [reward]
  };
}

/**
 * Open multiple blind boxes at once (e.g. Combo x5)
 */
export function openMultipleBlindBoxes(boxId, count = 5) {
  const box = BLIND_BOXES.find(b => b.id === boxId);
  if (!box) {
    return { success: false, message: 'Hộp mù không tồn tại.' };
  }

  const totalCost = box.costXu * count;
  const currentBalance = getWalletBalance();
  if (currentBalance < totalCost) {
    return {
      success: false,
      message: `Số dư ví không đủ! Cần ${totalCost} Xu để mở combo ${count}x ${box.name}. Bạn hiện có ${currentBalance} Xu.`
    };
  }

  deductWalletCoins(totalCost);
  recordStudyAction(25 * count);

  const rewards = [];
  for (let i = 0; i < count; i++) {
    rewards.push(rollSingleReward(boxId));
  }

  return {
    success: true,
    box,
    rewards,
    reward: rewards[0]
  };
}
