'use client';

import * as React from 'react';

import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Card, CardContent } from '@/registry/hirael/bases/radix/ui/card';
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/registry/hirael/bases/radix/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/registry/hirael/bases/radix/ui/input-otp';
import { Spinner } from '@/registry/hirael/bases/radix/ui/spinner';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;
const MASKED_EMAIL = 'h***@mohammadshehadeh.com';

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
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);

    return () => window.clearTimeout(id);
  }, [secondsLeft]);

  const verify = async (value: string) => {
    if (status === 'verifying') return;
    if (value.length < CODE_LENGTH) {
      setError(`Enter all ${CODE_LENGTH} digits.`);

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

  const verified = status === 'success';

  return (
    <section
      data-slot="otp-verify"
      className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4 py-12"
    >
      <a href="#" aria-label="Hirael home" className="text-foreground">
        <BrandMark className="size-9" />
      </a>

      <h1 className="text-2xl font-semibold tracking-tight">{verified ? 'You’re verified' : 'Verify it’s you'}</h1>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <Card data-slot="otp-verify-card">
          <CardContent>
            {verified ? (
              <div role="status" className="flex flex-col gap-6">
                <p className="text-sm text-muted-foreground">Code accepted. You can continue to your workspace.</p>
                <Button asChild className="w-full">
                  <a href="#">Continue</a>
                </Button>
              </div>
            ) : (
              <form data-slot="otp-verify-form" noValidate onSubmit={onSubmit}>
                <FieldGroup className="gap-5">
                  <FieldSet>
                    <FieldLegend variant="label">Verification code</FieldLegend>
                    <FieldDescription>
                      We sent a {CODE_LENGTH}-digit code to <span className="text-foreground">{MASKED_EMAIL}</span>. It
                      expires in 10 minutes.
                    </FieldDescription>
                    <div dir="ltr">
                      <InputOTP
                        maxLength={CODE_LENGTH}
                        value={code}
                        onChange={(value) => {
                          setCode(value);
                          if (error) setError(null);
                        }}
                        onComplete={verify}
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

                  <Button type="submit" disabled={status === 'verifying'} className="w-full">
                    {status === 'verifying' && <Spinner />}
                    {status === 'verifying' ? 'Verifying…' : 'Verify'}
                  </Button>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>

        {!verified && (
          <p className="text-center text-sm text-muted-foreground">
            {secondsLeft > 0 ? (
              <>
                Resend code in{' '}
                <span dir="ltr" className="text-foreground tabular-nums">
                  0:{String(secondsLeft).padStart(2, '0')}
                </span>
              </>
            ) : (
              <>
                Didn&apos;t get it?{' '}
                <button
                  type="button"
                  onClick={resend}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Resend code
                </button>
              </>
            )}
            <span aria-live="polite" className="sr-only">
              {secondsLeft === 0 ? 'You can request a new code now.' : ''}
            </span>
          </p>
        )}
      </div>

      {!verified && (
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
          Back to sign in
        </a>
      )}
    </section>
  );
};

export default OtpVerify01;
