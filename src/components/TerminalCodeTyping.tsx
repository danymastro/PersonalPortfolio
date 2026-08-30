import React, { useEffect, useState } from 'react';

const CODE_LINES = [
  { text: '// TOP SECRET PROJECT — UNAUTHORIZED ACCESS PROHIBITED', color: 'text-slate-500' },
  { text: 'import CoreIntelligence', color: 'text-[#A78BFA]' },
  { text: 'import SpatialMemoryEngine', color: 'text-[#A78BFA]' },
  { text: '', color: '' },
  { text: 'struct MemoryEvolution {', color: 'text-[#4FD1C0]' },
  { text: '  let paradigm = "Reinventing how we save life moments"', color: 'text-white' },
  { text: '  let diaryToSocial = true', color: 'text-[#FF6B6B]' },
  { text: '  let status = "ACTIVE_STEALTH_DEVELOPMENT"', color: 'text-[#FDE047]' },
  { text: '}', color: 'text-[#4FD1C0]' },
  { text: '', color: '' },
  { text: '> compiling neural_cartography_layer... [OK]', color: 'text-emerald-400' },
  { text: '> encrypting core architecture... [COMPLETE]', color: 'text-emerald-400' },
  { text: '> ready for launch on iOS App Store (2026)', color: 'text-[#4FD1C0]' },
];

export const TerminalCodeTyping: React.FC = () => {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= CODE_LINES.length) {
      const resetTimer = window.setTimeout(() => {
        setLineIndex(0);
        setCharIndex(0);
      }, 4000);
      return () => window.clearTimeout(resetTimer);
    }

    const currentLine = CODE_LINES[lineIndex].text;

    if (charIndex < currentLine.length) {
      const timeout = window.setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, Math.floor(Math.random() * 25) + 15);
      return () => window.clearTimeout(timeout);
    } else {
      const lineTimeout = window.setTimeout(() => {
        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
      }, 180);
      return () => window.clearTimeout(lineTimeout);
    }
  }, [lineIndex, charIndex]);

  return (
    <div className="w-full h-full bg-[#0B1130] text-white p-4 sm:p-5 flex flex-col font-mono text-xs sm:text-[13px] select-none overflow-hidden relative border-2 border-black rounded-2xl shadow-xl">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-[#4FD1C0] rounded-full filter blur-[90px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#7A5AF8] rounded-full filter blur-[90px] opacity-20 pointer-events-none" />

      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF6B6B] border border-black/40 inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#FDE047] border border-black/40 inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#4ADE80] border border-black/40 inline-block" />
        </div>
        <div className="text-[10px] sm:text-[11px] text-white/50 font-bold tracking-wider truncate">
          danilo@apple-silicon: ~/stealth-project
        </div>
        <div className="text-[10px] font-bold text-[#4FD1C0] bg-[#4FD1C0]/15 px-2 py-0.5 rounded-full border border-[#4FD1C0]/30">
          BUILDING...
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 overflow-hidden space-y-1 z-10 leading-relaxed">
        {CODE_LINES.slice(0, lineIndex).map((line, idx) => (
          <div key={idx} className={`${line.color} min-h-[1.25rem] truncate`}>
            {line.text}
          </div>
        ))}

        {lineIndex < CODE_LINES.length && (
          <div className={`${CODE_LINES[lineIndex].color} min-h-[1.25rem] flex items-center`}>
            <span>{CODE_LINES[lineIndex].text.slice(0, charIndex)}</span>
            <span className="w-2 h-4 bg-[#4FD1C0] ml-0.5 animate-pulse inline-block" />
          </div>
        )}
      </div>

      {/* Terminal Footer Status */}
      <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] text-white/40 shrink-0 z-10">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Live Compilation Active
        </span>
        <span>Swift 6.0 • Native iOS</span>
      </div>
    </div>
  );
};
