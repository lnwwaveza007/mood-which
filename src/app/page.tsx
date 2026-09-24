'use client';

import React, { useState } from 'react';
import {
  MOOD_PROFILES,
  QUIZ_QUESTIONS,
  calculateMoodResult,
  MoodType,
  ALL_MOOD_KEYS,
} from '@/data/quizData';
import QuizStep from '@/components/QuizStep';
import ResultView from '@/components/ResultView';
import SandwichIllustration from '@/components/SandwichIllustration';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

type ScreenState = 'landing' | 'quiz' | 'calculating' | 'result';

export default function Home() {
  const [screenState, setScreenState] = useState<ScreenState>('landing');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [resultMood, setResultMood] = useState<MoodType>('happy');
  const [previewMood, setPreviewMood] = useState<MoodType>('happy');
  const [activeMoodTab, setActiveMoodTab] = useState<'all' | 'fundamental' | 'mixed'>('all');

  const startQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setScreenState('quiz');
  };

  const handleSelectOption = (optionId: string) => {
    const questionId = QUIZ_QUESTIONS[currentStep].id;
    const updatedAnswers = { ...answers, [questionId]: optionId };
    setAnswers(updatedAnswers);

    // If more questions exist, proceed to next question
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 250);
    } else {
      // Finished all questions! Calculate result and show transition
      const calculated = calculateMoodResult(updatedAnswers);
      setResultMood(calculated);
      setScreenState('calculating');

      setTimeout(() => {
        setScreenState('result');
      }, 1600);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setScreenState('landing');
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setScreenState('landing');
  };

  const displayedMoods = ALL_MOOD_KEYS.filter((key) => {
    if (activeMoodTab === 'fundamental') return MOOD_PROFILES[key].isFundamental;
    if (activeMoodTab === 'mixed') return !MOOD_PROFILES[key].isFundamental;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#1F41A8] text-white flex flex-col justify-between selection:bg-[#FFE94D] selection:text-[#0D0D0D] relative z-[1]">
      {/* Top Navbar */}
      <header className="w-full max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div
          onClick={handleRetake}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FFE94D] text-[#0D0D0D] flex items-center justify-center font-black text-base shadow-xs group-hover:rotate-6 transition-transform">
            ✨
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-tight leading-none">
              Mood W(h)ich
            </h1>
            <p className="text-[10px] text-[#FFE94D]/70 font-medium">
              แซนด์วิชคิดตามอารมณ์
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D0D0D] border border-[#FFE94D]/30 text-[11px] font-bold text-[#FFE94D]">
          <Sparkles className="w-3.5 h-3.5 text-[#FFE94D]" />
          <span>45s Quiz • 12 Chibis</span>
        </div>
      </header>

      {/* Dynamic Screen Content */}
      <div className="flex-1 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {screenState === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-lg mx-auto p-4 sm:p-6 text-center"
            >
              {/* Decorative floating badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0D0D0D] border border-[#FFE94D]/40 text-[#FFE94D] text-xs font-bold shadow-2xs mb-3 animate-bounce">
                <span>✨ Inside-Out Mood Chibi × 4 แซนด์วิชหลัก</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                วันนี้คุณคือ Chibi ตัวไหน? <br />
                <span className="text-[#FFE94D]">
                  ค้นพบตัวตน & แซนด์วิชจับคู่ 2 ไส้
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-white/70 font-medium mt-2.5 max-w-md mx-auto leading-relaxed">
                ทำแบบทดสอบสั้น ๆ 4 ข้อ (45 วิ) เพื่อค้นหา Chibi อารมณ์ของคุณ
                พร้อมจับคู่แซนด์วิช 4 ไส้หลัก (สุข, เบื่อ, โกรธ, เศร้า) สั่งแบบ 1 ชิ้นไส้นึง อีกชิ้นอีกไส้นึงได้ถึง 12 สไตล์! 🥪📸
              </p>

              {/* Hero Chibi Preview Showcase */}
              <div className="my-2 relative flex flex-col justify-center items-center">
                <div
                  className="absolute w-56 h-56 rounded-full blur-3xl -z-10 transition-colors duration-500"
                  style={{ backgroundColor: `${MOOD_PROFILES[previewMood].primaryColor}40` }}
                />
                <motion.div
                  key={previewMood}
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <SandwichIllustration mood={previewMood} size="md" />
                </motion.div>
                <div className="mt-1 text-center">
                  <p className="text-xs sm:text-sm font-black text-white flex items-center justify-center gap-1.5">
                    <span>{MOOD_PROFILES[previewMood].emoji}</span>
                    <span>{MOOD_PROFILES[previewMood].chibiName}</span>
                    <span className="text-[11px] font-bold text-white/60">({MOOD_PROFILES[previewMood].chibiTitle})</span>
                  </p>
                  <p className="text-[10.5px] font-bold text-[#FFE94D] mt-0.5">
                    🥪 {MOOD_PROFILES[previewMood].sandwichPairingTip}
                  </p>
                </div>
              </div>

              {/* Tabs: All / Fundamentals / Mixed */}
              <div className="flex items-center justify-center gap-1.5 mb-2 bg-[#0D0D0D]/40 p-1 rounded-xl max-w-xs mx-auto border border-[#FFE94D]/20">
                <button
                  onClick={() => setActiveMoodTab('all')}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    activeMoodTab === 'all'
                      ? 'bg-[#FFE94D] text-[#0D0D0D] shadow-xs'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  ทั้งหมด (12)
                </button>
                <button
                  onClick={() => setActiveMoodTab('fundamental')}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    activeMoodTab === 'fundamental'
                      ? 'bg-[#FFE94D] text-[#0D0D0D] shadow-xs'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  4 Chibi หลัก
                </button>
                <button
                  onClick={() => setActiveMoodTab('mixed')}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    activeMoodTab === 'mixed'
                      ? 'bg-[#FFE94D] text-[#0D0D0D] shadow-xs'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  8 Chibi ผสม
                </button>
              </div>

              {/* 12 Chibi Interactive Pills Preview */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5 max-w-md mx-auto max-h-28 overflow-y-auto p-1">
                {displayedMoods.map((key) => {
                  const m = MOOD_PROFILES[key];
                  const isSelected = previewMood === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setPreviewMood(key)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-amber-400 scale-105 shadow-xs'
                          : 'opacity-85 hover:opacity-100 hover:scale-102'
                      }`}
                      style={{
                        backgroundColor: m.secondaryColor,
                        color: m.accentColor,
                        borderColor: m.primaryColor,
                      }}
                    >
                      <span>{m.emoji} {m.chibiName.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Start CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startQuiz}
                className="w-full py-4 px-6 rounded-2xl font-black text-base bg-[#FFE94D] text-[#0D0D0D] shadow-lg flex items-center justify-center gap-2.5 transition-all group hover:shadow-[#FFE94D]/30 hover:shadow-xl cursor-pointer"
              >
                <span>ค้นหา Chibi & แซนด์วิชของคุณ</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Micro Social Proof */}
              <p className="text-[11px] text-white/50 font-medium mt-3 flex items-center justify-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>มีผู้ค้นพบ Chibi ประจำอารมณ์แล้วกว่า 4,520+ คน</span>
              </p>
            </motion.div>
          )}

          {screenState === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <QuizStep
                question={QUIZ_QUESTIONS[currentStep]}
                currentStepIndex={currentStep}
                totalSteps={QUIZ_QUESTIONS.length}
                selectedOptionId={answers[QUIZ_QUESTIONS[currentStep].id] || null}
                onSelectOption={handleSelectOption}
                onBack={handleBack}
              />
            </motion.div>
          )}

          {screenState === 'calculating' && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center p-8 flex flex-col items-center justify-center"
            >
              <div className="relative w-28 h-28 flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-[#FFE94D]/30 border-t-[#FFE94D] animate-spin" />
                <span className="text-4xl animate-bounce">✨</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                กำลังค้นหา Chibi & จับคู่ 2 ไส้แซนด์วิช...
              </h2>
              <p className="text-xs sm:text-sm text-white/60 font-medium mt-2">
                วิเคราะห์พลังงาน • แมตช์คลื่นอารมณ์ • รังสรรค์ 1 ใน 12 Chibi ประจำตัวคุณ
              </p>
            </motion.div>
          )}

          {screenState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <ResultView mood={MOOD_PROFILES[resultMood]} onRetake={handleRetake} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-2xl mx-auto px-4 py-4 text-center border-t border-white/10 text-white/40 text-[11px]">
        <p>© 2026 Mood W(h)ich. All rights reserved.</p>
        <p className="mt-0.5 text-white/30">
          Crafted with Next.js, Tailwind CSS & Framer Motion for Viral Sharing
        </p>
      </footer>
    </main>
  );
}
