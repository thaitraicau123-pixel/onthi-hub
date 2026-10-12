import { getWalletBalance, deductWalletCoins, addWalletCoins } from '../utils/wallet';
import { getUserTier, getTierLimits } from '../utils/userTier';
import { savePurchasedCourse } from '../utils/storage';

const MARKETPLACE_KEY = 'onthi_marketplace_decks';

export const INITIAL_MARKETPLACE_DECKS = [
  {
    id: 'mkt_sat_vocab',
    title: '500 Từ Vựng SAT Advanced Đạt Mốc 1450+ Kèm Câu Mẫu',
    description: 'Tổng hợp từ vựng học thuật hiếm gặp nhưng luôn xuất hiện trong phần Reading & Writing của bài thi Digital SAT mới nhất.',
    category: 'ngoai-ngu',
    categoryName: 'SAT & Ngoại Ngữ',
    priceXu: 25, // 25 Xu = 25.000 VNĐ
    cardCount: 120,
    authorName: 'Minh Thư (IELTS 8.5 / SAT 1520)',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 312,
    rating: 4.95,
    createdAt: '2026-10-01',
    isApproved: true,
    sampleCards: [
      {
        front: 'aberrant /əˈber.ənt/ (adj)',
        back: 'Nghĩa: Khác thường, dị biệt (departing from an accepted standard).\nVí dụ: The scientist noticed aberrant behavior in the lab mice after the test.',
        tag: 'SAT Reading'
      },
      {
        front: 'equivocal /ɪˈkwɪv.ə.kəl/ (adj)',
        back: 'Nghĩa: Mập mờ, không rõ ràng, có nhiều nghĩa nước đôi (ambiguous).\nVí dụ: His equivocal response left the jury uncertain about his guilt.',
        tag: 'SAT Vocabulary'
      }
    ]
  },
  {
    id: 'mkt_sql_interview',
    title: '45 Câu Hỏi SQL & Query Tuning Phỏng Vấn Data Analyst / Engineer',
    description: 'Từ Window Functions (ROW_NUMBER, DENSE_RANK, LEAD, LAG) đến CTE, Index scan và cách tối ưu câu lệnh truy vấn hàng triệu dòng.',
    category: 'it-tech',
    categoryName: 'Data & Lập Trình',
    priceXu: 35, // 35 Xu = 35.000 VNĐ
    cardCount: 45,
    authorName: 'Lê Hoàng (Lead Data Engineer)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    authorTier: 'pro',
    salesCount: 489,
    rating: 5.0,
    createdAt: '2026-10-05',
    isApproved: true,
    sampleCards: [
      {
        front: 'Sự khác biệt giữa RANK() và DENSE_RANK() trong SQL là gì?',
        back: '• RANK(): Bỏ qua thứ hạng kế tiếp nếu có đồng hạng (ví dụ: 1, 2, 2, 4).\n• DENSE_RANK(): KHÔNG bỏ qua thứ hạng kế tiếp (ví dụ: 1, 2, 2, 3).\n\n💡 Dùng DENSE_RANK() khi cần lấy top N mức lương cao nhất.',
        tag: 'SQL Window Functions'
      },
      {
        front: 'Khi nào Database thực hiện INDEX SCAN thay vì INDEX SEEK?',
        back: '• INDEX SEEK: Nhảy trực tiếp tới dữ liệu cần tìm nhờ cấu trúc B-Tree (khi có điều kiện WHERE cột có index = hoặc khoảng hẹp).\n• INDEX SCAN: Quét tuần tự toàn bộ các node của Index khi điều kiện không sargable (dùng hàm LIKE \'%abc\' hoặc WHERE UPPER(name)).',
        tag: 'SQL Performance'
      }
    ]
  },
  {
    id: 'mkt_vien_chuc_y_te',
    title: 'Bộ Đề & Flashcard Thi Tuyển Viên Chức Y Tế 2026 (Luật Khám Bệnh Chữa Bệnh)',
    description: 'Cập nhật toàn diện Luật Khám bệnh, chữa bệnh 2023 có hiệu lực mới nhất, quy chuẩn đạo đức nghề nghiệp và quy tắc ứng xử của nhân viên y tế.',
    category: 'cong-chuc',
    categoryName: 'Viên Chức Y Tế',
    priceXu: 30, // 30 Xu = 30.000 VNĐ
    cardCount: 85,
    authorName: 'Bác Sĩ Trọng Nghĩa (Bệnh Viện Bạch Mai)',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
    authorTier: 'pro',
    salesCount: 215,
    rating: 4.88,
    createdAt: '2026-10-08',
    isApproved: true,
    sampleCards: [
      {
        front: 'Người hành nghề khám bệnh, chữa bệnh có nghĩa vụ cập nhật kiến thức y khoa liên tục như thế nào?',
        back: 'Phải cập nhật kiến thức y khoa liên tục (CME) phù hợp với phạm vi hành nghề. Cơ quan quản lý sẽ đình chỉ hoặc thu hồi giấy phép nếu không hoàn thành đủ số giờ CME theo quy định.',
        tag: 'Luật KBCB'
      }
    ]
  },
  {
    id: 'mkt_kaiwa_n2',
    title: '200 Mẫu Ngữ Pháp & Phản Xạ Giao Tiếp Tiếng Nhật Kaiwa Chuẩn Doanh Nghiệp',
    description: 'Kính ngữ Keigo, Khiêm nhường ngữ Kenjougo và các mẫu câu thương lượng công việc thực chiến trong công ty Nhật Bản.',
    category: 'ngoai-ngu',
    categoryName: 'Tiếng Nhật Kaiwa',
    priceXu: 20, // 20 Xu = 20.000 VNĐ
    cardCount: 65,
    authorName: 'Sensei Phương Mai (JLPT N1)',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    authorTier: 'plus',
    salesCount: 180,
    rating: 4.92,
    createdAt: '2026-10-10',
    isApproved: true,
    sampleCards: [
      {
        front: 'Chuyển câu sau sang Khiêm nhường ngữ: 「社長、見ましたか？」 (Giám đốc đã xem chưa?)',
        back: 'Đáp án sai: 社長、拝見しましたか？ (sai vì 拝見 là khiêm nhường cho chính mình).\nĐáp án đúng Tôn kính ngữ: 「社長、ご覧になりましたか？」 (Shachou, goran ni narimashita ka?)',
        tag: 'Keigo Phỏng Vấn'
      }
    ]
  },
  {
    id: 'pass_sat_reading_800',
    title: '[PASS LẠI] Siêu Phẩm SAT Reading & Writing - Mình Vừa Thi Đạt 1510 Điểm!',
    description: 'Mình mua học xong đợt tháng 9 vừa rồi, pass lại giá sinh viên cho bạn nào chuẩn bị thi Digital SAT đợt tới. Bộ thẻ giải thích cực chi tiết ngữ cảnh từ vựng khó!',
    category: 'ngoai-ngu',
    categoryName: 'SAT & Ngoại Ngữ',
    priceXu: 14,
    originalPriceXu: 25,
    cardCount: 120,
    authorName: 'Minh Thư (IELTS 8.5 / SAT 1520)',
    passSellerName: 'Hoàng Long (Sinh viên NEU - Đã thi 1510 SAT)',
    passSellerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    passSellerTier: 'plus',
    passNote: 'Mình vừa thi đỗ SAT 1510 điểm (Verbal 730)! Pass lại thẻ cho các bạn khóa sau ôn gấp.',
    isPassDeck: true,
    salesCount: 18,
    rating: 5.0,
    createdAt: '2026-10-11',
    isApproved: true,
    sampleCards: [
      {
        front: 'equivocal /ɪˈkwɪv.ə.kəl/ (adj)',
        back: 'Nghĩa: Mập mờ, không rõ ràng, có nhiều nghĩa nước đôi (ambiguous).\nVí dụ: His equivocal response left the jury uncertain about his guilt.',
        tag: 'SAT Vocabulary'
      }
    ]
  }
];

