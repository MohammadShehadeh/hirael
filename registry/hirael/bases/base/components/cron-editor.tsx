'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Cron } from 'croner';
import cronstrue from 'cronstrue';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Field, FieldError, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { NativeSelect, NativeSelectOption } from '@/registry/hirael/bases/base/ui/native-select';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

export type CronField = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek';

const CRON_FIELD_MODES = ['every', 'specific', 'step'] as const;

export type CronFieldMode = (typeof CRON_FIELD_MODES)[number];

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

interface FieldRange {
  min: number;
  max: number;
}

const FIELD_RANGE: Record<CronField, FieldRange> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 6 },
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const FIELD_ALIASES: Partial<Record<CronField, string[]>> = {
  month: MONTH_NAMES.map((name) => name.toUpperCase()),
  dayOfWeek: DAY_NAMES.map((name) => name.toUpperCase()),
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

type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

// Day-of-week 7 is Sunday; keep it as 7 while bounding so `5-7` is not read as backwards.
const parseBound = (token: string, field: CronField) =>
  field === 'dayOfWeek' && /^\d+$/.test(token) && Number(token) === 7 ? 7 : parseNumber(token, field);

const parseBounds = (part: string, base: string, hasStep: boolean, field: CronField): Parsed<FieldRange> => {
  const { min, max } = FIELD_RANGE[field];
  if (base === '*') return { ok: true, value: { min, max } };

  if (base.includes('-')) {
    const [a, b] = base.split('-');
    const lo = parseBound(a, field);
    const hi = parseBound(b, field);
    if (lo === null || hi === null) return { ok: false, error: `Cannot read "${part}"` };
    if (lo > hi) return { ok: false, error: `Range is backwards: "${part}"` };

    return { ok: true, value: { min: lo, max: hi } };
  }

  const n = parseNumber(base, field);
  if (n === null) return { ok: false, error: `Cannot read "${part}"` };

  return { ok: true, value: { min: n, max: hasStep ? max : n } };
};

const parseField = (raw: string, field: CronField): Parsed<CronFieldValue> => {
  const { min, max } = FIELD_RANGE[field];
  const token = raw.trim();
  if (token === '*') return { ok: true, value: everyField(field) };

  const stepMatch = /^\*\/(\d+)$/.exec(token);
  if (stepMatch) {
    const step = Number(stepMatch[1]);
    if (step < 1 || step > max) return { ok: false, error: `Step out of range: ${token}` };

    return { ok: true, value: { mode: 'step', values: [], step, allowed: rangeList(min, max, step), raw: token } };
  }

  const allowed = new Set<number>();
  for (const part of token.split(',')) {
    if (part === '') return { ok: false, error: `Empty value in "${token}"` };
    const rangeStep = /^([^/]+)(?:\/(\d+))?$/.exec(part);
    if (!rangeStep) return { ok: false, error: `Cannot read "${part}"` };
    const [, base, stepStr] = rangeStep;
    const step = stepStr ? Number(stepStr) : 1;
    if (step < 1) return { ok: false, error: `Step must be at least 1 in "${part}"` };
    const bounds = parseBounds(part, base, Boolean(stepStr), field);
    if (!bounds.ok) return bounds;
    for (let i = bounds.value.min; i <= bounds.value.max; i += step) {
      allowed.add(field === 'dayOfWeek' && i === 7 ? 0 : i);
    }
  }

  const values = Array.from(allowed).sort((a, b) => a - b);

  return { ok: true, value: { mode: 'specific', values, step: 1, allowed: values, raw: token } };
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
    const result = parseField(tokens[i], field);
    if (result.ok) {
      fields[field] = result.value;

      return;
    }
    if (error === null) {
      error = result.error;
      errorField = field;
    }
  });

  return { valid: error === null, error, errorField, fields };
};

// Three or more consecutive values read better as a range: `1,2,3,4,5` -> `1-5`.
const compactRuns = (values: number[]): string => {
  const parts: string[] = [];
  let i = 0;
  while (i < values.length) {
    let j = i;
    while (j + 1 < values.length && values[j + 1] === values[j] + 1) j++;
    parts.push(j - i >= 2 ? `${values[i]}-${values[j]}` : values.slice(i, j + 1).join(','));
    i = j + 1;
  }

  return parts.join(',');
};

export const formatCronField = (field: Pick<CronFieldValue, 'mode' | 'values' | 'step'>): string => {
  if (field.mode === 'every') return '*';
  if (field.mode === 'step') return `*/${Math.max(1, field.step)}`;
  if (field.values.length === 0) return '*';

  return compactRuns(Array.from(new Set(field.values)).sort((a, b) => a - b));
};

export const formatCron = (fields: Record<CronField, Pick<CronFieldValue, 'mode' | 'values' | 'step'>>): string => {
  return CRON_FIELDS.map((f) => formatCronField(fields[f])).join(' ');
};

/**
 * Turn a cron expression into a plain sentence, like "At 09:00, Monday through Friday". `locale` is a
 * cronstrue locale code; load it once with `import 'cronstrue/locales/<code>'`.
 */
export const describeCron = (expression: string, locale?: string): string => {
  const parsed = parseCron(expression);
  if (!parsed.valid) return parsed.error ?? 'Invalid expression';

  return cronstrue.toString(expression, { locale, use24HourTimeFormat: true }).trim();
};

