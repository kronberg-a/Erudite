import type { Language } from "../types";
import { seedPair } from "../i18n/seedData";
import { isGeminiConfigured, translateWithGemini } from "./gemini";

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

function clean(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&(?:amp|lt|gt|quot|#39|#x27|apos|nbsp);/gi, (match) => ENTITIES[match.toLowerCase()] ?? match)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
}

function stripLeadingArticle(value: string, language: Language): string {
  return value
    .trim()
    .toLocaleLowerCase(language)
    .replace(/^(?:der|die|das|ein|eine|le|la|les|un|une|il|lo|gli|i|el|los|las)\s+|^l['’]/u, "")
    .trim();
}

interface GtxSentence {
  trans?: unknown;
}

interface GtxDictEntry {
  word?: unknown;
}

interface GtxDictGroup {
  terms?: unknown;
  entry?: unknown;
}

interface GtxResponse {
  sentences?: unknown;
  dict?: unknown;
}

function parseGtxPayload(
  data: unknown,
  to: Language,
): { primary: string; alternatives: string[] } {
  let sentenceSegments: string[] = [];
  let rawTerms: string[] = [];

  if (Array.isArray(data)) {
    if (Array.isArray(data[0])) {
      sentenceSegments = data[0].flatMap((seg: unknown) =>
        Array.isArray(seg) && typeof seg[0] === "string" ? [seg[0]] : [],
      );
    }
    if (Array.isArray(data[1])) {
      rawTerms = data[1].flatMap((group: unknown) => {
        if (!Array.isArray(group)) return [];
        const terms = Array.isArray(group[1])
          ? group[1].filter((t): t is string => typeof t === "string")
          : [];
        return terms;
      });
    }
  } else if (data && typeof data === "object") {
    const obj = data as GtxResponse;
    if (Array.isArray(obj.sentences)) {
      sentenceSegments = obj.sentences.flatMap((s: GtxSentence) =>
        typeof s?.trans === "string" ? [s.trans] : [],
      );
    }
    if (Array.isArray(obj.dict)) {
      rawTerms = obj.dict.flatMap((group: GtxDictGroup) => {
        const terms = Array.isArray(group?.terms)
          ? group.terms.filter((t): t is string => typeof t === "string")
          : [];
        const entries = Array.isArray(group?.entry)
          ? group.entry.flatMap((e: GtxDictEntry) =>
              typeof e?.word === "string" ? [e.word] : [],
            )
          : [];
        return [...terms, ...entries];
      });
    }
  }

  const joinedSentence = clean(sentenceSegments.join(""));
  const dictTerms = [...new Set(rawTerms.map(clean).filter(Boolean))];

  const primary =
    dictTerms.length > 0 &&
    dictTerms[0].toLocaleLowerCase(to) === joinedSentence.toLocaleLowerCase(to)
      ? dictTerms[0]
      : joinedSentence || dictTerms[0] || "";

  if (!primary) throw new Error("Empty translation");

  const primaryLower = primary.toLocaleLowerCase(to);
  const seen = new Set<string>([primaryLower]);
  const alternatives: string[] = [];

  for (const term of dictTerms) {
    const lower = term.toLocaleLowerCase(to);
    if (!seen.has(lower)) {
      seen.add(lower);
      alternatives.push(term);
      if (alternatives.length >= 5) break;
    }
  }

  return { primary, alternatives };
}

export async function translate(
  text: string,
  from: Language,
  to: Language,
  signal?: AbortSignal,
): Promise<{ primary: string; alternatives: string[]; offline?: boolean }> {
  const query = text.trim();
  if (!query) throw new Error("Empty translation");
  if (isGeminiConfigured()) {
    const gemini = await translateWithGemini(query, from, to, signal);
    if (gemini) return gemini;
  }
  try {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", from);
    url.searchParams.set("tl", to);
    url.searchParams.append("dt", "t");
    url.searchParams.append("dt", "bd");
    url.searchParams.set("dj", "1");
    url.searchParams.set("q", query);
    const timeout = AbortSignal.timeout(10_000);
    const response = await fetch(url, {
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
    if (!response.ok) throw new Error("Translation unavailable");
    const data: unknown = await response.json();
    return parseGtxPayload(data, to);
  } catch (error) {
    if (signal?.aborted) throw error;
    // Offline fallback uses the curated multilingual dictionary, matching exact or article-stripped words.
    const words = seedPair(to, from).words;
    const lowerQuery = query.toLocaleLowerCase(from);
    const bareQuery = stripLeadingArticle(query, from);
    const match =
      words.find((w) => w.targetWord.toLocaleLowerCase(from) === lowerQuery) ??
      words.find((w) => stripLeadingArticle(w.targetWord, from) === bareQuery);
    if (match) {
      return {
        primary: match.translations[0],
        alternatives: match.translations.slice(1, 6),
        offline: true,
      };
    }
    throw new Error("Translation unavailable");
  }
}
