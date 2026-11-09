/**
 * test/sepay-flow.test.mjs
 * Kiểm thử end-to-end (chạy local) cho luồng nạp Xu:
 *   create_intent (Firebase ID token) → webhook SePay (API Key) → cộng ví trên Firestore
 *
 * Dùng Firestore giả lập + cert Firebase giả lập, KHÔNG cần credentials thật.
 * Chạy: node test/sepay-flow.test.mjs
 */

import http from 'node:http';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const PROJECT = 'promtmmo';
const DB = 'default';
const DOC_NAME_PREFIX = `projects/${PROJECT}/databases/${DB}/documents/`;
const DOC_PREFIX = `/v1/${DOC_NAME_PREFIX}`;
const WEBHOOK_SECRET = 'test_webhook_secret';

/* ------------------------- Firestore giả lập ------------------------- */

const store = new Map();

function toFs(value) {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (typeof value === 'boolean') return { booleanValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFs) } };
  if (value && typeof value === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(value)) fields[k] = toFs(v);
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function toFsFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj || {})) fields[k] = toFs(v);
  return fields;
}

function fromFsValue(value) {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('booleanValue' in value) return Boolean(value.booleanValue);
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(fromFsValue);
  if ('mapValue' in value) return fromFsFields(value.mapValue.fields || {});
  return null;
}

function fromFsFields(fields) {
  const out = {};
  for (const [k, v] of Object.entries(fields || {})) out[k] = fromFsValue(v);
  return out;
}

function applyWrite(write) {
  const name = write.update && write.update.name;
  if (!name) return 'INVALID_WRITE';
  const path = name.replace(DOC_NAME_PREFIX, '');
  if (write.currentDocument && write.currentDocument.exists === false && store.has(path)) {
    return 'ALREADY_EXISTS';
  }
  const patch = fromFsFields((write.update && write.update.fields) || {});
  const mask = write.updateMask && write.updateMask.fieldPaths;
  let next;
  if (Array.isArray(mask) && mask.length > 0) {
    next = { ...(store.get(path) || {}) };
    for (const field of mask) if (field in patch) next[field] = patch[field];
  } else {
    next = { ...patch };
  }
  store.set(path, next);
  return null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  let body = null;
  try { body = raw ? JSON.parse(raw) : null; } catch { body = null; }

  const send = (code, payload) => {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
  };

  if (url.pathname === '/certs') return send(200, { 'test-kid': PUBLIC_KEY_PEM });
  if (url.pathname.endsWith('/documents:beginTransaction')) return send(200, { transaction: 'dHg=' });
  if (url.pathname.endsWith('/documents:commit')) {
    const writes = (body && body.writes) || [];
    const pending = [];
    for (const write of writes) {
      const name = write.update && write.update.name;
      const path = String(name).replace(DOC_NAME_PREFIX, '');
      if (write.currentDocument && write.currentDocument.exists === false && store.has(path)) {
        return send(409, { error: { code: 409, status: 'ALREADY_EXISTS', message: 'already exists' } });
      }
      pending.push(write);
    }
    for (const write of pending) {
      const failure = applyWrite(write);
      if (failure) return send(409, { error: { code: 409, status: failure } });
    }
    return send(200, { writeResults: writes.map(() => ({})) });
  }

  if (url.pathname.startsWith(DOC_PREFIX)) {
    const path = url.pathname.slice(DOC_PREFIX.length);

    if (req.method === 'GET') {
      if (!store.has(path)) return send(404, { error: { code: 404, status: 'NOT_FOUND' } });
      return send(200, {
        name: `${DOC_PREFIX}${path}`,
        fields: toFsFields(store.get(path))
      });
    }

    if (req.method === 'PATCH') {
      const mustNotExist = url.searchParams.get('currentDocument.exists') === 'false';
      if (mustNotExist && store.has(path)) {
        return send(409, { error: { code: 409, status: 'ALREADY_EXISTS' } });
      }
      const patch = fromFsFields((body && body.fields) || {});
      const mask = url.searchParams.getAll('updateMask.fieldPaths');
      const next = mask.length
        ? { ...(store.get(path) || {}) }
        : {};
      for (const field of (mask.length ? mask : Object.keys(patch))) {
        if (field in patch) next[field] = patch[field];
      }
      store.set(path, next);
      return send(200, { name: `${DOC_PREFIX}${path}`, fields: toFsFields(next) });
    }
  }

  return send(404, { error: { code: 404, status: 'NOT_FOUND', message: url.pathname } });
});

/* ------------------------- Firebase ID token giả ------------------------- */

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const PUBLIC_KEY_PEM = publicKey.export({ type: 'spki', format: 'pem' }).toString();

