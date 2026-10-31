import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, Languages, Plus, X } from "lucide-react";
import type {
  Category,
  PairData,
  Settings,
  StudySelection,
  WordCard,
} from "../types";
import { languageNames, languages } from "../types";
import type { T } from "../i18n/translations";
import { translate } from "../services/translator";
import { suggestNounArticle } from "../services/nounArticle";
type ExampleDraft = WordCard["examples"][number] & { id: string };
const emptyExample = (): ExampleDraft => ({ id: crypto.randomUUID(), targetSentence: "", translatedSentence: "" });
export function WordForm({
  pair,
  settings,
  update,
  t,
  existing,
  onClose,
  onPractice,
  initialCategoryId,
}: {
  pair: PairData;
  settings: Settings;
  update: (p: PairData) => void;
  t: T;
  existing?: WordCard;
  onClose?: () => void;
  onPractice?: (selection: StudySelection) => void;
  initialCategoryId?: string;
}) {
  const id = useId();
  const [word, setWord] = useState(existing?.targetWord ?? "");
  const [translation, setTranslation] = useState(
    existing?.translations.join("; ") ?? "",
  );
  const [transcription, setTranscription] = useState(
    existing?.transcription ?? "",
  );
  const [examples, setExamples] = useState<ExampleDraft[]>(() => existing?.examples.length
    ? existing.examples.map((example) => ({ ...example, id: crypto.randomUUID() }))
    : [emptyExample()]);
  const [categoryId, setCategoryId] = useState(
    existing?.categoryIds[0] ?? initialCategoryId ?? pair.categories[0]?.id ?? "",
  );
  const [newFolder, setNewFolder] = useState("");
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [nounSuggestion, setNounSuggestion] = useState<string>();
  const [checkingArticle, setCheckingArticle] = useState(false);
  const nounController = useRef<AbortController | null>(null);
  const acceptedNoun = useRef<{ word: string; language: Settings["targetLanguage"] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyExamples, setBusyExamples] = useState<string[]>([]);
  const [message, setMessage] = useState<"translateError" | "offline" | null>(
    null,
  );
  const [saved, setSaved] = useState(false);
  const [savedWordId, setSavedWordId] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const sentenceControllers = useRef(new Map<string, AbortController>());
  const revision = useRef(0);
  const nounContext = examples[0]?.targetSentence ?? "";
  useEffect(() => {
    setNounSuggestion(undefined);
    setCheckingArticle(false);
    if (acceptedNoun.current?.word === word && acceptedNoun.current.language === settings.targetLanguage) return;
    if (!word.trim() || word === existing?.targetWord || settings.targetLanguage === "en" || settings.targetLanguage === "ru") return;
    const abort = new AbortController();
    nounController.current = abort;
    const timer = setTimeout(() => {
      if (abort.signal.aborted) return;
      setCheckingArticle(true);
      void suggestNounArticle(word, settings.targetLanguage, nounContext, abort.signal, settings.geminiApiKey)
        .then((suggestion) => { if (!abort.signal.aborted) setNounSuggestion(suggestion); })
        .catch(() => { /* Keep manual word entry available when analysis is offline. */ })
        .finally(() => { if (!abort.signal.aborted) setCheckingArticle(false); });
    }, 500);
    return () => { clearTimeout(timer); abort.abort(); };
  }, [word, nounContext, settings.targetLanguage, settings.geminiApiKey, existing?.targetWord]);
  const request = async (text: string) => {
    if (!text.trim()) return;
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    const version = revision.current;
    setBusy(true);
    setMessage(null);
    try {
      const result = await translate(
        text,
        settings.targetLanguage,
        settings.sourceLanguage,
        abort.signal,
      );
      if (!abort.signal.aborted && version === revision.current) {
        setTranslation(result.primary);
        setAlternatives(result.alternatives);
        if (result.offline) setMessage("offline");
      }
    } catch {
      if (!abort.signal.aborted && version === revision.current)
        setMessage("translateError");
    } finally {
      if (!abort.signal.aborted) setBusy(false);
    }
  };
  useEffect(
    () => () => {
      controller.current?.abort();
      sentenceControllers.current.forEach((controller) => controller.abort());
    },
    [],
  );
  const cancelSentence = (exampleId: string) => {
    sentenceControllers.current.get(exampleId)?.abort();
    sentenceControllers.current.delete(exampleId);
    setBusyExamples((ids) => ids.filter((id) => id !== exampleId));
  };
  const editExample = (exampleId: string, patch: Partial<WordCard["examples"][number]>) => {
    cancelSentence(exampleId);
    setExamples((rows) => rows.map((row) => row.id === exampleId ? { ...row, ...patch } : row));
  };
  const translateSentence = async (example: ExampleDraft) => {
    cancelSentence(example.id);
    const abort = new AbortController();
    sentenceControllers.current.set(example.id, abort);
    setBusyExamples((ids) => [...ids, example.id]);
    setMessage(null);
    try {
      const result = await translate(
        example.targetSentence,
        settings.targetLanguage,
        settings.sourceLanguage,
        abort.signal,
      );
      if (!abort.signal.aborted)
        setExamples((rows) => rows.map((row) => row.id === example.id ? { ...row, translatedSentence: result.primary } : row));
    } catch {
      if (!abort.signal.aborted) setMessage("translateError");
    } finally {
      if (sentenceControllers.current.get(example.id) === abort) {
        sentenceControllers.current.delete(example.id);
        setBusyExamples((ids) => ids.filter((id) => id !== example.id));
      }
    }
  };
  const save = () => {
    acceptedNoun.current = null;
    nounController.current?.abort();
    setNounSuggestion(undefined);
    setCheckingArticle(false);
    controller.current?.abort();
    sentenceControllers.current.forEach((controller) => controller.abort());
    sentenceControllers.current.clear();
    revision.current++;
    setBusy(false);
    setBusyExamples([]);
    let categories = pair.categories;
    let selectedId = categoryId;
    if (categoryId === "__new" && newFolder.trim()) {
      selectedId = crypto.randomUUID();
      categories = [
        ...categories,
        {
          id: selectedId,
          isCustom: true,
          isActiveForStudy: true,
          name: Object.fromEntries(
            languages.map((l) => [l, newFolder.trim()]),
          ) as Category["name"],
        },
      ];
    }
    const now = Date.now();
    const card: WordCard = {
      ...(existing ?? {
        id: crypto.randomUUID(),
        status: "NEW",
        step: 0,
        interval: 0, nextReviewDate: 0, easeFactor: 2.3, reviewRepetitions: 0,
        repCount: 0,
        lastReviewedOrder: 0,
        createdAt: now,
      }),
      targetWord: word.trim(),
      transcription: transcription.trim() || undefined,
      translations: translation
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean),
      examples: examples.filter((example) => example.targetSentence.trim()).map((example) => ({
        targetSentence: example.targetSentence.trim(),
        translatedSentence: example.translatedSentence.trim(),
      })),
      categoryIds: [
        ...new Set([selectedId, ...(existing?.categoryIds.slice(1) ?? [])]),
      ],
    };
    update({
      ...pair,
      categories,
      words: existing
        ? pair.words.map((w) => (w.id === existing.id ? card : w))
        : [...pair.words, card],
    });
    if (existing) onClose?.();
    else {
      setWord("");
      setTranslation("");
      setTranscription("");
      setExamples([emptyExample()]);
      setAlternatives([]);
      setMessage(null);
      setSaved(true);
      setSavedWordId(card.id);
      revision.current++;
      controller.current?.abort();
      setBusy(false);
      if (categoryId === "__new") {
        setCategoryId(selectedId);
        setNewFolder("");
      }
    }
  };
  return (
    <div className="word-form-wrap">
      {!existing && !onClose && (
        <div className="page-heading">
          <div>
            <p className="eyebrow">{t("add")}</p>
            <h1>{t("addTitle")}</h1>
            <p className="subtitle">{t("addSub")}</p>
          </div>
        </div>
      )}
      <form
        className="word-form panel"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="word-form-fields">
        {(existing || onClose) && (
          <div className="dialog-heading">
            <h2>{t(existing ? "edit" : "add")}</h2>
            <button
              type="button"
              className="icon-button"
              onClick={onClose}
              aria-label={t("close")}
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="form-pair">
          <Languages size={18} />
          <span>{languageNames[settings.targetLanguage]}</span>
          <ArrowRight size={15} />
          <span>{languageNames[settings.sourceLanguage]}</span>
        </div>
        <label htmlFor={`${id}-word`}>
          <span className="label-action">
            {t("targetWord")}
            <button
              type="button"
              className="inline-button"
              disabled={!word.trim() || busy}
              onClick={() => { void request(word); }}
            >
              {busy ? t("translating") : t("translate")}
            </button>
          </span>
            <input
              id={`${id}-word`}
              aria-label={t("targetWord")}
              required
              autoComplete="off"
              maxLength={100}
              value={word}
              lang={settings.targetLanguage}
              onChange={(e) => {
                acceptedNoun.current = null;
                controller.current?.abort();
                setWord(e.target.value);
                revision.current++;
                setSaved(false);
                setBusy(false);
                setAlternatives([]);
                setMessage(null);
                if (!existing) setTranslation("");
              }}
            />
        </label>
        {checkingArticle && <p className="form-message" role="status">{t("checkingArticle")}</p>}
        {nounSuggestion && <div className="translation-chips" aria-live="polite">
          <button type="button" onClick={() => {
            acceptedNoun.current = { word: nounSuggestion, language: settings.targetLanguage };
            nounController.current?.abort();
            controller.current?.abort();
            setBusy(false);
            setWord(nounSuggestion);
            setNounSuggestion(undefined);
            revision.current++;
            setSaved(false);
          }}>
            <Plus size={12} aria-hidden="true" />{t("useNounArticle").replace("{word}", nounSuggestion)}
          </button>
        </div>}
        <label>
          {t("translation")}
          <input
            required
            maxLength={1000}
            value={translation}
            lang={settings.sourceLanguage}
            onChange={(e) => {
              revision.current++;
              setTranslation(e.target.value);
            }}
          />
        </label>
        {alternatives.length > 0 && (
          <div className="translation-chips">
            {alternatives.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => {
                  revision.current++;
                  setTranslation((previous) =>
                    [
                      ...new Set([
                        ...previous
                          .split(";")
                          .map((s) => s.trim())
                          .filter(Boolean),
                        a,
                      ]),
                    ].join("; "),
                  );
                }}
              >
                <Plus size={12} />
                {a}
              </button>
            ))}
          </div>
        )}
        {message && (
          <p className="form-message" role="status">
            {t(message)}
          </p>
        )}
        <label>
          {t("transcription")}
          <input
            maxLength={200}
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
          />
        </label>
        <div className="form-divider" />
        {examples.map((example, index) => (
        <fieldset className="word-example" key={example.id}>
          <legend>{t("exampleNumber").replace("{count}", String(index + 1))}</legend>
          {examples.length > 1 && <button type="button" className="icon-button example-remove" aria-label={`${t("removeExample")} ${index + 1}`} onClick={() => {
            cancelSentence(example.id);
            setExamples((rows) => rows.filter((row) => row.id !== example.id));
          }}><X size={16} aria-hidden="true" /></button>}
        <label htmlFor={`${id}-${example.id}-sentence`}>
          {t("context")}
          <textarea
            id={`${id}-${example.id}-sentence`}
            required={!!example.translatedSentence.trim()}
            maxLength={1000}
            rows={2}
            value={example.targetSentence}
            lang={settings.targetLanguage}
            onChange={(e) => editExample(example.id, { targetSentence: e.target.value })}
          />
        </label>
        <label htmlFor={`${id}-${example.id}-translation`}>
          <span className="label-action">
            {t("contextTranslation")}
            <button
              className="inline-button"
              aria-label={`${t("translate")}: ${t("exampleNumber").replace("{count}", String(index + 1))}`}
              type="button"
              disabled={!example.targetSentence.trim() || busyExamples.includes(example.id)}
              onClick={() => {
                void translateSentence(example);
              }}
            >
              {busyExamples.includes(example.id) ? t("translating") : t("translate")}
            </button>
          </span>
          <textarea
            id={`${id}-${example.id}-translation`}
            maxLength={2000}
            rows={2}
            value={example.translatedSentence}
            lang={settings.sourceLanguage}
            onChange={(e) => editExample(example.id, { translatedSentence: e.target.value })}
          />
        </label>
        </fieldset>
        ))}
        <button type="button" className="outline-button add-example" disabled={examples.length >= 3} onClick={() => setExamples((rows) => rows.length < 3 ? [...rows, emptyExample()] : rows)}>
          <Plus size={16} aria-hidden="true" />{t("addExample")}
        </button>
        </div>
        <div className="word-form-actions">
        <div className="word-form-save-row">
        <label>
          <span className="sr-only">{t("folder")}</span>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {pair.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name[settings.interfaceLanguage]}
              </option>
            ))}
            <option value="__new">+ {t("newFolder")}</option>
          </select>
        </label>
        <button
          className="primary-button"
          disabled={
            !word.trim() ||
            !translation.trim() ||
            !categoryId ||
            (categoryId === "__new" && !newFolder.trim())
          }
          type="submit"
        >
          {existing ? t("saveChanges") : t("save")}
          <ArrowRight size={17} />
        </button>
        </div>
        {categoryId === "__new" && (
          <label className="word-form-folder-name">
            {t("folderName")}
            <input
              required
              maxLength={80}
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
            />
          </label>
        )}
        {saved && (
          <p className="success-message" role="status">
            <Check size={16} />
            {t("saved")}
          </p>
        )}
        {saved && savedWordId && onPractice && (
          <button
            type="button"
            className="outline-button"
            onClick={() => onPractice({ kind: "word", id: savedWordId })}
          >
            {t("practiceSavedWord")}
            <ArrowRight size={17} />
          </button>
        )}
        </div>
      </form>
    </div>
  );
}
