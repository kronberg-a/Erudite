import { useEffect, useRef, useState } from "react";
import workspace from "../../chess-engine/workspace.html?raw";
import board from "../../chess-engine/board.js?raw";
import repertoire from "../../chess-engine/script.js?raw";
import stockfish from "../../chess-engine/stockfish-wrapper.js?raw";
import lifecycle from "../../chess-engine/lifecycle.js?raw";
import timers from "../../chess-engine/timers.js?raw";
import legacyCss from "../../chess-engine/legacy.css?raw";
import skin from "../../chess-engine/skin.css?raw";

export type ChessActionRequest = { action: "new" | "import" | "train"; id: number };
type Props = {
  active: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  actionRequest: ChessActionRequest | null;
  onActionsAvailable: (available: boolean) => void;
};
function script(source: string) {
  return `<script>${source.replace(/<\/script/gi, "<\\/script")}</script>`;
}
function documentSource() {
  // A persistent document isolates upstream globals, IDs and DOM event handlers.
  const entry = document.querySelector<HTMLScriptElement>("script[data-app-entry]");
  const assets = entry ? new URL("../", entry.src) : new URL("./", document.baseURI);
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="${assets.href}"><link rel="stylesheet" href="vendor/chessboard.min.css"><style>${legacyCss}\n${skin}</style></head><body>${workspace}${script(timers)}<script src="vendor/jquery.min.js"></script><script src="vendor/chessboard.min.js"></script><script src="vendor/chess.min.js"></script>${script(stockfish)}${script(board)}${script(repertoire)}${script(lifecycle)}</body></html>`;
}
export function ChessView({ active, theme, toggleTheme, actionRequest, onActionsAvailable }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [source] = useState(documentSource);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "erudite-chess-ready") {
        setLoaded(true);
        onActionsAvailable(true);
      }
      if (event.data?.type === "erudite-chess-navigation") onActionsAvailable(event.data.available === true);
      if (event.data?.type === "erudite-chess-theme") toggleTheme();
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [toggleTheme, onActionsAvailable]);
  useEffect(() => {
    if (loaded) frame.current?.contentWindow?.postMessage({ type: "erudite-chess-state", active, theme }, "*");
  }, [active, theme, loaded]);
  useEffect(() => {
    if (loaded && actionRequest) frame.current?.contentWindow?.postMessage({
      type: "erudite-chess-action", action: actionRequest.action,
    }, "*");
  }, [loaded, actionRequest]);
  return <section className="chess-workspace" hidden={!active} aria-label="Chess opening trainer">
    {!loaded && <p role="status">Loading chess workspace…</p>}
    <iframe ref={frame} title="Chess opening trainer" srcDoc={source} />
  </section>;
}
