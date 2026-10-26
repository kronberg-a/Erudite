// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

vi.mock("./components/chess/ChessView", () => ({
  ChessView: ({ active, theme }: { active: boolean; theme: string }) =>
    <div hidden={!active} data-chess-theme={theme}>Chess workspace</div>,
}));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});
function click(text: string) {
  const button = [...container.querySelectorAll("button")].find(b => b.textContent?.trim() === text);
  if (!button) throw new Error(`Missing button: ${text}`);
  act(() => button.click());
}
it("preserves the study session and ignores study shortcuts while Chess is active", async () => {
  const { default: App } = await import("./App");
  act(() => root.render(<App />));
  click("Start practice");
  const main = container.querySelector("main")!;
  const session = main.textContent;
  const data = localStorage.getItem("erudite:v2");
  click("Chess");
  expect(main.hidden).toBe(true);
  expect(localStorage.getItem("erudite_active_app_mode")).toBe("chess");
  act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" })));
  expect(localStorage.getItem("erudite:v2")).toBe(data);
  click("Words");
  expect(container.querySelector("main")).toBe(main);
  expect(main.hidden).toBe(false);
  expect(main.textContent).toBe(session);
  expect(container.querySelector("[data-chess-theme]")).not.toBeNull();
});
it("restores Chess mode and passes the shared theme to its workspace", async () => {
  localStorage.setItem("erudite_active_app_mode", "chess");
  const { default: App } = await import("./App");
  act(() => root.render(<App />));
  expect(container.querySelector("main")!.hidden).toBe(true);
  const themeButton = container.querySelector<HTMLButtonElement>('button[aria-label="Dark"]')!;
  act(() => themeButton.click());
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  expect(container.querySelector("[data-chess-theme]")?.getAttribute("data-chess-theme")).toBe("dark");
});
