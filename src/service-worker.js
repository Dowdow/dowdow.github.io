const ASSET_CACHE = "cache";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(ASSET_CACHE);

      try {
        const response = await fetch("/.vite/manifest.json");
        const assets = await response.json();
        console.log(assets);
        await Promise.all(
          Object.keys(assets).map((key) =>
            cache.add(new Request(`/${assets[key].file}`)),
          ),
        );
      } catch (error) {
        console.error("Erreur lors de l'installation du SW:", error);
      }
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          return await fetch(event.request);
        } catch (e) {
          const cache = await caches.open(ASSET_CACHE);
          return cache.match("/") || cache.match("/index.html");
        }
      })(),
    );
  } else {
    const url = new URL(event.request.url);
    if (
      url.host === location.host &&
      url.pathname.match(/\.(html|js|css|png|jpe?g|gif|svg|woff2|ttf|md)$/) !==
        null
    ) {
      event.respondWith(
        (async () => {
          const cache = await caches.open(ASSET_CACHE);
          try {
            const asset = await fetch(event.request);
            cache.put(event.request, asset.clone());
            return asset;
          } catch (e) {
            return cache.match(event.request) || cache.match(url.pathname);
          }
        })(),
      );
    }
  }
});
