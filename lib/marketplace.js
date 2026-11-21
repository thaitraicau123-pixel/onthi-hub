/**
 * lib/marketplace.js
 * Pure domain logic for Multi-Vendor Creator Marketplace (80/20 split),
 * Real 25% CTV Affiliate Program, Bank Withdrawals, and Admin Moderation.
 * Zero DOM/network side effects — 100% deterministic & unit-testable.
 */

export const PLATFORM_FEE_RATE = 0.20;
export const SELLER_SHARE_RATE = 0.80;
export const CTV_COMMISSION_RATE = 0.25;
export const MIN_WITHDRAWAL_XU = 20000;
export const MAX_LISTING_PRICE_XU = 5000000;

export function cleanEmailAddress(raw) {
  return String(raw || '').trim().toLowerCase();
}

export function normalizeRefCode(raw) {
  const cleaned = String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '');
  if (!cleaned || cleaned.length < 3 || cleaned.length > 32) return '';
  return cleaned;
}

export function buildRefCodeForEmail(email) {
  const clean = cleanEmailAddress(email);
  if (!clean) return 'BTSTUDIO';
  const prefix = clean
    .split('@')[0]
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 8);
  return prefix ? `BT${prefix}` : 'BTSTUDIO';
}

export function isSafeHttpUrl(rawUrl, allowRelative = false) {
  const str = String(rawUrl || '').trim();
  if (!str) return false;
  const lower = str.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return false;
  }
  if (allowRelative && str.startsWith('/')) {
    return !str.startsWith('//');
  }
  try {
    const parsed = new URL(str);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Computes seller 80/20 split and 25% CTV referral commission with strict self-referral & self-buy guards.
 */
export function calculateSaleDistribution({
  saleAmountXu = 0,
  buyerEmail = '',
  sellerEmail = '',
  referrerCode = '',
  referrerEmail = '',
  isCommunityListing = false
} = {}) {
  const grossXu = Math.max(0, Math.round(Number(saleAmountXu) || 0));
  const cleanBuyer = cleanEmailAddress(buyerEmail);
  const cleanSeller = cleanEmailAddress(sellerEmail);
  const normRefCode = normalizeRefCode(referrerCode);
  const cleanRefEmail = cleanEmailAddress(referrerEmail);
  const buyerRefCode = cleanBuyer ? buildRefCodeForEmail(cleanBuyer) : '';

  let sellerShareXu = 0;
  let platformFeeXu = grossXu;
  let selfPurchaseBlocked = false;

  if (grossXu > 0 && isCommunityListing && cleanSeller) {
    if (cleanBuyer && cleanBuyer === cleanSeller) {
      // Self-buying own listing does not farm seller earnings
      selfPurchaseBlocked = true;
      sellerShareXu = 0;
      platformFeeXu = grossXu;
    } else {
      sellerShareXu = Math.round(grossXu * SELLER_SHARE_RATE);
      platformFeeXu = Math.max(0, grossXu - sellerShareXu);
    }
  }

  let ctvCommissionXu = 0;
  let selfReferralBlocked = false;

  if (grossXu > 0 && normRefCode) {
    const isSameByEmail = Boolean(cleanBuyer && cleanRefEmail && cleanBuyer === cleanRefEmail);
    const isSameByCode = Boolean(buyerRefCode && buyerRefCode === normRefCode);
    if (isSameByEmail || isSameByCode) {
      selfReferralBlocked = true;
      ctvCommissionXu = 0;
    } else {
      ctvCommissionXu = Math.round(grossXu * CTV_COMMISSION_RATE);
    }
  }

  const netPlatformXu = Math.max(0, platformFeeXu - ctvCommissionXu);

  return {
    grossXu,
    sellerShareXu,
    platformFeeXu,
    ctvCommissionXu,
    netPlatformXu,
    selfPurchaseBlocked,
    selfReferralBlocked
  };
}

const ALLOWED_CATEGORIES = new Set([
  'Tool & n8n',
  'Mã nguồn',
  'Template web',
  'Skill',
  'Prompt Video',
  'Sàn Creator'
]);

/**
 * Validates & normalizes a seller listing submission before queuing for admin moderation.
 */
export function validateListingSubmission(input = {}) {
  const errors = [];
  const name = String(input.name || '').trim().replace(/\s+/g, ' ');
  const rawCategory = String(input.category || input.tag || 'Tool & n8n').trim();
  const category = ALLOWED_CATEGORIES.has(rawCategory) ? rawCategory : 'Tool & n8n';
  const price = Math.round(Number(input.price));
  const desc = String(input.desc || '').trim();
  const deliveryLink = String(input.deliveryLink || '').trim();
  const demoUrl = String(input.demoUrl || '').trim();
  const masterPrompt = String(input.masterPrompt || '').trim();
  const sellerEmail = cleanEmailAddress(input.sellerEmail);
  const sellerName = String(input.sellerName || '').trim() || (sellerEmail ? sellerEmail.split('@')[0] : 'Creator');

  if (!sellerEmail || !sellerEmail.includes('@')) {
    errors.push('Vui lòng đăng nhập tài khoản hợp lệ để đăng bán sản phẩm.');
  }
  if (name.length < 4 || name.length > 140) {
    errors.push('Tên sản phẩm phải từ 4 đến 140 ký tự.');
  }
  if (!Number.isFinite(price) || price < 0 || price > MAX_LISTING_PRICE_XU) {
    errors.push(`Giá bán phải từ 0 đến ${MAX_LISTING_PRICE_XU.toLocaleString('vi-VN')} Xu.`);
  }
  if (desc.length < 10 || desc.length > 2000) {
    errors.push('Mô tả sản phẩm phải từ 10 đến 2.000 ký tự.');
  }
  if (!deliveryLink && masterPrompt.length < 10) {
    errors.push('Vui lòng cung cấp Link bàn giao (Google Drive / GitHub / ZIP) hoặc hướng dẫn chi tiết tối thiểu 10 ký tự.');
  }
  if (deliveryLink && !isSafeHttpUrl(deliveryLink, false)) {
    errors.push('Link bàn giao phải là URL http:// hoặc https:// hợp lệ.');
  }
  if (demoUrl && !isSafeHttpUrl(demoUrl, true)) {
    errors.push('Link Demo phải là URL hợp lệ.');
  }

  if (errors.length > 0) {
    return { valid: false, errors, listing: null };
  }

  const slugPart = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32) || 'item';

  const id = String(input.id || '').trim() || `creator-${slugPart}-${Date.now().toString(36)}`;
  const guideText = masterPrompt || `Tài nguyên cộng đồng bởi ${sellerName}.\n\nLink bàn giao: ${deliveryLink || 'Xem đính kèm'}\n\nMô tả & hướng dẫn: ${desc}`;

  const listing = {
    id,
    name,
    tag: category,
    category,
    filterGroup: 'Sàn Creator',
    module: `SÀN CREATOR · ${sellerName}`,
    badge: price === 0 ? 'CREATOR · 0 XU' : `CREATOR · 80/20`,
    price,
    oldPrice: price > 0 ? Math.round(price * 1.4 / 1000) * 1000 : 0,
    stock: 999999,
    duration: 'Sở hữu vĩnh viễn',
    warranty: 'Kiểm duyệt Studio 80/20',
    rating: 5,
    soldCount: Math.max(0, Number(input.soldCount) || 0),
    imageUrl: isSafeHttpUrl(input.imageUrl, true) ? String(input.imageUrl).trim() : '/img/gemini-workspace-preview.svg',
    demoUrl: demoUrl || '',
    desc,
    sellerEmail,
    sellerName,
    deliveryLink,
    masterPrompt: guideText,
    isCommunityListing: true,
    status: 'pending',
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    unlockedPayload: {
      fileName: `${id}.md`,
      deliveryLink,
      downloadUrl: '',
      masterPrompt: guideText,
      skillContent: guideText,
      cheatSheet: [
        {
          title: '1. Link tải / Mã nguồn bàn giao từ Creator',
          template: deliveryLink || guideText,
          example: `Tác giả: ${sellerName}`
        }
      ]
    }
  };

  return { valid: true, errors: [], listing };
}

