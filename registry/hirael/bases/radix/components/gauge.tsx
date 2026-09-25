'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export type GaugeTone =
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

export type GaugeSize = 'sm' | 'default' | 'lg';

export interface GaugeThreshold {
  /** Value where this band starts. It runs until the next threshold or `max`. */
  value: number;
  /** Colour of the band, and of the indicator while the value is inside it. */
  tone: GaugeTone;
  /** Name of the band, appended to the accessible value text (for example "High"). */
  label?: string;
}

interface GaugeBand {
  from: number;
  to: number;
  tone: GaugeTone;
  label?: string;
}

interface GaugeGeometry {
  viewBox: string;
  aspectRatio: number;
  radius: number;
  /** Space above and below the circle centre, used to centre the value on it. */
  above: number;
  below: number;
}

interface GaugeContextValue {
  value: number;
  min: number;
  max: number;
  ratio: number;
  startAngle: number;
  endAngle: number;
  thickness: number;
  tone: GaugeTone;
  bands: GaugeBand[];
  geometry: GaugeGeometry;
  setLabelId: (id: string | null) => void;
}

const GaugeContext = React.createContext<GaugeContextValue | null>(null);

const useGauge = () => {
  const ctx = React.useContext(GaugeContext);
  if (!ctx) {
    throw new Error('Gauge compound parts must be used inside <Gauge>');
  }

  return ctx;
};

