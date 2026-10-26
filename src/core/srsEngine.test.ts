import { describe, expect, it } from "vitest";
import { DAY, resetCard, reviewCard } from "./srsEngine";
import { advanceQueue, buildQueue } from "./queueManager";
import { seedPair } from "../i18n/seedData";
import { languages } from "../types";
const base = seedPair("en", "de").words[0];
const settings = { instantMasterOnFirstTry: false };
const now = 100_000;
describe("SRS transitions", () => {
  it("gives a known new card seven days without mutating the original", () => {
    const next = reviewCard(base, "know", settings, now);
    expect(next.status).toBe("REVIEW");
    expect(next.interval).toBe(7);
    expect(next.nextReviewDate).toBe(now + 7 * DAY);
    expect(base.status).toBe("NEW");
  });
  it("supports instant mastery and explicit mastery for any state", () => {
    expect(
      reviewCard(base, "know", { instantMasterOnFirstTry: true }, now).status,
    ).toBe("MASTERED");
    for (const status of ["NEW", "LEARNING", "REVIEW", "MASTERED"] as const)
      expect(
        reviewCard({ ...base, status }, "master", settings, now).status,
      ).toBe("MASTERED");
  });
  it("requires exactly three learning passes", () => {
    let card = reviewCard(base, "repeat", settings, now);
    expect(card.step).toBe(0);
    expect(card.easeFactor).toBe(2.3);
    for (let step = 1; step <= 2; step++) {
      card = reviewCard(card, "know", settings, now);
      expect(card.step).toBe(step);
      expect(card.status).toBe("LEARNING");
    }
    card = reviewCard(card, "know", settings, now);
    expect(card.step).toBe(3);
    expect(card.status).toBe("REVIEW");
    expect(card.interval).toBe(1);
    expect(card.nextReviewDate).toBe(now + DAY);
  });
  it("resets failures from review and clamps ease to 1.3", () => {
    const next = reviewCard(
      { ...base, status: "REVIEW", interval: 30, easeFactor: 1.4, step: 3 },
      "repeat",
      settings,
      now,
    );
    expect(next).toMatchObject({
      status: "LEARNING",
      step: 0,
      easeFactor: 1.3,
      interval: 0,
      nextReviewDate: now,
    });
  });
  it("uses the prior ease and rounds the interval before increasing ease", () => {
    const next = reviewCard(
      { ...base, status: "REVIEW", interval: 3, easeFactor: 2.5 },
      "know",
      settings,
      now,
    );
    expect(next.interval).toBe(8);
    expect(next.easeFactor).toBe(2.6);
    expect(next.nextReviewDate).toBe(now + 8 * DAY);
  });
  it("masters strictly above 90 days", () => {
    expect(
      reviewCard(
        { ...base, status: "REVIEW", interval: 36 },
        "know",
        settings,
        now,
      ).status,
    ).toBe("REVIEW");
    expect(
      reviewCard(
        { ...base, status: "REVIEW", interval: 37 },
        "know",
        settings,
        now,
      ).status,
    ).toBe("MASTERED");
  });
  it("keeps mastered words mastered on a positive action", () => {
    expect(
      reviewCard({ ...base, status: "MASTERED" }, "know", settings, now).status,
    ).toBe("MASTERED");
  });
  it("reset restores all scheduling defaults", () => {
    expect(
      resetCard({
        ...base,
        status: "MASTERED",
        step: 3,
        interval: 100,
        easeFactor: 3,
        lastStudiedAt: now,
      }),
    ).toMatchObject({
      status: "NEW",
      step: 0,
      interval: 0,
      easeFactor: 2.5,
      nextReviewDate: 0,
      lastStudiedAt: undefined,
    });
  });
});
describe("queue construction and reinsertion", () => {
  const pair = seedPair("en", "de");
  const words = [
    { ...base, id: "due", status: "REVIEW" as const, nextReviewDate: now },
    {
      ...base,
      id: "future",
      status: "REVIEW" as const,
      nextReviewDate: now + DAY,
    },
    { ...base, id: "learning", status: "LEARNING" as const },
    { ...base, id: "mastered", status: "MASTERED" as const },
    ...pair.words,
  ];
  it("includes due reviews, learning and capped new words in order", () => {
    expect(buildQueue(words, pair.categories, "mixed", 2, now)).toEqual([
      "due",
      "learning",
      pair.words[0].id,
      pair.words[1].id,
    ]);
  });
  it("separates new-only and review-only modes", () => {
    expect(buildQueue(words, pair.categories, "review", 20, now)).toEqual([
      "due",
      "learning",
    ]);
    expect(buildQueue(words, pair.categories, "new", 1, now)).toEqual([
      pair.words[0].id,
    ]);
  });
  it("excludes inactive folders and supports a zero daily allowance", () => {
    expect(
      buildQueue(
        words,
        pair.categories.map((c) => ({ ...c, isActiveForStudy: false })),
        "mixed",
        10,
        now,
      ),
    ).toEqual([]);
    expect(buildQueue(pair.words, pair.categories, "new", 0, now)).toEqual([]);
  });
  it("deduplicates multi-folder cards", () => {
    expect(
      buildQueue(
        [{ ...base, categoryIds: ["core", "abstract"] }],
        pair.categories,
        "new",
        10,
        now,
      ),
    ).toEqual([base.id]);
  });
  it("repeats a failed card after three other cards", () => {
    const card = { ...base, id: "a", status: "LEARNING" as const };
    expect(advanceQueue(["a", "b", "c", "d", "e"], card)).toEqual([
      "b",
      "c",
      "d",
      "a",
      "e",
    ]);
  });
  it("repeats at the end of short decks until graduation", () => {
    let card = reviewCard({ ...base, id: "a" }, "repeat", settings, now);
    let queue = ["a"];
    for (let pass = 0; pass < 3; pass++) {
      expect(queue).toEqual(["a"]);
      card = reviewCard(card, "know", settings, now);
      queue = advanceQueue(queue, card);
    }
    expect(queue).toEqual([]);
  });
  it("provides aligned nonempty vocabulary and examples for every language pair", () => {
    for (const source of languages)
      for (const target of languages)
        if (source !== target) {
          const p = seedPair(source, target);
          expect(p.words).toHaveLength(32);
          expect(new Set(p.words.map((w) => w.id)).size).toBe(32);
          for (const w of p.words) {
            expect(w.translations[0]).toBeTruthy();
            expect(w.examples[0].targetSentence).toBeTruthy();
            expect(w.examples[0].translatedSentence).toBeTruthy();
          }
        }
  });
});
