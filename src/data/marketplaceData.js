import { getWalletBalance, deductWalletCoins, addWalletCoins } from '../utils/wallet';
import { getUserTier, getTierLimits } from '../utils/userTier';
import { savePurchasedCourse } from '../utils/storage';
import { getFirestoreDb, collection, doc, setDoc, onSnapshot, query, getDocs } from '../utils/firebaseConfig';

const MARKETPLACE_KEY = 'onthi_marketplace_decks_v2'; // v2 for fresh high-quality decks
const CLOUD_MARKETPLACE_TOPIC = 'onthi_hub_marketplace_v2';

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
    id: 'mkt_sql_interview',
    title: '45 Câu Hỏi SQL & Database Tuning Phỏng Vấn Data / Backend Engineer',
    subtitle: 'Window Functions, Index B-Tree vs LSM, Execution Plan & Locking',
    description: 'Từ Window Functions (ROW_NUMBER, DENSE_RANK, LEAD, LAG) đến CTE, Index Seek vs Scan, tối ưu câu lệnh truy vấn hàng triệu dòng và chống Deadlock trong PostgreSQL/MySQL.',
    category: 'it-tech',
    categoryName: 'Data & Lập Trình',
    categoryLabel: 'SQL & Database',
    priceXu: 5, // Siết giá cực rẻ: 5 Xu (~5.000đ)
    cardCount: 22,
    authorName: 'Lê Hoàng (Lead Data Engineer)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    authorTier: 'pro',
    salesCount: 1120,
    rating: 4.98,
    createdAt: '2026-10-05',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'Sự khác biệt giữa RANK() và DENSE_RANK() trong SQL là gì?',
        back: '• RANK(): Bỏ qua thứ hạng kế tiếp nếu có đồng hạng (ví dụ: 1, 2, 2, 4).\n• DENSE_RANK(): KHÔNG bỏ qua thứ hạng kế tiếp (ví dụ: 1, 2, 2, 3).\n\n💡 Dùng DENSE_RANK() khi cần lấy top N mức lương cao nhất không lo mất thứ tự.',
        tag: 'SQL Window Functions'
      },
      {
        id: 2,
        front: 'Khi nào Database Engine thực hiện INDEX SCAN thay vì INDEX SEEK?',
        back: '• INDEX SEEK: Nhảy trực tiếp tới node B-Tree mong muốn (khi WHERE có điều kiện sargable dạng column = value hoặc column BETWEEN a AND b).\n• INDEX SCAN: Quét tuần tự toàn bộ leaf nodes khi điều kiện không sargable (LIKE \'%text\', dùng function trên cột như WHERE YEAR(date) = 2026).',
        tag: 'Performance Tuning'
      },
      {
        id: 3,
        front: 'Sự khác biệt cốt lõi giữa Clustered Index và Non-Clustered Index là gì?',
        back: '• Clustered Index: Quyết định thứ tự vật lý lưu trữ dữ liệu thực tế trên đĩa cứng (mỗi bảng chỉ có duy nhất 1).\n• Non-Clustered Index: Cấu trúc phụ riêng biệt chứa các cột index + con trỏ trỏ về bản ghi thực (mỗi bảng có thể tạo nhiều).',
        tag: 'Index Architecture'
      },
      {
        id: 4,
        front: 'Cơ chế ACID trong Transaction Database gồm những tính chất gì?',
        back: '1. Atomicity (Nguyên tử): Mọi thao tác đều thành công hoặc rollback hoàn toàn.\n2. Consistency (Nhất quán): Dữ liệu chuyển từ trạng thái hợp lệ này sang trạng thái hợp lệ khác.\n3. Isolation (Cô lập): Các giao dịch song song không làm sai lệch nhau.\n4. Durability (Bền vững): Dữ liệu đã commit sẽ không mất dù sập nguồn.',
        tag: 'Transaction ACID'
      },
      {
        id: 5,
        front: 'Các mức Isolation Level trong SQL và vấn đề tương ứng?',
        back: '• Read Uncommitted -> Gặp Dirty Read.\n• Read Committed (Default phổ biến) -> Khắc phục Dirty Read, nhưng có thể gặp Non-repeatable Read.\n• Repeatable Read -> Khắc phục Non-repeatable Read, nhưng có thể gặp Phantom Read.\n• Serializable -> Khắt khe nhất, an toàn tuyệt đối nhưng lock nhiều gây nghẽn.',
        tag: 'Concurrency'
      },
      {
        id: 6,
        front: 'Phân biệt UNION và UNION ALL trong SQL?',
        back: '• UNION: Gộp kết quả và TỰ ĐỘNG LỌC BỎ TRÙNG LẶP (Duplicate) -> Tốn RAM và CPU để sort & distinct.\n• UNION ALL: Gộp kết quả thuần túy KHÔNG lọc trùng -> Nhanh hơn vượt trội, khuyên dùng khi chắc chắn dữ liệu không trùng.',
        tag: 'Query Optimization'
      },
      {
        id: 7,
        front: 'CTE (Common Table Expression) khác gì so với Subquery / Temp Table?',
        back: '• CTE (WITH ... AS): Dễ đọc, có thể gọi đệ quy (Recursive CTE duyệt cây phân cấp/org-chart).\n• Temp Table (#table): Tạo bảng vật lý trong tempdb, có thể đánh Index riêng nếu dữ liệu trung gian lớn.',
        tag: 'Advanced SQL'
      },
      {
        id: 8,
        front: 'Deadlock trong cơ sở dữ liệu là gì và cách phòng chống?',
        back: 'Định nghĩa: Tình trạng Transaction A giữ Lock 1 đợi Lock 2, trong khi Transaction B giữ Lock 2 đợi Lock 1 -> Dẫn đến bế tắc vĩnh viễn.\nCách trị: Truy cập tài nguyên theo cùng một thứ tự thống nhất, giữ transaction ngắn nhất có thể, sử dụng cơ chế timeout.',
        tag: 'Database Locking'
      },
      {
        id: 9,
        front: 'Nguyên lý Composite Index (Left-Prefix Rule) hoạt động ra sao?',
        back: 'Nếu tạo Index trên (A, B, C):\n• Index dùng được khi WHERE có: (A), (A, B), (A, B, C).\n• Index KHÔNG DÙNG ĐƯỢC nếu WHERE chỉ có: (B), (C), hoặc (B, C) vì vi phạm nguyên lý tiền tố bên trái.',
        tag: 'Index Design'
      },
      {
        id: 10,
        front: 'Phân vùng bảng (Table Partitioning) đem lại lợi ích gì?',
        back: 'Chia bảng hàng trăm triệu dòng thành các partition nhỏ (theo RANGE ngày tháng hoặc HASH).\nLợi ích: Partition Pruning (chỉ quét phân vùng cần thiết, bỏ qua 90% còn lại), drop dữ liệu cũ cực nhanh chỉ với lệnh ALTER TABLE DROP PARTITION.',
        tag: 'Big Data Tuning'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Để lấy ra top 3 mức lương cao nhất trong công ty (cho phép nhân viên trùng mức lương cùng xếp hạng), bạn dùng hàm nào?',
        options: ['A. ROW_NUMBER()', 'B. DENSE_RANK()', 'C. RANK()', 'D. NTILE(3)'],
        correct: 1,
        explanation: 'DENSE_RANK() không nhảy cóc thứ hạng khi có đồng hạng, giúp lọc ra top 3 mức lương chính xác nhất.'
      },
      {
        id: 2,
        question: 'Câu lệnh nào sau đây có nguy cơ khiến Database thực hiện Full Index/Table Scan thay vì Index Seek?',
        options: [
          'A. WHERE user_id = 100',
          'B. WHERE created_at >= "2026-01-01"',
          'C. WHERE LOWER(email) = "user@gmail.com"',
          'D. WHERE status = "active"'
        ],
        correct: 2,
        explanation: 'Áp dụng hàm LOWER(email) làm cột mất tính sargable, Database không thể tìm trực tiếp trên B-Tree index mà phải duyệt toàn bộ bảng.'
      }
    ]
  },
  {
    id: 'mkt_luat_cbcc_2026',
    title: '50 Câu Trọng Tâm Luật Cán Bộ, Công Chức 2026 & Nghị Định 138/2020',
    subtitle: 'Nghĩa Vụ, Kỷ Luật, Phân Loại Ngạch, Bổ Nhiệm & Tuyển Dụng Vòng 1',
    description: 'Chuẩn format đề thi trắc nghiệm công chức Vòng 1. Cập nhật chính xác số năm thời hiệu kỷ luật, 4 trường hợp không áp dụng thời hiệu, điều kiện miễn nhiệm, từ chức và quyền hạn các cơ quan.',
    category: 'cong-chuc',
    categoryName: 'Thi Công Chức',
    categoryLabel: 'Luật CBCC 2026',
    priceXu: 4, // Siết giá cực rẻ: 4 Xu (~4.000đ)
    cardCount: 20,
    authorName: 'Thầy Đức (Ban Soạn Thảo Đề Thi)',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 1530,
    rating: 4.99,
    createdAt: '2026-10-08',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'Thời hiệu xử lý kỷ luật đối với hành vi vi phạm của cán bộ, công chức ít nghiêm trọng đến mức phải khiển trách là bao lâu?',
        back: '02 NĂM (kể từ thời điểm có hành vi vi phạm).\n\n📌 Căn cứ: Khoản 1 Điều 80 Luật Cán bộ, công chức 2008 (sửa đổi 2019).\n💡 Mẹo nhớ: Khiển trách = vi phạm nhẹ nhất = 2 năm. Các mức khác là 5 năm.',
        tag: 'Kỷ Luật CBCC'
      },
      {
        id: 2,
        front: '4 trường hợp nào KHÔNG ÁP DỤNG thời hiệu xử lý kỷ luật cán bộ, công chức?',
        back: '1. Là đảng viên bị kỷ luật đến mức khai trừ Đảng.\n2. Vi phạm quy định về công tác bảo vệ chính trị nội bộ.\n3. Xâm hại đến lợi ích quốc gia trong lĩnh vực quốc phòng, an ninh, đối ngoại.\n4. Sử dụng văn bằng, chứng chỉ, chứng nhận giả, không hợp pháp.',
        tag: 'Điều 80 - Luật CBCC'
      },
      {
        id: 3,
        front: 'Có bao nhiêu ngạch công chức theo Luật hiện hành?',
        back: '5 NGẠCH:\n1. Chuyên viên cao cấp và tương đương.\n2. Chuyên viên chính và tương đương.\n3. Chuyên viên và tương đương.\n4. Cán sự và tương đương.\n5. Nhân viên.\n(Và các ngạch khác theo quy định Chính phủ).',
        tag: 'Ngạch Công Chức'
      },
      {
        id: 4,
        front: 'Hình thức kỷ luật "Hạ bậc lương" KHÔNG ÁP DỤNG cho đối tượng nào?',
        back: 'KHÔNG ÁP DỤNG cho CÔNG CHỨC GIỮ CHỨC VỤ LÃNH ĐẠO, QUẢN LÝ.\n\n💡 Giải thích: Công chức lãnh đạo vi phạm mức này sẽ bị Giáng chức hoặc Cách chức.',
        tag: 'Hình Thức Kỷ Luật'
      },
      {
        id: 5,
        front: 'Thời hạn bổ nhiệm công chức giữ chức vụ lãnh đạo, quản lý là bao nhiêu năm?',
        back: '05 NĂM (trừ trường hợp pháp luật chuyên ngành có quy định thời hạn bổ nhiệm dưới 05 năm).',
        tag: 'Bổ Nhiệm Cán Bộ'
      },
      {
        id: 6,
        front: 'Công chức 02 năm liên tiếp xếp loại chất lượng ở mức "Không hoàn thành nhiệm vụ" thì bị xử lý ra sao?',
        back: 'Cơ quan, tổ chức, đơn vị có thẩm quyền giải quyết CHO THÔI VIỆC.\n\n📌 Căn cứ: Khoản 3 Điều 58 Luật Cán bộ, công chức.',
        tag: 'Đánh Giá & Thôi Việc'
      },
      {
        id: 7,
        front: 'Thời gian tập sự đối với người trúng tuyển vào ngạch Chuyên viên (loại C) là bao lâu?',
        back: '12 THÁNG.\n\n💡 Mẹo nhớ:\n• Ngạch Chuyên viên (đại học): 12 tháng.\n• Ngạch Cán sự (cao đẳng/trung cấp): 06 tháng.',
        tag: 'Tập Sự Công Chức'
      },
      {
        id: 8,
        front: 'Ai có thẩm quyền quy định chi tiết về tuyển dụng, sử dụng và quản lý công chức?',
        back: 'CHÍNH PHỦ (thông qua việc ban hành Nghị định 138/2020/NĐ-CP).',
        tag: 'Thẩm Quyền Chính Phủ'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Thời hiệu xử lý kỷ luật đối với hành vi vi phạm đến mức phải kỷ luật Khiển trách là bao lâu?',
        options: ['A. 12 tháng', 'B. 02 năm', 'C. 05 năm', 'D. Không áp dụng thời hiệu'],
        correct: 1,
        explanation: 'Căn cứ Khoản 1 Điều 80 Luật CBCC sửa đổi 2019: Thời hiệu xử lý kỷ luật khiển trách là 02 năm.'
      },
      {
        id: 2,
        question: 'Trường hợp nào sau đây công chức bị giải quyết cho thôi việc?',
        options: [
          'A. 01 năm không hoàn thành nhiệm vụ',
          'B. 02 năm liên tiếp xếp loại không hoàn thành nhiệm vụ',
          'C. Bị khiển trách 1 lần',
          'D. Đi làm muộn 3 lần trong tháng'
        ],
        correct: 1,
        explanation: 'Căn cứ Khoản 3 Điều 58 Luật CBCC: Công chức 02 năm liên tiếp không hoàn thành nhiệm vụ sẽ bị cơ quan có thẩm quyền cho thôi việc.'
      }
    ]
  },
  {
    id: 'mkt_kaiwa_n2',
    title: '40 Mẫu Ngữ Pháp & Tình Huống Kính Ngữ Tiếng Nhật Kaiwa Doanh Nghiệp',
    subtitle: 'Keigo, Kenjougo, Đàm Phán & Xử Lý Sự Cố Thương Mại Chuẩn N2-N1',
    description: 'Bộ thẻ phản xạ giao tiếp tiếng Nhật thương mại thực chiến: Phân biệt Tôn kính ngữ (Sonkeigo), Khiêm nhường ngữ (Kenjougo), từ chối lịch sự, xin phép cấp trên và thương lượng đối tác.',
    category: 'ngoai-ngu',
    categoryName: 'Tiếng Nhật Kaiwa',
    categoryLabel: 'JLPT N2 & Business',
    priceXu: 3, // Siết giá cực rẻ: 3 Xu (~3.000đ)
    cardCount: 18,
    authorName: 'Sensei Phương Mai (JLPT N1)',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    authorTier: 'plus',
    salesCount: 620,
    rating: 4.94,
    createdAt: '2026-10-10',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'Chuyển câu sau sang Tôn kính ngữ chuẩn cho Giám đốc đối tác: 「社長、見ましたか？」 (Giám đốc đã xem chưa?)',
        back: 'Đáp án: 「社長、ご覧になりましたか？」 (Shachou, goran ni narimashita ka?)\n\n💡 Tránh nhầm với 拝見しました (Haiken shimashita) - đây là Khiêm nhường ngữ dùng cho bản thân mình.',
        tag: 'Tôn Kính Ngữ'
      },
      {
        id: 2,
        front: 'Chuyển câu sau sang Khiêm nhường ngữ khi nói về bản thân: 「明日、あなたの会社に行きます。」 (Ngày mai tôi sẽ đến công ty của anh)',
        back: 'Đáp án: 「明日、貴社へ伺います。」 (Ashita, kisha e ukagaimasu.)\nHoặc: 「明日、参ります。」 (Ashita, mairimasu.)',
        tag: 'Khiêm Nhường Ngữ'
      },
      {
        id: 3,
        front: 'Khi nghe điện thoại, khách hỏi Giám đốc Tanaka của công ty bạn, bạn trả lời ra sao?',
        back: 'Đáp án chuẩn: 「田中はあいにく外出しております。」 (Tanaka wa ainiku gaishutsu shite orimasu.)\n\n💡 Lưu ý: Khi nói với khách ngoài, KHÔNG ĐƯỢC thêm chức danh "Shachou" hay "San" vào tên sếp mình.',
        tag: 'Điện Thoại Doanh Nghiệp'
      },
      {
        id: 4,
        front: 'Mẫu câu đệm từ chối lịch sự trong kinh doanh (Kushizashi Kotoba)?',
        back: '「大変申し上げにくいのですが...」 (Tôi rất khó nói điều này nhưng mà...)\n「あいにくではございますが...」 (Thật không may nhưng mà...)',
        tag: 'Từ Chối Tế Nhị'
      },
      {
        id: 5,
        front: 'Khi nhờ đối tác kiểm tra tài liệu giúp mình, mẫu câu lịch sự nhất là gì?',
        back: '「ご確認のほど、よろしくお願い申し上げます。」 (Gokakunin no hodo, yoroshiku onegai moushiagemasu.)',
        tag: 'Email Thương Mại'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Khi nói về việc chính mình đọc tài liệu của khách hàng, bạn dùng từ nào?',
        options: [
          'A. ご覧になります (Goran ni narimasu)',
          'B. 拝見します (Haiken shimasu)',
          'C. お読みになります (Oyomi ni narimasu)',
          'D. 見られます (Miraremasu)'
        ],
        correct: 1,
        explanation: '拝見します (Haiken shimasu) là Khiêm nhường ngữ (Kenjougo) của 見る/読む, dùng để hạ mình khi đọc tài liệu của đối tác.'
      }
    ]
  },
  {
    id: 'mkt_vien_chuc_y_te',
    title: '40 Câu Trắc Nghiệm & Flashcard Luật Khám Chữa Bệnh & Y Đức 2026',
    subtitle: 'Cập Nhật Luật Khám Bệnh Chữa Bệnh 2023, CME & Quy Tắc Ứng Xử Bệnh Viện',
    description: 'Dành riêng cho bác sĩ, điều dưỡng thi tuyển viên chức y tế các bệnh viện công lập năm 2026. Phân cấp chuyên môn kỹ thuật, quy trình cấp giấy phép hành nghề, quyền và nghĩa vụ của người bệnh.',
    category: 'cong-chuc',
    categoryName: 'Viên Chức Y Tế',
    categoryLabel: 'Y Tế & Bệnh Viện',
    priceXu: 4, // Siết giá cực rẻ: 4 Xu (~4.000đ)
    cardCount: 16,
    authorName: 'Bác Sĩ Trọng Nghĩa (Bệnh Viện Bạch Mai)',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
    authorTier: 'pro',
    salesCount: 430,
    rating: 4.92,
    createdAt: '2026-10-08',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'Luật Khám bệnh, chữa bệnh mới quy định hệ thống cơ sở khám bệnh, chữa bệnh gồm mấy cấp chuyên môn kỹ thuật?',
        back: 'GỒM 03 CẤP:\n1. Cấp khám bệnh, chữa bệnh BAN ĐẦU.\n2. Cấp khám bệnh, chữa bệnh CƠ BẢN.\n3. Cấp khám bệnh, chữa bệnh CHUYÊN SÂU.\n\n📌 Thay thế cho mô hình 4 tuyến (xã, huyện, tỉnh, trung ương) trước đây.',
        tag: 'Luật KBCB 2023'
      },
      {
        id: 2,
        front: 'Thời hạn của Giấy phép hành nghề khám bệnh, chữa bệnh là bao nhiêu năm?',
        back: '05 NĂM (kể từ ngày cấp).\n\n📌 Quy định mới yêu cầu định kỳ 5 năm phải gia hạn và chứng minh hoàn thành cập nhật kiến thức y khoa liên tục (CME).',
        tag: 'Giấy Phép Hành Nghề'
      },
      {
        id: 3,
        front: 'Người hành nghề có quyền từ chối khám bệnh, chữa bệnh trong trường hợp nào?',
        back: '1. Tiên lượng bệnh vượt quá phạm vi hành nghề hoặc khả năng thực tế (nhưng phải giới thiệu đến cơ sở khác).\n2. Người bệnh, thân nhân có hành vi xâm phạm thân thể, sức khỏe, danh dự của nhân viên y tế.\n3. Người bệnh yêu cầu phương pháp trái quy định pháp luật hoặc đạo đức nghề nghiệp.',
        tag: 'Quyền Của Y Bác Sĩ'
      },
      {
        id: 4,
        front: 'Hồ sơ bệnh án nội trú phải được lưu trữ tối thiểu bao nhiêu năm?',
        back: 'Ít nhất 10 NĂM.\n(Trường hợp tai nạn lao động, bệnh nghề nghiệp lưu ít nhất 15 năm; trường hợp tử vong lưu ít nhất 20 năm).',
        tag: 'Lưu Trữ Bệnh Án'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Hệ thống cơ sở khám bệnh, chữa bệnh theo Luật mới được phân thành mấy cấp chuyên môn kỹ thuật?',
        options: ['A. 2 cấp', 'B. 3 cấp (Ban đầu, Cơ bản, Chuyên sâu)', 'C. 4 tuyến', 'D. 5 cấp'],
        correct: 1,
        explanation: 'Luật KBCB 2023 phân thành 3 cấp chuyên môn kỹ thuật: Cấp ban đầu, cấp cơ bản và cấp chuyên sâu.'
      }
    ]
  },
  {
    id: 'pass_sat_reading_800',
    title: '[PASS LẠI] Siêu Phẩm SAT Reading & Writing - Mình Vừa Thi Đạt 1510 Điểm!',
    subtitle: 'Bộ thẻ từ vựng context khó + kinh nghiệm gạch chân keyword từ thí sinh 1510 SAT',
    description: 'Mình mua học xong đợt tháng 9 vừa rồi, pass lại giá siêu sinh viên (2 Xu) cho bạn nào chuẩn bị thi Digital SAT đợt tới. Bộ thẻ giải thích cực chi tiết ngữ cảnh từ vựng khó và bẫy đề thi!',
    category: 'ngoai-ngu',
    categoryName: 'SAT & Ngoại Ngữ',
    categoryLabel: 'Digital SAT Pass C2C',
    priceXu: 2, // Siết giá cực rẻ: 2 Xu (~2.000đ)
    originalPriceXu: 25,
    cardCount: 25,
    authorName: 'Minh Thư (IELTS 8.5 / SAT 1520)',
    passSellerName: 'Hoàng Long (Sinh viên NEU - Đã thi 1510 SAT)',
    passSellerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    passSellerTier: 'plus',
    passNote: 'Mình vừa thi đỗ SAT 1510 điểm (Verbal 730)! Pass lại thẻ siêu rẻ 2 Xu cho các bạn khóa sau ôn gấp lấy học bổng.',
    isPassDeck: true,
    salesCount: 142,
    rating: 5.0,
    createdAt: '2026-10-11',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'equivocal /ɪˈkwɪv.ə.kəl/ (adj) [Kèm Note Hoàng Long 1510 SAT]',
        back: 'Nghĩa: Mập mờ, nước đôi, khó đoán định (ambiguous, uncertain).\nVí dụ: His equivocal response left the jury uncertain about his guilt.\n💡 Note cá nhân: Bẫy College Board rất hay cho từ này ở câu hỏi về Tone của tác giả khi có sự lưỡng lự!',
        tag: 'SAT Reading Note'
      },
      {
        id: 2,
        front: 'aberrant /əˈber.ənt/ (adj) [Kèm Note Hoàng Long 1510 SAT]',
        back: 'Nghĩa: Khác thường, dị biệt (departing from an accepted standard).\nVí dụ: The scientist noticed aberrant behavior in the lab mice after the test.\n💡 Note: Phân biệt với "aberration" (danh từ).',
        tag: 'SAT Vocabulary'
      },
      {
        id: 3,
        front: 'pernicious /pəˈnɪʃ.əs/ (adj) [Kèm Note Hoàng Long 1510 SAT]',
        back: 'Nghĩa: Độc hại ngấm ngầm, tác hại âm thầm nguy hiểm.\nVí dụ: Misinformation can have a pernicious effect on democratic debate.\n💡 Note: Hay gặp trong các bài đọc Lịch sử / Xã hội học.',
        tag: 'SAT High-Freq'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Theo note của Hoàng Long, từ "equivocal" thường xuất hiện trong dạng câu hỏi nào?',
        options: [
          'A. Xác định Tone và thái độ của tác giả',
          'B. Tìm lỗi chính tả dấu phẩy',
          'C. Tính toán đồ thị hình học',
          'D. Điền liên từ nối câu'
        ],
        correct: 0,
        explanation: 'Equivocal nghĩa là mập mờ, lưỡng lự, là từ khóa kinh điển trong câu hỏi phân tích thái độ (Tone) của tác giả trong Digital SAT.'
      }
    ]
  }
];

