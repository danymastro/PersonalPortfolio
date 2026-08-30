import React from 'react';
import { Mail, ArrowUpRight, ArrowUp } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { useLanguage } from '../i18n/LanguageContext';
import { scrollToTarget } from './SmoothScrollProvider';

interface FooterProps {
  onOpenContact: () => void;
}

export const ContactFooter: React.FC<FooterProps> = ({ onOpenContact }) => {
  const { personal } = PORTFOLIO_DATA;
  const { t } = useLanguage();

  return (
    <footer
      id="contact"
      className="bg-black text-[#FFFDF5] pt-24 pb-12 px-4 sm:px-8 rounded-t-[3rem] relative overflow-hidden mt-12"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Status Pill */}
        <div className="mb-6">
          <span className="px-4 py-2 border-2 border-white/20 bg-white/5 rounded-full text-xs font-mono font-bold uppercase tracking-widest text-[#4ADE80] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-ping" />
            <span>{t.footer.availableBadge}</span>
          </span>
        </div>

        {/* Massive Interactive Header */}
        <h2
          onClick={onOpenContact}
          className="text-[8.5vw] xs:text-[9vw] sm:text-[11vw] md:text-[10vw] lg:text-[9.5vw] xl:text-[9vw] leading-[0.9] font-extrabold tracking-tighter font-syne mb-8 hover:text-[#FDE047] transition-colors duration-300 cursor-pointer select-none whitespace-nowrap"
        >
          {t.footer.letsTalk}
        </h2>

        <p className="max-w-xl text-base sm:text-lg text-gray-400 mb-6 font-medium">
          {t.footer.description}
        </p>

        <p className="mb-10 text-sm sm:text-base font-mono font-bold text-[#FDE047] tracking-tight">
          {t.footer.prompt}
        </p>

        <button
          onClick={onOpenContact}
          className="mb-8 inline-flex items-center gap-2 px-8 py-4 bg-[#FDE047] text-black border-2 border-black font-extrabold text-base sm:text-lg rounded-full hover:bg-white transition-colors"
        >
          <span>{t.contactModal.title}</span>
          <ArrowUpRight className="w-5 h-5" />
        </button>

        {/* Big Email Button */}
        <a
          href={`mailto:${personal.email}`}
          className="inline-flex items-center gap-3 px-6 sm:px-10 py-3.5 sm:py-5 bg-[#2563EB] text-white font-extrabold text-sm sm:text-xl rounded-full hover:scale-105 hover:bg-[#FDE047] hover:text-black transition-all duration-300 border-2 border-white/20 shadow-2xl active:scale-95 max-w-full"
        >
          <span className="truncate">{personal.email}</span>
          <Mail className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
        </a>

        {/* Divider */}
        <div className="w-full h-px bg-white/15 my-16" />

        {/* Bottom Footer Bar */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium text-gray-400">
          <p>© {new Date().getFullYear()} {personal.name}. {t.footer.allRightsReserved}</p>

          <div className="flex flex-wrap items-center gap-6">
            {personal.socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1 font-mono text-xs uppercase"
              >
                <span>{s.name}</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            ))}
          </div>

          <button
            onClick={() => scrollToTarget('#hero')}
            className="p-2.5 rounded-full border border-white/20 bg-white/10 text-white hover:bg-[#FDE047] hover:text-black transition-all"
            aria-label={t.footer.backToTop}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
