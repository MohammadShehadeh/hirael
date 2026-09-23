import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/timeline';
import * as radix from '@/registry/hirael/bases/radix/components/timeline';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('Timeline (%s)', (_, { TimelineDot }) => {
  it('should map the deprecated danger tone to destructive', () => {
    render(<TimelineDot data-testid="dot" tone="danger" />);
    const dot = screen.getByTestId('dot');
    expect(dot).toHaveAttribute('data-tone', 'destructive');
    expect(dot).toHaveClass('bg-destructive');
  });

  it('should map the deprecated default tone to neutral', () => {
    render(<TimelineDot data-testid="dot" tone="default" />);
    expect(screen.getByTestId('dot')).toHaveAttribute('data-tone', 'neutral');
  });

  it('should color an icon dot with its tone', () => {
    render(
      <TimelineDot data-testid="dot" tone="danger">
        <svg />
      </TimelineDot>,
    );
    const dot = screen.getByTestId('dot');
    expect(dot).toHaveAttribute('data-tone', 'destructive');
    expect(dot).toHaveClass('text-destructive');
  });
});
