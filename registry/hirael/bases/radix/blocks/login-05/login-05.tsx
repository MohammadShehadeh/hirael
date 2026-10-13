'use client';

import * as React from 'react';
import { KeyRound, Mail } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { Spinner } from '@/registry/hirael/bases/radix/ui/spinner';

const SWAP = 'animate-in fade-in duration-200 motion-reduce:animate-none';

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

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M16.37 12.73c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.77-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.75 2.27-1.6 2.78-.41 6.89 1.15 9.14.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.24-.02 2.02-1.12 2.77-2.23.88-1.28 1.24-2.52 1.26-2.59-.03-.01-2.4-.92-2.41-3.65ZM14.1 5.98c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.27Z"
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
  { id: 'apple', label: 'Apple', icon: AppleIcon },
] as const;

type Method = (typeof PROVIDERS)[number]['id'] | 'passkey' | 'email';

type View = 'methods' | 'email' | 'sent';

const Login05 = () => {
  const [view, setView] = React.useState<View>('methods');
  const [pending, setPending] = React.useState<Method | null>(null);
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const redirect = async (method: Method) => {
    setPending(method);
    await wait(1500);
    setPending(null);
  };

  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setError('Enter a valid email address.');

      return;
    }

    setError(null);
    setPending('email');
    await wait(900);
    setPending(null);
    setView('sent');
  };

  const backToMethods = () => {
    setError(null);
    setView('methods');
  };

  return (
    <section
      data-slot="login"
      className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background px-4 py-12"
    >
      <a href="#" aria-label="Hirael home" className="text-foreground">
        <BrandMark className="size-9" />
      </a>

      <div data-slot="login-panel" className="flex w-full max-w-xs flex-col gap-6">
        {view === 'sent' ? (
          <div key="sent" role="status" className={cn(SWAP, 'flex flex-col gap-6 text-center')}>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                We sent a sign-in link to <span className="font-medium break-all text-foreground">{email}</span>.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={backToMethods} className="w-full">
              Use another method
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-center text-2xl font-semibold tracking-tight">Log in to Hirael</h1>

            {view === 'methods' ? (
              <div key="methods" className={cn(SWAP, 'flex flex-col gap-3')}>
                {PROVIDERS.map(({ id, label, icon: Icon }, index) => (
                  <Button
                    key={id}
                    type="button"
                    size="lg"
                    variant={index === 0 ? 'default' : 'outline'}
                    disabled={pending !== null}
                    onClick={() => void redirect(id)}
                    className="w-full"
                  >
                    {pending === id ? <Spinner /> : <Icon className="size-4" />}
                    Continue with {label}
                  </Button>
                ))}

                <div className="py-2">
                  <FieldSeparator />
                </div>

                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  disabled={pending !== null}
                  onClick={() => setView('email')}
                  className="w-full"
                >
                  <Mail />
                  Continue with email
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  disabled={pending !== null}
                  onClick={() => void redirect('passkey')}
                  className="w-full"
                >
                  {pending === 'passkey' ? <Spinner /> : <KeyRound />}
                  Continue with passkey
                </Button>
              </div>
            ) : (
              <form key="email" noValidate onSubmit={onEmailSubmit} className={SWAP}>
                <FieldGroup className="gap-4">
                  <Field data-invalid={Boolean(error) || undefined}>
                    <FieldLabel htmlFor="login05-email" className="sr-only">
                      Email address
                    </FieldLabel>
                    <Input
                      id="login05-email"
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      autoFocus
                      aria-invalid={Boolean(error) || undefined}
                      aria-describedby={error ? 'login05-email-error' : undefined}
                    />
                    <FieldError id="login05-email-error">{error}</FieldError>
                  </Field>
                  <Button type="submit" size="lg" disabled={pending !== null} className="w-full">
                    {pending === 'email' && <Spinner />}
                    Continue with email
                  </Button>
                  <Button type="button" variant="ghost" onClick={backToMethods} className="w-full">
                    Other login options
                  </Button>
                </FieldGroup>
              </form>
            )}
          </>
        )}

        <span role="status" className="sr-only">
          {pending && pending !== 'email' ? 'Redirecting' : ''}
        </span>
      </div>

      <div className="flex max-w-xs flex-col items-center gap-3 text-center text-sm text-muted-foreground">
        <p>
          Don&apos;t have an account?{' '}
          <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign up
          </a>
        </p>
        <p className="text-xs">
          By continuing, you agree to the{' '}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default Login05;
