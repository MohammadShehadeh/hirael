import { fireEvent, render, screen } from '@testing-library/react';
import { colord } from 'colord';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/color-picker';
import * as radix from '@/registry/hirael/bases/radix/components/color-picker';

const registry = {
  radix,
  base,
};

// #0ea5e9 is hsl(199 89% 48%).
const SKY = '#0ea5e9';

describe.each(Object.entries(registry))(
  'ColorPicker (%s)',
  (_, { ColorPicker, ColorPickerTrigger, ColorPickerContent, ColorPickerFormatInputs }) => {
    const renderHsl = (onValueChange: (hex: string) => void) => {
      render(
        <ColorPicker defaultValue={SKY} defaultFormat="hsl" defaultOpen onValueChange={onValueChange}>
          <ColorPickerTrigger />
          <ColorPickerContent>
            <ColorPickerFormatInputs />
          </ColorPickerContent>
        </ColorPicker>,
      );

      return {
        hue: screen.getByRole('textbox', { name: 'H channel' }),
        saturation: screen.getByRole('textbox', { name: 'S channel' }),
        lightness: screen.getByRole('textbox', { name: 'L channel' }),
      };
    };

    it('should keep the hue when saturation goes to 0 and back', () => {
      const onValueChange = vi.fn();
      const { hue, saturation } = renderHsl(onValueChange);

      fireEvent.change(saturation, { target: { value: '0' } });
      expect(hue).toHaveValue('199');

      fireEvent.change(saturation, { target: { value: '50' } });
      expect(onValueChange).toHaveBeenLastCalledWith(colord({ h: 199, s: 50, l: 48 }).toHex());
    });

    it('should keep the hue and saturation when lightness goes to 0 and back', () => {
      const onValueChange = vi.fn();
      const { hue, saturation, lightness } = renderHsl(onValueChange);

      fireEvent.change(lightness, { target: { value: '0' } });
      expect(onValueChange).toHaveBeenLastCalledWith('#000000');
      expect(hue).toHaveValue('199');
      expect(saturation).toHaveValue('89');

      fireEvent.change(lightness, { target: { value: '48' } });
      expect(onValueChange).toHaveBeenLastCalledWith(colord({ h: 199, s: 89, l: 48 }).toHex());
    });

    it('should show a hue typed while the colour is grey', () => {
      const { hue, saturation } = renderHsl(vi.fn());

      fireEvent.change(saturation, { target: { value: '0' } });
      fireEvent.change(hue, { target: { value: '120' } });
      fireEvent.blur(hue);

      expect(hue).toHaveValue('120');
    });
  },
);
