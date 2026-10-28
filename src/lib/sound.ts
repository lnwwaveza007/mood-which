// Tiny Web Audio synth for MoodWhich: a bouncy ukulele-pop background loop plus
// UI sound effects. Everything is generated in code — no audio files to load
// and no music licensing to worry about.
//
// Browsers only allow audio after a user gesture, so the AudioContext is created
// lazily inside the first sfx/music call (always triggered from a click).

type Listener = () => void;
type Bus = 'music' | 'sfx';

const STORAGE_KEY = 'moodwhich:muted';
const MUSIC_LEVEL = 0.45;

let ctx: AudioContext | null = null;
let master: GainNode;
let musicBus: GainNode;
let sfxBus: GainNode;
let noiseBuffer: AudioBuffer;

let muted = readStoredMuted();
const listeners = new Set<Listener>();

function readStoredMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();

    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
    musicBus = ctx.createGain();
    musicBus.gain.value = 0;
    musicBus.connect(master);
    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.8;
    sfxBus.connect(master);

    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    // Background tabs throttle timers, which would make the loop stutter: pause instead.
    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      if (document.hidden) void ctx.suspend();
      else void ctx.resume();
    });
  }
  if (ctx.state === 'suspended' && !document.hidden) void ctx.resume();
  return ctx;
}

const midi = (n: number) => 440 * 2 ** ((n - 69) / 12);
const busNode = (bus: Bus) => (bus === 'music' ? musicBus : sfxBus);

/* ── Instruments ─────────────────────────────────────────────────── */

interface ToneOpts {
  type?: OscillatorType;
  gain?: number;
  attack?: number;
  slideTo?: number;
  bus?: Bus;
}

