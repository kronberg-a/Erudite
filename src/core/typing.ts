import type { Evaluation, Settings, WordCard } from "../types";

export function answerTarget(target: string): string {
  let depth = 0;
  return Array.from(target)
    .filter((c) => {
      if (c === "(") {
        depth++;
        return false;
      }
      if (c === ")" && depth) {
        depth--;
        return false;
      }
      return depth === 0;
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}
export function normalizeAnswer(value: string, strictAccents: boolean): string {
  const normalized = value.trim().toLowerCase();
  return strictAccents
    ? normalized
    : normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
export function evaluateAnswer(
  input: string,
  target: string,
  strictAccents: boolean,
  usedHint: boolean,
  failedAttempts = 0,
): Evaluation {
  if (
    normalizeAnswer(input, strictAccents) !==
    normalizeAnswer(answerTarget(target), strictAccents)
  )
    return "INCORRECT";
  return usedHint || failedAttempts > 0 ? "ASSISTED" : "CORRECT";
}
export function needsTyping(
  card: WordCard,
  mode: Settings["studyMode"],
): boolean {
  return (
    (mode === "TYPE_ONLY" && (card.status !== "NEW" || card.repCount > 0)) ||
    (mode === "MIXED" && card.status === "LEARNING")
  );
}
export function nextHint(
  input: string,
  target: string,
  strictAccents: boolean,
): string {
  const correctText = answerTarget(target);
  const typedText = input.trimStart();
  const correct = Array.from(
    strictAccents ? correctText : correctText.normalize("NFC"),
  );
  const typed = Array.from(
    strictAccents ? typedText : typedText.normalize("NFC"),
  );
  const comparable = (c: string) =>
    strictAccents
      ? c.toLowerCase()
      : c
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
  let prefix = 0;
  while (
    prefix < typed.length &&
    prefix < correct.length &&
    comparable(typed[prefix]) === comparable(correct[prefix])
  )
    prefix++;
  return correct.slice(0, Math.min(prefix + 1, correct.length)).join("");
}
export interface SentencePart {
  text: string;
  match: boolean;
}
export function sentenceParts(
  sentence: string,
  target: string,
): SentencePart[] {
  const word = answerTarget(target);
  if (!word) return [{ text: sentence, match: false }];
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "giu");
  const parts: SentencePart[] = [];
  let offset = 0;
  for (const match of sentence.matchAll(regex)) {
    if (match.index > offset)
      parts.push({ text: sentence.slice(offset, match.index), match: false });
    parts.push({ text: match[0], match: true });
    offset = match.index + match[0].length;
  }
  if (offset < sentence.length)
    parts.push({ text: sentence.slice(offset), match: false });
  return parts;
}
export function maskedSentence(sentence: string, target: string): string {
  return sentenceParts(sentence, target)
    .map((p) => (p.match ? "[____]" : p.text))
    .join("");
}
export interface DiffPart {
  text: string;
  kind: "same" | "wrong" | "missing";
}
// Levenshtein alignment keeps later correct letters aligned after a missing/extra letter.
export function answerDiff(
  input: string,
  target: string,
  strictAccents: boolean,
): DiffPart[] {
  const actual = Array.from(input.trim());
  const expected = Array.from(answerTarget(target));
  const same = (a: string, b: string) =>
    normalizeAnswer(a, strictAccents) === normalizeAnswer(b, strictAccents);
  const dp = Array.from(
    { length: actual.length + 1 },
    () => new Uint16Array(expected.length + 1),
  );
  for (let i = 0; i <= actual.length; i++) dp[i][0] = i;
  for (let j = 0; j <= expected.length; j++) dp[0][j] = j;
  for (let i = 1; i <= actual.length; i++)
    for (let j = 1; j <= expected.length; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (same(actual[i - 1], expected[j - 1]) ? 0 : 1),
      );
  const parts: DiffPart[] = [];
  let i = actual.length,
    j = expected.length;
  while (i || j) {
    if (
      i &&
      j &&
      same(actual[i - 1], expected[j - 1]) &&
      dp[i][j] === dp[i - 1][j - 1]
    ) {
      parts.unshift({ text: actual[--i], kind: "same" });
      j--;
    } else if (i && j && dp[i][j] === dp[i - 1][j - 1] + 1) {
      const wanted = expected[--j];
      const given = actual[--i];
      parts.unshift(
        { text: given, kind: "wrong" },
        { text: wanted, kind: "missing" },
      );
    } else if (i && dp[i][j] === dp[i - 1][j] + 1)
      parts.unshift({ text: actual[--i], kind: "wrong" });
    else parts.unshift({ text: expected[--j], kind: "missing" });
  }
  return parts;
}
