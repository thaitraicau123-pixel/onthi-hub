import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import topupsHandler from './api/topups.js';
import sepayHandler from './api/sepay.js';
import aiHandler from './api/ai.js';
import downloadHandler from './api/download.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// API routes
function wrapHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res)).catch(next);
  };
}

app.all('/api/topups', wrapHandler(topupsHandler));
app.all('/api/sepay', wrapHandler(sepayHandler));
app.all('/api/ai', wrapHandler(aiHandler));
app.all('/api/download', wrapHandler(downloadHandler));

// Explicit root static files (matching build.cjs / vercel.json — never expose api/, lib/, .env*, server.js)
const ROOT_STATIC_FILES = new Set([
  'index.html',
  'favicon.svg',
  'icon-192.png',
  'icon-512.png',
  'manifest.json',
  'sw.js',
  'cloud-db.json'
]);

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

for (const file of ROOT_STATIC_FILES) {
  app.get(`/${file}`, (_req, res) => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    return res.status(404).end();
  });
}

// Block unauthenticated direct static access to paid downloads & Master Prompts
app.use('/downloads', (_req, res) => {
  return res.status(403).json({
    ok: false,
    code: 'protected_asset',
    message: 'Vui lòng mở khóa bằng Ví Xu và tải qua /api/download'
  });
});

app.get('/MASTER_PROMPTS.md', (_req, res) => {
  return res.status(403).json({
    ok: false,
    code: 'protected_asset',
    message: 'Vui lòng mở khóa gói All-In-One bằng Ví Xu và tải qua /api/download'
  });
});

// Explicit static directories (paid downloads/ are served exclusively via /api/download)
for (const dir of ['js', 'img', 'demo']) {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    app.use(`/${dir}`, express.static(dirPath));
  }
}

// Serve /public assets (e.g., wallpapers, icons) if present
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// SPA fallback (matching vercel.json rewrite)
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ ok: false, message: 'API route not found' });
  }
  if (req.method === 'GET' && !path.extname(req.path)) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }
  return res.status(404).send('Not Found');
});

app.use((err, _req, res, _next) => {
  console.error('[server] Unhandled error:', err && err.message ? err.message : err);
  if (!res.headersSent) {
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`[PromptMMO Studio] Server listening on http://${HOST}:${PORT}`);
});
