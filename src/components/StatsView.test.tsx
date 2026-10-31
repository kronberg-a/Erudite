// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { StatsView } from "./StatsView";
import { translator } from "../i18n/translations";
import { defaultSettings } from "../services/storage";
import { languages, type PairData } from "../types";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  vi.useFakeTimers();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});
function render(pair: PairData, language = defaultSettings.interfaceLanguage) {
  act(() =>
    root.render(
      <StatsView
        pair={pair}
        data={{
          version: 3,
          reviewOrder: 0,
          settings: defaultSettings,
          pairs: { "en-de": pair },
        }}
        settings={{ ...defaultSettings, interfaceLanguage: language }}
        t={translator(language)}
      />,
    ),
  );
}
it("renders neutral empty analytics with no practice action", () => {
  render({ words: [], categories: [] });
  expect(container.textContent).toContain(
    translator("en")("activityHistory"),
  );
  expect(container.textContent).not.toMatch(/NaN|Infinity|undefined/);
  expect(container.querySelectorAll('[role="listitem"]')).toHaveLength(84);
  expect(container.querySelectorAll(".activity-level-0")).toHaveLength(84);
  expect(container.querySelector("button")).toBeNull();
});
it("renders translated dashboard labels in all supported interfaces", () => {
  for (const language of languages) {
    render({ words: [], categories: [] }, language);
    expect(container.querySelector("h1")?.textContent).toBe(
      translator(language)("statsTitle"),
    );
    expect(container.textContent).toContain(
      translator(language)("activityHistory"),
    );
    expect(container.textContent).not.toMatch(/undefined|NaN/);
  }
});
