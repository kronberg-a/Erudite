import type { Action, Settings, WordCard } from "../types";

export function reviewCard(
  card: WordCard,
  action: Action,
  settings: Pick<Settings, "instantMasterOnFirstTry">,
  order: number,
  options: { assisted?: boolean } = {},
): WordCard {
  const next = { ...card, lastReviewedOrder: order };
  if (action === "master") return { ...next, status: "MASTERED", step: 5 };
  if (card.status === "MASTERED") return next;
  next.repCount += 1;
  if (action === "repeat")
    return {
      ...next,
      status: "LEARNING",
      step: options.assisted && card.status === "LEARNING" ? card.step : 0,
    };
  if (card.status === "NEW")
    return settings.instantMasterOnFirstTry
      ? { ...next, status: "MASTERED", step: 5 }
      : { ...next, status: "LEARNING", step: 1 };
  next.step = Math.min(5, card.step + 1);
  next.status =
    next.step >= 5 ? "MASTERED" : next.step >= 3 ? "REVIEW" : "LEARNING";
  return next;
}
export function reinsertionDistance(
  card: WordCard,
  action: Action,
  assisted = false,
): number {
  if (action === "repeat") return assisted ? 4 : 3;
  if (action === "master") return Infinity;
  return card.status === "REVIEW"
    ? 50
    : 8 * (card.status === "NEW" ? 1 : card.step + 1);
}
export function resetCard(
  card: WordCard,
  status: "NEW" | "REVIEW" = "NEW",
): WordCard {
  return {
    ...card,
    status,
    step: status === "REVIEW" ? 3 : 0,
    repCount: 0,
    lastReviewedOrder: 0,
    lastStudiedAt: undefined,
  };
}
