'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Field, FieldError, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { NativeSelect, NativeSelectOption } from '@/registry/hirael/bases/base/ui/native-select';

/* -------------------------------------------------------------------------- */
/*  Cron parsing                                                              */
/* -------------------------------------------------------------------------- */

export type CronField = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek';

export type CronFieldMode = 'every' | 'specific' | 'step';

export interface CronFieldValue {
  mode: CronFieldMode;
  /** Selected values for `specific`; empty for `every` / `step`. */
  values: number[];
  /** Interval for `step`; 1 otherwise. */
  step: number;
  /** Every value the field allows, expanded from the raw token. */
  allowed: number[];
  raw: string;
}

export interface ParsedCron {
  valid: boolean;
  error: string | null;
  errorField: CronField | null;
  fields: Record<CronField, CronFieldValue>;
}

export const CRON_FIELDS: readonly CronField[] = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'] as const;

const FIELD_RANGE: Record<CronField, { min: number; max: number }> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 6 },
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const FIELD_ALIASES: Partial<Record<CronField, string[]>> = {
  month: MONTH_NAMES.map((m) => m.slice(0, 3).toUpperCase()),
  dayOfWeek: DAY_NAMES.map((d) => d.slice(0, 3).toUpperCase()),
};

const rangeList = (min: number, max: number, step = 1): number[] => {
  const out: number[] = [];
  for (let i = min; i <= max; i += step) out.push(i);
  return out;
};

const parseNumber = (token: string, field: CronField): number | null => {
  const { min, max } = FIELD_RANGE[field];
  const upper = token.toUpperCase();
  const aliases = FIELD_ALIASES[field];
  if (aliases) {
    const idx = aliases.indexOf(upper);
    if (idx !== -1) return field === 'month' ? idx + 1 : idx;
  }
  if (!/^\d+$/.test(token)) return null;
  let n = Number(token);
  if (field === 'dayOfWeek' && n === 7) n = 0;
  if (n < min || n > max) return null;
  return n;
};

const everyField = (field: CronField): CronFieldValue => {
  const { min, max } = FIELD_RANGE[field];
  return {
    mode: 'every',
    values: [],
    step: 1,
    allowed: rangeList(min, max),
    raw: '*',
  };
};

const parseField = (raw: string, field: CronField): CronFieldValue => {
  const { min, max } = FIELD_RANGE[field];
  const token = raw.trim();
  if (token === '*') return everyField(field);

  const stepMatch = /^\*\/(\d+)$/.exec(token);
  if (stepMatch) {
    const step = Number(stepMatch[1]);
    if (step < 1 || step > max) throw new Error(`Step out of range: ${token}`);
    return {
      mode: 'step',
      values: [],
      step,
      allowed: rangeList(min, max, step),
      raw: token,
    };
  }

  const allowed = new Set<number>();
  for (const part of token.split(',')) {
    if (part === '') throw new Error(`Empty value in "${token}"`);
    const rangeStep = /^([^/]+)(?:\/(\d+))?$/.exec(part);
    if (!rangeStep) throw new Error(`Cannot read "${part}"`);
    const [, base, stepStr] = rangeStep;
    const step = stepStr ? Number(stepStr) : 1;
    if (step < 1) throw new Error(`Step must be at least 1 in "${part}"`);
    let lo: number;
    let hi: number;
    if (base === '*') {
      lo = min;
      hi = max;
    } else if (base.includes('-')) {
      const [a, b] = base.split('-');
      const pa = parseNumber(a, field);
      const pb = parseNumber(b, field);
      if (pa === null || pb === null) {
        throw new Error(`Cannot read "${part}"`);
      }
      lo = pa;
      hi = pb;
      if (lo > hi) throw new Error(`Range is backwards: "${part}"`);
    } else {
      const n = parseNumber(base, field);
      if (n === null) throw new Error(`Cannot read "${part}"`);
      lo = n;
      hi = stepStr ? max : n;
    }
    for (let i = lo; i <= hi; i += step) allowed.add(i);
  }

  const values = Array.from(allowed).sort((a, b) => a - b);
  return { mode: 'specific', values, step: 1, allowed: values, raw: token };
};

