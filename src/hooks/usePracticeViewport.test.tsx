// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { usePracticeViewport } from "./usePracticeViewport";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
afterEach(() => vi.unstubAllGlobals());
it("fits the visual viewport when the keyboard opens and restores styles on exit", () => {
  const viewport = Object.assign(new EventTarget(), { height: 700, offsetTop: 0 });
  vi.stubGlobal("visualViewport", viewport);
  document.documentElement.style.setProperty("--practice-height", "90dvh");
  const container = document.createElement("div"); document.body.append(container);
  const root = createRoot(container);
  function Harness({ active }: { active: boolean }) { return <span data-keyboard={usePracticeViewport(active)} />; }
  act(() => root.render(<Harness active />));
  expect(document.documentElement.style.getPropertyValue("--practice-height")).toBe("700px");
  act(() => { viewport.height = 300; viewport.offsetTop = 12; viewport.dispatchEvent(new Event("resize")); });
  expect(container.querySelector('span')!.getAttribute("data-keyboard")).toBe("true");
  expect(document.documentElement.style.getPropertyValue("--practice-height")).toBe("300px");
  expect(document.documentElement.style.getPropertyValue("--practice-top")).toBe("12px");
  act(() => root.render(<Harness active={false} />));
  expect(document.documentElement.style.getPropertyValue("--practice-height")).toBe("90dvh");
  expect(container.querySelector('span')!.getAttribute("data-keyboard")).toBe("false");
  act(() => root.unmount()); container.remove(); document.documentElement.style.removeProperty("--practice-height");
});
