import { afterEach, describe, expect, it, vi } from "vitest";
import {
  defaultSettings,
  hydrateData,
  loadData,
  saveData,
  validateData,
} from "./storage";
import { seedPair } from "../i18n/seedData";
const data = {
  version: 2 as const,
  reviewOrder: 0,
  settings: defaultSettings,
  pairs: { "en-de": seedPair("en", "de") },
};
afterEach(() => vi.unstubAllGlobals());
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
  it("accepts current data and rejects malformed counters, versions and cards", () => {
    expect(validateData(data)).toBe(true);
    expect(validateData(null)).toBe(false);
    expect(validateData({ ...data, version: 3 })).toBe(false);
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
  it("migrates old progress without old calendar locks or invented repetition totals", () => {
    const migrated = hydrateData(legacyBackup());
    const words = migrated.pairs["en-de"].words;
    expect(validateData(migrated)).toBe(true);
    expect(words.map((w) => w.step)).toEqual([0, 2, 3, 5]);
    expect(words.map((w) => w.status)).toEqual([
      "NEW",
      "LEARNING",
      "REVIEW",
      "MASTERED",
    ]);
    expect(words.every((w) => w.repCount === 0)).toBe(true);
    expect(migrated.reviewOrder).toBe(3);
    for (const key of [
      "interval",
      "nextReviewDate",
      "easeFactor",
      "introduced",
      "dailyNewCardsCap",
    ])
      expect(JSON.stringify(migrated)).not.toContain(key);
  });
  it("loads the v1 key once and saves the migrated v2 dataset without deleting the old backup", () => {
    const raw = JSON.stringify(legacyBackup());
    const getItem = vi.fn((key: string) => (key === "erudite:v1" ? raw : null));
    const setItem = vi.fn();
    vi.stubGlobal("localStorage", { getItem, setItem });
    const loaded = loadData();
    expect(loaded.error).toBe(false);
    expect(saveData(loaded.data)).toBe(true);
    expect(setItem.mock.calls[0][0]).toBe("erudite:v2");
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
  it("rejects corrupt legacy backup imports", () => {
    const bad = legacyBackup();
    bad.pairs["en-de"].words[0].targetWord = null as unknown as string;
    expect(() => hydrateData(bad)).toThrow();
  });
});
