// Browser-side helpers for the draw API. Contains no draw logic: results come from the server.

export type ApiError =
  | 'bad_handle'
  | 'bad_request'
  | 'disabled'
  | 'wrong_pin'
  | 'locked'
  | 'not_configured'
  | 'server_error'
  | 'network';

export interface ApiFail {
  ok: false;
  error: ApiError;
  triesLeft?: number;
  waitSec?: number;
}

export type ApiResult<T> = ({ ok: true } & T) | ApiFail;

export async function api<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
    });
    return (await res.json()) as ApiResult<T>;
  } catch {
    return { ok: false, error: 'network' };
  }
}

export function errorText(e: ApiFail): string {
  switch (e.error) {
    case 'bad_handle':
      return 'ชื่อ IG ไม่ถูกต้อง (ใช้ a-z 0-9 . _ เท่านั้น)';
    case 'wrong_pin':
      return `PIN ไม่ถูกต้อง เหลืออีก ${e.triesLeft ?? 0} ครั้ง`;
    case 'locked':
      return `ใส่ PIN ผิดเกินกำหนด รออีก ${e.waitSec ?? 30} วินาที`;
    case 'disabled':
      return 'กิจกรรมปิดอยู่ตอนนี้';
    case 'not_configured':
      return 'ระบบยังไม่พร้อมใช้งาน แจ้งพนักงานได้เลย';
    case 'network':
      return 'ลองใหม่ — สัญญาณอินเทอร์เน็ตมีปัญหา';
    default:
      return 'มีบางอย่างผิดพลาด ลองใหม่อีกครั้ง';
  }
}
