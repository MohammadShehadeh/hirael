'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  CountrySelect,
  CountrySelectContent,
  CountrySelectList,
  CountrySelectSearch,
  CountrySelectTrigger,
} from '@/registry/hirael/bases/base/components/country-select';
import { Field, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';

export type AddressField = 'line1' | 'line2' | 'city' | 'region' | 'postalCode';

export interface AddressValue {
  /** ISO-2 country code, the one field that decides the rest of the layout. */
  country: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
}

export interface AddressFormat {
  /** Fields to render, a row at a time. Fields sharing a row sit side by side. */
  rows: AddressField[][];
  labels: Record<AddressField, string>;
  /** Native `pattern` for the postal field, where the country has a stable one. */
  postalPattern?: string;
}

export const EMPTY_ADDRESS: AddressValue = {
  country: '',
  line1: '',
  line2: '',
  city: '',
  region: '',
  postalCode: '',
};

const AUTOCOMPLETE: Record<AddressField, string> = {
  line1: 'address-line1',
  line2: 'address-line2',
  city: 'address-level2',
  region: 'address-level1',
  postalCode: 'postal-code',
};

const DEFAULT_FORMAT: AddressFormat = {
  rows: [['line1'], ['line2'], ['postalCode', 'city'], ['region']],
  labels: {
    line1: 'Address',
    line2: 'Apartment, suite, etc.',
    city: 'City',
    region: 'Region',
    postalCode: 'Postal code',
  },
};

/** Per-country overrides on top of {@link DEFAULT_FORMAT}; unlisted countries use the default. */
export const ADDRESS_FORMATS: Record<string, Partial<AddressFormat>> = {
  US: {
    rows: [['line1'], ['line2'], ['city'], ['region', 'postalCode']],
    labels: { ...DEFAULT_FORMAT.labels, region: 'State', postalCode: 'ZIP code' },
    postalPattern: '\\d{5}(-\\d{4})?',
  },
  CA: {
    rows: [['line1'], ['line2'], ['city'], ['region', 'postalCode']],
    labels: { ...DEFAULT_FORMAT.labels, region: 'Province', postalCode: 'Postal code' },
  },
  GB: {
    rows: [['line1'], ['line2'], ['city'], ['region'], ['postalCode']],
    labels: {
      ...DEFAULT_FORMAT.labels,
      line2: 'Flat, unit, etc.',
      city: 'Town or city',
      region: 'County',
      postalCode: 'Postcode',
    },
  },
  AU: {
    rows: [['line1'], ['line2'], ['city'], ['region', 'postalCode']],
    labels: { ...DEFAULT_FORMAT.labels, city: 'Suburb', region: 'State', postalCode: 'Postcode' },
    postalPattern: '\\d{4}',
  },
  JP: {
    rows: [['postalCode'], ['region'], ['city'], ['line1'], ['line2']],
    labels: { ...DEFAULT_FORMAT.labels, region: 'Prefecture', city: 'City or ward' },
    postalPattern: '\\d{3}-?\\d{4}',
  },
  DE: { rows: [['line1'], ['line2'], ['postalCode', 'city']], postalPattern: '\\d{5}' },
  FR: { rows: [['line1'], ['line2'], ['postalCode', 'city']], postalPattern: '\\d{5}' },
  ES: { rows: [['line1'], ['line2'], ['postalCode', 'city']], postalPattern: '\\d{5}' },
  IT: { rows: [['line1'], ['line2'], ['postalCode', 'city']], postalPattern: '\\d{5}' },
  NL: { rows: [['line1'], ['line2'], ['postalCode', 'city']] },
  SE: { rows: [['line1'], ['line2'], ['postalCode', 'city']] },
  BR: {
    rows: [['postalCode'], ['line1'], ['line2'], ['city', 'region']],
    labels: { ...DEFAULT_FORMAT.labels, region: 'State', postalCode: 'CEP' },
  },
};

export const formatForCountry = (
  country: string,
  overrides: Record<string, Partial<AddressFormat>> = ADDRESS_FORMATS,
): AddressFormat => {
  const patch = overrides[country.toUpperCase()];
  if (!patch) return DEFAULT_FORMAT;

  return {
    rows: patch.rows ?? DEFAULT_FORMAT.rows,
    labels: { ...DEFAULT_FORMAT.labels, ...patch.labels },
    postalPattern: patch.postalPattern,
  };
};

interface AddressInputContextValue {
  value: AddressValue;
  setField: (field: AddressField | 'country', next: string) => void;
  format: AddressFormat;
  labelFor: (field: AddressField) => string;
  fieldId: (field: AddressField | 'country') => string;
  countryLabel: string;
  disabled?: boolean;
  readOnly?: boolean;
}

const AddressInputContext = React.createContext<AddressInputContextValue | null>(null);

const useAddressInput = () => {
  const ctx = React.useContext(AddressInputContext);
  if (!ctx) {
    throw new Error('AddressInput compound parts must be used inside <AddressInput>');
  }

  return ctx;
};

export interface AddressInputProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  value?: AddressValue;
  defaultValue?: Partial<AddressValue>;
  onValueChange?: (value: AddressValue) => void;
  /** Extra or replacement country formats, merged over the built-in table. */
  formats?: Record<string, Partial<AddressFormat>>;
  /** Overrides the format's labels, one field at a time. */
  labels?: Partial<Record<AddressField | 'country', string>>;
  disabled?: boolean;
  readOnly?: boolean;
  children?: React.ReactNode;
}

