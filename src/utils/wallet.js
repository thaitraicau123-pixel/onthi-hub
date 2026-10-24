// Wallet, Deposit/Withdraw transactions and Admin Notification Manager
import {
  getFirestoreDb,
  doc,
  setDoc,
  getDocs,
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  fetchAllFirestoreUsers,
  getCurrentUser,
  logoutUser
} from './firebaseConfig.js';
import { setUserTier } from './userTier.js';

const WALLET_BALANCE_KEY = 'onthi_wallet_balance';
const TRANSACTIONS_KEY = 'onthi_wallet_transactions';
const ADMIN_NOTIFICATIONS_KEY = 'onthi_admin_notifications';
export const CLOUD_TX_TOPIC = 'Onthihubbbbb_tx';

export const ADMIN_PHONE = '0986019623';
export const ADMIN_ZALO_PHONE = '0986019623';
export const ADMIN_ZALO_LINK = 'https://zalo.me/0986019623';
export const ADMIN_EMAIL = 'thaitraicau123@gmail.com';
export const ADMIN_NTFY_TOPIC = 'https://ntfy.sh/Onthihubbbbb';
export const COIN_RATE_VND = 1000; // 1 Xu = 1.000 VNĐ
export const MIN_WITHDRAW_XU = 100; // Hạn mức rút tiền tối thiểu 100 Xu = 100.000 VNĐ (Tránh rút lẻ tẻ gây lỗ phí ngân hàng)
export const MAX_WITHDRAW_DAILY_XU = 500; // Hạn mức rút tối đa 500 Xu / lần / ngày = 500.000 VNĐ (Chống xả quỹ đột biến)
export const WITHDRAW_FEE_PERCENT = 10; // Phí nền tảng & xử lý chuyển tiền qua cổng Napas/VietQR: 10% (Tối thiểu 5.000đ)
export const WITHDRAWABLE_BALANCE_KEY = 'onthi_withdrawable_balance';

// Get current wallet balance (Default 20 Xu tặng tân thủ - chỉ dùng để học bài)
export function getWalletBalance() {
  try {
    const raw = localStorage.getItem(WALLET_BALANCE_KEY);
    return raw !== null ? parseInt(raw, 10) : 20; // 20 Xu = 20k chào mừng học tập
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

// Add coins (total balance)
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

// Lấy số dư Xu đủ điều kiện rút tiền (Chỉ gồm Xu doanh thu bán thẻ C2C hoặc Xu nạp thực tế, KHÔNG gồm Xu khuyến mãi / tặng tân thủ / điểm danh)
export function getWithdrawableBalance() {
  try {
    const raw = localStorage.getItem(WITHDRAWABLE_BALANCE_KEY);
    const total = getWalletBalance();
    if (raw !== null) {
      const stored = parseInt(raw, 10);
      return Math.max(0, Math.min(stored, total));
    }
    // Nếu chưa lưu: Kiểm tra các giao dịch doanh thu bán thẻ hoặc nạp tiền đã duyệt
    const txs = getTransactions();
    let earned = 0;
    txs.forEach((t) => {
      if ((t.type === 'deposit' || t.type === 'marketplace_sale') && t.status === 'approved') {
        earned += Number(t.xuAmount) || 0;
      }
      if (t.type === 'withdraw' && (t.status === 'approved' || t.status === 'pending')) {
        earned -= Number(t.xuAmount) || 0;
      }
    });
    return Math.max(0, Math.min(earned, total));
  } catch (e) {
    return 0;
  }
}

// Cập nhật số dư Xu có thể rút
export function setWithdrawableBalance(amount) {
  try {
    const val = Math.max(0, parseInt(amount, 10) || 0);
    localStorage.setItem(WITHDRAWABLE_BALANCE_KEY, val.toString());
  } catch (e) {}
}

// Cộng Xu đủ điều kiện rút (Khi có đơn bán thẻ C2C thành công hoặc khi nạp tiền)
export function addWithdrawableCoins(coins) {
  const current = getWithdrawableBalance();
  const next = current + Math.max(0, parseInt(coins, 10) || 0);
  setWithdrawableBalance(next);
  return next;
}

// Trừ Xu có thể rút khi tạo lệnh rút tiền
export function deductWithdrawableCoins(coins) {
  const current = getWithdrawableBalance();
  const next = Math.max(0, current - Math.max(0, parseInt(coins, 10) || 0));
  setWithdrawableBalance(next);
  return next;
}

// Tính phí nền tảng và số tiền thực nhận về tài khoản ngân hàng
export function calculateWithdrawalFee(xuAmount) {
  const xu = Math.max(0, Number(xuAmount) || 0);
  const grossVnd = xu * COIN_RATE_VND;
  // Phí 10% sàn (tối thiểu 5.000đ để web không bao giờ bị lỗ phí chuyển khoản Napas)
  const feeVnd = Math.max(5000, Math.round(grossVnd * (WITHDRAW_FEE_PERCENT / 100)));
  const feeXu = Math.ceil(feeVnd / COIN_RATE_VND);
  const netVnd = Math.max(0, grossVnd - feeVnd);
  return {
    grossVnd,
    feeVnd,
    feeXu,
    netVnd,
    feePercent: WITHDRAW_FEE_PERCENT
  };
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
    const netVnd = details.netVnd ? details.netVnd.toLocaleString('vi-VN') + 'đ' : vndText + 'đ';
    const feeVnd = details.feeVnd ? details.feeVnd.toLocaleString('vi-VN') + 'đ' : '0đ';
    extra = `\n🏦 Ngân hàng: ${details.bankName || ''}\n💳 STK: ${details.accountNo || ''}\n👤 Chủ TK: ${details.accountName || ''}\n💰 Phí sàn giữ lại (10%): ${feeVnd}\n💵 SỐ TIỀN THỰC CHUYỂN QUA APP: ${netVnd}`;
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

// ----------------------------------------------------------------------
// FIREBASE FIRESTORE & CROSS-DEVICE CLOUD SYNC ENGINE
// ----------------------------------------------------------------------

// Lightweight timeout wrapper to prevent indefinite Firestore hang if API disabled or offline
function withFirestoreTimeout(promise, ms = 2000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), ms))
  ]);
}

