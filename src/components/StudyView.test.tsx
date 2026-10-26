// @vitest-environment jsdom
import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StudyView } from "./StudyView";
import { seedPair } from "../i18n/seedData";
import { translator } from "../i18n/translations";
import { defaultSettings } from "../services/storage";
import { speak } from "../core/speech";
import type { PairData, WordCard } from "../types";
vi.mock("../core/speech", () => ({ speak: vi.fn(() => true) }));
declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
const updates = vi.fn();
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
function button(name: string) {
  const result = Array.from(container.querySelectorAll("button")).find(
    (b) => b.textContent?.trim() === name,
  );
  if (!result) throw new Error(`Missing button: ${name}`);
  return result;
}
function click(name: string) {
  act(() => button(name).click());
}
function key(element: Element, key: string, extra: KeyboardEventInit = {}) {
  act(() =>
    element.dispatchEvent(
      new KeyboardEvent("keydown", {
        key,
        code: key === " " ? "Space" : key,
        bubbles: true,
        cancelable: true,
        ...extra,
      }),
    ),
  );
}
function input(value: string) {
  const el = container.querySelector<HTMLInputElement>(
    'input[aria-label="Your answer"]',
  )!;
  act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  return el;
}
function setup(patch: Partial<WordCard> = {}) {
  const seed = seedPair("en", "fr");
  const pair: PairData = {
    ...seed,
    words: [
      {
        ...seed.words[0],
        targetWord: "café (noun)",
        transcription: "/kafe/",
        translations: ["coffee"],
        examples: [
          {
            targetSentence: "Un café et un CAFÉ.",
            translatedSentence: "A coffee and a coffee.",
          },
        ],
        ...patch,
      },
    ],
  };
  function Harness() {
    const [state, setState] = useState(pair);
    return (
      <StudyView
        pair={state}
        settings={{
          ...defaultSettings,
          targetLanguage: "fr",
          studyMode: "TYPE_ONLY",
        }}
        update={(p) => {
          updates(p);
          setState(p);
        }}
        t={translator("en")}
        openLibrary={() => {}}
        changeSettings={() => {}}
      />
    );
  }
  act(() => root.render(<Harness />));
  click("Start practice");
  return pair.words[0];
}
function advanceTime() {
  act(() => vi.advanceTimersByTime(150));
}
describe("typing review lifecycle", () => {
  it("hides the answer/audio, masks every occurrence, and waits after correct submission", () => {
    setup();
    expect(container.querySelector("article")?.textContent).not.toContain(
      "café",
    );
    expect(
      container.querySelector('[aria-label="Listen to pronunciation"]'),
    ).toBeNull();
    expect(container.textContent).toContain("Un [____] et un [____].");
    expect(document.activeElement).toBe(container.querySelector("input"));
    const field = input("CAFÉ");
    key(field, "Enter");
    expect(container.textContent).toContain("Correct");
    expect(container.textContent).toContain("café (noun)");
    expect(container.querySelectorAll(".context strong")).toHaveLength(2);
    expect(speak).toHaveBeenCalledTimes(1);
    expect(updates).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(2000));
    expect(updates).not.toHaveBeenCalled();
    expect(container.querySelector("article")).not.toBeNull();
    click("Next");
    advanceTime();
    expect(updates).toHaveBeenCalledTimes(1);
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({
      status: "REVIEW",
      interval: 7,
    });
  });
  it("gives hinted correct answers a penalty-free repeat and resets the same card turn", () => {
    setup({ status: "LEARNING", step: 1, easeFactor: 2.1 });
    const field = input("caf");
    key(field, "Tab");
    expect(field.value).toBe("café");
    key(field, "Enter");
    expect(container.textContent).toContain("Correct with a hint");
    expect(updates).not.toHaveBeenCalled();
    click("Next");
    advanceTime();
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({
      status: "LEARNING",
      step: 1,
      easeFactor: 2.1,
    });
    expect(container.querySelector<HTMLInputElement>("input")?.value).toBe("");
    expect(container.textContent).not.toContain("Correct with a hint");
  });
  it("reveals incorrect character differences and supports a know override", () => {
    setup();
    key(input("cafe"), "Enter");
    key(input("cafe"), "Enter");
    key(input("cafe"), "Enter");
    expect(container.textContent).toContain("Not quite");
    expect(container.querySelector(".answer-diff del")?.textContent).toBe("e");
    expect(updates).not.toHaveBeenCalled();
    key(button("Next"), "ArrowRight");
    advanceTime();
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({
      status: "REVIEW",
      easeFactor: 2.5,
    });
  });
  it("allows two retries without revealing or mutating progress, then pauses after the third miss", () => {
    setup();
    for (let miss = 1; miss <= 2; miss++) {
      key(input("wrong"), "Enter");
      expect(container.textContent).toContain(
        `Attempts remaining: ${3 - miss}`,
      );
      expect(container.querySelector(".typing-feedback")).toBeNull();
      expect(container.querySelector("article")?.textContent).not.toContain(
        "café",
      );
      expect(
        container.querySelector('[aria-label="Listen to pronunciation"]'),
      ).toBeNull();
      expect(speak).not.toHaveBeenCalled();
      expect(updates).not.toHaveBeenCalled();
    }
    click("Check");
    expect(
      container.querySelector(".typing-feedback.incorrect"),
    ).not.toBeNull();
    expect(speak).toHaveBeenCalledTimes(1);
    expect(updates).not.toHaveBeenCalled();
    click("Next");
    advanceTime();
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({
      status: "LEARNING",
      step: 0,
      easeFactor: 2.3,
    });
    expect(container.textContent).toContain("Attempts remaining: 3");
  });
  it.each([1, 2])(
    "accepts a correct answer after %i misses without auto-advancing",
    (misses) => {
      setup();
      for (let miss = 0; miss < misses; miss++) key(input("wrong"), "Enter");
      key(input("café"), "Enter");
      expect(
        container.querySelector(".typing-feedback.correct"),
      ).not.toBeNull();
      expect(updates).not.toHaveBeenCalled();
      expect(speak).toHaveBeenCalledTimes(1);
    },
  );
  it("keeps the hint flag and attempt count when changing input modes", () => {
    setup();
    key(input("wrong"), "Enter");
    key(input("wrong"), "Tab");
    const select = container.querySelector<HTMLSelectElement>(
      'select[aria-label="Answer input"]',
    )!;
    act(() => {
      select.value = "TILES";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(container.textContent).toContain("Attempts remaining: 2");
    act(() => {
      select.value = "KEYBOARD";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    key(input("café"), "Enter");
    expect(container.querySelector(".typing-feedback.assisted")).not.toBeNull();
  });
  it("Escape reveals without committing, then Next applies a normal failure", () => {
    setup({ status: "LEARNING", step: 2, easeFactor: 2.1 });
    key(input(""), "Escape");
    expect(container.textContent).toContain("Not quite");
    expect(speak).toHaveBeenCalledTimes(1);
    expect(updates).not.toHaveBeenCalled();
    click("Next");
    advanceTime();
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({
      status: "LEARNING",
      step: 0,
      easeFactor: 1.9,
    });
  });
  it("ignores repeated Enter during input and lets undo restore the previous scheduling state", () => {
    const original = setup();
    const field = input("café");
    key(field, "Enter", { repeat: true });
    expect(container.querySelector(".typing-feedback")).toBeNull();
    key(field, "Enter");
    click("Repeat");
    advanceTime();
    expect(updates.mock.calls[0][0].words[0].status).toBe("LEARNING");
    click("Undo");
    expect(updates.mock.calls[1][0].words[0]).toEqual(original);
    expect(container.querySelector<HTMLInputElement>("input")?.value).toBe("");
  });
  it("lets letter tiles be selected, returned, and completed with a hint", () => {
    setup();
    const select = container.querySelector<HTMLSelectElement>(
      'select[aria-label="Answer input"]',
    )!;
    act(() => {
      select.value = "TILES";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    const bank = container.querySelector('[aria-label="Available letters"]')!;
    const c = bank.querySelector<HTMLButtonElement>('[aria-label="c"]')!;
    act(() => c.click());
    expect(c.disabled).toBe(true);
    const inserted = container.querySelector<HTMLButtonElement>(
      '[aria-label="Return letter: c"]',
    )!;
    act(() => inserted.click());
    expect(c.disabled).toBe(false);
    click("HintTab");
    expect(
      container.querySelector('[aria-label="Return letter: c"]'),
    ).not.toBeNull();
  });
});
