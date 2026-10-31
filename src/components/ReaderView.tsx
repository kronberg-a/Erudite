import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Bookmark, BookOpen, BookOpenText, Languages, ListChecks, Plus, Search, Trash2, X } from "lucide-react";
import type { PairData, Settings, StudySelection } from "../types";
import type { T } from "../i18n/translations";
import { translate } from "../services/translator";
import { analyzeContextualSelection, articleWordStats, canonicalizeWordFallback, collectArticleWords, deleteSavedArticle, importArticle, matchingSavedArticle, saveArticle, selectContextualTranslation, sentenceAt, sentenceContextAt, wordKey, wordParts } from "../services/article";
import type { Article, CollectedWord } from "../services/article";
import { analyzeArticleCefr, CEFR_LEVELS } from "../services/cefr";
import type { CefrLevel } from "../services/cefr";
import { clearGeminiBackoff, isGeminiConfigured } from "../services/gemini";
import { GeminiAnalysisError } from "../services/geminiProtocol";
import { uiBoolean, uiCount, uiObject, uiString, useUiState } from "../hooks/useUiState";

interface PickedWord { word: string; offset: number }
interface Entry extends CollectedWord { key: string; offset: number; sentenceOffset?: number; sourceWord?: string; group?: boolean; picked?: PickedWord[]; state: "pending" | "ready" | "error" }
export function ReaderView({ pair, settings, update, onPractice, t }: {
  pair: PairData; settings: Settings; update: (pair: PairData) => void;
  onPractice: (selection: StudySelection) => void; t: T;
}) {
  const [url, setUrl] = useUiState("reader:url", "", uiString);
  const [query, setQuery] = useUiState("reader:query", "", uiString);
  const urlInput = useRef<HTMLInputElement | null>(null);
  const [paste, setPaste] = useUiState("reader:paste", "", uiString);
  const [pasteTitle, setPasteTitle] = useUiState("reader:pasteTitle", "", uiString);
  const [pasteOpen, setPasteOpen] = useUiState("reader:pasteOpen", false, uiBoolean);
  const [article, setArticle] = useUiState<Article | null>("reader:article", null, (value) => value === null || (uiObject(value) &&
    uiString(value.title) && typeof value.text === "string" && value.text.length <= 2_000_000 && uiString(value.url) &&
    (value.language === undefined || typeof value.language === "string")));
  const [entries, setEntries] = useUiState<Entry[]>("reader:entries", [], (value) => Array.isArray(value) && value.length <= 50 && value.every((entry) =>
    uiObject(entry) && [entry.key, entry.word, entry.translation, entry.sentence].every(uiString) && uiCount(entry.offset) &&
    ["ready", "error"].includes(entry.state as string) && (entry.translatedSentence === undefined || uiString(entry.translatedSentence)) &&
    (entry.sentenceOffset === undefined || uiCount(entry.sentenceOffset)) && (entry.sourceWord === undefined || uiString(entry.sourceWord)) &&
    (entry.group === undefined || typeof entry.group === "boolean") && (entry.picked === undefined || (Array.isArray(entry.picked) && entry.picked.every((word) => uiObject(word) && uiString(word.word) && uiCount(word.offset))))));
  const [preview, setPreview] = useState<Entry | null>(null);
  const [folder, setFolder] = useUiState("reader:folder", "", uiString);
  const [savedFolder, setSavedFolder] = useUiState<string | null>("reader:savedFolder", null, (value) => value === null || pair.categories.some((category) => category.id === value));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(false);
  const [picking, setPicking] = useState(false);
  const [picked, setPicked] = useState<PickedWord[]>([]);
  const [activeLevels, setActiveLevels] = useUiState<CefrLevel[]>("reader:levels", [], (value) => Array.isArray(value) && value.length <= CEFR_LEVELS.length && value.every((level) => CEFR_LEVELS.includes(level)));
  const [cefrAnalysis, setCefrAnalysis] = useState<{
    text: string; language: Settings["targetLanguage"]; apiKey?: string;
    state: "loading" | "ready" | "error"; levels?: Map<number, CefrLevel>; issue?: "response" | "timeout";
  } | null>(null);
  const [cefrRetry, setCefrRetry] = useState(0);
  const pendingClick = useRef<{ timer: ReturnType<typeof setTimeout>; word: string; offset: number } | null>(null);
  const lastTap = useRef<{ offset: number; time: number } | null>(null);
  const previewRequest = useRef<AbortController | null>(null);
  const previewBox = useRef<HTMLDivElement | null>(null);
  const importing = useRef<AbortController | null>(null);
  const body = useRef<HTMLElement | null>(null);
  const currentEntries = useRef(entries);
  currentEntries.current = entries;
  const closePreview = () => {
    clearPendingClick();
    previewRequest.current?.abort(); previewRequest.current = null;
    setPreview(null);
  };
  const clearPendingClick = () => {
    if (pendingClick.current) clearTimeout(pendingClick.current.timer);
    pendingClick.current = null;
  };
  const cancelPicking = () => {
    clearPendingClick(); lastTap.current = null;
    setPicking(false); setPicked([]);
    window.getSelection()?.removeAllRanges();
  };
  const startPicking = (initial: PickedWord[] = []) => {
    closePreview();
    clearPendingClick(); lastTap.current = null;
    window.getSelection()?.removeAllRanges();
    setPicked(initial); setPicking(true);
  };
  useEffect(() => () => { importing.current?.abort(); previewRequest.current?.abort(); clearPendingClick(); }, []);
  useEffect(() => { if (preview) previewBox.current?.focus({ preventScroll: true }); }, [preview?.key]);
  useEffect(() => {
    if (!picking && !preview) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { cancelPicking(); closePreview(); } };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [picking, !!preview]);
  const translatePreview = (entry: Entry) => {
    previewRequest.current?.abort();
    const controller = new AbortController();
    previewRequest.current = controller;
    setPreview({ ...entry, state: "pending" });
    const fallback = () => {
    const canCanonicalize =
      !!entry.sentence &&
      (!("mock" in translate) || (typeof fetch === "function" && "mock" in fetch));
    const canonicalPromise = canCanonicalize
      ? canonicalizeWordFallback(
          entry.sourceWord ?? entry.word,
          entry.sentence,
          settings.targetLanguage,
          entry.sentenceOffset,
          controller.signal,
        )
      : Promise.resolve(entry.word);
    void Promise.all([
      translate(entry.word, settings.targetLanguage, settings.sourceLanguage, controller.signal),
      canonicalPromise,
    ])
      .then(async ([result, canonical]) => {
        if (controller.signal.aborted) return;
        const nextWord = canonical.trim() || entry.word;
        const nextKey = wordKey(nextWord, settings.targetLanguage);
        let translation = result.primary;
        let alternatives = result.alternatives ?? [];
        if (nextKey !== entry.key) {
          const existing = currentEntries.current.find((item) => item.key === nextKey);
          if (existing) {
            translation = existing.translation;
            alternatives = [];
          } else {
            try {
              const canonicalResult = await translate(
                nextWord,
                settings.targetLanguage,
                settings.sourceLanguage,
                controller.signal,
              );
              translation = canonicalResult.primary;
              alternatives = [
                ...(canonicalResult.alternatives ?? []),
                ...alternatives,
              ];
            } catch {
              /* Keep initial translation if re-translating the canonical form fails. */
            }
          }
        }
        let translatedSentence = entry.translatedSentence;
        const shouldScanSentenceContext =
          !!entry.sentence &&
          !controller.signal.aborted &&
          (entry.group || alternatives.length > 0);
        if (shouldScanSentenceContext) {
          if (entry.sentence === entry.word || entry.sentence === nextWord) {
            translatedSentence = translation;
          } else {
            try {
              translatedSentence = (
                await translate(
                  entry.sentence,
                  settings.targetLanguage,
                  settings.sourceLanguage,
                  controller.signal,
                )
              ).primary;
              translation = selectContextualTranslation(
                translation,
                alternatives,
                translatedSentence,
                settings.sourceLanguage,
              );
            } catch {
              /* A context failure must not discard the selected translation. */
            }
          }
        }
        if (!controller.signal.aborted) {
          setPreview({
            ...entry,
            key: nextKey,
            word: nextWord,
            sourceWord: entry.sourceWord ?? entry.word,
            translation,
            translatedSentence,
            state: "ready",
          });
        }
      }).catch(() => {
        if (!controller.signal.aborted) setPreview({ ...entry, state: "error" });
      });
    };
    if (!isGeminiConfigured(settings.geminiApiKey)) { fallback(); return; }
    void analyzeContextualSelection({
      word: entry.sourceWord ?? entry.word, sentence: entry.sentence, wordOffset: entry.sentenceOffset,
      from: settings.targetLanguage, to: settings.sourceLanguage,
    }, controller.signal, settings.geminiApiKey).then((result) => {
      if (controller.signal.aborted) return;
      if (!result) { fallback(); return; }
      setPreview({ ...entry, key: wordKey(result.canonicalWord, settings.targetLanguage),
        word: result.canonicalWord, sourceWord: entry.sourceWord ?? entry.word,
        translation: result.translation, translatedSentence: result.translatedSentence, state: "ready" });
    }).catch(() => { if (!controller.signal.aborted) fallback(); });
  };
  const load = (next: Article) => {
    importing.current?.abort(); setBusy(false);
    setUrl(next.url);
    cancelPicking();
    closePreview();
    setCefrAnalysis(null);
    setArticle(next); setFolder(next.title.slice(0, 80)); setEntries([]);
    setSavedFolder(null); setLimit(false); setError(false);
  };
  const cefrEnabled = activeLevels.length > 0;
  const cefrMatches = cefrAnalysis?.text === article?.text && cefrAnalysis?.language === settings.targetLanguage && cefrAnalysis?.apiKey === settings.geminiApiKey;
  useEffect(() => {
    if (!article || !cefrEnabled || (cefrMatches && cefrAnalysis?.state === "ready")) return;
    const controller = new AbortController();
    const context = { text: article.text, language: settings.targetLanguage, apiKey: settings.geminiApiKey };
    setCefrAnalysis({ ...context, state: "loading" });
    void analyzeArticleCefr(article.text, settings.targetLanguage, controller.signal, settings.geminiApiKey)
      .then((map) => {
        if (!controller.signal.aborted) setCefrAnalysis({ ...context, state: "ready", levels: map });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setCefrAnalysis({ ...context, state: "error", issue: error instanceof GeminiAnalysisError ? error.kind : undefined });
      });
    return () => controller.abort();
    // Completion updates state without restarting its own request. Filtering
    // returned levels does not require another Gemini analysis.
  }, [article, settings.targetLanguage, settings.geminiApiKey, cefrEnabled, cefrRetry]);
  const cefrMap = cefrMatches && cefrAnalysis?.state === "ready" ? cefrAnalysis.levels : undefined;
  const toggleLevel = (level: CefrLevel) => {
    setActiveLevels((prev) => (prev.includes(level) ? prev.filter((item) => item !== level) : [...prev, level]));
  };
  const allLevelsActive = activeLevels.length === CEFR_LEVELS.length;
  const toggleAllLevels = () => {
    setActiveLevels(allLevelsActive ? [] : [...CEFR_LEVELS]);
  };
  const importUrl = async () => {
    importing.current?.abort();
    const controller = new AbortController();
    importing.current = controller;
    setBusy(true); setError(false);
    try {
      const next = await importArticle(url, controller.signal, settings.geminiApiKey);
      if (!controller.signal.aborted) load(next);
    } catch { if (!controller.signal.aborted) setError(true); }
    finally { if (!controller.signal.aborted) setBusy(false); }
  };
  const showTranslation = (raw: string, offset: number, group = false, sentence?: string, picked?: PickedWord[]) => {
    const word = raw.trim().replace(/\s+/gu, " ");
    if (!article || !word || word.length > 2000 || !/\p{L}/u.test(word)) return;
    const key = wordKey(word, settings.targetLanguage);
    const existing = currentEntries.current.find((entry) => entry.key === key);
    const baseCtx = sentenceContextAt(article.text, offset);
    const ctx = sentence !== undefined ? { sentence, wordOffset: baseCtx.wordOffset } : baseCtx;
    const next: Entry = { key, word, sourceWord: word, offset, sentenceOffset: ctx.wordOffset, group, picked, translation: "", sentence: ctx.sentence, state: "pending" };
    if (existing) { closePreview(); setPreview({ ...next, translation: existing.translation, translatedSentence: existing.sentence === next.sentence ? existing.translatedSentence : undefined, state: "ready" }); }
    else translatePreview(next);
  };
  const addPreview = () => {
    if (!preview || preview.state !== "ready" || !preview.translation.trim() || currentEntries.current.some((entry) => entry.key === preview.key)) return;
    if (currentEntries.current.length >= 50) { setLimit(true); return; }
    currentEntries.current = [...currentEntries.current, preview];
    setEntries(currentEntries.current); setSavedFolder(null); closePreview();
  };
  const pickWord = (word: string, offset: number) => {
    setPicked((words) => words.some((item) => item.offset === offset)
      ? words.filter((item) => item.offset !== offset)
      : [...words, { word, offset }]);
  };
  const wordClick = (word: string, offset: number, detail: number) => {
    if (picking) { pickWord(word, offset); return; }
    if (lastTap.current?.offset === offset && Date.now() - lastTap.current.time < 400) {
      startPicking([{ word, offset }]); return;
    }
    if (!window.getSelection()?.isCollapsed) return;
    // Keyboard activation is immediate; pointer clicks wait briefly so double tapping
    // never adds an unintended single-word entry or starts a translation request.
    if (detail === 0) { showTranslation(word, offset); return; }
    if (pendingClick.current) {
      const previous = pendingClick.current;
      clearPendingClick(); showTranslation(previous.word, previous.offset);
    }
    lastTap.current = { offset, time: Date.now() };
    pendingClick.current = { word, offset, timer: setTimeout(() => {
      pendingClick.current = null; showTranslation(word, offset);
    }, 400) };
  };
  const selectionText = article ? [...picked].sort((a, b) => a.offset - b.offset).reduce((text, item, index, words) => {
    if (!index) return item.word;
    const previous = words[index - 1];
    const gap = article.text.slice(previous.offset + previous.word.length, item.offset);
    return text + (/\p{L}/u.test(gap) ? " " : gap) + item.word;
  }, "") : "";
  const finishPicking = () => {
    if (!article || !picked.length) return;
    if (selectionText.length > 2000) return;
    const ordered = [...picked].sort((a, b) => a.offset - b.offset);
    const context = [...new Set(ordered.map((item) => sentenceAt(article.text, item.offset)).filter(Boolean))].join(" ");
    showTranslation(selectionText, ordered[0].offset, true, context, ordered);
    cancelPicking();
  };
  const captureSelection = () => {
    if (picking) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount || !body.current) return;
    const range = selection.getRangeAt(0);
    if (!body.current.contains(range.startContainer) || !body.current.contains(range.endContainer)) return;
    const paragraph = (range.startContainer.nodeType === Node.ELEMENT_NODE ? range.startContainer as Element : range.startContainer.parentElement)?.closest("[data-offset]");
    if (!paragraph) return;
    const prefix = document.createRange();
    prefix.selectNodeContents(paragraph);
    prefix.setEnd(range.startContainer, range.startOffset);
    clearPendingClick();
    const offset = Number(paragraph.getAttribute("data-offset")) + prefix.toString().length;
    // Native double-click selects a single word; leave that gesture to wordClick.
    if (wordParts(selection.toString()).filter((_, index) => index % 2 === 1).length < 2) return;
    showTranslation(selection.toString(), offset, true);
  };
  const edit = (key: string, translation: string) => {
    setEntries((rows) => rows.map((row) => row.key === key ? { ...row, translation, state: "ready" } : row));
    setSavedFolder(null);
  };
  const save = () => {
    const result = collectArticleWords(pair, entries, folder, settings.targetLanguage);
    update(result.pair); setSavedFolder(result.folderId);
  };
  const initialWords = (entry: Entry) => entry.picked ?? wordParts(entry.sourceWord ?? entry.word).flatMap((part, index, parts) => index % 2 === 1 ? [{ word: part, offset: entry.offset + parts.slice(0, index).join("").length }] : []);
  let offset = 0;
  const paragraphs = article?.text.split("\n").map((text) => {
    const start = offset; offset += text.length + 1;
    return { text, start };
  }).filter((p) => p.text.trim());
  const savedArticles = (pair.savedArticles ?? []).filter((saved) =>
    `${saved.title} ${saved.url} ${saved.text}`.toLocaleLowerCase(settings.interfaceLanguage)
      .includes(query.trim().toLocaleLowerCase(settings.interfaceLanguage)));
  const articleStats = useMemo(() => {
    const stats = new Map<string, ReturnType<typeof articleWordStats>>();
    for (const saved of pair.savedArticles ?? []) stats.set(saved.text, articleWordStats(saved.text, pair.words, settings.targetLanguage));
    if (article && !stats.has(article.text)) stats.set(article.text, articleWordStats(article.text, pair.words, settings.targetLanguage));
    return stats;
  }, [pair.savedArticles, pair.words, article?.text, settings.targetLanguage]);
  const counters = (text: string, inTable = false) => {
    const stats = articleStats.get(text)!;
    return <span className={`article-word-counts${inTable ? " article-table-counts" : ""}`}><span aria-label={inTable ? t("articleWordCount") : undefined}>{!inTable && `${t("articleWordCount")}: `}<strong>{stats.total.toLocaleString(settings.interfaceLanguage)}</strong></span><span title={t("articleLearnedHint")} aria-label={inTable ? t("articleLearnedCount") : undefined}>{!inTable && `${t("articleLearnedCount")}: `}<strong>{stats.learned.toLocaleString(settings.interfaceLanguage)}</strong></span></span>;
  };
  return <div className="reader-view">
    <div className="page-heading"><div><p className="eyebrow">{t("articles")}</p><h1>{t("savedArticles")}</h1><p className="subtitle">{t("readerSub")}</p></div>
      <div className="library-heading-actions"><button type="button" className="primary-button" onClick={() => { urlInput.current?.scrollIntoView({ block: "center", behavior: "instant" }); urlInput.current?.focus({ preventScroll: true }); }}><Plus size={17} />{t("addArticle")}</button></div>
    </div>
    <div className="library-toolbar">
      <div className="search-field"><Search size={18} /><input aria-label={t("searchArticles")} placeholder={t("searchArticles")} value={query} onChange={(e) => setQuery(e.target.value)} /></div>
    </div>
    <section className="word-table panel reader-library" aria-label={t("savedArticles")}>
      <div className="word-table-header"><span>{t("articleTitle")}</span><span>{t("articleWordCount")}</span><span>{t("articleLearnedCount")}</span><span>{t("savedOn")}</span><span /></div>
      {savedArticles.length ? savedArticles.map((saved) => <div className="word-row" key={saved.id}>
        <div className="article-detail"><button type="button" className="word-detail" onClick={() => load(saved)}><strong lang={settings.targetLanguage}>{saved.title}</strong>{saved.url && <span>{saved.url}</span>}</button></div>
        {counters(saved.text, true)}
        <span className="article-date">{new Date(saved.createdAt).toLocaleDateString(settings.interfaceLanguage)}</span>
        <div className="row-actions"><button type="button" className="icon-button" title={t("readArticle")} aria-label={`${t("readArticle")}: ${saved.title}`} onClick={() => load(saved)}><BookOpen size={16} /></button>
          <button type="button" className="icon-button" title={t("deleteArticle")} aria-label={`${t("deleteArticle")}: ${saved.title}`} onClick={() => update(deleteSavedArticle(pair, saved.id))}><Trash2 size={16} /></button></div>
      </div>) : <div className="no-results"><BookOpen size={24} /><p>{t(pair.savedArticles?.length ? "noResults" : "savedArticlesEmpty")}</p></div>}
    </section>
    <section className="panel reader-import">
      <form onSubmit={(e) => { e.preventDefault(); void importUrl(); }}>
        <label>{t("articleUrl")}<input ref={urlInput} type="url" required maxLength={4096} value={url} placeholder="https://example.com/article" onChange={(e) => setUrl(e.target.value)} /></label>
        <button className="primary-button" disabled={busy || !url.trim()}>{busy ? t("importingArticle") : t("importArticle")}</button>
      </form>
      {error && <p role="alert" className="form-message">{t("articleError")}</p>}
      <details open={error || pasteOpen} onToggle={(event) => setPasteOpen(event.currentTarget.open)}><summary>{t("pasteArticle")}</summary>
        <form onSubmit={(e) => {
          e.preventDefault(); importing.current?.abort(); setBusy(false);
          load({ title: pasteTitle.trim() || t("untitledArticle"), text: paste.trim(), url: "" });
        }}>
          <label>{t("articleTitle")}<input maxLength={80} value={pasteTitle} onChange={(e) => setPasteTitle(e.target.value)} /></label>
          <label>{t("articleText")}<textarea required maxLength={100000} rows={7} lang={settings.targetLanguage} value={paste} onChange={(e) => setPaste(e.target.value)} /></label>
          <button className="outline-button" disabled={!paste.trim()}>{t("readText")}</button>
        </form>
      </details>
    </section>
    {article && <div className="reader-columns">
      <div className="reader-article-column">
        <section className="panel reader-level-panel" aria-label={t("cefrFilter")}>
          <div className="reader-level-header">
            <p className="eyebrow">{t("cefrFilter")}</p>
            <p className="subtitle">{t("cefrFilterSub")}</p>
          </div>
          <div className="reader-level-controls">
            {CEFR_LEVELS.map((level) => (
              <button
                type="button"
                key={level}
                className="cefr-level-button"
                data-level={level}
                aria-pressed={activeLevels.includes(level)}
                onClick={() => toggleLevel(level)}
              >
                <span className={`stat-dot cefr-dot-${level.toLowerCase()}`} aria-hidden="true" />
                {level}
              </button>
            ))}
            <button
              type="button"
              className="outline-button cefr-all-button"
              aria-pressed={allLevelsActive}
              onClick={toggleAllLevels}
            >
              {t("allLevels")}
            </button>
          </div>
          {cefrEnabled && <div className="reader-cefr-status" role="status" aria-live="polite">
            <p className="form-message">{t(cefrMatches && cefrAnalysis?.state === "error"
              ? cefrAnalysis.issue === "response" ? "cefrGeminiResponseError" : cefrAnalysis.issue === "timeout" ? "cefrGeminiTimeout" : "cefrGeminiUnavailable"
              : cefrMatches && cefrAnalysis?.state === "ready" ? "cefrGeminiReady" : "cefrGeminiLoading")}</p>
            {cefrMatches && cefrAnalysis?.state === "error" && <button type="button" className="text-button" onClick={() => { clearGeminiBackoff(); setCefrRetry((value) => value + 1); }}>{t("cefrRetry")}</button>}
          </div>}
        </section>
        <article ref={body} className={`panel reader-body${picking ? " reader-picking" : ""}`} lang={article.language || settings.targetLanguage} onPointerUp={captureSelection} onKeyUp={(e) => { if (e.shiftKey) captureSelection(); }}>
          <div className="reader-article-heading"><h2>{article.title}</h2><button type="button" className="outline-button" aria-pressed={!!matchingSavedArticle(pair, article)} disabled={!!matchingSavedArticle(pair, article)} onClick={() => update(saveArticle(pair, article).pair)}><Bookmark size={16} />{t(matchingSavedArticle(pair, article) ? "articleSaved" : "saveArticle")}</button><button type="button" className="outline-button reader-select-button" aria-pressed={picking} onClick={() => picking ? cancelPicking() : startPicking()}><ListChecks size={16} />{t("pickWords")}</button></div>
          {counters(article.text)}
          {paragraphs?.map(({ text, start }) => {
            let position = start;
            return <p key={start} data-offset={start}>{wordParts(text).map((part, i) => {
              const at = position; position += part.length;
              if (i % 2 !== 1) return part;
              const wordLevel = cefrMap?.get(at);
              const highlightedLevel = wordLevel && activeLevels.includes(wordLevel) ? wordLevel : undefined;
              return <button type="button" key={i} className="reader-word" data-offset={at} data-cefr={highlightedLevel} data-picked={picking && picked.some((word) => word.offset === at)} aria-pressed={picking ? picked.some((word) => word.offset === at) : entries.some((row) => row.key === wordKey(part, settings.targetLanguage) || (!row.group && row.offset === at))} onClick={(event) => wordClick(part, at, event.detail)} onDoubleClick={(event) => {
                event.preventDefault();
                // Touch browsers may emit dblclick after the second click already started selection.
                if (!picking) startPicking([{ word: part, offset: at }]);
              }}>{part}</button>;
            })}</p>;
          })}
        </article>
      </div>
      {picking && <div className="reader-selection-bar" role="region" aria-label={t("pickWords")}>
        <div className="reader-selection-preview" aria-live="polite"><span title={selectionText} lang={selectionText ? settings.targetLanguage : settings.interfaceLanguage}>{selectionText || t("pickWords")}</span><small>{selectionText.length > 2000 ? t("selectionTooLong") : limit ? t("collectionLimit") : `${picked.length} · ${t("pickWordsHint")}`}</small></div>
        <button type="button" className="icon-button" aria-label={t("translateSelection")} title={t("translateSelection")} disabled={!picked.length || selectionText.length > 2000} onClick={finishPicking}><Languages size={20} /></button>
        <button type="button" className="icon-button" aria-label={t("cancel")} title={t("cancel")} onClick={cancelPicking}><X size={20} /></button>
      </div>}
      {preview && <div ref={previewBox} className="reader-selection-bar reader-translation-popup" role="dialog" aria-label={t("translationPreview")} tabIndex={-1}>
        <div className="reader-popup-content">
          <strong lang={settings.targetLanguage}>{preview.word}</strong>
          {preview.state === "pending" && <p role="status">{t("translating")}</p>}
          {preview.state !== "pending" && <label>{t("translation")}<input aria-label={t("previewTranslation")} value={preview.translation} maxLength={2000} lang={settings.sourceLanguage} onChange={(event) => {
            previewRequest.current?.abort();
            setPreview({ ...preview, translation: event.target.value, state: "ready" });
          }} /></label>}
          {preview.state === "error" && <div role="status"><small>{t("translateError")}</small><button type="button" className="text-button" onClick={() => translatePreview(preview)}>{t("translate")}</button></div>}
          {preview.translatedSentence && <details className="reader-context"><summary>{t("sentenceTranslation")}</summary><p lang={settings.targetLanguage}>{preview.sentence}</p><p lang={settings.sourceLanguage}>{preview.translatedSentence}</p></details>}
          {limit && entries.length >= 50 && <small role="status">{t("collectionLimit")}</small>}
        </div>
        <div className="reader-popup-actions">
          <button type="button" className="icon-button" aria-label={t("pickWords")} title={t("pickWords")} onClick={() => startPicking(initialWords(preview))}><ListChecks size={20} /></button>
          <button type="button" className="primary-button" disabled={preview.state !== "ready" || !preview.translation.trim() || entries.some((entry) => entry.key === preview.key)} onClick={addPreview}><Plus size={16} />{entries.some((entry) => entry.key === preview.key) ? t("alreadyCollected") : t("addToCollection")}</button>
          <button type="button" className="icon-button" aria-label={t("cancel")} title={t("cancel")} onClick={closePreview}><X size={20} /></button>
        </div>
      </div>}
      <aside className="panel reader-collector" aria-label={t("collectedWords")}>
        <h2>{t("collectedWords")} <span>{entries.length} / 50</span></h2>
        {limit && <p role="status">{t("collectionLimit")}</p>}
        {!entries.length && <p className="subtitle">{t("selectWords")}</p>}
        {entries.map((entry) => <div className="reader-entry" key={entry.key}>
          <div className="reader-entry-heading"><strong lang={settings.targetLanguage}>{entry.word}</strong><button type="button" className="icon-button" aria-label={`${t("pickWords")}: ${entry.word}`} title={t("pickWords")} onClick={() => startPicking(initialWords(entry))}><ListChecks size={16} /></button><button className="icon-button" aria-label={`${t("remove")}: ${entry.word}`} onClick={() => {
            setEntries((rows) => rows.filter((row) => row.key !== entry.key)); setSavedFolder(null); setLimit(false);
          }}><X size={16} /></button></div>
          <label>{t("translation")}<input value={entry.translation} maxLength={1000} lang={settings.sourceLanguage} onChange={(e) => edit(entry.key, e.target.value)} /></label>
          <p lang={settings.targetLanguage}>{entry.sentence}</p>
          {entry.translatedSentence && <details className="reader-context"><summary>{t("sentenceTranslation")}</summary><p lang={settings.sourceLanguage}>{entry.translatedSentence}</p></details>}
        </div>)}
        <label>{t("folderName")}<input maxLength={80} value={folder} onChange={(e) => { setFolder(e.target.value); setSavedFolder(null); }} /></label>
        <button className="primary-button" disabled={!!savedFolder || !folder.trim() || !entries.length || entries.some((entry) => !entry.translation.trim() || entry.state === "pending")} onClick={save}>{t("saveCollected")}<ArrowRight size={16} /></button>
        {savedFolder && <><p className="success-message" role="status">{t("saved")}</p><button className="outline-button" onClick={() => onPractice({ kind: "category", id: savedFolder })}><BookOpenText size={17} />{t("practiceFolder")}</button><button className="text-button" onClick={() => { cancelPicking(); closePreview(); setEntries([]); setSavedFolder(null); setLimit(false); }}>{t("newCollection")}</button></>}
      </aside>
    </div>}
  </div>;
}
