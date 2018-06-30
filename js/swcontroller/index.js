// //Register service worker

// // if ('serviceWorker' in navigator) {
// //     navigator.serviceWorker
// //         .register('/sw.js')
// //         .then(function() { console.log("Service Worker Registered"); })
// //         .catch(function() {
// //             console.error('Service Worker could not be registered:');
// //         });

// // }

// //Register and monitor SW state
// //ALL WRITTEN IN ES5

// function IndexController(container) {
//     this._container = container;
//     this._postsView = new PostsView(this._container);
//     this._toastsView = new ToastsView(this._container);
//     this._lostConnectionToast = null;
//     this._dbPromise = openDatabase();
//     this._registerServiceWorker();
//     this._cleanImageCache();

//     var indexController = this;

//     setInterval(function() {
//         indexController._cleanImageCache();
//     }, 1000 * 60 * 5);

//     this._showCachedMessages().then(function() {
//         indexController._openSocket();
//     });
// }

// IndexController.prototype._registerServiceWorker = function() {
//     if (!navigator.serviceWorker) return;

//     var indexController = this;

//     navigator.serviceWorker.register('sw.js').then(function(reg) {
//         // TODO: if there's no controller, this page wasn't loaded
//         // via a service worker, so they're looking at the latest version.
//         // In that case, exit early
//         if (!navigator.serviceWorker.controller) {
//             return;
//         }

//         // TODO: if there's an updated worker already waiting, call
//         // indexController._updateReady()
//         if (reg.waiting) {
//             indexController._updateReady();
//             return;
//         }

//         // TODO: if there's an updated worker installing, track its
//         // progress. If it becomes "installed", call
//         // indexController._updateReady()
//         if (reg.installing) {
//             indexController._trackInstalling(reg.installing);
//             return;
//         }

//         // TODO: otherwise, listen for new installing workers arriving.
//         // If one arrives, track its progress.
//         // If it becomes "installed", call
//         // indexController._updateReady()
//         reg.addEventListener('updatefound', function() {
//             indexController._trackInstalling(reg.installing);
//             return;
//         });
//     });

//     navigator.serviceWorker.addEventListener('controllerchange', function() {
//         window.location.reload();
//     });
// };

// IndexController.prototype._trackInstalling = function(sw) {
//     var indexController = this;

//     sw.addEventListener('statechange', function() {
//         if (sw.state === 'installed') {
//             indexController._updateReady();
//         }
//     });
// };
// //Trigger Update
// IndexController.prototype._updateReady = function(worker) {
//     var toast = this._toastsView.show("New version available", {
//         buttons: ['refresh', 'dismiss']
//     });

//     toast.answer.then(function(answer) {
//         if (answer != 'refresh') return;
//         // TODO: tell the service worker to skipWaiting
//         worker.postMessage({
//             action: 'skipWaiting'
//         });
//     });
// };





//ALL WRITTEN IN ES6

class IndexController {
    constructor(container) {
        this._container = container;
        this._postsView = new PostsView(this._container);
        this._toastsView = new ToastsView(this._container);
        this._lostConnectionToast = null;
        this._dbPromise = openDatabase();
        this._registerServiceWorker();
        this._cleanImageCache();

        const indexController = this;

        setInterval(() => {
            indexController._cleanImageCache();
        }, 1000 * 60 * 5);

        this._showCachedMessages().then(() => {
            indexController._openSocket();
        });
    }

    _registerServiceWorker() {
        if (!navigator.serviceWorker) return;

        const indexController = this;

        navigator.serviceWorker.register('sw.js').then(reg => {
            // TODO: if there's no controller, this page wasn't loaded
            // via a service worker, so they're looking at the latest version.
            // In that case, exit early
            if (!navigator.serviceWorker.controller) {
                return;
            }

            // TODO: if there's an updated worker already waiting, call
            // indexController._updateReady()
            if (reg.waiting) {
                indexController._updateReady();
                return;
            }

            // TODO: if there's an updated worker installing, track its
            // progress. If it becomes "installed", call
            // indexController._updateReady()
            if (reg.installing) {
                indexController._trackInstalling(reg.installing);
                return;
            }

            // TODO: otherwise, listen for new installing workers arriving.
            // If one arrives, track its progress.
            // If it becomes "installed", call
            // indexController._updateReady()
            reg.addEventListener('updatefound', () => {
                indexController._trackInstalling(reg.installing);

            });
        });

        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    }

    _trackInstalling(worker) {
        const indexController = this;

        worker.addEventListener('statechange', () => {
            if (sw.state === 'installed') {
                indexController._updateReady(worker);
            }
        });
    }

    //Trigger Update
    _updateReady(worker) {
        const toast = this._toastsView.show("New version available", {
            buttons: ['refresh', 'dismiss']
        });

        toast.answer.then(answer => {
            if (answer != 'refresh') return;
            // TODO: tell the service worker to skipWaiting
            worker.postMessage({
                action: 'skipWaiting'
            });
        });
    }
}