// Ensure each deck has sampleCards alias for backward compatibility
INITIAL_MARKETPLACE_DECKS.forEach(d => {
  d.sampleCards = d.previewCards;
});

// Get all marketplace decks (with auto-migration to rich format and lower prices)
export function getMarketplaceDecks() {
  try {
    const raw = localStorage.getItem(MARKETPLACE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].previewCards) {
        return parsed;
      }
    }
  } catch (e) {}

  // Cache fresh high-quality decks
  try {
    localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(INITIAL_MARKETPLACE_DECKS));
  } catch (e) {}
  return INITIAL_MARKETPLACE_DECKS;
}

// Clean and prepare deck for Firestore (remove undefined fields)
function sanitizeDeckForFirestore(deck) {
  try {
    return JSON.parse(JSON.stringify(deck));
  } catch (e) {
    return { ...deck };
  }
}

// Sync single deck to Firebase Firestore
export async function syncDeckToFirestore(deck) {
  try {
    const db = getFirestoreDb();
    if (db && deck?.id) {
      const clean = sanitizeDeckForFirestore(deck);
      await setDoc(doc(db, 'marketplace_decks', String(deck.id)), clean, { merge: true });
    }
  } catch (err) {
    console.warn('Firestore deck sync note:', err.message);
  }
}

