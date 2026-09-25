'use client';

import * as React from 'react';
import { ArrowRight, LifeBuoy, Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/hirael/bases/base/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/registry/hirael/bases/base/ui/input-group';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const tokenize = (query: string) => query.toLowerCase().trim().split(/\s+/).filter(Boolean);

const Highlight = ({ text, query }: { text: string; query: string }) => {
  // Longest first so a longer term wins over its own prefix inside the alternation.
  const terms = tokenize(query).sort((a, b) => b.length - a.length);
  if (terms.length === 0) return text;
  const parts = text.split(new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi'));

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} data-slot="help-search-mark" className="rounded-sm bg-primary/15 text-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

type CategoryId = 'start' | 'account' | 'billing' | 'integrations' | 'troubleshooting' | 'privacy';

interface Article {
  id: string;
  title: string;
  category: CategoryId;
  excerpt: string;
}

const CATEGORIES: readonly { id: CategoryId; label: string }[] = [
  { id: 'start', label: 'Getting started' },
  { id: 'account', label: 'Account and login' },
  { id: 'billing', label: 'Billing' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'privacy', label: 'Privacy and security' },
];

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((category) => [category.id, category.label])) as Record<
  CategoryId,
  string
>;

const ARTICLES: readonly Article[] = [
  {
    id: 'first-inbox',
    title: 'Set up your first shared inbox',
    category: 'start',
    excerpt: 'Connect a support address, invite teammates and choose who gets new conversations.',
  },
  {
    id: 'invite-team',
    title: 'Invite your team',
    category: 'start',
    excerpt: 'Send invites by email or share a link. Invites expire after 7 days.',
  },
  {
    id: 'import',
    title: 'Import conversations from another tool',
    category: 'start',
    excerpt: 'Bring over the last 12 months of email from Zendesk, Help Scout or Front.',
  },
  {
    id: 'saved-replies',
    title: 'Create saved replies',
    category: 'start',
    excerpt: "Write a reply once and insert it with a shortcut. Variables fill in the customer's name.",
  },
  {
    id: 'business-hours',
    title: 'Set business hours',
    category: 'start',
    excerpt: 'Pause SLA timers outside working hours and show an away message.',
  },
  {
    id: 'reset-password',
    title: 'Reset your password',
    category: 'account',
    excerpt: 'Request a reset link from the sign-in page. The link works for 30 minutes.',
  },
  {
    id: 'two-factor',
    title: 'Turn on two-factor authentication',
    category: 'account',
    excerpt: 'Use an authenticator app or a security key to protect your account.',
  },
  {
    id: 'change-email',
    title: 'Change the email on your account',
    category: 'account',
    excerpt: 'Update your sign-in email, then confirm it from the new address.',
  },
  {
    id: 'sso',
    title: 'Sign in with SSO',
    category: 'account',
    excerpt: 'Use Okta, Entra ID or Google Workspace once your admin turns on single sign-on.',
  },
  {
    id: 'delete-account',
    title: 'Delete your account',
    category: 'account',
    excerpt: 'Remove your account and personal data. Workspace owners transfer ownership first.',
  },
  {
    id: 'change-plan',
    title: 'Change your plan',
    category: 'billing',
    excerpt: 'Upgrade or downgrade at any time. Changes are prorated to the day.',
  },
  {
    id: 'invoices',
    title: 'Download invoices',
    category: 'billing',
    excerpt: 'Every invoice is under Settings, Billing. Download a PDF or have it emailed to finance.',
  },
  {
    id: 'payment-method',
    title: 'Update your payment method',
    category: 'billing',
    excerpt: 'Add a new card, or switch to paying by invoice on annual plans.',
  },
  {
    id: 'tax-id',
    title: 'Add a VAT or tax ID',
    category: 'billing',
    excerpt: 'Your tax ID appears on every invoice after you save it.',
  },
  {
    id: 'refunds',
    title: 'Request a refund',
    category: 'billing',
    excerpt: 'We refund annual plans within 30 days of purchase.',
  },
  {
    id: 'slack',
    title: 'Connect Slack',
    category: 'integrations',
    excerpt: 'Post to a channel when a conversation is assigned or misses its SLA.',
  },
  {
    id: 'salesforce',
    title: 'Sync contacts from Salesforce',
    category: 'integrations',
    excerpt: 'Show the account owner and plan next to every conversation.',
  },
  {
    id: 'jira',
    title: 'Create Jira issues from a conversation',
    category: 'integrations',
    excerpt: 'Turn a bug report into a Jira issue and keep the two linked.',
  },
  {
    id: 'api',
    title: 'Use the API and webhooks',
    category: 'integrations',
    excerpt: 'Create an API key and subscribe to conversation events.',
  },
  {
    id: 'emails-missing',
    title: 'Emails are not arriving',
    category: 'troubleshooting',
    excerpt: 'Check your forwarding rule and SPF record, then send a test message.',
  },
  {
    id: 'spam',
    title: "Replies land in customers' spam",
    category: 'troubleshooting',
    excerpt: 'Verify your domain with DKIM so replies come from your own address.',
  },
  {
    id: 'notifications',
    title: 'Notifications stopped working',
    category: 'troubleshooting',
    excerpt: 'Check browser permissions and your notification schedule.',
  },
  {
    id: 'desktop-app',
    title: 'The desktop app will not open',
    category: 'troubleshooting',
    excerpt: 'Clear the app cache, or reinstall the latest version.',
  },
  {
    id: 'attachments',
    title: 'Attachments fail to upload',
    category: 'troubleshooting',
    excerpt: 'Files up to 25 MB upload directly. Larger files are sent as a link.',
  },
  {
    id: 'data-location',
    title: 'Where your data is stored',
    category: 'privacy',
    excerpt: 'Pick a data center in the EU or the US when you create a workspace.',
  },
  {
    id: 'export',
    title: 'Export all workspace data',
    category: 'privacy',
    excerpt: 'Owners can export conversations, contacts and settings as a zip file.',
  },
  {
    id: 'retention',
    title: 'Set data retention rules',
    category: 'privacy',
    excerpt: 'Delete conversations automatically after a period you choose.',
  },
  {
    id: 'report-security',
    title: 'Report a security issue',
    category: 'privacy',
    excerpt: 'Email our security team. We reply within one business day.',
  },
];

const POPULAR_TOPICS: readonly string[] = ['Reset password', 'Invoices', 'Slack', 'Spam', 'Export data'];

const SUPPORT_EMAIL = 'support@hirael.com';

// Every term must appear; title hits rank above excerpt and category hits.
const searchArticles = (query: string) => {
  const terms = tokenize(query);

  return ARTICLES.map((article) => {
    const title = article.title.toLowerCase();
    const rest = `${article.excerpt} ${CATEGORY_LABEL[article.category]}`.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (title.includes(term)) score += 3;
      else if (rest.includes(term)) score += 1;
      else return null;
    }

    return { article, score };
  })
    .filter((match): match is { article: Article; score: number } => match !== null)
    .sort((a, b) => b.score - a.score)
    .map((match) => match.article);
};

