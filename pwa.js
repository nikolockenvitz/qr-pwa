// Service Worker for PWA
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js")
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });
} else {
    console.log("ServiceWorker not supported");
}
