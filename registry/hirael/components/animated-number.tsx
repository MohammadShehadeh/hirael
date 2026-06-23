"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type AnimatedNumberProps = Omit<
  React.ComponentProps<"span">,
  "children"
> & {
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
  locale?: string;
  prefix?: string;
  suffix?: string;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function AnimatedNumber({
  value,
  startValue = 0,
  duration = 700,
  decimals = 0,
  format,
  locale,
  prefix,
  suffix,
  className,
  ...props
}: AnimatedNumberProps) {
  const [display, setDisplay] = React.useState(startValue);
  // Tracks the latest rendered value so an animation interrupted mid-flight
  // resumes from where it visually is, instead of snapping back.
  const displayRef = React.useRef(startValue);
  const frameRef = React.useRef<number | undefined>(undefined);

  const formatter = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        ...format,
      }),
    [locale, decimals, format],
  );

  React.useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || duration <= 0) {
      displayRef.current = value;
      setDisplay(value);
      return;
    }

    const from = displayRef.current;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const next = t < 1 ? from + (value - from) * easeOutCubic(t) : value;
      displayRef.current = next;
      setDisplay(next);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== undefined)
        cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  const formatted = formatter.format(display);

  return (
    <span
      data-slot="animated-number"
      className={cn("tabular-nums", className)}
      aria-label={`${prefix ?? ""}${formatter.format(value)}${suffix ?? ""}`}
      {...props}
    >
      {prefix}
      <span aria-hidden>{formatted}</span>
      {suffix}
    </span>
  );
}

export { AnimatedNumber };
