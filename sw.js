// //Respond when files not found ALL WRITTEN IN ES5
// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         fetch(event.request)
//         .then(function(response) {
//             if (response.status === 404) {
//                 return new Response('Whoops, not found');
//             }
//             return response;
//         })
//         .catch(function(error) {
//             return new Response('Uh oh, that totally failed:', error);
//         })
//     );
// });

// //Cache some files
// self.addEventListener('install', function(event) {
//     event.waitUntil(
//         caches.open('Style1')
//         .then(function(cache) {
//             return cache.addAll([
//                 '/',
//                 'js/special.js',
//                 'css/mystyle.css',
//             ]);
//         })
//     );
// });

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.match(event.request)
//         .then(function(response) {
//             return response || fetch(event.request);
//         })
//     );
// });

// //Update Cache files
// const staticCacheName = 'Style3';

// self.addEventListener('install', function(event) {
//     event.waitUntil(
//         caches.open(staticCacheName)
//         .then(function(cache) {
//             return cache.addAll([
//                 '/',
//                 'js/special.js',
//                 'css/mystyle.css',
//             ]);
//         })
//     );
// });

// self.addEventListener('activate', function(event) {
//     event.waitUntil(
//         caches.keys()
//         .then(function(cacheNames) {
//             return Promise.all(
//                 cacheNames.filter(function(cacheName) {
//                     return cacheName.startsWith('Style') && cacheName !== staticCacheName;
//                 }).map(function(cacheName) {
//                     return caches.delete(cacheName);
//                 })
//             );
//         })
//     );
// })

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.match(event.request)
//         .then(function(response) {
//             return response || fetch(event.request);
//         })
//     );
// });

// //Trigger Update
// self.addEventListener('message', function(event) {
//     if (event.data.action === 'skipWaiting') {
//         self.skipWaiting();
//     }
// });




//ALL WRITTEN IN ES6
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
        .catch(error => new Response('Uh oh, that totally failed:', error))
    );
});

//Cache some files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('Style1')
        .then(cache => cache.addAll([
            '/',
            'js/special.js',
            'css/mystyle.css',
        ]))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
});

//Update Cache files
const staticCacheName = 'Style6';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName)
        .then(cache => cache.addAll([
            '/',
            'js/special.js',
            'css/mystyle.css',
            'https://fonts.googleapis.com/css?family=Montserrat'
        ]))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
        .then(cacheNames => Promise.all(
            cacheNames.filter(cacheName => cacheName.startsWith('Style') && cacheName !== staticCacheName).map(cacheName => caches.delete(cacheName))
        ))
    );
})

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
});

//Trigger Update
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});


//Catch Page skeleton
self.addEventListener('fetch', event => {
    const requestURL = new URL(event.request.url);

    if (requestURL.origin === location.origin) {
        if (requestURL.pathname === '/') {
            event.respondWith(caches.match('/skeleton'));
            return;
        }
    }

    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});