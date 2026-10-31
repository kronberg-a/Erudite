import { afterEach, describe, expect, it, vi } from "vitest";
import {
  defaultSettings,
  hydrateData,
  loadData,
  saveData,
  validateData,
} from "./storage";
import { reviewCard, DAY } from "../core/srsEngine";
import { seedPair } from "../i18n/seedData";
import type { SavedArticle } from "../types";
const data = {
  version: 2 as const,
  reviewOrder: 0,
  settings: defaultSettings,
  pairs: { "en-de": seedPair("en", "de") },
};
afterEach(() => vi.unstubAllGlobals());
it("hydrates legacy omissions and round-trips saved articles in backups", () => {
  expect(hydrateData(data).pairs["en-de"].savedArticles).toEqual([]);
  const saved: SavedArticle = { id: "saved", title: "News", text: "Body", url: "", language: "de", createdAt: 1 };
  const backup = { ...data, pairs: { "en-de": { ...data.pairs["en-de"], savedArticles: [saved] } } };
  expect(validateData(backup)).toBe(true);
  const hydrated = hydrateData(JSON.parse(JSON.stringify(backup)));
  expect(hydrated.pairs["en-de"].savedArticles).toEqual([saved]);
  expect(hydrated.pairs["en-de"].savedArticles![0]).not.toBe(saved);
  for (const patch of [{ id: " " }, { title: "" }, { title: "a".repeat(301) }, { text: " " }, { text: "a".repeat(200001) }, { url: "a".repeat(4097) }, { language: "xx" }, { createdAt: Infinity }]) {
    const invalid = { ...backup, pairs: { "en-de": { ...backup.pairs["en-de"], savedArticles: [{ ...saved, ...patch }] } } };
    expect(validateData(invalid)).toBe(false);
    expect(() => hydrateData(invalid)).toThrow();
  }
  expect(validateData({ ...backup, pairs: { "en-de": { ...backup.pairs["en-de"], savedArticles: [saved, saved] } } })).toBe(false);
});
function legacyBackup() {
  const statuses = ["NEW", "LEARNING", "REVIEW", "MASTERED"];
  return {
    version: 1,
    settings: { ...defaultSettings, dailyNewCardsCap: 1 },
    pairs: {
      "en-de": {
        categories: data.pairs["en-de"].categories,
        introduced: { today: ["old"] },
        words: data.pairs["en-de"].words
          .slice(0, 4)
          .map((w, i) => ({
            ...w,
            status: statuses[i],
            step: i === 1 ? 2 : 0,
            interval: 100,
            easeFactor: 2.5,
            nextReviewDate: Number.MAX_SAFE_INTEGER,
            lastStudiedAt: i ? i * 100 : undefined,
          })),
      },
    },
  };
}
describe("continuous data and migration", () => {
  it("hydrates optional Gemini keys and rejects malformed key values", () => {
    const backup = { ...data, settings: { ...defaultSettings, geminiApiKey: "  test-key  " } };
    expect(hydrateData(backup).settings.geminiApiKey).toBe("test-key");
    expect(hydrateData(data).settings.geminiApiKey).toBeUndefined();
    for (const geminiApiKey of [42, "x".repeat(513), "key\nheader"]) {
      expect(validateData({ ...data, settings: { ...defaultSettings, geminiApiKey } })).toBe(false);
    }
  });
  it("round trips recovered ease, manual mastery, and the enabled instant setting", () => {
    const base = data.pairs["en-de"].words[0];
    const mastered = reviewCard(base, "master", defaultSettings, 1);
    const recovered = reviewCard({ ...base, id: "review", status: "REVIEW", step: 3, easeFactor: 2.3 }, "know", defaultSettings, 2);
    const current = { ...data, version: 3, reviewOrder: 2, settings: { ...defaultSettings, instantMasterOnFirstTry: true },
      pairs: { "en-de": { ...data.pairs["en-de"], words: [mastered, recovered] } } };
    expect(recovered.easeFactor).toBeGreaterThan(2.3);
    expect(validateData(current)).toBe(true);
    expect(hydrateData(JSON.parse(JSON.stringify(current)))).toMatchObject(current);
  });
  it("defaults older backups to unlimited and validates the goal range", () => {
    const oldSettings = { ...defaultSettings };
    delete (oldSettings as Partial<typeof oldSettings>).dailyWordGoal;
    expect(hydrateData({ ...data, settings: oldSettings }).settings.dailyWordGoal).toBeNull();
    for (const dailyWordGoal of [0, -1, 51, 1.5, "10"]) {
      expect(() => hydrateData({ ...data, settings: { ...defaultSettings, dailyWordGoal } })).toThrow();
    }
    for (const dailyWordGoal of [null, 1, 50]) {
      expect(hydrateData({ ...data, settings: { ...defaultSettings, dailyWordGoal } }).settings.dailyWordGoal).toBe(dailyWordGoal);
    }
  });
  it("round trips daily progress and rejects malformed progress", () => {
    const dailyProgress = { date: "2026-10-27", wordIds: ['["en-de","word"]'], acknowledgedGoal: 1 };
    expect(hydrateData({ ...data, dailyProgress }).dailyProgress).toEqual(dailyProgress);
    expect(() => hydrateData({ ...data, dailyProgress: { ...dailyProgress, wordIds: [3] } })).toThrow();
  });
  it("accepts current data and rejects malformed counters, versions and cards", () => {
    expect(validateData(data)).toBe(true);
    expect(validateData(null)).toBe(false);
    expect(validateData({ ...data, version: 4 })).toBe(false);
    expect(validateData({ ...data, reviewOrder: -1 })).toBe(false);
    expect(
      validateData({
        ...data,
        settings: { ...defaultSettings, sourceLanguage: "de" },
      }),
    ).toBe(false);
    expect(
      validateData({
        ...data,
        pairs: { "en-de": { ...data.pairs["en-de"], words: [{ id: "x" }] } },
      }),
    ).toBe(false);
    expect(
      validateData({
        ...data,
        pairs: {
          "en-de": {
            ...data.pairs["en-de"],
            words: [{ ...data.pairs["en-de"].words[0], lastReviewedOrder: 10 }],
          },
        },
      }),
    ).toBe(false);
  });
  it("migrates old progress with a fresh calendar schedule or invented repetition totals", () => {
    const migrated = hydrateData(legacyBackup());
    const words = migrated.pairs["en-de"].words;
    expect(validateData(migrated)).toBe(true);
    expect(words.map((w) => w.step)).toEqual([0, 2, 3, 3]);
    expect(words.map((w) => w.status)).toEqual([
      "NEW",
      "LEARNING",
      "REVIEW",
      "REVIEW",
    ]);
    expect(words.every((w) => w.repCount === 0)).toBe(true);
    expect(migrated.reviewOrder).toBe(3);
    for (const key of [
      "introduced",
      "dailyNewCardsCap",
    ])
      expect(JSON.stringify(migrated)).not.toContain(key);
  });
  it("loads the v1 key once and saves the migrated v3 dataset without deleting the old backup", () => {
    const raw = JSON.stringify(legacyBackup());
    const getItem = vi.fn((key: string) => (key === "erudite:v1" ? raw : null));
    const setItem = vi.fn();
    vi.stubGlobal("localStorage", { getItem, setItem });
    const loaded = loadData();
    expect(loaded.error).toBe(false);
    expect(saveData(loaded.data)).toBe(true);
    expect(setItem.mock.calls[0][0]).toBe("erudite:v3");
    expect(setItem).toHaveBeenCalledTimes(1);
  });
  it("preserves global review order on a current backup round trip", () => {
    const current = hydrateData({
      ...data,
      reviewOrder: 9,
      pairs: {
        "en-de": {
          ...data.pairs["en-de"],
          words: [
            {
              ...data.pairs["en-de"].words[0],
              status: "REVIEW",
              step: 4,
              repCount: 8,
              lastReviewedOrder: 9,
            },
          ],
        },
      },
    });
    expect(hydrateData(JSON.parse(JSON.stringify(current)))).toEqual(current);
  });
  it("round trips a scheduled card and rejects invalid calendar fields", () => {
    let card = data.pairs["en-de"].words[0];
    for (let i = 1; i <= 3; i++) card = reviewCard(card, "know", defaultSettings, i, { now: 100 });
    const current = { ...data, version: 3, reviewOrder: 3,
      pairs: { "en-de": { ...data.pairs["en-de"], words: [card] } } };
    expect(card.nextReviewDate).toBe(100 + DAY);
    expect(hydrateData(JSON.parse(JSON.stringify(current)))).toMatchObject(current);
    for (const invalid of [{ interval: -1 }, { nextReviewDate: "tomorrow" },
      { easeFactor: 0 }, { reviewRepetitions: 1.5 }, { step: 4 }]) {
      expect(validateData({ ...current, pairs: { "en-de": {
        ...current.pairs["en-de"], words: [{ ...card, ...invalid }],
      } } })).toBe(false);
    }
  });
  it("retains the v2 recovery copy when migrating old mastery", () => {
    const old = { ...data, pairs: { "en-de": { ...data.pairs["en-de"],
      words: [{ ...data.pairs["en-de"].words[0], status: "MASTERED", step: 5, repCount: 20 }],
    } } };
    const raw = JSON.stringify(old);
    const getItem = vi.fn((key: string) => key === "erudite:v2" ? raw : null);
    const setItem = vi.fn();
    vi.stubGlobal("localStorage", { getItem, setItem });
    const loaded = loadData();
    expect(loaded.error).toBe(false);
    expect(loaded.data.pairs["en-de"].words[0]).toMatchObject({
      status: "REVIEW", step: 3, interval: 1, repCount: 20, reviewRepetitions: 0,
    });
    saveData(loaded.data);
    expect(setItem).toHaveBeenCalledTimes(1);
    expect(setItem.mock.calls[0][0]).toBe("erudite:v3");
  });
  it("rejects corrupt legacy backup imports", () => {
    const bad = legacyBackup();
    bad.pairs["en-de"].words[0].targetWord = null as unknown as string;
    expect(() => hydrateData(bad)).toThrow();
  });
});

it("preserves and validates optional statistics across hydration and backup round trips", () => {
  const original = { ...data, activityLog: { "2026-10-31": 8 }, recallModes: { SWIPE_ONLY: 3, KEYBOARD: 4, TILES: 1 } };
  expect(validateData(original)).toBe(true);
  const hydrated = hydrateData(JSON.parse(JSON.stringify(original)));
  expect(hydrated.activityLog).toEqual(original.activityLog);
  expect(hydrated.recallModes).toEqual(original.recallModes);
  expect(hydrateData(hydrated)).toEqual(hydrated);
  expect(hydrateData(data).activityLog).toEqual({});
  for (const patch of [{ activityLog: [] }, { activityLog: { "2026-02-30": 4 } }, { activityLog: { "2026-10-31": -1 } }, { recallModes: { SWIPE_ONLY: "4" } }, { recallModes: { UNKNOWN: 1 } }]) {
    expect(validateData({ ...original, ...patch })).toBe(false);
    expect(() => hydrateData({ ...original, ...patch })).toThrow();
  }
});
