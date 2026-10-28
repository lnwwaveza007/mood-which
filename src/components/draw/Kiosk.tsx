'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, Settings } from 'lucide-react';
import ChibiSticker from '@/components/ChibiSticker';
import SoundToggle from '@/components/SoundToggle';
import { InstagramIcon, Sparkle } from '@/components/Decor';
import { FundamentalMood } from '@/data/quizData';
import { sfx } from '@/lib/sound';
import { api, errorText, ApiFail } from '@/lib/draw/client';
import Wheel, { pickSlot, rotationFor } from './Wheel';

// Customer-facing screen for the booth iPad. Staff stay logged in to /draw/admin and
// hand the iPad over; customers only ever see this screen (settings need the PIN again).

type Step = 'handle' | 'spin' | 'win' | 'thanks' | 'used';

interface CheckOk {
  alreadyUsed: boolean;
  prizesLeft: number;
}
interface SpinOk {
  alreadyUsed: boolean;
  result: 'win' | 'lose';
  prizeCode?: string;
  prizesLeft: number;
}

interface KioskProps {
  pin: string;
  enabled: boolean;
  prizesLeft: number;
  prizePool: number;
  /** Called after every finished turn so the counters refresh. */
  onTurnDone: () => void;
  onOpenSettings: () => void;
  /** PIN rejected by the server (changed or locked): send staff back to login. */
  onAuthLost: () => void;
}

const SPIN_SEC = 3.2;
const FACES: FundamentalMood[] = ['happy', 'boring', 'angry', 'sad'];
const normalize = (h: string) => h.trim().replace(/^@+/, '').toLowerCase();

