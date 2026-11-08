import { describe, expect, it } from 'vitest';

import { exampleDependencies, forConsumer } from '@/lib/consumer-source';

const paths = (files: { path: string }[]) => files.map((file) => file.path).toSorted();

describe('forConsumer', () => {
  it('should point base components and primitives at the consumer aliases', () => {
    const code = [
      "import { DatePicker } from '@/registry/hirael/bases/radix/components/date-picker';",
      "import { Button } from '@/registry/hirael/bases/base/ui/button';",
    ].join('\n');

    expect(forConsumer(code)).toBe(
      [
        "import { DatePicker } from '@/components/date-picker';",
        "import { Button } from '@/components/ui/button';",
      ].join('\n'),
    );
  });

  it('should point shared hooks and utilities at the consumer aliases', () => {
    const code = [
      "import { hijriCalendar } from '@/registry/hirael/lib/hijri-calendar';",
      "import { useDebounce } from '@/registry/hirael/hooks/use-debounce';",
    ].join('\n');

    expect(forConsumer(code)).toBe(
      [
        "import { hijriCalendar } from '@/lib/hijri-calendar';",
        "import { useDebounce } from '@/hooks/use-debounce';",
      ].join('\n'),
    );
  });

  it('should leave site and npm imports alone', () => {
    const code =
      "import { cn } from '@/lib/utils';\nimport { useT } from '@/lib/demo-locale';\nimport * as React from 'react';";

    expect(forConsumer(code)).toBe(code);
  });
});

describe('exampleDependencies', () => {
  const header = [
    "import { useT } from '@/lib/demo-locale';",
    "import { cn } from '@/lib/utils';",
    "import { Field } from '@/registry/hirael/bases/radix/ui/field';",
    "import { DatePicker } from '@/registry/hirael/bases/radix/components/date-picker';",
  ];

  it('should need nothing from Hirael when the example only uses its own item', () => {
    const { registryFiles, siteFiles } = exampleDependencies(header.join('\n'), 'date-picker');

    expect(registryFiles).toEqual([]);
    expect(siteFiles).toEqual(['lib/demo-locale']);
  });

  it('should add another item the example imports', () => {
    const code = [...header, "import { hijriCalendar } from '@/registry/hirael/lib/hijri-calendar';"].join('\n');

    expect(paths(exampleDependencies(code, 'date-picker').registryFiles)).toEqual(['lib/hijri-calendar.ts']);
  });

  it('should add what an imported item depends on unless the page item already brings it', () => {
    const code = [...header, "import { hijriCalendar } from '@/registry/hirael/lib/hijri-calendar';"].join('\n');

    expect(paths(exampleDependencies(code, 'hijri-calendar').registryFiles)).toEqual([
      'components/date-picker.tsx',
      'hooks/use-controllable-state.ts',
    ]);
  });
});
