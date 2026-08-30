import React, { useEffect, useState } from 'react';

interface DecryptedTextProps {
  /** The base text to encrypt/decrypt partially (e.g. "S••••D••••") */
  targetText?: string;
  /** Character glyphs used for scramble effect */
  characters?: string;
  /** Speed of shuffle in milliseconds */
  speed?: number;
  className?: string;
}

const DEFAULT_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const REVEALED_TEMPLATE = ['S', '•', '•', '•', 'D', '•', '•', '•', '•'];

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  characters = DEFAULT_CHARS,
  speed = 70,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState('S••••D••••');

  useEffect(() => {
    let frame = 0;
    const interval = window.setInterval(() => {
      frame++;
      
      const scrambled = REVEALED_TEMPLATE.map((char, index) => {
        // Keep 'S' at index 0 and 'D' at index 4 fixed or occasionally glitching
        if (index === 0) return 'S';
        if (index === 4) return 'D';
        if (index === 8 && frame % 40 < 10) return 'Y'; // occasionally hint 'Y'

        // Scramble the rest with random hacker glyphs or stealth dots
        if (Math.random() > 0.4) {
          return characters[Math.floor(Math.random() * characters.length)];
        }
        return ['█', '_', '#', '?', '*', '•'][Math.floor(Math.random() * 6)];
      }).join('');

      setDisplayText(scrambled);
    }, speed);

    return () => window.clearInterval(interval);
  }, [characters, speed]);

  return (
    <span className={`font-mono font-extrabold tracking-wider select-none ${className}`}>
      {displayText}
    </span>
  );
};
