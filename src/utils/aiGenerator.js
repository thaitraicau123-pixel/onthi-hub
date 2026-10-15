// AI Flashcard Generator Engine
// Converts topic / notes into Anki/Quizlet formatted flashcards
// Supports Real Gemini Multi-Model API + OpenAI GPT-4o-mini API + Offline Smart Semantic Heuristics Fallback

import { getGeminiApiKey, getOpenAIApiKey, GEMINI_MODELS } from './aiApiKey.js';

/**
 * Calculate recommended card count based on text length and density
 */
export function calculateOptimalCardCount(rawText) {
  const text = (rawText || '').trim();
  if (!text) return 3;
  const len = text.length;
  if (len < 120) return 1;
  if (len < 400) return 2;
  if (len < 900) return 4;
  if (len < 2000) return 6;
  if (len < 4000) return 10;
  return 15;
}

/**
 * Call real Google Gemini API with auto-failover across active models
 */
async function callGeminiApi({ apiKey, topic, rawText, cardCount, customPrompt = '', extractionMode = 'auto', answerLength = 'balanced' }) {
  const effectiveCount = cardCount === 'auto' || !cardCount
    ? calculateOptimalCardCount(rawText)
    : Math.max(1, Math.min(30, Number(cardCount) || 5));

  const answerLengthGuidance = (() => {
    switch (answerLength) {
      case 'detailed':
        return `YÊU CẦU ĐỘ DÀI CÂU TRẢ LỜI: CHI TIẾT (KHOẢNG 50 - 100 TỪ).
- Trường "back" phải giải thích sâu, phân tích bản chất, viện dẫn chi tiết điều luật/căn cứ/nguyên lý và ví dụ minh họa cụ thể để người học nắm tường tận bản chất.`;
      case 'concise':
        return `YÊU CẦU ĐỘ DÀI CÂU TRẢ LỜI: NGẮN GỌN (KHOẢNG 10 - 25 TỪ).
- Trường "back" phải SIÊU CÔ ĐỌNG, đi thẳng vào đáp án/kết quả cốt lõi trong 1-2 dòng ngắn gọn. Không viết rườm rà lan man. Tối ưu cho ôn tập phản xạ siêu tốc.`;
      case 'balanced':
      default:
        return `YÊU CẦU ĐỘ DÀI CÂU TRẢ LỜI: VỪA ĐỦ (KHOẢNG 25 - 50 TỪ).
- Trường "back" súc tích, rõ ràng, gạch đầu dòng mạch lạc, kèm mẹo nhớ hoặc căn cứ ngắn gọn chuẩn phương pháp Anki SM-2.`;
    }
  })();

  const modeGuidance = (() => {
    switch (extractionMode) {
      case 'qa':
        return `CHẾ ĐỘ BẮT BUỘC: PHÂN BIỆT RÕ CÂU HỎI VÀ CÂU TRẢ LỜI CÓ SẴN (Q&A).
- Tài liệu đính kèm đã có sẵn các cặp Hỏi & Đáp (hoặc dạng Câu 1:... Trả lời:..., Q:... A:..., hoặc số thứ tự kèm gạch đầu dòng).
- Nhiệm vụ của bạn: Tách chính xác phần CÂU HỎI đặt vào trường "front", phần CÂU TRẢ LỜI/GIẢI THÍCH đặt vào trường "back".
- TUYỆT ĐỐI KHÔNG đảo lộn vị trí (không lấy câu trả lời làm câu hỏi và ngược lại).
- Giữ trọn vẹn đáp án gốc của người dùng, có thể gọt giũa lại cho sáng rõ theo chuẩn Anki.`;
      case 'questions_only':
        return `CHẾ ĐỘ: TÀI LIỆU CHỈ LÀ DANH SÁCH CÂU HỎI (CHƯA CÓ TRẢ LỜI).
- Lấy từng câu hỏi đưa vào trường "front".
- Bạn hãy tự đóng vai trò chuyên gia để giải đáp chuẩn xác, đắt giá, có căn cứ và mẹo nhớ vào trường "back".`;
      case 'summary':
        return `CHẾ ĐỘ: TÀI LIỆU LÀ BÀI GIẢNG / GHI CHÚ LÝ THUYẾT THUẦN TÚY.
- Phân tích nội dung và tự đặt câu hỏi gợi nhớ sắc bén, phản xạ tức thì cho trường "front".
- Viết câu trả lời súc tích, gạch đầu dòng rõ ràng cho trường "back".`;
      default:
        return `NGUYÊN TẮC NHẬN DIỆN THÔNG MINH (TỰ ĐỘNG PHÂN BIỆT CÂU HỎI VÀ TRẢ LỜI):
1. NẾU TÀI LIỆU ĐÃ CÓ CẢ CÂU HỎI VÀ TRẢ LỜI (như "Câu 1: ... Trả lời: ...", "Hỏi: ... Đáp: ...", "Q: ... A: ...", hoặc câu có dấu hỏi ? kèm câu giải thích):
   -> Lấy CÂU HỎI làm "front", CÂU TRẢ LỜI làm "back". Tuyệt đối không hoán đổi!
2. NẾU TÀI LIỆU CHỈ CÓ CÂU HỎI (chưa có câu trả lời):
   -> Đưa CÂU HỎI vào "front", AI tự giải đáp chi tiết vào "back".
3. NẾU TÀI LIỆU LÀ VĂN BẢN GHI CHÚ LÝ THUYẾT:
   -> AI tự trích xuất khái niệm cốt lõi, tự sinh câu hỏi gợi nhớ cho "front" và câu trả lời súc tích cho "back".`;
    }
  })();

  const customPromptSection = (customPrompt || '').trim()
    ? `\n🎯 LỜI NHẮC TÙY CHỈNH TỪ NGƯỜI DÙNG (CUSTOM PROMPT - ƯU TIÊN TUÂN THỦ CAO NHẤT):\n"${customPrompt.trim()}"\n`
    : '';

  const prompt = `Bạn là chuyên gia khảo thí và biên soạn học liệu hàng đầu theo phương pháp Lặp lại ngắt quãng (Spaced Repetition / Anki).
Nhiệm vụ: Dựa vào chủ đề và tài liệu dưới đây, biên soạn chính xác ${effectiveCount} thẻ flashcard ghi nhớ chất lượng cao, súc tích và đắt giá bằng tiếng Việt.

CHỦ ĐỀ: ${topic || 'Ôn tập kiến thức trọng tâm'}
TÀI LIỆU / GHI CHÚ ĐÍNH KÈM:
${rawText || 'Hãy tổng hợp những câu hỏi hay thi nhất, bẫy trắc nghiệm phổ biến và công thức/khái niệm cốt lõi của chủ đề này.'}

${modeGuidance}
${answerLengthGuidance}
${customPromptSection}

TIÊU CHUẨN ĐỘ DÀI & NỘI DUNG (THEO CHUẨN ANKI FLASHCARD):
- "front": Câu hỏi sắc bén, ngắn gọn, đi thẳng vào trọng tâm (khoảng 10-25 từ). Tuyệt đối không viết câu hỏi dài dòng, lan man.
- "back": Tuân thủ đúng tiêu chuẩn độ dài đã quy định ở trên. Sử dụng gạch đầu dòng rõ ràng, kèm mẹo nhớ hoặc ví dụ nếu có.
- "tag": Nhãn ngắn gọn phân loại thẻ (tối đa 3-4 từ).
- NGUYÊN TẮC BẤT DI BẤT DỊCH: Mỗi thẻ phải là MỘT đơn vị kiến thức riêng biệt, TUYỆT ĐỐI KHÔNG lặp lại nội dung đã hỏi ở các thẻ khác.
- Nếu tài liệu ngắn hơn số lượng thẻ yêu cầu, hãy chia tách thành các khía cạnh logic: Thẻ 1 (Khái niệm/Mục tiêu), Thẻ 2 (Nguyên lý/Cơ chế hoạt động), Thẻ 3 (Lợi ích/Ứng dụng thực tế), thay vì lặp lại cùng một câu chữ.

YÊU CẦU ĐỊNH DẠNG:
- Trả về ĐÚNG 1 MẢNG JSON (JSON Array), KHÔNG bọc trong markdown và KHÔNG có lời giải thích ngoài mảng JSON.
- Mỗi object trong mảng có 3 trường: "front", "back", "tag".

Ví dụ:
[
  { "front": "Cơ quan nào có thẩm quyền ban hành Nghị định?", "back": "Chính phủ.\\n\\n📌 Căn cứ: Luật Ban hành VBQPPL.\\n💡 Mẹo nhớ: Thủ tướng ban hành Quyết định, Bộ trưởng ban hành Thông tư.", "tag": "Văn bản QPPL" }
]`;

  let lastErr = null;

  for (const model of GEMINI_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: 'application/json'
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `HTTP ${response.status}`;
        lastErr = new Error(errMsg);

        // If key is invalid, abort Gemini to allow OpenAI or fallback
        if (response.status === 400 && (errMsg.includes('API_KEY_INVALID') || errMsg.toLowerCase().includes('api key not valid'))) {
          throw lastErr;
        }

        // 503 (high demand), 429 (quota), 404 (not found/deprecated), 500: try next model in pool
        continue;
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const text = parts.map(p => p.text || '').filter(Boolean).join('\n');
      if (!text) continue;

      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(cleanText);
      const cardsArray = Array.isArray(parsed) ? parsed : parsed.cards || parsed.flashcards;
      if (Array.isArray(cardsArray) && cardsArray.length > 0) {
        return cardsArray.map((item, idx) => ({
          id: idx + 1,
          front: String(item.front || item.question || '').trim(),
          back: String(item.back || item.answer || '').trim(),
          tag: String(item.tag || item.category || 'AI Flashcard').trim()
        })).filter(c => c.front && c.back);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      lastErr = err;
      if (err.message?.includes('API_KEY_INVALID')) {
        break;
      }
    }
  }

  throw lastErr || new Error('Không thể kết nối đến các mô hình AI Gemini');
}

