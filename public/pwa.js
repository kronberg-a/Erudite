(() => {
  if (!window.isSecureContext || !["https:", "http:"].includes(location.protocol) || !("serviceWorker" in navigator)) return;
  const worker = new URL("./sw.js", document.currentScript.src);
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(worker.href, { updateViaCache: "none" }).catch(() => {
      // Studying remains available if installation or offline caching is blocked.
    });
  }, { once: true });
})();
