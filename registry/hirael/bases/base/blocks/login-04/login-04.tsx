'use client';

import * as React from 'react';
import { ChevronDown, CircleUserRound, KeyRound } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Card, CardContent } from '@/registry/hirael/bases/base/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { PasswordInput, PasswordInputField } from '@/registry/hirael/bases/base/components/password-input';
import { Spinner } from '@/registry/hirael/bases/base/ui/spinner';

const SWAP = 'animate-in fade-in duration-200 motion-reduce:animate-none';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FOOTER_LINKS = ['Help', 'Privacy', 'Terms'];

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

const validateEmail = (value: string) => {
  if (!value.trim()) return 'Enter an email address.';
  if (!EMAIL_PATTERN.test(value)) return 'Enter a valid email address.';

  return null;
};

type Step = 'email' | 'password';

type Pending = 'next' | 'passkey' | null;

const Login04 = () => {
  const [step, setStep] = React.useState<Step>('email');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState<Pending>(null);

  const onEmailSubmit = async () => {
    const message = validateEmail(email);
    setError(message);
    if (message) return;

    setPending('next');
    await wait(600);
    setPending(null);
    setStep('password');
  };

  const onPasswordSubmit = async () => {
    if (!password) {
      setError('Enter a password.');

      return;
    }

    setError(null);
    setPending('next');
    await wait(900);
    setPending(null);
    setError('Wrong password. Try again or reset it.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void (step === 'email' ? onEmailSubmit() : onPasswordSubmit());
  };

  const handlePasskey = async () => {
    setError(null);
    setPending('passkey');
    await wait(1200);
    setPending(null);
    setError('Passkey sign-in was cancelled.');
  };

  const handleChangeAccount = () => {
    setPassword('');
    setError(null);
    setStep('email');
  };

  return (
    <section
      data-slot="login"
      className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4 py-12"
    >
      <Card data-slot="login-card" className="w-full max-w-sm md:max-w-3xl">
        <CardContent>
          <form
            data-slot="login-form"
            noValidate
            onSubmit={handleSubmit}
            className="grid gap-8 md:grid-cols-2 md:gap-12"
          >
            <div data-slot="login-header" className="flex flex-col items-start gap-4">
              <BrandMark className="size-8 text-foreground" />
              {step === 'email' ? (
                <div key="email" className={SWAP}>
                  <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
                  <p className="mt-2 text-muted-foreground">Use your Hirael account.</p>
                </div>
              ) : (
                <div key="password" className={cn(SWAP, 'flex flex-col items-start gap-3')}>
                  <h1 className="text-3xl font-semibold tracking-tight">Welcome</h1>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleChangeAccount}
                    aria-label={`${email}, use another account`}
                    className="max-w-full"
                  >
                    <CircleUserRound />
                    <span className="truncate">{email}</span>
                    <ChevronDown />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {step === 'email' ? (
                <div key="email" className={SWAP}>
                  <FieldGroup className="gap-4">
                    <Field data-invalid={Boolean(error) || undefined}>
                      <FieldLabel htmlFor="login04-email">Email</FieldLabel>
                      <Input
                        id="login04-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                        aria-invalid={Boolean(error) || undefined}
                        aria-describedby={error ? 'login04-error' : undefined}
                      />
                      <FieldError id="login04-error">{error}</FieldError>
                    </Field>
                    <a href="#" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                      Forgot email?
                    </a>
                    <p className="text-sm text-muted-foreground">Not your device? Use a private window to sign in.</p>
                  </FieldGroup>
                </div>
              ) : (
                <div key="password" className={SWAP}>
                  <FieldGroup className="gap-4">
                    {/* Lets password managers pair the saved password with the account from step one. */}
                    <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
                    <Field data-invalid={Boolean(error) || undefined}>
                      <FieldLabel htmlFor="login04-password">Password</FieldLabel>
                      <PasswordInput id="login04-password" value={password} onValueChange={setPassword}>
                        <PasswordInputField
                          autoFocus
                          autoComplete="current-password"
                          aria-invalid={Boolean(error) || undefined}
                          aria-describedby={error ? 'login04-error' : undefined}
                        />
                      </PasswordInput>
                      <FieldError id="login04-error">{error}</FieldError>
                    </Field>
                    <a href="#" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                      Forgot password?
                    </a>
                  </FieldGroup>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 border-t pt-6">
                {step === 'email' ? (
                  <Button render={<a href="#" />} nativeButton={false} variant="ghost">
                    Create account
                  </Button>
                ) : (
                  <Button type="button" variant="ghost" disabled={pending !== null} onClick={handlePasskey}>
                    {pending === 'passkey' ? <Spinner /> : <KeyRound />}
                    Use a passkey
                  </Button>
                )}
                <Button type="submit" disabled={pending !== null}>
                  {pending === 'next' && <Spinner />}
                  Next
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <nav
        aria-label="Footer"
        className="flex w-full max-w-sm justify-end gap-4 text-xs text-muted-foreground md:max-w-3xl"
      >
        {FOOTER_LINKS.map((label) => (
          <a key={label} href="#" className="hover:text-foreground hover:underline">
            {label}
          </a>
        ))}
      </nav>
    </section>
  );
};

export default Login04;