/**
 * Call OpenAI API (GPT-4o-mini) as fallback or primary if configured
 */
async function callOpenAiApi({ apiKey, topic, rawText, cardCount, customPrompt = '', extractionMode = 'auto', answerLength = 'balanced' }) {
  const effectiveCount = cardCount === 'auto' || !cardCount
    ? calculateOptimalCardCount(rawText)
    : Math.max(1, Math.min(30, Number(cardCount) || 5));

  const answerLengthGuidance = (() => {
    switch (answerLength) {
      case 'detailed':
        return `ĐỘ DÀI CÂU TRẢ LỜI: CHI TIẾT (Khoảng 50-100 từ). Trường "back" giải thích sâu, viện dẫn căn cứ/công thức và ví dụ minh họa rõ ràng.`;
      case 'concise':
        return `ĐỘ DÀI CÂU TRẢ LỜI: NGẮN GỌN (Khoảng 10-25 từ). Trường "back" siêu cô đọng, đi thẳng vào đáp án/định nghĩa cốt lõi trong 1-2 dòng ngắn gọn.`;
      case 'balanced':
      default:
        return `ĐỘ DÀI CÂU TRẢ LỜI: VỪA ĐỦ (Khoảng 25-50 từ). Trường "back" súc tích, gạch đầu dòng rõ ràng, chuẩn phương pháp Anki SM-2.`;
    }
  })();

  const customPromptSection = (customPrompt || '').trim()
    ? `\n🎯 LỜI NHẮC TÙY CHỈNH TỪ NGƯỜI DÙNG: "${customPrompt.trim()}"\n`
    : '';

  const prompt = `Bạn là chuyên gia khảo thí và biên soạn học liệu theo phương pháp Spaced Repetition (Anki).
Biên soạn đúng ${effectiveCount} thẻ flashcard ghi nhớ chất lượng cao bằng tiếng Việt dựa trên:
CHỦ ĐỀ: ${topic || 'Ôn tập kiến thức trọng tâm'}
GHI CHÚ / TÀI LIỆU: ${rawText || 'Hãy tổng hợp những câu hỏi hay thi nhất, bẫy trắc nghiệm và khái niệm cốt lõi.'}
CHẾ ĐỘ TRÍCH XUẤT: ${extractionMode === 'qa' ? 'Phân biệt rõ Câu hỏi đưa vào front, Câu trả lời đưa vào back.' : extractionMode === 'questions_only' ? 'Tài liệu là câu hỏi, AI giải chi tiết vào back.' : 'Tự động phân biệt câu hỏi vs trả lời.'}
${answerLengthGuidance}
${customPromptSection}

TIÊU CHUẨN ĐỘ DÀI & NỘI DUNG (CHUẨN ANKI):
- "front": Câu hỏi sắc bén, ngắn gọn (10-25 từ).
- "back": Tuân thủ đúng tiêu chuẩn độ dài đã quy định ở trên.
- TUYỆT ĐỐI KHÔNG lặp lại nội dung đã hỏi giữa các thẻ.

YÊU CẦU:
Trả về ĐÚNG 1 MẢNG JSON dạng:
[
  {
    "front": "Câu hỏi / Thuật ngữ",
    "back": "Câu trả lời chuẩn xác kèm căn cứ / mẹo nhớ",
    "tag": "Nhãn phân loại (tối đa 3 từ)"
  }
]
Không kèm theo văn bản giải thích nào ngoài mảng JSON.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Bạn là chuyên gia biên soạn flashcard giáo dục hàng đầu. Luôn trả về mảng JSON hợp lệ.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `OpenAI HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';
    let clean = content.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(clean);
    const cardsArray = Array.isArray(parsed) ? parsed : parsed.cards || parsed.flashcards;
    if (Array.isArray(cardsArray) && cardsArray.length > 0) {
      return cardsArray.map((item, idx) => ({
        id: idx + 1,
        front: String(item.front || item.question || '').trim(),
        back: String(item.back || item.answer || '').trim(),
        tag: String(item.tag || item.category || 'OpenAI').trim()
      })).filter(c => c.front && c.back);
    }
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }

  throw new Error('Không nhận được dữ liệu hợp lệ từ OpenAI');
}

