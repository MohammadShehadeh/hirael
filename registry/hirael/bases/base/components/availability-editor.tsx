'use client';

import * as React from 'react';
import { Copy, Plus, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { NativeSelect, NativeSelectOption } from '@/registry/hirael/bases/base/ui/native-select';
import { Switch } from '@/registry/hirael/bases/base/ui/switch';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

/** A span of time within a day, as 24-hour `HH:mm` strings. */
export interface TimeRange {
  start: string;
  end: string;
}

/** Ranges for each weekday, keyed 0 (Sunday) to 6 (Saturday). A day with no ranges is unavailable. */
export type WeeklyAvailability = Record<number, TimeRange[]>;

export interface AvailabilityEditorLabels {
  unavailable: string;
  add: string;
  remove: string;
  copyToAll: string;
  to: string;
  overlap: string;
  order: string;
}

const DEFAULT_LABELS: AvailabilityEditorLabels = {
  unavailable: 'Unavailable',
  add: 'Add hours',
  remove: 'Remove hours',
  copyToAll: 'Copy to all days',
  to: 'to',
  overlap: 'These hours overlap.',
  order: 'End time must be after the start.',
};

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);

  return h * 60 + m;
};

const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60) % 24).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

/** Problems with a day's ranges, by range index: an end before its start, or an overlap with the one before. */
export const validateDay = (ranges: TimeRange[]) => {
  const errors: Record<number, 'order' | 'overlap'> = {};
  ranges.forEach((range, i) => {
    if (toMinutes(range.end) <= toMinutes(range.start)) errors[i] = 'order';
  });
  const sorted = ranges
    .map((range, i) => ({ range, i }))
    .sort((a, b) => toMinutes(a.range.start) - toMinutes(b.range.start));
  for (let k = 1; k < sorted.length; k++) {
    if (toMinutes(sorted[k].range.start) < toMinutes(sorted[k - 1].range.end)) errors[sorted[k].i] ??= 'overlap';
  }

  return errors;
};

export interface AvailabilityEditorProps extends Omit<React.ComponentProps<'div'>, 'defaultValue'> {
  value?: WeeklyAvailability;
  defaultValue?: WeeklyAvailability;
  onValueChange?: (value: WeeklyAvailability) => void;
  /** Minutes between options in the time menus. */
  step?: 15 | 30 | 60;
  /** First row. 0 is Sunday. */
  weekStartsOn?: 0 | 1 | 6;
  /** BCP 47 tag for day names and times. Defaults to `en-US` so server and client render the same text. */
  locale?: string;
  /** Show times on a 12-hour clock. */
  hour12?: boolean;
  /** Hours a day gets when it is switched on or a range is added. */
  defaultRange?: TimeRange;
  labels?: Partial<AvailabilityEditorLabels>;
}

const EMPTY: WeeklyAvailability = {};

/** Weekly working hours: switch days on or off, give each day one or more ranges, and copy a day to the rest. */
const AvailabilityEditor = ({
  value: valueProp,
  defaultValue = EMPTY,
  onValueChange,
  step = 30,
  weekStartsOn = 1,
  locale = 'en-US',
  hour12 = false,
  defaultRange = { start: '09:00', end: '17:00' },
  labels,
  className,
  ...props
}: AvailabilityEditorProps) => {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const text = { ...DEFAULT_LABELS, ...labels };
  const days = Array.from({ length: 7 }, (_, i) => (weekStartsOn + i) % 7);
  const dayName = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });
  const timeName = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', hour12, timeZone: 'UTC' });
  const options = Array.from({ length: (24 * 60) / step }, (_, i) => toTime(i * step));
  const label = (time: string) => {
    const [h, m] = time.split(':').map(Number);

    return timeName.format(new Date(Date.UTC(2026, 0, 4, h, m)));
  };

  const setDay = (day: number, ranges: TimeRange[]) => setValue({ ...value, [day]: ranges });

  const addRange = (day: number) => {
    const ranges = value[day] ?? [];
    const last = ranges.at(-1);
    if (!last) return setDay(day, [defaultRange]);
    // The new range starts an hour after the last one ends, kept inside the day.
    const start = Math.min(toMinutes(last.end) + 60, 24 * 60 - step * 2);
    setDay(day, [...ranges, { start: toTime(start), end: toTime(Math.min(start + 60, 24 * 60 - step)) }]);
  };

  return (
    <div data-slot="availability-editor" className={cn('grid divide-y divide-border', className)} {...props}>
      {days.map((day) => {
        const ranges = value[day] ?? [];
        const enabled = ranges.length > 0;
        const errors = validateDay(ranges);
        const name = dayName.format(new Date(Date.UTC(2026, 0, 4 + day)));

        return (
          <div
            key={day}
            data-slot="availability-editor-day"
            data-enabled={enabled || undefined}
            className="grid gap-3 py-3 sm:grid-cols-[10rem_1fr_auto] sm:items-start"
          >
            <label className="flex h-8 items-center gap-3 text-sm font-medium">
              <Switch checked={enabled} onCheckedChange={(on) => setDay(day, on ? [defaultRange] : [])} />
              {name}
            </label>
            <div className="grid gap-2">
              {!enabled && <p className="flex h-8 items-center text-sm text-muted-foreground">{text.unavailable}</p>}
              {ranges.map((range, index) => (
                <div key={index} className="grid gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <NativeSelect
                      size="sm"
                      aria-label={`${name} ${index + 1}`}
                      aria-invalid={errors[index] ? true : undefined}
                      value={range.start}
                      onChange={(event) =>
                        setDay(
                          day,
                          ranges.map((r, i) => (i === index ? { ...r, start: event.target.value } : r)),
                        )
                      }
                    >
                      {options.map((time) => (
                        <NativeSelectOption key={time} value={time}>
                          {label(time)}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                    <span className="text-xs text-muted-foreground">{text.to}</span>
                    <NativeSelect
                      size="sm"
                      aria-label={`${name} ${index + 1} ${text.to}`}
                      aria-invalid={errors[index] ? true : undefined}
                      value={range.end}
                      onChange={(event) =>
                        setDay(
                          day,
                          ranges.map((r, i) => (i === index ? { ...r, end: event.target.value } : r)),
                        )
                      }
                    >
                      {options.map((time) => (
                        <NativeSelectOption key={time} value={time}>
                          {label(time)}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={text.remove}
                      title={text.remove}
                      onClick={() =>
                        setDay(
                          day,
                          ranges.filter((_, i) => i !== index),
                        )
                      }
                    >
                      <X />
                    </Button>
                  </div>
                  {errors[index] && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors[index] === 'order' ? text.order : text.overlap}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-1 sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`${text.add}: ${name}`}
                title={text.add}
                onClick={() => addRange(day)}
              >
                <Plus />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`${text.copyToAll}: ${name}`}
                title={text.copyToAll}
                disabled={!enabled}
                onClick={() => setValue(Object.fromEntries(days.map((d) => [d, ranges.map((r) => ({ ...r }))])))}
              >
                <Copy />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { AvailabilityEditor };
