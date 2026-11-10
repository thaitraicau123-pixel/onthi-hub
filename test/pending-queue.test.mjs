/**
 * test/pending-queue.test.mjs
 * Kiểm thử hàng đợi khoản nạp chưa cộng được Xu, dùng Redis REST giả lập.
 * Chạy: node test/pending-queue.test.mjs
 */

import http from 'node:http';
import assert from 'node:assert/strict';

const store = new Map();
const index = [];

function handle(command) {
  const [op, ...args] = command;
  switch (String(op).toUpperCase()) {
    case 'SET': {
      const [key, value, flag] = args;
      if (String(flag || '').toUpperCase() === 'NX' && store.has(key)) return null;
      store.set(key, value);
      return 'OK';
    }
    case 'LPUSH': {
      const [key, value] = args;
      if (key !== 'sepay:pending:index') return 0;
      index.unshift(value);
      return index.length;
    }
    case 'LTRIM': {
      const [, start, stop] = args;
      const s = Number(start);
      const e = Number(stop);
      if (index.length > e + 1) index.splice(e + 1);
      return 'OK';
    }
    case 'LRANGE': {
      const [, start, stop] = args;
      const s = Number(start);
      const e = Number(stop);
      return index.slice(s, e + 1);
    }
    case 'MGET': {
      return args.map((key) => (store.has(key) ? store.get(key) : null));
    }
    case 'DEL': {
      return args.reduce((count, key) => (store.delete(key) ? count + 1 : count), 0);
    }
    case 'LREM': {
      const [, , value] = args;
      let removed = 0;
      for (let i = index.length - 1; i >= 0; i -= 1) {
        if (index[i] === value) { index.splice(i, 1); removed += 1; }
      }
      return removed;
    }
    default:
      throw new Error('unsupported command: ' + op);
  }
}

const server = http.createServer((req, res) => {
  if (req.headers.authorization !== 'Bearer test-token') {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'unauthorized' }));
    return;
  }
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    try {
      res.end(JSON.stringify({ result: handle(JSON.parse(body)) }));
    } catch (err) {
      res.end(JSON.stringify({ error: err.message }));
    }
  });
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;

process.env.UPSTASH_REDIS_REST_URL = `http://127.0.0.1:${port}`;
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';

const { isQueueConfigured, queuePendingCredit, listPendingCredits, dropPendingCredit } =
  await import('../lib/pending.js');

let passed = 0;
let failed = 0;

async function check(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log('PASS  ' + name);
  } catch (err) {
    failed += 1;
    console.log('FAIL  ' + name + ' :: ' + err.message);
  }
}

await check('nhận cấu hình Redis REST', () => {
  assert.equal(isQueueConfigured(), true);
});

await check('lưu khoản nạp chưa cộng được vào hàng đợi', async () => {
  const r = await queuePendingCredit({
    transactionId: 'TX-1001',
    userEmail: 'Khach@Example.com',
    amount: 2000,
    memo: 'NAPXUABCD1234',
    bank: 'MBBank'
  });
  assert.equal(r.queued, true);
});

await check('không lưu trùng cùng mã giao dịch', async () => {
  const r = await queuePendingCredit({ transactionId: 'TX-1001', userEmail: 'khach@example.com', amount: 2000 });
  assert.equal(r.queued, false);
  assert.equal(r.reason, 'already_queued');
});

await check('đọc lại đúng email, số Xu và mã nạp', async () => {
  const items = await listPendingCredits(10);
  assert.equal(items.length, 1);
  assert.equal(items[0].transactionId, 'TX-1001');
  assert.equal(items[0].userEmail, 'khach@example.com');
  assert.equal(items[0].amount, 2000);
  assert.equal(items[0].memo, 'NAPXUABCD1234');
});

await check('khoản mới nhất đứng đầu', async () => {
  await queuePendingCredit({ transactionId: 'TX-1002', userEmail: 'b@example.com', amount: 5000 });
  const items = await listPendingCredits(10);
  assert.equal(items[0].transactionId, 'TX-1002');
  assert.equal(items.length, 2);
});

await check('xoá khoản đã cộng xong khỏi hàng đợi', async () => {
  await dropPendingCredit('TX-1002');
  const items = await listPendingCredits(10);
  assert.equal(items.length, 1);
  assert.equal(items[0].transactionId, 'TX-1001');
});

await check('thiếu mã giao dịch thì không lưu', async () => {
  const r = await queuePendingCredit({ userEmail: 'c@example.com', amount: 1000 });
  assert.equal(r.queued, false);
  assert.equal(r.reason, 'missing_transaction_id');
});

server.close();
console.log(`\n${passed}/${passed + failed} kiểm thử hàng đợi đạt.`);
if (failed > 0) process.exit(1);
