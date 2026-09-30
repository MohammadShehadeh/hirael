import {
  ArrowRight,
  Boxes,
  Cloud,
  Database,
  GitBranch,
  Lock,
  Mail,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface Spoke {
  name: string;
  icon: LucideIcon;
  /** Degrees clockwise from 12 o'clock. */
  angle: number;
  href: string;
}

const SPOKES: readonly Spoke[] = [
  { name: 'Postgres', icon: Database, angle: 0, href: '#' },
  { name: 'Resend', icon: Mail, angle: 60, href: '#' },
  { name: 'S3', icon: Cloud, angle: 120, href: '#' },
  { name: 'Git', icon: GitBranch, angle: 180, href: '#' },
  { name: 'Vault', icon: Lock, angle: 240, href: '#' },
  { name: 'Discord', icon: MessageCircle, angle: 300, href: '#' },
] as const;

// The viewBox is 100 x 72 and the diagram keeps that aspect ratio, so a percentage of the
// box is the same point in both the SVG and the absolutely placed tiles.
const WIDTH = 100;
const HEIGHT = 72;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const RX = 34;
const RY = 29;

const spokePosition = (angle: number) => {
  const rad = (angle * Math.PI) / 180;

  return {
    x: Math.round((CX + RX * Math.sin(rad)) * 100) / 100,
    y: Math.round((CY - RY * Math.cos(rad)) * 100) / 100,
  };
};

const Integrations04 = () => {
  return (
    <section
      data-slot="integrations"
      className="bg-background py-20 sm:py-28"
      aria-labelledby="integrations-04-heading"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center">
        <h2
          id="integrations-04-heading"
          style={stagger(1)}
          className={cn(ENTER, 'font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl')}
        >
          One hub for your entire stack
        </h2>
        <p style={stagger(2)} className={cn(ENTER, 'mt-4 max-w-xl text-base text-pretty text-muted-foreground')}>
          Hirael sits in the middle of your workflow and keeps every tool you already run in step, so nothing drifts.
        </p>
      </div>

      <div
        data-slot="integrations-hub"
        dir="ltr"
        role="group"
        aria-label="Hirael at the center of its integrations"
        style={stagger(3)}
        className={cn(ENTER, 'relative mx-auto mt-12 aspect-[100/72] w-full max-w-xl px-4 sm:mt-16')}
      >
        <div className="relative size-full">
          <div aria-hidden className="absolute inset-[16%] rounded-full border border-dashed border-border/70" />
          <div
            aria-hidden
            className="absolute start-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
          />
          <svg aria-hidden viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="absolute inset-0 size-full text-border">
            {SPOKES.map((spoke, index) => {
              const { x, y } = spokePosition(spoke.angle);
              // Alternate direction so data visibly moves both ways.
              const path = index % 2 === 0 ? `M${x} ${y} L${CX} ${CY}` : `M${CX} ${CY} L${x} ${y}`;

              return (
                <g key={spoke.name}>
                  <line x1={CX} y1={CY} x2={x} y2={y} stroke="currentColor" strokeWidth="0.3" />
                  <circle r="0.9" className="fill-primary motion-reduce:hidden">
                    <animateMotion dur="3s" begin={`-${index * 0.5}s`} repeatCount="indefinite" path={path} />
                  </circle>
                </g>
              );
            })}
          </svg>

          <div className="absolute start-1/2 top-1/2 z-10 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg sm:size-20">
            <Boxes aria-hidden className="size-7 sm:size-9" />
          </div>

          {SPOKES.map((spoke) => {
            const { x, y } = spokePosition(spoke.angle);

            return (
              <a
                key={spoke.name}
                href={spoke.href}
                aria-label={spoke.name}
                title={spoke.name}
                className="group absolute z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-xs transition-[color,transform,box-shadow] duration-150 ease-out hover:-translate-y-[55%] hover:text-foreground hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none sm:size-14"
                style={{ left: `${(x / WIDTH) * 100}%`, top: `${(y / HEIGHT) * 100}%` }}
              >
                <spoke.icon aria-hidden className="size-5 sm:size-6" />
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex justify-center px-4 sm:mt-14">
        <Button asChild style={stagger(4, 60, 200)} className={cn(ENTER, 'group')}>
          <a href="#">
            Browse integrations
            <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </a>
        </Button>
      </div>
    </section>
  );
};

export default Integrations04;