/** Compute the next `count` times the expression fires after `from`, in local time. */
export const nextCronRuns = (expression: string, count = 3, from: Date = new Date()): Date[] => {
  const parsed = parseCron(expression);
  if (!parsed.valid) return [];

  // Vixie cron: a day field starting with `*`, even a stepped one, makes both day fields required.
  const { dayOfMonth, dayOfWeek } = parsed.fields;
  const domAndDow = dayOfMonth.raw.startsWith('*') || dayOfWeek.raw.startsWith('*');

  return new Cron(expression, { domAndDow }).nextRuns(count, from);
};

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
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const parsed = parseCron(value);

  const setField = (field: CronField, patch: Partial<Pick<CronFieldValue, 'mode' | 'values' | 'step'>>) => {
    // Keep the other fields as typed; reformatting them would expand ranges and turn invalid tokens into `*`.
    const tokens = value.trim().split(/\s+/);
    const next = CRON_FIELDS.map((f, i) => {
      if (f === field) return formatCronField({ ...parsed.fields[f], ...patch });

      return tokens.length === CRON_FIELDS.length ? tokens[i] : parsed.fields[f].raw;
    });
    setValue(next.join(' '));
  };

  const ctx: CronEditorContextValue = { id: editorId, value, setValue, parsed, setField, disabled };

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

const cronValuesVariants = cva('grid gap-1', {
  variants: {
    field: {
      minute: 'grid-cols-8',
      hour: 'grid-cols-8',
      dayOfMonth: 'grid-cols-8',
      month: 'grid-cols-6',
      dayOfWeek: 'grid-cols-7',
    },
  },
});

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
  if (field === 'month') return MONTH_NAMES[n - 1];
  if (field === 'dayOfWeek') return DAY_NAMES[n];

  return String(n);
};

interface CronEditorFieldsProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  fields?: readonly CronField[];
  labels?: Partial<Record<CronField, string>>;
  modeLabels?: Partial<Record<CronFieldMode, string>>;
}

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
        <FieldLabel htmlFor={selectId} className="text-xs font-normal text-muted-foreground uppercase">
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
            const mode = CRON_FIELD_MODES.find((option) => option === e.target.value);
            if (!mode) return;
            if (mode === 'every') {
              ctx.setField(field, { mode });

              return;
            }
            if (mode === 'step') {
              const defaultStep = field === 'minute' ? 15 : 2;
              ctx.setField(field, { mode, step: state.step > 1 ? state.step : defaultStep });

              return;
            }
            ctx.setField(field, { mode, values: state.values.length > 0 ? state.values : [min] });
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
            className="h-8 w-16 text-xs tabular-nums"
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isInteger(n) && n >= 1) {
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
          className={cronValuesVariants({ field })}
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
                  'h-6 rounded-sm border border-transparent text-[10px] text-muted-foreground tabular-nums transition-colors outline-none',
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

interface CronEditorExpressionProps extends Omit<
  React.ComponentProps<'input'>,
  'children' | 'value' | 'defaultValue' | 'onChange' | 'id'
> {
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
    <Field data-slot="cron-editor-expression" data-invalid={invalid || undefined} className={cn('gap-1.5', className)}>
      <FieldLabel htmlFor={inputId} className="text-xs font-normal text-muted-foreground uppercase">
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
        {...props}
      />
      {showError && invalid && (
        <FieldError id={errorId} data-slot="cron-editor-expression-error" className="text-[11px]">
          {ctx.parsed.error}
        </FieldError>
      )}
    </Field>
  );
};

interface CronEditorPreviewProps extends Omit<React.ComponentProps<'p'>, 'children'> {
  /** cronstrue locale code for the default sentence; load it once with `import 'cronstrue/locales/<code>'`. */
  locale?: string;
  /** Override the sentence. Defaults to `describeCron`. */
  describe?: (parsed: ParsedCron, expression: string) => React.ReactNode;
}

const CronEditorPreview = ({ locale, describe, className, ...props }: CronEditorPreviewProps) => {
  const ctx = useCronEditor();
  const text = describe ? describe(ctx.parsed, ctx.value) : describeCron(ctx.value, locale);

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
  /** Shown for a valid expression that can never fire, like `0 0 31 2 *`. */
  neverLabel?: string;
}

const CronEditorNextRuns = ({
  count = 3,
  locale,
  formatOptions,
  emptyLabel = 'No upcoming runs.',
  neverLabel = 'This schedule never runs.',
  className,
  ...props
}: CronEditorNextRunsProps) => {
  const ctx = useCronEditor();
  const stamp = React.useSyncExternalStore(subscribeMinute, getMinuteStamp, getServerMinuteStamp);

  const runs = stamp === 0 || !ctx.parsed.valid ? [] : nextCronRuns(ctx.value, count, new Date(stamp * 60_000));

  const formatter = new Intl.DateTimeFormat(
    locale,
    formatOptions ?? {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  );

  return (
    <ol data-slot="cron-editor-next-runs" className={cn('grid gap-1 text-[11px] tabular-nums', className)} {...props}>
      {runs.length === 0 ? (
        <li className="text-muted-foreground">{stamp !== 0 && ctx.parsed.valid ? neverLabel : emptyLabel}</li>
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
