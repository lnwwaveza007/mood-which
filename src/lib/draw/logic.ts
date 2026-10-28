import { DrawState } from './types';

// Sale day ends 12.00 (Thailand time) on 12 Nov 2569 (2026).
export const SALE_END = Date.parse('2026-11-12T12:00:00+07:00');
const RUSH_WINDOW_MIN = 30;

/** Pure win/lose decision for the next entry. Server-only: never import this in client code. */
export function decideWin(state: DrawState, now: number, rand: () => number = Math.random): boolean {
  const { config } = state;
  const prizesLeft = config.prizePool - state.prizesGiven;
  if (prizesLeft <= 0) return false;
  if (state.sales < config.unlockAt) return false;

  const counter = Object.keys(state.entries).length + 1; // this entry's position

  if (config.mode === 'A') return counter % Math.max(1, config.n) === 0;

  // Mode B: prizes left / expected entries left, with a rush to finish by 12.00.
  const entriesLeft = Math.max(1, config.expectedEntries - counter + 1);
  let chance = Math.min(1, Math.max(0, prizesLeft / entriesLeft));
  const minsLeft = (SALE_END - now) / 60000;
  if (minsLeft >= 0 && minsLeft <= RUSH_WINDOW_MIN) chance = Math.max(chance, 1 - minsLeft / RUSH_WINDOW_MIN);
  return rand() < chance;
}

export function prizeCode(sequence: number): string {
  return `MW-${String(sequence).padStart(2, '0')}`;
}

export function normalizeHandle(raw: string): string | null {
  const h = raw.trim().replace(/^@+/, '').toLowerCase();
  return /^[a-z0-9._]{1,30}$/.test(h) ? h : null;
}
