import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/markdown';
import * as radix from '@/registry/hirael/bases/radix/components/markdown';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('Markdown (%s)', (_, { completeMarkdown, Markdown }) => {
  it('should close a code fence cut off mid-stream', () => {
    expect(completeMarkdown('Run this:\n\n```ts\nconst a = 1')).toBe('Run this:\n\n```ts\nconst a = 1\n```');
  });

  it('should close unfinished bold, strikethrough and inline code on the last line', () => {
    expect(completeMarkdown('This is **very')).toBe('This is **very**');
    expect(completeMarkdown('Old ~~price')).toBe('Old ~~price~~');
    expect(completeMarkdown('Call `useT')).toBe('Call `useT`');
  });

  it('should show the text of a link whose URL has not arrived', () => {
    expect(completeMarkdown('See [the docs](https://ui.sha')).toBe('See the docs');
    expect(completeMarkdown('See [the do')).toBe('See the do');
  });

  it('should leave finished markdown alone', () => {
    const text = '**Done** with `code` and [a link](https://hirael.com).';
    expect(completeMarkdown(text)).toBe(text);
  });

  it('should render tables and task lists from GitHub markdown', () => {
    render(<Markdown>{'| A | B |\n| - | - |\n| 1 | 2 |\n\n- [x] Shipped'}</Markdown>);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should give fenced code a copy button and the language', () => {
    render(<Markdown>{'```tsx\nconst a = 1;\n```'}</Markdown>);
    expect(screen.getByText('tsx')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });
});
