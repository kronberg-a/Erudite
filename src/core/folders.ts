import type { PairData } from "../types";

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
