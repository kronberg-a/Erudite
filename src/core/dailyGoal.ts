import type { DailyProgress } from "../types";

export function localDate(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function todayProgress(progress?: DailyProgress): DailyProgress {
  const date = localDate();
  return progress?.date === date
    ? progress
    : { date, wordIds: [], acknowledgedGoal: null };
}

export function recordRecall(progress: DailyProgress | undefined, pair: string, id: string): DailyProgress {
  const today = todayProgress(progress);
  const identity = JSON.stringify([pair, id]);
  return today.wordIds.includes(identity)
    ? today
    : { ...today, wordIds: [...today.wordIds, identity] };
}

export function hydrateDailyProgress(value: unknown): DailyProgress | undefined {
  if (value === undefined) return undefined;
  const p = value as DailyProgress;
  if (!p || typeof p.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(p.date) ||
    !Array.isArray(p.wordIds) || !p.wordIds.every((id) => typeof id === "string") ||
    new Set(p.wordIds).size !== p.wordIds.length ||
    (p.acknowledgedGoal !== null && (!Number.isInteger(p.acknowledgedGoal) || p.acknowledgedGoal < 1 || p.acknowledgedGoal > 50))) {
    throw new Error("Invalid daily progress");
  }
  return { date: p.date, wordIds: [...p.wordIds], acknowledgedGoal: p.acknowledgedGoal };
}
