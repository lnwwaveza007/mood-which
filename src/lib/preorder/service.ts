import { createHash, randomUUID } from 'node:crypto';
import { docStore } from '@/lib/docStore';
import { checkPin, ServiceError } from '@/lib/draw/service';
import { normalizeHandle } from '@/lib/draw/logic';
import { promptpayPayload } from './promptpay';
import { deleteSlips, readSlip, saveSlip, sniffImage } from './slips';
import { Cart, countPieces, itemById, MAX_PIECES_PER_ORDER, PREORDER_DEADLINE, priceFor, PROMPTPAY_ID } from './menu';
import { ClosedReason, emptyPreorder, Order, OrderStatus, PreorderState } from './types';

const store = docStore<PreorderState>('preorder', emptyPreorder);

export const MAX_SLIP_BYTES = 3 * 1024 * 1024;
const MIN_SLIP_BYTES = 2 * 1024;

const clean = (v: FormDataEntryValue | null, max: number) =>
  typeof v === 'string' ? v.trim().replace(/\s+/g, ' ').slice(0, max) : '';

const reserved = (s: PreorderState) =>
  s.orders.filter((o) => o.status !== 'rejected').reduce((sum, o) => sum + o.pieces, 0);

const piecesLeft = (s: PreorderState) => Math.max(0, s.config.maxPieces - reserved(s));

function closedReason(s: PreorderState, now: number): ClosedReason | null {
  if (!promptpayPayload(PROMPTPAY_ID)) return 'no_payment';
  if (!s.config.open) return 'closed';
  if (now > PREORDER_DEADLINE) return 'deadline';
  if (piecesLeft(s) <= 0) return 'sold_out';
  return null;
}

/** What the public page may know: open or not, and how much stock is left. */
export async function publicStatus() {
  const s = await store.read();
  const reason = closedReason(s, Date.now());
  return { ok: true as const, open: reason === null, reason, piecesLeft: piecesLeft(s) };
}

function parseItems(raw: FormDataEntryValue | null): Cart | null {
  if (typeof raw !== 'string') return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  const cart: Cart = {};
  for (const [id, qty] of Object.entries(parsed)) {
    if (!itemById(id) || !Number.isInteger(qty) || (qty as number) < 0) return null;
    if ((qty as number) > 0) cart[id] = qty as number;
  }
  const pieces = countPieces(cart);
  return pieces >= 1 && pieces <= MAX_PIECES_PER_ORDER ? cart : null;
}

const receipt = (o: Order) => ({ ok: true as const, code: o.code, pieces: o.pieces, total: o.total });

export async function createOrder(form: FormData) {
  const requestId = clean(form.get('requestId'), 64);
  const name = clean(form.get('name'), 60);
  const phone = clean(form.get('phone'), 20).replace(/\D/g, '');
  const rawIg = clean(form.get('ig'), 40);
  const note = clean(form.get('note'), 200);
  const items = parseItems(form.get('items'));
  const slip = form.get('slip');

  if (!/^[\w-]{8,64}$/.test(requestId) || !items) return { ok: false, error: 'bad_request' } as const;
  if (!name) return { ok: false, error: 'bad_name' } as const;
  if (!/^0\d{8,9}$/.test(phone)) return { ok: false, error: 'bad_phone' } as const;
  const ig = rawIg ? normalizeHandle(rawIg) : undefined;
  if (ig === null) return { ok: false, error: 'bad_handle' } as const;

  if (!(slip instanceof File)) return { ok: false, error: 'bad_slip' } as const;
  if (slip.size > MAX_SLIP_BYTES) return { ok: false, error: 'too_large' } as const;
  const bytes = new Uint8Array(await slip.arrayBuffer());
  const type = sniffImage(bytes);
  if (!type || bytes.length < MIN_SLIP_BYTES) return { ok: false, error: 'bad_slip' } as const;

  const pieces = countPieces(items);

  // Cheap checks first so a closed shop or a retry never stores another file.
  const before = await store.read();
  const earlier = before.orders.find((o) => o.requestId === requestId);
  if (earlier) return receipt(earlier);
  const closed = closedReason(before, Date.now());
  if (closed && closed !== 'sold_out') return { ok: false, error: 'closed' } as const;
  if (pieces > piecesLeft(before)) return { ok: false, error: 'sold_out', piecesLeft: piecesLeft(before) } as const;

  // The upload stays outside the lock: it is slow and would block every other order.
  const ext = type.split('/')[1];
  const slipPath = `slips/${randomUUID()}.${ext}`;
  await saveSlip(slipPath, bytes, type);
  const slipHash = createHash('sha256').update(bytes).digest('hex');

  const result = await store.update((s) => {
    const replay = s.orders.find((o) => o.requestId === requestId);
    if (replay) return { unused: true, reply: receipt(replay) };
    const closedNow = closedReason(s, Date.now());
    if (closedNow && closedNow !== 'sold_out') {
      return { unused: true, reply: { ok: false, error: 'closed' } as const };
    }
    if (pieces > piecesLeft(s)) {
      return { unused: true, reply: { ok: false, error: 'sold_out', piecesLeft: piecesLeft(s) } as const };
    }
    s.seq += 1;
    const order: Order = {
      code: `PO-${String(s.seq).padStart(3, '0')}`,
      requestId,
      at: new Date().toISOString(),
      name,
      phone,
      ...(ig ? { ig } : {}),
      ...(note ? { note } : {}),
      items,
      pieces,
      total: priceFor(items), // always computed here, never taken from the browser
      slipPath,
      slipHash,
      status: 'pending',
      delivered: false,
    };
    s.orders.push(order);
    return { unused: false, reply: receipt(order) };
  });

  if (result.unused) await deleteSlips([slipPath]).catch(() => undefined);
  return result.reply;
}

