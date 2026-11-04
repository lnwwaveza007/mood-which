// A small document store: each feature keeps ONE JSON document, so every change is a
// single locked read-modify-write and two requests can never overwrite each other.
//
// Production: Upstash Redis (Vercel Marketplace) through its REST API.
// Local dev: in-memory fallback. On Vercel without Redis we refuse to run, because
// serverless instances would each keep their own (wrong) copy of the data.

export class StorageNotConfigured extends Error {}

interface Backend<T> {
  read(): Promise<T | null>;
  write(doc: T): Promise<void>;
  lock<R>(fn: () => Promise<R>): Promise<R>;
}

function redisCreds() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

const RELEASE = 'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end';

function redisBackend<T>(name: string, url: string, token: string): Backend<T> {
  const stateKey = `moodwhich:${name}:state`;
  const lockKey = `moodwhich:${name}:lock`;

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

  return {
    async read() {
      const raw = (await cmd('GET', stateKey)) as string | null;
      return raw ? (JSON.parse(raw) as T) : null;
    },
    async write(doc) {
      await cmd('SET', stateKey, JSON.stringify(doc));
    },
    async lock(fn) {
      const owner = crypto.randomUUID();
      let got = false;
      for (let i = 0; i < 50 && !got; i++) {
        got = (await cmd('SET', lockKey, owner, 'NX', 'PX', 5000)) === 'OK';
        if (!got) await new Promise((r) => setTimeout(r, 100));
      }
      if (!got) throw new Error(`${name} busy`);
      try {
        return await fn();
      } finally {
        await cmd('EVAL', RELEASE, 1, lockKey, owner).catch(() => undefined);
      }
    },
  };
}

const g = globalThis as unknown as { __mwDocs?: Record<string, { doc: unknown; chain: Promise<unknown> }> };

function memoryBackend<T>(name: string): Backend<T> {
  const docs = (g.__mwDocs ??= {});
  const mem = (docs[name] ??= { doc: null, chain: Promise.resolve() });
  return {
    async read() {
      return mem.doc ? (JSON.parse(JSON.stringify(mem.doc)) as T) : null;
    },
    async write(doc) {
      mem.doc = JSON.parse(JSON.stringify(doc));
    },
    lock(fn) {
      const run = mem.chain.then(fn, fn);
      mem.chain = run.catch(() => undefined);
      return run;
    },
  };
}

export function docStore<T>(name: string, empty: () => T) {
  const backend = (): Backend<T> => {
    const creds = redisCreds();
    if (creds) return redisBackend<T>(name, creds.url, creds.token);
    if (process.env.NODE_ENV === 'production') {
      throw new StorageNotConfigured('Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
    }
    return memoryBackend<T>(name);
  };

  return {
    /** Current document, without taking the lock. Use only for read-only answers. */
    async read(): Promise<T> {
      return (await backend().read()) ?? empty();
    },
    /** Run `fn` on the current document under the lock; the (possibly mutated) document is always saved. */
    async update<R>(fn: (doc: T) => R | Promise<R>): Promise<R> {
      const b = backend();
      return b.lock(async () => {
        const doc = (await b.read()) ?? empty();
        const out = await fn(doc);
        await b.write(doc);
        return out;
      });
    },
  };
}