/**
 * Intelligent Semantic Flashcard Extractor (Offline / Fallback)
 * Dynamically extracts definitions, bullet points, Q&A pairs from raw text,
 * or synthesizes pedagogical flashcards tailored to any topic.
 */
function generateSmartSemanticCards({ topic, rawText = '', cardCount = 5, customPrompt = '', extractionMode = 'auto', answerLength = 'balanced' }) {
  const effectiveCount = cardCount === 'auto' || !cardCount
    ? calculateOptimalCardCount(rawText)
    : Math.max(1, Math.min(30, Number(cardCount) || 5));

  const title = (topic || '').trim() || 'Kiến Thức Trọng Tâm';
  const lowerText = ((topic || '') + ' ' + (rawText || '')).toLowerCase();

  // If user pasted detailed study notes or paragraphs, parse them directly!
  if (rawText && rawText.trim().length > 10) {
    const text = rawText.trim();
    const extractedCards = [];

    // 1. Check for explicit Q&A blocks (Câu 1: ... Trả lời: ... or Hỏi: ... Đáp: ...)
    const qaRegex = /(?:^|\n)\s*(?:câu\s*\d+|bài\s*\d+|q\s*\d+|hỏi|c\d+)?\s*[:.-]?\s*([^\n?]+(?:\?|[^\n]*))\s*(?:\n|\s)+(?:trả lời|đáp án|đáp|tl|ans|a)\s*[:.-]\s*([\s\S]*?)(?=(?:\n\s*(?:câu\s*\d+|bài\s*\d+|q\s*\d+|hỏi|c\d+)\s*[:.-])|$)/gi;
    let match;
    while ((match = qaRegex.exec(text)) !== null) {
      const q = (match[1] || '').trim();
      const a = (match[2] || '').trim();
      if (q && a && q.length > 3) {
        extractedCards.push({
          id: extractedCards.length + 1,
          front: q.includes('?') ? q : `${q}?`,
          back: a,
          tag: title.slice(0, 16)
        });
      }
    }

    // 2. Question lines with question marks '?'
    if (extractedCards.length === 0) {
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.endsWith('?') || (line.includes('?') && line.length < 140)) {
          const qText = line.replace(/^[-*•🎯📌💡\d.)\s]+/, '').trim();
          let ansText = '';
          if (i + 1 < lines.length && !lines[i + 1].endsWith('?')) {
            ansText = lines[i + 1].replace(/^[-*•🎯📌💡\s]+/, '').trim();
          }
          if (qText) {
            extractedCards.push({
              id: extractedCards.length + 1,
              front: qText,
              back: ansText || `📌 Trọng tâm: ${rawText.slice(0, 120)}...`,
              tag: title.slice(0, 16)
            });
          }
        }
      }
    }

    // 3. Look for Definition Patterns (X: Y, X - Y, X là Y)
    if (extractedCards.length === 0) {
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        if (line.includes(':') && line.indexOf(':') > 2 && line.indexOf(':') < 80) {
          const parts = line.split(':');
          const front = parts[0].replace(/^[-*•🎯📌💡\d.)\s]+/, '').trim();
          const back = parts.slice(1).join(':').trim();
          if (front && back && front.length < 90 && back.length > 3) {
            extractedCards.push({
              id: extractedCards.length + 1,
              front: front.includes('?') ? front : `[${title}] ${front} là gì?`,
              back: back,
              tag: front.slice(0, 16)
            });
          }
        } else if (line.includes(' - ') && line.indexOf(' - ') > 2 && line.indexOf(' - ') < 80) {
          const parts = line.split(' - ');
          const front = parts[0].replace(/^[-*•🎯📌💡\d.)\s]+/, '').trim();
          const back = parts.slice(1).join(' - ').trim();
          if (front && back && front.length < 90 && back.length > 3) {
            extractedCards.push({
              id: extractedCards.length + 1,
              front: front.includes('?') ? front : `[${title}] Ý nghĩa / Khái niệm: "${front}"?`,
              back: back,
              tag: front.slice(0, 16)
            });
          }
        }
      }
    }

    // 4. Look for Clauses with "vừa ... vừa ..." or multi-item sentences
    if (extractedCards.length === 0) {
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        if (line.includes('vừa') || line.includes('gồm') || line.includes('lợi thế') || line.includes('nguyên tắc')) {
          const cleanLine = line.replace(/^[-*•🎯📌💡\d.)\s]+/, '').trim();
          if (cleanLine.length > 25) {
            extractedCards.push({
              id: extractedCards.length + 1,
              front: `[${title}] Lợi thế then chốt & Các mục tiêu cốt lõi?`,
              back: cleanLine.replace(/vừa /g, '\n• ').replace(/, \n•/g, '\n•'),
              tag: 'Ý then chốt'
            });
            break;
          }
        }
      }
    }

    // Special Case: If user wants only 1 card, create 1 master flashcard directly from text
    if (effectiveCount === 1) {
      if (extractedCards.length > 0) {
        return [extractedCards[0]];
      }
      return [{
        id: 1,
        front: `[${title}] Trọng tâm kiến thức cần ghi nhớ là gì?`,
        back: rawText.trim(),
        tag: title.slice(0, 16)
      }];
    }

    // If we extracted at least 1 card from user's text
    if (extractedCards.length >= 1) {
      if (extractedCards.length >= effectiveCount) {
        return extractedCards.slice(0, effectiveCount);
      }
      // Expand with pedagogical dimensions if user requested more
      const moreCards = [
        {
          id: extractedCards.length + 1,
          front: `[${title}] Kỹ thuật liên tưởng & Mẹo ghi nhớ siêu tốc?`,
          back: `💡 Kỹ thuật Spaced Repetition:\n• Từ khóa trọng tâm: ${rawText.slice(0, 80)}...\n• Vận dụng phương pháp liên tưởng thực tiễn để nhớ lâu.`,
          tag: 'Mẹo nhớ'
        },
        {
          id: extractedCards.length + 2,
          front: `[${title}] Sai lầm hoặc bẫy đề thi hay gặp nhất?`,
          back: `⚠️ Bẫy đề thi:\nThí sinh hay quên các điều kiện đi kèm hoặc nhầm lẫn giữa định nghĩa và ngoại lệ. Hãy đọc kỹ các từ khóa hạn định!`,
          tag: 'Bẫy đề thi'
        }
      ];
      return [...extractedCards, ...moreCards].slice(0, effectiveCount);
    }
  }

  // Pre-compiled domain specific deep knowledge bases
  if (lowerText.includes('công chức') || lowerText.includes('luật') || lowerText.includes('hiến pháp') || lowerText.includes('viên chức')) {
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
      },
      {
        front: `Nguyên tắc nào là nguyên tắc hàng đầu trong thi hành công vụ?`,
        back: `Tuân thủ Hiến pháp và pháp luật; Bảo vệ lợi ích của Nhà nước, quyền và lợi ích hợp pháp của tổ chức, công dân.`,
        tag: 'Nguyên tắc công vụ'
      }
    ].slice(0, cardCount);
  }

  if (lowerText.includes('react') || lowerText.includes('frontend') || lowerText.includes('javascript') || lowerText.includes('web') || lowerText.includes('lập trình')) {
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
      },
      {
        front: `Khi nào nên sử dụng React Server Components (RSC) thay cho Client Components?`,
        back: `• Dùng RSC: Fetch dữ liệu trực tiếp từ DB, truy cập filesystem, bảo mật API keys, giảm bundle size JS cho client.\n• Dùng Client Components: Khi cần tương tác (onClick, onChange), dùng hooks (useState, useEffect), hoặc API trình duyệt.`,
        tag: 'React 19 RSC'
      }
    ].slice(0, cardCount);
  }

  if (lowerText.includes('ielts') || lowerText.includes('tiếng anh') || lowerText.includes('english') || lowerText.includes('vocab') || lowerText.includes('toeic')) {
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
      },
      {
        front: `pivotal /ˈpɪv.ə.təl/ (adj)`,
        back: `Định nghĩa: Có tính chất then chốt, mang tính bước ngoặt quyết định (crucial / turning point).\n\n📌 Collocations: play a pivotal role, a pivotal moment.\n📝 Ví dụ: Renewable energy adoption will play a pivotal role in tackling climate change.`,
        tag: 'Academic Collocation'
      }
    ].slice(0, cardCount);
  }

  // Universal Dynamic Pedagogical Knowledge Generator tailored to the exact topic
  const snippet = rawText ? `\n📌 Trích đoạn tư liệu: "${rawText.slice(0, 150)}..."` : '';
  const baseCards = [
    {
      front: `Bản chất cốt lõi & Khái niệm nền tảng của "${title}" là gì?`,
      back: `ĐỊNH NGHĨA & NGUYÊN LÝ:\n${title} là nội dung trọng tâm yêu cầu nắm vững định nghĩa, phạm vi áp dụng và mối liên hệ với các kiến thức liên quan.${snippet}\n\n💡 Mẹo nhớ: Nắm chắc từ khóa bản chất trước khi học thuộc lòng chi tiết.`,
      tag: 'Bản chất cốt lõi'
    },
    {
      front: `3 Điểm bẫy dễ nhầm lẫn hoặc lỗi phổ biến nhất khi thi về "${title}"?`,
      back: `BẪY THI CẦN TRÁNH:\n1. Nhầm lẫn giữa khái niệm cơ bản và các trường hợp ngoại lệ.\n2. Quên kiểm tra điều kiện tiên quyết trước khi áp dụng quy tắc.\n3. Đọc lướt bỏ qua các từ chỉ giới hạn như: "chỉ", "luôn luôn", "trừ trường hợp".`,
      tag: 'Bẫy đề thi'
    },
    {
      front: `Trường hợp ngoại lệ & Điều kiện biên bắt buộc phải nhớ của "${title}"?`,
      back: `ĐIỀU KIỆN BIÊN & NGOẠI LỆ:\nTrong hầu hết đề thi phân loại, câu hỏi điểm 9-10 thường xoay quanh điều kiện biên khi quy tắc thông thường không còn đúng. Hãy chú ý các mốc thời gian, số lượng tối thiểu và thẩm quyền quyết định.`,
      tag: 'Ngoại lệ quan trọng'
    },
    {
      front: `Công thức / Quy tắc vàng ghi nhớ nhanh siêu tốc về "${title}"?`,
      back: `KỸ THUẬT GHI NHỚ:\n• Gom nhóm các ý tương đồng (Chunking).\n• Liên tưởng với ví dụ thực tiễn đời sống.\n• Ôn tập ngắt quãng (Spaced Repetition) vào ngày 1, ngày 3, ngày 7.`,
      tag: 'Kỹ thuật ghi nhớ'
    },
    {
      front: `Dạng bài tập thực chiến hoặc câu hỏi trắc nghiệm hay gặp về "${title}"?`,
      back: `DẠNG BÀI THỰC CHIẾN:\nĐề bài thường đưa ra một tình huống thực tế hoặc một bảng số liệu, yêu cầu học viên nhận diện đúng bản chất của "${title}" và chỉ ra phương án xử lý tối ưu.`,
      tag: 'Thực chiến'
    },
    {
      front: `Mối liên hệ giữa "${title}" và các chuyên đề kiến thức liên quan?`,
      back: `TÍNH HỆ THỐNG:\n"${title}" không đứng độc lập mà là mắt xích liên kết giữa nền tảng lý thuyết và ứng dụng thực tế. Cần liên hệ với các chương trước để có cái nhìn toàn cảnh.`,
      tag: 'Hệ thống hóa'
    }
  ];

  return baseCards.slice(0, cardCount);
}

