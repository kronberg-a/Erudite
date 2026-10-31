import type {
  Category,
  Mode,
  PairData,
  StudySelection,
  WordCard,
} from "../types";

export function selectedWords(
  pair: PairData,
  selection?: StudySelection,
): WordCard[] {
  if (selection)
    return pair.words.filter((word) =>
      selection.kind === "words"
        ? selection.ids.includes(word.id)
        : selection.kind === "categories"
        ? word.categoryIds.some((id) => selection.ids.includes(id))
        : selection.kind === "word"
        ? word.id === selection.id
        : word.categoryIds.includes(selection.id),
    );
  const active = new Set(
    pair.categories.filter((c) => c.isActiveForStudy).map((c) => c.id),
  );
  return pair.words.filter((word) =>
    word.categoryIds.some((id) => active.has(id)),
  );
}
export function buildQueue(
  words: WordCard[],
  categories: Category[],
  mode: Mode,
): string[] {
  const available = selectedWords({ words, categories });
  return queueForWords(available, mode);
}
function queueForWords(available: WordCard[], mode: Mode): string[] {
  const now = Date.now();
  const fresh = available.filter((w) => w.status === "NEW");
  const progress = available
    .filter((w) => w.status === "LEARNING" || (w.status === "REVIEW" && (w.nextReviewDate ?? 0) <= now))
    .sort(
      (a, b) => Number(a.status !== "LEARNING") - Number(b.status !== "LEARNING") ||
      a.step - b.step || a.lastReviewedOrder - b.lastReviewedOrder,
    );
  const earlyReview = available
    .filter((w) => w.status === "REVIEW" && (w.nextReviewDate ?? 0) > now)
    .sort((a, b) => (a.nextReviewDate ?? 0) - (b.nextReviewDate ?? 0) || a.lastReviewedOrder - b.lastReviewedOrder);
  if (mode === "new") return fresh.map((w) => w.id);
  if (mode === "review") return [...progress, ...earlyReview].map((w) => w.id);
  const result: WordCard[] = [];
  for (
    let p = 0, n = 0;
    p < progress.length || n < fresh.length;
    p += 3, n += 2
  )
    result.push(...progress.slice(p, p + 3), ...fresh.slice(n, n + 2));
  return [...result, ...earlyReview].map((w) => w.id);
}
export function buildStudyQueue(
  pair: PairData,
  mode: Mode,
  selection?: StudySelection,
): string[] {
  if (selection?.kind === "word") {
    const word = pair.words.find((w) => w.id === selection.id);
    if (word?.status === "MASTERED") return [word.id];
  }
  return queueForWords(selectedWords(pair, selection), mode);
}
export function advanceQueue(
  queue: string[],
  updated: WordCard,
  distance: number,
): string[] {
  const remaining = queue.slice(1).filter((id) => id !== updated.id);
  remaining.splice(Math.min(distance, remaining.length), 0, updated.id);
  return remaining;
}
export function continueQueue(
  queue: string[],
  pair: PairData,
  mode: Mode,
  updated: WordCard,
  distance: number,
  selection?: StudySelection,
  assisted = false,
): { queue: string[]; mode: Mode; switched: boolean } {
  // Membership is fixed at session start. Keep learning/failed/assisted
  // cards in this session, but retire successfully learned or reviewed cards.
  const ids = new Set(selectedWords(pair, selection).map((word) => word.id));
  const finished = !assisted &&
    (updated.status === "REVIEW" || updated.status === "MASTERED");
  const next = finished
    ? queue.slice(1).filter((id) => id !== updated.id)
    : advanceQueue(queue, updated, distance);
  return { queue: next.filter((id) => ids.has(id)), mode, switched: false };
}
