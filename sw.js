// sw.js - CORRECTED VERSION

const CACHE_NAME = 'tangogi-cache-v1';
const urlsToCache = [ '/', '/index.html', '/styles.css', '/js/main.js' ];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
        console.log('Service Worker: Cache opened');
        return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
        if (response) {
          return response; // Serve from cache if found
        }
        return fetch(event.request); // Otherwise, fetch from network
    })
  );
});