const AddressInput = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  formats,
  labels,
  disabled,
  readOnly,
  className,
  children,
  ...props
}: AddressInputProps) => {
  const [internalValue, setInternalValue] = React.useState<AddressValue>({ ...EMPTY_ADDRESS, ...defaultValue });
  const value = valueProp ?? internalValue;
  const id = React.useId();

  const setField = React.useCallback(
    (field: AddressField | 'country', next: string) => {
      if (disabled || readOnly) return;
      const updated = { ...value, [field]: next };
      if (valueProp === undefined) setInternalValue(updated);
      onValueChange?.(updated);
    },
    [disabled, readOnly, value, valueProp, onValueChange],
  );

  const format = React.useMemo(
    () => formatForCountry(value.country, formats ? { ...ADDRESS_FORMATS, ...formats } : ADDRESS_FORMATS),
    [value.country, formats],
  );

  const labelFor = React.useCallback(
    (field: AddressField) => labels?.[field] ?? format.labels[field],
    [labels, format],
  );

  const fieldId = React.useCallback((field: AddressField | 'country') => `${id}-${field}`, [id]);

  const ctx = React.useMemo<AddressInputContextValue>(
    () => ({
      value,
      setField,
      format,
      labelFor,
      fieldId,
      countryLabel: labels?.country ?? 'Country',
      disabled,
      readOnly,
    }),
    [value, setField, format, labelFor, fieldId, labels?.country, disabled, readOnly],
  );

  return (
    <AddressInputContext.Provider value={ctx}>
      <div data-slot="address-input" className={cn('flex flex-col gap-4', className)} {...props}>
        {children ?? (
          <>
            <AddressInputCountry />
            <AddressInputFields />
          </>
        )}
      </div>
    </AddressInputContext.Provider>
  );
};

export interface AddressInputCountryProps extends React.ComponentProps<'div'> {
  label?: React.ReactNode;
  /** ISO-2 codes pinned to the top of the country list. */
  priority?: readonly string[];
}

const AddressInputCountry = ({ label, priority, className, ...props }: AddressInputCountryProps) => {
  const ctx = useAddressInput();
  const id = ctx.fieldId('country');

  return (
    <Field data-slot="address-input-country" className={cn('gap-2', className)} {...props}>
      <FieldLabel htmlFor={id}>{label ?? ctx.countryLabel}</FieldLabel>
      <CountrySelect
        id={id}
        value={ctx.value.country}
        onValueChange={(country) => ctx.setField('country', country)}
        disabled={ctx.disabled || ctx.readOnly}
        priority={priority}
      >
        <CountrySelectTrigger />
        <CountrySelectContent>
          <CountrySelectSearch />
          <CountrySelectList />
        </CountrySelectContent>
      </CountrySelect>
    </Field>
  );
};

export interface AddressInputFieldProps extends Omit<
  React.ComponentProps<'input'>,
  'value' | 'defaultValue' | 'onChange'
> {
  field: AddressField;
  label?: React.ReactNode;
  /** Styles the label-and-input wrapper; `className` styles the input itself. */
  fieldClassName?: string;
}

const AddressInputField = ({ field, label, fieldClassName, className, ...props }: AddressInputFieldProps) => {
  const ctx = useAddressInput();
  const id = ctx.fieldId(field);
  const isPostal = field === 'postalCode';

  return (
    <Field data-slot="address-input-field" data-field={field} className={cn('gap-2', fieldClassName)}>
      <FieldLabel htmlFor={id}>{label ?? ctx.labelFor(field)}</FieldLabel>
      <Input
        id={id}
        value={ctx.value[field]}
        onChange={(e) => ctx.setField(field, e.target.value)}
        autoComplete={AUTOCOMPLETE[field]}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        pattern={isPostal ? ctx.format.postalPattern : undefined}
        inputMode={isPostal && ctx.format.postalPattern?.startsWith('\\d') ? 'numeric' : undefined}
        className={className}
        {...props}
      />
    </Field>
  );
};

const AddressInputFields = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const ctx = useAddressInput();

  return (
    <div data-slot="address-input-fields" className={cn('flex flex-col gap-4', className)} {...props}>
      {ctx.format.rows.map((row) => (
        <div
          key={row.join('-')}
          data-slot="address-input-row"
          className={cn('grid gap-4', row.length > 1 && 'sm:grid-cols-2')}
        >
          {row.map((field) => (
            <AddressInputField key={field} field={field} />
          ))}
        </div>
      ))}
    </div>
  );
};

export { AddressInput, AddressInputCountry, AddressInputField, AddressInputFields };
