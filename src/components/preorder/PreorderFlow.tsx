'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, Check, Copy, Download, ImagePlus, Loader2, MapPin, Minus, Plus } from 'lucide-react';
import ChibiSticker from '@/components/ChibiSticker';
import SoundToggle from '@/components/SoundToggle';
import { sfx } from '@/lib/sound';
import { InstagramIcon, SectionTag, Sparkle } from '@/components/Decor';
import { BASE_SANDWICH_FILLINGS, FundamentalMood } from '@/data/quizData';
import { sandwichBackground } from '@/data/sandwich';
import { api } from '@/lib/draw/client';
import {
  Cart,
  countPieces,
  DEADLINE_LABEL,
  EVENT_DATE,
  EVENT_PLACE,
  EVENT_TIME,
  FILLING_SHORT,
  itemById,
  MAX_PIECES_PER_ORDER,
  MENU,
  MOODS,
  PAYMENT_IS_TEST,
  pieceId,
  PREMIUM_MOODS,
  PREMIUM_PRICE,
  priceFor,
  PROMPTPAY_ID,
  PROMPTPAY_NAME,
  UNIT_PRICE,
  unitPrice,
} from '@/lib/preorder/menu';
import { promptpayPayload } from '@/lib/preorder/promptpay';
import { ClosedReason } from '@/lib/preorder/types';
import SlipGuide from './SlipGuide';

const SLIP_MAX_SIDE = 1600;
const SLIP_MIN_SIDE = 300;

const card = 'rounded-2xl bg-white text-ink border-[3px] border-ink p-4 sm:p-5 shadow-[4px_4px_0_#0D0D0D]';
const input = 'w-full rounded-lg border-2 border-ink px-3 py-2.5 text-base font-medium bg-white';

const CLOSED_TEXT: Record<ClosedReason, string> = {
  closed: 'ตอนนี้ปิดรับพรีออเดอร์แล้ว',
  deadline: 'หมดเวลาพรีออเดอร์แล้ว แวะมาซื้อหน้าร้านในวันงานได้เลย!',
  sold_out: 'พรีออเดอร์เต็มแล้ว แวะมาซื้อหน้าร้านในวันงานได้เลย!',
  no_payment: 'ร้านกำลังเตรียมระบบรับชำระเงิน กลับมาอีกครั้งเร็ว ๆ นี้',
};

const ERROR_TEXT: Record<string, string> = {
  bad_name: 'กรอกชื่อผู้สั่งด้วยนะ',
  bad_phone: 'เบอร์โทรไม่ถูกต้อง (เช่น 0812345678)',
  bad_handle: 'ชื่อ IG ไม่ถูกต้อง (ใช้ a-z 0-9 . _ เท่านั้น)',
  bad_slip: 'อ่านรูปสลิปไม่ได้ ลองแคปหน้าจอสลิปแล้วแนบใหม่',
  too_large: 'รูปสลิปใหญ่เกินไป ลองแคปหน้าจอสลิปแล้วแนบใหม่',
  closed: 'ตอนนี้ปิดรับพรีออเดอร์แล้ว',
  not_configured: 'ระบบยังไม่พร้อมใช้งาน ทักร้านทาง IG ได้เลย',
  network: 'สัญญาณอินเทอร์เน็ตมีปัญหา กดยืนยันอีกครั้งได้เลย ออเดอร์จะไม่ซ้ำ',
};

/** Shrinks the photo so it fits the upload limit and turns any format the browser can read into JPEG. */
async function shrinkSlip(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const longest = Math.max(bitmap.width, bitmap.height);
  if (Math.min(bitmap.width, bitmap.height) < SLIP_MIN_SIDE) throw new Error('too small');
  const scale = Math.min(1, SLIP_MAX_SIDE / longest);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no canvas');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('no blob'))), 'image/jpeg', 0.85);
  });
}

