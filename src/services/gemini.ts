import type { Language } from "../types";
import { wordParts } from "./article";
import { GEMINI_ENDPOINT, GEMINI_STANDARD_TIMEOUT_MS, GeminiAnalysisError, extractGeminiResult, geminiBody, parseGeminiResult, validGeminiRequest } from "./geminiProtocol";
import type { ArticleExtractionResult, GeminiRequest, SelectionAnalysisRequest, SelectionAnalysisResult } from "./geminiProtocol";
export type { ArticleExtractionRequest, ArticleExtractionResult, SelectionAnalysisRequest, SelectionAnalysisResult } from "./geminiProtocol";

let configuredKey = "";
let serverEnabled = false;
let discovery: Promise<void> | undefined;
let unavailableUntil = 0;
export type GeminiConnectionState = "unconfigured" | "untested" | "checking" | "connected" | "auth_error" | "quota_error" | "model_error" | "response_error" | "timeout" | "unavailable";
let connectionState: GeminiConnectionState = "unconfigured";
let credentialVersion = 0;
const connectionListeners = new Set<() => void>();
export const getGeminiConnectionState = () => connectionState;
export function subscribeGeminiConnection(listener: () => void) {
  connectionListeners.add(listener);
  return () => { connectionListeners.delete(listener); };
}
function setConnectionState(state: GeminiConnectionState) {
  if (state === connectionState) return;
  connectionState = state;
  connectionListeners.forEach((listener) => listener());
}
const cache = new Map<string, ReturnType<typeof parseGeminiResult>>();
// Explicit user retries can resume immediately while keeping successful batches.
export function clearGeminiBackoff() { unavailableUntil = 0; }
export function isGeminiConfigured(apiKey = configuredKey): boolean {
  return !!apiKey || serverEnabled;
}
export function configureGemini(key?: string) {
  const next = key?.trim() ?? "";
  if (next !== configuredKey) {
    configuredKey = next; cache.clear(); unavailableUntil = 0; credentialVersion++;
    setConnectionState(isGeminiConfigured() ? "untested" : "unconfigured");
  }
}
export function initializeGemini(force = false): Promise<void> {
  if (typeof location === "undefined" || location.protocol === "file:") return Promise.resolve();
  if (force) discovery = undefined;
  return discovery ??= (async () => {
    try {
      const response = await fetch("/api/gemini", { signal: AbortSignal.timeout(2000) });
      const data: unknown = response.ok ? await response.json() : undefined;
      serverEnabled = !!data && typeof data === "object" && "configured" in data && data.configured === true;
    } catch { serverEnabled = false; }
    if (serverEnabled && connectionState === "unconfigured") setConnectionState("untested");
  })();
}

