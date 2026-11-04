import { FundamentalMood } from '@/data/quizData';

// Facts shared by the page and the server. Change the sale rules here.

/** Orders close at this moment (Thailand time); everything is sent on event day. */
export const PREORDER_DEADLINE = Date.parse('2026-11-11T23:59:59+07:00');
export const DEADLINE_LABEL = '11 พ.ย. 2569 เวลา 23.59 น.';

export const EVENT_DATE = '12 พ.ย. 2569';
export const EVENT_TIME = '9.30 – 12.00 น.';
export const EVENT_PLACE = 'ชั้น 1 ตึกศิลปศาสตร์ · KMUTT';

export const UNIT_PRICE = 35;
/** A piece with any of these fillings (full or MIX) costs PREMIUM_PRICE instead of UNIT_PRICE. */
export const PREMIUM_MOODS: FundamentalMood[] = ['angry'];
export const PREMIUM_PRICE = 40;
export const MAX_PIECES_PER_ORDER = 20;

const dev = process.env.NODE_ENV !== 'production';

/** PromptPay phone or ID. The dev fallback only makes the QR render on localhost. */
export const PROMPTPAY_ID = process.env.NEXT_PUBLIC_PROMPTPAY_ID ?? (dev ? '0000000000' : '');
export const PROMPTPAY_NAME = process.env.NEXT_PUBLIC_PROMPTPAY_NAME ?? (dev ? 'บัญชีทดสอบ' : '');
export const PAYMENT_IS_TEST = !process.env.NEXT_PUBLIC_PROMPTPAY_ID;

export const MOODS: FundamentalMood[] = ['happy', 'boring', 'angry', 'sad'];

/** One sandwich is two halves. Same filling twice = a full piece, two fillings = a MIX piece. */
export const FILLING_SHORT: Record<FundamentalMood, string> = {
  happy: 'หมูหยอง',
  boring: 'ไข่คน + ปูอัด',
  angry: 'ไก่ป๊อป',
  sad: 'ทูน่า',
};

/** Order id for two halves. The order of the halves does not matter, so it is always the menu order. */
export function pieceId(a: FundamentalMood, b: FundamentalMood): string {
  if (a === b) return a;
  return MOODS.indexOf(a) < MOODS.indexOf(b) ? `${a}+${b}` : `${b}+${a}`;
}

export interface MenuItem {
  id: string;
  moods: FundamentalMood[];
  isMix: boolean;
  /** Food names, e.g. "หมูหยอง ทั้งชิ้น" or "หมูหยอง + ไก่ป๊อป". Shown to customers and staff. */
  title: string;
}

export const MENU: MenuItem[] = MOODS.flatMap((a, i) => [
  { id: a, moods: [a], isMix: false, title: `${FILLING_SHORT[a]} ทั้งชิ้น` },
  ...MOODS.slice(i + 1).map((b) => ({
    id: pieceId(a, b),
    moods: [a, b],
    isMix: true,
    title: `${FILLING_SHORT[a]} กับ ${FILLING_SHORT[b]}`,
  })),
]);

export const itemById = (id: string) => MENU.find((m) => m.id === id);

export type Cart = Record<string, number>;

export const countPieces = (cart: Cart) => Object.values(cart).reduce((sum, n) => sum + n, 0);

export const unitPrice = (moods: FundamentalMood[]) => (moods.some((m) => PREMIUM_MOODS.includes(m)) ? PREMIUM_PRICE : UNIT_PRICE);

/** Order total: every piece at its own price, no bundle discount. */
export const priceFor = (cart: Cart) =>
  Object.entries(cart).reduce((sum, [id, qty]) => sum + qty * unitPrice(itemById(id)?.moods ?? []), 0);
