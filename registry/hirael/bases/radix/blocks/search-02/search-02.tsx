'use client';

import * as React from 'react';
import { ArrowDown, ArrowUp, CornerDownLeft, FileText, History, Search, TrendingUp, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Kbd } from '@/registry/hirael/bases/radix/components/kbd';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/radix/ui/avatar';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/registry/hirael/bases/radix/ui/input-group';

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
      <mark key={index} data-slot="autocomplete-mark" className="rounded-sm bg-primary/15 text-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

type EntryKind = 'page' | 'person';

interface Entry {
  id: string;
  kind: EntryKind;
  label: string;
  /** Breadcrumb for pages, role for people. */
  detail: string;
  /** Extra words that match but aren't shown. */
  keywords: string;
}

const ENTRIES: readonly Entry[] = [
  { id: 'billing', kind: 'page', label: 'Billing', detail: 'Settings / Billing', keywords: 'plan payment card' },
  {
    id: 'invoices',
    kind: 'page',
    label: 'Invoices',
    detail: 'Settings / Billing / Invoices',
    keywords: 'receipts tax vat',
  },
  { id: 'usage', kind: 'page', label: 'Usage', detail: 'Settings / Billing / Usage', keywords: 'quota limits' },
  { id: 'api-keys', kind: 'page', label: 'API keys', detail: 'Settings / Developers', keywords: 'tokens secret' },
  { id: 'webhooks', kind: 'page', label: 'Webhooks', detail: 'Settings / Developers', keywords: 'events endpoints' },
  { id: 'audit-log', kind: 'page', label: 'Audit log', detail: 'Settings / Security', keywords: 'history events' },
  { id: 'sso', kind: 'page', label: 'Single sign-on', detail: 'Settings / Security', keywords: 'sso saml okta' },
  {
    id: 'two-factor',
    kind: 'page',
    label: 'Two-factor authentication',
    detail: 'Settings / Security',
    keywords: '2fa mfa',
  },
  {
    id: 'team-members',
    kind: 'page',
    label: 'Team members',
    detail: 'Settings / Workspace',
    keywords: 'invite people seats',
  },
  { id: 'domains', kind: 'page', label: 'Domains', detail: 'Settings / Workspace', keywords: 'dns verify' },
  { id: 'notifications', kind: 'page', label: 'Notifications', detail: 'Settings / Account', keywords: 'email alerts' },
  { id: 'integrations', kind: 'page', label: 'Integrations', detail: 'Apps', keywords: 'slack github linear' },
  { id: 'deployments', kind: 'page', label: 'Deployments', detail: 'Projects / Hirael API', keywords: 'releases' },
  {
    id: 'amara-okafor',
    kind: 'person',
    label: 'Amara Okafor',
    detail: 'Engineering manager',
    keywords: 'amara@hirael.com',
  },
  {
    id: 'daniel-reyes',
    kind: 'person',
    label: 'Daniel Reyes',
    detail: 'Staff engineer, Payments',
    keywords: 'daniel@hirael.com billing',
  },
  { id: 'hana-sato', kind: 'person', label: 'Hana Sato', detail: 'Product designer', keywords: 'hana@hirael.com' },
  { id: 'jonas-weber', kind: 'person', label: 'Jonas Weber', detail: 'Support lead', keywords: 'jonas@hirael.com' },
  {
    id: 'leila-haddad',
    kind: 'person',
    label: 'Leila Haddad',
    detail: 'Head of finance',
    keywords: 'leila@hirael.com invoices',
  },
  {
    id: 'marcus-bell',
    kind: 'person',
    label: 'Marcus Bell',
    detail: 'Account executive',
    keywords: 'marcus@hirael.com sales',
  },
  { id: 'priya-nair', kind: 'person', label: 'Priya Nair', detail: 'Data analyst', keywords: 'priya@hirael.com' },
  {
    id: 'sofia-marin',
    kind: 'person',
    label: 'Sofia Marin',
    detail: 'Security engineer',
    keywords: 'sofia@hirael.com sso audit',
  },
  {
    id: 'tom-becker',
    kind: 'person',
    label: 'Tom Becker',
    detail: 'Developer advocate',
    keywords: 'tom@hirael.com api webhooks',
  },
  {
    id: 'yusuf-demir',
    kind: 'person',
    label: 'Yusuf Demir',
    detail: 'Site reliability engineer',
    keywords: 'yusuf@hirael.com deployments',
  },
];

const POPULAR: readonly string[] = ['invoices', 'api keys', 'sso'];

const MAX_RECENTS = 5;

type Option =
  | { key: string; type: 'recent'; entry: Entry }
  | { key: string; type: 'popular'; query: string }
  | { key: string; type: 'result'; entry: Entry };

interface OptionGroup {
  id: string;
  label: string;
  options: Option[];
}

const scoreEntry = (entry: Entry, terms: readonly string[]) => {
  const label = entry.label.toLowerCase();
  const rest = `${entry.detail} ${entry.keywords}`.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (label.startsWith(term) || label.includes(` ${term}`)) score += 4;
    else if (label.includes(term)) score += 2;
    else if (rest.includes(term)) score += 1;
    else return -1;
  }

  return score;
};

