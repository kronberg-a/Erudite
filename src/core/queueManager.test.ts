import { describe, expect, it } from "vitest";
import {
  advanceQueue,
  availableMode,
  buildQueue,
  buildStudyQueue,
  continueQueue,
} from "./queueManager";
import { reviewCard, reinsertionDistance, resetCard } from "./srsEngine";
import { seedPair } from "../i18n/seedData";
import { languages } from "../types";
const seed = seedPair("en", "de");
const base = seed.words[0];
const settings = { instantMasterOnFirstTry: false };
describe("continuous queues", () => {
  it("interleaves three in-progress with two new words without a cap", () => {
    const words = [
      ...Array.from({ length: 6 }, (_, i) => ({
        ...base,
        id: "p" + i,
        status: "LEARNING" as const,
        step: 1,
      })),
      ...Array.from({ length: 5 }, (_, i) => ({ ...base, id: "n" + i })),
    ];
    expect(buildQueue(words, seed.categories, "mixed")).toEqual([
      "p0",
      "p1",
      "p2",
      "n0",
      "n1",
      "p3",
      "p4",
      "p5",
      "n2",
      "n3",
      "n4",
    ]);
  });
  it("orders in-progress cards by step and oldest review order", () => {
    const words = [
      {
        ...base,
        id: "a",
        status: "REVIEW" as const,
        step: 3,
        lastReviewedOrder: 1,
      },
      {
        ...base,
        id: "b",
        status: "LEARNING" as const,
        step: 1,
        lastReviewedOrder: 9,
      },
      {
        ...base,
        id: "c",
        status: "LEARNING" as const,
        step: 1,
        lastReviewedOrder: 2,
      },
    ];
    expect(buildQueue(words, seed.categories, "review")).toEqual([
      "c",
      "b",
      "a",
    ]);
    expect(buildQueue(words, seed.categories, "new")).toEqual([]);
  });
  it("supports explicit words and folders without mutating inclusion settings", () => {
    const pair = {
      ...seed,
      categories: seed.categories.map((c) => ({
        ...c,
        isActiveForStudy: false,
      })),
    };
    expect(buildStudyQueue(pair, "mixed")).toEqual([]);
    expect(buildStudyQueue(pair, "new", { kind: "word", id: base.id })).toEqual(
      [base.id],
    );
    expect(
      buildStudyQueue(pair, "new", { kind: "category", id: "core" }),
    ).toHaveLength(8);
    expect(pair.categories.every((c) => !c.isActiveForStudy)).toBe(true);
  });
  it("inserts at the requested position or immediately cycles a short pool", () => {
    const queue = ["a", ...Array.from({ length: 70 }, (_, i) => "b" + i)];
    for (const distance of [3, 4, 8, 16, 24, 50])
      expect(
        advanceQueue(
          queue,
          { ...base, id: "a", status: "REVIEW" },
          distance,
        ).indexOf("a"),
      ).toBe(distance);
    expect(
      advanceQueue(["a"], { ...base, id: "a", status: "LEARNING" }, 50),
    ).toEqual(["a"]);
    expect(
      advanceQueue(["a"], { ...base, id: "a", status: "MASTERED" }, 50),
    ).toEqual(["a"]);
  });
  it("combines selected folders without duplicates and excludes unselected folders", () => {
    const pair = {
      ...seed,
      words: [
        { ...base, id: "shared", categoryIds: ["core", "verbs"] },
        { ...base, id: "verb", categoryIds: ["verbs"] },
        { ...base, id: "excluded", categoryIds: ["travel"] },
      ],
    };
    expect(buildStudyQueue(pair, "mixed", {
      kind: "categories", ids: ["core", "verbs"],
    })).toEqual(["shared", "verb"]);
    expect(buildStudyQueue(pair, "mixed", {
      kind: "categories", ids: [],
    })).toEqual([]);
  });
  it("continues immediately when the new-only pool runs out", () => {
    const next = reviewCard(base, "know", settings, 1);
    const result = continueQueue(
      [base.id],
      { ...seed, words: [next] },
      "new",
      next,
      8,
    );
    expect(result).toEqual({
      queue: [base.id],
      mode: "review",
      switched: true,
    });
    expect(availableMode({ ...seed, words: [base] }, "review")).toBe("new");
  });
  it("keeps reviewing freely without granting early mastery", () => {
    let pair = { ...seed, words: [base] };
    let queue = [base.id];
    for (let tick = 1; tick <= 100; tick++) {
      const card = pair.words[0];
      const updated = reviewCard(card, "know", settings, tick, { now: 0 });
      pair = { ...pair, words: [updated] };
      queue = continueQueue(queue, pair, "mixed", updated, reinsertionDistance(card, "know")).queue;
      expect(queue).toEqual([base.id]);
    }
    expect(pair.words[0]).toMatchObject({ status: "REVIEW", repCount: 100, reviewRepetitions: 0 });
    const memorized = { ...pair.words[0], status: "MASTERED" as const, step: 5 };
    const memorizedPair = { ...pair, words: [memorized] };
    expect(buildStudyQueue(memorizedPair, "review")).toEqual([base.id]);
    expect(availableMode(memorizedPair, "new")).toBe("review");
  });
  it("supports endless failed drilling without date or cooldown checks", () => {
    let pair = {
      ...seed,
      words: [{ ...base, status: "LEARNING" as const, step: 0 }],
    };
    let queue = [base.id];
    for (let tick = 1; tick <= 200; tick++) {
      const updated = reviewCard(pair.words[0], "repeat", settings, tick);
      pair = { ...pair, words: [updated as (typeof pair.words)[number]] };
      queue = continueQueue(queue, pair, "review", updated, 3).queue;
      expect(queue).toEqual([base.id]);
    }
    expect(pair.words[0].repCount).toBe(200);
  });
  it("resetting mastered words makes them immediately eligible in either pool", () => {
    expect(
      buildStudyQueue(
        {
          ...seed,
          words: [resetCard({ ...base, status: "MASTERED", step: 5 })],
        },
        "new",
      ),
    ).toEqual([base.id]);
    expect(
      buildStudyQueue(
        {
          ...seed,
          words: [
            resetCard({ ...base, status: "MASTERED", step: 5 }, "REVIEW"),
          ],
        },
        "review",
      ),
    ).toEqual([base.id]);
  });
  it("provides valid starter cards for every language pair", () => {
    for (const source of languages)
      for (const target of languages)
        if (source !== target) {
          const pair = seedPair(source, target);
          expect(pair.words).toHaveLength(32);
          expect(
            pair.words.every(
              (w) =>
                w.repCount === 0 &&
                w.lastReviewedOrder === 0 &&
                w.examples[0].translatedSentence,
            ),
          ).toBe(true);
        }
  });
});
