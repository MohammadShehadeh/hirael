'use client';

import * as React from 'react';
import { flushSync } from 'react-dom';
import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { composeRefs } from '@/registry/hirael/bases/base/components/compose-refs';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/registry/hirael/bases/base/ui/input-group';

const HOLD_DELAY = 400;
const HOLD_INTERVAL = 120;
const HOLD_MIN_INTERVAL = 30;
const HOLD_ACCELERATION = 0.85;

const countDecimals = (n: number): number => {
  if (!Number.isFinite(n)) return 0;
  const [mantissa, exponent] = String(n).split('e-');
  const fraction = mantissa.split('.')[1]?.length ?? 0;

  return fraction + (exponent ? Number(exponent) : 0);
};

const roundTo = (n: number, digits: number): number => {
  const d = Math.min(20, Math.max(0, digits));
  const text = String(Math.abs(n));
  if (text.includes('e')) return Number(n.toFixed(d));
  // Shifting through the string form rounds 2.255 up; toFixed sees 2.25499... and rounds down.
  const shifted = Math.round(Number(`${text}e${d}`));

  return Math.sign(n) * Number(`${shifted}e-${d}`);
};

const resolveFormatOptions = (
  formatOptions: Intl.NumberFormatOptions | undefined,
  precision: number | undefined,
  step: number,
  largeStep: number,
): Intl.NumberFormatOptions => {
  if (formatOptions) return formatOptions;
  if (precision !== undefined) return { minimumFractionDigits: precision, maximumFractionDigits: precision };

  return { maximumFractionDigits: Math.max(3, countDecimals(step), countDecimals(largeStep)) };
};

interface NumberFormat {
  format: (value: number | null) => string;
  /** `null` for an empty string, `NaN` for text that is not a number. */
  parse: (text: string) => number | null;
  isPartial: (text: string) => boolean;
  fractionDigits: number;
}

const createNumberFormat = (locale: string, options: Intl.NumberFormatOptions): NumberFormat => {
  const formatter = new Intl.NumberFormat(locale, options);
  const resolved = formatter.resolvedOptions();
  const percent = resolved.style === 'percent';
  const fractionDigits = (resolved.maximumFractionDigits ?? 3) + (percent ? 2 : 0);

  const symbols = new Intl.NumberFormat(locale, { useGrouping: true }).formatToParts(-12345.6);
  const group = symbols.find((p) => p.type === 'group')?.value ?? ',';
  const decimal = symbols.find((p) => p.type === 'decimal')?.value ?? '.';
  const minus = symbols.find((p) => p.type === 'minusSign')?.value ?? '-';
  const digits = [...new Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210)].reverse();

  const affixes = new Set<string>();
  for (const sample of [-12345.6, 1]) {
    for (const part of formatter.formatToParts(sample)) {
      if (['currency', 'percentSign', 'unit', 'literal'].includes(part.type) && part.value.trim()) {
        affixes.add(part.value.trim());
      }
    }
  }
  const sortedAffixes = [...affixes].sort((a, b) => b.length - a.length);

  const normalize = (text: string): string => {
    let s = text;
    for (const affix of sortedAffixes) s = s.split(affix).join('');
    // Bidi marks come along when a formatted RTL-locale value is pasted back in.
    s = s.replace(/[\s‎‏؜]/g, '');
    s = [...s].map((ch) => (digits.includes(ch) ? String(digits.indexOf(ch)) : ch)).join('');
    if (group.trim()) s = s.split(group).join('');
    s = s.split(decimal).join('.');

    return s.split(minus).join('-').replace(/−/g, '-');
  };

  const partialPattern = fractionDigits > 0 ? /^-?\d*\.?\d*$/ : /^-?\d*$/;

  return {
    format: (value) => (value === null || Number.isNaN(value) ? '' : formatter.format(value)),
    parse: (text) => {
      const s = normalize(text);
      if (!s) return null;
      if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return Number.NaN;
      const n = Number(s);

      return percent ? n / 100 : n;
    },
    isPartial: (text) => partialPattern.test(normalize(text)),
    fractionDigits,
  };
};

interface NumberFieldContextValue {
  inputId: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: number | null;
  inputValue: string;
  setInputValue: (next: string) => void;
  format: NumberFormat;
  min?: number;
  max?: number;
  step: number;
  largeStep: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  allowWheel: boolean;
  canIncrement: boolean;
  canDecrement: boolean;
  commit: () => void;
  revert: () => boolean;
  /** Returns the new value, or `null` when nothing changed. `from` overrides the current value. */
  stepBy: (direction: 1 | -1, amount?: number, from?: number) => number | null;
  setToBound: (bound: 'min' | 'max') => boolean;
}

const NumberFieldContext = React.createContext<NumberFieldContextValue | null>(null);

