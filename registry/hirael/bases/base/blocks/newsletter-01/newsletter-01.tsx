'use client';

import * as React from 'react';
import { Check, Mail } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Field, FieldError, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in zoom-in-97 duration-250 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 70}ms` });

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Newsletter01 = () => {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [subscribed, setSubscribed] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter a valid email address.');

      return;
    }
    setError(null);
    setSubscribed(true);
  }

  return (
    <section data-slot="newsletter" className="bg-background px-4 py-20 sm:py-28">
      <div
        data-slot="newsletter-panel"
        className={cn(
          ENTER,
          'relative mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card p-8 text-center shadow-[0_24px_60px_-34px_color-mix(in_oklch,var(--foreground)_24%,transparent)] sm:p-12',
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_60%)]"
        />

        <div aria-live="polite" className="relative z-10 flex flex-col items-center gap-5">
          <span
            data-slot="newsletter-label"
            style={stagger(1)}
            className={cn(ENTER, 'inline-flex items-center gap-2 text-xs text-muted-foreground uppercase')}
          >
            <Mail aria-hidden className="size-3.5" />
            Release notes
          </span>

          {subscribed ? (
            <div key="success" data-slot="newsletter-success" className={cn(SWAP, 'flex flex-col items-center gap-2')}>
              <h2 className="flex items-center gap-2 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
                <Check aria-hidden className="size-6" />
                You&apos;re on the list.
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                Check your inbox to confirm the subscription.
              </p>
            </div>
          ) : (
            <React.Fragment key="form">
              <div className="flex flex-col items-center gap-2">
                <h2
                  style={stagger(2)}
                  className={cn(ENTER, 'font-serif text-3xl font-medium tracking-tight text-balance sm:text-4xl')}
                >
                  New components, in your inbox.
                </h2>
                <p style={stagger(3)} className={cn(ENTER, 'max-w-md text-sm text-muted-foreground sm:text-base')}>
                  A short note when we ship something. New components, blocks, and the occasional deep dive.
                </p>
              </div>

              <form
                data-slot="newsletter-form"
                onSubmit={handleSubmit}
                noValidate
                style={stagger(4)}
                className={cn(ENTER, 'flex w-full max-w-md flex-col gap-3 sm:flex-row')}
              >
                <Field className="gap-1.5 text-start" data-invalid={error ? true : undefined}>
                  <FieldLabel htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </FieldLabel>
                  <Input
                    id="newsletter-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 'newsletter-error' : undefined}
                  />
                  <FieldError id="newsletter-error">{error}</FieldError>
                </Field>
                <Button type="submit" className="shrink-0">
                  Subscribe
                </Button>
              </form>

              <div style={stagger(5)} className={cn(ENTER, 'flex items-center gap-3')}>
                <div aria-hidden className="flex -space-x-2 rtl:space-x-reverse">
                  {['MS', 'AK', 'JD', 'RL'].map((initials) => (
                    <span
                      key={initials}
                      className="inline-flex size-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium text-muted-foreground"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">Join 1,200+ developers on the list.</span>
              </div>

              <p style={stagger(6)} className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>
                Only release notes. Unsubscribe in one click.
              </p>
            </React.Fragment>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter01;
