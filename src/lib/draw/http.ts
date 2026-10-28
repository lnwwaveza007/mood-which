import { StorageNotConfigured } from './store';

const STATUS: Record<string, number> = {
  bad_handle: 400,
  bad_request: 400,
  disabled: 403,
  wrong_pin: 401,
  locked: 429,
  not_configured: 503,
};

/** JSON reply that is never cached: counters change on every spin. */
export function json(body: { ok: boolean; error?: string }, init?: { status?: number }) {
  const status = init?.status ?? (body.ok ? 200 : (STATUS[body.error ?? ''] ?? 400));
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function readBody(req: Request): Promise<Record<string, unknown>> {
  try {
    const b = await req.json();
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export async function guard(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof StorageNotConfigured) return json({ ok: false, error: 'not_configured' });
    console.error('draw error', err);
    return json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
