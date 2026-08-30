import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Headphones,
  Bot,
  LayoutDashboard,
  Rocket,
  Cloud,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { useLanguage } from '../i18n/LanguageContext';

interface SolutionsProps {
  onOpenContact: () => void;
}

const ICONS: Record<string, React.ReactNode> = {
  Headphones: <Headphones className="w-7 h-7 stroke-[2.2]" />,
  Bot: <Bot className="w-7 h-7 stroke-[2.2]" />,
  LayoutDashboard: <LayoutDashboard className="w-7 h-7 stroke-[2.2]" />,
  Rocket: <Rocket className="w-7 h-7 stroke-[2.2]" />,
  Cloud: <Cloud className="w-7 h-7 stroke-[2.2]" />,
  Sparkles: <Sparkles className="w-7 h-7 stroke-[2.2]" />,
};

export const Solutions: React.FC<SolutionsProps> = ({ onOpenContact }) => {
  const { solutions } = PORTFOLIO_DATA;
  const { t, language } = useLanguage();
  const isIt = language === 'it';

  const targetRef = useRef<HTMLDivElement>(null);

  // Track vertical scroll progress across the pinned section
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Translate horizontal track as vertical scroll advances
  // Maps 0% to ~-72% depending on track width
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-74%']);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const blobRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section
      ref={targetRef}
      id="solutions"
      className="relative h-[300vh] bg-[#FFFDF5] border-b-4 border-black select-none"
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden px-4 sm:px-8 md:px-12 py-8">
        {/* Parallax Ambient Background Blobs */}
        <motion.div
          style={{ rotate: blobRotate }}
          className="absolute -right-24 top-1/4 w-[32rem] h-[32rem] bg-[#C084FC] rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"
        />
        <motion.div
          style={{ rotate: blobRotate }}
          className="absolute -left-24 bottom-1/4 w-[32rem] h-[32rem] bg-[#FDE047] rounded-full mix-blend-multiply filter blur-3xl opacity-25 pointer-events-none"
        />

        {/* Section Top Eyebrow & Hint */}
        <div className="max-w-7xl mx-auto w-full mb-6 sm:mb-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-[#F9A8D4] border-2 border-black text-[10px] font-mono font-bold uppercase tracking-[0.2em] neo-shadow-sm text-black">
              {t.solutions.eyebrow}
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 hidden sm:inline">
              {isIt ? 'Scorri per esplorare le soluzioni' : 'Scroll down to explore solutions'}
            </span>
          </div>

          {/* Progress Bar & Indicators */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-400">01</span>
            <div className="w-28 sm:w-40 h-2.5 bg-black/10 rounded-full overflow-hidden border border-black/20">
              <motion.div
                style={{ width: progressWidth }}
                className="h-full bg-black rounded-full"
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-900">06</span>
          </div>
        </div>

        {/* Horizontal Motion Track driven by vertical scroll */}
        <motion.div
          style={{ x }}
          className="flex items-stretch gap-6 sm:gap-8 z-10 will-change-transform pr-20"
        >
          {/* Header Card (First Item in track) */}
          <div className="min-w-[300px] sm:min-w-[380px] md:min-w-[440px] p-8 sm:p-10 rounded-3xl bg-black text-white border-4 border-black neo-shadow-lg flex flex-col justify-between shrink-0">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#D0FF71] text-black border border-black text-[10px] font-mono font-bold uppercase tracking-widest mb-6">
                ARCHITETTURA & INNOVAZIONE
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-syne tracking-tighter leading-[0.95] mb-6">
                {t.solutions.titleMain} <br />
                <span className="text-[#D0FF71]">{t.solutions.titleHighlight}</span>
              </h2>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed font-normal">
                {t.solutions.subtitle}
              </p>
            </div>

            <div className="pt-6 border-t border-white/15 flex items-center gap-2 text-xs font-mono text-[#D0FF71]">
              <ArrowRight className="w-4 h-4 animate-pulse" />
              <span>{isIt ? 'Continua a scrollare' : 'Keep scrolling down'}</span>
            </div>
          </div>

          {/* Solution Cards 1..6 */}
          {solutions.map((meta, idx) => {
            const copy = t.solutions.items[meta.id];
            if (!copy) return null;

            return (
              <article
                key={meta.id}
                className="group relative min-w-[300px] sm:min-w-[380px] md:min-w-[420px] p-7 sm:p-9 bg-white border-4 border-black rounded-3xl neo-shadow-lg flex flex-col justify-between gap-6 overflow-hidden shrink-0 hover:-translate-y-1 transition-transform duration-300"
              >
                {/* Background accent color wash on hover */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: meta.accent }}
                />

                {/* Top card bar with icon and index */}
                <div className="relative z-10 flex items-start justify-between">
                  <div
                    className="p-3.5 rounded-2xl border-2 border-black text-black transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 shadow-sm"
                    style={{ backgroundColor: meta.accent }}
                  >
                    {ICONS[meta.icon] ?? <Sparkles className="w-7 h-7" />}
                  </div>

                  <span className="text-xs font-mono font-extrabold text-black/60 tracking-widest px-3 py-1 bg-black/5 rounded-full border border-black/10">
                    0{idx + 1}
                  </span>
                </div>

                {/* Main Content */}
                <div className="relative z-10 space-y-3 flex-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/50 block">
                    {copy.category}
                  </span>
                  <h3 className="text-2xl sm:text-[1.75rem] font-extrabold font-syne tracking-tight leading-tight text-slate-900">
                    {copy.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-700 group-hover:text-black/90 leading-relaxed font-medium">
                    {copy.description}
                  </p>
                </div>

                {/* Bullets Pill tags */}
                <ul className="relative z-10 flex flex-wrap gap-1.5 pt-4 border-t-2 border-black/10">
                  {copy.bullets.map((b) => (
                    <li
                      key={b}
                      className="px-2.5 py-1 rounded-full bg-black/5 group-hover:bg-black/15 text-[11px] font-mono font-bold tracking-tight text-black/80"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}

          {/* Closing CTA Card */}
          <div className="min-w-[280px] sm:min-w-[340px] p-8 sm:p-9 rounded-3xl bg-[#D0FF71] border-4 border-black neo-shadow-lg flex flex-col justify-between shrink-0 text-black">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-black text-white text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
                PROSSIMO PASSO
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold font-syne tracking-tight leading-tight mb-4">
                Hai un'idea da realizzare?
              </h3>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-black/80">
                {t.solutions.footnote}
              </p>
            </div>

            <button
              onClick={onOpenContact}
              className="mt-6 w-full py-3.5 px-6 rounded-2xl bg-black text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#2563EB] transition-colors neo-shadow-sm cursor-pointer"
            >
              <span>{t.solutions.footnoteCta}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
