import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Layers,
  Moon,
  Plus,
  Settings2,
  ShieldCheck,
  Sun,
} from "lucide-react";
import type {
  AppData,
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
import { WordForm } from "./components/WordForm";
import { SettingsView } from "./components/SettingsView";
type Page = "learn" | "categories" | "add" | "settings";
const initial = loadData();
export default function App() {
  const [data, setData] = useState<AppData>(initial.data);
  const [storageError, setStorageError] = useState(initial.error);
  const [page, setPage] = useState<Page>("learn");
  const [generation, setGeneration] = useState(0);
  const [practiceRequest, setPracticeRequest] = useState<{
    pairKey: string;
    selection: StudySelection;
  } | null>(null);
  const s = data.settings;
  const t = translator(s.interfaceLanguage);
  const key = pairKey(s.sourceLanguage, s.targetLanguage);
  const pair = data.pairs[key] ?? seedPair(s.sourceLanguage, s.targetLanguage);
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
  const update = (p: PairData, reviewOrder?: number) =>
    setData((d) => ({
      ...d,
      reviewOrder: reviewOrder ?? d.reviewOrder,
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
    { id: "add", icon: Plus },
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
              <span>{t(id)}</span>
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
          key={`${key}-${generation}`}
          className={`main-content page-${page}`}
        >
          {storageError && (
            <div className="storage-error" role="alert">
              {t("storageError")}
            </div>
          )}
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
              update={update}
              t={t}
              openLibrary={() => setPage("categories")}
              changeSettings={changeSettings}
            />
          )}{" "}
          {page === "categories" && (
            <CategoryView
              pair={pair}
              settings={s}
              update={update}
              t={t}
              onPractice={practice}
            />
          )}{" "}
          {page === "add" && (
            <WordForm
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
                setData(d);
                setPracticeRequest(null);
                setGeneration((n) => n + 1);
              }}
              t={t}
            />
          )}
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
            <span>{t(id)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
