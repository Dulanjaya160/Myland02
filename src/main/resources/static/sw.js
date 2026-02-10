const CACHE_NAME = 'myland-v4';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/products.html',
    '/ingredients.html',
    '/production.html',
    '/sales.html',
    '/inventory.html',
    '/shops.html',
    '/css/professional.css',
    '/app.js',
    '/navigation.js',
    '/print-functions.js',
    '/images/myland-icon.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install Event - Cache Core Assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Event - Cleanup Old Caches
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
});

// Fetch Event - Serve from Cache or Network
self.addEventListener('fetch', event => {
    // API requests: Network ONLY, never cache
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request, {
                cache: 'no-store'  // Never cache API responses
            })
        );
        return;
    }

    // Static assets: Cache First, fall back to Network
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                // Fetch with redirect mode set to 'follow' to handle redirects
                return fetch(event.request, { redirect: 'follow' })
                    .then(fetchResponse => {
                        // Cache the response if it's valid
                        if (fetchResponse && fetchResponse.status === 200) {
                            const responseToCache = fetchResponse.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        }
                        return fetchResponse;
                    });
            })
    );
});
