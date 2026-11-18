/**
 * api/download.js
 * Protected file download endpoint requiring Firebase ID Token + completed order entitlement.
 */

import fs from 'node:fs';
import { verifyFirebaseIdToken } from '../lib/firebase-token.js';
import { getDocument, isConfigured, userDocId } from '../lib/firestore.js';
import { isAdminEmail, resolveDownloadAsset, verifyDownloadEntitlement } from '../lib/downloads.js';

function extractBearerToken(req) {
  const headers = (req && req.headers) || {};
  const raw = String(headers.authorization || headers.Authorization || '').trim();
  const matched = raw.match(/^Bearer\s+(.+)$/i);
  return matched ? matched[1].trim() : '';
}

function parseQuery(req) {
  if (req && req.query && Object.keys(req.query).length > 0) return req.query;
  try {
    const parsedUrl = new URL(req.url, `http://${(req.headers && req.headers.host) || 'localhost'}`);
    return Object.fromEntries(parsedUrl.searchParams.entries());
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const query = parseQuery(req);
  const rawFile = query.file || query.name || '';
  const productId = String(query.productId || '').trim();

  const asset = resolveDownloadAsset(process.cwd(), rawFile);
  if (!asset) {
    return res.status(404).json({ ok: false, code: 'file_not_found', message: 'Không tìm thấy tệp tải về hợp lệ.' });
  }

  const token = extractBearerToken(req);
  const identity = await verifyFirebaseIdToken(token).catch(() => null);
  if (!identity || !identity.email) {
    return res.status(401).json({
      ok: false,
      code: 'auth_required',
      message: 'Vui lòng đăng nhập tài khoản để xác thực quyền tải mã nguồn.'
    });
  }

  const email = String(identity.email).trim().toLowerCase();
  const isAdmin = isAdminEmail(email, process.env.ADMIN_EMAILS || '');

  const collectedOrders = [];
  const collectedPurchasedIds = [];

  if (Array.isArray(global._serverOrderCache)) {
    for (const o of global._serverOrderCache) {
      if (o) collectedOrders.push(o);
    }
  }

  if (!isAdmin && isConfigured()) {
    try {
      const userDoc = await getDocument(`users/${userDocId(email)}`);
      if (userDoc) {
        if (Array.isArray(userDoc.purchasedIds)) {
          collectedPurchasedIds.push(...userDoc.purchasedIds);
        }
        if (Array.isArray(userDoc.orders)) {
          collectedOrders.push(...userDoc.orders);
        } else if (typeof userDoc.ordersJson === 'string') {
          try {
            const parsed = JSON.parse(userDoc.ordersJson);
            if (Array.isArray(parsed)) collectedOrders.push(...parsed);
          } catch (_) {}
        }
      }
    } catch (_) {
      // Fall back safely to cached server orders if Firestore hits quota or is unreachable
    }
  }

  const decision = verifyDownloadEntitlement({
    email,
    isAdmin,
    fileName: asset.fileName,
    productId,
    orders: collectedOrders,
    purchasedIds: collectedPurchasedIds
  });

  if (!decision.allowed) {
    return res.status(decision.status).json({
      ok: false,
      code: decision.reason,
      message: 'Bạn chưa mở khóa sản phẩm này bằng Ví Xu trên tài khoản hiện tại.'
    });
  }

  if (!fs.existsSync(asset.absPath)) {
    return res.status(404).json({ ok: false, code: 'asset_missing', message: 'Tệp nguồn tạm thời chưa sẵn sàng trên máy chủ.' });
  }

  const stat = fs.statSync(asset.absPath);
  res.setHeader('Content-Type', asset.contentType);
  res.setHeader('Content-Length', String(stat.size));
  res.setHeader('Content-Disposition', `attachment; filename="${asset.fileName}"`);
  return fs.createReadStream(asset.absPath).pipe(res);
}
