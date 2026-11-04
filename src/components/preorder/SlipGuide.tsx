import React from 'react';
import { Check, QrCode, X } from 'lucide-react';

const MUST_SHOW = [
  'สถานะ “สำเร็จ” จากแอปธนาคาร',
  'ยอดเงินตรงกับยอดที่ต้องจ่าย',
  'วันที่และเวลาที่โอน',
  'ชื่อผู้โอนและผู้รับ',
  'เลขที่รายการ',
  'QR ตรวจสอบบนสลิป',
];

const NOT_ACCEPTED = [
  'รูปครอป หรือรูปที่เห็นไม่ครบ',
  'ถ่ายจากจออีกเครื่องจนเบลอ',
  'แคปจากแชต หรือรูปที่ถูกแต่ง',
  'สลิปเก่าที่เคยใช้แล้ว',
];

/** Generic drawing with no bank branding, so nobody can mistake it for a real slip. */
function SampleSlip({ amount }: { amount: number }) {
  return (
    <div className="relative rounded-xl border-2 border-ink bg-white p-3 text-[11px] leading-snug overflow-hidden" aria-hidden="true">
      <p className="absolute right-[-30px] top-3 rotate-45 bg-alert text-white font-bold px-8 text-[10px]">ตัวอย่าง</p>
      <p className="font-bold text-sm text-[#16803c]">✓ โอนเงินสำเร็จ</p>
      <p className="text-ink/60">12 พ.ย. 2569 · 09:41 น.</p>
      <div className="my-2 border-t border-dashed border-ink/30" />
      <p className="text-ink/60">จาก</p>
      <p className="font-semibold">ชื่อผู้โอน</p>
      <p className="mt-1 text-ink/60">ไปยัง</p>
      <p className="font-semibold">ชื่อบัญชีร้าน</p>
      <p className="mt-2 text-ink/60">จำนวนเงิน</p>
      <p className="font-black text-lg leading-none">{amount.toFixed(2)} บาท</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div>
          <p className="text-ink/60">เลขที่รายการ</p>
          <p className="font-semibold">XXXXXXXXXXXX</p>
        </div>
        <QrCode className="w-10 h-10 shrink-0" strokeWidth={1.5} />
      </div>
    </div>
  );
}

export default function SlipGuide({ amount }: { amount: number }) {
  return (
    <details open className="rounded-xl bg-[#f5f5f0] border-2 border-ink/15 p-3">
      <summary className="cursor-pointer font-bold text-sm">สลิปแบบไหนใช้ได้?</summary>
      <p className="mt-2 text-xs text-ink/70">
        ใช้รูปสลิปเต็มใบจากแอปธนาคาร (รูปที่แอปบันทึกให้ หรือแคปหน้าจอหลังโอนสำเร็จ)
      </p>
      <div className="mt-3 grid grid-cols-[minmax(0,9.5rem)_1fr] gap-3 items-start">
        <SampleSlip amount={amount} />
        <div className="text-xs space-y-3 min-w-0">
          <ul className="space-y-1">
            {MUST_SHOW.map((t) => (
              <li key={t} className="flex gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#16803c]" strokeWidth={3} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <ul className="space-y-1">
            {NOT_ACCEPTED.map((t) => (
              <li key={t} className="flex gap-1.5">
                <X className="w-3.5 h-3.5 shrink-0 mt-0.5 text-alert" strokeWidth={3} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}