const useNumberField = () => {
  const ctx = React.useContext(NumberFieldContext);
  if (!ctx) {
    throw new Error('NumberField compound parts must be used inside <NumberField>');
  }

  return ctx;
};

const NumberFieldStepperContext = React.createContext(false);

export interface NumberFieldProps extends Omit<
  React.ComponentProps<'div'>,
  'id' | 'defaultValue' | 'onChange' | 'children'
> {
  /** Id for the input, so a `<label htmlFor>` can point at it. */
  id?: string;
  /** The committed number, or `null` while empty. */
  value?: number | null;
  /** Starting value when uncontrolled. */
  defaultValue?: number | null;
  /** Fires on commit (blur, Enter, a step), not on every keystroke. */
  onValueChange?: (value: number | null) => void;
  /** Lowest allowed value. Home jumps here. */
  min?: number;
  /** Highest allowed value. End jumps here. */
  max?: number;
  /** Amount for the arrow keys and the buttons. Steps snap to multiples of it from `min` (or 0). */
  step?: number;
  /** Amount for Shift+Arrow and Page Up/Down. Defaults to ten steps. */
  largeStep?: number;
  /** Fixed number of decimals. Ignored when `formatOptions` is set. */
  precision?: number;
  /** `Intl.NumberFormat` options for display and parsing, e.g. `{ style: 'currency', currency: 'USD' }`. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Locale for formatting and parsing. */
  locale?: string;
  /** Step with the mouse wheel while the input is focused. */
  allowWheel?: boolean;
  /** Blocks typing and stepping, and leaves the value out of form submission. */
  disabled?: boolean;
  /** Shows the value but blocks typing and stepping. */
  readOnly?: boolean;
  /** Marks the input as required for native form validation. */
  required?: boolean;
  /** Submits the raw number (no symbol or grouping) under this name. */
  name?: string;
  children?: React.ReactNode;
}