/**
 * Parse a five-field cron expression (`minute hour day-of-month month
 * day-of-week`). Supports wildcards, steps, lists, ranges, and `a-b/N`, plus
 * `JAN..DEC` / `SUN..SAT` names. Invalid fields fall back to `*` so a builder
 * can still render; check `valid` before trusting the result.
 */
export const parseCron = (expression: string): ParsedCron => {
  const tokens = expression.trim().split(/\s+/).filter(Boolean);
  const fields = {
    minute: everyField('minute'),
    hour: everyField('hour'),
    dayOfMonth: everyField('dayOfMonth'),
    month: everyField('month'),
    dayOfWeek: everyField('dayOfWeek'),
  };

  if (tokens.length !== 5) {
    return {
      valid: false,
      error: tokens.length === 0 ? 'Enter a cron expression.' : `Expected 5 fields, got ${tokens.length}.`,
      errorField: null,
      fields,
    };
  }

  let error: string | null = null;
  let errorField: CronField | null = null;
  CRON_FIELDS.forEach((field, i) => {
    try {
      fields[field] = parseField(tokens[i], field);
    } catch (e) {
      if (!error) {
        error = e instanceof Error ? e.message : String(e);
        errorField = field;
      }
    }
  });

  return { valid: error === null, error, errorField, fields };
};

export const formatCronField = (field: Pick<CronFieldValue, 'mode' | 'values' | 'step'>): string => {
  if (field.mode === 'every') return '*';
  if (field.mode === 'step') return `*/${Math.max(1, field.step)}`;
  if (field.values.length === 0) return '*';
  return Array.from(new Set(field.values))
    .sort((a, b) => a - b)
    .join(',');
};

export const formatCron = (fields: Record<CronField, Pick<CronFieldValue, 'mode' | 'values' | 'step'>>): string => {
  return CRON_FIELDS.map((f) => formatCronField(fields[f])).join(' ');
};

/* -------------------------------------------------------------------------- */
/*  Describe                                                                  */
/* -------------------------------------------------------------------------- */

const joinList = (items: string[]): string => {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
};

const ordinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
};

const pad2 = (n: number): string => {
  return String(n).padStart(2, '0');
};

/** Turn a cron expression into a plain sentence, like "At 09:00 on Monday". */
export const describeCron = (expression: string): string => {
  const parsed = parseCron(expression);
  if (!parsed.valid) return parsed.error ?? 'Invalid expression';
  const { minute, hour, dayOfMonth, month, dayOfWeek } = parsed.fields;
  const parts: string[] = [];

  // Time
  if (minute.mode === 'specific' && hour.mode === 'specific') {
    const times: string[] = [];
    for (const h of hour.values) {
      for (const m of minute.values) times.push(`${pad2(h)}:${pad2(m)}`);
    }
    parts.push(`At ${joinList(times.slice(0, 6))}`);
    if (times.length > 6) parts.push(`and ${times.length - 6} more times`);
  } else if (minute.mode === 'specific' && hour.mode === 'every') {
    parts.push(`Every hour at minute ${joinList(minute.values.map(String))}`);
  } else if (minute.mode === 'specific' && hour.mode === 'step') {
    parts.push(`At minute ${joinList(minute.values.map(String))} past every ${ordinal(hour.step)} hour`);
  } else if (minute.mode === 'step' && hour.mode === 'every') {
    parts.push(minute.step === 1 ? 'Every minute' : `Every ${minute.step} minutes`);
  } else if (minute.mode === 'step' && hour.mode === 'specific') {
    parts.push(`Every ${minute.step} minutes past hour ${joinList(hour.values.map(String))}`);
  } else if (minute.mode === 'step' && hour.mode === 'step') {
    parts.push(`Every ${minute.step} minutes past every ${ordinal(hour.step)} hour`);
  } else if (minute.mode === 'every' && hour.mode === 'specific') {
    parts.push(`Every minute past hour ${joinList(hour.values.map(String))}`);
  } else if (minute.mode === 'every' && hour.mode === 'step') {
    parts.push(`Every minute past every ${ordinal(hour.step)} hour`);
  } else {
    parts.push('Every minute');
  }

  // Day of month
  if (dayOfMonth.mode === 'specific') {
    parts.push(`on day ${joinList(dayOfMonth.values.map(String))} of the month`);
  } else if (dayOfMonth.mode === 'step') {
    parts.push(`every ${ordinal(dayOfMonth.step)} day of the month`);
  }

  // Day of week
  if (dayOfWeek.mode === 'specific') {
    const names = dayOfWeek.values.map((d) => DAY_NAMES[d]);
    const isWeekdays = dayOfWeek.values.join(',') === '1,2,3,4,5';
    const label = isWeekdays ? 'weekdays' : joinList(names);
    parts.push(dayOfMonth.mode === 'specific' ? `and on ${label}` : `on ${label}`);
  } else if (dayOfWeek.mode === 'step') {
    parts.push(`every ${ordinal(dayOfWeek.step)} day of the week`);
  }

  // Month
  if (month.mode === 'specific') {
    parts.push(`in ${joinList(month.values.map((m) => MONTH_NAMES[m - 1]))}`);
  } else if (month.mode === 'step') {
    parts.push(`every ${ordinal(month.step)} month`);
  }

  return parts.join(' ');
};

