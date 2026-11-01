// DỮ LIỆU SẢN PHẨM PROMPT & AI SKILLS THỰC CHIẾN - PROMPTMMO 2026
// Hệ sinh thái Prompt Chuẩn Quốc Tế Cho Dân MMO, Creator & Video Editor

export const CATEGORIES = [
  {
    id: "all",
    name: "Tất cả",
    icon: "Sparkles"
  },
  {
    id: "web-craft",
    name: "🛠️ Dịch Vụ Web Bùi Thái",
    icon: "Code2"
  },
  {
    id: "video-ai",
    name: "🎬 Video AI Triệu View",
    icon: "Gamepad2"
  },
  {
    id: "image-ai",
    name: "🎨 Ảnh AI Chuẩn Studio",
    icon: "Code2"
  },
  {
    id: "copy-mmo",
    name: "✍️ Kịch Bản & Content MMO",
    icon: "TrendingUp"
  },
  {
    id: "skills-automation",
    name: "⚡ AI Skills & Auto",
    icon: "Activity"
  }
];

export const COURSES_DATA = [
  // =========================================================================
  // 0. BÙI THÁI STUDIO - DỊCH VỤ LẬP TRÌNH WEB THEO YÊU CẦU & CỐ VẤN Ý TƯỞNG
  // =========================================================================
  {
    id: 'bui-thai-custom-web-service',
    title: 'Dịch Vụ Lập Trình Web Theo Yêu Cầu & Cố Vấn Ý Tưởng (Bùi Thái Studio)',
    subtitle: 'Đồng hành cùng sinh viên NCKH AEP NEU, Founders Startup và Chủ Shop. Xây dựng Web Fullstack React 19, Supabase RLS, VietQR và UI Thượng Lưu 60fps',
    category: 'web-craft',
    categoryLabel: 'Dịch Vụ Web Bùi Thái',
    badge: 'Bùi Thái Signature 🌟',
    priceXu: 50,
    originalPriceXu: 120,
    rating: 5.0,
    reviewsCount: 320,
    studentsCount: 890,
    salesCount: 890,
    updatedAt: 'Tháng 11/2026',
    format: ['Tư Vấn Kiến Trúc 1-1', 'Bàn Giao Mã Nguồn 100%', 'Bảo Mật Ngân Hàng'],
    description: 'Chuyên gia biến mọi ý tưởng từ nghiên cứu khoa học, khởi nghiệp đến kinh doanh online thành sản phẩm phần mềm thực chiến chạy thật 100%. Không chỉ viết mã máy móc mà đồng hành phản biện, tối ưu hóa ý tưởng và xây dựng giải pháp công nghệ tinh gọn, bền vững đạt chuẩn Haute Couture.',
    tags: ['Web NCKH', 'Startup SaaS', 'React 19', 'Supabase RLS', 'UI 60fps'],
    cardsCount: 25,
    previewContent: [
      'Giai đoạn 1: Thẩm vấn sâu nhu cầu, bóc tách bài toán và lên kiến trúc module tinh gọn.',
      'Giai đoạn 2: Thiết kế giao diện Haute Couture chuẩn phong cách Apple Minimalist & Editorial, chống 100% lỗi nhảy font tiếng Việt.',
      'Giai đoạn 3: Tích hợp Backend Supabase PostgreSQL, phân quyền RLS chống rò rỉ dữ liệu và cổng nạp VietQR tự động.',
      'Giai đoạn 4: Kiểm định chất lượng 4 tầng (Zero-Glitch Quality Gate) và bàn giao toàn bộ mã nguồn sạch.'
    ]
  },
  {
    id: 'bui-thai-case-study-edutech',
    title: 'Case Study Thực Chiến: Sàn Giao Dịch & Ví Xu PromptMMO (Bùi Thái Studio)',
    subtitle: 'Bản đặc tả kiến trúc vi dịch vụ bảo mật cấp ngân hàng, chống Race Condition rút tiền đúp, âm thanh Web Audio 0MB và tối ưu hóa chuyển đổi C2C',
    category: 'web-craft',
    categoryLabel: 'Dịch Vụ Web Bùi Thái',
    badge: 'Case Study #01 💎',
    priceXu: 30,
    originalPriceXu: 75,
    rating: 4.99,
    reviewsCount: 215,
    studentsCount: 650,
    salesCount: 650,
    updatedAt: 'Tháng 11/2026',
    format: ['Bản Vẽ Kiến Trúc Toàn Diện', 'Mã Nguồn Hàm RPC Supabase', 'Kịch Bản Chống Hack F12'],
    description: 'Chia sẻ toàn bộ kiến trúc thực chiến đứng sau nền tảng PromptMMO: Cơ chế khóa dòng FOR UPDATE bảo vệ tài chính, hàm băm niêm phong ví computeWalletSeal, hệ thống âm thanh Web Audio không tốn băng thông và tối ưu hiệu suất tải trang dưới 300ms.',
    tags: ['Kiến Trúc EduTech', 'Ví Tiền Tệ', 'PostgreSQL RPC', 'AppSec Master'],
    cardsCount: 18,
    previewContent: [
      'Cơ chế tách bạch Xu thưởng và Xu doanh thu nhằm triệt tiêu lạm phát trong nền kinh tế số.',
      'Hàm PostgreSQL SECURITY DEFINER có khóa dòng FOR UPDATE ngăn chặn hoàn toàn tấn công rút tiền đúp.',
      'Bộ synthesizer Web Audio API 0MB tái tạo tiếng click taptic và tiếng rơi Xu kim loại cực nhạy.'
    ]
  },
  // =========================================================================
  // 1. HIGGSFIELD & KLING 1.5 - VIDEO AI TRIỆU VIEW TIKTOK / REELS
  // =========================================================================
  {
    id: 'higgsfield-kling-viral-video',
    title: 'Bộ 120+ Prompt Video AI Triệu View (Higgsfield & Kling 1.5)',
    subtitle: 'Công thức Prompt chuẩn điện ảnh 8K, tham số Camera Orbit, Hyperlapse & CGI Motion',
    category: 'video-ai',
    categoryLabel: 'Video AI Triệu View',
    badge: 'Bestseller MMO 🔥',
    priceXu: 25,
    originalPriceXu: 65,
    rating: 4.98,
    reviewsCount: 1420,
    studentsCount: 3850,
    salesCount: 3850,
    updatedAt: 'Tháng 10/2026',
    format: ['Prompt Tiếng Anh Chuẩn', 'Tham Số Camera Chi Tiết', '1-Click Copy Siêu Tốc'],
    description: 'Tuyển tập 120+ prompt video điện ảnh được test kỹ trên Higgsfield, Kling AI 1.5, Luma Dream Machine và Runway Gen-3. Tối ưu góc quay drone, chuyển động cinematic, ánh sáng anamorphic flare giúp video dễ lên xu hướng TikTok, Reels và YouTube Shorts.',
    highlights: [
      '120+ Prompt chuẩn cú pháp tiếng Anh tối ưu hóa chuyển động cho Higgsfield & Kling',
      'Đầy đủ thông số Camera: Pan Left, Dolly Zoom, Drone Hyperlapse, Orbit 360',
      'Kèm Negative Prompt loại bỏ rung nhòe, méo khuôn mặt và dị tật ngón tay',
      'Phù hợp làm kênh Review phim, Kể chuyện lịch sử, Vũ trụ bí ẩn, Sci-Fi và Du lịch'
    ],
    previewCards: [
      {
        id: 1,
        front: "🎬 Cinematic Cyberpunk Drone Hyperlapse (Cảnh mở đầu hút mắt 3 giây)",
        back: "PROMPT:\nCinematic ultra-wide drone shot flying rapidly through a futuristic Tokyo cyberpunk cityscape at heavy midnight rain, towering neon holograms reflecting on wet asphalt, flying cars passing by, volumetric fog, anamorphic lens flare, photorealistic 8k octane render, cinematic color grading, blade runner aesthetic --ar 16:9 --motion 7 --camera zoom-in fast\n\n📌 THAM SỐ GỢI Ý:\n- Công cụ: Kling 1.5 hoặc Higgsfield Text-to-Video\n- Mode: High Quality / Creativity 0.6\n- Camera setting: Fast Forward Zoom + Pan Down\n- Mẹo: Dùng làm hook 3 giây đầu video giữ chân người xem 95%.",
        tag: "Cinematic Video"
      },
      {
        id: 2,
        front: "🐉 Quái Thú Thần Thoại Trỗi Dậy Biển Đêm (Kể chuyện thần thoại / Lịch sử)",
        back: "PROMPT:\nColossal mythical leviathan serpent emerging slowly from stormy turbulent ocean waves at night, bioluminescent glowing turquoise scales beneath dark water, lightning strikes illuminating dark thunderclouds, cinematic slow motion 60fps, IMAX 70mm film stock, epic dark fantasy, hyper-realistic water physics --ar 16:9 --motion 5\n\n📌 THAM SỐ GỢI Ý:\n- Công cụ: Higgsfield Video AI / Luma Dream Machine\n- Camera setting: Static Low-angle looking up\n- Nhạc nền đề xuất: Dark orchestral war horn.",
        tag: "Mythology & Fantasy"
      },
      {
        id: 3,
        front: "☕ Cận Cảnh Đồ Uống & Thức Ăn Thương Mại (Quảng cáo F&B / Affiliate)",
        back: "PROMPT:\nExtreme macro close-up slow motion shot of rich golden espresso dripping into clear glass cup, velvety crema swirling, steam rising gently in warm morning sunlight, shallow depth of field, commercial advertisement aesthetic, crystal clear reflections, 8k resolution --ar 9:16 --motion 4\n\n📌 THAM SỐ GỢI Ý:\n- Tỷ lệ: 9:16 (Dọc chuẩn TikTok & Reels)\n- Công cụ: Kling AI v1.5\n- Ứng dụng: Chèn giỏ hàng TikTok Shop bán cà phê, đồ gia dụng.",
        tag: "Commercial Ads"
      },
      {
        id: 4,
        front: "🚀 Phi Thuyền Không Gian Xuyên Lỗ Sâu Wormhole (Kênh khám phá vũ trụ)",
        back: "PROMPT:\nFuturistic exploration spacecraft entering an iridescent dimensional wormhole, bending space-time fabric, gravitational lensing effect, kaleidoscope cosmic light streaks, deep space nebula background, Interstellar movie cinematic style, hyper-detailed spaceship hull panels --ar 16:9 --motion 8\n\n📌 THAM SỐ GỢI Ý:\n- Công cụ: Runway Gen-3 Alpha hoặc Higgsfield\n- Tốc độ camera: Acceleration warp\n- Tỷ lệ giữ chân người xem rất cao cho chủ đề Khoa học bí ẩn.",
        tag: "Sci-Fi Space"
      },
      {
        id: 5,
        front: "⏳ Tua Nhanh Thời Gian Bốn Mùa (Cảnh chuyển đổi cảm xúc cao)",
        back: "PROMPT:\nTime-lapse view of a majestic lone oak tree on a hilltop transitioning seamlessly through autumn golden leaves falling to snowy blizzard winter, then blooming spring cherry blossoms and vibrant summer sunshine, smooth continuous motion, 8k documentary style BBC Planet Earth --ar 16:9 --motion 6\n\n📌 THAM SỐ GỢI Ý:\n- Dùng tính năng Image-to-Video với 2 keyframe đầu/cuối\n- Rất hiệu quả cho các video triết lý sống, podcast chữa lành.",
        tag: "Documentary Time-lapse"
      }
    ],
    cards: [
      {
        id: 1,
        front: "🎬 Cinematic Cyberpunk Drone Hyperlapse (Cảnh mở đầu hút mắt 3 giây)",
        back: "PROMPT:\nCinematic ultra-wide drone shot flying rapidly through a futuristic Tokyo cyberpunk cityscape at heavy midnight rain, towering neon holograms reflecting on wet asphalt, flying cars passing by, volumetric fog, anamorphic lens flare, photorealistic 8k octane render, cinematic color grading, blade runner aesthetic --ar 16:9 --motion 7 --camera zoom-in fast\n\n📌 THAM SỐ GỢI Ý:\n- Công cụ: Kling 1.5 hoặc Higgsfield Text-to-Video\n- Mode: High Quality / Creativity 0.6\n- Camera setting: Fast Forward Zoom + Pan Down\n- Mẹo: Dùng làm hook 3 giây đầu video giữ chân người xem 95%.",
        tag: "Cinematic Video"
      },
      {
        id: 2,
        front: "🐉 Quái Thú Thần Thoại Trỗi Dậy Biển Đêm (Kể chuyện thần thoại / Lịch sử)",
        back: "PROMPT:\nColossal mythical leviathan serpent emerging slowly from stormy turbulent ocean waves at night, bioluminescent glowing turquoise scales beneath dark water, lightning strikes illuminating dark thunderclouds, cinematic slow motion 60fps, IMAX 70mm film stock, epic dark fantasy, hyper-realistic water physics --ar 16:9 --motion 5\n\n📌 THAM SỐ GỢI Ý:\n- Công cụ: Higgsfield Video AI / Luma Dream Machine\n- Camera setting: Static Low-angle looking up\n- Nhạc nền đề xuất: Dark orchestral war horn.",
        tag: "Mythology & Fantasy"
      },
      {
        id: 3,
        front: "☕ Cận Cảnh Đồ Uống & Thức Ăn Thương Mại (Quảng cáo F&B / Affiliate)",
        back: "PROMPT:\nExtreme macro close-up slow motion shot of rich golden espresso dripping into clear glass cup, velvety crema swirling, steam rising gently in warm morning sunlight, shallow depth of field, commercial advertisement aesthetic, crystal clear reflections, 8k resolution --ar 9:16 --motion 4\n\n📌 THAM SỐ GỢI Ý:\n- Tỷ lệ: 9:16 (Dọc chuẩn TikTok & Reels)\n- Công cụ: Kling AI v1.5\n- Ứng dụng: Chèn giỏ hàng TikTok Shop bán cà phê, đồ gia dụng.",
        tag: "Commercial Ads"
      },
      {
        id: 4,
        front: "🚀 Phi Thuyền Không Gian Xuyên Lỗ Sâu Wormhole (Kênh khám phá vũ trụ)",
        back: "PROMPT:\nFuturistic exploration spacecraft entering an iridescent dimensional wormhole, bending space-time fabric, gravitational lensing effect, kaleidoscope cosmic light streaks, deep space nebula background, Interstellar movie cinematic style, hyper-detailed spaceship hull panels --ar 16:9 --motion 8\n\n📌 THAM SỐ GỢI Ý:\n- Công cụ: Runway Gen-3 Alpha hoặc Higgsfield\n- Tốc độ camera: Acceleration warp\n- Tỷ lệ giữ chân người xem rất cao cho chủ đề Khoa học bí ẩn.",
        tag: "Sci-Fi Space"
      },
      {
        id: 5,
        front: "⏳ Tua Nhanh Thời Gian Bốn Mùa (Cảnh chuyển đổi cảm xúc cao)",
        back: "PROMPT:\nTime-lapse view of a majestic lone oak tree on a hilltop transitioning seamlessly through autumn golden leaves falling to snowy blizzard winter, then blooming spring cherry blossoms and vibrant summer sunshine, smooth continuous motion, 8k documentary style BBC Planet Earth --ar 16:9 --motion 6\n\n📌 THAM SỐ GỢI Ý:\n- Dùng tính năng Image-to-Video với 2 keyframe đầu/cuối\n- Rất hiệu quả cho các video triết lý sống, podcast chữa lành.",
        tag: "Documentary Time-lapse"
      },
      {
        id: 6,
        front: "⚔️ Võ Sĩ Đấu Kiếm Dưới Mưa Samurai (Phim hành động kịch tính)",
        back: "PROMPT:\nTwo masked samurai duel in torrential downpour under flickering lantern light, swords clashing with bright sparks, water droplets splashing off leather armor, cinematic dynamic tracking camera revolving around fighters, 120fps slow-motion impact, dramatic Japanese cinema style --ar 16:9 --motion 7\n\n📌 THAM SỐ GỢI Ý:\n- Camera: Revolving dynamic 360",
        tag: "Action Cinema"
      }
    ]
  },

  // =========================================================================
  // 2. FLUX.1 & MIDJOURNEY V6.1 - ẢNH THƯƠNG MẠI & MẪU SẢN PHẨM CHUẨN STUDIO
  // =========================================================================
  {
    id: 'flux-midjourney-commercial-photo',
    title: 'Bộ 150+ Prompt Ảnh Thương Mại & Mẫu Sản Phẩm (Flux.1 & Midjourney v6.1)',
    subtitle: 'Tạo ảnh người mẫu thời trang, mockup sản phẩm Shopee/Amazon và banner quảng cáo 8K',
    category: 'image-ai',
    categoryLabel: 'Ảnh AI Chuẩn Studio',
    badge: 'Chốt Đơn Cao 💰',
    priceXu: 20,
    originalPriceXu: 55,
    rating: 4.97,
    reviewsCount: 980,
    studentsCount: 2910,
    salesCount: 2910,
    updatedAt: 'Tháng 10/2026',
    format: ['Prompt Midjourney v6.1', 'Prompt Flux Schnell/Dev', 'LoRA Weights Gợi Ý'],
    description: 'Trọn bộ 150+ prompt chuyên nghiệp thay thế chi phí thuê người mẫu, studio chụp sản phẩm hàng chục triệu đồng. Phù hợp cho chủ shop Shopee, TikTok Shop, Etsy, Amazon và Designer làm banner quảng cáo.',
    highlights: [
      'Bộ prompt tạo người mẫu thời trang chuẩn Á Đông (Việt Nam, Hàn Quốc, Nhật Bản)',
      'Mockup mỹ phẩm, nước hoa, túi xách trên bối cảnh đá hoa cương nước trong vắt',
      'Đầy đủ thông số ánh sáng: Softbox lighting, Rim light, Rim reflections, Hasselblad 100mm',
      'Có sẵn tham số chống méo ngón tay và chuẩn màu sắc CMYK / sRGB'
    ],
    previewCards: [
      {
        id: 1,
        front: "💄 Mockup Serum Mỹ Phẩm Sang Trọng (Shopee / TikTok Shop Mall)",
        back: "PROMPT:\nCommercial product photography of a frosted amber glass cosmetic serum bottle resting on wet natural marble stone slab, pure water splashes and micro droplets around base, soft studio rim lighting, fresh mint leaf accent, clean minimalist luxury skincare aesthetic, 8k resolution, captured with Hasselblad H6D-100c, 100mm macro lens --ar 3:4 --v 6.1 --s 250 --style raw\n\n📌 THAM SỐ GỢI Ý:\n- Công cụ: Midjourney v6.1 hoặc Flux.1 Dev\n- Tỷ lệ: 3:4 hoặc 1:1 chuẩn ảnh bìa sản phẩm\n- Không cần thuê thợ chụp, ghép logo nhãn hàng vào là bán ngay.",
        tag: "Cosmetic Mockup"
      },
      {
        id: 2,
        front: "👗 Người Mẫu Nữ Á Đông Mặc Đầm Dạ Hội Sang Chảnh (Thời trang cao cấp)",
        back: "PROMPT:\nEditorial fashion shoot of a 24-year-old elegant Vietnamese model wearing a flowing emerald satin evening gown, standing in a contemporary sunlit art gallery with floor-to-ceiling glass windows, soft natural diffused daylight, genuine skin texture, pores, neutral expression, shot on Canon EOS R5 with 85mm f/1.4 lens, Vogue magazine cover style --ar 4:5 --v 6.1 --style raw\n\n📌 THAM SỐ GỢI Ý:\n- Áp dụng: Chụp mẫu thời trang cho shop quần áo online, giảm 90% chi phí chụp mẫu thực.",
        tag: "Fashion Editorial"
      },
      {
        id: 3,
        front: "👟 Giày Sneaker Thể Thao Bay Lơ Lửng Đồ Họa 3D (Quảng cáo giới trẻ)",
        back: "PROMPT:\nDynamic commercial photo of a futuristic neon cyber-running sneaker suspended mid-air at 45 degree angle, colorful powder explosion around sole, sharp rim lighting with cyan and magenta neon accents, dark sleek concrete background, highly detailed mesh fabric texture, Nike commercial poster style, 8k, ultra-sharp focus --ar 1:1 --v 6.1\n\n📌 THAM SỐ GỢI Ý:\n- Tỷ lệ: 1:1 chuẩn Feed Instagram & Facebook Ads.",
        tag: "Sneaker Ads"
      }
    ],
    cards: [
      {
        id: 1,
        front: "💄 Mockup Serum Mỹ Phẩm Sang Trọng (Shopee / TikTok Shop Mall)",
        back: "PROMPT:\nCommercial product photography of a frosted amber glass cosmetic serum bottle resting on wet natural marble stone slab, pure water splashes and micro droplets around base, soft studio rim lighting, fresh mint leaf accent, clean minimalist luxury skincare aesthetic, 8k resolution, captured with Hasselblad H6D-100c, 100mm macro lens --ar 3:4 --v 6.1 --s 250 --style raw\n\n📌 THAM SỐ GỢI Ý:\n- Công cụ: Midjourney v6.1 hoặc Flux.1 Dev\n- Tỷ lệ: 3:4 hoặc 1:1 chuẩn ảnh bìa sản phẩm\n- Không cần thuê thợ chụp, ghép logo nhãn hàng vào là bán ngay.",
        tag: "Cosmetic Mockup"
      },
      {
        id: 2,
        front: "👗 Người Mẫu Nữ Á Đông Mặc Đầm Dạ Hội Sang Chảnh (Thời trang cao cấp)",
        back: "PROMPT:\nEditorial fashion shoot of a 24-year-old elegant Vietnamese model wearing a flowing emerald satin evening gown, standing in a contemporary sunlit art gallery with floor-to-ceiling glass windows, soft natural diffused daylight, genuine skin texture, pores, neutral expression, shot on Canon EOS R5 with 85mm f/1.4 lens, Vogue magazine cover style --ar 4:5 --v 6.1 --style raw\n\n📌 THAM SỐ GỢI Ý:\n- Áp dụng: Chụp mẫu thời trang cho shop quần áo online, giảm 90% chi phí chụp mẫu thực.",
        tag: "Fashion Editorial"
      },
      {
        id: 3,
        front: "👟 Giày Sneaker Thể Thao Bay Lơ Lửng Đồ Họa 3D (Quảng cáo giới trẻ)",
        back: "PROMPT:\nDynamic commercial photo of a futuristic neon cyber-running sneaker suspended mid-air at 45 degree angle, colorful powder explosion around sole, sharp rim lighting with cyan and magenta neon accents, dark sleek concrete background, highly detailed mesh fabric texture, Nike commercial poster style, 8k, ultra-sharp focus --ar 1:1 --v 6.1\n\n📌 THAM SỐ GỢI Ý:\n- Tỷ lệ: 1:1 chuẩn Feed Instagram & Facebook Ads.",
        tag: "Sneaker Ads"
      },
      {
        id: 4,
        front: "⌚ Đồng Hồ Cơ Nam Sang Trọng Tinh Xảo (Đồng hồ cao cấp / Quà tặng)",
        back: "PROMPT:\nMacro shot of luxury stainless steel mechanical automatic watch lying on dark textured leather surface, skeleton dial showing exposed moving gears and tourbillon, warm side spotlight highlighting metallic reflections and sapphire crystal glass, Rolex promotional photography aesthetic, photorealistic 8k --ar 16:9 --v 6.1\n\n📌 THAM SỐ GỢI Ý:\n- Dành cho các shop phụ kiện, đồng hồ, quà tặng nam.",
        tag: "Luxury Watch"
      }
    ]
  },

  // =========================================================================
  // 3. TIKTOK & LIVESTREAM SCRIPT COPYWRITING - KỊCH BẢN CHỐT ĐƠN MMO
  // =========================================================================
  {
    id: 'tiktok-livestream-script-copy',
    title: 'Bộ 80+ Prompt Kịch Bản Video Ngắn & Livestream Chốt Đơn Thực Chiến',
    subtitle: 'Công thức Hook 3 giây, Storytelling xoắn não và CTA kích thích chốt đơn tức thì',
    category: 'copy-mmo',
    categoryLabel: 'Kịch Bản & Content MMO',
    badge: 'X3 Chuyển Đổi 📈',
    priceXu: 15,
    originalPriceXu: 40,
    rating: 4.95,
    reviewsCount: 760,
    studentsCount: 2150,
    salesCount: 2150,
    updatedAt: 'Tháng 10/2026',
    format: ['Prompt ChatGPT-4o / Claude 3.5', 'Kịch Bản Bảng Phân Cảnh 2 Cột', 'Bộ 100 Câu Hook Hút View'],
    description: 'Kho prompt biên soạn kịch bản video ngắn TikTok, Reels, YouTube Shorts và kịch bản MC Livestream chốt đơn. Tích hợp cấu trúc tâm lý học mua hàng: Hook gây tò mò -> Nỗi đau khách hàng -> Giải pháp đột phá -> Ưu đãi khẩn cấp -> Kêu gọi hành động.',
    highlights: [
      'Prompt tạo 10 câu Hook 3 giây mở đầu giật gân, ngăn chặn người dùng lướt qua',
      'Prompt kịch bản 60 giây phân cảnh 2 cột (Hình ảnh Visual + Âm thanh Voiceover)',
      'Bộ kịch bản Livestream 2 tiếng liên tục: Dẫn dắt minigame, tung deal 1k, chốt sale',
      'Prompt xử lý từ chối mua hàng (Giá đắt, để suy nghĩ lại, chưa tin tưởng)'
    ],
    previewCards: [
      {
        id: 1,
        front: "🎣 Prompt Tạo 10 Câu Hook 3 Giây Mở Đầu Giữ Chân Người Xem (TikTok / Reels)",
        back: "PROMPT ĐƯA VÀO CHATGPT / CLAUDE:\n\"Bạn là Giám đốc Sáng tạo Nội dung TikTok với hơn 5 triệu người theo dõi. Tôi đang bán sản phẩm [TÊN SẢN PHẨM] nhắm vào đối tượng [KHÁCH HÀNG MỤC TIÊU].\nHãy viết cho tôi 10 câu Hook mở đầu trong 3 giây đầu tiên theo 5 phong cách sau:\n1. Tấn công trực diện vào nỗi đau ngầm mà ít ai dám nói.\n2. Lật ngược một quan niệm sai lầm phổ biến ('Đừng bao giờ... nếu không muốn...').\n3. Bật mí bí mật trong ngành ('Người trong nghề không muốn bạn biết điều này').\n4. So sánh gây sốc về tiền bạc hoặc thời gian lãng phí.\n5. Tò mò thị giác ('Tôi đã thử... trong 7 ngày và điều này xảy ra').\nYêu cầu: Viết ngắn gọn dưới 15 chữ mỗi câu, từ ngữ bình dân, cảm xúc mạnh, có emoji.\"",
        tag: "Hook Master"
      },
      {
        id: 2,
        front: "🎬 Prompt Kịch Bản Video Ngắn 60 Giây Phân Cảnh 2 Cột (Có Visual & Voiceover)",
        back: "PROMPT ĐƯA VÀO CHATGPT / CLAUDE:\n\"Hãy đóng vai một Kịch bản gia video TikTok chuyên nghiệp đạt doanh số tiền tỷ. Viết cho tôi kịch bản chi tiết 60 giây bán [TÊN SẢN PHẨM] với mức giá [GIÁ TIỀN].\nTrình bày dưới dạng BẢNG 2 CỘT rõ ràng:\n- Cột 1: VISUAL (Mô tả hành động của diễn viên, góc quay camera, đạo cụ, text chữ hiện trên màn hình).\n- Cột 2: AUDIO / VOICEOVER (Lời thoại đọc tự nhiên từng giây, âm thanh hiệu ứng SFX như tiếng ting ting, tiếng chuông).\nCấu trúc kịch bản bắt buộc:\n- 0-3s: Hook giật gân.\n- 3-15s: Đào sâu vấn đề khó chịu khách hàng gặp phải.\n- 15-35s: Trải nghiệm thực tế khi dùng sản phẩm giải quyết triệt để.\n- 35-50s: So sánh sự vượt trội so với các sản phẩm khác trên thị trường.\n- 50-60s: Kêu gọi bấm vào giỏ hàng góc trái ngay vì số lượng ưu đãi chỉ có 20 suất.\"",
        tag: "60s Script"
      },
      {
        id: 3,
        front: "🎤 Prompt Kịch Bản MC Livestream Tung Deal 1K & Đẩy Đỉnh Doanh Số",
        back: "PROMPT ĐƯA VÀO CHATGPT / CLAUDE:\n\"Tôi chuẩn bị Livestream TikTok Shop lúc 20:00 tối nay. Hãy lên cho tôi kịch bản nói của Host / MC trong 15 phút đẩy deal 'Khung Giờ Vàng':\n1. Câu nói khuấy động không khí, kêu gọi thả 50.000 tim để mở quà 1K.\n2. Kỹ thuật đếm ngược 5-4-3-2-1 tạo áp lực tâm lý FOMO (Sợ bỏ lỡ cơ hội).\n3. Câu thoại trấn an khách hàng về chất lượng và chính sách hoàn tiền 100% nếu không ưng ý.\n4. Kịch bản thông báo 'Chỉ còn 3 suất cuối cùng trên giỏ hàng, ai chưa ấn thanh toán hệ thống tự nhả cho người khác'.\nYêu cầu: Nhịp điệu dồn dập, nhiệt huyết, từ ngữ thân thiện dễ mến.\"",
        tag: "Livestream Script"
      }
    ],
    cards: [
      {
        id: 1,
        front: "🎣 Prompt Tạo 10 Câu Hook 3 Giây Mở Đầu Giữ Chân Người Xem (TikTok / Reels)",
        back: "PROMPT ĐƯA VÀO CHATGPT / CLAUDE:\n\"Bạn là Giám đốc Sáng tạo Nội dung TikTok với hơn 5 triệu người theo dõi. Tôi đang bán sản phẩm [TÊN SẢN PHẨM] nhắm vào đối tượng [KHÁCH HÀNG MỤC TIÊU].\nHãy viết cho tôi 10 câu Hook mở đầu trong 3 giây đầu tiên theo 5 phong cách sau:\n1. Tấn công trực diện vào nỗi đau ngầm mà ít ai dám nói.\n2. Lật ngược một quan niệm sai lầm phổ biến ('Đừng bao giờ... nếu không muốn...').\n3. Bật mí bí mật trong ngành ('Người trong nghề không muốn bạn biết điều này').\n4. So sánh gây sốc về tiền bạc hoặc thời gian lãng phí.\n5. Tò mò thị giác ('Tôi đã thử... trong 7 ngày và điều này xảy ra').\nYêu cầu: Viết ngắn gọn dưới 15 chữ mỗi câu, từ ngữ bình dân, cảm xúc mạnh, có emoji.\"",
        tag: "Hook Master"
      },
      {
        id: 2,
        front: "🎬 Prompt Kịch Bản Video Ngắn 60 Giây Phân Cảnh 2 Cột (Có Visual & Voiceover)",
        back: "PROMPT ĐƯA VÀO CHATGPT / CLAUDE:\n\"Hãy đóng vai một Kịch bản gia video TikTok chuyên nghiệp đạt doanh số tiền tỷ. Viết cho tôi kịch bản chi tiết 60 giây bán [TÊN SẢN PHẨM] với mức giá [GIÁ TIỀN].\nTrình bày dưới dạng BẢNG 2 CỘT rõ ràng:\n- Cột 1: VISUAL (Mô tả hành động của diễn viên, góc quay camera, đạo cụ, text chữ hiện trên màn hình).\n- Cột 2: AUDIO / VOICEOVER (Lời thoại đọc tự nhiên từng giây, âm thanh hiệu ứng SFX như tiếng ting ting, tiếng chuông).\nCấu trúc kịch bản bắt buộc:\n- 0-3s: Hook giật gân.\n- 3-15s: Đào sâu vấn đề khó chịu khách hàng gặp phải.\n- 15-35s: Trải nghiệm thực tế khi dùng sản phẩm giải quyết triệt để.\n- 35-50s: So sánh sự vượt trội so với các sản phẩm khác trên thị trường.\n- 50-60s: Kêu gọi bấm vào giỏ hàng góc trái ngay vì số lượng ưu đãi chỉ có 20 suất.\"",
        tag: "60s Script"
      },
      {
        id: 3,
        front: "🎤 Prompt Kịch Bản MC Livestream Tung Deal 1K & Đẩy Đỉnh Doanh Số",
        back: "PROMPT ĐƯA VÀO CHATGPT / CLAUDE:\n\"Tôi chuẩn bị Livestream TikTok Shop lúc 20:00 tối nay. Hãy lên cho tôi kịch bản nói của Host / MC trong 15 phút đẩy deal 'Khung Giờ Vàng':\n1. Câu nói khuấy động không khí, kêu gọi thả 50.000 tim để mở quà 1K.\n2. Kỹ thuật đếm ngược 5-4-3-2-1 tạo áp lực tâm lý FOMO (Sợ bỏ lỡ cơ hội).\n3. Câu thoại trấn an khách hàng về chất lượng và chính sách hoàn tiền 100% nếu không ưng ý.\n4. Kịch bản thông báo 'Chỉ còn 3 suất cuối cùng trên giỏ hàng, ai chưa ấn thanh toán hệ thống tự nhả cho người khác'.\nYêu cầu: Nhịp điệu dồn dập, nhiệt huyết, từ ngữ thân thiện dễ mến.\"",
        tag: "Livestream Script"
      }
    ]
  },

  // =========================================================================
  // 4. N8N & MAKE WORKFLOW - AI AGENT TỰ ĐỘNG HÓA MMO 24/7
  // =========================================================================
  {
    id: 'n8n-make-automation-agents',
    title: 'Bộ 50+ Workflow N8N & AI Agent Tự Động Hóa MMO 24/7',
    subtitle: 'Tự động quét sản phẩm Shopee hot trend, viết bài Facebook, trả lời tin nhắn Fanpage và xuất báo cáo',
    category: 'skills-automation',
    categoryLabel: 'AI Skills & Auto',
    badge: 'Tiết Kiệm 90% Công Sức ⚡',
    priceXu: 35,
    originalPriceXu: 90,
    rating: 4.99,
    reviewsCount: 540,
    studentsCount: 1680,
    salesCount: 1680,
    updatedAt: 'Tháng 10/2026',
    format: ['File JSON Workflow N8N', 'Tài Liệu Setup API Key', 'Prompt Hệ Thống Cho Agent'],
    description: 'Bộ giải pháp tự động hóa toàn diện dành cho dân MMO Solo. Nhúng trực tiếp các file JSON vào N8N (Self-hosted hoặc Cloud) để xây dựng hệ thống cỗ máy kiếm tiền tự động chạy ngày đêm không cần thuê nhân sự.',
    highlights: [
      'Workflow 1-Click: Cào sản phẩm bán chạy Shopee -> Tạo kịch bản TikTok -> Đẩy vào Google Sheet',
      'AI Agent tự động trả lời Inbox Fanpage, chốt đơn và gửi link thanh toán VietQR',
      'Hệ thống tự động đăng bài đa kênh: Facebook Group, Telegram, X (Twitter), Discord',
      'Tích hợp kết nối Webhook, OpenAI GPT-4o Mini, Gemini API và Claude 3.5'
    ],
    previewCards: [
      {
        id: 1,
        front: "🤖 AI Customer Support Agent (Chốt đơn tự động qua Fanpage / Telegram)",
        back: "SYSTEM PROMPT CHO N8N AI AGENT:\n\"Bạn là Chuyên viên Tư vấn Bán hàng cao cấp tại cửa hàng [TÊN CỬA HÀNG].\nNhiệm vụ của bạn:\n1. Tiếp nhận câu hỏi của khách hàng về sản phẩm, giá cả và khuyến mãi từ cơ sở dữ liệu Supabase/Vector Store.\n2. Trả lời cực kỳ nhanh gọn, lịch sự, xưng hô 'Em' và 'Anh/Chị'.\n3. Khi khách có ý định mua: Hãy thu thập 3 thông tin bắt buộc: (Họ tên, Số điện thoại nhận hàng, Địa chỉ giao hàng cụ thể).\n4. Khi đủ thông tin: Gọi tool 'create_order_vietqr' để sinh mã QR thanh toán kèm số tiền chính xác, gửi ảnh QR cho khách kèm hướng dẫn quét.\n5. Tuyệt đối không bịa đặt thông tin nếu dữ liệu không có sẵn. Trả lời trung thực và chuyển line cho Admin nếu khách yêu cầu.\"",
        tag: "AI Sales Agent"
      },
      {
        id: 2,
        front: "📊 N8N Workflow Tự Động Quét Top Bán Chạy & Tạo Nội Dung Affiliate",
        back: "CẤU TRÚC WORKFLOW N8N (Import JSON 1-Click):\n1. Cron Node: Chạy mỗi ngày vào lúc 06:00 sáng.\n2. HTTP Request: Quét danh sách sản phẩm Trending trên sàn Thương mại điện tử.\n3. Code Node (JS): Lọc các mặt hàng có hoa hồng > 15% và đánh giá > 4.8 sao.\n4. AI Agent Node (Gemini 2.5): Sinh 3 bài viết Facebook ngắn kèm link gắn mã Affiliate rút gọn.\n5. Google Sheets Node: Ghi nhận nhật ký để theo dõi doanh thu hoa hồng.\n6. Telegram Bot Node: Bắn thông báo về điện thoại 'Đã đăng 3 bài viết mới hôm nay!'.",
        tag: "Affiliate Auto"
      }
    ],
    cards: [
      {
        id: 1,
        front: "🤖 AI Customer Support Agent (Chốt đơn tự động qua Fanpage / Telegram)",
        back: "SYSTEM PROMPT CHO N8N AI AGENT:\n\"Bạn là Chuyên viên Tư vấn Bán hàng cao cấp tại cửa hàng [TÊN CỬA HÀNG].\nNhiệm vụ của bạn:\n1. Tiếp nhận câu hỏi của khách hàng về sản phẩm, giá cả và khuyến mãi từ cơ sở dữ liệu Supabase/Vector Store.\n2. Trả lời cực kỳ nhanh gọn, lịch sự, xưng hô 'Em' và 'Anh/Chị'.\n3. Khi khách có ý định mua: Hãy thu thập 3 thông tin bắt buộc: (Họ tên, Số điện thoại nhận hàng, Địa chỉ giao hàng cụ thể).\n4. Khi đủ thông tin: Gọi tool 'create_order_vietqr' để sinh mã QR thanh toán kèm số tiền chính xác, gửi ảnh QR cho khách kèm hướng dẫn quét.\n5. Tuyệt đối không bịa đặt thông tin nếu dữ liệu không có sẵn. Trả lời trung thực và chuyển line cho Admin nếu khách yêu cầu.\"",
        tag: "AI Sales Agent"
      },
      {
        id: 2,
        front: "📊 N8N Workflow Tự Động Quét Top Bán Chạy & Tạo Nội Dung Affiliate",
        back: "CẤU TRÚC WORKFLOW N8N (Import JSON 1-Click):\n1. Cron Node: Chạy mỗi ngày vào lúc 06:00 sáng.\n2. HTTP Request: Quét danh sách sản phẩm Trending trên sàn Thương mại điện tử.\n3. Code Node (JS): Lọc các mặt hàng có hoa hồng > 15% và đánh giá > 4.8 sao.\n4. AI Agent Node (Gemini 2.5): Sinh 3 bài viết Facebook ngắn kèm link gắn mã Affiliate rút gọn.\n5. Google Sheets Node: Ghi nhận nhật ký để theo dõi doanh thu hoa hồng.\n6. Telegram Bot Node: Bắn thông báo về điện thoại 'Đã đăng 3 bài viết mới hôm nay!'.",
        tag: "Affiliate Auto"
      }
    ]
  },

  // =========================================================================
  // 5. SHOPEE & TIKTOK SHOP AFFILIATE MASTERY
  // =========================================================================
  {
    id: 'shopee-tiktok-affiliate-mastery',
    title: 'Bộ Kịch Bản & Prompt Affiliate Shopee / TikTok Shop Tự Động',
    subtitle: 'Quy trình từ chọn ngách hoa hồng cao, viết bài review chân thực đến xây dựng dàn kênh vệ tinh',
    category: 'copy-mmo',
    categoryLabel: 'Kịch Bản & Content MMO',
    badge: 'Dành Cho Người Mới 🚀',
    priceXu: 18,
    originalPriceXu: 45,
    rating: 4.93,
    reviewsCount: 620,
    studentsCount: 1890,
    salesCount: 1890,
    updatedAt: 'Tháng 10/2026',
    format: ['Prompt Review Sản Phẩm', 'Chiến Lược Dàn Kênh Vệ Tinh', 'Mẫu Bảng Tính Hoa Hồng'],
    description: 'Toàn bộ bí quyết làm Affiliate Marketing không cần lộ mặt. Hướng dẫn cách dùng AI tạo ra hàng trăm video review trải nghiệm chân thực, tối ưu gắn link tiếp thị liên kết để ăn hoa hồng thụ động bền vững.',
    highlights: [
      'Công thức chọn sản phẩm hoa hồng cao: Đồ gia dụng thông minh, Thời trang nữ, Đồ ăn vặt',
      'Prompt biến thông số khô khan của nhà sản xuất thành câu chuyện đời thường cuốn hút',
      'Kỹ thuật SEO từ khóa TikTok để video leo lên top 1 tìm kiếm sau 24h',
      'Cách xây dựng 5 tài khoản vệ tinh đăng chéo video mà không bị bóp tương tác'
    ],
    previewCards: [
      {
        id: 1,
        front: "📦 Prompt Review Đồ Gia Dụng Thông Minh Bắt Mắt (Affiliate Shopee)",
        back: "PROMPT ĐƯA VÀO AI:\n\"Viết bài review chân thật cho sản phẩm [TÊN ĐỒ GIA DỤNG] theo phong cách 'Ước gì tôi biết đến món đồ này sớm hơn'.\nCấu trúc:\n- Khởi đầu: Kể lại nỗi phiền toái mỗi tối khi phải làm việc nhà bằng tay.\n- Điểm sáng: Lần đầu tiên thử dùng món này mất đúng 2 phút, hoạt động êm ái.\n- Đánh giá thật: Chỉ ra 1 nhược điểm nhỏ không đáng kể (ví dụ: dây sạc hơi ngắn hoặc chỉ có 2 màu) để tăng 100% độ uy tín.\n- Chốt bài: Báo giá sale chỉ bằng 2 cốc trà sữa, nhắc người đọc bấm vào link trong bio trước khi hết mã giảm 50k.\"",
        tag: "Affiliate Review"
      }
    ],
    cards: [
      {
        id: 1,
        front: "📦 Prompt Review Đồ Gia Dụng Thông Minh Bắt Mắt (Affiliate Shopee)",
        back: "PROMPT ĐƯA VÀO AI:\n\"Viết bài review chân thật cho sản phẩm [TÊN ĐỒ GIA DỤNG] theo phong cách 'Ước gì tôi biết đến món đồ này sớm hơn'.\nCấu trúc:\n- Khởi đầu: Kể lại nỗi phiền toái mỗi tối khi phải làm việc nhà bằng tay.\n- Điểm sáng: Lần đầu tiên thử dùng món này mất đúng 2 phút, hoạt động êm ái.\n- Đánh giá thật: Chỉ ra 1 nhược điểm nhỏ không đáng kể (ví dụ: dây sạc hơi ngắn hoặc chỉ có 2 màu) để tăng 100% độ uy tín.\n- Chốt bài: Báo giá sale chỉ bằng 2 cốc trà sữa, nhắc người đọc bấm vào link trong bio trước khi hết mã giảm 50k.\"",
        tag: "Affiliate Review"
      }
    ]
  },

  // =========================================================================
  // 6. GAME 3D & CINEMATIC TRAILER UNREAL ENGINE STYLE
  // =========================================================================
  {
    id: 'game-cinematic-unreal-3d',
    title: 'Bộ Prompt Dựng Nhân Vật 3D & Cinematic Game Trailer (Unreal Engine 5 Style)',
    subtitle: 'Tạo concept art nhân vật game, vũ khí phát sáng, bối cảnh viễn tưởng 3D Cinema',
    category: 'video-ai',
    categoryLabel: 'Video AI Triệu View',
    badge: 'Đồ Họa Đỉnh Cao 🎮',
    priceXu: 22,
    originalPriceXu: 60,
    rating: 4.96,
    reviewsCount: 430,
    studentsCount: 1420,
    salesCount: 1420,
    updatedAt: 'Tháng 10/2026',
    format: ['Prompt Midjourney Game Concept', 'Kling/Higgsfield 3D Camera', 'LoRA Game Rigging'],
    description: 'Kho prompt dành riêng cho Game Developer, 3D Artist và Creator làm phim hoạt hình 3D. Tái hiện trọn vẹn phong cách đồ họa Unreal Engine 5, Ray Tracing, Lumen GI và điện ảnh bom tấn Hollywood.',
    highlights: [
      'Prompt thiết kế Concept Art nhân vật hiệp sĩ, chiến binh Mecha, quái thú thần thoại',
      'Góc máy quay Cinematic Trailer: Slow zoom, Dutch angle, Orbit combat shot',
      'Tối ưu kết xuất chất liệu da người, kim loại giáp sắt và ánh sáng ma thuật phát sáng',
      'Ứng dụng làm trailer giới thiệu game, bìa Steam, hoạt hình 3D trên YouTube'
    ],
    previewCards: [
      {
        id: 1,
        front: "⚔️ Mecha Cyborg Warrior Trong Thành Phố Tương Lai (Game Trailer 3D)",
        back: "PROMPT:\nUnreal Engine 5 cinematic trailer frame of an armored cybernetic warrior with glowing blue energy veins standing atop a skyscraper spire overlooking vast cyberpunk metropolis, rain pouring, reflection of neon signs in puddles, dramatic volumetric lighting, ray tracing, subsurface scattering on armor plates, 8k resolution, cinematic atmosphere, Death Stranding and Cyberpunk 2077 inspiration --ar 16:9 --v 6.1 --style raw\n\n📌 THAM SỐ GỢI Ý:\n- Công cụ: Midjourney v6.1 hoặc Stable Diffusion 3.5\n- Đưa vào Higgsfield để sinh cảnh camera xoay vòng quanh nhân vật.",
        tag: "Game Concept"
      }
    ],
    cards: [
      {
        id: 1,
        front: "⚔️ Mecha Cyborg Warrior Trong Thành Phố Tương Lai (Game Trailer 3D)",
        back: "PROMPT:\nUnreal Engine 5 cinematic trailer frame of an armored cybernetic warrior with glowing blue energy veins standing atop a skyscraper spire overlooking vast cyberpunk metropolis, rain pouring, reflection of neon signs in puddles, dramatic volumetric lighting, ray tracing, subsurface scattering on armor plates, 8k resolution, cinematic atmosphere, Death Stranding and Cyberpunk 2077 inspiration --ar 16:9 --v 6.1 --style raw\n\n📌 THAM SỐ GỢI Ý:\n- Công cụ: Midjourney v6.1 hoặc Stable Diffusion 3.5\n- Đưa vào Higgsfield để sinh cảnh camera xoay vòng quanh nhân vật.",
        tag: "Game Concept"
      }
    ]
  },

  // =========================================================================
  // 7. CANVA / CAPCUT PRO & TÀI KHOẢN TOOL MMO GIÁ SỈ
  // =========================================================================
  {
    id: 'canva-capcut-pro-account-bundle',
    title: 'Combo Tài Khoản & Thủ Thuật MMO Giá Rẻ (Slot Tool & Mẹo Sử Dụng)',
    subtitle: 'Hướng dẫn nhận slot bản quyền Canva Pro, CapCut Pro, tối ưu chi phí làm MMO',
    category: 'acc-tools',
    categoryLabel: 'Tool & Tài Khoản MMO',
    badge: 'Tiết Kiệm Gấp 3 🔑',
    priceXu: 29,
    originalPriceXu: 79,
    rating: 4.94,
    reviewsCount: 880,
    studentsCount: 2540,
    salesCount: 2540,
    updatedAt: 'Tháng 10/2026',
    format: ['Thủ Thuật Kích Hoạt Slot', 'Bảo Hành 1 Đổi 1', 'Template Thiết Kế Sẵn'],
    description: 'Tổng hợp tài liệu và kênh kích hoạt các tài khoản công cụ MMO không thể thiếu: Canva Pro, CapCut Pro (không logo, xuất 4K 60fps), ChatGPT Plus, Freepik Premium với giá rẻ hơn gấp 3 lần giá gốc.',
    highlights: [
      'Slot Canva Pro giáo dục / nhóm bản quyền vĩnh viễn không lo mất dữ liệu',
      'CapCut Pro mở khóa toàn bộ hiệu ứng AI, xóa phông nền 1-click và xuất 4K mượt mà',
      'Tặng kèm 500+ template video TikTok & banner bán hàng thiết kế sẵn chỉ việc thay ảnh',
      'Chính sách bảo hành và hỗ trợ kỹ thuật 24/7 trực tiếp qua chat'
    ],
    previewCards: [
      {
        id: 1,
        front: "🔑 Hướng Dẫn Kích Hoạt & Bảo Quản Tài Khoản Tool MMO Bền Lâu",
        back: "HƯỚNG DẪN KỸ THUẬT:\n1. Slot Canva Pro: Bấm vào link kích hoạt tham gia Class, dữ liệu thiết kế hoàn toàn riêng tư, xuất file không giới hạn.\n2. CapCut Pro: Đăng nhập theo tài khoản cấp sẵn hoặc kích hoạt ID, mở khóa toàn bộ tính năng Auto Caption tiếng Việt, xóa phông AI và xuất video 4K 60fps siêu nét.\n3. Hỗ trợ bảo hành: Mọi trục trặc kỹ thuật được đổi tài khoản mới trong vòng 15 phút qua khung Chat trực tiếp.",
        tag: "Tool Guide"
      }
    ],
    cards: [
      {
        id: 1,
        front: "🔑 Hướng Dẫn Kích Hoạt & Bảo Quản Tài Khoản Tool MMO Bền Lâu",
        back: "HƯỚNG DẪN KỸ THUẬT:\n1. Slot Canva Pro: Bấm vào link kích hoạt tham gia Class, dữ liệu thiết kế hoàn toàn riêng tư, xuất file không giới hạn.\n2. CapCut Pro: Đăng nhập theo tài khoản cấp sẵn hoặc kích hoạt ID, mở khóa toàn bộ tính năng Auto Caption tiếng Việt, xóa phông AI và xuất video 4K 60fps siêu nét.\n3. Hỗ trợ bảo hành: Mọi trục trặc kỹ thuật được đổi tài khoản mới trong vòng 15 phút qua khung Chat trực tiếp.",
        tag: "Tool Guide"
      }
    ]
  }
];

