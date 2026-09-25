import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/text-shimmer';
import * as radix from '@/registry/hirael/bases/radix/components/text-shimmer';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('TextShimmer (%s)', (_, { TextShimmer }) => {
  it('should render readable text in the requested element', () => {
    render(<TextShimmer as="p">Thinking...</TextShimmer>);
    const text = screen.getByText('Thinking...');
    expect(text.tagName).toBe('P');
    expect(text).toHaveAttribute('data-slot', 'text-shimmer');
  });

  it('should pass duration and spread to the sweep', () => {
    render(
      <TextShimmer duration={1.5} spread={3}>
        Saving
      </TextShimmer>,
    );
    const text = screen.getByText('Saving');
    expect(text.style.getPropertyValue('--shimmer-duration')).toBe('1.5s');
    expect(text.style.getPropertyValue('--shimmer-spread')).toBe('3em');
  });
});
