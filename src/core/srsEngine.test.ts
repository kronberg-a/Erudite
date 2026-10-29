import { describe, expect, it } from "vitest";
import { reviewCard, reinsertionDistance, resetCard, remainingMasteryRecalls, DAY, reviewInterval } from "./srsEngine";
import { seedPair } from "../i18n/seedData";
const base = seedPair("en", "de").words[0];
const settings = { instantMasterOnFirstTry: false };
const grade = (card: typeof base, now: number, action: "know" | "repeat" = "know", assisted = false) =>
  reviewCard(card, action, settings, card.repCount + 1, { now, assisted });
function graduate() { let c = base; for (let i = 0; i < 3; i++) c = grade(c, 0); return c; }
describe("calendar mastery with unlimited practice", () => {
  it("counts remaining successful recalls through learning and every scheduled review", () => {
    let card = { ...base };
    const original = structuredClone(card);
    expect(remainingMasteryRecalls(card)).toBe(9);
    expect(card).toEqual(original);
    for (let remaining = 9; remaining > 0; remaining--) {
      card = grade(card, card.nextReviewDate ?? 0);
      expect(remainingMasteryRecalls(card)).toBe(remaining - 1);
    }
    expect(card.status).toBe("MASTERED");
  });
  it("keeps early and assisted practice from reducing the counter and reflects failures and ease", () => {
    const card = graduate();
    expect(remainingMasteryRecalls(card)).toBe(6);
    expect(remainingMasteryRecalls(grade(card, DAY - 1))).toBe(6);
    expect(remainingMasteryRecalls(grade(card, DAY, "know", true))).toBe(6);
    expect(remainingMasteryRecalls(grade(card, DAY))).toBe(5);
    const failed = grade(card, DAY, "repeat");
    expect(remainingMasteryRecalls(failed)).toBeGreaterThan(6);
    let slow: typeof base = { ...card, easeFactor: 1.3 };
    const remaining = remainingMasteryRecalls(slow);
    expect(remaining).toBeGreaterThan(6);
    for (let i = 0; i < remaining; i++) slow = grade(slow, slow.nextReviewDate!);
    expect(slow.status).toBe("MASTERED");
    expect(remainingMasteryRecalls({ ...card, interval: 90 })).toBe(1);
  });
  it("requires three learning recalls when instant mastery is disabled", () => {
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
    for (const interval of [1, 3, 8, 23, 66, 241]) {
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
    expect(c.easeFactor).toBeCloseTo(2.2);
    expect(reinsertionDistance(c, "repeat")).toBe(3);
  });
  it("preserves progress on assisted recalls without granting scheduled credit", () => {
    const c = graduate();
    expect(grade(c, DAY, "repeat", true)).toMatchObject({ ...c, repCount: 4, lastReviewedOrder: 4, lastStudiedAt: DAY });
    expect(reinsertionDistance(c, "repeat", true)).toBe(4);
    expect(grade(base, 0, "repeat", true)).toMatchObject({ status: "LEARNING", step: 0, repCount: 1 });
    const learning = { ...base, status: "LEARNING" as const, step: 2 };
    expect(grade(learning, 0, "repeat", true)).toMatchObject({ status: "LEARNING", step: 2, repCount: 1 });
  });
  it("masters manually and can explicitly practise Memorized words", () => {
    expect(reviewCard(base, "master", settings, 1, { now: 42 })).toMatchObject({
      status: "MASTERED", step: 5, nextReviewDate: 0, repCount: 1, lastReviewedOrder: 1, lastStudiedAt: 42,
    });
    expect(reinsertionDistance(base, "master", true)).toBe(Infinity);
    const c = { ...graduate(), status: "MASTERED" as const, step: 5, interval: 90 };
    expect(grade(c, 500 * DAY)).toMatchObject({ status: "MASTERED", repCount: 4 });
    expect(grade(c, 500 * DAY, "repeat")).toMatchObject({ status: "LEARNING", step: 0 });
  });
  it("masters new words on first unassisted Know only when enabled", () => {
    expect(reviewCard(base, "know", { instantMasterOnFirstTry: true }, 1, { now: 10 })).toMatchObject({
      status: "MASTERED", step: 5, interval: 90, nextReviewDate: 0, repCount: 1,
    });
    expect(reviewCard(base, "know", { instantMasterOnFirstTry: true }, 1, { assisted: true })).toMatchObject({ status: "LEARNING", step: 0 });
    expect(reviewCard(base, "repeat", { instantMasterOnFirstTry: true }, 1)).toMatchObject({ status: "LEARNING", step: 0 });
  });
  it("recovers ease only on scheduled success and uses the recovered value for the interval", () => {
    const card = { ...graduate(), easeFactor: 1.3, reviewRepetitions: 2 };
    expect(grade(card, DAY - 1).easeFactor).toBe(1.3);
    const updated = grade(card, DAY);
    expect(updated.easeFactor).toBeCloseTo(1.4);
    expect(updated.interval).toBe(reviewInterval(3, 1.4));
    expect(grade(card, DAY, "know", true).easeFactor).toBe(1.3);
  });
  it("reinserts learning at eight and sixteen cards, then retires reviews and graduates", () => {
    expect(reinsertionDistance(base, "know")).toBe(8);
    expect(reinsertionDistance({ ...base, status: "LEARNING", step: 1 }, "know")).toBe(16);
    expect(reinsertionDistance({ ...base, status: "LEARNING", step: 2 }, "know")).toBe(Infinity);
    expect(reinsertionDistance(graduate(), "know")).toBe(Infinity);
    expect(grade({ ...graduate(), easeFactor: 1.3 }, DAY, "repeat").easeFactor).toBe(1.3);
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
