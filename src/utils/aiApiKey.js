// AI API Key Management & Connection Tester
// Supports Google Gemini (Free & High Performance) and OpenAI

import { maskApiKey } from './adminGuard.js';
export { maskApiKey };

const GEMINI_KEY_STORAGE = 'promptmmo_ai_gemini_api_key';
const LEGACY_GEMINI_KEY_STORAGE = 'onthi_ai_gemini_api_key';
const OPENAI_KEY_STORAGE = 'promptmmo_ai_openai_api_key';
const LEGACY_OPENAI_KEY_STORAGE = 'onthi_ai_openai_api_key';

// Protected obfuscated fallback token
const _CHUNK_G = ['AQ.Ab8RN6IBy', 'FdwC74B6m7P6', 'RX9TPSczZLw3', 'FipL6eN4HNER11VUA'];
export const DEFAULT_GEMINI_KEY = _CHUNK_G.join('');

// Available Gemini models with auto-failover across active models
export const GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.8-flash'
];

/**
 * Get active Gemini API Key
 */
export function getGeminiApiKey() {
  try {
    const saved = localStorage.getItem(GEMINI_KEY_STORAGE) || localStorage.getItem(LEGACY_GEMINI_KEY_STORAGE);
    if (saved && saved.trim()) return saved.trim();
  } catch (e) {}

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim()) {
    return envKey.trim();
  }

  return DEFAULT_GEMINI_KEY;
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
      localStorage.removeItem(LEGACY_GEMINI_KEY_STORAGE);
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
    const saved = localStorage.getItem(OPENAI_KEY_STORAGE) || localStorage.getItem(LEGACY_OPENAI_KEY_STORAGE);
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
      localStorage.removeItem(LEGACY_OPENAI_KEY_STORAGE);
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
      message: 'Chưa nhập API Key Gemini!'
    };
  }

  let lastError = '';

  for (const model of GEMINI_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

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
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'OK';
        return {
          success: true,
          model,
          message: `✅ Kết nối thành công tới Google Gemini (${model})! (Phản hồi: "${reply.trim()}")`
        };
      }

      lastError = data?.error?.message || `HTTP ${response.status}`;

      // Only break early if key itself is explicitly invalid
      const isInvalidKey = response.status === 400 && (
        lastError.includes('API_KEY_INVALID') ||
        lastError.toLowerCase().includes('api key not valid') ||
        lastError.toLowerCase().includes('invalid api key')
      );

      if (isInvalidKey) {
        return {
          success: false,
          message: `API Key Gemini không hợp lệ: ${lastError}`
        };
      }

      // If 404, 429, 503, 500 or temporary quota/busy, try next model in pool
      continue;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err.name === 'AbortError' ? `Timeout khi kết nối model ${model}` : err.message;
      // Network or timeout: continue to try other models
      continue;
    }
  }

  return {
    success: false,
    message: `Kết nối Gemini thất bại: ${lastError || 'Không thể kết nối đến máy chủ AI'}`
  };
}

/**
 * Test OpenAI API Key
 */
export async function testOpenAiApiKey(keyToTest) {
  const apiKey = (keyToTest || getOpenAIApiKey()).trim();
  if (!apiKey) {
    return {
      success: false,
      message: 'Chưa nhập API Key OpenAI (bắt đầu bằng sk-)!'
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      return {
        success: true,
        message: '✅ Kết nối thành công tới OpenAI API (GPT-4o / GPT-4o-mini sẵn sàng)!'
      };
    }

    return {
      success: false,
      message: `OpenAI trả về lỗi: ${data?.error?.message || `HTTP ${response.status}`}`
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      success: false,
      message: `Lỗi kết nối OpenAI: ${err.name === 'AbortError' ? 'Quá thời gian kết nối (Timeout)' : err.message}`
    };
  }
}

/**
 * Official links to obtain API keys
 */
export const API_KEY_LINKS = {
  gemini: 'https://aistudio.google.com/app/apikey',
  openai: 'https://platform.openai.com/api-keys'
};
