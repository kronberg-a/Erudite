import { languages } from "../types";
import type { Category, Language, PairData, WordCard } from "../types";

export interface Article { title: string; text: string; url: string; language?: string }
export interface CollectedWord { word: string; translation: string; sentence: string }
export async function importArticle(url: string, signal?: AbortSignal): Promise<Article> {
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Invalid URL");
  const combinedSignal = AbortSignal.any([AbortSignal.timeout(20_000), ...(signal ? [signal] : [])]);
  const endpoints =
    typeof location !== "undefined" && location.protocol === "file:"
      ? ["http://127.0.0.1:5173/api/article", "http://127.0.0.1:3000/api/article"]
      : ["/api/article"];
  let response: Response | undefined;
  for (const endpoint of endpoints) {
    try {
      response = await fetch(`${endpoint}?url=${encodeURIComponent(parsed.href)}`, { signal: combinedSignal });
      if (response.ok) break;
    } catch (err) {
      if (combinedSignal.aborted || endpoint === endpoints[endpoints.length - 1]) throw err;
    }
  }
  if (!response?.ok) throw new Error("Article import failed");
  const data = await response.json();
  if (typeof data.title !== "string" || typeof data.text !== "string" || !data.text.trim() ||
      data.text.length > 2_000_000 || typeof data.url !== "string") throw new Error("Invalid article");
  return { title: data.title, text: data.text, url: data.url, language: typeof data.language === "string" ? data.language : undefined };
}
export function wordParts(text: string): string[] {
  return text.split(/(\p{L}[\p{L}\p{M}]*(?:['’\-][\p{L}\p{M}]+)*)/gu);
}
export function sentenceAt(text: string, offset: number): string {
  for (const match of text.matchAll(/[^.!?\n]+(?:[.!?]+|$)/gu)) {
    if (offset >= match.index && offset < match.index + match[0].length) return match[0].trim();
  }
  return "";
}
export const wordKey = (word: string, language: Language) => word.trim().normalize("NFC").toLocaleLowerCase(language);
export function collectArticleWords(pair: PairData, entries: CollectedWord[], folderName: string, language: Language) {
  if (!folderName.trim() || !entries.length || entries.length > 50 || entries.some((e) => !e.word.trim() || !e.translation.trim()))
    throw new Error("Invalid collection");
  const folderId = crypto.randomUUID();
  const category: Category = {
    id: folderId, isCustom: true, isActiveForStudy: true,
    name: Object.fromEntries(languages.map((l) => [l, folderName.trim().slice(0, 80)])) as Category["name"],
  };
  const words = [...pair.words];
  for (const entry of entries) {
    const index = words.findIndex((w) => wordKey(w.targetWord, language) === wordKey(entry.word, language));
    if (index >= 0) {
      words[index] = { ...words[index], categoryIds: [...new Set([...words[index].categoryIds, folderId])] };
    } else {
      const word: WordCard = {
        id: crypto.randomUUID(), targetWord: entry.word.trim(), translations: [entry.translation.trim()],
        examples: entry.sentence.trim() ? [{ targetSentence: entry.sentence.trim(), translatedSentence: "" }] : [],
        categoryIds: [folderId], status: "NEW", step: 0, repCount: 0, lastReviewedOrder: 0, createdAt: Date.now(),
      };
      words.push(word);
    }
  }
  return { pair: { words, categories: [...pair.categories, category] }, folderId };
}
