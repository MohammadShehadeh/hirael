'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/registry/hirael/bases/base/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

export interface Country {
  iso2: string;
  name: string;
  dialCode: string;
}

export const COUNTRIES: readonly Country[] = [
  { iso2: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
  { iso2: 'AR', name: 'Argentina', dialCode: '+54' },
  { iso2: 'AT', name: 'Austria', dialCode: '+43' },
  { iso2: 'AU', name: 'Australia', dialCode: '+61' },
  { iso2: 'BD', name: 'Bangladesh', dialCode: '+880' },
  { iso2: 'BE', name: 'Belgium', dialCode: '+32' },
  { iso2: 'BH', name: 'Bahrain', dialCode: '+973' },
  { iso2: 'BR', name: 'Brazil', dialCode: '+55' },
  { iso2: 'CA', name: 'Canada', dialCode: '+1' },
  { iso2: 'CH', name: 'Switzerland', dialCode: '+41' },
  { iso2: 'CL', name: 'Chile', dialCode: '+56' },
  { iso2: 'CN', name: 'China', dialCode: '+86' },
  { iso2: 'CO', name: 'Colombia', dialCode: '+57' },
  { iso2: 'CZ', name: 'Czechia', dialCode: '+420' },
  { iso2: 'DE', name: 'Germany', dialCode: '+49' },
  { iso2: 'DK', name: 'Denmark', dialCode: '+45' },
  { iso2: 'DZ', name: 'Algeria', dialCode: '+213' },
  { iso2: 'EG', name: 'Egypt', dialCode: '+20' },
  { iso2: 'ES', name: 'Spain', dialCode: '+34' },
  { iso2: 'FI', name: 'Finland', dialCode: '+358' },
  { iso2: 'FR', name: 'France', dialCode: '+33' },
  { iso2: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { iso2: 'GR', name: 'Greece', dialCode: '+30' },
  { iso2: 'HK', name: 'Hong Kong', dialCode: '+852' },
  { iso2: 'HU', name: 'Hungary', dialCode: '+36' },
  { iso2: 'ID', name: 'Indonesia', dialCode: '+62' },
  { iso2: 'IE', name: 'Ireland', dialCode: '+353' },
  { iso2: 'IN', name: 'India', dialCode: '+91' },
  { iso2: 'IQ', name: 'Iraq', dialCode: '+964' },
  { iso2: 'IT', name: 'Italy', dialCode: '+39' },
  { iso2: 'JO', name: 'Jordan', dialCode: '+962' },
  { iso2: 'JP', name: 'Japan', dialCode: '+81' },
  { iso2: 'KE', name: 'Kenya', dialCode: '+254' },
  { iso2: 'KR', name: 'South Korea', dialCode: '+82' },
  { iso2: 'KW', name: 'Kuwait', dialCode: '+965' },
  { iso2: 'LB', name: 'Lebanon', dialCode: '+961' },
  { iso2: 'MA', name: 'Morocco', dialCode: '+212' },
  { iso2: 'MX', name: 'Mexico', dialCode: '+52' },
  { iso2: 'MY', name: 'Malaysia', dialCode: '+60' },
  { iso2: 'NG', name: 'Nigeria', dialCode: '+234' },
  { iso2: 'NL', name: 'Netherlands', dialCode: '+31' },
  { iso2: 'NO', name: 'Norway', dialCode: '+47' },
  { iso2: 'NZ', name: 'New Zealand', dialCode: '+64' },
  { iso2: 'OM', name: 'Oman', dialCode: '+968' },
  { iso2: 'PE', name: 'Peru', dialCode: '+51' },
  { iso2: 'PH', name: 'Philippines', dialCode: '+63' },
  { iso2: 'PK', name: 'Pakistan', dialCode: '+92' },
  { iso2: 'PL', name: 'Poland', dialCode: '+48' },
  { iso2: 'PS', name: 'Palestine', dialCode: '+970' },
  { iso2: 'PT', name: 'Portugal', dialCode: '+351' },
  { iso2: 'QA', name: 'Qatar', dialCode: '+974' },
  { iso2: 'RO', name: 'Romania', dialCode: '+40' },
  { iso2: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
  { iso2: 'SE', name: 'Sweden', dialCode: '+46' },
  { iso2: 'SG', name: 'Singapore', dialCode: '+65' },
  { iso2: 'TH', name: 'Thailand', dialCode: '+66' },
  { iso2: 'TN', name: 'Tunisia', dialCode: '+216' },
  { iso2: 'TR', name: 'Turkey', dialCode: '+90' },
  { iso2: 'TW', name: 'Taiwan', dialCode: '+886' },
  { iso2: 'UA', name: 'Ukraine', dialCode: '+380' },
  { iso2: 'US', name: 'United States', dialCode: '+1' },
  { iso2: 'VN', name: 'Vietnam', dialCode: '+84' },
  { iso2: 'ZA', name: 'South Africa', dialCode: '+27' },
] as const;

/** Regional indicator pair for an ISO-2 code, e.g. "JO" -> the Jordan flag. */
export const countryFlag = (iso2: string): string => {
  const code = iso2.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return '';
  return String.fromCodePoint(...Array.from(code, (c) => 0x1f1e6 + c.charCodeAt(0) - 65));
};

/* -------------------------------------------------------------------------- */
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */

interface CountrySelectContextValue {
  id: string;
  countries: readonly Country[];
  priority: readonly Country[];
  rest: readonly Country[];
  selected: string[];
  isSelected: (iso2: string) => boolean;
  select: (iso2: string) => void;
  multiple: boolean;
  showDialCode: boolean;
  disabled?: boolean;
  open: boolean;
  setOpen: (next: boolean) => void;
  find: (iso2: string) => Country | undefined;
}

const CountrySelectContext = React.createContext<CountrySelectContextValue | null>(null);

const useCountrySelect = () => {
  const ctx = React.useContext(CountrySelectContext);
  if (!ctx) {
    throw new Error('CountrySelect compound parts must be used inside <CountrySelect>');
  }
  return ctx;
};

/* -------------------------------------------------------------------------- */
/*  Root                                                                      */
/* -------------------------------------------------------------------------- */

interface CountrySelectBaseProps {
  id?: string;
  countries?: readonly Country[];
  /** ISO-2 codes pinned to the top of the list. */
  priority?: readonly string[];
  showDialCode?: boolean;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

interface CountrySelectSingleProps extends CountrySelectBaseProps {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface CountrySelectMultipleProps extends CountrySelectBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type CountrySelectProps = CountrySelectSingleProps | CountrySelectMultipleProps;

const toList = (v: string | string[] | undefined): string[] => {
  if (v === undefined || v === '') return [];
  return Array.isArray(v) ? v : [v];
};

const NO_PRIORITY: readonly string[] = [];

const CountrySelect = (props: CountrySelectProps) => {
  const {
    id,
    countries = COUNTRIES,
    priority = NO_PRIORITY,
    showDialCode = false,
    disabled,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    children,
    multiple = false,
    value: valueProp,
    defaultValue,
  } = props;

  const reactId = React.useId();
  const selectId = id ?? reactId;

  const [internal, setInternal] = React.useState<string[]>(() => toList(defaultValue));
  const selected = React.useMemo(() => (valueProp === undefined ? internal : toList(valueProp)), [valueProp, internal]);

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const onValueChange = props.onValueChange as ((value: string | string[]) => void) | undefined;

  const emit = React.useCallback(
    (next: string[]) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(multiple ? next : (next[0] ?? ''));
    },
    [valueProp, multiple, onValueChange],
  );

  const select = React.useCallback(
    (iso2: string) => {
      const code = iso2.toUpperCase();
      if (multiple) {
        emit(selected.includes(code) ? selected.filter((c) => c !== code) : [...selected, code]);
        return;
      }
      emit([code]);
      setOpen(false);
    },
    [multiple, selected, emit, setOpen],
  );

  const { priorityList, rest } = React.useMemo(() => {
    const pinned = new Set(priority.map((p) => p.toUpperCase()));
    const priorityList = priority
      .map((p) => countries.find((c) => c.iso2 === p.toUpperCase()))
      .filter((c): c is Country => Boolean(c));
    const rest = countries.filter((c) => !pinned.has(c.iso2));
    return { priorityList, rest };
  }, [countries, priority]);

  const ctx = React.useMemo<CountrySelectContextValue>(
    () => ({
      id: selectId,
      countries,
      priority: priorityList,
      rest,
      selected,
      isSelected: (iso2) => selected.includes(iso2.toUpperCase()),
      select,
      multiple,
      showDialCode,
      disabled,
      open,
      setOpen,
      find: (iso2) => countries.find((c) => c.iso2 === iso2.toUpperCase()),
    }),
    [selectId, countries, priorityList, rest, selected, select, multiple, showDialCode, disabled, open, setOpen],
  );

  return (
    <CountrySelectContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </CountrySelectContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*  Flag                                                                      */
/* -------------------------------------------------------------------------- */

interface CountrySelectFlagProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  iso2: string;
}

const CountrySelectFlag = ({ iso2, className, ...props }: CountrySelectFlagProps) => {
  return (
    <span
      aria-hidden
      data-slot="country-select-flag"
      className={cn('inline-flex w-5 shrink-0 justify-center text-base leading-none', className)}
      {...props}
    >
      {countryFlag(iso2)}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/*  Trigger + value                                                           */
/* -------------------------------------------------------------------------- */

type CountrySelectTriggerProps = Omit<React.ComponentProps<typeof Button>, 'type' | 'role'>;

const CountrySelectTrigger = ({ className, children, variant = 'outline', ...props }: CountrySelectTriggerProps) => {
  const ctx = useCountrySelect();
  return (
    <PopoverTrigger
      render={
        <Button
          type="button"
          variant={variant}
          role="combobox"
          id={ctx.id}
          aria-expanded={ctx.open}
          aria-haspopup="listbox"
          disabled={ctx.disabled}
          data-slot="country-select-trigger"
          data-state={ctx.open ? 'open' : 'closed'}
          className={cn('w-full justify-between gap-2 px-3 font-normal', className)}
          {...props}
        />
      }
    >
      {children ?? <CountrySelectValue />}
      <ChevronDown
        aria-hidden
        className={cn(
          'size-4 shrink-0 text-muted-foreground transition-transform duration-150 motion-reduce:transition-none',
          ctx.open && 'rotate-180',
        )}
      />
    </PopoverTrigger>
  );
};

interface CountrySelectValueProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  placeholder?: string;
  /** How many names to list before collapsing to a count (multiple only). */
  maxNames?: number;
  /** Label for the collapsed count, e.g. `(n) => \`${n} countries\``. */
  countLabel?: (count: number) => string;
}

const CountrySelectValue = ({
  placeholder = 'Select a country',
  maxNames = 2,
  countLabel = (n) => `${n} countries`,
  className,
  ...props
}: CountrySelectValueProps) => {
  const ctx = useCountrySelect();
  const picked = ctx.selected.map((c) => ctx.find(c)).filter((c): c is Country => Boolean(c));

  if (picked.length === 0) {
    return (
      <span
        data-slot="country-select-value"
        data-placeholder
        className={cn('truncate text-muted-foreground', className)}
        {...props}
      >
        {placeholder}
      </span>
    );
  }

  if (picked.length === 1) {
    const c = picked[0];
    return (
      <span data-slot="country-select-value" className={cn('flex min-w-0 items-center gap-2', className)} {...props}>
        <CountrySelectFlag iso2={c.iso2} />
        <span className="truncate">{c.name}</span>
        {ctx.showDialCode && <span className="font-mono text-xs text-muted-foreground">{c.dialCode}</span>}
      </span>
    );
  }

  return (
    <span data-slot="country-select-value" className={cn('flex min-w-0 items-center gap-2', className)} {...props}>
      <span className="flex shrink-0 -space-x-0.5">
        {picked.slice(0, 3).map((c) => (
          <CountrySelectFlag key={c.iso2} iso2={c.iso2} />
        ))}
      </span>
      <span className="truncate">
        {picked.length <= maxNames ? picked.map((c) => c.name).join(', ') : countLabel(picked.length)}
      </span>
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

type CountrySelectContentProps = React.ComponentProps<typeof PopoverContent>;

const CountrySelectContent = ({
  className,
  children,
  align = 'start',
  sideOffset = 6,
  ...props
}: CountrySelectContentProps) => {
  return (
    <PopoverContent
      align={align}
      sideOffset={sideOffset}
      data-slot="country-select-content"
      className={cn('w-(--anchor-width) min-w-64 p-0', className)}
      {...props}
    >
      <Command loop data-slot="country-select-command">
        {children ?? (
          <>
            <CountrySelectSearch />
            <CountrySelectList />
          </>
        )}
      </Command>
    </PopoverContent>
  );
};

type CountrySelectSearchProps = React.ComponentProps<typeof CommandInput>;

const CountrySelectSearch = ({ placeholder = 'Search countries', className, ...props }: CountrySelectSearchProps) => {
  return <CommandInput placeholder={placeholder} data-slot="country-select-search" className={className} {...props} />;
};

interface CountrySelectListProps extends Omit<React.ComponentProps<typeof CommandList>, 'children'> {
  emptyLabel?: string;
  priorityLabel?: string;
  allLabel?: string;
}

const CountrySelectList = ({
  emptyLabel = 'No country found.',
  priorityLabel = 'Suggested',
  allLabel,
  className,
  ...props
}: CountrySelectListProps) => {
  const ctx = useCountrySelect();
  return (
    <CommandList data-slot="country-select-list" className={cn('max-h-64', className)} {...props}>
      <CommandEmpty>{emptyLabel}</CommandEmpty>
      {ctx.priority.length > 0 && (
        <>
          <CommandGroup heading={priorityLabel}>
            {ctx.priority.map((c) => (
              <CountrySelectItem key={c.iso2} country={c} />
            ))}
          </CommandGroup>
          <CommandSeparator />
        </>
      )}
      <CommandGroup heading={ctx.priority.length > 0 ? allLabel : undefined}>
        {ctx.rest.map((c) => (
          <CountrySelectItem key={c.iso2} country={c} />
        ))}
      </CommandGroup>
    </CommandList>
  );
};

interface CountrySelectItemProps extends Omit<
  React.ComponentProps<typeof CommandItem>,
  'value' | 'onSelect' | 'children'
> {
  country: Country;
  children?: React.ReactNode;
}

const CountrySelectItem = ({ country, className, children, ...props }: CountrySelectItemProps) => {
  const ctx = useCountrySelect();
  const active = ctx.isSelected(country.iso2);
  return (
    <CommandItem
      value={`${country.name} ${country.iso2}`}
      keywords={[country.iso2, country.dialCode]}
      onSelect={() => ctx.select(country.iso2)}
      data-slot="country-select-item"
      data-selected={active || undefined}
      className={cn('gap-2', className)}
      {...props}
    >
      {children ?? (
        <>
          <CountrySelectFlag iso2={country.iso2} />
          <span className="min-w-0 flex-1 truncate">{country.name}</span>
          {ctx.showDialCode && (
            <span className="shrink-0 font-mono text-xs text-muted-foreground">{country.dialCode}</span>
          )}
          <Check
            aria-hidden
            strokeWidth={3}
            className={cn('size-3.5 shrink-0 text-foreground', active ? 'opacity-100' : 'opacity-0')}
          />
        </>
      )}
    </CommandItem>
  );
};

export {
  CountrySelect,
  CountrySelectTrigger,
  CountrySelectValue,
  CountrySelectContent,
  CountrySelectSearch,
  CountrySelectList,
  CountrySelectItem,
  CountrySelectFlag,
};