/**
 * Validates a bank withdrawal request (min 20,000 Xu, sufficient available balance).
 */
export function validateWithdrawalRequest({
  userEmail = '',
  availableXu = 0,
  amountXu = 0,
  bankName = '',
  accountNumber = '',
  accountHolder = ''
} = {}) {
  const errors = [];
  const cleanUser = cleanEmailAddress(userEmail);
  const avail = Math.max(0, Math.round(Number(availableXu) || 0));
  const amt = Math.round(Number(amountXu) || 0);
  const cleanBank = String(bankName || '').trim();
  const cleanAcc = String(accountNumber || '').replace(/\s+/g, '').trim();
  const cleanHolder = String(accountHolder || '').trim().toUpperCase();

  if (!cleanUser || !cleanUser.includes('@')) {
    errors.push('Cần đăng nhập tài khoản hợp lệ để gửi yêu cầu rút tiền.');
  }
  if (!Number.isFinite(amt) || amt < MIN_WITHDRAWAL_XU) {
    errors.push(`Số Xu rút tối thiểu là ${MIN_WITHDRAWAL_XU.toLocaleString('vi-VN')} Xu.`);
  }
  if (amt > avail) {
    errors.push(`Số dư khả dụng (${avail.toLocaleString('vi-VN')} Xu) không đủ để rút ${amt.toLocaleString('vi-VN')} Xu.`);
  }
  if (cleanBank.length < 2) {
    errors.push('Vui lòng chọn hoặc nhập tên ngân hàng nhận tiền.');
  }
  if (!/^[a-zA-Z0-9]{5,24}$/.test(cleanAcc)) {
    errors.push('Số tài khoản ngân hàng phải từ 5 đến 24 ký tự hợp lệ.');
  }
  if (cleanHolder.length < 3) {
    errors.push('Vui lòng nhập họ tên chủ tài khoản ngân hàng.');
  }

  if (errors.length > 0) {
    return { valid: false, errors, withdrawal: null };
  }

  return {
    valid: true,
    errors: [],
    withdrawal: {
      id: `WD-${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 89)}`,
      userEmail: cleanUser,
      amountXu: amt,
      amountVnd: amt,
      bankName: cleanBank,
      accountNumber: cleanAcc,
      accountHolder: cleanHolder,
      status: 'pending',
      note: '',
      createdAt: new Date().toISOString()
    }
  };
}