// Broadcast deck to Cloud Relay (cross-browser / cross-device broadcast)
export async function broadcastDeckToCloudRelay(deck) {
  if (typeof fetch === 'undefined') return;
  try {
    const clean = sanitizeDeckForFirestore(deck);
    await fetch(`https://ntfy.sh/${CLOUD_MARKETPLACE_TOPIC}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'publish_deck', data: clean, timestamp: new Date().toISOString() }),
      headers: { 'Title': 'Marketplace Deck', 'Tags': 'books,sparkles' }
    });
  } catch (e) {}
}

// Fetch cross-device decks from Cloud Relay stream
export async function fetchCloudRelayMarketplaceDecks() {
  if (typeof fetch === 'undefined') return [];
  try {
    const res = await fetch(`https://ntfy.sh/${CLOUD_MARKETPLACE_TOPIC}/json?poll=1&since=all`);
    if (!res.ok) return [];
    const text = await res.text();
    const lines = text.trim().split('\n');
    const incoming = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        if (json.event === 'message' && json.message) {
          let body = typeof json.message === 'string' ? JSON.parse(json.message) : json.message;
          if (body?.data?.id) {
            incoming.push(body.data);
          } else if (body?.id && body?.title) {
            incoming.push(body);
          }
        }
      } catch (e) {}
    }
    return incoming;
  } catch (e) {
    return [];
  }
}

