// Mistake Notebook & Weakness Bank Tracker for OnThiHub
// Automatically captures failed quiz questions and forgotten flashcards
// Powered by Google Gemini Multi-Model AI for Cognitive Gap Diagnosis

import { getGeminiApiKey, GEMINI_MODELS } from './aiApiKey';

const MISTAKES_STORAGE_KEY = 'onthi_mistakes_v1';

/**
 * Get all tracked mistakes
 */
export function getMistakes() {
  try {
    const raw = localStorage.getItem(MISTAKES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to get mistakes', e);
    return [];
  }
}

/**
 * Count active (unmastered) mistakes
 */
export function getUnmasteredMistakesCount() {
  const all = getMistakes();
  return all.filter(m => !m.mastered).length;
}

/**
 * Record a mistake (quiz wrong answer or flashcard 'again')
 */
export function recordMistake({
  type = 'quiz', // 'quiz' | 'flashcard'
  deckId,
  deckTitle,
  question,
  answer,
  userChoice,
  options = [],
  correctIndex,
  explanation = '',
  tag = ''
}) {
  if (!question || !answer) return;

  try {
    const all = getMistakes();
    // Check if same question already exists in mistakes
    const existingIdx = all.findIndex(
      m => m.question.trim().toLowerCase() === question.trim().toLowerCase()
    );

    const now = Date.now();

    if (existingIdx >= 0) {
      // Re-opened / failed again: mark unmastered and increment fail count
      all[existingIdx] = {
        ...all[existingIdx],
        mastered: false,
        failCount: (all[existingIdx].failCount || 1) + 1,
        lastFailedAt: now,
        userChoice: userChoice || all[existingIdx].userChoice,
        deckTitle: deckTitle || all[existingIdx].deckTitle
      };
    } else {
      // Create new mistake entry
      all.unshift({
        id: `mistake_${now}_${Math.random().toString(36).slice(2, 6)}`,
        type,
        deckId: deckId || 'general',
        deckTitle: deckTitle || 'Bộ đề ôn tập',
        question: question.trim(),
        answer: answer.trim(),
        userChoice: userChoice ? userChoice.trim() : '',
        options: options || [],
        correctIndex,
        explanation: explanation.trim(),
        tag: tag.trim() || 'Trọng tâm',
        failCount: 1,
        addedAt: now,
        lastFailedAt: now,
        mastered: false
      });
    }

    // Keep at most 200 recent mistakes to prevent storage overflow
    const trimmed = all.slice(0, 200);
    localStorage.setItem(MISTAKES_STORAGE_KEY, JSON.stringify(trimmed));
    return true;
  } catch (e) {
    console.error('Failed to record mistake', e);
    return false;
  }
}

/**
 * Mark a mistake as Mastered (User got it right on re-practice)
 */
export function markMistakeMastered(mistakeId) {
  try {
    const all = getMistakes();
    const updated = all.map(m => (m.id === mistakeId ? { ...m, mastered: true, masteredAt: Date.now() } : m));
    localStorage.setItem(MISTAKES_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Delete a mistake from the notebook
 */
export function removeMistake(mistakeId) {
  try {
    const all = getMistakes();
    const updated = all.filter(m => m.id !== mistakeId);
    localStorage.setItem(MISTAKES_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Clear all mastered mistakes
 */
export function clearMasteredMistakes() {
  try {
    const all = getMistakes();
    const updated = all.filter(m => !m.mastered);
    localStorage.setItem(MISTAKES_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Build a virtual retry deck from unmastered mistakes
 */
export function buildMistakesRetryDeck() {
  const mistakes = getMistakes().filter(m => !m.mastered);
  if (mistakes.length === 0) return null;

  const previewCards = mistakes.map((m, idx) => ({
    id: idx + 1,
    front: m.question,
    back: `${m.answer}${m.explanation ? `\n\n💡 Căn cứ: ${m.explanation}` : ''}`,
    tag: m.tag || 'Lỗi sai cần khắc phục',
    mistakeId: m.id
  }));

  const previewQuiz = mistakes
    .filter(m => m.options && m.options.length > 0)
    .map((m, idx) => ({
      id: idx + 1,
      question: m.question,
      options: m.options,
      correct: m.correctIndex !== undefined ? m.correctIndex : 0,
      explanation: m.explanation || `Đáp án đúng là: ${m.answer}`,
      mistakeId: m.id
    }));

  return {
    id: 'deck_mistakes_retry_' + Date.now(),
    title: `Sổ Tay Khắc Phục Lỗi Sai (${mistakes.length} Câu)`,
    subtitle: 'Luyện tập tập trung các câu trắc nghiệm và kiến thức bạn từng bị làm sai',
    category: 'cong-chuc',
    categoryLabel: 'Luyện Câu Sai',
    badge: 'Chữa Điểm Yếu',
    price: 0,
    rating: 5.0,
    previewCards,
    previewQuiz: previewQuiz.length > 0 ? previewQuiz : previewCards.map((c, i) => ({
      id: i + 1,
      question: c.front,
      options: [c.back.split('\n')[0], 'Phương án nhiễu A', 'Phương án nhiễu B', 'Phương án nhiễu C'],
      correct: 0,
      explanation: c.back
    }))
  };
}

/**
 * AI Cognitive Gap Diagnosis:
 * Gemini analyzes patterns in mistakes to diagnose underlying knowledge holes
 */
export async function diagnoseWeaknessesWithAi(unmasteredMistakes = []) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return {
      success: false,
      message: 'Vui lòng cấu hình AI Key để nhận chẩn đoán lỗ hổng kiến thức từ AI!'
    };
  }

  if (unmasteredMistakes.length === 0) {
    return {
      success: false,
      message: 'Bạn chưa có câu hỏi sai nào trong sổ tay để phân tích!'
    };
  }

  // Sample top 8 mistakes for the prompt
  const sampleMistakes = unmasteredMistakes.slice(0, 8).map((m, i) => {
    return `${i + 1}. [Chủ đề: ${m.deckTitle} | Tag: ${m.tag}]\n- Câu hỏi: "${m.question}"\n- Đáp án đúng: "${m.answer}"\n- Lựa chọn sai của thí sinh: "${m.userChoice || 'Bị quên/chọn nhầm'}"`;
  }).join('\n\n');

  const prompt = `Bạn là Trưởng ban Khảo thí & Chuyên gia Phân tích Tư duy Học tập của ÔnThiHub.
Dưới đây là danh sách các câu hỏi mà một thí sinh vừa làm sai hoặc hay quên trong quá trình luyện đề:

${sampleMistakes}

HÃY ĐƯA RA "BÁO CÁO BẮT BỆNH LỖ HỔNG KIẾN THỨC & PHÁC ĐỒ CẤP TỐC" (viết bằng Markdown, ngắn gọn, súc tích, trực diện):
### 🩺 1. Chẩn Đoán Lỗ Hổng Tư Duy Cốt Lõi (Root Cognitive Gap)
(Chỉ rõ lỗ hổng kiến thức gốc rễ là gì? Do nhầm lẫn mốc thời gian, không phân biệt được thẩm quyền cơ quan, bị bẫy từ ngữ phủ định/khẳng định, hay suy luận cảm tính?)

### 🚨 2. Các Bẫy Đề Thi Cần Tuyệt Đối Cảnh Giác
(Cảnh báo 2-3 kiểu bẫy trắc nghiệm tương tự mà giám khảo các kỳ thi rất hay gài bẫy thí sinh ở các dạng câu hỏi này)

### 💊 3. Phác Đồ Ôn Tập Trong 24 Giờ Tới
(Đưa ra 3 hành động cụ thể, quy tắc nhớ vắt tắt giúp thí sinh không bao giờ lặp lại các lỗi sai trên)`;

  let lastError = '';

  for (const model of GEMINI_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.35 }
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
    message: `Không thể kết nối Trợ lý AI: ${lastError || 'Lỗi mạng'}`
  };
}
