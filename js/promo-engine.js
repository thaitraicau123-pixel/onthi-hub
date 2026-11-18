/**
 * js/promo-engine.js
 * Pure Voucher, Bundle Combo, Download Path & Workbench Code Highlighting helpers.
 * Loaded in browser as window.ShopVietPromo and evaluated cleanly in Node unit tests.
 */

(function (root) {
  'use strict';

  var VOUCHER_CATALOG = {
    OPENDESIGN20: {
      code: 'OPENDESIGN20',
      type: 'percent',
      value: 20,
      maxDiscount: 10000,
      minSubtotal: 9000,
      label: 'Giảm 20% Open-Design (tối đa 10.000 Xu)'
    },
    METRO15: {
      code: 'METRO15',
      type: 'fixed',
      value: 3000,
      minSubtotal: 15000,
      label: 'Giảm 3.000 Xu cho gói Source 15k+'
    },
    AI2026: {
      code: 'AI2026',
      type: 'fixed',
      value: 5000,
      minSubtotal: 15000,
      label: 'Giảm 5.000 Xu đơn từ 15.000 Xu'
    },
    HSSV: {
      code: 'HSSV',
      type: 'fixed',
      value: 2000,
      minSubtotal: 9000,
      label: 'Ưu đãi Sinh viên giảm 2.000 Xu'
    },
    THAIBUI: {
      code: 'THAIBUI',
      type: 'fixed',
      value: 1500,
      minSubtotal: 5000,
      label: 'Khách hàng thân thiết giảm 1.500 Xu'
    }
  };

  function normalizeCode(raw) {
    return String(raw || '')
      .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
      .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '')
      .trim()
      .toUpperCase();
  }

  function applyVoucher(params) {
    var opts = params || {};
    var subtotal = Math.max(0, Math.round(Number(opts.subtotal) || 0));
    var code = normalizeCode(opts.code);

    if (!code) {
      return { valid: false, code: '', discount: 0, finalTotal: subtotal, message: 'Vui lòng nhập mã giảm giá.' };
    }

    var rule = VOUCHER_CATALOG[code];
    if (!rule) {
      return { valid: false, code: code, discount: 0, finalTotal: subtotal, message: 'Mã ưu đãi "' + code + '" không tồn tại hoặc đã hết hạn.' };
    }

    if (subtotal < rule.minSubtotal) {
      return {
        valid: false,
        code: code,
        discount: 0,
        finalTotal: subtotal,
        message: 'Mã ' + code + ' áp dụng cho đơn từ ' + Number(rule.minSubtotal).toLocaleString('vi-VN') + ' Xu.'
      };
    }

    var discount = 0;
    if (rule.type === 'percent') {
      discount = Math.round(subtotal * (rule.value / 100));
      if (rule.maxDiscount && discount > rule.maxDiscount) {
        discount = rule.maxDiscount;
      }
    } else {
      discount = rule.value;
    }

    discount = Math.min(subtotal, Math.max(0, discount));
    var finalTotal = Math.max(0, subtotal - discount);

    return {
      valid: true,
      code: rule.code,
      discount: discount,
      finalTotal: finalTotal,
      label: rule.label,
      message: 'Áp dụng ' + rule.code + ' thành công (-' + Number(discount).toLocaleString('vi-VN') + ' Xu).'
    };
  }

  function calculateComboPricing(prices) {
    var arr = Array.isArray(prices) ? prices.map(function (n) { return Math.max(0, Math.round(Number(n) || 0)); }) : [];
    var count = arr.length;
    var subtotal = arr.reduce(function (sum, p) { return sum + p; }, 0);
    var discountPercent = count === 2 ? 20 : (count >= 3 ? 30 : 0);
    var discountAmount = Math.round(subtotal * (discountPercent / 100));
    var finalTotal = Math.max(0, subtotal - discountAmount);

    return {
      count: count,
      subtotal: subtotal,
      discountPercent: discountPercent,
      discountAmount: discountAmount,
      finalTotal: finalTotal
    };
  }

  function extractDownloadFileName(rawUrl) {
    var clean = String(rawUrl || '').trim().split('?')[0].split('#')[0];
    if (!clean) return '';
    var parts = clean.split('/');
    return parts[parts.length - 1] || '';
  }

  function buildProtectedDownloadUrl(rawUrl, productId) {
    var fileName = extractDownloadFileName(rawUrl);
    if (!fileName) return '';
    var qs = 'file=' + encodeURIComponent(fileName);
    if (productId) qs += '&productId=' + encodeURIComponent(String(productId).trim());
    return '/api/download?' + qs;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Lightweight single-pass syntax highlighter (line-numbered HTML, zero external deps).
   * Single-pass cursor prevents keyword/number regexes from matching generated <span> attributes.
   */
  var CODE_TOKEN_RE = /(\/\/.*$)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|\b(import|from|export|function|const|let|var|return|class|private|public|new|if|else|as|type|async|await)\b|\b(true|false|null|undefined|\d+)\b/g;

  function highlightLineSinglePass(line) {
    var out = '';
    var lastIdx = 0;
    CODE_TOKEN_RE.lastIndex = 0;
    var match;
    while ((match = CODE_TOKEN_RE.exec(line)) !== null) {
      if (match.index > lastIdx) {
        out += escapeHtml(line.slice(lastIdx, match.index));
      }
      var tokenHtml = escapeHtml(match[0]);
      if (match[1]) {
        out += '<span class="text-slate-500 italic">' + tokenHtml + '</span>';
      } else if (match[2]) {
        out += '<span class="text-emerald-300">' + tokenHtml + '</span>';
      } else if (match[3]) {
        out += '<span class="text-[#3B9EFF] font-medium">' + tokenHtml + '</span>';
      } else if (match[4]) {
        out += '<span class="text-amber-300">' + tokenHtml + '</span>';
      } else {
        out += tokenHtml;
      }
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < line.length) {
      out += escapeHtml(line.slice(lastIdx));
    }
    return out;
  }

  function highlightCodeLines(code) {
    var lines = String(code || '').split('\n');
    return lines.map(function (line, idx) {
      var highlighted = highlightLineSinglePass(line);
      var num = String(idx + 1).padStart(2, '0');
      return '<div class="flex gap-3 hover:bg-white/[0.03] px-1 rounded"><span class="select-none text-slate-600 tabular-nums shrink-0">' + num + '</span><span class="whitespace-pre">' + (highlighted || ' ') + '</span></div>';
    }).join('');
  }

  var api = {
    VOUCHER_CATALOG: VOUCHER_CATALOG,
    normalizeCode: normalizeCode,
    applyVoucher: applyVoucher,
    calculateComboPricing: calculateComboPricing,
    extractDownloadFileName: extractDownloadFileName,
    buildProtectedDownloadUrl: buildProtectedDownloadUrl,
    highlightCodeLines: highlightCodeLines
  };

  root.ShopVietPromo = api;
})(typeof window !== 'undefined' ? window : globalThis);
