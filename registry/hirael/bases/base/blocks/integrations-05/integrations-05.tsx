import { Bell, Boxes, Calendar, CreditCard, Database, FileText, Mail, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface Tool {
  name: string;
  icon: LucideIcon;
  href: string;
}

// Tools on the left send data into the hub, tools on the right receive it back.
const SOURCES: readonly Tool[] = [
  { name: 'Postgres', icon: Database, href: '#' },
  { name: 'Calendar', icon: Calendar, href: '#' },
  { name: 'Docs', icon: FileText, href: '#' },
] as const;

const TARGETS: readonly Tool[] = [
  { name: 'Email', icon: Mail, href: '#' },
  { name: 'Alerts', icon: Bell, href: '#' },
  { name: 'Billing', icon: CreditCard, href: '#' },
] as const;

// Path and tile coordinates share one 900 x 400 space. The diagram keeps that aspect ratio,
// so a percentage of the box lands on the same point in the SVG and in the tiles.
const WIDTH = 900;
const HEIGHT = 400;
const ROWS = [60, 200, 340] as const;
const EDGE = 64;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };

const inbound = (y: number) => `M${EDGE} ${y} C250 ${y}, 250 ${CENTER.y}, ${CENTER.x} ${CENTER.y}`;
const outbound = (y: number) => `M${CENTER.x} ${CENTER.y} C650 ${CENTER.y}, 650 ${y}, ${WIDTH - EDGE} ${y}`;

const Integrations05 = () => {
  return (
    <section
      data-slot="integrations"
      className="bg-background py-20 sm:py-28"
      aria-labelledby="integrations-05-heading"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center">
        <h2
          id="integrations-05-heading"
          style={stagger(1)}
          className={cn(ENTER, 'font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl')}
        >
          Your data flows through one pipeline
        </h2>
        <p style={stagger(2)} className={cn(ENTER, 'mt-4 max-w-xl text-base text-pretty text-muted-foreground')}>
          Hirael pulls from the tools your team works in and pushes clean, structured data back out, so every system
          stays in step.
        </p>
      </div>

      <div
        data-slot="integrations-pipeline"
        dir="ltr"
        role="group"
        aria-label="Hirael syncing data between your tools"
        style={stagger(3)}
        className={cn(ENTER, 'mx-auto mt-12 w-full max-w-4xl px-4 sm:mt-16')}
      >
        <div className="relative aspect-[9/4] w-full">
          <svg
            aria-hidden
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="absolute inset-0 size-full text-muted-foreground/35"
          >
            {ROWS.map((y, index) => (
              <g key={`in-${y}`}>
                <path d={inbound(y)} fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle r="4" className="fill-primary motion-reduce:hidden">
                  <animateMotion dur="3.6s" begin={`-${index * 0.7}s`} repeatCount="indefinite" path={inbound(y)} />
                </circle>
              </g>
            ))}
            {ROWS.map((y, index) => (
              <g key={`out-${y}`}>
                <path d={outbound(y)} fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle r="4" className="fill-primary motion-reduce:hidden">
                  <animateMotion
                    dur="3.6s"
                    begin={`-${1.8 + index * 0.7}s`}
                    repeatCount="indefinite"
                    path={outbound(y)}
                  />
                </circle>
              </g>
            ))}
          </svg>

          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
          />
          <div className="absolute top-1/2 left-1/2 z-10 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg sm:size-20">
            <Boxes aria-hidden className="size-7 sm:size-9" />
          </div>

          {ROWS.map((y, index) => (
            <Tile
              key={SOURCES[index].name}
              tool={SOURCES[index]}
              left={(EDGE / WIDTH) * 100}
              top={(y / HEIGHT) * 100}
            />
          ))}
          {ROWS.map((y, index) => (
            <Tile
              key={TARGETS[index].name}
              tool={TARGETS[index]}
              left={((WIDTH - EDGE) / WIDTH) * 100}
              top={(y / HEIGHT) * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface TileProps {
  tool: Tool;
  left: number;
  top: number;
}

const Tile = ({ tool, left, top }: TileProps) => {
  return (
    <a
      href={tool.href}
      aria-label={tool.name}
      title={tool.name}
      className="absolute z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-xs transition-[color,transform,box-shadow] duration-150 ease-out hover:-translate-y-[55%] hover:text-foreground hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none sm:size-16"
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      <tool.icon aria-hidden className="size-5 sm:size-7" />
    </a>
  );
};

export default Integrations05;
