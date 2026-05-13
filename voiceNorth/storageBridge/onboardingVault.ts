import { readJSON, writeJSON } from './persistCore';
import { storageKeys } from './storageKeys';

export async function loadWelcomeFinished(): Promise<boolean> {
  return readJSON<boolean>(storageKeys.welcomeFinished, false);
}

export async function markWelcomeFinished(): Promise<void> {
  await writeJSON(storageKeys.welcomeFinished, true);
}
