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

        {/* Massive Interactive Header - well proportioned and fully responsive without horizontal overflow */}
        <h2
          onClick={onOpenContact}
          className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.95] font-extrabold tracking-tighter font-syne mb-6 sm:mb-8 hover:text-[#FDE047] transition-colors duration-300 cursor-pointer select-none max-w-full break-words"
        >
          {t.footer.letsTalk}
        </h2>

        <p className="max-w-xl text-sm sm:text-base md:text-lg text-gray-300 mb-4 sm:mb-6 font-medium leading-relaxed px-2">
          {t.footer.description}
        </p>

        <p className="mb-8 sm:mb-10 text-xs sm:text-sm md:text-base font-mono font-bold text-[#FDE047] tracking-tight">
          {t.footer.prompt}
        </p>

        {/* Action Buttons Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-xl mb-6">
          <button
            onClick={onOpenContact}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 bg-[#FDE047] text-black border-2 border-black font-extrabold text-sm sm:text-base rounded-full hover:bg-white transition-all neo-shadow-sm cursor-pointer shrink-0"
          >
            <span>{t.contactModal.title}</span>
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Big Email Button */}
          <a
            href={`mailto:${personal.email}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 bg-[#2563EB] text-white font-extrabold text-xs sm:text-sm md:text-base rounded-full hover:scale-105 hover:bg-[#D0FF71] hover:text-black transition-all duration-300 border-2 border-white/20 neo-shadow-sm active:scale-95 shrink-0"
          >
            <span className="truncate">{personal.email}</span>
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          </a>
        </div>

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
