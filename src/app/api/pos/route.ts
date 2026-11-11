import { guard, json, readBody } from '@/lib/draw/http';
import { pos, PosAction } from '@/lib/preorder/service';

// Booth till (walk-in sales), behind the same PIN as the draw and the pre-order staff page.
//   POST { pin, action: "status" | "sell" | "void" }
export async function POST(req: Request) {
  return guard(async () => {
    const { pin, ...rest } = await readBody(req);
    if (typeof rest.action !== 'string') return json({ ok: false, error: 'bad_request' });
    return json(await pos(pin, rest as unknown as PosAction));
  });
}
