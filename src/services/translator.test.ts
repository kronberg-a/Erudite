import { afterEach, describe, expect, it, vi } from "vitest";
import { translate } from "./translator";
afterEach(() => vi.unstubAllGlobals());
describe("translation service", () => {
  it("sends an encoded target-to-base pair and deduplicates sanitized alternatives", async () => {
    const mock = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          responseStatus: 200,
          responseData: { translatedText: "<b>hello</b>" },
          matches: [
            { translation: "hello" },
            { translation: "hi" },
            { translation: "hi" },
            { translation: "<i>greetings</i>" },
            { translation: null },
          ],
        }),
      });
    vi.stubGlobal("fetch", mock);
    const result = await translate("bonjour & salut", "fr", "en");
    const url = mock.mock.calls[0][0] as URL;
    expect(url.searchParams.get("q")).toBe("bonjour & salut");
    expect(url.searchParams.get("langpair")).toBe("fr|en");
    expect(result).toEqual({
      primary: "hello",
      alternatives: ["hi", "greetings"],
    });
  });
  it("falls back to an aligned local dictionary when offline", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Offline")));
    expect(await translate("das Wasser", "de", "en")).toMatchObject({
      primary: "water",
      offline: true,
    });
  });
  it("reports unrecognized words and API quota errors without fabricating translations", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({
          ok: true,
          json: async () => ({ responseStatus: 429 }),
        }),
    );
    await expect(translate("unknown-test-word", "de", "en")).rejects.toThrow(
      "Translation unavailable",
    );
  });
  it("does not mask user cancellation with an offline result", async () => {
    const controller = new AbortController();
    controller.abort();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError")),
    );
    await expect(
      translate("das Wasser", "de", "en", controller.signal),
    ).rejects.toThrow("Aborted");
  });
});
