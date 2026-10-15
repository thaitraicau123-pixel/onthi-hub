import { getWalletBalance, deductWalletCoins, addWalletCoins } from '../utils/wallet.js';
import { getUserTier, getTierLimits } from '../utils/userTier.js';
import { savePurchasedCourse } from '../utils/storage.js';
import { getFirestoreDb, collection, doc, setDoc, onSnapshot, query, getDocs, deleteDoc } from '../utils/firebaseConfig.js';

const MARKETPLACE_KEY = 'onthi_marketplace_decks_v2'; // v2 for fresh high-quality decks
const CLOUD_MARKETPLACE_TOPIC = 'onthi_hub_marketplace_v5';

export const INITIAL_MARKETPLACE_DECKS = [
  {
    id: 'mkt_sat_vocab',
    title: '500 Từ Vựng SAT & IELTS Academic 8.0 Cực Hiếm Kèm Ngữ Cảnh',
    subtitle: 'Bộ từ vựng then chốt Digital SAT Reading & Writing và IELTS Band 8.0+',
    description: 'Tổng hợp từ vựng học thuật hiếm gặp nhưng luôn xuất hiện trong phần Reading & Writing của bài thi Digital SAT và Writing Task 2 IELTS. Kèm phát âm, ví dụ thực tế và từ đồng nghĩa/trái nghĩa.',
    category: 'ngoai-ngu',
    categoryName: 'SAT & Ngoại Ngữ',
    categoryLabel: 'Digital SAT & IELTS',
    priceXu: 4, // Siết giá cực rẻ: 4 Xu (~4.000đ)
    cardCount: 25,
    authorName: 'Minh Thư (IELTS 8.5 / SAT 1520)',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 842,
    rating: 4.96,
    createdAt: '2026-10-01',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'aberrant /əˈber.ənt/ (adj)',
        back: 'Nghĩa: Khác thường, dị biệt, chệch khỏi quy chuẩn (departing from an accepted standard).\nVí dụ: The scientist noticed aberrant behavior in the lab mice after the test.\nTừ đồng nghĩa: anomalous, deviant, abnormal.',
        tag: 'SAT Reading'
      },
      {
        id: 2,
        front: 'equivocal /ɪˈkwɪv.ə.kəl/ (adj)',
        back: 'Nghĩa: Mập mờ, nước đôi, khó đoán định (ambiguous, uncertain).\nVí dụ: His equivocal response left the jury uncertain about his guilt.\nTừ trái nghĩa: unequivocal, unambiguous.',
        tag: 'SAT Vocabulary'
      },
      {
        id: 3,
        front: 'ephemeral /ɪˈfem.ər.əl/ (adj)',
        back: 'Nghĩa: Phù du, chóng tàn, tồn tại trong thời gian rất ngắn.\nVí dụ: Fame in the digital age is often ephemeral, fading within weeks.\nTừ đồng nghĩa: fleeting, transient, evanescent.',
        tag: 'IELTS Academic'
      },
      {
        id: 4,
        front: 'ubiquitous /juːˈbɪk.wɪ.təs/ (adj)',
        back: 'Nghĩa: Phổ biến ở khắp mọi nơi cùng lúc (omnipresent).\nVí dụ: Smartphones have become ubiquitous in modern urban life.\nTừ đồng nghĩa: pervasive, universal.',
        tag: 'Academic Writing'
      },
      {
        id: 5,
        front: 'pragmatic /præɡˈmæt.ɪk/ (adj)',
        back: 'Nghĩa: Thực tế, thực dụng, dựa trên tính khả thi thay vì lý thuyết.\nVí dụ: We need a pragmatic approach to solving public transport congestion.\nTừ trái nghĩa: idealistic, impractical.',
        tag: 'Critical Reading'
      },
      {
        id: 6,
        front: 'pernicious /pəˈnɪʃ.əs/ (adj)',
        back: 'Nghĩa: Độc hại ngấm ngầm, gây tổn hại dần dần nguy hiểm.\nVí dụ: Misinformation can have a pernicious effect on democratic debate.\nTừ đồng nghĩa: insidious, detrimental.',
        tag: 'SAT Reading'
      },
      {
        id: 7,
        front: 'taciturn /ˈtæs.ɪ.tɜːn/ (adj)',
        back: 'Nghĩa: Trầm lặng, ít nói, dè dặt trong giao tiếp.\nVí dụ: The usually taciturn professor delivered an emotional retirement speech.\nTừ đồng nghĩa: reserved, reticent, uncommunicative.',
        tag: 'Character Vocab'
      },
      {
        id: 8,
        front: 'voracious /vəˈreɪ.ʃəs/ (adj)',
        back: 'Nghĩa: Tham lam, ngấu nghiến (đọc sách, ăn uống, tìm kiếm kiến thức).\nVí dụ: She is a voracious reader who finishes three novels every week.\nTừ đồng nghĩa: insatiable, ravenous.',
        tag: 'SAT Vocabulary'
      },
      {
        id: 9,
        front: 'paradoxical /ˌpær.əˈdɒk.sɪ.kəl/ (adj)',
        back: 'Nghĩa: Nghịch lý, có vẻ mâu thuẫn nhưng lại chứa đựng chân lý.\nVí dụ: It is paradoxical that modern connectivity can make people feel more isolated.',
        tag: 'Essay Writing'
      },
      {
        id: 10,
        front: 'corroborate /kəˈrɒb.ə.reɪt/ (verb)',
        back: 'Nghĩa: Xác nhận, củng cố thêm bằng chứng (confirm with evidence).\nVí dụ: Recent satellite imagery corroborates the ground reports of deforestation.\nTừ đồng nghĩa: substantiate, verify.',
        tag: 'SAT Evidence'
      },
      {
        id: 11,
        front: 'anomaly /əˈnɒm.ə.li/ (noun)',
        back: 'Nghĩa: Sự bất thường, hiện tượng dị thường không khớp với quy luật.\nVí dụ: The sudden spike in server temperature was treated as a dangerous anomaly.',
        tag: 'SAT Science'
      },
      {
        id: 12,
        front: 'candid /ˈkæn.dɪd/ (adj)',
        back: 'Nghĩa: Thẳng thắn, bộc trực, không giấu giếm (frank, straightforward).\nVí dụ: In a candid interview, the CEO admitted the company made strategic errors.',
        tag: 'Tone & Style'
      },
      {
        id: 13,
        front: 'mitigate /ˈmɪt.ɪ.ɡeɪt/ (verb)',
        back: 'Nghĩa: Làm giảm nhẹ, xoa dịu mức độ nghiêm trọng hoặc thiệt hại.\nVí dụ: Planting mangrove forests helps mitigate coastal erosion during typhoons.\nTừ đồng nghĩa: alleviate, attenuate, ease.',
        tag: 'IELTS Task 2'
      },
      {
        id: 14,
        front: 'lucid /ˈluː.sɪd/ (adj)',
        back: 'Nghĩa: Rõ ràng, dễ hiểu, sáng tỏ (clear, easily intelligible).\nVí dụ: The lecturer provided a lucid explanation of quantum mechanics.',
        tag: 'Style & Rhetoric'
      },
      {
        id: 15,
        front: 'fastidious /fæsˈtɪd.i.əs/ (adj)',
        back: 'Nghĩa: Kỹ tính, cầu toàn, chú ý tới từng chi tiết nhỏ nhất.\nVí dụ: He was fastidious about grammar and edited every email three times.',
        tag: 'SAT Vocabulary'
      },
      {
        id: 16,
        front: 'alacrity /əˈlæk.rə.ti/ (noun)',
        back: 'Nghĩa: Sự mau lẹ, hăm hở, sẵn lòng nhiệt tình bắt tay vào việc.\nVí dụ: The eager intern accepted the challenging research task with alacrity.',
        tag: 'Advanced Tone'
      },
      {
        id: 17,
        front: 'prolific /prəˈlɪf.ɪk/ (adj)',
        back: 'Nghĩa: Năng suất cao, sinh sôi nảy nở nhiều tác phẩm/ý tưởng.\nVí dụ: Picasso was an extraordinarily prolific artist who produced thousands of artworks.',
        tag: 'SAT Reading'
      },
      {
        id: 18,
        front: 'esoteric /ˌes.əˈter.ɪk/ (adj)',
        back: 'Nghĩa: Thâm sâu bí truyền, chỉ số ít chuyên gia hiểu được.\nVí dụ: The conference focused on esoteric topics in theoretical astrophysics.',
        tag: 'Academic Word'
      },
      {
        id: 19,
        front: 'tenacious /təˈneɪ.ʃəs/ (adj)',
        back: 'Nghĩa: Kiên trì, ngoan cường, bám chặt không chịu bỏ cuộc.\nVí dụ: Despite repeated funding rejections, the researcher remained tenacious.',
        tag: 'Character Vocab'
      },
      {
        id: 20,
        front: 'substantiate /səbˈstæn.ʃi.eɪt/ (verb)',
        back: 'Nghĩa: Chứng minh bằng căn cứ xác thực (provide evidence to support).\nVí dụ: The prosecutor failed to substantiate the fraud charges in court.',
        tag: 'Evidence Analysis'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Từ nào sau đây đồng nghĩa với "fleeting" và "transient"?',
        options: ['A. Ubiquitous', 'B. Ephemeral', 'C. Pragmatic', 'D. Voracious'],
        correct: 1,
        explanation: 'Ephemeral có nghĩa là phù du, chóng tàn, đồng nghĩa hoàn hảo với fleeting và transient.'
      },
      {
        id: 2,
        question: 'Chọn từ trái nghĩa chính xác nhất của "equivocal":',
        options: ['A. Unequivocal', 'B. Taciturn', 'C. Aberrant', 'D. Pernicious'],
        correct: 0,
        explanation: 'Equivocal nghĩa là mập mờ nước đôi, trái nghĩa là Unequivocal (rõ ràng, dứt khoát).'
      },
      {
        id: 3,
        question: 'Câu nào sử dụng chính xác từ "mitigate"?',
        options: [
          'A. She tried to mitigate her computer with a new processor.',
          'B. The government planted trees to mitigate flood damage.',
          'C. He mitigates dinner every evening at 7 PM.',
          'D. The team mitigated to the championship final.'
        ],
        correct: 1,
        explanation: 'Mitigate nghĩa là giảm nhẹ thiệt hại: "planted trees to mitigate flood damage" là ngữ cảnh chuẩn xác.'
      }
    ]
  },
  {
    id: 'mkt_leetcode_patterns',
    title: '30 Thuật Toán & Pattern LeetCode Blind 75 Phỏng Vấn Big Tech',
    subtitle: 'Two Pointers, Sliding Window, DFS/BFS, Dynamic Programming & Backtracking',
    description: 'Tổng hợp 30 mẫu tư duy cốt lõi (algorithmic patterns) xuất hiện trong 90% các kỳ phỏng vấn coding tại Google, Meta, Amazon, Shopee. Kèm độ phức tạp Time/Space complexity và code mẫu tối ưu.',
    category: 'it-tech',
    categoryName: 'IT & Thuật Toán',
    categoryLabel: 'LeetCode & FAANG',
    priceXu: 5,
    cardCount: 30,
    authorName: 'Hoàng Long (Senior SDE / LeetCode Guardian 2300+)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 654,
    rating: 4.98,
    createdAt: '2026-10-05',
    isApproved: true,
    previewCards: [
      { id: 1, front: 'Kỹ thuật "Two Pointers" (Hai con trỏ) thường áp dụng cho dạng bài toán nào và tối ưu độ phức tạp ra sao?', back: 'Thường áp dụng cho mảng hoặc chuỗi ĐÃ ĐƯỢC SẮP XẾP (Sorted Array).\n\n📌 Ví dụ: 2 Sum II, 3 Sum, Container With Most Water, Trapping Rain Water.\n💡 Tối ưu: Giảm độ phức tạp từ O(N²) (vét cạn 2 vòng lặp) xuống O(N) chỉ bằng một lượt duyệt duy nhất.', tag: 'Two Pointers' },
      { id: 2, front: 'Pattern "Sliding Window" (Cửa sổ trượt) nhận biết qua dấu hiệu nào trong đề bài?', back: 'Đề bài yêu cầu tìm chuỗi con (substring) hoặc mảng con (subarray) liên tục dài nhất / ngắn nhất / có tổng thỏa mãn điều kiện K.\n\n📌 Ví dụ: Longest Substring Without Repeating Characters, Minimum Size Subarray Sum.\n💡 Kỹ thuật: Mở rộng con trỏ Right để thêm phần tử; co con trỏ Left khi điều kiện bị vi phạm.', tag: 'Sliding Window' },
      { id: 3, front: 'Khi nào nên dùng BFS (Breadth-First Search) thay vì DFS (Depth-First Search)?', back: 'Dùng BFS khi cần tìm ĐƯỜNG ĐI NGẮN NHẤT (Shortest Path) hoặc số bước biến đổi ít nhất trong đồ thị có trọng số bằng nhau.\n\n📌 Ví dụ: Word Ladder, Rotting Oranges, Shortest Path in Binary Matrix.\n💡 Cấu trúc dữ liệu: BFS luôn sử dụng Queue (FIFO), trong khi DFS sử dụng Stack / Đệ quy.', tag: 'Graph & BFS' },
      { id: 4, front: 'Fast & Slow Pointers (Thuật toán Rùa và Thỏ - Floyd\'s Cycle Detection) hoạt động thế nào?', back: 'Sử dụng 2 con trỏ cùng xuất phát: Slow đi 1 bước mỗi lượt, Fast đi 2 bước mỗi lượt.\n\n📌 Nếu danh sách liên kết có vòng lặp (cycle), Fast chắc chắn sẽ bắt kịp và gặp Slow.\n💡 Ứng dụng: Linked List Cycle I/II, Find the Duplicate Number (mảng có số trùng lặp).', tag: 'Fast & Slow' },
      { id: 5, front: 'Nguyên lý cơ bản của kỹ thuật "Monotonic Stack" (Ngăn xếp đơn điệu) là gì?', back: 'Duy trì các phần tử trong stack luôn tăng dần hoặc giảm dần theo thứ tự nghiêm ngặt.\n\n📌 Khi gặp phần tử vi phạm trật tự, pop các phần tử cũ ra để xử lý.\n💡 Ứng dụng: Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram (độ phức tạp O(N)).', tag: 'Monotonic Stack' }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Cấu trúc dữ liệu nào là bắt buộc khi hiện thực thuật toán BFS (Breadth-First Search)?',
        options: ['A. Stack (LIFO)', 'B. Queue (FIFO)', 'C. Priority Queue', 'D. Hash Table'],
        correct: 1,
        explanation: 'BFS duyệt theo từng tầng nên bắt buộc dùng hàng đợi Queue (First-In, First-Out).'
      }
    ]
  },
  {
    id: 'mkt_business_japanese',
    title: '35 Mẫu Câu Giao Tiếp Kính Ngữ & Kaiwa Tiếng Nhật Doanh Nghiệp',
    subtitle: 'Kính ngữ Sonkeigo, Khiêm nhường ngữ Kenjougo và giao tiếp Business',
    category: 'ngoai-ngu',
    categoryName: 'Tiếng Nhật Business',
    categoryLabel: 'Business Japanese',
    priceXu: 4,
    cardCount: 35,
    authorName: 'Hương Giang (BJT J1+ / Thông dịch viên Tokyo)',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    authorTier: 'pro',
    salesCount: 512,
    rating: 4.95,
    createdAt: '2026-10-08',
    isApproved: true,
    previewCards: [
      { id: 1, front: 'Kính ngữ (Sonkeigo) và Khiêm nhường ngữ (Kenjougo) của động từ 「行く」(Đi) và 「来る」(Đến) là gì?', back: '• Tôn kính ngữ (Nâng đối phương lên): いらっしゃる / おいでになる\n• Khiêm nhường ngữ (Hạ mình xuống): 参る (まいる) / 伺う (うかがう)\n\n📝 Ví dụ:\n- Khách hàng: 社長がいらっしゃいました (Giám đốc bên đối tác đã đến ạ).\n- Bản thân: 明日の10時に伺います (10h sáng mai tôi xin phép ghé qua công ty anh ạ).', tag: 'Kính ngữ Cơ bản' },
      { id: 2, front: 'Kính ngữ đặc biệt của động từ 「言う」(Nói) đối với sếp/đối tác và đối với bản thân là gì?', back: '• Tôn kính ngữ: おっしゃる (Ossharu)\n• Khiêm nhường ngữ: 申し上げる (Moushiageru) / 申す (Mousu)\n\n📝 Ví dụ: 先ほど田中様がおっしゃったように (Như quý khách Tanaka vừa nói khi nãy).', tag: 'Business Kaiwa' },
      { id: 3, front: 'Mẫu câu nhờ vả cấp trên hoặc khách hàng kiểm tra tài liệu lịch sự chuẩn Nhật là gì?', back: 'ご確認のほど、よろしくお願いいたします。\n(Go-kakunin no hodo, yoroshiku onegai itashimasu).\n\n💡 Tinh tế hơn câu cơ bản: 確認してください (câu này nghe như ra lệnh, không dùng cho sếp/khách hàng).', tag: 'Email Business' },
      { id: 4, front: 'Khi nghe điện thoại công ty Nhật, câu chào mở đầu bắt buộc là gì?', back: 'いつもお世話になっております。[Tên công ty]の[Tên bạn]でございます。\n(Itsumo osewa ni natte orimasu. [Tên công ty] no [Tên bạn] de gozaimasu).\n\n📌 Nghĩa: Xin cảm ơn quý khách luôn chiếu cố và ủng hộ công ty chúng tôi.', tag: 'Điện thoại' },
      { id: 5, front: 'Cách xin lỗi trang trọng trong kinh doanh khi làm sai hoặc giao hàng chậm trễ là gì?', back: '大変ご迷惑をおかけいたしまして、誠に申し訳ございませんでした。\n(Taihen gomeiwaku wo okake itashimashite, makoto ni moushiwake gozaimasen deshita).\n\n⚠️ Tuyệt đối không nói "ごめんなさい" trong môi trường công sở Nhật Bản.', tag: 'Tạ lỗi Business' }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Khi nói về hành động "NÓI" của khách hàng, từ nào sau đây là Tôn kính ngữ chính xác?',
        options: ['A. 申す (Mousu)', 'B. おっしゃる (Ossharu)', 'C. 申し上げる (Moushiageru)', 'D. 言われる (Iwareru)'],
        correct: 1,
        explanation: 'おっしゃる là Tôn kính ngữ của 言う dùng cho khách hàng/sếp. 申す và 申し上げる là Khiêm nhường ngữ hạ mình.'
      }
    ]
  }
];

