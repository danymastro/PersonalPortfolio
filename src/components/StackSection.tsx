import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Server, Database, Cloud, Bot, Wand2, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { useLanguage } from '../i18n/LanguageContext';

const ICONS: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-7 h-7 stroke-[2.2]" />,
  Server: <Server className="w-7 h-7 stroke-[2.2]" />,
  Database: <Database className="w-7 h-7 stroke-[2.2]" />,
  Cloud: <Cloud className="w-7 h-7 stroke-[2.2]" />,
  Bot: <Bot className="w-7 h-7 stroke-[2.2]" />,
  Wand2: <Wand2 className="w-7 h-7 stroke-[2.2]" />,
};

export const StackSection: React.FC = () => {
  const { stackGroups, stackItems } = PORTFOLIO_DATA;
  const { t } = useLanguage();

  return (
    <section id="stack" className="relative py-24 sm:py-32 px-4 sm:px-8 bg-[#FFFDF5] overflow-hidden">
      <div className="absolute right-0 top-1/4 w-72 h-72 bg-[#C084FC] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-72 h-72 bg-[#4ADE80] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-5">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-white border-2 border-black text-[10px] font-mono font-bold uppercase tracking-[0.2em] neo-shadow-sm"
          >
            {t.stack.eyebrow}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-extrabold font-syne tracking-tighter text-slate-900 leading-tight break-words"
          >
            {t.stack.titleMain}{' '}
            <span className="relative inline-block px-4">
              <span className="absolute inset-0 bg-[#FDE047] -skew-y-2 transform -z-10 border-2 border-black neo-shadow-sm" />
              {t.stack.titleHighlight}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg font-medium text-slate-600"
          >
            {t.stack.subtitle}
          </motion.p>
        </div>

        {/* Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {stackGroups.map((group, idx) => {
            const copy = t.stack.groups[group.id];
            const items = stackItems[group.id] ?? [];
            if (!copy) return null;

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
                whileHover={{ y: -6 }}
                className="group p-7 sm:p-8 bg-white border-2 border-black rounded-3xl neo-shadow flex flex-col gap-5"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="p-3 rounded-2xl border-2 border-black text-black transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{ backgroundColor: group.accent }}
                  >
                    {ICONS[group.icon] ?? <Sparkles className="w-7 h-7" />}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-black/30 tracking-widest">
                    0{idx + 1}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="text-2xl font-extrabold font-syne tracking-tight text-slate-900">
                    {copy.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{copy.blurb}</p>
                </div>

                <ul className="flex flex-wrap gap-1.5 pt-4 border-t-2 border-black/10">
                  {items.map((tech) => (
                    <li
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-stone-100 border border-stone-300 text-[11px] font-mono font-bold text-slate-700"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
