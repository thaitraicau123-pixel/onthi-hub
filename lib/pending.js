/**
 * Hàng đợi khoản nạp CHƯA cộng được Xu — lưu NGOÀI Google.
 *
 * Mục đích: khi Firestore hết hạn mức / lỗi mạng, tiền đã vào tài khoản mà không
 * ghi được ví. Thay vì để mất, khoản đó được đẩy vào Redis (Upstash) và cộng lại
 * sau bằng nút "Khoản chờ cộng" trong Admin.
 *
 * Chỉ dùng fetch, KHÔNG cần SDK, KHÔNG thêm dependency.
 * Biến môi trường: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */

const INDEX_KEY = 'sepay:pending:index';
const MAX_ITEMS = 200;

function itemKey(id) {
  return `sepay:pending:item:${id}`;
}

export function isQueueConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redis(command) {
  const url = String(process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/+$/, '');
  const token = String(process.env.UPSTASH_REDIS_REST_TOKEN || '');
  if (!url || !token) throw new Error('queue_not_configured');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(5000)
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`queue_http_${res.status}`);
  if (json && json.error) throw new Error(`queue_${json.error}`);
  return json ? json.result : null;
}

/** Lưu một khoản nạp chưa cộng được. Bỏ qua nếu đã có (cùng mã giao dịch). */
export async function queuePendingCredit(entry) {
  if (!isQueueConfigured()) return { queued: false, reason: 'queue_not_configured' };
  const id = String((entry && entry.transactionId) || '').trim();
  if (!id) return { queued: false, reason: 'missing_transaction_id' };

  const payload = JSON.stringify({
    transactionId: id,
    userEmail: String(entry.userEmail || '').trim().toLowerCase(),
    userName: String(entry.userName || ''),
    amount: Math.round(Number(entry.amount) || 0),
    memo: String(entry.memo || ''),
    content: String(entry.content || '').slice(0, 300),
    bank: String(entry.bank || ''),
    referenceCode: String(entry.referenceCode || ''),
    error: String(entry.error || '').slice(0, 120),
    queuedAt: new Date().toISOString()
  });

  const setResult = await redis(['SET', itemKey(id), payload, 'NX']);
  if (setResult !== 'OK') return { queued: false, reason: 'already_queued' };

  await redis(['LPUSH', INDEX_KEY, id]);
  await redis(['LTRIM', INDEX_KEY, 0, MAX_ITEMS - 1]);
  return { queued: true };
}

/** Danh sách khoản đang chờ cộng (mới nhất trước). */
export async function listPendingCredits(limit = 50) {
  if (!isQueueConfigured()) return [];
  const max = Math.max(1, Math.min(Number(limit) || 50, MAX_ITEMS));
  const ids = await redis(['LRANGE', INDEX_KEY, 0, max - 1]);
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const values = await redis(['MGET'].concat(ids.map(itemKey)));
  const out = [];
  (Array.isArray(values) ? values : []).forEach((raw, index) => {
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.transactionId) out.push(parsed);
      else if (ids[index]) out.push({ transactionId: ids[index] });
    } catch (_) {
      if (ids[index]) out.push({ transactionId: ids[index] });
    }
  });
  return out;
}

/** Xoá khỏi hàng đợi sau khi đã cộng thành công. */
export async function dropPendingCredit(transactionId) {
  if (!isQueueConfigured()) return false;
  const id = String(transactionId || '').trim();
  if (!id) return false;
  await redis(['DEL', itemKey(id)]);
  await redis(['LREM', INDEX_KEY, 0, id]);
  return true;
}
