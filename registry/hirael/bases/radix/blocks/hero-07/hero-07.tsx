'use client';

import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { cn } from '@/lib/utils';

const HEADLINE = 'Build the page once, ship it everywhere';

const Headline = () => {
  const reduce = useReducedMotion();
  const words = HEADLINE.split(' ');

  return (
    <h1
      data-slot="hero-headline"
      className="max-w-3xl font-serif text-[42px] font-medium leading-[1.04] tracking-tight text-foreground sm:text-5xl md:text-7xl"
    >
      {words.map((word, i) => {
        const accent = i >= words.length - 2;
        return (
          <motion.span
            key={`${word}-${i}`}
            className={cn('inline-block', accent && 'italic text-foreground')}
            initial={reduce ? false : { opacity: 0, y: 16, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
              delay: 0.1 + i * 0.05,
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : null}
          </motion.span>
        );
      })}
    </h1>
  );
};

const Beam = ({ className, reduce }: { className?: string; reduce: boolean | null }) => {
  const verticals = [
    'M141.338 232.625V5.075',
    'M200.338 232.625V5.075',
    'M259.338 231.625V4.075',
    'M318.338 230.625V3.075',
  ];
  const curves = [
    'M459.649 152.723 351.613 69.264a11 11 0 0 1-4.275-8.705V.074',
    'm.338 152.723 108.036-83.459a11 11 0 0 0 4.275-8.705V.074',
  ];

  return (
    <svg
      width={460}
      height={233}
      fill="none"
      viewBox="0 0 460 233"
      className={cn('text-foreground', className)}
      aria-hidden="true"
    >
      {[...verticals, ...curves].map((d, i) => (
        <path key={`base-${i}`} d={d} stroke="currentColor" strokeWidth="1" className="opacity-15" />
      ))}
      {curves.map((d, i) => (
        <motion.path
          key={`beam-${i}`}
          d={d}
          stroke="url(#hero07-beam)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1000"
          initial={{ strokeDashoffset: 0 }}
          animate={reduce ? undefined : { strokeDashoffset: [0, -900, 0] }}
          transition={
            reduce
              ? undefined
              : {
                  duration: 5 + i * 1.2,
                  repeat: Infinity,
                  ease: 'linear',
                }
          }
          style={{ willChange: 'stroke-dashoffset' }}
        />
      ))}
      <defs>
        <linearGradient id="hero07-beam" x1="230" y1="233" x2="230" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="transparent" offset="0%" />
          <stop stopColor="color-mix(in oklch, var(--primary) 60%, transparent)" offset="30%" />
          <stop stopColor="var(--foreground)" offset="50%" />
          <stop stopColor="color-mix(in oklch, var(--primary) 60%, transparent)" offset="70%" />
          <stop stopColor="transparent" offset="100%" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const SideBeam = ({ className, reduce }: { className?: string; reduce: boolean | null }) => {
  const paths = [
    'M0 442.957L209.048 442.957C212.366 442.957 215.508 441.458 217.596 438.879L321.802 310.196',
    'M0 1.19531L209.048 1.19557C212.366 1.19558 215.508 2.69391 217.596 5.27302L321.802 133.956',
  ];

  return (
    <svg
      width={200}
      height={444}
      viewBox="0 0 323 444"
      fill="none"
      className={cn('text-foreground', className)}
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path key={`base-${i}`} d={d} stroke="currentColor" strokeWidth="1" className="opacity-15" />
      ))}
      {paths.map((d, i) => (
        <motion.path
          key={`beam-${i}`}
          d={d}
          stroke="url(#hero07-side)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1200"
          initial={{ strokeDashoffset: 0 }}
          animate={reduce ? undefined : { strokeDashoffset: [0, -900, 0] }}
          transition={
            reduce
              ? undefined
              : {
                  duration: 6 + i * 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }
          }
          style={{ willChange: 'stroke-dashoffset' }}
        />
      ))}
      <defs>
        <linearGradient id="hero07-side" x1="160.901" y1="444" x2="160.901" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="transparent" offset="0%" />
          <stop stopColor="color-mix(in oklch, var(--primary) 60%, transparent)" offset="30%" />
          <stop stopColor="var(--foreground)" offset="50%" />
          <stop stopColor="color-mix(in oklch, var(--primary) 60%, transparent)" offset="70%" />
          <stop stopColor="transparent" offset="100%" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const Hero07 = () => {
  const reduce = useReducedMotion();

  return (
    <section
      data-slot="hero"
      className="relative isolate grid min-h-[640px] place-items-center overflow-hidden bg-background px-6 py-28 text-center text-foreground md:px-10 md:py-32"
    >
      <div
        aria-hidden
        data-slot="hero-backdrop"
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_72%)]"
        style={{
          backgroundImage: [
            'radial-gradient(120% 120% at 50% 26%, color-mix(in oklch, var(--primary) 26%, transparent), transparent 60%)',
            'radial-gradient(80% 70% at 6% 96%, color-mix(in oklch, var(--accent-cool) 24%, transparent), transparent 64%)',
            'radial-gradient(80% 70% at 94% 92%, color-mix(in oklch, var(--warm) 20%, transparent), transparent 64%)',
          ].join(', '),
        }}
      />

      <Beam
        reduce={reduce}
        className="pointer-events-none absolute -top-8 start-1/2 -translate-x-1/2 scale-[0.6] rtl:translate-x-1/2 sm:top-0 sm:scale-90"
      />
      <Beam
        reduce={reduce}
        className="pointer-events-none absolute -bottom-8 start-1/2 -translate-x-1/2 -scale-[0.6] rtl:translate-x-1/2 sm:bottom-0 sm:-scale-90"
      />
      <SideBeam
        reduce={reduce}
        className="pointer-events-none absolute top-1/2 start-0 hidden -translate-y-1/2 scale-90 rtl:-scale-x-90 md:block"
      />
      <SideBeam
        reduce={reduce}
        className="pointer-events-none absolute top-1/2 end-0 hidden -translate-y-1/2 -scale-x-90 rtl:scale-90 md:block"
      />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-5"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <span
          data-slot="hero-badge"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
        >
          <span className="relative flex size-1.5">
            <span
              className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
              style={{ background: 'var(--accent-cool)' }}
            />
            <span className="relative inline-flex size-1.5 rounded-full" style={{ background: 'var(--accent-cool)' }} />
          </span>
          Now in beta
        </span>

        <Headline />

        <p data-slot="hero-subhead" className="mt-2 max-w-xl text-muted-foreground sm:mt-4">
          One source of truth for your interface. Design it, theme it, and reuse it across every project without
          rewriting the same components.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="group rounded-full px-7">
            <a href="#">
              <span>Get started</span>
              <ArrowRight className="size-4 -rotate-45 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-[135deg] rtl:group-hover:-translate-x-0.5" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-7">
            <a href="#">
              <span>Read the docs</span>
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero07;
