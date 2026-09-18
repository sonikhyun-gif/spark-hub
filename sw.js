// 서비스 워터스크립트 — 캐시 기반 오프라인 지원
const CACHE_NAME = 'spark-hub-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './app.js',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