// Save transaction doc to Firebase Firestore
export async function saveTransactionToFirestore(tx) {
  try {
    const db = getFirestoreDb();
    if (db && tx && tx.id) {
      await withFirestoreTimeout(setDoc(doc(db, 'transactions', tx.id), tx, { merge: true }), 2000);
      return { success: true };
    }
  } catch (err) {
    console.warn('Firestore transaction save notice:', err.message);
    return { success: false, error: err.message };
  }
  return { success: false, error: 'Firestore offline' };
}

// Broadcast transaction events to Cloud Relay (ntfy Onthihubbbbb_tx)
export async function broadcastTransactionToCloud(action, payload) {
  if (typeof fetch === 'undefined') return false;
  try {
    const payloadStr = JSON.stringify({
      action,
      data: payload,
      timestamp: new Date().toISOString()
    });
    // POST to root https://ntfy.sh with JSON payload
    await fetch('https://ntfy.sh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: CLOUD_TX_TOPIC,
        title: `TX_${action}_${payload?.id || payload?.txId || Date.now()}`,
        message: payloadStr,
        priority: 4
      })
    });
    return true;
  } catch (e) {
    return false;
  }
}

// Merge an incoming list of transactions into localStorage without losing status
export function mergeAndSaveTransactions(incomingList) {
  if (!Array.isArray(incomingList) || incomingList.length === 0) {
    return getTransactions();
  }
  const current = getTransactions();
  const map = new Map();

  for (const item of current) {
    if (item && item.id) {
      map.set(item.id, { ...item });
    }
  }

  const statusPriority = { approved: 3, rejected: 3, pending: 1 };

  for (const item of incomingList) {
    if (!item || !item.id) continue;
    const existing = map.get(item.id);
    if (!existing) {
      map.set(item.id, { ...item });
    } else {
      const exPriority = statusPriority[existing.status] || 0;
      const inPriority = statusPriority[item.status] || 0;

      let merged;
      if (inPriority > exPriority) {
        merged = { ...existing, ...item };
      } else if (inPriority === exPriority && item.reviewedAt && !existing.reviewedAt) {
        merged = { ...existing, ...item };
      } else {
        merged = { ...item, ...existing };
      }
      if (existing.creditedLocally) {
        merged.creditedLocally = true;
      }
      map.set(item.id, merged);
    }
  }

  const mergedList = Array.from(map.values()).sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(mergedList));
  } catch (e) {
    console.error('Failed to save merged transactions', e);
  }

  return mergedList;
}

// Fetch Cloud Relay transaction stream (ntfy topic)
export async function fetchCloudRelayTransactions() {
  if (typeof fetch === 'undefined') return [];
  try {
    const res = await fetch(`https://ntfy.sh/${CLOUD_TX_TOPIC}/json?poll=1&since=all`);
    if (!res.ok) return [];
    const text = await res.text();
    const lines = text.trim().split('\n');
    const txs = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        if (json.event === 'message' && json.message) {
          let body = null;
          try {
            body = typeof json.message === 'string' ? JSON.parse(json.message) : json.message;
          } catch (e) {}

          // Check if double wrapped
          if (body && typeof body === 'object' && body.message && typeof body.message === 'string') {
            try {
              body = JSON.parse(body.message);
            } catch (e) {}
          }

          if (body) {
            if (body.action === 'create' && body.data) {
              txs.push(body.data);
            } else if (body.action === 'status_update' && body.data) {
              txs.push({
                id: body.data.txId,
                status: body.data.status,
                rejectReason: body.data.rejectReason,
                reviewedAt: body.data.reviewedAt || body.timestamp
              });
            } else if (body.id && (body.type === 'deposit' || body.type === 'withdraw')) {
              txs.push(body);
            }
          }
        }
      } catch (err) {}
    }
    return txs;
  } catch (e) {
    return [];
  }
}

// Fetch all transactions from Firebase Firestore + Cloud Relay + LocalStorage
export async function fetchFirestoreTransactions() {
  const firestoreTxs = [];
  const db = getFirestoreDb();
  if (db) {
    try {
      const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
      const snap = await withFirestoreTimeout(getDocs(q), 2000);
      snap.forEach((d) => {
        firestoreTxs.push(d.data());
      });
    } catch (err) {
      console.warn('Firestore fetch notice:', err.message);
    }
  }

  const cloudTxs = await fetchCloudRelayTransactions();
  const allIncoming = [...firestoreTxs, ...cloudTxs];
  if (allIncoming.length > 0) {
    return mergeAndSaveTransactions(allIncoming);
  }
  return getTransactions();
}

