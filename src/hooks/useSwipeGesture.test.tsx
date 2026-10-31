// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useSwipeGesture } from "./useSwipeGesture";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
let card: HTMLElement;
let frames: Map<number, FrameRequestCallback>;
let frameId: number;
const action = vi.fn();
const tap = vi.fn();
function Harness() {
  const { drag, handlers } = useSwipeGesture(action, tap, false);
  return <article {...handlers} data-x={drag.x} data-active={drag.active}><button>Audio</button></article>;
}
function pointer(type: string, x: number, y = 0, target = card) {
  act(() => target.dispatchEvent(Object.assign(new Event(type, { bubbles: true }), {
    pointerId: 1, isPrimary: true, button: 0, clientX: x, clientY: y,
  })));
}
function paint() {
  const callbacks = [...frames.values()];
  frames.clear();
  act(() => callbacks.forEach((callback) => callback(0)));
}
beforeEach(() => {
  frames = new Map(); frameId = 0; action.mockClear(); tap.mockClear();
  vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
    frames.set(++frameId, callback); return frameId;
  }));
  vi.stubGlobal("cancelAnimationFrame", vi.fn((id: number) => frames.delete(id)));
  container = document.createElement("div"); document.body.append(container);
  root = createRoot(container);
  act(() => root.render(<Harness />));
  card = container.querySelector("article")!;
  card.setPointerCapture = vi.fn();
});
afterEach(() => { act(() => root.unmount()); container.remove(); vi.unstubAllGlobals(); });

it("coalesces rapid pointer moves into one display update with the latest coordinates", () => {
  pointer("pointerdown", 0);
  pointer("pointermove", 20); pointer("pointermove", 60); pointer("pointermove", 90);
  expect(frames.size).toBe(1);
  expect(card.dataset.x).toBe("0");
  paint();
  expect(card.dataset.x).toBe("90");
  expect(action).not.toHaveBeenCalled();
});
it("grades from release coordinates even before the pending frame paints", () => {
  pointer("pointerdown", 0); pointer("pointermove", 40); pointer("pointerup", 120);
  expect(action).toHaveBeenCalledExactlyOnceWith("know");
  expect(frames.size).toBe(0);
  expect(card.dataset.active).toBe("false");
  paint();
  expect(card.dataset.x).toBe("0");
});
it("cancels pending movement without grading or revealing", () => {
  pointer("pointerdown", 0); pointer("pointermove", -150); pointer("pointercancel", -150);
  expect(frames.size).toBe(0);
  expect(action).not.toHaveBeenCalled(); expect(tap).not.toHaveBeenCalled();
});
it("does not capture presses on interactive card controls", () => {
  pointer("pointerdown", 0, 0, card.querySelector("button")!);
  expect(card.setPointerCapture).not.toHaveBeenCalled();
  pointer("pointerup", 0);
  expect(tap).not.toHaveBeenCalled();
});
it("discards a queued frame when the card unmounts", () => {
  pointer("pointerdown", 0); pointer("pointermove", 80);
  act(() => root.render(null));
  expect(frames.size).toBe(0);
});
