import { DrawState, emptyState } from './types';

// Draw state lives in ONE JSON document so every spin is a single locked
// read-modify-write: two phones spinning at once can never both take the last prize.
//
// Production: Upstash Redis (Vercel Marketplace) through its REST API.
// Local dev: in-memory fallback. On Vercel without Redis we refuse to run, because
// serverless instances would each keep their own (wrong) copy of the counters.

const STATE_KEY = 'moodwhich:draw:state';
const LOCK_KEY = 'moodwhich:draw:lock';

export class StorageNotConfigured extends Error {}

interface Backend {
  read(): Promise<DrawState | null>;
  write(state: DrawState): Promise<void>;
  lock<T>(fn: () => Promise<T>): Promise<T>;
}

function redisCreds() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

function redisBackend(url: string, token: string): Backend {
  const cmd = async (...args: (string | number)[]) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
      cache: 'no-store',
    });
    const body = (await res.json()) as { result?: unknown; error?: string };
    if (!res.ok || body.error) throw new Error(body.error ?? `redis ${res.status}`);
    return body.result;
  };

  const RELEASE = 'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end';

  return {
    async read() {
      const raw = (await cmd('GET', STATE_KEY)) as string | null;
      return raw ? (JSON.parse(raw) as DrawState) : null;
    },
    async write(state) {
      await cmd('SET', STATE_KEY, JSON.stringify(state));
    },
    async lock(fn) {
      const token = crypto.randomUUID();
      let got = false;
      for (let i = 0; i < 50 && !got; i++) {
        got = (await cmd('SET', LOCK_KEY, token, 'NX', 'PX', 5000)) === 'OK';
        if (!got) await new Promise((r) => setTimeout(r, 100));
      }
      if (!got) throw new Error('draw busy');
      try {
        return await fn();
      } finally {
        await cmd('EVAL', RELEASE, 1, LOCK_KEY, token).catch(() => undefined);
      }
    },
  };
}

const g = globalThis as unknown as { __mwDraw?: { state: DrawState | null; chain: Promise<unknown> } };

function memoryBackend(): Backend {
  const mem = (g.__mwDraw ??= { state: null, chain: Promise.resolve() });
  return {
    async read() {
      return mem.state ? (JSON.parse(JSON.stringify(mem.state)) as DrawState) : null;
    },
    async write(state) {
      mem.state = JSON.parse(JSON.stringify(state)) as DrawState;
    },
    lock(fn) {
      const run = mem.chain.then(fn, fn);
      mem.chain = run.catch(() => undefined);
      return run;
    },
  };
}

function backend(): Backend {
  const creds = redisCreds();
  if (creds) return redisBackend(creds.url, creds.token);
  if (process.env.NODE_ENV === 'production') {
    throw new StorageNotConfigured('Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
  }
  return memoryBackend();
}

/** Run `fn` on the current state under the lock; the (possibly mutated) state is always saved. */
export async function withState<T>(fn: (state: DrawState) => T | Promise<T>): Promise<T> {
  const b = backend();
  return b.lock(async () => {
    const state = (await b.read()) ?? emptyState();
    const out = await fn(state);
    await b.write(state);
    return out;
  });
}
