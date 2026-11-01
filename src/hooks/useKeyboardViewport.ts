import { useLayoutEffect } from "react";

const viewportProperties = ["--visible-viewport-height", "--visible-viewport-top", "--keyboard-inset"] as const;
function isTextEntry(element: Element | null): element is HTMLElement {
  return element instanceof HTMLTextAreaElement ||
    (element instanceof HTMLInputElement && !["checkbox", "radio", "button", "submit", "reset", "range", "color", "file", "hidden"].includes(element.type)) ||
    (element instanceof HTMLElement && element.isContentEditable);
}

/** Keep mobile forms inside the keyboard-adjusted viewport, including dialogs
 * in the top layer. Scroll only the field's own pane, not the page behind it. */
export function useKeyboardViewport() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;
    const previous = viewportProperties.map((property) => root.style.getPropertyValue(property));
    const previousKeyboard = root.getAttribute("data-keyboard-open");
    let frame: number | null = null;
    let owned = false;
    let baselineHeight = Math.max(window.innerHeight, viewport?.height ?? 0);
    let lastWidth = window.innerWidth;
    let keyboardOpen = false;
    const restore = () => {
      if (!owned) return;
      viewportProperties.forEach((property, index) => {
        if (previous[index]) root.style.setProperty(property, previous[index]);
        else root.style.removeProperty(property);
      });
      if (previousKeyboard === null) root.removeAttribute("data-keyboard-open");
      else root.setAttribute("data-keyboard-open", previousKeyboard);
      owned = false;
    };
    const reveal = (field: HTMLElement, top: number, height: number) => {
      if (viewport && viewport.scale !== 1) return; // Do not fight intentional zoom/panning.
      for (let pane = field.parentElement; pane && pane !== document.body; pane = pane.parentElement) {
        if (!/(auto|scroll)/u.test(getComputedStyle(pane).overflowY) || pane.scrollHeight <= pane.clientHeight) continue;
        const box = pane.getBoundingClientRect();
        let bounds = field.getBoundingClientRect();
        const visibleTop = Math.max(top + 12, box.top + 12);
        const visibleBottom = Math.min(top + height - 12, box.bottom - 12);
        if (visibleBottom <= visibleTop) return;
        // Related word/translation inputs should remain visible together when
        // the available pane can fit the group. Tiny viewports still prioritize
        // the focused field instead of scrolling it out of view.
        const group = field.closest<HTMLElement>("[data-keyboard-group]");
        if (group && pane.contains(group)) {
          const groupBounds = group.getBoundingClientRect();
          if (groupBounds.height > 0 && groupBounds.height <= visibleBottom - visibleTop) bounds = groupBounds;
        }
        if (bounds.top < visibleTop || bounds.height > visibleBottom - visibleTop) pane.scrollTop += bounds.top - visibleTop;
        else if (bounds.bottom > visibleBottom) pane.scrollTop += bounds.bottom - visibleBottom;
        return;
      }
    };
    const update = () => {
      frame = null;
      if (window.innerWidth >= 768) {
        keyboardOpen = false;
        baselineHeight = Math.max(window.innerHeight, viewport?.height ?? 0);
        lastWidth = window.innerWidth;
        restore();
        return;
      }
      const height = viewport?.height ?? window.innerHeight;
      const top = viewport?.offsetTop ?? 0;
      if (height <= 0) return;
      const field = document.activeElement;
      const editing = isTextEntry(field);
      const fullHeight = Math.max(window.innerHeight, height);
      if (window.innerWidth !== lastWidth) {
        baselineHeight = fullHeight;
        lastWidth = window.innerWidth;
        keyboardOpen = false;
      } else if (!editing && !keyboardOpen) baselineHeight = fullHeight;
      else baselineHeight = Math.max(baselineHeight, fullHeight);
      keyboardOpen = (editing || keyboardOpen) && baselineHeight - height > 120;
      owned = true;
      root.style.setProperty("--visible-viewport-height", `${height}px`);
      root.style.setProperty("--visible-viewport-top", `${top}px`);
      root.style.setProperty("--keyboard-inset", `${Math.max(0, window.innerHeight - top - height)}px`);
      root.setAttribute("data-keyboard-open", String(keyboardOpen));
      if (editing) reveal(field, top, height);
    };
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    viewport?.addEventListener("resize", schedule);
    viewport?.addEventListener("scroll", schedule);
    window.addEventListener("resize", schedule);
    document.addEventListener("focusin", schedule);
    document.addEventListener("focusout", schedule);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", schedule);
      viewport?.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("focusin", schedule);
      document.removeEventListener("focusout", schedule);
      restore();
    };
  }, []);
}
