import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { useLanguage } from '../i18n/LanguageContext';

interface AboutProps {
  onOpenContact: () => void;
}

export const AboutSection: React.FC<AboutProps> = ({ onOpenContact }) => {
  const { personal, aboutStats } = PORTFOLIO_DATA;
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 sm:py-32 px-4 sm:px-8 bg-white border-y-4 border-black relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Card with Animated Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-[#FDE047] rounded-3xl border-2 border-black rotate-3 neo-shadow" />

              <div className="relative bg-[#FFFDF5] border-2 border-black rounded-3xl p-6 sm:p-8 neo-shadow flex flex-col items-center text-center space-y-6">
                {/* Animated Logo Video with GIF fallback */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-[#120D1D] border-4 border-black overflow-hidden relative shadow-inner flex items-center justify-center">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-105"
                  >
                    <source src="/MascotteAnimata_VibesOut.mp4" type="video/mp4" />
                    <img
                      src="/MascotteAnimata_VibesOut.gif"
                      alt={personal.name}
                      className="w-full h-full object-cover"
                    />
                  </video>
                </div>

                <div className="space-y-1">
                  <h3 className="font-syne font-extrabold text-2xl sm:text-3xl text-slate-900">
                    {personal.name}
                  </h3>
                  <p className="text-[11px] font-mono font-bold text-[#2563EB] uppercase tracking-tight">
                    {t.about.roleTag}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-black text-white text-xs font-mono font-bold rounded-full -rotate-2">
                    {t.about.stickers.location}
                  </span>
                  <span className="px-3 py-1 bg-[#C084FC] text-black border border-black text-xs font-mono font-bold rounded-full rotate-2">
                    {t.about.stickers.founder}
                  </span>
                  <span className="px-3 py-1 bg-[#4ADE80] text-black border border-black text-xs font-mono font-bold rounded-full -rotate-1">
                    {t.about.stickers.speed}
                  </span>
                </div>

                <button
                  onClick={onOpenContact}
                  className="w-full py-3.5 bg-[#2563EB] text-white font-bold text-sm rounded-xl border-2 border-black neo-shadow-sm hover:bg-[#FDE047] hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  <span>{t.about.getInTouch}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-[#F9A8D4] border-2 border-black text-xs font-mono font-bold uppercase tracking-wider inline-block neo-shadow-sm">
                {t.about.badge}
              </span>
              <h2 className="text-4xl sm:text-6xl font-extrabold font-syne tracking-tighter text-slate-900 leading-tight">
                {t.about.titleLine1} <br />
                <span className="text-[#2563EB] underline decoration-4 underline-offset-8">
                  {t.about.titleHighlight}
                </span>{' '}
                {t.about.titleLine2}
              </h2>
            </div>

            <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              {t.about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {aboutStats.map((s) => {
                const copy = t.about.stats[s.id as keyof typeof t.about.stats];
                if (!copy) return null;
                return (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-black neo-shadow-sm text-center"
                  >
                    <p
                      className="font-syne font-extrabold text-3xl sm:text-4xl text-slate-900"
                      style={{ color: s.accent === '#FDE047' ? '#000' : s.accent }}
                    >
                      {s.value}
                    </p>
                    <p className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-tight mt-1">
                      {copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
