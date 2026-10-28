// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ReaderView } from "./ReaderView";
import { translate } from "../services/translator";
import { defaultSettings } from "../services/storage";
import { translator } from "../i18n/translations";
import type { PairData } from "../types";
vi.mock("../services/translator", () => ({ translate: vi.fn() }));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
let pair: PairData;
const update = vi.fn();
const practice = vi.fn();
beforeEach(() => {
  vi.resetAllMocks();
  pair = { words: [], categories: [] };
  container = document.createElement("div"); document.body.append(container);
  root = createRoot(container);
  window.getSelection()?.removeAllRanges();
  act(() => root.render(<ReaderView pair={pair} settings={defaultSettings} update={update} onPractice={practice} t={translator("en")} />));
});
afterEach(() => { act(() => root.unmount()); container.remove(); vi.unstubAllGlobals(); vi.useRealTimers(); });
function click(text: string) {
  const button = Array.from(container.querySelectorAll("button")).find((node) => node.textContent?.trim() === text);
  if (!button) throw new Error(`Missing button ${text}`);
  act(() => button.click());
}
function fill(selector: string, text: string) {
  const element = container.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
  act(() => {
    const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, "value")!.set!.call(element, text);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
function paste(text = "Hallo Welt. Eine neue Sprache.") {
  fill("details input", "News"); fill("textarea", text);
  const form = container.querySelector("details form")!;
  act(() => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
}
it("collects, translates, persists context in a folder, and requests folder practice", async () => {
  vi.mocked(translate).mockResolvedValue({ primary: "hello", alternatives: [] });
  paste();
  await act(async () => click("Hallo"));
  expect(translate).toHaveBeenCalledWith("Hallo", defaultSettings.targetLanguage, defaultSettings.sourceLanguage, expect.any(AbortSignal));
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
  expect(container.querySelector("[role=dialog]")!.textContent).toContain("Hallo");
  expect(update).not.toHaveBeenCalled();
  click("Add to list");
  click("Save collected words");
  const saved: PairData = update.mock.calls[0][0];
  expect(saved.words[0]).toMatchObject({ targetWord: "Hallo", translations: ["hello"], examples: [{ targetSentence: "Hallo Welt.", translatedSentence: "" }] });
  click("Practice folder");
  expect(practice).toHaveBeenCalledWith({ kind: "category", id: saved.categories[0].id });
  click("Start another batch");
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
});
it("ignores a translation that resolves after its preview is dismissed", async () => {
  let resolve!: (value: { primary: string; alternatives: string[] }) => void;
  vi.mocked(translate).mockReturnValue(new Promise((r) => { resolve = r; }));
  paste(); click("Hallo");
  const signal = vi.mocked(translate).mock.calls[0][3]!;
  action("Cancel");
  expect(signal.aborted).toBe(true);
  await act(async () => resolve({ primary: "stale", alternatives: [] }));
  expect(container.querySelector("[role=dialog]")).toBeNull();
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
  expect(update).not.toHaveBeenCalled();
});
it("captures multi-word selections with the sentence at the selected occurrence", async () => {
  vi.mocked(translate).mockResolvedValue({ primary: "new language", alternatives: [] });
  paste();
  const tokens = container.querySelectorAll(".reader-word");
  const start = Array.from(tokens).find((node) => node.textContent === "neue")!;
  const end = Array.from(tokens).find((node) => node.textContent === "Sprache")!;
  const range = document.createRange(); range.setStart(start.firstChild!, 0); range.setEnd(end.firstChild!, 7);
  window.getSelection()!.addRange(range);
  await act(async () => container.querySelector("article")!.dispatchEvent(new Event("pointerup", { bubbles: true })));
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
  expect(container.querySelector(".reader-translation-popup strong")!.textContent).toBe("neue Sprache");
  click("Add to list");
  expect(container.querySelector(".reader-entry strong")!.textContent).toBe("neue Sprache");
  expect(container.querySelector(".reader-entry p")!.textContent).toBe("Eine neue Sprache.");
});
it("cancels superseded previews and replaced articles and allows manual recovery after failure", async () => {
  vi.mocked(translate).mockReturnValue(new Promise(() => {}));
  paste(); click("Hallo"); click("Welt"); click("Eine");
  expect(translate).toHaveBeenCalledTimes(3);
  const signals = vi.mocked(translate).mock.calls.map((call) => call[3]!);
  paste("Anderer Artikel.");
  expect(signals.every((signal) => signal.aborted)).toBe(true);
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
  vi.mocked(translate).mockRejectedValue(new Error("Rate limited"));
  await act(async () => click("Anderer"));
  expect(container.querySelector(".reader-translation-popup [role=status]")).not.toBeNull();
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
  fill(".reader-translation-popup input", "other");
  click("Add to list");
  expect((Array.from(container.querySelectorAll("button")).find((button) => button.textContent?.includes("Save collected words")))!.disabled).toBe(false);
});
it("offers the paste fallback when URL import fails", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
  fill('input[type="url"]', "https://example.com/blocked");
  await act(async () => container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  expect(container.querySelector('[role="alert"]')!.textContent).toContain("paste box");
  expect(container.querySelector("details")!.open).toBe(true);
});

function action(label: string) {
  const button = container.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
  if (!button) throw new Error(`Missing action ${label}`);
  act(() => button.click());
}
function pointerClick(word: string, detail = 1) {
  const button = Array.from(container.querySelectorAll(".reader-word")).find((node) => node.textContent === word)!;
  act(() => button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail })));
}
it("selects separated verb parts in reading order and saves the translated sentence", async () => {
  vi.mocked(translate).mockImplementation(async (text) => ({ primary: text === "bewege hin" ? "move towards" : "I move towards the exit.", alternatives: [] }));
  paste("Ich bewege mich zum Ausgang hin.");
  click("Select words"); click("hin"); click("bewege");
  expect(translate).not.toHaveBeenCalled();
  expect(container.querySelectorAll('[data-picked="true"]')).toHaveLength(2);
  expect(container.querySelector(".reader-selection-preview span")!.textContent).toBe("bewege hin");
  await act(async () => action("Translate selection"));
  expect(vi.mocked(translate).mock.calls.map((call) => call[0])).toEqual(["bewege hin", "Ich bewege mich zum Ausgang hin."]);
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
  expect(container.querySelector(".reader-translation-popup strong")!.textContent).toBe("bewege hin");
  click("Add to list");
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(1);
  expect(container.querySelector(".reader-selection-bar")).toBeNull();
  click("Save collected words");
  expect(update.mock.calls[0][0].words[0]).toMatchObject({ targetWord: "bewege hin", translations: ["move towards"], examples: [{ targetSentence: "Ich bewege mich zum Ausgang hin.", translatedSentence: "I move towards the exit." }] });
  action("Select words: bewege hin");
  expect(Array.from(container.querySelectorAll('[data-picked="true"]')).map((node) => node.textContent)).toEqual(["bewege", "hin"]);
});
it.each(["desktop", "mobile"])("enters selection on a %s double click or tap without collecting a single word", async (device) => {
  vi.useFakeTimers();
  vi.mocked(translate).mockResolvedValue({ primary: "hello world", alternatives: [] });
  paste();
  pointerClick("Hallo");
  act(() => vi.advanceTimersByTime(100));
  pointerClick("Hallo", device === "desktop" ? 2 : 1);
  if (device === "desktop") {
    act(() => container.querySelector(".reader-word")!.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, detail: 2 })));
  }
  act(() => vi.advanceTimersByTime(500));
  expect(translate).not.toHaveBeenCalled();
  expect(container.querySelector('[data-picked="true"]')!.textContent).toBe("Hallo");
  click("Welt");
  await act(async () => action("Translate selection"));
  expect(vi.mocked(translate).mock.calls[0][0]).toBe("Hallo Welt");
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
  click("Add to list");
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(1);
});
it("keeps ordinary pointer translation and the Select words action on its result", async () => {
  vi.useFakeTimers();
  vi.mocked(translate).mockResolvedValue({ primary: "hello", alternatives: [] });
  paste(); pointerClick("Hallo");
  await act(async () => vi.advanceTimersByTime(400));
  expect(vi.mocked(translate).mock.calls[0][0]).toBe("Hallo");
  action("Select words");
  expect(container.querySelector('[data-picked="true"]')!.textContent).toBe("Hallo");
});
it("toggles occurrences independently and cancels with a button or Escape without translating", () => {
  paste("Hallo Welt. Hallo nochmals.");
  click("Select words");
  const occurrences = container.querySelectorAll<HTMLButtonElement>(".reader-word");
  act(() => occurrences[2].click());
  expect(occurrences[0].getAttribute("aria-pressed")).toBe("false");
  expect(occurrences[2].getAttribute("aria-pressed")).toBe("true");
  act(() => occurrences[2].click());
  expect(container.querySelector<HTMLButtonElement>('[aria-label="Translate selection"]')!.disabled).toBe(true);
  click("Welt"); action("Cancel");
  expect(container.querySelector(".reader-selection-bar")).toBeNull();
  click("Select words"); click("Welt");
  act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));
  expect(container.querySelector(".reader-selection-bar")).toBeNull();
  expect(translate).not.toHaveBeenCalled();
});
it("accepts sentences longer than the old 100-character word limit", async () => {
  vi.mocked(translate).mockResolvedValue({ primary: "a sentence", alternatives: [] });
  const text = "Diese lange deutsche Beispielsatzsammlung enthält ausreichend verschiedene Wörter für eine vollständige Übersetzung ohne die bisherige kurze Begrenzung.";
  paste(text); click("Select words");
  act(() => container.querySelectorAll<HTMLButtonElement>(".reader-word").forEach((word) => word.click()));
  await act(async () => action("Translate selection"));
  expect(container.querySelector(".reader-translation-popup strong")!.textContent!.length).toBeGreaterThan(100);
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
});
it("keeps the group translation usable when translating its context fails", async () => {
  vi.mocked(translate).mockResolvedValueOnce({ primary: "move towards", alternatives: [] }).mockRejectedValue(new Error("unavailable"));
  paste("Ich bewege mich hin."); click("Select words"); click("bewege"); click("hin");
  await act(async () => action("Translate selection"));
  expect(container.querySelector<HTMLInputElement>(".reader-translation-popup input")!.value).toBe("move towards");
  click("Add to list");
  click("Save collected words");
  expect(update).toHaveBeenCalledOnce();
});
it("clears selection and pending taps when replacing the article", () => {
  vi.useFakeTimers();
  paste(); pointerClick("Hallo"); paste("Anderer Artikel.");
  act(() => vi.advanceTimersByTime(500));
  expect(translate).not.toHaveBeenCalled();
  click("Select words"); click("Anderer"); paste("Noch ein Artikel.");
  expect(container.querySelector(".reader-selection-bar")).toBeNull();
  expect(container.querySelectorAll('[data-picked="true"]')).toHaveLength(0);
});
it("disables Add until translation succeeds and preserves an edited preview on explicit Add", async () => {
  let resolve!: (value: { primary: string; alternatives: string[] }) => void;
  vi.mocked(translate).mockReturnValue(new Promise((r) => { resolve = r; }));
  paste(); click("Hallo");
  const add = Array.from(container.querySelectorAll("button")).find((node) => node.textContent?.includes("Add to list"))!;
  expect(add.disabled).toBe(true);
  act(() => add.click());
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
  await act(async () => resolve({ primary: "hello", alternatives: [] }));
  fill(".reader-translation-popup input", "greeting");
  click("Add to list");
  expect(container.querySelector<HTMLInputElement>(".reader-entry input")!.value).toBe("greeting");
  expect(container.querySelector("[role=dialog]")).toBeNull();
});
it("keeps the newest preview when an older aborted request resolves late", async () => {
  let resolve!: (value: { primary: string; alternatives: string[] }) => void;
  vi.mocked(translate).mockReturnValueOnce(new Promise((r) => { resolve = r; })).mockResolvedValue({ primary: "world", alternatives: [] });
  paste(); click("Hallo");
  await act(async () => click("Welt"));
  await act(async () => resolve({ primary: "stale hello", alternatives: [] }));
  expect(container.querySelector(".reader-translation-popup strong")!.textContent).toBe("Welt");
  expect(container.querySelector<HTMLInputElement>(".reader-translation-popup input")!.value).toBe("world");
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
});
it("does not add a group when dismissed and does not duplicate already collected words", async () => {
  vi.mocked(translate).mockResolvedValue({ primary: "hello", alternatives: [] });
  paste(); click("Select words"); click("Hallo"); click("Welt");
  await act(async () => action("Translate selection"));
  act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));
  expect(container.querySelector("[role=dialog]")).toBeNull();
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
  await act(async () => click("Hallo")); click("Add to list");
  click("Hallo");
  const alreadyAdded = Array.from(container.querySelectorAll("button")).find((node) => node.textContent?.includes("Already in list"))!;
  expect(alreadyAdded.disabled).toBe(true);
  act(() => alreadyAdded.click());
  action("Cancel");
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(1);
  expect(update).not.toHaveBeenCalled();
});
it("cancels a queued word tap when closing an existing popup", async () => {
  vi.useFakeTimers();
  vi.mocked(translate).mockResolvedValue({ primary: "hello", alternatives: [] });
  paste(); await act(async () => click("Hallo"));
  pointerClick("Welt"); action("Cancel");
  await act(async () => vi.advanceTimersByTime(500));
  expect(container.querySelector("[role=dialog]")).toBeNull();
  expect(translate).toHaveBeenCalledTimes(1);
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
});
