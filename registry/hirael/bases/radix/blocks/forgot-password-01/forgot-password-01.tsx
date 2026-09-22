'use client';

import * as React from 'react';
import { ArrowRight, Loader2, MailCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60): React.CSSProperties => ({
  animationDelay: `${index * step}ms`,
});

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M2.3 12h2.4v10.95h6.2V14.6h4.6v8.35h6.2V12h-2.4V1.05h-6.2V9.4H8.5V1.05H2.3Z" />
    </svg>
  );
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const ForgotPassword01 = () => {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent'>('idle');
  const [resend, setResend] = React.useState<'idle' | 'sending' | 'sent'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Enter the email you signed up with.');
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError("That doesn't look like a valid email.");
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

  return (
    <section
      data-slot="forgot-password"
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
        <div
          data-slot="forgot-password-card"
          className={cn(ENTER, 'rounded-sm border border-border bg-card')}
          style={{ boxShadow: '8px 8px 0 0 var(--border)' }}
        >
          {status === 'sent' ? (
            <div
              role="status"
              aria-live="polite"
              className={cn(SWAP, 'flex flex-col items-center gap-4 px-6 py-10 text-center sm:px-8')}
            >
              <MailCheck aria-hidden className="size-7 text-foreground" />
              <div className="flex flex-col gap-1">
                <h1 className="font-serif text-3xl font-medium tracking-tight">Check your inbox</h1>
                <p className="text-xs text-muted-foreground">
                  We sent a reset link to <span className="break-all text-foreground">{email}</span>. It expires in 15
                  minutes.
                </p>
              </div>
              <div className="mt-2 flex flex-col items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  {resend === 'sent' ? (
                    <span key="resent" className={SWAP}>
                      Sent again. Give it a minute to arrive.
                    </span>
                  ) : (
                    <>
                      Didn&apos;t get it?{' '}
                      <Button
                        type="button"
                        variant="link"
                        size="xs"
                        onClick={onResend}
                        disabled={resend === 'sending'}
                        className="h-auto"
                      >
                        {resend === 'sending' ? 'Sending…' : 'Resend'}
                      </Button>
                    </>
                  )}
                </p>
                <a href="#" className="text-xs uppercase text-muted-foreground transition-colors hover:text-foreground">
                  Back to sign in
                </a>
              </div>
            </div>
          ) : (
            <>
              <div
                data-slot="forgot-password-header"
                className="flex flex-col items-center gap-4 border-b border-border px-6 pb-6 pt-8 sm:px-8"
              >
                <BrandMark className={cn(ENTER, 'size-7 text-foreground')} />
                <div style={stagger(1)} className={cn(ENTER, 'flex flex-col items-center gap-1 text-center')}>
                  <h1 className="font-serif text-3xl font-medium tracking-tight">Forgot your password?</h1>
                  <p className="text-xs text-muted-foreground">
                    Enter your email and we&apos;ll send you a link to reset it.
                  </p>
                </div>
              </div>

              <form
                data-slot="forgot-password-form"
                noValidate
                style={stagger(2)}
                className={cn(ENTER, 'p-6 sm:p-8')}
                onSubmit={onSubmit}
              >
                <FieldGroup className="gap-5">
                  <Field className="gap-1.5" data-invalid={Boolean(error) || undefined}>
                    <FieldLabel htmlFor="forgot01-email">Email</FieldLabel>
                    <Input
                      id="forgot01-email"
                      type="email"
                      placeholder="you@studio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      aria-invalid={Boolean(error) || undefined}
                      aria-describedby={error ? 'forgot01-email-error' : undefined}
                    />
                    <FieldError id="forgot01-email-error">{error}</FieldError>
                  </Field>

                  <Button type="submit" variant="default" size="lg" disabled={status === 'sending'} className="group">
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                        Sending link…
                      </>
                    ) : (
                      <>
                        Send reset link
                        <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                      </>
                    )}
                  </Button>
                </FieldGroup>
              </form>

              <div style={stagger(3)} className={cn(ENTER, 'border-t border-border px-6 py-4 text-center sm:px-8')}>
                <p className="text-xs text-muted-foreground">
                  Remembered it?{' '}
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
          Reset links expire after 15 minutes
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword01;
