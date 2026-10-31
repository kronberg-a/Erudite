// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { defaultSettings } from "./services/storage";
import { translator } from "./i18n/translations";
import { seedPair } from "./i18n/seedData";
vi.mock("./services/gemini", () => ({
  configureGemini: vi.fn(),
  initializeGemini: vi.fn(),
}));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("opens Statistics from both navigation surfaces and practices challenging words from Vocabulary", async () => {
  vi.resetModules();
  const closeDialog = vi.fn();
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value: closeDialog,
  });
  localStorage.clear();
  sessionStorage.clear();
  const pair = seedPair("en", "de");
  pair.words = pair.words
    .slice(0, 2)
    .map((w, i) => ({ ...w, repCount: i ? 0 : 5, categoryIds: [] }));
  const originalCategories = pair.categories.map((c) => ({
    ...c,
    isActiveForStudy: false,
  }));
  pair.categories = originalCategories;
  localStorage.setItem(
    "erudite:v3",
    JSON.stringify({
      version: 3,
      reviewOrder: 0,
      settings: defaultSettings,
      pairs: { "en-de": pair },
    }),
  );
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  try {
    const { default: App } = await import("./App");
    await act(async () => root.render(<App />));
    for (const selector of [".sidebar nav", ".bottom-nav"]) {
      const statsButton = Array.from(
        host.querySelectorAll<HTMLButtonElement>(`${selector} button`),
      ).find((b) => b.textContent === "Statistics");
      expect(statsButton).toBeTruthy();
      act(() => statsButton!.click());
      expect(host.querySelector(".stats-view h1")?.textContent).toBe(
        "Your learning, in perspective",
      );
    }
    expect(
      host.querySelector('[aria-labelledby="stats-challenging"]'),
    ).toBeNull();
    const vocabulary = Array.from(
      host.querySelectorAll<HTMLButtonElement>(".sidebar nav button"),
    ).find((button) => button.textContent === "Vocabulary");
    act(() => vocabulary!.click());
    act(() =>
      host
        .querySelector<HTMLInputElement>(".challenging-filter input")!
        .click(),
    );
    const practice = Array.from(
      host.querySelectorAll<HTMLButtonElement>("main button"),
    ).find((b) => b.textContent === "Practice challenging words");
    act(() => practice!.click());
    expect(host.querySelector(".study-view")).toBeTruthy();
    expect(host.querySelector(".practice-note")?.textContent).toBe(
      translator("en")("selectedPracticeHint"),
    );
    expect(
      JSON.parse(sessionStorage.getItem("erudite:ui:v1:practice")!).selection,
    ).toEqual({ kind: "words", ids: [pair.words[0].id] });
    expect(
      JSON.parse(localStorage.getItem("erudite:v3")!).pairs["en-de"].categories,
    ).toEqual(originalCategories);
    const start = Array.from(
      host.querySelectorAll<HTMLButtonElement>("main button"),
    ).find((b) => b.textContent?.trim() === "Start practice");
    expect(start?.disabled).toBe(false);
  } finally {
    act(() => root.unmount());
    host.remove();
    localStorage.clear();
    sessionStorage.clear();
  }
});
