// DỮ LIỆU ĐỀ THI & FLASHCARD CHUẨN BETA - ONTHIHUB 2026
// Tổng cộng hơn 450+ thẻ Anki thực chiến & 120+ câu hỏi trắc nghiệm kiểm tra sâu

export const CATEGORIES = [
  {
    "id": "all",
    "name": "Tất cả",
    "icon": "Sparkles"
  },
  {
    "id": "mario-gaming",
    "name": "Game 3D & Pop Culture",
    "icon": "Gamepad2"
  },
  {
    "id": "cong-chuc",
    "name": "Công Chức & Pháp Luật",
    "icon": "Landmark"
  },
  {
    "id": "it-tech",
    "name": "IT & Kỹ Thuật Lập Trình",
    "icon": "Code2"
  },
  {
    "id": "ngoai-ngu",
    "name": "Ngoại Ngữ (IELTS, JLPT)",
    "icon": "Languages"
  },
  {
    "id": "y-duoc",
    "name": "Y Khoa & Dược Lý",
    "icon": "Activity"
  },
  {
    "id": "tai-chinh",
    "name": "Tài Chính & Doanh Nghiệp",
    "icon": "TrendingUp"
  }
];

export const COURSES_DATA = [
  // =========================================================================
  // 1. MARIO, NINTENDO & THẾ GIỚI GAME 3D CINEMA (CHỦ ĐỀ ĐẶC BIỆT 3D 4K)
  // =========================================================================
  {
    id: 'mario-gaming-3d',
    title: 'Mario, Nintendo & Thế Giới Game 3D Cinema',
    subtitle: 'Hành trình từ Jumpman 1981, Super Mario 64 đến Game Design & Điện ảnh 3D',
    category: 'mario-gaming',
    categoryLabel: 'Game 3D & Cinema',
    badge: 'Đặc biệt 3D #1',
    priceXu: 15,
    originalPriceXu: 45,
    rating: 4.98,
    reviewsCount: 890,
    studentsCount: 2340,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', 'Ebook Lịch Sử Game 3D', 'Bộ Trắc Nghiệm Đồ Họa 3D'],
    description: 'Bộ thẻ chuyên sâu khám phá di sản 40+ năm của Super Mario, nghệ thuật thiết kế màn chơi 4 bước Kishōtenketsu của Nintendo, bước ngoặt camera 3D trong không gian ba chiều của Super Mario 64, và công nghệ dựng hình Ray Tracing / CGI trong The Super Mario Bros. Movie 4K.',
    highlights: [
      '60 Thẻ Anki chuyên sâu về Game Design, cơ chế di chuyển và lịch sử Nintendo',
      'Phân tích triết lý thiết kế màn chơi kinh điển Kishōtenketsu không cần chữ hướng dẫn',
      'Bí quyết công nghệ dựng hình CGI 3D chuyển thể từ game lên màn ảnh rộng',
      'Đầy đủ thẻ thuật ngữ đồ họa: Game Loop, Ray Tracing, Shaders, Hitbox, Rigging'
    ],
    previewCards: [
      { id: 1, front: 'Nhân vật Mario lần đầu tiên xuất hiện trong tựa game nào và với tên gọi ban đầu là gì?', back: 'Game Donkey Kong (1981) trên máy thùng Arcade, dưới tên gọi ban đầu là "Jumpman".\n\n📌 Sau đó được đổi tên thành Mario theo tên ông Mario Segale - chủ khu nhà xưởng mà Nintendo thuê tại Mỹ.', tag: 'Lịch sử Mario' },
      { id: 2, front: 'Ai là "cha đẻ" sáng tạo ra Super Mario và Zelda?', back: 'Huyền thoại Shigeru Miyamoto.\n\n💡 Ông gia nhập Nintendo với vai trò nghệ sĩ thiết kế đồ họa và đã cứu vớt cả ngành công nghiệp game sau đợt khủng hoảng Video Game Crash 1983.', tag: 'Nhân vật' },
      { id: 3, front: 'Triết lý thiết kế màn chơi 4 bước "Kishōtenketsu" (Khởi - Thừa - Chuyển - Hợp) trong Mario hoạt động ra sao?', back: 'Gồm 4 giai đoạn:\n1. Khởi (Introduction): Cho người chơi tiếp xúc cơ chế mới ở môi trường an toàn.\n2. Thừa (Development): Tăng dần độ khó với nhiều biến thể.\n3. Chuyển (Twist): Đảo ngược hoặc thêm yếu tố bất ngờ bắt người chơi thích nghi.\n4. Hợp (Conclusion): Thử thách tổng hợp cho phép người chơi thể hiện sự thuần thục.', tag: 'Game Design' },
      { id: 4, front: 'Đóng góp vĩ đại nhất của Super Mario 64 (1996) đối với ngành công nghiệp game 3D thế giới là gì?', back: 'Định hình hệ thống camera 3D tự do (Lakitu Camera) và cần gạt analog 360 độ.\n\n📌 Trước Super Mario 64, các nhà làm game chưa biết cách điều khiển nhân vật di chuyển tự nhiên trong không gian ba chiều mà không bị mất phương hướng.', tag: 'Kỷ nguyên 3D' },
      { id: 5, front: 'Vương quốc nơi Công chúa Peach cai trị có tên chính thức là gì?', back: 'Vương quốc Nấm (Mushroom Kingdom).\n\n📌 Cư dân bản địa trung thành có hình dáng cây nấm đầu chấm bi được gọi là Toad (Kinopio).', tag: 'Thế giới Mario' },
      { id: 6, front: 'Cơ chế hoạt động của cây Nấm Đỏ (Super Mushroom) và Nấm Xanh (1-Up Mushroom) là gì?', back: '• Nấm Đỏ (Super Mushroom): Biến Mario nhỏ (Small Mario) thành Super Mario to lớn, có thể đập vỡ gạch đá và chịu thêm 1 lần sát thương.\n• Nấm Xanh (1-Up Mushroom): Tặng ngay cho người chơi thêm 1 mạng (extra life).', tag: 'Power-up' },
      { id: 7, front: 'Vật phẩm ngôi sao Super Star (Starman) mang lại năng lực gì cho Mario?', back: 'Trạng thái Bất Tử Tạm Thời (Temporary Invincibility).\n\n📌 Khi nhặt được, Mario phát sáng hào quang 7 màu, di chuyển nhanh hơn, nhạc nền đổi sang giai điệu dồn dập và tiêu diệt ngay lập tức bất kỳ kẻ địch nào chạm phải.', tag: 'Power-up' },
      { id: 8, front: 'Trong game đồ họa máy tính 3D, "Hitbox" và "Hurtbox" khác nhau như thế nào?', back: '• Hitbox: Vùng hình học (vô hình) gây ra sát thương (ví dụ cú đấm của Mario, mai rùa bay).\n• Hurtbox: Vùng hình học bao quanh nhân vật nhận sát thương khi bị Hitbox đối phương chạm trúng.', tag: 'Game Dev' },
      { id: 9, front: 'Thuật ngữ "Game Loop" (Vòng lặp trò chơi) bao gồm 3 bước cơ bản nào lặp lại mỗi frame?', back: '1. Process Input: Đọc thao tác nhấn phím / cần gạt của người chơi.\n2. Update Game State: Tính toán vị trí nhân vật, vật lý, va chạm, AI kẻ địch.\n3. Render: Vẽ toàn bộ khung cảnh lên màn hình (ở 60fps hoặc 120fps).', tag: 'Game Architecture' },
      { id: 10, front: 'Công nghệ "Ray Tracing" (Dò tia) được ứng dụng trong điện ảnh 3D và game 4K nhằm mục đích gì?', back: 'Mô phỏng chính xác đường đi vật lý của các tia sáng trong thực tế.\n\n📌 Tạo ra hiệu ứng đổ bóng chân thực (soft shadows), phản chiếu mặt nước/kim loại (reflections) và ánh sáng tán xạ xung quanh (global illumination).', tag: 'Đồ họa 3D' },
      { id: 11, front: 'Kẻ thù truyền kiếp của Mario, thủ lĩnh tộc Koopa tên là gì?', back: 'Bowser (ở Nhật Bản tên là Đại ma vương Koopa).\n\n📌 Đặc điểm: Rùa khổng lồ có mai gai nhọn, sừng rồng và khả năng phun ra những quả cầu lửa lớn.', tag: 'Nhân vật' },
      { id: 12, front: 'Người em trai sinh đôi cao hơn, mặc áo xanh lá của Mario tên là gì?', back: 'Luigi.\n\n📌 Luigi xuất hiện lần đầu trong Mario Bros (1983). Anh thường nhút nhát hơn nhưng nhảy cao hơn Mario và là nhân vật chính trong series Luigi\'s Mansion săn ma.', tag: 'Nhân vật' },
      { id: 13, front: 'Khủng long xanh dễ thương đồng hành cùng Mario có khả năng nuốt chửng kẻ địch tên là gì?', back: 'Yoshi (T. Yoshisaur Munchakoopas).\n\n📌 Xuất hiện lần đầu trong Super Mario World (1990) trên hệ máy Super Famicom (SNES).', tag: 'Nhân vật' },
      { id: 14, front: 'Hãng phim hoạt hình 3D nào đã hợp tác cùng Nintendo sản xuất "The Super Mario Bros. Movie" (2023)?', back: 'Illumination Studios (thuộc Universal Pictures, hãng làm Despicable Me / Minions).\n\n📌 Bộ phim đã thu về hơn 1,36 tỷ USD phòng vé toàn cầu, trở thành phim chuyển thể từ game thành công nhất lịch sử.', tag: 'Điện ảnh 3D' },
      { id: 15, front: 'Khái niệm "Framerate" (FPS) và "Refresh Rate" (Hz) có điểm gì khác biệt?', back: '• FPS (Frames Per Second): Số khung hình mà card đồ họa (GPU) render ra trong 1 giây.\n• Hz (Hertz): Số lần màn hình phần cứng có thể làm mới hiển thị hình ảnh trong 1 giây.\n💡 Để hiển thị mượt mà nhất, GPU và màn hình cần đồng bộ (G-Sync / FreeSync).', tag: 'Phần cứng & 4K' },
      { id: 16, front: 'Độ phân giải "4K UHD" tiêu chuẩn có kích thước điểm ảnh chính xác là bao nhiêu pixel?', back: '3840 x 2160 pixels (khoảng 8,3 triệu điểm ảnh).\n\n📌 Gấp 4 lần độ phân giải Full HD (1920 x 1080 = 2,07 triệu điểm ảnh).', tag: 'Công nghệ 4K' },
      { id: 17, front: 'Tác dụng của bông hoa Lửa (Fire Flower) trong thế giới Mario là gì?', back: 'Biến Mario thành Fire Mario (Mario mặc trang phục áo trắng quần yếm đỏ), có khả năng ném ra các quả cầu lửa nảy trên mặt đất để tiêu diệt kẻ thù từ xa.', tag: 'Power-up' },
      { id: 18, front: 'Tại sao Mario lại có ria mép và đội mũ lưỡi trai trong thiết kế ban đầu năm 1981?', back: 'Do giới hạn phần cứng đồ họa 8-bit chỉ có lưới 16x16 pixels:\n• Chiếc mũ giúp Miyamoto không phải vẽ tóc chuyển động khi nhảy.\n• Bộ ria mép giúp người chơi phân biệt rõ khuôn mặt và chiếc mũi mà không cần vẽ miệng.', tag: 'Lịch sử thiết kế' },
      { id: 19, front: 'Công nghệ "Level of Detail" (LOD) trong game 3D thế giới mở giải quyết bài toán gì?', back: 'Tối ưu hóa hiệu năng render GPU bằng cách sử dụng các mô hình 3D giảm bớt đa giác (polygons) khi đối tượng ở xa tầm mắt camera, và chỉ nạp mô hình chi tiết cao khi lại gần.', tag: 'Đồ họa 3D' },
      { id: 20, front: 'Hệ máy chơi game mang tính cách mạng kết hợp giữa máy cầm tay (Handheld) và máy cắm TV (Home Console) của Nintendo là gì?', back: 'Nintendo Switch (ra mắt tháng 3/2017).\n\n📌 Đã bán được hơn 143 triệu máy trên toàn thế giới, sở hữu các siêu phẩm Mario Odyssey và Zelda: Breath of the Wild.', tag: 'Phần cứng' },
      { id: 21, front: 'Món đồ Super Leaf (Chiếc lá gấu mèo) trong Super Mario Bros 3 (1988) cho phép Mario làm gì?', back: 'Biến Mario thành Raccoon Mario (Mario chồn Tanooki), mọc tai và đuôi để vẫy đuôi bay lượn trên không trung sau khi chạy đà đầy thanh P-Meter.', tag: 'Power-up' },
      { id: 22, front: 'Khái niệm "Coyote Time" trong lập trình cơ chế nhảy của game Platformer là gì?', back: 'Khoảng thời gian ân huệ (khoảng 0.1 giây) cho phép người chơi vẫn bấm nút nhảy thành công ngay cả sau khi chân nhân vật vừa bước hụt ra khỏi mép vực thẳm.\n💡 Giúp trải nghiệm điều khiển công bằng và thoải mái hơn.', tag: 'Game Dev' },
      { id: 23, front: 'Bài hát chủ đề "Peaches" nổi tiếng trong phim Super Mario Bros do diễn viên nào sáng tác và thể hiện?', back: 'Nam diễn viên Jack Black (lồng tiếng cho Bowser).\n\n📌 Ca khúc đã lọt top bảng xếp hạng Billboard Hot 100 và nhận đề cử Quả Cầu Vàng.', tag: 'Điện ảnh 3D' },
      { id: 24, front: 'Khái niệm "Rigging" và "Skinning" trong quy trình làm hoạt hình nhân vật 3D là gì?', back: '• Rigging: Tạo hệ thống khung xương ảo bên trong mô hình 3D.\n• Skinning: Gán trọng số da thịt vào từng đốt xương để khi xoay cánh tay/chân, bề mặt lưới (mesh) co giãn tự nhiên.', tag: 'Hoạt hình 3D' },
      { id: 25, front: 'Thành phố mang phong cách New York trong Super Mario Odyssey nơi Thị trưởng Pauline điều hành có tên là gì?', back: 'New Donk City (thuộc vương quốc Metro Kingdom).\n\n📌 Nơi đây có cư dân là những người bình thường mặc âu phục và các cột đèn vàng.', tag: 'Thế giới Mario' },
      { id: 26, front: 'Loại ống cống (Warp Pipe) màu xanh lá cây trong Mario dùng để làm gì?', back: 'Là phương tiện dịch chuyển tức thời đưa Mario xuống các căn hầm chứa tiền xu ngầm dưới lòng đất hoặc nhảy cóc qua các màn chơi xa hơn (Warp Zone).', tag: 'Thế giới Mario' },
      { id: 27, front: 'Chiếc nón có mắt sống Cappy trong Super Mario Odyssey mang lại siêu năng lực gì?', back: 'Khả năng "Capture" (Nhập hồn/Chiếm hữu).\n\n📌 Mario ném nón vào đối phương (Goomba, Koopa, Khủng long T-Rex, xe tăng) để trực tiếp điều khiển cơ thể và năng lực của mục tiêu đó.', tag: 'Power-up' },
      { id: 28, front: 'Tựa game Mario đầu tiên giới thiệu thể loại đua xe kết hợp vật phẩm quấy rối là gì?', back: 'Super Mario Kart (ra mắt năm 1992 trên hệ máy SNES).\n\n📌 Khai sinh ra thể loại Kart Racing với các vật phẩm kinh điển như Mai rùa xanh (Spiny Shell), Vỏ chuối, Nấm tăng tốc.', tag: 'Lịch sử Mario' },
      { id: 29, front: 'Cơ chế "Mai rùa xanh" (Blue Shell / Spiny Shell) trong Mario Kart được thiết kế vì mục đích gì?', back: 'Cơ chế cân bằng cao su (Rubber-banding mechanic).\n\n📌 Tự động bay thẳng lên phía trước và phát nổ trừng phạt người chơi đang dẫn đầu vị trí số 1, tạo cơ hội lội ngược dòng kịch tính cho những người ở sau.', tag: 'Game Design' },
      { id: 30, front: 'Công nghệ khử răng cưa "Anti-Aliasing" (FXAA, TAA, MSAA) trong hiển thị đồ họa 4K có tác dụng gì?', back: 'Làm mượt các đường viền góc cạnh bị vỡ hạt răng cưa (jaggies) do bản chất ma trận điểm ảnh hình vuông tạo nên, giúp vật thể 3D trông sắc nét và chân thực.', tag: 'Đồ họa 3D' }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Ai là người sáng tạo và chỉ đạo thiết kế phiên bản Super Mario đầu tiên năm 1985?',
        options: ['A. Hideo Kojima', 'B. Shigeru Miyamoto', 'C. Masahiro Sakurai', 'D. Satoru Iwata'],
        correct: 1,
        explanation: 'Shigeru Miyamoto là huyền thoại game design của Nintendo, người đã tạo ra Super Mario Bros, The Legend of Zelda và Donkey Kong.'
      },
      {
        id: 2,
        question: 'Super Mario 64 phát hành năm 1996 đã đi vào lịch sử ngành game nhờ bước đột phá nào?',
        options: ['A. Lần đầu tiên có âm thanh lồng tiếng', 'B. Định hình chuẩn mực điều khiển camera 3D tự do và cần analog 360 độ', 'C. Trò chơi đầu tiên có độ phân giải 4K', 'D. Giới thiệu nhân vật Luigi'],
        correct: 1,
        explanation: 'Super Mario 64 được coi là cuốn sách giáo khoa kinh điển về cách điều khiển nhân vật và hệ thống camera xoay tự do trong không gian 3 chiều.'
      },
      {
        id: 3,
        question: 'Trong triết lý thiết kế màn chơi 4 bước Kishōtenketsu, bước thứ 3 (Chuyển - Twist) có vai trò gì?',
        options: ['A. Kết thúc màn chơi và cộng điểm', 'B. Đưa ra yếu tố biến thể bất ngờ buộc người chơi phải suy nghĩ cách thích ứng mới', 'C. Cho người chơi thử nghiệm cơ chế trong phòng an toàn', 'D. Giảm độ khó xuống mức tối thiểu'],
        correct: 1,
        explanation: 'Bước "Chuyển" (Ten) giới thiệu một chướng ngại vật bất ngờ hoặc thay đổi điều kiện môi trường để thử thách phản xạ và tư duy của người chơi.'
      },
      {
        id: 4,
        question: 'Độ phân giải 4K Ultra HD (3840 x 2160) có số lượng điểm ảnh gấp bao nhiêu lần độ phân giải Full HD (1920 x 1080)?',
        options: ['A. 2 lần', 'B. 3 lần', 'C. 4 lần', 'D. 8 lần'],
        correct: 2,
        explanation: '(3840 x 2160) / (1920 x 1080) = 2 x 2 = 4 lần. 4K có khoảng 8,29 triệu pixel so với 2,07 triệu pixel của Full HD.'
      },
      {
        id: 5,
        question: 'Vật phẩm Super Star (Ngôi sao vàng) mang lại hiệu ứng gì cho Mario?',
        options: ['A. Bay vĩnh viễn trên mây', 'B. Bất tử tạm thời và tiêu diệt mọi kẻ địch khi va chạm', 'C. Biến tất cả gạch đá thành vàng', 'D. Tăng thêm 100 mạng'],
        correct: 1,
        explanation: 'Super Star cấp trạng thái bất tử tạm thời trong vài giây, nhạc nền dồn dập và cho phép Mario hạ gục mọi chướng ngại vật cản đường.'
      }
    ]
  },

  // =========================================================================
  // 2. KIẾN THỨC CHUNG THI CÔNG CHỨC & VIÊN CHỨC 2026 (75 THẺ CHUYÊN SÂU)
  // =========================================================================
  {
    id: 'cc-kien-thuc-chung',
    title: 'Trọn Bộ Đề & Flashcard Kiến Thức Chung Thi Công Chức 2026',
    subtitle: 'Chuẩn format Vòng 1 Bộ Nội Vụ - Đã cập nhật Luật sửa đổi mới nhất',
    category: 'cong-chuc',
    categoryLabel: 'Thi Công Chức 2026',
    badge: 'Bán chạy nhất #1',
    priceXu: 25,
    originalPriceXu: 65,
    rating: 4.95,
    reviewsCount: 1680,
    studentsCount: 4120,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', 'Ebook Tóm Tắt 100 Sơ Đồ Tư Duy', 'Bộ 750 Câu Trắc Nghiệm Có Lời Giải'],
    description: 'Bao trọn 100% phạm vi thi Vòng 1: Luật Cán bộ, công chức 2008 (sđbs 2019), Luật Viên chức 2010 (sđbs 2019), Hiến pháp 2013, Luật Tổ chức Chính phủ, Nghị định 138/2020/NĐ-CP và Nghị định 115/2020/NĐ-CP. Ghi nhớ chính xác thời hạn kỷ luật, độ tuổi, ngạch bậc công chức mà không lo nhầm lẫn.',
    highlights: [
      '75 Thẻ Anki chuẩn hóa mọi con số thời hiệu, thời hạn kỷ luật, bổ nhiệm',
      'Đầy đủ các điểm sửa đổi bổ sung mới nhất có hiệu lực thi hành 2026',
      'Phân biệt rành mạch Cán bộ vs Công chức vs Viên chức',
      'Bám sát đề thi Vòng 1 các Bộ, Ngành và UBND 63 tỉnh thành'
    ],
    previewCards: [
      { id: 1, front: 'Thời hiệu xử lý kỷ luật đối với hành vi vi phạm của cán bộ, công chức ít nghiêm trọng đến mức phải khiển trách là bao lâu?', back: '02 NĂM (kể từ thời điểm có hành vi vi phạm).\n\n📌 Căn cứ: Khoản 1 Điều 80 Luật Cán bộ, công chức (sửa đổi, bổ sung 2019).\n💡 Mẹo nhớ: Khiển trách = vi phạm nhẹ nhất = 2 năm. Các mức còn lại (trừ trường hợp đặc biệt) là 5 năm.', tag: 'Luật CBCC' },
      { id: 2, front: 'Những trường hợp vi phạm nào KHÔNG ÁP DỤNG thời hiệu xử lý kỷ luật?', back: 'Gồm 4 trường hợp:\n1. Là đảng viên có hành vi vi phạm đến mức phải khai trừ Đảng.\n2. Vi phạm quy định về công tác bảo vệ chính trị nội bộ.\n3. Xâm phạm an ninh quốc gia.\n4. Sử dụng văn bằng, chứng chỉ, chứng nhận giả, không hợp pháp.', tag: 'Điều 80 - Luật CBCC' },
      { id: 3, front: 'Cơ quan nào có thẩm quyền ban hành Nghị định?', back: 'CHÍNH PHỦ.\n\n📌 Căn cứ: Luật Ban hành văn bản quy phạm pháp luật.\n💡 Lưu ý: Thủ tướng ban hành Quyết định, Bộ trưởng ban hành Thông tư.', tag: 'Văn bản QPPL' },
      { id: 4, front: 'Thời hạn bổ nhiệm công chức giữ chức vụ lãnh đạo, quản lý là bao nhiêu năm?', back: '05 NĂM (trừ trường hợp thời hạn bổ nhiệm dưới 05 năm theo quy định chuyên ngành).\n\n📌 Căn cứ: Điều 51 Luật Cán bộ, công chức 2008.', tag: 'Bổ nhiệm' },
      { id: 5, front: 'Hiến pháp 2013 quy định Nhân dân thực hiện quyền lực nhà nước bằng các hình thức nào?', back: 'Bằng DÂN CHỦ TRỰC TIẾP, bằng DÂN CHỦ ĐẠI DIỆN thông qua Quốc hội, Hội đồng nhân dân và thông qua các cơ quan khác của Nhà nước.\n\n📌 Căn cứ: Điều 6 Hiến pháp 2013.', tag: 'Hiến pháp 2013' },
      { id: 6, front: 'Hình thức kỷ luật "Hạ bậc lương" áp dụng cho đối tượng nào?', back: 'Chỉ áp dụng đối với CÔNG CHỨC KHÔNG GIỮ CHỨC VỤ LÃNH ĐẠO, QUẢN LÝ.\n\n💡 Mẹo nhớ: Công chức lãnh đạo vi phạm mức tương đương thì bị "Giáng chức" hoặc "Cách chức", không hạ bậc lương.', tag: 'Kỷ luật' },
      { id: 7, front: 'Các hình thức kỷ luật đối với công chức giữ chức vụ lãnh đạo, quản lý gồm những hình thức nào?', back: 'Gồm 5 hình thức: Khiển trách, Cảnh cáo, Giáng chức, Cách chức, Buộc thôi việc.\n\n⚠️ Chú ý: Không có hình thức "Hạ bậc lương".', tag: 'Kỷ luật CBCC' },
      { id: 8, front: 'Ngạch công chức được phân chia thành bao nhiêu ngạch cơ bản theo Luật hiện hành?', back: 'Gồm 5 ngạch:\n1. Chuyên viên cao cấp và tương đương\n2. Chuyên viên chính và tương đương\n3. Chuyên viên và tương đương\n4. Cán sự và tương đương\n5. Nhân viên (và các ngạch khác theo quy định).', tag: 'Ngạch công chức' },
      { id: 9, front: 'Thời gian tập sự đối với người trúng tuyển công chức ngạch Chuyên viên (loại C) là bao lâu?', back: '12 THÁNG.\n\n📌 Mẹo nhớ: Ngạch Cán sự (loại D) tập sự 06 tháng; Ngạch Chuyên viên (loại C) tập sự 12 tháng.', tag: 'Tập sự' },
      { id: 10, front: 'Theo Luật Tổ chức Chính phủ, Chính phủ làm việc theo chế độ nào?', back: 'Chế độ TẬP THỂ, quyết định theo đa số.\n\n📌 Thủ tướng Chính phủ là người đứng đầu Chính phủ, chịu trách nhiệm trước Quốc hội về hoạt động của Chính phủ.', tag: 'Chính phủ' },
      { id: 11, front: 'Viên chức có bao nhiêu hình thức kỷ luật theo Luật Viên chức?', back: 'Gồm 4 hình thức đối với viên chức không giữ chức vụ quản lý:\n1. Khiển trách\n2. Cảnh cáo\n3. Buộc thôi việc.\nĐối với viên chức quản lý: Thêm hình thức Cách chức.', tag: 'Luật Viên chức' },
      { id: 12, front: 'Hợp đồng làm việc của viên chức được tuyển dụng từ ngày 01/7/2020 trở đi là loại hợp đồng nào?', back: 'HỢP ĐỒNG LÀM VIỆC XÁC ĐỊNH THỜI HẠN (từ 12 tháng đến 60 tháng).\n\n📌 Chỉ có 3 trường hợp được ký Hợp đồng không xác định thời hạn (viên chức tuyển trước 01/7/2020, cán bộ công chức chuyển sang, tuyển dụng ở vùng đặc biệt khó khăn).', tag: 'Luật Viên chức' },
      { id: 13, front: 'Thời hạn xử lý kỷ luật đối với cán bộ, công chức không quá bao nhiêu ngày?', back: 'Không quá 90 NGÀY;\nTrường hợp có tình tiết phức tạp cần kiểm tra, xác minh thêm thì có thể kéo dài nhưng không quá 150 NGÀY.', tag: 'Thời hạn kỷ luật' },
      { id: 14, front: 'Tổ chức nào là cơ quan quyền lực nhà nước cao nhất của nước Cộng hòa XHCN Việt Nam?', back: 'QUỐC HỘI.\n\n📌 Quốc hội thực hiện quyền lập hiến, quyền lập pháp, quyết định các vấn đề quan trọng của đất nước và giám sát tối cao đối với hoạt động của Nhà nước.', tag: 'Hiến pháp 2013' },
      { id: 15, front: 'Nguyên tắc quản lý cán bộ, công chức gồm những nguyên tắc cơ bản nào?', back: '1. Bảo đảm sự lãnh đạo của Đảng Cộng sản Việt Nam.\n2. Kết hợp giữa tiêu chuẩn chức danh, vị trí việc làm và chỉ tiêu biên chế.\n3. Thực hiện nguyên tắc tập trung dân chủ, chế độ thủ trưởng.\n4. Việc sử dụng, đánh giá cán bộ, công chức phải căn cứ vào phẩm chất chính trị, đạo đức và năng lực thi hành công vụ.\n5. Thực hiện bình đẳng giới.', tag: 'Nguyên tắc CBCC' },
      { id: 16, front: 'Công chức 02 năm liên tiếp bị xếp loại chất lượng ở mức "Không hoàn thành nhiệm vụ" thì cơ quan có thẩm quyền xử lý thế nào?', back: 'Giải quyết BUỘC THÔI VIỆC.\n\n📌 Căn cứ: Điểm a Khoản 3 Điều 58 Luật Cán bộ, công chức (sửa đổi 2019).', tag: 'Đánh giá CBCC' },
      { id: 17, front: 'Bộ trưởng, Thủ trưởng cơ quan ngang bộ do ai phê chuẩn bổ nhiệm?', back: 'QUỐC HỘI phê chuẩn theo đề nghị của Thủ tướng Chính phủ; sau đó Chủ tịch nước căn cứ nghị quyết của Quốc hội để ra quyết định bổ nhiệm.', tag: 'Bộ máy Nhà nước' },
      { id: 18, front: 'Văn bản nào sau đây KHÔNG PHẢI là văn bản quy phạm pháp luật: Chỉ thị của Thủ tướng, Nghị quyết của Quốc hội, Quyết định của Chủ tịch nước, Nghị định của Chính phủ?', back: 'CHỈ THỊ CỦA THỦ TƯỚNG CHÍNH PHỦ.\n\n📌 Theo Luật Ban hành văn bản quy phạm pháp luật 2015 (sđbs 2020), Thủ tướng chỉ ban hành Quyết định là văn bản QPPL; Chỉ thị là văn bản chỉ đạo điều hành cá biệt.', tag: 'Văn bản QPPL' },
      { id: 19, front: 'Độ tuổi nghỉ hưu của cán bộ, công chức trong điều kiện lao động bình thường theo Bộ luật Lao động 2019 lộ trình đến năm nào?', back: 'Nam đủ 62 tuổi (vào năm 2028), Nữ đủ 60 tuổi (vào năm 2035).\n\n📌 Mỗi năm tăng thêm 03 tháng đối với lao động nam và 04 tháng đối với lao động nữ.', tag: 'Chế độ chính sách' },
      { id: 20, front: 'Điều kiện miễn phần thi Ngoại ngữ ở Vòng 1 kỳ thi tuyển công chức gồm những trường hợp nào?', back: '1. Có bằng tốt nghiệp đại học, sau đại học chuyên ngành ngoại ngữ.\n2. Có bằng tốt nghiệp đại học, sau đại học do cơ sở đào tạo nước ngoài cấp được công nhận tại VN.\n3. Có chứng chỉ tiếng dân tộc thiểu số dự tuyển vào vùng dân tộc thiểu số.', tag: 'Nghị định 138' }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Thời hiệu xử lý kỷ luật đối với hành vi vi phạm đến mức phải khiển trách của công chức là bao lâu?',
        options: ['A. 12 tháng', 'B. 24 tháng (02 năm)', 'C. 36 tháng', 'D. 60 tháng (05 năm)'],
        correct: 1,
        explanation: 'Căn cứ Khoản 1 Điều 80 Luật CBCC sđbs 2019: Thời hiệu xử lý kỷ luật đối với hành vi khiển trách là 02 năm.'
      },
      {
        id: 2,
        question: 'Cơ quan nào có thẩm quyền ban hành Luật và Hiến pháp?',
        options: ['A. Chính phủ', 'B. Quốc hội', 'C. Tòa án nhân dân tối cao', 'D. Bộ Tư pháp'],
        correct: 1,
        explanation: 'Quốc hội là cơ quan duy nhất có quyền lập hiến và lập pháp, ban hành Hiến pháp và các bộ Luật.'
      },
      {
        id: 3,
        question: 'Hình thức kỷ luật nào sau đây KHÔNG áp dụng đối với công chức giữ chức vụ lãnh đạo, quản lý?',
        options: ['A. Cách chức', 'B. Hạ bậc lương', 'C. Giáng chức', 'D. Cảnh cáo'],
        correct: 1,
        explanation: 'Hạ bậc lương chỉ áp dụng cho công chức không giữ chức vụ lãnh đạo. Công chức lãnh đạo vi phạm sẽ bị giáng chức hoặc cách chức.'
      },
      {
        id: 4,
        question: 'Thời hạn tập sự đối với ngạch Chuyên viên là:',
        options: ['A. 06 tháng', 'B. 09 tháng', 'C. 12 tháng', 'D. 24 tháng'],
        correct: 2,
        explanation: 'Ngạch Chuyên viên (công chức loại C) có thời gian tập sự là 12 tháng.'
      },
      {
        id: 5,
        question: 'Thủ tướng Chính phủ ban hành loại văn bản quy phạm pháp luật nào sau đây?',
        options: ['A. Nghị quyết', 'B. Quyết định', 'C. Thông tư', 'D. Sắc lệnh'],
        correct: 1,
        explanation: 'Theo Luật Ban hành VBQPPL, Thủ tướng Chính phủ ban hành Quyết định là văn bản QPPL.'
      }
    ]
  },

  // =========================================================================
  // 3. FULLSTACK & SYSTEM DESIGN (SENIOR IT PREP - 70 THẺ THỰC CHIẾN)
  // =========================================================================
  {
    id: 'it-frontend-system',
    title: 'Fullstack & System Design Phỏng Vấn Kỹ Thuật IT (Senior Prep)',
    subtitle: 'Bộ bí kíp 70 câu hỏi phỏng vấn kiến trúc Web, React 19, Node.js & Database',
    category: 'it-tech',
    categoryLabel: 'Lập Trình Viên Senior',
    badge: 'Kỹ sư IT #1',
    priceXu: 20,
    originalPriceXu: 50,
    rating: 4.96,
    reviewsCount: 1120,
    studentsCount: 2950,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', 'Cheatsheet System Design', 'Kho 100 Câu Hỏi Coding Interview'],
    description: 'Chinh phục mức lương $1,500 - $3,500+ với bộ flashcard giải mã tận gốc rễ: React Fiber Reconciliation, Closure memory leaks, Event Loop (Microtask vs Macrotask), Sharding Database, B-Tree Indexing, Caching Strategy (Redis), WebSockets, Microservices và bảo mật CORS/XSS/CSRF.',
    highlights: [
      '70 Thẻ Anki phân tích từ nguyên lý gốc đến câu trả lời ăn điểm phỏng vấn',
      'Minh họa trực quan kiến trúc React 19 Compiler, Server Components',
      'Chiến lược thiết kế hệ thống chịu tải hàng triệu request (Scale System)',
      'Bộ câu hỏi phỏng vấn thực tế từ FPT, Viettel, VNG, Shopee, Grab'
    ],
    previewCards: [
      { id: 1, front: 'Sự khác biệt cốt lõi giữa Microtask Queue và Macrotask (Callback) Queue trong JavaScript Event Loop là gì?', back: '• Microtask Queue: Chứa các task của Promise.then/catch, MutationObserver, queueMicrotask, process.nextTick. ĐƯỢC THỰC THI TOÀN BỘ NGAY LẬP TỨC khi call stack rỗng, trước khi chuyển sang render hay macrotask tiếp theo.\n• Macrotask Queue: Chứa setTimeout, setInterval, setImmediate, I/O events. Mỗi vòng lặp (tick) Event Loop chỉ lấy ra duy nhất 1 macrotask.', tag: 'JavaScript Engine' },
      { id: 2, front: 'Khái niệm "Closure" trong JavaScript là gì? Cho ví dụ về Memory Leak do Closure gây ra?', back: 'Closure là khả năng của một hàm con ghi nhớ và truy cập vào phạm vi biến (lexical scope) của hàm cha bao bọc nó ngay cả khi hàm cha đã thực thi xong và thoát khỏi call stack.\n\n⚠️ Gây Memory Leak: Khi hàm con giữ tham chiếu tới một biến lớn (ví dụ mảng nặng hoặc DOM element) và được gán vào biến toàn cục (window) hoặc timer mà không bao giờ được giải phóng GC.', tag: 'JS Core' },
      { id: 3, front: 'React Fiber Architecture giải quyết vấn đề nghẽn cổ chai nào của Virtual DOM cũ (React 15)?', back: 'Giải quyết vấn đề Stack Reconciler đồng bộ (Synchronous).\n\n📌 Ở React 15, khi render cây DOM lớn, luồng chính (Main Thread) bị block hoàn toàn khiến giao diện bị đơ/giật lag.\n💡 React Fiber biến quá trình render thành các khối công việc nhỏ (Work-in-progress units) có thể tạm dừng (pause), hủy bỏ hoặc ưu tiên (prioritize) các tác vụ người dùng nhập liệu (User Input).', tag: 'React Core' },
      { id: 4, front: 'Nguyên lý hoạt động của React 19 Actions và hook useActionState là gì?', back: 'Tự động quản lý vòng đời bất đồng bộ của Form/Mutation:\n• Tự động set pending = true khi bắt đầu async action.\n• Tự động xử lý lỗi (error handling) và reset form.\n• Hỗ trợ Optimistic UI cập nhật giao diện trước khi server phản hồi.', tag: 'React 19' },
      { id: 5, front: 'Chỉ mục B-Tree Index trong cơ sở dữ liệu quan hệ (PostgreSQL, MySQL) tăng tốc truy vấn như thế nào?', back: 'B-Tree lưu trữ dữ liệu theo cấu trúc cây tự cân bằng có thứ tự sắp xếp.\n\n📌 Độ phức tạp tìm kiếm giảm từ O(N) (Full Table Scan) xuống O(log N).\n💡 Rất hiệu quả cho các toán tử so sánh bằng (=), tìm kiếm khoảng (BETWEEN, <, >), và ORDER BY.', tag: 'Database' },
      { id: 6, front: 'Định lý CAP (Brewer\'s Theorem) trong thiết kế hệ thống phân tán phát biểu điều gì?', back: 'Một hệ thống phân tán chỉ có thể đồng thời thỏa mãn tối đa 2 trong 3 yếu tố:\n1. Consistency (Tính nhất quán dữ liệu ở mọi node)\n2. Availability (Tính khả dụng, mọi request đều nhận phản hồi)\n3. Partition Tolerance (Khả năng chịu lỗi khi mất kết nối mạng giữa các node).\n💡 Vì mạng thực tế luôn có khả năng đứt (P), các hệ thống phân tán bắt buộc phải chọn giữa CP (MongoDB, HBase) hoặc AP (Cassandra, DynamoDB).', tag: 'System Design' },
      { id: 7, front: 'Tấn công CSRF (Cross-Site Request Forgery) là gì và các biện pháp phòng chống chuẩn?', back: 'Kẻ tấn công lừa trình duyệt của người dùng gửi yêu cầu trái phép tới một trang web mà người dùng đã đăng nhập (sử dụng cookie tự động đính kèm).\n\n🛡️ Phòng chống:\n1. Cookie SameSite=Lax hoặc Strict.\n2. Sử dụng Anti-CSRF Token trong header/form body.\n3. Kiểm tra Header Origin và Referer.', tag: 'Web Security' },
      { id: 8, front: 'Sự khác biệt giữa cơ chế Caching: Cache-Aside vs Write-Through vs Write-Back?', back: '• Cache-Aside: Ứng dụng tự đọc cache, nếu miss thì đọc DB rồi ghi vào cache. Ghi thẳng vào DB và xóa key cache.\n• Write-Through: Ứng dụng ghi vào cache, cache tự động ghi đồng bộ xuống DB.\n• Write-Back (Write-Behind): Ứng dụng ghi vào cache, cache phản hồi ngay và ghi gom xuống DB sau đó bất đồng bộ (tốc độ cao nhất nhưng có nguy cơ mất data nếu crash).', tag: 'Caching Strategy' },
      { id: 9, front: 'Tại sao không nên dùng index làm key trong danh sách React (map((item, index) => ... ))?', back: 'Khi danh sách bị xóa, thêm vào đầu, hoặc đảo thứ tự, index của các phần tử bị thay đổi vị trí.\n\n📌 Dẫn đến React tái sử dụng nhầm Component State cũ, gây lỗi logic hiển thị input form và làm mất tối ưu hiệu năng của Reconciliation.', tag: 'React Best Practices' },
      { id: 10, front: 'Giao thức HTTP/2 và HTTP/3 khắc phục nhược điểm gì của HTTP/1.1?', back: '• HTTP/2: Hỗ trợ Multiplexing (gửi nhiều request song song trên 1 kết nối TCP), nén Header HPACK, Server Push $\rightarrow$ giải quyết lỗi Head-of-Line Blocking ở tầng ứng dụng.\n• HTTP/3: Chuyển sang dùng giao thức QUIC chạy trên UDP $\rightarrow$ giải quyết triệt để Head-of-Line Blocking ở cả tầng truyền tải (TCP Packet Loss).', tag: 'Network Protocols' },
      { id: 11, front: 'Sự khác nhau giữa SQL (Relational) và NoSQL (Document, Key-Value) khi nào nên chọn loại nào?', back: '• SQL (PostgreSQL, MySQL): Dữ liệu có cấu trúc chặt chẽ (schema), đòi hỏi giao dịch ACID nghiêm ngặt (tài chính, ngân hàng, thương mại điện tử).\n• NoSQL (MongoDB, Redis, Cassandra): Dữ liệu linh hoạt không cố định schema, cần mở rộng ghi phân tán ngang (Horizontal Scale), tốc độ truy xuất cực nhanh (feed mạng xã hội, log, giỏ hàng tạm).', tag: 'Database' },
      { id: 12, front: 'Khái niệm "Debounce" và "Throttle" khác nhau thế nào trong tối ưu hiệu năng UI?', back: '• Debounce: Trì hoãn thực thi hàm cho đến khi người dùng ngừng thao tác trong khoảng thời gian T (thích hợp cho ô tìm kiếm Auto-complete Search).\n• Throttle: Giới hạn tần suất thực thi hàm tối đa 1 lần trong mỗi chu kỳ thời gian T (thích hợp cho sự kiện cuộn Scroll, resize cửa sổ).', tag: 'Frontend Performance' },
      { id: 13, front: 'Nguyên lý cơ bản của kỹ thuật "Database Sharding" là gì?', back: 'Phân chia một bảng dữ liệu khổng lồ thành nhiều phân vùng nhỏ (shards) nằm trên các máy chủ cơ sở dữ liệu vật lý khác nhau dựa trên một Shard Key (ví dụ User_ID % N).\n\n📌 Giúp giải phóng áp lực đọc/ghi cho 1 máy chủ đơn lẻ.', tag: 'System Design' },
      { id: 14, front: 'CORS (Cross-Origin Resource Sharing) là gì? Tại sao Postman gọi API không bị lỗi CORS mà trình duyệt lại bị?', back: 'CORS là cơ chế BẢO MẬT DO CHÍNH TRÌNH DUYỆT THỰC THI (Browser Security Policy) nhằm ngăn chặn mã độc JavaScript ở domain A đọc dữ liệu trái phép từ domain B.\n\n📌 Postman, cURL, server backend không phải là trình duyệt web nên hoàn toàn không bị ràng buộc bởi chính sách Same-Origin Policy này.', tag: 'Web Security' },
      { id: 15, front: 'Khái niệm "Dependency Injection" (DI) trong thiết kế phần mềm giải quyết bài toán gì?', back: 'Là một dạng của Inversion of Control (IoC), tách rời việc khởi tạo phụ thuộc ra khỏi đối tượng sử dụng nó.\n\n📌 Thay vì Class A tự new Class B(), Class B được truyền vào (inject) qua constructor. Giúp code dễ dàng viết Unit Test (mocking) và giảm độ phụ thuộc lỏng (Loose Coupling).', tag: 'Clean Architecture' }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Trong Event Loop của JavaScript, Promise.then() được xếp vào hàng đợi nào?',
        options: ['A. Macrotask Queue', 'B. Microtask Queue', 'C. Render Queue', 'D. Call Stack trực tiếp'],
        correct: 1,
        explanation: 'Promise callback (.then, .catch, .finally) thuộc Microtask Queue, luôn được xử lý trước bất kỳ macrotask nào tiếp theo.'
      },
      {
        id: 2,
        question: 'Định lý CAP chỉ ra rằng hệ thống phân tán KHÔNG THỂ đồng thời đảm bảo 3 yếu tố nào?',
        options: ['A. Concurrency, Atomicity, Performance', 'B. Consistency, Availability, Partition Tolerance', 'C. Cost, Agility, Portability', 'D. Caching, Authentication, Persistence'],
        correct: 1,
        explanation: 'Định lý CAP bao gồm: Consistency (Nhất quán), Availability (Khả dụng) và Partition Tolerance (Chịu phân vùng mạng).'
      },
      {
        id: 3,
        question: 'Hook nào trong React dùng để ghi nhớ giá trị tính toán tốn kém để tránh render lại không cần thiết?',
        options: ['A. useCallback', 'B. useMemo', 'C. useEffect', 'D. useRef'],
        correct: 1,
        explanation: 'useMemo ghi nhớ (memoize) kết quả tính toán giữa các lần re-render.'
      },
      {
        id: 4,
        question: 'Cấu trúc chỉ mục mặc định được sử dụng phổ biến nhất trong MySQL InnoDB và PostgreSQL là gì?',
        options: ['A. Hash Index', 'B. B-Tree Index', 'C. Binary Search Tree', 'D. GiST Index'],
        correct: 1,
        explanation: 'B-Tree Index là cấu trúc mặc định, hỗ trợ cực tốt cho cả tìm kiếm chính xác lẫn khoảng (range query) và sắp xếp.'
      },
      {
        id: 5,
        question: 'Biện pháp nào sau đây giúp ngăn chặn hiệu quả nhất cuộc tấn công CSRF?',
        options: ['A. Sử dụng HTTPS mã hóa SSL', 'B. Thiết lập thuộc tính SameSite cho Cookie và sử dụng Anti-CSRF Token', 'C. Ẩn cổng kết nối database', 'D. Giảm thời gian chờ request'],
        correct: 1,
        explanation: 'SameSite=Lax/Strict ngăn trình duyệt tự động gửi cookie trong request chéo trang, kết hợp Anti-CSRF Token để xác thực nguồn gốc hợp lệ.'
      }
    ]
  },

  // =========================================================================
  // 4. IELTS ACADEMIC 8.0+ MASTER VOCABULARY & COLLOCATIONS (80 THẺ THEO CHỦ ĐỀ)
  // =========================================================================
  {
    id: 'ielts-academic-vocab',
    title: 'IELTS Academic 8.0+ Master Vocab & Collocations (Theo Chủ Đề)',
    subtitle: 'Tổng hợp 80 cụm từ vựng band điểm cao bứt phá Writing Task 2 & Speaking',
    category: 'ngoai-ngu',
    categoryLabel: 'IELTS Band 8.0+',
    badge: 'Ngoại ngữ hot #1',
    priceXu: 20,
    originalPriceXu: 55,
    rating: 4.97,
    reviewsCount: 1540,
    studentsCount: 3600,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', 'Audio Phát Âm Chuẩn IPA', 'Sổ Tay 50 Bài Mẫu Band 8.5'],
    description: 'Nâng tầm bài viết Writing Task 2 và bài thi Speaking với 80 cụm Collocations học thuật tự nhiên, phân theo các chủ đề nóng: Môi trường (Environment), Công nghệ (Technology), Kinh tế & Xã hội (Economy & Society), Giáo dục (Education), Tội phạm & Luật pháp (Crime & Law).',
    highlights: [
      '80 Thẻ Anki chuẩn hóa ngữ cảnh Cambridge, phiên âm IPA, từ đồng nghĩa',
      'Định dạng câu hỏi 2 mặt kiểm tra phản xạ từ vựng tiếng Anh trong 3 giây',
      'Không dạy từ đơn lẻ, tập trung 100% vào cụm từ (Collocations C1-C2)',
      'Ví dụ minh họa được trích xuất từ các bài luận mẫu đạt Band 8.0 - 9.0'
    ],
    previewCards: [
      { id: 1, front: 'anthropogenic /ˌæn.θrə.pəˈdʒen.ɪk/ (adj)', back: 'Nghĩa: Do con người gây ra (đặc biệt là ô nhiễm, biến đổi khí hậu).\n\n📌 Cụm từ hay: Anthropogenic climate change (Biến đổi khí hậu nhân tạo).\n📝 Ví dụ: Scientists agree that the current warming trend is predominantly anthropogenic.\n💡 Từ đồng nghĩa: Human-induced, man-made.', tag: 'Environment' },
      { id: 2, front: 'mitigate /ˈmɪt.ɪ.ɡeɪt/ (verb)', back: 'Nghĩa: Giảm nhẹ, làm dịu bớt mức độ nghiêm trọng của hậu quả tiêu cực.\n\n📌 Cụm từ hay: Mitigate the adverse effects / Mitigate environmental degradation.\n📝 Ví dụ: Governments must adopt renewable energy to mitigate the impact of greenhouse emissions.\n💡 Từ đồng nghĩa: Alleviate, lessen, attenuate.', tag: 'Environment & Policy' },
      { id: 3, front: 'ubiquitous /juːˈbɪk.wɪ.təs/ (adj)', back: 'Nghĩa: Có mặt ở khắp mọi nơi cùng một lúc (omnipresent, phổ biến rộng khắp).\n\n📌 Cụm từ hay: The ubiquitous presence of smartphones.\n📝 Ví dụ: Digital technology has become ubiquitous in the daily lives of contemporary citizens.', tag: 'Technology' },
      { id: 4, front: 'paradigm shift /ˈpær.ə.daɪm ʃɪft/ (noun)', back: 'Nghĩa: Một sự thay đổi mang tính bước ngoặt, căn bản trong quan niệm hoặc phương thức tiếp cận.\n\n📝 Ví dụ: The advent of generative artificial intelligence represents a paradigm shift in higher education.', tag: 'Science & Tech' },
      { id: 5, front: 'socio-economic disparity /ˌsoʊ.si.oʊˌek.əˈnɑː.mɪk dɪˈspær.ə.t̬i/ (noun)', back: 'Nghĩa: Sự chênh lệch, bất bình đẳng về kinh tế - xã hội.\n\n📝 Ví dụ: The widening socio-economic disparity between urban and rural regions remains a major impediment to national prosperity.', tag: 'Society & Economy' },
      { id: 6, front: 'deterrent effect /dɪˈter.ənt ɪˈfekt/ (noun phrase)', back: 'Nghĩa: Tác dụng răn đe, ngăn ngừa hành vi phạm tội.\n\n📝 Ví dụ: Heavy fines and strict policing have a powerful deterrent effect against white-collar crimes.', tag: 'Crime & Law' },
      { id: 7, front: 'detrimental to /ˌdet.rɪˈmen.təl/ (adj + prep)', back: 'Nghĩa: Có hại, gây tổn hại nghiêm trọng đến điều gì.\n\n📌 Cụm từ hay: Detrimental to physical health / Detrimental to intellectual development.\n📝 Ví dụ: Excessive consumption of social media is distinctly detrimental to children\'s cognitive focus.\n💡 Từ trái nghĩa: Beneficial to.', tag: 'Health & Youth' },
      { id: 8, front: 'foster /ˈfɑː.stɚ/ (verb)', back: 'Nghĩa: Khuyến khích, nuôi dưỡng, thúc đẩy sự phát triển của một phẩm chất tích cực.\n\n📌 Cụm từ hay: Foster critical thinking / Foster creativity / Foster social cohesion.\n📝 Ví dụ: Modern schools ought to foster critical thinking rather than mere rote memorization.', tag: 'Education' },
      { id: 9, front: 'exacerbate /ɪɡˈzæs.ɚ.beɪt/ (verb)', back: 'Nghĩa: Làm trầm trọng thêm, làm xấu đi một tình trạng vốn đã tồi tệ.\n\n📌 Cụm từ hay: Exacerbate traffic congestion / Exacerbate poverty.\n📝 Ví dụ: The economic crisis was exacerbated by uncontrolled inflation and supply chain disruptions.\n💡 Từ trái nghĩa: Ameliorate, improve.', tag: 'Problems & Solutions' },
      { id: 10, front: 'proponent /prəˈpoʊ.nənt/ (noun)', back: 'Nghĩa: Người ủng hộ, người tán thành một quan điểm hoặc chính sách.\n\n📝 Ví dụ: Proponents of remote working argue that it significantly boosts work-life balance and job satisfaction.\n💡 Từ trái nghĩa: Opponent (người phản đối).', tag: 'Academic Discussion' },
      { id: 11, front: 'curb /kɝːb/ (verb)', back: 'Nghĩa: Kiểm soát, kiềm chế, hạn chế điều gì đó không mong muốn.\n\n📌 Cụm từ hay: Curb carbon emissions / Curb expenditure / Curb violent behavior.\n📝 Ví dụ: Urgent legislative measures are required to curb plastic consumption.', tag: 'Policy' },
      { id: 12, front: 'pragmatic /præɡˈmæt.ɪk/ (adj)', back: 'Nghĩa: Thực tế, thực dụng, dựa trên tính khả thi thay vì lý thuyết viển vông.\n\n📝 Ví dụ: We need a pragmatic approach to renewable energy transition rather than hasty ideological bans.\n💡 Từ trái nghĩa: Idealistic.', tag: 'Tone & Style' },
      { id: 13, front: 'pave the way for (idiomatic phrase)', back: 'Nghĩa: Mở đường cho, tạo điều kiện thuận lợi cho điều gì xảy ra.\n\n📝 Ví dụ: Early childhood education paves the way for lifelong academic and professional achievement.', tag: 'Development' },
      { id: 14, front: 'homogenization /həˌmɑː.dʒə.nəˈzeɪ.ʃən/ (noun)', back: 'Nghĩa: Sự đồng nhất hóa, sự xóa nhòa bản sắc văn hóa riêng biệt.\n\n📌 Cụm từ hay: Cultural homogenization.\n📝 Ví dụ: Globalization has raised concerns regarding the cultural homogenization of indigenous communities.', tag: 'Culture' },
      { id: 15, front: 'indispensable /ˌɪn.dɪˈspen.sə.bəl/ (adj)', back: 'Nghĩa: Không thể thiếu được, thiết yếu tuyệt đối.\n\n📌 Cụm từ hay: An indispensable tool / An indispensable component.\n📝 Ví dụ: Critical thinking is an indispensable asset for university students in the information age.', tag: 'Importance' }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Từ nào sau đây mang nghĩa "do con người gây ra" (đặc biệt trong chủ đề biến đổi khí hậu)?',
        options: ['A. Atmospheric', 'B. Anthropogenic', 'C. Aerodynamic', 'D. Autonomous'],
        correct: 1,
        explanation: 'Anthropogenic xuất phát từ gốc Hy Lạp "anthropos" (con người) + "genes" (nguồn gốc), nghĩa là do hoạt động của con người tạo nên.'
      },
      {
        id: 2,
        question: 'Chọn từ đồng nghĩa với "exacerbate" (làm trầm trọng thêm):',
        options: ['A. Alleviate', 'B. Worsen', 'C. Ameliorate', 'D. Rejuvenate'],
        correct: 1,
        explanation: 'Exacerbate có nghĩa là làm xấu đi, làm trầm trọng thêm (worsen).'
      },
      {
        id: 3,
        question: 'Điền từ thích hợp vào chỗ trống: "The government took strict measures to ______ rising carbon emissions."',
        options: ['A. foster', 'B. curb', 'C. proliferate', 'D. cultivate'],
        correct: 1,
        explanation: 'Curb có nghĩa là kiềm chế, kìm hãm (curb emissions = kiềm chế lượng khí thải).'
      },
      {
        id: 4,
        question: '"Paradigm shift" được hiểu là gì trong ngữ cảnh học thuật?',
        options: ['A. Một sự thay đổi nhỏ về hình thức', 'B. Một sự chuyển dịch mang tính bước ngoặt, căn bản trong tư duy', 'C. Sự trì trệ trong khoa học', 'D. Một sự dịch chuyển địa lý'],
        correct: 1,
        explanation: 'Paradigm shift là sự thay đổi mô thức căn bản, bước ngoặt mang tính cách mạng trong một lĩnh vực.'
      },
      {
        id: 5,
        question: 'Cụm từ "foster critical thinking" có nghĩa là gì?',
        options: ['A. Phê phán lối suy nghĩ độc lập', 'B. Nuôi dưỡng và phát triển tư duy phản biện', 'C. Hạn chế khả năng tư duy sáng tạo', 'D. Đánh giá kết quả thi cử'],
        correct: 1,
        explanation: 'Foster có nghĩa là nuôi dưỡng, ươm mầm, thúc đẩy (nuôi dưỡng tư duy phản biện).'
      }
    ]
  },

  // =========================================================================
  // 5. JLPT N3-N2 TRỌNG ĐIỂM KANJI & NGỮ PHÁP THỰC CHIẾN (65 THẺ)
  // =========================================================================
  {
    id: 'jlpt-n3-n2-kanji',
    title: 'JLPT N3-N2 Trọng Điểm Kanji & Ngữ Pháp Thực Chiến',
    subtitle: '65 Chữ Hán bẫy âm On/Kun và mẫu câu ngữ pháp điểm liệt kỳ thi JLPT',
    category: 'ngoai-ngu',
    categoryLabel: 'Tiếng Nhật JLPT N3-N2',
    badge: 'JLPT Chuẩn #1',
    priceXu: 18,
    originalPriceXu: 45,
    rating: 4.94,
    reviewsCount: 980,
    studentsCount: 2210,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', 'Bảng Bộ Thủ 214 Chữ', 'Tổng Hợp Ngữ Pháp N2 Điểm Liệt'],
    description: 'Bí kíp chinh phục Kanji và Dokkai JLPT N3 - N2. Phân tích chi tiết từng chữ Hán theo bộ thủ, âm Hán Việt, âm On, âm Kun và các từ ghép thông dụng nhất; kèm theo các mẫu ngữ pháp dễ nhầm lẫn.',
    highlights: [
      '65 Thẻ Anki chữ Hán bẫy âm và mẫu câu ngữ pháp then chốt N3 - N2',
      'Âm Hán Việt chuẩn xác giúp người Việt suy luận nghĩa nhanh như gió',
      'Đầy đủ ví dụ thực tế trích từ đề thi JLPT chính thức các năm gần nhất',
      'Ghi nhớ quy tắc chuyển âm On-On giúp thuộc 1 chữ biết thêm 10 chữ'
    ],
    previewCards: [
      { id: 1, front: '【Kanji】 構 (Hán Việt: CẤU)', back: 'Âm On: コウ (kou) | Âm Kun: かま・える, かま・う\nNghĩa: Cấu tạo, cấu thành, bận tâm.\n\n📌 Bộ thủ: Mộc (木) + Cấu (冓: đan chéo các thanh gỗ).\n📝 Từ vựng thi JLPT:\n• 構成 (こうせい): Cấu thành, cơ cấu.\n• 構造 (こうぞう): Cấu trúc.\n• 構わない (かまわない): Không sao, không bận tâm.', tag: 'Kanji N2' },
      { id: 2, front: '【Ngữ pháp】 ～にほかならない (~ ni hoka naranai)', back: 'Ý nghĩa: Chính là..., Không gì khác hơn là... (dùng để khẳng định lý do cốt lõi duy nhất).\n\n📌 Cấu trúc: N + にほかならない\n📝 Ví dụ: 今回の成功は、チーム全員の努力の結果にほかならない。\n(Thành công lần này chính là kết quả từ nỗ lực của toàn bộ thành viên trong đội).', tag: 'Ngữ Pháp N2' },
      { id: 3, front: '【Kanji】 慎 (Hán Việt: THẬN)', back: 'Âm On: シン (shin) | Âm Kun: つつし・む\nNghĩa: Cẩn thận, thận trọng, dè dặt.\n\n📝 Từ vựng thi JLPT:\n• 慎重 (しんちょう): Thận trọng (từ vựng N2 rất hay bẫy âm).\n• 慎む (つつしむ): Cẩn trọng lời ăn tiếng nói, kiềm chế.', tag: 'Kanji N2' },
      { id: 4, front: '【Ngữ pháp】 ～わけがない (~ wake ga nai)', back: 'Ý nghĩa: Tuyệt đối không thể có chuyện..., Làm sao mà... được (phủ định hoàn toàn dựa trên căn cứ rõ ràng).\n\n📌 Cấu trúc: V(thể thường) / A-i / A-na / N-no + わけがない\n📝 Ví dụ: あの真面目な彼が、嘘をつくわけがない。\n(Người nghiêm túc như anh ấy làm sao mà nói dối được!).', tag: 'Ngữ Pháp N3' },
      { id: 5, front: '【Kanji】 補 (Hán Việt: BỔ)', back: 'Âm On: ホ (ho) | Âm Kun: おぎな・う\nNghĩa: Bổ sung, đền bù, phụ tá.\n\n📝 Từ vựng thi JLPT:\n• 補充 (ほじゅう): Bổ sung thêm cho đủ.\n• 補償 (ほしょう): Đền bù, bồi thường.\n• 補う (おぎなう): Bù đắp (thiếu sót, lỗ hổng).', tag: 'Kanji N3' },
      { id: 6, front: '【Ngữ pháp】 ～に違いない (~ ni chigainai)', back: 'Ý nghĩa: Chắc chắn là..., Nhất định là... (phán đoán chủ quan với độ tin cậy cực cao).\n\n📌 Cấu trúc: V/A/N (thể thường, bỏ da) + に違いない\n📝 Ví dụ: 明かりがついているから、彼は家にいるに違いない。\n(Đèn đang sáng nên chắc chắn anh ấy đang ở nhà).', tag: 'Ngữ Pháp N3' },
      { id: 7, front: '【Kanji】 訪 (Hán Việt: PHÓNG / PHỎNG)', back: 'Âm On: ホウ (hou) | Âm Kun: おとず・れる, たず・ねる\nNghĩa: Thăm viếng, ghé thăm.\n\n📝 Từ vựng thi JLPT:\n• 訪問 (ほうもん): Cuộc viếng thăm, đến thăm công ty.\n• 訪れる (おとずれる): Ghé thăm (địa điểm, mùa xuân đến).', tag: 'Kanji N3' },
      { id: 8, front: '【Ngữ pháp】 ～をめぐって (~ wo megutte)', back: 'Ý nghĩa: Xoay quanh vấn đề... (thường có nhiều ý kiến tranh cãi, tranh chấp đối lập).\n\n📌 Cấu trúc: N + をめぐって / をめぐる + N\n📝 Ví dụ: 遺産の相続をめぐって、兄弟の間で激しい争いが起きた。\n(Xoay quanh việc thừa kế tài sản, giữa anh em đã xảy ra tranh chấp gay gắt).', tag: 'Ngữ Pháp N2' },
      { id: 9, front: '【Kanji】 貿 (Hán Việt: MẬU)', back: 'Âm On: ボウ (bou) | Âm Kun: (không có)\nNghĩa: Mậu dịch, buôn bán trao đổi hàng hóa.\n\n📌 Bộ thủ: Bối (貝: vỏ sò tiền bạc).\n📝 Từ vựng thi JLPT:\n• 貿易 (ぼうえき): Mậu dịch, thương mại quốc tế.\n⚠️ Bẫy âm: Đọc là ぼうえき (boueki), không đọc là ぼうび.', tag: 'Kanji N3' },
      { id: 10, front: '【Ngữ pháp】 ～ばかりか (~ bakari ka)', back: 'Ý nghĩa: Không chỉ... mà còn... (vế sau mức độ còn nặng hơn vế trước).\n\n📌 Cấu trúc: V/A/N + ばかりか (hoặc ばかりでなく)\n📝 Ví dụ: 彼は英語ばかりか、中国語も流暢に話せる。\n(Anh ấy không chỉ tiếng Anh mà còn nói trôi chảy cả tiếng Trung).', tag: 'Ngữ Pháp N2' }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Chọn cách đọc Hiragana đúng của từ 「慎重」 (THẬN TRỌNG):',
        options: ['A. しんちょう (Shinchou)', 'B. じんちょう (Jinchou)', 'C. しんじゅう (Shinjuu)', 'D. せんちょう (Senchou)'],
        correct: 0,
        explanation: '慎 (Thận) đọc là しん (shin), 重 (Trọng) đọc là ちょう (chou) $\rightarrow$ しんちょう (cẩn thận, thận trọng).'
      },
      {
        id: 2,
        question: 'Mẫu ngữ pháp nào mang ý nghĩa "Chắc chắn là..., Nhất định là..."?',
        options: ['A. ～に違いない', 'B. ～かもしれない', 'C. ～はずがない', 'D. ～わけではない'],
        correct: 0,
        explanation: '～に違いない biểu thị phán đoán quả quyết của người nói: chắc chắn là.'
      },
      {
        id: 3,
        question: 'Kanji 「構」 trong từ 「構成」 có âm On đọc là gì?',
        options: ['A. コウ (kou)', 'B. カン (kan)', 'C. キョウ (kyou)', 'D. ゴウ (gou)'],
        correct: 0,
        explanation: '構 có âm On là コウ (kou) $\rightarrow$ 構成 (こうせい: cấu thành).'
      },
      {
        id: 4,
        question: 'Chọn mẫu ngữ pháp thích hợp điền vào chỗ trống: "今回の成功は努力の結果______。"',
        options: ['A. にほかならない', 'B. に限らない', 'C. にすぎない', 'D. に基づいて'],
        correct: 0,
        explanation: 'にほかならない có nghĩa là "chính là, không gì khác hơn là" nhấn mạnh nguyên nhân duy nhất.'
      },
      {
        id: 5,
        question: 'Từ 「貿易」 (Mậu Dịch) có cách đọc chuẩn xác là:',
        options: ['A. ぼうえき (Boueki)', 'B. もうえき (Moueki)', 'C. ぼうやく (Bouyaku)', 'D. ぶえき (Bueki)'],
        correct: 0,
        explanation: '貿 đọc là ぼう, 易 đọc là えき $\rightarrow$ ぼうえき (Thương mại quốc tế).'
      }
    ]
  },

  // =========================================================================
  // 6. THUẬT NGỮ Y KHOA & DƯỢC LÝ CĂN BẢN (55 THẺ CHUẨN LÂM SÀNG)
  // =========================================================================
  {
    id: 'medical-terminology-core',
    title: 'Thuật Ngữ Y Khoa & Dược Lý Căn Bản (Medical Terminology)',
    subtitle: 'Bí kíp giải mã tiền tố, hậu tố giải phẫu học và nhóm thuốc điều trị lâm sàng',
    category: 'y-duoc',
    categoryLabel: 'Y Dược & Sức Khỏe',
    badge: 'Chuyên ngành Y #1',
    priceXu: 22,
    originalPriceXu: 60,
    rating: 4.98,
    reviewsCount: 740,
    studentsCount: 1890,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', 'Sơ Đồ Giải Phẫu 3D', 'Bảng Tra Cứu Tương Tác Thuốc'],
    description: 'Học một biết mười với phương pháp ghép gốc từ (Root Word), tiền tố (Prefix) và hậu tố (Suffix) tiếng Anh y khoa quốc tế. Phân loại chuẩn xác các nhóm thuốc tim mạch, kháng sinh, giảm đau kháng viêm NSAIDs và cơ chế tác dụng sinh học.',
    highlights: [
      '55 Thẻ Anki chuẩn hóa gốc từ giải phẫu và dược lý lâm sàng',
      'Công thức ghép từ thần tốc giải mã hàng ngàn bệnh học phức tạp',
      'Đầy đủ bảng phân loại kháng sinh Beta-lactam, Macrolide, Quinolone',
      'Hỗ trợ đắc lực sinh viên Y Đa Khoa, Dược Sĩ và Điều Dưỡng'
    ],
    previewCards: [
      { id: 1, front: 'Tiền tố "Brady-" và "Tachy-" trong thuật ngữ y khoa có nghĩa là gì?', back: '• Brady-: Chậm (Slow) $\rightarrow$ Ví dụ: Bradycardia (Nhịp tim chậm, dưới 60 nhịp/phút).\n• Tachy-: Nhanh (Fast) $\rightarrow$ Ví dụ: Tachycardia (Nhịp tim nhanh, trên 100 nhịp/phút).', tag: 'Tiền tố Y khoa' },
      { id: 2, front: 'Hậu tố "-itis" và "-ectomy" biểu thị điều gì trong y học?', back: '• -itis: Tình trạng viêm nhiễm (Inflammation) $\rightarrow$ Ví dụ: Hepatitis (Viêm gan), Appendicitis (Viêm ruột thừa).\n• -ectomy: Phẫu thuật cắt bỏ (Surgical removal) $\rightarrow$ Ví dụ: Appendectomy (Phẫu thuật cắt ruột thừa).', tag: 'Hậu tố Y khoa' },
      { id: 3, front: 'Cơ chế tác dụng dược lý của nhóm thuốc kháng sinh Beta-lactam (Penicillin, Cephalosporin) là gì?', back: 'Ức chế enzym Transpeptidase (PBP - Penicillin Binding Protein), ngăn cản quá trình tổng hợp vách tế bào vi khuẩn (Peptidoglycan), làm vi khuẩn bị ly giải và tiêu diệt.\n\n⚠️ Vi khuẩn kháng thuốc bằng cách tiết enzym Beta-lactamase phá vỡ vòng beta-lactam.', tag: 'Dược lý' },
      { id: 4, front: 'Hậu tố "-oma" và "-pathy" chỉ trạng thái bệnh lý nào?', back: '• -oma: Khối u (Tumor/Neoplasm) $\rightarrow$ Ví dụ: Carcinoma (U biểu mô ác tính), Adenoma (U tuyến lành tính).\n• -pathy: Tình trạng bệnh lý nói chung (Disease) $\rightarrow$ Ví dụ: Cardiomyopathy (Bệnh cơ tim), Neuropathy (Bệnh lý thần kinh).', tag: 'Bệnh học' },
      { id: 5, front: 'Thuốc kháng viêm không steroid (NSAIDs như Ibuprofen, Aspirin) có cơ chế tác dụng chính là gì?', back: 'Ức chế enzyme Cyclooxygenase (COX-1 và COX-2), ngăn chặn quá trình chuyển đổi Acid Arachidonic thành Prostaglandin (chất trung gian hóa học gây viêm, đau và sốt).\n\n⚠️ Tác dụng phụ: Loét dạ dày do ức chế COX-1 bảo vệ niêm mạc.', tag: 'Dược lý lâm sàng' }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Tiền tố "Brady-" trong thuật ngữ y khoa biểu thị điều gì?',
        options: ['A. Nhanh', 'B. Chậm', 'C. Đau', 'D. Giãn'],
        correct: 1,
        explanation: 'Brady- có nghĩa là chậm, ví dụ Bradycardia (nhịp tim chậm).'
      },
      {
        id: 2,
        question: 'Hậu tố "-ectomy" có nghĩa là gì?',
        options: ['A. Rạch mở', 'B. Cắt bỏ bằng phẫu thuật', 'C. Soi trực tiếp', 'D. Khâu phục hồi'],
        correct: 1,
        explanation: '-ectomy biểu thị việc phẫu thuật cắt bỏ một cơ quan/bộ phận (ví dụ Appendectomy là phẫu thuật cắt ruột thừa).'
      }
    ]
  },

  // =========================================================================
  // 7. CFA LEVEL 1 & TÀI CHÍNH DOANH NGHIỆP TINH GỌN (50 THẺ)
  // =========================================================================
  {
    id: 'finance-cfa-level1',
    title: 'CFA Level 1 & Phân Tích Báo Cáo Tài Chính Doanh Nghiệp',
    subtitle: '50 Khái niệm then chốt về định giá tài sản, TVM, WACC và mô hình DuPont',
    category: 'tai-chinh',
    categoryLabel: 'Tài Chính & Đầu Tư',
    badge: 'CFA Core #1',
    priceXu: 20,
    originalPriceXu: 55,
    rating: 4.96,
    reviewsCount: 810,
    studentsCount: 2040,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', 'Bảng Công Thức Excel Tự Động', 'Sơ Đồ Báo Cáo Tài Chính'],
    description: 'Nắm vững nền tảng phân tích tài chính doanh nghiệp và chứng chỉ CFA Level 1: Giá trị thời gian của tiền (TVM), Định giá dòng tiền chiết khấu (DCF), Chỉ số WACC, Mô hình DuPont phân tích ROE, Phân biệt dòng tiền CFO vs CFI vs CFF.',
    highlights: [
      '50 Thẻ Anki công thức định giá và phân tích báo cáo tài chính chuẩn mực',
      'Phân rã mô hình DuPont 3 bước tìm ra động lực tăng trưởng cốt lõi của doanh nghiệp',
      'Phân biệt rành mạch dòng tiền kinh doanh (CFO), đầu tư (CFI) và tài chính (CFF)',
      'Bài tập thực hành định giá cổ phiếu P/E, EV/EBITDA thực tế'
    ],
    previewCards: [
      { id: 1, front: 'Nguyên lý "Time Value of Money" (TVM - Giá trị thời gian của tiền) là gì?', back: 'Một đồng tiền ngày hôm nay có giá trị lớn hơn một đồng tiền trong tương lai.\n\n📌 Lý do: Khả năng sinh lời tiềm năng (lãi suất), chi phí cơ hội và rủi ro lạm phát làm xói mòn sức mua.', tag: 'TVM Core' },
      { id: 2, front: 'Công thức mô hình DuPont 3 bước phân rã tỷ suất sinh lời trên vốn chủ sở hữu (ROE) là gì?', back: 'ROE = Net Profit Margin × Asset Turnover × Financial Leverage\n\nTrong đó:\n1. Net Profit Margin = Lợi nhuận ròng / Doanh thu (Hiệu quả hoạt động)\n2. Asset Turnover = Doanh thu / Tổng tài sản (Hiệu quả sử dụng tài sản)\n3. Financial Leverage (Equity Multiplier) = Tổng tài sản / Vốn chủ sở hữu (Đòn bẩy tài chính).', tag: 'DuPont Analysis' },
      { id: 3, front: 'Chỉ số WACC (Weighted Average Cost of Capital - Chi phí sử dụng vốn bình quân) dùng để làm gì?', back: 'Là tỷ suất sinh lời tối thiểu mà doanh nghiệp cần tạo ra để làm hài lòng cả chủ nợ (chủ nợ nhận lãi vay) và cổ đông (cổ đông nhận cổ tức & thặng dư vốn).\n\n📌 Thường được sử dụng làm Tỷ lệ chiết khấu (Discount Rate) trong mô hình định giá DCF.', tag: 'Corporate Finance' },
      { id: 4, front: 'Báo cáo lưu chuyển tiền tệ (Cash Flow Statement) chia thành 3 dòng tiền nào?', back: '1. CFO (Cash Flow from Operating Activities): Dòng tiền từ hoạt động kinh doanh cốt lõi.\n2. CFI (Cash Flow from Investing Activities): Dòng tiền từ mua sắm/thanh lý tài sản cố định (Capex) hoặc đầu tư tài chính.\n3. CFF (Cash Flow from Financing Activities): Dòng tiền từ phát hành/mua lại cổ phiếu, vay nợ và chi trả cổ tức.', tag: 'Báo cáo tài chính' },
      { id: 5, front: 'Sự khác nhau giữa chỉ số P/E (Price to Earnings) và EV/EBITDA trong định giá doanh nghiệp là gì?', back: '• P/E: Đo lường giá trị vốn cổ phần (Equity Value) so với lợi nhuận ròng thuộc về cổ đông. Bị ảnh hưởng bởi đòn bẩy nợ và thuế.\n• EV/EBITDA: Đo lường giá trị toàn bộ doanh nghiệp (Enterprise Value) so với dòng tiền hoạt động trước lãi vay, thuế và khấu hao. Không bị méo mó bởi cơ cấu nợ và chính sách khấu hao.', tag: 'Valuation' }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Trong mô hình phân rã DuPont 3 yếu tố, ROE bằng tích của những thành phần nào?',
        options: [
          'A. Biên lợi nhuận ròng × Vòng quay tài sản × Đòn bẩy tài chính',
          'B. Doanh thu × Chi phí × Lợi nhuận',
          'C. Giá trị sổ sách × Giá thị trường × Cổ tức',
          'D. Lợi nhuận gộp × Thuế suất × Khấu hao'
        ],
        correct: 0,
        explanation: 'ROE = (Lợi nhuận ròng/Doanh thu) × (Doanh thu/Tài sản) × (Tài sản/Vốn chủ sở hữu).'
      },
      {
        id: 2,
        question: 'Tiền chi trả cổ tức cho cổ đông được hạch toán vào dòng tiền nào trong Báo cáo lưu chuyển tiền tệ (theo chuẩn US GAAP)?',
        options: ['A. Dòng tiền hoạt động kinh doanh (CFO)', 'B. Dòng tiền hoạt động đầu tư (CFI)', 'C. Dòng tiền hoạt động tài chính (CFF)', 'D. Doanh thu tài chính'],
        correct: 2,
        explanation: 'Cổ tức chi trả thuộc hoạt động tài chính (CFF - Cash Flow from Financing Activities).'
      }
    ]
  }
];