// Real-time listener for cross-device transactions
export function subscribeToTransactions(callback) {
  callback(getTransactions());

  let unsubscribeFirestore = null;
  const db = getFirestoreDb();

  // 1. Real-time Firebase Firestore onSnapshot listener
  if (db) {
    try {
      const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
      unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          const list = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data());
          });
          if (list.length > 0) {
            const merged = mergeAndSaveTransactions(list);
            callback(merged);
          }
        },
        (err) => {
          console.warn('Firestore onSnapshot notice:', err.message);
        }
      );
    } catch (e) {
      console.warn('Firestore subscription error:', e);
    }
  }

  // 2. Initial Cloud Relay fetch
  fetchCloudRelayTransactions().then((cloudTxs) => {
    if (cloudTxs.length > 0) {
      const merged = mergeAndSaveTransactions(cloudTxs);
      callback(merged);
    }
  });

  // 3. Periodic cloud poller (every 6s) to ensure instant cross-device updates
  const intervalId = setInterval(async () => {
    const cloudTxs = await fetchCloudRelayTransactions();
    if (cloudTxs.length > 0) {
      const merged = mergeAndSaveTransactions(cloudTxs);
      callback(merged);
    }
  }, 6000);

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    clearInterval(intervalId);
  };
}

// Check and credit approved transactions to user's wallet
export function checkAndApplyApprovedTransactions(userEmail) {
  const list = getTransactions();
  let newlyCreditedCoins = 0;
  const creditedTxs = [];
  let changed = false;

  for (const tx of list) {
    const matchesUser =
      !userEmail ||
      !tx.userEmail ||
      tx.userEmail === userEmail ||
      tx.userEmail.toLowerCase() === userEmail.toLowerCase();

    if (matchesUser && tx.type === 'deposit' && tx.status === 'approved' && !tx.creditedLocally) {
      tx.creditedLocally = true;
      newlyCreditedCoins += Number(tx.xuAmount) || 0;
      creditedTxs.push(tx);
      changed = true;
    }
  }

  if (changed) {
    if (newlyCreditedCoins > 0) {
      addWalletCoins(newlyCreditedCoins);
    }
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));
  }

  return { newlyCreditedCoins, creditedTxs };
}

// ----------------------------------------------------------------------
// TRANSACTION CREATION & ADMIN ACTIONS
// ----------------------------------------------------------------------

// Create Deposit Request (Nạp Xu)
export async function createDepositRequest({ xuAmount, userEmail, userId }) {
  const amountVnd = Number(xuAmount) * COIN_RATE_VND;
  const code = 'NAP' + Math.floor(100000 + Math.random() * 900000);
  const tx = {
    id: code,
    type: 'deposit',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    xuAmount: Number(xuAmount),
    amountVnd,
    userEmail: userEmail || 'user@onthihub.vn',
    userId: userId || null,
    createdAt: new Date().toISOString(),
    details: {
      method: 'VietQR Napas247',
      rate: '1 Xu = 1.000 VNĐ'
    }
  };

  const list = getTransactions();
  list.unshift(tx);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));

  // 1. Dual-write to Firebase Firestore
  saveTransactionToFirestore(tx);

  // 2. Broadcast to Cloud Relay
  broadcastTransactionToCloud('create', tx);

  // 3. Send notifications to Admin (ntfy push, Real Gmail, Telegram)
  const notifData = notifyAdmin({
    type: 'deposit',
    code,
    amountXu: Number(xuAmount),
    amountVnd,
    userEmail,
    details: tx.details
  });

  return { tx, emailData: notifData, notifData, zaloMessage: notifData.zaloMessage, zaloLink: ADMIN_ZALO_LINK };
}

