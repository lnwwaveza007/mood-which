'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Check, RotateCcw, X } from 'lucide-react';
import { SectionTag } from '@/components/Decor';
import { BASE_SANDWICH_FILLINGS, FundamentalMood } from '@/data/quizData';
import { api, ApiFail, errorText } from '@/lib/draw/client';
import { Cart, FILLING_SHORT, itemById, MENU, MOODS } from '@/lib/preorder/menu';
import { Halves, StockConfig } from '@/lib/preorder/stock';
import { OrderStatus, PreorderConfig } from '@/lib/preorder/types';

interface StaffOrder {
  code: string;
  at: string;
  name: string;
  phone: string;
  ig?: string;
  note?: string;
  items: Cart;
  pieces: number;
  total: number;
  status: OrderStatus;
  delivered: boolean;
  duplicateOf: string | null;
}

interface Summary {
  config: PreorderConfig & { stock: StockConfig };
  piecesLeft: number;
  /** Halves still sellable per filling. */
  stockLeft: Halves;
  orders: StaffOrder[];
}

/** Halves → pieces for staff: 7 halves = 3.5 pieces. */
const piecesText = (halves: number) => String(halves / 2);

const draftsOf = (stock: StockConfig) =>
  Object.fromEntries(MOODS.map((m) => [m, piecesText(stock[m].halves)])) as Record<FundamentalMood, string>;

const POLL_MS = 15000;
const PIN_KEY = 'moodwhich:preorder:admin-pin';
const card = 'rounded-2xl bg-white text-ink border-[3px] border-ink p-4 shadow-[4px_4px_0_#0D0D0D]';

const STATUS_LABEL: Record<OrderStatus, string> = { pending: 'รอตรวจสลิป', paid: 'จ่ายแล้ว', rejected: 'สลิปไม่ผ่าน' };
const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: 'bg-yellow text-ink',
  paid: 'bg-[#16803c] text-white',
  rejected: 'bg-alert text-white',
};

type Filter = OrderStatus | 'all' | 'undelivered';
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'pending', label: 'รอตรวจ' },
  { id: 'paid', label: 'จ่ายแล้ว' },
  { id: 'rejected', label: 'ไม่ผ่าน' },
  { id: 'undelivered', label: 'ยังไม่ส่ง' },
];

