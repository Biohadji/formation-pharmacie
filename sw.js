const CACHE_NAME = 'pharmacy-academy-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/i18n.js',
    '/js/data.js',
    '/js/quiz.js',
    '/js/auth.js',
    '/js/admin.js',
    '/manifest.json'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Push notification
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'إشعار جديد من الأكاديمية',
        icon: 'img/icon-192.png',
        badge: 'img/icon-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now()
        },
        actions: [
            { action: 'open', title: 'فتح' },
            { action: 'close', title: 'إغلاق' }
        ]
    };
    event.waitUntil(
        self.registration.showNotification('أكاديمية صيدلية عبد العزيز', options)
    );
});

// Notification click
self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});