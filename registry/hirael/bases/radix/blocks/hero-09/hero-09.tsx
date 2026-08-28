'use client';

import * as React from 'react';
import { Bell, CalendarClock, ChevronDown, Container, FlaskConical, Hammer, Rocket } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Sparkles } from '@/registry/hirael/bases/radix/components/sparkles';

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
  { value: '8', label: 'step types' },
  { value: '40s', label: 'median queue to start' },
  { value: '$0', label: 'to start building' },
];

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <circle cx="5" cy="6" r="2.2" />
      <circle cx="19" cy="6" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="M6.5 7.8 10.5 16" />
      <path d="M17.5 7.8 13.5 16" />
      <path d="M7.2 6h9.6" opacity="0.5" />
    </svg>
  );
};

const ZOOM_AT = 0.55;
const SPRING = { stiffness: 200, damping: 40, mass: 0.4 };

/**
 * Zooms the hero card out as the page scrolls so it recedes behind whatever
 * section follows it. Inert when the hero is the only content, and disabled
 * under reduced motion.
 */
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

  // Until measured, keep the range effectively infinite so progress stays at
  // 0 (avoids a first-paint jump before the effect runs).
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
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,var(--warm-glow),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_100%,color-mix(in_oklch,var(--warm)_10%,transparent),transparent_70%)]" />
          <Sparkles
            density={1.5}
            size={1.1}
            speed={0.3}
            className="mask-[radial-gradient(70%_70%_at_50%_40%,black,transparent)]"
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-between gap-10 p-6 pb-28 text-foreground md:p-10 md:pt-7">
          <div data-slot="hero-nav" className="relative flex items-center justify-between">
            <a href="#" data-slot="hero-brand" className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-sm border border-border bg-background text-foreground">
                <BrandMark className="size-5" />
              </span>
              <span className="text-base font-semibold tracking-tight">Hirael Flow</span>
            </a>
            <nav className="absolute start-1/2 hidden items-center gap-6 ltr:-translate-x-1/2 rtl:translate-x-1/2 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="#">Sign in</a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href="#">Get started</a>
              </Button>
            </div>
          </div>

          <div className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center gap-6 px-2 text-center">
            <h1
              data-slot="hero-title"
              className="font-serif text-balance text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
            >
              Pipelines you can see, <span className="text-muted-foreground">not just read</span>
            </h1>

            <p
              data-slot="hero-description"
              className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              Design workflows on a canvas, keep them in sync with YAML, and watch every run move step by step through
              the same graph.
            </p>

            <div data-slot="hero-actions" className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Button size="lg" asChild>
                <a href="#">Start building</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">See the features</a>
              </Button>
            </div>

            <div data-slot="hero-steps" className="mt-4 flex flex-col items-center gap-3.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Every step in one graph
              </span>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {STEP_TYPES.map((step) => (
                  <span
                    key={step.label}
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <step.icon aria-hidden className="size-4" />
                    <span className="hidden sm:inline">{step.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center md:justify-start md:ps-10">
          <ChevronDown
            aria-hidden
            className="size-5 animate-bounce text-muted-foreground/60 motion-reduce:animate-none"
          />
        </div>

        {/* Carved stat corner: background-colored so it reads as a cutout. */}
        <div
          data-slot="hero-stats"
          className="absolute bottom-0 end-0 z-10 hidden items-end gap-8 rounded-ss-[18px] bg-background pb-2.5 pe-8 ps-7 pt-5 md:flex"
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="font-serif text-2xl font-medium leading-tight md:text-3xl">{stat.value}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </HeroZoom>
    </section>
  );
};

export default Hero09;