export default function Kiosk({ pin, enabled, prizesLeft, prizePool, onTurnDone, onOpenSettings, onAuthLost }: KioskProps) {
  const [step, setStep] = useState<Step>('handle');
  const [handle, setHandle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [spun, setSpun] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ result: 'win' | 'lose'; prizeCode?: string } | null>(null);
  // Same phone-less booth, so "who is the chibi" is just for fun: rotate per turn.
  const [turn, setTurn] = useState(0);
  const face = FACES[turn % FACES.length];

  const fail = (e: ApiFail) => {
    if (e.error === 'wrong_pin' || e.error === 'locked' || e.error === 'not_configured') return onAuthLost();
    setError(errorText(e));
  };

  const next = () => {
    sfx.tap();
    setTurn((t) => t + 1);
    setHandle('');
    setError(null);
    setSpun(false);
    setResult(null);
    setStep('handle');
    onTurnDone();
  };

  const start = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!/^[a-z0-9._]{1,30}$/.test(normalize(handle))) return setError(errorText({ ok: false, error: 'bad_handle' }));
    setBusy(true);
    setError(null);
    const res = await api<CheckOk>('/api/draw/admin', { pin, action: 'check', igHandle: handle });
    setBusy(false);
    if (!res.ok) return fail(res);
    if (res.alreadyUsed) {
      sfx.back();
      return setStep('used');
    }
    sfx.start();
    setStep('spin');
  };

  // One tap. The server decides; the wheel only plays the result back.
  const doSpin = async () => {
    if (spun || busy) return;
    setSpun(true);
    setBusy(true);
    setError(null);
    sfx.tap();
    const res = await api<SpinOk>('/api/draw/admin', { pin, action: 'spin', igHandle: handle });
    if (!res.ok) {
      setBusy(false);
      setSpun(false);
      return fail(res);
    }
    const win = res.result === 'win';
    setResult({ result: res.result, prizeCode: res.prizeCode });
    setRotation((r) => rotationFor(pickSlot(win), r));
    sfx.drumroll(SPIN_SEC - 0.2);
    window.setTimeout(() => {
      setBusy(false);
      if (win) {
        sfx.reveal();
        try {
          confetti({ particleCount: 160, spread: 100, origin: { y: 0.55 }, colors: ['#FFE83B', '#7ED957', '#FF8BAE', '#8EB2D9', '#FFFFFF'] });
        } catch {
          // canvas unavailable
        }
        setStep('win');
      } else {
        sfx.ding();
        setStep('thanks');
      }
      onTurnDone();
    }, SPIN_SEC * 1000 + 300);
  };

  const soldOut = prizesLeft <= 0;

  return (
    <div className="w-full min-h-dvh flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="font-label text-xs font-semibold tracking-[0.14em] text-yellow">MOODWHICH · LUCKY DRAW</span>
        <div className="flex items-center gap-2">
          <SoundToggle />
          <button
            onClick={onOpenSettings}
            aria-label="ตั้งค่า (ต้องใช้ PIN)"
            className="w-9 h-9 rounded-full border-2 border-ink bg-white/90 text-ink grid place-items-center cursor-pointer"
          >
            <Settings className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-2xl mx-auto px-5 py-6 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            {step === 'handle' && (
              <>
                <h1 className="display-title text-7xl sm:text-8xl">LUCKY DRAW</h1>
                <p className="tape text-xl sm:text-2xl mt-5">แท็ก IG ลุ้นครึ่งชิ้นฟรี</p>
                <div className="mt-6 rounded-2xl bg-ink px-6 py-3">
                  {!enabled ? (
                    <span className="font-bold text-yellow">กิจกรรมปิดอยู่ตอนนี้</span>
                  ) : soldOut ? (
                    <span className="font-black text-yellow text-xl">รางวัลหมดแล้ว (ยังหมุนเล่นได้)</span>
                  ) : (
                    <span className="font-black text-yellow text-2xl">
                      เหลือ {prizesLeft}/{prizePool} รางวัล
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-white/80">รางวัลครึ่งชิ้นฟรี จำกัด {prizePool} รางวัล หมดแล้วหมดเลย</p>

                {enabled && (
                  <form onSubmit={start} className="mt-8 w-full max-w-md">
                    <label htmlFor="ig" className="block text-left text-base font-semibold mb-2">
                      พิมพ์ชื่อ IG ที่แท็กร้านของคุณ
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-white text-ink px-4 shadow-[5px_5px_0_#0D0D0D]">
                      <InstagramIcon className="w-7 h-7 shrink-0" />
                      <span className="font-bold text-lg">@</span>
                      <input
                        id="ig"
                        value={handle.replace(/^@+/, '')}
                        onChange={(e) => setHandle(e.target.value)}
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="your.handle"
                        className="flex-1 min-w-0 py-4 bg-transparent outline-none font-semibold text-lg placeholder:text-ink/35"
                      />
                    </div>
                    {error && <p className="mt-3 text-sm font-semibold text-yellow">{error}</p>}
                    <button
                      type="submit"
                      disabled={!handle.trim() || busy}
                      className="btn-sticker mt-6 w-full py-4 rounded-full font-black text-xl inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {busy ? 'กำลังเช็ก...' : 'ไปหมุนวงล้อ'} <ArrowRight className="w-6 h-6" strokeWidth={3} />
                    </button>
                  </form>
                )}
              </>
            )}

            {step === 'spin' && (
              <>
                <p className="tape text-xl">@{normalize(handle)} หมุนเลย!</p>
                <div className="mt-8 w-full">
                  <Wheel rotation={rotation} durationSec={SPIN_SEC} />
                </div>
                {error && <p className="mt-4 text-sm font-semibold text-yellow">{error}</p>}
                <button
                  onClick={doSpin}
                  disabled={spun}
                  className="btn-sticker mt-8 px-14 py-5 rounded-full font-black text-2xl cursor-pointer disabled:opacity-60"
                >
                  {spun ? 'กำลังหมุน...' : 'หมุน!'}
                </button>
                <p className="mt-3 text-xs text-white/75">หมุนได้ครั้งเดียวเท่านั้น</p>
              </>
            )}

            {step === 'win' && (
              <>
                <Sparkle className="w-12 animate-twinkle" />
                <h2 className="display-title text-6xl sm:text-7xl mt-2">YOU WIN!</h2>
                <p className="tape text-2xl mt-4">ได้ครึ่งชิ้นฟรี!</p>
                <div
                  className="mt-8 w-full max-w-sm rounded-3xl border-[3px] border-ink p-6 text-ink shadow-[6px_6px_0_#0D0D0D]"
                  style={{ background: 'linear-gradient(115deg,#FFE83B 0 50%,#FF8BAE 50% 100%)' }}
                >
                  <p className="text-sm font-bold">รหัสรางวัล</p>
                  <p className="font-black text-7xl leading-none tracking-tight">{result?.prizeCode}</p>
                  <p className="mt-2 text-sm font-semibold">@{normalize(handle)}</p>
                  <ChibiSticker moods={[face]} heightClass="h-28" className="mt-3" />
                </div>
                <p className="mt-6">
                  <span className="ink-bar">รับของรางวัลกับพนักงานได้เลย</span>
                </p>
                <button onClick={next} className="btn-sticker mt-8 px-10 py-4 rounded-full font-black text-lg cursor-pointer">
                  คนต่อไป
                </button>
              </>
            )}

            {step === 'thanks' && (
              <>
                <h2 className="display-title text-6xl sm:text-7xl">THANKS!</h2>
                <p className="tape text-2xl mt-4">ขอบคุณที่แชร์</p>
                <p className="mt-4 text-base text-white/85">คราวนี้ยังไม่ได้รางวัล แต่ขอบคุณที่มาอุดหนุนนะ</p>
                <ChibiSticker moods={[face]} heightClass="h-52" float className="mt-6" />
                <button onClick={next} className="btn-sticker mt-8 px-10 py-4 rounded-full font-black text-lg cursor-pointer">
                  คนต่อไป
                </button>
              </>
            )}

            {step === 'used' && (
              <>
                <h2 className="display-title text-6xl">OOPS!</h2>
                <p className="tape text-2xl mt-4">ใช้สิทธิ์ไปแล้ว</p>
                <p className="mt-4 text-base text-white/85">ชื่อ IG นี้ลุ้นรางวัลไปแล้ว 1 สิทธิ์ต่อ 1 บัญชี</p>
                <ChibiSticker moods={['angry']} heightClass="h-44" className="mt-6" />
                <button onClick={next} className="btn-sticker mt-8 px-10 py-4 rounded-full font-black text-lg cursor-pointer">
                  ลองชื่ออื่น
                </button>
              </>
            )}
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
}
