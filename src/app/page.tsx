'use client';

import React, { useState } from 'react';
import {
  MOOD_PROFILES,
  QUIZ_QUESTIONS,
  BASE_SANDWICH_FILLINGS,
  calculateMoodResult,
  FundamentalMood,
  MoodType,
} from '@/data/quizData';
import QuizStep from '@/components/QuizStep';
import ResultView from '@/components/ResultView';
import ChibiSticker from '@/components/ChibiSticker';
import SoundToggle from '@/components/SoundToggle';
import { sfx, startMusic } from '@/lib/sound';
import { Sparkle, GooglyEyes, PromoBurst, SectionTag, InstagramIcon } from '@/components/Decor';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';

type ScreenState = 'landing' | 'quiz' | 'calculating' | 'result';

const FUNDAMENTALS: FundamentalMood[] = ['happy', 'boring', 'angry', 'sad'];

// Hero chibis sit around the headline like on the poster.
const HERO_CHIBIS: { mood: FundamentalMood; className: string }[] = [
  // Top pair would cover the headline on phones, so they only show from sm up.
  { mood: 'sad', className: 'hidden sm:block left-[-2%] top-[18%] -rotate-12' },
  { mood: 'happy', className: 'hidden sm:block right-[-2%] top-[14%] rotate-12' },
  { mood: 'boring', className: 'left-[2%] bottom-[2%] -rotate-6' },
  { mood: 'angry', className: 'right-[2%] bottom-[4%] rotate-6' },
];

