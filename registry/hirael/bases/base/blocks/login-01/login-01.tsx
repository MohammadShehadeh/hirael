'use client';

import * as React from 'react';
import { ArrowRight, CircleAlert, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Checkbox } from '@/registry/hirael/bases/base/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { PasswordInput, PasswordInputField } from '@/registry/hirael/bases/base/components/password-input';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M21.35 11.1H12v3.2h5.34c-.23 1.4-1.66 4.1-5.34 4.1A6.4 6.4 0 1 1 12 5.6c1.83 0 3.05.78 3.75 1.45l2.55-2.46C16.74 3.05 14.55 2 12 2 6.95 2 2.85 6.1 2.85 11.15S6.95 20.3 12 20.3c6.93 0 9.5-4.86 9.5-7.4 0-.5-.06-.88-.15-1.8Z"
      />
    </svg>
  );
};

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
};

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

type Errors = Partial<{
  email: string;
  password: string;
  form: string;
}>;

const Login01 = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [errors, setErrors] = React.useState<Errors>({});
  const [attempt, setAttempt] = React.useState(0);
  const [pending, setPending] = React.useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!email.trim()) next.email = 'Enter the email you signed up with.';
    else if (!EMAIL_PATTERN.test(email)) next.email = "That doesn't look like a valid email.";
    if (!password) next.password = 'Enter your password.';
    return next;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    await new Promise((r) => setTimeout(r, 900));
    setPending(false);
    setErrors({ form: "That email and password don't match." });
    setAttempt((count) => count + 1);
  };

  return (
    <section
      data-slot="login"
      className="relative isolate flex min-h-svh items-center justify-center bg-background py-16 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[32px_32px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="mx-auto w-full max-w-md px-6">
        <div
          data-slot="login-card"
          className={cn(ENTER, 'rounded-sm border border-border bg-card shadow-[8px_8px_0_0_var(--border)]')}
        >
          <div
            data-slot="login-header"
            className="flex flex-col items-center gap-4 border-b border-border px-8 pb-6 pt-8"
          >
            <BrandMark className={cn(ENTER, 'size-7 text-foreground')} />
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 style={stagger(1)} className={cn(ENTER, 'font-serif text-3xl font-medium tracking-tight')}>
                Welcome back
              </h1>
              <p style={stagger(2)} className={cn(ENTER, 'text-xs text-muted-foreground')}>
                Sign in to your Hirael workspace to continue.
              </p>
            </div>
          </div>

          <form data-slot="login-form" noValidate style={stagger(3)} className={cn(ENTER, 'p-8')} onSubmit={onSubmit}>
            <FieldGroup className="gap-5">
              {errors.form && (
                <div
                  key={attempt}
                  role="alert"
                  data-slot="login-error"
                  className={cn(
                    SWAP,
                    'flex items-center gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive',
                  )}
                >
                  <CircleAlert aria-hidden className="size-3.5 shrink-0" />
                  {errors.form}
                </div>
              )}

              <Field className="gap-1.5" data-invalid={Boolean(errors.email) || undefined}>
                <FieldLabel htmlFor="login01-email">Email</FieldLabel>
                <Input
                  id="login01-email"
                  type="email"
                  placeholder="you@studio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email) || undefined}
                  aria-describedby={errors.email ? 'login01-email-error' : undefined}
                />
                <FieldError id="login01-email-error">{errors.email}</FieldError>
              </Field>

              <Field className="gap-1.5" data-invalid={Boolean(errors.password) || undefined}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="login01-password">Password</FieldLabel>
                  <a
                    href="#"
                    className="text-xs uppercase text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Forgot?
                  </a>
                </div>
                <PasswordInput id="login01-password" value={password} onValueChange={setPassword}>
                  <PasswordInputField
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password) || undefined}
                    aria-describedby={errors.password ? 'login01-password-error' : undefined}
                  />
                </PasswordInput>
                <FieldError id="login01-password-error">{errors.password}</FieldError>
              </Field>

              <Field orientation="horizontal" className="gap-2">
                <Checkbox id="login01-remember" checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
                <FieldLabel htmlFor="login01-remember" className="cursor-pointer">
                  Keep me signed in
                </FieldLabel>
              </Field>

              <Button type="submit" variant="default" size="lg" disabled={pending} className="group">
                {pending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </>
                )}
              </Button>

              <div className="[&_[data-slot=field-separator-content]]:bg-card">
                <FieldSeparator>or continue with</FieldSeparator>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline">
                  <GithubIcon className="size-4" />
                  GitHub
                </Button>
                <Button type="button" variant="outline">
                  <GoogleIcon className="size-4" />
                  Google
                </Button>
              </div>
            </FieldGroup>
          </form>

          <div data-slot="login-footer" className="border-t border-border px-8 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              No account yet?{' '}
              <a
                href="#"
                className="font-medium text-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Create one
              </a>
            </p>
          </div>
        </div>

        <p
          style={stagger(5)}
          className={cn(
            ENTER,
            'mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs uppercase text-muted-foreground',
          )}
        >
          <span>Protected by single-tenant auth</span>
          <span aria-hidden className="text-border">
            |
          </span>
          <span>SOC 2 in progress</span>
        </p>
      </div>
    </section>
  );
};

export default Login01;
