// The packaging step replaces this value with a hash of the complete app shell.
const VERSION = "__ERUDITE_SHELL_VERSION__";
const PREFIX = `erudite-shell:${self.registration.scope}:`;
const CACHE = PREFIX + VERSION;
const FILES = ["./", "./index.html", "./standalone/app.js", "./standalone/app.css", "./pwa.js", "./manifest.webmanifest", "./favicon.svg", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png"];
const URLS = FILES.map((file) => new URL(file, self.registration.scope).href);

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(URLS.map((url) => new Request(url, { cache: "reload" })))));
  // Wait for existing app windows to close before replacing their offline shell.
});
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith(PREFIX) && key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // API calls and third-party requests always go directly to the network.
  if (event.request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  const navigation = event.request.mode === "navigate" && url.pathname.startsWith(new URL(self.registration.scope).pathname);
  if (!navigation && !URLS.includes(url.href)) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      if (response.ok) return response;
      if (!navigation) return response;
    } catch { /* Fall back to the last completely downloaded shell. */ }
    const cache = await caches.open(CACHE);
    const saved = await cache.match(navigation ? new URL("./index.html", self.registration.scope).href : event.request);
    return saved ?? Response.error();
  })());
});
