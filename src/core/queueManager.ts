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
      selection.kind === "categories"
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
  const fresh = available.filter((w) => w.status === "NEW");
  const progress = available
    .filter((w) => w.status === "LEARNING" || w.status === "REVIEW")
    .sort(
      (a, b) => a.step - b.step || a.lastReviewedOrder - b.lastReviewedOrder,
    );
  if (mode === "new") return fresh.map((w) => w.id);
  if (mode === "review") return progress.map((w) => w.id);
  const result: WordCard[] = [];
  for (
    let p = 0, n = 0;
    p < progress.length || n < fresh.length;
    p += 3, n += 2
  )
    result.push(...progress.slice(p, p + 3), ...fresh.slice(n, n + 2));
  return result.map((w) => w.id);
}
export function buildStudyQueue(
  pair: PairData,
  mode: Mode,
  selection?: StudySelection,
): string[] {
  return buildQueue(
    selectedWords(pair, selection),
    pair.categories.map((c) => ({ ...c, isActiveForStudy: true })),
    mode,
  );
}
export function advanceQueue(
  queue: string[],
  updated: WordCard,
  distance: number,
): string[] {
  const remaining = queue.slice(1).filter((id) => id !== updated.id);
  if (updated.status !== "MASTERED")
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
): { queue: string[]; mode: Mode; switched: boolean } {
  const eligible = buildStudyQueue(pair, mode, selection);
  const ids = new Set(eligible);
  const next = advanceQueue(queue, updated, distance).filter((id) =>
    ids.has(id),
  );
  const existing = new Set(next);
  next.push(...eligible.filter((id) => !existing.has(id)));
  if (
    next.length ||
    !selectedWords(pair, selection).some((w) => w.status !== "MASTERED")
  )
    return { queue: next, mode, switched: false };
  const fallback = mode === "new" ? "review" : "new";
  return {
    queue: buildStudyQueue(pair, fallback, selection),
    mode: fallback,
    switched: true,
  };
}
export function availableMode(
  pair: PairData,
  mode: Mode,
  selection?: StudySelection,
): Mode {
  return buildStudyQueue(pair, mode, selection).length ||
    !selectedWords(pair, selection).some((w) => w.status !== "MASTERED")
    ? mode
    : mode === "new"
      ? "review"
      : "new";
}
