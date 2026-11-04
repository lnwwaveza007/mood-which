import { guard, json, readBody } from '@/lib/draw/http';
import { staff, StaffAction } from '@/lib/preorder/service';

// Staff order list, behind the same PIN as the draw.
//   POST { pin, action: "status" | "settings" | "review" | "delivered" | "reset" }
export async function POST(req: Request) {
  return guard(async () => {
    const { pin, ...rest } = await readBody(req);
    if (typeof rest.action !== 'string') return json({ ok: false, error: 'bad_request' });
    return json(await staff(pin, rest as unknown as StaffAction));
  });
}
