import { afterEach, describe, expect, it, vi } from "vitest";
import { translate } from "./translator";
afterEach(() => vi.unstubAllGlobals());
describe("translation service", () => {
  it("queries Google gtx with neural + dictionary params, decodes entities, and deduplicates alternatives", async () => {
    const mock = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          sentences: [
            { trans: "<b>Hello</b>" },
          ],
          dict: [
            {
              pos: "interjection",
              terms: ["hello", "hi", "hi", "<i>greetings &amp; salutations</i>", "l&#39;accueil"],
              entry: [{ word: "hello" }, { word: "welcome" }],
            },
          ],
        }),
      });
    vi.stubGlobal("fetch", mock);
    const result = await translate("bonjour & salut", "fr", "en");
    const url = mock.mock.calls[0][0] as URL;
    expect(url.origin + url.pathname).toBe("https://translate.googleapis.com/translate_a/single");
    expect(url.searchParams.get("client")).toBe("gtx");
    expect(url.searchParams.get("sl")).toBe("fr");
    expect(url.searchParams.get("tl")).toBe("en");
    expect(url.searchParams.getAll("dt")).toEqual(["t", "bd"]);
    expect(url.searchParams.get("dj")).toBe("1");
    expect(url.searchParams.get("q")).toBe("bonjour & salut");
    expect(result).toEqual({
      primary: "hello",
      alternatives: ["hi", "greetings & salutations", "l'accueil", "welcome"],
    });
  });
  it("joins multi-sentence neural translations accurately", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          sentences: [
            { trans: "Hello World. " },
            { trans: "How are you?" },
          ],
        }),
      }),
    );
    expect(await translate("Hallo Welt. Wie geht es dir?", "de", "en")).toEqual({
      primary: "Hello World. How are you?",
      alternatives: [],
    });
  });
  it("falls back to an aligned local dictionary when offline (with or without leading articles)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Offline")));
    expect(await translate("das Wasser", "de", "en")).toMatchObject({
      primary: "water",
      offline: true,
    });
    expect(await translate("Wasser", "de", "en")).toMatchObject({
      primary: "water",
      offline: true,
    });
  });
  it("reports unrecognized words and HTTP errors without fabricating translations", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
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
