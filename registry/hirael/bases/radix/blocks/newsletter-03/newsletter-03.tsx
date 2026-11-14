'use client';

import * as React from 'react';
import { ArrowRight, Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Checkbox } from '@/registry/hirael/bases/radix/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';

const TOPICS = [
  { id: 'releases', label: 'Releases', hint: 'New features, the day they ship' },
  { id: 'engineering', label: 'Engineering notes', hint: 'How we built it, with numbers' },
  { id: 'events', label: 'Events', hint: 'Talks and workshops, about one a quarter' },
] as const;

type TopicId = (typeof TOPICS)[number]['id'];

const ISSUES = [
  { number: 48, title: 'Comments on branch previews', date: 'Nov 12, 2026', dateTime: '2026-11-12', minutes: 4 },
  { number: 47, title: 'One cache for every branch', date: 'Oct 29, 2026', dateTime: '2026-10-29', minutes: 6 },
  { number: 46, title: 'Roles per project', date: 'Oct 15, 2026', dateTime: '2026-10-15', minutes: 3 },
  { number: 45, title: 'Billing by the second', date: 'Oct 1, 2026', dateTime: '2026-10-01', minutes: 5 },
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FOCUS_RING = 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none';

const joinLabels = (labels: string[]) => {
  if (labels.length < 2) return labels.join('');

  return `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}`;
};

interface SubscribedNoticeProps {
  topicLabels: string[];
  onEdit: () => void;
}

const SubscribedNotice = ({ topicLabels, onEdit }: SubscribedNoticeProps) => (
  <div data-slot="newsletter-success" className={cn(SWAP, 'flex flex-col items-start gap-4')}>
    <p className="flex items-center gap-2 text-lg font-medium tracking-[-0.01em]">
      <Check aria-hidden className="size-5 text-success" />
      You are subscribed.
    </p>
    <p className="text-sm leading-relaxed text-muted-foreground">
      You will get {joinLabels(topicLabels)}. Check your inbox to confirm the address.
    </p>
    <Button variant="outline" size="sm" onClick={onEdit}>
      Change topics
    </Button>
  </div>
);

interface SignupFormProps {
  onSubscribe: (topics: TopicId[]) => void;
}

const SignupForm = ({ onSubscribe }: SignupFormProps) => {
  const [email, setEmail] = React.useState('');
  const [topics, setTopics] = React.useState<TopicId[]>(['releases', 'engineering']);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  const emailError = EMAIL_PATTERN.test(email.trim()) ? null : 'Enter a valid email address.';
  const topicsError = topics.length > 0 ? null : 'Pick at least one topic.';

  const toggleTopic = (id: TopicId, isChecked: boolean) =>
    setTopics((prev) => (isChecked ? [...prev, id] : prev.filter((topic) => topic !== id)));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    if (emailError || topicsError) return;
    onSubscribe(TOPICS.filter((topic) => topics.includes(topic.id)).map((topic) => topic.id));
  };

  return (
    <form data-slot="newsletter-form" noValidate onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={hasSubmitted && emailError ? true : undefined}>
          <FieldLabel htmlFor="newsletter-03-email">Email address</FieldLabel>
          <Input
            id="newsletter-03-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@hirael.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={hasSubmitted && emailError ? true : undefined}
          />
          {hasSubmitted && emailError && <FieldError>{emailError}</FieldError>}
        </Field>

        <FieldSet>
          <FieldLegend variant="label">Topics</FieldLegend>
          <FieldGroup className="gap-3">
            {TOPICS.map((topic) => (
              <Field key={topic.id} orientation="horizontal">
                <Checkbox
                  id={`newsletter-03-${topic.id}`}
                  checked={topics.includes(topic.id)}
                  onCheckedChange={(checked) => toggleTopic(topic.id, checked === true)}
                />
                <div className="flex flex-col gap-0.5">
                  <FieldLabel htmlFor={`newsletter-03-${topic.id}`}>{topic.label}</FieldLabel>
                  <FieldDescription>{topic.hint}</FieldDescription>
                </div>
              </Field>
            ))}
          </FieldGroup>
          {hasSubmitted && topicsError && <FieldError>{topicsError}</FieldError>}
        </FieldSet>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button type="submit">Subscribe</Button>
          <p className="text-sm text-muted-foreground">4,180 subscribers. Unsubscribe in one click.</p>
        </div>
      </FieldGroup>
    </form>
  );
};

const RecentIssues = () => (
  <div data-slot="newsletter-issues" className="flex flex-col gap-4">
    <h3 className="text-xs text-muted-foreground uppercase">Recent issues</h3>
    <ul className="flex flex-col border-y border-border">
      {ISSUES.map((issue) => (
        <li key={issue.number} className="border-b border-border last:border-b-0">
          <a href="#" className={cn('group flex items-baseline gap-4 rounded-sm py-4', FOCUS_RING)}>
            <span className="w-12 shrink-0 text-xs text-muted-foreground tabular-nums">No. {issue.number}</span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-base font-medium tracking-[-0.01em] group-hover:underline group-hover:underline-offset-4">
                {issue.title}
              </span>
              <span className="text-sm text-muted-foreground">
                <time dateTime={issue.dateTime}>{issue.date}</time>, {issue.minutes} min read
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
    <a
      href="#"
      className={cn(
        'group inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium underline-offset-4 hover:underline',
        FOCUS_RING,
      )}
    >
      Browse all 48 issues
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
      />
    </a>
  </div>
);

const Newsletter03 = () => {
  const [subscribedTopics, setSubscribedTopics] = React.useState<TopicId[] | null>(null);

  return (
    <section data-slot="newsletter" className="bg-background py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-5xl gap-12 px-6 md:px-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-4">
            <span className="text-xs text-muted-foreground uppercase">The Hirael Dispatch</span>
            <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
              One email, every other Thursday.
            </h2>
            <p className="max-w-md text-base text-muted-foreground sm:text-lg">
              What shipped, how we built it and what is next. Pick the topics you want and skip the rest.
            </p>
          </header>

          <div aria-live="polite">
            {subscribedTopics ? (
              <SubscribedNotice
                topicLabels={TOPICS.filter((topic) => subscribedTopics.includes(topic.id)).map((topic) => topic.label)}
                onEdit={() => setSubscribedTopics(null)}
              />
            ) : (
              <SignupForm onSubscribe={setSubscribedTopics} />
            )}
          </div>
        </div>

        <RecentIssues />
      </div>
    </section>
  );
};

export default Newsletter03;