export const COMBO_PACKAGE = {
  id: 'combo-all-access',
  title: 'COMBO VIP: Mở Khóa Trọn Đời Toàn Bộ Kho Tài Liệu & Flashcard Beta',
  subtitle: 'Sở hữu toàn bộ 7+ kho tài liệu Game 3D, Công Chức, IT, Ngoại Ngữ, Y Dược, Tài Chính + Cập nhật miễn phí',
  originalPriceXu: 390,
  priceXu: 69,
  discountPercent: 82,
  badge: 'Tiết kiệm 82% 🔥',
  features: [
    'Toàn bộ 7 bộ tài liệu Flashcard Anki (.apkg) với hơn 450+ thẻ thực chiến',
    'Toàn bộ 120+ câu trắc nghiệm thi thử có bấm giờ và giải thích chi tiết',
    'Tải không giới hạn file PDF sơ đồ tư duy, ebook và cheatsheet',
    'Học online trực tiếp trên trình duyệt web với trình giả lập Flashcard 3D',
    'Quyền truy cập vĩnh viễn và nhận cập nhật trọn đời cho kỳ thi 2026-2027',
    'Hỗ trợ kỹ thuật 1-1 trực tuyến khi đồng bộ Anki trên điện thoại / máy tính'
  ]
};

export const TESTIMONIALS = [
  {
    name: 'Nguyễn Văn Hùng',
    role: 'Đỗ Chuyên viên - Sở Kế hoạch & Đầu tư',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    content: 'Bộ Flashcard Kiến thức chung công chức thực sự cứu cánh cho mình. Trước đó đọc Luật khô khan không sao nhớ nổi mấy con số thời hạn kỷ luật, vậy mà cày thẻ Anki 2 tuần là nhớ như in. Vòng 1 mình đạt 56/60 câu!',
    badge: 'Đỗ Thủ Khoa Khối Sở 2025'
  },
  {
    name: 'Trần Minh Tuấn',
    role: 'Senior Fullstack Engineer tại VNG',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    content: 'Bộ phỏng vấn Fullstack và System design quá đỉnh! Hỏi đúng phần Event Loop microtask, React Fiber và Index B-Tree, mình trả lời mạch lạc và đỗ ngay vị trí Senior với đãi ngộ rất cao.',
    badge: 'Pass Offer $2,500'
  },
  {
    name: 'Lê Thuỳ Linh',
    role: 'IELTS Overall 8.0 (Writing 7.5)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    content: 'Từ vựng Collocations học thuật C1-C2 dùng được ngay vào Writing Task 2. Giao diện lật thẻ 3D trên web cực kỳ mượt mà, âm thanh vui tai tạo động lực học mỗi ngày!',
    badge: 'Tăng 1.5 Band sau 1 tháng'
  }
];

