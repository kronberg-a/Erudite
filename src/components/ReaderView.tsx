import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpenText, X } from "lucide-react";
import type { PairData, Settings, StudySelection } from "../types";
import type { T } from "../i18n/translations";
import { translate } from "../services/translator";
import { collectArticleWords, importArticle, sentenceAt, wordKey, wordParts } from "../services/article";
import type { Article, CollectedWord } from "../services/article";

interface Entry extends CollectedWord { key: string; state: "pending" | "ready" | "error" }
export function ReaderView({ pair, settings, update, onPractice, t }: {
  pair: PairData; settings: Settings; update: (pair: PairData) => void;
  onPractice: (selection: StudySelection) => void; t: T;
}) {
  const [url, setUrl] = useState("");
  const [paste, setPaste] = useState("");
  const [pasteTitle, setPasteTitle] = useState("");
  const [article, setArticle] = useState<Article | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [folder, setFolder] = useState("");
  const [savedFolder, setSavedFolder] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(false);
  const requests = useRef(new Map<string, AbortController>());
  const importing = useRef<AbortController | null>(null);
  const body = useRef<HTMLElement | null>(null);
  const currentEntries = useRef(entries);
  currentEntries.current = entries;
  const cancelTranslations = () => {
    requests.current.forEach((c) => c.abort());
    requests.current.clear();
  };
  useEffect(() => () => { importing.current?.abort(); cancelTranslations(); }, []);
  // At most two requests at once; pending rows form a bounded queue.
  useEffect(() => {
    for (const entry of entries) {
      if (requests.current.size >= 2) break;
      if (entry.state !== "pending" || requests.current.has(entry.key)) continue;
      const controller = new AbortController();
      requests.current.set(entry.key, controller);
      void translate(entry.word, settings.targetLanguage, settings.sourceLanguage, controller.signal)
        .then((result) => {
          if (!controller.signal.aborted) setEntries((rows) => rows.map((row) => row.key === entry.key ? { ...row, translation: result.primary, state: "ready" } : row));
        }).catch(() => {
          if (!controller.signal.aborted) setEntries((rows) => rows.map((row) => row.key === entry.key ? { ...row, state: "error" } : row));
        }).finally(() => {
          if (requests.current.get(entry.key) === controller) {
            requests.current.delete(entry.key);
            if (!controller.signal.aborted) setEntries((rows) => [...rows]);
          }
        });
    }
  }, [entries, settings.targetLanguage, settings.sourceLanguage]);
  const load = (next: Article) => {
    cancelTranslations();
    setArticle(next); setFolder(next.title.slice(0, 80)); setEntries([]);
    setSavedFolder(null); setLimit(false); setError(false);
  };
  const importUrl = async () => {
    importing.current?.abort();
    const controller = new AbortController();
    importing.current = controller;
    setBusy(true); setError(false);
    try {
      const next = await importArticle(url, controller.signal);
      if (!controller.signal.aborted) load(next);
    } catch { if (!controller.signal.aborted) setError(true); }
    finally { if (!controller.signal.aborted) setBusy(false); }
  };
  const collect = (raw: string, offset: number) => {
    const word = raw.trim().replace(/\s+/gu, " ");
    if (!article || !word || word.length > 100 || !/\p{L}/u.test(word)) return;
    const key = wordKey(word, settings.targetLanguage);
    if (currentEntries.current.some((entry) => entry.key === key)) return;
    if (currentEntries.current.length >= 50) { setLimit(true); return; }
    const next: Entry = { key, word, translation: "", sentence: sentenceAt(article.text, offset), state: "pending" };
    currentEntries.current = [...currentEntries.current, next];
    setEntries(currentEntries.current); setSavedFolder(null);
  };
  const captureSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount || !body.current) return;
    const range = selection.getRangeAt(0);
    if (!body.current.contains(range.startContainer) || !body.current.contains(range.endContainer)) return;
    const paragraph = (range.startContainer.nodeType === Node.ELEMENT_NODE ? range.startContainer as Element : range.startContainer.parentElement)?.closest("[data-offset]");
    if (!paragraph) return;
    const prefix = document.createRange();
    prefix.selectNodeContents(paragraph);
    prefix.setEnd(range.startContainer, range.startOffset);
    collect(selection.toString(), Number(paragraph.getAttribute("data-offset")) + prefix.toString().length);
  };
  const edit = (key: string, translation: string) => {
    requests.current.get(key)?.abort(); requests.current.delete(key);
    setEntries((rows) => rows.map((row) => row.key === key ? { ...row, translation, state: "ready" } : row));
    setSavedFolder(null);
  };
  const save = () => {
    const result = collectArticleWords(pair, entries, folder, settings.targetLanguage);
    update(result.pair); setSavedFolder(result.folderId);
  };
  let offset = 0;
  const paragraphs = article?.text.split("\n").map((text) => {
    const start = offset; offset += text.length + 1;
    return { text, start };
  }).filter((p) => p.text.trim());
  return <div className="reader-view">
    <div className="page-heading"><div><p className="eyebrow">{t("reader")}</p><h1>{t("readerTitle")}</h1><p className="subtitle">{t("readerSub")}</p></div></div>
    <section className="panel reader-import">
      <form onSubmit={(e) => { e.preventDefault(); void importUrl(); }}>
        <label>{t("articleUrl")}<input type="url" required maxLength={4096} value={url} placeholder="https://example.com/article" onChange={(e) => setUrl(e.target.value)} /></label>
        <button className="primary-button" disabled={busy || !url.trim()}>{busy ? t("importingArticle") : t("importArticle")}</button>
      </form>
      {error && <p role="alert" className="form-message">{t("articleError")}</p>}
      <details open={error || undefined}><summary>{t("pasteArticle")}</summary>
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
      <article ref={body} className="panel reader-body" lang={article.language || settings.targetLanguage} onPointerUp={captureSelection} onKeyUp={(e) => { if (e.shiftKey) captureSelection(); }}>
        <h2>{article.title}</h2>
        {paragraphs?.map(({ text, start }) => {
          let position = start;
          return <p key={start} data-offset={start}>{wordParts(text).map((part, i) => {
            const at = position; position += part.length;
            return i % 2 === 1 ? <button type="button" key={i} className="reader-word" aria-pressed={entries.some((row) => row.key === wordKey(part, settings.targetLanguage))} onClick={() => {
              if (!window.getSelection()?.isCollapsed) return;
              collect(part, at);
            }}>{part}</button> : part;
          })}</p>;
        })}
      </article>
      <aside className="panel reader-collector" aria-label={t("collectedWords")}>
        <h2>{t("collectedWords")} <span>{entries.length} / 50</span></h2>
        {limit && <p role="status">{t("collectionLimit")}</p>}
        {!entries.length && <p className="subtitle">{t("selectWords")}</p>}
        {entries.map((entry) => <div className="reader-entry" key={entry.key}>
          <div className="reader-entry-heading"><strong lang={settings.targetLanguage}>{entry.word}</strong><button className="icon-button" aria-label={`${t("remove")}: ${entry.word}`} onClick={() => {
            requests.current.get(entry.key)?.abort(); requests.current.delete(entry.key);
            setEntries((rows) => rows.filter((row) => row.key !== entry.key)); setSavedFolder(null); setLimit(false);
          }}><X size={16} /></button></div>
          <label>{t("translation")}<input value={entry.translation} maxLength={1000} lang={settings.sourceLanguage} onChange={(e) => edit(entry.key, e.target.value)} /></label>
          {entry.state === "pending" && <small role="status">{t("translating")}</small>}
          {entry.state === "error" && <div role="status"><small>{t("translateError")}</small><button className="text-button" onClick={() => setEntries((rows) => rows.map((row) => row.key === entry.key ? { ...row, state: "pending" } : row))}>{t("translate")}</button></div>}
          <p lang={settings.targetLanguage}>{entry.sentence}</p>
        </div>)}
        <label>{t("folderName")}<input maxLength={80} value={folder} onChange={(e) => { setFolder(e.target.value); setSavedFolder(null); }} /></label>
        <button className="primary-button" disabled={!!savedFolder || !folder.trim() || !entries.length || entries.some((entry) => !entry.translation.trim() || entry.state === "pending")} onClick={save}>{t("saveCollected")}<ArrowRight size={16} /></button>
        {savedFolder && <><p className="success-message" role="status">{t("saved")}</p><button className="outline-button" onClick={() => onPractice({ kind: "category", id: savedFolder })}><BookOpenText size={17} />{t("practiceFolder")}</button><button className="text-button" onClick={() => { cancelTranslations(); setEntries([]); setSavedFolder(null); setLimit(false); }}>{t("newCollection")}</button></>}
      </aside>
    </div>}
  </div>;
}
