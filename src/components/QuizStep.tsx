'use client';

import React from 'react';
import { FundamentalMood, QuizQuestion } from '@/data/quizData';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import ChibiSticker from './ChibiSticker';
import { Sparkle } from './Decor';
import { sfx } from '@/lib/sound';

interface QuizStepProps {
  question: QuizQuestion;
  currentStepIndex: number;
  totalSteps: number;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onBack: () => void;
}

// A different chibi keeps you company on each question.
const STEP_CHIBI: FundamentalMood[] = ['happy', 'boring', 'angry', 'sad'];

// Fills exactly the viewport height it is given (no page scroll). Height variants:
// `short:` drops option sub-labels, `compact:` / `tiny:` shrink spacing and extra text.
export default function QuizStep({
  question,
  currentStepIndex,
  totalSteps,
  selectedOptionId,
  onSelectOption,
  onBack,
}: QuizStepProps) {
  const chibi = STEP_CHIBI[currentStepIndex % STEP_CHIBI.length];

  return (
    <div className="w-full h-full max-w-xl mx-auto flex flex-col px-4 sm:px-6 pt-2 pb-4 tiny:pb-3">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/80 hover:text-yellow transition-colors py-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentStepIndex === 0 ? 'หน้าแรก' : 'ข้อก่อนหน้า'}</span>
        </button>
        <span className="font-label font-bold text-sm text-yellow tracking-wider">
          {String(currentStepIndex + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
        </span>
      </div>

      {/* Segmented progress */}
      <div className="grid gap-1.5 mb-5 compact:mb-3" style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="h-2 rounded-full bg-white/15 overflow-hidden">
            <motion.div
              className="h-full bg-yellow"
              initial={false}
              animate={{ width: i <= currentStepIndex ? '100%' : '0%' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        ))}
      </div>

      {/* Question */}
      <motion.div
        key={`q-${question.id}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative shrink-0 mb-4 compact:mb-3 pr-24 sm:pr-28 tiny:pr-16"
      >
        <div className="flex items-center gap-2 mb-2 tiny:mb-1">
          <span className="display-title text-5xl compact:text-4xl tiny:text-3xl">Q{question.questionNumber}</span>
          <Sparkle className="w-6 compact:w-5 animate-twinkle" />
        </div>
        <p className="tape text-sm sm:text-base compact:text-xs mb-3 compact:mb-2">{question.badge}</p>
        <h2 className="text-xl sm:text-2xl compact:text-lg tiny:text-base font-bold leading-snug">{question.title}</h2>
        <p className="mt-2 text-xs sm:text-sm compact:hidden">
          <span className="ink-bar">{question.subtitle}</span>
        </p>

        <motion.div
          key={chibi}
          initial={{ opacity: 0, x: 20, rotate: 8 }}
          animate={{ opacity: 1, x: 0, rotate: 6 }}
          className="absolute -top-2 right-0"
        >
          <ChibiSticker moods={[chibi]} heightClass="h-32 sm:h-40 compact:h-24 tiny:h-16" eager />
        </motion.div>
      </motion.div>

      {/* Options take the remaining height */}
      <motion.div
        key={`opts-${question.id}`}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
        }}
        className="flex-1 min-h-0 flex flex-col justify-center gap-3 compact:gap-2.5 tiny:gap-2 pr-1.5 pb-1.5"
      >
        {question.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <motion.button
              key={option.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ x: -2, y: -2 }}
              whileTap={{ x: 2, y: 2 }}
              onClick={() => {
                sfx.select(index);
                onSelectOption(option.id);
              }}
              className={`w-full text-left p-4 compact:p-2.5 tiny:py-2 rounded-2xl border-[3px] border-ink flex items-center gap-3 compact:gap-2.5 text-ink cursor-pointer transition-[background-color,box-shadow] ${
                isSelected ? 'bg-yellow shadow-[2px_2px_0_#0D0D0D]' : 'bg-white shadow-[5px_5px_0_#0D0D0D] hover:bg-[#FFF8C9]'
              }`}
            >
              <span
                className={`w-11 h-11 compact:w-9 compact:h-9 tiny:w-8 tiny:h-8 rounded-xl flex items-center justify-center text-2xl compact:text-xl tiny:text-lg flex-shrink-0 border-2 border-ink ${
                  isSelected ? 'bg-white' : 'bg-yellow'
                }`}
              >
                {option.emoji}
              </span>
              <span className="flex-1">
                <span className="block text-sm sm:text-base compact:text-sm tiny:text-[13px] font-bold leading-snug">
                  {option.label}
                </span>
                {option.subLabel && (
                  <span className="block text-xs text-ink/60 mt-0.5 leading-relaxed short:hidden">
                    {option.subLabel}
                  </span>
                )}
              </span>
              <span
                className={`w-6 h-6 compact:w-5 compact:h-5 rounded-full border-2 border-ink flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-ink text-yellow' : 'bg-transparent text-transparent'
                }`}
              >
                <Check className="w-4 h-4 compact:w-3 compact:h-3" strokeWidth={3} />
              </span>
            </motion.button>
          );
        })}
      </motion.div>

    </div>
  );
}
