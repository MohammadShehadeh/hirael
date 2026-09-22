'use client';

import * as React from 'react';
import { Check, Mail } from 'lucide-react';

import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/registry/hirael/bases/base/components/animated-number';
import { AvatarStack, AvatarStackItem } from '@/registry/hirael/bases/base/components/avatar-stack';
import { CopyButton } from '@/registry/hirael/bases/base/components/copy-button';
import { Spinner } from '@/registry/hirael/bases/base/components/spinner';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Field, FieldError, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/base/ui/input-group';
import { Progress } from '@/registry/hirael/bases/base/ui/progress';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in zoom-in-97 slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WAITLIST = {
  joined: 3902,
  position: 1284,
  referralUrl: 'https://relay.app/r/k7m2q',
  invites: 0,
} as const;

const JOINED_INITIALS = ['NR', 'TL', 'GO', 'LM'] as const;

const TIERS = [
  { invites: 1, reward: 'Skip 100 spots' },
  { invites: 3, reward: 'Early access' },
  { invites: 10, reward: 'Free for a year' },
] as const;

// Each tier owns an equal slice of the bar, so the first reward is not squeezed
// into the first 10 percent.
const progressFor = (invites: number) => {
  let previous = 0;
  for (const [index, tier] of TIERS.entries()) {
    if (invites <= tier.invites) {
      const slice = (invites - previous) / (tier.invites - previous);
      return ((index + slice) / TIERS.length) * 100;
    }
    previous = tier.invites;
  }
  return 100;
};

type Status = 'idle' | 'loading' | 'joined';

const Newsletter02 = () => {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<Status>('idle');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'loading') return;
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter an email address like you@company.com.');
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setStatus('loading');
    timer.current = setTimeout(() => setStatus('joined'), 700);
  };

  const reset = () => {
    setEmail('');
    setStatus('idle');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const loading = status === 'loading';

  return (
    <section data-slot="waitlist" aria-labelledby="newsletter-02-heading" className="bg-background py-20 md:py-28">
      <div className="mx-auto w-full max-w-xl px-6">
        {status === 'joined' ? (
          <div key="joined" data-slot="waitlist-success" className={cn(SWAP, 'flex flex-col gap-8')}>
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase text-success">
                <Check aria-hidden className="size-3.5" />
                You are on the list
              </span>
              <h2 id="newsletter-02-heading" className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                You&apos;re number{' '}
                <span className="text-warm">
                  <AnimatedNumber value={WAITLIST.position} duration={900} locale="en-US" />
                </span>
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                We sent a confirmation to <span className="text-foreground">{email.trim()}</span>. Invite people you
                work with to move up.
              </p>
            </div>

            <div data-slot="waitlist-referral" className="flex flex-col gap-2">
              <span id="newsletter-02-link-label" className="text-xs uppercase text-muted-foreground">
                Your invite link
              </span>
              <InputGroup>
                <InputGroupInput
                  readOnly
                  dir="ltr"
                  value={WAITLIST.referralUrl}
                  aria-labelledby="newsletter-02-link-label"
                  onFocus={(event) => event.currentTarget.select()}
                />
                <InputGroupAddon align="inline-end">
                  <CopyButton value={WAITLIST.referralUrl} size="sm" aria-label="Copy invite link" />
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div data-slot="waitlist-tiers" className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-4 text-xs">
                <span className="uppercase text-muted-foreground">Rewards</span>
                <span className="text-muted-foreground">
                  <span className="tabular-nums text-foreground">{WAITLIST.invites}</span> of{' '}
                  <span className="tabular-nums">{TIERS[TIERS.length - 1].invites}</span> invites
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={progressFor(WAITLIST.invites)}
                  aria-label="Invite rewards progress"
                  className="h-1.5"
                />
                <div aria-hidden className="absolute inset-0 grid grid-cols-3">
                  {TIERS.map((tier) => (
                    <span key={tier.invites} className="relative">
                      <span
                        className={cn(
                          'absolute end-0 top-1/2 size-2.5 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background rtl:-translate-x-1/2',
                          WAITLIST.invites >= tier.invites ? 'bg-warm' : 'bg-border',
                        )}
                      />
                    </span>
                  ))}
                </div>
              </div>
              <ol className="grid grid-cols-3 gap-3">
                {TIERS.map((tier, index) => (
                  <li
                    key={tier.invites}
                    style={stagger(index, 60, 150)}
                    className={cn(SWAP, 'flex flex-col items-end gap-0.5 text-end')}
                  >
                    <span className="text-xs text-muted-foreground">
                      <span className="tabular-nums">{tier.invites}</span> {tier.invites === 1 ? 'invite' : 'invites'}
                    </span>
                    <span className="text-sm font-medium">{tier.reward}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Button variant="link" size="sm" onClick={reset} className="h-auto w-fit">
              Use a different email
            </Button>
          </div>
        ) : (
          <div key="idle" data-slot="waitlist-form" className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Early access</span>
              <h2
                id="newsletter-02-heading"
                style={stagger(1, 80)}
                className={cn(ENTER, 'text-balance text-3xl font-semibold tracking-tight sm:text-4xl')}
              >
                Get in before the public launch
              </h2>
              <p style={stagger(2, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
                Relay opens to everyone in November. Until then we let people in by their place on the list, a few
                hundred each week.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              style={stagger(3, 80)}
              className={cn(ENTER, 'flex flex-col gap-3 sm:flex-row sm:items-start')}
            >
              <Field data-invalid={error ? true : undefined} className="gap-1.5">
                <FieldLabel htmlFor="newsletter-02-email" className="sr-only">
                  Work email
                </FieldLabel>
                <InputGroup className="h-10">
                  <InputGroupAddon>
                    <Mail aria-hidden />
                  </InputGroupAddon>
                  <InputGroupInput
                    ref={inputRef}
                    id="newsletter-02-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    disabled={loading}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (error) setError(null);
                    }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 'newsletter-02-error' : undefined}
                  />
                </InputGroup>
                <FieldError
                  id="newsletter-02-error"
                  className="animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  {error}
                </FieldError>
              </Field>
              <Button type="submit" size="lg" disabled={loading} className="min-w-28 shrink-0">
                {loading ? <Spinner size="sm" label="Joining the waitlist" /> : 'Join'}
              </Button>
            </form>

            <div style={stagger(4, 80)} className={cn(ENTER, 'flex items-center gap-3')}>
              <AvatarStack size="sm" aria-hidden>
                {JOINED_INITIALS.map((initials) => (
                  <AvatarStackItem key={initials} fallback={initials} />
                ))}
              </AvatarStack>
              <span className="text-sm text-muted-foreground">
                <span dir="ltr" className="tabular-nums text-foreground">
                  {WAITLIST.joined.toLocaleString('en-US')}
                </span>{' '}
                people already joined
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Newsletter02;
