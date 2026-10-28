'use client';

import React, { forwardRef } from 'react';
import { BASE_SANDWICH_FILLINGS, MoodProfile } from '@/data/quizData';
import { sandwichMoods, sandwichBackground } from '@/data/sandwich';
import ChibiSticker from './ChibiSticker';
import { Sparkle, GooglyEyes, PromoBurst, InstagramIcon } from './Decor';
import { QRCodeSVG } from 'qrcode.react';

interface StoryCardProps {
  mood: MoodProfile;
  shareUrl?: string;
}

// 450×800 (9:16) poster-style card captured to PNG for IG Story.
export const StoryCard = forwardRef<HTMLDivElement, StoryCardProps>(
  ({ mood, shareUrl = 'https://mood-which.vercel.app' }, ref) => {
    const menuMoods = sandwichMoods(mood);

    return (
      <div
        ref={ref}
        id="story-card"
        style={{ width: '450px', height: '800px' }}
        className="poster-bg relative overflow-hidden flex flex-col px-7 pt-6 pb-6 select-none text-white font-sans"
      >
        {/* Poster top line */}
        <div className="flex items-center justify-between font-label text-[10px] font-semibold tracking-[0.14em] text-yellow">
          <span>SECTION 8 · GROUP 8</span>
          <span className="font-sans tracking-normal">แซนวิชตามอารมณ์</span>
        </div>

        <div className="display-title text-[68px] text-center mt-3">
          <span className="block">MOOD</span>
          <span className="block">WHICH</span>
        </div>

        {/* Chibi + mood name */}
        <div className="relative flex-1 min-h-0 flex flex-col items-center justify-center -mt-2">
          <Sparkle className="absolute left-2 top-6 w-8" />
          <Sparkle className="absolute right-4 top-24 w-5" />
          <div
            className="absolute inset-x-16 top-6 bottom-20 rounded-full blur-3xl opacity-50"
            style={{ background: sandwichBackground(menuMoods) }}
          />
          <ChibiSticker mood={mood.id} heightClass="h-[190px]" forCapture className="relative" />
          <div className="relative -mt-4 flex flex-col items-center">
            <GooglyEyes className="absolute -top-7 -right-6 w-11 rotate-6" />
            <p className="tape text-[26px] -rotate-3">{mood.chibiName}</p>
          </div>
          <p className="mt-2 text-[12px] font-semibold text-white/90">{mood.mixLabelTh}</p>
        </div>

        {/* Menu card */}
        <div className="relative">
          <div
            className="rounded-2xl px-4 py-3 text-ink border-[3px] border-ink"
            style={{ background: sandwichBackground(menuMoods) }}
          >
            <span className="label-chip text-[11px]">เมนูของฉันวันนี้</span>
            <p className="mt-1.5 text-[16px] font-black leading-snug pr-20">{mood.sandwichName}</p>
            {menuMoods.map((m) => (
              <p key={m} className="text-[11px] font-medium leading-snug">
                {BASE_SANDWICH_FILLINGS[m].emoji} {BASE_SANDWICH_FILLINGS[m].nameTh}
              </p>
            ))}
          </div>
          <PromoBurst className="absolute -top-9 -right-4 w-[92px] text-[8px] rotate-12" />
        </div>

        <p className="mt-4 text-[11px] leading-relaxed line-clamp-4">
          <span className="ink-bar">&ldquo;{mood.prophecy}&rdquo;</span>
        </p>

        {/* Footer: QR + IG + date */}
        <div className="mt-4 flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg border-2 border-ink flex-shrink-0">
            <QRCodeSVG value={shareUrl} size={52} level="M" fgColor="#0D0D0D" bgColor="#FFFFFF" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-tape text-yellow text-[12px] leading-tight">สแกนหาแซนวิชตามอารมณ์คุณ</p>
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-yellow text-[11px] font-semibold">
              <InstagramIcon className="w-3.5 h-3.5 text-white" />
              @moodwhich.kmuttnative
            </p>
          </div>
          <div className="text-right leading-none">
            <p className="display-title text-[30px]">12</p>
            <p className="display-title text-[22px]">NOV</p>
            <p className="text-[9px] font-bold mt-1">9.30-12.00</p>
          </div>
        </div>
      </div>
    );
  }
);

StoryCard.displayName = 'StoryCard';
export default StoryCard;
