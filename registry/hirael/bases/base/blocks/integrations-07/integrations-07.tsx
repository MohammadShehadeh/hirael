'use client';

import * as React from 'react';
import {
  ArrowRight,
  Bell,
  Calendar,
  Cloud,
  CreditCard,
  Database,
  FileText,
  GitBranch,
  Mail,
  Webhook,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface Tool {
  name: string;
  icon: LucideIcon;
}

const TOOLS: readonly Tool[] = [
  { name: 'Postgres', icon: Database },
  { name: 'Git', icon: GitBranch },
  { name: 'S3', icon: Cloud },
  { name: 'Calendar', icon: Calendar },
  { name: 'Docs', icon: FileText },
  { name: 'Email', icon: Mail },
  { name: 'Billing', icon: CreditCard },
  { name: 'Alerts', icon: Bell },
  { name: 'Webhooks', icon: Webhook },
] as const;

const INTERVAL = 2400;

const Integrations07 = () => {
  const [active, setActive] = React.useState(4);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => setActive((current) => (current + 1) % TOOLS.length), INTERVAL);

    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      data-slot="integrations"
      className="bg-background py-20 sm:py-28"
      aria-labelledby="integrations-07-heading"
    >
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-slot="integrations-header" className="flex flex-col items-start">
            <h2
              id="integrations-07-heading"
              style={stagger(1)}
              className={cn(ENTER, 'font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl')}
            >
              Bring your favorite tools together
            </h2>
            <p style={stagger(2)} className={cn(ENTER, 'mt-4 max-w-md text-base text-pretty text-muted-foreground')}>
              Hirael connects with the apps you already use, so your data and your team move as one. Add a tool in
              seconds and it starts syncing right away.
            </p>
            <Button render={<a href="#" />} nativeButton={false} style={stagger(3)} className={cn(ENTER, 'group mt-8')}>
              Browse integrations
              <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Button>
          </div>

          <div
            data-slot="integrations-grid"
            style={stagger(2, 60, 120)}
            className={cn(ENTER, 'mx-auto flex w-full max-w-sm flex-col items-center gap-9')}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <ul aria-label="Supported integrations" className="grid w-full grid-cols-3 gap-3">
              {TOOLS.map((tool, index) => (
                <li key={tool.name} className="nth-[3n+2]:translate-y-4">
                  <button
                    type="button"
                    aria-label={tool.name}
                    aria-pressed={index === active}
                    data-active={index === active || undefined}
                    onClick={() => setActive(index)}
                    className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground/70 shadow-xs transition-[color,transform,box-shadow,border-color] duration-300 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none data-active:scale-[1.06] data-active:border-primary/50 data-active:bg-primary/10 data-active:text-primary data-active:shadow-lg"
                  >
                    <tool.icon aria-hidden className="size-7 sm:size-8" />
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              Featured <span className="font-medium text-foreground">{TOOLS[active].name}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations07;
