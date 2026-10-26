import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowRight, CircleHelp, Volume2 } from "lucide-react";
import type { Evaluation, Settings, TypingInput, WordCard } from "../types";
import type { T } from "../i18n/translations";
import {
  answerDiff,
  answerTarget,
  evaluateAnswer,
  maskedSentence,
  nextHint,
  normalizeAnswer,
  sentenceParts,
} from "../core/typing";

interface Props {
  card: WordCard;
  settings: Settings;
  inputMode: TypingInput;
  evaluation: Evaluation | null;
  onEvaluate: (result: Evaluation) => void;
  onListen: () => void;
  audioError: boolean;
  t: T;
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
export function TypingCard({
  card,
  settings,
  inputMode,
  evaluation,
  onEvaluate,
  onListen,
  audioError,
  t,
}: Props) {
  const [input, setInput] = useState("");
  const [usedHint, setUsedHint] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const attemptCount = useRef(0);
  const attemptStatusId = useId();
  const [tiles] = useState(() => {
    const characters = Array.from(answerTarget(card.targetWord)).map(
      (char, id) => ({ char, id }),
    );
    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }
    return characters;
  });
  const [selected, setSelected] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const submitted = useRef(false);
  useEffect(() => {
    if (!evaluation) {
      if (inputMode === "KEYBOARD") inputRef.current?.focus();
      else {
        setInput(
          selected.map((id) => tiles.find((c) => c.id === id)!.char).join(""),
        );
        slotRef.current?.focus();
      }
    }
  }, [inputMode, evaluation]);
  const chooseInput = (value: string) => {
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
    if (inputMode === "KEYBOARD") inputRef.current?.focus();
    else slotRef.current?.focus();
  };
  const hint = () => {
    if (evaluation || submitted.current) return;
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
        );
    if (!giveUp && result === "INCORRECT") {
      attemptCount.current += 1;
      setFailedAttempts(attemptCount.current);
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
  const tone =
    evaluation === "CORRECT"
      ? "correct"
      : evaluation === "ASSISTED"
        ? "assisted"
        : "incorrect";
  return (
    <div className="typing-card" onKeyDown={keydown}>
      <p lang={settings.sourceLanguage} className="typing-translation">
        {card.translations.join(" · ")}
      </p>
      {!evaluation ? (
        <>
          <p className="typing-instruction">{t("typePrompt")}</p>
          {card.examples[0] && (
            <div className="typing-clues">
              <p lang={settings.sourceLanguage}>
                {card.examples[0].translatedSentence}
              </p>
              {maskedSentence(
                card.examples[0].targetSentence,
                card.targetWord,
              ) !== card.examples[0].targetSentence && (
                <p lang={settings.targetLanguage} className="muted">
                  {maskedSentence(
                    card.examples[0].targetSentence,
                    card.targetWord,
                  )}
                </p>
              )}
            </div>
          )}
          {inputMode === "KEYBOARD" ? (
            <input
              ref={inputRef}
              className="typing-input"
              type="text"
              value={input}
              maxLength={200}
              lang={settings.targetLanguage}
              aria-label={t("answer")}
              aria-invalid={failedAttempts > 0}
              aria-describedby={attemptStatusId}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              onChange={(e) => chooseInput(e.target.value)}
            />
          ) : (
            <>
              <div
                ref={slotRef}
                className="tile-answer"
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
                      setSelected([...selected, tile.id]);
                      setInput(input + tile.char);
                      focusAnswer();
                    }}
                  >
                    {tile.char === " " ? "␣" : tile.char}
                  </button>
                ))}
              </div>
            </>
          )}
          <p id={attemptStatusId} className="typing-attempts" role="status">
            {failedAttempts > 0 && <span>{t("tryAgain")} </span>}
            {t("attemptsRemaining")}: {3 - failedAttempts}
          </p>
          <div className="typing-controls">
            <button
              className="text-button"
              aria-keyshortcuts="Tab"
              onClick={hint}
            >
              <CircleHelp size={16} />
              {t("hint")}
              <kbd>Tab</kbd>
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
          <button
            className="typing-give-up text-button"
            aria-keyshortcuts="Escape"
            onClick={() => submit(true)}
          >
            {t("giveUp")}
            <kbd>Esc</kbd>
          </button>
        </>
      ) : (
        <>
          <div className="typing-correct-word">
            <h2 lang={settings.targetLanguage}>{card.targetWord}</h2>
            {evaluation === "INCORRECT" && (
              <p
                className="answer-diff"
                aria-label={t("answerDiff")}
                lang={settings.targetLanguage}
              >
                {answerDiff(input, card.targetWord, settings.strictAccents).map(
                  (p, i) =>
                    p.kind === "wrong" ? (
                      <del key={i}>{p.text}</del>
                    ) : (
                      <span key={i} className={p.kind}>
                        {p.text}
                      </span>
                    ),
                )}
              </p>
            )}
            {card.transcription && (
              <p className="transcription">{card.transcription}</p>
            )}
            <button
              className="audio-button"
              aria-label={t("listen")}
              onClick={onListen}
            >
              <Volume2 size={20} />
            </button>
            {audioError && <small role="status">{t("audioError")}</small>}
          </div>
          <div className={`typing-feedback ${tone}`} role="status">
            <strong>{t(tone)}</strong>
            <p className="submitted-answer">{input || "—"}</p>
            <p>
              {t(
                evaluation === "CORRECT"
                  ? "correctHint"
                  : evaluation === "ASSISTED"
                    ? "assistedHint"
                    : "incorrectHint",
              )}
            </p>
          </div>
          {card.examples.length > 0 && (
            <div className="context">
              <span className="eyebrow">{t("example")}</span>
              {card.examples.map((example, index) => (
                <div key={index}>
                  <p lang={settings.targetLanguage}>
                    <HighlightedSentence
                      sentence={example.targetSentence}
                      target={card.targetWord}
                    />
                  </p>
                  <p lang={settings.sourceLanguage} className="muted">
                    {example.translatedSentence}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
