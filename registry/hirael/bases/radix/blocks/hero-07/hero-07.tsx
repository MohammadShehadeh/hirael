'use client';

import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { cn } from '@/lib/utils';

// Shades of the theme's primary for the backdrop glows. Lightness and chroma are set per mode, because the raw
// primary at low opacity greys out against the background (a brown haze on dark canvases).
const GLOW =
  'bg-[oklch(from_var(--primary)_0.86_calc(c*0.7)_h)] dark:bg-[oklch(from_var(--primary)_0.58_calc(c*0.9)_calc(h-10))]';
const DEPTH =
  'bg-[oklch(from_var(--primary)_0.88_calc(c*0.55)_calc(h-20))] dark:bg-[oklch(from_var(--primary)_0.4_calc(c*0.7)_calc(h-30))]';
const WISP =
  'bg-[oklch(from_var(--primary)_0.92_calc(c*0.45)_calc(h+15))] dark:bg-[oklch(from_var(--primary)_0.7_calc(c*0.8)_calc(h-5))]';

const HEADLINE = 'Build the page once, ship it everywhere';

// Words only slide: starting them transparent or blurred would hold back Largest Contentful Paint.
const Headline = () => {
  const words = HEADLINE.split(' ');

  return (
    <h1
      data-slot="hero-headline"
      className="max-w-3xl font-serif text-[42px] leading-[1.04] font-medium tracking-tight text-foreground sm:text-5xl md:text-7xl"
    >
      {words.map((word, i) => {
        const accent = i >= words.length - 2;

        return (
          <span
            key={`${word}-${i}`}
            className={cn(
              'inline-block animate-in duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both slide-in-from-bottom-4 motion-reduce:animate-none',
              accent && 'text-foreground italic',
            )}
            style={{ animationDelay: `${40 + i * 35}ms` }}
          >
            {word}
            {i < words.length - 1 ? ' ' : null}
          </span>
        );
      })}
    </h1>
  );
};

const BEAM_VERTICALS = [
  'M141.338 232.625V5.075',
  'M200.338 232.625V5.075',
  'M259.338 231.625V4.075',
  'M318.338 230.625V3.075',
];

const BEAM_CURVES = [
  'M459.649 152.723 351.613 69.264a11 11 0 0 1-4.275-8.705V.074',
  'm.338 152.723 108.036-83.459a11 11 0 0 0 4.275-8.705V.074',
];

interface BeamProps {
  className?: string;
  reduce: boolean | null;
}

const Beam = ({ className, reduce }: BeamProps) => {
  return (
    <svg
      width={460}
      height={233}
      fill="none"
      viewBox="0 0 460 233"
      className={cn('text-foreground', className)}
      aria-hidden="true"
    >
      {[...BEAM_VERTICALS, ...BEAM_CURVES].map((d, i) => (
        <path key={`base-${i}`} d={d} stroke="currentColor" strokeWidth="1" className="opacity-15" />
      ))}
      {BEAM_CURVES.map((d, i) => (
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
          className="will-change-[stroke-dashoffset]"
        />
      ))}
      <defs>
        <linearGradient id="hero07-beam" x1="230" y1="233" x2="230" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="transparent" offset="0%" />
          <stop stopColor="var(--primary)" stopOpacity={0.6} offset="30%" />
          <stop stopColor="var(--foreground)" offset="50%" />
          <stop stopColor="var(--primary)" stopOpacity={0.6} offset="70%" />
          <stop stopColor="transparent" offset="100%" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const SIDE_BEAM_PATHS = [
  'M0 442.957L209.048 442.957C212.366 442.957 215.508 441.458 217.596 438.879L321.802 310.196',
  'M0 1.19531L209.048 1.19557C212.366 1.19558 215.508 2.69391 217.596 5.27302L321.802 133.956',
];

interface SideBeamProps {
  className?: string;
  reduce: boolean | null;
}

const SideBeam = ({ className, reduce }: SideBeamProps) => {
  return (
    <svg
      width={200}
      height={444}
      viewBox="0 0 323 444"
      fill="none"
      className={cn('text-foreground', className)}
      aria-hidden="true"
    >
      {SIDE_BEAM_PATHS.map((d, i) => (
        <path key={`base-${i}`} d={d} stroke="currentColor" strokeWidth="1" className="opacity-15" />
      ))}
      {SIDE_BEAM_PATHS.map((d, i) => (
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
          className="will-change-[stroke-dashoffset]"
        />
      ))}
      <defs>
        <linearGradient id="hero07-side" x1="160.901" y1="444" x2="160.901" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="transparent" offset="0%" />
          <stop stopColor="var(--primary)" stopOpacity={0.6} offset="30%" />
          <stop stopColor="var(--foreground)" offset="50%" />
          <stop stopColor="var(--primary)" stopOpacity={0.6} offset="70%" />
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
        className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_72%)]"
      >
        <div
          className={cn(
            'absolute start-1/2 top-0 size-180 -translate-x-1/2 rounded-full opacity-50 blur-3xl rtl:translate-x-1/2 dark:opacity-25',
            GLOW,
          )}
        />
        <div
          className={cn(
            'absolute -start-32 -bottom-32 size-140 rounded-full opacity-45 blur-3xl dark:opacity-20',
            DEPTH,
          )}
        />
        <div
          className={cn('absolute -end-32 -bottom-32 size-140 rounded-full opacity-40 blur-3xl dark:opacity-20', WISP)}
        />
      </div>

      <Beam
        reduce={reduce}
        className="pointer-events-none absolute start-1/2 -top-8 -translate-x-1/2 scale-[0.6] sm:top-0 sm:scale-90 rtl:translate-x-1/2"
      />
      <Beam
        reduce={reduce}
        className="pointer-events-none absolute start-1/2 -bottom-8 -translate-x-1/2 -scale-[0.6] sm:bottom-0 sm:-scale-90 rtl:translate-x-1/2"
      />
      <SideBeam
        reduce={reduce}
        className="pointer-events-none absolute start-0 top-1/2 hidden -translate-y-1/2 scale-90 md:block rtl:-scale-x-90"
      />
      <SideBeam
        reduce={reduce}
        className="pointer-events-none absolute end-0 top-1/2 hidden -translate-y-1/2 -scale-x-90 md:block rtl:scale-90"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-5">
        <span
          data-slot="hero-badge"
          className="inline-flex w-fit animate-in items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs text-muted-foreground uppercase backdrop-blur-sm duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both fade-in motion-reduce:animate-none"
        >
          Now in beta
        </span>

        <Headline />

        <p
          data-slot="hero-subhead"
          className="mt-2 max-w-xl animate-in text-muted-foreground delay-330 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both slide-in-from-bottom-4 motion-reduce:animate-none sm:mt-4"
        >
          One source of truth for your interface. Design it, theme it, and reuse it across every project without
          rewriting the same components.
        </p>

        <div
          data-slot="hero-actions"
          className="mt-4 flex animate-in flex-col gap-3 delay-390 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both fade-in slide-in-from-bottom-4 motion-reduce:animate-none sm:flex-row"
        >
          <Button asChild size="lg" className="group">
            <a href="#">
              <span>Get started</span>
              <ArrowRight className="size-4 -rotate-45 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[135deg] rtl:group-hover:-translate-x-0.5" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#">
              <span>Read the docs</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero07;
