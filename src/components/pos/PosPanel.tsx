'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { Banknote, Minus, QrCode, Trash2, Undo2, X } from 'lucide-react';
import { SectionTag } from '@/components/Decor';
import { BASE_SANDWICH_FILLINGS, FundamentalMood } from '@/data/quizData';
import { api, ApiFail, errorText } from '@/lib/draw/client';
import { Cart, countPieces, FILLING_SHORT, itemById, MENU, MenuItem, MOODS, priceFor, PROMPTPAY_ID, PROMPTPAY_NAME, unitPrice } from '@/lib/preorder/menu';
import { promptpayPayload } from '@/lib/preorder/promptpay';
import { fits, Halves, halvesOfCart, StockConfig } from '@/lib/preorder/stock';
import { PayMethod, Sale } from '@/lib/preorder/types';

interface PosData {
  stock: StockConfig;
  stockLeft: Halves;
  totals: { sales: number; pieces: number; cash: number; transfer: number; preorderPaid: number; preorderPieces: number };
  sales: Sale[];
}

type PosFail = ApiFail | { ok: false; error: 'sold_out'; short: FundamentalMood[] };

const PIN_KEY = 'moodwhich:pos:pin';
const POLL_MS = 10000;
const card = 'rounded-2xl bg-white text-ink border-[3px] border-ink p-4 shadow-[4px_4px_0_#0D0D0D]';
const color = (m: FundamentalMood) => BASE_SANDWICH_FILLINGS[m].color;
/** Halves → pieces: 7 halves = 3.5 pieces. */
const pieces = (halves: number) => String(halves / 2);
const timeTh = (iso: string) => new Date(iso).toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit' });
const newRequestId = () => crypto.randomUUID().replace(/-/g, '');

function failText(res: PosFail) {
  if (res.error === 'sold_out' && 'short' in res) return `ของไม่พอ: ${res.short.map((m) => FILLING_SHORT[m]).join(', ')}`;
  return errorText(res as ApiFail);
}