// Create Withdrawal Request (Rút Tiền)
export async function createWithdrawalRequest({ xuAmount, bankName, accountNo, accountName, userEmail, userId }) {
  const amount = Number(xuAmount);
  if (!amount || isNaN(amount) || amount < MIN_WITHDRAW_XU) {
    return {
      success: false,
      message: `Hạn mức rút tiền tối thiểu là ${MIN_WITHDRAW_XU} Xu (${(MIN_WITHDRAW_XU * COIN_RATE_VND).toLocaleString()} VNĐ) để đảm bảo tối ưu chi phí xử lý giao dịch!`
    };
  }

  if (amount > MAX_WITHDRAW_DAILY_XU) {
    return {
      success: false,
      message: `Hạn mức rút tiền tối đa là ${MAX_WITHDRAW_DAILY_XU} Xu / ngày (${(MAX_WITHDRAW_DAILY_XU * COIN_RATE_VND).toLocaleString()} VNĐ) nhằm bảo đảm an toàn dòng tiền hệ thống!`
    };
  }

  const currentBalance = getWalletBalance();
  if (currentBalance < amount) {
    return {
      success: false,
      message: `Số dư ví Xu không đủ để thực hiện lệnh rút! Số dư hiện tại: ${currentBalance} Xu, cần: ${amount} Xu.`
    };
  }

  const withdrawable = getWithdrawableBalance();
  if (withdrawable < amount) {
    return {
      success: false,
      message: `Số dư Xu đủ điều kiện rút của bạn hiện là ${withdrawable} Xu. Các khoản Xu khuyến mãi (tân thủ, điểm danh, giải thưởng) là Xu học tập nội bộ chỉ dùng để mở khóa thẻ bài trên web, không quy đổi thành tiền mặt!`
    };
  }

  // Tính phí sàn 10% & số tiền thực nhận
  const feeInfo = calculateWithdrawalFee(amount);

  // Khấu trừ Xu khỏi ví và số dư có thể rút
  deductWalletCoins(amount);
  deductWithdrawableCoins(amount);

  const code = 'RUT' + Math.floor(100000 + Math.random() * 900000);
  const tx = {
    id: code,
    type: 'withdraw',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    xuAmount: amount,
    amountVnd: feeInfo.grossVnd,
    feeVnd: feeInfo.feeVnd,
    netVnd: feeInfo.netVnd,
    feePercent: feeInfo.feePercent,
    userEmail: userEmail || 'creator@onthihub.vn',
    userId: userId || null,
    createdAt: new Date().toISOString(),
    details: {
      bankName,
      accountNo,
      accountName,
      feeVnd: feeInfo.feeVnd,
      netVnd: feeInfo.netVnd,
      feePercent: feeInfo.feePercent,
      note: `Thực nhận: ${feeInfo.netVnd.toLocaleString()}đ (Đã khấu trừ 10% phí sàn ${feeInfo.feeVnd.toLocaleString()}đ)`
    }
  };

  const list = getTransactions();
  list.unshift(tx);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));

  // 1. Dual-write to Firebase Firestore
  saveTransactionToFirestore(tx);

  // 2. Broadcast to Cloud Relay
  broadcastTransactionToCloud('create', tx);

  // 3. Gửi thông báo đến Admin
  const notifData = notifyAdmin({
    type: 'withdraw',
    code,
    amountXu: Number(xuAmount),
    amountVnd: feeInfo.netVnd, // Báo cho Admin số tiền thực chuyển
    userEmail,
    details: tx.details
  });

  return { success: true, tx, feeInfo, emailData: notifData, notifData, zaloMessage: notifData.zaloMessage, zaloLink: ADMIN_ZALO_LINK };
}

// Admin approves transaction (Duyệt Chay)
export async function adminApproveTransaction(txId) {
  const list = getTransactions();
  const tx = list.find((t) => t.id === txId);
  const reviewedAt = new Date().toISOString();

  if (tx) {
    tx.status = 'approved';
    tx.reviewedAt = reviewedAt;
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));
  }

  // 1. Update Firebase Firestore document
  const db = getFirestoreDb();
  if (db) {
    try {
      await withFirestoreTimeout(
        updateDoc(doc(db, 'transactions', txId), {
          status: 'approved',
          reviewedAt
        }),
        2000
      );
    } catch (e) {
      try {
        await withFirestoreTimeout(
          setDoc(
            doc(db, 'transactions', txId),
            {
              status: 'approved',
              reviewedAt
            },
            { merge: true }
          ),
          1500
        );
      } catch (err) {}
    }
  }

  // 2. Broadcast approval to Cloud Relay so user device auto-credits Xu
  await broadcastTransactionToCloud('status_update', {
    txId,
    status: 'approved',
    reviewedAt,
    userEmail: tx?.userEmail,
    xuAmount: tx?.xuAmount,
    type: tx?.type || 'deposit'
  });

  return true;
}

// Admin rejects transaction
export async function adminRejectTransaction(txId, reason = 'Thông tin chưa chính xác') {
  const list = getTransactions();
  const tx = list.find((t) => t.id === txId);
  const reviewedAt = new Date().toISOString();

  if (tx) {
    tx.status = 'rejected';
    tx.rejectReason = reason;
    tx.reviewedAt = reviewedAt;

    // If withdraw was rejected, refund coins back to user locally if same user
    if (tx.type === 'withdraw') {
      addWalletCoins(tx.xuAmount);
    }

    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));
  }

  // 1. Update Firebase Firestore document
  const db = getFirestoreDb();
  if (db) {
    try {
      await withFirestoreTimeout(
        updateDoc(doc(db, 'transactions', txId), {
          status: 'rejected',
          rejectReason: reason,
          reviewedAt
        }),
        2000
      );
    } catch (e) {
      try {
        await withFirestoreTimeout(
          setDoc(
            doc(db, 'transactions', txId),
            {
              status: 'rejected',
              rejectReason: reason,
              reviewedAt
            },
            { merge: true }
          ),
          1500
        );
      } catch (err) {}
    }
  }

  // 2. Broadcast rejection to Cloud Relay
  await broadcastTransactionToCloud('status_update', {
    txId,
    status: 'rejected',
    rejectReason: reason,
    reviewedAt,
    userEmail: tx?.userEmail,
    xuAmount: tx?.xuAmount,
    type: tx?.type
  });

  return true;
}

// ----------------------------------------------------------------------
// USER BALANCES & ADMIN DIRECT APPROVAL ENGINE
// ----------------------------------------------------------------------

export const USERS_REGISTRY_KEY = 'onthi_all_users_registry_v1';
export const USER_BALANCE_OVERRIDES_KEY = 'onthi_user_balance_overrides_v1';

