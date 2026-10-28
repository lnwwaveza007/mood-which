'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { api, errorText, ApiFail } from '@/lib/draw/client';
import { SectionTag } from '@/components/Decor';
import Kiosk from './Kiosk';

interface Config {
  enabled: boolean;
  prizePool: number;
  mode: 'A' | 'B';
  n: number;
  unlockAt: number;
  expectedEntries: number;
}
interface Summary {
  config: Config;
  sales: number;
  entries: number;
  prizesGiven: number;
  prizesLeft: number;
  winners: { prizeCode: string; handle: string; at: string; collected: boolean }[];
}

const POLL_MS = 5000;
const PIN_KEY = 'moodwhich:draw:admin-pin';

type View = 'kiosk' | 'unlock' | 'settings';
const card = 'rounded-2xl bg-white text-ink border-[3px] border-ink p-4 shadow-[4px_4px_0_#0D0D0D]';

export default function AdminPanel() {
  const [pin, setPin] = useState('');
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Config | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetPin, setResetPin] = useState('');
  const [view, setView] = useState<View>('kiosk');
  const [unlockPin, setUnlockPin] = useState('');
  const pinRef = useRef('');
  // Same PIN as pinRef, kept in state so the kiosk can receive it as a prop.
  const [sessionPin, setSessionPin] = useState('');

  const call = useCallback(async (body: Record<string, unknown>): Promise<Summary | null> => {
    const res = await api<Summary>('/api/draw/admin', { pin: pinRef.current, ...body });
    if (!res.ok) {
      setError(errorText(res as ApiFail));
      return null;
    }
    setError(null);
    setData(res);
    return res;
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    pinRef.current = pin;
    const res = await call({ action: 'status' });
    setBusy(false);
    if (res) {
      try {
        sessionStorage.setItem(PIN_KEY, pin);
      } catch {
        // storage blocked: staff just log in again after a refresh
      }
      setAuthed(true);
      setSessionPin(pin);
      setView('kiosk');
      setDraft(res.config);
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(PIN_KEY);
    } catch {
      // ignore
    }
    pinRef.current = '';
    setSessionPin('');
    setPin('');
    setAuthed(false);
    setData(null);
    setView('kiosk');
  };

  // Settings are behind the PIN again so a customer at the iPad can't open them.
  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await api<Summary>('/api/draw/admin', { pin: unlockPin, action: 'status' });
    setBusy(false);
    setUnlockPin('');
    if (!res.ok) return setError(errorText(res as ApiFail));
    setError(null);
    setData(res);
    setDraft(res.config);
    setView('settings');
  };

  // Resume after an iPad refresh.
  useEffect(() => {
    let alive = true;
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(PIN_KEY);
    } catch {
      // ignore
    }
    if (!saved) return;
    pinRef.current = saved;
    api<Summary>('/api/draw/admin', { pin: saved, action: 'status' }).then((res) => {
      if (!alive) return;
      if (res.ok) {
        setData(res);
        setDraft(res.config);
        setSessionPin(saved);
        setAuthed(true);
      } else {
        try {
          sessionStorage.removeItem(PIN_KEY);
        } catch {
          // ignore
        }
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  // Live counters while the page is open.
  useEffect(() => {
    if (!authed) return;
    const t = setInterval(() => void call({ action: 'status' }), POLL_MS);
    return () => clearInterval(t);
  }, [authed, call]);

  const saveSettings = async () => {
    if (!draft) return;
    setBusy(true);
    const res = await call({ action: 'settings', config: draft });
    if (res) setDraft(res.config);
    setBusy(false);
  };

  const toggleEnabled = async () => {
    if (!data) return;
    const res = await call({ action: 'settings', config: { enabled: !data.config.enabled } });
    if (res) setDraft((d) => (d ? { ...d, enabled: res.config.enabled } : res.config));
  };

  const doReset = async () => {
    setBusy(true);
    const res = await call({ action: 'reset', confirmPin: resetPin });
    setBusy(false);
    setResetPin('');
    if (res) setResetOpen(false);
  };

  const num = (key: keyof Config) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft((d) => (d ? { ...d, [key]: e.target.value === '' ? 0 : Number(e.target.value) } : d));

  if (authed && data && view === 'kiosk') {
    return (
      <main className="min-h-dvh text-white relative z-[1]">
        <Kiosk
          pin={sessionPin}
          enabled={data.config.enabled}
          prizesLeft={data.prizesLeft}
          prizePool={data.config.prizePool}
          onTurnDone={() => void call({ action: 'status' })}
          onOpenSettings={() => {
            setError(null);
            setView('unlock');
          }}
          onAuthLost={logout}
        />
      </main>
    );
  }

  const field = 'w-24 rounded-lg border-2 border-ink px-2 py-1.5 text-right font-bold';

  return (
    <main className="min-h-dvh text-white relative z-[1]">
      <header className="w-full max-w-xl mx-auto px-4 pt-4 flex items-center justify-between">
        <SectionTag />
        {authed ? (
          <div className="flex items-center gap-4 text-xs font-semibold text-yellow">
            <button onClick={() => setView('kiosk')} className="cursor-pointer">โหมดลูกค้า</button>
            <button onClick={logout} className="cursor-pointer">ออกจากระบบ</button>
          </div>
        ) : (
          <Link href="/" className="text-xs font-semibold text-yellow">หน้าแรก</Link>
        )}
      </header>

      <div className="w-full max-w-xl mx-auto px-4 py-6 space-y-5">
        <h1 className="display-title text-[2.6rem] sm:text-5xl">DRAW ADMIN</h1>

        {authed && view === 'unlock' ? (
          <form onSubmit={unlock} className="space-y-4 max-w-xs">
            <p className="tape text-base">ใส่ PIN เพื่อเปิดตั้งค่า</p>
            <input
              value={unlockPin}
              onChange={(e) => setUnlockPin(e.target.value.replace(/D/g, '').slice(0, 8))}
              type="password"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              aria-label="PIN ผู้ดูแล"
              className="w-full text-center text-3xl tracking-[0.5em] py-3 rounded-2xl border-[3px] border-ink bg-white text-ink outline-none shadow-[5px_5px_0_#0D0D0D]"
            />
            {error && <p className="text-sm font-semibold text-yellow">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => { setView('kiosk'); setError(null); }} className="flex-1 py-3 rounded-full bg-white text-ink border-2 border-ink font-bold cursor-pointer">
                กลับ
              </button>
              <button disabled={!unlockPin || busy} className="btn-sticker flex-1 py-3 rounded-full font-black cursor-pointer disabled:opacity-50">
                เปิด
              </button>
            </div>
          </form>
        ) : !authed ? (
          <form onSubmit={login} className="space-y-4 max-w-xs">
            <p className="tape text-base">ใส่ PIN ผู้ดูแล</p>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              type="password"
              inputMode="numeric"
              autoComplete="off"
              aria-label="PIN ผู้ดูแล"
              className="w-full text-center text-3xl tracking-[0.5em] py-3 rounded-2xl border-[3px] border-ink bg-white text-ink outline-none shadow-[5px_5px_0_#0D0D0D]"
            />
            {error && <p className="text-sm font-semibold text-yellow">{error}</p>}
            <button
              disabled={!pin || busy}
              className="btn-sticker w-full py-3.5 rounded-full font-black text-lg cursor-pointer disabled:opacity-50"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        ) : (
          data &&
          draft && (
            <>
              {error && <p className="text-sm font-semibold text-yellow">{error}</p>}

              {/* Live counters */}
              <section className="grid grid-cols-3 gap-3 text-center">
                {[
                  ['ลงชื่อแล้ว', data.entries],
                  ['แจกแล้ว', data.prizesGiven],
                  ['เหลือ', data.prizesLeft],
                ].map(([label, v]) => (
                  <div key={label as string} className={card}>
                    <p className="text-xs font-semibold">{label}</p>
                    <p className="font-black text-4xl leading-none mt-1">{v}</p>
                  </div>
                ))}
              </section>

              {/* On / off */}
              <button
                onClick={toggleEnabled}
                className={`w-full py-3.5 rounded-2xl border-[3px] border-ink font-black text-lg cursor-pointer ${
                  data.config.enabled ? 'bg-[#7ED957] text-ink' : 'bg-alert text-white'
                }`}
              >
                {data.config.enabled ? 'กิจกรรมเปิดอยู่ (แตะเพื่อปิด)' : 'กิจกรรมปิดอยู่ (แตะเพื่อเปิด)'}
              </button>

              {/* Sales */}
              <section className={card}>
                <h2 className="font-black text-lg">ยอดขาย</h2>
                <p className="text-xs text-ink/65">ใช้กับ “ปลดล็อกที่ยอดขาย” ด้านล่าง</p>
                <div className="mt-3 flex items-center gap-3">
                  <button aria-label="ลด 1" onClick={() => call({ action: 'sales', delta: -1 })} className="w-11 h-11 rounded-xl border-2 border-ink bg-white grid place-items-center cursor-pointer">
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-black text-4xl w-16 text-center">{data.sales}</span>
                  <button aria-label="เพิ่ม 1" onClick={() => call({ action: 'sales', delta: 1 })} className="w-11 h-11 rounded-xl border-2 border-ink bg-yellow grid place-items-center cursor-pointer">
                    <Plus className="w-5 h-5" />
                  </button>
                  <button onClick={() => call({ action: 'sales', delta: 2 })} className="h-11 px-4 rounded-xl border-2 border-ink bg-yellow font-black cursor-pointer">
                    +2
                  </button>
                </div>
              </section>

              {/* Settings */}
              <section className={card}>
                <h2 className="font-black text-lg">ตั้งค่า</h2>
                <div className="mt-3 space-y-3 text-sm font-semibold">
                  <label className="flex items-center justify-between gap-3">
                    จำนวนรางวัลทั้งหมด
                    <input type="number" min={0} value={draft.prizePool} onChange={num('prizePool')} className={field} />
                  </label>
                  <div className="flex items-center justify-between gap-3">
                    โหมด
                    <div className="flex rounded-lg border-2 border-ink overflow-hidden">
                      {(['A', 'B'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setDraft({ ...draft, mode: m })}
                          className={`px-4 py-1.5 font-black cursor-pointer ${draft.mode === m ? 'bg-ink text-yellow' : 'bg-white'}`}
                        >
                          {m === 'A' ? 'A ทุกคนที่ N' : 'B สุ่มคุมจังหวะ'}
                        </button>
                      ))}
                    </div>
                  </div>
                  {draft.mode === 'A' ? (
                    <label className="flex items-center justify-between gap-3">
                      N (ทุก ๆ N คนได้รางวัล)
                      <input type="number" min={1} value={draft.n} onChange={num('n')} className={field} />
                    </label>
                  ) : (
                    <label className="flex items-center justify-between gap-3">
                      คาดว่าจะมีคนร่วมทั้งหมด
                      <input type="number" min={1} value={draft.expectedEntries} onChange={num('expectedEntries')} className={field} />
                    </label>
                  )}
                  <label className="flex items-center justify-between gap-3">
                    ปลดล็อกที่ยอดขาย (0 = ปิด)
                    <input type="number" min={0} value={draft.unlockAt} onChange={num('unlockAt')} className={field} />
                  </label>
                </div>
                <button
                  onClick={saveSettings}
                  disabled={busy}
                  className="btn-sticker mt-4 w-full py-3 rounded-full font-black cursor-pointer disabled:opacity-60"
                >
                  บันทึกการตั้งค่า
                </button>
              </section>

              {/* Winner log */}
              <section className={card}>
                <h2 className="font-black text-lg">รายชื่อผู้ได้รางวัล</h2>
                {data.winners.length === 0 ? (
                  <p className="mt-2 text-sm text-ink/60">ยังไม่มีผู้ได้รางวัล</p>
                ) : (
                  <ul className="mt-2 divide-y-2 divide-ink/10">
                    {data.winners.map((w) => (
                      <li key={w.prizeCode} className="py-2.5 flex items-center gap-3">
                        <span className="font-black text-lg w-16">{w.prizeCode}</span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-semibold truncate">@{w.handle}</span>
                          <span className="block text-xs text-ink/60">
                            {new Date(w.at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>
                        <label className="flex items-center gap-1.5 text-sm font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={w.collected}
                            onChange={(e) => call({ action: 'collected', prizeCode: w.prizeCode, collected: e.target.checked })}
                            className="w-5 h-5 accent-ink"
                          />
                          รับแล้ว
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Reset */}
              <section className="rounded-2xl border-2 border-dashed border-white/50 p-4">
                {!resetOpen ? (
                  <button onClick={() => setResetOpen(true)} className="inline-flex items-center gap-2 font-bold text-white/90 cursor-pointer">
                    <RotateCcw className="w-4 h-4" /> รีเซ็ตทุกตัวเลข (สำหรับทดสอบ)
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">ล้างผู้ร่วม รางวัลที่แจก และยอดขายทั้งหมด ใส่ PIN อีกครั้งเพื่อยืนยัน</p>
                    <input
                      value={resetPin}
                      onChange={(e) => setResetPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      type="password"
                      inputMode="numeric"
                      aria-label="ยืนยัน PIN เพื่อรีเซ็ต"
                      className="w-full text-center text-2xl tracking-[0.4em] py-2.5 rounded-xl border-[3px] border-ink bg-white text-ink outline-none"
                    />
                    <div className="flex gap-3">
                      <button onClick={() => { setResetOpen(false); setResetPin(''); }} className="flex-1 py-2.5 rounded-xl bg-white text-ink border-2 border-ink font-bold cursor-pointer">
                        ยกเลิก
                      </button>
                      <button onClick={doReset} disabled={!resetPin || busy} className="flex-1 py-2.5 rounded-xl bg-alert text-white border-2 border-ink font-black cursor-pointer disabled:opacity-60">
                        รีเซ็ตเลย
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </>
          )
        )}
      </div>
    </main>
  );
}
