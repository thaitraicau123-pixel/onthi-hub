// =========================================================================
// ONTHIHUB PWA SERVICE WORKER (v1)
// Cung cấp trải nghiệm ứng dụng di động nguyên bản (Native-like Mobile App)
// Hỗ trợ lưu trữ offline, mở thẻ nhanh không cần mạng & cài đặt lên màn hình chính
// =========================================================================

const CACHE_NAME = 'onthi-pwa-v1';

const STATIC_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png',
  '/icons/apple-touch-icon.png'
];

// 1. Install Event: Cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// 2. Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 3. Fetch Event: Smart routing (Network first for navigation & API, Cache first for assets)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Skip Firebase, Cloud Relay, Analytics and external dynamic APIs
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('identitytoolkit') ||
    url.hostname.includes('ntfy.sh') ||
    url.hostname.includes('vietqr.io') ||
    url.hostname.includes('api.vietqr.io')
  ) {
    return;
  }

  // A. Navigation requests (HTML pages) -> Network First with Offline Fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // B. Static Assets (CSS, JS, Fonts, Images, Audio, Wallpapers) -> Stale While Revalidate
  const isStaticAsset =
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/wallpapers/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.woff2');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        const fetchPromise = fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        }).catch(() => {
          // If offline and not in cache, fallback safely
          return cachedRes;
        });

        return cachedRes || fetchPromise;
      })
    );
    return;
  }

  // C. Default fetch
  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req);
    })
  );
});
