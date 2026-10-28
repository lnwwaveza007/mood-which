export type DrawMode = 'A' | 'B';

export interface DrawConfig {
  enabled: boolean;
  /** Half-sandwich prizes to give away in total. */
  prizePool: number;
  /** A = every Nth verified entry wins; B = paced odds. */
  mode: DrawMode;
  n: number;
  /** Draw only pays out once this many sales are recorded (0 = off). */
  unlockAt: number;
  /** Mode B estimate of total entries on the day. */
  expectedEntries: number;
}

export interface DrawEntry {
  handle: string;
  result: 'win' | 'lose';
  prizeCode?: string;
  at: string;
  collected: boolean;
}

export interface DrawState {
  config: DrawConfig;
  prizesGiven: number;
  sales: number;
  entries: Record<string, DrawEntry>;
  pinFails: number;
  lockUntil: number;
}

export const DEFAULT_CONFIG: DrawConfig = {
  enabled: true,
  prizePool: 10,
  mode: 'A',
  n: 5,
  unlockAt: 0,
  expectedEntries: 50,
};

export function emptyState(): DrawState {
  return { config: { ...DEFAULT_CONFIG }, prizesGiven: 0, sales: 0, entries: {}, pinFails: 0, lockUntil: 0 };
}
