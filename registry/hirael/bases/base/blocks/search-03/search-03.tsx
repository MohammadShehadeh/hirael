'use client';

import * as React from 'react';
import {
  type LucideIcon,
  ChevronRight,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Presentation,
  Search,
  SearchX,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/base/ui/avatar';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/registry/hirael/bases/base/ui/empty';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/base/ui/input-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/hirael/bases/base/ui/tabs';

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
      <mark key={index} data-slot="search-results-mark" className="rounded-sm bg-primary/15 text-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

type FileExt = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'png' | 'zip' | 'mp4';

interface DocResult {
  kind: 'doc';
  id: string;
  title: string;
  path: readonly string[];
  snippet: string;
}

interface PersonResult {
  kind: 'person';
  id: string;
  name: string;
  role: string;
  team: string;
  email: string;
}

interface FileResult {
  kind: 'file';
  id: string;
  name: string;
  ext: FileExt;
  /** Size in bytes. */
  size: number;
  owner: string;
  /** ISO date of the last edit. */
  updated: string;
}

type Result = DocResult | PersonResult | FileResult;
type Tab = 'all' | Result['kind'];

const TABS: readonly { value: Tab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'doc', label: 'Docs' },
  { value: 'person', label: 'People' },
  { value: 'file', label: 'Files' },
];

