'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, PenLine } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const Cta03Backdrop = dynamic(() => import('./cta-03-backdrop'), {
  ssr: false,
  loading: () => <div className="size-full bg-muted/20" />,
});

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 70, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const Cta03 = () => {
  const [active, setActive] = React.useState(false);

  return (
    <section data-slot="cta" className="flex w-full items-center justify-center px-4 py-12 md:px-6">
      <div
        className="relative w-full max-w-7xl"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <div
          data-slot="cta-panel"
          className="relative flex min-h-[600px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-card shadow-sm md:rounded-[48px]"
        >
          <div
            aria-hidden
            data-slot="cta-backdrop"
            className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply dark:opacity-30 dark:mix-blend-screen"
          >
            <Cta03Backdrop active={active} />
          </div>

          <div
            data-slot="cta-body"
            className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-16 text-center"
          >
            <span
              data-slot="cta-eyebrow"
              className={cn(
                ENTER,
                'mb-8 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm',
              )}
            >
              <PenLine aria-hidden className="size-3.5" />
              AI writing
            </span>

            <h2
              data-slot="cta-title"
              style={stagger(1)}
              className={cn(
                ENTER,
                'mb-8 font-serif text-5xl leading-[1.05] font-medium tracking-tight text-foreground md:text-7xl lg:text-8xl',
              )}
            >
              Your words,
              <br />
              <span className="text-foreground/80">only sharper.</span>
            </h2>

            <p
              data-slot="cta-description"
              style={stagger(2)}
              className={cn(ENTER, 'mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl')}
            >
              An AI editor that keeps your voice and tightens everything else. It drafts, trims, and proofs while you
              type.
            </p>

            <div data-slot="cta-actions" style={stagger(3)} className={ENTER}>
              <Button render={<a href="#" />} nativeButton={false} size="lg" className="group">
                Start writing
                <ArrowRight className="size-5 transition-transform duration-150 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta03;
