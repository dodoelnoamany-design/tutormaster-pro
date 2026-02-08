const CACHE_NAME = 'tutor-master-app-v1';

// الملفات الأساسية - يتم تخزينها محلياً (نخزن فقط ملفات ثابتة بدون أسماء هاش)
const PRE_CACHE_URLS = [
  '/',
  '/index.html',
  '/assets/icon-192.svg',
  '/assets/icon-512.svg'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Pre-caching core assets...');
      return cache.addAll(PRE_CACHE_URLS).catch((err) => {
        console.warn('Pre-cache failed (normal in dev mode):', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// استراتيجية: Cache-First للملفات الثابتة، Network-First للموارد الخارجية
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // نفس النطاق
  if (url.origin === location.origin) {
    // assets (CSS/JS/images) -> network-first ثم cache كـ fallback
    if (url.pathname.startsWith('/assets/')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            }
            return response;
          })
          .catch(() => caches.match(request))
      );
      return;
    }

    // طلبات HTML (التنقل) -> cache-first مع fallback للـ index.html
    if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
      event.respondWith(
        caches.match('/index.html').then((cached) => cached || fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })).catch(() => caches.match('/index.html'))
      );
      return;
    }

    // باقي الموارد: cache-first ثم شبكة
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return response;
      }).catch(() => new Response('Resource not available offline', { status: 503 })))
    );
    return;
  }

  // موارد خارج النطاق: network-first ثم cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || new Response('Offline: Resource not available', { status: 503 })))
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
