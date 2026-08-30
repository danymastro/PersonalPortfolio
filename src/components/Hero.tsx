import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Code2, Terminal, ArrowDown, ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { scrollToTarget } from './SmoothScrollProvider';

interface HeroProps {
  onOpenContact: () => void;
}

/** Cycles through the specialisations one word at a time. */
const RotatingWord: React.FC<{ words: string[] }> = ({ words }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [words.length]);

  useEffect(() => {
    setIndex(0);
  }, [words]);

  return (
    <span className="relative inline-flex align-bottom overflow-hidden h-[1.35em] min-w-[12ch]">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="whitespace-nowrap font-bold text-[#2563EB]"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  const { t } = useLanguage();
  const { scrollY } = useScroll();

  const titleY = useTransform(scrollY, [0, 600], [0, -40]);
  const titleOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  return (
    <header
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden pt-24 sm:pt-28 pb-12 px-3.5 sm:px-8"
    >
      {/* Animated colour blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[12%] w-64 sm:w-96 h-64 sm:h-96 bg-[#FDE047] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-[18%] right-[12%] w-72 sm:w-[420px] h-72 sm:h-[420px] bg-[#F9A8D4] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[2%] left-[32%] w-72 sm:w-[450px] h-72 sm:h-[450px] bg-[#2563EB] rounded-full mix-blend-multiply filter blur-[90px] opacity-40 animate-blob animation-delay-4000" />
      </div>

      {/* Dotted grid */}
      <div className="absolute inset-0 -z-10 pointer-events-none dot-grid opacity-[0.35]" />

      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="max-w-6xl w-full mx-auto relative z-10 flex flex-col justify-center"
      >
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 sm:mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-black rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-widest neo-shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]" />
            </span>
            {t.hero.badge}
          </span>
        </motion.div>

        {/* Kinetic title stack - fully responsive and optimized for mobile without truncating */}
        <div className="w-full select-none flex flex-col space-y-1 sm:space-y-2 md:space-y-3 font-syne font-extrabold text-slate-900 tracking-tighter">
          
          {/* Row 1: FULL-STACK + Blue Pill */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-5 flex-nowrap w-full">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[7.6vw] xs:text-[7.2vw] sm:text-[6.4vw] md:text-[5.5vw] lg:text-[72px] xl:text-[82px] leading-none font-extrabold uppercase hover:skew-x-2 transition-transform duration-300 cursor-default shrink-0"
            >
              {t.hero.line1}
            </motion.h1>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
              className="h-7 xs:h-8 sm:h-11 md:h-14 lg:h-16 px-2.5 xs:px-3 sm:px-5 md:px-7 bg-[#2563EB] border-2 border-black rounded-full flex items-center justify-center rotate-6 neo-shadow-sm hover:rotate-12 transition-transform shrink-0"
            >
              <Code2 className="text-white w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </motion.div>
          </div>

          {/* Row 2: Pink Pill + DEVELOPER */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 md:gap-5 w-full pr-1 sm:pr-4 md:pr-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 260 }}
              className="w-7 h-7 xs:w-8 xs:h-8 sm:w-11 sm:h-11 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-[#F9A8D4] border-2 border-black rounded-full flex items-center justify-center -rotate-12 neo-shadow-sm hover:-rotate-6 transition-transform shrink-0"
            >
              <Terminal className="text-black w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[7.6vw] xs:text-[7.2vw] sm:text-[6.4vw] md:text-[5.5vw] lg:text-[72px] xl:text-[82px] leading-none font-extrabold uppercase hover:-skew-x-2 transition-transform duration-300 cursor-default shrink-0"
            >
              {t.hero.line2}
            </motion.h1>
          </div>

          {/* Row 3: Zap Icon + & PROBLEM SOLVER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 w-full flex-nowrap"
          >
            <span className="w-5 h-5 xs:w-6 xs:h-6 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full bg-black text-white flex items-center justify-center -rotate-3 neo-shadow-sm shrink-0">
              <Zap className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#FDE047]" />
            </span>
            <h2 className="text-[5.2vw] xs:text-[4.8vw] sm:text-[4.2vw] md:text-[3.6vw] lg:text-[46px] xl:text-[54px] leading-none font-extrabold uppercase tracking-tighter whitespace-nowrap hover:text-[#2563EB] transition-colors duration-300 cursor-default">
              {t.hero.line3}
            </h2>
          </motion.div>
        </div>

        {/* Rotating specialisation line */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 sm:mt-8 text-sm xs:text-base sm:text-xl md:text-2xl font-medium text-slate-800 flex flex-wrap items-baseline gap-x-2 font-syne"
        >
          <span>{t.hero.rotatingPrefix}</span>
          <RotatingWord words={t.hero.rotatingWords} />
        </motion.p>

        {/* Description + actions */}
        <div className="w-full mt-6 sm:mt-8 text-left space-y-6 sm:space-y-8 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-sm xs:text-base sm:text-lg font-medium leading-relaxed tracking-tight text-slate-700"
          >
            {t.hero.subtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-wrap gap-3 sm:gap-4"
          >
            <button
              onClick={onOpenContact}
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-[#FDE047] border-2 border-black text-black font-bold text-sm sm:text-lg rounded-xl neo-shadow hover:translate-y-1 hover:shadow-none transition-all duration-200 flex items-center gap-2"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollToTarget('#solutions')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-black text-black font-bold text-sm sm:text-lg rounded-xl neo-shadow hover:translate-y-1 hover:shadow-none transition-all duration-200 text-sm sm:text-base"
            >
              {t.hero.ctaSecondary}
            </button>
          </motion.div>

          {/* Quick facts */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap gap-x-5 gap-y-2 pt-1"
          >
            {t.hero.quickFacts.map((fact) => (
              <li
                key={fact}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-medium text-slate-600"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                {fact}
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="mt-10 sm:mt-12 flex flex-col items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400">
          {t.hero.scrollHint}
        </span>
        <button
          onClick={() => scrollToTarget('#problems')}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-black/30 flex items-center justify-center text-slate-500 hover:text-black hover:border-black transition-colors animate-bounce"
          aria-label={t.hero.scrollHint}
        >
          <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
};
