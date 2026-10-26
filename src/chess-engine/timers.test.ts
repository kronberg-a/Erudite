import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import { afterEach, expect, it, vi } from "vitest";

afterEach(() => vi.useRealTimers());
it("freezes pending moves and resumes each once after its remaining delay", () => {
  vi.useFakeTimers();
  const callback = vi.fn();
  const context = createContext({ setTimeout, clearTimeout, performance: { now: () => Date.now() }, callback });
  context.window = context;
  runInContext(readFileSync("src/chess-engine/timers.js", "utf8"), context);
  runInContext("eruditeSetTimersActive(true); setTimeout(callback, 1000)", context);
  vi.advanceTimersByTime(400);
  runInContext("eruditeSetTimersActive(false)", context);
  vi.advanceTimersByTime(5000);
  expect(callback).not.toHaveBeenCalled();
  runInContext("eruditeSetTimersActive(true)", context);
  vi.advanceTimersByTime(599);
  expect(callback).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(callback).toHaveBeenCalledTimes(1);
  runInContext("eruditeSetTimersActive(false); eruditeSetTimersActive(true)", context);
  vi.advanceTimersByTime(5000);
  expect(callback).toHaveBeenCalledTimes(1);
});
it("can cancel a move while paused and defers callbacks queued while hidden", () => {
  vi.useFakeTimers();
  const callback = vi.fn();
  const context = createContext({ setTimeout, clearTimeout, performance: { now: () => Date.now() }, callback });
  context.window = context;
  runInContext(readFileSync("src/chess-engine/timers.js", "utf8"), context);
  runInContext("const id = setTimeout(callback, 10); clearTimeout(id); setTimeout(callback, 50)", context);
  vi.advanceTimersByTime(100);
  expect(callback).not.toHaveBeenCalled();
  runInContext("eruditeSetTimersActive(true)", context);
  vi.advanceTimersByTime(50);
  expect(callback).toHaveBeenCalledTimes(1);
});
