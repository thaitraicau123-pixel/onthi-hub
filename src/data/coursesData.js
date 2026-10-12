export const CATEGORIES = [
  { id: 'all', name: 'Tất cả tài liệu', icon: 'Sparkles' },
  { id: 'cong-chuc', name: '🏛️ Thi Công Chức / Viên Chức', icon: 'Landmark' },
  { id: 'it-tech', name: '💻 Phỏng Vấn IT & Lập Trình', icon: 'Code2' },
  { id: 'ngoai-ngu', name: '🌍 Tiếng Anh, Nhật, Trung (IELTS, JLPT, HSK)', icon: 'Languages' },
];

export const COURSES_DATA = [
  {
    id: 'cc-kien-thuc-chung',
    title: 'Trọn Bộ Đề & Flashcard Kiến Thức Chung Thi Công Chức 2026',
    subtitle: 'Chuẩn format Vòng 1 Bộ Nội Vụ - Đã cập nhật Luật sửa đổi mới nhất',
    category: 'cong-chuc',
    categoryLabel: 'Thi Công Chức 2026',
    badge: 'Bán chạy nhất #1',
    price: 69000,
    originalPrice: 199000,
    rating: 4.9,
    reviewsCount: 1420,
    studentsCount: 3840,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', 'Ebook PDF Tóm Tắt', 'Bộ 600 Câu Trắc Nghiệm Có Lời Giải'],
    description: 'Bộ tài liệu bao trọn 100% phạm vi thi Vòng 1: Luật Cán bộ, công chức 2008 (sđbs 2019), Luật Viên chức, Hiến pháp 2013, Luật Tổ chức Chính phủ, Nghị định 138/2020/NĐ-CP và Nghị định 115/2020/NĐ-CP. Đi kèm bộ thẻ Anki ứng dụng thuật toán lặp lại ngắt quãng (Spaced Repetition) giúp nhớ nhanh gấp 3 lần mà không sợ quên ngày tháng, số lượng điều luật.',
    highlights: [
      '380 Thẻ Anki ghi nhớ chính xác số năm, thời hạn kỷ luật, cơ cấu tổ chức',
      'Bộ 600 câu trắc nghiệm thực chiến bám sát đề thi thật các bộ/ngành',
      'Bảng so sánh trực quan Cán bộ vs Công chức vs Viên chức không sợ nhầm',
      'File .apkg đồng bộ 1 chạm vào Anki trên iPhone, Android, Windows, Mac',
      'Học thử trực tiếp ngay trên web không cần cài phần mềm'
    ],
    previewCards: [
      {
        id: 1,
        front: 'Thời hiệu xử lý kỷ luật đối với hành vi vi phạm của cán bộ, công chức ít nghiêm trọng đến mức phải khiển trách là bao lâu?',
        back: '02 NĂM (kể từ thời điểm có hành vi vi phạm).\n\n📌 Căn cứ: Khoản 1 Điều 80 Luật Cán bộ, công chức (sửa đổi, bổ sung 2019).\n💡 Mẹo nhớ: Khiển trách = vi phạm nhẹ nhất = 2 năm. Các mức còn lại (trừ trường hợp đặc biệt) là 5 năm.',
        tag: 'Luật CBCC'
      },
      {
        id: 2,
        front: 'Những trường hợp vi phạm nào KHÔNG ÁP DỤNG thời hiệu xử lý kỷ luật?',
        back: 'Gồm 4 trường hợp:\n1. Là đảng viên có hành vi vi phạm đến mức phải khai trừ Đảng.\n2. Vi phạm quy định về công tác bảo vệ chính trị nội bộ.\n3. Xâm phạm an ninh quốc gia.\n4. Sử dụng văn bằng, chứng chỉ, chứng nhận giả, không hợp pháp.',
        tag: 'Điều 80 - Luật CBCC'
      },
      {
        id: 3,
        front: 'Cơ quan nào có thẩm quyền ban hành Nghị định?',
        back: 'CHÍNH PHỦ.\n\n📌 Căn cứ: Luật Ban hành văn bản quy phạm pháp luật.\n💡 Lưu ý: Thủ tướng ban hành Quyết định, Bộ trưởng ban hành Thông tư.',
        tag: 'Văn bản QPPL'
      },
      {
        id: 4,
        front: 'Thời hạn bổ nhiệm công chức giữ chức vụ lãnh đạo, quản lý là bao nhiêu năm?',
        back: '05 NĂM (trừ trường hợp thời hạn bổ nhiệm dưới 05 năm theo quy định chuyên ngành).\n\n📌 Căn cứ: Điều 51 Luật Cán bộ, công chức 2008.',
        tag: 'Bổ nhiệm'
      },
      {
        id: 5,
        front: 'Hiến pháp 2013 quy định Nhân dân thực hiện quyền lực nhà nước bằng các hình thức nào?',
        back: 'Bằng DÂN CHỦ TRỰC TIẾP, bằng DÂN CHỦ ĐẠI DIỆN thông qua Quốc hội, Hội đồng nhân dân và thông qua các cơ quan khác của Nhà nước.\n\n📌 Căn cứ: Điều 6 Hiến pháp 2013.',
        tag: 'Hiến pháp 2013'
      },
      {
        id: 6,
        front: 'Hình thức kỷ luật "Hạ bậc lương" áp dụng cho đối tượng nào?',
        back: 'Chỉ áp dụng đối với CÔNG CHỨC KHÔNG GIỮ CHỨC VỤ LÃNH ĐẠO, QUẢN LÝ.\n\n💡 Mẹo nhớ: Công chức lãnh đạo vi phạm mức tương đương thì bị "Giáng chức" hoặc "Cách chức", không hạ bậc lương.',
        tag: 'Kỷ luật'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Theo Luật Cán bộ, công chức hiện hành, có bao nhiêu ngạch công chức?',
        options: [
          'A. 3 ngạch (Chuyên viên, Cán sự, Nhân viên)',
          'B. 4 ngạch (Chuyên viên cao cấp, Chuyên viên chính, Chuyên viên, Cán sự)',
          'C. 5 ngạch (Chuyên viên cao cấp, Chuyên viên chính, Chuyên viên, Cán sự, Nhân viên và ngạch khác)',
          'D. 6 ngạch'
        ],
        correct: 2,
        explanation: 'Căn cứ Khoản 1 Điều 34 Luật CBCC: Ngạch công chức bao gồm: Chuyên viên cao cấp và tương đương; Chuyên viên chính và tương đương; Chuyên viên và tương đương; Cán sự và tương đương; Nhân viên; Các ngạch khác theo quy định.'
      },
      {
        id: 2,
        question: 'Theo Hiến pháp 2013, ai là người có thẩm quyền công bố Hiến pháp, luật, pháp lệnh?',
        options: [
          'A. Tổng Bí thư',
          'B. Chủ tịch nước',
          'C. Chủ tịch Quốc hội',
          'D. Thủ tướng Chính phủ'
        ],
        correct: 1,
        explanation: 'Căn cứ Điều 88 Hiến pháp 2013: Chủ tịch nước có nhiệm vụ và quyền hạn: Công bố Hiến pháp, luật, pháp lệnh.'
      },
      {
        id: 3,
        question: 'Thời gian tập sự đối với người được tuyển dụng vào công chức loại C (ngạch chuyên viên) là bao lâu?',
        options: [
          'A. 06 tháng',
          'B. 09 tháng',
          'C. 12 tháng',
          'D. 18 tháng'
        ],
        correct: 2,
        explanation: 'Căn cứ Nghị định 138/2020/NĐ-CP: Thời gian tập sự là 12 tháng đối với công chức loại C (yêu cầu trình độ đại học trở lên).'
      }
    ]
  },
  {
    id: 'it-frontend-master',
    title: 'Flashcard Anki: 250 Câu Phỏng Vấn Frontend Master (React, JS, Next.js)',
    subtitle: 'Bộ câu hỏi tuyển dụng từ Junior đến Senior tại các Tech Unicorn & Outsourcing Top đầu',
    category: 'it-tech',
    categoryLabel: 'Luyện Phỏng Vấn IT',
    badge: 'Hot Developer 🔥',
    price: 79000,
    originalPrice: 220000,
    rating: 5.0,
    reviewsCount: 980,
    studentsCount: 2450,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', 'Cheatsheet Tối Ưu Hiệu Năng', 'Bộ Code Trắc Nghiệm Live Interview'],
    description: 'Tổng hợp 250 câu hỏi chuyên sâu kiểm tra bản chất lập trình Web Frontend: Javascript internals (Event Loop, Closure, Microtask queue, Prototype), React Core (Reconciliation, Fiber Tree, Batching, React 19 Actions & use hook), Web Performance (LCP, CLS, INP, Tree-shaking), Next.js SSR/SSG/ISR, CSS Layout và Security (XSS, CSRF, CSP).',
    highlights: [
      '250 thẻ câu hỏi phỏng vấn thực tế chia thành 8 chuyên đề từ Core JS đến System Frontend',
      'Kèm code snippet minh họa ngắn gọn, chỉ vào trọng tâm nhà tuyển dụng muốn nghe',
      'Giải thích sâu sắc cơ chế hoạt động bên dưới (Under the hood)',
      'Hỗ trợ chế độ luyện phản xạ 30 giây trả lời lưu loát trước camera'
    ],
    previewCards: [
      {
        id: 1,
        front: 'Giải thích cơ chế hoạt động của Event Loop trong JavaScript khi có cả setTimeout(..., 0) và Promise.then()?',
        back: 'Thứ tự thực thi:\n1. Đồng bộ (Call Stack) chạy hết.\n2. Microtask Queue (Promise.then, queueMicrotask, MutationObserver) được vét cạn toàn bộ.\n3. Macrotask Queue (setTimeout, setInterval, setImmediate, I/O) chạy 1 task.\n4. Sau mỗi macrotask, engine lại quay lại vét sạch Microtask queue rồi mới Render UI.\n\n💡 Vì vậy: Promise.resolve().then() LUÔN chạy trước setTimeout(..., 0).',
        tag: 'JS Core'
      },
      {
        id: 2,
        front: 'useMemo và useCallback khác nhau như thế nào? Khi nào KHÔNG NÊN dùng chúng?',
        back: '• useMemo: Memoize KẾT QUẢ của phép tính toán (expensive computation).\n• useCallback: Memoize CHÍNH HÀM ĐÓ (function instance) để tránh re-render child component có bọc React.memo.\n\n⚠️ Không nên dùng khi:\n- Phép tính quá nhẹ (phí memoization còn đắt hơn).\n- Hàm truyền vào component thường không được wrap bởi React.memo.',
        tag: 'React Hooks'
      },
      {
        id: 3,
        front: 'Chỉ số INP (Interaction to Next Paint) trong Core Web Vitals là gì và cách tối ưu nó?',
        back: 'INP đo lường độ trễ phản hồi của toàn bộ trang web đối với các tương tác của người dùng (click, gõ phím) trong suốt phiên truy cập (thay thế FID).\n\n🚀 Cách tối ưu:\n- Tránh block main thread (chia nhỏ Long Tasks bằng scheduler.yield() hoặc setTimeout).\n- Sử dụng Web Workers cho tác vụ nặng.\n- Giảm re-render thừa và tối ưu CSS layout recalculation.',
        tag: 'Web Performance'
      },
      {
        id: 4,
        front: 'Server Components (RSC) trong React / Next.js khác gì Client Components?',
        back: '• Server Components: Render hoàn toàn trên Server, KHÔNG gửi JavaScript bundle của component đó về client, có thể truy cập trực tiếp DB/File, không dùng được useState/useEffect hay browser APIs.\n• Client Components: Render trên client (vẫn có thể SSR HTML ban đầu), cần hydrate JavaScript, hỗ trợ đầy đủ hooks và event handlers tương tác.',
        tag: 'Next.js & RSC'
      },
      {
        id: 5,
        front: 'Closure trong JavaScript là gì và nêu 1 ví dụ thực tế gặp phải memory leak do closure?',
        back: 'Closure là khả năng một hàm bên trong ghi nhớ và truy cập vào các biến thuộc lexical scope của hàm cha ngay cả khi hàm cha đã thực thi xong.\n\n⚠️ Memory Leak: Gán một hàm closure vào biến global hoặc setInterval/addEventListener nhưng quên unregister/clearInterval, khiến toàn bộ context scope cha bị giữ lại trong bộ nhớ không thể Garbage Collect.',
        tag: 'JS Internals'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Đoạn code sau in ra kết quả gì?\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);',
        options: [
          'A. 1, 2, 3, 4',
          'B. 1, 4, 2, 3',
          'C. 1, 4, 3, 2',
          'D. 1, 3, 4, 2'
        ],
        correct: 2,
        explanation: '1 và 4 chạy đồng bộ trước. Tiếp theo Microtask queue chạy Promise (in 3). Cuối cùng Macrotask queue mới chạy setTimeout (in 2). Kết quả: 1, 4, 3, 2.'
      },
      {
        id: 2,
        question: 'Trong CSS, thuộc tính `will-change: transform` giúp ích gì?',
        options: [
          'A. Giúp biến đổi kích thước phần tử mượt hơn',
          'B. Báo cho trình duyệt biết trước để đưa phần tử lên GPU layer riêng (Compositing), tránh repaint/reflow liên tục',
          'C. Thay đổi z-index tự động',
          'D. Bắt buộc kích hoạt flexbox'
        ],
        correct: 1,
        explanation: 'will-change báo trước cho browser tối ưu tài nguyên phần cứng (GPU layer composite), giúp animation 60fps mượt mà.'
      }
    ]
  },
  {
    id: 'it-backend-system-design',
    title: 'Flashcard Anki: 200 Câu Phỏng Vấn Backend, Database & System Design',
    subtitle: 'Trang bị tư duy thiết kế hệ thống chịu tải cao, phỏng vấn Mid-Senior Back-end',
    category: 'it-tech',
    categoryLabel: 'Luyện Phỏng Vấn IT',
    badge: 'Chuyên sâu 🚀',
    price: 89000,
    originalPrice: 250000,
    rating: 4.9,
    reviewsCount: 710,
    studentsCount: 1820,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', 'Sơ đồ System Design Cheatsheet', 'Tổng Hợp Câu Hỏi Xử Lý Concurrency'],
    description: 'Chinh phục các vòng phỏng vấn chuyên sâu Backend: Database Indexing (B-Tree, Hash, LSM Tree), SQL vs NoSQL, Transaction ACID, Distributed Locks (Redis Redlock), Caching Strategies (Cache-Aside, Write-Through, Write-Behind, Cache Stampede), Message Queues (Kafka vs RabbitMQ), Rate Limiting, Idempotency và CAP Theorem.',
    highlights: [
      '200 Thẻ Anki chuẩn hóa câu trả lời ngắn gọn, đánh trúng điểm số của Technical Interviewer',
      'Phân tích chi tiết các tình huống xử lý race condition và duplicate payment',
      'Kèm bản vẽ kiến trúc minh họa cho 15 bài toán System Design phổ biến',
      'Mẹo tính toán ước lượng dung lượng (Back-of-the-envelope estimation)'
    ],
    previewCards: [
      {
        id: 1,
        front: 'Phân biệt Cache-Aside, Write-Through và Write-Behind (Write-Back) Caching?',
        back: '1. Cache-Aside: App tự đọc cache trước, miss thì đọc DB rồi ghi vào cache. Ghi thì update DB rồi xóa cache. Phổ biến nhất.\n2. Write-Through: App ghi vào cache, cache tự động đồng bộ ngay lập tức vào DB rồi mới trả về thành công.\n3. Write-Behind: App ghi vào cache rồi trả về ngay, cache ghi bất đồng bộ (batch) vào DB sau (tốc độ cao nhưng có nguy cơ mất data nếu crash).',
        tag: 'Caching Strategy'
      },
      {
        id: 2,
        front: 'Làm thế nào để đảm bảo tính Idempotency (bất biến) cho API thanh toán hoặc tạo đơn hàng?',
        back: 'Dùng IDEMPOTENCY KEY (hoặc Request ID duy nhất sinh từ client):\n1. Khi client gửi request kèm Header: Idempotency-Key.\n2. Server dùng Redis `SET key value NX EX 300` (Distributed Lock).\n3. Nếu key đã tồn tại: trả về kết quả đang xử lý hoặc kết quả đã lưu trước đó.\n4. Tránh hoàn toàn việc trừ tiền hoặc tạo 2 đơn hàng trùng lặp khi người dùng bấm đúp hoặc mạng lag retry.',
        tag: 'System Design & Payment'
      },
      {
        id: 3,
        front: 'B-Tree Index trong CSDL quan hệ (MySQL/PostgreSQL) hoạt động như thế nào và tại sao nó tối ưu cho range query?',
        back: 'B-Tree lưu dữ liệu theo cấu trúc cây cân bằng tự sắp xếp theo thứ tự tăng dần. Các node lá (leaf nodes) liên kết với nhau thành danh sách liên kết đôi (doubly-linked list).\n\n💡 Khi tìm kiếm theo khoảng (WHERE age BETWEEN 20 AND 30):\n- Database chỉ cần tìm node bắt đầu O(log N).\n- Sau đó duyệt tuần tự các lá kế tiếp O(K) mà không cần quét lại từ gốc cây.',
        tag: 'Database Index'
      },
      {
        id: 4,
        front: 'Định lý CAP phát biểu điều gì? Tại sao trong hệ thống phân tán không thể có cả CA?',
        back: 'CAP gồm:\n- C (Consistency): Mọi node đều đọc được dữ liệu mới nhất cùng lúc.\n- A (Availability): Mọi request đều nhận được phản hồi không lỗi.\n- P (Partition Tolerance): Hệ thống vẫn hoạt động khi mạng giữa các node bị đứt kết nối.\n\n⚠️ Vì đường truyền mạng luôn có nguy cơ đứt (Network Partition là thực tế bắt buộc), ta CHỈ ĐƯỢC CHỌN giữa CP (hy sinh Availability) hoặc AP (hy sinh Consistency tạm thời). Không thể chọn CA trên mạng phân tán.',
        tag: 'Distributed Systems'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Vấn đề "Cache Stampede" (hay Thundering Herd) xảy ra khi nào và cách khắc phục tốt nhất là gì?',
        options: [
          'A. Khi dung lượng RAM của Redis bị đầy',
          'B. Khi một key cache có lượng truy cập cực lớn bị hết hạn (expire) cùng lúc, khiến hàng triệu request đồng loạt ập vào Database',
          'C. Khi mạng giữa Redis và MySQL bị mất kết nối',
          'D. Khi lưu chuỗi JSON quá lớn vào Redis'
        ],
        correct: 1,
        explanation: 'Khắc phục bằng Mutex Lock (chỉ cho 1 request gọi DB nạp lại cache, các request khác chờ) hoặc dùng Probabilistic Early Expiration (XFetch).'
      }
    ]
  },
  {
    id: 'ielts-band-75-vocab',
    title: 'Flashcard Anki: 1200 Từ Vựng IELTS Band 7.5+ Theo Chủ Đề (Kèm Audio & Collocations)',
    subtitle: 'Tăng band Writing & Speaking thần tốc với từ vựng C1/C2 học thuật thực chiến',
    category: 'ngoai-ngu',
    categoryLabel: 'Chứng Chỉ Ngoại Ngữ',
    badge: 'Được yêu thích ⭐',
    price: 59000,
    originalPrice: 180000,
    rating: 4.95,
    reviewsCount: 1650,
    studentsCount: 4210,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', 'Phát Âm Bản Xứ Tự Động', 'Ebook 20 Chủ Đề Writing Task 2'],
    description: 'Bộ thẻ từ vựng IELTS đỉnh cao được biên soạn bởi cựu giám khảo và giáo viên 8.5 IELTS. Phân chia theo 20 chủ đề nóng nhất trong kỳ thi: Environment, Technology, Education, Crime, Healthcare, Globalization... Mỗi thẻ đều có định nghĩa Anh-Anh, Collocation tự nhiên, câu ví dụ mẫu chuẩn văn phong Task 2 và phát âm chuẩn bản xứ.',
    highlights: [
      '1200 từ và cụm từ Band 7.5 – 8.5 chọn lọc, không dạy từ sáo rỗng khó dùng',
      'Có sẵn tính năng đọc phát âm tự động trực tiếp trên web và ứng dụng Anki',
      'Phần ghi chú chỉ rõ bẫy dùng sai ngữ cảnh mà người Việt thường mắc',
      'Học 15 phút mỗi ngày theo thuật toán Spaced Repetition'
    ],
    previewCards: [
      {
        id: 1,
        front: 'exacerbate /ɪɡˈzæs.ə.beɪt/ (v)',
        back: 'Định nghĩa: Làm trầm trọng thêm, làm tồi tệ hơn (to make something that is already bad even worse).\n\n📌 Collocation: exacerbate the problem, exacerbate poverty, exacerbate tensions.\n📝 Ví dụ: The economic sanctions have further exacerbated the ongoing financial crisis.',
        tag: 'Society & Economy'
      },
      {
        id: 2,
        front: 'ubiquitous /juːˈbɪk.wə.təs/ (adj)',
        back: 'Định nghĩa: Có mặt ở khắp nơi, phổ biến rộng rãi (seeming to be everywhere).\n\n📌 Collocation: ubiquitous influence, become ubiquitous.\n📝 Ví dụ: Smartphones have become ubiquitous in modern urban life, fundamentally reshaping how we interact.',
        tag: 'Technology'
      },
      {
        id: 3,
        front: 'detrimental /ˌdet.rɪˈmen.təl/ (adj)',
        back: 'Định nghĩa: Gây hại, có hại (causing harm or damage - thay thế cho harmful / bad).\n\n📌 Collocation: detrimental effect on, detrimental impact.\n📝 Ví dụ: Excessive screen time can have a detrimental effect on children\'s cognitive development.',
        tag: 'Health & Youth'
      },
      {
        id: 4,
        front: 'mitigate /ˈmɪt.ɪ.ɡeɪt/ (v)',
        back: 'Định nghĩa: Giảm nhẹ, xoa dịu (to make something less harmful, unpleasant, or bad).\n\n📌 Collocation: mitigate climate change, mitigate the risks, mitigate the impact.\n📝 Ví dụ: Urgent global cooperation is required to mitigate the devastating effects of climate change.',
        tag: 'Environment'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Chọn từ đồng nghĩa nâng cao thay thế cho "make the situation worse" trong văn cảnh học thuật:',
        options: [
          'A. alleviate',
          'B. exacerbate',
          'C. facilitate',
          'D. perpetuate'
        ],
        correct: 1,
        explanation: 'Exacerbate mang nghĩa làm trầm trọng thêm một tình huống tiêu cực. (Alleviate nghĩa là xoa dịu/làm nhẹ bớt).'
      }
    ]
  },
  {
    id: 'toeic-850-flashcard',
    title: 'Bộ Thẻ Anki: 600 Từ Vựng & 100 Bẫy Ngữ Pháp TOEIC 850+ Format Mới',
    subtitle: 'Xử lý gọn Part 5 & 6 trong 12 phút, tối ưu điểm Reading nhanh nhất',
    category: 'ngoai-ngu',
    categoryLabel: 'Chứng Chỉ Ngoại Ngữ',
    badge: 'Cam kết tăng 150đ',
    price: 49000,
    originalPrice: 150000,
    rating: 4.88,
    reviewsCount: 1120,
    studentsCount: 3100,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', '100 Bẫy Ngữ Pháp Thường Gặp', 'File Audio Nghe Ngấm'],
    description: 'Chiến thuật học từ vựng TOEIC thực chiến nhất: Gom 600 từ vựng xuất hiện với tần suất trên 80% trong đề thi ETS mới nhất, kết hợp 100 dạng bẫy ngữ pháp liên từ, giới từ, đại từ quan hệ và phân từ rút gọn. Giúp bạn nhìn câu là chọn được đáp án ngay trong 5-10 giây.',
    highlights: [
      '600 Thẻ từ vựng thương mại, hành chính văn phòng chuẩn format đề thi thật',
      '100 Thẻ bẫy trắc nghiệm Part 5 chỉ rõ dấu hiệu nhận biết đáp án trong 5 giây',
      'Định dạng chuẩn Anki có âm thanh phát âm bản xứ',
      'Tặng kèm bảng tổng hợp từ đồng nghĩa thường xuất hiện trong Part 7'
    ],
    previewCards: [
      {
        id: 1,
        front: 'accommodate /əˈkɑː.mə.deɪt/ (v)',
        back: 'Nghĩa trong TOEIC:\n1. Đáp ứng nhu cầu (to fulfill/meet: accommodate requests/needs).\n2. Cung cấp chỗ ở/chứa được (to provide space for: accommodate up to 500 guests).\n\n⚠️ Bẫy: Thường đi kèm cụm "accommodate changes" hoặc "accommodate special requests".',
        tag: 'Business & Service'
      },
      {
        id: 2,
        front: 'Bẫy giới từ: Phân biệt "despite/in spite of" vs "although/even though"?',
        back: '• despite / in spite of + DANH TỪ hoặc V-ing.\n• although / even though / though + MỆNH ĐỀ (S + V).\n\n💡 Mẹo 3 giây: Nhìn phía sau chỗ trống, nếu có ĐỘNG TỪ CHIA THÌ $\\rightarrow$ chọn Although. Nếu chỉ có cụm danh từ $\\rightarrow$ chọn Despite.',
        tag: 'Bẫy Ngữ Pháp'
      },
      {
        id: 3,
        front: 'mandatory /ˈmæn.də.tɔːr.i/ (adj)',
        back: 'Nghĩa: Bắt buộc (required by law or rule = compulsory/obligatory).\n\n📌 Collocation: mandatory training session, mandatory attendance.\n📝 Ví dụ: Attendance at the safety orientation is mandatory for all new employees.',
        tag: 'HR & Policy'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Mr. Henderson had to cancel his flight _______ unexpected business obligations in Tokyo.',
        options: [
          'A. because of',
          'B. because',
          'C. although',
          'D. even if'
        ],
        correct: 0,
        explanation: 'Phía sau chỗ trống là một cụm danh từ "unexpected business obligations", do đó phải dùng giới từ "because of". (Because đi với mệnh đề).'
      }
    ]
  },
  {
    id: 'jlpt-n3-n2-kanji',
    title: 'Flashcard Anki: 1500 Kanji & Ngữ Pháp JLPT N3 - N2 (Mẹo Nhớ Siêu Tốc)',
    subtitle: 'Phương pháp giải nghĩa bộ thủ, nhớ Kanji dai dẳng không bao giờ quên',
    category: 'ngoai-ngu',
    categoryLabel: 'Chứng Chỉ Ngoại Ngữ',
    badge: 'Độc quyền 🇯🇵',
    price: 69000,
    originalPrice: 199000,
    rating: 4.92,
    reviewsCount: 890,
    studentsCount: 2200,
    updatedAt: 'Tháng 10/2026',
    format: ['File Anki (.apkg)', 'Bảng Bộ Thủ 214 Chữ', 'Tổng Hợp Ngữ Pháp N2 Điểm Liệt'],
    description: 'Chinh phục 1500 chữ Hán N3 - N2 và 180 mẫu ngữ pháp dễ nhầm lẫn. Mỗi chữ Hán được phân tích rành mạch theo từng bộ thủ, âm Hán Việt, âm On, âm Kun và các từ ghép thông dụng nhất trong đề thi JLPT chính thức.',
    highlights: [
      '1500 Kanji có hình ảnh phân tách bộ thủ và câu chuyện gợi nhớ trí tưởng tượng',
      'Âm Hán Việt chuẩn xác giúp người Việt suy luận nghĩa nhanh như gió',
      '180 Mẫu ngữ pháp N3 và N2 kèm ví dụ phân biệt sự khác nhau tinh tế',
      'Hỗ trợ chế độ viết tay và kiểm tra phản xạ'
    ],
    previewCards: [
      {
        id: 1,
        front: '【Kanji】 構 (Hán Việt: CẤU)',
        back: 'Âm On: コウ | Âm Kun: かま・える, かま・う\nNghĩa: Cấu tạo, cấu thành, bận tâm.\n\n📌 Bộ thủ: Mộc (木) + Cấu (冓: đan chéo các thanh gỗ).\n📝 Từ vựng thi JLPT:\n• 構成 (こうせい): Cấu thành, cơ cấu.\n• 構造 (こうぞう): Cấu trúc.\n• 構わない (かまわない): Không sao, không bận tâm.',
        tag: 'Kanji N2'
      },
      {
        id: 2,
        front: '【Ngữ pháp】 ～にほかならない (~ ni hoka naranai)',
        back: 'Ý nghĩa: Chính là..., Không gì khác hơn là... (dùng để nhấn mạnh lý do duy nhất).\n\n📌 Cấu trúc: N + にほかならない\n📝 Ví dụ: 今回の成功は、チーム全員の努力の結果にほかならない。\n(Thành công lần này chính là kết quả từ nỗ lực của toàn bộ thành viên trong đội).',
        tag: 'Ngữ Pháp N2'
      }
    ],
    previewQuiz: [
      {
        id: 1,
        question: 'Chọn cách đọc Hiragana đúng của từ 「慎重」 (THẬN TRỌNG):',
        options: [
          'A. しんちょう (Shinchou)',
          'B. じんちょう (Jinchou)',
          'C. しんじゅう (Shinjuu)',
          'D. せんちょう (Senchou)'
        ],
        correct: 0,
        explanation: '慎 (Thận) đọc là しん (shin), 重 (Trọng) đọc là ちょう (chou) $\\rightarrow$ しんちょう (cẩn thận, thận trọng).'
      }
    ]
  }
];

