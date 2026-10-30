import { useLayoutEffect, useState } from "react";

export function usePracticeViewport(active: boolean): boolean {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useLayoutEffect(() => {
    if (!active) return;
    const viewport = window.visualViewport;
    const root = document.documentElement;
    const previousHeight = root.style.getPropertyValue("--practice-height");
    const previousTop = root.style.getPropertyValue("--practice-top");
    const update = () => {
      root.style.setProperty("--practice-height", `${viewport?.height ?? window.innerHeight}px`);
      root.style.setProperty("--practice-top", `${viewport?.offsetTop ?? 0}px`);
      setKeyboardOpen(!!viewport && window.innerHeight - viewport.height > 140);
    };
    update();
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      viewport?.removeEventListener("resize", update); viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (previousHeight) root.style.setProperty("--practice-height", previousHeight); else root.style.removeProperty("--practice-height");
      if (previousTop) root.style.setProperty("--practice-top", previousTop); else root.style.removeProperty("--practice-top");
    };
  }, [active]);
  return active && keyboardOpen;
}
