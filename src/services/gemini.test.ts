import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeCefrWithGemini, analyzeSelectionWithGemini, configureGemini, getGeminiConnectionState, isGeminiConfigured, translateWithGemini } from "./gemini";
import { analyzeArticleCefr } from "./cefr";
import { canonicalizeWord } from "./article";
import { translate } from "./translator";
import { geminiBody, parseGeminiResult, validGeminiRequest } from "./geminiProtocol";
import type { SelectionAnalysisResult } from "./gemini";

const input = { word: "Bank", sentence: "Er saß auf der Bank im Park.", wordOffset: 15, from: "de", to: "en" } as const;
const result: SelectionAnalysisResult = { partOfSpeech: "NOUN", canonicalWord: "die Bank", translation: "bench", alternatives: ["seat"], translatedSentence: "He sat on the bench in the park.", cefrLevel: "A2" };
const upstream = (value: unknown) => ({ candidates: [{ finishReason: "STOP", content: { parts: [{ text: JSON.stringify(value) }] } }] });
beforeEach(() => configureGemini("test-key"));
afterEach(() => { configureGemini(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); });

describe("hybrid Gemini client", () => {
  it("skips network entirely without a configured key", async () => {
    configureGemini();
    const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    expect(await analyzeSelectionWithGemini(input)).toBeUndefined();
    expect(await translateWithGemini("Bank", "de", "en")).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("uses one proxy call for context, canonical form, sentence and CEFR, caching successes", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => result }); vi.stubGlobal("fetch", fetchMock);
    expect(await analyzeSelectionWithGemini(input)).toEqual(result);
    expect(await analyzeSelectionWithGemini(input)).toEqual(result);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/gemini");
    expect(init.headers["x-gemini-api-key"]).toBe("test-key");
    expect(JSON.parse(init.body)).toEqual({ operation: "selection", input });
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });
  it("calls the current Flash-Lite REST model with minimal thinking and a strict output schema", async () => {
    vi.stubGlobal("location", { protocol: "file:" });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => upstream(result) }); vi.stubGlobal("fetch", fetchMock);
    expect(await analyzeSelectionWithGemini(input)).toEqual(result);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("gemini-3.5-flash-lite:generateContent");
    expect(url).not.toContain("test-key");
    expect(init.headers["x-goog-api-key"]).toBe("test-key");
    const config = JSON.parse(init.body).generationConfig;
    expect(config).toMatchObject({ thinkingConfig: { thinkingLevel: "minimal" }, responseMimeType: "application/json", responseSchema: { required: expect.arrayContaining(["canonicalWord"]) } });
    expect(config).not.toHaveProperty("temperature");
    expect(config.thinkingConfig).not.toHaveProperty("thinkingBudget");
  });
  it.each([404, 501])("uses a personal key directly if the proxy returns %s", async (status) => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false, status }).mockResolvedValueOnce({ ok: true, json: async () => upstream(result) }); vi.stubGlobal("fetch", fetchMock);
    expect(await analyzeSelectionWithGemini(input)).toEqual(result);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("backs off on quota errors and keeps legacy translation available", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false, status: 429 }).mockResolvedValue({ ok: true, json: async () => ({ sentences: [{ trans: "bench" }] }) }); vi.stubGlobal("fetch", fetchMock);
    expect(await translate("Bank", "de", "en")).toMatchObject({ primary: "bench" });
    expect(await analyzeSelectionWithGemini(input)).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[1][0])).toContain("translate.googleapis.com");
  });
  it("rejects malformed or article-free noun responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ...result, canonicalWord: "Bank" }) }));
    expect(await analyzeSelectionWithGemini(input)).toBeUndefined();
    expect(() => parseGeminiResult({ operation: "selection", input }, { ...result, alternatives: Array(6).fill("seat") })).toThrow();
  });
  it("retains the original abort reason and does not cache a late response", async () => {
    const controller = new AbortController();
    let finish!: (value: unknown) => void;
    const fetchMock = vi.fn().mockReturnValue(new Promise((resolve) => { finish = resolve; })); vi.stubGlobal("fetch", fetchMock);
    const pending = analyzeSelectionWithGemini(input, controller.signal);
    controller.abort(new Error("Selection dismissed"));
    finish({ ok: true, json: async () => result });
    await expect(pending).rejects.toThrow("Selection dismissed");
    fetchMock.mockResolvedValue({ ok: true, json: async () => result });
    expect(await analyzeSelectionWithGemini(input)).toEqual(result);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("falls back after its combined deadline", async () => {
    vi.useFakeTimers();
    vi.spyOn(AbortSignal, "timeout").mockImplementation((milliseconds) => {
      const timeout = new AbortController();
      setTimeout(() => timeout.abort(new DOMException("Timed out", "TimeoutError")), milliseconds);
      return timeout.signal;
    });
    vi.stubGlobal("fetch", vi.fn().mockImplementation((_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener("abort", () => reject(init.signal.reason), { once: true });
    })));
    const pending = analyzeSelectionWithGemini(input);
    await vi.advanceTimersByTimeAsync(8000);
    expect(await pending).toBeUndefined();
  });
  it("uses only Gemini's exact CEFR offsets and omits A1 and unreturned tokens", async () => {
    const text = "Macron tests hubris airport";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ tokens: [
      { offset: 0, word: "Macron", level: "A1" }, { offset: 13, word: "hubris", level: "C1" },
    ] }) }));
    const map = await analyzeArticleCefr(text, "en");
    expect(map.has(0)).toBe(false);
    expect(map.get(13)).toBe("C1");
    expect(map.has(text.indexOf("airport"))).toBe(false);
  });
  it("retries invalid CEFR data once without calling UDPipe or reporting a disconnected key", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ tokens: [{ id: 99, level: "C1" }] }) });
    vi.stubGlobal("fetch", fetchMock);
    await expect(analyzeArticleCefr("airport", "en")).rejects.toThrow("Gemini analysis response could not be processed");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.every((call) => call[0] === "/api/gemini")).toBe(true);
    expect(getGeminiConnectionState()).toBe("response_error");
    expect(isGeminiConfigured()).toBe(true);
  });
  it.each(["file:", "https:"])("keeps other Gemini requests available after a CEFR response-processing failure (%s)", async (protocol) => {
    vi.stubGlobal("location", { protocol });
    const fetchMock = vi.fn().mockResolvedValueOnce(protocol === "file:"
      ? { ok: true, json: async () => upstream({ tokens: [{ id: 99, level: "C2" }] }) }
      : { ok: false, status: 502, json: async () => ({ code: "INVALID_MODEL_RESPONSE" }) })
      .mockResolvedValueOnce({ ok: true, json: async () => protocol === "file:" ? upstream({ translation: "bench", alternatives: [] }) : { translation: "bench", alternatives: [] } });
    vi.stubGlobal("fetch", fetchMock);
    await expect(analyzeCefrWithGemini("airport", "en")).rejects.toMatchObject({ kind: "response" });
    expect(getGeminiConnectionState()).toBe("response_error");
    expect(await translateWithGemini("Bank", "de", "en")).toEqual({ primary: "bench", alternatives: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(getGeminiConnectionState()).toBe("connected");
  });
  it("uses compact token ids and restores exact offsets locally for repeated accented words", async () => {
    vi.stubGlobal("location", { protocol: "file:" });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => upstream({ tokens: [
      { id: 0, level: "A1" }, { id: 1, level: "C1" }, { id: 2, level: "B2" },
    ] }) }); vi.stubGlobal("fetch", fetchMock);
    expect(await analyzeCefrWithGemini("𝄞\nStraße Straße niño", "de")).toEqual([
      { offset: 3, word: "Straße", level: "A1" }, { offset: 10, word: "Straße", level: "C1" },
      { offset: 17, word: "niño", level: "B2" },
    ]);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(JSON.parse(body.contents[0].parts[0].text).tokens).toEqual([
      { id: 0, word: "Straße" }, { id: 1, word: "Straße" }, { id: 2, word: "niño" },
    ]);
    expect(body.generationConfig.responseSchema.properties.tokens.items.required).toEqual(["id", "level"]);
  });
  it("reports a CEFR deadline separately and keeps subsequent Gemini translations enabled", async () => {
    vi.useFakeTimers();
    vi.spyOn(AbortSignal, "timeout").mockImplementation((milliseconds) => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new DOMException("Timed out", "TimeoutError")), milliseconds);
      return controller.signal;
    });
    const fetchMock = vi.fn().mockImplementationOnce((_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener("abort", () => reject(init.signal.reason), { once: true });
    })).mockResolvedValue({ ok: true, json: async () => ({ translation: "bench", alternatives: [] }) });
    vi.stubGlobal("fetch", fetchMock);
    const pending = expect(analyzeCefrWithGemini("airport", "en")).rejects.toMatchObject({ kind: "timeout" });
    await vi.advanceTimersByTimeAsync(45000);
    await pending;
    expect(getGeminiConnectionState()).toBe("timeout");
    expect(await translateWithGemini("Bank", "de", "en")).toMatchObject({ primary: "bench" });
    expect(getGeminiConnectionState()).toBe("connected");
  });
  it("preserves exact reader offsets through newlines and non-BMP characters", async () => {
    const text = "𝄞\nStraße hubris";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ tokens: [] }) }); vi.stubGlobal("fetch", fetchMock);
    await analyzeCefrWithGemini(text, "de");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).input.tokens).toEqual([{ offset: 3, word: "Straße" }, { offset: 10, word: "hubris" }]);
  });
  it("uses Gemini for existing canonicalization and translation entry points", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => result })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ translation: "bench", alternatives: [] }) }); vi.stubGlobal("fetch", fetchMock);
    expect(await canonicalizeWord(input.word, input.sentence, "de", input.wordOffset)).toBe("die Bank");
    expect(await translate("Bank", "de", "en")).toEqual({ primary: "bench", alternatives: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("validates operations and builds prompts with normalization rules", () => {
    expect(validGeminiRequest({ operation: "arbitrary", input: {} })).toBe(false);
    expect(validGeminiRequest({ operation: "selection", input: { ...input, wordOffset: -1 } })).toBe(false);
    const body = geminiBody({ operation: "selection", input });
    expect(body.systemInstruction.parts[0].text).toContain("hinbewegen");
    expect(body.systemInstruction.parts[0].text).toContain("le héros");
    expect(body.systemInstruction.parts[0].text).toContain("el agua");
  });
  it("discovers a server-side key without requesting or forwarding its value", async () => {
    vi.resetModules();
    const client = await import("./gemini");
    vi.stubGlobal("location", { protocol: "http:" });
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ configured: true }) })
      .mockResolvedValueOnce({ ok: true, json: async () => result });
    vi.stubGlobal("fetch", fetchMock);
    await client.initializeGemini();
    expect(client.isGeminiConfigured()).toBe(true);
    expect(await client.analyzeSelectionWithGemini(input)).toEqual(result);
    expect(fetchMock.mock.calls[1][1].headers).toEqual({ "Content-Type": "application/json" });
  });
});
