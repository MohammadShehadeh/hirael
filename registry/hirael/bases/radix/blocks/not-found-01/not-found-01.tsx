import * as React from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

interface Suggestion {
  route: string;
  description: string;
}

const SUGGESTIONS: readonly Suggestion[] = [
  { route: '/registry', description: 'Browse every shipped component' },
  { route: '/themes', description: 'Tune the accent and re-skin live' },
  { route: '/docs/install', description: 'Install your first component' },
];

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60): React.CSSProperties => ({
  animationDelay: `${index * step}ms`,
});

const NotFound01 = () => {
  return (
    <section data-slot="not-found" className="flex min-h-[80vh] items-center justify-center bg-background py-20">
      <div className="mx-auto w-full max-w-2xl px-6 md:px-10">
        <div className="flex flex-col items-start gap-6">
          <span className={cn(ENTER, 'text-xs text-muted-foreground uppercase tabular-nums')}>404</span>
          <h1
            style={stagger(1)}
            className={cn(ENTER, 'font-serif text-6xl leading-none font-medium tracking-tight sm:text-7xl')}
          >
            Page not found.
          </h1>
          <p style={stagger(2)} className={cn(ENTER, 'max-w-md text-base text-muted-foreground sm:text-lg')}>
            The address you tried doesn&apos;t lead anywhere. The page may have moved, or it may never have existed.
          </p>
          <div
            data-slot="not-found-actions"
            style={stagger(3)}
            className={cn(ENTER, 'flex flex-wrap items-center gap-3')}
          >
            <Button asChild variant="default" size="lg">
              <a href="#">Go home</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#">Browse docs</a>
            </Button>
          </div>

          <div data-slot="not-found-suggestions" className="mt-6 w-full border-t border-border pt-6">
            <span style={stagger(4)} className={cn(ENTER, 'block text-xs text-muted-foreground uppercase')}>
              Try one of these
            </span>
            <ul className="mt-3 flex flex-col">
              {SUGGESTIONS.map((s, index) => (
                <li
                  key={s.route}
                  style={stagger(5 + index)}
                  className={cn(ENTER, 'border-b border-border last:border-b-0')}
                >
                  <a
                    href={s.route}
                    className="group flex items-center justify-between gap-4 p-3 transition-colors duration-150 hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
                      <span dir="ltr" className="text-sm text-foreground">
                        {s.route}
                      </span>
                      <span className="text-sm text-pretty text-muted-foreground">{s.description}</span>
                    </div>
                    <ArrowRight
                      aria-hidden
                      className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-150 ease-out group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound01;
