import { describe, expect, it } from "vitest";
import { reviewCard, reinsertionDistance, resetCard } from "./srsEngine";
import { seedPair } from "../i18n/seedData";
const base = seedPair("en", "de").words[0];
const settings = { instantMasterOnFirstTry: false };
describe("position-based grading", () => {
  it("advances a new word through five recalls with no dates or waiting", () => {
    let card = base;
    const statuses = ["LEARNING", "LEARNING", "REVIEW", "REVIEW", "MASTERED"];
    for (let step = 1; step <= 5; step++) {
      card = reviewCard(card, "know", settings, step);
      expect(card).toMatchObject({
        step,
        status: statuses[step - 1],
        repCount: step,
        lastReviewedOrder: step,
      });
    }
    expect(base.status).toBe("NEW");
    expect("interval" in card).toBe(false);
    expect("nextReviewDate" in card).toBe(false);
  });
  it("supports immediate first-try mastery", () => {
    expect(
      reviewCard(base, "know", { instantMasterOnFirstTry: true }, 1),
    ).toMatchObject({ status: "MASTERED", step: 5, repCount: 1 });
  });
  it("resets consecutive progress on failure and counts every committed practice", () => {
    expect(
      reviewCard(
        { ...base, status: "REVIEW", step: 4, repCount: 10 },
        "repeat",
        settings,
        30,
      ),
    ).toMatchObject({
      status: "LEARNING",
      step: 0,
      repCount: 11,
      lastReviewedOrder: 30,
    });
  });
  it("preserves learning steps on assisted repeats", () => {
    expect(
      reviewCard(
        { ...base, status: "LEARNING", step: 2 },
        "repeat",
        settings,
        2,
        { assisted: true },
      ),
    ).toMatchObject({ status: "LEARNING", step: 2, repCount: 1 });
  });
  it("excludes immediately without inventing a recalled answer", () => {
    expect(reviewCard(base, "master", settings, 1)).toMatchObject({
      status: "MASTERED",
      step: 5,
      repCount: 0,
      lastReviewedOrder: 1,
    });
  });
  it("uses 8,16,24,50 card spacing and short-loop failures", () => {
    expect(reinsertionDistance(base, "know")).toBe(8);
    expect(
      reinsertionDistance({ ...base, status: "LEARNING", step: 1 }, "know"),
    ).toBe(16);
    expect(
      reinsertionDistance({ ...base, status: "LEARNING", step: 2 }, "know"),
    ).toBe(24);
    expect(
      reinsertionDistance({ ...base, status: "REVIEW", step: 3 }, "know"),
    ).toBe(50);
    expect(reinsertionDistance(base, "repeat")).toBe(3);
    expect(reinsertionDistance(base, "repeat", true)).toBe(4);
  });
  it("resets a word to new or review with clean repetition counters", () => {
    const mastered = {
      ...base,
      status: "MASTERED" as const,
      step: 5,
      repCount: 20,
      lastReviewedOrder: 40,
    };
    expect(resetCard(mastered)).toMatchObject({
      status: "NEW",
      step: 0,
      repCount: 0,
      lastReviewedOrder: 0,
    });
    expect(resetCard(mastered, "REVIEW")).toMatchObject({
      status: "REVIEW",
      step: 3,
      repCount: 0,
      lastReviewedOrder: 0,
    });
  });
});
