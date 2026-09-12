'use client';

import * as React from 'react';
import { Mail, Phone } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

/** Entrance: fade and rise, skipped under reduced motion. */
const RISE =
  'animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out fill-mode-both motion-reduce:animate-none';

const email = 'team@example.com';
const phone = '+1 (555) 012 3456';

const Cta05 = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['end start', 'start end'],
  });

  const gradientWidth = useTransform(scrollYProgress, [0, 1], [50, 140]);
  const gradientHeight = useTransform(scrollYProgress, [0, 1], [70, 160]);
  const background = useTransform([gradientWidth, gradientHeight], (values) => {
    const [width, height] = values as number[];
    const w = Math.max(Math.floor(width), 100);
    const h = Math.max(Math.round(height), 100);
    return `radial-gradient(${w}% ${h}% at 50% 0%, transparent 0%, transparent 55%, color-mix(in oklab, var(--primary) 60%, transparent) 80%, color-mix(in oklab, var(--primary) 18%, var(--card)) 100%)`;
  });

  return (
    <section data-slot="cta" className="bg-background py-12 md:py-16">
      <div ref={containerRef} className="container w-full">
        <div
          data-slot="cta-panel"
          className="relative overflow-hidden rounded-3xl border border-border bg-card pt-16 pb-28 md:pt-20 md:pb-36 animate-in fade-in slide-in-from-bottom-5 duration-800 ease-out fill-mode-both motion-reduce:animate-none"
        >
          <motion.div
            aria-hidden
            data-slot="cta-glow"
            style={{ background }}
            className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-100"
          />
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
            <span
              data-slot="cta-badge"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs uppercase text-muted-foreground backdrop-blur-sm animate-in fade-in zoom-in-90 duration-600 ease-out fill-mode-both motion-reduce:animate-none delay-200"
            >
              <span className="size-1.5 rounded-full bg-primary" />
              Get in touch
            </span>

            <AnimatedTitle data-slot="cta-title" text="Let's talk about your next project" className="mt-5" />

            <p
              data-slot="cta-copy"
              className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg animate-in fade-in slide-in-from-bottom-5 duration-600 ease-out fill-mode-both motion-reduce:animate-none delay-400"
            >
              Tell us what you’re building and where it’s stuck. We read every message and usually reply within a day.
            </p>

            <div
              data-slot="cta-actions"
              className={cn('mt-10 grid w-full max-w-md grid-cols-1 gap-5 md:grid-cols-2', RISE, 'delay-600')}
            >
              <div className="flex flex-col items-center gap-2">
                <Button asChild size="lg" className="w-full rounded-full">
                  <a href={`mailto:${email}`}>
                    <Mail className="size-4" />
                    Send email
                  </a>
                </Button>
                <p className="text-sm font-medium text-muted-foreground">{email}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button asChild size="lg" variant="outline" className="w-full rounded-full">
                  <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
                    <Phone className="size-4" />
                    Call us
                  </a>
                </Button>
                <p className="text-sm font-medium text-muted-foreground">{phone}</p>
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
        <span key={i} className={cn('me-2 inline-block', RISE)} style={{ animationDelay: `${i * 80}ms` }}>
          {word}
        </span>
      ))}
    </h2>
  );
};

export default Cta05;
