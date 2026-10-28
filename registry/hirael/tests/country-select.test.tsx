import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/country-select';
import * as radix from '@/registry/hirael/bases/radix/components/country-select';

const registry = {
  radix,
  base,
};

// cmdk measures its list and scrolls the active option into view; jsdom has neither.
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ??= () => {};
});

// Expected names come from Intl too, so the test doesn't pin one ICU version's spelling.
const arabicNames = new Intl.DisplayNames(['ar'], { type: 'region' });
const arabicOrder = new Intl.Collator('ar');

// Each option starts with its flag emoji; the name is the rest.
const optionNames = () =>
  within(screen.getByRole('listbox'))
    .getAllByRole('option')
    .map((option) => {
      const flag = option.querySelector('[data-slot="country-select-flag"]')?.textContent ?? '';

      return option.textContent?.replace(flag, '');
    });

describe.each(Object.entries(registry))(
  'CountrySelect (%s)',
  (
    _,
    {
      CountrySelect,
      CountrySelectTrigger,
      CountrySelectValue,
      CountrySelectContent,
      CountrySelectSearch,
      CountrySelectList,
      COUNTRIES,
    },
  ) => {
    const renderOpen = (locale?: string) => {
      render(
        <CountrySelect locale={locale} defaultValue="EG" defaultOpen>
          <CountrySelectTrigger>
            <CountrySelectValue />
          </CountrySelectTrigger>
          <CountrySelectContent>
            <CountrySelectSearch placeholder="Search" />
            <CountrySelectList />
          </CountrySelectContent>
        </CountrySelect>,
      );

      return optionNames();
    };

    it('should show and sort country names in the given locale', () => {
      const shown = renderOpen('ar');
      const expected = COUNTRIES.map((country) => arabicNames.of(country.iso2) ?? country.name).sort(
        arabicOrder.compare,
      );

      expect(shown).toEqual(expected);
      expect(screen.getAllByText(arabicNames.of('EG') ?? '').length).toBeGreaterThan(0);
    });

    it('should still find a translated country by its English name', () => {
      renderOpen('ar');

      fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Egypt' } });

      expect(optionNames()).toEqual([arabicNames.of('EG')]);
    });

    it('should keep the English names without a locale', () => {
      expect(renderOpen()).toEqual(COUNTRIES.map((country) => country.name));
    });
  },
);
