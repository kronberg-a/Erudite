import { describe, expect, it } from "vitest";
import { seedPair } from "../i18n/seedData";
import type { WordCard } from "../types";
import { buildStudyQueue } from "./queueManager";
import {
  getActivityHistory,
  getCategoryStats,
  getChallengingWords,
  getForecast,
  getMaturityDistribution,
  getRecallModeSplit,
  getRetentionStats,
  getVocabularySummary,
  recordStudyActivity,
  validStudyActivity,
} from "./stats";
import { DAY } from "./srsEngine";
import { localDate } from "./dailyGoal";
const now = new Date(2026, 9, 31, 12).getTime();
const base = seedPair("en", "de");
const word = (patch: Partial<WordCard> = {}): WordCard => ({
  ...base.words[0],
  ...patch,
});
const onDay = (days: number) => new Date(2026, 9, 31 + days, 12).getTime();

describe("review forecast", () => {
  it("uses local calendar horizons including overdue reviews, with exclusive end boundaries", () => {
    const words = [-10, 0, 1, 6, 7, 13, 14, 29, 30].map((offset) =>
      word({ status: "REVIEW", nextReviewDate: onDay(offset) }),
    );
    const result = getForecast(
      [
        ...words,
        word({ status: "LEARNING", nextReviewDate: now }),
        word({ status: "MASTERED", nextReviewDate: now }),
        word({ status: "REVIEW", nextReviewDate: 0 }),
      ],
      now,
    );
    expect(result).toMatchObject({
      today: 2,
      tomorrow: 1,
      next7Days: 4,
      next14Days: 6,
      next30Days: 8,
    });
    expect(result.dailyTimeline).toHaveLength(30);
    expect(result.dailyTimeline[0]).toEqual({ date: "2026-10-31", count: 2 });
    expect(result.dailyTimeline[29]).toEqual({ date: "2026-11-29", count: 1 });
  });
  it("handles midnight and changing calendar months", () => {
    const start = new Date(2026, 2, 28, 23, 30).getTime();
    const result = getForecast(
      [
        word({
          status: "REVIEW",
          nextReviewDate: new Date(2026, 2, 29).getTime(),
        }),
      ],
      start,
    );
    expect(result.tomorrow).toBe(1);
    expect(result.today).toBe(0);
    expect(result.dailyTimeline[4].date).toBe("2026-04-01");
    const laterToday = getForecast(
      [word({ status: "REVIEW", nextReviewDate: now + 60_000 })],
      now,
    );
    expect(laterToday.today).toBe(0);
    expect(laterToday.dailyTimeline[0].count).toBe(1);
  });
});

it("segments every interval boundary and excludes new words", () => {
  const words = [
    word(),
    word({ status: "LEARNING", step: 2 }),
    ...[1, 6, 7, 30, 31, 90, 91].map((interval) =>
      word({ status: "REVIEW", interval }),
    ),
    word({ status: "MASTERED", interval: 1 }),
  ];
  const result = getMaturityDistribution(words);
  expect(result.map((d) => d.count)).toEqual([1, 2, 2, 2, 2]);
  expect(result.reduce((n, d) => n + d.percentage, 0)).toBeCloseTo(100);
});

it("calculates retention proxy and excludes NEW ease values from stability", () => {
  const words = [
    word({ status: "NEW", easeFactor: 8 }),
    word({ status: "REVIEW", reviewRepetitions: 2, easeFactor: 2.3 }),
    word({ status: "LEARNING", easeFactor: 1.5 }),
    word({
      status: "MASTERED",
      reviewRepetitions: 6,
      easeFactor: 2.5,
      repCount: 12,
      createdAt: now - 20 * DAY,
      lastStudiedAt: now,
    }),
  ];
  const result = getRetentionStats(words);
  expect(result.accuracyRate).toBeCloseTo(200 / 3);
  expect(result.averageEase).toBeCloseTo(2.1);
  expect(result.averageRepsToMaster).toBe(12);
  expect(result.averageDaysToMaster).toBe(20);
  expect(
    getRetentionStats([word({ status: "MASTERED", lastStudiedAt: undefined })])
      .datedMasteredCount,
  ).toBe(0);
});

