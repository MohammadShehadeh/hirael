'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/registry/hirael/bases/radix/ui/input-group';
import { Slider } from '@/registry/hirael/bases/radix/ui/slider';
import { useControllableState } from '@/registry/hirael/bases/radix/components/use-controllable-state';

export type NumberRangeValue = [number, number];

export type NumberFormatter = (n: number) => string;
export type NumberParser = (s: string) => number;

interface NumberRangeContextValue {
  value: NumberRangeValue;
  setValue: (v: NumberRangeValue) => void;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  format: NumberFormatter;
  parse: NumberParser;
  prefix?: string;
  suffix?: string;
}

const NumberRangeContext = React.createContext<NumberRangeContextValue | null>(null);

const useNumberRange = () => {
  const ctx = React.useContext(NumberRangeContext);
  if (!ctx) {
    throw new Error('NumberRange compound components must be used inside <NumberRange>');
  }

  return ctx;
};

const clamp = (n: number, lo: number, hi: number) => {
  return Math.min(hi, Math.max(lo, n));
};

const clampPair = ([lo, hi]: NumberRangeValue, min: number, max: number): NumberRangeValue => {
  const a = clamp(lo, min, max);
  const b = clamp(hi, min, max);

  return a <= b ? [a, b] : [b, a];
};

const defaultFormat: NumberFormatter = (n) => String(n);
const defaultParse: NumberParser = (s) => {
  const cleaned = s.replace(/[^\d.-]/g, '');

  // NaN for empty/invalid so a cleared field keeps its old value instead of committing 0.
  return cleaned === '' ? Number.NaN : Number(cleaned);
};

export interface NumberRangeProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'prefix'> {
  value?: NumberRangeValue;
  defaultValue?: NumberRangeValue;
  onValueChange?: (value: NumberRangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  format?: NumberFormatter;
  parse?: NumberParser;
  prefix?: string;
  suffix?: string;
}

const NumberRange = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  format = defaultFormat,
  parse = defaultParse,
  prefix,
  suffix,
  className,
  children,
  ...props
}: NumberRangeProps) => {
  const [value, setControlledValue] = useControllableState<NumberRangeValue>({
    prop: valueProp,
    defaultProp: defaultValue ?? [min, max],
    onChange: onValueChange,
  });
  const setValue = React.useCallback(
    (next: NumberRangeValue) => {
      const clamped = clampPair(next, min, max);
      setControlledValue(clamped);
    },
    [setControlledValue, min, max],
  );

  const ctx = React.useMemo<NumberRangeContextValue>(
    () => ({
      value,
      setValue,
      min,
      max,
      step,
      disabled,
      format,
      parse,
      prefix,
      suffix,
    }),
    [value, setValue, min, max, step, disabled, format, parse, prefix, suffix],
  );

  return (
    <NumberRangeContext.Provider value={ctx}>
      <div data-slot="number-range" className={cn('flex flex-col gap-3', className)} {...props}>
        {children}
      </div>
    </NumberRangeContext.Provider>
  );
};

const NumberRangeSlider = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Slider>, 'value' | 'onValueChange' | 'min' | 'max' | 'step' | 'defaultValue'>) => {
  const ctx = useNumberRange();

  return (
    <Slider
      min={ctx.min}
      max={ctx.max}
      step={ctx.step}
      value={ctx.value as number[]}
      disabled={ctx.disabled}
      onValueChange={(v) => ctx.setValue([v[0], v[1]] as NumberRangeValue)}
      data-slot="number-range-slider"
      className={className}
      {...props}
    />
  );
};

interface NumberRangeInputProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type'> {
  bound: 'min' | 'max';
}

const NumberRangeInput = ({ bound, className, onBlur, onKeyDown, ...props }: NumberRangeInputProps) => {
  const ctx = useNumberRange();
  const current = ctx.value[bound === 'min' ? 0 : 1];
  const [draft, setDraft] = React.useState<string | null>(null);

  const setBound = (n: number) => ctx.setValue(bound === 'min' ? [n, ctx.value[1]] : [ctx.value[0], n]);

  const commit = (raw: string) => {
    // An emptied field keeps the previous value, whatever a custom parser makes of ''.
    if (raw.trim() === '') return;
    const parsed = ctx.parse(raw);
    if (Number.isFinite(parsed)) setBound(parsed);
  };

  return (
    <InputGroup data-slot="number-range-input" data-disabled={ctx.disabled} className={className}>
      {ctx.prefix && (
        <InputGroupAddon>
          <InputGroupText>{ctx.prefix}</InputGroupText>
        </InputGroupAddon>
      )}
      <InputGroupInput
        inputMode="decimal"
        dir="ltr"
        value={draft ?? ctx.format(current)}
        disabled={ctx.disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => {
          onBlur?.(e);
          setDraft(null);
          if (e.defaultPrevented) return;
          commit(e.target.value);
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.defaultPrevented) return;
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const delta = (e.key === 'ArrowUp' ? 1 : -1) * ctx.step * (e.shiftKey ? 10 : 1);
            setBound(current + delta);
            setDraft(null);
          }
        }}
        className="tabular-nums"
        {...props}
      />
      {ctx.suffix && (
        <InputGroupAddon align="inline-end">
          <InputGroupText>{ctx.suffix}</InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

interface NumberRangeInputsProps extends React.ComponentProps<'div'> {
  separator?: React.ReactNode;
  /** Accessible name of the lower-bound field. */
  minLabel?: string;
  /** Accessible name of the upper-bound field. */
  maxLabel?: string;
}

const NumberRangeInputs = ({
  className,
  separator = '–',
  minLabel = 'Minimum value',
  maxLabel = 'Maximum value',
  ...props
}: NumberRangeInputsProps) => {
  return (
    <div
      data-slot="number-range-inputs"
      className={cn('grid grid-cols-[1fr_auto_1fr] items-center gap-2', className)}
      {...props}
    >
      <NumberRangeInput bound="min" aria-label={minLabel} />
      <span className="text-xs text-muted-foreground select-none">{separator}</span>
      <NumberRangeInput bound="max" aria-label={maxLabel} />
    </div>
  );
};

export { NumberRange, NumberRangeSlider, NumberRangeInput, NumberRangeInputs };
