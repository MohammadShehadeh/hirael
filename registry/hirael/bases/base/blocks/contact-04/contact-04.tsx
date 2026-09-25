'use client';

import * as React from 'react';
import { Activity, ArrowRight, CheckCircle2, Loader2, Mail, MessagesSquare } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/hirael/bases/base/ui/accordion';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/base/ui/select';
import { Textarea } from '@/registry/hirael/bases/base/ui/textarea';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

const SUPPORT_TIME_ZONE = 'Europe/Lisbon';
const OPENS_AT = 8;
const CLOSES_AT = 20;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

type ReplyStatus = 'open' | 'later-today' | 'tomorrow' | 'monday';

const REPLY_COPY: Record<ReplyStatus, string> = {
  open: 'Online now, replies in about 2 hours',
  'later-today': 'Back today at 08:00 Lisbon time',
  tomorrow: 'Back tomorrow at 08:00 Lisbon time',
  monday: 'Back Monday 08:00 Lisbon time',
};

const getReplyStatus = (): ReplyStatus => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SUPPORT_TIME_ZONE,
    weekday: 'short',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const weekday = parts.find((part) => part.type === 'weekday')?.value ?? '';
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
  const workday = WEEKDAYS.includes(weekday);

  if (workday && hour >= OPENS_AT && hour < CLOSES_AT) return 'open';
  if (workday && hour < OPENS_AT) return 'later-today';
  if (workday && weekday !== 'Fri') return 'tomorrow';

  return 'monday';
};

const subscribeToClock = (onChange: () => void) => {
  const timer = setInterval(onChange, 60_000);

  return () => clearInterval(timer);
};

const getServerReplyStatus = () => null;

const CHANNELS = [
  {
    icon: Mail,
    label: 'Email',
    detail: 'support@hirael.com',
    note: 'Best for anything with screenshots or files.',
    href: 'mailto:support@hirael.com',
  },
  {
    icon: MessagesSquare,
    label: 'Live chat',
    detail: 'In the app, bottom corner',
    note: 'Quickest during support hours.',
    href: '#',
  },
  {
    icon: Activity,
    label: 'Status page',
    detail: 'status.hirael.com',
    note: 'Check here first if something stopped working.',
    href: '#',
  },
] as const;

const QUESTIONS = [
  {
    value: 'refund',
    question: 'How long does a refund take?',
    answer:
      'We send refunds the same day you ask. Your bank usually shows them within 5 to 10 working days, depending on the card.',
  },
  {
    value: 'invoice',
    question: 'Where do I find old invoices?',
    answer:
      'Go to Settings, then Billing. Every invoice from the last seven years is there as a PDF, and you can add a VAT number before downloading.',
  },
  {
    value: 'password',
    question: 'I lost access to my two-factor codes',
    answer:
      'Use one of the backup codes you saved when you turned it on. If you have none, write to us from the account email and we will verify it by hand.',
  },
  {
    value: 'export',
    question: 'Can I take my data with me?',
    answer:
      'Yes. Settings, then Data, lets you export everything as CSV or JSON. Large workspaces get a download link by email instead.',
  },
] as const;

const TOPICS = [
  { value: 'billing', label: 'Billing' },
  { value: 'bug', label: 'Bug' },
  { value: 'account', label: 'Account' },
  { value: 'other', label: 'Something else' },
] as const;

interface Article {
  id: string;
  title: string;
  summary: string;
}

const ARTICLES: readonly { keywords: readonly string[]; articles: readonly Article[] }[] = [
  {
    keywords: ['refund', 'charge', 'cancel'],
    articles: [
      { id: 'refunds', title: 'How refunds work', summary: 'Timing, partial refunds and card statements.' },
      { id: 'cancel', title: 'Cancel before your plan renews', summary: 'Stop the next charge in two clicks.' },
    ],
  },
  {
    keywords: ['invoice', 'receipt', 'vat'],
    articles: [
      { id: 'invoices', title: 'Download past invoices', summary: 'Every invoice as a PDF, back to your first month.' },
      { id: 'vat', title: 'Add a VAT or tax number', summary: 'It appears on every invoice from then on.' },
    ],
  },
  {
    keywords: ['password', 'login', 'log in', 'sign in', '2fa'],
    articles: [
      { id: 'reset', title: 'Reset your password', summary: 'The link lasts 30 minutes, check spam if it is missing.' },
      { id: 'recovery', title: 'Recover an account without 2FA codes', summary: 'What we need to verify it is you.' },
    ],
  },
  {
    keywords: ['export', 'csv', 'download'],
    articles: [
      { id: 'export', title: 'Export your data as CSV or JSON', summary: 'Everything in the workspace, in one file.' },
      {
        id: 'timeout',
        title: 'Why large exports arrive by email',
        summary: 'Workspaces over 1 GB are prepared in the background.',
      },
    ],
  },
];

