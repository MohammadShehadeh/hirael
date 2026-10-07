'use client';

import * as React from 'react';
import { format, unformat, useMask, type Replacement } from '@react-input/mask';

import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { composeRefs } from '@/registry/hirael/lib/compose-refs';

export interface MaskPreset {
  /** Pattern where each `replacement` key stands for one typed character, like `____ ____`. */
  mask: string;
  /** Which characters each key in `mask` accepts. */
  replacement: Replacement;
  /** Case applied to letters as they are typed. */
  transform?: 'uppercase' | 'lowercase';
  /** Example shown while empty. */
  placeholder?: string;
}

/** Common formats. Spread one into MaskedInput, or copy it as a starting point for your own. */
export const MASK_PRESETS = {
  iban: {
    mask: '____ ____ ____ ____ ____ ____ ____ __',
    replacement: { _: /[A-Za-z0-9]/ },
    transform: 'uppercase',
    placeholder: 'DE89 3704 0044 0532 0130 00',
  },
  usZip: { mask: '_____-____', replacement: { _: /\d/ }, placeholder: '94103-1234' },
  ukPostcode: {
    mask: '____ ___',
    replacement: { _: /[A-Za-z0-9]/ },
    transform: 'uppercase',
    placeholder: 'SW1A 1AA',
  },
  ssn: { mask: '___-__-____', replacement: { _: /\d/ }, placeholder: '123-45-6789' },
  date: { mask: 'dd/mm/yyyy', replacement: { d: /\d/, m: /\d/, y: /\d/ }, placeholder: 'dd/mm/yyyy' },
  time: { mask: 'hh:mm', replacement: { h: /\d/, m: /\d/ }, placeholder: 'hh:mm' },
  licensePlate: {
    mask: 'aaa-____',
    replacement: { a: /[A-Za-z]/, _: /\d/ },
    transform: 'uppercase',
    placeholder: 'ABC-1234',
  },
  ipv4: { mask: '___.___.___.___', replacement: { _: /\d/ }, placeholder: '192.168.000.001' },
} satisfies Record<string, MaskPreset>;

export interface MaskedValue {
  /** What the field shows, with the mask's separators. */
  masked: string;
  /** Only the characters typed, without separators. */
  raw: string;
  /** Every slot in the mask is filled. */
  complete: boolean;
}

export interface MaskedInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'defaultValue' | 'onChange'
> {
  /** Pattern where each `replacement` key stands for one typed character, like `___-___`. */
  mask: string;
  /** Which characters each key in `mask` accepts. Defaults to `_` for one digit. */
  replacement?: Replacement;
  /** Case applied to letters as they are typed. */
  transform?: 'uppercase' | 'lowercase';
  /** Show the whole mask, with unfilled slots, as soon as the field has a value. */
  showMask?: boolean;
  /** The masked value, as reported in `onValueChange`. Format a raw value first with `formatMasked`. */
  value?: string;
  defaultValue?: string;
  /** Fires on every edit with the masked text, the bare characters and whether the mask is full. */
  onValueChange?: (value: MaskedValue) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const DIGIT: Replacement = { _: /\d/ };

const MaskedInput = ({
  mask,
  replacement = DIGIT,
  transform,
  showMask = false,
  value,
  defaultValue,
  onValueChange,
  onChange,
  ref,
  dir = 'ltr',
  inputMode,
  ...props
}: MaskedInputProps) => {
  const slots = React.useMemo(
    () => [...mask].filter((char) => Object.hasOwn(replacement, char)).length,
    [mask, replacement],
  );
  const maskRef = useMask({
    mask,
    replacement,
    showMask,
    track: transform
      ? ({ data }) => (data === null ? data : transform === 'uppercase' ? data.toUpperCase() : data.toLowerCase())
      : undefined,
  });
  const composedRef = React.useMemo(() => composeRefs(maskRef, ref), [maskRef, ref]);
  const numeric = Object.values(replacement).every((pattern) => pattern.test('5') && !pattern.test('a'));

  return (
    <Input
      ref={composedRef}
      data-slot="masked-input"
      dir={dir}
      inputMode={inputMode ?? (numeric ? 'numeric' : undefined)}
      value={value}
      defaultValue={defaultValue}
      onChange={(event) => {
        onChange?.(event);
        const raw = unformat(event.target.value, { mask, replacement });
        onValueChange?.({ masked: event.target.value, raw, complete: raw.length === slots });
      }}
      {...props}
    />
  );
};

export interface FormatMaskedOptions extends Pick<MaskPreset, 'mask'> {
  /** Defaults to `_` for one digit, like MaskedInput. */
  replacement?: Replacement;
}

/** Applies a mask to raw characters, for a value that comes from a server rather than typing. */
const formatMasked = (raw: string, { mask, replacement = DIGIT }: FormatMaskedOptions) =>
  format(raw, { mask, replacement });

export { MaskedInput, formatMasked };
