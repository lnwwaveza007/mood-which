'use client';

import React, { useRef, useState, useEffect } from 'react';
import { MoodProfile } from '@/data/quizData';
import SandwichIllustration from './SandwichIllustration';
import StoryCard from './StoryCard';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import {
  Download,
  Share2,
  Copy,
  RotateCcw,
  Sparkles,
  Coffee,
  Check,
  Eye,
  Camera,
  Layers,
  ShoppingBag,
  Sparkle,
} from 'lucide-react';

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

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: [mood.primaryColor, mood.accentColor, '#FFD043', '#FF85A1', '#38BDF8'],
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
    setIsGeneratingImage(true);
    showToast('กำลังเนรมิต Story Card ขนาด 9:16 ความละเอียดสูง... 🎨');

    try {
      const dataUrl = await toPng(storyCardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `chibi-${mood.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast('บันทึกรูป Chibi Story สำเร็จแล้ว! พร้อมแชร์ลง IG / TikTok ได้เลย 📸✨');
    } catch (err) {
      console.error('Failed to generate image', err);
      showToast('เกิดข้อผิดพลาดในการสร้างรูปภาพ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Web Share API
  const handleNativeShare = async () => {
    const shareData = {
      title: `Chibi ประจำตัวของฉันคือ "${mood.chibiName}" (${mood.chibiTitle})`,
      text: `วันนี้ฉันคือ ${mood.chibiName} ✨ เมนูแซนด์วิชที่แนะนำ: ${mood.sandwichPairingTip} 🥪 ลองมาค้นหา Chibi อารมณ์ของคุณกันเลย! ${mood.hashtag}`,
      url: typeof window !== 'undefined' ? window.location.href : 'https://mood-sandwiches.vercel.app',
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
        showToast('คัดลอกลิงก์แบบทดสอบแล้ว! นำไปแชร์ให้เพื่อน ๆ ได้เลย 🔗');
      }
    }
  };

  // One-click Copy Caption & Hashtags
  const handleCopyCaption = () => {
    const captionText = `วันนี้ Chibi ประจำตัวฉันคือ: ${mood.chibiName} ${mood.emoji}\n"${mood.chibiTitle}"\n[${mood.mixLabelTh}]\n\n🥪 เมนูแซนด์วิชประจำอารมณ์: ${mood.sandwichPairingTip}\n\nคำทำนายประจำวัน: "${mood.prophecy}"\n\nลองมาค้นหา Chibi ประจำอารมณ์ของคุณดูสิ!\n${mood.hashtag} #MoodChibi #12MoodSandwiches #InsideOutVibe`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(captionText);
      setCopiedCaption(true);
      showToast('คัดลอกแคปชัน & แฮชแท็กเรียบร้อย! นำไปวางใน Story/โพสต์ได้เลย ✨');
      setTimeout(() => setCopiedCaption(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 text-white pb-16 relative z-[1]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#0D0D0D]/90 backdrop-blur-md text-[#FFE94D] text-xs sm:text-sm font-semibold px-5 py-3 rounded-full shadow-2xl border border-[#FFE94D]/30 flex items-center gap-2 max-w-[90vw] text-center"
          >
            <Sparkles className="w-4 h-4 text-[#FFE94D] flex-shrink-0 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm shadow-xl border border-white/10 p-5 sm:p-7 text-center"
      >
        {/* Ambient Glow Header */}
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ backgroundColor: mood.primaryColor }}
        />

        {/* Top Mood Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D0D0D] border border-[#FFE94D]/30 shadow-2xs mb-2">
          <Layers className="w-3.5 h-3.5 text-[#FFE94D]" />
          <span className="text-xs sm:text-sm font-bold text-[#FFE94D]">
            {mood.mixLabelTh}
          </span>
        </div>

        {/* Chibi Mascot Name & Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          {mood.chibiName}
        </h1>
        <p className="text-xs sm:text-sm font-bold mt-1" style={{ color: mood.accentColor }}>
          ✨ {mood.chibiTitle}
        </p>
        <p className="text-xs text-white/50 font-medium mt-1 max-w-md mx-auto">
          {mood.chibiDescription}
        </p>

        {/* Hero Chibi Illustration */}
        <div className="my-2 flex justify-center transform transition-transform hover:scale-105 duration-300">
          <SandwichIllustration mood={mood.id} size="lg" />
        </div>

        {/* Sandwich Promotion & Mix-and-Match Ordering Box */}
        <div className="rounded-2xl p-4 sm:p-5 bg-[#FFE94D]/10 border-2 border-[#FFE94D]/40 text-left my-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-[#FFE94D] text-[#0D0D0D] rounded-xl shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#FFE94D] tracking-tight">
                เมนูแซนด์วิชประจำอารมณ์ของคุณ (Order This!)
              </h3>
              <p className="text-[10.5px] text-white/60 font-medium">
                ร้านเรามี 4 ไส้หลัก — คุณสามารถสั่งแบบ 1 ชิ้นไส้นึง อีกชิ้นอีกไส้นึงได้!
              </p>
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-[#FFE94D]/20 shadow-2xs mt-2">
            <p className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
              <span>🥪</span>
              <span>{mood.sandwichPairingTip}</span>
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10 text-[11px] font-medium text-white/70">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#FFE94D] flex-shrink-0" />
                <span>ชิ้นที่ 1: {mood.sandwichFilling1}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#E5322D] flex-shrink-0" />
                <span>ชิ้นที่ 2: {mood.sandwichFilling2}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prophecy Box */}
        <div
          className="rounded-2xl p-4 sm:p-5 text-left shadow-xs border relative overflow-hidden my-4"
          style={{ backgroundColor: mood.secondaryColor, borderColor: mood.primaryColor }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-xs"
              style={{ backgroundColor: mood.accentColor }}
            >
              <Sparkle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-white tracking-tight">
              คำทำนาย & ข้อความฮีลใจจาก {mood.chibiName}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
            &ldquo;{mood.prophecy}&rdquo;
          </p>
        </div>

        {/* Best Pairing Drink */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left flex items-center gap-3">
          <div className="p-2 bg-[#FFE94D]/20 rounded-xl text-[#FFE94D]">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white">
              เครื่องดื่มจับคู่เพิ่มพลัง (Best Pairing Drink)
            </p>
            <p className="text-xs text-white/60 font-medium mt-0.5">
              {mood.bestPairDrink}
            </p>
          </div>
        </div>

        {/* Flavor Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
          {mood.flavorNotes.map((note, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white/70 border border-white/10"
            >
              #{note}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-6 space-y-3"
      >
        {/* Primary IG Story Download Button */}
        <button
          onClick={handleDownloadStoryImage}
          disabled={isGeneratingImage}
          className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base text-white shadow-lg flex items-center justify-center gap-2.5 transition-all transform active:scale-98 hover:shadow-xl group relative overflow-hidden cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 50%, #E11D48 100%)',
          }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Camera className="w-5 h-5 text-white" />
          <span>
            {isGeneratingImage ? 'กำลังเตรียมรูปภาพ...' : 'บันทึกรูป Chibi แชร์ลง IG Story (9:16)'}
          </span>
          <Download className="w-4 h-4 ml-auto" />
        </button>

        {/* Secondary Actions: Native Share & Copy Caption */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleNativeShare}
            className="py-3 px-4 rounded-2xl bg-[#0D0D0D] text-[#FFE94D] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#0D0D0D]/80 transition-all active:scale-95 shadow-md cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>แชร์ผลลัพธ์</span>
          </button>

          <button
            onClick={handleCopyCaption}
            className="py-3 px-4 rounded-2xl bg-white/5 border-2 border-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            {copiedCaption ? (
              <>
                <Check className="w-4 h-4 text-[#FFE94D]" />
                <span className="text-[#FFE94D]">คัดลอกแล้ว!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-white/70" />
                <span>คัดลอกแคปชัน</span>
              </>
            )}
          </button>
        </div>

        {/* Story Card Live Preview Toggle */}
        <div className="text-center pt-2">
          <button
            onClick={() => setShowStoryPreview(!showStoryPreview)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white py-1 px-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showStoryPreview ? 'ซ่อนการ์ดตัวอย่าง Chibi Story' : 'ดูตัวอย่างการ์ด IG Story (9:16)'}</span>
          </button>
        </div>

        {/* Expandable Preview Area */}
        <AnimatePresence>
          {showStoryPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pt-2 flex flex-col items-center"
            >
              <div className="p-3 bg-[#0D0D0D]/80 rounded-3xl shadow-2xl scale-75 origin-top">
                <StoryCard mood={mood} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Retake Button */}
        <div className="text-center pt-3">
          <button
            onClick={onRetake}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white/50 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/10 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ค้นหา Chibi อารมณ์ใหม่อีกครั้ง</span>
          </button>
        </div>
      </motion.div>

      {/* Hidden Offscreen Story Card for High-Res PNG Capture */}
      <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none">
        <StoryCard ref={storyCardRef} mood={mood} />
      </div>
    </div>
  );
}
