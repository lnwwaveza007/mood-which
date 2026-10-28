import { admin, AdminAction, kioskCheck, kioskSpin } from '@/lib/draw/service';
import { guard, json, readBody } from '@/lib/draw/http';

// The draw only runs from the booth iPad, behind the admin PIN. One endpoint:
//   POST { pin, action: "status" | "settings" | "sales" | "collected" | "reset" }  → counters
//   POST { pin, action: "check", igHandle }  → { alreadyUsed, prizesLeft }   (does not spend the entry)
//   POST { pin, action: "spin",  igHandle }  → { result: "win" | "lose", prizeCode?, prizesLeft }
export async function POST(req: Request) {
  return guard(async () => {
    const { pin, ...rest } = await readBody(req);
    if (typeof rest.action !== 'string') return json({ ok: false, error: 'bad_request' });
    if (rest.action === 'check') return json(await kioskCheck(pin, rest.igHandle));
    if (rest.action === 'spin') return json(await kioskSpin(pin, rest.igHandle));
    return json(await admin(pin, rest as unknown as AdminAction));
  });
}
