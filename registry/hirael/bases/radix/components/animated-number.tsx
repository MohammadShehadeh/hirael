'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface AnimatedNumberProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  /** Target value to animate toward. */
  value: number;
  /** Value the first animation starts from. Defaults to 0. */
  startValue?: number;
  /** Tween length in milliseconds. */
  duration?: number;
  /** Fixed number of decimal places. */
  decimals?: number;
  /** Extra `Intl.NumberFormat` options (currency, notation, …). */
  format?: Intl.NumberFormatOptions;
  /** Defaults to `en-US` so server and client render the same digits. */
  locale?: string;
  prefix?: string;
  suffix?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const useReducedMotion = () =>
  React.useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener('change', onStoreChange);

      return () => query.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

const AnimatedNumber = ({
  value,
  startValue = 0,
  duration = 700,
  decimals = 0,
  format,
  locale = 'en-US',
  prefix,
  suffix,
  className,
  ...props
}: AnimatedNumberProps) => {
  const [display, setDisplay] = React.useState(startValue);
  const displayRef = React.useRef(startValue);

  const formatter = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        ...format,
      }),
    [locale, decimals, format],
  );

  const animated = !useReducedMotion() && duration > 0;

  React.useLayoutEffect(() => {
    if (!animated) displayRef.current = value;
  });

  React.useEffect(() => {
    if (!animated) return;

    const from = displayRef.current;
    const start = performance.now();

    let frame: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const next = t < 1 ? from + (value - from) * easeOutCubic(t) : value;
      displayRef.current = next;
      setDisplay(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [value, duration, animated]);

  const formatted = formatter.format(animated ? display : value);

  return (
    <span data-slot="animated-number" className={cn('tabular-nums', className)} {...props}>
      <span className="sr-only">{`${prefix ?? ''}${formatter.format(value)}${suffix ?? ''}`}</span>
      <span aria-hidden>
        {prefix}
        {formatted}
        {suffix}
      </span>
    </span>
  );
};

export { AnimatedNumber };
