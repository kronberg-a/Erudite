import type { IncomingMessage, ServerResponse } from "node:http";
import { GEMINI_ENDPOINT, extractGeminiResult, geminiBody, parseGeminiResult, validGeminiRequest } from "../src/services/geminiProtocol";

export async function geminiHandler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const end = (status: number, value: unknown) => { if (!res.destroyed) res.writeHead(status).end(JSON.stringify(value)); };
  // Do not expose a server-owned key as an open cross-origin proxy.
  if (req.headers.origin) {
    try { if (new URL(req.headers.origin).host !== req.headers.host) { end(403, { error: "Origin rejected" }); return; } }
    catch { end(403, { error: "Origin rejected" }); return; }
  }
  if (req.method === "GET") { end(200, { configured: !!process.env.GEMINI_API_KEY?.trim() }); return; }
  if (req.method !== "POST") { res.setHeader("Allow", "GET, POST"); end(405, { error: "Method not allowed" }); return; }
  const header = req.headers["x-gemini-api-key"];
  const key = (typeof header === "string" ? header : process.env.GEMINI_API_KEY)?.trim();
  if (!key) { end(501, { error: "Gemini is not configured" }); return; }
  if (key.length > 512 || /[\r\n]/u.test(key)) { end(400, { error: "Invalid key" }); return; }
  if (!req.headers["content-type"]?.startsWith("application/json")) { end(415, { error: "Expected JSON" }); return; }
  const controller = new AbortController();
  const disconnect = () => controller.abort();
  res.on("close", disconnect);
  let deadline = setTimeout(disconnect, 20000);
  let receivedSuccess = false;
  try {
    let size = 0;
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      size += Buffer.byteLength(chunk);
      if (size > 200000) { end(413, { error: "Request too large" }); return; }
      chunks.push(Buffer.from(chunk));
    }
    const request: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!validGeminiRequest(request)) { end(400, { error: "Invalid Gemini request" }); return; }
    clearTimeout(deadline);
    deadline = setTimeout(disconnect, request.operation === "cefr" ? 50000 : 10000);
    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify(geminiBody(request)), signal: controller.signal,
    });
    if (!response.ok) { end([401, 403, 404, 429].includes(response.status) ? response.status : 502, { error: "Gemini unavailable" }); return; }
    receivedSuccess = true;
    const payload: unknown = await response.json();
    end(200, parseGeminiResult(request, extractGeminiResult(payload)));
  } catch {
    if (controller.signal.aborted) end(504, { error: "Gemini request timed out", code: "UPSTREAM_TIMEOUT" });
    else if (receivedSuccess) end(502, { error: "Gemini response could not be processed", code: "INVALID_MODEL_RESPONSE" });
    else end(502, { error: "Gemini unavailable" });
  }
  finally { clearTimeout(deadline); res.off("close", disconnect); }
}
