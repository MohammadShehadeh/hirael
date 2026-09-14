'use client';

import * as React from 'react';
import { Mail, Phone } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/registry/hirael/bases/radix/components/copy-button';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

/** Entrance: fade and rise, skipped under reduced motion. */
const RISE =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 70, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const email = 'projects@northlane.studio';
const phone = '+1 (555) 012 3456';

const glow = (w: number, h: number) =>
  `radial-gradient(${w}% ${h}% at 50% 0%, transparent 0%, transparent 55%, color-mix(in oklab, var(--primary) 60%, transparent) 80%, color-mix(in oklab, var(--primary) 18%, var(--card)) 100%)`;

// Resting state of the scroll-linked glow, used under reduced motion.
const STATIC_GLOW = glow(120, 135);

const Cta05 = () => {
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['end start', 'start end'],
  });

  // Below 100% the ellipse no longer reaches the panel edges and the rim
  // disappears, so the whole scroll range maps onto the visible band.
  const gradientWidth = useTransform(scrollYProgress, [0, 1], [100, 140]);
  const gradientHeight = useTransform(scrollYProgress, [0, 1], [110, 160]);
  const scrollGlow = useTransform([gradientWidth, gradientHeight], (values) => {
    const [width = 120, height = 135] = values as number[];
    return glow(Math.round(width), Math.round(height));
  });

  return (
    <section data-slot="cta" className="bg-background py-12 md:py-16">
      <div ref={containerRef} className="container w-full">
        <div
          data-slot="cta-panel"
          className={cn(
            RISE,
            'relative overflow-hidden rounded-3xl border border-border bg-card pt-16 pb-28 md:pt-20 md:pb-36',
          )}
        >
          <motion.div
            aria-hidden
            data-slot="cta-glow"
            style={{ background: reduced ? STATIC_GLOW : scrollGlow }}
            className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-100"
          />
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
            <span
              data-slot="cta-badge"
              style={stagger(1)}
              className={cn(
                RISE,
                'inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs uppercase text-muted-foreground backdrop-blur-sm',
              )}
            >
              Get in touch
            </span>

            <AnimatedTitle data-slot="cta-title" text="Let's talk about your next project" className="mt-5" />

            <p
              data-slot="cta-copy"
              style={stagger(0, 0, 360)}
              className={cn(RISE, 'mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg')}
            >
              Tell us what you’re building and where it’s stuck. We read every message and usually reply within a day.
            </p>

            <div
              data-slot="cta-actions"
              style={stagger(0, 0, 420)}
              className={cn(RISE, 'mt-10 grid w-full max-w-md grid-cols-1 gap-5 md:grid-cols-2')}
            >
              <div className="flex flex-col items-center gap-2">
                <Button asChild size="lg" className="w-full rounded-full">
                  <a href={`mailto:${email}`}>
                    <Mail className="size-4" />
                    Send email
                  </a>
                </Button>
                <CopyButton value={email} className="max-w-full font-medium text-muted-foreground">
                  {email}
                </CopyButton>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button asChild size="lg" variant="outline" className="w-full rounded-full">
                  <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
                    <Phone className="size-4" />
                    Call us
                  </a>
                </Button>
                <p dir="ltr" className="py-1.5 text-sm font-medium tabular-nums text-muted-foreground">
                  {phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AnimatedTitle = ({ text, className, ...props }: React.ComponentProps<'h2'> & { text: string }) => {
  const words = text.split(' ');

  return (
    <h2
      className={cn(
        'mx-auto max-w-3xl font-serif text-3xl font-medium leading-tight tracking-tight text-foreground md:text-5xl',
        className,
      )}
      {...props}
    >
      {words.map((word, i) => (
        <span key={i} className={cn('me-2 inline-block', RISE)} style={stagger(i, 40, 120)}>
          {word}
        </span>
      ))}
    </h2>
  );
};

export default Cta05;
