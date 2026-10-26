import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  ChevronDown,
  RotateCcw,
  Volume2,
} from "lucide-react";
import type { Action, Mode, PairData, Settings, WordCard } from "../types";
import type { T } from "../i18n/translations";
import { reviewCard } from "../core/srsEngine";
import { advanceQueue, buildQueue, localDay } from "../core/queueManager";
import { speak } from "../core/speech";
import { useSwipeGesture } from "../hooks/useSwipeGesture";
import { useKeyboard } from "../hooks/useKeyboard";
interface Props {
  pair: PairData;
  settings: Settings;
  update: (p: PairData) => void;
  t: T;
  openLibrary: () => void;
}
interface Undo {
  cardId: string;
  previousCardState: WordCard;
  previousQueueIndex: number;
  queue: string[];
  introduced: PairData["introduced"];
  completed: number;
}
export function StudyView({ pair, settings, update, t, openLibrary }: Props) {
  const [mode, setMode] = useState<Mode>("mixed");
  const [queue, setQueue] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [initial, setInitial] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [history, setHistory] = useState<Undo[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [exit, setExit] = useState<Action | null>(null);
  const [reverse, setReverse] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lock = useRef(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  const today = localDay();
  const dailyRemaining = Math.max(
    0,
    settings.dailyNewCardsCap - (pair.introduced[today]?.length ?? 0),
  );
  const available = buildQueue(
    pair.words,
    pair.categories,
    mode,
    dailyRemaining,
  );
  const due = buildQueue(pair.words, pair.categories, "review", 0).length;
  const fresh = buildQueue(
    pair.words,
    pair.categories,
    "new",
    dailyRemaining,
  ).length;
  const mastered = pair.words.filter((w) => w.status === "MASTERED").length;
  const card = pair.words.find((w) => w.id === queue[0]);
  const category =
    card && pair.categories.find((c) => card.categoryIds.includes(c.id));
  const start = () => {
    setQueue(available);
    setInitial(available.length);
    setStarted(true);
    setCompleted(0);
    setHistory([]);
    setRevealed(false);
    setReverse(false);
  };
  const action = (a: Action) => {
    if (!card || lock.current) return;
    lock.current = true;
    setExit(a);
    setReverse(false);
    timer.current = setTimeout(() => {
      const now = Date.now();
      const day = localDay(new Date(now));
      const updated = reviewCard(card, a, settings, now);
      setHistory((h) => [
        ...h,
        {
          cardId: card.id,
          previousCardState: card,
          previousQueueIndex: 0,
          queue: [...queue],
          introduced: pair.introduced,
          completed,
        },
      ]);
      const introduced =
        card.status === "NEW"
          ? {
              ...pair.introduced,
              [day]: [...new Set([...(pair.introduced[day] ?? []), card.id])],
            }
          : pair.introduced;
      update({
        ...pair,
        words: pair.words.map((w) => (w.id === updated.id ? updated : w)),
        introduced,
      });
      setQueue(advanceQueue(queue, updated));
      if (updated.status !== "LEARNING") setCompleted((n) => n + 1);
      setRevealed(false);
      setAudioError(false);
      setExit(null);
      lock.current = false;
    }, 150);
  };
  const undo = () => {
    if (!history.length || lock.current) return;
    const previous = history[history.length - 1];
    update({
      ...pair,
      words: pair.words.map((w) =>
        w.id === previous.cardId ? previous.previousCardState : w,
      ),
      introduced: previous.introduced,
    });
    setQueue(previous.queue);
    setCompleted(previous.completed);
    setHistory(history.slice(0, -1));
    setRevealed(false);
    setReverse(true);
  };
  const reveal = () => {
    if (card && !lock.current) setRevealed(true);
  };
  useKeyboard(action, reveal, undo, started);
  const { drag, handlers } = useSwipeGesture(action, reveal, !!exit);
  const tint =
    drag.y < -40 && Math.abs(drag.y) > Math.abs(drag.x)
      ? "master"
      : drag.x > 0
        ? "know"
        : "repeat";
  const distance = tint === "master" ? -drag.y : Math.abs(drag.x);
  const transform = exit
    ? exit === "master"
      ? "translateY(-110vh)"
      : `translateX(${exit === "know" ? "" : "-"}110vw) rotate(${exit === "know" ? "" : "-"}16deg)`
    : `translate(${drag.x}px, ${drag.y}px) rotate(${(drag.x / 100) * 8}deg)`;
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t("learn")}</p>
          <h1>{t("study")}</h1>
          <p className="subtitle">{t("studySub")}</p>
        </div>
        <div className="mode-select">
          <select
            aria-label={t("session")}
            value={mode}
            disabled={started && queue.length > 0}
            onChange={(e) => {
              setMode(e.target.value as Mode);
              setStarted(false);
            }}
          >
            <option value="mixed">{t("mixed")}</option>
            <option value="new">{t("new")}</option>
            <option value="review">{t("review")}</option>
          </select>
          <ChevronDown size={15} />
        </div>
      </div>
      <div className="summary-grid">
        <div>
          <span className="stat-dot blue" />
          <span>{t("new")}</span>
          <strong>{fresh.toString().padStart(2, "0")}</strong>
        </div>
        <div>
          <span className="stat-dot amber" />
          <span>{t("review")}</span>
          <strong>{due.toString().padStart(2, "0")}</strong>
        </div>
        <div>
          <span className="stat-dot green" />
          <span>{t("mastered")}</span>
          <strong>{mastered.toString().padStart(2, "0")}</strong>
        </div>
      </div>
      <section className="study-workspace">
        <div className="session-bar">
          <button
            className="text-button"
            disabled={!history.length || !!exit}
            onClick={undo}
          >
            <RotateCcw size={15} />
            {t("undo")}
          </button>
          <span className="eyebrow">{t("session")}</span>
          <span className="session-count">
            {started ? `${completed} / ${initial}` : `${available.length}`}{" "}
            <span>{started ? `· ${queue.length} ${t("remaining")}` : ""}</span>
          </span>
        </div>
        <div className="progress-track">
          <div
            style={{
              width: `${started && initial ? (completed / initial) * 100 : 0}%`,
            }}
          />
        </div>
        {started && card ? (
          <>
            <div className="card-stack">
              <div className="stack-under" />
              <article
                key={card.id}
                {...handlers}
                className={`flashcard ${revealed ? "revealed" : ""} ${reverse ? "reverse" : ""} ${drag.active ? "dragging" : ""}`}
                aria-label={`${card.targetWord}. ${t("tap")}`}
                tabIndex={0}
                style={{
                  transform,
                  borderColor:
                    drag.active && distance > 15
                      ? `var(--${tint === "know" ? "positive" : tint === "repeat" ? "negative" : "accent"})`
                      : undefined,
                }}
              >
                <div className="card-top">
                  <span className="category-tag">
                    {category?.name[settings.interfaceLanguage]}
                  </span>
                  <span className="card-status">
                    {t(
                      card.status === "NEW"
                        ? "new"
                        : card.status === "LEARNING"
                          ? "learning"
                          : "review",
                    )}
                    {card.status === "LEARNING" ? ` ${card.step}/3` : ""}
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className={`swipe-badge ${tint}`}
                  style={{
                    opacity: drag.active ? Math.min(1, distance / 100) : 0,
                  }}
                >
                  {t(tint)}
                </span>
                <div className="card-prompt">
                  <h2 lang={settings.targetLanguage}>{card.targetWord}</h2>
                  {card.transcription && (
                    <p className="transcription">{card.transcription}</p>
                  )}
                  <button
                    className="audio-button"
                    aria-label={t("listen")}
                    title={t("listen")}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAudioError(
                        !speak(card.targetWord, settings.targetLanguage),
                      );
                    }}
                  >
                    <Volume2 size={20} />
                  </button>
                  {audioError && <small role="status">{t("audioError")}</small>}
                </div>
                {revealed ? (
                  <div className="card-answer">
                    <p
                      lang={settings.sourceLanguage}
                      className="translation-text"
                    >
                      {card.translations.join(" · ")}
                    </p>
                    {card.examples.length > 0 && (
                      <div className="context">
                        <span className="eyebrow">{t("example")}</span>
                        {card.examples.map((e, i) => (
                          <div key={i}>
                            <p lang={settings.targetLanguage}>
                              {e.targetSentence}
                            </p>
                            <p lang={settings.sourceLanguage} className="muted">
                              {e.translatedSentence}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="tap-hint">
                    <span className="small-line" />
                    {t("tap")}
                    <kbd>Space</kbd>
                  </div>
                )}
              </article>
            </div>
            <div className="action-bar">
              <button
                className="action-repeat"
                disabled={!!exit}
                onClick={() => action("repeat")}
              >
                <ArrowLeft size={18} />
                <span>{t("repeat")}</span>
              </button>
              <button
                className="action-reveal"
                disabled={!!exit || revealed}
                onClick={reveal}
              >
                <BookOpen size={18} />
                <span>{t("reveal")}</span>
              </button>
              <button
                className="action-know"
                disabled={!!exit}
                onClick={() => action("know")}
              >
                <span>{t("know")}</span>
                <ArrowRight size={18} />
              </button>
            </div>
            <button
              className="master-button"
              disabled={!!exit}
              onClick={() => action("master")}
            >
              <ArrowUp size={14} />
              {t("master")}
            </button>
          </>
        ) : (
          <div className="session-empty">
            <div className="empty-icon">
              {started && initial ? (
                <Check size={28} />
              ) : (
                <BookOpen size={28} />
              )}
            </div>
            <h2>{started && initial ? t("complete") : t("ready")}</h2>
            <p>
              {started && initial
                ? t("completeSub")
                : available.length
                  ? `${available.length} ${t("remaining")}. ${t("studySub")}`
                  : t("empty")}
            </p>
            <button
              className="primary-button"
              onClick={available.length ? start : openLibrary}
            >
              {available.length
                ? started
                  ? t("restart")
                  : t("start")
                : t("categories")}
              <ArrowRight size={17} />
            </button>
          </div>
        )}
        {started && card && (
          <div className="keyboard-hints">
            <span>
              <kbd>←</kbd> {t("repeat")}
            </span>
            <span>
              <kbd>Space</kbd> {t("reveal")}
            </span>
            <span>
              <kbd>→</kbd> {t("know")}
            </span>
            <span>
              <kbd>↑</kbd> {t("master")}
            </span>
            <span>
              <kbd>Ctrl Z</kbd> {t("undo")}
            </span>
          </div>
        )}
        {started && card && (
          <button
            className="end-session"
            disabled={!!exit}
            onClick={() => {
              setStarted(false);
              setQueue([]);
              setHistory([]);
            }}
          >
            {t("end")}
          </button>
        )}
      </section>
    </>
  );
}
