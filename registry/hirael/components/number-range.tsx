"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/registry/hirael/ui/input";
import { Slider } from "@/registry/hirael/ui/slider";

export type NumberRangeValue = [number, number];

export type NumberFormatter = (n: number) => string;
export type NumberParser = (s: string) => number;

type NumberRangeContextValue = {
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
};

const NumberRangeContext = React.createContext<NumberRangeContextValue | null>(
  null,
);

function useNumberRange() {
  const ctx = React.useContext(NumberRangeContext);
  if (!ctx) {
    throw new Error(
      "NumberRange compound components must be used inside <NumberRange>",
    );
  }
  return ctx;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function clampPair(
  [lo, hi]: NumberRangeValue,
  min: number,
  max: number,
): NumberRangeValue {
  const a = clamp(lo, min, max);
  const b = clamp(hi, min, max);
  return a <= b ? [a, b] : [b, a];
}

const defaultFormat: NumberFormatter = (n) => String(n);
const defaultParse: NumberParser = (s) => {
  const cleaned = s.replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

export type NumberRangeProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "prefix"
> & {
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
};

function NumberRange({
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
}: NumberRangeProps) {
  const [internal, setInternal] = React.useState<NumberRangeValue>(
    defaultValue ?? [min, max],
  );
  const value = valueProp ?? internal;
  const setValue = React.useCallback(
    (next: NumberRangeValue) => {
      const clamped = clampPair(next, min, max);
      if (valueProp === undefined) setInternal(clamped);
      onValueChange?.(clamped);
    },
    [valueProp, onValueChange, min, max],
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
      <div
        data-slot="number-range"
        className={cn("flex flex-col gap-3", className)}
        {...props}
      >
        {children}
      </div>
    </NumberRangeContext.Provider>
  );
}

function NumberRangeSlider({
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof Slider>,
  "value" | "onValueChange" | "min" | "max" | "step" | "defaultValue"
>) {
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
}

type NumberRangeInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "type"
> & {
  bound: "min" | "max";
};

function NumberRangeInput({
  bound,
  className,
  ...props
}: NumberRangeInputProps) {
  const ctx = useNumberRange();
  const i = bound === "min" ? 0 : 1;
  const current = ctx.value[i];
  const format = ctx.format;

  const [draft, setDraft] = React.useState<string>(format(current));
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    if (!editing) setDraft(format(current));
  }, [current, format, editing]);

  const commit = (raw: string) => {
    const parsed = ctx.parse(raw);
    const next: NumberRangeValue =
      bound === "min" ? [parsed, ctx.value[1]] : [ctx.value[0], parsed];
    ctx.setValue(next);
  };

  return (
    <div data-slot="number-range-input" className="relative">
      {ctx.prefix && (
        <span className="pointer-events-none absolute start-2 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
          {ctx.prefix}
        </span>
      )}
      <Input
        inputMode="decimal"
        value={draft}
        disabled={ctx.disabled}
        onFocus={() => setEditing(true)}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => {
          setEditing(false);
          commit(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            const delta = e.key === "ArrowUp" ? ctx.step : -ctx.step;
            const mult = e.shiftKey ? 10 : 1;
            const next =
              bound === "min"
                ? ([
                    ctx.value[0] + delta * mult,
                    ctx.value[1],
                  ] as NumberRangeValue)
                : ([
                    ctx.value[0],
                    ctx.value[1] + delta * mult,
                  ] as NumberRangeValue);
            ctx.setValue(next);
          }
        }}
        className={cn(
          "font-mono tabular-nums",
          ctx.prefix && "ps-6",
          ctx.suffix && "pe-8",
          className,
        )}
        {...props}
      />
      {ctx.suffix && (
        <span className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
          {ctx.suffix}
        </span>
      )}
    </div>
  );
}

type NumberRangeInputsProps = React.ComponentProps<"div"> & {
  separator?: React.ReactNode;
};

function NumberRangeInputs({
  className,
  separator = "–",
  ...props
}: NumberRangeInputsProps) {
  return (
    <div
      data-slot="number-range-inputs"
      className={cn(
        "grid grid-cols-[1fr_auto_1fr] items-center gap-2",
        className,
      )}
      {...props}
    >
      <NumberRangeInput bound="min" aria-label="Minimum value" />
      <span className="font-mono text-xs text-muted-foreground select-none">
        {separator}
      </span>
      <NumberRangeInput bound="max" aria-label="Maximum value" />
    </div>
  );
}

export { NumberRange, NumberRangeSlider, NumberRangeInput, NumberRangeInputs };