function tone(freq: number, start: number, dur: number, opts: ToneOpts = {}) {
  const c = ctx!;
  const { type = 'triangle', gain = 0.3, attack = 0.005, slideTo, bus = 'sfx' } = opts;
  const osc = c.createOscillator();
  const env = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(gain, start + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(env).connect(busNode(bus));
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

interface NoiseOpts {
  gain?: number;
  filter?: BiquadFilterType;
  freq?: number;
  freqTo?: number;
  q?: number;
  bus?: Bus;
}

function noise(start: number, dur: number, opts: NoiseOpts = {}) {
  const c = ctx!;
  const { gain = 0.2, filter = 'highpass', freq = 6000, freqTo, q = 1, bus = 'sfx' } = opts;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer;
  const f = c.createBiquadFilter();
  f.type = filter;
  f.Q.value = q;
  f.frequency.setValueAtTime(freq, start);
  if (freqTo) f.frequency.exponentialRampToValueAtTime(freqTo, start + dur);
  const env = c.createGain();
  env.gain.setValueAtTime(gain, start);
  env.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.connect(f).connect(env).connect(busNode(bus));
  src.start(start, Math.random() * 0.5);
  src.stop(start + dur + 0.05);
}

/** Ukulele-ish pluck: bright triangle + soft octave sine, quick decay. */
function pluck(freq: number, start: number, gain = 0.12, bus: Bus = 'sfx') {
  tone(freq, start, 0.32, { type: 'triangle', gain, bus });
  tone(freq * 2, start, 0.18, { type: 'sine', gain: gain * 0.35, bus });
}

/** Glockenspiel-like bell for sparkles. */
function bell(freq: number, start: number, gain = 0.12) {
  tone(freq, start, 0.9, { type: 'sine', gain });
  tone(freq * 2.76, start, 0.35, { type: 'sine', gain: gain * 0.3 });
}

/* ── Background music ────────────────────────────────────────────── */

const BPM = 112;
const STEP = 60 / BPM / 4; // 16th note
const BARS = 4;
const STEPS = 16 * BARS * 2; // groove-only pass, then groove + melody

// C – Am – F – G, sunny and simple
const BASS = [48, 45, 41, 43];
const CHORDS = [
  [72, 76, 79],
  [72, 76, 81],
  [72, 77, 81],
  [71, 74, 79],
];
const _ = null;
const MELODY: (number | null)[][] = [
  [76, _, 79, _, 84, _, 79, _, 81, _, 79, _, 76, _, _, _],
  [76, _, 81, _, 84, _, 81, _, 79, _, 76, _, 72, _, _, _],
  [77, _, 81, _, 84, _, 81, _, 79, _, 77, _, 76, _, 74, _],
  [74, _, 79, _, 83, _, 79, _, 74, _, _, _, 79, _, 83, _],
];

let step = 0;
let nextTime = 0;
let timer: ReturnType<typeof setInterval> | null = null;

function scheduleStep(s: number, t: number) {
  const bar = Math.floor(s / 16) % BARS;
  const i = s % 16;
  const withMelody = s >= 16 * BARS;

  // drums: soft kick, offbeat shaker, light clap
  if (i === 0 || i === 8) tone(150, t, 0.14, { type: 'sine', gain: 0.45, slideTo: 45, bus: 'music' });
  if (i % 4 === 2) noise(t, 0.04, { gain: 0.06, freq: 7500, bus: 'music' });
  if (i === 4 || i === 12) noise(t, 0.09, { gain: 0.09, filter: 'bandpass', freq: 1600, q: 0.8, bus: 'music' });

  // bouncy oom-pah bass
  const root = BASS[bar];
  if (i === 0) tone(midi(root), t, STEP * 3, { gain: 0.32, bus: 'music' });
  if (i === 6) tone(midi(root + 12), t, STEP * 1.5, { gain: 0.18, bus: 'music' });
  if (i === 8) tone(midi(root + 7), t, STEP * 3, { gain: 0.26, bus: 'music' });
  if (i === 14) tone(midi(root + 12), t, STEP * 1.5, { gain: 0.18, bus: 'music' });

  // strummed chord stabs
  if (i === 4 || i === 10 || i === 12) {
    CHORDS[bar].forEach((n, k) => pluck(midi(n - 12), t + k * 0.012, 0.035, 'music'));
  }

  // melody on every other pass so the loop doesn't get tiring
  const note = MELODY[bar][i];
  if (withMelody && note) pluck(midi(note), t, 0.09, 'music');
}

function tick() {
  if (!ctx) return;
  while (nextTime < ctx.currentTime + 0.12) {
    scheduleStep(step, nextTime);
    nextTime += STEP;
    step = (step + 1) % STEPS;
  }
}

export function startMusic() {
  const c = ensureCtx();
  if (!c || timer) return;
  step = 0;
  nextTime = c.currentTime + 0.08;
  musicBus.gain.cancelScheduledValues(c.currentTime);
  musicBus.gain.setValueAtTime(0.0001, c.currentTime);
  musicBus.gain.exponentialRampToValueAtTime(MUSIC_LEVEL, c.currentTime + 1.2);
  timer = setInterval(tick, 25);
  tick();
}

export function stopMusic() {
  if (!ctx || !timer) return;
  clearInterval(timer);
  timer = null;
  musicBus.gain.cancelScheduledValues(ctx.currentTime);
  musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
}

/** Dip the music under a jingle, then bring it back. */
function duck(seconds: number) {
  if (!ctx || !timer) return;
  const now = ctx.currentTime;
  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setTargetAtTime(MUSIC_LEVEL * 0.25, now, 0.05);
  musicBus.gain.setTargetAtTime(MUSIC_LEVEL, now + seconds, 0.4);
}

/* ── Sound effects ───────────────────────────────────────────────── */

function at(): number | null {
  const c = ensureCtx();
  return c ? c.currentTime + 0.01 : null;
}

export const sfx = {
  /** Generic button tap: soft bubble pop. */
  tap() {
    const t = at();
    if (t === null) return;
    tone(900, t, 0.09, { type: 'sine', gain: 0.35, slideTo: 480 });
  },

  /** Start the quiz: happy rising arpeggio + sparkle. */
  start() {
    const t = at();
    if (t === null) return;
    [72, 76, 79, 84].forEach((n, k) => pluck(midi(n), t + k * 0.07, 0.22));
    bell(midi(96), t + 0.3, 0.08);
  },

  /** Pick an answer: pop pitched per option so each choice sounds different. */
  select(index: number) {
    const t = at();
    if (t === null) return;
    const n = [72, 76, 79, 84][index % 4];
    tone(midi(n) * 1.6, t, 0.11, { type: 'sine', gain: 0.4, slideTo: midi(n) });
    pluck(midi(n + 12), t + 0.05, 0.12);
  },

  /** Next question: airy swoosh. */
  next() {
    const t = at();
    if (t === null) return;
    noise(t, 0.24, { gain: 0.14, filter: 'bandpass', freq: 500, freqTo: 3200, q: 1.2 });
  },

  /** Go back: downward pop. */
  back() {
    const t = at();
    if (t === null) return;
    tone(600, t, 0.12, { type: 'sine', gain: 0.3, slideTo: 300 });
  },

  /** "Thinking…" blips that speed up and rise, for the calculating screen. */
  drumroll(seconds = 1.6) {
    const t = at();
    if (t === null) return;
    duck(seconds + 0.4);
    let time = 0;
    let gap = 0.16;
    while (time < seconds) {
      const n = 60 + Math.round((time / seconds) * 24);
      tone(midi(n), t + time, 0.05, { type: 'square', gain: 0.05 });
      noise(t + time, 0.03, { gain: 0.05, freq: 5000 });
      time += gap;
      gap = Math.max(0.045, gap * 0.9);
    }
  },

  /** Result reveal: sparkly fanfare. */
  reveal() {
    const t = at();
    if (t === null) return;
    duck(2.2);
    [60, 64, 67, 72, 76, 79, 84].forEach((n, k) => pluck(midi(n), t + k * 0.055, 0.16));
    [72, 76, 79].forEach((n) => tone(midi(n), t + 0.42, 1.1, { type: 'triangle', gain: 0.08, attack: 0.02 }));
    bell(midi(96), t + 0.45, 0.1);
    bell(midi(100), t + 0.62, 0.08);
    bell(midi(103), t + 0.8, 0.07);
  },

  /** Save the story card: camera shutter. */
  shutter() {
    const t = at();
    if (t === null) return;
    noise(t, 0.035, { gain: 0.35, freq: 2500 });
    tone(180, t, 0.06, { type: 'sine', gain: 0.25, slideTo: 90 });
    noise(t + 0.08, 0.05, { gain: 0.25, freq: 3500 });
  },

  /** Copied / done: two-note ding. */
  ding() {
    const t = at();
    if (t === null) return;
    bell(midi(88), t, 0.12);
    bell(midi(93), t + 0.1, 0.1);
  },
};

/* ── Mute state (shared with React via useSyncExternalStore) ──────── */

export function isMuted() {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
  } catch {
    // storage blocked: the choice just won't persist
  }
  if (ctx) master.gain.setTargetAtTime(next ? 0 : 1, ctx.currentTime, 0.05);
  listeners.forEach((l) => l());
}

export function subscribeMuted(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
