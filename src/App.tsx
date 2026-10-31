import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BookOpenText,
  ChevronDown,
  Layers,
  Moon,
  Settings2,
  ShieldCheck,
  Sun,
} from "lucide-react";
import type {
  AppData,
  DailyProgress,
  Language,
  PairData,
  Settings,
  StudySelection,
} from "./types";
import { languageNames, languages } from "./types";
import { translator } from "./i18n/translations";
import { seedPair } from "./i18n/seedData";
import { loadData, pairKey, saveData } from "./services/storage";
import { StudyView } from "./components/StudyView";
import { CategoryView } from "./components/CategoryView";
import { SettingsView } from "./components/SettingsView";
import { ReaderView } from "./components/ReaderView";
import { configureGemini, initializeGemini } from "./services/gemini";
import { UiStateScope, clearPairUiState, readUiState, uiCount, uiObject, useStoredUiState, writeUiState } from "./hooks/useUiState";
type Page = "learn" | "categories" | "reader" | "settings";
const initial = loadData();
export default function App() {
  const [data, setData] = useState<AppData>(initial.data);
  const [storageError, setStorageError] = useState(initial.error);
  const [page, setPage] = useStoredUiState<Page>("page", "learn", (value) => ["learn", "categories", "reader", "settings"].includes(value as string));
  const [generation, setGeneration] = useState(0);
  const [libraryWord, setLibraryWord] = useState<{ pairKey: string; wordId: string } | null>(null);
  const [practiceRequest, setPracticeRequest] = useStoredUiState<{
    pairKey: string;
    selection: StudySelection;
  } | null>("practice", null, (value) => value === null || (uiObject(value) && typeof value.pairKey === "string" && uiObject(value.selection) &&
    ((["word", "category"].includes(value.selection.kind as string) && typeof value.selection.id === "string") ||
      (value.selection.kind === "categories" && Array.isArray(value.selection.ids) && value.selection.ids.every((id) => typeof id === "string")))));
  const main = useRef<HTMLElement | null>(null);
  const s = data.settings;
  useEffect(() => {
    configureGemini(s.geminiApiKey);
    void initializeGemini();
  }, [s.geminiApiKey]);
  const t = translator(s.interfaceLanguage);
  const key = pairKey(s.sourceLanguage, s.targetLanguage);
  const pair = data.pairs[key] ?? seedPair(s.sourceLanguage, s.targetLanguage);
  useLayoutEffect(() => {
    const scrollKey = `pair:${key}:scroll:${page}`;
    const position = readUiState(scrollKey, { document: 0, main: 0 }, (value) => uiObject(value) && uiCount(value.document) && uiCount(value.main));
    const documentScroller = document.scrollingElement ?? document.documentElement;
    const mainScroller = main.current;
    documentScroller.scrollTop = position.document;
    if (mainScroller) mainScroller.scrollTop = position.main;
    const savePosition = () => writeUiState(scrollKey, { document: Math.round(documentScroller.scrollTop), main: Math.round(mainScroller?.scrollTop ?? 0) });
    window.addEventListener("scroll", savePosition, true);
    window.addEventListener("pagehide", savePosition);
    return () => { savePosition(); window.removeEventListener("scroll", savePosition, true); window.removeEventListener("pagehide", savePosition); };
  }, [key, page, generation]);
  useEffect(() => {
    if (initial.error && data === initial.data) return;
    setStorageError(!saveData(data));
  }, [data]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", s.theme === "dark");
    document.documentElement.lang = s.interfaceLanguage;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", s.theme === "dark" ? "#090D16" : "#F8FAFC");
  }, [s.theme, s.interfaceLanguage]);
  const changeSettings = (patch: Partial<Settings>) =>
    setData((d) => {
      const settings = { ...d.settings, ...patch };
      const newKey = pairKey(settings.sourceLanguage, settings.targetLanguage);
      return {
        ...d,
        settings,
        pairs: {
          ...d.pairs,
          [newKey]:
            d.pairs[newKey] ??
            seedPair(settings.sourceLanguage, settings.targetLanguage),
        },
      };
    });
  const update = (p: PairData, reviewOrder?: number, dailyProgress?: DailyProgress) =>
    setData((d) => ({
      ...d,
      reviewOrder: reviewOrder ?? d.reviewOrder,
      dailyProgress: dailyProgress ?? d.dailyProgress,
      pairs: { ...d.pairs, [key]: p },
    }));
  const practice = (selection: StudySelection) => {
    setPracticeRequest({ pairKey: key, selection });
    setPage("learn");
  };
  const navigate = (next: Page) => {
    if (next === "learn") setPracticeRequest(null);
    setPage(next);
  };
  const nav = [
    { id: "learn", icon: BookOpen },
    { id: "categories", icon: Layers },
    { id: "reader", icon: BookOpenText },
    { id: "settings", icon: Settings2 },
  ] as const;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("learn");
          }}
        >
          <span className="brand-mark">
            E<span />
          </span>
          <span>
            erudite<span className="brand-period">.</span>
          </span>
        </a>
        <p className="brand-tagline">{t("tagline")}</p>
        <p className="nav-caption">{t("workspace")}</p>
        <nav aria-label={t("workspace")}>
          {nav.map(({ id, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              aria-current={page === id ? "page" : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={19} />
              <span>{t(id === "reader" ? "articles" : id)}</span>
              {page === id && <span className="nav-active-mark" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-pair">
            <span className="language-code">
              {s.targetLanguage.toUpperCase()}
            </span>
            <div>
              <strong>{languageNames[s.targetLanguage]}</strong>
              <span>
                {languageNames[s.sourceLanguage]}
                <ArrowRight size={12} />
                {languageNames[s.targetLanguage]}
              </span>
            </div>
          </div>
          <div className="local-note">
            <ShieldCheck size={15} />
            <span>{t("local")}</span>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <span className="breadcrumb">
            {t("workspace")}
            <span>/</span>
            <strong>{t(page)}</strong>
          </span>
          <span className="mobile-brand">erudite.</span>
          <div className="topbar-actions">
            <div className="header-language">
              <span className="language-code">
                {s.targetLanguage.toUpperCase()}
              </span>
              <select
                aria-label={t("target")}
                value={s.targetLanguage}
                onChange={(e) =>
                  changeSettings({ targetLanguage: e.target.value as Language })
                }
              >
                {languages
                  .filter((l) => l !== s.sourceLanguage)
                  .map((l) => (
                    <option key={l} value={l}>
                      {languageNames[l]}
                    </option>
                  ))}
              </select>
              <ChevronDown size={14} />
            </div>
            <span className="header-divider" />
            <button
              className="icon-button"
              aria-label={s.theme === "light" ? t("dark") : t("light")}
              title={s.theme === "light" ? t("dark") : t("light")}
              onClick={() =>
                changeSettings({
                  theme: s.theme === "light" ? "dark" : "light",
                })
              }
            >
              {s.theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>
          </div>
        </header>
        <main
          ref={main}
          key={`${key}-${generation}`}
          className={`main-content page-${page}`}
        >
          {storageError && (
            <div className="storage-error" role="alert">
              {t("storageError")}
            </div>
          )}
          <UiStateScope.Provider value={`pair:${key}`}>
          {page === "learn" && (
            <StudyView
              key={JSON.stringify(
                practiceRequest?.pairKey === key
                  ? practiceRequest.selection
                  : null,
              )}
              initialSelection={
                practiceRequest?.pairKey === key
                  ? practiceRequest.selection
                  : undefined
              }
              pair={pair}
              settings={s}
              reviewOrder={data.reviewOrder}
              dailyProgress={data.dailyProgress}
              update={update}
              t={t}
              openLibrary={(wordId) => {
                setLibraryWord(wordId ? { pairKey: key, wordId } : null);
                setPage("categories");
              }}
            />
          )}{" "}
          {page === "categories" && (
            <CategoryView
              initialWordId={libraryWord?.pairKey === key ? libraryWord.wordId : undefined}
              onWordOpened={() => setLibraryWord(null)}
              pair={pair}
              settings={s}
              update={update}
              t={t}
              onPractice={practice}
            />
          )}{" "}
          {page === "settings" && (
            <SettingsView
              data={data}
              changeSettings={changeSettings}
              restore={(d) => {
                clearPairUiState();
                setData(d);
                setPracticeRequest(null);
                setGeneration((n) => n + 1);
              }}
              t={t}
            />
          )}
          {page === "reader" && <ReaderView pair={pair} settings={s} update={update} onPractice={practice} t={t} />}
          </UiStateScope.Provider>
        </main>
        <footer className="desktop-footer">
          <span>ERUDITE</span>
          <span>{t("tagline")}</span>
          <span>
            {pair.words.length}{" "}
            {t("total").toLocaleLowerCase(s.interfaceLanguage)}
          </span>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label={t("workspace")}>
        {nav.map(({ id, icon: Icon }) => (
          <button
            key={id}
            className={page === id ? "active" : ""}
            aria-current={page === id ? "page" : undefined}
            onClick={() => navigate(id)}
          >
            <Icon size={21} />
            <span>{t(id === "reader" ? "articles" : id)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
