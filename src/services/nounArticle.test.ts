import { beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeContextualSelection, canonicalizeWordFallback } from "./article";
import { checkVocabularyWord, suggestNounArticle } from "./nounArticle";
import { checkWordWithGemini } from "./gemini";

vi.mock("./article", () => ({ analyzeContextualSelection: vi.fn(), canonicalizeWordFallback: vi.fn() }));
vi.mock("./gemini", () => ({ checkWordWithGemini: vi.fn() }));
beforeEach(() => vi.resetAllMocks());

describe("noun article suggestions", () => {
  it("returns an explicit spelling verdict and article together without a second request", async () => {
    const result = { spelling: "incorrect", correctedWord: "Haus", nounSuggestion: "das Haus" } as const;
    vi.mocked(checkWordWithGemini).mockResolvedValue(result);
    await expect(checkVocabularyWord("Huas", "de")).resolves.toEqual(result);
    expect(analyzeContextualSelection).not.toHaveBeenCalled();
    expect(canonicalizeWordFallback).not.toHaveBeenCalled();
  });
  it("keeps fallback articles separate from an unverified spelling verdict", async () => {
    vi.mocked(canonicalizeWordFallback).mockResolvedValue("das Haus");
    await expect(checkVocabularyWord("Haus", "de")).resolves.toEqual({ spelling: "unknown", correctedWord: "Haus", nounSuggestion: "das Haus" });
  });
  it.each(["en", "ru"] as const)("checks spelling in %s without inventing articles", async (language) => {
    const result = { spelling: "correct", correctedWord: "word", nounSuggestion: "" } as const;
    vi.mocked(checkWordWithGemini).mockResolvedValue(result);
    await expect(checkVocabularyWord("word", language)).resolves.toEqual(result);
    expect(checkWordWithGemini).toHaveBeenCalledWith("word", language, "", undefined, undefined);
  });
  it("does not start a word check after cancellation", async () => {
    const controller = new AbortController(); controller.abort();
    await expect(checkVocabularyWord("Haus", "de", "", controller.signal)).rejects.toThrow();
    expect(checkWordWithGemini).not.toHaveBeenCalled();
  });
  it.each([
    ["de", "Haus", "das Haus"], ["fr", "arbre", "l'arbre"],
    ["it", "studente", "lo studente"], ["es", "agua", "el agua"],
  ] as const)("uses Articles analysis for %s", async (language, word, canonicalWord) => {
    vi.mocked(analyzeContextualSelection).mockResolvedValue({ partOfSpeech: "NOUN", canonicalWord, translation: "", alternatives: [], translatedSentence: "" });
    await expect(suggestNounArticle(word, language)).resolves.toBe(canonicalWord);
    expect(canonicalizeWordFallback).not.toHaveBeenCalled();
  });
  it.each(["en", "ru"] as const)("does not invent noun articles in %s", async (language) => {
    await expect(suggestNounArticle("noun", language)).resolves.toBeUndefined();
    expect(analyzeContextualSelection).not.toHaveBeenCalled();
  });
  it("uses the same morphology fallback when Gemini is unavailable", async () => {
    vi.mocked(canonicalizeWordFallback).mockResolvedValue("die Tür");
    const controller = new AbortController();
    await expect(suggestNounArticle("Tür", "de", "Die Tür ist offen.", controller.signal)).resolves.toBe("die Tür");
    expect(canonicalizeWordFallback).toHaveBeenCalledWith("Tür", "Die Tür ist offen.", "de", undefined, controller.signal);
  });
  it("does not suggest an article for a verb or an unchanged noun", async () => {
    vi.mocked(analyzeContextualSelection).mockResolvedValue({ partOfSpeech: "VERB", canonicalWord: "gehen", translation: "", alternatives: [], translatedSentence: "" });
    await expect(suggestNounArticle("ging", "de")).resolves.toBeUndefined();
    vi.mocked(analyzeContextualSelection).mockResolvedValue(undefined);
    vi.mocked(canonicalizeWordFallback).mockResolvedValue("das Haus");
    await expect(suggestNounArticle("das Haus", "de")).resolves.toBeUndefined();
  });
  it("does not invent an article when fallback analysis is unavailable", async () => {
    vi.mocked(canonicalizeWordFallback).mockResolvedValue("Haus");
    await expect(suggestNounArticle("Haus", "de")).resolves.toBeUndefined();
  });
});
