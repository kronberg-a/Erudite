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
afterEach(() => { act(() => root.unmount()); container.remove(); vi.unstubAllGlobals(); });
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
  click("Save collected words");
  const saved: PairData = update.mock.calls[0][0];
  expect(saved.words[0]).toMatchObject({ targetWord: "Hallo", translations: ["hello"], examples: [{ targetSentence: "Hallo Welt.", translatedSentence: "" }] });
  click("Practice folder");
  expect(practice).toHaveBeenCalledWith({ kind: "category", id: saved.categories[0].id });
  click("Start another batch");
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
});
it("keeps manual edits when an aborted translation resolves late", async () => {
  let resolve!: (value: { primary: string; alternatives: string[] }) => void;
  vi.mocked(translate).mockReturnValue(new Promise((r) => { resolve = r; }));
  paste(); click("Hallo");
  const signal = vi.mocked(translate).mock.calls[0][3]!;
  fill(".reader-entry input", "manual correction");
  expect(signal.aborted).toBe(true);
  await act(async () => resolve({ primary: "stale", alternatives: [] }));
  expect((container.querySelector(".reader-entry input") as HTMLInputElement).value).toBe("manual correction");
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
  expect(container.querySelector(".reader-entry strong")!.textContent).toBe("neue Sprache");
  expect(container.querySelector(".reader-entry p")!.textContent).toBe("Eine neue Sprache.");
});
it("limits concurrent translations, cancels replaced articles, and allows manual recovery after failure", async () => {
  vi.mocked(translate).mockReturnValue(new Promise(() => {}));
  paste(); click("Hallo"); click("Welt"); click("Eine");
  expect(translate).toHaveBeenCalledTimes(2);
  const signals = vi.mocked(translate).mock.calls.map((call) => call[3]!);
  paste("Anderer Artikel.");
  expect(signals.every((signal) => signal.aborted)).toBe(true);
  expect(container.querySelectorAll(".reader-entry")).toHaveLength(0);
  vi.mocked(translate).mockRejectedValue(new Error("Rate limited"));
  await act(async () => click("Anderer"));
  expect(container.querySelector(".reader-entry [role=status]")).not.toBeNull();
  fill(".reader-entry input", "other");
  expect((Array.from(container.querySelectorAll("button")).find((button) => button.textContent?.includes("Save collected words")))!.disabled).toBe(false);
});
it("offers the paste fallback when URL import fails", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
  fill('input[type="url"]', "https://example.com/blocked");
  await act(async () => container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  expect(container.querySelector('[role="alert"]')!.textContent).toContain("paste box");
  expect(container.querySelector("details")!.open).toBe(true);
});
