import { guard, json, readBody } from '@/lib/draw/http';
import { staffSlip } from '@/lib/preorder/service';

// POST { pin, code } → the slip image. POST, so the PIN never lands in a URL or a log.
export async function POST(req: Request) {
  return guard(async () => {
    const { pin, code } = await readBody(req);
    const res = await staffSlip(pin, code);
    if (!res.slip) return json(res.reply);
    return new Response(res.slip.body, {
      headers: {
        'Content-Type': res.slip.type,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  });
}