// Helper fallback compatibility
COURSES_DATA.forEach(course => {
  if (!course.cards && course.previewCards) {
    course.cards = course.previewCards;
  }
  if (!course.previewCards && course.cards) {
    course.previewCards = course.cards;
  }
});

export const COMBO_PACKAGE = {
  id: 'combo-all-access',
  title: 'COMBO VIP: Mở Khóa Trọn Đời Toàn Bộ Kho Prompt & AI Skills MMO',
  subtitle: 'Sở hữu toàn bộ 7+ kho Prompt Video AI (Higgsfield/Kling), Ảnh Studio (Flux/Midjourney), Kịch bản TikTok triệu view, N8N Auto + Cập nhật hàng tuần',
  originalPriceXu: 499,
  priceXu: 99,
  discountPercent: 80,
  badge: 'Tiết kiệm 80% 🔥',
  features: [
    'Toàn bộ 1,000+ Prompt & AI Skills thực chiến chuẩn quốc tế (Tiếng Anh + Mẹo Tiếng Việt)',
    '1-Click Sao Chép Prompt siêu tốc kèm đầy đủ tham số Camera, Aspect Ratio & Negative Prompt',
    'Bộ 50+ Workflow N8N & Make tự động hóa hệ thống bán hàng và cào sản phẩm 24/7',
    'Tải không giới hạn file template CapCut, kịch bản phân cảnh 2 cột và hình ảnh mẫu',
    'Quyền truy cập vĩnh viễn và nhận toàn bộ Prompt cập nhật hàng tuần trọn đời',
    'Hỗ trợ kỹ thuật 1-1 trực tiếp qua khung Chat giữa Creator và Chuyên gia'
  ]
};

