import type { AppData, Language, PairData, Settings } from "../types";
import { languages } from "../types";
import { seedPair } from "../i18n/seedData";
const KEY = "erudite:v1";
export const defaultSettings: Settings = {
  interfaceLanguage: "en",
  sourceLanguage: "en",
  targetLanguage: "de",
  dailyNewCardsCap: 10,
  instantMasterOnFirstTry: false,
  studyMode: "SWIPE_ONLY",
  strictAccents: true,
  theme: "light",
};
export const pairKey = (source: Language, target: Language) =>
  `${source}-${target}`;
function validPair(pair: PairData): boolean {
  return (
    !!pair &&
    Array.isArray(pair.words) &&
    Array.isArray(pair.categories) &&
    !!pair.introduced &&
    Object.values(pair.introduced).every(
      (v) => Array.isArray(v) && v.every((id) => typeof id === "string"),
    ) &&
    pair.categories.every(
      (c) =>
        !!c &&
        typeof c.id === "string" &&
        !!c.name &&
        languages.every((l) => typeof c.name[l] === "string") &&
        typeof c.isActiveForStudy === "boolean",
    ) &&
    pair.words.every(
      (w) =>
        !!w &&
        typeof w.id === "string" &&
        typeof w.targetWord === "string" &&
        Array.isArray(w.translations) &&
        w.translations.every((t) => typeof t === "string") &&
        Array.isArray(w.categoryIds) &&
        w.categoryIds.every(
          (id) =>
            typeof id === "string" && pair.categories.some((c) => c?.id === id),
        ) &&
        Array.isArray(w.examples) &&
        w.examples.every(
          (e) =>
            !!e &&
            typeof e.targetSentence === "string" &&
            typeof e.translatedSentence === "string",
        ) &&
        ["NEW", "LEARNING", "REVIEW", "MASTERED"].includes(w.status) &&
        [w.step, w.interval, w.easeFactor, w.nextReviewDate, w.createdAt].every(
          Number.isFinite,
        ) &&
        w.easeFactor >= 1.3 &&
        w.interval >= 0 &&
        Number.isInteger(w.step) &&
        Number.isInteger(w.interval) &&
        w.step >= 0 &&
        w.step <= 3,
    ) &&
    new Set(pair.words.map((w) => w.id)).size === pair.words.length &&
    new Set(pair.categories.map((c) => c.id)).size === pair.categories.length
  );
}
export function validateData(value: unknown): value is AppData {
  const d = value as AppData;
  const s = d?.settings;
  return (
    d?.version === 1 &&
    !!s &&
    [s.interfaceLanguage, s.sourceLanguage, s.targetLanguage].every((l) =>
      languages.includes(l),
    ) &&
    s.sourceLanguage !== s.targetLanguage &&
    ["light", "dark"].includes(s.theme) &&
    Number.isInteger(s.dailyNewCardsCap) &&
    s.dailyNewCardsCap >= 1 &&
    s.dailyNewCardsCap <= 100 &&
    typeof s.instantMasterOnFirstTry === "boolean" &&
    (s.studyMode === undefined ||
      ["SWIPE_ONLY", "TYPE_ONLY", "MIXED"].includes(s.studyMode)) &&
    (s.strictAccents === undefined || typeof s.strictAccents === "boolean") &&
    !!d.pairs &&
    typeof d.pairs === "object" &&
    !Array.isArray(d.pairs) &&
    Object.entries(d.pairs).every(([key, p]) => {
      const [source, target, ...extra] = key.split("-");
      return (
        !extra.length &&
        source !== target &&
        languages.includes(source as Language) &&
        languages.includes(target as Language) &&
        validPair(p)
      );
    })
  );
}
export function loadData(): { data: AppData; error: boolean } {
  const initial: AppData = {
    version: 1,
    settings: defaultSettings,
    pairs: { "en-de": seedPair("en", "de") },
  };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { data: initial, error: false };
    const parsed: unknown = JSON.parse(raw);
    if (!validateData(parsed)) throw new Error("Invalid storage");
    return { data: hydrateData(parsed), error: false };
  } catch {
    return { data: initial, error: true };
  }
}
// Older v1 datasets and backups gain additive settings without losing progress.
export function hydrateData(data: AppData): AppData {
  return {
    ...data,
    settings: {
      ...defaultSettings,
      ...data.settings,
      studyMode: data.settings.studyMode ?? defaultSettings.studyMode,
      strictAccents:
        data.settings.strictAccents ?? defaultSettings.strictAccents,
    },
  };
}
export function saveData(data: AppData): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
