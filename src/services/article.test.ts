import { afterEach, describe, expect, it, vi } from "vitest";
import { collectArticleWords, importArticle, sentenceAt, wordParts } from "./article";
import { seedPair } from "../i18n/seedData";

afterEach(() => vi.unstubAllGlobals());
describe("article text and collection", () => {
  it("preserves Cyrillic, combining marks, umlauts, accents, hyphens and apostrophes", () => {
    const text = "Привет, Straße! élève niño l’amour mother-in-law.";
    const parts = wordParts(text);
    expect(parts.join("")).toBe(text);
    expect(parts.filter((_, i) => i % 2)).toEqual(["Привет", "Straße", "élève", "niño", "l’amour", "mother-in-law"]);
  });
  it("finds the clicked sentence by its real offset, including repeated words", () => {
    const text = "Hallo, Welt!\n\nEine neue Welt. Ende?";
    expect(sentenceAt(text, text.lastIndexOf("Welt"))).toBe("Eine neue Welt.");
    expect(sentenceAt(text, text.indexOf("Ende"))).toBe("Ende?");
  });
  it("merges duplicates without changing progress or mutating the original pair", () => {
    const pair = seedPair("en", "de");
    pair.words[0] = { ...pair.words[0], status: "REVIEW", step: 4, repCount: 21, lastReviewedOrder: 98 };
    const before = structuredClone(pair);
    const { pair: next, folderId } = collectArticleWords(pair, [
      { word: pair.words[0].targetWord.toUpperCase(), translation: "replacement", sentence: "context" },
      { word: "Äpfel", translation: "apples", sentence: "Ich esse Äpfel." },
      { word: "äpfel", translation: "apples", sentence: "Äpfel sind gut." },
    ], "Article", "de");
    expect(pair).toEqual(before);
    expect(next.words).toHaveLength(pair.words.length + 1);
    expect(next.words[0]).toEqual({ ...before.words[0], categoryIds: [...before.words[0].categoryIds, folderId] });
    expect(next.words.at(-1)).toMatchObject({ targetWord: "Äpfel", status: "NEW", step: 0, repCount: 0, categoryIds: [folderId], examples: [{ targetSentence: "Ich esse Äpfel.", translatedSentence: "" }] });
    expect(Object.values(next.categories.at(-1)!.name)).toEqual(Array(6).fill("Article"));
    expect(() => collectArticleWords(pair, Array(51).fill({ word: "a", translation: "b", sentence: "" }), "Article", "de")).toThrow();
  });
  it("rejects failed and malformed imports and passes cancellation to fetch", async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetch);
    await expect(importArticle("https://example.com")).rejects.toThrow();
    fetch.mockResolvedValue({ ok: true, json: async () => ({ text: "" }) });
    await expect(importArticle("https://example.com")).rejects.toThrow();
    const controller = new AbortController();
    fetch.mockImplementation(async (_url, options) => { expect(options.signal.aborted).toBe(true); throw new Error("aborted"); });
    controller.abort();
    await expect(importArticle("https://example.com", controller.signal)).rejects.toThrow("aborted");
  });
});
