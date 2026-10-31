import type { ExtendedColumnSort } from './data-table-utils';
import { createParser } from 'nuqs/server';
import { z } from 'zod';

const sortingSchema = z.array(
  z.object({
    id: z.string(),
    desc: z.boolean(),
  }),
);

const toKeySet = (columnIds: string[] | Set<string> | undefined) => {
  if (!columnIds) return null;

  return columnIds instanceof Set ? columnIds : new Set(columnIds);
};

export const getSortingStateParser = <TData>(columnIds?: string[] | Set<string>) => {
  const validKeys = toKeySet(columnIds);

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = sortingSchema.safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        const sorting: ExtendedColumnSort<TData>[] = result.data;

        return sorting;
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length && a.every((item, index) => item.id === b[index]?.id && item.desc === b[index]?.desc),
  });
};
