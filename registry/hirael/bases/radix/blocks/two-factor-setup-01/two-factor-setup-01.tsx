'use client';

import * as React from 'react';
import { Download } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Checkbox } from '@/registry/hirael/bases/radix/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/registry/hirael/bases/radix/ui/input-otp';
import { CopyButton } from '@/registry/hirael/bases/radix/components/copy-button';
import { QRCode } from '@/registry/hirael/bases/radix/components/qr-code';
import { Spinner } from '@/registry/hirael/bases/radix/ui/spinner';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

interface TwoFactorSetupContextValue {
  step: number;
  setStep: (step: number) => void;
  count: number;
}

const TwoFactorSetupContext = React.createContext<TwoFactorSetupContextValue | null>(null);

const useTwoFactorSetup = (part: string) => {
  const ctx = React.useContext(TwoFactorSetupContext);
  if (!ctx) {
    throw new Error(`${part} must be rendered inside <TwoFactorSetup>`);
  }

  return ctx;
};

export interface TwoFactorSetupProps extends React.ComponentProps<'div'> {
  /** Controlled current step (0-based). */
  step?: number;
  /** Initial step when uncontrolled. */
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  /** Total number of steps, used by the indicator. */
  count?: number;
}

const TwoFactorSetup = ({
  step: stepProp,
  defaultStep = 0,
  onStepChange,
  count = 3,
  className,
  ...props
}: TwoFactorSetupProps) => {
  const [internal, setInternal] = React.useState(defaultStep);
  const isControlled = stepProp !== undefined;
  const step = isControlled ? stepProp : internal;

  const setStep = (next: number) => {
    const clamped = Math.max(0, Math.min(count - 1, next));
    if (!isControlled) setInternal(clamped);
    onStepChange?.(clamped);
  };

  const value = { step, setStep, count };

  return (
    <TwoFactorSetupContext.Provider value={value}>
      <div
        data-slot="two-factor-setup"
        data-step={step}
        className={cn('rounded-xl border bg-card text-card-foreground shadow-sm', className)}
        {...props}
      />
    </TwoFactorSetupContext.Provider>
  );
};

export interface TwoFactorSetupStepsProps extends React.ComponentProps<'ol'> {
  labels?: string[];
}

const stepState = (index: number, step: number) => {
  if (index < step) return 'done';
  if (index === step) return 'active';

  return 'todo';
};

