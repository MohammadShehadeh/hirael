import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/gauge';
import * as radix from '@/registry/hirael/bases/radix/components/gauge';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))(
  'Gauge (%s)',
  (_, { Gauge, GaugeBands, GaugeIndicator, GaugeLabel, GaugeTrack, GaugeValue }) => {
    const THRESHOLDS = [
      { value: 0, tone: 'success' as const, label: 'Normal' },
      { value: 70, tone: 'warning' as const, label: 'High' },
      { value: 90, tone: 'destructive' as const, label: 'Critical' },
    ];

    const setup = (value: number) => {
      return render(
        <Gauge value={value} thresholds={THRESHOLDS}>
          <GaugeTrack />
          <GaugeBands />
          <GaugeIndicator />
          <GaugeValue format={(v) => `${v}%`} />
          <GaugeLabel>CPU load</GaugeLabel>
        </Gauge>,
      );
    };

    it('should expose a meter named by its label', () => {
      setup(42);
      const meter = screen.getByRole('meter', { name: 'CPU load' });
      expect(meter).toHaveAttribute('aria-valuenow', '42');
      expect(meter).toHaveAttribute('aria-valuemin', '0');
      expect(meter).toHaveAttribute('aria-valuemax', '100');
      expect(meter).toHaveAttribute('aria-valuetext', '42, Normal');
      expect(screen.getByText('42%')).toBeInTheDocument();
    });

    it('should take the tone of the threshold the value has reached', () => {
      const { rerender, container } = setup(42);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('data-tone', 'success');

      rerender(
        <Gauge value={93} thresholds={THRESHOLDS}>
          <GaugeIndicator />
          <GaugeLabel>CPU load</GaugeLabel>
        </Gauge>,
      );
      expect(meter).toHaveAttribute('data-tone', 'destructive');
      expect(meter).toHaveAttribute('aria-valuetext', '93, Critical');
      expect(container.querySelector('[data-slot="gauge-indicator"]')).toHaveClass('text-destructive');
    });

    it('should draw one band per threshold', () => {
      const { container } = setup(42);
      const bands = container.querySelectorAll('[data-slot="gauge-band"]');
      expect(Array.from(bands, (band) => band.getAttribute('data-tone'))).toEqual([
        'success',
        'warning',
        'destructive',
      ]);
    });

    it('should clamp the reported value to the scale and use custom value text', () => {
      render(
        <Gauge
          value={900}
          min={300}
          max={850}
          aria-label="Credit score"
          getValueText={(v, min, max) => `${v} on a ${min} to ${max} scale`}
        />,
      );
      const meter = screen.getByRole('meter', { name: 'Credit score' });
      expect(meter).toHaveAttribute('aria-valuenow', '850');
      expect(meter).toHaveAttribute('aria-valuetext', '900 on a 300 to 850 scale');
    });
  },
);
