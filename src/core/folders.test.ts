import { expect, it } from "vitest";
import { deleteFolder, renameFolder, transferWord } from "./folders";
import { seedPair } from "../i18n/seedData";
import {
  defaultSettings,
  hydrateData,
  validateData,
} from "../services/storage";
import type { AppData, PairData } from "../types";

it("renames any folder in every interface language while keeping its identity and words", () => {
  const pair = seedPair("en", "de");
  const before = structuredClone(pair);
  const result = renameFolder(pair, pair.categories[0].id, "  My words  ");
  expect(new Set(Object.values(result.categories[0].name))).toEqual(new Set(["My words"]));
  expect(result.categories[0].id).toBe(pair.categories[0].id);
  expect(result.words).toBe(pair.words);
  expect(pair).toEqual(before);
  for (const value of ["", "  ", "x".repeat(81)]) expect(renameFolder(pair, pair.categories[0].id, value)).toBe(pair);
  expect(renameFolder(pair, "missing", "Name")).toBe(pair);
});

it("copies membership and moves only the chosen source without losing progress or duplicating cards", () => {
  const seed = seedPair("en", "de");
  const [a, b, c] = seed.categories;
  const word = { ...seed.words[0], categoryIds: [a.id, b.id], status: "REVIEW" as const, interval: 35, repCount: 17, nextReviewDate: 123456, reviewRepetitions: 4 };
  const pair = { ...seed, words: [word] };
  const copied = transferWord(pair, word.id, c.id);
  expect(copied.words).toEqual([{ ...word, categoryIds: [a.id, b.id, c.id] }]);
  const moved = transferWord(copied, word.id, c.id, a.id);
  expect(moved.words).toEqual([{ ...word, categoryIds: [b.id, c.id] }]);
  expect(transferWord(copied, word.id, c.id).words).toEqual(copied.words);
  expect(pair.words[0]).toBe(word);
  expect(transferWord(pair, word.id, a.id, a.id)).toBe(pair);
  expect(transferWord(pair, word.id, "missing")).toBe(pair);
  expect(transferWord(pair, "missing", c.id)).toBe(pair);
  expect(transferWord(pair, word.id, c.id, "missing")).toBe(pair);
  const unfiled = { ...pair, words: [{ ...word, categoryIds: [] }] };
  expect(transferWord(unfiled, word.id, c.id).words[0].categoryIds).toEqual([c.id]);
});

it("deletes only the requested folder and memberships while preserving vocabulary and progress", () => {
  const seed = seedPair("en", "de");
  const categories = seed.categories.slice(0, 2);
  const pair: PairData = {
    categories,
    savedArticles: [
      { id: "article", title: "Title", text: "Text", url: "", createdAt: 1 },
    ],
    words: [
      {
        ...seed.words[0],
        categoryIds: [categories[0].id],
        status: "LEARNING",
        step: 2,
        repCount: 37,
        lastReviewedOrder: 12,
      },
      { ...seed.words[1], categoryIds: categories.map((c) => c.id) },
      { ...seed.words[2], categoryIds: [categories[1].id] },
    ],
  };
  const before = structuredClone(pair);
  const result = deleteFolder(pair, categories[0].id);
  expect(result.categories).toEqual([categories[1]]);
  expect(result.words).toEqual(
    pair.words.map((word) => ({
      ...word,
      categoryIds: word.categoryIds.filter((id) => id !== categories[0].id),
    })),
  );
  expect(result.words[0].categoryIds).toEqual([]);
  expect(result.words[1].categoryIds).toEqual([categories[1].id]);
  expect(result.words[2]).toBe(pair.words[2]);
  expect(result.savedArticles).toBe(pair.savedArticles);
  expect(pair).toEqual(before);
  const data: AppData = {
    version: 3,
    reviewOrder: 12,
    settings: defaultSettings,
    pairs: { "en-de": result },
  };
  expect(validateData(data)).toBe(true);
  expect(hydrateData(JSON.parse(JSON.stringify(data))).pairs["en-de"]).toEqual(
    result,
  );
  const last = deleteFolder(result, categories[1].id);
  expect(last.categories).toEqual([]);
  expect(last.words).toHaveLength(3);
  expect(last.words.every((word) => word.categoryIds.length === 0)).toBe(true);
  expect(validateData({ ...data, pairs: { "en-de": last } })).toBe(true);
});

it("ignores missing folders and handles empty folders without touching words", () => {
  const pair = seedPair("en", "de");
  expect(deleteFolder(pair, "missing")).toBe(pair);
  const folder = { ...pair.categories[0], id: "empty" };
  const result = deleteFolder(
    { ...pair, categories: [...pair.categories, folder] },
    folder.id,
  );
  expect(result.categories).toEqual(pair.categories);
  expect(result.words).toEqual(pair.words);
  expect(result.words.every((word, i) => word === pair.words[i])).toBe(true);
});

it("deletes folder words entirely only when explicitly requested, including shared words", () => {
  const seed = seedPair("en", "de");
  const categories = seed.categories.slice(0, 2);
  const pair: PairData = {
    ...seed,
    categories,
    words: [
      { ...seed.words[0], categoryIds: [categories[0].id] },
      {
        ...seed.words[1],
        categoryIds: categories.map((category) => category.id),
      },
      { ...seed.words[2], categoryIds: [categories[1].id] },
      { ...seed.words[3], categoryIds: [] },
    ],
  };
  const before = structuredClone(pair);
  const result = deleteFolder(pair, categories[0].id, true);
  expect(result.categories).toEqual([categories[1]]);
  expect(result.words).toEqual(pair.words.slice(2));
  expect(pair).toEqual(before);
  expect(
    validateData({
      version: 3,
      reviewOrder: 0,
      settings: defaultSettings,
      pairs: { "en-de": result },
    }),
  ).toBe(true);
  expect(deleteFolder(pair, "missing", true)).toBe(pair);
  const allDeleted = deleteFolder(
    { ...pair, categories: [categories[0]], words: [pair.words[0]] },
    categories[0].id,
    true,
  );
  expect(allDeleted.words).toEqual([]);
  expect(allDeleted.categories).toEqual([]);
});