export function getUserBalanceOverrides() {
  try {
    const raw = localStorage.getItem(USER_BALANCE_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function setUserBalanceOverride(email, newBalance) {
  if (!email) return false;
  try {
    const overrides = getUserBalanceOverrides();
    overrides[email.toLowerCase().trim()] = Math.max(0, Math.round(newBalance));
    localStorage.setItem(USER_BALANCE_OVERRIDES_KEY, JSON.stringify(overrides));

    // If this is the active user on this browser, also update active balance
    const cur = getCurrentUser();
    if (cur?.email && cur.email.toLowerCase().trim() === email.toLowerCase().trim()) {
      setWalletBalance(Math.max(0, Math.round(newBalance)));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('onthi-user-balance-updated', { detail: { email, newBalance } }));
    }
    return true;
  } catch (e) {
    return false;
  }
}

export function getUserBalanceForEmail(email) {
  if (!email) return 20;
  const normalized = email.toLowerCase().trim();

  // 1. Check if current active user on this device
  const cur = getCurrentUser();
  if (cur?.email && cur.email.toLowerCase().trim() === normalized) {
    return getWalletBalance();
  }

  // 2. Check explicit admin override
  const overrides = getUserBalanceOverrides();
  if (typeof overrides[normalized] === 'number') {
    return overrides[normalized];
  }

  // 3. Check starting balance
  let baseBalance = 20;
  if (normalized === 'thaitraicau123@gmail.com') {
    baseBalance = 9999;
  } else {
    try {
      const raw = localStorage.getItem(USERS_REGISTRY_KEY);
      if (raw) {
        const registry = JSON.parse(raw);
        const found = registry.find((u) => (u.email || '').toLowerCase().trim() === normalized);
        if (typeof found?.balance === 'number') baseBalance = found.balance;
        else if (typeof found?.initialBalance === 'number') baseBalance = found.initialBalance;
      }
    } catch (e) {}
  }

  // 4. Compute from transactions (approved deposits - approved/pending withdrawals)
  const txs = getTransactions().filter((t) => (t.userEmail || '').toLowerCase().trim() === normalized);
  let totalDepositedXu = 0;
  let totalWithdrawnXu = 0;
  for (const t of txs) {
    const amt = Number(t.xuAmount) || 0;
    if (t.type === 'deposit' && t.status === 'approved') {
      totalDepositedXu += amt;
    } else if (t.type === 'withdraw' && (t.status === 'approved' || t.status === 'pending')) {
      totalWithdrawnXu += amt;
    }
  }

  return Math.max(0, baseBalance + totalDepositedXu - totalWithdrawnXu);
}

// Seed accounts (empty by default - no fake or test accounts)
export const SEED_ACCOUNTS = [];

// Detect test or fake emails to purge from display and storage
export function isTestEmail(email) {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  const testPatterns = [
    'hocvien.top1@onthihub.vn',
    'creator.anki@onthihub.vn',
    'lethithuy@gmail.com',
    'nguyenvana@gmail.com',
    'khach_nap@onthihub.vn',
    'user_nap_the@onthihub.vn',
    'creator@onthihub.vn',
    'user@onthihub.vn',
    'hocvien_test@onthihub.vn',
    'minh.nguyen@onthihub.vn',
    'lan.anh.thue@onthihub.vn',
    'tuan.kiet.edu@onthihub.vn',
    'student_minh_nguyen',
    'student_lan_anh',
    'student_tuan_kiet',
    'test@',
    'demo@',
    'dummy@',
    'fake@'
  ];
  return testPatterns.some(
    (pattern) => lower === pattern || lower.startsWith(pattern) || lower.includes('test_') || lower.includes('bot_') || lower.includes('student_')
  );
}

// Purge all test accounts from local registry, overrides, and transactions
export function purgeAllTestAccounts() {
  let count = 0;
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    if (raw) {
      const registry = JSON.parse(raw);
      const filtered = registry.filter((u) => {
        if (isTestEmail(u.email)) {
          count++;
          return false;
        }
        return true;
      });
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(filtered));
    }

    const overrides = getUserBalanceOverrides();
    let overrideChanged = false;
    for (const key of Object.keys(overrides)) {
      if (isTestEmail(key)) {
        delete overrides[key];
        overrideChanged = true;
      }
    }
    if (overrideChanged) {
      localStorage.setItem(USER_BALANCE_OVERRIDES_KEY, JSON.stringify(overrides));
    }

    const txs = getTransactions();
    const remainingTxs = txs.filter((t) => !isTestEmail(t.userEmail));
    if (remainingTxs.length !== txs.length) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(remainingTxs));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('onthi-user-balance-updated'));
    }
  } catch (e) {}
  return count;
}

// Admin deletes a specific user account completely
export async function adminDeleteUser(email) {
  if (!email) return { success: false, message: 'Email không hợp lệ' };
  const normalized = email.toLowerCase().trim();

  if (normalized === 'thaitraicau123@gmail.com') {
    return { success: false, message: 'Không thể xóa tài khoản Quản trị viên tối cao (Super Admin)!' };
  }

  try {
    // 1. Remove from USERS_REGISTRY_KEY
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    if (raw) {
      const registry = JSON.parse(raw);
      const filtered = registry.filter((u) => (u.email || '').toLowerCase().trim() !== normalized);
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(filtered));
    }

    // 2. Remove from USER_BALANCE_OVERRIDES_KEY
    const overrides = getUserBalanceOverrides();
    if (overrides[normalized] !== undefined) {
      delete overrides[normalized];
      localStorage.setItem(USER_BALANCE_OVERRIDES_KEY, JSON.stringify(overrides));
    }

    // 3. Remove transactions of this user from local storage
    const txs = getTransactions();
    const remainingTxs = txs.filter((t) => (t.userEmail || '').toLowerCase().trim() !== normalized);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(remainingTxs));

    // 4. If Firestore DB available, delete from 'users' collection
    const db = getFirestoreDb();
    if (db) {
      try {
        await withFirestoreTimeout(deleteDoc(doc(db, 'users', normalized)), 2000);
      } catch (e) {}
    }

    // 5. If this was the current user on this device, logout
    const cur = getCurrentUser();
    if (cur?.email && cur.email.toLowerCase().trim() === normalized) {
      logoutUser();
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('onthi-user-balance-updated', { detail: { email, deleted: true } }));
    }

    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Admin updates user status, tier (cấp bậc), and role
