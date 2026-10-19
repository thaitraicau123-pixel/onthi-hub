/**
 * High-Yield 1-Page Cheatsheets Data for OnThiHub
 * Condenses essential rules, numbers, formulas, and pitfalls for rapid 3-minute pre-exam review.
 */

export const CHEATSHEETS_DATA = {
  'cc-kien-thuc-chung': {
    title: 'Bảng Cheatsheet Cứu Sinh: Công Chức 2026 (Kiến Thức Chung)',
    subtitle: 'Tổng hợp con số then chốt, thời hạn pháp lý & bẫy trắc nghiệm vòng 1',
    badge: '🏛️ Công Chức Vòng 1',
    category: 'cong-chuc',
    updatedDate: '2026-10-19',
    sections: [
      {
        title: '🔢 Các Con Số Thời Hạn Vàng (Cực Hay Ra Đề)',
        items: [
          { label: 'Thời gian tập sự chuyên viên', value: '12 tháng', note: 'Ngạch cán sự hoặc nhân viên: 06 tháng' },
          { label: 'Biệt phái công chức', value: 'Tối đa 03 năm', note: 'Không biệt phái nữ đang mang thai hoặc nuôi con dưới 36 tháng tuổi' },
          { label: 'Luân chuyển công chức', value: 'Ít nhất 03 năm', note: 'Thực hiện đối với chức danh lãnh đạo, quản lý quy hoạch' },
          { label: 'Thời hiệu xử lý kỷ luật thông thường', value: '05 năm (khiển trách: 02 năm)', note: 'Hành vi vi phạm nghiêm trọng có thời hiệu 05 năm' },
          { label: 'Không áp dụng thời hiệu kỷ luật', value: '4 trường hợp', note: 'Đảng viên vi phạm khai trừ; vi phạm chính trị nội bộ; sử dụng văn bằng giả; tham nhũng' },
          { label: 'Kéo dài thời hạn nâng bậc lương', value: '06 tháng (khiển trách) / 12 tháng (cảnh cáo)', note: 'Giáng chức/Cách chức: kéo dài 12 tháng' },
          { label: 'Cơ cấu Đại biểu Quốc hội', value: 'Không quá 500 người', note: 'Đại biểu chuyên trách tối thiểu 40%' }
        ]
      },
      {
        title: '⚖️ Hình Thức Kỷ Luật Công Chức (Luật 2019 Mới Nhất)',
        items: [
          { label: 'Không giữ chức vụ lãnh đạo (4 hình thức)', value: 'Khiển trách ➔ Cảnh cáo ➔ Hạ bậc lương ➔ Buộc thôi việc', note: '⚠️ Đã BÃI BỎ hình thức "Hạ bậc lương" đối với người giữ chức vụ lãnh đạo' },
          { label: 'Giữ chức vụ lãnh đạo, quản lý (5 hình thức)', value: 'Khiển trách ➔ Cảnh cáo ➔ Giáng chức ➔ Cách chức ➔ Buộc thôi việc', note: '⚠️ Không còn hình thức "Hạ bậc lương" cho công chức lãnh đạo' }
        ]
      },
      {
        title: '⚠️ Bẫy Đề Thi Cần Phân Biệt Ngay Trong 3 Giây',
        items: [
          { label: 'Cán bộ vs Công chức', value: 'Cán bộ: bầu cử, theo nhiệm kỳ • Công chức: tuyển dụng, bổ nhiệm vào ngạch/vị trí việc làm', note: 'Viên chức: tuyển dụng theo hợp đồng làm việc tại ĐVSN công lập' },
          { label: 'Biệt phái vs Luân chuyển vs Điều động', value: 'Biệt phái: tạm thời có thời hạn • Luân chuyển: đào tạo cán bộ lãnh đạo • Điều động: chuyển giữa các cơ quan', note: 'Từ khóa phân biệt: Luân chuyển = bắt buộc là lãnh đạo/quản lý' },
          { label: 'Số kỳ họp Quốc hội mỗi năm', value: '02 kỳ thường lệ (Kỳ 1: Tháng 5, Kỳ 2: Tháng 10)', note: 'Có thể họp bất thường theo yêu cầu của Chủ tịch nước, UBTVQH hoặc ít nhất 1/3 tổng số ĐBQH' }
        ]
      }
    ],
    quickTips: [
      'Đề Vòng 1 gồm 60 câu Kiến thức chung thi trong 60 phút, cần đúng 30/60 câu là ĐỖ.',
      'Khi gặp câu hỏi về thời gian bảo quản hồ sơ, thời hạn khiếu nại nếu phân vân, ưu tiên mốc: 15 ngày, 30 ngày hoặc 12 tháng.',
      'Nguyên tắc: "Đảng lãnh đạo" luôn là nguyên tắc đầu tiên trong mọi văn bản luật của Việt Nam.'
    ]
  },

  'it-frontend-system': {
    title: 'Bảng Cheatsheet Cứu Sinh: Phỏng Vấn IT & System Design',
    subtitle: 'Kiến trúc phân tán, Caching, Database Indexing & Độ trễ then chốt',
    badge: '💻 IT & System Design',
    category: 'it-tech',
    updatedDate: '2026-10-19',
    sections: [
      {
        title: '⚡ Bảng Con Số Độ Trễ Mọi Kỹ Sư Phải Thuộc Lòng',
        items: [
          { label: 'Truy xuất CPU L1 Cache', value: '~0.5 - 1 ns', note: 'Siêu nhanh' },
          { label: 'Đọc bộ nhớ chính (RAM)', value: '~100 ns', note: 'Chậm hơn L1 ~100-200 lần' },
          { label: 'Đọc ngẫu nhiên từ ổ SSD NVMe', value: '~10 - 150 µs', note: 'Chậm hơn RAM ~1.000 lần' },
          { label: 'Đọc ngẫu nhiên từ ổ HDD truyền thống', value: '~1 - 10 ms', note: 'Chậm hơn SSD hàng trăm lần' },
          { label: 'Gói tin RTT (Hà Nội ➔ Singapore)', value: '~30 - 45 ms', note: 'Xuyên đại dương CA ➔ NL ~150ms' }
        ]
      },
      {
        title: '🛡️ Bộ 3 Khái Niệm Caching Dễ Nhầm Lẫn',
        items: [
          { label: 'Cache Stampede (Thundering Herd)', value: '1 Key Hot hết hạn TTL, hàng nghìn request dồn vào DB', note: 'Giải pháp: Mutex lock / Early recompute (XFetch)' },
          { label: 'Cache Penetration', value: 'Query dữ liệu KHÔNG HỀ TỒN TẠI khiến cache miss 100%', note: 'Giải pháp: Bloom Filter hoặc Cache giá trị NULL với TTL ngắn' },
          { label: 'Cache Breakdown vs Avalanche', value: 'Breakdown: 1 key hot chết • Avalanche: hàng loạt key cùng hết hạn TTL', note: 'Giải pháp Avalanche: Thêm Random Jitter vào TTL (ví dụ TTL = 300s + rand(0, 60s))' }
        ]
      },
      {
        title: '🏗️ Mẫu Kiến Trúc Hệ Thống Chuẩn Phỏng Vấn',
        items: [
          { label: 'CAP Theorem', value: 'Chỉ chọn được 2: Consistency, Availability, Partition Tolerance', note: 'Trong mạng phân tán, P là bắt buộc ➔ Hệ thống phải chọn CP hoặc AP' },
          { label: 'Distributed Lock an toàn', value: 'Redis Redlock (thuật toán đa node) hoặc Zookeeper ephemeral node', note: 'Không dùng SETNX đơn thuần vì không an toàn khi master failover' },
          { label: 'Giao dịch phân tán (Microservices)', value: 'Saga Pattern (Orchestration/Choreography) hoặc Outbox Pattern', note: 'Tránh xa 2PC (Two-Phase Commit) vì dễ blocking và kém chịu lỗi' }
        ]
      }
    ],
    quickTips: [
      'Khi thiết kế System Design, luôn hỏi phỏng vấn viên: QPS (Read/Write), Dung lượng lưu trữ 5 năm, SLA yêu cầu (99.9% hay 99.99%).',
      'Luôn nhớ công thức nhẩm: 10 triệu active users/ngày với 100 request/user ≈ 12.000 QPS trung bình (Peak x2-x3 ≈ 30.000 QPS).'
    ]
  },

  'ielts-academic-vocab': {
    title: 'Bảng Cheatsheet Cứu Sinh: IELTS 7.5+ & Academic Collocations',
    subtitle: 'Top cụm Collocation ăn điểm tiêu chí Lexical Resource & Từ nối C1/C2',
    badge: '🌍 IELTS Band 7.5+',
    category: 'ngoai-ngu',
    updatedDate: '2026-10-19',
    sections: [
      {
        title: '💎 Top High-Scoring Collocations Cho Writing Task 2',
        items: [
          { label: 'Exacerbate the situation', value: 'Làm trầm trọng thêm tình hình', note: 'Nâng cấp từ: "make it worse"' },
          { label: 'Exert a detrimental impact on', value: 'Gây tác động tiêu cực sâu sắc lên...', note: 'Nâng cấp từ: "have a bad effect on"' },
          { label: 'Mitigate environmental degradation', value: 'Xoa dịu sự suy thoái môi trường', note: 'Cực hay dùng cho topic Environment / Climate Change' },
          { label: 'Spur technological innovation', value: 'Thúc đẩy đổi mới công nghệ đột phá', note: 'Nâng cấp từ: "encourage new tech"' },
          { label: 'Precipitate an economic crisis', value: 'Kích hoạt / châm ngòi khủng hoảng kinh tế', note: 'Nâng cấp từ: "cause a crisis"' },
          { label: 'Pave the way for future breakthroughs', value: 'Mở đường cho các bước đột phá tương lai', note: 'Tuyệt vời cho đoạn Conclusion' }
        ]
      },
      {
        title: '🔗 Cohesive Devices C1/C2 (Thay Thế Cho "However, But, So")',
        items: [
          { label: 'Notwithstanding the fact that...', value: 'Mặc dù thực tế là... (Mệnh đề nhượng bộ)', note: 'Trang trọng hơn "Although / Even though"' },
          { label: 'In stark contrast to...', value: 'Tương phản rõ rệt với...', note: 'Hoàn hảo cho dạng so sánh 2 xu hướng Writing Task 1' },
          { label: 'By virtue of...', value: 'Bởi vì / Nhờ vào đặc quyền của...', note: 'Nâng cấp từ "Because of"' },
          { label: 'It is widely contended that...', value: 'Người ta thường tranh luận rộng rãi rằng...', note: 'Mở bài Task 2 cực mượt' }
        ]
      }
    ],
    quickTips: [
      'Tuyệt đối không lạm dụng "In my opinion" quá 2 lần trong bài; thay bằng: "From my perspective" hoặc "It is my firm conviction that...".',
      'Tránh dùng "very" + tính từ thường; thay bằng: very good ➔ exemplary; very bad ➔ disastrous; very big ➔ monumental.'
    ]
  },

  'jlpt-n3-n2-kanji': {
    title: 'Bảng Cheatsheet Cứu Sinh: Kanji JLPT N3 - N2 Cốt Lõi',
    subtitle: 'Quy tắc chuyển âm Hán - Việt sang Âm On (Onyomi) & Bộ thủ bẫy nghĩa',
    badge: '🇯🇵 Kanji N3 - N2',
    category: 'ngoai-ngu',
    updatedDate: '2026-10-19',
    sections: [
      {
        title: '🔑 Quy Tắc Vàng Đoán Âm On (Onyomi) Từ Hán Việt',
        items: [
          { label: 'Từ Hán Việt kết thúc bằng "-P, -T, -C"', value: 'Âm On tiếng Nhật thường kết thúc bằng "TSU / KU / KI"', note: 'Ví dụ: Phát (Hats-u) • Thất (Shits-u) • Quốc (Kok-u)' },
          { label: 'Từ Hán Việt kết thúc bằng "-N, -NG, -NH"', value: 'Âm On thường có trường âm "-OU / -EI" hoặc kết thúc bằng "-N"', note: 'Ví dụ: Công (Kou) • Thành (Sei) • Tân (Shin)' },
          { label: 'Dấu huyền, ngã, nặng trong Hán Việt', value: 'Thường tương ứng với âm Đục (Dakuon có tenten " )', note: 'Ví dụ: Đạo (Dou) • Vạn (Ban) • Định (Tei/Jou)' }
        ]
      },
      {
        title: '⚠️ Cặp Chữ Kanji Rất Dễ Nhìn Nhầm Trong Đề Thi',
        items: [
          { label: '治 (Trị - Chữa trị / cai trị) vs 冶 (Dã - Luyện kim)', value: '治 có 3 chấm thủy (氵) • 冶 có 2 chấm băng (冫)', note: 'Bẫy đề thi N2 chuyên môn' },
          { label: '待 (Đãi - Chờ đợi) vs 持 (Trì - Nắm giữ)', value: '待 có bộ Xích (彳) • 持 có bộ Thủ (扌 tay)', note: 'Đọc âm On: 待 (Tai) • 持 (Ji)' }
        ]
      }
    ],
    quickTips: [
      'Gặp từ ghép 2 chữ Hán (Jukugo) 90% đọc theo âm ON, từ đơn đứng một mình kèm Okurigana đọc theo âm KUN.',
      'Khi làm bài thi Moji-Goi, đọc kỹ chữ đứng trước và sau để không bị bẫy bởi âm ngắt (Sokuon っ) hay trường âm.'
    ]
  },

  'medical-terminology-core': {
    title: 'Bảng Cheatsheet Cứu Sinh: Thuật Ngữ Y Khoa & Luật KCB 2023',
    subtitle: 'Tiền tố / Hậu tố Latin y khoa & Các mốc mới nhất Luật 15/2023/QH15',
    badge: '🏥 Y Dược & Pháp Luật Y Tế',
    category: 'cong-chuc',
    updatedDate: '2026-10-19',
    sections: [
      {
        title: '🏛️ Điểm Mới Cốt Lõi Luật Khám Bệnh, Chữa Bệnh 2023',
        items: [
          { label: 'Thời hạn Giấy phép hành nghề', value: 'Có giá trị 05 năm (thay vì cấp 1 lần vĩnh viễn như Luật 2009)', note: 'Để gia hạn: Phải cập nhật kiến thức y khoa liên tục (CME)' },
          { label: 'Đánh giá năng lực hành nghề', value: 'Do Hội đồng Y khoa Quốc gia tổ chức', note: 'Bác sĩ bắt đầu áp dụng từ 01/01/2027; Y sĩ, Điều dưỡng từ 2028' },
          { label: 'Phân cấp chuyên môn kỹ thuật', value: 'Chia làm 3 cấp: Ban đầu ➔ Cơ bản ➔ Chuyên sâu', note: 'Thay thế cho phân tuyến chuyên môn kỹ thuật 4 tuyến trước đây' }
        ]
      },
      {
        title: '🩺 Gốc Từ & Tiền Tố Y Khoa Quốc Tế Thường Gặp',
        items: [
          { label: 'Gastr/o (Dạ dày)', value: 'Gastritis (Viêm dạ dày) • Gastroscopy (Nội soi dạ dày)', note: 'Hậu tố -itis = Viêm' },
          { label: 'Cardi/o (Tim mạch)', value: 'Cardiomegaly (Tim to) • Myocardial infarction (Nhồi máu cơ tim)', note: 'Hậu tố -megaly = To ra' },
          { label: 'Nephr/o / Ren/o (Thận)', value: 'Nephrolithiasis (Sỏi thận) • Renal failure (Suy thận)', note: 'Hậu tố -lithiasis = Có sỏi' }
        ]
      }
    ],
    quickTips: [
      'Nhân viên y tế được quyền từ chối khám chữa bệnh nếu bị người bệnh/thân nhân đe dọa xâm hại tính mạng, thân thể (trừ tình trạng cấp cứu).',
      'Đọc thuật ngữ Y khoa tiếng Anh theo thứ tự: Hậu tố trước (Suffix) ➔ Tiền tố (Prefix) ➔ Gốc từ (Root word).'
    ]
  },

  'finance-cfa-level1': {
    title: 'Bảng Cheatsheet Cứu Sinh: Tài Chính Doanh Nghiệp & CFA Level 1',
    subtitle: 'Hệ thống công thức DuPont, Tỷ số thanh khoản & Nguyên tắc IFRS',
    badge: '📊 Tài Chính & Kế Toán',
    category: 'kinh-te',
    updatedDate: '2026-10-19',
    sections: [
      {
        title: '📐 Công Thức Phân Tích DuPont (ROE Analysis)',
        items: [
          { label: 'DuPont 3 bước', value: 'ROE = Net Profit Margin × Asset Turnover × Financial Leverage', note: 'ROE = (NI / Revenue) × (Revenue / Assets) × (Assets / Equity)' },
          { label: 'DuPont 5 bước', value: 'ROE = Tax Burden × Interest Burden × EBIT Margin × Asset Turnover × Leverage', note: 'Chỉ rõ tác động của đòn bẩy thuế và chi phí lãi vay' }
        ]
      },
      {
        title: '💧 Bộ Tỷ Số Thanh Khoản (Liquidity Ratios)',
        items: [
          { label: 'Current Ratio (Thanh toán hiện hành)', value: 'Tài sản ngắn hạn / Nợ ngắn hạn', note: 'Thước đo khả năng trả nợ trong 1 năm' },
          { label: 'Quick Ratio / Acid-Test (Thanh toán nhanh)', value: '(Tiền mặt + Đầu tư ngắn hạn + Phải thu) / Nợ ngắn hạn', note: '⚠️ LOẠI TRỪ HÀNG TỒN KHO vì hàng tồn kho thanh khoản kém nhất' },
          { label: 'Cash Ratio (Thanh toán tức thời)', value: '(Tiền mặt + Các khoản tương đương tiền) / Nợ ngắn hạn', note: 'Khắt khe nhất' }
        ]
      }
    ],
    quickTips: [
      'Lợi thế thương mại (Goodwill): Theo IFRS & US GAAP không được trích khấu hao (Amortization) mà phải thực hiện Đánh giá suy giảm giá trị (Impairment test) hàng năm.',
      'Chi phí R&D theo IFRS: Research (Nghiên cứu) ghi nhận toàn bộ vào chi phí; Development (Phát triển) được vốn hóa nếu thỏa mãn 6 điều kiện.'
    ]
  }
};

