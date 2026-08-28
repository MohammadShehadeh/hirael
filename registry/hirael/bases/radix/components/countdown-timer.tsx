'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export type CountdownUnit = 'days' | 'hours' | 'minutes' | 'seconds';

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isComplete: boolean;
}

export interface UseCountdownOptions {
  onComplete?: () => void;
}

const toTimestamp = (target: Date | string | number) =>
  target instanceof Date ? target.getTime() : new Date(target).getTime();

const getCountdownState = (targetMs: number): CountdownState => {
  const totalMs = Math.max(targetMs - Date.now(), 0);
  if (!Number.isFinite(totalMs)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isComplete: true,
    };
  }
  const totalSeconds = Math.floor(totalMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMs,
    isComplete: totalMs <= 0,
  };
};

const useCountdown = (target: Date | string | number, options: UseCountdownOptions = {}): CountdownState => {
  const targetMs = toTimestamp(target);
  const [state, setState] = React.useState<CountdownState>(() => getCountdownState(targetMs));
  const onCompleteRef = React.useRef(options.onComplete);

  React.useEffect(() => {
    onCompleteRef.current = options.onComplete;
  });

  React.useEffect(() => {
    let fired = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      const next = getCountdownState(targetMs);
      setState(next);
      if (next.isComplete) {
        if (!fired) {
          fired = true;
          onCompleteRef.current?.();
        }
        return;
      }
      // Align the next tick to the upcoming second boundary.
      timeout = setTimeout(tick, 1000 - (Date.now() % 1000));
    };

    tick();
    return () => {
      if (timeout !== undefined) clearTimeout(timeout);
    };
  }, [targetMs]);

  return state;
};

const useMounted = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
};

const useReducedMotion = () => {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
};

const CountdownTimerValue = ({ value, className, ...props }: React.ComponentProps<'span'> & { value: string }) => {
  const reduceMotion = useReducedMotion();
  return (
    <span
      data-slot="countdown-timer-value"
      className={cn('inline-flex overflow-hidden font-mono tabular-nums', className)}
      {...props}
    >
      <span
        key={reduceMotion ? 'static' : value}
        className={cn(!reduceMotion && 'animate-in fade-in slide-in-from-top-2 duration-300')}
      >
        {value}
      </span>
    </span>
  );
};

export interface CountdownTimerUnitProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  value: number | null;
  label?: string;
}

const CountdownTimerUnit = ({ value, label, className, ...props }: CountdownTimerUnitProps) => {
  const display = value === null ? '--' : String(value).padStart(2, '0');
  return (
    <div data-slot="countdown-timer-unit" className={cn('flex flex-col items-center gap-0.5', className)} {...props}>
      <CountdownTimerValue value={display} />
      {label ? (
        <span
          data-slot="countdown-timer-label"
          className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground"
        >
          {label}
        </span>
      ) : null}
    </div>
  );
};

const defaultLabels: Record<CountdownUnit, string> = {
  days: 'Days',
  hours: 'Hours',
  minutes: 'Min',
  seconds: 'Sec',
};

const unitOrder: CountdownUnit[] = ['days', 'hours', 'minutes', 'seconds'];

export interface CountdownTimerProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  target: Date | string | number;
  variant?: 'boxed' | 'inline' | 'minimal';
  hideZeroDays?: boolean;
  labels?: Partial<Record<CountdownUnit, string>>;
  onComplete?: () => void;
  completeContent?: React.ReactNode;
  children?: (state: CountdownState) => React.ReactNode;
}

const CountdownTimer = ({
  target,
  variant = 'boxed',
  hideZeroDays = false,
  labels,
  onComplete,
  completeContent,
  children,
  className,
  ...props
}: CountdownTimerProps) => {
  const state = useCountdown(target, { onComplete });
  const mounted = useMounted();

  const resolvedLabels = { ...defaultLabels, ...labels };
  const units = hideZeroDays && state.days === 0 ? unitOrder.slice(1) : unitOrder;
  const valueOf = (unit: CountdownUnit) => (mounted ? state[unit] : null);

  let content: React.ReactNode;

  if (children) {
    content = children(state);
  } else if (mounted && state.isComplete && completeContent !== undefined) {
    content = completeContent;
  } else if (variant === 'boxed') {
    content = units.map((unit) => (
      <CountdownTimerUnit
        key={unit}
        value={valueOf(unit)}
        label={resolvedLabels[unit]}
        className="min-w-16 rounded-md border border-border bg-card p-3 text-2xl font-semibold tracking-tight"
      />
    ));
  } else if (variant === 'inline') {
    content = units.map((unit, index) => (
      <React.Fragment key={unit}>
        {index > 0 ? (
          <span
            data-slot="countdown-timer-separator"
            aria-hidden
            className="font-mono text-xl font-medium text-muted-foreground"
          >
            :
          </span>
        ) : null}
        <CountdownTimerUnit value={valueOf(unit)} label={resolvedLabels[unit]} className="text-xl font-semibold" />
      </React.Fragment>
    ));
  } else {
    content = (
      <span data-slot="countdown-timer-display" className="font-mono tabular-nums">
        {units.map((unit, index) => (
          <React.Fragment key={unit}>
            {index > 0 ? <span aria-hidden>:</span> : null}
            <CountdownTimerValue value={valueOf(unit) === null ? '--' : String(state[unit]).padStart(2, '0')} />
          </React.Fragment>
        ))}
      </span>
    );
  }

  return (
    <div
      data-slot="countdown-timer"
      role="timer"
      className={cn('flex items-start gap-2', variant === 'minimal' && 'inline-flex gap-0', className)}
      {...props}
    >
      {content}
    </div>
  );
};

export { CountdownTimer, CountdownTimerUnit, useCountdown };