export async function adminUpdateUserStatusAndTier({ email, tier, role, status }) {
  if (!email) return { success: false, message: 'Email không hợp lệ' };
  const normalized = email.toLowerCase().trim();

  try {
    // 1. Update in USERS_REGISTRY_KEY
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    const registry = raw ? JSON.parse(raw) : [];
    const existingIndex = registry.findIndex((u) => (u.email || '').toLowerCase().trim() === normalized);

    const oldRecord = existingIndex >= 0 ? registry[existingIndex] : {};
    const newTier = tier !== undefined ? tier : (oldRecord.tier || 'free');
    const newRole = role !== undefined ? role : (oldRecord.role || 'student');
    const newStatus = status !== undefined ? status : (oldRecord.status || 'active');

    const updatedRecord = {
      ...oldRecord,
      email,
      displayName: oldRecord.displayName || email.split('@')[0],
      photoURL: oldRecord.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      tier: newTier,
      role: newRole,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      registry[existingIndex] = updatedRecord;
    } else {
      registry.push(updatedRecord);
    }
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));

    // 2. Dual-write to Firebase Firestore
    const db = getFirestoreDb();
    if (db) {
      try {
        await withFirestoreTimeout(
          setDoc(
            doc(db, 'users', normalized),
            {
              email,
              tier: newTier,
              role: newRole,
              status: newStatus,
              updatedAt: new Date().toISOString()
            },
            { merge: true }
          ),
          2000
        );
      } catch (err) {}
    }

    // 3. If target user is current active session, apply locally
    const cur = getCurrentUser();
    if (cur?.email && cur.email.toLowerCase().trim() === normalized) {
      setUserTier(newTier);
      const updatedProfile = {
        ...cur,
        tier: newTier,
        role: newRole,
        status: newStatus
      };
      try {
        localStorage.setItem('onthi_user_profile', JSON.stringify(updatedProfile));
      } catch (e) {}
    }

    // 4. Broadcast events
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('onthi-user-tier-updated', {
          detail: { email: normalized, tier: newTier, role: newRole, status: newStatus }
        })
      );
      window.dispatchEvent(new CustomEvent('onthi-user-balance-updated'));
    }

    return {
      success: true,
      tier: newTier,
      role: newRole,
      status: newStatus,
      user: updatedRecord
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Quick helper: Promote user tier by 1 level (Tăng 1 cấp bậc)
export async function promoteUserTier(email) {
  if (!email) return { success: false };
  const normalized = email.toLowerCase().trim();
  const tiers = ['free', 'plus', 'pro', 'ultra'];

  let curTier = 'free';
  const raw = localStorage.getItem(USERS_REGISTRY_KEY);
  if (raw) {
    try {
      const reg = JSON.parse(raw);
      const found = reg.find((u) => (u.email || '').toLowerCase().trim() === normalized);
      if (found?.tier) curTier = found.tier;
    } catch (e) {}
  }

  const curIdx = tiers.indexOf(curTier);
  if (curIdx >= tiers.length - 1) {
    return { success: false, message: 'Tài khoản đã ở cấp bậc cao nhất (Ultra VIP)!' };
  }
  const nextTier = tiers[curIdx + 1];

  return adminUpdateUserStatusAndTier({ email: normalized, tier: nextTier });
}

// Quick helper: Demote user tier by 1 level (Giáng 1 cấp bậc)
export async function demoteUserTier(email) {
  if (!email) return { success: false };
  const normalized = email.toLowerCase().trim();
  const tiers = ['free', 'plus', 'pro', 'ultra'];

  let curTier = 'free';
  const raw = localStorage.getItem(USERS_REGISTRY_KEY);
  if (raw) {
    try {
      const reg = JSON.parse(raw);
      const found = reg.find((u) => (u.email || '').toLowerCase().trim() === normalized);
      if (found?.tier) curTier = found.tier;
    } catch (e) {}
  }

  const curIdx = tiers.indexOf(curTier);
  if (curIdx <= 0) {
    return { success: false, message: 'Tài khoản đã ở cấp bậc thấp nhất (Free)!' };
  }
  const prevTier = tiers[curIdx - 1];

  return adminUpdateUserStatusAndTier({ email: normalized, tier: prevTier });
}

// Quick helper: Toggle account suspension / locked status (Khóa / Mở khóa tài khoản)
export async function toggleUserSuspension(email) {
  if (!email) return { success: false };
  const normalized = email.toLowerCase().trim();
  if (normalized === 'thaitraicau123@gmail.com') {
    return { success: false, message: 'Không thể khóa tài khoản Quản trị viên tối cao!' };
  }

  let curStatus = 'active';
  const raw = localStorage.getItem(USERS_REGISTRY_KEY);
  if (raw) {
    try {
      const reg = JSON.parse(raw);
      const found = reg.find((u) => (u.email || '').toLowerCase().trim() === normalized);
      if (found?.status) curStatus = found.status;
    } catch (e) {}
  }

  const nextStatus = curStatus === 'suspended' ? 'active' : 'suspended';
  return adminUpdateUserStatusAndTier({ email: normalized, status: nextStatus });
}

// Register a user profile into the registry
export function registerUserInRegistry(userProfile) {
  if (!userProfile || !userProfile.email || isTestEmail(userProfile.email)) return;
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    const registry = raw ? JSON.parse(raw) : [];
    const normalized = userProfile.email.toLowerCase().trim();
    const existingIndex = registry.findIndex((u) => u.email.toLowerCase().trim() === normalized);

    const record = {
      email: userProfile.email,
      displayName: userProfile.displayName || userProfile.email.split('@')[0],
      photoURL: userProfile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.email}`,
      tier: userProfile.tier || 'free',
      role: userProfile.role || 'student',
      status: userProfile.status || 'active',
      lastActive: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      registry[existingIndex] = { ...registry[existingIndex], ...record };
    } else {
      registry.push(record);
    }

    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));
  } catch (e) {}
}

// Helper to compute user balance and stats consistently
function computeUsersBalancesAndStats(usersMap, allTxs) {
  const result = [];

  for (const [emailKey, u] of usersMap.entries()) {
    const userTxs = allTxs.filter((t) => (t.userEmail || '').toLowerCase().trim() === emailKey);

    let totalDepositedXu = 0;
    let totalWithdrawnXu = 0;
    const pendingDeposits = [];
    const pendingWithdrawals = [];

    for (const t of userTxs) {
      const amt = Number(t.xuAmount) || 0;
      if (t.type === 'deposit') {
        if (t.status === 'approved') {
          totalDepositedXu += amt;
        } else if (t.status === 'pending') {
          pendingDeposits.push(t);
        }
      } else if (t.type === 'withdraw') {
        if (t.status === 'approved') {
          totalWithdrawnXu += amt;
        } else if (t.status === 'pending') {
          pendingWithdrawals.push(t);
        }
      }
    }

    const currentBalance = getUserBalanceForEmail(emailKey);

    result.push({
      ...u,
      role: u.role || 'student',
      tier: u.tier || 'free',
      status: u.status || 'active',
      currentBalance,
      totalDepositedXu,
      totalWithdrawnXu,
      pendingDeposits,
      pendingWithdrawals,
      hasPending: pendingDeposits.length > 0 || pendingWithdrawals.length > 0,
      transactionCount: userTxs.length,
      userTxs
    });
  }

  // Sort: users with pending requests first, then by balance desc
  return result.sort((a, b) => {
    if (a.hasPending && !b.hasPending) return -1;
    if (!a.hasPending && b.hasPending) return 1;
    return b.currentBalance - a.currentBalance;
  });
}

// Get all users from local cache/registry synchronously for instantaneous UI rendering
export function getLocalUsersWithBalances() {
  const usersMap = new Map();

  // 1. Purge any leftover test accounts
  purgeAllTestAccounts();

  // 2. Ensure Primary Super Admin always exists
  usersMap.set('thaitraicau123@gmail.com', {
    email: 'thaitraicau123@gmail.com',
    displayName: 'Thái Trai Cầu (Super Admin)',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'admin',
    tier: 'ultra',
    status: 'verified',
    initialBalance: 9999,
    phone: '0986019623',
    lastActive: new Date().toISOString()
  });

  // 3. Local Registry (genuine users)
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    const registry = raw ? JSON.parse(raw) : [];
    for (const u of registry) {
      if (u?.email && !isTestEmail(u.email)) {
        const key = u.email.toLowerCase().trim();
        usersMap.set(key, { ...(usersMap.get(key) || {}), ...u, status: u.status || 'active' });
      }
    }
  } catch (e) {}

  // 4. Current Logged In User
  const cur = getCurrentUser();
  if (cur?.email && !isTestEmail(cur.email)) {
    const key = cur.email.toLowerCase().trim();
    usersMap.set(key, {
      ...(usersMap.get(key) || {}),
      email: cur.email,
      displayName: cur.displayName || cur.email.split('@')[0],
      photoURL: cur.photoURL,
      tier: cur.tier || (usersMap.get(key)?.tier) || 'free',
      role: cur.role || (usersMap.get(key)?.role) || 'student',
      status: cur.status || (usersMap.get(key)?.status) || 'active',
      lastActive: new Date().toISOString(),
      isCurrentDeviceUser: true
    });
  }

  // 5. Discover from transactions
  const allTxs = getTransactions();
  for (const tx of allTxs) {
    if (tx?.userEmail && !isTestEmail(tx.userEmail)) {
      const key = tx.userEmail.toLowerCase().trim();
      if (!usersMap.has(key)) {
        usersMap.set(key, {
          email: tx.userEmail,
          displayName: tx.userEmail.split('@')[0],
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tx.userEmail}`,
          role: 'student',
          tier: 'free',
          status: 'active',
          lastActive: tx.createdAt || new Date().toISOString()
        });
      }
    }
  }

  return computeUsersBalancesAndStats(usersMap, allTxs);
}

