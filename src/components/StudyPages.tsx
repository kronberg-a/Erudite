import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { T } from "../i18n/translations";
import { uiCount, useStoredUiState, useUiKey } from "../hooks/useUiState";

// Fixed-height columns keep all content available without vertical scrolling.
export function StudyPages({ children, t, className = "", persistenceKey }: { children: ReactNode; t: T; className?: string; persistenceKey?: string }) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const scope = useUiKey("pages");
  const [page, setPage] = useStoredUiState(persistenceKey && scope ? `${scope}:${persistenceKey}` : null, 0, uiCount);
  const currentPage = useRef(0);
  currentPage.current = page;
  useLayoutEffect(() => {
    const box = viewport.current!;
    const flow = content.current!;
    const measure = () => {
      if (!box.clientWidth || !box.clientHeight) return;
      flow.style.columnWidth = `${box.clientWidth}px`;
      const count = Math.max(1, Math.ceil((flow.scrollWidth + 24) / (box.clientWidth + 24)));
      setPages(count);
      setPage((previous) => Math.min(previous, count - 1));
      box.scrollLeft = Math.min(currentPage.current, count - 1) * (box.clientWidth + 24);
    };
    measure();
    const resize = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    resize?.observe(box);
    const mutations = new MutationObserver(measure);
    mutations.observe(flow, { childList: true, subtree: true, characterData: true });
    window.addEventListener("resize", measure);
    return () => { resize?.disconnect(); mutations.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
  useLayoutEffect(() => {
    if (viewport.current) viewport.current.scrollLeft = page * (viewport.current.clientWidth + 24);
  }, [page, pages]);
  return <div className={`study-pages ${className}`}>
    <div className="study-page-window" ref={viewport} onScroll={(event) => {
      const box = event.currentTarget;
      setPage(Math.min(pages - 1, Math.round(box.scrollLeft / (box.clientWidth + 24))));
    }}><div className="study-page-flow" ref={content}>{children}</div></div>
    <div className="study-page-controls" data-paged={pages > 1} onKeyDown={(event) => event.stopPropagation()}>
      <button type="button" className="icon-button" aria-label={t("previousPage")} title={t("previousPage")} disabled={page === 0} onClick={() => setPage((value) => value - 1)}><ChevronLeft size={16} /></button>
      <span aria-live="polite">{page + 1} / {pages}</span>
      <button type="button" className="icon-button" aria-label={t("nextPage")} title={t("nextPage")} disabled={page === pages - 1} onClick={() => setPage((value) => value + 1)}><ChevronRight size={16} /></button>
    </div>
  </div>;
}
