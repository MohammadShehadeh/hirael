'use client';

import * as React from 'react';
import {
  Bell,
  CreditCard,
  KeyRound,
  LogOut,
  Plug,
  Search,
  Settings,
  Shield,
  User,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Card } from '@/registry/hirael/bases/radix/ui/card';
import { CopyButton } from '@/registry/hirael/bases/radix/components/copy-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/radix/ui/dropdown-menu';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/hirael/bases/radix/ui/empty';
import {
  InlineEdit,
  InlineEditControls,
  InlineEditInput,
  InlineEditPreview,
} from '@/registry/hirael/bases/radix/components/inline-edit';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/radix/ui/input-group';
import { Separator } from '@/registry/hirael/bases/radix/ui/separator';
import { Switch } from '@/registry/hirael/bases/radix/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/hirael/bases/radix/ui/tabs';

const NAV = ['Overview', 'Projects', 'Activity', 'Settings'] as const;

type SectionId = 'profile' | 'security' | 'api' | 'billing' | 'integrations';

interface Section {
  id: SectionId;
  label: string;
  icon: LucideIcon;
  desc: string;
}

const SECTIONS: readonly Section[] = [
  { id: 'profile', label: 'Profile', icon: User, desc: 'Your personal details' },
  { id: 'security', label: 'Security', icon: Shield, desc: 'Password and 2FA' },
  { id: 'api', label: 'API keys', icon: KeyRound, desc: 'Tokens and access' },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    desc: 'Plan and invoices',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: Plug,
    desc: 'Connected apps',
  },
];

/**
 * Every row declares how it is changed, so no field ships an action that
 * does nothing: `text` edits in place, `secret` copies, `toggle` flips,
 * and `readonly` is stated as read-only instead of faking a button.
 */
type Field =
  | { kind: 'text'; id: string; label: string; value: string; hint?: string }
  | { kind: 'secret'; id: string; label: string; value: string; hint?: string }
  | {
      kind: 'toggle';
      id: string;
      label: string;
      hint?: string;
      onLabel: string;
      offLabel: string;
      enabled: boolean;
    }
  | {
      kind: 'readonly';
      id: string;
      label: string;
      value: string;
      hint?: string;
    };

const SECTION_FIELDS: Record<SectionId, readonly Field[]> = {
  profile: [
    {
      kind: 'text',
      id: 'name',
      label: 'Full name',
      value: 'Mohammad Shehadeh',
    },
    {
      kind: 'text',
      id: 'email',
      label: 'Email',
      value: 'mohammad@plinth.dev',
      hint: 'Used for sign-in',
    },
    {
      kind: 'readonly',
      id: 'role',
      label: 'Role',
      value: 'Workspace admin',
      hint: 'Set by the workspace owner',
    },
  ],
  security: [
    {
      kind: 'readonly',
      id: 'password',
      label: 'Password',
      value: 'Updated 12 days ago',
      hint: 'Changed from the account recovery flow',
    },
    {
      kind: 'toggle',
      id: '2fa',
      label: 'Two-factor auth',
      hint: 'Authenticator app',
      onLabel: 'Required at sign-in',
      offLabel: 'Off',
      enabled: true,
    },
    {
      kind: 'readonly',
      id: 'sessions',
      label: 'Active sessions',
      value: '3 devices',
      hint: 'Oldest signed in 6 days ago',
    },
  ],
  api: [
    {
      kind: 'secret',
      id: 'live',
      label: 'Production key',
      value: 'msh_live_4f81c2a9d7e08f2a',
      hint: 'Last used 2h ago',
    },
    {
      kind: 'secret',
      id: 'test',
      label: 'Development key',
      value: 'msh_test_90ba17ce4d5b1c0d',
    },
    {
      kind: 'secret',
      id: 'webhook',
      label: 'Webhook secret',
      value: 'whsec_2c7f0e1a6b93d44b9',
    },
  ],
  billing: [
    {
      kind: 'readonly',
      id: 'plan',
      label: 'Current plan',
      value: 'Pro · $24/mo',
      hint: 'Renews 14 June 2026',
    },
    {
      kind: 'readonly',
      id: 'card',
      label: 'Payment method',
      value: 'Visa ending 4242',
      hint: 'Expires 09/28',
    },
    {
      kind: 'text',
      id: 'ap-email',
      label: 'Billing email',
      value: 'ap@plinth.dev',
      hint: 'Invoices are sent here',
    },
  ],
  integrations: [
    {
      kind: 'toggle',
      id: 'vercel',
      label: 'Vercel',
      hint: 'plinth-labs',
      onLabel: 'Deploys on push',
      offLabel: 'Disconnected',
      enabled: true,
    },
    {
      kind: 'toggle',
      id: 'slack',
      label: 'Slack',
      hint: '#product',
      onLabel: 'Alerts on',
      offLabel: 'Disconnected',
      enabled: true,
    },
    {
      kind: 'toggle',
      id: 'linear',
      label: 'Linear',
      onLabel: 'Issues synced',
      offLabel: 'Disconnected',
      enabled: false,
    },
  ],
};

