'use client';

import React from 'react';
import { motion } from 'framer-motion';

// 8 slots: 2 prize slots + 6 "thanks" slots. The server decides the result first;
// the wheel then spins to a random slot of that type.
export const SLOTS: { prize: boolean; lines: string[]; fill: string }[] = [
  { prize: false, lines: ['ขอบคุณ', 'ที่แชร์'], fill: '#8EB2D9' },
  { prize: true, lines: ['ครึ่งชิ้น', 'ฟรี!'], fill: '#FFE83B' },
  { prize: false, lines: ['ลุ้นใหม่', 'คราวหน้า'], fill: '#7ED957' },
  { prize: false, lines: ['เกือบ', 'แล้ว!'], fill: '#FF8BAE' },
  { prize: false, lines: ['ขอบคุณ', 'ที่แท็ก'], fill: '#8EB2D9' },
  { prize: true, lines: ['ครึ่งชิ้น', 'ฟรี!'], fill: '#FFE83B' },
  { prize: false, lines: ['แวะมา', 'ใหม่นะ'], fill: '#7ED957' },
  { prize: false, lines: ['ขอบคุณ', 'นะ'], fill: '#FF8BAE' },
];

const STEP = 360 / SLOTS.length;
const R = 108;

const pt = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(r * Math.sin(a)).toFixed(2)} ${(-r * Math.cos(a)).toFixed(2)}`;
};

/** Random slot index of the wanted type. */
export function pickSlot(win: boolean): number {
  const pool = SLOTS.map((s, i) => (s.prize === win ? i : -1)).filter((i) => i >= 0);
  return pool[Math.floor(Math.random() * pool.length)];
}

interface WheelProps {
  /** Total rotation in degrees (monotonic: keep adding to it to spin again). */
  rotation: number;
  durationSec: number;
}

/** Rotation that leaves slot `index` under the pointer at the top, after at least 5 full turns. */
export function rotationFor(index: number, current: number): number {
  const jitter = (Math.random() - 0.5) * (STEP * 0.6);
  const base = current - (current % 360) + 360 * 6;
  return base + (360 - index * STEP) + jitter;
}

export default function Wheel({ rotation, durationSec }: WheelProps) {
  return (
    <div className="relative mx-auto w-[min(78vw,20rem)] aspect-square">
      {/* pointer */}
      <svg viewBox="0 0 40 40" className="absolute left-1/2 -top-3 z-10 w-9 -translate-x-1/2 drop-shadow" aria-hidden="true">
        <path d="M20 38 L4 6 Q20 -2 36 6 Z" fill="#E5322D" stroke="#0D0D0D" strokeWidth="3" strokeLinejoin="round" />
      </svg>

      <motion.div
        className="w-full h-full"
        animate={{ rotate: rotation }}
        transition={{ duration: durationSec, ease: [0.12, 0.7, 0.1, 1] }}
      >
        <svg viewBox="-118 -118 236 236" className="w-full h-full" role="img" aria-label="วงล้อลุ้นรางวัล">
          <circle r="116" fill="#0D0D0D" />
          {SLOTS.map((slot, i) => {
            const a0 = i * STEP - STEP / 2;
            const a1 = i * STEP + STEP / 2;
            return (
              <g key={i}>
                <path
                  d={`M0 0 L${pt(a0, R)} A${R} ${R} 0 0 1 ${pt(a1, R)} Z`}
                  fill={slot.fill}
                  stroke="#0D0D0D"
                  strokeWidth="2"
                />
                <g transform={`rotate(${i * STEP})`}>
                  {slot.lines.map((line, k) => (
                    <text
                      key={k}
                      y={-78 + k * 13}
                      textAnchor="middle"
                      fontSize={slot.prize ? 12 : 10.5}
                      fontWeight={800}
                      fill="#0D0D0D"
                      fontFamily="var(--font-kanit), sans-serif"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              </g>
            );
          })}
          <circle r="16" fill="#FFE83B" stroke="#0D0D0D" strokeWidth="3" />
          <path
            d="M0 -9C.7-3.5 3.5-.7 9 0C3.5.7.7 3.5 0 9C-.7 3.5-3.5.7-9 0C-3.5-.7-.7-3.5 0-9Z"
            fill="#0D0D0D"
          />
        </svg>
      </motion.div>
    </div>
  );
}
