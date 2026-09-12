'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Sparkles } from '@/registry/hirael/bases/base/components/sparkles';

const HEADLINE = 'Something new is on the way';

const Headline = () => {
  const words = HEADLINE.split(' ');
  const half = Math.floor(words.length / 2);

  return (
    <h1
      data-slot="coming-soon-title"
      className="max-w-xl font-serif text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl md:text-7xl"
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={cn(
            'inline-block animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both motion-reduce:animate-none',
            i < half ? 'text-muted-foreground' : 'text-foreground',
          )}
          style={{ animationDelay: `${200 + i * 80}ms` }}
        >
          {word}
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </h1>
  );
};

const ComingSoon02 = () => {
  return (
    <section
      data-slot="coming-soon"
      className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background pt-24"
    >
      <div
        data-slot="coming-soon-body"
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-6 text-center md:px-10 animate-in fade-in slide-in-from-bottom-6 duration-800 ease-out fill-mode-both motion-reduce:animate-none"
      >
        <div className="animate-in fade-in zoom-in-90 duration-600 ease-out fill-mode-both motion-reduce:animate-none delay-300">
          <Badge
            variant="outline"
            data-slot="coming-soon-badge"
            className="rounded-full bg-card/70 px-4 py-1.5 text-xs uppercase text-muted-foreground backdrop-blur-sm"
          >
            Launching soon
          </Badge>
        </div>

        <Headline />

        <p
          data-slot="coming-soon-description"
          className="mt-2 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg animate-in fade-in duration-600 ease-out fill-mode-both motion-reduce:animate-none delay-800"
        >
          Hirael Cloud brings managed Postgres and object storage to the same terminal-first console you use for the
          registry. We are finishing the last pieces now.
        </p>

        <div
          data-slot="coming-soon-actions"
          className="mt-4 flex flex-col items-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-600 ease-out fill-mode-both motion-reduce:animate-none delay-1000"
        >
          <Badge variant="outline" data-slot="coming-soon-cta" className="rounded-full px-5 py-2 text-sm font-medium">
            Coming soon
          </Badge>
        </div>
      </div>

      <div
        data-slot="coming-soon-horizon"
        aria-hidden
        className="relative -mt-32 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,black,transparent)] after:absolute after:-start-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-border after:bg-card after:content-['']"
      >
        <div
          data-slot="coming-soon-horizon-glow"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,color-mix(in_oklch,var(--primary)_40%,transparent),transparent_70%)] opacity-40"
        />
        <Sparkles
          density={4}
          size={1.4}
          color="var(--primary)"
          className="[mask-image:radial-gradient(50%_50%,black,transparent_85%)]"
        />
      </div>
    </section>
  );
};

export default ComingSoon02;