export const TESTIMONIALS = [
  {
    name: 'Hoàng Long (Long MMO)',
    role: 'Creator Kênh TikTok 850k Followers',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    content: 'Trước đây tự mò prompt làm video trên Higgsfield và Kling rất hay bị méo hình hoặc giật khung hình. Mua bộ Prompt Video AI ở đây về dùng thử, video đầu tiên đã ăn ngay 2.3 triệu view trên Reels. 25 Xu quá rẻ so với giá trị nhận được!',
    badge: 'Video 2.3M Views 🔥'
  },
  {
    name: 'Thu Hương',
    role: 'Chủ Shop Thời Trang Nữ & Shopee Top Seller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    content: 'Bộ Prompt Flux.1 và Midjourney cho ảnh thương mại quá đỉnh! Mình không cần thuê người mẫu chụp ảnh tốn 15 triệu mỗi bộ sưu tập nữa. Chỉ cần copy prompt đưa vào tạo là có ảnh mẫu Tây mẫu Á lung linh, doanh số Shopee tăng gấp đôi.',
    badge: 'Tiết Kiệm 15 Triệu/Tháng'
  },
  {
    name: 'Đặng Tuấn Anh',
    role: 'Affiliate Marketer & Tự Động Hóa N8N',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    content: 'Workflow N8N tự động quét sản phẩm Shopee hot trend và viết bài Facebook chạy cực mượt. Hệ thống chạy êm ru ngày đêm mang về tiền hoa hồng đều đặn mà không tốn công sức.',
    badge: 'Hoa Hồng Thụ Động $1,200/Tháng'
  }
];

