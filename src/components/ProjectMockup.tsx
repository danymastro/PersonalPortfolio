import React from 'react';
import { Sparkles } from 'lucide-react';
import { TerminalCodeTyping } from './TerminalCodeTyping';

interface ProjectMockupProps {
  projectId: string;
}

export const ProjectMockup: React.FC<ProjectMockupProps> = ({ projectId }) => {
  switch (projectId) {
    case 'vibesout':
      return (
        <div className="w-full h-full bg-transparent flex items-center justify-center select-none relative overflow-hidden">
          {/* Animated Mascot Logo enlarged to fill the frame nicely */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain scale-[2.4] sm:scale-[2.8] md:scale-[3.1]"
          >
            <source src="/MascotteAnimata_VibesOut.mp4" type="video/mp4" />
            <img
              src="/MascotteAnimata_VibesOut.gif"
              alt="VibesOut Animated Logo"
              className="w-full h-full object-contain scale-[2.4] sm:scale-[2.8] md:scale-[3.1]"
            />
          </video>
        </div>
      );

    case 'spotdiary':
      return <TerminalCodeTyping />;

    case 'budokan':
      return (
        <div className="w-full h-full bg-[#050505] rounded-2xl overflow-hidden border border-[#262626] flex flex-col group/budokan select-none relative">
          {/* Clean browser chrome header */}
          <div className="bg-[#111111] px-3 sm:px-4 py-2 sm:py-2.5 border-b border-[#262626] flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#f97316]" />
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white/20" />
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white/20" />
              <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs font-mono font-medium text-gray-400 truncate">
                budokan-karate-campobasso.budokan-cb.workers.dev
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#f97316] bg-[#f97316]/10 border border-[#f97316]/30 px-2 py-0.5 rounded-full shrink-0 ml-2">
              LIVE
            </span>
          </div>

          {/* Actual Real Screenshot of the website */}
          <div className="flex-1 w-full h-full overflow-hidden relative bg-[#050505]">
            <img
              src="/budokan-preview.png"
              alt="Budokan Karate Campobasso Live Site"
              className="w-full h-full object-cover object-top group-hover/budokan:scale-[1.03] transition-transform duration-500"
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="w-full h-full bg-stone-900 text-white p-6 flex flex-col justify-center items-center">
          <Sparkles className="w-10 h-10 text-[#FDE047] mb-2" />
          <p className="font-syne font-bold text-lg">{projectId}</p>
        </div>
      );
  }
};