function signIdToken({ email = 'khachhang@test.vn', sub = 'uid-khach-1' } = {}) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', kid: 'test-kid', typ: 'JWT' })).toString('base64url');
  const claim = Buffer.from(JSON.stringify({
    aud: PROJECT,
    iss: `https://securetoken.google.com/${PROJECT}`,
    sub,
    email,
    email_verified: true,
    iat: now,
    exp: now + 3600,
    auth_time: now
  })).toString('base64url');
  const signature = crypto.sign('RSA-SHA256', Buffer.from(`${header}.${claim}`), privateKey).toString('base64url');
  return `${header}.${claim}.${signature}`;
}

/* ------------------------------ harness ------------------------------ */

function makeRes() {
  const out = { statusCode: 200, headers: {}, body: null };
  const res = {
    setHeader(key, value) { out.headers[key] = value; },
    status(code) { out.statusCode = code; return res; },
    json(payload) { out.body = payload; return res; },
    end() { return res; }
  };
  return { res, out };
}

async function invoke(handler, { method = 'POST', headers = {}, query = {}, body = null } = {}) {
  const { res, out } = makeRes();
  await handler({ method, headers, query, body }, res);
  return out;
}

const results = [];
function check(name, fn) {
  return Promise.resolve()
    .then(fn)
    .then(() => results.push({ name, ok: true }))
    .catch((err) => results.push({ name, ok: false, error: err.message }));
}

/* -------------------------------- main -------------------------------- */

