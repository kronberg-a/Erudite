import { describe, expect, it } from "vitest";
import { reviewCard, reinsertionDistance, resetCard, DAY, reviewInterval } from "./srsEngine";
import { seedPair } from "../i18n/seedData";
const base = seedPair("en", "de").words[0];
const settings = { instantMasterOnFirstTry: true };
const grade = (card: typeof base, now: number, action: "know" | "repeat" = "know", assisted = false) =>
  reviewCard(card, action, settings, card.repCount + 1, { now, assisted });
function graduate() { let c = base; for (let i = 0; i < 3; i++) c = grade(c, 0); return c; }
describe("calendar mastery with unlimited practice", () => {
  it("requires three learning recalls even with the legacy instant setting enabled", () => {
    let c = base;
    for (let step = 1; step <= 3; step++) {
      c = grade(c, 0);
      expect(c).toMatchObject({ step, repCount: step, status: step === 3 ? "REVIEW" : "LEARNING" });
    }
    expect(c).toMatchObject({ interval: 1, nextReviewDate: DAY, reviewRepetitions: 0 });
    expect(base.status).toBe("NEW");
  });
  it("survives the complete calendar route before becoming Memorized", () => {
    let c = graduate();
    for (const interval of [1, 3, 7, 16, 35, 90]) {
      expect(c.status).toBe("REVIEW");
      expect(c.interval).toBe(interval);
      const due = c.nextReviewDate!;
      c = grade(c, due - 1);
      expect(c.nextReviewDate).toBe(due);
      expect(c.interval).toBe(interval);
      c = grade(c, due);
    }
    expect(c).toMatchObject({ status: "MASTERED", reviewRepetitions: 6, step: 5 });
  });
  it("allows unlimited early practice without advancing or postponing the schedule", () => {
    let c = graduate();
    for (let i = 0; i < 500; i++) c = grade(c, DAY - 1);
    expect(c).toMatchObject({ status: "REVIEW", step: 3, interval: 1,
      nextReviewDate: DAY, reviewRepetitions: 0, repCount: 503 });
  });
  it("resets learning and the scheduled success streak on any failure, including early practice", () => {
    let c = graduate();
    c = grade(c, DAY);
    c = grade(c, DAY + 1, "repeat");
    expect(c).toMatchObject({ status: "LEARNING", step: 0, interval: 0,
      nextReviewDate: 0, reviewRepetitions: 0 });
    expect(c.easeFactor).toBeCloseTo(2.1);
    expect(reinsertionDistance(c, "repeat")).toBe(3);
  });
  it("preserves progress on assisted recalls without granting scheduled credit", () => {
    const c = graduate();
    expect(grade(c, DAY, "repeat", true)).toMatchObject({ ...c, repCount: 4, lastReviewedOrder: 4, lastStudiedAt: DAY });
    expect(reinsertionDistance(c, "repeat", true)).toBe(4);
  });
  it("cannot manually master and can continue practising Memorized words", () => {
    expect(reviewCard(base, "master", settings, 1)).toEqual(base);
    const c = { ...graduate(), status: "MASTERED" as const, step: 5, interval: 90 };
    expect(grade(c, 500 * DAY)).toMatchObject({ status: "MASTERED", repCount: 4 });
    expect(grade(c, 500 * DAY, "repeat")).toMatchObject({ status: "LEARNING", step: 0 });
  });
  it("uses ease and repetition number, and schedules late reviews from the actual recall", () => {
    expect(reviewInterval(3, 2.3)).toBe(16);
    expect(reviewInterval(3, 1.3)).toBeLessThan(16);
    expect(grade(graduate(), 10 * DAY)).toMatchObject({ interval: 3, nextReviewDate: 13 * DAY });
  });
  it("clears the full schedule on reset", () => {
    const c = grade(graduate(), DAY);
    expect(resetCard(c)).toMatchObject({ status: "NEW", step: 0, interval: 0, nextReviewDate: 0, reviewRepetitions: 0, repCount: 0 });
    expect(resetCard(c, "REVIEW")).toMatchObject({ status: "REVIEW", step: 3, reviewRepetitions: 0 });
  });
});