export default function PosPanel() {
  const [pin, setPin] = useState('');
  const pinRef = useRef('');
  const [data, setData] = useState<PosData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'sell' | 'summary'>('sell');
  const [cart, setCart] = useState<Cart>({});
  const [paying, setPaying] = useState<PayMethod | null>(null);
  const [received, setReceived] = useState('');
  const [done, setDone] = useState<Sale | null>(null);
  // One id per checkout: a double tap or a retry sends the same id, so the server records it once.
  const requestId = useRef(newRequestId());

  const call = useCallback(async (body: Record<string, unknown>) => {
    const res = await api<PosData>('/api/pos', { pin: pinRef.current, ...body });
    if (!res.ok) {
      setError(failText(res as PosFail));
      return null;
    }
    setError(null);
    setData(res);
    return res;
  }, []);

  const signIn = async (candidate: string) => {
    setBusy(true);
    pinRef.current = candidate;
    const res = await call({ action: 'status' });
    setBusy(false);
    if (res) {
      try {
        sessionStorage.setItem(PIN_KEY, candidate);
      } catch {
        // storage blocked: log in again after a refresh
      }
    }
  };

  const signOut = () => {
    try {
      sessionStorage.removeItem(PIN_KEY);
    } catch {
      // ignore
    }
    pinRef.current = '';
    setPin('');
    setData(null);
  };

  // Resume after a refresh.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(PIN_KEY);
    } catch {
      // ignore
    }
    if (!saved) return;
    pinRef.current = saved;
    let alive = true;
    api<PosData>('/api/pos', { pin: saved, action: 'status' }).then((res) => {
      if (alive && res.ok) setData(res);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Keep stock fresh: pre-orders and the other till use the same stock.
  const authed = Boolean(data);
  useEffect(() => {
    if (!authed) return;
    const t = setInterval(() => void call({ action: 'status' }), POLL_MS);
    return () => clearInterval(t);
  }, [authed, call]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(null), 6000);
    return () => clearTimeout(t);
  }, [done]);

  /** Stock left after what is already in the cart. */
  const leftNow = useMemo(() => {
    if (!data) return null;
    const need = halvesOfCart(cart);
    return Object.fromEntries(MOODS.map((m) => [m, data.stockLeft[m] - need[m]])) as Halves;
  }, [data, cart]);

  const total = priceFor(cart);
  const count = countPieces(cart);
  const qr = useMemo(() => (paying === 'transfer' && total > 0 ? promptpayPayload(PROMPTPAY_ID, total) : null), [paying, total]);

  // Checked inside the updater too, so fast taps can never put more in the bill than is left.
  const add = (item: MenuItem) =>
    setCart((c) => {
      if (!data) return c;
      const need = halvesOfCart(c);
      const left = Object.fromEntries(MOODS.map((m) => [m, data.stockLeft[m] - need[m]])) as Halves;
      return fits(left, item.moods[0], item.moods[1] ?? item.moods[0]) ? { ...c, [item.id]: (c[item.id] ?? 0) + 1 } : c;
    });
  const remove = (id: string) =>
    setCart((c) => {
      const next = { ...c, [id]: (c[id] ?? 0) - 1 };
      if (next[id] <= 0) delete next[id];
      return next;
    });

  const checkout = async (pay: PayMethod) => {
    setBusy(true);
    const res = await call({ action: 'sell', requestId: requestId.current, items: cart, pay });
    setBusy(false);
    if (!res) return;
    setDone(res.sales.find((x) => x.requestId === requestId.current) ?? null);
    setCart({});
    setPaying(null);
    setReceived('');
    requestId.current = newRequestId();
  };

  if (!data || !leftNow) {
    return (
      <main className="min-h-dvh text-white relative z-[1]">
        <header className="w-full max-w-xl mx-auto px-4 pt-4 flex items-center justify-between">
          <SectionTag />
          <Link href="/" className="text-xs font-semibold text-yellow">หน้าแรก</Link>
        </header>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void signIn(pin);
          }}
          className={`${card} max-w-sm mt-16 mx-4 sm:mx-auto space-y-3`}
        >
          <h1 className="font-black text-xl">ขายหน้าร้าน (POS)</h1>
          <label className="block text-sm font-bold">
            PIN
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="mt-1 w-full rounded-lg border-2 border-ink px-3 py-2.5 text-lg font-bold"
            />
          </label>
          {error && <p role="alert" className="text-sm font-bold text-alert">{error}</p>}
          <button disabled={busy || !pin} className="btn-sticker w-full rounded-full py-3 font-black cursor-pointer disabled:opacity-60">
            เข้าสู่ระบบ
          </button>
        </form>
      </main>
    );
  }

  const t = data.totals;
  const change = Number(received) - total;

  return (
    <main className="min-h-dvh text-white relative z-[1] pb-44">
      <header className="w-full max-w-4xl mx-auto px-4 pt-4 flex items-center justify-between gap-3">
        <SectionTag />
        <div className="flex gap-4 text-xs font-semibold text-yellow">
          <Link href="/preorder/admin">พรีออเดอร์ / ตั้งสต็อก</Link>
          <button onClick={signOut} className="cursor-pointer">ออกจากระบบ</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-3 space-y-4">
        <div className="flex gap-2" role="tablist">
          {(
            [
              ['sell', 'ขาย'],
              ['summary', `สรุปยอด · ${t.cash + t.transfer}.-`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`rounded-full px-5 py-2 font-black border-[3px] border-ink cursor-pointer ${tab === id ? 'bg-yellow text-ink' : 'bg-white text-ink'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <p role="alert" className="rounded-xl bg-alert text-white font-bold text-sm p-3">{error}</p>}

        {/* Stock left, always visible */}
        <section className="grid grid-cols-4 gap-2" aria-label="สต็อกคงเหลือ">
          {MOODS.map((m) => {
            const left = Math.max(0, data.stockLeft[m]);
            const out = !data.stock[m].open || left < 1;
            return (
              <div key={m} className={`rounded-xl border-[3px] border-ink p-2 text-center text-ink ${out ? 'opacity-50' : ''}`} style={{ backgroundColor: color(m) }}>
                <p className="font-black text-2xl leading-none">{out ? 'หมด' : pieces(left)}</p>
                <p className="text-[11px] sm:text-xs font-bold mt-1 leading-tight">{FILLING_SHORT[m]}{!out && ' · ชิ้น'}</p>
              </div>
            );
          })}
        </section>

        {tab === 'sell' ? (
          <>
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MENU.filter((i) => !i.isMix).map((item) => (
                <Tile key={item.id} item={item} qty={cart[item.id] ?? 0} enabled={fits(leftNow, item.moods[0], item.moods[0])} onTap={() => add(item)} />
              ))}
            </section>
            <h2 className="font-black text-lg">MIX (ครึ่ง + ครึ่ง)</h2>
            <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MENU.filter((i) => i.isMix).map((item) => (
                <Tile key={item.id} item={item} qty={cart[item.id] ?? 0} enabled={fits(leftNow, item.moods[0], item.moods[1])} onTap={() => add(item)} />
              ))}
            </section>
          </>
        ) : (
          <Summary data={data} onVoid={(code, voided) => void call({ action: 'void', code, voided })} />
        )}
      </div>

      {/* Cart bar */}
      {tab === 'sell' && (
        <div className="fixed inset-x-0 bottom-0 z-20 bg-ink text-white border-t-[3px] border-yellow">
          <div className="max-w-4xl mx-auto px-4 py-3">
            {count === 0 ? (
              <p className="text-center py-5 font-bold text-white/70">แตะเมนูเพื่อเพิ่มลงบิล</p>
            ) : (
              <>
                <ul className="flex gap-2 overflow-x-auto pb-2">
                  {Object.entries(cart).map(([id, qty]) => (
                    <li key={id}>
                      <button
                        onClick={() => remove(id)}
                        aria-label={`ลด ${itemById(id)?.title}`}
                        className="whitespace-nowrap rounded-full bg-white text-ink px-3 py-1.5 text-sm font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" /> {itemById(id)?.title} ×{qty}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button onClick={() => setCart({})} aria-label="ล้างบิล" className="rounded-full border-2 border-white/50 px-3 py-1.5 text-sm font-bold flex items-center gap-1 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" /> ล้าง
                    </button>
                  </li>
                </ul>
                <div className="flex items-center gap-3">
                  <p className="flex-1 font-black leading-tight">
                    <span className="text-3xl text-yellow">{total}.-</span>
                    <span className="block text-sm font-semibold text-white/80">{count} ชิ้น</span>
                  </p>
                  <button
                    disabled={busy}
                    onClick={() => setPaying('cash')}
                    className="rounded-2xl bg-[#16803c] px-5 py-4 font-black text-lg flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Banknote className="w-6 h-6" /> เงินสด
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => setPaying('transfer')}
                    className="rounded-2xl bg-blue border-2 border-white px-5 py-4 font-black text-lg flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <QrCode className="w-6 h-6" /> โอน
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Pay sheet */}
      {paying && (
        <div role="dialog" aria-modal="true" aria-label={paying === 'cash' ? 'รับเงินสด' : 'รับโอน'} className="fixed inset-0 z-30 bg-ink/80 flex items-end sm:items-center justify-center p-3">
          <div className={`${card} w-full max-w-md space-y-4`}>
            <div className="flex items-center justify-between">
              <h2 className="font-black text-xl">{paying === 'cash' ? 'รับเงินสด' : 'ให้ลูกค้าสแกนจ่าย'}</h2>
              <button onClick={() => setPaying(null)} aria-label="ปิด" className="cursor-pointer p-1"><X className="w-6 h-6" /></button>
            </div>
            <p className="text-center font-black text-5xl">{total}.-</p>

            {paying === 'cash' ? (
              <>
                <div className="grid grid-cols-5 gap-2">
                  {[total, 50, 100, 500, 1000]
                    .filter((v, i, all) => v >= total && all.indexOf(v) === i)
                    .map((v) => (
                      <button
                        key={v}
                        onClick={() => setReceived(String(v))}
                        className={`rounded-xl border-2 border-ink py-3 font-black cursor-pointer ${received === String(v) ? 'bg-yellow' : 'bg-white'}`}
                      >
                        {v === total ? 'พอดี' : v}
                      </button>
                    ))}
                </div>
                <label className="block text-sm font-bold">
                  รับมา (บาท)
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={received}
                    onChange={(e) => setReceived(e.target.value)}
                    className="mt-1 w-full rounded-lg border-2 border-ink px-3 py-2.5 text-2xl font-black text-right"
                  />
                </label>
                {received !== '' && (
                  <p className={`text-center font-black text-2xl ${change < 0 ? 'text-alert' : ''}`}>
                    {change < 0 ? `ขาดอีก ${-change}.-` : `ทอน ${change}.-`}
                  </p>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-1">
                {qr ? <QRCodeCanvas value={qr} size={220} level="M" marginSize={1} /> : <p className="font-bold text-alert">ยังไม่ได้ตั้งค่า PromptPay</p>}
                {PROMPTPAY_NAME && <p className="text-sm font-semibold">{PROMPTPAY_NAME}</p>}
                <p className="text-xs text-ink/60">ดูยอดเข้าในแอปธนาคารก่อนกดยืนยัน</p>
              </div>
            )}

            <button
              disabled={busy || (paying === 'cash' && received !== '' && change < 0)}
              onClick={() => void checkout(paying)}
              className="btn-sticker w-full rounded-full py-4 font-black text-xl cursor-pointer disabled:opacity-60"
            >
              {paying === 'cash' ? 'รับเงินแล้ว · บันทึก' : 'เงินเข้าแล้ว · บันทึก'}
            </button>
          </div>
        </div>
      )}

      {/* Sale saved toast, with undo */}
      {done && (
        <div role="status" className="fixed left-1/2 -translate-x-1/2 bottom-28 z-30 rounded-full bg-[#16803c] text-white px-4 py-2.5 font-bold shadow-lg flex items-center gap-3">
          ✓ บันทึก {done.code} · {done.total}.-
          <button
            onClick={() => {
              void call({ action: 'void', code: done.code, voided: true });
              setDone(null);
            }}
            className="rounded-full bg-white text-ink px-3 py-1 text-sm flex items-center gap-1 cursor-pointer"
          >
            <Undo2 className="w-4 h-4" /> ยกเลิก
          </button>
        </div>
      )}
    </main>
  );
}

function Tile({ item, qty, enabled, onTap }: { item: MenuItem; qty: number; enabled: boolean; onTap: () => void }) {
  const [a, b = a] = item.moods;
  return (
    <button
      onClick={onTap}
      disabled={!enabled}
      className="relative rounded-2xl border-[3px] border-ink text-ink text-left p-3 min-h-28 shadow-[4px_4px_0_#0D0D0D] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-transform cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none"
      style={{ background: a === b ? color(a) : `linear-gradient(135deg, ${color(a)} 50%, ${color(b)} 50%)` }}
    >
      <p className="font-black leading-tight text-lg">
        {BASE_SANDWICH_FILLINGS[a].emoji}
        {a !== b && BASE_SANDWICH_FILLINGS[b].emoji} {item.isMix ? item.title : FILLING_SHORT[a]}
      </p>
      <p className="mt-1 font-black text-xl">{enabled ? `${unitPrice(item.moods)}.-` : qty > 0 ? 'ใส่บิลครบแล้ว' : 'หมด'}</p>
      {qty > 0 && (
        <span className="absolute -top-2.5 -right-2.5 min-w-9 h-9 px-1 rounded-full bg-ink text-yellow font-black text-lg flex items-center justify-center border-2 border-white">
          {qty}
        </span>
      )}
    </button>
  );
}

function Summary({ data, onVoid }: { data: PosData; onVoid: (code: string, voided: boolean) => void }) {
  const t = data.totals;
  const sold = useMemo(() => {
    const byItem: Cart = {};
    for (const sale of data.sales) {
      if (sale.voided) continue;
      for (const [id, qty] of Object.entries(sale.items)) byItem[id] = (byItem[id] ?? 0) + qty;
    }
    return byItem;
  }, [data.sales]);

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ['ยอดหน้าร้าน', `${t.cash + t.transfer}.-`],
          ['เงินสด (ต้องมีในลิ้นชัก)', `${t.cash}.-`],
          ['โอน', `${t.transfer}.-`],
          ['ขายไป', `${t.pieces} ชิ้น · ${t.sales} บิล`],
        ].map(([label, value]) => (
          <div key={label} className={`${card} text-center !p-3`}>
            <p className="font-black text-2xl">{value}</p>
            <p className="text-xs font-semibold">{label}</p>
          </div>
        ))}
      </section>

      <section className={card}>
        <h2 className="font-black">รวมทั้งงาน</h2>
        <p className="mt-1 text-sm">
          พรีออเดอร์ที่ตรวจสลิปแล้ว <b>{t.preorderPaid}.-</b> ({t.preorderPieces} ชิ้นต้องส่ง) + หน้าร้าน <b>{t.cash + t.transfer}.-</b>
        </p>
        <p className="mt-1 font-black text-2xl">{t.preorderPaid + t.cash + t.transfer}.-</p>
      </section>

      <section className={card}>
        <h2 className="font-black">ขายหน้าร้านแต่ละเมนู</h2>
        {Object.keys(sold).length === 0 ? (
          <p className="text-sm mt-1 text-ink/60">ยังไม่มีการขาย</p>
        ) : (
          <ul className="mt-2 grid sm:grid-cols-2 gap-x-4 text-sm">
            {MENU.filter((m) => sold[m.id]).map((m) => (
              <li key={m.id} className="flex justify-between border-b border-ink/10 py-0.5">
                <span>{m.title}</span>
                <b>{sold[m.id]} ชิ้น</b>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={card}>
        <h2 className="font-black">บิลล่าสุด</h2>
        <ul className="mt-2 divide-y divide-ink/10">
          {data.sales.map((sale) => (
            <li key={sale.code} className={`py-2 flex items-center gap-3 ${sale.voided ? 'opacity-50' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="font-black">
                  {sale.code} · {sale.total}.- <span className="font-semibold text-sm">{sale.pay === 'cash' ? 'เงินสด' : 'โอน'}</span>
                  {sale.voided && <span className="ml-1.5 rounded bg-alert px-1.5 py-0.5 text-[11px] text-white">ยกเลิกแล้ว</span>}
                </p>
                <p className="text-xs text-ink/70 truncate">
                  {timeTh(sale.at)} · {Object.entries(sale.items).map(([id, qty]) => `${itemById(id)?.title ?? id} ×${qty}`).join(', ')}
                </p>
              </div>
              <button
                onClick={() => onVoid(sale.code, !sale.voided)}
                className="rounded-lg border-2 border-ink px-3 py-1.5 text-sm font-bold cursor-pointer shrink-0"
              >
                {sale.voided ? 'คืนบิล' : 'ยกเลิก'}
              </button>
            </li>
          ))}
          {data.sales.length === 0 && <li className="text-sm text-ink/60">ยังไม่มีบิล</li>}
        </ul>
      </section>
    </div>
  );
}
