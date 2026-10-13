// Changelog & What's New Data for OnThiHub
export const APP_VERSION = 'v2.7';
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
    version: 'v2.7',
    date: 'Tháng 10/2026 (Bản Mới Nhất)',
    badge: 'MỚI NHẤT 🔥',
    badgeColor: 'bg-gradient-to-r from-[#ff5f38] to-[#f02c85]',
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
