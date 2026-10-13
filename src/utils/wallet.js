// Wallet, Deposit/Withdraw transactions and Admin Notification Manager
const WALLET_BALANCE_KEY = 'onthi_wallet_balance';
const TRANSACTIONS_KEY = 'onthi_wallet_transactions';
const ADMIN_NOTIFICATIONS_KEY = 'onthi_admin_notifications';

export const ADMIN_PHONE = '0986019623';
export const ADMIN_ZALO_PHONE = '0986019623';
export const ADMIN_ZALO_LINK = 'https://zalo.me/0986019623';
export const ADMIN_EMAIL = 'thaitraicau123@gmail.com';
export const ADMIN_NTFY_TOPIC = 'https://ntfy.sh/Onthihubbbbb';
export const COIN_RATE_VND = 1000; // 1 Xu = 1.000 VNĐ

// Get current wallet balance (Default 20 Xu tặng tân thủ)
export function getWalletBalance() {
  try {
    const raw = localStorage.getItem(WALLET_BALANCE_KEY);
    return raw !== null ? parseInt(raw, 10) : 20; // 20 Xu = 20k chào mừng
  } catch (e) {
    return 20;
  }
}

// Set wallet balance
export function setWalletBalance(amount) {
  try {
    localStorage.setItem(WALLET_BALANCE_KEY, amount.toString());
  } catch (e) {
    console.error('Failed to set balance', e);
  }
}

// Add coins
export function addWalletCoins(coins) {
  const current = getWalletBalance();
  const next = current + coins;
  setWalletBalance(next);
  return next;
}

// Deduct coins (returns boolean)
export function deductWalletCoins(coins) {
  const current = getWalletBalance();
  if (current < coins) return false;
  const next = current - coins;
  setWalletBalance(next);
  return true;
}

// Get all transactions
export function getTransactions() {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Format standard notification message for Admin via Zalo (0986019623)
export function formatAdminZaloMessage({ type, code, amountXu, amountVnd, userEmail, details, timestamp }) {
  const time = timestamp || new Date().toLocaleString('vi-VN');
  const typeText = type === 'deposit' ? 'NẠP XU (VietQR)' : 'RÚT TIỀN VỀ NGÂN HÀNG';
  const vndText = (amountVnd || amountXu * COIN_RATE_VND).toLocaleString('vi-VN');

  let extra = '';
  if (type === 'withdraw' && details) {
    extra = `\n🏦 Ngân hàng: ${details.bankName || ''}\n💳 STK: ${details.accountNo || ''}\n👤 Chủ TK: ${details.accountName || ''}`;
  } else if (type === 'deposit') {
    extra = `\n💳 Cú pháp quét mã: ${code}\n💰 Số tiền chuyển khoản: ${vndText}đ`;
  }

  return `🔔 [ÔNTHIHUB] THÔNG BÁO ${type === 'deposit' ? 'NẠP TIỀN' : 'RÚT TIỀN'} MỚI!
----------------------------------
• Mã GD: ${code}
• Loại lệnh: ${typeText}
• Số lượng: ${amountXu} Xu (~${vndText}đ)
• Khách hàng: ${userEmail || 'Chưa cung cấp'}${extra}
• Thời gian: ${time}
----------------------------------
👉 Admin kiểm tra và duyệt lệnh giúp em trên hệ thống nhé!`;
}

// Quick helper to copy message & open Zalo chat
export function openAdminZaloChat(customMessage) {
  if (customMessage && typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      navigator.clipboard.writeText(customMessage);
    } catch (e) {
      console.warn('Clipboard write failed', e);
    }
  }
  if (typeof window !== 'undefined') {
    window.open(ADMIN_ZALO_LINK, '_blank');
  }
}

// Telegram Notification Configuration Key
export const TELEGRAM_CONFIG_KEY = 'onthi_telegram_config';

export function getTelegramConfig() {
  try {
    const raw = localStorage.getItem(TELEGRAM_CONFIG_KEY);
    return raw ? JSON.parse(raw) : { botToken: '', chatId: '', enabled: false };
  } catch (e) {
    return { botToken: '', chatId: '', enabled: false };
  }
}

