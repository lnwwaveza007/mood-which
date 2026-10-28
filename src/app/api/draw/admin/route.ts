import { admin, AdminAction } from '@/lib/draw/service';
import { guard, json, readBody } from '@/lib/draw/http';

// POST /api/draw/admin { pin, action: "status" | "settings" | "sales" | "collected" | "reset", ... }
export async function POST(req: Request) {
  return guard(async () => {
    const { pin, ...rest } = await readBody(req);
    if (typeof rest.action !== 'string') return json({ ok: false, error: 'bad_request' });
    return json(await admin(pin, rest as unknown as AdminAction));
  });
}
