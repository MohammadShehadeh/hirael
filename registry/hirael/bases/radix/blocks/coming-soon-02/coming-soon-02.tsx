'use client';

import * as React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldError, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { Sparkles } from '@/registry/hirael/bases/radix/components/sparkles';

const HEADLINE = 'Something new is on the way';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE}`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-250 ${EASE}`;

const delay = (ms: number): React.CSSProperties => ({ animationDelay: `${ms}ms` });

const Headline = () => {
  const words = HEADLINE.split(' ');
  const half = Math.floor(words.length / 2);

  return (
    <h1
      data-slot="coming-soon-title"
      className="max-w-xl font-serif text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl md:text-7xl"
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={cn('inline-block', ENTER, i < half ? 'text-muted-foreground' : 'text-foreground')}
          style={delay(60 + i * 40)}
        >
          {word}
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </h1>
  );
};

const NotifyForm = () => {
  const id = React.useId();
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

  if (subscribed) {
    return (
      <p
        data-slot="coming-soon-notify"
        data-state="subscribed"
        role="status"
        aria-live="polite"
        className={cn(SWAP, 'flex min-h-10 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm')}
      >
        <CheckCircle2 aria-hidden className="size-4 shrink-0 text-success" />
        You&apos;re on the list.
        <span className="text-muted-foreground">
          We&apos;ll write to <span className="break-all text-foreground">{email.trim()}</span> when it opens.
        </span>
      </p>
    );
  }

  return (
    <form
      data-slot="coming-soon-notify"
      data-state="idle"
      noValidate
      onSubmit={handleSubmit}
      className="w-full max-w-md"
    >
      <Field className="gap-1.5 text-start" data-invalid={error ? true : undefined}>
        <FieldLabel htmlFor={id} className="sr-only">
          Email address
        </FieldLabel>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id={id}
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
            aria-describedby={error ? `${id}-error` : undefined}
            className="h-10 min-w-0 flex-1"
          />
          <Button type="submit" size="lg" className="group shrink-0">
            Notify me
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
            />
          </Button>
        </div>
        <FieldError id={`${id}-error`}>
          {error}
        </FieldError>
      </Field>
    </form>
  );
};

const ComingSoon02 = () => {
  return (
    <section
      data-slot="coming-soon"
      className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background pt-24"
    >
      <div
        data-slot="coming-soon-body"
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-6 text-center md:px-10"
      >
        <div className={ENTER}>
          <Badge variant="outline" data-slot="coming-soon-badge">
            Launching soon
          </Badge>
        </div>

        <Headline />

        <p
          data-slot="coming-soon-description"
          style={delay(360)}
          className={cn(ENTER, 'mt-2 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg')}
        >
          Hirael Cloud brings managed Postgres and object storage to the same terminal-first console you use for the
          registry. We are finishing the last pieces now.
        </p>

        <div
          data-slot="coming-soon-actions"
          style={delay(420)}
          className={cn(ENTER, 'mt-4 flex w-full flex-col items-center gap-3')}
        >
          <NotifyForm />
          <p className="text-xs text-muted-foreground">One email on launch day. Nothing else.</p>
        </div>
      </div>

      <div
        data-slot="coming-soon-horizon"
        aria-hidden
        className="pointer-events-none relative -mt-32 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,black,transparent)] after:absolute after:-start-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-border after:bg-card after:content-['']"
      >
        <div
          data-slot="coming-soon-horizon-glow"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,color-mix(in_oklch,var(--primary)_40%,transparent),transparent_70%)] opacity-40"
        />
        <Sparkles
          density={4}
          size={1.4}
          color="var(--primary)"
          className="[mask-image:radial-gradient(50%_50%,black,transparent_85%)]"
        />
      </div>
    </section>
  );
};

export default ComingSoon02;
