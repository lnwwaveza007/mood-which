import { withState } from './store';
import { decideWin, normalizeHandle, prizeCode } from './logic';
import { DrawConfig, DrawState } from './types';

const MAX_TRIES = 3;
const LOCK_MS = 30_000;

export type ServiceError =
  | { ok: false; error: 'bad_handle' }
  | { ok: false; error: 'disabled' }
  | { ok: false; error: 'wrong_pin'; triesLeft: number }
  | { ok: false; error: 'locked'; waitSec: number }
  | { ok: false; error: 'not_configured' }
  | { ok: false; error: 'bad_request' };

/** The draw is run from the booth iPad, so one PIN (the admin PIN) guards everything. */
function expectedPin(): string | null {
  const dev = process.env.NODE_ENV !== 'production';
  return process.env.DRAW_ADMIN_PIN ?? process.env.DRAW_STAFF_PIN ?? (dev ? '1234' : null);
}

/** Shared lockout: 3 wrong PINs and the booth waits 30 s (stops guessing a 4-digit PIN). */
function checkPin(state: DrawState, supplied: unknown, now: number): ServiceError | null {
  const expected = expectedPin();
  if (!expected) return { ok: false, error: 'not_configured' };
  if (now < state.lockUntil) return { ok: false, error: 'locked', waitSec: Math.ceil((state.lockUntil - now) / 1000) };
  if (typeof supplied === 'string' && supplied === expected) {
    state.pinFails = 0;
    return null;
  }
  state.pinFails += 1;
  if (state.pinFails >= MAX_TRIES) {
    state.pinFails = 0;
    state.lockUntil = now + LOCK_MS;
    return { ok: false, error: 'locked', waitSec: LOCK_MS / 1000 };
  }
  return { ok: false, error: 'wrong_pin', triesLeft: MAX_TRIES - state.pinFails };
}

const left = (s: DrawState) => Math.max(0, s.config.prizePool - s.prizesGiven);

/** Kiosk step 1: is this IG handle still allowed to play? Does not spend the entry. */
export async function kioskCheck(pin: unknown, rawHandle: unknown) {
  const handle = typeof rawHandle === 'string' ? normalizeHandle(rawHandle) : null;
  if (!handle) return { ok: false, error: 'bad_handle' } as ServiceError;
  return withState((s) => {
    const bad = checkPin(s, pin, Date.now());
    if (bad) return bad;
    if (!s.config.enabled) return { ok: false, error: 'disabled' } as ServiceError;
    return { ok: true as const, handle, alreadyUsed: Boolean(s.entries[handle]), prizesLeft: left(s) };
  });
}

/** Kiosk step 2: the one place a result is decided. */
export async function kioskSpin(pin: unknown, rawHandle: unknown) {
  const handle = typeof rawHandle === 'string' ? normalizeHandle(rawHandle) : null;
  if (!handle) return { ok: false, error: 'bad_handle' } as ServiceError;
  return withState((s) => {
    const now = Date.now();
    const bad = checkPin(s, pin, now);
    if (bad) return bad;
    if (!s.config.enabled) return { ok: false, error: 'disabled' } as ServiceError;

    const prev = s.entries[handle];
    if (prev) {
      // Repeat / refresh: replay the saved result, never re-roll.
      return { ok: true as const, alreadyUsed: true, result: prev.result, prizeCode: prev.prizeCode, prizesLeft: left(s) };
    }

    const win = decideWin(s, now);
    const code = win ? prizeCode(s.prizesGiven + 1) : undefined;
    if (win) s.prizesGiven += 1;
    s.entries[handle] = { handle, result: win ? 'win' : 'lose', prizeCode: code, at: new Date(now).toISOString(), collected: false };
    return { ok: true as const, alreadyUsed: false, result: win ? ('win' as const) : ('lose' as const), prizeCode: code, prizesLeft: left(s) };
  });
}

/* ── Admin ───────────────────────────────────────────────────────── */

function summary(s: DrawState) {
  const entries = Object.values(s.entries);
  const winners = entries
    .filter((e) => e.result === 'win')
    .sort((a, b) => a.at.localeCompare(b.at))
    .map((e) => ({ prizeCode: e.prizeCode!, handle: e.handle, at: e.at, collected: e.collected }));
  return {
    ok: true as const,
    config: s.config,
    sales: s.sales,
    entries: entries.length,
    prizesGiven: s.prizesGiven,
    prizesLeft: left(s),
    winners,
  };
}

export type AdminAction =
  | { action: 'status' }
  | { action: 'settings'; config: Partial<DrawConfig> }
  | { action: 'sales'; delta: number }
  | { action: 'collected'; prizeCode: string; collected: boolean }
  | { action: 'reset'; confirmPin: string };

const int = (v: unknown, min: number, max: number) =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max ? v : null;

export async function admin(pin: unknown, req: AdminAction) {
  return withState((s) => {
    const now = Date.now();
    const bad = checkPin(s, pin, now);
    if (bad) return bad;

    switch (req.action) {
      case 'status':
        break;
      case 'settings': {
        const c = req.config ?? {};
        const next = { ...s.config };
        if (typeof c.enabled === 'boolean') next.enabled = c.enabled;
        if (c.mode === 'A' || c.mode === 'B') next.mode = c.mode;
        for (const [k, min, max] of [['prizePool', 0, 200], ['n', 1, 100], ['unlockAt', 0, 1000], ['expectedEntries', 1, 1000]] as const) {
          if (c[k] !== undefined) {
            const v = int(c[k], min, max);
            if (v === null) return { ok: false, error: 'bad_request' } as ServiceError;
            next[k] = v;
          }
        }
        s.config = next;
        break;
      }
      case 'sales': {
        const d = int(req.delta, -100, 100);
        if (d === null) return { ok: false, error: 'bad_request' } as ServiceError;
        s.sales = Math.max(0, s.sales + d);
        break;
      }
      case 'collected': {
        const e = Object.values(s.entries).find((x) => x.prizeCode === req.prizeCode);
        if (!e) return { ok: false, error: 'bad_request' } as ServiceError;
        e.collected = Boolean(req.collected);
        break;
      }
      case 'reset': {
        // Second PIN check on purpose: a stray tap on a staff phone can't wipe the counters.
        const again = checkPin(s, req.confirmPin, now);
        if (again) return again;
        const keep = s.config;
        s.entries = {};
        s.prizesGiven = 0;
        s.sales = 0;
        s.config = keep;
        break;
      }
      default:
        return { ok: false, error: 'bad_request' } as ServiceError;
    }
    return summary(s);
  });
}
