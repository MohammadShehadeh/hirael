'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Download, Loader2, ShieldCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Checkbox } from '@/registry/hirael/bases/base/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/registry/hirael/bases/base/ui/input-otp';
import { CopyButton } from '@/registry/hirael/bases/base/components/copy-button';
import { QRCode } from '@/registry/hirael/bases/base/components/qr-code';

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

  const setStep = React.useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(count - 1, next));
      if (!isControlled) setInternal(clamped);
      onStepChange?.(clamped);
    },
    [count, isControlled, onStepChange],
  );

  const value = React.useMemo(() => ({ step, setStep, count }), [step, setStep, count]);

  return (
    <TwoFactorSetupContext.Provider value={value}>
      <div
        data-slot="two-factor-setup"
        data-step={step}
        className={cn('rounded-sm border border-border bg-card text-card-foreground', className)}
        style={{ boxShadow: '8px 8px 0 0 var(--border)' }}
        {...props}
      />
    </TwoFactorSetupContext.Provider>
  );
};

export interface TwoFactorSetupStepsProps extends React.ComponentProps<'ol'> {
  labels?: string[];
}

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
        const state = i < step ? 'done' : i === step ? 'active' : 'todo';
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
                'block h-1.5 rounded-full transition-all duration-200 motion-reduce:transition-none',
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
      className={cn('flex flex-col gap-5', className)}
      {...props}
    />
  );
};

const TwoFactorSetupTitle = ({ className, ...props }: React.ComponentProps<'h2'>) => {
  return (
    <h2
      data-slot="two-factor-setup-title"
      className={cn('font-serif text-3xl font-medium tracking-tight', className)}
      {...props}
    />
  );
};

const TwoFactorSetupDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
  return (
    <p data-slot="two-factor-setup-description" className={cn('text-xs text-muted-foreground', className)} {...props} />
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
      className={cn('mx-auto inline-flex rounded-sm border border-border bg-background p-3', className)}
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
  const grouped = React.useMemo(
    () =>
      value
        .replace(/\s+/g, '')
        .match(/.{1,4}/g)
        ?.join(' ') ?? value,
    [value],
  );
  return (
    <div data-slot="two-factor-setup-secret" className={cn('flex flex-col gap-1.5', className)} {...props}>
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
      <div className="flex items-center justify-between gap-2 rounded-sm border border-border bg-background ps-3 pe-1">
        <code dir="ltr" className="select-all font-mono text-sm tracking-[0.08em] text-foreground">
          {grouped}
        </code>
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
      <FieldLabel htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </FieldLabel>
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
          <InputOTPGroup className="w-full justify-between gap-2">
            {Array.from({ length }, (_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="size-11 rounded-sm border border-input font-mono text-base tabular-nums first:rounded-s-sm last:rounded-e-sm"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <FieldError id={errorId} className="text-xs">
        {error}
      </FieldError>
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
  const [internalSaved, setInternalSaved] = React.useState(defaultSaved);
  const saved = savedProp ?? internalSaved;
  const joined = React.useMemo(() => codes.join('\n'), [codes]);

  const download = React.useCallback(() => {
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
  }, [joined, fileName]);

  return (
    <div data-slot="two-factor-setup-recovery-codes" className={cn('flex flex-col gap-4', className)} {...props}>
      <ul dir="ltr" className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border">
        {codes.map((code) => (
          <li
            key={code}
            data-slot="two-factor-setup-recovery-code"
            className="bg-background px-3 py-2 text-center font-mono text-sm tabular-nums tracking-[0.06em] text-foreground"
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
            if (savedProp === undefined) setInternalSaved(next);
            onSavedChange?.(next);
          }}
        />
        <FieldLabel htmlFor={id} className="cursor-pointer text-xs font-normal text-muted-foreground">
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
      className={cn('flex items-center justify-between gap-3 border-t border-border px-8 py-4', className)}
      {...props}
    />
  );
};

const ACCOUNT = 'ada@studio.com';
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

const STEP_LABELS = ['Scan', 'Verify', 'Recovery codes'];

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
      <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
      <path d="M22 86 H58" opacity="0.7" />
      <path d="M28 92 H52" opacity="0.45" />
      <path d="M34 96 H46" opacity="0.25" />
    </svg>
  );
};

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
      setCodeError('Enter the six digits from your authenticator app.');
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
      className="relative isolate flex min-h-svh items-center justify-center bg-background py-16 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="mx-auto w-full max-w-md px-6">
        <TwoFactorSetup step={step} onStepChange={setStep} count={3}>
          {done ? (
            <div role="status" aria-live="polite" className="flex flex-col items-center gap-4 px-8 py-10 text-center">
              <span className="inline-flex size-10 items-center justify-center rounded-sm border border-border bg-background text-foreground">
                <CheckCircle2 className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <TwoFactorSetupTitle>Two-factor is on</TwoFactorSetupTitle>
                <TwoFactorSetupDescription>
                  You&apos;ll be asked for a code from your authenticator app the next time you sign in.
                </TwoFactorSetupDescription>
              </div>
              <a
                href="#"
                className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Back to security settings
              </a>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4 border-b border-border px-8 pb-6 pt-8">
                <div className="flex size-10 items-center justify-center rounded-sm border border-border bg-background">
                  <BrandMark className="size-6 text-foreground" />
                </div>
                <TwoFactorSetupSteps labels={STEP_LABELS} />
                <div className="flex flex-col items-center gap-1 text-center">
                  {step === 0 ? (
                    <>
                      <TwoFactorSetupTitle>Scan this code</TwoFactorSetupTitle>
                      <TwoFactorSetupDescription>
                        Open your authenticator app (1Password, Authy, Google Authenticator) and scan the QR code.
                      </TwoFactorSetupDescription>
                    </>
                  ) : step === 1 ? (
                    <>
                      <TwoFactorSetupTitle>Enter the code</TwoFactorSetupTitle>
                      <TwoFactorSetupDescription>
                        Type the six digits your app shows for{' '}
                        <span className="font-mono text-foreground">{ISSUER}</span> to confirm it&apos;s set up
                        correctly.
                      </TwoFactorSetupDescription>
                    </>
                  ) : (
                    <>
                      <TwoFactorSetupTitle>Save your recovery codes</TwoFactorSetupTitle>
                      <TwoFactorSetupDescription>
                        Each code works once. Use them if you lose access to your authenticator app.
                      </TwoFactorSetupDescription>
                    </>
                  )}
                </div>
              </div>

              <form id={formId} noValidate className="p-8" onSubmit={step === 1 ? verify : (e) => e.preventDefault()}>
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
                {step === 0 ? (
                  <>
                    <a
                      href="#"
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Cancel
                    </a>
                    <Button type="button" className="group" onClick={() => setStep(1)}>
                      Continue
                      <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                    </Button>
                  </>
                ) : step === 1 ? (
                  <>
                    <Button type="button" variant="ghost" onClick={() => setStep(0)} disabled={verifying}>
                      <ArrowLeft className="size-4 rtl:rotate-180" />
                      Back
                    </Button>
                    <Button type="submit" form={formId} className="group" disabled={verifying}>
                      {verifying ? (
                        <>
                          <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                          Verifying…
                        </>
                      ) : (
                        <>
                          Verify
                          <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      <ShieldCheck className="size-3.5" />
                      Code verified
                    </span>
                    <Button type="button" disabled={!saved} onClick={() => setDone(true)}>
                      Finish
                    </Button>
                  </>
                )}
              </TwoFactorSetupFooter>
            </>
          )}
        </TwoFactorSetup>

        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Preview only, nothing is submitted.
        </p>
      </div>
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
