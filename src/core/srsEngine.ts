import type { Action, Settings, WordCard } from "../types";
export const DAY = 86_400_000;
export function reviewCard(
  card: WordCard,
  action: Action,
  settings: Pick<Settings, "instantMasterOnFirstTry">,
  now = Date.now(),
  options: { assisted?: boolean } = {},
): WordCard {
  const next = { ...card, lastStudiedAt: now };
  if (action === "master") return { ...next, status: "MASTERED" };
  if (action === "repeat")
    return {
      ...next,
      status: "LEARNING",
      step: options.assisted && card.status === "LEARNING" ? card.step : 0,
      interval: 0,
      nextReviewDate: now,
      easeFactor: options.assisted
        ? card.easeFactor
        : Math.max(1.3, Number((card.easeFactor - 0.2).toFixed(10))),
    };
  if (card.status === "NEW")
    return settings.instantMasterOnFirstTry
      ? { ...next, status: "MASTERED" }
      : {
          ...next,
          status: "REVIEW",
          interval: 7,
          nextReviewDate: now + 7 * DAY,
        };
  if (card.status === "LEARNING") {
    next.step += 1;
    if (next.step >= 3) {
      next.status = "REVIEW";
      next.interval = 1;
      next.nextReviewDate = now + DAY;
    }
  }
  if (card.status === "REVIEW") {
    next.interval = Math.round(card.interval * card.easeFactor);
    next.easeFactor = Number((card.easeFactor + 0.1).toFixed(10));
    next.nextReviewDate = now + next.interval * DAY;
    if (next.interval > 90) next.status = "MASTERED";
  }
  return next;
}
export function resetCard(card: WordCard): WordCard {
  return {
    ...card,
    status: "NEW",
    step: 0,
    interval: 0,
    easeFactor: 2.5,
    nextReviewDate: 0,
    lastStudiedAt: undefined,
  };
}
