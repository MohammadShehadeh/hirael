import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/json-viewer';
import * as radix from '@/registry/hirael/bases/radix/components/json-viewer';

const registry = {
  radix,
  base,
};

const circularValue = () => {
  const node: Record<string, unknown> = { name: 'root', list: [1, 2] };
  node.self = node;
  (node.list as unknown[]).push(node);

  return node;
};

describe.each(Object.entries(registry))('JsonViewer (%s)', (_, { JsonViewer, JsonViewerTree, JsonViewerExpandAll }) => {
  it('should render a circular object without throwing', () => {
    render(<JsonViewer value={circularValue()} defaultExpanded />);

    expect(screen.getAllByText('[Circular]')).toHaveLength(2);
  });

  it('should expand all on a circular object without recursing forever', () => {
    render(
      <JsonViewer value={circularValue()} defaultExpanded={false}>
        <JsonViewerExpandAll />
        <JsonViewerTree />
      </JsonViewer>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }));

    expect(screen.getAllByText('[Circular]')).toHaveLength(2);
  });

  it('should reveal a truncated string with Enter on its row', () => {
    render(<JsonViewer value={{ text: 'x'.repeat(20) }} maxStringLength={5} />);
    const row = screen.getAllByRole('treeitem')[1];
    fireEvent.keyDown(row, { key: 'Enter' });

    expect(row).toHaveTextContent('x'.repeat(20));
  });
});
