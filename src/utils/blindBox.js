// Blind Box (Hộp Mù / Túi Mù Tri Thức) Game System
// Gamified mystery box unboxing with Xu currency, drop rate transparency, and multi-open combos

import { getWalletBalance, deductWalletCoins, addWalletCoins } from './wallet';
import { savePurchasedCourse } from './storage';
import { setUserTier } from './userTier';
import { recordStudyAction } from './gamification';

export const BLIND_BOXES = [
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
    description: 'Chỉ 5 Xu thử vận may nhận hoàn Xu lãi lớn, voucher 15K hoặc bộ 60 thẻ thi thử chuẩn.',
    expectedRewards: ['Hoàn 4 - 9 Xu (Có Lãi)', 'Voucher Giảm 15.000đ', 'Bộ 60 Thẻ Đề Thi CBCC'],
    badge: 'DỄ TRÚNG 100%',
    dropRates: [
      { name: 'Hoàn Xu May Mắn (4 - 9 Xu)', rate: '40%', rarity: 'common' },
      { name: 'Voucher Giảm 15.000đ', rate: '35%', rarity: 'common' },
      { name: 'Bộ 60 Thẻ Luật CBCC', rate: '25%', rarity: 'rare' }
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
    description: 'Tỷ lệ rơi thẻ học Anki chuyên sâu cực cao, hoàn tới 27 Xu hoặc nâng cấp Hội Viên Plus.',
    expectedRewards: ['Bộ Thẻ System Design IT', 'Hoàn 16 - 27 Xu', 'Kích Hoạt Gói PLUS'],
    badge: '🔥 BÁN CHẠY NHẤT',
    dropRates: [
      { name: 'Hoàn Xu Lãi (16 - 27 Xu)', rate: '35%', rarity: 'rare' },
      { name: '100 Thẻ IT System Design', rate: '35%', rarity: 'epic' },
      { name: 'Voucher Giảm 20% Toàn Sàn', rate: '20%', rarity: 'rare' },
      { name: 'Nâng Cấp Hội Viên PLUS', rate: '10%', rarity: 'legendary' }
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
    expectedRewards: ['JACKPOT 100 XU', 'Bộ Đôi IELTS 8.0 & N2', 'Thăng Hạng Gói PRO'],
    badge: '✨ NỔ HŨ JACKPOT',
    dropRates: [
      { name: '🎉 NỔ HŨ JACKPOT: 100 XU', rate: '20%', rarity: 'secret' },
      { name: 'Bộ Đôi Thẻ Vàng IELTS & N2', rate: '40%', rarity: 'epic' },
      { name: 'Thăng Hạng Hội Viên PRO', rate: '40%', rarity: 'legendary' }
    ]
  }
];

// Sample live rolling ticker of recent big winners for viral social proof
export function getRecentBlindBoxWinners() {
  return [
    { user: 'hoang_long_neu', box: 'Rương ULTRA', reward: '🎉 NỔ HŨ JACKPOT 100 XU', time: '2 phút trước' },
    { user: 'minh_thu_ielts', box: 'Hộp VIP', reward: '👑 Gói Hội Viên PLUS', time: '5 phút trước' },
    { user: 'trong_nghia_yhn', box: 'Túi May Mắn', reward: '🪙 Hoàn 8 Xu (Lãi 60%)', time: '8 phút trước' },
    { user: 'thanh_tung_it', box: 'Hộp VIP', reward: '💻 100 Thẻ System Design', time: '11 phút trước' },
    { user: 'phuong_mai_jp', box: 'Rương ULTRA', reward: '🌟 Bộ Đôi IELTS & N2', time: '14 phút trước' }
  ];
}

/**
 * Roll single reward calculation
 */
function rollSingleReward(boxId) {
  const roll = Math.random() * 100;

  if (boxId === 'bronze') {
    if (roll < 40) {
      const wonXu = Math.floor(Math.random() * 6) + 4; // 4 - 9 Xu
      addWalletCoins(wonXu, 'Thưởng mở Túi Mù Đồng');
      return {
        type: 'xu',
        rarity: wonXu >= 7 ? 'rare' : 'common',
        rarityLabel: wonXu >= 7 ? 'HIẾM (RARE)' : 'PHỔ THÔNG (COMMON)',
        title: `+${wonXu} Xu Vào Ví`,
        description: `Chúc mừng bạn đã hoàn lại ${wonXu} Xu (lãi ${Math.max(0, wonXu - 5)} Xu so với giá mở túi)!`,
        icon: '🪙'
      };
    } else if (roll < 75) {
      return {
        type: 'voucher',
        rarity: 'common',
        rarityLabel: 'PHỔ THÔNG (COMMON)',
        title: 'Voucher Giảm 15.000đ Toàn Sàn',
        description: 'Mã: PASSNHANH - Giảm ngay 15.000đ khi thanh toán đơn bất kỳ!',
        code: 'PASSNHANH',
        icon: '🎟️'
      };
    } else {
      savePurchasedCourse('cong-chuc-2026');
      return {
        type: 'deck',
        rarity: 'rare',
        rarityLabel: 'HIẾM (RARE)',
        title: 'Mở Khóa: Bộ Đề 60 Câu Trọng Tâm Luật CBCC',
        description: 'Bộ thẻ trị giá 189.000đ đã tự động chuyển thẳng vào "Tủ Của Tôi"!',
        icon: '🗂️'
      };
    }
  } else if (boxId === 'silver') {
    if (roll < 35) {
      const wonXu = Math.floor(Math.random() * 12) + 16; // 16 - 27 Xu
      addWalletCoins(wonXu, 'Thưởng mở Hộp Mù Bạc');
      return {
        type: 'xu',
        rarity: 'rare',
        rarityLabel: 'HIẾM (RARE)',
        title: `+${wonXu} Xu May Mắn`,
        description: `Số dư ví đã được cộng thêm ${wonXu} Xu thành công!`,
        icon: '🪙'
      };
    } else if (roll < 70) {
      savePurchasedCourse('it-system-design');
      return {
        type: 'deck',
        rarity: 'epic',
        rarityLabel: 'SỬ THI (EPIC)',
        title: 'Mở Khóa: 100 Thẻ System Design & Backend Architecture',
        description: 'Tài liệu độc quyền phỏng vấn IT đã được thêm vào thư viện của bạn.',
        icon: '💻'
      };
    } else if (roll < 90) {
      return {
        type: 'voucher',
        rarity: 'rare',
        rarityLabel: 'HIẾM (RARE)',
        title: 'Voucher Giảm 20% (VIP2026)',
        description: 'Áp dụng giảm 20% cho tất cả khóa học và combo trọn đời.',
        code: 'VIP2026',
        icon: '🎟️'
      };
    } else {
      setUserTier('plus');
      return {
        type: 'tier',
        rarity: 'legendary',
        rarityLabel: 'HUYỀN THOẠI (LEGENDARY)',
        title: 'Kích Hoạt: Gói Hội Viên PLUS 2026',
        description: 'Mở rộng hạn mức tạo thẻ AI 15 lượt/ngày và phí sàn giảm còn 8%!',
        icon: '👑'
      };
    }
  } else {
    // Gold box
    if (roll < 20) {
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
    } else if (roll < 60) {
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
    } else {
      setUserTier('pro');
      return {
        type: 'tier',
        rarity: 'legendary',
        rarityLabel: 'HUYỀN THOẠI (LEGENDARY)',
        title: 'Thăng Hạng: Hội Viên PRO (Chuyên Nghiệp)',
        description: 'Hạn mức tạo thẻ 30 lượt/ngày + Đầy đủ quyền bán thẻ C2C phí sàn siêu thấp 5%!',
        icon: '💎'
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
