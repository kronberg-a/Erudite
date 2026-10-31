// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Blob as FileBlob } from "node:buffer";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { SettingsView } from "./SettingsView";
import { StatsView } from "./StatsView";
import { defaultSettings } from "../services/storage";
import { configureGemini } from "../services/gemini";
import { seedPair } from "../i18n/seedData";
import { translator } from "../i18n/translations";
import { DAY } from "../core/srsEngine";
import { localDate } from "../core/dailyGoal";
import type { AppData } from "../types";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let host: HTMLDivElement;
let root: Root;
let data: AppData;
const restore = vi.fn();
const createObjectURL = vi.fn((_blob: unknown) => "blob:erudite-test");
const revokeObjectURL = vi.fn();
const confirm = vi.fn(() => true);
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 31, 12));
  restore.mockClear();
  createObjectURL.mockClear();
  revokeObjectURL.mockClear();
  confirm.mockClear();
  vi.stubGlobal("Blob", FileBlob);
  vi.stubGlobal(
    "URL",
    class extends URL {
      static createObjectURL = createObjectURL;
      static revokeObjectURL = revokeObjectURL;
    },
  );
  vi.stubGlobal("confirm", confirm);
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  const pair = seedPair("en", "de");
  const now = Date.now();
  pair.words = [
    {
      ...pair.words[0],
      status: "MASTERED",
      step: 5,
      repCount: 20,
      lastReviewedOrder: 16,
      interval: 90,
      nextReviewDate: now + 20 * DAY,
      easeFactor: 2.1,
      reviewRepetitions: 6,
      createdAt: now - 100 * DAY,
      lastStudiedAt: now - 2 * DAY,
    },
    {
      ...pair.words[1],
      status: "LEARNING",
      step: 1,
      repCount: 8,
      lastReviewedOrder: 17,
      easeFactor: 1.7,
      lastStudiedAt: now,
    },
    {
      ...pair.words[2],
      status: "REVIEW",
      step: 3,
      repCount: 12,
      lastReviewedOrder: 18,
      interval: 7,
      nextReviewDate: now + DAY,
      easeFactor: 2.3,
      reviewRepetitions: 2,
      lastStudiedAt: now,
    },
  ];
  data = {
    version: 3,
    reviewOrder: 18,
    settings: { ...defaultSettings, geminiApiKey: "private-test-key" },
    pairs: { "en-de": pair },
    activityLog: { [localDate()]: 8, [localDate(new Date(now - DAY))]: 6 },
    recallModes: { SWIPE_ONLY: 3, KEYBOARD: 7, TILES: 4 },
    dailyProgress: {
      date: localDate(),
      wordIds: [JSON.stringify(["en-de", pair.words[1].id])],
      acknowledgedGoal: null,
    },
  };
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  configureGemini();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
function settings() {
  act(() =>
    root.render(
      <SettingsView
        data={data}
        changeSettings={vi.fn()}
        restore={restore}
        t={translator("en")}
      />,
    ),
  );
}
function statistics(value: AppData) {
  act(() =>
    root.render(
      <StatsView
        pair={value.pairs["en-de"]}
        data={value}
        settings={value.settings}
        t={translator("en")}
      />,
    ),
  );
  return host.textContent;
}
async function importBackup(text: string) {
  const file = new File([text], "backup.json", { type: "application/json" });
  Object.defineProperty(file, "text", { value: async () => text });
  const input = host.querySelector<HTMLInputElement>('input[type="file"]')!;
  Object.defineProperty(input, "files", { configurable: true, value: [file] });
  await act(async () => {
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}
it("exports and restores activity, modes and complete SRS data with identical dashboard statistics", async () => {
  const expectedStatistics = statistics(data);
  settings();
  expect(host.querySelector(".data-panel")?.textContent).toContain(
    translator("en")("backupContents"),
  );
  const exportButton = Array.from(
    host.querySelectorAll<HTMLButtonElement>("button"),
  ).find((button) => button.textContent === translator("en")("export"))!;
  act(() => exportButton.click());
  const blob = createObjectURL.mock.calls[0][0] as unknown as FileBlob;
  const text = await blob.text();
  const backup = JSON.parse(text);
  expect(backup.activityLog).toEqual(data.activityLog);
  expect(backup.recallModes).toEqual(data.recallModes);
  expect(backup.pairs["en-de"].words).toEqual(data.pairs["en-de"].words);
  expect(text).not.toContain("private-test-key");
  await importBackup(text);
  expect(confirm).toHaveBeenCalledExactlyOnceWith(
    translator("en")("importConfirm"),
  );
  const restored: AppData = restore.mock.calls[0][0];
  expect(restored.activityLog).toEqual(data.activityLog);
  expect(restored.recallModes).toEqual(data.recallModes);
  expect(restored.dailyProgress).toEqual(data.dailyProgress);
  expect(restored.reviewOrder).toBe(data.reviewOrder);
  expect(statistics(restored)).toBe(expectedStatistics);
  act(() => vi.advanceTimersByTime(1000));
  expect(revokeObjectURL).toHaveBeenCalledWith("blob:erudite-test");
});
it("accepts older backups without activity tracking while preserving saved learning progress", async () => {
  settings();
  const { activityLog: _activity, recallModes: _modes, ...oldBackup } = data;
  await importBackup(JSON.stringify(oldBackup));
  const restored: AppData = restore.mock.calls[0][0];
  expect(restored.activityLog).toEqual({});
  expect(restored.recallModes).toEqual({});
  expect(restored.pairs["en-de"].words).toEqual(data.pairs["en-de"].words);
});
it("rejects malformed statistics and leaves current data untouched", async () => {
  settings();
  await importBackup(
    JSON.stringify({ ...data, activityLog: { "2026-10-31": -1 } }),
  );
  expect(restore).not.toHaveBeenCalled();
  expect(confirm).not.toHaveBeenCalled();
  expect(host.querySelector('[role="alert"]')?.textContent).toContain(
    translator("en")("importError"),
  );
});
