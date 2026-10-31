// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useKeyboardViewport } from "./useKeyboardViewport";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let host: HTMLDivElement;
let pane: HTMLDivElement;
let field: HTMLInputElement;
let viewport: EventTarget & { height: number; offsetTop: number; scale: number };
const frame = () => act(() => vi.advanceTimersToNextFrame());
const keyboard = (height: number, offsetTop = 0) => {
  viewport.height = height; viewport.offsetTop = offsetTop;
  viewport.dispatchEvent(new Event("resize")); frame();
};
beforeEach(() => {
  vi.useFakeTimers();
  viewport = Object.assign(new EventTarget(), { height: 844, offsetTop: 0, scale: 1 });
  vi.stubGlobal("visualViewport", viewport);
  vi.stubGlobal("innerWidth", 390); vi.stubGlobal("innerHeight", 844);
  host = document.createElement("div"); document.body.append(host);
  root = createRoot(host);
  function Harness() {
    useKeyboardViewport();
    return <div className="word-form-fields" style={{ overflowY: "auto" }}><input defaultValue="Haus" /><textarea defaultValue="A longer example" /></div>;
  }
  act(() => root.render(<Harness />));
  pane = host.querySelector("div")!; field = host.querySelector("input")!;
  Object.defineProperties(pane, { clientHeight: { get: () => viewport.height - 100 }, scrollHeight: { value: 1000 } });
  vi.spyOn(pane, "getBoundingClientRect").mockImplementation(() => new DOMRect(0, viewport.offsetTop + 16, 390, viewport.height - 100));
  vi.spyOn(field, "getBoundingClientRect").mockImplementation(() => new DOMRect(20, 500 - pane.scrollTop, 340, 48));
});
afterEach(() => {
  act(() => root.unmount()); host.remove();
  vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers();
});
it("moves a covered field into its own pane when an overlay keyboard shrinks the visible viewport", () => {
  field.focus(); frame();
  field.setSelectionRange(2, 2);
  expect(pane.scrollTop).toBe(0);
  keyboard(320, 12);
  expect(document.documentElement.style.getPropertyValue("--visible-viewport-height")).toBe("320px");
  expect(document.documentElement.style.getPropertyValue("--visible-viewport-top")).toBe("12px");
  expect(document.documentElement.style.getPropertyValue("--keyboard-inset")).toBe("512px");
  expect(document.documentElement.dataset.keyboardOpen).toBe("true");
  expect(pane.scrollTop).toBe(312);
  expect(field.getBoundingClientRect().bottom).toBeLessThanOrEqual(pane.getBoundingClientRect().bottom - 12);
  expect(document.documentElement.scrollTop).toBe(0);
  expect(document.activeElement).toBe(field);
  expect(field.value).toBe("Haus");
  expect(field.selectionStart).toBe(2);
});
it("reveals another field when focus moves while the keyboard is already open", () => {
  field.focus(); frame(); keyboard(320);
  const next = host.querySelector("textarea")!;
  vi.spyOn(next, "getBoundingClientRect").mockImplementation(() => new DOMRect(20, 700 - pane.scrollTop, 340, 64));
  next.focus(); frame();
  expect(document.activeElement).toBe(next);
  expect(next.getBoundingClientRect().bottom).toBeLessThanOrEqual(pane.getBoundingClientRect().bottom - 12);
  expect(next.value).toBe("A longer example");
});
it("recognizes the keyboard when both the layout and visual viewports resize", () => {
  field.focus(); frame();
  vi.stubGlobal("innerHeight", 320);
  keyboard(320);
  expect(document.documentElement.dataset.keyboardOpen).toBe("true");
  expect(document.documentElement.style.getPropertyValue("--keyboard-inset")).toBe("0px");
  vi.stubGlobal("innerHeight", 844);
  keyboard(844);
  expect(document.documentElement.dataset.keyboardOpen).toBe("false");
});
it("restores normal navigation after the keyboard closes without changing the entered word", () => {
  field.focus(); frame(); keyboard(320);
  field.blur(); frame();
  expect(document.documentElement.dataset.keyboardOpen).toBe("true");
  keyboard(844);
  expect(document.documentElement.dataset.keyboardOpen).toBe("false");
  expect(document.documentElement.style.getPropertyValue("--keyboard-inset")).toBe("0px");
  expect(field.value).toBe("Haus");
});
it("does not re-scroll a field that is already visible", () => {
  field.focus(); frame(); keyboard(320);
  const position = pane.scrollTop;
  viewport.dispatchEvent(new Event("scroll")); frame();
  expect(pane.scrollTop).toBe(position);
});
it("does not fight intentional pinch zoom", () => {
  field.focus(); frame(); viewport.scale = 1.5; keyboard(320);
  expect(pane.scrollTop).toBe(0);
});
it("releases mobile viewport overrides on desktop and cleans up scheduled updates", () => {
  field.focus(); frame(); keyboard(320);
  vi.stubGlobal("innerWidth", 1200);
  window.dispatchEvent(new Event("resize")); frame();
  expect(document.documentElement.style.getPropertyValue("--visible-viewport-height")).toBe("");
  expect(document.documentElement.hasAttribute("data-keyboard-open")).toBe(false);
  const cancel = vi.spyOn(window, "cancelAnimationFrame");
  viewport.dispatchEvent(new Event("resize"));
  act(() => root.render(null));
  expect(cancel).toHaveBeenCalled();
  viewport.dispatchEvent(new Event("resize")); frame();
  expect(document.documentElement.hasAttribute("data-keyboard-open")).toBe(false);
});
