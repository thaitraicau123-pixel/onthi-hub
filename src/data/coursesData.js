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
