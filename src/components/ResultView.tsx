'use client';

import React, { useRef, useState, useEffect } from 'react';
import { BASE_SANDWICH_FILLINGS, MoodProfile } from '@/data/quizData';
import { sandwichMoods, sandwichBackground } from '@/data/sandwich';
import ChibiSticker from './ChibiSticker';
import StoryCard from './StoryCard';
import { Sparkle, PromoBurst, InstagramIcon } from './Decor';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { sfx } from '@/lib/sound';
import { Download, Share2, Copy, RotateCcw, Sparkles, Coffee, Check, Eye, Camera } from 'lucide-react';

interface ResultViewProps {
  mood: MoodProfile;
  onRetake: () => void;
}

export default function ResultView({ mood, onRetake }: ResultViewProps) {
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showStoryPreview, setShowStoryPreview] = useState(false);

  const menuMoods = sandwichMoods(mood);
  const isMix = menuMoods.length > 1;

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFE83B', '#7ED957', '#FF8BAE', '#8EB2D9', '#FFFFFF'],
      });
    } catch {
      // Ignore in environments where canvas is unavailable
    }
  }, [mood]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Generate and Download Story PNG
  const handleDownloadStoryImage = async () => {
    if (!storyCardRef.current) return;
    sfx.shutter();
    setIsGeneratingImage(true);
    showToast('กำลังสร้าง Story Card ขนาด 9:16...');

    try {
      const dataUrl = await toPng(storyCardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `moodwhich-${mood.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast('บันทึกรูปแล้ว! แท็ก @moodwhich.kmuttnative ลง IG Story ลุ้นแซนวิชฟรี');
    } catch (err) {
      console.error('Failed to generate image', err);
      showToast('เกิดข้อผิดพลาดในการสร้างรูปภาพ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Web Share API
  const handleNativeShare = async () => {
    sfx.tap();
    const shareData = {
      title: `วันนี้อารมณ์ของฉันคือ "${mood.chibiName}"`,
      text: `วันนี้ฉันคือ ${mood.chibiName} ${mood.emoji} เมนูที่ใช่: ${mood.sandwichName} 🥪 มาหาแซนวิชตามอารมณ์ของคุณกัน! ${mood.hashtag}`,
      url: typeof window !== 'undefined' ? window.location.href : 'https://mood-which.vercel.app',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Share was cancelled or failed
      }
    } else {
      if (typeof window !== 'undefined') {
        navigator.clipboard.writeText(window.location.href);
        showToast('คัดลอกลิงก์แล้ว! ส่งให้เพื่อนได้เลย');
      }
    }
  };

  // One-click Copy Caption & Hashtags
  const handleCopyCaption = () => {
    const captionText = `วันนี้อารมณ์ของฉันคือ: ${mood.chibiName} ${mood.emoji}\n[${mood.mixLabelTh}]\n\n🥪 ${mood.sandwichName}\n\n"${mood.prophecy}"\n\nมาหาแซนวิชตามอารมณ์ของคุณที่ @moodwhich.kmuttnative\n${mood.hashtag} #MoodWhich`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(captionText);
      sfx.ding();
      setCopiedCaption(true);
      showToast('คัดลอกแคปชันแล้ว! วางใน Story ได้เลย');
      setTimeout(() => setCopiedCaption(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 pb-10 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-ink text-yellow text-xs sm:text-sm font-semibold px-5 py-3 rounded-full shadow-2xl border-2 border-yellow flex items-center gap-2 max-w-[90vw] text-center"
          >
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Who you are today ─────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="text-center"
      >
        <p className="tape text-base sm:text-lg">อารมณ์ของคุณวันนี้คือ...</p>

        <div className="relative mt-4 flex justify-center">
          <div
            className="absolute inset-x-10 top-6 bottom-2 rounded-full blur-3xl opacity-60"
            style={{ background: sandwichBackground(menuMoods) }}
          />
          <Sparkle className="absolute left-[8%] top-[12%] w-8 animate-twinkle" />
          <Sparkle className="absolute right-[10%] top-[40%] w-5 animate-twinkle [animation-delay:1s]" />
          <ChibiSticker mood={mood.id} heightClass="h-60 sm:h-72" float eager className="relative" />
        </div>

        <h1 className="mt-4 text-4xl sm:text-5xl font-black text-yellow leading-tight tracking-tight">
          {mood.chibiName}
        </h1>
        <p className="mt-1 text-sm sm:text-base font-semibold">{mood.chibiTitle}</p>
        <p className="mt-3">
          <span className="label-chip text-xs sm:text-sm">{mood.mixLabelTh}</span>
        </p>
        <p className="mt-4 text-sm max-w-md mx-auto">
          <span className="ink-bar">{mood.chibiDescription}</span>
        </p>
      </motion.section>

      {/* ── Your sandwich ─────────────────────────────────── */}
      <section className="relative mt-10">
        <div
          className="relative rounded-3xl p-5 sm:p-6 text-ink border-[3px] border-ink shadow-[6px_6px_0_#0D0D0D]"
          style={{ background: sandwichBackground(menuMoods) }}
        >
          <span className="label-chip text-sm">{isMix ? 'MIX 2 อารมณ์' : 'เมนูของคุณ'}</span>
          <h2 className="mt-3 text-xl sm:text-2xl font-black leading-snug pr-24 sm:pr-28">{mood.sandwichName}</h2>
          <div className="mt-4 space-y-2">
            {menuMoods.map((m) => {
              const base = BASE_SANDWICH_FILLINGS[m];
              return (
                <div key={m} className="flex items-start gap-2 bg-white/70 rounded-xl px-3 py-2">
                  <span className="text-lg leading-none mt-0.5">{base.emoji}</span>
                  <p className="text-sm font-semibold leading-snug">
                    {base.breadTh} <span className="font-normal">· {base.nameTh}</span>
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs sm:text-sm font-medium">{mood.fillingDesc}</p>
          <div className="mt-4 flex items-end gap-2">
            <span className="font-black text-5xl leading-none">35.-</span>
            <span className="text-xs font-bold pb-1">/ ชิ้น</span>
          </div>
        </div>
        <PromoBurst className="absolute -top-8 -right-3 w-28 sm:w-32 text-[10px] sm:text-xs rotate-12" />
      </section>

      {/* ── Prophecy ─────────────────────────────────────── */}
      <section className="mt-6 rounded-3xl bg-ink p-5 sm:p-6 text-left">
        <div className="flex items-center gap-2 mb-2">
          <Sparkle className="w-5" />
          <h3 className="font-tape text-yellow text-base">คำทำนายวันนี้</h3>
        </div>
        <p className="text-sm sm:text-base leading-relaxed text-white/90">&ldquo;{mood.prophecy}&rdquo;</p>
        <div className="mt-4 pt-4 border-t border-white/15 flex items-center gap-3">
          <Coffee className="w-5 h-5 text-yellow flex-shrink-0" />
          <p className="text-xs sm:text-sm text-white/80">
            <span className="font-bold text-white">ดื่มคู่กัน:</span> {mood.bestPairDrink}
          </p>
        </div>
      </section>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {mood.flavorNotes.map((note, i) => (
          <span key={i} className={`tape font-sans font-semibold text-xs ${i % 2 ? 'rotate-2' : '-rotate-2'}`}>
            #{note}
          </span>
        ))}
      </div>

      {/* ── Share ─────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-10 space-y-4"
      >
        <div className="rounded-3xl border-2 border-dashed border-yellow/70 p-4 text-center">
          <p className="font-tape text-yellow text-base sm:text-lg">แชะ & แท็ก ลุ้นฟรี!</p>
          <p className="text-xs sm:text-sm text-white/85 mt-1">
            ถ่ายรูปแซนวิชสีตามอารมณ์ลง IG Story แล้วแท็ก{' '}
            <span className="font-semibold text-white">@moodwhich.kmuttnative</span> ลุ้นรับแซนวิชฟรี 1 ชิ้น
          </p>
        </div>

        <button
          onClick={handleDownloadStoryImage}
          disabled={isGeneratingImage}
          className="btn-sticker w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70"
        >
          <Camera className="w-5 h-5" />
          <span>{isGeneratingImage ? 'กำลังเตรียมรูปภาพ...' : 'บันทึกการ์ด IG Story (9:16)'}</span>
          <Download className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleNativeShare}
            className="py-3 px-4 rounded-2xl bg-ink text-yellow font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors active:scale-95 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>แชร์ผลลัพธ์</span>
          </button>
          <button
            onClick={handleCopyCaption}
            className="py-3 px-4 rounded-2xl bg-white text-ink border-2 border-ink font-bold text-sm flex items-center justify-center gap-2 hover:bg-yellow transition-colors active:scale-95 cursor-pointer"
          >
            {copiedCaption ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCaption ? 'คัดลอกแล้ว!' : 'คัดลอกแคปชัน'}</span>
          </button>
        </div>

        <a
          href="https://www.instagram.com/moodwhich.kmuttnative/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 rounded-full bg-ink py-3 text-yellow font-semibold text-sm hover:scale-[1.01] transition-transform"
        >
          <InstagramIcon className="w-5 h-5 text-white" />
          @moodwhich.kmuttnative
        </a>

        {/* Story Card Live Preview Toggle */}
        <div className="text-center pt-1">
          <button
            onClick={() => {
              sfx.tap();
              setShowStoryPreview(!showStoryPreview);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/75 hover:text-yellow py-1 px-3 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showStoryPreview ? 'ซ่อนตัวอย่างการ์ด' : 'ดูตัวอย่างการ์ด IG Story'}</span>
          </button>
        </div>

        <AnimatePresence>
          {showStoryPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden flex justify-center"
            >
              {/* 450×800 card shown at 70% */}
              <div className="w-[315px] h-[560px] overflow-hidden rounded-2xl border-[3px] border-ink shadow-[6px_6px_0_#0D0D0D]">
                <div className="origin-top-left scale-[0.7]">
                  <StoryCard mood={mood} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center pt-2">
          <button
            onClick={onRetake}
            className="inline-flex items-center gap-2 text-sm font-bold text-white/80 hover:text-yellow transition-colors py-2 px-4 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ทำควิซใหม่อีกครั้ง</span>
          </button>
        </div>
      </motion.section>

      {/* Hidden Offscreen Story Card for High-Res PNG Capture */}
      <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none" aria-hidden="true">
        <StoryCard ref={storyCardRef} mood={mood} />
      </div>
    </div>
  );
}
