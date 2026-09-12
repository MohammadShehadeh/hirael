'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Sparkles } from '@/registry/hirael/bases/base/components/sparkles';

const HEADLINE = 'We are briefly offline';

const Headline = () => {
  const words = HEADLINE.split(' ');
  const half = Math.floor(words.length / 2);

  return (
    <h1
      data-slot="maintenance-title"
      className="max-w-3xl font-serif text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl md:text-7xl"
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={cn(
            'me-[0.25em] inline-block animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both motion-reduce:animate-none',
            i < half ? 'text-muted-foreground' : 'text-foreground',
          )}
          style={{ animationDelay: `${200 + i * 80}ms` }}
        >
          {word}
        </span>
      ))}
    </h1>
  );
};

const Maintenance02 = () => {
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

      <div
        data-slot="maintenance-body"
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 text-center md:px-10 animate-in fade-in duration-1000 ease-out fill-mode-both motion-reduce:animate-none"
      >
        <div className="animate-in fade-in zoom-in-90 duration-600 ease-out fill-mode-both motion-reduce:animate-none delay-200">
          <Badge
            variant="outline"
            data-slot="maintenance-badge"
            className="rounded-full bg-card/70 px-4 py-1.5 text-xs uppercase text-muted-foreground backdrop-blur-sm"
          >
            Maintenance
          </Badge>
        </div>

        <Headline />

        <div role="status" aria-live="polite" className="contents">
          <p
            data-slot="maintenance-description"
            className="mt-2 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg animate-in fade-in slide-in-from-bottom-4 duration-600 ease-out fill-mode-both motion-reduce:animate-none delay-800"
          >
            We are upgrading the registry and the console. Installed components keep working, and nothing you shipped is
            affected.
          </p>

          <div
            data-slot="maintenance-status"
            className="mt-6 inline-flex items-center gap-2 text-sm text-foreground/70 animate-in fade-in slide-in-from-bottom-4 duration-600 ease-out fill-mode-both motion-reduce:animate-none delay-600"
          >
            <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
            <span>Check back in a few minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Maintenance02;
