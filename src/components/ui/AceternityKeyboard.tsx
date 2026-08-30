import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, Command } from 'lucide-react';

interface AceternityKeyboardProps {
  onKeyPress?: (key: string) => void;
  className?: string;
  enableSound?: boolean;
}

// Realistic Web Audio API Mechanical Keyboard Sound Synthesizer
class MechanicalSoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playKey(keyName: string) {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const isSpace = keyName.toLowerCase() === 'space';
      const isEnter = keyName.toLowerCase() === 'return' || keyName.toLowerCase() === 'enter';

      // 1. High-frequency crisp click (contact switch click)
      const osc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isSpace ? 1200 : isEnter ? 1800 : 2800 + Math.random() * 600, now);
      filter.Q.setValueAtTime(4.0, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isSpace ? 400 : 800 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.025);

      clickGain.gain.setValueAtTime(0.3, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(filter);
      filter.connect(clickGain);
      clickGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);

      // 2. Low-frequency thock (key bottoming out on aluminum plate)
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(isSpace ? 280 : isEnter ? 360 : 480 + Math.random() * 80, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(isSpace ? 0.35 : 0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
    } catch {
      // Audio fallback silent
    }
  }
}

const soundEngine = new MechanicalSoundEngine();

interface KeyDef {
  code: string;
  label: string;
  subLabel?: string;
  w?: string; // custom width class
  accent?: boolean;
}

const KEYBOARD_ROWS: KeyDef[][] = [
  // Function Row
  [
    { code: 'Escape', label: 'esc', w: 'w-7 sm:w-8' },
    { code: 'F1', label: 'F1' },
    { code: 'F2', label: 'F2' },
    { code: 'F3', label: 'F3' },
    { code: 'F4', label: 'F4' },
    { code: 'F5', label: 'F5' },
    { code: 'F6', label: 'F6' },
    { code: 'F7', label: 'F7' },
    { code: 'F8', label: 'F8' },
    { code: 'F9', label: 'F9' },
    { code: 'F10', label: 'F10' },
    { code: 'F11', label: 'F11' },
    { code: 'F12', label: 'F12' },
    { code: 'Power', label: '⏻', w: 'w-7 sm:w-8', accent: true },
  ],
  // Number Row
  [
    { code: 'Backquote', label: '~', subLabel: '`' },
    { code: 'Digit1', label: '1', subLabel: '!' },
    { code: 'Digit2', label: '2', subLabel: '@' },
    { code: 'Digit3', label: '3', subLabel: '#' },
    { code: 'Digit4', label: '4', subLabel: '$' },
    { code: 'Digit5', label: '5', subLabel: '%' },
    { code: 'Digit6', label: '6', subLabel: '^' },
    { code: 'Digit7', label: '7', subLabel: '&' },
    { code: 'Digit8', label: '8', subLabel: '*' },
    { code: 'Digit9', label: '9', subLabel: '(' },
    { code: 'Digit0', label: '0', subLabel: ')' },
    { code: 'Minus', label: '-', subLabel: '_' },
    { code: 'Equal', label: '=', subLabel: '+' },
    { code: 'Backspace', label: 'delete', w: 'flex-1 sm:w-14' },
  ],
  // QWERTY Row
  [
    { code: 'Tab', label: 'tab', w: 'w-10 sm:w-12' },
    { code: 'KeyQ', label: 'Q' },
    { code: 'KeyW', label: 'W' },
    { code: 'KeyE', label: 'E' },
    { code: 'KeyR', label: 'R' },
    { code: 'KeyT', label: 'T' },
    { code: 'KeyY', label: 'Y' },
    { code: 'KeyU', label: 'U' },
    { code: 'KeyI', label: 'I' },
    { code: 'KeyO', label: 'O' },
    { code: 'KeyP', label: 'P' },
    { code: 'BracketLeft', label: '[', subLabel: '{' },
    { code: 'BracketRight', label: ']', subLabel: '}' },
    { code: 'Backslash', label: '\\', subLabel: '|', w: 'w-8 sm:w-10' },
  ],
  // ASDF Row
  [
    { code: 'CapsLock', label: 'caps lock', w: 'w-12 sm:w-14' },
    { code: 'KeyA', label: 'A' },
    { code: 'KeyS', label: 'S' },
    { code: 'KeyD', label: 'D' },
    { code: 'KeyF', label: 'F' },
    { code: 'KeyG', label: 'G' },
    { code: 'KeyH', label: 'H' },
    { code: 'KeyJ', label: 'J' },
    { code: 'KeyK', label: 'K' },
    { code: 'KeyL', label: 'L' },
    { code: 'Semicolon', label: ';', subLabel: ':' },
    { code: 'Quote', label: "'", subLabel: '"' },
    { code: 'Enter', label: 'return', w: 'flex-1 sm:w-16', accent: true },
  ],
  // ZXCV Row
  [
    { code: 'ShiftLeft', label: 'shift', w: 'w-14 sm:w-16' },
    { code: 'KeyZ', label: 'Z' },
    { code: 'KeyX', label: 'X' },
    { code: 'KeyC', label: 'C' },
    { code: 'KeyV', label: 'V' },
    { code: 'KeyB', label: 'B' },
    { code: 'KeyN', label: 'N' },
    { code: 'KeyM', label: 'M' },
    { code: 'Comma', label: ',', subLabel: '<' },
    { code: 'Period', label: '.', subLabel: '>' },
    { code: 'Slash', label: '/', subLabel: '?' },
    { code: 'ShiftRight', label: 'shift', w: 'flex-1 sm:w-16' },
  ],
  // Bottom Row
  [
    { code: 'Fn', label: 'fn', w: 'w-7 sm:w-8' },
    { code: 'ControlLeft', label: '⌃', subLabel: 'control', w: 'w-8 sm:w-9' },
    { code: 'AltLeft', label: '⌥', subLabel: 'option', w: 'w-8 sm:w-9' },
    { code: 'MetaLeft', label: '⌘', subLabel: 'command', w: 'w-10 sm:w-12', accent: true },
    { code: 'Space', label: '', w: 'flex-1 min-w-[100px] sm:min-w-[140px]' },
    { code: 'MetaRight', label: '⌘', subLabel: 'command', w: 'w-10 sm:w-12', accent: true },
    { code: 'AltRight', label: '⌥', subLabel: 'option', w: 'w-8 sm:w-9' },
    { code: 'ArrowLeft', label: '◀', w: 'w-6 sm:w-7' },
    { code: 'ArrowUp', label: '▲', subLabel: '▼', w: 'w-6 sm:w-7' },
    { code: 'ArrowRight', label: '▶', w: 'w-6 sm:w-7' },
  ],
];

