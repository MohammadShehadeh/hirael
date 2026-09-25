'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { composeRefs } from '@/registry/hirael/bases/radix/components/compose-refs';

export type DurationUnit = 'd' | 'h' | 'm' | 's';

const UNIT_SECONDS: Record<DurationUnit, number> = { d: 86400, h: 3600, m: 60, s: 1 };

const UNIT_ORDER: readonly DurationUnit[] = ['d', 'h', 'm', 's'];

const UNIT_NAMES: Record<DurationUnit, string> = {
  d: 'days',
  h: 'hours',
  m: 'minutes',
  s: 'seconds',
};

const sortUnits = (units: readonly DurationUnit[]): DurationUnit[] => UNIT_ORDER.filter((u) => units.includes(u));

// Snaps to the smallest unit first, so 3599s with minutes smallest reads `01 h 00 m`, not `00 h 60 m`.
const splitDuration = (total: number, units: DurationUnit[]): Record<DurationUnit, number> => {
  const parts: Record<DurationUnit, number> = { d: 0, h: 0, m: 0, s: 0 };
  const smallest = UNIT_SECONDS[units[units.length - 1]];
  let rest = Math.round(Math.max(0, total) / smallest) * smallest;
  for (const unit of units) {
    parts[unit] = Math.floor(rest / UNIT_SECONDS[unit]);
    rest -= parts[unit] * UNIT_SECONDS[unit];
  }

  return parts;
};

const joinDuration = (parts: Record<DurationUnit, number>, units: DurationUnit[]): number =>
  units.reduce((total, unit) => total + parts[unit] * UNIT_SECONDS[unit], 0);

interface DurationDraft {
  unit: DurationUnit;
  text: string;
}

