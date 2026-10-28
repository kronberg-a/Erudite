// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { defaultSettings } from "./services/storage";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
const pastedKey = "pasted-test-key";

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  localStorage.setItem("erudite:v3", JSON.stringify({
    version: 3, reviewOrder: 0, settings: defaultSettings,
    pairs: { "en-de": { words: [], categories: [] } },
  }));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  localStorage.clear();
  vi.unstubAllGlobals();
});

async function openSettings() {
  const { default: App } = await import("./App");
  await act(async () => root.render(<App />));
  const settings = Array.from(container.querySelectorAll("button"))
    .find((button) => button.textContent?.trim() === "Settings");
  expect(settings).toBeDefined();
  act(() => settings!.click());
  const input = container.querySelector<HTMLInputElement>("#gemini-api-key");
  expect(input).not.toBeNull();
  return input!;
}

function pasteKey(input: HTMLInputElement, value: string) {
  act(() => {
    input.focus();
    const paste = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(paste, "clipboardData", { value: { getData: () => value } });
    input.dispatchEvent(paste);
    // jsdom does not perform the browser's default clipboard insertion.
    if (!paste.defaultPrevented) {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
      input.dispatchEvent(new InputEvent("input", {
        bubbles: true, inputType: "insertFromPaste", data: value,
      }));
    }
  });
}

it.each(["file:", "https:"])("persists a pasted key and uses it for an accepted Gemini request after reload (%s)", async (protocol) => {
  vi.stubGlobal("location", { protocol });
  const translation = { translation: "Hello", alternatives: ["Hi"] };
  const fetchMock = vi.fn().mockImplementation(async (_url, init) => {
    if (init?.method !== "POST") return { ok: true, json: async () => ({ configured: false }) };
    return { ok: true, json: async () => protocol === "file:" ? {
      candidates: [{ finishReason: "STOP", content: { parts: [{ text: JSON.stringify(translation) }] } }],
    } : translation };
  });
  vi.stubGlobal("fetch", fetchMock);

  const input = await openSettings();
  expect(input.value).toBe("");
  pasteKey(input, `  ${pastedKey}  `);
  expect(input.value).toBe(pastedKey);
  expect(input.type).toBe("password");
  expect(JSON.parse(localStorage.getItem("erudite:v3")!).settings.geminiApiKey).toBe(pastedKey);

  // Reload the application modules as well as the UI so no in-memory key can
  // accidentally hide a broken persistence/hydration path.
  act(() => root.unmount());
  vi.resetModules();
  root = createRoot(container);
  expect((await openSettings()).value).toBe(pastedKey);

  const { translateWithGemini } = await import("./services/gemini");
  await act(async () => {
    expect(await translateWithGemini("Hallo", "de", "en")).toEqual({ primary: "Hello", alternatives: ["Hi"] });
  });
  expect(container.querySelector("[data-connection]")!.textContent).toBe("Connected");
  const posts = fetchMock.mock.calls.filter((call) => call[1]?.method === "POST");
  expect(posts).toHaveLength(1);
  const [url, request] = posts[0];
  const header = protocol === "file:" ? "x-goog-api-key" : "x-gemini-api-key";
  expect(request.headers[header]).toBe(pastedKey);
  expect(String(url)).not.toContain(pastedKey);
  expect(String(url)).toBe(protocol === "file:"
    ? "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent"
    : "/api/gemini");
});

it("does not treat a pasted key rejected by Gemini as an accepted response", async () => {
  vi.stubGlobal("location", { protocol: "file:" });
  const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 403 });
  vi.stubGlobal("fetch", fetchMock);
  pasteKey(await openSettings(), pastedKey);
  const { translateWithGemini } = await import("./services/gemini");
  await act(async () => {
    expect(await translateWithGemini("Hallo", "de", "en")).toBeUndefined();
  });
  expect(container.querySelector("[data-connection]")!.textContent).toBe("Key rejected or access denied");
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0][1].headers["x-goog-api-key"]).toBe(pastedKey);
});
it("keeps a saved key usable after an HTTP 200 CEFR response cannot be processed", async () => {
  vi.stubGlobal("location", { protocol: "file:" });
  const payload = (value: unknown) => ({ ok: true, json: async () => ({ candidates: [{ finishReason: "STOP", content: { parts: [{ text: JSON.stringify(value) }] } }] }) });
  const fetchMock = vi.fn().mockResolvedValueOnce(payload({ tokens: [{ id: 99, level: "C2" }] }))
    .mockResolvedValueOnce(payload({ translation: "Hello", alternatives: [] }));
  vi.stubGlobal("fetch", fetchMock);
  pasteKey(await openSettings(), pastedKey);
  const { analyzeCefrWithGemini, translateWithGemini } = await import("./services/gemini");
  await act(async () => {
    await expect(analyzeCefrWithGemini("Hallo", "de")).rejects.toMatchObject({ kind: "response" });
  });
  expect(container.querySelector("[data-connection]")!.textContent).toContain("Gemini responded");
  expect(container.querySelector<HTMLInputElement>("#gemini-api-key")!.value).toBe(pastedKey);
  expect(JSON.parse(localStorage.getItem("erudite:v3")!).settings.geminiApiKey).toBe(pastedKey);
  await act(async () => {
    expect(await translateWithGemini("Hallo", "de", "en")).toEqual({ primary: "Hello", alternatives: [] });
  });
  expect(container.querySelector("[data-connection]")!.textContent).toBe("Connected");
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
