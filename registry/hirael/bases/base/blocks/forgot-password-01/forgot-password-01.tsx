'use client';

import * as React from 'react';

import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Card, CardContent } from '@/registry/hirael/bases/base/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { Spinner } from '@/registry/hirael/bases/base/ui/spinner';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

type SendStatus = 'idle' | 'sending' | 'sent';

interface ResendLineProps {
  status: SendStatus;
  onResend: () => void;
}

const ResendLine = ({ status, onResend }: ResendLineProps) => {
  if (status === 'sent') return <span role="status">Sent again. Give it a minute to arrive.</span>;

  return (
    <>
      Didn&apos;t get it?{' '}
      <button
        type="button"
        onClick={onResend}
        disabled={status === 'sending'}
        className="font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending…' : 'Resend link'}
      </button>
    </>
  );
};

const ForgotPassword01 = () => {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<SendStatus>('idle');
  const [resend, setResend] = React.useState<SendStatus>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setError(email.trim() ? 'Enter a valid email address.' : 'Enter your email address.');

      return;
    }

    setError(null);
    setStatus('sending');
    await wait(900);
    setStatus('sent');
  };

  const onResend = async () => {
    setResend('sending');
    await wait(900);
    setResend('sent');
  };

  const sent = status === 'sent';

  return (
    <section
      data-slot="forgot-password"
      className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4 py-12"
    >
      <a href="#" aria-label="Hirael home" className="text-foreground">
        <BrandMark className="size-9" />
      </a>

      <h1 className="text-2xl font-semibold tracking-tight">{sent ? 'Check your email' : 'Reset your password'}</h1>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <Card data-slot="forgot-password-card">
          <CardContent>
            {sent ? (
              <div role="status" className="flex flex-col gap-6">
                <p className="text-sm text-muted-foreground">
                  We sent a reset link to <span className="font-medium break-all text-foreground">{email}</span>. It
                  expires in 15 minutes. If it doesn&apos;t arrive, check your spam folder.
                </p>
                <Button render={<a href="#" />} nativeButton={false} className="w-full">
                  Return to sign in
                </Button>
              </div>
            ) : (
              <form data-slot="forgot-password-form" noValidate onSubmit={onSubmit}>
                <FieldGroup className="gap-5">
                  <Field data-invalid={Boolean(error) || undefined}>
                    <FieldLabel htmlFor="forgot01-email">Email address</FieldLabel>
                    <FieldDescription>
                      Enter the email on your account and we&apos;ll send you a link to reset your password.
                    </FieldDescription>
                    <Input
                      id="forgot01-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      aria-invalid={Boolean(error) || undefined}
                      aria-describedby={error ? 'forgot01-email-error' : undefined}
                    />
                    <FieldError id="forgot01-email-error">{error}</FieldError>
                  </Field>

                  <Button type="submit" disabled={status === 'sending'} className="w-full">
                    {status === 'sending' && <Spinner />}
                    {status === 'sending' ? 'Sending…' : 'Send reset link'}
                  </Button>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          {sent ? (
            <ResendLine status={resend} onResend={onResend} />
          ) : (
            <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
              Back to sign in
            </a>
          )}
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword01;