const fieldMatches = (field: Field, query: string) => {
  const haystack = [
    field.label,
    field.hint ?? '',
    field.kind === 'toggle' ? `${field.onLabel} ${field.offLabel}` : field.value,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
};

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <span
      role="img"
      aria-label="Hirael"
      className={cn(
        'flex aspect-square items-center justify-center rounded-md bg-foreground text-background',
        className,
      )}
    >
      <svg
        viewBox="0 0 80 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="size-[64%]"
      >
        <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
        <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
        <path d="M22 86 H58" opacity="0.7" />
        <path d="M28 92 H52" opacity="0.45" />
        <path d="M34 96 H46" opacity="0.25" />
      </svg>
    </span>
  );
};

type SaveState = 'idle' | 'saving' | 'saved';

const FieldRow = ({
  field,
  values,
  toggles,
  onCommit,
  onToggle,
}: {
  field: Field;
  values: Record<string, string>;
  toggles: Record<string, boolean>;
  onCommit: (id: string, value: string) => Promise<void>;
  onToggle: (id: string, next: boolean) => void;
}) => {
  const hintId = field.hint ? `${field.id}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium" id={`${field.id}-label`}>
          {field.label}
        </span>
        {field.hint && (
          <span id={hintId} className="font-mono text-[11px] text-muted-foreground">
            {field.hint}
          </span>
        )}
      </div>

      {field.kind === 'text' && (
        <InlineEdit
          value={values[field.id] ?? field.value}
          onSubmit={(next) => onCommit(field.id, next)}
          validate={(next) => (next.trim() === '' ? `${field.label} cannot be empty` : null)}
          selectOnFocus
          className="flex w-full flex-wrap items-center justify-start gap-1.5 sm:w-72 sm:justify-end"
        >
          <InlineEditPreview
            aria-labelledby={`${field.id}-label`}
            aria-describedby={hintId}
            className="font-mono text-sm"
          />
          <InlineEditInput aria-labelledby={`${field.id}-label`} className="h-8 min-w-0 flex-1 font-mono text-sm" />
          <InlineEditControls />
        </InlineEdit>
      )}

      {field.kind === 'secret' && (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm tabular-nums text-foreground">
            {field.value.slice(0, 9)}
            <span aria-hidden>{'•'.repeat(8)}</span>
            <span className="sr-only"> hidden</span>
            {field.value.slice(-4)}
          </span>
          <CopyButton
            value={field.value}
            variant="outline"
            size="sm"
            aria-label={`Copy ${field.label.toLowerCase()}`}
          />
        </div>
      )}

      {field.kind === 'toggle' && (
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'font-mono text-[11px] uppercase tracking-[0.08em]',
              toggles[field.id] ? 'text-success' : 'text-muted-foreground',
            )}
          >
            {toggles[field.id] ? field.onLabel : field.offLabel}
          </span>
          <Switch
            checked={toggles[field.id]}
            onCheckedChange={(next) => onToggle(field.id, next)}
            aria-labelledby={`${field.id}-label`}
            aria-describedby={hintId}
          />
        </div>
      )}

      {field.kind === 'readonly' && <span className="font-mono text-sm text-muted-foreground">{field.value}</span>}
    </div>
  );
};

const AppShell02 = () => {
  const [section, setSection] = React.useState<SectionId>('profile');
  const [query, setQuery] = React.useState('');
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [toggles, setToggles] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      Object.values(SECTION_FIELDS)
        .flat()
        .filter((f) => f.kind === 'toggle')
        .map((f) => [f.id, f.enabled]),
    ),
  );
  const [saveState, setSaveState] = React.useState<SaveState>('idle');
  const savedTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(savedTimer.current), []);

  const markSaved = React.useCallback(() => {
    setSaveState('saved');
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaveState('idle'), 2000);
  }, []);

  const commitValue = React.useCallback(
    async (id: string, value: string) => {
      setSaveState('saving');
      // Stands in for the request a real settings screen would fire.
      await new Promise((resolve) => setTimeout(resolve, 400));
      setValues((prev) => ({ ...prev, [id]: value }));
      markSaved();
    },
    [markSaved],
  );

  const commitToggle = React.useCallback(
    (id: string, next: boolean) => {
      setToggles((prev) => ({ ...prev, [id]: next }));
      markSaved();
    },
    [markSaved],
  );

  const normalized = query.trim().toLowerCase();

  const matchesBySection = React.useMemo(() => {
    return SECTIONS.reduce<Record<SectionId, readonly Field[]>>(
      (acc, s) => {
        const fields = SECTION_FIELDS[s.id];
        acc[s.id] = normalized ? fields.filter((f) => fieldMatches(f, normalized)) : fields;
        return acc;
      },
      {} as Record<SectionId, readonly Field[]>,
    );
  }, [normalized]);

  const totalMatches = SECTIONS.reduce((sum, s) => sum + matchesBySection[s.id].length, 0);

  return (
    <div className="flex min-h-[640px] flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="container flex h-14 w-full items-center gap-3">
          <BrandMark className="size-7 shrink-0" />

          <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <a
                key={item}
                href="#"
                aria-current={item === 'Settings' ? 'page' : undefined}
                className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-[current=page]:bg-accent aria-[current=page]:text-foreground"
              >
                {item}
              </a>
            ))}
          </nav>

          <InputGroup className="ms-auto h-8 max-w-[220px]">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && query) {
                  e.preventDefault();
                  setQuery('');
                }
              }}
              placeholder="Search settings…"
              aria-label="Search settings"
            />
          </InputGroup>

          <Button variant="outline" size="icon" aria-label="Notifications · 3 unread" className="relative size-8">
            <Bell className="size-3.5" aria-hidden />
            <span aria-hidden className="absolute end-1.5 top-1.5 size-1.5 rounded-full bg-foreground" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Account menu"
                className="size-8 rounded-full bg-foreground font-mono text-[10px] font-medium text-background hover:bg-foreground/90 hover:text-background"
              >
                MS
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <span className="block text-sm font-medium">Mohammad Shehadeh</span>
                <span className="block truncate text-xs text-muted-foreground">mohammad@plinth.dev</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings />
                Workspace settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container w-full py-6 sm:py-8">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            workspace · plinth labs
          </span>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account, security, and workspace integrations. Changes save as you make them.
          </p>
        </div>

        <p aria-live="polite" className="sr-only">
          {normalized ? `${totalMatches} settings match ${query.trim()}` : 'Showing all settings'}
        </p>

        <Tabs
          value={section}
          onValueChange={(v) => setSection(v as SectionId)}
          orientation="vertical"
          className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12"
        >
          <TabsList className="h-auto w-full justify-start gap-1 bg-transparent p-0 lg:col-span-3">
            {SECTIONS.map((s) => {
              const count = matchesBySection[s.id].length;
              return (
                <TabsTrigger
                  key={s.id}
                  value={s.id}
                  className="gap-2.5 rounded-md px-3 py-2 text-sm data-[state=active]:bg-accent data-[state=active]:font-medium data-[state=active]:shadow-none"
                >
                  <s.icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="whitespace-nowrap">{s.label}</span>
                  {normalized && (
                    <Badge
                      variant={count ? 'secondary' : 'outline'}
                      className="ms-auto font-mono text-[10px] tabular-nums"
                    >
                      {count}
                      <span className="sr-only"> matches</span>
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="lg:col-span-9">
            {SECTIONS.map((s) => {
              const fields = matchesBySection[s.id];
              // When this section comes up empty, point at the ones that did not.
              const elsewhere = SECTIONS.filter((other) => other.id !== s.id && matchesBySection[other.id].length > 0);
              return (
                <TabsContent key={s.id} value={s.id} className="mt-0">
                  <Card className="gap-0 overflow-hidden p-0">
                    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-md border border-border bg-muted">
                          <s.icon className="size-4" aria-hidden />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{s.label}</span>
                          <span className="text-xs text-muted-foreground">{s.desc}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="hidden font-mono tabular-nums sm:inline-flex">
                        {fields.length}
                        {normalized ? ` of ${SECTION_FIELDS[s.id].length}` : ''} fields
                      </Badge>
                    </div>

                    {fields.length === 0 ? (
                      <Empty className="border-0">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <Search />
                          </EmptyMedia>
                          <EmptyTitle>Nothing here matches</EmptyTitle>
                          <EmptyDescription>
                            Nothing in {s.label} matches{' '}
                            <span className="font-mono text-foreground">&ldquo;{query.trim()}&rdquo;</span>
                            {elsewhere.length > 0 ? ', but other sections have hits.' : '.'}
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent className="flex-row flex-wrap justify-center gap-2">
                          {elsewhere.map((other) => (
                            <Button key={other.id} variant="outline" size="sm" onClick={() => setSection(other.id)}>
                              <other.icon aria-hidden />
                              {other.label}
                              <Badge variant="secondary" className="font-mono text-[10px] tabular-nums">
                                {matchesBySection[other.id].length}
                              </Badge>
                            </Button>
                          ))}
                          <Button variant="ghost" size="sm" onClick={() => setQuery('')}>
                            Clear search
                          </Button>
                        </EmptyContent>
                      </Empty>
                    ) : (
                      <div className="divide-y divide-border">
                        {fields.map((field) => (
                          <FieldRow
                            key={field.id}
                            field={field}
                            values={values}
                            toggles={toggles}
                            onCommit={commitValue}
                            onToggle={commitToggle}
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-border bg-muted/30 px-5 py-3">
                      <span
                        aria-live="polite"
                        className={cn(
                          'font-mono text-[10px] uppercase tracking-[0.1em]',
                          saveState === 'saved' ? 'text-success' : 'text-muted-foreground',
                        )}
                      >
                        {saveState === 'saving'
                          ? 'saving…'
                          : saveState === 'saved'
                            ? 'all changes saved'
                            : 'changes save automatically'}
                      </span>
                      <Button variant="outline" size="sm" asChild>
                        <a href="#">Audit log</a>
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AppShell02;
