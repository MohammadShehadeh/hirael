'use client';

import * as React from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';

import { cn } from '@/lib/utils';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const noiseDataUri = (baseFrequency: number, numOctaves: number) => {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>` +
    `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='${numOctaves}' stitchTiles='stitch'/>` +
    `<feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter>` +
    `<rect width='100%' height='100%' filter='url(#n)'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

const OVERLAY_NOISE = noiseDataUri(0.85, 3);
const BG_NOISE = noiseDataUri(0.9, 4);

const HERO_GRADIENT =
  'radial-gradient(45% 45% at 28% 30%, rgba(222,219,200,0.16), transparent 70%),' +
  'radial-gradient(42% 42% at 73% 62%, rgba(196,162,120,0.22), transparent 72%),' +
  'radial-gradient(70% 55% at 50% 112%, rgba(36,30,22,0.92), transparent 72%),' +
  '#070707';

const CARD_GRADIENT =
  'radial-gradient(55% 55% at 32% 28%, rgba(222,219,200,0.14), transparent 70%),' +
  'radial-gradient(50% 50% at 72% 78%, rgba(150,138,116,0.20), transparent 72%),' +
  '#0b0a09';

const VIGNETTE = 'radial-gradient(125% 120% at 50% 0%, transparent 52%, rgba(0,0,0,0.55) 100%)';

export const NoiseOverlay = ({
  variant = 'overlay',
  className,
}: {
  variant?: 'overlay' | 'bg';
  className?: string;
}) => {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: variant === 'overlay' ? OVERLAY_NOISE : BG_NOISE,
        backgroundSize: '160px 160px',
      }}
    />
  );
};

export const CinematicBackground = ({
  variant = 'hero',
  className,
}: {
  variant?: 'hero' | 'card';
  className?: string;
}) => {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className={cn('absolute inset-0 overflow-hidden bg-black', className)}>
      <motion.div
        className="absolute -inset-1/3"
        style={{
          background: variant === 'hero' ? HERO_GRADIENT : CARD_GRADIENT,
          filter: 'blur(40px)',
        }}
        animate={
          reduce
            ? undefined
            : {
                x: ['-3%', '3%', '-3%'],
                y: ['-2%', '2%', '-2%'],
                rotate: [0, 6, 0],
                scale: [1, 1.12, 1],
              }
        }
        transition={{
          duration: 34,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />
      <div className="absolute inset-0" style={{ background: VIGNETTE }} />
    </div>
  );
};

const WithAsterisk = ({ word }: { word: string }) => {
  const chars = Array.from(word);
  const last = chars.pop() ?? '';
  return (
    <>
      {chars.join('')}
      <span className="relative inline-block">
        {last}
        <span className="absolute -end-[0.3em] top-[0.1em] text-[0.31em]">*</span>
      </span>
    </>
  );
};

export const WordsPullUp = ({
  text,
  className,
  wordClassName,
  showAsterisk = false,
  startDelay = 0,
  stagger = 0.08,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  showAsterisk?: boolean;
  startDelay?: number;
  stagger?: number;
}) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const words = text.split(' ');
  const show = reduce || inView;

  return (
    <span ref={ref} className={cn('inline-flex flex-wrap', className)} style={{ columnGap: '0.25em' }}>
      {words.map((word, i) => {
        const last = i === words.length - 1;
        return (
          <motion.span
            key={i}
            className={cn('inline-block', wordClassName)}
            initial={reduce ? false : { y: 20, opacity: 0 }}
            animate={show ? { y: 0, opacity: 1 } : undefined}
            transition={{
              duration: 0.6,
              delay: startDelay + i * stagger,
              ease: EASE_OUT_EXPO,
            }}
          >
            {last && showAsterisk ? <WithAsterisk word={word} /> : word}
          </motion.span>
        );
      })}
    </span>
  );
};

export interface StyledSegment {
  text: string;
  className?: string;
}

export const WordsPullUpMultiStyle = ({
  segments,
  className,
  startDelay = 0,
  stagger = 0.08,
}: {
  segments: StyledSegment[];
  className?: string;
  startDelay?: number;
  stagger?: number;
}) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const show = reduce || inView;

  const words: StyledSegment[] = [];
  for (const seg of segments) {
    for (const part of seg.text.split(' ')) {
      if (part.length > 0) words.push({ text: part, className: seg.className });
    }
  }

  return (
    <span ref={ref} className={cn('inline-flex flex-wrap justify-center', className)} style={{ columnGap: '0.25em' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={cn('inline-block', word.className)}
          initial={reduce ? false : { y: 20, opacity: 0 }}
          animate={show ? { y: 0, opacity: 1 } : undefined}
          transition={{
            duration: 0.6,
            delay: startDelay + i * stagger,
            ease: EASE_OUT_EXPO,
          }}
        >
          {word.text}
        </motion.span>
      ))}
    </span>
  );
};

const AnimatedLetter = ({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) => {
  const reduce = useReducedMotion();
  const charProgress = index / total;
  const opacity = useTransform(progress, [charProgress - 0.1, charProgress + 0.05], [0.2, 1]);
  return (
    <motion.span aria-hidden className="inline-block whitespace-pre" style={reduce ? undefined : { opacity }}>
      {char}
    </motion.span>
  );
};

export const ScrollRevealText = ({ text, className }: { text: string; className?: string }) => {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });
  const words = text.split(' ');
  const total = text.length;
  const wordLengths = words.map((word) => word.length + 1);
  const starts = words.map((_, i) => wordLengths.slice(0, i).reduce((sum, len) => sum + len, 0));

  return (
    <p ref={ref} aria-label={text} className={className}>
      {words.map((word, wi) => {
        const start = starts[wi];
        return (
          <React.Fragment key={wi}>
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, ci) => (
                <AnimatedLetter key={ci} char={ch} index={start + ci} total={total} progress={scrollYProgress} />
              ))}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </p>
  );
};
