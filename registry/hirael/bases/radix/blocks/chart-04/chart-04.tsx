'use client';

import * as React from 'react';
import { ArrowDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/hirael/bases/radix/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/radix/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/hirael/bases/radix/ui/tooltip';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-1 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 80): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

type Segment = 'all' | 'organic' | 'paid';

const STEPS = ['Visited', 'Signed up', 'Activated', 'Subscribed'] as const;

const SEGMENTS: Record<Exclude<Segment, 'all'>, { label: string; counts: number[] }> = {
  organic: { label: 'Organic', counts: [7200, 2380, 1390, 560] },
  paid: { label: 'Paid', counts: [5200, 1340, 660, 220] },
};

const SEGMENT_OPTIONS: readonly { value: Segment; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'organic', label: 'Organic' },
  { value: 'paid', label: 'Paid' },
];

interface FunnelStep {
  label: string;
  count: number;
  /** Share of the first step, 0 to 100. */
  ofTop: number;
  /** Share of the step before, 0 to 100. The first step is 100. */
  ofPrevious: number;
  /** People lost since the step before. */
  dropped: number;
  previousOfTop: number;
}

const countsFor = (segment: Segment) =>
  segment === 'all'
    ? STEPS.map((_, i) => SEGMENTS.organic.counts[i] + SEGMENTS.paid.counts[i])
    : SEGMENTS[segment].counts;

const toSteps = (segment: Segment): FunnelStep[] => {
  const counts = countsFor(segment);
  const top = counts[0];

  return counts.map((count, i) => {
    const previous = i === 0 ? count : counts[i - 1];

    return {
      label: STEPS[i],
      count,
      ofTop: (count / top) * 100,
      ofPrevious: (count / previous) * 100,
      dropped: previous - count,
      previousOfTop: (previous / top) * 100,
    };
  });
};

const number = new Intl.NumberFormat('en-US');

// Whole percents from 10 up, one decimal below, so small steps keep their precision.
const roundPercent = (value: number) => (value >= 10 ? Math.round(value) : Math.round(value * 10) / 10);

const percent = (value: number) => `${roundPercent(value)}%`;

const summarize = (segment: Segment, steps: FunnelStep[]) => {
  const last = steps[steps.length - 1];
  const who = segment === 'all' ? 'all visitors' : `${segment} visitors`;
  const worst = steps.slice(1).reduce((low, step) => (step.ofPrevious < low.ofPrevious ? step : low));
  const from = steps[steps.indexOf(worst) - 1];
  const leave = 100 - roundPercent(worst.ofPrevious);

  return `Of ${who}, ${percent(last.ofTop)} went on to subscribe. The biggest drop is from ${from.label.toLowerCase()} to ${worst.label.toLowerCase()}, where ${leave}% of people leave.`;
};

interface FunnelBarProps {
  step: FunnelStep;
  index: number;
}

// Bars slide with a transform inside a clipped track, so the rounded data end stays crisp while it animates.
const FunnelBar = ({ step, index }: FunnelBarProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          data-slot="funnel-chart-bar"
          tabIndex={0}
          aria-label={`${step.label}: ${number.format(step.count)}, ${percent(step.ofTop)} of visitors`}
          className="relative h-7 w-full overflow-hidden rounded-[4px] bg-muted outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {index > 0 ? (
            <span
              aria-hidden
              style={{ '--fill': `${step.previousOfTop}%` } as React.CSSProperties}
              className="absolute inset-0 -translate-x-[calc(100%-var(--fill))] rounded-e-[4px] bg-chart-1 opacity-25 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none rtl:translate-x-[calc(100%-var(--fill))]"
            />
          ) : null}
          <span
            aria-hidden
            style={{ '--fill': `max(${step.ofTop}%, 4px)` } as React.CSSProperties}
            className="absolute inset-0 -translate-x-[calc(100%-var(--fill))] rounded-e-[4px] bg-chart-1 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none rtl:translate-x-[calc(100%-var(--fill))]"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="grid gap-0.5 tabular-nums">
          <span className="font-medium">
            {step.label}: {number.format(step.count)}
          </span>
          {index > 0 ? <span>{percent(step.ofPrevious)} of the step before</span> : null}
          <span>{percent(step.ofTop)} of visitors</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

interface FunnelDropProps {
  step: FunnelStep;
}

// Each phrase sets its own direction, so English copy stays in order inside an RTL layout.
const FunnelDrop = ({ step }: FunnelDropProps) => {
  return (
    <p
      data-slot="funnel-chart-drop"
      className="flex flex-wrap items-center gap-x-1.5 py-3 ps-1 text-xs text-muted-foreground tabular-nums"
    >
      <ArrowDown aria-hidden className="size-3 shrink-0" />
      <span dir="auto" className="font-medium text-foreground">
        {percent(step.ofPrevious)}
      </span>
      <span dir="auto">continued</span>
      <span dir="auto" className="ms-1.5">
        {number.format(step.dropped)} dropped off
      </span>
    </p>
  );
};

const Chart04 = () => {
  const [segment, setSegment] = React.useState<Segment>('all');

  const steps = React.useMemo(() => toSteps(segment), [segment]);
  const summary = summarize(segment, steps);
  const last = steps[steps.length - 1];

  return (
    <section
      data-slot="funnel-chart"
      aria-labelledby="chart-04-heading"
      className="bg-background px-4 py-16 sm:px-6 sm:py-24"
    >
      <Card data-slot="funnel-chart-card" className={cn(ENTER, 'mx-auto w-full max-w-3xl')}>
        <CardHeader>
          <CardTitle>
            <h2 id="chart-04-heading" className="text-balance">
              Signup funnel
            </h2>
          </CardTitle>
          <CardDescription data-slot="funnel-chart-summary" aria-live="polite" className="max-w-xl">
            <span key={segment} className={cn(SWAP, 'block text-pretty')}>
              {summary}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent style={stagger(1)} className={ENTER}>
          <div className="flex flex-col gap-6">
            <ToggleGroup
              type="single"
              variant="outline"
              value={segment}
              onValueChange={(next) => {
                if (next) setSegment(next as Segment);
              }}
              aria-label="Segment"
              data-slot="funnel-chart-segment"
            >
              {SEGMENT_OPTIONS.map((option) => (
                <ToggleGroupItem key={option.value} value={option.value}>
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase">Visited to subscribed</span>
              <span key={segment} className={cn(SWAP, 'text-3xl font-semibold tracking-tight tabular-nums')}>
                {percent(last.ofTop)}
              </span>
            </div>

            <TooltipProvider>
              <ol data-slot="funnel-chart-steps" className="flex flex-col">
                {steps.map((step, i) => (
                  <li key={step.label} data-slot="funnel-chart-step" className="flex flex-col">
                    {i > 0 ? <FunnelDrop step={step} /> : null}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-baseline justify-between gap-4 text-sm">
                        <span className="min-w-0 truncate font-medium">{step.label}</span>
                        <span className="flex items-baseline gap-2 tabular-nums">
                          <span className="font-semibold">{number.format(step.count)}</span>
                          <span className="w-10 text-end text-xs text-muted-foreground">{percent(step.ofTop)}</span>
                        </span>
                      </div>
                      <FunnelBar step={step} index={i} />
                    </div>
                  </li>
                ))}
              </ol>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Chart04;
