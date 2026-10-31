// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WordForm } from "./WordForm";
import { seedPair } from "../i18n/seedData";
import { translator } from "../i18n/translations";
import { defaultSettings } from "../services/storage";
import { translate } from "../services/translator";
import { suggestNounArticle } from "../services/nounArticle";
import type { WordCard } from "../types";

vi.mock("../services/translator", () => ({ translate: vi.fn() }));
vi.mock("../services/nounArticle", () => ({ suggestNounArticle: vi.fn() }));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
const update = vi.fn();
beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  vi.mocked(suggestNounArticle).mockResolvedValue(undefined);
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
    vi.mocked(suggestNounArticle).mockResolvedValue("das Haus");
    render();
    const input = container.querySelector<HTMLInputElement>('input[aria-label="Word in the learning language"]')!;
    fill(input, "Haus");
    const translation = Array.from(container.querySelectorAll('label')).find((label) => label.textContent?.trim() === 'Translation')!.querySelector('input')!;
    fill(translation, "house");
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    expect(input.value).toBe("Haus");
    expect(suggestNounArticle).toHaveBeenCalledWith("Haus", "de", "", expect.any(AbortSignal), defaultSettings.geminiApiKey);
    click("Use das Haus");
    expect(input.value).toBe("das Haus");
    expect(translation.value).toBe("house");
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(suggestNounArticle).toHaveBeenCalledTimes(1);
    submit();
    expect(saved().targetWord).toBe("das Haus");
  });

  it("keeps the accepted article when context changes and checks again after a manual word edit", async () => {
    vi.mocked(suggestNounArticle).mockResolvedValue("das Haus");
    render();
    const input = container.querySelector<HTMLInputElement>('input[aria-label="Word in the learning language"]')!;
    fill(input, "Haus");
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    click("Use das Haus");
    fill(fields(0)[0], "Das Haus ist groß.");
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(suggestNounArticle).toHaveBeenCalledTimes(1);
    expect(container.textContent).not.toContain("Checking noun article");
    fill(input, "Tür");
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    expect(suggestNounArticle).toHaveBeenCalledTimes(2);
    expect(vi.mocked(suggestNounArticle).mock.calls[1][0]).toBe("Tür");
  });

  it("ignores a late suggestion after the user changes the noun", async () => {
    let resolve!: (value: string) => void;
    vi.mocked(suggestNounArticle).mockImplementation(() => new Promise((done) => { resolve = done; }));
    vi.mocked(translate).mockResolvedValue({ primary: "house", alternatives: [] });
    render();
    const input = container.querySelector<HTMLInputElement>('input[aria-label="Word in the learning language"]')!;
    fill(input, "Haus");
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    const signal = vi.mocked(suggestNounArticle).mock.calls[0][3]!;
    fill(input, "Tür");
    expect(signal.aborted).toBe(true);
    await act(async () => resolve("das Haus"));
    expect(container.textContent).not.toContain("Use das Haus");
    expect(input.value).toBe("Tür");
  });
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