// Get all marketplace decks
export function getMarketplaceDecks() {
  try {
    const raw = localStorage.getItem(MARKETPLACE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_MARKETPLACE_DECKS;
  } catch (e) {
    return INITIAL_MARKETPLACE_DECKS;
  }
}

// Pass deck from student buyer to peer C2C
export function passDeckToMarketplace({ originalCourse, passPriceXu, passNote, sellerUser }) {
  const current = getMarketplaceDecks();
  const passDeck = {
    id: 'pass_' + Date.now(),
    title: `[PASS LẠI] ${originalCourse.title}`,
    description: passNote || `Bộ thẻ do ${sellerUser?.name || 'Học viên'} đã hoàn thành khóa ôn tập và pass lại với giá ưu đãi.`,
    category: originalCourse.category || 'cong-chuc',
    categoryName: originalCourse.categoryLabel || originalCourse.categoryName || 'Ôn Thi C2C',
    priceXu: Math.max(3, parseInt(passPriceXu, 10) || 10),
    originalPriceXu: originalCourse.priceXu || 25,
    cardCount: originalCourse.previewCards?.length || originalCourse.cardCount || 50,
    authorName: originalCourse.authorName || 'Giảng viên ÔnThiHub',
    authorAvatar: originalCourse.authorAvatar,
    passSellerName: sellerUser?.name || 'Học Viên Pass Thẻ',
    passSellerAvatar: sellerUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    passSellerTier: sellerUser?.tier || 'free',
    passNote: passNote,
    isPassDeck: true,
    originalDeckId: originalCourse.id,
    salesCount: 0,
    rating: 5.0,
    createdAt: new Date().toISOString().split('T')[0],
    isApproved: true,
    sampleCards: originalCourse.previewCards ? originalCourse.previewCards.slice(0, 3) : []
  };

  current.unshift(passDeck);
  localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(current));
  return passDeck;
}

