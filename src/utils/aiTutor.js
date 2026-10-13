// AI Tutor Assistant for Flashcards & Quizzes
// Powered by Google Gemini Multi-Model API (gemini-3.8-flash / 3.7-flash / 2.5-flash)

import { getGeminiApiKey, GEMINI_MODELS } from './aiApiKey';

/**
 * Request deeper AI explanation for a Flashcard
 */
export async function explainFlashcardWithAi({ front, back, tag, title }) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return {
      success: false,
      message: 'Vui lòng kích hoạt AI Key trong Cài đặt để sử dụng Trợ lý AI!'
    };
  }

  const prompt = `Bạn là Trợ lý Gia sư Học thuật AI của nền tảng ÔnThiHub.
Nhiệm vụ: Giải thích chi tiết, chuyên sâu và dễ hiểu nhất nội dung thẻ ghi nhớ (Flashcard) dưới đây cho học viên:

THÔNG TIN THẺ:
- Bộ thẻ: ${title || 'Ôn tập kiến thức'}
- Mặt trước (Khái niệm / Câu hỏi): "${front}"
- Mặt sau (Đáp án tóm tắt): "${back}"
- Nhãn phân loại: "${tag || 'Tổng quát'}"

HÃY TRÌNH BÀY ĐÚNG 3 PHẦN SAU (súc tích, có biểu tượng cảm xúc sinh động, viết bằng Markdown):
### 💡 1. Bản Chất & Phân Tích Cốt Lõi
(Giải thích cặn kẽ vì sao lại như vậy, định nghĩa hoặc cơ chế hoạt động đằng sau bằng ngôn từ dễ hiểu)

### 🧠 2. Mẹo Ghi Nhớ Siêu Tốc (Mnemonic)
(Đưa ra kỹ thuật liên tưởng, mẹo nhớ từ khóa hoặc câu vần giúp não bộ ghi nhớ vĩnh viễn theo phương pháp Spaced Repetition)

### 📝 3. Tình Huống Thực Chiến & Bẫy Đề Thi
(Đưa ra 1 ví dụ thực tế hoặc chỉ ra lỗi sai phổ biến mà 80% thí sinh hay bị đánh lừa trong bài thi thật)`;

  let lastError = '';

  for (const model of GEMINI_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.35
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        lastError = errData?.error?.message || `HTTP ${response.status}`;
        if (response.status === 503 || response.status === 429) continue;
        break;
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const text = parts.map(p => p.text || '').filter(Boolean).join('\n');
      if (text && text.trim()) {
        return {
          success: true,
          model,
          content: text.trim()
        };
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  return {
    success: false,
    message: `Không thể kết nối đến Trợ lý AI: ${lastError || 'Lỗi mạng'}`
  };
}

/**
 * Request deeper AI breakdown for a Quiz Question
 */
export async function explainQuizQuestionWithAi({ question, options = [], correct, userAnswer, explanation, title }) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return {
      success: false,
      message: 'Vui lòng kích hoạt AI Key để sử dụng Trợ lý AI!'
    };
  }

  const optionsText = options.map((opt, idx) => {
    const isCorrect = idx === correct;
    const isUserPick = idx === userAnswer;
    let badge = '';
    if (isCorrect) badge = ' (ĐÁP ÁN ĐÚNG)';
    if (isUserPick && !isCorrect) badge = ' (BẠN ĐÃ CHỌN SAI)';
    return `${String.fromCharCode(65 + idx)}. ${opt}${badge}`;
  }).join('\n');

  const prompt = `Bạn là Giảng viên Khảo thí & Luyện thi hàng đầu của ÔnThiHub.
Học viên đang cần giải thích chi tiết câu hỏi trắc nghiệm này:

ĐỀ THI: ${title || 'Trắc nghiệm kiến thức'}
CÂU HỎI:
"${question}"

CÁC PHƯƠNG ÁN LỰA CHỌN:
${optionsText}

GIẢI THÍCH BAN ĐẦU:
"${explanation || 'Chưa có giải thích chi tiết'}"

HÃY PHÂN TÍCH RÕ RÀNG THEO CẤU TRÚC SAU (bằng Markdown, phong cách sư phạm cuốn hút):
### 🎯 1. Tại Sao Đáp Án ${String.fromCharCode(65 + correct)} Là Chính Xác Tuyệt Đối?
(Căn cứ điều luật, công thức toán học, nguyên lý kỹ thuật hoặc ngữ cảnh ngữ pháp cụ thể)

### ⚠️ 2. Bóc Mẽ Chiêu Trò Cài Bẫy (Tại Sao Các Phương Án Khác Sai?)
(Chỉ rõ bẫy tâm lý hoặc lỗi suy luận nào khiến thí sinh dễ chọn nhầm các phương án gây nhiễu)

### ⚡ 3. Mẹo Khoanh Nhanh Trong 10 Giây
(Quy tắc loại trừ hoặc từ khóa then chốt - keyword indicator - để phát hiện ngay đáp án đúng khi đi thi)`;

  let lastError = '';

  for (const model of GEMINI_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.35
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        lastError = errData?.error?.message || `HTTP ${response.status}`;
        if (response.status === 503 || response.status === 429) continue;
        break;
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const text = parts.map(p => p.text || '').filter(Boolean).join('\n');
      if (text && text.trim()) {
        return {
          success: true,
          model,
          content: text.trim()
        };
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  return {
    success: false,
    message: `Không thể kết nối đến Trợ lý AI: ${lastError || 'Lỗi mạng'}`
  };
}
