//Register the Service Worker

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(reg => { console.log("Service Worker Registered"); })
        .catch(() => {
            console.error('Service Worker could not be registered:');
        });
}