import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/cron-editor';
import * as radix from '@/registry/hirael/bases/radix/components/cron-editor';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('cron editor (%s)', (_, { CronEditor, CronEditorNextRuns, describeCron }) => {
  describe('describeCron', () => {
    it.each([
      ['0 9 * * 1-5', 'At 09:00 on weekdays'],
      ['0 0 * * 5-7', 'At 00:00 on Friday, Saturday, and Sunday'],
      ['0 0 * * 0,5,6', 'At 00:00 on Sunday, Friday, and Saturday'],
      ['0 0 * * SUN-SAT', 'At 00:00 every day'],
      ['0 0 1 * 0-6', 'At 00:00 on day 1 of the month and every day'],
    ])('should describe %s as %j', (expression, expected) => {
      expect(describeCron(expression)).toBe(expected);
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
});
