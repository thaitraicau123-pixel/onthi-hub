// Wallet, Deposit/Withdraw transactions and Admin Notification Manager
import {
  getFirestoreDb,
  doc,
  setDoc,
  getDocs,
  collection,
  onSnapshot,
  updateDoc,
  query,
  orderBy
} from './firebaseConfig.js';

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
  const currentBalance = getWalletBalance();
  if (currentBalance < xuAmount) {
    return { success: false, message: 'Số dư ví Xu không đủ để thực hiện lệnh rút!' };
  }

  // Deduct coins immediately and put into escrow
  deductWalletCoins(xuAmount);

  const amountVnd = Number(xuAmount) * COIN_RATE_VND;
  const code = 'RUT' + Math.floor(100000 + Math.random() * 900000);
  const tx = {
    id: code,
    type: 'withdraw',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    xuAmount: Number(xuAmount),
    amountVnd,
    userEmail: userEmail || 'creator@onthihub.vn',
    userId: userId || null,
    createdAt: new Date().toISOString(),
    details: {
      bankName,
      accountNo,
      accountName,
      note: 'Chờ duyệt chuyển khoản ngân hàng'
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
    amountVnd,
    userEmail,
    details: tx.details
  });

  return { success: true, tx, emailData: notifData, notifData, zaloMessage: notifData.zaloMessage, zaloLink: ADMIN_ZALO_LINK };
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
