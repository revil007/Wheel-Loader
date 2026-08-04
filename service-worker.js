const CACHE_NAME = "Wheel-Loader-v1"; // nama cache unik untuk projek ini
const FILES_TO_CACHE = [
  "/Wheel-Loader/",
  "/Wheel-Loader/index.html",
  "/Wheel-Loader/manifest.json",
  "/Wheel-Loader/icon/icon-192.png",
  "/Wheel-Loader/icon/icon-512.png",
  "/Wheel-Loader/icon/apple-touch-icon.png"
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
        fetch(event.request).catch(() => caches.match("/Wheel-Loader/index.html"))
      );
    })
  );
});
