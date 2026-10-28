import type { Action, Settings, WordCard } from "../types";
export const DAY = 86_400_000;
export const MASTERY_INTERVAL = 90;
const INTERVALS = [1, 3, 7, 16, 35, 90];
export const emptySchedule = { interval: 0, nextReviewDate: 0, easeFactor: 2.3, reviewRepetitions: 0 };
export function reviewInterval(repetitions: number, ease: number): number {
  const baseline = INTERVALS[repetitions] ?? 90 * Math.pow(2.3, repetitions - 5);
  return Math.max(1, Math.round(baseline * Math.pow(ease / 2.3, repetitions)));
}
export function reviewCard(card: WordCard, action: Action,
  _settings: Pick<Settings, "instantMasterOnFirstTry">, order: number,
  options: { assisted?: boolean; now?: number } = {}): WordCard {
  // Legacy callers cannot grant manual mastery.
  if (action === "master") return card;
  const now = options.now ?? Date.now();
  const next = { ...emptySchedule, ...card, lastReviewedOrder: order,
    lastStudiedAt: now, repCount: card.repCount + 1 };
  if (options.assisted) return next;
  if (action === "repeat") return { ...next, status: "LEARNING", step: 0,
    interval: 0, nextReviewDate: 0, reviewRepetitions: 0,
    easeFactor: Math.max(1.3, next.easeFactor - 0.2) };
  if (card.status === "NEW" || card.status === "LEARNING") {
    const step = Math.min(3, card.step + 1);
    return { ...next, step, status: step === 3 ? "REVIEW" : "LEARNING",
      ...(step === 3 ? { interval: 1, nextReviewDate: now + DAY, reviewRepetitions: 0 } : {}) };
  }
  // Optional early practice cannot advance the calendar schedule.
  if (now < next.nextReviewDate || card.status === "MASTERED") return next;
  const reviewRepetitions = next.reviewRepetitions + 1;
  if (next.interval >= MASTERY_INTERVAL) return { ...next,
    status: "MASTERED", step: 5, reviewRepetitions, nextReviewDate: 0 };
  const interval = reviewInterval(reviewRepetitions, next.easeFactor);
  return { ...next, status: "REVIEW", step: 3, interval,
    nextReviewDate: now + interval * DAY, reviewRepetitions };
}
export function reinsertionDistance(card: WordCard, action: Action, assisted = false): number {
  if (assisted) return 4;
  if (action === "repeat") return 3;
  if (card.status === "LEARNING" && card.step === 2) return Infinity;
  return card.status === "NEW" || card.status === "LEARNING" ? 8 * (card.step + 1) : 50;
}
export function resetCard(card: WordCard, status: "NEW" | "REVIEW" = "NEW"): WordCard {
  return { ...card, ...emptySchedule, ...(status === "REVIEW" ? { interval: 1, nextReviewDate: Date.now() + DAY } : {}), status, step: status === "REVIEW" ? 3 : 0,
    repCount: 0, lastReviewedOrder: 0, lastStudiedAt: undefined };
}
