// Changelog & What's New Data for PromptMMO
export const APP_VERSION = 'v4.0';
export const LAST_SEEN_VERSION_KEY = 'promptmmo_last_seen_changelog_version';

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
    version: 'v4.0',
    date: 'Tháng 10/2026 (Chính Thức Ra Mắt PromptMMO)',
    badge: 'ĐẠI TU PROMPTMMO v4.0 🚀',
    badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
    title: 'Chuyển Đổi Nền Tảng: Chợ Prompt & AI Skills Thực Chiến Cho Dân MMO 💰',
    summary: 'Chính thức chuyển dịch toàn diện sang nền tảng Chợ Prompt & AI Skills. Hơn 1,000+ Prompt Higgsfield & Kling 1.5 Video 8K, Midjourney & Flux.1 ảnh studio, kịch bản TikTok Shop triệu view và công cụ MMO giá sỉ.',
    highlights: [
      {
        category: '🎬 Kho Prompt Video & Ảnh AI Thực Chiến Triệu View',
        color: 'amber',
        items: [
          '⚡ Prompt Higgsfield, Kling 1.5, Runway Gen-3 chuẩn cú pháp điện ảnh 8K kèm đầy đủ thông số Camera Zoom, Pan, Orbit và Negative Prompt.',
          '🎨 Prompt Ảnh Studio Midjourney v6.1 & Flux.1 cho ảnh quảng cáo sản phẩm, mẫu lookbook thời trang không tốn tiền thuê người mẫu.',
          '📋 1-Click Sao Chép Prompt siêu tốc kèm hướng dẫn thiết lập chi tiết bằng tiếng Việt.'
        ]
      },
      {
        category: '🏪 Sàn Giao Dịch Prompt C2C & Creator Studio (80% Lãi)',
        color: 'indigo',
        items: [
          '✍️ Creator Studio: Cho phép anh em làm MMO tự đóng gói bộ Prompt độc quyền và đăng bán lên sàn nhận ngay 80% Xu hoa hồng.',
          '🔁 Tính năng Pass Lại Prompt: Nhượng lại gói Prompt đã khai thác xong cho người khác trên Chợ C2C thu hồi Xu vào ví.',
          '💬 Chat 1-1 & Kết Bạn Nhanh: Trao đổi kinh nghiệm làm MMO, đính kèm gói prompt trực tiếp trong tin nhắn.'
        ]
      },
      {
        category: '🪙 Hệ Thống Ví Xu Tự Động & Rút Tiền Về Ngân Hàng',
        color: 'emerald',
        items: [
          '💳 Nạp Xu siêu tốc qua VietQR tự động chỉ 3-5 giây (1 Xu = 1,000 VNĐ).',
          '🏦 Rút tiền doanh thu về tài khoản ngân hàng nhanh chóng, đối soát minh bạch.',
          '🎁 Túi mù may mắn & Nhiệm vụ hàng ngày nhận Xu miễn phí mỗi ngày.'
        ]
      }
    ]
  }
];
