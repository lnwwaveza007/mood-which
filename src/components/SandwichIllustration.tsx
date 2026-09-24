'use client';

import React from 'react';
import { MoodType } from '@/data/quizData';

interface ChibiIllustrationProps {
  mood: MoodType;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'story';
}

export default function SandwichIllustration({
  mood,
  className = '',
  size = 'md',
}: ChibiIllustrationProps) {
  // Dimensions & scale helper
  const sizeMap = {
    sm: 'w-28 h-28',
    md: 'w-48 h-48 sm:w-56 sm:h-56',
    lg: 'w-64 h-64 sm:w-72 sm:h-72',
    story: 'w-72 h-72',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl select-none"
      >
        <defs>
          {/* Universal Shadow */}
          <radialGradient id="chibiShadow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#000000" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Gradients for 12 Chibis */}
          {/* 1. Sunny */}
          <linearGradient id="sunnyBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF066" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="sunnyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.15" />
          </linearGradient>

          {/* 2. Boro */}
          <linearGradient id="boroBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EFE8DD" />
            <stop offset="100%" stopColor="#B5A895" />
          </linearGradient>

          {/* 3. Fury */}
          <linearGradient id="furyBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>

          {/* 4. Gloomy */}
          <linearGradient id="gloomyBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* 5. Nubi */}
          <linearGradient id="nubiBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* 6. Ignis */}
          <linearGradient id="ignisBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          {/* 7. Aura */}
          <linearGradient id="auraBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>

          {/* 8. Grumby */}
          <linearGradient id="grumbyBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* 9. Sprout */}
          <linearGradient id="sproutBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* 10. Roxy */}
          <linearGradient id="roxyBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BE185D" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>

          {/* 11. Zenith */}
          <linearGradient id="zenithBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BEF264" />
            <stop offset="100%" stopColor="#65A30D" />
          </linearGradient>

          {/* 12. Mischief */}
          <linearGradient id="mischiefBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D8B4FE" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="160" cy="275" rx="90" ry="24" fill="url(#chibiShadow)" />

        {/* ========================================================= */}
        {/* 1. SUNNY (น้องซันนี่ - The Joyful Spark) */}
        {/* ========================================================= */}
        {mood === 'happy' && (
          <g>
            {/* 1. Background Sun Rays Halo */}
            <circle cx="160" cy="118" r="82" fill="url(#sunnyGlow)" />
            <path d="M 160 25 L 163 40 L 160 45 L 157 40 Z" fill="#F59E0B" />
            <path d="M 235 55 L 222 65 L 220 60 L 228 50 Z" fill="#F59E0B" />
            <path d="M 260 120 L 245 123 L 240 120 L 245 117 Z" fill="#F59E0B" />
            <path d="M 85 55 L 98 65 L 100 60 L 92 50 Z" fill="#F59E0B" />
            <path d="M 60 120 L 75 123 L 80 120 L 75 117 Z" fill="#F59E0B" />

            {/* 2. BODY (Behind Head) */}
            <path d="M 102 245 C 95 185, 102 145, 160 145 C 218 145, 225 185, 218 245 C 218 262, 102 262, 102 245 Z" fill="url(#sunnyBody)" stroke="#D97706" strokeWidth="4" />

            {/* 3. HEAD (In Front of Body) */}
            <circle cx="160" cy="118" r="54" fill="url(#sunnyBody)" stroke="#D97706" strokeWidth="4" />

            {/* 4. Hair & Face Features */}
            <path d="M 160 64 Q 175 42 190 58 Q 175 58 160 64 Z" fill="#F59E0B" />
            <ellipse cx="128" cy="132" rx="9" ry="5" fill="#F43F5E" opacity="0.65" />
            <ellipse cx="192" cy="132" rx="9" ry="5" fill="#F43F5E" opacity="0.65" />

            {/* Eyes */}
            <ellipse cx="135" cy="114" rx="8" ry="12" fill="#1C1917" />
            <circle cx="133" cy="109" r="4" fill="#FFFFFF" />
            <circle cx="137" cy="119" r="2" fill="#FFFFFF" />
            <ellipse cx="185" cy="114" rx="8" ry="12" fill="#1C1917" />
            <circle cx="183" cy="109" r="4" fill="#FFFFFF" />
            <circle cx="187" cy="119" r="2" fill="#FFFFFF" />

            {/* Smile */}
            <path d="M 150 126 Q 160 142 170 126 Z" fill="#BE123C" stroke="#881337" strokeWidth="1.5" />
            <path d="M 154 135 Q 160 141 166 135" fill="#FB7185" />

            {/* 5. Sandwich Held in Front */}
            <g transform="translate(125, 195) scale(0.65)">
              <rect x="0" y="25" width="110" height="20" rx="6" fill="#FDE047" stroke="#D97706" strokeWidth="3" />
              <rect x="5" y="15" width="100" height="12" rx="4" fill="#FB7185" />
              <rect x="0" y="0" width="110" height="20" rx="8" fill="#FDE047" stroke="#D97706" strokeWidth="3" />
            </g>
          </g>
        )}

        {/* ========================================================= */}
        {/* 2. BORO (น้องโบโร่ - The Mundane Sloth) */}
        {/* ========================================================= */}
        {mood === 'boring' && (
          <g>
            {/* 1. Background Ears & Zzz */}
            <circle cx="112" cy="80" r="14" fill="#A89F91" stroke="#786B59" strokeWidth="3" />
            <circle cx="208" cy="80" r="14" fill="#A89F91" stroke="#786B59" strokeWidth="3" />
            <text x="220" y="78" fill="#A89F91" fontSize="18" fontWeight="bold">Z</text>
            <text x="235" y="63" fill="#A89F91" fontSize="14" fontWeight="bold">z</text>

            {/* 2. BODY (Behind Head) */}
            <path d="M 98 245 C 90 185, 98 145, 160 145 C 222 145, 230 185, 222 245 C 222 265, 98 265, 98 245 Z" fill="url(#boroBody)" stroke="#786B59" strokeWidth="4" />

            {/* 3. HEAD (In Front of Body) */}
            <circle cx="160" cy="118" r="54" fill="url(#boroBody)" stroke="#786B59" strokeWidth="4" />

            {/* 4. Face Features */}
            <ellipse cx="132" cy="116" rx="14" ry="11" fill="#C7BDB0" />
            <ellipse cx="188" cy="116" rx="14" ry="11" fill="#C7BDB0" />
            <path d="M 124 116 Q 132 122 140 116" stroke="#44403C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 180 116 Q 188 122 196 116" stroke="#44403C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <ellipse cx="160" cy="124" rx="4" ry="3" fill="#786B59" />
            <line x1="154" y1="132" x2="166" y2="132" stroke="#44403C" strokeWidth="2.5" strokeLinecap="round" />

            {/* 5. Sandwich Held in Front */}
            <g transform="translate(125, 195) scale(0.65)">
              <rect x="0" y="20" width="110" height="25" rx="6" fill="#E8DCB8" stroke="#786B59" strokeWidth="3" />
              <rect x="30" y="12" width="50" height="10" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
              <circle cx="85" cy="12" r="10" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            </g>
          </g>
        )}

        {/* ========================================================= */}
        {/* 3. FURY (น้องฟิวรี่ - The Fiery Fighter) */}
        {/* ========================================================= */}
        {mood === 'angry' && (
          <g>
            {/* 1. Background Sparks & Flames */}
            <path d="M 75 85 L 85 90 L 75 95 L 80 87 Z" fill="#F59E0B" />
            <path d="M 245 85 L 235 90 L 245 95 L 240 87 Z" fill="#F59E0B" />
            <path d="M 130 68 Q 120 35 135 25 Q 145 45 140 68 Z" fill="#F59E0B" />
            <path d="M 190 68 Q 200 35 185 25 Q 175 45 180 68 Z" fill="#F59E0B" />
            <path d="M 160 58 Q 160 25 150 15 Q 170 30 160 58 Z" fill="#E11D48" />

            {/* 2. BODY (Behind Head) */}
            <path d="M 102 245 C 95 185, 102 145, 160 145 C 218 145, 225 185, 218 245 C 218 262, 102 262, 102 245 Z" fill="url(#furyBody)" stroke="#9F1239" strokeWidth="4" />

            {/* 3. HEAD (In Front of Body) */}
            <circle cx="160" cy="118" r="54" fill="url(#furyBody)" stroke="#9F1239" strokeWidth="4" />

            {/* 4. Face Features */}
            <line x1="125" y1="98" x2="148" y2="108" stroke="#4C0519" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="195" y1="98" x2="172" y2="108" stroke="#4C0519" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="138" cy="116" r="8" fill="#1C1917" />
            <circle cx="136" cy="113" r="3" fill="#FFFFFF" />
            <circle cx="182" cy="116" r="8" fill="#1C1917" />
            <circle cx="180" cy="113" r="3" fill="#FFFFFF" />
            <path d="M 150 134 Q 160 126 170 134" stroke="#4C0519" strokeWidth="3.5" strokeLinecap="round" fill="none" />

            {/* 5. Sandwich Held in Front */}
            <g transform="translate(125, 195) scale(0.65)">
              <rect x="0" y="20" width="110" height="25" rx="6" fill="#FB7185" stroke="#9F1239" strokeWidth="3" />
              <rect x="5" y="10" width="100" height="14" rx="4" fill="#991B1B" />
              <circle cx="45" cy="15" r="6" fill="#16A34A" />
              <circle cx="75" cy="15" r="6" fill="#16A34A" />
            </g>
          </g>
        )}

        {/* ========================================================= */}
        {/* 4. GLOOMY (น้องกลูมมี่ - The Melancholy Hug) */}
        {/* ========================================================= */}
        {mood === 'sad' && (
          <g>
            {/* 1. Background Moon & Drops */}
            <path d="M 215 45 A 15 15 0 1 0 235 65 A 12 12 0 1 1 215 45 Z" fill="#94A3B8" opacity="0.8" />
            <circle cx="75" cy="65" r="3" fill="#60A5FA" opacity="0.7" />
            <circle cx="85" cy="80" r="2.5" fill="#60A5FA" opacity="0.7" />

            {/* 2. BODY (Behind Head) */}
            <path d="M 102 245 C 95 185, 102 145, 160 145 C 218 145, 225 185, 218 245 C 218 262, 102 262, 102 245 Z" fill="url(#gloomyBody)" stroke="#1E293B" strokeWidth="4" />

            {/* 3. HEAD (In Front of Body) */}
            <circle cx="160" cy="118" r="54" fill="url(#gloomyBody)" stroke="#1E293B" strokeWidth="4" />

            {/* 4. Face Features */}
            <ellipse cx="135" cy="112" rx="10" ry="13" fill="#0F172A" />
            <circle cx="132" cy="106" r="5" fill="#60A5FA" />
            <circle cx="137" cy="116" r="2.5" fill="#FFFFFF" />
            <ellipse cx="185" cy="112" rx="10" ry="13" fill="#0F172A" />
            <circle cx="182" cy="106" r="5" fill="#60A5FA" />
            <circle cx="187" cy="116" r="2.5" fill="#FFFFFF" />
            <path d="M 125 122 C 122 129, 128 134, 128 129 Z" fill="#60A5FA" />
            <path d="M 152 134 Q 160 128 168 134" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* 5. Sandwich Held in Front */}
            <g transform="translate(125, 195) scale(0.65)">
              <rect x="0" y="20" width="110" height="25" rx="6" fill="#334155" stroke="#0F172A" strokeWidth="3" />
              <rect x="5" y="12" width="100" height="12" rx="4" fill="#FEF08A" />
              <ellipse cx="55" cy="15" rx="8" ry="5" fill="#44403C" />
            </g>
          </g>
        )}

        {/* ========================================================= */}
        {/* 5. NUBI (น้องนูบิ - The Floating Cloud) */}
        {/* ========================================================= */}
        {mood === 'chill' && (
          <g>
            {/* 1. Background Cloud Puffs */}
            <circle cx="110" cy="95" r="22" fill="#E0F2FE" />
            <circle cx="210" cy="95" r="22" fill="#E0F2FE" />
            <circle cx="160" cy="65" r="25" fill="#E0F2FE" />

            {/* 2. BODY (Behind Head) */}
            <path d="M 102 245 C 95 185, 102 145, 160 145 C 218 145, 225 185, 218 245 C 218 262, 102 262, 102 245 Z" fill="url(#nubiBody)" stroke="#0284C7" strokeWidth="4" />

            {/* 3. HEAD (In Front of Body) */}
            <circle cx="160" cy="118" r="54" fill="url(#nubiBody)" stroke="#0284C7" strokeWidth="4" />

            {/* 4. Face Features */}
            <path d="M 126 112 Q 136 102 146 112" stroke="#0369A1" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 174 112 Q 184 102 194 112" stroke="#0369A1" strokeWidth="4" strokeLinecap="round" fill="none" />
            <ellipse cx="128" cy="124" rx="8" ry="4" fill="#38BDF8" opacity="0.6" />
            <ellipse cx="192" cy="124" rx="8" ry="4" fill="#38BDF8" opacity="0.6" />
            <path d="M 152 124 Q 160 132 168 124" stroke="#0369A1" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* 5. Duo Sandwich Held in Front */}
            <g transform="translate(125, 195) scale(0.65)">
              <rect x="0" y="15" width="50" height="25" rx="5" fill="#FDE047" stroke="#D97706" strokeWidth="2.5" />
              <rect x="58" y="15" width="50" height="25" rx="5" fill="#E8DCB8" stroke="#786B59" strokeWidth="2.5" />
            </g>
          </g>
        )}

        {/* ========================================================= */}
        {/* 6. IGNIS (น้องอิกนิส - The Hyper Dynamo) */}
        {/* ========================================================= */}
        {mood === 'passionate' && (
          <g>
            {/* 1. Background Ears & Sparks */}
            <circle cx="115" cy="75" r="14" fill="#F97316" stroke="#C2410C" strokeWidth="3" />
            <circle cx="205" cy="75" r="14" fill="#F97316" stroke="#C2410C" strokeWidth="3" />

            {/* 2. BODY (Behind Head) */}
            <path d="M 102 245 C 95 185, 102 145, 160 145 C 218 145, 225 185, 218 245 C 218 262, 102 262, 102 245 Z" fill="url(#ignisBody)" stroke="#C2410C" strokeWidth="4" />

            {/* 3. HEAD (In Front of Body) */}
            <circle cx="160" cy="118" r="54" fill="url(#ignisBody)" stroke="#C2410C" strokeWidth="4" />

            {/* 4. Headband & Face Features */}
            <rect x="106" y="80" width="108" height="14" rx="6" fill="#EA580C" />
            <path d="M 155 73 L 165 87 L 158 88 L 168 100 L 160 91 L 166 89 Z" fill="#FEF08A" />

            {/* Starry Eyes */}
            <polygon points="135,102 138,110 146,110 140,115 142,123 135,118 128,123 130,115 124,110 132,110" fill="#1C1917" />
            <polygon points="185,102 188,110 196,110 190,115 192,123 185,118 178,123 180,115 174,110 182,110" fill="#1C1917" />
            <path d="M 150 128 Q 160 142 170 128 Z" fill="#991B1B" />

            {/* 5. Duo Sandwich Held in Front */}
            <g transform="translate(125, 195) scale(0.65)">
              <rect x="0" y="15" width="50" height="25" rx="5" fill="#FDE047" stroke="#D97706" strokeWidth="2.5" />
              <rect x="58" y="15" width="50" height="25" rx="5" fill="#FB7185" stroke="#9F1239" strokeWidth="2.5" />
            </g>
          </g>
        )}

        {/* ========================================================= */}
        {/* 7. AURA (น้องออร่า - The Nostalgic Dreamer) */}
        {/* ========================================================= */}
        {mood === 'bittersweet' && (
          <g>
            {/* 1. Background Leaves */}
            <path d="M 130 70 Q 120 55 135 55 Q 140 65 130 70 Z" fill="#F43F5E" />
            <path d="M 160 60 Q 160 45 170 50 Q 170 60 160 60 Z" fill="#FB923C" />
            <path d="M 190 70 Q 200 55 185 55 Q 180 65 190 70 Z" fill="#F43F5E" />

            {/* 2. BODY (Behind Head) */}
            <path d="M 102 245 C 95 185, 102 145, 160 145 C 218 145, 225 185, 218 245 C 218 262, 102 262, 102 245 Z" fill="url(#auraBody)" stroke="#BE123C" strokeWidth="4" />

            {/* 3. HEAD (In Front of Body) */}
            <circle cx="160" cy="118" r="54" fill="url(#auraBody)" stroke="#BE123C" strokeWidth="4" />

            {/* 4. Face Features */}
            <ellipse cx="135" cy="112" rx="8" ry="11" fill="#4C0519" />
            <circle cx="133" cy="107" r="3.5" fill="#FFF1F2" />
            <ellipse cx="185" cy="112" rx="8" ry="11" fill="#4C0519" />
            <circle cx="183" cy="107" r="3.5" fill="#FFF1F2" />
            <path d="M 152 126 Q 160 134 168 126" stroke="#881337" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* 5. Duo Sandwich Held in Front */}
            <g transform="translate(125, 195) scale(0.65)">
              <rect x="0" y="15" width="50" height="25" rx="5" fill="#FDE047" stroke="#D97706" strokeWidth="2.5" />
              <rect x="58" y="15" width="50" height="25" rx="5" fill="#334155" stroke="#0F172A" strokeWidth="2.5" />
            </g>
          </g>
        )}

        {/* ========================================================= */}
        {/* 8. GRUMBY (น้องกรัมบี้ - The Spicy Sceptic) */}
        {/* ========================================================= */}
        {mood === 'frustrated' && (
          <g>
            {/* 1. BODY (Behind Head) */}
            <path d="M 102 245 C 95 185, 102 145, 160 145 C 218 145, 225 185, 218 245 C 218 262, 102 262, 102 245 Z" fill="url(#grumbyBody)" stroke="#B45309" strokeWidth="4" />

            {/* 2. HEAD (In Front of Body) */}
            <circle cx="160" cy="118" r="54" fill="url(#grumbyBody)" stroke="#B45309" strokeWidth="4" />

            {/* 3. Puffed-up Cheeks & Face Features */}
            <ellipse cx="118" cy="126" rx="12" ry="7" fill="#F59E0B" />
            <ellipse cx="202" cy="126" rx="12" ry="7" fill="#F59E0B" />
            <path d="M 126 106 L 144 110" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <circle cx="136" cy="114" r="5" fill="#451A03" />
            <path d="M 194 106 L 176 110" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <circle cx="184" cy="114" r="5" fill="#451A03" />
            <path d="M 150 130 Q 155 126 160 130 Q 165 134 170 130" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* 4. Duo Sandwich Held in Front */}
            <g transform="translate(125, 195) scale(0.65)">
              <rect x="0" y="15" width="50" height="25" rx="5" fill="#E8DCB8" stroke="#786B59" strokeWidth="2.5" />
              <rect x="58" y="15" width="50" height="25" rx="5" fill="#FB7185" stroke="#9F1239" strokeWidth="2.5" />
            </g>
          </g>
        )}

        {/* ========================================================= */}
        {/* 9. SPROUT (น้องสเปราต์ - The Drained Seedling) */}
        {/* ========================================================= */}
        {mood === 'burnout' && (
          <g>
            {/* 1. Background Sprout & Battery */}
            <rect x="145" y="20" width="26" height="14" rx="3" fill="#374151" stroke="#9CA3AF" strokeWidth="1.5" />
            <rect x="148" y="23" width="6" height="8" rx="1" fill="#EF4444" />
            <rect x="171" y="24" width="3" height="6" rx="1" fill="#9CA3AF" />
            <path d="M 160 68 Q 150 46 142 51 Q 148 61 160 68 Z" fill="#10B981" stroke="#047857" strokeWidth="2" />
            <path d="M 160 68 Q 170 46 178 51 Q 172 61 160 68 Z" fill="#10B981" stroke="#047857" strokeWidth="2" />

            {/* 2. BODY (Behind Head) */}
            <path d="M 102 245 C 95 185, 102 145, 160 145 C 218 145, 225 185, 218 245 C 218 262, 102 262, 102 245 Z" fill="url(#sproutBody)" stroke="#047857" strokeWidth="4" />

            {/* 3. HEAD (In Front of Body) */}
            <circle cx="160" cy="118" r="54" fill="url(#sproutBody)" stroke="#047857" strokeWidth="4" />

            {/* 4. Face Features */}
            <path d="M 126 114 Q 136 120 146 114" stroke="#064E3B" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 174 114 Q 184 120 194 114" stroke="#064E3B" strokeWidth="3" strokeLinecap="round" fill="none" />
            <line x1="154" y1="128" x2="166" y2="128" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" />

            {/* 5. Duo Sandwich Held in Front */}
            <g transform="translate(125, 195) scale(0.65)">
              <rect x="0" y="15" width="50" height="25" rx="5" fill="#E8DCB8" stroke="#786B59" strokeWidth="2.5" />
              <rect x="58" y="15" width="50" height="25" rx="5" fill="#334155" stroke="#0F172A" strokeWidth="2.5" />
            </g>
          </g>
        )}

        {/* ========================================================= */}
        {/* 10. ROXY (น้องร็อกซี่ - The Broken Velvet) */}
        {/* ========================================================= */}
        {mood === 'heartbroken' && (
          <g>
            {/* 1. BODY (Behind Head) */}
            <path d="M 102 245 C 95 185, 102 145, 160 145 C 218 145, 225 185, 218 245 C 218 262, 102 262, 102 245 Z" fill="url(#roxyBody)" stroke="#4C0519" strokeWidth="4" />

            {/* 2. HEAD (In Front of Body) */}
            <circle cx="160" cy="118" r="54" fill="url(#roxyBody)" stroke="#4C0519" strokeWidth="4" />

            {/* 3. Heart Bandage & Face Features */}
            <path d="M 120 126 Q 115 119 122 116 Q 128 122 128 128 L 120 134 Z" fill="#F43F5E" />
            <line x1="116" y1="124" x2="130" y2="128" stroke="#FFE4E6" strokeWidth="2" strokeLinecap="round" />

            <ellipse cx="138" cy="110" rx="8" ry="11" fill="#1C1917" />
            <circle cx="136" cy="106" r="3" fill="#FDA4AF" />
            <ellipse cx="182" cy="110" rx="8" ry="11" fill="#1C1917" />
            <circle cx="180" cy="106" r="3" fill="#FDA4AF" />
            <path d="M 152 130 Q 162 130 168 126" stroke="#FFE4E6" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* 4. Duo Sandwich Held in Front */}
            <g transform="translate(125, 195) scale(0.65)">
              <rect x="0" y="15" width="50" height="25" rx="5" fill="#FB7185" stroke="#9F1239" strokeWidth="2.5" />
              <rect x="58" y="15" width="50" height="25" rx="5" fill="#334155" stroke="#0F172A" strokeWidth="2.5" />
            </g>
          </g>
        )}

        {/* ========================================================= */}
        {/* 11. ZENITH (น้องซีนิธ - The Overthinking Mind) */}
        {/* ========================================================= */}
        {mood === 'stressed' && (
          <g>
            {/* 1. Background Thought Spiral */}
            <path d="M 160 45 A 15 15 0 0 1 175 60 A 10 10 0 0 1 165 70 A 6 6 0 0 1 160 65" stroke="#84CC16" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* 2. BODY (Behind Head) */}
            <path d="M 102 245 C 95 185, 102 145, 160 145 C 218 145, 225 185, 218 245 C 218 262, 102 262, 102 245 Z" fill="url(#zenithBody)" stroke="#3F6212" strokeWidth="4" />

            {/* 3. HEAD (In Front of Body) */}
            <circle cx="160" cy="118" r="54" fill="url(#zenithBody)" stroke="#3F6212" strokeWidth="4" />

            {/* 4. Geeky Glasses & Face */}
            <circle cx="135" cy="112" r="16" stroke="#1E3A18" strokeWidth="3.5" fill="#FFFFFF" fillOpacity="0.85" />
            <circle cx="185" cy="112" r="16" stroke="#1E3A18" strokeWidth="3.5" fill="#FFFFFF" fillOpacity="0.85" />
            <line x1="151" y1="112" x2="169" y2="112" stroke="#1E3A18" strokeWidth="3.5" />
            <circle cx="135" cy="112" r="5" fill="#1E3A18" />
            <circle cx="185" cy="112" r="5" fill="#1E3A18" />
            <path d="M 152 136 Q 160 130 168 136" stroke="#365314" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* 5. Duo Sandwich Held in Front */}
            <g transform="translate(125, 195) scale(0.65)">
              <rect x="0" y="15" width="50" height="25" rx="5" fill="#E8DCB8" stroke="#786B59" strokeWidth="2.5" />
              <rect x="58" y="15" width="50" height="25" rx="5" fill="#334155" stroke="#0F172A" strokeWidth="2.5" />
            </g>
          </g>
        )}

        {/* ========================================================= */}
        {/* 12. MISCHIEF (น้องมิสชิฟ - The Cheeky Trickster) */}
        {/* ========================================================= */}
        {mood === 'playful' && (
          <g>
            {/* 1. Background Horns */}
            <path d="M 125 70 Q 115 50 125 40 Q 135 55 135 70 Z" fill="#9333EA" stroke="#581C87" strokeWidth="2" />
            <path d="M 195 70 Q 205 50 195 40 Q 185 55 185 70 Z" fill="#9333EA" stroke="#581C87" strokeWidth="2" />

            {/* 2. BODY (Behind Head) */}
            <path d="M 102 245 C 95 185, 102 145, 160 145 C 218 145, 225 185, 218 245 C 218 262, 102 262, 102 245 Z" fill="url(#mischiefBody)" stroke="#6B21A8" strokeWidth="4" />

            {/* 3. HEAD (In Front of Body) */}
            <circle cx="160" cy="118" r="54" fill="url(#mischiefBody)" stroke="#6B21A8" strokeWidth="4" />

            {/* 4. Wink & Tongue Face Features */}
            <path d="M 126 112 Q 136 102 146 112" stroke="#3B0764" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="185" cy="110" r="9" fill="#1C1917" />
            <circle cx="182" cy="106" r="3.5" fill="#FFFFFF" />

            {/* Sticking out tongue */}
            <path d="M 150 124 Q 160 138 170 124" stroke="#3B0764" strokeWidth="3" fill="none" />
            <path d="M 156 128 C 154 142, 166 142, 164 128 Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.5" />

            {/* 5. Duo Sandwich Held in Front */}
            <g transform="translate(125, 195) scale(0.65)">
              <rect x="0" y="15" width="50" height="25" rx="5" fill="#FDE047" stroke="#D97706" strokeWidth="2.5" />
              <rect x="58" y="15" width="50" height="25" rx="5" fill="#FB7185" stroke="#9F1239" strokeWidth="2.5" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
