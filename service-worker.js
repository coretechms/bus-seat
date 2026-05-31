/* 검암산악회 PWA Service Worker */
const CACHE_NAME = "geomam-bus-seat-pwa-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./geomam-icon-180.png",
  "./geomam-icon-192.png",
  "./geomam-icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Firebase 등 외부 통신은 캐시하지 않고 그대로 통과
  if (url.origin !== self.location.origin) return;

  // HTML은 항상 최신 파일 우선, 실패 시 캐시 사용
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
        return response;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // 아이콘/manifest 등 정적 파일은 캐시 우선
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      return response;
    }))
  );
});
