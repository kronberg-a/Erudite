import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, expect, it } from "vitest";
import { createApp } from "./app";

let root: string;
let base: string;
let server: ReturnType<typeof createApp>;
beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), "erudite-server-"));
  await mkdir(join(root, "dist"));
  await writeFile(join(root, "dist", "index.html"), "<html>Erudite</html>");
  await writeFile(join(root, "dist", "app.js"), "console.log('app')");
  await writeFile(join(root, "dist", "manifest.webmanifest"), "{}");
  await writeFile(join(root, "dist", "sw.js"), "// worker");
  await writeFile(join(root, "private.txt"), "private");
  server = createApp(join(root, "dist"));
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  await rm(root, { recursive: true, force: true });
});
it("serves the website and bundles with revalidation and HEAD support", async () => {
  const page = await fetch(base);
  expect(await page.text()).toContain("Erudite");
  expect(page.headers.get("content-type")).toContain("text/html");
  expect(page.headers.get("cache-control")).toBe("no-cache");
  const asset = await fetch(`${base}/app.js`, { method: "HEAD" });
  expect(asset.status).toBe(200);
  expect(asset.headers.get("content-type")).toContain("text/javascript");
  expect(await asset.text()).toBe("");
});
it("provides health checks and routes the existing APIs", async () => {
  expect(await (await fetch(`${base}/healthz`)).json()).toEqual({ ok: true });
  expect((await fetch(`${base}/api/article?url=http://127.0.0.1/private`)).status).toBe(422);
  const gemini = await fetch(`${base}/api/gemini`);
  expect(gemini.status).toBe(200);
  expect(typeof (await gemini.json()).configured).toBe("boolean");
});
it("serves installation metadata and revalidates service worker updates", async () => {
  const manifest = await fetch(`${base}/manifest.webmanifest`);
  expect(manifest.headers.get("content-type")).toContain("application/manifest+json");
  const worker = await fetch(`${base}/sw.js`);
  expect(worker.headers.get("content-type")).toContain("text/javascript");
  expect(worker.headers.get("cache-control")).toBe("no-cache");
});
it("blocks traversal, malformed paths, unknown files and unsupported methods", async () => {
  expect((await fetch(`${base}/..%2fprivate.txt`)).status).toBe(403);
  expect((await fetch(`${base}/%E0%A4%A`)).status).toBe(400);
  expect((await fetch(`${base}/missing.js`)).status).toBe(404);
  expect((await fetch(`${base}/api/missing`)).status).toBe(404);
  expect((await fetch(base, { method: "POST" })).status).toBe(405);
});
it("limits API request volume", async () => {
  for (let i = 0; i < 120; i++) await fetch(`${base}/api/gemini`);
  const limited = await fetch(`${base}/api/gemini`);
  expect(limited.status).toBe(429);
  expect(limited.headers.get("retry-after")).toBe("60");
  expect((await fetch(`${base}/healthz`)).status).toBe(200);
});
