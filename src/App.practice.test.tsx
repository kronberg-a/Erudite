// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { seedPair } from "./i18n/seedData";
import { defaultSettings } from "./services/storage";

import type { AppData } from "./types";
vi.mock("./core/speech", () => ({ speak: vi.fn(() => true) }));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  localStorage.clear();
  sessionStorage.clear();
  HTMLDialogElement.prototype.close = vi.fn();
  HTMLDialogElement.prototype.showModal = vi.fn();
  const pair = seedPair("en", "de");
  pair.words = [
    {
      ...pair.words[0],
      id: "reset",
      targetWord: "Reset me",
      categoryIds: ["core"],
      status: "MASTERED", interval: 90, reviewRepetitions: 6,
      step: 5,
    },
    {
      ...pair.words[1],
      id: "spent",
      status: "REVIEW",
      categoryIds: ["core"],
      step: 3,
    },
    {
      ...pair.words[2],
      id: "older-new",
      targetWord: "Older new word",
      categoryIds: ["core"],
    },
  ];
  const data: AppData = {
    version: 3,
    reviewOrder: 0,
    settings: { ...defaultSettings },
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
async function renderApp() {
  const { default: App } = await import("./App");
  act(() => root.render(<App />));
}
function clickText(text: string) {
  const target = Array.from(container.querySelectorAll("button")).find(
    (b) => b.textContent?.trim() === text,
  );
  if (!target) throw new Error(`Missing ${text}`);
  act(() => target.click());
}
function clickLabel(label: string) {
  const target = Array.from(
    container.querySelectorAll<HTMLButtonElement>("button"),
  ).find((b) => b.getAttribute("aria-label") === label);
  if (!target) throw new Error(`Missing ${label}`);
  act(() => target.click());
}
function fill(input: HTMLInputElement, value: string) {
  act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
describe("new and reset word practice", () => {
  it("shows each vocabulary word's status and remaining mastery recalls and updates after reset", async () => {
    const stored: AppData = JSON.parse(localStorage.getItem("erudite:v3")!);
    stored.pairs["en-de"].words.push({ ...stored.pairs["en-de"].words[2], id: "learning", targetWord: "Learning word", status: "LEARNING", step: 2 });
    localStorage.setItem("erudite:v3", JSON.stringify(stored));
    await renderApp(); clickText("Vocabulary");
    const rows = () => Array.from(container.querySelectorAll('.vocabulary-table .word-row'));
    expect(rows()).toHaveLength(4);
    const mastered = rows().find((row) => row.textContent?.includes("Reset me"))!;
    expect(mastered.querySelector('.word-status-indicator.green')!.getAttribute("aria-label")).toBe("Memorized");
    expect(mastered.querySelector('.word-review-count')!.textContent).toBe("0 recalls left");
    const unseen = rows().find((row) => row.textContent?.includes("Older new word"))!;
    expect(unseen.querySelector('.word-review-count')!.textContent).toBe("9 recalls left");
    const review = rows().find((row) => row.querySelector('[data-status="review"]'))!;
    expect(review.querySelector('.word-status-indicator.amber')!.getAttribute("aria-label")).toBe("Scheduled review");
    expect(review.querySelector('.word-review-count')!.textContent).toBe("6 scheduled reviews left");
    const learning = rows().find((row) => row.textContent?.includes("Learning word"))!;
    expect(learning.querySelector('.word-status-indicator.amber')!.getAttribute("title")).toBe("Learning 2/3");
    expect(learning.querySelector('.word-review-count')!.textContent).toBe("7 recalls left");
    clickLabel("Reset progress: Reset me");
    const reset = rows().find((row) => row.textContent?.includes("Reset me"))!;
    expect(reset.querySelector('.word-status-indicator.blue')!.getAttribute("aria-label")).toBe("New words");
    expect(reset.querySelector('.word-review-count')!.textContent).toBe("9 recalls left");
  });
  it("persists instant mastery and excludes newly mastered words from regular sessions after reload", async () => {
    await renderApp();
    clickText("Settings");
    act(() => container.querySelector<HTMLInputElement>("#instant-master")!.click());
    expect(JSON.parse(localStorage.getItem("erudite:v3")!).settings.instantMasterOnFirstTry).toBe(true);
    clickText("Learn");
    act(() => container.querySelector<HTMLInputElement>('input[name="session-mode"][value="new"]')!.click());
    clickText("Start practice");
    clickText("Already know");
    expect(container.textContent).toContain("Session complete.");
    expect(JSON.parse(localStorage.getItem("erudite:v3")!).pairs["en-de"].words.find((w: { id: string }) => w.id === "older-new")).toMatchObject({ status: "MASTERED", step: 5, interval: 90 });
    act(() => root.unmount());
    root = createRoot(container);
    vi.resetModules();
    await renderApp();
    expect(JSON.parse(localStorage.getItem("erudite:v3")!).settings.instantMasterOnFirstTry).toBe(true);
    expect(container.querySelector<HTMLInputElement>('input[name="session-mode"]:checked')?.value).toBe("new");
    act(() => container.querySelector<HTMLInputElement>('input[name="session-mode"][value="mixed"]')!.click());
    clickText("Start practice");
    expect(container.querySelector('[role="progressbar"]')?.getAttribute("aria-valuemax")).toBe("1");
    expect(container.querySelector("article")?.textContent).not.toContain("Older new word");
  });
  it("disables regular folder practice when all words are memorized but allows individual practice", async () => {
    const stored: AppData = JSON.parse(localStorage.getItem("erudite:v3")!);
    stored.pairs["en-de"].words = stored.pairs["en-de"].words.map((word) => ({ ...word, status: "MASTERED", step: 5 }));
    localStorage.setItem("erudite:v3", JSON.stringify(stored));
    await renderApp();
    clickText("Vocabulary");
    expect(container.querySelector<HTMLButtonElement>('[aria-label="Practice: Core vocabulary"]')?.disabled).toBe(true);
    clickLabel("Practice: Reset me");
    clickText("Start practice");
    expect(container.querySelector("article h2")?.textContent).toBe("Reset me");
    clickText("I know");
    expect(container.textContent).toContain("Session complete.");
  });
  it("requires session setup, respects folder selection, and restores setup after ending", async () => {
    await renderApp();
    expect(container.querySelector("article")).toBeNull();
    expect(container.querySelector(".session-settings h2")).toBeNull();
    expect(container.querySelectorAll('.session-settings input')).toHaveLength(3);
    expect(container.querySelector('.session-settings select')).toBeNull();
    expect(container.querySelector('.session-folders')).toBeNull();
    act(() => container.querySelector<HTMLInputElement>('input[name="session-mode"][value="new"]')!.click());
    clickText("Start practice");
    expect(container.querySelector("article h2")?.textContent).toBe("Older new word");
    expect(container.querySelector(".session-settings")).toBeNull();
    clickText("End session");
    expect(container.querySelector(".session-settings")).not.toBeNull();
    expect(container.querySelector<HTMLInputElement>('input[name="session-mode"]:checked')?.value).toBe("new");
    expect(container.querySelector("article")).toBeNull();
    const current: AppData = JSON.parse(localStorage.getItem("erudite:v3")!);
    expect(current.pairs["en-de"].categories.every((c) => c.isActiveForStudy)).toBe(true);
  });
  it("resets mastered words and whole folders directly into the immediately available review pool", async () => {
    await renderApp();
    clickText("Vocabulary");
    clickLabel("Reset to review: Reset me");
    clickText("Reset to review");
    const current: AppData = JSON.parse(localStorage.getItem("erudite:v3")!);
    expect(
      current.pairs["en-de"].words.every(
        (word) =>
          word.status === "REVIEW" && word.step === 3 && word.repCount === 0,
      ),
    ).toBe(true);
    clickLabel("Practice: Core vocabulary");
    clickText("Start practice");
    expect(container.querySelector(".summary-grid")).toBeNull();
    expect(container.querySelector(".session-pill-new strong")?.textContent).toBe("0");
    expect(container.querySelector(".session-pill-active strong")?.textContent).toBe("3");
    expect(container.querySelector('[role="progressbar"]')?.getAttribute("aria-valuemax")).toBe("3");
    expect(container.querySelector("article")).not.toBeNull();
  });
  it("introduces unseen words as flashcards before hiding them for typing", async () => {
    const stored: AppData = JSON.parse(localStorage.getItem("erudite:v3")!);
    stored.settings.studyMode = "TYPE_ONLY";
    localStorage.setItem("erudite:v3", JSON.stringify(stored));
    await renderApp();
    clickText("Vocabulary");
    clickLabel("Reset progress: Reset me");
    clickLabel("Practice: Reset me");
    clickText("Start practice");
    expect(container.querySelector("article h2")?.textContent).toBe("Reset me");
    expect(container.querySelector('[aria-label="Your answer"]')).toBeNull();
    clickText("Already know");
    expect(container.querySelector("main")?.textContent).not.toContain(
      "Reset me",
    );
    expect(
      container.querySelector('[aria-label="Your answer"]'),
    ).not.toBeNull();
  });
  it("shows the real new count and allows unrestricted folder practice", async () => {
    await renderApp();
    expect(container.querySelector(".summary-grid")?.textContent).toContain(
      "New words01",
    );

    clickText("Vocabulary");
    clickLabel("Practice: Core vocabulary");
    clickText("Start practice");
    expect(container.querySelector("article")?.textContent).toContain(
      "die Zeit",
    );
  });
  it("starts practice of a just-saved word instead of older seed words without a daily allowance", async () => {
    await renderApp();
    expect(
      Array.from(container.querySelectorAll("nav button")).some(
        (button) => button.textContent?.trim() === "Add word",
      ),
    ).toBe(false);
    clickText("Vocabulary");
    clickText("Add word");
    fill(
      container.querySelector<HTMLInputElement>(
        '[aria-label="Word in the learning language"]',
      )!,
      "Neu",
    );
    const translation = Array.from(
      container.querySelectorAll<HTMLInputElement>("input"),
    ).find((el) => el.closest("label")?.textContent?.trim() === "Translation")!;
    fill(translation, "New");
    act(() =>
      container
        .querySelector("form")!
        .dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        ),
    );
    expect(container.querySelector(".word-table")?.textContent).toContain("Neu");
    clickLabel("Close");
    expect(container.querySelector('[aria-label="Word in the learning language"]')).toBeNull();
    clickText("Add word");
    expect(container.querySelector<HTMLInputElement>('[aria-label="Word in the learning language"]')?.value).toBe("");
    fill(container.querySelector<HTMLInputElement>('[aria-label="Word in the learning language"]')!, "Frisch");
    const nextTranslation = Array.from(container.querySelectorAll<HTMLInputElement>("input"))
      .find((el) => el.closest("label")?.textContent?.trim() === "Translation")!;
    fill(nextTranslation, "Fresh");
    act(() => container.querySelector("dialog form")!.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    ));
    clickText("Practice saved word");
    clickText("Start practice");
    expect(container.querySelector("article h2")?.textContent).toBe("Frisch");
    const stored: AppData = JSON.parse(localStorage.getItem("erudite:v3")!);
    expect(
      stored.pairs["en-de"].words.find((w) => w.targetWord === "Neu")?.status,
    ).toBe("NEW");
  });
  it("makes reset words directly selectable, including from an excluded folder, without clearing unrelated progress", async () => {
    const stored: AppData = JSON.parse(localStorage.getItem("erudite:v3")!);
    stored.pairs["en-de"].categories[0].isActiveForStudy = false;
    localStorage.setItem("erudite:v3", JSON.stringify(stored));
    await renderApp();
    clickText("Vocabulary");
    clickLabel("Reset progress: Reset me");
    clickLabel("Practice: Reset me");
    clickText("Start practice");
    expect(container.querySelector("article h2")?.textContent).toBe("Reset me");
    const current: AppData = JSON.parse(localStorage.getItem("erudite:v3")!);
    expect(
      current.pairs["en-de"].words.find((w) => w.id === "reset"),
    ).toMatchObject({ status: "NEW", repCount: 0, lastReviewedOrder: 0 });
    expect(
      current.pairs["en-de"].words.find((w) => w.id === "spent")?.status,
    ).toBe("REVIEW");
    expect(current.pairs["en-de"].categories[0].isActiveForStudy).toBe(false);
  });
});
