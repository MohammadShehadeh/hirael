'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/registry/hirael/bases/radix/components/animated-number';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/radix/ui/avatar';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { Switch } from '@/registry/hirael/bases/radix/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/radix/ui/toggle-group';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-1 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;
const POP = `animate-in fade-in zoom-in-90 duration-200 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface BentoTileProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  title: React.ReactNode;
  description: React.ReactNode;
  /** Rendered at the end of the header row, e.g. a counter or a button. */
  action?: React.ReactNode;
}

const BentoTile = ({ title, description, action, className, children, ...props }: BentoTileProps) => {
  return (
    <article
      data-slot="bento-tile"
      className={cn(
        'flex min-w-0 flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground',
        className,
      )}
      {...props}
    >
      <div data-slot="bento-tile-header" className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      <div data-slot="bento-tile-body" className="flex flex-1 flex-col">
        {children}
      </div>
    </article>
  );
};

type TileProps = Omit<BentoTileProps, 'title' | 'description' | 'action' | 'children'>;

interface Person {
  id: string;
  name: string;
  initials: string;
  ring: string;
}

const PEOPLE: readonly Person[] = [
  { id: 'maya', name: 'Maya Chen', initials: 'MC', ring: 'border-chart-1' },
  { id: 'tom', name: 'Tom Okafor', initials: 'TO', ring: 'border-chart-2' },
  { id: 'sara', name: 'Sara Lindqvist', initials: 'SL', ring: 'border-chart-3' },
  { id: 'dev', name: 'Dev Patel', initials: 'DP', ring: 'border-chart-4' },
  { id: 'ana', name: 'Ana Ruiz', initials: 'AR', ring: 'border-chart-5' },
];

const personById = (id: string) => PEOPLE.find((person) => person.id === id) ?? PEOPLE[0];

interface PersonAvatarProps extends React.ComponentProps<'span'> {
  person: Person;
  size?: 'sm' | 'md';
}

// The coloured ring matches the person's cursor colour in the editor.
const PersonAvatar = ({ person, size = 'md', className, ...props }: PersonAvatarProps) => {
  return (
    <span
      data-slot="person-avatar"
      title={person.name}
      className={cn('inline-flex shrink-0 rounded-full border-2 bg-card p-px', person.ring, className)}
      {...props}
    >
      <Avatar size={size === 'md' ? 'default' : 'sm'}>
        <AvatarFallback>{person.initials}</AvatarFallback>
      </Avatar>
    </span>
  );
};

const SECTIONS = ['Overview', 'Pricing', 'Timeline', 'Risks'] as const;
type Section = (typeof SECTIONS)[number];
type Locations = Record<string, Section | null>;

const INITIAL_LOCATIONS: Locations = { maya: 'Pricing', tom: 'Pricing', sara: 'Timeline', dev: 'Overview', ana: null };

const MOVES: readonly { id: string; to: Section | null }[] = [
  { id: 'ana', to: 'Risks' },
  { id: 'dev', to: 'Pricing' },
  { id: 'sara', to: null },
  { id: 'maya', to: 'Timeline' },
  { id: 'ana', to: 'Overview' },
  { id: 'sara', to: 'Timeline' },
  { id: 'tom', to: 'Risks' },
  { id: 'dev', to: 'Overview' },
  { id: 'ana', to: null },
  { id: 'maya', to: 'Pricing' },
  { id: 'tom', to: 'Pricing' },
];

const describeMove = (step: number, before: Locations) => {
  const move = MOVES[step % MOVES.length];
  const name = personById(move.id).name.split(' ')[0];
  if (move.to === null) return `${name} left the doc`;
  if (before[move.id] === null) return `${name} joined in ${move.to}`;

  return `${name} moved to ${move.to}`;
};

const PresenceTile = (props: TileProps) => {
  const [presence, setPresence] = React.useState({ step: 0, locations: INITIAL_LOCATIONS, last: '' });
  const [following, setFollowing] = React.useState<string | null>(null);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setPresence(({ step, locations }) => {
        const move = MOVES[step % MOVES.length];

        return {
          step: step + 1,
          locations: { ...locations, [move.id]: move.to },
          last: describeMove(step, locations),
        };
      });
    }, 2600);

    return () => window.clearInterval(id);
  }, []);

  const online = PEOPLE.filter((person) => presence.locations[person.id] !== null);
  const followed = following ? personById(following) : null;
  const followedSection = following ? presence.locations[following] : null;

  return (
    <BentoTile
      data-slot="presence"
      title="See who is in the doc"
      description="Everyone's place in the outline, live. Pick a person to follow along."
      action={
        <span className="text-sm text-muted-foreground tabular-nums">
          <AnimatedNumber value={online.length} startValue={online.length} duration={300} /> viewing
        </span>
      }
      {...props}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <ul aria-label="People in this doc" className="flex items-center">
            {online.map((person) => (
              <li key={person.id} className={cn(POP, 'not-first:-ms-2')}>
                <button
                  type="button"
                  aria-pressed={following === person.id}
                  aria-label={`Follow ${person.name}`}
                  onClick={() => setFollowing((current) => (current === person.id ? null : person.id))}
                  className={cn(
                    'relative block rounded-full ring-2 ring-card transition-transform duration-150 ease-out outline-none hover:z-10 hover:-translate-y-0.5 focus-visible:z-10 focus-visible:ring-ring',
                    following === person.id && 'z-10 -translate-y-0.5',
                  )}
                >
                  <PersonAvatar person={person} />
                </button>
              </li>
            ))}
          </ul>
          <p aria-live="polite" className="min-w-0 flex-1 text-sm text-muted-foreground">
            {presence.last ? (
              <span key={presence.step} className={cn(SWAP, 'block truncate')}>
                {presence.last}
              </span>
            ) : (
              'Q4 launch plan, edited 4 minutes ago'
            )}
          </p>
        </div>

        <ol className="flex flex-col divide-y divide-border border-y border-border">
          {SECTIONS.map((section, index) => {
            const here = online.filter((person) => presence.locations[person.id] === section);
            const isFollowed = followedSection === section;

            return (
              <li
                key={section}
                data-slot="presence-section"
                data-followed={isFollowed || undefined}
                className={cn(
                  'flex h-11 items-center gap-3 px-2 text-sm transition-colors duration-200',
                  isFollowed && 'bg-muted',
                )}
              >
                <span className="w-4 text-muted-foreground tabular-nums">{index + 1}</span>
                <span className={cn('flex-1', isFollowed && 'font-medium')}>{section}</span>
                <span className="flex items-center">
                  {here.map((person) => (
                    <PersonAvatar
                      key={person.id}
                      person={person}
                      size="sm"
                      className={cn(POP, 'ring-2 ring-card not-first:-ms-1.5')}
                    />
                  ))}
                </span>
              </li>
            );
          })}
        </ol>

        <p className="text-sm text-muted-foreground">
          {followed ? (
            followedSection ? (
              <>
                Following <span className="text-foreground">{followed.name}</span> in {followedSection}.
              </>
            ) : (
              <>{followed.name} is not in the doc right now.</>
            )
          ) : (
            'Not following anyone.'
          )}
        </p>
      </div>
    </BentoTile>
  );
};

interface Comment {
  id: number;
  author: string;
  initials: string;
  time: string;
  body: string;
}

const INITIAL_COMMENTS: readonly Comment[] = [
  {
    id: 1,
    author: 'Maya Chen',
    initials: 'MC',
    time: '2h',
    body: 'Can support handle 200 accounts in week one? The last beta peaked at 60 tickets a day.',
  },
  {
    id: 2,
    author: 'Tom Okafor',
    initials: 'TO',
    time: '1h',
    body: '@Maya we can if onboarding runs through the new checklist. I would still start with 120.',
  },
  {
    id: 3,
    author: 'Sara Lindqvist',
    initials: 'SL',
    time: '25m',
    body: 'Agree on 120. @Tom I will move the date to Oct 21 in the timeline.',
  },
  {
    id: 4,
    author: 'Dev Patel',
    initials: 'DP',
    time: '12m',
    body: 'Trial usage limits ship Oct 18, so 120 accounts stay under the free tier cap.',
  },
  {
    id: 5,
    author: 'Maya Chen',
    initials: 'MC',
    time: '4m',
    body: 'Works for me. @Sara can you update the invite email as well?',
  },
];

const renderBody = (body: string) =>
  body.split(/(@\w+)/g).map((part, index) =>
    part.startsWith('@') ? (
      <span key={index} className="font-medium text-primary">
        {part}
      </span>
    ) : (
      part
    ),
  );

const CommentThread = (props: TileProps) => {
  const [comments, setComments] = React.useState<readonly Comment[]>(INITIAL_COMMENTS);
  const [draft, setDraft] = React.useState('');
  const [resolved, setResolved] = React.useState(false);

  const post = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setComments((list) => [...list, { id: list.length + 1, author: 'You', initials: 'JB', time: 'just now', body }]);
    setDraft('');
  };

  return (
    <BentoTile
      data-slot="comment-thread"
      title="Comment on the exact line"
      description="Threads stay attached to the sentence they are about, and resolve when the call is made."
      {...props}
    >
      <div className="flex flex-1 flex-col gap-5">
        <blockquote className="border-s-2 border-primary ps-3 text-sm">
          Open the beta to <span className="bg-primary/15 px-0.5">200 design partners</span> on Oct 14.
        </blockquote>

        {resolved ? (
          <div key="resolved" className={cn(SWAP, 'flex flex-1 flex-col items-start gap-3')}>
            <p className="flex items-center gap-2 text-sm">
              <Check aria-hidden className="size-4 text-primary" />
              Resolved by you with {comments.length} comments.
            </p>
            <Button variant="outline" size="sm" onClick={() => setResolved(false)}>
              <RotateCcw aria-hidden />
              Reopen
            </Button>
          </div>
        ) : (
          <div key="open" className="flex flex-1 flex-col gap-5">
            <ol aria-live="polite" className="flex flex-col gap-4">
              {comments.map((comment) => (
                <li key={comment.id} className={cn(comment.id > INITIAL_COMMENTS.length && SWAP, 'flex gap-3 text-sm')}>
                  <Avatar size="sm" className="mt-0.5">
                    <AvatarFallback>{comment.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="flex items-baseline gap-2">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{comment.time}</span>
                    </span>
                    <p className="break-words text-muted-foreground">{renderBody(comment.body)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <form onSubmit={post} className="mt-auto flex flex-col gap-2">
              <label htmlFor="bento-02-comment" className="sr-only">
                Reply
              </label>
              <Input
                id="bento-02-comment"
                name="comment"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Reply, or @mention someone"
                autoComplete="off"
              />
              <div className="flex items-center justify-between gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setResolved(true)}>
                  <Check aria-hidden />
                  Resolve
                </Button>
                <Button type="submit" size="sm" disabled={!draft.trim()}>
                  Comment
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </BentoTile>
  );
};

const COLUMNS = ['To do', 'In progress', 'Done'] as const;
type Column = (typeof COLUMNS)[number];

interface Task {
  id: string;
  title: string;
  owner: string;
  column: Column;
}

const INITIAL_TASKS: readonly Task[] = [
  { id: 'faq', title: 'Draft the pricing FAQ', owner: 'sara', column: 'To do' },
  { id: 'video', title: 'Record the onboarding video', owner: 'ana', column: 'To do' },
  { id: 'invites', title: 'Send beta invite emails', owner: 'tom', column: 'In progress' },
  { id: 'limits', title: 'Usage limits for trials', owner: 'dev', column: 'In progress' },
  { id: 'shortlist', title: 'Partner shortlist', owner: 'maya', column: 'Done' },
];

const MiniKanban = (props: TileProps) => {
  const [tasks, setTasks] = React.useState<readonly Task[]>(INITIAL_TASKS);
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<Column | null>(null);

  const move = (id: string, column: Column) =>
    setTasks((list) => [
      ...list.filter((task) => task.id !== id),
      ...list.filter((task) => task.id === id).map((task) => ({ ...task, column })),
    ]);

  const done = tasks.filter((task) => task.column === 'Done').length;

  return (
    <BentoTile
      data-slot="mini-kanban"
      title="Plan in the same place"
      description="Drag a card to another column, or use its arrows."
      action={
        <span className="text-sm text-muted-foreground tabular-nums">
          {done} of {tasks.length} done
        </span>
      }
      {...props}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {COLUMNS.map((column, columnIndex) => {
          const cards = tasks.filter((task) => task.column === column);

          return (
            <div
              key={column}
              data-slot="mini-kanban-column"
              data-over={over === column || undefined}
              onDragOver={(event) => {
                if (!dragging) return;
                event.preventDefault();
                setOver(column);
              }}
              onDragLeave={() => setOver((current) => (current === column ? null : current))}
              onDrop={(event) => {
                event.preventDefault();
                if (dragging) move(dragging, column);
                setDragging(null);
                setOver(null);
              }}
              className={cn(
                'flex min-h-40 flex-col gap-2 rounded-lg border border-dashed border-transparent bg-muted/50 p-2 transition-colors duration-150',
                over === column && 'border-primary bg-primary/5',
              )}
            >
              <div className="flex items-center justify-between px-1 pt-1 pb-0.5 text-xs text-muted-foreground">
                <span className="uppercase">{column}</span>
                <span className="tabular-nums">{cards.length}</span>
              </div>
              {cards.map((task) => {
                const owner = personById(task.owner);

                return (
                  <div
                    key={task.id}
                    data-slot="mini-kanban-card"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', task.id);
                      setDragging(task.id);
                    }}
                    onDragEnd={() => {
                      setDragging(null);
                      setOver(null);
                    }}
                    className={cn(
                      SWAP,
                      'group/card flex cursor-grab flex-col gap-2 rounded-md border border-border bg-card p-2.5 text-sm shadow-xs active:cursor-grabbing',
                      dragging === task.id && 'opacity-50',
                    )}
                  >
                    <span className="leading-snug">{task.title}</span>
                    <div className="flex items-center justify-between gap-2">
                      <PersonAvatar person={owner} size="sm" />
                      <span className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Move ${task.title} back`}
                          disabled={columnIndex === 0}
                          onClick={() => move(task.id, COLUMNS[columnIndex - 1])}
                        >
                          <ArrowLeft aria-hidden className="rtl:rotate-180" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Move ${task.title} forward`}
                          disabled={columnIndex === COLUMNS.length - 1}
                          onClick={() => move(task.id, COLUMNS[columnIndex + 1])}
                        >
                          <ArrowRight aria-hidden className="rtl:rotate-180" />
                        </Button>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </BentoTile>
  );
};

interface Integration {
  id: string;
  name: string;
  off: string;
  on: string;
}

const INTEGRATIONS: readonly Integration[] = [
  { id: 'slack', name: 'Slack', off: 'Post comments and mentions to a channel', on: 'Posting to #launch-q4' },
  { id: 'github', name: 'GitHub', off: 'Link pull requests to cards', on: 'Watching hirael/web and hirael/api' },
  { id: 'figma', name: 'Figma', off: 'Embed frames that stay up to date', on: 'Syncing 12 embedded frames' },
  { id: 'linear', name: 'Linear', off: 'Turn a card into an issue', on: 'Creating issues in team GROW' },
  { id: 'drive', name: 'Google Drive', off: 'Attach docs and sheets', on: 'Attached files open in a preview' },
];

const IntegrationsList = (props: TileProps) => {
  const [enabled, setEnabled] = React.useState<ReadonlySet<string>>(() => new Set(['slack', 'github', 'figma']));

  const toggle = (id: string, on: boolean) =>
    setEnabled((current) => {
      const next = new Set(current);
      if (on) next.add(id);
      else next.delete(id);

      return next;
    });

  return (
    <BentoTile
      data-slot="integrations"
      title="Connect the tools you use"
      description="Switch an integration on and it works right away. No setup screens."
      action={
        <span className="text-sm text-muted-foreground tabular-nums">
          {enabled.size} of {INTEGRATIONS.length} on
        </span>
      }
      {...props}
    >
      <ul className="flex flex-col divide-y divide-border">
        {INTEGRATIONS.map((integration) => {
          const on = enabled.has(integration.id);
          const id = `bento-02-${integration.id}`;

          return (
            <li key={integration.id} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <label htmlFor={id} className="flex min-w-0 cursor-pointer flex-col gap-0.5 text-sm">
                <span className="font-medium">{integration.name}</span>
                <span key={String(on)} className={cn(SWAP, 'truncate text-muted-foreground')}>
                  {on ? integration.on : integration.off}
                </span>
              </label>
              <Switch id={id} checked={on} onCheckedChange={(checked) => toggle(integration.id, checked === true)} />
            </li>
          );
        })}
      </ul>
    </BentoTile>
  );
};

type Scope = 'all' | 'mentions' | 'none';
type Delivery = 'instant' | 'hourly' | 'daily';

const DAILY_EVENTS: Record<Scope, number> = { all: 38, mentions: 9, none: 0 };
const WORK_HOURS = 8;

const perDay = (scope: Scope, delivery: Delivery) => {
  const events = DAILY_EVENTS[scope];
  if (events === 0) return 0;
  if (delivery === 'hourly') return Math.min(events, WORK_HOURS);
  if (delivery === 'daily') return 1;

  return events;
};

const NotificationPrefs = (props: TileProps) => {
  const [scope, setScope] = React.useState<Scope>('mentions');
  const [delivery, setDelivery] = React.useState<Delivery>('instant');
  const [weekends, setWeekends] = React.useState(true);

  const weekly = perDay(scope, delivery) * (weekends ? 5 : 7);
  const summary =
    scope === 'none'
      ? 'You will only see updates when you open the app.'
      : `${DAILY_EVENTS[scope]} ${scope === 'all' ? 'updates' : 'mentions and replies'} on a typical day, ${
          delivery === 'instant'
            ? 'sent as they happen'
            : delivery === 'hourly'
              ? 'grouped into one message an hour'
              : 'in one email at 9:00'
        }.`;

  return (
    <BentoTile
      data-slot="notification-prefs"
      title="Hear about what matters"
      description="Choose what reaches you and how often. The estimate uses your team's last 30 days."
      {...props}
    >
      <div className="flex flex-1 flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span id="bento-02-scope" className="text-xs text-muted-foreground uppercase">
            Notify me about
          </span>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={scope}
            onValueChange={(next) => {
              if (next) setScope(next as Scope);
            }}
            aria-labelledby="bento-02-scope"
            className="flex-wrap"
          >
            <ToggleGroupItem value="all">All activity</ToggleGroupItem>
            <ToggleGroupItem value="mentions">Mentions</ToggleGroupItem>
            <ToggleGroupItem value="none">Nothing</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex flex-col gap-2">
          <span id="bento-02-delivery" className="text-xs text-muted-foreground uppercase">
            Delivery
          </span>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={delivery}
            disabled={scope === 'none'}
            onValueChange={(next) => {
              if (next) setDelivery(next as Delivery);
            }}
            aria-labelledby="bento-02-delivery"
            className="flex-wrap"
          >
            <ToggleGroupItem value="instant">Instantly</ToggleGroupItem>
            <ToggleGroupItem value="hourly">Hourly</ToggleGroupItem>
            <ToggleGroupItem value="daily">Daily digest</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <label htmlFor="bento-02-weekends" className="flex cursor-pointer items-center justify-between gap-4 text-sm">
          Pause on weekends
          <Switch
            id="bento-02-weekends"
            checked={weekends}
            onCheckedChange={(checked) => setWeekends(checked === true)}
          />
        </label>
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-border pt-4">
          <p aria-live="polite" className="max-w-64 text-sm text-muted-foreground">
            {summary}
          </p>
          <span className="flex shrink-0 flex-col items-end">
            <span className="text-3xl font-medium tracking-tight">
              <AnimatedNumber value={weekly} duration={400} />
            </span>
            <span className="text-xs text-muted-foreground">a week</span>
          </span>
        </div>
      </div>
    </BentoTile>
  );
};

const Bento02 = () => {
  return (
    <section data-slot="bento" className="bg-background px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header data-slot="bento-header" className="flex max-w-2xl flex-col gap-4">
          <h2
            className={cn(ENTER, 'font-serif text-3xl font-medium tracking-tight text-balance md:text-4xl lg:text-5xl')}
          >
            Write, decide and plan with your whole team
          </h2>
          <p style={stagger(1)} className={cn(ENTER, 'text-base text-pretty text-muted-foreground md:text-lg')}>
            Docs, comments and tasks live together, so the decision and the work that follows never drift apart. Try
            each panel.
          </p>
        </header>

        <div data-slot="bento-grid" className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
          <PresenceTile style={stagger(0, 70, 150)} className={cn(ENTER, 'md:col-span-3 lg:col-span-7')} />
          <CommentThread
            style={stagger(1, 70, 150)}
            className={cn(ENTER, 'md:col-span-3 lg:col-span-5 lg:row-span-2')}
          />
          <MiniKanban style={stagger(2, 70, 150)} className={cn(ENTER, 'md:col-span-6 lg:col-span-7')} />
          <IntegrationsList style={stagger(3, 70, 150)} className={cn(ENTER, 'md:col-span-3 lg:col-span-6')} />
          <NotificationPrefs style={stagger(4, 70, 150)} className={cn(ENTER, 'md:col-span-3 lg:col-span-6')} />
        </div>
      </div>
    </section>
  );
};

export { BentoTile, PresenceTile, CommentThread, MiniKanban, IntegrationsList, NotificationPrefs };
export default Bento02;
