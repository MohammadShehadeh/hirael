'use client';

import * as React from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/hirael/bases/base/ui/tabs';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const AUTO_ADVANCE_MS = 6000;

interface Story {
  value: string;
  name: string;
  wordmark: string;
  metric: string;
  metricLabel: string;
  period: string;
  quote: string;
  person: string;
  role: string;
  href: string;
}

const STORIES: readonly Story[] = [
  {
    value: 'northwind',
    name: 'Northwind',
    wordmark: 'text-lg font-semibold tracking-tight',
    metric: '41%',
    metricLabel: 'fewer tickets',
    period: 'First quarter after rollout',
    quote:
      'Customers stopped asking where their order was. The status page answered it before they thought to write in.',
    person: 'Nadia Rahman',
    role: 'Head of Support, Northwind',
    href: '#',
  },
  {
    value: 'halcyon',
    name: 'Halcyon',
    wordmark: 'text-xs font-medium uppercase tracking-[0.3em]',
    metric: '2 days',
    metricLabel: 'to onboard a clinic',
    period: 'Down from nine',
    quote: 'Setup used to be a week of calls. Now a practice manager does it alone on a Tuesday afternoon.',
    person: 'Tomas Lang',
    role: 'Operations Lead, Halcyon',
    href: '#',
  },
  {
    value: 'basalt',
    name: 'basalt',
    wordmark: 'text-xl font-bold lowercase tracking-tighter',
    metric: '€310k',
    metricLabel: 'saved a year',
    period: 'Across three data centers',
    quote:
      'We found the idle machines in the first week. Finance asked what else we had been paying for without knowing.',
    person: 'Grace Okafor',
    role: 'Platform Director, Basalt',
    href: '#',
  },
  {
    value: 'meridian',
    name: 'Meridian',
    wordmark: 'font-serif text-xl font-medium italic',
    metric: '18 min',
    metricLabel: 'median first reply',
    period: 'Was 4 hours in 2025',
    quote:
      'The queue finally shows who owns what. Nobody waits on a thread that three people assumed someone else had.',
    person: 'Leo Marchetti',
    role: 'Customer Care Manager, Meridian',
    href: '#',
  },
  {
    value: 'tessera',
    name: 'Tessera',
    wordmark: 'text-lg font-light tracking-wide',
    metric: '99.98%',
    metricLabel: 'checkout uptime',
    period: 'Through Black Friday week',
    quote: 'Our biggest week of the year was also our quietest on call. I slept through both nights of the sale.',
    person: 'Amira Haddad',
    role: 'Staff Engineer, Tessera',
    href: '#',
  },
  {
    value: 'corvus',
    name: 'Corvus',
    wordmark: 'text-base font-black uppercase tracking-tight',
    metric: '6 weeks',
    metricLabel: 'from kickoff to launch',
    period: 'Planned for five months',
    quote:
      'We shipped the new booking flow before the design review we had booked for it. That has never happened here.',
    person: 'Jonas Pereira',
    role: 'VP Product, Corvus',
    href: '#',
  },
];

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

