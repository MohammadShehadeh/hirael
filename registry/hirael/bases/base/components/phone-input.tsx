'use client';

import * as React from 'react';
import { AsYouType, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';
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

const toE164 = (country: Country, national: string): string => {
  // AsYouType knows each country's trunk prefix: the UK drops its leading 0, Italy keeps it.
  const typer = new AsYouType(country.iso2 as CountryCode);
  typer.input(national);

  return typer.getNumberValue() ?? '';
};

interface ParsedE164 {
  country: Country;
  national: string;
}

const parseE164 = (value: string | undefined, fallback: Country): ParsedE164 => {
  const parsed = value ? parsePhoneNumberFromString(value, fallback.iso2 as CountryCode) : undefined;
  const dialCode = parsed && `+${parsed.countryCallingCode}`;
  // An unrecognised number still has a dial code; on a shared one (+1 is US and CA) prefer the fallback.
  const country =
    COUNTRIES.find((c) => c.iso2 === parsed?.country) ??
    (fallback.dialCode === dialCode ? fallback : COUNTRIES.find((c) => c.dialCode === dialCode)) ??
    fallback;

  return { country, national: parsed?.nationalNumber ?? value?.replace(/\D/g, '') ?? '' };
};

interface Ctx extends ParsedE164 {
  id: string;
  update: (next: ParsedE164) => void;
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

  const [phone, setPhone] = React.useState(() => parseE164(valueProp ?? defaultValue, fallback));

  // Re-parse only when the parent's value differs from what the typed digits
  // already produce, so an echo of our own change keeps the user's spacing.
  const [prevValue, setPrevValue] = React.useState(valueProp);
  if (valueProp !== undefined && valueProp !== prevValue) {
    setPrevValue(valueProp);
    if (valueProp !== toE164(phone.country, phone.national)) setPhone(parseE164(valueProp, fallback));
  }

  const update = React.useCallback(
    (next: ParsedE164) => {
      setPhone(next);
      onValueChange?.(toE164(next.country, next.national));
    },
    [onValueChange],
  );

  const ctx = React.useMemo<Ctx>(
    () => ({ id: fieldId, ...phone, update, disabled }),
    [fieldId, phone, update, disabled],
  );

  return (
    <PhoneInputContext.Provider value={ctx}>
      <InputGroup data-slot="phone-input" data-disabled={disabled} className={className} {...props}>
        {children}
        {name && <input type="hidden" name={name} value={toE164(phone.country, phone.national)} />}
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
                      ctx.update({ country: c, national: ctx.national });
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
      onChange={(e) => ctx.update({ country: ctx.country, national: e.target.value.replace(/[^\d\s]/g, '') })}
      onBlur={(e) => {
        onBlur?.(e);
        const normalized = ctx.national.replace(/\s+/g, ' ').trim();
        if (normalized !== ctx.national) ctx.update({ country: ctx.country, national: normalized });
      }}
      {...props}
    />
  );
};

export { PhoneInput, PhoneInputCountrySelect, PhoneInputField };
