'use client';

import * as React from 'react';
import { ArrowRight, Loader2, MailCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Checkbox } from '@/registry/hirael/bases/base/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import {
  PasswordInput,
  PasswordInputField,
  PasswordInputStrength,
} from '@/registry/hirael/bases/base/components/password-input';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 60}ms` });

const MIN_PASSWORD_LENGTH = 8;
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
  name: string;
  email: string;
  password: string;
  terms: string;
}>;

const Signup01 = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [terms, setTerms] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [pending, setPending] = React.useState(false);
  const [created, setCreated] = React.useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Tell us your name.';
    if (!email.trim()) next.email = 'We need an email for your workspace.';
    else if (!EMAIL_PATTERN.test(email)) next.email = "That doesn't look like a valid email.";
    if (!password) next.password = 'Pick a password.';
    else if (password.length < MIN_PASSWORD_LENGTH) next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (!terms) next.terms = 'Please accept the terms to continue.';

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
    setCreated(true);
  };

  return (
    <section
      data-slot="signup"
      className="relative isolate flex min-h-svh items-center justify-center bg-background py-16 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-size-[32px_32px] opacity-[0.35]"
      />

      <div className="mx-auto w-full max-w-md px-6">
        <div
          data-slot="signup-card"
          className={cn(ENTER, 'rounded-sm border border-border bg-card shadow-[8px_8px_0_0_var(--border)]')}
        >
          <div
            data-slot="signup-header"
            className="flex flex-col items-center gap-4 border-b border-border px-8 pt-8 pb-6"
          >
            <BrandMark className={cn(ENTER, 'size-7 text-foreground')} />
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 style={stagger(1)} className={cn(ENTER, 'font-serif text-3xl font-medium tracking-tight')}>
                {created ? 'Check your inbox' : 'Create your account'}
              </h1>
              <p style={stagger(2)} className={cn(ENTER, 'text-xs text-muted-foreground')}>
                {created
                  ? 'One more step before your workspace is ready.'
                  : 'Start a Hirael workspace in under a minute.'}
              </p>
            </div>
          </div>

          {created ? (
            <div
              data-slot="signup-success"
              role="status"
              className={cn(SWAP, 'flex flex-col items-center gap-4 p-8 text-center')}
            >
              <MailCheck aria-hidden className="size-6 text-primary" />
              <p className="text-sm text-muted-foreground">
                We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Open it to
                finish setting up your workspace.
              </p>
              <Button type="button" variant="outline" onClick={() => setCreated(false)}>
                Use a different email
              </Button>
            </div>
          ) : (
            <form
              data-slot="signup-form"
              noValidate
              style={stagger(3)}
              className={cn(ENTER, 'p-8')}
              onSubmit={onSubmit}
            >
              <FieldGroup className="gap-5">
                <Field className="gap-1.5" data-invalid={Boolean(errors.name) || undefined}>
                  <FieldLabel htmlFor="signup01-name">Name</FieldLabel>
                  <Input
                    id="signup01-name"
                    placeholder="Ada Lovelace"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name) || undefined}
                    aria-describedby={errors.name ? 'signup01-name-error' : undefined}
                  />
                  <FieldError id="signup01-name-error">{errors.name}</FieldError>
                </Field>

                <Field className="gap-1.5" data-invalid={Boolean(errors.email) || undefined}>
                  <FieldLabel htmlFor="signup01-email">Email</FieldLabel>
                  <Input
                    id="signup01-email"
                    type="email"
                    placeholder="you@studio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email) || undefined}
                    aria-describedby={errors.email ? 'signup01-email-error' : undefined}
                  />
                  <FieldError id="signup01-email-error">{errors.email}</FieldError>
                </Field>

                <Field className="gap-1.5" data-invalid={Boolean(errors.password) || undefined}>
                  <FieldLabel htmlFor="signup01-password">Password</FieldLabel>
                  <PasswordInput id="signup01-password" value={password} onValueChange={setPassword}>
                    <PasswordInputField
                      placeholder="••••••••"
                      autoComplete="new-password"
                      minLength={MIN_PASSWORD_LENGTH}
                      aria-invalid={Boolean(errors.password) || undefined}
                      aria-describedby={errors.password ? 'signup01-password-error' : undefined}
                    />
                    <PasswordInputStrength />
                  </PasswordInput>
                  <FieldError id="signup01-password-error">{errors.password}</FieldError>
                </Field>

                <Field orientation="horizontal" className="gap-2" data-invalid={Boolean(errors.terms) || undefined}>
                  <Checkbox
                    id="signup01-terms"
                    checked={terms}
                    onCheckedChange={(v) => setTerms(v === true)}
                    aria-invalid={Boolean(errors.terms) || undefined}
                    aria-describedby={errors.terms ? 'signup01-terms-error' : undefined}
                  />
                  <FieldContent className="gap-1">
                    <FieldLabel htmlFor="signup01-terms" className="cursor-pointer">
                      <span>
                        I agree to the{' '}
                        <a href="#" className="font-medium text-foreground underline-offset-4 hover:underline">
                          terms of service
                        </a>
                        .
                      </span>
                    </FieldLabel>
                    <FieldError id="signup01-terms-error">{errors.terms}</FieldError>
                  </FieldContent>
                </Field>

                <Button type="submit" variant="default" size="lg" disabled={pending} className="group">
                  {pending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                    </>
                  )}
                </Button>

                <div data-slot="signup-separator" className="[&_[data-slot=field-separator-content]]:bg-card">
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
          )}

          <div data-slot="signup-footer" className="border-t border-border px-8 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{' '}
              <a
                href="#"
                className="font-medium text-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>

        <p
          style={stagger(5)}
          className={cn(
            ENTER,
            'mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-muted-foreground uppercase',
          )}
        >
          <span>Free forever tier</span>
          <span aria-hidden className="text-border">
            |
          </span>
          <span>No credit card required</span>
        </p>
      </div>
    </section>
  );
};

export default Signup01;