export function saveTelegramConfig(cfg) {
  try {
    localStorage.setItem(TELEGRAM_CONFIG_KEY, JSON.stringify(cfg));
    return true;
  } catch (e) {
    return false;
  }
}

// Send Real Email directly to Gmail thaitraicau123@gmail.com via FormSubmit API
export async function sendRealEmailToAdmin({ type, code, amountXu, amountVnd, userEmail, details, timestamp }) {
  const time = timestamp || new Date().toLocaleString('vi-VN');
  const typeText = type === 'deposit' ? 'NẠP XU (VietQR)' : 'RÚT TIỀN VỀ NGÂN HÀNG';
  const vndText = (amountVnd || amountXu * COIN_RATE_VND).toLocaleString('vi-VN') + ' VNĐ';

  const payload = {
    _subject: `[ÔnThiHub] Yêu Cầu ${type === 'deposit' ? 'NẠP TIỀN' : 'RÚT TIỀN'} - Mã: ${code} (${amountXu} Xu)`,
    _template: 'table',
    _captcha: 'false',
    'Mã Giao Dịch': code,
    'Loại Lệnh': typeText,
    'Số Lượng Xu': `${amountXu} Xu`,
    'Số Tiền VNĐ': vndText,
    'Khách Hàng': userEmail || 'Chưa cung cấp',
    'Thời Gian Tạo': time,
    'Chi Tiết Giao Dịch': typeof details === 'object' ? JSON.stringify(details, null, 2) : String(details),
    'Số Điện Thoại Admin': ADMIN_PHONE
  };

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, data };
  } catch (err) {
    console.warn('FormSubmit email error:', err);
    return { success: false, error: err?.message };
  }
}

// Send Telegram notification directly to Admin's phone
export async function sendTelegramNotification({ type, code, amountXu, amountVnd, userEmail, details, timestamp }) {
  const cfg = getTelegramConfig();
  if (!cfg.enabled || !cfg.botToken || !cfg.chatId) return { success: false, skipped: true };

  const time = timestamp || new Date().toLocaleString('vi-VN');
  const typeText = type === 'deposit' ? '🟢 NẠP XU (VietQR)' : '🔴 RÚT TIỀN VỀ NGÂN HÀNG';
  const vndText = (amountVnd || amountXu * COIN_RATE_VND).toLocaleString('vi-VN') + ' VNĐ';

  let extra = '';
  if (type === 'withdraw' && details) {
    extra = `\n🏦 <b>Ngân hàng:</b> ${details.bankName || ''}\n💳 <b>STK:</b> ${details.accountNo || ''}\n👤 <b>Chủ TK:</b> ${details.accountName || ''}`;
  } else if (type === 'deposit') {
    extra = `\n💳 <b>Cú pháp CK:</b> <code>${code}</code>`;
  }

  const text = `🔔 <b>[ÔNTHIHUB] CÓ LỆNH ${type === 'deposit' ? 'NẠP XU' : 'RÚT TIỀN'} MỚI!</b>
━━━━━━━━━━━━━━━━━
• <b>Mã đơn:</b> <code>${code}</code>
• <b>Loại:</b> ${typeText}
• <b>Số lượng:</b> <b>${amountXu} Xu</b> (~${vndText})
• <b>Khách hàng:</b> ${userEmail || 'Chưa cung cấp'}${extra}
• <b>Thời gian:</b> ${time}
━━━━━━━━━━━━━━━━━
👉 Đăng nhập Secret Admin trên web để duyệt lệnh.`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${cfg.botToken.trim()}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cfg.chatId.trim(),
        text,
        parse_mode: 'HTML'
      })
    });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, data };
  } catch (err) {
    return { success: false, error: err?.message };
  }
}