/* ── Staff ───────────────────────────────────────────────────────── */

function summary(s: PreorderState) {
  const firstUse = new Map<string, string>();
  const orders = s.orders.map((o) => {
    const duplicateOf = firstUse.get(o.slipHash) ?? null;
    if (!duplicateOf) firstUse.set(o.slipHash, o.code);
    return {
      code: o.code,
      at: o.at,
      name: o.name,
      phone: o.phone,
      ig: o.ig,
      note: o.note,
      items: o.items,
      pieces: o.pieces,
      total: o.total,
      status: o.status,
      delivered: o.delivered,
      duplicateOf,
    };
  });
  return { ok: true as const, config: s.config, piecesLeft: piecesLeft(s), orders: orders.reverse() };
}

export type StaffAction =
  | { action: 'status' }
  | { action: 'settings'; open?: boolean; maxPieces?: number }
  | { action: 'review'; code: string; status: OrderStatus }
  | { action: 'delivered'; code: string; delivered: boolean }
  | { action: 'reset'; confirmPin: string };

export async function staff(pin: unknown, req: StaffAction) {
  const removed: string[] = [];
  const reply = await store.update((s) => {
    const now = Date.now();
    const bad = checkPin(s, pin, now);
    if (bad) return bad;

    switch (req.action) {
      case 'status':
        break;
      case 'settings':
        if (typeof req.open === 'boolean') s.config.open = req.open;
        if (req.maxPieces !== undefined) {
          if (!Number.isInteger(req.maxPieces) || req.maxPieces < 0 || req.maxPieces > 5000) {
            return { ok: false, error: 'bad_request' } as ServiceError;
          }
          s.config.maxPieces = req.maxPieces;
        }
        break;
      case 'review':
      case 'delivered': {
        const order = s.orders.find((o) => o.code === req.code);
        if (!order) return { ok: false, error: 'bad_request' } as ServiceError;
        if (req.action === 'delivered') order.delivered = Boolean(req.delivered);
        else if (['pending', 'paid', 'rejected'].includes(req.status)) order.status = req.status;
        else return { ok: false, error: 'bad_request' } as ServiceError;
        break;
      }
      case 'reset': {
        // Second PIN check on purpose: this wipes every order and slip for good.
        const again = checkPin(s, req.confirmPin, now);
        if (again) return again;
        removed.push(...s.orders.map((o) => o.slipPath));
        s.orders = [];
        s.seq = 0;
        break;
      }
      default:
        return { ok: false, error: 'bad_request' } as ServiceError;
    }
    return summary(s);
  });
  await deleteSlips(removed);
  return reply;
}

/** Returns the slip file to staff, or a failed reply when the PIN or code is wrong. */
export async function staffSlip(pin: unknown, code: unknown) {
  const found = await store.update((s) => {
    const bad = checkPin(s, pin, Date.now());
    return { bad, path: bad ? null : (s.orders.find((o) => o.code === code)?.slipPath ?? null) };
  });
  if (found.bad) return { slip: null, reply: found.bad };
  const slip = found.path ? await readSlip(found.path) : null;
  return slip ? { slip, reply: null } : { slip: null, reply: { ok: false, error: 'bad_request' } as ServiceError };
}
