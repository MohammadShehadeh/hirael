'use client';

import * as React from 'react';
import { Check, Rss } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldError, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/radix/ui/toggle-group';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-250 ${EASE} fill-mode-both motion-reduce:animate-none`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ChangelogTagKind = 'new' | 'improved' | 'fixed';
export type ChangelogFilterValue = 'all' | ChangelogTagKind;

const TAG_LABELS: Record<ChangelogTagKind, string> = {
  new: 'New',
  improved: 'Improved',
  fixed: 'Fixed',
};

const TAG_CLASSES: Record<ChangelogTagKind, string> = {
  new: 'bg-success/10 text-success',
  improved: 'bg-info/10 text-info',
  fixed: 'bg-warning/10 text-warning',
};

interface ChangelogContextValue {
  filter: ChangelogFilterValue;
  setFilter: (filter: ChangelogFilterValue) => void;
}

const ChangelogContext = React.createContext<ChangelogContextValue | null>(null);

const useChangelog = () => {
  const ctx = React.useContext(ChangelogContext);
  if (!ctx) {
    throw new Error('Changelog parts must be used within <Changelog>');
  }
  return ctx;
};

interface ChangelogProps extends React.ComponentProps<'section'> {
  filter?: ChangelogFilterValue;
  defaultFilter?: ChangelogFilterValue;
  onFilterChange?: (filter: ChangelogFilterValue) => void;
}

const Changelog = ({
  filter: filterProp,
  defaultFilter = 'all',
  onFilterChange,
  className,
  children,
  ...props
}: ChangelogProps) => {
  const [filterState, setFilterState] = React.useState(defaultFilter);
  const filter = filterProp ?? filterState;

  const setFilter = React.useCallback(
    (next: ChangelogFilterValue) => {
      if (filterProp === undefined) setFilterState(next);
      onFilterChange?.(next);
    },
    [filterProp, onFilterChange],
  );

  const value = React.useMemo(() => ({ filter, setFilter }), [filter, setFilter]);

  return (
    <ChangelogContext.Provider value={value}>
      <section data-slot="changelog" className={cn('bg-background py-16 sm:py-24', className)} {...props}>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 md:px-10">{children}</div>
      </section>
    </ChangelogContext.Provider>
  );
};

type ChangelogHeaderProps = React.ComponentProps<'header'>;