const TONE_CLASS: Record<GaugeTone, string> = {
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

const SIZE_CLASS: Record<GaugeSize, string> = {
  sm: 'w-32',
  default: 'w-44',
  lg: 'w-60',
};

const CENTER = 50;
const BAND_WIDTH = 1.5;
const BAND_GAP = 2;

// Angles are degrees clockwise from 12 o'clock, like a clock face.
const polar = (angle: number, radius: number): [number, number] => {
  const rad = (angle * Math.PI) / 180;

  return [CENTER + radius * Math.sin(rad), CENTER - radius * Math.cos(rad)];
};

const round = (n: number) => Math.round(n * 1000) / 1000;

const arcPath = (from: number, to: number, radius: number) => {
  // A closed circle has identical endpoints, which SVG arcs cannot draw.
  const end = Math.min(to, from + 359.99);
  const [x0, y0] = polar(from, radius);
  const [x1, y1] = polar(end, radius);
  const large = end - from > 180 ? 1 : 0;

  return `M${round(x0)} ${round(y0)} A${radius} ${radius} 0 ${large} 1 ${round(x1)} ${round(y1)}`;
};

const measure = (startAngle: number, endAngle: number, thickness: number): GaugeGeometry => {
  const radius = CENTER - thickness / 2;
  const angles = [startAngle, endAngle];
  for (let a = Math.ceil(startAngle / 90) * 90; a <= endAngle; a += 90) angles.push(a);
  const points = angles.map((a) => polar(a, radius));
  const pad = thickness / 2;
  const x0 = Math.min(...points.map(([x]) => x)) - pad;
  const x1 = Math.max(...points.map(([x]) => x)) + pad;
  const y0 = Math.min(...points.map(([, y]) => y)) - pad;
  const y1 = Math.max(...points.map(([, y]) => y)) + pad;

  return {
    viewBox: `${round(x0)} ${round(y0)} ${round(x1 - x0)} ${round(y1 - y0)}`,
    aspectRatio: (x1 - x0) / (y1 - y0),
    radius,
    above: Math.max(CENTER - y0, 0.01),
    below: Math.max(y1 - CENTER, 0.01),
  };
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const GAUGE_KEYFRAMES = '@keyframes hirael-gauge-sweep { from { stroke-dashoffset: 100; } }';

const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

export interface GaugeProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Current reading. Clamped to `min`..`max` for drawing, reported as is. */
  value: number;
  /** Lowest value on the scale. */
  min?: number;
  /** Highest value on the scale. */
  max?: number;
  /** Where the arc starts, in degrees clockwise from 12 o'clock. */
  startAngle?: number;
  /** Where the arc ends, in degrees clockwise from 12 o'clock. Must be greater than `startAngle`. */
  endAngle?: number;
  /** Stroke width of the arc, as a share of the gauge width (0 to 100). */
  thickness?: number;
  /** Colour of the indicator below the first threshold, or always when there are none. */
  tone?: GaugeTone;
  /** Bands that recolour the indicator once the value reaches them, in any order. */
  thresholds?: GaugeThreshold[];
  /** Overall width, and the matching type scale for the value and label. */
  size?: GaugeSize;
  /** Text read by screen readers instead of the bare number. */
  getValueText?: (value: number, min: number, max: number) => string;
  children?: React.ReactNode;
}

const Gauge = ({
  value,
  min = 0,
  max = 100,
  startAngle = -120,
  endAngle = 120,
  thickness = 10,
  tone = 'primary',
  thresholds,
  size = 'default',
  getValueText,
  className,
  style,
  children,
  ...props
}: GaugeProps) => {
  const [labelId, setLabelId] = React.useState<string | null>(null);

  const span = max - min || 1;
  const ratio = clamp((value - min) / span, 0, 1);

  const bands = React.useMemo<GaugeBand[]>(() => {
    const sorted = (thresholds ?? []).filter((t) => t.value < max).sort((a, b) => a.value - b.value);
    const starts: GaugeThreshold[] = sorted[0]?.value <= min ? sorted : [{ value: min, tone }, ...sorted];

    return starts.map((s, i) => ({
      from: Math.max(s.value, min),
      to: starts[i + 1]?.value ?? max,
      tone: s.tone,
      label: s.label,
    }));
  }, [thresholds, min, max, tone]);

  const clamped = clamp(value, min, max);
  let active = bands[0];
  for (const band of bands) if (clamped >= band.from) active = band;

  const geometry = React.useMemo(() => measure(startAngle, endAngle, thickness), [startAngle, endAngle, thickness]);

  const ctx = React.useMemo<GaugeContextValue>(
    () => ({
      value,
      min,
      max,
      ratio,
      startAngle,
      endAngle,
      thickness,
      tone: active.tone,
      bands: thresholds?.length ? bands : [],
      geometry,
      setLabelId,
    }),
    [value, min, max, ratio, startAngle, endAngle, thickness, active.tone, thresholds, bands, geometry],
  );

  const valueText =
    getValueText?.(value, min, max) ?? [numberFormat.format(value), active.label].filter(Boolean).join(', ');

  return (
    <GaugeContext.Provider value={ctx}>
      <div
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={valueText}
        aria-labelledby={props['aria-label'] ? undefined : (labelId ?? undefined)}
        data-slot="gauge"
        data-size={size}
        data-tone={active.tone}
        className={cn(
          'group/gauge relative inline-grid shrink-0 justify-items-center text-center',
          SIZE_CLASS[size],
          className,
        )}
        style={{
          aspectRatio: geometry.aspectRatio,
          gridTemplateRows: `${geometry.above}fr auto auto ${geometry.below}fr`,
          ...style,
        }}
        {...props}
      >
        {/* href + precedence let React hoist one copy into <head>, however many gauges render. */}
        <style href="hirael-gauge" precedence="default">
          {GAUGE_KEYFRAMES}
        </style>
        {children ?? (
          <>
            <GaugeTrack />
            <GaugeBands />
            <GaugeIndicator />
            <GaugeValue />
          </>
        )}
      </div>
    </GaugeContext.Provider>
  );
};

const GaugeSvg = ({ className, children, ...props }: React.ComponentProps<'svg'>) => {
  const { geometry } = useGauge();

  // Arcs are physical geometry and fill clockwise in every writing direction, like a dial.
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={geometry.viewBox}
      className={cn('pointer-events-none absolute inset-0 size-full overflow-visible', className)}
      {...props}
    >
      {children}
    </svg>
  );
};

