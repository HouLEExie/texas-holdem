import type { Game } from '../types';

const HISTORY_KEY = 'texas-holdem-settlement.history.v1';
const CURRENT_GAME_KEY = 'texas-holdem-settlement.current-game.v1';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadHistoryGames(): Game[] {
  return readJson<Game[]>(HISTORY_KEY, []).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function saveHistoryGames(games: Game[]): void {
  writeJson(
    HISTORY_KEY,
    [...games].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  );
}

export function loadCurrentGame(): Game | null {
  return readJson<Game | null>(CURRENT_GAME_KEY, null);
}

export function saveCurrentGame(game: Game | null): void {
  if (typeof window === 'undefined') return;
  if (!game) {
    window.localStorage.removeItem(CURRENT_GAME_KEY);
    return;
  }
  writeJson(CURRENT_GAME_KEY, game);
}

export function upsertHistoryGame(games: Game[], game: Game): Game[] {
  const settledGame: Game = {
    ...game,
    status: 'settled',
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = games.findIndex((entry) => entry.id === settledGame.id);
  if (existingIndex >= 0) {
    const nextGames = [...games];
    nextGames[existingIndex] = settledGame;
    return nextGames.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  return [settledGame, ...games].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