const findArticles = (subject: string) => {
  const text = subject.toLowerCase();
  if (text.trim().length < 3) return [];

  return ARTICLES.filter((group) => group.keywords.some((keyword) => text.includes(keyword)))
    .flatMap((group) => group.articles)
    .slice(0, 2);
};

const MESSAGE_MAX = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIRST_TICKET = 48213;

interface FormState {
  topic: string;
  email: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = { topic: '', email: '', subject: '', message: '' };

const validate = (state: FormState): FormErrors => {
  const errors: FormErrors = {};
  if (!state.topic) errors.topic = 'Pick the closest topic.';
  if (!state.email.trim()) errors.email = 'We need an email to reply to.';
  else if (!EMAIL_PATTERN.test(state.email.trim())) errors.email = 'That email is missing something.';
  if (state.subject.trim().length < 4) errors.subject = 'Add a short subject.';
  if (state.message.trim().length < 20) errors.message = 'A few more words help us answer the first time.';
  else if (state.message.length > MESSAGE_MAX) errors.message = `Keep it under ${MESSAGE_MAX} characters.`;

  return errors;
};

const ReplyTime = () => {
  const status = React.useSyncExternalStore(subscribeToClock, getReplyStatus, getServerReplyStatus);

  if (!status) {
    return <span aria-hidden className="inline-block h-4 w-56 rounded bg-muted" />;
  }

  const open = status === 'open';

  return (
    <span
      key={status}
      className={cn(SWAP, 'inline-flex items-center gap-2', open ? 'text-primary' : 'text-muted-foreground')}
    >
      {open && (
        <span aria-hidden className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
          <span className="relative size-2 rounded-full bg-primary" />
        </span>
      )}
      {REPLY_COPY[status]}
    </span>
  );
};

type SendStatus = 'idle' | 'sending' | 'sent';

const Contact04 = () => {
  const [form, setForm] = React.useState<FormState>(INITIAL);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [status, setStatus] = React.useState<SendStatus>('idle');
  const [ticket, setTicket] = React.useState(FIRST_TICKET);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const suggestions = findArticles(form.subject);
  const suggestionKey = suggestions.map((article) => article.id).join('-');

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('sending');
    timer.current = setTimeout(() => setStatus('sent'), 1200);
  };

  const reset = () => {
    setForm(INITIAL);
    setErrors({});
    setSubmitted(false);
    setStatus('idle');
    setTicket((current) => current + 1);
  };

  const sending = status === 'sending';

