import { FundamentalMood } from '@/data/quizData';
import { Cart, DEFAULT_STOCK_PIECES, itemById, MOODS } from './menu';

// Stock is counted per filling, in halves: one piece is two halves.
// A single-filling piece uses 2 halves of that filling; a MIX piece uses 1 half of each.
// Shared by the page (to grey out sold-out fillings) and the server (the real check).

export type Halves = Record<FundamentalMood, number>;

export interface FillingStock {
  /** Staff switch: false = out of stock, whatever the limit says. */
  open: boolean;
  /** How many halves of this filling can be sold in total. */
  halves: number;
}

export type StockConfig = Record<FundamentalMood, FillingStock>;

export const zeroHalves = (): Halves => ({ happy: 0, boring: 0, angry: 0, sad: 0 });

export function defaultStock(): StockConfig {
  const out = {} as StockConfig;
  for (const m of MOODS) out[m] = { open: true, halves: DEFAULT_STOCK_PIECES[m] * 2 };
  return out;
}

/** Halves of each filling that a cart needs. */
export function halvesOfCart(cart: Cart): Halves {
  const used = zeroHalves();
  for (const [id, qty] of Object.entries(cart)) {
    const moods = itemById(id)?.moods ?? [];
    for (const m of moods) used[m] += (moods.length === 1 ? 2 : 1) * qty;
  }
  return used;
}

/** Halves still sellable per filling. A filling switched off counts as zero. */
export function leftHalves(stock: StockConfig, used: Halves): Halves {
  const left = zeroHalves();
  for (const m of MOODS) left[m] = stock[m].open ? Math.max(0, stock[m].halves - used[m]) : 0;
  return left;
}

/** Can one more piece made of halves `a` and `b` be made from what is left? */
export function fits(left: Halves, a: FundamentalMood, b: FundamentalMood): boolean {
  return a === b ? left[a] >= 2 : left[a] >= 1 && left[b] >= 1;
}

/** True while at least one piece can still be made. */
export const anyPieceLeft = (left: Halves) => MOODS.reduce((sum, m) => sum + left[m], 0) >= 2;
