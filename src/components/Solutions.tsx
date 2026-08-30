import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Headphones,
  Bot,
  LayoutDashboard,
  Rocket,
  Cloud,
  Sparkles,
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

export const Solutions: React.FC<SolutionsProps> = () => {
  const { solutions } = PORTFOLIO_DATA;
  const { t } = useLanguage();

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  // Compute exact horizontal travel distance based on cards track
  useEffect(() => {
    const updateDistance = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const containerWidth = trackRef.current.parentElement?.clientWidth || window.innerWidth;
        const dist = Math.max(0, trackWidth - containerWidth + 40);
        setScrollDistance(dist);
      }
    };

    updateDistance();
    window.addEventListener('resize', updateDistance);
    return () => window.removeEventListener('resize', updateDistance);
  }, [solutions]);

  // Track vertical scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress to horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="relative bg-[#FFFDF5] border-b-4 border-black"
      style={{ height: `${Math.max(window.innerHeight * 2, scrollDistance + window.innerHeight)}px` }}
    >
      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden py-8 select-none">
        {/* Ambient background blur blobs */}
        <div className="absolute -right-20 top-1/4 w-96 h-96 bg-[#C084FC] rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute -left-20 bottom-1/4 w-96 h-96 bg-[#FDE047] rounded-full mix-blend-multiply filter blur-3xl opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 relative z-10 flex flex-col justify-center h-full">
          {/* Original Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 shrink-0">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-[#F9A8D4] border-2 border-black text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-4 neo-shadow-sm text-black">
                {t.solutions.eyebrow}
              </span>

              <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-syne tracking-tighter text-slate-900 leading-[0.95]">
                {t.solutions.titleMain}
                <br />
                <span className="text-[#2563EB]">{t.solutions.titleHighlight}</span>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-slate-600 max-w-sm md:text-right font-medium">
              {t.solutions.subtitle}
            </p>
          </div>

          {/* Cards Track Container */}
          <div className="overflow-hidden w-full py-2">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex gap-6 sm:gap-8 will-change-transform items-stretch"
            >
              {solutions.map((meta, idx) => {
                const copy = t.solutions.items[meta.id];
                if (!copy) return null;

                return (
                  <article
                    key={meta.id}
                    className="group relative w-[320px] sm:w-[370px] md:w-[400px] shrink-0 p-7 sm:p-8 bg-white border-2 border-black rounded-3xl neo-shadow flex flex-col justify-between gap-6 overflow-hidden transition-transform duration-300 hover:-translate-y-1.5"
                  >
                    {/* Colour wash on hover */}
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ backgroundColor: meta.accent }}
                    />

                    <div className="relative z-10 flex items-start justify-between">
                      <div
                        className="p-3 rounded-2xl border-2 border-black text-black transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                        style={{ backgroundColor: meta.accent }}
                      >
                        {ICONS[meta.icon] ?? <Sparkles className="w-7 h-7" />}
                      </div>

                      <span className="text-[11px] font-mono font-bold text-black/40 tracking-widest">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="relative z-10 space-y-3 flex-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/50 block">
                        {copy.category}
                      </span>
                      <h3 className="text-2xl sm:text-[1.7rem] font-extrabold font-syne tracking-tight leading-tight text-slate-900">
                        {copy.title}
                      </h3>
                      <p className="text-sm sm:text-[15px] text-slate-700 group-hover:text-black/80 leading-relaxed font-medium">
                        {copy.description}
                      </p>
                    </div>

                    <ul className="relative z-10 flex flex-wrap gap-1.5 pt-4 border-t-2 border-black/10">
                      {copy.bullets.map((b) => (
                        <li
                          key={b}
                          className="px-2.5 py-1 rounded-full bg-black/5 group-hover:bg-black/10 text-[11px] font-mono font-bold tracking-tight text-black/70"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