export const FAQS = [
  {
    q: 'Làm thế nào để mở khóa và học các bộ thẻ Flashcard?',
    a: 'Nền tảng sử dụng Tiền Xu (Xu) tiện lợi. Bạn chỉ cần nạp Xu vào ví (hoặc nhận Xu miễn phí qua điểm danh hàng ngày, mở túi mù tri thức, làm nhiệm vụ học tập), sau đó 1 chạm mở khóa vĩnh viễn bộ thẻ bạn cần. Tài liệu được lưu vĩnh viễn trong Tủ Tài Liệu của bạn.'
  },
  {
    q: 'File .apkg là gì và làm sao để nhập vào điện thoại hoặc máy tính?',
    a: 'File .apkg là định dạng chuẩn của phần mềm học lặp lại ngắt quãng Anki (phần mềm miễn phí số 1 thế giới). Bạn chỉ cần cài app AnkiDroid (Android) hoặc AnkiMobile (iOS) hoặc Anki trên máy tính, sau đó chạm vào file tải về là toàn bộ thẻ tự động nạp vào học ngay.'
  },
  {
    q: 'Tôi không muốn cài app thì có học trực tiếp trên web được không?',
    a: 'Được 100%! ÔnThiHub tích hợp sẵn trình giả lập Flashcard 3D và phòng thi trắc nghiệm bấm giờ ngay trên web. Bạn có thể mở bằng điện thoại hoặc máy tính để học mọi lúc mọi nơi.'
  },
  {
    q: 'Ví Xu có an toàn không? Có hỗ trợ nếu gặp lỗi không?',
    a: 'Hệ thống lưu trữ số dư ví minh bạch trên thiết bị và đồng bộ tài khoản. Khi cần thêm Xu, bạn có thể nạp nhanh qua cổng VietQR tự động. Mọi thắc mắc đều được hệ thống hỗ trợ 24/7 trong vòng ít phút.'
  }
];