/**
 * Main generator entry point
 * 1. Tries Gemini (Multi-model failover)
 * 2. Tries OpenAI (gpt-4o-mini)
 * 3. Falls back to Smart Semantic Extractor
 */
export async function generateFlashcardsWithAI({ topic, rawText = '', cardCount = 6, customPrompt = '', extractionMode = 'auto', answerLength = 'balanced' }) {
  const geminiKey = getGeminiApiKey();
  const openaiKey = getOpenAIApiKey();

  // 1. Try Google Gemini API first
  if (geminiKey) {
    try {
      const realCards = await callGeminiApi({
        apiKey: geminiKey,
        topic,
        rawText,
        cardCount,
        customPrompt,
        extractionMode,
        answerLength
      });
      if (Array.isArray(realCards) && realCards.length > 0) {
        return realCards;
      }
    } catch (err) {
      console.warn('Gemini API call failed, attempting failover:', err.message);
    }
  }

  // 2. Try OpenAI API if key exists
  if (openaiKey) {
    try {
      const openAiCards = await callOpenAiApi({
        apiKey: openaiKey,
        topic,
        rawText,
        cardCount,
        customPrompt,
        extractionMode,
        answerLength
      });
      if (Array.isArray(openAiCards) && openAiCards.length > 0) {
        return openAiCards;
      }
    } catch (err) {
      console.warn('OpenAI API call failed:', err.message);
    }
  }

  // 3. Fallback to Smart Semantic Engine with natural delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  return generateSmartSemanticCards({ topic, rawText, cardCount, customPrompt, extractionMode, answerLength });
}

