import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/credit-card-input';
import * as radix from '@/registry/hirael/bases/radix/components/credit-card-input';

// Network test numbers: each passes Luhn and has a valid length for its brand.
const TEST_CARDS = [
  ['visa', '4242424242424242', '4242 4242 4242 4242'],
  ['mastercard', '5555555555554444', '5555 5555 5555 4444'],
  ['mastercard', '2223003122003222', '2223 0031 2200 3222'],
  ['amex', '378282246310005', '3782 822463 10005'],
  ['discover', '6011111111111117', '6011 1111 1111 1117'],
  ['diners', '30569309025904', '3056 930902 5904'],
  ['jcb', '3530111333300000', '3530 1113 3330 0000'],
] as const;

describe.each([
  ['radix', radix],
  ['base', base],
] as const)('credit card helpers (%s)', (_, { detectCardBrand, formatCardExpiry, formatCardNumber, luhnCheck }) => {
  describe('detectCardBrand', () => {
    it.each(TEST_CARDS)('should detect %s from %s', (brand, number) => {
      expect(detectCardBrand(number)).toBe(brand);
    });

    it('should ignore spaces and dashes', () => {
      expect(detectCardBrand('4242-4242 4242')).toBe('visa');
    });

    it('should return unknown for empty or unmatched input', () => {
      expect(detectCardBrand('')).toBe('unknown');
      expect(detectCardBrand('9999')).toBe('unknown');
    });
  });

  describe('luhnCheck', () => {
    it.each(TEST_CARDS)('should accept the %s test number', (_brand, number) => {
      expect(luhnCheck(number)).toBe(true);
    });

    it('should reject a number with one digit changed', () => {
      expect(luhnCheck('4242424242424241')).toBe(false);
    });

    it('should reject anything shorter than 12 digits', () => {
      expect(luhnCheck('0000000000')).toBe(false);
    });
  });

  describe('formatCardNumber', () => {
    it.each(TEST_CARDS)('should group %s digits the way the card prints them', (_brand, number, formatted) => {
      expect(formatCardNumber(number)).toBe(formatted);
    });

    it('should format partial input as the user types', () => {
      expect(formatCardNumber('42424')).toBe('4242 4');
      expect(formatCardNumber('3782 82')).toBe('3782 82');
    });

    it('should drop digits past the longest valid length', () => {
      expect(formatCardNumber('3782822463100059999')).toBe('3782 822463 10005');
    });

    it('should use an explicit brand over the detected one', () => {
      expect(formatCardNumber('4242424242424242', 'amex')).toBe('4242 424242 42424');
    });
  });

  describe('formatCardExpiry', () => {
    it.each([
      ['1', '1'],
      ['12', '12'],
      ['123', '12/3'],
      ['1228', '12/28'],
      ['12/289', '12/28'],
      ['ab12cd', '12'],
    ])('should format %j as %j', (input, expected) => {
      expect(formatCardExpiry(input)).toBe(expected);
    });
  });
});
