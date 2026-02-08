
const CACHE_NAME = 'tutor-master-app-v1';

// الملفات الأساسية - يتم تخزينها محلياً
const PRE_CACHE_URLS = [
  './',
  './index.html',
  './manifest.json'
];

// سياسة التخزين: جميع البيانات تُحفظ محلياً فقط (localStorage)
// لا تعتمد على CDN أو كاشات خارجية

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

// استراتيجية: Cache-First للملفات الثابتة، Network-First للـ CDN
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل الطلبات غير GET
  if (request.method !== 'GET') {
    return;
  }

  // للملفات الثابتة: استخدم Cache-First
  if (url.pathname.endsWith('.html') || 
      url.pathname.endsWith('.js') || 
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.json')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        }).catch(() => {
          // في حالة عدم وجود اتصال، أعد الملف المخزن أو رسالة خطأ
          if (url.pathname.endsWith('.html')) {
            return caches.match(request);
          }
          return new Response('Resource not available offline', { status: 503 });
        });
      })
    );
  } else {
    // للموارد الخارجية (CDN): Network-First مع Fallback محلي
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // عند فشل الاتصال، حاول الـ cache
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            // إذا لم يكن متوفراً في الـ cache، أرجع رسالة خطأ
            return new Response('Offline: Resource not available', { status: 503 });
          });
        })
    );
  }
});

// استقبال رسائل من الـ client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
