import { languages } from "../types";
import { analyzeSelectionWithGemini } from "./gemini";
import { guessGermanGender, normalizeGermanNoun } from "./germanNouns";
export { analyzeSelectionWithGemini as analyzeContextualSelection } from "./gemini";
import type { Category, Language, PairData, SavedArticle, WordCard } from "../types";

export interface Article { title: string; text: string; url: string; language?: string }
export const MAX_SAVED_ARTICLES = 50;
export const MAX_SAVED_ARTICLE_CHARS = 100_000;
function normalizedUrl(raw: string): string {
  try { const url = new URL(raw.trim()); url.hash = ""; return url.href; }
  catch { return raw.trim(); }
}
export function matchingSavedArticle(pair: PairData, article: Article): SavedArticle | undefined {
  const url = normalizedUrl(article.url);
  return pair.savedArticles?.find((a) => (url && normalizedUrl(a.url) === url) ||
    (a.title.trim() === article.title.trim().slice(0, 300) && a.text.trim() === article.text.trim().slice(0, MAX_SAVED_ARTICLE_CHARS)));
}
export function saveArticle(pair: PairData, article: Article): { pair: PairData; saved: SavedArticle } {
  if (!article.title.trim() || !article.text.trim()) throw new Error("Empty article");
  const existing = matchingSavedArticle(pair, article);
  const saved: SavedArticle = {
    id: existing?.id ?? crypto.randomUUID(), createdAt: existing?.createdAt ?? Date.now(),
    title: article.title.trim().slice(0, 300), text: article.text.trim().slice(0, MAX_SAVED_ARTICLE_CHARS),
    url: normalizedUrl(article.url).slice(0, 4096),
    language: languages.includes(article.language as Language) ? article.language as Language : undefined,
  };
  return { saved, pair: { ...pair, savedArticles: [saved, ...(pair.savedArticles ?? []).filter((a) => a.id !== saved.id)].slice(0, MAX_SAVED_ARTICLES) } };
}
export function deleteSavedArticle(pair: PairData, id: string): PairData {
  return { ...pair, savedArticles: (pair.savedArticles ?? []).filter((a) => a.id !== id) };
}
export interface CollectedWord { word: string; translation: string; sentence: string; translatedSentence?: string }
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
export function articleWordStats(text: string, words: WordCard[], language: Language): { total: number; learned: number } {
  const tokens = (value: string) => wordParts(value).filter((_, index) => index % 2 === 1)
    .map((word) => word.normalize("NFC").toLocaleLowerCase(language));
  const articleTokens = tokens(text);
  const content = ` ${articleTokens.join(" ")} `;
  const learned = new Set<string>();
  for (const word of words) {
    if (word.status !== "MASTERED") continue;
    const key = tokens(word.targetWord).join(" ");
    if (!key || learned.has(key)) continue;
    // Saved example sentences link normalized or nonadjacent selections back
    // to the article even when their dictionary form differs from its text.
    const appears = content.includes(` ${key} `) || word.examples.some((example) => {
      const sentence = tokens(example.targetSentence).join(" ");
      return !!sentence && content.includes(` ${sentence} `);
    });
    if (appears) learned.add(key);
  }
  return { total: articleTokens.length, learned: learned.size };
}
export function sentenceAt(text: string, offset: number): string {
  return sentenceContextAt(text, offset).sentence;
}
export function sentenceContextAt(text: string, offset: number): { sentence: string; wordOffset: number } {
  for (const match of text.matchAll(/[^.!?\n]+(?:[.!?]+|$)/gu)) {
    if (offset >= match.index && offset < match.index + match[0].length) {
      const raw = match[0];
      const leading = raw.length - raw.trimStart().length;
      return {
        sentence: raw.trim(),
        wordOffset: Math.max(0, offset - (match.index + leading)),
      };
    }
  }
  return { sentence: "", wordOffset: 0 };
}
const UDPIPE_MODELS: Record<Language, string> = {
  en: "english-ewt-ud-2.17-251125",
  ru: "russian-syntagrus-ud-2.17-251125",
  de: "german-hdt-ud-2.17-251125",
  fr: "french-partut-ud-2.17-251125",
  it: "italian-isdt-ud-2.17-251125",
  es: "spanish-ancora-ud-2.17-251125",
};
const FRENCH_ASPIRATED_H = new Set([
  "hache", "haie", "haine", "hall", "halte", "hamac", "hamburger", "hameau", "hanche", "handicap",
  "hangar", "haricot", "harpe", "hasard", "hâte", "hausse", "haut", "hauteur", "hérisson", "héros",
  "hêtre", "hibou", "hiérarchie", "homard", "honte", "horde", "hors", "houblon", "houle", "housse",
  "hublot", "huée", "huit", "hurlement", "hutte",
]);
interface UdToken {
  id: number;
  form: string;
  lemma: string;
  upos: string;
  feats: Record<string, string>;
  head: number;
  deprel: string;
  start?: number;
  end?: number;
}
function inferNounGender(
  token: UdToken,
  sentenceTokens: UdToken[],
  singular: string,
  language: Language,
): "Masc" | "Fem" | "Neut" | undefined {
  const direct = token.feats.Gender;
  if (direct === "Masc" || direct === "Fem" || direct === "Neut") return direct;
  for (const dep of sentenceTokens) {
    if (dep.head === token.id && (dep.deprel === "det" || dep.deprel === "amod")) {
      const g = dep.feats.Gender;
      if (g === "Masc" || g === "Fem" || g === "Neut") return g;
    }
  }
  const lower = singular.toLocaleLowerCase(language);
  if (language === "de") {
    const dependents = sentenceTokens.filter((dep) => dep.head === token.id && (dep.deprel === "det" || dep.deprel === "case"));
    for (const dep of dependents) {
      const form = dep.form.toLocaleLowerCase("de");
      if (form === "zur") return "Fem";
      if (["ins", "ans", "das"].includes(form) && dep.feats.Number !== "Plur") return "Neut";
      if (form === "die" && token.feats.Number !== "Plur" && dep.feats.Number !== "Plur") return "Fem";
    }
    const guessed = guessGermanGender(singular);
    const masculineOrNeuter = dependents.some((dep) => /^(?:im|am|zum|vom|beim|dem|ein|kein)$/iu.test(dep.form) || dep.feats.Gender === "Masc,Neut");
    return masculineOrNeuter && guessed === "Fem" ? "Masc" : guessed;
  }
  if (language === "fr") {
    return /(?:tion|sion|té|ure|ence|ance|ie|ade|ette|elle|euse|rice|esse|aison)$/u.test(lower) ? "Fem" : "Masc";
  }
  if (language === "es") {
    if (/^(?:problema|tema|sistema|idioma|planeta|mapa|poeta|día|clima|programa|sofá)$/u.test(lower)) return "Masc";
    return /(?:dad|tad|ción|sión|tud|umbre|za|cia|a)$/u.test(lower) ? "Fem" : "Masc";
  }
  if (language === "it") {
    if (/^(?:problema|tema|sistema|pianeta|poeta|clima|programma)$/u.test(lower)) return "Masc";
    return /(?:tà|tù|zione|sione|gione|udine|igine|ice|a)$/u.test(lower) ? "Fem" : "Masc";
  }
  return undefined;
}
function formatSingularNounWithArticle(
  rawLemma: string,
  token: UdToken,
  sentenceTokens: UdToken[],
  language: Language,
): string {
  if (language === "de") {
    const singular = rawLemma.charAt(0).toLocaleUpperCase("de") + rawLemma.slice(1);
    const gender = inferNounGender(token, sentenceTokens, singular, "de");
    const article = gender === "Masc" ? "der" : gender === "Fem" ? "die" : gender === "Neut" ? "das" : "";
    return article ? `${article} ${singular}` : singular;
  }
  const singular = rawLemma.toLocaleLowerCase(language);
  if (language === "en" || language === "ru") return singular;
  const gender = inferNounGender(token, sentenceTokens, singular, language);
  if (language === "fr") {
    const startsWithVowel = /^[aeiouyàâäéèêëîïôöùûüœ]/iu.test(singular);
    const startsWithMuteH = /^h/iu.test(singular) && !FRENCH_ASPIRATED_H.has(singular);
    if (startsWithVowel || startsWithMuteH) return `l'${singular}`;
    return gender === "Fem" ? `la ${singular}` : `le ${singular}`;
  }
  if (language === "es") {
    if (gender === "Fem" && !/^(?:á|há|agua|águila|alma|arma|aula|área|hacha|hada|hambre)$/iu.test(singular)) {
      return `la ${singular}`;
    }
    return `el ${singular}`;
  }
  if (language === "it") {
    if (/^[aeiouàèéìíîòóùú]/iu.test(singular)) return `l'${singular}`;
    if (gender === "Fem") return `la ${singular}`;
    if (/^(?:s[bcdfghjklmnpqrstvwxz]|z|gn|ps|pn|x|y|sc[eièéìí])/iu.test(singular)) return `lo ${singular}`;
    return `il ${singular}`;
  }
  return singular;
}
export function parseConlluCanonical(
  conllu: string,
  word: string,
  language: Language,
  wordOffset?: number,
): string {
  const trimmed = word.trim();
  if (!trimmed || !conllu.trim()) return trimmed;
  const sentences: UdToken[][] = [];
  let current: UdToken[] = [];
  for (const rawLine of conllu.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line) {
      if (current.length) {
        sentences.push(current);
        current = [];
      }
      continue;
    }
    if (line.startsWith("#")) continue;
    const cols = line.split("\t");
    if (cols.length < 10 || !/^\d+$/u.test(cols[0])) continue;
    const feats: Record<string, string> = {};
    if (cols[5] && cols[5] !== "_") {
      for (const pair of cols[5].split("|")) {
        const [k, v] = pair.split("=");
        if (k && v) feats[k] = v;
      }
    }
    const rangeMatch = /TokenRange=(\d+):(\d+)/u.exec(cols[9]);
    current.push({
      id: Number(cols[0]),
      form: cols[1],
      lemma: cols[2],
      upos: cols[3],
      feats,
      head: Number(cols[6]) || 0,
      deprel: cols[7],
      start: rangeMatch ? Number(rangeMatch[1]) : undefined,
      end: rangeMatch ? Number(rangeMatch[2]) : undefined,
    });
  }
  if (current.length) sentences.push(current);
  const allTokens = sentences.flatMap((sentenceTokens) =>
    sentenceTokens.map((token) => ({ token, sentenceTokens })),
  );
  if (!allTokens.length) return trimmed;
  if (/\s/u.test(trimmed)) {
    const parts = wordParts(trimmed)
      .filter((_, i) => i % 2 === 1)
      .map((p) => p.toLocaleLowerCase(language));
    if (parts.length === 2 && (language === "de" || language === "en")) {
      for (const sentenceTokens of sentences) {
        for (const verb of sentenceTokens) {
          if (verb.upos !== "VERB" && verb.upos !== "AUX") continue;
          const prt = sentenceTokens.find(
            (t) => t.head === verb.id && t.deprel === "compound:prt",
          );
          if (!prt) continue;
          const vForm = verb.form.toLocaleLowerCase(language);
          const pForm = prt.form.toLocaleLowerCase(language);
          if (
            (vForm === parts[0] && pForm === parts[1]) ||
            (vForm === parts[1] && pForm === parts[0])
          ) {
            const base = (verb.lemma && verb.lemma !== "_" ? verb.lemma : verb.form)
              .trim()
              .toLocaleLowerCase(language);
            const particle = (prt.lemma && prt.lemma !== "_" ? prt.lemma : prt.form)
              .trim()
              .toLocaleLowerCase(language);
            return language === "de"
              ? base.startsWith(particle)
                ? base
                : `${particle}${base}`
              : `${base} ${particle}`;
          }
        }
      }
    }
    return trimmed;
  }
  const lowerWord = trimmed.toLocaleLowerCase(language);
  const bareLower = lowerWord.replace(/^(?:l|d|s|n|m|t|j|c|qu|gl|un)['’]/u, "");
  const posPriority = (upos: string) =>
    upos === "VERB" || upos === "NOUN" || upos === "ADJ" ? 0 : upos === "AUX" ? 1 : 2;
  let matched: { token: UdToken; sentenceTokens: UdToken[] } | undefined;
  if (typeof wordOffset === "number" && wordOffset >= 0) {
    const spanEnd = wordOffset + trimmed.length;
    const overlapping = allTokens.filter(
      ({ token }) =>
        token.start !== undefined &&
        token.end !== undefined &&
        token.start < spanEnd &&
        token.end > wordOffset,
    );
    if (overlapping.length) {
      overlapping.sort(
        (a, b) =>
          posPriority(a.token.upos) - posPriority(b.token.upos) ||
          Number(a.token.form.toLocaleLowerCase(language) !== lowerWord) -
            Number(b.token.form.toLocaleLowerCase(language) !== lowerWord) ||
          Math.abs((a.token.start ?? 0) - wordOffset) -
            Math.abs((b.token.start ?? 0) - wordOffset),
      );
      matched = overlapping[0];
    }
  }
  if (!matched) {
    const formMatches = allTokens.filter(({ token }) => {
      const formLower = token.form.toLocaleLowerCase(language);
      return formLower === lowerWord || (bareLower && formLower === bareLower);
    });
    if (formMatches.length) {
      if (typeof wordOffset === "number") {
        formMatches.sort(
          (a, b) =>
            Math.abs((a.token.start ?? 0) - wordOffset) -
            Math.abs((b.token.start ?? 0) - wordOffset),
        );
      }
      matched = formMatches[0];
    }
  }
  if (!matched) return trimmed;
  const { token, sentenceTokens } = matched;
  if ((language === "de" || language === "en") && token.deprel === "compound:prt") {
    const headVerb = sentenceTokens.find((t) => t.id === token.head && t.upos === "VERB");
    if (headVerb && headVerb.lemma && headVerb.lemma !== "_") {
      const prefix = (token.lemma && token.lemma !== "_" ? token.lemma : token.form).trim().toLocaleLowerCase(language);
      const base = headVerb.lemma.trim().toLocaleLowerCase(language);
      if (language === "de") return base.startsWith(prefix) ? base : `${prefix}${base}`;
      return `${base} ${prefix}`;
    }
  }
  if (token.upos === "VERB" || token.upos === "AUX") {
    if (!token.lemma || token.lemma === "_") return trimmed;
    let infinitive = token.lemma.trim().toLocaleLowerCase(language);
    if (language === "de" || language === "en") {
      const prt = sentenceTokens.find((t) => t.head === token.id && t.deprel === "compound:prt");
      if (prt) {
        const prefix = (prt.lemma && prt.lemma !== "_" ? prt.lemma : prt.form).trim().toLocaleLowerCase(language);
        if (prefix) {
          if (language === "de" && !infinitive.startsWith(prefix)) infinitive = `${prefix}${infinitive}`;
          else if (language === "en") infinitive = `${infinitive} ${prefix}`;
        }
      }
    }
    return infinitive;
  }
  if (token.upos === "NOUN") {
    const rawLemma = language === "de"
      ? normalizeGermanNoun(token.form, token.lemma, token.feats.Number === "Plur")
      : (token.lemma && token.lemma !== "_" && token.lemma !== "unknown" ? token.lemma : token.form).trim();
    if (!rawLemma) return trimmed;
    return formatSingularNounWithArticle(rawLemma, token, sentenceTokens, language);
  }
  if (token.upos === "ADJ") {
    if (!token.lemma || token.lemma === "_") return trimmed;
    return token.lemma.trim().toLocaleLowerCase(language);
  }
  return trimmed;
}
function stripLeadingMarker(value: string, language: Language): { marker: string; core: string } {
  const trimmed = value.trim();
  const patterns: Record<Language, RegExp> = {
    en: /^(?:(?:the|a|an|to)\s+)/iu,
    de: /^(?:(?:der|die|das|ein|eine|einen|einem|einer)\s+)/iu,
    fr: /^(?:(?:le|la|les|un|une|des)\s+|l['’])/iu,
    it: /^(?:(?:il|lo|la|i|gli|le|un|uno|una)\s+|(?:l|un)['’])/iu,
    es: /^(?:(?:el|la|los|las|un|una|unos|unas)\s+)/iu,
    ru: /^$/u,
  };
  const match = patterns[language].exec(trimmed);
  if (!match || !match[0]) return { marker: "", core: trimmed };
  const core = trimmed.slice(match[0].length).trim();
  return core ? { marker: match[0], core } : { marker: "", core: trimmed };
}
function normalizeTokenStem(token: string, language: Language): string {
  if (token.length < 3) return token;
  if (language === "en") {
    const stem = token
      .replace(/ies$/u, "y")
      .replace(/ied$/u, "y")
      .replace(/(?:ing|ed|en|er|est|es|s)$/u, "")
      .replace(/([bcdfghjklmnpqrstvwxz])\1$/u, "$1")
      .replace(/e$/u, "");
    return stem.length >= 3 ? stem : token;
  }
  if (language === "ru") {
    const stem = token.replace(
      /(?:ами|ями|ого|его|ому|ему|ться|тся|ешь|ете|ают|яют|или|али|яли|ов|ев|ей|ам|ям|ах|ях|ом|ем|ой|ую|юю|ый|ий|ая|яя|ое|ее|ые|ие|ым|им|ых|их|ть|ти|чь|ал|ял|ил|ла|ло|ли|а|я|у|ю|е|и|ы|о)$/u,
      "",
    );
    return stem.length >= 3 ? stem : token;
  }
  return token;
}
function tokensMatchInContext(candidateToken: string, sentenceToken: string, language: Language): boolean {
  if (candidateToken === sentenceToken) return true;
  if (candidateToken.length < 3 || sentenceToken.length < 3) return false;
  const stemA = normalizeTokenStem(candidateToken, language);
  const stemB = normalizeTokenStem(sentenceToken, language);
  if (stemA.length >= 3 && stemA === stemB) return true;
  if (candidateToken.length >= 4 && sentenceToken.length >= 4) {
    let common = 0;
    while (
      common < candidateToken.length &&
      common < sentenceToken.length &&
      candidateToken[common] === sentenceToken[common]
    ) {
      common++;
    }
    if (
      common >= 4 &&
      common >= Math.min(candidateToken.length, sentenceToken.length) - 2 &&
      Math.abs(candidateToken.length - sentenceToken.length) <= 4
    ) {
      return true;
    }
  }
  return false;
}
export function selectContextualTranslation(
  primary: string,
  alternatives: string[],
  translatedSentence: string | undefined,
  language: Language,
): string {
  const cleanPrimary = primary.trim();
  const cleanSentence = translatedSentence?.trim() ?? "";
  if (!cleanPrimary || !cleanSentence || !alternatives.length) return primary;
  const sentenceTokens = wordParts(cleanSentence.toLocaleLowerCase(language)).filter((_, i) => i % 2 === 1);
  if (!sentenceTokens.length) return primary;
  const primaryParts = stripLeadingMarker(cleanPrimary, language);
  const seen = new Set<string>([cleanPrimary.toLocaleLowerCase(language)]);
  const allCandidates = [cleanPrimary];
  for (const alt of alternatives) {
    const trimmedAlt = alt.trim();
    const lower = trimmedAlt.toLocaleLowerCase(language);
    if (trimmedAlt && !seen.has(lower)) {
      seen.add(lower);
      allCandidates.push(trimmedAlt);
    }
  }
  if (allCandidates.length <= 1) return primary;
  let bestCandidate = cleanPrimary;
  let bestScore = 0;
  let bestTier = 0;
  for (const candidate of allCandidates) {
    const { core } = stripLeadingMarker(candidate, language);
    const coreTokens = wordParts(core.toLocaleLowerCase(language)).filter((_, i) => i % 2 === 1);
    if (!coreTokens.length) continue;
    let isContiguousExact = false;
    for (let i = 0; i <= sentenceTokens.length - coreTokens.length; i++) {
      if (coreTokens.every((ct, idx) => sentenceTokens[i + idx] === ct)) {
        isContiguousExact = true;
        break;
      }
    }
    if (isContiguousExact) {
      const score = coreTokens.length;
      const tier = 2;
      if (score > bestScore || (score === bestScore && tier > bestTier)) {
        bestScore = score;
        bestTier = tier;
        bestCandidate = candidate;
      }
      continue;
    }
    let pos = 0;
    let matchedAll = true;
    for (const ct of coreTokens) {
      let found = -1;
      for (let j = pos; j < sentenceTokens.length; j++) {
        if (tokensMatchInContext(ct, sentenceTokens[j], language)) {
          found = j;
          break;
        }
      }
      if (found < 0) {
        matchedAll = false;
        break;
      }
      pos = found + 1;
    }
    if (matchedAll) {
      const score = coreTokens.length;
      const tier = 1;
      if (score > bestScore || (score === bestScore && tier > bestTier)) {
        bestScore = score;
        bestTier = tier;
        bestCandidate = candidate;
      }
    }
  }
  if (bestScore === 0 || bestCandidate === cleanPrimary) return primary;
  const bestParts = stripLeadingMarker(bestCandidate, language);
  if (primaryParts.marker && !bestParts.marker) {
    return `${primaryParts.marker}${bestCandidate}`;
  }
  return bestCandidate;
}
export async function canonicalizeWord(
  word: string,
  sentence: string,
  language: Language,
  wordOffset?: number,
  signal?: AbortSignal,
): Promise<string> {
  const result = await analyzeSelectionWithGemini({ word, sentence, from: language, to: language, wordOffset }, signal);
  if (result) return result.canonicalWord;
  return canonicalizeWordFallback(word, sentence, language, wordOffset, signal);
}
export async function canonicalizeWordFallback(
  word: string, sentence: string, language: Language, wordOffset?: number, signal?: AbortSignal,
): Promise<string> {
  const trimmed = word.trim();
  const context = sentence.trim();
  const wordTokens = wordParts(trimmed).filter((_, i) => i % 2 === 1);
  if (!trimmed || !context || wordTokens.length === 0 || wordTokens.length > 2) return trimmed;
  try {
    const url = new URL("https://lindat.mff.cuni.cz/services/udpipe/api/process");
    url.searchParams.set("data", context);
    url.searchParams.set("model", UDPIPE_MODELS[language]);
    url.searchParams.set("tokenizer", "ranges");
    url.searchParams.set("tagger", "");
    url.searchParams.set("parser", "");
    const timeout = AbortSignal.timeout(8_000);
    const response = await fetch(url, {
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
    if (!response.ok) return trimmed;
    const data: unknown = await response.json();
    const conllu =
      data && typeof data === "object" && "result" in data && typeof (data as { result?: unknown }).result === "string"
        ? (data as { result: string }).result
        : "";
    if (!conllu) return trimmed;
    return parseConlluCanonical(conllu, trimmed, language, wordOffset);
  } catch (err) {
    if (signal?.aborted) throw err;
    return trimmed;
  }
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
        examples: entry.sentence.trim() ? [{ targetSentence: entry.sentence.trim(), translatedSentence: entry.translatedSentence?.trim() || "" }] : [],
        categoryIds: [folderId], status: "NEW", step: 0, repCount: 0, lastReviewedOrder: 0, createdAt: Date.now(),
      };
      words.push(word);
    }
  }
  return { pair: { ...pair, words, categories: [...pair.categories, category] }, folderId };
}
