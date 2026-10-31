import { useId, useLayoutEffect, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, Copy, FolderInput, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react";
import type { T } from "../i18n/translations";

export type WordAction = "reset" | "practice" | "delete" | "edit" | "move" | "copy";

export function WordActionsMenu({ word, t, onAction }: {
  word: string; t: T; onAction: (action: WordAction) => void;
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const items = [
    { action: "reset", label: "reset", icon: RotateCcw },
    { action: "practice", label: "addToPractice", icon: BookOpen },
    { action: "edit", label: "edit", icon: Pencil },
    { action: "move", label: "moveWord", icon: FolderInput },
    { action: "copy", label: "copyWord", icon: Copy },
    { action: "delete", label: "deleteWord", icon: Trash2 },
  ] as const;
  useLayoutEffect(() => {
    if (!open || !trigger.current || !menu.current) return;
    const anchor = trigger.current.getBoundingClientRect();
    const box = menu.current.getBoundingClientRect();
    setPosition({
      left: Math.max(12, Math.min(anchor.right - box.width, window.innerWidth - box.width - 12)),
      top: Math.max(12, anchor.bottom + box.height + 8 <= window.innerHeight ? anchor.bottom + 6 : anchor.top - box.height - 6),
    });
    menu.current.querySelector<HTMLButtonElement>("button")?.focus();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) setOpen(false);
    };
    const close = (event: Event) => {
      if (!(event.target instanceof Node) || !menu.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);
  return <>
    <button ref={trigger} type="button" className="icon-button word-menu-trigger"
      aria-label={`${t("wordActions")}: ${word}`} title={t("wordActions")}
      aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined}
      onPointerDown={(event) => { if (open) event.preventDefault(); }}
      onClick={() => setOpen((value) => !value)} onKeyDown={(event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); }
      }}><MoreHorizontal size={20} aria-hidden="true" /></button>
    {open && createPortal(<div id={id} ref={menu} className="word-actions-menu" role="menu"
      aria-label={`${t("wordActions")}: ${word}`} style={position}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
      onKeyDown={(event) => {
        const buttons = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
        const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
        if (event.key === "Escape") { event.preventDefault(); setOpen(false); trigger.current?.focus(); }
        else if (event.key === "Tab") { setOpen(false); trigger.current?.focus(); }
        else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          buttons[event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length]?.focus();
        }
      }}>
      {items.map(({ action, label, icon: Icon }) => <button key={action} type="button" role="menuitem" tabIndex={-1}
        className={action === "delete" ? "word-action-delete" : undefined}
        onClick={() => { setOpen(false); onAction(action); }}><Icon size={17} aria-hidden="true" />{t(label)}</button>)}
    </div>, document.body)}
  </>;
}
