import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Clock, Quote } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { ProblemCopy } from '../i18n/translations';

interface ProblemSolutionProps {
  onOpenContact: () => void;
}

const ACCENTS = ['#2563EB', '#FDE047', '#F9A8D4', '#4ADE80', '#C084FC', '#FB923C'];

/** The panel that translates a problem into a concrete project. */
const SolutionPanel: React.FC<{
  item: ProblemCopy;
  accent: string;
  onOpenContact: () => void;
}> = ({ item, accent, onOpenContact }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#FFFDF5] border-2 border-black rounded-3xl overflow-hidden neo-shadow"
    >
      {/* Coloured header strip */}
      <div
        className="px-6 sm:px-8 py-5 border-b-2 border-black flex items-start gap-3"
        style={{ backgroundColor: accent }}
      >
        <Quote className="w-5 h-5 shrink-0 mt-1 text-black/50" />
        <div>
          <span className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/60 mb-1">
            {t.problems.solutionLabel}
          </span>
          <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-black leading-tight">
            {item.solutionTitle}
          </h3>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{item.solutionText}</p>

        {/* Deliverables */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500">
            {t.problems.deliverablesLabel}
          </span>
          <ul className="grid gap-2">
            {item.deliverables.map((d, i) => (
              <motion.li
                key={d}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.05, duration: 0.3 }}
                className="flex items-start gap-2.5 text-sm text-slate-800"
              >
                <span
                  className="mt-0.5 w-4 h-4 rounded-full border-2 border-black flex items-center justify-center shrink-0"
                  style={{ backgroundColor: accent }}
                >
                  <Check className="w-2.5 h-2.5 stroke-[3.5] text-black" />
                </span>
                <span className="font-medium">{d}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Timeline + CTA */}
        <div className="pt-5 border-t-2 border-black/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-mono text-slate-500">{t.problems.timelineLabel}:</span>
            <span className="text-sm font-bold text-slate-900">{item.timeline}</span>
          </div>

          <button
            onClick={onOpenContact}
            className="group flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-[#2563EB] transition-colors"
          >
            <span>{t.problems.cta}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const ProblemSolution: React.FC<ProblemSolutionProps> = ({ onOpenContact }) => {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);

  const items = t.problems.items;
  const accent = ACCENTS[active % ACCENTS.length];

  return (
    <section id="problems" className="relative py-24 sm:py-32 px-4 sm:px-8 bg-black text-[#FFFDF5] overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 dot-grid-light opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#FDE047] mb-6"
          >
            {t.problems.eyebrow}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-syne tracking-tighter leading-[0.95]"
          >
            {t.problems.titleLead}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-black px-2">{t.problems.titleAccent}</span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: 0 }}
                className="absolute inset-0 bg-[#FDE047] -skew-y-1"
              />
            </span>
            {t.problems.titleTrail}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-white/60 leading-relaxed max-w-2xl"
          >
            {t.problems.subtitle}
          </motion.p>
        </div>

        {/* Two-column: problem list + solution panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Problems */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/40">
                {t.problems.listLabel}
              </span>
              <span className="hidden lg:block text-[10px] font-mono text-white/30">
                {t.problems.hint}
              </span>
            </div>

            {items.map((item, idx) => {
              const isActive = idx === active;
              const itemAccent = ACCENTS[idx % ACCENTS.length];

              return (
                <div key={item.id}>
                  <button
                    onClick={() => setActive(idx)}
                    aria-expanded={isActive}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 group ${
                      isActive
                        ? 'bg-[#FFFDF5] border-black text-black translate-x-1'
                        : 'bg-white/5 border-white/15 text-white/80 hover:bg-white/10 hover:border-white/35'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`mt-0.5 w-7 h-7 shrink-0 rounded-lg border-2 border-black flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                          isActive ? 'text-black' : 'text-black/70'
                        }`}
                        style={{ backgroundColor: isActive ? itemAccent : 'rgba(255,255,255,0.75)' }}
                      >
                        0{idx + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-syne font-bold text-base sm:text-lg leading-snug ${
                            isActive ? 'text-black' : ''
                          }`}
                        >
                          “{item.problem}”
                        </p>

                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.p
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-sm text-slate-600 overflow-hidden"
                            >
                              {item.pain}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <ArrowRight
                        className={`w-5 h-5 shrink-0 mt-1 transition-all duration-300 ${
                          isActive ? 'text-black translate-x-0' : 'text-white/25 -translate-x-1'
                        }`}
                      />
                    </div>
                  </button>

                  {/* Mobile: solution opens right under the selected problem */}
                  <div className="lg:hidden">
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 pb-2">
                            <SolutionPanel
                              item={item}
                              accent={itemAccent}
                              onOpenContact={onOpenContact}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop sticky solution panel */}
          <div className="hidden lg:block lg:col-span-7 lg:sticky lg:top-28">
            <AnimatePresence mode="wait">
              <SolutionPanel
                key={items[active].id}
                item={items[active]}
                accent={accent}
                onOpenContact={onOpenContact}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
