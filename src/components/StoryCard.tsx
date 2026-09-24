'use client';

import React, { forwardRef } from 'react';
import { MoodProfile } from '@/data/quizData';
import SandwichIllustration from './SandwichIllustration';
import { QRCodeSVG } from 'qrcode.react';
import { Sparkles, Heart, Zap, Utensils } from 'lucide-react';

interface StoryCardProps {
  mood: MoodProfile;
  shareUrl?: string;
}

export const StoryCard = forwardRef<HTMLDivElement, StoryCardProps>(
  ({ mood, shareUrl = 'https://mood-which.vercel.app' }, ref) => {
    return (
      <div
        ref={ref}
        id="story-card"
        style={{
          width: '450px',
          height: '800px',
          backgroundColor: mood.secondaryColor,
        }}
        className="relative overflow-hidden flex flex-col justify-between p-6 select-none text-white shadow-2xl font-sans rounded-none"
      >
        {/* Background ambient glow */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-60 pointer-events-none"
          style={{ backgroundColor: mood.primaryColor }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full blur-3xl opacity-50 pointer-events-none"
          style={{ backgroundColor: mood.primaryColor }}
        />

        {/* Corner Accents */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/30 rounded-tl pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/30 rounded-tr pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/30 rounded-bl pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/30 rounded-br pointer-events-none" />

        {/* --- HEADER --- */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-2.5">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold shadow-xs text-sm"
              style={{ backgroundColor: mood.accentColor }}
            >
              ✨
            </div>
            <div>
              <h4 className="text-xs font-extrabold tracking-wider uppercase text-white">
                12 MOOD CHIBI × SANDWICH
              </h4>
              <p className="text-[9.5px] text-white/50 font-medium">
                Mood W(h)ich Quiz
              </p>
            </div>
          </div>
          <div
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-xs border"
            style={{
              backgroundColor: mood.primaryColor,
              color: '#18181B',
              borderColor: mood.accentColor,
            }}
          >
            <Sparkles className="w-3 h-3 text-zinc-900" />
            <span>{mood.titleEn}</span>
          </div>
        </div>

        {/* --- MAIN CONTENT & CHIBI MASCOT --- */}
        <div className="relative z-10 flex flex-col items-center text-center my-auto">
          {/* Chibi Character Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D0D0D]/70 backdrop-blur-md shadow-xs border border-[#FFE94D]/30 mb-1">
            <span className="text-sm">{mood.emoji}</span>
            <span className="text-xs font-bold text-[#FFE94D]">
              {mood.mixLabelTh}
            </span>
          </div>

          {/* Chibi Character Name */}
          <h2 className="text-2xl font-black text-white leading-tight tracking-tight mt-0.5">
            {mood.chibiName}
          </h2>
          <p className="text-[11px] font-bold text-zinc-600 tracking-wide" style={{ color: mood.accentColor }}>
            {mood.chibiTitle}
          </p>

          {/* Chibi Mascot Illustration */}
          <div className="my-1 transform transition-transform hover:scale-105 duration-300">
            <SandwichIllustration mood={mood.id} size="story" />
          </div>

          {/* Sandwich Duo Match Order Callout */}
          <div className="w-full bg-[#0D0D0D]/50 backdrop-blur-md rounded-2xl p-2.5 shadow-sm border border-[#FFE94D]/30 text-left mb-2">
            <div className="flex items-center gap-1 text-[10.5px] font-black text-[#FFE94D] mb-0.5">
              <Utensils className="w-3 h-3 text-[#FFE94D]" />
              <span>เมนูแซนด์วิชที่ตรงกับ Chibi ของคุณ:</span>
            </div>
            <p className="text-[11px] font-bold text-white pl-1">
              🥪 {mood.sandwichPairingTip}
            </p>
          </div>

          {/* Prophecy / Daily Fortune Card */}
          <div className="w-full bg-[#0D0D0D]/50 backdrop-blur-md rounded-2xl p-3 shadow-sm border border-white/15 text-left relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-1.5 h-full"
              style={{ backgroundColor: mood.primaryColor }}
            />
            <div className="flex items-center gap-1.5 mb-0.5 text-[10.5px] font-bold text-[#FFE94D]">
              <Sparkles className="w-3 h-3 text-[#FFE94D]" />
              <span>คำทำนายประจำวันของคุณ ✨</span>
            </div>
            <p className="text-[11px] text-white/80 font-normal leading-relaxed pl-1">
              &ldquo;{mood.prophecy}&rdquo;
            </p>
          </div>

          {/* Energy & Comfort Stats Bar */}
          <div className="grid grid-cols-2 gap-2 w-full mt-2">
            <div className="bg-[#0D0D0D]/40 backdrop-blur-xs rounded-xl p-1.5 border border-white/10 flex items-center gap-2">
              <div className="p-1 rounded-lg bg-[#FFE94D]/20 text-[#FFE94D]">
                <Zap className="w-3 h-3" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between text-[8.5px] font-bold text-white/70">
                  <span>พลังงาน (Energy)</span>
                  <span>{mood.energyLevel}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${mood.energyLevel}%`, backgroundColor: mood.primaryColor }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#0D0D0D]/40 backdrop-blur-xs rounded-xl p-1.5 border border-white/10 flex items-center gap-2">
              <div className="p-1 rounded-lg bg-[#E5322D]/20 text-[#E5322D]">
                <Heart className="w-3 h-3" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between text-[8.5px] font-bold text-white/70">
                  <span>ความฮีลใจ (Comfort)</span>
                  <span>{mood.comfortLevel}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${mood.comfortLevel}%`, backgroundColor: mood.accentColor }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER & QR CODE --- */}
        <div className="relative z-10 bg-[#0D0D0D]/60 backdrop-blur-md rounded-2xl p-2.5 flex items-center justify-between border border-[#FFE94D]/20 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="bg-white p-1 rounded-xl shadow-xs border border-[#FFE94D]/30 flex-shrink-0">
              <QRCodeSVG
                value={shareUrl}
                size={44}
                level="M"
                fgColor="#18181B"
                bgColor="#FFFFFF"
              />
            </div>
            <div className="text-left">
              <p className="text-[10.5px] font-black text-white tracking-tight flex items-center gap-1">
                <span>สแกนค้นหา Chibi ของคุณ</span>
                <span className="text-[10px]">👉</span>
              </p>
              <p className="text-[9px] text-white/50 font-medium leading-tight">
                เล่นฟรีได้ที่: mood-which.vercel.app
              </p>
              <p className="text-[8.5px] text-[#FFE94D] font-bold mt-0.5">
                {mood.hashtag}
              </p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="text-[8.5px] uppercase tracking-wider font-extrabold text-white/40">
              CHIBI EDITION
            </span>
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-xs mt-0.5"
              style={{ backgroundColor: mood.accentColor }}
            >
              ★
            </div>
          </div>
        </div>
      </div>
    );
  }
);

StoryCard.displayName = 'StoryCard';
export default StoryCard;
