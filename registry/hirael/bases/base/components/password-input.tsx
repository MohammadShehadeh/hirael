'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/registry/hirael/bases/base/ui/input-group';

export interface PasswordStrength {
  score: number;
  label: string;
  hint?: string;
}

export type PasswordScorer = (value: string) => PasswordStrength;

const LABELS = ['weak', 'weak', 'fair', 'good', 'strong'];
const HINTS = [
  '8+ chars, mix character types',
  'Try a longer passphrase',
  'Add a number or symbol',
  'Nearly there, make it longer',
  'Strong',
];

export const defaultPasswordScorer: PasswordScorer = (value) => {
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(value)).length;
  const score = Number(value.length >= 8) + Number(value.length >= 12) + Number(classes >= 2) + Number(classes >= 3);

  return { score, label: LABELS[score], hint: HINTS[score] };
};

interface Ctx {
  id: string;
  value: string;
  setValue: (v: string) => void;
  visible: boolean;
  setVisible: (v: boolean) => void;
  disabled?: boolean;
  strength: PasswordStrength;
}

const PasswordContext = React.createContext<Ctx | null>(null);

const usePasswordContext = () => {
  const ctx = React.useContext(PasswordContext);
  if (!ctx) {
    throw new Error('PasswordInput compound parts must be used inside <PasswordInput>');
  }

  return ctx;
};

export interface PasswordInputProps extends React.ComponentProps<'div'> {
  id?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  scorer?: PasswordScorer;
  children: React.ReactNode;
}

const PasswordInput = ({
  id,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  disabled,
  scorer = defaultPasswordScorer,
  className,
  children,
  ...props
}: PasswordInputProps) => {
  const reactId = React.useId();
  const fieldId = id ?? reactId;

  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = valueProp ?? internalValue;
  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [visible, setVisible] = React.useState(false);

  const strength = React.useMemo(() => scorer(value), [scorer, value]);

  const ctx = React.useMemo<Ctx>(
    () => ({ id: fieldId, value, setValue, visible, setVisible, disabled, strength }),
    [fieldId, value, setValue, visible, disabled, strength],
  );

  return (
    <PasswordContext.Provider value={ctx}>
      <div data-slot="password-input" className={cn('flex flex-col gap-2', className)} {...props}>
        {children}
      </div>
    </PasswordContext.Provider>
  );
};

interface PasswordInputFieldProps extends Omit<
  React.ComponentProps<'input'>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'id'
> {
  toggleLabel?: { show: string; hide: string };
}

/**
 * Defaults to `autoComplete="current-password"`; pass
 * `autoComplete="new-password"` for signup / change-password forms.
 */
const PasswordInputField = ({
  toggleLabel = { show: 'Show password', hide: 'Hide password' },
  className,
  ...props
}: PasswordInputFieldProps) => {
  const ctx = usePasswordContext();

  return (
    <InputGroup data-slot="password-input-field" data-disabled={ctx.disabled} className={className}>
      <InputGroupInput
        id={ctx.id}
        type={ctx.visible ? 'text' : 'password'}
        value={ctx.value}
        onChange={(e) => ctx.setValue(e.target.value)}
        disabled={ctx.disabled}
        autoComplete="current-password"
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-sm"
          aria-label={ctx.visible ? toggleLabel.hide : toggleLabel.show}
          aria-pressed={ctx.visible}
          disabled={ctx.disabled}
          onClick={() => ctx.setVisible(!ctx.visible)}
        >
          {ctx.visible ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

const STRENGTH_COLORS = ['bg-destructive', 'bg-destructive', 'bg-warning', 'bg-primary', 'bg-success'];

const PasswordInputStrength = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { value, strength } = usePasswordContext();
  const bar = STRENGTH_COLORS[strength.score] ?? STRENGTH_COLORS[0];

  return (
    <div data-slot="password-input-strength" className={cn('flex flex-col gap-1.5', className)} {...props}>
      <div
        role="meter"
        aria-label="Password strength"
        aria-valuenow={strength.score}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuetext={strength.label}
        className="grid grid-cols-4 gap-1"
      >
        {[1, 2, 3, 4].map((tier) => (
          <span
            key={tier}
            className={cn(
              'h-1 rounded-sm bg-border transition-colors duration-200 ease-out',
              strength.score >= tier && bar,
            )}
          />
        ))}
      </div>
      {value && (
        <div aria-live="polite" className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground uppercase">{strength.label}</span>
          {strength.hint && <span className="text-[11px] text-muted-foreground">{strength.hint}</span>}
        </div>
      )}
    </div>
  );
};

export { PasswordInput, PasswordInputField, PasswordInputStrength };
