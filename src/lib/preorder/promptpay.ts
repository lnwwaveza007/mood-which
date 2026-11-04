// Thai QR (EMVCo) payload for PromptPay, with the amount filled in for the customer.

const tag = (id: string, value: string) => `${id}${String(value.length).padStart(2, '0')}${value}`;

/** CRC-16/CCITT-FALSE, the checksum the Thai QR standard requires. */
export function crc16(text: string): string {
  let crc = 0xffff;
  for (let i = 0; i < text.length; i++) {
    crc ^= text.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/** Returns null when `id` is not a phone (10 digits), national/tax ID (13) or e-wallet (15). */
export function promptpayPayload(id: string, amount?: number): string | null {
  const digits = id.replace(/\D/g, '');
  let target: string;
  if (digits.length === 10 && digits.startsWith('0')) target = tag('01', `0066${digits.slice(1)}`);
  else if (digits.length === 13) target = tag('02', digits);
  else if (digits.length === 15) target = tag('03', digits);
  else return null;

  const body =
    tag('00', '01') +
    tag('01', amount ? '12' : '11') +
    tag('29', tag('00', 'A000000677010111') + target) +
    tag('58', 'TH') +
    tag('53', '764') +
    (amount ? tag('54', amount.toFixed(2)) : '') +
    '6304';
  return body + crc16(body);
}
