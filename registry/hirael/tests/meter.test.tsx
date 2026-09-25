import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/meter';
import * as radix from '@/registry/hirael/bases/radix/components/meter';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))(
  'Meter (%s)',
  (_, { Meter, MeterHeader, MeterLabel, MeterLegend, MeterTrack, MeterValue }) => {
    it('should expose a meter named by its label with the used amount', () => {
      render(
        <Meter value={38.2} max={100}>
          <MeterHeader>
            <MeterLabel>Storage</MeterLabel>
            <MeterValue unit="GB" />
          </MeterHeader>
          <MeterTrack />
        </Meter>,
      );
      const meter = screen.getByRole('meter', { name: 'Storage' });
      expect(meter).toHaveAttribute('aria-valuenow', '38.2');
      expect(meter).toHaveAttribute('aria-valuemax', '100');
      expect(meter).toHaveAttribute('aria-valuetext', '38.2 of 100');
      expect(screen.getByText('38.2 of 100 GB')).toBeInTheDocument();
    });

    it('should total the segments and list them in the legend', () => {
      render(
        <Meter
          max={100}
          segments={[
            { label: 'Photos', value: 14.6 },
            { label: 'Videos', value: 11.2 },
            { label: 'Documents', value: 6.9 },
          ]}
        >
          <MeterLabel>Storage</MeterLabel>
          <MeterTrack />
          <MeterLegend format={(v) => `${v} GB`} />
        </Meter>,
      );
      const meter = screen.getByRole('meter', { name: 'Storage' });
      expect(meter).toHaveAttribute('aria-valuenow', '32.7');
      expect(meter.querySelectorAll('[data-slot="meter-segment"]')).toHaveLength(3);

      const items = within(screen.getByRole('list')).getAllByRole('listitem');
      expect(items.map((item) => item.textContent)).toEqual(['Photos14.6 GB', 'Videos11.2 GB', 'Documents6.9 GB']);
    });

    it('should switch tone and value text once a threshold is reached', () => {
      const thresholds = [
        { value: 8000, tone: 'warning' as const, label: 'Near limit' },
        { value: 10000, tone: 'destructive' as const, label: 'Limit reached' },
      ];
      const ui = (value: number) => (
        <Meter value={value} max={10000} thresholds={thresholds}>
          <MeterLabel>API requests</MeterLabel>
          <MeterTrack />
        </Meter>
      );
      const { rerender, container } = render(ui(4200));
      const meter = screen.getByRole('meter', { name: 'API requests' });
      expect(meter).toHaveAttribute('aria-valuetext', '4,200 of 10,000');
      expect(container.querySelector('[data-slot="meter-indicator"]')).toHaveAttribute('data-tone', 'primary');

      rerender(ui(8650));
      expect(meter).toHaveAttribute('aria-valuetext', '8,650 of 10,000, Near limit');
      expect(container.querySelector('[data-slot="meter-indicator"]')).toHaveAttribute('data-tone', 'warning');
    });
  },
);
