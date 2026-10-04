import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/filter-builder';
import * as radix from '@/registry/hirael/bases/radix/components/filter-builder';

const registry = {
  radix,
  base,
};

interface Row {
  status: string;
  labels: string[];
  title: string;
  estimate: number;
  created: string;
}

const ROWS: Row[] = [
  { status: 'todo', labels: ['bug'], title: 'Fix the date picker', estimate: 2, created: '2026-09-01' },
  { status: 'done', labels: ['feature', 'rtl'], title: 'Add RTL support', estimate: 5, created: '2026-09-15' },
  { status: 'progress', labels: ['feature'], title: 'Filter bar', estimate: 8, created: '2026-10-02' },
];

const get = (row: Row, field: string) => row[field as keyof Row];

describe.each(Object.entries(registry))(
  'FilterBuilder (%s)',
  (_, { applyFilters, FilterBuilder, FilterBuilderList }) => {
    const run = (filters: Parameters<typeof applyFilters>[1]) => applyFilters(ROWS, filters, get).map((r) => r.title);

    it('should keep every row while a filter has no value yet', () => {
      expect(run([{ id: '1', field: 'status', operator: 'is', values: [] }])).toHaveLength(3);
    });

    it('should match option fields with is and is not', () => {
      expect(run([{ id: '1', field: 'status', operator: 'is', values: ['todo', 'done'] }])).toEqual([
        'Fix the date picker',
        'Add RTL support',
      ]);
      expect(run([{ id: '1', field: 'status', operator: 'isNot', values: ['done'] }])).toEqual([
        'Fix the date picker',
        'Filter bar',
      ]);
    });

    it('should match multi-option fields with any, all and exclude', () => {
      expect(run([{ id: '1', field: 'labels', operator: 'includesAny', values: ['rtl', 'bug'] }])).toHaveLength(2);
      expect(run([{ id: '1', field: 'labels', operator: 'includesAll', values: ['feature', 'rtl'] }])).toEqual([
        'Add RTL support',
      ]);
      expect(run([{ id: '1', field: 'labels', operator: 'excludes', values: ['feature'] }])).toEqual([
        'Fix the date picker',
      ]);
    });

    it('should match text without regard to case', () => {
      expect(run([{ id: '1', field: 'title', operator: 'contains', values: ['FILTER'] }])).toEqual(['Filter bar']);
      expect(run([{ id: '1', field: 'title', operator: 'notContains', values: ['picker'] }])).toHaveLength(2);
    });

    it('should compare numbers and ranges', () => {
      expect(run([{ id: '1', field: 'estimate', operator: 'gt', values: ['4'] }])).toHaveLength(2);
      expect(run([{ id: '1', field: 'estimate', operator: 'between', values: ['2', '5'] }])).toHaveLength(2);
    });

    it('should compare dates and date ranges', () => {
      expect(run([{ id: '1', field: 'created', operator: 'before', values: ['2026-09-10'] }])).toEqual([
        'Fix the date picker',
      ]);
      expect(run([{ id: '1', field: 'created', operator: 'between', values: ['2026-09-10', '2026-09-30'] }])).toEqual([
        'Add RTL support',
      ]);
    });

    it('should require every filter to pass', () => {
      expect(
        run([
          { id: '1', field: 'labels', operator: 'includesAny', values: ['feature'] },
          { id: '2', field: 'status', operator: 'isNot', values: ['done'] },
        ]),
      ).toEqual(['Filter bar']);
    });

    it('should remove a filter from its chip', async () => {
      const onValueChange = vi.fn();
      render(
        <FilterBuilder
          fields={[{ id: 'status', label: 'Status', type: 'option', options: [{ value: 'todo', label: 'To do' }] }]}
          defaultValue={[{ id: 'a', field: 'status', operator: 'is', values: ['todo'] }]}
          onValueChange={onValueChange}
        >
          <FilterBuilderList />
        </FilterBuilder>,
      );
      expect(screen.getByText('To do')).toBeInTheDocument();
      await userEvent.setup().click(screen.getByRole('button', { name: 'Remove filter: Status' }));
      expect(onValueChange).toHaveBeenLastCalledWith([]);
    });
  },
);
