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
  HTMLDialogElement.prototype.close = vi.fn();
  const pair = seedPair("en", "de");
  pair.words = [
    {
      ...pair.words[0],
      id: "reset",
      targetWord: "Reset me",
      categoryIds: ["core"],
      status: "MASTERED",
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
    version: 2,
    reviewOrder: 0,
    settings: { ...defaultSettings },
    pairs: { "en-de": pair },
  };
  localStorage.setItem("erudite:v2", JSON.stringify(data));
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
  it("resets mastered words and whole folders directly into the immediately available review pool", async () => {
    await renderApp();
    clickText("Vocabulary");
    clickLabel("Reset to review: Reset me");
    clickText("Reset to review");
    const current: AppData = JSON.parse(localStorage.getItem("erudite:v2")!);
    expect(
      current.pairs["en-de"].words.every(
        (word) =>
          word.status === "REVIEW" && word.step === 3 && word.repCount === 0,
      ),
    ).toBe(true);
    clickLabel("Practice: Core vocabulary");
    clickText("Start practice");
    expect(container.querySelector("article")).not.toBeNull();
  });
  it("does not expose the selected word in the typing-mode header", async () => {
    const stored: AppData = JSON.parse(localStorage.getItem("erudite:v2")!);
    stored.settings.studyMode = "TYPE_ONLY";
    localStorage.setItem("erudite:v2", JSON.stringify(stored));
    await renderApp();
    clickText("Vocabulary");
    clickLabel("Reset progress: Reset me");
    clickLabel("Practice: Reset me");
    clickText("Start practice");
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

    const select = container.querySelector<HTMLSelectElement>(
      '[aria-label="Practice selection"]',
    )!;
    act(() => {
      select.value = "category:core";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    clickText("Start practice");
    expect(container.querySelector("article")?.textContent).toContain(
      "die Zeit",
    );
  });
  it("starts practice of a just-saved word instead of older seed words without a daily allowance", async () => {
    await renderApp();
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
    clickText("Practice saved word");
    clickText("Start practice");
    expect(container.querySelector("article h2")?.textContent).toBe("Neu");
    const stored: AppData = JSON.parse(localStorage.getItem("erudite:v2")!);
    expect(
      stored.pairs["en-de"].words.find((w) => w.targetWord === "Neu")?.status,
    ).toBe("NEW");
  });
  it("makes reset words directly selectable, including from an excluded folder, without clearing unrelated progress", async () => {
    const stored: AppData = JSON.parse(localStorage.getItem("erudite:v2")!);
    stored.pairs["en-de"].categories[0].isActiveForStudy = false;
    localStorage.setItem("erudite:v2", JSON.stringify(stored));
    await renderApp();
    clickText("Vocabulary");
    clickLabel("Reset progress: Reset me");
    clickLabel("Practice: Reset me");
    clickText("Start practice");
    expect(container.querySelector("article h2")?.textContent).toBe("Reset me");
    const current: AppData = JSON.parse(localStorage.getItem("erudite:v2")!);
    expect(
      current.pairs["en-de"].words.find((w) => w.id === "reset"),
    ).toMatchObject({ status: "NEW", repCount: 0, lastReviewedOrder: 0 });
    expect(
      current.pairs["en-de"].words.find((w) => w.id === "spent")?.status,
    ).toBe("REVIEW");
    expect(current.pairs["en-de"].categories[0].isActiveForStudy).toBe(false);
  });
});
