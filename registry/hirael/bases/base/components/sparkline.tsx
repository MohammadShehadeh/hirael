'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

export type SparklineVariant = 'line' | 'area' | 'bar';
export type SparklineTone = 'default' | 'success' | 'warning' | 'destructive' | 'muted';

interface Size {
  width: number;
  height: number;
}

interface SparklineCtx {
  data: number[];
  variant: SparklineVariant;
  curve: boolean;
  min: number;
  max: number;
  width: number;
  height: number;
  inset: number;
  x: (index: number) => number;
  y: (value: number) => number;
  activeIndex: number | null;
  overlay: HTMLElement | null;
  setInteractive: (on: boolean) => void;
}

const SparklineContext = React.createContext<SparklineCtx | null>(null);

const useSparkline = () => {
  const ctx = React.useContext(SparklineContext);
  if (!ctx) {
    throw new Error('Sparkline compound parts must be used inside <Sparkline>');
  }
  return ctx;
};

const TONE_CLASS: Record<SparklineTone, string> = {
  default: 'text-foreground',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
  muted: 'text-muted-foreground',
};

const linePath = (points: [number, number][], curve: boolean) => {
  if (points.length === 0) return '';
  if (points.length === 1 || !curve) {
    return points.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px} ${py}`).join(' ');
  }
  // Catmull-Rom converted to cubic beziers. Passes through every point.
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
};

const round = (n: number) => {
  return Math.round(n * 100) / 100;
};

export interface SparklineProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  data: number[];
  variant?: SparklineVariant;
  tone?: SparklineTone;
  /** Smooth the line through the points. */
  curve?: boolean;
  /** Override the value range. Defaults to the data extent. */
  min?: number;
  max?: number;
  /** Vertical padding in px so strokes and dots are not clipped. */
  inset?: number;
  /** Accessible description. Defaults to a short summary of the data. */
  label?: string;
  children?: React.ReactNode;
}

const Sparkline = ({
  data,
  variant = 'line',
  tone = 'default',
  curve = false,
  min: minProp,
  max: maxProp,
  inset = 3,
  label,
  className,
  children,
  ...props
}: SparklineProps) => {
  const [size, setSize] = React.useState<Size | null>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [interactive, setInteractive] = React.useState(false);
  const [overlay, setOverlay] = React.useState<HTMLElement | null>(null);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      const r = node.getBoundingClientRect();
      setSize((prev) =>
        prev && prev.width === r.width && prev.height === r.height ? prev : { width: r.width, height: r.height },
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const width = size?.width ?? 0;
  const height = size?.height ?? 0;

  const { min, max } = React.useMemo(() => {
    let lo = Infinity;
    let hi = -Infinity;
    for (const v of data) {
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    if (!Number.isFinite(lo)) {
      lo = 0;
      hi = 1;
    }
    if (variant === 'bar') lo = Math.min(lo, 0);
    let rMin = minProp ?? lo;
    let rMax = maxProp ?? hi;
    if (rMin === rMax) {
      rMin -= 1;
      rMax += 1;
    }
    return { min: rMin, max: rMax };
  }, [data, minProp, maxProp, variant]);

  const x = React.useCallback(
    (index: number) => {
      const n = data.length;
      if (variant === 'bar') {
        const band = width / Math.max(n, 1);
        return round(band * index + band / 2);
      }
      if (n <= 1) return round(width / 2);
      return round((index / (n - 1)) * width);
    },
    [data.length, variant, width],
  );

  const y = React.useCallback(
    (value: number) => {
      const usable = Math.max(height - inset * 2, 0);
      const ratio = (value - min) / (max - min);
      return round(height - inset - ratio * usable);
    },
    [height, inset, min, max],
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || data.length === 0 || width === 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = Math.max(0, Math.min(e.clientX - r.left, width));
    const n = data.length;
    const index =
      variant === 'bar' ? Math.min(n - 1, Math.floor((px / width) * n)) : Math.round((px / width) * (n - 1));
    setActiveIndex(index);
  };

  const ctx = React.useMemo<SparklineCtx>(
    () => ({
      data,
      variant,
      curve,
      min,
      max,
      width,
      height,
      inset,
      x,
      y,
      activeIndex,
      overlay,
      setInteractive,
    }),
    [data, variant, curve, min, max, width, height, inset, x, y, activeIndex, overlay],
  );

  const last = data[data.length - 1];
  const summary =
    label ?? (data.length ? `Sparkline, ${data.length} points, latest ${last.toLocaleString()}` : 'Sparkline, no data');

  const content =
    children ??
    (variant === 'bar' ? (
      <SparklineBars />
    ) : variant === 'area' ? (
      <>
        <SparklineArea />
        <SparklineLine />
      </>
    ) : (
      <SparklineLine />
    ));

  return (
    <SparklineContext.Provider value={ctx}>
      <div
        ref={ref}
        data-slot="sparkline"
        data-variant={variant}
        data-tone={tone}
        className={cn('relative inline-block h-8 w-24 align-middle', TONE_CLASS[tone], className)}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setActiveIndex(null)}
        {...props}
      >
        <svg
          role="img"
          aria-label={summary}
          width="100%"
          height="100%"
          viewBox={`0 0 ${width || 1} ${height || 1}`}
          preserveAspectRatio="none"
          className="block size-full overflow-visible"
        >
          {width > 0 && height > 0 ? content : null}
        </svg>
        <div ref={setOverlay} data-slot="sparkline-overlay" className="pointer-events-none absolute inset-0" />
      </div>
    </SparklineContext.Provider>
  );
};

const SparklineLine = ({ className, strokeWidth = 1.5, ...props }: React.ComponentProps<'path'>) => {
  const { data, x, y, curve } = useSparkline();
  const points = data.map((v, i) => [x(i), y(v)] as [number, number]);
  return (
    <path
      data-slot="sparkline-line"
      d={linePath(points, curve)}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      className={cn(className)}
      {...props}
    />
  );
};

const SparklineArea = ({ className, fillOpacity = 0.15, ...props }: React.ComponentProps<'path'>) => {
  const { data, x, y, curve, min, max } = useSparkline();
  if (data.length === 0) return null;
  const points = data.map((v, i) => [x(i), y(v)] as [number, number]);
  const baseline = y(Math.max(min, Math.min(0, max)));
  const d = `${linePath(points, curve)} L${points[points.length - 1][0]} ${baseline} L${points[0][0]} ${baseline} Z`;
  return (
    <path
      data-slot="sparkline-area"
      d={d}
      fill="currentColor"
      fillOpacity={fillOpacity}
      stroke="none"
      className={cn(className)}
      {...props}
    />
  );
};

export interface SparklineBarsProps extends React.ComponentProps<'g'> {
  /** Gap between bars in px. */
  gap?: number;
  radius?: number;
}

const SparklineBars = ({ className, gap = 1, radius = 1, ...props }: SparklineBarsProps) => {
  const { data, width, y, min, max, activeIndex } = useSparkline();
  const n = data.length;
  if (n === 0) return null;
  const band = width / n;
  const barWidth = Math.max(band - gap, 1);
  const baseline = y(Math.max(min, Math.min(0, max)));
  return (
    <g data-slot="sparkline-bars" className={cn(className)} {...props}>
      {data.map((v, i) => {
        const top = y(v);
        const barY = Math.min(top, baseline);
        const barHeight = Math.max(Math.abs(baseline - top), 1);
        return (
          <rect
            key={i}
            data-slot="sparkline-bar"
            data-active={activeIndex === i || undefined}
            x={round(i * band + gap / 2)}
            y={round(barY)}
            width={round(barWidth)}
            height={round(barHeight)}
            rx={radius}
            fill="currentColor"
            fillOpacity={activeIndex === null ? 0.85 : activeIndex === i ? 1 : 0.4}
            className="transition-[fill-opacity] motion-reduce:transition-none"
          />
        );
      })}
    </g>
  );
};

export interface SparklineDotProps extends React.ComponentProps<'circle'> {
  /** Point to mark. Defaults to the last one, or the hovered one while a tooltip is active. */
  index?: number;
}

const SparklineDot = ({ index, className, r = 2.5, ...props }: SparklineDotProps) => {
  const { data, x, y, activeIndex } = useSparkline();
  if (data.length === 0) return null;
  const i = index ?? activeIndex ?? data.length - 1;
  if (i < 0 || i >= data.length) return null;
  return (
    <circle
      data-slot="sparkline-dot"
      cx={x(i)}
      cy={y(data[i])}
      r={r}
      fill="currentColor"
      strokeWidth={1.5}
      className={cn('stroke-background', className)}
      {...props}
    />
  );
};

export interface SparklineReferenceProps extends React.ComponentProps<'line'> {
  /** Value on the y axis to draw the line at. */
  value: number;
}

const SparklineReference = ({ value, className, ...props }: SparklineReferenceProps) => {
  const { width, y } = useSparkline();
  const py = y(value);
  return (
    <line
      data-slot="sparkline-reference"
      x1={0}
      x2={width}
      y1={py}
      y2={py}
      stroke="currentColor"
      strokeWidth={1}
      strokeDasharray="3 3"
      vectorEffect="non-scaling-stroke"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  );
};

export interface SparklineTooltipProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Format the hovered value. Defaults to `toLocaleString()`. */
  format?: (value: number, index: number) => React.ReactNode;
  children?: (value: number, index: number) => React.ReactNode;
}

const SparklineTooltip = ({ format, className, children, ...props }: SparklineTooltipProps) => {
  const { data, x, width, height, activeIndex, overlay, setInteractive } = useSparkline();

  React.useEffect(() => {
    setInteractive(true);
    return () => setInteractive(false);
  }, [setInteractive]);

  if (activeIndex === null || !overlay || width === 0) return null;
  const value = data[activeIndex];
  const px = x(activeIndex);
  const align = px < width / 3 ? 'start' : px > (width * 2) / 3 ? 'end' : 'mid';
  const render = children ?? format ?? ((v: number) => v.toLocaleString());

  return (
    <>
      <line
        data-slot="sparkline-crosshair"
        x1={px}
        x2={px}
        y1={0}
        y2={height}
        stroke="currentColor"
        strokeWidth={1}
        strokeOpacity={0.4}
        vectorEffect="non-scaling-stroke"
      />
      {createPortal(
        <div
          data-slot="sparkline-tooltip"
          className={cn(
            'absolute top-0 z-10 w-max -translate-y-full rounded-sm border border-border bg-card px-1.5 py-0.5 font-mono text-[11px] leading-tight text-card-foreground shadow-sm',
            align === 'start' ? 'translate-x-0' : align === 'end' ? '-translate-x-full' : '-translate-x-1/2',
            className,
          )}
          style={{ left: px, marginTop: -4 }}
          {...props}
        >
          {render(value, activeIndex)}
        </div>,
        overlay,
      )}
    </>
  );
};

export {
  Sparkline,
  SparklineLine,
  SparklineArea,
  SparklineBars,
  SparklineDot,
  SparklineReference,
  SparklineTooltip,
  useSparkline,
};
