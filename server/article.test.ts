import { EventEmitter } from "node:events";
import type { IncomingMessage, ServerResponse } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import { lookup } from "node:dns/promises";
import { request } from "node:https";
import { articleHandler, extractArticle, isPublicAddress, MAX_BYTES, resolveArticleUrl, USER_AGENT } from "./article";
vi.mock("node:dns/promises", () => ({ lookup: vi.fn() }));
vi.mock("node:https", () => ({ request: vi.fn() }));
afterEach(() => { vi.resetAllMocks(); vi.useRealTimers(); });

describe("article extractor security", () => {
  it.each(["127.0.0.1", "10.0.0.1", "192.168.1.1", "172.16.0.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "224.0.0.1", "::1", "fc00::1", "fe80::1", "::ffff:127.0.0.1", "2001:db8::1"])("rejects non-public address %s", (address) => {
    expect(isPublicAddress(address)).toBe(false);
  });
  it("rejects mixed public/private DNS results and unusual loopback representations", async () => {
    vi.mocked(lookup).mockResolvedValue([{ address: "93.184.216.34", family: 4 }, { address: "10.0.0.1", family: 4 }] as never);
    await expect(resolveArticleUrl("https://example.com")).rejects.toThrow("not public");
    for (const url of ["http://2130706433", "http://0x7f000001", "http://[::ffff:127.0.0.1]", "file:///etc/passwd", "https://user:pass@example.com"]) {
      await expect(resolveArticleUrl(url)).rejects.toThrow();
    }
  });
  it("extracts plain paragraphs, title and language without navigation or executing scripts", () => {
    const html = `<html lang="de"><title>Example</title><body><nav>Navigation noise</nav><article><h1>Example</h1>${Array.from({ length: 5 }, (_, i) => `<p>Absatz ${i}. Dies ist ein langer und lesbarer Artikel über neue Wörter und ihre Bedeutung im Alltag.</p>`).join("")}<blockquote><p>Quoted once.</p></blockquote></article><script>throw Error('Executed')</script><footer>Footer noise</footer></body></html>`;
    const article = extractArticle(html, "https://example.com/news");
    expect(article).toMatchObject({ title: "Example", language: "de", url: "https://example.com/news" });
    expect(article.text).toContain("Absatz 0.");
    expect(article.text).not.toMatch(/Navigation noise|Footer noise|Executed|<p>/);
    expect(article.text.match(/Quoted once/g)).toHaveLength(1);
  });
});

function response() {
  const res = new EventEmitter() as ServerResponse;
  res.setHeader = vi.fn().mockReturnValue(res);
  res.writeHead = vi.fn().mockReturnValue(res);
  res.end = vi.fn().mockReturnValue(res);
  return res;
}
describe("article endpoint", () => {
  it("pins DNS for transport and revalidates redirect destinations", async () => {
    vi.mocked(lookup).mockResolvedValue([{ address: "93.184.216.34", family: 4 }] as never);
    vi.mocked(request).mockImplementation(((_url: unknown, options: { lookup: Function; family: number; headers: Record<string, string> }, callback: Function) => {
      const cb = vi.fn(); options.lookup("example.com", {}, cb);
      expect(cb).toHaveBeenCalledWith(null, "93.184.216.34", 4);
      expect(options.family).toBe(4);
      expect(options.headers["User-Agent"]).toBe(USER_AGENT);
      const req = new EventEmitter();
      Object.assign(req, { end: () => {
        const incoming = new EventEmitter();
        Object.assign(incoming, { statusCode: 302, headers: { location: "http://127.0.0.1/private" }, destroy: vi.fn() });
        callback(incoming);
      } });
      return req;
    }) as never);
    const res = response();
    await articleHandler({ method: "GET", url: "/?url=https://example.com" } as IncomingMessage, res);
    expect(request).toHaveBeenCalledTimes(1);
    expect(res.writeHead).toHaveBeenCalledWith(422);
  });
  it("rejects a streamed body over 2MB even without a Content-Length", async () => {
    vi.mocked(lookup).mockResolvedValue([{ address: "93.184.216.34", family: 4 }] as never);
    const destroy = vi.fn();
    vi.mocked(request).mockImplementation(((_url: unknown, _options: unknown, callback: Function) => {
      const req = new EventEmitter();
      Object.assign(req, { end: () => {
        const incoming = new EventEmitter();
        Object.assign(incoming, { statusCode: 200, headers: { "content-type": "text/html" }, destroy });
        callback(incoming); incoming.emit("data", Buffer.alloc(MAX_BYTES + 1));
      } });
      return req;
    }) as never);
    const res = response();
    await articleHandler({ method: "GET", url: "/?url=https://example.com" } as IncomingMessage, res);
    expect(destroy).toHaveBeenCalled(); expect(res.writeHead).toHaveBeenCalledWith(422);
  });
  it("times out stalled DNS resolution after 15 seconds", async () => {
    vi.useFakeTimers();
    vi.mocked(lookup).mockReturnValue(new Promise(() => {}));
    const res = response();
    const done = articleHandler({ method: "GET", url: "/?url=https://example.com" } as IncomingMessage, res);
    await vi.advanceTimersByTimeAsync(15_000); await done;
    expect(res.writeHead).toHaveBeenCalledWith(422);
  });
});
