import { readJSON, writeJSON } from './persistCore';
import { storageKeys } from './storageKeys';

export type RecordedSession = {
  id: string;
  textId: string;
  textTitle: string;
  categoryKey: string;
  speedKey: 'slow' | 'medium' | 'fast';
  sizeKey: 'small' | 'medium' | 'large';
  seconds: number;
  wordsRead: number;
  finishedAt: number;
};

export async function loadSessions(): Promise<RecordedSession[]> {
  return readJSON<RecordedSession[]>(storageKeys.sessionLedger, []);
}

export async function appendSession(session: RecordedSession): Promise<RecordedSession[]> {
  const current = await loadSessions();
  const next = [session, ...current].slice(0, 250);
  await writeJSON(storageKeys.sessionLedger, next);
  return next;
}
