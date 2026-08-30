import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Gauge, Bot, User, GitBranch } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { useLanguage } from '../i18n/LanguageContext';

const POINT_ICONS = [
  <Gauge key="g" className="w-6 h-6 stroke-[2.2]" />,
  <Bot key="b" className="w-6 h-6 stroke-[2.2]" />,
  <User key="u" className="w-6 h-6 stroke-[2.2]" />,
  <GitBranch key="gb" className="w-6 h-6 stroke-[2.2]" />,
];

const POINT_ACCENTS = ['#FDE047', '#C084FC', '#2563EB', '#4ADE80'];
const STEP_ACCENTS = ['#FDE047', '#F9A8D4', '#2563EB', '#4ADE80'];

export const SpeedSection: React.FC = () => {
  const { processSteps } = PORTFOLIO_DATA;
  const { t } = useLanguage();

  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 80%', 'end 60%'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="speed" className="relative py-24 sm:py-32 px-4 sm:px-8 bg-white border-b-4 border-black overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-[#4ADE80] border-2 border-black text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-6 neo-shadow-sm"
          >
            {t.speed.eyebrow}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-syne tracking-tighter text-slate-900 leading-[0.95]"
          >
            {t.speed.titleLead}{' '}
            <span className="relative inline-block">
              <span className="relative z-10">{t.speed.titleAccent}</span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: 0 }}
                className="absolute left-0 right-0 bottom-1 h-3 sm:h-5 bg-[#FDE047] -z-0"
              />
            </span>
            {t.speed.titleTrail}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed"
          >
            {t.speed.subtitle}
          </motion.p>
        </div>

        {/* Four differentiators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-24">
          {t.speed.points.map((point, idx) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -5 }}
              className="p-6 bg-[#FFFDF5] border-2 border-black rounded-3xl neo-shadow-sm space-y-4"
            >
              <div
                className="w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center"
                style={{ backgroundColor: POINT_ACCENTS[idx % POINT_ACCENTS.length] }}
              >
                {POINT_ICONS[idx % POINT_ICONS.length]}
              </div>
              <h3 className="font-syne font-bold text-lg text-slate-900 leading-tight">
                {point.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Delivery timeline */}
        <div ref={trackRef}>
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs font-mono font-bold uppercase tracking-[0.25em] text-slate-400 mb-12"
          >
            {t.speed.processLabel}
          </motion.h3>

          <div className="relative">
            {/* Rail */}
            <div className="hidden lg:block absolute top-7 left-[8%] right-[8%] h-1 bg-black/10 rounded-full">
              <motion.div
                style={{ scaleX: lineScale, originX: 0 }}
                className="h-full bg-black rounded-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
              {processSteps.map((stepId, idx) => {
                const step = t.speed.steps[stepId];
                if (!step) return null;
                const accent = STEP_ACCENTS[idx % STEP_ACCENTS.length];

                return (
                  <motion.div
                    key={stepId}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex flex-col items-center text-center lg:px-3"
                  >
                    <div
                      className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center font-syne font-extrabold text-lg neo-shadow-sm relative z-10 bg-white"
                      style={{ backgroundColor: accent }}
                    >
                      {idx + 1}
                    </div>

                    <span className="mt-4 px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-mono font-bold uppercase tracking-widest">
                      {step.duration}
                    </span>

                    <h4 className="mt-3 font-syne font-bold text-lg text-slate-900 leading-tight">
                      {step.title}
                    </h4>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-[280px]">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
