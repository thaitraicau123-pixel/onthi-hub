/**
 * api/ai.js
 * Node.js endpoint — "AI Prompt Studio" (ported from api/ai.py).
 *
 * Hỗ trợ Gemini (@google/genai), OpenAI và Anthropic thông qua biến môi trường:
 *   GEMINI_API_KEY / OPENAI_API_KEY / ANTHROPIC_API_KEY
 *   GATEWAY_MODEL        — tuỳ chọn (gpt-4o-mini, gemini-2.5-flash, claude-3-5-haiku-latest...)
 *   FIREBASE_WEB_API_KEY — tuỳ chọn, nếu thiếu sẽ dùng verifyFirebaseIdToken cục bộ
 */

import { GoogleGenAI } from '@google/genai';
import { verifyFirebaseIdToken } from '../lib/firebase-token.js';

const MAX_PROMPT_CHARS = 12000;
const MAX_CONTEXT_CHARS = 1000;
const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const DEFAULT_PROJECT = 'promtmmo';

const SYSTEM_INSTRUCTION =
  'Bạn là biên tập viên prompt của PromptMMO Studio (Bùi Thái AI Studio). ' +
  'Người mua đã trả Xu để lấy một Master Prompt; nhiệm vụ của bạn là viết lại prompt đó ' +
  'cho khớp đúng dự án của họ.\n' +
  '- Giữ nguyên cấu trúc, thứ tự phần và MỌI ràng buộc của prompt gốc.\n' +
  '- Chỉ thay thế / bổ sung phần bối cảnh, đối tượng, kênh, phong cách, ví dụ cho khớp mô tả của người dùng.\n' +
  '- Không bịa số liệu, không thêm liên kết, không hứa hẹn kết quả, không rút gọn thành dàn ý.\n' +
  '- Viết bằng cùng ngôn ngữ với prompt gốc.\n' +
  '- Trả về DUY NHẤT nội dung prompt đã hoàn thiện, không lời dẫn, không bọc trong ```.';

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');
}

function extractBearerToken(req) {
  const headers = (req && req.headers) || {};
  const raw = String(headers.authorization || headers.Authorization || '').trim();
  if (raw.toLowerCase().startsWith('bearer ')) {
    return raw.slice(7).trim();
  }
  return '';
}

