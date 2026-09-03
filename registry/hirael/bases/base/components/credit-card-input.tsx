'use client';

import * as React from 'react';
import { CreditCard } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/registry/hirael/bases/base/ui/input';

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'jcb' | 'unknown';

export interface CardBrandSpec {
  brand: CardBrand;
  label: string;
  pattern: RegExp;
  lengths: number[];
  /** Digit group sizes used when formatting, e.g. [4, 6, 5] for Amex. */
  groups: number[];
  cvcLength: number;
}

export const CARD_BRANDS: readonly CardBrandSpec[] = [
  {
    brand: 'visa',
    label: 'Visa',
    pattern: /^4/,
    lengths: [13, 16, 19],
    groups: [4, 4, 4, 4, 3],
    cvcLength: 3,
  },
  {
    brand: 'mastercard',
    label: 'Mastercard',
    pattern: /^(5[1-5]|2(2[2-9]|[3-6]|7[01]|720))/,
    lengths: [16],
    groups: [4, 4, 4, 4],
    cvcLength: 3,
  },
  {
    brand: 'amex',
    label: 'Amex',
    pattern: /^3[47]/,
    lengths: [15],
    groups: [4, 6, 5],
    cvcLength: 4,
  },
  {
    brand: 'discover',
    label: 'Discover',
    pattern: /^(6011|65|64[4-9]|622)/,
    lengths: [16, 19],
    groups: [4, 4, 4, 4, 3],
    cvcLength: 3,
  },
  {
    brand: 'diners',
    label: 'Diners',
    pattern: /^3(0[0-5]|[68])/,
    lengths: [14, 16, 19],
    groups: [4, 6, 4, 5],
    cvcLength: 3,
  },
  {
    brand: 'jcb',
    label: 'JCB',
    pattern: /^35/,
    lengths: [16, 19],
    groups: [4, 4, 4, 4, 3],
    cvcLength: 3,
  },
];

const UNKNOWN_BRAND: CardBrandSpec = {
  brand: 'unknown',
  label: 'Card',
  pattern: /^/,
  lengths: [13, 14, 15, 16, 17, 18, 19],
  groups: [4, 4, 4, 4, 3],
  cvcLength: 3,
};

const digitsOnly = (input: string): string => {
  return input.replace(/\D/g, '');
};

export const getCardBrandSpec = (brand: CardBrand): CardBrandSpec => {
  return CARD_BRANDS.find((b) => b.brand === brand) ?? UNKNOWN_BRAND;
};

/** Detect the card brand from the leading digits. Non-digits are ignored. */
export const detectCardBrand = (number: string): CardBrand => {
  const digits = digitsOnly(number);
  if (!digits) return 'unknown';
  return CARD_BRANDS.find((b) => b.pattern.test(digits))?.brand ?? 'unknown';
};

/** Luhn checksum. Returns false for anything shorter than 12 digits. */
export const luhnCheck = (number: string): boolean => {
  const digits = digitsOnly(number);
  if (digits.length < 12) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
};

/** Insert spaces per the brand's digit groups. Trims to the longest length. */
export const formatCardNumber = (number: string, brand?: CardBrand): string => {
  const spec = getCardBrandSpec(brand ?? detectCardBrand(number));
  const maxLength = Math.max(...spec.lengths);
  const digits = digitsOnly(number).slice(0, maxLength);
  const parts: string[] = [];
  let i = 0;
  for (const size of spec.groups) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + size));
    i += size;
  }
  if (i < digits.length) parts.push(digits.slice(i));
  return parts.join(' ');
};

export const formatCardExpiry = (expiry: string): string => {
  const digits = digitsOnly(expiry).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const isExpiryValid = (expiry: string, now: Date): boolean => {
  const digits = digitsOnly(expiry);
  if (digits.length !== 4) return false;
  const month = Number(digits.slice(0, 2));
  const year = 2000 + Number(digits.slice(2));
  if (month < 1 || month > 12) return false;
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  if (year < nowYear) return false;
  if (year === nowYear && month < nowMonth) return false;
  return year - nowYear <= 20;
};

export type CreditCardField = 'number' | 'expiry' | 'cvc';

export interface CreditCardValue {
  /** Digits only, no spaces. */
  number: string;
  /** `MM/YY`, or a partial string while typing. */
  expiry: string;
  cvc: string;
}

export interface CreditCardChange extends CreditCardValue {
  brand: CardBrand;
  valid: boolean;
  /** Fields that fail validation right now. */
  errors: CreditCardField[];
}

interface CreditCardInputContextValue {
  id: string;
  value: CreditCardValue;
  brand: CardBrand;
  spec: CardBrandSpec;
  errors: CreditCardField[];
  touched: Record<CreditCardField, boolean>;
  touch: (field: CreditCardField) => void;
  setField: (field: CreditCardField, next: string) => void;
  focusField: (field: CreditCardField) => void;
  register: (field: CreditCardField, el: HTMLInputElement | null) => void;
  variant: 'row' | 'stack';
  disabled?: boolean;
}

const CreditCardInputContext = React.createContext<CreditCardInputContextValue | null>(null);

const useCreditCardInput = () => {
  const ctx = React.useContext(CreditCardInputContext);
  if (!ctx) {
    throw new Error('CreditCardInput compound parts must be used inside <CreditCardInput>');
  }
  return ctx;
};

const EMPTY_VALUE: CreditCardValue = { number: '', expiry: '', cvc: '' };

export interface CreditCardInputProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  id?: string;
  value?: CreditCardValue;
  defaultValue?: CreditCardValue;
  onValueChange?: (value: CreditCardChange) => void;
  /** `row` is one bordered strip; `stack` leaves each field on its own. */
  variant?: 'row' | 'stack';
  disabled?: boolean;
}

