// @vitest-environment jsdom
import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StudyView } from "./StudyView";
import { TypingCard } from "./TypingCard";
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
function setup(patch: Partial<WordCard> = {}, mode = "mixed", extraWords: WordCard[] = []) {
  const seed = seedPair("en", "fr");
  const pair: PairData = {
    ...seed,
    words: [
      {
        ...seed.words[0],
        status: "LEARNING",
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
      ...extraWords,
    ],
  };
  function Harness() {
    const [state, setState] = useState(pair);
    const [order, setOrder] = useState(0);
    return (
      <StudyView
        pair={state}
        reviewOrder={order}
        settings={{
          ...defaultSettings,
          targetLanguage: "fr",
          studyMode: "TYPE_ONLY",
        }}
        update={(p, nextOrder) => {
          setOrder(nextOrder ?? order);
          updates(p);
          setState(p);
        }}
        t={translator("en")}
        openLibrary={() => {}}
      />
    );
  }
  act(() => root.render(<Harness />));
  act(() => container.querySelector<HTMLInputElement>(`input[name="session-mode"][value="${mode}"]`)!.click());
  click("Start practice");
  return pair.words[0];
}
function commitGrade() {
  const selected = container.querySelector<HTMLButtonElement>(".action-bar .preselected");
  if (!selected) throw new Error("Missing suggested grade");
  act(() => selected.click());
}
function advanceTime() {
  act(() => vi.advanceTimersByTime(150));
}
describe("typing review lifecycle", () => {
  it("introduces unseen Type Only words once as flashcards, then requires typing", () => {
    setup({ status: "NEW" });
    expect(container.querySelector(".card-prompt h2")?.textContent).toBe("café (noun)");
    expect(container.querySelector('[aria-label="Your answer"]')).toBeNull();
    expect(button("Don’t know")).not.toBeNull();
    expect(button("Already know")).not.toBeNull();
    click("Reveal");
    expect(container.querySelector(".card-answer")?.textContent).toContain("coffee");
    click("Already know");
    expect(container.querySelector('[aria-label="Your answer"]')).not.toBeNull();
    expect(container.querySelector(".typing-correct-word")).toBeNull();
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({ status: "LEARNING", step: 1, repCount: 1 });
  });
  it.each(["button", "keyboard", "swipe"])("masters with the %s control and undo restores the session", (control) => {
    const original = setup({ status: "NEW" });
    if (control === "button") click("Already mastered");
    else if (control === "keyboard") key(document.body, "ArrowUp");
    else {
      const card = container.querySelector<HTMLElement>("article")!;
      card.setPointerCapture = vi.fn();
      const pointer = (type: string, x: number, y: number) => act(() => card.dispatchEvent(Object.assign(new Event(type, { bubbles: true }), {
        pointerId: 1, isPrimary: true, button: 0, clientX: x, clientY: y,
      })));
      pointer("pointerdown", 0, 0);
      pointer("pointermove", 110, -150);
      expect(card.querySelector(".swipe-badge.master")).not.toBeNull();
      pointer("pointerup", 110, -150);
    }
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({ status: "MASTERED", step: 5, repCount: 1, nextReviewDate: 0 });
    expect(container.textContent).toContain("Session complete.");
    expect(container.querySelector(".progress-resolved")?.getAttribute("style")).toContain("100%");
    click("Undo");
    expect(updates.mock.calls[1][0].words[0]).toEqual(original);
    expect(container.querySelector("article")).not.toBeNull();
  });
  it("blocks mastery during typing and retires a hinted card on explicit mastery", () => {
    setup();
    key(input(""), "ArrowUp");
    expect(updates).not.toHaveBeenCalled();
    expect(container.querySelector(".master-button")).toBeNull();
    key(input("caf"), "Tab"); key(input("café"), "Enter");
    click("Already mastered");
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({ status: "MASTERED", repCount: 1 });
    expect(container.querySelector("article")).toBeNull();
  });
  function counter() {
    return {
      counts: ["new", "active", "resolved"].map((kind) => container.querySelector(`.session-pill-${kind} strong`)?.textContent),
      resolved: (container.querySelector(".progress-resolved") as HTMLElement)?.style.width,
      learning: (container.querySelector(".progress-learning") as HTMLElement)?.style.width,
      remaining: (container.querySelector(".progress-remaining") as HTMLElement)?.style.width,
      total: container.querySelector('[role="progressbar"]')?.getAttribute("aria-valuemax"),
    };
  }
  it("tracks session debt through learning, failure, assistance, graduation and undo", () => {
    setup({ status: "NEW" });
    expect(container.querySelector(".summary-grid")).toBeNull();
    expect(container.querySelector(".daily-goal-progress")).toBeNull();
    expect(counter()).toMatchObject({ counts: ["1", "0", "0"], resolved: "0%", learning: "0%", remaining: "100%", total: "1" });
    click("Already know");
    expect(counter()).toMatchObject({ counts: ["0", "1", "0"], resolved: "0%" });
    expect(container.querySelector(".session-attempt-count")).toBeNull();
    expect(container.querySelector(".session-remaining")).toBeNull();
    expect(parseFloat(counter().learning!)).toBeCloseTo(100 / 3);
    expect(parseFloat(counter().remaining!)).toBeCloseTo(200 / 3);
    key(input("café"), "Enter"); commitGrade();
    const beforeFailure = counter();
    expect(parseFloat(beforeFailure.learning!)).toBeCloseTo(200 / 3);
    expect(parseFloat(beforeFailure.remaining!)).toBeCloseTo(100 / 3);
    key(input(""), "Escape"); commitGrade();
    expect(counter()).toMatchObject({ counts: ["0", "1", "0"], resolved: "0%", learning: "0%", remaining: "100%" });
    expect(updates.mock.calls[2][0].words[0].step).toBe(0);
    click("Undo");
    expect(counter()).toEqual(beforeFailure);
    key(input("caf"), "Tab"); key(input("café"), "Enter"); commitGrade();
    expect(counter()).toMatchObject({ counts: ["0", "1", "0"], resolved: "0%" });
    expect(parseFloat(counter().learning!)).toBeCloseTo(200 / 3);
    const beforeGraduation = counter();
    key(input("café"), "Enter"); commitGrade();
    expect(container.textContent).toContain("Session complete.");
    expect(counter()).toMatchObject({ counts: ["0", "0", "1"], resolved: "100%", learning: "0%", remaining: "0%", total: "1" });
    key(document.body, "z", { ctrlKey: true });
    expect(counter()).toEqual(beforeGraduation);
    click("End session");
    expect(container.querySelector(".progress-track")).toBeNull();
    expect(container.querySelector(".summary-grid")).not.toBeNull();
  });
  it("counts pending reviews but excludes memorized words, then restores all segments on undo", () => {
    const base = seedPair("en", "fr").words[0];
    setup({ status: "NEW" }, "mixed", [
      { ...base, id: "review", targetWord: "café", status: "REVIEW", step: 3 },
      { ...base, id: "memorized", targetWord: "café", status: "MASTERED", step: 5 },
    ]);
    const before = counter();
    expect(before).toMatchObject({ counts: ["1", "1", "0"], total: "2" });
    key(input("café"), "Enter"); commitGrade();
    expect(counter()).toMatchObject({ counts: ["1", "0", "1"] });
    expect(parseFloat(counter().resolved!)).toBeCloseTo(50);
    click("Undo");
    expect(counter()).toEqual(before);
  });
  it("ends on exhaustion and undo reopens the final card with its exact prior schedule", () => {
    const original = setup({ status: "REVIEW", step: 3, interval: 3, nextReviewDate: Date.now() + 86400000 });
    key(input("café"), "Enter"); commitGrade();
    expect(container.querySelector("article")).toBeNull();
    expect(container.textContent).toContain("Session complete.");
    expect(container.querySelector(".page-heading")).not.toBeNull();
    expect(updates.mock.calls[0][0].words[0].nextReviewDate).toBe(original.nextReviewDate);
    key(window.document.body, "z", { ctrlKey: true });
    expect(container.querySelector("article")).not.toBeNull();
    expect(container.querySelector(".page-heading")).toBeNull();
    expect(updates.mock.calls[1][0].words[0]).toEqual(original);
  });
  it("keeps the chosen new mode through learning, ends at graduation, and supports cancellation", () => {
    setup({ status: "NEW" }, "new");
    expect(container.querySelector(".session-settings")).toBeNull();
    for (let i = 0; i < 3; i++) {
      if (i === 0) click("Already know");
      else { key(input("café"), "Enter"); commitGrade(); }
      expect(updates.mock.calls[i][0].words[0].step).toBe(i + 1);
    }
    expect(container.querySelector("article")).toBeNull();
    expect(container.textContent).toContain("Session complete.");
    expect(container.querySelector<HTMLInputElement>('input[name="session-mode"]:checked')?.value).toBe("new");
    expect(button("Start practice").disabled).toBe(true);
    click("Undo");
    expect(container.querySelector(".session-settings")).toBeNull();
    expect(updates.mock.calls[3][0].words[0]).toMatchObject({ status: "LEARNING", step: 2, repCount: 2 });
    click("End session");
    expect(container.querySelector(".session-settings")).not.toBeNull();
    expect(container.querySelector("article")).toBeNull();
    expect(button("Undo").disabled).toBe(true);
    expect(container.textContent).not.toContain("Session complete.");
    expect(button("Start practice").disabled).toBe(true);
  });
  it("hides the answer/audio, masks every occurrence, and waits after correct submission", () => {
    setup();
    expect(container.querySelector("article")?.textContent).not.toContain(
      "café",
    );
    expect(
      container.querySelector('[aria-label="Listen to pronunciation"]'),
    ).toBeNull();
    expect(container.querySelector(".typing-clues")).toBeNull();
    expect(container.textContent).not.toContain("A coffee and a coffee.");
    expect(document.activeElement).toBe(container.querySelector("input"));
    const field = input("CAFÉ");
    key(field, "Enter");
    expect(container.textContent).toContain("Correct");
    expect(container.textContent).toContain("café (noun)");
    expect(container.querySelectorAll(".context strong")).toHaveLength(2);
    expect(container.querySelectorAll(".action-bar button")).toHaveLength(2);
    expect(container.querySelector(".action-next")).toBeNull();
    expect(container.querySelector(".action-reveal")).toBeNull();
    expect(document.activeElement).toBe(button("I know"));
    expect(container.textContent).toContain("A coffee and a coffee.");
    expect(speak).toHaveBeenCalledTimes(1);
    expect(updates).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(2000));
    expect(updates).not.toHaveBeenCalled();
    expect(container.querySelector("article")).not.toBeNull();
    commitGrade();
    advanceTime();
    expect(updates).toHaveBeenCalledTimes(1);
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({
      status: "LEARNING",
      step: 1,
    });
  });
  it("gives hinted correct answers a step-preserving repeat and resets the same card turn", () => {
    setup({ status: "LEARNING", step: 1, repCount: 2 });
    const field = input("caf");
    key(field, "Tab");
    expect(field.value).toBe("café");
    key(field, "Enter");
    expect(container.textContent).toContain("Correct with assistance");
    expect(updates).not.toHaveBeenCalled();
    commitGrade();
    advanceTime();
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({
      status: "LEARNING",
      step: 1,
      repCount: 3,
    });
    expect(container.querySelector<HTMLInputElement>("input")?.value).toBe("");
    expect(container.textContent).not.toContain("Correct with assistance");
  });
  it("reveals the answer without character differences and supports a know override", () => {
    setup();
    key(input("cafe"), "Enter");
    key(input("cafe"), "Enter");
    key(input("cafe"), "Enter");
    expect(container.textContent).toContain("Not quite");
    expect(container.querySelector(".answer-diff")).toBeNull();
    expect(container.querySelector(".typing-correct-word h2")?.textContent).toBe("café (noun)");
    expect(updates).not.toHaveBeenCalled();
    key(button("Repeat"), "ArrowRight");
    advanceTime();
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({
      status: "LEARNING",
      repCount: 1,
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
    commitGrade();
    advanceTime();
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({
      status: "LEARNING",
      step: 0,
      repCount: 1,
    });
    expect(container.textContent).toContain("Attempts remaining: 3");
  });
  it.each([1, 2])(
    "grades a correct answer after %i misses as assisted and preserves progress",
    (misses) => {
      setup({ status: "LEARNING", step: 2 });
      for (let miss = 0; miss < misses; miss++) key(input("wrong"), "Enter");
      key(input("café"), "Enter");
      expect(
        container.querySelector(".typing-feedback.assisted"),
      ).not.toBeNull();
      expect(updates).not.toHaveBeenCalled();
      expect(speak).toHaveBeenCalledTimes(1);
      commitGrade();
      expect(updates.mock.calls[0][0].words[0]).toMatchObject({
        status: "LEARNING", step: 2, repCount: 1,
      });
      expect(container.querySelector('[aria-label="Your answer"]')).not.toBeNull();
    },
  );
  it("keeps input settings unavailable after hints and incorrect attempts", () => {
    setup();
    key(input("wrong"), "Enter");
    key(input("wrong"), "Tab");
    expect(container.querySelector('select[aria-label="Answer input"]')).toBeNull();
    expect(container.textContent).toContain("Attempts remaining: 2");
    key(input("café"), "Enter");
    expect(container.querySelector(".typing-feedback.assisted")).not.toBeNull();
  });
  it("gives general mistake feedback without identifying letters and keeps the attempt count", () => {
    setup();
    key(input("cafe"), "Enter");
    expect(container.querySelector(".answer-diff")).toBeNull();
    expect(container.querySelector(".typing-correct-word")).toBeNull();
    expect(container.querySelector(".typing-mistake")).not.toBeNull();
    expect(container.querySelector("input")?.getAttribute("aria-invalid")).toBe("true");
    input("caf");
    expect(container.querySelector(".typing-attempt-diff")).toBeNull();
    expect(container.querySelector("input")?.getAttribute("aria-invalid")).toBe("false");
    expect(container.textContent).toContain("Attempts remaining: 2");
    key(input("café"), "Enter");
    expect(container.querySelector(".typing-feedback.assisted")).not.toBeNull();
  });
  it("switches keyboard and tiles without clearing mistakes or hint usage", () => {
    setup({ status: "LEARNING", step: 1 });
    key(input("wrong"), "Enter");
    const modes = container.querySelector(".mobile-typing-inputs")!;
    act(() => modes.querySelectorAll<HTMLButtonElement>("button")[1].click());
    expect(container.querySelector(".tile-bank")).not.toBeNull();
    expect(document.activeElement).toBe(container.querySelector(".tile-answer"));
    expect(container.textContent).toContain("Attempts remaining: 2");
    act(() => modes.querySelectorAll<HTMLButtonElement>("button")[0].click());
    expect(document.activeElement).toBe(container.querySelector("input"));
    key(input("café"), "Enter");
    expect(container.querySelector(".typing-feedback.assisted")).not.toBeNull();
  });
  it("keeps the mobile tile preference when a failed card returns", () => {
    setup();
    act(() => container.querySelectorAll<HTMLButtonElement>(".mobile-typing-inputs button")[1].click());
    key(container.querySelector(".tile-answer")!, "Escape");
    expect(speak).toHaveBeenCalledTimes(1);
    commitGrade();
    expect(container.querySelector(".tile-bank")).not.toBeNull();
    expect(container.querySelector('input[aria-label="Your answer"]')).toBeNull();
    expect(container.textContent).toContain("Attempts remaining: 3");
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({ status: "LEARNING", step: 0 });
  });
  it("Escape reveals without committing, then Repeat applies a normal failure", () => {
    setup({ status: "LEARNING", step: 2, repCount: 2 });
    key(input(""), "Escape");
    expect(container.textContent).toContain("Not quite");
    expect(speak).toHaveBeenCalledTimes(1);
    expect(updates).not.toHaveBeenCalled();
    commitGrade();
    advanceTime();
    expect(updates.mock.calls[0][0].words[0]).toMatchObject({
      status: "LEARNING",
      step: 0,
      repCount: 3,
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
    const seed = seedPair("en", "fr");
    act(() => root.render(<TypingCard
      card={{ ...seed.words[0], targetWord: "café", examples: [] }}
      settings={{ ...defaultSettings, targetLanguage: "fr" }}
      inputMode="TILES" evaluation={null} onEvaluate={() => {}}
      onListen={() => {}} audioError={false} t={translator("en")}
    />));
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
