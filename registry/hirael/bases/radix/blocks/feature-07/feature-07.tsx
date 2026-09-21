import type * as React from 'react';
import { EyeOff, FileWarning, RefreshCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const CHALLENGES = [
  {
    icon: FileWarning,
    title: 'YAML sprawl',
    description:
      'Pipelines grow into hundred-line files nobody wants to touch. One wrong indent and the whole run fails.',
  },
  {
    icon: RefreshCcw,
    title: 'Rerun and hope',
    description:
      'A red build with no context turns debugging into rerunning. The failing step should be obvious at a glance.',
  },
  {
    icon: EyeOff,
    title: 'No shared picture',
    description: 'Only the person who wrote the config knows how it flows. Everyone else reads logs after the fact.',
  },
];

const Feature07 = () => {
  return (
    <section
      data-slot="feature"
      className="flex w-full flex-col justify-center gap-12 bg-background px-6 py-16 md:px-10 md:py-24"
    >
      <div data-slot="feature-header" className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
        <Badge
          variant="outline"
          className="mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none bg-card/70 px-4 py-1.5 uppercase text-muted-foreground"
        >
          The problem
        </Badge>
        <h2
          style={stagger(1)}
          className={cn(ENTER, 'font-serif text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl')}
        >
          Work you can&apos;t see <span className="text-muted-foreground">is work you can&apos;t trust</span>
        </h2>
        <p
          style={stagger(2)}
          className={cn(ENTER, 'mx-auto text-sm leading-relaxed text-muted-foreground md:text-base')}
        >
          Configuration as text scales badly once pipelines branch, fan out and gate deployments. The shape of the
          workflow disappears into the file.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 md:grid-cols-3">
        {CHALLENGES.map((challenge, i) => (
          <div
            key={challenge.title}
            data-slot="feature-card"
            style={stagger(i, 60, 180)}
            className={cn(
              ENTER,
              'group relative flex flex-col items-center gap-6 overflow-hidden rounded-xs border border-border bg-background px-8 pb-8 pt-10 text-center',
            )}
          >
            <div
              data-slot="feature-card-orb"
              className="relative mx-auto flex size-32 items-center justify-center rounded-full border border-border bg-background shadow-xs outline outline-border outline-offset-4"
            >
              <div
                aria-hidden
                className="absolute inset-0 z-10 scale-120 bg-radial from-foreground/20 via-foreground/5 to-transparent blur-xl"
              />
              <challenge.icon aria-hidden className="relative z-20 size-12 text-warm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-medium text-foreground">{challenge.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{challenge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Feature07;
