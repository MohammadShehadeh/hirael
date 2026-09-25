'use client';

import * as React from 'react';
import { Area, Bar, ComposedChart, Line, ReferenceDot, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';

import { cn } from '@/lib/utils';

export type SparklineVariant = 'line' | 'area' | 'bar';
export type SparklineTone =
  | 'neutral'
  | 'muted'
  | 'info'
  | 'success'
  | 'warning'
  | 'destructive'
  /** @deprecated Use `neutral`. */
  | 'default';

type ResolvedSparklineTone = Exclude<SparklineTone, 'default'>;

interface SparklineCtx {
  data: number[];
  curve: boolean;
}

const SparklineContext = React.createContext<SparklineCtx | null>(null);

const useSparkline = () => {
  const ctx = React.useContext(SparklineContext);
  if (!ctx) {
    throw new Error('Sparkline compound parts must be used inside <Sparkline>');
  }

  return ctx;
};

const TONE_CLASS: Record<ResolvedSparklineTone, string> = {
  neutral: 'text-foreground',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
  muted: 'text-muted-foreground',
};

const numberFormat = new Intl.NumberFormat('en-US');

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
  tone = 'neutral',
  curve = false,
  min,
  max,
  inset = 3,
  label,
  className,
  children,
  ...props
}: SparklineProps) => {
  const resolvedTone: ResolvedSparklineTone = tone === 'default' ? 'neutral' : tone;
  const points = React.useMemo(() => data.map((value, index) => ({ index, value })), [data]);
  const ctx = React.useMemo<SparklineCtx>(() => ({ data, curve }), [data, curve]);

  const summary =
    label ??
    (data.length
      ? `Sparkline, ${data.length} points, latest ${numberFormat.format(data[data.length - 1])}`
      : 'Sparkline, no data');

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
        role="img"
        aria-label={summary}
        data-slot="sparkline"
        data-variant={variant}
        data-tone={resolvedTone}
        className={cn(
          'relative inline-block h-8 w-24 align-middle [&_.recharts-surface]:overflow-visible',
          TONE_CLASS[resolvedTone],
          className,
        )}
        {...props}
      >
        <ComposedChart
          responsive
          data={points}
          margin={{ top: inset, right: 0, bottom: inset, left: 0 }}
          barCategoryGap={1}
          accessibilityLayer={false}
          style={{ width: '100%', height: '100%' }}
        >
          <XAxis
            dataKey="index"
            hide
            type={variant === 'bar' ? 'category' : 'number'}
            domain={['dataMin', 'dataMax']}
          />
          <YAxis
            hide
            domain={[min ?? (variant === 'bar' ? (lo: number) => Math.min(lo, 0) : 'dataMin'), max ?? 'dataMax']}
          />
          {content}
        </ComposedChart>
      </div>
    </SparklineContext.Provider>
  );
};

type SparklineLineProps = Omit<React.ComponentProps<typeof Line>, 'dataKey' | 'ref'>;

const SparklineLine = ({ strokeWidth = 1.5, ...props }: SparklineLineProps) => {
  const { curve } = useSparkline();

  return (
    <Line
      data-slot="sparkline-line"
      dataKey="value"
      type={curve ? 'monotone' : 'linear'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      dot={false}
      activeDot={{ r: 2.5, fill: 'currentColor', stroke: 'var(--background)', strokeWidth: 1.5 }}
      isAnimationActive={false}
      {...props}
    />
  );
};

type SparklineAreaProps = Omit<React.ComponentProps<typeof Area>, 'dataKey' | 'ref'>;

const SparklineArea = ({ fillOpacity = 0.15, ...props }: SparklineAreaProps) => {
  const { curve } = useSparkline();

  return (
    <Area
      data-slot="sparkline-area"
      dataKey="value"
      type={curve ? 'monotone' : 'linear'}
      fill="currentColor"
      fillOpacity={fillOpacity}
      stroke="none"
      activeDot={false}
      isAnimationActive={false}
      {...props}
    />
  );
};

type SparklineBarsProps = Omit<React.ComponentProps<typeof Bar>, 'dataKey' | 'ref'>;

const SparklineBars = ({ radius = 1, ...props }: SparklineBarsProps) => {
  return (
    <Bar
      data-slot="sparkline-bars"
      dataKey="value"
      fill="currentColor"
      fillOpacity={0.85}
      radius={radius}
      minPointSize={1}
      activeBar={{ fillOpacity: 1 }}
      isAnimationActive={false}
      {...props}
    />
  );
};

export interface SparklineDotProps extends Omit<React.ComponentProps<typeof ReferenceDot>, 'x' | 'y' | 'ref'> {
  /** Point to mark. Defaults to the last one. */
  index?: number;
}

const SparklineDot = ({ index, r = 2.5, ...props }: SparklineDotProps) => {
  const { data } = useSparkline();
  const i = index ?? data.length - 1;
  if (i < 0 || i >= data.length) return null;

  return (
    <ReferenceDot
      data-slot="sparkline-dot"
      x={i}
      y={data[i]}
      r={r}
      fill="currentColor"
      stroke="var(--background)"
      strokeWidth={1.5}
      {...props}
    />
  );
};

export interface SparklineReferenceProps extends Omit<React.ComponentProps<typeof ReferenceLine>, 'y' | 'ref'> {
  /** Value on the y axis to draw the line at. */
  value: number;
}

const SparklineReference = ({ value, className, ...props }: SparklineReferenceProps) => {
  return (
    <ReferenceLine
      data-slot="sparkline-reference"
      y={value}
      stroke="currentColor"
      strokeDasharray="3 3"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  );
};

export interface SparklineTooltipProps {
  /** Format the hovered value. Defaults to an `en-US` number format. */
  format?: (value: number, index: number) => React.ReactNode;
  children?: (value: number, index: number) => React.ReactNode;
  className?: string;
}

const SparklineTooltip = ({ format, children, className }: SparklineTooltipProps) => {
  const render = children ?? format ?? ((v: number) => numberFormat.format(v));

  return (
    <Tooltip
      cursor={{ stroke: 'currentColor', strokeOpacity: 0.4 }}
      isAnimationActive={false}
      allowEscapeViewBox={{ y: true }}
      position={{ y: 0 }}
      content={({ active, payload }) => {
        const point = payload?.[0]?.payload as { index: number; value: number } | undefined;
        if (!active || !point) return null;

        return (
          <div
            data-slot="sparkline-tooltip"
            className={cn(
              '-mt-1 w-max -translate-y-full rounded-sm border border-border bg-card px-1.5 py-0.5 text-[11px] leading-tight text-card-foreground tabular-nums shadow-sm',
              className,
            )}
          >
            {render(point.value, point.index)}
          </div>
        );
      }}
    />
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