function Stepper({ label, qty, canAdd, onChange }: { label: string; qty: number; canAdd: boolean; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => {
          sfx.back();
          onChange(qty - 1);
        }}
        disabled={qty === 0}
        aria-label={`ลด ${label}`}
        className="w-9 h-9 rounded-full bg-white border-2 border-ink flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Minus className="w-4 h-4" strokeWidth={3} />
      </button>
      <span className="w-7 text-center font-black text-lg tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => {
          sfx.tap();
          onChange(qty + 1);
        }}
        disabled={!canAdd}
        aria-label={`เพิ่ม ${label}`}
        className="w-9 h-9 rounded-full bg-ink text-yellow border-2 border-ink flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" strokeWidth={3} />
      </button>
    </div>
  );
}

function Step({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="flex items-center gap-2 mb-3">
      <span className="w-8 h-8 rounded-full bg-yellow text-ink font-black flex items-center justify-center shrink-0">{n}</span>
      <span className="tape text-base sm:text-lg">{title}</span>
    </h2>
  );
}

/** One row of four fillings for a single half of the sandwich. */
function HalfPicker({ title, hint, value, onPick }: { title: string; hint?: string; value: FundamentalMood; onPick: (m: FundamentalMood) => void }) {
  return (
    <div>
      <p className="text-sm font-black">{title}</p>
      {hint && <p className="text-xs text-ink/65">{hint}</p>}
      <div role="radiogroup" aria-label={title} className="mt-1.5 grid grid-cols-4 gap-2">
        {MOODS.map((m) => {
          const on = value === m;
          return (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onPick(m)}
              className={`relative rounded-xl px-1 py-2 min-h-[5.25rem] flex flex-col items-center justify-center text-center cursor-pointer border-[3px] transition-transform ${
                on ? 'border-ink scale-[1.04] shadow-[3px_3px_0_#0D0D0D]' : 'border-ink/15'
              }`}
              style={{ backgroundColor: BASE_SANDWICH_FILLINGS[m].color }}
            >
              {PREMIUM_MOODS.includes(m) && (
                <span className="absolute -top-2 -left-1.5 rounded border-2 border-ink bg-alert px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
                  {PREMIUM_PRICE}.-
                </span>
              )}
              {on && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-ink text-yellow flex items-center justify-center">
                  <Check className="w-3 h-3" strokeWidth={4} />
                </span>
              )}
              <span className="text-2xl leading-none" aria-hidden="true">{BASE_SANDWICH_FILLINGS[m].emoji}</span>
              <span className="mt-1 text-xs font-bold leading-tight">
                {FILLING_SHORT[m].split(' + ').map((part, i, all) => (
                  <span key={part} className="block">
                    {part}
                    {i < all.length - 1 && ' +'}
                  </span>
                ))}
              </span>
              <span className="text-[10px] leading-tight text-ink/70">{BASE_SANDWICH_FILLINGS[m].labelTh}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PreorderFlow({ preset }: { preset?: string }) {
  const presetItem = preset ? itemById(preset) : undefined;

  const [status, setStatus] = useState<{ open: boolean; reason: ClosedReason | null; piecesLeft: number } | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [cart, setCart] = useState<Cart>(() => (presetItem ? { [presetItem.id]: 1 } : {}));
  // The two halves of the sandwich being built. Half 2 follows half 1 until the customer picks a different filling.
  const [half1, setHalf1] = useState<FundamentalMood>(presetItem?.moods[0] ?? 'happy');
  const [half2, setHalf2] = useState<FundamentalMood>(presetItem?.moods[1] ?? presetItem?.moods[0] ?? 'happy');
  const [linked, setLinked] = useState(!presetItem?.isMix);
  const [justAdded, setJustAdded] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ig, setIg] = useState('');
  const [note, setNote] = useState('');
  const [slip, setSlip] = useState<Blob | null>(null);
  const [slipUrl, setSlipUrl] = useState<string | null>(null);
  const [slipBusy, setSlipBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState<{ code: string; pieces: number; total: number } | null>(null);
  const requestId = useRef<string | null>(null);
  const qrBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api<{ open: boolean; reason: ClosedReason | null; piecesLeft: number }>('/api/preorder').then((res) => {
      if (res.ok) setStatus(res);
      else setLoadFailed(true);
    });
  }, []);

  useEffect(() => {
    if (!slipUrl) return;
    return () => URL.revokeObjectURL(slipUrl);
  }, [slipUrl]);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1200);
    return () => clearTimeout(t);
  }, [justAdded]);

  const pieces = countPieces(cart);
  const total = priceFor(cart);
  const limit = Math.min(MAX_PIECES_PER_ORDER, status?.piecesLeft ?? MAX_PIECES_PER_ORDER);
  const qr = useMemo(() => (total > 0 ? promptpayPayload(PROMPTPAY_ID, total) : null), [total]);

  const setQty = (id: string, qty: number) =>
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, qty) };
      if (next[id] === 0) delete next[id];
      return next;
    });

  const pick1 = (m: FundamentalMood) => {
    sfx.select(MOODS.indexOf(m));
    setHalf1(m);
    if (linked) setHalf2(m);
  };
  const pick2 = (m: FundamentalMood) => {
    sfx.select(MOODS.indexOf(m));
    setHalf2(m);
    setLinked(m === half1);
  };

  const isMix = half1 !== half2;
  const building = {
    moods: isMix ? [half1, half2] : [half1],
    id: pieceId(half1, half2),
    label: isMix ? `${FILLING_SHORT[half1]} กับ ${FILLING_SHORT[half2]}` : `${FILLING_SHORT[half1]} ทั้งชิ้น`,
  };

  const addPiece = () => {
    sfx.add();
    setQty(building.id, (cart[building.id] ?? 0) + 1);
    setJustAdded(true);
  };

  const cartLines = MENU.filter((m) => (cart[m.id] ?? 0) > 0);

  /** Shows an error message with a soft buzz. */
  const fail = (message: string) => {
    sfx.error();
    setError(message);
  };

  const pickSlip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // lets the customer pick the same file again
    if (!file) return;
    setSlipBusy(true);
    setError(null);
    try {
      const small = await shrinkSlip(file);
      setSlip(small);
      setSlipUrl(URL.createObjectURL(small));
      sfx.shutter();
    } catch {
      setSlip(null);
      setSlipUrl(null);
      fail('เปิดรูปนี้ไม่ได้ ลองแคปหน้าจอสลิปแล้วเลือกรูปใหม่');
    }
    setSlipBusy(false);
  };

  const saveQr = () => {
    const canvas = qrBox.current?.querySelector('canvas');
    if (!canvas) return;
    sfx.tap();
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `moodwhich-promptpay-${total}.png`;
    a.click();
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(PROMPTPAY_ID);
      sfx.ding();
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked: the number is on screen to type by hand
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!name.trim()) return fail(ERROR_TEXT.bad_name);
    if (!/^0\d{8,9}$/.test(phone.replace(/\D/g, ''))) return fail(ERROR_TEXT.bad_phone);
    if (!slip) return fail('แนบรูปสลิปก่อนยืนยันนะ');

    setSending(true);
    setError(null);
    requestId.current ??= crypto.randomUUID();
    const form = new FormData();
    form.set('requestId', requestId.current);
    form.set('name', name);
    form.set('phone', phone);
    form.set('ig', ig);
    form.set('note', note);
    form.set('items', JSON.stringify(cart));
    form.set('slip', slip, 'slip.jpg');

    let res: { ok: boolean; error?: string; code?: string; pieces?: number; total?: number; piecesLeft?: number };
    try {
      const reply = await fetch('/api/preorder', { method: 'POST', body: form });
      res = await reply.json();
    } catch {
      res = { ok: false, error: 'network' };
    }
    setSending(false);

    if (res.ok && res.code) {
      sfx.order();
      setDone({ code: res.code, pieces: res.pieces ?? pieces, total: res.total ?? total });
      window.scrollTo(0, 0);
      return;
    }
    if (res.error === 'sold_out') {
      const left = res.piecesLeft ?? 0;
      setStatus((s) => (s ? { ...s, piecesLeft: left } : s));
      fail(left > 0 ? `เหลือให้สั่งได้อีก ${left} ชิ้น ลองลดจำนวนลง แล้วทักร้านเรื่องยอดที่โอนเกิน` : CLOSED_TEXT.sold_out);
      return;
    }
    fail(ERROR_TEXT[res.error ?? ''] ?? 'มีบางอย่างผิดพลาด ลองกดยืนยันอีกครั้ง');
  };

  const header = (
    <header className="w-full max-w-2xl mx-auto px-4 pt-4 flex items-center justify-between">
      <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-yellow">
        <ArrowLeft className="w-4 h-4" /> หน้าแรก
      </Link>
      <div className="flex items-center gap-3">
        <SectionTag />
        <SoundToggle />
      </div>
    </header>
  );

  const shopInfo = (
    <div className="mt-3 text-sm space-y-0.5">
      <p className="font-black text-lg text-yellow">ส่งทุกออเดอร์วันงาน {EVENT_DATE}</p>
      <p className="font-semibold">{EVENT_TIME}</p>
      <p className="flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-yellow shrink-0" /> {EVENT_PLACE}
      </p>
    </div>
  );

  if (done) {
    return (
      <main className="min-h-dvh text-white relative z-[1]">
        {header}
        <section className="max-w-md mx-auto px-4 py-10 text-center">
          <Sparkle className="w-10 mx-auto animate-twinkle" />
          <p className="tape text-2xl mt-4">รับออเดอร์แล้ว!</p>
          <div className={`${card} mt-6`}>
            <p className="text-sm font-semibold">เลขออเดอร์</p>
            <p className="font-black text-5xl tracking-tight mt-1">{done.code}</p>
            <p className="mt-3 font-semibold">
              {done.pieces} ชิ้น · {done.total}.-
            </p>
          </div>
          {shopInfo}
          <p className="mt-5 text-sm">
            <span className="ink-bar">แคปหน้าจอนี้ไว้ แล้วแจ้งเลขออเดอร์ตอนรับแซนวิช</span>
          </p>
          <p className="mt-3 text-sm text-white/85">ร้านจะตรวจสลิป ถ้ามีปัญหาจะติดต่อกลับทางเบอร์ที่ให้ไว้</p>
          <p className="mt-4 text-sm">
            <span className="ink-bar">วันงานรับแซนวิชแล้ว อย่าลืมแท็กร้านลง IG Story ลุ้นรับแซนวิชฟรีครึ่งชิ้น!</span>
          </p>
          <a
            href="https://www.instagram.com/moodwhich.kmuttnative/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-ink px-5 py-3 text-yellow font-semibold"
          >
            <InstagramIcon className="w-5 h-5 text-white" /> @moodwhich.kmuttnative
          </a>
        </section>
      </main>
    );
  }

  const closed = status && !status.open;

  return (
    <main className={`min-h-dvh text-white relative z-[1] ${pieces > 0 ? 'pb-24' : ''}`}>
      {header}
      <div className="max-w-2xl mx-auto px-4">
        <section className="pt-6 pb-6">
          <h1 className="display-title text-6xl sm:text-8xl">
            PRE<span className="block">ORDER</span>
          </h1>
          {shopInfo}
          <p className="mt-3 text-sm">
            <span className="ink-bar">ปิดรับ {DEADLINE_LABEL}</span>
          </p>
        </section>

        {loadFailed && <p className={`${card} font-semibold`}>โหลดข้อมูลไม่สำเร็จ ลองรีเฟรชหน้านี้อีกครั้ง</p>}
        {closed && status.reason && <p className={`${card} font-bold text-lg text-center`}>{CLOSED_TEXT[status.reason]}</p>}

        {status?.open && (
          <form onSubmit={submit} className="space-y-8 pb-10">
            {PAYMENT_IS_TEST && (
              <p className="rounded-xl bg-alert text-white font-bold text-sm p-3">โหมดทดสอบบน localhost: ห้ามโอนเงินจริงเข้า QR นี้</p>
            )}

            <section>
              <Step n={1} title="เลือกแซนวิช" />
              <p className="text-sm">
                <span className="ink-bar">แซนวิช 1 ชิ้น = 2 ครึ่ง เลือกไส้ให้แต่ละครึ่ง · ชิ้นละ {UNIT_PRICE}.-</span>
              </p>
              <p className="mt-2 text-sm">
                <span className="ink-bar">ชิ้นที่มีไส้ไก่ป๊อป (ไส้เดียวหรือ MIX) ชิ้นละ {PREMIUM_PRICE}.-</span>
              </p>
              <p className="mt-2 mb-4 text-sm">
                <span className="ink-bar">รับแซนวิชวันงานแล้ว แท็กร้านลง IG Story ลุ้นรับแซนวิชฟรีครึ่งชิ้น!</span>
              </p>

              <div className={`${card} space-y-4`}>
                <HalfPicker title="ครึ่งที่ 1" value={half1} onPick={pick1} />
                <HalfPicker
                  title="ครึ่งที่ 2"
                  hint="ไส้เดียวกับครึ่งที่ 1 = ไส้เดียวทั้งชิ้น · เลือกไส้อื่น = MIX 2 ไส้"
                  value={half2}
                  onPick={pick2}
                />

                <div className="rounded-xl overflow-hidden border-2 border-ink">
                  <div className="relative h-28 flex items-end justify-center" style={{ background: sandwichBackground(building.moods) }}>
                    <ChibiSticker moods={building.moods} heightClass="h-24" className="pointer-events-none" />
                  </div>
                  <div className="bg-ink text-white px-3 py-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-bold min-w-0">
                      <span className={`inline-block rounded px-1.5 py-0.5 mr-1.5 text-xs font-black text-ink ${isMix ? 'bg-yellow' : 'bg-white'}`}>
                        {isMix ? 'MIX 2 ไส้' : 'ไส้เดียว'}
                      </span>
                      {building.label}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addPiece}
                  disabled={pieces >= limit}
                  className="btn-sticker w-full rounded-full py-3 font-black text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-5 h-5" strokeWidth={3} /> เพิ่มแล้ว
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" strokeWidth={3} /> เพิ่มลงตะกร้า 1 ชิ้น · {unitPrice(building.moods)}.-
                    </>
                  )}
                </button>
                {pieces >= limit && <p className="text-xs font-bold text-alert text-center">สั่งได้สูงสุด {limit} ชิ้นต่อออเดอร์</p>}
              </div>

              <div className="mt-4">
                <p className="text-sm font-black mb-2">ตะกร้าของคุณ</p>
                {cartLines.length === 0 ? (
                  <p className="text-sm text-white/85">ยังไม่มีแซนวิชในตะกร้า เลือกไส้ด้านบนแล้วกด “เพิ่มลงตะกร้า”</p>
                ) : (
                  <div className={`${card} !p-3`}>
                    <ul className="divide-y divide-ink/15">
                      {cartLines.map((m) => (
                        <li key={m.id} className="py-2 flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full border-2 border-ink shrink-0" style={{ background: sandwichBackground(m.moods) }} aria-hidden="true" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold leading-snug">{m.title}</p>
                            <p className="flex items-center gap-1.5 text-xs">
                              <span className="font-bold text-ink/70">{unitPrice(m.moods)}.-/ชิ้น</span>
                              {m.isMix && <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-black bg-yellow text-ink">MIX 2 ไส้</span>}
                            </p>
                          </div>
                          <Stepper label={m.title} qty={cart[m.id] ?? 0} canAdd={pieces < limit} onChange={(n) => setQty(m.id, n)} />
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 pt-2 border-t-2 border-ink flex items-end justify-between text-sm">
                      <span>{pieces} ชิ้น</span>
                      <span className="font-black text-2xl">{total}.-</span>
                    </p>
                  </div>
                )}
              </div>
            </section>

            {pieces > 0 && (
              <>
                <section>
                  <Step n={2} title="ข้อมูลผู้สั่ง" />
                  <div className={`${card} space-y-3`}>
                    <label className="block text-sm font-bold">
                      ชื่อ
                      <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="name" className={`${input} mt-1`} />
                    </label>
                    <label className="block text-sm font-bold">
                      เบอร์โทร
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="0812345678" className={`${input} mt-1`} />
                    </label>
                    <label className="block text-sm font-bold">
                      IG <span className="font-normal text-ink/60">(ไม่บังคับ)</span>
                      <input value={ig} onChange={(e) => setIg(e.target.value)} maxLength={31} autoCapitalize="none" placeholder="@yourname" className={`${input} mt-1`} />
                    </label>
                    <label className="block text-sm font-bold">
                      หมายเหตุ <span className="font-normal text-ink/60">(ไม่บังคับ)</span>
                      <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} rows={2} className={`${input} mt-1`} />
                    </label>
                  </div>
                </section>

                <section>
                  <Step n={3} title="โอนเงินแล้วแนบสลิป" />
                  <div className={`${card} space-y-4`}>
                    <div className="text-center">
                      <p className="text-sm font-semibold">ยอดที่ต้องจ่าย</p>
                      <p className="font-black text-5xl tracking-tight">{total}.-</p>
                      <div ref={qrBox} className="mt-3 inline-block bg-white p-2 border-2 border-ink rounded-xl">
                        {qr && <QRCodeCanvas value={qr} size={208} level="M" marginSize={1} />}
                      </div>
                      <p className="mt-2 text-sm font-semibold">พร้อมเพย์ {PROMPTPAY_ID}</p>
                      {PROMPTPAY_NAME && <p className="text-sm">ชื่อบัญชี {PROMPTPAY_NAME}</p>}
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button type="button" onClick={saveQr} className="rounded-xl border-2 border-ink py-2 text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                          <Download className="w-4 h-4" /> บันทึก QR
                        </button>
                        <button type="button" onClick={copyId} className="rounded-xl border-2 border-ink py-2 text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'คัดลอกแล้ว' : 'คัดลอกเลข'}
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-ink/70">สั่งจากมือถือ: บันทึก QR แล้วเปิดในแอปธนาคาร ยอดจะขึ้นให้เอง</p>
                    </div>

                    <SlipGuide amount={total} />

                    <label className={`block rounded-xl border-[3px] border-dashed border-ink p-4 text-center cursor-pointer ${slip ? 'bg-[#eaf8e3]' : 'bg-yellow/40'}`}>
                      <input type="file" accept="image/*" onChange={pickSlip} className="sr-only" aria-label="แนบรูปสลิป" />
                      {slipBusy ? (
                        <Loader2 className="w-8 h-8 mx-auto animate-spin" />
                      ) : slipUrl ? (
                        // Local preview from a blob: URL, so next/image has nothing to optimise.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={slipUrl} alt="ตัวอย่างสลิปที่แนบ" className="mx-auto max-h-72 rounded-lg border-2 border-ink" />
                      ) : (
                        <ImagePlus className="w-8 h-8 mx-auto" />
                      )}
                      <p className="mt-2 font-bold text-sm">{slip ? 'แตะเพื่อเปลี่ยนรูป' : 'แตะเพื่อแนบรูปสลิป'}</p>
                    </label>
                  </div>
                </section>

                <p className="text-xs text-white/85">
                  เมื่อกดยืนยัน ถือว่ายินยอมให้ร้านเก็บชื่อ เบอร์โทร และรูปสลิป เพื่อตรวจการชำระเงินและส่งออเดอร์นี้เท่านั้น ร้านจะลบข้อมูลหลังจบงาน
                </p>

                {error && (
                  <p role="alert" className="rounded-xl bg-alert text-white font-bold text-sm p-3">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={sending || slipBusy} className="btn-sticker w-full rounded-full py-4 font-black text-lg cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                  {sending && <Loader2 className="w-5 h-5 animate-spin" />}
                  {sending ? 'กำลังส่ง...' : 'ยืนยันพรีออเดอร์'}
                </button>
              </>
            )}
          </form>
        )}
      </div>

      {pieces > 0 && status?.open && (
        <div className="fixed bottom-0 inset-x-0 z-20 bg-ink text-white border-t-[3px] border-yellow">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">ตะกร้า {pieces} ชิ้น</p>
            <p className="font-black text-yellow text-lg">{total}.-</p>
          </div>
        </div>
      )}
    </main>
  );
}
