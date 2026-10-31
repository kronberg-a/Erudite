import type { PairData, StudyActivity, RecallMode, WordCard } from "../types";
import { localDate } from "./dailyGoal";
import { DAY } from "./srsEngine";

const percent = (count: number, total: number) =>
  total ? (count / total) * 100 : 0;
const average = (values: number[]) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
const activeWords = (words: WordCard[]) =>
  words.filter((w) => w.status !== "NEW");
const ease = (w: WordCard) => w.easeFactor ?? 2.3;
function calendarDate(now: number, offset: number): Date {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
}

// Buckets are cumulative calendar horizons; today's bucket includes overdue reviews.
export function getForecast(words: WordCard[], now = Date.now()) {
  const dailyTimeline = Array.from({ length: 30 }, (_, day) => ({
    date: localDate(calendarDate(now, day)),
    count: 0,
  }));
  const end = calendarDate(now, 30).getTime();
  for (const word of words) {
    if (
      word.status !== "REVIEW" ||
      !word.nextReviewDate ||
      word.nextReviewDate >= end
    )
      continue;
    const key = localDate(
      new Date(Math.max(word.nextReviewDate, calendarDate(now, 0).getTime())),
    );
    const bucket = dailyTimeline.find((d) => d.date === key);
    if (bucket) bucket.count++;
  }
  const sum = (days: number) =>
    dailyTimeline.slice(0, days).reduce((n, d) => n + d.count, 0);
  return {
    today: words.filter(
      (w) =>
        w.status === "REVIEW" && !!w.nextReviewDate && w.nextReviewDate <= now,
    ).length,
    tomorrow: dailyTimeline[1].count,
    next7Days: sum(7),
    next14Days: sum(14),
    next30Days: sum(30),
    dailyTimeline,
  };
}

export const maturityBrackets = [
  "earlyLearning",
  "shortTerm",
  "mediumTerm",
  "longTerm",
  "mature",
] as const;
export function getMaturityDistribution(words: WordCard[]) {
  const active = activeWords(words);
  const counts = [0, 0, 0, 0, 0];
  for (const word of active) {
    const interval = word.interval ?? 0;
    const index =
      word.status === "MASTERED" || interval > 90
        ? 4
        : word.status === "LEARNING" || interval < 1
          ? 0
          : interval < 7
            ? 1
            : interval <= 30
              ? 2
              : 3;
    counts[index]++;
  }
  return maturityBrackets.map((bracket, i) => ({
    bracket,
    count: counts[i],
    percentage: percent(counts[i], active.length),
  }));
}

// This card-state proxy cannot reconstruct historical success/failure counts.
export function getRetentionStats(words: WordCard[]) {
  const active = activeWords(words);
  const successful = active.filter(
    (w) => (w.reviewRepetitions ?? 0) > 0 && ease(w) >= 2.3,
  );
  const mastered = words.filter((w) => w.status === "MASTERED");
  const dated = mastered.filter(
    (w) => w.lastStudiedAt !== undefined && w.lastStudiedAt >= w.createdAt,
  );
  return {
    accuracyRate: percent(successful.length, active.length),
    activeCount: active.length,
    averageEase: average(active.map(ease)),
    averageRepsToMaster: average(mastered.map((w) => w.repCount)),
    averageDaysToMaster: average(
      dated.map((w) => (w.lastStudiedAt! - w.createdAt) / DAY),
    ),
    masteredCount: mastered.length,
    datedMasteredCount: dated.length,
  };
}

export function getChallengingWords(words: WordCard[], limit = 10): WordCard[] {
  return words
    .filter(
      (w) => w.status !== "MASTERED" && (ease(w) < 1.8 || w.repCount >= 5),
    )
    .sort(
      (a, b) =>
        ease(a) - ease(b) ||
        b.repCount - a.repCount ||
        a.id.localeCompare(b.id),
    )
    .slice(0, Math.max(0, limit));
}

export function getCategoryStats(pair: PairData) {
  return pair.categories.map((category) => {
    const words = pair.words.filter((w) => w.categoryIds.includes(category.id));
    const memorized = words.filter((w) => w.status === "MASTERED").length;
    return {
      id: category.id,
      name: category.name,
      total: words.length,
      learning: words.filter(
        (w) => w.status === "NEW" || w.status === "LEARNING",
      ).length,
      review: words.filter((w) => w.status === "REVIEW").length,
      memorized,
      percentage: percent(memorized, words.length),
      averageEase: getRetentionStats(words).averageEase,
    };
  });
}

export function getVocabularySummary(words: WordCard[]) {
  const total = words.length;
  const memorized = words.filter((w) => w.status === "MASTERED").length;
  return { total, memorized, percentage: percent(memorized, total) };
}

export function getActivityHistory(
  log: Record<string, number> = {},
  now = Date.now(),
  days = 84,
) {
  return Array.from({ length: days }, (_, i) => {
    const date = localDate(calendarDate(now, i - days + 1));
    return { date, count: log[date] ?? 0 };
  });
}

export function getRecallModeSplit(counts: StudyActivity["recallModes"] = {}) {
  const modes: RecallMode[] = ["SWIPE_ONLY", "KEYBOARD", "TILES"];
  const total = modes.reduce((sum, mode) => sum + (counts[mode] ?? 0), 0);
  return modes.map((mode) => ({
    mode,
    count: counts[mode] ?? 0,
    percentage: percent(counts[mode] ?? 0, total),
  }));
}

export function recordStudyActivity(
  activity: StudyActivity,
  mode: RecallMode,
  now = Date.now(),
): StudyActivity {
  const date = localDate(new Date(now));
  return {
    activityLog: {
      ...activity.activityLog,
      [date]: (activity.activityLog?.[date] ?? 0) + 1,
    },
    recallModes: {
      ...activity.recallModes,
      [mode]: (activity.recallModes?.[mode] ?? 0) + 1,
    },
  };
}

export function validStudyActivity(value: StudyActivity): boolean {
  const counts = (v: unknown) =>
    !!v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.values(v).every((n) => Number.isSafeInteger(n) && n >= 0);
  return (
    (value.activityLog === undefined ||
      (counts(value.activityLog) &&
        Object.keys(value.activityLog).every((date) => {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
          const parsed = new Date(`${date}T12:00:00`);
          return (
            Number.isFinite(parsed.getTime()) && localDate(parsed) === date
          );
        }))) &&
    (value.recallModes === undefined ||
      (counts(value.recallModes) &&
        Object.keys(value.recallModes).every((key) =>
          ["SWIPE_ONLY", "KEYBOARD", "TILES"].includes(key),
        )))
  );
}
