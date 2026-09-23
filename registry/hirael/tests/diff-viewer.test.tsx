import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/diff-viewer';
import * as radix from '@/registry/hirael/bases/radix/components/diff-viewer';

const registry = {
  radix,
  base,
};

const oldValue = ['import a', 'const b = 1;', 'const c = 2;', 'const d = 3;', 'export {};'].join('\n');
const newValue = ['import a', 'const b = 10;', 'const c = 2;', 'const d = 3;', 'const e = 4;', 'export {};'].join('\n');

describe.each(Object.entries(registry))('DiffViewer (%s)', (_, { DiffViewer, computeLineDiff }) => {
  it('should compute the same line diff as before', () => {
    expect(computeLineDiff(oldValue, newValue)).toEqual([
      { type: 'equal', content: 'import a', oldLine: 1, newLine: 1 },
      { type: 'remove', content: 'const b = 1;', oldLine: 2, newLine: null },
      { type: 'add', content: 'const b = 10;', oldLine: null, newLine: 2 },
      { type: 'equal', content: 'const c = 2;', oldLine: 3, newLine: 3 },
      { type: 'equal', content: 'const d = 3;', oldLine: 4, newLine: 4 },
      { type: 'add', content: 'const e = 4;', oldLine: null, newLine: 5 },
      { type: 'equal', content: 'export {};', oldLine: 5, newLine: 6 },
    ]);
  });

  it('should list removals before additions within a hunk', () => {
    const kinds = computeLineDiff('a\nb\nc', 'x\ny\nc').map((line) => line.type);

    expect(kinds).toEqual(['remove', 'remove', 'add', 'add', 'equal']);
  });

  it('should render the same line kinds in unified mode', () => {
    const { container } = render(<DiffViewer oldValue={oldValue} newValue={newValue} />);
    const kinds = Array.from(container.querySelectorAll('[data-slot="diff-viewer-line"]')).map((line) =>
      line.getAttribute('data-type'),
    );

    expect(kinds).toEqual(['equal', 'remove', 'add', 'equal', 'equal', 'add', 'equal']);
  });

  it('should announce added and removed markers to screen readers', () => {
    const { container } = render(<DiffViewer oldValue={oldValue} newValue={newValue} />);
    const removed = container.querySelector('[data-slot="diff-viewer-line"][data-type="remove"]');
    const added = container.querySelector('[data-slot="diff-viewer-line"][data-type="add"]');

    expect(removed).toHaveTextContent('removed');
    expect(added).toHaveTextContent('added');
  });
});
