'use client';

import * as React from 'react';
import { ArrowRight, CheckCircle2, Loader2, Mail, MapPin, MessageCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/hirael/bases/radix/ui/card';
import { Checkbox } from '@/registry/hirael/bases/radix/ui/checkbox';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/radix/ui/select';
import { Separator } from '@/registry/hirael/bases/radix/ui/separator';
import { Textarea } from '@/registry/hirael/bases/radix/ui/textarea';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in zoom-in-97 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

const MESSAGE_MAX = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
  consent: boolean;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  name: '',
  email: '',
  company: '',
  topic: 'general',
  message: '',
  consent: false,
};

const TOPICS = [
  { value: 'general', label: 'General question' },
  { value: 'sales', label: 'Sales / pricing' },
  { value: 'partnerships', label: 'Partnership' },
  { value: 'support', label: 'Technical support' },
] as const;

interface Channel {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
}

const CHANNELS: readonly Channel[] = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@hirael.com',
    href: 'mailto:hello@hirael.com',
  },
  {
    icon: MessageCircle,
    label: 'Discord',
    value: '#help on the Hirael server',
    href: '#',
  },
];

const validate = (state: FormState): FormErrors => {
  const errors: FormErrors = {};
  if (!state.name.trim()) errors.name = 'Tell us who you are.';
  if (!state.email.trim()) errors.email = 'We need a way to reply.';
  else if (!EMAIL_PATTERN.test(state.email)) errors.email = "That doesn't look like a valid email.";
  if (state.message.trim().length < 20) errors.message = 'A little more detail helps us route your note.';
  if (state.message.length > MESSAGE_MAX) errors.message = `Keep it under ${MESSAGE_MAX} characters.`;
  if (!state.consent) errors.consent = 'Please accept the privacy notice.';

  return errors;
};

type SendStatus = 'idle' | 'sending' | 'sent';

