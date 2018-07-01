//Respond when files not found
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
        .then(response => {
            if (response.status === 404) {
                return new Response('Whoops, not found');
            }
            return response;
        })
        // .catch(error => new Response('Uh oh, that totally failed:', error))
    );
});


const staticCacheName = 'myStaticCache2';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName)
        .then(cache => cache.addAll([
            './',
            './index.html',
            './js/special.js',
            './js/jquery3.2.1.js',
            './js/bootstrap/bootstrap.js',
            './js/bootstrap/bootstrap.bundle.js',
            './js/bootstrap/bootstrap.bundle.min.js',
            './css/mystyle.css',
            './css/bootstrap.css',
            './css/bootstrap.css',
            './css/bootstrap.min.css',
            './css/bootstrap-grid.css',
            './css/bootstrap-grid.min.css',
            'https://free.currencyconverterapi.com/api/v5/currencies',
            'https://fonts.googleapis.com/css?family=Lato',
            'https://use.fontawesome.com/releases/v5.1.0/css/all.css'


        ]))
    );
});
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
        .then(cacheNames => Promise.all(
            cacheNames.filter(cacheName => cacheName.startsWith('myStaticCache') && cacheName !== staticCacheName).map(cacheName => caches.delete(cacheName))
        ))
    );
});
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => response || fetch(event.request))

    );
});