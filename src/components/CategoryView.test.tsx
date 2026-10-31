// @vitest-environment jsdom
import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { CategoryView } from "./CategoryView";
import { defaultSettings } from "../services/storage";
import { translator } from "../i18n/translations";
import { seedPair } from "../i18n/seedData";
import { UiStateScope } from "../hooks/useUiState";
import { languages, type PairData } from "../types";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let host: HTMLDivElement;
let pair: PairData;
const practice = vi.fn();
beforeEach(() => {
  sessionStorage.clear();
  practice.mockClear();
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: vi.fn(),
  });
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  const seed = seedPair("en", "de");
  const categories = seed.categories.slice(0, 2).map((category, i) => ({
    ...category,
    isActiveForStudy: false,
    name: Object.fromEntries(
      languages.map((lang) => [lang, i ? "Travel" : "Core"]),
    ) as typeof category.name,
  }));
  const card = seed.words[0];
  pair = {
    categories,
    words: [
      {
        ...card,
        id: "core",
        targetWord: "difficult core",
        translations: ["core meaning"],
        categoryIds: [categories[0].id],
        repCount: 5,
      },
      {
        ...card,
        id: "travel",
        targetWord: "difficult travel",
        translations: ["travel meaning"],
        categoryIds: [categories[1].id],
        easeFactor: 1.7,
      },
      {
        ...card,
        id: "shared",
        targetWord: "shared difficult",
        translations: ["shared meaning"],
        categoryIds: categories.map((c) => c.id),
        repCount: 8,
      },
      {
        ...card,
        id: "easy",
        targetWord: "easy core",
        categoryIds: [categories[0].id],
        repCount: 4,
      },
      {
        ...card,
        id: "memorized",
        targetWord: "memorized core",
        categoryIds: [categories[0].id],
        status: "MASTERED",
        repCount: 10,
        easeFactor: 1.3,
      },
    ],
  };
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  sessionStorage.clear();
});
function render(language = defaultSettings.interfaceLanguage) {
  act(() =>
    root.render(
      <UiStateScope.Provider value="pair:en-de">
        <CategoryView
          pair={pair}
          settings={{ ...defaultSettings, interfaceLanguage: language }}
          update={vi.fn()}
          t={translator(language)}
          onPractice={practice}
        />
      </UiStateScope.Provider>,
    ),
  );
}
function folder(name: string) {
  return Array.from(
    host.querySelectorAll<HTMLLabelElement>(".vocabulary-folder-options label"),
  )
    .find((label) => label.textContent === name)!
    .querySelector<HTMLInputElement>("input")!;
}
function rows() {
  return Array.from(host.querySelectorAll(".word-detail strong")).map(
    (word) => word.textContent,
  );
}
function challenging() {
  act(() =>
    host.querySelector<HTMLInputElement>(".challenging-filter input")!.click(),
  );
}
function search(query: string) {
  const input = host.querySelector<HTMLInputElement>(".search-field input")!;
  act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!.call(input, query);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
it("combines challenging criteria with multiple folders and search, and practices exactly those results", () => {
  render();
  expect(rows()).toHaveLength(5);
  challenging();
  expect(new Set(rows())).toEqual(
    new Set(["difficult core", "difficult travel", "shared difficult"]),
  );
  act(() => folder("Core").click());
  expect(new Set(rows())).toEqual(
    new Set(["difficult core", "shared difficult"]),
  );
  act(() => folder("Travel").click());
  expect(rows()).toHaveLength(3);
  search("meaning");
  expect(rows()).toHaveLength(3);
  search("travel meaning");
  expect(rows()).toEqual(["difficult travel"]);
  const button = host.querySelector<HTMLButtonElement>(
    ".vocabulary-challenging-summary button",
  )!;
  act(() => button.click());
  expect(practice).toHaveBeenCalledExactlyOnceWith({
    kind: "words",
    ids: ["travel"],
  });
  expect(pair.categories.every((category) => !category.isActiveForStudy)).toBe(
    true,
  );
  expect(host.querySelector(".word-review-count")?.textContent).toContain(
    "0 / 1.7",
  );
});
it("shows empty results without allowing an empty practice session and restores the selected filters", () => {
  render();
  challenging();
  act(() => folder("Core").click());
  search("no match");
  expect(rows()).toHaveLength(0);
  expect(
    host.querySelector<HTMLButtonElement>(
      ".vocabulary-challenging-summary button",
    )!.disabled,
  ).toBe(true);
  act(() => root.unmount());
  root = createRoot(host);
  render();
  expect(
    host.querySelector<HTMLInputElement>(".challenging-filter input")!.checked,
  ).toBe(true);
  expect(folder("Core").checked).toBe(true);
  expect(folder("Travel").checked).toBe(false);
  search("");
  expect(rows()).toHaveLength(2);
  challenging();
  expect(rows()).toHaveLength(4);
});
it("localizes the challenging filter", () => {
  for (const language of languages) {
    render(language);
    expect(host.querySelector(".challenging-filter")?.textContent).toContain(
      translator(language)("challengingWords"),
    );
  }
});

it("confirms folder deletion, preserves words, and clears deleted folder selections", () => {
  const updates = vi.fn();
  function Harness() {
    const [current, setCurrent] = useState(pair);
    return (
      <UiStateScope.Provider value="pair:en-de">
        <CategoryView
          pair={current}
          settings={defaultSettings}
          update={(next) => {
            updates(next);
            setCurrent(next);
          }}
          t={translator("en")}
          onPractice={practice}
        />
      </UiStateScope.Provider>
    );
  }
  act(() => root.render(<Harness />));
  act(() => folder("Core").click());
  act(() =>
    host
      .querySelector<HTMLButtonElement>('[aria-label="Delete folder: Core"]')!
      .click(),
  );
  expect(host.querySelector("#delete-folder-hint")?.textContent).toBe(
    translator("en")("deleteFolderHint"),
  );
  expect(updates).not.toHaveBeenCalled();
  act(() =>
    host
      .querySelector<HTMLButtonElement>(".delete-folder-actions button")!
      .click(),
  );
  expect(updates).not.toHaveBeenCalled();
  expect(host.querySelectorAll(".category-panel")).toHaveLength(2);
  act(() =>
    host
      .querySelector<HTMLButtonElement>('[aria-label="Delete folder: Core"]')!
      .click(),
  );
  act(() =>
    host.querySelector<HTMLButtonElement>(".folder-delete-confirm")!.click(),
  );
  const result: PairData = updates.mock.lastCall![0];
  expect(result.categories.map((category) => category.name.en)).toEqual([
    "Travel",
  ]);
  expect(result.words).toHaveLength(pair.words.length);
  expect(result.words.find((word) => word.id === "core")?.categoryIds).toEqual(
    [],
  );
  expect(
    result.words.find((word) => word.id === "shared")?.categoryIds,
  ).toEqual([pair.categories[1].id]);
  expect(folder(translator("en")("all")).checked).toBe(true);
  expect(rows()).toHaveLength(5);
  expect(host.querySelectorAll(".category-panel")).toHaveLength(1);
  act(() =>
    host
      .querySelector<HTMLButtonElement>('[aria-label="Delete folder: Travel"]')!
      .click(),
  );
  act(() =>
    host.querySelector<HTMLButtonElement>(".folder-delete-confirm")!.click(),
  );
  expect(host.querySelectorAll(".category-panel")).toHaveLength(0);
  expect(rows()).toHaveLength(5);
});

it("defaults to keeping words each time and deletes shared words only after explicit selection", () => {
  const updates = vi.fn();
  act(() =>
    root.render(
      <CategoryView
        pair={pair}
        settings={defaultSettings}
        update={updates}
        t={translator("en")}
        onPractice={practice}
      />,
    ),
  );
  const open = () =>
    act(() =>
      host
        .querySelector<HTMLButtonElement>('[aria-label="Delete folder: Core"]')!
        .click(),
    );
  const option = () =>
    host.querySelector<HTMLInputElement>(".delete-folder-option input")!;
  open();
  expect(option().checked).toBe(false);
  expect(host.querySelector(".delete-folder-word-count")?.textContent).toBe(
    "(4)",
  );
  act(() => option().click());
  expect(host.querySelector("#delete-folder-hint")?.textContent).toBe(
    translator("en")("deleteFolderWordsHint"),
  );
  act(() =>
    host
      .querySelector<HTMLButtonElement>(".delete-folder-actions button")!
      .click(),
  );
  expect(updates).not.toHaveBeenCalled();
  open();
  expect(option().checked).toBe(false);
  act(() => option().click());
  expect(host.querySelector(".folder-delete-confirm")?.textContent).toBe(
    "Delete folder and words",
  );
  act(() =>
    host.querySelector<HTMLButtonElement>(".folder-delete-confirm")!.click(),
  );
  const result: PairData = updates.mock.lastCall![0];
  expect(result.words.map((word) => word.id)).toEqual(["travel"]);
  expect(result.categories.map((category) => category.name.en)).toEqual([
    "Travel",
  ]);
});