const RECORDS: readonly Result[] = [
  {
    kind: 'doc',
    id: 'eng-onboarding',
    title: 'Onboarding checklist for new engineers',
    path: ['Handbook', 'Engineering'],
    snippet: 'Access requests, the first pull request and who to ask for help, day by day for the first two weeks.',
  },
  {
    kind: 'doc',
    id: 'customer-onboarding',
    title: 'Customer onboarding playbook',
    path: ['Handbook', 'Customer success'],
    snippet: 'How we run the first 30 days with a new account, from the kickoff call to the first quarterly review.',
  },
  {
    kind: 'doc',
    id: 'onboarding-survey',
    title: 'Onboarding survey results, Q2',
    path: ['Reports', 'People'],
    snippet: 'New hires rated their first month 4.3 out of 5. Setup time and unclear owners were the top complaints.',
  },
  {
    kind: 'doc',
    id: 'first-week',
    title: 'Your first week',
    path: ['Handbook', 'People', 'Onboarding'],
    snippet: 'What happens on each day of your first week, including team lunches and the product walkthrough.',
  },
  {
    kind: 'doc',
    id: 'buddy-program',
    title: 'Buddy program for new hires',
    path: ['Handbook', 'People'],
    snippet: 'Every new hire gets a buddy from another team for their first month of onboarding.',
  },
  {
    kind: 'doc',
    id: 'laptop-setup',
    title: 'Laptop and accounts setup',
    path: ['Handbook', 'IT'],
    snippet: 'Order a laptop, turn on disk encryption, and get access to email, Slack and GitHub during onboarding.',
  },
  {
    kind: 'doc',
    id: 'expenses',
    title: 'Expense policy',
    path: ['Handbook', 'Finance'],
    snippet: 'What you can expense, the limits for travel and meals, and how to submit receipts before the 5th.',
  },
  {
    kind: 'doc',
    id: 'deploys',
    title: 'How we deploy',
    path: ['Engineering', 'Platform'],
    snippet: 'Every merge to main ships to staging. Production deploys go out twice a day after checks pass.',
  },
  {
    kind: 'doc',
    id: 'incidents',
    title: 'Incident response runbook',
    path: ['Engineering', 'Platform'],
    snippet: 'Declare an incident in the incidents channel, pick a lead, and post an update every 30 minutes.',
  },
  {
    kind: 'doc',
    id: 'pricing',
    title: 'Pricing and discount rules',
    path: ['Sales', 'Playbooks'],
    snippet: 'List prices for every plan, and who can approve a discount above 20 percent.',
  },
  {
    kind: 'doc',
    id: 'security-training',
    title: 'Security training',
    path: ['Handbook', 'Security'],
    snippet: 'Yearly training on phishing and data handling. New hires finish it in their first week.',
  },
  {
    kind: 'doc',
    id: 'parental-leave',
    title: 'Parental leave',
    path: ['Handbook', 'People', 'Benefits'],
    snippet: 'Sixteen weeks of paid leave for every parent, with a phased return over four weeks.',
  },
  {
    kind: 'person',
    id: 'maya-chen',
    name: 'Maya Chen',
    role: 'People partner for onboarding',
    team: 'People',
    email: 'maya.chen@hirael.com',
  },
  {
    kind: 'person',
    id: 'grace-liu',
    name: 'Grace Liu',
    role: 'Onboarding specialist',
    team: 'Customer success',
    email: 'grace.liu@hirael.com',
  },
  {
    kind: 'person',
    id: 'omar-farouk',
    name: 'Omar Farouk',
    role: 'Engineering manager',
    team: 'Platform',
    email: 'omar.farouk@hirael.com',
  },
  {
    kind: 'person',
    id: 'elena-petrova',
    name: 'Elena Petrova',
    role: 'Controller',
    team: 'Finance',
    email: 'elena.petrova@hirael.com',
  },
  {
    kind: 'person',
    id: 'kwame-mensah',
    name: 'Kwame Mensah',
    role: 'Security lead',
    team: 'Security',
    email: 'kwame.mensah@hirael.com',
  },
  {
    kind: 'person',
    id: 'lucas-moreau',
    name: 'Lucas Moreau',
    role: 'Account executive',
    team: 'Sales',
    email: 'lucas.moreau@hirael.com',
  },
  {
    kind: 'person',
    id: 'ines-duarte',
    name: 'Ines Duarte',
    role: 'IT support engineer',
    team: 'IT',
    email: 'ines.duarte@hirael.com',
  },
  {
    kind: 'person',
    id: 'ravi-kapoor',
    name: 'Ravi Kapoor',
    role: 'Staff engineer',
    team: 'Platform',
    email: 'ravi.kapoor@hirael.com',
  },
  {
    kind: 'person',
    id: 'nora-lindqvist',
    name: 'Nora Lindqvist',
    role: 'Recruiter',
    team: 'People',
    email: 'nora.lindqvist@hirael.com',
  },
  {
    kind: 'file',
    id: 'onboarding-deck',
    name: 'Onboarding deck 2026',
    ext: 'pptx',
    size: 18_400_000,
    owner: 'Maya Chen',
    updated: '2026-09-15',
  },
  {
    kind: 'file',
    id: 'onboarding-checklist',
    name: 'onboarding-checklist',
    ext: 'pdf',
    size: 412_000,
    owner: 'Omar Farouk',
    updated: '2026-08-29',
  },
  {
    kind: 'file',
    id: 'onboarding-cohort',
    name: 'Onboarding cohort September',
    ext: 'xlsx',
    size: 86_000,
    owner: 'Nora Lindqvist',
    updated: '2026-09-01',
  },
  {
    kind: 'file',
    id: 'expense-template',
    name: 'Expense report template',
    ext: 'xlsx',
    size: 54_000,
    owner: 'Elena Petrova',
    updated: '2026-06-03',
  },
  {
    kind: 'file',
    id: 'floor-plan',
    name: 'Office floor plan',
    ext: 'png',
    size: 2_100_000,
    owner: 'Ines Duarte',
    updated: '2026-05-22',
  },
  {
    kind: 'file',
    id: 'board-update',
    name: 'Q3 board update',
    ext: 'pptx',
    size: 6_200_000,
    owner: 'Elena Petrova',
    updated: '2026-09-19',
  },
  {
    kind: 'file',
    id: 'incident-review',
    name: 'Incident review, August 14',
    ext: 'docx',
    size: 128_000,
    owner: 'Ravi Kapoor',
    updated: '2026-08-16',
  },
  {
    kind: 'file',
    id: 'customer-logos',
    name: 'Customer logos',
    ext: 'zip',
    size: 24_600_000,
    owner: 'Lucas Moreau',
    updated: '2026-07-11',
  },
  {
    kind: 'file',
    id: 'walkthrough',
    name: 'Product walkthrough recording',
    ext: 'mp4',
    size: 312_000_000,
    owner: 'Grace Liu',
    updated: '2026-09-08',
  },
];

const FILE_ICONS: Record<FileExt, LucideIcon> = {
  pdf: FileText,
  docx: FileText,
  xlsx: FileSpreadsheet,
  pptx: Presentation,
  png: FileImage,
  zip: FileArchive,
  mp4: FileVideo,
};

const PAGE_SIZE = 5;
const SEED_QUERY = 'onboarding';

const primaryText = (record: Result) =>
  record.kind === 'doc' ? record.title : record.kind === 'person' ? record.name : `${record.name}.${record.ext}`;

const secondaryText = (record: Result) =>
  record.kind === 'doc'
    ? `${record.path.join(' ')} ${record.snippet}`
    : record.kind === 'person'
      ? `${record.role} ${record.team} ${record.email}`
      : record.owner;

