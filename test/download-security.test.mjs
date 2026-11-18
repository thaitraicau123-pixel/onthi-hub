import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {
  DOWNLOAD_CATALOG,
  sanitizeDownloadFileName,
  resolveDownloadAsset,
  isAdminEmail,
  verifyDownloadEntitlement
} from '../lib/downloads.js';

test('sanitizeDownloadFileName blocks path traversal, unknown files, and null bytes', () => {
  assert.equal(sanitizeDownloadFileName('../.env'), null);
  assert.equal(sanitizeDownloadFileName('downloads/../../server.js'), null);
  assert.equal(sanitizeDownloadFileName('..\\..\\package.json'), null);
  assert.equal(sanitizeDownloadFileName('Metropolis_1998_Source_Starter.zip\0.txt'), null);
  assert.equal(sanitizeDownloadFileName('unknown-secret.zip'), null);
  assert.equal(sanitizeDownloadFileName(''), null);
});

test('sanitizeDownloadFileName accepts allow-listed files with or without /downloads/ prefix', () => {
  assert.equal(
    sanitizeDownloadFileName('/downloads/Metropolis_1998_Source_Starter.zip'),
    'Metropolis_1998_Source_Starter.zip'
  );
  assert.equal(
    sanitizeDownloadFileName('downloads/diet-soda-3d-landing.html'),
    'diet-soda-3d-landing.html'
  );
  assert.equal(sanitizeDownloadFileName('/MASTER_PROMPTS.md'), 'MASTER_PROMPTS.md');
  assert.equal(sanitizeDownloadFileName('MASTER_PROMPTS.md'), 'MASTER_PROMPTS.md');
  assert.ok(Object.keys(DOWNLOAD_CATALOG).length >= 20);
});

test('resolveDownloadAsset resolves safe absolute path inside workspace root', () => {
  const rootDir = '/app/applet';
  const resolved = resolveDownloadAsset(rootDir, 'downloads/Metropolis_1998_Source_Starter.zip');
  assert.ok(resolved);
  assert.equal(resolved.fileName, 'Metropolis_1998_Source_Starter.zip');
  assert.equal(resolved.absPath, path.resolve(rootDir, 'downloads/Metropolis_1998_Source_Starter.zip'));
  assert.equal(resolved.contentType, 'application/zip');

  assert.equal(resolveDownloadAsset(rootDir, '../server.js'), null);
});

test('isAdminEmail identifies owner and env admin list safely', () => {
  assert.equal(isAdminEmail('thaitraicau123@gmail.com'), true);
  assert.equal(isAdminEmail('THAItraicau123@GMAIL.com '), true);
  assert.equal(isAdminEmail('member@example.com'), false);
  assert.equal(isAdminEmail('staff@studio.vn', 'ops@studio.vn, staff@studio.vn'), true);
  assert.equal(isAdminEmail('', 'staff@studio.vn'), false);
});

test('verifyDownloadEntitlement enforces auth, admin bypass, purchasedIds, and completed orders', () => {
  // Missing auth -> 401
  const noAuth = verifyDownloadEntitlement({
    email: '',
    fileName: 'Metropolis_1998_Source_Starter.zip'
  });
  assert.equal(noAuth.allowed, false);
  assert.equal(noAuth.status, 401);

  // Unknown file -> 404
  const notFound = verifyDownloadEntitlement({
    email: 'buyer@test.vn',
    fileName: 'secret.zip'
  });
  assert.equal(notFound.allowed, false);
  assert.equal(notFound.status, 404);

  // Logged-in user without purchase -> 403
  const unpaid = verifyDownloadEntitlement({
    email: 'buyer@test.vn',
    fileName: 'Metropolis_1998_Source_Starter.zip',
    orders: [
      { id: '#ORD-1', userEmail: 'buyer@test.vn', productId: 'source-metropolis-1998-city-builder', status: 'pending' }
    ]
  });
  assert.equal(unpaid.allowed, false);
  assert.equal(unpaid.status, 403);

  // Logged-in user with completed order for another product -> 403
  const wrongProduct = verifyDownloadEntitlement({
    email: 'buyer@test.vn',
    fileName: 'Metropolis_1998_Source_Starter.zip',
    orders: [
      { id: '#ORD-2', userEmail: 'buyer@test.vn', productId: 'template-diet-soda-3d-landing', status: 'completed' }
    ]
  });
  assert.equal(wrongProduct.allowed, false);
  assert.equal(wrongProduct.status, 403);

  // Logged-in user with completed order for Metropolis -> 200
  const paid = verifyDownloadEntitlement({
    email: 'buyer@test.vn',
    fileName: 'Metropolis_1998_Source_Starter.zip',
    orders: [
      { id: '#ORD-3', userEmail: 'buyer@test.vn', productId: 'source-metropolis-1998-city-builder', status: 'completed' }
    ]
  });
  assert.equal(paid.allowed, true);
  assert.equal(paid.status, 200);

  // Bundle entitlement: skill-combo-allinone unlocks Vault + MASTER_PROMPTS.md
  const bundleVault = verifyDownloadEntitlement({
    email: 'bundle@test.vn',
    fileName: 'BuiThai_AI_AllInOne_ZeroSetup_Vault.zip',
    purchasedIds: ['skill-combo-allinone']
  });
  assert.equal(bundleVault.allowed, true);
  assert.equal(bundleVault.status, 200);

  const bundleMasterMd = verifyDownloadEntitlement({
    email: 'bundle@test.vn',
    fileName: 'MASTER_PROMPTS.md',
    orders: [
      { id: '#ORD-4', userEmail: 'bundle@test.vn', status: 'completed', items: [{ id: 'skill-combo-allinone' }] }
    ]
  });
  assert.equal(bundleMasterMd.allowed, true);
  assert.equal(bundleMasterMd.status, 200);

  // Admin override -> 200
  const admin = verifyDownloadEntitlement({
    email: 'thaitraicau123@gmail.com',
    isAdmin: true,
    fileName: 'Metropolis_1998_Source_Starter.zip'
  });
  assert.equal(admin.allowed, true);
  assert.equal(admin.status, 200);
});