const ChangelogHeader = ({ className, ...props }: ChangelogHeaderProps) => {
  return (
    <header
      data-slot="changelog-header"
      className={cn(
        'flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
      {...props}
    />
  );
};

type ChangelogTitleProps = React.ComponentProps<'h2'>;

const ChangelogTitle = ({ className, ...props }: ChangelogTitleProps) => {
  return (
    <h2
      data-slot="changelog-title"
      className={cn(
        'font-serif text-4xl font-medium leading-[1.04] tracking-tight text-foreground sm:text-5xl',
        className,
      )}
      {...props}
    />
  );
};

type ChangelogDescriptionProps = React.ComponentProps<'p'>;

const ChangelogDescription = ({ className, ...props }: ChangelogDescriptionProps) => {
  return (
    <p
      data-slot="changelog-description"
      className={cn('max-w-md text-sm text-muted-foreground', className)}
      {...props}
    />
  );
};

type ChangelogSubscribeProps = React.ComponentProps<typeof Button>;

const ChangelogSubscribe = ({ className, children = 'Subscribe', ...props }: ChangelogSubscribeProps) => {
  const id = React.useId();
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setError('Enter your email address.');
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError("That doesn't look like a valid email.");
      return;
    }
    setError(null);
    setSubscribed(true);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" data-slot="changelog-subscribe" className={className} {...props}>
          {subscribed ? <Check aria-hidden /> : <Rss aria-hidden />}
          {subscribed ? 'Subscribed' : children}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" data-slot="changelog-subscribe-panel" className="w-80">
        <div aria-live="polite">
          {subscribed ? (
            <div key="done" data-slot="changelog-subscribe-success" className={cn(SWAP, 'flex flex-col gap-1.5')}>
              <p className="flex items-center gap-2 text-sm font-medium">
                <Check aria-hidden className="size-4" />
                You&apos;re subscribed
              </p>
              <p className="text-sm text-pretty text-muted-foreground">
                Release notes go to <span className="break-all text-foreground">{email.trim()}</span>, one email per
                release.
              </p>
            </div>
          ) : (
            <form key="form" noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Get release notes by email</p>
                <p className="text-sm text-muted-foreground">One email per release, nothing else.</p>
              </div>
              <Field className="gap-1.5" data-invalid={error ? true : undefined}>
                <FieldLabel htmlFor={`${id}-email`} className="sr-only">
                  Email address
                </FieldLabel>
                <Input
                  id={`${id}-email`}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError(null);
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${id}-error` : undefined}
                />
                <FieldError id={`${id}-error`} className="text-xs">
                  {error}
                </FieldError>
              </Field>
              <Button type="submit" size="sm">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const FILTERS: readonly { value: ChangelogFilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'improved', label: 'Improved' },
  { value: 'fixed', label: 'Fixed' },
];

type ChangelogFilterProps = Omit<
  React.ComponentProps<typeof ToggleGroup>,
  'type' | 'value' | 'onValueChange' | 'defaultValue'
>;

const ChangelogFilter = ({ className, ...props }: ChangelogFilterProps) => {
  const { filter, setFilter } = useChangelog();
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={filter}
      onValueChange={(next) => {
        // Radix clears the value when the active item is clicked again;
        // keep one filter selected at all times.
        if (next) setFilter(next as ChangelogFilterValue);
      }}
      aria-label="Filter releases"
      data-slot="changelog-filter"
      className={className}
      {...props}
    >
      {FILTERS.map((item) => (
        <ToggleGroupItem key={item.value} value={item.value} className="text-xs">
          {item.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

type ChangelogListProps = React.ComponentProps<'div'>;

const ChangelogList = ({ className, ...props }: ChangelogListProps) => {
  return <div data-slot="changelog-list" className={cn('group/changelog-list flex flex-col', className)} {...props} />;
};

type ChangelogEmptyProps = React.ComponentProps<'p'>;

/** Place inside `ChangelogList`; it hides itself while any entry is visible. */
const ChangelogEmpty = ({
  className,
  children = 'No releases match this filter yet.',
  ...props
}: ChangelogEmptyProps) => {
  const { filter } = useChangelog();
  return (
    <p
      key={filter}
      data-slot="changelog-empty"
      className={cn(
        SWAP,
        'py-16 text-center text-sm text-muted-foreground group-has-[[data-slot=changelog-entry]]/changelog-list:hidden',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};

const formatDate = (date: string) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
};

interface ChangelogEntryDateProps extends Omit<React.ComponentProps<'time'>, 'children'> {
  date: string;
}

const ChangelogEntryDate = ({ date, className, ...props }: ChangelogEntryDateProps) => {
  return (
    <time
      dateTime={date}
      data-slot="changelog-entry-date"
      className={cn('text-xs uppercase text-muted-foreground', className)}
      {...props}
    >
      {formatDate(date)}
    </time>
  );
};

type ChangelogEntryVersionProps = React.ComponentProps<typeof Badge>;

const ChangelogEntryVersion = ({ className, ...props }: ChangelogEntryVersionProps) => {
  return (
    <Badge
      variant="outline"
      data-slot="changelog-entry-version"
      className={cn('text-[11px] tabular-nums', className)}
      {...props}
    />
  );
};

interface ChangelogEntryProps extends React.ComponentProps<'article'> {
  version: string;
  /** ISO date, e.g. "2026-08-12". */
  date: string;
  /** Used by the filter; the entry hides itself when it has no matching tag. */
  tags?: readonly ChangelogTagKind[];
}

const ChangelogEntry = ({ version, date, tags = [], className, children, ...props }: ChangelogEntryProps) => {
  const { filter } = useChangelog();
  if (filter !== 'all' && !tags.includes(filter)) return null;

  return (
    <article
      data-slot="changelog-entry"
      data-version={version}
      className={cn(
        SWAP,
        'grid grid-cols-1 gap-4 border-b border-border py-10 last-of-type:border-b-0 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-10',
        className,
      )}
      {...props}
    >
      <div className="flex flex-row items-center gap-3 self-start lg:sticky lg:top-6 lg:flex-col lg:items-start lg:gap-2">
        <ChangelogEntryDate date={date} />
        <ChangelogEntryVersion>v{version}</ChangelogEntryVersion>
      </div>
      <div className="flex min-w-0 flex-col gap-4">{children}</div>
    </article>
  );
};

type ChangelogEntryTagsProps = React.ComponentProps<'div'>;

const ChangelogEntryTags = ({ className, ...props }: ChangelogEntryTagsProps) => {
  return (
    <div data-slot="changelog-entry-tags" className={cn('flex flex-wrap items-center gap-1.5', className)} {...props} />
  );
};

interface ChangelogEntryTagProps extends Omit<React.ComponentProps<typeof Badge>, 'variant' | 'children'> {
  kind: ChangelogTagKind;
  children?: React.ReactNode;
}

const ChangelogEntryTag = ({ kind, className, children, ...props }: ChangelogEntryTagProps) => {
  return (
    <Badge
      variant="secondary"
      data-slot="changelog-entry-tag"
      data-kind={kind}
      className={cn('text-xs uppercase', TAG_CLASSES[kind], className)}
      {...props}
    >
      {children ?? TAG_LABELS[kind]}
    </Badge>
  );
};

type ChangelogEntryTitleProps = React.ComponentProps<'h3'>;

const ChangelogEntryTitle = ({ className, ...props }: ChangelogEntryTitleProps) => {
  return (
    <h3
      data-slot="changelog-entry-title"
      className={cn('text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-2xl', className)}
      {...props}
    />
  );
};

type ChangelogEntryBodyProps = React.ComponentProps<'ul'>;

const ChangelogEntryBody = ({ className, ...props }: ChangelogEntryBodyProps) => {
  return (
    <ul
      data-slot="changelog-entry-body"
      className={cn(
        'flex list-disc flex-col gap-2 ps-5 text-sm leading-relaxed text-muted-foreground marker:text-border',
        className,
      )}
      {...props}
    />
  );
};

export {
  Changelog,
  ChangelogHeader,
  ChangelogTitle,
  ChangelogDescription,
  ChangelogSubscribe,
  ChangelogFilter,
  ChangelogList,
  ChangelogEmpty,
  ChangelogEntry,
  ChangelogEntryDate,
  ChangelogEntryVersion,
  ChangelogEntryTags,
  ChangelogEntryTag,
  ChangelogEntryTitle,
  ChangelogEntryBody,
  useChangelog,
};

const ENTRIES: readonly {
  version: string;
  date: string;
  title: string;
  tags: readonly ChangelogTagKind[];
  items: readonly string[];
}[] = [
  {
    version: '2.6.0',
    date: '2026-08-19',
    title: 'Scheduled digests and a faster inbox',
    tags: ['new', 'improved'],
    items: [
      'Send yourself a daily or weekly digest of unread threads. Pick the hour in Settings, Notifications.',
      'Inbox now loads the first 50 threads from cache, so it paints in under 100ms on a warm start.',
      'Keyboard: J and K move between threads, E archives, R replies.',
    ],
  },
  {
    version: '2.5.2',
    date: '2026-08-05',
    title: 'Fixes for shared drafts',
    tags: ['fixed'],
    items: [
      "Two people editing the same draft no longer overwrite each other's paragraph on save.",
      'Attachments over 25 MB show a clear error instead of a spinner that never stops.',
      'Fixed the search box losing focus when results update.',
    ],
  },
  {
    version: '2.5.0',
    date: '2026-07-22',
    title: 'Threads can be assigned',
    tags: ['new'],
    items: [
      'Assign a thread to a teammate from the thread header or with Shift+A. Assignees get a notification and the thread shows up in their Assigned view.',
      'Filter any view by assignee, including Unassigned.',
      'Webhooks and the public API include the assignee on thread objects.',
    ],
  },
  {
    version: '2.4.1',
    date: '2026-07-08',
    title: 'Quieter notifications, better search',
    tags: ['improved', 'fixed'],
    items: [
      'Mentions inside quoted text no longer trigger a notification.',
      'Search understands from:, to:, and before: without quotes around dates.',
      'Fixed a case where archived threads reappeared after a reconnect.',
    ],
  },
];

const Changelog01Block = () => {
  const [filter, setFilter] = React.useState<ChangelogFilterValue>('all');
  const visible = ENTRIES.filter((entry) => filter === 'all' || entry.tags.includes(filter));

  return (
    <Changelog data-slot="changelog-01-block" filter={filter} onFilterChange={setFilter}>
      <ChangelogHeader>
        <div className="flex flex-col gap-3">
          <ChangelogTitle className={ENTER}>Changelog</ChangelogTitle>
          <ChangelogDescription style={{ animationDelay: '70ms' }} className={ENTER}>
            What shipped in Relay, most recent first. Releases go out every other Tuesday.
          </ChangelogDescription>
        </div>
        <div style={{ animationDelay: '140ms' }} className={cn(ENTER, 'flex flex-wrap items-center gap-2')}>
          <ChangelogFilter />
          <ChangelogSubscribe />
        </div>
      </ChangelogHeader>

      <ChangelogList>
        {visible.map((entry, index) => (
          <ChangelogEntry
            key={`${filter}-${entry.version}`}
            version={entry.version}
            date={entry.date}
            tags={entry.tags}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <ChangelogEntryTags>
              {entry.tags.map((tag) => (
                <ChangelogEntryTag key={tag} kind={tag} />
              ))}
            </ChangelogEntryTags>
            <ChangelogEntryTitle>{entry.title}</ChangelogEntryTitle>
            <ChangelogEntryBody>
              {entry.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ChangelogEntryBody>
          </ChangelogEntry>
        ))}
        <ChangelogEmpty />
      </ChangelogList>
    </Changelog>
  );
};

export default Changelog01Block;
