'use client';

import * as React from 'react';
import { Clock, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/registry/hirael/bases/base/ui/tabs';

export interface TimeValue {
  hour: number;
  minute: number;
  second?: number;
}

export type TimeFormat = '12h' | '24h';

export interface MeridiemLabels {
  am: string;
  pm: string;
}

const DEFAULT_MERIDIEM_LABELS: MeridiemLabels = { am: 'AM', pm: 'PM' };

interface TimePickerContextValue {
  value: TimeValue | null;
  setValue: (v: TimeValue) => void;
  clearValue: () => void;
  clearable: boolean;
  format: TimeFormat;
  meridiemLabels: MeridiemLabels;
  showSeconds: boolean;
  minuteStep: number;
  secondStep: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
}

const TimePickerContext = React.createContext<TimePickerContextValue | null>(null);

const useTimePicker = () => {
  const ctx = React.useContext(TimePickerContext);
  if (!ctx) {
    throw new Error('TimePicker compound components must be used inside <TimePicker>');
  }

  return ctx;
};

const pad2 = (n: number) => {
  return n.toString().padStart(2, '0');
};

export interface TimePickerProps {
  value?: TimeValue | null;
  defaultValue?: TimeValue;
  /** Reports every change, including `null` when the value is cleared. */
  onValueChange?: (v: TimeValue | null) => void;
  /** Side-effect hook for the clear button. State still arrives via `onValueChange`. */
  onClear?: () => void;
  clearable?: boolean;
  format?: TimeFormat;
  /** Labels for the 12-hour clock halves, in the trigger and the AM/PM switch. */
  meridiemLabels?: MeridiemLabels;
  showSeconds?: boolean;
  minuteStep?: number;
  secondStep?: number;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const TimePicker = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  onClear,
  clearable = false,
  format = '24h',
  meridiemLabels = DEFAULT_MERIDIEM_LABELS,
  showSeconds = false,
  minuteStep = 1,
  secondStep = 1,
  disabled,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: TimePickerProps) => {
  const [openInternal, setOpenInternal] = React.useState(defaultOpen);
  const open = openProp !== undefined ? openProp : openInternal;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenInternal(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const [internal, setInternal] = React.useState<TimeValue | null>(defaultValue ?? null);
  const value = valueProp !== undefined ? valueProp : internal;

  const setValue = React.useCallback(
    (next: TimeValue) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const clearValue = React.useCallback(() => {
    if (valueProp === undefined) setInternal(null);
    onValueChange?.(null);
    onClear?.();
  }, [valueProp, onValueChange, onClear]);

  const ctx = React.useMemo<TimePickerContextValue>(
    () => ({
      value,
      setValue,
      clearValue,
      clearable,
      format,
      meridiemLabels,
      showSeconds,
      minuteStep,
      secondStep,
      open,
      setOpen,
      disabled,
    }),
    [
      value,
      setValue,
      clearValue,
      clearable,
      format,
      meridiemLabels,
      showSeconds,
      minuteStep,
      secondStep,
      open,
      setOpen,
      disabled,
    ],
  );

  return (
    <TimePickerContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </TimePickerContext.Provider>
  );
};

const formatTimeValue = (v: TimeValue, format: TimeFormat, showSeconds: boolean, labels: MeridiemLabels) => {
  const tail = showSeconds ? `:${pad2(v.second ?? 0)}` : '';
  if (format === '24h') {
    return `${pad2(v.hour)}:${pad2(v.minute)}${tail}`;
  }
  const meridiem = v.hour >= 12 ? labels.pm : labels.am;
  const h12 = ((v.hour + 11) % 12) + 1;

  return `${pad2(h12)}:${pad2(v.minute)}${tail} ${meridiem}`;
};

const TimePickerTrigger = ({
  placeholder = 'Pick a time',
  className,
  children,
  ...props
}: Omit<React.ComponentProps<'button'>, 'children'> & {
  placeholder?: string;
  children?: React.ReactNode;
}) => {
  const ctx = useTimePicker();
  const label = ctx.value ? formatTimeValue(ctx.value, ctx.format, ctx.showSeconds, ctx.meridiemLabels) : null;

  return (
    <PopoverTrigger
      render={
        <button
          type="button"
          disabled={ctx.disabled}
          data-slot="time-picker-trigger"
          className={cn(
            'inline-flex h-9 w-full items-center gap-2 rounded-sm border border-input bg-transparent px-3 text-start font-mono text-sm tabular-nums transition-colors outline-none',
            'hover:border-ring/60 focus-visible:border-ring data-popup-open:border-ring',
            !ctx.value && 'font-sans text-muted-foreground',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />
      }
    >
      <Clock className="size-3.5 shrink-0 text-muted-foreground" />
      <span data-slot="time-picker-trigger-label" className="flex-1 truncate">
        {children ?? label ?? placeholder}
      </span>
    </PopoverTrigger>
  );
};

interface ScrollColumnProps {
  values: number[];
  selected?: number;
  onSelect: (n: number) => void;
  ariaLabel: string;
}

const ScrollColumn = ({ values, selected, onSelect, ariaLabel }: ScrollColumnProps) => {
  const listRef = React.useRef<HTMLDivElement>(null);

  const displayValues = React.useMemo(() => {
    if (selected === undefined || values.includes(selected)) return values;

    return [...values, selected].sort((a, b) => a - b);
  }, [values, selected]);

  const tabbableValue = selected ?? displayValues[0];

  // Scroll only this column; scrollIntoView would also scroll the page and any scrollable ancestor.
  React.useEffect(() => {
    const list = listRef.current;
    if (selected === undefined || !list) return;
    const el = list.querySelector<HTMLButtonElement>(`[data-val="${selected}"]`);
    if (!el) return;
    list.scrollTo({ top: el.offsetTop - (list.clientHeight - el.offsetHeight) / 2, behavior: 'instant' });
  }, [selected]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number;
    switch (e.key) {
      case 'ArrowDown':
        nextIndex = Math.min(displayValues.length - 1, index + 1);
        break;
      case 'ArrowUp':
        nextIndex = Math.max(0, index - 1);
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = displayValues.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const n = displayValues[nextIndex];
    onSelect(n);
    listRef.current?.querySelector<HTMLButtonElement>(`[data-val="${n}"]`)?.focus();
  };

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label={ariaLabel}
      data-slot="time-picker-column"
      className="relative h-40 w-14 snap-y snap-mandatory [scrollbar-width:none] overflow-y-auto scroll-smooth rounded-sm border border-input bg-card [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex flex-col items-stretch py-16">
        {displayValues.map((n, index) => {
          const active = n === selected;

          return (
            <button
              key={n}
              type="button"
              role="option"
              aria-selected={active}
              data-val={n}
              data-slot="time-picker-option"
              tabIndex={n === tabbableValue ? 0 : -1}
              onClick={() => onSelect(n)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'h-8 snap-center text-center font-mono text-sm tabular-nums transition-colors outline-none',
                'hover:bg-accent',
                'focus-visible:bg-accent',
                active ? 'font-semibold text-foreground' : 'text-muted-foreground',
              )}
            >
              {pad2(n)}
            </button>
          );
        })}
      </div>
      <div
        aria-hidden
        data-slot="time-picker-column-highlight"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 border-y border-primary/40 bg-primary/5"
      />
    </div>
  );
};

const TimePickerContent = ({ className, ...props }: React.ComponentProps<typeof PopoverContent>) => {
  const ctx = useTimePicker();
  const isAM = (ctx.value?.hour ?? 0) < 12;
  const baseValue: TimeValue = ctx.value ?? {
    hour: 0,
    minute: 0,
    second: ctx.showSeconds ? 0 : undefined,
  };

  const hourValues = React.useMemo(() => {
    if (ctx.format === '24h') {
      return Array.from({ length: 24 }, (_, i) => i);
    }

    return Array.from({ length: 12 }, (_, i) => i + 1);
  }, [ctx.format]);

  const minuteValues = React.useMemo(() => {
    const step = Math.max(1, ctx.minuteStep);
    const count = Math.ceil(60 / step);

    return Array.from({ length: count }, (_, i) => i * step);
  }, [ctx.minuteStep]);

  const secondValues = React.useMemo(() => {
    const step = Math.max(1, ctx.secondStep);
    const count = Math.ceil(60 / step);

    return Array.from({ length: count }, (_, i) => i * step);
  }, [ctx.secondStep]);

  const displayHour = ctx.value
    ? ctx.format === '24h'
      ? ctx.value.hour
      : ((ctx.value.hour + 11) % 12) + 1
    : undefined;

  const setHour = (h: number) => {
    let nextHour: number;
    if (ctx.format === '24h') {
      nextHour = h;
    } else {
      const base = h === 12 ? 0 : h;
      nextHour = isAM ? base : base + 12;
    }
    ctx.setValue({ ...baseValue, hour: nextHour });
  };

  const setMinute = (m: number) => {
    ctx.setValue({ ...baseValue, minute: m });
  };

  const setSecond = (s: number) => {
    ctx.setValue({ ...baseValue, second: s });
  };

  const setMeridiem = (next: 'AM' | 'PM') => {
    if ((next === 'AM' && isAM) || (next === 'PM' && !isAM)) return;
    const base = baseValue.hour % 12;
    ctx.setValue({ ...baseValue, hour: next === 'AM' ? base : base + 12 });
  };

  return (
    <PopoverContent align="start" data-slot="time-picker-content" className={cn('w-auto p-3', className)} {...props}>
      <div data-slot="time-picker-columns" className="flex items-stretch gap-2">
        <ScrollColumn values={hourValues} selected={displayHour} onSelect={setHour} ariaLabel="Hour" />
        <span aria-hidden className="flex items-center font-mono text-sm text-muted-foreground">
          :
        </span>
        <ScrollColumn values={minuteValues} selected={ctx.value?.minute} onSelect={setMinute} ariaLabel="Minute" />
        {ctx.showSeconds && (
          <>
            <span aria-hidden className="flex items-center font-mono text-sm text-muted-foreground">
              :
            </span>
            <ScrollColumn
              values={secondValues}
              selected={ctx.value ? (ctx.value.second ?? 0) : undefined}
              onSelect={setSecond}
              ariaLabel="Second"
            />
          </>
        )}
      </div>
      {ctx.format === '12h' && (
        <Tabs value={isAM ? 'AM' : 'PM'} onValueChange={(v) => setMeridiem(v as 'AM' | 'PM')} className="mt-3">
          <TabsList className="w-full">
            <TabsTrigger value="AM" className="text-xs uppercase">
              {ctx.meridiemLabels.am}
            </TabsTrigger>
            <TabsTrigger value="PM" className="text-xs uppercase">
              {ctx.meridiemLabels.pm}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      {ctx.clearable && ctx.value && (
        <div data-slot="time-picker-content-footer" className="mt-3 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            data-slot="time-picker-clear"
            onClick={() => ctx.clearValue()}
            className="text-xs font-normal uppercase"
          >
            <X className="size-3" />
            Clear
          </Button>
        </div>
      )}
    </PopoverContent>
  );
};

export { TimePicker, TimePickerTrigger, TimePickerContent };
