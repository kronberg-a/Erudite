import type {
  AppData,
  Category,
  Language,
  PairData,
  Settings,
  WordCard,
} from "../types";
import { languages } from "../types";
import { seedPair } from "../i18n/seedData";
import { hydrateDailyProgress } from "../core/dailyGoal";
const KEY = "erudite:v2";
export const defaultSettings: Settings = {
  interfaceLanguage: "en",
  sourceLanguage: "en",
  targetLanguage: "de",
  instantMasterOnFirstTry: false,
  studyMode: "SWIPE_ONLY",
  strictAccents: true,
  theme: "light",
  dailyWordGoal: null,
};
export const pairKey = (source: Language, target: Language) =>
  `${source}-${target}`;
type StoredWord = WordCard & {
  interval?: number;
  nextReviewDate?: number;
  easeFactor?: number;
};
type StoredData = {
  version: number;
  settings: Settings;
  reviewOrder?: number;
  pairs: Record<string, { words: StoredWord[]; categories: Category[] }>;
};
const integer = (value: unknown) =>
  Number.isSafeInteger(value) && Number(value) >= 0;
function validStored(value: unknown, version: 1 | 2): boolean {
  const d = value as StoredData;
  const s = d?.settings;
  if (
    d?.version !== version ||
    !s ||
    ![s.interfaceLanguage, s.sourceLanguage, s.targetLanguage].every((l) =>
      languages.includes(l),
    ) ||
    s.sourceLanguage === s.targetLanguage ||
    !["light", "dark"].includes(s.theme) ||
    typeof s.instantMasterOnFirstTry !== "boolean" ||
    (s.studyMode !== undefined &&
      !["SWIPE_ONLY", "TYPE_ONLY", "MIXED"].includes(s.studyMode)) ||
    (s.strictAccents !== undefined && typeof s.strictAccents !== "boolean") ||
    (s.dailyWordGoal !== undefined && s.dailyWordGoal !== null &&
      (!integer(s.dailyWordGoal) || s.dailyWordGoal < 1 || s.dailyWordGoal > 50)) ||
    !d.pairs ||
    typeof d.pairs !== "object" ||
    Array.isArray(d.pairs)
  )
    return false;
  if (
    version === 2 &&
    (!integer(d.reviewOrder) ||
      !s.studyMode ||
      typeof s.strictAccents !== "boolean")
  )
    return false;
  return Object.entries(d.pairs).every(([key, p]) => {
    const [source, target, ...extra] = key.split("-");
    return (
      !extra.length &&
      source !== target &&
      languages.includes(source as Language) &&
      languages.includes(target as Language) &&
      !!p &&
      Array.isArray(p.words) &&
      Array.isArray(p.categories) &&
      p.categories.every(
        (c) =>
          !!c &&
          typeof c.id === "string" &&
          !!c.name &&
          languages.every((l) => typeof c.name[l] === "string") &&
          typeof c.isActiveForStudy === "boolean",
      ) &&
      p.words.every(
        (w) =>
          !!w &&
          typeof w.id === "string" &&
          typeof w.targetWord === "string" &&
          (w.transcription === undefined ||
            typeof w.transcription === "string") &&
          Array.isArray(w.translations) &&
          w.translations.every((t) => typeof t === "string") &&
          Array.isArray(w.categoryIds) &&
          w.categoryIds.every(
            (id) =>
              typeof id === "string" && p.categories.some((c) => c.id === id),
          ) &&
          Array.isArray(w.examples) &&
          w.examples.every(
            (e) =>
              !!e &&
              typeof e.targetSentence === "string" &&
              typeof e.translatedSentence === "string",
          ) &&
          ["NEW", "LEARNING", "REVIEW", "MASTERED"].includes(w.status) &&
          Number.isFinite(w.createdAt) &&
          (w.lastStudiedAt === undefined || Number.isFinite(w.lastStudiedAt)) &&
          integer(w.step) &&
          w.step <= (version === 1 ? 3 : 5) &&
          (version === 1 ||
            (w.status === "NEW"
              ? w.step === 0
              : w.status === "LEARNING"
                ? w.step <= 2
                : w.status === "REVIEW"
                  ? w.step >= 3 && w.step < 5
                  : w.step === 5)) &&
          (version === 1
            ? [w.interval, w.easeFactor, w.nextReviewDate].every(
                Number.isFinite,
              )
            : integer(w.repCount) &&
              integer(w.lastReviewedOrder) &&
              w.lastReviewedOrder <= d.reviewOrder!),
      ) &&
      new Set(p.words.map((w) => w.id)).size === p.words.length &&
      new Set(p.categories.map((c) => c.id)).size === p.categories.length
    );
  });
}
export function validateData(value: unknown): value is AppData {
  if (!validStored(value, 2)) return false;
  try {
    hydrateDailyProgress((value as AppData).dailyProgress);
    return true;
  } catch {
    return false;
  }
}
export function hydrateData(value: unknown): AppData {
  const legacy = validStored(value, 1);
  if (!legacy && !validateData(value))
    throw new Error("Invalid vocabulary backup");
  const d = value as StoredData;
  // Retain known relative recency. Historical repetition totals cannot be recovered;
  // the new counter starts at zero when migrating v1.
  const studied = Object.values(d.pairs)
    .flatMap((p) => p.words)
    .filter((w) => w.status !== "NEW")
    .sort(
      (a, b) =>
        (a.lastStudiedAt ?? a.createdAt) - (b.lastStudiedAt ?? b.createdAt),
    );
  const orders = new Map(studied.map((w, i) => [w, i + 1]));
  const settings: Settings = {
    interfaceLanguage: d.settings.interfaceLanguage,
    sourceLanguage: d.settings.sourceLanguage,
    targetLanguage: d.settings.targetLanguage,
    instantMasterOnFirstTry: d.settings.instantMasterOnFirstTry,
    studyMode: d.settings.studyMode ?? defaultSettings.studyMode,
    strictAccents: d.settings.strictAccents ?? true,
    theme: d.settings.theme,
    dailyWordGoal: d.settings.dailyWordGoal ?? null,
  };
  const pairs: Record<string, PairData> = Object.fromEntries(
    Object.entries(d.pairs).map(([key, p]) => [
      key,
      {
        categories: p.categories,
        words: p.words.map((w) => ({
          id: w.id,
          targetWord: w.targetWord,
          transcription: w.transcription,
          translations: w.translations,
          examples: w.examples,
          categoryIds: w.categoryIds,
          status: w.status,
          step: legacy
            ? w.status === "MASTERED"
              ? 5
              : w.status === "REVIEW"
                ? 3
                : w.status === "NEW"
                  ? 0
                  : Math.min(2, w.step)
            : w.step,
          repCount: legacy ? 0 : w.repCount,
          lastReviewedOrder: legacy
            ? (orders.get(w) ?? 0)
            : w.lastReviewedOrder,
          createdAt: w.createdAt,
          lastStudiedAt: w.lastStudiedAt,
        })),
      },
    ]),
  );
  return {
    version: 2,
    settings,
    pairs,
    reviewOrder: legacy ? studied.length : d.reviewOrder!,
    dailyProgress: hydrateDailyProgress((value as AppData).dailyProgress),
  };
}
export function loadData(): { data: AppData; error: boolean } {
  const initial: AppData = {
    version: 2,
    reviewOrder: 0,
    settings: defaultSettings,
    pairs: { "en-de": seedPair("en", "de") },
  };
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem("erudite:v1");
    return { data: raw ? hydrateData(JSON.parse(raw)) : initial, error: false };
  } catch {
    return { data: initial, error: true };
  }
}
export function saveData(data: AppData): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