/* -------------------------------------------------------------------------- */
/*  Next runs                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Compute the next `count` times the expression fires after `from`, in local
 * time. Standard cron rules: when both day-of-month and day-of-week are
 * restricted, either one matching is enough.
 */
export const nextCronRuns = (expression: string, count = 3, from: Date = new Date()): Date[] => {
  const parsed = parseCron(expression);
  if (!parsed.valid) return [];
  const { minute, hour, dayOfMonth, month, dayOfWeek } = parsed.fields;
  const minutes = new Set(minute.allowed);
  const hours = new Set(hour.allowed);
  const months = new Set(month.allowed);
  const doms = new Set(dayOfMonth.allowed);
  const dows = new Set(dayOfWeek.allowed);
  const domRestricted = dayOfMonth.mode !== 'every';
  const dowRestricted = dayOfWeek.mode !== 'every';

  const dayMatches = (d: Date) => {
    const domOk = doms.has(d.getDate());
    const dowOk = dows.has(d.getDay());
    if (domRestricted && dowRestricted) return domOk || dowOk;
    if (domRestricted) return domOk;
    if (dowRestricted) return dowOk;
    return true;
  };

  const out: Date[] = [];
  const d = new Date(from.getTime());
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);

  // Hard cap so an unsatisfiable expression (Feb 31) cannot spin forever.
  for (let i = 0; i < 200_000 && out.length < count; i++) {
    if (!months.has(d.getMonth() + 1)) {
      d.setMonth(d.getMonth() + 1, 1);
      d.setHours(0, 0, 0, 0);
      continue;
    }
    if (!dayMatches(d)) {
      d.setDate(d.getDate() + 1);
      d.setHours(0, 0, 0, 0);
      continue;
    }
    if (!hours.has(d.getHours())) {
      d.setHours(d.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (!minutes.has(d.getMinutes())) {
      d.setMinutes(d.getMinutes() + 1);
      continue;
    }
    out.push(new Date(d.getTime()));
    d.setMinutes(d.getMinutes() + 1);
  }
  return out;
};

/* -------------------------------------------------------------------------- */
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */

interface CronEditorContextValue {
  id: string;
  value: string;
  setValue: (next: string) => void;
  parsed: ParsedCron;
  setField: (field: CronField, patch: Partial<Pick<CronFieldValue, 'mode' | 'values' | 'step'>>) => void;
  disabled?: boolean;
}

const CronEditorContext = React.createContext<CronEditorContextValue | null>(null);

const useCronEditor = () => {
  const ctx = React.useContext(CronEditorContext);
  if (!ctx) {
    throw new Error('CronEditor compound parts must be used inside <CronEditor>');
  }
  return ctx;
};

/* -------------------------------------------------------------------------- */
/*  Root                                                                      */
/* -------------------------------------------------------------------------- */

export interface CronEditorProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  id?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const CronEditor = ({
  id,
  value: valueProp,
  defaultValue = '0 9 * * 1-5',
  onValueChange,
  disabled,
  className,
  children,
  ...props
}: CronEditorProps) => {
  const reactId = React.useId();
  const editorId = id ?? reactId;
  const [internal, setInternal] = React.useState(defaultValue);
  const value = valueProp ?? internal;

  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const parsed = React.useMemo(() => parseCron(value), [value]);

  const setField = React.useCallback(
    (field: CronField, patch: Partial<Pick<CronFieldValue, 'mode' | 'values' | 'step'>>) => {
      const next = {
        ...parsed.fields,
        [field]: { ...parsed.fields[field], ...patch },
      };
      setValue(formatCron(next));
    },
    [parsed, setValue],
  );

  const ctx = React.useMemo<CronEditorContextValue>(
    () => ({ id: editorId, value, setValue, parsed, setField, disabled }),
    [editorId, value, setValue, parsed, setField, disabled],
  );

  return (
    <CronEditorContext.Provider value={ctx}>
      <div
        data-slot="cron-editor"
        data-disabled={disabled || undefined}
        data-invalid={!parsed.valid || undefined}
        className={cn('grid w-full gap-4', disabled && 'opacity-60', className)}
        {...props}
      >
        {children}
      </div>
    </CronEditorContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*  Presets                                                                   */
/* -------------------------------------------------------------------------- */

export interface CronPreset {
  label: string;
  value: string;
}

export const CRON_PRESETS: readonly CronPreset[] = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Hourly', value: '0 * * * *' },
  { label: 'Daily', value: '0 0 * * *' },
  { label: 'Weekly', value: '0 0 * * 1' },
  { label: 'Monthly', value: '0 0 1 * *' },
];

interface CronEditorPresetsProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  presets?: readonly CronPreset[];
}

const CronEditorPresets = ({ presets = CRON_PRESETS, className, ...props }: CronEditorPresetsProps) => {
  const ctx = useCronEditor();
  const current = ctx.value.trim().replace(/\s+/g, ' ');
  return (
    <div
      role="group"
      aria-label="Presets"
      data-slot="cron-editor-presets"
      className={cn('flex flex-wrap gap-1.5', className)}
      {...props}
    >
      {presets.map((p) => {
        const active = current === p.value;
        return (
          <Button
            key={p.value}
            type="button"
            variant={active ? 'default' : 'outline'}
            size="xs"
            aria-pressed={active}
            disabled={ctx.disabled}
            data-slot="cron-editor-preset"
            data-active={active || undefined}
            onClick={() => ctx.setValue(p.value)}
            className="rounded-full"
          >
            {p.label}
          </Button>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Fields                                                                    */
/* -------------------------------------------------------------------------- */

const DEFAULT_FIELD_LABELS: Record<CronField, string> = {
  minute: 'Minute',
  hour: 'Hour',
  dayOfMonth: 'Day of month',
  month: 'Month',
  dayOfWeek: 'Day of week',
};

const DEFAULT_MODE_LABELS: Record<CronFieldMode, string> = {
  every: 'Every',
  specific: 'Specific',
  step: 'Every N',
};

const optionLabel = (field: CronField, n: number): string => {
  if (field === 'month') return MONTH_NAMES[n - 1].slice(0, 3);
  if (field === 'dayOfWeek') return DAY_NAMES[n].slice(0, 3);
  return String(n);
};

interface CronEditorFieldsProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  fields?: readonly CronField[];
  labels?: Partial<Record<CronField, string>>;
  modeLabels?: Partial<Record<CronFieldMode, string>>;
}

const CronEditorFields = ({ fields = CRON_FIELDS, labels, modeLabels, className, ...props }: CronEditorFieldsProps) => {
  const fieldLabels = { ...DEFAULT_FIELD_LABELS, ...labels };
  const modes = { ...DEFAULT_MODE_LABELS, ...modeLabels };

  return (
    <div
      data-slot="cron-editor-fields"
      className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-3', className)}
      {...props}
    >
      {fields.map((field) => (
        <CronEditorField key={field} field={field} label={fieldLabels[field]} modeLabels={modes} />
      ))}
    </div>
  );
};

interface CronEditorFieldProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  field: CronField;
  label?: string;
  modeLabels?: Record<CronFieldMode, string>;
}

const CronEditorField = ({
  field,
  label = DEFAULT_FIELD_LABELS[field],
  modeLabels = DEFAULT_MODE_LABELS,
  className,
  ...props
}: CronEditorFieldProps) => {
  const ctx = useCronEditor();
  const state = ctx.parsed.fields[field];
  const { min, max } = FIELD_RANGE[field];
  const invalid = ctx.parsed.errorField === field;
  const selectId = `${ctx.id}-${field}`;
  const options = rangeList(min, max);
  const selected = new Set(state.values);

  const toggleValue = (n: number) => {
    const next = selected.has(n) ? state.values.filter((v) => v !== n) : [...state.values, n];
    ctx.setField(field, { mode: 'specific', values: next });
  };

  return (
    <Field
      data-slot="cron-editor-field"
      data-field={field}
      data-mode={state.mode}
      data-invalid={invalid || undefined}
      className={cn('gap-2 rounded-md border border-border bg-card p-3', invalid && 'border-destructive/60', className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <FieldLabel
          htmlFor={selectId}
          className="font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-muted-foreground"
        >
          {label}
        </FieldLabel>
        <span className="font-mono text-[11px] text-foreground">{state.raw}</span>
      </div>
      <div className="flex items-center gap-2">
        <NativeSelect
          id={selectId}
          size="sm"
          value={state.mode}
          disabled={ctx.disabled}
          aria-invalid={invalid || undefined}
          data-slot="cron-editor-field-mode"
          className="text-xs"
          onChange={(e) => {
            const mode = e.target.value as CronFieldMode;
            if (mode === 'every') ctx.setField(field, { mode });
            else if (mode === 'step') {
              ctx.setField(field, {
                mode,
                step: state.step > 1 ? state.step : field === 'minute' ? 15 : 2,
              });
            } else {
              ctx.setField(field, {
                mode,
                values: state.values.length > 0 ? state.values : [min],
              });
            }
          }}
        >
          <NativeSelectOption value="every">{modeLabels.every}</NativeSelectOption>
          <NativeSelectOption value="specific">{modeLabels.specific}</NativeSelectOption>
          <NativeSelectOption value="step">{modeLabels.step}</NativeSelectOption>
        </NativeSelect>
        {state.mode === 'step' && (
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            max={max}
            value={state.step}
            disabled={ctx.disabled}
            aria-label={`${label} interval`}
            data-slot="cron-editor-field-step"
            dir="ltr"
            className="h-8 w-16 font-mono text-xs"
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n) && n >= 1) {
                ctx.setField(field, { mode: 'step', step: Math.min(n, max) });
              }
            }}
          />
        )}
      </div>
      {state.mode === 'specific' && (
        <div
          role="group"
          aria-label={`${label} values`}
          data-slot="cron-editor-field-values"
          className={cn(
            'grid gap-1',
            field === 'minute' || field === 'hour' || field === 'dayOfMonth'
              ? 'grid-cols-8'
              : field === 'month'
                ? 'grid-cols-6'
                : 'grid-cols-7',
          )}
        >
          {options.map((n) => {
            const on = selected.has(n);
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                disabled={ctx.disabled}
                onClick={() => toggleValue(n)}
                data-slot="cron-editor-field-value"
                data-active={on || undefined}
                className={cn(
                  'h-6 rounded-sm border border-transparent font-mono text-[10px] text-muted-foreground transition-colors outline-none',
                  'hover:bg-accent hover:text-foreground',
                  'focus-visible:ring-2 focus-visible:ring-ring',
                  on && 'bg-foreground text-background hover:bg-foreground hover:text-background',
                )}
              >
                {optionLabel(field, n)}
              </button>
            );
          })}
        </div>
      )}
    </Field>
  );
};

/* -------------------------------------------------------------------------- */
/*  Expression                                                                */
/* -------------------------------------------------------------------------- */

interface CronEditorExpressionProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  label?: string;
  placeholder?: string;
  showError?: boolean;
}

const CronEditorExpression = ({
  label = 'Expression',
  placeholder = '* * * * *',
  showError = true,
  className,
  ...props
}: CronEditorExpressionProps) => {
  const ctx = useCronEditor();
  const inputId = `${ctx.id}-expression`;
  const errorId = `${ctx.id}-expression-error`;
  const invalid = !ctx.parsed.valid;

  return (
    <Field
      data-slot="cron-editor-expression"
      data-invalid={invalid || undefined}
      className={cn('gap-1.5', className)}
      {...props}
    >
      <FieldLabel
        htmlFor={inputId}
        className="font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-muted-foreground"
      >
        {label}
      </FieldLabel>
      <Input
        id={inputId}
        dir="ltr"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder={placeholder}
        value={ctx.value}
        disabled={ctx.disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        data-slot="cron-editor-expression-input"
        className="font-mono tracking-[0.08em]"
        onChange={(e) => ctx.setValue(e.target.value)}
      />
      {showError && invalid && (
        <FieldError id={errorId} data-slot="cron-editor-expression-error" className="text-[11px]">
          {ctx.parsed.error}
        </FieldError>
      )}
    </Field>
  );
};

/* -------------------------------------------------------------------------- */
/*  Preview                                                                   */
/* -------------------------------------------------------------------------- */

interface CronEditorPreviewProps extends Omit<React.ComponentProps<'p'>, 'children'> {
  /** Override the sentence. Defaults to `describeCron`. */
  describe?: (parsed: ParsedCron, expression: string) => React.ReactNode;
}

const CronEditorPreview = ({ describe, className, ...props }: CronEditorPreviewProps) => {
  const ctx = useCronEditor();
  const text = describe ? describe(ctx.parsed, ctx.value) : describeCron(ctx.value);
  return (
    <p
      data-slot="cron-editor-preview"
      aria-live="polite"
      className={cn('text-sm text-foreground', !ctx.parsed.valid && 'text-destructive', className)}
      {...props}
    >
      {text}
    </p>
  );
};

/* -------------------------------------------------------------------------- */
/*  Next runs                                                                 */
/* -------------------------------------------------------------------------- */

const subscribeMinute = (onChange: () => void) => {
  const id = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(id);
};

const getMinuteStamp = () => {
  return Math.floor(Date.now() / 60_000);
};

const getServerMinuteStamp = () => {
  return 0;
};

interface CronEditorNextRunsProps extends Omit<React.ComponentProps<'ol'>, 'children'> {
  count?: number;
  locale?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
  emptyLabel?: string;
}

const CronEditorNextRuns = ({
  count = 3,
  locale,
  formatOptions,
  emptyLabel = 'No upcoming runs.',
  className,
  ...props
}: CronEditorNextRunsProps) => {
  const ctx = useCronEditor();
  const stamp = React.useSyncExternalStore(subscribeMinute, getMinuteStamp, getServerMinuteStamp);

  const runs = React.useMemo(() => {
    if (stamp === 0 || !ctx.parsed.valid) return [];
    return nextCronRuns(ctx.value, count, new Date(stamp * 60_000));
  }, [stamp, ctx.parsed.valid, ctx.value, count]);

  const formatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(
        locale,
        formatOptions ?? {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        },
      ),
    [locale, formatOptions],
  );

  return (
    <ol data-slot="cron-editor-next-runs" className={cn('grid gap-1 font-mono text-[11px]', className)} {...props}>
      {runs.length === 0 ? (
        <li className="text-muted-foreground">{emptyLabel}</li>
      ) : (
        runs.map((d, i) => (
          <li key={d.getTime()} data-slot="cron-editor-next-run" className="flex items-center gap-2 text-foreground">
            <span className="w-4 text-muted-foreground">{i + 1}.</span>
            <time dateTime={d.toISOString()}>{formatter.format(d)}</time>
          </li>
        ))
      )}
    </ol>
  );
};

export {
  CronEditor,
  CronEditorPresets,
  CronEditorFields,
  CronEditorField,
  CronEditorExpression,
  CronEditorPreview,
  CronEditorNextRuns,
};
