import { getWalletBalance, deductWalletCoins, addWalletCoins, addWithdrawableCoins } from '../utils/wallet.js';
import { getUserTier, getTierLimits } from '../utils/userTier.js';
import { savePurchasedCourse } from '../utils/storage.js';
import { getFirestoreDb, collection, doc, setDoc, onSnapshot, query, getDocs, deleteDoc } from '../utils/firebaseConfig.js';

const MARKETPLACE_KEY = 'promptmmo_marketplace_decks_v4'; // v4 for clean prompt mmo marketplace
const LEGACY_MARKETPLACE_KEY = 'onthi_marketplace_decks_v2';
const CLOUD_MARKETPLACE_TOPIC = 'promptmmo_marketplace_v5';

export const INITIAL_MARKETPLACE_DECKS = [
  {
    id: 'mkt_higgsfield_kling_cinema',
    title: '50+ Prompt Video Điện Ảnh 8K Higgsfield & Kling AI Triệu View',
    subtitle: 'Công thức chuyển động camera drone, visual FX ánh sáng anamorphic và cinematic hyperlapse',
    description: 'Bộ Prompt thiết kế riêng cho video ngắn TikTok, Reels và Shorts. Cấu trúc câu lệnh tiếng Anh chuẩn xác, tham số tỷ lệ khung hình --ar 16:9, motion strength 7-9, ánh sáng volumetric neon và octane render siêu nét.',
    category: 'video-ai',
    categoryName: 'Video AI Triệu View',
    categoryLabel: 'Higgsfield & Kling',
    priceXu: 3,
    cardCount: 20,
    authorName: 'Ban Quản Trị PromptMMO',
    authorEmail: 'thaitraicau123@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 1420,
    rating: 4.98,
    createdAt: '2026-10-01',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'Cinematic Drone Hyperlapse Neon Tokyo (Higgsfield & Kling)',
        back: 'Prompt:\nCinematic ultra-wide FPV drone flying rapidly through a futuristic Tokyo cyberpunk street at heavy midnight rain, towering neon holograms reflecting on wet asphalt, volumetric mist, anamorphic lens flare, photorealistic 8k octane render --ar 16:9 --motion 8 --camera fast-forward\n\nTham số tối ưu:\n- Kling: Mode High Quality, Motion 7, Relevance 0.75\n- Higgsfield: Cinema Camera, Focal Length 16mm, Night Lighting',
        tag: 'Cinematic Drone'
      },
      {
        id: 2,
        front: 'Slow-Motion Dynamic Water Splash Martial Arts (Kling 1.5)',
        back: 'Prompt:\nSlow motion 120fps dynamic martial arts master striking water surface in bamboo forest, thousands of water droplets suspended in mid-air catching golden sunset rays, dramatic backlighting, high shutter speed, cinematic color grading, hyper-detailed textures --ar 9:16 --motion 5\n\nTham số tối ưu:\n- Kling: 1080p, Motion 5, Negative: blurry, deformed hands',
        tag: 'Slow Motion FX'
      },
      {
        id: 3,
        front: 'Hyper-Realistic Macro Eye Zoom to Galaxy (Kling/Luma)',
        back: 'Prompt:\nExtreme macro close-up of a human iris dilating, smooth infinite continuous zoom traveling deep into the pupil, transitioning seamlessly into a swirling cosmic nebula galaxy with vibrant stardust and glowing solar flares, photorealistic CGI, 8k resolution --ar 16:9 --cfg 7.5\n\nTham số tối ưu:\n- Luma Ray 2: Infinite zoom loop, cinematic depth',
        tag: 'Cosmic Zoom'
      },
      {
        id: 4,
        front: 'Luxury Hypercar Drift with Red Smoke FX (Higgsfield)',
        back: 'Prompt:\nLow-angle tracking shot of a matte black hypercar drifting around a mountain hairpin curve at dusk, thick billowing tire smoke illuminated by red LED taillights, asphalt debris flying towards camera, motion blur on background, shot on Arri Alexa 65 --ar 16:9 --speed 1.2\n\nTham số tối ưu:\n- Higgsfield: Dynamic Cam, Shutter Speed 1/250s',
        tag: 'Vehicle Motion'
      },
      {
        id: 5,
        front: 'Commercial Luxury Espresso Pouring (Runway Gen-3)',
        back: 'Prompt:\nCommercial product cinematography, rich velvety espresso pouring in ultra slow-motion into a transparent glass cup, golden crema swirling, delicate aroma steam forming ethereal miniature shapes, soft rim lighting, warm cozy cafe atmosphere, 4k commercial --ar 9:16\n\nTham số tối ưu:\n- Runway: Seed random, Motion 4, Fluid Dynamics',
        tag: 'Commercial Ads'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Tham số nào trên Kling AI giúp tăng cường độ chuyển động của nhân vật/camera?',
        options: [
          'A. Tham số Motion (từ 1 đến 10)',
          'B. Tham số Aspect Ratio (--ar)',
          'C. Tham số Seed',
          'D. Tham số Negative Prompt'
        ],
        correct: 0,
        explanation: 'Tham số Motion trên Kling quy định độ mạnh của chuyển động vật thể và chuyển động camera trong cảnh quay.'
      },
      {
        id: 2,
        question: 'Để quay video review sản phẩm dạng đứng cho TikTok Shop và Reels, tỷ lệ khung hình nào chuẩn nhất?',
        options: [
          'A. 16:9 (Ngang)',
          'B. 9:16 (Dọc toàn màn hình)',
          'C. 1:1 (Vuông)',
          'D. 4:3 (Cổ điển)'
        ],
        correct: 1,
        explanation: 'Tỷ lệ 9:16 là chuẩn hiển thị tràn viền dọc tối ưu trên TikTok, Instagram Reels và YouTube Shorts.'
      }
    ]
  },
  {
    id: 'mkt_midjourney_flux_ecommerce',
    title: 'Bộ Prompt Midjourney v6 & Flux.1 Chụp Ảnh Sản Phẩm E-Commerce Studio',
    subtitle: 'Mô phỏng studio chụp ảnh thương mại chuyên nghiệp: Mỹ phẩm, thời trang, đồng hồ và đồ công nghệ',
    description: 'Tiết kiệm hàng chục triệu chi phí chụp studio. Cung cấp câu lệnh render ảnh mockup sản phẩm cực nét, ánh sáng studio softbox, bục trưng bày đá travertine và texture chuẩn từng milimet.',
    category: 'image-ai',
    categoryName: 'Ảnh Studio Midjourney & Flux',
    categoryLabel: 'Midjourney & Flux',
    priceXu: 4,
    cardCount: 25,
    authorName: 'Ban Quản Trị PromptMMO',
    authorEmail: 'thaitraicau123@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 980,
    rating: 4.96,
    createdAt: '2026-10-02',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'Serum Mỹ Phẩm Luxury trên Bục Đá Travertine (Midjourney v6)',
        back: 'Prompt:\nCommercial product photography of a luxury amber glass skincare dropper bottle, placed on a rough textured beige travertine stone podium, warm natural sunlight beam casting elegant palm leaf shadow, soft water ripples reflecting light, minimal zen aesthetic, Hasselblad 100mm lens, studio lighting --ar 4:5 --v 6.0 --style raw',
        tag: 'Cosmetic Studio'
      },
      {
        id: 2,
        front: 'Đồng Hồ Cơ Thể Thao Nổi Trên Khói Khô & Kim Loại (Flux.1 Pro)',
        back: 'Prompt:\nA luxury mechanical chronograph wristwatch floating weightlessly in center, dark matte carbon fiber background, dramatic blue and cyan rim lighting, delicate dry ice fog swirling around the metallic bezel, extreme macro detailing on watch hands and gears, photorealistic 8k commercial render',
        tag: 'Luxury Watch'
      },
      {
        id: 3,
        front: 'Giày Sneaker Streetwear Bay Giữa Không Trung Vỡ Vụn Hạt Bụi (Midjourney)',
        back: 'Prompt:\nDynamic commercial sneaker advertisement, modern colorful chunky sneaker hovering mid-air at 45 degree angle, exploding colorful powder dust particles trailing behind, studio clean neutral background, high-speed photography, sharp focus, 8k --ar 1:1 --v 6.0',
        tag: 'Sneaker Ad'
      },
      {
        id: 4,
        front: 'Tai Nghe Chống Ồn Cao Cấp Trên Mặt Nước Gợn Sóng (Flux.1)',
        back: 'Prompt:\nMinimalist commercial mockup of sleek wireless matte black over-ear headphones resting gently on mirror-flat dark water with subtle concentric ripples, dramatic spotlight from above, deep shadows, premium Scandinavian audio product aesthetic, hyper-detailed texture',
        tag: 'Tech Mockup'
      },
      {
        id: 5,
        front: 'Nước Hoa Nữ Sang Trọng Giữa Hoa Lan Trắng & Ánh Pha Lê (Midjourney)',
        back: 'Prompt:\nElegant glass perfume bottle with gold metallic cap, surrounded by fresh dewy white orchids and crystal prisms refracting rainbow caustics, soft pastel peach gradient backdrop, editorial Vogue style commercial shot --ar 3:4 --v 6.0 --s 250',
        tag: 'Perfume Luxury'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Trong Midjourney v6, tham số nào giúp ảnh trông chân thực và ít chất tranh vẽ AI nhất?',
        options: [
          'A. --style raw',
          'B. --chaos 100',
          'C. --stylize 1000',
          'D. --weird 500'
        ],
        correct: 0,
        explanation: 'Tham số --style raw giảm bớt phong cách mặc định của Midjourney, giúp tạo ra hình ảnh tự nhiên, chân thực như máy ảnh thật.'
      }
    ]
  },
  {
    id: 'mkt_tiktok_affiliate_hooks',
    title: '100+ Hook Giữ Chân 3 Giây Đầu & Kịch Bản Review TikTok Shop Nổ Đơn',
    subtitle: 'Công thức câu mở đầu kích thích tò mò và kịch bản video review đồ gia dụng, thời trang chuyển đổi cao',
    description: 'Được tổng hợp từ các kênh TikTok Shop trăm nghìn follower. Kèm phân tích tâm lý khách hàng, cấu trúc Problem - Agitate - Solution và các câu Call-To-Action thúc đẩy bấm vào giỏ hàng vàng.',
    category: 'copy-mmo',
    categoryName: 'Kịch Bản & Content MMO',
    categoryLabel: 'TikTok Shop',
    priceXu: 3,
    cardCount: 30,
    authorName: 'Ban Quản Trị PromptMMO',
    authorEmail: 'thaitraicau123@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 1650,
    rating: 4.97,
    createdAt: '2026-10-03',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'Hook "Cảnh Báo / Sai Lầm Tiền Mất Tật Mang" (Giữ chân 85%)',
        back: 'Công thức:\n"Dừng ngay việc [hành động sai] nếu bạn không muốn [hậu quả nghiêm trọng]!"\n\nVí dụ thực chiến:\n"Dừng ngay việc xịt nước hoa thẳng lên cổ áo nếu bạn không muốn chai 2 triệu mà bay mùi chỉ sau 15 phút! Đây là cách xịt chuẩn của chuyên gia mùi hương..."\n\nTâm lý: Kích hoạt nỗi sợ mất mát (FOMO) ngay 2 giây đầu.',
        tag: 'Hook Cảnh Báo'
      },
      {
        id: 2,
        front: 'Hook "So Sánh Ngược Đời / Tiết Kiệm Khủng"',
        back: 'Công thức:\n"Tại sao phải bỏ ra [số tiền lớn] khi món đồ chỉ [số tiền nhỏ] này làm được y hệt?"\n\nVí dụ thực chiến:\n"Tại sao phải bỏ ra tận 1 triệu 5 đi salon phục hồi tóc, trong khi hũ hấp dầu collagen 69k này cho kết quả mềm mượt ngay lần gội đầu tiên? Xem hết video để thấy sự khác biệt!"\n\nTâm lý: Đánh vào lòng tham và sự tò mò so sánh chi phí.',
        tag: 'Hook Tiết Kiệm'
      },
      {
        id: 3,
        front: 'Kịch Bản "Problem - Agitate - Solution" (P.A.S)',
        back: 'Cấu trúc 45 giây:\n1. Giây 0-3 (Problem): Nêu đau đớn khó chịu nhất (mụn ẩn, phòng bừa bộn, đau lưng)\n2. Giây 4-15 (Agitate): Khoét sâu cảm giác bực bội, thử bao nhiêu cách không hiệu quả\n3. Giây 16-35 (Solution): Đưa sản phẩm ra test tại chỗ, quay cận cảnh hiệu quả tức thì\n4. Giây 36-45 (CTA): Giỏ hàng vàng đang có voucher giảm 30k cho 50 người đầu tiên.',
        tag: 'Kịch Bản P.A.S'
      },
      {
        id: 4,
        front: 'Hook "Bí Mật Bị Giấu Kín / Người Trong Ngành"',
        back: 'Công thức:\n"Đây là điều mà các chủ shop [ngành hàng] không bao giờ muốn bạn biết..."\n\nVí dụ:\n"Đây là bí mật mà các shop bán áo thun 300k không muốn bạn biết: Họ đều lấy chung một xưởng dệt cotton 100% với con áo 79k này! Nhìn kỹ đường kim mũi chỉ nè..."',
        tag: 'Hook Bí Mật'
      },
      {
        id: 5,
        front: 'Công Thức Kêu Gọi Hành Động (CTA) Tăng 3x Tỷ Lệ Click Giỏ Hàng',
        back: 'Kỹ thuật:\nKhông nói chung chung "bấm vào giỏ hàng". Hãy gắn liền với quyền lợi cấp bách:\n"Bác nào săn được voucher 50k ở góc trái dưới màn hình thì nhanh tay bấm mua ngay nhé, shop chỉ trợ giá đúng 100 suất trong hôm nay thôi!"',
        tag: 'CTA Chốt Deal'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Thời lượng vàng của một video ngắn review TikTok Shop chuyển đổi cao nhất thường là bao nhiêu giây?',
        options: [
          'A. 30 - 60 giây',
          'B. 5 - 10 phút',
          'C. Trên 3 phút',
          'D. 120 giây'
        ],
        correct: 0,
        explanation: 'Thời lượng 30 - 60 giây giữ được tỷ lệ xem hết (completion rate) cao nhất, thuật toán sẽ đẩy mạnh vào trang Dành cho bạn (FYP).'
      }
    ]
  },
  {
    id: 'mkt_n8n_chatgpt_automation',
    title: 'Workflow N8N & Prompt ChatGPT Auto Viết Bài Chuẩn SEO Bắn Vào Web',
    subtitle: 'Tự động hóa luồng: Tìm từ khóa -> ChatGPT viết bài 2000 chữ chuẩn SEO -> Bắn tự động lên WordPress',
    description: 'Sơ đồ luồng N8N node JSON và bộ Prompt lập outline chuyên sâu, chống trùng lặp, tự động chèn heading H2/H3, FAQ schema và meta description. Cứ mỗi 1 tiếng tự sinh 5 bài viết hoàn chỉnh.',
    category: 'skills-automation',
    categoryName: 'AI Skills & Automation',
    categoryLabel: 'N8N Workflow',
    priceXu: 5,
    cardCount: 15,
    authorName: 'Ban Quản Trị PromptMMO',
    authorEmail: 'thaitraicau123@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 820,
    rating: 4.95,
    createdAt: '2026-10-04',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'Cấu Trúc Node N8N Webhook -> AI Agent -> WordPress REST API',
        back: 'Sơ đồ luồng:\n1. Cron Trigger: Kích hoạt mỗi 60 phút\n2. Google Sheets / Airtable: Đọc 1 từ khóa SEO chưa xuất bản\n3. OpenAI / Gemini Node: Thực thi Prompt viết bài chuẩn HTML\n4. HTTP Request: Đẩy bài viết lên WordPress qua POST /wp-json/wp/v2/posts\n5. Update Sheet: Đánh dấu trạng thái "Đã Đăng".',
        tag: 'N8N Architecture'
      },
      {
        id: 2,
        front: 'Master Prompt ChatGPT 4o Viết Bài SEO 2.000 Chữ Chống Dính AI Detector',
        back: 'Prompt:\n"Bạn là chuyên gia Senior SEO Copywriter. Hãy viết bài viết chuyên sâu về chủ đề [KEYWORD]. Yêu cầu:\n- Giọng văn tự nhiên, có trải nghiệm thực tế (E-E-A-T)\n- Cấu trúc H2, H3 rõ ràng, chèn bullet point súc tích\n- Độ dài tối thiểu 1.800 từ\n- Trả về mã HTML sạch (thẻ h2, h3, p, ul, li), không bọc trong markdown codeblock\n- Kèm 3 câu hỏi thường gặp FAQ Schema."',
        tag: 'SEO Master Prompt'
      },
      {
        id: 3,
        front: 'Prompt Tự Động Sinh Meta Description & Thẻ Title Hấp Dẫn CTR > 8%',
        back: 'Prompt:\n"Từ nội dung bài viết trên, hãy tạo 3 phương án Thẻ Title (<60 ký tự) và Meta Description (<155 ký tự). Yêu cầu:\n1. Chứa từ khóa chính ở đầu câu\n2. Có con số hoặc năm 2026\n3. Từ ngữ kích thích hành động (Bí quyết, Hướng dẫn từ A-Z, Tiết kiệm...)"',
        tag: 'Meta SEO'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Tại sao N8N được dân MMO ưa chuộng hơn Zapier khi làm tự động hóa quy mô lớn?',
        options: [
          'A. N8N là mã nguồn mở, có thể self-host miễn phí và không bị giới hạn số task',
          'B. N8N chỉ chạy được trên điện thoại',
          'C. N8N không hỗ trợ API',
          'D. N8N đắt hơn Zapier gấp 10 lần'
        ],
        correct: 0,
        explanation: 'N8N cho phép cài đặt trên VPS riêng (self-host), chạy hàng triệu workflow tự động mỗi tháng với chi phí máy chủ cố định siêu rẻ.'
      }
    ]
  },
  {
    id: 'mkt_sora_runway_gen3_fx',
    title: 'Tuyển Tập Prompt Slow-Motion & Chuyển Cảnh Visual FX Runway Gen-3 & Luma',
    subtitle: 'Hiệu ứng nổ hạt cát, biến hình morphing, portal không gian và time-freeze ảo diệu',
    description: 'Kho câu lệnh kỹ xảo visual effect chuyên nghiệp dành cho dựng phim, intro kênh YouTube và video quảng cáo 3D bắt mắt.',
    category: 'video-ai',
    categoryName: 'Video AI Triệu View',
    categoryLabel: 'Runway & Luma',
    priceXu: 4,
    cardCount: 20,
    authorName: 'Ban Quản Trị PromptMMO',
    authorEmail: 'thaitraicau123@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 650,
    rating: 4.94,
    createdAt: '2026-10-05',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'Hiệu Ứng Vụn Vỡ Thành Cát Vàng Phong Cách Thần Thoại (Runway)',
        back: 'Prompt:\nFull body shot of an ancient Egyptian golden pharaoh statue slowly disintegrating into shimmering golden sand particles in heavy wind, particles dispersing smoothly into air, dramatic rim lighting, slow motion 60fps cinematic 4k render',
        tag: 'Sand Disintegration'
      },
      {
        id: 2,
        front: 'Chuyển Cảnh Xuyên Qua Cổng Không Gian Quantum Portal (Luma Ray 2)',
        back: 'Prompt:\nContinuous forward camera movement flying directly through a glowing purple quantum energy portal hovering in a rainy alleyway, stepping into a breathtaking lush extraterrestrial bioluminescent jungle world, seamless motion transition',
        tag: 'Portal Warp'
      }
    ],
    previewQuiz: []
  },
  {
    id: 'mkt_flux_realistic_portrait',
    title: 'Công Thức Prompt Flux.1 Pro Chân Dung Người Thật 100% Cực Nét Không Lỗi Ngón Tay',
    subtitle: 'Chân dung hot girl, người mẫu lookbook, doanh nhân với chi tiết lỗ chân lông và ánh mắt chân thực',
    description: 'Bí quyết căn chỉnh Prompt trên mô hình Flux.1: Tinh chỉnh ánh sáng da mặt, độ bóng của tóc, kết cấu sợi vải áo len và loại bỏ hoàn toàn cảm giác ảnh sáp nhân tạo.',
    category: 'image-ai',
    categoryName: 'Ảnh Studio Midjourney & Flux',
    categoryLabel: 'Flux Realism',
    priceXu: 3,
    cardCount: 20,
    authorName: 'Ban Quản Trị PromptMMO',
    authorEmail: 'thaitraicau123@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 1120,
    rating: 4.99,
    createdAt: '2026-10-06',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'Chân Dung Nữ Doanh Nhân Trẻ Trong Văn Phòng Kính Hiện Đại',
        back: 'Prompt:\nA candid medium-shot photograph of a 26-year-old Vietnamese professional woman smiling confident, wearing an oversized beige tailored blazer, sitting at a sunlit cafe table with a macbook, natural skin texture with subtle pores and freckles, soft daylight pouring through large floor-to-ceiling windows, shot on Leica M11 with 50mm Summilux f/1.4 lens, authentic candid lifestyle photography',
        tag: 'Business Portrait'
      },
      {
        id: 2,
        front: 'Chân Dung Streetwear Phong Cách Film 35mm Cổ Điển',
        back: 'Prompt:\nVintage 35mm film photograph of a stylish young guy with layered street fashion, standing outside a convenience store at night in Taipei, retro Kodak Portra 400 film grain, moody neon signs reflection in background, shallow depth of field',
        tag: '35mm Film Look'
      }
    ],
    previewQuiz: []
  },
  {
    id: 'mkt_shopee_livestream_script',
    title: 'Kịch Bản Livestream Shopee & TikTok Xả Kho Triệu Xu (Kèm Thoại Chốt Deal)',
    subtitle: 'Mẫu kịch bản 120 phút dẫn dắt cảm xúc người xem từ tò mò -> giữ chân -> tung voucher -> ép mua',
    description: 'Kịch bản chi tiết từng phút cho Host livestream và trợ lý giơ biển. Kèm danh sách các câu đẩy nhịp tim, thông báo còn 5 suất cuối cùng và cách xử lý khi lượt xem bị tụt.',
    category: 'copy-mmo',
    categoryName: 'Kịch Bản & Content MMO',
    categoryLabel: 'Livestream Sales',
    priceXu: 3,
    cardCount: 18,
    authorName: 'Ban Quản Trị PromptMMO',
    authorEmail: 'thaitraicau123@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 790,
    rating: 4.93,
    createdAt: '2026-10-07',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'Thoại Mở Màn 5 Phút Đầu Kéo Mắt Xem Trực Tiếp',
        back: 'Kịch bản:\n"Chào mừng 500 anh em đang có mặt trong phiên live ngày hôm nay! Ai nghe rõ tiếng em thì gõ phím 1 kèm tên tỉnh thành của mình để lát em ghim voucher 50k riêng cho tỉnh mình nhé! Hôm nay em có đúng 30 suất quà 0 đồng ở đầu live cho bác nào nhanh tay thả tim đến mốc 10.000 tim..."',
        tag: 'Mở Màn Live'
      },
      {
        id: 2,
        front: 'Thoại Đẩy Nhịp Ép Chốt Deal Trong 60 Giây Đếm Ngược',
        back: 'Kịch bản:\n"Kho báo chỉ còn đúng 4 cái size L! Bác nào chưa bấm thanh toán thì bấm ngay kẻo hệ thống tự nhả đơn cho người khác! Đếm ngược 3... 2... 1... Hết suất trợ giá 99k, em xin phép đổi giá lên 199k nhé!"',
        tag: 'Ép Chốt Đơn'
      }
    ],
    previewQuiz: []
  },
  {
    id: 'mkt_elevenlabs_voice_clone',
    title: 'Bộ Tham Số & Prompt Giọng Đọc AI Viral Kể Chuyện Podcast & Review Phim',
    subtitle: 'Tinh chỉnh Stability, Clarity và Style Exaggeration trên ElevenLabs để giọng đọc trầm ấm cuốn hút',
    description: 'Cách chọn Voice Model, thêm dấu ngắt nghỉ [pause], nhấn nhá trọng âm và prompt kịch bản dẫn chuyện giữ chân khán giả nghe hết tập podcast dài.',
    category: 'acc-tools',
    categoryName: 'Tool & Tài Nguyên MMO',
    categoryLabel: 'ElevenLabs Audio',
    priceXu: 2,
    cardCount: 15,
    authorName: 'Ban Quản Trị PromptMMO',
    authorEmail: 'thaitraicau123@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 910,
    rating: 4.95,
    createdAt: '2026-10-08',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'Bộ Tham Số Giọng Review Phim Trầm Bí Ẩn (ElevenLabs Multilingual v2)',
        back: 'Cấu hình tham số:\n- Voice Model: Multilingual v2\n- Stability: 38% (Cho phép giọng có độ rung cảm xúc tự nhiên)\n- Clarity / Similarity: 82% (Giữ đúng âm sắc gốc không bị lẫn tạp âm)\n- Style Exaggeration: 15% (Nhấn nhá nhẹ ở cuối câu)\n- Speaker Boost: ON\n\nMẹo: Dùng dấu gạch nối "—" hoặc dấu ba chấm "..." để tạo khoảng lặng hồi hộp.',
        tag: 'Audio Parameters'
      }
    ],
    previewQuiz: []
  },
  {
    id: 'mkt_c2c_automation_leads',
    title: 'Prompt Bot AI Tự Động Quét Lead & Chăm Sóc Khách Hàng Telegram / Zalo',
    subtitle: 'Kịch bản bot AI tư vấn sản phẩm, giải đáp thắc mắc và tự động gửi link thanh toán VietQR',
    description: 'Bộ System Prompt thông minh cho Chatbot AI đóng vai tư vấn viên tận tâm, không bao giờ cáu gắt, thuộc lòng bảng giá sản phẩm và tự động chốt đơn gửi link VietQR kèm mã memo giao dịch.',
    category: 'skills-automation',
    categoryName: 'AI Skills & Automation',
    categoryLabel: 'Chatbot Auto',
    priceXu: 4,
    cardCount: 16,
    authorName: 'Ban Quản Trị PromptMMO',
    authorEmail: 'thaitraicau123@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 540,
    rating: 4.91,
    createdAt: '2026-10-09',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'System Prompt Bot Tư Vấn Bán Hàng Tự Động Gửi VietQR',
        back: 'System Prompt:\n"Bạn là trợ lý bán hàng trực tuyến của shop [TÊN_SHOP]. Nhiệm vụ của bạn là:\n1. Trả lời thân thiện, lịch sự, dùng emoji phù hợp\n2. Tư vấn đúng gói sản phẩm theo nhu cầu khách\n3. Khi khách đồng ý mua, hãy tạo thông tin chuyển khoản: Số tài khoản, Ngân hàng, Số tiền và cú pháp chuyển khoản memo chính xác\n4. Nhắc khách chụp ảnh biên lai sau khi thanh toán thành công."',
        tag: 'System Prompt Bot'
      }
    ],
    previewQuiz: []
  },
  {
    id: 'mkt_fb_ads_creative_prompts',
    title: '50 Công Thức Viết Copy Facebook Ads Chuyển Đổi Cao Ngành Mỹ Phẩm & Thời Trang',
    subtitle: 'Công thức PAS, AIDA, BAB kèm cấu trúc hình ảnh visual ad thu hút CTR > 5%',
    description: 'Tổng hợp mẫu bài viết quảng cáo Facebook ra đơn thực chiến, tiêu đề không bị bóp tương tác, chính sách chống vi phạm từ khóa nhạy cảm và mẹo A/B test hình ảnh.',
    category: 'copy-mmo',
    categoryName: 'Kịch Bản & Content MMO',
    categoryLabel: 'Facebook Ads',
    priceXu: 3,
    cardCount: 25,
    authorName: 'Ban Quản Trị PromptMMO',
    authorEmail: 'thaitraicau123@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorTier: 'ultra',
    salesCount: 880,
    rating: 4.96,
    createdAt: '2026-10-10',
    isApproved: true,
    previewCards: [
      {
        id: 1,
        front: 'Công Thức Copy AIDA Ngành Thời Trang & Phụ Kiện',
        back: 'Cấu trúc bài viết:\n- Attention (Gây chú ý): "Chiếc váy khiến mọi cô gái đều phải hỏi link ngay khi bạn bước vào phòng..."\n- Interest (Thích thú): "Thiết kế eo cao tôn dáng, chất lụa satin mát lịm nhập khẩu không nhăn dù ngồi cả ngày..."\n- Desire (Khao khát): "Chỉ 1 lần diện là tự tin tỏa sáng trong mọi bữa tiệc cuối tuần!"\n- Action (Hành động): "Bấm [Nhận Ưu Đãi] ngay hôm nay để nhận freeship toàn quốc!"',
        tag: 'Copy AIDA'
      }
    ],
    previewQuiz: []
  }
];

