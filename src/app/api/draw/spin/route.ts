import { spin } from '@/lib/draw/service';
import { guard, json, readBody } from '@/lib/draw/http';

// POST /api/draw/spin { igHandle, staffPin } → { result: "win" | "lose", prizeCode?, prizesLeft }
// The server alone decides; the wheel in the browser only plays the result back.
export async function POST(req: Request) {
  return guard(async () => {
    const b = await readBody(req);
    return json(await spin(b.igHandle, b.staffPin));
  });
}
