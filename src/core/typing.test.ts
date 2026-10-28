import { describe, expect, it } from "vitest";
import {
  answerDiff,
  answerTarget,
  evaluateAnswer,
  maskedSentence,
  needsTyping,
  nextHint,
  normalizeAnswer,
  sentenceParts,
} from "./typing";
import { seedPair } from "../i18n/seedData";
import { reviewCard } from "./srsEngine";
import { advanceQueue } from "./queueManager";
const card = seedPair("en", "fr").words[0];
describe("active recall validation", () => {
  it("trims, folds case, and strips only target grammatical notes", () => {
    expect(
      evaluateAnswer(" LAUFEN ", "laufen (läuft, lief)", true, false),
    ).toBe("CORRECT");
    expect(answerTarget("to (verb (optional)) run")).toBe("to run");
    expect(
      evaluateAnswer(
        "laufen (läuft, lief)",
        "laufen (läuft, lief)",
        true,
        false,
      ),
    ).toBe("INCORRECT");
  });
  it("requires accents by default and optionally accepts their base characters", () => {
    expect(evaluateAnswer("cafe", "café", true, false)).toBe("INCORRECT");
    expect(evaluateAnswer("cafe", "café", false, false)).toBe("CORRECT");
    expect(evaluateAnswer("uber", "über", false, false)).toBe("CORRECT");
    expect(normalizeAnswer(" ÉTÉ ", false)).toBe("ete");
  });
  it("treats correct hinted answers as assisted but keeps incorrect hinted answers incorrect", () => {
    expect(evaluateAnswer("café", "café", true, true)).toBe("ASSISTED");
    expect(evaluateAnswer("caf", "café", true, true)).toBe("INCORRECT");
  });
  it("treats corrected typos as assisted, including when no hint was used", () => {
    for (const attempts of [1, 2]) {
      expect(evaluateAnswer("CAFÉ", "café", true, false, attempts)).toBe("ASSISTED");
      expect(evaluateAnswer("wrong", "café", true, false, attempts)).toBe("INCORRECT");
    }
    expect(evaluateAnswer("CAFÉ", "café", true, false, 0)).toBe("CORRECT");
  });
  it("adds one correct character after the valid prefix and replaces an incorrect suffix", () => {
    expect(nextHint("", "laufen (verb)", true)).toBe("l");
    expect(nextHint("lauXXX", "laufen", true)).toBe("lauf");
    expect(nextHint("cafE", "café", false)).toBe("café");
    expect(nextHint("die ", "die Zeit", true)).toBe("die Z");
    expect(nextHint("e\u0301t", "été", false)).toBe("été");
  });
  it("masks all case-insensitive literal occurrences and escapes regex punctuation", () => {
    expect(maskedSentence("Café, CAFÉ, café.", "café (noun)")).toBe(
      "[____], [____], [____].",
    );
    expect(maskedSentence("a+b and A+B", "a+b")).toBe("[____] and [____]");
    expect(sentenceParts("un café", "café")).toEqual([
      { text: "un ", match: false },
      { text: "café", match: true },
    ]);
  });
  it("aligns omitted and extra letters instead of marking the whole suffix wrong", () => {
    expect(answerDiff("cfe", "cafe", true)).toEqual([
      { text: "c", kind: "same" },
      { text: "a", kind: "missing" },
      { text: "f", kind: "same" },
      { text: "e", kind: "same" },
    ]);
    expect(
      answerDiff("cafxe", "cafe", true).filter((p) => p.kind === "wrong"),
    ).toEqual([{ text: "x", kind: "wrong" }]);
    expect(answerDiff("cafe", "café", true)).toContainEqual({
      text: "e",
      kind: "wrong",
    });
  });
  it("limits mixed typing to learning cards", () => {
    for (const status of ["NEW", "LEARNING", "REVIEW", "MASTERED"] as const) {
      expect(needsTyping({ ...card, status }, "TYPE_ONLY")).toBe(status !== "NEW");
      expect(needsTyping({ ...card, status, repCount: 1 }, "TYPE_ONLY")).toBe(true);
      expect(needsTyping({ ...card, status }, "SWIPE_ONLY")).toBe(false);
      expect(needsTyping({ ...card, status }, "MIXED")).toBe(
        status === "LEARNING",
      );
    }
  });
  it("preserves learning progress on assisted repeats and inserts four cards ahead", () => {
    const learning = {
      ...card,
      id: "a",
      status: "LEARNING" as const,
      step: 2,
      repCount: 1,
    };
    const result = reviewCard(
      learning,
      "repeat",
      { instantMasterOnFirstTry: false },
      100,
      { assisted: true },
    );
    expect(result).toMatchObject({
      status: "LEARNING",
      step: 2,
      repCount: 2,
    });
    expect(advanceQueue(["a", "b", "c", "d", "e", "f"], result, 4)).toEqual([
      "b",
      "c",
      "d",
      "e",
      "a",
      "f",
    ]);
  });
});
