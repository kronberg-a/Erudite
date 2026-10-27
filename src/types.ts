export const languages = ["en", "ru", "de", "fr", "it", "es"] as const;
export type Language = (typeof languages)[number];
export const languageNames: Record<Language, string> = {
  en: "English",
  ru: "Русский",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  es: "Español",
};
export type WordStatus = "NEW" | "LEARNING" | "REVIEW" | "MASTERED";
export interface WordCard {
  id: string;
  targetWord: string;
  transcription?: string;
  translations: string[];
  examples: { targetSentence: string; translatedSentence: string }[];
  categoryIds: string[];
  status: WordStatus;
  step: number;
  repCount: number;
  lastReviewedOrder: number;
  createdAt: number;
  lastStudiedAt?: number;
}
export interface Category {
  id: string;
  name: Record<Language, string>;
  isCustom?: boolean;
  isActiveForStudy: boolean;
}
export interface Settings {
  interfaceLanguage: Language;
  sourceLanguage: Language;
  targetLanguage: Language;
  instantMasterOnFirstTry: boolean;
  studyMode: "SWIPE_ONLY" | "TYPE_ONLY" | "MIXED";
  strictAccents: boolean;
  theme: "light" | "dark";
  dailyWordGoal: number | null;
}
export interface DailyProgress {
  date: string;
  wordIds: string[];
  acknowledgedGoal: number | null;
}
export interface PairData {
  words: WordCard[];
  categories: Category[];
}
export interface AppData {
  version: 2;
  reviewOrder: number;
  dailyProgress?: DailyProgress;
  settings: Settings;
  pairs: Record<string, PairData>;
}
export type Mode = "mixed" | "new" | "review";
export type Action = "know" | "repeat" | "master";
export type Evaluation = "CORRECT" | "ASSISTED" | "INCORRECT";
export type TypingInput = "KEYBOARD" | "TILES";
export type StudySelection = { kind: "word" | "category"; id: string };
