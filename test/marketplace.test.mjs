import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MIN_WITHDRAWAL_XU,
  normalizeRefCode,
  buildRefCodeForEmail,
  isSafeHttpUrl,
  calculateSaleDistribution,
  validateListingSubmission,
  validateWithdrawalRequest,
  transitionListingStatus,
  transitionWithdrawalStatus
} from '../lib/marketplace.js';

test('normalizeRefCode and buildRefCodeForEmail produce clean uppercase referral codes', () => {
  assert.equal(buildRefCodeForEmail('alice.dev@gmail.com'), 'BTALICEDEV');
  assert.equal(normalizeRefCode('  btalice123! '), 'BTALICE123');
  assert.equal(normalizeRefCode('ab'), '');
});

test('isSafeHttpUrl rejects javascript:, data:, and invalid URLs', () => {
  assert.equal(isSafeHttpUrl('https://github.com/buithai/starter'), true);
  assert.equal(isSafeHttpUrl('http://localhost:3000/demo'), true);
  assert.equal(isSafeHttpUrl('/demo/metropolis-1998/', true), true);
  assert.equal(isSafeHttpUrl('/demo/metropolis-1998/', false), false);
  assert.equal(isSafeHttpUrl('javascript:alert(1)', true), false);
  assert.equal(isSafeHttpUrl('data:text/html,<script>alert(1)</script>', true), false);
  assert.equal(isSafeHttpUrl('//evil.com/phish', true), false);
});

test('calculateSaleDistribution applies 80/20 seller split and 25% CTV commission while blocking self-referral and self-purchase', () => {
  // Community listing bought via third-party CTV link
  const dist = calculateSaleDistribution({
    saleAmountXu: 100000,
    buyerEmail: 'buyer@example.com',
    sellerEmail: 'creator@example.com',
    referrerCode: 'CTVFRIEND',
    referrerEmail: 'ctv@example.com',
    isCommunityListing: true
  });
  assert.equal(dist.sellerShareXu, 80000);
  assert.equal(dist.platformFeeXu, 20000);
  assert.equal(dist.ctvCommissionXu, 25000);
  assert.equal(dist.selfReferralBlocked, false);
  assert.equal(dist.selfPurchaseBlocked, false);

  // Self-referral blocked by matching email or derived code
  const selfRefByEmail = calculateSaleDistribution({
    saleAmountXu: 50000,
    buyerEmail: 'buyer@example.com',
    sellerEmail: 'creator@example.com',
    referrerCode: 'SOMEOTHERCODE',
    referrerEmail: 'buyer@example.com',
    isCommunityListing: true
  });
  assert.equal(selfRefByEmail.ctvCommissionXu, 0);
  assert.equal(selfRefByEmail.selfReferralBlocked, true);

  const selfRefByCode = calculateSaleDistribution({
    saleAmountXu: 50000,
    buyerEmail: 'alice@example.com',
    referrerCode: 'BTALICE',
    isCommunityListing: false
  });
  assert.equal(selfRefByCode.ctvCommissionXu, 0);
  assert.equal(selfRefByCode.selfReferralBlocked, true);

  // Self-purchase blocked for seller
  const selfBuy = calculateSaleDistribution({
    saleAmountXu: 40000,
    buyerEmail: 'creator@example.com',
    sellerEmail: 'creator@example.com',
    isCommunityListing: true
  });
  assert.equal(selfBuy.sellerShareXu, 0);
  assert.equal(selfBuy.selfPurchaseBlocked, true);
});

