import { readJSON, writeJSON } from './persistCore';
import { storageKeys } from './storageKeys';

export type LibraryRecord = {
  id: string;
  categoryKey: string;
  title: string;
  excerpt: string;
  body: string;
  isCustom: true;
  createdAt: number;
};

export async function loadCustomLibrary(): Promise<LibraryRecord[]> {
  return readJSON<LibraryRecord[]>(storageKeys.customLibrary, []);
}

export async function saveCustomLibrary(entries: LibraryRecord[]): Promise<void> {
  await writeJSON(storageKeys.customLibrary, entries);
}

export async function appendCustomEntry(entry: LibraryRecord): Promise<LibraryRecord[]> {
  const current = await loadCustomLibrary();
  const next = [entry, ...current];
  await saveCustomLibrary(next);
  return next;
}

export async function removeCustomEntry(id: string): Promise<LibraryRecord[]> {
  const current = await loadCustomLibrary();
  const next = current.filter(item => item.id !== id);
  await saveCustomLibrary(next);
  return next;
}

export async function loadRemovedDefaults(): Promise<string[]> {
  return readJSON<string[]>(storageKeys.removedDefaults, []);
}

export async function markDefaultRemoved(id: string): Promise<string[]> {
  const current = await loadRemovedDefaults();
  if (current.includes(id)) {
    return current;
  }
  const next = [...current, id];
  await writeJSON(storageKeys.removedDefaults, next);
  return next;
}