// Publish new deck to marketplace
export function publishDeckToMarketplace(deck) {
  const current = getMarketplaceDecks();
  const newDeck = {
    ...deck,
    id: 'mkt_' + Date.now(),
    salesCount: 0,
    rating: 5.0,
    createdAt: new Date().toISOString().split('T')[0],
    isApproved: true // Auto approve or pending review
  };
  current.unshift(newDeck);
  localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(current));
  return newDeck;
}

// Admin update deck (approve / remove / toggle)
export function adminUpdateMarketplaceDeck(deckId, updates) {
  const current = getMarketplaceDecks();
  const updated = current.map(d => d.id === deckId ? { ...d, ...updates } : d);
  localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(updated));
  return updated;
}

// Purchase a deck on marketplace using Xu
export function purchaseMarketplaceDeck(deck) {
  const currentBalance = getWalletBalance();
  if (currentBalance < deck.priceXu) {
    return {
      success: false,
      message: `Số dư ví không đủ! Bộ thẻ này giá ${deck.priceXu} Xu, bạn hiện có ${currentBalance} Xu. Vui lòng nạp thêm Xu để tiếp tục.`
    };
  }

  // Deduct buyer coins
  deductWalletCoins(deck.priceXu);

  // Calculate platform fee
  const userTier = getUserTier();
  const tierConfig = getTierLimits()[userTier] || getTierLimits().free;
  const feePercent = tierConfig.marketplaceFee || 10;
  const sellerEarnings = Math.round(deck.priceXu * (1 - feePercent / 100));

  // Update sales count on deck
  const decks = getMarketplaceDecks();
  const target = decks.find(d => d.id === deck.id);
  if (target) {
    target.salesCount = (target.salesCount || 0) + 1;
    localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(decks));
  }

  // Save to buyer's purchased courses
  savePurchasedCourse(deck.id);

  return {
    success: true,
    sellerEarnings,
    feePercent,
    message: `🎉 Mua thành công bộ thẻ "${deck.title}" với giá ${deck.priceXu} Xu! Bộ thẻ đã được mở khóa vào Tủ tài liệu của bạn.`
  };
}
