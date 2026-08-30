import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Lock, RotateCw, ExternalLink, Loader2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { useLanguage } from '../i18n/LanguageContext';

const EMBED_WIDTH = 1280;
const EMBED_HEIGHT = 820;

/**
 * Real live embedded preview of vibesout.com inside custom browser chrome.
 */
const LiveRealSiteEmbed: React.FC = () => {
  const { t } = useLanguage();
  const { venture } = PORTFOLIO_DATA;

  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [loaded, setLoaded] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Dynamically compute scale factor based on container width
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const updateScale = () => {
      if (el.clientWidth > 0) {
        setScale(el.clientWidth / EMBED_WIDTH);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleReload = () => {
    setLoaded(false);
    setReloadKey((k) => k + 1);
  };

  return (
    <div className="relative group">
      {/* Offset Neo-Brutalist shadow backdrop */}
      <div
        className="absolute inset-0 rounded-3xl border-2 border-black rotate-2 -z-10 group-hover:rotate-3 transition-transform duration-300"
        style={{ backgroundColor: venture.accent }}
      />

      <div className="bg-white border-2 border-black rounded-3xl overflow-hidden neo-shadow-lg text-slate-900 flex flex-col">
        {/* Browser Chrome Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#FFFDF5] border-b-2 border-black shrink-0">
          <div className="flex gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#FB923C] border border-black" />
            <span className="w-3 h-3 rounded-full bg-[#FDE047] border border-black" />
            <span className="w-3 h-3 rounded-full bg-[#4ADE80] border border-black" />
          </div>

          {/* URL address bar */}
          <div className="flex-1 flex items-center gap-2 px-3.5 py-1.5 bg-white border-2 border-black rounded-full min-w-0">
            <Lock className="w-3 h-3 text-[#16A34A] shrink-0" />
            <span className="text-xs font-mono font-bold text-slate-800 truncate">
              https://{venture.domain}
            </span>
          </div>

          {/* Reload button */}
          <button
            onClick={handleReload}
            aria-label={t.venture.reloadLabel}
            title={t.venture.reloadLabel}
            className="w-7 h-7 rounded-full border-2 border-black bg-white flex items-center justify-center hover:bg-[#FDE047] transition-colors cursor-pointer shrink-0"
          >
            <RotateCw className="w-3 h-3 text-slate-800" />
          </button>

          {/* Direct link */}
          <a
            href={venture.url}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#D0FF71] border-2 border-black rounded-full text-[11px] font-mono font-bold text-black neo-shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all shrink-0"
          >
            <span>{t.venture.visitCta}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Real Live Website Viewport */}
        <div
          ref={frameRef}
          className="relative w-full bg-[#0B1130] overflow-hidden"
          style={{ height: Math.max(300, EMBED_HEIGHT * scale) }}
          data-lenis-prevent
        >
          {/* Loading Spinner */}
          {!loaded && (
            <div className="absolute inset-0 bg-[#0B1130] flex flex-col items-center justify-center gap-3 z-10 text-white">
              <Loader2 className="w-8 h-8 text-[#D0FF71] animate-spin" />
              <span className="text-xs font-mono text-white/70">
                Caricamento live di {venture.domain}...
              </span>
            </div>
          )}

          {/* The Real Website iframe */}
          <iframe
            key={reloadKey}
            src={venture.url}
            title="VibesOut Official Live Site"
            onLoad={() => setLoaded(true)}
            className="absolute top-0 left-0 border-0"
            style={{
              width: EMBED_WIDTH,
              height: EMBED_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              pointerEvents: interactive ? 'auto' : 'none',
            }}
          />

          {/* Click to interact shield (preserves page scrolling until clicked) */}
          {!interactive && loaded && (
            <button
              onClick={() => setInteractive(true)}
              className="absolute inset-0 flex items-end justify-center pb-6 bg-black/10 hover:bg-black/20 transition-colors group/shield cursor-pointer"
            >
              <span className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-mono font-bold neo-shadow-sm group-hover/shield:bg-[#2563EB] transition-colors flex items-center gap-2">
                <span>{t.venture.liveLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D0FF71]" />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const VentureSection: React.FC = () => {
  const { venture } = PORTFOLIO_DATA;
  const { t } = useLanguage();

  return (
    <section
      id="venture"
      className="relative py-20 sm:py-28 px-4 sm:px-8 bg-black text-[#FFFDF5] overflow-hidden"
    >
      <div className="absolute -left-24 top-1/3 w-96 h-96 rounded-full bg-[#D0FF71] blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute -right-24 bottom-1/4 w-96 h-96 rounded-full bg-[#2563EB] blur-[120px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Story (Streamlined & punchy) */}
        <div className="lg:col-span-5 space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#D0FF71]"
          >
            {t.venture.eyebrow}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold font-syne tracking-tighter leading-[0.95] break-words"
          >
            {t.venture.titleLead}{' '}
            <span className="text-[#D0FF71]">{t.venture.titleAccent}</span>
          </motion.h2>

          {/* Brand line */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <span
              className="px-4 py-1.5 rounded-full border-2 border-black text-black font-syne font-extrabold text-lg"
              style={{ backgroundColor: venture.accent }}
            >
              {venture.name}
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-white/50">
              {t.venture.role}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg text-white/80 leading-relaxed font-normal"
          >
            {t.venture.paragraphs[0]}
          </motion.p>

          <ul className="space-y-2.5">
            {t.venture.bullets.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-center gap-3 text-sm sm:text-base text-white/90 font-medium"
              >
                <span className="w-5 h-5 rounded-full bg-[#D0FF71] border-2 border-black flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3] text-black" />
                </span>
                <span>{b}</span>
              </motion.li>
            ))}
          </ul>

          <div className="pt-2">
            <a
              href={venture.url}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D0FF71] text-black border-2 border-black font-bold text-base hover:bg-[#FDE047] transition-colors neo-shadow-sm"
            >
              <span>{t.venture.visitCta}</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Real Live Site Embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
        >
          <LiveRealSiteEmbed />
        </motion.div>
      </div>
    </section>
  );
};
