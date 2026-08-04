const CACHE_NAME = "Wheel-Loader-v3"; // naikkan nombor ni bila ko ubah senarai FILES_TO_CACHE (icon/manifest dll)
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
  const url = event.request.url;
  const isHTML =
    event.request.mode === "navigate" ||
    url.endsWith("index.html") ||
    url.endsWith("/Wheel-Loader/");

  if (isHTML) {
    // Network-first: index.html SELALU cuba ambil versi terbaru dari internet dulu.
    // Cache cuma jadi fallback bila offline / takda internet.
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Static assets (icon, manifest dll): cache-first sebab jarang berubah.
    // Kalau ko update icon/manifest, naikkan CACHE_NAME di atas supaya refresh.
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).catch(() => caches.match("/Wheel-Loader/index.html"))
        );
      })
    );
  }
});
