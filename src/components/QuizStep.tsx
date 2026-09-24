'use client';

import React from 'react';
import { QuizQuestion } from '@/data/quizData';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface QuizStepProps {
  question: QuizQuestion;
  currentStepIndex: number;
  totalSteps: number;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onBack: () => void;
}

export default function QuizStep({
  question,
  currentStepIndex,
  totalSteps,
  selectedOptionId,
  onSelectOption,
  onBack,
}: QuizStepProps) {
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col min-h-[580px] justify-between p-4 sm:p-6 relative z-[1]">
      {/* Top Header & Progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-white/10 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStepIndex === 0 ? 'หน้าแรก' : 'ข้อก่อนหน้า'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0D0D0D] bg-[#FFE94D] px-2.5 py-1 rounded-full border border-[#FFE94D]">
              ข้อที่ {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden mb-6 p-0.5 border border-white/10 shadow-inner">
          <motion.div
            className="h-full bg-[#FFE94D] rounded-full"
            initial={{ width: `${(currentStepIndex / totalSteps) * 100}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Question Header Card */}
        <motion.div
          key={`q-${question.id}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="text-left mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D0D0D] text-[#FFE94D] border border-[#FFE94D]/30 text-[11px] font-bold tracking-wide mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFE94D]" />
            <span>{question.badge}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
            {question.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/60 font-medium mt-1">
            {question.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Options List */}
      <motion.div
        key={`opts-${question.id}`}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="space-y-3 my-2"
      >
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <motion.button
              key={option.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onSelectOption(option.id)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3.5 relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? 'border-[#FFE94D] bg-[#FFE94D]/10 shadow-md ring-2 ring-[#FFE94D]/30'
                  : 'border-white/20 bg-white/5 hover:border-[#FFE94D]/50 hover:bg-[#FFE94D]/5 shadow-xs'
              }`}
            >
              {/* Emoji Icon Container */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isSelected ? 'bg-[#FFE94D] text-[#0D0D0D] shadow-xs' : 'bg-white/10 text-white'
                }`}
              >
                {option.emoji}
              </div>

              {/* Option Text */}
              <div className="flex-1 pr-6">
                <p
                  className={`text-sm sm:text-base font-bold leading-snug tracking-tight ${
                    isSelected ? 'text-[#FFE94D]' : 'text-white'
                  }`}
                >
                  {option.label}
                </p>
                {option.subLabel && (
                  <p className="text-xs text-white/50 font-normal mt-0.5 leading-relaxed">
                    {option.subLabel}
                  </p>
                )}
              </div>

              {/* Checkmark Indicator */}
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'border-[#FFE94D] bg-[#FFE94D] text-[#0D0D0D]'
                      : 'border-white/30 bg-transparent text-transparent group-hover:border-white/60'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Helper Footer */}
      <div className="text-center pt-4">
        <p className="text-[11px] text-white/40 font-medium">
          แตะตัวเลือกที่ตรงกับความรู้สึกของคุณมากที่สุด ✨
        </p>
      </div>
    </div>
  );
}
