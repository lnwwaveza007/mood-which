import { verifyEntry } from '@/lib/draw/service';
import { guard, json, readBody } from '@/lib/draw/http';

// POST /api/draw/verify { igHandle, staffPin } → checks the tag, does NOT spend the entry
export async function POST(req: Request) {
  return guard(async () => {
    const b = await readBody(req);
    return json(await verifyEntry(b.igHandle, b.staffPin));
  });
}
