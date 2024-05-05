/* eslint-env serviceworker */

const ASSET_CACHE = 'assets';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil((async () => {
    const cache = await caches.open(ASSET_CACHE);
    const assets = await fetch('/assets-manifest.json').then((response) => response.json());
    Object.keys(assets).map((a) => cache.add(new Request(`/${assets[a]}`)));
  })());
});

self.addEventListener('active', () => {
  clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }
        return await fetch(event.request);
      } catch (e) {
        const cache = await caches.open(ASSET_CACHE);
        return cache.match('index.html');
      }
    })());
  } else {
    const url = new URL(event.request.url);
    if (url.host === location.host && url.pathname.match(/\.(html|js|css|png|jpe?g|gif|svg|woff2|ttf|md)$/) !== null) {
      event.respondWith((async () => {
        const cache = await caches.open(ASSET_CACHE);
        try {
          const asset = await fetch(event.request);
          cache.put(event.request, asset.clone());
          return asset;
        } catch (e) {
          return cache.match(url.pathname);
        }
      })());
    }
  }
});
