import * as React from 'react';

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Default locale for date labels, so a static export and the visitor's browser format the same way. */
export const DEFAULT_LOCALE = 'en-US';

export const startOfDay = (d: Date): Date => {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export const startOfMonth = (d: Date): Date => {
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

export const sameDay = (a: Date | null | undefined, b: Date | null | undefined): boolean => {
  if (!a || !b) return false;

  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};

export const addDays = (d: Date, n: number): Date => {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
};

export const addMonthsClamped = (d: Date, n: number): Date => {
  const y = d.getFullYear();
  const m = d.getMonth() + n;
  const last = new Date(y, m + 1, 0).getDate();

  return new Date(y, m, Math.min(d.getDate(), last));
};

export const monthIndex = (d: Date): number => {
  return d.getFullYear() * 12 + d.getMonth();
};

export const monthCells = (month: Date, weekStartsOn: WeekStartsOn): (Date | null)[] => {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let day = 1; day <= count; day++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
};

export const clampDate = (d: Date, min?: Date, max?: Date): Date => {
  if (min && d.getTime() < startOfDay(min).getTime()) return startOfDay(min);
  if (max && d.getTime() > startOfDay(max).getTime()) return startOfDay(max);

  return d;
};

export interface DayConstraints {
  min?: Date;
  max?: Date;
  disabledDate?: (d: Date) => boolean;
}

export const isDayDisabled = (d: Date, { min, max, disabledDate }: DayConstraints): boolean => {
  if (min && d.getTime() < startOfDay(min).getTime()) return true;
  if (max && d.getTime() > startOfDay(max).getTime()) return true;

  return disabledDate ? disabledDate(d) : false;
};

/** True when any day from `from` to `to` (inclusive, either order) is disabled. */
export const rangeHasDisabledDay = (from: Date, to: Date, isDisabled: (d: Date) => boolean): boolean => {
  const a = startOfDay(from);
  const b = startOfDay(to);
  const [lo, hi] = a.getTime() <= b.getTime() ? [a, b] : [b, a];
  for (let d = lo; d.getTime() <= hi.getTime(); d = addDays(d, 1)) {
    if (isDisabled(d)) return true;
  }

  return false;
};

/** Disabled days can't take focus, so walk past them in the direction of travel, stopping at min/max. */
export const findFocusableDay = (
  from: Date,
  dir: 1 | -1,
  isDisabled: (d: Date) => boolean,
  min?: Date,
  max?: Date,
): Date | null => {
  let d = from;
  for (let i = 0; i < 366; i++) {
    if (min && d.getTime() < startOfDay(min).getTime()) return null;
    if (max && d.getTime() > startOfDay(max).getTime()) return null;
    if (!isDisabled(d)) return d;
    d = addDays(d, dir);
  }

  return null;
};

/** `forward` is -1 in RTL so ArrowLeft/Right mirror. */
export const gridKeyToDate = (
  key: string,
  d: Date,
  opts: { weekStartsOn: WeekStartsOn; shiftKey: boolean; forward: 1 | -1 },
): Date | null => {
  const { weekStartsOn, shiftKey, forward } = opts;
  const dow = (d.getDay() - weekStartsOn + 7) % 7;
  switch (key) {
    case 'ArrowLeft':
      return addDays(d, -forward);
    case 'ArrowRight':
      return addDays(d, forward);
    case 'ArrowUp':
      return addDays(d, -7);
    case 'ArrowDown':
      return addDays(d, 7);
    case 'Home':
      return addDays(d, -dow);
    case 'End':
      return addDays(d, 6 - dow);
    case 'PageUp':
      return addMonthsClamped(d, shiftKey ? -12 : -1);
    case 'PageDown':
      return addMonthsClamped(d, shiftKey ? 12 : 1);
    default:
      return null;
  }
};

const subscribeToday = () => () => {};
const getTodaySnapshot = () => startOfDay(new Date()).getTime();
const getServerTodaySnapshot = () => null;

/** Today differs between a static-export build and the visitor, so it is `null` on the server and during hydration. */
export const useToday = (): Date | null => {
  const time = React.useSyncExternalStore(subscribeToday, getTodaySnapshot, getServerTodaySnapshot);

  return React.useMemo(() => (time === null ? null : new Date(time)), [time]);
};