// Every term must appear; a hit in the title or name outranks one in the body.
const runSearch = (query: string) => {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  return RECORDS.map((record) => {
    const primary = primaryText(record).toLowerCase();
    const secondary = secondaryText(record).toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (primary.includes(term)) score += primary.startsWith(term) ? 4 : 3;
      else if (secondary.includes(term)) score += 1;
      else return null;
    }

    return { record, score };
  })
    .filter((match): match is { record: Result; score: number } => match !== null)
    .sort((a, b) => b.score - a.score)
    .map((match) => match.record);
};

const VOCABULARY = Array.from(
  new Set(
    RECORDS.flatMap((record) =>
      `${primaryText(record)} ${secondaryText(record)}`.toLowerCase().split(/[^a-z0-9]+/),
    ).filter((word) => word.length >= 3),
  ),
);

// Optimal string alignment distance: Levenshtein plus adjacent swaps, so "onbaording" is two edits away.
const editDistance = (a: string, b: string) => {
  const rows = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
      }
    }
  }

  return rows[a.length][b.length];
};

const suggestCorrection = (query: string) => {
  const terms = tokenize(query);
  const corrected = terms.map((term) => {
    if (VOCABULARY.includes(term)) return term;
    const budget = term.length <= 4 ? 1 : 2;
    let best = term;
    let bestDistance = budget + 1;
    for (const word of VOCABULARY) {
      if (Math.abs(word.length - term.length) > budget) continue;
      const distance = editDistance(term, word);
      if (distance < bestDistance) {
        best = word;
        bestDistance = distance;
      }
    }

    return best;
  });
  const suggestion = corrected.join(' ');

  return suggestion !== terms.join(' ') && runSearch(suggestion).length > 0 ? suggestion : null;
};

const sizeFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const formatSize = (bytes: number) => {
  if (bytes >= 1_000_000) return `${sizeFormat.format(bytes / 1_000_000)} MB`;

  return `${sizeFormat.format(bytes / 1_000)} KB`;
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(date));

const formatElapsed = (ms: number) => (ms < 1 ? `${ms.toFixed(2)} ms` : `${Math.round(ms)} ms`);

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

const DocRow = ({ record, query }: { record: DocResult; query: string }) => (
  <div data-slot="search-result-doc" className="flex flex-col gap-1 py-4">
    <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
      {record.path.map((segment, index) => (
        <React.Fragment key={segment}>
          {index > 0 ? <ChevronRight aria-hidden className="size-3 rtl:rotate-180" /> : null}
          <span>
            <Highlight text={segment} query={query} />
          </span>
        </React.Fragment>
      ))}
    </div>
    <a
      href="#"
      className="w-fit text-base leading-snug font-medium underline-offset-4 outline-none hover:underline focus-visible:underline"
    >
      <Highlight text={record.title} query={query} />
    </a>
    <p className="text-sm leading-relaxed text-muted-foreground">
      <Highlight text={record.snippet} query={query} />
    </p>
  </div>
);

const PersonRow = ({ record, query }: { record: PersonResult; query: string }) => (
  <div data-slot="search-result-person" className="flex items-center gap-3 py-3">
    <Avatar>
      <AvatarFallback>{initials(record.name)}</AvatarFallback>
    </Avatar>
    <div className="flex min-w-0 flex-1 flex-col">
      <a
        href="#"
        className="w-fit truncate text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:underline"
      >
        <Highlight text={record.name} query={query} />
      </a>
      <span className="truncate text-xs text-muted-foreground">
        <Highlight text={record.role} query={query} />
        {', '}
        <Highlight text={record.team} query={query} />
      </span>
    </div>
    <span className="hidden truncate text-xs text-muted-foreground sm:block">
      <Highlight text={record.email} query={query} />
    </span>
  </div>
);

const FileRow = ({ record, query }: { record: FileResult; query: string }) => {
  const Icon = FILE_ICONS[record.ext];

  return (
    <div data-slot="search-result-file" className="flex items-center gap-3 py-3">
      <span className="flex size-8 shrink-0 items-center justify-center text-muted-foreground">
        <Icon aria-hidden className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <a
          href="#"
          className="w-fit truncate text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:underline"
        >
          <Highlight text={`${record.name}.${record.ext}`} query={query} />
        </a>
        <span className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
          <span className="uppercase">{record.ext}</span>
          <span className="tabular-nums">{formatSize(record.size)}</span>
          <span>
            <Highlight text={record.owner} query={query} />
          </span>
          <span>
            Updated{' '}
            <time dateTime={record.updated} className="tabular-nums">
              {formatDate(record.updated)}
            </time>
          </span>
        </span>
      </div>
    </div>
  );
};

interface SearchState {
  query: string;
  results: readonly Result[];
  /** Null until the first search the visitor runs, so server and browser render the same text. */
  elapsed: number | null;
}

