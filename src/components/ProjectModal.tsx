import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, UserCog, Lock } from 'lucide-react';
import { Project } from '../data/portfolioData';
import { useLanguage } from '../i18n/LanguageContext';
import { ProjectMockup } from './ProjectMockup';
import { DecryptedText } from './DecryptedText';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { t } = useLanguage();

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (project) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  if (!project) return null;

  const copy = t.works.projects[project.id];
  if (!copy) return null;

  const isStealth = project.id === 'spotdiary';

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        data-lenis-prevent
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-3xl bg-[#FFFDF5] border-4 border-black rounded-3xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto neo-shadow-lg"
          data-lenis-prevent
        >
          {/* Header (Sticky at top) */}
          <div className="p-4 sm:p-6 border-b-4 border-black flex items-center justify-between bg-white shrink-0 z-20 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="px-3.5 py-1 rounded-full border-2 border-black text-xs font-mono font-bold uppercase text-black shrink-0"
                style={{ backgroundColor: project.accentColor }}
              >
                {copy.category}
              </span>
              <h2 className="font-syne font-extrabold text-xl sm:text-3xl text-slate-900 truncate">
                {isStealth ? <DecryptedText className="text-xl sm:text-3xl text-slate-900" /> : copy.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              aria-label={t.works.closeWindow}
              className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-[#FDE047] border-2 border-black neo-shadow-sm flex items-center justify-center hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div 
            className="p-5 sm:p-8 overflow-y-auto overscroll-contain space-y-6 flex-1 touch-pan-y"
            data-lenis-prevent
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="rounded-2xl overflow-hidden border-2 border-black aspect-[16/9] bg-stone-100 neo-shadow-sm flex items-center justify-center">
              <ProjectMockup projectId={project.id} />
            </div>

            <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-medium">
              {copy.overview}
            </p>

            {/* Role */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-black text-[#FFFDF5] neo-shadow-sm">
              <UserCog className="w-5 h-5 shrink-0 mt-0.5 text-[#FDE047]" />
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/50">
                  {t.works.roleLabel}
                </span>
                <span className="text-sm sm:text-base font-semibold">{copy.role}</span>
              </div>
            </div>

            {/* Vision & Innovation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border-2 border-black neo-shadow-sm space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-rose-600">
                  {t.works.theChallenge}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {copy.challenge}
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white border-2 border-black neo-shadow-sm space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-[#2563EB]">
                  {t.works.theSolution}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {copy.solution}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t-2 border-black flex items-center justify-between gap-4">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white border-2 border-black text-xs sm:text-sm font-bold font-mono neo-shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
              >
                {t.works.closeWindow}
              </button>

              {isStealth ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#162048] text-[#4FD1C0] border-2 border-black text-xs sm:text-sm font-mono font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>PREVISTO RILASCIO 2026</span>
                </div>
              ) : (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 rounded-xl bg-[#D0FF71] text-black border-2 border-black text-xs sm:text-sm font-bold neo-shadow-sm hover:bg-[#FDE047] transition-all flex items-center gap-1.5"
                >
                  <span>{t.works.liveProject}</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