const LogoCloud04 = () => {
  const [active, setActive] = React.useState(STORIES[0].value);
  const [picked, setPicked] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const paused = hovered || focused;
  const autoAdvance = !picked;

  const advance = (event: React.AnimationEvent<HTMLSpanElement>) => {
    if (event.target !== event.currentTarget || !autoAdvance) return;
    const current = STORIES.findIndex((story) => story.value === active);
    setActive(STORIES[(current + 1) % STORIES.length].value);
  };

  const pick = (value: string) => {
    if (!value) return;
    setActive(value);
    setPicked(true);
  };

  return (
    <section data-slot="logo-cloud" className="bg-background py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 md:px-10">
        <div data-slot="logo-cloud-header" className="flex max-w-xl flex-col gap-4">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Customer results</span>
          <h2
            style={stagger(1, 80)}
            className={cn(ENTER, 'text-balance text-3xl font-semibold tracking-tight sm:text-4xl')}
          >
            Six teams and the number they moved
          </h2>
          <p style={stagger(2, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
            Pick a company to see what changed, measured by them, in their words.
          </p>
        </div>

        <Tabs
          value={active}
          onValueChange={(value, details) => {
            if (details.reason === 'none') pick(String(value));
          }}
          data-slot="logo-cloud-stories"
          className="gap-0"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
          }}
        >
          <TabsList
            variant="line"
            activateOnFocus
            aria-label="Customers"
            style={stagger(3, 80)}
            className={cn(
              ENTER,
              'grid w-full grid-cols-2 gap-0 border-y border-border p-0 sm:grid-cols-3 lg:grid-cols-6',
              'group-data-[orientation=horizontal]/tabs:h-auto',
            )}
          >
            {STORIES.map((story) => {
              const isActive = story.value === active;
              return (
                <TabsTrigger
                  key={story.value}
                  value={story.value}
                  data-slot="logo-cloud-logo"
                  className="h-20 rounded-none border-0 px-4 after:hidden hover:bg-muted/30"
                >
                  <span className={cn('whitespace-nowrap transition-colors duration-150', story.wordmark)}>
                    {story.name}
                  </span>
                  <span aria-hidden className="absolute inset-x-4 bottom-0 h-0.5 overflow-hidden">
                    {isActive && (
                      <span
                        data-slot="logo-cloud-progress"
                        onAnimationEnd={advance}
                        style={
                          autoAdvance
                            ? {
                                animationDuration: `${AUTO_ADVANCE_MS}ms`,
                                animationPlayState: paused ? 'paused' : 'running',
                              }
                            : undefined
                        }
                        className={cn(
                          'block size-full bg-warm',
                          autoAdvance &&
                            'animate-in slide-in-from-start ease-linear fill-mode-both motion-reduce:animate-none',
                        )}
                      />
                    )}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {STORIES.map((story, index) => (
            <TabsContent
              key={story.value}
              value={story.value}
              data-slot="logo-cloud-proof"
              className="grid gap-10 pt-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:pt-14"
            >
              <div className="flex flex-col gap-3">
                <span dir="ltr" className={cn(SWAP, 'text-xs tabular-nums text-muted-foreground rtl:text-end')}>
                  {formatIndex(index)}
                  <span className="mx-1.5 text-border">|</span>
                  {String(STORIES.length).padStart(2, '0')}
                </span>
                <p style={stagger(1)} className={cn(SWAP, 'mt-3 flex flex-col gap-1')}>
                  <span
                    dir="ltr"
                    className="text-6xl font-semibold tracking-tight tabular-nums rtl:text-end sm:text-7xl"
                  >
                    {story.metric}
                  </span>
                  <span className="text-lg font-medium">{story.metricLabel}</span>
                </p>
                <span style={stagger(2)} className={cn(SWAP, 'text-sm text-muted-foreground')}>
                  {story.period}
                </span>
              </div>

              <figure className="flex flex-col gap-6 md:border-s md:border-border md:ps-16">
                <blockquote
                  style={stagger(2)}
                  className={cn(SWAP, 'text-xl leading-relaxed font-medium tracking-tight text-pretty sm:text-2xl')}
                >
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
                <figcaption
                  style={stagger(3)}
                  className={cn(SWAP, 'flex flex-wrap items-end justify-between gap-x-6 gap-y-4')}
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{story.person}</span>
                    <span className="text-sm text-muted-foreground">{story.role}</span>
                  </span>
                  <Button
                    variant="link"
                    className="group h-auto p-0"
                    render={<a href={story.href} />}
                    nativeButton={false}
                  >
                    Read the story
                    <span className="sr-only"> from {story.name}</span>
                    <ArrowRight
                      aria-hidden
                      className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    />
                  </Button>
                </figcaption>
              </figure>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default LogoCloud04;