export const AceternityKeyboard: React.FC<AceternityKeyboardProps> = ({
  onKeyPress,
  className = '',
  enableSound = true,
}) => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(enableSound);
  const [lastKeyPressed, setLastKeyPressed] = useState<string>('Ready');
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerKeyAction = useCallback(
    (code: string, label: string) => {
      if (soundEnabled) {
        soundEngine.playKey(label || code);
      }
      setLastKeyPressed(label || code);
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.add(code);
        return next;
      });

      setTimeout(() => {
        setActiveKeys((prev) => {
          const next = new Set(prev);
          next.delete(code);
          return next;
        });
      }, 150);

      if (onKeyPress) {
        onKeyPress(label || code);
      }
    },
    [soundEnabled, onKeyPress]
  );

  // Global physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Find matching key
      let matchedCode = e.code;
      if (e.key === ' ') matchedCode = 'Space';

      if (soundEnabled) {
        soundEngine.playKey(e.key);
      }
      setLastKeyPressed(e.key.length === 1 ? e.key.toUpperCase() : e.key);

      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.add(matchedCode);
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let matchedCode = e.code;
      if (e.key === ' ') matchedCode = 'Space';

      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(matchedCode);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [soundEnabled]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl border-2 border-black bg-[#121214] p-3 sm:p-5 neo-shadow-lg text-white select-none ${className}`}
    >
      {/* Keyboard Top Status Bar */}
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4 px-1 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C] border border-black/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FDE047] border border-black/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] border border-black/40" />
          </div>
          <span className="text-[11px] font-mono font-bold text-white/50 tracking-wider uppercase ml-1 flex items-center gap-1.5">
            <Command className="w-3 h-3 text-[#D0FF71]" />
            <span>Mechanical Magic Keyboard</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Last key pressed indicator */}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-[#D0FF71] border border-white/10">
            Key: {lastKeyPressed}
          </span>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-colors cursor-pointer border ${
              soundEnabled
                ? 'bg-[#D0FF71] text-black border-black neo-shadow-sm'
                : 'bg-white/10 text-white/60 border-white/20 hover:text-white'
            }`}
            title={soundEnabled ? 'Disattiva suono' : 'Attiva suono'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden xs:inline">Sound ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 stroke-[2]" />
                <span className="hidden xs:inline">Mute</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3D Keyboard Body Plate */}
      <div className="bg-[#1C1C20] p-2 sm:p-3 rounded-2xl border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] flex flex-col gap-1 sm:gap-1.5 overflow-x-auto">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1 sm:gap-1.5 justify-between min-w-[300px]">
            {row.map((k) => {
              const isActive = activeKeys.has(k.code);
              const defaultWidth = k.w || 'flex-1 min-w-[20px] sm:min-w-[26px]';

              return (
                <button
                  key={k.code}
                  type="button"
                  onClick={() => triggerKeyAction(k.code, k.label)}
                  className={`relative group ${defaultWidth} h-7 sm:h-9 rounded-lg sm:rounded-xl font-mono text-[9px] sm:text-[11px] font-semibold transition-all duration-75 flex flex-col items-center justify-center cursor-pointer ${
                    isActive
                      ? 'translate-y-0.5 bg-[#D0FF71] text-black shadow-[0_0_12px_rgba(208,255,113,0.5)] border-black'
                      : k.accent
                      ? 'bg-[#27272A] text-[#D0FF71] border-b-2 border-black/80 hover:bg-[#323238]'
                      : 'bg-[#2A2A2E] text-white/80 border-b-2 border-black/80 hover:bg-[#38383E] hover:text-white'
                  } border border-white/10 shadow-sm`}
                  style={{
                    boxShadow: isActive
                      ? 'inset 0 2px 4px rgba(0,0,0,0.3)'
                      : '0 2px 0 #0D0D0F, 0 3px 4px rgba(0,0,0,0.4)',
                  }}
                >
                  {k.subLabel && (
                    <span className="text-[7px] sm:text-[8px] opacity-40 leading-none mb-0.5">
                      {k.subLabel}
                    </span>
                  )}
                  <span className="leading-none">{k.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Interactive Helper Hint */}
      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-white/40 px-1">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#D0FF71]" />
          <span>Clicca i tasti o digita sulla tua tastiera</span>
        </span>
        <span className="text-[#D0FF71]">Audio Synth HD</span>
      </div>
    </div>
  );
};
