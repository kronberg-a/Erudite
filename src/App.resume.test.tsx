// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { seedPair } from "./i18n/seedData";
import { defaultSettings } from "./services/storage";
import type { AppData } from "./types";

vi.mock("./core/speech", () => ({ speak: vi.fn(() => true) }));
vi.mock("./services/translator", () => ({ translate: vi.fn(async () => ({ primary: "hello", alternatives: [] })) }));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  vi.resetModules(); localStorage.clear(); sessionStorage.clear();
  HTMLDialogElement.prototype.close = vi.fn(); HTMLDialogElement.prototype.showModal = vi.fn();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ configured: false }) }));
  const pair = seedPair("en", "de");
  pair.words = pair.words.slice(0, 2).map((word, index) => ({ ...word, id: `word-${index}`, targetWord: index ? "Welt" : "Hallo", categoryIds: ["core"] }));
  localStorage.setItem("erudite:v3", JSON.stringify({ version: 3, reviewOrder: 0, settings: defaultSettings, pairs: { "en-de": pair } }));
  container = document.createElement("div"); document.body.append(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
const stored = (): AppData => JSON.parse(localStorage.getItem("erudite:v3")!);
async function render() { const { default: App } = await import("./App"); await act(async () => root.render(<App />)); }
async function refresh() { act(() => root.unmount()); root = createRoot(container); vi.resetModules(); await render(); }
function click(text: string) {
  const button = Array.from(container.querySelectorAll("button")).find((element) => element.textContent?.trim() === text || element.getAttribute("aria-label") === text);
  if (!button) throw new Error(`Missing button ${text}`);
  act(() => button.click());
}
function fill(selector: string, value: string) {
  const input = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!;
  act(() => {
    const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, "value")!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
it("restores the current page and scroll position after refresh", async () => {
  await render(); click("Settings");
  act(() => { container.querySelector("main")!.scrollTop = 420; container.querySelector("main")!.dispatchEvent(new Event("scroll")); });
  await refresh();
  expect(container.querySelector('.nav-item[aria-current="page"]')!.textContent).toBe("Settings");
  expect(container.querySelector("main")!.scrollTop).toBe(420);
  expect(container.querySelector("#gemini-api-key")).not.toBeNull();
});
it("restores vocabulary search and folder filters", async () => {
  await render(); click("Vocabulary"); fill('.search-field input', "Hallo");
  const select = container.querySelector<HTMLSelectElement>('.library-toolbar select')!;
  act(() => { select.value = "core"; select.dispatchEvent(new Event("change", { bubbles: true })); });
  await refresh();
  expect(container.querySelector<HTMLInputElement>('.search-field input')!.value).toBe("Hallo");
  expect(container.querySelector<HTMLSelectElement>('.library-toolbar select')!.value).toBe("core");
  expect(container.querySelectorAll('.vocabulary-table .word-row')).toHaveLength(1);
});
it("keeps restored filters separate for each language pair", async () => {
  await render(); click("Vocabulary"); fill('.search-field input', "Hallo");
  const target = () => container.querySelector<HTMLSelectElement>('header select')!;
  act(() => { target().value = "fr"; target().dispatchEvent(new Event("change", { bubbles: true })); });
  expect(container.querySelector<HTMLInputElement>('.search-field input')!.value).toBe("");
  await refresh();
  expect(target().value).toBe("fr");
  act(() => { target().value = "de"; target().dispatchEvent(new Event("change", { bubbles: true })); });
  expect(container.querySelector<HTMLInputElement>('.search-field input')!.value).toBe("Hallo");
});
it("restores an unsaved article, collected words and the paste draft", async () => {
  await render(); click("Articles");
  fill('details input', "Draft article"); fill('textarea', "Hallo Welt.");
  act(() => container.querySelector('details form')!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  await act(async () => click("Hallo")); click("Add to list");
  await refresh();
  expect(container.querySelector('.reader-body h2')!.textContent).toBe("Draft article");
  expect(container.querySelector('.reader-entry')!.textContent).toContain("Hallo");
  expect(container.querySelector<HTMLTextAreaElement>('textarea')!.value).toBe("Hallo Welt.");
  expect(stored().pairs["en-de"].savedArticles).toEqual([]);
});
it("restores the active card, queue and undo without committing another recall", async () => {
  await render(); click("Start practice");
  const first = container.querySelector('article h2')!.textContent;
  act(() => container.querySelector<HTMLButtonElement>('.action-know')!.click());
  const next = container.querySelector('article h2')!.textContent;
  const before = stored();
  expect(next).not.toBe(first);
  await refresh();
  expect(container.querySelector('article h2')!.textContent).toBe(next);
  expect(stored()).toEqual(before);
  click("Undo");
  expect(container.querySelector('article h2')!.textContent).toBe(first);
  expect(stored().reviewOrder).toBe(0);
});
it("preserves typed answers and failed attempts, and never commits an evaluated answer on refresh", async () => {
  const data = stored(); data.settings.studyMode = "TYPE_ONLY";
  data.pairs["en-de"].words = [{ ...data.pairs["en-de"].words[0], status: "LEARNING", step: 1, repCount: 1 }];
  localStorage.setItem("erudite:v3", JSON.stringify(data));
  await render(); click("Start practice");
  click("Keyboard");
  fill('input[aria-label="Your answer"]', "wrong");
  act(() => container.querySelector('.typing-controls .primary-button')!.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  expect(container.querySelector('.typing-attempts')!.getAttribute("aria-valuenow")).toBe("2");
  expect(container.querySelectorAll(".typing-attempts .used")).toHaveLength(1);
  await refresh();
  expect(container.querySelector<HTMLInputElement>('input[aria-label="Your answer"]')!.value).toBe("wrong");
  expect(container.querySelector('.typing-attempts')!.getAttribute("aria-valuenow")).toBe("2");
  expect(container.querySelectorAll(".typing-attempts .used")).toHaveLength(1);
  fill('input[aria-label="Your answer"]', "Hallo");
  act(() => container.querySelector<HTMLButtonElement>('.typing-controls .primary-button')!.click());
  const before = stored();
  await refresh();
  expect(container.querySelector('.action-bar .preselected')).not.toBeNull();
  expect(stored()).toEqual(before);
  act(() => container.querySelector<HTMLButtonElement>('.action-bar .preselected')!.click());
  expect(stored().pairs["en-de"].words[0].repCount).toBe(2);
});
it("ignores invalid remembered pages and stale study queues", async () => {
  sessionStorage.setItem("erudite:ui:v1:page", JSON.stringify("missing"));
  sessionStorage.setItem("erudite:ui:v1:pair:en-de:study:SWIPE_ONLY:null", JSON.stringify({ started: true, queue: ["deleted"] }));
  await render();
  expect(container.querySelector('.nav-item[aria-current="page"]')!.textContent).toBe("Learn");
  expect(container.querySelector('article')).toBeNull();
  click("Start practice"); expect(container.querySelector('article')).not.toBeNull();
});
it("discards a recovered session if vocabulary progress changed outside that session", async () => {
  await render(); click("Start practice");
  const data = stored(); data.pairs["en-de"].words[0].repCount++;
  localStorage.setItem("erudite:v3", JSON.stringify(data));
  await refresh();
  expect(container.querySelector('article')).toBeNull();
  expect(container.querySelector('.session-settings')).not.toBeNull();
});