async function requestGemini(request: GeminiRequest, signal?: AbortSignal, apiKey = configuredKey, force = false) {
  const version = credentialVersion;
  signal?.throwIfAborted();
  if (discovery) await discovery;
  signal?.throwIfAborted();
  const file = typeof location !== "undefined" && location.protocol === "file:";
  if ((!apiKey && (!serverEnabled || file)) || (!force && Date.now() < unavailableUntil) || !validGeminiRequest(request)) return undefined;
  const cacheKey = JSON.stringify(request);
  const cached = cache.get(cacheKey);
  if (cached && !force) return structuredClone(cached);
  // Give the proxy time to return its upstream error before the browser aborts.
  const timeout = (request.operation === "cefr" || request.operation === "article") ? 45000 : GEMINI_STANDARD_TIMEOUT_MS + (file ? 0 : 5000);
  const combined = AbortSignal.any([AbortSignal.timeout(timeout), ...(signal ? [signal] : [])]);
  const direct = () => fetch(GEMINI_ENDPOINT, {
    method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify(geminiBody(request)), signal: combined,
  });
  let failureState: GeminiConnectionState = "unavailable";
  let receivedSuccess = false;
  try {
    let response = file ? await direct() : await fetch("/api/gemini", {
      method: "POST", headers: { "Content-Type": "application/json", ...(apiKey ? { "x-gemini-api-key": apiKey } : {}) },
      body: JSON.stringify(request), signal: combined,
    });
    let isDirect = file;
    if (!file && [404, 501].includes(response.status) && apiKey) { response = await direct(); isDirect = true; }
    if (!response.ok) {
      if ([502, 504].includes(response.status) && typeof response.json === "function") {
        const detail: unknown = await response.json().catch(() => undefined);
        if (detail && typeof detail === "object" && "code" in detail) {
          if (detail.code === "INVALID_MODEL_RESPONSE") throw new GeminiAnalysisError("response");
          if (detail.code === "UPSTREAM_TIMEOUT") throw new GeminiAnalysisError("timeout");
        }
      }
      if (response.status === 504) throw new GeminiAnalysisError("timeout");
      failureState = [401, 403].includes(response.status) ? "auth_error"
        : response.status === 429 ? "quota_error" : response.status === 404 ? "model_error" : "unavailable";
      throw new Error("Gemini unavailable");
    }
    receivedSuccess = true;
    const payload: unknown = await response.json();
    const result = parseGeminiResult(request, isDirect ? extractGeminiResult(payload) : payload);
    signal?.throwIfAborted();
    if (version !== credentialVersion) return undefined;
    setConnectionState("connected");
    unavailableUntil = 0;
    if (cache.size >= 100) cache.delete(cache.keys().next().value!);
    cache.set(cacheKey, result);
    return structuredClone(result);
  } catch (error) {
    if (signal?.aborted) throw error;
    if (version !== credentialVersion) return undefined;
    const issue = error instanceof GeminiAnalysisError ? error
      : combined.aborted ? new GeminiAnalysisError("timeout")
      : receivedSuccess ? new GeminiAnalysisError("response") : undefined;
    if (issue) {
      setConnectionState(issue.kind === "response" ? "response_error" : "timeout");
      // An analysis failure does not invalidate a key or disable unrelated
      // Gemini translations. CEFR reports its own error and offers a retry.
      if (request.operation === "cefr") throw issue;
      return undefined;
    }
    setConnectionState(failureState);
    unavailableUntil = Date.now() + 15000;
    return undefined;
  }
}

export async function testGeminiConnection(apiKey = configuredKey, signal?: AbortSignal): Promise<void> {
  const version = credentialVersion;
  const previous = connectionState;
  setConnectionState("checking");
  try {
    if (!apiKey) await initializeGemini(true);
    signal?.throwIfAborted();
    if (version !== credentialVersion) return;
    if (!isGeminiConfigured(apiKey) || (!apiKey && typeof location !== "undefined" && location.protocol === "file:")) { setConnectionState("unconfigured"); return; }
    await requestGemini({ operation: "translation", input: { text: "Hello", from: "en", to: "de" } }, signal, apiKey, true);
  } finally {
    if (version === credentialVersion && signal?.aborted && connectionState === "checking") setConnectionState(previous);
  }
}

export async function analyzeSelectionWithGemini(input: SelectionAnalysisRequest, signal?: AbortSignal, apiKey?: string): Promise<SelectionAnalysisResult | undefined> {
  const result = await requestGemini({ operation: "selection", input }, signal, apiKey);
  return result && "canonicalWord" in result ? result as SelectionAnalysisResult : undefined;
}
export async function translateWithGemini(text: string, from: Language, to: Language, signal?: AbortSignal) {
  const result = await requestGemini({ operation: "translation", input: { text, from, to } }, signal);
  return result && "translation" in result ? { primary: result.translation, alternatives: result.alternatives } : undefined;
}
export async function analyzeCefrWithGemini(text: string, language: Language, signal?: AbortSignal, apiKey?: string) {
  // Keep the exact UTF-16 offsets used by the reader, without normalizing text.
  let offset = 0;
  const tokens = wordParts(text).flatMap((word, index) => {
    const start = offset; offset += word.length;
    return index % 2 === 1 ? [{ offset: start, word }] : [];
  });
  const result = await requestGemini({ operation: "cefr", input: { text, language, tokens } }, signal, apiKey);
  return result && "tokens" in result ? result.tokens : undefined;
}

export async function extractArticleWithGemini(url: string, signal?: AbortSignal, apiKey?: string): Promise<ArticleExtractionResult | undefined> {
  const result = await requestGemini({ operation: "article", input: { url } }, signal, apiKey);
  return result && "title" in result && "text" in result && "url" in result ? result as ArticleExtractionResult : undefined;
}
