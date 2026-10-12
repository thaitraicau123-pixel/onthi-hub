// AI Flashcard Generator Engine
// Converts topic / notes into Anki/Quizlet formatted flashcards

export async function generateFlashcardsWithAI({ topic, rawText = '', cardCount = 6 }) {
  // Simulate AI reasoning delay for realistic feel
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const lowerTopic = (topic + ' ' + rawText).toLowerCase();

  // Smart Context-aware generation based on user inputs
  if (lowerTopic.includes('công chức') || lowerTopic.includes('luật') || lowerTopic.includes('hiến pháp') || lowerTopic.includes('viên chức')) {
    return [
      {
        front: `Cơ quan nào có thẩm quyền ban hành Nghị định quy định chi tiết điều luật?`,
        back: `CHÍNH PHỦ.\n\n📌 Căn cứ: Luật Ban hành văn bản quy phạm pháp luật.\n💡 Mẹo nhớ: Thủ tướng ban hành Quyết định, Bộ trưởng ban hành Thông tư.`,
        tag: 'Văn bản QPPL'
      },
      {
        front: `Thời hiệu xử lý kỷ luật đối với hành vi vi phạm ít nghiêm trọng của công chức là bao lâu?`,
        back: `02 NĂM kể từ thời điểm có hành vi vi phạm.\n\n📌 Căn cứ: Khoản 1 Điều 80 Luật Cán bộ, công chức (sửa đổi 2019).\n💡 Mẹo nhớ: Khiển trách = 2 năm. Các hình thức khác = 5 năm.`,
        tag: 'Kỷ luật Công chức'
      },
      {
        front: `Thời hạn tập sự đối với công chức loại C (ngạch chuyên viên) là bao nhiêu tháng?`,
        back: `12 THÁNG.\n\n📌 Căn cứ: Nghị định 138/2020/NĐ-CP.\n💡 Mẹo nhớ: Loại C (Đại học) = 12 tháng. Loại D (Cao đẳng/Trung cấp) = 06 tháng.`,
        tag: 'Tập sự'
      },
      {
        front: `Những trường hợp nào KHÔNG áp dụng thời hiệu xử lý kỷ luật cán bộ, công chức?`,
        back: `Gồm 4 trường hợp:\n1. Vi phạm đến mức khai trừ Đảng.\n2. Vi phạm bảo vệ chính trị nội bộ.\n3. Xâm phạm an ninh quốc gia.\n4. Dùng văn bằng, chứng chỉ giả.`,
        tag: 'Ngoại lệ Thời hiệu'
      },
      {
        front: `Hình thức kỷ luật "Hạ bậc lương" áp dụng cho đối tượng nào?`,
        back: `Chỉ áp dụng với CÔNG CHỨC KHÔNG GIỮ CHỨC VỤ LÃNH ĐẠO, QUẢN LÝ.\n\n💡 Mẹo nhớ: Công chức lãnh đạo thì bị Giáng chức hoặc Cách chức, không hạ bậc lương.`,
        tag: 'Hình thức kỷ luật'
      }
    ].slice(0, cardCount);
  }

  if (lowerTopic.includes('react') || lowerTopic.includes('frontend') || lowerTopic.includes('javascript') || lowerTopic.includes('web')) {
    return [
      {
        front: `Giải thích thứ tự thực thi của Event Loop trong JavaScript khi có Promise và setTimeout?`,
        back: `1. Call Stack (Đồng bộ) thực thi hết.\n2. Microtask Queue (Promise.then, queueMicrotask) được vét sạch.\n3. Macrotask Queue (setTimeout, setInterval, I/O) chạy 1 task.\n4. Render UI.\n\n💡 Vì vậy: Promise.resolve().then() LUÔN chạy trước setTimeout(..., 0).`,
        tag: 'JS Event Loop'
      },
      {
        front: `useMemo và useCallback trong React khác nhau như thế nào?`,
        back: `• useMemo: Memoize KẾT QUẢ của phép tính toán nặng.\n• useCallback: Memoize CHÍNH HÀM ĐÓ (function reference) để tránh re-render child component có React.memo.\n\n⚠️ Không lạm dụng khi chi phí memoization lớn hơn hàm tính toán.`,
        tag: 'React Hooks'
      },
      {
        front: `Chỉ số INP (Interaction to Next Paint) trong Core Web Vitals là gì?`,
        back: `INP đo lường độ trễ phản hồi của toàn bộ trang web đối với các tương tác click, gõ phím của người dùng trong suốt phiên truy cập.\n\n🚀 Tối ưu: Chia nhỏ Long Tasks (scheduler.yield()), giảm re-render, dùng Web Worker.`,
        tag: 'Web Performance'
      },
      {
        front: `Hydration trong Server-Side Rendering (SSR) là gì và lỗi Hydration Mismatch do đâu?`,
        back: `Hydration là quá trình JavaScript gắn các event listener và đồng bộ React state vào cây DOM HTML đã được Server tạo sẵn.\n\n⚠️ Mismatch: Xảy ra khi HTML từ Server khác với render trên Client (ví dụ: dùng typeof window, render Date.now(), Math.random()).`,
        tag: 'SSR & Hydration'
      }
    ].slice(0, cardCount);
  }

  if (lowerTopic.includes('ielts') || lowerTopic.includes('tiếng anh') || lowerTopic.includes('english') || lowerTopic.includes('vocab') || lowerTopic.includes('toeic')) {
    return [
      {
        front: `exacerbate /ɪɡˈzæs.ə.beɪt/ (v)`,
        back: `Định nghĩa: Làm trầm trọng thêm, làm tồi tệ hơn (to make a bad situation worse).\n\n📌 Collocations: exacerbate the crisis, exacerbate poverty.\n📝 Ví dụ: The drought has further exacerbated the country's food shortage.`,
        tag: 'Academic Vocab'
      },
      {
        front: `ubiquitous /juːˈbɪk.wə.təs/ (adj)`,
        back: `Định nghĩa: Có mặt ở khắp nơi, phổ biến (present everywhere).\n\n📌 Collocations: ubiquitous presence, become ubiquitous.\n📝 Ví dụ: Mobile payment apps have become ubiquitous in Asian metropolitan cities.`,
        tag: 'Advanced Adj'
      },
      {
        front: `detrimental /ˌdet.rɪˈmen.təl/ (adj)`,
        back: `Định nghĩa: Gây hại, có tác động tiêu cực (causing harm or damage).\n\n📌 Collocations: detrimental effect on, detrimental impact.\n📝 Ví dụ: Chronic stress poses a detrimental threat to both mental and physical well-being.`,
        tag: 'Band 8.0'
      },
      {
        front: `mitigate /ˈmɪt.ɪ.ɡeɪt/ (v)`,
        back: `Định nghĩa: Giảm nhẹ, xoa dịu (to make something less severe).\n\n📌 Collocations: mitigate risks, mitigate environmental impact.\n📝 Ví dụ: Strategic infrastructure planning is vital to mitigate flood hazards.`,
        tag: 'Writing Task 2'
      }
    ].slice(0, cardCount);
  }

  // Generic High-Yield Flashcards based on user input
  const title = topic.trim() || 'Chủ đề ôn tập';
  return [
    {
      front: `Khái niệm cốt lõi & Định nghĩa của "${title}" là gì?`,
      back: `Nội dung trọng tâm:\n${rawText ? rawText.slice(0, 180) + '...' : `Bản chất của ${title} là hệ thống kiến thức nền tảng giúp nắm bắt các quy tắc và mối quan hệ bản chất.`}\n\n💡 Mẹo nhớ: Liên hệ với bài toán thực tiễn và ví dụ cụ thể.`,
      tag: title.slice(0, 15)
    },
    {
      front: `Điểm khác biệt then chốt hoặc lỗi thường gặp nhất trong "${title}"?`,
      back: `Điểm dễ nhầm lẫn:\nThí sinh thường nhầm lẫn giữa định nghĩa cơ bản và trường hợp ngoại lệ. Cần lưu ý các điều kiện biên và tiêu chuẩn áp dụng.`,
      tag: 'Lỗi thường gặp'
    },
    {
      front: `3 Ứng dụng thực tế hoặc Dạng câu hỏi đề thi về "${title}"?`,
      back: `1. Phân tích tình huống thực tế.\n2. So sánh với các khái niệm tương đương.\n3. Nhận diện bẫy trắc nghiệm trong câu hỏi lựa chọn.`,
      tag: 'Thực chiến'
    },
    {
      front: `Quy tắc / Công thức vàng cần ghi nhớ về "${title}"?`,
      back: `Quy tắc cốt lõi: Nắm chắc nguyên lý từ gốc rễ trước khi ghi nhớ các công thức tính toán hoặc con số chi tiết.`,
      tag: 'Ghi nhớ sâu'
    }
  ].slice(0, cardCount);
}