  return (
    <section data-slot="support-contact" className="bg-background py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div data-slot="support-info" className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <span className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>Support</span>
            <h2
              style={stagger(1, 80)}
              className={cn(ENTER, 'text-3xl font-semibold tracking-tight text-balance sm:text-4xl')}
            >
              Get unstuck
            </h2>
            <p style={stagger(2, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
              A person on the support team reads every ticket. Tell us what you expected and what happened instead.
            </p>
            <p
              data-slot="support-reply-time"
              aria-live="polite"
              style={stagger(3, 80)}
              className={cn(ENTER, 'flex flex-col gap-1 text-sm')}
            >
              <span className="text-xs text-muted-foreground uppercase">Current reply time</span>
              <ReplyTime />
            </p>
          </div>

          <ul
            data-slot="support-channels"
            style={stagger(4, 80)}
            className={cn(ENTER, 'flex flex-col divide-y divide-border border-y border-border')}
          >
            {CHANNELS.map((channel) => {
              const Icon = channel.icon;

              return (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    className="group flex items-start gap-3 py-4 transition-colors duration-150 outline-none hover:bg-muted/30 focus-visible:bg-muted/40"
                  >
                    <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-sm font-medium">{channel.label}</span>
                        <span className="text-sm text-muted-foreground">{channel.detail}</span>
                      </span>
                      <span className="text-sm text-pretty text-muted-foreground">{channel.note}</span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div data-slot="support-faq" style={stagger(5, 80)} className={cn(ENTER, 'flex flex-col gap-2')}>
            <h3 className="text-xs font-normal text-muted-foreground uppercase">Asked this week</h3>
            <Accordion>
              {QUESTIONS.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="leading-relaxed text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div
          data-slot="support-form"
          style={stagger(3, 80)}
          className={cn(
            ENTER,
            'relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/40 p-6 shadow-sm md:p-8 lg:self-start',
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"
          />
          {status === 'sent' ? (
            <div
              key="sent"
              role="status"
              className={cn(SWAP, 'flex min-h-96 flex-col items-start justify-center gap-5')}
            >
              <CheckCircle2 aria-hidden className="size-6 text-success" />
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold tracking-tight">
                  Ticket{' '}
                  <span dir="ltr" className="tabular-nums">
                    #{ticket}
                  </span>{' '}
                  is open
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  We sent a copy to <span className="text-foreground">{form.email.trim()}</span>. Reply to that email to
                  add details, it lands in the same ticket.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Send another
              </Button>
            </div>
          ) : (
            <form key="form" noValidate onSubmit={onSubmit} className={cn(ticket > FIRST_TICKET && SWAP)}>
              <FieldGroup className="gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.topic)}>
                    <FieldLabel htmlFor="contact-04-topic">Topic</FieldLabel>
                    <Select
                      items={TOPICS}
                      value={form.topic || null}
                      onValueChange={(value) => set('topic', value ?? '')}
                      disabled={sending}
                    >
                      <SelectTrigger
                        id="contact-04-topic"
                        aria-invalid={Boolean(errors.topic) || undefined}
                        className="w-full"
                      >
                        <SelectValue placeholder="Choose a topic" />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        {TOPICS.map((topic) => (
                          <SelectItem key={topic.value} value={topic.value}>
                            {topic.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>{errors.topic}</FieldError>
                  </Field>
                  <Field data-invalid={Boolean(errors.email)}>
                    <FieldLabel htmlFor="contact-04-email">Email</FieldLabel>
                    <Input
                      id="contact-04-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@hirael.com"
                      value={form.email}
                      disabled={sending}
                      aria-invalid={Boolean(errors.email) || undefined}
                      onChange={(event) => set('email', event.target.value)}
                    />
                    <FieldError>{errors.email}</FieldError>
                  </Field>
                </div>

                <div className="flex flex-col">
                  <Field data-invalid={Boolean(errors.subject)}>
                    <FieldLabel htmlFor="contact-04-subject">Subject</FieldLabel>
                    <Input
                      id="contact-04-subject"
                      placeholder="Refund for a double charge"
                      value={form.subject}
                      disabled={sending}
                      aria-invalid={Boolean(errors.subject) || undefined}
                      aria-describedby="contact-04-suggestions"
                      onChange={(event) => set('subject', event.target.value)}
                    />
                    <FieldError>{errors.subject}</FieldError>
                  </Field>

                  <div
                    id="contact-04-suggestions"
                    data-slot="support-suggestions"
                    aria-live="polite"
                    className={cn(
                      'grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                      suggestions.length > 0 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="overflow-hidden">
                      {suggestions.length > 0 && (
                        <div key={suggestionKey} className={cn(SWAP, 'mt-4 border-s-2 border-primary ps-4')}>
                          <p className="text-xs text-muted-foreground uppercase">Suggested answers</p>
                          <ul className="mt-2 flex flex-col gap-2">
                            {suggestions.map((article) => (
                              <li key={article.id}>
                                <a
                                  href="#"
                                  className="group flex flex-col rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                  <span className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 group-hover:underline">
                                    {article.title}
                                    <ArrowRight
                                      aria-hidden
                                      className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                                    />
                                  </span>
                                  <span className="text-sm text-muted-foreground">{article.summary}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Field data-invalid={Boolean(errors.message)}>
                  <FieldLabel htmlFor="contact-04-message">Message</FieldLabel>
                  <Textarea
                    id="contact-04-message"
                    rows={6}
                    placeholder="What you tried, what you expected, and what happened"
                    value={form.message}
                    disabled={sending}
                    aria-invalid={Boolean(errors.message) || undefined}
                    aria-describedby="contact-04-message-count"
                    onChange={(event) => set('message', event.target.value)}
                    className="min-h-32"
                  />
                  <div className="flex items-start justify-between gap-4">
                    {errors.message ? (
                      <FieldError>{errors.message}</FieldError>
                    ) : (
                      <FieldDescription>Include links or error text if you have them.</FieldDescription>
                    )}
                    <span
                      id="contact-04-message-count"
                      dir="ltr"
                      className={cn(
                        'shrink-0 text-xs tabular-nums',
                        form.message.length > MESSAGE_MAX ? 'text-destructive' : 'text-muted-foreground',
                      )}
                    >
                      {form.message.length} / {MESSAGE_MAX}
                    </span>
                  </div>
                </Field>

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">You will get a ticket number straight away.</p>
                  <Button type="submit" disabled={sending} className="group sm:min-w-36">
                    {sending ? (
                      <span key="sending" className={cn(SWAP, 'inline-flex items-center gap-2')}>
                        <Loader2 aria-hidden className="animate-spin" />
                        Sending
                      </span>
                    ) : (
                      <span key="send" className="inline-flex items-center gap-2">
                        Send ticket
                        <ArrowRight
                          aria-hidden
                          className="transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                        />
                      </span>
                    )}
                  </Button>
                </div>
              </FieldGroup>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact04;
