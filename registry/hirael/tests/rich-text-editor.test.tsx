import * as React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/rich-text-editor';
import * as radix from '@/registry/hirael/bases/radix/components/rich-text-editor';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('RichTextEditor (%s)', (_, { RichTextEditor, RichTextEditorContent }) => {
  it('should not call onValueChange when the parent changes the value', async () => {
    const onValueChange = vi.fn();
    let setValue: (next: string) => void = () => {};
    const Controlled = () => {
      const [value, set] = React.useState('<p>First</p>');
      setValue = set;

      return (
        <RichTextEditor value={value} onValueChange={onValueChange}>
          <RichTextEditorContent />
        </RichTextEditor>
      );
    };
    render(<Controlled />);
    await waitFor(() => expect(screen.getByText('First')).toBeInTheDocument());

    act(() => setValue('<p>Second</p>'));

    await waitFor(() => expect(screen.getByText('Second')).toBeInTheDocument());
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe.each(Object.entries(registry))('normalizeLinkHref (%s)', (_, { normalizeLinkHref }) => {
  it.each([
    ['hirael.com', 'https://hirael.com'],
    ['  www.hirael.com/docs ', 'https://www.hirael.com/docs'],
    ['hirael.com:8080/blocks', 'https://hirael.com:8080/blocks'],
    ['me@hirael.com', 'mailto:me@hirael.com'],
    ['https://hirael.com', 'https://hirael.com'],
    ['mailto:me@hirael.com', 'mailto:me@hirael.com'],
    ['tel:+15551234567', 'tel:+15551234567'],
    ['/docs', '/docs'],
    ['#install', '#install'],
  ])('should turn %j into %j', (typed, href) => {
    expect(normalizeLinkHref(typed)).toBe(href);
  });
});
