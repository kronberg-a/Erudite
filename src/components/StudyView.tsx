import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  RotateCcw,
  Volume2,
} from "lucide-react";
import type {
  Action,
  DailyProgress,
  Evaluation,
  Mode,
  PairData,
  Settings,
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
import { localDate, recordRecall, todayProgress } from "../core/dailyGoal";
interface Props {
  pair: PairData;
  settings: Settings;
  update: (p: PairData, reviewOrder?: number, dailyProgress?: DailyProgress) => void;
  dailyProgress?: DailyProgress;
  reviewOrder: number;
  t: T;
  openLibrary: () => void;
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
  dailyProgress: DailyProgress;
}
export function StudyView({
  pair,
  settings,
  update,
  t,
  openLibrary,
  initialSelection,
  reviewOrder,
  dailyProgress,
}: Props) {
  const [day, setDay] = useState(localDate);
  const [mode, setMode] = useState<Mode>("mixed");
  const [selection] = useState<StudySelection | undefined>(
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
  const [turn, setTurn] = useState(0);
  const nextButton = useRef<HTMLButtonElement>(null);
  const goalButton = useRef<HTMLButtonElement>(null);
  const evaluated = useRef(false);
  const committedTurn = useRef(-1);
  const available = buildStudyQueue(pair, availableMode(pair, mode, selection), selection);
  const inProgress = buildStudyQueue(pair, "review", selection).length;
  const fresh = buildStudyQueue(pair, "new", selection).length;
  const pool = selectedWords(pair, selection);
  const mastered = pool.filter((w) => w.status === "MASTERED").length;
  const allMastered = pool.length > 0 && mastered === pool.length && !available.length;
  const card = pair.words.find((w) => w.id === queue[0]);
  const typing = !!card && needsTyping(card, settings.studyMode);
  const progress = todayProgress(dailyProgress);
  const goal = settings.dailyWordGoal;
  const goalReached = started && goal != null && progress.wordIds.length >= goal && progress.acknowledgedGoal !== goal;
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timer = window.setTimeout(() => setDay(localDate()), midnight.getTime() - now.getTime());
    const refresh = () => setDay(localDate());
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [day]);
  useEffect(() => {
    if (goalReached) goalButton.current?.focus({ preventScroll: true });
  }, [goalReached]);
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
    const nextMode = availableMode(pair, mode, selection);
    const nextQueue = buildStudyQueue(pair, nextMode, selection);
    if (!nextQueue.length) return;
    setMode(nextMode);
    setModeNotice(nextMode !== mode);
    setQueue(nextQueue);
    setStarted(true);
    setCompleted(0);
    setHistory([]);
    resetTurn();
    setReverse(false);
  };
  const action = (a: Action) => {
    if (a === "master" || !started || goalReached || !card || committedTurn.current === turn || (typing && !revealed))
      return;
    committedTurn.current = turn;
    setLastAction(a);
    setReverse(false);
    const assisted = typing && evaluation === "ASSISTED";
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
        dailyProgress: progress,
      },
    ]);
    const nextPair = {
      ...pair,
      words: pair.words.map((w) => (w.id === updated.id ? updated : w)),
    };
    update(nextPair, reviewOrder + 1, a === "know"
      ? recordRecall(progress, `${settings.sourceLanguage}-${settings.targetLanguage}`, card.id)
      : progress);
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
      todayProgress(previous.dailyProgress),
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
    if (card && !typing && !goalReached) setRevealed(true);
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
    started && (goalReached || !typing || revealed),
  );
  const { drag, handlers } = useSwipeGesture(
    action,
    reveal,
    typing && !revealed,
  );
  const tint = drag.x > 0 ? "know" : "repeat";
  const distance = Math.abs(drag.x);
  const transform = `translate(${drag.x}px, ${drag.y}px) rotate(${(drag.x / 100) * 8}deg)`;
  const changeMode = (requested: Mode) => {
    if (started) return;
    setMode(requested);
    setModeNotice(false);
    setHistory([]);
    resetTurn();
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t("learn")}</p>
          <h1>{t("study")}</h1>
          <p className="subtitle">{t("masteryRoute")}</p>
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
        {!started && (
          <section className="session-settings" aria-label={t("sessionSettings")}>
            <div className="session-mode-options" role="radiogroup" aria-label={t("session")}>
              {(["new", "review", "mixed"] as const).map((option) => (
                <label key={option} className="session-mode-option">
                  <input
                    type="radio"
                    name="session-mode"
                    value={option}
                    checked={mode === option}
                    onChange={() => changeMode(option)}
                  />
                  <span>{t(option === "new" ? "newMode" : option === "review" ? "reviewMode" : "mixed")}</span>
                </label>
              ))}
            </div>
          </section>
        )}
        {goal != null && (
          <p className="daily-goal-progress">{t("dailyGoal")}: {progress.wordIds.length} / {goal}</p>
        )}
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
        {goalReached ? (
          <div className="session-empty daily-goal-card" role="region" aria-labelledby="daily-goal-title">
            <div className="empty-icon goal-check" aria-hidden="true"><Check size={28} /></div>
            <p className="eyebrow">{t("dailyGoal")}</p>
            <h2 id="daily-goal-title">{t("goalReached")}</h2>
            <p>{t("goalCongratulations")}</p>
            <strong className="goal-total">{progress.wordIds.length} / {goal}</strong>
            <div className="goal-actions">
              <button ref={goalButton} className="primary-button" onClick={() => update(pair, reviewOrder, { ...progress, acknowledgedGoal: goal })}>
                {t("continueStudy")}<ArrowRight size={17} />
              </button>
              <button className="outline-button" onClick={() => {
                update(pair, reviewOrder, { ...progress, acknowledgedGoal: goal });
                setStarted(false);
                setQueue([]);
                setHistory([]);
              }}>{t("end")}</button>
            </div>
          </div>
        ) : started && card ? (
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
                          : card.status === "MASTERED" ? "mastered" : "review",
                    )}
                    {card.status === "LEARNING" ? ` ${card.step}/3` : ""}
                    {card.status === "REVIEW" && card.nextReviewDate ? ` · ${t("scheduledReview")}: ${new Date(card.nextReviewDate).toLocaleDateString(settings.interfaceLanguage)}` : ""}
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
                    inputMode="KEYBOARD"
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
            {started && (
              <button className="outline-button" onClick={() => {
                setStarted(false);
                setQueue([]);
                setHistory([]);
                setModeNotice(false);
                resetTurn();
              }}>{t("restart")}</button>
            )}
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
        {started && !goalReached && card && typing && !revealed && (
          <p className="typing-keyboard-hints">{t("typingShortcuts")}</p>
        )}
        {started && !goalReached && card && (!typing || revealed) && (
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
              <kbd>Ctrl Z</kbd> {t("undo")}
            </span>
          </div>
        )}
        {started && !goalReached && card && (
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
