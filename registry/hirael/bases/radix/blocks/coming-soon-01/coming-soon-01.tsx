'use client';

import * as React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldError, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { CountdownTimer } from '@/registry/hirael/bases/radix/components/countdown-timer';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 70}ms` });

const ComingSoon = ({ className, ...props }: React.ComponentProps<'section'>) => {
  return (
    <section
      data-slot="coming-soon"
      className={cn('relative isolate flex min-h-svh items-center justify-center bg-background py-20', className)}
      {...props}
    />
  );
};

const ComingSoonEyebrow = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span
      data-slot="coming-soon-eyebrow"
      className={cn('inline-flex items-center gap-2 text-xs text-muted-foreground uppercase', className)}
      {...props}
    />
  );
};

const ComingSoonTitle = ({ className, ...props }: React.ComponentProps<'h1'>) => {
  return (
    <h1
      data-slot="coming-soon-title"
      className={cn('font-serif text-5xl leading-none font-medium tracking-tight sm:text-6xl md:text-7xl', className)}
      {...props}
    />
  );
};

const ComingSoonDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
  return (
    <p
      data-slot="coming-soon-description"
      className={cn('max-w-md text-base text-muted-foreground sm:text-lg', className)}
      {...props}
    />
  );
};

export interface ComingSoonCountdownProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  target: Date | string | number;
  onComplete?: () => void;
}

const ComingSoonCountdown = ({ target, onComplete, className, ...props }: ComingSoonCountdownProps) => {
  return (
    <div data-slot="coming-soon-countdown" className={cn('flex flex-col gap-3', className)} {...props}>
      <CountdownTimer
        target={target}
        onComplete={onComplete}
        completeContent={<span className="font-serif text-2xl font-medium tracking-tight">It&apos;s live.</span>}
      />
    </div>
  );
};

export interface ComingSoonFormProps extends Omit<React.ComponentProps<'form'>, 'onSubmit'> {
  /** Called with the email on submit. Preview never submits anywhere. */
  onSubscribe?: (email: string) => void;
  placeholder?: string;
  buttonLabel?: React.ReactNode;
  successMessage?: React.ReactNode;
}

const ComingSoonForm = ({
  onSubscribe,
  placeholder = 'you@studio.com',
  buttonLabel = 'Notify me',
  successMessage = "You're on the list.",
  className,
  ...props
}: ComingSoonFormProps) => {
  const id = React.useId();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const value = email.trim();
      if (!value) {
        setError('Enter your email to get the launch note.');

        return;
      }
      if (!EMAIL_PATTERN.test(value)) {
        setError("That doesn't look like a valid email.");

        return;
      }
      setError(null);
      onSubscribe?.(value);
      setSubscribed(true);
    },
    [email, onSubscribe],
  );

  if (subscribed) {
    return (
      <p
        data-slot="coming-soon-form"
        data-state="subscribed"
        role="status"
        aria-live="polite"
        className={cn(
          'flex min-h-10 w-full max-w-md flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground',
          'animate-in duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none',
          className,
        )}
      >
        <CheckCircle2 aria-hidden className="size-4 shrink-0 text-success" />
        {successMessage}
        <span className="min-w-0 break-words text-muted-foreground">
          We&apos;ll email <span className="break-all text-foreground">{email.trim()}</span> on launch day.
        </span>
      </p>
    );
  }

  return (
    <form
      data-slot="coming-soon-form"
      data-state="idle"
      noValidate
      onSubmit={handleSubmit}
      className={cn('w-full max-w-md', className)}
      {...props}
    >
      <Field className="gap-1.5" data-invalid={error ? true : undefined}>
        <FieldLabel htmlFor={id}>
          <span className="text-xs text-muted-foreground uppercase">Get notified at launch</span>
        </FieldLabel>
        <div className="flex gap-2">
          <Input
            id={id}
            type="email"
            autoComplete="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="h-10 min-w-0 flex-1"
          />
          <Button type="submit" size="lg" className="group">
            {buttonLabel}
            <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </Button>
        </div>
        <FieldError id={`${id}-error`}>{error}</FieldError>
      </Field>
    </form>
  );
};

const ComingSoonFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="coming-soon-footer"
      className={cn(
        'mt-4 flex w-full flex-wrap items-center justify-between gap-4 border-t border-border pt-6',
        className,
      )}
      {...props}
    />
  );
};

const DAY_MS = 24 * 60 * 60 * 1000;

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

const ComingSoon01 = () => {
  const [target] = React.useState(() => Date.now() + 21 * DAY_MS);

  return (
    <ComingSoon data-slot="coming-soon-01-block">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-size-[32px_32px] opacity-[0.35]"
      />

      <div className="mx-auto w-full max-w-2xl px-6 md:px-10">
        <div className="flex flex-col items-start gap-6">
          <ComingSoonEyebrow className={ENTER}>Launching soon</ComingSoonEyebrow>
          <ComingSoonTitle style={stagger(1)} className={ENTER}>
            Hirael Cloud opens in three weeks.
          </ComingSoonTitle>
          <ComingSoonDescription style={stagger(2)} className={ENTER}>
            Managed Postgres and object storage, with the same terminal-first console you already use for the registry.
          </ComingSoonDescription>

          <ComingSoonCountdown style={stagger(3)} className={ENTER} target={target} />

          <ComingSoonForm style={stagger(4)} className={ENTER} />

          <ComingSoonFooter style={stagger(5)} className={ENTER}>
            <span className="text-xs text-muted-foreground uppercase">People on the list get access first.</span>
            <a
              href="https://github.com/MohammadShehadeh/hirael"
              target="_blank"
              rel="noreferrer"
              aria-label="Hirael on GitHub"
              className="inline-flex size-8 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <GithubIcon className="size-4" />
            </a>
          </ComingSoonFooter>
        </div>
      </div>
    </ComingSoon>
  );
};

export {
  ComingSoon,
  ComingSoonEyebrow,
  ComingSoonTitle,
  ComingSoonDescription,
  ComingSoonCountdown,
  ComingSoonForm,
  ComingSoonFooter,
};

export default ComingSoon01;
