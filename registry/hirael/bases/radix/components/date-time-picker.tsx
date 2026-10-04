'use client';

import * as React from 'react';
import { CalendarClock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Calendar } from '@/registry/hirael/bases/radix/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

export type DateTimeFormat = '12h' | '24h';

interface DateTimePickerContextValue {
  value: Date | undefined;
  setValue: (value: Date | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  format: DateTimeFormat;
  minuteStep: number;
  locale: string;
  disabled?: boolean;
}

const DateTimePickerContext = React.createContext<DateTimePickerContextValue | null>(null);

const useDateTimePicker = () => {
  const ctx = React.useContext(DateTimePickerContext);
  if (!ctx) {
    throw new Error('DateTimePicker compound parts must be used inside <DateTimePicker>');
  }

  return ctx;
};

export interface DateTimePickerProps {
  value?: Date;
  defaultValue?: Date;
  /** Fires when the day, hour, minute or half of day changes. */
  onValueChange?: (value: Date | undefined) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 12-hour clock with an AM/PM column, or 24-hour. */
  format?: DateTimeFormat;
  /** Minutes between options in the minute column. */
  minuteStep?: number;
  /** BCP 47 tag for the trigger label. Defaults to `en-US` so server and client render the same text. */
  locale?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const DateTimePicker = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  format = '24h',
  minuteStep = 5,
  locale = 'en-US',
  disabled,
  children,
}: DateTimePickerProps) => {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useControllableState({ prop: openProp, defaultProp: defaultOpen, onChange: onOpenChange });

  const ctx = React.useMemo<DateTimePickerContextValue>(
    () => ({ value, setValue, open, setOpen, format, minuteStep: Math.max(1, minuteStep), locale, disabled }),
    [value, setValue, open, setOpen, format, minuteStep, locale, disabled],
  );

  return (
    <DateTimePickerContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </DateTimePickerContext.Provider>
  );
};

export interface DateTimePickerTriggerProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  placeholder?: string;
  children?: React.ReactNode;
}

const DateTimePickerTrigger = ({
  placeholder = 'Pick a date and time',
  className,
  children,
  ...props
}: DateTimePickerTriggerProps) => {
  const ctx = useDateTimePicker();
  const formatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(ctx.locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
        hourCycle: ctx.format === '12h' ? 'h12' : 'h23',
      }),
    [ctx.locale, ctx.format],
  );

  return (
    <PopoverTrigger asChild>
      <Button
        type="button"
        variant="outline"
        disabled={ctx.disabled}
        data-slot="date-time-picker-trigger"
        data-empty={!ctx.value || undefined}
        className={cn('w-full justify-start font-normal tabular-nums data-empty:text-muted-foreground', className)}
        {...props}
      >
        <CalendarClock className="text-muted-foreground" />
        <span dir="auto" data-slot="date-time-picker-trigger-label" className="flex-1 truncate text-start">
          {children ?? (ctx.value ? formatter.format(ctx.value) : placeholder)}
        </span>
      </Button>
    </PopoverTrigger>
  );
};

const pad2 = (n: number) => n.toString().padStart(2, '0');

interface TimeColumnProps {
  label: string;
  options: { value: number; label: string }[];
  selected: number | undefined;
  onSelect: (value: number) => void;
}

