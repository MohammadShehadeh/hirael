import { describe, expect, it } from 'vitest';

import { formatDay, NEW_WINDOW_DAYS, newBadgeRemainingMs } from '@/lib/freshness';

const DAY_MS = 24 * 60 * 60 * 1000;
const at = (day: string) => Date.parse(`${day}T00:00:00Z`);

describe('newBadgeRemainingMs', () => {
  it('should count down from the release day', () => {
    expect(newBadgeRemainingMs('2026-09-20', at('2026-09-20'))).toBe(NEW_WINDOW_DAYS * DAY_MS);
    expect(newBadgeRemainingMs('2026-09-20', at('2026-09-22'))).toBe((NEW_WINDOW_DAYS - 2) * DAY_MS);
  });

  it('should be zero once the window has passed', () => {
    expect(newBadgeRemainingMs('2026-09-20', at('2026-09-27'))).toBe(0);
    expect(newBadgeRemainingMs('2026-09-20', at('2027-01-01'))).toBe(0);
  });

  it('should be zero for undated or malformed days', () => {
    expect(newBadgeRemainingMs(undefined)).toBe(0);
    expect(newBadgeRemainingMs(null)).toBe(0);
    expect(newBadgeRemainingMs('not-a-day')).toBe(0);
  });
});

describe('formatDay', () => {
  it('should format in UTC so server and client agree', () => {
    expect(formatDay('2026-09-20')).toBe('20 Sept 2026');
  });
});
