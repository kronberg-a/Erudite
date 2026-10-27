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
import type {
  Action,
  Evaluation,
  Mode,
  PairData,
  Settings,
  TypingInput,
  StudySelection,
  WordCard,
} from "../types";
import type { T } from "../i18n/translations";
import { reviewCard, reinsertionDistance } from "../core/srsEngine";
import {
  availableMode,
  buildStudyQueue,
  continueQueue,
  selectedWords,
} from "../core/queueManager";
import { speak } from "../core/speech";
import { useSwipeGesture } from "../hooks/useSwipeGesture";
import { useKeyboard } from "../hooks/useKeyboard";
import { needsTyping } from "../core/typing";
import { TypingCard } from "./TypingCard";
interface Props {
  pair: PairData;
  settings: Settings;
  update: (p: PairData, reviewOrder?: number) => void;
  reviewOrder: number;
  t: T;
  openLibrary: () => void;
  changeSettings: (patch: Partial<Settings>) => void;
  initialSelection?: StudySelection;
}
interface Undo {
  cardId: string;
  previousCardState: WordCard;
  previousQueueIndex: number;
  queue: string[];
  reviewOrder: number;
  mode: Mode;
  completed: number;
}
export function StudyView({
  pair,
  settings,
  update,
  t,
  openLibrary,
  changeSettings,
  initialSelection,
  reviewOrder,
}: Props) {
  const [mode, setMode] = useState<Mode>("mixed");
  const [selection, setSelection] = useState<StudySelection | undefined>(
    initialSelection,
  );
  const [queue, setQueue] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [history, setHistory] = useState<Undo[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [lastAction, setLastAction] = useState<Action | null>(null);
  const [modeNotice, setModeNotice] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [inputMode, setInputMode] = useState<TypingInput>("KEYBOARD");
  const [turn, setTurn] = useState(0);
  const nextButton = useRef<HTMLButtonElement>(null);
  const evaluated = useRef(false);
  const committedTurn = useRef(-1);
  const available = buildStudyQueue(pair, mode, selection);
  const inProgress = buildStudyQueue(pair, "review", selection).length;
  const fresh = buildStudyQueue(pair, "new", selection).length;
  const pool = selectedWords(pair, selection);
  const mastered = pool.filter((w) => w.status === "MASTERED").length;
  const allMastered = pool.length > 0 && mastered === pool.length;
  const card = pair.words.find((w) => w.id === queue[0]);
  const typing = !!card && needsTyping(card, settings.studyMode);
  const resetTurn = () => {
    setEvaluation(null);
    evaluated.current = false;
    setTurn((n) => n + 1);
    setRevealed(false);
    setAudioError(false);
  };
  useEffect(() => {
    if (evaluation) nextButton.current?.focus({ preventScroll: true });
  }, [evaluation]);
  const category =
    card && pair.categories.find((c) => card.categoryIds.includes(c.id));
  const start = () => {
    setQueue(available);
    setStarted(true);
    setCompleted(0);
    setHistory([]);
    resetTurn();
    setReverse(false);
  };
  const action = (a: Action) => {
    if (!card || committedTurn.current === turn || (typing && !revealed))
      return;
    committedTurn.current = turn;
    setLastAction(a);
    setReverse(false);
    const assisted = typing && evaluation === "ASSISTED" && a === "repeat";
    const updated = reviewCard(card, a, settings, reviewOrder + 1, {
      assisted,
    });
    setHistory((h) => [
      ...h,
      {
        cardId: card.id,
        previousCardState: card,
        previousQueueIndex: 0,
        queue: [...queue],
        reviewOrder,
        mode,
        completed,
      },
    ]);
    const nextPair = {
      ...pair,
      words: pair.words.map((w) => (w.id === updated.id ? updated : w)),
    };
    update(nextPair, reviewOrder + 1);
    const continuation = continueQueue(
      queue,
      nextPair,
      mode,
      updated,
      reinsertionDistance(card, a, assisted),
      selection,
    );
    setQueue(continuation.queue);
    setMode(continuation.mode);
    if (continuation.switched) setModeNotice(true);
    setCompleted((n) => n + 1);
    resetTurn();
  };
  const undo = () => {
    if (!history.length) return;
    const previous = history[history.length - 1];
    update(
      {
        ...pair,
        words: pair.words.map((w) =>
          w.id === previous.cardId ? previous.previousCardState : w,
        ),
      },
      previous.reviewOrder,
    );
    setQueue(previous.queue);
    setCompleted(previous.completed);
    setMode(previous.mode);
    setModeNotice(false);
    setLastAction(null);
    setHistory(history.slice(0, -1));
    resetTurn();
    setReverse(true);
  };
  const reveal = () => {
    if (card && !typing) setRevealed(true);
  };
  const next = () => {
    if (evaluation) action(evaluation === "CORRECT" ? "know" : "repeat");
  };
  const evaluate = (result: Evaluation) => {
    if (!card || evaluated.current) return;
    evaluated.current = true;
    setEvaluation(result);
    setRevealed(true);
    setAudioError(!speak(card.targetWord, settings.targetLanguage));
  };
  useKeyboard(
    action,
    typing ? next : reveal,
    undo,
    started && (!typing || revealed),
  );
  const { drag, handlers } = useSwipeGesture(
    action,
    reveal,
    typing && !revealed,
  );
  const tint =
    drag.y < -40 && Math.abs(drag.y) > Math.abs(drag.x)
      ? "master"
      : drag.x > 0
        ? "know"
        : "repeat";
  const distance = tint === "master" ? -drag.y : Math.abs(drag.x);
  const transform = `translate(${drag.x}px, ${drag.y}px) rotate(${(drag.x / 100) * 8}deg)`;
  const changeMode = (requested: Mode) => {
    const next = availableMode(pair, requested, selection);
    setMode(next);
    setModeNotice(next !== requested);
    setHistory([]);
    resetTurn();
    if (started) setQueue(buildStudyQueue(pair, next, selection));
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t("learn")}</p>
          <h1>{t("study")}</h1>
          <p className="subtitle">{t("studySub")}</p>
        </div>
        <div className="study-selectors">
          <label className="recall-mode-label">
            {t("practiceSelection")}
            <select
              aria-label={t("practiceSelection")}
              value={selection ? `${selection.kind}:${selection.id}` : "all"}
              disabled={started && queue.length > 0}
              onChange={(event) => {
                const value = event.target.value;
                setSelection(
                  value === "all"
                    ? undefined
                    : value.startsWith("category:")
                      ? { kind: "category", id: value.slice(9) }
                      : { kind: "word", id: value.slice(5) },
                );
                setStarted(false);
                setMode(
                  availableMode(
                    pair,
                    mode,
                    value === "all"
                      ? undefined
                      : value.startsWith("category:")
                        ? { kind: "category", id: value.slice(9) }
                        : { kind: "word", id: value.slice(5) },
                  ),
                );
                setModeNotice(false);
                setQueue([]);
                setHistory([]);
                resetTurn();
              }}
            >
              <option value="all">{t("allActiveFolders")}</option>
              {pair.categories.map((category) => (
                <option key={category.id} value={`category:${category.id}`}>
                  {category.name[settings.interfaceLanguage]}
                </option>
              ))}
              {selection?.kind === "word" && (
                <option value={`word:${selection.id}`}>
                  {t("selectedWord")}
                </option>
              )}
            </select>
          </label>
          <label className="recall-mode-label">
            {t("studyMode")}
            <select
              aria-label={t("studyMode")}
              value={settings.studyMode}
              disabled={started && queue.length > 0}
              onChange={(e) =>
                changeSettings({
                  studyMode: e.target.value as Settings["studyMode"],
                })
              }
            >
              <option value="SWIPE_ONLY">{t("swipeOnly")}</option>
              <option value="TYPE_ONLY">{t("typeOnly")}</option>
              <option value="MIXED">{t("mixedRecall")}</option>
            </select>
          </label>
          {settings.studyMode !== "SWIPE_ONLY" && (
            <label className="recall-mode-label">
              {t("inputMode")}
              <select
                aria-label={t("inputMode")}
                value={inputMode}
                onChange={(e) => setInputMode(e.target.value as TypingInput)}
              >
                <option value="KEYBOARD">{t("keyboard")}</option>
                <option value="TILES">{t("tiles")}</option>
              </select>
            </label>
          )}
          <div className="mode-select">
            <select
              aria-label={t("session")}
              value={mode}
              onChange={(e) => changeMode(e.target.value as Mode)}
            >
              <option value="mixed">{t("mixed")}</option>
              <option value="new">{t("newMode")}</option>
              <option value="review">{t("reviewMode")}</option>
            </select>
            <ChevronDown size={15} />
          </div>
        </div>
      </div>
      {selection && (
        <p className="practice-note">{t("selectedPracticeHint")}</p>
      )}
      {modeNotice && (
        <p className="practice-note" role="status">
          {t("modeSwitched")}
        </p>
      )}
      <div className="summary-grid">
        <div>
          <span className="stat-dot blue" />
          <span>{t("new")}</span>
          <strong>{fresh.toString().padStart(2, "0")}</strong>
        </div>
        <div>
          <span className="stat-dot amber" />
          <span>{t("review")}</span>
          <strong>{inProgress.toString().padStart(2, "0")}</strong>
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
            disabled={!history.length}
            onClick={undo}
          >
            <RotateCcw size={15} />
            {t("undo")}
          </button>
          <span className="eyebrow">{t("session")}</span>
          <span className="session-count">
            {started ? `${completed} ${t("practiced")}` : `${available.length}`}{" "}
            <span>{started ? `· ${queue.length} ${t("remaining")}` : ""}</span>
          </span>
        </div>
        <div className="progress-track">
          <div
            style={{
              width: `${pool.length ? (mastered / pool.length) * 100 : 0}%`,
            }}
          />
        </div>
        {started && card ? (
          <>
            <div className="card-stack">
              <div className="stack-under" />
              <article
                key={`${card.id}-${turn}`}
                {...handlers}
                className={`flashcard ${lastAction ? "advance-" + lastAction : ""} ${typing ? "typing-flashcard" : ""} ${evaluation ? `grade-${evaluation.toLowerCase()}` : ""} ${revealed ? "revealed" : ""} ${reverse ? "reverse" : ""} ${drag.active ? "dragging" : ""}`}
                aria-label={
                  typing && !revealed
                    ? `${card.translations.join(" · ")}. ${t("typePrompt")}`
                    : `${card.targetWord}. ${t(typing && revealed ? "next" : "tap")}`
                }
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
                    {card.status !== "NEW" ? ` ${card.step}/5` : ""}
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
                {typing ? (
                  <TypingCard
                    key={turn}
                    card={card}
                    settings={settings}
                    inputMode={inputMode}
                    evaluation={evaluation}
                    onEvaluate={evaluate}
                    onListen={() =>
                      setAudioError(
                        !speak(card.targetWord, settings.targetLanguage),
                      )
                    }
                    audioError={audioError}
                    t={t}
                  />
                ) : (
                  <>
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
                      {audioError && (
                        <small role="status">{t("audioError")}</small>
                      )}
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
                                <p
                                  lang={settings.sourceLanguage}
                                  className="muted"
                                >
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
                  </>
                )}
              </article>
            </div>
            {(!typing || revealed) && (
              <div className="action-bar">
                <button
                  className={`action-repeat ${typing && evaluation !== "CORRECT" ? "preselected" : ""}`}
                  onClick={() => action("repeat")}
                >
                  <ArrowLeft size={18} />
                  <span>{t("repeat")}</span>
                </button>
                <button
                  ref={nextButton}
                  className={`action-reveal ${typing ? "action-next" : ""}`}
                  disabled={!typing && revealed}
                  onClick={typing ? next : reveal}
                >
                  {typing ? <ArrowRight size={18} /> : <BookOpen size={18} />}
                  <span>{t(typing ? "next" : "reveal")}</span>
                </button>
                <button
                  className={`action-know ${typing && evaluation === "CORRECT" ? "preselected" : ""}`}
                  onClick={() => action("know")}
                >
                  <span>{t("know")}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
            {(!typing || revealed) && (
              <button
                className="master-button"
                onClick={() => action("master")}
              >
                <ArrowUp size={14} />
                {t("master")}
              </button>
            )}
          </>
        ) : (
          <div className="session-empty">
            <div className="empty-icon">
              {allMastered ? <Check size={28} /> : <BookOpen size={28} />}
            </div>
            <h2>{allMastered ? t("complete") : t("ready")}</h2>
            <p>
              {allMastered
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
        {started && card && typing && !revealed && (
          <p className="typing-keyboard-hints">{t("typingShortcuts")}</p>
        )}
        {started && card && (!typing || revealed) && (
          <div className="keyboard-hints">
            <span>
              <kbd>←</kbd> {t("repeat")}
            </span>
            <span>
              <kbd>{typing ? "Enter / Space" : "Space"}</kbd>{" "}
              {t(typing ? "next" : "reveal")}
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