const NumberField = ({
  id,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  largeStep: largeStepProp,
  precision,
  formatOptions,
  locale = 'en-US',
  allowWheel = false,
  disabled,
  readOnly,
  required,
  name,
  className,
  children,
  ...props
}: NumberFieldProps) => {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const largeStep = largeStepProp ?? step * 10;

  const [internalValue, setInternalValue] = React.useState<number | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const optionsKey = JSON.stringify(resolveFormatOptions(formatOptions, precision, step, largeStep));
  const format = React.useMemo(() => createNumberFormat(locale, JSON.parse(optionsKey)), [locale, optionsKey]);

  const [inputValue, setInputValue] = React.useState(() => format.format(value));

  // Reformat on an outside value change or new format, but leave the user's draft alone otherwise.
  const [synced, setSynced] = React.useState({ value, format });
  if (!Object.is(synced.value, value) || synced.format !== format) {
    setSynced({ value, format });
    setInputValue(format.format(value));
  }

  const update = React.useCallback(
    (next: number | null) => {
      setInputValue(format.format(next));
      if (Object.is(next, value)) return;
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [format, value, valueProp, onValueChange],
  );

  const clamp = React.useCallback(
    (n: number) => {
      const rounded = roundTo(n, format.fractionDigits);
      if (max !== undefined && rounded > max) return max;
      if (min !== undefined && rounded < min) return min;

      return rounded;
    },
    [format, min, max],
  );

  const commit = React.useCallback(() => {
    const parsed = format.parse(inputValue);
    if (parsed !== null && Number.isNaN(parsed)) {
      setInputValue(format.format(value));

      return;
    }
    update(parsed === null ? null : clamp(parsed));
  }, [format, inputValue, value, update, clamp]);

  const revert = React.useCallback(() => {
    const committed = format.format(value);
    if (inputValue === committed) return false;
    setInputValue(committed);

    return true;
  }, [format, inputValue, value]);

  const stepBy = React.useCallback(
    (direction: 1 | -1, amount = step, from?: number) => {
      if (disabled || readOnly) return null;
      const draft = format.parse(inputValue);
      const base = from ?? (draft === null || Number.isNaN(draft) ? value : draft);
      if (base === null) {
        const start = clamp(direction > 0 ? (min ?? 0) : (max ?? 0));
        update(start);

        return start;
      }
      let next = base + direction * amount;
      if (amount === step) {
        const origin = min ?? 0;
        const position = (base - origin) / step;
        // Off-grid values snap to the neighbouring multiple instead of keeping their offset.
        if (Math.abs(position - Math.round(position)) > 1e-9) {
          next = origin + (direction > 0 ? Math.ceil(position) : Math.floor(position)) * step;
        }
      }
      const clamped = clamp(next);
      update(clamped);

      return clamped === base ? null : clamped;
    },
    [disabled, readOnly, format, inputValue, value, step, min, max, update, clamp],
  );

  const setToBound = React.useCallback(
    (bound: 'min' | 'max') => {
      const target = bound === 'min' ? min : max;
      if (target === undefined || disabled || readOnly) return false;
      update(target);

      return true;
    },
    [min, max, disabled, readOnly, update],
  );

  const interactive = !disabled && !readOnly;
  const canIncrement = interactive && (max === undefined || value === null || value < max);
  const canDecrement = interactive && (min === undefined || value === null || value > min);

  const ctx = React.useMemo<NumberFieldContextValue>(
    () => ({
      inputId,
      inputRef,
      value,
      inputValue,
      setInputValue,
      format,
      min,
      max,
      step,
      largeStep,
      disabled,
      readOnly,
      required,
      allowWheel,
      canIncrement,
      canDecrement,
      commit,
      revert,
      stepBy,
      setToBound,
    }),
    [
      inputId,
      value,
      inputValue,
      format,
      min,
      max,
      step,
      largeStep,
      disabled,
      readOnly,
      required,
      allowWheel,
      canIncrement,
      canDecrement,
      commit,
      revert,
      stepBy,
      setToBound,
    ],
  );

  return (
    <NumberFieldContext.Provider value={ctx}>
      <div
        data-slot="number-field"
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        className={cn('w-full', className)}
        {...props}
      >
        {children}
        {name && <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />}
      </div>
    </NumberFieldContext.Provider>
  );
};

type NumberFieldGroupProps = React.ComponentProps<typeof InputGroup>;

const NumberFieldGroup = ({ className, ...props }: NumberFieldGroupProps) => {
  const ctx = useNumberField();

  return (
    <InputGroup
      data-slot="number-field-group"
      data-disabled={ctx.disabled ? 'true' : undefined}
      className={className}
      {...props}
    />
  );
};

type NumberFieldInputProps = Omit<
  React.ComponentProps<'input'>,
  'id' | 'type' | 'value' | 'defaultValue' | 'min' | 'max' | 'step' | 'name'
>;

const NumberFieldInput = ({
  className,
  onChange,
  onBlur,
  onKeyDown,
  ref,
  inputMode,
  ...props
}: NumberFieldInputProps) => {
  const ctx = useNumberField();
  const { inputRef, allowWheel, disabled, readOnly } = ctx;
  const composedRef = React.useMemo(() => composeRefs(inputRef, ref), [inputRef, ref]);

  const stepRef = React.useRef(ctx.stepBy);
  React.useEffect(() => {
    stepRef.current = ctx.stepBy;
  });

  React.useEffect(() => {
    const input = inputRef.current;
    if (!input || !allowWheel || disabled || readOnly) return;
    // React's onWheel is passive, so the page would scroll along with the value.
    const handleWheel = (e: WheelEvent) => {
      if (document.activeElement !== input || e.ctrlKey || e.deltaY === 0) return;
      e.preventDefault();
      stepRef.current(e.deltaY < 0 ? 1 : -1);
    };
    input.addEventListener('wheel', handleWheel, { passive: false });

    return () => input.removeEventListener('wheel', handleWheel);
  }, [inputRef, allowWheel, disabled, readOnly]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || e.nativeEvent.isComposing) return;
    const up = e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'Home';
    let handled = true;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') ctx.stepBy(up ? 1 : -1, e.shiftKey ? ctx.largeStep : ctx.step);
    else if (e.key === 'PageUp' || e.key === 'PageDown') ctx.stepBy(up ? 1 : -1, ctx.largeStep);
    else if (e.key === 'Home' || e.key === 'End') handled = ctx.setToBound(up ? 'min' : 'max');
    else if (e.key === 'Escape') handled = ctx.revert();
    else {
      handled = false;
      // Flush so an implicit form submit on this Enter reads the committed value.
      if (e.key === 'Enter' && !ctx.readOnly) flushSync(ctx.commit);
    }
    if (handled) e.preventDefault();
  };

  const fractions = ctx.format.fractionDigits > 0;
  // iOS numeric keypads have no minus key, so fall back to text when negatives are allowed.
  const resolvedInputMode =
    inputMode ?? (ctx.min !== undefined && ctx.min >= 0 ? (fractions ? 'decimal' : 'numeric') : 'text');

  return (
    <InputGroupInput
      ref={composedRef}
      id={ctx.inputId}
      role="spinbutton"
      inputMode={resolvedInputMode}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      value={ctx.inputValue}
      disabled={ctx.disabled}
      readOnly={ctx.readOnly}
      required={ctx.required}
      aria-valuenow={ctx.value ?? undefined}
      aria-valuemin={ctx.min}
      aria-valuemax={ctx.max}
      aria-valuetext={ctx.value === null ? undefined : ctx.format.format(ctx.value)}
      className={cn(
        'text-center tabular-nums group-has-[[data-slot=number-field-stepper]]/input-group:text-start',
        className,
      )}
      onChange={(e) => {
        onChange?.(e);
        if (e.defaultPrevented) return;
        if (ctx.format.isPartial(e.target.value)) ctx.setInputValue(e.target.value);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        if (e.defaultPrevented || ctx.readOnly) return;
        ctx.commit();
      }}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

// Each tick steps from the previous tick's result, not from state, so a hold keeps counting even
// when renders lag behind the timer.
const useHoldRepeat = (action: (from: number | undefined) => number | null) => {
  const actionRef = React.useRef(action);
  React.useEffect(() => {
    actionRef.current = action;
  });

  const stopRef = React.useRef<(() => void) | null>(null);
  const stop = React.useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
  }, []);
  React.useEffect(() => stop, [stop]);

  const start = React.useCallback(() => {
    stop();
    let last = actionRef.current(undefined);
    if (last === null) return;
    let interval = HOLD_INTERVAL;
    let timer: number;
    const tick = () => {
      const next = actionRef.current(last ?? undefined);
      if (next === null) return stop();
      last = next;
      interval = Math.max(HOLD_MIN_INTERVAL, interval * HOLD_ACCELERATION);
      timer = window.setTimeout(tick, interval);
    };
    timer = window.setTimeout(tick, HOLD_DELAY);
    // Listen on window: a button that hits its bound turns disabled and never sees the pointerup.
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    window.addEventListener('blur', stop);
    stopRef.current = () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
      window.removeEventListener('blur', stop);
    };
  }, [stop]);

  return { start, stop };
};