interface DurationInputContextValue {
  seconds: number | null;
  units: DurationUnit[];
  parts: Record<DurationUnit, number>;
  maxFor: (unit: DurationUnit) => number;
  widthFor: (unit: DurationUnit) => number;
  setUnit: (unit: DurationUnit, next: number) => void;
  clear: () => void;
  draft: DurationDraft | null;
  setDraft: (next: DurationDraft | null) => void;
  focusUnit: (from: DurationUnit, delta: number) => void;
  registerSegment: (unit: DurationUnit, el: HTMLInputElement | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

const DurationInputContext = React.createContext<DurationInputContextValue | null>(null);

const useDurationInput = () => {
  const ctx = React.useContext(DurationInputContext);
  if (!ctx) {
    throw new Error('DurationInput compound parts must be used inside <DurationInput>');
  }

  return ctx;
};

export interface DurationInputProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Total duration in seconds, or `null` while empty. */
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  /** Which segments to show. Order is normalised to largest first. */
  units?: DurationUnit[];
  /** Upper bound in seconds. Also sets how wide the largest segment types. */
  max?: number;
  disabled?: boolean;
  readOnly?: boolean;
  children?: React.ReactNode;
}

const DurationInput = ({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  units: unitsProp,
  max,
  disabled,
  readOnly,
  className,
  children,
  ...props
}: DurationInputProps) => {
  const [internalValue, setInternalValue] = React.useState<number | null>(defaultValue);
  const seconds = valueProp !== undefined ? valueProp : internalValue;

  const unitsKey = sortUnits(unitsProp ?? ['h', 'm']).join('') || 'hm';
  const units = React.useMemo(() => unitsKey.split('') as DurationUnit[], [unitsKey]);

  const [draft, setDraft] = React.useState<DurationDraft | null>(null);
  const segments = React.useRef(new Map<DurationUnit, HTMLInputElement>());

  const setSeconds = React.useCallback(
    (next: number | null) => {
      const clamped = next === null ? null : Math.max(0, max === undefined ? next : Math.min(max, next));
      if (valueProp === undefined) setInternalValue(clamped);
      onValueChange?.(clamped);
    },
    [valueProp, onValueChange, max],
  );

  const parts = React.useMemo(() => splitDuration(seconds ?? 0, units), [seconds, units]);

  const maxFor = React.useCallback(
    (unit: DurationUnit) => {
      const index = units.indexOf(unit);
      if (index > 0) return UNIT_SECONDS[units[index - 1]] / UNIT_SECONDS[unit] - 1;

      return max === undefined ? Infinity : Math.floor(max / UNIT_SECONDS[unit]);
    },
    [units, max],
  );

  const widthFor = React.useCallback(
    (unit: DurationUnit) => {
      const limit = maxFor(unit);

      return Number.isFinite(limit) ? Math.max(2, String(limit).length) : 3;
    },
    [maxFor],
  );

  const setUnit = React.useCallback(
    (unit: DurationUnit, next: number) => {
      if (disabled || readOnly) return;
      const bounded = Math.max(0, Math.min(maxFor(unit), next));
      setSeconds(joinDuration({ ...parts, [unit]: bounded }, units));
    },
    [disabled, readOnly, maxFor, parts, units, setSeconds],
  );

  const clear = React.useCallback(() => {
    if (disabled || readOnly) return;
    setDraft(null);
    setSeconds(null);
  }, [disabled, readOnly, setSeconds]);

  const focusUnit = React.useCallback(
    (from: DurationUnit, delta: number) => {
      const next = units[units.indexOf(from) + delta];
      if (next) segments.current.get(next)?.focus();
    },
    [units],
  );

  const registerSegment = React.useCallback((unit: DurationUnit, el: HTMLInputElement | null) => {
    if (el) segments.current.set(unit, el);
    else segments.current.delete(unit);
  }, []);

  const ctx = React.useMemo<DurationInputContextValue>(
    () => ({
      seconds,
      units,
      parts,
      maxFor,
      widthFor,
      setUnit,
      clear,
      draft,
      setDraft,
      focusUnit,
      registerSegment,
      disabled,
      readOnly,
    }),
    [seconds, units, parts, maxFor, widthFor, setUnit, clear, draft, focusUnit, registerSegment, disabled, readOnly],
  );

  return (
    <DurationInputContext.Provider value={ctx}>
      <div role="group" data-slot="duration-input" className={cn('flex flex-col gap-2', className)} {...props}>
        {children ?? (
          <DurationInputContainer>
            <DurationInputSegments />
          </DurationInputContainer>
        )}
      </div>
    </DurationInputContext.Provider>
  );
};

const DurationInputContainer = ({ className, children, onMouseDown, ...props }: React.ComponentProps<'div'>) => {
  const ctx = useDurationInput();

  return (
    <div
      data-slot="duration-input-container"
      data-disabled={ctx.disabled || undefined}
      data-readonly={ctx.readOnly || undefined}
      data-empty={ctx.seconds === null || undefined}
      onMouseDown={(e) => {
        onMouseDown?.(e);
        if (e.defaultPrevented) return;
        if (e.target !== e.currentTarget) return;
        e.preventDefault();
        const first = e.currentTarget.querySelector<HTMLInputElement>('[data-slot="duration-input-segment"]');
        first?.focus();
      }}
      className={cn(
        'flex h-9 w-full items-center gap-0.5 rounded-sm border border-input bg-transparent px-2 text-sm transition-colors outline-none',
        'focus-within:border-ring',
        (ctx.disabled || ctx.readOnly) && 'cursor-not-allowed opacity-60',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface DurationInputSegmentProps extends Omit<
  React.ComponentProps<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'type'
> {
  unit: DurationUnit;
  /** Short label after the digits. Pass `null` to drop it. */
  suffix?: React.ReactNode;
}

const DurationInputSegment = ({
  unit,
  suffix,
  className,
  onKeyDown,
  onFocus,
  onBlur,
  ref,
  ...props
}: DurationInputSegmentProps) => {
  const ctx = useDurationInput();
  const { registerSegment } = ctx;
  const composedRef = React.useMemo(
    () => composeRefs<HTMLInputElement>((el) => registerSegment(unit, el), ref),
    [registerSegment, unit, ref],
  );
  if (!ctx.units.includes(unit)) return null;

  const width = ctx.widthFor(unit);
  const limit = ctx.maxFor(unit);
  const draftText = ctx.draft?.unit === unit ? ctx.draft.text : null;
  const editing = draftText !== null;
  const display = editing ? draftText : ctx.seconds === null ? '' : String(ctx.parts[unit]).padStart(2, '0');

  const handleChange = (raw: string) => {
    if (ctx.disabled || ctx.readOnly) return;
    const digits = raw.replace(/\D/g, '').slice(-width);
    const text = digits.replace(/^0+(?=\d)/, '');
    ctx.setDraft({ unit, text });
    ctx.setUnit(unit, text === '' ? 0 : Number(text));
    if (text !== '' && (text.length >= width || Number(text) * 10 > limit)) {
      ctx.setDraft(null);
      ctx.focusUnit(unit, 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || ctx.disabled || ctx.readOnly) return;

    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const step = e.shiftKey ? 10 : 1;
    const current = ctx.seconds === null ? 0 : ctx.parts[unit];

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        ctx.setDraft(null);
        ctx.setUnit(unit, current + step);
        break;
      case 'ArrowDown':
        e.preventDefault();
        ctx.setDraft(null);
        ctx.setUnit(unit, Math.max(0, current - step));
        break;
      case 'ArrowRight':
        e.preventDefault();
        ctx.focusUnit(unit, rtl ? -1 : 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        ctx.focusUnit(unit, rtl ? 1 : -1);
        break;
      case 'Backspace':
        if (!editing || draftText === '') {
          e.preventDefault();
          ctx.setDraft({ unit, text: '' });
          ctx.setUnit(unit, 0);
        }
        break;
      default:
        break;
    }
  };

  return (
    <span data-slot="duration-input-part" className="inline-flex items-baseline">
      <input
        ref={composedRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        role="spinbutton"
        aria-label={UNIT_NAMES[unit]}
        aria-valuenow={ctx.seconds === null ? undefined : ctx.parts[unit]}
        aria-valuemin={0}
        aria-valuemax={Number.isFinite(limit) ? limit : undefined}
        data-slot="duration-input-segment"
        data-unit={unit}
        value={display}
        placeholder={'-'.repeat(width)}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          onFocus?.(e);
          e.currentTarget.select();
        }}
        onBlur={(e) => {
          onBlur?.(e);
          ctx.setDraft(null);
        }}
        style={{ width: `${width}ch` }}
        className={cn(
          'rounded-[2px] bg-transparent text-center tabular-nums outline-none',
          'placeholder:text-muted-foreground focus:bg-accent focus:text-accent-foreground disabled:cursor-not-allowed',
          className,
        )}
        {...props}
      />
      {suffix !== null && (
        <span data-slot="duration-input-suffix" className="me-1 text-xs text-muted-foreground">
          {suffix ?? unit}
        </span>
      )}
    </span>
  );
};

const DurationInputSegments = ({ className, ...props }: React.ComponentProps<'span'>) => {
  const ctx = useDurationInput();

  return (
    <span
      data-slot="duration-input-segments"
      className={cn('inline-flex items-baseline gap-0.5', className)}
      {...props}
    >
      {ctx.units.map((unit) => (
        <DurationInputSegment key={unit} unit={unit} />
      ))}
    </span>
  );
};

const DurationInputClear = ({ className, children, onClick, ...props }: React.ComponentProps<'button'>) => {
  const ctx = useDurationInput();
  if (ctx.seconds === null || ctx.disabled || ctx.readOnly) return null;

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label="Clear duration"
      data-slot="duration-input-clear"
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        ctx.clear();
      }}
      className={cn(
        'ms-auto inline-flex size-5 shrink-0 items-center justify-center rounded-[2px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children ?? <X className="size-3.5" />}
    </button>
  );
};

export {
  DurationInput,
  DurationInputContainer,
  DurationInputSegment,
  DurationInputSegments,
  DurationInputClear,
  splitDuration,
  joinDuration,
};
