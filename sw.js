const CACHE_NAME = 'aws-memory-game-v1.0.0';
const urlsToCache = [
    '/',
    '/index-fixed-simple.html',
    '/public/lib/phaser.min.js',
    '/site.webmanifest',
    'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for analytics
self.addEventListener('sync', function(event) {
    if (event.tag === 'game-analytics') {
        event.waitUntil(sendAnalytics());
    }
});

function sendAnalytics() {
    // Send cached analytics data when online
    return fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify({
            event: 'game_played',
            timestamp: Date.now()
        })
    }).catch(err => console.log('Analytics failed:', err));
}
