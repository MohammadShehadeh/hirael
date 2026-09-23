'use client';

import * as React from 'react';

type RelativeNumeric = 'always' | 'auto';

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3_600_000],
  ['month', 30 * 24 * 3_600_000],
  ['week', 7 * 24 * 3_600_000],
  ['day', 24 * 3_600_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
  ['second', 1000],
];

/** How often a label this old can change: fresh times tick every second, old ones hourly. */
const refreshFor = (diff: number) => {
  const age = Math.abs(diff);
  if (age < 60_000) return 1000;
  if (age < 3_600_000) return 30_000;
  if (age < 24 * 3_600_000) return 300_000;
  return 3_600_000;
};

interface Clock {
  now: number;
  listeners: Set<() => void>;
  timer?: number;
}

// One timer per refresh rate, shared by every instance on the page, stopped when unused.
const clocks = new Map<number, Clock>();
type Subscribe = (onChange: () => void) => () => void;

const subscribers = new Map<number, Subscribe>();

const clockFor = (interval: number) => {
  let clock = clocks.get(interval);
  if (!clock) {
    clock = { now: Date.now(), listeners: new Set() };
    clocks.set(interval, clock);
  }
  return clock;
};

const subscribeTo = (interval: number) => {
  let subscribe = subscribers.get(interval);
  if (!subscribe) {
    subscribe = (onChange) => {
      const clock = clockFor(interval);
      clock.listeners.add(onChange);
      if (clock.timer === undefined) {
        clock.now = Date.now();
        clock.timer = window.setInterval(() => {
          clock.now = Date.now();
          clock.listeners.forEach((listener) => listener());
        }, interval);
      }
      return () => {
        clock.listeners.delete(onChange);
        if (clock.listeners.size === 0) {
          window.clearInterval(clock.timer);
          clocks.delete(interval);
        }
      };
    };
    subscribers.set(interval, subscribe);
  }
  return subscribe;
};

const formatters = new Map<string, Intl.RelativeTimeFormat | Intl.DateTimeFormat>();

const relativeFormat = (locale: string | undefined, numeric: RelativeNumeric, style: Intl.RelativeTimeFormatStyle) => {
  const key = `r|${locale}|${numeric}|${style}`;
  let format = formatters.get(key);
  if (!format) {
    format = new Intl.RelativeTimeFormat(locale, { numeric, style });
    formatters.set(key, format);
  }
  return format as Intl.RelativeTimeFormat;
};

const absoluteFormat = (locale: string | undefined) => {
  const key = `a|${locale}`;
  let format = formatters.get(key);
  if (!format) {
    format = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' });
    formatters.set(key, format);
  }
  return format as Intl.DateTimeFormat;
};

const formatRelative = (diff: number, format: Intl.RelativeTimeFormat) => {
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms || unit === 'second') return format.format(Math.round(diff / ms), unit);
  }
  return '';
};

export interface RelativeTimeProps extends Omit<React.ComponentProps<'time'>, 'dateTime' | 'children'> {
  /** The moment to describe, in the past or the future. */
  date: Date | string | number;
  /** BCP 47 locale. Defaults to the browser's. */
  locale?: string;
  /** `auto` says "yesterday" and "now"; `always` says "1 day ago" and "in 0 seconds". */
  numeric?: RelativeNumeric;
  /** Label length: "3 minutes ago", "3 min. ago" or "3m ago". */
  format?: Intl.RelativeTimeFormatStyle;
}

const serverSnapshot = () => null;

/**
 * Live "3 minutes ago" label. The server renders the ISO date, which is the same in every
 * time zone, so hydration never mismatches; the client swaps in the relative label.
 */
const RelativeTime = ({ date, locale, numeric = 'auto', format = 'long', title, ...props }: RelativeTimeProps) => {
  const time = new Date(date).getTime();
  const [refresh, setRefresh] = React.useState(1000);
  const now = React.useSyncExternalStore(subscribeTo(refresh), () => clockFor(refresh).now, serverSnapshot);

  const diff = now === null ? 0 : time - now;
  const nextRefresh = refreshFor(diff);
  // A slower clock can lag by up to its interval; switch only once it agrees, or the two ping-pong.
  if (now !== null && nextRefresh !== refresh && refreshFor(time - clockFor(nextRefresh).now) === nextRefresh) {
    setRefresh(nextRefresh);
  }

  const iso = Number.isNaN(time) ? undefined : new Date(time).toISOString();

  return (
    <time
      data-slot="relative-time"
      dateTime={iso}
      title={title ?? (now === null || !iso ? undefined : absoluteFormat(locale).format(time))}
      {...props}
    >
      {!iso ? '' : now === null ? iso.slice(0, 10) : formatRelative(diff, relativeFormat(locale, numeric, format))}
    </time>
  );
};

export { RelativeTime };
