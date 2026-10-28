import { Readable } from "node:stream";
import { EventEmitter } from "node:events";
import type { IncomingMessage, ServerResponse } from "node:http";
import { afterEach, expect, it, vi } from "vitest";
import { geminiHandler } from "./gemini";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
const input = { operation: "translation", input: { text: "Hallo", from: "de", to: "en" } };
function request(body: unknown = input, headers: Record<string, string> = {}, method = "POST") {
  const req = Readable.from([JSON.stringify(body)]) as unknown as IncomingMessage;
  Object.assign(req, { method, headers: { host: "localhost:5173", "content-type": "application/json", ...headers } });
  return req;
}
function response() {
  const res = new EventEmitter() as ServerResponse;
  res.setHeader = vi.fn().mockReturnValue(res);
  res.writeHead = vi.fn().mockReturnValue(res);
  res.end = vi.fn().mockReturnValue(res);
  return res;
}
it("uses the server key without returning it and forces the fixed model/schema", async () => {
  vi.stubEnv("GEMINI_API_KEY", "server-test-secret");
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ candidates: [{ finishReason: "STOP", content: { parts: [{ text: '{"translation":"Hello","alternatives":[]}' }] } }] }) });
  vi.stubGlobal("fetch", fetchMock);
  const res = response(); await geminiHandler(request(), res);
  expect(res.writeHead).toHaveBeenCalledWith(200);
  expect(res.end).toHaveBeenCalledWith(JSON.stringify({ translation: "Hello", alternatives: [] }));
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toContain("gemini-3.5-flash-lite:generateContent");
  expect(init.headers["x-goog-api-key"]).toBe("server-test-secret");
  expect(JSON.parse(init.body).generationConfig.thinkingConfig).toEqual({ thinkingLevel: "minimal" });
  expect(JSON.stringify(vi.mocked(res.end).mock.calls)).not.toContain("server-test-secret");
});
it("allows a personal key and reports server availability without disclosing it", async () => {
  vi.stubEnv("GEMINI_API_KEY", "server-test-secret");
  const res = response(); await geminiHandler(request({}, {}, "GET"), res);
  expect(res.end).toHaveBeenCalledWith('{"configured":true}');
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));
  const limited = response(); await geminiHandler(request(input, { "x-gemini-api-key": "personal-test-key" }), limited);
  expect(vi.mocked(fetch).mock.calls[0][1]?.headers).toMatchObject({ "x-goog-api-key": "personal-test-key" });
  expect(limited.writeHead).toHaveBeenCalledWith(429);
});
it("rejects cross-origin use of the server key", async () => {
  const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
  const res = response(); await geminiHandler(request(input, { origin: "https://elsewhere.example" }), res);
  expect(res.writeHead).toHaveBeenCalledWith(403);
  expect(fetchMock).not.toHaveBeenCalled();
});
it("returns 501 without configuration and rejects unsupported methods", async () => {
  vi.stubEnv("GEMINI_API_KEY", "");
  const res = response(); await geminiHandler(request(), res);
  expect(res.writeHead).toHaveBeenCalledWith(501);
  const other = response(); await geminiHandler(request({}, {}, "PUT"), other);
  expect(other.writeHead).toHaveBeenCalledWith(405);
});
it.each([
  [{ operation: "other", input: {} }, 400],
  [{ operation: "translation", input: { text: "x".repeat(12001), from: "de", to: "en" } }, 400],
  [{ operation: "translation", input: { text: "x".repeat(200001), from: "de", to: "en" } }, 413],
  [{ operation: "cefr", input: { text: "airport", language: "en", tokens: [{ word: "airport", offset: 1 }] } }, 400],
])("bounds and validates request bodies", async (body, status) => {
  vi.stubEnv("GEMINI_API_KEY", "server-test-key");
  const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
  const res = response(); await geminiHandler(request(body), res);
  expect(res.writeHead).toHaveBeenCalledWith(status);
  expect(fetchMock).not.toHaveBeenCalled();
});
it("hides upstream errors and discards incomplete model output", async () => {
  vi.stubEnv("GEMINI_API_KEY", "server-test-key");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ candidates: [{ finishReason: "MAX_TOKENS", content: { parts: [{ text: "partial" }] } }] }) }));
  const res = response(); await geminiHandler(request(), res);
  expect(res.writeHead).toHaveBeenCalledWith(502);
  expect(res.end).toHaveBeenCalledWith('{"error":"Gemini response could not be processed","code":"INVALID_MODEL_RESPONSE"}');
});
it.each([401, 403, 404])("preserves authentication/model status %s without exposing upstream details", async (status) => {
  vi.stubEnv("GEMINI_API_KEY", "server-test-key");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status }));
  const res = response(); await geminiHandler(request(), res);
  expect(res.writeHead).toHaveBeenCalledWith(status);
  expect(res.end).toHaveBeenCalledWith('{"error":"Gemini unavailable"}');
});
it("maps model token ids to exact source offsets and gives CEFR a longer server deadline", async () => {
  vi.stubEnv("GEMINI_API_KEY", "server-test-key");
  const timer = vi.spyOn(globalThis, "setTimeout");
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ candidates: [{ finishReason: "STOP", content: { parts: [{ text: '{"tokens":[{"id":1,"level":"C1"},{"id":0,"level":"A1"}]}' }] } }] }) });
  vi.stubGlobal("fetch", fetchMock);
  const res = response();
  await geminiHandler(request({ operation: "cefr", input: { text: "Straße Straße", language: "de", tokens: [
    { offset: 0, word: "Straße" }, { offset: 7, word: "Straße" },
  ] } }), res);
  expect(res.writeHead).toHaveBeenCalledWith(200);
  expect(JSON.parse(vi.mocked(res.end).mock.calls[0][0] as string)).toEqual({ tokens: [
    { offset: 7, word: "Straße", level: "C1" }, { offset: 0, word: "Straße", level: "A1" },
  ] });
  expect(timer).toHaveBeenCalledWith(expect.any(Function), 50000);
  const body = JSON.parse(fetchMock.mock.calls[0][1].body);
  expect(JSON.parse(body.contents[0].parts[0].text).tokens).toEqual([{ id: 0, word: "Straße" }, { id: 1, word: "Straße" }]);
});
