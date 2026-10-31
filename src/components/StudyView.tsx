import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FolderOpen,
  ListMinus,
  BookOpen,
  Eye,
  Keyboard,
  Grid2X2,
  Check,
  RotateCcw,
  MoreHorizontal,
  LogOut,
  Volume2,
} from "lucide-react";
import type {
  Action,
  StudyActivity,
  DailyProgress,
  Evaluation,
  Mode,
  PairData,
  Settings,
  StudySelection,
  TypingInput,
  WordCard,
} from "../types";
import type { T } from "../i18n/translations";
import { reviewCard, reinsertionDistance } from "../core/srsEngine";
import {
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
import { readUiState, uiBoolean, uiCount, uiObject, useUiKey, writeUiState } from "../hooks/useUiState";
import { validateData } from "../services/storage";
import { usePracticeViewport } from "../hooks/usePracticeViewport";
import { recordStudyActivity, validStudyActivity } from "../core/stats";
interface Props extends StudyActivity {
  pair: PairData;
  settings: Settings;
  update: (p: PairData, reviewOrder?: number, dailyProgress?: DailyProgress, activity?: StudyActivity) => void;
  dailyProgress?: DailyProgress;
  reviewOrder: number;
  t: T;
  openLibrary: (wordId?: string) => void;
  initialSelection?: StudySelection;
}
interface Undo {
  activity?: StudyActivity;
  cardId: string;
  previousCardState: WordCard;
  previousQueueIndex: number;
  queue: string[];
  reviewOrder: number;
  mode: Mode;
  completed: number;
  initialSessionCount: number;
  dailyProgress: DailyProgress;
}
interface StudySnapshot {
  sessionId: string;
  pairSignature: string;
  reviewOrder: number; mode: Mode; queue: string[]; started: boolean; completed: number;
  initialSessionCount: number; history: Undo[]; revealed: boolean; evaluation: Evaluation | null;
  typingInput: TypingInput; inputPractice?: boolean; turn: number;
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
  activityLog,
  recallModes,
}: Props) {
  const snapshotKey = useUiKey(`study:${settings.studyMode}:${JSON.stringify(initialSelection ?? null)}`);
  const pairSignature = useMemo(() => snapshotKey ? JSON.stringify(pair.words.map((word) => [
    word.id, word.targetWord, word.transcription, word.translations, word.examples, word.categoryIds,
    word.status, word.step, word.repCount, word.lastReviewedOrder, word.createdAt, word.lastStudiedAt,
    word.interval ?? 0, word.nextReviewDate ?? 0, word.easeFactor ?? 2.3, word.reviewRepetitions ?? 0,
  ])) : "", [pair.words, snapshotKey]);
  const [resume] = useState(() => {
    const wordIds = new Set(pair.words.map((word) => word.id));
    const validQueue = (value: unknown) => Array.isArray(value) && value.length <= 10000 && value.every((id) => wordIds.has(id));
    const validMode = (value: unknown) => ["mixed", "new", "review"].includes(value as string);
    return readUiState<StudySnapshot | null>(snapshotKey, null, (value) => uiObject(value) && typeof value.sessionId === "string" && value.sessionId.length <= 100 && value.pairSignature === pairSignature && value.reviewOrder === reviewOrder && validMode(value.mode) &&
      validQueue(value.queue) && uiBoolean(value.started) && (!value.started || (value.queue as string[]).length > 0) &&
      uiCount(value.completed) && uiCount(value.initialSessionCount) && uiCount(value.turn) && uiBoolean(value.revealed) &&
      (value.evaluation === null || ["CORRECT", "ASSISTED", "INCORRECT"].includes(value.evaluation as string)) &&
      (value.inputPractice === undefined || uiBoolean(value.inputPractice)) && ["KEYBOARD", "TILES"].includes(value.typingInput as string) && Array.isArray(value.history) && value.history.length <= 10000 &&
      value.history.every((item) => uiObject(item) && typeof item.cardId === "string" && uiObject(item.previousCardState) &&
        item.previousCardState.id === item.cardId && (item.activity === undefined || (uiObject(item.activity) && validStudyActivity(item.activity))) && validQueue(item.queue) && uiCount(item.previousQueueIndex) &&
        uiCount(item.reviewOrder) && validMode(item.mode) && uiCount(item.completed) && uiCount(item.initialSessionCount) &&
        validateData({ version: 2, reviewOrder: item.reviewOrder, dailyProgress: item.dailyProgress, ...((item.activity as StudyActivity | undefined) ?? {}), settings,
          pairs: { [`${settings.sourceLanguage}-${settings.targetLanguage}`]: { words: [item.previousCardState], categories: pair.categories } } })));
  });
  const [day, setDay] = useState(localDate);
  const [sessionId, setSessionId] = useState(() => resume?.sessionId ?? crypto.randomUUID());
  const [mode, setMode] = useState<Mode>(resume?.mode ?? "mixed");
  const [selection] = useState<StudySelection | undefined>(
    initialSelection,
  );
  const [queue, setQueue] = useState<string[]>(resume?.queue ?? []);
  const [started, setStarted] = useState(resume?.started ?? false);
  const keyboardOpen = usePracticeViewport(true);
  const [completed, setCompleted] = useState(resume?.completed ?? 0);
  const [initialSessionCount, setInitialSessionCount] = useState(resume?.initialSessionCount ?? 0);
  const [history, setHistory] = useState<Undo[]>(resume?.history ?? []);
  const [revealed, setRevealed] = useState(resume?.revealed ?? false);
  const [lastAction, setLastAction] = useState<Action | null>(null);
  const [reverse, setReverse] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(resume?.evaluation ?? null);
  const [typingInput, setTypingInput] = useState<TypingInput>(resume?.typingInput ?? "KEYBOARD");
  const [inputPractice, setInputPractice] = useState(resume?.inputPractice === true);
  const [turn, setTurn] = useState(resume?.turn ?? 0);
  const gradeButton = useRef<HTMLButtonElement>(null);
  const goalButton = useRef<HTMLButtonElement>(null);
  const assistedTurn = useRef(false);
  const evaluated = useRef(!!resume?.evaluation);
  const committedTurn = useRef(-1);
  useEffect(() => {
    writeUiState(snapshotKey, { sessionId, pairSignature, reviewOrder, mode, queue, started, completed, initialSessionCount, history, revealed, evaluation, typingInput, inputPractice, turn });
  }, [snapshotKey, sessionId, pairSignature, reviewOrder, mode, queue, started, completed, initialSessionCount, history, revealed, evaluation, typingInput, inputPractice, turn]);
  const available = buildStudyQueue(pair, mode, selection);
  const inProgress = buildStudyQueue(pair, "review", selection).length;
  const fresh = buildStudyQueue(pair, "new", selection).length;
  const pool = selectedWords(pair, selection);
  const mastered = pool.filter((w) => w.status === "MASTERED").length;
  const sessionComplete = !started && history.length > 0 && queue.length === 0;
  const sessionVisible = started || sessionComplete;
  const wordsById = new Map(pair.words.map((word) => [word.id, word]));
  const queuedWords = queue.map((id) => wordsById.get(id));
  const newInQueue = queuedWords.filter((word) => word?.status === "NEW").length;
  const learningInQueue = queuedWords.filter((word) => word?.status === "LEARNING").length;
  const learningProgress = queuedWords.reduce(
    (sum, word) =>
      sum +
      (word?.status === "LEARNING"
        ? Math.min(2, Math.max(0, word.step)) / 3
        : 0),
    0,
  );
  const reviewInQueue = queuedWords.filter((word) => word?.status === "REVIEW" || word?.status === "MASTERED").length;
  const resolvedCount = Math.max(0, initialSessionCount - queue.length);
  const total = Math.max(initialSessionCount, queue.length + resolvedCount);
  const card = pair.words.find((w) => w.id === queue[0]);
  const typing = !!card && (inputPractice || needsTyping(card, settings.studyMode));
  const firstEncounter = card?.status === "NEW" && card.repCount === 0;
  const repeatLabel = firstEncounter ? "dontKnow" : "repeat";
  const knowLabel = firstEncounter ? "alreadyKnow" : "know";
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
    assistedTurn.current = false;
    setInputPractice(false);
    setEvaluation(null);
    evaluated.current = false;
    setTurn((n) => n + 1);
    setRevealed(false);
    setAudioError(false);
  };
  useEffect(() => {
    if (evaluation) gradeButton.current?.focus({ preventScroll: true });
  }, [evaluation]);
  const cardStatusLabel = card ? t(card.status === "NEW" ? "new" : card.status === "LEARNING" ? "learning" : card.status === "MASTERED" ? "mastered" : "review") + (card.status === "LEARNING" ? ` ${card.step}/3` : "") : "";
  const category =
    card && pair.categories.find((c) => card.categoryIds.includes(c.id));
  const start = () => {
    const nextQueue = buildStudyQueue(pair, mode, selection);
    if (!nextQueue.length) return;
    setSessionId(crypto.randomUUID());
    setQueue(nextQueue);
    setInitialSessionCount(nextQueue.length);
    setStarted(true);
    setCompleted(0);
    setHistory([]);
    resetTurn();
    setReverse(false);
  };
  const action = (a: Action) => {
    if (!started || goalReached || !card || committedTurn.current === turn || (typing && !revealed && a === "master"))
      return;
    committedTurn.current = turn;
    setLastAction(a);
    setReverse(false);
    const assisted = a !== "master" && typing && (evaluation === "ASSISTED" || (!revealed && assistedTurn.current));
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
        initialSessionCount,
        activity: { activityLog: { ...activityLog }, recallModes: { ...recallModes } },
        dailyProgress: progress,
      },
    ]);
    const nextPair = {
      ...pair,
      words: pair.words.map((w) => (w.id === updated.id ? updated : w)),
    };
    update(nextPair, reviewOrder + 1, a === "know" || a === "master"
      ? recordRecall(progress, `${settings.sourceLanguage}-${settings.targetLanguage}`, card.id)
      : progress, recordStudyActivity({ activityLog, recallModes }, typing && inputPractice ? typingInput : "SWIPE_ONLY"));
    const continuation = continueQueue(
      queue,
      nextPair,
      mode,
      updated,
      reinsertionDistance(card, a, assisted),
      selection,
      assisted,
    );
    setQueue(continuation.queue);
    if (!continuation.queue.length) setStarted(false);
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
      previous.activity,
    );
    setQueue(previous.queue);
    setStarted(true);
    setCompleted(previous.completed);
    setInitialSessionCount(previous.initialSessionCount);
    setMode(previous.mode);
    setLastAction(null);
    setHistory(history.slice(0, -1));
    resetTurn();
    setReverse(true);
  };
  const removeFromSession = () => {
    if (!card || committedTurn.current === turn) return;
    committedTurn.current = turn;
    setHistory((h) => [...h, {
      cardId: card.id, previousCardState: card, previousQueueIndex: 0,
      queue: [...queue], reviewOrder, mode, completed, initialSessionCount,
      dailyProgress: progress,
      activity: { activityLog: { ...activityLog }, recallModes: { ...recallModes } },
    }]);
    const remaining = queue.filter((id) => id !== card.id);
    setQueue(remaining);
    setInitialSessionCount((count) => Math.max(0, count - (queue.length - remaining.length)));
    if (!remaining.length) setStarted(false);
    setLastAction(null);
    resetTurn();
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
    sessionComplete || (started && (goalReached || !typing || revealed)),
  );
  const { drag, handlers } = useSwipeGesture(
    action,
    reveal,
    typing && !revealed,
  );
  const tint = drag.y < -40 && Math.abs(drag.y) > Math.abs(drag.x) ? "master" : drag.x > 0 ? "know" : "repeat";
  const distance = Math.abs(tint === "master" ? drag.y : drag.x);
  const transform = `translate(${drag.x}px, ${drag.y}px) rotate(${(drag.x / 100) * 8}deg)`;
  const changeMode = (requested: Mode) => {
    if (started) return;
    setMode(requested);
    setCompleted(0);
    setInitialSessionCount(0);
    setHistory([]);
    resetTurn();
  };
  const endSession = () => {
    setStarted(false); setCompleted(0); setInitialSessionCount(0); setQueue([]); setHistory([]);
  };
  return (
    <div className="study-view" data-active={started} data-keyboard={keyboardOpen} data-can-undo={history.length > 0}>
      {!started && (
        <div className="page-heading">
          <div>
            <p className="eyebrow">{t("learn")}</p>
            <h1 title={t("masteryRoute")}>{t("study")}</h1>
            <p className="subtitle">{t("studySub")}</p>
          </div>
        </div>
      )}
      {!started && selection && (
        <p className="practice-note">{t("selectedPracticeHint")}</p>
      )}
      {!started && <div className="summary-grid">
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
      </div>}
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
        <div className="session-bar">
          <button
            className="icon-button session-undo"
            aria-label={t("undo")}
            title={t("undo")}
            disabled={!history.length}
            onClick={undo}
          >
            <RotateCcw size={15} />
          </button>
          {sessionVisible ? (
            <div className="session-composition">
              <span className="session-pill session-pill-new" title={t("new")}>
                <span className="session-dot" aria-hidden="true" />
                <span className="sr-only">{t("new")}: </span><strong>{newInQueue}</strong>
              </span>
              <span className="session-pill session-pill-active" title={`${t("learning")} / ${t("review")}`}>
                <span className="session-dot" aria-hidden="true" />
                <span className="sr-only">{t("learning")} / {t("review")}: </span><strong>{learningInQueue + reviewInQueue}</strong>
              </span>
              <span className="session-pill session-pill-resolved" title={t("sessionResolved")}>
                <span className="session-dot" aria-hidden="true" />
                <span className="sr-only">{t("sessionResolved")}: </span><strong>{resolvedCount}</strong>
              </span>
            </div>
          ) : <span className="eyebrow">{t("session")}</span>}
          <span className="session-count">
            {!sessionVisible && <span>{available.length}</span>}
            {goal != null && <span className="session-goal" aria-label={`${t("dailyGoal")}: ${progress.wordIds.length} / ${goal}`} title={t("dailyGoal")}>
              <span className="sr-only">{t("dailyGoal")}: </span>{progress.wordIds.length}/{goal}
            </span>}
            {started && !goalReached && <button className="end-session" onClick={endSession} title={t("end")}><LogOut size={18} aria-hidden="true" /><span className="sr-only">{t("end")}</span></button>}
          </span>
        </div>
        {sessionVisible && <div className="progress-track" role="progressbar" aria-label={t("sessionResolved")} aria-valuemin={0} aria-valuemax={total} aria-valuenow={resolvedCount}>
          <div className="progress-resolved" style={{ width: `${total ? resolvedCount / total * 100 : 0}%` }} />
          <div className="progress-learning" style={{ width: `${total ? learningProgress / total * 100 : 0}%` }} />
          <div className="progress-remaining" style={{ width: `${total ? (queue.length - learningProgress) / total * 100 : 0}%` }} />
        </div>}
        {goalReached ? (
          <div className="session-empty daily-goal-card" role="region" aria-labelledby="daily-goal-title">
            <div className="goal-copy">
            <div className="empty-icon goal-check" aria-hidden="true"><Check size={28} /></div>
            <p className="eyebrow">{t("dailyGoal")}</p>
            <h2 id="daily-goal-title">{t("goalReached")}</h2>
            <p>{t("goalCongratulations")}</p>
            <strong className="goal-total">{progress.wordIds.length} / {goal}</strong>
            </div>
            <div className="goal-actions">
              <button ref={goalButton} className="primary-button" onClick={() => update(pair, reviewOrder, { ...progress, acknowledgedGoal: goal })}>
                {t("continueStudy")}<ArrowRight size={17} />
              </button>
              <button className="outline-button" onClick={() => {
                update(pair, reviewOrder, { ...progress, acknowledgedGoal: goal });
                setStarted(false);
                setCompleted(0);
                setInitialSessionCount(0);
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
                  !revealed
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
                <div className="card-status-marker">
                  <span
                    className={`stat-dot ${card.status === "NEW" ? "blue" : card.status === "MASTERED" ? "green" : "amber"}`}
                    role="img"
                    aria-label={cardStatusLabel}
                    title={cardStatusLabel}
                  />
                  <span className="card-progress-label" title={card.status === "REVIEW" && card.nextReviewDate ? `${t("scheduledReview")}: ${new Date(card.nextReviewDate).toLocaleDateString(settings.interfaceLanguage)}` : undefined}>
                    {cardStatusLabel}
                  </span>
                  {category && (
                    <span className="card-category-label" title={category.name[settings.interfaceLanguage]}>
                      {category.name[settings.interfaceLanguage]}
                    </span>
                  )}
                </div>
                  <details className="card-menu" onClick={(event) => event.stopPropagation()} onPointerDown={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                    <summary aria-label={t("settings")}><MoreHorizontal size={22} /></summary>
                    <div className="card-menu-content">
                      <button type="button" onClick={() => openLibrary(card.id)}><FolderOpen size={16} aria-hidden="true" />{t("openWordInFolder")}</button>
                      <button type="button" onClick={removeFromSession}><ListMinus size={16} aria-hidden="true" />{t("removeFromSession")}</button>
                    </div>
                  </details>
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
                    startWithInput={inputPractice}
                    key={turn}
                    resumeTurn={`${snapshotKey}:${sessionId}:${card.id}:${turn}`}
                    card={card}
                    settings={settings}
                    inputMode={typingInput}
                    onInputModeChange={(mode) => { setTypingInput(mode); setInputPractice(true); }}
                    evaluation={evaluation}
                    onEvaluate={evaluate}
                    onAssistance={() => { assistedTurn.current = true; }}
                    onListen={() =>
                      setAudioError(
                        !speak(card.targetWord, settings.targetLanguage),
                      )
                    }
                    audioError={audioError}
                    t={t}
                  />
                ) : (
                  <div className="card-body">
                    <div className="card-source-prompt">
                      <h2 lang={settings.sourceLanguage}>{card.translations.join(" · ")}</h2>
                    </div>
                    {revealed ? (
                      <div className="card-answer">
                        <div className="card-prompt">
                          <h2 lang={settings.targetLanguage}>{card.targetWord}</h2>
                          {card.transcription && <p className="transcription">{card.transcription}</p>}
                          <button className="audio-button" aria-label={t("listen")} onClick={(event) => {
                            event.stopPropagation();
                            setAudioError(!speak(card.targetWord, settings.targetLanguage));
                          }}><Volume2 size={18} /></button>
                          {audioError && <small role="status">{t("audioError")}</small>}
                        </div>
                      </div>
                    ) : (
                      <div className="recall-choices">
                        <button aria-label={t("keyboard")} title={t("keyboard")} onClick={(event) => { event.stopPropagation(); setTypingInput("KEYBOARD"); setInputPractice(true); }}><Keyboard size={22} /></button>
                        <button aria-label={t("reveal")} title={t("reveal")} onClick={(event) => { event.stopPropagation(); reveal(); }}><Eye size={22} /></button>
                        <button aria-label={t("tiles")} title={t("tiles")} onClick={(event) => { event.stopPropagation(); setTypingInput("TILES"); setInputPractice(true); }}><Grid2X2 size={22} /></button>
                      </div>
                    )}
                  </div>
                )}

              </article>
            </div>
            <div className={`action-dock ${typing ? "typing-actions" : ""}`} role="group">
              <div className={`action-bar ${typing ? "typing-actions" : ""}`}>
                <button
                  ref={typing && evaluation && evaluation !== "CORRECT" ? gradeButton : undefined}
                  className={`action-repeat ${typing && evaluation && evaluation !== "CORRECT" ? "preselected" : ""}`}
                  onClick={() => action("repeat")}
                >
                  <ArrowLeft size={18} />
                  <span>{t(repeatLabel)}</span>
                </button>

                <button
                  ref={typing && evaluation === "CORRECT" ? gradeButton : undefined}
                  className={`action-know ${typing && evaluation === "CORRECT" ? "preselected" : ""}`}
                  onClick={() => action("know")}
                >
                  <span>{t(knowLabel)}</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              </div>


          </>
        ) : (
          <div className="session-empty">
            <div className="setup-copy">
            <div className="empty-icon">
              {sessionComplete ? <Check size={28} /> : <BookOpen size={28} />}
            </div>
            <h2 role={sessionComplete ? "status" : undefined}>{sessionComplete ? t("sessionComplete") : t("ready")}</h2>
            <p>
              {sessionComplete
                ? t("sessionCompleteSub")
                : available.length
                  ? `${available.length} ${t("remaining")}. ${t("studySub")}`
                  : t(pool.length && mastered === pool.length ? "completeSub" : pool.length ? "emptyMode" : "empty")}
            </p>
            </div>
            <button
              className="primary-button"
              onClick={available.length ? start : pool.length ? undefined : () => openLibrary()}
              disabled={!available.length && pool.length > 0}
            >
              {available.length
                ? sessionComplete
                  ? t("restart")
                  : t("start")
                : t(pool.length ? "start" : "categories")}
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
              <kbd>←</kbd> {t(repeatLabel)}
            </span>
            <span>
              <kbd>{typing ? "Enter / Space" : "Space"}</kbd>{" "}
              {t(typing ? "next" : "reveal")}
            </span>
            <span>
              <kbd>→</kbd> {t(knowLabel)}
            </span>
            <span><kbd>↑</kbd> {t("master")}</span>
            <span>
              <kbd>Ctrl Z</kbd> {t("undo")}
            </span>
          </div>
        )}
      </section>
    </div>
  );
}
