// AI Tutor Assistant for Flashcards & Quizzes
// Powered by Google Gemini Multi-Model API + OpenAI Platform + Offline Smart Tutor Fallback

import { getGeminiApiKey, getOpenAIApiKey, GEMINI_MODELS } from './aiApiKey';

/**
 * Request deeper AI explanation for a Flashcard
 */
export async function explainFlashcardWithAi({ front, back, tag, title }) {
  const geminiKey = getGeminiApiKey();
  const openaiKey = getOpenAIApiKey();

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

  // 1. Try Gemini models with auto-failover
  if (geminiKey) {
    for (const model of GEMINI_MODELS) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.35
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${response.status}`;
          if (response.status === 400 && lastError.includes('API_KEY_INVALID')) {
            break;
          }
          continue;
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
        clearTimeout(timeoutId);
        lastError = err.message;
      }
    }
  }

  // 2. Try OpenAI if Gemini unavailable
  if (openaiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Bạn là Trợ lý Gia sư Học thuật AI của ÔnThiHub. Giải thích ngắn gọn, chuyên sâu, đúng 3 phần theo yêu cầu.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.35
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content || '';
        if (text.trim()) {
          return {
            success: true,
            model: 'gpt-4o-mini',
            content: text.trim()
          };
        }
      }
    } catch (err) {
      console.warn('OpenAI tutor failover:', err);
    }
  }

  // 3. Fallback Smart Educational Breakdown
  const fallbackText = `### 💡 1. Bản Chất & Phân Tích Cốt Lõi
Khái niệm **"${front}"** xoay quanh nội dung trọng tâm:
> ${back}

Nắm vững nguyên lý này giúp bạn hiểu sâu bản chất vấn đề thay vì chỉ ghi nhớ thụ động.

### 🧠 2. Mẹo Ghi Nhớ Siêu Tốc (Mnemonic)
• **Kỹ thuật Neo Từ Khóa (Keyword Anchoring):** Gắn kết từ khóa then chốt trong câu hỏi với đáp án đầu tiên nảy ra trong đầu.
• **Khoảng cách ngắt quãng (Spaced Repetition):** Lật lại thẻ này sau 1 ngày, 3 ngày và 7 ngày để kiến thức chuyển từ trí nhớ ngắn hạn vào dài hạn.

### 📝 3. Tình Huống Thực Chiến & Bẫy Đề Thi
⚠️ **Bẫy thi thường gặp:** Thí sinh hay đọc lướt các điều kiện ngoại lệ hoặc từ ngữ loại trừ (chỉ, luôn luôn, bắt buộc). Hãy luôn đối chiếu kỹ lưỡng trước khi chọn đáp án!`;

  return {
    success: true,
    model: 'Smart Tutor Engine',
    content: fallbackText
  };
}

/**
 * Request deeper AI breakdown for a Quiz Question
 */
export async function explainQuizQuestionWithAi({ question, options = [], correct, userAnswer, explanation, title }) {
  const geminiKey = getGeminiApiKey();
  const openaiKey = getOpenAIApiKey();

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

  // 1. Try Gemini
  if (geminiKey) {
    for (const model of GEMINI_MODELS) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.35
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${response.status}`;
          if (response.status === 400 && lastError.includes('API_KEY_INVALID')) {
            break;
          }
          continue;
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
        clearTimeout(timeoutId);
        lastError = err.message;
      }
    }
  }

  // 2. Try OpenAI
  if (openaiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Bạn là Giảng viên Khảo thí & Luyện thi ÔnThiHub. Phân tích chi tiết câu hỏi trắc nghiệm theo 3 phần.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.35
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content || '';
        if (text.trim()) {
          return {
            success: true,
            model: 'gpt-4o-mini',
            content: text.trim()
          };
        }
      }
    } catch (e) {
      console.warn('OpenAI quiz tutor failover:', e);
    }
  }

  // 3. Fallback Smart Quiz Breakdown
  const fallbackText = `### 🎯 1. Tại Sao Đáp Án ${String.fromCharCode(65 + correct)} Là Chính Xác?
Phương án đúng là: **${options[correct] || ''}**.
${explanation ? `\n📌 Căn cứ giải thích: ${explanation}` : ''}

### ⚠️ 2. Bóc Mẽ Chiêu Trò Cài Bẫy (Tại Sao Các Phương Án Khác Sai?)
Các phương án còn lại là phương án nhiễu (distractors) được thiết kế để đánh lừa thí sinh chỉ nhớ kiến thức mang tính đại khái. Chúng thường chứa một nửa sự thật hoặc đảo ngược các mốc thời gian/chủ thể thẩm quyền.

### ⚡ 3. Mẹo Khoanh Nhanh Trong 10 Giây
Dùng phương pháp loại trừ: Gạch bỏ ngay 2 phương án phi lý nhất, sau đó tập trung đối chiếu từ khóa cốt lõi giữa 2 phương án còn lại.`;

  return {
    success: true,
    model: 'Smart Tutor Engine',
    content: fallbackText
  };
}
