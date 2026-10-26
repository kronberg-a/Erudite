import type { Language } from "../types";
import { seedPair } from "../i18n/seedData";
function clean(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, 2000);
}
export async function translate(
  text: string,
  from: Language,
  to: Language,
  signal?: AbortSignal,
): Promise<{ primary: string; alternatives: string[]; offline?: boolean }> {
  try {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", text.trim());
    url.searchParams.set("langpair", `${from}|${to}`);
    const timeout = AbortSignal.timeout(10_000);
    const response = await fetch(url, {
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
    if (!response.ok) throw new Error("Translation unavailable");
    const data = await response.json();
    if (
      Number(data.responseStatus) !== 200 ||
      typeof data.responseData?.translatedText !== "string"
    )
      throw new Error("Translation unavailable");
    const primary = clean(data.responseData.translatedText);
    if (!primary) throw new Error("Empty translation");
    const alternatives = [
      ...new Set<string>(
        (Array.isArray(data.matches) ? data.matches : []).flatMap(
          (m: { translation?: unknown }) =>
            typeof m.translation === "string" ? [clean(m.translation)] : [],
        ),
      ),
    ]
      .filter((t) => t && t !== primary)
      .slice(0, 5);
    return { primary, alternatives };
  } catch (error) {
    if (signal?.aborted) throw error;
    // Offline fallback uses the curated multilingual dictionary, never an invented result.
    const match = seedPair(to, from).words.find(
      (w) =>
        w.targetWord.toLocaleLowerCase(from) ===
        text.trim().toLocaleLowerCase(from),
    );
    if (match)
      return {
        primary: match.translations[0],
        alternatives: [],
        offline: true,
      };
    throw new Error("Translation unavailable");
  }
}
