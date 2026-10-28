import type { Language } from "../types";
import { wordParts } from "./article";
import { analyzeCefrWithGemini } from "./gemini";
import { GeminiAnalysisError } from "./geminiProtocol";

export type CefrLevel = "A2" | "B1" | "B2" | "C1" | "C2";
export const CEFR_LEVELS: readonly CefrLevel[] = ["A2", "B1", "B2", "C1", "C2"];

export class CefrUnavailableError extends Error {
  constructor() { super("Gemini CEFR analysis unavailable"); this.name = "CefrUnavailableError"; }
}

// Bound request/output size without truncating the article. Split only between
// reader tokens so offsets, hyphens, elisions and combining marks stay intact.
function* articleChunks(text: string) {
  let offset = 0;
  let start = 0;
  let end = 0;
  let count = 0;
  for (const [index, part] of wordParts(text).entries()) {
    const at = offset;
    offset += part.length;
    if (index % 2 !== 1) continue;
    if (count && (count >= 200 || offset - start > 6000)) {
      yield { text: text.slice(start, end), offset: start };
      count = 0;
    }
    if (!count) start = at;
    end = offset;
    count++;
  }
  if (count) yield { text: text.slice(start, end), offset: start };
}

export async function analyzeArticleCefr(
  text: string, language: Language, signal?: AbortSignal, apiKey?: string,
): Promise<Map<number, CefrLevel>> {
  const levels = new Map<number, CefrLevel>();
  signal?.throwIfAborted();
  for (const chunk of articleChunks(text)) {
    signal?.throwIfAborted();
    let tokens: Awaited<ReturnType<typeof analyzeCefrWithGemini>>;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        tokens = await analyzeCefrWithGemini(chunk.text, language, signal, apiKey);
        break;
      } catch (error) {
        signal?.throwIfAborted();
        if (attempt === 0 && error instanceof GeminiAnalysisError && error.kind === "response") continue;
        throw error;
      }
    }
    signal?.throwIfAborted();
    if (!tokens) throw new CefrUnavailableError();
    for (const token of tokens) {
      if (token.level !== "A1") levels.set(chunk.offset + token.offset, token.level);
    }
  }
  return levels;
}
