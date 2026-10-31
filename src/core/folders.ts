import { languages, type Category, type PairData } from "../types";

export function renameFolder(pair: PairData, folderId: string, name: string): PairData {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 80 || !pair.categories.some((category) => category.id === folderId)) return pair;
  return { ...pair, categories: pair.categories.map((category) => category.id === folderId
    ? { ...category, name: Object.fromEntries(languages.map((language) => [language, trimmed])) as Category["name"] }
    : category) };
}

// Copy adds a membership to the same card; move removes only the selected source.
// Neither operation duplicates vocabulary or changes its learning history.
export function transferWord(pair: PairData, wordId: string, destinationId: string, sourceId?: string): PairData {
  if (!pair.categories.some((category) => category.id === destinationId)) return pair;
  const word = pair.words.find((word) => word.id === wordId);
  if (!word || (sourceId && !word.categoryIds.includes(sourceId)) || sourceId === destinationId) return pair;
  const categoryIds = [...new Set([...word.categoryIds.filter((id) => id !== sourceId), destinationId])];
  return { ...pair, words: pair.words.map((card) => card.id === wordId ? { ...card, categoryIds } : card) };
}

export function deleteFolder(
  pair: PairData,
  folderId: string,
  deleteWords = false,
): PairData {
  if (!pair.categories.some((category) => category.id === folderId))
    return pair;
  return {
    ...pair,
    categories: pair.categories.filter((category) => category.id !== folderId),
    words: deleteWords
      ? pair.words.filter((word) => !word.categoryIds.includes(folderId))
      : pair.words.map((word) =>
          word.categoryIds.includes(folderId)
            ? {
                ...word,
                categoryIds: word.categoryIds.filter((id) => id !== folderId),
              }
            : word,
        ),
  };
}
