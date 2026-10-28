import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { Action } from "../types";
export function useSwipeGesture(
  onAction: (action: Action) => void,
  onTap: () => void,
  disabled: boolean,
) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const finish = (e: PointerEvent<HTMLElement>, cancelled: boolean) => {
    if (!start.current || e.pointerId !== start.current.id) return;
    const x = e.clientX - start.current.x,
      y = e.clientY - start.current.y;
    start.current = null;
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
          !e.isPrimary ||
          e.button !== 0 ||
          (e.target as HTMLElement).closest("button")
        )
          return;
        start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag({ x: 0, y: 0, active: true });
      },
      onPointerMove: (e: PointerEvent<HTMLElement>) => {
        if (start.current?.id === e.pointerId)
          setDrag({
            x: e.clientX - start.current.x,
            y: e.clientY - start.current.y,
            active: true,
          });
      },
      onPointerUp: (e: PointerEvent<HTMLElement>) => finish(e, false),
      onPointerCancel: (e: PointerEvent<HTMLElement>) => finish(e, true),
      onLostPointerCapture: () => {
        start.current = null;
        setDrag({ x: 0, y: 0, active: false });
      },
    },
  };
}
