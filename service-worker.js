const CACHE_NAME = "SCI-Equipment-v2"; // update versi cache bila ada perubahan
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon/icon-192.png",
  "./icon/icon-512.png",
  "./icon/apple-touch-icon.png"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching App Shell");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // terus aktifkan service worker baru
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // buang cache lama
          }
        })
      );
    })
  );
  self.clients.claim(); // takeover semua tab tanpa tunggu reload
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // fallback ke index.html kalau tiada response & offline
      return (
        response ||
        fetch(event.request).catch(() => caches.match("./index.html"))
      );
    })
  );
});