test('validateListingSubmission enforces URL safety, bounds, and defaults to pending status', () => {
  const invalid = validateListingSubmission({
    name: 'ab',
    price: -500,
    desc: 'short',
    deliveryLink: 'javascript:alert(1)',
    sellerEmail: 'seller@example.com'
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.length >= 3);

  const valid = validateListingSubmission({
    name: 'Kit Landing Page Spa Chốt Đơn Zalo',
    category: 'Template web',
    price: 39000,
    desc: 'Giao diện đặt lịch Spa responsive mượt mà kèm form gửi về Google Sheets.',
    deliveryLink: 'https://github.com/example/spa-landing',
    demoUrl: 'https://spa-demo.vercel.app',
    sellerEmail: 'seller@example.com',
    sellerName: 'Minh Dev'
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.listing.status, 'pending');
  assert.equal(valid.listing.filterGroup, 'Sàn Creator');
  assert.equal(valid.listing.isCommunityListing, true);
  assert.equal(valid.listing.unlockedPayload.deliveryLink, 'https://github.com/example/spa-landing');
});

test('validateWithdrawalRequest enforces MIN_WITHDRAWAL_XU and available balance', () => {
  const tooSmall = validateWithdrawalRequest({
    userEmail: 'seller@example.com',
    availableXu: 100000,
    amountXu: MIN_WITHDRAWAL_XU - 1000,
    bankName: 'MBBank',
    accountNumber: '0986019623',
    accountHolder: 'NGUYEN VAN A'
  });
  assert.equal(tooSmall.valid, false);

  const overdraft = validateWithdrawalRequest({
    userEmail: 'seller@example.com',
    availableXu: 25000,
    amountXu: 30000,
    bankName: 'MBBank',
    accountNumber: '0986019623',
    accountHolder: 'NGUYEN VAN A'
  });
  assert.equal(overdraft.valid, false);

  const valid = validateWithdrawalRequest({
    userEmail: 'seller@example.com',
    availableXu: 80000,
    amountXu: 50000,
    bankName: 'Techcombank',
    accountNumber: '190366889999',
    accountHolder: 'Nguyen Van A'
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.withdrawal.status, 'pending');
  assert.equal(valid.withdrawal.accountHolder, 'NGUYEN VAN A');
});

test('transitionListingStatus and transitionWithdrawalStatus enforce moderation state machine and refunds', () => {
  const pendingListing = { id: 'creator-test-1', status: 'pending', name: 'Test Kit' };
  const approved = transitionListingStatus(pendingListing, 'approve', 'thaitraicau123@gmail.com', 'OK');
  assert.equal(approved.ok, true);
  assert.equal(approved.listing.status, 'approved');

  const wd1 = { id: 'WD-101', status: 'pending', amountXu: 45000, userEmail: 'seller@example.com' };
  const completed = transitionWithdrawalStatus(wd1, 'complete', 'thaitraicau123@gmail.com', 'FT26123');
  assert.equal(completed.ok, true);
  assert.equal(completed.refundXu, 0);
  assert.equal(completed.withdrawal.status, 'completed');

  // Cannot re-process completed withdrawal
  const repeat = transitionWithdrawalStatus(completed.withdrawal, 'reject', 'thaitraicau123@gmail.com');
  assert.equal(repeat.ok, false);
  assert.equal(repeat.error, 'already_processed');

  const wd2 = { id: 'WD-102', status: 'pending', amountXu: 30000, userEmail: 'seller@example.com' };
  const rejected = transitionWithdrawalStatus(wd2, 'reject', 'thaitraicau123@gmail.com', 'Sai STK');
  assert.equal(rejected.ok, true);
  assert.equal(rejected.refundXu, 30000);
  assert.equal(rejected.withdrawal.status, 'rejected');
});

test('browser js/marketplace.js module stays in parity with lib/marketplace.js', async () => {
  const { readFileSync } = await import('node:fs');
  const vm = await import('node:vm');
  const code = readFileSync(new URL('../js/marketplace.js', import.meta.url), 'utf8');
  const sandbox = { window: {}, globalThis: null };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  const browserMp = sandbox.window.ShopVietMarketplace;

  assert.ok(browserMp, 'ShopVietMarketplace should attach to window');
  assert.equal(browserMp.MIN_WITHDRAWAL_XU, MIN_WITHDRAWAL_XU);
  assert.equal(browserMp.buildRefCodeForEmail('alice.dev@gmail.com'), 'BTALICEDEV');

  const distA = calculateSaleDistribution({
    saleAmountXu: 75000,
    buyerEmail: 'buyer@example.com',
    sellerEmail: 'creator@example.com',
    referrerCode: 'BTCTV',
    referrerEmail: 'ctv@example.com',
    isCommunityListing: true
  });
  const distB = browserMp.calculateSaleDistribution({
    saleAmountXu: 75000,
    buyerEmail: 'buyer@example.com',
    sellerEmail: 'creator@example.com',
    referrerCode: 'BTCTV',
    referrerEmail: 'ctv@example.com',
    isCommunityListing: true
  });
  assert.deepEqual({ ...distB }, distA);

  const wdRes = browserMp.validateWithdrawalRequest({
    userEmail: 'seller@example.com',
    availableXu: 50000,
    amountXu: 25000,
    bankName: 'MBBank',
    accountNumber: '0986019623',
    accountHolder: 'BUI THAI'
  });
  assert.equal(wdRes.valid, true);
  assert.equal(wdRes.withdrawal.amountXu, 25000);
});
