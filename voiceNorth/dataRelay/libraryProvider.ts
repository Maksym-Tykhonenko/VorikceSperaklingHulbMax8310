import defaultTexts from '../../danekinspek/suflers';
import { LibraryRecord, loadCustomLibrary, loadRemovedDefaults } from '../storageBridge/libraryVault';

export type LibraryEntry = {
  id: string;
  categoryKey: string;
  title: string;
  excerpt: string;
  body: string;
  isCustom: boolean;
  createdAt?: number;
};

export type LibrarySnapshot = {
  all: LibraryEntry[];
  byCategory: Record<string, LibraryEntry[]>;
  customCount: number;
  defaultCount: number;
};

export async function loadLibrarySnapshot(): Promise<LibrarySnapshot> {
  const [custom, removed] = await Promise.all([loadCustomLibrary(), loadRemovedDefaults()]);
  const defaults = (defaultTexts as LibraryEntry[]).filter(item => !removed.includes(item.id));
  const customLifted: LibraryEntry[] = (custom as LibraryRecord[]).map(item => ({
    id: item.id,
    categoryKey: item.categoryKey,
    title: item.title,
    excerpt: item.excerpt,
    body: item.body,
    isCustom: true,
    createdAt: item.createdAt,
  }));
  const all = [...customLifted, ...defaults];
  const byCategory: Record<string, LibraryEntry[]> = {};
  for (const entry of all) {
    if (!byCategory[entry.categoryKey]) {
      byCategory[entry.categoryKey] = [];
    }
    byCategory[entry.categoryKey].push(entry);
  }
  return {
    all,
    byCategory,
    customCount: customLifted.length,
    defaultCount: defaults.length,
  };
}

export function countWords(text: string): number {
  return text
    .split(/\s+/)
    .map(part => part.trim())
    .filter(part => part.length > 0).length;
}
