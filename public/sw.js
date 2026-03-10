// Service Worker for PWA - SAO E-Record System
const CACHE_NAME = 'sao-erecord-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/student-dashboard.html',
  '/teacher-dashboard.html',
  '/sao-dashboard.html',
  '/sao-management.html',
  '/attendance-sheet.html',
  '/css/dark-mode.css',
  '/js/app.js',
  '/js/utilities.js',
  '/js/constants.js',
  '/js/student-dashboard.js',
  '/js/teacher-dashboard.js',
  '/js/sao-dashboard.js',
  '/js/sao-management.js',
  '/js/attendance-sheet.js',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
