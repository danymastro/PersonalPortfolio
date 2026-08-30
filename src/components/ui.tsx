import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`container-page ${className}`}>{children}</div>;

/* ------------------------------------------------------------------ */
/* Reveal — the single scroll animation used site-wide                 */
/* ------------------------------------------------------------------ */

export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}> = ({ children, delay = 0, y = 24, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Section header — eyebrow + heading with one italic serif word       */
/* ------------------------------------------------------------------ */

interface SectionHeadingProps {
  eyebrow: string;
  /** Text before the italic serif accent word */
  lead: string;
  /** The italic serif accent word */
  accent?: string;
  /** Text after the accent word */
  trail?: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
  children?: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  lead,
  accent,
  trail,
  description,
  align = 'left',
  tone = 'light',
  className = '',
  children,
}) => {
  const centered = align === 'center';
  const dark = tone === 'dark';

  return (
    <div
      className={`flex flex-col ${
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      } gap-6 ${className}`}
    >
      <div className={`${centered ? 'max-w-[640px]' : 'max-w-[600px]'}`}>
        <Reveal>
          <span
            className="eyebrow"
            style={dark ? { color: 'rgba(251,247,243,0.62)' } : undefined}
          >
            {eyebrow}
          </span>
        </Reveal>

        <Reveal delay={0.06}>
          <h2
            className={`mt-5 text-4xl md:text-5xl lg:text-6xl text-display ${
              dark ? 'text-cream' : 'text-ink'
            }`}
          >
            {lead}
            {accent && (
              <>
                {' '}
                <span className="accent">{accent}</span>
              </>
            )}
            {trail}
          </h2>
        </Reveal>

        {description && (
          <Reveal delay={0.12}>
            <p
              className={`mt-6 text-base md:text-lg tracking-body ${
                dark ? 'text-cream/60' : 'text-body'
              } ${centered ? 'mx-auto' : ''} max-w-[520px]`}
            >
              {description}
            </p>
          </Reveal>
        )}
      </div>

      {children && <Reveal delay={0.12}>{children}</Reveal>}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* CountUp — the reference site renders "0" then animates to value     */
/* ------------------------------------------------------------------ */

export const CountUp: React.FC<{
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}> = ({ value, decimals = 0, prefix = '', suffix = '', className = '', duration = 2 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(
    () =>
      spring.on('change', (latest) => {
        setDisplay(latest.toFixed(decimals));
      }),
    [spring, decimals]
  );

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

/**
 * Splits a display stat such as "250+", "99%", "12.4M" or "4.9/5" into a
 * numeric part and a suffix, so it can animate from 0 like the reference site.
 */
export function parseStat(value: string) {
  const match = value.match(/^([\d.]+)(.*)$/);
  if (!match) return { number: 0, suffix: value, decimals: 0 };
  const raw = match[1];
  return {
    number: parseFloat(raw),
    suffix: match[2] ?? '',
    decimals: raw.includes('.') ? raw.split('.')[1].length : 0,
  };
}

/* ------------------------------------------------------------------ */
/* Marquee                                                             */
/* ------------------------------------------------------------------ */

export const Marquee: React.FC<{
  children: React.ReactNode;
  speed?: 'normal' | 'slow';
  className?: string;
}> = ({ children, speed = 'normal', className = '' }) => (
  <div className={`marquee-mask overflow-hidden ${className}`}>
    <div className={`marquee-track ${speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee'}`}>
      {children}
      {children}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Arrow used in buttons and cards                                     */
/* ------------------------------------------------------------------ */

export const ArrowIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4.5 11.5L11.5 4.5" />
    <path d="M5.5 4.5h6v6" />
  </svg>
);
