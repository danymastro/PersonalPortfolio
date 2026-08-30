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

    default:
      return (
        <div className="w-full h-full bg-stone-900 text-white p-6 flex flex-col justify-center items-center">
          <Sparkles className="w-10 h-10 text-[#FDE047] mb-2" />
          <p className="font-syne font-bold text-lg">{projectId}</p>
        </div>
      );
  }
};
