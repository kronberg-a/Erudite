import { expect, it } from "vitest";
import { deleteFolder } from "./folders";
import { seedPair } from "../i18n/seedData";
import {
  defaultSettings,
  hydrateData,
  validateData,
} from "../services/storage";
import type { AppData, PairData } from "../types";

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
