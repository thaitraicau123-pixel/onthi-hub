// Blind Box (Hộp Mù / Túi Mù Tri Thức) Game System
// Tư bản siêu lợi nhuận: Tỷ lệ trúng đồ giá trị cao siêu thấp, người chơi luôn bị hút Xu, Nhà cái luôn thắng!

import { getWalletBalance, deductWalletCoins, addWalletCoins } from './wallet';
import { savePurchasedCourse } from './storage';
import { setUserTier } from './userTier';
import { recordStudyAction } from './gamification';

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
    description: 'Chỉ 5 Xu thử vận may nhận voucher ưu đãi hoặc bộ thẻ thi thử công chức.',
    expectedRewards: ['Voucher Giảm 10.000đ', 'Hoàn Xu An Ủi (1 - 3 Xu)', 'Bộ 60 Thẻ Luật CBCC', 'Hòa Vốn (5 Xu)'],
    badge: '100% CÓ QUÀ',
    dropRates: [
      { name: '🪙 Hoàn Xu An Ủi (1 - 3 Xu)', rate: '48%', rarity: 'common' },
      { name: '🎟️ Voucher Giảm 10.000đ (Đơn từ 89K)', rate: '45%', rarity: 'common' },
      { name: '🗂️ Bộ 60 Thẻ Đề Thi CBCC (189K)', rate: '5%', rarity: 'rare' },
      { name: '🌟 Hoàn Vốn May Mắn (5 Xu)', rate: '2%', rarity: 'epic' }
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
    description: 'Cơ hội nhận voucher VIP giảm sâu, tài liệu IT chuyên sâu hoặc gói hội viên.',
    expectedRewards: ['Voucher VIP Giảm 15%', 'Hoàn Xu An Ủi (3 - 7 Xu)', '100 Thẻ IT System Design', 'Kích Hoạt Gói PLUS'],
    badge: '🔥 BÁN CHẠY NHẤT',
    dropRates: [
      { name: '🎟️ Voucher VIP Giảm 15% (Đơn từ 149K)', rate: '50%', rarity: 'common' },
      { name: '🪙 Hoàn Xu An Ủi (3 - 7 Xu)', rate: '42%', rarity: 'common' },
      { name: '💻 100 Thẻ IT System Design', rate: '5%', rarity: 'epic' },
      { name: '👑 Nâng Cấp Hội Viên PLUS', rate: '2.5%', rarity: 'legendary' },
      { name: '🌟 Hoàn Vốn (15 Xu)', rate: '0.5%', rarity: 'secret' }
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
    description: 'Thử thách nhân phẩm cực hạn: NỔ HŨ JACKPOT 100 Xu, siêu thẻ IELTS + N2, hoặc gói PRO!',
    expectedRewards: ['Siêu Voucher Giảm 20%', 'Hoàn Xu An Ủi (5 - 12 Xu)', 'Bộ Đôi Thẻ IELTS & N2', 'Thăng Hạng PRO', 'NỔ HŨ JACKPOT 100 XU'],
    badge: '✨ NỔ HŨ JACKPOT',
    dropRates: [
      { name: '🎟️ Siêu Voucher Giảm 20% (Đơn từ 199K)', rate: '52%', rarity: 'common' },
      { name: '🪙 Hoàn Xu An Ủi (5 - 12 Xu)', rate: '40%', rarity: 'common' },
      { name: '🌟 Bộ Đôi Thẻ Vàng IELTS & N2', rate: '5%', rarity: 'epic' },
      { name: '💎 Thăng Hạng Hội Viên PRO', rate: '2%', rarity: 'legendary' },
      { name: '🎉 NỔ HŨ JACKPOT: 100 XU', rate: '1%', rarity: 'secret' }
    ]
  }
];

export const BLIND_BOXES = DEFAULT_BLIND_BOXES;

// Rolling ticker tạo cảm giác kịch tính, lôi kéo người khác mở theo
export function getRecentBlindBoxWinners() {
  return [
    { user: 'thanh_tung_neu', box: 'Túi May Mắn', reward: '🎟️ Voucher Giảm 10.000đ', time: '1 phút trước' },
    { user: 'hoang_long_hust', box: 'Hộp VIP', reward: '🪙 Hoàn Xu 5 Xu', time: '2 phút trước' },
    { user: 'minh_thu_ftu', box: 'Rương ULTRA', reward: '🎟️ Siêu Voucher 20%', time: '4 phút trước' },
    { user: 'ngoc_anh_vcu', box: 'Túi May Mắn', reward: '🪙 Hoàn Xu 2 Xu', time: '7 phút trước' },
    { user: 'xuan_bac_it', box: 'Rương ULTRA', reward: '🌟 Bộ Đôi IELTS & N2 (Hiếm)', time: '12 phút trước' },
    { user: 'duc_anh_law', box: 'Rương ULTRA', reward: '🎉 NỔ HŨ JACKPOT 100 XU (1%)', time: '25 phút trước' }
  ];
}

