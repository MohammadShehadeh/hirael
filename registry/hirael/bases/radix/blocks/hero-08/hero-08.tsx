import * as React from 'react';
import { Play, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

/** Entrance: fade and rise, skipped under reduced motion. */
const RISE =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 70, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
};

type CardState = 'queued' | 'active' | 'review' | 'done';

interface BoardCard {
  title: string;
  tag: string;
  owner: string;
  state: CardState;
  meta: string;
}

const BOARD: { name: string; cards: BoardCard[] }[] = [
  {
    name: 'Up next',
    cards: [
      { title: 'Billing page empty state', tag: 'Design', owner: 'NR', state: 'queued', meta: '2 comments' },
      { title: 'Rate limit the export API', tag: 'Backend', owner: 'TL', state: 'queued', meta: 'Due Fri' },
      { title: 'Onboarding checklist copy', tag: 'Content', owner: 'GO', state: 'queued', meta: '1 comment' },
    ],
  },
  {
    name: 'In progress',
    cards: [
      { title: 'Team invites by link', tag: 'Frontend', owner: 'AM', state: 'active', meta: 'Editing now' },
      { title: 'Search across projects', tag: 'Backend', owner: 'JP', state: 'review', meta: 'PR #482' },
    ],
  },
  {
    name: 'Shipped',
    cards: [
      { title: 'Dark mode for docs', tag: 'Frontend', owner: 'RK', state: 'done', meta: 'Tue' },
      { title: 'CSV import for tasks', tag: 'Backend', owner: 'LM', state: 'done', meta: 'Mon' },
    ],
  },
];

const STATE_LABEL: Record<CardState, string> = {
  queued: 'Queued',
  active: 'Live',
  review: 'In review',
  done: 'Done',
};

const Hero08 = () => {
  return (
    <section
      data-slot="hero"
      className="relative z-0 min-h-180 overflow-hidden rounded-sm border border-border bg-background pt-30"
    >
      <div
        data-slot="hero-backdrop"
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage: [
            'radial-gradient(120% 90% at 50% -12%, color-mix(in oklch, var(--primary) 30%, transparent), transparent 56%)',
            'radial-gradient(80% 70% at 84% 110%, color-mix(in oklch, var(--accent-cool) 26%, transparent), transparent 62%)',
            'radial-gradient(70% 60% at 8% 78%, color-mix(in oklch, var(--warm) 18%, transparent), transparent 66%)',
          ].join(', '),
        }}
      />
      <div
        data-slot="hero-grid"
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 mask-[radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div data-slot="hero-content" className="relative z-10 px-6">
        <div className="mx-auto mb-8 max-w-4xl space-y-4 text-center sm:mb-12 md:mb-16">
          <Badge variant="outline" className={RISE}>
            <Sparkles aria-hidden className="size-3" />
            Boards for product teams
          </Badge>

          <h1
            style={stagger(1)}
            className={cn(
              'font-serif text-5xl leading-[1.04] font-medium tracking-tight md:text-6xl lg:text-7xl',
              RISE,
            )}
          >
            One workspace for every <span className="text-muted-foreground italic">moving part</span>
          </h1>

          <p
            style={stagger(2)}
            className={cn('mx-auto mt-8 w-full text-base tracking-tight text-muted-foreground sm:text-lg', RISE)}
          >
            Build, review, and ship your work from one place. Drag to arrange, connect the pieces, and keep the details
            that matter in view.
          </p>

          <div
            data-slot="hero-actions"
            style={stagger(3)}
            className={cn('mx-auto my-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:max-w-md', RISE)}
          >
            <Button asChild size="lg">
              <a className="flex items-center gap-2" href="#">
                <GithubIcon className="size-4" />
                Connect repository
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a className="flex items-center gap-2" href="#features">
                <Play className="size-3.5 fill-current" />
                See how it works
              </a>
            </Button>
          </div>
        </div>

        <div
          data-slot="hero-preview"
          style={stagger(4)}
          className={cn(
            RISE,
            'mx-auto max-w-5xl rounded-t-xl border border-b-0 border-border',
            'bg-card/60 p-2 shadow-elevated backdrop-blur-sm',
          )}
        >
          <div className="flex items-center justify-between gap-3 px-2 pb-2">
            <div aria-hidden className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-muted" />
              <span className="size-2.5 rounded-full bg-muted" />
              <span className="size-2.5 rounded-full bg-muted" />
            </div>
            <span className="truncate text-xs text-muted-foreground">Q3 launch board</span>
            <span className="text-xs tabular-nums text-muted-foreground">7 tasks</span>
          </div>
          <div
            data-slot="hero-board"
            className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-background/80 p-3 text-start sm:grid-cols-3"
          >
            {BOARD.map((column, columnIndex) => (
              <div
                key={column.name}
                data-slot="hero-board-column"
                className={cn('flex flex-col gap-2', columnIndex === 2 && 'hidden sm:flex')}
              >
                <div className="flex items-center justify-between px-1 pb-1 text-xs text-muted-foreground">
                  <span className="uppercase">{column.name}</span>
                  <span className="tabular-nums">{column.cards.length}</span>
                </div>
                {column.cards.map((card) => (
                  <div
                    key={card.title}
                    data-slot="hero-board-card"
                    className={cn(
                      'flex flex-col gap-2 rounded-md border border-border bg-card p-2.5',
                      card.state === 'active' && 'border-accent-cool/40',
                    )}
                  >
                    <span
                      className={cn(
                        'text-sm leading-snug font-medium',
                        card.state === 'done' && 'text-muted-foreground line-through decoration-border',
                      )}
                    >
                      {card.title}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-sm border border-border px-1.5 py-0.5">{card.tag}</span>
                      <span
                        className={cn(
                          'truncate',
                          card.state === 'active' && 'text-accent-cool',
                          card.state === 'review' && 'text-warm',
                        )}
                      >
                        {card.state === 'queued' || card.state === 'done' ? card.meta : STATE_LABEL[card.state]}
                      </span>
                      <span className="ms-auto grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-medium text-foreground">
                        {card.owner}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero08;
