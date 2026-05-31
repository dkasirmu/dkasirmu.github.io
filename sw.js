const CACHE_NAME = 'dkasirmu-v1';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/produk.html',
  '/riwayat.html',
  '/style.css',
  '/js/db.js',
  '/js/kasir.js',
  '/js/format.js',
  '/js/riwayat.js',
  '/js/produk.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
