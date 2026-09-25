'use client';

import * as React from 'react';
import { Search, SearchX, SlidersHorizontal, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Checkbox } from '@/registry/hirael/bases/radix/ui/checkbox';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/hirael/bases/radix/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/registry/hirael/bases/radix/ui/input-group';
import { RadioGroup, RadioGroupItem } from '@/registry/hirael/bases/radix/ui/radio-group';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/hirael/bases/radix/ui/sheet';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/radix/ui/toggle-group';

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const tokenize = (query: string) => query.toLowerCase().trim().split(/\s+/).filter(Boolean);

interface SearchHighlightProps extends React.ComponentProps<'span'> {
  /** The text to render. */
  text: string;
  /** Every whitespace-separated term of the query is marked, ignoring case. */
  query: string;
}

const SearchHighlight = ({ text, query, className, ...props }: SearchHighlightProps) => {
  // Longest first so "webhooks" wins over "webhook" inside the alternation.
  const terms = tokenize(query).sort((a, b) => b.length - a.length);
  const parts = terms.length > 0 ? text.split(new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')) : [text];

  return (
    <span data-slot="search-highlight" className={className} {...props}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark key={index} data-slot="search-highlight-mark" className="rounded-sm bg-primary/15 text-foreground">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </span>
  );
};

type SearchFacetProps = React.ComponentProps<'fieldset'>;

const SearchFacet = ({ className, ...props }: SearchFacetProps) => {
  return <fieldset data-slot="search-facet" className={cn('flex min-w-0 flex-col gap-1', className)} {...props} />;
};

type SearchFacetLegendProps = React.ComponentProps<'legend'>;

const SearchFacetLegend = ({ className, ...props }: SearchFacetLegendProps) => {
  return (
    <legend
      data-slot="search-facet-legend"
      className={cn('mb-2 text-xs text-muted-foreground uppercase', className)}
      {...props}
    />
  );
};

type SearchFacetOptionProps = React.ComponentProps<'label'>;

const SearchFacetOption = ({ className, ...props }: SearchFacetOptionProps) => {
  return (
    <label
      data-slot="search-facet-option"
      className={cn(
        '-mx-2 flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent/60 has-disabled:cursor-not-allowed has-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
};

type SearchFacetCountProps = React.ComponentProps<'span'>;

const SearchFacetCount = ({ className, ...props }: SearchFacetCountProps) => {
  return (
    <span
      data-slot="search-facet-count"
      className={cn('ms-auto text-xs text-muted-foreground tabular-nums', className)}
      {...props}
    />
  );
};

interface SearchFilterChipProps extends React.ComponentProps<'span'> {
  /** Called when the chip's remove button is pressed. */
  onRemove: () => void;
  /** Accessible name for the remove button, e.g. "Remove Guide filter". */
  removeLabel: string;
}

const SearchFilterChip = ({ onRemove, removeLabel, className, children, ...props }: SearchFilterChipProps) => {
  return (
    <span
      data-slot="search-filter-chip"
      className={cn(
        'inline-flex h-7 items-center gap-1 rounded-full border border-border bg-card ps-2.5 pe-1 text-xs text-foreground',
        className,
      )}
      {...props}
    >
      {children}
      <button
        type="button"
        data-slot="search-filter-chip-remove"
        aria-label={removeLabel}
        onClick={onRemove}
        className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <X aria-hidden className="size-3" />
      </button>
    </span>
  );
};

export { SearchHighlight, SearchFacet, SearchFacetLegend, SearchFacetOption, SearchFacetCount, SearchFilterChip };

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

// A fixed "today" keeps relative dates identical on the server and in the browser.
const TODAY = Date.UTC(2026, 8, 24);
const DAY = 86_400_000;

type DocType = 'doc' | 'guide' | 'api' | 'changelog';
type Area = 'auth' | 'billing' | 'webhooks' | 'storage' | 'cli';
type UpdatedRange = 'any' | 'week' | 'month';
type Sort = 'relevance' | 'newest';

interface DocRecord {
  id: string;
  title: string;
  type: DocType;
  area: Area;
  snippet: string;
  /** ISO date of the last edit. */
  updated: string;
}

const TYPES: readonly { value: DocType; label: string }[] = [
  { value: 'doc', label: 'Doc' },
  { value: 'guide', label: 'Guide' },
  { value: 'api', label: 'API reference' },
  { value: 'changelog', label: 'Changelog' },
];

const AREAS: readonly { value: Area; label: string }[] = [
  { value: 'auth', label: 'Authentication' },
  { value: 'billing', label: 'Billing' },
  { value: 'webhooks', label: 'Webhooks' },
  { value: 'storage', label: 'Storage' },
  { value: 'cli', label: 'CLI' },
];

const RANGES: readonly { value: UpdatedRange; label: string; days: number }[] = [
  { value: 'any', label: 'Any time', days: Infinity },
  { value: 'week', label: 'Past week', days: 7 },
  { value: 'month', label: 'Past month', days: 30 },
];

const TYPE_LABEL = Object.fromEntries(TYPES.map((type) => [type.value, type.label])) as Record<DocType, string>;
const AREA_LABEL = Object.fromEntries(AREAS.map((area) => [area.value, area.label])) as Record<Area, string>;

const RECORDS: readonly DocRecord[] = [
  {
    id: 'api-keys',
    title: 'Create and rotate API keys',
    type: 'guide',
    area: 'auth',
    snippet: 'Generate a secret key per environment, rotate it without downtime, and revoke keys that leaked.',
    updated: '2026-09-22',
  },
  {
    id: 'oauth-flow',
    title: 'OAuth 2.0 authorization code flow',
    type: 'doc',
    area: 'auth',
    snippet: 'Redirect users to the consent screen, exchange the code for a token, and refresh it before it expires.',
    updated: '2026-09-02',
  },
  {
    id: 'sso-saml',
    title: 'Set up SAML single sign-on',
    type: 'guide',
    area: 'auth',
    snippet: 'Connect Okta, Entra ID or Google Workspace so your team signs in with their company account.',
    updated: '2026-08-14',
  },
  {
    id: 'post-tokens',
    title: 'POST /v1/tokens',
    type: 'api',
    area: 'auth',
    snippet: 'Exchange a refresh token for a new access token. Access tokens expire after 60 minutes.',
    updated: '2026-09-19',
  },
  {
    id: 'delete-sessions',
    title: 'DELETE /v1/sessions/{id}',
    type: 'api',
    area: 'auth',
    snippet: 'Sign a user out of one device by revoking the session and every token issued to it.',
    updated: '2026-07-08',
  },
  {
    id: 'passkeys',
    title: 'Passkeys are generally available',
    type: 'changelog',
    area: 'auth',
    snippet: 'Users can now sign in with a passkey on any device. Password sign-in keeps working alongside it.',
    updated: '2026-09-18',
  },
  {
    id: 'mfa',
    title: 'Require two-factor authentication',
    type: 'doc',
    area: 'auth',
    snippet: 'Enforce an authenticator app or security key for every member of a workspace.',
    updated: '2026-06-11',
  },
  {
    id: 'billing-overview',
    title: 'How billing works',
    type: 'doc',
    area: 'billing',
    snippet: 'You pay per active seat each month. Usage above your plan limits is billed at the end of the cycle.',
    updated: '2026-08-30',
  },
  {
    id: 'get-invoices',
    title: 'GET /v1/invoices',
    type: 'api',
    area: 'billing',
    snippet: 'List invoices for a customer, newest first. Filter by status to find open or past due invoices.',
    updated: '2026-09-16',
  },
  {
    id: 'usage-billing',
    title: 'Bill customers for usage',
    type: 'guide',
    area: 'billing',
    snippet: 'Report metered events from your backend and let Relay turn them into line items on each invoice.',
    updated: '2026-09-10',
  },
  {
    id: 'tax-ids',
    title: 'Add tax IDs to invoices',
    type: 'guide',
    area: 'billing',
    snippet: 'Collect a VAT or GST number at checkout and print it on every invoice you send.',
    updated: '2026-07-27',
  },
  {
    id: 'proration',
    title: 'Proration on mid-cycle plan changes',
    type: 'changelog',
    area: 'billing',
    snippet: 'Upgrades are now charged for the days left in the cycle instead of the full month.',
    updated: '2026-09-05',
  },
  {
    id: 'refunds',
    title: 'Refunds and credit notes',
    type: 'doc',
    area: 'billing',
    snippet: 'Refund a payment in full or in part, or issue a credit note that applies to the next invoice.',
    updated: '2026-05-20',
  },
  {
    id: 'webhooks-quickstart',
    title: 'Receive your first webhook',
    type: 'guide',
    area: 'webhooks',
    snippet: 'Register an endpoint, send a test event from the dashboard, and return a 200 within 10 seconds.',
    updated: '2026-09-21',
  },
  {
    id: 'webhook-signatures',
    title: 'Verify webhook signatures',
    type: 'doc',
    area: 'webhooks',
    snippet:
      'Every request carries a signature header. Compare it to an HMAC of the raw body using your signing secret.',
    updated: '2026-08-19',
  },
  {
    id: 'webhook-retries',
    title: 'Webhook retries with backoff',
    type: 'changelog',
    area: 'webhooks',
    snippet: 'Failed deliveries now retry for 24 hours, and the log shows every attempt with its response code.',
    updated: '2026-08-28',
  },
  {
    id: 'post-webhook-endpoints',
    title: 'POST /v1/webhook_endpoints',
    type: 'api',
    area: 'webhooks',
    snippet: 'Create a webhook endpoint and choose which events it receives. Returns the signing secret once.',
    updated: '2026-09-12',
  },
  {
    id: 'event-types',
    title: 'Event types reference',
    type: 'doc',
    area: 'webhooks',
    snippet: 'Every event Relay sends, with its payload shape and when it fires, from invoice.paid to user.deleted.',
    updated: '2026-09-23',
  },
  {
    id: 'browser-uploads',
    title: 'Upload files from the browser',
    type: 'guide',
    area: 'storage',
    snippet: 'Request a signed upload URL from your server, then send the file straight to storage.',
    updated: '2026-09-14',
  },
  {
    id: 'buckets',
    title: 'Buckets and access rules',
    type: 'doc',
    area: 'storage',
    snippet: 'Keep files private by default and share them with signed URLs that expire after a set time.',
    updated: '2026-07-15',
  },
  {
    id: 'get-objects',
    title: 'GET /v1/objects/{key}',
    type: 'api',
    area: 'storage',
    snippet: 'Download an object or read its metadata. Supports range requests for large files.',
    updated: '2026-06-30',
  },
  {
    id: 'storage-regions',
    title: 'Storage in Frankfurt and Singapore',
    type: 'changelog',
    area: 'storage',
    snippet: 'Pick a region when you create a bucket. Existing buckets stay where they are.',
    updated: '2026-09-09',
  },
  {
    id: 'image-transforms',
    title: 'Resize images on the fly',
    type: 'guide',
    area: 'storage',
    snippet: 'Add width and format parameters to any image URL to serve a smaller WebP or AVIF copy.',
    updated: '2026-08-06',
  },
  {
    id: 'cli-install',
    title: 'Install the Relay CLI',
    type: 'guide',
    area: 'cli',
    snippet: 'Install with Homebrew, npm or a single binary, then sign in with relay login.',
    updated: '2026-09-20',
  },
  {
    id: 'cli-env',
    title: 'Manage environment variables',
    type: 'doc',
    area: 'cli',
    snippet: 'Pull secrets into a local .env file, or push changes to staging and production from the terminal.',
    updated: '2026-08-25',
  },
  {
    id: 'cli-listen',
    title: 'Forward webhooks to localhost',
    type: 'guide',
    area: 'cli',
    snippet: 'Run relay listen to receive live webhook events on your machine while you build.',
    updated: '2026-09-17',
  },
  {
    id: 'cli-v3',
    title: 'CLI 3.0 with shell completions',
    type: 'changelog',
    area: 'cli',
    snippet: 'Tab completion for bash, zsh and fish, plus a faster login that opens your browser.',
    updated: '2026-09-01',
  },
  {
    id: 'cli-commands',
    title: 'CLI command reference',
    type: 'api',
    area: 'cli',
    snippet: 'Every command and flag, with examples, from relay deploy to relay logs --follow.',
    updated: '2026-07-29',
  },
];

const daysAgo = (date: string) => Math.round((TODAY - Date.parse(date)) / DAY);

const formatUpdated = (date: string) => {
  const days = daysAgo(date);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;

  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(date));
};

// Every term must appear somewhere; title hits outrank snippet hits.
const scoreRecord = (record: DocRecord, terms: readonly string[]) => {
  const title = record.title.toLowerCase();
  const body = `${record.snippet} ${TYPE_LABEL[record.type]} ${AREA_LABEL[record.area]}`.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += title.startsWith(term) ? 5 : 3;
    else if (body.includes(term)) score += 1;
    else return -1;
  }

  return score;
};

interface Filters {
  types: readonly DocType[];
  areas: readonly Area[];
  updated: UpdatedRange;
}

type FacetKey = keyof Filters;

const passes = (record: DocRecord, filters: Filters, skip?: FacetKey) => {
  if (skip !== 'types' && filters.types.length > 0 && !filters.types.includes(record.type)) return false;
  if (skip !== 'areas' && filters.areas.length > 0 && !filters.areas.includes(record.area)) return false;
  if (skip !== 'updated') {
    const range = RANGES.find((option) => option.value === filters.updated);
    if (range && daysAgo(record.updated) > range.days) return false;
  }

  return true;
};

const toggle = <T,>(list: readonly T[], value: T) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

interface FacetPanelProps {
  matches: readonly DocRecord[];
  filters: Filters;
  onToggleType: (value: DocType) => void;
  onToggleArea: (value: Area) => void;
  onUpdatedChange: (value: UpdatedRange) => void;
}

const FacetPanel = ({ matches, filters, onToggleType, onToggleArea, onUpdatedChange }: FacetPanelProps) => {
  // Each group counts against the other groups' filters, so a count is what you get by ticking that box.
  const countFor = (skip: FacetKey, test: (record: DocRecord) => boolean) =>
    matches.filter((record) => passes(record, filters, skip) && test(record)).length;

  return (
    <div data-slot="search-facets" className="flex flex-col gap-7">
      <SearchFacet>
        <SearchFacetLegend>Type</SearchFacetLegend>
        {TYPES.map((type) => {
          const checked = filters.types.includes(type.value);
          const count = countFor('types', (record) => record.type === type.value);

          return (
            <SearchFacetOption key={type.value}>
              <Checkbox
                checked={checked}
                disabled={count === 0 && !checked}
                onCheckedChange={() => onToggleType(type.value)}
              />
              {type.label}
              <SearchFacetCount>{count}</SearchFacetCount>
            </SearchFacetOption>
          );
        })}
      </SearchFacet>

      <SearchFacet>
        <SearchFacetLegend>Product area</SearchFacetLegend>
        {AREAS.map((area) => {
          const checked = filters.areas.includes(area.value);
          const count = countFor('areas', (record) => record.area === area.value);

          return (
            <SearchFacetOption key={area.value}>
              <Checkbox
                checked={checked}
                disabled={count === 0 && !checked}
                onCheckedChange={() => onToggleArea(area.value)}
              />
              {area.label}
              <SearchFacetCount>{count}</SearchFacetCount>
            </SearchFacetOption>
          );
        })}
      </SearchFacet>

      <SearchFacet>
        <SearchFacetLegend>Updated</SearchFacetLegend>
        <RadioGroup
          value={filters.updated}
          onValueChange={(value) => onUpdatedChange(value as UpdatedRange)}
          aria-label="Updated"
        >
          <div className="flex flex-col gap-1">
            {RANGES.map((range) => (
              <SearchFacetOption key={range.value}>
                <RadioGroupItem value={range.value} />
                {range.label}
                <SearchFacetCount>
                  {countFor('updated', (record) => daysAgo(record.updated) <= range.days)}
                </SearchFacetCount>
              </SearchFacetOption>
            ))}
          </div>
        </RadioGroup>
      </SearchFacet>
    </div>
  );
};

const NO_FILTERS: Filters = { types: [], areas: [], updated: 'any' };

const Search01 = () => {
  const [query, setQuery] = React.useState('webhook');
  const [filters, setFilters] = React.useState<Filters>(NO_FILTERS);
  const [sort, setSort] = React.useState<Sort>('relevance');
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const terms = tokenize(query);
  const scored = RECORDS.map((record) => ({ record, score: scoreRecord(record, terms) })).filter(
    (entry) => entry.score >= 0,
  );
  const matches = scored.map((entry) => entry.record);
  const results = scored
    .filter((entry) => passes(entry.record, filters))
    .sort((a, b) =>
      sort === 'relevance' && a.score !== b.score
        ? b.score - a.score
        : b.record.updated.localeCompare(a.record.updated),
    )
    .map((entry) => entry.record);

  const activeCount = filters.types.length + filters.areas.length + (filters.updated === 'any' ? 0 : 1);
  const updatedLabel = RANGES.find((range) => range.value === filters.updated)?.label;

  const toggleType = (value: DocType) => setFilters((current) => ({ ...current, types: toggle(current.types, value) }));
  const toggleArea = (value: Area) => setFilters((current) => ({ ...current, areas: toggle(current.areas, value) }));
  const changeUpdated = (value: UpdatedRange) => setFilters((current) => ({ ...current, updated: value }));
  const clearAll = () => setFilters(NO_FILTERS);

  const facetProps: FacetPanelProps = {
    matches,
    filters,
    onToggleType: toggleType,
    onToggleArea: toggleArea,
    onUpdatedChange: changeUpdated,
  };

  return (
    <section data-slot="faceted-search" aria-labelledby="search-01-heading" className="bg-background py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 md:gap-10 md:px-10">
        <header data-slot="faceted-search-header" className="flex max-w-2xl flex-col gap-3">
          <h2
            id="search-01-heading"
            className={cn(ENTER, 'text-3xl font-semibold tracking-tight text-balance sm:text-4xl')}
          >
            Search the docs
          </h2>
          <p style={stagger(1, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
            Guides, API reference and release notes for every part of Relay.
          </p>
        </header>

        <form
          role="search"
          data-slot="faceted-search-form"
          style={stagger(2, 80)}
          className={ENTER}
          onSubmit={(event) => event.preventDefault()}
        >
          <InputGroup className="h-11">
            <InputGroupAddon>
              <Search aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape' && query) {
                  event.preventDefault();
                  setQuery('');
                }
              }}
              placeholder="Search guides, endpoints and releases"
              aria-label="Search documentation"
            />
            {query ? (
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-xs" aria-label="Clear search" onClick={() => setQuery('')}>
                  <X aria-hidden />
                </InputGroupButton>
              </InputGroupAddon>
            ) : null}
          </InputGroup>
        </form>

        <div
          style={stagger(3, 80)}
          className={cn(ENTER, 'grid grid-cols-1 gap-10 md:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14')}
        >
          <aside data-slot="faceted-search-sidebar" aria-label="Filters" className="hidden md:block">
            <FacetPanel {...facetProps} />
          </aside>

          <div data-slot="faceted-search-results" className="flex min-w-0 flex-col gap-4">
            <div data-slot="faceted-search-toolbar" className="flex flex-wrap items-center justify-between gap-3">
              <p aria-live="polite" className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground tabular-nums">{results.length}</span>{' '}
                {results.length === 1 ? 'result' : 'results'}
                {query.trim() ? (
                  <>
                    {' '}
                    for <span className="text-foreground">&ldquo;{query.trim()}&rdquo;</span>
                  </>
                ) : null}
              </p>

              <div className="flex items-center gap-2">
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="md:hidden">
                      <SlidersHorizontal aria-hidden />
                      Filters
                      {activeCount > 0 ? <span className="tabular-nums">{activeCount}</span> : null}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="max-h-[85vh]">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Narrow results by type, product area and date.</SheetDescription>
                    </SheetHeader>
                    <div className="overflow-y-auto px-4">
                      <FacetPanel {...facetProps} />
                    </div>
                    <SheetFooter>
                      <Button type="button" onClick={() => setFiltersOpen(false)}>
                        Show {results.length} {results.length === 1 ? 'result' : 'results'}
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>

                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  value={sort}
                  onValueChange={(next) => {
                    if (next) setSort(next as Sort);
                  }}
                  aria-label="Sort results"
                  data-slot="faceted-search-sort"
                >
                  <ToggleGroupItem value="relevance">Relevance</ToggleGroupItem>
                  <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {activeCount > 0 ? (
              <div data-slot="faceted-search-chips" className={cn(SWAP, 'flex flex-wrap items-center gap-2')}>
                {filters.types.map((type) => (
                  <SearchFilterChip
                    key={type}
                    removeLabel={`Remove ${TYPE_LABEL[type]} filter`}
                    onRemove={() => toggleType(type)}
                  >
                    {TYPE_LABEL[type]}
                  </SearchFilterChip>
                ))}
                {filters.areas.map((area) => (
                  <SearchFilterChip
                    key={area}
                    removeLabel={`Remove ${AREA_LABEL[area]} filter`}
                    onRemove={() => toggleArea(area)}
                  >
                    {AREA_LABEL[area]}
                  </SearchFilterChip>
                ))}
                {filters.updated !== 'any' ? (
                  <SearchFilterChip removeLabel={`Remove ${updatedLabel} filter`} onRemove={() => changeUpdated('any')}>
                    {updatedLabel}
                  </SearchFilterChip>
                ) : null}
                <Button type="button" variant="ghost" size="xs" onClick={clearAll}>
                  Clear all
                </Button>
              </div>
            ) : null}

            {results.length > 0 ? (
              <ul
                data-slot="faceted-search-list"
                className="flex flex-col divide-y divide-border border-t border-border"
              >
                {results.map((record, index) => (
                  <li
                    key={record.id}
                    data-slot="search-result"
                    style={stagger(Math.min(index, 6), 40)}
                    className={cn(SWAP, 'flex flex-col gap-1.5 py-5')}
                  >
                    <a
                      href="#"
                      className="w-fit text-base leading-snug font-medium underline-offset-4 outline-none hover:underline focus-visible:underline"
                    >
                      <SearchHighlight text={record.title} query={query} />
                    </a>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <SearchHighlight text={record.snippet} query={query} />
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                      <Badge variant="outline">{TYPE_LABEL[record.type]}</Badge>
                      <span>{AREA_LABEL[record.area]}</span>
                      <span className="ms-auto">
                        Updated{' '}
                        <time dateTime={record.updated} className="tabular-nums">
                          {formatUpdated(record.updated)}
                        </time>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty data-slot="faceted-search-empty" className={SWAP}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchX />
                  </EmptyMedia>
                  <EmptyTitle>No pages match</EmptyTitle>
                  <EmptyDescription>
                    {activeCount > 0
                      ? 'Try removing a filter, or search with fewer words.'
                      : 'Check the spelling, or search with fewer words.'}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery('');
                      clearAll();
                    }}
                  >
                    Clear search and filters
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Search01;
