import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Folder,
  Plus,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import type {
  Category,
  PairData,
  Settings,
  StudySelection,
  WordCard,
} from "../types";
import { languages } from "../types";
import type { T } from "../i18n/translations";
import { resetCard } from "../core/srsEngine";
import { WordForm } from "./WordForm";
export function CategoryView({
  pair,
  settings,
  update,
  t,
  onPractice,
}: {
  pair: PairData;
  settings: Settings;
  update: (p: PairData) => void;
  t: T;
  onPractice: (selection: StudySelection) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("all");
  const [folderName, setFolderName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<WordCard | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (editing) dialog.current?.showModal();
    else dialog.current?.close();
  }, [editing]);
  const filtered = pair.words.filter(
    (w) =>
      (selected === "all" || w.categoryIds.includes(selected)) &&
      `${w.targetWord} ${w.translations.join(" ")}`
        .toLocaleLowerCase(settings.interfaceLanguage)
        .includes(query.toLocaleLowerCase(settings.interfaceLanguage)),
  );
  const modify = (card: WordCard) =>
    update({
      ...pair,
      words: pair.words.map((w) => (w.id === card.id ? card : w)),
    });
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t("categories")}</p>
          <h1>{t("libraryTitle")}</h1>
          <p className="subtitle">{t("librarySub")}</p>
        </div>
        <button
          className="outline-button"
          onClick={() => setCreating(!creating)}
        >
          <Plus size={17} />
          {t("newFolder")}
        </button>
      </div>
      {creating && (
        <form
          className="folder-create panel"
          onSubmit={(e) => {
            e.preventDefault();
            if (!folderName.trim()) return;
            update({
              ...pair,
              categories: [
                ...pair.categories,
                {
                  id: crypto.randomUUID(),
                  isCustom: true,
                  isActiveForStudy: true,
                  name: Object.fromEntries(
                    languages.map((l) => [l, folderName.trim()]),
                  ) as Category["name"],
                },
              ],
            });
            setFolderName("");
            setCreating(false);
          }}
        >
          <input
            required
            autoFocus
            aria-label={t("folderName")}
            placeholder={t("folderName")}
            maxLength={80}
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <button className="primary-button" type="submit">
            <Check size={17} />
            {t("saveChanges")}
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label={t("cancel")}
            onClick={() => setCreating(false)}
          >
            <X size={18} />
          </button>
        </form>
      )}
      <div className="category-grid">
        {pair.categories.map((category, index) => {
          const words = pair.words.filter((w) =>
            w.categoryIds.includes(category.id),
          );
          const mastered = words.filter((w) => w.status === "MASTERED").length;
          const learning = words.filter(
            (w) => w.status === "NEW" || w.status === "LEARNING",
          ).length;
          return (
            <section
              key={category.id}
              className={`category-panel panel ${selected === category.id ? "selected" : ""}`}
            >
              <div className="category-panel-top">
                <Folder size={22} />
                <span className="category-number">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
              </div>
              <button
                className="category-name"
                onClick={() =>
                  setSelected(selected === category.id ? "all" : category.id)
                }
              >
                {category.name[settings.interfaceLanguage]}
                <ArrowUpRight size={17} />
              </button>
              <p className="category-total">
                {words.length}{" "}
                {t("total").toLocaleLowerCase(settings.interfaceLanguage)}
              </p>
              <div className="category-progress">
                <div
                  style={{
                    width: `${words.length ? (mastered / words.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="category-stats">
                <span>
                  {learning} {t("learning")}
                </span>
                <span>
                  {mastered} {t("mastered")}
                </span>
              </div>
              <button
                className="category-practice outline-button"
                aria-label={`${t("practice")}: ${category.name[settings.interfaceLanguage]}`}
                disabled={!words.some((word) => word.status !== "MASTERED")}
                onClick={() =>
                  onPractice({ kind: "category", id: category.id })
                }
              >
                <BookOpen size={15} />
                {t("practice")}
              </button>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={category.isActiveForStudy}
                  onChange={(e) =>
                    update({
                      ...pair,
                      categories: pair.categories.map((c) =>
                        c.id === category.id
                          ? { ...c, isActiveForStudy: e.target.checked }
                          : c,
                      ),
                    })
                  }
                />
                {t("active")}
              </label>
            </section>
          );
        })}
      </div>
      <div className="library-toolbar">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label={t("search")}
            placeholder={t("search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label={t("folder")}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="all">{t("all")}</option>
          {pair.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name[settings.interfaceLanguage]}
            </option>
          ))}
        </select>
      </div>
      <div className="word-table panel">
        <div className="word-table-header">
          <span>
            {t("word")} / {t("translation")}
          </span>
          <span>{t("status")}</span>
          <span />
        </div>
        {filtered.length ? (
          filtered.map((w) => (
            <div className="word-row" key={w.id}>
              <button className="word-detail" onClick={() => setEditing(w)}>
                <strong lang={settings.targetLanguage}>{w.targetWord}</strong>
                <span lang={settings.sourceLanguage}>
                  {w.translations.join("; ")}
                </span>
              </button>
              <span className={`status-pill ${w.status.toLowerCase()}`}>
                {t(
                  w.status === "NEW"
                    ? "new"
                    : w.status === "LEARNING"
                      ? "learning"
                      : w.status === "REVIEW"
                        ? "review"
                        : "mastered",
                )}
              </span>
              <div className="row-actions">
                <button
                  className="icon-button"
                  title={t("practice")}
                  aria-label={`${t("practice")}: ${w.targetWord}`}
                  disabled={w.status === "MASTERED"}
                  onClick={() => onPractice({ kind: "word", id: w.id })}
                >
                  <BookOpen size={16} />
                </button>
                <button
                  className="icon-button"
                  title={t("reset")}
                  aria-label={`${t("reset")}: ${w.targetWord}`}
                  onClick={() => modify(resetCard(w))}
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  className="icon-button"
                  title={w.status === "MASTERED" ? t("reset") : t("master")}
                  aria-label={`${w.status === "MASTERED" ? t("reset") : t("master")}: ${w.targetWord}`}
                  onClick={() =>
                    modify(
                      w.status === "MASTERED"
                        ? resetCard(w)
                        : { ...w, status: "MASTERED" },
                    )
                  }
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <BookOpen size={24} />
            <p>{t("noResults")}</p>
          </div>
        )}
      </div>
      <dialog
        ref={dialog}
        className="edit-dialog"
        aria-label={t("edit")}
        onCancel={() => setEditing(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setEditing(null);
        }}
      >
        {editing && (
          <WordForm
            key={editing.id}
            pair={pair}
            settings={settings}
            update={update}
            t={t}
            onPractice={onPractice}
            existing={editing}
            onClose={() => setEditing(null)}
          />
        )}
      </dialog>
    </>
  );
}
