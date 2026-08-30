import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Headphones,
  Bot,
  LayoutDashboard,
  Rocket,
  Cloud,
  Sparkles,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
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
  const { t } = useLanguage();

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Parallax background effects linked to vertical scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const blob1Y = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const headerX = useTransform(scrollYProgress, [0, 1], [-15, 15]);

  const handleScrollTo = (index: number) => {
    if (!scrollTrackRef.current) return;
    const cards = scrollTrackRef.current.children;
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeIndex - 1);
    handleScrollTo(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(solutions.length - 1, activeIndex + 1);
    handleScrollTo(nextIdx);
  };

  const handleTrackScroll = () => {
    if (!scrollTrackRef.current) return;
    const el = scrollTrackRef.current;
    const cardWidth = el.scrollWidth / solutions.length;
    const index = Math.round(el.scrollLeft / cardWidth);
    if (index >= 0 && index < solutions.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <section
      id="solutions"
      ref={containerRef}
      className="relative py-20 sm:py-28 px-4 sm:px-8 bg-[#FFFDF5] overflow-hidden border-b-4 border-black select-none"
    >
      {/* Parallax ambient background gradient blobs */}
      <motion.div
        style={{ y: blob1Y }}
        className="absolute -right-20 top-1/4 w-[28rem] h-[28rem] bg-[#C084FC] rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"
      />
      <motion.div
        style={{ y: blob2Y }}
        className="absolute -left-20 bottom-1/4 w-[28rem] h-[28rem] bg-[#FDE047] rounded-full mix-blend-multiply filter blur-3xl opacity-25 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div style={{ x: headerX }} className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3.5 py-1 rounded-full bg-[#F9A8D4] border-2 border-black text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-4 neo-shadow-sm text-black"
            >
              {t.solutions.eyebrow}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-syne tracking-tighter text-slate-900 leading-[0.95]"
            >
              {t.solutions.titleMain}
              <br />
              <span className="text-[#2563EB]">{t.solutions.titleHighlight}</span>
            </motion.h2>
          </motion.div>

          {/* Right Controls: Carousel Indicators & Arrows */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500 mr-1 hidden sm:inline flex items-center gap-1.5">
                <MoveHorizontal className="w-3.5 h-3.5" />
                <span>Scroll o trascina</span>
              </span>

              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                aria-label="Previous card"
                className="w-11 h-11 rounded-2xl bg-white border-2 border-black neo-shadow-sm flex items-center justify-center hover:bg-[#FDE047] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                onClick={handleNext}
                disabled={activeIndex === solutions.length - 1}
                aria-label="Next card"
                className="w-11 h-11 rounded-2xl bg-white border-2 border-black neo-shadow-sm flex items-center justify-center hover:bg-[#FDE047] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Step Dots indicator */}
            <div className="flex items-center gap-1.5">
              {solutions.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => handleScrollTo(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx
                      ? 'w-8 bg-black'
                      : 'w-2 bg-black/20 hover:bg-black/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Parallax Card Track */}
        <div
          ref={scrollTrackRef}
          onScroll={handleTrackScroll}
          data-lenis-prevent
          className="flex gap-6 sm:gap-8 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scrollbar-none no-scrollbar cursor-grab active:cursor-grabbing -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {solutions.map((meta, idx) => {
            const copy = t.solutions.items[meta.id];
            if (!copy) return null;

            const isCurrent = activeIndex === idx;

            return (
              <motion.article
                key={meta.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`group relative min-w-[300px] sm:min-w-[360px] md:min-w-[400px] max-w-[420px] p-7 sm:p-8 bg-white border-2 border-black rounded-3xl neo-shadow flex flex-col justify-between gap-6 overflow-hidden snap-center shrink-0 transition-transform duration-300 hover:-translate-y-2 ${
                  isCurrent ? 'ring-2 ring-black/10' : ''
                }`}
              >
                {/* Background accent color wash on hover */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: meta.accent }}
                />

                {/* Top card bar with icon and index */}
                <div className="relative z-10 flex items-start justify-between">
                  <div
                    className="p-3 rounded-2xl border-2 border-black text-black transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                    style={{ backgroundColor: meta.accent }}
                  >
                    {ICONS[meta.icon] ?? <Sparkles className="w-7 h-7" />}
                  </div>

                  <span className="text-xs font-mono font-extrabold text-black/50 tracking-widest px-2.5 py-1 bg-black/5 rounded-full">
                    0{idx + 1}
                  </span>
                </div>

                {/* Main Content */}
                <div className="relative z-10 space-y-3 flex-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/50 block">
                    {copy.category}
                  </span>
                  <h3 className="text-2xl sm:text-[1.65rem] font-extrabold font-syne tracking-tight leading-tight text-slate-900">
                    {copy.title}
                  </h3>
                  <p className="text-sm text-slate-700 group-hover:text-black/80 leading-relaxed font-medium">
                    {copy.description}
                  </p>
                </div>

                {/* Bullets Pill tags */}
                <ul className="relative z-10 flex flex-wrap gap-1.5 pt-4 border-t-2 border-black/10">
                  {copy.bullets.map((b) => (
                    <li
                      key={b}
                      className="px-2.5 py-1 rounded-full bg-black/5 group-hover:bg-black/10 text-[11px] font-mono font-bold tracking-tight text-black/75"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>

        {/* Footnote CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-white border-2 border-black neo-shadow-sm"
        >
          <p className="text-sm sm:text-base font-semibold text-slate-800">
            {t.solutions.footnote}
          </p>
          <button
            onClick={onOpenContact}
            className="group inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-[#2563EB] transition-colors cursor-pointer"
          >
            <span>{t.solutions.footnoteCta}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
