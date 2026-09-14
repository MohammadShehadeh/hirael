'use client';

import * as React from 'react';
import { ArrowUpRight, Bell, CheckCircle2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Field, FieldError, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE}`;
const SWAP = `animate-in fade-in slide-in-from-bottom-1 duration-250 ${EASE}`;

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

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
      className={cn('inline-flex items-center gap-2 text-xs uppercase text-muted-foreground', className)}
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
          <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
            <span>{progressLabel ?? 'Window elapsed'}</span>
            <span className="tabular-nums text-foreground">{Math.round(pct)}%</span>
          </div>
          <div
            role="progressbar"
            aria-label={typeof progressLabel === 'string' ? progressLabel : 'Maintenance window elapsed'}
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
      <dd className="text-sm tabular-nums text-foreground">{children}</dd>
    </div>
  );
};

const MaintenanceUpdates = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div data-slot="maintenance-updates" className={cn('w-full border-t border-border pt-6', className)} {...props}>
      <span className="text-xs uppercase text-muted-foreground">Follow updates</span>
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
      <span className="w-16 shrink-0 text-xs tabular-nums text-muted-foreground">{time}</span>
      <span className={cn('text-sm', latest ? 'text-foreground' : 'text-muted-foreground')}>{children}</span>
    </li>
  );
};

const MaintenanceActions = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div data-slot="maintenance-actions" className={cn('flex flex-wrap items-center gap-3', className)} {...props} />
  );
};

const NotifyPopover = () => {
  const id = React.useId();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [subscribed, setSubscribed] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError(null);
    setSubscribed(true);
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button type="button" size="lg">
            <Bell aria-hidden className="size-4" />
            Get notified
          </Button>
        }
      />
      <PopoverContent align="start" className="w-80" data-slot="maintenance-notify">
        {subscribed ? (
          <div key="done" role="status" aria-live="polite" className={cn(SWAP, 'flex flex-col gap-1')}>
            <p className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 aria-hidden className="size-4 shrink-0 text-success" />
              We&apos;ll let you know
            </p>
            <p className="text-sm text-muted-foreground">
              One email to <span className="break-all text-foreground">{email.trim()}</span> when sign-in is back.
            </p>
          </div>
        ) : (
          <form key="form" noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Field className="gap-1.5" data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor={id}>Email me when we&apos;re back</FieldLabel>
              <Input
                id={id}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
              />
              <FieldError id={`${id}-error`} className="text-xs">
                {error}
              </FieldError>
            </Field>
            <Button type="submit">Notify me</Button>
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
};

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
          <MaintenanceStatus className={ENTER}>Scheduled maintenance</MaintenanceStatus>
          <MaintenanceTitle style={stagger(1)} className={ENTER}>
            We&apos;ll be back shortly.
          </MaintenanceTitle>
          <MaintenanceDescription style={stagger(2)} className={ENTER}>
            We&apos;re moving the primary database to new hardware. Nothing you&apos;ve saved is affected, and sign-in
            resumes the moment we&apos;re done.
          </MaintenanceDescription>

          <MaintenanceWindow
            style={stagger(3)}
            className={ENTER}
            progress={62}
            progressLabel="Migration progress, updated 03:14 UTC"
          >
            <MaintenanceWindowRow label="Started">02:00 UTC</MaintenanceWindowRow>
            <MaintenanceWindowRow label="Expected back">04:00 UTC</MaintenanceWindowRow>
            <MaintenanceWindowRow label="Affected">API, Dashboard, Webhooks</MaintenanceWindowRow>
          </MaintenanceWindow>

          <MaintenanceActions style={stagger(4)} className={ENTER}>
            <NotifyPopover />
            <Button render={<a href="#" />} nativeButton={false} variant="outline" size="lg" className="group">
              Check status page
              <ArrowUpRight className="size-4 transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </Button>
          </MaintenanceActions>

          <MaintenanceUpdates style={stagger(5)} className={ENTER}>
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
