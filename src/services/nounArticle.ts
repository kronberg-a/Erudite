import type { Language } from "../types";
import { analyzeContextualSelection, canonicalizeWordFallback } from "./article";

const articles: Partial<Record<Language, RegExp>> = {
  de: /^(?:der|die|das)\s+\S/iu,
  fr: /^(?:(?:le|la)\s+|l['’])\S/iu,
  it: /^(?:(?:il|lo|la)\s+|l['’])\S/iu,
  es: /^(?:el|la)\s+\S/iu,
};

/** Use the reader's noun analysis, including its morphology fallback. */
export async function suggestNounArticle(
  word: string, language: Language, sentence = "", signal?: AbortSignal, apiKey?: string,
): Promise<string | undefined> {
  const pattern = articles[language];
  const text = word.trim();
  // English and Russian dictionary nouns have no article in Articles either.
  if (!pattern || !text || !/\p{L}/u.test(text)) return undefined;
  const context = sentence.trim() || text;
  const analysis = await analyzeContextualSelection({ word: text, sentence: context, from: language, to: language }, signal, apiKey);
  const canonical = analysis
    ? analysis.partOfSpeech === "NOUN" ? analysis.canonicalWord.trim() : ""
    : await canonicalizeWordFallback(text, context, language, undefined, signal);
  signal?.throwIfAborted();
  return canonical !== text && canonical.length <= 100 && pattern.test(canonical) ? canonical : undefined;
}
