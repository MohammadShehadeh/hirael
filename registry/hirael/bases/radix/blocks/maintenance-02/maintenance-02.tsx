import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Sparkles } from '@/registry/hirael/bases/radix/components/sparkles';

/** Entrance: fade and rise, skipped under reduced motion. */
const RISE =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const delay = (ms: number): React.CSSProperties => ({ animationDelay: `${ms}ms` });

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
          className={cn('me-[0.25em] inline-block', RISE, i < half ? 'text-muted-foreground' : 'text-foreground')}
          style={delay(60 + i * 50)}
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
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 text-center md:px-10"
      >
        <div className={RISE}>
          <Badge variant="outline" data-slot="maintenance-badge">
            Maintenance
          </Badge>
        </div>

        <Headline />

        <p
          data-slot="maintenance-description"
          style={delay(300)}
          className={cn('mt-2 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg', RISE)}
        >
          We are upgrading the registry and the console. Installed components keep working, and nothing you shipped is
          affected.
        </p>

        <div
          data-slot="maintenance-status"
          style={delay(380)}
          className={cn('mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground', RISE)}
        >
          <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
          <span>Check back in a few minutes</span>
        </div>
      </div>
    </section>
  );
};

export default Maintenance02;
