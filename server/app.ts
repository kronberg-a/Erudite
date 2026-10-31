import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { articleHandler } from "./article";
import { geminiHandler } from "./gemini";

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
};

export function createApp(root = resolve("dist")) {
  root = resolve(root);
  let activeRequests = 0;
  let windowStarted = Date.now();
  let windowRequests = 0;
  return createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    try {
      const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
      if (pathname === "/healthz") {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "no-store");
        res.end(JSON.stringify({ ok: true }));
        return;
      }
      if (pathname === "/api/article" || pathname === "/api/gemini") {
        if (Date.now() - windowStarted >= 60_000) { windowStarted = Date.now(); windowRequests = 0; }
        if (activeRequests >= 4 || windowRequests >= 120) {
          res.setHeader("Retry-After", "60");
          res.setHeader("Cache-Control", "no-store");
          res.writeHead(429).end();
          return;
        }
        activeRequests++;
        windowRequests++;
        try {
          if (pathname === "/api/article") await articleHandler(req, res);
          else await geminiHandler(req, res);
        } finally { activeRequests--; }
        return;
      }
      if (pathname.startsWith("/api/")) { res.writeHead(404).end(); return; }
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.setHeader("Allow", "GET, HEAD");
        res.writeHead(405).end();
        return;
      }
      let decoded: string;
      try { decoded = decodeURIComponent(pathname); }
      catch { res.writeHead(400).end(); return; }
      const file = resolve(root, `.${decoded === "/" ? "/index.html" : decoded}`);
      if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
      const info = await stat(file).catch(() => null);
      if (!info?.isFile()) { res.writeHead(404).end(); return; }
      res.setHeader("Content-Type", contentTypes[extname(file)] ?? "application/octet-stream");
      // Stable bundle names must revalidate after a deployment.
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Content-Length", info.size);
      if (req.method === "HEAD") { res.end(); return; }
      const stream = createReadStream(file);
      stream.on("error", () => res.destroy());
      res.on("close", () => stream.destroy());
      stream.pipe(res);
    } catch {
      if (!res.headersSent) res.writeHead(500).end();
      else res.destroy();
    }
  });
}
