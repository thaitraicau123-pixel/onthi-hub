// Changelog & What's New Data for OnThiHub
export const APP_VERSION = 'v3.0';
export const LAST_SEEN_VERSION_KEY = 'onthi_last_seen_changelog_version';

export function isChangelogUnread() {
  try {
    const seen = localStorage.getItem(LAST_SEEN_VERSION_KEY);
    return seen !== APP_VERSION;
  } catch (e) {
    return false;
  }
}

export function markChangelogAsRead() {
  try {
    localStorage.setItem(LAST_SEEN_VERSION_KEY, APP_VERSION);
  } catch (e) {}
}

export const CHANGELOG_DATA = [
  {
    version: 'v3.0',
    date: 'Tháng 10/2026 (Đại Tu Toàn Diện v3.0)',
    badge: 'SIÊU CẬP NHẬT v3.0 🚀',
    badgeColor: 'bg-gradient-to-r from-emerald-500 to-sky-600 text-white',
    title: 'Đại Tu Toàn Diện OnThiHub v3.0: Phòng Tự Học Ảo Live 24/7, Phao Cứu Sinh 1 Trang In A4 & Lộ Trình 30 Ngày 🎓',
    summary: 'Phiên bản v3.0 khắc phục triệt để lỗi đóng/mở Modal, nâng cấp PWA Network-First chống kẹt cache cũ, tích hợp bàn cày thẻ trực tiếp trong Phòng Tự Học Ảo kèm sóng não Alpha, chế độ Che Đáp Án tự kiểm tra và Xuất PDF A4 độc lập.',
    highlights: [
      {
        category: '👥 Phòng Tự Học Ảo v3.0 (Study With Me + Cày Thẻ Trực Tiếp)',
        color: 'emerald',
        items: [
          '⚡ Bàn Cày Thẻ Trực Tiếp Trong Phòng: Vừa bật Pomodoro và âm thanh nền vừa lật thẻ Anki, đổi môn và bấm "Đã Nhớ (+10 XP)" ngay trong phòng mà không làm ngắt tiếng mưa.',
          '🎧 Bộ Tạo Âm Thanh Web Audio API 3 Chế Độ: Tiếng mưa rơi thư giãn, quán Cafe đêm và Sóng não Alpha 10Hz giúp tập trung sâu kèm thanh chỉnh âm lượng trực tiếp.',
          '💬 Chat Cổ Vũ Thời Gian Thực (Cloud Relay): Gửi lời chúc và thả tim động viên đồng bộ trực tiếp với các sỹ tử đang thức ôn bài.'
        ]
      },
      {
        category: '📄 Phao Cứu Sinh 1 Trang v3.0 (Active Recall + In A4 Chuẩn)',
        color: 'indigo',
        items: [
          '🧠 Chế Độ Che Đáp Án Tự Kiểm Tra (Active Recall): Làm mờ toàn bộ đáp án để tự nhẩm trong đầu, chạm vào thẻ nào mở đáp án thẻ đó.',
          '🖨️ Cửa Sổ Xuất PDF / In A4 Độc Lập: Tách riêng trang in A4 2 cột sắc nét, không bị vướng khung giao diện web.',
          '🔊 Đọc Tóm Tắt Giọng Nói Tự Động (TTS): Nghe đọc liền mạch các mốc số liệu, thời hạn và điều khoản trọng tâm.'
        ]
      },
      {
        category: '🗺️ Lộ Trình Đích 30 Ngày & Máy Tính Chia Lịch Tự Động',
        color: 'amber',
        items: [
          '🧮 Máy Tính Chia Lịch Cày Thẻ: Nhập tổng số thẻ và số ngày còn lại trước kỳ thi để hệ thống tự tính số thẻ mới và thẻ ôn SM-2 mỗi ngày.',
          '⚡ Nút Hành Động Trực Tiếp Trên Từng Chặng: Bấm "Học Thẻ →", "Vào Phòng →", "Thi Thử →", "In A4 →" ngay tại từng mục tiêu lộ trình.'
        ]
      }
    ]
  },
  {
    version: 'v2.9',
    date: 'Tháng 10/2026',
    badge: 'ĐÃ CẬP NHẬT',
    badgeColor: 'bg-[#2383e2] text-white',
    title: 'Nâng Cấp Toàn Diện Động Cơ AI Tạo Thẻ Flashcard 🤖 & Hỗ Trợ Đa Mô Hình Gemini/OpenAI ⚡',
    summary: 'Sửa triệt để lỗi tạo thẻ AI bằng việc tích hợp các mô hình Gemini thế hệ mới (3.5-Flash, 3.6-Flash, 3-Flash-Preview), tự động failover đa tầng, tích hợp OpenAI Platform (GPT-4o-mini) và bộ bóc tách ngữ nghĩa thông minh ngoại tuyến.',
    highlights: [
      {
        category: '🤖 Cải Tiến Động Cơ AI Cloud Tạo Thẻ Flashcard',
        color: 'indigo',
        items: [
          '✨ Tích hợp các mô hình Gemini thế hệ mới: Chuyển sang gemini-3.5-flash, gemini-3.6-flash, gemini-3-flash-preview, loại bỏ hoàn toàn các mã model cũ bị ngừng hỗ trợ.',
          '🔄 Tự Động Failover Thông Minh: Khi một mô hình gặp sự cố quá tải hoặc hạn mức (503, 429), hệ thống tự động trượt qua mô hình tiếp theo trong chớp mắt mà không bao giờ làm gián đoạn người dùng.',
          '🌐 Hỗ Trợ OpenAI API (GPT-4o / GPT-4o-mini): Bổ sung hỗ trợ đầy đủ OpenAI API Platform, cho phép Admin/Học viên dùng song song hoặc dự phòng.',
          '🧠 Bộ Trích Xuất Ngữ Nghĩa Thông Minh Ngoại Tuyến (Smart Semantic Extractor): Tự động phân tích sâu đoạn văn bản, tài liệu bài giảng hoặc chủ đề người dùng dán vào để bóc tách thành thẻ câu hỏi - câu trả lời chất lượng cao ngay cả khi mất mạng hoặc hết lượt API.'
        ]
      },
      {
        category: '🎓 Nâng Cấp Trợ Lý AI Gia Sư & Tạo Đề Thi Trắc Nghiệm',
        color: 'emerald',
        items: [
          '💡 Giải Thích Chuyên Sâu 3 Phần: Trợ lý AI phân tích bản chất, cung cấp mẹo nhớ Spaced Repetition và chỉ ra bẫy trắc nghiệm dễ mắc phải cho từng thẻ.',
          '⚡ Tạo Đề Trắc Nghiệm 4 Phương Án: Tự động tạo câu hỏi trắc nghiệm có độ phân loại cao kèm giải thích chi tiết đáp án đúng/sai.'
        ]
      },
      {
        category: '💎 Đồng Bộ Icon Google & Giao Diện Quản Lý Tài Khoản Sang Trọng',
        color: 'amber',
        items: [
          '🎨 Đồng bộ Icon Favicon với App: Thay đổi icon tab trình duyệt / Google thành logo sách mở trên nền gradient hồng rực rỡ, khớp 100% với logo trong app.',
          '👑 Giao Diện Quản Lý Tài Khoản Đẳng Cấp: Thẻ VIP với góc kim loại cổ điển, hạn dùng, huy hiệu cao cấp cùng 4 tab trực quan (Hồ sơ, Gói & Hạn mức, Bảo mật, Tùy chọn học tập).',
          '✨ Tinh Giản Giao Diện: Loại bỏ các câu chữ rườm rà, tối giản các nút hành động giúp trải nghiệm học tập tập trung và mượt mà hơn.'
        ]
      }
    ]
  },
  {
    version: 'v2.8',
    date: 'Tháng 10/2026',
    badge: 'ĐÃ CẬP NHẬT',
    badgeColor: 'bg-purple-600',
    title: 'Đồng Bộ Duyệt Tiền Firebase Đa Thiết Bị ⚡ & Khóa Giao Diện Quizizz Rực Rỡ 🎨',
    summary: 'Đưa tính năng duyệt tiền lên Firebase Firestore đa nền tảng, giúp Admin thấy và duyệt ngay lệnh nạp từ điện thoại khác, đồng thời cố định 100% phong cách Quizizz sống động.',
    highlights: [
      {
        category: '⚡ Duyệt Tiền Firebase Firestore Đa Thiết Bị',
        color: 'emerald',
        items: [
          '🔥 Đưa toàn bộ lệnh Nạp Xu / Rút Tiền lên Firebase Firestore: Học viên tạo lệnh nạp từ điện thoại hay bất kỳ máy nào, Admin trên máy tính đều thấy ngay lập tức.',
          '✅ Duyệt Chay Thời Gian Thực: Khi Admin bấm "Duyệt", hệ thống Firebase tự động cộng Xu vào ví của học viên ngay tức khắc kèm chuông báo và pháo hoa.',
          '📱 Ô nhập Email/Số điện thoại nhận Xu tiện lợi: Đảm bảo cộng Xu chính xác cho tài khoản người nạp ngay cả khi chưa đăng nhập.',
          '🔄 Cloud Relay Dự Phòng 24/7: Đảm bảo thông báo rung điện thoại và lệnh nạp không bao giờ bị thất lạc.'
        ]
      },
      {
        category: '🎨 Khóa Cố Định Phong Cách Quizizz Rực Rỡ',
        color: 'rose',
        items: [
          '✨ Chuẩn hóa 100% phong cách Quizizz/Wayground: Tông màu hoàng hôn tím đậm - hồng neon - kem ấm áp được áp dụng nhất quán trên toàn bộ website.',
          '🧹 Loại bỏ hoàn toàn theme tối / theme sepia: Giúp trải nghiệm học tập và ôn thi luôn trực quan, tươi sáng và đồng bộ trên mọi màn hình.'
        ]
      }
    ]
  },
  {
    version: 'v2.7',
    date: 'Tháng 10/2026 (Bản Mới Nhất)',
    badge: 'MỚI NHẤT 🔥',
    badgeColor: 'bg-[#2383e2] text-white',
    title: 'Đánh Dấu Thẻ Sao ⭐, Game Nối Thẻ Kỷ Lục & Bản In Thẻ Cắt Giấy A4 ✂️',
    summary: 'Nâng cấp toàn diện trải nghiệm tự học: gắn sao thẻ khó, thi đua phá kỷ lục thời gian nối thẻ, xuất bản in cắt giấy A4 học offline và bộ lọc tìm kiếm thông minh.',
    highlights: [
      {
        category: '⭐ Tự Học Tùy Biến & Gắn Sao Thẻ',
        color: 'amber',
        items: [
          '⭐ Đánh dấu thẻ sao khó nhớ: Bấm biểu tượng ngôi sao ở cả 2 mặt thẻ hoặc trong danh sách để lọc nhanh những thẻ cần ôn gấp.',
          '📑 Bộ lọc Thẻ Sao trong Topic Drawer: Theo dõi số lượng thẻ quan trọng đã đánh dấu và chuyển chế độ chỉ ôn tập thẻ sao.',
          '🔍 Bộ lọc sắp xếp danh mục trang chủ: Dễ dàng xếp tài liệu theo Bán chạy nhất, Đánh giá cao nhất, hoặc Giá Xu tăng/giảm.'
        ]
      },
      {
        category: '🎮 Game Nối Thẻ 2.0 (Match Mode)',
        color: 'rose',
        items: [
          '⏱️ Bảng Kỷ lục Cá nhân (Personal Best): Tự động lưu thành tích bấm giờ tốt nhất cho từng bộ đề, kích thích tinh thần rèn luyện.',
          '🎉 Pháo hoa chúc mừng kỷ lục mới: Hiệu ứng confetti rực rỡ và huy hiệu Phá Kỷ Lục khi vượt qua thời gian cũ.',
          '🔊 Tích hợp phát âm giọng đọc chuẩn (Web Speech Synthesis): Nghe ngay thuật ngữ khi chạm vào thẻ nối.'
        ]
      },
      {
        category: '✂️ Bản In Thẻ Cắt Giấy Khổ A4 (Học Mọi Nơi)',
        color: 'emerald',
        items: [
          '📄 Tính năng In Thẻ Cắt Giấy A4 tiện lợi: Tự động dàn trang 8 ô thẻ / trang với đường nét đứt hướng dẫn dùng kéo cắt.',
          '✂️ Tiện lợi cho học viên muốn mang thẻ giấy học trên xe buýt, thư viện hoặc giờ giải lao không cần mở điện thoại.'
        ]
      }
    ]
  },
  {
    version: 'v2.6',
    date: 'Tháng 10/2026',
    badge: 'ĐÃ CẬP NHẬT',
    badgeColor: 'bg-purple-600',
    title: 'Hệ Thống Rung Chuông Báo Điện Thoại 24/7 & Chuẩn Hóa Ví Xu 100%',
    summary: 'Bản cập nhật đột phá: Kết nối trực tiếp chuông báo đẩy điện thoại qua ntfy.sh, chuẩn hóa thanh toán bộ thẻ thuần Tiền Xu, và bảo mật thông tin tối đa.',
    highlights: [
      {
        category: '🔔 Thông Báo Về Máy & Tự Động Hóa',
        color: 'purple',
        items: [
          '⚡ Rung chuông màn hình khóa điện thoại tức thì qua app ntfy.sh (Kênh: Onthihubbbbb) hoàn toàn miễn phí, không cần tạo tài khoản hay đăng nhập.',
          '📲 Tích hợp nút "Bấm Thử Rung Chuông Điện Thoại" ngay trong trang Admin để kiểm tra kết nối reo chuông màn hình khóa trong 1 giây.',
          '📧 Tự động gửi email thông báo chi tiết (mã giao dịch, số Xu, thông tin ngân hàng) về thaitraicau123@gmail.com qua FormSubmit API.',
          '🤖 Tùy chọn kết nối bot Telegram riêng tư để nhận tin nhắn nạp/rút trực tiếp.'
        ]
      },
      {
        category: '💰 Chuẩn Hóa Ví Xu & Nạp Rút Tiền',
        color: 'amber',
        items: [
          '🪙 100% tài liệu và bộ thẻ Flashcard mở khóa bằng Tiền Xu (Xu) của web thay vì tiền mặt trực tiếp, đúng chuẩn nền tảng học tập số.',
          '💳 Nạp Xu siêu tốc qua mã VietQR Napas 24/7 với cú pháp nạp tiền bảo mật.',
          '🏦 Rút tiền mặt về mọi ngân hàng Việt Nam (MB, Vietcombank, Techcombank...) với tỷ lệ quy đổi 1 Xu = 1.000 VNĐ minh bạch.',
          '⚡ Kết nối tự động tạo lệnh nạp ngay khi mở khóa thẻ trong PaymentModal, đảm bảo Admin nhận thông báo tức thì.'
        ]
      },
      {
        category: '🛡️ Bảo Mật & Riêng Tư Tuyệt Đối',
        color: 'rose',
        items: [
          '🔒 Gỡ bỏ hoàn toàn các nút và lời nhắc nhắn thẳng qua Zalo cá nhân, đảm bảo không bị làm phiền hay lộ thông tin riêng tư.',
          '✨ Tự động ẩn danh động cơ AI thành "Động Cơ AI ÔnThiHub Cloud", hoàn toàn chuyên nghiệp đối với học viên.',
          '📊 Bổ sung Bảng Nhật Ký Cập Nhật Tính Năng Mới (What’s New) theo dõi lộ trình phát triển.'
        ]
      }
    ]
  },
  {
    version: 'v2.5',
    date: 'Tháng 10/2026',
    badge: 'TÍNH NĂNG ĐỘT PHÁ',
    badgeColor: 'bg-emerald-600',
    title: 'Sổ Tay Câu Sai AI, Chế Độ Nối Thẻ & Sàn Pass Thẻ C2C',
    summary: 'Nâng cấp trải nghiệm luyện thi với các chế độ học tập thông minh mô phỏng Quizlet và Duolingo.',
    highlights: [
      {
        category: '🎮 Chế Độ Luyện Thi & Trò Chơi Phản Xạ',
        color: 'emerald',
        items: [
          '🕹️ Ra mắt Game Nối Thẻ Siêu Tốc (Match Mode) giúp phản xạ nối thuật ngữ với định nghĩa trong thời gian thực.',
          '📓 Sổ Tay Câu Sai & Điểm Yếu (Mistake Notebook): Tự động ghi nhớ câu làm sai trong phòng thi trắc nghiệm, chẩn đoán lỗ hổng kiến thức.',
          '🧠 Thuật toán Lặp lại ngắt quãng SuperMemo SM-2 tự động phân loại thẻ đến hạn ôn hàng ngày chống quên lãng.'
        ]
      },
      {
        category: '🔁 Sàn C2C & Pass Lại Bộ Thẻ Cũ',
        color: 'blue',
        items: [
          '🔄 Tính năng "Pass Thẻ Cũ": Cho phép học viên thi đỗ nhượng lại bộ thẻ đã học xong lên sàn để thu hồi Xu.',
          '🏷️ Người mua được giảm giá hời, người bán nhận 85-97% Xu theo cấp độ hội viên.'
        ]
      }
    ]
  },
  {
    version: 'v2.0',
    date: 'Tháng 9/2026',
    badge: 'NỀN TẢNG C2C',
    badgeColor: 'bg-blue-600',
    title: 'Sàn Thương Mại Điện Tử Flashcard C2C & Túi Mù Tri Thức',
    summary: 'Mở rộng nền tảng thành Chợ Tri Thức C2C kết hợp cơ chế Gamification hấp dẫn.',
    highlights: [
      {
        category: '🎁 Gamification & Đổi Thưởng',
        color: 'pink',
        items: [
          '🎲 Túi Mù Tri Thức (Blind Box): Cơ chế Gacha 100% trúng thưởng hoàn Xu, quà tặng giá trị và Jackpot nổ hũ 100 Xu.',
          '🔥 Chuỗi Ngày Học Liên Tục (Streak) & Điểm danh nhận lượt tạo thẻ miễn phí mỗi ngày.',
          '🍅 Tiện ích Pomodoro Timer Widget nổi trên màn hình giúp tập trung học sâu 25 phút.'
        ]
      },
      {
        category: '🏪 Sàn Thương Mại Điện Tử Flashcard',
        color: 'indigo',
        items: [
          '🏬 Học viên tự do đăng bán bộ đề thi tự soạn kiếm Xu.',
          '⭐ Hệ thống đánh giá sao, nhận xét và thống kê số lượt mua thực tế.',
          '👥 Diễn đàn thảo luận và hỏi đáp đề thi cộng đồng sôi nổi.'
        ]
      }
    ]
  },
  {
    version: 'v1.0',
    date: 'Tháng 8/2026',
    badge: 'KHỞI NGUYÊN',
    badgeColor: 'bg-slate-700',
    title: 'Kho Flashcard Anki Chính Quy & Trình Lật Thẻ 3D',
    summary: 'Phiên bản đầu tiên của ÔnThiHub với kho đề thi Công Chức, IT và Ngoại Ngữ.',
    highlights: [
      {
        category: '📚 Kho Tài Liệu Chính Quy',
        color: 'slate',
        items: [
          '🏛️ Trọn bộ đề thi Công chức 2026 chuẩn Vòng 1 Bộ Nội Vụ.',
          '💻 Bộ câu hỏi phỏng vấn IT Frontend, Backend, System Design.',
          '🌍 Từ vựng IELTS Collocations 7.5+ và Kanji JLPT N3 - N2.',
          '📥 Xuất file Anki (.apkg) 1 chạm và in file PDF tóm tắt bài giảng.'
        ]
      }
    ]
  }
];
