import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { Action } from "../types";
export function useSwipeGesture(
  onAction: (action: Action) => void,
  onTap: () => void,
  disabled: boolean,
) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const frame = useRef<number | null>(null);
  const pending = useRef({ x: 0, y: 0, active: false });
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const cancelFrame = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  useEffect(() => () => cancelFrame(), []);
  const finish = (e: PointerEvent<HTMLElement>, cancelled: boolean) => {
    if (!start.current || e.pointerId !== start.current.id) return;
    const x = e.clientX - start.current.x,
      y = e.clientY - start.current.y;
    start.current = null;
    cancelFrame();
    setDrag({ x: 0, y: 0, active: false });
    if (cancelled || disabled) return;
    if (y < -100 && Math.abs(y) > Math.abs(x)) onAction("master");
    else if (x > 100) onAction("know");
    else if (x < -100) onAction("repeat");
    else if (Math.abs(x) < 8 && Math.abs(y) < 8) onTap();
  };
  return {
    drag,
    handlers: {
      onPointerDown: (e: PointerEvent<HTMLElement>) => {
        if (
          disabled ||
          start.current !== null ||
          !e.isPrimary ||
          e.button !== 0 ||
          (e.target as HTMLElement).closest("button, a, input, textarea, select, summary, [contenteditable='true']")
        )
          return;
        start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag({ x: 0, y: 0, active: true });
      },
      onPointerMove: (e: PointerEvent<HTMLElement>) => {
        if (start.current?.id === e.pointerId) {
          pending.current = {
            x: e.clientX - start.current.x,
            y: e.clientY - start.current.y,
            active: true,
          };
          // Pointer events can arrive faster than the display refresh rate.
          if (frame.current === null) frame.current = requestAnimationFrame(() => {
            frame.current = null;
            setDrag(pending.current);
          });
        }
      },
      onPointerUp: (e: PointerEvent<HTMLElement>) => finish(e, false),
      onPointerCancel: (e: PointerEvent<HTMLElement>) => finish(e, true),
      onLostPointerCapture: (e: PointerEvent<HTMLElement>) => {
        if (start.current?.id !== e.pointerId) return;
        start.current = null;
        cancelFrame();
        setDrag({ x: 0, y: 0, active: false });
      },
    },
  };
}
