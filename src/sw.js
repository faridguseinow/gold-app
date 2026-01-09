const STATIC_CACHE = 'gold-static-v1';
const API_CACHE = 'gold-api-v1';

// ===== INSTALL =====
self.addEventListener('install', event => {
  console.log('[SW] install');

  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll([
        '/',
        './index.html',
        './manifest.json'
      ]);
    })
  );

  self.skipWaiting();
});

// ===== ACTIVATE =====
self.addEventListener('activate', event => {
  console.log('[SW] activate');

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => ![STATIC_CACHE, API_CACHE].includes(k))
          .map(k => caches.delete(k))
      )
    )
  );

  self.clients.claim();
});

// ===== FETCH =====
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = request.url;

  // ===== GOOGLE APPS SCRIPT API =====
  if (url.includes('script.google.com/macros')) {
    event.respondWith(apiCacheStrategy(request));
    return;
  }

  // ===== STATIC FILES =====
  event.respondWith(
    caches.match(request).then(cached => {
      return cached || fetch(request);
    })
  );
});

// ===== API STRATEGY: CACHE FIRST + BACKGROUND UPDATE =====
async function apiCacheStrategy(request) {
  const cache = await caches.open(API_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    // обновляем в фоне
    fetch(request)
      .then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      })
      .catch(() => {});

    return cached;
  }

  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }

  return response;
}
