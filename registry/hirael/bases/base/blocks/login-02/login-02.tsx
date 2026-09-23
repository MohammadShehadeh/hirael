'use client';

import * as React from 'react';
import { ArrowRight, CircleAlert, Loader2, Quote } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { PasswordInput, PasswordInputField } from '@/registry/hirael/bases/base/components/password-input';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATS = [
  { value: '70+', label: 'components' },
  { value: '0', label: 'runtime deps' },
];

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

const Login02 = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<Errors>({});
  const [attempt, setAttempt] = React.useState(0);
  const [pending, setPending] = React.useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!email.trim()) next.email = 'Enter your work email.';
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
    <section data-slot="login" className="grid min-h-svh grid-cols-1 bg-background md:grid-cols-2">
      <div data-slot="login-main" className="flex items-center justify-center px-6 py-16 md:px-10 lg:px-12">
        <div className="w-full max-w-sm">
          <div className={cn(ENTER, 'mb-10 flex items-center gap-2')}>
            <BrandMark className="size-6 text-foreground" />
            <span className="text-base font-semibold tracking-[-0.025em]">Hirael</span>
          </div>

          <div data-slot="login-header" className="mb-8 flex flex-col gap-2">
            <span style={stagger(1)} className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>
              Sign in
            </span>
            <h1 style={stagger(2)} className={cn(ENTER, 'font-serif text-4xl font-medium tracking-tight sm:text-5xl')}>
              Welcome back.
            </h1>
            <p style={stagger(3)} className={cn(ENTER, 'text-sm text-muted-foreground')}>
              Use the email you signed up with. We&apos;ll fetch your workspace from there.
            </p>
          </div>

          <form data-slot="login-form" noValidate style={stagger(4)} className={ENTER} onSubmit={onSubmit}>
            <FieldGroup className="gap-4">
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
                <FieldLabel htmlFor="login02-email">Work email</FieldLabel>
                <Input
                  id="login02-email"
                  type="email"
                  placeholder="you@studio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email) || undefined}
                  aria-describedby={errors.email ? 'login02-email-error' : undefined}
                />
                <FieldError id="login02-email-error">{errors.email}</FieldError>
              </Field>

              <Field className="gap-1.5" data-invalid={Boolean(errors.password) || undefined}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="login02-password">Password</FieldLabel>
                  <a
                    href="#"
                    className="text-xs text-muted-foreground uppercase transition-colors hover:text-foreground"
                  >
                    Reset
                  </a>
                </div>
                <PasswordInput id="login02-password" value={password} onValueChange={setPassword}>
                  <PasswordInputField
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password) || undefined}
                    aria-describedby={errors.password ? 'login02-password-error' : undefined}
                  />
                </PasswordInput>
                <FieldError id="login02-password-error">{errors.password}</FieldError>
              </Field>

              <Button type="submit" variant="default" size="lg" disabled={pending} className="group mt-2">
                {pending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </>
                )}
              </Button>

              <p className="mt-2 text-center text-xs text-muted-foreground">
                No account yet?{' '}
                <a
                  href="#"
                  className="font-medium text-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Start a workspace
                </a>
              </p>
            </FieldGroup>
          </form>
        </div>
      </div>

      <div
        data-slot="login-aside"
        className="relative isolate hidden overflow-hidden border-s border-border bg-card md:flex md:items-center md:justify-center"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[28px_28px] opacity-30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -end-24 -bottom-32 -z-10 size-[420px] rounded-full bg-primary opacity-[0.18] blur-3xl"
        />

        <figure className="flex w-full max-w-md flex-col gap-8 px-8 py-12 md:gap-10 md:px-10 lg:px-12 lg:py-16">
          <Quote
            aria-hidden
            strokeWidth={1.5}
            style={stagger(3)}
            className={cn(ENTER, 'size-7 text-foreground md:size-8')}
          />

          <blockquote
            style={stagger(4)}
            className={cn(ENTER, 'font-serif text-2xl leading-[1.3] tracking-tight md:text-3xl lg:text-4xl')}
          >
            The parts compose just like the primitives we <span className="text-foreground italic">already use</span>,
            so we shipped the new dashboard without learning anything new.
          </blockquote>

          <figcaption style={stagger(5)} className={cn(ENTER, 'flex items-center gap-4 border-t border-border pt-6')}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
              MR
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium">Mara Riviera</span>
              <span className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground uppercase">
                <span>Eng lead</span>
                <span aria-hidden className="text-border">
                  |
                </span>
                <span>Helix</span>
              </span>
            </span>
          </figcaption>

          <dl
            style={stagger(6)}
            className={cn(ENTER, 'grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border')}
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-card px-4 py-3">
                <dt className="text-[10px] text-muted-foreground uppercase">{stat.label}</dt>
                <dd className="mt-0.5 text-xl font-medium tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </figure>
      </div>
    </section>
  );
};

export default Login02;