const GaugeTrack = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  const { startAngle, endAngle, thickness, geometry } = useGauge();

  return (
    <GaugeSvg data-slot="gauge-track" className={cn('text-muted', className)} {...props}>
      <path
        d={arcPath(startAngle, endAngle, geometry.radius)}
        fill="none"
        stroke="currentColor"
        strokeWidth={thickness}
        strokeLinecap="round"
      />
    </GaugeSvg>
  );
};

const GaugeBands = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  const { bands, min, max, startAngle, endAngle, thickness, geometry } = useGauge();
  if (bands.length === 0) return null;
  const sweep = endAngle - startAngle;
  const radius = geometry.radius - thickness / 2 - BAND_GAP - BAND_WIDTH / 2;
  const angle = (v: number) => startAngle + ((v - min) / (max - min || 1)) * sweep;

  return (
    <GaugeSvg data-slot="gauge-bands" className={className} {...props}>
      {bands.map((band) => (
        <path
          key={band.from}
          data-slot="gauge-band"
          data-tone={band.tone}
          d={arcPath(angle(band.from), angle(band.to), radius)}
          fill="none"
          stroke="currentColor"
          strokeWidth={BAND_WIDTH}
          className={TONE_CLASS[band.tone]}
        />
      ))}
    </GaugeSvg>
  );
};

const GaugeIndicator = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  const { ratio, tone, startAngle, endAngle, thickness, geometry } = useGauge();

  return (
    <GaugeSvg data-slot="gauge-indicator" className={cn(TONE_CLASS[tone], className)} {...props}>
      {/* pathLength 100 turns the dash offset into a percentage, whatever the arc length. */}
      <path
        d={arcPath(startAngle, endAngle, geometry.radius)}
        pathLength={100}
        fill="none"
        stroke="currentColor"
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray="100 100"
        // A zero-length dash still paints a round cap as a dot.
        strokeOpacity={ratio > 0 ? 1 : 0}
        style={{ strokeDashoffset: round(100 - ratio * 100) }}
        className="animate-[hirael-gauge-sweep_900ms_cubic-bezier(0.22,1,0.36,1)] transition-[stroke-dashoffset,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none motion-reduce:transition-none"
      />
    </GaugeSvg>
  );
};

export interface GaugeValueProps extends React.ComponentProps<'span'> {
  /** Format the reading. Ignored when children are passed. Defaults to an `en-US` number with one decimal. */
  format?: (value: number) => React.ReactNode;
}

const GaugeValue = ({ format, className, children, ...props }: GaugeValueProps) => {
  const { value } = useGauge();

  return (
    <span
      aria-hidden
      data-slot="gauge-value"
      className={cn(
        'row-start-2 text-4xl leading-none font-semibold tracking-tight tabular-nums group-data-[size=lg]/gauge:text-5xl group-data-[size=sm]/gauge:text-2xl',
        className,
      )}
      {...props}
    >
      {children ?? (format ? format(value) : numberFormat.format(value))}
    </span>
  );
};

const GaugeLabel = ({ className, id: idProp, ...props }: React.ComponentProps<'span'>) => {
  const { setLabelId } = useGauge();
  const autoId = React.useId();
  const id = idProp ?? autoId;

  React.useLayoutEffect(() => {
    setLabelId(id);

    return () => setLabelId(null);
  }, [id, setLabelId]);

  return (
    <span
      id={id}
      data-slot="gauge-label"
      className={cn(
        'row-start-3 mt-1.5 max-w-[70%] text-xs text-muted-foreground group-data-[size=lg]/gauge:text-sm',
        className,
      )}
      {...props}
    />
  );
};

export { Gauge, GaugeTrack, GaugeBands, GaugeIndicator, GaugeValue, GaugeLabel, useGauge };