/**
 * Roll single reward: Nhà cái ăn tiền 75% - 85%, phần thưởng xịn cực kỳ hiếm!
 */
function rollSingleReward(boxId) {
  const roll = Math.random() * 100;

  if (boxId === 'bronze') {
    // Giá mở: 5 Xu
    // 2% Hòa vốn (5 Xu), 5% Đề CBCC, 48% Hoàn an ủi (1-3 Xu), 45% Voucher 10K
    if (roll < 2) {
      addWalletCoins(5, 'Hòa Vốn Túi Mù Đồng');
      return {
        type: 'xu',
        rarity: 'epic',
        rarityLabel: 'CỰC KỲ MAY MẮN (EPIC)',
        title: '🌟 Hòa Vốn: +5 Xu Vào Ví',
        description: 'Bạn là 2% may mắn hoàn lại nguyên vẹn 5 Xu vốn ban đầu!',
        icon: '🪙'
      };
    } else if (roll < 7) {
      savePurchasedCourse('cong-chuc-2026');
      return {
        type: 'deck',
        rarity: 'rare',
        rarityLabel: 'HIẾM (RARE)',
        title: 'Mở Khóa: Bộ Đề 60 Câu Trọng Tâm Luật CBCC',
        description: 'Tài liệu ôn thi công chức đã tự động thêm vào "Tủ Của Tôi"!',
        icon: '🗂️'
      };
    } else if (roll < 55) {
      // Hoàn an ủi 1 - 3 Xu (Nhà cái luôn lãi ròng 2 - 4 Xu!)
      const wonXu = Math.floor(Math.random() * 3) + 1; // 1, 2, hoặc 3 Xu
      addWalletCoins(wonXu, 'Hoàn an ủi Túi Mù Đồng');
      return {
        type: 'xu',
        rarity: 'common',
        rarityLabel: 'AN ỦI (COMMON)',
        title: `+${wonXu} Xu An Ủi`,
        description: `Bạn nhận lại ${wonXu} Xu an ủi vào ví (chúc bạn may mắn hơn lần sau)!`,
        icon: '🪙'
      };
    } else {
      // Voucher giảm giá ép khách nạp tiền mua đề
      return {
        type: 'voucher',
        rarity: 'common',
        rarityLabel: 'PHỔ THÔNG (COMMON)',
        title: 'Voucher Giảm 10.000đ (Đơn từ 89K)',
        description: 'Mã: ONTHI10K - Áp dụng giảm ngay 10.000đ khi thanh toán đơn từ 89.000đ!',
        code: 'ONTHI10K',
        icon: '🎟️'
      };
    }
  } else if (boxId === 'silver') {
    // Giá mở: 15 Xu
    // 0.5% Hòa vốn (15 Xu), 2.5% PLUS Tier, 5% IT Deck, 42% Hoàn an ủi (3-7 Xu), 50% Voucher 15%
    if (roll < 0.5) {
      addWalletCoins(15, 'Hòa Vốn Hộp Mù Bạc');
      return {
        type: 'xu',
        rarity: 'secret',
        rarityLabel: 'SIÊU KỲ TÍCH (0.5%)',
        title: '🌟 Kỳ Tích: +15 Xu Hòa Vốn',
        description: 'Bạn là 0.5% người chơi may mắn giữ lại trọn vẹn 15 Xu!',
        icon: '🪙'
      };
    } else if (roll < 3) {
      setUserTier('plus');
      return {
        type: 'tier',
        rarity: 'legendary',
        rarityLabel: 'HUYỀN THOẠI (LEGENDARY)',
        title: 'Kích Hoạt: Gói Hội Viên PLUS (1 Tháng)',
        description: 'Đặc quyền tạo thẻ AI 15 lượt/ngày và phí sàn giảm còn 8%!',
        icon: '👑'
      };
    } else if (roll < 8) {
      savePurchasedCourse('it-system-design');
      return {
        type: 'deck',
        rarity: 'epic',
        rarityLabel: 'SỬ THI (EPIC)',
        title: 'Mở Khóa: 100 Thẻ IT System Design & Architecture',
        description: 'Tài liệu độc quyền phỏng vấn IT đã thêm vào tủ thẻ của bạn.',
        icon: '💻'
      };
    } else if (roll < 50) {
      // Hoàn an ủi 3 - 7 Xu (Nhà cái luôn lãi ròng 8 - 12 Xu!)
      const wonXu = Math.floor(Math.random() * 5) + 3; // 3 - 7 Xu
      addWalletCoins(wonXu, 'Hoàn an ủi Hộp Mù Bạc');
      return {
        type: 'xu',
        rarity: 'common',
        rarityLabel: 'AN ỦI (COMMON)',
        title: `+${wonXu} Xu An Ủi`,
        description: `Bạn được hoàn lại ${wonXu} Xu vào ví. Hãy tiếp tục thử vận may nhé!`,
        icon: '🪙'
      };
    } else {
      return {
        type: 'voucher',
        rarity: 'common',
        rarityLabel: 'PHỔ THÔNG (COMMON)',
        title: 'Voucher VIP Giảm 15% (Đơn từ 149K)',
        description: 'Mã: VIP15PERCENT - Áp dụng giảm 15% khi thanh toán đơn từ 149.000đ.',
        code: 'VIP15PERCENT',
        icon: '🎟️'
      };
    }
  } else {
    // Giá mở: 30 Xu (Rương ULTRA)
    // 1% Jackpot (100 Xu), 2% PRO Tier, 5% IELTS+N2 Decks, 40% Hoàn an ủi (5-12 Xu), 52% Voucher 20%
    if (roll < 1) {
      // JACKPOT 100 Xu (Tỷ lệ 1%: 100 người mở thu 3,000 Xu mới trả 100 Xu -> Nhà cái lãi 2,900 Xu!)
      addWalletCoins(100, 'JACKPOT Hộp Mù ULTRA');
      return {
        type: 'jackpot',
        rarity: 'secret',
        rarityLabel: 'NỔ HŨ ĐỘC ĐẮC (1% JACKPOT)',
        title: '🎉 NỔ HŨ JACKPOT: +100 XU! 🎉',
        description: 'CHÚC MỪNG BẠN! Bạn là người may mắn nhất toàn sàn hôm nay với 1% tỷ lệ!',
        icon: '🏆'
      };
    } else if (roll < 3) {
      setUserTier('pro');
      return {
        type: 'tier',
        rarity: 'legendary',
        rarityLabel: 'HUYỀN THOẠI (LEGENDARY)',
        title: 'Thăng Hạng: Hội Viên PRO (1 Tháng)',
        description: 'Hạn mức tạo thẻ 30 lượt/ngày + Quyền bán thẻ C2C phí sàn siêu thấp!',
        icon: '💎'
      };
    } else if (roll < 8) {
      savePurchasedCourse('ielts-collocations');
      savePurchasedCourse('jlpt-n2-kanji');
      return {
        type: 'deck',
        rarity: 'epic',
        rarityLabel: 'SỬ THI (EPIC)',
        title: 'Bộ Đôi Thẻ Vàng: 1200 Từ Vựng IELTS 8.0 & Kanji N2',
        description: 'Cả 2 bộ thẻ trị giá 378.000đ đã được mở khóa vĩnh viễn!',
        icon: '🌟'
      };
    } else if (roll < 48) {
      // Hoàn an ủi 5 - 12 Xu (Nhà cái luôn lãi ròng 18 - 25 Xu mỗi lượt!)
      const wonXu = Math.floor(Math.random() * 8) + 5; // 5 - 12 Xu
      addWalletCoins(wonXu, 'Hoàn an ủi Rương Vàng');
      return {
        type: 'xu',
        rarity: 'common',
        rarityLabel: 'AN ỦI (COMMON)',
        title: `+${wonXu} Xu An Ủi`,
        description: `Bạn nhận lại ${wonXu} Xu an ủi vào ví. Thử lại lần nữa xem sao nhé!`,
        icon: '🪙'
      };
    } else {
      return {
        type: 'voucher',
        rarity: 'common',
        rarityLabel: 'PHỔ THÔNG (COMMON)',
        title: 'Siêu Voucher Giảm 20% (Đơn từ 199K)',
        description: 'Mã: ULTRA20OFF - Giảm ngay 20% khi thanh toán đơn từ 199.000đ.',
        code: 'ULTRA20OFF',
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