// Ensure each deck has sampleCards alias for backward compatibility
INITIAL_MARKETPLACE_DECKS.forEach(d => {
  d.sampleCards = d.previewCards;
});

export const REMOVED_MOCK_IDS = [
  'mkt_sat_vocab',
  'mkt_english_grammar',
  'mkt_sql_interview',
  'mkt_civil_servant_law',
  'mkt_japanese_business',
  'mkt_medical_ethics',
  'mkt_sat_reading_pass',
  'pass_sat_reading_800'
];

const DELETED_DECKS_KEY = 'promptmmo_deleted_marketplace_deck_ids';

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
    const raw = localStorage.getItem(MARKETPLACE_KEY) || localStorage.getItem(LEGACY_MARKETPLACE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter(d => d && d.id && !deletedIds.has(d.id));
        
        // Build unified map: Canonical baseline decks + user custom/pass decks
        const deckMap = new Map();
        
        // 1. Seed with latest canonical INITIAL_MARKETPLACE_DECKS
        INITIAL_MARKETPLACE_DECKS.forEach(initDeck => {
          if (!deletedIds.has(initDeck.id)) {
            deckMap.set(initDeck.id, { ...initDeck });
          }
        });

        // 2. Merge cached user decks and preserve ratings / sales counts
        filtered.forEach(d => {
          if (d.isCustomUserDeck || d.isPassDeck) {
            deckMap.set(d.id, d);
          } else if (deckMap.has(d.id)) {
            const baseline = deckMap.get(d.id);
            deckMap.set(d.id, {
              ...baseline,
              salesCount: Math.max(d.salesCount || 0, baseline.salesCount || 0),
              rating: d.rating || baseline.rating
            });
          }
        });

        const fullDecks = Array.from(deckMap.values());
        localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(fullDecks));
        return fullDecks;
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
    category: clean.category || 'video-ai',
    categoryName: clean.categoryName || 'Chợ Prompt MMO C2C',
    categoryLabel: clean.categoryLabel || 'Prompt C2C',
    priceXu: Number(clean.priceXu) || 3,
    originalPriceXu: clean.originalPriceXu,
    cardCount: clean.cardCount || cards.length || 10,
    authorName: clean.isCustomUserDeck ? (clean.authorName || 'Ban Quản Trị PromptMMO') : 'Ban Quản Trị PromptMMO',
    authorAvatar: clean.isCustomUserDeck ? (clean.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80') : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorTier: clean.isCustomUserDeck ? (clean.authorTier || 'free') : 'ultra',
    authorEmail: clean.isCustomUserDeck ? (clean.authorEmail || '') : 'thaitraicau123@gmail.com',
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

const KVDB_MARKETPLACE_URL = 'https://kvdb.io/SBPTa4d8XoFCmTGm4KJGC9/index_marketplace_events';

// Broadcast action to Cloud Relay (KVDB Singapore Edge + ntfy fallback)
export async function broadcastMarketplaceAction(action, data) {
  if (typeof fetch === 'undefined') return;
  let payloadData = data;
  if (action === 'publish_deck') {
    payloadData = toCompactDeckPayload(data);
  }
  const eventObj = { action, data: payloadData, timestamp: new Date().toISOString() };

  // 1. Primary: KVDB Singapore Edge
  try {
    let list = [];
    try {
      const res = await fetch(KVDB_MARKETPLACE_URL, { cache: 'no-store' });
      if (res.ok) list = await res.json();
    } catch (e) {}
    if (!Array.isArray(list)) list = [];
    list.push(eventObj);
    if (list.length > 60) list = list.slice(-60);

    await fetch(KVDB_MARKETPLACE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(list)
    });
  } catch (e) {}

  // 2. Secondary fallback: ntfy with 2s timeout
  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 2000) : null;
    await fetch('https://ntfy.sh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: CLOUD_MARKETPLACE_TOPIC,
        message: JSON.stringify(eventObj),
        title: `MKT_${action}`
      }),
      signal: controller ? controller.signal : undefined
    }).finally(() => {
      if (timeoutId) clearTimeout(timeoutId);
    });
  } catch (e) {}
}