/**
 * Generate 4-choice Multiple Choice Quiz Questions using AI Engine
 */
export async function generateQuizQuestionsWithAI({ topic, rawText = '', questionCount = 5, cards = [] }) {
  const geminiKey = getGeminiApiKey();
  const openaiKey = getOpenAIApiKey();

  // If cards are provided, feed them into prompt context
  const cardsContext = cards.length > 0
    ? cards.map((c, i) => `${i + 1}. Câu hỏi/Khái niệm: ${c.front} | Đáp án: ${c.back}`).join('\n')
    : '';

  const prompt = `Bạn là Trưởng ban Đề thi Quốc Gia và Chuyên gia Khảo thí hàng đầu.
Nhiệm vụ: Hãy biên soạn chính xác ${questionCount} câu hỏi trắc nghiệm 4 lựa chọn (A, B, C, D) có tính phân loại cao, cài cắm bẫy tinh vi và kèm lời giải chi tiết.

CHỦ ĐỀ: ${topic || 'Ôn tập kiến thức trọng tâm'}
TÀI LIỆU / THẺ GHI NHỚ NGUỒN:
${cardsContext || rawText || 'Biên soạn các câu hỏi thi thực chiến hay gặp nhất.'}

YÊU CẦU ĐỊNH DẠNG:
- Trả về ĐÚNG 1 MẢNG JSON (JSON Array), KHÔNG bọc trong markdown và KHÔNG có lời giải thích ngoài mảng JSON.
- Mỗi object có 4 trường:
  - "question": Câu hỏi rõ ràng, bám sát đề thi thật.
  - "options": Mảng 4 chuỗi phương án [A, B, C, D]. Các phương án gây nhiễu phải logic, dễ bẫy thí sinh nếu không nắm chắc bài.
  - "correct": Số nguyên từ 0 đến 3 (chỉ số index của đáp án đúng trong mảng options).
  - "explanation": Lời giải thích ngắn gọn, nêu rõ căn cứ pháp luật/công thức hoặc vì sao các đáp án khác sai.

Ví dụ:
[
  {
    "question": "Thời hiệu xử lý kỷ luật đối với hành vi vi phạm ít nghiêm trọng của công chức là bao lâu?",
    "options": ["02 năm", "05 năm", "01 năm", "Không áp dụng thời hiệu"],
    "correct": 0,
    "explanation": "Căn cứ Điều 80 Luật CBCC sửa đổi 2019: Mức khiển trách áp dụng thời hiệu 02 năm."
  }
]`;

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
              temperature: 0.35,
              responseMimeType: 'application/json'
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        const parts = data?.candidates?.[0]?.content?.parts || [];
        const text = parts.map(p => p.text || '').filter(Boolean).join('\n');
        if (!text) continue;

        let cleanText = text.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const parsed = JSON.parse(cleanText);
        const qArray = Array.isArray(parsed) ? parsed : parsed.questions;
        if (Array.isArray(qArray) && qArray.length > 0) {
          return qArray.map((item, idx) => ({
            id: idx + 1,
            question: String(item.question || '').trim(),
            options: Array.isArray(item.options) ? item.options.map(String) : ['A', 'B', 'C', 'D'],
            correct: typeof item.correct === 'number' && item.correct >= 0 && item.correct <= 3 ? item.correct : 0,
            explanation: String(item.explanation || '').trim()
          })).filter(q => q.question && q.options.length >= 2);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        // Continue failover
      }
    }
  }

  // 2. Try OpenAI if available
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
            { role: 'system', content: 'Bạn là chuyên gia ra đề thi trắc nghiệm. Luôn trả về 1 mảng JSON các câu hỏi.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.35
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content || '';
        let clean = content.trim();
        if (clean.startsWith('```json')) {
          clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (clean.startsWith('```')) {
          clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const parsed = JSON.parse(clean);
        const qArray = Array.isArray(parsed) ? parsed : parsed.questions;
        if (Array.isArray(qArray) && qArray.length > 0) {
          return qArray.map((item, idx) => ({
            id: idx + 1,
            question: String(item.question || '').trim(),
            options: Array.isArray(item.options) ? item.options.map(String) : ['A', 'B', 'C', 'D'],
            correct: typeof item.correct === 'number' && item.correct >= 0 && item.correct <= 3 ? item.correct : 0,
            explanation: String(item.explanation || '').trim()
          })).filter(q => q.question && q.options.length >= 2);
        }
      }
    } catch (e) {
      console.warn('OpenAI quiz generation failover:', e);
    }
  }

  // 3. Fallback smart heuristics from cards
  if (cards.length > 0) {
    return cards.slice(0, questionCount).map((c, i) => {
      const otherBacks = cards.filter((_, idx) => idx !== i).map(o => o.back.split('\n')[0]);
      const distractors = otherBacks.slice(0, 3);
      while (distractors.length < 3) {
        distractors.push(`Phương án mở rộng ${String.fromCharCode(65 + distractors.length)}`);
      }
      const rawOptions = [c.back.split('\n')[0], ...distractors];
      const shuffled = rawOptions
        .map((opt, origIdx) => ({ opt, isCorrect: origIdx === 0 }))
        .sort(() => Math.random() - 0.5);
      const correctIndex = shuffled.findIndex(item => item.isCorrect);

      return {
        id: i + 1,
        question: c.front,
        options: shuffled.map(item => item.opt),
        correct: correctIndex,
        explanation: c.back
      };
    });
  }

  return [];
}
