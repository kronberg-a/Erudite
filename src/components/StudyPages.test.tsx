// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { StudyPages } from "./StudyPages";
import { translator } from "../i18n/translations";
import { UiStateScope } from "../hooks/useUiState";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
let contentWidth: number;
beforeEach(() => {
  contentWidth = 948;
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) { return this.classList.contains("study-page-window") ? 300 : 0; });
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(200);
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (this: HTMLElement) { return this.classList.contains("study-page-flow") ? contentWidth : 300; });
  container = document.createElement("div"); document.body.append(container); root = createRoot(container);
  act(() => root.render(<StudyPages t={translator("en")}><p>Complete article context remains available across pages.</p></StudyPages>));
});
afterEach(() => { act(() => root.unmount()); container.remove(); vi.restoreAllMocks(); sessionStorage.clear(); });
const previous = () => container.querySelector<HTMLButtonElement>('[aria-label="Previous page"]')!;
const next = () => container.querySelector<HTMLButtonElement>('[aria-label="Next page"]')!;
it("paginates overflowing content horizontally and preserves all text", () => {
  expect(container.querySelector('.study-page-controls span')!.textContent).toBe("1 / 3");
  expect(previous().disabled).toBe(true);
  act(() => next().click());
  expect(container.querySelector('.study-page-window')!.scrollLeft).toBe(324);
  act(() => next().click());
  expect(next().disabled).toBe(true);
  expect(container.querySelector('.study-page-controls span')!.textContent).toBe("3 / 3");
  expect(container.querySelector('.study-page-flow')!.textContent).toContain("Complete article context");
  act(() => previous().click());
  expect(container.querySelector('.study-page-window')!.scrollLeft).toBe(324);
});
it("recalculates and clamps the page when content fits again", () => {
  act(() => next().click()); act(() => next().click());
  contentWidth = 300;
  act(() => window.dispatchEvent(new Event("resize")));
  expect(container.querySelector('.study-page-controls')!.getAttribute("data-paged")).toBe("false");
  expect(container.querySelector('.study-page-window')!.scrollLeft).toBe(0);
});
it("does not let page navigation keys reach study grading shortcuts", () => {
  const grade = vi.fn(); window.addEventListener("keydown", grade);
  act(() => next().dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
  expect(grade).not.toHaveBeenCalled();
  window.removeEventListener("keydown", grade);
});
it("restores the same content page after a refresh", () => {
  const render = () => <UiStateScope.Provider value="pair:en-de"><StudyPages t={translator("en")} persistenceKey="turn-1"><p>Long example.</p></StudyPages></UiStateScope.Provider>;
  act(() => root.render(render()));
  act(() => next().click());
  act(() => root.unmount()); root = createRoot(container);
  act(() => root.render(render()));
  expect(container.querySelector('.study-page-controls span')!.textContent).toBe("2 / 3");
  expect(container.querySelector('.study-page-window')!.scrollLeft).toBe(324);
});