const computeErrors = (value: CreditCardValue, spec: CardBrandSpec, now: Date): CreditCardField[] => {
  const errors: CreditCardField[] = [];
  const numberOk = spec.lengths.includes(value.number.length) && luhnCheck(value.number);
  if (!numberOk) errors.push('number');
  if (!isExpiryValid(value.expiry, now)) errors.push('expiry');
  if (digitsOnly(value.cvc).length !== spec.cvcLength) errors.push('cvc');
  return errors;
};

const CreditCardInput = ({
  id,
  value: valueProp,
  defaultValue,
  onValueChange,
  variant = 'row',
  disabled,
  className,
  children,
  ...props
}: CreditCardInputProps) => {
  const reactId = React.useId();
  const rootId = id ?? reactId;
  const [internal, setInternal] = React.useState<CreditCardValue>(defaultValue ?? EMPTY_VALUE);
  const value = valueProp ?? internal;
  const [touched, setTouched] = React.useState<Record<CreditCardField, boolean>>({
    number: false,
    expiry: false,
    cvc: false,
  });

  const brand = React.useMemo(() => detectCardBrand(value.number), [value.number]);
  const spec = React.useMemo(() => getCardBrandSpec(brand), [brand]);
  const errors = React.useMemo(() => computeErrors(value, spec, new Date()), [value, spec]);

  const inputs = React.useRef<Record<CreditCardField, HTMLInputElement | null>>({
    number: null,
    expiry: null,
    cvc: null,
  });

  const register = React.useCallback((field: CreditCardField, el: HTMLInputElement | null) => {
    inputs.current[field] = el;
  }, []);

  const focusField = React.useCallback((field: CreditCardField) => {
    const el = inputs.current[field];
    if (el) {
      el.focus();
      el.select();
    }
  }, []);

  const setField = React.useCallback(
    (field: CreditCardField, raw: string) => {
      const next: CreditCardValue = { ...value };
      if (field === 'number') {
        const nextBrand = detectCardBrand(raw);
        const max = Math.max(...getCardBrandSpec(nextBrand).lengths);
        next.number = digitsOnly(raw).slice(0, max);
      } else if (field === 'expiry') {
        next.expiry = formatCardExpiry(raw);
      } else {
        next.cvc = digitsOnly(raw).slice(0, 4);
      }
      if (valueProp === undefined) setInternal(next);
      const nextBrand = detectCardBrand(next.number);
      const nextSpec = getCardBrandSpec(nextBrand);
      const nextErrors = computeErrors(next, nextSpec, new Date());
      onValueChange?.({
        ...next,
        brand: nextBrand,
        valid: nextErrors.length === 0,
        errors: nextErrors,
      });
    },
    [value, valueProp, onValueChange],
  );

  const touch = React.useCallback((field: CreditCardField) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  }, []);

  const ctx = React.useMemo<CreditCardInputContextValue>(
    () => ({
      id: rootId,
      value,
      brand,
      spec,
      errors,
      touched,
      touch,
      setField,
      focusField,
      register,
      variant,
      disabled,
    }),
    [rootId, value, brand, spec, errors, touched, touch, setField, focusField, register, variant, disabled],
  );

  return (
    <CreditCardInputContext.Provider value={ctx}>
      <div
        data-slot="credit-card-input"
        data-variant={variant}
        data-brand={brand}
        data-disabled={disabled || undefined}
        className={cn(
          variant === 'row'
            ? cn(
                'flex w-full items-stretch overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] dark:bg-input/30',
                'has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/50',
                'has-[input[aria-invalid=true]]:border-destructive',
              )
            : 'grid w-full gap-3',
          disabled && 'opacity-60',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CreditCardInputContext.Provider>
  );
};

const ROW_INPUT =
  'h-10 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-transparent dark:bg-transparent aria-invalid:ring-0';

type FieldProps = Omit<React.ComponentProps<typeof Input>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'id'>;

interface CreditCardInputNumberProps extends FieldProps {
  /** Rendered at the end of the field. Defaults to `<CreditCardInputBrand />`. */
  children?: React.ReactNode;
}

const CreditCardInputNumber = ({
  placeholder = '1234 5678 9012 3456',
  className,
  children,
  onBlur,
  onKeyDown,
  ...props
}: CreditCardInputNumberProps) => {
  const ctx = useCreditCardInput();
  const invalid = ctx.touched.number && ctx.errors.includes('number');
  const maxLength = Math.max(...ctx.spec.lengths);
  return (
    <div
      data-slot="credit-card-input-number"
      className={cn('relative min-w-0', ctx.variant === 'row' ? 'flex-1' : undefined)}
    >
      <Input
        ref={(el) => ctx.register('number', el)}
        id={`${ctx.id}-number`}
        type="text"
        inputMode="numeric"
        autoComplete="cc-number"
        dir="ltr"
        placeholder={placeholder}
        value={formatCardNumber(ctx.value.number, ctx.brand)}
        disabled={ctx.disabled}
        aria-invalid={invalid || undefined}
        aria-label="Card number"
        data-slot="credit-card-input-number-field"
        className={cn('pe-16 font-mono tracking-[0.06em]', ctx.variant === 'row' && ROW_INPUT, className)}
        onChange={(e) => {
          ctx.setField('number', e.target.value);
          if (digitsOnly(e.target.value).length >= maxLength && ctx.spec.lengths.length === 1) {
            ctx.focusField('expiry');
          }
        }}
        onBlur={(e) => {
          ctx.touch('number');
          onBlur?.(e);
        }}
        onKeyDown={onKeyDown}
        {...props}
      />
      <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2">
        {children ?? <CreditCardInputBrand />}
      </span>
    </div>
  );
};

type CreditCardInputExpiryProps = FieldProps;

const CreditCardInputExpiry = ({
  placeholder = 'MM/YY',
  className,
  onBlur,
  onKeyDown,
  ...props
}: CreditCardInputExpiryProps) => {
  const ctx = useCreditCardInput();
  const invalid = ctx.touched.expiry && ctx.errors.includes('expiry');
  return (
    <Input
      ref={(el) => ctx.register('expiry', el)}
      id={`${ctx.id}-expiry`}
      type="text"
      inputMode="numeric"
      autoComplete="cc-exp"
      dir="ltr"
      placeholder={placeholder}
      value={ctx.value.expiry}
      disabled={ctx.disabled}
      aria-invalid={invalid || undefined}
      aria-label="Expiry date"
      data-slot="credit-card-input-expiry"
      className={cn('font-mono', ctx.variant === 'row' && cn(ROW_INPUT, 'w-20 border-s border-input'), className)}
      onChange={(e) => {
        ctx.setField('expiry', e.target.value);
        if (digitsOnly(e.target.value).length >= 4) ctx.focusField('cvc');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Backspace' && ctx.value.expiry === '') {
          ctx.focusField('number');
        }
        onKeyDown?.(e);
      }}
      onBlur={(e) => {
        ctx.touch('expiry');
        onBlur?.(e);
      }}
      {...props}
    />
  );
};

