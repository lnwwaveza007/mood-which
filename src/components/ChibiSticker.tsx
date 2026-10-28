import React from 'react';
import Image from 'next/image';
import { FundamentalMood, MOOD_PROFILES, MoodType } from '@/data/quizData';

// Hand-drawn chibi stickers (yellow outline baked in), one per fundamental mood.
export const CHIBI_ART: Record<FundamentalMood, { src: string; width: number; height: number; alt: string }> = {
  happy: { src: '/chibi/happy.webp', width: 464, height: 910, alt: 'ชิบิอารมณ์มีความสุข โบกมือยิ้มแฉ่ง' },
  boring: { src: '/chibi/boring.webp', width: 407, height: 910, alt: 'ชิบิอารมณ์เฉย ๆ สาวแว่นหน้านิ่ง' },
  angry: { src: '/chibi/angry.webp', width: 457, height: 910, alt: 'ชิบิอารมณ์โกรธ กอดอกหน้างอ' },
  sad: { src: '/chibi/sad.webp', width: 396, height: 910, alt: 'ชิบิอารมณ์เศร้า หลับตาถอนหายใจ' },
};

const TILTS = ['-rotate-6', 'rotate-6', '-rotate-3'];

interface ChibiStickerProps {
  /** A result mood (draws every chibi in its mix) or explicit fundamentals. */
  mood?: MoodType;
  moods?: FundamentalMood[];
  /** Tailwind height class for each chibi, e.g. "h-56". */
  heightClass?: string;
  float?: boolean;
  eager?: boolean;
  /** Story card capture (html-to-image): raw files and no CSS filter, both turn into black boxes otherwise. */
  forCapture?: boolean;
  className?: string;
}

export default function ChibiSticker({
  mood,
  moods,
  heightClass = 'h-56',
  float = false,
  eager = false,
  forCapture = false,
  className = '',
}: ChibiStickerProps) {
  const list = moods ?? (mood ? MOOD_PROFILES[mood].fundamentalMix : []);

  return (
    <div className={`flex items-end justify-center ${className}`}>
      {list.map((m, i) => {
        const art = CHIBI_ART[m];
        return (
          <div
            key={m}
            className={`${list.length > 1 ? TILTS[i % TILTS.length] : ''} ${i > 0 ? '-ml-[12%]' : ''} ${
              float ? 'animate-float' : ''
            }`}
            style={float ? { animationDelay: `${i * 0.6}s` } : undefined}
          >
            <Image
              src={art.src}
              alt={art.alt}
              width={art.width}
              height={art.height}
              loading={eager || forCapture ? 'eager' : 'lazy'}
              unoptimized={forCapture}
              sizes="(max-width: 640px) 40vw, 240px"
              className={`${heightClass} w-auto select-none ${forCapture ? '' : 'drop-shadow-[0_10px_18px_rgba(0,0,0,0.25)]'}`}
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
}
