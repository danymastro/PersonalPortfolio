import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { useLanguage } from '../i18n/LanguageContext';

export const MarqueeRibbon: React.FC = () => {
  const { marqueeColors } = PORTFOLIO_DATA;
  const { t } = useLanguage();

  // Repeat so the track never runs out mid-scroll
  const list = [...t.marquee, ...t.marquee, ...t.marquee];

  return (
    <div className="w-full bg-black py-5 overflow-hidden border-y-4 border-black rotate-1 scale-105 z-20 relative my-16 shadow-lg">
      <div className="whitespace-nowrap flex animate-marquee-smooth items-center">
        {list.map((word, idx) => (
          <React.Fragment key={`${word}-${idx}`}>
            <span
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold mx-6 tracking-tighter font-syne select-none"
              style={{ color: marqueeColors[idx % marqueeColors.length] }}
            >
              {word}
            </span>
            <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mx-6 tracking-tighter font-syne">
              •
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