// Alias for backward compatibility
export async function broadcastDeckToCloudRelay(deck) {
  return broadcastMarketplaceAction('publish_deck', deck);
}

// Fetch cross-device decks and events from Cloud Relay (KVDB Singapore Edge + ntfy fallback)
export async function fetchCloudRelayMarketplaceEvents() {
  if (typeof fetch === 'undefined') return [];
  const events = [];

  // 1. Primary: KVDB Singapore Edge
  try {
    const res = await fetch(KVDB_MARKETPLACE_URL, { cache: 'no-store' });
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list)) {
        list.forEach((item) => {
          if (item) events.push(item);
        });
      }
    }
  } catch (e) {}

  // 2. Secondary fallback: ntfy with 2s timeout
  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 2000) : null;
    const res = await fetch(`https://ntfy.sh/${CLOUD_MARKETPLACE_TOPIC}/json?poll=1`, {
      signal: controller ? controller.signal : undefined
    }).finally(() => {
      if (timeoutId) clearTimeout(timeoutId);
    });
    if (res.ok) {
      const text = await res.text();
      const lines = text.trim().split('\n');
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
    }
  } catch (e) {}

  return events;
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

  const merged = Array.from(deckMap.values()).filter(d => !deletedIds.has(d.id)).map(d => {
    if (!d.isCustomUserDeck && !d.isPassDeck) {
      return {
        ...d,
        authorName: 'Ban Quản Trị PromptMMO',
        authorEmail: 'thaitraicau123@gmail.com',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        authorTier: 'ultra'
      };
    }
    return d;
  });
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