// Merge remote decks into local marketplace cache
export function mergeAndSaveMarketplaceDecks(remoteDecks) {
  if (!Array.isArray(remoteDecks) || remoteDecks.length === 0) {
    return getMarketplaceDecks();
  }

  const currentLocal = getMarketplaceDecks();
  const deckMap = new Map();

  // 1. Initial baseline decks
  INITIAL_MARKETPLACE_DECKS.forEach((d) => deckMap.set(d.id, d));

  // 2. Local decks
  currentLocal.forEach((d) => deckMap.set(d.id, d));

  // 3. Incoming remote decks (from Firestore or Cloud Relay)
  remoteDecks.forEach((d) => {
    if (d && d.id) {
      deckMap.set(d.id, { ...(deckMap.get(d.id) || {}), ...d });
    }
  });

  const merged = Array.from(deckMap.values());
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
          console.warn('Firestore marketplace onSnapshot notice:', err.message);
        }
      );
    } catch (e) {
      console.warn('Firestore marketplace subscription error:', e);
    }
  }

  // 2. Initial Cloud Relay fetch
  fetchCloudRelayMarketplaceDecks().then((cloudDecks) => {
    if (cloudDecks.length > 0) {
      const merged = mergeAndSaveMarketplaceDecks(cloudDecks);
      callback(merged);
    }
  });

  // 3. Periodic cloud poller (every 10s)
  const intervalId = setInterval(async () => {
    const cloudDecks = await fetchCloudRelayMarketplaceDecks();
    if (cloudDecks.length > 0) {
      const merged = mergeAndSaveMarketplaceDecks(cloudDecks);
      callback(merged);
    }
  }, 10000);

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    clearInterval(intervalId);
  };
}

// Pass deck from student buyer to peer C2C
export function passDeckToMarketplace({ originalCourse, passPriceXu, passNote, sellerUser }) {
  const current = getMarketplaceDecks();
  const sellerName = sellerUser?.displayName || sellerUser?.name || 'Học Viên Pass Thẻ';
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
    authorAvatar: originalCourse.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    passSellerName: sellerName,
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
