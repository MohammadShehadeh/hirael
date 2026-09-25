'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { COUNTRIES, type Country } from '@/registry/hirael/bases/base/components/country-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/hirael/bases/base/ui/command';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/registry/hirael/bases/base/ui/input-group';

export { COUNTRIES };
export type { Country };

const digitsOnly = (input: string): string => {
  return input.replace(/\D/g, '');
};

// Italy keeps its leading 0 internationally; elsewhere it's a national trunk prefix.
const KEEPS_TRUNK_ZERO = new Set(['IT']);

const toE164 = (country: Country, national: string): string => {
  const digits = digitsOnly(national);
  const subscriber = KEEPS_TRUNK_ZERO.has(country.iso2) ? digits : digits.replace(/^0/, '');

  return subscriber ? `${country.dialCode}${subscriber}` : '';
};

interface ParsedE164 {
  country: Country;
  national: string;
}

const parseE164 = (value: string | undefined, fallback: Country): ParsedE164 => {
  if (!value) return { country: fallback, national: '' };
  const trimmed = value.trim();
  if (!trimmed.startsWith('+')) {
    return { country: fallback, national: digitsOnly(trimmed) };
  }
  // Longest dial code wins; on a shared code (+1 is US and CA) prefer the fallback country.
  const sorted = [...COUNTRIES].sort(
    (a, b) => b.dialCode.length - a.dialCode.length || Number(b === fallback) - Number(a === fallback),
  );
  for (const c of sorted) {
    if (trimmed.startsWith(c.dialCode)) {
      return {
        country: c,
        national: digitsOnly(trimmed.slice(c.dialCode.length)),
      };
    }
  }

  return { country: fallback, national: digitsOnly(trimmed) };
};

interface Ctx {
  id: string;
  country: Country;
  setCountry: (next: Country) => void;
  national: string;
  setNational: (next: string) => void;
  disabled?: boolean;
}

const PhoneInputContext = React.createContext<Ctx | null>(null);

const usePhoneInput = () => {
  const ctx = React.useContext(PhoneInputContext);
  if (!ctx) {
    throw new Error('PhoneInput compound parts must be used inside <PhoneInput>');
  }

  return ctx;
};

export interface PhoneInputProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  id?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (e164: string) => void;
  defaultCountry?: string;
  disabled?: boolean;
  name?: string;
  children?: React.ReactNode;
}

const PhoneInput = ({
  id,
  value: valueProp,
  defaultValue,
  onValueChange,
  defaultCountry = 'US',
  disabled,
  name,
  className,
  children,
  ...props
}: PhoneInputProps) => {
  const reactId = React.useId();
  const fieldId = id ?? reactId;

  const fallback = React.useMemo<Country>(
    () => COUNTRIES.find((c) => c.iso2 === defaultCountry.toUpperCase()) ?? COUNTRIES[0],
    [defaultCountry],
  );

  const [country, setCountryState] = React.useState<Country>(
    () => parseE164(valueProp ?? defaultValue, fallback).country,
  );
  const [national, setNationalState] = React.useState<string>(
    () => parseE164(valueProp ?? defaultValue, fallback).national,
  );
  const isControlled = valueProp !== undefined;

  // Re-parse only when the parent's value differs from what the typed digits
  // already produce, so an echo of our own change keeps the user's spacing.
  const [prevValue, setPrevValue] = React.useState(valueProp);
  if (isControlled && valueProp !== prevValue) {
    setPrevValue(valueProp);
    if (valueProp !== toE164(country, national)) {
      const parsed = parseE164(valueProp, fallback);
      setCountryState(parsed.country);
      setNationalState(parsed.national);
    }
  }

  const emit = React.useCallback(
    (c: Country, n: string) => {
      onValueChange?.(toE164(c, n));
    },
    [onValueChange],
  );

  const setCountry = React.useCallback(
    (next: Country) => {
      setCountryState(next);
      emit(next, national);
    },
    [emit, national],
  );

  const setNational = React.useCallback(
    (next: string) => {
      setNationalState(next);
      emit(country, next);
    },
    [emit, country],
  );

  const ctx = React.useMemo<Ctx>(
    () => ({
      id: fieldId,
      country,
      setCountry,
      national,
      setNational,
      disabled,
    }),
    [fieldId, country, setCountry, national, setNational, disabled],
  );

  const e164 = isControlled ? valueProp : toE164(country, national);

  return (
    <PhoneInputContext.Provider value={ctx}>
      <InputGroup
        data-slot="phone-input"
        data-disabled={disabled || undefined}
        className={cn(disabled && 'opacity-60', className)}
        {...props}
      >
        {children}
        {name && <input type="hidden" name={name} value={e164} />}
      </InputGroup>
    </PhoneInputContext.Provider>
  );
};

type PhoneInputCountrySelectProps = Omit<React.ComponentProps<'button'>, 'children' | 'type'>;

const PhoneInputCountrySelect = ({ className, ...props }: PhoneInputCountrySelectProps) => {
  const ctx = usePhoneInput();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <InputGroupAddon align="inline-start" data-slot="phone-input-country-select" className="cursor-pointer">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <InputGroupButton
              type="button"
              size="sm"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-label={`Country code, currently ${ctx.country.name} ${ctx.country.dialCode}`}
              disabled={ctx.disabled}
              className={cn('gap-1.5 text-xs tabular-nums', className)}
              {...props}
            />
          }
        >
          <span className="font-medium text-foreground">{ctx.country.iso2}</span>
          <span className="text-muted-foreground">{ctx.country.dialCode}</span>
          <ChevronDown
            className={cn(
              'size-3 text-muted-foreground transition-transform duration-150 motion-reduce:transition-none',
              open && 'rotate-180',
            )}
          />
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={6} className="w-64 p-0" initialFocus={() => inputRef.current}>
          <Command loop>
            <CommandInput ref={inputRef} placeholder="Search countries…" />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {COUNTRIES.map((c) => (
                  <CommandItem
                    key={c.iso2}
                    value={`${c.name} ${c.iso2} ${c.dialCode}`}
                    onSelect={() => {
                      ctx.setCountry(c);
                      setOpen(false);
                    }}
                    className="justify-between"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 text-xs font-medium">{c.iso2}</span>
                      <span className="min-w-0 truncate">{c.name}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <span className="text-xs text-muted-foreground tabular-nums">{c.dialCode}</span>
                      {ctx.country.iso2 === c.iso2 && <Check className="size-3.5 text-foreground" strokeWidth={3} />}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </InputGroupAddon>
  );
};

type PhoneInputFieldProps = Omit<React.ComponentProps<'input'>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'id'>;

const PhoneInputField = ({
  placeholder = 'Phone number',
  onBlur,
  inputMode = 'tel',
  className,
  ...props
}: PhoneInputFieldProps) => {
  const ctx = usePhoneInput();

  return (
    <InputGroupInput
      id={ctx.id}
      type="tel"
      inputMode={inputMode}
      autoComplete="tel-national"
      dir="ltr"
      value={ctx.national}
      placeholder={placeholder}
      disabled={ctx.disabled}
      data-slot="phone-input-field"
      className={cn('rtl:text-right', className)}
      onChange={(e) => {
        const cleaned = e.target.value.replace(/[^\d\s]/g, '');
        ctx.setNational(cleaned);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        const normalized = ctx.national.replace(/\s+/g, ' ').trim();
        if (normalized !== ctx.national) ctx.setNational(normalized);
      }}
      {...props}
    />
  );
};

export { PhoneInput, PhoneInputCountrySelect, PhoneInputField };
