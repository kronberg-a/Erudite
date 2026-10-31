// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WordForm } from "./WordForm";
import { seedPair } from "../i18n/seedData";
import { translator } from "../i18n/translations";
import { defaultSettings } from "../services/storage";
import { translate } from "../services/translator";
import { checkVocabularyWord, type WordCheckResult } from "../services/nounArticle";
import type { WordCard } from "../types";

vi.mock("../services/translator", () => ({ translate: vi.fn() }));
vi.mock("../services/nounArticle", () => ({ checkVocabularyWord: vi.fn() }));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
const update = vi.fn();
beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  sessionStorage.clear();
  vi.mocked(checkVocabularyWord).mockImplementation(async (word) => ({ spelling: "unknown", correctedWord: word, nounSuggestion: "" }));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});
function render(existing?: WordCard) {
  const pair = seedPair("en", "de");
  if (existing) pair.words = [existing];
  act(() => root.render(<WordForm pair={pair} settings={defaultSettings} update={update} t={translator("en")} existing={existing} />));
}
function click(label: string) {
  const button = Array.from(container.querySelectorAll("button")).find((button) => button.getAttribute("aria-label") === label || button.textContent?.trim() === label)!;
  act(() => button.click());
}
function fill(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  act(() => {
    const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, "value")!.set!.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
function fields(index: number) {
  return container.querySelectorAll("fieldset")[index].querySelectorAll("textarea");
}
function submit() {
  act(() => container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
}
function saved() {
  return update.mock.calls.at(-1)![0].words.at(-1) as WordCard;
}

describe("noun article suggestions", () => {
  it("suggests an article after typing and saves the accepted noun with a manual translation", async () => {
    vi.mocked(checkVocabularyWord).mockResolvedValue({ spelling: "correct", correctedWord: "Haus", nounSuggestion: "das Haus" });
    render();
    const input = container.querySelector<HTMLInputElement>('input[aria-label="Word in the learning language"]')!;
    fill(input, "Haus");
    const translation = Array.from(container.querySelectorAll('label')).find((label) => label.textContent?.trim() === 'Translation')!.querySelector('input')!;
    fill(translation, "house");
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    expect(input.value).toBe("Haus");
    expect(checkVocabularyWord).toHaveBeenCalledWith("Haus", "de", "", expect.any(AbortSignal), defaultSettings.geminiApiKey);
    click("Use das Haus");
    expect(input.value).toBe("das Haus");
    expect(translation.value).toBe("house");
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(checkVocabularyWord).toHaveBeenCalledTimes(1);
    submit();
    expect(saved().targetWord).toBe("das Haus");
  });

  it("keeps the accepted article when context changes and checks again after a manual word edit", async () => {
    vi.mocked(checkVocabularyWord).mockResolvedValue({ spelling: "correct", correctedWord: "Haus", nounSuggestion: "das Haus" });
    render();
    const input = container.querySelector<HTMLInputElement>('input[aria-label="Word in the learning language"]')!;
    fill(input, "Haus");
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    click("Use das Haus");
    fill(fields(0)[0], "Das Haus ist groß.");
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(checkVocabularyWord).toHaveBeenCalledTimes(1);
    expect(container.textContent).not.toContain("Checking noun article");
    fill(input, "Tür");
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    expect(checkVocabularyWord).toHaveBeenCalledTimes(2);
    expect(vi.mocked(checkVocabularyWord).mock.calls[1][0]).toBe("Tür");
  });

  it("ignores a late suggestion after the user changes the noun", async () => {
    let resolve!: (value: WordCheckResult) => void;
    vi.mocked(checkVocabularyWord).mockImplementation(() => new Promise((done) => { resolve = done; }));
    vi.mocked(translate).mockResolvedValue({ primary: "house", alternatives: [] });
    render();
    const input = container.querySelector<HTMLInputElement>('input[aria-label="Word in the learning language"]')!;
    fill(input, "Haus");
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    const signal = vi.mocked(checkVocabularyWord).mock.calls[0][3]!;
    fill(input, "Tür");
    expect(signal.aborted).toBe(true);
    await act(async () => resolve({ spelling: "correct", correctedWord: "Haus", nounSuggestion: "das Haus" }));
    expect(container.textContent).not.toContain("Use das Haus");
    expect(input.value).toBe("Tür");
  });
});
it("shows a quiet ring inside the word field and applies spelling corrections only when accepted", async () => {
  let resolve!: (value: WordCheckResult) => void;
  vi.mocked(checkVocabularyWord).mockImplementation(() => new Promise((done) => { resolve = done; }));
  render();
  const input = container.querySelector<HTMLInputElement>('input[aria-label="Word in the learning language"]')!;
  fill(input, "Huas");
  const translation = Array.from(container.querySelectorAll('label')).find((label) => label.textContent?.trim() === 'Translation')!.querySelector('input')!;
  fill(translation, "house");
  await act(async () => { await vi.advanceTimersByTimeAsync(500); });
  expect(input.parentElement!.querySelector('.word-field-spinner')).not.toBeNull();
  expect(input.getAttribute('aria-busy')).toBe('true');
  expect(container.textContent).not.toContain("Checking noun article");
  expect(container.textContent).not.toContain("Checking word");
  await act(async () => resolve({ spelling: "incorrect", correctedWord: "Haus", nounSuggestion: "das Haus" }));
  expect(input.value).toBe("Huas");
  expect(container.textContent).not.toContain("Suggested spelling");
  expect(container.querySelectorAll('.word-entry-field .translation-chips button')).toHaveLength(1);
  expect(container.querySelector('.word-check-feedback button')).toBeNull();
  expect(input.parentElement!.querySelector('.word-field-spinner')).toBeNull();
  click("Use das Haus");
  expect(input.value).toBe("das Haus");
  expect(translation.value).toBe("house");
  expect(container.textContent).toContain("Spelling looks correct");
  await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
  expect(checkVocabularyWord).toHaveBeenCalledTimes(1);
  submit();
  expect(saved().targetWord).toBe("das Haus");
});
it("keeps one left-hand spelling correction when there is no article suggestion", async () => {
  vi.mocked(checkVocabularyWord).mockResolvedValue({ spelling: "incorrect", correctedWord: "Hallo", nounSuggestion: "" });
  render();
  const input = container.querySelector<HTMLInputElement>('input[aria-label="Word in the learning language"]')!;
  fill(input, "Halo");
  await act(async () => { await vi.advanceTimersByTimeAsync(500); });
  expect(container.querySelectorAll('.word-entry-field .translation-chips button')).toHaveLength(1);
  expect(container.querySelector('.word-check-feedback')!.textContent).toBe("");
  click("Use Hallo");
  expect(input.value).toBe("Hallo");
});
it("disables scheduled checks while keeping manual translation available and remembers the toggle", async () => {
  vi.mocked(translate).mockResolvedValue({ primary: "house", alternatives: [] });
  render();
  const input = container.querySelector<HTMLInputElement>('input[aria-label="Word in the learning language"]')!;
  fill(input, "Haus");
  act(() => container.querySelector<HTMLButtonElement>('[role="switch"]')!.click());
  await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
  expect(checkVocabularyWord).not.toHaveBeenCalled();
  await act(async () => click("Translate"));
  expect(translate).toHaveBeenCalledTimes(1);
  act(() => root.unmount()); root = createRoot(container); render();
  expect(container.querySelector('[role="switch"]')!.getAttribute('aria-checked')).toBe('false');
  fill(container.querySelector('input[aria-label="Word in the learning language"]')!, "Tür");
  await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
  expect(checkVocabularyWord).not.toHaveBeenCalled();
});
it("cancels an active check when disabled and ignores its late correction", async () => {
  let resolve!: (value: WordCheckResult) => void;
  vi.mocked(checkVocabularyWord).mockImplementation(() => new Promise((done) => { resolve = done; }));
  render();
  const input = container.querySelector<HTMLInputElement>('input[aria-label="Word in the learning language"]')!;
  fill(input, "Huas");
  await act(async () => { await vi.advanceTimersByTimeAsync(500); });
  const signal = vi.mocked(checkVocabularyWord).mock.calls[0][3]!;
  act(() => container.querySelector<HTMLButtonElement>('[role="switch"]')!.click());
  expect(signal.aborted).toBe(true);
  await act(async () => resolve({ spelling: "incorrect", correctedWord: "Haus", nounSuggestion: "das Haus" }));
  expect(input.value).toBe("Huas");
  expect(container.textContent).not.toContain("Use Haus");
  expect(container.querySelector('.word-field-spinner')).toBeNull();
  expect(container.querySelector('.word-check-feedback')!.textContent).toBe("");
});
it("reports an unavailable check without claiming that the spelling is correct", async () => {
  vi.mocked(checkVocabularyWord).mockRejectedValue(new Error("offline"));
  render();
  fill(container.querySelector('input[aria-label="Word in the learning language"]')!, "Haus");
  await act(async () => { await vi.advanceTimersByTimeAsync(500); });
  expect(container.textContent).toContain("Spelling could not be verified");
  expect(container.textContent).not.toContain("Spelling looks correct");
  expect(container.querySelector('.word-field-spinner')).toBeNull();
});
it("translates only when clicked, with the button beside the word label", async () => {
  vi.mocked(translate).mockResolvedValue({ primary: "house", alternatives: [] });
  render();
  const input = container.querySelector<HTMLInputElement>('input[aria-label="Word in the learning language"]')!;
  fill(input, "Haus");
  await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
  expect(translate).not.toHaveBeenCalled();
  const labelRow = input.closest('label')!.querySelector('.label-action')!;
  expect(labelRow.textContent).toContain("Word in the learning language");
  expect(labelRow.querySelector('button')!.textContent).toBe("Translate");
  await act(async () => click("Translate"));
  expect(translate).toHaveBeenCalledWith("Haus", "de", "en", expect.any(AbortSignal));
  const translation = Array.from(container.querySelectorAll('label')).find((label) => label.textContent?.trim() === 'Translation')!.querySelector('input')!;
  expect(translation.value).toBe("house");
});

describe("optional automatic translation", () => {
  const wordField = () => container.querySelector<HTMLInputElement>('input[aria-label="Word in the learning language"]')!;
  const translationField = () => Array.from(container.querySelectorAll('label')).find((label) => label.textContent?.trim() === 'Translation')!.querySelector('input')!;
  it("translates only the final word after a typing pause when enabled", async () => {
    vi.mocked(translate).mockResolvedValue({ primary: "house", alternatives: [] });
    render(); click("Auto-translate");
    fill(wordField(), "Ha");
    await act(async () => { await vi.advanceTimersByTimeAsync(300); });
    fill(wordField(), "Haus");
    await act(async () => { await vi.advanceTimersByTimeAsync(499); });
    expect(translate).not.toHaveBeenCalled();
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(translate).toHaveBeenCalledExactlyOnceWith("Haus", "de", "en", expect.any(AbortSignal));
    expect(translationField().value).toBe("house");
    expect(container.querySelectorAll('[role="switch"]')).toHaveLength(2);
  });
  it("cancels a queued translation when switched off and keeps the manual button working", async () => {
    vi.mocked(translate).mockResolvedValue({ primary: "house", alternatives: [] });
    render(); click("Auto-translate"); fill(wordField(), "Haus"); click("Auto-translate");
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(translate).not.toHaveBeenCalled();
    await act(async () => click("Translate"));
    expect(translationField().value).toBe("house");
  });
  it("aborts an active automatic translation when disabled and ignores its late result", async () => {
    let resolve!: (value: { primary: string; alternatives: string[] }) => void;
    vi.mocked(translate).mockImplementation(() => new Promise((done) => { resolve = done; }));
    render(); click("Auto-translate"); fill(wordField(), "Haus");
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    const signal = vi.mocked(translate).mock.calls[0][3]!;
    click("Auto-translate");
    expect(signal.aborted).toBe(true);
    await act(async () => resolve({ primary: "late house", alternatives: [] }));
    expect(translationField().value).toBe("");
  });
  it("preserves manual edits before the debounce and during an automatic request", async () => {
    let resolve!: (value: { primary: string; alternatives: string[] }) => void;
    vi.mocked(translate).mockImplementation(() => new Promise((done) => { resolve = done; }));
    render(); click("Auto-translate"); fill(wordField(), "Haus");
    fill(translationField(), "my translation");
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    expect(translate).not.toHaveBeenCalled();
    fill(wordField(), "Tür");
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    fill(translationField(), "manual door");
    expect(vi.mocked(translate).mock.calls[0][3]!.aborted).toBe(true);
    await act(async () => resolve({ primary: "late door", alternatives: [] }));
    expect(translationField().value).toBe("manual door");
  });
  it("does not repeat a manual translation when its automatic timer fires", async () => {
    vi.mocked(translate).mockResolvedValue({ primary: "house", alternatives: [] });
    render(); click("Auto-translate"); fill(wordField(), "Haus");
    await act(async () => click("Translate"));
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(translate).toHaveBeenCalledTimes(1);
  });
  it("remembers automatic translation independently of spelling checks when the form reopens", async () => {
    vi.mocked(translate).mockResolvedValue({ primary: "house", alternatives: [] });
    render(); click("Auto-translate");
    act(() => root.unmount()); root = createRoot(container); render();
    const switches = container.querySelectorAll('[role="switch"]');
    expect(switches[0].getAttribute('aria-checked')).toBe('true');
    expect(switches[1].getAttribute('aria-checked')).toBe('true');
    fill(wordField(), "Haus");
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    expect(translationField().value).toBe("house");
  });
});

describe("word examples", () => {
  it("saves three example pairs and resets the new-word form", () => {
    render();
    fill(container.querySelector('input[aria-label="Word in the learning language"]')!, "Wort");
    const translation = Array.from(container.querySelectorAll('label')).find((label) => label.textContent?.trim() === 'Translation')!.querySelector('input')!;
    fill(translation, 'word');
    click('Add example'); click('Add example'); click('Add example');
    expect(container.querySelectorAll('fieldset')).toHaveLength(3);
    expect(Array.from(container.querySelectorAll('button')).find((button) => button.textContent?.trim() === 'Add example')!.disabled).toBe(true);
    for (let index = 0; index < 3; index++) {
      fill(fields(index)[0], ` Satz ${index + 1} `);
      fill(fields(index)[1], ` Sentence ${index + 1} `);
    }
    submit();
    expect(saved().examples).toEqual([1, 2, 3].map((n) => ({ targetSentence: `Satz ${n}`, translatedSentence: `Sentence ${n}` })));
    expect(container.querySelectorAll('fieldset')).toHaveLength(1);
    expect(fields(0)[0].value).toBe('');
  });
  it("edits and removes existing examples without resetting learning progress", () => {
    const original = { ...seedPair('en', 'de').words[0], examples: [1, 2, 3].map((n) => ({ targetSentence: `Satz ${n}`, translatedSentence: `Sentence ${n}` })) };
    render(original);
    fill(fields(1)[0], 'Changed sentence');
    click('Remove example 1');
    submit();
    expect(saved()).toEqual({ ...original, examples: [
      { targetSentence: 'Changed sentence', translatedSentence: 'Sentence 2' },
      original.examples[2],
    ] });
  });
  it("omits blank optional examples", () => {
    render({ ...seedPair('en', 'de').words[0], examples: [] });
    click('Add example');
    fill(fields(1)[0], ' Ein Beispiel. ');
    submit();
    expect(saved().examples).toEqual([{ targetSentence: 'Ein Beispiel.', translatedSentence: '' }]);
  });
  it("translates examples independently and preserves a manual edit", async () => {
    const pending: Array<(value: { primary: string; alternatives: string[] }) => void> = [];
    vi.mocked(translate).mockImplementation(() => new Promise((resolve) => pending.push(resolve)));
    render({ ...seedPair('en', 'de').words[0], examples: [] });
    click('Add example');
    fill(fields(0)[0], 'First'); fill(fields(1)[0], 'Second');
    click('Translate: Example 1'); click('Translate: Example 2');
    fill(fields(0)[1], 'Manual translation');
    await act(async () => {
      pending[1]({ primary: 'Translated second', alternatives: [] });
      pending[0]({ primary: 'Stale first', alternatives: [] });
    });
    expect(fields(0)[1].value).toBe('Manual translation');
    expect(fields(1)[1].value).toBe('Translated second');
  });
  it("ignores a translation after removing its example and adding another", async () => {
    let resolve!: (value: { primary: string; alternatives: string[] }) => void;
    vi.mocked(translate).mockImplementation(() => new Promise((done) => { resolve = done; }));
    render({ ...seedPair('en', 'de').words[0], examples: [] });
    click('Add example');
    fill(fields(1)[0], 'Remove this sentence');
    click('Translate: Example 2');
    const signal = vi.mocked(translate).mock.calls[0][3]!;
    click('Remove example 2'); click('Add example');
    expect(signal.aborted).toBe(true);
    await act(async () => resolve({ primary: 'Stale result', alternatives: [] }));
    expect(fields(1)[1].value).toBe('');
  });
});
