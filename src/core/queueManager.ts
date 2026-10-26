import type { Category, Mode, WordCard } from "../types";
export function buildQueue(
  words: WordCard[],
  categories: Category[],
  mode: Mode,
  cap: number,
  now = Date.now(),
): string[] {
  const active = new Set(
    categories.filter((c) => c.isActiveForStudy).map((c) => c.id),
  );
  const available = words.filter((w) =>
    w.categoryIds.some((id) => active.has(id)),
  );
  const review = available
    .filter((w) => w.status === "REVIEW" && w.nextReviewDate <= now)
    .sort((a, b) => a.nextReviewDate - b.nextReviewDate);
  const learning = available.filter((w) => w.status === "LEARNING");
  const fresh = available
    .filter((w) => w.status === "NEW")
    .slice(0, Math.max(0, cap));
  return (
    mode === "new"
      ? fresh
      : mode === "review"
        ? [...review, ...learning]
        : [...review, ...learning, ...fresh]
  ).map((w) => w.id);
}
export function advanceQueue(queue: string[], updated: WordCard): string[] {
  const remaining = queue.slice(1).filter((id) => id !== updated.id);
  // A learning card must achieve all three passes before the session can finish.
  if (updated.status === "LEARNING")
    remaining.splice(Math.min(3, remaining.length), 0, updated.id);
  return remaining;
}
export function localDay(now = new Date()): string {
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}
