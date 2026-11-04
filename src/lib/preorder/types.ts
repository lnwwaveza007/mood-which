import { Cart } from './menu';
import { defaultStock, StockConfig } from './stock';

export type OrderStatus = 'pending' | 'paid' | 'rejected';

export interface Order {
  code: string;
  /** Sent by the browser so a retried submit returns the same order instead of a second one. */
  requestId: string;
  at: string;
  name: string;
  phone: string;
  ig?: string;
  note?: string;
  items: Cart;
  pieces: number;
  total: number;
  slipPath: string;
  slipHash: string;
  status: OrderStatus;
  delivered: boolean;
}

export interface PreorderConfig {
  open: boolean;
  /** Pieces the team can make. Rejected orders give their pieces back. */
  maxPieces: number;
  /** Per-filling limit and out-of-stock switch. Missing in data saved before this existed. */
  stock?: StockConfig;
}

export interface PreorderState {
  config: PreorderConfig;
  seq: number;
  orders: Order[];
  pinFails: number;
  lockUntil: number;
}

export function emptyPreorder(): PreorderState {
  return { config: { open: true, maxPieces: 200, stock: defaultStock() }, seq: 0, orders: [], pinFails: 0, lockUntil: 0 };
}

export type ClosedReason = 'closed' | 'deadline' | 'sold_out' | 'no_payment';
