export const startOfDay = (d: Date): Date => {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
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

export const monthCells = (month: Date, weekStartsOn: 0 | 1): (Date | null)[] => {
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

/** `forward` is -1 in RTL so ArrowLeft/Right mirror. */
export const gridKeyToDate = (
  key: string,
  d: Date,
  opts: { weekStartsOn: 0 | 1; shiftKey: boolean; forward: 1 | -1 },
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
