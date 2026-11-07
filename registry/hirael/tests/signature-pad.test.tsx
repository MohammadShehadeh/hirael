import { render } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/signature-pad';
import * as radix from '@/registry/hirael/bases/radix/components/signature-pad';

// jsdom has no canvas, and the point is how many pads get built, so the library is a recorder.
const pads = vi.hoisted(() => [] as { penColor?: string; minWidth?: number; maxWidth?: number; data: unknown[] }[]);
vi.mock('signature_pad', () => ({
  default: class {
    penColor?: string;
    minWidth?: number;
    maxWidth?: number;
    data: unknown[] = [];
    constructor(_canvas: HTMLCanvasElement, options: { penColor?: string } = {}) {
      this.penColor = options.penColor;
      pads.push(this);
    }
    addEventListener() {}
    off() {}
    clear() {
      this.data = [];
    }
    isEmpty() {
      return this.data.length === 0;
    }
    toData() {
      return this.data;
    }
    fromData(data: unknown[]) {
      this.data = data;
    }
  },
}));

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  HTMLCanvasElement.prototype.getContext = (() => ({ setTransform() {} })) as never;
});

beforeEach(() => {
  pads.length = 0;
});

const registry = { radix, base };

describe.each(Object.entries(registry))('SignaturePad (%s)', (_, { SignaturePad }) => {
  it('should keep the drawing when the pen color and stroke width change', () => {
    const { rerender } = render(<SignaturePad penColor="#000000" minStrokeWidth={1} />);
    const builtOnMount = pads.length;
    const pad = pads.at(-1)!;
    pad.data = [{ points: [{ x: 1, y: 1 }] }];

    rerender(<SignaturePad penColor="#2563eb" minStrokeWidth={2} />);

    expect(pads.length).toBe(builtOnMount);
    expect(pad.penColor).toBe('#2563eb');
    expect(pad.minWidth).toBe(2);
    expect(pad.data).toHaveLength(1);
  });
});