export const COMBO_PACKAGE = {
  id: 'combo-all-access',
  title: 'COMBO VIP: Mở Khóa Trọn Đời Tất Cả Tài Liệu & Flashcard',
  subtitle: 'Sở hữu toàn bộ 6+ kho tài liệu Công Chức, IT và Ngoại Ngữ + Cập nhật miễn phí trọn đời',
  originalPrice: 1047000,
  price: 189000,
  discountPercent: 82,
  badge: 'Tiết kiệm 82% 🔥',
  features: [
    'Toàn bộ 6 bộ tài liệu Flashcard Anki (.apkg) đầy đủ quyền truy cập',
    'Toàn bộ 1500+ câu trắc nghiệm và đề thi thử có lời giải chi tiết',
    'Tải không giới hạn file PDF tóm tắt kiến thức và ebook',
    'Học online trực tiếp trên trình duyệt web không cần cài phần mềm',
    'Quyền truy cập vĩnh viễn và nhận cập nhật các kỳ thi năm 2026-2027 miễn phí',
    'Hỗ trợ kỹ thuật 1-1 qua Zalo khi cài đặt Anki trên điện thoại / máy tính'
  ]
};

export const TESTIMONIALS = [
  {
    name: 'Nguyễn Văn Hùng',
    role: 'Đỗ Chuyên viên - Sở Kế hoạch & Đầu tư',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    content: 'Bộ Flashcard Kiến thức chung công chức thực sự cứu cánh cho mình. Trước đó đọc Luật khô khan không sao nhớ nổi mấy con số thời hạn kỷ luật, vậy mà cày thẻ Anki 2 tuần là nhớ như in. Vòng 1 mình đạt 54/60 câu!',
    badge: 'Đỗ Thủ Khoa Khối Sở 2025'
  },
  {
    name: 'Trần Minh Tuấn',
    role: 'Senior Frontend Developer tại FPT Software',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    content: 'Bộ 250 câu hỏi Frontend Master tóm tắt cực kỳ gọn gàng. Phỏng vấn hỏi đúng phần Event loop microtask và React 19 hydration, mình trả lời trôi chảy và nhận ngay offer tăng 40% lương. Giá quá hời so với giá trị!',
    badge: 'Pass Offer $2,200'
  },
  {
    name: 'Lê Thuỳ Linh',
    role: 'IELTS Overall 8.0 (Writing 7.5)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    content: 'Từ vựng trong bộ này xịn thật sự, collocations tự nhiên chứ không phải nhồi nhét từ cổ. Mình kết nhất tính năng lật thẻ trực tiếp trên web có phát âm chuẩn, vừa nấu ăn vừa nghe thẻ cực kỳ tiện lợi.',
    badge: 'Tăng 1.5 Band sau 1 tháng'
  }
];

export const FAQS = [
  {
    q: 'Sau khi thanh toán tôi sẽ nhận tài liệu như thế nào?',
    a: 'Hệ thống tự động kích hoạt 100% qua VietQR. Ngay khi chuyển khoản thành công (trong vòng 3-10 giây), trang web sẽ lập tức mở khóa nút tải file (.apkg cho Anki, file PDF) và mở khóa toàn bộ quyền học thẻ trực tiếp trên web. Đồng thời link tải cũng được lưu vào mục "Tài liệu của tôi" trên trình duyệt của bạn vĩnh viễn.'
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
    q: 'Thanh toán có an toàn không? Có hỗ trợ nếu gặp lỗi không?',
    a: 'Hệ thống sử dụng cổng thanh toán chuẩn VietQR (chuyển khoản ngân hàng chính chủ, kiểm tra tự động qua mã đơn hàng duy nhất). Nếu có bất kỳ thắc mắc nào, đội ngũ hỗ trợ qua Zalo 0988.xxx.xxx sẵn sàng giải đáp 24/7 trong vòng 2 phút.'
  }
];
