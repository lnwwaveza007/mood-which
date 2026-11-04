import { del, get, put } from '@vercel/blob';
import { StorageNotConfigured } from '@/lib/docStore';

// Slips show names and bank details, so they live in a PRIVATE Vercel Blob store and
// only the PIN-protected admin route can read them. Local dev keeps them in memory.

const g = globalThis as unknown as { __mwSlips?: Map<string, { bytes: Uint8Array; type: string }> };
const memory = () => (g.__mwSlips ??= new Map());

function blobEnabled(): boolean {
  if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) return true;
  if (process.env.NODE_ENV === 'production') throw new StorageNotConfigured('Connect a private Blob store');
  return false;
}

/** Trust the file's first bytes, not its name or the type the browser claims. */
export function sniffImage(b: Uint8Array): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  const ascii = (from: number, to: number) => String.fromCharCode(...b.slice(from, to));
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  return null;
}

export async function saveSlip(path: string, bytes: Uint8Array, type: string): Promise<void> {
  if (blobEnabled()) {
    await put(path, Buffer.from(bytes), { access: 'private', contentType: type, addRandomSuffix: false });
    return;
  }
  memory().set(path, { bytes, type });
}

export async function readSlip(path: string): Promise<{ body: BodyInit; type: string } | null> {
  if (blobEnabled()) {
    const found = await get(path, { access: 'private' });
    if (!found || found.statusCode !== 200) return null;
    return { body: found.stream, type: found.blob.contentType };
  }
  const slip = memory().get(path);
  return slip ? { body: Buffer.from(slip.bytes), type: slip.type } : null;
}

export async function deleteSlips(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  if (blobEnabled()) {
    await del(paths);
    return;
  }
  paths.forEach((p) => memory().delete(p));
}