// Ensure each deck has sampleCards alias for backward compatibility
INITIAL_MARKETPLACE_DECKS.forEach(d => {
  d.sampleCards = d.previewCards;
});

export const REMOVED_MOCK_IDS = [
  'mkt_sql_interview',
  'mkt_civil_servant_law',
  'mkt_japanese_business',
  'mkt_medical_ethics',
  'mkt_sat_reading_pass',
  'pass_sat_reading_800'
];

const DELETED_DECKS_KEY = 'onthi_deleted_marketplace_deck_ids';

export function getDeletedDeckIds() {
  try {
    const raw = localStorage.getItem(DELETED_DECKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addDeletedDeckId(id) {
  if (!id) return;
  try {
    const list = getDeletedDeckIds();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(DELETED_DECKS_KEY, JSON.stringify(list));
    }
  } catch (e) {}
}

export function deleteMarketplaceDeck(deckId) {
  if (!deckId) return false;
  addDeletedDeckId(deckId);
  const current = getMarketplaceDecks().filter(d => d.id !== deckId);
  try {
    localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(current));
  } catch (e) {}

  // Broadcast deletion across all connected devices
  broadcastMarketplaceAction('delete_deck', { deckId });

  // Delete from Firestore if db is active
  try {
    const db = getFirestoreDb();
    if (db) {
      deleteDoc(doc(db, 'marketplace_decks', String(deckId))).catch(() => {});
    }
  } catch (e) {}

  return true;
}

// Get all marketplace decks (with automatic removal of mock/deleted decks)
export function getMarketplaceDecks() {
  const deletedIds = new Set([...getDeletedDeckIds(), ...REMOVED_MOCK_IDS]);
  try {
    const raw = localStorage.getItem(MARKETPLACE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter(d => d && d.id && !deletedIds.has(d.id));
        if (filtered.length !== parsed.length) {
          localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(filtered));
        }
        if (filtered.length > 0) {
          return filtered;
        }
      }
    }
  } catch (e) {}

  const cleanInitial = INITIAL_MARKETPLACE_DECKS.filter(d => !deletedIds.has(d.id));
  try {
    localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(cleanInitial));
  } catch (e) {}
  return cleanInitial;
}

