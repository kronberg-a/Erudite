import { useEffect } from "react";
import type { Action } from "../types";
export function useKeyboard(
  action: (a: Action) => void,
  reveal: () => void,
  undo: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        !enabled ||
        e.repeat ||
        e.altKey ||
        (e.target instanceof HTMLElement &&
          e.target.closest(
            'input, textarea, select, [contenteditable="true"], [role="dialog"]',
          ))
      )
        return;
      if (
        e.key === "Backspace" ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey)
      ) {
        e.preventDefault();
        undo();
        return;
      }
      if (e.ctrlKey || e.metaKey) return;
      const actions: Record<string, Action> = {
        ArrowLeft: "repeat",
        ArrowRight: "know",
      };
      if (actions[e.key]) {
        e.preventDefault();
        action(actions[e.key]);
      }
      if (
        (e.code === "Space" || e.key === "Enter") &&
        !(e.target instanceof HTMLElement && e.target.closest("button"))
      ) {
        e.preventDefault();
        reveal();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [action, reveal, undo, enabled]);
}
