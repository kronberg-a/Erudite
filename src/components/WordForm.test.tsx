// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WordForm } from "./WordForm";
import { seedPair } from "../i18n/seedData";
import { translator } from "../i18n/translations";
import { defaultSettings } from "../services/storage";
import { translate } from "../services/translator";
import type { WordCard } from "../types";

vi.mock("../services/translator", () => ({ translate: vi.fn() }));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
const update = vi.fn();
beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
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
