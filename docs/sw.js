// Service Worker for Retro 1999 Site - PWA Support
// Makes the site work offline and load faster

const CACHE_NAME = 'retro-site-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/script.js',
  '/assets/style.css',
  '/prototype01.html',
  '/prototype02.html',
  '/prototype03.html',
  '/prototype04.html',
  '/prototype05.html',
  '/prototype06.html',
  '/prototype07.html',
  '/prototype08.html',
  '/prototype09.html',
  '/prototype10.html'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return cached response
        if (response) {
          console.log('💾 Service Worker: Serving from cache', event.request.url);
          return response;
        }

        // Cache miss - fetch from network
        console.log('🌐 Service Worker: Fetching from network', event.request.url);
        return fetch(event.request).then(
          (response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🎮 Retro Site Service Worker loaded - PWA ready!');
