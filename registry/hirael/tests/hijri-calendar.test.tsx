import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { arSA } from '@daypicker/hijri';

import { hijriCalendar } from '@/registry/hirael/lib/hijri-calendar';
import * as baseDate from '@/registry/hirael/bases/base/components/date-picker';
import * as baseRange from '@/registry/hirael/bases/base/components/date-range-picker';
import * as baseDateTime from '@/registry/hirael/bases/base/components/date-time-picker';
import * as radixDate from '@/registry/hirael/bases/radix/components/date-picker';
import * as radixRange from '@/registry/hirael/bases/radix/components/date-range-picker';
import * as radixDateTime from '@/registry/hirael/bases/radix/components/date-time-picker';

const trigger = (slot: string) => document.querySelector(`[data-slot="${slot}"]`);

describe.each([
  ['radix', radixDate, radixRange, radixDateTime],
  ['base', baseDate, baseRange, baseDateTime],
] as const)('hijriCalendar (%s)', (_, date, range, dateTime) => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 2, 25, 12));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should label the trigger and the grid with the Hijri date', async () => {
    const { DatePicker, DatePickerContent, DatePickerTrigger } = date;
    render(
      <DatePicker defaultOpen defaultValue={new Date(2026, 2, 20)} calendar={hijriCalendar}>
        <DatePickerTrigger />
        <DatePickerContent />
      </DatePicker>,
    );

    expect(trigger('date-picker-trigger')).toHaveTextContent('Shaw. 1, 1447 AH');
    expect(await screen.findByText('Shawwal 1447')).toBeInTheDocument();
  });

  it('should follow the calendar locale and week start', async () => {
    const { DatePicker, DatePickerContent, DatePickerTrigger } = date;
    render(
      <DatePicker defaultOpen defaultValue={new Date(2026, 2, 20)} calendar={hijriCalendar} locale="ar-SA">
        <DatePickerTrigger />
        <DatePickerContent locale={arSA} weekStartsOn={6} />
      </DatePicker>,
    );

    expect(await screen.findByText('شوال 1447')).toBeInTheDocument();
    expect(document.querySelector('.rdp-weekday')).toHaveAttribute('aria-label', 'السبت');
  });

  it('should keep the value a Gregorian Date when a Hijri day is picked', async () => {
    const { DatePicker, DatePickerContent, DatePickerTrigger } = date;
    const onValueChange = vi.fn();
    render(
      <DatePicker
        defaultOpen
        defaultValue={new Date(2026, 2, 20)}
        calendar={hijriCalendar}
        onValueChange={onValueChange}
      >
        <DatePickerTrigger />
        <DatePickerContent />
      </DatePicker>,
    );

    fireEvent.click(await screen.findByRole('button', { name: /Shawwal 2, 1447/ }));

    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 2, 21));
  });

  it('should fill the month presets with the Hijri month', async () => {
    const { DateRangePicker, DateRangePickerContent, DateRangePickerTrigger } = range;
    const onValueChange = vi.fn();
    render(
      <DateRangePicker defaultOpen calendar={hijriCalendar} onValueChange={onValueChange}>
        <DateRangePickerTrigger />
        <DateRangePickerContent />
      </DateRangePicker>,
    );

    fireEvent.click(await screen.findByRole('button', { name: 'This month' }));

    expect(onValueChange).toHaveBeenCalledWith({ from: new Date(2026, 2, 20), to: new Date(2026, 3, 17) });
  });

  it('should keep Gregorian month presets without a calendar', async () => {
    const { DateRangePicker, DateRangePickerContent, DateRangePickerTrigger } = range;
    const onValueChange = vi.fn();
    render(
      <DateRangePicker defaultOpen onValueChange={onValueChange}>
        <DateRangePickerTrigger />
        <DateRangePickerContent />
      </DateRangePicker>,
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Last month' }));

    expect(onValueChange).toHaveBeenCalledWith({ from: new Date(2026, 1, 1), to: new Date(2026, 1, 28) });
  });

  it('should label the date time trigger with the Hijri date', async () => {
    const { DateTimePicker, DateTimePickerTrigger } = dateTime;
    render(
      <DateTimePicker defaultValue={new Date(2026, 2, 20, 9, 30)} calendar={hijriCalendar}>
        <DateTimePickerTrigger />
      </DateTimePicker>,
    );

    await waitFor(() => expect(trigger('date-time-picker-trigger')).toHaveTextContent(/Shaw\. 1, 1447 AH.*9:30/));
  });
});
