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
      {
            "id": 1,
            "front": "Nhân vật Mario lần đầu tiên xuất hiện trong tựa game nào và với tên gọi ban đầu là gì?",
            "back": "Game Donkey Kong (1981) trên máy thùng Arcade, dưới tên gọi ban đầu là \"Jumpman\".\n\n📌 Sau đó được đổi tên thành Mario theo tên ông Mario Segale - chủ khu nhà xưởng mà Nintendo thuê tại Mỹ.",
            "tag": "Lịch sử Mario"
      },
      {
            "id": 2,
            "front": "Ai là \"cha đẻ\" sáng tạo ra Super Mario và Zelda?",
            "back": "Huyền thoại Shigeru Miyamoto.\n\n💡 Ông gia nhập Nintendo với vai trò nghệ sĩ thiết kế đồ họa và đã cứu vớt cả ngành công nghiệp game sau đợt khủng hoảng Video Game Crash 1983.",
            "tag": "Nhân vật"
      },
      {
            "id": 3,
            "front": "Triết lý thiết kế màn chơi 4 bước \"Kishōtenketsu\" (Khởi - Thừa - Chuyển - Hợp) trong Mario hoạt động ra sao?",
            "back": "Gồm 4 giai đoạn:\n1. Khởi (Introduction): Cho người chơi tiếp xúc cơ chế mới ở môi trường an toàn.\n2. Thừa (Development): Tăng dần độ khó với nhiều biến thể.\n3. Chuyển (Twist): Đảo ngược hoặc thêm yếu tố bất ngờ bắt người chơi thích nghi.\n4. Hợp (Conclusion): Thử thách tổng hợp cho phép người chơi thể hiện sự thuần thục.",
            "tag": "Game Design"
      },
      {
            "id": 4,
            "front": "Đóng góp vĩ đại nhất của Super Mario 64 (1996) đối với ngành công nghiệp game 3D thế giới là gì?",
            "back": "Định hình hệ thống camera 3D tự do (Lakitu Camera) và cần gạt analog 360 độ.\n\n📌 Trước Super Mario 64, các nhà làm game chưa biết cách điều khiển nhân vật di chuyển tự nhiên trong không gian ba chiều mà không bị mất phương hướng.",
            "tag": "Kỷ nguyên 3D"
      },
      {
            "id": 5,
            "front": "Vương quốc nơi Công chúa Peach cai trị có tên chính thức là gì?",
            "back": "Vương quốc Nấm (Mushroom Kingdom).\n\n📌 Cư dân bản địa trung thành có hình dáng cây nấm đầu chấm bi được gọi là Toad (Kinopio).",
            "tag": "Thế giới Mario"
      },
      {
            "id": 6,
            "front": "Cơ chế hoạt động của cây Nấm Đỏ (Super Mushroom) và Nấm Xanh (1-Up Mushroom) là gì?",
            "back": "• Nấm Đỏ (Super Mushroom): Biến Mario nhỏ (Small Mario) thành Super Mario to lớn, có thể đập vỡ gạch đá và chịu thêm 1 lần sát thương.\n• Nấm Xanh (1-Up Mushroom): Tặng ngay cho người chơi thêm 1 mạng (extra life).",
            "tag": "Power-up"
      },
      {
            "id": 7,
            "front": "Vật phẩm ngôi sao Super Star (Starman) mang lại năng lực gì cho Mario?",
            "back": "Trạng thái Bất Tử Tạm Thời (Temporary Invincibility).\n\n📌 Khi nhặt được, Mario phát sáng hào quang 7 màu, di chuyển nhanh hơn, nhạc nền đổi sang giai điệu dồn dập và tiêu diệt ngay lập tức bất kỳ kẻ địch nào chạm phải.",
            "tag": "Power-up"
      },
      {
            "id": 8,
            "front": "Trong game đồ họa máy tính 3D, \"Hitbox\" và \"Hurtbox\" khác nhau như thế nào?",
            "back": "• Hitbox: Vùng hình học (vô hình) gây ra sát thương (ví dụ cú đấm của Mario, mai rùa bay).\n• Hurtbox: Vùng hình học bao quanh nhân vật nhận sát thương khi bị Hitbox đối phương chạm trúng.",
            "tag": "Game Dev"
      },
      {
            "id": 9,
            "front": "Thuật ngữ \"Game Loop\" (Vòng lặp trò chơi) bao gồm 3 bước cơ bản nào lặp lại mỗi frame?",
            "back": "1. Process Input: Đọc thao tác nhấn phím / cần gạt của người chơi.\n2. Update Game State: Tính toán vị trí nhân vật, vật lý, va chạm, AI kẻ địch.\n3. Render: Vẽ toàn bộ khung cảnh lên màn hình (ở 60fps hoặc 120fps).",
            "tag": "Game Architecture"
      },
      {
            "id": 10,
            "front": "Công nghệ \"Ray Tracing\" (Dò tia) được ứng dụng trong điện ảnh 3D và game 4K nhằm mục đích gì?",
            "back": "Mô phỏng chính xác đường đi vật lý của các tia sáng trong thực tế.\n\n📌 Tạo ra hiệu ứng đổ bóng chân thực (soft shadows), phản chiếu mặt nước/kim loại (reflections) và ánh sáng tán xạ xung quanh (global illumination).",
            "tag": "Đồ họa 3D"
      },
      {
            "id": 11,
            "front": "Kẻ thù truyền kiếp của Mario, thủ lĩnh tộc Koopa tên là gì?",
            "back": "Bowser (ở Nhật Bản tên là Đại ma vương Koopa).\n\n📌 Đặc điểm: Rùa khổng lồ có mai gai nhọn, sừng rồng và khả năng phun ra những quả cầu lửa lớn.",
            "tag": "Nhân vật"
      },
      {
            "id": 12,
            "front": "Người em trai sinh đôi cao hơn, mặc áo xanh lá của Mario tên là gì?",
            "back": "Luigi.\n\n📌 Luigi xuất hiện lần đầu trong Mario Bros (1983). Anh thường nhút nhát hơn nhưng nhảy cao hơn Mario và là nhân vật chính trong series Luigi's Mansion săn ma.",
            "tag": "Nhân vật"
      },
      {
            "id": 13,
            "front": "Khủng long xanh dễ thương đồng hành cùng Mario có khả năng nuốt chửng kẻ địch tên là gì?",
            "back": "Yoshi (T. Yoshisaur Munchakoopas).\n\n📌 Xuất hiện lần đầu trong Super Mario World (1990) trên hệ máy Super Famicom (SNES).",
            "tag": "Nhân vật"
      },
      {
            "id": 14,
            "front": "Hãng phim hoạt hình 3D nào đã hợp tác cùng Nintendo sản xuất \"The Super Mario Bros. Movie\" (2023)?",
            "back": "Illumination Studios (thuộc Universal Pictures, hãng làm Despicable Me / Minions).\n\n📌 Bộ phim đã thu về hơn 1,36 tỷ USD phòng vé toàn cầu, trở thành phim chuyển thể từ game thành công nhất lịch sử.",
            "tag": "Điện ảnh 3D"
      },
      {
            "id": 15,
            "front": "Khái niệm \"Framerate\" (FPS) và \"Refresh Rate\" (Hz) có điểm gì khác biệt?",
            "back": "• FPS (Frames Per Second): Số khung hình mà card đồ họa (GPU) render ra trong 1 giây.\n• Hz (Hertz): Số lần màn hình phần cứng có thể làm mới hiển thị hình ảnh trong 1 giây.\n💡 Để hiển thị mượt mà nhất, GPU và màn hình cần đồng bộ (G-Sync / FreeSync).",
            "tag": "Phần cứng & 4K"
      },
      {
            "id": 16,
            "front": "Độ phân giải \"4K UHD\" tiêu chuẩn có kích thước điểm ảnh chính xác là bao nhiêu pixel?",
            "back": "3840 x 2160 pixels (khoảng 8,3 triệu điểm ảnh).\n\n📌 Gấp 4 lần độ phân giải Full HD (1920 x 1080 = 2,07 triệu điểm ảnh).",
            "tag": "Công nghệ 4K"
      },
      {
            "id": 17,
            "front": "Tác dụng của bông hoa Lửa (Fire Flower) trong thế giới Mario là gì?",
            "back": "Biến Mario thành Fire Mario (Mario mặc trang phục áo trắng quần yếm đỏ), có khả năng ném ra các quả cầu lửa nảy trên mặt đất để tiêu diệt kẻ thù từ xa.",
            "tag": "Power-up"
      },
      {
            "id": 18,
            "front": "Tại sao Mario lại có ria mép và đội mũ lưỡi trai trong thiết kế ban đầu năm 1981?",
            "back": "Do giới hạn phần cứng đồ họa 8-bit chỉ có lưới 16x16 pixels:\n• Chiếc mũ giúp Miyamoto không phải vẽ tóc chuyển động khi nhảy.\n• Bộ ria mép giúp người chơi phân biệt rõ khuôn mặt và chiếc mũi mà không cần vẽ miệng.",
            "tag": "Lịch sử thiết kế"
      },
      {
            "id": 19,
            "front": "Công nghệ \"Level of Detail\" (LOD) trong game 3D thế giới mở giải quyết bài toán gì?",
            "back": "Tối ưu hóa hiệu năng render GPU bằng cách sử dụng các mô hình 3D giảm bớt đa giác (polygons) khi đối tượng ở xa tầm mắt camera, và chỉ nạp mô hình chi tiết cao khi lại gần.",
            "tag": "Đồ họa 3D"
      },
      {
            "id": 20,
            "front": "Hệ máy chơi game mang tính cách mạng kết hợp giữa máy cầm tay (Handheld) và máy cắm TV (Home Console) của Nintendo là gì?",
            "back": "Nintendo Switch (ra mắt tháng 3/2017).\n\n📌 Đã bán được hơn 143 triệu máy trên toàn thế giới, sở hữu các siêu phẩm Mario Odyssey và Zelda: Breath of the Wild.",
            "tag": "Phần cứng"
      },
      {
            "id": 21,
            "front": "Món đồ Super Leaf (Chiếc lá gấu mèo) trong Super Mario Bros 3 (1988) cho phép Mario làm gì?",
            "back": "Biến Mario thành Raccoon Mario (Mario chồn Tanooki), mọc tai và đuôi để vẫy đuôi bay lượn trên không trung sau khi chạy đà đầy thanh P-Meter.",
            "tag": "Power-up"
      },
      {
            "id": 22,
            "front": "Khái niệm \"Coyote Time\" trong lập trình cơ chế nhảy của game Platformer là gì?",
            "back": "Khoảng thời gian ân huệ (khoảng 0.1 giây) cho phép người chơi vẫn bấm nút nhảy thành công ngay cả sau khi chân nhân vật vừa bước hụt ra khỏi mép vực thẳm.\n💡 Giúp trải nghiệm điều khiển công bằng và thoải mái hơn.",
            "tag": "Game Dev"
      },
      {
            "id": 23,
            "front": "Bài hát chủ đề \"Peaches\" nổi tiếng trong phim Super Mario Bros do diễn viên nào sáng tác và thể hiện?",
            "back": "Nam diễn viên Jack Black (lồng tiếng cho Bowser).\n\n📌 Ca khúc đã lọt top bảng xếp hạng Billboard Hot 100 và nhận đề cử Quả Cầu Vàng.",
            "tag": "Điện ảnh 3D"
      },
      {
            "id": 24,
            "front": "Khái niệm \"Rigging\" và \"Skinning\" trong quy trình làm hoạt hình nhân vật 3D là gì?",
            "back": "• Rigging: Tạo hệ thống khung xương ảo bên trong mô hình 3D.\n• Skinning: Gán trọng số da thịt vào từng đốt xương để khi xoay cánh tay/chân, bề mặt lưới (mesh) co giãn tự nhiên.",
            "tag": "Hoạt hình 3D"
      },
      {
            "id": 25,
            "front": "Thành phố mang phong cách New York trong Super Mario Odyssey nơi Thị trưởng Pauline điều hành có tên là gì?",
            "back": "New Donk City (thuộc vương quốc Metro Kingdom).\n\n📌 Nơi đây có cư dân là những người bình thường mặc âu phục và các cột đèn vàng.",
            "tag": "Thế giới Mario"
      },
      {
            "id": 26,
            "front": "Loại ống cống (Warp Pipe) màu xanh lá cây trong Mario dùng để làm gì?",
            "back": "Là phương tiện dịch chuyển tức thời đưa Mario xuống các căn hầm chứa tiền xu ngầm dưới lòng đất hoặc nhảy cóc qua các màn chơi xa hơn (Warp Zone).",
            "tag": "Thế giới Mario"
      },
      {
            "id": 27,
            "front": "Chiếc nón có mắt sống Cappy trong Super Mario Odyssey mang lại siêu năng lực gì?",
            "back": "Khả năng \"Capture\" (Nhập hồn/Chiếm hữu).\n\n📌 Mario ném nón vào đối phương (Goomba, Koopa, Khủng long T-Rex, xe tăng) để trực tiếp điều khiển cơ thể và năng lực của mục tiêu đó.",
            "tag": "Power-up"
      },
      {
            "id": 28,
            "front": "Tựa game Mario đầu tiên giới thiệu thể loại đua xe kết hợp vật phẩm quấy rối là gì?",
            "back": "Super Mario Kart (ra mắt năm 1992 trên hệ máy SNES).\n\n📌 Khai sinh ra thể loại Kart Racing với các vật phẩm kinh điển như Mai rùa xanh (Spiny Shell), Vỏ chuối, Nấm tăng tốc.",
            "tag": "Lịch sử Mario"
      },
      {
            "id": 29,
            "front": "Cơ chế \"Mai rùa xanh\" (Blue Shell / Spiny Shell) trong Mario Kart được thiết kế vì mục đích gì?",
            "back": "Cơ chế cân bằng cao su (Rubber-banding mechanic).\n\n📌 Tự động bay thẳng lên phía trước và phát nổ trừng phạt người chơi đang dẫn đầu vị trí số 1, tạo cơ hội lội ngược dòng kịch tính cho những người ở sau.",
            "tag": "Game Design"
      },
      {
            "id": 30,
            "front": "Công nghệ khử răng cưa \"Anti-Aliasing\" (FXAA, TAA, MSAA) trong hiển thị đồ họa 4K có tác dụng gì?",
            "back": "Làm mượt các đường viền góc cạnh bị vỡ hạt răng cưa (jaggies) do bản chất ma trận điểm ảnh hình vuông tạo nên, giúp vật thể 3D trông sắc nét và chân thực.",
            "tag": "Đồ họa 3D"
      },
      {
            "id": 31,
            "front": "Khái niệm \"Variable Jump Height\" (Độ cao nhảy tùy biến) trong Mario được hiện thực hóa như thế nào?",
            "back": "Người chơi giữ nút nhảy càng lâu thì Mario nhảy càng cao. Khi nhả nút nhảy sớm, trọng lực giả lập được áp dụng sớm hơn làm Mario rơi xuống ngay lập tức.",
            "tag": "Game Physics"
      },
      {
            "id": 32,
            "front": "Trong đồ họa 3D, sự khác biệt giữa Vertex Shader và Fragment (Pixel) Shader là gì?",
            "back": "• Vertex Shader: Xử lý tọa độ từng đỉnh hình học trong không gian 3D.\n• Fragment/Pixel Shader: Tính toán màu sắc, ánh sáng và đổ bóng của từng pixel trên màn hình.",
            "tag": "Đồ họa 3D"
      },
      {
            "id": 33,
            "front": "Vật liệu PBR (Physically Based Rendering) bao gồm các bản đồ kết cấu (texture maps) cốt lõi nào?",
            "back": "1. Albedo / Base Color: Màu sắc tự nhiên không bóng.\n2. Normal Map: Giả lập chi tiết gồ ghề bề mặt.\n3. Roughness: Độ nhám bề mặt.\n4. Metallic: Tính chất kim loại hay phi kim.\n5. Ambient Occlusion (AO): Đổ bóng kẽ hở.",
            "tag": "Đồ họa 3D"
      },
      {
            "id": 34,
            "front": "Âm thanh tương tác trong Super Mario Galaxy (Interactive Music) biến đổi ra sao khi Mario cưỡi Yoshi hoặc nhảy liên tiếp?",
            "back": "Được thiết kế theo nhiều lớp nhạc (layered audio tracks) đồng bộ nhịp độ (BPM); khi kích hoạt trạng thái, các rãnh nhạc bộ gõ Bongo hoặc dàn kèn đồng tự động fade in mượt mà.",
            "tag": "Âm thanh Game"
      },
      {
            "id": 35,
            "front": "Cấu trúc dữ liệu \"Octree\" và \"BVH\" được sử dụng trong engine game 3D nhằm mục đích gì?",
            "back": "Phân vùng không gian ba chiều (Spatial Partitioning) để tăng tốc kiểm tra va chạm (Collision Detection) và loại bỏ vật thể khuất tầm nhìn (Frustum Culling) từ O(N) xuống O(log N).",
            "tag": "Game Architecture"
      },
      {
            "id": 36,
            "front": "Khái niệm \"Jump Buffering\" trong lập trình game điều khiển nhân vật là gì?",
            "back": "Nếu người chơi bấm nút nhảy sớm vài frame trước khi chân chạm đất, hệ thống ghi nhớ lệnh đó và tự động thực hiện cú nhảy ngay khi nhân vật tiếp đất.",
            "tag": "Game Dev"
      },
      {
            "id": 37,
            "front": "Kỹ thuật \"Occlusion Culling\" trong render thế giới mở hoạt động ra sao?",
            "back": "Ngừng gửi lệnh vẽ (Draw Call) tới GPU đối với những vật thể bị che khuất hoàn toàn phía sau các bức tường hoặc ngọn núi lớn, tiết kiệm tài nguyên GPU.",
            "tag": "Đồ họa 3D"
      },
      {
            "id": 38,
            "front": "Khái niệm \"Draw Call\" trong lập trình đồ họa là gì?",
            "back": "Lệnh CPU gửi tới GPU yêu cầu render một tập hợp hình học bằng một chất liệu (material) cụ thể. Quá nhiều Draw Call sẽ gây nghẽn cổ chai CPU (CPU bottleneck).",
            "tag": "Đồ họa 3D"
      },
      {
            "id": 39,
            "front": "Trong game Super Mario Sunshine (2002), thiết bị bình nước mà Mario đeo trên lưng có tên là gì?",
            "back": "F.L.U.D.D. (Flash Liquidizer Ultra Dousing Device).\n\n📌 Cho phép Mario bắn nước làm sạch sơn ô nhiễm, phun nước phản lực bay lơ lửng (Hover Nozzle) và phóng tên lửa.",
            "tag": "Thế giới Mario"
      },
      {
            "id": 40,
            "front": "Kỹ thuật \"PBR Ambient Occlusion\" khác gì so với bóng đổ trực tiếp (Directional Shadows)?",
            "back": "AO mô phỏng sự thiếu hụt ánh sáng tán xạ tại các góc kẹt, khe nứt và phần đáy tiếp giáp giữa các vật thể, giúp vật thể không bị cảm giác \"bay bổng\" trên mặt đất.",
            "tag": "Đồ họa 3D"
      },
      {
            "id": 41,
            "front": "Khái niệm \"Entity Component System\" (ECS) trong kiến trúc game hiện đại là gì?",
            "back": "Mô hình kiến trúc tách rời dữ liệu và logic:\n• Entity: ID định danh duy nhất.\n• Component: Dữ liệu thuần túy (Position, Velocity, Health).\n• System: Logic xử lý các entities có components tương ứng, tối ưu CPU Cache.",
            "tag": "Game Architecture"
      },
      {
            "id": 42,
            "front": "Động cơ làm game Unreal Engine 5 sử dụng công nghệ hình học ảo hóa (Virtualized Geometry) nào?",
            "back": "Nanite.\n\n📌 Cho phép import trực tiếp tài nguyên mô hình hàng triệu đa giác (ZBrush/CAD) vào game mà không cần bake Normal Map thủ công.",
            "tag": "Đồ họa 3D"
      },
      {
            "id": 43,
            "front": "Công nghệ chiếu sáng toàn cầu thời gian thực Lumen trong Unreal Engine 5 hoạt động ra sao?",
            "back": "Tự động tính toán phản xạ ánh sáng gián tiếp nhiều lần (Infinite diffuse bounces) ngay khi nguồn sáng hoặc địa hình thay đổi mà không cần bake tĩnh ánh sáng trước.",
            "tag": "Đồ họa 3D"
      },
      {
            "id": 44,
            "front": "Hiệu ứng \"Post-Processing: Bloom\" tạo ra cảm giác thị giác gì?",
            "back": "Tạo vầng hào quang rực rỡ xung quanh các vùng phát sáng có cường độ vượt ngưỡng độ sáng màn hình, mô phỏng hiện tượng thấu kính máy ảnh thực tế.",
            "tag": "Đồ họa 3D"
      },
      {
            "id": 45,
            "front": "Vật phẩm Super Bell trong Super Mario 3D World biến Mario thành gì?",
            "back": "Cat Mario (Mario Mèo).\n\n📌 Cho phép Mario cào vuốt kẻ địch, phóng nhanh 4 chân và trèo leo thẳng đứng lên các bức tường cao vút.",
            "tag": "Power-up"
      },
      {
            "id": 46,
            "front": "Nguyên tắc thiết kế \"Leading Lines\" trong thiết kế màn chơi 3D (Level Design) là gì?",
            "back": "Sử dụng các đường dẫn tự nhiên (con đường mòn, hàng rào, dây cáp, dòng suối) để điều hướng mắt và bước chân của người chơi về phía mục tiêu chính mà không cần la bàn.",
            "tag": "Level Design"
      },
      {
            "id": 47,
            "front": "Thuật toán tìm đường phổ biến nhất trong AI game điều hướng kẻ địch là gì?",
            "back": "Thuật toán A* (A-Star Search Algorithm).\n\n📌 Kết hợp giữa thuật toán Dijkstra và hàm ước lượng Heuristic để tìm đường đi ngắn nhất nhanh chóng trên NavMesh.",
            "tag": "Game AI"
      },
      {
            "id": 48,
            "front": "Khái niệm \"NavMesh\" (Navigation Mesh) trong game 3D là gì?",
            "back": "Bề mặt lưới hình học vô hình đại diện cho những khu vực mà các nhân vật AI có thể di chuyển và bước đi an toàn trong thế giới 3D.",
            "tag": "Game AI"
      },
      {
            "id": 49,
            "front": "Hiệu ứng \"Depth of Field\" (DoF) trong đồ họa 3D làm gì?",
            "back": "Mô phỏng tiêu cự máy ảnh: làm mờ các vật thể ở quá gần hoặc quá xa tâm điểm lấy nét, tăng cảm giác chiều sâu điện ảnh (Cinematic feeling).",
            "tag": "Đồ họa 3D"
      },
      {
            "id": 40,
            "front": "Tại sao Mario Kart 8 Deluxe lại là tựa game bán chạy nhất lịch sử máy Nintendo Switch?",
            "back": "Nhờ đạt đồ họa 1080p 60fps mượt mà, cơ chế phản trọng lực đua xe trên tường và trần nhà (Anti-gravity), cùng 96 đường đua phong phú và hệ thống online ổn định.",
            "tag": "Lịch sử Mario"
      },
      {
            "id": 51,
            "front": "Khái niệm \"Motion Blur\" (Làm mờ chuyển động) trong game mô phỏng điều gì?",
            "back": "Hiện tượng mắt người hoặc màn trập máy ảnh lưu lại vệt mờ khi vật thể di chuyển ở tốc độ cao, giúp các chuyển động trông mượt mà và tự nhiên hơn.",
            "tag": "Đồ họa 3D"
      },
      {
            "id": 52,
            "front": "Trong thiết kế nhân vật, tỷ lệ đầu trên cơ thể của Mario là bao nhiêu và thuộc phong cách gì?",
            "back": "Khoảng 1:3 đến 1:3.5, thuộc phong cách Chibi / Stylized Cartoony, giúp các biểu cảm cử chỉ phóng đại và dễ thương nổi bật trên màn hình.",
            "tag": "Thiết kế nhân vật"
      },
      {
            "id": 53,
            "front": "Cơ chế \"Camera Clipping\" và \"Spring-arm\" trong game góc nhìn thứ 3 giải quyết bài toán gì?",
            "back": "Tự động co ngắn khoảng cách camera lại khi phía sau có bức tường chắn, ngăn camera bị đâm xuyên qua tường làm lộ nội tạng đồ họa vô hình (wall clipping).",
            "tag": "Kỷ nguyên 3D"
      },
      {
            "id": 54,
            "front": "Nhạc sĩ huyền thoại nào đã sáng tác bản nhạc nền Overworld kinh điển của Super Mario Bros (1985)?",
            "back": "Koji Kondo.\n\n📌 Bản nhạc Latin Calypso sôi động đã trở thành biểu tượng văn hóa đại chúng toàn cầu và được lưu giữ tại Thư viện Quốc hội Mỹ.",
            "tag": "Âm thanh Game"
      },
      {
            "id": 55,
            "front": "Kỹ thuật \"Texture Streaming\" trong các tựa game đồ họa 4K giải quyết vấn đề bộ nhớ VRAM ra sao?",
            "back": "Chỉ nạp các mipmap độ phân giải phù hợp với khoảng cách camera vào VRAM theo thời gian thực, ngăn tràn bộ nhớ đồ họa (VRAM Overflow crash).",
            "tag": "Đồ họa 3D"
      }
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
    description: 'Bao trọn 100% phạm vi thi Vòng 1: Luật Cán bộ, công chức 2008 (sđbs 2019), Luật Viên chức 2010 (sđbs 2019), Hiến pháp 2013, Luật Tổ chức Chính phủ, Nghị định 138/2020/NĐ-CP và Nghị định 115/2020/NĐ-CP.',
    highlights: [
      '55 Thẻ Anki chuẩn hóa mọi con số thời hiệu, thời hạn kỷ luật, bổ nhiệm',
      'Đầy đủ các điểm sửa đổi bổ sung mới nhất có hiệu lực thi hành 2026',
      'Phân biệt rành mạch Cán bộ vs Công chức vs Viên chức',
      'Bám sát đề thi Vòng 1 các Bộ, Ngành và UBND 63 tỉnh thành'
    ],
    previewCards: [
      {
            "id": 1,
            "front": "Thời hiệu xử lý kỷ luật đối với hành vi vi phạm của cán bộ, công chức ít nghiêm trọng đến mức phải khiển trách là bao lâu?",
            "back": "02 NĂM (kể từ thời điểm có hành vi vi phạm).\n\n📌 Căn cứ: Khoản 1 Điều 80 Luật Cán bộ, công chức (sửa đổi, bổ sung 2019).\n💡 Mẹo nhớ: Khiển trách = vi phạm nhẹ nhất = 2 năm. Các mức còn lại (trừ trường hợp đặc biệt) là 5 năm.",
            "tag": "Luật CBCC"
      },
      {
            "id": 2,
            "front": "Những trường hợp vi phạm nào KHÔNG ÁP DỤNG thời hiệu xử lý kỷ luật?",
            "back": "Gồm 4 trường hợp:\n1. Là đảng viên có hành vi vi phạm đến mức phải khai trừ Đảng.\n2. Vi phạm quy định về công tác bảo vệ chính trị nội bộ.\n3. Xâm phạm an ninh quốc gia.\n4. Sử dụng văn bằng, chứng chỉ, chứng nhận giả, không hợp pháp.",
            "tag": "Điều 80 - Luật CBCC"
      },
      {
            "id": 3,
            "front": "Cơ quan nào có thẩm quyền ban hành Nghị định?",
            "back": "CHÍNH PHỦ.\n\n📌 Căn cứ: Luật Ban hành văn bản quy phạm pháp luật.\n💡 Lưu ý: Thủ tướng ban hành Quyết định, Bộ trưởng ban hành Thông tư.",
            "tag": "Văn bản QPPL"
      },
      {
            "id": 4,
            "front": "Thời hạn bổ nhiệm công chức giữ chức vụ lãnh đạo, quản lý là bao nhiêu năm?",
            "back": "05 NĂM (trừ trường hợp thời hạn bổ nhiệm dưới 05 năm theo quy định chuyên ngành).\n\n📌 Căn cứ: Điều 51 Luật Cán bộ, công chức 2008.",
            "tag": "Bổ nhiệm"
      },
      {
            "id": 5,
            "front": "Hiến pháp 2013 quy định Nhân dân thực hiện quyền lực nhà nước bằng các hình thức nào?",
            "back": "Bằng DÂN CHỦ TRỰC TIẾP, bằng DÂN CHỦ ĐẠI DIỆN thông qua Quốc hội, Hội đồng nhân dân và thông qua các cơ quan khác của Nhà nước.\n\n📌 Căn cứ: Điều 6 Hiến pháp 2013.",
            "tag": "Hiến pháp 2013"
      },
      {
            "id": 6,
            "front": "Hình thức kỷ luật \"Hạ bậc lương\" áp dụng cho đối tượng nào?",
            "back": "Chỉ áp dụng đối với CÔNG CHỨC KHÔNG GIỮ CHỨC VỤ LÃNH ĐẠO, QUẢN LÝ.\n\n💡 Mẹo nhớ: Công chức lãnh đạo vi phạm mức tương đương thì bị \"Giáng chức\" hoặc \"Cách chức\", không hạ bậc lương.",
            "tag": "Kỷ luật"
      },
      {
            "id": 7,
            "front": "Các hình thức kỷ luật đối với công chức giữ chức vụ lãnh đạo, quản lý gồm những hình thức nào?",
            "back": "Gồm 5 hình thức: Khiển trách, Cảnh cáo, Giáng chức, Cách chức, Buộc thôi việc.\n\n⚠️ Chú ý: Không có hình thức \"Hạ bậc lương\".",
            "tag": "Kỷ luật CBCC"
      },
      {
            "id": 8,
            "front": "Ngạch công chức được phân chia thành bao nhiêu ngạch cơ bản theo Luật hiện hành?",
            "back": "Gồm 5 ngạch:\n1. Chuyên viên cao cấp và tương đương\n2. Chuyên viên chính và tương đương\n3. Chuyên viên và tương đương\n4. Cán sự và tương đương\n5. Nhân viên (và các ngạch khác theo quy định).",
            "tag": "Ngạch công chức"
      },
      {
            "id": 9,
            "front": "Thời gian tập sự đối với người trúng tuyển công chức ngạch Chuyên viên (loại C) là bao lâu?",
            "back": "12 THÁNG.\n\n📌 Mẹo nhớ: Ngạch Cán sự (loại D) tập sự 06 tháng; Ngạch Chuyên viên (loại C) tập sự 12 tháng.",
            "tag": "Tập sự"
      },
      {
            "id": 10,
            "front": "Theo Luật Tổ chức Chính phủ, Chính phủ làm việc theo chế độ nào?",
            "back": "Chế độ TẬP THỂ, quyết định theo đa số.\n\n📌 Thủ tướng Chính phủ là người đứng đầu Chính phủ, chịu trách nhiệm trước Quốc hội về hoạt động của Chính phủ.",
            "tag": "Chính phủ"
      },
      {
            "id": 11,
            "front": "Viên chức có bao nhiêu hình thức kỷ luật theo Luật Viên chức?",
            "back": "Gồm 4 hình thức đối với viên chức không giữ chức vụ quản lý:\n1. Khiển trách\n2. Cảnh cáo\n3. Buộc thôi việc.\nĐối với viên chức quản lý: Thêm hình thức Cách chức.",
            "tag": "Luật Viên chức"
      },
      {
            "id": 12,
            "front": "Hợp đồng làm việc của viên chức được tuyển dụng từ ngày 01/7/2020 trở đi là loại hợp đồng nào?",
            "back": "HỢP ĐỒNG LÀM VIỆC XÁC ĐỊNH THỜI HẠN (từ 12 tháng đến 60 tháng).\n\n📌 Chỉ có 3 trường hợp được ký Hợp đồng không xác định thời hạn (viên chức tuyển trước 01/7/2020, cán bộ công chức chuyển sang, tuyển dụng ở vùng đặc biệt khó khăn).",
            "tag": "Luật Viên chức"
      },
      {
            "id": 13,
            "front": "Thời hạn xử lý kỷ luật đối với cán bộ, công chức không quá bao nhiêu ngày?",
            "back": "Không quá 90 NGÀY;\nTrường hợp có tình tiết phức tạp cần kiểm tra, xác minh thêm thì có thể kéo dài nhưng không quá 150 NGÀY.",
            "tag": "Thời hạn kỷ luật"
      },
      {
            "id": 14,
            "front": "Tổ chức nào là cơ quan quyền lực nhà nước cao nhất của nước Cộng hòa XHCN Việt Nam?",
            "back": "QUỐC HỘI.\n\n📌 Quốc hội thực hiện quyền lập hiến, quyền lập pháp, quyết định các vấn đề quan trọng của đất nước và giám sát tối cao đối với hoạt động của Nhà nước.",
            "tag": "Hiến pháp 2013"
      },
      {
            "id": 15,
            "front": "Nguyên tắc quản lý cán bộ, công chức gồm những nguyên tắc cơ bản nào?",
            "back": "1. Bảo đảm sự lãnh đạo của Đảng Cộng sản Việt Nam.\n2. Kết hợp giữa tiêu chuẩn chức danh, vị trí việc làm và chỉ tiêu biên chế.\n3. Thực hiện nguyên tắc tập trung dân chủ, chế độ thủ trưởng.\n4. Căn cứ phẩm chất chính trị, đạo đức và năng lực.\n5. Thực hiện bình đẳng giới.",
            "tag": "Nguyên tắc CBCC"
      },
      {
            "id": 16,
            "front": "Công chức 02 năm liên tiếp bị xếp loại chất lượng ở mức \"Không hoàn thành nhiệm vụ\" thì cơ quan có thẩm quyền xử lý thế nào?",
            "back": "Giải quyết BUỘC THÔI VIỆC.\n\n📌 Căn cứ: Điểm a Khoản 3 Điều 58 Luật Cán bộ, công chức (sửa đổi 2019).",
            "tag": "Đánh giá CBCC"
      },
      {
            "id": 17,
            "front": "Bộ trưởng, Thủ trưởng cơ quan ngang bộ do ai phê chuẩn bổ nhiệm?",
            "back": "QUỐC HỘI phê chuẩn theo đề nghị của Thủ tướng Chính phủ; sau đó Chủ tịch nước căn cứ nghị quyết của Quốc hội để ra quyết định bổ nhiệm.",
            "tag": "Bộ máy Nhà nước"
      },
      {
            "id": 18,
            "front": "Văn bản nào sau đây KHÔNG PHẢI là văn bản quy phạm pháp luật: Chỉ thị của Thủ tướng, Nghị quyết của Quốc hội, Quyết định của Chủ tịch nước, Nghị định của Chính phủ?",
            "back": "CHỈ THỊ CỦA THỦ TƯỚNG CHÍNH PHỦ.\n\n📌 Theo Luật Ban hành VBQPPL 2015 (sđbs 2020), Thủ tướng chỉ ban hành Quyết định là văn bản QPPL; Chỉ thị là văn bản chỉ đạo điều hành cá biệt.",
            "tag": "Văn bản QPPL"
      },
      {
            "id": 19,
            "front": "Độ tuổi nghỉ hưu của cán bộ, công chức trong điều kiện lao động bình thường theo Bộ luật Lao động 2019 lộ trình đến năm nào?",
            "back": "Nam đủ 62 tuổi (vào năm 2028), Nữ đủ 60 tuổi (vào năm 2035).\n\n📌 Mỗi năm tăng thêm 03 tháng đối với lao động nam và 04 tháng đối với lao động nữ.",
            "tag": "Chế độ chính sách"
      },
      {
            "id": 20,
            "front": "Điều kiện miễn phần thi Ngoại ngữ ở Vòng 1 kỳ thi tuyển công chức gồm những trường hợp nào?",
            "back": "1. Có bằng tốt nghiệp đại học, sau đại học chuyên ngành ngoại ngữ.\n2. Có bằng tốt nghiệp đại học, sau đại học do cơ sở đào tạo nước ngoài cấp được công nhận tại VN.\n3. Có chứng chỉ tiếng dân tộc thiểu số dự tuyển vào vùng dân tộc thiểu số.",
            "tag": "Nghị định 138"
      },
      {
            "id": 21,
            "front": "Theo Nghị định 112/2020/NĐ-CP, Hội đồng kỷ luật công chức bao gồm bao nhiêu thành viên?",
            "back": "Hội đồng kỷ luật có 05 THÀNH VIÊN bao gồm:\n• Chủ tịch Hội đồng\n• 01 Ủy viên kiêm Thư ký Hội đồng\n• 03 Ủy viên khác là đại diện cấp ủy, công đoàn và đơn vị trực tiếp.",
            "tag": "Hội đồng kỷ luật"
      },
      {
            "id": 22,
            "front": "Trường hợp nào chưa được xem xét xử lý kỷ luật đối với cán bộ, công chức?",
            "back": "1. Đang trong thời gian nghỉ hàng năm, nghỉ phép, nghỉ điều trị bệnh theo quy định.\n2. Đang trong thời gian điều trị bệnh hiểm nghèo hoặc mất năng lực hành vi dân sự.\n3. Cán bộ, công chức nữ đang trong thời gian mang thai, nghỉ thai sản, đang nuôi con dưới 12 tháng tuổi (hoặc nam giới nuôi con dưới 12 tháng tuổi do vợ chết).\n4. Đang bị tạm giữ, tạm giam.",
            "tag": "Nghị định 112"
      },
      {
            "id": 23,
            "front": "Văn bản quy phạm pháp luật nào có hiệu lực pháp lý cao nhất trong hệ thống pháp luật Việt Nam?",
            "back": "HIẾN PHÁP.\n\n📌 Mọi văn bản pháp luật khác (Luật, Nghị quyết, Pháp lệnh, Nghị định, Quyết định, Thông tư) đều phải phù hợp với Hiến pháp.",
            "tag": "Hiến pháp 2013"
      },
      {
            "id": 24,
            "front": "Chủ tịch Ủy ban nhân dân cấp tỉnh do cơ quan nào bầu ra?",
            "back": "HỘI ĐỒNG NHÂN DÂN CẤP TỈNH bầu theo giới thiệu của Chủ tịch HĐND cấp tỉnh, và được THỦ TƯỚNG CHÍNH PHỦ phê chuẩn kết quả bầu.",
            "tag": "Chính quyền địa phương"
      },
      {
            "id": 25,
            "front": "Theo Luật Ban hành VBQPPL, văn bản quy phạm pháp luật của Trung ương có hiệu lực sau bao nhiêu ngày kể từ ngày thông qua hoặc ký ban hành?",
            "back": "Sau 45 NGÀY (trừ trường hợp quy định hiệu lực thi hành ngay theo thủ tục rút gọn).",
            "tag": "Văn bản QPPL"
      },
      {
            "id": 26,
            "front": "Ủy ban Thường vụ Quốc hội có thẩm quyền ban hành các loại văn bản quy phạm pháp luật nào?",
            "back": "PHÁP LỆNH và NGHỊ QUYẾT.\n\n📌 Pháp lệnh được ban hành để quy định về những vấn đề được Quốc hội giao.",
            "tag": "Văn bản QPPL"
      },
      {
            "id": 27,
            "front": "Nguyên tắc bảo vệ việc áp dụng văn bản quy phạm pháp luật khi có quy định khác nhau giữa các văn bản về cùng một vấn đề là gì?",
            "back": "1. Áp dụng văn bản có hiệu lực pháp lý cao hơn.\n2. Nếu cùng cơ quan ban hành: Áp dụng văn bản ban hành sau.\n3. Nếu giữa văn bản chung và văn bản chuyên ngành: Áp dụng văn bản chuyên ngành.",
            "tag": "Văn bản QPPL"
      },
      {
            "id": 28,
            "front": "Theo Luật Cán bộ, công chức, hình thức \"Biệt phái\" công chức có thời hạn không quá bao nhiêu năm?",
            "back": "Không quá 03 NĂM (trừ một số ngành, lĩnh vực do Chính phủ quy định).\n\n📌 Công chức biệt phái chịu sự phân công, bố trí, đánh giá của cơ quan nơi được cử đến biệt phái nhưng vẫn thuộc biên chế cơ quan cử đi.",
            "tag": "Quản lý CBCC"
      },
      {
            "id": 29,
            "front": "Chế độ phụ cấp công vụ đối với cán bộ, công chức hiện hành bằng bao nhiêu phần trăm mức lương hiện hưởng?",
            "back": "Bằng 25% mức lương hiện hưởng cộng phụ cấp chức vụ lãnh đạo và phụ cấp thâm niên vượt khung (nếu có).",
            "tag": "Tiền lương & Phụ cấp"
      },
      {
            "id": 30,
            "front": "Cơ quan nào có thẩm quyền giám sát tối cao việc tuân theo Hiến pháp, luật và nghị quyết của Quốc hội?",
            "back": "QUỐC HỘI.\n\n📌 Quốc hội thực hiện quyền giám sát tối cao tại các kỳ họp thông qua chất vấn, xem xét báo cáo và thành lập Đoàn giám sát chuyên đề.",
            "tag": "Hiến pháp 2013"
      },
      {
            "id": 31,
            "front": "Đánh giá, xếp loại chất lượng cán bộ, công chức được phân thành 4 mức nào?",
            "back": "1. Hoàn thành xuất sắc nhiệm vụ\n2. Hoàn thành tốt nhiệm vụ\n3. Hoàn thành nhiệm vụ\n4. Không hoàn thành nhiệm vụ.",
            "tag": "Đánh giá CBCC"
      },
      {
            "id": 32,
            "front": "Công chức đạt kết quả xếp loại nào thì được xét nâng ngạch hoặc quy hoạch bổ nhiệm chức vụ cao hơn?",
            "back": "Hoàn thành tốt nhiệm vụ trở lên trong các năm công tác liên tiếp theo quy định của vị trí quy hoạch.",
            "tag": "Bổ nhiệm"
      },
      {
            "id": 33,
            "front": "Cán bộ khác với Công chức ở những điểm cốt lõi nào?",
            "back": "• Cán bộ: Được BẦU CỬ, PHÊ CHUẨN, BỔ NHIỆM giữ chức vụ, chức danh theo NHIỆM KỲ trong cơ quan của Đảng, Nhà nước, tổ chức CT-XH ở TƯ, tỉnh, huyện.\n• Công chức: Được TUYỂN DỤNG, BỔ NHIỆM vào ngạch, chức vụ, chức danh trong BIÊN CHẾ và hưởng lương từ ngân sách nhà nước.",
            "tag": "Phân loại CBCC"
      },
      {
            "id": 34,
            "front": "Viên chức được định nghĩa thế nào theo Luật Viên chức?",
            "back": "Là công dân Việt Nam được tuyển dụng theo VỊ TRÍ VIỆC LÀM, làm việc tại ĐƠN VỊ SỰ NGHIỆP CÔNG LẬP theo chế độ HỢP ĐỒNG LÀM VIỆC, hưởng lương từ quỹ lương của đơn vị sự nghiệp công lập theo quy định của pháp luật.",
            "tag": "Luật Viên chức"
      },
      {
            "id": 35,
            "front": "Ai là người đứng đầu cơ quan hành chính nhà nước cao nhất ở địa phương cấp tỉnh?",
            "back": "CHỦ TỊCH ỦY BAN NHÂN DÂN CẤP TỈNH.\n\n📌 Chịu trách nhiệm trước HĐND cùng cấp và trước Thủ tướng Chính phủ.",
            "tag": "Bộ máy Nhà nước"
      },
      {
            "id": 36,
            "front": "Cơ quan nào thực hiện chức năng thực hành quyền công tố và kiểm sát hoạt động tư pháp?",
            "back": "VIỆN KIỂM SÁT NHÂN DÂN.\n\n📌 Có nhiệm vụ bảo vệ Hiến pháp và pháp luật, bảo vệ quyền con người, quyền công dân, bảo vệ chế độ XHCN.",
            "tag": "Tư pháp"
      },
      {
            "id": 37,
            "front": "Tòa án nhân dân là cơ quan xét xử của nước CHXHCN Việt Nam, thực hiện quyền gì?",
            "back": "Thực hiện QUYỀN TƯ PHÁP.\n\n📌 Khi xét xử, Thẩm phán và Hội thẩm độc lập và chỉ tuân theo pháp luật.",
            "tag": "Tư pháp"
      },
      {
            "id": 38,
            "front": "Theo Hiến pháp 2013, Mặt trận Tổ quốc Việt Nam có vai trò là gì?",
            "back": "Là cơ sở chính trị của chính quyền nhân dân; đại diện, bảo vệ quyền và lợi ích hợp pháp, chính đáng của Nhân dân; tập hợp, phát huy sức mạnh đại đoàn kết toàn dân tộc; thực hiện dân chủ, tăng cường đồng thuận xã hội.",
            "tag": "Hiến pháp 2013"
      },
      {
            "id": 39,
            "front": "Thời gian tập sự của người trúng tuyển công chức ngạch Cán sự (loại D) là bao lâu?",
            "back": "06 THÁNG.\n\n📌 Trong thời gian tập sự, người tập sự được hưởng 85% mức lương bậc 1 của ngạch tuyển dụng.",
            "tag": "Tập sự"
      },
      {
            "id": 40,
            "front": "Người tập sự công chức được hưởng 100% mức lương và phụ cấp của ngạch tuyển dụng trong trường hợp nào?",
            "back": "1. Làm việc ở vùng có điều kiện kinh tế - xã hội đặc biệt khó khăn.\n2. Làm việc trong các ngành, nghề độc hại, nguy hiểm.\n3. Hoàn thành nghĩa vụ quân sự, nghĩa vụ công an, sĩ quan quân đội, công an xuất ngũ.",
            "tag": "Nghị định 138"
      },
      {
            "id": 41,
            "front": "Thẩm quyền quyết định số lượng biên chế công chức của các Bộ, cơ quan ngang Bộ thuộc về ai?",
            "back": "THỦ TƯỚNG CHÍNH PHỦ quyết định giao biên chế công chức cho các Bộ, cơ quan ngang Bộ, cơ quan thuộc Chính phủ và các tỉnh, thành phố.",
            "tag": "Biên chế"
      },
      {
            "id": 42,
            "front": "Quyền của cán bộ, công chức được bảo đảm các điều kiện thi hành công vụ gồm những gì?",
            "back": "Được giao quyền hạn tương xứng với nhiệm vụ; được bảo đảm trang thiết bị và các điều kiện làm việc; được cung cấp thông tin liên quan đến nhiệm vụ; được đào tạo, bồi dưỡng nâng cao trình độ; được pháp luật bảo vệ khi thi hành công vụ.",
            "tag": "Quyền của CBCC"
      },
      {
            "id": 43,
            "front": "Nghĩa vụ của cán bộ, công chức đối với Đảng, Nhà nước và Nhân dân là gì?",
            "back": "1. Trung thành với Đảng Cộng sản Việt Nam, Nhà nước CHXHCN Việt Nam.\n2. Tôn trọng Nhân dân, tận tụy phục vụ Nhân dân.\n3. Liên hệ chặt chẽ với Nhân dân, lắng nghe ý kiến và chịu sự giám sát của Nhân dân.\n4. Chấp hành nghiêm chỉnh đường lối, chủ trương, chính sách của Đảng và pháp luật.",
            "tag": "Nghĩa vụ CBCC"
      },
      {
            "id": 44,
            "front": "Những việc cán bộ, công chức không được làm liên quan đến đạo đức công vụ là gì?",
            "back": "1. Trốn tránh trách nhiệm, thoái thác nhiệm vụ được giao; gây bè phái, mất đoàn kết; tự ý bỏ việc hoặc tham gia đình công.\n2. Sử dụng tài sản của Nhà nước và của nhân dân trái pháp luật.\n3. Lợi dụng chức vụ, quyền hạn để mưu lợi cá nhân.",
            "tag": "Đạo đức công vụ"
      },
      {
            "id": 45,
            "front": "Văn bản QPPL do Hội đồng nhân dân ban hành là loại văn bản nào?",
            "back": "NGHỊ QUYẾT.\n\n📌 Ủy ban nhân dân ban hành QUYẾT ĐỊNH.",
            "tag": "Văn bản QPPL"
      },
      {
            "id": 46,
            "front": "Khi cán bộ, công chức có đơn xin từ chức thì cơ quan có thẩm quyền phải xem xét, quyết định trong thời hạn bao lâu?",
            "back": "Trong thời hạn 30 NGÀY kể từ ngày nhận được đơn xin từ chức.",
            "tag": "Từ chức & Miễn nhiệm"
      },
      {
            "id": 47,
            "front": "Trường hợp nào công chức xin từ chức nhưng KHÔNG ĐƯỢC chấp thuận?",
            "back": "1. Đang đảm nhận nhiệm vụ quốc phòng, an ninh quốc gia; nhiệm vụ trọng yếu, cơ mật.\n2. Chưa hoàn thành việc thanh tra, kiểm tra, điều tra khi có dấu hiệu vi phạm.\n3. Đang trong thời gian xem xét xử lý kỷ luật.",
            "tag": "Từ chức"
      },
      {
            "id": 48,
            "front": "Cơ quan nào chủ trì, phối hợp tham mưu cho Chính phủ về công tác cải cách hành chính nhà nước?",
            "back": "BỘ NỘI VỤ.\n\n📌 Bộ Nội vụ phụ trách chỉ số Cải cách hành chính (PAR INDEX) và Chỉ số hài lòng của người dân (SIPAS).",
            "tag": "Cải cách hành chính"
      },
      {
            "id": 49,
            "front": "Chương trình tổng thể cải cách hành chính nhà nước giai đoạn 2021-2030 tập trung vào bao nhiêu nội dung trọng tâm?",
            "back": "Gồm 6 NỘI DUNG:\n1. Cải cách thể chế\n2. Cải cách thủ tục hành chính\n3. Cải cách tổ chức bộ máy hành chính nhà nước\n4. Cải cách chế độ công vụ\n5. Cải cách tài chính công\n6. Xây dựng và phát triển Chính phủ điện tử, Chính phủ số.",
            "tag": "Cải cách hành chính"
      },
      {
            "id": 50,
            "front": "Theo Hiến pháp 2013, độ tuổi bầu cử và độ tuổi ứng cử vào Quốc hội của công dân Việt Nam là bao nhiêu?",
            "back": "• Đủ 18 TUỔI trở lên có quyền bầu cử.\n• Đủ 21 TUỔI trở lên có quyền ứng cử vào Quốc hội, Hội đồng nhân dân.",
            "tag": "Hiến pháp 2013"
      },
      {
            "id": 51,
            "front": "Nhiệm kỳ của mỗi khóa Quốc hội và Hội đồng nhân dân là bao nhiêu năm?",
            "back": "05 NĂM (kể từ ngày khai mạc kỳ họp thứ nhất của khóa đó đến ngày khai mạc kỳ họp thứ nhất của khóa sau).",
            "tag": "Hiến pháp 2013"
      },
      {
            "id": 52,
            "front": "Công chức bị kỷ luật khiển trách thì thời gian nâng bậc lương bị kéo dài bao nhiêu tháng?",
            "back": "Kéo dài 06 THÁNG.\n\n📌 Nếu bị Cảnh cáo: Kéo dài 12 tháng.\n📌 Nếu bị Giáng chức hoặc Cách chức: Kéo dài 12 tháng.",
            "tag": "Nâng bậc lương"
      },
      {
            "id": 53,
            "front": "Trong thời gian thi hành quyết định kỷ luật, công chức có được quy hoạch, bổ nhiệm vào chức vụ cao hơn không?",
            "back": "KHÔNG.\n\n📌 Không thực hiện việc quy hoạch, đào tạo, bồi dưỡng, bổ nhiệm chức vụ cao hơn trong thời gian thi hành kỷ luật.",
            "tag": "Kỷ luật CBCC"
      },
      {
            "id": 54,
            "front": "Công chức lãnh đạo bị kỷ luật Cách chức thì không được bổ nhiệm vào chức vụ lãnh đạo, quản lý trong thời hạn bao lâu?",
            "back": "Trong thời hạn 24 THÁNG kể từ ngày quyết định kỷ luật có hiệu lực.",
            "tag": "Kỷ luật CBCC"
      },
      {
            "id": 55,
            "front": "Hồ sơ tuyển dụng công chức phải được lưu trữ trong thời hạn bao lâu?",
            "back": "Hồ sơ tuyển dụng (bài thi, đề thi, bảng điểm) được lưu trữ ít nhất 05 NĂM kể từ ngày công bố kết quả tuyển dụng.",
            "tag": "Tuyển dụng công chức"
      }
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
    subtitle: 'Bộ bí kíp 55 câu hỏi phỏng vấn kiến trúc Web, React 19, Node.js & Database',
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
    description: 'Chinh phục mức lương $1,500 - $3,500+ với bộ flashcard giải mã tận gốc rễ: React Fiber Reconciliation, Closure memory leaks, Event Loop, Sharding Database, B-Tree Indexing, Caching Strategy, WebSockets, Microservices và bảo mật CORS/XSS/CSRF.',
    highlights: [
      '55 Thẻ Anki phân tích từ nguyên lý gốc đến câu trả lời ăn điểm phỏng vấn',
      'Minh họa trực quan kiến trúc React 19 Compiler, Server Components',
      'Chiến lược thiết kế hệ thống chịu tải hàng triệu request (Scale System)',
      'Bộ câu hỏi phỏng vấn thực tế từ FPT, Viettel, VNG, Shopee, Grab'
    ],
    previewCards: [
      {
            "id": 1,
            "front": "Sự khác biệt cốt lõi giữa Microtask Queue và Macrotask (Callback) Queue trong JavaScript Event Loop là gì?",
            "back": "• Microtask Queue: Chứa Promise.then/catch/finally, queueMicrotask, MutationObserver, process.nextTick. Được xả sạch hoàn toàn (run to completion) ngay khi call stack rỗng, trước khi trình duyệt render hoặc chuyển sang macrotask kế tiếp.\n• Macrotask Queue: Chứa setTimeout, setInterval, setImmediate, I/O events, UI rendering. Mỗi vòng lặp Event Loop chỉ lấy ra đúng 1 macrotask.",
            "tag": "JavaScript Engine"
      },
      {
            "id": 2,
            "front": "Khái niệm \"Closure\" trong JavaScript là gì? Cho ví dụ về Memory Leak do Closure gây ra?",
            "back": "Closure là khả năng một hàm con ghi nhớ và truy cập vào lexical scope của hàm cha bao bọc nó ngay cả khi hàm cha đã return.\n⚠️ Memory Leak: Khi hàm con giữ tham chiếu tới một biến lớn (ví dụ mảng buffer hoặc DOM node) và hàm con được lưu vào global scope hoặc setInterval mà không được clear.",
            "tag": "JS Core"
      },
      {
            "id": 3,
            "front": "React Fiber Architecture giải quyết vấn đề nghẽn cổ chai nào của Virtual DOM cũ (React 15)?",
            "back": "Giải quyết vấn đề Stack Reconciler đồng bộ (blocking main thread). React Fiber chia nhỏ quá trình render thành các đơn vị công việc (Fiber nodes) có thể tạm dừng (pause), hủy bỏ hoặc hoãn lại để nhường luồng xử lý ưu tiên cho thao tác gõ phím/click của người dùng.",
            "tag": "React Core"
      },
      {
            "id": 4,
            "front": "Thuật toán đối soát Virtual DOM (Reconciliation Diffing Algorithm) của React dựa trên 2 giả định nào để giảm độ phức tạp từ O(n^3) xuống O(n)?",
            "back": "1. Hai phần tử khác type (ví dụ <div> đổi thành <span>) sẽ sinh ra hai cây DOM hoàn toàn khác nhau (React unmount cây cũ và mount cây mới).\n2. Nhà phát triển có thể gợi ý phần tử nào giữ nguyên qua các lần render bằng thuộc tính \"key\" ổn định và duy nhất.",
            "tag": "React Core"
      },
      {
            "id": 5,
            "front": "Sự khác biệt giữa React Server Components (RSC) và Server-Side Rendering (SSR) truyền thống là gì?",
            "back": "• SSR: Render HTML tĩnh trên server nhưng vẫn phải tải toàn bộ JavaScript của component về client để chạy quy trình Hydration.\n• RSC: Component chỉ chạy trên server và KHÔNG BAO GIỜ gửi mã JS về client, giúp bundle size bằng 0KB đối với các thư viện nặng (Markdown parser, date-fns).",
            "tag": "Next.js & RSC"
      },
      {
            "id": 6,
            "front": "Hook \"useTransition\" trong React 18/19 dùng để làm gì?",
            "back": "Đánh dấu một cập nhật trạng thái (State Update) là \"không khẩn cấp\" (Transition). Cho phép giao diện phản hồi ngay lập tức với các thao tác gõ phím của người dùng trong khi tác vụ nặng (như lọc danh sách 10,000 phần tử) đang được render ngầm trong nền.",
            "tag": "React 19"
      },
      {
            "id": 7,
            "front": "Hook \"useDeferredValue\" khác gì so với kĩ thuật Debounce truyền thống?",
            "back": "• Debounce: Trì hoãn thực thi một khoảng thời gian cố định (ví dụ 300ms) bất kể máy người dùng mạnh hay yếu.\n• useDeferredValue: Tự động điều chỉnh thích ứng với tốc độ phần cứng; render giá trị mới ngay khi CPU rảnh, không bị delay nhân tạo trên máy mạnh.",
            "tag": "React 19"
      },
      {
            "id": 8,
            "front": "Nguyên lý hoạt động của React 19 Action State (`useActionState`) là gì?",
            "back": "Tự động quản lý vòng đời của một hàm bất đồng bộ (Action): bao gồm trạng thái đang gửi (`isPending`), dữ liệu phản hồi (`state`), và xử lý lỗi mà không cần viết boilerplate `setIsLoading(true/false)`.",
            "tag": "React 19"
      },
      {
            "id": 9,
            "front": "Trong CSS, tại sao các thuộc tính \"transform\" và \"opacity\" lại có hiệu năng animation 60fps mượt mà hơn \"top\", \"left\", \"width\"?",
            "back": "Vì transform và opacity được xử lý trực tiếp trên GPU thông qua Compositor Thread mà không kích hoạt chu trình tính toán lại bố cục (Reflow / Layout) và vẽ lại điểm ảnh (Repaint) trên CPU Main Thread.",
            "tag": "Web Performance"
      },
      {
            "id": 10,
            "front": "Ba chỉ số Web Vitals cốt lõi (Core Web Vitals) của Google đo lường trải nghiệm người dùng gồm những gì?",
            "back": "1. LCP (Largest Contentful Paint): Tốc độ tải nội dung lớn nhất (tốt khi < 2.5s).\n2. INP (Interaction to Next Paint): Độ phản hồi tương tác (tốt khi < 200ms).\n3. CLS (Cumulative Layout Shift): Độ ổn định thị giác, tránh giật nhảy layout (tốt khi < 0.1).",
            "tag": "Web Vitals"
      },
      {
            "id": 11,
            "front": "Sự khác biệt giữa Arrow Function và Regular Function trong JavaScript liên quan đến từ khóa \"this\"?",
            "back": "Arrow function không có ngữ cảnh \"this\" riêng; nó kế thừa \"this\" từ lexical scope nơi nó được định nghĩa. Nó cũng không có đối tượng \"arguments\" và không thể dùng làm Constructor với từ khóa \"new\".",
            "tag": "JS Core"
      },
      {
            "id": 12,
            "front": "Khái niệm \"Prototype Chaining\" trong JavaScript hoạt động như thế nào?",
            "back": "Mỗi object đều có một liên kết nội bộ `[[Prototype]]` (truy cập qua `__proto__`). Khi truy cập một thuộc tính không tồn tại trên object, JS engine sẽ lần lượt tìm ngược lên prototype của nó cho tới khi gặp `Object.prototype` (hoặc null).",
            "tag": "JS Core"
      },
      {
            "id": 13,
            "front": "Sự khác biệt giữa WeakMap và Map trong JavaScript là gì?",
            "back": "WeakMap chỉ chấp nhận Object làm key và giữ tham chiếu yếu (Weak Reference). Khi object đó không còn tham chiếu nào khác trong chương trình, nó sẽ tự động được Garbage Collector thu dọn rác, ngăn ngừa memory leak.",
            "tag": "JS Core"
      },
      {
            "id": 14,
            "front": "Kỹ thuật \"Tree Shaking\" trong các bundler (Vite, Rollup, Webpack) hoạt động dựa trên cơ chế nào?",
            "back": "Dựa trên cú pháp tĩnh của ES Modules (`import` / `export`). Vì các module được phân tích tĩnh tại thời điểm biên dịch (build time), bundler có thể loại bỏ an toàn (dead code elimination) các hàm không bao giờ được gọi.",
            "tag": "Web Tooling"
      },
      {
            "id": 15,
            "front": "CORS (Cross-Origin Resource Sharing) là cơ chế bảo mật do ai thực thi: Trình duyệt hay Server?",
            "back": "TRÌNH DUYỆT THỰC THI.\nServer vẫn nhận request và xử lý bình thường, nhưng trình duyệt sẽ kiểm tra header `Access-Control-Allow-Origin` từ response; nếu không khớp origin thì trình duyệt sẽ chặn không cho JavaScript đọc kết quả.",
            "tag": "Security"
      },
      {
            "id": 16,
            "front": "Tấn công XSS (Cross-Site Scripting) và CSRF (Cross-Site Request Forgery) khác nhau như thế nào?",
            "back": "• XSS: Kẻ tấn công tiêm mã JavaScript độc hại vào trang web nạn nhân để đánh cắp Cookie, LocalStorage hoặc session token.\n• CSRF: Kẻ tấn công lừa trình duyệt của nạn nhân gửi request giả mạo mang theo Cookie xác thực hợp lệ tới server mục tiêu (ví dụ chuyển tiền).",
            "tag": "Security"
      },
      {
            "id": 17,
            "front": "Cách phòng chống tấn công CSRF hiệu quả nhất hiện nay là gì?",
            "back": "1. Sử dụng thuộc tính `SameSite=Strict` hoặc `SameSite=Lax` cho Auth Cookie.\n2. Áp dụng cơ chế Anti-CSRF Token (Synchronizer Token Pattern).\n3. Sử dụng Header tùy biến (Custom Headers như `X-Requested-With`) cho các API RESTful.",
            "tag": "Security"
      },
      {
            "id": 18,
            "front": "Chỉ số B-Tree Index trong cơ sở dữ liệu quan hệ (PostgreSQL, MySQL) tăng tốc câu lệnh SELECT như thế nào?",
            "back": "Tổ chức dữ liệu theo cây cân bằng nhiều nhánh được sắp xếp thứ tự. Cho phép tìm kiếm bản ghi với độ phức tạp O(log N) thay vì phải quét toàn bộ bảng (Full Table Scan O(N)).",
            "tag": "Database"
      },
      {
            "id": 19,
            "front": "Quy tắc \"Leftmost Prefix\" khi sử dụng Composite Index (chỉ mục kết hợp nhiều cột) là gì?",
            "back": "Nếu tạo index trên (colA, colB, colC), truy vấn chỉ tận dụng được index nếu điều kiện WHERE chứa colA (hoặc colA + colB, hoặc cả 3). Nếu WHERE chỉ chứa colB hoặc colC thì index vô tác dụng.",
            "tag": "Database"
      },
      {
            "id": 20,
            "front": "Tính chất ACID trong giao dịch cơ sở dữ liệu (Database Transactions) đại diện cho những gì?",
            "back": "• A (Atomicity): Tính nguyên tử - Tất cả thành công hoặc tất cả rollback.\n• C (Consistency): Tính nhất quán - Dữ liệu luôn thỏa mãn mọi ràng buộc toàn vẹn.\n• I (Isolation): Tính độc lập - Các giao dịch đồng thời không can thiệp lẫn nhau.\n• D (Durability): Tính bền vững - Dữ liệu đã commit được lưu vĩnh viễn trên đĩa.",
            "tag": "Database"
      },
      {
            "id": 21,
            "front": "Bốn mức độ cô lập giao dịch (Transaction Isolation Levels) từ thấp đến cao là gì?",
            "back": "1. Read Uncommitted (cho phép Dirty Read).\n2. Read Committed (chống Dirty Read, có thể bị Non-repeatable Read).\n3. Repeatable Read (chống Non-repeatable Read, có thể bị Phantom Read).\n4. Serializable (cô lập tuyệt đối, hiệu năng thấp nhất).",
            "tag": "Database"
      },
      {
            "id": 22,
            "front": "Chiến lược caching \"Cache-Aside\" (Lazy Loading) hoạt động ra sao?",
            "back": "1. Ứng dụng kiểm tra dữ liệu trong Cache (Redis).\n2. Nếu Cache Hit: Trả về ngay cho client.\n3. Nếu Cache Miss: Đọc từ Database, ghi ngược lại vào Cache với TTL, rồi trả về cho client.",
            "tag": "System Design"
      },
      {
            "id": 23,
            "front": "Vấn đề \"Cache Avalanche\" (Tuyết lở cache) là gì và cách phòng tránh?",
            "back": "Xảy ra khi hàng triệu key trong Cache hết hạn đồng thời cùng một giây, khiến toàn bộ request đổ dồn vào Database làm sập hệ thống.\n💡 Phòng tránh: Thêm một giá trị ngẫu nhiên (Jitter) vào thời gian TTL của mỗi key (ví dụ: TTL = 3600s + random(0, 300s)).",
            "tag": "System Design"
      },
      {
            "id": 24,
            "front": "Vấn đề \"Cache Breakdown\" (Điểm nóng cache) khác gì so với Cache Avalanche?",
            "back": "Xảy ra khi đúng MỘT key cực hot (ví dụ sự kiện flash sale iPhone) hết hạn, hàng chục ngàn request đồng thời query vào DB.\n💡 Phòng tránh: Sử dụng Mutex Lock (chỉ 1 request được quyền query DB và update cache) hoặc cập nhật key bất đồng bộ trước khi hết hạn.",
            "tag": "System Design"
      },
      {
            "id": 25,
            "front": "Định lý CAP (CAP Theorem) phát biểu điều gì về hệ thống phân tán?",
            "back": "Một hệ thống phân tán chỉ có thể đảm bảo tối đa 2 trong 3 yếu tố:\n• C (Consistency): Mọi node thấy cùng một dữ liệu cùng một lúc.\n• A (Availability): Mọi request đều nhận được phản hồi không lỗi.\n• P (Partition Tolerance): Hệ thống vẫn hoạt động khi mạng giữa các node bị đứt kết nối.",
            "tag": "Distributed Systems"
      },
      {
            "id": 26,
            "front": "Sự khác biệt cốt lõi giữa Apache Kafka và RabbitMQ là gì?",
            "back": "• RabbitMQ: Message Broker truyền thống dựa trên hàng đợi (Queue), xóa message sau khi consumer xác nhận (ACK). Phù hợp định tuyến phức tạp.\n• Kafka: Distributed Commit Log phân vùng, lưu trữ message tuần tự trên đĩa có thời hạn, cho phép nhiều consumer đọc lại dữ liệu theo offset độc lập.",
            "tag": "Message Queue"
      },
      {
            "id": 27,
            "front": "Nguyên lý hoạt động của cấu trúc mã JSON Web Token (JWT) gồm 3 phần nào?",
            "back": "Gồm 3 phần nối nhau bằng dấu chấm (Header.Payload.Signature):\n1. Header: Thuật toán mã hóa (HS256, RS256) và loại token.\n2. Payload: Dữ liệu chứa claims (userId, role, exp).\n3. Signature: Chữ ký HMAC/RSA của Header + Payload bằng Secret Key.",
            "tag": "Security"
      },
      {
            "id": 28,
            "front": "Tại sao không bao giờ nên lưu thông tin nhạy cảm (mật khẩu, số thẻ tín dụng) trong JWT Payload?",
            "back": "Vì JWT Payload chỉ được mã hóa dạng Base64URL chứ không được mã hóa bảo mật (Encryption). Bất kỳ ai bắt được token đều có thể decode và đọc toàn bộ nội dung dễ dàng.",
            "tag": "Security"
      },
      {
            "id": 29,
            "front": "Cơ chế WebSocket khác biệt gì so với HTTP Long-Polling?",
            "back": "WebSocket thiết lập một kết nối TCP song công toàn phần (Full-duplex) duy nhất sau cái bắt tay HTTP ban đầu, cho phép cả Client và Server chủ động gửi dữ liệu tức thời với overhead cực nhỏ (chỉ 2-10 bytes header).",
            "tag": "Networking"
      },
      {
            "id": 30,
            "front": "Kỹ thuật Database Sharding (Phân mảnh ngang) giải quyết bài toán gì?",
            "back": "Chia nhỏ một bảng dữ liệu khổng lồ (hàng trăm triệu dòng) thành nhiều database độc lập vật lý dựa trên Shard Key (ví dụ: User ID % số shard), giúp giảm tải I/O và vượt qua giới hạn lưu trữ của 1 server đơn lẻ.",
            "tag": "Database"
      },
      {
            "id": 31,
            "front": "Sự khác biệt giữa Deep Copy và Shallow Copy trong JavaScript là gì?",
            "back": "• Shallow Copy (Object.assign, spread {...}): Chỉ sao chép các giá trị nguyên thủy ở cấp 1; các object lồng nhau vẫn dùng chung vùng nhớ tham chiếu.\n• Deep Copy (`structuredClone()`, JSON.parse(JSON.stringify)): Tạo bản sao độc lập hoàn toàn cho mọi cấp lồng nhau.",
            "tag": "JS Core"
      },
      {
            "id": 32,
            "front": "Tại sao React đòi hỏi State phải mang tính chất \"Immutable\" (Bất biến)?",
            "back": "Để React có thể thực hiện so sánh tham chiếu nông (Shallow Equality Check `prevProps !== nextProps`) cực nhanh trong O(1) mà không cần duyệt đệ quy sâu toàn bộ cây dữ liệu để phát hiện thay đổi.",
            "tag": "React Core"
      },
      {
            "id": 33,
            "front": "Kỹ thuật Virtualization (Windowing) cho danh sách dài (như react-window) hoạt động ra sao?",
            "back": "Chỉ render vào cây DOM các phần tử đang nằm trong khung nhìn hiển thị (Viewport) của màn hình cộng thêm một vài phần tử đệm (overscan), giữ số lượng DOM node cố định (khoảng 20-30 nodes) dù danh sách có 100,000 dòng.",
            "tag": "Web Performance"
      },
      {
            "id": 34,
            "front": "Khái niệm \"Content Delivery Network\" (CDN) cải thiện tốc độ tải web như thế nào?",
            "back": "Phân phối các file tĩnh (HTML, CSS, JS, hình ảnh) lên một mạng lưới máy chủ biên (Edge Servers) đặt rải rác khắp toàn cầu, phục vụ người dùng từ máy chủ có khoảng cách địa lý gần nhất để giảm thiểu độ trễ RTT (Round Trip Time).",
            "tag": "Networking"
      },
      {
            "id": 35,
            "front": "Mã trạng thái HTTP 304 (Not Modified) có ý nghĩa gì trong cơ chế HTTP Caching?",
            "back": "Báo cho trình duyệt biết tài nguyên trên server chưa hề thay đổi so với bản lưu trong cache trình duyệt (dựa trên header `ETag` hoặc `If-Modified-Since`), trình duyệt lấy trực tiếp từ ổ đĩa mà không cần tải lại body.",
            "tag": "Networking"
      },
      {
            "id": 36,
            "front": "Khái niệm \"Service Worker\" trong Progressive Web App (PWA) làm được những gì?",
            "back": "Là một script chạy ngầm độc lập với trang web trên luồng riêng, có khả năng chặn bắt mọi network request, lưu trữ offline vào Cache Storage và nhận thông báo đẩy (Push Notifications).",
            "tag": "PWA"
      },
      {
            "id": 37,
            "front": "Sự khác biệt giữa Gzip và Brotli trong nén tài nguyên web là gì?",
            "back": "Brotli (br) sử dụng từ điển tĩnh gồm các từ khóa HTML/CSS/JS phổ biến, mang lại tỷ lệ nén tốt hơn Gzip từ 15% đến 25%, giúp tải file văn bản nhanh hơn đáng kể.",
            "tag": "Web Performance"
      },
      {
            "id": 38,
            "front": "Thuật toán Load Balancing \"Consistent Hashing\" giải quyết bài toán gì trong hệ thống phân tán?",
            "back": "Phân phối request tới các server trên một vòng tròn băm (Hash Ring). Khi thêm hoặc bớt một server, chỉ có k/N phần tử bị di chuyển vị trí thay vì phải re-hash lại toàn bộ dữ liệu như phép chia `% N` thông thường.",
            "tag": "System Design"
      },
      {
            "id": 39,
            "front": "Khái niệm \"Rate Limiting: Token Bucket\" hoạt động ra sao?",
            "back": "Một chiếc xô chứa các token được bơm vào với tốc độ cố định. Mỗi request đến sẽ tiêu thụ 1 token; nếu xô hết token, request bị từ chối (HTTP 429 Too Many Requests). Thuật toán này cho phép xử lý các đợt lưu lượng tăng đột biến (Burst traffic).",
            "tag": "System Design"
      },
      {
            "id": 40,
            "front": "Khái niệm \"Eventual Consistency\" (Tính nhất quán cuối cùng) trong NoSQL là gì?",
            "back": "Mô hình đảm bảo rằng nếu không có cập nhật mới nào diễn ra, sau một khoảng thời gian trễ nhất định, tất cả các bản sao dữ liệu (replicas) trên các node sẽ đồng nhất với nhau.",
            "tag": "Distributed Systems"
      },
      {
            "id": 41,
            "front": "Thuộc tính `rel=\"noopener noreferrer\"` trên thẻ `<a>` có tác dụng bảo mật gì?",
            "back": "• noopener: Ngăn trang web mới truy cập vào `window.opener` của trang gốc, tránh bị tấn công Reverse Tabnabbing (chuyển hướng trang gốc sang trang lừa đảo).\n• noreferrer: Không gửi thông tin URL nguồn trong HTTP Referer header.",
            "tag": "Security"
      },
      {
            "id": 42,
            "front": "Cơ chế Garbage Collection: \"Generational Hypothesis\" trong V8 Engine giả định điều gì?",
            "back": "Giả định rằng đa số các object trong JavaScript \"chết yểu\" ngay sau khi vừa được cấp phát (ví dụ các biến cục bộ trong hàm). V8 chia bộ nhớ thành Young Generation (thu gom nhanh bằng Scavenger) và Old Generation (thu gom bằng Mark-Sweep-Compact).",
            "tag": "JS Engine"
      },
      {
            "id": 43,
            "front": "Khái niệm \"Idempotency\" (Tính lũy kế / Bất biến sau nhiều lần gọi) của HTTP Method nghĩa là gì?",
            "back": "Một phương thức được coi là Idempotent nếu việc gọi nó 1 lần hay 100 lần với cùng tham số đều tạo ra trạng thái kết quả tương đương trên server (GET, PUT, DELETE là Idempotent; POST không phải).",
            "tag": "API Design"
      },
      {
            "id": 44,
            "front": "Vấn đề N+1 Query trong ORM (Prisma, TypeORM, Hibernate) xuất hiện khi nào và cách khắc phục?",
            "back": "Xuất hiện khi query 1 danh sách N bản ghi cha, sau đó với mỗi bản ghi lại thực hiện thêm 1 câu query riêng để lấy quan hệ con (tổng cộng 1 + N câu SQL).\n💡 Khắc phục: Sử dụng Eager Loading (`JOIN`) hoặc cơ chế Batch Loading (DataLoader).",
            "tag": "Database"
      },
      {
            "id": 45,
            "front": "Khái niệm \"Connection Pooling\" trong cơ sở dữ liệu có lợi ích gì?",
            "back": "Duy trì sẵn một tập hợp các kết nối TCP đã xác thực tới DB. Các luồng xử lý có thể tái sử dụng ngay lập tức mà không phải tốn chi phí đắt đỏ mở bắt tay TCP 3 bước và xác thực SSL cho mỗi câu query.",
            "tag": "Database"
      },
      {
            "id": 46,
            "front": "Sự khác biệt giữa Cookie, LocalStorage và SessionStorage là gì?",
            "back": "• Cookie: Tối đa 4KB, tự động gửi kèm mỗi HTTP request tới server, có thuộc tính HttpOnly, Secure, SameSite.\n• LocalStorage: Khoảng 5-10MB, lưu vĩnh viễn trên client đến khi bị xóa thủ công, không gửi kèm network request.\n• SessionStorage: Giống LocalStorage nhưng tự động xóa khi đóng tab trình duyệt.",
            "tag": "Web Storage"
      },
      {
            "id": 47,
            "front": "Cơ chế \"Font Display: swap\" trong CSS `@font-face` giải quyết vấn đề gì?",
            "back": "Giải quyết hiện tượng FOIT (Flash of Invisible Text) - văn bản bị vô hình trong lúc chờ tải font web; hiển thị font dự phòng của hệ thống ngay lập tức và hoán đổi sang custom font khi tải xong.",
            "tag": "Web Performance"
      },
      {
            "id": 48,
            "front": "Trong Docker, sự khác biệt giữa Image và Container là gì?",
            "back": "• Image: Bản thiết kế tĩnh chỉ đọc (Read-only template) chứa mã nguồn, môi trường runtime và các thư viện phụ thuộc.\n• Container: Thể hiện đang chạy thực tế (Runtime instance) của Image, có một lớp ghi (Read-Write layer) độc lập.",
            "tag": "DevOps"
      },
      {
            "id": 49,
            "front": "Khái niệm \"CI/CD Pipeline\" bao gồm những giai đoạn tự động hóa nào?",
            "back": "• CI (Continuous Integration): Tự động lint code, build và chạy bộ unit test mỗi khi developer push commit lên git branch.\n• CD (Continuous Delivery/Deployment): Tự động đóng gói container và triển khai lên môi trường Staging/Production khi pass CI.",
            "tag": "DevOps"
      },
      {
            "id": 50,
            "front": "Sự khác biệt giữa Vertical Scaling (Scale Up) và Horizontal Scaling (Scale Out) là gì?",
            "back": "• Vertical Scaling: Nâng cấp phần cứng của 1 server hiện tại (tăng thêm CPU, RAM, SSD). Bị giới hạn vật lý và có điểm nghẽn đơn độc (SPOF).\n• Horizontal Scaling: Thêm nhiều server chạy song song phía sau Load Balancer. Cho phép mở rộng quy mô gần như vô hạn.",
            "tag": "System Design"
      },
      {
            "id": 51,
            "front": "Khái niệm \"Circuit Breaker Pattern\" trong kiến trúc Microservices làm gì?",
            "back": "Tự động ngắt kết nối (Open State) và trả về phản hồi fallback ngay lập tức khi một service hạ tầng phía sau bị lỗi liên tục, ngăn ngừa lỗi lan chuyền (Cascading Failure) làm sập toàn bộ hệ thống.",
            "tag": "Microservices"
      },
      {
            "id": 52,
            "front": "Mô hình lập trình hướng bất đồng bộ (Reactive Programming) với RxJS dựa trên 2 khái niệm cốt lõi nào?",
            "back": "• Observable: Nguồn phát luồng dữ liệu (Data Stream) theo thời gian.\n• Observer: Đối tượng lắng nghe và xử lý dữ liệu phát ra thông qua 3 hàm callback: `next()`, `error()`, và `complete()`.",
            "tag": "Frontend Arch"
      },
      {
            "id": 53,
            "front": "Khái niệm \"Database Replication: Master-Slave\" hoạt động ra sao?",
            "back": "Tất cả các thao tác ghi (INSERT, UPDATE, DELETE) được thực hiện trên Master Node; dữ liệu sau đó được đồng bộ sang các Slave/Replica Nodes chuyên phục vụ các thao tác đọc (SELECT), tăng năng lực chịu tải đọc.",
            "tag": "Database"
      },
      {
            "id": 54,
            "front": "Header bảo mật \"Strict-Transport-Security\" (HSTS) bảo vệ người dùng khỏi nguy cơ gì?",
            "back": "Ép buộc trình duyệt chỉ được phép giao tiếp với trang web qua giao thức mã hóa HTTPS an toàn, chặn hoàn toàn các cuộc tấn công hạ cấp giao thức SSL Stripping trung gian (Man-in-the-Middle).",
            "tag": "Security"
      },
      {
            "id": 55,
            "front": "Tại sao việc so sánh 2 floating-point `0.1 + 0.2 === 0.3` trong JavaScript lại trả về `false`?",
            "back": "Do chuẩn số thực IEEE 754 biểu diễn số thập phân dưới dạng nhị phân cơ số 2 gây ra sai số làm tròn tuần hoàn (kết quả thực tế là `0.30000000000000004`).\n💡 Khắc phục: Sử dụng `Number.EPSILON` hoặc thư viện BigNumber.",
            "tag": "JS Core"
      }
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
    title: 'Từ Vựng IELTS Academic 8.0+ & Collocations Viết Luận (Band 8 Prep)',
    subtitle: '55 Cặp từ học thuật C1-C2 nâng band Writing Task 2 & Speaking thần tốc',
    category: 'ngoai-ngu',
    categoryLabel: 'IELTS Chuyên Sâu Band 8.0+',
    badge: 'IELTS Khuyên Dùng #1',
    priceXu: 22,
    originalPriceXu: 55,
    rating: 4.97,
    reviewsCount: 1450,
    studentsCount: 3820,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', 'Ebook 120 Collocations C1-C2', 'Template 20 Mẫu Câu Mở Bài Điểm Tuyệt Đối'],
    description: 'Chấm dứt lối viết vụng về, lặp từ và các cấu trúc sáo rỗng. Nạp ngay 55 từ vựng học thuật tinh hoa cùng Collocations chuẩn học giả thuộc các chủ đề hóc búa nhất: Climate Change, Artificial Intelligence, Globalization, Urban Planning và Economics.',
    highlights: [
      '55 Thẻ Anki phân loại theo chủ đề essay thực tế bám sát Cambridge IELTS',
      'Đầy đủ phiên âm IPA, giải nghĩa ngữ cảnh và từ đồng nghĩa/trái nghĩa',
      'Mẹo tránh bẫy dùng từ sáo rỗng (Cliché) bị giám khảo trừ điểm Lexical Resource',
      '100% câu ví dụ học thuật chuẩn Oxford & Cambridge Corpus'
    ],
    previewCards: [
      {
            "id": 1,
            "front": "anthropogenic /ˌæn.θrə.pəˈdʒen.ɪk/ (adj)",
            "back": "Nghĩa: Do con người gây ra (đặc biệt là tác động môi trường).\nCollocation: Anthropogenic climate change / Anthropogenic emissions.\nVí dụ: Scientists have proven that global warming is predominantly anthropogenic.",
            "tag": "Environment"
      },
      {
            "id": 2,
            "front": "exacerbate /ɪɡˈzæs.ə.beɪt/ (verb)",
            "back": "Nghĩa: Làm trầm trọng thêm, làm tồi tệ hơn (to make something worse).\nSynonym: Worsen, aggravate | Antonym: Alleviate, mitigate.\nVí dụ: The ongoing heatwave has severely exacerbated the water shortage in rural areas.",
            "tag": "Academic Writing"
      },
      {
            "id": 3,
            "front": "ubiquitous /juːˈbɪk.wə.təs/ (adj)",
            "back": "Nghĩa: Phổ biến ở khắp mọi nơi (present, appearing, or found everywhere).\nCollocation: Ubiquitous presence / Ubiquitous technology.\nVí dụ: Smartphones have become ubiquitous in modern urban societies.",
            "tag": "Technology"
      },
      {
            "id": 4,
            "front": "paradigm shift /ˈpær.ə.daɪm ʃɪft/ (noun)",
            "back": "Nghĩa: Sự thay đổi căn bản trong tư duy, bước ngoặt mô thức.\nVí dụ: The advent of generative artificial intelligence represents a profound paradigm shift in education.",
            "tag": "Science & Society"
      },
      {
            "id": 5,
            "front": "mitigate /ˈmɪt.ɪ.ɡeɪt/ (verb)",
            "back": "Nghĩa: Giảm nhẹ, làm dịu bớt tác hại (to make something less harmful).\nCollocation: Mitigate climate risks / Mitigate negative consequences.\nVí dụ: Planting urban forests is an effective way to mitigate heat island effects.",
            "tag": "Environment"
      },
      {
            "id": 6,
            "front": "curb /kɜːb/ (verb & noun)",
            "back": "Nghĩa: Kiềm chế, kìm hãm, hạn chế (to control or limit something).\nCollocation: Curb carbon emissions / Curb inflation.\nVí dụ: The government introduced steep tax hikes to curb vehicular pollution.",
            "tag": "Government"
      },
      {
            "id": 7,
            "front": "substantiate /səbˈstæn.ʃi.eɪt/ (verb)",
            "back": "Nghĩa: Chứng minh bằng căn cứ hoặc chứng cứ xác thực (to provide evidence to support).\nSynonym: Corroborate, validate | Antonym: Disprove.\nVí dụ: The researcher failed to substantiate his claims with empirical data.",
            "tag": "Research"
      },
      {
            "id": 8,
            "front": "ephemeral /ɪˈfem.ər.əl/ (adj)",
            "back": "Nghĩa: Phù du, chóng tàn, tồn tại trong thời gian rất ngắn.\nSynonym: Transient, fleeting | Antonym: Permanent, enduring.\nVí dụ: Social media fame is often ephemeral, fading within a matter of weeks.",
            "tag": "Culture"
      },
      {
            "id": 9,
            "front": "disseminate /dɪˈsem.ɪ.neɪt/ (verb)",
            "back": "Nghĩa: Truyền bá, phổ biến rộng rãi (thông tin, kiến thức).\nCollocation: Disseminate information / Disseminate scientific findings.\nVí dụ: The WHO works tirelessly to disseminate vital health guidelines globally.",
            "tag": "Education"
      },
      {
            "id": 10,
            "front": "inextricably /ˌɪn.ɪkˈstrɪk.ə.bli/ (adv)",
            "back": "Nghĩa: Gắn bó khăng khít, không thể tách rời.\nCollocation: Inextricably linked / Inextricably intertwined.\nVí dụ: Economic prosperity is inextricably linked to accessible public healthcare.",
            "tag": "Society"
      },
      {
            "id": 11,
            "front": "proliferation /prəˌlɪf.əˈreɪ.ʃən/ (noun)",
            "back": "Nghĩa: Sự sinh sôi nảy nở nhanh chóng, sự bùng nổ số lượng.\nCollocation: Proliferation of digital devices / Proliferation of fake news.\nVí dụ: The rapid proliferation of fast food outlets has contributed to rising childhood obesity.",
            "tag": "Health"
      },
      {
            "id": 12,
            "front": "pragmatic /præɡˈmæt.ɪk/ (adj)",
            "back": "Nghĩa: Thực tế, thực dụng, dựa trên tính khả thi thay vì lý thuyết suông.\nSynonym: Realistic, practical | Antonym: Idealistic.\nVí dụ: Policymakers need to adopt a pragmatic approach to renewable energy transition.",
            "tag": "Policy"
      },
      {
            "id": 13,
            "front": "juxtapose /ˌdʒʌk.stəˈpəʊz/ (verb)",
            "back": "Nghĩa: Đặt hai thứ cạnh nhau để so sánh sự đối lập, tương phản.\nNoun: Juxtaposition.\nVí dụ: The documentary juxtaposes extreme urban luxury with grueling suburban poverty.",
            "tag": "Essay Analysis"
      },
      {
            "id": 14,
            "front": "alleviate /əˈliː.vi.eɪt/ (verb)",
            "back": "Nghĩa: Làm giảm bớt nỗi đau, nghèo đói hoặc gánh nặng.\nCollocation: Alleviate poverty / Alleviate suffering / Alleviate traffic congestion.\nVí dụ: Subsidized public transit helps alleviate traffic congestion during peak rush hours.",
            "tag": "Urbanization"
      },
      {
            "id": 15,
            "front": "indispensable /ˌɪn.dɪˈspen.sə.bəl/ (adj)",
            "back": "Nghĩa: Tuyệt đối không thể thiếu được (absolutely necessary).\nSynonym: Vital, crucial, essential.\nVí dụ: Critical thinking is an indispensable skill for university students.",
            "tag": "Education"
      },
      {
            "id": 16,
            "front": "concomitant /kənˈkɒm.ɪ.tənt/ (adj & noun)",
            "back": "Nghĩa: Đi kèm, xảy ra đồng thời như một hệ quả tất yếu.\nVí dụ: Rapid economic industrialization has brought concomitant environmental degradation.",
            "tag": "Economics"
      },
      {
            "id": 17,
            "front": "preclude /prɪˈkluːd/ (verb)",
            "back": "Nghĩa: Ngăn chặn, loại trừ trước khả năng xảy ra (to prevent something from happening).\nVí dụ: Lack of formal qualifications does not necessarily preclude entrepreneurial success.",
            "tag": "Business"
      },
      {
            "id": 18,
            "front": "specious /ˈspiː.ʃəs/ (adj)",
            "back": "Nghĩa: Trông có vẻ đúng nhưng thực chất là sai lệch, ngụy biện (seemingly plausible but wrong).\nCollocation: Specious argument / Specious reasoning.\nVí dụ: The claim that cutting environmental regulations creates jobs is fundamentally specious.",
            "tag": "Critical Thinking"
      },
      {
            "id": 19,
            "front": "delineate /dɪˈlɪn.i.eɪt/ (verb)",
            "back": "Nghĩa: Phác thảo, mô tả chi tiết và rõ ràng ranh giới.\nVí dụ: The contract clearly delineates the specific responsibilities of each partner.",
            "tag": "Academic Writing"
      },
      {
            "id": 20,
            "front": "inimical /ɪˈnɪm.ɪ.kəl/ (adj)",
            "back": "Nghĩa: Có hại, gây bất lợi, thù địch (tending to obstruct or harm).\nVí dụ: Excessive air pollution is inimical to long-term public health and cognitive function.",
            "tag": "Health"
      },
      {
            "id": 21,
            "front": "resilient /rɪˈzɪl.i.ənt/ (adj)",
            "back": "Nghĩa: Kiên cường, có khả năng phục hồi nhanh sau nghịch cảnh.\nNoun: Resilience.\nVí dụ: Coastal communities must build resilient infrastructure to withstand rising sea levels.",
            "tag": "Environment"
      },
      {
            "id": 22,
            "front": "quintessential /ˌkwɪn.tɪˈsen.ʃəl/ (adj)",
            "back": "Nghĩa: Đại diện hoàn hảo nhất, tinh túy nhất của một kiểu mẫu.\nVí dụ: The Sydney Opera House is the quintessential example of modernist architecture.",
            "tag": "Culture"
      },
      {
            "id": 23,
            "front": "inherent /ɪnˈher.ənt/ (adj)",
            "back": "Nghĩa: Vốn có, cố hữu, không thể tách rời bản chất (existing as a natural part).\nCollocation: Inherent risk / Inherent flaw.\nVí dụ: Volatility is an inherent characteristic of cryptocurrency financial markets.",
            "tag": "Economics"
      },
      {
            "id": 24,
            "front": "cogent /ˈkəʊ.dʒənt/ (adj)",
            "back": "Nghĩa: Thuyết phục, chặt chẽ, hợp logic (clear, logical, and convincing).\nCollocation: Cogent argument / Cogent explanation.\nVí dụ: The author presents a cogent case for criminal justice reform.",
            "tag": "Essay Band 8+"
      },
      {
            "id": 25,
            "front": "belie /bɪˈlaɪ/ (verb)",
            "back": "Nghĩa: Đem lại ấn tượng sai lệch, che giấu sự thật (fail to give a true impression of).\nVí dụ: Her calm demeanor belied the immense anxiety she was feeling before the interview.",
            "tag": "Psychology"
      },
      {
            "id": 26,
            "front": "hackneyed /ˈhæk.nid/ (adj)",
            "back": "Nghĩa: Sáo rỗng, rập khuôn do bị lạm dụng quá nhiều.\nSynonym: Clichéd, trite, overused.\nVí dụ: Examiners penalize candidates who rely on hackneyed idioms like \"every coin has two sides\".",
            "tag": "IELTS Tips"
      },
      {
            "id": 27,
            "front": "precipitate /prɪˈsɪp.ɪ.teɪt/ (verb)",
            "back": "Nghĩa: Thúc đẩy hoặc châm ngòi cho một sự kiện xấu xảy ra bất ngờ.\nVí dụ: The sudden bankruptcy of the major investment bank precipitated an international financial panic.",
            "tag": "Economics"
      },
      {
            "id": 28,
            "front": "ambivalent /æmˈbɪv.ə.lənt/ (adj)",
            "back": "Nghĩa: Lưỡng lự, có cảm xúc mâu thuẫn vừa thích vừa không thích.\nNoun: Ambivalence.\nVí dụ: Public opinion remains ambivalent regarding the ethics of artificial intelligence.",
            "tag": "Society"
      },
      {
            "id": 29,
            "front": "capricious /kəˈprɪʃ.əs/ (adj)",
            "back": "Nghĩa: Thất thường, đồng bóng, dễ thay đổi tâm trạng không báo trước.\nVí dụ: Farmers are struggling to adapt to capricious weather patterns driven by climate instability.",
            "tag": "Environment"
      },
      {
            "id": 30,
            "front": "fortuitous /fɔːˈtʃuː.ɪ.təs/ (adj)",
            "back": "Nghĩa: May mắn ngẫu nhiên, tình cờ đem lại điều tốt đẹp.\nVí dụ: Their discovery of penicillin was entirely fortuitous, emerging from a contaminated petri dish.",
            "tag": "Science"
      },
      {
            "id": 31,
            "front": "lucrative /ˈluː.krə.tɪv/ (adj)",
            "back": "Nghĩa: Đem lại nguồn lợi nhuận kếch xù (producing a great deal of profit).\nCollocation: Lucrative career / Lucrative market.\nVí dụ: Software development has become one of the most lucrative industries globally.",
            "tag": "Business"
      },
      {
            "id": 32,
            "front": "plausible /ˈplɔː.zə.bəl/ (adj)",
            "back": "Nghĩa: Hợp lý, có vẻ đáng tin cậy (seeming reasonable or probable).\nAntonym: Implausible.\nVí dụ: The scientist proposed a highly plausible explanation for the sudden bird migration.",
            "tag": "Science"
      },
      {
            "id": 33,
            "front": "esoteric /ˌes.əˈter.ɪk/ (adj)",
            "back": "Nghĩa: Chuyên sâu, bí truyền, chỉ số ít chuyên gia mới hiểu được.\nVí dụ: Quantum cryptography remains an esoteric topic understood by very few mathematicians.",
            "tag": "Science"
      },
      {
            "id": 34,
            "front": "nefarious /nɪˈfeə.ri.əs/ (adj)",
            "back": "Nghĩa: Gian ác, bất chính, phạm pháp (wicked or criminal).\nVí dụ: Cybercriminals use nefarious software schemes to extort money from hospitals.",
            "tag": "Technology"
      },
      {
            "id": 35,
            "front": "volatile /ˈvɒl.ə.taɪl/ (adj)",
            "back": "Nghĩa: Biến động dữ dội, khó lường trước.\nNoun: Volatility.\nVí dụ: Crude oil prices have been exceptionally volatile due to geopolitical tensions in the region.",
            "tag": "Economics"
      },
      {
            "id": 36,
            "front": "salient /ˈseɪ.li.ənt/ (adj)",
            "back": "Nghĩa: Nổi bật nhất, đáng chú ý nhất (most noticeable or important).\nCollocation: Salient features / Salient points.\nVí dụ: The summary effectively highlights the most salient findings of the census report.",
            "tag": "Academic Writing"
      },
      {
            "id": 37,
            "front": "viable /ˈvaɪ.ə.bəl/ (adj)",
            "back": "Nghĩa: Có tính khả thi, có khả năng tồn tại và phát triển độc lập.\nCollocation: Economically viable / Viable alternative.\nVí dụ: Solar energy is now an economically viable alternative to fossil fuel power plants.",
            "tag": "Environment"
      },
      {
            "id": 38,
            "front": "ominous /ˈɒm.ɪ.nəs/ (adj)",
            "back": "Nghĩa: Báo điềm gở, mang tính đe dọa điềm xấu sắp tới.\nSynonym: Foreboding, sinister.\nVí dụ: The persistent drop in rainfall is an ominous sign for the upcoming agricultural harvest.",
            "tag": "Environment"
      },
      {
            "id": 39,
            "front": "intrinsic /ɪnˈtrɪn.zɪk/ (adj)",
            "back": "Nghĩa: Thuộc về bản chất bên trong, nội tại.\nCollocation: Intrinsic value / Intrinsic motivation.\nVí dụ: Reading for pleasure fosters intrinsic motivation in young students.",
            "tag": "Education"
      },
      {
            "id": 40,
            "front": "empirical /ɪmˈpɪr.ɪ.kəl/ (adj)",
            "back": "Nghĩa: Dựa trên kinh nghiệm thực nghiệm, quan sát thực tế chứ không phải lý thuyết.\nCollocation: Empirical evidence / Empirical research.\nVí dụ: Theories must be corroborated by empirical evidence before gaining consensus.",
            "tag": "Research"
      },
      {
            "id": 41,
            "front": "anomalous /əˈnɒm.ə.ləs/ (adj)",
            "back": "Nghĩa: Dị thường, chệch khỏi quy chuẩn bình thường.\nNoun: Anomaly.\nVí dụ: The meteorological station recorded anomalous temperatures exceeding historical averages.",
            "tag": "Science"
      },
      {
            "id": 42,
            "front": "reticent /ˈret.ɪ.sənt/ (adj)",
            "back": "Nghĩa: Kín tiếng, e dè, ít khi chia sẻ cảm xúc suy nghĩ.\nSynonym: Reserved, uncommunicative.\nVí dụ: Whistleblowers are often reticent to come forward due to fear of institutional retaliation.",
            "tag": "Society"
      },
      {
            "id": 43,
            "front": "tenacious /təˈneɪ.ʃəs/ (adj)",
            "back": "Nghĩa: Bền bỉ, ngoan cường, bám đuổi mục tiêu không chịu từ bỏ.\nNoun: Tenacity.\nVí dụ: The conservation team demonstrated tenacious commitment to rescuing the endangered rhinos.",
            "tag": "Society"
      },
      {
            "id": 44,
            "front": "voracious /vəˈreɪ.ʃəs/ (adj)",
            "back": "Nghĩa: Tham lam, ngấu nghiến, khao khát dữ dội.\nCollocation: Voracious reader / Voracious appetite.\nVí dụ: Highly successful academics tend to be voracious readers across multiple disciplines.",
            "tag": "Education"
      },
      {
            "id": 45,
            "front": "pristine /ˈprɪs.tiːn/ (adj)",
            "back": "Nghĩa: Nguyên sơ, hoang sơ, chưa bị bàn tay con người làm ô uế.\nCollocation: Pristine environment / Pristine condition.\nVí dụ: Strict zoning laws were established to preserve the pristine nature of the marine sanctuary.",
            "tag": "Environment"
      },
      {
            "id": 46,
            "front": "scrutinize /ˈskruː.tɪ.naɪz/ (verb)",
            "back": "Nghĩa: Soi xét kỹ lưỡng, kiểm tra tỉ mỉ từng chi tiết.\nNoun: Scrutiny.\nVí dụ: The regulatory agency continues to scrutinize the safety records of commercial airlines.",
            "tag": "Policy"
      },
      {
            "id": 47,
            "front": "obsolete /ˈɒb.sə.liːt/ (adj)",
            "back": "Nghĩa: Lỗi thời, bị đào thải và không còn được sử dụng nữa.\nVí dụ: Floppy disks and cassette tapes became completely obsolete with the rise of digital cloud storage.",
            "tag": "Technology"
      },
      {
            "id": 48,
            "front": "pervasive /pəˈveɪ.sɪv/ (adj)",
            "back": "Nghĩa: Lan tỏa khắp nơi, len lỏi vào mọi ngóc ngách xã hội.\nVí dụ: Smartphone addiction is becoming an increasingly pervasive issue among elementary schoolchildren.",
            "tag": "Society"
      },
      {
            "id": 49,
            "front": "unprecedented /ʌnˈpres.ɪ.den.tɪd/ (adj)",
            "back": "Nghĩa: Chưa từng có tiền lệ trong lịch sử.\nVí dụ: The global community witnessed an unprecedented surge in digital telecommuting during the pandemic.",
            "tag": "Society"
      },
      {
            "id": 50,
            "front": "homogeneous /ˌhɒm.əˈdʒiː.ni.əs/ (adj)",
            "back": "Nghĩa: Đồng nhất, thuần nhất về mặt chủng loại hoặc thành phần.\nAntonym: Heterogeneous.\nVí dụ: Globalization has transformed once homogeneous communities into culturally diverse hubs.",
            "tag": "Sociology"
      },
      {
            "id": 51,
            "front": "deteriorate /dɪˈtɪə.ri.ə.reɪt/ (verb)",
            "back": "Nghĩa: Xuống cấp, suy thoái dần về chất lượng hoặc sức khỏe.\nVí dụ: Living conditions in the refugee camps deteriorated dramatically after the flash floods.",
            "tag": "Society"
      },
      {
            "id": 52,
            "front": "lucid /ˈluː.sɪd/ (adj)",
            "back": "Nghĩa: Minh bạch, rõ ràng, dễ hiểu; đầu óc tỉnh táo.\nCollocation: Lucid explanation / Lucid dream.\nVí dụ: The professor gave a lucid explanation of complex quantum mechanics theories.",
            "tag": "Education"
      },
      {
            "id": 53,
            "front": "complacent /kəmˈpleɪ.sənt/ (adj)",
            "back": "Nghĩa: Tự mãn, bằng lòng với thực tại mà lơ là cảnh giác hiểm họa.\nNoun: Complacency.\nVí dụ: Established tech giants cannot afford to be complacent in an era of rapid AI disruption.",
            "tag": "Business"
      },
      {
            "id": 54,
            "front": "tenuous /ˈten.ju.əs/ (adj)",
            "back": "Nghĩa: Mong manh, yếu ớt, thiếu cơ sở vững chắc.\nCollocation: Tenuous link / Tenuous hold.\nVí dụ: The correlation drawn between sugar consumption and delinquency was deemed too tenuous.",
            "tag": "Research"
      },
      {
            "id": 55,
            "front": "subversive /səbˈvɜː.sɪv/ (adj)",
            "back": "Nghĩa: Mang tính lật đổ, phá vỡ trật tự hoặc chuẩn mực truyền thống.\nVí dụ: The underground street art movement was seen as a subversive critique of rampant consumerism.",
            "tag": "Culture"
      }
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
    subtitle: '50 Chữ Hán bẫy âm On/Kun và mẫu câu ngữ pháp điểm liệt kỳ thi JLPT',
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
      '50 Thẻ Anki chữ Hán bẫy âm và mẫu câu ngữ pháp then chốt N3 - N2',
      'Âm Hán Việt chuẩn xác giúp người Việt suy luận nghĩa nhanh như gió',
      'Đầy đủ ví dụ thực tế trích từ đề thi JLPT chính thức các năm gần nhất',
      'Ghi nhớ quy tắc chuyển âm On-On giúp thuộc 1 chữ biết thêm 10 chữ'
    ],
    previewCards: [
      {
            "id": 1,
            "front": "【Kanji】 構 (Hán Việt: CẤU)",
            "back": "Âm On: コウ (kou) | Âm Kun: かま・える, かま・う\nNghĩa: Cấu tạo, cấu thành, bận tâm.\n\n📌 Bộ thủ: Mộc (木) + Cấu (冓: đan chéo các thanh gỗ).\n📝 Từ vựng thi JLPT:\n• 構成 (こうせい): Cấu thành, cơ cấu.\n• 構造 (こうぞう): Cấu trúc.\n• 構わない (かまわない): Không sao, không bận tâm.",
            "tag": "Kanji N2"
      },
      {
            "id": 2,
            "front": "【Ngữ pháp】 ～にほかならない (~ ni hoka naranai)",
            "back": "Ý nghĩa: Chính là..., Không gì khác hơn là... (dùng để khẳng định lý do cốt lõi duy nhất).\n\n📌 Cấu trúc: N + にほかならない\n📝 Ví dụ: 今回の成功は、チーム全員の努力の結果にほかならない。\n(Thành công lần này chính là kết quả từ nỗ lực của toàn bộ thành viên trong đội).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 3,
            "front": "【Kanji】 慎 (Hán Việt: THẬN)",
            "back": "Âm On: シン (shin) | Âm Kun: つつし・む\nNghĩa: Cẩn thận, thận trọng, dè dặt.\n\n📝 Từ vựng thi JLPT:\n• 慎重 (しんちょう): Thận trọng (từ vựng N2 rất hay bẫy âm).\n• 慎む (つつしむ): Cẩn trọng lời ăn tiếng nói, kiềm chế.",
            "tag": "Kanji N2"
      },
      {
            "id": 4,
            "front": "【Ngữ pháp】 ～わけがない (~ wake ga nai)",
            "back": "Ý nghĩa: Tuyệt đối không thể có chuyện..., Làm sao mà... được (phủ định hoàn toàn dựa trên căn cứ rõ ràng).\n\n📌 Cấu trúc: V(thể thường) / A-i / A-na / N-no + わけがない\n📝 Ví dụ: あの真面目な彼が、嘘をつくわけがない。\n(Người nghiêm túc như anh ấy làm sao mà nói dối được!).",
            "tag": "Ngữ Pháp N3"
      },
      {
            "id": 5,
            "front": "【Kanji】 補 (Hán Việt: BỔ)",
            "back": "Âm On: ホ (ho) | Âm Kun: おぎな・う\nNghĩa: Bổ sung, đền bù, phụ tá.\n\n📝 Từ vựng thi JLPT:\n• 補充 (ほじゅう): Bổ sung thêm cho đủ.\n• 補償 (ほしょう): Đền bù, bồi thường.\n• 補う (おぎなう): Bù đắp (thiếu sót, lỗ hổng).",
            "tag": "Kanji N3"
      },
      {
            "id": 6,
            "front": "【Ngữ pháp】 ～に違いない (~ ni chigainai)",
            "back": "Ý nghĩa: Chắc chắn là..., Nhất định là... (phán đoán chủ quan với độ tin cậy cực cao).\n\n📌 Cấu trúc: V/A/N (thể thường, bỏ da) + に違いない\n📝 Ví dụ: 明かりがついているから、彼は家にいるに違いない。\n(Đèn đang sáng nên chắc chắn anh ấy đang ở nhà).",
            "tag": "Ngữ Pháp N3"
      },
      {
            "id": 7,
            "front": "【Kanji】 訪 (Hán Việt: PHÓNG / PHỎNG)",
            "back": "Âm On: ホウ (hou) | Âm Kun: おとず・れる, たず・ねる\nNghĩa: Thăm viếng, ghé thăm.\n\n📝 Từ vựng thi JLPT:\n• 訪問 (ほうもん): Cuộc viếng thăm, đến thăm công ty.\n• 訪れる (おとずれる): Ghé thăm (địa điểm, mùa xuân đến).",
            "tag": "Kanji N3"
      },
      {
            "id": 8,
            "front": "【Ngữ pháp】 ～をめぐって (~ wo megutte)",
            "back": "Ý nghĩa: Xoay quanh vấn đề... (thường có nhiều ý kiến tranh cãi, tranh chấp đối lập).\n\n📌 Cấu trúc: N + をめぐって / をめぐる + N\n📝 Ví dụ: 遺産の相続をめぐって、兄弟の間で激しい争いが起きた。\n(Xoay quanh việc thừa kế tài sản, giữa anh em đã xảy ra tranh chấp gay gắt).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 9,
            "front": "【Kanji】 貿 (Hán Việt: MẬU)",
            "back": "Âm On: ボウ (bou) | Âm Kun: (không có)\nNghĩa: Mậu dịch, buôn bán trao đổi hàng hóa.\n\n📌 Bộ thủ: Bối (貝: vỏ sò tiền bạc).\n📝 Từ vựng thi JLPT:\n• 貿易 (ぼうえき): Mậu dịch, thương mại quốc tế.\n⚠️ Bẫy âm: Đọc là ぼうえき (boueki), không đọc là ぼうび.",
            "tag": "Kanji N3"
      },
      {
            "id": 10,
            "front": "【Ngữ pháp】 ～ばかりか (~ bakari ka)",
            "back": "Ý nghĩa: Không chỉ... mà còn... (vế sau mức độ còn nặng hơn vế trước).\n\n📌 Cấu trúc: V/A/N + ばかりか (hoặc ばかりでなく)\n📝 Ví dụ: 彼は英語ばかりか、中国語も流暢に話せる。\n(Anh ấy không chỉ tiếng Anh mà còn nói trôi chảy cả tiếng Trung).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 11,
            "front": "【Kanji】 経 (Hán Việt: KINH)",
            "back": "Âm On: ケイ, キョウ | Âm Kun: へ・る\nNghĩa: Trải qua, kinh tế, kinh doanh.\n📝 Từ vựng:\n• 経営 (けいえい): Kinh doanh, quản trị.\n• 経済 (けいざい): Kinh tế.\n• 経験 (けいけん): Kinh nghiệm.\n• 経る (へる): Trải qua (thời gian, quá trình).",
            "tag": "Kanji N3"
      },
      {
            "id": 12,
            "front": "【Ngữ pháp】 ～を契機に (~ wo keiki ni)",
            "back": "Ý nghĩa: Nhân cơ hội..., Lấy... làm bước ngoặt/cái cớ (dẫn tới sự thay đổi lớn).\n📌 Cấu trúc: N + を契機に / を契機として\n📝 Ví dụ: 病気を契機に、健康的な生活を送るようになった。\n(Nhân dịp bị ốm, tôi bắt đầu sống một lối sống lành mạnh).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 13,
            "front": "【Kanji】 済 (Hán Việt: TẾ)",
            "back": "Âm On: サイ, ザイ | Âm Kun: す・む, す・ます\nNghĩa: Cứu tế, thanh toán xong, kết thúc.\n📝 Từ vựng:\n• 返済 (へんさい): Hoàn trả tiền vay.\n• 救済 (きゅうさい): Cứu tế, cứu trợ.\n• 済む (すむ): Kết thúc, giải quyết xong.",
            "tag": "Kanji N3"
      },
      {
            "id": 14,
            "front": "【Ngữ pháp】 ～に先立って (~ ni sakidatte)",
            "back": "Ý nghĩa: Trước khi..., Chuẩn bị trước khi bắt đầu sự kiện trọng đại.\n📌 Cấu trúc: N / V-ru + に先立って\n📝 Ví dụ: 新製品の発売に先立って、記者会見が行われた。\n(Trước khi mở bán sản phẩm mới, buổi họp báo đã được tổ chức).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 15,
            "front": "【Kanji】 責 (Hán Việt: TRÁCH)",
            "back": "Âm On: セキ | Âm Kun: せ・める\nNghĩa: Trách nhiệm, quở trách.\n📝 Từ vựng:\n• 責任 (せきにん): Trách nhiệm.\n• 責める (せめる): Đổ lỗi, trách móc.\n• 重責 (じゅうせき): Trách nhiệm nặng nề.",
            "tag": "Kanji N3"
      },
      {
            "id": 16,
            "front": "【Ngữ pháp】 ～反面 (~ hanmen)",
            "back": "Ý nghĩa: Trái lại, nhưng mặt khác (nói về 2 mặt đối lập của cùng 1 sự vật).\n📌 Cấu trúc: V/A/N + 反面\n📝 Ví dụ: この薬は効果が高い反面、副作用も強い。\n(Loại thuốc này hiệu quả cao nhưng mặt khác tác dụng phụ cũng mạnh).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 17,
            "front": "【Kanji】 規 (Hán Việt: QUY)",
            "back": "Âm On: キ | Âm Kun: (không có)\nNghĩa: Quy chuẩn, quy tắc.\n📝 Từ vựng:\n• 規則 (きそく): Quy tắc, nội quy.\n• 規定 (きてい): Quy định.\n• 規模 (きぼ): Quy mô.",
            "tag": "Kanji N3"
      },
      {
            "id": 18,
            "front": "【Ngữ pháp】 ～ざるを得ない (~ zaru wo enai)",
            "back": "Ý nghĩa: Đành phải..., Không thể không... (dù không muốn nhưng hoàn cảnh ép buộc).\n📌 Cấu trúc: V-nai (bỏ nai) + ざるを得ない (riêng する $\\rightarrow$ せざるを得ない)\n📝 Ví dụ: 台風が接近しているため、旅行は中止せざるを得ない。\n(Do bão đến gần nên chúng tôi đành phải hủy chuyến đi).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 19,
            "front": "【Kanji】 支 (Hán Việt: CHI)",
            "back": "Âm On: シ | Âm Kun: ささ・える\nNghĩa: Chi trả, chi nhánh, chống đỡ.\n📝 Từ vựng:\n• 支払い (しはらい): Chi trả, thanh toán.\n• 支出 (ししゅつ): Chi tiêu, chi phí.\n• 支店 (してん): Chi nhánh.\n• 支える (ささえる): Chống đỡ, nâng đỡ.",
            "tag": "Kanji N3"
      },
      {
            "id": 20,
            "front": "【Ngữ pháp】 ～どころか (~ dokoro ka)",
            "back": "Ý nghĩa: Đâu chỉ có thế, Ngay cả... còn chưa được nói chi đến... (phủ định mạnh mẽ).\n📝 Ví dụ: 彼は漢字どころか、ひらがなさえ読めない。\n(Anh ấy ngay cả chữ Hiragana còn chưa đọc được nói chi đến Kanji!).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 21,
            "front": "【Kanji】 証 (Hán Việt: CHỨNG)",
            "back": "Âm On: ショウ | Âm Kun: (không có)\nNghĩa: Bằng chứng, chứng thực.\n📝 Từ vựng:\n• 証明 (しょうめい): Chứng minh.\n• 証拠 (しょうこ): Bằng chứng, nhân chứng vật chứng.\n• 免許証 (めんきょしょう): Giấy phép, bằng lái.",
            "tag": "Kanji N3"
      },
      {
            "id": 22,
            "front": "【Ngữ pháp】 ～つつある (~ tsutsu aru)",
            "back": "Ý nghĩa: Đang dần dần... (biểu thị sự biến chuyển đang diễn ra theo thời gian).\n📌 Cấu trúc: V-masu (bỏ masu) + つつある\n📝 Ví dụ: 日本の景気は少しずつ回復しつつある。\n(Nền kinh tế Nhật Bản đang dần dần hồi phục).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 23,
            "front": "【Kanji】 招 (Hán Việt: CHIÊU)",
            "back": "Âm On: ショウ | Âm Kun: まね・く\nNghĩa: Mời mọc, vẫy gọi, chuốc lấy rắc rối.\n📝 Từ vựng:\n• 招待 (しょうたい): Chiêu đãi, mời dự tiệc.\n• 招く (まねく): Mời, gây ra (tai họa).\n• 招き猫 (まねきねこ): Mèo thần tài vẫy tay.",
            "tag": "Kanji N3"
      },
      {
            "id": 24,
            "front": "【Ngữ pháp】 ～かねる (~ kaneru)",
            "back": "Ý nghĩa: Không thể..., Khó lòng mà... (từ chối một cách lịch sự trang trọng trong thương mại).\n📌 Cấu trúc: V-masu (bỏ masu) + かねる\n📝 Ví dụ: お客様のご要望には応じかねます。\n(Chúng tôi khó lòng đáp ứng yêu cầu của quý khách).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 25,
            "front": "【Kanji】 限 (Hán Việt: HẠN)",
            "back": "Âm On: ゲン | Âm Kun: かぎ・る\nNghĩa: Giới hạn, kỳ hạn.\n📝 Từ vựng:\n• 限界 (げんかい): Giới hạn bản thân.\n• 制限 (せいげん): Hạn chế (tốc độ, số lượng).\n• 期限 (きげん): Thời hạn chót.",
            "tag": "Kanji N3"
      },
      {
            "id": 26,
            "front": "【Ngữ pháp】 ～に相違ない (~ ni soui nai)",
            "back": "Ý nghĩa: Chắc chắn là..., Không còn nghi ngờ gì nữa (văn phong trang trọng của ～に違いない).\n📝 Ví dụ: この証拠から見て、犯人は彼に相違ない。\n(Nhìn vào bằng chứng này, kẻ thủ phạm chắc chắn là anh ta).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 27,
            "front": "【Kanji】 境 (Hán Việt: CẢNH)",
            "back": "Âm On: キョウ, ケイ | Âm Kun: さかい\nNghĩa: Ranh giới, hoàn cảnh.\n📝 Từ vựng:\n• 環境 (かんきょう): Môi trường.\n• 国境 (こっきょう): Biên giới quốc gia.\n• 境 (さかい): Ranh giới giữa 2 vùng.",
            "tag": "Kanji N3"
      },
      {
            "id": 28,
            "front": "【Ngữ pháp】 ～次第で (~ shidai de)",
            "back": "Ý nghĩa: Tùy thuộc vào... mà kết quả sẽ khác nhau.\n📌 Cấu trúc: N + 次第だ / 次第で\n📝 Ví dụ: 努力次第で、結果はいくらでも変えられる。\n(Tùy vào nỗ lực mà kết quả có thể thay đổi rất nhiều).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 29,
            "front": "【Kanji】 倒 (Hán Việt: ĐẢO)",
            "back": "Âm On: トウ | Âm Kun: たお・れる, たお・す\nNghĩa: Ngã nhào, phá sản.\n📝 Từ vựng:\n• 倒産 (とうさん): Phá sản doanh nghiệp.\n• 倒れる (たおれる): Bị ngã, ngất xỉu.\n• 圧倒的 (あっとうてき): Mang tính áp đảo.",
            "tag": "Kanji N3"
      },
      {
            "id": 30,
            "front": "【Ngữ pháp】 ～のもとで (~ no moto de)",
            "back": "Ý nghĩa: Dưới sự chỉ đạo/dạy dỗ/ảnh hưởng của ai đó.\n📌 Cấu trúc: N + のもとで\n📝 Ví dụ: 厳しい指導のもとで、練習を重ねた。\n(Dưới sự chỉ dẫn nghiêm khắc, tôi đã miệt mài luyện tập).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 31,
            "front": "【Kanji】 勤 (Hán Việt: CẦN)",
            "back": "Âm On: キン, ゴン | Âm Kun: つと・める\nNghĩa: Cần cù, làm việc, công tác.\n📝 Từ vựng:\n• 通勤 (つうきん): Đi làm hàng ngày.\n• 勤務 (きんむ): Làm việc, trực ban.\n• 勤勉 (きんべん): Cần cù, chăm chỉ.",
            "tag": "Kanji N3"
      },
      {
            "id": 32,
            "front": "【Ngữ pháp】 ～を皮切りに (~ wo kawakiri ni)",
            "back": "Ý nghĩa: Khởi đầu bằng..., Mở màn bằng... sau đó hàng loạt hành động tương tự diễn ra.\n📝 Ví dụ: 東京公演を皮切りに、全国ツアーがスタートした。\n(Mở màn bằng buổi diễn ở Tokyo, chuyến lưu diễn toàn quốc đã bắt đầu).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 33,
            "front": "【Kanji】 辞 (Hán Việt: TỪ)",
            "back": "Âm On: ジ | Âm Kun: や・める\nNghĩa: Từ chức, từ điển, từ chối.\n📝 Từ vựng:\n• 辞任 (じにん): Từ chức.\n• 辞退 (じたい): Từ chối, rút lui.\n• 辞書 (じしょ): Từ điển.",
            "tag": "Kanji N3"
      },
      {
            "id": 34,
            "front": "【Ngữ pháp】 ～につけ (~ ni tsuke)",
            "back": "Ý nghĩa: Mỗi lần... là lại cảm thấy/nhớ đến...\n📝 Ví dụ: この写真を見るにつけ、学生時代を思い出す。\n(Mỗi lần nhìn bức ảnh này là tôi lại nhớ về thời học sinh).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 35,
            "front": "【Kanji】 備 (Hán Việt: BỊ)",
            "back": "Âm On: ビ | Âm Kun: そな・える, そな・わる\nNghĩa: Chuẩn bị, trang bị, thiết bị.\n📝 Từ vựng:\n• 準備 (じゅんび): Chuẩn bị.\n• 設備 (せつび): Cơ sở vật chất, trang thiết bị.\n• 備える (そなえる): Phòng bị trước thiên tai.",
            "tag": "Kanji N3"
      },
      {
            "id": 36,
            "front": "【Ngữ pháp】 ～ぬきで (~ nuki de)",
            "back": "Ý nghĩa: Không có..., Bỏ qua... (không tính đến).\n📝 Ví dụ: 冗談はぬきにして、本題に入りましょう。\n(Thôi không đùa nữa, chúng ta vào vấn đề chính đi).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 37,
            "front": "【Kanji】 設 (Hán Việt: THIẾT)",
            "back": "Âm On: セツ | Âm Kun: もう・ける\nNghĩa: Thiết lập, kiến thiết, bố trí.\n📝 Từ vựng:\n• 設定 (せってい): Thiết lập cài đặt.\n• 施設 (しせつ): Cơ sở công cộng, viện dưỡng lão.\n• 建設 (けんせつ): Xây dựng kiến thiết.",
            "tag": "Kanji N3"
      },
      {
            "id": 38,
            "front": "【Ngữ pháp】 ～っこない (~ kkonai)",
            "back": "Ý nghĩa: Tuyệt đối không thể nào... (văn nói thân mật phủ định khả năng).\n📌 Cấu trúc: V-masu (bỏ masu) + っこない\n📝 Ví dụ: そんな難しいこと、私にわかりっこないよ。\n(Điều khó như vậy thì làm sao mà tôi hiểu được cơ chứ!).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 39,
            "front": "【Kanji】 導 (Hán Việt: ĐẠO)",
            "back": "Âm On: ドウ | Âm Kun: みちび・く\nNghĩa: Dẫn dắt, lãnh đạo, chỉ đạo.\n📝 Từ vựng:\n• 指導 (しどう): Chỉ đạo, hướng dẫn.\n• 導入 (どうにゅう): Áp dụng, đưa vào sử dụng công nghệ.\n• 導く (みちびく): Dẫn dắt tới thành công.",
            "tag": "Kanji N3"
      },
      {
            "id": 40,
            "front": "【Ngữ pháp】 ～に際して (~ ni saishite)",
            "back": "Ý nghĩa: Khi chuẩn bị bắt đầu..., Nhân dịp... (trang trọng).\n📝 Ví dụ: 留学するに際して、多くの人に支えていただいた。\n(Nhân dịp đi du học, tôi đã nhận được sự nâng đỡ của rất nhiều người).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 41,
            "front": "【Kanji】 障 (Hán Việt: CHƯỚNG)",
            "back": "Âm On: ショウ | Âm Kun: さわ・る\nNghĩa: Chướng ngại, cản trở, tổn hại.\n📝 Từ vựng:\n• 障害 (しょうがい): Trở ngại, khuyết tật.\n• 故障 (こしょう): Hỏng hóc máy móc.\n• 障る (さわる): Gây hại sức khỏe.",
            "tag": "Kanji N2"
      },
      {
            "id": 42,
            "front": "【Ngữ pháp】 ～からといって (~ kara to itte)",
            "back": "Ý nghĩa: Dẫu nói là... nhưng không hẳn là... (phủ định vế sau).\n📝 Ví dụ: 日本に住んでいるからといって、日本語がペラペラとは限らない。\n(Dẫu nói là sống ở Nhật nhưng không hẳn là nói tiếng Nhật lưu loát).",
            "tag": "Ngữ Pháp N3"
      },
      {
            "id": 43,
            "front": "【Kanji】 害 (Hán Việt: HẠI)",
            "back": "Âm On: ガイ | Âm Kun: (không có)\nNghĩa: Tai hại, độc hại, thiệt hại.\n📝 Từ vựng:\n• 被害 (ひがい): Thiệt hại sau bão lũ.\n• 公害 (こうがい): Ô nhiễm môi trường công cộng.\n• 損害 (そんがい): Tổn thất tài chính.",
            "tag": "Kanji N3"
      },
      {
            "id": 44,
            "front": "【Ngữ pháp】 ～に応じて (~ ni oujite)",
            "back": "Ý nghĩa: Ứng với..., Phù hợp tương xứng với...\n📝 Ví dụ: 体力や年齢に応じて、無理のない運動をしましょう。\n(Hãy vận động vừa sức tương ứng với thể lực và độ tuổi).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 45,
            "front": "【Kanji】 拡 (Hán Việt: KHUẾCH)",
            "back": "Âm On: カク | Âm Kun: (không có)\nNghĩa: Mở rộng, khuếch đại.\n📝 Từ vựng:\n• 拡大 (かくだい): Phóng to, mở rộng quy mô.\n• 拡張 (かくちょう): Mở rộng lãnh thổ, chức năng.\n• 軍拡 (ぐんかく): Chạy đua vũ trang.",
            "tag": "Kanji N2"
      },
      {
            "id": 46,
            "front": "【Ngữ pháp】 ～にもかかわらず (~ ni mo kakawarazu)",
            "back": "Ý nghĩa: Mặc dù... thế nhưng mà (kết quả ngoài dự đoán).\n📝 Ví dụ: 雨が激しいにもかかわらず、多くの観客が集まった。\n(Mặc dù mưa to dữ dội nhưng rất đông khán giả vẫn tề tựu).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 47,
            "front": "【Kanji】 縮 (Hán Việt: SÚC)",
            "back": "Âm On: シュク | Âm Kun: ちぢ・む, ちぢ・める\nNghĩa: Co ngắn, thu hẹp, teo tóp.\n📝 Từ vựng:\n• 短縮 (たんしゅく): Rút ngắn thời gian.\n• 縮小 (しゅくしょう): Thu nhỏ quy mô.\n• 縮む (ちぢむ): Co lại (áo len giặt nước nóng).",
            "tag": "Kanji N2"
      },
      {
            "id": 48,
            "front": "【Ngữ pháp】 ～にすぎない (~ ni suginai)",
            "back": "Ý nghĩa: Chỉ là..., Chẳng qua chỉ là... (không hơn không kém).\n📝 Ví dụ: それは単なる口実にすぎない。\n(Đó chẳng qua chỉ là một lời viện cớ mà thôi).",
            "tag": "Ngữ Pháp N2"
      },
      {
            "id": 49,
            "front": "【Kanji】 疑 (Hán Việt: NGHI)",
            "back": "Âm On: ギ | Âm Kun: うたが・う\nNghĩa: Nghi ngờ, nghi vấn.\n📝 Từ vựng:\n• 疑問 (ぎもん): Thắc mắc, câu hỏi nghi vấn.\n• 容疑者 (ようぎしゃ): Kẻ tình nghi phạm tội.\n• 疑う (うたがう): Nghi ngờ lời nói dối.",
            "tag": "Kanji N3"
      },
      {
            "id": 50,
            "front": "【Ngữ pháp】 ～げ (~ ge)",
            "back": "Ý nghĩa: Có vẻ..., Trông có vẻ... (cảm nhận từ bên ngoài về tâm trạng ai đó).\n📌 Cấu trúc: A-i (bỏ i) / A-na (bỏ na) + げ\n📝 Ví dụ: 彼女は寂しげな表情で遠くを見つめていた。\n(Cô ấy nhìn xa xăm với vẻ mặt có vẻ cô đơn).",
            "tag": "Ngữ Pháp N2"
      }
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
    subtitle: '50 Thẻ giải mã tiền tố, hậu tố giải phẫu học và nhóm thuốc điều trị lâm sàng',
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
    description: 'Học một biết mười với phương pháp ghép gốc từ, tiền tố và hậu tố tiếng Anh y khoa quốc tế. Phân loại chuẩn xác các nhóm thuốc tim mạch, kháng sinh, giảm đau kháng viêm NSAIDs và cơ chế tác dụng sinh học.',
    highlights: [
      '50 Thẻ Anki chuẩn hóa gốc từ giải phẫu và dược lý lâm sàng',
      'Công thức ghép từ thần tốc giải mã hàng ngàn bệnh học phức tạp',
      'Đầy đủ bảng phân loại kháng sinh Beta-lactam, Macrolide, Quinolone',
      'Hỗ trợ đắc lực sinh viên Y Đa Khoa, Dược Sĩ và Điều Dưỡng'
    ],
    previewCards: [
      {
            "id": 1,
            "front": "Tiền tố \"Brady-\" và \"Tachy-\" trong thuật ngữ y khoa có nghĩa là gì?",
            "back": "• Brady-: Chậm (Slow) $\\rightarrow$ Ví dụ: Bradycardia (Nhịp tim chậm, dưới 60 nhịp/phút).\n• Tachy-: Nhanh (Fast) $\\rightarrow$ Ví dụ: Tachycardia (Nhịp tim nhanh, trên 100 nhịp/phút).",
            "tag": "Tiền tố Y khoa"
      },
      {
            "id": 2,
            "front": "Hậu tố \"-itis\" và \"-ectomy\" biểu thị điều gì trong y học?",
            "back": "• -itis: Tình trạng viêm nhiễm (Inflammation) $\\rightarrow$ Ví dụ: Hepatitis (Viêm gan), Appendicitis (Viêm ruột thừa).\n• -ectomy: Phẫu thuật cắt bỏ (Surgical removal) $\\rightarrow$ Ví dụ: Appendectomy (Phẫu thuật cắt ruột thừa).",
            "tag": "Hậu tố Y khoa"
      },
      {
            "id": 3,
            "front": "Cơ chế tác dụng dược lý của nhóm thuốc kháng sinh Beta-lactam (Penicillin, Cephalosporin) là gì?",
            "back": "Ức chế enzym Transpeptidase (PBP - Penicillin Binding Protein), ngăn cản quá trình tổng hợp vách tế bào vi khuẩn (Peptidoglycan), làm vi khuẩn bị ly giải và tiêu diệt.\n\n⚠️ Vi khuẩn kháng thuốc bằng cách tiết enzym Beta-lactamase phá vỡ vòng beta-lactam.",
            "tag": "Dược lý"
      },
      {
            "id": 4,
            "front": "Hậu tố \"-oma\" và \"-pathy\" chỉ trạng thái bệnh lý nào?",
            "back": "• -oma: Khối u (Tumor/Neoplasm) $\\rightarrow$ Ví dụ: Carcinoma (U biểu mô ác tính), Adenoma (U tuyến lành tính).\n• -pathy: Tình trạng bệnh lý nói chung (Disease) $\\rightarrow$ Ví dụ: Cardiomyopathy (Bệnh cơ tim), Neuropathy (Bệnh lý thần kinh).",
            "tag": "Bệnh học"
      },
      {
            "id": 5,
            "front": "Thuốc kháng viêm không steroid (NSAIDs như Ibuprofen, Aspirin) có cơ chế tác dụng chính là gì?",
            "back": "Ức chế enzyme Cyclooxygenase (COX-1 và COX-2), ngăn chặn quá trình chuyển đổi Acid Arachidonic thành Prostaglandin (chất trung gian hóa học gây viêm, đau và sốt).\n\n⚠️ Tác dụng phụ: Loét dạ dày do ức chế COX-1 bảo vệ niêm mạc.",
            "tag": "Dược lý lâm sàng"
      },
      {
            "id": 6,
            "front": "Gốc từ \"Cardi/o\" và \"Angi/o\" chỉ cơ quan nào trong cơ thể?",
            "back": "• Cardi/o: Tim (Heart) $\\rightarrow$ Myocardium (Cơ tim), Cardiology (Tim mạch học).\n• Angi/o: Mạch máu (Blood vessel) $\\rightarrow$ Angiography (Chụp mạch máu), Angioplasty (Tạo hình mạch vành).",
            "tag": "Gốc từ Giải phẫu"
      },
      {
            "id": 7,
            "front": "Gốc từ \"Nephr/o\" và \"Ren/o\" chỉ cơ quan nào?",
            "back": "Thận (Kidney).\n• Nephr/o: Nephritis (Viêm thận), Nephrolithiasis (Sỏi thận).\n• Ren/o: Renal failure (Suy thận), Renal artery (Động mạch thận).",
            "tag": "Gốc từ Giải phẫu"
      },
      {
            "id": 8,
            "front": "Gốc từ \"Hepat/o\" chỉ cơ quan nào và cho ví dụ bệnh lý?",
            "back": "Gan (Liver).\n• Hepatitis: Viêm gan (Hepatitis B, C).\n• Hepatomegaly: Gan to phì đại.\n• Hepatotoxicity: Độc tính trên gan.",
            "tag": "Gốc từ Giải phẫu"
      },
      {
            "id": 9,
            "front": "Gốc từ \"Gastr/o\" và \"Enter/o\" khác nhau ở điểm nào?",
            "back": "• Gastr/o: Dạ dày (Stomach) $\\rightarrow$ Gastritis (Viêm dạ dày), Gastroscopy (Nội soi dạ dày).\n• Enter/o: Ruột non (Intestine) $\\rightarrow$ Gastroenteritis (Viêm dạ dày ruột).",
            "tag": "Gốc từ Giải phẫu"
      },
      {
            "id": 10,
            "front": "Gốc từ \"Pulmon/o\" và \"Pneum/o\" chỉ cơ quan nào?",
            "back": "Phổi (Lungs) hoặc Khí/Hơi.\n• Pulmonary embolism: Thuyên tắc phổi.\n• Pneumonia: Viêm phổi.\n• Pneumothorax: Tràn khí màng phổi.",
            "tag": "Gốc từ Giải phẫu"
      },
      {
            "id": 11,
            "front": "Hậu tố \"-megaly\" và \"-malacia\" biểu thị biến đổi gì của mô cơ quan?",
            "back": "• -megaly: Phì đại, to bất thường (Enlargement) $\\rightarrow$ Splenomegaly (Lách to).\n• -malacia: Sự hóa mềm bất thường (Softening) $\\rightarrow$ Osteomalacia (Nhuyễn xương).",
            "tag": "Hậu tố Y khoa"
      },
      {
            "id": 12,
            "front": "Hậu tố \"-scopy\" và \"-stomy\" khác nhau ra sao?",
            "back": "• -scopy: Quan sát, nội soi bằng ống soi quang học $\\rightarrow$ Colonoscopy (Nội soi đại tràng).\n• -stomy: Phẫu thuật tạo lỗ mở thông ra ngoài $\\rightarrow$ Colostomy (Mở thông đại tràng ra thành bụng).",
            "tag": "Thủ thuật Ngoại khoa"
      },
      {
            "id": 13,
            "front": "Hậu tố \"-tomy\" và \"-plasty\" có ý nghĩa gì?",
            "back": "• -tomy: Phẫu thuật rạch mở (Incision) $\\rightarrow$ Tracheotomy (Rạch mở khí quản).\n• -plasty: Phẫu thuật tạo hình, sửa chữa (Surgical repair) $\\rightarrow$ Rhinoplasty (Nâng mũi tạo hình).",
            "tag": "Thủ thuật Ngoại khoa"
      },
      {
            "id": 14,
            "front": "Tiền tố \"Dys-\" và \"Eu-\" trong y học có nghĩa là gì?",
            "back": "• Dys-: Khó khăn, bất thường, đau đớn $\\rightarrow$ Dyspnea (Khó thở), Dysphagia (Khó nuốt), Dysuria (Tiểu buốt).\n• Eu-: Bình thường, tốt $\\rightarrow$ Eupnea (Thở bình thường 12-20 lần/phút).",
            "tag": "Tiền tố Y khoa"
      },
      {
            "id": 15,
            "front": "Hậu tố \"-emia\" và \"-uria\" biểu thị sự hiện diện của chất nào?",
            "back": "• -emia: Trong máu (Blood condition) $\\rightarrow$ Hyperglycemia (Tăng đường huyết), Anemia (Thiếu máu).\n• -uria: Trong nước tiểu (Urine condition) $\\rightarrow$ Proteinuria (Đạm niệu), Hematuria (Tiểu máu).",
            "tag": "Xét nghiệm Lâm sàng"
      },
      {
            "id": 16,
            "front": "Thuốc ức chế men chuyển ACE inhibitors có đuôi tên hoạt chất là gì và tác dụng gì?",
            "back": "Đuôi tên là \"-pril\" (Enalapril, Captopril, Lisinopril).\nCơ chế: Ức chế chuyển Angiotensin I thành Angiotensin II, làm giãn mạch và hạ huyết áp.\n⚠️ Tác dụng phụ điển hình: Ho khan (do ứ đọng Bradykinin).",
            "tag": "Dược lý Tim mạch"
      },
      {
            "id": 17,
            "front": "Thuốc chẹn thụ thể Angiotensin II (ARBs) có đuôi tên là gì và ưu điểm gì so với ACEi?",
            "back": "Đuôi tên là \"-sartan\" (Losartan, Valsartan, Telmisartan).\nƯu điểm: Ngăn trực tiếp tác động của Angiotensin II tại thụ thể AT1 mà không làm tăng Bradykinin, do đó KHÔNG GÂY HO KHAN.",
            "tag": "Dược lý Tim mạch"
      },
      {
            "id": 18,
            "front": "Nhóm thuốc chẹn Beta giao cảm (Beta-blockers) có đuôi tên hoạt chất là gì?",
            "back": "Đuôi tên là \"-lol\" (Atenolol, Metoprolol, Bisoprolol, Propranolol).\nCơ chế: Chẹn thụ thể Beta-1 adrenergic tại tim, làm giảm nhịp tim và giảm co bóp cơ tim.\n⚠️ Chống chỉ định: Bệnh nhân hen suyễn nặng (co thắt phế quản qua thụ thể Beta-2).",
            "tag": "Dược lý Tim mạch"
      },
      {
            "id": 19,
            "front": "Nhóm thuốc hạ Lipid máu Statin có đuôi tên là gì và cơ chế tác dụng?",
            "back": "Đuôi tên là \"-statin\" (Atorvastatin, Rosuvastatin, Simvastatin).\nCơ chế: Ức chế cạnh tranh enzym HMG-CoA Reductase - enzym giới hạn tốc độ tổng hợp Cholesterol nội sinh tại gan, giảm LDL-Cholesterol mạnh mẽ.",
            "tag": "Dược lý"
      },
      {
            "id": 20,
            "front": "Nhóm thuốc ức chế bơm Proton (PPIs) dùng điều trị viêm loét dạ dày có đuôi tên là gì?",
            "back": "Đuôi tên là \"-prazole\" (Omeprazole, Esomeprazole, Pantoprazole).\nCơ chế: Ức chế không hồi phục bơm $H^+/K^+$ ATPase tại tế bào viền dạ dày, giảm tiết acid dịch vị.",
            "tag": "Dược lý Tiêu hóa"
      },
      {
            "id": 21,
            "front": "Tiền tố \"Oligo-\" và \"Poly-\" biểu thị số lượng ra sao?",
            "back": "• Oligo-: Rất ít, thiểu số $\\rightarrow$ Oliguria (Thiểu niệu, nước tiểu < 400ml/24h).\n• Poly-: Quá nhiều $\\rightarrow$ Polyuria (Đa niệu, nước tiểu > 3000ml/24h), Polydipsia (Uống nhiều).",
            "tag": "Tiền tố Y khoa"
      },
      {
            "id": 22,
            "front": "Gốc từ \"Hemat/o\" và \"Hem/o\" chỉ chất gì?",
            "back": "Máu (Blood).\n• Hemoglobin (Hb): Huyết sắc tố vận chuyển oxy.\n• Hemorrhage: Xuất huyết, chảy máu nặng.\n• Hemostasis: Cầm máu.",
            "tag": "Huyết học"
      },
      {
            "id": 23,
            "front": "Gốc từ \"Derm/o\" và \"Dermat/o\" chỉ cơ quan nào?",
            "back": "Làn da (Skin).\n• Dermatitis: Viêm da.\n• Dermatology: Da liễu học.\n• Epidermis: Biểu bì da.",
            "tag": "Gốc từ Giải phẫu"
      },
      {
            "id": 24,
            "front": "Gốc từ \"Oste/o\" và \"Arthr/o\" chỉ cấu trúc nào?",
            "back": "• Oste/o: Xương (Bone) $\\rightarrow$ Osteoporosis (Loãng xương), Osteoblast (Tạo cốt bào).\n• Arthr/o: Khớp (Joint) $\\rightarrow$ Arthritis (Viêm khớp), Arthroscopy (Nội soi khớp).",
            "tag": "Cơ xương khớp"
      },
      {
            "id": 25,
            "front": "Hậu tố \"-lysis\" và \"-genesis\" có ý nghĩa trái ngược nhau ra sao?",
            "back": "• -lysis: Sự ly giải, phá vỡ, phân hủy $\\rightarrow$ Glycolysis (Đường phân), Hemolysis (Tán huyết).\n• -genesis: Sự sinh ra, hình thành mới $\\rightarrow$ Gluconeogenesis (Tân tạo đường).",
            "tag": "Sinh hóa Y học"
      },
      {
            "id": 26,
            "front": "Kháng sinh nhóm Quinolone/Fluoroquinolone có đuôi tên là gì?",
            "back": "Đuôi tên là \"-floxacin\" (Ciprofloxacin, Levofloxacin, Moxifloxacin).\nCơ chế: Ức chế enzyme DNA Gyrase (Topoisomerase II) và Topoisomerase IV của vi khuẩn, ngăn sao chép DNA.",
            "tag": "Kháng sinh"
      },
      {
            "id": 27,
            "front": "Thuốc chẹn kênh Canxi (CCBs) nhóm Dihydropyridine có đuôi tên là gì?",
            "back": "Đuôi tên là \"-dipine\" (Amlodipine, Nifedipine, Felodipine).\nTác dụng: Giãn cơ trơn động mạch ngoại biên mạnh, giảm sức cản mạch máu để hạ huyết áp.",
            "tag": "Dược lý Tim mạch"
      },
      {
            "id": 28,
            "front": "Tiền tố \"Hyper-\" và \"Hypo-\" biểu thị trạng thái gì?",
            "back": "• Hyper-: Tăng cao quá mức $\\rightarrow$ Hypertension (Tăng huyết áp), Hyperkalemia (Tăng kali máu).\n• Hypo-: Giảm thấp dưới ngưỡng $\\rightarrow$ Hypotension (Tụt huyết áp), Hypoglycemia (Hạ đường huyết).",
            "tag": "Tiền tố Y khoa"
      },
      {
            "id": 29,
            "front": "Thuốc giải độc đặc hiệu (Antidote) khi ngộ độc Paracetamol quá liều là gì?",
            "back": "N-Acetylcysteine (NAC).\nCơ chế: Cung cấp nhóm Sulfhydryl (-SH) giúp phục hồi nồng độ Glutathione tại gan để trung hòa chất độc NAPQI.",
            "tag": "Chống độc Lâm sàng"
      },
      {
            "id": 30,
            "front": "Hậu tố \"-penia\" và \"-cytosis\" trong huyết học chỉ điều gì?",
            "back": "• -penia: Sự sụt giảm số lượng tế bào $\\rightarrow$ Thrombocytopenia (Giảm tiểu cầu), Leukopenia (Giảm bạch cầu).\n• -cytosis: Tăng số lượng tế bào $\\rightarrow$ Leukocytosis (Tăng bạch cầu).",
            "tag": "Huyết học"
      },
      {
            "id": 31,
            "front": "Gốc từ \"Encephal/o\" và \"Mening/o\" chỉ cấu trúc thần kinh nào?",
            "back": "• Encephal/o: Não bộ (Brain) $\\rightarrow$ Encephalitis (Viêm não).\n• Mening/o: Màng não (Meninges) $\\rightarrow$ Meningitis (Viêm màng não).",
            "tag": "Thần kinh"
      },
      {
            "id": 32,
            "front": "Gốc từ \"Cholecyst/o\" chỉ cơ quan nào trong hệ tiêu hóa?",
            "back": "Túi mật (Gallbladder).\n• Cholecystitis: Viêm túi mật cấp/mạn.\n• Cholecystectomy: Phẫu thuật cắt túi mật nội soi.\n• Cholelithiasis: Sỏi túi mật.",
            "tag": "Tiêu hóa"
      },
      {
            "id": 33,
            "front": "Hậu tố \"-algia\" và \"-dynia\" biểu thị triệu chứng gì?",
            "back": "Cơn đau (Pain).\n• Myalgia: Đau cơ.\n• Arthralgia: Đau khớp.\n• Neuralgia: Đau dây thần kinh.",
            "tag": "Triệu chứng học"
      },
      {
            "id": 34,
            "front": "Tiền tố \"A-\" hoặc \"An-\" đứng trước gốc từ có nghĩa là gì?",
            "back": "Không có, mất hoàn toàn (Without, lack of).\n• Apnea: Ngưng thở (Sleep apnea - Chứng ngưng thở khi ngủ).\n• Anesthesia: Mất cảm giác, gây mê/gây tê.\n• Anorexia: Mất cảm giác ngon miệng, chán ăn.",
            "tag": "Tiền tố Y khoa"
      },
      {
            "id": 35,
            "front": "Gốc từ \"Phleb/o\" và \"Ven/o\" chỉ cấu trúc nào?",
            "back": "Tĩnh mạch (Vein).\n• Phlebitis: Viêm tĩnh mạch.\n• Thrombophlebitis: Viêm tắc tĩnh mạch huyết khối.\n• Venipuncture: Chọc kim vào tĩnh mạch lấy máu.",
            "tag": "Giải phẫu"
      },
      {
            "id": 36,
            "front": "Kháng sinh nhóm Aminoglycoside (Gentamicin, Amikacin) có 2 độc tính nguy hiểm nào cần theo dõi nồng độ đỉnh/đáy?",
            "back": "1. Độc tính trên thận (Nephrotoxicity): Hoại tử ống thận cấp.\n2. Độc tính trên thính giác & tiền đình (Ototoxicity): Điếc không hồi phục.",
            "tag": "Kháng sinh"
      },
      {
            "id": 37,
            "front": "Chỉ số \"INR\" (International Normalized Ratio) dùng để theo dõi hiệu quả của thuốc nào?",
            "back": "Thuốc chống đông kháng Vitamin K (Warfarin).\nKhoảng điều trị mục tiêu thông thường là INR từ 2.0 đến 3.0.",
            "tag": "Xét nghiệm Huyết học"
      },
      {
            "id": 38,
            "front": "Hậu tố \"-pnea\" chỉ hoạt động sinh lý nào?",
            "back": "Hô hấp, nhịp thở (Breathing).\n• Dyspnea: Khó thở.\n• Tachypnea: Thở nhanh nông (> 20 lần/phút).\n• Bradypnea: Thở chậm (< 12 lần/phút).",
            "tag": "Hô hấp"
      },
      {
            "id": 39,
            "front": "Thuốc lợi tiểu quai (Loop Diuretics như Furosemide) tác động lên vị trí nào của Nephron?",
            "back": "Đoạn nhánh dày quai Henle (Thick ascending limb of Loop of Henle), ức chế kênh đồng vận chuyển $Na^{+}-K^{+}-2Cl^{-}$. Gây hạ Kali máu.",
            "tag": "Dược lý Thận"
      },
      {
            "id": 40,
            "front": "Hậu tố \"-stenosis\" chỉ tình trạng cơ thể nào?",
            "back": "Sự chít hẹp bất thường (Narrowing, stricture).\n• Aortic stenosis: Hẹp van động mạch chủ.\n• Pyloric stenosis: Hẹp môn vị dạ dày.",
            "tag": "Bệnh học"
      },
      {
            "id": 41,
            "front": "Tiền tố \"Peri-\" và \"Endo-\" khác nhau ra sao?",
            "back": "• Peri-: Xung quanh, bao bọc bên ngoài $\\rightarrow$ Pericardium (Màng ngoài tim), Periodontitis (Viêm nha chu quanh răng).\n• Endo-: Bên trong lòng $\\rightarrow$ Endocardium (Màng trong tim), Endoscopy (Nội soi bên trong).",
            "tag": "Tiền tố Y khoa"
      },
      {
            "id": 42,
            "front": "Gốc từ \"My/o\" chỉ loại mô nào?",
            "back": "Mô cơ (Muscle).\n• Myocardium: Cơ tim.\n• Myositis: Viêm cơ.\n• Myasthenia gravis: Bệnh nhược cơ.",
            "tag": "Giải phẫu"
      },
      {
            "id": 43,
            "front": "Thuốc kháng Histamin H1 thế hệ 2 (Loratadine, Cetirizine) ưu việt hơn thế hệ 1 (Chlorpheniramine) ở điểm nào?",
            "back": "Ít qua hàng rào máu não (Blood-Brain Barrier), do đó KHÔNG GÂY BUỒN NGỦ (Non-sedating antihistamines).",
            "tag": "Dược lý Dị ứng"
      },
      {
            "id": 44,
            "front": "Hậu tố \"-sclerosis\" chỉ sự biến đổi nào của mô?",
            "back": "Xơ cứng, chai cứng (Hardening).\n• Atherosclerosis: Xơ vữa động mạch.\n• Multiple sclerosis: Đa xơ cứng thần kinh.",
            "tag": "Bệnh học"
      },
      {
            "id": 45,
            "front": "Gốc từ \"Ophthalm/o\" và \"Ot/o\" chỉ cơ quan nào?",
            "back": "• Ophthalm/o: Mắt (Eye) $\\rightarrow$ Ophthalmology (Nhãn khoa).\n• Ot/o: Tai (Ear) $\\rightarrow$ Otitis media (Viêm tai giữa).",
            "tag": "Chuyên khoa"
      },
      {
            "id": 46,
            "front": "Kháng sinh nhóm Macrolide (Azithromycin, Clarithromycin) có cơ chế tác dụng gì?",
            "back": "Gắn vào tiểu đơn vị 50S của Ribosome vi khuẩn, ức chế quá trình tổng hợp protein của vi khuẩn.",
            "tag": "Kháng sinh"
      },
      {
            "id": 47,
            "front": "Hậu tố \"-rrhage\" hoặc \"-rrhagia\" biểu thị hiện tượng gì?",
            "back": "Chảy vọt ra, xuất huyết dữ dội (Bursting forth, profuse flow).\n• Hemorrhage: Xuất huyết máu.\n• Menorrhagia: Cường kinh (rong kinh ra nhiều máu).",
            "tag": "Hậu tố Y khoa"
      },
      {
            "id": 48,
            "front": "Thuốc điều trị đái tháo đường nhóm Metformin (Biguanide) có cơ chế chính là gì?",
            "back": "Giảm sản xuất glucose tại gan (giảm tân tạo đường) và tăng nhạy cảm của thụ thể Insulin tại mô cơ ngoại biên.\n⚠️ Không gây hạ đường huyết quá mức khi dùng đơn độc.",
            "tag": "Dược lý Nội tiết"
      },
      {
            "id": 49,
            "front": "Gốc từ \"Thorac/o\" chỉ vùng nào của cơ thể?",
            "back": "Vùng lồng ngực (Chest).\n• Thoracentesis: Chọc dò khoang màng phổi.\n• Thoracotomy: Mở lồng ngực.",
            "tag": "Giải phẫu"
      },
      {
            "id": 50,
            "front": "Khái niệm \"Half-life\" ($t_{1/2}$ - Thời gian bán thải) của thuốc là gì?",
            "back": "Khoảng thời gian cần thiết để nồng độ thuốc trong huyết tương giảm đi một nửa. Sau khoảng 4 đến 5 lần $t_{1/2}$, thuốc được coi là đào thải hoàn toàn khỏi cơ thể.",
            "tag": "Dược động học"
      }
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
      {
            "id": 1,
            "front": "Nguyên lý \"Time Value of Money\" (TVM - Giá trị thời gian của tiền) là gì?",
            "back": "Một đồng tiền ngày hôm nay có giá trị lớn hơn một đồng tiền trong tương lai.\n\n📌 Lý do: Khả năng sinh lời tiềm năng (lãi suất), chi phí cơ hội và rủi ro lạm phát làm xói mòn sức mua.",
            "tag": "TVM Core"
      },
      {
            "id": 2,
            "front": "Công thức mô hình DuPont 3 bước phân rã tỷ suất sinh lời trên vốn chủ sở hữu (ROE) là gì?",
            "back": "ROE = Net Profit Margin × Asset Turnover × Financial Leverage\n\nTrong đó:\n1. Net Profit Margin = Lợi nhuận ròng / Doanh thu (Hiệu quả hoạt động)\n2. Asset Turnover = Doanh thu / Tổng tài sản (Hiệu quả sử dụng tài sản)\n3. Financial Leverage (Equity Multiplier) = Tổng tài sản / Vốn chủ sở hữu (Đòn bẩy tài chính).",
            "tag": "DuPont Analysis"
      },
      {
            "id": 3,
            "front": "Chỉ số WACC (Weighted Average Cost of Capital - Chi phí sử dụng vốn bình quân) dùng để làm gì?",
            "back": "Là tỷ suất sinh lời tối thiểu mà doanh nghiệp cần tạo ra để làm hài lòng cả chủ nợ (chủ nợ nhận lãi vay) và cổ đông (cổ đông nhận cổ tức & thặng dư vốn).\n\n📌 Thường được sử dụng làm Tỷ lệ chiết khấu (Discount Rate) trong mô hình định giá DCF.",
            "tag": "Corporate Finance"
      },
      {
            "id": 4,
            "front": "Báo cáo lưu chuyển tiền tệ (Cash Flow Statement) chia thành 3 dòng tiền nào?",
            "back": "1. CFO (Cash Flow from Operating Activities): Dòng tiền từ hoạt động kinh doanh cốt lõi.\n2. CFI (Cash Flow from Investing Activities): Dòng tiền từ mua sắm/thanh lý tài sản cố định (Capex) hoặc đầu tư tài chính.\n3. CFF (Cash Flow from Financing Activities): Dòng tiền từ phát hành/mua lại cổ phiếu, vay nợ và chi trả cổ tức.",
            "tag": "Báo cáo tài chính"
      },
      {
            "id": 5,
            "front": "Sự khác nhau giữa chỉ số P/E (Price to Earnings) và EV/EBITDA trong định giá doanh nghiệp là gì?",
            "back": "• P/E: Đo lường giá trị vốn cổ phần (Equity Value) so với lợi nhuận ròng thuộc về cổ đông. Bị ảnh hưởng bởi đòn bẩy nợ và thuế.\n• EV/EBITDA: Đo lường giá trị toàn bộ doanh nghiệp (Enterprise Value) so với dòng tiền hoạt động trước lãi vay, thuế và khấu hao. Không bị méo mó bởi cơ cấu nợ và chính sách khấu hao.",
            "tag": "Valuation"
      },
      {
            "id": 6,
            "front": "Công thức tính giá trị hiện tại của một dòng tiền đều vô hạn (Perpetuity) là gì?",
            "back": "$PV = \\frac{PMT}{r}$\nTrong đó PMT là số tiền nhận được đều đặn mỗi kỳ, r là lãi suất chiết khấu.",
            "tag": "TVM Core"
      },
      {
            "id": 7,
            "front": "Quy tắc chấp nhận dự án đầu tư theo tiêu chí NPV (Net Present Value - Giá trị hiện tại thuần) là gì?",
            "back": "• Nếu NPV > 0: Chấp nhận dự án (vì dự án gia tăng giá trị cho cổ đông).\n• Nếu NPV < 0: Từ chối dự án.\n• Nếu các dự án loại trừ lẫn nhau (Mutually Exclusive): Chọn dự án có NPV dương lớn nhất.",
            "tag": "Capital Budgeting"
      },
      {
            "id": 8,
            "front": "IRR (Internal Rate of Return - Tỷ suất hoàn vốn nội bộ) là gì?",
            "back": "Là mức lãi suất chiết khấu mà tại đó NPV của dự án bằng chính xác 0.\nQuy tắc: Chấp nhận dự án nếu $IRR > WACC$ (hoặc Hurdle Rate).",
            "tag": "Capital Budgeting"
      },
      {
            "id": 9,
            "front": "Mô hình định giá tài sản vốn CAPM (Capital Asset Pricing Model) có công thức là gì?",
            "back": "$E(R_i) = R_f + \\beta_i [E(R_m) - R_f]$\nTrong đó:\n• $R_f$: Lãi suất phi rủi ro (Trái phiếu chính phủ)\n• $\\beta_i$: Hệ số Beta đo lường rủi ro hệ thống của cổ phiếu\n• $[E(R_m) - R_f]$: Phần bù rủi ro thị trường (Equity Risk Premium).",
            "tag": "Portfolio Management"
      },
      {
            "id": 10,
            "front": "Hệ số Beta ($\\beta$) đo lường rủi ro gì của một cổ phiếu?",
            "back": "Đo lường RỦI RO HỆ THỐNG (Systematic Risk / Market Risk) - rủi ro thị trường không thể phân tán bằng cách đa dạng hóa danh mục.\n• $\\beta > 1$: Cổ phiếu biến động mạnh hơn thị trường chung.\n• $\\beta < 1$: Cổ phiếu phòng thủ, biến động ít hơn thị trường.",
            "tag": "Portfolio Management"
      },
      {
            "id": 11,
            "front": "Chỉ số thanh toán hiện hành (Current Ratio) và thanh toán nhanh (Quick Ratio) khác nhau ở điểm nào?",
            "back": "• Current Ratio = Tài sản ngắn hạn / Nợ ngắn hạn.\n• Quick Ratio (Acid-Test Ratio) = (Tiền + Đầu tư ngắn hạn + Phải thu) / Nợ ngắn hạn (LOẠI TRỪ HÀNG TỒN KHO vì hàng tồn kho thanh khoản kém nhất).",
            "tag": "Financial Ratios"
      },
      {
            "id": 12,
            "front": "Công thức tính giá trị cổ phiếu theo mô hình tăng trưởng Gordon (Gordon Growth Model) là gì?",
            "back": "$P_0 = \\frac{D_1}{r - g} = \\frac{D_0 \\times (1 + g)}{r - g}$\nTrong đó: $D_1$ là cổ tức kỳ tới, r là tỷ suất sinh lời đòi hỏi ($r > g$), g là tốc độ tăng trưởng cổ tức bền vững.",
            "tag": "Equity Valuation"
      },
      {
            "id": 13,
            "front": "Công thức tính tốc độ tăng trưởng bền vững (Sustainable Growth Rate - g) là gì?",
            "back": "$g = ROE \\times b = ROE \\times (1 - \\text{Dividend Payout Ratio})$\nTrong đó b là Tỷ lệ lợi nhuận giữ lại (Retention Rate).",
            "tag": "Corporate Finance"
      },
      {
            "id": 14,
            "front": "Chỉ số Đòn bẩy tài chính (Debt-to-Equity - D/E Ratio) đo lường điều gì?",
            "back": "Đo lường cơ cấu nguồn vốn: Tổng nợ vay / Vốn chủ sở hữu.\nChỉ số càng cao thể hiện doanh nghiệp sử dụng nhiều nợ vay để tài trợ tài sản, làm tăng rủi ro tài chính khi lãi suất tăng cao.",
            "tag": "Financial Ratios"
      },
      {
            "id": 15,
            "front": "Chỉ số khả năng thanh toán lãi vay (Interest Coverage Ratio) được tính như thế nào?",
            "back": "$\\text{Interest Coverage} = \\frac{EBIT}{\\text{Chi phí lãi vay}}$\nChỉ số cho biết lợi nhuận hoạt động gấp bao nhiêu lần nghĩa vụ trả lãi hàng kỳ. Dưới 1.5 cảnh báo nguy cơ mất khả năng thanh toán.",
            "tag": "Credit Analysis"
      },
      {
            "id": 16,
            "front": "Macaulay Duration trong định giá trái phiếu đo lường điều gì?",
            "back": "Đo lường thời gian đáo hạn bình quân có trọng số của các dòng tiền coupon và gốc trái phiếu (tính bằng số năm).",
            "tag": "Fixed Income"
      },
      {
            "id": 17,
            "front": "Modified Duration đo lường độ nhạy cảm của giá trái phiếu trước biến số nào?",
            "back": "Đo lường phần trăm thay đổi của giá trái phiếu khi lãi suất thị trường (Yield to Maturity) thay đổi 1%.\n$\\% \\Delta P \\approx -\\text{Modified Duration} \\times \\Delta y$",
            "tag": "Fixed Income"
      },
      {
            "id": 18,
            "front": "Độ lồi (Convexity) của trái phiếu có ý nghĩa gì đối với nhà đầu tư?",
            "back": "Đo lường độ cong của mối quan hệ Giá - Lãi suất. Khi lãi suất giảm, giá trái phiếu có độ lồi cao sẽ TĂNG NHANH HƠN; khi lãi suất tăng, giá GIẢM CHẬM HƠN (Convexity luôn có lợi cho nhà đầu tư).",
            "tag": "Fixed Income"
      },
      {
            "id": 19,
            "front": "Đường cong lợi suất dốc ngược (Inverted Yield Curve) thường là chỉ báo của hiện tượng kinh tế nào?",
            "back": "Chỉ báo hàng đầu dự báo một cuộc SUY THOÁI KINH TẾ (Economic Recession) sắp xảy ra trong vòng 6 đến 18 tháng tới (Lãi suất ngắn hạn cao hơn lãi suất dài hạn).",
            "tag": "Macroeconomics"
      },
      {
            "id": 20,
            "front": "Khái niệm \"Working Capital\" (Vốn lưu động thuần - NWC) được tính như thế nào?",
            "back": "$NWC = \\text{Tài sản ngắn hạn (Current Assets)} - \\text{Nợ ngắn hạn (Current Liabilities)}$\nNWC dương thể hiện doanh nghiệp có đủ tài sản thanh khoản để trang trải các nghĩa vụ ngắn hạn.",
            "tag": "Corporate Finance"
      },
      {
            "id": 21,
            "front": "Khái niệm \"Free Cash Flow to Firm\" (FCFF - Dòng tiền tự do cho toàn doanh nghiệp) là gì?",
            "back": "Dòng tiền sinh ra từ hoạt động kinh doanh sau khi đã trừ đi chi phí hoạt động và tái đầu tư tài sản cố định (Capex) cũng như vốn lưu động, sẵn sàng chi trả cho CẢ chủ nợ và cổ đông.",
            "tag": "Valuation"
      },
      {
            "id": 22,
            "front": "Khái niệm \"Free Cash Flow to Equity\" (FCFE - Dòng tiền tự do cho cổ đông) khác gì FCFF?",
            "back": "FCFE là dòng tiền còn lại duy nhất dành cho CỔ ĐÔNG sau khi đã trừ đi chi phí trả nợ gốc và lãi vay ròng cho chủ nợ.\n$FCFE = FCFF - \\text{Lãi vay} \\times (1 - t) + \\text{Vay nợ ròng}$",
            "tag": "Valuation"
      },
      {
            "id": 23,
            "front": "Chỉ số ROA (Return on Assets) và ROIC (Return on Invested Capital) khác nhau ra sao?",
            "back": "• ROA = Lợi nhuận ròng / Tổng tài sản (Bị méo mó bởi tài sản nhàn rỗi và cơ cấu nợ).\n• ROIC = NOPAT / Vốn đầu tư (Vốn CSH + Nợ vay chịu lãi). Đo lường hiệu quả sinh lời cốt lõi trên tổng vốn thực tế bỏ ra.",
            "tag": "Financial Analysis"
      },
      {
            "id": 24,
            "front": "Thuyết thị trường hiệu quả (Efficient Market Hypothesis - EMH) dạng yếu (Weak-form) phát biểu điều gì?",
            "back": "Giá chứng khoán đã phản ánh toàn bộ thông tin giá và khối lượng giao dịch trong QUÁ KHỨ. Do đó, việc sử dụng Phân tích kỹ thuật (Technical Analysis) KHÔNG THỂ tạo ra tỷ suất sinh lời vượt trội (Alpha) bền vững.",
            "tag": "Market Efficiency"
      },
      {
            "id": 25,
            "front": "EMH dạng bán mạnh (Semi-strong form) và dạng mạnh (Strong-form) phát biểu gì?",
            "back": "• Semi-strong: Giá đã phản ánh toàn bộ thông tin công khai (BCTC, tin tức). Phân tích cơ bản không tạo ra alpha.\n• Strong-form: Giá phản ánh CẢ thông tin nội gián (Insider information). Không ai có thể thắng thị trường.",
            "tag": "Market Efficiency"
      },
      {
            "id": 26,
            "front": "Hợp đồng tương lai (Futures Contract) khác gì Hợp đồng kỳ hạn (Forward Contract)?",
            "back": "• Futures: Được chuẩn hóa, giao dịch tập trung trên sàn giao dịch (Exchange), có thanh toán bù trừ hàng ngày (Mark-to-market), gần như không có rủi ro đối tác.\n• Forward: Thỏa thuận song phương tư nhân (OTC), không chuẩn hóa, rủi ro vỡ nợ đối tác cao.",
            "tag": "Derivatives"
      },
      {
            "id": 27,
            "front": "Quyền chọn Mua (Call Option) và Quyền chọn Bán (Put Option) mang lại quyền gì cho người mua?",
            "back": "• Call Option: QUYỀN (không phải nghĩa vụ) MUA tài sản cơ sở ở mức giá thực hiện (Strike Price) đã định.\n• Put Option: QUYỀN (không phải nghĩa vụ) BÁN tài sản cơ sở ở mức giá thực hiện đã định.",
            "tag": "Derivatives"
      },
      {
            "id": 28,
            "front": "Mối quan hệ ngang giá quyền chọn Mua - Bán (Put-Call Parity) có công thức là gì?",
            "back": "$c + \\frac{X}{(1+r)^T} = p + S_0$\nTrong đó: c là giá Call, p là giá Put, X là giá thực hiện, $S_0$ là giá giao ngay của cổ phiếu.",
            "tag": "Derivatives"
      },
      {
            "id": 29,
            "front": "Tỷ số Sharpe (Sharpe Ratio) đo lường hiệu quả danh mục đầu tư như thế nào?",
            "back": "$\\text{Sharpe Ratio} = \\frac{R_p - R_f}{\\sigma_p}$\nĐo lường phần bù lợi nhuận trên mỗi đơn vị TỔNG RỦI RO (Độ lệch chuẩn $\\sigma_p$). Tỷ số càng cao thể hiện danh mục đầu tư càng xuất sắc.",
            "tag": "Portfolio Management"
      },
      {
            "id": 30,
            "front": "Tỷ số Treynor (Treynor Ratio) khác gì so với Tỷ số Sharpe?",
            "back": "$\\text{Treynor Ratio} = \\frac{R_p - R_f}{\\beta_p}$\nTreynor chia cho rủi ro hệ thống Beta ($\\beta$) thay vì tổng rủi ro ($\\sigma$), phù hợp để đánh giá các danh mục đầu tư đã được đa dạng hóa hoàn hảo.",
            "tag": "Portfolio Management"
      },
      {
            "id": 31,
            "front": "Chỉ số Tobin's Q trong kinh tế học và tài chính được tính ra sao?",
            "back": "$\\text{Tobin's Q} = \\frac{\\text{Tổng giá trị thị trường của doanh nghiệp}}{\\text{Tổng chi phí thay thế tài sản}}$\n• Q > 1: Cổ phiếu được định giá cao hoặc doanh nghiệp có lợi thế cạnh tranh vô hình lớn.",
            "tag": "Corporate Finance"
      },
      {
            "id": 32,
            "front": "Chi phí cơ hội (Opportunity Cost) và Chi phí chìm (Sunk Cost) được xử lý thế nào trong thẩm định dự án?",
            "back": "• Chi phí cơ hội: BẮT BUỘC TÍNH vào dòng tiền dự án.\n• Chi phí chìm: HOÀN TOÀN BỎ QUA (vì là chi phí đã xảy ra trong quá khứ, không thể thu hồi dù dự án có tiến hành hay không).",
            "tag": "Capital Budgeting"
      },
      {
            "id": 33,
            "front": "Định lý Modigliani-Miller (M&M) mệnh đề I trong điều kiện không có thuế phát biểu gì?",
            "back": "Giá trị của doanh nghiệp KHÔNG PHỤ THUỘC vào cơ cấu vốn (tỷ lệ nợ/vốn chủ sở hữu). Việc vay nợ không làm thay đổi giá trị tổng thể của công ty trong thị trường tài chính hoàn hảo.",
            "tag": "Capital Structure"
      },
      {
            "id": 34,
            "front": "Lá chắn thuế từ lãi vay (Interest Tax Shield) làm tăng giá trị doanh nghiệp như thế nào theo M&M có thuế?",
            "back": "Do chi phí lãi vay được khấu trừ thuế TNDN, giá trị doanh nghiệp có nợ vay ($V_L$) sẽ cao hơn doanh nghiệp không có nợ ($V_U$) một lượng đúng bằng:\n$V_L = V_U + t \\times D$ (với t là thuế suất, D là nợ vay).",
            "tag": "Capital Structure"
      },
      {
            "id": 35,
            "front": "Lý thuyết trật tự phân hạng (Pecking Order Theory) về tài trợ vốn nói gì?",
            "back": "Doanh nghiệp ưu tiên nguồn tài trợ theo thứ tự:\n1. Nguồn vốn nội bộ (Lợi nhuận giữ lại) $\\rightarrow$\n2. Nợ vay (Phát hành trái phiếu, vay ngân hàng) $\\rightarrow$\n3. Cuối cùng mới phát hành cổ phiếu mới (do sợ phát tín hiệu tiêu cực pha loãng).",
            "tag": "Corporate Finance"
      },
      {
            "id": 36,
            "front": "Phương pháp định giá hàng tồn kho FIFO và LIFO mang lại kết quả thế nào trong môi trường lạm phát giá tăng?",
            "back": "• FIFO (Nhập trước xuất trước): Giá vốn thấp $\\rightarrow$ Lợi nhuận gộp cao hơn $\\rightarrow$ Thuế phải nộp cao hơn $\\rightarrow$ Giá trị tồn kho cuối kỳ sát giá thị trường.\n• LIFO (Nhập sau xuất trước): Giá vốn cao $\\rightarrow$ Lợi nhuận thấp $\\rightarrow$ Tiết kiệm thuế tiền mặt (LIFO không được IFRS chấp thuận).",
            "tag": "Financial Reporting"
      },
      {
            "id": 37,
            "front": "Khoản mục Khấu hao (Depreciation) ảnh hưởng gián tiếp đến dòng tiền như thế nào?",
            "back": "Khấu hao là chi phí phi tiền mặt (Non-cash expense), nhưng vì nó được khấu trừ trước thuế nên giúp TIẾT KIỆM TIỀN THUẾ một lượng bằng: $\\text{Depreciation} \\times \\text{Thuế suất}$.",
            "tag": "Cash Flow"
      },
      {
            "id": 38,
            "front": "Sự khác biệt giữa Hợp đồng thuê tài chính (Finance Lease) và Thuê hoạt động (Operating Lease) theo IFRS 16 là gì?",
            "back": "Theo IFRS 16, gần như TOÀN BỘ hợp đồng thuê đều phải ghi nhận trên Bảng CĐKT dưới dạng \"Tài sản quyền sử dụng\" (Right-of-use asset) và \"Nợ thuê tài chính\", chấm dứt việc giấu nợ ngoài bảng (Off-balance sheet financing).",
            "tag": "Financial Reporting"
      },
      {
            "id": 39,
            "front": "Lợi thế thương mại (Goodwill) phát sinh khi nào và có được trích khấu hao hàng năm theo IFRS không?",
            "back": "Goodwill phát sinh khi một doanh nghiệp mua lại doanh nghiệp khác với mức giá CAO HƠN giá trị hợp lý của tài sản thuần.\n⚠️ Theo IFRS: KHÔNG ĐƯỢC trích khấu hao mà phải kiểm tra suy giảm giá trị (Impairment test) hàng năm.",
            "tag": "Financial Reporting"
      },
      {
            "id": 40,
            "front": "Tỷ số giá trên doanh thu (P/S - Price to Sales) đặc biệt hữu ích khi định giá các doanh nghiệp nào?",
            "back": "Hữu ích khi định giá các công ty khởi nghiệp công nghệ tăng trưởng nhanh đang trong giai đoạn đầu LỖ RÒNG (Lợi nhuận ròng âm, chỉ số P/E vô nghĩa) hoặc các công ty có chu kỳ kinh doanh trồi sụt mạnh.",
            "tag": "Equity Valuation"
      },
      {
            "id": 41,
            "front": "Khái niệm \"Duration Gap\" trong quản trị rủi ro lãi suất của ngân hàng là gì?",
            "back": "Chênh lệch giữa thời lượng tài sản có ($D_A$) và thời lượng tài sản nợ ($D_L$):\n$\\text{Duration Gap} = D_A - \\left(\\frac{L}{A}\\right) D_L$\nKhi lãi suất tăng, nếu Gap dương thì giá trị vốn chủ sở hữu của ngân hàng sẽ giảm.",
            "tag": "Banking Risk"
      },
      {
            "id": 42,
            "front": "Trái phiếu không trả lãi định kỳ (Zero-Coupon Bond) có Macaulay Duration bằng bao nhiêu?",
            "back": "Đúng bằng THỜI HẠN ĐÁO HẠN CỦA NÓ (vì chỉ có duy nhất một dòng tiền hoàn trả gốc tại ngày đáo hạn).",
            "tag": "Fixed Income"
      },
      {
            "id": 43,
            "front": "Hệ số Alpha của Jensen (Jensen's Alpha) đo lường điều gì?",
            "back": "$\\alpha = R_p - [R_f + \\beta_p (R_m - R_f)]$\nĐo lường mức sinh lời vượt trội của nhà quản lý danh mục so với mức sinh lời kỳ vọng lý thuyết của mô hình CAPM. Alpha dương chứng minh kỹ năng chọn cổ phiếu xuất sắc.",
            "tag": "Performance Attribution"
      },
      {
            "id": 44,
            "front": "Sự khác biệt giữa Rủi ro phi hệ thống (Unsystematic Risk) và Rủi ro hệ thống (Systematic Risk) là gì?",
            "back": "• Rủi ro phi hệ thống: Rủi ro riêng biệt của từng công ty (cháy xưởng, CEO từ chức). CÓ THỂ TRIỆT TIÊU BẰNG ĐA DẠNG HÓA danh mục (khoảng 30 cổ phiếu).\n• Rủi ro hệ thống: Rủi ro chung toàn thị trường (lãi suất, chiến tranh). KHÔNG THỂ đa dạng hóa.",
            "tag": "Portfolio Management"
      },
      {
            "id": 45,
            "front": "Đường phân bổ vốn (CAL - Capital Allocation Line) biểu diễn mối quan hệ giữa những yếu tố nào?",
            "back": "Biểu diễn sự kết hợp giữa Tài sản phi rủi ro ($R_f$) và Danh mục tài sản rủi ro tối ưu. Độ dốc của đường CAL chính là Tỷ số Sharpe của danh mục rủi ro.",
            "tag": "Portfolio Management"
      },
      {
            "id": 46,
            "front": "Quy tắc thanh toán cổ tức: Ngày giao dịch không hưởng quyền (Ex-dividend Date) là ngày nào?",
            "back": "Là ngày mà người mua cổ phiếu vào ngày này TRỞ VỀ SAU sẽ KHÔNG ĐƯỢC NHẬN CỔ TỨC của đợt đó. Vào đầu ngày này, giá tham chiếu của cổ phiếu sẽ bị điều chỉnh giảm tương ứng với giá trị cổ tức.",
            "tag": "Corporate Finance"
      },
      {
            "id": 47,
            "front": "Chiến lược phòng hộ rủi ro (Delta Hedging) cho quyền chọn hoạt động ra sao?",
            "back": "Duy trì tỷ lệ vị thế cổ phiếu cơ sở bằng đúng hệ số Delta của quyền chọn ($\\Delta = \\frac{\\partial V}{\\partial S}$) để danh mục tổng thể miễn nhiễm trước các biến động nhỏ của giá cổ phiếu.",
            "tag": "Derivatives"
      },
      {
            "id": 48,
            "front": "Chỉ số Altman Z-Score được sử dụng để dự báo điều gì?",
            "back": "Dự báo XÁC SUẤT PHÁ SẢN của một doanh nghiệp trong vòng 2 năm tới dựa trên 5 tỷ số tài chính trọng yếu. $Z < 1.81$ cảnh báo vùng nguy hiểm (Distress Zone).",
            "tag": "Credit Risk"
      },
      {
            "id": 49,
            "front": "Rủi ro thanh khoản (Liquidity Risk) trong đầu tư trái phiếu là gì?",
            "back": "Rủi ro mà nhà đầu tư không thể bán tháo trái phiếu một cách nhanh chóng theo giá thị trường hợp lý do khối lượng giao dịch trên thị trường thứ cấp quá thưa thớt (Spread giá Mua-Bán rộng).",
            "tag": "Fixed Income"
      },
      {
            "id": 50,
            "front": "Khái niệm \"Earnings Quality\" (Chất lượng lợi nhuận) cao được đánh giá qua tiêu chí nào?",
            "back": "Khi Lợi nhuận ròng (Net Income) được HỖ TRỢ VỮNG CHẮC BỞI DÒNG TIỀN KINH DOANH THỰC TẾ (CFO $\\approx$ Net Income), các khoản mục dồn tích kế toán (Accruals) ở mức thấp và lợi nhuận đến từ hoạt động kinh doanh cốt lõi.",
            "tag": "Financial Analysis"
      }
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
,

  // =========================================================================
  // BỘ THẺ TIẾNG ANH SIÊU RẺ KÍCH CẦU (1 - 3 XU) - 335 FLASHCARDS
  // =========================================================================
  {
  "id": "english-core-vocab-100",
  "title": "100 Từ Vựng Cốt Lõi Oxford & Giao Tiếp Đời Sống",
  "subtitle": "Bộ 100 từ vựng tinh hoa kèm phiên âm IPA, từ đồng nghĩa & câu ví dụ thực tế chuẩn bản xứ",
  "category": "ngoai-ngu",
  "categoryLabel": "Từ Vựng Cốt Lõi Oxford",
  "badge": "Kích Cầu 1 Xu #1",
  "priceXu": 1,
  "originalPriceXu": 35,
  "rating": 4.98,
  "reviewsCount": 1280,
  "studentsCount": 4120,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Flashcard 3D Web",
    "10 Câu Trắc Nghiệm Ôn Tập"
  ],
  "description": "Nắm vững 100 từ vựng cốt lõi Oxford 3000 và tiếng Anh giao tiếp đời sống hiện đại. Mỗi thẻ đều tích hợp phiên âm quốc tế IPA, giải thích ngữ cảnh chi tiết, ví dụ song ngữ Anh - Việt và cặp từ đồng nghĩa/trái nghĩa giúp bạn nhớ sâu mà không cần học vẹt.",
  "highlights": [
    "100 Thẻ Anki chuẩn Oxford 3000 & giao tiếp đời sống hiện đại",
    "Đầy đủ phiên âm quốc tế IPA, từ loại, phân tích sắc thái ngữ cảnh",
    "Ví dụ thực tế song ngữ Anh - Việt sinh động, dễ liên tưởng",
    "Kèm từ đồng nghĩa (Synonyms) & trái nghĩa (Antonyms) mở rộng vốn từ"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "articulate /ɑːˈtɪk.jə.lət/ (adj/v)",
      "back": "Nghĩa: Nói năng lưu loát, rõ ràng, gãy gọn; Diễn đạt mạch lạc.\nVí dụ: She gave an articulate presentation that convinced the entire board.\nTừ đồng nghĩa: eloquent, expressive, coherent.\nTừ trái nghĩa: inarticulate, hesitant.",
      "tag": "Giao Tiếp & Biểu Đạt"
    },
    {
      "id": 2,
      "front": "empathy /ˈem.pə.θi/ (noun)",
      "back": "Nghĩa: Sự thấu cảm, khả năng đặt mình vào vị trí của người khác.\nPhân biệt: Sympathy (thương hại, đồng cảm) vs Empathy (thấu hiểu sâu sắc cảm xúc của họ).\nVí dụ: Great leaders always listen to their team with deep empathy.",
      "tag": "Cảm Xúc & Tâm Lý"
    },
    {
      "id": 3,
      "front": "reluctant /rɪˈlʌk.tənt/ (adj)",
      "back": "Nghĩa: Miễn cưỡng, lưỡng lự, không sẵn lòng làm gì.\nCấu trúc: be reluctant to do something.\nVí dụ: He was reluctant to admit his mistake in front of colleagues.\nTừ đồng nghĩa: hesitant, unwilling.",
      "tag": "Thái Độ & Tâm Lý"
    },
    {
      "id": 4,
      "front": "enthusiastic /ɪnˌθjuː.ziˈæs.tɪk/ (adj)",
      "back": "Nghĩa: Hào hứng, nhiệt huyết, say mê.\nCấu trúc: be enthusiastic about something / doing something.\nVí dụ: The students were enthusiastic about the new English flashcard system.",
      "tag": "Cảm Xúc Tích Cực"
    },
    {
      "id": 5,
      "front": "overwhelmed /ˌəʊ.vəˈwelmd/ (adj)",
      "back": "Nghĩa: Quá tải, ngợp, bị choáng ngợp trước lượng công việc hoặc cảm xúc lớn.\nVí dụ: Working 14 hours a day left him completely overwhelmed.\nTừ đồng nghĩa: overloaded, swamped.",
      "tag": "Cảm Xúc & Đời Sống"
    },
    {
      "id": 6,
      "front": "ambivalent /æmˈbɪv.ə.lənt/ (adj)",
      "back": "Nghĩa: Cảm xúc hai chiều, vừa thích vừa ghét, mâu thuẫn trong lòng.\nVí dụ: She felt ambivalent about moving abroad for work.",
      "tag": "Tâm Trạng"
    },
    {
      "id": 7,
      "front": "spontaneous /spɒnˈteɪ.ni.əs/ (adj)",
      "back": "Nghĩa: Tự phát, ngẫu hứng, không lên kế hoạch trước.\nVí dụ: We took a spontaneous road trip to Da Lat last weekend.\nTừ đồng nghĩa: impulsive, unplanned.",
      "tag": "Phong Cách Sống"
    },
    {
      "id": 8,
      "front": "meticulous /məˈtɪk.jə.ləs/ (adj)",
      "back": "Nghĩa: Tỉ mỉ, cẩn thận từng chi tiết nhỏ nhất.\nVí dụ: The architect kept meticulous notes on every measurement.\nTừ đồng nghĩa: painstaking, thorough, detailed.",
      "tag": "Tính Cách & Làm Việc"
    },
    {
      "id": 9,
      "front": "resilient /rɪˈzɪl.i.ənt/ (adj)",
      "back": "Nghĩa: Kiên cường, phục hồi nhanh sau thất bại hoặc nghịch cảnh.\nVí dụ: Children are often surprisingly resilient when adapting to new schools.\nDanh từ: resilience (sự bền bỉ kiên cường).",
      "tag": "Phẩm Chất Vàng"
    },
    {
      "id": 10,
      "front": "genuine /ˈdʒen.ju.ɪn/ (adj)",
      "back": "Nghĩa: Chân thật, thành thật, hàng thật (không phải giả tạo).\nVí dụ: He showed genuine concern for the community's welfare.\nTừ đồng nghĩa: authentic, sincere.\nTừ trái nghĩa: fake, hypocritical.",
      "tag": "Phẩm Chất"
    },
    {
      "id": 11,
      "front": "procrastinate /prəʊˈkræs.tɪ.neɪt/ (verb)",
      "back": "Nghĩa: Trì hoãn, chần chừ, việc hôm nay để ngày mai.\nVí dụ: Most students procrastinate until the night before the exam.\nDanh từ: procrastination (căn bệnh trì hoãn).",
      "tag": "Thói Quen"
    },
    {
      "id": 12,
      "front": "commute /kəˈmjuːt/ (verb/noun)",
      "back": "Nghĩa: Quãng đường hoặc hành động đi lại hàng ngày giữa nhà và chỗ làm/chỗ học.\nVí dụ: My daily commute takes about 45 minutes by motorbike.",
      "tag": "Đời Sống Thường Nhật"
    },
    {
      "id": 13,
      "front": "frugal /ˈfruː.ɡəl/ (adj)",
      "back": "Nghĩa: Tiết kiệm, chi tiêu có tính toán (không hoang phí nhưng không bủn xỉn).\nVí dụ: Living a frugal lifestyle helped them save enough to buy an apartment.\nTừ đồng nghĩa: economical, thrifty.",
      "tag": "Tài Chính Đời Sống"
    },
    {
      "id": 14,
      "front": "errand /ˈer.ənd/ (noun)",
      "back": "Nghĩa: Việc vặt cần đi ra ngoài để làm (mua đồ, gửi thư, nộp hóa đơn...).\nCụm hay dùng: run an errand (đi làm việc vặt).\nVí dụ: I have to run a few errands before the supermarket closes.",
      "tag": "Đời Sống"
    },
    {
      "id": 15,
      "front": "hospitality /ˌhɒs.pɪˈtæl.ə.ti/ (noun)",
      "back": "Nghĩa: Lòng hiếu khách, sự đón tiếp nồng hậu; ngành dịch vụ khách sạn - nhà hàng.\nVí dụ: Vietnamese people are famous worldwide for their warm hospitality.",
      "tag": "Xã Hội & Du Lịch"
    },
    {
      "id": 16,
      "front": "serendipity /ˌser.ənˈdɪp.ə.ti/ (noun)",
      "back": "Nghĩa: Sự may mắn tình cờ, cái duyên ngẫu nhiên tìm thấy điều tốt đẹp.\nVí dụ: Meeting my best friend at a coffee shop in Hanoi was pure serendipity.",
      "tag": "Từ Vựng Đẹp"
    },
    {
      "id": 17,
      "front": "nostalgia /nɒsˈtæl.dʒə/ (noun)",
      "back": "Nghĩa: Nỗi hoài niệm, cảm giác nhớ nhung về ký ức tươi đẹp trong quá khứ.\nTính từ: nostalgic /nɒsˈtæl.dʒɪk/.\nVí dụ: Hearing that old song filled me with nostalgia.",
      "tag": "Cảm Xúc"
    },
    {
      "id": 18,
      "front": "aesthetic /esˈθet.ɪk/ (adj/noun)",
      "back": "Nghĩa: Mang tính thẩm mỹ, gu thẩm mỹ, đẹp mắt theo phong cách riêng.\nVí dụ: The cafe has a minimalist Japanese aesthetic with lots of natural light.",
      "tag": "Đời Sống & Nghệ Thuật"
    },
    {
      "id": 19,
      "front": "feasible /ˈfiː.zə.bəl/ (adj)",
      "back": "Nghĩa: Khả thi, có thể thực hiện được trong thực tế.\nVí dụ: With our current budget, launching this feature next month is completely feasible.\nTừ trái nghĩa: unfeasible, impractical.",
      "tag": "Công Việc & Dự Án"
    },
    {
      "id": 20,
      "front": "prioritize /praɪˈɒr.ɪ.taɪz/ (verb)",
      "back": "Nghĩa: Ưu tiên, sắp xếp thứ tự ưu tiên cho công việc quan trọng nhất.\nVí dụ: You must prioritize your health over working overtime.\nDanh từ: priority (sự ưu tiên).",
      "tag": "Kỹ Năng Quản Lý"
    },
    {
      "id": 21,
      "front": "collaborate /kəˈlæb.ə.reɪt/ (verb)",
      "back": "Nghĩa: Cộng tác, làm việc nhóm cùng nhau để đạt mục tiêu chung.\nCấu trúc: collaborate with someone on something.\nVí dụ: Two departments collaborated on the new mobile app design.",
      "tag": "Kỹ Năng Làm Việc"
    },
    {
      "id": 22,
      "front": "delegate /ˈdel.ɪ.ɡeɪt/ (verb)",
      "back": "Nghĩa: Giao quyền, ủy thác công việc cho cấp dưới hoặc người khác.\nVí dụ: An effective manager knows when and how to delegate tasks.",
      "tag": "Quản Lý"
    },
    {
      "id": 23,
      "front": "initiative /ɪˈnɪʃ.ə.tɪv/ (noun)",
      "back": "Nghĩa: Sáng kiến; Sự chủ động tự giác trong công việc.\nCụm hay gặp: take the initiative (chủ động hành động trước).\nVí dụ: She took the initiative to revamp the customer feedback system.",
      "tag": "Kỹ Năng Đột Phá"
    },
    {
      "id": 24,
      "front": "networking /ˈnet.wɜː.kɪŋ/ (noun)",
      "back": "Nghĩa: Xây dựng và duy trì mạng lưới quan hệ công việc, xã hội.\nVí dụ: Attending industry workshops is great for career networking.",
      "tag": "Sự Nghiệp"
    },
    {
      "id": 25,
      "front": "brainstorm /ˈbreɪn.stɔːm/ (verb/noun)",
      "back": "Nghĩa: Động não, cùng ngồi thảo luận nảy sinh ra ý tưởng mới.\nVí dụ: Let's brainstorm some viral marketing hooks for TikTok tomorrow.",
      "tag": "Sáng Tạo"
    },
    {
      "id": 26,
      "front": "coherent /kəʊˈhɪə.rənt/ (adj)",
      "back": "Nghĩa: Mạch lạc, logic, chặt chẽ, dễ hiểu.\nVí dụ: Your essay needs a more coherent argument structure.",
      "tag": "Lập Luận & Viết"
    },
    {
      "id": 27,
      "front": "persuasive /pəˈsweɪ.sɪv/ (adj)",
      "back": "Nghĩa: Mang tính thuyết phục cao, khiến người khác tin theo.\nVí dụ: The lawyer presented persuasive evidence to the jury.",
      "tag": "Thuyết Phục"
    },
    {
      "id": 28,
      "front": "plausible /ˈplɔː.zə.bəl/ (adj)",
      "back": "Nghĩa: Hợp lý, có vẻ đáng tin, có thể chấp nhận được.\nVí dụ: That sounds like a plausible explanation for the sudden server crash.",
      "tag": "Tư Duy Phản Biện"
    },
    {
      "id": 29,
      "front": "contradict /ˌkɒn.trəˈdɪkt/ (verb)",
      "back": "Nghĩa: Mâu thuẫn với, trái ngược với, cãi lại.\nVí dụ: His recent statements directly contradict what he said last week.\nDanh từ: contradiction.",
      "tag": "Logic & Lập Luận"
    },
    {
      "id": 30,
      "front": "deduce /dɪˈdʒuːs/ (verb)",
      "back": "Nghĩa: Suy luận, suy diễn ra từ các dữ kiện có sẵn.\nVí dụ: From the footprint size, the detective deduced the suspect was tall.",
      "tag": "Tư Duy"
    },
    {
      "id": 31,
      "front": "scrutinize /ˈskruː.tɪ.naɪz/ (verb)",
      "back": "Nghĩa: Soi xét, kiểm tra kỹ lưỡng từng chân tơ kẽ tóc.\nVí dụ: Auditors will scrutinize every single financial transaction.",
      "tag": "Phân Tích"
    },
    {
      "id": 32,
      "front": "advocate /ˈæd.və.keɪt/ (verb/noun)",
      "back": "Nghĩa: (v) Ủng hộ, công khai tán thành một quan điểm/chính sách; (n) Người ủng hộ.\nVí dụ: Environmentalists advocate for stricter limits on single-use plastics.",
      "tag": "Xã Hội & Quan Điểm"
    },
    {
      "id": 33,
      "front": "compromise /ˈkɒm.prə.maɪz/ (noun/verb)",
      "back": "Nghĩa: Sự thỏa hiệp, nhượng bộ lẫn nhau để đạt được giải pháp hòa hợp.\nVí dụ: In any successful partnership, both sides must learn to compromise.",
      "tag": "Đàm Phán"
    },
    {
      "id": 34,
      "front": "sustainable /səˈsteɪ.nə.bəl/ (adj)",
      "back": "Nghĩa: Bền vững, có thể duy trì lâu dài mà không làm cạn kiệt tài nguyên.\nVí dụ: Renewable solar energy is key to sustainable economic development.",
      "tag": "Môi Trường & Xu Hướng"
    },
    {
      "id": 35,
      "front": "innovative /ˈɪn.ə.və.tɪv/ (adj)",
      "back": "Nghĩa: Có tính đổi mới, sáng tạo đột phá chưa từng có.\nVí dụ: The startup introduced an innovative way to learn vocabulary via 3D flashcards.",
      "tag": "Công Nghệ & Đổi Mới"
    },
    {
      "id": 36,
      "front": "automation /ˌɔː.təˈmeɪ.ʃən/ (noun)",
      "back": "Nghĩa: Tự động hóa, việc sử dụng máy móc/AI thay thế thao tác con người.\nVí dụ: Workflow automation saves our marketing team 15 hours every week.",
      "tag": "Công Nghệ 2026"
    },
    {
      "id": 37,
      "front": "cybersecurity /ˌsaɪ.bə.sɪˈkjʊə.rə.ti/ (noun)",
      "back": "Nghĩa: An ninh mạng, bảo mật hệ thống thông tin khỏi hacker.\nVí dụ: Companies are investing billions in cybersecurity to protect customer data.",
      "tag": "Công Nghệ"
    },
    {
      "id": 38,
      "front": "carbon footprint /ˈkɑː.bən ˌfʊt.prɪnt/ (noun)",
      "back": "Nghĩa: Dấu chân carbon (lượng khí thải nhà kính do cá nhân/tổ chức thải ra).\nVí dụ: Riding electric bicycles helps reduce your urban carbon footprint.",
      "tag": "Môi Trường"
    },
    {
      "id": 39,
      "front": "digital nomad /ˌdɪdʒ.ɪ.təl ˈnəʊ.mæd/ (noun)",
      "back": "Nghĩa: Dân du mục kỹ thuật số (người làm việc từ xa kết hợp du lịch khắp nơi).\nVí dụ: Da Nang and Bali have become top global destinations for digital nomads.",
      "tag": "Phong Cách Sống Mới"
    },
    {
      "id": 40,
      "front": "lucrative /ˈluː.krə.tɪv/ (adj)",
      "back": "Nghĩa: Béo bở, sinh lợi cao, kiếm được rất nhiều tiền.\nVí dụ: E-commerce in Southeast Asia remains an extremely lucrative market.\nTừ đồng nghĩa: profitable, high-paying.",
      "tag": "Kinh Doanh & Tiền Bạc"
    },
    {
      "id": 41,
      "front": "monotonous /məˈnɒt.ən.əs/ (adj)",
      "back": "Nghĩa: Đơn điệu, tẻ nhạt, buồn ngủ vì lặp đi lặp lại một thứ hoài.\nVí dụ: Entering data into spreadsheets all day can become very monotonous.\nTừ đồng nghĩa: tedious, repetitive.",
      "tag": "Cảm Giác & Công Việc"
    },
    {
      "id": 42,
      "front": "pragmatic /præɡˈmæt.ɪk/ (adj)",
      "back": "Nghĩa: Thực tế, thực dụng, trọng tính khả thi hơn là lý thuyết viển vông.\nVí dụ: She made a pragmatic decision to launch the MVP before adding complex features.",
      "tag": "Tư Duy Thực Chiến"
    },
    {
      "id": 43,
      "front": "ubiquitous /juːˈbɪk.wɪ.təs/ (adj)",
      "back": "Nghĩa: Phổ biến ở khắp mọi nơi (omnipresent).\nVí dụ: QR codes for mobile payment have become ubiquitous in Vietnam.",
      "tag": "Xu Hướng Hiện Đại"
    },
    {
      "id": 44,
      "front": "vulnerable /ˈvʌl.nər.ə.bəl/ (adj)",
      "back": "Nghĩa: Dễ bị tổn thương, yếu thế trước nguy cơ hoặc sự tấn công.\nVí dụ: Old operating systems are vulnerable to malware attacks.",
      "tag": "An Toàn & Xã Hội"
    },
    {
      "id": 45,
      "front": "resilient /rɪˈzɪl.i.ənt/ (adj)",
      "back": "Nghĩa: Mau phục hồi, dẻo dai kiên cường sau khó khăn.\nVí dụ: The startup proved resilient despite market downturns.",
      "tag": "Phẩm Chất"
    },
    {
      "id": 46,
      "front": "meticulous /məˈtɪk.jə.ləs/ (adj)",
      "back": "Nghĩa: Tỉ mỉ, cẩn thận từng li từng tí.\nVí dụ: She checked the financial report with meticulous precision.",
      "tag": "Kỹ Năng"
    },
    {
      "id": 47,
      "front": "spontaneous /spɒnˈteɪ.ni.əs/ (adj)",
      "back": "Nghĩa: Bộc phát, tự nhiên ngẫu hứng.\nVí dụ: The audience gave a spontaneous standing ovation.",
      "tag": "Giao Tiếp"
    },
    {
      "id": 48,
      "front": "indispensable /ˌɪn.dɪˈspen.sə.bəl/ (adj)",
      "back": "Nghĩa: Không thể thiếu được, tối quan trọng.\nVí dụ: Smartphones have become an indispensable tool in modern education.\nTừ đồng nghĩa: essential, crucial.",
      "tag": "Tầm Quan Trọng"
    },
    {
      "id": 49,
      "front": "deteriorate /dɪˈtɪə.ri.ə.reɪt/ (verb)",
      "back": "Nghĩa: Xuống cấp, xấu đi, giảm sút chất lượng theo thời gian.\nVí dụ: Air quality deteriorates rapidly during peak traffic hours.\nTừ đồng nghĩa: worsen, decline.",
      "tag": "Biến Đổi"
    },
    {
      "id": 50,
      "front": "alleviate /əˈliː.vi.eɪt/ (verb)",
      "back": "Nghĩa: Làm dịu bớt, giảm nhẹ nỗi đau, gánh nặng hoặc sự khó chịu.\nVí dụ: Building new flyovers helped alleviate traffic congestion in the city center.\nTừ đồng nghĩa: ease, relieve, mitigate.",
      "tag": "Giải Pháp"
    },
    {
      "id": 51,
      "front": "mitigate /ˈmɪt.ɪ.ɡeɪt/ (verb)",
      "back": "Nghĩa: Giảm thiểu rủi ro, thiệt hại hoặc tác động tiêu cực.\nVí dụ: Companies must take proactive steps to mitigate financial risks.\nTừ đồng nghĩa: minimize, reduce.",
      "tag": "Quản Trị Rủi Ro"
    },
    {
      "id": 52,
      "front": "unprecedented /ʌnˈpres.ɪ.den.tɪd/ (adj)",
      "back": "Nghĩa: Chưa từng có tiền lệ, chưa từng xảy ra trong lịch sử.\nVí dụ: The sudden boom in generative AI represents unprecedented technological progress.",
      "tag": "Sự Kiện Đột Phá"
    },
    {
      "id": 53,
      "front": "substantiate /səbˈstæn.ʃi.eɪt/ (verb)",
      "back": "Nghĩa: Cung cấp bằng chứng xác thực, chứng minh lời nói là có căn cứ.\nVí dụ: You need verifiable data to substantiate your business claims.",
      "tag": "Khoa Học & Luật"
    },
    {
      "id": 54,
      "front": "cumbersome /ˈkʌm.bə.səm/ (adj)",
      "back": "Nghĩa: Cồng kềnh, nặng nề, quy trình phức tạp rườm rà gây khó chịu.\nVí dụ: Replacing cumbersome paperwork with digital apps made onboarding seamless.",
      "tag": "Quy Trình & Thiết Bị"
    },
    {
      "id": 55,
      "front": "seamless /ˈsiːm.ləs/ (adj)",
      "back": "Nghĩa: Liền mạch, mượt mà không chút ngắt quãng hay trục trặc.\nVí dụ: The app provides a seamless payment experience in less than 3 seconds.",
      "tag": "Trải Nghiệm UX"
    },
    {
      "id": 56,
      "front": "benchmark /ˈbentʃ.mɑːk/ (noun/verb)",
      "back": "Nghĩa: Tiêu chuẩn chuẩn mực để so sánh đánh giá hiệu suất.\nVí dụ: IELTS 7.5 has become the benchmark for international university admissions.",
      "tag": "Đo Lường & Chuẩn"
    },
    {
      "id": 57,
      "front": "leverage /ˈliː.vər.ɪdʒ/ (verb/noun)",
      "back": "Nghĩa: Tận dụng tối đa đòn bẩy hoặc nguồn lực có sẵn để đạt kết quả vượt bậc.\nVí dụ: We should leverage AI to generate high-quality flashcards at zero marginal cost.",
      "tag": "Kinh Doanh 4.0"
    },
    {
      "id": 58,
      "front": "synergy /ˈsɪn.ə.dʒi/ (noun)",
      "back": "Nghĩa: Sức mạnh cộng hưởng (1 + 1 > 2 khi hai bên hợp tác).\nVí dụ: The synergy between marketing and tech teams doubled the conversion rate.",
      "tag": "Hợp Tác Doanh Nghiệp"
    },
    {
      "id": 59,
      "front": "streamline /ˈstriːm.laɪn/ (verb)",
      "back": "Nghĩa: Tinh gọn hóa, tối ưu quy trình để chạy nhanh và hiệu quả hơn.\nVí dụ: The company streamlined its hiring process from 5 rounds down to 2.",
      "tag": "Quản Trị Tinh Gọn"
    },
    {
      "id": 60,
      "front": "paradigm shift /ˈpær.ə.daɪm ʃɪft/ (noun)",
      "back": "Nghĩa: Sự chuyển dịch mô thức căn bản, bước ngoặt thay đổi toàn bộ cách tư duy.\nVí dụ: Remote work brought a paradigm shift in how people view corporate culture.",
      "tag": "Tư Duy Đột Phá"
    },
    {
      "id": 61,
      "front": "bandwidth /ˈbænd.wɪtθ/ (noun - nghĩa bóng công sở)",
      "back": "Nghĩa: Quỹ thời gian, sức lực hoặc dung lượng não bộ để nhận thêm việc mới.\nVí dụ: I'd love to help on this project, but I don't have the bandwidth this week.",
      "tag": "Thuật Ngữ Công Sở"
    },
    {
      "id": 62,
      "front": "bottleneck /ˈbɒt.əl.nek/ (noun)",
      "back": "Nghĩa: Điểm nghẽn cổ chai (nơi gây tắc nghẽn, làm chậm cả hệ thống).\nVí dụ: Manual code review was the main bottleneck delaying our product deployment.",
      "tag": "Vận Hành"
    },
    {
      "id": 63,
      "front": "disruptive /dɪsˈrʌp.tɪv/ (adj)",
      "back": "Nghĩa: Mang tính đột phá phá vỡ trật tự thị trường cũ (như Uber, ChatGPT).\nVí dụ: Electric vehicles are a disruptive force transforming the automotive industry.",
      "tag": "Công Nghệ & Thị Trường"
    },
    {
      "id": 64,
      "front": "scalable /ˈskeɪ.lə.bəl/ (adj)",
      "back": "Nghĩa: Có khả năng mở rộng quy mô dễ dàng mà chi phí không tăng đột biến.\nVí dụ: SaaS software is highly scalable because serving 10,000 users costs almost the same as 100.",
      "tag": "Startup & Tech"
    },
    {
      "id": 65,
      "front": "retention /rɪˈten.ʃən/ (noun)",
      "back": "Nghĩa: Tỷ lệ giữ chân người dùng / nhân viên ở lại lâu dài.\nVí dụ: Good onboarding experiences dramatically increase 30-day user retention.",
      "tag": "Chỉ Số Doanh Nghiệp"
    },
    {
      "id": 66,
      "front": "conversion rate /kənˈvɜː.ʃən reɪt/ (noun)",
      "back": "Nghĩa: Tỷ lệ chuyển đổi (từ người xem thành người mua hàng/đăng ký).\nVí dụ: Adding video testimonials increased our landing page conversion rate by 24%.",
      "tag": "Marketing 2026"
    },
    {
      "id": 67,
      "front": "traction /ˈtræk.ʃən/ (noun)",
      "back": "Nghĩa: Lực kéo thị trường, đà tăng trưởng và sự đón nhận của người dùng ban đầu.\nVí dụ: The new flashcard app gained tremendous traction on TikTok within 48 hours.",
      "tag": "Startup & Viral"
    },
    {
      "id": 68,
      "front": "turnover /ˈtɜːnˌəʊ.vər/ (noun)",
      "back": "Nghĩa: Doanh số bán hàng; Hoặc tỷ lệ nhân viên nghỉ việc (employee turnover).\nVí dụ: High staff turnover costs companies thousands of dollars in retraining.",
      "tag": "Kinh Doanh"
    },
    {
      "id": 69,
      "front": "feasibility study /ˌfiː.zəˈbɪl.ə.ti ˈstʌd.i/ (noun)",
      "back": "Nghĩa: Nghiên cứu tiền khả thi để đánh giá dự án có thực hiện được không.\nVí dụ: The government commissioned a feasibility study before building the subway line.",
      "tag": "Dự Án Lớn"
    },
    {
      "id": 70,
      "front": "lucrative /ˈluː.krə.tɪv/ (adj)",
      "back": "Nghĩa: Sinh lời lớn, bội thu tiền bạc.\nVí dụ: AI prompt engineering is currently a lucrative career path.",
      "tag": "Sự Nghiệp"
    },
    {
      "id": 71,
      "front": "prerequisite /ˌpriːˈrek.wɪ.zɪt/ (noun)",
      "back": "Nghĩa: Điều kiện tiên quyết phải có trước khi làm gì tiếp theo.\nVí dụ: Basic algebra is a prerequisite for advanced computer science algorithms.",
      "tag": "Học Tập"
    },
    {
      "id": 72,
      "front": "comprehensive /ˌkɒm.prɪˈhen.sɪv/ (adj)",
      "back": "Nghĩa: Toàn diện, bao quát trọn vẹn mọi mặt.\nVí dụ: This course provides a comprehensive guide to English grammar from A1 to C1.\nTừ đồng nghĩa: all-inclusive, thorough.",
      "tag": "Học Tập & Nghiên Cứu"
    },
    {
      "id": 73,
      "front": "unravel /ʌnˈræv.əl/ (verb)",
      "back": "Nghĩa: Tháo gỡ nút thắt, làm sáng tỏ bí ẩn; hoặc làm tan rã cơ cấu.\nVí dụ: Scientists are beginning to unravel the mysteries of neural networks.",
      "tag": "Khám Phá"
    },
    {
      "id": 74,
      "front": "resonate /ˈrez.ən.eɪt/ (verb)",
      "back": "Nghĩa: Gây tiếng vang, chạm đến cảm xúc, tạo sự đồng cảm sâu sắc.\nVí dụ: Her honest video resonated deeply with stressed students across the country.",
      "tag": "Truyền Cảm Hứng"
    },
    {
      "id": 75,
      "front": "tenacious /təˈneɪ.ʃəs/ (adj)",
      "back": "Nghĩa: Kiên trì bền bỉ, không chịu bỏ cuộc trước bất kỳ nghịch cảnh nào.\nVí dụ: Her tenacious pursuit of medical research led to a breakthrough cancer therapy.\nTừ đồng nghĩa: persistent, determined.",
      "tag": "Ý Chí"
    },
    {
      "id": 76,
      "front": "adversity /ədˈvɜː.sə.ti/ (noun)",
      "back": "Nghĩa: Nghịch cảnh, khó khăn trắc trở chồng chất.\nVí dụ: Overcoming adversity builds true mental resilience.\nTừ đồng nghĩa: hardship, difficulty.",
      "tag": "Cuộc Sống"
    },
    {
      "id": 77,
      "front": "impeccable /ɪmˈpek.ə.bəl/ (adj)",
      "back": "Nghĩa: Hoàn hảo không tì vết, chuẩn mực không có điểm chê.\nVí dụ: He spoke with an impeccable British accent after years in Oxford.\nTừ đồng nghĩa: flawless, immaculate.",
      "tag": "Khen Ngợi"
    },
    {
      "id": 78,
      "front": "perseverance /ˌpɜː.sɪˈvɪə.rəns/ (noun)",
      "back": "Nghĩa: Sự kiên trì nhẫn nại, nỗ lực không ngừng nghỉ theo đuổi mục tiêu.\nVí dụ: Learning 500 English flashcards requires daily perseverance, not just 1 night.",
      "tag": "Thành Công"
    },
    {
      "id": 79,
      "front": "complacent /kəmˈpleɪ.sənt/ (adj)",
      "back": "Nghĩa: Tự mãn, bằng lòng với thực tại mà lười phấn đấu tiếp.\nVí dụ: Market leaders who grow complacent will soon be overtaken by hungry startups.",
      "tag": "Cảnh Báo"
    },
    {
      "id": 80,
      "front": "ubiquity /juːˈbɪk.wɪ.ti/ (noun)",
      "back": "Nghĩa: Sự hiện diện khắp mọi nơi, tính phổ biến toàn diện.\nVí dụ: The ubiquity of internet connection transformed modern remote work.",
      "tag": "Xu Thế"
    },
    {
      "id": 81,
      "front": "insatiable /ɪnˈseɪ.ʃə.bəl/ (adj)",
      "back": "Nghĩa: Không thể thỏa mãn được, lòng khao khát vô đáy.\nVí dụ: Young children possess an insatiable curiosity about how the world works.",
      "tag": "Tính Cách"
    },
    {
      "id": 82,
      "front": "metamorphosis /ˌmet.əˈmɔː.fə.sɪs/ (noun)",
      "back": "Nghĩa: Sự biến thái chuyển hóa ngoạn mục (như sâu hóa bướm).\nVí dụ: The company underwent a radical metamorphosis from print media to digital AI.",
      "tag": "Biến Chuyển"
    },
    {
      "id": 83,
      "front": "epitome /ɪˈpɪt.ə.mi/ (noun)",
      "back": "Nghĩa: Hình mẫu điển hình, biểu tượng hoàn hảo nhất của một phẩm chất.\nCấu trúc: the epitome of something.\nVí dụ: With her calm and kind manner, she is the epitome of elegance.",
      "tag": "Hình Tượng"
    },
    {
      "id": 84,
      "front": "ephemeral /ɪˈfem.ər.əl/ (adj)",
      "back": "Nghĩa: Phù du chóng tàn, tồn tại chốc lát rồi tan biến.\nVí dụ: Social media hype is often ephemeral, but solid product utility lasts.",
      "tag": "Triết Lý Sống"
    },
    {
      "id": 85,
      "front": "catalyst /ˈkæt.əl.ɪst/ (noun)",
      "back": "Nghĩa: Chất xúc tác, tác nhân thúc đẩy sự việc biến chuyển thần tốc.\nVí dụ: The pandemic was a major catalyst for the global adoption of remote education.",
      "tag": "Động Lực"
    },
    {
      "id": 86,
      "front": "dichotomy /daɪˈkɒt.ə.mi/ (noun)",
      "back": "Nghĩa: Sự phân đôi, sự đối lập nhị nguyên giữa hai trường phái.\nVí dụ: The debate highlights the dichotomy between theoretical science and applied engineering.",
      "tag": "Học Thuật"
    },
    {
      "id": 87,
      "front": "lucid /ˈluː.sɪd/ (adj)",
      "back": "Nghĩa: Rõ ràng, sáng suốt, rành mạch (lời nói, giấc mơ, tâm trí).\nVí dụ: The professor gave a lucid summary of quantum mechanics in just 10 minutes.",
      "tag": "Tư Duy"
    },
    {
      "id": 88,
      "front": "magnanimous /mæɡˈnæn.ɪ.məs/ (adj)",
      "back": "Nghĩa: Hào hiệp, đại lượng, bao dung tha thứ cho đối thủ.\nVí dụ: He was magnanimous in victory, praising his competitor's spirited performance.",
      "tag": "Nhân Cách"
    },
    {
      "id": 89,
      "front": "nuance /ˈnjuː.ɑːns/ (noun)",
      "back": "Nghĩa: Sắc thái khác biệt tinh tế rất nhỏ nhưng quan trọng.\nVí dụ: Understanding cultural nuances is vital when translating idioms from English to Vietnamese.",
      "tag": "Ngôn Ngữ & Văn Hóa"
    },
    {
      "id": 90,
      "front": "ostentatious /ˌɒs.tenˈteɪ.ʃəs/ (adj)",
      "back": "Nghĩa: Phô trương, khoe mẽ, phô diễn sự giàu có hào nhoáng.\nVí dụ: Wearing diamond chains to a casual lecture seemed overly ostentatious.\nTừ đồng nghĩa: showy, pretentious.",
      "tag": "Đời Sống"
    },
    {
      "id": 91,
      "front": "pristine /ˈprɪs.tiːn/ (adj)",
      "back": "Nghĩa: Nguyên sơ, tinh khôi, sạch sẽ vẹn nguyên chưa bị ô nhiễm.\nVí dụ: The island is famous for its pristine white sand beaches and crystal turquoise water.",
      "tag": "Thiên Nhiên"
    },
    {
      "id": 92,
      "front": "quandary /ˈkwɒn.dər.i/ (noun)",
      "back": "Nghĩa: Tình thế tiến thoái lưỡng nan, bối rối không biết nên chọn bên nào.\nVí dụ: I was in a quandary about whether to accept the higher-paying job or pursue a master's degree.",
      "tag": "Quyết Định"
    },
    {
      "id": 93,
      "front": "reticent /ˈret.ɪ.sənt/ (adj)",
      "back": "Nghĩa: Kín tiếng, e dè, ít chia sẻ về chuyện riêng tư.\nVí dụ: She remained reticent about her personal plans for the upcoming year.",
      "tag": "Tính Cách"
    },
    {
      "id": 94,
      "front": "stoic /ˈstəʊ.ɪk/ (adj/noun)",
      "back": "Nghĩa: Khắc kỷ, bình thản chịu đựng nghịch cảnh không than vãn.\nVí dụ: Despite severe financial hardships, he maintained a calm and stoic demeanor.",
      "tag": "Khắc Kỷ"
    },
    {
      "id": 95,
      "front": "transient /ˈtræn.zi.ənt/ (adj)",
      "back": "Nghĩa: Tạm thời, thoáng qua, chuyển dời liên tục không ở lâu.\nVí dụ: The economic downturn proved transient as markets rebounded within two quarters.",
      "tag": "Thời Gian"
    },
    {
      "id": 96,
      "front": "unwavering /ʌnˈweɪ.vər.ɪŋ/ (adj)",
      "back": "Nghĩa: Vững chắc không gì lay chuyển nổi, kiên định một lòng.\nVí dụ: Her unwavering dedication to helping disadvantaged children inspired thousands.",
      "tag": "Ý Chí"
    },
    {
      "id": 97,
      "front": "versatile /ˈvɜː.sə.taɪl/ (adj)",
      "back": "Nghĩa: Đa năng, linh hoạt thích ứng với nhiều vai trò khác nhau.\nVí dụ: An iPad with a stylus is an extraordinarily versatile tool for studying and drawing.",
      "tag": "Tính Năng"
    },
    {
      "id": 98,
      "front": "witty /ˈwɪt.i/ (adj)",
      "back": "Nghĩa: Dí dỏm, hóm hỉnh, thông minh nhanh nhảu trong câu chữ.\nVí dụ: His witty comments kept the entire room laughing throughout the meeting.",
      "tag": "Hài Hước"
    },
    {
      "id": 99,
      "front": "zealous /ˈzel.əs/ (adj)",
      "back": "Nghĩa: Sốt sắng, nhiệt thành cuồng nhiệt vì một lý tưởng.\nVí dụ: The zealous volunteers planted over 5,000 mangrove trees in one single weekend.",
      "tag": "Nhiệt Huyết"
    },
    {
      "id": 100,
      "front": "pivotal /ˈpɪv.ə.təl/ (adj)",
      "back": "Nghĩa: Mang tính then chốt, xoay chuyển cục diện, quyết định thành bại.\nVí dụ: Passing the civil service exam was a pivotal moment in his career path.\nTừ đồng nghĩa: crucial, decisive.",
      "tag": "Cột Mốc Vàng"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Từ nào sau đây mang nghĩa là 'Nói năng lưu loát, rõ ràng, gãy gọn'?",
      "options": [
        "A. Reluctant",
        "B. Articulate",
        "C. Ambivalent",
        "D. Monotonous"
      ],
      "correct": 1,
      "explanation": "Articulate /ɑːˈtɪk.jə.lət/ có nghĩa là nói năng lưu loát, rành mạch, diễn đạt gãy gọn."
    },
    {
      "id": 2,
      "question": "Điền từ thích hợp: 'Great leaders always listen to their team with deep ______.'",
      "options": [
        "A. empathy",
        "B. apathy",
        "C. disdain",
        "D. animosity"
      ],
      "correct": 0,
      "explanation": "Empathy có nghĩa là sự thấu cảm, khả năng đặt mình vào vị trí cảm xúc của người khác."
    },
    {
      "id": 3,
      "question": "Chọn từ TRÁI NGHĨA với 'Frugal' (tiết kiệm, chi tiêu tính toán):",
      "options": [
        "A. Thrifty",
        "B. Economical",
        "C. Extravagant",
        "D. Meticulous"
      ],
      "correct": 2,
      "explanation": "Extravagant có nghĩa là hoang phí, xa xỉ; trái nghĩa hoàn toàn với frugal."
    },
    {
      "id": 4,
      "question": "'Serendipity' được hiểu là gì trong tiếng Anh?",
      "options": [
        "A. Sự xui xẻo liên tiếp",
        "B. Nỗi buồn hoài niệm về quá khứ",
        "C. Sự may mắn tình cờ, cái duyên ngẫu nhiên tìm thấy điều tốt đẹp",
        "D. Sự lo lắng quá độ trước tương lai"
      ],
      "correct": 2,
      "explanation": "Serendipity là sự may mắn tình cờ, duyên lành đưa tới những phát hiện tuyệt vời."
    },
    {
      "id": 5,
      "question": "Từ nào đồng nghĩa với 'Painstaking' và 'Thorough' (tỉ mỉ, cẩn thận từng chi tiết)?",
      "options": [
        "A. Meticulous",
        "B. Spontaneous",
        "C. Careless",
        "D. Ephemeral"
      ],
      "correct": 0,
      "explanation": "Meticulous có nghĩa là tỉ mỉ, kỹ lưỡng từng chân tơ kẽ tóc."
    },
    {
      "id": 6,
      "question": "Điền từ thích hợp: 'Smartphones have become an ______ tool in modern distance education.'",
      "options": [
        "A. ephemeral",
        "B. indispensable",
        "C. cumbersome",
        "D. ostentatious"
      ],
      "correct": 1,
      "explanation": "Indispensable nghĩa là tuyệt đối không thể thiếu được (crucial, essential)."
    },
    {
      "id": 7,
      "question": "Từ 'Mitigate' có nghĩa là gì trong ngữ cảnh quản trị rủi ro?",
      "options": [
        "A. Làm trầm trọng thêm",
        "B. Giảm thiểu rủi ro hoặc thiệt hại",
        "C. Phớt lờ nguy cơ",
        "D. Bồi thường tài chính"
      ],
      "correct": 1,
      "explanation": "Mitigate nghĩa là giảm nhẹ, giảm thiểu mức độ rủi ro, thiệt hại hoặc tác động tiêu cực."
    },
    {
      "id": 8,
      "question": "Cụm từ nào đồng nghĩa với 'Omnipresent' (phổ biến ở khắp mọi nơi)?",
      "options": [
        "A. Lucrative",
        "B. Ubiquitous",
        "C. Vulnerable",
        "D. Pristine"
      ],
      "correct": 1,
      "explanation": "Ubiquitous có nghĩa là có mặt khắp nơi cùng lúc, phổ biến ở mọi ngóc ngách."
    },
    {
      "id": 9,
      "question": "Điền từ thích hợp: 'Auditors will ______ every single transaction to detect fraud.'",
      "options": [
        "A. procrastinate",
        "B. scrutinize",
        "C. deteriorate",
        "D. compromise"
      ],
      "correct": 1,
      "explanation": "Scrutinize nghĩa là soi xét, kiểm tra tỉ mỉ và nghiêm ngặt."
    },
    {
      "id": 10,
      "question": "Người có phẩm chất 'Resilient' là người như thế nào?",
      "options": [
        "A. Dễ bị suy sụp và bỏ cuộc",
        "B. Kiên cường, mau hồi phục sau thất bại hoặc nghịch cảnh",
        "C. Luôn tự mãn với kết quả hiện tại",
        "D. Thích phô trương sự giàu có"
      ],
      "correct": 1,
      "explanation": "Resilient chỉ phẩm chất dẻo dai, kiên cường, mau chóng gượng dậy sau khó khăn."
    }
  ]
},
  {
  "id": "english-master-grammar-80",
  "title": "80 Ngữ Pháp Trọng Tâm & Bẫy Đề Thi Chuẩn Hóa",
  "subtitle": "12 Thì, Câu điều kiện 1-3 & Mixed, Đảo ngữ, Thể giả định, Mệnh đề quan hệ & Bị động đặc biệt",
  "category": "ngoai-ngu",
  "categoryLabel": "Ngữ Pháp Trọng Điểm",
  "badge": "Hot Bán Chạy 2 Xu",
  "priceXu": 2,
  "originalPriceXu": 40,
  "rating": 4.99,
  "reviewsCount": 1640,
  "studentsCount": 5380,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Bản Đồ Tư Duy Ngữ Pháp",
    "10 Câu Trắc Nghiệm Bẫy Điểm"
  ],
  "description": "Chinh phục toàn bộ 80 quy tắc ngữ pháp then chốt và các bẫy đề thi kinh điển trong THPT Quốc Gia, TOEIC và IELTS. Xóa sổ hoàn toàn nỗi sợ nhầm thì, đảo ngữ phức tạp, câu chẻ, mệnh đề quan hệ rút gọn và thể giả định thức.",
  "highlights": [
    "80 Thẻ bao quát 100% chủ điểm ngữ pháp hay bẫy trong kỳ thi THPT & TOEIC/IELTS",
    "Phân tích mẹo nhận biết dấu hiệu thì, trật tự tính từ OSASCOMP, đảo ngữ kinh điển",
    "Mẹo giải nhanh bẫy hòa hợp S-V, đại từ quan hệ That/Which, mệnh đề rút gọn",
    "10 Câu hỏi trắc nghiệm kiểm tra sâu có lời giải thích cặn kẽ từng đáp án"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[Thì] Phân biệt Quá khứ đơn (Past Simple) vs Hiện tại hoàn thành (Present Perfect)?",
      "back": "• Past Simple (V2/ed): Hành động đã kết thúc HOÀN TOÀN tại thời điểm xác định trong quá khứ (yesterday, in 2020, ago, last month).\n  Ví dụ: I lost my key yesterday (hôm qua làm rơi chìa khóa, giờ có thể đã tìm thấy hoặc làm lại chìa mới).\n• Present Perfect (have/has + V3/ed): Hành động xảy ra không rõ thời gian HOẶC để lại kết quả/hệ quả ở HIỆN TẠI (since, for, already, yet, just, so far).\n  Ví dụ: I have lost my key (nghĩa là hiện tại tôi VẪN CHƯA CÓ chìa khóa để vào nhà!).",
      "tag": "12 Thì Căn Bản"
    },
    {
      "id": 2,
      "front": "[Thì] Phân biệt Hiện tại hoàn thành (Present Perfect) vs Hiện tại hoàn thành tiếp diễn (Present Perfect Continuous)?",
      "back": "• Present Perfect (have/has + V3/ed): Nhấn mạnh KẾT QUẢ hoặc SỐ LƯỢNG đã đạt được.\n  Ví dụ: She has written 5 chapters of her thesis.\n• Present Perfect Continuous (have/has been + V-ing): Nhấn mạnh QUÁ TRÌNH LIÊN TỤC, tính bền bỉ và sự mệt mỏi của hành động kéo dài đến nay.\n  Ví dụ: She has been writing her thesis all day (đến giờ vẫn đang cắm mặt viết, người rất mệt mỏi).",
      "tag": "12 Thì Nâng Cao"
    },
    {
      "id": 3,
      "front": "[Thì] Khi nào dùng Quá khứ hoàn thành (Past Perfect: had + V3/ed)?",
      "back": "Dùng để diễn tả một hành động xảy ra và hoàn tất TRƯỚC một hành động khác hoặc một mốc thời gian trong quá khứ.\n📌 Công thức: Hành động xảy ra trước = Past Perfect (had + V3/ed) | Hành động xảy ra sau = Past Simple (V2/ed).\nVí dụ: By the time we arrived at the concert hall, the band had already finished their first song.",
      "tag": "12 Thì Căn Bản"
    },
    {
      "id": 4,
      "front": "[Thì] Phân biệt Tương lai gần \"Be going to\" vs \"Will\"?",
      "back": "• Be going to + V-bare: Diễn tả quyết định ĐÃ CÓ KẾ HOẠCH từ trước HOẶC dự đoán dựa trên BẰNG CHỨNG rõ ràng ở hiện tại.\n  Ví dụ: Look at the sky! It is going to rain.\n• Will + V-bare: Quyết định bộc phát NGAY TẠI THỜI ĐIỂM NÓI, hoặc lời hứa, dự đoán mang tính chủ quan.\n  Ví dụ: The doorbell is ringing. I will go get it!",
      "tag": "12 Thì Căn Bản"
    },
    {
      "id": 5,
      "front": "[Bẫy thì] Diễn tả lịch trình, thời khóa biểu tàu xe / lớp học trong tương lai dùng thì gì?",
      "back": "Bắt buộc dùng THÌ HIỆN TẠI ĐƠN (Present Simple)!\n⚠️ Rất nhiều thí sinh nhầm sang dùng \"will\".\nVí dụ: The flight departs at 7:00 AM tomorrow (Đúng - Chuyến bay khởi hành lúc 7h sáng mai, dù là ngày mai nhưng vì theo lịch cố định nên chia Hiện tại đơn: departs).",
      "tag": "Bẫy Đề Thi 12 Thì"
    },
    {
      "id": 6,
      "front": "[Thì] Phân biệt Tương lai tiếp diễn (Future Continuous) vs Tương lai hoàn thành (Future Perfect)?",
      "back": "• Future Continuous (will be + V-ing): Đang diễn ra tại một thời điểm xác định trong tương lai.\n  Ví dụ: At 8 PM tonight, I will be having dinner with my family.\n• Future Perfect (will have + V3/ed): Sẽ HOÀN TẤT TRƯỚC một thời điểm trong tương lai (thường đi với By / By the time / Before).\n  Ví dụ: By next December, she will have completed her Master's degree.",
      "tag": "12 Thì Nâng Cao"
    },
    {
      "id": 7,
      "front": "[Thì] Phân biệt phối thì While vs When trong quá khứ?",
      "back": "• Hành động đang diễn ra (dài hơn) = Past Continuous (was/were + V-ing).\n• Hành động xen ngang (bất chợt) = Past Simple (V2/ed).\n📌 Ví dụ: When the phone rang, I was taking a shower.\n💡 Đi với While thường là tiếp diễn: While I was studying, my brother was playing games (hai hành động song song).",
      "tag": "Phối Hợp Thì"
    },
    {
      "id": 8,
      "front": "[Động từ chỉ trạng thái - Stative Verbs] Tại sao KHÔNG chia thì tiếp diễn (V-ing)?",
      "back": "Các động từ chỉ trạng thái, cảm xúc, nhận thức hoặc sở hữu thường KHÔNG dùng ở thì tiếp diễn:\n• Nhận thức: know, understand, believe, realize, recognize.\n• Cảm xúc: love, hate, like, prefer, want, wish.\n• Sở hữu: belong to, possess, own, contain.\n⚠️ Ví dụ sai: I am knowing him for 3 years. -> Đúng: I have known him for 3 years.",
      "tag": "Bẫy Động Từ"
    },
    {
      "id": 9,
      "front": "[Hiện tại tiếp diễn đặc biệt] Diễn tả sự phàn nàn, khó chịu thì dùng cấu trúc nào?",
      "back": "📌 Công thức: S + be ALWAYS / CONSTANTLY + V-ing.\nDiễn tả một thói quen xấu lặp đi lặp lại khiến người nói bực mình khó chịu.\nVí dụ: He is always leaving his dirty socks on the living room floor! (Anh ta cứ suốt ngày vứt tất bẩn bừa bãi!).",
      "tag": "Ngữ Pháp Tinh Tế"
    },
    {
      "id": 10,
      "front": "[Thói quen quá khứ] Phân biệt Used to + V vs Would + V?",
      "back": "• Used to + V-bare: Dùng được cho cả HÀNH ĐỘNG lặp lại và TRẠNG THÁI trong quá khứ.\n  Ví dụ: I used to live in Da Nang / I used to have long hair.\n• Would + V-bare: CHỈ DÙNG CHO HÀNH ĐỘNG lặp lại mang tính thói quen, KHÔNG dùng cho động từ trạng thái (be, live, have).\n  Ví dụ sai: I would have long hair. -> Đúng: I used to have long hair.",
      "tag": "Phân Biệt Cực Hay"
    },
    {
      "id": 11,
      "front": "[Câu điều kiện] Công thức và bản chất Câu điều kiện Loại 0 (Zero Conditional)?",
      "back": "• Diễn tả SỰ THẬT HIỂN NHIÊN, chân lý khoa học, quy luật tự nhiên.\n• Công thức: If + S + V(hiện tại đơn), S + V(hiện tại đơn).\nVí dụ: If you heat water to 100 degrees Celsius, it boils.",
      "tag": "Câu Điều Kiện"
    },
    {
      "id": 12,
      "front": "[Câu điều kiện] Công thức và bản chất Câu điều kiện Loại 1 (First Conditional)?",
      "back": "• Điều kiện CÓ THẬT hoặc RẤT CÓ THỂ XẢY RA ở hiện tại hoặc tương lai.\n• Công thức: If + S + V(hiện tại đơn), S + will / can / may + V-bare.\nVí dụ: If you review these 80 flashcards daily, you will score high on the grammar exam.",
      "tag": "Câu Điều Kiện"
    },
    {
      "id": 13,
      "front": "[Câu điều kiện] Công thức và bản chất Câu điều kiện Loại 2 (Second Conditional)?",
      "back": "• Giả định TRÁI VỚI THỰC TẾ Ở HIỆN TẠI (ước muốn không có thật ở hiện tại).\n• Công thức: If + S + V2/ed (To-be dùng WERE cho MỌI ngôi), S + would / could + V-bare.\nVí dụ: If I were you, I would take that overseas scholarship.",
      "tag": "Câu Điều Kiện"
    },
    {
      "id": 14,
      "front": "[Câu điều kiện] Công thức và bản chất Câu điều kiện Loại 3 (Third Conditional)?",
      "back": "• Giả định TRÁI VỚI THỰC TẾ TRONG QUÁ KHỨ (sự việc đã xong và thể hiện hối tiếc).\n• Công thức: If + S + had + V3/ed, S + would / could / might + have + V3/ed.\nVí dụ: If she had caught the early train, she would not have missed the job interview.",
      "tag": "Câu Điều Kiện"
    },
    {
      "id": 15,
      "front": "[Điều kiện hỗn hợp] Công thức Câu điều kiện Mixed 3 - 2 (Quá khứ ảnh hưởng Hiện tại)?",
      "back": "• Giả định trái với QUÁ KHỨ (mệnh đề If loại 3) nhưng kết quả ảnh hưởng ở HIỆN TẠI (mệnh đề chính loại 2).\n📌 Dấu hiệu nhận biết: Vế sau có NOW, TODAY, AT PRESENT.\n• Công thức: If + S + had + V3/ed, S + would + V-bare (now).\nVí dụ: If I had studied medicine back then, I would be a doctor now.",
      "tag": "Điều Kiện Nâng Cao"
    },
    {
      "id": 16,
      "front": "[Điều kiện hỗn hợp] Công thức Câu điều kiện Mixed 2 - 3 (Bản chất hiện tại ảnh hưởng Quá khứ)?",
      "back": "• Bản chất/tính cách cố định ở HIỆN TẠI (If loại 2) dẫn đến kết quả trong QUÁ KHỨ (mệnh đề chính loại 3).\n• Công thức: If + S + V2/ed, S + would have + V3/ed.\nVí dụ: If I weren't so afraid of heights, I would have joined the skydiving trip yesterday.",
      "tag": "Điều Kiện Nâng Cao"
    },
    {
      "id": 17,
      "front": "[Đảo ngữ điều kiện] Quy tắc đảo ngữ câu điều kiện loại 1, 2, 3?",
      "back": "• Loại 1: Should + S + V-bare, S + will + V-bare.\n  Ví dụ: Should you need any assistance, please contact customer support.\n• Loại 2: Were + S + to-V (hoặc Were + S + adj/noun), S + would + V-bare.\n  Ví dụ: Were he to study harder, he would pass the test.\n• Loại 3: Had + S + V3/ed, S + would have + V3/ed.\n  Ví dụ: Had we known the risks, we would have been more careful.",
      "tag": "Đảo Ngữ Tuyệt Kỹ"
    },
    {
      "id": 18,
      "front": "[Liên từ điều kiện] Phân biệt Unless vs If not?",
      "back": "• Unless = If... not (Trừ khi, nếu không thì).\n⚠️ Tuyệt đối KHÔNG dùng dạng phủ định sau Unless (tránh phủ định kép)!\nVí dụ sai: Unless you don't hurry, you will be late.\n-> Đúng: Unless you hurry, you will be late (= If you do not hurry, you will be late).",
      "tag": "Bẫy Đề Thi"
    },
    {
      "id": 19,
      "front": "[Từ đồng nghĩa với If] Provided that / As long as mang nghĩa gì?",
      "back": "• Provided that / Providing that / As long as / So long as = Miễn là, với điều kiện là.\nVí dụ: You can borrow my laptop as long as you return it by 5 PM.",
      "tag": "Từ Nối Điều Kiện"
    },
    {
      "id": 20,
      "front": "[Phân biệt cẩn trọng] In case vs If khác nhau thế nào?",
      "back": "• In case + clause: Để phòng khi, chuẩn bị trước phương án đề phòng (hành động làm TRƯỚC dù sự việc có xảy ra hay không).\n  Ví dụ: Take an umbrella in case it rains (Cầm dù theo phòng khi trời mưa - dù trời chưa mưa).\n• If + clause: Chỉ hành động khi sự việc THỰC SỰ XẢY RA.\n  Ví dụ: Open the umbrella if it rains (Chừng nào trời mưa thì hãy mở ô).",
      "tag": "Phân Biệt Cực Hay"
    },
    {
      "id": 21,
      "front": "[Bị động đặc biệt] Bị động với động từ tường thuật (People say/think/believe that...)?",
      "back": "Câu gốc: People say that he works 16 hours a day.\n• Cách 1 (Chủ ngữ giả It): It is said that he works 16 hours a day.\n• Cách 2 (Đưa chủ ngữ thật lên đầu):\n  - Cùng thì: He is said TO WORK 16 hours a day.\n  - Khác thì (hành động sau xảy ra trước): He is said TO HAVE WORKED 16 hours yesterday.",
      "tag": "Bị Động Nâng Cao"
    },
    {
      "id": 22,
      "front": "[Thể sai khiến] Phân biệt Have và Get khi nhờ/thuê ai làm gì?",
      "back": "• Thể chủ động:\n  - Have + Người + V-bare: S + have sb DO sth (nhờ, yêu cầu ai làm).\n  - Get + Người + TO-V: S + get sb TO DO sth (thuyết phục ai làm).\n• Thể bị động (cho cả have & get):\n  - S + have / get + Vật + V3/ed (nhờ ai làm giúp việc gì).\n  Ví dụ: I had my laptop repaired yesterday (Hôm qua tôi đi sửa laptop).",
      "tag": "Cấu Trúc Nhờ Vả"
    },
    {
      "id": 23,
      "front": "[Bị động] Bị động với Modal Verbs (Can, Must, Should, May)?",
      "back": "• Hiện tại/Tương lai: Modal + BE + V3/ed.\n  Ví dụ: All applications must be submitted before Friday.\n• Quá khứ: Modal + HAVE BEEN + V3/ed.\n  Ví dụ: The package should have been delivered yesterday.",
      "tag": "Câu Bị Động"
    },
    {
      "id": 24,
      "front": "[Bị động] Dạng bị động của Gerund (V-ing) và Infinitive (To-V)?",
      "back": "• Bị động của To-V: TO BE + V3/ed.\n  Ví dụ: She hopes to be promoted next month.\n• Bị động của V-ing: BEING + V3/ed.\n  Ví dụ: Nobody enjoys being criticized in public.",
      "tag": "Bị Động Nâng Cao"
    },
    {
      "id": 25,
      "front": "[Bị động đặc biệt] Bị động với động từ tri giác (see, hear, notice, watch)?",
      "back": "Khi chuyển sang bị động, V-bare chuyển thành TO-V:\n• Chủ động: I saw him enter the bank.\n-> Bị động: He was seen TO ENTER the bank.\n💡 Nếu hành động đang diễn ra (V-ing) thì giữ nguyên V-ing:\n• Chủ động: I heard her singing.\n-> Bị động: She was heard singing.",
      "tag": "Bẫy Đề Thi Bị Động"
    },
    {
      "id": 26,
      "front": "[Bị động với Need] Cấu trúc Need + V-ing mang nghĩa gì?",
      "back": "Need + V-ing = Need + to be V3/ed (Vật gì đó CẦN ĐƯỢC LÀM - mang nghĩa bị động!)\nVí dụ:\n• The car needs washing. = The car needs to be washed.\n• Your shirt needs ironing. = Your shirt needs to be ironed.",
      "tag": "Cấu Trúc Đặc Biệt"
    },
    {
      "id": 27,
      "front": "[Bị động có giới từ] Vị trí của giới từ trong câu bị động đi liền động từ?",
      "back": "Giới từ của phrasal verb PHẢI ĐƯỢC GIỮ NGUYÊN ngay sau động từ V3/ed!\nVí dụ:\n• Chủ động: They laughed at the poor boy.\n-> Bị động: The poor boy was laughed AT (không được bỏ 'at'!).\n• We must look after the children. -> The children must be looked after.",
      "tag": "Câu Bị Động"
    },
    {
      "id": 28,
      "front": "[Bị động với Make và Let] Chuyển thế nào?",
      "back": "• Make: S + make sb + V-bare -> Bị động: Sb + be made + TO-V.\n  Ví dụ: They made him sign the contract. -> He was made TO SIGN the contract.\n• Let: Không dùng bị động 'be let to-V', mà chuyển thành BE ALLOWED TO-V:\n  Ví dụ: My boss let me leave early. -> I was allowed to leave early.",
      "tag": "Bẫy Bị Động"
    },
    {
      "id": 29,
      "front": "[Cấu trúc câu hỏi bị động] Chuyển câu hỏi sang bị động như thế nào?",
      "back": "📌 Quy tắc: Đưa trợ động từ / to-be lên đầu câu, tân ngữ làm chủ ngữ, sau đó là V3/ed.\nVí dụ:\n• Did Thomas Edison invent the electric light bulb?\n-> WAS the electric light bulb INVENTED by Thomas Edison?\n• Who wrote this book? -> By whom was this book written?",
      "tag": "Câu Bị Động"
    },
    {
      "id": 30,
      "front": "[Bị động 2 tân ngữ] Động từ có cả Direct Object và Indirect Object (give, send, lend)?",
      "back": "Có 2 cách chuyển:\n1. Đưa người lên làm chủ ngữ (phổ biến hơn): Sb + be given / sent sth.\n   Ví dụ: I was given a bonus.\n2. Đưa vật lên làm chủ ngữ (phải thêm TO hoặc FOR trước người):\n   Ví dụ: A bonus was given TO me by the manager.",
      "tag": "Câu Bị Động"
    },
    {
      "id": 31,
      "front": "[MĐQH] Phân biệt Mệnh đề xác định (Defining) vs Không xác định (Non-defining)?",
      "back": "• Mệnh đề xác định: Cung cấp thông tin THIẾT YẾU để nhận biết danh từ (bỏ đi thì câu mất nghĩa); KHÔNG DÙNG DẤU PHẨY.\n• Mệnh đề không xác định: Cung cấp thông tin BỔ SUNG về danh từ đã rõ (tên riêng, có this/that/my); CÓ DẤU PHẨY NGĂN CÁCH; KHÔNG BAO GIỜ DÙNG 'THAT'!\nVí dụ: Mr. Minh, who teaches physics, won the national award.",
      "tag": "Mệnh Đề Quan Hệ"
    },
    {
      "id": 32,
      "front": "[MĐQH] Khi nào BẮT BUỘC dùng \"THAT\" thay vì \"WHICH\" hoặc \"WHO\"?",
      "back": "Bắt buộc dùng THAT sau:\n1. Đại từ bất định: everything, nothing, anything, something, all, none, little, much.\n2. So sánh nhất: the best, the most interesting...\n3. Số thứ tự: the first, the second, the only...\n4. Danh từ chỉ cả người lẫn vật: The tourists and their dogs THAT walked along the beach.\n⚠️ Chú ý: THAT KHÔNG đứng sau dấu phẩy và KHÔNG đứng sau giới từ!",
      "tag": "Quy Tắc Vàng MĐQH"
    },
    {
      "id": 33,
      "front": "[MĐQH] Phân biệt Whose vs Whom?",
      "back": "• WHOSE: Chỉ sở hữu (thay cho his/her/their/its), theo sau ALWAYS là một DANH TỪ không có mạo từ (Whose + Noun).\n  Ví dụ: The student whose essay won first prize got a scholarship.\n• WHOM: Làm TÂN NGỮ chỉ người (sau whom là S + V), đứng được sau giới từ.\n  Ví dụ: The candidate whom we interviewed yesterday was very articulate.",
      "tag": "Mệnh Đề Quan Hệ"
    },
    {
      "id": 34,
      "front": "[MĐQH] Vị trí của giới từ trong mệnh đề quan hệ?",
      "back": "• Trang trọng: Đặt giới từ LÊN TRƯỚC Whom hoặc Which (To whom, In which, For which).\n  Ví dụ: The company for which I work is expanding globally.\n• Thân mật: Đặt giới từ ở CUỐI mệnh đề.\n  Ví dụ: The company which I work for is expanding globally.\n⚠️ Không bao giờ đặt giới từ trước THAT hoặc WHO!",
      "tag": "Mệnh Đề Quan Hệ"
    },
    {
      "id": 35,
      "front": "[Rút gọn MĐQH] Cách rút gọn mệnh đề quan hệ dạng CHỦ ĐỘNG?",
      "back": "Bỏ đại từ quan hệ và trợ động từ (to-be), đưa động từ chính về dạng V-ING.\nVí dụ câu gốc: The man who lives next door is a doctor.\n-> Rút gọn: The man LIVING next door is a doctor.",
      "tag": "Rút Gọn MĐQH"
    },
    {
      "id": 36,
      "front": "[Rút gọn MĐQH] Cách rút gọn mệnh đề quan hệ dạng BỊ ĐỘNG?",
      "back": "Bỏ đại từ quan hệ và to-be, giữ lại ĐỘNG TỪ PHÂN TỪ HAI (V3/ed).\nVí dụ câu gốc: The bridge which was built in 1990 has been renovated.\n-> Rút gọn: The bridge BUILT in 1990 has been renovated.",
      "tag": "Rút Gọn MĐQH"
    },
    {
      "id": 37,
      "front": "[Rút gọn MĐQH] Khi nào rút gọn bằng \"TO-V\"?",
      "back": "Rút gọn bằng TO-V khi danh từ đứng trước có các từ bổ nghĩa:\n• Số thứ tự: the first, the second, the last...\n• So sánh nhất: the best, the most...\n• Từ độc nhất: the only, next...\nVí dụ: Yuri Gagarin was the first human who traveled into outer space.\n-> Rút gọn: Yuri Gagarin was the first human TO TRAVEL into outer space.",
      "tag": "Rút Gọn MĐQH"
    },
    {
      "id": 38,
      "front": "[Phân từ hoàn thành - Perfect Participle] Dùng \"Having + V3/ed\" khi nào?",
      "back": "Dùng để rút gọn 2 mệnh đề có CÙNG CHỦ NGỮ khi hành động thứ nhất ĐÃ HOÀN TẤT XONG TRƯỚC khi hành động thứ hai bắt đầu.\nVí dụ câu gốc: After she had finished her report, she submitted it to the manager.\n-> Rút gọn: HAVING FINISHED her report, she submitted it to the manager.",
      "tag": "Phân Từ Hoàn Thành"
    },
    {
      "id": 39,
      "front": "[Rút gọn đồng vị ngữ] Cụm danh từ đồng vị (Appositive Phrases) là gì?",
      "back": "Là cách rút gọn mệnh đề quan hệ định nghĩa bằng một cụm danh từ đặt giữa hai dấu phẩy.\nVí dụ câu gốc: Barack Obama, who was the 44th US President, visited Hanoi in 2016.\n-> Rút gọn: Barack Obama, THE 44TH US PRESIDENT, visited Hanoi in 2016.",
      "tag": "Văn Phong Nâng Cao"
    },
    {
      "id": 40,
      "front": "[Lỗi kinh điển] Lỗi phân từ treo (Dangling Participle) là gì và cách sửa?",
      "back": "Lỗi phân từ treo xảy ra khi chủ ngữ của cụm phân từ đầu câu KHÔNG TRÙNG với chủ ngữ chính của mệnh đề sau.\n⚠️ Câu sai: Walking down the street, the trees were beautiful (Cây cối không thể đi bộ!).\n-> Câu đúng: Walking down the street, I ADMIRED the beautiful trees (Tôi mới là người đi bộ).",
      "tag": "Bẫy Ngữ Pháp Đỉnh Cao"
    },
    {
      "id": 41,
      "front": "[Đảo ngữ] Quy tắc đảo ngữ khi trạng từ phủ định/bán phủ định đứng đầu câu?",
      "back": "Khi câu bắt đầu bằng: Never, Seldom, Rarely, Scarcely, Hardly, Little:\n📌 Công thức: Trạng từ phủ định + TRỢ ĐỘNG TỪ / TO-BE + S + V.\nVí dụ: Seldom have I seen such an articulate speaker (Hiếm khi nào tôi thấy một diễn giả hoạt ngôn đến vậy).",
      "tag": "Đảo Ngữ Kinh Điển"
    },
    {
      "id": 42,
      "front": "[Đảo ngữ \"Vừa mới... thì...\"] Cấu trúc No sooner... than vs Hardly... when?",
      "back": "📌 Hai cấu trúc vàng cực kỳ hay bẫy trong đề thi THPT & TOEIC:\n1. No sooner + HAD + S + V3/ed + THAN + S + V2/ed.\n2. Hardly / Scarcely + HAD + S + V3/ed + WHEN + S + V2/ed.\nVí dụ: No sooner had I stepped outside than it began to pour with rain.",
      "tag": "Đảo Ngữ Kinh Điển"
    },
    {
      "id": 43,
      "front": "[Đảo ngữ Not only... but also] Đảo ngữ ở vế nào?",
      "back": "CHỈ ĐẢO NGỮ Ở VẾ ĐẦU TIÊN (Not only), vế thứ hai giữ nguyên trật tự!\n📌 Công thức: Not only + Trợ động từ + S + V, but S + also + V.\nVí dụ: Not only DOES she speak English fluently, but she also codes in Python.",
      "tag": "Đảo Ngữ"
    },
    {
      "id": 44,
      "front": "[Bẫy đảo ngữ Only] Khi Only when / Only after / Only if đứng đầu câu thì đảo ngữ ở đâu?",
      "back": "⚠️ BẪY LỚN: Đảo ngữ ở MỆNH ĐỀ CHÍNH (mệnh đề phía sau), KHÔNG đảo ngữ ở vế ngay sau Only!\n📌 Công thức: Only after + S + V, + TRỢ ĐỘNG TỪ + S + V.\nVí dụ SAI: Only after did he finish his work, he went home.\n-> ĐÚNG: Only after he finished his work DID HE GO home.",
      "tag": "Bẫy Đảo Ngữ"
    },
    {
      "id": 45,
      "front": "[Đảo ngữ tuyệt đối] Cụm \"Under no circumstances\" đứng đầu câu nghĩa là gì?",
      "back": "Nghĩa: Dù trong bất kỳ hoàn cảnh nào cũng tuyệt đối không được...\n📌 Công thức: Under no circumstances + Trợ động từ + S + V.\nVí dụ: Under no circumstances SHOULD employees share customer data externally.",
      "tag": "Đảo Ngữ Trang Trọng"
    },
    {
      "id": 46,
      "front": "[Đảo ngữ với So và Such] Cấu trúc \"Quá... đến nỗi mà\" khi đảo ngữ?",
      "back": "• Với So: SO + Adj / Adv + TO-BE / TRỢ ĐỘNG TỪ + S + THAT + S + V.\n  Ví dụ: So difficult was the exam that few students scored above 8.\n• Với Such: SUCH + BE + (a/an) + Noun + THAT + S + V.\n  Ví dụ: Such was the power of the storm that roofs were torn off.",
      "tag": "Đảo Ngữ So & Such"
    },
    {
      "id": 47,
      "front": "[Đảo ngữ nơi chốn] Khi cụm giới từ chỉ địa điểm/phương hướng đứng đầu câu?",
      "back": "Đảo TOÀN BỘ ĐỘNG TỪ CHÍNH lên trước chủ ngữ (KHÔNG mượn trợ động từ do/does/did)!\n📌 Công thức: Cụm giới từ nơi chốn + V + S.\nVí dụ: At the top of the hill STOOD an ancient castle.\nOut rushed the cat!",
      "tag": "Đảo Ngữ Không Gian"
    },
    {
      "id": 48,
      "front": "[Câu chẻ - Cleft Sentences] Nhấn mạnh chủ ngữ, tân ngữ hoặc trạng ngữ bằng cấu trúc nào?",
      "back": "📌 Cấu trúc: It is / was + THÀNH PHẦN CẦN NHẤN MẠNH + that / who + ...\nVí dụ gốc: Linh bought this laptop in Singapore yesterday.\n• Nhấn mạnh chủ ngữ: It was Linh WHO bought this laptop...\n• Nhấn mạnh tân ngữ: It was this laptop THAT Linh bought...\n• Nhấn mạnh thời gian: It was yesterday THAT Linh bought...",
      "tag": "Câu Chẻ Nhấn Mạnh"
    },
    {
      "id": 49,
      "front": "[Câu chẻ giả - Pseudo-cleft] Cấu trúc bắt đầu bằng \"What\" nhấn mạnh điều gì?",
      "back": "📌 Công thức: WHAT + S + V + IS / WAS + Thành phần nhấn mạnh.\nVí dụ: What I need right now is a 15-minute power nap (Thứ tôi cần ngay lúc này là một giấc ngủ chợp mắt 15 phút).",
      "tag": "Cấu Trúc Nhấn Mạnh"
    },
    {
      "id": 50,
      "front": "[Trợ động từ nhấn mạnh] Dùng Do/Does/Did trong câu khẳng định mang ý nghĩa gì?",
      "back": "Đặt Do/Does/Did trước động từ nguyên thể để NHẤN MẠNH tính xác thực của hành động (Thực sự là có làm việc đó!).\nVí dụ:\n• I DO love you (Tôi thực sự yêu em mà!).\n• She DID finish the report before the deadline (Cô ấy thực sự đã hoàn thành báo cáo trước hạn rồi mà).",
      "tag": "Ngữ Pháp Nhấn Mạnh"
    },
    {
      "id": 51,
      "front": "[Giả định thức - Subjunctive] Động từ mệnh lệnh (suggest, recommend, demand, insist that...)?",
      "back": "Động từ ở mệnh đề sau ALWAYS ở dạng NGUYÊN THỂ KHÔNG TO (bare infinitive) cho MỌI NGÔI, không chia thì và không chia số ít!\n📌 Công thức: S1 + suggest/demand/recommend + that + S2 + (should) + V-bare.\nVí dụ: The doctor recommended that he STOP smoking (Dùng \"stop\", KHÔNG thêm \"s\"!).",
      "tag": "Giả Định Thức"
    },
    {
      "id": 52,
      "front": "[Giả định thức] Tính từ chỉ tính cấp thiết (essential, vital, imperative, crucial that...)?",
      "back": "📌 Công thức: It is vital / essential / imperative that + S + (should) + V-bare.\n⚠️ To-be luôn dùng chữ \"BE\", không dùng is/am/are/was/were!\nVí dụ: It is imperative that all flight attendants BE present at the briefing.",
      "tag": "Giả Định Thức"
    },
    {
      "id": 53,
      "front": "[Cấu trúc Would rather] Phân biệt muốn bản thân làm gì vs muốn người khác làm gì?",
      "back": "• Muốn bản thân làm gì ở hiện tại: S + would rather + V-bare (than V-bare).\n  Ví dụ: I would rather stay at home tonight.\n• Muốn NGƯỜI KHÁC làm gì (giả định trái hiện tại): S1 + would rather + S2 + V2/ED (lùi 1 thì!).\n  Ví dụ: I would rather you DID NOT smoke in here.",
      "tag": "Cấu Trúc Would Rather"
    },
    {
      "id": 54,
      "front": "[Cấu trúc It's high time] Động từ phía sau chia thì gì?",
      "back": "📌 Công thức: It is high time / about time + S + V2/ED (Đã đến lúc ai đó PHẢI làm việc gì - mang tính thúc giục khẩn cấp!).\nVí dụ: It is high time you started preparing for the final exam!\n💡 Nếu không có chủ ngữ: It is time (for sb) TO V.",
      "tag": "Cấu Trúc Đặc Biệt"
    },
    {
      "id": 55,
      "front": "[Câu điều ước - Wish] Quy tắc lùi thì của động từ Wish?",
      "back": "• Ước ở TƯƠNG LAI: S + wish + S + WOULD / COULD + V-bare.\n  Ví dụ: I wish it would stop raining.\n• Ước trái với HIỆN TẠI: S + wish + S + V2/ED (were cho mọi ngôi).\n  Ví dụ: I wish I had more free time.\n• Ước trái với QUÁ KHỨ (hối tiếc): S + wish + S + HAD + V3/ED.\n  Ví dụ: I wish I had listened to your advice.",
      "tag": "Câu Điều Ước"
    },
    {
      "id": 56,
      "front": "[Cấu trúc As if / As though] Diễn tả giả định \"Cứ như thể là\"?",
      "back": "• Sự việc CÓ THẬT hoặc CÓ KHẢ NĂNG THẬT: Chia thì bình thường.\n  Ví dụ: It looks as if it is going to rain.\n• Sự việc TRÁI THỰC TẾ (giả định): Lùi thì giống câu điều ước!\n  Ví dụ: He talks as if he WERE a millionaire (nhưng thực tế anh ta không phải triệu phú).",
      "tag": "Cấu Trúc As If"
    },
    {
      "id": 57,
      "front": "[Cấu trúc cổ điển] \"Lest\" trong tiếng Anh nghĩa là gì và đi với động từ dạng nào?",
      "back": "• Lest = E rằng, vì sợ rằng, để không bị (in order that not).\n📌 Động từ theo sau luôn dùng Subjunctive: (should) + V-bare.\nVí dụ: We decided to double-check the figures lest there BE any errors.",
      "tag": "Ngữ Pháp Học Thuật"
    },
    {
      "id": 58,
      "front": "[Thành ngữ giả định] \"Be that as it may\" và \"Come what may\" nghĩa là gì?",
      "back": "• \"Be that as it may\" = Dù có như thế đi chăng nữa, dẫu vậy (nevertheless).\n  Ví dụ: The cost is high; be that as it may, we must proceed.\n• \"Come what may\" = Dù có chuyện gì xảy ra đi nữa (whatever happens).\n  Ví dụ: I will support you, come what may.",
      "tag": "Thành Ngữ Giả Định"
    },
    {
      "id": 59,
      "front": "[Cấu trúc Had better] Nghĩa gì và dạng phủ định là gì?",
      "back": "• Had better + V-bare: Tốt hơn hết là nên làm gì (khuyên răn mang tính cảnh báo nguy cơ).\n⚠️ Phủ định: HAD BETTER NOT + V-bare (KHÔNG dùng hadn't better!).\nVí dụ: You had better not be late for the interview.",
      "tag": "Cấu Trúc Lời Khuyên"
    },
    {
      "id": 60,
      "front": "[Cấu trúc No wonder] Mang nghĩa gì và dùng thế nào?",
      "back": "• No wonder (that) + clause = Thảo nào, chả trách mà, không ngạc nhiên khi...\nVí dụ: He studied 12 hours a day for 6 months; no wonder he scored a perfect 990 on TOEIC!",
      "tag": "Giao Tiếp Đời Sống"
    },
    {
      "id": 61,
      "front": "[Liên từ nhượng bộ] Phân biệt Although / Even though vs Despite / In spite of?",
      "back": "• Although / Even though / Though + MỆNH ĐỀ (S + V).\n  Ví dụ: Although the traffic was terrible, he arrived on time.\n• Despite / In spite of + DANH TỪ / CỤM DANH TỪ / V-ING.\n  Ví dụ: Despite the terrible traffic, he arrived on time.\n💡 Muốn dùng mệnh đề sau Despite: Despite the fact that + S + V.",
      "tag": "Liên Từ Nhượng Bộ"
    },
    {
      "id": 62,
      "front": "[Liên từ chỉ nguyên nhân] Phân biệt Because vs Because of / Due to?",
      "back": "• Because / Since / As + MỆNH ĐỀ (S + V).\n  Ví dụ: We stayed home because it was storming outside.\n• Because of / Due to / Owing to + DANH TỪ / CỤM DANH TỪ / V-ING.\n  Ví dụ: We stayed home due to the severe storm.",
      "tag": "Liên Từ Nguyên Nhân"
    },
    {
      "id": 63,
      "front": "[Mục đích] Phân biệt So that / In order that vs In order to / So as to?",
      "back": "• So that / In order that + MỆNH ĐỀ (thường chứa can/could/will/would).\n  Ví dụ: She woke up early so that she could catch the first bus.\n• In order to / So as to + V-BARE.\n  Ví dụ: She woke up early in order to catch the first bus.\n⚠️ Phủ định: In order NOT to / So as NOT to + V-bare.",
      "tag": "Liên Từ Mục Đích"
    },
    {
      "id": 64,
      "front": "[Giới từ thời gian] Quy tắc tam giác ngược với IN - ON - AT?",
      "back": "• AT (Điểm thời gian chính xác): at 6:30 AM, at noon, at midnight, at the weekend.\n• ON (Ngày và Thứ): on Monday, on May 19th, on my birthday, on Christmas Day.\n• IN (Khoảng thời gian rộng): in the morning, in 2026, in summer, in the 21st century.",
      "tag": "Quy Tắc Giới Từ"
    },
    {
      "id": 65,
      "front": "[Giới từ nơi chốn] Phân biệt IN - ON - AT cho địa điểm?",
      "back": "• AT (Vị trí cụ thể, mốc tọa độ): at the bus stop, at the door, at home, at work.\n• ON (Bề mặt tiếp xúc, tầng nhà, phương tiện công cộng lớn): on the table, on the 3rd floor, on the bus, on the plane.\n• IN (Không gian khép kín 3D, phòng ốc, thành phố, quốc gia): in the room, in Hanoi, in Vietnam, in the car (xe con).",
      "tag": "Quy Tắc Giới Từ"
    },
    {
      "id": 66,
      "front": "[Giới từ] Phân biệt Between vs Among?",
      "back": "• BETWEEN: Dùng khi ở giữa HAI đối tượng HOẶC giữa nhiều đối tượng cụ thể được nêu tên riêng rẽ từng cái một.\n  Ví dụ: The treaty was signed between Vietnam, Japan, and Korea.\n• AMONG: Dùng khi ở giữa MỘT TẬP THỂ / ĐÁM ĐÔNG (từ 3 đối tượng trở lên không nêu tên cụ thể).\n  Ví dụ: He felt completely at home among his university friends.",
      "tag": "Phân Biệt Giới Từ"
    },
    {
      "id": 67,
      "front": "[Bẫy chính tả và ngữ nghĩa] Phân biệt Beside vs Besides?",
      "back": "• BESIDE (giới từ): Bên cạnh về vị trí địa lý (= next to, at the side of).\n  Ví dụ: Come and sit beside me.\n• BESIDES (giới từ / phó từ): Ngoài ra, thêm vào đó (= in addition to, moreover).\n  Ví dụ: Besides English, he speaks fluent Japanese.",
      "tag": "Bẫy Đề Thi Cực Dễ Sai"
    },
    {
      "id": 68,
      "front": "[Giới từ thời hạn] Phân biệt By vs Until?",
      "back": "• BY: Hành động phải hoàn tất TẠI HOẶC TRƯỚC một mốc thời hạn (deadline).\n  Ví dụ: Please submit your final project BY 5:00 PM tomorrow.\n• UNTIL / TILL: Hành động DIỄN RA LIÊN TỤC KÉO DÀI CHO ĐẾN KHI chạm mốc thời gian đó.\n  Ví dụ: I will stay in the library UNTIL it closes at 9 PM.",
      "tag": "Phân Biệt Cực Hay"
    },
    {
      "id": 69,
      "front": "[Mạo từ Zero Article] Khi nào TUYỆT ĐỐI KHÔNG dùng mạo từ (a/an/the)?",
      "back": "Không dùng mạo từ trước:\n1. Danh từ số nhiều / không đếm được nói chung: Love is powerful (Tình yêu nói chung); Dogs are loyal.\n2. Tên các bữa ăn: have breakfast, before lunch, for dinner.\n3. Tên môn thể thao, trò chơi: play soccer, play chess, play basketball.\n4. Tên quốc gia số ít: Vietnam, Japan, France (ngoại trừ quốc gia liên bang/quần đảo: the USA, the UK, the Netherlands).",
      "tag": "Quy Tắc Mạo Từ"
    },
    {
      "id": 70,
      "front": "[Mạo từ THE] Tên địa lý nào BẮT BUỘC có mạo từ \"THE\"?",
      "back": "Bắt buộc có THE trước:\n• Tên đại dương, biển, sông ngòi: the Pacific Ocean, the Mekong River, the Red Sea.\n• Dãy núi số nhiều: the Himalayas, the Alps (nhưng đỉnh núi đơn lẻ thì KHÔNG: Mount Everest).\n• Quần đảo: the Philippines, the Maldives.\n• Sa mạc: the Sahara Desert.",
      "tag": "Quy Tắc Mạo Từ"
    },
    {
      "id": 71,
      "front": "[Gerund vs Infinitive] Phân biệt Remember / Forget / Regret đi với To-V vs V-ing?",
      "back": "• Remember / Forget / Regret + TO-V: Việc PHẢI LÀM trong tương lai hoặc lấy làm tiếc khi phải báo tin buồn.\n  Ví dụ: Remember TO LOCK the door before leaving.\n  We regret TO INFORM you that the flight is delayed.\n• Remember / Forget / Regret + V-ING: Việc ĐÃ LÀM trong quá khứ hoặc hối hận vì đã làm gì.\n  Ví dụ: I remember LOCKING the door (tôi nhớ rõ là đã khóa cửa rồi).\n  I regret TELLING him the truth.",
      "tag": "Gerund vs Infinitive"
    },
    {
      "id": 72,
      "front": "[Gerund vs Infinitive] Phân biệt Stop đi với To-V vs V-ing?",
      "back": "• Stop + V-ING: Dừng hẳn hành động đang làm lại (bỏ cuộc, ngưng thói quen).\n  Ví dụ: He stopped smoking 5 years ago (Anh ấy đã bỏ thuốc lá 5 năm trước).\n• Stop + TO-V: Tạm dừng việc đang làm ĐỂ LÀM một việc khác.\n  Ví dụ: On the highway, we stopped TO BUY some hot coffee.",
      "tag": "Gerund vs Infinitive"
    },
    {
      "id": 73,
      "front": "[Gerund vs Infinitive] Phân biệt Try đi với To-V vs V-ing?",
      "back": "• Try + TO-V: Cố gắng, nỗ lực hết sức để làm việc gì khó khăn.\n  Ví dụ: She tried TO LIFT the heavy sofa, but couldn't.\n• Try + V-ING: Thử nghiệm một phương pháp, giải pháp mới xem có hiệu quả không.\n  Ví dụ: If your laptop is frozen, try RESTARTING it.",
      "tag": "Gerund vs Infinitive"
    },
    {
      "id": 74,
      "front": "[Modal Verbs quá khứ] Phân biệt Must have V3/ed vs Should have V3/ed?",
      "back": "• Must have + V3/ed: Chắc chắn là ĐÃ xảy ra (suy đoán chắc chắn dựa trên bằng chứng ở quá khứ).\n  Ví dụ: The streets are soaking wet; it MUST HAVE RAINED heavily last night.\n• Should have + V3/ed: Lẽ ra NÊN làm gì trong quá khứ (nhưng thực tế ĐÃ KHÔNG LÀM, thể hiện hối tiếc hoặc trách móc).\n  Ví dụ: You SHOULD HAVE TOLD me earlier!",
      "tag": "Modal Verbs Quá Khứ"
    },
    {
      "id": 75,
      "front": "[Modal Verbs quá khứ] Phân biệt Could have V3/ed vs Can't have V3/ed?",
      "back": "• Could have + V3/ed: Lẽ ra CÓ THỂ làm được trong quá khứ nhưng đã không làm.\n  Ví dụ: I could have passed the test if I had studied harder.\n• Can't have + V3/ed: Chắc chắn KHÔNG THỂ NÀO đã xảy ra việc đó trong quá khứ.\n  Ví dụ: He can't have stolen the laptop; he was on vacation in Tokyo with us.",
      "tag": "Modal Verbs Quá Khứ"
    },
    {
      "id": 76,
      "front": "[Modal Verbs phân biệt] Needn't have V3/ed vs Didn't need to V?",
      "back": "• Needn't have + V3/ed: Lẽ ra KHÔNG CẦN làm nhưng thực tế ĐÃ LÀM rồi (lãng phí công sức).\n  Ví dụ: You needn't have cooked so much food; only 3 guests showed up.\n• Didn't need to + V: Không cần làm và thực tế ĐÃ KHÔNG LÀM.\n  Ví dụ: Yesterday was a national holiday, so I didn't need to set my alarm clock.",
      "tag": "Phân Biệt Cực Hay"
    },
    {
      "id": 77,
      "front": "[Cấu trúc quen thuộc] Phân biệt Used to V vs Be/Get used to V-ing?",
      "back": "• Used to + V-bare: Đã từng có thói quen trong quá khứ (nay không còn nữa).\n  Ví dụ: I used to wake up late on weekends.\n• Be / Get used to + V-ING / Noun: Đã quen hoặc đang làm quen dần với điều gì ở hiện tại.\n  Ví dụ: Living in London, she is used to carrying an umbrella everywhere.",
      "tag": "Thói Quen"
    },
    {
      "id": 78,
      "front": "[Hòa hợp S-V] Danh từ nối bằng \"Neither... nor...\" hoặc \"Either... or...\"?",
      "back": "Động từ chia THEO CHỦ NGỮ GẦN NÓ NHẤT (S2)!\n📌 Công thức: Neither S1 nor S2 + V(chia theo S2).\nVí dụ:\n• Neither the professor nor the STUDENTS WERE present in the lecture hall.\n• Neither the students nor the PROFESSOR WAS present in the lecture hall.",
      "tag": "Hòa Hợp Chủ Vị"
    },
    {
      "id": 79,
      "front": "[Bẫy hòa hợp S-V] Chủ ngữ nối bằng \"As well as / Together with / Along with\"?",
      "back": "⚠️ BẪY LỚN: Động từ chia THEO CHỦ NGỮ ĐẦU TIÊN (S1), KHÔNG phụ thuộc vào danh từ sau các cụm trên!\n📌 Công thức: S1 + along with / as well as + S2 + V(chia theo S1).\nVí dụ: The CEO, along with his board members, IS ATTENDING the summit (chia 'is' vì S1 là The CEO).",
      "tag": "Bẫy Hòa Hợp S-V"
    },
    {
      "id": 80,
      "front": "[Trật tự tính từ & Tính từ ghép] Quy tắc OSASCOMP và quy tắc số ít trong tính từ ghép có gạch nối?",
      "back": "1. Trật tự tính từ OSASCOMP: Opinion -> Size -> Age -> Shape -> Color -> Origin -> Material -> Purpose.\n   Ví dụ: A lovely (O) small (S) new (A) round (S) brown (C) Italian (O) leather (M) handbag (P).\n2. Tính từ ghép có số đếm và gạch nối: Danh từ LUÔN Ở DẠNG SỐ ÍT (không có 's')!\n   Ví dụ: A ten-year-old child (ĐÚNG - Không viết ten-years-old!); A two-hour movie.",
      "tag": "Trật Tự Tính Từ"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Chọn câu đúng: 'By the time the rescue team arrived, the hikers ______ for 20 hours.'",
      "options": [
        "A. had been missing",
        "B. have been missing",
        "C. were missing",
        "D. are missing"
      ],
      "correct": 0,
      "explanation": "Hành động xảy ra và kéo dài liên tục trước một mốc thời gian quá khứ (arrived) chia Quá khứ hoàn thành tiếp diễn (had been missing)."
    },
    {
      "id": 2,
      "question": "Đảo ngữ câu điều kiện loại 3: 'Had we known the truth, we ______ differently.'",
      "options": [
        "A. would act",
        "B. would have acted",
        "C. will act",
        "D. act"
      ],
      "correct": 1,
      "explanation": "Đảo ngữ điều kiện loại 3 có mệnh đề chính là would have + V3/ed."
    },
    {
      "id": 3,
      "question": "Điền dạng đúng: 'It is imperative that every candidate ______ on time for the exam.'",
      "options": [
        "A. is",
        "B. was",
        "C. be",
        "D. are"
      ],
      "correct": 2,
      "explanation": "Cấu trúc giả định thức: It is imperative that + S + (should) + V-bare. Với to-be bắt buộc dùng 'be'."
    },
    {
      "id": 4,
      "question": "Chọn câu đúng với cấu trúc 'No sooner... than':",
      "options": [
        "A. No sooner had I closed my eyes when the alarm rang.",
        "B. No sooner had I closed my eyes than the alarm rang.",
        "C. No sooner I had closed my eyes than the alarm rang.",
        "D. No sooner did I close my eyes when the alarm rang."
      ],
      "correct": 1,
      "explanation": "No sooner đi với HAD + S + V3/ed và liên từ THAN (No sooner... than)."
    },
    {
      "id": 5,
      "question": "Sự hòa hợp chủ vị: 'The manager, along with his assistants, ______ attending the conference.'",
      "options": [
        "A. is",
        "B. are",
        "C. were",
        "D. have been"
      ],
      "correct": 0,
      "explanation": "Khi chủ ngữ nối bằng 'along with', động từ chia theo chủ ngữ đầu tiên (The manager - số ít: is)."
    },
    {
      "id": 6,
      "question": "Chọn câu có tính từ ghép đúng chuẩn ngữ pháp:",
      "options": [
        "A. He has a five-years-old son.",
        "B. He has a five-year-old son.",
        "C. He has a five years old son.",
        "D. He has a five-years-olds son."
      ],
      "correct": 1,
      "explanation": "Tính từ ghép có dấu gạch nối và số đếm thì danh từ luôn ở dạng số ít: five-year-old."
    },
    {
      "id": 7,
      "question": "Rút gọn mệnh đề quan hệ: 'The girl ______ next to Tom is an exchange student.'",
      "options": [
        "A. sit",
        "B. sitting",
        "C. sat",
        "D. is sitting"
      ],
      "correct": 1,
      "explanation": "Rút gọn mệnh đề quan hệ dạng chủ động (who sits / who is sitting) thành V-ing: sitting."
    },
    {
      "id": 8,
      "question": "Chọn modal verb đúng: 'The ground is soaking wet; it ______ heavily last night.'",
      "options": [
        "A. should have rained",
        "B. must have rained",
        "C. could rain",
        "D. needn't have rained"
      ],
      "correct": 1,
      "explanation": "Must have + V3 diễn tả suy đoán chắc chắn có căn cứ trong quá khứ."
    },
    {
      "id": 9,
      "question": "Điền dạng đúng: 'I clearly remember ______ the front door before leaving.'",
      "options": [
        "A. to lock",
        "B. lock",
        "C. locking",
        "D. locked"
      ],
      "correct": 2,
      "explanation": "Remember + V-ing diễn tả nhớ việc ĐÃ LÀM trong quá khứ."
    },
    {
      "id": 10,
      "question": "Chọn giới từ đúng: 'Our flight to Tokyo departs ______ 6:30 AM ______ Monday morning.'",
      "options": [
        "A. in / on",
        "B. at / on",
        "C. on / in",
        "D. at / in"
      ],
      "correct": 1,
      "explanation": "At đi với giờ giấc chính xác (at 6:30 AM), On đi với ngày và thứ (on Monday morning)."
    }
  ]
},
  {
  "id": "english-idioms-phrasal-verbs-80",
  "title": "80 Cụm Động Từ & Thành Ngữ Bản Xứ Thực Chiến",
  "subtitle": "45 Phrasal Verbs & 35 Idioms phổ biến nhất trong phim ảnh, podcast & giao tiếp người bản ngữ",
  "category": "ngoai-ngu",
  "categoryLabel": "Idioms & Phrasal Verbs",
  "badge": "Bản Xứ Khuyên Dùng 2 Xu",
  "priceXu": 2,
  "originalPriceXu": 38,
  "rating": 4.97,
  "reviewsCount": 980,
  "studentsCount": 3450,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Audio Phát Âm Ngữ Cảnh",
    "10 Câu Trắc Nghiệm Đoán Nghĩa"
  ],
  "description": "Nâng cấp kỹ năng giao tiếp tiếng Anh tự nhiên như người bản xứ với 45 cụm động từ và 35 thành ngữ thông dụng nhất. Loại bỏ hoàn toàn thói quen dịch thô từng từ (word-by-word) từ tiếng Việt sang tiếng Anh, tự tin giao tiếp và xem phim không cần phụ đề.",
  "highlights": [
    "45 Cụm động từ (Phrasal Verbs) có tần suất xuất hiện cao nhất trong đời sống",
    "35 Thành ngữ (Native Idioms) giúp nói và viết tự nhiên như người bản xứ",
    "Giải thích nguồn gốc thành ngữ (Etymology) giúp nhớ sâu không cần học vẹt",
    "Tránh lỗi dịch thô từng từ (word-by-word) từ tiếng Việt sang tiếng Anh"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "call off (phrasal verb)",
      "back": "Nghĩa: HỦY BỎ hoàn toàn một sự kiện, kế hoạch hoặc trận đấu đã lên lịch trước đó (cancel).\nVí dụ: The outdoor concert was called off due to the unexpected torrential storm.\nPhân biệt: Khác với \"put off\" (hoãn lại sang ngày khác).",
      "tag": "Phrasal Verbs Thông Dụng"
    },
    {
      "id": 2,
      "front": "put off (phrasal verb)",
      "back": "Nghĩa: 1. TRÌ HOÃN việc gì sang thời điểm sau (postpone, delay); 2. Làm ai mất hứng, gây ác cảm.\nVí dụ:\n• Never put off until tomorrow what you can do today.\n• The chef's rude attitude completely put me off eating at that restaurant.",
      "tag": "Phrasal Verbs Đa Nghĩa"
    },
    {
      "id": 3,
      "front": "bring up (phrasal verb)",
      "back": "Nghĩa: 1. NUÔI NẤNG một đứa trẻ khôn lớn (raise a child); 2. NÊU RA, đề cập một vấn đề trong cuộc thảo luận.\nVí dụ:\n• She was brought up by her grandparents in Da Lat.\n• Why did you bring up that sensitive topic during lunch?",
      "tag": "Phrasal Verbs Đa Nghĩa"
    },
    {
      "id": 4,
      "front": "come across (phrasal verb)",
      "back": "Nghĩa: 1. TÌNH CỜ BẮT GẶP thứ gì hoặc gặp ai (find/meet by chance); 2. Tạo ấn tượng như thế nào trước người khác.\nVí dụ:\n• I came across an old photo album while cleaning the bookshelf yesterday.\n• In the interview, she came across as confident and articulate.",
      "tag": "Phrasal Verbs Giao Tiếp"
    },
    {
      "id": 5,
      "front": "figure out (phrasal verb)",
      "back": "Nghĩa: TÌM RA CÁCH GIẢI QUYẾT, hiểu thấu hoặc suy nghĩ thông suốt một vấn đề hóc búa.\nVí dụ: It took the software engineers two days to figure out what was causing the database latency.\nTừ đồng nghĩa: resolve, decipher, understand.",
      "tag": "Giải Quyết Vấn Đề"
    },
    {
      "id": 6,
      "front": "run into (phrasal verb)",
      "back": "Nghĩa: 1. TÌNH CỜ ĐỤNG MẶT người quen trên đường (bump into); 2. Va phải sự cố, rắc rối (run into trouble/problems).\nVí dụ: Guess who I ran into at the supermarket? Our high school homeroom teacher!",
      "tag": "Đời Sống Thường Nhật"
    },
    {
      "id": 7,
      "front": "turn down (phrasal verb)",
      "back": "Nghĩa: 1. TỪ CHỐI một lời đề nghị, thư mời hoặc hồ sơ xin việc (reject, decline); 2. VẶN NHỎ âm lượng, nhiệt độ.\nVí dụ: He turned down a lucrative job offer in Singapore to stay close to his family.",
      "tag": "Phrasal Verbs Công Việc"
    },
    {
      "id": 8,
      "front": "look up to (phrasal verb)",
      "back": "Nghĩa: NGƯỠNG MỘ, kính trọng và lấy ai đó làm tấm gương noi theo (admire, respect).\nVí dụ: Junior developers always look up to the lead architect for technical mentorship.\nTừ trái nghĩa: look down on (coi thường, khinh miệt ai).",
      "tag": "Mối Quan Hệ"
    },
    {
      "id": 9,
      "front": "look down on (phrasal verb)",
      "back": "Nghĩa: COI THƯỜNG, khinh khi, nghĩ rằng mình thượng đẳng hơn người khác.\nVí dụ: You should never look down on anyone simply because they come from a disadvantaged background.\nTừ đồng nghĩa: despise, belittle.",
      "tag": "Mối Quan Hệ"
    },
    {
      "id": 10,
      "front": "catch up with (phrasal verb)",
      "back": "Nghĩa: 1. THEO KỊP, bắt kịp ai về tốc độ, điểm số; 2. GẶP GỠ HÀN HUYÊN cập nhật tin tức sau thời gian dài xa cách.\nVí dụ: Let's grab a coffee this weekend and catch up on everything!",
      "tag": "Giao Tiếp Bạn Bè"
    },
    {
      "id": 11,
      "front": "get along with (phrasal verb)",
      "back": "Nghĩa: HÒA THUẬN, có mối quan hệ tốt đẹp, ăn ý với ai (have a harmonious relationship).\nVí dụ: I get along really well with all my new teammates in the engineering department.\nTừ đồng nghĩa: be on good terms with.",
      "tag": "Làm Việc Nhóm"
    },
    {
      "id": 12,
      "front": "cut down on (phrasal verb)",
      "back": "Nghĩa: CẮT GIẢM BỚT lượng tiêu thụ thứ gì đó (đường, muối, chi tiêu, thời gian dùng điện thoại).\nVí dụ: The doctor advised him to cut down on sugar and processed carbs to lower his blood pressure.\nTừ đồng nghĩa: reduce, curb.",
      "tag": "Sức Khỏe & Thói Quen"
    },
    {
      "id": 13,
      "front": "give up (phrasal verb)",
      "back": "Nghĩa: TỪ BỎ thói quen, đầu hàng hoặc ngừng nỗ lực trước khó khăn (quit, surrender).\nVí dụ: Never give up on your dreams, no matter how steep the learning curve is.\nCấu trúc: give up doing sth (give up smoking).",
      "tag": "Ý Chí & Động Lực"
    },
    {
      "id": 14,
      "front": "give in (phrasal verb)",
      "back": "Nghĩa: NHƯỢNG BỘ, chịu thua trước áp lực hoặc cám dỗ sau một thời gian kháng cự.\nVí dụ: After hours of intense negotiations, the management finally gave in to the union's demands.\nTừ đồng nghĩa: yield, surrender.",
      "tag": "Đàm Phán"
    },
    {
      "id": 15,
      "front": "carry out (phrasal verb)",
      "back": "Nghĩa: TIẾN HÀNH, THỰC THI một cuộc khảo sát, nghiên cứu, kế hoạch hoặc chỉ thị (conduct, execute).\nVí dụ: The university carried out an in-depth survey on student mental health during exam season.",
      "tag": "Học Thuật & Công Việc"
    },
    {
      "id": 16,
      "front": "stand for (phrasal verb)",
      "back": "Nghĩa: 1. LÀ TỪ VIẾT TẮT CỦA chữ gì (What does AI stand for?); 2. ĐẠI DIỆN cho phẩm chất, lý tưởng; 3. Chấp nhận chịu đựng (I won't stand for this disrespect).\nVí dụ: The green color on the flag stands for hope and fertility.",
      "tag": "Phrasal Verbs Đa Nghĩa"
    },
    {
      "id": 17,
      "front": "look forward to (phrasal verb)",
      "back": "Nghĩa: HÁO HỨC, TRÔNG ĐỢI một sự kiện tươi đẹp trong tương lai.\n⚠️ Quy tắc ngữ pháp quan trọng: Sau look forward to là V-ING hoặc DANH TỪ!\nVí dụ: I look forward to hearing from you soon (Mẫu câu kết thư công việc kinh điển).",
      "tag": "Email & Thư Từ"
    },
    {
      "id": 18,
      "front": "take after (phrasal verb)",
      "back": "Nghĩa: GIỐNG AI ĐÓ trong gia đình (về ngoại hình hoặc tính cách, phẩm chất).\nVí dụ: She takes after her mother with her musical talent and warm sense of humor.\nTừ đồng nghĩa: resemble.",
      "tag": "Gia Đình & Tính Cách"
    },
    {
      "id": 19,
      "front": "show up / turn up (phrasal verb)",
      "back": "Nghĩa: XUẤT HIỆN, CÓ MẶT tại sự kiện (đặc biệt là đến bất ngờ hoặc đến trễ).\nVí dụ: We expected around 50 people, but over 120 guests showed up for the book launch.",
      "tag": "Sự Kiện Đời Sống"
    },
    {
      "id": 20,
      "front": "break down (phrasal verb)",
      "back": "Nghĩa: 1. MÁY MÓC / XE CỘ BỊ HỎNG; 2. Người suy sụp tinh thần, bật khóc nức nở; 3. Chia nhỏ số liệu ra phân tích.\nVí dụ:\n• Our car broke down in the middle of the highway.\n• Let's break down the quarterly budget into individual department items.",
      "tag": "Phrasal Verbs Đa Nghĩa"
    },
    {
      "id": 21,
      "front": "break up (phrasal verb)",
      "back": "Nghĩa: 1. CHIA TAY trong chuyện tình cảm (end a relationship); 2. Đám đông giải tán; 3. Âm thanh cuộc gọi bị giật lag ngắt quãng.\nVí dụ: Sorry, you are breaking up. Could you please repeat the last sentence?",
      "tag": "Giao Tiếp & Tình Cảm"
    },
    {
      "id": 22,
      "front": "set up (phrasal verb)",
      "back": "Nghĩa: THIẾT LẬP, THÀNH LẬP một công ty, hệ thống, thiết bị hoặc cuộc hẹn.\nVí dụ: The young entrepreneurs set up an innovative e-learning platform in just three months.\nDanh từ ghép: setup (sự sắp đặt, góc làm việc).",
      "tag": "Công Nghệ & Startup"
    },
    {
      "id": 23,
      "front": "put up with (phrasal verb)",
      "back": "Nghĩa: CHỊU ĐỰNG, NHẪN NHỊN một người hoặc tình huống gây khó chịu mà không phàn nàn.\nVí dụ: I don't know how she puts up with his constant complaining every single day.\nTừ đồng nghĩa: tolerate, endure.",
      "tag": "Giao Tiếp Đời Sống"
    },
    {
      "id": 24,
      "front": "come up with (phrasal verb)",
      "back": "Nghĩa: NẢY RA, NGHĨ RA một ý tưởng mới, sáng kiến hoặc giải pháp đột phá.\nVí dụ: The design team came up with a brilliant idea for the viral marketing campaign.\nTừ đồng nghĩa: devise, invent.",
      "tag": "Sáng Tạo & Đổi Mới"
    },
    {
      "id": 25,
      "front": "make up for (phrasal verb)",
      "back": "Nghĩa: BÙ ĐẮP LẠI cho một sai sót, thiếu hụt hoặc tổn thất đã gây ra (compensate for).\nVí dụ: He bought her a beautiful bouquet of roses to make up for forgetting their anniversary.",
      "tag": "Giao Tiếp Xã Hội"
    },
    {
      "id": 26,
      "front": "run out of (phrasal verb)",
      "back": "Nghĩa: HẾT SẠCH, cạn kiệt nguồn cung thứ gì đó (tiền, xăng, pin, kiên nhẫn).\nVí dụ: We have run out of coffee beans; could you buy a fresh bag on your way home?",
      "tag": "Đời Sống Hàng Ngày"
    },
    {
      "id": 27,
      "front": "get over (phrasal verb)",
      "back": "Nghĩa: BÌNH PHỤC sau cơn bạo bệnh; VƯỢT QUA nỗi buồn, cú sốc tình cảm hoặc thất bại.\nVí dụ: It took her nearly a year to completely get over the painful heartbreak.",
      "tag": "Tâm Lý & Sức Khỏe"
    },
    {
      "id": 28,
      "front": "take off (phrasal verb)",
      "back": "Nghĩa: 1. MÁY BAY CẤT CÁNH; 2. Sự nghiệp / sản phẩm BÙNG NỔ THÀNH CÔNG RỰC RỠ; 3. Cởi bỏ quần áo, giày mũ.\nVí dụ: His online business really took off after a TikTok video went viral overnight.",
      "tag": "Phrasal Verbs Đa Nghĩa"
    },
    {
      "id": 29,
      "front": "drop by / drop in (phrasal verb)",
      "back": "Nghĩa: TẠT TÉ QUA THĂM ai trong chốc lát mà không cần báo trước hoặc hẹn lịch cố định.\nVí dụ: Feel free to drop by my office whenever you have questions about the assignment.",
      "tag": "Giao Tiếp Thân Mật"
    },
    {
      "id": 30,
      "front": "check out (phrasal verb)",
      "back": "Nghĩa: 1. LÀM THỦ TỤC TRẢ PHÒNG khách sạn; 2. XEM THỬ, nghía qua một thứ gì đó thú vị (take a look).\nVí dụ: You should definitely check out that new cafe in West Lake; the coffee is exceptional.",
      "tag": "Đời Sống & Du Lịch"
    },
    {
      "id": 31,
      "front": "pay off (phrasal verb)",
      "back": "Nghĩa: 1. ĐEM LẠI KẾT QUẢ THÀNH CÔNG mỹ mãn (công sức bỏ ra đã được đền đáp); 2. Trả hết nợ nần.\nVí dụ: All those late nights studying 300 flashcards finally paid off when she got an 8.5 in IELTS.",
      "tag": "Thành Quả"
    },
    {
      "id": 32,
      "front": "fall through (phrasal verb)",
      "back": "Nghĩa: BỊ ĐỔ BỂ, SỤP ĐỔ không thành (kế hoạch, thỏa thuận, hợp đồng mua bán).\nVí dụ: Our trip to Tokyo fell through at the last minute because our visas were delayed.",
      "tag": "Kế Hoạch & Sự Cố"
    },
    {
      "id": 33,
      "front": "hold on (phrasal verb)",
      "back": "Nghĩa: 1. GIỮ MÁY CHỜ MỘT CHÚT khi gọi điện thoại; 2. Nắm chặt, bám chắc; 3. Kiên cường giữ vững.\nVí dụ: Hold on a second, let me grab a pen and write down your phone number.",
      "tag": "Điện Thoại & Giao Tiếp"
    },
    {
      "id": 34,
      "front": "let down (phrasal verb)",
      "back": "Nghĩa: LÀM AI ĐÓ THẤT VỌNG vì không giữ lời hứa hoặc không đạt kỳ vọng (disappoint).\nVí dụ: I promised my parents I would pass the exam, and I won't let them down.",
      "tag": "Cảm Xúc & Trách Nhiệm"
    },
    {
      "id": 35,
      "front": "pass away (phrasal verb)",
      "back": "Nghĩa: QUA ĐỜI, MẤT (cách nói giảm nói tránh lịch sự và trang trọng của \"die\").\nVí dụ: His grandfather peacefully passed away in his sleep at the age of 92.",
      "tag": "Văn Phong Lịch Sự"
    },
    {
      "id": 36,
      "front": "pass out (phrasal verb)",
      "back": "Nghĩa: 1. BẤT TỈNH, ngất xỉu do sốc nhiệt hoặc kiệt sức (faint); 2. Phân phát tài liệu cho mọi người.\nVí dụ: Several marathon runners passed out due to the extreme midday heat.",
      "tag": "Đời Sống & Sức Khỏe"
    },
    {
      "id": 37,
      "front": "pull off (phrasal verb)",
      "back": "Nghĩa: THỰC HIỆN THÀNH CÔNG một việc cực kỳ khó khăn hoặc bất khả thi (succeed against odds).\nVí dụ: Nobody thought the startup could secure 1 million USD in seed funding, but they pulled it off!",
      "tag": "Chiến Tích Vàng"
    },
    {
      "id": 38,
      "front": "rule out (phrasal verb)",
      "back": "Nghĩa: LOẠI TRỪ một khả năng, phương án hoặc nghi phạm (exclude, eliminate).\nVí dụ: The police have ruled out robbery as the primary motive for the crime.",
      "tag": "Phân Tích & Logic"
    },
    {
      "id": 39,
      "front": "stick to (phrasal verb)",
      "back": "Nghĩa: BÁM SÁT, KIÊN TRÌ TUÂN THỦ một kế hoạch, chế độ ăn hoặc quy tắc đã đề ra.\nVí dụ: If you want to lose weight sustainably, you must stick to your daily workout routine.",
      "tag": "Kỷ Luật Bản Thân"
    },
    {
      "id": 40,
      "front": "turn out (phrasal verb)",
      "back": "Nghĩa: HÓA RA LÀ, KẾT CỤC LÀ (prove to be, result in).\nVí dụ: The weather forecast predicted rain, but it turned out to be a glorious sunny day.",
      "tag": "Thực Tế & Bất Ngờ"
    },
    {
      "id": 41,
      "front": "wear off (phrasal verb)",
      "back": "Nghĩa: TÁC DỤNG NHẠT DẦN rồi biến mất (tác dụng của thuốc giảm đau, thuốc mê hoặc cảm xúc phấn khích).\nVí dụ: The dentist gave me an injection, but the numbness began to wear off after two hours.",
      "tag": "Sức Khỏe & Cảm Giác"
    },
    {
      "id": 42,
      "front": "work out (phrasal verb)",
      "back": "Nghĩa: 1. TẬP THỂ DỤC rèn luyện thân thể; 2. TIẾN TRIỂN TỐT ĐẸP, giải quyết ổn thỏa (things will work out).\nVí dụ: Don't stress too much about the future; everything will work out in the end.",
      "tag": "Lạc Quan & Sức Khỏe"
    },
    {
      "id": 43,
      "front": "back up (phrasal verb)",
      "back": "Nghĩa: 1. SAO LƯU DỮ LIỆU máy tính; 2. ỦNG HỘ, làm chỗ dựa tinh thần hoặc bảo vệ luận điểm của ai.\nVí dụ: Always back up your code to GitHub before making major modifications.",
      "tag": "Công Nghệ & Làm Việc"
    },
    {
      "id": 44,
      "front": "count on (phrasal verb)",
      "back": "Nghĩa: TRÔNG CẬY, TIN TƯỞNG vào ai đó sẽ giúp đỡ mình lúc khó khăn (rely on, depend on).\nVí dụ: You can always count on David when you need urgent help with IT bugs.",
      "tag": "Niềm Tin & Đồng Đội"
    },
    {
      "id": 45,
      "front": "brush up on (phrasal verb)",
      "back": "Nghĩa: ÔN LẠI, TRAU DỒI LẠI một kỹ năng hay kiến thức đã lâu không dùng tới để lấy lại phong độ.\nVí dụ: I need to brush up on my French grammar before our trip to Paris next month.",
      "tag": "Học Tập & Kỹ Năng"
    },
    {
      "id": 46,
      "front": "bite the bullet (idiom)",
      "back": "Nghĩa: CẮN RĂNG CHỊU ĐỰNG để làm một việc khó khăn, đau đớn nhưng bắt buộc không thể tránh khỏi.\nNguồn gốc: Trước thời kỳ có thuốc gây mê, thương binh chiến trường phải cắn chặt viên đạn chì khi bác sĩ phẫu thuật.\nVí dụ: I really hate going to the dentist, but I just have to bite the bullet and get this tooth pulled.",
      "tag": "Idioms Bản Xứ"
    },
    {
      "id": 47,
      "front": "under the weather (idiom)",
      "back": "Nghĩa: HƠI MỆT MỎI, CẢM SỐT NHẸ, trong người không được khỏe mạnh bình thường.\nVí dụ: I am feeling a bit under the weather today, so I think I'll skip the gym and rest at home.",
      "tag": "Sức Khỏe Đời Sống"
    },
    {
      "id": 48,
      "front": "see eye to eye (idiom)",
      "back": "Nghĩa: HOÀN TOÀN ĐỒNG THUẬN, cùng nhìn về một hướng, có chung quan điểm tuyệt đối với ai.\nCấu trúc: see eye to eye with someone on something.\nVí dụ: The two co-founders rarely see eye to eye on how the marketing budget should be allocated.",
      "tag": "Giao Tiếp & Đồng Thuận"
    },
    {
      "id": 49,
      "front": "break a leg (idiom)",
      "back": "Nghĩa: CHÚC MAY MẮN! (Đặc biệt dùng trong nghệ thuật sân khấu, trước giờ biểu diễn hoặc trước kỳ thi lớn).\nNguồn gốc: Giới nghệ sĩ tin rằng chúc may mắn thẳng thừng sẽ đem lại xui xẻo, nên chúc \"gãy chân\" để mang lại điềm lành.\nVí dụ: You have practiced this presentation so diligently. Break a leg up there!",
      "tag": "Lời Chúc May Mắn"
    },
    {
      "id": 50,
      "front": "spill the beans (idiom)",
      "back": "Nghĩa: LỠ MIỆNG TIẾT LỘ BÍ MẬT, làm bại lộ một kế hoạch bất ngờ trước thời điểm công bố.\nVí dụ: We were preparing a surprise farewell party for the manager, but Peter spilled the beans.",
      "tag": "Tình Huống Hài Hước"
    },
    {
      "id": 51,
      "front": "once in a blue moon (idiom)",
      "back": "Nghĩa: CỰC KỲ HIẾM KHI, năm thì mười họa mới xảy ra một lần (very rarely).\nNguồn gốc: Hiện tượng thiên văn \"Trăng xanh\" (trăng tròn lần thứ hai trong cùng một tháng) rất hiếm gặp.\nVí dụ: Because he lives in Australia, we only see each other in person once in a blue moon.",
      "tag": "Tần Suất"
    },
    {
      "id": 52,
      "front": "the tip of the iceberg (idiom)",
      "back": "Nghĩa: CHỈ LÀ PHẦN NỔI CỦA TẢNG BĂNG CHÌM (vấn đề thực tế phức tạp, nghiêm trọng và lớn hơn rất nhiều so với những gì mắt thấy).\nVí dụ: The 10 security bugs reported by users were merely the tip of the iceberg.",
      "tag": "Phân Tích Vấn Đề"
    },
    {
      "id": 53,
      "front": "burn the midnight oil (idiom)",
      "back": "Nghĩa: THỨC KHUYA CHONG ĐÈN HỌC BÀI hoặc cày việc xuyên đêm.\nNguồn gốc: Thời xưa phải đốt đèn dầu để học và làm việc thâu đêm.\nVí dụ: Medical students frequently have to burn the midnight oil before major anatomy exams.",
      "tag": "Học Tập & Thi Cử"
    },
    {
      "id": 54,
      "front": "cut corners (idiom)",
      "back": "Nghĩa: ĐI TẮT ĐÓN ĐẦU LÀM ẨU, bớt xén quy trình để tiết kiệm tiền bạc hoặc thời gian, làm giảm chất lượng.\nVí dụ: Never cut corners when building authentication and password encryption algorithms.",
      "tag": "Chất Lượng Công Việc"
    },
    {
      "id": 55,
      "front": "a piece of cake (idiom)",
      "back": "Nghĩa: DỄ NHƯ ĂN BÁNH, việc gì đó cực kỳ đơn giản không đòi hỏi nhiều nỗ lực.\nVí dụ: Once you master the Anki spaced repetition rhythm, remembering 1,000 words is a piece of cake.",
      "tag": "Giao Tiếp Hàng Ngày"
    },
    {
      "id": 56,
      "front": "cost an arm and a leg (idiom)",
      "back": "Nghĩa: ĐẮT CẮT CỔ, tốn cả một gia tài lớn (extremely expensive).\nVí dụ: Renting an apartment in central Manhattan can cost an arm and a leg.",
      "tag": "Tiền Bạc & Chi Phí"
    },
    {
      "id": 57,
      "front": "hit the nail on the head (idiom)",
      "back": "Nghĩa: NÓI TRÚNG TIM ĐEN, chỉ ra chính xác tuyệt đối trọng tâm của vấn đề phức tạp.\nVí dụ: Her assessment of our product's UX flaws hit the nail on the head.",
      "tag": "Nhận Định Sắc Sảo"
    },
    {
      "id": 58,
      "front": "let the cat out of the bag (idiom)",
      "back": "Nghĩa: VÔ TÌNH ĐỂ LỘ BÍ MẬT hoặc kế hoạch bí mật ra ngoài.\nVí dụ: It was supposed to be a stealth project, but a tech journalist let the cat out of the bag.",
      "tag": "Bí Mật"
    },
    {
      "id": 59,
      "front": "kill two birds with one stone (idiom)",
      "back": "Nghĩa: MỘT MŨI TÊN TRÚNG HAI ĐÍCH, giải quyết được hai mục tiêu chỉ bằng một hành động duy nhất.\nVí dụ: Biking to the office kills two birds with one stone: getting cardiovascular exercise and saving gas.",
      "tag": "Hiệu Suất Vàng"
    },
    {
      "id": 60,
      "front": "face the music (idiom)",
      "back": "Nghĩa: DŨNG CẢM CHẤP NHẬN HẬU QUẢ / HÌNH PHẠT do sai lầm của chính mình gây ra.\nVí dụ: After dropping the production database tables, the engineer had to face the music with the CTO.",
      "tag": "Trách Nhiệm Bản Thân"
    },
    {
      "id": 61,
      "front": "by the book (idiom)",
      "back": "Nghĩa: LÀM ĐÚNG THEO SÁCH VỞ, tuân thủ nghiêm ngặt mọi quy tắc và quy trình pháp lý (strictly follow rules).\nVí dụ: The civil aviation inspectors conducted the safety check strictly by the book.",
      "tag": "Quy Chuẩn Pháp Lý"
    },
    {
      "id": 62,
      "front": "call it a day (idiom)",
      "back": "Nghĩa: KẾT THÚC CÔNG VIỆC TRONG NGÀY, hôm nay làm tới đây thôi rồi về nghỉ.\nVí dụ: We have been debugging for 10 straight hours. Let's call it a day and resume tomorrow morning.",
      "tag": "Công Sở & Nghỉ Ngơi"
    },
    {
      "id": 63,
      "front": "back to the drawing board (idiom)",
      "back": "Nghĩa: LÀM LẠI TỪ ĐẦU, quay lại bàn phác thảo sau khi phương án ban đầu thất bại hoàn toàn.\nVí dụ: The prototype failed the crash test, so our engineering team had to go back to the drawing board.",
      "tag": "Kế Hoạch & Sửa Sai"
    },
    {
      "id": 64,
      "front": "burn bridges (idiom)",
      "back": "Nghĩa: ĐỐT CẦU RÚT VÁN, phá hủy hoàn toàn mối quan hệ khiến sau này không bao giờ hàn gắn lại được.\nVí dụ: Even when resigning from a company you dislike, never burn your bridges with former colleagues.",
      "tag": "Nghệ Thuật Cư Xử"
    },
    {
      "id": 65,
      "front": "at the drop of a hat (idiom)",
      "back": "Nghĩa: NGAY TỨC THÌ, không chút đắn đo hay do dự (instantly, without hesitation).\nVí dụ: She loves traveling so much that she would pack her bags at the drop of a hat.",
      "tag": "Hành Động Mau Lẹ"
    },
    {
      "id": 66,
      "front": "bend over backwards (idiom)",
      "back": "Nghĩa: HẾT LÒNG HẾT SỨC, làm đủ mọi cách kể cả việc khó nhọc để giúp đỡ hoặc làm hài lòng ai đó.\nVí dụ: The hotel staff bent over backwards to make sure our family had an unforgettable vacation.",
      "tag": "Sự Tận Tâm"
    },
    {
      "id": 67,
      "front": "blessing in disguise (idiom)",
      "back": "Nghĩa: TRONG CÁI RỦI CÓ CÁI MAY, điều ban đầu ngỡ là tai họa nhưng hóa ra lại mang đến kết quả tuyệt vời.\nVí dụ: Missing that flight was a blessing in disguise because it allowed him to meet his future business partner.",
      "tag": "Triết Lý Sống"
    },
    {
      "id": 68,
      "front": "cry over spilt milk (idiom)",
      "back": "Nghĩa: KHÓC THAN VÌ SỰ ĐÃ RỒI, hối tiếc vô ích về một điều tồi tệ đã xảy ra và không thể thay đổi được.\nVí dụ: What's done is done. There is no use crying over spilt milk; let's focus on next steps.",
      "tag": "Thái Độ Tích Cực"
    },
    {
      "id": 69,
      "front": "hit the sack (idiom)",
      "back": "Nghĩa: ĐI NGỦ (go to bed, hit the hay).\nVí dụ: I have to catch a 6:00 AM flight tomorrow, so I am going to hit the sack right now.",
      "tag": "Đời Sống Hàng Ngày"
    },
    {
      "id": 70,
      "front": "keep an eye on (idiom)",
      "back": "Nghĩa: ĐỂ MẮT ĐẾN, trông coi, theo dõi sát sao ai hoặc cái gì.\nVí dụ: Could you please keep an eye on my backpack while I go to the restroom?",
      "tag": "Giao Tiếp Đời Sống"
    },
    {
      "id": 71,
      "front": "leave no stone unturned (idiom)",
      "back": "Nghĩa: LẬT TỪNG VIÊN ĐÁ LÊN ĐỂ TÌM, dùng mọi biện pháp khả thi, không bỏ sót bất kỳ manh mối nào.\nVí dụ: Detectives promised to leave no stone unturned until the missing artwork was recovered.",
      "tag": "Sự Tận Lực"
    },
    {
      "id": 72,
      "front": "on cloud nine (idiom)",
      "back": "Nghĩa: LÂNG LÂNG TRÊN CHÍN TẦNG MÂY, vui sướng tột cùng, ngập tràn hạnh phúc.\nVí dụ: When he received the acceptance letter from Harvard, he was on cloud nine for an entire week.",
      "tag": "Cảm Xúc Thăng Hoa"
    },
    {
      "id": 73,
      "front": "out of the blue (idiom)",
      "back": "Nghĩa: HOÀN TOÀN BẤT NGỜ, từ trên trời rơi xuống, không có dấu hiệu báo trước (completely unexpected).\nVí dụ: Yesterday, out of the blue, an old friend from elementary school texted me.",
      "tag": "Sự Kiện Bất Ngờ"
    },
    {
      "id": 74,
      "front": "pull someone's leg (idiom)",
      "back": "Nghĩa: TRÊU CHỌC, ĐÙA GIỠN với ai cho vui chứ không có ý ác ý (tease, joke playfully).\nVí dụ: Don't panic! He wasn't serious about the Saturday meeting; he was just pulling your leg.",
      "tag": "Hài Hước Giao Tiếp"
    },
    {
      "id": 75,
      "front": "take with a grain of salt (idiom)",
      "back": "Nghĩa: TIẾP NHẬN CÓ CHỌN LỌC VÀ HOÀI NGHI, không tin tưởng 100% lời đồn thổi trên mạng.\nVí dụ: Online gossip should always be taken with a grain of salt.",
      "tag": "Tư Duy Phản Biện"
    },
    {
      "id": 76,
      "front": "through thick and thin (idiom)",
      "back": "Nghĩa: VƯỢT QUA MỌI THĂNG TRẦM, cùng nhau gắn bó qua lúc hoạn nạn cũng như lúc vinh quang.\nVí dụ: True best friends stand by each other through thick and thin.",
      "tag": "Tình Bạn Vàng"
    },
    {
      "id": 77,
      "front": "up in the air (idiom)",
      "back": "Nghĩa: CHƯA ĐƯỢC ĐỊNH ĐOẠT, còn lơ lửng, chưa có quyết định cuối cùng (uncertain, undecided).\nVí dụ: Our summer travel plans are still up in the air until the company announces vacation schedules.",
      "tag": "Tình Trạng Chưa Rõ"
    },
    {
      "id": 78,
      "front": "wrap one's head around (idiom)",
      "back": "Nghĩa: HIỂU ĐƯỢC, THẤU TRIỆT một vấn đề phức tạp, kỳ lạ hoặc khó tin.\nVí dụ: It's hard to wrap your head around just how massive the universe really is.",
      "tag": "Nhận Thức & Tư Duy"
    },
    {
      "id": 79,
      "front": "play devil's advocate (idiom)",
      "back": "Nghĩa: ĐÓNG VAI NGƯỜI PHẢN BIỆN, cố tình đưa ra ý kiến ngược chiều để thử thách độ vững chắc của lập luận.\nVí dụ: In our team brainstorming session, Minh played devil's advocate to expose potential security loopholes.",
      "tag": "Tranh Luận & Lập Luận"
    },
    {
      "id": 80,
      "front": "the ball is in your court (idiom)",
      "back": "Nghĩa: QUYỀN QUYẾT ĐỊNH / LƯỢT HÀNH ĐỘNG THUỘC VỀ BẠN (đến lượt bạn phải ra quyết định hoặc phản hồi).\nVí dụ: We have offered our best discount and terms; now the ball is in their court.",
      "tag": "Đàm Phán & Ra Quyết Định"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Thành ngữ 'Bite the bullet' có nghĩa là gì?",
      "options": [
        "A. Gặp một tai nạn súng đạn bất ngờ",
        "B. Cắn răng chịu đựng để làm một việc khó khăn không thể tránh khỏi",
        "C. Ăn đồ ăn nhanh có hại cho sức khỏe",
        "D. Tranh cãi nảy lửa với đối thủ"
      ],
      "correct": 1,
      "explanation": "Bite the bullet nghĩa là dũng cảm cắn răng chấp nhận đối mặt với việc khó khăn."
    },
    {
      "id": 2,
      "question": "Khi bạn cảm thấy 'Under the weather', bạn đang trong tình trạng nào?",
      "options": [
        "A. Đang đi dưới trời mưa",
        "B. Cực kỳ vui mừng phấn khởi",
        "C. Hơi mệt mỏi, khó ở hoặc cảm sốt nhẹ",
        "D. Đang theo dõi dự báo thời tiết"
      ],
      "correct": 2,
      "explanation": "Under the weather là cảm thấy hơi mệt mỏi hoặc không khỏe trong người."
    },
    {
      "id": 3,
      "question": "Điền phrasal verb thích hợp: 'The outdoor concert was ______ due to the heavy storm.'",
      "options": [
        "A. put off",
        "B. called off",
        "C. broken down",
        "D. turned down"
      ],
      "correct": 1,
      "explanation": "Call off = cancel (hủy bỏ hoàn toàn sự kiện)."
    },
    {
      "id": 4,
      "question": "Cụm từ nào mang nghĩa 'Vô tình để lộ bí mật'?",
      "options": [
        "A. Spill the beans",
        "B. Hit the nail on the head",
        "C. Burn the midnight oil",
        "D. Cost an arm and a leg"
      ],
      "correct": 0,
      "explanation": "Spill the beans hoặc Let the cat out of the bag đều có nghĩa là lỡ miệng để lộ bí mật."
    },
    {
      "id": 5,
      "question": "Thành ngữ 'Burn the midnight oil' thường dùng trong ngữ cảnh nào?",
      "options": [
        "A. Nấu ăn khuya",
        "B. Thức khuya cày cuốc học bài hoặc làm việc thâu đêm",
        "C. Tiết kiệm điện năng",
        "D. Đốt lửa trại trên bãi biển"
      ],
      "correct": 1,
      "explanation": "Burn the midnight oil chỉ việc thức khuya chong đèn học bài hoặc cày việc."
    },
    {
      "id": 6,
      "question": "Chọn phrasal verb mang nghĩa 'Chịu đựng một người hoặc hoàn cảnh phiền toái':",
      "options": [
        "A. put up with",
        "B. look up to",
        "C. run out of",
        "D. catch up with"
      ],
      "correct": 0,
      "explanation": "Put up with = tolerate (chịu đựng, nhẫn nhịn)."
    },
    {
      "id": 7,
      "question": "'Cut corners' trong công việc kinh doanh có ý nghĩa gì?",
      "options": [
        "A. Cắt góc giấy cho vuông vức",
        "B. Đi tắt đón đầu, làm ẩu, bớt xén quy trình làm giảm chất lượng",
        "C. Giảm giá sản phẩm để kích cầu",
        "D. Tối ưu hóa giao diện người dùng"
      ],
      "correct": 1,
      "explanation": "Cut corners là làm ẩu, cắt xén các bước quan trọng để tiết kiệm chi phí/thời gian."
    },
    {
      "id": 8,
      "question": "Thành ngữ nào mang nghĩa là 'Cực kỳ hiếm khi xảy ra'?",
      "options": [
        "A. Once in a blue moon",
        "B. A piece of cake",
        "C. In the heat of the moment",
        "D. By the book"
      ],
      "correct": 0,
      "explanation": "Once in a blue moon nghĩa là năm thì mười họa mới xảy ra một lần."
    },
    {
      "id": 9,
      "question": "Điền phrasal verb: 'I ______ my old high school friend at the coffee shop yesterday.'",
      "options": [
        "A. came up with",
        "B. ran into",
        "C. looked down on",
        "D. turned down"
      ],
      "correct": 1,
      "explanation": "Run into = tình cờ gặp mặt ai đó."
    },
    {
      "id": 10,
      "question": "Khi ai đó nói 'The ball is in your court', điều đó có nghĩa là gì?",
      "options": [
        "A. Trận đấu bóng chuyền đã kết thúc",
        "B. Bạn vừa bị mất quyền kiểm soát",
        "C. Quyết định tiếp theo hoặc lượt hành động hiện thuộc về bạn",
        "D. Bạn cần đi mua thêm một quả bóng mới"
      ],
      "correct": 2,
      "explanation": "The ball is in your court nghĩa là đến lượt bạn phải đưa ra quyết định hoặc phản hồi."
    }
  ]
},
  {
  "id": "english-business-interview-75",
  "title": "75 Mẫu Câu Tiếng Anh Công Sở & Phỏng Vấn STAR",
  "subtitle": "Email doanh nghiệp, Thuật ngữ họp hành & Kỹ thuật trả lời phỏng vấn tập đoàn đa quốc gia",
  "category": "ngoai-ngu",
  "categoryLabel": "Tiếng Anh Công Sở & Phỏng Vấn",
  "badge": "Bí Kíp Pass Phỏng Vấn 3 Xu",
  "priceXu": 3,
  "originalPriceXu": 45,
  "rating": 4.98,
  "reviewsCount": 1120,
  "studentsCount": 4210,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Template Email Doanh Nghiệp",
    "Bộ Câu Hỏi & Đáp Phỏng Vấn STAR"
  ],
  "description": "Trọn bộ bí kíp sinh tồn và thăng tiến trong môi trường làm việc quốc tế và tập đoàn đa quốc gia. Cung cấp 25 mẫu email chuẩn mực, 25 thuật ngữ công sở (touch base, bandwidth, bottleneck...) và 25 câu hỏi phỏng vấn tuyển dụng hành vi theo mô hình STAR.",
  "highlights": [
    "25 Mẫu email công việc: mở bài, follow-up, hối deadline, từ chối khéo léo",
    "25 Thuật ngữ họp hành chuẩn quốc tế: touch base, bandwidth, bottleneck, pivot",
    "25 Câu hỏi & cấu trúc trả lời phỏng vấn theo mô hình STAR kinh điển",
    "Công thức X-Y-Z viết CV chuẩn Google và nghệ thuật đàm phán lương bổng"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "Mẫu câu mở đầu email công việc chuyên nghiệp và lịch sự nhất?",
      "back": "• Trang trọng thông dụng: \"I hope this email finds you well.\"\n• Đầu tuần: \"I hope you had a restful weekend.\"\n• Phản hồi khách hàng: \"Thank you for reaching out to us regarding [Topic].\"\n💡 Lưu ý: Tránh dùng \"Hey bro\" hoặc \"Hi, what's up\" trong email gửi đối tác hay khách hàng.",
      "tag": "Email Chuyên Nghiệp"
    },
    {
      "id": 2,
      "front": "Mẫu câu theo dõi tiến độ (Follow-up) tinh tế không mang tính hối thúc gắt gỏng?",
      "back": "• \"I am following up on our previous discussion regarding the project timeline.\"\n• \"Just checking in to see if you have had a chance to review the proposal I sent last Tuesday.\"\n• \"Please let me know if you need any additional data to proceed.\"",
      "tag": "Email Follow-up"
    },
    {
      "id": 3,
      "front": "Cách nói đính kèm tài liệu trong email chuẩn và ngắn gọn nhất?",
      "back": "• \"Please find attached the updated financial report for Q3.\"\n• \"I have attached the contract for your review and signature.\"\n• \"Attached below is the slide deck summarizing today's key takeaways.\"\n⚠️ Tránh lỗi: \"Attached please find\" (hơi cổ lỗ sĩ) hoặc quên không đính kèm file!",
      "tag": "Email Doanh Nghiệp"
    },
    {
      "id": 4,
      "front": "Cách đặt hạn chót (Deadline) lịch sự và rõ ràng?",
      "back": "• \"Could you please share your feedback by 5:00 PM tomorrow (COB)?\"\n• \"To help us meet the deployment deadline, we would appreciate receiving your input by Friday.\"\n📌 COB = Close of Business (hết giờ làm việc, thường là 5:00 hoặc 5:30 chiều). EOD = End of Day.",
      "tag": "Deadline & Tiến Độ"
    },
    {
      "id": 5,
      "front": "Cách từ chối một lời đề nghị hợp tác / ứng tuyển lịch sự và giữ gìn quan hệ?",
      "back": "• \"Thank you for the opportunity. However, due to current bandwidth constraints, we are unable to participate at this time.\"\n• \"While we appreciate your proposal, our strategic priorities for this quarter are focused elsewhere.\"\n• \"We would love to keep in touch and explore potential collaboration in the future.\"",
      "tag": "Nghệ Thuật Từ Chối"
    },
    {
      "id": 6,
      "front": "Cách thông báo và xin lỗi vì sự cố chậm trễ mà không làm mất uy tín?",
      "back": "• \"Please accept our apologies for the delay. We encountered an unexpected technical bottleneck, which has now been fully resolved.\"\n• \"Thank you for your patience while we finalized the audits. The complete dossier is attached below.\"",
      "tag": "Xử Lý Sự Cố"
    },
    {
      "id": 7,
      "front": "Mẫu câu xác nhận lịch họp (Confirming Meeting Schedule)?",
      "back": "• \"I would like to confirm our meeting scheduled for Thursday at 2:00 PM (GMT+7).\"\n• \"Looking forward to our discussion. I have sent a Google Calendar invite with the Zoom link attached.\"",
      "tag": "Đặt Lịch Họp"
    },
    {
      "id": 8,
      "front": "Mẫu câu xin phê duyệt ngân sách hoặc kế hoạch từ cấp trên?",
      "back": "• \"Could you please review the attached proposal and let us know if you approve the allocated budget?\"\n• \"We would appreciate your green light on this campaign so we can begin the vendor onboarding process.\"",
      "tag": "Trình Duyệt & Báo Cáo"
    },
    {
      "id": 9,
      "front": "Mẫu câu giới thiệu nhân sự mới hoặc đối tác qua email?",
      "back": "• \"I am delighted to introduce Lan Anh, our new Product Marketing Lead, who will be overseeing this account moving forward.\"\n• \"Lan Anh will be your main point of contact for all upcoming deliverables.\"",
      "tag": "Giới Thiệu Nhân Sự"
    },
    {
      "id": 10,
      "front": "Mẫu bàn giao công việc trước khi nghỉ phép (PTO Handover)?",
      "back": "• \"I will be out of the office from Oct 24th to Oct 28th with limited access to email.\"\n• \"During my absence, please reach out to my colleague Minh (minh@onthihub.vn) for any urgent production inquiries.\"",
      "tag": "Bàn Giao & Nghỉ Phép"
    },
    {
      "id": 11,
      "front": "Mẫu câu xác nhận đã nhận được tài liệu/tiền thanh toán (Acknowledging Receipt)?",
      "back": "• \"This email is to confirm that we have safely received the signed contract and invoice #402.\"\n• \"Thank you for the prompt turnaround; our finance department will process payment within 3 business days.\"",
      "tag": "Xác Nhận Nhận Hàng"
    },
    {
      "id": 12,
      "front": "Mẫu câu nhắc nhở thanh toán hóa đơn quá hạn một cách chuyên nghiệp?",
      "back": "• \"We hope this email finds you well. This is a gentle reminder that invoice #204, which was due on Oct 15th, is currently outstanding.\"\n• \"Please let us know if you require another copy of the invoice or assistance with bank transfer details.\"",
      "tag": "Thu Hồi Công Nợ"
    },
    {
      "id": 13,
      "front": "Cách góp ý (Constructive Feedback) khéo léo theo phương pháp Sandwich?",
      "back": "Phương pháp Sandwich: Khen ngợi -> Góp ý cải thiện -> Động viên tích cực.\nVí dụ: \"Your deck design was visually stunning. However, the financial projection slide lacked market data to support the numbers. With updated figures, this pitch will be unbeatable!\"",
      "tag": "Nghệ Thuật Lãnh Đạo"
    },
    {
      "id": 14,
      "front": "Cách báo cáo sự cố khẩn cấp (Escalating an Issue) lên ban giám đốc?",
      "back": "• Tiêu đề: \"[URGENT] Payment Gateway Down - Immediate Attention Required\"\n• Thân bài: Nêu rõ: 1. Sự cố là gì; 2. Mức độ ảnh hưởng (ảnh hưởng bao nhiêu user); 3. Biện pháp tạm thời; 4. Yêu cầu hỗ trợ khẩn cấp.",
      "tag": "Xử Lý Khẩn Cấp"
    },
    {
      "id": 15,
      "front": "Mẫu câu cảm ơn đối tác sau khi kết thúc một dự án lớn?",
      "back": "• \"On behalf of the OnThiHub team, I want to express our sincere gratitude for your exceptional collaboration and dedication throughout this launch.\"\n• \"It was an absolute pleasure working alongside your team, and we look forward to future partnerships.\"",
      "tag": "Quan Hệ Đối Tác"
    },
    {
      "id": 16,
      "front": "Mẫu email hâm nóng lại liên hệ với khách hàng cũ (Reconnecting)?",
      "back": "• \"It has been a while since we last spoke! I wanted to touch base and share some exciting new features we recently launched on OnThiHub that might benefit your team's workflow.\"\n• \"Would you be open for a brief 10-minute catch-up call next Tuesday?\"",
      "tag": "Chăm Sóc Khách Hàng"
    },
    {
      "id": 17,
      "front": "Quy tắc đặt Tiêu đề email (Subject Line) chuyên nghiệp?",
      "back": "• Quy tắc: Dưới 50 ký tự, có tiền tố phân loại trong ngoặc vuông, thể hiện rõ hành động cần làm.\n• Ví dụ tốt:\n  - [Action Required] Review Q3 Marketing Budget by Friday\n  - [Meeting Recap] OnThiHub AI Roadmap - Next Steps\n  - [Invoice #108] Payment Confirmation\n⚠️ Tránh: \"Hi\", \"Help\", hoặc viết hoa TOÀN BỘ CHỮ CÁI.",
      "tag": "Kỹ Năng Email"
    },
    {
      "id": 18,
      "front": "Cách hỏi lại sếp hoặc đối tác khi yêu cầu công việc còn mơ hồ?",
      "back": "• \"Could you please clarify the target audience and preferred format for this report?\"\n• \"To ensure we are aligned with your vision, would you like us to focus primarily on user acquisition or revenue retention for this deliverable?\"",
      "tag": "Làm Rõ Yêu Cầu"
    },
    {
      "id": 19,
      "front": "Phân biệt CC và BCC trong email doanh nghiệp?",
      "back": "• CC (Carbon Copy): Những người cần NẮM BẮT THÔNG TIN (không trực tiếp hành động); mọi người đều nhìn thấy địa chỉ email của nhau.\n• BCC (Blind Carbon Copy): Những người nhận được email nhưng BỊ ẨN ĐỊA CHỈ; dùng khi gửi cho hàng trăm khách hàng để bảo mật quyền riêng tư.",
      "tag": "Quy Chuẩn Email"
    },
    {
      "id": 20,
      "front": "Cách chọn lời kết thư (Sign-off) phù hợp với từng mức độ quan hệ?",
      "back": "• Rất trang trọng: \"Sincerely,\", \"Respectfully,\"\n• Tiêu chuẩn công sở phổ biến: \"Best regards,\", \"Kind regards,\"\n• Thân thiện, quen biết: \"Warm regards,\", \"Warmly,\", \"Best,\"\n⚠️ Tránh: \"Cheers\" (quá thân mật), \"Yours forever\" (không phù hợp công sở).",
      "tag": "Quy Chuẩn Email"
    },
    {
      "id": 21,
      "front": "Cách xử lý một chuỗi email tranh cãi căng thẳng (De-escalating)?",
      "back": "Mẫu câu vàng: \"I believe our perspectives are both aimed at delivering the best outcome. To avoid any miscommunication over email, let's jump on a quick 10-minute phone call to align.\"",
      "tag": "Nghệ Thuật Ứng Xử"
    },
    {
      "id": 22,
      "front": "Mẫu câu tổng kết các đầu việc sau cuộc họp (Action Items)?",
      "back": "• \"Thank you everyone for a productive session today. Below is a summary of the agreed action items and ownership:\"\n• [Owner] - [Task] - [Deadline]\n• Example: \"Minh: Finalize API endpoints by Thursday COB.\"",
      "tag": "Quản Trị Cuộc Họp"
    },
    {
      "id": 23,
      "front": "Cách xin thư giới thiệu (Recommendation Letter) từ sếp cũ khéo léo?",
      "back": "• \"I am currently preparing my application for the Chevening Scholarship, and I am reaching out to see if you would feel comfortable writing a letter of recommendation on my behalf.\"\n• \"I have attached an updated resume and bullet points summarizing our key projects together.\"",
      "tag": "Phát Triển Sự Nghiệp"
    },
    {
      "id": 24,
      "front": "Cách viết tóm tắt điều hành (Executive Summary) trong 3 gạch đầu dòng?",
      "back": "Công thức: Bối cảnh vấn đề -> Giải pháp đề xuất -> Kết quả dự kiến (kèm số liệu).\nVí dụ:\n• Problem: Mobile cart abandonment rate is currently 42%.\n• Solution: Implement one-click VietQR payment gateway.\n• Expected ROI: Projected to decrease drop-offs by 18% and generate $50k monthly.",
      "tag": "Kỹ Năng Thuyết Trình"
    },
    {
      "id": 25,
      "front": "Mẫu thư trả lời tự động khi vắng mặt (Out of Office Autoreply)?",
      "back": "\"Thank you for your email. I am currently out of the office attending an industry conference and will have limited email access until Monday, Oct 28th. If your matter is urgent, please contact support@onthihub.vn. Otherwise, I will reply promptly upon my return.\"",
      "tag": "Mẫu Thư Tự Động"
    },
    {
      "id": 26,
      "front": "Thuật ngữ: \"Touch base\" nghĩa là gì trong môi trường công sở?",
      "back": "Nghĩa: Gặp gỡ, gọi điện hoặc trao đổi ngắn gọn với ai để cập nhật nhanh tình hình công việc.\nVí dụ: \"Let's touch base for 10 minutes tomorrow morning before the client demo.\"",
      "tag": "Thuật Ngữ Công Sở"
    },
    {
      "id": 27,
      "front": "Thuật ngữ: \"Circle back\" dùng trong cuộc họp mang nghĩa gì?",
      "back": "Nghĩa: Quay lại thảo luận vấn đề này sau (khi đã có thêm dữ liệu hoặc sau khi giải quyết việc chính).\nVí dụ: \"We don't have the exact marketing spend figures right now, so let's circle back to this on Friday.\"",
      "tag": "Quản Lý Cuộc Họp"
    },
    {
      "id": 28,
      "front": "Thuật ngữ: \"Bandwidth\" trong câu: \"I don't have the bandwidth for this\"?",
      "back": "Nghĩa: Quỹ thời gian, sức lực hoặc dung lượng tinh thần để nhận thêm việc mới (bị quá tải).\nVí dụ: \"Our dev team is swamped with the mobile app release, so they lack the bandwidth for new feature requests this sprint.\"",
      "tag": "Giao Tiếp Nội Bộ"
    },
    {
      "id": 29,
      "front": "Thuật ngữ: \"Actionable items / Action items\" là gì?",
      "back": "Nghĩa: Các đầu việc cụ thể, có người chịu trách nhiệm và có thể bắt tay vào thực hiện được ngay sau cuộc họp.\nVí dụ: \"Let's wrap up this brainstorm by converting our ideas into concrete actionable items with deadlines.\"",
      "tag": "Họp Hiệu Quả"
    },
    {
      "id": 30,
      "front": "Thuật ngữ: \"Bottleneck\" trong quy trình vận hành doanh nghiệp là gì?",
      "back": "Nghĩa: Điểm nghẽn cổ chai (nơi gây ứ đọng, làm chậm tốc độ của toàn bộ quy trình).\nVí dụ: \"Manual QA testing was the primary bottleneck delaying our weekly software releases.\"",
      "tag": "Vận Hành Tinh Gọn"
    },
    {
      "id": 31,
      "front": "Cụm từ: \"Table this discussion\" / \"Park this idea\" nghĩa là gì?",
      "back": "Nghĩa: Tạm gác cuộc thảo luận này lại để tập trung vào mục tiêu chính của buổi họp, tránh đi chệch đề.\nVí dụ: \"That's an interesting topic, but let's table it for our monthly strategy sync to stay within our 30-minute agenda.\"",
      "tag": "Điều Phối Cuộc Họp"
    },
    {
      "id": 32,
      "front": "Thuật ngữ: \"Deep dive\" là gì?",
      "back": "Nghĩa: Nghiên cứu, mổ xẻ, phân tích một chủ đề sâu sắc từ gốc đến ngọn (in-depth examination).\nVí dụ: \"In tomorrow's technical workshop, we will do a deep dive into vector databases and LLM embeddings.\"",
      "tag": "Phân Tích Chuyên Sâu"
    },
    {
      "id": 33,
      "front": "Thuật ngữ: \"Move the needle\" nghĩa là gì?",
      "back": "Nghĩa: Tạo ra sự thay đổi rõ rệt, mang tính bước ngoặt, tạo tác động đáng kể đến chỉ số kinh doanh.\nVí dụ: \"Changing button colors won't move the needle; we need to overhaul our pricing strategy.\"",
      "tag": "Tác Động Kinh Doanh"
    },
    {
      "id": 34,
      "front": "Thuật ngữ: \"Low-hanging fruit\" nghĩa là gì?",
      "back": "Nghĩa: Việc dễ xơi, cơ hội dễ nắm bắt, chỉ cần tốn ít công sức là đạt được kết quả ngay (easy win).\nVí dụ: \"Fixing landing page typos and load speed is low-hanging fruit that can boost conversion immediately.\"",
      "tag": "Chiến Lược Tối Ưu"
    },
    {
      "id": 35,
      "front": "Thuật ngữ: \"Pain point\" của khách hàng là gì?",
      "back": "Nghĩa: Nỗi đau, vấn đề phiền toái hoặc khó khăn dai dẳng mà khách hàng đang phải chịu đựng.\nVí dụ: \"Our flashcard app solves a major student pain point: forgetting vocabulary after just 24 hours.\"",
      "tag": "Thấu Hiểu Khách Hàng"
    },
    {
      "id": 36,
      "front": "Thuật ngữ: \"Deliverables\" trong hợp đồng hoặc dự án là gì?",
      "back": "Nghĩa: Các sản phẩm bàn giao cụ thể (tài liệu, phần mềm, bản thiết kế...) mà đội ngũ phải nộp đúng hạn.\nVí dụ: \"The key deliverables for milestone 1 include UI mockups, API specifications, and database schema.\"",
      "tag": "Quản Trị Dự Án"
    },
    {
      "id": 37,
      "front": "Phân biệt KPIs vs OKRs trong quản trị hiệu suất?",
      "back": "• KPI (Key Performance Indicator): Chỉ số đo lường hiệu suất vận hành ổn định định kỳ (ví dụ: Doanh thu đạt 500 triệu/tháng, thời gian xử lý ticket < 2 giờ).\n• OKR (Objectives and Key Results): Mục tiêu chiến lược đầy tham vọng và mang tính đột phá (Objective) kèm 3-5 kết quả then chốt định lượng được (Key Results).",
      "tag": "Quản Trị Doanh Nghiệp"
    },
    {
      "id": 38,
      "front": "Thuật ngữ: \"Stakeholders\" bao gồm những ai?",
      "back": "Nghĩa: Các bên liên quan (bất kỳ cá nhân hoặc tổ chức nào chịu ảnh hưởng hoặc có quyền lợi trong dự án: nhà đầu tư, ban giám đốc, nhân viên, khách hàng, nhà cung cấp).",
      "tag": "Quản Lý Dự Án"
    },
    {
      "id": 39,
      "front": "Thuật ngữ: \"Pivot\" trong startup nghĩa là gì?",
      "back": "Nghĩa: Chuyển hướng chiến lược (thay đổi mô hình kinh doanh hoặc tính năng cốt lõi của sản phẩm khi mô hình cũ không đạt Product-Market Fit).\nVí dụ: \"Twitter originally started as a podcasting platform named Odeo before pivoting to microblogging.\"",
      "tag": "Startup & Đổi Mới"
    },
    {
      "id": 40,
      "front": "Thuật ngữ: \"Runway\" của một công ty khởi nghiệp là gì?",
      "back": "Nghĩa: Đường băng tài chính (số tháng mà startup có thể tiếp tục hoạt động với lượng tiền mặt hiện có trước khi hết sạch tiền hoặc cần gọi thêm vốn).\nVí dụ: \"With our current burn rate, we have 14 months of cash runway remaining.\"",
      "tag": "Tài Chính Khởi Nghiệp"
    },
    {
      "id": 41,
      "front": "Thuật ngữ: \"Synergy\" (Sức mạnh cộng hưởng) là gì?",
      "back": "Nghĩa: Hiệu ứng 1 + 1 > 2 khi hai phòng ban hoặc hai công ty hợp tác chặt chẽ cùng nhau tạo ra giá trị vượt trội.\nVí dụ: \"The synergy between our AI content generator and TikTok distribution team tripled user signups.\"",
      "tag": "Hợp Tác Kinh Doanh"
    },
    {
      "id": 42,
      "front": "Thuật ngữ: \"Leverage\" dùng như động từ mang nghĩa gì?",
      "back": "Nghĩa: Tận dụng tối đa một đòn bẩy, lợi thế hoặc nguồn lực có sẵn để đạt được mục tiêu lớn hơn.\nVí dụ: \"We should leverage our university partner network to distribute OnThiHub flashcards directly to students.\"",
      "tag": "Chiến Lược Kinh Doanh"
    },
    {
      "id": 43,
      "front": "Thuật ngữ: \"Streamline\" nghĩa là gì?",
      "back": "Nghĩa: Tinh gọn hóa, tối ưu hóa quy trình để chạy mượt mà hơn và loại bỏ các bước rườm rà lãng phí.\nVí dụ: \"We streamlined the checkout flow from 5 steps down to 1 click, cutting cart abandonment by half.\"",
      "tag": "Vận Hành Tinh Gọn"
    },
    {
      "id": 44,
      "front": "Thuật ngữ: \"Core competency\" là gì?",
      "back": "Nghĩa: Năng lực cốt lõi (thế mạnh độc nhất vô nhị mà đối thủ cạnh tranh khó lòng sao chép được).\nVí dụ: \"Apple's core competency lies in seamless hardware-software integration and premium product design.\"",
      "tag": "Lợi Thế Cạnh Tranh"
    },
    {
      "id": 45,
      "front": "Thuật ngữ: \"Scalability\" (Khả năng mở rộng quy mô) là gì?",
      "back": "Nghĩa: Năng lực của hệ thống hoặc mô hình kinh doanh có thể phục vụ số lượng người dùng tăng gấp 100 lần mà chi phí và thời gian không tăng tuyến tính.\nVí dụ: \"Digital flashcard platforms have infinite scalability compared to traditional physical print publishers.\"",
      "tag": "Công Nghệ & Tăng Trưởng"
    },
    {
      "id": 46,
      "front": "Cụm từ: \"Get stakeholder buy-in\" nghĩa là gì?",
      "back": "Nghĩa: Đạt được sự đồng thuận, ủng hộ và nhất trí từ các bên liên quan trước khi triển khai dự án.\nVí dụ: \"Before spending budget on the new ad campaign, we must get buy-in from the CFO.\"",
      "tag": "Đàm Phán Nội Bộ"
    },
    {
      "id": 47,
      "front": "Cụm từ: \"On the same page\" nghĩa là gì?",
      "back": "Nghĩa: Có chung sự hiểu biết, thông suốt và đồng lòng về mục tiêu, không có hiểu lầm.\nVí dụ: \"Let's review the product roadmap once more to ensure all developers are on the same page.\"",
      "tag": "Làm Việc Nhóm"
    },
    {
      "id": 48,
      "front": "Cụm từ: \"Push the envelope\" nghĩa là gì?",
      "back": "Nghĩa: Bứt phá giới hạn, đổi mới sáng tạo vượt ra khỏi những chuẩn mực thông thường.\nVí dụ: \"Our 3D interactive flashcard UI really pushes the envelope of modern educational web apps.\"",
      "tag": "Đột Phá Sáng Tạo"
    },
    {
      "id": 49,
      "front": "Thuật ngữ: \"Best practices\" trong ngành là gì?",
      "back": "Nghĩa: Các thông lệ tốt nhất (các phương pháp, quy trình đã được chứng minh trong thực tiễn là hiệu quả và an toàn nhất).\nVí dụ: \"Always follow security best practices by hashing passwords with bcrypt and enabling two-factor authentication.\"",
      "tag": "Quy Chuẩn Nghề Nghiệp"
    },
    {
      "id": 50,
      "front": "Cụm từ: \"Take this offline\" trong cuộc họp nghĩa là gì?",
      "back": "Nghĩa: Thảo luận riêng vấn đề kỹ thuật chi tiết này giữa 2 người sau cuộc họp, tránh làm mất thời gian của tập thể.\nVí dụ: \"This API schema debate is getting very technical; let's take this offline between Linh and Tuan.\"",
      "tag": "Văn Hóa Họp"
    },
    {
      "id": 51,
      "front": "Mô hình STAR trong phỏng vấn tuyển dụng là gì?",
      "back": "Khung chuẩn mực quốc tế trả lời câu hỏi tình huống hành vi (Behavioral Questions):\n• S - Situation: Bối cảnh, tình thế ban đầu.\n• T - Task: Nhiệm vụ, thách thức bạn phải đối mặt.\n• A - Action: Hành động CỤ THỂ mà CHÍNH BẠN đã thực hiện (nhấn mạnh chữ \"I\", không chỉ \"we\").\n• R - Result: Kết quả đạt được (kèm con số % hoặc giá trị đo lường cụ thể).",
      "tag": "Phương Pháp STAR"
    },
    {
      "id": 52,
      "front": "Công thức trả lời câu hỏi kinh điển: \"Tell me about yourself\"?",
      "back": "Áp dụng công thức Hiện tại - Quá khứ - Tương lai (Present - Past - Future):\n1. Present: Vị trí hiện tại, thế mạnh cốt lõi và thành tích nổi bật gần nhất.\n2. Past: Nền tảng học vấn và kinh nghiệm quá khứ đã rèn giũa kỹ năng của bạn ra sao.\n3. Future: Tại sao vị trí này là bước tiến tự nhiên và giá trị bạn sẽ mang lại cho công ty.",
      "tag": "Phỏng Vấn Xin Việc"
    },
    {
      "id": 53,
      "front": "Cách trả lời: \"Why do you want to work for our company?\"?",
      "back": "Quy tắc vàng: Kết nối Sứ mệnh của công ty + Đam mê cá nhân + Sản phẩm cụ thể.\nTránh: Chỉ khen công ty lớn, lương cao.\nVí dụ: \"I admire OnThiHub's mission of democratizing education via 3D interactive flashcards. Having studied using spaced repetition myself, I want to use my software skills to scale this impact to millions of learners.\"",
      "tag": "Phỏng Vấn Tuyển Dụng"
    },
    {
      "id": 54,
      "front": "Cách trả lời: \"What is your greatest strength?\" kèm bằng chứng thuyết phục?",
      "back": "Công thức: Nêu thế mạnh + Đưa ví dụ định lượng minh chứng.\nVí dụ: \"My greatest strength is data-driven problem solving. At my previous role, I noticed high churn during onboarding, so I revamped the UI tutorial, which increased 30-day user retention by 22%.\"",
      "tag": "Phỏng Vấn Xin Việc"
    },
    {
      "id": 55,
      "front": "Cách trả lời bẫy: \"What is your greatest weakness?\" không bị mất điểm?",
      "back": "Quy tắc: Nêu một điểm yếu THẬT nhưng KHÔNG PHẢI KỸ NĂNG CỐT LÕI của công việc, và PHẢI NÊU RÕ BẠN ĐANG TỰ CẢI THIỆN NÓ THẾ NÀO!\nVí dụ: \"Early in my career, I struggled with delegating tasks because I wanted everything perfect. Recently, I took a project management course and started using Notion dashboards to delegate smoothly to team members.\"",
      "tag": "Bẫy Phỏng Vấn"
    },
    {
      "id": 56,
      "front": "STAR Câu hỏi: \"Tell me about a time you handled a conflict with a coworker\"?",
      "back": "• Situation: Bất đồng quan điểm về thiết kế kiến trúc hệ thống.\n• Task: Cần thống nhất giải pháp để kịp deadline sprint mà không làm rạn nứt quan hệ.\n• Action: Chủ động mời bạn đồng nghiệp đi uống cà phê, lắng nghe lập luận của họ với thái độ cầu thị, sau đó cùng làm bài kiểm tra hiệu năng (benchmark) để số liệu khách quan quyết định.\n• Result: Thống nhất được giải pháp tối ưu và mối quan hệ đồng nghiệp trở nên gắn kết hơn.",
      "tag": "Câu Hỏi Hành Vi STAR"
    },
    {
      "id": 57,
      "front": "STAR Câu hỏi: \"Tell me about a time you made a mistake or failed\"?",
      "back": "Công thức ghi điểm: Nhận trách nhiệm 100% -> Khắc phục ngay lập tức -> Rút ra bài học và xây dựng quy trình ngăn ngừa tái diễn.\nTránh: Đổ lỗi cho ngoại cảnh hay đồng nghiệp.",
      "tag": "Tâm Lý & Trách Nhiệm"
    },
    {
      "id": 58,
      "front": "Cách trả lời: \"How do you handle tight deadlines and high stress?\"?",
      "back": "Ví dụ mẫu: \"I stay calm by prioritizing tasks using the Eisenhower Matrix. I separate urgent tasks from important ones, break big milestones into daily sprints, and communicate proactively with stakeholders if any timeline risk emerges.\"",
      "tag": "Kỹ Năng Quản Lý Căng Thẳng"
    },
    {
      "id": 59,
      "front": "Cách trả lời: \"Where do you see yourself in 5 years?\"?",
      "back": "Nhấn mạnh sự phát triển chuyên môn sâu và mong muốn gắn bó lâu dài:\n\"In 5 years, I aim to master fullstack architecture, mentor junior developers, and lead high-impact engineering initiatives within your growing technology division.\"",
      "tag": "Định Hướng Tương Lai"
    },
    {
      "id": 60,
      "front": "Cách trả lời: \"Why are you leaving your current job?\" không nói xấu công ty cũ?",
      "back": "Quy tắc: Luôn hướng về phía trước, tìm kiếm thử thách mới, TUYỆT ĐỐI KHÔNG CHÊ BAI sếp hay công ty cũ.\nMẫu: \"I am very grateful for my time at my current company, where I built strong foundations. However, I am ready for a new challenge that allows me to lead larger-scale cloud architecture projects, which aligns perfectly with this role.\"",
      "tag": "Nghệ Thuật Trả Lời"
    },
    {
      "id": 61,
      "front": "STAR Câu hỏi: \"Tell me about a time you demonstrated leadership without having a manager title\"?",
      "back": "Kể về một tình huống bạn tự giác phát hiện ra vấn đề (ví dụ: quy trình onboarding nhân sự mới lộn xộn), tự nguyện lập tài liệu cẩm nang hướng dẫn (wiki documentation) và giúp 5 bạn nhân viên mới hòa nhập nhanh hơn 50%.",
      "tag": "Tố Chất Lãnh Đạo"
    },
    {
      "id": 62,
      "front": "Cách trả lời: \"How do you receive critical feedback from your supervisor?\"?",
      "back": "Mẫu câu: \"I view constructive criticism as the fastest shortcut to professional growth. Whenever I receive feedback, I listen without being defensive, ask clarifying questions, and immediately create an actionable checklist to improve.\"",
      "tag": "Tinh Thần Cầu Tiến"
    },
    {
      "id": 63,
      "front": "STAR Câu hỏi: \"Describe a time you persuaded a skeptical stakeholder\"?",
      "back": "Nhấn mạnh vào SỐ LIỆU (Data) và BẢN DEMO THỰC TẾ (MVP/Proof of Concept):\n\"Thay vì tranh cãi lý thuyết suông, tôi đã xây dựng một bản nguyên mẫu tương tác 3D trong 2 ngày và mời 10 người dùng thử nghiệm. Dữ liệu thực tế cho thấy sự hài lòng đạt 90%, từ đó thuyết phục hoàn toàn hội đồng quản trị.\"",
      "tag": "Kỹ Năng Thuyết Phục"
    },
    {
      "id": 64,
      "front": "Cách trả lời: \"How do you explain a complex technical concept to a non-technical person?\"?",
      "back": "Bí quyết: Sử dụng PHÉP SO SÁNH / ẨN DỤ (Analogies) gần gũi với đời sống.\nVí dụ: Giải thích API giống như một người phục vụ trong nhà hàng: Bạn (khách hàng) gọi món, người phục vụ (API) mang yêu cầu vào bếp (Server/Database) và bưng đĩa thức ăn trở lại cho bạn.",
      "tag": "Giao Tiếp Kỹ Thuật"
    },
    {
      "id": 65,
      "front": "Ma trận Eisenhower phân loại công việc ưu tiên như thế nào?",
      "back": "• Ô 1: Khẩn cấp & Quan trọng -> Làm ngay lập tức (Do it now).\n• Ô 2: Quan trọng nhưng Không khẩn cấp -> Lên lịch thực hiện (Schedule it - đây là ô tạo ra thành công dài hạn!).\n• Ô 3: Khẩn cấp nhưng Không quan trọng -> Ủy quyền giao việc (Delegate).\n• Ô 4: Không khẩn cấp & Không quan trọng -> Loại bỏ (Eliminate).",
      "tag": "Quản Lý Thời Gian"
    },
    {
      "id": 66,
      "front": "STAR Câu hỏi: \"Tell me about a time you had to adapt to sudden changes\"?",
      "back": "Kể về việc công ty bất ngờ thay đổi yêu cầu công nghệ (chuyển từ một framework cũ sang nền tảng mới) chỉ 2 tuần trước ngày ra mắt: Bạn nhanh chóng học tài liệu mới, giữ bình tĩnh động viên đồng đội và hoàn thành xuất sắc dự án đúng hạn.",
      "tag": "Khả Năng Thích Ứng"
    },
    {
      "id": 67,
      "front": "Cách trả lời: \"What work culture brings out your best performance?\"?",
      "back": "Mẫu câu: \"I thrive in a culture of high ownership, psychological safety, and open feedback. When teams are trusted to solve problems autonomously and celebrate continuous learning, I produce my most innovative work.\"",
      "tag": "Văn Hóa Làm Việc"
    },
    {
      "id": 68,
      "front": "Cách đàm phán mức lương kỳ vọng (\"What are your salary expectations?\") khéo léo?",
      "back": "Mẹo ngoại giao: Nêu một khoảng lương (range) dựa trên nghiên cứu thị trường và nhấn mạnh giá trị tổng thể:\n\"Based on my 3 years of React/Node.js experience and market benchmarks for this seniority, I am targeting between $1,500 and $1,800 gross monthly. However, I am flexible and more focused on the overall growth potential and team fit.\"",
      "tag": "Đàm Phán Lương"
    },
    {
      "id": 69,
      "front": "Câu hỏi số 1 bạn NÊN HỎI NGƯỢC LẠI nhà tuyển dụng ở cuối buổi phỏng vấn?",
      "back": "Câu hỏi đánh giá tiêu chí thành công:\n\"What does success look like in this role during the first 90 days, and what are the most immediate challenges the new hire will tackle?\"",
      "tag": "Câu Hỏi Ngược Nhà Tuyển Dụng"
    },
    {
      "id": 70,
      "front": "Câu hỏi số 2 bạn NÊN HỎI NGƯỢC LẠI nhà tuyển dụng?",
      "back": "Câu hỏi về văn hóa và cơ hội phát triển:\n\"How does the engineering team support continuous learning and mentorship for team members wishing to upskill?\"",
      "tag": "Câu Hỏi Ngược Nhà Tuyển Dụng"
    },
    {
      "id": 71,
      "front": "Câu hỏi số 3 bạn NÊN HỎI NGƯỢC LẠI nhà tuyển dụng?",
      "back": "Câu hỏi về tầm nhìn dài hạn:\n\"What is the company's biggest strategic milestone over the next 12 months, and how does this department contribute to it?\"",
      "tag": "Câu Hỏi Ngược Nhà Tuyển Dụng"
    },
    {
      "id": 72,
      "front": "Công thức viết CV chuẩn Google X-Y-Z formula là gì?",
      "back": "Công thức: \"Accomplished [X], as measured by [Y], by doing [Z]\".\n(Đạt được thành tựu X, được đo lường bằng chỉ số Y, bằng hành động Z).\nVí dụ: \"Boosted daily active users by 35% within 3 months by redesigning the mobile flashcard interface.\"",
      "tag": "Kỹ Năng Viết CV"
    },
    {
      "id": 73,
      "front": "Mẫu thư cảm ơn (Thank-You Email) gửi trong vòng 24 giờ sau buổi phỏng vấn?",
      "back": "Tiêu đề: \"Thank you - [Your Name] - [Position] Interview\"\nNội dung: Cảm ơn vì thời gian quý báu -> Nhắc lại một chi tiết thảo luận thú vị trong buổi phỏng vấn -> Khẳng định lại sự hào hứng và sự phù hợp với vị trí -> Sẵn sàng cung cấp thêm thông tin.",
      "tag": "Email Sau Phỏng Vấn"
    },
    {
      "id": 74,
      "front": "Cách xử lý bình tĩnh khi gặp câu hỏi phỏng vấn hóc búa bạn chưa từng chuẩn bị?",
      "back": "Mẹo ứng biến:\n1. Xin vài giây suy nghĩ: \"That's a very insightful question. May I take a brief moment to structure my thoughts?\"\n2. Trình bày tư duy (thinking out loud) theo từng bước logic, không cần vội vã đưa ra ngay kết luận hoàn hảo.",
      "tag": "Bản Lĩnh Phỏng Vấn"
    },
    {
      "id": 75,
      "front": "Cách hồi đáp khi nhận được thư mời nhận việc (Offer Letter) để xin thêm thời gian suy nghĩ?",
      "back": "Mẫu câu: \"Thank you very much for extending this generous offer! I am genuinely thrilled about the opportunity to join the team. May I have until Monday morning to review the full compensation package and discuss with my family?\"",
      "tag": "Đón Nhận Offer"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Trong email doanh nghiệp, chữ 'COB' trong 'Please reply by 5:00 PM COB' là viết tắt của gì?",
      "options": [
        "A. Close of Business",
        "B. Call on Board",
        "C. Confirmation of Booking",
        "D. Chief of Bureau"
      ],
      "correct": 0,
      "explanation": "COB là viết tắt của Close of Business (hết giờ làm việc, thường là 5:00 hoặc 5:30 chiều)."
    },
    {
      "id": 2,
      "question": "Thuật ngữ 'Touch base' trong câu: 'Let\\'s touch base tomorrow morning' có nghĩa là gì?",
      "options": [
        "A. Chạm vào căn cứ bóng chày",
        "B. Trao đổi ngắn gọn để cập nhật nhanh tiến độ công việc",
        "C. Ký kết hợp đồng dài hạn",
        "D. Nộp báo cáo tài chính cuối năm"
      ],
      "correct": 1,
      "explanation": "Touch base nghĩa là gặp gỡ hoặc gọi điện thoại ngắn để cập nhật tình hình."
    },
    {
      "id": 3,
      "question": "Khi ai đó nói 'I don\\'t have the bandwidth for this project', họ muốn diễn đạt điều gì?",
      "options": [
        "A. Đường truyền internet của họ quá chậm",
        "B. Họ không có đủ thời gian hoặc dung lượng sức lực để nhận thêm việc mới",
        "C. Họ không có tài khoản ngân hàng",
        "D. Máy tính của họ bị hết dung lượng ổ cứng"
      ],
      "correct": 1,
      "explanation": "Bandwidth trong tiếng lóng công sở chỉ quỹ thời gian và năng lượng não bộ để đảm đương công việc."
    },
    {
      "id": 4,
      "question": "Mô hình STAR trong trả lời câu hỏi phỏng vấn hành vi gồm 4 chữ cái viết tắt của:",
      "options": [
        "A. Strategy - Target - Action - Revenue",
        "B. Situation - Task - Action - Result",
        "C. Skill - Talent - Ambition - Reward",
        "D. System - Timing - Analysis - Review"
      ],
      "correct": 1,
      "explanation": "STAR = Situation (Bối cảnh), Task (Nhiệm vụ), Action (Hành động), Result (Kết quả)."
    },
    {
      "id": 5,
      "question": "Phương pháp hiệu quả nhất để trả lời câu hỏi: 'Tell me about yourself' là:",
      "options": [
        "A. Kể toàn bộ tiểu sử từ thời cấp 1 đến nay",
        "B. Đọc lại nguyên văn từng dòng trong bản CV",
        "C. Áp dụng công thức Hiện tại - Quá khứ - Tương lai (Present - Past - Future)",
        "D. Chỉ nói về sở thích cá nhân như xem phim và nghe nhạc"
      ],
      "correct": 2,
      "explanation": "Công thức Present - Past - Future giúp câu trả lời súc tích, mạch lạc và tạo ấn tượng nghề nghiệp sâu sắc."
    },
    {
      "id": 6,
      "question": "Khi một cuộc họp đi chệch chủ đề, người điều phối nói 'Let\\'s table this discussion', nghĩa là gì?",
      "options": [
        "A. Hãy đập bàn để dừng lại",
        "B. Tạm gác chủ đề này lại để tập trung vào mục tiêu chính của cuộc họp",
        "C. Mời mọi người cùng ngồi xuống bàn ăn",
        "D. Biến chủ đề này thành nghị quyết bắt buộc"
      ],
      "correct": 1,
      "explanation": "Table this discussion có nghĩa là tạm hoãn thảo luận chủ đề này lại để bàn sau."
    },
    {
      "id": 7,
      "question": "Thuật ngữ 'Low-hanging fruit' trong kinh doanh chỉ điều gì?",
      "options": [
        "A. Trái cây tươi bán giảm giá",
        "B. Cơ hội dễ nắm bắt, việc dễ làm mang lại kết quả nhanh với ít công sức",
        "C. Những rủi ro tiềm ẩn dưới đáy thị trường",
        "D. Các khoản đầu tư dài hạn có tính rủi ro cao"
      ],
      "correct": 1,
      "explanation": "Low-hanging fruit là những cơ hội dễ xơi, chỉ cần nỗ lực nhỏ là gặt hái kết quả ngay."
    },
    {
      "id": 8,
      "question": "Cách ứng xử chuyên nghiệp nhất khi gặp câu hỏi phỏng vấn hóc búa bạn chưa từng chuẩn bị là:",
      "options": [
        "A. Nói bừa ngay lập tức để không bị khoảng lặng",
        "B. Từ chối trả lời vì không thuộc chuyên môn",
        "C. Lịch sự xin vài giây suy nghĩ và trình bày từng bước tư duy logic thành tiếng",
        "D. Đổi sang chủ đề khác"
      ],
      "correct": 2,
      "explanation": "Xin vài giây suy nghĩ và 'think out loud' thể hiện sự điềm tĩnh và tư duy giải quyết vấn đề có phương pháp."
    },
    {
      "id": 9,
      "question": "Cụm từ nào thích hợp nhất để mở đầu một email công việc trang trọng?",
      "options": [
        "A. Hey what's popping!",
        "B. I hope this email finds you well.",
        "C. Sup dude,",
        "D. Yo,"
      ],
      "correct": 1,
      "explanation": "'I hope this email finds you well' là lời chào mở đầu chuẩn mực và lịch thiệp nhất trong email doanh nghiệp."
    },
    {
      "id": 10,
      "question": "Thời điểm vàng để gửi email cảm ơn (Thank-You Email) sau buổi phỏng vấn xin việc là:",
      "options": [
        "A. Sau 1 tháng",
        "B. Trong vòng 24 giờ kể từ khi kết thúc phỏng vấn",
        "C. Chỉ khi nào có kết quả đỗ mới gửi",
        "D. Không cần thiết gửi"
      ],
      "correct": 1,
      "explanation": "Gửi thư cảm ơn trong vòng 24 giờ thể hiện tính chuyên nghiệp, sự nhiệt huyết và nhắc nhớ ấn tượng đẹp về bạn."
    }
  ]
}
,

  // =========================================================================
  // BỘ 20 THẺ TIẾNG ANH MỚI: TOEIC, IELTS, SAT & NỀN TẢNG (1 - 4 XU)
  // =========================================================================
  {
  "id": "toeic-starter-600-vocab",
  "title": "600 Từ Vựng Cốt Lõi TOEIC Căn Bản (Target 550 - 650+)",
  "subtitle": "Hợp đồng, mua sắm, du lịch, ngân hàng, nhân sự & bảo hành sản phẩm",
  "category": "ngoai-ngu",
  "categoryLabel": "TOEIC Căn Bản",
  "badge": "TOEIC Starter 1 Xu",
  "priceXu": 1,
  "originalPriceXu": 30,
  "rating": 4.97,
  "reviewsCount": 840,
  "studentsCount": 3210,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Bản Đồ 50 Chủ Đề TOEIC",
    "Trắc Nghiệm 5 Câu"
  ],
  "description": "Nắm vững 600 từ vựng cốt lõi thường gặp nhất trong các đề thi TOEIC chuẩn định dạng ETS mới nhất. Kèm ví dụ song ngữ thực chiến và phân biệt bẫy nghĩa công sở.",
  "highlights": [
    "Bao quát 100% từ vựng xuất hiện trong Part 1 đến Part 7 đề thi TOEIC",
    "Đầy đủ phiên âm IPA, từ loại và mẹo phân biệt invoice vs receipt",
    "Mỗi thẻ kèm ví dụ tình huống văn phòng thực tế",
    "Trắc nghiệm củng cố phản xạ tức thì"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "contract /ˈkɒn.trækt/ (noun/verb)",
      "back": "Nghĩa: (n) Hợp đồng, giao kèo pháp lý; (v) Ký hợp đồng; co lại.\nCollocation: Sign a contract (ký hợp đồng), Breach a contract (vi phạm hợp đồng), Renew a contract (gia hạn hợp đồng).\nVí dụ: Both parties agreed to sign the three-year service contract tomorrow.",
      "tag": "TOEIC Hợp Đồng"
    },
    {
      "id": 2,
      "front": "warranty /ˈwɒr.ən.ti/ (noun)",
      "back": "Nghĩa: Giấy bảo hành, cam kết bảo hành sản phẩm.\nCollocation: Under warranty (còn hạn bảo hành), Extended warranty (gói bảo hành mở rộng).\nVí dụ: The laptop comes with a 12-month manufacturer warranty covering all hardware defects.",
      "tag": "TOEIC Mua Sắm"
    },
    {
      "id": 3,
      "front": "invoice /ˈɪn.vɔɪs/ (noun/verb)",
      "back": "Nghĩa: (n) Hóa đơn thanh toán yêu cầu chuyển tiền; (v) Xuất hóa đơn.\nPhân biệt: Invoice (hóa đơn gửi cho khách yêu cầu thanh toán) vs Receipt (biên lai xác nhận đã trả tiền xong).\nVí dụ: Please remit payment within 30 days of receiving the invoice.",
      "tag": "TOEIC Tài Chính"
    },
    {
      "id": 4,
      "front": "itinerary /aɪˈtɪn.ər.ər.i/ (noun)",
      "back": "Nghĩa: Lịch trình chi tiết của chuyến công tác hoặc chuyến du lịch.\nVí dụ: The travel coordinator emailed the flight and hotel itinerary to the executive team.",
      "tag": "TOEIC Du Lịch & Công Tác"
    },
    {
      "id": 5,
      "front": "agenda /əˈdʒen.də/ (noun)",
      "back": "Nghĩa: Chương trình nghị sự, danh sách các chủ đề sẽ thảo luận trong cuộc họp.\nCollocation: On the agenda (nằm trong chương trình họp), Items on the agenda.\nVí dụ: The budget cuts are the primary item on today's meeting agenda.",
      "tag": "TOEIC Cuộc Họp"
    },
    {
      "id": 6,
      "front": "reimburse /ˌriː.ɪmˈbɜːs/ (verb)",
      "back": "Nghĩa: Hoàn tiền, bồi hoàn chi phí công tác cho nhân viên.\nCollocation: Reimburse travel expenses (hoàn trả chi phí đi lại).\nVí dụ: Submit all your taxi receipts so the finance team can reimburse you next Friday.",
      "tag": "TOEIC Chi Phí"
    },
    {
      "id": 7,
      "front": "inventory /ˈɪn.vən.tər.i/ (noun)",
      "back": "Nghĩa: Hàng tồn kho, bảng kiểm kê hàng hóa trong kho.\nCollocation: Take inventory (kiểm kê kho), Out of stock / In stock.\nVí dụ: The supermarket conducts a physical inventory check at the end of each month.",
      "tag": "TOEIC Kho Hàng"
    },
    {
      "id": 8,
      "front": "negotiate /nəˈɡəʊ.ʃi.eɪt/ (verb)",
      "back": "Nghĩa: Đàm phán, thương lượng điều khoản hoặc giá cả.\nDanh từ: Negotiation (cuộc đàm phán).\nVí dụ: The procurement manager negotiated a 15% discount for bulk orders.",
      "tag": "TOEIC Đàm Phán"
    },
    {
      "id": 9,
      "front": "complimentary /ˌkɒm.plɪˈmen.tər.i/ (adj)",
      "back": "Nghĩa: Miễn phí (do khách sạn, công ty tặng kèm dịch vụ).\nCollocation: Complimentary breakfast (bữa sáng miễn phí), Complimentary shuttle bus.\nVí dụ: Guests enjoy complimentary high-speed Wi-Fi and airport pick-up.",
      "tag": "TOEIC Khách Sạn"
    },
    {
      "id": 10,
      "front": "submit /səbˈmɪt/ (verb)",
      "back": "Nghĩa: Nộp, đệ trình hồ sơ, tài liệu hoặc báo cáo.\nCollocation: Submit an application (nộp đơn), Submit a proposal.\nVí dụ: All candidates must submit their resumes prior to the Friday deadline.",
      "tag": "TOEIC Tuyển Dụng"
    },
    {
      "id": 11,
      "front": "candidate /ˈkæn.dɪ.dət/ (noun)",
      "back": "Nghĩa: Ứng viên xin việc hoặc ứng cử viên bầu cử.\nTừ đồng nghĩa: Applicant, Job seeker.\nVí dụ: The hiring committee interviewed five shortlisted candidates for the Senior Designer position.",
      "tag": "TOEIC Nhân Sự"
    },
    {
      "id": 12,
      "front": "annual /ˈæn.ju.əl/ (adj)",
      "back": "Nghĩa: Thường niên, diễn ra mỗi năm một lần (yearly).\nCollocation: Annual general meeting (AGM), Annual financial report.\nVí dụ: The company will hold its annual shareholders meeting in November.",
      "tag": "TOEIC Doanh Nghiệp"
    },
    {
      "id": 13,
      "front": "policy /ˈpɒl.ə.si/ (noun)",
      "back": "Nghĩa: Chính sách, quy định của công ty hoặc chính phủ.\nCollocation: Company policy, Refund policy (chính sách hoàn tiền), Privacy policy.\nVí dụ: Under our new company policy, remote employees receive an ergonomic allowance.",
      "tag": "TOEIC Quy Định"
    },
    {
      "id": 14,
      "front": "notify /ˈnəʊ.tɪ.faɪ/ (verb)",
      "back": "Nghĩa: Thông báo chính thức cho ai biết về sự việc (inform).\nCấu trúc: Notify someone of something.\nVí dụ: Please notify human resources if your residential address changes.",
      "tag": "TOEIC Giao Tiếp"
    },
    {
      "id": 15,
      "front": "eligible /ˈel.ɪ.dʒə.bəl/ (adj)",
      "back": "Nghĩa: Đủ tư cách, đủ điều kiện hưởng quyền lợi.\nCấu trúc: Be eligible for something / Be eligible to do something.\nVí dụ: Full-time employees are eligible for paid sick leave after completing three months of probation.",
      "tag": "TOEIC Chế Độ Phúc Lợi"
    },
    {
      "id": 16,
      "front": "commute /kəˈmjuːt/ (verb/noun)",
      "back": "Nghĩa: Quãng đường hoặc hành động đi lại hàng ngày giữa nhà và nơi làm việc.\nVí dụ: Many office workers commute to District 1 by metro and motorbike.",
      "tag": "TOEIC Đời Sống"
    },
    {
      "id": 17,
      "front": "venue /ˈven.juː/ (noun)",
      "back": "Nghĩa: Địa điểm tổ chức sự kiện, hội thảo hoặc buổi hòa nhạc.\nVí dụ: The Grand Ballroom was selected as the official venue for the tech conference.",
      "tag": "TOEIC Sự Kiện"
    },
    {
      "id": 18,
      "front": "promising /ˈprɒm.ɪ.sɪŋ/ (adj)",
      "back": "Nghĩa: Đầy triển vọng, có tương lai xán lạn (potential, hopeful).\nVí dụ: The trial results show promising signs of revenue growth in Q4.",
      "tag": "TOEIC Đánh Giá"
    },
    {
      "id": 19,
      "front": "feedback /ˈfiːd.bæk/ (noun)",
      "back": "Nghĩa: Ý kiến phản hồi, nhận xét đánh giá của khách hàng hoặc sếp.\nCollocation: Customer feedback, Provide constructive feedback.\nVí dụ: We sent out a survey to collect customer feedback on our mobile checkout experience.",
      "tag": "TOEIC Khách Hàng"
    },
    {
      "id": 20,
      "front": "maintenance /ˈmeɪn.tən.əns/ (noun)",
      "back": "Nghĩa: Sự bảo trì, bảo dưỡng định kỳ thiết bị máy móc hoặc tòa nhà.\nCollocation: Routine maintenance (bảo trì định kỳ).\nVí dụ: The elevators will be temporarily shut down for scheduled maintenance on Sunday.",
      "tag": "TOEIC Tòa Nhà"
    },
    {
      "id": 21,
      "front": "renovation /ˌren.əˈveɪ.ʃən/ (noun)",
      "back": "Nghĩa: Sự cải tạo, nâng cấp sửa chữa tòa nhà, cửa hàng.\nĐộng từ: Renovate /ˈren.ə.veɪt/.\nVí dụ: The hotel lobby is currently closed for renovation until mid-December.",
      "tag": "TOEIC Công Trình"
    },
    {
      "id": 22,
      "front": "specification /ˌspes.ɪ.fɪˈkeɪ.ʃən/ (noun)",
      "back": "Nghĩa: Bản thông số kỹ thuật chi tiết của sản phẩm (thường viết tắt là 'specs').\nVí dụ: The software engineer reviewed the API specifications before writing code.",
      "tag": "TOEIC Kỹ Thuật"
    },
    {
      "id": 23,
      "front": "brochure /ˈbrəʊ.ʃər/ (noun)",
      "back": "Nghĩa: Cuốn sách quảng cáo mỏng, tài liệu giới thiệu sản phẩm/tour du lịch.\nVí dụ: Pick up a travel brochure at the reception desk for detailed tour itineraries.",
      "tag": "TOEIC Tiếp Thị"
    },
    {
      "id": 24,
      "front": "competitor /kəmˈpet.ɪ.tər/ (noun)",
      "back": "Nghĩa: Đối thủ cạnh tranh trực tiếp trên thương trường.\nDanh từ: Competition (sự cạnh tranh), Tính từ: Competitive (giá cả cạnh tranh).\nVí dụ: Our pricing is 10% lower than that of our main competitor.",
      "tag": "TOEIC Kinh Doanh"
    },
    {
      "id": 25,
      "front": "colleague /ˈkɒl.iːɡ/ (noun)",
      "back": "Nghĩa: Bạn đồng nghiệp cùng cơ quan (coworker).\nVí dụ: I collaborated closely with my colleagues in marketing to design the flyers.",
      "tag": "TOEIC Đồng Nghiệp"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Từ nào sau đây mang nghĩa là 'biên lai xác nhận đã trả tiền' trong giao dịch?",
      "options": [
        "A. Invoice",
        "B. Receipt",
        "C. Warranty",
        "D. Itinerary"
      ],
      "correct": 1,
      "explanation": "Receipt là biên lai xác nhận đã thanh toán, còn Invoice là hóa đơn yêu cầu nộp tiền."
    },
    {
      "id": 2,
      "question": "Điền từ thích hợp: 'Hotel guests can enjoy ______ breakfast in the dining lounge every morning.'",
      "options": [
        "A. complimentary",
        "B. eligible",
        "C. maintenance",
        "D. annual"
      ],
      "correct": 0,
      "explanation": "Complimentary nghĩa là miễn phí (tặng kèm theo dịch vụ phòng khách sạn)."
    },
    {
      "id": 3,
      "question": "Cụm 'Be eligible for' mang ý nghĩa là gì?",
      "options": [
        "A. Bị tước quyền",
        "B. Đủ tư cách, đủ điều kiện hưởng quyền lợi",
        "C. Đang trong thời gian bảo hành",
        "D. Cần được bảo trì gấp"
      ],
      "correct": 1,
      "explanation": "Be eligible for/to do sth có nghĩa là đủ điều kiện, đủ tiêu chuẩn hưởng quyền lợi."
    },
    {
      "id": 4,
      "question": "Từ 'Reimburse' trong môi trường công sở mang nghĩa gì?",
      "options": [
        "A. Hoàn tiền bồi hoàn chi phí công tác",
        "B. Trừ lương nhân viên vi phạm",
        "C. Tăng lương định kỳ",
        "D. Ký hợp đồng lao động mới"
      ],
      "correct": 0,
      "explanation": "Reimburse nghĩa là hoàn lại số tiền mà nhân viên đã tự ứng ra trước khi đi công tác."
    },
    {
      "id": 5,
      "question": "Chọn từ đồng nghĩa chính xác nhất của 'Candidate':",
      "options": [
        "A. Applicant",
        "B. Competitor",
        "C. Vendor",
        "D. Supervisor"
      ],
      "correct": 0,
      "explanation": "Candidate = Applicant (người nộp đơn xin việc / ứng viên)."
    }
  ]
},
  {
  "id": "toeic-part5-grammar-hacks",
  "title": "Mẹo & Bẫy Ngữ Pháp Part 5 TOEIC Thực Chiến (Target 750+)",
  "subtitle": "Bẫy từ loại, đại từ phản thân, liên từ vs giới từ, thì và thể truyền khiến",
  "category": "ngoai-ngu",
  "categoryLabel": "TOEIC Part 5 Hacks",
  "badge": "Hot Part 5 2 Xu",
  "priceXu": 2,
  "originalPriceXu": 35,
  "rating": 4.99,
  "reviewsCount": 1420,
  "studentsCount": 5120,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Công Thức 3 Giây Part 5",
    "Trắc Nghiệm Bẫy"
  ],
  "description": "Bẻ khóa 30 câu hỏi Part 5 chỉ trong 10-15 phút. Nắm trọn công thức vị trí từ loại, nhận diện đuôi danh từ chỉ người, đại từ phản thân và bẫy mệnh đề nhượng bộ.",
  "highlights": [
    "Công thức nhận diện từ loại 3 giây không cần dịch nghĩa cả câu",
    "Mẹo phân biệt liên từ vs giới từ: During vs While, In spite of vs Although",
    "Bẫy thể giả định Subjunctive và đảo ngữ câu điều kiện loại 1",
    "Giải thích cặn kẽ từng bẫy người ra đề hay gài"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[Part 5 Bẫy Từ Loại] Vị trí đứng trước danh từ cần chọn từ loại gì?",
      "back": "Trước Danh từ (Noun) thường là: TÍNH TỪ (Adjective) để bổ nghĩa cho danh từ đó!\n📌 Công thức: a/an/the + (Adj) + Noun.\nVí dụ: The company announced an (exceptional / exceptionally) growth rate.\n-> Chọn: exceptional (Adj bổ nghĩa cho danh từ growth rate).",
      "tag": "Part 5 Từ Loại"
    },
    {
      "id": 2,
      "front": "[Part 5 Bẫy Từ Loại] Vị trí giữa Trợ động từ và Động từ chính chọn từ loại gì?",
      "back": "Chọn TRẠNG TỪ (Adverb - đuôi -ly)!\n📌 Công thức: have/has + ADV + V3/ed | be + ADV + V-ing/V3 | can/will + ADV + V-bare.\nVí dụ: The new software has (significantly / significant) improved customer support response times.\n-> Chọn: significantly.",
      "tag": "Part 5 Từ Loại"
    },
    {
      "id": 3,
      "front": "[Part 5 Bẫy Đại Từ] Khi nào bắt buộc chọn Đại từ phản thân (-self / -selves)?",
      "back": "1. Khi Chủ ngữ và Tân ngữ là CÙNG MỘT NGƯỜI (She taught herself to code).\n2. Đi sau giới từ 'by': by himself / by herself = on his/her own (tự mình làm một mình).\n3. Đứng ngay sau chủ ngữ hoặc ở cuối câu để NHẤN MẠNH (The CEO himself attended the seminar).",
      "tag": "Part 5 Đại Từ"
    },
    {
      "id": 4,
      "front": "[Part 5 Bẫy Tính Từ] Phân biệt đuôi -ing vs đuôi -ed của phân từ làm tính từ?",
      "back": "• Phân từ -ing (Active): Mang nghĩa chủ động hoặc chỉ BẢN CHẤT, tính chất của sự vật/sự việc (An interesting book, An exciting match).\n• Phân từ -ed (Passive): Mang nghĩa bị động hoặc chỉ CẢM XÚC của con người bị tác động (I feel bored, The interested clients).",
      "tag": "Part 5 Bẫy Phân Từ"
    },
    {
      "id": 5,
      "front": "[Part 5 Bẫy Liên từ vs Giới từ] Phân biệt During vs While?",
      "back": "• DURING là GIỚI TỪ: Đi với Cụm danh từ (Noun Phrase), KHÔNG đi với mệnh đề (S + V)!\n  Ví dụ: During the presentation (trong suốt buổi thuyết trình).\n• WHILE là LIÊN TỪ: Đi với Mệnh đề (S + V) hoặc V-ing rút gọn.\n  Ví dụ: While the director was speaking...",
      "tag": "Part 5 Liên Từ"
    },
    {
      "id": 6,
      "front": "[Part 5 Bẫy Động từ] Cấu trúc thể truyền khiến Ask / Request / Require / Remind?",
      "back": "📌 Công thức vàng: S + ask / remind / require / advise / expect + O + TO-V.\nVí dụ: The supervisor reminded staff (to lock / locking) all filing cabinets before leaving.\n-> Chọn: to lock.",
      "tag": "Part 5 Động Từ"
    },
    {
      "id": 7,
      "front": "[Part 5 Bẫy Mệnh đề nhượng bộ] Phân biệt In spite of vs Even though trong Part 5?",
      "back": "• Even though / Although + MỆNH ĐỀ (S + V).\n• In spite of / Despite + DANH TỪ / V-ING.\n⚠️ Mẹo Part 5: Nhìn ngay sau chỗ trống: Nếu thấy có động từ chia thì -> Chọn Even though / Although. Nếu chỉ có cụm danh từ trơ trọi -> Chọn Despite.",
      "tag": "Part 5 Mẹo Giải Nhanh"
    },
    {
      "id": 8,
      "front": "[Part 5 Bẫy Giới từ] Phân biệt Prior to vs Previous?",
      "back": "• PRIOR TO là CỤM GIỚI TỪ (= Before): Theo sau là Cụm danh từ hoặc V-ing.\n  Ví dụ: Prior to joining OnThiHub, she worked at Shopee.\n• PREVIOUS là TÍNH TỪ: Đứng trước danh từ để bổ nghĩa (her previous employer).",
      "tag": "Part 5 Bẫy Giới Từ"
    },
    {
      "id": 9,
      "front": "[Part 5 Bẫy Từ vựng đồng nghĩa] Phân biệt Assure vs Ensure vs Insure?",
      "back": "• ASSURE: Cam đoan, trấn an (luôn có Tân ngữ người theo sau: Assure sb that...).\n• ENSURE: Đảm bảo điều gì xảy ra (Ensure that + clause / Ensure safety).\n• INSURE: Mua bảo hiểm phòng rủi ro tài chính (Insure property against fire).",
      "tag": "Part 5 Phân Biệt Cực Hay"
    },
    {
      "id": 10,
      "front": "[Part 5 Bẫy Thì] Dấu hiệu nhận biết thì Hiện tại hoàn thành với \"Since\"?",
      "back": "📌 Công thức vàng: Mệnh đề chính (Present Perfect: have/has + V3) + SINCE + Mốc thời gian / Quá khứ đơn (Past Simple: V2/ed).\nVí dụ: Mr. Long has served as director since the firm (was founded / is founded) in 2020.\n-> Chọn: was founded.",
      "tag": "Part 5 Bẫy Thì"
    },
    {
      "id": 11,
      "front": "[Part 5 Bẫy Từ Loại] Đuôi nào là đuôi Danh từ chỉ Người hay gặp nhất?",
      "back": "Các đuôi chỉ người thường gặp: -er (manager), -or (supervisor), -ant (accountant, applicant, assistant), -ee (employee, attendee).\n⚠️ Chú ý bẫy: Representative (đại diện - là danh từ chỉ người dù đuôi -ive!).",
      "tag": "Part 5 Mẹo Nhớ Nhanh"
    },
    {
      "id": 12,
      "front": "[Part 5 Bẫy Danh từ] Danh từ đếm được số ít có được đứng trơ trọi một mình?",
      "back": "TUYỆT ĐỐI KHÔNG! Danh từ đếm được số ít bắt buộc phải có mạo từ (a/an/the) hoặc tính từ sở hữu (my/his/her/its) đứng trước!\n⚠️ Nếu chỗ trống là vị trí chủ ngữ mà không có a/an/the -> Bắt buộc chọn Danh từ số nhiều (-s/-es) hoặc Danh từ không đếm được.",
      "tag": "Part 5 Bẫy Danh Từ"
    },
    {
      "id": 13,
      "front": "[Part 5 Đảo ngữ] Đảo ngữ điều kiện loại 1 trong thông báo email TOEIC?",
      "back": "Bỏ If -> Thay bằng \"SHOULD\" đứng đầu câu!\n📌 Should + S + V-bare = If + S + V(hiện tại).\nVí dụ: (Should / If) you have any questions, please contact our helpdesk.\n-> Chọn Should (vì không có if đi kèm đảo ngữ trợ động từ).",
      "tag": "Part 5 Đảo Ngữ"
    },
    {
      "id": 14,
      "front": "[Part 5 Bẫy So Sánh] Cấu trúc So sánh kép \"The more..., the more...\"?",
      "back": "📌 The + so sánh hơn + S + V, The + so sánh hơn + S + V.\nVí dụ: The sooner the project is completed, the (higher / highest) the team bonus will be.\n-> Chọn: higher (so sánh hơn song hành).",
      "tag": "Part 5 So Sánh"
    },
    {
      "id": 15,
      "front": "[Part 5 Bẫy Cặp liên từ] Either... or vs Neither... nor vs Both... and?",
      "back": "• Either A OR B (hoặc A hoặc B)\n• Neither A NOR B (không A cũng không B)\n• Both A AND B (cả A và B)\n• Not only A BUT ALSO B (không những A mà còn B)\n⚠️ Đề thi thường cho một vế và bắt tìm từ liên kết ở vế còn lại!",
      "tag": "Part 5 Cặp Liên Từ"
    },
    {
      "id": 16,
      "front": "[Part 5 Bẫy Đại từ quan hệ] Khi nào chọn \"Whose\" trong câu Part 5?",
      "back": "Khi ngay sau chỗ trống là MỘT DANH TỪ KHÔNG CÓ MẠO TỪ (A/AN/THE)!\n📌 Cấu trúc: Noun 1 + WHOSE + Noun 2 + Verb.\nVí dụ: We interviewed the candidate (whose / who) application was submitted first.\n-> Chọn whose (bổ nghĩa sở hữu cho application).",
      "tag": "Part 5 Mệnh Đề Quan Hệ"
    },
    {
      "id": 17,
      "front": "[Part 5 Bẫy Lượng từ] Phân biệt All, Every và Each?",
      "back": "• ALL + Danh từ số nhiều (All employees) hoặc danh từ không đếm được.\n• EVERY / EACH + Danh từ ĐẾM ĐƯỢC SỐ ÍT (Every employee, Each participant) -> Động từ chia số ít!\nVí dụ: Each department (is / are) responsible for its own budget.\n-> Chọn: is.",
      "tag": "Part 5 Lượng Từ"
    },
    {
      "id": 18,
      "front": "[Part 5 Bẫy Phủ định] Cụm \"No longer\" và \"Hardly ever\"?",
      "back": "• No longer = Không còn nữa (The product is no longer in production).\n• Hardly ever = Hầu như không bao giờ (= rarely, seldom).\n⚠️ Tuyệt đối không dùng thêm not/never trong câu đã có no longer hoặc hardly ever.",
      "tag": "Part 5 Phủ Định"
    },
    {
      "id": 19,
      "front": "[Part 5 Bẫy Giới từ đi kèm] Accustomed đi với giới từ gì?",
      "back": "Be accustomed TO + V-ing / Noun (= Be used to V-ing: quen với việc gì).\nVí dụ: New hires quickly became accustomed to using Slack for internal updates.",
      "tag": "Part 5 Giới Từ Cố Định"
    },
    {
      "id": 20,
      "front": "[Part 5 Bẫy Giả định] Cấu trúc Mandative Subjunctive với It is essential that...?",
      "back": "Động từ theo sau luôn ở dạng NGUYÊN MẪU KHÔNG TO (bare infinitive):\n📌 It is essential / vital / imperative that + S + (should) + V-bare.\nVí dụ: It is vital that the auditor (inspect / inspects) all ledger entries.\n-> Chọn: inspect (không thêm 's'!).",
      "tag": "Part 5 Thể Giả Định"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Điền từ thích hợp: 'The engineering team has ______ finished the software update.'",
      "options": [
        "A. successful",
        "B. successfully",
        "C. success",
        "D. succeed"
      ],
      "correct": 1,
      "explanation": "Vị trí giữa trợ động từ 'has' và V3 'finished' cần một TRẠNG TỪ (successfully)."
    },
    {
      "id": 2,
      "question": "Chọn đáp án đúng: '______ the heavy rainfall, the outdoor marketing event proceeded as scheduled.'",
      "options": [
        "A. Although",
        "B. Despite",
        "C. Because",
        "D. Even if"
      ],
      "correct": 1,
      "explanation": "Theo sau là cụm danh từ 'the heavy rainfall' và mang nghĩa nhượng bộ nên chọn Despite."
    },
    {
      "id": 3,
      "question": "Điền từ thích hợp: 'Mr. Long traveled to Singapore on business by ______.'",
      "options": [
        "A. him",
        "B. his",
        "C. himself",
        "D. he"
      ],
      "correct": 2,
      "explanation": "Cụm 'by himself' = tự mình đi / đi một mình."
    },
    {
      "id": 4,
      "question": "Chọn dạng đúng: 'It is essential that each employee ______ the safety protocol.'",
      "options": [
        "A. follow",
        "B. follows",
        "C. followed",
        "D. following"
      ],
      "correct": 0,
      "explanation": "Thể giả định thức: It is essential that + S + V-bare (follow, không thêm 's')."
    },
    {
      "id": 5,
      "question": "Chọn liên từ phù hợp: 'The company will ______ hire a new contractor or promote from within.'",
      "options": [
        "A. neither",
        "B. either",
        "C. both",
        "D. whether"
      ],
      "correct": 1,
      "explanation": "Đi với liên từ 'or' là cặp 'Either... or...' (hoặc cái này hoặc cái kia)."
    }
  ]
},
  {
  "id": "toeic-office-business-800",
  "title": "Từ Vựng Thương Mại & Giao Tiếp Công Sở TOEIC (Target 800+)",
  "subtitle": "Thu mua, tái cấu trúc, đấu thầu, kiểm toán & điều khoản hợp đồng quốc tế",
  "category": "ngoai-ngu",
  "categoryLabel": "TOEIC Thương Mại",
  "badge": "TOEIC Pro 2 Xu",
  "priceXu": 2,
  "originalPriceXu": 38,
  "rating": 4.98,
  "reviewsCount": 960,
  "studentsCount": 3890,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Bộ Thuật Ngữ Thương Mại M&A",
    "Trắc Nghiệm Phản Xạ"
  ],
  "description": "Nâng band điểm TOEIC lên mốc 800-850+ với các từ vựng thương mại quốc tế chuyên sâu: procurement, restructuring, consortium, feasibility study, audit, compliance.",
  "highlights": [
    "Từ vựng then chốt xuất hiện trong các bài đọc kép và đọc ba Part 7",
    "Mẫu câu đàm phán hợp đồng, thanh lý tài sản và báo cáo tài chính",
    "Phân tích ngữ cảnh thực tế tại các tập đoàn đa quốc gia",
    "Kèm bài trắc nghiệm kiểm tra độ nhạy bén thuật ngữ"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "procurement /prəˈkjʊə.mənt/ (noun)",
      "back": "Nghĩa: Hoạt động thu mua nguyên vật liệu, thiết bị và dịch vụ cho doanh nghiệp.\nCollocation: Procurement department (phòng thu mua), Procurement manager.\nVí dụ: The procurement department finalized contracts with three local suppliers.",
      "tag": "TOEIC Thương Mại"
    },
    {
      "id": 2,
      "front": "contingency /kənˈtɪn.dʒən.si/ (noun)",
      "back": "Nghĩa: Phương án dự phòng, tình huống bất ngờ có thể xảy ra.\nCollocation: Contingency plan (kế hoạch dự phòng B), Contingency fund.\nVí dụ: Management developed a contingency plan in case supply chain delays occur.",
      "tag": "TOEIC Quản Trị"
    },
    {
      "id": 3,
      "front": "restructure /ˌriːˈstrʌk.tʃər/ (verb)",
      "back": "Nghĩa: Tái cấu trúc, cải tổ bộ máy nhân sự hoặc tổ chức công ty.\nVí dụ: The corporation restructured its European divisions to reduce overhead costs.",
      "tag": "TOEIC Doanh Nghiệp"
    },
    {
      "id": 4,
      "front": "consortium /kənˈsɔː.ti.əm/ (noun)",
      "back": "Nghĩa: Tập đoàn liên minh, liên danh nhiều công ty cùng thực hiện dự án lớn.\nVí dụ: An international consortium won the bid to build the urban light rail network.",
      "tag": "TOEIC Đấu Thầu"
    },
    {
      "id": 5,
      "front": "liquidate /ˈlɪk.wɪ.deɪt/ (verb)",
      "back": "Nghĩa: Thanh lý tài sản, giải thể doanh nghiệp để trả nợ (thanh khoản).\nVí dụ: The retail chain liquidated its remaining stock before closing all stores.",
      "tag": "TOEIC Tài Chính"
    },
    {
      "id": 6,
      "front": "feasibility /ˌfiː.zəˈbɪl.ə.ti/ (noun)",
      "back": "Nghĩa: Tính khả thi, khả năng thực tế có thể triển khai thành công.\nCollocation: Feasibility study (nghiên cứu khả thi), Feasibility report.\nVí dụ: The board commissioned a feasibility study before greenlighting the plant expansion.",
      "tag": "TOEIC Dự Án"
    },
    {
      "id": 7,
      "front": "subsidiary /səbˈsɪd.i.ə.ri/ (noun)",
      "back": "Nghĩa: Công ty con (do công ty mẹ - parent company nắm giữ trên 50% cổ phần).\nVí dụ: The technology giant established a software subsidiary in Ho Chi Minh City.",
      "tag": "TOEIC Doanh Nghiệp"
    },
    {
      "id": 8,
      "front": "lucrative /ˈluː.krə.tɪv/ (adj)",
      "back": "Nghĩa: Sinh lời lớn, bội thu lợi nhuận (profitable).\nCollocation: Lucrative contract, Lucrative investment.\nVí dụ: Securing the airport catering deal proved to be an extremely lucrative move.",
      "tag": "TOEIC Đầu Tư"
    },
    {
      "id": 9,
      "front": "benchmark /ˈbentʃ.mɑːk/ (noun/verb)",
      "back": "Nghĩa: Tiêu chuẩn chuẩn mực để so sánh đối chiếu hiệu suất hoạt động.\nVí dụ: Our quarterly conversion rate serves as an industry benchmark for e-commerce apps.",
      "tag": "TOEIC Đo Lường"
    },
    {
      "id": 10,
      "front": "audit /ˈɔː.dɪt/ (noun/verb)",
      "back": "Nghĩa: (n) Cuộc kiểm toán sổ sách tài chính; (v) Kiểm toán, rà soát sổ sách.\nVí dụ: Independent accounting firms perform an annual financial audit for all publicly traded firms.",
      "tag": "TOEIC Kế Toán"
    },
    {
      "id": 11,
      "front": "compliance /kəmˈplaɪ.əns/ (noun)",
      "back": "Nghĩa: Sự tuân thủ luật pháp, quy chuẩn an toàn và chính sách.\nCollocation: In compliance with (tuân thủ theo...), Regulatory compliance.\nVí dụ: The factory upgraded its filtration system in compliance with environmental standards.",
      "tag": "TOEIC Pháp Lý"
    },
    {
      "id": 12,
      "front": "discrepancy /dɪˈskrep.ən.si/ (noun)",
      "back": "Nghĩa: Sự sai lệch, khác biệt bất thường giữa hai số liệu hoặc tài liệu.\nVí dụ: An internal review discovered a minor discrepancy between invoices and physical inventory.",
      "tag": "TOEIC Báo Cáo"
    },
    {
      "id": 13,
      "front": "indemnify /ɪnˈdem.nɪ.faɪ/ (verb)",
      "back": "Nghĩa: Bồi thường thiệt hại, cam kết bảo vệ ai khỏi trách nhiệm pháp lý.\nVí dụ: The insurance policy will indemnify the shipping company against cargo loss.",
      "tag": "TOEIC Bảo Hiểm & Pháp Luật"
    },
    {
      "id": 14,
      "front": "clause /klɔːz/ (noun)",
      "back": "Nghĩa: Điều khoản trong hợp đồng kinh tế hoặc văn bản pháp lý.\nCollocation: Penalty clause (điều khoản phạt), Confidentiality clause (điều khoản bảo mật).\nVí dụ: Clause 4 outlines the penalties for premature termination of the lease.",
      "tag": "TOEIC Hợp Đồng"
    },
    {
      "id": 15,
      "front": "turnover /ˈtɜːnˌəʊ.vər/ (noun)",
      "back": "Nghĩa: 1. Doanh thu bán hàng; 2. Tỷ lệ nhân viên luân chuyển / nghỉ việc (employee turnover).\nVí dụ: High employee turnover significantly increases hiring and training expenses.",
      "tag": "TOEIC Nhân Sự & Doanh Số"
    },
    {
      "id": 16,
      "front": "streamline /ˈstriːm.laɪn/ (verb)",
      "back": "Nghĩa: Tinh giản, hợp lý hóa quy trình để giảm thiểu thời gian và chi phí thừa.\nVí dụ: Automating invoice processing helped streamline our accounts payable workflow.",
      "tag": "TOEIC Vận Hành"
    },
    {
      "id": 17,
      "front": "stipulate /ˈstɪp.jə.leɪt/ (verb)",
      "back": "Nghĩa: Quy định rõ, đặt điều kiện bắt buộc trong văn bản hợp đồng.\nVí dụ: The contract stipulates that deliveries must arrive within three business days.",
      "tag": "TOEIC Hợp Đồng"
    },
    {
      "id": 18,
      "front": "retention /rɪˈten.ʃən/ (noun)",
      "back": "Nghĩa: Sự duy trì, giữ chân khách hàng hoặc nhân viên gắn bó lâu dài.\nCollocation: Customer retention rate, Staff retention strategies.\nVí dụ: Improving employee benefits led to a 20% boost in talent retention.",
      "tag": "TOEIC Chiến Lược"
    },
    {
      "id": 19,
      "front": "dividend /ˈdɪv.ɪ.dend/ (noun)",
      "back": "Nghĩa: Cổ tức (tiền lợi nhuận chia cho các cổ đông nắm giữ cổ phiếu).\nVí dụ: Shareholders approved a quarterly dividend payout of $0.50 per share.",
      "tag": "TOEIC Chứng Khoán"
    },
    {
      "id": 20,
      "front": "preliminary /prɪˈlɪm.ɪ.nər.i/ (adj)",
      "back": "Nghĩa: Sơ bộ, ban đầu trước khi có kết luận chính thức.\nCollocation: Preliminary findings, Preliminary draft, Preliminary interview.\nVí dụ: Preliminary sales figures indicate a substantial uptick in digital subscriptions.",
      "tag": "TOEIC Báo Cáo"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Từ nào chỉ 'công ty con mà công ty mẹ nắm giữ trên 50% cổ phần'?",
      "options": [
        "A. Consortium",
        "B. Subsidiary",
        "C. Discrepancy",
        "D. Clause"
      ],
      "correct": 1,
      "explanation": "Subsidiary là công ty con của một tập đoàn mẹ (parent company)."
    },
    {
      "id": 2,
      "question": "Cụm 'In compliance with' đồng nghĩa với cụm nào?",
      "options": [
        "A. In violation of",
        "B. In accordance with",
        "C. Regardless of",
        "D. In contrast to"
      ],
      "correct": 1,
      "explanation": "In compliance with = In accordance with (tuân theo, phù hợp với quy định)."
    },
    {
      "id": 3,
      "question": "'Discrepancy' trong báo cáo tài chính nghĩa là gì?",
      "options": [
        "A. Sự sai lệch bất thường giữa các số liệu",
        "B. Khoản lợi nhuận vượt mức",
        "C. Hợp đồng mua bán độc quyền",
        "D. Thuế thu nhập doanh nghiệp"
      ],
      "correct": 0,
      "explanation": "Discrepancy chỉ sự khác biệt, chênh lệch không khớp giữa các chứng từ hoặc số liệu."
    },
    {
      "id": 4,
      "question": "Từ nào sau đây mang nghĩa là 'kế hoạch dự phòng'?",
      "options": [
        "A. Feasibility plan",
        "B. Contingency plan",
        "C. Turnover plan",
        "D. Procurement plan"
      ],
      "correct": 1,
      "explanation": "Contingency plan là kế hoạch dự phòng cho các tình huống bất ngờ phát sinh."
    },
    {
      "id": 5,
      "question": "'Dividend' là thuật ngữ chỉ khoản tiền nào trong công ty cổ phần?",
      "options": [
        "A. Tiền phạt vi phạm hợp đồng",
        "B. Cổ tức trả cho cổ đông",
        "C. Tiền bồi hoàn công tác",
        "D. Phí kiểm toán hàng năm"
      ],
      "correct": 1,
      "explanation": "Dividend là cổ tức, phần lợi nhuận sau thuế chia cho các cổ đông."
    }
  ]
},
  {
  "id": "toeic-listening-part1-photos",
  "title": "Bẫy Nghe & Từ Vựng Part 1 Tranh Ảnh TOEIC",
  "subtitle": "Hành động người vs trạng thái vật, giới từ vị trí, âm câm & từ đồng âm bẫy",
  "category": "ngoai-ngu",
  "categoryLabel": "TOEIC Part 1 Luyện Nghe",
  "badge": "Ẵm Trọn 6/6 Câu 1 Xu",
  "priceXu": 1,
  "originalPriceXu": 25,
  "rating": 4.96,
  "reviewsCount": 1150,
  "studentsCount": 4670,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Hình Ảnh Minh Họa 3D",
    "Trắc Nghiệm Bẫy Nghe"
  ],
  "description": "Ăn trọn điểm 6/6 câu Part 1 tranh ảnh. Nắm rõ bẫy 'putting on vs wearing', bẫy 'being + V3' trong tranh vật, các từ có âm câm (aisle, fasten) và từ vựng công trường.",
  "highlights": [
    "Quy tắc sống còn phân biệt trạng thái vật vs hành động người",
    "Từ vựng đặc thù tranh: wheelbarrow, scaffolding, pier, counter, patron",
    "Bẫy từ phát âm tương tự (walking vs working, planting vs painting)",
    "Trắc nghiệm hình ảnh bám sát đề thi thật"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[Part 1 Tranh Người] Phân biệt \"Wearing\" vs \"Putting on\"?",
      "back": "• WEARING: Chỉ TRẠNG THÁI đang mặc sẵn đồ trên người (kính, áo khoác, găng tay).\n• PUTTING ON: Chỉ HÀNH ĐỘNG đang đưa tay xỏ vào áo, đội mũ hoặc đeo kính (đang cử động).\n⚠️ Bẫy kinh điển: Nếu tranh thấy người đàn ông đã đội mũ sẵn -> Câu có 'He is putting on a hat' là SAI!",
      "tag": "Part 1 Bẫy Hành Động"
    },
    {
      "id": 2,
      "front": "[Part 1 Tranh Vật] Cấu trúc Bị động tiếp diễn \"Being + V3\" có bẫy gì?",
      "back": "⚠️ QUY TẮC SỐNG CÒN: Cấu trúc \"is/are BEING + V3/ed\" CHỈ ĐÚNG khi CÓ NGƯỜI ĐANG TRỰC TIẾP TÁC ĐỘNG vào vật!\nVí dụ: Tranh chỉ có ô tô đỗ bên lề đường (không có người sửa):\n• 'The car is being repaired' -> SAI HOÀN TOÀN!\n• 'The car is parked by the curb' -> ĐÚNG.",
      "tag": "Part 1 Quy Tắc Vàng"
    },
    {
      "id": 3,
      "front": "[Part 1 Từ Vựng Tranh] \"Pedestrian\" và \"Crosswalk\" trong tranh giao thông?",
      "back": "• PEDESTRIAN /pəˈdes.tri.ən/: Người đi bộ trên phố.\n• CROSSWALK /ˈkrɒs.wɔːk/: Vạch kẻ đường dành cho người đi bộ qua đường (vạch ngựa vằn).\nVí dụ câu đúng: Pedestrians are crossing the street at the crosswalk.",
      "tag": "Part 1 Giao Thông"
    },
    {
      "id": 4,
      "front": "[Part 1 Từ Vựng Tranh] \"Curb\" và \"Pavement / Sidewalk\"?",
      "back": "• CURB /kɜːb/: Gờ mép vỉa hè (ranh giới giữa lòng đường và vỉa hè).\n• SIDEWALK / PAVEMENT: Lòng vỉa hè cho người đi bộ.\nVí dụ: Vehicles are parked along the curb.",
      "tag": "Part 1 Đường Phố"
    },
    {
      "id": 5,
      "front": "[Part 1 Động từ vị trí] \"Lean against\" vs \"Lean over\"?",
      "back": "• LEAN AGAINST: Tựa vào, dựa người/vật vào tường hoặc lan can.\n  Ví dụ: Bicycles are leaning against the brick wall.\n• LEAN OVER: Cúi người, nghiêng người về phía trước (ví dụ cúi qua lan can hoặc bàn làm việc).\n  Ví dụ: An architect is leaning over a drafting blueprint.",
      "tag": "Part 1 Tư Thế"
    },
    {
      "id": 6,
      "front": "[Part 1 Từ Vựng Tranh] \"Wheelbarrow\" và \"Lawnmower\" trong tranh công trường / làm vườn?",
      "back": "• WHEELBARROW /ˈwiːlˌbær.əʊ/: Xe rùa một bánh đẩy cát sỏi ở công trình.\n• LAWNMOWER /ˈlɔːnˌməʊ.ər/: Máy cắt cỏ đẩy tay.\nVí dụ: A worker is pushing a wheelbarrow filled with gravel.",
      "tag": "Part 1 Công Trường & Vườn"
    },
    {
      "id": 7,
      "front": "[Part 1 Bẫy Đồ Gia Dụng] \"Cabinet\", \"Counter\" và \"Appliance\"?",
      "back": "• CABINET /ˈkæb.ɪ.nət/: Tủ có ngăn kéo hoặc cánh mở (tủ bếp, tủ hồ sơ).\n• COUNTER /ˈkaʊn.tər/: Mặt bàn quầy bar, quầy thu ngân hoặc quầy bếp phẳng.\n• APPLIANCE /əˈplaɪ.əns/: Thiết bị điện gia dụng (tủ lạnh, lò vi sóng, máy giặt).\nVí dụ: Dishes are arranged neatly on the kitchen counter.",
      "tag": "Part 1 Nhà Bếp & Văn Phòng"
    },
    {
      "id": 8,
      "front": "[Part 1 Tranh Kho Hàng] \"Merchandise\", \"Cart\" và \"Aisle\"?",
      "back": "• MERCHANDISE /ˈmɜː.tʃən.daɪs/: Hàng hóa trưng bày để bán (danh từ không đếm được).\n• CART /kɑːt/: Xe đẩy hàng siêu thị.\n• AISLE /aɪl/ (chữ 's' câm!): Lối đi giữa hai dãy kệ hàng.\nVí dụ: A customer is pushing a cart down the grocery aisle.",
      "tag": "Part 1 Siêu Thị"
    },
    {
      "id": 9,
      "front": "[Part 1 Tranh Văn Phòng] \"Stapler\" và \"Filing cabinet\"?",
      "back": "• STAPLER /ˈsteɪ.plər/: Cái dập ghim giấy.\n• FILING CABINET /ˈfaɪ.lɪŋ ˌkæb.ɪ.nət/: Tủ tài liệu nhiều ngăn kéo.\nVí dụ: Documents are stacked next to a stapler on the desk.",
      "tag": "Part 1 Văn Phòng"
    },
    {
      "id": 10,
      "front": "[Part 1 Cụm từ thường gặp] \"Be arranged in a row\" và \"Be stacked\"?",
      "back": "• BE ARRANGED IN A ROW: Được xếp ngay ngắn thành một hàng dài.\n  Ví dụ: Chairs have been arranged in neat rows facing the stage.\n• BE STACKED / PILED: Được chất chồng lên nhau thành đống.\n  Ví dụ: Cardboard boxes are stacked on top of one another.",
      "tag": "Part 1 Sắp Đặt Đồ Đạc"
    },
    {
      "id": 11,
      "front": "[Part 1 Tranh Nhà Hàng] \"Patron\" và \"Dine\"?",
      "back": "• PATRON /ˈpeɪ.trən/: Khách quen, khách ăn uống hoặc khách mua sắm (customer).\n• DINE /daɪn/: Ăn uống tại nhà hàng (Dining area = khu vực ăn).\nVí dụ: Patrons are dining at an outdoor patio cafe.",
      "tag": "Part 1 Nhà Hàng"
    },
    {
      "id": 12,
      "front": "[Part 1 Tranh Bến Cảng] \"Pier / Dock\" và \"Be moored / tied up\"?",
      "back": "• PIER / DOCK: Cầu tàu, bến cảng nơi tàu thuyền cập bờ.\n• BE MOORED / TIED UP: Thuyền được neo đậu, buộc dây cố định vào cầu tàu.\nVí dụ: Several yachts are moored along the pier.",
      "tag": "Part 1 Cảng Biển"
    },
    {
      "id": 13,
      "front": "[Part 1 Cử động mắt] \"Gaze at\" vs \"Glance at\" vs \"Stare at\"?",
      "back": "• GAZE AT: Nhìn chăm chú, ngắm nhìn ngưỡng mộ một cảnh vật hoặc bức tranh.\n• GLANCE AT: Liếc nhìn nhanh qua đồng hồ hoặc tài liệu.\n• INSPECT / EXAMINE: Xem xét, soi kỹ từng chi tiết của sản phẩm.",
      "tag": "Part 1 Ánh Nhìn"
    },
    {
      "id": 14,
      "front": "[Part 1 Tranh Công Cộng] \"Fountain\" và \"Lamppost\"?",
      "back": "• FOUNTAIN /ˈfaʊn.tɪn/: Đài phun nước công viên.\n• LAMPPOST /ˈlæmp.pəʊst/: Cột đèn chiếu sáng đường phố.\nVí dụ: Water is spraying from the central park fountain.",
      "tag": "Part 1 Công Viên"
    },
    {
      "id": 15,
      "front": "[Part 1 Cây cối] \"Overlook\" và \"Cast a shadow\"?",
      "back": "• OVERLOOK: Có hướng nhìn nhìn thẳng ra biển, hồ hoặc quảng trường.\n  Ví dụ: The balcony overlooks a scenic garden.\n• CAST A SHADOW: Đổ bóng xuống mặt đất.\n  Ví dụ: Tall palm trees are casting shadows across the patio pavement.",
      "tag": "Part 1 Cảnh Quan"
    },
    {
      "id": 16,
      "front": "[Part 1 Bẫy Âm thanh] Cặp từ phát âm tương tự dễ gây bẫy (Homophones)?",
      "back": "Các bẫy nghe tương tự hay gặp trong Part 1:\n• Walking (đi bộ) vs Working (làm việc)\n• Planting (trồng cây) vs Painting (sơn vẽ)\n• Boarding (lên tàu/máy bay) vs Boating (chèo thuyền)\n• Typing (gõ phím) vs Tying (buộc dây giày)",
      "tag": "Part 1 Bẫy Phát Âm"
    },
    {
      "id": 17,
      "front": "[Part 1 Tranh Thao Tác] \"Fold\" vs \"Unfold\"?",
      "back": "• FOLD /fəʊld/: Gập lại, xếp gọn (gập ô dù, gập bản đồ, gập ghế xếp).\n• UNFOLD /ʌnˈfəʊld/: Mở ra, giương ra.\nVí dụ: A vendor is unfolding a large sun umbrella.",
      "tag": "Part 1 Thao Tác"
    },
    {
      "id": 18,
      "front": "[Part 1 Tranh Mặc Đồ] \"Fasten\" và \"Button\"?",
      "back": "• FASTEN /ˈfɑː.sən/ (chữ 't' câm!): Thắt chặt, cài dây an toàn (Fasten seatbelts).\n• BUTTON /ˈbʌt.ən/: Cài cúc áo sơ mi hoặc áo khoác.\nVí dụ: A passenger is fastening his seatbelt before takeoff.",
      "tag": "Part 1 Thao Tác Thường Gặp"
    },
    {
      "id": 19,
      "front": "[Part 1 Tranh Tàu Xe] \"Board\" vs \"Disembark\"?",
      "back": "• BOARD: Bước lên tàu, máy bay, xe buýt.\n• DISEMBARK / GET OFF: Bước xuống khỏi tàu thuyền, phi cơ.\nVí dụ: Commuters are boarding the morning commuter train.",
      "tag": "Part 1 Phương Tiện"
    },
    {
      "id": 20,
      "front": "[Part 1 Tranh Xây Dựng] \"Scaffolding\" và \"Protective gear\"?",
      "back": "• SCAFFOLDING /ˈskæf.əl.dɪŋ/: Giàn giáo kim loại bao quanh công trình xây dựng.\n• PROTECTIVE GEAR (Hard hat, safety vest): Mũ bảo hộ, áo phản quang của công nhân.\nVí dụ: Construction workers are standing on the metal scaffolding wearing hard hats.",
      "tag": "Part 1 Xây Dựng"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Trong Part 1 TOEIC, nếu tranh vẽ một người phụ nữ ĐÃ ĐỘI NÓN SẴN trên đầu thì câu nào SAI?",
      "options": [
        "A. She is wearing a sun hat.",
        "B. She is putting on a sun hat.",
        "C. A hat is on her head.",
        "D. She is standing outdoors."
      ],
      "correct": 1,
      "explanation": "Putting on diễn tả HÀNH ĐỘNG đang đưa tay đội mũ, còn đội sẵn rồi là trạng thái WEARING."
    },
    {
      "id": 2,
      "question": "Cấu trúc 'The merchandise is being displayed' chỉ ĐÚNG khi nào?",
      "options": [
        "A. Hàng hóa nằm yên trên kệ không có ai",
        "B. Có nhân viên đang trực tiếp cầm hàng hóa bày biện lên kệ",
        "C. Cửa hàng đã đóng cửa tắt đèn",
        "D. Khách hàng đang thanh toán tiền"
      ],
      "correct": 1,
      "explanation": "Dạng 'being + V3' trong tranh vật yêu cầu phải CÓ NGƯỜI đang trực tiếp thao tác vào vật đó."
    },
    {
      "id": 3,
      "question": "Từ 'Pedestrian' trong bài thi nghe TOEIC có nghĩa là gì?",
      "options": [
        "A. Tài xế lái xe tải",
        "B. Người đi bộ trên đường",
        "C. Cảnh sát giao thông",
        "D. Nhân viên kiểm vé"
      ],
      "correct": 1,
      "explanation": "Pedestrian là người đi bộ."
    },
    {
      "id": 4,
      "question": "Từ nào sau đây có phát âm chữ cái bị câm (Silent letter)?",
      "options": [
        "A. Aisle (chữ 's' câm)",
        "B. Fasten (chữ 't' câm)",
        "C. Cả A và B đều đúng",
        "D. Không có từ nào"
      ],
      "correct": 2,
      "explanation": "Aisle phát âm là /aɪl/ (s câm), và Fasten phát âm là /ˈfɑː.sən/ (t câm)."
    },
    {
      "id": 5,
      "question": "'Scaffolding' là đồ vật gì xuất hiện trong tranh công trường?",
      "options": [
        "A. Xe ủi đất",
        "B. Giàn giáo xây dựng",
        "C. Thùng rác công cộng",
        "D. Cột đèn giao thông"
      ],
      "correct": 1,
      "explanation": "Scaffolding là giàn giáo kim loại dùng cho thợ xây dựng thi công trên cao."
    }
  ]
},
  {
  "id": "toeic-part7-paraphrasing",
  "title": "Tuyệt Chiêu Paraphrasing & Từ Đồng Nghĩa Đọc Hiểu Part 7",
  "subtitle": "Cặp từ chuyển đổi hay gặp nhất trong email, bài báo, thông báo & lịch trình",
  "category": "ngoai-ngu",
  "categoryLabel": "TOEIC Part 7 Đọc Hiểu",
  "badge": "Paraphrase Vàng 2 Xu",
  "priceXu": 2,
  "originalPriceXu": 36,
  "rating": 4.98,
  "reviewsCount": 1310,
  "studentsCount": 4920,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Bảng Tra Paraphrase Part 7",
    "Trắc Nghiệm Paraphrase"
  ],
  "description": "Chìa khóa chinh phục 54 câu đọc hiểu Part 7 là kỹ năng nhận diện Paraphrase. Nắm ngay 20 cặp chuyển đổi từ vựng kinh điển giữa đoạn văn và đáp án trắc nghiệm.",
  "highlights": [
    "20 Cặp paraphrase xuất hiện trong 90% bài đọc TOEIC",
    "Kỹ thuật dùng danh từ bao quát (Superordinate nouns) để giải nhanh",
    "Mẹo định vị thông tin trong đoạn kép và đoạn ba không cần đọc hết bài",
    "Trắc nghiệm đối chiếu từ đồng nghĩa chuẩn xác"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[Paraphrase Part 7] \"Postpone / Delay\" thường được paraphrase thành gì trong câu hỏi?",
      "back": "Cặp Paraphrase kinh điển:\n• Postpone / Delay -> PUT OFF / PUSH BACK / RESCHEDULE / MOVE TO A LATER DATE.\nVí dụ bài đọc: \"The training workshop was postponed.\" -> Đáp án đúng: \"It was pushed back to next month.\"",
      "tag": "Paraphrase Lịch Trình"
    },
    {
      "id": 2,
      "front": "[Paraphrase Part 7] \"Complimentary / Free of charge\" được chuyển đổi thành gì?",
      "back": "Cặp Paraphrase:\n• Complimentary / Free of charge -> AT NO ADDITIONAL COST / COURTESY OF / WITHOUT CHARGE.\nVí dụ: \"Wi-Fi is complimentary for guests\" -> \"Internet is provided at no extra cost.\"",
      "tag": "Paraphrase Chi Phí"
    },
    {
      "id": 3,
      "front": "[Paraphrase Part 7] \"Notify / Inform\" được đổi thành gì?",
      "back": "Cặp Paraphrase:\n• Notify / Inform -> LET SB KNOW / ALERT / MAKE AWARE OF / SEND WORD.\nVí dụ: \"Tenants were notified about the water shutoff\" -> \"Residents were informed in advance.\"",
      "tag": "Paraphrase Thông Báo"
    },
    {
      "id": 4,
      "front": "[Paraphrase Part 7] \"Submit / Turn in\" được chuyển đổi thành gì?",
      "back": "Cặp Paraphrase:\n• Submit / Turn in -> FORWARD / HAND IN / SEND IN / TRANSMIT.\nVí dụ bài đọc: \"Submit your receipts to HR\" -> Đáp án: \"Forward documentation to human resources.\"",
      "tag": "Paraphrase Thủ Tục"
    },
    {
      "id": 5,
      "front": "[Paraphrase Part 7] \"Renovate / Remodel\" được đổi thành gì?",
      "back": "Cặp Paraphrase:\n• Renovate / Remodel / Refurbish -> UPGRADE / MODERNIZE / RESTORE / OVERHAUL.\nVí dụ: \"The cafeteria was renovated\" -> \"Dining facilities were upgraded.\"",
      "tag": "Paraphrase Cơ Sở Vật Chất"
    },
    {
      "id": 6,
      "front": "[Paraphrase Part 7] \"Special discount / Sale\" chuyển thành gì?",
      "back": "Cặp Paraphrase:\n• Discount / On sale -> REDUCED PRICE / PROMOTIONAL RATE / SPECIAL OFFER / MARKDOWN.\nVí dụ: \"Subscribers receive a 20% discount\" -> \"Members get a promotional rate.\"",
      "tag": "Paraphrase Khuyến Mãi"
    },
    {
      "id": 7,
      "front": "[Paraphrase Part 7] \"Cancel a reservation / Call off\" chuyển thành gì?",
      "back": "Cặp Paraphrase:\n• Cancel a booking -> VOID A RESERVATION / DROP / CALL OFF / WITHDRAW.\nVí dụ: \"She cancelled her flight ticket\" -> \"She called off her travel arrangements.\"",
      "tag": "Paraphrase Đặt Chỗ"
    },
    {
      "id": 8,
      "front": "[Paraphrase Part 7] \"Equipment / Machine\" chuyển thành từ khái quát nào?",
      "back": "Kỹ thuật dùng Danh từ cấp cao bao quát (Superordinate):\n• Printer / Laptop / Scanner -> OFFICE APPARATUS / HARDWARE / ELECTRONIC EQUIPMENT.\n• Forklift / Drill -> MACHINERY / INDUSTRIAL TOOLS.",
      "tag": "Kỹ Thuật Bao Quát"
    },
    {
      "id": 9,
      "front": "[Paraphrase Part 7] \"Job opening / Vacancy\" chuyển thành gì?",
      "back": "Cặp Paraphrase tuyển dụng:\n• Job opening / Vacancy -> AVAILABLE POSITION / UNFILLED ROLE / CAREER OPPORTUNITY.\nVí dụ: \"We have three vacancies in sales\" -> \"There are open positions available.\"",
      "tag": "Paraphrase Tuyển Dụng"
    },
    {
      "id": 10,
      "front": "[Paraphrase Part 7] \"Acquire / Take over a company\" chuyển thành gì?",
      "back": "Cặp Paraphrase kinh doanh:\n• Acquire / Take over -> BUY OUT / PURCHASE / MERGE WITH.\nVí dụ: \"TechCorp acquired StarMobile\" -> \"A buyout occurred in the telecom sector.\"",
      "tag": "Paraphrase M&A"
    },
    {
      "id": 11,
      "front": "[Paraphrase Part 7] \"Defective / Damaged\" chuyển thành gì?",
      "back": "Cặp Paraphrase chất lượng:\n• Defective / Damaged / Flawed -> FAULTY / SUBSTANDARD / MALFUNCTIONING / BROKEN.\nVí dụ: \"The monitor had a defective screen\" -> \"The device was faulty upon arrival.\"",
      "tag": "Paraphrase Lỗi Hàng Hóa"
    },
    {
      "id": 12,
      "front": "[Paraphrase Part 7] \"Oversee / Supervise\" chuyển thành gì?",
      "back": "Cặp Paraphrase quản lý:\n• Oversee / Supervise / Manage -> BE IN CHARGE OF / DIRECT / HEAD UP / TAKE THE HELM.\nVí dụ: \"He oversees quality control\" -> \"He is in charge of inspection standards.\"",
      "tag": "Paraphrase Quản Lý"
    },
    {
      "id": 13,
      "front": "[Paraphrase Part 7] \"Inquire / Question\" chuyển thành gì?",
      "back": "Cặp Paraphrase hỏi han:\n• Inquire / Ask for details -> REQUEST INFORMATION / SEEK CLARIFICATION / REACH OUT ABOUT.\nVí dụ: \"She inquired about ticket prices\" -> \"She sought details regarding admission costs.\"",
      "tag": "Paraphrase Giao Tiếp"
    },
    {
      "id": 14,
      "front": "[Paraphrase Part 7] \"Commence / Kick off\" chuyển thành gì?",
      "back": "Cặp Paraphrase thời gian bắt đầu:\n• Commence / Kick off / Initiate -> BEGIN / START / LAUNCH / GET UNDERWAY.\nVí dụ: \"Construction commences in July\" -> \"Work will get underway in the summer.\"",
      "tag": "Paraphrase Khởi Động"
    },
    {
      "id": 15,
      "front": "[Paraphrase Part 7] \"Terminate / End a lease\" chuyển thành gì?",
      "back": "Cặp Paraphrase chấm dứt:\n• Terminate / End / Conclude -> CANCEL / BRING TO A CLOSE / WIND DOWN / EXPIRE.\nVí dụ: \"The lease was terminated early\" -> \"The rental agreement was cancelled ahead of schedule.\"",
      "tag": "Paraphrase Hợp Đồng"
    },
    {
      "id": 16,
      "front": "[Paraphrase Part 7] \"Venue / Location\" chuyển thành gì?",
      "back": "Cặp Paraphrase địa điểm:\n• Venue / Location -> SITE / PREMISES / PLACE OF THE EVENT / HOST FACILITY.\nVí dụ: \"The concert venue changed\" -> \"The performance will take place at an alternative site.\"",
      "tag": "Paraphrase Địa Điểm"
    },
    {
      "id": 17,
      "front": "[Paraphrase Part 7] \"Certificate / Credential\" chuyển thành gì?",
      "back": "Cặp Paraphrase chứng chỉ:\n• Certificate / Credentials / License -> QUALIFICATIONS / FORMAL ACCREDITATION / CERTIFICATION.\nVí dụ: \"Candidates must hold a PMP certificate\" -> \"Proof of project management accreditation is required.\"",
      "tag": "Paraphrase Bằng Cấp"
    },
    {
      "id": 18,
      "front": "[Paraphrase Part 7] \"Clientele / Patron\" chuyển thành gì?",
      "back": "Cặp Paraphrase khách hàng:\n• Clientele / Patrons / Shoppers -> CUSTOMERS / CONSUMERS / REGULAR USERS.\nVí dụ: \"The bistro attracts a young clientele\" -> \"Young diners frequently eat at the restaurant.\"",
      "tag": "Paraphrase Khách Hàng"
    },
    {
      "id": 19,
      "front": "[Paraphrase Part 7] \"Mandatory / Obligatory\" chuyển thành gì?",
      "back": "Cặp Paraphrase bắt buộc:\n• Mandatory / Obligatory -> REQUIRED / COMPULSORY / NOT OPTIONAL.\nVí dụ: \"Attendance at the seminar is mandatory\" -> \"Employees are required to attend.\"",
      "tag": "Paraphrase Quy Định"
    },
    {
      "id": 20,
      "front": "[Paraphrase Part 7] \"Remuneration / Compensation\" chuyển thành gì?",
      "back": "Cặp Paraphrase lương thưởng:\n• Remuneration / Compensation -> SALARY / PAY / EARNINGS / WAGE PACKAGE.\nVí dụ: \"Competitive remuneration is offered\" -> \"The position comes with attractive pay.\"",
      "tag": "Paraphrase Thu Nhập"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Trong Part 7, cụm 'At no additional cost' là dạng paraphrase của từ nào?",
      "options": [
        "A. Mandatory",
        "B. Complimentary",
        "C. Substandard",
        "D. Preliminary"
      ],
      "correct": 1,
      "explanation": "Complimentary = At no additional cost (miễn phí, không tính thêm tiền)."
    },
    {
      "id": 2,
      "question": "Khi bài đọc viết: 'The meeting was pushed back to Thursday', câu hỏi hỏi gì?",
      "options": [
        "A. The meeting was cancelled completely.",
        "B. The meeting was rescheduled to a later date.",
        "C. The meeting started earlier than planned.",
        "D. The meeting was relocated to a new site."
      ],
      "correct": 1,
      "explanation": "Pushed back = Postponed / Rescheduled to a later date (lùi lịch sang ngày sau)."
    },
    {
      "id": 3,
      "question": "Từ 'Mandatory' trong thông báo công ty đồng nghĩa với từ nào?",
      "options": [
        "A. Optional",
        "B. Compulsory / Required",
        "C. Subsidized",
        "D. Temporary"
      ],
      "correct": 1,
      "explanation": "Mandatory = Required / Compulsory (mang tính bắt buộc)."
    },
    {
      "id": 4,
      "question": "'Oversee the procurement department' nghĩa là gì?",
      "options": [
        "A. Quản lý, giám sát phòng thu mua",
        "B. Sa thải nhân viên phòng thu mua",
        "C. Nộp đơn xin việc vào phòng thu mua",
        "D. Thanh lý tài sản công ty"
      ],
      "correct": 0,
      "explanation": "Oversee = Supervise / Manage (giám sát, chịu trách nhiệm quản lý)."
    },
    {
      "id": 5,
      "question": "Từ nào sau đây là từ bao quát (Superordinate) cho 'Printer, Scanner, Laptop'?",
      "options": [
        "A. Office apparatus / Equipment",
        "B. Contingency fund",
        "C. Clientele",
        "D. Remuneration"
      ],
      "correct": 0,
      "explanation": "Apparatus / Electronic Equipment là từ khái quát chỉ các loại máy móc thiết bị văn phòng."
    }
  ]
},
  {
  "id": "toeic-master-900-traps",
  "title": "50 Bẫy Điểm Liệt & Cụm Từ Nâng Cao Chinh Phục TOEIC 900+",
  "subtitle": "Đảo ngữ Little did he know, bị động kép, notwithstanding & thành ngữ công sở",
  "category": "ngoai-ngu",
  "categoryLabel": "TOEIC Cực Khó 900+",
  "badge": "Chinh Phục 900+ 3 Xu",
  "priceXu": 3,
  "originalPriceXu": 45,
  "rating": 4.99,
  "reviewsCount": 1560,
  "studentsCount": 5890,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Sổ Tay Bẫy Điểm Liệt 900+",
    "Trắc Nghiệm Nâng Cao"
  ],
  "description": "Dành cho thí sinh muốn chạm mốc 900-990 TOEIC tuyệt đối. Tổng hợp toàn bộ các câu hỏi phân loại thí sinh điểm cao: đảo ngữ So/Such, cụm giới từ nâng cao và bẫy thì kép.",
  "highlights": [
    "Giải mã cấu trúc đảo ngữ phủ định và đảo ngữ không gian hiếm gặp",
    "Phân biệt sắc thái từ vựng đa tầng nghĩa (compromise, initiative)",
    "Kỹ thuật xử lý câu hỏi từ vựng bẫy trong 5 giây",
    "Đảm bảo an toàn không bị mất điểm ở những câu bẫy khó nhất"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[Bẫy 900+ Đảo ngữ phủ định] Little did the manager know... nghĩa là gì?",
      "back": "Cấu trúc: LITTLE + DID + S + KNOW... (Người quản lý hoàn toàn chẳng hề hay biết rằng...)\n📌 Dùng để nhấn mạnh sự bất ngờ tột cùng.\nVí dụ: Little did the CEO know that his assistant had already sent the confidential contract to the press.",
      "tag": "TOEIC 900+ Đảo Ngữ"
    },
    {
      "id": 2,
      "front": "[Bẫy 900+ Bị động kép] The company is believed to have concealed profits?",
      "back": "Khi hành động ở vế tường thuật là Hiện tại (is believed) nhưng hành động thực tế xảy ra trong Quá khứ:\n📌 S + be V3 + TO HAVE V3/ed.\nVí dụ: The former CFO is suspected to have embezzled over $2 million during his tenure.",
      "tag": "TOEIC 900+ Ngữ Pháp Siêu Cấp"
    },
    {
      "id": 3,
      "front": "[Bẫy 900+ Từ vựng đa tầng] \"Compromise\" mang nghĩa tiêu cực là gì?",
      "back": "Ngoài nghĩa tích cực là 'thỏa hiệp', trong văn cảnh an ninh mạng / dữ liệu, COMPROMISE mang nghĩa là: LÀM TỔN HẠI, LÀM BẠI LỘ MỨC ĐỘ AN TOÀN (put at risk).\nVí dụ: User passwords were compromised during the server breach.",
      "tag": "TOEIC 900+ Nghĩa Đa Tầng"
    },
    {
      "id": 4,
      "front": "[Bẫy 900+ Cấu trúc đảo ngữ địa điểm] On the podium stood the keynote speaker?",
      "back": "Khi cụm giới từ chỉ địa điểm đứng đầu câu để miêu tả hình ảnh, TOÀN BỘ ĐỘNG TỪ CHÍNH được đảo lên trước chủ ngữ mà KHÔNG cần mượn do/does/did!\nVí dụ: In the center of the exhibition hall stands a massive bronze monument.",
      "tag": "TOEIC 900+ Đảo Ngữ Không Gian"
    },
    {
      "id": 5,
      "front": "[Bẫy 900+ Động từ khuyết thiếu quá khứ] Needn't have V3 vs Didn't need to V?",
      "back": "• Needn't have V3: Lẽ ra KHÔNG CẦN làm nhưng thực tế ĐÃ LÀM (lãng phí công sức).\n  Ví dụ: You needn't have printed all 100 pages; the presentation was shared digitally.\n• Didn't need to V: Không cần làm và ĐÃ KHÔNG LÀM.\n  Ví dụ: I didn't need to rent a car because the hotel offered a free shuttle.",
      "tag": "TOEIC 900+ Phân Biệt Tinh Tế"
    },
    {
      "id": 6,
      "front": "[Bẫy 900+ Cụm giới từ nâng cao] \"Notwithstanding\" mang nghĩa gì?",
      "back": "• NOTWITHSTANDING = Despite / In spite of (Bất chấp, mặc dù).\n⚠️ Có thể đứng TRƯỚC hoặc đứng SAU danh từ!\nVí dụ:\n- Notwithstanding severe headwinds, the tech division posted record quarterly profits.\n- Severe headwinds notwithstanding, the firm expanded globally.",
      "tag": "TOEIC 900+ Từ Nối Cao Cấp"
    },
    {
      "id": 7,
      "front": "[Bẫy 900+ Thể giả định] It is recommended that each board member (be / is) present?",
      "back": "Bắt buộc chọn: \"BE\"!\n📌 Động từ theo sau recommend that / suggest that / insist that luôn là BARE INFINITIVE cho mọi chủ ngữ số ít hay số nhiều.\nVí dụ: The legal advisor insisted that the CEO be briefed immediately.",
      "tag": "TOEIC 900+ Giả Định Thức"
    },
    {
      "id": 8,
      "front": "[Bẫy 900+ Mệnh đề nhượng bộ] \"However + adj/adv + S + V\"?",
      "back": "📌 Cấu trúc: HOWEVER + Tính từ / Trạng từ + S + V, ... (Dù cho có... đến mức nào đi nữa).\nVí dụ: However meticulously we audited the spreadsheets, not a single penny was unaccounted for.",
      "tag": "TOEIC 900+ Cấu Trúc Độc Lạ"
    },
    {
      "id": 9,
      "front": "[Bẫy 900+ Danh từ có đuôi lạ] \"Initiative\" và \"Alternative\" là loại từ gì?",
      "back": "Mặc dù có đuôi \"-ive\" (thường là tính từ), cả hai từ này ĐỀU LÀ DANH TỪ ĐẾM ĐƯỢC!\n• Initiative: Sáng kiến mới (Take the initiative: chủ động dẫn đầu).\n• Alternative: Giải pháp thay thế (A viable alternative to fossil fuels).",
      "tag": "TOEIC 900+ Bẫy Từ Loại"
    },
    {
      "id": 10,
      "front": "[Bẫy 900+ Danh từ chỉ người] \"Representative\" và \"Delegate\"?",
      "back": "• Representative: Người đại diện bán hàng hoặc đại diện pháp lý (sales representative).\n• Delegate: Đại biểu tham dự hội nghị quốc tế.\n⚠️ Đều là danh từ chỉ người đếm được, tuyệt đối không được viết trơ trọi số ít mà không có a/an/the!",
      "tag": "TOEIC 900+ Danh Từ Độc"
    },
    {
      "id": 11,
      "front": "[Bẫy 900+ Bị động với giới từ] Looked up to / Taken care of?",
      "back": "Trong câu bị động của phrasal verbs, giới từ đi kèm KHÔNG BAO GIỜ ĐƯỢC LƯỢC BỎ!\nVí dụ: The senior mentor is widely looked up to by the apprentice cohort.",
      "tag": "TOEIC 900+ Phrasal Verbs Bị Động"
    },
    {
      "id": 12,
      "front": "[Bẫy 900+ Cụm từ cố định] \"In the event of\" mang nghĩa gì?",
      "back": "• In the event of + Noun = Trong trường hợp xảy ra việc gì (In case of).\nVí dụ: In the event of a power outage, emergency backup generators will automatically activate within 10 seconds.",
      "tag": "TOEIC 900+ Cụm Cố Định"
    },
    {
      "id": 13,
      "front": "[Bẫy 900+ Trạng từ liên kết] \"Consequently\" vs \"Subsequently\"?",
      "back": "• CONSEQUENTLY: Hậu quả là, do đó (= As a result, therefore).\n• SUBSEQUENTLY: Sau đó về mặt thời gian (= Afterward, later on).\nVí dụ: The factory failed quality inspections; consequently, its operating license was suspended.",
      "tag": "TOEIC 900+ Phân Biệt Sắc Thái"
    },
    {
      "id": 14,
      "front": "[Bẫy 900+ Đảo ngữ So / Such] So lucrative was the patent that...?",
      "back": "📌 Đảo ngữ So: SO + ADJ + TO-BE + S + THAT + Clause.\nVí dụ: So lucrative was the biotechnology patent that competing pharmaceuticals offered over $500 million to acquire it.",
      "tag": "TOEIC 900+ Đảo Ngữ So & Such"
    },
    {
      "id": 15,
      "front": "[Bẫy 900+ Thể sai khiến bị động] Have something done?",
      "back": "📌 S + have / get + Vật + V3/ed (nhờ ai làm dịch vụ gì cho mình).\nVí dụ: The branch manager had the office air conditioners thoroughly serviced before summer peak.",
      "tag": "TOEIC 900+ Thể Sai Khiến"
    },
    {
      "id": 16,
      "front": "[Bẫy 900+ Cụm \"No sooner had S V3 than...\"] Bẫy đổi chữ \"than\"?",
      "back": "⚠️ Bẫy đề thi: Luôn gài chữ \"when\" hoặc \"that\" vào chỗ trống sau No sooner!\nQuy tắc: No sooner BẮT BUỘC ĐI VỚI \"THAN\".\nHardly / Scarcely BẮT BUỘC ĐI VỚI \"WHEN\".",
      "tag": "TOEIC 900+ Bẫy Kinh Điển"
    },
    {
      "id": 17,
      "front": "[Bẫy 900+ Giới từ thời gian] \"Over the past decade\" chia thì gì?",
      "back": "Cụm 'Over the past / last + khoảng thời gian' BẮT BUỘC CHIA THÌ HIỆN TẠI HOÀN THÀNH (have/has + V3)!\nVí dụ: Over the past five years, the startup has grown its annual revenue tenfold.",
      "tag": "TOEIC 900+ Quy Tắc Thì"
    },
    {
      "id": 18,
      "front": "[Bẫy 900+ Giới từ theo sau] \"Attributed to\" nghĩa là gì?",
      "back": "• Attribute A to B = Quy cho, cho rằng A là kết quả của B.\n• Bị động: A is attributed to B (Thành công này là nhờ có B).\nVí dụ: The surge in quarterly profits was largely attributed to the viral TikTok campaign.",
      "tag": "TOEIC 900+ Collocations Vàng"
    },
    {
      "id": 19,
      "front": "[Bẫy 900+ Cụm từ đảo ngữ bán phủ định] Seldom have we witnessed...?",
      "back": "Khi SELDOM, RARELY, SCARCELY đứng đầu câu -> Đảo trợ động từ lên trước chủ ngữ!\nVí dụ: Seldom has an educational startup achieved 100,000 active users in its inaugural week.",
      "tag": "TOEIC 900+ Đảo Ngữ"
    },
    {
      "id": 20,
      "front": "[Bẫy 900+ Thành ngữ văn phòng] \"Cut through red tape\" nghĩa là gì?",
      "back": "Nghĩa: Vượt qua các thủ tục hành chính rườm rà quan liêu để đẩy nhanh tiến độ công việc.\nVí dụ: The new digital government portal helped entrepreneurs cut through red tape and register businesses in 24 hours.",
      "tag": "TOEIC 900+ Idioms Thương Mại"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Chọn câu đảo ngữ đúng: 'Little ______ about the impending corporate merger.'",
      "options": [
        "A. the employees knew",
        "B. did the employees know",
        "C. had the employees know",
        "D. the employees know"
      ],
      "correct": 1,
      "explanation": "Đảo ngữ với Little đứng đầu câu: Little + did + S + V-bare (Little did the employees know)."
    },
    {
      "id": 2,
      "question": "Từ 'Notwithstanding' đồng nghĩa với từ nào sau đây?",
      "options": [
        "A. Because of",
        "B. In spite of",
        "C. Provided that",
        "D. In addition to"
      ],
      "correct": 1,
      "explanation": "Notwithstanding = Despite / In spite of (mặc dù, bất chấp)."
    },
    {
      "id": 3,
      "question": "Chọn từ thích hợp: 'The company launched an innovative green ______ to reduce packaging waste.'",
      "options": [
        "A. initiative",
        "B. initiate",
        "C. initiating",
        "D. initiated"
      ],
      "correct": 0,
      "explanation": "Initiative là danh từ đếm được (sáng kiến, kế hoạch mới)."
    },
    {
      "id": 4,
      "question": "Cấu trúc nào sau đây kết hợp ĐÚNG?",
      "options": [
        "A. No sooner had we landed when it started to snow.",
        "B. No sooner had we landed than it started to snow.",
        "C. Hardly had we landed than it started to snow.",
        "D. Scarcely had we landed than it started to snow."
      ],
      "correct": 1,
      "explanation": "No sooner bắt buộc đi với THAN (No sooner had... than...)."
    },
    {
      "id": 5,
      "question": "'Cut through red tape' trong ngữ cảnh kinh doanh có nghĩa là gì?",
      "options": [
        "A. Cắt băng khánh thành tòa nhà mới",
        "B. Vượt qua hoặc tinh giản các rào cản thủ tục hành chính rườm rà",
        "C. Bị phạt vì vi phạm an toàn lao động",
        "D. Hủy hợp đồng với nhà cung cấp"
      ],
      "correct": 1,
      "explanation": "Red tape là thói quan liêu thủ tục rườm rà; cut through red tape là vượt qua rào cản đó."
    }
  ]
},
  {
  "id": "ielts-writing-task1-trends",
  "title": "Từ Vựng & Cấu Trúc Mô Tả Xu Hướng IELTS Writing Task 1",
  "subtitle": "Tăng giảm, dao động, đạt đỉnh, chạm đáy, pie chart, bản đồ quy hoạch & quy trình",
  "category": "ngoai-ngu",
  "categoryLabel": "IELTS Writing Task 1",
  "badge": "Task 1 Chuẩn C1 2 Xu",
  "priceXu": 2,
  "originalPriceXu": 35,
  "rating": 4.97,
  "reviewsCount": 980,
  "studentsCount": 3780,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Template Mô Tả 7 Dạng Biểu Đồ",
    "Trắc Nghiệm Xu Hướng"
  ],
  "description": "Nâng band điểm Task Achievement & Cohesion trong IELTS Writing Task 1. Cung cấp bộ từ vựng miêu tả xu hướng sắc sảo (rocket, plummet, plateau) và cấu trúc rút gọn phân từ.",
  "highlights": [
    "Trọn bộ từ vựng mô tả đường, cột, bảng, biểu đồ tròn, map và process",
    "Phân biệt chính xác giới từ số liệu (rose by 10% vs rose to 30%)",
    "Mẫu câu nhân hóa thời gian và cấu trúc phân từ hiện tại band 8.0+",
    "Trắc nghiệm nhận biết xu hướng biểu đồ nhanh chóng"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[Task 1 Tăng Trưởng] Phân biệt Rocket, Surge và Soar?",
      "back": "• SURGE /sɜːdʒ/ (v/n): Tăng vọt đột biến trong thời gian ngắn (A dramatic surge in sales).\n• SOAR /sɔː/ (v): Bay vút lên đỉnh cao (Profits soared to a peak of 80%).\n• ROCKET /ˈrɒk.ɪt/ (v): Tăng với tốc độ tên lửa phi mã.\n⚠️ Tuyệt đối KHÔNG dùng các từ này ở thể bị động!",
      "tag": "Task 1 Tăng Vọt"
    },
    {
      "id": 2,
      "front": "[Task 1 Giảm Mạnh] Phân biệt Plummet, Plunge và Slump?",
      "back": "• PLUMMET /ˈplʌm.ɪt/ (v): Rơi tự do thẳng đứng không phanh (Prices plummeted by 45%).\n• PLUNGE /plʌndʒ/ (v): Lao dốc cắm đầu xuống vực sâu.\n• SLUMP /slʌmp/ (v/n): Sụt giảm mạnh và đình trệ ở mức thấp kéo dài.\nTừ đồng nghĩa: Nosedive, Drop precipitously.",
      "tag": "Task 1 Lao Dốc"
    },
    {
      "id": 3,
      "front": "[Task 1 Dao Động] Diễn tả xu hướng \"Dao động liên tục\"?",
      "back": "• FLUCTUATE /ˈflʌk.tʃu.eɪt/ (v) -> Noun: Fluctuation.\nCấu trúc vàng: Fluctuate wildly / mildly between X and Y.\nVí dụ: The exchange rate fluctuated wildly between 23,000 and 25,000 VND throughout the year.",
      "tag": "Task 1 Dao Động"
    },
    {
      "id": 4,
      "front": "[Task 1 Đạt Đỉnh / Chạm Đáy] Mẫu câu miêu tả đỉnh cao nhất và đáy thấp nhất?",
      "back": "• Đạt đỉnh: Reach a peak of X / Peak at X (Ví dụ: Oil consumption peaked at 95 million barrels in 2024).\n• Chạm đáy: Hit a low of X / Reach a trough of X / Bottom out at X (Chạm đáy rồi bắt đầu hồi phục).",
      "tag": "Task 1 Cực Trị"
    },
    {
      "id": 5,
      "front": "[Task 1 Đi Ngang] Diễn tả số liệu \"Chững lại / Giữ nguyên không đổi\"?",
      "back": "• REMAIN STABLE / CONSTANT / STEADY AT X.\n• PLATEAU AT X (động từ: chững lại sau chu kỳ tăng trưởng dài).\n• LEVEL OFF / FLATTEN OUT AT X.\nVí dụ: After a decade of exponential growth, smartphone shipments plateaued at 1.2 billion units.",
      "tag": "Task 1 Đi Ngang"
    },
    {
      "id": 6,
      "front": "[Task 1 Mức độ thay đổi] Các phó từ miêu tả mức độ biến động mạnh vs nhẹ?",
      "back": "• Tăng/giảm MẠNH: Dramatically, Substantially, Sharply, Precipitously, Exponentially.\n• Tăng/giảm VỪA PHẢI: Moderately, Steadily, Consistently.\n• Tăng/giảm NHẸ: Marginally, Slightly, Negligibly.",
      "tag": "Task 1 Trạng Từ Sắc Thái"
    },
    {
      "id": 7,
      "front": "[Task 1 Chiếm Tỷ Lệ] 5 cách nói \"Chiếm bao nhiêu phần trăm\" cho Pie Chart?",
      "back": "1. Account for X% (Coal accounted for 35% of total energy production).\n2. Represent X% of the total.\n3. Make up X% of...\n4. Constitute X% of the workforce.\n5. Comprise X% / Be comprised of...",
      "tag": "Task 1 Biểu Đồ Tròn"
    },
    {
      "id": 8,
      "front": "[Task 1 Cấu trúc Nhân đôi / Gấp ba] Double, Triple, Quadruple, Fourfold?",
      "back": "• Động từ: The figure doubled from 20% to 40%.\n• Tính từ/phó từ: A threefold increase (tăng gấp 3 lần) / Increased fourfold.\n⚠️ Lưu ý: Double và Triple vừa là động từ nội vừa là ngoại động từ.",
      "tag": "Task 1 Tỷ Lệ Gấp Đôi"
    },
    {
      "id": 9,
      "front": "[Task 1 Bản Đồ - Map] Các động từ chỉ sự thay đổi quy hoạch đô thị?",
      "back": "• Bị phá bỏ: Be demolished / knocked down / pulled down.\n• Xây mới: Be erected / constructed / built from scratch.\n• Mở rộng: Be expanded / enlarged / widened (road).\n• Thay thế: Be replaced by / Make way for (Ví dụ: The old factory was demolished to make way for a residential complex).",
      "tag": "Task 1 Bản Đồ Map"
    },
    {
      "id": 10,
      "front": "[Task 1 Quy Trình - Process] Các từ nối trình tự thời gian?",
      "back": "• Bước đầu: In the initial stage, The process commences with...\n• Bước tiếp: Subsequently, Following this, After which...\n• Các bước song song: Concurrently, Simultaneously...\n• Bước cuối: Ultimately, The final step culminates in...",
      "tag": "Task 1 Quy Trình Process"
    },
    {
      "id": 11,
      "front": "[Task 1 Cấu trúc Chủ ngữ Giả] \"There was a sharp rise in...\" vs \"The figure witnessed...\"?",
      "back": "Đa dạng hóa cấu trúc câu để nâng điểm Grammatical Range:\n• Cách 1: There was a sharp rise of 15% in vehicle sales.\n• Cách 2 (Nhân hóa thời gian/địa điểm): The year 2026 witnessed a sharp rise in vehicle sales.\n• Cách 3: Vehicle sales experienced a sharp rise.",
      "tag": "Task 1 Cấu Trúc Đa Dạng"
    },
    {
      "id": 12,
      "front": "[Task 1 Vượt Mặt] Diễn tả xu hướng \"Vượt qua\" đối thủ (Overtake, Surpass)?",
      "back": "• OVERTAKE / SURPASS / OUTSTRIP: Vượt qua số liệu của đối tượng khác.\nVí dụ: Solar energy surpassed wind power in 2025 to become the leading renewable source.",
      "tag": "Task 1 So Sánh Vượt Trội"
    },
    {
      "id": 13,
      "front": "[Task 1 Giới Từ Số Liệu] Phân biệt By X vs To X vs At X?",
      "back": "⚠️ Cực kỳ quan trọng:\n• Rose BY 10%: Tăng MỘT LƯỢNG chênh lệch 10% (từ 20% lên 30%).\n• Rose TO 30%: Tăng ĐẾN MỨC 30%.\n• Stood AT 30%: Đứng tại mốc 30% ở thời điểm bắt đầu.",
      "tag": "Task 1 Giới Từ Sống Còn"
    },
    {
      "id": 14,
      "front": "[Task 1 Tương Lai Dự Báo] Cách viết số liệu ước tính đến năm 2035?",
      "back": "Không dùng thì quá khứ đơn! Dùng cấu trúc dự báo:\n• Is projected / predicted / forecasted to V (Is projected to reach 10 million).\n• It is estimated that...\n• Are expected to witness a steady rise.",
      "tag": "Task 1 Dự Báo Tương Lai"
    },
    {
      "id": 15,
      "front": "[Task 1 Cấu trúc Rút gọn Phân từ] \"..., reaching a peak of X\"?",
      "back": "Dùng Phân từ hiện tại (-ing) ở cuối câu để chỉ kết quả hệ quả:\nVí dụ: Carbon emissions climbed steadily over the five-year period, REACHING A PEAK OF 400 metric tons in 2024.",
      "tag": "Task 1 Cấu Trúc Band 8"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Trong câu: 'Sales rose ______ 20% to 50%', điền giới từ nào để chỉ lượng chênh lệch (30%)?",
      "options": [
        "A. at",
        "B. by",
        "C. with",
        "D. on"
      ],
      "correct": 1,
      "explanation": "Rose BY 30% (tăng một lượng chênh lệch 30%), còn rose FROM 20% TO 50%."
    },
    {
      "id": 2,
      "question": "Từ nào đồng nghĩa với 'Plummet' (lao dốc thẳng đứng)?",
      "options": [
        "A. Soar",
        "B. Plunge",
        "C. Plateau",
        "D. Fluctuate"
      ],
      "correct": 1,
      "explanation": "Plummet và Plunge đều có nghĩa là rơi tự do, lao dốc cắm đầu."
    },
    {
      "id": 3,
      "question": "Cụm từ nào dùng để diễn tả số liệu 'chững lại không đổi sau chu kỳ tăng trưởng'?",
      "options": [
        "A. Hit a trough",
        "B. Plateaued at",
        "C. Rocketed to",
        "D. Outstripped"
      ],
      "correct": 1,
      "explanation": "Plateau at nghĩa là đi ngang, chững lại ở đỉnh cao."
    },
    {
      "id": 4,
      "question": "Khi miêu tả bản đồ quy hoạch (Map), cụm 'make way for' có nghĩa là gì?",
      "options": [
        "A. Xây dựng một con đường mới",
        "B. Nhường chỗ cho công trình mới được xây dựng",
        "C. Đóng cửa vĩnh viễn",
        "D. Trồng thêm cây xanh"
      ],
      "correct": 1,
      "explanation": "Be demolished to make way for... nghĩa là bị phá dỡ để nhường chỗ cho công trình khác."
    },
    {
      "id": 5,
      "question": "Cụm nào diễn tả 'Chiếm bao nhiêu phần trăm' trong biểu đồ tròn?",
      "options": [
        "A. Account for",
        "B. Constitute",
        "C. Represent",
        "D. Tất cả các phương án trên"
      ],
      "correct": 3,
      "explanation": "Account for, Constitute, Represent, Make up đều dùng để miêu tả tỷ lệ phần trăm."
    }
  ]
},
  {
  "id": "ielts-writing-task2-collocations",
  "title": "Collocations C1-C2 Nâng Band Writing Task 2 Vượt Trội",
  "subtitle": "Cụm từ học thuật sắc sảo viết luận chuyên sâu tránh từ sáo rỗng (cliché)",
  "category": "ngoai-ngu",
  "categoryLabel": "IELTS Writing Task 2",
  "badge": "Lexical Band 8.5 3 Xu",
  "priceXu": 3,
  "originalPriceXu": 42,
  "rating": 4.99,
  "reviewsCount": 1670,
  "studentsCount": 5420,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "50 Collocations Học Thuật C1-C2",
    "Trắc Nghiệm Viết Luận"
  ],
  "description": "Chấm dứt lối viết đơn giản lặp từ. Nạp ngay những collocations đắt giá nhất theo tiêu chuẩn Cambridge IELTS: anthropogenic climate change, exacerbate inequality, strike a delicate balance.",
  "highlights": [
    "100% Cụm từ học thuật C1-C2 chuẩn mực được giám khảo đánh giá cao",
    "Thay thế hoàn toàn các cụm từ sáo rỗng bị trừ điểm Lexical Resource",
    "Có câu ví dụ hoàn chỉnh theo ngữ cảnh đề bài Writing Task 2 thực tế",
    "Kèm bài trắc nghiệm kiểm tra độ hiểu sâu nghĩa collocation"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "anthropogenic climate change /ˌæn.θrə.pəˈdʒen.ɪk/ (collocation)",
      "back": "Nghĩa: Biến đổi khí hậu do con người gây ra (predominantly caused by human activities).\nCollocation nâng band thay cho cụm thông thường 'global warming caused by people'.\nVí dụ: Overwhelming empirical evidence corroborates that anthropogenic climate change poses an existential threat.",
      "tag": "IELTS Môi Trường"
    },
    {
      "id": 2,
      "front": "exacerbate socioeconomic inequality /ɪɡˈzæs.ə.beɪt/ (collocation)",
      "back": "Nghĩa: Làm trầm trọng thêm sự bất bình đẳng kinh tế - xã hội.\nPhân tích: Exacerbate (worsen, làm tồi tệ hơn) + Socioeconomic inequality.\nVí dụ: The digital divide threatens to exacerbate socioeconomic inequality among rural children.",
      "tag": "IELTS Xã Hội"
    },
    {
      "id": 3,
      "front": "curb soaring inflation (collocation)",
      "back": "Nghĩa: Kiềm chế, kìm hãm mức lạm phát đang tăng chóng mặt.\nCurb (limit, control) thay thế từ nhàm chán 'reduce / stop'.\nVí dụ: Central banks raised benchmark interest rates to curb soaring inflation.",
      "tag": "IELTS Kinh Tế"
    },
    {
      "id": 4,
      "front": "foster critical thinking skills (collocation)",
      "back": "Nghĩa: Nuôi dưỡng và phát triển kỹ năng tư duy phản biện độc lập.\nFoster (cultivate, nurture) + Critical thinking.\nVí dụ: Modern educational curricula should foster critical thinking rather than rote memorization.",
      "tag": "IELTS Giáo Dục"
    },
    {
      "id": 5,
      "front": "mitigate catastrophic environmental impacts (collocation)",
      "back": "Nghĩa: Giảm nhẹ, xoa dịu những tác động môi trường mang tính thảm họa.\nMitigate (alleviate) + Catastrophic (disastrous) + Environmental impacts.\nVí dụ: Immediate decarbonization is imperative to mitigate catastrophic environmental impacts.",
      "tag": "IELTS Môi Trường"
    },
    {
      "id": 6,
      "front": "inextricably intertwined /ˌɪn.ɪkˈstrɪk.ə.bli ˌɪn.təˈtwaɪnd/ (collocation)",
      "back": "Nghĩa: Gắn bó khăng khít, quyện chặt vào nhau không thể tách rời.\nVí dụ: Public health and economic prosperity are inextricably intertwined in modern governance.",
      "tag": "IELTS Văn Phong Học Giả"
    },
    {
      "id": 7,
      "front": "proliferate at an alarming rate (collocation)",
      "back": "Nghĩa: Bùng nổ, sinh sôi nảy nở với tốc độ đáng báo động.\nProliferate (multiply rapidly) + At an alarming rate.\nVí dụ: Misinformation online has proliferated at an alarming rate, undermining democratic trust.",
      "tag": "IELTS Công Nghệ & Tin Tức"
    },
    {
      "id": 8,
      "front": "strike a delicate balance between (collocation)",
      "back": "Nghĩa: Đạt được sự cân bằng tinh tế, hài hòa giữa hai yếu tố mâu thuẫn.\nVí dụ: Policymakers must strike a delicate balance between rapid industrialization and ecological conservation.",
      "tag": "IELTS Cấu Trúc Kinh Điển"
    },
    {
      "id": 9,
      "front": "exert a pernicious influence on (collocation)",
      "back": "Nghĩa: Gây ra ảnh hưởng độc hại ngấm ngầm lên đối tượng nào đó.\nPernicious (subtly harmful) thay thế cho 'bad influence'.\nVí dụ: Excessive screen time exerts a pernicious influence on children's attention spans.",
      "tag": "IELTS Xã Hội"
    },
    {
      "id": 10,
      "front": "pave the way for groundbreaking innovation (collocation)",
      "back": "Nghĩa: Mở đường, dọn đường cho những đổi mới sáng tạo mang tính đột phá.\nPave the way for + Groundbreaking innovation.\nVí dụ: Fundamental quantum research paved the way for groundbreaking advancements in cybersecurity.",
      "tag": "IELTS Khoa Học"
    },
    {
      "id": 11,
      "front": "substantiate assertions with empirical data (collocation)",
      "back": "Nghĩa: Cung cấp bằng chứng thực nghiệm xác thực để chứng minh cho luận điểm.\nSubstantiate assertions (prove claims) + Empirical data (dữ liệu thực nghiệm).\nVí dụ: Essay writers must substantiate their theoretical assertions with credible empirical data.",
      "tag": "IELTS Lập Luận Chặt Chẽ"
    },
    {
      "id": 12,
      "front": "alleviate traffic congestion (collocation)",
      "back": "Nghĩa: Làm dịu bớt, giảm nhẹ tình trạng tắc nghẽn giao thông đô thị.\nAlleviate thay vì dùng 'reduce / solve'.\nVí dụ: Subsidizing rapid transit systems is the most sustainable way to alleviate urban traffic congestion.",
      "tag": "IELTS Đô Thị Hóa"
    },
    {
      "id": 13,
      "front": "disseminate scientific knowledge (collocation)",
      "back": "Nghĩa: Lan tỏa, truyền bá kiến thức khoa học rộng rãi đến cộng đồng.\nDisseminate (broadcast, spread widely) + Scientific knowledge.\nVí dụ: Open-access academic journals help disseminate vital scientific knowledge globally.",
      "tag": "IELTS Tri Thức"
    },
    {
      "id": 14,
      "front": "reap substantial benefits from (collocation)",
      "back": "Nghĩa: Gặt hái được những lợi ích to lớn, đáng kể từ điều gì.\nReap (harvest) + Substantial benefits (lợi ích to lớn).\nVí dụ: Developing nations reap substantial benefits from foreign direct investments.",
      "tag": "IELTS Lợi Ích"
    },
    {
      "id": 15,
      "front": "fall prey to fraudulent schemes (collocation)",
      "back": "Nghĩa: Trở thành con mồi, nạn nhân của các chiêu trò lừa đảo.\nFall prey to (become a victim of) + Fraudulent schemes.\nVí dụ: Elderly citizens are particularly vulnerable to falling prey to sophisticated online scams.",
      "tag": "IELTS An Ninh Mạng"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Cụm từ nào mang nghĩa 'Làm trầm trọng thêm sự bất bình đẳng kinh tế - xã hội'?",
      "options": [
        "A. Exacerbate socioeconomic inequality",
        "B. Mitigate socioeconomic inequality",
        "C. Foster socioeconomic inequality",
        "D. Curb socioeconomic inequality"
      ],
      "correct": 0,
      "explanation": "Exacerbate có nghĩa là làm trầm trọng thêm (worsen)."
    },
    {
      "id": 2,
      "question": "Từ 'Anthropogenic' trong bài luận IELTS có nghĩa là gì?",
      "options": [
        "A. Thuộc về tự nhiên",
        "B. Do con người gây ra",
        "C. Có nguồn gốc vũ trụ",
        "D. Có thể tái tạo được"
      ],
      "correct": 1,
      "explanation": "Anthropogenic có nghĩa là bắt nguồn từ các hoạt động của con người."
    },
    {
      "id": 3,
      "question": "Điền động từ thích hợp: 'Governments must ______ a delicate balance between economic growth and pollution.'",
      "options": [
        "A. strike",
        "B. kick",
        "C. make",
        "D. break"
      ],
      "correct": 0,
      "explanation": "Collocation cố định: Strike a balance between X and Y (đạt được sự cân bằng giữa X và Y)."
    },
    {
      "id": 4,
      "question": "Cụm 'Inextricably intertwined' diễn tả mối quan hệ như thế nào?",
      "options": [
        "A. Hoàn toàn đối lập và mâu thuẫn",
        "B. Gắn kết hữu cơ khăng khít không thể tách rời",
        "C. Xa cách và mờ nhạt",
        "D. Chỉ mang tính chất tạm thời"
      ],
      "correct": 1,
      "explanation": "Inextricably intertwined chỉ hai yếu tố gắn chặt, quyện vào nhau không thể tách biệt."
    },
    {
      "id": 5,
      "question": "Chọn từ thay thế cao cấp cho 'Reduce traffic jams':",
      "options": [
        "A. Exacerbate traffic congestion",
        "B. Alleviate traffic congestion",
        "C. Proliferate traffic congestion",
        "D. Substantiate traffic congestion"
      ],
      "correct": 1,
      "explanation": "Alleviate traffic congestion là collocation học thuật chuẩn C1-C2 của reduce traffic jams."
    }
  ]
},
  {
  "id": "ielts-speaking-band8-idiomatic",
  "title": "Từ Vựng & Idiomatic Expressions IELTS Speaking Band 8.0+",
  "subtitle": "Mẫu câu tự nhiên Part 1-3, fillers tinh tế, cảm xúc & miêu tả người/nơi chốn",
  "category": "ngoai-ngu",
  "categoryLabel": "IELTS Speaking Tự Nhiên",
  "badge": "Speaking 8.0+ 2 Xu",
  "priceXu": 2,
  "originalPriceXu": 38,
  "rating": 4.98,
  "reviewsCount": 1240,
  "studentsCount": 4350,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Kịch Bản Ứng Biến 3 Giây Speaking",
    "Trắc Nghiệm Idioms"
  ],
  "description": "Nói trôi chảy tự nhiên như người bản xứ trong phòng thi IELTS Speaking. Bộ thẻ cung cấp các câu filler mở đầu tinh tế, thành ngữ chỉ cảm xúc và từ vựng miêu tả phong cảnh sống động.",
  "highlights": [
    "Các mẫu câu câu giờ (fillers) tự nhiên khi gặp câu hỏi bất ngờ Part 3",
    "Idiomatic expressions bản xứ thông dụng không gượng gạo",
    "Từ vựng đắt giá miêu tả con người, trải nghiệm và đô thị sầm uất",
    "Trắc nghiệm rèn phản xạ sử dụng thành ngữ đúng ngữ cảnh"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[Speaking Filler Tự Nhiên] Cách mở đầu câu trả lời trôi chảy khi cần vài giây suy nghĩ?",
      "back": "• \"Well, to be totally candid, I haven't given it a great deal of thought before, but if I had to hazard a guess...\"\n• \"That's an intriguing question! I suppose from my personal vantage point...\"\n• \"Off the top of my head, I'd say...\"",
      "tag": "Speaking Mở Đầu Tự Nhiên"
    },
    {
      "id": 2,
      "front": "down in the dumps (idiomatic expression)",
      "back": "Nghĩa: Cảm thấy buồn chán, rầu rĩ, tâm trạng ủ rũ.\nThay thế cho: 'I felt very sad'.\nVí dụ: Whenever I feel a bit down in the dumps, listening to acoustic indie music instantly lifts my spirits.",
      "tag": "Speaking Cảm Xúc"
    },
    {
      "id": 3,
      "front": "over the moon / on cloud nine (idiomatic expression)",
      "back": "Nghĩa: Vui sướng ngất ngây, tràn ngập hạnh phúc tột độ.\nThay thế cho: 'I was extremely happy'.\nVí dụ: When my university application was accepted with a full scholarship, I was genuinely over the moon.",
      "tag": "Speaking Cảm Xúc"
    },
    {
      "id": 4,
      "front": "an avid reader / movie enthusiast (collocation)",
      "back": "Nghĩa: Một người đam mê đọc sách / một tín đồ cuồng phim ảnh.\nVí dụ: I consider myself an avid reader; I easily plough through two non-fiction books every single weekend.",
      "tag": "Speaking Sở Thích"
    },
    {
      "id": 5,
      "front": "bustling metropolis /ˈbʌs.lɪŋ məˈtrɒp.əl.ɪs/ (collocation)",
      "back": "Nghĩa: Đô thị sầm uất, nhộn nhịp, tràn đầy năng lượng sống cả ngày lẫn đêm.\nMiêu tả nơi chốn Part 1 & 2 (Hanoi, Saigon).\nVí dụ: Growing up in a bustling metropolis like Hanoi taught me how to adapt quickly to rapid changes.",
      "tag": "Speaking Nơi Chốn"
    },
    {
      "id": 6,
      "front": "quaint little village /kweɪnt/ (collocation)",
      "back": "Nghĩa: Ngôi làng nhỏ cổ kính, mộc mạc và thanh bình độc đáo.\nVí dụ: Every summer, my family escapes the city noise to unwind in a quaint little village in Ninh Binh.",
      "tag": "Speaking Miêu Tả Cảnh"
    },
    {
      "id": 7,
      "front": "recharge my batteries (idiomatic expression)",
      "back": "Nghĩa: Nạp lại năng lượng sau những ngày học tập và làm việc căng thẳng.\nVí dụ: Going for a solo camping weekend in Da Lat is the perfect way for me to recharge my batteries.",
      "tag": "Speaking Thư Giãn"
    },
    {
      "id": 8,
      "front": "cost an absolute fortune (idiomatic expression)",
      "back": "Nghĩa: Đắt đỏ tốn cả một gia tài lớn (nhấn mạnh cao hơn 'very expensive').\nVí dụ: Dining at five-star rooftop restaurants in central Tokyo can cost an absolute fortune.",
      "tag": "Speaking Mua Sắm"
    },
    {
      "id": 9,
      "front": "in the heat of the moment (idiomatic expression)",
      "back": "Nghĩa: Trong lúc nóng giận, bốc đồng nhất thời mà mất kiểm soát lời nói.\nVí dụ: People often say hurtful things in the heat of the moment which they later deeply regret.",
      "tag": "Speaking Tình Huống"
    },
    {
      "id": 10,
      "front": "paint the town red (idiomatic expression)",
      "back": "Nghĩa: Đi quẩy tưng bừng, liên hoan tưng bừng cùng bạn bè về đêm.\nVí dụ: After submitting our final graduation theses, my friends and I decided to paint the town red.",
      "tag": "Speaking Tiệc Tùng"
    },
    {
      "id": 11,
      "front": "see eye to eye on everything (idiomatic expression)",
      "back": "Nghĩa: Hoàn toàn đồng lòng, chung quan điểm trong mọi việc.\nVí dụ: My sister and I don't always see eye to eye on fashion, but we share an unbreakable bond.",
      "tag": "Speaking Mối Quan Hệ"
    },
    {
      "id": 12,
      "front": "a couch potato (idiomatic expression)",
      "back": "Nghĩa: Người lười biếng, suốt ngày nằm dài trên ghế sofa xem TV hoặc lướt điện thoại.\nVí dụ: During the lockdown, I became a total couch potato, but now I hit the gym four times a week.",
      "tag": "Speaking Lối Sống"
    },
    {
      "id": 13,
      "front": "burn the candle at both ends (idiomatic expression)",
      "back": "Nghĩa: Làm việc quần quật từ sáng sớm đến đêm khuya, vắt kiệt sức lực.\nVí dụ: You can't keep burning the candle at both ends without burning out eventually.",
      "tag": "Speaking Công Việc"
    },
    {
      "id": 14,
      "front": "hit the nail on the head (idiomatic expression)",
      "back": "Nghĩa: Nhận định chính xác tuyệt đối trọng tâm của câu chuyện.\nVí dụ: The podcast host really hit the nail on the head regarding why Gen Z values mental health over salary.",
      "tag": "Speaking Quan Điểm"
    },
    {
      "id": 15,
      "front": "broaden my horizons (collocation)",
      "back": "Nghĩa: Mở rộng tầm mắt, mở rộng nhân sinh quan và hiểu biết thế giới.\nVí dụ: Backpacking solo across Southeast Asia was an eye-opening adventure that truly broadened my horizons.",
      "tag": "Speaking Du Lịch & Trải Nghiệm"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Thành ngữ 'Recharge my batteries' trong IELTS Speaking mang nghĩa gì?",
      "options": [
        "A. Đi sạc pin điện thoại",
        "B. Nạp lại năng lượng và tinh thần sau chuỗi ngày làm việc mệt mỏi",
        "C. Đổi mới thiết bị công nghệ",
        "D. Tập gym cử tạ"
      ],
      "correct": 1,
      "explanation": "Recharge my batteries là nghỉ ngơi thư giãn để phục hồi lại năng lượng sống."
    },
    {
      "id": 2,
      "question": "Từ nào dùng để miêu tả một 'thành phố lớn sầm uất, nhộn nhịp' chuẩn C1-C2?",
      "options": [
        "A. Quaint village",
        "B. Bustling metropolis",
        "C. Remote hamlet",
        "D. Deserted alley"
      ],
      "correct": 1,
      "explanation": "Bustling metropolis là siêu đô thị nhộn nhịp, sôi động ngày đêm."
    },
    {
      "id": 3,
      "question": "'Paint the town red' có nghĩa là gì?",
      "options": [
        "A. Sơn lại các tòa nhà trong phố thành màu đỏ",
        "B. Đi ra ngoài ăn chơi, quẩy tưng bừng ăn mừng",
        "C. Báo động sự cố cháy nổ",
        "D. Vẽ tranh nghệ thuật đường phố"
      ],
      "correct": 1,
      "explanation": "Paint the town red là đi chơi tiệc tùng tưng bừng cùng bạn bè."
    },
    {
      "id": 4,
      "question": "Người thích nằm lười một chỗ xem TV/lướt mạng được gọi bằng idiom nào?",
      "options": [
        "A. Avid reader",
        "B. Couch potato",
        "C. Early bird",
        "D. Social butterfly"
      ],
      "correct": 1,
      "explanation": "A couch potato là người lười vận động, chỉ thích nằm dài xem TV."
    },
    {
      "id": 5,
      "question": "Khi muốn diễn tả 'Mở rộng tầm nhìn và hiểu biết', dùng cụm nào?",
      "options": [
        "A. Broaden my horizons",
        "B. Burn the candle",
        "C. Cost an arm and a leg",
        "D. Fall prey to"
      ],
      "correct": 0,
      "explanation": "Broaden one's horizons nghĩa là mở mang tầm mắt, mở rộng vốn hiểu biết."
    }
  ]
},
  {
  "id": "ielts-topic-environment-energy",
  "title": "Từ Vựng Học Thuật Chủ Đề Môi Trường & Năng Lượng Xanh",
  "subtitle": "Biến đổi khí hậu, phát thải ròng, suy thoái sinh thái & kinh tế tuần hoàn",
  "category": "ngoai-ngu",
  "categoryLabel": "IELTS Chủ Đề Môi Trường",
  "badge": "Chủ Đề Hot 2 Xu",
  "priceXu": 2,
  "originalPriceXu": 35,
  "rating": 4.97,
  "reviewsCount": 890,
  "studentsCount": 3560,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Bản Đồ Từ Vựng Khí Hậu",
    "Trắc Nghiệm Sinh Thái"
  ],
  "description": "Môi trường là chủ đề xuất hiện với tần suất cao nhất trong cả 4 kỹ năng IELTS. Nắm chắc toàn bộ từ vựng: carbon footprint, biodiversity loss, circular economy, ocean acidification.",
  "highlights": [
    "Bao quát các khái niệm sinh thái học và chính sách khí hậu hiện đại",
    "Cung cấp luận cứ và ý tưởng (ideas) sắc sảo cho bài luận Task 2",
    "Đầy đủ giải thích khoa học và câu ví dụ chuẩn phong cách học thuật",
    "Trắc nghiệm củng cố kiến thức môi trường"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "biodiversity loss /ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/ (collocation)",
      "back": "Nghĩa: Sự suy giảm / mất mát đa dạng sinh học (hàng triệu loài động thực vật tuyệt chủng).\nVí dụ: Deforestation in the Amazon rainforest is the leading catalyst for catastrophic biodiversity loss.",
      "tag": "IELTS Môi Trường"
    },
    {
      "id": 2,
      "front": "carbon footprint /ˈkɑː.bən ˌfʊt.prɪnt/ (noun)",
      "back": "Nghĩa: Dấu chân carbon (tổng lượng khí nhà kính CO2 mà một cá nhân hoặc tổ chức thải ra).\nCollocation: Minimize / Offset / Shrink one's carbon footprint.\nVí dụ: Switching to solar power enables households to significantly shrink their annual carbon footprint.",
      "tag": "IELTS Sinh Thái"
    },
    {
      "id": 3,
      "front": "renewable energy infrastructure (collocation)",
      "back": "Nghĩa: Cơ sở hạ tầng năng lượng tái tạo (điện gió, điện mặt trời, thủy triều).\nVí dụ: Developing nations require international climate finance to build resilient renewable energy infrastructure.",
      "tag": "IELTS Năng Lượng"
    },
    {
      "id": 4,
      "front": "deforestation /diːˌfɒr.ɪˈsteɪ.ʃən/ (noun)",
      "back": "Nghĩa: Nạn phá rừng trên diện rộng để lấy đất nông nghiệp hoặc gỗ.\nVí dụ: Rampant deforestation deprives wildlife of their natural habitats, accelerating extinction rates.",
      "tag": "IELTS Khí Hậu"
    },
    {
      "id": 5,
      "front": "fossil fuel depletion /dɪˈpliː.ʃən/ (collocation)",
      "back": "Nghĩa: Sự cạn kiệt nguồn tài nguyên nhiên liệu hóa thạch (than đá, dầu mỏ, khí đốt).\nVí dụ: Imminent fossil fuel depletion mandates an aggressive transition to hydrogen and nuclear power.",
      "tag": "IELTS Năng Lượng"
    },
    {
      "id": 6,
      "front": "greenhouse gas emissions /ɪˈmɪʃ.ənz/ (collocation)",
      "back": "Nghĩa: Lượng khí thải nhà kính (CO2, Methane, Nitrous Oxide) giữ nhiệt trong khí quyển.\nVí dụ: Heavily industrialized economies must be held accountable for capping greenhouse gas emissions.",
      "tag": "IELTS Khí Hậu"
    },
    {
      "id": 7,
      "front": "net-zero emissions /ˌnetˈzɪə.rəʊ/ (collocation)",
      "back": "Nghĩa: Phát thải ròng bằng 0 (lượng khí thải sinh ra bằng lượng được hấp thụ triệt để).\nVí dụ: More than 140 countries have pledged to achieve net-zero emissions by 2050 under the Paris Agreement.",
      "tag": "IELTS Chính Sách Xanh"
    },
    {
      "id": 8,
      "front": "ecological degradation /ˌiː.kəˈlɒdʒ.ɪ.kəl ˌdeɡ.rəˈdeɪ.ʃən/ (collocation)",
      "back": "Nghĩa: Sự suy thoái hệ sinh thái tự nhiên do ô nhiễm và khai thác cạn kiệt.\nVí dụ: Unregulated deep-sea mining risks causing irreversible ecological degradation to ocean trenches.",
      "tag": "IELTS Môi Trường"
    },
    {
      "id": 9,
      "front": "sustainable agricultural practices (collocation)",
      "back": "Nghĩa: Các phương thức canh tác nông nghiệp bền vững (hạn chế hóa chất, bảo vệ đất trồng).\nVí dụ: Crop rotation and organic composting represent highly effective sustainable agricultural practices.",
      "tag": "IELTS Nông Nghiệp"
    },
    {
      "id": 10,
      "front": "ocean acidification /əˌsɪd.ɪ.fɪˈkeɪ.ʃən/ (noun)",
      "back": "Nghĩa: Hiện tượng axit hóa đại dương do hấp thụ quá nhiều khí CO2 từ không khí.\nVí dụ: Ocean acidification dissolves coral reefs and devastates marine food chains.",
      "tag": "IELTS Đại Dương"
    },
    {
      "id": 11,
      "front": "circular economy /ˌsɜː.kjə.lər iˈkɒn.ə.mi/ (noun)",
      "back": "Nghĩa: Nền kinh tế tuần hoàn (tái sử dụng, tái chế và phục hồi vật liệu tối đa, giảm rác thải).\nVí dụ: Transitioning from a linear 'take-make-waste' model to a circular economy conserves raw resources.",
      "tag": "IELTS Kinh Tế Xanh"
    },
    {
      "id": 12,
      "front": "extreme weather events (collocation)",
      "back": "Nghĩa: Các hiện tượng thời tiết cực đoan (hạn hán kéo dài, bão siêu cấp, lũ quét, nắng nóng kỷ lục).\nVí dụ: The escalating frequency of extreme weather events inflicts billions in economic damages annually.",
      "tag": "IELTS Thời Tiết"
    },
    {
      "id": 13,
      "front": "biodegradable packaging /ˌbaɪ.əʊ.dɪˈɡreɪ.də.bəl/ (collocation)",
      "back": "Nghĩa: Bao bì tự phân hủy sinh học trong đất (thay thế túi nilon và nhựa dùng một lần).\nVí dụ: Banning single-use plastics and subsidizing biodegradable packaging is key to urban waste reduction.",
      "tag": "IELTS Rác Thải"
    },
    {
      "id": 14,
      "front": "water scarcity /ˈskeə.sə.ti/ (noun)",
      "back": "Nghĩa: Tình trạng khan hiếm nước ngọt sạch.\nVí dụ: Prolonged droughts and glacier melt threaten to plunge millions into acute water scarcity.",
      "tag": "IELTS Tài Nguyên"
    },
    {
      "id": 15,
      "front": "carbon sequestration /ˌkɑː.bən siː.kwesˈtreɪ.ʃən/ (noun)",
      "back": "Nghĩa: Sự cô lập / lưu trữ carbon (quá trình bắt giữ CO2 và lưu giữ trong rừng, đất hoặc dưới lòng đất).\nVí dụ: Restoring coastal mangrove swamps is one of the most efficient natural carbon sequestration techniques.",
      "tag": "IELTS Khoa Học Khí Hậu"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Thuật ngữ 'Biodiversity loss' có nghĩa là gì?",
      "options": [
        "A. Sự cạn kiệt nguồn dầu mỏ",
        "B. Sự suy giảm, mất mát đa dạng sinh học các loài",
        "C. Sự gia tăng dân số đô thị",
        "D. Sự bùng nổ của mạng xã hội"
      ],
      "correct": 1,
      "explanation": "Biodiversity loss là sự suy giảm và mất mát đa dạng sinh học trong các hệ sinh thái."
    },
    {
      "id": 2,
      "question": "Khái niệm 'Net-zero emissions' hướng tới mục tiêu gì?",
      "options": [
        "A. Không sử dụng bất kỳ phương tiện giao thông nào",
        "B. Lượng phát thải khí nhà kính ròng bằng không",
        "C. Đóng cửa toàn bộ nhà máy công nghiệp",
        "D. Chỉ sử dụng than đá"
      ],
      "correct": 1,
      "explanation": "Net-zero emissions là trạng thái cân bằng hoàn hảo, lượng khí thải thải ra bằng lượng được hấp thụ."
    },
    {
      "id": 3,
      "question": "Từ nào chỉ bao bì 'có khả năng tự phân hủy sinh học trong tự nhiên'?",
      "options": [
        "A. Non-recyclable",
        "B. Biodegradable",
        "C. Acidified",
        "D. Extinct"
      ],
      "correct": 1,
      "explanation": "Biodegradable có nghĩa là có thể tự phân hủy sinh học tự nhiên."
    },
    {
      "id": 4,
      "question": "'Carbon sequestration' là quá trình gì?",
      "options": [
        "A. Khai thác than đá dưới lòng đất",
        "B. Đốt rừng lấy đất canh tác",
        "C. Cô lập và lưu trữ khí carbon CO2",
        "D. Sản xuất xe chạy dầu diesel"
      ],
      "correct": 2,
      "explanation": "Carbon sequestration là quá trình giữ và cô lập carbon trong đất, rừng hoặc bể chứa địa chất."
    },
    {
      "id": 5,
      "question": "Mô hình kinh tế tái chế, tái sử dụng tuần hoàn được gọi là gì?",
      "options": [
        "A. Circular economy",
        "B. Linear economy",
        "C. Planned economy",
        "D. Subsistence economy"
      ],
      "correct": 0,
      "explanation": "Circular economy là nền kinh tế tuần hoàn, giảm thiểu lãng phí nguyên liệu."
    }
  ]
},
  {
  "id": "ielts-topic-ai-technology",
  "title": "Từ Vựng Học Thuật Công Nghệ, Trí Tuệ Nhân Tạo & Xã Hội Số",
  "subtitle": "Generative AI, định kiến thuật toán, deepfake, buồng vang thông tin & quyền riêng tư",
  "category": "ngoai-ngu",
  "categoryLabel": "IELTS Công Nghệ & AI",
  "badge": "Xu Hướng 2026 2 Xu",
  "priceXu": 2,
  "originalPriceXu": 36,
  "rating": 4.99,
  "reviewsCount": 1510,
  "studentsCount": 5210,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Bộ Thuật Ngữ AI 2026",
    "Trắc Nghiệm Đạo Đức AI"
  ],
  "description": "Cập nhật các chủ đề công nghệ mới nhất trong đề thi IELTS 2026: Generative AI, Algorithmic bias, Deepfake, Digital divide, Echo chamber, Autonomous vehicles.",
  "highlights": [
    "Bắt kịp các đề thi IELTS Writing Task 2 mới nhất về AI và tự động hóa",
    "Phân tích hai mặt lợi ích và rủi ro đạo đức của công nghệ cao",
    "Từ vựng chính xác miêu tả lối sống tĩnh tại và an ninh dữ liệu",
    "Kèm bài trắc nghiệm tư duy phản biện công nghệ"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "generative artificial intelligence (collocation)",
      "back": "Nghĩa: Trí tuệ nhân tạo tạo sinh (các mô hình AI có khả năng tự tạo văn bản, hình ảnh, mã nguồn như ChatGPT, Gemini).\nVí dụ: The advent of generative artificial intelligence is poised to disrupt creative and software industries.",
      "tag": "IELTS Công Nghệ 2026"
    },
    {
      "id": 2,
      "front": "algorithmic bias /ˈæl.ɡə.rɪð.mɪk ˈbaɪ.əs/ (collocation)",
      "back": "Nghĩa: Định kiến thuật toán (khi hệ thống AI đưa ra kết quả thiên lệch, phân biệt đối xử do dữ liệu huấn luyện).\nVí dụ: Algorithmic bias in automated facial recognition systems raises severe human rights concerns.",
      "tag": "IELTS Đạo Đức AI"
    },
    {
      "id": 3,
      "front": "data privacy and surveillance /sɜːˈveɪ.ləns/ (collocation)",
      "back": "Nghĩa: Quyền riêng tư dữ liệu và sự giám sát kỹ thuật số diện rộng.\nVí dụ: Strict regulatory oversight is needed to protect consumer data privacy from intrusive corporate surveillance.",
      "tag": "IELTS An Ninh Số"
    },
    {
      "id": 4,
      "front": "automation-induced job displacement (collocation)",
      "back": "Nghĩa: Sự mất việc làm hàng loạt do tự động hóa và robot thay thế sức người.\nVí dụ: Governments must establish upskilling academies to counter automation-induced job displacement.",
      "tag": "IELTS Việc Làm & AI"
    },
    {
      "id": 5,
      "front": "digital divide /ˌdɪdʒ.ɪ.təl dɪˈvaɪd/ (noun)",
      "back": "Nghĩa: Khoảng cách số (hố sâu ngăn cách giữa người có internet/thiết bị hiện đại và người không có điều kiện tiếp cận).\nVí dụ: The digital divide exacerbates educational disparities between metropolitan students and remote communities.",
      "tag": "IELTS Xã Hội Số"
    },
    {
      "id": 6,
      "front": "cyberbullying and harassment /həˈræs.mənt/ (collocation)",
      "back": "Nghĩa: Bắt nạt và quấy rối trực tuyến trên mạng xã hội.\nVí dụ: Anonymous social profiles frequently amplify cyberbullying, inflicting severe psychological trauma on adolescents.",
      "tag": "IELTS Tâm Lý Số"
    },
    {
      "id": 7,
      "front": "echo chamber /ˈek.əʊ ˌtʃeɪm.bər/ (noun)",
      "back": "Nghĩa: Buồng vang thông tin (khi thuật toán mạng xã hội chỉ phân phối nội dung củng cố niềm tin sẵn có, chặn quan điểm trái chiều).\nVí dụ: Social media algorithms trap users in ideological echo chambers, deepening political polarization.",
      "tag": "IELTS Mạng Xã Hội"
    },
    {
      "id": 8,
      "front": "autonomous vehicles /ɔːˈtɒn.ə.məs/ (collocation)",
      "back": "Nghĩa: Xe tự hành, phương tiện không người lái (Self-driving cars).\nVí dụ: Widespread deployment of autonomous vehicles could drastically minimize accidents caused by human fatigue.",
      "tag": "IELTS Giao Thông Số"
    },
    {
      "id": 9,
      "front": "intellectual property infringement /ɪnˈfrɪndʒ.mənt/ (collocation)",
      "back": "Nghĩa: Xâm phạm quyền sở hữu trí tuệ và bản quyền tác giả.\nVí dụ: Training AI models on copyrighted artworks without compensation triggers disputes over intellectual property infringement.",
      "tag": "IELTS Pháp Luật Số"
    },
    {
      "id": 10,
      "front": "deepfake technology /ˈdiːp.feɪk/ (noun)",
      "back": "Nghĩa: Công nghệ deepfake (dùng AI ghép mặt và giả giọng nói tinh vi để tạo video giả mạo y như thật).\nVí dụ: The proliferation of deepfake technology makes it increasingly difficult for citizens to distinguish truth from deceit.",
      "tag": "IELTS Tin Giả"
    },
    {
      "id": 11,
      "front": "sedentary lifestyle /ˈsed.ən.tər.i/ (collocation)",
      "back": "Nghĩa: Lối sống lười vận động, ngồi nhiều trước màn hình máy tính/điện thoại cả ngày.\nVí dụ: Excessive screen time promotes a sedentary lifestyle, elevating the risk of cardiovascular disease.",
      "tag": "IELTS Sức Khỏe Số"
    },
    {
      "id": 12,
      "front": "quantum computing /ˈkwɒn.təm/ (noun)",
      "back": "Nghĩa: Điện toán lượng tử (máy tính lượng tử có tốc độ xử lý gấp hàng triệu lần siêu máy tính hiện nay).\nVí dụ: Quantum computing possesses the capability to decipher complex molecular simulations in seconds.",
      "tag": "IELTS Khoa Học Đỉnh Cao"
    },
    {
      "id": 13,
      "front": "cloud infrastructure /klaʊd/ (collocation)",
      "back": "Nghĩa: Cơ sở hạ tầng điện toán đám mây (AWS, Google Cloud, Azure).\nVí dụ: Migrating legacy databases to scalable cloud infrastructure reduces maintenance overhead by 40%.",
      "tag": "IELTS Hệ Thống"
    },
    {
      "id": 14,
      "front": "human-centric technology (collocation)",
      "back": "Nghĩa: Công nghệ lấy con người làm trung tâm (ưu tiên phúc lợi và đạo đức con người hơn lợi nhuận thuần túy).\nVí dụ: Engineers must design human-centric technology that empowers users rather than addicting them.",
      "tag": "IELTS Triết Lý Công Nghệ"
    },
    {
      "id": 15,
      "front": "ubiquitous connectivity /juːˈbɪk.wɪ.təs/ (collocation)",
      "back": "Nghĩa: Khả năng kết nối internet tốc độ cao hiện diện ở khắp mọi nơi (5G, 6G, Starlink vệ tinh).\nVí dụ: Ubiquitous connectivity has enabled remote knowledge workers to collaborate seamlessly across time zones.",
      "tag": "IELTS Kết Nối Số"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Thuật ngữ 'Algorithmic bias' trong AI đề cập đến vấn đề gì?",
      "options": [
        "A. Tốc độ xử lý của máy tính chậm chạp",
        "B. Sự thiên vị, định kiến bất công do thuật toán AI gây ra",
        "C. Việc hao hụt pin của thiết bị",
        "D. Lỗi kết nối mạng vệ tinh"
      ],
      "correct": 1,
      "explanation": "Algorithmic bias là định kiến thuật toán, thiên lệch kết quả phân tích do dữ liệu đầu vào."
    },
    {
      "id": 2,
      "question": "Khái niệm 'Echo chamber' trên mạng xã hội là hiện tượng gì?",
      "options": [
        "A. Phòng thu âm âm nhạc chuyên nghiệp",
        "B. Buồng vang thông tin nơi người dùng chỉ nhìn thấy ý kiến cùng chiều, củng cố định kiến",
        "C. Tính năng gọi video nhóm",
        "D. Công nghệ tăng âm lượng loa"
      ],
      "correct": 1,
      "explanation": "Echo chamber là hiệu ứng buồng vang nơi người dùng bị cô lập trong các luồng thông tin một chiều."
    },
    {
      "id": 3,
      "question": "'Deepfake' là công nghệ sử dụng AI để làm gì?",
      "options": [
        "A. Tạo video giả mạo khuôn mặt và giọng nói y như thật",
        "B. Quét virus máy tính",
        "C. Nén dung lượng video",
        "D. Tự động dịch phụ đề phim"
      ],
      "correct": 0,
      "explanation": "Deepfake dùng mô hình học sâu để ghép mặt và nhái giọng tạo sản phẩm giả mạo tinh vi."
    },
    {
      "id": 4,
      "question": "Từ 'Sedentary lifestyle' chỉ lối sống như thế nào?",
      "options": [
        "A. Thường xuyên leo núi và chạy bộ",
        "B. Ngồi nhiều, lười vận động thể chất",
        "C. Ăn chay thanh đạm",
        "D. Hay đi du lịch xa"
      ],
      "correct": 1,
      "explanation": "Sedentary lifestyle là lối sống tĩnh tại, ngồi nhiều và thiếu hoạt động thể chất."
    },
    {
      "id": 5,
      "question": "Khái niệm 'Digital divide' phản ánh vấn đề gì?",
      "options": [
        "A. Sự chia tay qua tin nhắn",
        "B. Khoảng cách bất bình đẳng về điều kiện tiếp cận công nghệ giữa các nhóm người",
        "C. Việc chia nhỏ dữ liệu ra nén",
        "D. Bẻ khóa mật khẩu phần mềm"
      ],
      "correct": 1,
      "explanation": "Digital divide là khoảng cách số ngăn cách cơ hội tiếp cận công nghệ của người nghèo/vùng sâu vùng xa."
    }
  ]
},
  {
  "id": "ielts-topic-education-society",
  "title": "Từ Vựng Học Thuật Giáo Dục & Vấn Đề Đô Thị Hóa",
  "subtitle": "Học vẹt, giáo dục toàn diện, đô thị tràn lan, thượng lưu hóa & chảy máu chất xám",
  "category": "ngoai-ngu",
  "categoryLabel": "IELTS Giáo Dục & Xã Hội",
  "badge": "Kiến Thức Xã Hội 2 Xu",
  "priceXu": 2,
  "originalPriceXu": 34,
  "rating": 4.96,
  "reviewsCount": 920,
  "studentsCount": 3670,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Tuyển Tập Đề Thi Xã Hội",
    "Trắc Nghiệm Phản Xạ"
  ],
  "description": "Trang bị vốn từ xã hội học sâu sắc để phân tích các vấn đề: Rote memorization vs holistic education, brain drain, gentrification, urban sprawl, socioeconomic mobility.",
  "highlights": [
    "Chủ điểm xã hội và sư phạm luôn xuất hiện trong kỳ thi IELTS học thuật",
    "Cung cấp góc nhìn đa chiều về già hóa dân số và bình đẳng giáo dục",
    "Ví dụ lập luận sắc bén cho bài essay điểm 8.0+",
    "Trắc nghiệm rèn tư duy xã hội học"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "rote memorization /rəʊt/ (collocation)",
      "back": "Nghĩa: Cách học vẹt, học thuộc lòng máy móc không hiểu bản chất.\nVí dụ: Over-reliance on rote memorization stifles children's innate creative curiosity.",
      "tag": "IELTS Giáo Dục"
    },
    {
      "id": 2,
      "front": "holistic education /həʊˈlɪs.tɪk/ (collocation)",
      "back": "Nghĩa: Nền giáo dục toàn diện (phát triển cả trí tuệ, thể chất, cảm xúc và nhân cách).\nVí dụ: Progressive schools advocate for a holistic education that balances academics with emotional intelligence.",
      "tag": "IELTS Giáo Dục"
    },
    {
      "id": 3,
      "front": "pedagogical methodology /ˌped.əˈɡɒdʒ.ɪ.kəl/ (collocation)",
      "back": "Nghĩa: Phương pháp giảng dạy sư phạm chuyên nghiệp.\nVí dụ: Modern pedagogical methodologies emphasize interactive inquiry and collaborative project-based learning.",
      "tag": "IELTS Sư Phạm"
    },
    {
      "id": 4,
      "front": "socioeconomic mobility /ˌsəʊ.si.əʊˌiː.kəˈnɒm.ɪk/ (collocation)",
      "back": "Nghĩa: Sự thăng tiến địa vị kinh tế - xã hội của cá nhân (vươn lên từ nghèo khó).\nVí dụ: Equal access to high-quality tertiary education is the primary catalyst for upward socioeconomic mobility.",
      "tag": "IELTS Xã Hội"
    },
    {
      "id": 5,
      "front": "uncontrolled urban sprawl /sp 遅く/ (collocation)",
      "back": "Nghĩa: Hiện tượng đô thị hóa tràn lan, mở rộng tự phát mất kiểm soát về vùng ven.\nVí dụ: Uncontrolled urban sprawl devours fertile farmland and strains municipal transportation networks.",
      "tag": "IELTS Đô Thị Hóa"
    },
    {
      "id": 6,
      "front": "gentrification /ˌdʒen.trɪ.fɪˈkeɪ.ʃən/ (noun)",
      "back": "Nghĩa: Sự thượng lưu hóa đô thị (nâng cấp khu ổ chuột nghèo thành khu cao cấp, đẩy người nghèo bản địa đi nơi khác vì giá nhà quá đắt).\nVí dụ: Rapid gentrification in inner cities displaces long-term low-income residents.",
      "tag": "IELTS Đô Thị Hóa"
    },
    {
      "id": 7,
      "front": "aging population / demographic winter (collocation)",
      "back": "Nghĩa: Dân số già hóa, tỷ lệ sinh giảm mạnh dẫn tới thiếu hụt lao động trẻ.\nVí dụ: An aging population places an unbearable strain on public pension funds and geriatric healthcare systems.",
      "tag": "IELTS Dân Số"
    },
    {
      "id": 8,
      "front": "meritocracy /ˌmer.ɪˈtɒk.rə.si/ (noun)",
      "back": "Nghĩa: Chế độ trọng nhân tài, đãi ngộ và thăng chức dựa trên năng lực và thực tài thay vì ô dù/quan hệ.\nVí dụ: Fostering a genuine meritocracy ensures that underprivileged students can compete fairly.",
      "tag": "IELTS Quản Trị Xã Hội"
    },
    {
      "id": 9,
      "front": "academic disparity /dɪˈspær.ə.ti/ (collocation)",
      "back": "Nghĩa: Sự chênh lệch, phân hóa khoảng cách chất lượng học tập giữa các trường/vùng miền.\nVí dụ: Bridging the academic disparity between rural schools and elite private academies is a moral imperative.",
      "tag": "IELTS Giáo Dục"
    },
    {
      "id": 10,
      "front": "civic engagement /ˈsɪv.ɪk/ (collocation)",
      "back": "Nghĩa: Sự tham gia tích cực của công dân vào các hoạt động cộng đồng và xã hội.\nVí dụ: High schools should cultivate civic engagement through community service and youth volunteer initiatives.",
      "tag": "IELTS Trách Nhiệm Xã Hội"
    },
    {
      "id": 11,
      "front": "subsidize tuition fees /ˈsʌb.sɪ.daɪz/ (collocation)",
      "back": "Nghĩa: Trợ cấp học phí đại học bằng ngân sách nhà nước.\nVí dụ: By subsidizing tuition fees for STEM fields, the nation accelerates its transition to high-tech manufacturing.",
      "tag": "IELTS Chính Sách Học Phí"
    },
    {
      "id": 12,
      "front": "brain drain /breɪn dreɪn/ (noun)",
      "back": "Nghĩa: Hiện tượng chảy máu chất xám (nhân tài và chuyên gia giỏi di cư ra nước ngoài sinh sống).\nVí dụ: Low academic salaries and lack of research funding exacerbate brain drain in developing countries.",
      "tag": "IELTS Chảy Máu Chất Xám"
    },
    {
      "id": 13,
      "front": "extracurricular activities (collocation)",
      "back": "Nghĩa: Các hoạt động ngoại khóa ngoài giờ học (thể thao, âm nhạc, tình nguyện).\nVí dụ: Participating in extracurricular activities equips students with essential teamwork and leadership skills.",
      "tag": "IELTS Học Sinh"
    },
    {
      "id": 14,
      "front": "affordable housing crisis (collocation)",
      "back": "Nghĩa: Khủng hoảng thiếu hụt nhà ở giá cả phải chăng cho người thu nhập thấp.\nVí dụ: The affordable housing crisis forces young workers to endure two-hour daily commutes from distant suburbs.",
      "tag": "IELTS Nhà Ở"
    },
    {
      "id": 15,
      "front": "lifelong learning mindset (collocation)",
      "back": "Nghĩa: Tư duy học tập suốt đời (không ngừng cập nhật kỹ năng mới khi công nghệ thay đổi).\nVí dụ: In an era dominated by AI automation, cultivating a lifelong learning mindset is the only path to career security.",
      "tag": "IELTS Phát Triển Bản Thân"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Thuật ngữ 'Rote memorization' chỉ phương pháp học tập nào?",
      "options": [
        "A. Học thông qua trải nghiệm thực tế",
        "B. Học vẹt, học thuộc lòng máy móc",
        "C. Học nhóm thảo luận",
        "D. Học qua video mô phỏng"
      ],
      "correct": 1,
      "explanation": "Rote memorization là lối học vẹt, học tủ không thấu hiểu bản chất tư duy."
    },
    {
      "id": 2,
      "question": "'Brain drain' trong xã hội học là hiện tượng gì?",
      "options": [
        "A. Chảy máu chất xám nhân tài di cư ra nước ngoài",
        "B. Mệt mỏi do học bài thi cử quá độ",
        "C. Đột quỵ do căng thẳng",
        "D. Sự gia tăng người mắc bệnh mất trí nhớ"
      ],
      "correct": 0,
      "explanation": "Brain drain là sự di cư của các chuyên gia và nhân tài giỏi từ nước nghèo sang nước giàu."
    },
    {
      "id": 3,
      "question": "Từ 'Gentrification' trong quy hoạch đô thị diễn tả quá trình gì?",
      "options": [
        "A. Sự thượng lưu hóa các khu dân cư nghèo, đẩy giá nhà lên cao",
        "B. Trồng thêm cây xanh ven đường",
        "C. Xây dựng thêm trường học tiểu học",
        "D. Ô nhiễm khói bụi nhà máy"
      ],
      "correct": 0,
      "explanation": "Gentrification là quá trình cải tạo khiến khu vực trở nên sang chảnh đắt đỏ, đẩy cư dân nghèo đi."
    },
    {
      "id": 4,
      "question": "'Meritocracy' là xã hội vận hành dựa trên nguyên tắc nào?",
      "options": [
        "A. Dựa trên gia thế và ô dù quan hệ",
        "B. Dựa trên năng lực thực tài và phẩm chất cống hiến",
        "C. Dựa trên tuổi tác lâu năm",
        "D. Dựa trên việc phân chia may rủi"
      ],
      "correct": 1,
      "explanation": "Meritocracy là chế độ trọng dụng nhân tài thực sự dựa trên năng lực cá nhân."
    },
    {
      "id": 5,
      "question": "Mô hình giáo dục 'Holistic education' chú trọng điều gì?",
      "options": [
        "A. Chỉ tập trung vào điểm số toán học",
        "B. Giáo dục toàn diện cả thể chất, trí tuệ và nhân cách",
        "C. Chỉ dạy kỹ năng kiếm tiền",
        "D. Ép học sinh học thêm ban đêm"
      ],
      "correct": 1,
      "explanation": "Holistic education là nền giáo dục toàn diện, phát triển toàn bộ tiềm năng con người."
    }
  ]
},
  {
  "id": "ielts-reading-academic-speed",
  "title": "Kỹ Năng Paraphrase & Từ Vựng Bẫy IELTS Reading Academic",
  "subtitle": "Bẫy True/False/Not Given, bẫy mức độ tuyệt đối & kỹ thuật Matching Headings",
  "category": "ngoai-ngu",
  "categoryLabel": "IELTS Reading Chiến Thuật",
  "badge": "Bẻ Khóa Reading 2 Xu",
  "priceXu": 2,
  "originalPriceXu": 36,
  "rating": 4.98,
  "reviewsCount": 1390,
  "studentsCount": 4890,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Bảng Phân Biệt T/F/NG",
    "Trắc Nghiệm Đọc Hiểu"
  ],
  "description": "Xóa tan nỗi sợ bẫy True/False/Not Given và Matching Headings. Nắm vững kỹ thuật nhận diện bẫy phóng đại mức độ, bẫy bốc từ (word matching) và cặp từ đồng nghĩa C1-C2.",
  "highlights": [
    "Bí quyết phân biệt rạch ròi giữa False và Not Given không bao giờ sai",
    "Mẹo tránh bẫy bốc từ giống hệt trong câu Matching Headings",
    "Bộ từ đồng nghĩa học thuật tần suất cao trong bài đọc khoa học",
    "Trắc nghiệm thực chiến rèn kỹ năng suy luận logic"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[Bẫy True / False / Not Given] Bẫy Mức độ tuyệt đối (100% vs Thường thường)?",
      "back": "⚠️ BẪY KINH ĐIỂN:\n• Bài đọc dùng từ xác suất: Likely, Often, Tend to, Generally, Many, Most.\n• Câu hỏi đề bài dùng từ tuyệt đối: Always, Never, All, Solely, Exclusively, Impossible.\n-> KẾT QUẢ THƯỜNG LÀ: FALSE (vì câu hỏi đã phóng đại mức độ quá giới hạn sự thật)!",
      "tag": "Reading Bẫy T/F/NG"
    },
    {
      "id": 2,
      "front": "[Bẫy True / False / Not Given] Khi nào chọn \"NOT GIVEN\"?",
      "back": "Chọn NOT GIVEN khi:\n1. Thông tin có trong câu hỏi nhưng BÀI ĐỌC HOÀN TOÀN KHÔNG ĐỀ CẬP hoặc không so sánh.\n2. Phép so sánh 'hơn' (more than, faster than) có trong câu hỏi nhưng bài đọc chỉ nêu hai đối tượng mà KHÔNG hề nói ai hơn ai!\n⚠️ Nhớ: Không tự suy diễn bằng kiến thức đời thực ngoài bài đọc!",
      "tag": "Reading Bẫy Not Given"
    },
    {
      "id": 3,
      "front": "[Paraphrase Reading] \"Substantial / Significant\" trong bài đọc đổi thành gì?",
      "back": "Cặp từ đồng nghĩa hay gặp:\n• Substantial / Significant -> CONSIDERABLE / MARKED / NOTICEABLE / APPRECIABLE.\nVí dụ: \"A substantial decline in population\" -> \"A marked decrease in inhabitant numbers.\"",
      "tag": "Paraphrase Mức Độ"
    },
    {
      "id": 4,
      "front": "[Paraphrase Reading] \"Inherent / Intrinsic\" đổi thành gì?",
      "back": "• Inherent / Intrinsic -> INNATE / INBORN / BUILT-IN / HARDWIRED / ESSENTIAL.\nVí dụ: \"Curiosity is an inherent human trait\" -> \"The desire to explore is innate in people.\"",
      "tag": "Paraphrase Bản Chất"
    },
    {
      "id": 5,
      "front": "[Paraphrase Reading] \"Hazardous / Perilous\" đổi thành gì?",
      "back": "• Hazardous / Perilous -> DANGEROUS / RISKY / PRECARIOUS / DETRIMENTAL.\nVí dụ: \"The expedition faced perilous conditions\" -> \"Explorers encountered hazardous weather.\"",
      "tag": "Paraphrase Nguy Hiểm"
    },
    {
      "id": 6,
      "front": "[Paraphrase Reading] \"Prevalent / Pervasive\" đổi thành gì?",
      "back": "• Prevalent / Pervasive -> WIDESPREAD / RIFE / COMMONLY FOUND / OMNIPRESENT.\nVí dụ: \"The belief is prevalent among tribes\" -> \"The view is widespread within the community.\"",
      "tag": "Paraphrase Phổ Biến"
    },
    {
      "id": 7,
      "front": "[Paraphrase Reading] \"Novel / Pioneering\" đổi thành gì?",
      "back": "• Novel / Pioneering -> UNPRECEDENTED / GROUNDBREAKING / INNOVATIVE / BRAND-NEW.\nVí dụ: \"A novel surgical technique\" -> \"A pioneering medical procedure.\"",
      "tag": "Paraphrase Đột Phá"
    },
    {
      "id": 8,
      "front": "[Bẫy Matching Headings] Mẹo tránh bẫy bốc từ (Word Matching Trap)?",
      "back": "⚠️ CẢNH BÁO BẪY: Tiêu đề nào CHỨA NGUYÊN VĂN 1-2 từ y hệt trong đoạn văn thường là BẪY GÀI! Người ra đề cố tình đặt từ trùng khớp để bẫy thí sinh đọc lướt.\n📌 Bí quyết: Tiêu đề đúng là tiêu đề PARAPHRASE lại ý bao quát của cả đoạn, thường nằm ở câu chủ đề (Topic sentence) hoặc câu tổng kết.",
      "tag": "Reading Matching Headings"
    },
    {
      "id": 9,
      "front": "[Paraphrase Reading] \"Dormant\" đổi thành gì?",
      "back": "• Dormant -> INACTIVE / LATENT / ASLEEP / SUSPENDED.\nVí dụ: \"A dormant volcano\" -> \"An inactive volcanic crater that has not erupted for centuries.\"",
      "tag": "Paraphrase Khoa Học"
    },
    {
      "id": 10,
      "front": "[Paraphrase Reading] \"Scarce / Deficient\" đổi thành gì?",
      "back": "• Scarce / Deficient -> IN SHORT SUPPLY / MEAGER / INSUFFICIENT / SPARSE.\nVí dụ: \"Water resources are scarce in the arid zone\" -> \"Moisture is in meager supply.\"",
      "tag": "Paraphrase Khan Hiếm"
    },
    {
      "id": 11,
      "front": "[Bẫy Thời Gian] Phân biệt \"Contemporary\" vs \"Temporary\"?",
      "back": "⚠️ Cặp từ rất hay nhầm lẫn:\n• CONTEMPORARY /kənˈtem.pər.ər.i/: Đương thời, đương đại (hiện đại, cùng thời kỳ).\n• TEMPORARY /ˈtem.pər.ər.i/: Tạm thời, ngắn hạn (trái nghĩa với permanent - vĩnh viễn).",
      "tag": "Reading Bẫy Từ Vựng"
    },
    {
      "id": 12,
      "front": "[Paraphrase Reading] \"Thrive / Flourish\" đổi thành gì?",
      "back": "• Thrive / Flourish -> PROSPER / BLOOM / BURGEON / SUCCEED RAPIDLY.\nVí dụ: \"Coral species thrive in warm shallows\" -> \"Marine organisms flourish under optimal temperatures.\"",
      "tag": "Paraphrase Sinh Học"
    },
    {
      "id": 13,
      "front": "[Bẫy Matching Features / Names] Kỹ thuật scan tên riêng học giả?",
      "back": "1. Khoanh tròn tất cả tên các nhà khoa học trong bài đọc (viết hoa chữ cái đầu).\n2. Đọc kỹ câu chứa động từ tường thuật của nhà khoa học đó: argued, concluded, demonstrated, hypothesized.\n3. Đối chiếu ý kiến đó với các nhận định trong danh sách câu hỏi.",
      "tag": "Reading Kỹ Thuật Scan"
    },
    {
      "id": 14,
      "front": "[Paraphrase Reading] \"Vulnerable / Susceptible\" đổi thành gì?",
      "back": "• Vulnerable / Susceptible to -> PRONE TO / DEFENSELESS / EXPOSED TO / AT RISK OF.\nVí dụ: \"Coastal lowlands are vulnerable to flooding\" -> \"Dwellings are prone to storm surges.\"",
      "tag": "Paraphrase Dễ Bị Tổn Thương"
    },
    {
      "id": 15,
      "front": "[Paraphrase Reading] \"Detrimental / Deleterious\" đổi thành gì?",
      "back": "• Detrimental / Deleterious -> HARMFUL / ADVERSE / DAMAGING / INJURIOUS.\nVí dụ: \"Fossil emissions have a detrimental impact on ozone\" -> \"Pollutants produce adverse atmospheric effects.\"",
      "tag": "Paraphrase Tác Hại"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Trong bài thi Reading, nếu bài đọc viết: 'Many scientists believe...', còn câu hỏi viết: 'All scientists agree...', đáp án là:",
      "options": [
        "A. TRUE",
        "B. FALSE",
        "C. NOT GIVEN",
        "D. Cả A và B đều đúng"
      ],
      "correct": 1,
      "explanation": "Câu hỏi đã phóng đại từ 'Many' (nhiều) thành 'All' (tất cả 100%), mâu thuẫn với bài đọc nên là FALSE."
    },
    {
      "id": 2,
      "question": "Từ 'Detrimental' trong bài đọc đồng nghĩa với từ nào sau đây?",
      "options": [
        "A. Beneficial",
        "B. Adverse / Harmful",
        "C. Inherent",
        "D. Contemporary"
      ],
      "correct": 1,
      "explanation": "Detrimental = Harmful / Adverse (có hại, gây bất lợi)."
    },
    {
      "id": 3,
      "question": "Phân biệt nghĩa của 'Contemporary':",
      "options": [
        "A. Tạm thời trong vài ngày",
        "B. Thuộc về đương thời, hiện đại",
        "C. Vĩnh viễn không thay đổi",
        "D. Rất nguy hiểm"
      ],
      "correct": 1,
      "explanation": "Contemporary có nghĩa là đương đại, cùng thời kỳ (tránh nhầm với temporary là tạm thời)."
    },
    {
      "id": 4,
      "question": "Khi bài đọc chỉ nói công ty A và công ty B cùng sản xuất pin, câu hỏi khẳng định công ty A làm pin tốt hơn B, chọn gì?",
      "options": [
        "A. TRUE",
        "B. FALSE",
        "C. NOT GIVEN",
        "D. KHÔNG XÁC ĐỊNH"
      ],
      "correct": 2,
      "explanation": "Bài đọc không hề đưa ra sự so sánh ai tốt hơn ai, do đó đáp án chuẩn xác là NOT GIVEN."
    },
    {
      "id": 5,
      "question": "Cặp từ nào sau đây là từ đồng nghĩa hoàn hảo trong bài thi Reading?",
      "options": [
        "A. Novel và Groundbreaking",
        "B. Scarce và Abundant",
        "C. Vulnerable và Immune",
        "D. Dormant và Active"
      ],
      "correct": 0,
      "explanation": "Novel và Groundbreaking đều mang nghĩa mới mẻ, đột phá chưa từng có."
    }
  ]
},
  {
  "id": "sat-words-in-context-core",
  "title": "Từ Vựng SAT Words in Context Bẫy Sắc Thái Nghĩa Cực Khó",
  "subtitle": "Qualify, intimate, patent, gravity, plastic, pedestrian, temper & exacting",
  "category": "ngoai-ngu",
  "categoryLabel": "Digital SAT Chuyên Sâu",
  "badge": "SAT 1500+ Prep 3 Xu",
  "priceXu": 3,
  "originalPriceXu": 45,
  "rating": 4.99,
  "reviewsCount": 1780,
  "studentsCount": 5910,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Tuyển Tập Words in Context SAT",
    "Trắc Nghiệm Sắc Thái"
  ],
  "description": "Chinh phục dạng bài khó chịu nhất của Digital SAT Reading: Words in Context. Bộ thẻ giải mã những từ ngữ tưởng chừng quen thuộc nhưng mang tầng nghĩa học thuật hoàn toàn khác.",
  "highlights": [
    "Giải mã các nghĩa ẩn ngữ cảnh của qualify, patent, intimate, sound, gravity",
    "Ví dụ trích từ các bài đọc khoa học xã hội và văn học chuẩn College Board",
    "Phương pháp phân tích ngữ cảnh để suy ra tầng nghĩa chính xác nhất",
    "Trắc nghiệm rèn luyện cảm thụ ngôn ngữ tinh tế"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[SAT Words in Context] \"Qualify\" mang nghĩa gì ngoài 'đủ tiêu chuẩn'?",
      "back": "Nghĩa ngữ cảnh SAT: GIẢM NHẸ MỨC ĐỘ, ĐƯA THÊM ĐIỀU KIỆN GIỚI HẠN cho một nhận định (to limit, moderate, or soften a statement).\nVí dụ câu SAT: The researcher qualified her enthusiastic claims, acknowledging that sample size was limited.",
      "tag": "SAT Nghĩa Ngữ Cảnh"
    },
    {
      "id": 2,
      "front": "[SAT Words in Context] \"Intimate\" là động từ mang nghĩa gì?",
      "back": "Nghĩa ngữ cảnh SAT: GỢI Ý NGẦM, ÁM CHỈ MỘT CÁCH KÍN ĐÁO (hint, imply, suggest discreetly).\nPhát âm động từ: /ˈɪn.tɪ.meɪt/ (khác tính từ thân mật /ˈɪn.tɪ.mət/).\nVí dụ: The editorial intimated that the mayor might resign ahead of the upcoming election.",
      "tag": "SAT Động Từ Đa Nghĩa"
    },
    {
      "id": 3,
      "front": "[SAT Words in Context] \"Patent\" mang nghĩa tính từ là gì?",
      "back": "Nghĩa tính từ trong SAT: RÕ RÀNG HIỂN NHIÊN, KHÔNG THỂ CHỐI CÃI (obvious, glaring, undeniable).\nVí dụ: His claim of ignorance was a patent falsehood that convinced neither the judge nor the jury.",
      "tag": "SAT Tính Từ Độc Lạ"
    },
    {
      "id": 4,
      "front": "[SAT Words in Context] \"Gravity\" mang nghĩa gì ngoài 'trọng lực'?",
      "back": "Nghĩa ngữ cảnh SAT: MỨC ĐỘ NGHIÊM TRỌNG, TÍNH CHẤT NẶNG NỀ của một tình huống (seriousness, solemnity).\nVí dụ: The cabinet members failed to grasp the grave gravity of the unfolding financial crisis.",
      "tag": "SAT Nghĩa Bóng"
    },
    {
      "id": 5,
      "front": "[SAT Words in Context] \"Plastic / Plasticity\" mang nghĩa bóng gì?",
      "back": "Nghĩa ngữ cảnh SAT: TÍNH DỄ UỐN NẮN, DỄ THAY ĐỔI THEO MÔI TRƯỜNG (malleable, adaptable, flexible).\nThuật ngữ khoa học: Neural plasticity (tính khả biến của não bộ).\nVí dụ: The human brain exhibits remarkable plastic properties during early cognitive development.",
      "tag": "SAT Thuật Ngữ Trừu Tượng"
    },
    {
      "id": 6,
      "front": "[SAT Words in Context] \"Arrest\" mang nghĩa gì ngoài 'bắt giữ tội phạm'?",
      "back": "Nghĩa ngữ cảnh SAT: 1. NGĂN CHẶN, LÀM CHẬM LẠI một tiến trình (stop, halt); 2. THU HÚT SỰ CHÚ Ý (arresting gaze).\nVí dụ: Modern antimicrobial drugs arrested the spread of the viral epidemic.",
      "tag": "SAT Từ Vựng Tinh Vi"
    },
    {
      "id": 7,
      "front": "[SAT Words in Context] \"Champion\" dùng như một động từ mang nghĩa gì?",
      "back": "Nghĩa ngữ cảnh SAT: TÍCH CỰC ĐẤU TRANH ỦNG HỘ CHO MỘT LÝ TƯỞNG / CHÍNH SÁCH (advocate, support fiercely).\nVí dụ: The activist championed universal public healthcare for over three decades.",
      "tag": "SAT Động Từ Nâng Cao"
    },
    {
      "id": 8,
      "front": "[SAT Words in Context] \"Pedestrian\" mang nghĩa tính từ là gì?",
      "back": "Nghĩa tính từ SAT: TẺ NHẠT, ĐƠN ĐIỆU, TẦM THƯỜNG THIẾU TÍNH SÁNG TẠO (mundane, dull, uninspired).\nVí dụ: The novel's dialogue was criticized as thoroughly pedestrian and formulaic.",
      "tag": "SAT Bẫy Tính Từ"
    },
    {
      "id": 9,
      "front": "[SAT Words in Context] \"Temper\" dùng như một động từ mang nghĩa gì?",
      "back": "Nghĩa ngữ cảnh SAT: TIẾT CHẾ, LÀM DỊU BỚT mức độ gay gắt hoặc cực đoan (moderate, soften).\nVí dụ: The professor tempered her harsh criticism with encouragement and constructive guidance.",
      "tag": "SAT Động Từ Học Thuật"
    },
    {
      "id": 10,
      "front": "[SAT Words in Context] \"Exacting\" nghĩa là gì?",
      "back": "Nghĩa SAT: ĐÒI HỎI TIÊU CHUẨN CỰC KỲ KHẮC KHE, tỉ mỉ đòi hỏi độ chính xác tuyệt đối (demanding, rigorous, stringent).\nVí dụ: Conducting deep-space astrophysics experiments requires exacting mathematical precision.",
      "tag": "SAT Tính Từ Học Giả"
    },
    {
      "id": 11,
      "front": "[SAT Words in Context] \"Currency\" mang nghĩa gì ngoài 'tiền tệ'?",
      "back": "Nghĩa ngữ cảnh SAT: TÍNH PHỔ BIẾN, SỰ CHẤP NHẬN RỘNG RÃI của một ý tưởng hoặc niềm tin (widespread acceptance / prevalence).\nVí dụ: The controversial socioeconomic theory gained widespread currency among academics in the late 19th century.",
      "tag": "SAT Nghĩa Triết Học"
    },
    {
      "id": 12,
      "front": "[SAT Words in Context] \"Affecting\" mang nghĩa gì ngoài 'ảnh hưởng'?",
      "back": "Nghĩa tính từ SAT: XÚC ĐỘNG SÂU SẮC, CHẠM TỚI TÂM CAN (deeply moving, poignant, emotionally touching).\nVí dụ: The cellist delivered an intensely affecting performance that brought the audience to tears.",
      "tag": "SAT Tính Từ Cảm Xúc"
    },
    {
      "id": 13,
      "front": "[SAT Words in Context] \"Compelling\" mang nghĩa gì ngoài 'hấp dẫn'?",
      "back": "Nghĩa ngữ cảnh SAT: MANG TÍNH THUYẾT PHỤC KHÔNG THỂ BÁC BỎ ĐƯỢC (convincing, irresistible, undeniable).\nCollocation: Compelling evidence (bằng chứng đanh thép), Compelling argument.\nVí dụ: The geneticist presented compelling empirical evidence supporting her evolutionary hypothesis.",
      "tag": "SAT Lập Luận Đanh Thép"
    },
    {
      "id": 14,
      "front": "[SAT Words in Context] \"Sound\" mang nghĩa tính từ là gì?",
      "back": "Nghĩa tính từ SAT: VỮNG CHẮC, ĐÁNG TIN CẬY, HOÀN TOÀN HỢP LOGIC KHÔNG CÓ KHIẾM KHUYẾT (logically valid, robust, reliable).\nVí dụ: The engineering committee concluded that the bridge design was architecturally sound.",
      "tag": "SAT Tính Từ Logic"
    },
    {
      "id": 15,
      "front": "[SAT Words in Context] \"Compromise\" mang nghĩa suy giảm an toàn?",
      "back": "Nghĩa ngữ cảnh SAT: LÀM YẾU ĐI, ĐẶT VÀO VỊ TRÍ NGUY HIỂM / LỖ HỔNG (undermine, weaken, jeopardize).\nVí dụ: Chemotherapy can compromise a patient's immune system, making them susceptible to opportunistic infections.",
      "tag": "SAT Khoa Học & Y Sinh"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Trong bài thi SAT, động từ 'to qualify a statement' có nghĩa là gì?",
      "options": [
        "A. Thi đỗ chứng chỉ",
        "B. Giới hạn, giảm nhẹ hoặc bổ sung điều kiện để nhận định không bị tuyệt đối hóa",
        "C. Phê phán gay gắt đối thủ",
        "D. Xác nhận tính pháp lý"
      ],
      "correct": 1,
      "explanation": "Qualify a statement nghĩa là đưa thêm điều kiện giới hạn, làm dịu bớt tính tuyệt đối của tuyên bố."
    },
    {
      "id": 2,
      "question": "Tính từ 'Pedestrian' khi dùng miêu tả một cuốn tiểu thuyết mang nghĩa là:",
      "options": [
        "A. Viết về người đi bộ qua đường",
        "B. Đầy tính đột phá",
        "C. Đơn điệu, tẻ nhạt, thiếu tính sáng tạo",
        "D. Rất đắt tiền"
      ],
      "correct": 2,
      "explanation": "Pedestrian (adj) mang nghĩa là tầm thường, đơn điệu, không có gì nổi bật."
    },
    {
      "id": 3,
      "question": "Từ 'Intimate' khi đóng vai trò là một động từ mang nghĩa:",
      "options": [
        "A. Trở nên thân mật",
        "B. Gợi ý ngầm, ám chỉ một cách kín đáo",
        "C. Bắt giữ phạm nhân",
        "D. Đe dọa bạo lực"
      ],
      "correct": 1,
      "explanation": "To intimate (v) nghĩa là ám chỉ kín đáo, gợi ý ngầm (hint / imply)."
    },
    {
      "id": 4,
      "question": "Cụm 'patent falsehood' trong văn bản SAT nghĩa là gì?",
      "options": [
        "A. Bằng sáng chế độc quyền",
        "B. Lời nói dối rành rành hiển nhiên ai cũng thấy",
        "C. Sai sót kỹ thuật nhỏ",
        "D. Lỗi do máy in"
      ],
      "correct": 1,
      "explanation": "Patent (adj) = obvious, glaring (rõ ràng hiển nhiên không thể chối cãi)."
    },
    {
      "id": 5,
      "question": "Tính từ 'Sound' trong 'a sound argument' có nghĩa là:",
      "options": [
        "A. Lập luận ồn ào",
        "B. Lập luận chặt chẽ, hợp logic và đáng tin cậy",
        "C. Lập luận sai lầm hoàn toàn",
        "D. Lập luận bằng âm thanh"
      ],
      "correct": 1,
      "explanation": "Sound (adj) nghĩa là hợp lý, vững chắc, không có lỗ hổng logic."
    }
  ]
},
  {
  "id": "sat-transitions-synthesis",
  "title": "Liên Từ Logic & Kỹ Thuật Transitions Digital SAT Writing",
  "subtitle": "However, consequently, furthermore, indeed, concurrently, still & rather",
  "category": "ngoai-ngu",
  "categoryLabel": "SAT Writing & Transitions",
  "badge": "SAT Logic Tuyệt Kỹ 2 Xu",
  "priceXu": 2,
  "originalPriceXu": 35,
  "rating": 4.98,
  "reviewsCount": 1120,
  "studentsCount": 4120,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Sơ Đồ Phân Loại Transitions SAT",
    "Trắc Nghiệm Liên Từ"
  ],
  "description": "Ăn trọn 100% điểm phần câu hỏi Transitions trong Digital SAT Writing. Nắm vững mẹo loại trừ cặp từ sinh đôi (twin words elimination) và các từ nối tương phản, bổ sung, nhân quả.",
  "highlights": [
    "Phân loại toàn diện 4 nhóm liên từ logic xuất hiện trong đề thi SAT",
    "Chiêu bài loại trừ 2 đáp án đồng nghĩa hoàn toàn trong 3 giây",
    "Phân biệt chính xác giữa Indeed (nhấn mạnh) vs Conversely (đối lập)",
    "Trắc nghiệm rèn tư duy logic chuẩn mực"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[SAT Transitions] Các liên từ chỉ MỐI QUAN HỆ TƯƠNG PHẢN (Contrast)?",
      "back": "• HOWEVER, NONETHELESS, NEVERTHELESS: Tuy nhiên, dẫu vậy.\n• ON THE OTHER HAND, CONVERSELY: Mặt khác, ngược lại.\n• NOTWITHSTANDING: Mặc dù vậy.\n• INSTEAD, RATHER: Thay vào đó (thường dùng sau câu phủ định).\nVí dụ SAT: Early astronomers believed Mars was wet; HOWEVER, modern rovers revealed an arid wasteland.",
      "tag": "Transitions Tương Phản"
    },
    {
      "id": 2,
      "front": "[SAT Transitions] Các liên từ chỉ NGUYÊN NHÂN - HỆ QUẢ (Cause and Effect)?",
      "back": "• THEREFORE, CONSEQUENTLY, THUS: Do đó, vì vậy, kết quả là.\n• HENCE, ACCORDINGLY: Theo đó, vì lý do đó.\n• AS A RESULT: Hệ quả tất yếu là.\nVí dụ SAT: The temperature dropped below freezing; CONSEQUENTLY, ice formed across the wings.",
      "tag": "Transitions Nhân Quả"
    },
    {
      "id": 3,
      "front": "[SAT Transitions] Các liên từ BỔ SUNG & ĐỒNG THUẬN (Addition & Reinforcement)?",
      "back": "• FURTHERMORE, MOREOVER: Hơn nữa, ngoài ra (thêm luận điểm mạnh hơn).\n• IN ADDITION, BESIDES: Thêm vào đó.\n• LIKEWISE, SIMILARLY: Tương tự như vậy.\nVí dụ: The new algorithm accelerates query speed; FURTHERMORE, it consumes 30% less server memory.",
      "tag": "Transitions Bổ Sung"
    },
    {
      "id": 4,
      "front": "[SAT Transitions] Các liên từ MINH HỌA & CỤ THỂ HÓA (Exemplification / Clarification)?",
      "back": "• FOR INSTANCE, FOR EXAMPLE: Ví dụ minh họa là.\n• SPECIFICALLY, IN PARTICULAR: Cụ thể hơn là.\n• THAT IS, IN OTHER WORDS: Nói cách khác (giải thích lại ý trước bằng cách dễ hiểu hơn).\nVí dụ: Many desert organisms possess moisture-saving traits; SPECIFICALLY, the kangaroo rat metabolizes dry seeds into water.",
      "tag": "Transitions Minh Họa"
    },
    {
      "id": 5,
      "front": "[SAT Transitions] Khi nào chọn \"INDEED / IN FACT\" trong Digital SAT?",
      "back": "Dùng INDEED / IN FACT khi câu thứ hai NHẤN MẠNH VÀ XÁC NHẬN MẠNH MẼ HƠN nhận định ở câu thứ nhất (không phải tương phản!).\nVí dụ: The archaeological find was thought to be significant; INDEED, it revolutionized our timeline of early human metallurgy.",
      "tag": "Transitions Nhấn Mạnh"
    },
    {
      "id": 6,
      "front": "[SAT Transitions] Phân biệt \"CONCURRENTLY\" vs \"SUBSEQUENTLY\"?",
      "back": "• CONCURRENTLY / SIMULTANEOUSLY: Diễn ra ĐỒNG THỜI CÙNG LÚC với sự việc kia.\n• SUBSEQUENTLY / THEREAFTER: Diễn ra SAU ĐÓ theo thứ tự thời gian.\nVí dụ: The author was writing a novel; CONCURRENTLY, she was editing an academic journal.",
      "tag": "Transitions Trình Tự"
    },
    {
      "id": 7,
      "front": "[SAT Transitions] Khi nào chọn \"STILL\" hoặc \"EVEN SO\" đứng đầu câu?",
      "back": "Dùng để thể hiện sự thừa nhận nhượng bộ: Dù sự thật ở câu 1 có đúng đi nữa, thì điều ở câu 2 VẪN TIẾP DIỄN KHÔNG THAY ĐỔI.\nVí dụ: The startup faced brutal competition from tech behemoths; STILL, it secured 50,000 active subscribers.",
      "tag": "Transitions Nhượng Bộ"
    },
    {
      "id": 8,
      "front": "[SAT Transitions] Kỹ thuật loại trừ 2 từ đồng nghĩa (The Twin Words Elimination Trick)?",
      "back": "⚠️ CHIÊU BÀI SAT: Nếu trong 4 đáp án có 2 đáp án mang nghĩa và chức năng logic HOÀN TOÀN Y HỆT NHAU (Ví dụ: A. Furthermore vs B. Moreover, hoặc C. Therefore vs D. Consequently):\n-> BẠN CÓ THỂ LOẠI BỎ NGAY CẢ 2 ĐÁP ÁN NÀY! Vì đề thi chuẩn hóa chỉ có 1 đáp án duy nhất đúng.",
      "tag": "SAT Kỹ Thuật Loại Trừ"
    },
    {
      "id": 9,
      "front": "[SAT Transitions] Khi nào chọn \"RATHER\" đứng đầu câu?",
      "back": "RATHER thường đứng đầu câu sau một câu có CHỨA PHỦ ĐỊNH (not, no, did not) để đính chính sự thật đúng đắn.\nVí dụ: The painting was not a forgery; RATHER, it was an authentic work from Leonardo's early apprenticeship.",
      "tag": "Transitions Đính Chính"
    },
    {
      "id": 10,
      "front": "[SAT Transitions] \"GRANTED\" đứng đầu câu trong SAT có nghĩa là gì?",
      "back": "Nghĩa: Phải thừa nhận rằng, đúng là như vậy (Admittedly - đưa ra một luận điểm nhượng bộ trước khi phản bác lại).\nVí dụ: GRANTED, the prototype requires further testing; however, its initial benchmark results are remarkably encouraging.",
      "tag": "Transitions Lập Luận Cao Cấp"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Điền liên từ: 'The vaccine had no adverse effects; ______, it generated robust antibody immunity.'",
      "options": [
        "A. Indeed",
        "B. Conversely",
        "C. However",
        "D. In contrast"
      ],
      "correct": 0,
      "explanation": "Câu thứ hai củng cố và nhấn mạnh mạnh mẽ hơn tác dụng tuyệt vời của vắc-xin -> Chọn Indeed."
    },
    {
      "id": 2,
      "question": "Khi hai đáp án trong câu hỏi Transitions là 'Furthermore' và 'Moreover', mẹo làm bài là gì?",
      "options": [
        "A. Chọn từ dài hơn",
        "B. Loại trừ cả hai đáp án vì chúng có chức năng logic hoàn toàn giống nhau",
        "C. Chọn từ đứng trước",
        "D. Luôn chọn Furthermore"
      ],
      "correct": 1,
      "explanation": "Cả hai từ đều dùng để bổ sung luận điểm tương đương; nếu một trong hai đúng thì từ kia cũng đúng, do đó cả hai đều bị loại."
    },
    {
      "id": 3,
      "question": "Từ nối 'Concurrently' mang nghĩa là gì?",
      "options": [
        "A. Xảy ra sau đó",
        "B. Diễn ra đồng thời cùng lúc",
        "C. Hoàn toàn trái ngược",
        "D. Vì lý do đó"
      ],
      "correct": 1,
      "explanation": "Concurrently = Simultaneously (đồng thời xảy ra tại cùng một thời điểm)."
    },
    {
      "id": 4,
      "question": "Chọn từ nối thích hợp: 'The experiment did not fail; ______, it yielded an unexpected discovery.'",
      "options": [
        "A. Rather",
        "B. Concurrently",
        "C. Similarly",
        "D. For instance"
      ],
      "correct": 0,
      "explanation": "Sau mệnh đề phủ định 'did not fail', dùng 'Rather' để đưa ra sự thật thay thế."
    },
    {
      "id": 5,
      "question": "Cặp từ nào sau đây chỉ mối quan hệ 'Hệ quả nhân quả' (Cause and Effect)?",
      "options": [
        "A. On the contrary",
        "B. Consequently",
        "C. Conversely",
        "D. Still"
      ],
      "correct": 1,
      "explanation": "Consequently = As a result, Therefore (hậu quả là, do đó)."
    }
  ]
},
  {
  "id": "sat-standard-english-conventions",
  "title": "Ngữ Pháp Chuẩn Hóa SAT: Dấu Câu, Bán Phân & Mệnh Đề Treo",
  "subtitle": "Semicolons, colons, em-dashes, comma splices, dangling modifiers & parallelism",
  "category": "ngoai-ngu",
  "categoryLabel": "SAT Standard English",
  "badge": "Điểm Tuyệt Đối SAT 3 Xu",
  "priceXu": 3,
  "originalPriceXu": 40,
  "rating": 4.99,
  "reviewsCount": 1450,
  "studentsCount": 4980,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Bí Quyết Dấu Câu SAT",
    "Trắc Nghiệm Ngữ Pháp"
  ],
  "description": "Làm chủ phần Standard English Conventions của SAT. Xử lý chuẩn xác dấu chấm phẩy, dấu hai chấm, dấu gạch ngang, lỗi comma splice, bổ ngữ treo và so sánh khập khiễng.",
  "highlights": [
    "Quy tắc sống còn của dấu chấm phẩy và dấu hai chấm trong văn phong SAT",
    "Cách phát hiện và sửa nhanh lỗi Comma Splice và Dangling Modifiers",
    "Quy tắc đối xứng song hành (Parallel structure) trong câu phức",
    "Trắc nghiệm ngữ pháp chuẩn format College Board"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[SAT Dấu Câu] Quy tắc vàng sử dụng Dấu Chấm Phẩy (Semicolon ;)?",
      "back": "Dấu chấm phẩy (;) CHỈ ĐƯỢC DÙNG để nối 2 MỆNH ĐỀ ĐỘC LẬP (Independent Clauses: S + V đầy đủ) có liên quan chặt chẽ về nghĩa!\n📌 Quy tắc kiểm tra: Cả 2 vế trước và sau dấu chấm phẩy đều phải có khả năng ĐỨNG MỘT MÌNH NHƯ MỘT CÂU HOÀN CHỈNH.\n⚠️ Nếu một vế là mệnh đề phụ thuộc (Fragment) -> DÙNG CHẤM PHẨY LÀ SAI!",
      "tag": "SAT Dấu Chấm Phẩy"
    },
    {
      "id": 2,
      "front": "[SAT Dấu Câu] Quy tắc sử dụng Dấu Hai Chấm (Colon :) trong SAT?",
      "back": "📌 QUY TẮC SỐNG CÒN CỦA SAT:\n1. Vế TRƯỚC dấu hai chấm BẮT BUỘC PHẢI LÀ MỘT MỆNH ĐỀ HOÀN CHỈNH (Independent Clause: S + V).\n2. Vế SAU dấu hai chấm có thể là: Một danh từ, một danh sách liệt kê, một cụm từ, HOẶC một mệnh đề giải thích cặn kẽ cho vế trước.\nVí dụ ĐÚNG: The scientist had only one ambition: to synthesize a sustainable biofuel.",
      "tag": "SAT Dấu Hai Chấm"
    },
    {
      "id": 3,
      "front": "[SAT Lỗi Dấu Phẩy] Lỗi Comma Splice là gì và cách sửa?",
      "back": "COMMA SPLICE là lỗi nghiêm trọng khi dùng duy nhất một dấu phẩy (,) để nối hai mệnh đề độc lập!\n⚠️ Câu sai: The telescope detected a new exoplanet, it is located 40 light-years away.\n📌 3 cách sửa chuẩn SAT:\n1. Dùng dấu chấm (.): exoplanet. It is...\n2. Dùng chấm phẩy (;): exoplanet; it is...\n3. Dùng dấu phẩy + FANBOYS: exoplanet, and it is...",
      "tag": "SAT Lỗi Comma Splice"
    },
    {
      "id": 4,
      "front": "[SAT Dấu Gạch Ngang] Cặp dấu gạch ngang (Em-Dashes — ) dùng khi nào?",
      "back": "Cặp dấu gạch ngang (— ... —) dùng tương tự như cặp dấu phẩy hoặc dấu ngoặc đơn để CHÈN THÔNG TIN BỔ SUNG không thiết yếu vào giữa câu.\n⚠️ Quy tắc đối xứng: Nếu đã mở bằng gạch ngang thì BẮT BUỘC PHẢI ĐÓNG BẰNG GẠCH NGANG (không được mở gạch ngang đóng bằng dấu phẩy!).\nVí dụ: The telescope — designed by NASA engineers — orbited the sun.",
      "tag": "SAT Dấu Gạch Ngang"
    },
    {
      "id": 5,
      "front": "[SAT Lỗi Bổ Ngữ Treo] Dangling Modifier trong SAT là gì?",
      "back": "Xảy ra khi cụm phân từ đầu câu (V-ing hoặc V-ed) KHÔNG BỔ NGHĨA ĐÚNG CHO CHỦ NGỮ đứng ngay sau dấu phẩy!\n⚠️ Câu sai: Walking into the laboratory, the chemical reaction surprised Minh.\n(Hóa chất không thể đi bộ vào phòng thí nghiệm!)\n-> Câu đúng: Walking into the laboratory, MINH was surprised by the chemical reaction.",
      "tag": "SAT Dangling Modifiers"
    },
    {
      "id": 6,
      "front": "[SAT Cấu Trúc Song Hành] Parallel Structure trong liệt kê và so sánh?",
      "back": "Các thành phần nối bằng and, or, but, than hoặc as... as PHẢI CÙNG LOẠI TỪ VÀ DẠNG NGỮ PHÁP!\n⚠️ Câu sai: The job entails analyzing data, designing prototypes, and to write reports.\n-> Câu đúng: The job entails analyzing data, designing prototypes, and WRITING reports.",
      "tag": "SAT Parallelism"
    },
    {
      "id": 7,
      "front": "[SAT Bẫy Sở Hữu Cách] Phân biệt It's vs Its vs Its'?",
      "back": "• IT'S = Viết tắt của \"It is\" hoặc \"It has\".\n• ITS = Tính từ sở hữu của nó (thuộc về con vật, đồ vật, công ty).\n• ITS' = KHÔNG TỒN TẠI TRONG TIẾNG ANH (Bẫy đề thi luôn đưa vào để lừa thí sinh!).\nVí dụ SAT: The corporation announced that ITS (chọn its, không chọn it's) quarterly earnings doubled.",
      "tag": "SAT Bẫy Đại Từ Sở Hữu"
    },
    {
      "id": 8,
      "front": "[SAT Hòa Hợp Chủ Vị] Bẫy Cụm Giới Từ Chen Giữa (Prepositional Phrase)?",
      "back": "⚠️ Cụm giới từ chen giữa KHÔNG ẢNH HƯỞNG đến số ít/số nhiều của chủ ngữ chính!\nVí dụ: The collection of rare Roman coins (was / were) auctioned for $1 million.\n-> Chủ ngữ chính là \"The collection\" (số ít), coins chỉ là bổ ngữ trong cụm giới từ -> Chọn: WAS.",
      "tag": "SAT Bẫy Chủ Vị"
    },
    {
      "id": 9,
      "front": "[SAT Mệnh Đề Hạn Chế] Khi nào KHÔNG ĐƯỢC đặt dấu phẩy trước/sau tên người?",
      "back": "Quy tắc danh từ xác định:\n• Title + Name: \"Author Jane Austen published six novels.\" (KHÔNG có dấu phẩy vì 'Jane Austen' là thông tin cốt lõi để biết tác giả nào).\n• Name + Title (có mạo từ the): \"Jane Austen, the 19th-century author, published...\" (CÓ dấu phẩy).",
      "tag": "SAT Quy Tắc Dấu Phẩy"
    },
    {
      "id": 10,
      "front": "[SAT So Sánh Logic] Bẫy So Sánh Khập Khiễng (Illogical Comparison)?",
      "back": "Chỉ được so sánh hai đối tượng cùng loại với nhau!\n⚠️ Câu sai: The population of Tokyo is larger than London (So sánh dân số của Tokyo với thành phố London là khập khiễng!).\n-> Câu đúng: The population of Tokyo is larger than THAT OF London (Dùng 'that of' cho số ít, 'those of' cho số nhiều).",
      "tag": "SAT So Sánh Logic"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Dấu chấm phẩy (;) được sử dụng chuẩn xác nhất trong trường hợp nào?",
      "options": [
        "A. Sau một cụm giới từ ngắn",
        "B. Nối hai mệnh đề độc lập có thể đứng riêng thành hai câu hoàn chỉnh",
        "C. Đứng trước một danh sách các món đồ",
        "D. Đứng giữa chủ ngữ và động từ"
      ],
      "correct": 1,
      "explanation": "Dấu chấm phẩy dùng để kết nối 2 mệnh đề độc lập hoàn chỉnh về mặt ngữ pháp."
    },
    {
      "id": 2,
      "question": "Từ nào sau đây HOÀN TOÀN KHÔNG TỒN TẠI trong chuẩn mực tiếng Anh?",
      "options": [
        "A. It's",
        "B. Its",
        "C. Its'",
        "D. Theirs"
      ],
      "correct": 2,
      "explanation": "Its' hoàn toàn không tồn tại trong tiếng Anh; đây là phương án bẫy kinh điển của đề thi SAT."
    },
    {
      "id": 3,
      "question": "Chọn câu sửa lỗi so sánh khập khiễng chuẩn nhất: 'The claws of a grizzly bear are sharper than a black bear.'",
      "options": [
        "A. ...are sharper than a black bear.",
        "B. ...are sharper than those of a black bear.",
        "C. ...are sharper than that of a black bear.",
        "D. ...are sharper than it."
      ],
      "correct": 1,
      "explanation": "Vì đang so sánh 'The claws' (móng vuốt - số nhiều) nên phải dùng 'those of a black bear'."
    },
    {
      "id": 4,
      "question": "Quy tắc bắt buộc đối với vế TRƯỚC dấu hai chấm (Colon :) là gì?",
      "options": [
        "A. Bắt buộc phải là một mệnh đề độc lập hoàn chỉnh (S + V)",
        "B. Phải là một câu hỏi",
        "C. Phải kết thúc bằng một tính từ",
        "D. Không có quy tắc nào"
      ],
      "correct": 0,
      "explanation": "Vế trước dấu hai chấm trong bài thi SAT bắt buộc phải là một Independent Clause hoàn chỉnh."
    },
    {
      "id": 5,
      "question": "Xác định câu mắc lỗi phân từ treo (Dangling Modifier):",
      "options": [
        "A. Having finished the essay, Tom submitted it online.",
        "B. Having finished the essay, the teacher graded it immediately.",
        "C. While walking in the park, she spotted a rare bird.",
        "D. Built in 1920, the museum was renovated last year."
      ],
      "correct": 1,
      "explanation": "Câu B sai vì giáo viên không phải là người 'Having finished the essay' (học sinh mới là người viết)."
    }
  ]
},
  {
  "id": "sat-hardest-academic-lexicon",
  "title": "Bộ Từ Vựng SAT & Ivy League 1500+ Cực Phẩm (SAT High-Yield)",
  "subtitle": "Anachronistic, esoteric, ephemeral, idiosyncratic, obsequious & taciturn",
  "category": "ngoai-ngu",
  "categoryLabel": "SAT Ivy League Lexicon",
  "badge": "Đỉnh Cao Từ Vựng 4 Xu",
  "priceXu": 4,
  "originalPriceXu": 50,
  "rating": 4.99,
  "reviewsCount": 1890,
  "studentsCount": 6120,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Cẩm Nang Từ Vựng Ivy League",
    "Trắc Nghiệm SAT Top Tier"
  ],
  "description": "Kho tàng từ vựng học thuật đỉnh cao dành cho học sinh chinh phục học bổng Ivy League và SAT 1500+. Các từ vựng C2 hiếm có độ phân loại thí sinh cao nhất.",
  "highlights": [
    "Tuyển chọn những từ vựng tinh hoa nhất trong văn học và triết học cổ điển",
    "Phân tích từ nguyên (Etymology) giúp ghi nhớ sâu sắc và bền vững",
    "Đầy đủ từ đồng nghĩa, trái nghĩa và câu trích dẫn học thuật mẫu mực",
    "Trắc nghiệm thử thách trình độ từ vựng đỉnh cao"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "anachronistic /əˌnæk.rəˈnɪs.tɪk/ (adj)",
      "back": "Nghĩa: Lỗi thời, sai lệch niên đại lịch sử (thuộc về thời kỳ khác, không khớp với thời hiện tại).\nDanh từ: Anachronism.\nVí dụ: Depicting a 15th-century medieval knight wearing a wristwatch is blatantly anachronistic.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 2,
      "front": "esoteric /ˌes.əˈter.ɪk/ (adj)",
      "back": "Nghĩa: Thâm sâu bí truyền, uyên thâm chỉ một nhóm nhỏ chuyên gia hiểu được (obscure, arcane).\nTừ trái nghĩa: Exoteric, accessible.\nVí dụ: The seminar focused on esoteric formulations within quantum electrodynamics.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 3,
      "front": "ephemeral /ɪˈfem.ər.əl/ (adj)",
      "back": "Nghĩa: Phù du, chóng tàn, tồn tại trong chốc lát rồi biến mất (transient, fleeting).\nVí dụ: Viral popularity on TikTok is notoriously ephemeral, whereas enduring literature lasts centuries.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 4,
      "front": "idiosyncratic /ˌɪd.i.əʊ.sɪŋˈkræt.ɪk/ (adj)",
      "back": "Nghĩa: Có cá tính dị biệt, phong cách độc đáo riêng lập dị của một cá nhân.\nDanh từ: Idiosyncrasy.\nVí dụ: The director is acclaimed for his idiosyncratic visual aesthetic and non-linear narrative arcs.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 5,
      "front": "obsequious /əbˈsiː.kwi.əs/ (adj)",
      "back": "Nghĩa: Khúm núm quỵ lụy, xun xoe nịnh bợ cấp trên một cách trơ trẽn (fawning, servile).\nVí dụ: The dictator surrounded himself with obsequious courtiers who never dared to voice disagreement.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 6,
      "front": "pernicious /pəˈnɪʃ.əs/ (adj)",
      "back": "Nghĩa: Độc hại ngấm ngầm, gây tổn hại dần dần cực kỳ nguy hiểm (insidious, detrimental).\nVí dụ: The pervasive spread of propaganda has a pernicious effect on democratic public discourse.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 7,
      "front": "taciturn /ˈtæs.ɪ.tɜːn/ (adj)",
      "back": "Nghĩa: Trầm lặng, kín tiếng, ít nói và dè dặt trong giao tiếp (reticent, untalkative).\nTừ trái nghĩa: Loquacious, garrulous (ba hoa, lắm lời).\nVí dụ: The detective was a taciturn man who listened intently but rarely offered commentary.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 8,
      "front": "voracious /vəˈreɪ.ʃəs/ (adj)",
      "back": "Nghĩa: Ngấu nghiến, tham lam vô độ (đọc sách ngấu nghiến, khao khát kiến thức tột độ: insatiable).\nVí dụ: Young Abraham Lincoln was a voracious reader who walked miles to borrow historical books.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 9,
      "front": "fastidious /fæsˈtɪd.i.əs/ (adj)",
      "back": "Nghĩa: Khó tính, cầu toàn tuyệt đối, chú ý tỉ mỉ đến từng chi tiết nhỏ nhất (meticulous, painstaking).\nVí dụ: The watchmaker exercised fastidious care when assembling the miniature mechanical gears.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 10,
      "front": "alacrity /əˈlæk.rə.ti/ (noun)",
      "back": "Nghĩa: Sự hăm hở mau lẹ, tinh thần sẵn sàng nhiệt tình bắt tay vào việc ngay không chần chừ.\nVí dụ: The motivated graduate student accepted the challenging research assignment with alacrity.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 11,
      "front": "prolific /prəˈlɪf.ɪk/ (adj)",
      "back": "Nghĩa: Sáng tác dồi dào, năng suất cao phi thường (viết nhiều sách, sáng tác nhiều nhạc).\nVí dụ: Wolfgang Amadeus Mozart was an astonishingly prolific composer who produced over 600 masterworks.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 12,
      "front": "ubiquity /juːˈbɪk.wɪ.ti/ (noun)",
      "back": "Nghĩa: Sự hiện diện khắp mọi nơi, tính phổ biến toàn diện (omnipresence).\nVí dụ: The ubiquity of smartphones has fundamentally restructured daily human communication.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 13,
      "front": "magnanimous /mæɡˈnæn.ɪ.məs/ (adj)",
      "back": "Nghĩa: Đại lượng, hào hiệp, bao dung tha thứ cao thượng đối với đối thủ thất trận.\nVí dụ: Nelson Mandela was celebrated for his magnanimous spirit in reconciling a divided nation.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 14,
      "front": "dichotomy /daɪˈkɒt.ə.mi/ (noun)",
      "back": "Nghĩa: Sự phân đôi nhị nguyên, đối lập tương phản giữa hai ý niệm (duality, division).\nVí dụ: The philosopher examined the false dichotomy between pure reason and human emotion.",
      "tag": "SAT Ivy League"
    },
    {
      "id": 15,
      "front": "stoic /ˈstəʊ.ɪk/ (adj/noun)",
      "back": "Nghĩa: Khắc kỷ, thản nhiên chịu đựng gian khổ nghịch cảnh mà không một lời oán thán.\nVí dụ: Marcus Aurelius maintained a calm and stoic resolve despite betrayals and plagues.",
      "tag": "SAT Ivy League"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Từ 'Anachronistic' có nghĩa là gì?",
      "options": [
        "A. Lỗi thời, sai lệch niên đại lịch sử",
        "B. Thuộc về tương lai",
        "C. Cực kỳ chính xác về thời gian",
        "D. Rất hiện đại"
      ],
      "correct": 0,
      "explanation": "Anachronistic chỉ sự việc/đồ vật không phù hợp với niên đại lịch sử của bối cảnh."
    },
    {
      "id": 2,
      "question": "Người 'Taciturn' là người có tính cách như thế nào?",
      "options": [
        "A. Ba hoa, nói nhiều không dứt",
        "B. Trầm lặng, kín tiếng, ít nói",
        "C. Hung hăng hiếu chiến",
        "D. Vui vẻ hoạt bát"
      ],
      "correct": 1,
      "explanation": "Taciturn chỉ người ít nói, trầm mặc, giữ kẽ trong giao tiếp."
    },
    {
      "id": 3,
      "question": "Từ nào trái nghĩa với 'Ephemeral' (phù du, ngắn ngủi)?",
      "options": [
        "A. Transient",
        "B. Permanent / Enduring",
        "C. Fleeting",
        "D. Esoteric"
      ],
      "correct": 1,
      "explanation": "Ephemeral là ngắn ngủi tạm thời, trái nghĩa là Permanent (vĩnh viễn, lâu bền)."
    },
    {
      "id": 4,
      "question": "Một nghệ sĩ được gọi là 'Prolific' khi họ:",
      "options": [
        "A. Kiếm được rất ít tiền",
        "B. Sáng tác với năng suất dồi dào, tạo ra số lượng tác phẩm khổng lồ",
        "C. Bỏ nghề sớm",
        "D. Chỉ vẽ tranh phong cảnh"
      ],
      "correct": 1,
      "explanation": "Prolific chỉ người có năng suất lao động sáng tạo phi thường, ra mắt nhiều tác phẩm."
    },
    {
      "id": 5,
      "question": "Từ 'Esoteric' miêu tả một lĩnh vực tri thức như thế nào?",
      "options": [
        "A. Bình dân ai cũng hiểu",
        "B. Uyên thâm bí truyền, chỉ số ít chuyên gia hiểu được",
        "C. Bị cấm đoán bởi pháp luật",
        "D. Rất hài hước"
      ],
      "correct": 1,
      "explanation": "Esoteric chỉ kiến thức thâm sâu, bí truyền, chỉ những người trong ngành mới hiểu."
    }
  ]
},
  {
  "id": "english-confusing-words-pairs",
  "title": "50 Cặp Từ Dễ Nhầm Lẫn Nhất Trong Tiếng Anh (Confusing Word Pairs)",
  "subtitle": "Affect vs effect, compliment vs complement, principal vs principle, stationary vs stationery",
  "category": "ngoai-ngu",
  "categoryLabel": "Cặp Từ Dễ Lẫn",
  "badge": "Nền Tảng Vàng 1 Xu",
  "priceXu": 1,
  "originalPriceXu": 28,
  "rating": 4.97,
  "reviewsCount": 1050,
  "studentsCount": 4210,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Bảng Tra Cứu Cặp Từ Lẫn",
    "Trắc Nghiệm Phân Biệt"
  ],
  "description": "Xóa sạch lỗi sai chính tả và dùng từ ngớ ngẩn khiến bạn mất điểm oan. Phân biệt cặn kẽ 50 cặp từ viết gần giống nhau nhưng nghĩa khác xa một trời một vực.",
  "highlights": [
    "Mẹo ghi nhớ thần tốc RAVEN cho cặp từ kinh điển Affect vs Effect",
    "Phân biệt rõ ràng principal vs principle, stationary vs stationery",
    "Giải thích nguồn gốc và ngữ cảnh ứng dụng chuẩn xác của từng từ",
    "Trắc nghiệm rèn độ tinh mắt và cẩn trọng"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[Cặp từ kinh điển #1] Phân biệt Affect vs Effect?",
      "back": "• AFFECT /əˈfekt/ (thường là ĐỘNG TỪ): Tác động, gây ảnh hưởng đến cái gì.\n  Ví dụ: Lack of sleep negatively affects your memory.\n• EFFECT /ɪˈfekt/ (thường là DANH TỪ): Kết quả, hệ quả, tác động.\n  Ví dụ: The medication had an immediate positive effect on his health.\n💡 Mẹo nhớ: RAVEN (Remember: Affect Verb, Effect Noun).",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 2,
      "front": "[Cặp từ kinh điển #2] Phân biệt Compliment vs Complement?",
      "back": "• COMPLIMENT /ˈkɒm.plɪ.mənt/ (chữ 'i'): Lời khen ngợi, tán thưởng (Pay someone a compliment).\n• COMPLEMENT /ˈkɒm.plɪ.ment/ (chữ 'e'): Bổ sung, phối hợp hoàn hảo với nhau để tạo nên chỉnh thể trọn vẹn.\n  Ví dụ: Red wine complements grilled steak perfectly.",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 3,
      "front": "[Cặp từ kinh điển #3] Phân biệt Principal vs Principle?",
      "back": "• PRINCIPAL /ˈprɪn.sə.pəl/ (đuôi -pal): 1. Hiệu trưởng trường học; 2. Tiền gốc vay mượn; 3. Chính yếu quan trọng nhất.\n  Ví dụ: The school principal gave an inspirational speech.\n• PRINCIPLE /ˈprɪn.sə.pəl/ (đuôi -ple): Nguyên tắc đạo đức, chân lý, quy luật khoa học.\n  Ví dụ: He refuses to lie on principle.",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 4,
      "front": "[Cặp từ kinh điển #4] Phân biệt Stationary vs Stationery?",
      "back": "• STATIONARY /ˈsteɪ.ʃən.ər.i/ (chữ 'a'): Đứng yên một chỗ, bất động không di chuyển (The car was stationary at the red light).\n• STATIONERY /ˈsteɪ.ʃən.ər.i/ (chữ 'e'): Văn phòng phẩm (giấy, bút, phong bì...).\n💡 Mẹo nhớ: stationERy có chữ 'E' giống như Envelopes (phong bì).",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 5,
      "front": "[Cặp từ kinh điển #5] Phân biệt Discreet vs Discrete?",
      "back": "• DISCREET /dɪˈskriːt/ (hai chữ 'ee' đi liền nhau): Kín đáo, cẩn trọng giữ mồm giữ miệng để không gây chú ý (A discreet inquiry).\n• DISCRETE /dɪˈskriːt/ (chữ 't' chia cắt 2 chữ 'e'): Tách rời, riêng biệt, rải rác từng đơn vị độc lập (The experiment was divided into four discrete phases).",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 6,
      "front": "[Cặp từ kinh điển #6] Phân biệt Emigrate vs Immigrate?",
      "back": "• EMIGRATE /ˈem.ɪ.ɡreɪt/ (bắt đầu bằng E = Exit): DI CƯ RA KHỎI quê hương (Emigrate FROM Vietnam).\n• IMMIGRATE /ˈɪm.ɪ.ɡreɪt/ (bắt đầu bằng I = In): NHẬP CƯ VÀO một quốc gia mới (Immigrate TO Canada).\nVí dụ: Millions emigrated from Europe and immigrated to the Americas in the 19th century.",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 7,
      "front": "[Cặp từ kinh điển #7] Phân biệt Continual vs Continuous?",
      "back": "• CONTINUAL: Lặp đi lặp lại liên miên nhưng CÓ KHOẢNG NGẮT QUÃNG ở giữa (Ví dụ tiếng chuông điện thoại reo từng hồi, người than vãn suốt ngày).\n• CONTINUOUS: Diễn ra LIÊN TỤC KHÔNG HỀ CÓ MỘT GIÂY NÀO NGẮT QUÃNG (Ví dụ dòng điện, dòng sông chảy, mưa rơi không dứt 24 giờ).",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 8,
      "front": "[Cặp từ kinh điển #8] Phân biệt Economic vs Economical?",
      "back": "• ECONOMIC /ˌiː.kəˈnɒm.ɪk/: Thuộc về nền kinh tế, chính sách tài chính vĩ mô (Economic growth, Economic crisis).\n• ECONOMICAL /ˌiː.kəˈnɒm.ɪ.kəl/: Tiết kiệm tiền bạc/nhiên liệu, chi tiêu hợp lý (An economical hybrid car, Economical lifestyle).",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 9,
      "front": "[Cặp từ kinh điển #9] Phân biệt Historic vs Historical?",
      "back": "• HISTORIC /hɪˈstɒr.ɪk/: Mang tính lịch sử trọng đại, dấu mốc nổi tiếng sẽ được nhớ mãi (A historic victory, A historic summit).\n• HISTORICAL /hɪˈstɒr.ɪ.kəl/: Thuộc về quá khứ lịch sử hoặc nghiên cứu lịch sử (A historical novel, Historical accuracy).",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 10,
      "front": "[Cặp từ kinh điển #10] Phân biệt Sensible vs Sensitive?",
      "back": "• SENSIBLE /ˈsen.sə.bəl/: Biết điều, khôn ngoan, có óc thực tế (A sensible decision, Wear sensible shoes for hiking).\n• SENSITIVE /ˈsen.sɪ.tɪv/: Nhạy cảm, dễ xúc động, dễ bị tổn thương (Sensitive skin, Sensitive topic).",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 11,
      "front": "[Cặp từ kinh điển #11] Phân biệt Lay vs Lie?",
      "back": "• LAY (laid - laid): Đặt, để một vật gì đó xuống (bắt buộc CÓ TÂN NGỮ: Lay the book on the desk).\n• LIE (lay - lain): Nằm nghỉ ngơi hoặc nói dối (NỘI ĐỘNG TỪ, KHÔNG có tân ngữ: Lie down on the sofa).\n⚠️ Bẫy đề thi: Quá khứ của Lie là 'lay' dễ nhầm với động từ Lay hiện tại!",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 12,
      "front": "[Cặp từ kinh điển #12] Phân biệt Beside vs Besides?",
      "back": "• BESIDE = Next to (Bên cạnh về vị trí địa lý: Sit beside me).\n• BESIDES = In addition to, Moreover (Ngoài ra, bên cạnh việc đó: Besides English, she speaks French).",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 13,
      "front": "[Cặp từ kinh điển #13] Phân biệt Lose vs Loose?",
      "back": "• LOSE /luːz/ (1 chữ 'o' - động từ): Đánh mất chìa khóa, thua cuộc trận đấu (Lose a match, Lose weight).\n• LOOSE /luːs/ (2 chữ 'oo' - tính từ): Lỏng lẻo, rộng thùng thình (A loose tooth, Loose clothing).",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 14,
      "front": "[Cặp từ kinh điển #14] Phân biệt Assure vs Ensure vs Insure?",
      "back": "• ASSURE: Trấn an một người cụ thể (Assure someone that everything is okay).\n• ENSURE: Bảo đảm một kết quả xảy ra (Ensure high code quality).\n• INSURE: Mua bảo hiểm rủi ro tài chính (Insure the house against flood).",
      "tag": "Cặp Từ Dễ Lẫn"
    },
    {
      "id": 15,
      "front": "[Cặp từ kinh điển #15] Phân biệt Advice vs Advise?",
      "back": "• ADVICE /ədˈvaɪs/ (chữ 'c' - DANH TỪ không đếm được): Lời khuyên (Give me some advice - không bao giờ có an advice!).\n• ADVISE /ədˈvaɪz/ (chữ 's' - ĐỘNG TỪ): Khuyên bảo (I advise you to rest).",
      "tag": "Cặp Từ Dễ Lẫn"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Điền từ thích hợp: 'The intense heatwave will ______ the electricity grid.'",
      "options": [
        "A. effect",
        "B. affect",
        "C. affective",
        "D. effecting"
      ],
      "correct": 1,
      "explanation": "Cần một ĐỘNG TỪ mang nghĩa 'tác động gây ảnh hưởng' -> Chọn Affect."
    },
    {
      "id": 2,
      "question": "Chọn câu sử dụng đúng từ 'Compliment':",
      "options": [
        "A. The wine compliments the cheese nicely.",
        "B. He paid her a lovely compliment on her speech.",
        "C. She bought office compliment supplies.",
        "D. The two colors compliment each other."
      ],
      "correct": 1,
      "explanation": "Compliment (với chữ 'i') là lời khen ngợi; phối hợp bổ sung cho nhau là Complement (chữ 'e')."
    },
    {
      "id": 3,
      "question": "Từ 'Economical' mang nghĩa là gì?",
      "options": [
        "A. Thuộc về nền kinh tế quốc gia",
        "B. Tiết kiệm, không lãng phí tiền bạc/năng lượng",
        "C. Đắt đỏ xa hoa",
        "D. Đang lâm vào khủng hoảng"
      ],
      "correct": 1,
      "explanation": "Economical là tính từ chỉ sự tiết kiệm, còn Economic mới là thuộc về nền kinh tế."
    },
    {
      "id": 4,
      "question": "Mẹo nhớ 'Stationery' (văn phòng phẩm) là:",
      "options": [
        "A. Chữ 'a' trong car",
        "B. Chữ 'e' trong Envelopes (phong bì giấy viết)",
        "C. Chữ 'o' trong order",
        "D. Không có mẹo nào"
      ],
      "correct": 1,
      "explanation": "StationERy có đuôi -er như paper/envelopes (văn phòng phẩm), còn stationARy là đứng yên bất động."
    },
    {
      "id": 5,
      "question": "Điền từ đúng: 'The doctor gave me invaluable ______ on nutrition.'",
      "options": [
        "A. advice",
        "B. advise",
        "C. advices",
        "D. an advice"
      ],
      "correct": 0,
      "explanation": "Advice là danh từ không đếm được (không có số nhiều 'advices', không có mạo từ 'an advice')."
    }
  ]
},
  {
  "id": "english-connectors-discourse",
  "title": "Các Liên Từ & Từ Nối Lập Luận Logic Học Thuật (Discourse Markers)",
  "subtitle": "First and foremost, that being said, to put it another way & all things considered",
  "category": "ngoai-ngu",
  "categoryLabel": "Từ Nối Lập Luận",
  "badge": "Mạch Lạc Văn Phong 1 Xu",
  "priceXu": 1,
  "originalPriceXu": 25,
  "rating": 4.96,
  "reviewsCount": 810,
  "studentsCount": 3120,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Bộ Khung Liên Từ Luận Điểm",
    "Trắc Nghiệm Mạch Lạc"
  ],
  "description": "Giúp bài viết và câu nói của bạn trở nên mạch lạc, logic và có chiều sâu thuyết phục. Cung cấp các từ nối mở đầu, nhượng bộ, làm sáng tỏ và kết luận bài luận.",
  "highlights": [
    "Xây dựng liên kết đoạn chặt chẽ giúp tăng điểm Coherence & Cohesion",
    "Các từ nối chuyển ý nhượng bộ tinh tế (that being said, be that as it may)",
    "Mẫu câu kết luận học thuật đắt giá thay thế cho in conclusion đơn điệu",
    "Trắc nghiệm nối câu logic tức thì"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[Discourse Markers] Từ nối mở đầu luận điểm chính (Introducing Points)?",
      "back": "• First and foremost (Trước hết và quan trọng nhất)\n• Primarily / Principally (Chủ yếu là)\n• To begin with / At the outset (Khởi đầu là)\nVí dụ: First and foremost, educational equity must be recognized as a constitutional right.",
      "tag": "Từ Nối Lập Luận"
    },
    {
      "id": 2,
      "front": "[Discourse Markers] Từ nối bổ sung luận cứ nâng cao (Reinforcing Arguments)?",
      "back": "• Furthermore / Moreover (Hơn thế nữa)\n• In addition to this (Thêm vào đó)\n• What is more (Hơn nữa - văn phong nói/viết mạnh mẽ)\n• Not to mention... (Còn chưa kể đến...)\nVí dụ: The subway cuts commute times; furthermore, it reduces citywide carbon pollution.",
      "tag": "Từ Nối Bổ Sung"
    },
    {
      "id": 3,
      "front": "[Discourse Markers] Từ nối đối lập nhượng bộ tinh tế (Nuanced Concession)?",
      "back": "• That being said / Having said that (Nói là nói như vậy, dẫu vậy...)\n• Be that as it may (Dù có như thế đi chăng nữa)\n• In spite of the aforementioned benefits (Bất chấp những lợi ích vừa nêu trên)\nVí dụ: Electric cars produce zero emissions; that being said, battery recycling remains an unsolved riddle.",
      "tag": "Từ Nối Nhượng Bộ"
    },
    {
      "id": 4,
      "front": "[Discourse Markers] Từ nối giải thích và làm sáng tỏ (Clarification)?",
      "back": "• That is to say (Tức là, nghĩa là)\n• To put it another way (Nói cách khác)\n• Specifically / To be more precise (Chính xác hơn là)\nVí dụ: The patient suffered from amnesia; that is to say, he was completely unable to recall past events.",
      "tag": "Từ Nối Làm Sáng Tỏ"
    },
    {
      "id": 5,
      "front": "[Discourse Markers] Từ nối kết luận và tổng kết (Summing Up)?",
      "back": "• In summary / To encapsulate (Tóm lại, thâu tóm lại)\n• All things considered (Cân nhắc mọi khía cạnh một cách toàn diện)\n• The inescapable conclusion is that... (Kết luận không thể chối bỏ là...)\nVí dụ: All things considered, public investment in STEM education yields the highest macroeconomic return.",
      "tag": "Từ Nối Kết Luận"
    },
    {
      "id": 6,
      "front": "[Discourse Markers] Từ nối chuyển ý sang khía cạnh khác (Transitioning)?",
      "back": "• With regard to / As regards (Liên quan đến, xét về mặt)\n• In terms of / Pertaining to (Xét về khía cạnh)\n• Turning now to... (Bây giờ chuyển sang bàn về...)\nVí dụ: With regard to economic feasibility, the proposal is remarkably sound.",
      "tag": "Từ Nối Chuyển Ý"
    },
    {
      "id": 7,
      "front": "[Discourse Markers] Từ nối đưa ra ví dụ điển hình (Exemplification)?",
      "back": "• To illustrate (Để minh họa cho điều này)\n• A prime example of this is... (Một ví dụ tiêu biểu là)\n• By way of illustration (Bằng việc minh họa...)\nVí dụ: A prime example of corporate resilience is Nintendo's pivot from playing cards to video games.",
      "tag": "Từ Nối Dẫn Chứng"
    },
    {
      "id": 8,
      "front": "[Discourse Markers] Từ nối nhấn mạnh mức độ hiển nhiên (Stating the Obvious)?",
      "back": "• It goes without saying that... (Hiển nhiên một điều rằng không cần nói cũng biết)\n• Needless to say (Không cần phải nói thêm)\n• It is universally acknowledged that... (Ai cũng công nhận rằng...)\nVí dụ: It goes without saying that regular exercise enhances mental stamina.",
      "tag": "Từ Nối Nhấn Mạnh"
    },
    {
      "id": 9,
      "front": "[Discourse Markers] Từ nối đảo ngược hoàn toàn (Direct Contrast)?",
      "back": "• In stark contrast to... (Hoàn toàn tương phản đối lập với...)\n• Conversely / On the contrary (Ngược lại hoàn toàn)\n• Whereas / Whilst (Trong khi đó...)\nVí dụ: In stark contrast to traditional print media, digital apps offer real-time interactive feedback.",
      "tag": "Từ Nối Tương Phản"
    },
    {
      "id": 10,
      "front": "[Discourse Markers] Từ nối thể hiện quan điểm cá nhân học thuật (Stating Opinion)?",
      "back": "• It is my firm conviction that... (Tôi có niềm tin chắc chắn rằng...)\n• From an objective standpoint (Từ góc nhìn khách quan)\n• There is ample justification for... (Có đầy đủ lý lẽ xác đáng để khẳng định...)\nVí dụ: It is my firm conviction that early multilingualism enhances cognitive flexibility.",
      "tag": "Từ Nối Quan Điểm"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Cụm 'That being said' dùng để thể hiện mối quan hệ logic nào?",
      "options": [
        "A. Nhượng bộ tinh tế (Dẫu vậy, nói là như thế nhưng...)",
        "B. Đồng ý hoàn toàn 100%",
        "C. Đưa ra ví dụ liệt kê",
        "D. Kết thúc bài viết"
      ],
      "correct": 0,
      "explanation": "That being said = Having said that / Even so (nói là như vậy, dẫu vậy... - chuyển ý nhượng bộ)."
    },
    {
      "id": 2,
      "question": "Khi muốn nói 'Không cần phải nói cũng biết điều hiển nhiên là...', dùng cụm nào?",
      "options": [
        "A. It goes without saying that...",
        "B. On the contrary...",
        "C. That is to say...",
        "D. To put it another way..."
      ],
      "correct": 0,
      "explanation": "It goes without saying that... nghĩa là hiển nhiên, không cần nói cũng ai cũng hiểu."
    },
    {
      "id": 3,
      "question": "Từ nào sau đây mang nghĩa 'ngược lại hoàn toàn'?",
      "options": [
        "A. Furthermore",
        "B. Conversely",
        "C. Primarily",
        "D. In summary"
      ],
      "correct": 1,
      "explanation": "Conversely có nghĩa là ngược lại."
    },
    {
      "id": 4,
      "question": "Cụm từ nào dùng để mở đầu câu kết luận học thuật nâng cao?",
      "options": [
        "A. All things considered",
        "B. First and foremost",
        "C. What is more",
        "D. A prime example"
      ],
      "correct": 0,
      "explanation": "All things considered = Cân nhắc mọi mặt một cách tổng thể (dùng trong đoạn kết luận)."
    },
    {
      "id": 5,
      "question": "Để giải thích rõ hơn ý trước bằng một cách diễn đạt khác, dùng cụm nào?",
      "options": [
        "A. In stark contrast",
        "B. That is to say",
        "C. Primarily",
        "D. Whereas"
      ],
      "correct": 1,
      "explanation": "That is to say = Tức là, nói cách khác (in other words)."
    }
  ]
},
  {
  "id": "english-pronunciation-minimal-pairs",
  "title": "Phát Âm Chuẩn Quốc Tế & Phân Biệt Cặp Âm Dễ Lẫn (Minimal Pairs)",
  "subtitle": "/iː/ vs /ɪ/, /s/ vs /ʃ/, âm TH /θ/ vs /ð/, quy tắc đuôi -ed, -s/-es & nối âm",
  "category": "ngoai-ngu",
  "categoryLabel": "Phát Âm & Minimal Pairs",
  "badge": "Chuẩn IPA 1 Xu",
  "priceXu": 1,
  "originalPriceXu": 26,
  "rating": 4.98,
  "reviewsCount": 1180,
  "studentsCount": 4450,
  "updatedAt": "Tháng 10/2026",
  "format": [
    "File Anki (.apkg)",
    "Bảng Ký Hiệu Quốc Tế IPA",
    "Trắc Nghiệm Phát Âm"
  ],
  "description": "Chuẩn hóa phát âm tiếng Anh từ gốc rễ. Khắc phục triệt để lỗi nuốt âm cuối, nhầm lẫn sheep vs ship, quy tắc phát âm đuôi -ed và hiện tượng nối âm tự nhiên của người bản ngữ.",
  "highlights": [
    "Khẩu hình miệng chuẩn từng milimet cho các cặp âm dễ nhầm nhất",
    "Mẹo ghi nhớ câu thần chú phát âm đuôi -ed và -s/-es trong 5 giây",
    "Quy tắc trọng âm danh từ 2 âm tiết vs động từ 2 âm tiết",
    "Trắc nghiệm nghe và phân biệt âm chuẩn xác"
  ],
  "previewCards": [
    {
      "id": 1,
      "front": "[Cặp âm Minimal Pair #1] Phân biệt /iː/ (i dài) vs /ɪ/ (i ngắn)?",
      "back": "• /iː/ (Cười căng môi sang 2 bên): Sheep, Sheet, Leave, Heat, Beat.\n• /ɪ/ (Thả lỏng khẩu hình miệng, phát âm dứt khoát nửa i nửa ê): Ship, Shit, Live, Hit, Bit.\n⚠️ Cảnh báo bẫy nhạy cảm: Nhầm 'sheet' (tờ giấy) sang 'shit' hoặc 'beach' (bãi biển) sang 'bitch'!",
      "tag": "Nguyên Âm Dễ Nhầm"
    },
    {
      "id": 2,
      "front": "[Cặp âm Minimal Pair #2] Phân biệt /s/ vs /ʃ/ (s nhẹ vs s nặng)?",
      "back": "• /s/ (Răng khép nhẹ, đầu lưỡi chạm chân răng hàm dưới, thổi hơi nhẹ): See, Sea, Sip, Sue, Sell.\n• /ʃ/ (Chu tròn môi về phía trước, đẩy luồng hơi mạnh 'suỵt'): She, Ship, Shoe, Shell.\nVí dụ câu luyện âm: She sells seashells by the seashore.",
      "tag": "Phụ Âm Cọ Xát"
    },
    {
      "id": 3,
      "front": "[Cặp âm Minimal Pair #3] Phân biệt âm TH vô thanh /θ/ vs hữu thanh /ð/?",
      "back": "Đầu lưỡi ĐẶT GIỮA HAI HÀM RĂNG:\n• /θ/ (Vô thanh - chỉ có luồng gió thổi qua kẽ răng, dây thanh quản KHÔNG rung): Think, Thank, Three, Bath, Tooth.\n• /ð/ (Hữu thanh - dây thanh quản RUNG LÊN ở cổ họng): This, That, There, Breathe, Mother.",
      "tag": "Âm TH Huyền Thoại"
    },
    {
      "id": 4,
      "front": "[Cặp âm Minimal Pair #4] Phân biệt /v/ vs /b/ và /w/?",
      "back": "• /v/ (RĂNG HÀM TRÊN CHẠM MÔI DƯỚI, rung cổ họng): Vest, Very, Van, Vote.\n• /b/ (HAI MÔI KHÉP CHẶT RỒI BẬT HƠI): Best, Berry, Ban, Boat.\n• /w/ (Môi tròn như huýt sáo, không chạm răng): West, Water, Win.\nVí dụ: Vest (áo gi lê) vs Best (tốt nhất) vs West (hướng Tây).",
      "tag": "Răng Môi vs Hai Môi"
    },
    {
      "id": 5,
      "front": "[Cặp âm Minimal Pair #5] Phân biệt /æ/ (a bẹt) vs /e/ (e thường)?",
      "back": "• /æ/ (Mở rộng hàm dưới hết cỡ về phía dưới, đè lưỡi): Bad, Man, Cat, Bat, Pan.\n• /e/ (Mở miệng vừa phải như chữ e tiếng Việt): Bed, Men, Get, Bet, Pen.\nVí dụ: Bad man (người xấu) vs Bed men (đàn ông trên giường).",
      "tag": "Nguyên Âm Đơn"
    },
    {
      "id": 6,
      "front": "[Quy tắc Phát Âm Đuôi -ed] Khi nào đọc là /ɪd/, /t/, và /d/?",
      "back": "1. Đọc là /ɪd/: Khi động từ kết thúc bằng âm /t/ hoặc /d/ (Wanted, Needed).\n2. Đọc là /t/: Khi kết thúc bằng các âm vô thanh /p, k, f, s, ʃ, tʃ/ (Mẹo nhớ: 'Chính Phủ Không Phát Sách Thiếu Cho'): Stopped, Looked, Laughed, Missed, Watched.\n3. Đọc là /d/: Các trường hợp còn lại (Played, Cleaned, Loved).",
      "tag": "Quy Tắc Vàng Đuôi -ed"
    },
    {
      "id": 7,
      "front": "[Quy tắc Phát Âm Đuôi -s/-es] Khi nào đọc là /s/, /ɪz/, và /z/?",
      "back": "1. Đọc là /ɪz/: Tận cùng là các âm xì /s, z, ʃ, tʃ, dʒ/ (Misses, Buzzes, Wishes, Watches, Judges).\n2. Đọc là /s/: Tận cùng là âm vô thanh /p, k, t, f, θ/ (Mẹo nhớ: 'Thời Phong Kiến Phương Tây'): Stops, Books, Cats, Laughs.\n3. Đọc là /z/: Tất cả các nguyên âm và âm hữu thanh còn lại (Dogs, Cars, Plays).",
      "tag": "Quy Tắc Đuôi -s/-es"
    },
    {
      "id": 8,
      "front": "[Cặp âm Minimal Pair #6] Phân biệt /tʃ/ (ch) vs /dʒ/ (gi)?",
      "back": "• /tʃ/ (Vô thanh - bật hơi mạnh không rung cổ): Cheap, Chain, Choke, Match.\n• /dʒ/ (Hữu thanh - rung cổ họng mạnh): Jeep, Jane, Joke, Madge.\nVí dụ: Cheap car (xe giá rẻ) vs Jeep car (xe quân sự Jeep).",
      "tag": "Phụ Âm Tắc Xát"
    },
    {
      "id": 9,
      "front": "[Quy tắc Trọng Âm] Danh từ 2 âm tiết vs Động từ 2 âm tiết?",
      "back": "Quy tắc vàng 85%:\n• Danh từ 2 âm tiết: Trọng âm rơi vào ÂM TIẾT THỨ NHẤT (PREsent, REcord, OBject, PROject).\n• Động từ 2 âm tiết: Trọng âm rơi vào ÂM TIẾT THỨ HAI (preSENT, reCORD, obJECT, proJECT).\nVí dụ: A PREsent (món quà) vs To preSENT (thuyết trình).",
      "tag": "Trọng Âm Từ"
    },
    {
      "id": 10,
      "front": "[Hiện tượng Nuốt Âm - Linking Sounds] Nối phụ âm cuối với nguyên âm đầu?",
      "back": "Khi một từ kết thúc bằng phụ âm và từ tiếp theo bắt đầu bằng nguyên âm, phụ âm tự động trượt sang nguyên âm kế tiếp:\n• \"Hold on\" -> đọc thành \"Hol-don\".\n• \"Check it out\" -> đọc thành \"Che-ki-tout\".\n• \"Not at all\" -> đọc thành \"No-ta-tall\".",
      "tag": "Nối Âm Bản Xứ"
    }
  ],
  "previewQuiz": [
    {
      "id": 1,
      "question": "Đuôi '-ed' trong từ 'laughed' được phát âm là gì?",
      "options": [
        "A. /ɪd/",
        "B. /t/",
        "C. /d/",
        "D. Không phát âm"
      ],
      "correct": 1,
      "explanation": "Laugh kết thúc bằng âm /f/ (vô thanh) nên -ed được phát âm là /t/."
    },
    {
      "id": 2,
      "question": "Từ 'Three' (số ba) có âm 'th' được phát âm là âm gì?",
      "options": [
        "A. /θ/ (âm vô thanh, đẩy hơi qua kẽ răng)",
        "B. /ð/ (âm hữu thanh, rung cổ họng)",
        "C. /t/ (âm t bình thường)",
        "D. /s/ (âm s nhẹ)"
      ],
      "correct": 0,
      "explanation": "Three bắt đầu bằng âm vô thanh /θ/, đặt lưỡi giữa hai hàm răng và thổi hơi nhẹ."
    },
    {
      "id": 3,
      "question": "Khi 'Record' đóng vai trò là một ĐỘNG TỪ (ghi âm), trọng âm rơi vào âm tiết thứ mấy?",
      "options": [
        "A. Âm tiết thứ nhất (RE-cord)",
        "B. Âm tiết thứ hai (re-CORD)",
        "C. Cả hai âm tiết đều có trọng âm",
        "D. Không có trọng âm"
      ],
      "correct": 1,
      "explanation": "Động từ 2 âm tiết 'record' có trọng âm rơi vào âm tiết thứ 2 (re-CORD)."
    },
    {
      "id": 4,
      "question": "Cặp từ 'Sheep' và 'Ship' khác nhau ở điểm nào?",
      "options": [
        "A. Sheep là âm /iː/ (i dài), Ship là âm /ɪ/ (i ngắn)",
        "B. Sheep là âm ngắn, Ship là âm dài",
        "C. Hoàn toàn giống hệt nhau không khác gì",
        "D. Khác ở âm phụ âm đầu"
      ],
      "correct": 0,
      "explanation": "Sheep có nguyên âm /iː/ dài căng môi, Ship có nguyên âm /ɪ/ ngắn dứt khoát."
    },
    {
      "id": 5,
      "question": "Hiện tượng nối âm trong cụm 'Hold on' được người bản ngữ đọc liền thành:",
      "options": [
        "A. Hol-don",
        "B. Hold-off",
        "C. Ho-on",
        "D. Hol-on"
      ],
      "correct": 0,
      "explanation": "Phụ âm cuối /d/ của 'hold' nối trực tiếp vào nguyên âm /ɒ/ của 'on' tạo thành 'hol-don'."
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
