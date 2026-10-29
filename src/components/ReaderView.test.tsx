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
import { configureGemini } from "../services/gemini";
vi.mock("../services/translator", () => ({ translate: vi.fn() }));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
let pair: PairData;
const update = vi.fn();
const practice = vi.fn();
beforeEach(() => {
  configureGemini("reset-reader-test-state");
  configureGemini();
  vi.resetAllMocks();
  pair = { words: [], categories: [] };
  container = document.createElement("div"); document.body.append(container);
  root = createRoot(container);
  window.getSelection()?.removeAllRanges();
  act(() => root.render(<ReaderView pair={pair} settings={defaultSettings} update={update} onPractice={practice} t={translator("en")} />));
});
afterEach(() => { act(() => root.unmount()); container.remove(); configureGemini(); vi.unstubAllGlobals(); vi.useRealTimers(); });
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
function renderLibrary(key?: string) {
  act(() => root.render(<ReaderView pair={pair} settings={{ ...defaultSettings, geminiApiKey: key }} update={update} onPractice={practice} t={translator("en")} />));
}
it("saves, reopens through the full reader pipeline, collects vocabulary and deletes", async () => {
  renderLibrary("library-key");
  paste("Hallo Welt."); click("Save article");
  pair = update.mock.calls[0][0]; renderLibrary("library-key");
  expect(container.querySelector(".reader-library")!.textContent).toContain("News");
  expect(container.querySelector<HTMLButtonElement>(".reader-article-heading button")!.disabled).toBe(true);
  paste("Other text.");
  act(() => container.querySelector<HTMLButtonElement>('[aria-label="Read: News"]')!.click());
  expect(container.querySelector(".reader-body")!.textContent).toContain("Hallo Welt.");
  const fetchMock = vi.fn().mockImplementation(async (_url, init) => {
    const request = JSON.parse(init.body);
    return { ok: true, json: async () => request.operation === "cefr" ? { tokens: [{ offset: 0, word: "Hallo", level: "A2" }] } : {
      partOfSpeech: "OTHER", canonicalWord: "Hallo", translation: "hello", alternatives: [], translatedSentence: "Hello world.",
    } };
  });
  vi.stubGlobal("fetch", fetchMock);
  await act(async () => click("A2"));
  expect(container.querySelector('.reader-word[data-cefr="A2"]')!.textContent).toBe("Hallo");
  await act(async () => click("Hallo"));
  expect(container.querySelector(".reader-translation-popup")!.textContent).toContain("Hello world.");
  click("Add to list"); click("Save collected words");
  pair = update.mock.lastCall![0]; renderLibrary("library-key");
  expect(pair.savedArticles).toHaveLength(1);
  expect(pair.words[0].examples[0].translatedSentence).toBe("Hello world.");
  click("Practice folder"); expect(practice).toHaveBeenCalled();
  act(() => container.querySelector<HTMLButtonElement>('[aria-label="Delete article: News"]')!.click());
  pair = update.mock.lastCall![0]; renderLibrary("library-key");
  expect(container.querySelector(".reader-library")!.textContent).not.toContain("News");
  expect(container.querySelector(".reader-body")!.textContent).toContain("Hallo Welt.");
  expect(container.querySelector(".reader-article-heading")!.textContent).toContain("Save article");
});
it("filters the saved library by title, source and content, and opens a matching article", () => {
  pair = { ...pair, savedArticles: [
    { id: "one", title: "Travel", text: "Hallo Welt.", url: "https://example.com/travel", createdAt: 1 },
    { id: "two", title: "Science", text: "Forschung heute.", url: "https://journal.example/science", createdAt: 2 },
  ] };
  renderLibrary();
  fill('.search-field input', "SCIENCE");
  expect(container.querySelectorAll('.reader-library .word-row')).toHaveLength(1);
  expect(container.querySelector('.reader-library .word-row')!.textContent).toContain("Science");
  fill('.search-field input', "journal.example");
  expect(container.querySelectorAll('.reader-library .word-row')).toHaveLength(1);
  fill('.search-field input', "Forschung");
  act(() => container.querySelector<HTMLButtonElement>('.reader-library .word-detail')!.click());
  expect(container.querySelector('.reader-body h2')!.textContent).toBe("Science");
  fill('.search-field input', "no matching article");
  expect(container.querySelector('.reader-library .no-results')!.textContent).toBe(translator("en")("noResults"));
  fill('.search-field input', "");
  expect(container.querySelectorAll('.reader-library .word-row')).toHaveLength(2);
});
it("shows article counters in the library and reader and updates learned totals after progress changes", () => {
  const text = "Hallo Welt. Hallo.";
  pair = { ...pair, savedArticles: [{ id: "counted", title: "News", text, url: "", createdAt: 1 }], words: [{
    id: "hello", targetWord: "Hallo", translations: ["hello"], examples: [], categoryIds: [],
    status: "REVIEW", step: 3, repCount: 3, lastReviewedOrder: 3, createdAt: 1,
  }] };
  renderLibrary(); paste(text);
  const counts = () => Array.from(container.querySelectorAll('.article-word-counts')).map((element) =>
    Array.from(element.querySelectorAll('strong')).map((count) => count.textContent));
  expect(counts()).toEqual([["3", "0"], ["3", "0"]]);
  pair = { ...pair, words: pair.words.map((word) => ({ ...word, status: "MASTERED", step: 5 })) };
  renderLibrary();
  expect(counts()).toEqual([["3", "1"], ["3", "1"]]);
  pair = { ...pair, words: pair.words.map((word) => ({ ...word, status: "NEW", step: 0 })) };
  renderLibrary();
  expect(counts()).toEqual([["3", "0"], ["3", "0"]]);
});
it("discards extraction responses after a saved article replaces the pending import", async () => {
  pair = { ...pair, savedArticles: [{ id: "saved", title: "Saved title", text: "Hallo Welt.", url: "", createdAt: 1 }] };
  renderLibrary("pending-key");
  let finish!: (response: unknown) => void;
  const fetchMock = vi.fn().mockReturnValue(new Promise((resolve) => { finish = resolve; })); vi.stubGlobal("fetch", fetchMock);
  fill('input[type="url"]', "https://example.com/late"); click("Import article");
  act(() => container.querySelector<HTMLButtonElement>('[aria-label="Read: Saved title"]')!.click());
  expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  await act(async () => finish({ ok: true, json: async () => ({ title: "Late", text: "Late text.", url: "https://example.com/late" }) }));
  expect(container.querySelector(".reader-body h2")!.textContent).toBe("Saved title");
});
it("uses one contextual Gemini request for a normalized popup and its saved sentence", async () => {
  act(() => root.render(<ReaderView pair={pair} settings={{ ...defaultSettings, geminiApiKey: "reader-test-key" }} update={update} onPractice={practice} t={translator("en")} />));
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({
    partOfSpeech: "NOUN", canonicalWord: "die Tür", translation: "door", alternatives: [],
    translatedSentence: "She opens the door.", cefrLevel: "A1",
  }) });
  vi.stubGlobal("fetch", fetchMock);
  paste("Sie öffnet die Tür.");
  await act(async () => click("Tür"));
  expect(container.querySelector(".reader-translation-popup strong")!.textContent).toBe("die Tür");
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(translate).not.toHaveBeenCalled();
  const body = JSON.parse(fetchMock.mock.calls[0][1].body);
  expect(body).toMatchObject({ operation: "selection", input: { word: "Tür", sentence: "Sie öffnet die Tür.", wordOffset: 15, from: "de", to: "en" } });
  click("Add to list"); click("Save collected words");
  expect(update.mock.calls[0][0].words[0]).toMatchObject({ targetWord: "die Tür", translations: ["door"], examples: [{ targetSentence: "Sie öffnet die Tür.", translatedSentence: "She opens the door." }] });
});
it("ignores an aborted Gemini response when the selection changes", async () => {
  act(() => root.render(<ReaderView pair={pair} settings={{ ...defaultSettings, geminiApiKey: "reader-test-key" }} update={update} onPractice={practice} t={translator("en")} />));
  let finish!: (value: unknown) => void;
  const response = (word: string) => ({ ok: true, json: async () => ({ partOfSpeech: "OTHER", canonicalWord: word, translation: word === "Welt" ? "world" : "hello", alternatives: [], translatedSentence: "Hello world." }) });
  const fetchMock = vi.fn().mockReturnValueOnce(new Promise((resolve) => { finish = resolve; })).mockResolvedValue(response("Welt")); vi.stubGlobal("fetch", fetchMock);
  paste("Hallo Welt."); click("Hallo");
  await act(async () => click("Welt"));
  await act(async () => finish(response("Hallo")));
  expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  expect(container.querySelector(".reader-translation-popup strong")!.textContent).toBe("Welt");
  expect(container.querySelector<HTMLInputElement>(".reader-translation-popup input")!.value).toBe("world");
  expect(translate).not.toHaveBeenCalled();
});
it("leaves words unmarked until Gemini provides CEFR levels", async () => {
  act(() => root.render(<ReaderView pair={pair} settings={{ ...defaultSettings, targetLanguage: "en", sourceLanguage: "de", geminiApiKey: "reader-test-key" }} update={update} onPractice={practice} t={translator("en")} />));
  let finish!: (value: unknown) => void;
  vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise((resolve) => { finish = resolve; })));
  paste("hubris airport"); click("C2");
  const token = Array.from(container.querySelectorAll(".reader-word")).find((node) => node.textContent === "hubris")!;
  expect(token.hasAttribute("data-cefr")).toBe(false);
  expect(container.querySelector(".reader-cefr-status")!.textContent).toContain("Gemini is analyzing");
  await act(async () => finish({ ok: true, json: async () => ({ tokens: [{ offset: 0, word: "hubris", level: "C2" }] }) }));
  expect(token.getAttribute("data-cefr")).toBe("C2");
  expect(container.querySelector(".reader-cefr-status")!.textContent).toContain("provided by Gemini");
});
it("does not guess CEFR levels or call UDPipe without a Gemini connection", async () => {
  const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
  paste("Diskrepanz Unverhältnismäßigkeit");
  await act(async () => click("All levels"));
  expect(container.querySelectorAll(".reader-word[data-cefr]")).toHaveLength(0);
  expect(container.querySelector(".reader-cefr-status")!.textContent).toContain("CEFR requires a working Gemini connection");
  expect(fetchMock).not.toHaveBeenCalled();
});
it("retries a failed Gemini CEFR analysis without using heuristic grades", async () => {
  act(() => root.render(<ReaderView pair={pair} settings={{ ...defaultSettings, geminiApiKey: "reader-test-key" }} update={update} onPractice={practice} t={translator("en")} />));
  const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false, status: 503 })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ tokens: [{ offset: 0, word: "Haus", level: "C2" }] }) });
  vi.stubGlobal("fetch", fetchMock);
  paste("Haus");
  await act(async () => click("C2"));
  expect(container.querySelectorAll(".reader-word[data-cefr]")).toHaveLength(0);
  await act(async () => click("Retry analysis"));
  expect(container.querySelector(".reader-word")!.getAttribute("data-cefr")).toBe("C2");
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock.mock.calls.every((call) => call[0] === "/api/gemini")).toBe(true);
});
it("discards CEFR results from a replaced article", async () => {
  act(() => root.render(<ReaderView pair={pair} settings={{ ...defaultSettings, targetLanguage: "en", sourceLanguage: "de", geminiApiKey: "reader-test-key" }} update={update} onPractice={practice} t={translator("en")} />));
  let finish!: (value: unknown) => void;
  const fetchMock = vi.fn().mockReturnValueOnce(new Promise((resolve) => { finish = resolve; }))
    .mockResolvedValueOnce({ ok: true, json: async () => ({ tokens: [{ offset: 0, word: "airport", level: "A2" }] }) });
  vi.stubGlobal("fetch", fetchMock);
  paste("hubris"); click("All levels");
  await act(async () => paste("airport"));
  expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  await act(async () => finish({ ok: true, json: async () => ({ tokens: [{ offset: 0, word: "hubris", level: "C2" }] }) }));
  expect(Array.from(container.querySelectorAll(".reader-word[data-cefr]")).map((token) => [token.textContent, token.getAttribute("data-cefr")]))
    .toEqual([["airport", "A2"]]);
});
it("shows a CEFR response error after successful HTTP responses and can retry", async () => {
  act(() => root.render(<ReaderView pair={pair} settings={{ ...defaultSettings, geminiApiKey: "reader-test-key" }} update={update} onPractice={practice} t={translator("en")} />));
  const invalid = { ok: true, json: async () => ({ tokens: [{ id: 99, level: "C2" }] }) };
  const fetchMock = vi.fn().mockResolvedValueOnce(invalid).mockResolvedValueOnce(invalid)
    .mockResolvedValueOnce({ ok: true, json: async () => ({ tokens: [{ id: 0, level: "C2" }] }) });
  vi.stubGlobal("fetch", fetchMock);
  paste("Haus");
  await act(async () => click("C2"));
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(container.querySelector(".reader-cefr-status")!.textContent).toContain("CEFR data could not be processed");
  expect(container.querySelectorAll(".reader-word[data-cefr]")).toHaveLength(0);
  await act(async () => click("Retry analysis"));
  expect(container.querySelector(".reader-word")!.getAttribute("data-cefr")).toBe("C2");
});
it("keeps the translation popup usable when configured Gemini fails", async () => {
  act(() => root.render(<ReaderView pair={pair} settings={{ ...defaultSettings, geminiApiKey: "reader-test-key" }} update={update} onPractice={practice} t={translator("en")} />));
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));
  vi.mocked(translate).mockResolvedValue({ primary: "hello", alternatives: [] });
  paste("Hallo Welt.");
  await act(async () => click("Hallo"));
  expect(container.querySelector<HTMLInputElement>(".reader-translation-popup input")!.value).toBe("hello");
  expect(translate).toHaveBeenCalledTimes(1);
});
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
  await act(async () => container.querySelector(".reader-import form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
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
it("converts selected verbs to infinitives, plural nouns to singular with articles, and adjectives to base forms via LINDAT UDPipe", async () => {
  const conllu = [
    "1\tDie\tder\tDET\tART\tCase=Nom|Definite=Def|Number=Plur\t3\tdet\t_\tTokenRange=0:3",
    "2\talten\talt\tADJ\tADJA\tCase=Nom|Degree=Pos|Number=Plur\t3\tamod\t_\tTokenRange=4:9",
    "3\tBücher\tBuch\tNOUN\tNN\tGender=Neut|Number=Plur\t4\tnsubj\t_\tTokenRange=10:16",
    "4\tlagen\tliegen\tVERB\tVVFIN\tMood=Ind|Number=Plur|Tense=Past\t0\troot\t_\tTokenRange=17:22",
  ].join("\n");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ result: conllu }) }));
  vi.mocked(translate).mockImplementation(async (word) => ({
    primary: word === "das Buch" ? "the book" : word === "liegen" ? "to lie" : word === "alt" ? "old" : "raw",
    alternatives: [],
  }));
  paste("Die alten Bücher lagen.");
  await act(async () => click("alten"));
  expect(container.querySelector(".reader-translation-popup strong")!.textContent).toBe("alt");
  expect(container.querySelector<HTMLInputElement>(".reader-translation-popup input")!.value).toBe("old");
  click("Add to list");
  await act(async () => click("Bücher"));
  expect(container.querySelector(".reader-translation-popup strong")!.textContent).toBe("das Buch");
  expect(container.querySelector<HTMLInputElement>(".reader-translation-popup input")!.value).toBe("the book");
  click("Add to list");
  await act(async () => click("lagen"));
  expect(container.querySelector(".reader-translation-popup strong")!.textContent).toBe("liegen");
  expect(container.querySelector<HTMLInputElement>(".reader-translation-popup input")!.value).toBe("to lie");
  click("Add to list");
  click("Save collected words");
  const saved: PairData = update.mock.calls[0][0];
  expect(saved.words.map((w) => ({ targetWord: w.targetWord, translations: w.translations }))).toEqual([
    { targetWord: "alt", translations: ["old"] },
    { targetWord: "das Buch", translations: ["the book"] },
    { targetWord: "liegen", translations: ["to lie"] },
  ]);
});
it("automatically scans the surrounding sentence to disambiguate word and word-group translations", async () => {
  vi.mocked(translate).mockImplementation(async (text) => {
    if (text === "Bank") return { primary: "bank", alternatives: ["bench", "seat"] };
    if (text === "Er saß auf der Bank im Park.") return { primary: "He sat on the bench in the park.", alternatives: [] };
    if (text === "nahm an") return { primary: "assumed", alternatives: ["accepted", "adopted"] };
    if (text === "Sie nahm das Geschenk dankend an.") return { primary: "She gratefully accepted the gift.", alternatives: [] };
    return { primary: text, alternatives: [] };
  });
  paste("Er saß auf der Bank im Park. Sie nahm das Geschenk dankend an.");
  await act(async () => click("Bank"));
  expect(container.querySelector(".reader-translation-popup strong")!.textContent).toBe("Bank");
  expect(container.querySelector<HTMLInputElement>(".reader-translation-popup input")!.value).toBe("bench");
  click("Add to list");
  click("Select words"); click("nahm"); click("an");
  await act(async () => action("Translate selection"));
  expect(container.querySelector(".reader-translation-popup strong")!.textContent).toBe("nahm an");
  expect(container.querySelector<HTMLInputElement>(".reader-translation-popup input")!.value).toBe("accepted");
  click("Add to list");
  click("Save collected words");
  const saved: PairData = update.mock.calls[0][0];
  expect(saved.words.map((w) => ({ targetWord: w.targetWord, translations: w.translations }))).toEqual([
    { targetWord: "Bank", translations: ["bench"] },
    { targetWord: "nahm an", translations: ["accepted"] },
  ]);
});
it("filters Gemini-provided CEFR levels without additional analysis requests", async () => {
  act(() => root.render(<ReaderView pair={pair} settings={{ ...defaultSettings, geminiApiKey: "reader-test-key" }} update={update} onPractice={practice} t={translator("en")} />));
  const text = "Haus Bahnhof Gesellschaft Perspektive Diskrepanz Unverhältnismäßigkeit.";
  const tokens = [
    ["Haus", "A1"], ["Bahnhof", "A2"], ["Gesellschaft", "B1"], ["Perspektive", "B2"],
    ["Diskrepanz", "C1"], ["Unverhältnismäßigkeit", "C2"],
  ].map(([word, level]) => ({ word, level, offset: text.indexOf(word) }));
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ tokens }) });
  vi.stubGlobal("fetch", fetchMock);
  paste(text);
  const panel = container.querySelector(".reader-level-panel");
  expect(panel).not.toBeNull();
  expect(container.querySelectorAll(".reader-word[data-cefr]")).toHaveLength(0);
  await act(async () => click("A2"));
  expect(Array.from(container.querySelectorAll(".reader-word[data-cefr]")).map((n) => `${n.textContent}:${n.getAttribute("data-cefr")}`)).toEqual([
    "Bahnhof:A2",
  ]);
  click("C1");
  expect(Array.from(container.querySelectorAll(".reader-word[data-cefr]")).map((n) => `${n.textContent}:${n.getAttribute("data-cefr")}`)).toEqual([
    "Bahnhof:A2",
    "Diskrepanz:C1",
  ]);
  click("All levels");
  expect(Array.from(container.querySelectorAll(".reader-word[data-cefr]")).map((n) => `${n.textContent}:${n.getAttribute("data-cefr")}`)).toEqual([
    "Bahnhof:A2",
    "Gesellschaft:B1",
    "Perspektive:B2",
    "Diskrepanz:C1",
    "Unverhältnismäßigkeit:C2",
  ]);
  click("All levels");
  expect(container.querySelectorAll(".reader-word[data-cefr]")).toHaveLength(0);
  await act(async () => click("All levels"));
  expect(container.querySelectorAll(".reader-word[data-cefr]")).toHaveLength(5);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  await act(async () => paste(text));
  expect(container.querySelectorAll(".reader-word[data-cefr]")).toHaveLength(5);
  expect(container.querySelector(".reader-cefr-status")!.textContent).toContain("provided by Gemini");
  expect(fetchMock).toHaveBeenCalledTimes(1);
});