async function main() {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  process.env.FIRESTORE_BASE_URL = `${base}/v1`;
  process.env.FIREBASE_CERT_URL = `${base}/certs`;
  process.env.FIREBASE_PROJECT_ID = PROJECT;
  process.env.SEPAY_WEBHOOK_SECRET = WEBHOOK_SECRET;
  process.env.DISABLE_NOTIFY = '1';
  process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({
    project_id: PROJECT,
    client_email: 'svc@test.local',
    private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
  });

  const { default: topupsHandler } = await import('../api/topups.js');
  const { default: sepayHandler } = await import('../api/sepay.js');

  let memo = '';
  const token = signIdToken();

  await check('create_intent không có token → 401', async () => {
    const r = await invoke(topupsHandler, { body: { action: 'create_intent', amount: 9000 } });
    assert.equal(r.statusCode, 401);
  });

  await check('create_intent với token hợp lệ → 200 + mã NAPXU', async () => {
    const r = await invoke(topupsHandler, {
      headers: { authorization: `Bearer ${token}` },
      body: { action: 'create_intent', amount: 9000, userName: 'Khách Test' }
    });
    assert.equal(r.statusCode, 200, JSON.stringify(r.body));
    assert.equal(r.body.ok, true);
    assert.match(r.body.memo, /^NAPXU[A-Z0-9]{8}$/);
    memo = r.body.memo;
    const intent = store.get(`topup_intents/${memo}`);
    assert.ok(intent, 'intent phải được lưu bền');
    assert.equal(intent.userEmail, 'khachhang@test.vn');
    assert.equal(intent.status, 'pending');
  });

  await check('update_intent đổi số tiền nhưng giữ nguyên mã', async () => {
    const r = await invoke(topupsHandler, {
      headers: { authorization: `Bearer ${token}` },
      body: { action: 'update_intent', memo, amount: 20000 }
    });
    assert.equal(r.statusCode, 200, JSON.stringify(r.body));
    assert.equal(r.body.memo, memo);
    assert.equal(store.get(`topup_intents/${memo}`).amount, 20000);
  });

  await check('không thể update_intent của người khác → 403', async () => {
    const other = signIdToken({ email: 'nguoikhac@test.vn', sub: 'uid-2' });
    const r = await invoke(topupsHandler, {
      headers: { authorization: `Bearer ${other}` },
      body: { action: 'update_intent', memo, amount: 5000 }
    });
    assert.equal(r.statusCode, 403);
  });

  await check('GET ?intent= trả trạng thái pending', async () => {
    const r = await invoke(topupsHandler, { method: 'GET', query: { intent: memo } });
    assert.equal(r.statusCode, 200);
    assert.equal(r.body.status, 'pending');
  });

  await check('webhook sai API Key → 401, chưa cộng Xu', async () => {
    const r = await invoke(sepayHandler, {
      headers: { authorization: 'Apikey sai_key' },
      body: { id: 'TX-1', transferType: 'in', transferAmount: 20000, content: `CK ${memo}` }
    });
    assert.equal(r.statusCode, 401);
    assert.equal(store.get('users/khachhang_test_vn'), undefined);
  });

  await check('webhook không có Authorization → 401 (không còn đường vòng accountNumber)', async () => {
    const r = await invoke(sepayHandler, {
      body: { id: 'TX-2', accountNumber: '0986019623', transferType: 'in', transferAmount: 20000, content: memo }
    });
    assert.equal(r.statusCode, 401);
  });

  await check('webhook đúng key + đúng mã → cộng đúng ví', async () => {
    const r = await invoke(sepayHandler, {
      headers: { authorization: `Apikey ${WEBHOOK_SECRET}` },
      body: {
        id: 'TX-2001',
        gateway: 'MBBank',
        accountNumber: '0986019623',
        transferType: 'in',
        transferAmount: 20000,
        content: `MBVCB NAPXU ${memo.slice(5)} ${memo} chuyen tien`,
        referenceCode: 'REF-2001'
      }
    });
    assert.equal(r.statusCode, 200, JSON.stringify(r.body));
    assert.equal(r.body.matched, true);
    assert.equal(r.body.credited, 20000);
    const user = store.get('users/khachhang_test_vn');
    assert.ok(user, 'users/{docId} phải tồn tại');
    assert.equal(user.balance, 20000);
    assert.equal(store.get(`topup_intents/${memo}`).status, 'completed');
    assert.equal(store.get('topups/TX-2001').status, 'completed');
  });

  await check('SePay gửi lại cùng giao dịch → không cộng lần 2', async () => {
    const r = await invoke(sepayHandler, {
      headers: { authorization: `Apikey ${WEBHOOK_SECRET}` },
      body: { id: 'TX-2001', transferType: 'in', transferAmount: 20000, content: memo }
    });
    assert.equal(r.statusCode, 200);
    assert.equal(r.body.duplicate, true);
    assert.equal(store.get('users/khachhang_test_vn').balance, 20000);
  });

  await check('webhook tiền vào nhưng không khớp mã → matched:false, không cộng', async () => {
    const r = await invoke(sepayHandler, {
      headers: { authorization: `Apikey ${WEBHOOK_SECRET}` },
      body: { id: 'TX-3001', transferType: 'in', transferAmount: 50000, content: 'chuyen tien khong ma' }
    });
    assert.equal(r.statusCode, 200);
    assert.equal(r.body.matched, false);
    assert.equal(store.get('users/khachhang_test_vn').balance, 20000);
    assert.ok(store.get('topup_unmatched/TX-3001'), 'phải ghi nhận giao dịch không khớp');
  });

  await check('webhook tiền ra bị bỏ qua', async () => {
    const r = await invoke(sepayHandler, {
      headers: { authorization: `Apikey ${WEBHOOK_SECRET}` },
      body: { id: 'TX-4001', transferType: 'out', transferAmount: 10000, content: memo }
    });
    assert.equal(r.statusCode, 200);
    assert.equal(r.body.ignored, true);
    assert.equal(store.get('users/khachhang_test_vn').balance, 20000);
  });

  await check('mã nạp đã completed → trạng thái trả về completed', async () => {
    const r = await invoke(topupsHandler, { method: 'GET', query: { intent: memo } });
    assert.equal(r.statusCode, 200);
    assert.equal(r.body.status, 'completed');
  });

  // ------- Các action quản trị phải xác thực (lỗ hổng đã bị bot khai thác) -------
  await check('direct_credit không có token → 401, không ai tự cộng Xu được', async () => {
    const r = await invoke(topupsHandler, {
      body: { action: 'direct_credit', userEmail: 'attacker@test.vn', amount: 1000000 }
    });
    assert.equal(r.statusCode, 401, JSON.stringify(r.body));
    assert.equal(store.get('users/attacker_test_vn'), undefined);
  });

  await check('approve không có token → 401', async () => {
    const r = await invoke(topupsHandler, {
      body: { action: 'approve', topupId: 'TOPUP-FAKE-1', userEmail: 'attacker@test.vn', amount: 1000000 }
    });
    assert.equal(r.statusCode, 401, JSON.stringify(r.body));
  });

  await check('direct_credit với khách thường → 403', async () => {
    const normal = signIdToken({ email: 'nguoikhac@test.vn', sub: 'uid-2' });
    const r = await invoke(topupsHandler, {
      headers: { authorization: `Bearer ${normal}` },
      body: { action: 'direct_credit', userEmail: 'nguoikhac@test.vn', amount: 1000000 }
    });
    assert.equal(r.statusCode, 403, JSON.stringify(r.body));
  });

  await check('direct_credit với email trong ADMIN_EMAILS → 200', async () => {
    process.env.ADMIN_EMAILS = 'admin@test.vn';
    const admin = signIdToken({ email: 'admin@test.vn', sub: 'uid-admin' });
    const r = await invoke(topupsHandler, {
      headers: { authorization: `Bearer ${admin}` },
      body: { action: 'direct_credit', userEmail: 'khachhang@test.vn', amount: 5000 }
    });
    assert.equal(r.statusCode, 200, JSON.stringify(r.body));
    assert.equal(r.body.ok, true);
    delete process.env.ADMIN_EMAILS;
  });

  server.close();

  const failed = results.filter((r) => !r.ok);
  for (const item of results) {
    console.log(`${item.ok ? 'PASS' : 'FAIL'}  ${item.name}${item.ok ? '' : `\n      → ${item.error}`}`);
  }
  console.log(`\n${results.length - failed.length}/${results.length} kiểm thử đạt.`);
  if (failed.length > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error('TEST HARNESS ERROR:', err);
  server.close();
  process.exitCode = 1;
});