it("finds and ranks challenging words without mutating the source or including memorized words", () => {
  const words = [
    word({ id: "reps", repCount: 5 }),
    word({ id: "hard", easeFactor: 1.7 }),
    word({ id: "boundary", easeFactor: 1.8, repCount: 4 }),
    word({ id: "master", status: "MASTERED", easeFactor: 1.3, repCount: 50 }),
  ];
  expect(getChallengingWords(words).map((w) => w.id)).toEqual(["hard", "reps"]);
  expect(getChallengingWords(words, 1)).toHaveLength(1);
  expect(getChallengingWords(words, 0)).toEqual([]);
  expect(words[0].id).toBe("reps");
  expect(
    buildStudyQueue(
      {
        ...base,
        categories: base.categories.map((c) => ({
          ...c,
          isActiveForStudy: false,
        })),
        words: words.map((w) => ({ ...w, categoryIds: [] })),
      },
      "mixed",
      { kind: "words", ids: ["hard", "reps", "missing", "hard"] },
    ).sort(),
  ).toEqual(["hard", "reps"]);
});

it("aggregates categories including overlap and empty folders", () => {
  const categories = base.categories.slice(0, 3);
  const pair = {
    categories,
    words: [
      word({
        categoryIds: [categories[0].id, categories[1].id],
        status: "MASTERED",
      }),
      word({
        categoryIds: [categories[0].id],
        status: "LEARNING",
        easeFactor: 1.5,
      }),
      word({ categoryIds: [categories[0].id], status: "REVIEW" }),
      word({ categoryIds: [categories[0].id] }),
    ],
  };
  const result = getCategoryStats(pair);
  expect(result[0]).toMatchObject({
    total: 4,
    learning: 2,
    review: 1,
    memorized: 1,
    percentage: 25,
  });
  expect(result[0].averageEase).toBeCloseTo((2.3 + 1.5 + 2.3) / 3);
  expect(result[1].percentage).toBe(100);
  expect(getVocabularySummary(pair.words)).toEqual({
    total: 4,
    memorized: 1,
    percentage: 25,
  });
  expect(result[2]).toMatchObject({ total: 0, percentage: 0, averageEase: 0 });

});

it("records every committed turn immutably by local day and actual input mode", () => {
  const initial = {
    activityLog: { "2026-10-30": 3 },
    recallModes: { KEYBOARD: 2 },
  };
  const first = recordStudyActivity(initial, "TILES", now);
  const second = recordStudyActivity(first, "SWIPE_ONLY", now);
  const next = recordStudyActivity(second, "KEYBOARD", onDay(1));
  expect(next.activityLog).toEqual({
    "2026-10-30": 3,
    "2026-10-31": 2,
    "2026-11-01": 1,
  });
  expect(next.recallModes).toEqual({ KEYBOARD: 3, TILES: 1, SWIPE_ONLY: 1 });
  expect(initial.activityLog).toEqual({ "2026-10-30": 3 });
  expect(getRecallModeSplit(next.recallModes).map((m) => m.percentage)).toEqual(
    [20, 60, 20],
  );
  const history = getActivityHistory(next.activityLog, now);
  expect(history).toHaveLength(84);
  expect(history[83]).toEqual({ date: localDate(new Date(now)), count: 2 });
  expect(history[0].count).toBe(0);
});

it("validates optional analytics and rejects malformed dates, modes and counts", () => {
  expect(validStudyActivity({})).toBe(true);
  expect(
    validStudyActivity({
      activityLog: { "2026-10-31": 2 },
      recallModes: { TILES: 0 },
    }),
  ).toBe(true);
  for (const activityLog of [
    null,
    [],
    { "2026-02-30": 1 },
    { bad: 1 },
    { "2026-10-31": -1 },
    { "2026-10-31": 0.5 },
  ])
    expect(validStudyActivity({ activityLog } as never)).toBe(false);
  for (const recallModes of [[], null, { MIXED: 1 }, { KEYBOARD: Infinity }])
    expect(validStudyActivity({ recallModes } as never)).toBe(false);
});

it("returns finite neutral values for empty inputs", () => {
  expect(getForecast([], now).next30Days).toBe(0);
  expect(getMaturityDistribution([]).every((d) => d.percentage === 0)).toBe(
    true,
  );
  expect(Object.values(getRetentionStats([])).every((n) => n === 0)).toBe(true);
  expect(getVocabularySummary([])).toEqual({
    total: 0,
    memorized: 0,
    percentage: 0,
  });
  expect(getCategoryStats({ words: [], categories: [] })).toEqual([]);
  expect(
    getRecallModeSplit().every((m) => m.count === 0 && m.percentage === 0),
  ).toBe(true);
});

