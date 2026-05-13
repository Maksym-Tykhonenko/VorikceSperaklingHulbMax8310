import { readJSON, writeJSON } from './persistCore';
import { storageKeys } from './storageKeys';

export async function loadFavoriteArticleIds(): Promise<number[]> {
  return readJSON<number[]>(storageKeys.favoriteArticles, []);
}

export async function toggleFavoriteArticle(id: number): Promise<number[]> {
  const current = await loadFavoriteArticleIds();
  const has = current.includes(id);
  const next = has ? current.filter(item => item !== id) : [id, ...current];
  await writeJSON(storageKeys.favoriteArticles, next);
  return next;
}
