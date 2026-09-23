'use client';

import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const TITLE = 'Your next pipeline draws itself';
const EMPHASIS_WORDS = 2;

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 70}ms` });

const glow = (w: number, h: number) =>
  `radial-gradient(${w}% ${h}% at 50% 0%, transparent 0%, transparent 55%, color-mix(in oklab, var(--primary) 30%, transparent) 82%, color-mix(in oklab, var(--primary) 30%, transparent) 100%)`;

const STATIC_GLOW = glow(120, 130);

const Cta07 = () => {
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['end start', 'start end'],
  });

  // Below 100% the ellipse stops reaching the panel edges and the rim vanishes,
  // so the whole scroll range maps onto the visible band.
  const glowWidth = useTransform(scrollYProgress, [0, 1], [100, 140]);
  const glowHeight = useTransform(scrollYProgress, [0, 1], [110, 160]);
  const scrollGlow = useTransform([glowWidth, glowHeight], ([w, h]: Array<number>) =>
    glow(Math.round(w ?? 120), Math.round(h ?? 130)),
  );
  const words = TITLE.split(' ');

  return (
    <section ref={containerRef} data-slot="cta" className="bg-background px-6 py-16 md:px-10 md:py-24">
      <div
        data-slot="cta-panel"
        className={cn(ENTER, 'relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 pt-18 pb-24')}
      >
        <motion.div
          aria-hidden
          data-slot="cta-glow"
          style={{ background: reduced ? STATIC_GLOW : scrollGlow }}
          className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-100"
        />
        <div
          data-slot="cta-body"
          className="relative z-10 mx-auto flex min-h-100 max-w-3xl flex-col items-center text-center"
        >
          <Badge variant="outline" style={stagger(1)} className={ENTER}>
            Get started
          </Badge>

          <h2
            data-slot="cta-title"
            style={stagger(2)}
            className={cn(
              ENTER,
              'mt-4 font-serif text-3xl leading-[1.12] font-medium tracking-tight text-balance md:text-4xl lg:text-5xl',
            )}
          >
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className={cn(
                  'me-2 inline-block',
                  i >= words.length - EMPHASIS_WORDS ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {word}
              </span>
            ))}
          </h2>

          <p
            data-slot="cta-description"
            style={stagger(3)}
            className={cn(ENTER, 'mt-4 max-w-md text-base text-pretty text-muted-foreground md:text-lg')}
          >
            Import a repo, watch its workflow appear as a graph, and run it. The first pipeline takes minutes, not an
            afternoon.
          </p>

          <div
            data-slot="cta-actions"
            style={stagger(4)}
            className={cn(ENTER, 'mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row')}
          >
            <Button render={<a href="#" />} nativeButton={false} size="lg">
              Get started
              <ArrowRight aria-hidden className="rtl:-rotate-180" />
            </Button>
            <Button render={<a href="#" />} nativeButton={false} size="lg" variant="outline">
              Read the docs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta07;
