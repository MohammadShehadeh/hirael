import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/segmented-control';
import * as radix from '@/registry/hirael/bases/radix/components/segmented-control';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('SegmentedControl (%s)', (_, { SegmentedControl, SegmentedControlItem }) => {
  const setup = (props: Partial<React.ComponentProps<typeof SegmentedControl>> = {}) => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl aria-label="View" defaultValue="list" onValueChange={onValueChange} {...props}>
        <SegmentedControlItem value="list">List</SegmentedControlItem>
        <SegmentedControlItem value="board">Board</SegmentedControlItem>
        <SegmentedControlItem value="timeline" disabled>
          Timeline
        </SegmentedControlItem>
        <SegmentedControlItem value="calendar">Calendar</SegmentedControlItem>
      </SegmentedControl>,
    );
    const radio = (name: string) => screen.getByRole('radio', { name });

    return { user: userEvent.setup(), radio, onValueChange };
  };

  it('should render a radiogroup and select an option on click', async () => {
    const { user, radio, onValueChange } = setup();
    expect(screen.getByRole('radiogroup', { name: 'View' })).toBeInTheDocument();
    expect(radio('List')).toHaveAttribute('aria-checked', 'true');

    await user.click(radio('Board'));
    expect(onValueChange).toHaveBeenLastCalledWith('board');
    expect(radio('Board')).toHaveAttribute('aria-checked', 'true');
    expect(radio('List')).toHaveAttribute('aria-checked', 'false');
  });

  it('should keep a single tab stop on the selected option', () => {
    const { radio } = setup({ defaultValue: 'board' });
    expect(radio('Board')).toHaveAttribute('tabindex', '0');
    expect(radio('List')).toHaveAttribute('tabindex', '-1');
    expect(radio('Calendar')).toHaveAttribute('tabindex', '-1');
  });

  it('should move and select with the arrow keys, skipping disabled options', async () => {
    const { user, radio, onValueChange } = setup();
    await user.click(radio('List'));

    await user.keyboard('{ArrowRight}');
    expect(radio('Board')).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('board');

    await user.keyboard('{ArrowRight}');
    expect(radio('Calendar')).toHaveFocus();
    expect(radio('Calendar')).toHaveAttribute('aria-checked', 'true');

    await user.keyboard('{ArrowDown}');
    expect(radio('List')).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(radio('Calendar')).toHaveFocus();
  });

  it('should jump to the first and last option with Home and End', async () => {
    const { user, radio, onValueChange } = setup();
    await user.click(radio('List'));

    await user.keyboard('{End}');
    expect(radio('Calendar')).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('calendar');

    await user.keyboard('{Home}');
    expect(radio('List')).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('list');
  });

  it('should mirror the horizontal arrow keys in RTL', async () => {
    const { user, radio, onValueChange } = setup({ dir: 'rtl', style: { direction: 'rtl' } });
    await user.click(radio('List'));

    await user.keyboard('{ArrowLeft}');
    expect(radio('Board')).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('board');

    await user.keyboard('{ArrowRight}');
    expect(radio('List')).toHaveFocus();
  });

  it('should leave the selection to the parent when controlled', async () => {
    const onValueChange = vi.fn();
    const Controlled = () => {
      const [value, setValue] = React.useState('monthly');

      return (
        <SegmentedControl
          aria-label="Billing"
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            if (next !== 'lifetime') setValue(next);
          }}
        >
          <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
          <SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
          <SegmentedControlItem value="lifetime">Lifetime</SegmentedControlItem>
        </SegmentedControl>
      );
    };
    render(<Controlled />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('radio', { name: 'Yearly' }));
    expect(screen.getByRole('radio', { name: 'Yearly' })).toHaveAttribute('aria-checked', 'true');

    await user.click(screen.getByRole('radio', { name: 'Lifetime' }));
    expect(onValueChange).toHaveBeenLastCalledWith('lifetime');
    expect(screen.getByRole('radio', { name: 'Lifetime' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: 'Yearly' })).toHaveAttribute('aria-checked', 'true');
  });

  it('should render the thumb inside the selected option so it is placed before hydration', () => {
    const { radio } = setup({ defaultValue: 'board' });
    expect(radio('Board').querySelector('[data-slot="segmented-control-indicator"]')).not.toBeNull();
    expect(radio('List').querySelector('[data-slot="segmented-control-indicator"]')).toBeNull();
  });

  describe('slide', () => {
    const widths: Record<string, [number, number]> = { list: [0, 40], board: [40, 90], calendar: [210, 70] };
    const ANIMATED = ['visibility', 'transform', 'clipPath', 'opacity'];

    const stubLayout = (reducedMotion = false) => {
      const animate = vi.fn(() => ({ cancel: vi.fn(), effect: { getComputedTiming: () => ({ progress: 0 }) } }));
      Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animate });
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: (query: string) => ({ matches: reducedMotion, media: query }) as MediaQueryList,
      });
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        const item = this.closest<HTMLElement>('[data-slot="segmented-control-item"]');
        const [left, width] = item ? (widths[item.dataset.value ?? ''] ?? [0, 0]) : [0, 280];

        return { left, top: 0, width, height: 32, right: left + width, bottom: 32, x: left, y: 0 } as DOMRect;
      });

      return animate;
    };

    afterEach(() => {
      vi.restoreAllMocks();
      Reflect.deleteProperty(HTMLElement.prototype, 'animate');
      Reflect.deleteProperty(window, 'matchMedia');
    });

    it('should move the thumb with translate and clip-path only, never scale', async () => {
      const animate = stubLayout();
      const { user, radio } = setup();
      await user.click(radio('Calendar'));

      const keyframes = animate.mock.calls.flatMap((call) => (call as unknown as [Keyframe[]])[0]);
      expect(keyframes.length).toBeGreaterThan(0);
      for (const frame of keyframes) {
        expect(Object.keys(frame).every((key) => ANIMATED.includes(key))).toBe(true);
        expect(String(frame.transform ?? '')).not.toMatch(/scale/);
      }
      const clipPaths = keyframes.flatMap((frame) => (frame.clipPath ? [String(frame.clipPath)] : []));
      expect(clipPaths.every((clipPath) => clipPath.startsWith('inset('))).toBe(true);
    });

    it('should not animate when the user prefers reduced motion', async () => {
      const animate = stubLayout(true);
      const { user, radio } = setup();
      await user.click(radio('Calendar'));
      expect(animate).not.toHaveBeenCalled();
    });
  });

  it('should ignore every option when the group is disabled', async () => {
    const { user, radio, onValueChange } = setup({ disabled: true });
    expect(radio('Board')).toBeDisabled();
    await user.click(radio('Board'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('should submit the selected value under its name', async () => {
    let submitted: FormDataEntryValue | null = null;
    render(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitted = new FormData(e.currentTarget).get('period');
        }}
      >
        <SegmentedControl aria-label="Period" name="period" defaultValue="monthly">
          <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
          <SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
        </SegmentedControl>
        <button type="submit">Save</button>
      </form>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('radio', { name: 'Yearly' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(submitted).toBe('yearly');
  });
});
