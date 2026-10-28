import { beforeEach, expect, it, vi } from "vitest";
import { analyzeArticleCefr, CefrUnavailableError } from "./cefr";
import { analyzeCefrWithGemini } from "./gemini";
import { languages } from "../types";
import { wordParts } from "./article";
import { GeminiAnalysisError } from "./geminiProtocol";

vi.mock("./gemini", () => ({ analyzeCefrWithGemini: vi.fn() }));
beforeEach(() => vi.resetAllMocks());

it.each(languages)("uses only Gemini-provided CEFR levels for %s", async (language) => {
  vi.mocked(analyzeCefrWithGemini).mockResolvedValue([
    { offset: 0, word: "house", level: "C1" }, { offset: 6, word: "hubris", level: "A1" },
  ]);
  expect(await analyzeArticleCefr("house hubris airport", language)).toEqual(new Map([[0, "C1"]]));
});
it("passes caller credentials and cancellation through to Gemini", async () => {
  vi.mocked(analyzeCefrWithGemini).mockResolvedValue([]);
  const controller = new AbortController();
  await analyzeArticleCefr("Straße", "de", controller.signal, "personal-test-key");
  expect(analyzeCefrWithGemini).toHaveBeenCalledWith("Straße", "de", controller.signal, "personal-test-key");
});
it("does not fabricate levels when Gemini is unavailable", async () => {
  vi.mocked(analyzeCefrWithGemini).mockResolvedValue(undefined);
  await expect(analyzeArticleCefr("airport hubris", "en")).rejects.toBeInstanceOf(CefrUnavailableError);
  expect(analyzeCefrWithGemini).toHaveBeenCalledTimes(1);
});
it("does not request analysis for empty or non-word content", async () => {
  expect(await analyzeArticleCefr(" \n...!", "en")).toEqual(new Map());
  expect(analyzeCefrWithGemini).not.toHaveBeenCalled();
});
it("analyzes the complete article beyond 12,000 characters in bounded batches", async () => {
  const text = "word ".repeat(2600) + "finalword";
  vi.mocked(analyzeCefrWithGemini).mockImplementation(async (chunk) => {
    expect(chunk.length).toBeLessThanOrEqual(6000);
    const tokens = wordParts(chunk).filter((_, index) => index % 2 === 1);
    expect(tokens.length).toBeLessThanOrEqual(200);
    return tokens[0] === "finalword" ? [{ offset: 0, word: "finalword", level: "B2" }]
      : [{ offset: 0, word: "word", level: "B1" }, ...(chunk.includes("finalword") ? [{ offset: chunk.indexOf("finalword"), word: "finalword", level: "B2" as const }] : [])];
  });
  const map = await analyzeArticleCefr(text, "en");
  expect(map.get(text.indexOf("finalword"))).toBe("B2");
  const starts = [...map.keys()].filter((offset) => offset !== text.indexOf("finalword"));
  for (const offset of starts) expect(text.slice(offset, offset + 4)).toBe("word");
  expect(analyzeCefrWithGemini).toHaveBeenCalledTimes(14);
});
it("keeps exact offsets for accents, hyphens, leading punctuation and newlines", async () => {
  const text = "𝄞\n  Straße well-known niño";
  vi.mocked(analyzeCefrWithGemini).mockResolvedValue([
    { offset: 0, word: "Straße", level: "A2" }, { offset: 7, word: "well-known", level: "B1" },
    { offset: 18, word: "niño", level: "B2" },
  ]);
  expect(await analyzeArticleCefr(text, "de")).toEqual(new Map([[5, "A2"], [12, "B1"], [23, "B2"]]));
});
it("propagates cancellation and stops subsequent batches", async () => {
  const controller = new AbortController();
  vi.mocked(analyzeCefrWithGemini).mockImplementation(async () => {
    controller.abort(new Error("Cancelled"));
    return [];
  });
  await expect(analyzeArticleCefr("word ".repeat(500), "en", controller.signal)).rejects.toThrow("Cancelled");
  expect(analyzeCefrWithGemini).toHaveBeenCalledTimes(1);
});
it("rejects an incomplete analysis rather than publishing a partly classified article", async () => {
  vi.mocked(analyzeCefrWithGemini).mockResolvedValueOnce([{ offset: 0, word: "word", level: "C2" }]).mockResolvedValueOnce(undefined);
  await expect(analyzeArticleCefr("word ".repeat(500), "en")).rejects.toBeInstanceOf(CefrUnavailableError);
  expect(analyzeCefrWithGemini).toHaveBeenCalledTimes(2);
});
it("automatically retries one invalid Gemini response and uses the successful result", async () => {
  vi.mocked(analyzeCefrWithGemini).mockRejectedValueOnce(new GeminiAnalysisError("response"))
    .mockResolvedValueOnce([{ offset: 0, word: "airport", level: "B1" }]);
  expect(await analyzeArticleCefr("airport", "en")).toEqual(new Map([[0, "B1"]]));
  expect(analyzeCefrWithGemini).toHaveBeenCalledTimes(2);
});
it("does not automatically repeat a slow timed-out analysis", async () => {
  vi.mocked(analyzeCefrWithGemini).mockRejectedValue(new GeminiAnalysisError("timeout"));
  await expect(analyzeArticleCefr("airport", "en")).rejects.toMatchObject({ kind: "timeout" });
  expect(analyzeCefrWithGemini).toHaveBeenCalledTimes(1);
});
