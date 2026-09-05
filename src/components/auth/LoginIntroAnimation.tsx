import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CloudRain,
  Sun,
  Wind,
  Sparkles,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { UserOccupation } from '../../types';

interface LoginIntroAnimationProps {
  name: string;
  occupation: UserOccupation;
  onFinish: () => void;
}

const OCCUPATION_ICONS: Record<UserOccupation, { emoji: string; tip: string; highlight: string }> = {
  Farmer: {
    emoji: '👨‍🌾',
    tip: 'Calibrating micro-climate soil moisture & irrigation windows',
    highlight: 'Rain expected tomorrow. Consider delaying irrigation & chemical spraying.',
  },
  Student: {
    emoji: '🎓',
    tip: 'Synchronizing lecture schedules with precipitation forecasts',
    highlight: '70% chance of rain between 2 PM–4 PM. Carry an umbrella when leaving college.',
  },
  Professional: {
    emoji: '💼',
    tip: 'Mapping commuter route visibility & cabin thermal dynamics',
    highlight: 'Dry morning transit corridors. High indoor comfort with air-conditioning advisory.',
  },
  Driver: {
    emoji: '🚗',
    tip: 'Computing road traction coefficients & spray hazard corridors',
    highlight: 'Double following distance on suburban bypasses during squall hours.',
  },
  'Outdoor Worker': {
    emoji: '🏗️',
    tip: 'Assessing wet-bulb temperature, solar UV index & convective gusts',
    highlight: 'High UV & temperature between 12 PM–3 PM. Hydrate and avoid prolonged exposure.',
  },
  Homemaker: {
    emoji: '🏠',
    tip: 'Analyzing laundry drying airflow & grocery errand windows',
    highlight: 'Best window for outdoor laundry drying is 9 AM to 1:30 PM before cloud buildup.',
  },
  Traveler: {
    emoji: '🧳',
    tip: 'Cross-referencing regional radar squalls with departure gateways',
    highlight: 'Pack lightweight water-resistant layer; departure corridors clear today.',
  },
  Other: {
    emoji: '⚡',
    tip: 'Tuning hyper-local telemetry & personalized atmospheric guidance',
    highlight: 'Real-time telemetry loaded. WeatherGPT Copilot ready for intelligent assistance.',
  },
};

export const LoginIntroAnimation: React.FC<LoginIntroAnimationProps> = ({
  name,
  occupation,
  onFinish,
}) => {
  const [step, setStep] = useState<number>(0);
  const info = OCCUPATION_ICONS[occupation] || OCCUPATION_ICONS.Other;

  useEffect(() => {
    // Step 0: Initial radar scan (0 - 900ms)
    // Step 1: Occupation tuning (900ms - 2000ms)
    // Step 2: Personalized advisory reveal (2000ms - 3400ms)
    // Finish: 3600ms
    const t1 = setTimeout(() => setStep(1), 900);
    const t2 = setTimeout(() => setStep(2), 2000);
    const t3 = setTimeout(() => onFinish(), 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070d1d]/95 backdrop-blur-2xl overflow-hidden select-none">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.35, 0.15],
            rotate: [0, 90, 180],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#38bdf8]/30 to-[#45dfa4]/20 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full bg-gradient-to-tl from-[#e1a800]/20 to-[#38bdf8]/20 blur-[140px]"
        />

        {/* Orbiting particles */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-[500px] h-[500px] rounded-full border border-dashed border-[#38bdf8]/20 animate-spin [animation-duration:20s]" />
          <div className="absolute w-[360px] h-[360px] rounded-full border border-[#45dfa4]/20 animate-spin [animation-duration:15s] [animation-direction:reverse]" />
        </div>
      </div>

      {/* Center Interactive Stage */}
      <div className="relative z-10 max-w-lg w-full mx-4 p-8 rounded-3xl bg-[#11192e]/90 border border-white/10 shadow-[0_0_80px_rgba(56,189,248,0.2)] text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e293b]/80 border border-[#38bdf8]/30 text-[#38bdf8] text-xs font-semibold mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin [animation-duration:4s]" />
          <span>WeatherGPT Persona Calibration</span>
        </motion.div>

        {/* Dynamic Icon Switcher */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#38bdf8]/30"
          />
          <motion.div
            key={step}
            initial={{ scale: 0.5, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1e293b] to-[#283548] border border-white/10 flex items-center justify-center shadow-lg text-4xl"
          >
            {step === 0 && <CloudRain className="w-9 h-9 text-[#38bdf8] animate-bounce" />}
            {step === 1 && <span>{info.emoji}</span>}
            {step === 2 && <ShieldCheck className="w-9 h-9 text-[#45dfa4]" />}
          </motion.div>
        </div>

        {/* Welcome Text */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-extrabold text-[#dae2fd] tracking-tight mb-2"
        >
          Welcome, <span className="text-[#38bdf8]">{name}</span>!
        </motion.h2>

        {/* Step-by-Step Entertaining Messages */}
        <div className="min-h-[72px] flex flex-col items-center justify-center mb-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-1"
              >
                <div className="text-sm font-semibold text-[#dae2fd] flex items-center justify-center gap-2">
                  <Wind className="w-4 h-4 text-[#38bdf8] animate-spin" />
                  <span>Connecting to Open-Meteo Satellite Feed...</span>
                </div>
                <p className="text-xs text-[#87929a]">Ingesting barometric and high-resolution radar layers</p>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-1"
              >
                <div className="text-sm font-semibold text-[#45dfa4] flex items-center justify-center gap-2">
                  <span>{info.emoji}</span>
                  <span>Tuning AI copilot for {occupation}...</span>
                </div>
                <p className="text-xs text-[#bdc8d1]">{info.tip}</p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-3.5 rounded-2xl bg-[#1e293b]/70 border border-[#45dfa4]/30 text-left space-y-1.5"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#45dfa4]">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{occupation} Daily Advisory Preview</span>
                </div>
                <p className="text-xs text-[#dae2fd] leading-relaxed">
                  {info.highlight}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#1e293b] rounded-full h-1.5 overflow-hidden mb-5">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: step === 0 ? '33%' : step === 1 ? '70%' : '100%' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#38bdf8] via-[#45dfa4] to-[#38bdf8]"
          />
        </div>

        {/* Skip / Continue Button */}
        <button
          onClick={onFinish}
          className="text-xs text-[#87929a] hover:text-[#dae2fd] underline transition-colors"
        >
          Skip animation &amp; jump to dashboard
        </button>
      </div>
    </div>
  );
};
