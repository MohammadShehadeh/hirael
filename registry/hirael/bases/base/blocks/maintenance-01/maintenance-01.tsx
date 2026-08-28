'use client';

import * as React from 'react';
import { ArrowUpRight, Bell } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

/* -------------------------------------------------------------------------- */
/*  Parts                                                                      */
/* -------------------------------------------------------------------------- */

const Maintenance = ({ className, ...props }: React.ComponentProps<'section'>) => {
  return (
    <section
      data-slot="maintenance"
      className={cn('flex min-h-svh items-center justify-center bg-background py-20', className)}
      {...props}
    />
  );
};

export interface MaintenanceStatusProps extends React.ComponentProps<'span'> {
  /** Tone of the pulsing dot. */
  tone?: 'warning' | 'success' | 'destructive';
}

const MaintenanceStatus = ({ tone = 'warning', className, children, ...props }: MaintenanceStatusProps) => {
  const dot = tone === 'success' ? 'bg-success' : tone === 'destructive' ? 'bg-destructive' : 'bg-warning';
  return (
    <span
      data-slot="maintenance-status"
      data-tone={tone}
      className={cn(
        'inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground',
        className,
      )}
      {...props}
    >
      <span aria-hidden className="relative flex size-2">
        <span className={cn('absolute inline-flex size-full rounded-full opacity-75 motion-safe:animate-ping', dot)} />
        <span className={cn('relative inline-flex size-2 rounded-full', dot)} />
      </span>
      {children}
    </span>
  );
};

const MaintenanceTitle = ({ className, ...props }: React.ComponentProps<'h1'>) => {
  return (
    <h1
      data-slot="maintenance-title"
      className={cn('font-serif text-5xl font-medium leading-none tracking-tight sm:text-6xl md:text-7xl', className)}
      {...props}
    />
  );
};

const MaintenanceDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
  return (
    <p
      data-slot="maintenance-description"
      className={cn('max-w-md text-base text-muted-foreground sm:text-lg', className)}
      {...props}
    />
  );
};

export interface MaintenanceWindowProps extends React.ComponentProps<'div'> {
  /** Elapsed share of the window, 0 to 100. Omit to hide the bar. */
  progress?: number;
  progressLabel?: React.ReactNode;
}

const MaintenanceWindow = ({ progress, progressLabel, className, children, ...props }: MaintenanceWindowProps) => {
  const pct = progress === undefined ? undefined : Math.max(0, Math.min(100, progress));
  return (
    <div
      data-slot="maintenance-window"
      className={cn('flex w-full flex-col gap-4 rounded-sm border border-border bg-card p-5', className)}
      {...props}
    >
      <dl className="flex flex-col divide-y divide-border">{children}</dl>
      {pct !== undefined ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>{progressLabel ?? 'Window elapsed'}</span>
            <span className="tabular-nums text-foreground">{Math.round(pct)}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Maintenance window elapsed"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export interface MaintenanceWindowRowProps extends React.ComponentProps<'div'> {
  label: React.ReactNode;
}

const MaintenanceWindowRow = ({ label, className, children, ...props }: MaintenanceWindowRowProps) => {
  return (
    <div
      data-slot="maintenance-window-row"
      className={cn('flex items-center justify-between gap-4 py-2.5 text-sm first:pt-0 last:pb-0', className)}
      {...props}
    >
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm tabular-nums text-foreground">{children}</dd>
    </div>
  );
};

const MaintenanceUpdates = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div data-slot="maintenance-updates" className={cn('w-full border-t border-border pt-6', className)} {...props}>
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Follow updates</span>
      <ol className="mt-3 flex flex-col">{children}</ol>
    </div>
  );
};

export interface MaintenanceUpdateProps extends React.ComponentProps<'li'> {
  time: React.ReactNode;
  /** Highlights the most recent update. */
  latest?: boolean;
}

const MaintenanceUpdate = ({ time, latest, className, children, ...props }: MaintenanceUpdateProps) => {
  return (
    <li
      data-slot="maintenance-update"
      data-latest={latest || undefined}
      className={cn('flex items-baseline gap-4 border-b border-border py-3 last:border-b-0', className)}
      {...props}
    >
      <span className="w-16 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{time}</span>
      <span className={cn('text-sm', latest ? 'text-foreground' : 'text-muted-foreground')}>{children}</span>
    </li>
  );
};

const MaintenanceActions = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div data-slot="maintenance-actions" className={cn('flex flex-wrap items-center gap-3', className)} {...props} />
  );
};

/* -------------------------------------------------------------------------- */
/*  Preview                                                                    */
/* -------------------------------------------------------------------------- */

interface Update {
  time: string;
  text: string;
  latest?: boolean;
}

const UPDATES: readonly Update[] = [
  {
    time: '03:14',
    text: 'Database migration finished. Rebuilding read replicas now.',
    latest: true,
  },
  {
    time: '02:31',
    text: 'API and dashboard are offline. Static sites keep serving.',
  },
  {
    time: '02:00',
    text: 'Maintenance window opened as scheduled.',
  },
];

const Maintenance01 = () => {
  return (
    <Maintenance data-slot="maintenance-01-block">
      <div className="mx-auto w-full max-w-2xl px-6 md:px-10">
        <div className="flex flex-col items-start gap-6">
          <MaintenanceStatus>Scheduled maintenance</MaintenanceStatus>
          <MaintenanceTitle>We&apos;ll be back shortly.</MaintenanceTitle>
          <MaintenanceDescription>
            We&apos;re moving the primary database to new hardware. Nothing you&apos;ve saved is affected, and sign-in
            resumes the moment we&apos;re done.
          </MaintenanceDescription>

          <MaintenanceWindow progress={62} progressLabel="1h 14m elapsed">
            <MaintenanceWindowRow label="Started">02:00 UTC</MaintenanceWindowRow>
            <MaintenanceWindowRow label="Expected back">04:00 UTC</MaintenanceWindowRow>
            <MaintenanceWindowRow label="Affected">API · Dashboard · Webhooks</MaintenanceWindowRow>
          </MaintenanceWindow>

          <MaintenanceActions>
            <Button type="button" size="lg" className="group">
              <Bell className="size-4" />
              Get notified
            </Button>
            <Button render={<a href="#" />} variant="outline" size="lg" className="group">
              Check status page
              <ArrowUpRight className="size-4 transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </Button>
          </MaintenanceActions>

          <MaintenanceUpdates>
            {UPDATES.map((u) => (
              <MaintenanceUpdate key={u.time} time={`${u.time} UTC`} latest={u.latest}>
                {u.text}
              </MaintenanceUpdate>
            ))}
          </MaintenanceUpdates>
        </div>
      </div>
    </Maintenance>
  );
};

export {
  Maintenance,
  MaintenanceStatus,
  MaintenanceTitle,
  MaintenanceDescription,
  MaintenanceWindow,
  MaintenanceWindowRow,
  MaintenanceUpdates,
  MaintenanceUpdate,
  MaintenanceActions,
};

export default Maintenance01;
