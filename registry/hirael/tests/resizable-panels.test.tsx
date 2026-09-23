import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/resizable-panels';
import * as radix from '@/registry/hirael/bases/radix/components/resizable-panels';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))(
  'ResizablePanels (%s)',
  (_, { ResizablePanelGroup, ResizablePanel, ResizableHandle }) => {
    it('should not write NaN when the panels have no size', () => {
      render(
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel data-testid="first" defaultSize={40} />
          <ResizableHandle />
          <ResizablePanel data-testid="second" defaultSize={60} />
        </ResizablePanelGroup>,
      );
      const handle = screen.getByRole('separator');
      fireEvent.keyDown(handle, { key: 'ArrowRight' });
      expect(screen.getByTestId('first').style.flexGrow).toBe('40');
      expect(screen.getByTestId('second').style.flexGrow).toBe('60');
      expect(handle).toHaveAttribute('aria-valuenow', '50');
    });

    it('should accept the deprecated direction prop', () => {
      render(
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel />
          <ResizableHandle />
          <ResizablePanel />
        </ResizablePanelGroup>,
      );
      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
    });
  },
);
