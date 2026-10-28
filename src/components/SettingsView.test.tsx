// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { SettingsView } from "./SettingsView";
import { defaultSettings } from "../services/storage";
import { translator } from "../i18n/translations";
import { languages } from "../types";
import { configureGemini, translateWithGemini } from "../services/gemini";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
afterEach(() => { configureGemini(); vi.unstubAllGlobals(); });

it("provides a localized masked optional key and allows clearing it", () => {
  const container = document.createElement("div"); document.body.append(container);
  const root = createRoot(container);
  const changeSettings = vi.fn();
  const data = { version: 3 as const, reviewOrder: 0, settings: { ...defaultSettings, geminiApiKey: "stored-test-key" }, pairs: {} };
  try {
    for (const language of languages) {
      act(() => root.render(<SettingsView data={data} changeSettings={changeSettings} restore={vi.fn()} t={translator(language)} />));
      const input = container.querySelector<HTMLInputElement>("#gemini-api-key")!;
      expect(input.type).toBe("password");
      expect(input.value).toBe("stored-test-key");
      expect(input.labels?.[0].textContent).toBe(translator(language)("geminiApiKey"));
    }
    const input = container.querySelector<HTMLInputElement>("#gemini-api-key")!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(changeSettings).toHaveBeenCalledWith({ geminiApiKey: undefined });
  } finally { act(() => root.unmount()); container.remove(); }
});

function connectionFixture(key: string | undefined = "connection-test-key") {
  const container = document.createElement("div"); document.body.append(container);
  const root = createRoot(container);
  const render = (geminiApiKey = key) => act(() => root.render(<SettingsView
    data={{ version: 3, reviewOrder: 0, settings: { ...defaultSettings, geminiApiKey }, pairs: {} }}
    changeSettings={vi.fn()} restore={vi.fn()} t={translator("en")} />));
  render();
  return {
    container, render,
    status: () => container.querySelector<HTMLElement>("[data-connection]")!,
    button: () => Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Test connection")!,
    close: () => { act(() => root.unmount()); container.remove(); },
  };
}

it("shows a pending connection check, confirms a live success and always retests without using cache", async () => {
  let finish!: (value: unknown) => void;
  const success = { ok: true, json: async () => ({ translation: "Hallo", alternatives: [] }) };
  const fetchMock = vi.fn().mockReturnValueOnce(new Promise((resolve) => { finish = resolve; })).mockResolvedValue(success);
  vi.stubGlobal("fetch", fetchMock);
  const view = connectionFixture();
  try {
    expect(view.status().textContent).toBe("Not tested yet");
    act(() => view.button().click());
    expect(view.status().textContent).toBe("Checking connection…");
    expect(view.button().disabled).toBe(true);
    await act(async () => finish(success));
    expect(view.status().textContent).toBe("Connected");
    expect(view.button().disabled).toBe(false);
    await act(async () => view.button().click());
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1].headers["x-gemini-api-key"]).toBe("connection-test-key");
  } finally { view.close(); }
});

it.each([
  [401, "Key rejected or access denied"], [403, "Key rejected or access denied"],
  [429, "Quota exceeded — using fallback"], [502, "Unavailable — using fallback"],
])("reports connection error %s and allows an immediate retry", async (status, message) => {
  const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false, status })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ translation: "Hallo", alternatives: [] }) });
  vi.stubGlobal("fetch", fetchMock);
  const view = connectionFixture();
  try {
    await act(async () => view.button().click());
    expect(view.status().textContent).toBe(message);
    await act(async () => view.button().click());
    expect(view.status().textContent).toBe("Connected");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  } finally { view.close(); }
});

it("discards a connection result when the key changes during the check", async () => {
  let finish!: (value: unknown) => void;
  const fetchMock = vi.fn().mockReturnValue(new Promise((resolve) => { finish = resolve; }));
  vi.stubGlobal("fetch", fetchMock);
  const view = connectionFixture();
  try {
    act(() => view.button().click());
    view.render("replacement-key");
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
    await act(async () => finish({ ok: true, json: async () => ({ translation: "Hallo", alternatives: [] }) }));
    expect(view.status().textContent).toBe("Not tested yet");
  } finally { view.close(); }
});

it("identifies a model 404 in standalone mode instead of reporting a generic outage", async () => {
  vi.stubGlobal("location", { protocol: "file:" });
  const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 404 });
  vi.stubGlobal("fetch", fetchMock);
  const view = connectionFixture();
  try {
    await act(async () => view.button().click());
    expect(view.status().dataset.connection).toBe("model_error");
    expect(view.status().textContent).toBe("Model or endpoint unavailable — update the app or check model access");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain("gemini-3.5-flash-lite:generateContent");
  } finally { view.close(); }
});

it("also updates the indicator after an ordinary translation request", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ translation: "Hallo", alternatives: [] }) }));
  const view = connectionFixture();
  try {
    await act(async () => { await translateWithGemini("Hello there", "en", "de"); });
    expect(view.status().textContent).toBe("Connected");
  } finally { view.close(); }
});

it("reports missing standalone configuration without sending a request", async () => {
  vi.stubGlobal("location", { protocol: "file:" });
  const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
  const view = connectionFixture("");
  try {
    expect(view.status().textContent).toBe("Not configured");
    await act(async () => view.button().click());
    expect(view.status().textContent).toBe("Not configured");
    expect(fetchMock).not.toHaveBeenCalled();
  } finally { view.close(); }
});

it("tests the server connection when the personal key is blank", async () => {
  const fetchMock = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ configured: true }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ translation: "Hallo", alternatives: [] }) });
  vi.stubGlobal("fetch", fetchMock);
  const view = connectionFixture("");
  try {
    await act(async () => view.button().click());
    expect(view.status().textContent).toBe("Connected");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1].headers).not.toHaveProperty("x-gemini-api-key");
  } finally { view.close(); }
});
it.each([
  [502, "INVALID_MODEL_RESPONSE", "Gemini responded — analysis could not be processed"],
  [504, "UPSTREAM_TIMEOUT", "Request timed out — retry available"],
])("distinguishes analysis issues from a disconnected key: %s", async (status, code, message) => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status, json: async () => ({ code }) }));
  const view = connectionFixture();
  try {
    await act(async () => view.button().click());
    expect(view.status().textContent).toBe(message);
    expect(view.status().textContent).not.toContain("Unavailable");
    expect(view.container.querySelector<HTMLInputElement>("#gemini-api-key")!.value).toBe("connection-test-key");
  } finally { view.close(); }
});
