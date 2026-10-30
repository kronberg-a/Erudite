import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowRight, ChevronDown, CircleHelp, Eye, Grid2X2, Keyboard, Volume2 } from "lucide-react";
import type { Evaluation, Settings, TypingInput, WordCard } from "../types";
import { speak } from "../core/speech";
import type { T } from "../i18n/translations";
import { readUiState, uiBoolean, uiCount, uiObject, uiString, useUiKey, writeUiState } from "../hooks/useUiState";
import {
  answerTarget,
  evaluateAnswer,
  nextHint,
  normalizeAnswer,
  sentenceParts,
} from "../core/typing";

interface Props {
  startWithInput?: boolean;
  resumeTurn?: string;
  card: WordCard;
  settings: Settings;
  inputMode: TypingInput;
  onInputModeChange?: (mode: TypingInput) => void;
  evaluation: Evaluation | null;
  onEvaluate: (result: Evaluation) => void;
  onAssistance?: () => void;
  onListen: () => void;
  audioError: boolean;
  t: T;
}
interface TypingSnapshot {
  inputChosen?: boolean;
  turn: string; input: string; inputMode: TypingInput; failedInput: string | null;
  usedHint: boolean; failedAttempts: number; tiles: { char: string; id: number }[]; selected: number[];
}
export function HighlightedSentence({
  sentence,
  target,
}: {
  sentence: string;
  target: string;
}) {
  return (
    <>
      {sentenceParts(sentence, target).map((p, i) =>
        p.match ? (
          <strong key={i}>{p.text}</strong>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}
export function CardExamples({ card, settings, t }: { card: WordCard; settings: Settings; t: T }) {
  const [expanded, setExpanded] = useState<number[]>([]);
  const [audioError, setAudioError] = useState(false);
  return <div className="context">
    {card.examples.slice(0, 4).map((example, index) => <div className="example-row" key={index}>
      <button className="example-toggle" aria-label={`${t("example")} ${index + 1}`} aria-expanded={expanded.includes(index)} onClick={(event) => {
        event.stopPropagation();
        setExpanded(expanded.includes(index) ? expanded.filter((i) => i !== index) : [...expanded, index]);
      }}><ChevronDown size={18} /></button>
      <div className="example-copy">
        <p lang={settings.targetLanguage}><HighlightedSentence sentence={example.targetSentence} target={card.targetWord} /></p>
        <p lang={settings.sourceLanguage} className="muted" hidden={!expanded.includes(index)}>{example.translatedSentence}</p>
      </div>
      <button className="example-audio" aria-label={`${t("listen")}: ${example.targetSentence}`} onClick={(event) => {
        event.stopPropagation();
        setAudioError(!speak(example.targetSentence, settings.targetLanguage));
      }}><Volume2 size={16} /></button>
    </div>)}
    {audioError && <small role="status">{t("audioError")}</small>}
  </div>;
}
export function TypingCard({
  startWithInput = false,
  resumeTurn,
  card,
  settings,
  inputMode: initialInputMode,
  onInputModeChange,
  evaluation,
  onEvaluate,
  onAssistance,
  onListen,
  audioError,
  t,
}: Props) {
  const snapshotKey = useUiKey("typing");
  const [resume] = useState(() => {
    const characters = Array.from(answerTarget(card.targetWord));
    return readUiState<TypingSnapshot | null>(snapshotKey, null, (value) => uiObject(value) && value.turn === resumeTurn && uiString(value.input) &&
      ["KEYBOARD", "TILES"].includes(value.inputMode as string) && (value.failedInput === null || uiString(value.failedInput)) &&
      (value.inputChosen === undefined || uiBoolean(value.inputChosen)) && uiBoolean(value.usedHint) && uiCount(value.failedAttempts) && value.failedAttempts <= 3 &&
      Array.isArray(value.tiles) && value.tiles.length === characters.length && value.tiles.every((tile) => uiObject(tile) && uiCount(tile.id) && characters[tile.id] === tile.char) &&
      new Set(value.tiles.map((tile) => tile.id)).size === characters.length && Array.isArray(value.selected) &&
      value.selected.every((id) => uiCount(id) && id < characters.length) && new Set(value.selected).size === value.selected.length);
  });
  const [inputChosen, setInputChosen] = useState(startWithInput || resume?.inputChosen === true || !!resume?.input);
  const [input, setInput] = useState(resume?.input ?? "");
  const [inputMode, setInputMode] = useState(resume?.inputMode ?? initialInputMode);
  const [failedInput, setFailedInput] = useState<string | null>(resume?.failedInput ?? null);
  const [usedHint, setUsedHint] = useState(resume?.usedHint ?? false);
  const [failedAttempts, setFailedAttempts] = useState(resume?.failedAttempts ?? 0);
  const attemptCount = useRef(resume?.failedAttempts ?? 0);
  const attemptStatusId = useId();
  const [tiles] = useState(() => {
    if (resume) return resume.tiles;
    const characters = Array.from(answerTarget(card.targetWord)).map(
      (char, id) => ({ char, id }),
    );
    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }
    return characters;
  });
  const [selected, setSelected] = useState<number[]>(resume?.selected ?? []);
  const inputRef = useRef<HTMLInputElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const submitted = useRef(!!evaluation);
  useEffect(() => {
    if (resumeTurn) writeUiState(snapshotKey, { turn: resumeTurn, inputChosen, input, inputMode, failedInput, usedHint, failedAttempts, tiles, selected });
  }, [snapshotKey, resumeTurn, inputChosen, input, inputMode, failedInput, usedHint, failedAttempts, tiles, selected]);
  useEffect(() => {
    if (!evaluation && inputChosen) {
      if (inputMode === "KEYBOARD") inputRef.current?.focus({ preventScroll: true });
      else {
        setInput(
          selected.map((id) => tiles.find((c) => c.id === id)!.char).join(""),
        );
        slotRef.current?.focus({ preventScroll: true });
      }
    }
  }, [inputMode, evaluation, inputChosen]);
  const chooseInput = (value: string) => {
    setFailedInput(null);
    setInput(value);
    const available = [...tiles];
    const ids: number[] = [];
    for (const char of Array.from(value)) {
      const index = available.findIndex(
        (tile) =>
          normalizeAnswer(tile.char, settings.strictAccents) ===
          normalizeAnswer(char, settings.strictAccents),
      );
      if (index >= 0) ids.push(available.splice(index, 1)[0].id);
    }
    setSelected(ids);
  };
  const focusAnswer = () => {
    if (inputMode === "KEYBOARD") inputRef.current?.focus({ preventScroll: true });
    else slotRef.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    if (usedHint || failedAttempts > 0) onAssistance?.();
  }, [usedHint, failedAttempts, onAssistance]);
  const hint = () => {
    if (evaluation || submitted.current) return;
    onAssistance?.();
    setUsedHint(true);
    chooseInput(nextHint(input, card.targetWord, settings.strictAccents));
    focusAnswer();
  };
  const submit = (giveUp = false) => {
    if (evaluation || submitted.current) return;
    const result = giveUp
      ? "INCORRECT"
      : evaluateAnswer(
          input,
          card.targetWord,
          settings.strictAccents,
          usedHint,
          attemptCount.current,
        );
    if (!giveUp && result === "INCORRECT") {
      onAssistance?.();
      attemptCount.current += 1;
      setFailedAttempts(attemptCount.current);
      setFailedInput(input);
      if (attemptCount.current < 3) {
        focusAnswer();
        inputRef.current?.select();
        return;
      }
    }
    submitted.current = true;
    onEvaluate(result);
  };
  const keydown = (event: KeyboardEvent) => {
    if (
      evaluation ||
      event.nativeEvent.isComposing ||
      event.repeat ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    )
      return;
    const target = event.target as HTMLElement;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      submit(true);
    } else if (
      event.key === "Tab" &&
      !event.shiftKey &&
      (target === inputRef.current || target === slotRef.current)
    ) {
      event.preventDefault();
      event.stopPropagation();
      hint();
    } else if (event.key === "Enter" && !target.closest("button")) {
      event.preventDefault();
      event.stopPropagation();
      submit();
    }
  };
  const attemptsBar = (
    <div
        id={attemptStatusId}
        className="typing-attempts"
        role="meter"
        aria-label={t("attemptsRemaining")}
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={3 - failedAttempts}
      >
        {[0, 1, 2].map((attempt) => <span key={attempt} className={attempt < failedAttempts ? "used" : undefined} aria-hidden="true" />)}
    </div>
  );
  return (
    <div className={`typing-card input-${inputMode.toLowerCase()}`} onKeyDown={keydown} data-input-chosen={inputChosen}>
      {!evaluation ? (
        <>
          <div className="typing-prompt">
            <p lang={settings.sourceLanguage} className="typing-translation">{card.translations.join(" · ")}</p>
            <p className="typing-instruction">{t("typePrompt")}</p>
          </div>
          <div className="recall-choices typing-recall-choices">
            <button type="button" aria-label={t("keyboard")} title={t("keyboard")} aria-pressed={inputChosen && inputMode === "KEYBOARD"} onClick={() => {
              setInputChosen(true); setInputMode("KEYBOARD"); onInputModeChange?.("KEYBOARD"); focusAnswer();
            }}><Keyboard size={22} /></button>
            <button type="button" aria-label={t("reveal")} title={`${t("reveal")} (Esc)`} aria-keyshortcuts="Escape" onClick={() => submit(true)}><Eye size={22} /></button>
            <button type="button" aria-label={t("tiles")} title={t("tiles")} aria-pressed={inputChosen && inputMode === "TILES"} onClick={() => {
              setInputChosen(true); setInputMode("TILES"); onInputModeChange?.("TILES"); focusAnswer();
            }}><Grid2X2 size={22} /></button>
          </div>
          {inputChosen && <>
          <div className="typing-entry">
          {inputMode === "KEYBOARD" ? (
            <>
            <input
              ref={inputRef}
              className={`typing-input ${failedInput !== null ? "typing-mistake" : ""}`}
              type="text"
              value={input}
              maxLength={200}
              lang={settings.targetLanguage}
              aria-label={t("answer")}
              aria-invalid={failedInput !== null}
              aria-describedby={attemptStatusId}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              onChange={(e) => chooseInput(e.target.value)}
            />
            {attemptsBar}
            </>
          ) : (
            <>
              <div
                ref={slotRef}
                className={`tile-answer ${failedInput !== null ? "typing-mistake" : ""}`}
                  tabIndex={0}
                role="group"
                aria-label={t("answer")}
                aria-describedby={attemptStatusId}
              >
                {!selected.length && (
                  <span className="muted">{t("answer")}</span>
                )}
                {selected.map((id, index) => {
                  const tile = tiles.find((c) => c.id === id)!;
                  return (
                    <button
                      key={id}
                      className="letter-tile inserted"
                      aria-label={`${t("removeLetter")}: ${tile.char === " " ? t("spaceCharacter") : tile.char}`}
                      onClick={() => {
                        setFailedInput(null);
                        const next = selected.filter((_, i) => i !== index);
                        setSelected(next);
                        setInput(
                          next
                            .map((id) => tiles.find((c) => c.id === id)!.char)
                            .join(""),
                        );
                        focusAnswer();
                      }}
                    >
                      {tile.char === " " ? "␣" : tile.char}
                    </button>
                  );
                })}
              </div>
              {attemptsBar}
              <div className="tile-prompt">
              <div
                className="tile-bank"
                role="group"
                aria-label={t("tileBank")}
              >
                {tiles.map((tile) => (
                  <button
                    key={tile.id}
                    className="letter-tile"
                    disabled={selected.includes(tile.id)}
                    aria-label={
                      tile.char === " " ? t("spaceCharacter") : tile.char
                    }
                    onClick={() => {
                      setFailedInput(null);
                      setSelected([...selected, tile.id]);
                      setInput(input + tile.char);
                      focusAnswer();
                    }}
                  >
                    {tile.char === " " ? "␣" : tile.char}
                  </button>
                ))}
              </div></div>
            </>
          )}
          </div>
          <div className="typing-controls">
            <button
              className="icon-button typing-hint"
              aria-label={t("hint")}
              title={`${t("hint")} (Tab)`}
              aria-keyshortcuts="Tab"
              onClick={hint}
            >
              <CircleHelp size={18} />
            </button>
            <button
              className="primary-button"
              aria-keyshortcuts="Enter"
              onClick={() => submit()}
            >
              {t("checkAnswer")}
              <ArrowRight size={16} />
            </button>

          </div>
          </>}
        </>
      ) : (
        <div className="typing-result">
          <div className="card-source-prompt"><h2 lang={settings.sourceLanguage}>{card.translations.join(" · ")}</h2></div>
          <div className="typing-correct-word card-prompt">
            <h2 lang={settings.targetLanguage}>{card.targetWord}</h2>
            <div className="phonetic-row">
            {card.transcription && (
              <p className="transcription">{card.transcription}</p>
            )}
            <button
              className="audio-button"
              aria-label={t("listen")}
              onClick={onListen}
            >
              <Volume2 size={18} />
            </button>
            </div>
            {audioError && <small role="status">{t("audioError")}</small>}
          </div>


        </div>
      )}

    </div>
  );
}
