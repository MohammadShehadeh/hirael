'use client';

import * as React from 'react';
import { CircleAlert } from 'lucide-react';

import { Alert, AlertTitle } from '@/registry/hirael/bases/base/ui/alert';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { PasswordInput, PasswordInputField } from '@/registry/hirael/bases/base/components/password-input';
import { Spinner } from '@/registry/hirael/bases/base/ui/spinner';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WORLD_MAP = '/media/blocks/login-02/world-map.webp';

const STATS = [
  { value: '2 weeks', label: 'to ship the new dashboard' },
  { value: '40%', label: 'less UI code to maintain' },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

const PROVIDERS = [
  { id: 'google', label: 'Google', icon: GoogleIcon },
  { id: 'github', label: 'GitHub', icon: GithubIcon },
] as const;

type Pending = (typeof PROVIDERS)[number]['id'] | 'email' | null;

type Errors = Partial<{
  email: string;
  password: string;
  form: string;
}>;

const Login02 = () => {
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

    setPending('email');
    await wait(900);
    setPending(null);
    setErrors({ form: 'Incorrect email or password.' });
  };

  const onProvider = async (id: Pending) => {
    setErrors({});
    setPending(id);
    await wait(1500);
    setPending(null);
  };

  return (
    <section data-slot="login" className="grid min-h-svh grid-cols-1 bg-background lg:grid-cols-2">
      <div data-slot="login-main" className="flex flex-col px-6 py-10 md:px-10">
        <a href="#" className="flex items-center gap-2 self-start text-foreground">
          <BrandMark className="size-6" />
          <span className="text-base font-semibold tracking-tight">Hirael</span>
        </a>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 py-12">
          <div data-slot="login-header" className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Log in to Hirael</h1>
            <p className="text-sm text-muted-foreground">Welcome back. Pick up where you left off.</p>
          </div>

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
                Continue with {label}
              </Button>
            ))}
          </div>

          <FieldSeparator>or</FieldSeparator>

          <form data-slot="login-form" noValidate onSubmit={onSubmit}>
            <FieldGroup className="gap-5">
              {errors.form && (
                <Alert variant="destructive" data-slot="login-error">
                  <CircleAlert />
                  <AlertTitle>{errors.form}</AlertTitle>
                </Alert>
              )}

              <Field data-invalid={Boolean(errors.email) || undefined}>
                <FieldLabel htmlFor="login02-email">Email</FieldLabel>
                <Input
                  id="login02-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  aria-invalid={Boolean(errors.email) || undefined}
                  aria-describedby={errors.email ? 'login02-email-error' : undefined}
                />
                <FieldError id="login02-email-error">{errors.email}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.password) || undefined}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="login02-password">Password</FieldLabel>
                  <a href="#" className="text-sm text-primary underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <PasswordInput id="login02-password" value={password} onValueChange={setPassword}>
                  <PasswordInputField
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password) || undefined}
                    aria-describedby={errors.password ? 'login02-password-error' : undefined}
                  />
                </PasswordInput>
                <FieldError id="login02-password-error">{errors.password}</FieldError>
              </Field>

              <Button type="submit" disabled={pending !== null} className="w-full">
                {pending === 'email' && <Spinner />}
                {pending === 'email' ? 'Logging in…' : 'Log in'}
              </Button>
            </FieldGroup>
          </form>

          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>

      <aside
        data-slot="login-aside"
        className="relative isolate hidden overflow-hidden border-s bg-muted lg:flex lg:items-center lg:justify-center"
      >
        <div
          aria-hidden
          style={{ maskImage: `url(${WORLD_MAP})` }}
          className="absolute inset-0 -z-10 bg-foreground/10 mask-contain mask-center mask-no-repeat"
        />
        <figure className="flex w-full max-w-md flex-col gap-8 px-10 py-16">
          <blockquote className="text-2xl leading-snug font-medium tracking-tight text-balance">
            &ldquo;The parts compose like the primitives we already use, so we shipped the new dashboard without
            learning anything new.&rdquo;
          </blockquote>

          <figcaption className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-sm font-medium">
              MR
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium">Mara Riviera</span>
              <span className="text-sm text-muted-foreground">Engineering lead, Helix</span>
            </span>
          </figcaption>

          <dl className="grid grid-cols-2 gap-6 border-t pt-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </figure>
      </aside>
    </section>
  );
};

export default Login02;