const timeTh = (iso: string) =>
  new Date(iso).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function OrdersPanel() {
  const [pin, setPin] = useState('');
  const pinRef = useRef('');
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [slip, setSlip] = useState<{ order: StaffOrder; url: string } | null>(null);
  const [maxDraft, setMaxDraft] = useState('');
  const [stockDraft, setStockDraft] = useState<Record<FundamentalMood, string> | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetPin, setResetPin] = useState('');

  const call = useCallback(async (body: Record<string, unknown>) => {
    const res = await api<Summary>('/api/preorder/admin', { pin: pinRef.current, ...body });
    if (!res.ok) {
      setError(errorText(res as ApiFail));
      return null;
    }
    setError(null);
    setData(res);
    return res;
  }, []);

  const signIn = useCallback(
    async (candidate: string) => {
      setBusy(true);
      pinRef.current = candidate;
      const res = await call({ action: 'status' });
      setBusy(false);
      if (res) {
        setMaxDraft(String(res.config.maxPieces));
        setStockDraft(draftsOf(res.config.stock));
        try {
          sessionStorage.setItem(PIN_KEY, candidate);
        } catch {
          // storage blocked: staff log in again after a refresh
        }
      }
      return Boolean(res);
    },
    [call],
  );

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
    api<Summary>('/api/preorder/admin', { pin: saved, action: 'status' }).then((res) => {
      if (!alive || !res.ok) return;
      setData(res);
      setMaxDraft(String(res.config.maxPieces));
      setStockDraft(draftsOf(res.config.stock));
    });
    return () => {
      alive = false;
    };
  }, []);

  const authed = Boolean(data);
  useEffect(() => {
    if (!authed) return;
    const t = setInterval(() => void call({ action: 'status' }), POLL_MS);
    return () => clearInterval(t);
  }, [authed, call]);

  useEffect(() => {
    if (!slip) return;
    return () => URL.revokeObjectURL(slip.url);
  }, [slip]);

  const openSlip = async (order: StaffOrder) => {
    setError(null);
    try {
      const res = await fetch('/api/preorder/admin/slip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinRef.current, code: order.code }),
      });
      if (!res.ok || !res.headers.get('content-type')?.startsWith('image/')) {
        setError('เปิดรูปสลิปไม่สำเร็จ');
        return;
      }
      setSlip({ order, url: URL.createObjectURL(await res.blob()) });
    } catch {
      setError('เปิดรูปสลิปไม่สำเร็จ');
    }
  };

  const review = async (code: string, status: OrderStatus) => {
    await call({ action: 'review', code, status });
    setSlip(null);
  };

  const live = useMemo(() => data?.orders.filter((o) => o.status !== 'rejected') ?? [], [data]);

  const prep = useMemo(() => {
    const byItem: Record<string, number> = {};
    const halves = { happy: 0, boring: 0, angry: 0, sad: 0 } as Record<FundamentalMood, number>;
    for (const order of live) {
      for (const [id, qty] of Object.entries(order.items)) {
        byItem[id] = (byItem[id] ?? 0) + qty;
        const moods = itemById(id)?.moods ?? [];
        // A single-filling piece is two halves of that filling; a MIX is one half of each.
        moods.forEach((m) => (halves[m] += (moods.length === 1 ? 2 : 1) * qty));
      }
    }
    return { byItem, halves };
  }, [live]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data?.orders ?? []).filter((o) => {
      if (filter === 'undelivered' ? o.delivered || o.status === 'rejected' : filter !== 'all' && o.status !== filter) return false;
      if (!q) return true;
      return [o.code, o.name, o.phone, o.ig ?? ''].some((v) => v.toLowerCase().includes(q));
    });
  }, [data, filter, query]);

  if (!data) {
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
          className={`${card} max-w-sm mx-auto mt-16 mx-4 sm:mx-auto space-y-3`}
        >
          <h1 className="font-black text-xl">จัดการพรีออเดอร์</h1>
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

  const paidMoney = data.orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.total, 0);
  const pending = data.orders.filter((o) => o.status === 'pending').length;
  const pieces = live.reduce((sum, o) => sum + o.pieces, 0);

  return (
    <main className="min-h-dvh text-white relative z-[1] pb-12">
      <header className="w-full max-w-3xl mx-auto px-4 pt-4 flex items-center justify-between">
        <SectionTag />
        <div className="flex gap-4 text-xs font-semibold text-yellow">
          <Link href="/preorder">หน้าสั่งซื้อ</Link>
          <button onClick={signOut} className="cursor-pointer">ออกจากระบบ</button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 mt-4 space-y-4">
        <h1 className="tape text-2xl">พรีออเดอร์</h1>

        {error && <p role="alert" className="rounded-xl bg-alert text-white font-bold text-sm p-3">{error}</p>}

        <section className="grid grid-cols-3 gap-3">
          {[
            ['รอตรวจสลิป', String(pending)],
            ['ชิ้นที่ต้องทำ', String(pieces)],
            ['ยอดตรวจแล้ว', `${paidMoney}.-`],
          ].map(([label, value]) => (
            <div key={label} className={`${card} text-center !p-3`}>
              <p className="font-black text-2xl sm:text-3xl">{value}</p>
              <p className="text-xs font-semibold">{label}</p>
            </div>
          ))}
        </section>

        <section className={card}>
          <h2 className="font-black">ยอดเตรียมของ <span className="font-normal text-xs text-ink/60">(ไม่นับสลิปไม่ผ่าน)</span></h2>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(prep.halves) as FundamentalMood[]).map((m) => (
              <div key={m} className="rounded-xl p-2 text-center" style={{ backgroundColor: BASE_SANDWICH_FILLINGS[m].color }}>
                <p className="font-black text-xl">{prep.halves[m]}</p>
                <p className="text-[11px] font-bold">ครึ่ง · {BASE_SANDWICH_FILLINGS[m].labelTh}</p>
              </div>
            ))}
          </div>
          <ul className="mt-3 grid sm:grid-cols-2 gap-x-4 text-sm">
            {MENU.filter((m) => prep.byItem[m.id]).map((m) => (
              <li key={m.id} className="flex justify-between border-b border-ink/10 py-0.5">
                <span>{m.title}</span>
                <b>{prep.byItem[m.id]} ชิ้น</b>
              </li>
            ))}
          </ul>
        </section>

        <section className={card}>
          <h2 className="font-black">
            สต็อกแต่ละไส้ <span className="font-normal text-xs text-ink/60">(นับเป็นชิ้น · ชิ้นไส้เดียว = 2 ครึ่ง, MIX = ไส้ละ 1 ครึ่ง)</span>
          </h2>
          <ul className="mt-2 space-y-2">
            {MOODS.map((m) => {
              const entry = data.config.stock[m];
              const used = prep.halves[m];
              const left = data.stockLeft[m];
              const draft = stockDraft?.[m] ?? piecesText(entry.halves);
              const out = !entry.open || left <= 0;
              return (
                <li key={m} className="rounded-xl p-2.5 flex flex-wrap items-center gap-x-3 gap-y-2" style={{ backgroundColor: BASE_SANDWICH_FILLINGS[m].color }}>
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="font-black leading-tight">
                      {BASE_SANDWICH_FILLINGS[m].emoji} {FILLING_SHORT[m]}
                      {out && <span className="ml-1.5 rounded bg-alert px-1.5 py-0.5 text-[11px] font-black text-white align-middle">{entry.open ? 'หมด' : 'ปิดขาย'}</span>}
                    </p>
                    <p className="text-xs font-semibold">
                      สั่งแล้ว {piecesText(used)} ชิ้น · เหลือ {piecesText(left)} ชิ้น
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <label htmlFor={`stock-${m}`}>รับ</label>
                    <input
                      id={`stock-${m}`}
                      type="number"
                      min={0}
                      step={0.5}
                      value={draft}
                      onChange={(e) => setStockDraft((d) => ({ ...(d ?? draftsOf(data.config.stock)), [m]: e.target.value }))}
                      className="w-16 rounded-lg border-2 border-ink bg-white px-2 py-1.5 text-right font-bold"
                    />
                    <span>ชิ้น</span>
                    <button
                      onClick={() => void call({ action: 'settings', stock: { [m]: { pieces: Number(draft) } } })}
                      className="rounded-lg bg-ink text-yellow px-3 py-1.5 font-bold cursor-pointer"
                    >
                      บันทึก
                    </button>
                  </div>
                  <button
                    onClick={() => void call({ action: 'settings', stock: { [m]: { open: !entry.open } } })}
                    className={`rounded-full px-3 py-1.5 text-sm font-bold border-2 border-ink cursor-pointer ${entry.open ? 'bg-white text-ink' : 'bg-alert text-white'}`}
                  >
                    {entry.open ? 'ตั้งเป็นหมด' : 'เปิดขายอีกครั้ง'}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={`${card} flex flex-wrap items-center gap-3 justify-between`}>
          <button
            onClick={() => void call({ action: 'settings', open: !data.config.open })}
            className={`rounded-full px-4 py-2 font-bold text-sm cursor-pointer ${data.config.open ? 'bg-[#16803c] text-white' : 'bg-alert text-white'}`}
          >
            {data.config.open ? 'เปิดรับอยู่ (แตะเพื่อปิด)' : 'ปิดรับอยู่ (แตะเพื่อเปิด)'}
          </button>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <label htmlFor="max-pieces">รับสูงสุด</label>
            <input
              id="max-pieces"
              type="number"
              min={0}
              value={maxDraft}
              onChange={(e) => setMaxDraft(e.target.value)}
              className="w-20 rounded-lg border-2 border-ink px-2 py-1.5 text-right font-bold"
            />
            <span>ชิ้น (เหลือ {data.piecesLeft})</span>
            <button
              onClick={() => void call({ action: 'settings', maxPieces: Number(maxDraft) })}
              className="rounded-lg bg-ink text-yellow px-3 py-1.5 font-bold cursor-pointer"
            >
              บันทึก
            </button>
          </div>
        </section>

        <section className="flex flex-wrap gap-2 items-center">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-full px-3 py-1.5 text-sm font-bold border-2 border-ink cursor-pointer ${filter === f.id ? 'bg-yellow text-ink' : 'bg-white text-ink'}`}
            >
              {f.label}
            </button>
          ))}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาเลขออเดอร์ ชื่อ เบอร์"
            aria-label="ค้นหาออเดอร์"
            className="flex-1 min-w-40 rounded-full border-2 border-ink px-3 py-1.5 text-sm text-ink bg-white"
          />
        </section>

        {shown.length === 0 && <p className="text-center text-sm py-6">ยังไม่มีออเดอร์ในหมวดนี้</p>}

        <ul className="space-y-3">
          {shown.map((o) => (
            <li key={o.code} className={card}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-black text-xl">{o.code}</p>
                <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
              </div>
              <p className="mt-1 font-bold">
                {o.name} · <a href={`tel:${o.phone}`} className="underline">{o.phone}</a>
                {o.ig && <span className="font-normal"> · @{o.ig}</span>}
              </p>
              <p className="text-xs text-ink/60">{timeTh(o.at)}</p>
              <ul className="mt-2 text-sm">
                {Object.entries(o.items).map(([id, qty]) => (
                  <li key={id}>{itemById(id)?.title ?? id} ×{qty}</li>
                ))}
              </ul>
              <p className="mt-1 font-black">{o.pieces} ชิ้น · {o.total}.-</p>
              {o.note && <p className="mt-1 text-sm bg-yellow/40 rounded px-2 py-1">{o.note}</p>}
              {o.duplicateOf && (
                <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-alert">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> รูปสลิปเหมือนกับ {o.duplicateOf}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => void openSlip(o)} className="rounded-lg bg-ink text-yellow px-3 py-2 text-sm font-bold cursor-pointer">ดูสลิป</button>
                <button
                  onClick={() => void call({ action: 'delivered', code: o.code, delivered: !o.delivered })}
                  disabled={o.status !== 'paid'}
                  className={`rounded-lg border-2 border-ink px-3 py-2 text-sm font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${o.delivered ? 'bg-[#eaf8e3]' : 'bg-white'}`}
                >
                  {o.delivered ? '✓ ส่งแล้ว' : 'ทำเครื่องหมายว่าส่งแล้ว'}
                </button>
              </div>
            </li>
          ))}
        </ul>

        <section className={card}>
          <h2 className="font-black">ลบข้อมูลหลังจบงาน</h2>
          <p className="text-sm mt-1">ลบออเดอร์และรูปสลิปทั้งหมดถาวร กู้คืนไม่ได้</p>
          {resetOpen ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                const res = await call({ action: 'reset', confirmPin: resetPin });
                setBusy(false);
                setResetPin('');
                if (res) setResetOpen(false);
              }}
              className="mt-2 flex flex-wrap gap-2"
            >
              <input
                type="password"
                inputMode="numeric"
                value={resetPin}
                onChange={(e) => setResetPin(e.target.value)}
                placeholder="ใส่ PIN อีกครั้ง"
                aria-label="ยืนยัน PIN"
                className="rounded-lg border-2 border-ink px-3 py-2 font-bold"
              />
              <button disabled={busy || !resetPin} className="rounded-lg bg-alert text-white px-3 py-2 font-bold cursor-pointer disabled:opacity-60">ลบทั้งหมดถาวร</button>
              <button type="button" onClick={() => setResetOpen(false)} className="rounded-lg border-2 border-ink px-3 py-2 font-bold cursor-pointer">ยกเลิก</button>
            </form>
          ) : (
            <button onClick={() => setResetOpen(true)} className="mt-2 inline-flex items-center gap-1.5 rounded-lg border-2 border-alert text-alert px-3 py-2 text-sm font-bold cursor-pointer">
              <RotateCcw className="w-4 h-4" /> ลบข้อมูลทั้งหมด
            </button>
          )}
        </section>
      </div>

      {slip && (
        <div role="dialog" aria-modal="true" aria-label={`สลิป ${slip.order.code}`} className="fixed inset-0 z-30 bg-ink/90 flex flex-col">
          <div className="flex items-center justify-between gap-3 p-3 text-white">
            <p className="font-black">
              {slip.order.code} · ต้องโอน <span className="text-yellow text-xl">{slip.order.total}.-</span>
            </p>
            <button onClick={() => setSlip(null)} aria-label="ปิด" className="cursor-pointer p-1"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center px-3">
            {/* Private image held as a blob: URL, so next/image cannot load it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slip.url} alt={`สลิปของออเดอร์ ${slip.order.code}`} className="max-h-full max-w-full object-contain rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-2 p-3 max-w-md w-full mx-auto">
            <button onClick={() => void review(slip.order.code, 'rejected')} className="rounded-xl bg-alert text-white py-3 font-black flex items-center justify-center gap-1.5 cursor-pointer">
              <X className="w-5 h-5" /> ไม่ผ่าน
            </button>
            <button onClick={() => void review(slip.order.code, 'paid')} className="rounded-xl bg-[#16803c] text-white py-3 font-black flex items-center justify-center gap-1.5 cursor-pointer">
              <Check className="w-5 h-5" /> จ่ายแล้ว
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
