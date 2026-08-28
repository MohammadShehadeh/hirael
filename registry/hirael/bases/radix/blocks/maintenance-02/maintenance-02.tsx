'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Sparkles } from '@/registry/hirael/bases/radix/components/sparkles';

const HEADLINE = 'We are briefly offline';

const Headline = () => {
  const reduce = useReducedMotion();
  const words = HEADLINE.split(' ');
  const half = Math.floor(words.length / 2);

  return (
    <h1
      data-slot="maintenance-title"
      className="max-w-3xl font-serif text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl md:text-7xl"
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={cn('me-[0.25em] inline-block', i < half ? 'text-muted-foreground' : 'text-foreground')}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 + i * 0.08 }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
};

const Maintenance02 = () => {
  const reduce = useReducedMotion();

  return (
    <section
      data-slot="maintenance"
      className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-background py-24"
    >
      <div
        aria-hidden
        data-slot="maintenance-backdrop"
        className="pointer-events-none absolute inset-0 -z-10 scale-[0.8] rounded-full bg-[radial-gradient(circle_at_50%_50%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_70%)] blur-[120px] md:blur-[220px]"
      />
      <Sparkles density={3} className="-z-10 [mask-image:radial-gradient(50%_50%,black,transparent_85%)]" />

      <motion.div
        data-slot="maintenance-body"
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 text-center md:px-10"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <Badge
            variant="outline"
            data-slot="maintenance-badge"
            className="rounded-full bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
          >
            Maintenance
          </Badge>
        </motion.div>

        <Headline />

        <div role="status" aria-live="polite" className="contents">
          <motion.p
            data-slot="maintenance-description"
            className="mt-2 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
          >
            We are upgrading the registry and the console. Installed components keep working, and nothing you shipped is
            affected.
          </motion.p>

          <motion.div
            data-slot="maintenance-status"
            className="mt-6 inline-flex items-center gap-2 text-sm text-foreground/70"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          >
            <Loader2 aria-hidden className={cn('size-4', !reduce && 'animate-spin')} />
            <span>Check back in a few minutes</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Maintenance02;