const matchKind = (kind: EntryKind, terms: readonly string[], limit: number) =>
  ENTRIES.filter((entry) => entry.kind === kind)
    .map((entry) => ({ entry, score: scoreEntry(entry, terms) }))
    .filter((match) => match.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }): Option => ({ key: `result-${entry.id}`, type: 'result', entry }));

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

const EntryMedia = ({ entry }: { entry: Entry }) =>
  entry.kind === 'person' ? (
    <Avatar size="sm">
      <AvatarFallback>{initials(entry.label)}</AvatarFallback>
    </Avatar>
  ) : (
    <span className="flex size-6 shrink-0 items-center justify-center text-muted-foreground">
      <FileText aria-hidden className="size-4" />
    </span>
  );

const Search02 = () => {
  const baseId = React.useId();
  const listboxId = `${baseId}-listbox`;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const [query, setQuery] = React.useState('');
  // Starts open so the recents and popular searches show before anyone focuses the input.
  const [open, setOpen] = React.useState(true);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [recents, setRecents] = React.useState<readonly string[]>(['webhooks', 'hana-sato']);
  const [opened, setOpened] = React.useState<Entry | null>(null);

  const terms = tokenize(query);
  const groups: OptionGroup[] = [];
  if (terms.length === 0) {
    const recentOptions = recents
      .map((id) => ENTRIES.find((entry) => entry.id === id))
      .filter((entry): entry is Entry => Boolean(entry))
      .map((entry): Option => ({ key: `recent-${entry.id}`, type: 'recent', entry }));
    if (recentOptions.length > 0) groups.push({ id: 'recent', label: 'Recent', options: recentOptions });
    groups.push({
      id: 'popular',
      label: 'Popular',
      options: POPULAR.map((popular): Option => ({ key: `popular-${popular}`, type: 'popular', query: popular })),
    });
  } else {
    const pages = matchKind('page', terms, 5);
    const people = matchKind('person', terms, 4);
    if (pages.length > 0) groups.push({ id: 'pages', label: 'Pages', options: pages });
    if (people.length > 0) groups.push({ id: 'people', label: 'People', options: people });
  }

  const options = groups.flatMap((group) => group.options);
  const active = activeIndex < options.length ? activeIndex : -1;
  const optionId = (option: Option) => `${baseId}-${option.key}`;
  const activeId = open && active >= 0 ? optionId(options[active]) : undefined;

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable || target?.closest('input, textarea, select')) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    // Blur alone misses a click outside while the input was never focused.
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);

    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  React.useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const removeRecent = (id: string) => setRecents((current) => current.filter((recent) => recent !== id));

  const choose = (option: Option) => {
    if (option.type === 'popular') {
      setQuery(option.query);
      setActiveIndex(0);

      return;
    }
    const { entry } = option;
    setOpened(entry);
    setRecents((current) => [entry.id, ...current.filter((id) => id !== entry.id)].slice(0, MAX_RECENTS));
    setQuery('');
    close();
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setOpen(true);
        setActiveIndex(options.length === 0 ? -1 : (active + 1) % options.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setOpen(true);
        setActiveIndex(options.length === 0 ? -1 : active <= 0 ? options.length - 1 : active - 1);
        break;
      case 'Enter': {
        const option = active >= 0 ? options[active] : terms.length > 0 ? options[0] : undefined;
        if (!open || !option) return;
        event.preventDefault();
        choose(option);
        break;
      }
      case 'Escape':
        if (open) {
          event.preventDefault();
          close();
        } else if (query) {
          event.preventDefault();
          setQuery('');
        }
        break;
      case 'Delete': {
        const option = options[active];
        if (!open || option?.type !== 'recent') return;
        event.preventDefault();
        removeRecent(option.entry.id);
        break;
      }
      case 'Tab':
        close();
        break;
    }
  };

  return (
    <section
      data-slot="autocomplete-search"
      aria-labelledby="search-02-heading"
      className="bg-background py-16 sm:py-24"
    >
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-6">
        <header data-slot="autocomplete-search-header" className="flex flex-col gap-3">
          <h2
            id="search-02-heading"
            className={cn(ENTER, 'text-3xl font-semibold tracking-tight text-balance sm:text-4xl')}
          >
            Search your workspace
          </h2>
          <p style={stagger(1, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
            Jump to any settings page or teammate. Press / from anywhere on the page to start typing.
          </p>
        </header>

        <div style={stagger(2, 80)} className={cn(ENTER, 'flex min-h-96 flex-col gap-4')}>
          <div
            ref={rootRef}
            data-slot="autocomplete"
            className="relative"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) close();
            }}
          >
            <InputGroup className="h-11">
              <InputGroupAddon>
                <Search aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                ref={inputRef}
                type="text"
                role="combobox"
                aria-label="Search pages and people"
                aria-expanded={open}
                aria-controls={listboxId}
                aria-activedescendant={activeId}
                aria-autocomplete="list"
                aria-keyshortcuts="/"
                autoComplete="off"
                spellCheck={false}
                placeholder="Search pages and people"
                value={query}
                onFocus={() => setOpen(true)}
                onClick={() => setOpen(true)}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setOpen(true);
                  setActiveIndex(event.target.value.trim() ? 0 : -1);
                }}
                onKeyDown={onInputKeyDown}
              />
              <InputGroupAddon align="inline-end">
                {query ? (
                  <InputGroupButton
                    size="icon-xs"
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery('');
                      setActiveIndex(-1);
                      inputRef.current?.focus();
                    }}
                  >
                    <X aria-hidden />
                  </InputGroupButton>
                ) : (
                  <Kbd aria-hidden data-slot="autocomplete-shortcut">
                    /
                  </Kbd>
                )}
              </InputGroupAddon>
            </InputGroup>

            {open ? (
              <div
                data-slot="autocomplete-popup"
                // Keeps focus in the input, so a click inside the popup doesn't close it.
                onMouseDown={(event) => event.preventDefault()}
                className="absolute inset-x-0 top-full z-20 mt-2 flex animate-in flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md duration-150 ease-out fade-in slide-in-from-top-1 motion-reduce:animate-none"
              >
                <div
                  id={listboxId}
                  role="listbox"
                  aria-label="Suggestions"
                  data-slot="autocomplete-list"
                  className="max-h-80 overflow-y-auto p-1.5"
                >
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      role="group"
                      aria-labelledby={`${baseId}-${group.id}`}
                      data-slot="autocomplete-group"
                      className="flex flex-col pb-1"
                    >
                      <div className="flex items-center justify-between gap-2 px-2 pt-2 pb-1">
                        <span id={`${baseId}-${group.id}`} className="text-xs text-muted-foreground uppercase">
                          {group.label}
                        </span>
                        {group.id === 'recent' ? (
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => {
                              setRecents([]);
                              setActiveIndex(-1);
                            }}
                            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                          >
                            Clear
                          </button>
                        ) : group.id === 'popular' ? null : (
                          <span className="text-xs text-muted-foreground tabular-nums">{group.options.length}</span>
                        )}
                      </div>

                      {group.options.map((option) => {
                        const index = options.indexOf(option);
                        const isActive = index === active;
                        const label = option.type === 'popular' ? option.query : option.entry.label;

                        return (
                          <div
                            key={option.key}
                            id={optionId(option)}
                            role="option"
                            aria-selected={isActive}
                            data-slot="autocomplete-option"
                            data-active={isActive ? '' : undefined}
                            onPointerMove={() => {
                              if (!isActive) setActiveIndex(index);
                            }}
                            onClick={() => choose(option)}
                            className="group/option flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors duration-150 data-active:bg-accent data-active:text-accent-foreground"
                          >
                            {option.type === 'popular' ? (
                              <span className="flex size-6 shrink-0 items-center justify-center text-muted-foreground">
                                <TrendingUp aria-hidden className="size-4" />
                              </span>
                            ) : option.type === 'recent' ? (
                              <span className="flex size-6 shrink-0 items-center justify-center text-muted-foreground">
                                <History aria-hidden className="size-4" />
                              </span>
                            ) : (
                              <EntryMedia entry={option.entry} />
                            )}

                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate">
                                <Highlight text={label} query={query} />
                              </span>
                              {option.type === 'popular' ? null : (
                                <span className="truncate text-xs text-muted-foreground">
                                  <Highlight text={option.entry.detail} query={query} />
                                </span>
                              )}
                            </span>

                            {option.type === 'recent' ? (
                              <button
                                type="button"
                                tabIndex={-1}
                                aria-label={`Remove ${label} from recent searches`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  removeRecent(option.entry.id);
                                }}
                                className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity duration-150 group-hover/option:opacity-100 group-data-active/option:opacity-100 hover:text-foreground [@media(hover:none)]:opacity-100"
                              >
                                <X aria-hidden className="size-3.5" />
                              </button>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {options.length === 0 ? (
                  <p role="status" className="px-4 pt-2 pb-6 text-center text-sm text-muted-foreground">
                    No pages or people match &ldquo;{query.trim()}&rdquo;.
                  </p>
                ) : null}

                <div
                  aria-hidden
                  data-slot="autocomplete-footer"
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border px-3 py-2 text-xs text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Kbd>
                      <ArrowUp />
                    </Kbd>
                    <Kbd>
                      <ArrowDown />
                    </Kbd>
                    to move
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Kbd>
                      <CornerDownLeft />
                    </Kbd>
                    to open
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Kbd>Esc</Kbd>
                    to close
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div data-slot="autocomplete-opened" aria-live="polite" className="text-sm text-muted-foreground">
            {opened ? (
              <p key={opened.id} className={cn(SWAP, 'flex flex-wrap items-baseline gap-x-2')}>
                <span>
                  Opened <span className="font-medium text-foreground">{opened.label}</span>
                </span>
                <span className="text-xs">{opened.detail}</span>
              </p>
            ) : (
              <p>Pick a page or a person to open it. It will show up under Recent next time.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Search02;