// Pass deck from Creator buyer to peer C2C
export function passDeckToMarketplace({ originalCourse, passPriceXu, passNote, sellerUser }) {
  const current = getMarketplaceDecks();
  const sellerName = sellerUser?.displayName || sellerUser?.name || 'Creator Pass Prompt';
  const sellerEmail = sellerUser?.email || '';
  const sellerAvatar = sellerUser?.photoURL || sellerUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
  const sellerTier = sellerUser?.tier || 'free';

  const cardsList = originalCourse.previewCards || originalCourse.cards || [];
  const quizList = originalCourse.previewQuiz || originalCourse.quiz || [];

  const passDeck = {
    id: 'pass_' + Date.now(),
    title: `[PASS LẠI] ${originalCourse.title}`,
    subtitle: `Gói Prompt pass lại từ ${sellerName} với giá ưu đãi cho Creator`,
    description: passNote || `Gói Prompt do ${sellerName} đã ứng dụng ra doanh thu và pass lại với giá ưu đãi.`,
    category: originalCourse.category || 'video-ai',
    categoryName: originalCourse.categoryLabel || originalCourse.categoryName || 'Prompt C2C',
    categoryLabel: originalCourse.categoryLabel || 'Pass Lại C2C',
    priceXu: Math.max(2, parseInt(passPriceXu, 10) || 10),
    originalPriceXu: originalCourse.priceXu || 25,
    cardCount: cardsList.length || originalCourse.cardCount || 20,
    authorName: originalCourse.authorName || 'Ban Quản Trị PromptMMO',
    authorEmail: originalCourse.authorEmail || 'thaitraicau123@gmail.com',
    authorAvatar: originalCourse.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
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
      message: `Số dư ví không đủ! Gói Prompt này giá ${deck.priceXu} Xu, bạn hiện có ${currentBalance} Xu. Vui lòng nạp thêm Xu để tiếp tục.`
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

  // Credit seller earnings to withdrawable balance
  addWithdrawableCoins(sellerEarnings);

  return {
    success: true,
    sellerEarnings,
    feePercent,
    message: `🎉 Mua thành công gói Prompt "${deck.title}" với giá chỉ ${deck.priceXu} Xu! Gói Prompt đã được mở khóa ngay trong "Kho Của Tôi".`
  };
}
