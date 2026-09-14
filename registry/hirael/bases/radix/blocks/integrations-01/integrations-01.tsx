'use client';

import * as React from 'react';
import { ArrowRight, Boxes, Cloud, Database, Lock, Mail, MessageCircle, Package, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Card } from '@/registry/hirael/bases/radix/ui/card';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface Spoke {
  name: string;
  icon: LucideIcon;
  /** Position on the orbit ring, in degrees clockwise from top (0 = 12 o'clock). */
  angle: number;
  category: string;
  href: string;
}

const SPOKES: readonly Spoke[] = [
  { name: 'Postgres', icon: Database, angle: 51, category: 'Storage', href: '#' },
  { name: 'Resend', icon: Mail, angle: 103, category: 'Email', href: '#' },
  { name: 'Discord', icon: MessageCircle, angle: 154, category: 'Comms', href: '#' },
  { name: 'S3', icon: Cloud, angle: 206, category: 'Storage', href: '#' },
  { name: 'Vault', icon: Lock, angle: 257, category: 'Secrets', href: '#' },
  { name: 'npm', icon: Package, angle: 309, category: 'Registry', href: '#' },
] as const;

const ORBIT = 42;

const spokePosition = (angle: number) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: 50 + ORBIT * Math.cos(rad), y: 50 + ORBIT * Math.sin(rad) };
};

const Integrations01 = () => {
  const [active, setActive] = React.useState<string | null>(null);

  return (
    <section
      data-slot="integrations"
      className="relative isolate overflow-hidden bg-background py-20 sm:py-28"
      aria-labelledby="integrations-01-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="container w-full">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div data-slot="integrations-header" className="flex flex-col gap-5 lg:col-span-5">
            <Badge
              variant="outline"
              className={cn(ENTER, 'w-fit rounded-full bg-card/70 px-4 py-1.5 text-xs uppercase text-muted-foreground')}
            >
              Integrations
            </Badge>
            <h2
              id="integrations-01-heading"
              style={stagger(1)}
              className={cn(
                ENTER,
                'font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl md:text-6xl',
              )}
            >
              Plays well with the rest of your stack.
            </h2>
            <p style={stagger(2)} className={cn(ENTER, 'text-base text-muted-foreground sm:text-lg')}>
              Hirael is the surface. Your backend, your storage, your CI, your secrets; pick whatever you already use.
              We don&apos;t lock you in, and we don&apos;t bring our own server.
            </p>

            <ul
              data-slot="integrations-list"
              aria-label="Supported integrations"
              className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 min-[420px]:grid-cols-2 sm:max-w-md"
              onMouseLeave={() => setActive(null)}
            >
              {SPOKES.map((spoke, index) => (
                <li key={spoke.name} style={stagger(index, 50, 180)} className={ENTER}>
                  <a
                    href={spoke.href}
                    data-active={active === spoke.name || undefined}
                    onMouseEnter={() => setActive(spoke.name)}
                    onFocus={() => setActive(spoke.name)}
                    onBlur={() => setActive(null)}
                    className="flex items-center gap-2 rounded-sm px-1.5 py-1.5 text-sm text-foreground transition-colors duration-150 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-active:bg-accent"
                  >
                    <spoke.icon aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="font-medium">{spoke.name}</span>
                    <Badge variant="outline" className="ms-auto">
                      {spoke.category}
                    </Badge>
                  </a>
                </li>
              ))}
            </ul>

            <Button
              asChild
              variant="link"
              style={stagger(SPOKES.length, 50, 180)}
              className={cn(ENTER, 'group mt-4 h-auto w-fit p-0')}
            >
              <a href="#">
                Browse all 40+ integrations
                <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </a>
            </Button>
          </div>

          <div
            style={stagger(0, 0, 240)}
            className={cn(ENTER, 'relative flex items-center justify-center lg:col-span-7')}
          >
            <Hub active={active} onActiveChange={setActive} />
          </div>
        </div>
      </div>
    </section>
  );
};

interface HubProps {
  active: string | null;
  onActiveChange: (name: string | null) => void;
}

const Hub = ({ active, onActiveChange }: HubProps) => {
  return (
    <div
      data-slot="integrations-hub"
      role="group"
      aria-label="Hirael at the center of its integrations"
      className="relative isolate aspect-square w-full max-w-[440px]"
    >
      <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 size-full text-border">
        {SPOKES.map((spoke) => {
          const { x, y } = spokePosition(spoke.angle);
          const isActive = active === spoke.name;
          return (
            <line
              key={spoke.name}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth={isActive ? 0.6 : 0.4}
              strokeDasharray={isActive ? undefined : '0.8 1.2'}
              className={cn(
                'transition-[color,opacity] duration-150',
                isActive ? 'text-warm opacity-100' : 'opacity-70',
              )}
            />
          );
        })}
        <circle
          cx="50"
          cy="50"
          r={ORBIT}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="1 1.5"
          opacity="0.5"
        />
        <circle
          cx="50"
          cy="50"
          r={ORBIT - 14}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="1 1.5"
          opacity="0.35"
        />
      </svg>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 m-auto size-32 rounded-full bg-primary opacity-[0.18] blur-3xl"
      />

      <Card className="absolute inset-0 m-auto flex size-[22%] items-center justify-center gap-0 rounded-2xl p-0 shadow-lg">
        <div className="flex flex-col items-center gap-1.5">
          <Boxes className="size-7 text-foreground" aria-hidden />
          <span className="text-[10px] font-semibold uppercase text-foreground">Hirael</span>
        </div>
        <span
          aria-hidden
          className="absolute -inset-2 -z-10 rounded-2xl border border-dashed border-border opacity-70"
        />
      </Card>

      {SPOKES.map((spoke) => {
        const { x, y } = spokePosition(spoke.angle);
        const isActive = active === spoke.name;
        return (
          <a
            key={spoke.name}
            href={spoke.href}
            aria-label={`${spoke.name} integration, ${spoke.category}`}
            data-active={isActive || undefined}
            onMouseEnter={() => onActiveChange(spoke.name)}
            onMouseLeave={() => onActiveChange(null)}
            onFocus={() => onActiveChange(spoke.name)}
            onBlur={() => onActiveChange(null)}
            className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span
              className={cn(
                'relative flex size-12 items-center justify-center rounded-full bg-background text-muted-foreground transition-[color,transform] duration-150 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none',
                isActive && '-translate-y-0.5 text-foreground',
              )}
            >
              <spoke.icon className="size-5" aria-hidden />
            </span>
            <span
              className={cn(
                'absolute start-1/2 top-full mt-1 w-max -translate-x-1/2 text-xs uppercase transition-colors duration-150 rtl:translate-x-1/2',
                isActive ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {spoke.name}
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default Integrations01;
