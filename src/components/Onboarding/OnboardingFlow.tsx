/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { BacStream, STREAM_DATA, Origin, ORIGIN_DATA } from '../../types';
import { cn } from '../../lib/utils';
import { Check, ChevronRight, User, BookOpen, Sparkles, Compass } from 'lucide-react';

import { ThemeButton, ThemeCard, ThemeInput } from '../ui/ThemeComponents';

const ORIGINS = Object.keys(ORIGIN_DATA) as Origin[];

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [stream, setStream] = useState<BacStream | null>(null);
  const [origin, setOrigin] = useState<Origin | null>(null);
  
  const completeOnboarding = useStore(state => state.completeOnboarding);
  const setGlobalStream = useStore(state => state.setStream);
  const language = useStore(state => state.language);

  const t = {
    en: {
      welcome: "Welcome to The Scholar's Compass",
      journey: "Your journey to the Algerian Baccalauréat starts here. Tell us your name, hero.",
      placeholder: "Enter your name...",
      continue: "Continue",
      selectStream: "Select Your Stream",
      choosePath: "Choose your path of study.",
      back: "Back",
      chooseStreamBtn: "Choose Path",
      chooseOrigin: "Choose Your Origin",
      originSub: "This defines your character's visual style.",
      beginQuest: "Begin Quest"
    },
    ar: {
      welcome: "مرحباً بك في بوصلة الطالب",
      journey: "رحلتك نحو البكالوريا الجزائرية تبدأ من هنا. أخبرنا باسمك أيها البطل.",
      placeholder: "أدخل اسمك...",
      continue: "استمرار",
      selectStream: "اختر شعبتك",
      choosePath: "اختر مسارك الدراسي.",
      back: "رجوع",
      chooseStreamBtn: "اختر المسار",
      chooseOrigin: "اختر أصلك",
      originSub: "هذا يحدد النمط البصري لشخصيتك.",
      beginQuest: "ابدأ المهمة"
    }
  }[language];

  const handleFinish = () => {
    if (name && stream && origin) {
      setGlobalStream(stream);
      completeOnboarding(name, origin);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)]">
      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex justify-center"
            >
              <ThemeCard className="max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-[var(--accent-primary)]/20 rounded-[2rem] flex items-center justify-center mx-auto">
                  <Compass className="w-10 h-10 text-[var(--accent-primary)]" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">{t.welcome}</h1>
                <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                  {t.journey}
                </p>
                <ThemeInput
                  placeholder={t.placeholder}
                  value={name}
                  onChange={(val) => setName(val)}
                  className="text-center text-xl"
                />
                <ThemeButton
                  disabled={!name}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-8 py-3 mx-auto"
                >
                  {t.continue} <ChevronRight className="w-5 h-5" />
                </ThemeButton>
              </ThemeCard>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">{t.selectStream}</h2>
                <p className="text-[var(--text-secondary)]">{t.choosePath}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.keys(STREAM_DATA) as BacStream[]).map((s) => (
                  <ThemeCard
                    key={s}
                    onClick={() => setStream(s)}
                    className={cn(
                      "p-6 cursor-pointer transition-all text-left space-y-3 group",
                      stream === s 
                        ? "ring-2 ring-[var(--accent-primary)]" 
                        : "opacity-70 hover:opacity-100"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <BookOpen className={cn("w-8 h-8", stream === s ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]")} />
                      {stream === s && <Check className="w-5 h-5 text-[var(--accent-primary)]" />}
                    </div>
                    <h3 className="font-bold text-lg">{s}</h3>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                      {STREAM_DATA[s].description}
                    </p>
                  </ThemeCard>
                ))}
              </div>
              <div className="flex justify-center gap-4">
                <ThemeButton onClick={() => setStep(1)} className="px-6 py-2 text-[var(--text-secondary)]">{t.back}</ThemeButton>
                <ThemeButton
                  disabled={!stream}
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-8 py-3"
                >
                  {t.chooseStreamBtn} <ChevronRight className="w-5 h-5" />
                </ThemeButton>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">{t.chooseOrigin}</h2>
                <p className="text-[var(--text-secondary)]">{t.originSub}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto p-4 custom-scrollbar">
                {ORIGINS.map((o) => (
                  <ThemeCard
                    key={o}
                    onClick={() => setOrigin(o)}
                    className={cn(
                      "aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer transition-all p-2",
                      origin === o 
                        ? "ring-2 ring-[var(--accent-primary)]" 
                        : "opacity-70 hover:opacity-100"
                    )}
                  >
                    <div className="w-full h-24 bg-[var(--bg-primary)] rounded-xl flex items-center justify-center border border-[var(--border-color)] overflow-hidden">
                      <img 
                        src={ORIGIN_DATA[o].imageUrl} 
                        alt={o} 
                        className="w-full h-full object-contain p-1"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="font-bold text-[10px] uppercase tracking-widest text-center">{o}</span>
                  </ThemeCard>
                ))}
              </div>
              <div className="flex justify-center gap-4">
                <ThemeButton onClick={() => setStep(2)} className="px-6 py-2 text-[var(--text-secondary)]">{t.back}</ThemeButton>
                <ThemeButton
                  disabled={!origin}
                  onClick={handleFinish}
                  className="flex items-center gap-2 px-12 py-4 shadow-lg shadow-[var(--accent-primary)]/20"
                >
                  {t.beginQuest} <Sparkles className="w-5 h-5" />
                </ThemeButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