const TimeColumn = ({ label, options, selected, onSelect }: TimeColumnProps) => {
  const listRef = React.useRef<HTMLDivElement>(null);
  const tabbable = selected ?? options[0]?.value;

  // Scroll only this column; scrollIntoView would also move the page.
  React.useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-value="${selected}"]`);
    if (!list || !el) return;
    list.scrollTo({ top: el.offsetTop - list.clientHeight / 2 + el.offsetHeight / 2, behavior: 'instant' });
  }, [selected]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = options.length - 1;
    const next = ({ ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: last } as Record<string, number>)[
      event.key
    ];
    if (next === undefined) return;
    event.preventDefault();
    const option = options[Math.min(last, Math.max(0, next))];
    onSelect(option.value);
    listRef.current?.querySelector<HTMLButtonElement>(`[data-value="${option.value}"]`)?.focus();
  };

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label={label}
      data-slot="date-time-picker-column"
      className="flex w-14 [scrollbar-width:thin] flex-col gap-0.5 overflow-y-auto overscroll-contain p-1"
    >
      {options.map((option, index) => {
        const active = option.value === selected;

        return (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={active}
            data-value={option.value}
            data-slot="date-time-picker-option"
            tabIndex={option.value === tabbable ? 0 : -1}
            onClick={() => onSelect(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'h-8 shrink-0 rounded-md text-sm tabular-nums transition-colors outline-none',
              'hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50',
              active && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

const DEFAULT_LABELS = { hour: 'Hour', minute: 'Minute', meridiem: 'AM or PM', am: 'AM', pm: 'PM' };

export interface DateTimePickerContentProps extends Omit<
  React.ComponentProps<typeof Calendar>,
  'mode' | 'selected' | 'onSelect' | 'required'
> {
  align?: React.ComponentProps<typeof PopoverContent>['align'];
  /** Column names for screen readers and the AM/PM text. */
  timeLabels?: Partial<typeof DEFAULT_LABELS>;
  /** Time used when a day is picked before any time, as `[hour, minute]`. */
  defaultTime?: [number, number];
}

/** A calendar and hour, minute (and AM/PM) columns side by side. Takes the calendar's props. */
const DateTimePickerContent = ({
  align = 'start',
  timeLabels,
  defaultTime = [9, 0],
  ...calendarProps
}: DateTimePickerContentProps) => {
  const ctx = useDateTimePicker();
  const text = { ...DEFAULT_LABELS, ...timeLabels };
  const twelve = ctx.format === '12h';
  const value = ctx.value;
  const hour = value?.getHours();
  const pm = (hour ?? 0) >= 12;

  const update = (patch: { day?: Date; hour?: number; minute?: number }) => {
    const base = new Date(patch.day ?? value ?? new Date());
    if (!value && !patch.day) base.setHours(defaultTime[0], defaultTime[1], 0, 0);
    if (patch.day) {
      base.setHours(value?.getHours() ?? defaultTime[0], value?.getMinutes() ?? defaultTime[1], 0, 0);
    }
    if (patch.hour !== undefined) base.setHours(patch.hour);
    if (patch.minute !== undefined) base.setMinutes(patch.minute);
    ctx.setValue(base);
  };

  const hourOptions = Array.from({ length: twelve ? 12 : 24 }, (_, i) => {
    const display = twelve ? i + 1 : i;

    return { value: display, label: pad2(display) };
  });
  const minuteOptions = Array.from({ length: Math.ceil(60 / ctx.minuteStep) }, (_, i) => ({
    value: i * ctx.minuteStep,
    label: pad2(i * ctx.minuteStep),
  }));
  const displayHour = hour === undefined ? undefined : twelve ? ((hour + 11) % 12) + 1 : hour;
  const minute = value?.getMinutes();
  // A minute off the step grid (from a typed or server value) still shows as selected.
  if (minute !== undefined && !minuteOptions.some((option) => option.value === minute)) {
    minuteOptions.push({ value: minute, label: pad2(minute) });
    minuteOptions.sort((a, b) => a.value - b.value);
  }

  const setHour = (display: number) => update({ hour: twelve ? (display % 12) + (pm ? 12 : 0) : display });

  return (
    <PopoverContent align={align} data-slot="date-time-picker-content" className="w-auto p-0">
      <div className="flex flex-col sm:h-[19rem] sm:flex-row">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={(day) => day && update({ day })}
          {...calendarProps}
        />
        <div
          data-slot="date-time-picker-time"
          className="flex h-48 border-t border-border sm:h-auto sm:border-s sm:border-t-0"
        >
          <TimeColumn label={text.hour} options={hourOptions} selected={displayHour} onSelect={setHour} />
          <TimeColumn
            label={text.minute}
            options={minuteOptions}
            selected={minute}
            onSelect={(next) => update({ minute: next })}
          />
          {twelve && (
            <TimeColumn
              label={text.meridiem}
              options={[
                { value: 0, label: text.am },
                { value: 1, label: text.pm },
              ]}
              selected={value ? (pm ? 1 : 0) : undefined}
              onSelect={(half) => update({ hour: ((hour ?? defaultTime[0]) % 12) + half * 12 })}
            />
          )}
        </div>
      </div>
    </PopoverContent>
  );
};

export { DateTimePicker, DateTimePickerTrigger, DateTimePickerContent, useDateTimePicker };
