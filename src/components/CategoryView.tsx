import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Folder,
  ListFilter,
  Plus,
  RotateCcw,
  RotateCw,
  Search,
  Trash2,
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
import { getCategoryStats, getChallengingWords } from "../core/stats";
import { deleteFolder } from "../core/folders";
import { remainingMasteryRecalls, resetCard } from "../core/srsEngine";
import { WordForm } from "./WordForm";
import { readUiState, uiBoolean, uiString, useUiKey, useUiState } from "../hooks/useUiState";
export function CategoryView({
  pair,
  settings,
  update,
  t,
  onPractice,
  initialWordId,
  onWordOpened,
}: {
  pair: PairData;
  settings: Settings;
  update: (p: PairData) => void;
  t: T;
  onPractice: (selection: StudySelection) => void;
  initialWordId?: string;
  onWordOpened?: () => void;
}) {
  const categoryStats = getCategoryStats(pair);
  const [query, setQuery] = useUiState("vocabulary:query", "", uiString);
  const legacyFolder = readUiState(useUiKey("vocabulary:folder"), "all", (value) => value === "all" || pair.categories.some((category) => category.id === value));
  const [selectedFolders, setSelectedFolders] = useUiState<string[]>("vocabulary:folders", legacyFolder === "all" ? [] : [legacyFolder], (value) => Array.isArray(value) && value.every((id) => typeof id === "string" && pair.categories.some((category) => category.id === id)));
  const [showChallenging, setShowChallenging] = useUiState("vocabulary:challenging", false, uiBoolean);
  const toggleFolder = (id: string) => setSelectedFolders((ids) => ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]);
  const [folderName, setFolderName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<WordCard | null>(null);
  const [adding, setAdding] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [deleteWords, setDeleteWords] = useState(false);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (deleting) deleteDialog.current?.showModal();
    else deleteDialog.current?.close();
  }, [deleting]);
  const confirmDelete = () => {
    if (!deleting) return;
    update(deleteFolder(pair, deleting.id, deleteWords));
    setSelectedFolders((ids) => ids.filter((id) => id !== deleting.id));
    setDeleting(null);
  };
  useEffect(() => {
    const word = pair.words.find((word) => word.id === initialWordId);
    if (!word) return;
    const folder = word.categoryIds.find((id) => pair.categories.some((category) => category.id === id));
    setSelectedFolders(folder ? [folder] : []);
    setShowChallenging(false);
    setQuery("");
    setEditing(word);
    onWordOpened?.();
  }, [initialWordId]);
  const closeDialog = () => {
    setEditing(null);
    setAdding(false);
  };
  useEffect(() => {
    if (editing || adding) dialog.current?.showModal();
    else dialog.current?.close();
  }, [editing, adding]);
  const scopedWords = pair.words.filter(
    (w) =>
      (!selectedFolders.length || w.categoryIds.some((id) => selectedFolders.includes(id))) &&
      `${w.targetWord} ${w.translations.join(" ")}`
        .toLocaleLowerCase(settings.interfaceLanguage)
        .includes(query.toLocaleLowerCase(settings.interfaceLanguage)),
  );
  const challenging = getChallengingWords(scopedWords, scopedWords.length);
  const filtered = showChallenging ? challenging : scopedWords;
  const modify = (card: WordCard) =>
    update({
      ...pair,
      words: pair.words.map((w) => (w.id === card.id ? card : w)),
    });
  const statusLabel = (word: WordCard) => t(word.status === "NEW" ? "new"
    : word.status === "LEARNING" ? "learning" : word.status === "REVIEW" ? "scheduledReview" : "mastered")
    + (word.status === "LEARNING" ? ` ${word.step}/3` : "");
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t("categories")}</p>
          <h1>{t("libraryTitle")}</h1>
          <p className="subtitle">{t("librarySub")}</p>
        </div>
        <div className="library-heading-actions">
          <button
            className="outline-button"
            onClick={() => setCreating(!creating)}
          >
            <Plus size={17} />
            {t("newFolder")}
          </button>
          <button className="primary-button" onClick={() => setAdding(true)}>
            <Plus size={17} />
            {t("add")}
          </button>
        </div>
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
          const { total, memorized: mastered, learning, review, percentage, averageEase } = categoryStats[index];
          const stages = [
            { label: "learning", count: learning },
            { label: "review", count: review },
            { label: "mastered", count: mastered },
          ] as const;
          const progressionLabel = stages.map(({ label, count }) => `${t(label)}: ${count.toLocaleString(settings.interfaceLanguage)}`).join(", ");
          return (
            <section
              key={category.id}
              className={`category-panel panel ${selectedFolders.includes(category.id) ? "selected" : ""}`}
            >
              <div className="category-panel-top">
                <Folder size={22} />
                <div className="category-panel-tools">
                  <span className="category-number">{(index + 1).toString().padStart(2, "0")}</span>
                  <button type="button" className="icon-button folder-delete-button" title={t("deleteFolder")} aria-label={`${t("deleteFolder")}: ${category.name[settings.interfaceLanguage]}`} onClick={() => { setDeleteWords(false); setDeleting(category); }}><Trash2 size={16} /></button>
                </div>
              </div>
              <button
                className="category-name"
                onClick={() =>
                  toggleFolder(category.id)
                }
              >
                {category.name[settings.interfaceLanguage]}
                <ArrowUpRight size={17} />
              </button>
              <p className="category-total">
                {total.toLocaleString(settings.interfaceLanguage)}{" "}
                {t("total").toLocaleLowerCase(settings.interfaceLanguage)}
              </p>
              <div className="category-progress" role="img" aria-label={`${category.name[settings.interfaceLanguage]}: ${progressionLabel}`}>
                {stages.filter(({ count }) => count > 0).map(({ label, count }) => (
                  <span
                    key={label}
                    className={`folder-status-${label}`}
                    style={{ flexGrow: count }}
                    title={`${t(label)}: ${count.toLocaleString(settings.interfaceLanguage)}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="category-mastery-label">{percentage.toLocaleString(settings.interfaceLanguage, { maximumFractionDigits: 0 })}% {t("mastered")}</span>
              <dl className="folder-metrics" aria-label={`${category.name[settings.interfaceLanguage]}: ${t("folderMastery")}`}>
                {([
                  ["learning", learning],
                  ["review", review],
                  ["mastered", mastered],
                  ["averageEase", averageEase || null],
                ] as const).map(([label, value]) => (
                  <div key={label}>
                    <dt>{label !== "averageEase" && <span className={`folder-status-key folder-status-${label}`} aria-hidden="true" />}{t(label)}</dt>
                    <dd>{value === null ? "—" : value.toLocaleString(settings.interfaceLanguage, { maximumFractionDigits: label === "averageEase" ? 2 : 0 })}</dd>
                  </div>
                ))}
              </dl>
              <button
                className="category-practice outline-button"
                aria-label={`${t("practice")}: ${category.name[settings.interfaceLanguage]}`}
                disabled={!words.some((word) => word.status !== "MASTERED")}
                title={words.length && words.every((word) => word.status === "MASTERED") ? t("completeSub") : undefined}
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
              <div className="folder-reset-actions">
                {(["NEW", "REVIEW"] as const).map((status) => (
                  <button
                    key={status}
                    className="text-button"
                    onClick={() =>
                      update({
                        ...pair,
                        words: pair.words.map((word) =>
                          word.categoryIds.includes(category.id)
                            ? resetCard(word, status)
                            : word,
                        ),
                      })
                    }
                  >
                    {t(status === "NEW" ? "resetNew" : "resetReview")}
                  </button>
                ))}
              </div>
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
        <details className="vocabulary-folder-picker" onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
        }} onKeyDown={(event) => {
          if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); }
        }}>
          <summary aria-label={t("folder")}>
            <Folder size={16} strokeWidth={1.75} aria-hidden="true" />
            <span className="folder-picker-value">{selectedFolders.length ? pair.categories.filter((c) => selectedFolders.includes(c.id)).map((c) => c.name[settings.interfaceLanguage]).join(", ") : t("all")}</span>
            <ChevronDown className="folder-picker-chevron" size={14} strokeWidth={1.75} aria-hidden="true" />
          </summary>
          <div className="vocabulary-folder-options" role="group" aria-label={t("folder")}>
            <p className="folder-picker-caption">{t("folder")}</p>
            <label>
              <input type="checkbox" value="all" checked={!selectedFolders.length} onChange={() => setSelectedFolders([])} />
              <span className="folder-option-check" aria-hidden="true"><Check size={11} strokeWidth={2} /></span>
              <span className="folder-option-name">{t("all")}</span>
            </label>
            <div className="folder-picker-divider" />
            {pair.categories.map((category) => <label key={category.id}>
              <input type="checkbox" value={category.id} checked={selectedFolders.includes(category.id)} onChange={() => toggleFolder(category.id)} />
              <span className="folder-option-check" aria-hidden="true"><Check size={11} strokeWidth={2} /></span>
              <span className="folder-option-name">{category.name[settings.interfaceLanguage]}</span>
            </label>)}
          </div>
        </details>
        <label className="challenging-filter" data-active={showChallenging}>
          <input type="checkbox" aria-label={t("challengingWords")} checked={showChallenging} onChange={(e) => setShowChallenging(e.target.checked)} />
          {showChallenging ? <Check size={16} strokeWidth={1.75} aria-hidden="true" /> : <ListFilter size={16} strokeWidth={1.75} aria-hidden="true" />}
          <span className="challenging-filter-label">{t("challengingWords")}</span>
          <span className="challenging-filter-count">{challenging.length.toLocaleString(settings.interfaceLanguage)}</span>
        </label>
      </div>
      {showChallenging && <div className="vocabulary-challenging-summary">
        <p className="stats-hint">{t("challengingWordsSub")}</p>
        <button className="outline-button" disabled={!filtered.length} onClick={() => onPractice({ kind: "words", ids: filtered.map((word) => word.id) })}>{t("practiceChallenging")}</button>
      </div>}
      <div className="word-table panel vocabulary-table">
        <div className="word-table-header">
          <span>
            {t("word")} / {t("translation")}
          </span>
          <span>{t("status")}</span>
          <span title={showChallenging ? undefined : t("masteryRemainingHint")}>{showChallenging ? `${t("practiceTurns")} / ${t("easeFactor")}` : t("recallsRemaining")}</span>
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
              <span className={`stat-dot word-status-indicator ${w.status === "NEW" ? "blue" : w.status === "MASTERED" ? "green" : "amber"}`}
                role="img" aria-label={statusLabel(w)} title={statusLabel(w)} data-status={w.status.toLowerCase()} />
              <span className="word-review-count" title={showChallenging ? undefined : t("masteryRemainingHint")}>
                {showChallenging
                  ? `${w.repCount.toLocaleString(settings.interfaceLanguage)} / ${(w.easeFactor ?? 2.3).toLocaleString(settings.interfaceLanguage, { maximumFractionDigits: 2 })}`
                  : t(w.status === "REVIEW" ? "scheduledReviewsRemaining" : "masteryRecallsRemaining")
                    .replace("{count}", remainingMasteryRecalls(w).toLocaleString(settings.interfaceLanguage))}
              </span>
              <div className="row-actions">
                <button
                  className="icon-button"
                  title={t("resetReview")}
                  aria-label={`${t("resetReview")}: ${w.targetWord}`}
                  onClick={() => modify(resetCard(w, "REVIEW"))}
                >
                  <RotateCw size={16} />
                </button>
                <button
                  className="icon-button"
                  title={t("practice")}
                  aria-label={`${t("practice")}: ${w.targetWord}`}
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

              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <BookOpen size={24} />
            <p>{t(showChallenging && !query ? "noChallengingWords" : "noResults")}</p>
          </div>
        )}
      </div>
      <dialog ref={deleteDialog} className="edit-dialog delete-folder-dialog" aria-labelledby="delete-folder-title" aria-describedby="delete-folder-name delete-folder-hint" onCancel={() => setDeleting(null)} onClick={(event) => { if (event.target === event.currentTarget) setDeleting(null); }}>
        {deleting && <div className="panel delete-folder-content">
          <div className="dialog-heading"><h2 id="delete-folder-title">{t("deleteFolder")}</h2></div>
          <p id="delete-folder-name" className="delete-folder-name">{deleting.name[settings.interfaceLanguage]}</p>
          <label className="delete-folder-option">
            <input type="checkbox" checked={deleteWords} onChange={(event) => setDeleteWords(event.target.checked)} />
            <span>{t("deleteFolderWords")} <span className="delete-folder-word-count">({pair.words.filter((word) => word.categoryIds.includes(deleting.id)).length.toLocaleString(settings.interfaceLanguage)})</span></span>
          </label>
          <p id="delete-folder-hint" className="delete-folder-hint">{t(deleteWords ? "deleteFolderWordsHint" : "deleteFolderHint")}</p>
          <div className="delete-folder-actions">
            <button type="button" className="outline-button" autoFocus onClick={() => setDeleting(null)}>{t("cancel")}</button>
            <button type="button" className="outline-button folder-delete-confirm" onClick={confirmDelete}>{t(deleteWords ? "deleteFolderAndWords" : "deleteFolder")}</button>
          </div>
        </div>}
      </dialog>
      <dialog
        ref={dialog}
        className="edit-dialog"
        aria-label={t(adding ? "add" : "edit")}
        onCancel={closeDialog}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeDialog();
        }}
      >
        {(editing || adding) && (
          <WordForm
            key={editing?.id ?? "add"}
            pair={pair}
            settings={settings}
            update={update}
            t={t}
            onPractice={onPractice}
            existing={editing ?? undefined}
            initialCategoryId={selectedFolders.length === 1 ? selectedFolders[0] : undefined}
            onClose={closeDialog}
          />
        )}
      </dialog>
    </>
  );
}
