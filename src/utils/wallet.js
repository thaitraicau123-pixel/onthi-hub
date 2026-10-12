// Wallet, Deposit/Withdraw transactions and Admin Notification Manager
const WALLET_BALANCE_KEY = 'onthi_wallet_balance';
const TRANSACTIONS_KEY = 'onthi_wallet_transactions';
const ADMIN_NOTIFICATIONS_KEY = 'onthi_admin_notifications';

export const ADMIN_EMAIL = 'thaitraicau123@gmail.com';
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

// Send Notification to Gmail thaitraicau123@gmail.com
export function notifyAdminByEmail({ type, code, amountXu, amountVnd, userEmail, details }) {
  const timestamp = new Date().toLocaleString('vi-VN');
  const subject = `[ÔnThiHub] Yêu Cầu ${type === 'deposit' ? 'NẠP TIỀN' : 'RÚT TIỀN'} Mới - Mã: ${code}`;
  const body = `
Xin chào Admin (${ADMIN_EMAIL}),

Hệ thống ghi nhận một yêu cầu ${type === 'deposit' ? 'NẠP XU' : 'RÚT TIỀN VỀ NGÂN HÀNG'} mới cần DUYỆT CHAY:

• Mã giao dịch: ${code}
• Loại giao dịch: ${type === 'deposit' ? 'Nạp Xu (VietQR)' : 'Rút Tiền Về Ngân Hàng'}
• Số lượng Xu: ${amountXu} Xu (~${amountVnd.toLocaleString()} VNĐ)
• Email người dùng: ${userEmail || 'Chưa cung cấp'}
• Thời gian tạo: ${timestamp}
• Chi tiết: ${JSON.stringify(details, null, 2)}

Vui lòng đăng nhập vào Cửa Sổ Secret Admin trên web để bấm "Duyệt" hoặc "Từ chối" giao dịch này.
Trân trọng,
Hệ thống ÔnThiHub Automation
  `.trim();

  // Save to Admin Notifications store
  try {
    const raw = localStorage.getItem(ADMIN_NOTIFICATIONS_KEY);
    const notifs = raw ? JSON.parse(raw) : [];
    notifs.unshift({
      id: 'notif_' + Date.now(),
      targetEmail: ADMIN_EMAIL,
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
  return { subject, body, mailtoUrl };
}

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

  // Gửi thông báo đến Gmail thaitraicau123@gmail.com
  const emailData = notifyAdminByEmail({
    type: 'deposit',
    code,
    amountXu: xuAmount,
    amountVnd,
    userEmail,
    details: tx.details
  });

  return { tx, emailData };
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
      note: 'Duyệt chuyển khoản ngân hàng thủ công qua thaitraicau123@gmail.com'
    }
  };

  const list = getTransactions();
  list.unshift(tx);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));

  // Gửi thông báo đến Gmail thaitraicau123@gmail.com
  const emailData = notifyAdminByEmail({
    type: 'withdraw',
    code,
    amountXu: xuAmount,
    amountVnd,
    userEmail,
    details: tx.details
  });

  return { success: true, tx, emailData };
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
