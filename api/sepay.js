/**
 * api/sepay.js
 * Webhook SePay → cộng Xu TRỰC TIẾP vào ví trên Firestore (quyền server).
 *
 * Luồng:
 * 1. Xác thực API Key của SePay (constant-time, không có đường vòng).
 * 2. Đọc mã nạp NAPXU... trong nội dung chuyển khoản.
 * 3. Tra topup_intents/{memo} để biết CHÍNH XÁC email khách đã tạo mã.
 * 4. Cộng Xu nguyên tử + idempotent theo mã giao dịch SePay.
 *
 * Không còn lưu ví trong RAM serverless hay localStorage trình duyệt.
 */

import { getWebhookSecret, verifyWebhookAuth, extractMemoFromPayment } from '../lib/sepay.js';
import { creditWallet, getTopupIntent, recordUnmatchedTopup, isConfigured, FirestoreError, getDocument } from '../lib/firestore.js';
import { queuePendingCredit } from '../lib/pending.js';

const NOTIFY_TOPIC = 'buithai_studio_0986019623';
const MAX_AMOUNT = 100_000_000;

function parseBody(req) {
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  return body && typeof body === 'object' ? body : {};
}

function toAmount(value) {
  const digits = String(value === undefined || value === null ? '' : value).replace(/[^0-9]/g, '');
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function notify({ title, message, priority = 4, tags = ['moneybag'] }) {
  if (process.env.DISABLE_NOTIFY === '1') return;
  try {
    await fetch('https://ntfy.sh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: NOTIFY_TOPIC, title, message, priority, tags }),
      signal: AbortSignal.timeout(2500)
    });
  } catch {
    /* thông báo là phụ, không được làm hỏng việc cộng Xu */
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') return res.status(204).end();

  // ---------------------------------------------------------------- health
  if (req.method === 'GET') {
    // ?probe=1 : tự kiểm tra quyền đọc Firestore bằng Service Account (chẩn đoán, không ghi gì).
    // Bất kỳ giá trị probe nào (1, 2, true...) đều chạy kiểm tra thật.
    // Trước đây chỉ đúng "1" mới kiểm tra, các giá trị khác rơi xuống nhánh health
    // nên luôn trả ok:true dù Firestore đang chết — dễ gây hiểu nhầm.
    const probeRaw = req.query ? req.query.probe : undefined;
    const probeOn = probeRaw !== undefined && probeRaw !== null
      && String(probeRaw).trim() !== ''
      && !/^(0|false|no|off)$/i.test(String(probeRaw).trim());
    if (probeOn) {
      if (!isConfigured()) {
        return res.status(200).json({ ok: false, probe: 'firestore', code: 'missing_service_account' });
      }
      try {
        await getDocument('topup_intents/_healthcheck');
        return res.status(200).json({ ok: true, probe: 'firestore', reachable: true });
      } catch (err) {
        return res.status(200).json({
          ok: false,
          probe: 'firestore',
          code: String((err && (err.code || err.message)) || 'unknown').slice(0, 90),
          httpStatus: (err && err.status) || 0,
          detail: String((err && err.detail) || '').slice(0, 220)
        });
      }
    }
    return res.status(200).json({
      ok: true,
      service: 'SePay → Firestore wallet crediting',
      version: '2.0.0',
      bank: 'MBBank',
      accountNumber: '0986019623',
      accountName: 'BUI THAI',
      memoFormat: 'NAPXU + 8 ký tự',
      webhookSecretConfigured: Boolean(getWebhookSecret()),
      walletWritesConfigured: isConfigured(),
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // -------------------------------------------------------- xác thực webhook
  const auth = verifyWebhookAuth(req);
  if (!auth.ok) {
    const message = auth.reason === 'missing_webhook_secret'
      ? 'Server chưa cấu hình SEPAY_WEBHOOK_SECRET nên từ chối mọi webhook.'
      : 'Unauthorized: thiếu hoặc sai API Key của SePay.';
    console.warn('[SePay] Từ chối webhook:', auth.reason);
    return res.status(auth.status).json({ success: false, message });
  }

  const body = parseBody(req);

  const transferType = String(body.transferType || '').toLowerCase();
  if (transferType && transferType !== 'in') {
    return res.status(200).json({ success: true, ignored: true, message: 'Bỏ qua giao dịch tiền ra' });
  }

  const amount = toAmount(body.transferAmount !== undefined ? body.transferAmount : body.amount);
  if (!(amount > 0) || amount > MAX_AMOUNT) {
    return res.status(400).json({ success: false, message: 'Số tiền giao dịch không hợp lệ' });
  }

  const transactionId = String(body.id || body.referenceCode || '').trim();
  if (!transactionId) {
    return res.status(400).json({ success: false, message: 'Thiếu mã giao dịch (id/referenceCode) để chống cộng trùng' });
  }

  if (!isConfigured()) {
    console.error('[SePay] Thiếu FIREBASE_SERVICE_ACCOUNT — không thể ghi ví.');
    return res.status(503).json({
      success: false,
      message: 'Server chưa cấu hình quyền ghi Firestore (FIREBASE_SERVICE_ACCOUNT).'
    });
  }

  const memo = extractMemoFromPayment(body);
  const content = String(body.content || body.description || body.code || '').trim();
  const intent = memo ? await getTopupIntent(memo).catch(() => null) : null;

  // --------------------------------------------- không khớp mã → ghi nhận tay
  if (!intent || !intent.userEmail) {
    await recordUnmatchedTopup({
      transactionId,
      amount,
      memo,
      content,
      gateway: body.gateway
    }).catch(() => null);

    await notify({
      title: `⚠️ TIỀN VÀO KHÔNG KHỚP MÃ: +${amount.toLocaleString('vi-VN')}đ`,
      message: `Mã GD: ${transactionId}\nNội dung: ${content || '(trống)'}\nSố tiền: ${amount.toLocaleString('vi-VN')} VNĐ\nMã đọc được: ${memo || '(không có)'}\n→ Cần xử lý tay trong Admin.`,
      priority: 5,
      tags: ['warning', 'moneybag']
    });

    return res.status(200).json({
      success: true,
      matched: false,
      message: 'Không tìm thấy mã nạp tương ứng — đã ghi nhận để admin xử lý.'
    });
  }

  // -------------------------------------------------------------- cộng ví
  try {
    const result = await creditWallet({
      transactionId,
      userEmail: intent.userEmail,
      userName: intent.userName,
      amount,
      memo: intent.memo || memo,
      bankInfo: {
        bank: body.gateway || 'MBBank',
        accountNumber: body.accountNumber || '',
        content,
        referenceCode: body.referenceCode || ''
      }
    });

    if (!result.duplicate) {
      await notify({
        title: `⚡ [SEPAY DUYỆT NẠP] +${amount.toLocaleString('vi-VN')} XU VÀO VÍ!`,
        message: `Mã lệnh: TOPUP-SEPAY-${transactionId}\nMã GD: ${transactionId}\nKhách: ${intent.userEmail}\nSố tiền: ${amount.toLocaleString('vi-VN')} VNĐ\nMã nạp: ${intent.memo || memo}\nSố dư mới: ${Number(result.newBalance || 0).toLocaleString('vi-VN')} Xu\nTrạng thái: Đã duyệt tự động 24/7`,
        priority: 5,
        tags: ['zap', 'moneybag', 'white_check_mark']
      });
    }

    return res.status(200).json({
      success: true,
      matched: true,
      duplicate: Boolean(result.duplicate),
      credited: result.duplicate ? 0 : amount,
      topupId: transactionId,
      memo: intent.memo || memo,
      newBalance: result.newBalance === null ? null : result.newBalance
    });
  } catch (err) {
    console.error('[SePay] Lỗi cộng ví:', err && err.message);
    const reason = String((err && (err.code || err.message)) || 'server_error').slice(0, 120);

    // Tiền ĐÃ vào tài khoản nhưng chưa ghi được ví → lưu vào hàng đợi ngoài Google
    // để không mất, sau đó admin cộng lại bằng một nút.
    let queued = false;
    try {
      const q = await queuePendingCredit({
        transactionId,
        userEmail: intent.userEmail,
        userName: intent.userName,
        amount,
        memo: intent.memo || memo,
        content,
        bank: body.gateway || 'MBBank',
        referenceCode: body.referenceCode || '',
        error: reason
      });
      queued = Boolean(q && q.queued);
    } catch (eQueue) {
      console.warn('[SePay] Không lưu được hàng đợi:', eQueue && eQueue.message);
    }

    if (queued) {
      await notify({
        title: `⏳ [SEPAY] TIỀN ĐÃ VÀO NHƯNG CHƯA CỘNG ĐƯỢC XU`,
        message: `Khách: ${intent.userEmail}\nSố tiền: ${amount.toLocaleString('vi-VN')} VNĐ\nMã nạp: ${intent.memo || memo}\nMã GD: ${transactionId}\nLý do: ${reason}\n→ Đã lưu vào hàng đợi. Vào Admin bấm "Khoản chờ cộng" để cộng lại.`,
        priority: 5,
        tags: ['warning', 'moneybag']
      });
      // Trả 200 vì đã nhận và giữ được khoản tiền: SePay không cần gửi lại.
      return res.status(200).json({
        success: true,
        matched: true,
        queued: true,
        credited: 0,
        message: 'Tiền đã vào, chưa cộng được Xu — đã lưu vào hàng đợi để cộng lại.',
        code: reason
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Lỗi ghi ví, SePay sẽ thử lại.',
      code: err instanceof FirestoreError ? (err.code || 'firestore_error') : 'server_error'
    });
  }
}
