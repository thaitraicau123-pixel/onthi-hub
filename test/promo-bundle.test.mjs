import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const promoPath = path.resolve(process.cwd(), 'js/promo-engine.js');
const promoSrc = fs.readFileSync(promoPath, 'utf8');

function loadPromoEngine() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(promoSrc, sandbox);
  return sandbox.window.ShopVietPromo;
}

test('normalizeCode strips zero-width spaces and unicode dashes cleanly', () => {
  const promo = loadPromoEngine();
  assert.equal(promo.normalizeCode('  metro\u200B15 '), 'METRO15');
  assert.equal(promo.normalizeCode('open\u2014design20'), 'OPEN-DESIGN20');
  assert.equal(promo.normalizeCode('  opendesign20 '), 'OPENDESIGN20');
});

test('applyVoucher enforces catalog rules, minimum subtotals, and caps', () => {
  const promo = loadPromoEngine();

  // Empty & invalid
  assert.equal(promo.applyVoucher({ code: '', subtotal: 15000 }).valid, false);
  assert.equal(promo.applyVoucher({ code: 'FAKE999', subtotal: 15000 }).valid, false);

  // METRO15 rejected under 15.000 Xu, accepted at >= 15.000 Xu
  const metroTooLow = promo.applyVoucher({ code: 'metro15', subtotal: 9000 });
  assert.equal(metroTooLow.valid, false);
  assert.equal(metroTooLow.discount, 0);
  assert.equal(metroTooLow.finalTotal, 9000);

  const metroValid = promo.applyVoucher({ code: ' METRO15 ', subtotal: 15000 });
  assert.equal(metroValid.valid, true);
  assert.equal(metroValid.discount, 3000);
  assert.equal(metroValid.finalTotal, 12000);

  // OPENDESIGN20 gives 20% capped at 10.000 Xu
  const open15 = promo.applyVoucher({ code: 'OPENDESIGN20', subtotal: 15000 });
  assert.equal(open15.valid, true);
  assert.equal(open15.discount, 3000);
  assert.equal(open15.finalTotal, 12000);

  const openHigh = promo.applyVoucher({ code: 'OPENDESIGN20', subtotal: 100000 });
  assert.equal(openHigh.valid, true);
  assert.equal(openHigh.discount, 10000);
  assert.equal(openHigh.finalTotal, 90000);

  // HSSV works at 9.000 Xu and never goes negative
  const hssv = promo.applyVoucher({ code: 'hssv', subtotal: 9000 });
  assert.equal(hssv.valid, true);
  assert.equal(hssv.discount, 2000);
  assert.equal(hssv.finalTotal, 7000);
});

test('calculateComboPricing applies 0%, 20%, and 30% tiers accurately', () => {
  const promo = loadPromoEngine();

  const single = promo.calculateComboPricing([15000]);
  assert.equal(single.count, 1);
  assert.equal(single.discountPercent, 0);
  assert.equal(single.finalTotal, 15000);

  const duo = promo.calculateComboPricing([15000, 15000]);
  assert.equal(duo.count, 2);
  assert.equal(duo.subtotal, 30000);
  assert.equal(duo.discountPercent, 20);
  assert.equal(duo.discountAmount, 6000);
  assert.equal(duo.finalTotal, 24000);

  const trio = promo.calculateComboPricing([15000, 15000, 9000]);
  assert.equal(trio.count, 3);
  assert.equal(trio.subtotal, 39000);
  assert.equal(trio.discountPercent, 30);
  assert.equal(trio.discountAmount, 11700);
  assert.equal(trio.finalTotal, 27300);
});

test('buildProtectedDownloadUrl maps file paths into /api/download query strings', () => {
  const promo = loadPromoEngine();
  assert.equal(
    promo.buildProtectedDownloadUrl('downloads/Metropolis_1998_Source_Starter.zip?v=1', 'source-metropolis-1998-city-builder'),
    '/api/download?file=Metropolis_1998_Source_Starter.zip&productId=source-metropolis-1998-city-builder'
  );
  assert.equal(
    promo.buildProtectedDownloadUrl('/MASTER_PROMPTS.md', 'skill-combo-allinone'),
    '/api/download?file=MASTER_PROMPTS.md&productId=skill-combo-allinone'
  );
  assert.equal(promo.buildProtectedDownloadUrl(''), '');
});

test('highlightCodeLines outputs escaped line-numbered syntax spans without attribute leakage', () => {
  const promo = loadPromoEngine();
  const sample = "import { CityEngine } from './CityEngine';\nconst ok = true; // <script>";
  const html = promo.highlightCodeLines(sample);
  assert.ok(html.includes('01'));
  assert.ok(html.includes('02'));
  assert.ok(html.includes('text-[#3B9EFF]'));
  assert.ok(html.includes('text-emerald-300'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('from class='));
  const plain = html
    .replace(/<\/div>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
  assert.equal(plain, "01import { CityEngine } from './CityEngine';\n02const ok = true; // <script>");
});

test('formatPriceLabel formats 0 Xu as free and paid amounts in Xu', () => {
  const promo = loadPromoEngine();
  assert.equal(promo.formatPriceLabel(0), 'Miễn phí · 0 Xu');
  assert.equal(promo.formatPriceLabel(15000), '15.000 Xu');
  assert.equal(promo.formatPriceLabel(29000), '29.000 Xu');
});

test('buildShareProductUrl generates normalized product deep-link URLs', () => {
  const promo = loadPromoEngine();
  assert.equal(
    promo.buildShareProductUrl('https://promptmmo.store/', 'source-gemini-ai-workspace-kit'),
    'https://promptmmo.store/?product=source-gemini-ai-workspace-kit'
  );
  assert.equal(
    promo.buildShareProductUrl('', 'free-starter-opendesign-kit'),
    '/?product=free-starter-opendesign-kit'
  );
  assert.equal(promo.buildShareProductUrl('https://promptmmo.store', ''), 'https://promptmmo.store/');
});
