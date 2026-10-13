'use client';

import * as React from 'react';
import { CircleAlert, KeyRound } from 'lucide-react';

import { Alert, AlertTitle } from '@/registry/hirael/bases/radix/ui/alert';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Card, CardContent } from '@/registry/hirael/bases/radix/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { PasswordInput, PasswordInputField } from '@/registry/hirael/bases/radix/components/password-input';
import { Spinner } from '@/registry/hirael/bases/radix/ui/spinner';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FOOTER_LINKS = ['Terms', 'Privacy', 'Docs', 'Contact support'];

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

type Errors = Partial<{
  email: string;
  password: string;
  form: string;
}>;

type Pending = 'password' | 'passkey' | null;

const Login01 = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<Errors>({});
  const [pending, setPending] = React.useState<Pending>(null);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!email.trim()) next.email = 'Enter your email address.';
    else if (!EMAIL_PATTERN.test(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Enter your password.';

    return next;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending('password');
    await wait(900);
    setPending(null);
    setErrors({ form: 'Incorrect email or password.' });
  };

  const onPasskey = async () => {
    setErrors({});
    setPending('passkey');
    await wait(1200);
    setPending(null);
    setErrors({ form: 'Passkey sign-in was cancelled.' });
  };

  return (
    <section
      data-slot="login"
      className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4 py-12"
    >
      <a href="#" aria-label="Hirael home" className="text-foreground">
        <BrandMark className="size-9" />
      </a>

      <h1 className="text-2xl font-semibold tracking-tight">Sign in to Hirael</h1>

      <div className="flex w-full max-w-sm flex-col gap-4">
        {errors.form && (
          <Alert variant="destructive" data-slot="login-error">
            <CircleAlert />
            <AlertTitle>{errors.form}</AlertTitle>
          </Alert>
        )}

        <Card data-slot="login-card">
          <CardContent>
            <form data-slot="login-form" noValidate onSubmit={onSubmit}>
              <FieldGroup className="gap-5">
                <Field data-invalid={Boolean(errors.email) || undefined}>
                  <FieldLabel htmlFor="login01-email">Email address</FieldLabel>
                  <Input
                    id="login01-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    aria-invalid={Boolean(errors.email) || undefined}
                    aria-describedby={errors.email ? 'login01-email-error' : undefined}
                  />
                  <FieldError id="login01-email-error">{errors.email}</FieldError>
                </Field>

                <Field data-invalid={Boolean(errors.password) || undefined}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="login01-password">Password</FieldLabel>
                    <a href="#" className="text-sm text-primary underline-offset-4 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <PasswordInput id="login01-password" value={password} onValueChange={setPassword}>
                    <PasswordInputField
                      autoComplete="current-password"
                      aria-invalid={Boolean(errors.password) || undefined}
                      aria-describedby={errors.password ? 'login01-password-error' : undefined}
                    />
                  </PasswordInput>
                  <FieldError id="login01-password-error">{errors.password}</FieldError>
                </Field>

                <Button type="submit" disabled={pending !== null} className="w-full">
                  {pending === 'password' && <Spinner />}
                  {pending === 'password' ? 'Signing in…' : 'Sign in'}
                </Button>

                <div className="[&_[data-slot=field-separator-content]]:bg-card">
                  <FieldSeparator>or</FieldSeparator>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  disabled={pending !== null}
                  onClick={onPasskey}
                  className="w-full"
                >
                  {pending === 'passkey' ? <Spinner /> : <KeyRound />}
                  {pending === 'passkey' ? 'Waiting for passkey…' : 'Sign in with a passkey'}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          New to Hirael?{' '}
          <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
            Create an account
          </a>
        </p>
      </div>

      <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {FOOTER_LINKS.map((label) => (
          <a key={label} href="#" className="hover:text-foreground hover:underline">
            {label}
          </a>
        ))}
      </nav>
    </section>
  );
};

export default Login01;
