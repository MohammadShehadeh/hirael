'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export type MeterTone =
  | 'primary'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'info'
  | 'chart-1'
  | 'chart-2'
  | 'chart-3'
  | 'chart-4'
  | 'chart-5';

export type MeterSize = 'sm' | 'default' | 'lg';

export interface MeterThreshold {
  /** Value from which the fill takes this tone. */
  value: number;
  /** Colour of the fill once the value reaches this threshold. */
  tone: MeterTone;
  /** Name of the state, appended to the accessible value text (for example "Almost full"). */
  label?: string;
}

export interface MeterSegmentData {
  /** Legend text for this part of the total. */
  label: string;
  /** Amount this part adds to the total. */
  value: number;
  /** Fill colour. Defaults to `chart-1` to `chart-5` in order. */
  tone?: MeterTone;
}

interface ResolvedSegment extends MeterSegmentData {
  tone: MeterTone;
  /** Share of the scale where this segment ends, 0 to 100. */
  end: number;
}

interface MeterContextValue {
  value: number;
  min: number;
  max: number;
  percent: number;
  tone: MeterTone;
  /** Set when a threshold, not the base tone, decides the colour. */
  thresholdReached: boolean;
  segments: ResolvedSegment[];
  valueText: string;
  labelId: string | null;
  setLabelId: (id: string | null) => void;
}

const MeterContext = React.createContext<MeterContextValue | null>(null);

const useMeter = () => {
  const ctx = React.useContext(MeterContext);
  if (!ctx) {
    throw new Error('Meter compound parts must be used inside <Meter>');
  }

  return ctx;
};

const FILL_CLASS: Record<MeterTone, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
  info: 'bg-info',
  'chart-1': 'bg-chart-1',
  'chart-2': 'bg-chart-2',
  'chart-3': 'bg-chart-3',
  'chart-4': 'bg-chart-4',
  'chart-5': 'bg-chart-5',
};

const TEXT_CLASS: Record<MeterTone, string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
  info: 'text-info',
  'chart-1': 'text-chart-1',
  'chart-2': 'text-chart-2',
  'chart-3': 'text-chart-3',
  'chart-4': 'text-chart-4',
  'chart-5': 'text-chart-5',
};

const SEGMENT_TONES: MeterTone[] = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

export interface MeterProps extends React.ComponentProps<'div'> {
  /** Amount used. Defaults to the sum of `segments`. */
  value?: number;
  /** Lowest value on the scale. */
  min?: number;
  /** The limit. */
  max?: number;
  /** Parts of the total drawn as stacked fills, in order from the start of the track. */
  segments?: MeterSegmentData[];
  /** Fill colour below the first threshold, or always when there are none. */
  tone?: MeterTone;
  /** Values that recolour the fill once reached, in any order. Segments keep their own colours. */
  thresholds?: MeterThreshold[];
  /** Track height. */
  size?: MeterSize;
  /** Text read by screen readers instead of the bare numbers. */
  getValueText?: (value: number, max: number) => string;
}

const Meter = ({
  value: valueProp,
  min = 0,
  max = 100,
  segments: segmentsProp,
  tone = 'primary',
  thresholds,
  size = 'default',
  getValueText,
  className,
  children,
  ...props
}: MeterProps) => {
  const [labelId, setLabelId] = React.useState<string | null>(null);
  const span = max - min || 1;

  const segments = React.useMemo<ResolvedSegment[]>(() => {
    const list = segmentsProp ?? [];

    return list.map((segment, i) => {
      const total = list.slice(0, i + 1).reduce((sum, s) => sum + s.value, 0);

      return {
        ...segment,
        tone: segment.tone ?? SEGMENT_TONES[i % SEGMENT_TONES.length],
        end: clamp((total / span) * 100, 0, 100),
      };
    });
  }, [segmentsProp, span]);

  // Rounded so summed decimals report 32.7, not 32.699999999999996.
  const value = valueProp ?? Math.round((segmentsProp ?? []).reduce((sum, s) => sum + s.value, min) * 1e6) / 1e6;
  const percent = clamp(((value - min) / span) * 100, 0, 100);

  const reached = React.useMemo(() => {
    let match: MeterThreshold | undefined;
    for (const t of [...(thresholds ?? [])].sort((a, b) => a.value - b.value)) {
      if (value >= t.value) match = t;
    }

    return match;
  }, [thresholds, value]);

  const valueText =
    getValueText?.(value, max) ??
    [`${numberFormat.format(value)} of ${numberFormat.format(max)}`, reached?.label].filter(Boolean).join(', ');

  const ctx = React.useMemo<MeterContextValue>(
    () => ({
      value,
      min,
      max,
      percent,
      tone: reached?.tone ?? tone,
      thresholdReached: reached !== undefined,
      segments,
      valueText,
      labelId,
      setLabelId,
    }),
    [value, min, max, percent, reached, tone, segments, valueText, labelId],
  );

  return (
    <MeterContext.Provider value={ctx}>
      <div
        data-slot="meter"
        data-size={size}
        data-tone={ctx.tone}
        className={cn('group/meter flex w-full flex-col gap-2', className)}
        {...props}
      >
        {children ?? <MeterTrack />}
      </div>
    </MeterContext.Provider>
  );
};

const MeterHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="meter-header"
      className={cn('flex items-baseline justify-between gap-4 text-sm', className)}
      {...props}
    />
  );
};

const MeterLabel = ({ className, id: idProp, ...props }: React.ComponentProps<'span'>) => {
  const { setLabelId } = useMeter();
  const autoId = React.useId();
  const id = idProp ?? autoId;

  React.useLayoutEffect(() => {
    setLabelId(id);

    return () => setLabelId(null);
  }, [id, setLabelId]);

  return <span id={id} data-slot="meter-label" className={cn('font-medium', className)} {...props} />;
};

export interface MeterValueProps extends React.ComponentProps<'span'> {
  /** Unit shown after the limit, as in "38.2 of 100 GB". Ignored when children are passed. */
  unit?: string;
}

const MeterValue = ({ unit, className, children, ...props }: MeterValueProps) => {
  const { value, max, tone, thresholdReached } = useMeter();

  return (
    <span
      data-slot="meter-value"
      className={cn('text-muted-foreground tabular-nums', thresholdReached && TEXT_CLASS[tone], className)}
      {...props}
    >
      {children ?? [numberFormat.format(value), 'of', numberFormat.format(max), unit].filter(Boolean).join(' ')}
    </span>
  );
};

const MeterTrack = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const { value, min, max, valueText, labelId, segments } = useMeter();

  return (
    <div
      role="meter"
      aria-valuenow={clamp(value, min, max)}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={valueText}
      aria-labelledby={props['aria-label'] ? undefined : (labelId ?? undefined)}
      data-slot="meter-track"
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-muted',
        'h-2 group-data-[size=lg]/meter:h-3 group-data-[size=sm]/meter:h-1.5',
        className,
      )}
      {...props}
    >
      {children ??
        (segments.length > 0 ? (
          segments.map((segment, i) => <MeterSegment key={segment.label} index={i} />)
        ) : (
          <MeterIndicator />
        ))}
    </div>
  );
};

// Each fill spans the whole track and slides in from the start edge, so it animates on transform
// alone and flips with the writing direction.
const fillClass =
  'absolute inset-0 -translate-x-(--meter-offset) transition-[translate,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none rtl:translate-x-(--meter-offset)';

const MeterIndicator = ({ className, style, ...props }: React.ComponentProps<'div'>) => {
  const { percent, tone } = useMeter();

  return (
    <div
      data-slot="meter-indicator"
      data-tone={tone}
      className={cn(fillClass, FILL_CLASS[tone], className)}
      style={{ '--meter-offset': `${100 - percent}%`, ...style } as React.CSSProperties}
      {...props}
    />
  );
};

export interface MeterSegmentProps extends React.ComponentProps<'div'> {
  /** Position of the segment in the `segments` prop of `Meter`. */
  index: number;
}

const MeterSegment = ({ index, className, style, ...props }: MeterSegmentProps) => {
  const { segments } = useMeter();
  const segment = segments[index];
  if (!segment) return null;

  return (
    <div
      data-slot="meter-segment"
      data-tone={segment.tone}
      className={cn(fillClass, FILL_CLASS[segment.tone], className)}
      // Later segments reach further, so earlier ones stack on top to stay visible.
      style={
        {
          '--meter-offset': `${100 - segment.end}%`,
          zIndex: segments.length - index,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export interface MeterLegendProps extends Omit<React.ComponentProps<'ul'>, 'children'> {
  /** Format each segment's amount. Defaults to an `en-US` number with one decimal. */
  format?: (value: number) => React.ReactNode;
}

const MeterLegend = ({ format, className, ...props }: MeterLegendProps) => {
  const { segments } = useMeter();
  if (segments.length === 0) return null;

  return (
    <ul
      data-slot="meter-legend"
      className={cn('flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground', className)}
      {...props}
    >
      {segments.map((segment) => (
        <li key={segment.label} data-slot="meter-legend-item" className="flex items-center gap-1.5">
          <span
            aria-hidden
            data-slot="meter-legend-swatch"
            className={cn('size-2 shrink-0 rounded-full', FILL_CLASS[segment.tone])}
          />
          <span>{segment.label}</span>
          <span className="text-foreground tabular-nums">
            {format ? format(segment.value) : numberFormat.format(segment.value)}
          </span>
        </li>
      ))}
    </ul>
  );
};

export { Meter, MeterHeader, MeterLabel, MeterValue, MeterTrack, MeterIndicator, MeterSegment, MeterLegend, useMeter };