async function lookupFirebaseUser(idToken) {
  if (!idToken) return null;

  const apiKey = String(process.env.FIREBASE_WEB_API_KEY || '').trim();
  if (apiKey) {
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
        signal: AbortSignal.timeout(8000)
      });
      if (res.ok) {
        const data = await res.json();
        const users = data && Array.isArray(data.users) ? data.users : null;
        if (users && users[0]) {
          return {
            uid: String(users[0].localId || ''),
            email: String(users[0].email || '')
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  // Fallback: xác thực ID token bằng public certs RS256 của Firebase
  return verifyFirebaseIdToken(idToken).catch(() => null);
}

function resolveModelAndProvider() {
  const configuredModel = String(process.env.GATEWAY_MODEL || '').trim();
  const geminiKey = String(process.env.GEMINI_API_KEY || '').trim();
  const openaiKey = String(process.env.OPENAI_API_KEY || '').trim();
  const anthropicKey = String(process.env.ANTHROPIC_API_KEY || '').trim();

  if (configuredModel) {
    const lower = configuredModel.toLowerCase();
    if (lower.startsWith('gemini') || lower.includes('gemini')) {
      return { provider: 'gemini', model: configuredModel, apiKey: geminiKey };
    }
    if (lower.startsWith('claude')) {
      return { provider: 'anthropic', model: configuredModel, apiKey: anthropicKey };
    }
    return { provider: 'openai', model: configuredModel, apiKey: openaiKey };
  }

  if (openaiKey) {
    return { provider: 'openai', model: DEFAULT_MODEL, apiKey: openaiKey };
  }
  if (geminiKey) {
    return { provider: 'gemini', model: DEFAULT_GEMINI_MODEL, apiKey: geminiKey };
  }
  if (anthropicKey) {
    return { provider: 'anthropic', model: 'claude-3-5-haiku-latest', apiKey: anthropicKey };
  }
  return { provider: '', model: DEFAULT_MODEL, apiKey: '' };
}

function buildUserContent(prompt, context, productName) {
  const lines = [
    'Prompt gốc cần viết lại:',
    '<<<PROMPT',
    prompt,
    'PROMPT'
  ];
  if (productName) {
    lines.push('', `Sản phẩm người mua đang dùng: ${productName}`);
  }
  lines.push(
    '',
    'Dự án của người dùng:',
    context.trim() || 'Không nêu cụ thể — hãy viết lại cho rõ ràng, dễ tái sử dụng nhưng vẫn giữ nguyên khung.'
  );
  return lines.join('\n');
}

function cleanCompletionText(rawText) {
  let text = String(rawText || '').trim();
  if (!text) return '';
  if (text.startsWith('```') && text.endsWith('```')) {
    text = text.replace(/^`+|`+$/g, '').trim();
    const newlineIdx = text.indexOf('\n');
    if (newlineIdx !== -1) {
      text = text.slice(newlineIdx + 1).trim();
    }
  }
  return text;
}

async function enhancePrompt(prompt, context, productName) {
  const { provider, model, apiKey } = resolveModelAndProvider();
  if (!provider || !apiKey) {
    const err = new Error('gateway_missing');
    err.code = 'gateway_missing';
    throw err;
  }

  const userContent = buildUserContent(prompt, context, productName);

  if (provider === 'gemini') {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: userContent,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4
      }
    });
    const text = cleanCompletionText(response && response.text);
    if (!text) throw new Error('gateway_empty_completion');
    return { text, model };
  }

  if (provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        temperature: 0.4,
        system: SYSTEM_INSTRUCTION,
        messages: [{ role: 'user', content: userContent }]
      }),
      signal: AbortSignal.timeout(45000)
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(`anthropic_${res.status}`);
    }
    const contentBlock = Array.isArray(json.content) ? json.content.find((c) => c && c.type === 'text') : null;
    const text = cleanCompletionText(contentBlock && contentBlock.text);
    if (!text) throw new Error('gateway_empty_completion');
    return { text, model };
  }

  const baseUrl = String(process.env.RESPAN_OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        { role: 'user', content: userContent }
      ]
    }),
    signal: AbortSignal.timeout(45000)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`openai_${res.status}`);
  }
  const choice = Array.isArray(json.choices) && json.choices[0] ? json.choices[0] : null;
  const text = cleanCompletionText(choice && choice.message && choice.message.content);
  if (!text) throw new Error('gateway_empty_completion');
  return { text, model };
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, code: 'method_not_allowed', message: 'Method Not Allowed' });
  }

  const user = await lookupFirebaseUser(extractBearerToken(req));
  if (!user) {
    return res.status(401).json({
      ok: false,
      code: 'unauthorized',
      message: 'Vui lòng đăng nhập lại để dùng trợ lý AI.'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, code: 'bad_json', message: 'Dữ liệu gửi lên không phải JSON.' });
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, code: 'bad_body', message: 'Dữ liệu gửi lên không hợp lệ.' });
  }

  const prompt = String(body.prompt || '').trim();
  const context = String(body.context || '').trim();
  const productName = String(body.productName || '').trim().slice(0, 200);

  if (!prompt) {
    return res.status(400).json({ ok: false, code: 'missing_prompt', message: 'Thiếu nội dung prompt cần tối ưu.' });
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return res.status(400).json({
      ok: false,
      code: 'prompt_too_long',
      message: `Prompt dài quá ${MAX_PROMPT_CHARS} ký tự.`
    });
  }
  if (context.length > MAX_CONTEXT_CHARS) {
    return res.status(400).json({
      ok: false,
      code: 'context_too_long',
      message: `Mô tả dự án dài quá ${MAX_CONTEXT_CHARS} ký tự.`
    });
  }

  try {
    const { text, model } = await enhancePrompt(prompt, context, productName);
    return res.status(200).json({
      ok: true,
      prompt: text,
      model,
      project: process.env.FIREBASE_PROJECT_ID || DEFAULT_PROJECT
    });
  } catch (err) {
    if (err && err.code === 'gateway_missing') {
      return res.status(503).json({
        ok: false,
        code: 'gateway_missing',
        message: 'Máy chủ chưa cấu hình API key AI (GEMINI_API_KEY / OPENAI_API_KEY).'
      });
    }
    console.warn('[api/ai] gateway error:', err && err.message);
    return res.status(502).json({
      ok: false,
      code: 'gateway_failed',
      message: 'Trợ lý AI đang bận hoặc chưa cấu hình key nhà cung cấp. Vui lòng thử lại sau ít phút.'
    });
  }
}
