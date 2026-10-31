'use client';

import * as React from 'react';

import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Card, CardContent } from '@/registry/hirael/bases/radix/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import {
  PasswordInput,
  PasswordInputField,
  PasswordInputStrength,
} from '@/registry/hirael/bases/radix/components/password-input';
import { Spinner } from '@/registry/hirael/bases/radix/ui/spinner';

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

const PROVIDERS = [
  { id: 'github', label: 'GitHub', icon: GithubIcon },
  { id: 'google', label: 'Google', icon: GoogleIcon },
] as const;

type Pending = (typeof PROVIDERS)[number]['id'] | 'email' | null;

interface Errors {
  name?: string;
  email?: string;
  password?: string;
}

const Signup01 = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<Errors>({});
  const [pending, setPending] = React.useState<Pending>(null);
  const [created, setCreated] = React.useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Enter your name.';
    if (!email.trim()) next.email = 'Enter your email address.';
    else if (!EMAIL_PATTERN.test(email)) next.email = 'Enter a valid email address.';
    if (password.length < MIN_PASSWORD_LENGTH) next.password = `Use ${MIN_PASSWORD_LENGTH} or more characters.`;

    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending('email');
    await wait(900);
    setPending(null);
    setCreated(true);
  };

  const onProvider = async (id: Pending) => {
    setPending(id);
    await wait(1500);
    setPending(null);
  };

  return (
    <section
      data-slot="signup"
      className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4 py-12"
    >
      <a href="#" aria-label="Hirael home" className="text-foreground">
        <BrandMark className="size-9" />
      </a>

      <h1 className="text-2xl font-semibold tracking-tight">{created ? 'Check your email' : 'Create your account'}</h1>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <Card data-slot="signup-card">
          <CardContent>
            {created ? (
              <div data-slot="signup-success" role="status" className="flex flex-col gap-6">
                <p className="text-sm text-muted-foreground">
                  We sent a verification link to <span className="font-medium break-all text-foreground">{email}</span>.
                  Open it to finish creating your account.
                </p>
                <Button type="button" variant="outline" onClick={() => setCreated(false)} className="w-full">
                  Use a different email
                </Button>
              </div>
            ) : (
              <form data-slot="signup-form" noValidate onSubmit={handleSubmit}>
                <FieldGroup className="gap-5">
                  <div className="flex flex-col gap-3">
                    {PROVIDERS.map(({ id, label, icon: Icon }) => (
                      <Button
                        key={id}
                        type="button"
                        variant="outline"
                        disabled={pending !== null}
                        onClick={() => onProvider(id)}
                        className="w-full"
                      >
                        {pending === id ? <Spinner /> : <Icon className="size-4" />}
                        Sign up with {label}
                      </Button>
                    ))}
                  </div>

                  <div className="[&_[data-slot=field-separator-content]]:bg-card">
                    <FieldSeparator>or</FieldSeparator>
                  </div>

                  <Field data-invalid={Boolean(errors.name) || undefined}>
                    <FieldLabel htmlFor="signup01-name">Name</FieldLabel>
                    <Input
                      id="signup01-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name) || undefined}
                      aria-describedby={errors.name ? 'signup01-name-error' : undefined}
                    />
                    <FieldError id="signup01-name-error">{errors.name}</FieldError>
                  </Field>

                  <Field data-invalid={Boolean(errors.email) || undefined}>
                    <FieldLabel htmlFor="signup01-email">Email address</FieldLabel>
                    <Input
                      id="signup01-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email) || undefined}
                      aria-describedby={errors.email ? 'signup01-email-error' : undefined}
                    />
                    <FieldError id="signup01-email-error">{errors.email}</FieldError>
                  </Field>

                  <Field data-invalid={Boolean(errors.password) || undefined}>
                    <FieldLabel htmlFor="signup01-password">Password</FieldLabel>
                    <PasswordInput id="signup01-password" value={password} onValueChange={setPassword}>
                      <PasswordInputField
                        autoComplete="new-password"
                        minLength={MIN_PASSWORD_LENGTH}
                        aria-invalid={Boolean(errors.password) || undefined}
                        aria-describedby={errors.password ? 'signup01-password-error' : 'signup01-password-hint'}
                      />
                      <PasswordInputStrength />
                    </PasswordInput>
                    {errors.password ? (
                      <FieldError id="signup01-password-error">{errors.password}</FieldError>
                    ) : (
                      <FieldDescription id="signup01-password-hint">
                        Use {MIN_PASSWORD_LENGTH} or more characters with a mix of letters and numbers.
                      </FieldDescription>
                    )}
                  </Field>

                  <Button type="submit" disabled={pending !== null} className="w-full">
                    {pending === 'email' && <Spinner />}
                    {pending === 'email' ? 'Creating account…' : 'Create account'}
                  </Button>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </a>
        </p>
      </div>

      <p className="max-w-xs text-center text-xs text-muted-foreground">
        By creating an account, you agree to the{' '}
        <a href="#" className="underline underline-offset-4 hover:text-foreground">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="underline underline-offset-4 hover:text-foreground">
          Privacy Policy
        </a>
        .
      </p>
    </section>
  );
};

export default Signup01;