const Search03 = () => {
  const [draft, setDraft] = React.useState(SEED_QUERY);
  const [search, setSearch] = React.useState<SearchState>(() => ({
    query: SEED_QUERY,
    results: runSearch(SEED_QUERY),
    elapsed: null,
  }));
  const [tab, setTab] = React.useState<Tab>('all');
  const [limit, setLimit] = React.useState(PAGE_SIZE);

  const submit = (query: string) => {
    if (!query.trim()) return;
    const start = performance.now();
    const results = runSearch(query);
    setSearch({ query: query.trim(), results, elapsed: performance.now() - start });
    setDraft(query);
    setLimit(PAGE_SIZE);
  };

  const countFor = (value: Tab) =>
    value === 'all' ? search.results.length : search.results.filter((record) => record.kind === value).length;
  const suggestion = search.results.length === 0 ? suggestCorrection(search.query) : null;
  const total = search.results.length;

  return (
    <section data-slot="search-results" aria-labelledby="search-03-heading" className="bg-background py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 md:px-10">
        <header data-slot="search-results-header" className="flex flex-col gap-3">
          <h2
            id="search-03-heading"
            className={cn(ENTER, 'text-3xl font-semibold tracking-tight text-balance sm:text-4xl')}
          >
            Search Hirael
          </h2>
          <p style={stagger(1, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
            Docs, people and files across the whole company, in one place.
          </p>
        </header>

        <form
          role="search"
          data-slot="search-results-form"
          style={stagger(2, 80)}
          className={cn(ENTER, 'flex gap-2')}
          onSubmit={(event) => {
            event.preventDefault();
            submit(draft);
          }}
        >
          <InputGroup className="h-10 flex-1">
            <InputGroupAddon>
              <Search aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search docs, people and files"
              aria-label="Search"
            />
          </InputGroup>
          <Button type="submit" className="h-10">
            Search
          </Button>
        </form>

        <div style={stagger(3, 80)} className={cn(ENTER, 'flex flex-col gap-4')}>
          <p data-slot="search-results-stats" aria-live="polite" className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground tabular-nums">{total}</span>{' '}
            {total === 1 ? 'result' : 'results'} for{' '}
            <span className="text-foreground">&ldquo;{search.query}&rdquo;</span>
            {search.elapsed !== null ? (
              <>
                {' '}
                in <span className="tabular-nums">{formatElapsed(search.elapsed)}</span>
              </>
            ) : null}
          </p>

          {suggestion ? (
            <p data-slot="search-results-suggestion" className={cn(SWAP, 'text-sm')}>
              Did you mean{' '}
              <button
                type="button"
                onClick={() => submit(suggestion)}
                className="rounded-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {suggestion}
              </button>
              ?
            </p>
          ) : null}

          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value as Tab);
              setLimit(PAGE_SIZE);
            }}
          >
            <TabsList variant="line" className="w-full justify-start">
              {TABS.map((option) => (
                <TabsTrigger key={option.value} value={option.value} className="flex-none">
                  {option.label}
                  <span className="text-xs text-muted-foreground tabular-nums">{countFor(option.value)}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {TABS.map((option) => {
              const matches =
                option.value === 'all'
                  ? search.results
                  : search.results.filter((record) => record.kind === option.value);
              const visible = matches.slice(0, limit);
              const remaining = matches.length - visible.length;

              return (
                <TabsContent key={option.value} value={option.value} className="mt-2">
                  {matches.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      <ul key={search.query} className="flex flex-col divide-y divide-border">
                        {visible.map((record, index) => (
                          <li
                            key={record.id}
                            style={stagger(index % PAGE_SIZE, 40)}
                            className={SWAP}
                            data-slot="search-result"
                            data-kind={record.kind}
                          >
                            {record.kind === 'doc' ? (
                              <DocRow record={record} query={search.query} />
                            ) : record.kind === 'person' ? (
                              <PersonRow record={record} query={search.query} />
                            ) : (
                              <FileRow record={record} query={search.query} />
                            )}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                        <span className="text-xs text-muted-foreground tabular-nums">
                          Showing {visible.length} of {matches.length}
                        </span>
                        {remaining > 0 ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setLimit((current) => current + PAGE_SIZE)}
                          >
                            Show {Math.min(remaining, PAGE_SIZE)} more
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <Empty className={SWAP}>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <SearchX />
                        </EmptyMedia>
                        <EmptyTitle>{total === 0 ? 'No results' : `No ${option.label.toLowerCase()} match`}</EmptyTitle>
                        <EmptyDescription>
                          {total === 0
                            ? 'Check the spelling or try a shorter search.'
                            : `See All for ${total} ${total === 1 ? 'result' : 'results'} of other types.`}
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Search03;
