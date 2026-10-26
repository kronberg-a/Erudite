import { describe, expect, it } from "vitest";
import { buildStudyQueue } from "./queueManager";
import { resetCard } from "./srsEngine";
import { seedPair } from "../i18n/seedData";
describe("explicit word and folder practice", () => {
  const pair = seedPair("en", "de");
  const added = {
    ...pair.words[0],
    id: "added",
    categoryIds: ["core"],
    targetWord: "newly added",
  };
  const reset = resetCard({
    ...pair.words[0],
    id: "reset",
    status: "MASTERED",
    lastStudiedAt: 100,
    categoryIds: ["core"],
  });
  const dataset = { ...pair, words: [...pair.words, added, reset] };
  it("makes appended new words selectable despite an exhausted daily allowance and earlier new words", () => {
    expect(buildStudyQueue(dataset, "new", 0)).toEqual([]);
    expect(
      buildStudyQueue(dataset, "new", 0, { kind: "word", id: added.id }),
    ).toEqual([added.id]);
    expect(
      buildStudyQueue(dataset, "mixed", 1, { kind: "word", id: added.id }),
    ).toEqual([added.id]);
  });
  it("includes a reset word in new-only and mixed sessions immediately", () => {
    for (const mode of ["new", "mixed"] as const)
      expect(
        buildStudyQueue(dataset, mode, 0, { kind: "word", id: reset.id }),
      ).toEqual([reset.id]);
    expect(
      buildStudyQueue(dataset, "review", 0, { kind: "word", id: reset.id }),
    ).toEqual([]);
  });
  it("scopes folder practice and leaves automatic inclusion preferences unchanged", () => {
    const disabled = {
      ...dataset,
      categories: dataset.categories.map((c) => ({
        ...c,
        isActiveForStudy: false,
      })),
    };
    const expected = disabled.words
      .filter((w) => w.categoryIds.includes("core"))
      .map((w) => w.id);
    expect(buildStudyQueue(disabled, "new", 10)).toEqual([]);
    expect(
      buildStudyQueue(disabled, "new", 0, { kind: "category", id: "core" }),
    ).toEqual(expected);
    expect(disabled.categories.every((c) => !c.isActiveForStudy)).toBe(true);
  });
  it("still excludes mastered and future review words from explicit practice", () => {
    for (const word of [
      { ...added, status: "MASTERED" as const },
      { ...added, status: "REVIEW" as const, nextReviewDate: 200 },
    ])
      expect(
        buildStudyQueue(
          { ...dataset, words: [word] },
          "mixed",
          0,
          { kind: "word", id: added.id },
          100,
        ),
      ).toEqual([]);
  });
});
