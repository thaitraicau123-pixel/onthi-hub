// Blind Box (Hộp Mù / Túi Mù Tri Thức) Game System
// Gamified mystery box unboxing with Xu currency, drop rate transparency, and multi-open combos

import { getWalletBalance, deductWalletCoins, addWalletCoins } from './wallet';
import { savePurchasedCourse } from './storage';
import { setUserTier } from './userTier';
import { recordStudyAction } from './gamification';

const CUSTOM_RATES_KEY = 'onthi_blind_box_custom_rates';

export const DEFAULT_BLIND_BOXES = [
  {
    id: 'bronze',
    name: 'Túi Mù May Mắn',
    subname: 'Tân Binh Học Bá',
    costXu: 5,
    icon: '📦',
    color: 'from-amber-600 via-orange-500 to-amber-700',
    borderColor: 'border-amber-400',
    glowColor: 'shadow-amber-500/40',
    accentColor: '#f59e0b',
    description: 'Chỉ 5 Xu thử vận may nhận hoàn Xu có lãi, voucher 15K, hoặc mở khóa bộ thẻ trắc nghiệm chuẩn.',
    expectedRewards: ['Mở Khóa Bộ 60 Thẻ CBCC', 'Hoàn 3 - 7 Xu', 'Voucher Giảm 15.000đ', '🎉 Siêu May Mắn (+12 Xu)'],
    badge: 'DỄ TRÚNG 100%',
    dropRates: [
      { name: '🪙 Hoàn Xu May Mắn (3 - 7 Xu)', rate: '40%', rarity: 'common' },
      { name: '🎟️ Voucher Giảm 15.000đ (PASSNHANH)', rate: '30%', rarity: 'common' },
      { name: '🗂️ Bộ 60 Thẻ Luật CBCC (189K)', rate: '25%', rarity: 'rare' },
      { name: '🌟 Siêu May Mắn (+12 Xu)', rate: '5%', rarity: 'epic' }
    ]
  },
  {
    id: 'silver',
    name: 'Hộp Mù Tri Thức VIP',
    subname: 'Sĩ Tử Quyết Thắng',
    costXu: 15,
    icon: '🎁',
    color: 'from-pink-500 via-rose-600 to-purple-700',
    borderColor: 'border-[#f02c85]',
    glowColor: 'shadow-pink-500/50',
    accentColor: '#f02c85',
    description: 'Tỷ lệ rơi thẻ học IT System Design cực cao, hoàn tới 25 Xu hoặc nâng cấp Hội Viên Plus.',
    expectedRewards: ['100 Thẻ IT System Design', 'Hoàn 10 - 25 Xu', 'Voucher VIP Giảm 25.000đ', '👑 Kích Hoạt Gói PLUS'],
    badge: '🔥 BÁN CHẠY NHẤT',
    dropRates: [
      { name: '🪙 Hoàn Xu Lãi (10 - 25 Xu)', rate: '35%', rarity: 'rare' },
      { name: '💻 100 Thẻ IT System Design', rate: '30%', rarity: 'epic' },
      { name: '🎟️ Voucher Giảm 25.000đ (VIP2026)', rate: '25%', rarity: 'rare' },
      { name: '👑 Nâng Cấp Hội Viên PLUS', rate: '10%', rarity: 'legendary' }
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
    description: 'Cơ hội NỔ HŨ JACKPOT 100 Xu (~100K tiền mặt), bộ đôi thẻ IELTS + N2, hoặc thăng hạng PRO!',
    expectedRewards: ['🎉 NỔ HŨ JACKPOT 100 XU', 'Bộ Đôi Thẻ IELTS & N2', 'Thăng Hạng Gói PRO', 'Hoàn 20 - 50 Xu'],
    badge: '✨ NỔ HŨ JACKPOT',
    dropRates: [
      { name: '🌟 Bộ Đôi Thẻ Vàng IELTS & N2', rate: '30%', rarity: 'epic' },
      { name: '🪙 Hoàn Xu May Mắn (20 - 50 Xu)', rate: '25%', rarity: 'rare' },
      { name: '🎟️ Siêu Voucher Giảm 50.000đ', rate: '20%', rarity: 'rare' },
      { name: '💎 Thăng Hạng Hội Viên PRO', rate: '17%', rarity: 'legendary' },
      { name: '🎉 NỔ HŨ JACKPOT: +100 XU', rate: '8%', rarity: 'secret' }
    ]
  }
];

export const BLIND_BOXES = DEFAULT_BLIND_BOXES;

// Sample live rolling ticker of recent big winners for viral social proof
export function getRecentBlindBoxWinners() {
  return [
    { user: 'hoang_long_neu', box: 'Rương ULTRA', reward: '🎉 NỔ HŨ JACKPOT 100 XU', time: '1 phút trước' },
    { user: 'minh_thu_ielts', box: 'Hộp VIP', reward: '👑 Gói Hội Viên PLUS', time: '3 phút trước' },
    { user: 'trong_nghia_yhn', box: 'Túi May Mắn', reward: '🌟 Siêu May Mắn (+12 Xu)', time: '5 phút trước' },
    { user: 'thanh_tung_it', box: 'Hộp VIP', reward: '💻 100 Thẻ System Design', time: '7 phút trước' },
    { user: 'phuong_mai_jp', box: 'Rương ULTRA', reward: '🌟 Bộ Đôi IELTS & N2', time: '10 phút trước' },
    { user: 'bao_ngoc_law', box: 'Túi May Mắn', reward: '🗂️ Bộ 60 Thẻ Đề Thi CBCC', time: '12 phút trước' }
  ];
}

/**
 * Roll single reward calculation with balanced probabilities
 */
function rollSingleReward(boxId) {
  const roll = Math.random() * 100;

  if (boxId === 'bronze') {
    // Bronze: 5 Xu
    // 5% Jackpot (+12 Xu), 25% Deck CBCC, 40% Hoàn Xu (3-7 Xu), 30% Voucher 15K
    if (roll < 5) {
      addWalletCoins(12, 'Siêu May Mắn Túi Mù Đồng');
      return {
        type: 'jackpot',
        rarity: 'epic',
        rarityLabel: 'SIÊU MAY MẮN (EPIC)',
        title: '🌟 +12 Xu Vào Ví (Lãi x2.4)',
        description: 'Bất ngờ nhân đôi tài khoản! Bạn nhận được 12 Xu may mắn vào ví.',
        icon: '🪙'
      };
    } else if (roll < 30) {
      savePurchasedCourse('cong-chuc-2026');
      return {
        type: 'deck',
        rarity: 'rare',
        rarityLabel: 'HIẾM (RARE)',
        title: 'Mở Khóa: Bộ Đề 60 Câu Trọng Tâm Luật CBCC 2026',
        description: 'Bộ thẻ trị giá 189.000đ đã tự động thêm vào "Tủ Của Tôi"!',
        icon: '🗂️'
      };
    } else if (roll < 70) {
      const wonXu = Math.floor(Math.random() * 5) + 3; // 3 - 7 Xu
      addWalletCoins(wonXu, 'Thưởng mở Túi Mù Đồng');
      return {
        type: 'xu',
        rarity: wonXu >= 5 ? 'rare' : 'common',
        rarityLabel: wonXu >= 5 ? 'CÓ LÃI (PROFIT)' : 'HOÀN VỐN (COMMON)',
        title: `+${wonXu} Xu Vào Ví`,
        description: `Chúc mừng bạn đã nhận lại ${wonXu} Xu (chi phí mở chỉ 5 Xu)!`,
        icon: '🪙'
      };
    } else {
      return {
        type: 'voucher',
        rarity: 'common',
        rarityLabel: 'PHỔ THÔNG (COMMON)',
        title: 'Voucher Giảm 15.000đ Toàn Sàn',
        description: 'Mã: PASSNHANH - Giảm ngay 15.000đ khi thanh toán đơn bất kỳ!',
        code: 'PASSNHANH',
        icon: '🎟️'
      };
    }
  } else if (boxId === 'silver') {
    // Silver: 15 Xu
    // 10% PLUS Tier, 30% IT Deck, 35% Hoàn Xu (10-25 Xu), 25% Voucher 25K
    if (roll < 10) {
      setUserTier('plus');
      return {
        type: 'tier',
        rarity: 'legendary',
        rarityLabel: 'HUYỀN THOẠI (LEGENDARY)',
        title: 'Kích Hoạt: Gói Hội Viên PLUS 2026',
        description: 'Mở rộng hạn mức tạo thẻ AI 15 lượt/ngày và phí sàn giảm còn 8%!',
        icon: '👑'
      };
    } else if (roll < 40) {
      savePurchasedCourse('it-system-design');
      return {
        type: 'deck',
        rarity: 'epic',
        rarityLabel: 'SỬ THI (EPIC)',
        title: 'Mở Khóa: 100 Thẻ System Design & Backend Architecture',
        description: 'Tài liệu độc quyền phỏng vấn IT đã được thêm vào thư viện của bạn.',
        icon: '💻'
      };
    } else if (roll < 75) {
      const wonXu = Math.floor(Math.random() * 16) + 10; // 10 - 25 Xu
      addWalletCoins(wonXu, 'Thưởng mở Hộp Mù Bạc');
      return {
        type: 'xu',
        rarity: wonXu >= 15 ? 'rare' : 'common',
        rarityLabel: wonXu >= 15 ? 'HIẾM - LÃI LỚN' : 'HOÀN VỐN',
        title: `+${wonXu} Xu May Mắn`,
        description: `Số dư ví đã được cộng thêm ${wonXu} Xu thành công!`,
        icon: '🪙'
      };
    } else {
      return {
        type: 'voucher',
        rarity: 'rare',
        rarityLabel: 'HIẾM (RARE)',
        title: 'Voucher Giảm 25.000đ (VIP2026)',
        description: 'Áp dụng giảm 25.000đ cho tất cả khóa học và combo trọn đời.',
        code: 'VIP2026',
        icon: '🎟️'
      };
    }
  } else {
    // Gold: 30 Xu
    // 8% Jackpot 100 Xu, 17% PRO Tier, 30% IELTS+N2 Decks, 25% Hoàn Xu (20-50 Xu), 20% Voucher 50K
    if (roll < 8) {
      // JACKPOT!
      addWalletCoins(100, 'JACKPOT Hộp Mù ULTRA');
      return {
        type: 'jackpot',
        rarity: 'secret',
        rarityLabel: 'BÍ MẬT CỰC PHẨM (SECRET JACKPOT)',
        title: '🎉 NỔ HŨ JACKPOT: +100 XU! 🎉',
        description: 'Bạn là người may mắn nhất hôm nay! Nhận ngay 100 Xu (~100.000 VNĐ) tiền mặt!',
        icon: '🏆'
      };
    } else if (roll < 25) {
      setUserTier('pro');
      return {
        type: 'tier',
        rarity: 'legendary',
        rarityLabel: 'HUYỀN THOẠI (LEGENDARY)',
        title: 'Thăng Hạng: Hội Viên PRO (Chuyên Nghiệp)',
        description: 'Hạn mức tạo thẻ 30 lượt/ngày + Đầy đủ quyền bán thẻ C2C phí sàn siêu thấp 5%!',
        icon: '💎'
      };
    } else if (roll < 55) {
      savePurchasedCourse('ielts-collocations');
      savePurchasedCourse('jlpt-n2-kanji');
      return {
        type: 'deck',
        rarity: 'epic',
        rarityLabel: 'SỬ THI (EPIC)',
        title: 'Bộ Đôi Thẻ Vàng: 1200 Từ Vựng IELTS 8.0 & Kanji N2',
        description: 'Cả 2 bộ thẻ trị giá 378.000đ đã được mở khóa vĩnh viễn trong tủ của bạn!',
        icon: '🌟'
      };
    } else if (roll < 80) {
      const wonXu = Math.floor(Math.random() * 31) + 20; // 20 - 50 Xu
      addWalletCoins(wonXu, 'Thưởng mở Hộp Mù Vàng');
      return {
        type: 'xu',
        rarity: wonXu >= 30 ? 'rare' : 'common',
        rarityLabel: wonXu >= 30 ? 'HIẾM - LÃI ĐẬM' : 'AN ỦI (COMMON)',
        title: `+${wonXu} Xu Vào Ví`,
        description: `Chúc mừng bạn đã hoàn lại ${wonXu} Xu vào số dư ví của mình!`,
        icon: '🪙'
      };
    } else {
      return {
        type: 'voucher',
        rarity: 'rare',
        rarityLabel: 'HIẾM (RARE)',
        title: 'Siêu Voucher Giảm 50.000đ (ULTRA50K)',
        description: 'Áp dụng giảm ngay 50.000đ trực tiếp khi thanh toán đơn bất kỳ!',
        code: 'ULTRA50K',
        icon: '🎟️'
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
