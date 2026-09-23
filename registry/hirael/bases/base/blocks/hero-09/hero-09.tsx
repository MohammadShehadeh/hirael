'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Bell, CalendarClock, ChevronDown, Container, FlaskConical, Hammer, Rocket } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

// WebGL can't paint before hydration; the CSS wash below carries the first frame.
const Hero09Backdrop = dynamic(() => import('./hero-09-backdrop'), {
  ssr: false,
  loading: () => null,
});

const NAV_LINKS = ['Features', 'Pipeline', 'Pricing', 'FAQ'];

const STEP_TYPES = [
  { label: 'Build', icon: Hammer },
  { label: 'Test', icon: FlaskConical },
  { label: 'Deploy', icon: Rocket },
  { label: 'Containers', icon: Container },
  { label: 'Notify', icon: Bell },
  { label: 'Schedule', icon: CalendarClock },
];

const STATS = [
  { value: String(STEP_TYPES.length), label: 'step types' },
  { value: '40s', label: 'median queue to start' },
  { value: '$0', label: 'to start building' },
];

interface BrandMarkProps {
  className?: string;
}

const BrandMark = ({ className }: BrandMarkProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M2.3 12h2.4v10.95h6.2V14.6h4.6v8.35h6.2V12h-2.4V1.05h-6.2V9.4H8.5V1.05H2.3Z" />
    </svg>
  );
};

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 70}ms` });

const ZOOM_AT = 0.55;
const SPRING = { stiffness: 200, damping: 40, mass: 0.4 };

const HeroZoom = ({ className, children }: React.ComponentProps<'div'>) => {
  const reduced = useReducedMotion();
  const [viewportHeight, setViewportHeight] = React.useState(0);
  const { scrollY } = useScroll();

  React.useEffect(() => {
    const measure = () => setViewportHeight(window.innerHeight);
    measure();
    window.addEventListener('resize', measure);

    return () => window.removeEventListener('resize', measure);
  }, []);

  // Effectively infinite until measured, so progress stays at 0 and the first paint doesn't jump.
  const end = viewportHeight > 0 ? viewportHeight * ZOOM_AT : 1e9;
  const progress = useTransform(scrollY, [0, end], [0, 1], { clamp: true });

  const scale = useSpring(useTransform(progress, [0, 1], [1, 0.89]), SPRING);
  const opacity = useSpring(useTransform(progress, [0, 1], [1, 0.88]), SPRING);
  const borderRadius = useSpring(useTransform(progress, [0, 1], [18, 30]), SPRING);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} style={{ scale, opacity, borderRadius }}>
      {children}
    </motion.div>
  );
};

const Hero09 = () => {
  return (
    <section data-slot="hero" className="relative min-h-svh bg-background pt-2.5">
      <HeroZoom className="sticky top-2.5 mx-2.5 flex min-h-200 origin-top flex-col overflow-hidden rounded-[18px] bg-card will-change-transform lg:h-[calc(100svh-20px)]">
        <div aria-hidden className="absolute inset-0">
          {/* First frame, and the fallback wherever WebGL is unavailable. */}
          <div className="absolute inset-0 bg-[radial-gradient(95%_65%_at_50%_-12%,color-mix(in_oklch,var(--primary)_34%,transparent),transparent_62%),radial-gradient(70%_60%_at_8%_104%,color-mix(in_oklch,var(--primary)_30%,transparent),transparent_66%),radial-gradient(60%_55%_at_96%_26%,color-mix(in_oklch,var(--chart-2)_20%,transparent),transparent_68%),radial-gradient(80%_50%_at_50%_108%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_70%)]" />
          <Hero09Backdrop className="absolute inset-0 size-full" />

          {/* Grain keeps the wide gradients from banding on large displays. */}
          <div
            className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-between gap-10 p-6 pb-28 text-foreground md:p-10 md:pt-7">
          <div data-slot="hero-nav" className={cn(ENTER, 'relative flex items-center justify-between')}>
            <a href="#" data-slot="hero-brand" className="flex items-center gap-2">
              <BrandMark className="size-5 text-foreground" />
              <span className="text-base font-semibold tracking-tight">Hirael</span>
            </a>
            <nav className="absolute start-1/2 hidden items-center gap-6 md:flex ltr:-translate-x-1/2 rtl:translate-x-1/2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  {link}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Button render={<a href="#" />} nativeButton={false} variant="ghost" size="sm">
                Sign in
              </Button>
              <Button render={<a href="#" />} nativeButton={false} size="sm" variant="outline">
                Get started
              </Button>
            </div>
          </div>

          <div className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center gap-6 px-2 text-center">
            <h1
              data-slot="hero-title"
              style={stagger(1)}
              className={cn(
                ENTER,
                'font-serif text-5xl leading-[1.05] font-medium tracking-tight text-balance md:text-6xl lg:text-7xl',
              )}
            >
              Pipelines you can see, <span className="text-primary">not just read</span>
            </h1>

            <p
              data-slot="hero-description"
              style={stagger(2)}
              className={cn(ENTER, 'max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg')}
            >
              Design workflows on a canvas, keep them in sync with YAML, and watch every run move step by step through
              the same graph.
            </p>

            <div
              data-slot="hero-actions"
              style={stagger(3)}
              className={cn(ENTER, 'flex flex-col gap-3 pt-1 sm:flex-row')}
            >
              <Button render={<a href="#" />} nativeButton={false} size="lg">
                Start building
              </Button>
              <Button render={<a href="#features" />} nativeButton={false} size="lg" variant="outline">
                See the features
              </Button>
            </div>

            <div
              data-slot="hero-steps"
              style={stagger(4)}
              className={cn(ENTER, 'mt-4 flex flex-col items-center gap-3.5')}
            >
              <span className="text-xs text-muted-foreground uppercase">Every step in one graph</span>
              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 sm:gap-x-6 sm:gap-y-3">
                {STEP_TYPES.map((step) => (
                  <li
                    key={step.label}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground sm:text-sm"
                  >
                    <step.icon aria-hidden className="size-4 text-primary/70" />
                    {step.label}
                  </li>
                ))}
              </ul>
            </div>

            <dl
              data-slot="hero-stats-inline"
              style={stagger(5)}
              className={cn(ENTER, 'mt-2 grid w-full max-w-sm grid-cols-3 gap-4 border-t border-border pt-5 md:hidden')}
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-0.5">
                  <dt className="order-2 text-[11px] leading-tight text-muted-foreground uppercase">{stat.label}</dt>
                  <dd dir="ltr" className="order-1 font-serif text-xl font-medium text-primary tabular-nums">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center md:justify-start md:ps-10">
          <ChevronDown
            aria-hidden
            className="size-5 animate-bounce text-muted-foreground/60 motion-reduce:animate-none"
          />
        </div>

        <div
          data-slot="hero-stats"
          style={stagger(5)}
          className={cn(
            'absolute end-0 bottom-0 z-10 hidden items-end gap-8 rounded-ss-[18px] bg-background ps-7 pe-8 pt-5 pb-2.5 md:flex',
            'animate-in duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both fade-in motion-reduce:animate-none',
          )}
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div
                dir="ltr"
                className="font-serif text-2xl leading-tight font-medium text-primary tabular-nums md:text-3xl"
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </HeroZoom>
    </section>
  );
};

export default Hero09;
