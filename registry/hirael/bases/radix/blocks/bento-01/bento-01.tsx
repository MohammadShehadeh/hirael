'use client';

import * as React from 'react';
import { Check, GitCommitHorizontal, Loader2, Rocket } from 'lucide-react';

import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/registry/hirael/bases/radix/components/animated-number';
import { CopyButton } from '@/registry/hirael/bases/radix/components/copy-button';
import {
  Sparkline,
  SparklineArea,
  SparklineDot,
  SparklineLine,
} from '@/registry/hirael/bases/radix/components/sparkline';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/radix/ui/toggle-group';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-1 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

// Integer hash instead of Math.random so server and client render the same numbers.
const noise = (seed: number) => {
  let t = Math.imul(seed + 1, 2654435761) >>> 0;
  t ^= t >>> 15;
  t = Math.imul(t, 2246822519) >>> 0;
  t ^= t >>> 13;

  return (t >>> 0) / 4294967296;
};

interface BentoTileProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  title: React.ReactNode;
  description: React.ReactNode;
  /** Rendered at the end of the header row, e.g. a button or a toggle. */
  action?: React.ReactNode;
}

const BentoTile = ({ title, description, action, className, children, ...props }: BentoTileProps) => {
  return (
    <article
      data-slot="bento-tile"
      className={cn('flex min-w-0 flex-col gap-6 bg-background p-6', className)}
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

interface DeployLine {
  at: string;
  text: string;
  /** Milliseconds before this line appears. */
  delay: number;
}

const DEPLOY_LINES: readonly DeployLine[] = [
  { at: '00:00', text: 'Cloning hirael/storefront at 8f3c2a1', delay: 450 },
  { at: '00:01', text: 'Restored build cache from the last deploy', delay: 650 },
  { at: '00:04', text: 'Installed 412 packages in 2.9s', delay: 850 },
  { at: '00:05', text: 'Running next build', delay: 500 },
  { at: '00:19', text: 'Compiled 38 routes in 13.6s', delay: 1100 },
  { at: '00:21', text: 'Uploaded 18.4 MB to 6 regions', delay: 800 },
  { at: '00:23', text: 'Health check passed on /api/health', delay: 600 },
  { at: '00:24', text: 'Live at storefront.hirael.com', delay: 500 },
];

const PREVIOUS_LINES: readonly Omit<DeployLine, 'delay'>[] = [
  { at: '00:00', text: 'Cloning hirael/storefront at 3d91b07' },
  { at: '00:01', text: 'Restored build cache from the last deploy' },
  { at: '00:04', text: 'Installed 409 packages in 3.1s' },
  { at: '00:05', text: 'Running next build' },
  { at: '00:21', text: 'Compiled 38 routes in 15.2s' },
  { at: '00:23', text: 'Uploaded 18.1 MB to 6 regions' },
  { at: '00:25', text: 'Health check passed on /api/health' },
  { at: '00:26', text: 'Live at storefront.hirael.com' },
];

interface Release {
  commit: string;
  message: string;
  author: string;
  duration: string;
  when: string;
}

const CURRENT_RELEASE: Release = {
  commit: '8f3c2a1',
  message: 'Fix rounding in cart totals',
  author: 'You',
  duration: '24s',
  when: 'Just now',
};

const RECENT_RELEASES: readonly Release[] = [
  { commit: '3d91b07', message: 'Add Klarna to checkout', author: 'Lena Fischer', duration: '26s', when: '2h ago' },
  {
    commit: 'a47e5c2',
    message: 'Cache product images for a day',
    author: 'Omar Haddad',
    duration: '31s',
    when: 'Sep 23',
  },
  { commit: '9b20f11', message: 'Upgrade to Next.js 16.2', author: 'Lena Fischer', duration: '44s', when: 'Sep 22' },
];

type DeployLogProps = Omit<BentoTileProps, 'title' | 'description' | 'action' | 'children'>;

const DeployLog = (props: DeployLogProps) => {
  const [shown, setShown] = React.useState<number | null>(null);
  const running = shown !== null && shown < DEPLOY_LINES.length;
  const done = shown === DEPLOY_LINES.length;

  React.useEffect(() => {
    if (shown === null || shown >= DEPLOY_LINES.length) return;
    const id = window.setTimeout(() => setShown((count) => (count ?? 0) + 1), DEPLOY_LINES[shown].delay);

    return () => window.clearTimeout(id);
  }, [shown]);

  return (
    <BentoTile
      data-slot="deploy-log"
      title="Deploy from a commit"
      description="Every push to main builds, checks and goes live. Press Deploy to watch one."
      action={
        <Button size="sm" onClick={() => setShown(0)} disabled={running}>
          {running ? <Loader2 aria-hidden className="animate-spin" /> : <Rocket aria-hidden />}
          {running ? 'Deploying' : done ? 'Deploy again' : 'Deploy'}
        </Button>
      }
      {...props}
    >
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-muted/40">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border px-4 py-2.5 text-sm">
          <span className="flex min-w-0 items-center gap-2">
            <GitCommitHorizontal aria-hidden className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">Fix rounding in cart totals</span>
            <span className="shrink-0 text-muted-foreground">8f3c2a1</span>
          </span>
          <span
            data-slot="deploy-log-status"
            data-state={running ? 'running' : done ? 'done' : 'idle'}
            className={cn(
              'flex items-center gap-1.5 text-xs',
              done ? 'text-success' : running ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {done ? <Check aria-hidden className="size-3.5" /> : null}
            {running ? 'Building' : done ? 'Live in 24s' : 'Last deploy: 3d91b07'}
          </span>
        </div>
        <div aria-hidden className="h-px bg-border">
          <div
            className="h-px bg-primary transition-transform duration-300 ease-out ltr:origin-left rtl:origin-right"
            style={{ transform: `scaleX(${(shown ?? 0) / DEPLOY_LINES.length})` }}
          />
        </div>
        <ol
          role="log"
          aria-live="polite"
          aria-label="Deploy output"
          className="grid min-h-64 auto-rows-min grid-cols-[auto_1fr] content-start gap-x-4 gap-y-2 p-4 text-sm"
        >
          {shown === null
            ? PREVIOUS_LINES.map((line) => (
                <li key={line.at + line.text} className="col-span-2 grid grid-cols-subgrid text-muted-foreground">
                  <span className="tabular-nums">{line.at}</span>
                  <span className="min-w-0 break-words">{line.text}</span>
                </li>
              ))
            : DEPLOY_LINES.slice(0, shown).map((line, index) => {
                const last = index === DEPLOY_LINES.length - 1;

                return (
                  <li key={line.at + line.text} className={cn(SWAP, 'col-span-2 grid grid-cols-subgrid')}>
                    <span className="text-muted-foreground tabular-nums">{line.at}</span>
                    <span className={cn('min-w-0 break-words', last && 'font-medium text-success')}>{line.text}</span>
                  </li>
                );
              })}
        </ol>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <span className="text-xs text-muted-foreground uppercase">Recent deploys</span>
        <ul className="flex flex-col divide-y divide-border">
          {(done ? [CURRENT_RELEASE, ...RECENT_RELEASES.slice(0, 2)] : RECENT_RELEASES).map((release, index) => (
            <li
              key={release.commit}
              className={cn(
                release === CURRENT_RELEASE && SWAP,
                'flex items-center gap-3 py-2.5 text-sm first:pt-1 last:pb-0',
              )}
            >
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate">{release.message}</span>
                {index === 0 ? <Badge variant="secondary">Live</Badge> : null}
              </span>
              <span className="shrink-0 text-muted-foreground max-sm:hidden">{release.author}</span>
              <span className="w-10 shrink-0 text-end text-muted-foreground tabular-nums max-sm:hidden">
                {release.duration}
              </span>
              <span className="w-16 shrink-0 text-end text-muted-foreground tabular-nums">{release.when}</span>
            </li>
          ))}
        </ul>
      </div>
    </BentoTile>
  );
};

interface Region {
  id: string;
  city: string;
  /** Typical round trip in ms from the viewer. */
  base: number;
}

const REGIONS: readonly Region[] = [
  { id: 'fra1', city: 'Frankfurt', base: 18 },
  { id: 'lhr1', city: 'London', base: 27 },
  { id: 'iad1', city: 'Washington, D.C.', base: 94 },
  { id: 'sfo1', city: 'San Francisco', base: 151 },
  { id: 'sin1', city: 'Singapore', base: 172 },
  { id: 'gru1', city: 'Sao Paulo', base: 203 },
];

const LATENCY_CEILING = 260;

const latencyAt = (region: Region, index: number, tick: number) =>
  Math.round(region.base * (0.88 + 0.24 * noise(tick * 31 + index)));

type RegionPickerProps = Omit<BentoTileProps, 'title' | 'description' | 'action' | 'children'>;

const RegionPicker = (props: RegionPickerProps) => {
  const [selected, setSelected] = React.useState('fra1');
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 2000);

    return () => window.clearInterval(id);
  }, []);

  const latencies = REGIONS.map((region, index) => latencyAt(region, index, tick));
  const fastest = latencies.indexOf(Math.min(...latencies));
  const primary = REGIONS.find((region) => region.id === selected) ?? REGIONS[0];

  return (
    <BentoTile
      data-slot="region-picker"
      title="Pick a primary region"
      description="Functions run next to your database. Round trips from Berlin, measured every 2 seconds."
      {...props}
    >
      <ul className="@container -mx-2 flex flex-col">
        {REGIONS.map((region, index) => {
          const isSelected = region.id === selected;
          const latency = latencies[index];

          return (
            <li key={region.id}>
              <button
                type="button"
                data-slot="region-picker-option"
                aria-pressed={isSelected}
                onClick={() => setSelected(region.id)}
                className={cn(
                  'grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-md px-2 py-1.5 text-start text-sm transition-colors duration-150 outline-none hover:bg-muted/60 focus-visible:ring-[3px] focus-visible:ring-ring/50 @sm:grid-cols-[1fr_4.5rem_3.5rem] pointer-coarse:py-2.5',
                  isSelected && 'bg-muted',
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Check
                    aria-hidden
                    className={cn(
                      'size-3.5 shrink-0 text-primary transition-opacity duration-150',
                      isSelected ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="truncate">{region.city}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{region.id}</span>
                </span>
                <span aria-hidden className="hidden h-1 overflow-hidden rounded-full bg-border @sm:block">
                  <span
                    className={cn(
                      'block h-full rounded-full transition-transform duration-500 ease-out ltr:origin-left rtl:origin-right',
                      index === fastest ? 'bg-primary' : 'bg-muted-foreground/60',
                    )}
                    style={{ transform: `scaleX(${Math.min(latency / LATENCY_CEILING, 1)})` }}
                  />
                </span>
                <span className="text-end text-muted-foreground">
                  <AnimatedNumber value={latency} startValue={region.base} duration={400} suffix=" ms" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-auto border-t border-border pt-4 text-sm text-muted-foreground">
        Deploys land in <span className="text-foreground">{primary.city}</span> first. Fastest right now:{' '}
        <span className="text-foreground">{REGIONS[fastest].city}</span>.
      </p>
    </BentoTile>
  );
};

type UptimeStatus = 'up' | 'degraded' | 'down';

interface Incident {
  status: Exclude<UptimeStatus, 'up'>;
  minutes: number;
  note: string;
}

interface Service {
  id: string;
  label: string;
  /** Keyed by day index, 0 is the oldest of the 90 days. */
  incidents: Record<number, Incident>;
}

const SERVICES: readonly Service[] = [
  {
    id: 'api',
    label: 'API',
    incidents: {
      12: { status: 'degraded', minutes: 14, note: 'Elevated error rates on /v1/deploys' },
      47: { status: 'down', minutes: 22, note: 'Edge routing failure in iad1' },
      71: { status: 'degraded', minutes: 9, note: 'Slow responses from the logs endpoint' },
    },
  },
  {
    id: 'builds',
    label: 'Builds',
    incidents: {
      5: { status: 'degraded', minutes: 38, note: 'Build queue backed up during a runner upgrade' },
      33: { status: 'degraded', minutes: 17, note: 'Cache restores timing out' },
      64: { status: 'down', minutes: 41, note: 'Builds failed to start in fra1' },
      88: { status: 'degraded', minutes: 6, note: 'Slow dependency installs' },
    },
  },
  {
    id: 'edge',
    label: 'Edge network',
    incidents: {
      58: { status: 'degraded', minutes: 11, note: 'Higher latency in sin1' },
    },
  },
];

const DAYS = 90;
const DAY_MS = 86_400_000;
const LAST_DAY = Date.UTC(2026, 8, 23);
const dayFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const dayLabel = (index: number) => dayFormat.format(new Date(LAST_DAY - (DAYS - 1 - index) * DAY_MS));

const STATUS_CLASS: Record<UptimeStatus, string> = {
  up: 'bg-success',
  degraded: 'bg-warning',
  down: 'bg-destructive',
};

const STATUS_LABEL: Record<UptimeStatus, string> = {
  up: 'No incidents',
  degraded: 'Degraded',
  down: 'Outage',
};

type UptimeStripProps = Omit<BentoTileProps, 'title' | 'description' | 'action' | 'children'>;

const UptimeStrip = (props: UptimeStripProps) => {
  const [serviceId, setServiceId] = React.useState(SERVICES[0].id);
  const [active, setActive] = React.useState<number | null>(null);
  const service = SERVICES.find((s) => s.id === serviceId) ?? SERVICES[0];

  const downMinutes = Object.values(service.incidents).reduce((sum, incident) => sum + incident.minutes, 0);
  const uptime = (1 - downMinutes / (DAYS * 24 * 60)) * 100;
  const incidentCount = Object.keys(service.incidents).length;
  const activeIncident = active === null ? undefined : service.incidents[active];

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[event.key];
    const current = active ?? DAYS - 1;
    if (step !== undefined) {
      event.preventDefault();
      setActive(Math.min(DAYS - 1, Math.max(0, current + step)));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(DAYS - 1);
    }
  };

  return (
    <BentoTile
      data-slot="uptime-strip"
      title="Uptime you can check"
      description="The last 90 days for each service. Hover a day, or focus the strip and use the arrow keys."
      action={
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={serviceId}
          onValueChange={(next) => {
            if (!next) return;
            setServiceId(next);
            setActive(null);
          }}
          aria-label="Service"
        >
          {SERVICES.map((s) => (
            <ToggleGroupItem key={s.id} value={s.id}>
              {s.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
      {...props}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="flex items-baseline gap-2">
            <span className="text-2xl font-medium">
              <AnimatedNumber value={uptime} decimals={2} suffix="%" duration={500} />
            </span>
            <span className="text-sm text-muted-foreground">
              {incidentCount} {incidentCount === 1 ? 'incident' : 'incidents'}
            </span>
          </span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
              <span className="relative size-2 rounded-full bg-success" />
            </span>
            Operational now
          </span>
        </div>

        <div
          role="group"
          tabIndex={0}
          aria-label={`${service.label} uptime by day`}
          onKeyDown={onKeyDown}
          onFocus={() => setActive((current) => current ?? DAYS - 1)}
          onBlur={() => setActive(null)}
          onPointerLeave={() => setActive(null)}
          className="flex h-10 gap-px rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:gap-0.5"
        >
          {Array.from({ length: DAYS }, (_, index) => {
            const status: UptimeStatus = service.incidents[index]?.status ?? 'up';

            return (
              <span
                key={index}
                data-slot="uptime-strip-day"
                data-status={status}
                data-active={active === index || undefined}
                onPointerEnter={() => setActive(index)}
                className={cn(
                  'flex-1 rounded-[1px] transition-opacity duration-150',
                  STATUS_CLASS[status],
                  index < DAYS / 2 && 'max-sm:hidden',
                  active !== null && active !== index && 'opacity-40',
                )}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            <span className="sm:hidden">45 days ago</span>
            <span className="max-sm:hidden">90 days ago</span>
          </span>
          <span>Today</span>
        </div>

        <p aria-live="polite" className="min-h-10 border-t border-border pt-3 text-sm">
          {active === null ? (
            <span className="text-muted-foreground">
              {downMinutes} minutes of degraded service or downtime in 90 days.
            </span>
          ) : (
            <span key={`${service.id}-${active}`} className={cn(SWAP, 'flex flex-wrap gap-x-2')}>
              <span className="font-medium">{dayLabel(active)}</span>
              <span className="text-muted-foreground">
                {activeIncident
                  ? `${STATUS_LABEL[activeIncident.status]} for ${activeIncident.minutes} min. ${activeIncident.note}.`
                  : STATUS_LABEL.up}
              </span>
            </span>
          )}
        </p>
      </div>
    </BentoTile>
  );
};

const PACKAGE_MANAGERS = [
  { id: 'npm', command: 'npm install -g hirael' },
  { id: 'pnpm', command: 'pnpm add -g hirael' },
  { id: 'yarn', command: 'yarn global add hirael' },
  { id: 'bun', command: 'bun add -g hirael' },
] as const;

type PackageManager = (typeof PACKAGE_MANAGERS)[number]['id'];

const NEXT_STEPS = ['Install the CLI', 'Run hirael login', 'Run hirael deploy in your project'] as const;

type InstallCommandProps = Omit<BentoTileProps, 'title' | 'description' | 'action' | 'children'>;

const InstallCommand = (props: InstallCommandProps) => {
  const [manager, setManager] = React.useState<PackageManager>('npm');
  const [copied, setCopied] = React.useState(false);
  const command = PACKAGE_MANAGERS.find((pm) => pm.id === manager)?.command ?? PACKAGE_MANAGERS[0].command;

  return (
    <BentoTile
      data-slot="install-command"
      title="Start from your terminal"
      description="One global install, then deploy any folder with a package.json."
      {...props}
    >
      <div className="flex flex-col gap-4">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={manager}
          onValueChange={(next) => {
            if (next) setManager(next as PackageManager);
          }}
          aria-label="Package manager"
        >
          {PACKAGE_MANAGERS.map((pm) => (
            <ToggleGroupItem key={pm.id} value={pm.id}>
              {pm.id}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 py-1.5 ps-4 pe-1.5 text-sm">
          <span aria-hidden className="text-muted-foreground select-none">
            $
          </span>
          <span key={command} className={cn(SWAP, 'min-w-0 flex-1 truncate')}>
            {command}
          </span>
          <CopyButton value={command} label="Copy install command" onCopy={() => setCopied(true)} />
        </div>
        <ol className="flex flex-col gap-2 text-sm">
          {NEXT_STEPS.map((step, index) => {
            const complete = index === 0 && copied;

            return (
              <li key={step} className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums transition-colors duration-200',
                    complete
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground',
                  )}
                >
                  {complete ? <Check aria-hidden className="size-3" /> : index + 1}
                </span>
                <span className={cn(complete ? 'text-muted-foreground line-through' : 'text-foreground')}>{step}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </BentoTile>
  );
};

type UsageRange = '24h' | '7d' | '30d';

interface SeriesShape {
  base: number;
  /** Points per traffic cycle, e.g. 24 for hourly points over a day. */
  period: number;
  swing: number;
  /** Growth across the whole range, 0.1 is 10 percent. */
  growth: number;
  seed: number;
}

const buildSeries = (length: number, { base, period, swing, growth, seed }: SeriesShape) =>
  Array.from({ length }, (_, i) => {
    const cycle = Math.sin((i / period) * Math.PI * 2 - Math.PI / 2);
    const trend = 1 + (growth * i) / length;
    const jitter = 0.84 + 0.32 * noise(seed + i);

    return Math.round(base * trend * (1 + swing * cycle) * jitter);
  });

const USAGE: Record<UsageRange, { label: string; data: number[]; previous: number; start: string }> = {
  '24h': {
    label: 'Last 24 hours',
    data: buildSeries(24, { base: 51_000, period: 24, swing: 0.45, growth: 0, seed: 11 }),
    previous: 1_182_400,
    start: '24 hours ago',
  },
  '7d': {
    label: 'Last 7 days',
    data: buildSeries(28, { base: 318_000, period: 4, swing: 0.2, growth: 0.12, seed: 42 }),
    previous: 8_402_000,
    start: '7 days ago',
  },
  '30d': {
    label: 'Last 30 days',
    data: buildSeries(30, { base: 1_240_000, period: 7, swing: 0.12, growth: 0.18, seed: 97 }),
    previous: 34_910_000,
    start: '30 days ago',
  },
};

const COMPACT: Intl.NumberFormatOptions = { notation: 'compact', maximumFractionDigits: 1 };

type UsageChartProps = Omit<BentoTileProps, 'title' | 'description' | 'action' | 'children'>;

const UsageChart = (props: UsageChartProps) => {
  const [range, setRange] = React.useState<UsageRange>('7d');
  const usage = USAGE[range];
  const total = usage.data.reduce((sum, value) => sum + value, 0);
  const change = ((total - usage.previous) / usage.previous) * 100;

  return (
    <BentoTile
      data-slot="usage-chart"
      title="Usage without surprises"
      description="Requests across every project, billed per million."
      action={
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={range}
          onValueChange={(next) => {
            if (next) setRange(next as UsageRange);
          }}
          aria-label="Range"
        >
          <ToggleGroupItem value="24h">24h</ToggleGroupItem>
          <ToggleGroupItem value="7d">7d</ToggleGroupItem>
          <ToggleGroupItem value="30d">30d</ToggleGroupItem>
        </ToggleGroup>
      }
      {...props}
    >
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-3xl font-medium tracking-tight">
            <AnimatedNumber value={total} format={COMPACT} />
          </span>
          <span className="text-sm text-muted-foreground">requests</span>
          <span className={cn('text-sm tabular-nums', change >= 0 ? 'text-success' : 'text-destructive')}>
            {change >= 0 ? '+' : ''}
            {change.toFixed(1)}% vs previous
          </span>
        </div>
        <Sparkline
          data={usage.data}
          curve
          min={0}
          label={`${usage.label}: ${total.toLocaleString('en-US')} requests`}
          className="mt-auto h-28 w-full"
        >
          <SparklineArea fillOpacity={0.08} />
          <SparklineLine />
          <SparklineDot />
        </Sparkline>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{usage.start}</span>
          <span>Now</span>
        </div>
      </div>
    </BentoTile>
  );
};

const Bento01 = () => {
  return (
    <section data-slot="bento" className="bg-background px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header data-slot="bento-header" className="flex max-w-2xl flex-col gap-4">
          <h2
            className={cn(ENTER, 'font-serif text-3xl font-medium tracking-tight text-balance md:text-4xl lg:text-5xl')}
          >
            From commit to production in one command
          </h2>
          <p style={stagger(1)} className={cn(ENTER, 'text-base text-pretty text-muted-foreground md:text-lg')}>
            Deploy from your terminal, choose where your code runs, and see uptime and usage without opening a support
            ticket. Every panel below works, so try it.
          </p>
        </header>

        <div
          data-slot="bento-grid"
          className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-6 lg:grid-cols-12"
        >
          <DeployLog style={stagger(0, 70, 150)} className={cn(ENTER, 'md:col-span-6 lg:col-span-7 lg:row-span-2')} />
          <RegionPicker style={stagger(1, 70, 150)} className={cn(ENTER, 'md:col-span-3 lg:col-span-5')} />
          <InstallCommand style={stagger(2, 70, 150)} className={cn(ENTER, 'md:col-span-3 lg:col-span-5')} />
          <UptimeStrip style={stagger(3, 70, 150)} className={cn(ENTER, 'md:col-span-6 lg:col-span-7')} />
          <UsageChart style={stagger(4, 70, 150)} className={cn(ENTER, 'md:col-span-6 lg:col-span-5')} />
        </div>
      </div>
    </section>
  );
};

export { BentoTile, DeployLog, RegionPicker, UptimeStrip, InstallCommand, UsageChart };
export default Bento01;
