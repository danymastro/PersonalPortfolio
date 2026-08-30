import React, { useState } from 'react';
import { SmoothScrollProvider } from './components/SmoothScrollProvider';
import { LanguageProvider } from './i18n/LanguageContext';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarqueeRibbon } from './components/MarqueeRibbon';
import { ProblemSolution } from './components/ProblemSolution';
import { Solutions } from './components/Solutions';
import { SelectedWorks } from './components/SelectedWorks';
import { VentureSection } from './components/VentureSection';
import { SpeedSection } from './components/SpeedSection';
import { StackSection } from './components/StackSection';
import { AboutSection } from './components/AboutSection';
import { ContactFooter } from './components/ContactFooter';
import { ProjectModal } from './components/ProjectModal';
import { ContactModal } from './components/ContactModal';
import { Project } from './data/portfolioData';

export function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const openContact = () => setContactModalOpen(true);

  return (
    <LanguageProvider>
      <SmoothScrollProvider>
        <div className="relative min-h-screen bg-[#FFFDF5] text-slate-900 font-space overflow-x-hidden selection:bg-[#F9A8D4] selection:text-black">
          <CustomCursor />
          <Navbar onOpenContact={openContact} />

          <main>
            {/* 1. Who I am */}
            <Hero onOpenContact={openContact} />
            <MarqueeRibbon />

            {/* 2. The problem you arrived with */}
            <ProblemSolution onOpenContact={openContact} />

            {/* 3. What I build to solve it */}
            <Solutions onOpenContact={openContact} />

            {/* 4. Proof: shipped work */}
            <SelectedWorks onSelectProject={(p) => setSelectedProject(p)} />

            {/* 5. Proof: my own product */}
            <VentureSection />

            {/* 6. Why it takes weeks, not quarters */}
            <SpeedSection />

            {/* 7. The tools behind it */}
            <StackSection />

            {/* 8. The person */}
            <AboutSection onOpenContact={openContact} />
          </main>

          <ContactFooter onOpenContact={openContact} />

          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
          <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
        </div>
      </SmoothScrollProvider>
    </LanguageProvider>
  );
}

export default App;