/**
 * Get cheatsheet data for a course, with generic smart fallback
 */
export function getCheatSheetForCourse(course) {
  if (!course) return null;
  const courseId = course.id;
  if (CHEATSHEETS_DATA[courseId]) {
    return CHEATSHEETS_DATA[courseId];
  }

  // Smart fallback generator for custom/marketplace decks
  const cards = course.cards || course.previewCards || [];
  const keyPoints = cards.slice(0, 8).map((c, i) => ({
    label: c.front || `Câu trọng tâm #${i + 1}`,
    value: (c.back || '').slice(0, 150) + (c.back?.length > 150 ? '...' : ''),
    note: c.tag ? `Chủ đề: ${c.tag}` : 'Kiến thức cốt lõi'
  }));

  return {
    title: `Bảng Cheatsheet Tóm Tắt: ${course.title}`,
    subtitle: `Tóm tắt cô đọng các thẻ trọng tâm giúp bạn nắm chắc kiến thức trước giờ thi`,
    badge: course.categoryLabel || 'Tài Liệu Ôn Thi',
    category: course.category || 'all',
    updatedDate: '2026-10-19',
    sections: [
      {
        title: '📌 Các Điểm Nhớ Nhanh & Định Nghĩa Vàng',
        items: keyPoints
      }
    ],
    quickTips: [
      'Ôn kỹ các thẻ có đánh dấu sao hoặc câu sai trước khi bắt đầu bấm giờ thi thử.',
      'Áp dụng quy tắc lặp lại ngắt quãng SM-2: Ôn lại sau 1 ngày, 3 ngày và 7 ngày để nhớ trọn đời.'
    ]
  };
}
