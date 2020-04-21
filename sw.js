let cacheName = "cache_v0.2";
let cachedFiles = [
    "./icons/icon192x192.png",
    "./lib/qr-scanner-worker.min.js", // TODO: use second cache only for library files?
    "./lib/qr-scanner.min.js",
    "./lib/qrcodegen.js",
    "./bundle.js",
    "./favicon32x32.png",
    "./index.html",
    "./main.js",
    "./pwa.js",
    "./site.webmanifest",
    "./style.css"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheName)
        .then((cache) => {
            return cache.addAll(cachedFiles);
        })
        .then(() => {
            return self.skipWaiting();
        })
        .catch((error) => {
            console.log(error);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
        .then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            return response || fetch(event.request)
                .then((response) => {
                    return caches.open(cacheName).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
        })
    );
});