interface NumberFieldStepButtonProps extends Omit<
  React.ComponentProps<typeof InputGroupButton>,
  'size' | 'variant' | 'type'
> {
  direction: 1 | -1;
}

const NumberFieldStepButton = ({
  direction,
  className,
  children,
  disabled,
  onPointerDown,
  onPointerLeave,
  onClick,
  onContextMenu,
  ...props
}: NumberFieldStepButtonProps) => {
  const ctx = useNumberField();
  const stacked = React.useContext(NumberFieldStepperContext);
  const increment = direction > 0;
  const isDisabled = disabled || (increment ? !ctx.canIncrement : !ctx.canDecrement);
  const { start, stop } = useHoldRepeat((from) => ctx.stepBy(direction, ctx.step, from));
  const Icon = stacked ? (increment ? ChevronUp : ChevronDown) : increment ? Plus : Minus;

  const button = (
    <InputGroupButton
      type="button"
      variant="ghost"
      size={stacked ? 'xs' : 'icon-xs'}
      tabIndex={-1}
      aria-label={increment ? 'Increase' : 'Decrease'}
      aria-controls={ctx.inputId}
      disabled={isDisabled}
      data-slot={increment ? 'number-field-increment' : 'number-field-decrement'}
      className={cn(
        'touch-manipulation select-none',
        stacked && 'h-auto min-h-0 w-7 flex-1 rounded-none px-0 has-[>svg]:px-0 [&>svg]:size-3.5',
        className,
      )}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || e.button !== 0 || isDisabled) return;
        // Keeps focus (and any typed draft) in the input instead of moving it to the button.
        e.preventDefault();
        if (e.pointerType === 'mouse') ctx.inputRef.current?.focus();
        start();
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        stop();
      }}
      onClick={(e) => {
        onClick?.(e);
        // Pointer presses already stepped on pointerdown; detail 0 is a keyboard or assistive-tech click.
        if (!e.defaultPrevented && e.detail === 0) ctx.stepBy(direction);
      }}
      onContextMenu={(e) => {
        onContextMenu?.(e);
        e.preventDefault();
      }}
      {...props}
    >
      {children ?? <Icon />}
    </InputGroupButton>
  );

  if (stacked) return button;

  return <InputGroupAddon align={increment ? 'inline-end' : 'inline-start'}>{button}</InputGroupAddon>;
};

type NumberFieldStepProps = Omit<NumberFieldStepButtonProps, 'direction'>;

const NumberFieldIncrement = (props: NumberFieldStepProps) => <NumberFieldStepButton direction={1} {...props} />;

const NumberFieldDecrement = (props: NumberFieldStepProps) => <NumberFieldStepButton direction={-1} {...props} />;

const NumberFieldStepper = ({ className, children, ...props }: React.ComponentProps<'div'>) => (
  <NumberFieldStepperContext.Provider value={true}>
    <div
      data-slot="number-field-stepper"
      className={cn(
        'order-last flex flex-col self-stretch overflow-hidden rounded-e-[inherit] border-s border-input',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <NumberFieldIncrement />
          <NumberFieldDecrement />
        </>
      )}
    </div>
  </NumberFieldStepperContext.Provider>
);

export {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldStepper,
};
