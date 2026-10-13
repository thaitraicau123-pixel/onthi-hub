// AI API Key Management & Connection Tester
// Supports Google Gemini (Free & High Performance) and OpenAI

const GEMINI_KEY_STORAGE = 'onthi_ai_gemini_api_key';
const OPENAI_KEY_STORAGE = 'onthi_ai_openai_api_key';

// Available Gemini models with auto-failover in case of 503 (High demand)
export const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b'
];

/**
 * Get active Gemini API Key
 */
export function getGeminiApiKey() {
  try {
    const saved = localStorage.getItem(GEMINI_KEY_STORAGE);
    if (saved && saved.trim()) return saved.trim();
  } catch (e) {}

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim()) {
    return envKey.trim();
  }

  return '';
}

/**
 * Save Gemini API Key
 */
export function saveGeminiApiKey(key) {
  try {
    if (key && key.trim()) {
      localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(GEMINI_KEY_STORAGE);
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get active OpenAI API Key
 */
export function getOpenAIApiKey() {
  try {
    const saved = localStorage.getItem(OPENAI_KEY_STORAGE);
    if (saved && saved.trim()) return saved.trim();
  } catch (e) {}

  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim()) {
    return envKey.trim();
  }

  return '';
}

/**
 * Save OpenAI API Key
 */
export function saveOpenAIApiKey(key) {
  try {
    if (key && key.trim()) {
      localStorage.setItem(OPENAI_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(OPENAI_KEY_STORAGE);
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if system has any valid AI key configured
 */
export function hasValidAiKey() {
  const gemini = getGeminiApiKey();
  const openai = getOpenAIApiKey();
  return Boolean((gemini && gemini.length > 15) || (openai && openai.startsWith('sk-')));
}

/**
 * Test Google Gemini API Key with auto-failover across models
 */
export async function testGeminiApiKey(keyToTest) {
  const apiKey = (keyToTest || getGeminiApiKey()).trim();
  if (!apiKey) {
    return {
      success: false,
      message: 'Chưa nhập API Key!'
    };
  }

  let lastError = '';

  for (const model of GEMINI_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Ping test: hãy phản hồi đúng 1 từ 'PONG' để xác thực kết nối." }
              ]
            }
          ]
        })
      });

      const data = await response.json();

      if (response.ok) {
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'OK';
        return {
          success: true,
          model,
          message: `✅ Kết nối thành công tới Google AI (${model})! (Phản hồi: "${reply.trim()}")`
        };
      }

      // If 503 or model busy, record and try next model
      lastError = data?.error?.message || `HTTP ${response.status}`;
      if (response.status === 503 || response.status === 429) {
        continue;
      } else {
        // Bad key or permission error, no need to try other models
        break;
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  return {
    success: false,
    message: `Kết nối thất bại: ${lastError || 'Không thể kết nối đến máy chủ Google'}`
  };
}

/**
 * Official links to obtain API keys
 */
export const API_KEY_LINKS = {
  gemini: 'https://aistudio.google.com/app/apikey',
  openai: 'https://platform.openai.com/api-keys'
};
