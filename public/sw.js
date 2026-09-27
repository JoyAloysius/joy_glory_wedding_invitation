// Minimal offline-support service worker.
//
// Strategy: HTML navigations are network-first (guests always get the latest wedding
// details when online) and fall back to the cached offline page only when the network
// is unavailable. Same-origin static assets use cache-first with runtime population.
//
// Bump CACHE_VERSION after replacing photos/content if you want to force previously
// visited browsers to drop everything they cached before re-fetching (see README > PWA).
const CACHE_VERSION = 'v1';
const CACHE_NAME = `wedding-cache-${CACHE_VERSION}`;
const OFFLINE_URL = new URL('offline.html', self.registration.scope).pathname;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll([OFFLINE_URL]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  if (new URL(request.url).origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
  }
});
