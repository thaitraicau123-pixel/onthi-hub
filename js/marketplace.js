/**
 * js/marketplace.js
 * Browser runtime domain module for Multi-Vendor Creator Marketplace (80/20 split),
 * Real 25% CTV Affiliate Program, Bank Withdrawals, and Admin Moderation.
 * Exposes window.ShopVietMarketplace and maintains exact parity with lib/marketplace.js.
 */
(function (root) {
  'use strict';

  var PLATFORM_FEE_RATE = 0.20;
  var SELLER_SHARE_RATE = 0.80;
  var CTV_COMMISSION_RATE = 0.25;
  var MIN_WITHDRAWAL_XU = 20000;
  var MAX_LISTING_PRICE_XU = 5000000;

  var ALLOWED_CATEGORIES = {
    'Tool & n8n': true,
    'Mã nguồn': true,
    'Template web': true,
    'Skill': true,
    'Prompt Video': true,
    'Sàn Creator': true
  };

  function cleanEmailAddress(raw) {
    return String(raw || '').trim().toLowerCase();
  }

  function normalizeRefCode(raw) {
    var cleaned = String(raw || '')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, '');
    if (!cleaned || cleaned.length < 3 || cleaned.length > 32) return '';
    return cleaned;
  }

  function buildRefCodeForEmail(email) {
    var clean = cleanEmailAddress(email);
    if (!clean) return 'BTSTUDIO';
    var prefix = clean
      .split('@')[0]
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 8);
    return prefix ? ('BT' + prefix) : 'BTSTUDIO';
  }

  function isSafeHttpUrl(rawUrl, allowRelative) {
    var str = String(rawUrl || '').trim();
    if (!str) return false;
    var lower = str.toLowerCase();
    if (lower.indexOf('javascript:') === 0 || lower.indexOf('data:') === 0 || lower.indexOf('vbscript:') === 0) {
      return false;
    }
    if (allowRelative && str.charAt(0) === '/') {
      return str.indexOf('//') !== 0;
    }
    try {
      var parsed = new URL(str);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch (e) {
      return false;
    }
  }

  function calculateSaleDistribution(opts) {
    opts = opts || {};
    var grossXu = Math.max(0, Math.round(Number(opts.saleAmountXu) || 0));
    var cleanBuyer = cleanEmailAddress(opts.buyerEmail);
    var cleanSeller = cleanEmailAddress(opts.sellerEmail);
    var normRefCode = normalizeRefCode(opts.referrerCode);
    var cleanRefEmail = cleanEmailAddress(opts.referrerEmail);
    var buyerRefCode = cleanBuyer ? buildRefCodeForEmail(cleanBuyer) : '';
    var isCommunityListing = Boolean(opts.isCommunityListing);

    var sellerShareXu = 0;
    var platformFeeXu = grossXu;
    var selfPurchaseBlocked = false;

    if (grossXu > 0 && isCommunityListing && cleanSeller) {
      if (cleanBuyer && cleanBuyer === cleanSeller) {
        selfPurchaseBlocked = true;
        sellerShareXu = 0;
        platformFeeXu = grossXu;
      } else {
        sellerShareXu = Math.round(grossXu * SELLER_SHARE_RATE);
        platformFeeXu = Math.max(0, grossXu - sellerShareXu);
      }
    }

    var ctvCommissionXu = 0;
    var selfReferralBlocked = false;

    if (grossXu > 0 && normRefCode) {
      var isSameByEmail = Boolean(cleanBuyer && cleanRefEmail && cleanBuyer === cleanRefEmail);
      var isSameByCode = Boolean(buyerRefCode && buyerRefCode === normRefCode);
      if (isSameByEmail || isSameByCode) {
        selfReferralBlocked = true;
        ctvCommissionXu = 0;
      } else {
        ctvCommissionXu = Math.round(grossXu * CTV_COMMISSION_RATE);
      }
    }

    var netPlatformXu = Math.max(0, platformFeeXu - ctvCommissionXu);

    return {
      grossXu: grossXu,
      sellerShareXu: sellerShareXu,
      platformFeeXu: platformFeeXu,
      ctvCommissionXu: ctvCommissionXu,
      netPlatformXu: netPlatformXu,
      selfPurchaseBlocked: selfPurchaseBlocked,
      selfReferralBlocked: selfReferralBlocked
    };
  }

  function validateListingSubmission(input) {
    input = input || {};
    var errors = [];
    var name = String(input.name || '').trim().replace(/\s+/g, ' ');
    var rawCategory = String(input.category || input.tag || 'Tool & n8n').trim();
    var category = ALLOWED_CATEGORIES[rawCategory] ? rawCategory : 'Tool & n8n';
    var price = Math.round(Number(input.price));
    var desc = String(input.desc || '').trim();
    var deliveryLink = String(input.deliveryLink || '').trim();
    var demoUrl = String(input.demoUrl || '').trim();
    var masterPrompt = String(input.masterPrompt || '').trim();
    var sellerEmail = cleanEmailAddress(input.sellerEmail);
    var sellerName = String(input.sellerName || '').trim() || (sellerEmail ? sellerEmail.split('@')[0] : 'Creator');

    if (!sellerEmail || sellerEmail.indexOf('@') === -1) {
      errors.push('Vui lòng đăng nhập tài khoản hợp lệ để đăng bán sản phẩm.');
    }
    if (name.length < 4 || name.length > 140) {
      errors.push('Tên sản phẩm phải từ 4 đến 140 ký tự.');
    }
    if (!Number.isFinite(price) || price < 0 || price > MAX_LISTING_PRICE_XU) {
      errors.push('Giá bán phải từ 0 đến ' + MAX_LISTING_PRICE_XU.toLocaleString('vi-VN') + ' Xu.');
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
      return { valid: false, errors: errors, listing: null };
    }

    var slugPart = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 32) || 'item';

    var id = String(input.id || '').trim() || ('creator-' + slugPart + '-' + Date.now().toString(36));
    var guideText = masterPrompt || ('Tài nguyên cộng đồng bởi ' + sellerName + '.\n\nLink bàn giao: ' + (deliveryLink || 'Xem đính kèm') + '\n\nMô tả & hướng dẫn: ' + desc);

    var listing = {
      id: id,
      name: name,
      tag: category,
      category: category,
      filterGroup: 'Sàn Creator',
      module: 'SÀN CREATOR · ' + sellerName,
      badge: price === 0 ? 'CREATOR · 0 XU' : 'CREATOR · 80/20',
      price: price,
      oldPrice: price > 0 ? Math.round((price * 1.4) / 1000) * 1000 : 0,
      stock: 999999,
      duration: 'Sở hữu vĩnh viễn',
      warranty: 'Kiểm duyệt Studio 80/20',
      rating: 5,
      soldCount: Math.max(0, Number(input.soldCount) || 0),
      imageUrl: isSafeHttpUrl(input.imageUrl, true) ? String(input.imageUrl).trim() : '/img/gemini-workspace-preview.svg',
      demoUrl: demoUrl || '',
      desc: desc,
      sellerEmail: sellerEmail,
      sellerName: sellerName,
      deliveryLink: deliveryLink,
      masterPrompt: guideText,
      isCommunityListing: true,
      status: 'pending',
      createdAt: input.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unlockedPayload: {
        fileName: id + '.md',
        deliveryLink: deliveryLink,
        downloadUrl: '',
        masterPrompt: guideText,
        skillContent: guideText,
        cheatSheet: [
          {
            title: '1. Link tải / Mã nguồn bàn giao từ Creator',
            template: deliveryLink || guideText,
            example: 'Tác giả: ' + sellerName
          }
        ]
      }
    };

    return { valid: true, errors: [], listing: listing };
  }

  function validateWithdrawalRequest(opts) {
    opts = opts || {};
    var errors = [];
    var cleanUser = cleanEmailAddress(opts.userEmail);
    var avail = Math.max(0, Math.round(Number(opts.availableXu) || 0));
    var amt = Math.round(Number(opts.amountXu) || 0);
    var cleanBank = String(opts.bankName || '').trim();
    var cleanAcc = String(opts.accountNumber || '').replace(/\s+/g, '').trim();
    var cleanHolder = String(opts.accountHolder || '').trim().toUpperCase();

    if (!cleanUser || cleanUser.indexOf('@') === -1) {
      errors.push('Cần đăng nhập tài khoản hợp lệ để gửi yêu cầu rút tiền.');
    }
    if (!Number.isFinite(amt) || amt < MIN_WITHDRAWAL_XU) {
      errors.push('Số Xu rút tối thiểu là ' + MIN_WITHDRAWAL_XU.toLocaleString('vi-VN') + ' Xu.');
    }
    if (amt > avail) {
      errors.push('Số dư khả dụng (' + avail.toLocaleString('vi-VN') + ' Xu) không đủ để rút ' + amt.toLocaleString('vi-VN') + ' Xu.');
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
      return { valid: false, errors: errors, withdrawal: null };
    }

    return {
      valid: true,
      errors: [],
      withdrawal: {
        id: 'WD-' + Date.now().toString().slice(-6) + Math.floor(10 + Math.random() * 89),
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

  function transitionListingStatus(listing, decision, adminEmail, note) {
    if (!listing || typeof listing !== 'object') {
      return { ok: false, error: 'listing_not_found' };
    }
    var cleanDecision = String(decision || '').trim().toLowerCase();
    if (cleanDecision !== 'approve' && cleanDecision !== 'approved' && cleanDecision !== 'reject' && cleanDecision !== 'rejected') {
      return { ok: false, error: 'invalid_decision' };
    }
    var nextStatus = cleanDecision.indexOf('approv') === 0 ? 'approved' : 'rejected';
    var nextListing = Object.assign({}, listing, {
      status: nextStatus,
      moderationNote: String(note || '').trim(),
      moderatedBy: cleanEmailAddress(adminEmail),
      moderatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return {
      ok: true,
      listing: nextListing
    };
  }

  function transitionWithdrawalStatus(withdrawal, decision, adminEmail, note) {
    if (!withdrawal || typeof withdrawal !== 'object') {
      return { ok: false, error: 'withdrawal_not_found', refundXu: 0 };
    }
    if (withdrawal.status !== 'pending') {
      return { ok: false, error: 'already_processed', refundXu: 0 };
    }
    var cleanDecision = String(decision || '').trim().toLowerCase();
    var isComplete = cleanDecision === 'complete' || cleanDecision === 'completed' || cleanDecision === 'approve' || cleanDecision === 'approved';
    var isReject = cleanDecision === 'reject' || cleanDecision === 'rejected';
    if (!isComplete && !isReject) {
      return { ok: false, error: 'invalid_decision', refundXu: 0 };
    }
    var nextStatus = isComplete ? 'completed' : 'rejected';
    var refundXu = isReject ? Math.max(0, Math.round(Number(withdrawal.amountXu) || 0)) : 0;
    var nextWithdrawal = Object.assign({}, withdrawal, {
      status: nextStatus,
      note: String(note || '').trim() || (isComplete ? 'Đã chuyển khoản thành công' : 'Admin từ chối & hoàn Xu vào ví'),
      processedBy: cleanEmailAddress(adminEmail),
      processedAt: new Date().toISOString()
    });
    return {
      ok: true,
      refundXu: refundXu,
      withdrawal: nextWithdrawal
    };
  }

  var api = {
    PLATFORM_FEE_RATE: PLATFORM_FEE_RATE,
    SELLER_SHARE_RATE: SELLER_SHARE_RATE,
    CTV_COMMISSION_RATE: CTV_COMMISSION_RATE,
    MIN_WITHDRAWAL_XU: MIN_WITHDRAWAL_XU,
    MAX_LISTING_PRICE_XU: MAX_LISTING_PRICE_XU,
    cleanEmailAddress: cleanEmailAddress,
    normalizeRefCode: normalizeRefCode,
    buildRefCodeForEmail: buildRefCodeForEmail,
    isSafeHttpUrl: isSafeHttpUrl,
    calculateSaleDistribution: calculateSaleDistribution,
    validateListingSubmission: validateListingSubmission,
    validateWithdrawalRequest: validateWithdrawalRequest,
    transitionListingStatus: transitionListingStatus,
    transitionWithdrawalStatus: transitionWithdrawalStatus
  };

  root.ShopVietMarketplace = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
