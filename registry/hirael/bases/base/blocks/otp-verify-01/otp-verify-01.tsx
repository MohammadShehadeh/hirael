'use client';

import * as React from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { FieldError, FieldGroup, FieldLegend, FieldSet } from '@/registry/hirael/bases/base/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/registry/hirael/bases/base/ui/input-otp';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;
const MASKED_EMAIL = 'a•••@studio.com';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60): React.CSSProperties => ({
  animationDelay: `${index * step}ms`,
});

interface BrandMarkProps {
  className?: string;
}

const BrandMark = ({ className }: BrandMarkProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M2.3 12h2.4v10.95h6.2V14.6h4.6v8.35h6.2V12h-2.4V1.05h-6.2V9.4H8.5V1.05H2.3Z" />
    </svg>
  );
};

type VerifyStatus = 'idle' | 'verifying' | 'success';

const OtpVerify01 = () => {
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<VerifyStatus>('idle');
  const [secondsLeft, setSecondsLeft] = React.useState(RESEND_SECONDS);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft]);

  const verify = async (value: string) => {
    if (status === 'verifying') return;
    if (value.length < CODE_LENGTH) {
      setError('Enter all six digits to continue.');
      return;
    }
    setError(null);
    setStatus('verifying');
    await new Promise((r) => setTimeout(r, 900));
    setStatus('success');
  };

  const resend = () => {
    setCode('');
    setError(null);
    setSecondsLeft(RESEND_SECONDS);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void verify(code);
  };

  return (
    <section
      data-slot="otp-verify"
      className="relative isolate flex min-h-svh items-center justify-center bg-background py-16 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[32px_32px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="mx-auto w-full max-w-md px-6">
        <div
          data-slot="otp-verify-card"
          className={cn(ENTER, 'rounded-sm border border-border bg-card shadow-[8px_8px_0_0_var(--border)]')}
        >
          {status === 'success' ? (
            <div
              role="status"
              aria-live="polite"
              className={cn(SWAP, 'flex flex-col items-center gap-4 px-6 py-10 text-center sm:px-8')}
            >
              <CheckCircle2 aria-hidden className="size-7 text-foreground" />
              <div className="flex flex-col gap-1">
                <h1 className="font-serif text-3xl font-medium tracking-tight">You&apos;re verified</h1>
                <p className="text-xs text-muted-foreground">Code accepted. Redirecting you to your workspace…</p>
              </div>
              <a
                href="#"
                className="mt-2 text-xs uppercase text-muted-foreground transition-colors hover:text-foreground"
              >
                Continue to dashboard
              </a>
            </div>
          ) : (
            <>
              <div
                data-slot="otp-verify-header"
                className="flex flex-col items-center gap-4 border-b border-border px-6 pb-6 pt-8 sm:px-8"
              >
                <BrandMark className={cn(ENTER, 'size-7 text-foreground')} />
                <div style={stagger(1)} className={cn(ENTER, 'flex flex-col items-center gap-1 text-center')}>
                  <h1 className="font-serif text-3xl font-medium tracking-tight">Check your email</h1>
                  <p className="text-xs text-muted-foreground">
                    We sent a 6-digit code to <span className="text-foreground">{MASKED_EMAIL}</span>. It expires in 10
                    minutes.
                  </p>
                </div>
              </div>

              <form
                data-slot="otp-verify-form"
                noValidate
                style={stagger(2)}
                className={cn(ENTER, 'p-6 sm:p-8')}
                onSubmit={onSubmit}
              >
                <FieldGroup className="gap-5">
                  <FieldSet className="gap-1.5">
                    <FieldLegend variant="label" className="mb-1.5">
                      Verification code
                    </FieldLegend>
                    <div dir="ltr">
                      <InputOTP
                        maxLength={CODE_LENGTH}
                        value={code}
                        onChange={(value) => {
                          setCode(value);
                          if (error) setError(null);
                        }}
                        onComplete={(value: string) => void verify(value)}
                        pattern="^\d+$"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        disabled={status === 'verifying'}
                        aria-label="Verification code"
                        aria-invalid={Boolean(error) || undefined}
                        aria-describedby={error ? 'otp01-code-error' : undefined}
                        containerClassName="justify-between"
                      >
                        <InputOTPGroup className="w-full">
                          {Array.from({ length: CODE_LENGTH }, (_, i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              aria-invalid={Boolean(error) || undefined}
                              className="h-10 flex-1 sm:h-11"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <FieldError id="otp01-code-error">{error}</FieldError>
                  </FieldSet>

                  <Button type="submit" variant="default" size="lg" disabled={status === 'verifying'} className="group">
                    {status === 'verifying' ? (
                      <>
                        <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                        Verifying…
                      </>
                    ) : (
                      <>
                        Verify code
                        <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    {secondsLeft > 0 ? (
                      <>
                        Resend code in{' '}
                        <span dir="ltr" className="tabular-nums text-foreground">
                          0:{String(secondsLeft).padStart(2, '0')}
                        </span>
                      </>
                    ) : (
                      <span key="resend" className={SWAP}>
                        Didn&apos;t get it?{' '}
                        <Button type="button" variant="link" size="xs" onClick={resend} className="h-auto">
                          Resend code
                        </Button>
                      </span>
                    )}
                  </p>
                  <span aria-live="polite" className="sr-only">
                    {secondsLeft === 0 ? 'You can request a new code now.' : ''}
                  </span>
                </FieldGroup>
              </form>

              <div style={stagger(3)} className={cn(ENTER, 'border-t border-border px-6 py-4 text-center sm:px-8')}>
                <p className="text-xs text-muted-foreground">
                  Wrong address?{' '}
                  <a
                    href="#"
                    className="font-medium text-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Back to sign in
                  </a>
                </p>
              </div>
            </>
          )}
        </div>

        <p style={stagger(4)} className={cn(ENTER, 'mt-4 text-center text-xs uppercase text-muted-foreground')}>
          One-time codes are never shared with anyone
        </p>
      </div>
    </section>
  );
};

export default OtpVerify01;
