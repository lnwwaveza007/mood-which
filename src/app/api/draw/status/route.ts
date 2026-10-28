import { publicStatus } from '@/lib/draw/service';
import { guard, json } from '@/lib/draw/http';

// GET /api/draw/status → { enabled, prizesLeft, prizePool } for screen 1
export async function GET() {
  return guard(async () => json({ ok: true, ...(await publicStatus()) } as { ok: boolean }));
}