type CreditCardInputCvcProps = FieldProps;

const CreditCardInputCvc = ({
  placeholder = 'CVC',
  className,
  onBlur,
  onKeyDown,
  ...props
}: CreditCardInputCvcProps) => {
  const ctx = useCreditCardInput();
  const invalid = ctx.touched.cvc && ctx.errors.includes('cvc');
  return (
    <Input
      ref={(el) => ctx.register('cvc', el)}
      id={`${ctx.id}-cvc`}
      type="text"
      inputMode="numeric"
      autoComplete="cc-csc"
      dir="ltr"
      placeholder={placeholder}
      maxLength={ctx.spec.cvcLength}
      value={ctx.value.cvc.slice(0, ctx.spec.cvcLength)}
      disabled={ctx.disabled}
      aria-invalid={invalid || undefined}
      aria-label="Security code"
      data-slot="credit-card-input-cvc"
      className={cn('font-mono', ctx.variant === 'row' && cn(ROW_INPUT, 'w-16 border-s border-input'), className)}
      onChange={(e) => ctx.setField('cvc', e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Backspace' && ctx.value.cvc === '') {
          ctx.focusField('expiry');
        }
        onKeyDown?.(e);
      }}
      onBlur={(e) => {
        ctx.touch('cvc');
        onBlur?.(e);
      }}
      {...props}
    />
  );
};

interface CreditCardInputBrandProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  labels?: Partial<Record<CardBrand, string>>;
}

const CreditCardInputBrand = ({ labels, className, ...props }: CreditCardInputBrandProps) => {
  const ctx = useCreditCardInput();
  const label = labels?.[ctx.brand] ?? ctx.spec.label;
  return (
    <span
      data-slot="credit-card-input-brand"
      data-brand={ctx.brand}
      aria-live="polite"
      className={cn(
        'inline-flex h-5 items-center justify-center rounded-sm border border-border bg-muted px-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground',
        ctx.brand !== 'unknown' && 'text-foreground',
        className,
      )}
      {...props}
    >
      {ctx.brand === 'unknown' ? <CreditCard className="size-3.5" aria-label={label} /> : label}
    </span>
  );
};

export { CreditCardInput, CreditCardInputNumber, CreditCardInputExpiry, CreditCardInputCvc, CreditCardInputBrand };
