'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/registry/hirael/bases/base/ui/input-group';

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

const resolveSeparators = (locale: string): { decimal: string; group: string } => {
  try {
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
    return {
      decimal: parts.find((p) => p.type === 'decimal')?.value ?? '.',
      group: parts.find((p) => p.type === 'group')?.value ?? ',',
    };
  } catch {
    return { decimal: '.', group: ',' };
  }
};

const sanitizeInput = (raw: string, decimals: number, decimalSeparator: string): string => {
  if (!raw) return '';
  let str = '';
  for (const ch of raw) {
    if ((ch >= '0' && ch <= '9') || ch === '-' || ch === decimalSeparator) {
      str += ch;
    }
  }
  const negative = str.startsWith('-');
  str = str.replace(/-/g, '');
  const firstSep = str.indexOf(decimalSeparator);
  if (firstSep !== -1) {
    str =
      str.slice(0, firstSep + 1) +
      str
        .slice(firstSep + 1)
        .split(decimalSeparator)
        .join('');
  }
  if (decimals === 0) {
    str = str.split(decimalSeparator).join('');
  } else if (firstSep !== -1) {
    const whole = str.slice(0, firstSep);
    const frac = str.slice(firstSep + 1);
    str = `${whole}${decimalSeparator}${frac.slice(0, decimals)}`;
  }
  return negative ? `-${str}` : str;
};

const parseToNumber = (view: string, decimalSeparator: string): number | null => {
  if (!view) return null;
  const normalized = view.split(decimalSeparator).join('.');
  if (normalized === '-' || normalized === '.' || normalized === '-.') {
    return null;
  }
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
};

interface Ctx {
  id: string;
  value: number | null;
  setValue: (next: number | null) => void;
  view: string;
  setView: (next: string) => void;
  currency: string;
  locale: string;
  decimals: number;
  disabled?: boolean;
  symbol: string;
  decimalSeparator: string;
  groupSeparator: string;
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
  className,
  children,
  ...props
}: CurrencyInputProps) => {
  const reactId = React.useId();
  const fieldId = id ?? reactId;

  const [internalValue, setInternalValue] = React.useState<number | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  // Tracks the value currently reflected in the view so the sync effect below
  // can tell an external value change apart from one the field just made while
  // typing — otherwise every keystroke gets reformatted (e.g. "1" → "1.00").
  const lastSeenValue = React.useRef<number | null | undefined>(value);

  const setValue = React.useCallback(
    (next: number | null) => {
      lastSeenValue.current = next;
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [view, setView] = React.useState<string>(() =>
    value === null || value === undefined ? '' : formatNumber(value, locale, decimals),
  );

  React.useEffect(() => {
    if (lastSeenValue.current === value) return;
    lastSeenValue.current = value;
    setView(value === null || value === undefined ? '' : formatNumber(value, locale, decimals));
  }, [value, locale, decimals]);

  const symbol = React.useMemo(() => resolveCurrencySymbol(currency, locale), [currency, locale]);

  const separators = React.useMemo(() => resolveSeparators(locale), [locale]);

  const ctx = React.useMemo<Ctx>(
    () => ({
      id: fieldId,
      value: value ?? null,
      setValue,
      view,
      setView,
      currency,
      locale,
      decimals,
      disabled,
      symbol,
      decimalSeparator: separators.decimal,
      groupSeparator: separators.group,
    }),
    [fieldId, value, setValue, view, currency, locale, decimals, disabled, symbol, separators],
  );

  return (
    <CurrencyInputContext.Provider value={ctx}>
      <InputGroup
        data-slot="currency-input"
        data-disabled={disabled || undefined}
        className={cn(disabled && 'opacity-60', className)}
        {...props}
      >
        {children}
      </InputGroup>
    </CurrencyInputContext.Provider>
  );
};

interface CurrencyInputPrefixProps extends Omit<React.ComponentProps<typeof InputGroupAddon>, 'align' | 'children'> {
  children?: React.ReactNode;
}

const CurrencyInputPrefix = ({ className, children, ...props }: CurrencyInputPrefixProps) => {
  const ctx = useCurrencyInput();
  return (
    <InputGroupAddon data-slot="currency-input-prefix" align="inline-start" className={className} {...props}>
      <InputGroupText className="font-mono">{children ?? ctx.symbol}</InputGroupText>
    </InputGroupAddon>
  );
};

interface CurrencyInputSuffixProps extends Omit<React.ComponentProps<typeof InputGroupAddon>, 'align' | 'children'> {
  children?: React.ReactNode;
}

const CurrencyInputSuffix = ({ className, children, ...props }: CurrencyInputSuffixProps) => {
  const ctx = useCurrencyInput();
  return (
    <InputGroupAddon data-slot="currency-input-suffix" align="inline-end" className={className} {...props}>
      <InputGroupText className="font-mono">{children ?? ctx.symbol}</InputGroupText>
    </InputGroupAddon>
  );
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
      type="text"
      inputMode={inputMode}
      value={ctx.view}
      disabled={ctx.disabled}
      placeholder={placeholder}
      data-slot="currency-input-field"
      onChange={(e) => {
        const sanitized = sanitizeInput(e.target.value, ctx.decimals, ctx.decimalSeparator);
        ctx.setView(sanitized);
        const parsed = parseToNumber(sanitized, ctx.decimalSeparator);
        ctx.setValue(parsed);
      }}
      onFocus={(e) => {
        onFocus?.(e);
        if (ctx.value === null || ctx.value === undefined) return;
        const raw =
          ctx.decimals > 0
            ? ctx.value.toFixed(ctx.decimals).replace('.', ctx.decimalSeparator)
            : String(Math.trunc(ctx.value));
        ctx.setView(raw);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        const parsed = parseToNumber(ctx.view, ctx.decimalSeparator);
        if (parsed === null) {
          ctx.setView('');
          ctx.setValue(null);
          return;
        }
        ctx.setView(formatNumber(parsed, ctx.locale, ctx.decimals));
        ctx.setValue(parsed);
      }}
      {...props}
    />
  );
};

export { CurrencyInput, CurrencyInputPrefix, CurrencyInputSuffix, CurrencyInputField };
