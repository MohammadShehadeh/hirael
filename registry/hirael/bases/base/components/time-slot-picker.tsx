'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Calendar } from '@/registry/hirael/bases/base/ui/calendar';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

export interface TimeSlot {
  /** When the slot starts. */
  start: Date;
  /** Shown but can't be picked, like a slot someone already booked. */
  unavailable?: boolean;
}

interface TimeSlotPickerContextValue {
  day: Date | undefined;
  setDay: (day: Date | undefined) => void;
  value: Date | undefined;
  setValue: (value: Date | undefined) => void;
  getSlots: (day: Date) => TimeSlot[];
  locale: string;
  hour12?: boolean;
}

const TimeSlotPickerContext = React.createContext<TimeSlotPickerContextValue | null>(null);

const useTimeSlotPicker = () => {
  const ctx = React.useContext(TimeSlotPickerContext);
  if (!ctx) {
    throw new Error('TimeSlotPicker compound parts must be used inside <TimeSlotPicker>');
  }

  return ctx;
};

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export interface TimeSlotPickerProps extends Omit<React.ComponentProps<'div'>, 'defaultValue'> {
  /** Slots offered on a day. A day with none, or only unavailable ones, is disabled in the calendar. */
  getSlots: (day: Date) => TimeSlot[];
  /** The picked slot's start. */
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
  /** The day whose slots are listed. */
  day?: Date;
  defaultDay?: Date;
  onDayChange?: (day: Date | undefined) => void;
  /** BCP 47 tag for times and the day heading. Defaults to `en-US` so server and client render the same text. */
  locale?: string;
  /** Force a 12- or 24-hour clock. Follows the locale when left out. */
  hour12?: boolean;
}

const TimeSlotPicker = ({
  getSlots,
  value: valueProp,
  defaultValue,
  onValueChange,
  day: dayProp,
  defaultDay,
  onDayChange,
  locale = 'en-US',
  hour12,
  className,
  ...props
}: TimeSlotPickerProps) => {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const [day, setDay] = useControllableState({
    prop: dayProp,
    defaultProp: defaultDay ?? defaultValue,
    onChange: onDayChange,
  });

  const ctx = React.useMemo<TimeSlotPickerContextValue>(
    () => ({ day, setDay, value, setValue, getSlots, locale, hour12 }),
    [day, setDay, value, setValue, getSlots, locale, hour12],
  );

  return (
    <TimeSlotPickerContext.Provider value={ctx}>
      <div
        data-slot="time-slot-picker"
        className={cn('flex flex-col gap-4 sm:flex-row sm:items-start', className)}
        {...props}
      />
    </TimeSlotPickerContext.Provider>
  );
};

type TimeSlotPickerCalendarProps = Omit<
  React.ComponentProps<typeof Calendar>,
  'mode' | 'selected' | 'onSelect' | 'required'
>;

/** The calendar half. Days without a free slot are disabled; takes the calendar's other props. */
const TimeSlotPickerCalendar = ({ disabled, ...props }: TimeSlotPickerCalendarProps) => {
  const { day, setDay, setValue, value, getSlots } = useTimeSlotPicker();
  const noSlots = (date: Date) => !getSlots(date).some((slot) => !slot.unavailable);

  return (
    <Calendar
      mode="single"
      selected={day}
      defaultMonth={day}
      onSelect={(next) => {
        setDay(next);
        if (value && next && !sameDay(value, next)) setValue(undefined);
      }}
      disabled={disabled ? [noSlots, ...(Array.isArray(disabled) ? disabled : [disabled])] : noSlots}
      {...props}
    />
  );
};

export interface TimeSlotPickerSlotsProps extends React.ComponentProps<'div'> {
  /** Shown before a day is picked. */
  placeholder?: React.ReactNode;
  /** Accessible name of the group of times. */
  label?: string;
}

/** The times on the picked day, as a single-choice grid. Arrow keys move between free slots. */
const TimeSlotPickerSlots = ({
  placeholder = 'Pick a day to see times',
  label = 'Available times',
  className,
  ...props
}: TimeSlotPickerSlotsProps) => {
  const { day, value, setValue, getSlots, locale, hour12 } = useTimeSlotPicker();
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const slots = day ? getSlots(day) : [];
  const timeFormat = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', hour12 });
  const heading = day
    ? new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric' }).format(day)
    : null;
  const selectedIndex = slots.findIndex((slot) => value && slot.start.getTime() === value.getTime());
  const tabbable = selectedIndex >= 0 ? selectedIndex : slots.findIndex((slot) => !slot.unavailable);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const dir = rtl && (event.key === 'ArrowLeft' || event.key === 'ArrowRight') ? -step : step;
    for (let i = index + dir; i >= 0 && i < slots.length; i += dir) {
      if (slots[i].unavailable) continue;
      setValue(slots[i].start);
      refs.current[i]?.focus();
      break;
    }
  };

  return (
    <div
      data-slot="time-slot-picker-slots"
      className={cn('grid min-w-0 flex-1 content-start gap-3', className)}
      {...props}
    >
      {heading && <p className="text-sm font-medium">{heading}</p>}
      {!day ? (
        <p className="text-sm text-muted-foreground">{placeholder}</p>
      ) : (
        <div
          role="radiogroup"
          aria-label={label}
          className="grid max-h-72 grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2 overflow-y-auto p-0.5"
        >
          {slots.map((slot, index) => {
            const checked = index === selectedIndex;

            return (
              <button
                key={slot.start.getTime()}
                ref={(node) => {
                  refs.current[index] = node;
                }}
                type="button"
                role="radio"
                aria-checked={checked}
                disabled={slot.unavailable}
                tabIndex={index === tabbable ? 0 : -1}
                data-slot="time-slot"
                data-state={checked ? 'checked' : 'unchecked'}
                onClick={() => setValue(slot.start)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={cn(
                  'h-9 rounded-md border border-border text-sm tabular-nums transition-colors outline-none',
                  'hover:border-primary/60 hover:bg-primary/5 focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  'disabled:pointer-events-none disabled:text-muted-foreground disabled:line-through disabled:opacity-60',
                  'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
                )}
              >
                <span dir="auto">{timeFormat.format(slot.start)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { TimeSlotPicker, TimeSlotPickerCalendar, TimeSlotPickerSlots, useTimeSlotPicker };
