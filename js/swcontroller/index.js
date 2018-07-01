//Register the Service Worker

if ('serviceWorker' in navigator) {
    // navigator.serviceWorker
    //     .register('/sw.js')
    //     .then(() => { console.log("Service Worker Registered"); })
    //     .catch(() => {
    //         console.error('Service Worker could not be registered:');
    //     });


    navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
            registration.addEventListener('updatefound', function() {
                // registration.installing has changed
                var sw = registration.installing;
                console.log(sw.state); // "installing"
                sw.addEventListener('statechange', function() {
                    // sw.state has changed
                    if (!navigator.serviceWorker.controller) {
                        // page didn't load using a service worker
                    }

                    if (registration.waiting) {
                        // there's an update ready!
                    }

                    if (registration.installing) {
                        // there's an update in progress
                        registration.installing.addEventListener('statechange', function() {
                            if (this.state === 'installed') {
                                // there's an update ready!
                            }
                        });
                    }
                });

                registration.addEventListener('updatefound', function() {
                    registration.installing.addEventListener('statechange', function() {
                        if (this.state === 'installed') {
                            // there's an update ready!
                        }
                    });
                });

            });
        });

    navigator.serviceWorker.addEventListener('controllerchange', function() {
        window.location.reload();
    });


}