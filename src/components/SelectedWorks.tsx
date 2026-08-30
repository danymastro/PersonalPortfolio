import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Star, Lock } from 'lucide-react';
import { PORTFOLIO_DATA, Project } from '../data/portfolioData';
import { useLanguage } from '../i18n/LanguageContext';
import { ProjectMockup } from './ProjectMockup';
import { DecryptedText } from './DecryptedText';

interface SelectedWorksProps {
  onSelectProject: (project: Project) => void;
}

export const SelectedWorks: React.FC<SelectedWorksProps> = ({ onSelectProject }) => {
  const { projects } = PORTFOLIO_DATA;
  const { t } = useLanguage();

  return (
    <section id="work" className="py-24 sm:py-32 px-4 sm:px-8 bg-white relative border-b-4 border-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 rounded-full bg-[#FDE047] border-2 border-black text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-6 neo-shadow-sm"
            >
              {t.works.eyebrow}
            </motion.span>

            <h2 className="text-5xl sm:text-7xl md:text-8xl font-extrabold font-syne tracking-tighter text-slate-900 leading-none">
              {t.works.titleMain} <br />
              <span className="text-[#2563EB]">{t.works.titleHighlight}</span>
            </h2>
          </div>

          <p className="text-base sm:text-lg font-medium text-slate-600 max-w-md md:text-right leading-relaxed">
            {t.works.subtitle}
          </p>
        </div>

        {/* Projects */}
        <div className="flex flex-col gap-24 sm:gap-32">
          {projects.map((project, idx) => {
            const copy = t.works.projects[project.id];
            if (!copy) return null;

            const isEven = idx % 2 === 0;
            const isProduct = project.kind === 'product';
            const isStealth = project.id === 'spotdiary';

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
                className="project-card group relative w-full lg:w-11/12 mx-auto"
              >
                {/* Offset accent block */}
                <div
                  className={`absolute inset-0 rounded-3xl border-2 border-black transform ${project.rotation} ${project.hoverRotation} transition-transform duration-500 z-0`}
                  style={{ backgroundColor: project.accentColor }}
                />

                <div className="relative bg-white rounded-3xl border-2 border-black p-6 sm:p-10 z-10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2 neo-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Visual Mockup Preview */}
                    <div className={`lg:col-span-6 ${isEven ? '' : 'lg:order-2'}`}>
                      <div
                        onClick={() => onSelectProject(project)}
                        className="aspect-video rounded-2xl overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500 cursor-pointer shadow-sm group/card flex items-center justify-center bg-transparent"
                      >
                        {/* Custom Rich UI Mockup */}
                        <ProjectMockup projectId={project.id} />

                        {/* Interactive overlay on hover */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <span className="px-4 py-2 rounded-full bg-black text-white font-mono text-xs font-bold neo-shadow-sm">
                            {t.works.exploreCaseStudy}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info Side */}
                    <div className={`lg:col-span-6 space-y-6 ${isEven ? '' : 'lg:order-1'}`}>
                      <div>
                        {/* Category & Badge Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3.5 py-1 bg-black text-white text-xs font-bold font-mono uppercase tracking-wider rounded-full">
                            {copy.category}
                          </span>
                          <span
                            className="px-3.5 py-1 text-xs font-bold font-mono uppercase tracking-wider rounded-full border-2 border-black flex items-center gap-1.5 text-black"
                            style={{ backgroundColor: project.accentColor }}
                          >
                            {isStealth ? (
                              <Lock className="w-3 h-3 text-black" />
                            ) : (
                              <Star className="w-3 h-3 fill-black" />
                            )}
                            {copy.badge}
                          </span>
                          <span className="px-3.5 py-1 bg-transparent border-2 border-black text-black text-xs font-bold font-mono tracking-wider rounded-full">
                            {project.year}
                          </span>
                        </div>

                        {/* Project Title (Decrypted Animation for stealth project) */}
                        <h3 className="text-3xl sm:text-5xl font-extrabold font-syne tracking-tighter text-slate-900 mb-3 flex items-center gap-2">
                          {isStealth ? (
                            <DecryptedText className="text-3xl sm:text-5xl text-slate-900" />
                          ) : (
                            copy.title
                          )}
                        </h3>

                        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                          {copy.subtitle}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex flex-wrap items-center gap-5">
                        <button
                          onClick={() => onSelectProject(project)}
                          className="flex items-center gap-2 text-lg sm:text-xl font-bold font-syne underline decoration-2 underline-offset-4 hover:text-[#2563EB] transition-colors"
                        >
                          <span>{t.works.caseStudyBtn}</span>
                          <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                        </button>

                        {!isStealth && isProduct && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-sm font-bold font-mono text-slate-600 hover:text-black transition-colors"
                          >
                            <span>{t.works.liveProject}</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Note */}
        <p className="mt-16 text-center text-xs sm:text-sm font-mono text-slate-400 max-w-2xl mx-auto">
          {t.works.blueprintNote}
        </p>
      </div>
    </section>
  );
};
