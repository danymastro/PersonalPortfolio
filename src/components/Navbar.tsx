import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { scrollToTarget } from './SmoothScrollProvider';

interface NavbarProps {
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.nav.solutions, target: '#solutions' },
    { label: t.nav.work, target: '#work' },
    { label: t.nav.venture, target: '#venture' },
    { label: t.nav.stack, target: '#stack' },
    { label: t.nav.about, target: '#about' },
  ];

  const handleNavClick = (target: string) => {
    setMobileMenuOpen(false);
    scrollToTarget(target);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-8 py-5 ${
          isScrolled
            ? 'bg-[#FFFDF5]/90 backdrop-blur-md border-b border-black/10 py-4 shadow-xs'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Left */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget('#hero');
            }}
            className="text-2xl font-bold font-syne tracking-tighter uppercase text-slate-900 z-50 hover:scale-105 transition-transform"
          >
            D/M<span className="text-[#2563EB]">.</span>
          </a>

          {/* Desktop Nav Center */}
          <div className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium tracking-tight text-slate-800">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.target)}
                className="hover:underline decoration-2 underline-offset-4 transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Area: Language Switcher & Contact Button */}
          <div className="flex items-center gap-3">
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-white border-2 border-black rounded-full p-1 neo-shadow-sm">
              <button
                onClick={() => setLanguage('it')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition-all ${
                  language === 'it'
                    ? 'bg-[#FDE047] text-black shadow-xs'
                    : 'text-slate-500 hover:text-black'
                }`}
              >
                IT
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#FDE047] text-black shadow-xs'
                    : 'text-slate-500 hover:text-black'
                }`}
              >
                EN
              </button>
            </div>

            {/* Let's Talk CTA */}
            <button
              onClick={onOpenContact}
              className="bg-black text-white px-5 py-2 rounded-full font-medium text-sm hover:scale-105 active:scale-95 transition-all duration-200 hidden sm:inline-flex items-center"
            >
              {t.nav.letsTalk}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-black/5 text-slate-900 border border-black/10"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#FFFDF5] md:hidden pt-24 px-6 flex flex-col justify-between pb-10 border-b-2 border-black"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <span className="text-xs uppercase tracking-widest text-slate-500 font-mono font-bold">
                  {t.nav.menu}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">Language:</span>
                  <button
                    onClick={() => setLanguage('it')}
                    className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                      language === 'it' ? 'bg-[#FDE047] border border-black' : 'text-slate-500'
                    }`}
                  >
                    IT
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                      language === 'en' ? 'bg-[#FDE047] border border-black' : 'text-slate-500'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.target)}
                    className="text-left text-3xl font-syne font-bold text-slate-900 py-2 border-b border-black/10 flex items-center justify-between hover:text-[#2563EB] transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-6 h-6 text-black/30" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-4 rounded-xl bg-black text-white font-bold text-base flex items-center justify-center gap-2"
              >
                <span>{t.nav.letsTalk}</span>
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