// Clean and prepare deck for Firestore (remove undefined fields)
function sanitizeDeckForFirestore(deck) {
  try {
    return JSON.parse(JSON.stringify(deck));
  } catch (e) {
    return { ...deck };
  }
}

// Lightweight timeout helper
function withTimeout(promise, ms = 2500) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ]);
}

// Sync single deck to Firebase Firestore
export async function syncDeckToFirestore(deck) {
  try {
    const db = getFirestoreDb();
    if (db && deck?.id) {
      const clean = sanitizeDeckForFirestore(deck);
      await withTimeout(setDoc(doc(db, 'marketplace_decks', String(deck.id)), clean, { merge: true }), 2500);
    }
  } catch (err) {
    // Handled gracefully via Cloud Relay
  }
}

// Sanitize deck to compact payload (< 2KB) for 100% reliable cloud relay
function toCompactDeckPayload(deck) {
  const clean = sanitizeDeckForFirestore(deck);
  const cards = clean.previewCards || clean.cards || clean.sampleCards || [];
  const essentialCards = cards.slice(0, 5);
  return {
    id: String(clean.id),
    title: clean.title,
    subtitle: clean.subtitle || '',
    description: clean.description || '',
    category: clean.category || 'cong-chuc',
    categoryName: clean.categoryName || 'Ôn Thi C2C',
    categoryLabel: clean.categoryLabel || 'C2C Thẻ',
    priceXu: Number(clean.priceXu) || 3,
    originalPriceXu: clean.originalPriceXu,
    cardCount: clean.cardCount || cards.length || 10,
    authorName: clean.authorName || 'Học Viên',
    authorAvatar: clean.authorAvatar,
    authorTier: clean.authorTier || 'free',
    authorEmail: clean.authorEmail || '',
    passSellerName: clean.passSellerName,
    passSellerAvatar: clean.passSellerAvatar,
    passSellerTier: clean.passSellerTier,
    passSellerEmail: clean.passSellerEmail || '',
    passNote: clean.passNote,
    isPassDeck: Boolean(clean.isPassDeck),
    originalDeckId: clean.originalDeckId,
    salesCount: clean.salesCount || 0,
    rating: clean.rating || 5.0,
    createdAt: clean.createdAt || new Date().toISOString().split('T')[0],
    isApproved: clean.isApproved !== false,
    previewCards: essentialCards,
    sampleCards: essentialCards,
    previewQuiz: (clean.previewQuiz || []).slice(0, 2)
  };
}