const Contact01 = () => {
  const [state, setState] = React.useState<FormState>(INITIAL);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [touched, setTouched] = React.useState(false);
  const [status, setStatus] = React.useState<SendStatus>('idle');

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
    if (touched) {
      setErrors(validate({ ...state, [key]: value }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const next = validate(state);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus('sending');
    await new Promise((r) => setTimeout(r, 900));
    setStatus('sent');
  };

  const reset = () => {
    setState(INITIAL);
    setErrors({});
    setTouched(false);
    setStatus('idle');
  };

  const messageRemaining = MESSAGE_MAX - state.message.length;

  return (
    <section data-slot="contact" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1480px] px-4">
        <div data-slot="contact-header" className="flex max-w-2xl flex-col gap-5">
          <span className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>Talk to us</span>
          <h2
            style={stagger(1, 70)}
            className={cn(ENTER, 'font-serif text-4xl leading-[1.04] font-medium tracking-tight sm:text-5xl')}
          >
            Have a question we haven&apos;t answered yet?
          </h2>
          <p style={stagger(2, 70)} className={cn(ENTER, 'text-base text-muted-foreground sm:text-lg')}>
            Drop a note and we&apos;ll route it to the right person. Engineering questions, sales, partnerships: all the
            same form.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Card data-slot="contact-form" style={stagger(3, 70)} className={cn(ENTER, 'lg:col-span-7')}>
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>We reply within one business day, usually faster.</CardDescription>
            </CardHeader>
            <CardContent>
              {status === 'sent' ? (
                <div
                  key="sent"
                  role="status"
                  aria-live="polite"
                  data-slot="contact-success"
                  className={cn(SWAP, 'flex flex-col items-start gap-4 py-2')}
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="inline-flex items-center gap-2 text-base font-semibold tracking-[-0.01em]">
                      <CheckCircle2 aria-hidden className="size-4 text-success" />
                      Message sent
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Thanks{state.name ? `, ${state.name.split(' ')[0]}` : ''}. We&apos;ll be in touch at{' '}
                      <span className="text-foreground">{state.email}</span>.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={reset}>
                    Send another
                  </Button>
                </div>
              ) : (
                <form key="form" noValidate onSubmit={onSubmit} className={cn(SWAP, 'block')}>
                  <FieldGroup>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field data-invalid={Boolean(errors.name) || undefined}>
                        <FieldLabel htmlFor="contact-name">Name</FieldLabel>
                        <Input
                          id="contact-name"
                          name="name"
                          autoComplete="name"
                          placeholder="Mira Kovac"
                          value={state.name}
                          onChange={(e) => set('name', e.target.value)}
                          aria-invalid={Boolean(errors.name) || undefined}
                          aria-describedby={errors.name ? 'contact-name-error' : undefined}
                        />
                        <FieldError id="contact-name-error">{errors.name}</FieldError>
                      </Field>
                      <Field data-invalid={Boolean(errors.email) || undefined}>
                        <FieldLabel htmlFor="contact-email">Work email</FieldLabel>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="mira@plinth.dev"
                          value={state.email}
                          onChange={(e) => set('email', e.target.value)}
                          aria-invalid={Boolean(errors.email) || undefined}
                          aria-describedby={errors.email ? 'contact-email-error' : undefined}
                        />
                        <FieldError id="contact-email-error">{errors.email}</FieldError>
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="contact-company">
                          Company <span className="text-xs text-muted-foreground uppercase">optional</span>
                        </FieldLabel>
                        <Input
                          id="contact-company"
                          name="company"
                          autoComplete="organization"
                          placeholder="Plinth Labs"
                          value={state.company}
                          onChange={(e) => set('company', e.target.value)}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="contact-topic">Topic</FieldLabel>
                        <Select value={state.topic} onValueChange={(v) => set('topic', v)}>
                          <SelectTrigger id="contact-topic" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TOPICS.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    <Field data-invalid={Boolean(errors.message) || undefined}>
                      <FieldLabel htmlFor="contact-message">Message</FieldLabel>
                      <Textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        maxLength={MESSAGE_MAX + 50}
                        placeholder="Tell us what you&rsquo;re building, and what&rsquo;s in your way…"
                        value={state.message}
                        onChange={(e) => set('message', e.target.value)}
                        aria-invalid={Boolean(errors.message) || undefined}
                        aria-describedby="contact-message-help contact-message-error"
                      />
                      <div className="flex items-center justify-between">
                        <FieldDescription id="contact-message-help">
                          Plain text. Code snippets welcome.
                        </FieldDescription>
                        <span
                          dir="ltr"
                          className={cn(
                            'shrink-0 text-xs tabular-nums',
                            messageRemaining < 0 ? 'text-destructive' : 'text-muted-foreground',
                          )}
                        >
                          {state.message.length} / {MESSAGE_MAX}
                        </span>
                      </div>
                      <FieldError id="contact-message-error">{errors.message}</FieldError>
                    </Field>

                    <Field orientation="horizontal" data-invalid={Boolean(errors.consent) || undefined}>
                      <Checkbox
                        id="contact-consent"
                        checked={state.consent}
                        onCheckedChange={(v) => set('consent', v === true)}
                        aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
                      />
                      <div className="flex flex-1 flex-col gap-1">
                        <FieldLabel htmlFor="contact-consent">
                          <span>
                            I&apos;ve read the{' '}
                            <a href="#" className="underline underline-offset-4 hover:text-primary">
                              privacy notice
                            </a>
                            .
                          </span>
                        </FieldLabel>
                        <FieldError id="contact-consent-error">{errors.consent}</FieldError>
                      </div>
                    </Field>

                    <Separator />

                    <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                      <p className="text-sm text-muted-foreground">Routed to the right team automatically.</p>
                      <Button type="submit" size="lg" disabled={status === 'sending'} className="group sm:w-fit">
                        {status === 'sending' ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send message
                            <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </FieldGroup>
                </form>
              )}
            </CardContent>
          </Card>

          <aside
            data-slot="contact-aside"
            style={stagger(4, 70)}
            className={cn(ENTER, 'flex flex-col gap-10 lg:col-span-5')}
          >
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground uppercase">Other ways to reach us</p>
              <ul className="flex flex-col border-t border-border">
                {CHANNELS.map((c) => {
                  const Icon = c.icon;

                  return (
                    <li key={c.label} className="border-b border-border">
                      <a
                        href={c.href}
                        className="group flex items-center justify-between gap-4 py-4 transition-colors duration-150 outline-none focus-visible:bg-accent/40"
                      >
                        <span className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground uppercase">
                            <Icon aria-hidden className="size-3.5" />
                            {c.label}
                          </span>
                          <span className="text-sm font-medium text-foreground">{c.value}</span>
                        </span>
                        <ArrowRight className="size-4 text-muted-foreground transition-all duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-foreground rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div data-slot="contact-location" className="flex flex-col gap-1">
              <p className="inline-flex items-center gap-2 text-xs text-muted-foreground uppercase">
                <MapPin aria-hidden className="size-3.5" />
                Remote, mostly
              </p>
              <p className="text-sm text-foreground">
                Spread across time zones from <span dir="ltr">UTC-5</span> to <span dir="ltr">UTC+3</span>.
              </p>
              <p className="text-sm text-muted-foreground">
                Office hours <span dir="ltr">09:00 to 17:00</span> local time.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Contact01;
