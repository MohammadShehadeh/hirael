'use client';

import type * as React from 'react';
import { Activity, FileCode2, KeyRound, Terminal, Workflow, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const FEATURES = [
  {
    icon: Workflow,
    title: 'A canvas, not a config file',
    description:
      'Drag steps onto a graph, wire dependencies by hand, and let the layout show fan-out and gates for you.',
  },
  {
    icon: FileCode2,
    title: 'Two-way sync',
    description: 'Edit the graph or the file, the other follows. The config in your repo stays the source of truth.',
  },
  {
    icon: Activity,
    title: 'Runs you can watch',
    description:
      'Every run replays on the same graph. The failing step turns red where it sits, with its logs one click away.',
  },
  {
    icon: KeyRound,
    title: 'Secrets per environment',
    description: 'Scope credentials to an environment, not a pipeline. Staging never sees production keys.',
  },
  {
    icon: Zap,
    title: 'Retries that target the step',
    description: 'Rerun a failed step in place with its cache intact instead of paying for the whole pipeline again.',
  },
  {
    icon: Terminal,
    title: 'API and CLI',
    description: 'Trigger runs, read statuses and export graphs from scripts. Everything the UI does has an endpoint.',
  },
];

type CrossDecorPosition = 'top-start' | 'bottom-end';

interface CrossDecorProps {
  position: CrossDecorPosition;
}

const CrossDecor = ({ position }: CrossDecorProps) => {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className={cn(
        'pointer-events-none absolute z-10 size-3.5 shrink-0 text-muted-foreground',
        position === 'top-start' && 'start-0 top-0 -translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2',
        position === 'bottom-end' && 'end-0 bottom-0 translate-y-1/2 ltr:translate-x-1/2 rtl:-translate-x-1/2',
      )}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
};

const FeatureCard = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      data-slot="feature-card"
      className={cn(
        'group relative flex h-full flex-col justify-start gap-6 bg-background px-6 pt-8 pb-6 shadow-xs',
        'bg-[radial-gradient(50%_80%_at_25%_0%,color-mix(in_oklch,var(--primary)_20%,transparent),transparent)]',
        className,
      )}
      {...props}
    >
      {/* Pointer-follow spotlight, fades in on hover along --mx/--my. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_200px_at_var(--mx)_var(--my),color-mix(in_oklch,var(--primary)_14%,transparent),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="absolute -inset-y-4 -start-px w-px bg-border" />
      <div className="absolute -inset-y-4 -end-px w-px bg-border" />
      <div className="absolute -inset-x-4 -top-px h-px bg-border" />
      <div className="absolute -inset-x-4 -bottom-px h-px bg-border" />

      {children}
    </div>
  );
};

const Feature08 = () => {
  return (
    <section
      data-slot="feature"
      className="flex w-full flex-col justify-center gap-12 bg-background px-6 py-16 md:px-10 md:py-24"
    >
      <div data-slot="feature-header" className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <Badge variant="outline" className={ENTER}>
          Features
        </Badge>
        <h2
          style={stagger(1)}
          className={cn(ENTER, 'font-serif text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl')}
        >
          Everything a pipeline needs
        </h2>
        <p style={stagger(2)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground md:text-lg')}>
          The editor is the headline, but the platform underneath carries the boring parts: secrets, caching, retries
          and an API for the rest.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <FeatureCard key={feature.title} style={stagger(index, 60, 180)} className={ENTER}>
            <CrossDecor position="top-start" />
            <CrossDecor position="bottom-end" />
            <div className="relative z-10 flex flex-col gap-2">
              <h3 className="flex items-center gap-2.5 text-base font-medium text-foreground">
                <feature.icon
                  aria-hidden
                  data-slot="feature-card-icon"
                  className="size-4 shrink-0 stroke-[1.5] text-muted-foreground transition-colors duration-150 group-hover:text-primary"
                />
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          </FeatureCard>
        ))}
      </div>
    </section>
  );
};

export default Feature08;