// Send Real-time Push Notification to Admin's phone via ntfy.sh (100% UTF-8 JSON Body, no ByteString header error)
export async function sendNtfyNotification({ title, message, priority = 5, tags = ['bell'], click }) {
  if (typeof fetch === 'undefined') return { success: false, error: 'No fetch environment' };
  try {
    const res = await fetch('https://ntfy.sh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic: 'Onthihubbbbb',
        title: title || '[OnThiHub] Thông Báo Mới',
        message: message || '',
        priority: priority || 5,
        tags: Array.isArray(tags) ? tags : [tags],
        click: click || (typeof window !== 'undefined' ? window.location.origin : 'https://thaitraicau123-pixel.github.io/onthi-hub/')
      })
    });
    return { success: res.ok };
  } catch (err) {
    console.warn('ntfy push error:', err);
    return { success: false, error: err?.message };
  }
}

// Send Notification via ntfy.sh / FormSubmit Real Email / Telegram
export function notifyAdmin({ type, code, amountXu, amountVnd, userEmail, details }) {
  const timestamp = new Date().toLocaleString('vi-VN');
  const zaloMessage = formatAdminZaloMessage({ type, code, amountXu, amountVnd, userEmail, details, timestamp });
  const subject = `[ÔnThiHub] Yêu Cầu ${type === 'deposit' ? 'NẠP TIỀN' : 'RÚT TIỀN'} Mới - Mã: ${code}`;
  const body = `
Xin chào Admin (${ADMIN_PHONE} - ${ADMIN_EMAIL}),

Hệ thống ghi nhận một yêu cầu ${type === 'deposit' ? 'NẠP XU' : 'RÚT TIỀN VỀ NGÂN HÀNG'} mới cần DUYỆT CHAY:

• Mã giao dịch: ${code}
• Loại giao dịch: ${type === 'deposit' ? 'Nạp Xu (VietQR)' : 'Rút Tiền Về Ngân Hàng'}
• Số lượng Xu: ${amountXu} Xu (~${amountVnd.toLocaleString()} VNĐ)
• Email người dùng: ${userEmail || 'Chưa cung cấp'}
• Thời gian tạo: ${timestamp}
• Điện thoại Admin: ${ADMIN_PHONE}
• Chi tiết: ${JSON.stringify(details, null, 2)}

Vui lòng kiểm tra và duyệt giao dịch này.
Trân trọng,
Hệ thống ÔnThiHub Automation
  `.trim();

  // 1. Gửi EMAIL THẬT trực tiếp đến thaitraicau123@gmail.com qua FormSubmit API
  sendRealEmailToAdmin({ type, code, amountXu, amountVnd, userEmail, details, timestamp });

  // 2. Gửi PUSH RUNG ĐIỆN THOẠI tức thì qua ntfy.sh (JSON UTF-8 Payload)
  sendNtfyNotification({
    title: `[OnThiHub] ${type === 'deposit' ? 'Nạp Xu' : 'Rút Tiền'}: ${code} (${amountXu} Xu)`,
    message: zaloMessage,
    priority: 5,
    tags: type === 'deposit' ? ['moneybag', 'inbox'] : ['warning', 'bank']
  });

  // 3. Gửi tin nhắn Telegram tự động (nếu Admin đã cấu hình Bot)
  sendTelegramNotification({ type, code, amountXu, amountVnd, userEmail, details, timestamp });

  // 4. Save to Admin Notifications store
  try {
    const raw = localStorage.getItem(ADMIN_NOTIFICATIONS_KEY);
    const notifs = raw ? JSON.parse(raw) : [];
    notifs.unshift({
      id: 'notif_' + Date.now(),
      targetEmail: ADMIN_EMAIL,
      targetPhone: ADMIN_PHONE,
      zaloLink: ADMIN_ZALO_LINK,
      zaloMessage,
      subject,
      body,
      type,
      code,
      amountXu,
      amountVnd,
      userEmail,
      details,
      timestamp,
      isRead: false
    });
    localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.error('Failed to log admin notification', e);
  }

  // Create mailto fallback url
  const mailtoUrl = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { subject, body, mailtoUrl, zaloMessage, zaloLink: ADMIN_ZALO_LINK };
}

