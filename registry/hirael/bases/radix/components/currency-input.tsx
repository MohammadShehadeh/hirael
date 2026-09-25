'use client';

import * as React from 'react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/registry/hirael/bases/radix/ui/input-group';

const resolveCurrencySymbol = (currency: string, locale: string): string => {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0);
    const symbol = parts.find((p) => p.type === 'currency')?.value;

    return symbol ?? currency;
  } catch {
    return currency;
  }
};

const formatNumber = (value: number, locale: string, decimals: number): string => {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch {
    return value.toFixed(decimals);
  }
};

const resolveDecimalSeparator = (locale: string): string => {
  try {
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);

    return parts.find((p) => p.type === 'decimal')?.value ?? '.';
  } catch {
    return '.';
  }
};

const sanitizeInput = (raw: string, decimals: number, decimalSeparator: string): string => {
  const kept = [...raw].filter((ch) => (ch >= '0' && ch <= '9') || ch === '-' || ch === decimalSeparator).join('');
  const [whole, ...fraction] = kept.replace(/-/g, '').split(decimalSeparator);
  const sign = kept.startsWith('-') ? '-' : '';

  return decimals > 0 && fraction.length > 0
    ? `${sign}${whole}${decimalSeparator}${fraction.join('').slice(0, decimals)}`
    : `${sign}${whole}`;
};

const parseToNumber = (view: string, decimalSeparator: string): number | null => {
  const n = Number(view.replace(decimalSeparator, '.'));

  return view && Number.isFinite(n) ? n : null;
};

interface Ctx {
  id: string;
  value: number | null;
  setValue: (next: number | null) => void;
  view: string;
  setView: (next: string) => void;
  locale: string;
  decimals: number;
  disabled?: boolean;
  symbol: string;
  decimalSeparator: string;
}

const CurrencyInputContext = React.createContext<Ctx | null>(null);

const useCurrencyInput = () => {
  const ctx = React.useContext(CurrencyInputContext);
  if (!ctx) {
    throw new Error('CurrencyInput compound parts must be used inside <CurrencyInput>');
  }

  return ctx;
};

export interface CurrencyInputProps extends Omit<
  React.ComponentProps<'div'>,
  'children' | 'value' | 'defaultValue' | 'onChange'
> {
  id?: string;
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  currency?: string;
  locale?: string;
  decimals?: number;
  disabled?: boolean;
  /** Submits the plain number (no symbol or grouping) under this name. */
  name?: string;
  children?: React.ReactNode;
}

const CurrencyInput = ({
  id,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  currency = 'USD',
  locale = 'en-US',
  decimals = 2,
  disabled,
  name,
  className,
  children,
  ...props
}: CurrencyInputProps) => {
  const reactId = React.useId();
  const fieldId = id ?? reactId;

  const [internalValue, setInternalValue] = React.useState<number | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const setValue = React.useCallback(
    (next: number | null) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const symbol = React.useMemo(() => resolveCurrencySymbol(currency, locale), [currency, locale]);

  const decimalSeparator = React.useMemo(() => resolveDecimalSeparator(locale), [locale]);

  const [view, setView] = React.useState<string>(() => (value === null ? '' : formatNumber(value, locale, decimals)));

  // Reformat on an outside value change or a new locale/precision, but not for the
  // field's own typing, or every keystroke would snap "1" to "1.00".
  const formatKey = `${locale}|${decimals}`;
  const [synced, setSynced] = React.useState({ value, formatKey });
  if (synced.value !== value || synced.formatKey !== formatKey) {
    setSynced({ value, formatKey });
    if (synced.formatKey !== formatKey || value !== parseToNumber(view, decimalSeparator)) {
      setView(value === null ? '' : formatNumber(value, locale, decimals));
    }
  }

  const ctx = React.useMemo<Ctx>(
    () => ({
      id: fieldId,
      value,
      setValue,
      view,
      setView,
      locale,
      decimals,
      disabled,
      symbol,
      decimalSeparator,
    }),
    [fieldId, value, setValue, view, locale, decimals, disabled, symbol, decimalSeparator],
  );

  return (
    <CurrencyInputContext.Provider value={ctx}>
      <InputGroup data-slot="currency-input" data-disabled={disabled} className={className} {...props}>
        {children}
        {name && <input type="hidden" name={name} value={value ?? ''} />}
      </InputGroup>
    </CurrencyInputContext.Provider>
  );
};

type CurrencyInputAffixProps = Omit<React.ComponentProps<typeof InputGroupAddon>, 'align'>;

const CurrencyInputAffix = ({ children, ...props }: React.ComponentProps<typeof InputGroupAddon>) => {
  const ctx = useCurrencyInput();

  return (
    <InputGroupAddon {...props}>
      <InputGroupText>{children ?? ctx.symbol}</InputGroupText>
    </InputGroupAddon>
  );
};

const CurrencyInputPrefix = (props: CurrencyInputAffixProps) => {
  return <CurrencyInputAffix data-slot="currency-input-prefix" align="inline-start" {...props} />;
};

const CurrencyInputSuffix = (props: CurrencyInputAffixProps) => {
  return <CurrencyInputAffix data-slot="currency-input-suffix" align="inline-end" {...props} />;
};

type CurrencyInputFieldProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'id'
>;

const CurrencyInputField = ({
  placeholder = '0',
  onBlur,
  onFocus,
  inputMode = 'decimal',
  ...props
}: CurrencyInputFieldProps) => {
  const ctx = useCurrencyInput();

  return (
    <InputGroupInput
      id={ctx.id}
      inputMode={inputMode}
      dir="ltr"
      value={ctx.view}
      disabled={ctx.disabled}
      placeholder={placeholder}
      data-slot="currency-input-field"
      onChange={(e) => {
        const sanitized = sanitizeInput(e.target.value, ctx.decimals, ctx.decimalSeparator);
        ctx.setView(sanitized);
        const parsed = parseToNumber(sanitized, ctx.decimalSeparator);
        if (parsed !== ctx.value) ctx.setValue(parsed);
      }}
      onFocus={(e) => {
        onFocus?.(e);
        if (ctx.value !== null) ctx.setView(ctx.value.toFixed(ctx.decimals).replace('.', ctx.decimalSeparator));
      }}
      onBlur={(e) => {
        onBlur?.(e);
        const parsed = parseToNumber(ctx.view, ctx.decimalSeparator);
        ctx.setView(parsed === null ? '' : formatNumber(parsed, ctx.locale, ctx.decimals));
        // Only commit a real change, so a plain focus/blur never fires onValueChange.
        if (parsed !== ctx.value) ctx.setValue(parsed);
      }}
      {...props}
    />
  );
};

export { CurrencyInput, CurrencyInputPrefix, CurrencyInputSuffix, CurrencyInputField };
