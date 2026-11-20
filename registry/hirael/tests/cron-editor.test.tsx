import { render, screen } from '@testing-library/react';
import 'cronstrue/locales/ar';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/cron-editor';
import * as radix from '@/registry/hirael/bases/radix/components/cron-editor';

const registry = {
  radix,
  base,
};

const FROM = new Date(2026, 10, 21, 10, 0);

describe.each(Object.entries(registry))(
  'cron editor (%s)',
  (_, { CronEditor, CronEditorNextRuns, describeCron, nextCronRuns }) => {
    describe('describeCron', () => {
      it('should describe a schedule with a 24-hour clock', () => {
        expect(describeCron('0 21 * * 1-5')).toBe('At 21:00, Monday through Friday');
      });

      it('should describe in a loaded locale', () => {
        expect(describeCron('0 9 * * 1-5', 'ar')).toBe('09:00، الإثنين حتى الجمعة');
      });

      it('should return the parse error for an invalid expression', () => {
        expect(describeCron('0 9 * *')).toBe('Expected 5 fields, got 4.');
      });
    });

    describe('nextCronRuns', () => {
      it('should require both day fields when one is a stepped wildcard', () => {
        const runs = nextCronRuns('0 0 */2 * 1', 3, FROM);

        expect(runs.every((run) => run.getDay() === 1 && run.getDate() % 2 === 1)).toBe(true);
      });

      it('should accept either day field when both are restricted', () => {
        const runs = nextCronRuns('0 0 1 * 1', 3, FROM);

        expect(runs.map((run) => run.getDate())).toEqual([23, 30, 1]);
      });

      it('should return nothing for an invalid expression', () => {
        expect(nextCronRuns('60 * * * *', 3, FROM)).toEqual([]);
      });
    });

    describe('CronEditorNextRuns', () => {
      it('should say a valid expression that can never fire never runs', () => {
        render(
          <CronEditor defaultValue="0 0 31 2 *">
            <CronEditorNextRuns />
          </CronEditor>,
        );

        expect(screen.getByText('This schedule never runs.')).toBeInTheDocument();
      });

      it('should keep the empty label for an invalid expression', () => {
        render(
          <CronEditor defaultValue="60 * * * *">
            <CronEditorNextRuns />
          </CronEditor>,
        );

        expect(screen.getByText('No upcoming runs.')).toBeInTheDocument();
      });
    });
  },
);
