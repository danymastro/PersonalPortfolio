import React from 'react';
import { motion } from 'framer-motion';
import {
  Headphones,
  Bot,
  LayoutDashboard,
  Rocket,
  Cloud,
  Sparkles,
  ArrowUpRight,
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

  return (
    <section
      id="solutions"
      className="relative py-24 sm:py-32 px-4 sm:px-8 bg-[#FFFDF5] overflow-hidden border-b-4 border-black"
    >
      {/* Soft background colour */}
      <div className="absolute -right-20 top-1/4 w-96 h-96 bg-[#C084FC] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob pointer-events-none" />
      <div className="absolute -left-20 bottom-1/4 w-96 h-96 bg-[#FDE047] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 rounded-full bg-[#F9A8D4] border-2 border-black text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-6 neo-shadow-sm"
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
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-base sm:text-lg text-slate-600 max-w-sm md:text-right font-medium"
          >
            {t.solutions.subtitle}
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {solutions.map((meta, idx) => {
            const copy = t.solutions.items[meta.id];
            if (!copy) return null;

            return (
              <motion.article
                key={meta.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative p-7 sm:p-8 bg-white border-2 border-black rounded-3xl neo-shadow flex flex-col gap-6 overflow-hidden"
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
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/50">
                    {copy.category}
                  </span>
                  <h3 className="text-2xl sm:text-[1.7rem] font-extrabold font-syne tracking-tight leading-tight text-slate-900">
                    {copy.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-700 group-hover:text-black/80 leading-relaxed">
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
              </motion.article>
            );
          })}
        </div>

        {/* Footnote */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 flex flex-wrap items-center justify-center gap-4 text-center"
        >
          <p className="text-base sm:text-lg font-medium text-slate-700">{t.solutions.footnote}</p>
          <button
            onClick={onOpenContact}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-[#2563EB] transition-colors"
          >
            <span>{t.solutions.footnoteCta}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
