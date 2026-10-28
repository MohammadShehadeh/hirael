import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/code-block';
import * as radix from '@/registry/hirael/bases/radix/components/code-block';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('CodeBlock (%s)', (_, { CodeBlock }) => {
  const tokensOf = (code: string) => {
    const { container } = render(<CodeBlock code={code} language="css" />);

    return [...container.querySelectorAll('[data-token]')].map((el) => [el.textContent, el.getAttribute('data-token')]);
  };

  it('should read an id selector made of hex letters as a selector', () => {
    const tokens = tokensOf('#add, .card {\n  color: #fff;\n}');

    expect(tokens).toContainEqual(['#add', 'type']);
    expect(tokens).toContainEqual(['.card', 'type']);
    expect(tokens).toContainEqual(['#fff', 'number']);
  });

  it('should read a hex colour in the last declaration as a number', () => {
    expect(tokensOf('a { color: #bada55 }')).toContainEqual(['#bada55', 'number']);
  });
});
