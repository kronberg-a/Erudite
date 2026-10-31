import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

function worker(scope = "https://example.com/Erudite/") {
  const events: Record<string, (event: any) => void> = {};
  const cache = { addAll: vi.fn().mockResolvedValue(undefined), match: vi.fn().mockResolvedValue(new Response("offline shell")) };
  const caches = { open: vi.fn().mockResolvedValue(cache), keys: vi.fn().mockResolvedValue([]), delete: vi.fn().mockResolvedValue(true) };
  const fetch = vi.fn().mockRejectedValue(new Error("offline"));
  const claim = vi.fn().mockResolvedValue(undefined);
  runInNewContext(readFileSync("public/sw.js", "utf8"), {
    self: { registration: { scope }, location: new URL(scope), clients: { claim }, addEventListener: (type: string, fn: (event: any) => void) => { events[type] = fn; } },
    caches, fetch, URL, Request, Response,
  });
  return { events, cache, caches, fetch, claim };
}

describe("Android installation and offline shell", () => {
  it("provides standalone launch and correctly sized Android icons", () => {
    const manifest = JSON.parse(readFileSync("public/manifest.webmanifest", "utf8"));
    expect(manifest).toMatchObject({ name: "Erudite", start_url: "./", scope: "./", display: "standalone", prefer_related_applications: false });
    for (const icon of manifest.icons) {
      const data = readFileSync(`public/${icon.src.slice(2)}`);
      expect(data.subarray(1, 4).toString()).toBe("PNG");
      expect(`${data.readUInt32BE(16)}x${data.readUInt32BE(20)}`).toBe(icon.sizes);
    }
    expect(manifest.icons.some((icon: { purpose: string }) => icon.purpose === "maskable")).toBe(true);
  });
  it("precaches a complete shell within its deployment subdirectory", async () => {
    const { events, cache } = worker();
    const waitUntil = vi.fn();
    events.install({ waitUntil });
    await waitUntil.mock.calls[0][0];
    const requests: Request[] = cache.addAll.mock.calls[0][0];
    expect(requests.every((request) => request.url.startsWith("https://example.com/Erudite/"))).toBe(true);
    expect(requests.map((request) => request.url)).toContain("https://example.com/Erudite/standalone/app.js");
    expect(requests.every((request) => request.cache === "reload")).toBe(true);
  });
  it("uses cached launch HTML offline, including launches with a query string", async () => {
    const { events, cache } = worker();
    const respondWith = vi.fn();
    events.fetch({ request: { url: "https://example.com/Erudite/?source=home", method: "GET", mode: "navigate" }, respondWith });
    expect(await (await respondWith.mock.calls[0][0]).text()).toBe("offline shell");
    expect(cache.match).toHaveBeenCalledWith("https://example.com/Erudite/index.html");
  });
  it("never intercepts APIs, private Gemini payloads, or external translation requests", () => {
    const { events } = worker();
    for (const request of [
      { url: "https://example.com/api/article?url=https://example.org", method: "GET" },
      { url: "https://example.com/api/gemini", method: "POST" },
      { url: "https://translate.googleapis.com/translate_a/single", method: "GET" },
    ]) {
      const respondWith = vi.fn();
      events.fetch({ request, respondWith });
      expect(respondWith).not.toHaveBeenCalled();
    }
  });
  it("keeps online responses fresh and uses the cached bundle when offline", async () => {
    const { events, fetch } = worker();
    fetch.mockResolvedValueOnce(new Response("new bundle"));
    const request = new Request("https://example.com/Erudite/standalone/app.js");
    const online = vi.fn();
    events.fetch({ request, respondWith: online });
    expect(await (await online.mock.calls[0][0]).text()).toBe("new bundle");
    const offline = vi.fn();
    events.fetch({ request, respondWith: offline });
    expect(await (await offline.mock.calls[0][0]).text()).toBe("offline shell");
  });
  it("only removes older caches belonging to this app and scope", async () => {
    const { events, caches, claim } = worker();
    const current = "erudite-shell:https://example.com/Erudite/:__ERUDITE_SHELL_VERSION__";
    caches.keys.mockResolvedValueOnce([current, "erudite-shell:https://example.com/Erudite/:old", "erudite-shell:https://example.com/other/:old", "unrelated"]);
    const waitUntil = vi.fn();
    events.activate({ waitUntil });
    await waitUntil.mock.calls[0][0];
    expect(caches.delete).toHaveBeenCalledExactlyOnceWith("erudite-shell:https://example.com/Erudite/:old");
    expect(claim).toHaveBeenCalledOnce();
  });
});