const TwoFactorSetupSteps = ({ labels, className, ...props }: TwoFactorSetupStepsProps) => {
  const { step, count } = useTwoFactorSetup('TwoFactorSetupSteps');

  return (
    <ol
      data-slot="two-factor-setup-steps"
      aria-label={`Step ${step + 1} of ${count}`}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      {Array.from({ length: count }, (_, i) => {
        const state = stepState(i, step);

        return (
          <li
            key={i}
            data-slot="two-factor-setup-step-dot"
            data-state={state}
            aria-current={state === 'active' ? 'step' : undefined}
            className="flex items-center gap-2"
          >
            <span
              className={cn(
                'block h-1.5 rounded-full transition-[width,background-color] duration-200 motion-reduce:transition-none',
                state === 'active' ? 'w-6 bg-primary' : 'w-1.5',
                state === 'done' && 'bg-primary/50',
                state === 'todo' && 'bg-border',
              )}
            />
            <span className="sr-only">
              {labels?.[i] ?? `Step ${i + 1}`}
              {state === 'done' ? ', done' : ''}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export interface TwoFactorSetupStepProps extends React.ComponentProps<'div'> {
  /** 0-based index. Only the active step renders. */
  index: number;
}

const TwoFactorSetupStep = ({ index, className, ...props }: TwoFactorSetupStepProps) => {
  const { step } = useTwoFactorSetup('TwoFactorSetupStep');
  if (step !== index) return null;

  return (
    <div
      data-slot="two-factor-setup-step"
      data-index={index}
      className={cn(SWAP, 'flex flex-col gap-5', className)}
      {...props}
    />
  );
};

export interface TwoFactorSetupTitleProps extends React.ComponentProps<'h2'> {
  /** Heading level. Use `h1` when the setup is the whole page. */
  as?: 'h1' | 'h2' | 'h3';
}

const TwoFactorSetupTitle = ({ as: Heading = 'h2', className, ...props }: TwoFactorSetupTitleProps) => {
  return (
    <Heading
      data-slot="two-factor-setup-title"
      className={cn('text-xl font-semibold tracking-tight', className)}
      {...props}
    />
  );
};

const TwoFactorSetupDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
  return (
    <p data-slot="two-factor-setup-description" className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
};

export interface TwoFactorSetupQrProps extends React.ComponentProps<'div'> {
  /** otpauth:// URI encoded into the QR symbol. */
  value: string;
  size?: number;
}

const TwoFactorSetupQr = ({ value, size = 168, className, ...props }: TwoFactorSetupQrProps) => {
  return (
    <div
      data-slot="two-factor-setup-qr"
      className={cn('mx-auto inline-flex rounded-lg border bg-background p-3', className)}
      {...props}
    >
      <QRCode value={value} size={size} title="Authenticator setup code" />
    </div>
  );
};

export interface TwoFactorSetupSecretProps extends React.ComponentProps<'div'> {
  /** Base32 secret shown for manual entry. */
  value: string;
  label?: React.ReactNode;
}

const TwoFactorSetupSecret = ({
  value,
  label = "Can't scan? Enter this key",
  className,
  ...props
}: TwoFactorSetupSecretProps) => {
  const grouped =
    value
      .replace(/\s+/g, '')
      .match(/.{1,4}/g)
      ?.join(' ') ?? value;

  return (
    <div data-slot="two-factor-setup-secret" className={cn('flex flex-col gap-1.5', className)} {...props}>
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center justify-between gap-2 rounded-md border bg-background ps-3 pe-1">
        <span dir="ltr" className="text-sm tracking-wide text-foreground tabular-nums select-all">
          {grouped}
        </span>
        <CopyButton value={value.replace(/\s+/g, '')} size="sm" aria-label="Copy setup key" />
      </div>
    </div>
  );
};

export interface TwoFactorSetupCodeProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
  length?: number;
  error?: string | null;
  label?: React.ReactNode;
  disabled?: boolean;
}

const TwoFactorSetupCode = ({
  value,
  onValueChange,
  length = 6,
  error,
  label = '6-digit code',
  disabled,
  className,
  ...props
}: TwoFactorSetupCodeProps) => {
  const id = React.useId();
  const errorId = `${id}-error`;

  return (
    <Field
      data-slot="two-factor-setup-code"
      data-invalid={error ? true : undefined}
      className={cn('gap-1.5', className)}
      {...props}
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div dir="ltr">
        <InputOTP
          id={id}
          maxLength={length}
          value={value}
          onChange={onValueChange}
          pattern="^\d+$"
          inputMode="numeric"
          autoComplete="one-time-code"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          containerClassName="justify-between"
        >
          <InputOTPGroup className="w-full justify-between">
            {Array.from({ length }, (_, i) => (
              <InputOTPSlot key={i} index={i} className="size-10 sm:size-11" />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
};

export interface TwoFactorSetupRecoveryCodesProps extends React.ComponentProps<'div'> {
  codes: readonly string[];
  /** Controlled "I've saved these" state. */
  saved?: boolean;
  defaultSaved?: boolean;
  onSavedChange?: (saved: boolean) => void;
  /** File name used by the Download button. */
  fileName?: string;
}

const TwoFactorSetupRecoveryCodes = ({
  codes,
  saved: savedProp,
  defaultSaved = false,
  onSavedChange,
  fileName = 'recovery-codes.txt',
  className,
  ...props
}: TwoFactorSetupRecoveryCodesProps) => {
  const id = React.useId();
  const [saved, setControlledSaved] = useControllableState({
    prop: savedProp,
    defaultProp: defaultSaved,
    onChange: onSavedChange,
  });
  const joined = codes.join('\n');

  const download = () => {
    if (typeof document === 'undefined') return;
    const blob = new Blob([`${joined}\n`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div data-slot="two-factor-setup-recovery-codes" className={cn('flex flex-col gap-4', className)} {...props}>
      <ul dir="ltr" className="grid grid-cols-2 gap-px overflow-hidden rounded-md border bg-border">
        {codes.map((code) => (
          <li
            key={code}
            data-slot="two-factor-setup-recovery-code"
            className="bg-background px-3 py-2 text-center text-sm tracking-wide text-foreground tabular-nums"
          >
            {code}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 gap-2">
        <CopyButton value={joined} variant="outline" className="h-9 w-full" aria-label="Copy all recovery codes">
          Copy all
        </CopyButton>
        <Button type="button" variant="outline" onClick={download}>
          <Download className="size-4" />
          Download
        </Button>
      </div>

      <Field orientation="horizontal" className="gap-2">
        <Checkbox
          id={id}
          checked={saved}
          onCheckedChange={(v) => {
            const next = v === true;
            setControlledSaved(next);
          }}
        />
        <FieldLabel htmlFor={id} className="cursor-pointer">
          I&apos;ve saved these somewhere safe
        </FieldLabel>
      </Field>
    </div>
  );
};

const TwoFactorSetupFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="two-factor-setup-footer"
      className={cn('flex items-center justify-between gap-3 border-t px-6 py-4', className)}
      {...props}
    />
  );
};

const ACCOUNT = 'hello@mohammadshehadeh.com';
const ISSUER = 'Hirael';
const SECRET = 'JBSWY3DPEHPK3PXP';
const OTPAUTH_URI = `otpauth://totp/${encodeURIComponent(ISSUER)}:${encodeURIComponent(
  ACCOUNT,
)}?secret=${SECRET}&issuer=${encodeURIComponent(ISSUER)}&algorithm=SHA1&digits=6&period=30`;

const RECOVERY_CODES = [
  '4f2k-91xp',
  'mq7d-33ah',
  'z8lc-p0v2',
  'h6rt-62nk',
  'b1ye-c7qs',
  't9vm-48wd',
  'k3ng-7u5e',
  'x0pa-e2jr',
] as const;

const STEPS = [
  {
    label: 'Scan',
    title: 'Scan the QR code',
    description: `Open your authenticator app and scan the code to add your ${ISSUER} account.`,
  },
  {
    label: 'Verify',
    title: 'Enter the code',
    description: `Type the 6-digit code your app shows for ${ISSUER} to confirm it works.`,
  },
  {
    label: 'Recovery codes',
    title: 'Save your recovery codes',
    description: 'Each code works once. Use one if you lose access to your authenticator app.',
  },
];

const TwoFactorSetup01 = () => {
  const [step, setStep] = React.useState(0);
  const [code, setCode] = React.useState('');
  const [codeError, setCodeError] = React.useState<string | null>(null);
  const [verifying, setVerifying] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const formId = React.useId();

  const verify = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      setCodeError('Enter the 6-digit code from your authenticator app.');

      return;
    }
    setCodeError(null);
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 800));
    setVerifying(false);
    setStep(2);
  };

  return (
    <section
      data-slot="two-factor-setup-01-block"
      className="flex min-h-svh items-center justify-center bg-background px-4 py-12"
    >
      <TwoFactorSetup step={step} onStepChange={setStep} count={STEPS.length} className="w-full max-w-sm">
        {done ? (
          <div role="status" className={cn(SWAP, 'flex flex-col gap-6 p-6')}>
            <div className="flex flex-col gap-1.5">
              <TwoFactorSetupTitle as="h1">Two-factor authentication is on</TwoFactorSetupTitle>
              <TwoFactorSetupDescription>
                Next time you sign in, you&apos;ll enter a code from your authenticator app.
              </TwoFactorSetupDescription>
            </div>
            <Button asChild variant="outline" className="w-full">
              <a href="#">Back to security settings</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 border-b p-6">
              <TwoFactorSetupSteps labels={STEPS.map((s) => s.label)} />
              <div key={step} className={cn(SWAP, 'flex flex-col gap-1.5')}>
                <TwoFactorSetupTitle as="h1">{STEPS[step].title}</TwoFactorSetupTitle>
                <TwoFactorSetupDescription>{STEPS[step].description}</TwoFactorSetupDescription>
              </div>
            </div>

            <form id={formId} noValidate className="p-6" onSubmit={step === 1 ? verify : (e) => e.preventDefault()}>
              <TwoFactorSetupStep index={0}>
                <TwoFactorSetupQr value={OTPAUTH_URI} />
                <TwoFactorSetupSecret value={SECRET} />
              </TwoFactorSetupStep>

              <TwoFactorSetupStep index={1}>
                <TwoFactorSetupCode
                  value={code}
                  onValueChange={(v) => {
                    setCode(v);
                    if (codeError) setCodeError(null);
                  }}
                  error={codeError}
                  disabled={verifying}
                />
              </TwoFactorSetupStep>

              <TwoFactorSetupStep index={2}>
                <TwoFactorSetupRecoveryCodes
                  codes={RECOVERY_CODES}
                  saved={saved}
                  onSavedChange={setSaved}
                  fileName="hirael-recovery-codes.txt"
                />
              </TwoFactorSetupStep>
            </form>

            <TwoFactorSetupFooter>
              {step === 0 && (
                <>
                  <Button asChild variant="ghost">
                    <a href="#">Cancel</a>
                  </Button>
                  <Button type="button" onClick={() => setStep(1)}>
                    Continue
                  </Button>
                </>
              )}
              {step === 1 && (
                <>
                  <Button type="button" variant="ghost" onClick={() => setStep(0)} disabled={verifying}>
                    Back
                  </Button>
                  <Button type="submit" form={formId} disabled={verifying}>
                    {verifying && <Spinner />}
                    {verifying ? 'Verifying…' : 'Verify'}
                  </Button>
                </>
              )}
              {step === 2 && (
                <>
                  <span className="text-sm text-muted-foreground">Shown once only</span>
                  <Button type="button" disabled={!saved} onClick={() => setDone(true)}>
                    Finish setup
                  </Button>
                </>
              )}
            </TwoFactorSetupFooter>
          </>
        )}
      </TwoFactorSetup>
    </section>
  );
};

export {
  TwoFactorSetup,
  TwoFactorSetupSteps,
  TwoFactorSetupStep,
  TwoFactorSetupTitle,
  TwoFactorSetupDescription,
  TwoFactorSetupQr,
  TwoFactorSetupSecret,
  TwoFactorSetupCode,
  TwoFactorSetupRecoveryCodes,
  TwoFactorSetupFooter,
};

export default TwoFactorSetup01;
