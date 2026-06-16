// Shared, dependency-free date helpers for the calendar grids in date-picker
// and date-range-picker. Pure functions only — no React, no DOM — so both
// pickers compute month grids and keyboard navigation from one source.

/** Midnight of the given date, dropping the time component. */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** True when both dates fall on the same calendar day. */
export function sameDay(
  a: Date | null | undefined,
  b: Date | null | undefined,
): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

/** Add months, clamping the day to the target month's length. */
export function addMonthsClamped(d: Date, n: number): Date {
  const y = d.getFullYear();
  const m = d.getMonth() + n;
  const last = new Date(y, m + 1, 0).getDate();
  return new Date(y, m, Math.min(d.getDate(), last));
}

/** Absolute month ordinal, for cheap month comparison across years. */
export function monthIndex(d: Date): number {
  return d.getFullYear() * 12 + d.getMonth();
}

/**
 * The 7-column grid for a month: leading/trailing blanks are `null` so a
 * caller can render fixed-width weeks.
 */
export function monthCells(month: Date, weekStartsOn: 0 | 1): (Date | null)[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const count = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let day = 1; day <= count; day++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/** Clamp a date into the inclusive [min, max] day bounds, if provided. */
export function clampDate(d: Date, min?: Date, max?: Date): Date {
  if (min && d.getTime() < startOfDay(min).getTime()) return startOfDay(min);
  if (max && d.getTime() > startOfDay(max).getTime()) return startOfDay(max);
  return d;
}

/**
 * Map a grid-navigation key to the date it should move focus to, or `null`
 * for keys the grid doesn't handle. `forward` is +1 for LTR and -1 for RTL so
 * ArrowLeft/Right mirror; PageUp/Down step a month, with Shift a year.
 */
export function gridKeyToDate(
  key: string,
  d: Date,
  opts: { weekStartsOn: 0 | 1; shiftKey: boolean; forward: 1 | -1 },
): Date | null {
  const { weekStartsOn, shiftKey, forward } = opts;
  const dow = (d.getDay() - weekStartsOn + 7) % 7;
  switch (key) {
    case "ArrowLeft":
      return addDays(d, -forward);
    case "ArrowRight":
      return addDays(d, forward);
    case "ArrowUp":
      return addDays(d, -7);
    case "ArrowDown":
      return addDays(d, 7);
    case "Home":
      return addDays(d, -dow);
    case "End":
      return addDays(d, 6 - dow);
    case "PageUp":
      return addMonthsClamped(d, shiftKey ? -12 : -1);
    case "PageDown":
      return addMonthsClamped(d, shiftKey ? 12 : 1);
    default:
      return null;
  }
}
