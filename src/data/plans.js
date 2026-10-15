export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Gói Free',
    tagline: 'Khởi đầu ôn tập & học thử',
    priceVnd: 0,
    priceXu: 0,
    period: 'Trọn đời',
    badge: 'Mặc định',
    isPopular: false,
    color: 'slate',
    features: [
      '5 lượt tạo Flashcard mỗi ngày',
      'Điểm danh hàng ngày: +2 lượt tạo miễn phí',
      'Học thử mọi bộ đề thi công chức, IT, Ngoại ngữ',
      'Trình lật thẻ 3D & kiểm tra trắc nghiệm',
      'Phí sàn đăng bán thẻ: 15%'
    ],
    ctaText: 'Đang Sử Dụng'
  },
  {
    id: 'plus',
    name: 'Gói Plus',
    tagline: 'Dành cho học sinh & sinh viên cày thi',
    priceVnd: 19000,
    priceXu: 19,
    period: 'tháng',
    badge: 'Tiết kiệm',
    isPopular: false,
    color: 'blue',
    features: [
      '35 lượt tạo Flashcard AI & thủ công/ngày',
      'Điểm danh hàng ngày: +5 lượt thưởng',
      'Mở khóa trọn bộ 1 chuyên đề bất kỳ',
      'Xuất file Anki (.apkg) & PDF không giới hạn',
      'Giảm phí sàn C2C xuống 10%',
      'Hỗ trợ kỹ thuật ưu tiên trong 24h'
    ],
    ctaText: 'Nâng Cấp Plus'
  },
  {
    id: 'pro',
    name: 'Gói Pro',
    tagline: 'Chuẩn bị thi công chức & phỏng vấn xin việc',
    priceVnd: 39000,
    priceXu: 39,
    period: 'tháng',
    badge: 'Phổ biến nhất 🔥',
    isPopular: true,
    color: 'indigo',
    features: [
      '100 lượt tạo Flashcard AI thông minh/ngày',
      'Điểm danh hàng ngày: +15 lượt thưởng',
      'Mở khóa TOÀN BỘ kho đề thi & Flashcard trên web',
      'Tính năng trích xuất đề thi từ file PDF / ảnh chụp',
      'Phí sàn C2C chỉ còn 7%',
      'Huy hiệu "Pro Member" nổi bật trên sàn'
    ],
    ctaText: 'Trở Thành Pro'
  },
  {
    id: 'ultra',
    name: 'Gói Ultra VIP',
    tagline: 'Dành cho Creator & Người luyện thi chuyên nghiệp',
    priceVnd: 79000,
    priceXu: 79,
    period: 'tháng',
    badge: 'Toàn năng 👑',
    isPopular: false,
    color: 'amber',
    features: [
      'KHÔNG GIỚI HẠN lượt tạo Flashcard (AI + Thủ công)',
      'Điểm danh hàng ngày: +30 lượt thưởng',
      'Đặc quyền Creator: Đăng bán bộ thẻ kiếm Xu không giới hạn',
      'Phí sàn thấp nhất: Chỉ 3% doanh thu',
      'Ưu tiên duyệt rút tiền về tài khoản ngân hàng trong 15 phút',
      'Cố vấn 1-1 hỗ trợ cập nhật đề thi mới'
    ],
    ctaText: 'Sở Hữu Ultra VIP'
  }
];
