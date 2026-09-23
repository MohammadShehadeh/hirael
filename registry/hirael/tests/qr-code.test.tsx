import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/qr-code';
import * as radix from '@/registry/hirael/bases/radix/components/qr-code';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('QRCode (%s)', (_, { QRCode }) => {
  it('should render a background rect covering the quiet zone', () => {
    const { container } = render(<QRCode value="https://hirael.com" margin={4} />);
    const size = container.querySelector('svg')?.getAttribute('viewBox')?.split(' ')[2];
    const rect = container.querySelector('[data-slot="qr-code-background"]');

    expect(rect).toHaveAttribute('fill', '#fff');
    expect(rect).toHaveAttribute('width', size);
    expect(rect).toHaveAttribute('height', size);
    expect(container.querySelector('[data-slot="qr-code-path"]')).toHaveAttribute('fill', '#000');
  });

  it('should accept custom colors', () => {
    const { container } = render(<QRCode value="hirael" foreground="#111" background="#eee" />);

    expect(container.querySelector('[data-slot="qr-code-background"]')).toHaveAttribute('fill', '#eee');
    expect(container.querySelector('[data-slot="qr-code-path"]')).toHaveAttribute('fill', '#111');
  });
});
