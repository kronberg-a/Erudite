import { describe, expect, it } from "vitest";
import {
  advanceQueue,
  buildQueue,
  buildStudyQueue,
  continueQueue,
} from "./queueManager";
import { reviewCard, resetCard } from "./srsEngine";
import { seedPair } from "../i18n/seedData";
import { languages } from "../types";
const seed = seedPair("en", "de");
const base = seed.words[0];
const settings = { instantMasterOnFirstTry: false };
describe("session queues", () => {
  it("puts learning and due reviews first, interleaves new words, and appends early practice", () => {
    const now = Date.now();
    const words = [
      { ...base, id: "future-late", status: "REVIEW" as const, step: 3, nextReviewDate: now + 2000 },
      { ...base, id: "future-soon", status: "REVIEW" as const, step: 3, nextReviewDate: now + 1000 },
      { ...base, id: "due", status: "REVIEW" as const, step: 3, nextReviewDate: now },
      { ...base, id: "learning", status: "LEARNING" as const, step: 1, nextReviewDate: now + 3000 },
      { ...base, id: "new" },
      { ...base, id: "memorized", status: "MASTERED" as const, step: 5 },
    ];
    expect(buildQueue(words, seed.categories, "review")).toEqual(["learning", "due", "future-soon", "future-late"]);
    expect(buildQueue(words, seed.categories, "mixed")).toEqual(["learning", "due", "new", "future-soon", "future-late"]);
    expect(buildQueue(words, seed.categories, "new")).toEqual(["new"]);
    expect(buildQueue(words.slice(0, 2), seed.categories, "mixed")).toEqual(["future-soon", "future-late"]);
  });
  it("excludes memorized words from folder sessions but allows direct word practice in any mode", () => {
    const pair = { ...seed, words: [{ ...base, status: "MASTERED" as const, step: 5, categoryIds: ["core"] }] };
    for (const mode of ["new", "review", "mixed"] as const) {
      expect(buildStudyQueue(pair, mode)).toEqual([]);
      expect(buildStudyQueue(pair, mode, { kind: "category", id: "core" })).toEqual([]);
      expect(buildStudyQueue(pair, mode, { kind: "categories", ids: ["core"] })).toEqual([]);
      expect(buildStudyQueue(pair, mode, { kind: "word", id: base.id })).toEqual([base.id]);
    }
  });
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
  it("keeps new words until graduation and then ends without switching mode", () => {
    let pair = { ...seed, words: [base] };
    let queue = [base.id];
    for (let tick = 1; tick <= 3; tick++) {
      const updated = reviewCard(pair.words[0], "know", settings, tick);
      pair = { ...pair, words: [updated] };
      const result = continueQueue(queue, pair, "new", updated, 8);
      expect(result.mode).toBe("new");
      expect(result.switched).toBe(false);
      queue = result.queue;
      expect(queue).toEqual(tick < 3 ? [base.id] : []);
    }
  });
  it.each(["REVIEW", "MASTERED"] as const)("retires a successful %s card without refilling completed words", (status) => {
    const card = { ...base, status, step: 3, nextReviewDate: Date.now() + 86400000 };
    const updated = reviewCard(card, "know", settings, 1);
    const pair = { ...seed, words: [updated, { ...card, id: "other" }] };
    expect(continueQueue([base.id], pair, "review", updated, 50).queue).toEqual([]);
    expect(updated.nextReviewDate).toBe(card.nextReviewDate);
    expect(buildStudyQueue(pair, "review").includes(base.id)).toBe(status !== "MASTERED");
    expect(buildStudyQueue(pair, "review", { kind: "word", id: base.id })).toEqual([base.id]);
  });
  it("keeps assisted review cards for another attempt", () => {
    const card = { ...base, status: "REVIEW" as const, step: 3 };
    expect(continueQueue([base.id], { ...seed, words: [card] }, "review", card, 4, undefined, true).queue).toEqual([base.id]);
  });
  it("finishes mixed sessions after both selected pools are exhausted", () => {
    let pair = { ...seed, words: [
      { ...base, id: "review", categoryIds: ["core"], status: "REVIEW" as const, step: 3 },
      { ...base, id: "new", categoryIds: ["core"] },
      { ...base, id: "excluded", categoryIds: ["travel"] },
    ] };
    const selection = { kind: "categories" as const, ids: ["core"] };
    let queue = buildStudyQueue(pair, "mixed", selection);
    expect(queue).toEqual(["review", "new"]);
    for (let tick = 1; tick <= 4; tick++) {
      const card = pair.words.find(w => w.id === queue[0])!;
      const updated = reviewCard(card, "know", settings, tick);
      pair = { ...pair, words: pair.words.map(w => w.id === card.id ? updated : w) };
      queue = continueQueue(queue, pair, "mixed", updated, 8, selection).queue;
    }
    expect(queue).toEqual([]);
    expect(pair.words[2].repCount).toBe(0);
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
