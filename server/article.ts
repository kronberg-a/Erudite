import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import type { RequestOptions } from "node:https";
import type { ConnectionOptions } from "node:tls";
import { brotliDecompressSync, gunzipSync, inflateSync } from "node:zlib";
import type { IncomingMessage, ServerResponse } from "node:http";
import ipaddr from "ipaddr.js";
import { Readability } from "@mozilla/readability";
import { JSDOM, VirtualConsole } from "jsdom";

export const MAX_BYTES = 2_000_000;
export const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
export function isPublicAddress(address: string): boolean {
  try { return ipaddr.process(address).range() === "unicast"; }
  catch { return false; }
}
export async function resolveArticleUrl(raw: string) {
  const url = new URL(raw);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password)
    throw new Error("Invalid article URL");
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(hostname)
    ? [{ address: hostname, family: isIP(hostname) }]
    : await lookup(hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address)))
    throw new Error("Address is not public");
  return { url, address: addresses[0] };
}

function decodeBody(rawBuffer: Buffer, encoding: string): string {
  const maxOutputLength = MAX_BYTES * 4;
  if (encoding === "gzip" || encoding === "x-gzip") return gunzipSync(rawBuffer, { maxOutputLength }).toString("utf8");
  if (encoding === "deflate") return inflateSync(rawBuffer, { maxOutputLength }).toString("utf8");
  if (encoding === "br") return brotliDecompressSync(rawBuffer, { maxOutputLength }).toString("utf8");
  return rawBuffer.toString("utf8");
}

async function download(raw: string, signal: AbortSignal, redirects = 0): Promise<{ html: string; url: string }> {
  if (redirects > 5) throw new Error("Too many redirects");
  const { url, address } = await resolveArticleUrl(raw);
  signal.throwIfAborted();
  const result = await new Promise<{ html?: string; redirect?: string }>((resolve, reject) => {
    const options: RequestOptions & ConnectionOptions = {
      signal,
      agent: false,
      family: address.family,
      ALPNProtocols: ["http/1.1"],
      // Pin the checked DNS result; the transport must never resolve the host again.
      lookup: (_host, _options, callback) => callback(null, address.address, address.family),
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,de;q=0.8,fr;q=0.8,es;q=0.8,it;q=0.8,ru;q=0.8",
        "User-Agent": USER_AGENT,
      },
    };
    const request = (url.protocol === "https:" ? httpsRequest : httpRequest)(url, options, (response) => {
      response.on("error", reject);
      const status = response.statusCode ?? 500;
      if ([301, 302, 303, 307, 308].includes(status) && response.headers.location) {
        resolve({ redirect: new URL(response.headers.location, url).href });
        response.destroy();
        return;
      }
      const encoding = (response.headers["content-encoding"] ?? "identity").toLowerCase().trim();
      if (status < 200 || status >= 300 ||
          !/^application\/xhtml\+xml\b|^text\/html\b/i.test(response.headers["content-type"] ?? "") ||
          !["identity", "gzip", "x-gzip", "deflate", "br"].includes(encoding) ||
          Number(response.headers["content-length"]) > MAX_BYTES) {
        reject(new Error("Article download rejected"));
        response.destroy();
        return;
      }
      const chunks: Buffer[] = [];
      let size = 0;
      response.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size > MAX_BYTES) {
          reject(new Error("Article is too large"));
          response.destroy();
        } else chunks.push(chunk);
      });
      response.on("end", () => {
        try {
          resolve({ html: decodeBody(Buffer.concat(chunks), encoding) });
        } catch (err) {
          reject(err);
        }
      });
    });
    request.on("error", reject);
    request.end();
  });
  return result.redirect
    ? download(result.redirect, signal, redirects + 1)
    : { html: result.html!, url: url.href };
}

export function extractArticle(html: string, url: string) {
  const dom = new JSDOM(html, { url, virtualConsole: new VirtualConsole() });
  try {
    const document = dom.window.document;
    const language = document.documentElement.lang || undefined;
    document.querySelectorAll('nav, aside, footer, body > header, script, style, noscript, [role="navigation"], [role="banner"]').forEach((node) => node.remove());
    const article = new Readability(document).parse();
    if (!article?.content) throw new Error("No article found");
    const content = document.createElement("div");
    content.innerHTML = article.content;
    const text = Array.from(content.querySelectorAll("p, h2, h3, li, blockquote"))
      .filter((node) => !node.parentElement?.closest("p, h2, h3, li, blockquote"))
      .map((node) => node.textContent?.replace(/\s+/gu, " ").trim()).filter(Boolean).join("\n\n") || article.textContent?.trim();
    if (!text) throw new Error("No article text found");
    return { title: article.title?.trim() || new URL(url).hostname, text, url, language };
  } finally { dom.window.close(); }
}

export async function articleHandler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.writeHead(405).end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }
  const controller = new AbortController();
  const disconnect = () => controller.abort();
  res.on("close", disconnect);
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const raw = new URL(req.url ?? "", "http://localhost").searchParams.get("url");
    if (!raw || raw.length > 4096) throw new Error("Invalid URL");
    // Include DNS resolution in the deadline even if the system resolver stalls.
    const result = await Promise.race([
      download(raw, controller.signal),
      new Promise<never>((_, reject) => controller.signal.addEventListener("abort", () => reject(new Error("Timeout")), { once: true })),
    ]);
    res.end(JSON.stringify(extractArticle(result.html, result.url)));
  } catch {
    if (!res.destroyed) res.writeHead(422).end(JSON.stringify({ error: "Unable to import article. Use the paste box instead." }));
  } finally {
    clearTimeout(timer);
    res.off("close", disconnect);
  }
}