const Search04 = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState('');

  const trimmed = query.trim();
  const results = trimmed ? searchArticles(trimmed) : [];
  const mode = !trimmed ? 'browse' : results.length > 0 ? 'results' : 'empty';

  const fillQuery = (value: string) => {
    setQuery(value);
    inputRef.current?.focus();
  };

  return (
    <section data-slot="help-search" aria-labelledby="search-04-heading" className="bg-background py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <div data-slot="help-search-hero" className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2
              id="search-04-heading"
              className={cn(ENTER, 'text-4xl font-semibold tracking-tight text-balance sm:text-5xl')}
            >
              How can we help?
            </h2>
            <p style={stagger(1, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
              Search {ARTICLES.length} articles on setting up, billing and fixing problems in Hirael.
            </p>
          </div>

          <form
            role="search"
            data-slot="help-search-form"
            style={stagger(2, 80)}
            className={cn(ENTER, 'w-full')}
            onSubmit={(event) => event.preventDefault()}
          >
            <InputGroup className="h-12">
              <InputGroupAddon>
                <Search aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape' && query) {
                    event.preventDefault();
                    setQuery('');
                  }
                }}
                placeholder="Describe your question"
                aria-label="Search help articles"
              />
              {query ? (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton size="icon-xs" aria-label="Clear search" onClick={() => fillQuery('')}>
                    <X aria-hidden />
                  </InputGroupButton>
                </InputGroupAddon>
              ) : null}
            </InputGroup>
          </form>

          <div
            data-slot="help-search-topics"
            style={stagger(3, 80)}
            className={cn(ENTER, 'flex flex-wrap items-center justify-center gap-2')}
          >
            <span className="text-xs text-muted-foreground uppercase">Popular</span>
            {POPULAR_TOPICS.map((topic) => (
              <Button
                key={topic}
                type="button"
                variant={trimmed.toLowerCase() === topic.toLowerCase() ? 'secondary' : 'outline'}
                size="xs"
                aria-pressed={trimmed.toLowerCase() === topic.toLowerCase()}
                onClick={() => fillQuery(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>

        <div data-slot="help-search-body" style={stagger(4, 80)} className={ENTER}>
          <p aria-live="polite" className="sr-only">
            {mode === 'browse'
              ? ''
              : `${results.length} ${results.length === 1 ? 'article' : 'articles'} match ${trimmed}`}
          </p>

          {mode === 'browse' ? (
            <div
              key="browse"
              data-slot="help-search-categories"
              className={cn(SWAP, 'grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3')}
            >
              {CATEGORIES.map((category) => {
                const articles = ARTICLES.filter((article) => article.category === category.id);

                return (
                  <section
                    key={category.id}
                    data-slot="help-search-category"
                    aria-labelledby={`search-04-${category.id}`}
                    className="flex flex-col gap-3 border-t border-border pt-5"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 id={`search-04-${category.id}`} className="text-sm font-medium">
                        {category.label}
                      </h3>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {articles.length} {articles.length === 1 ? 'article' : 'articles'}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {articles.map((article) => (
                        <li key={article.id}>
                          <a
                            href="#"
                            className="text-sm text-muted-foreground underline-offset-4 transition-colors outline-none hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline"
                          >
                            {article.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          ) : mode === 'results' ? (
            <div key="results" data-slot="help-search-results" className="mx-auto flex max-w-3xl flex-col gap-3">
              <p className="text-xs text-muted-foreground uppercase">
                <span className="tabular-nums">{results.length}</span> {results.length === 1 ? 'article' : 'articles'}
              </p>
              <ul className="flex flex-col divide-y divide-border border-y border-border">
                {results.map((article, index) => (
                  <li
                    key={article.id}
                    data-slot="help-search-result"
                    style={stagger(Math.min(index, 6), 40)}
                    className={SWAP}
                  >
                    <a
                      href="#"
                      className="group/article flex items-center gap-4 py-4 outline-none focus-visible:bg-accent/50"
                    >
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-base leading-snug font-medium underline-offset-4 group-hover/article:underline">
                          <Highlight text={article.title} query={trimmed} />
                        </span>
                        <span className="truncate text-sm text-muted-foreground">
                          <Highlight text={article.excerpt} query={trimmed} />
                        </span>
                      </span>
                      <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                        {CATEGORY_LABEL[article.category]}
                      </span>
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover/article:translate-x-0.5 rtl:rotate-180 rtl:group-hover/article:-translate-x-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div
              key="empty"
              data-slot="help-search-empty"
              className={cn(SWAP, 'mx-auto max-w-xl border-y border-border')}
            >
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <LifeBuoy />
                  </EmptyMedia>
                  <EmptyTitle>No articles match &ldquo;{trimmed}&rdquo;</EmptyTitle>
                  <EmptyDescription>
                    Ask our support team instead. We answer within two hours on weekdays.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button
                      size="sm"
                      render={
                        <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Question: ${trimmed}`)}`} />
                      }
                      nativeButton={false}
                    >
                      Contact support
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => fillQuery('')}>
                      Clear search
                    </Button>
                  </div>
                </EmptyContent>
              </Empty>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Search04;