// Backward compatibility alias
export const notifyAdminByEmail = notifyAdmin;

// Get all Admin Notifications
export function getAdminNotifications() {
  try {
    const raw = localStorage.getItem(ADMIN_NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Mark admin notification read
export function markAdminNotificationRead(id) {
  try {
    const notifs = getAdminNotifications();
    const updated = notifs.map(n => n.id === id ? { ...n, isRead: true } : n);
    localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {}
}

// Create Deposit Request (Nạp Xu)
export function createDepositRequest({ xuAmount, userEmail }) {
  const amountVnd = xuAmount * COIN_RATE_VND;
  const code = 'NAP' + Math.floor(100000 + Math.random() * 900000);
  const tx = {
    id: code,
    type: 'deposit',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    xuAmount,
    amountVnd,
    userEmail: userEmail || 'user@onthihub.vn',
    createdAt: new Date().toISOString(),
    details: {
      method: 'VietQR Napas247',
      rate: '1 Xu = 1.000 VNĐ'
    }
  };

  const list = getTransactions();
  list.unshift(tx);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));

  // Gửi thông báo đến Admin (Zalo 0986019623 & ntfy.sh & Gmail)
  const notifData = notifyAdmin({
    type: 'deposit',
    code,
    amountXu: xuAmount,
    amountVnd,
    userEmail,
    details: tx.details
  });

  return { tx, emailData: notifData, notifData, zaloMessage: notifData.zaloMessage, zaloLink: ADMIN_ZALO_LINK };
}

// Create Withdrawal Request (Rút Tiền)
export function createWithdrawalRequest({ xuAmount, bankName, accountNo, accountName, userEmail }) {
  const currentBalance = getWalletBalance();
  if (currentBalance < xuAmount) {
    return { success: false, message: 'Số dư ví Xu không đủ để thực hiện lệnh rút!' };
  }

  // Deduct coins immediately and put into escrow
  deductWalletCoins(xuAmount);

  const amountVnd = xuAmount * COIN_RATE_VND;
  const code = 'RUT' + Math.floor(100000 + Math.random() * 900000);
  const tx = {
    id: code,
    type: 'withdraw',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    xuAmount,
    amountVnd,
    userEmail: userEmail || 'creator@onthihub.vn',
    createdAt: new Date().toISOString(),
    details: {
      bankName,
      accountNo,
      accountName,
      note: `Chờ duyệt chuyển khoản ngân hàng`
    }
  };

  const list = getTransactions();
  list.unshift(tx);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));

  // Gửi thông báo đến Admin (Zalo 0986019623 & ntfy.sh & Gmail)
  const notifData = notifyAdmin({
    type: 'withdraw',
    code,
    amountXu: xuAmount,
    amountVnd,
    userEmail,
    details: tx.details
  });

  return { success: true, tx, emailData: notifData, notifData, zaloMessage: notifData.zaloMessage, zaloLink: ADMIN_ZALO_LINK };
}

// Admin approves transaction (Duyệt Chay)
export function adminApproveTransaction(txId) {
  const list = getTransactions();
  const tx = list.find(t => t.id === txId);
  if (!tx || tx.status !== 'pending') return false;

  tx.status = 'approved';
  tx.reviewedAt = new Date().toISOString();

  // If deposit is approved, credit user wallet balance
  if (tx.type === 'deposit') {
    addWalletCoins(tx.xuAmount);
  }

  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));
  return true;
}

// Admin rejects transaction
export function adminRejectTransaction(txId, reason = 'Thông tin chưa chính xác') {
  const list = getTransactions();
  const tx = list.find(t => t.id === txId);
  if (!tx || tx.status !== 'pending') return false;

  tx.status = 'rejected';
  tx.rejectReason = reason;
  tx.reviewedAt = new Date().toISOString();

  // If withdraw was rejected, refund coins back to user
  if (tx.type === 'withdraw') {
    addWalletCoins(tx.xuAmount);
  }

  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));
  return true;
}