// Broadcast action to Cloud Relay (cross-browser / cross-device broadcast)
export async function broadcastMarketplaceAction(action, data) {
  if (typeof fetch === 'undefined') return;
  try {
    let payloadData = data;
    if (action === 'publish_deck') {
      payloadData = toCompactDeckPayload(data);
    }
    await fetch('https://ntfy.sh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: CLOUD_MARKETPLACE_TOPIC,
        message: JSON.stringify({ action, data: payloadData, timestamp: new Date().toISOString() }),
        title: `MKT_${action}`
      })
    });
  } catch (e) {
    console.warn('Marketplace cloud relay notice:', e);
  }
}

// Alias for backward compatibility
export async function broadcastDeckToCloudRelay(deck) {
  return broadcastMarketplaceAction('publish_deck', deck);
}

// Fetch cross-device decks and events from Cloud Relay
export async function fetchCloudRelayMarketplaceEvents() {
  if (typeof fetch === 'undefined') return [];
  try {
    const res = await fetch(`https://ntfy.sh/${CLOUD_MARKETPLACE_TOPIC}/json?poll=1`);
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
          if (body) {
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

// Alias for backward compatibility
export async function fetchCloudRelayMarketplaceDecks() {
  return fetchCloudRelayMarketplaceEvents();
}

// Merge remote decks into local marketplace cache
export function mergeAndSaveMarketplaceDecks(eventsOrDecks) {
  let current = getMarketplaceDecks();
  const deletedIds = new Set([...getDeletedDeckIds(), ...REMOVED_MOCK_IDS]);
  const deckMap = new Map();

  // 1. Initial baseline decks
  INITIAL_MARKETPLACE_DECKS.forEach((d) => {
    if (!deletedIds.has(d.id)) {
      deckMap.set(d.id, d);
    }
  });

  // 2. Local decks
  current.forEach((d) => {
    if (!deletedIds.has(d.id)) {
      deckMap.set(d.id, d);
    }
  });

  // 3. Incoming remote decks / events
  if (Array.isArray(eventsOrDecks)) {
    eventsOrDecks.forEach((item) => {
      if (!item) return;

      // Case A: Delete event
      if (item.action === 'delete_deck' && item.data?.deckId) {
        deletedIds.add(item.data.deckId);
        addDeletedDeckId(item.data.deckId);
        deckMap.delete(item.data.deckId);
        return;
      }

      // Case B: Publish event or raw deck object
      const deck = item.action === 'publish_deck' ? item.data : (item.data?.id ? item.data : (item.id ? item : null));
      if (deck && deck.id && !deletedIds.has(deck.id)) {
        deckMap.set(deck.id, { ...(deckMap.get(deck.id) || {}), ...deck });
      }
    });
  }

  const merged = Array.from(deckMap.values()).filter(d => !deletedIds.has(d.id));
  try {
    localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(merged));
  } catch (e) {}
  return merged;
}

// Real-time listener for cross-device marketplace decks
export function subscribeToMarketplaceDecks(callback) {
  // Emit local cache immediately
  callback(getMarketplaceDecks());

  let unsubscribeFirestore = null;
  const db = getFirestoreDb();

  // 1. Firebase Firestore onSnapshot listener
  if (db) {
    try {
      const col = collection(db, 'marketplace_decks');
      unsubscribeFirestore = onSnapshot(
        col,
        (snapshot) => {
          const fbDecks = [];
          snapshot.forEach((d) => {
            const data = d.data();
            if (data && data.id) fbDecks.push(data);
          });
          if (fbDecks.length > 0) {
            const merged = mergeAndSaveMarketplaceDecks(fbDecks);
            callback(merged);
          }
        },
        (err) => {
          // Graceful fallback to Cloud Relay
        }
      );
    } catch (e) {}
  }

  // 2. Initial Cloud Relay fetch
  fetchCloudRelayMarketplaceEvents().then((events) => {
    if (events.length > 0) {
      const merged = mergeAndSaveMarketplaceDecks(events);
      callback(merged);
    }
  });

  // 3. Periodic cloud poller (every 5s for fast real-time responsiveness)
  const intervalId = setInterval(async () => {
    const events = await fetchCloudRelayMarketplaceEvents();
    if (events.length > 0) {
      const merged = mergeAndSaveMarketplaceDecks(events);
      callback(merged);
    }
  }, 5000);

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    clearInterval(intervalId);
  };
}

// Pass deck from student buyer to peer C2C
export function passDeckToMarketplace({ originalCourse, passPriceXu, passNote, sellerUser }) {
  const current = getMarketplaceDecks();
  const sellerName = sellerUser?.displayName || sellerUser?.name || 'Học Viên Pass Thẻ';
  const sellerEmail = sellerUser?.email || '';
  const sellerAvatar = sellerUser?.photoURL || sellerUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
  const sellerTier = sellerUser?.tier || 'free';

  const cardsList = originalCourse.previewCards || originalCourse.cards || [];
  const quizList = originalCourse.previewQuiz || originalCourse.quiz || [];

  const passDeck = {
    id: 'pass_' + Date.now(),
    title: `[PASS LẠI] ${originalCourse.title}`,
    subtitle: `Bộ thẻ pass lại từ ${sellerName} với giá ưu đãi sinh viên`,
    description: passNote || `Bộ thẻ do ${sellerName} đã hoàn thành khóa ôn tập và pass lại với giá ưu đãi.`,
    category: originalCourse.category || 'cong-chuc',
    categoryName: originalCourse.categoryLabel || originalCourse.categoryName || 'Ôn Thi C2C',
    categoryLabel: originalCourse.categoryLabel || 'Pass Lại C2C',
    priceXu: Math.max(2, parseInt(passPriceXu, 10) || 3),
    originalPriceXu: originalCourse.priceXu || 25,
    cardCount: cardsList.length || originalCourse.cardCount || 20,
    authorName: originalCourse.authorName || 'Giảng viên ÔnThiHub',
    authorEmail: originalCourse.authorEmail || '',
    authorAvatar: originalCourse.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    passSellerName: sellerName,
    passSellerEmail: sellerEmail,
    passSellerAvatar: sellerAvatar,
    passSellerTier: sellerTier,
    passNote: passNote,
    isPassDeck: true,
    originalDeckId: originalCourse.id,
    salesCount: 0,
    rating: 5.0,
    createdAt: new Date().toISOString().split('T')[0],
    isApproved: true,
    previewCards: cardsList,
    sampleCards: cardsList,
    previewQuiz: quizList
  };

  current.unshift(passDeck);
  localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(current));

  // Sync to Firebase & Cloud Relay for real-time visibility across all devices
  syncDeckToFirestore(passDeck);
  broadcastDeckToCloudRelay(passDeck);

  return passDeck;
}

