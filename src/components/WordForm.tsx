import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, Languages, Plus, X } from "lucide-react";
import type { Category, PairData, Settings, WordCard } from "../types";
import { languageNames, languages } from "../types";
import type { T } from "../i18n/translations";
import { translate } from "../services/translator";
export function WordForm({
  pair,
  settings,
  update,
  t,
  existing,
  onClose,
}: {
  pair: PairData;
  settings: Settings;
  update: (p: PairData) => void;
  t: T;
  existing?: WordCard;
  onClose?: () => void;
}) {
  const id = useId();
  const [word, setWord] = useState(existing?.targetWord ?? "");
  const [translation, setTranslation] = useState(
    existing?.translations.join("; ") ?? "",
  );
  const [transcription, setTranscription] = useState(
    existing?.transcription ?? "",
  );
  const [sentence, setSentence] = useState(
    existing?.examples[0]?.targetSentence ?? "",
  );
  const [sentenceTranslation, setSentenceTranslation] = useState(
    existing?.examples[0]?.translatedSentence ?? "",
  );
  const [categoryId, setCategoryId] = useState(
    existing?.categoryIds[0] ?? pair.categories[0]?.id ?? "",
  );
  const [newFolder, setNewFolder] = useState("");
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [sentenceBusy, setSentenceBusy] = useState(false);
  const [message, setMessage] = useState<"translateError" | "offline" | null>(
    null,
  );
  const [saved, setSaved] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const sentenceController = useRef<AbortController | null>(null);
  const manual = useRef(!!existing);
  const revision = useRef(0);
  const sentenceRevision = useRef(0);
  const request = async (text: string, force = false) => {
    if (!text.trim() || (manual.current && !force)) return;
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
  useEffect(() => {
    const timer = setTimeout(() => {
      void request(word);
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.current?.abort();
    }; /* word input is the only debounce trigger */
  }, [word]); // eslint-disable-line
  useEffect(
    () => () => {
      controller.current?.abort();
      sentenceController.current?.abort();
    },
    [],
  );
  const translateSentence = async () => {
    sentenceController.current?.abort();
    const abort = new AbortController();
    sentenceController.current = abort;
    const version = sentenceRevision.current;
    setSentenceBusy(true);
    setMessage(null);
    try {
      const result = await translate(
        sentence,
        settings.targetLanguage,
        settings.sourceLanguage,
        abort.signal,
      );
      if (!abort.signal.aborted && version === sentenceRevision.current)
        setSentenceTranslation(result.primary);
    } catch {
      if (!abort.signal.aborted) setMessage("translateError");
    } finally {
      if (!abort.signal.aborted) setSentenceBusy(false);
    }
  };
  const save = () => {
    controller.current?.abort();
    sentenceController.current?.abort();
    revision.current++;
    sentenceRevision.current++;
    setBusy(false);
    setSentenceBusy(false);
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
        interval: 0,
        easeFactor: 2.5,
        nextReviewDate: 0,
        createdAt: now,
      }),
      targetWord: word.trim(),
      transcription: transcription.trim() || undefined,
      translations: translation
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean),
      examples: sentence.trim()
        ? [
            {
              targetSentence: sentence.trim(),
              translatedSentence: sentenceTranslation.trim(),
            },
            ...(existing?.examples.slice(1) ?? []),
          ]
        : [],
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
      setSentence("");
      setSentenceTranslation("");
      setAlternatives([]);
      setMessage(null);
      setSaved(true);
      manual.current = false;
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
      {!existing && (
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
        {existing && (
          <div className="dialog-heading">
            <h2>{t("edit")}</h2>
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
          {t("targetWord")}
          <div className="input-action">
            <input
              id={`${id}-word`} aria-label={t('targetWord')}
              required
              autoComplete="off"
              maxLength={100}
              value={word}
              lang={settings.targetLanguage}
              onChange={(e) => {
                setWord(e.target.value);
                manual.current = false;
                revision.current++;
                setSaved(false);
                setBusy(false);
                setAlternatives([]);
                setMessage(null);
                if (!existing) setTranslation("");
              }}
            />
            <button
              type="button"
              className="inline-button"
              disabled={!word.trim() || busy}
              onClick={() => {
                void request(word, true);
              }}
            >
              {busy ? t("translating") : t("translate")}
            </button>
          </div>
        </label>
        <label>
          {t("translation")}
          <input
            required
            maxLength={1000}
            value={translation}
            lang={settings.sourceLanguage}
            onChange={(e) => {
              manual.current = true;
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
                  manual.current = true;
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
        <label>
          {t("context")}
          <textarea
            maxLength={1000}
            rows={2}
            value={sentence}
            lang={settings.targetLanguage}
            onChange={(e) => {
              sentenceRevision.current++;
              setSentence(e.target.value);
            }}
          />
        </label>
        <label htmlFor={`${id}-sentence-translation`}>
          <span className="label-action">
            {t("contextTranslation")}
            <button
              className="inline-button"
              aria-label={`${t("translate")}: ${t("context")}`}
              type="button"
              disabled={!sentence.trim() || sentenceBusy}
              onClick={() => {
                void translateSentence();
              }}
            >
              {sentenceBusy ? t("translating") : t("translate")}
            </button>
          </span>
          <textarea
            id={`${id}-sentence-translation`} aria-label={t('contextTranslation')}
            maxLength={2000}
            rows={2}
            value={sentenceTranslation}
            lang={settings.sourceLanguage}
            onChange={(e) => {
              sentenceRevision.current++;
              setSentenceTranslation(e.target.value);
            }}
          />
        </label>
        <label>
          {t("folder")}
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
        {categoryId === "__new" && (
          <label>
            {t("folderName")}
            <input
              required
              maxLength={80}
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
            />
          </label>
        )}
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
        {saved && (
          <p className="success-message" role="status">
            <Check size={16} />
            {t("saved")}
          </p>
        )}
      </form>
    </div>
  );
}
