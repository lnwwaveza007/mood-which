'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { MOOD_PROFILES, MoodType } from '@/data/quizData';
import { sandwichBackground, sandwichMoods } from '@/data/sandwich';
import ChibiSticker from '@/components/ChibiSticker';
import StoryCard from '@/components/StoryCard';
import SoundToggle from '@/components/SoundToggle';
import { InstagramIcon, SectionTag, Sparkle } from '@/components/Decor';
import { sfx } from '@/lib/sound';
import { api, errorText, ApiFail } from '@/lib/draw/client';
import Wheel, { pickSlot, rotationFor } from './Wheel';

type Step = 'join' | 'check' | 'spin' | 'win' | 'thanks' | 'used';

interface Status {
  enabled: boolean;
  prizesLeft: number;
  prizePool: number;
}
interface SpinOk {
  alreadyUsed: boolean;
  result: 'win' | 'lose';
  prizeCode?: string;
  prizesLeft: number;
}

const SPIN_SEC = 3.2;
const SAVED_KEY = 'moodwhich:draw:result';

interface Saved {
  handle: string;
  result: 'win' | 'lose';
  prizeCode?: string;
}

function readSaved(): Saved | null {
  try {
    const raw = sessionStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

const normalize = (h: string) => h.trim().replace(/^@+/, '').toLowerCase();

export default function DrawFlow({ mood: moodId }: { mood: MoodType }) {
  const mood = MOOD_PROFILES[moodId];
  const storyRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>('join');
  const [status, setStatus] = useState<Status | null>(null);
  const [handle, setHandle] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spun, setSpun] = useState(false);
  const [result, setResult] = useState<{ result: 'win' | 'lose'; prizeCode?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    api<Status>('/api/draw/status').then((res) => {
      if (alive && res.ok) setStatus(res);
    });
    return () => {
      alive = false;
    };
  }, []);

  const fail = (e: ApiFail) => setError(errorText(e));

  /* 1 → 2 */
  const toCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[a-z0-9._]{1,30}$/.test(normalize(handle))) return setError(errorText({ ok: false, error: 'bad_handle' }));
    setError(null);
    sfx.tap();
    setStep('check');
  };

  /* 2: staff PIN, does not spend the entry */
  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const res = await api<{ alreadyUsed: boolean; prizesLeft: number }>('/api/draw/verify', {
      igHandle: handle,
      staffPin: pin,
    });
    setBusy(false);
    if (!res.ok) {
      setPin('');
      return fail(res);
    }
    if (res.alreadyUsed) {
      // Same phone coming back after a refresh: show what they already got.
      const saved = readSaved();
      if (saved && saved.handle === normalize(handle)) {
        setResult({ result: saved.result, prizeCode: saved.prizeCode });
        return setStep(saved.result === 'win' ? 'win' : 'thanks');
      }
      return setStep('used');
    }
    sfx.start();
    setStep('spin');
  };

  /* 3: one tap. Server decides, wheel plays it back. */
  const doSpin = async () => {
    if (spun || busy) return;
    setSpun(true);
    setBusy(true);
    setError(null);
    sfx.tap();
    const res = await api<SpinOk>('/api/draw/spin', { igHandle: handle, staffPin: pin });
    if (!res.ok) {
      setBusy(false);
      setSpun(false);
      return fail(res);
    }
    const win = res.result === 'win';
    try {
      sessionStorage.setItem(
        SAVED_KEY,
        JSON.stringify({ handle: normalize(handle), result: res.result, prizeCode: res.prizeCode } satisfies Saved),
      );
    } catch {
      // storage blocked: only the "come back after refresh" convenience is lost
    }
    setResult({ result: res.result, prizeCode: res.prizeCode });
    setRotation((r) => rotationFor(pickSlot(win), r));
    sfx.drumroll(SPIN_SEC - 0.2);
    window.setTimeout(() => {
      setBusy(false);
      if (win) {
        sfx.reveal();
        try {
          confetti({ particleCount: 140, spread: 90, origin: { y: 0.55 }, colors: ['#FFE83B', '#7ED957', '#FF8BAE', '#8EB2D9', '#FFFFFF'] });
        } catch {
          // canvas unavailable
        }
        setStep('win');
      } else {
        sfx.ding();
        setStep('thanks');
      }
    }, SPIN_SEC * 1000 + 300);
  };

  const saveCard = async () => {
    if (!storyRef.current || saving) return;
    setSaving(true);
    sfx.shutter();
    try {
      const url = await toPng(storyRef.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement('a');
      a.download = `moodwhich-${mood.id}.png`;
      a.href = url;
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const bg = sandwichBackground(sandwichMoods(mood));
  const soldOut = status !== null && status.prizesLeft <= 0;

  return (
    <main className="min-h-dvh text-white flex flex-col relative z-[1] overflow-x-hidden">
      <header className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between">
        <Link href="/" aria-label="กลับหน้าแรก">
          <SectionTag />
        </Link>
        <SoundToggle />
      </header>

      <div className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-6 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col items-center text-center"
          >
            {step === 'join' && (
              <>
                <h1 className="display-title text-6xl sm:text-7xl">LUCKY DRAW</h1>
                <p className="tape text-lg sm:text-xl mt-5">แท็ก IG ลุ้นครึ่งชิ้นฟรี</p>

                <ol className="mt-6 text-sm sm:text-base space-y-1.5">
                  <li><span className="ink-bar">1. ซื้อแซนวิช แล้วโพสต์ IG Story</span></li>
                  <li><span className="ink-bar">2. แท็ก @moodwhich.kmuttnative</span></li>
                  <li><span className="ink-bar">3. ให้พนักงานเช็ก แล้วหมุนวงล้อ!</span></li>
                </ol>

                <div className="mt-6 rounded-2xl bg-ink px-5 py-3">
                  {status === null ? (
                    <span className="text-white/70 text-sm">กำลังโหลด...</span>
                  ) : !status.enabled ? (
                    <span className="font-bold text-yellow">กิจกรรมปิดอยู่ตอนนี้</span>
                  ) : soldOut ? (
                    <span className="font-bold text-yellow">รางวัลหมดแล้ว</span>
                  ) : (
                    <span className="font-black text-yellow text-xl">
                      เหลือ {status.prizesLeft}/{status.prizePool} รางวัล
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-white/80">รางวัลครึ่งชิ้นฟรี จำกัด {status?.prizePool ?? 10} รางวัล หมดแล้วหมดเลย</p>

                {status?.enabled !== false && (
                  <form onSubmit={toCheck} className="mt-7 w-full max-w-sm">
                    <label className="block text-left text-sm font-semibold mb-2" htmlFor="ig">
                      ชื่อ IG ของคุณ
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-white text-ink px-3 shadow-[5px_5px_0_#0D0D0D]">
                      <InstagramIcon className="w-6 h-6 shrink-0" />
                      <span className="font-bold">@</span>
                      <input
                        id="ig"
                        value={handle.replace(/^@+/, '')}
                        onChange={(e) => setHandle(e.target.value)}
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        inputMode="text"
                        placeholder="your.handle"
                        className="flex-1 min-w-0 py-3.5 bg-transparent outline-none font-semibold placeholder:text-ink/35"
                      />
                    </div>
                    {error && <p className="mt-3 text-sm font-semibold text-yellow">{error}</p>}
                    <button
                      type="submit"
                      disabled={!handle.trim()}
                      className="btn-sticker mt-6 w-full py-4 rounded-full font-black text-lg inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      ต่อไป <ArrowRight className="w-5 h-5" strokeWidth={3} />
                    </button>
                  </form>
                )}
              </>
            )}

            {step === 'check' && (
              <>
                <p className="tape text-lg">พนักงานเช็ก</p>
                <h2 className="mt-5 text-2xl font-black">ให้พนักงานดู IG Story ของคุณ</h2>
                <p className="mt-2 text-sm">
                  <span className="ink-bar">@{normalize(handle)}</span>
                </p>
                <p className="mt-4 text-sm text-white/85 max-w-xs">พนักงานใส่ PIN 4 หลักเมื่อเห็นว่าแท็ก @moodwhich.kmuttnative แล้ว</p>

                <form onSubmit={verify} className="mt-6 w-full max-w-xs">
                  <input
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="• • • •"
                    aria-label="PIN พนักงาน"
                    className="w-full text-center text-3xl tracking-[0.6em] py-3.5 rounded-2xl border-[3px] border-ink bg-white text-ink outline-none shadow-[5px_5px_0_#0D0D0D]"
                  />
                  {error && <p className="mt-3 text-sm font-semibold text-yellow">{error}</p>}
                  <button
                    type="submit"
                    disabled={pin.length !== 4 || busy}
                    className="btn-sticker mt-6 w-full py-4 rounded-full font-black text-lg cursor-pointer disabled:opacity-50"
                  >
                    {busy ? 'กำลังเช็ก...' : 'ยืนยัน'}
                  </button>
                </form>
                <button
                  onClick={() => {
                    setStep('join');
                    setPin('');
                    setError(null);
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-yellow cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> แก้ชื่อ IG
                </button>
              </>
            )}

            {step === 'spin' && (
              <>
                <p className="tape text-lg">หมุนเลย!</p>
                <div className="mt-8 w-full">
                  <Wheel rotation={rotation} durationSec={SPIN_SEC} />
                </div>
                {error && <p className="mt-4 text-sm font-semibold text-yellow">{error}</p>}
                <button
                  onClick={doSpin}
                  disabled={spun}
                  className="btn-sticker mt-8 px-10 py-4 rounded-full font-black text-xl cursor-pointer disabled:opacity-60"
                >
                  {spun ? 'กำลังหมุน...' : 'หมุน!'}
                </button>
                <p className="mt-3 text-xs text-white/75">หมุนได้ครั้งเดียวเท่านั้น</p>
              </>
            )}

            {step === 'win' && (
              <>
                <Sparkle className="w-10 animate-twinkle" />
                <h2 className="display-title text-5xl sm:text-6xl mt-2">YOU WIN!</h2>
                <p className="tape text-xl sm:text-2xl mt-4">ได้ครึ่งชิ้นฟรี!</p>
                <div
                  className="relative mt-8 w-full max-w-xs rounded-3xl border-[3px] border-ink p-5 text-ink shadow-[6px_6px_0_#0D0D0D]"
                  style={{ background: bg }}
                >
                  <p className="text-sm font-bold">รหัสรางวัล</p>
                  <p className="font-black text-6xl leading-none tracking-tight">{result?.prizeCode}</p>
                  <ChibiSticker mood={moodId} heightClass="h-28" className="mt-3" />
                </div>
                <p className="mt-6">
                  <span className="ink-bar">แสดงหน้านี้ให้พนักงานเพื่อรับของรางวัล</span>
                </p>
                <Link href="/" className="mt-8 text-sm font-semibold text-white/85 hover:text-yellow">
                  กลับหน้าแรก
                </Link>
              </>
            )}

            {step === 'thanks' && (
              <>
                <h2 className="display-title text-5xl sm:text-6xl">THANKS!</h2>
                <p className="tape text-xl mt-4">ขอบคุณที่แชร์</p>
                <p className="mt-4 text-sm text-white/85">คราวนี้ยังไม่ได้รางวัล แต่แซนวิชของคุณก็ยังอร่อยเหมือนเดิม</p>
                <ChibiSticker mood={moodId} heightClass="h-44" float className="mt-6" />
                <p className="mt-3 font-black text-yellow text-lg">{mood.chibiName}</p>
                <button
                  onClick={saveCard}
                  disabled={saving}
                  className="btn-sticker mt-6 px-7 py-3.5 rounded-full font-black inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Download className="w-5 h-5" /> {saving ? 'กำลังบันทึก...' : 'บันทึกการ์ดผลอารมณ์'}
                </button>
                <Link href="/" className="mt-6 text-sm font-semibold text-white/85 hover:text-yellow">
                  กลับหน้าแรก
                </Link>
              </>
            )}

            {step === 'used' && (
              <>
                <h2 className="display-title text-5xl">OOPS!</h2>
                <p className="tape text-xl mt-4">ใช้สิทธิ์ไปแล้ว</p>
                <p className="mt-4 text-sm text-white/85 max-w-xs">ชื่อ IG นี้ลุ้นรางวัลไปแล้ว 1 สิทธิ์ต่อ 1 บัญชี</p>
                <ChibiSticker moods={['angry']} heightClass="h-40" className="mt-6" />
                <Link href="/" className="mt-6 text-sm font-semibold text-white/85 hover:text-yellow">
                  กลับหน้าแรก
                </Link>
              </>
            )}
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Off-screen story card for "save my mood card" */}
      <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none" aria-hidden="true">
        <StoryCard ref={storyRef} mood={mood} />
      </div>
    </main>
  );
}