// Get all users with comprehensive balance details, pending actions, and stats (including async Firestore users)
export async function getAllUsersWithBalances() {
  const usersMap = new Map();

  // 1. Purge any leftover test accounts
  purgeAllTestAccounts();

  // 2. Ensure Primary Super Admin always exists
  usersMap.set('thaitraicau123@gmail.com', {
    email: 'thaitraicau123@gmail.com',
    displayName: 'Thái Trai Cầu (Super Admin)',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'admin',
    tier: 'ultra',
    status: 'verified',
    initialBalance: 9999,
    phone: '0986019623',
    lastActive: new Date().toISOString()
  });

  // 3. Local Registry (genuine users)
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    const registry = raw ? JSON.parse(raw) : [];
    for (const u of registry) {
      if (u?.email && !isTestEmail(u.email)) {
        const key = u.email.toLowerCase().trim();
        usersMap.set(key, { ...(usersMap.get(key) || {}), ...u, status: u.status || 'active' });
      }
    }
  } catch (e) {}

  // 4. Firestore Users (genuine users)
  try {
    const fsUsers = await fetchAllFirestoreUsers();
    for (const fu of fsUsers) {
      if (fu?.email && !isTestEmail(fu.email)) {
        const key = fu.email.toLowerCase().trim();
        usersMap.set(key, { ...(usersMap.get(key) || {}), ...fu, status: fu.status || 'active' });
      }
    }
  } catch (e) {}

  // 5. Current Logged In User
  const cur = getCurrentUser();
  if (cur?.email && !isTestEmail(cur.email)) {
    const key = cur.email.toLowerCase().trim();
    usersMap.set(key, {
      ...(usersMap.get(key) || {}),
      email: cur.email,
      displayName: cur.displayName || cur.email.split('@')[0],
      photoURL: cur.photoURL,
      tier: cur.tier || (usersMap.get(key)?.tier) || 'free',
      role: cur.role || (usersMap.get(key)?.role) || 'student',
      status: cur.status || (usersMap.get(key)?.status) || 'active',
      lastActive: new Date().toISOString(),
      isCurrentDeviceUser: true
    });
  }

  // 6. Discover from transactions (genuine transactions only)
  const allTxs = getTransactions();
  for (const tx of allTxs) {
    if (tx?.userEmail && !isTestEmail(tx.userEmail)) {
      const key = tx.userEmail.toLowerCase().trim();
      if (!usersMap.has(key)) {
        usersMap.set(key, {
          email: tx.userEmail,
          displayName: tx.userEmail.split('@')[0],
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tx.userEmail}`,
          role: 'student',
          tier: 'free',
          status: 'active',
          lastActive: tx.createdAt || new Date().toISOString()
        });
      }
    }
  }

  return computeUsersBalancesAndStats(usersMap, allTxs);
}

// Admin directly deposits or withdraws coins for any user
export async function adminDirectAdjustUserBalance({ email, amountChange, type = 'deposit', reason = 'Admin duyệt nạp' }) {
  if (!email || !amountChange) return { success: false, message: 'Dữ liệu không hợp lệ' };
  const absAmount = Math.abs(Number(amountChange));
  if (isNaN(absAmount) || absAmount <= 0) return { success: false, message: 'Số Xu phải lớn hơn 0' };

  const normalized = email.toLowerCase().trim();
  const currentBal = getUserBalanceForEmail(normalized);
  let newBalance = currentBal;

  if (type === 'deposit') {
    newBalance = currentBal + absAmount;
  } else {
    if (currentBal < absAmount) {
      return { success: false, message: `Số dư học viên chỉ còn ${currentBal} Xu, không đủ để trừ ${absAmount} Xu!` };
    }
    newBalance = Math.max(0, currentBal - absAmount);
  }

  // 1. Update override
  setUserBalanceOverride(normalized, newBalance);

  // 2. Create transaction record
  const code = (type === 'deposit' ? 'NAP_ADMIN_' : 'RUT_ADMIN_') + Math.floor(100000 + Math.random() * 900000);
  const tx = {
    id: code,
    type: type === 'deposit' ? 'deposit' : 'withdraw',
    status: 'approved',
    xuAmount: absAmount,
    amountVnd: absAmount * COIN_RATE_VND,
    userEmail: email,
    createdAt: new Date().toISOString(),
    reviewedAt: new Date().toISOString(),
    details: {
      method: 'Admin Trực Tiếp Duyệt',
      note: reason || (type === 'deposit' ? 'Admin cộng Xu trực tiếp' : 'Admin trừ Xu trực tiếp')
    }
  };

  const list = getTransactions();
  list.unshift(tx);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));

  // 3. Dual-write to Firebase Firestore
  saveTransactionToFirestore(tx);

  // 4. Broadcast to Cloud Relay
  await broadcastTransactionToCloud('status_update', {
    txId: code,
    status: 'approved',
    reviewedAt: tx.reviewedAt,
    userEmail: email,
    xuAmount: absAmount,
    type: tx.type
  });

  return { success: true, newBalance, tx };
}


// Request Native Browser Desktop Notification Permission
export async function requestBrowserNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const res = await Notification.requestPermission();
    return res;
  } catch (e) {
    return 'denied';
  }
}

// Send Native Browser Desktop Notification (Windows / Mac / Android)
export function sendBrowserDesktopNotification({ title, body, icon, tag }) {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }
  try {
    new Notification(title || '[OnThiHub] Thông Báo Mới', {
      body: body || '',
      icon: icon || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      tag: tag || String(Date.now()),
      requireInteraction: true
    });
    return true;
  } catch (e) {
    return false;
  }
}
