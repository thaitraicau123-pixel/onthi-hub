/**
 * api/sepay.js
 * Vercel Serverless Function - SePay Automated Payment Gateway & Webhook Engine
 * Hỗ trợ đồng thời 2 chuẩn SePay:
 * 1. Chuyển khoản VietQR Techcombank (NAPXU...)
 * 2. SePay CheckoutBuilder SDK (INV-..., BANK_TRANSFER, PURCHASE, orderAmount)
 * Tự động nhận diện giao dịch chuyển khoản Techcombank 6688686866688 qua SePay (sepay.vn)
 * và tự động cộng Xu vào ví khách hàng 100% trong 2-5 giây, không cần Admin duyệt tay.
 */

// Bộ đệm lưu trữ bộ nhớ serverless
if (!global._serverTopupCache) {
  global._serverTopupCache = [];
}
if (!global._sepayProcessedIds) {
  global._sepayProcessedIds = new Set();
}
if (!global._bannedEmails) {
  global._bannedEmails = new Set(['thaihoa27492@gmail.com']);
}

const DEFAULT_TOPIC = 'buithai_studio_0986019623';
const TECHCOMBANK_ACC = '6688686866688';

export default async function handler(req, res) {
  // Bật CORS cho toàn bộ domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ==========================================
  // 1. GET: Kiểm tra trạng thái SePay Webhook & Cung cấp cấu hình Checkout
  // ==========================================
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'SePay Automated Banking Webhook & Checkout Gateway',
      version: '1.1.0',
      status: 'active',
      bank: 'Techcombank',
      accountNumber: TECHCOMBANK_ACC,
      accountName: 'BUI THAI',
      webhookUrl: 'https://promptmmo.vercel.app/api/sepay',
      checkoutBuilder: {
        paymentMethod: 'BANK_TRANSFER',
        currency: 'VND',
        operation: 'PURCHASE',
        orderInvoiceNumberPattern: 'INV-[timestamp]'
      },
      guide: 'Dán URL webhook này vào cấu hình Webhook trên trang quản trị SePay (sepay.vn) để kích hoạt duyệt Xu tự động 24/7.',
      timestamp: new Date().toISOString()
    });
  }

  // ==========================================
  // 2. POST: Nhận Webhook từ SePay (Cả VietQR lẫn CheckoutBuilder)
  // ==========================================
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    body = body || {};

    console.log('[SePay Webhook] Nhận dữ liệu biến động số dư từ SePay:', JSON.stringify(body));

    // A. Action tạo dữ liệu Checkout (tương đương CheckoutBuilder trong SePay PHP SDK)
    if (body.action === 'create_checkout' || body.action === 'build_checkout') {
      const amount = Number(body.amount || body.orderAmount) || 10000;
      const invoiceNum = String(body.orderInvoiceNumber || 'INV-' + Date.now());
      const description = String(body.orderDescription || body.description || ('Nap Xu Bùi Thái AI - ' + invoiceNum));
      const checkoutData = {
        paymentMethod: 'BANK_TRANSFER',
        currency: 'VND',
        orderInvoiceNumber: invoiceNum,
        orderAmount: amount,
        operation: 'PURCHASE',
        orderDescription: description,
        bankAccount: TECHCOMBANK_ACC,
        bankName: 'Techcombank',
        accountName: 'BUI THAI',
        qrUrl: `https://qr.sepay.vn/img?acc=${TECHCOMBANK_ACC}&bank=Techcombank&amount=${amount}&des=${encodeURIComponent(invoiceNum)}&template=compact`
      };
      return res.status(200).json({ success: true, data: checkoutData });
    }

    // B. Kiểm tra loại giao dịch: chỉ xử lý tiền vào (in)
    const transferType = String(body.transferType || '').toLowerCase();
    if (transferType && transferType !== 'in') {
      console.log('[SePay Webhook] Bỏ qua giao dịch tiền ra (transferType != in):', transferType);
      return res.status(200).json({ success: true, message: 'Bỏ qua giao dịch tiền ra' });
    }

    // Lấy số tiền chuyển khoản (hỗ trợ cả transferAmount lẫn orderAmount của CheckoutBuilder)
    const transferAmount = Number(body.transferAmount || body.orderAmount || body.order_amount || body.amount) || 0;
    if (transferAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Số tiền giao dịch không hợp lệ' });
    }

    // Chống xử lý trùng lặp giao dịch (Idempotency key)
    const transactionId = String(body.id || body.referenceCode || body.transactionId || body.orderInvoiceNumber || body.order_invoice_number || '').trim();
    if (transactionId && global._sepayProcessedIds.has(transactionId)) {
      console.warn(`[SePay Webhook] Giao dịch ${transactionId} đã được xử lý trước đó, bỏ qua để chống cộng trùng.`);
      return res.status(200).json({ success: true, message: 'Giao dịch đã được ghi nhận trước đó' });
    }
    if (transactionId) {
      global._sepayProcessedIds.add(transactionId);
      if (global._sepayProcessedIds.size > 1000) {
        const first = global._sepayProcessedIds.values().next().value;
        global._sepayProcessedIds.delete(first);
      }
    }

    // Trích xuất nội dung chuyển khoản / mã hóa đơn CheckoutBuilder
    const invoiceNumber = String(body.orderInvoiceNumber || body.order_invoice_number || body.invoiceNumber || '').trim();
    const content = String(body.content || body.description || body.code || invoiceNumber || '').trim();
    const contentUpper = (content + ' ' + invoiceNumber).toUpperCase();

    // Tìm kiếm trong bộ đệm topups hiện tại
    let matchedTopup = null;

    if (Array.isArray(global._serverTopupCache)) {
      matchedTopup = global._serverTopupCache.find(t => {
        if (!t) return false;
        const memo = String(t.memo || '').trim().toUpperCase();
        const id = String(t.id || '').trim().toUpperCase();
        if (memo && contentUpper.includes(memo)) return true;
        if (id && contentUpper.includes(id)) return true;
        // Khớp mã số sau NAPXU
        const memoCodeMatch = memo.match(/NAPXU\s*([A-Z0-9_-]+)/);
        if (memoCodeMatch && contentUpper.includes(memoCodeMatch[1])) return true;
        // Khớp mã hóa đơn INV-...
        const invMatch = memo.match(/INV-([A-Z0-9_-]+)/i);
        if (invMatch && contentUpper.includes(invMatch[0].toUpperCase())) return true;
        return false;
      });
    }

    let topupId = matchedTopup ? matchedTopup.id : (invoiceNumber || ('TOPUP-SEPAY-' + Date.now().toString().slice(-6) + Math.floor(10 + Math.random() * 89)));
    let userEmail = matchedTopup ? matchedTopup.userEmail : '';
    let userName = matchedTopup ? matchedTopup.userName : '';

    // Nếu chưa tìm thấy topup nhưng nội dung có chứa email khách
    if (!userEmail) {
      const emailMatch = content.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
      if (emailMatch) {
        userEmail = emailMatch[1].toLowerCase();
        userName = userEmail.split('@')[0];
      }
    }

    // Nếu vẫn chưa có email, trích xuất mã khách hàng từ nội dung (ví dụ NAPXU THAIHOA165 hoặc INV-...)
    if (!userEmail) {
      const codeMatch = contentUpper.match(/NAPXU\s*([A-Z0-9_-]+)/);
      if (codeMatch) {
        userName = codeMatch[1];
        userEmail = codeMatch[1].toLowerCase() + '@khachhang.promptmmo';
      } else if (invoiceNumber) {
        userName = invoiceNumber;
        userEmail = invoiceNumber.toLowerCase() + '@sepay.checkout';
      }
    }

    // Kiểm tra nếu tài khoản bị cấm
    if (userEmail && (global._bannedEmails.has(userEmail) || userEmail === 'thaihoa27492@gmail.com')) {
      console.warn(`[SePay Webhook] Tài khoản ${userEmail} nằm trong danh sách cấm! Không cộng Xu.`);
      return res.status(200).json({ success: false, message: 'Tài khoản bị cấm do vi phạm chính sách spam' });
    }

    // Cập nhật trạng thái topup thành completed
    if (matchedTopup) {
      matchedTopup.status = 'completed';
      matchedTopup.statusText = 'Đã duyệt tự động qua SePay 24/7';
      matchedTopup.approvedAt = new Date().toISOString();
      matchedTopup.sepayTxId = transactionId;
    } else {
      const newTopup = {
        id: topupId,
        amount: transferAmount,
        bank: 'Techcombank',
        accountNumber: TECHCOMBANK_ACC,
        accountName: 'BUI THAI',
        method: invoiceNumber ? 'SePay Checkout Gateway (BANK_TRANSFER)' : 'SePay VietQR 24/7 Tự Động',
        memo: content || invoiceNumber || 'NAPXU SEPAY',
        userEmail: userEmail || 'khachhang@promptmmo.store',
        userName: userName || 'Khách Hàng SePay',
        status: 'completed',
        statusText: 'Đã duyệt tự động qua SePay 24/7',
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
        sepayTxId: transactionId
      };
      global._serverTopupCache.unshift(newTopup);
      if (global._serverTopupCache.length > 200) {
        global._serverTopupCache = global._serverTopupCache.slice(0, 200);
      }
    }

    // Bắn thông báo ntfy khẩn cấp về điện thoại Admin xác nhận tiền đã về Techcombank
    try {
      await fetch('https://ntfy.sh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: DEFAULT_TOPIC,
          title: `⚡ [SEPAY TỰ ĐỘNG] +${transferAmount.toLocaleString('vi-VN')} XU ĐÃ VÀO VÍ!`,
          message: `Mã GD: ${transactionId || topupId}\nKhách: ${userName || 'Khách hàng'} (${userEmail || 'Chưa định danh'})\nSố tiền: +${transferAmount.toLocaleString('vi-VN')} VNĐ (+${transferAmount.toLocaleString('vi-VN')} Xu)\nSTK: 6688686866688 (Techcombank)\nNội dung: ${content}\nTrạng thái: ✅ ĐÃ TỰ ĐỘNG CỘNG XU VÀO VÍ 100%!`,
          priority: 5,
          tags: ['zap', 'moneybag', 'white_check_mark', 'sparkles'],
          click: 'https://promptmmo.vercel.app/#admin'
        }),
        signal: AbortSignal.timeout(3000)
      }).catch(() => null);
    } catch (eNtfy) {}

    console.log(`[SePay Webhook] Thành công duyệt tự động +${transferAmount} Xu cho ${userEmail} (Mã: ${topupId})`);

    return res.status(200).json({
      success: true,
      message: 'Giao dịch SePay đã được duyệt tự động thành công!',
      data: {
        topupId: topupId,
        amount: transferAmount,
        userEmail: userEmail,
        status: 'completed',
        transactionId: transactionId
      }
    });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
