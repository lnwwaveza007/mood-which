import React from 'react';

/** 4-point twinkle star used all over the poster. */
export function Sparkle({ className = '', color = '#FFE83B' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M20 0C21.2 11.5 28.5 18.8 40 20C28.5 21.2 21.2 28.5 20 40C18.8 28.5 11.5 21.2 0 20C11.5 18.8 18.8 11.5 20 0Z"
        fill={color}
      />
    </svg>
  );
}

/** Cartoon "( )" googly eyes that peek over tape labels. */
export function GooglyEyes({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden="true">
      <ellipse cx="17" cy="20" rx="13" ry="18" fill="#fff" stroke="#0D0D0D" strokeWidth="3" />
      <ellipse cx="47" cy="20" rx="13" ry="18" fill="#fff" stroke="#0D0D0D" strokeWidth="3" />
      <ellipse cx="11" cy="21" rx="6" ry="11" fill="#0D0D0D" />
      <ellipse cx="41" cy="21" rx="6" ry="11" fill="#0D0D0D" />
    </svg>
  );
}

/** Yellow starburst: PROMOTION 67.- (2 ชิ้น ปกติ 70.-). Pass `relative` or `absolute` in className. */
export function PromoBurst({ className = 'relative' }: { className?: string }) {
  return (
    <div className={`aspect-square ${className}`}>
      <div className="burst absolute inset-0 bg-yellow" />
      <GooglyEyes className="absolute -top-1 right-1 w-[26%] rotate-6" />
      <div className="relative h-full flex flex-col items-center justify-center text-ink text-center">
        <span className="bg-ink text-white font-label font-semibold text-[0.62em] tracking-wide px-2 py-0.5 -rotate-3">
          PROMOTION
        </span>
        <span className="font-black text-[2.6em] leading-[0.95] tracking-tight mt-1">67.-</span>
        <span className="font-bold text-[0.78em] leading-tight">
          <span className="text-alert">2 ชิ้น</span> ปกติ <span className="line-through">70.-</span>
        </span>
      </div>
    </div>
  );
}

/** Tiny "SECTION 8 · GROUP 8" poster tag. */
export function SectionTag({ className = '' }: { className?: string }) {
  return (
    <span className={`font-label text-[10px] sm:text-xs font-semibold tracking-[0.14em] text-yellow ${className}`}>
      SECTION 8 · GROUP 8
    </span>
  );
}

export function InstagramIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
