import { guard, json } from '@/lib/draw/http';
import { createOrder, MAX_SLIP_BYTES, publicStatus } from '@/lib/preorder/service';

// GET: is the shop taking orders? POST (multipart): one order with its slip image.
export async function GET() {
  return guard(async () => json(await publicStatus()));
}

export async function POST(req: Request) {
  return guard(async () => {
    const size = Number(req.headers.get('content-length') ?? 0);
    if (size > MAX_SLIP_BYTES + 64 * 1024) return json({ ok: false, error: 'too_large' });
    const form = await req.formData().catch(() => null);
    if (!form) return json({ ok: false, error: 'bad_request' });
    return json(await createOrder(form));
  });
}
