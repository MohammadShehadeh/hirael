import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/lazy-select';
import * as radix from '@/registry/hirael/bases/radix/components/lazy-select';

const registry = { radix, base };

describe.each(Object.entries(registry))('LazySelect (%s)', (_, { LazySelect, LazySelectTrigger }) => {
  it.each(['constructor', 'toString', 'hasOwnProperty'])(
    'should show the raw value %s before its option has loaded',
    (value) => {
      render(
        <LazySelect defaultValue={value}>
          <LazySelectTrigger />
        </LazySelect>,
      );
      expect(screen.getByRole('combobox')).toHaveTextContent(value);
    },
  );
});
