// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { seedPair } from "./i18n/seedData";
import { defaultSettings } from "./services/storage";
import { localDate, recordRecall } from "./core/dailyGoal";
import { buildStudyQueue } from "./core/queueManager";
import type { AppData } from "./types";

vi.mock("./core/speech", () => ({ speak: vi.fn(() => true) }));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 27, 12));
  localStorage.clear();
  const pair = seedPair("en", "de");
  pair.words = pair.words.slice(0, 3);
  const data: AppData = {
    version: 3, reviewOrder: 0,
    settings: { ...defaultSettings, dailyWordGoal: 1 },
    pairs: { "en-de": pair },
  };
  localStorage.setItem("erudite:v3", JSON.stringify(data));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});
function stored(): AppData { return JSON.parse(localStorage.getItem("erudite:v3")!); }
async function renderApp() {
  const { default: App } = await import("./App");
  act(() => root.render(<App />));
}
function click(text: string) {
  const button = Array.from(container.querySelectorAll("button")).find((b) => b.textContent?.trim() === text);
  if (!button) throw new Error(`Missing ${text}`);
  act(() => button.click());
}
function grade() {
  const button = container.querySelector<HTMLButtonElement>(".action-know")!;
  act(() => button.click());
}

describe("daily word goal", () => {
  it("accepts a typed goal from 1 to 50 and preserves the unlimited option", async () => {
    await renderApp();
    click("Settings");
    const input = container.querySelector<HTMLInputElement>('input[type="number"]')!;
    const unlimited = container.querySelector<HTMLInputElement>('#unlimited-goal')!;
    const fillGoal = (value: string) => act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(input.min).toBe("1");
    expect(input.max).toBe("50");
    fillGoal("");
    expect(stored().settings.dailyWordGoal).toBe(1);
    fillGoal("50");
    expect(stored().settings.dailyWordGoal).toBe(50);
    for (const invalid of ["0", "51", "1.5"]) {
      fillGoal(invalid);
      expect(stored().settings.dailyWordGoal).toBe(50);
    }
    act(() => input.dispatchEvent(new FocusEvent("focusout", { bubbles: true })));
    expect(input.value).toBe("50");
    act(() => unlimited.click());
    expect(stored().settings.dailyWordGoal).toBeNull();
    expect(input.disabled).toBe(false);
    expect(input.value).toBe("");
    fillGoal("12");
    expect(stored().settings.dailyWordGoal).toBe(12);
    expect(unlimited.checked).toBe(false);
  });
  it("lets users focus and type a goal directly from the default unlimited setting", async () => {
    const data = stored();
    data.settings.dailyWordGoal = null;
    localStorage.setItem("erudite:v3", JSON.stringify(data));
    await renderApp();
    click("Settings");
    const input = container.querySelector<HTMLInputElement>('input[type="number"]')!;
    expect(input.disabled).toBe(false);
    expect(input.inputMode).toBe("numeric");
    expect(input.value).toBe("");
    act(() => input.focus());
    expect(document.activeElement).toBe(input);
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "20");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });
    expect(stored().settings.dailyWordGoal).toBe(20);
    expect(container.querySelector<HTMLInputElement>('#unlimited-goal')!.checked).toBe(false);
    expect(input.value).toBe("20");
  });
  it("pauses at the goal, blocks grading shortcuts, and continues the preserved queue only once", async () => {
    await renderApp();
    click("Start practice");
    grade();
    expect(container.textContent).toContain("Daily goal reached");
    expect(document.activeElement?.textContent).toContain("Continue learning");
    expect(stored().dailyProgress?.wordIds).toHaveLength(1);
    act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
    expect(stored().reviewOrder).toBe(1);
    click("Continue learning");
    expect(container.querySelector("article")).not.toBeNull();
    grade();
    expect(container.textContent).not.toContain("Daily goal reached");
    expect(stored().dailyProgress?.wordIds).toHaveLength(2);
    click("End session");
    click("Start practice");
    expect(container.textContent).not.toContain("Daily goal reached");
  });
  it("restores daily progress on undo and celebrates again on reaching the goal", async () => {
    await renderApp();
    click("Start practice");
    grade();
    act(() => document.activeElement?.dispatchEvent(new KeyboardEvent("keydown", { key: "z", ctrlKey: true, bubbles: true })));
    expect(stored().dailyProgress?.wordIds).toHaveLength(0);
    expect(stored().reviewOrder).toBe(0);
    expect(container.textContent).not.toContain("Daily goal reached");
    grade();
    expect(container.textContent).toContain("Daily goal reached");
  });
  it("ends the session and retains progress across an app remount", async () => {
    await renderApp();
    click("Start practice");
    grade();
    click("End session");
    expect(container.querySelector("article")).toBeNull();
    act(() => root.unmount());
    root = createRoot(container);
    vi.resetModules();
    await renderApp();
    expect(container.querySelector(".session-goal")?.getAttribute("aria-label")).toBe("Daily word goal: 1 / 1");
    click("Start practice");
    expect(container.textContent).not.toContain("Daily goal reached");
    expect(container.querySelector("article")).not.toBeNull();
  });
  it("does not count Repeat but counts a committed manual mastery", async () => {
    await renderApp();
    click("Start practice");
    click("Don’t know");
    expect(stored().dailyProgress?.wordIds).toHaveLength(0);
    const before = stored();
    act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })));
    expect(stored().reviewOrder).toBe(before.reviewOrder + 1);
    expect(stored().dailyProgress?.wordIds).toHaveLength(1);
    expect(container.textContent).toContain("Daily goal reached");
  });
  it("does not pause unlimited practice", async () => {
    const data = stored();
    data.settings.dailyWordGoal = null;
    localStorage.setItem("erudite:v3", JSON.stringify(data));
    await renderApp();
    click("Start practice");
    grade();
    expect(container.textContent).not.toContain("Daily goal reached");
    expect(container.querySelector("article")).not.toBeNull();
  });
  it("waits for a committed typing answer before celebrating", async () => {
    const data = stored();
    data.settings.studyMode = "TYPE_ONLY";
    const pair = data.pairs["en-de"];
    pair.words[0] = { ...pair.words[0], status: "LEARNING", step: 0 };
    const word = pair.words.find((w) => w.id === buildStudyQueue(pair, "mixed")[0])!;
    localStorage.setItem("erudite:v3", JSON.stringify(data));
    await renderApp();
    click("Start practice");
    const input = container.querySelector<HTMLInputElement>('[aria-label="Your answer"]')!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, word.targetWord);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    click("Check");
    expect(container.textContent).not.toContain("Daily goal reached");
    expect(stored().reviewOrder).toBe(0);
    click("I know");
    expect(container.textContent).toContain("Daily goal reached");
    click("Continue learning");
    expect(container.querySelector(".card-prompt")).not.toBeNull();
  });
  it("resets at local midnight during an open session", async () => {
    vi.setSystemTime(new Date(2026, 9, 27, 23, 59, 59));
    await renderApp();
    click("Start practice");
    grade();
    expect(container.textContent).toContain("Daily goal reached");
    act(() => vi.advanceTimersByTime(1000));
    expect(container.textContent).not.toContain("Daily goal reached");
    expect(container.querySelector(".session-goal")?.getAttribute("aria-label")).toBe("Daily word goal: 0 / 1");
    grade();
    expect(stored().dailyProgress?.date).toBe(localDate());
    expect(stored().dailyProgress?.wordIds).toHaveLength(1);
    expect(container.textContent).toContain("Daily goal reached");
  });
  it("counts distinct words across language pairs and resets yesterday's progress", () => {
    const first = recordRecall(undefined, "en-de", "word");
    expect(recordRecall(first, "en-de", "word").wordIds).toHaveLength(1);
    const second = recordRecall(first, "en-fr", "word");
    expect(second.wordIds).toHaveLength(2);
    vi.setSystemTime(new Date(2026, 9, 28, 0));
    expect(recordRecall(second, "en-de", "word").wordIds).toHaveLength(1);
  });
});
