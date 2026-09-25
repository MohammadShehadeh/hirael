import * as React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/autocomplete';
import * as radix from '@/registry/hirael/bases/radix/components/autocomplete';

const registry = {
  radix,
  base,
};

const CITIES = [
  { value: 'Paris', description: 'France', group: 'Europe' },
  { value: 'Porto', description: 'Portugal', group: 'Europe' },
  { value: 'Prague', description: 'Czechia', group: 'Europe' },
  { value: 'Pune', description: 'India', group: 'Asia' },
  { value: 'Osaka', description: 'Japan', group: 'Asia' },
];

describe.each(Object.entries(registry))(
  'Autocomplete (%s)',
  (_, { Autocomplete, AutocompleteContent, AutocompleteInput }) => {
    const setup = (props: React.ComponentProps<typeof Autocomplete> = {}, inputProps = {}) => {
      const onValueChange = vi.fn();
      const onValueCommit = vi.fn();
      render(
        <Autocomplete items={CITIES} onValueChange={onValueChange} onValueCommit={onValueCommit} {...props}>
          <AutocompleteInput aria-label="City" {...inputProps} />
          <AutocompleteContent />
        </Autocomplete>,
      );

      return {
        user: userEvent.setup(),
        input: screen.getByRole('combobox', { name: 'City' }),
        onValueChange,
        onValueCommit,
      };
    };

    it('should suggest matches as you type, prefix matches first', async () => {
      const { user, input } = setup();
      await user.type(input, 'pr');
      const options = within(screen.getByRole('listbox')).getAllByRole('option');
      expect(options.map((o) => o.textContent)).toEqual(['PragueCzechia']);
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
    });

    it('should bold the matched part of each suggestion', async () => {
      const { user, input } = setup();
      await user.type(input, 'ra');
      const option = screen.getByRole('option', { name: /Prague/ });
      expect(option.querySelector('mark')).toHaveTextContent('ra');
    });

    it('should group suggestions under their heading', async () => {
      const { user, input } = setup();
      await user.type(input, 'p');
      expect(screen.getByRole('group', { name: 'Europe' })).toBeInTheDocument();
      expect(within(screen.getByRole('group', { name: 'Asia' })).getByRole('option')).toHaveTextContent('Pune');
    });

    it('should move with the arrow keys and pick with Enter', async () => {
      const { user, input, onValueCommit } = setup();
      await user.type(input, 'p');
      await user.keyboard('{ArrowDown}{ArrowDown}');
      const active = screen.getByRole('option', { name: /Porto/ });
      expect(input).toHaveAttribute('aria-activedescendant', active.id);
      expect(active).toHaveAttribute('aria-selected', 'true');
      await user.keyboard('{Enter}');
      expect(input).toHaveValue('Porto');
      expect(onValueCommit).toHaveBeenLastCalledWith('Porto');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should keep free text that matches no suggestion', async () => {
      const { user, input, onValueCommit } = setup();
      await user.type(input, 'Lyon');
      expect(screen.getByRole('status')).toHaveTextContent('No suggestions.');
      await user.keyboard('{Enter}');
      expect(input).toHaveValue('Lyon');
      expect(onValueCommit).toHaveBeenLastCalledWith('Lyon');
    });

    it('should pick a suggestion on click', async () => {
      const { user, input } = setup();
      await user.type(input, 'os');
      await user.click(screen.getByRole('option', { name: /Osaka/ }));
      expect(input).toHaveValue('Osaka');
      expect(input).toHaveFocus();
    });

    it('should close on the first Escape and clear on the second', async () => {
      const { user, input } = setup();
      await user.type(input, 'pa');
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(input).toHaveValue('pa');
      await user.keyboard('{Escape}');
      expect(input).toHaveValue('');
    });

    it('should show inline completion and accept it with Tab', async () => {
      const { user, input, onValueCommit } = setup({ inlineComplete: true });
      await user.type(input, 'par');
      expect(input).toHaveAttribute('aria-autocomplete', 'both');
      expect(document.querySelector('[data-slot="autocomplete-ghost"]')).toHaveTextContent('paris');
      await user.keyboard('{Tab}');
      expect(input).toHaveValue('Paris');
      expect(input).toHaveFocus();
      expect(onValueCommit).toHaveBeenLastCalledWith('Paris');
    });

    it('should accept inline completion with ArrowRight', async () => {
      const { user, input } = setup({ inlineComplete: true });
      await user.type(input, 'osa{ArrowRight}');
      expect(input).toHaveValue('Osaka');
    });

    it('should accept inline completion with ArrowLeft in RTL', async () => {
      const { user, input } = setup({ inlineComplete: true }, { style: { direction: 'rtl' } });
      await user.type(input, 'osa{ArrowRight}');
      expect(input).toHaveValue('osa');
      await user.keyboard('{ArrowLeft}');
      expect(input).toHaveValue('Osaka');
    });

    it('should show recent entries when the input is empty', async () => {
      const { user, input } = setup({ recent: ['Lisbon', 'Oslo'] });
      await user.click(input);
      const group = screen.getByRole('group', { name: 'Recent' });
      expect(
        within(group)
          .getAllByRole('option')
          .map((o) => o.textContent),
      ).toEqual(['Lisbon', 'Oslo']);
      await user.keyboard('{ArrowUp}{Enter}');
      expect(input).toHaveValue('Oslo');
    });

    it('should submit the typed text with a form', async () => {
      const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        return new FormData(event.currentTarget).get('city');
      });
      render(
        <form onSubmit={onSubmit}>
          <Autocomplete items={CITIES} name="city">
            <AutocompleteInput aria-label="City" />
            <AutocompleteContent />
          </Autocomplete>
        </form>,
      );
      const user = userEvent.setup();
      await user.type(screen.getByRole('combobox', { name: 'City' }), 'Lyon{Enter}');
      expect(onSubmit).toHaveReturnedWith('Lyon');
    });

    it('should load async suggestions after a loading state', async () => {
      const onSearch = vi.fn(async (query: string) => CITIES.filter((c) => c.value.toLowerCase().includes(query)));
      const { user, input } = setup({ items: undefined, onSearch, debounce: 0 });
      await user.type(input, 'o');
      await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2));
      expect(onSearch).toHaveBeenLastCalledWith('o', expect.any(AbortSignal));
    });

    it('should show a loading message while the first request is pending', async () => {
      const onSearch = vi.fn(() => new Promise<never>(() => {}));
      const { user, input } = setup({ items: undefined, onSearch, debounce: 0 });
      await user.type(input, 'o');
      expect(screen.getByRole('status')).toHaveTextContent('Searching…');
    });

    it('should abort the previous request when the query changes', async () => {
      const signals: AbortSignal[] = [];
      const onSearch = vi.fn((_query: string, signal: AbortSignal) => {
        signals.push(signal);

        return new Promise<never>(() => {});
      });
      const { input } = setup({ items: undefined, onSearch, debounce: 0 });
      fireEvent.change(input, { target: { value: 'p' } });
      await waitFor(() => expect(onSearch).toHaveBeenCalledTimes(1));
      fireEvent.change(input, { target: { value: 'pa' } });
      await waitFor(() => expect(onSearch).toHaveBeenCalledTimes(2));
      expect(signals[0].aborted).toBe(true);
      expect(signals[1].aborted).toBe(false);
    });

    it('should show an error message when the search fails', async () => {
      const onSearch = vi.fn(() => Promise.reject(new Error('offline')));
      const { user, input } = setup({ items: undefined, onSearch, debounce: 0 });
      await user.type(input, 'o');
      expect(await screen.findByText('Could not load suggestions.')).toBeInTheDocument();
    });
  },
);