export function transitionListingStatus(listing, decision, adminEmail = '', note = '') {
  if (!listing || typeof listing !== 'object') {
    return { ok: false, error: 'listing_not_found' };
  }
  const cleanDecision = String(decision || '').trim().toLowerCase();
  if (cleanDecision !== 'approve' && cleanDecision !== 'approved' && cleanDecision !== 'reject' && cleanDecision !== 'rejected') {
    return { ok: false, error: 'invalid_decision' };
  }
  const nextStatus = cleanDecision.startsWith('approv') ? 'approved' : 'rejected';
  return {
    ok: true,
    listing: {
      ...listing,
      status: nextStatus,
      moderationNote: String(note || '').trim(),
      moderatedBy: cleanEmailAddress(adminEmail),
      moderatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
}

export function transitionWithdrawalStatus(withdrawal, decision, adminEmail = '', note = '') {
  if (!withdrawal || typeof withdrawal !== 'object') {
    return { ok: false, error: 'withdrawal_not_found', refundXu: 0 };
  }
  if (withdrawal.status !== 'pending') {
    return { ok: false, error: 'already_processed', refundXu: 0 };
  }
  const cleanDecision = String(decision || '').trim().toLowerCase();
  const isComplete = cleanDecision === 'complete' || cleanDecision === 'completed' || cleanDecision === 'approve' || cleanDecision === 'approved';
  const isReject = cleanDecision === 'reject' || cleanDecision === 'rejected';
  if (!isComplete && !isReject) {
    return { ok: false, error: 'invalid_decision', refundXu: 0 };
  }
  const nextStatus = isComplete ? 'completed' : 'rejected';
  const refundXu = isReject ? Math.max(0, Math.round(Number(withdrawal.amountXu) || 0)) : 0;
  return {
    ok: true,
    refundXu,
    withdrawal: {
      ...withdrawal,
      status: nextStatus,
      note: String(note || '').trim() || (isComplete ? 'Đã chuyển khoản thành công' : 'Admin từ chối & hoàn Xu vào ví'),
      processedBy: cleanEmailAddress(adminEmail),
      processedAt: new Date().toISOString()
    }
  };
}
