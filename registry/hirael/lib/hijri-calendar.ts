import { getDateLib } from '@daypicker/hijri';
import type { Formatters } from 'react-day-picker';

const hijriLib = getDateLib();
// The instance fixes its locale and week start when created; its raw overrides read them from the calendar on every call.
const dateLib = hijriLib.overrides;

/**
 * The Umm al-Qura Hijri calendar for Hirael's date pickers: `<DatePicker calendar={hijriCalendar}>`.
 * Spread `hijriCalendar.props` onto a shadcn `<Calendar>` to use it on its own.
 * Values stay plain `Date`s, so storage and comparisons don't change.
 */
export const hijriCalendar = {
  /** Intl calendar id, used to format the trigger label. */
  intl: 'islamic-umalqura',
  props: {
    dateLib,
    // The Umm al-Qura conversion tables only cover this range; outside it the grid falls back to Gregorian.
    startMonth: new Date(1924, 7, 1),
    endMonth: new Date(2077, 10, 16),
    formatters: {
      // shadcn's Calendar formats dropdown months with toLocaleString, which is always Gregorian.
      formatMonthDropdown: (month, lib = hijriLib) => lib.format(month, 'LLL'),
    } satisfies Partial<Formatters>,
  },
};