export const FAQS = [
  {
    q: 'Làm thế nào để mở khóa và sao chép các bộ Prompt & AI Skills?',
    a: 'Nền tảng sử dụng Tiền Xu (Xu) tiện lợi (1 Xu = 1,000 VNĐ). Bạn chỉ cần nạp Xu qua cổng VietQR tự động, sau đó 1 chạm mở khóa vĩnh viễn bộ Prompt bạn cần. Toàn bộ Prompt được lưu vĩnh viễn trong Kho Prompt của bạn với tính năng 1-Click Sao Chép.'
  },
  {
    q: 'Prompt ở đây có chạy được trên các công cụ AI phổ biến hiện nay không?',
    a: '100% tương thích! Toàn bộ prompt được kiểm chứng thực tế trên Higgsfield, Kling AI 1.5, Luma Dream Machine, Midjourney v6.1, Flux.1, ChatGPT-4o, Claude 3.5 Sonnet và phần mềm N8N.'
  },
  {
    q: 'Tôi là người mới bắt đầu làm MMO thì có dùng được không?',
    a: 'Rất dễ dàng! Mỗi thẻ prompt đều có hướng dẫn chi tiết bằng Tiếng Việt: từ cách chọn công cụ, cài đặt camera, tỉ lệ khung hình (16:9 hay 9:16) đến mẹo ghép âm thanh để video dễ lên xu hướng.'
  },
  {
    q: 'Ví Xu có an toàn không? Nạp tiền bao lâu thì có Xu?',
    a: 'Cổng thanh toán VietQR tự động nhận diện và cộng Xu vào ví chỉ sau 3-5 giây. Nếu có bất kỳ câu hỏi nào, bạn có thể nhắn tin trực tiếp với đội ngũ hỗ trợ qua nút Chat 1-1 trên thanh điều hướng.'
  }
];
