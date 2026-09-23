import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/calendar-utils';
import * as radix from '@/registry/hirael/bases/radix/components/calendar-utils';

const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

describe.each([
  ['radix', radix],
  ['base', base],
] as const)(
  'calendar utils (%s)',
  (_, { findFocusableDay, isDayDisabled, monthCells, rangeHasDisabledDay, startOfMonth }) => {
    describe('isDayDisabled', () => {
      it('should disable days outside min and max, ignoring the time of day', () => {
        const min = new Date(2026, 5, 10, 18, 30);
        const max = new Date(2026, 5, 20, 8, 0);

        expect(isDayDisabled(new Date(2026, 5, 9), { min, max })).toBe(true);
        expect(isDayDisabled(new Date(2026, 5, 10), { min, max })).toBe(false);
        expect(isDayDisabled(new Date(2026, 5, 20), { min, max })).toBe(false);
        expect(isDayDisabled(new Date(2026, 5, 21), { min, max })).toBe(true);
      });

      it('should defer to disabledDate inside the bounds', () => {
        expect(isDayDisabled(new Date(2026, 5, 13), { disabledDate: isWeekend })).toBe(true);
        expect(isDayDisabled(new Date(2026, 5, 15), { disabledDate: isWeekend })).toBe(false);
      });

      it('should enable every day with no constraints', () => {
        expect(isDayDisabled(new Date(2026, 5, 13), {})).toBe(false);
      });
    });

    describe('findFocusableDay', () => {
      it('should return the day itself when it is enabled', () => {
        const day = new Date(2026, 5, 15);

        expect(findFocusableDay(day, 1, isWeekend)).toBe(day);
      });

      it('should walk past disabled days in the direction of travel', () => {
        expect(findFocusableDay(new Date(2026, 5, 13), 1, isWeekend)).toEqual(new Date(2026, 5, 15));
        expect(findFocusableDay(new Date(2026, 5, 14), -1, isWeekend)).toEqual(new Date(2026, 5, 12));
      });

      it('should stop at max instead of walking past it', () => {
        expect(findFocusableDay(new Date(2026, 5, 13), 1, isWeekend, undefined, new Date(2026, 5, 14))).toBeNull();
      });

      it('should stop at min instead of walking past it', () => {
        expect(findFocusableDay(new Date(2026, 5, 14), -1, isWeekend, new Date(2026, 5, 13))).toBeNull();
      });
    });

    describe('rangeHasDisabledDay', () => {
      it('should find a disabled day inside the span in either order', () => {
        const from = new Date(2026, 5, 12);
        const to = new Date(2026, 5, 15);

        expect(rangeHasDisabledDay(from, to, isWeekend)).toBe(true);
        expect(rangeHasDisabledDay(to, from, isWeekend)).toBe(true);
      });

      it('should accept a span of enabled days', () => {
        expect(rangeHasDisabledDay(new Date(2026, 5, 15), new Date(2026, 5, 19), isWeekend)).toBe(false);
      });
    });

    describe('monthCells', () => {
      it('should start the grid on Saturday when weekStartsOn is 6', () => {
        // 1 June 2026 is a Monday: two blanks (Sat, Sun) come before it.
        const cells = monthCells(new Date(2026, 5, 1), 6);

        expect(cells.slice(0, 2)).toEqual([null, null]);
        expect(cells[2]).toEqual(new Date(2026, 5, 1));
        expect(cells[2]?.getDay()).toBe(1);
        expect(cells.length % 7).toBe(0);
        expect(cells.filter(Boolean)).toHaveLength(30);
      });

      it('should put every Saturday in the first column when weekStartsOn is 6', () => {
        const cells = monthCells(new Date(2026, 5, 1), 6);
        const firstColumn = cells.filter((day, i): day is Date => i % 7 === 0 && day !== null);

        expect(firstColumn.map((day) => day.getDay())).toEqual([6, 6, 6, 6]);
      });
    });

    describe('startOfMonth', () => {
      it('should drop the day and time', () => {
        expect(startOfMonth(new Date(2026, 5, 18, 13, 45))).toEqual(new Date(2026, 5, 1));
      });
    });
  },
);