export default function Home() {
  const [screenState, setScreenState] = useState<ScreenState>('landing');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [resultMood, setResultMood] = useState<MoodType>('happy');

  const startQuiz = () => {
    window.scrollTo(0, 0);
    // First click is the user gesture browsers need before any audio can play.
    sfx.start();
    startMusic();
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
        sfx.next();
        setCurrentStep((prev) => prev + 1);
      }, 250);
    } else {
      // Finished all questions! Calculate result and show transition
      const calculated = calculateMoodResult(updatedAnswers);
      setResultMood(calculated);
      setScreenState('calculating');
      sfx.drumroll(1.6);

      setTimeout(() => {
        sfx.reveal();
        setScreenState('result');
      }, 1800);
    }
  };

  const handleBack = () => {
    sfx.back();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setScreenState('landing');
    }
  };

  const handleRetake = () => {
    sfx.tap();
    setAnswers({});
    setCurrentStep(0);
    setScreenState('landing');
  };

  // Quiz and loading screens are locked to one viewport: no scrolling mid-quiz.
  const isFixedScreen = screenState === 'quiz' || screenState === 'calculating';

  return (
    <main
      className={`text-white flex flex-col relative z-[1] overflow-x-hidden ${
        isFixedScreen ? 'h-dvh overflow-y-hidden' : 'min-h-screen'
      }`}
    >
      {/* Poster top line */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between">
        <button onClick={handleRetake} className="cursor-pointer" aria-label="กลับหน้าแรก">
          <SectionTag />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[11px] sm:text-sm font-semibold text-yellow">แซนวิชตามอารมณ์</span>
          <SoundToggle />
        </div>
      </header>

      <div className={`flex-1 min-h-0 flex justify-center w-full ${isFixedScreen ? 'items-stretch' : 'items-start'}`}>
        <AnimatePresence mode="wait">
          {screenState === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <Landing onStart={startQuiz} />
            </motion.div>
          )}

          {screenState === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full"
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
              className="w-full text-center px-6 flex flex-col items-center justify-center"
            >
              <div className="flex items-end justify-center gap-1 mb-8">
                {FUNDAMENTALS.map((m, i) => (
                  <motion.div
                    key={m}
                    animate={{ y: [0, -22, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                  >
                    <ChibiSticker moods={[m]} heightClass="h-24 sm:h-28" eager />
                  </motion.div>
                ))}
              </div>
              <h2 className="tape text-lg sm:text-2xl">กำลังหาแซนวิชที่ใช่...</h2>
              <p className="mt-4 text-sm text-white/80">
                <span className="ink-bar">อ่านอารมณ์ · ทาสีขนมปัง · จี่ให้หอม</span>
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
      {!isFixedScreen && (
        <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/60">
          <span className="font-label tracking-wider">KMUTT · GEN351 · SECTION 8 GROUP 8</span>
          <span>© 2026 MoodWhich · แซนวิชตามอารมณ์</span>
        </footer>
      )}
    </main>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-6 pb-10 sm:pb-14">
        {HERO_CHIBIS.map(({ mood, className }, i) => (
          <motion.div
            key={mood}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 220, damping: 16 }}
            className={`absolute z-0 pointer-events-none ${className}`}
          >
            <div className="animate-float" style={{ animationDelay: `${i * 0.7}s` }}>
              <ChibiSticker moods={[mood]} heightClass="h-28 sm:h-44 lg:h-52" eager />
            </div>
          </motion.div>
        ))}

        <div className="relative z-10 text-center">
          <h1 className="display-title text-[23vw] sm:text-[9.5rem] lg:text-[11rem]">
            <span className="block">
              M
              <span className="relative inline-block">
                O
                <Sparkle className="absolute left-1/2 top-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2 animate-twinkle"/>
              </span>
              <span className="relative inline-block">
                O
                <Sparkle
                  className="absolute left-1/2 top-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2 animate-twinkle [animation-delay:0.8s]"
                />
              </span>
              D
            </span>
            <span className="block">WHICH</span>
            <span className="sr-only">MoodWhich แซนวิชตามอารมณ์</span>
          </h1>

          {/* "อารมณ์แบบงี้? กินอะไรดี..." tape stack */}
          <div className="relative mt-6 sm:mt-8 inline-flex flex-col items-center">
            <GooglyEyes className="absolute -top-9 right-[-8%] w-14 sm:w-16 rotate-6" />
            <p className="tape text-3xl sm:text-5xl -rotate-3">อารมณ์แบบงี้?</p>
            <p className="font-tape text-yellow text-lg sm:text-2xl mt-2 self-end">กินอะไรดี...</p>
          </div>

          <p className="mt-4 max-w-md mx-auto text-sm sm:text-base">
            <span className="ink-bar">ทำควิซ 4 ข้อ เพื่อหาแซนวิชที่ตรงกับความรู้สึกของคุณที่สุด</span>
          </p>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="btn-sticker mt-8 inline-flex items-center gap-3 px-7 sm:px-9 py-4 rounded-full font-black text-lg sm:text-xl cursor-pointer"
          >
            <span>เริ่มทำควิซเลย</span>
            <ArrowRight className="w-6 h-6" strokeWidth={3} />
          </motion.button>
          <p className="mt-3 text-xs text-white/70">ใช้เวลาไม่ถึง 1 นาที · ได้การ์ดแชร์ลง IG Story</p>
        </div>
      </section>

      {/* ── PRICE & PROMO ───────────────────────────────────── */}
      <section className="relative grid grid-cols-[1fr_auto] items-center gap-4 sm:gap-8 py-6">
        <div>
          <p className="text-xl sm:text-2xl font-bold">ราคาชิ้นละ</p>
          <p className="font-black text-7xl sm:text-8xl leading-none tracking-tight">35.-</p>
          <p className="mt-4 text-xs sm:text-sm max-w-xs">
            <span className="ink-bar">*แชะรูปแซนวิช แท็กร้านลง IG STORY</span>{' '}
            <span className="ink-bar">ลุ้นรับแซนวิชฟรี 1 ชิ้น!</span>
          </p>
        </div>
        <PromoBurst className="relative w-36 sm:w-48 text-[13px] sm:text-[17px] rotate-6" />
      </section>

      {/* ── MENU: 4 อารมณ์ · 4 สี · 4 รสชาติ ─────────────────── */}
      <section className="py-10">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="display-title text-5xl sm:text-7xl">MENU</h2>
          <Sparkle className="w-8 sm:w-10 animate-twinkle" />
        </div>
        <p className="tape text-base sm:text-xl mb-8">แซนด์วิช 4 อารมณ์ · 4 สี · 4 รสชาติ</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FUNDAMENTALS.map((m, i) => {
            const base = BASE_SANDWICH_FILLINGS[m];
            return (
              <motion.div
                key={m}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-3xl p-4 sm:p-5 pb-28 sm:pb-36 text-ink overflow-hidden min-h-[15rem]"
                style={{ backgroundColor: base.color }}
              >
                <span className="label-chip text-sm sm:text-lg">{base.labelTh}</span>
                <p className="mt-3 text-sm sm:text-base font-semibold leading-snug">{base.breadTh}</p>
                <p className="text-sm sm:text-base font-medium leading-snug">
                  {base.nameTh.split(' + ').map((part, j) => (
                    <span key={j} className="block">
                      {j > 0 && '+ '}
                      {part}
                    </span>
                  ))}
                </p>
                <ChibiSticker
                  moods={[m]}
                  heightClass="h-28 sm:h-36"
                  className="absolute -bottom-3 right-1 sm:right-3"
                />
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p className="text-sm">
            <span className="ink-bar">ขนมปังทาสีตามอารมณ์ แล้วนำไปจี่หน้าร้านให้หอม</span>
          </p>
          <p className="tape text-sm sm:text-base rotate-1">ซอส + แพ็กเกจจิ้งต่างกันในแต่ละอารมณ์</p>
        </div>
      </section>

      {/* ── MIX 2 อารมณ์ ──────────────────────────────────────── */}
      <section className="py-6">
        <div className="relative rounded-3xl bg-yellow text-ink p-5 sm:p-7 grid sm:grid-cols-[1fr_auto] gap-4 items-center overflow-hidden">
          <div>
            <span className="label-chip font-label text-sm sm:text-base">MIX 2 อารมณ์</span>
            <p className="mt-3 text-lg sm:text-2xl font-black leading-snug">
              วันนี้อารมณ์ปนกัน? จับคู่ 2 อารมณ์ในชิ้นเดียว
            </p>
            <p className="mt-1 text-sm sm:text-base font-medium">
              เช่น สุข + โกรธ หรือ เศร้า + เฉย ๆ ได้ลอง 2 รสชาติในราคาเดียว <b>35.-</b>
            </p>
          </div>
          <ChibiSticker moods={['happy', 'angry']} heightClass="h-32 sm:h-40" className="justify-self-center" />
          <Sparkle className="absolute top-4 right-5 w-7 animate-twinkle"/>
        </div>
      </section>

      {/* ── WHEN & WHERE ─────────────────────────────────────── */}
      <section className="py-10 grid sm:grid-cols-2 gap-6 items-center">
        <div>
          <p className="display-title text-6xl sm:text-7xl">
            12 <span className="block">NOV</span>
          </p>
          <p className="mt-2 font-black text-xl">9.30 – 12.00 น.</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
            <MapPin className="w-4 h-4 text-yellow" /> ชั้น 1 ตึกศิลปศาสตร์ · KMUTT
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-3">
          <p className="tape text-base sm:text-lg">ฝากกดติดตามร้านเราด้วยนะ!</p>
          <a
            href="https://www.instagram.com/moodwhich.kmuttnative/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-yellow font-semibold text-base sm:text-lg hover:scale-[1.02] transition-transform"
          >
            <InstagramIcon className="w-7 h-7 text-white" />
            @moodwhich.kmuttnative
          </a>
        </div>
      </section>
    </div>
  );
}