// Publish new deck to marketplace
export function publishDeckToMarketplace(deck) {
  const current = getMarketplaceDecks();
  const newDeck = {
    ...deck,
    id: deck.id && String(deck.id).startsWith('mkt_') ? deck.id : 'mkt_' + Date.now(),
    salesCount: 0,
    rating: 5.0,
    createdAt: new Date().toISOString().split('T')[0],
    isApproved: true,
    previewCards: deck.cards || deck.previewCards || [],
    sampleCards: deck.cards || deck.previewCards || [],
    previewQuiz: deck.previewQuiz || []
  };
  current.unshift(newDeck);
  localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(current));

  // Sync to Firebase & Cloud Relay for real-time visibility across all devices
  syncDeckToFirestore(newDeck);
  broadcastDeckToCloudRelay(newDeck);

  return newDeck;
}

// Admin update deck (approve / remove / toggle)
export function adminUpdateMarketplaceDeck(deckId, updates) {
  const current = getMarketplaceDecks();
  const updated = current.map(d => d.id === deckId ? { ...d, ...updates } : d);
  localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(updated));

  const target = updated.find(d => d.id === deckId);
  if (target) {
    syncDeckToFirestore(target);
    broadcastDeckToCloudRelay(target);
  }

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

  // Save to buyer's purchased courses in localStorage
  savePurchasedCourse(deck.id);

  return {
    success: true,
    sellerEarnings,
    feePercent,
    message: `🎉 Mua thành công bộ thẻ "${deck.title}" với giá chỉ ${deck.priceXu} Xu! Bộ thẻ đã được mở khóa ngay trong "Tủ Của Tôi".`
  };
}
