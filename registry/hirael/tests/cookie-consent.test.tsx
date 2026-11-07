import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/blocks/cookie-consent/cookie-consent';
import * as radix from '@/registry/hirael/bases/radix/blocks/cookie-consent/cookie-consent';

const registry = { radix, base };
const STORAGE_KEY = 'cookie-consent-test';

afterEach(() => window.localStorage.clear());

describe.each(Object.entries(registry))(
  'CookieConsent (%s)',
  (_, { CookieConsent, CookieConsentActions, CookieConsentCategories, CookieConsentCategory, CookieConsentManage }) => {
    const setup = () =>
      render(
        <CookieConsent storageKey={STORAGE_KEY} open>
          <CookieConsentCategories>
            <CookieConsentCategory id="necessary" name="Necessary" required />
            <CookieConsentCategory id="analytics" name="Analytics" />
            <CookieConsentCategory id="marketing" name="Marketing" />
          </CookieConsentCategories>
          <CookieConsentActions>
            <CookieConsentManage />
          </CookieConsentActions>
        </CookieConsent>,
      );

    it('should reopen with the saved choice instead of the defaults', async () => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ necessary: true, analytics: true, marketing: false }));
      setup();
      await userEvent.setup().click(screen.getByRole('button', { name: /manage/i }));
      expect(screen.getByRole('switch', { name: /analytics/i })).toBeChecked();
      expect(screen.getByRole('switch', { name: /marketing/i })).not.toBeChecked();
    });

    it('should fall back to the defaults when the saved value is not valid JSON', async () => {
      window.localStorage.setItem(STORAGE_KEY, '{not json');
      setup();
      await userEvent.setup().click(screen.getByRole('button', { name: /manage/i }));
      expect(screen.getByRole('switch', { name: /analytics/i })).not.toBeChecked();
    });
  },
);
