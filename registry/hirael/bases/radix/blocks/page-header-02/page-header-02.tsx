'use client';

import * as React from 'react';
import { UserPlus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/radix/ui/avatar';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/hirael/bases/radix/ui/tabs';

type TabbedHeaderProps = React.ComponentProps<'header'>;

const TabbedHeader = ({ className, ...props }: TabbedHeaderProps) => {
  return <header data-slot="tabbed-header" className={cn('flex flex-col gap-6', className)} {...props} />;
};

type TabbedHeaderRowProps = React.ComponentProps<'div'>;

const TabbedHeaderRow = ({ className, ...props }: TabbedHeaderRowProps) => {
  return (
    <div
      data-slot="tabbed-header-row"
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8', className)}
      {...props}
    />
  );
};

type TabbedHeaderContentProps = React.ComponentProps<'div'>;

const TabbedHeaderContent = ({ className, ...props }: TabbedHeaderContentProps) => {
  return <div data-slot="tabbed-header-content" className={cn('flex min-w-0 flex-col gap-2', className)} {...props} />;
};

type TabbedHeaderTitleProps = React.ComponentProps<'h1'>;

const TabbedHeaderTitle = ({ className, ...props }: TabbedHeaderTitleProps) => {
  return (
    <h1
      data-slot="tabbed-header-title"
      className={cn('text-2xl font-semibold tracking-tight text-balance sm:text-3xl', className)}
      {...props}
    />
  );
};

type TabbedHeaderDescriptionProps = React.ComponentProps<'p'>;

const TabbedHeaderDescription = ({ className, ...props }: TabbedHeaderDescriptionProps) => {
  return (
    <p
      data-slot="tabbed-header-description"
      className={cn('max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base', className)}
      {...props}
    />
  );
};

type TabbedHeaderActionsProps = React.ComponentProps<'div'>;

const TabbedHeaderActions = ({ className, ...props }: TabbedHeaderActionsProps) => {
  return (
    <div data-slot="tabbed-header-actions" className={cn('flex shrink-0 items-center gap-2', className)} {...props} />
  );
};

type TabbedHeaderNavProps = React.ComponentProps<'div'>;

/** Hairline under the tab list; the list scrolls sideways when it doesn't fit. */
const TabbedHeaderNav = ({ className, children, ...props }: TabbedHeaderNavProps) => {
  return (
    <div data-slot="tabbed-header-nav" className={cn('border-b border-border', className)} {...props}>
      <div className="[scrollbar-width:none] overflow-x-auto pb-px [&::-webkit-scrollbar]:hidden">{children}</div>
    </div>
  );
};

type TabbedHeaderCountProps = React.ComponentProps<'span'>;

const TabbedHeaderCount = ({ className, ...props }: TabbedHeaderCountProps) => {
  return (
    <span
      data-slot="tabbed-header-count"
      className={cn('text-xs text-muted-foreground tabular-nums', className)}
      {...props}
    />
  );
};

const hashListeners = new Set<() => void>();

const subscribeToHash = (onChange: () => void) => {
  hashListeners.add(onChange);
  window.addEventListener('hashchange', onChange);

  return () => {
    hashListeners.delete(onChange);
    window.removeEventListener('hashchange', onChange);
  };
};

const readHash = () => window.location.hash.slice(1);

/** Keeps the selected tab in the URL hash so a link or a reload opens the same tab. */
const useHashTab = <T extends string>(tabs: readonly T[], fallback: T) => {
  const hash = React.useSyncExternalStore(subscribeToHash, readHash, () => '');
  const tab = (tabs as readonly string[]).includes(hash) ? (hash as T) : fallback;

  const setTab = React.useCallback((next: T) => {
    // replaceState keeps the router's history state and doesn't scroll to an element with a matching id.
    window.history.replaceState(window.history.state, '', `#${next}`);
    hashListeners.forEach((listener) => listener());
  }, []);

  return [tab, setTab] as const;
};

export {
  TabbedHeader,
  TabbedHeaderRow,
  TabbedHeaderContent,
  TabbedHeaderTitle,
  TabbedHeaderDescription,
  TabbedHeaderActions,
  TabbedHeaderNav,
  TabbedHeaderCount,
  useHashTab,
};

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

const TABS = ['overview', 'members', 'billing', 'settings'] as const;

type Tab = (typeof TABS)[number];

type Role = 'Owner' | 'Admin' | 'Member';

interface Member {
  name: string;
  email: string;
  role: Role;
  invited?: boolean;
}

const INITIAL_MEMBERS: readonly Member[] = [
  { name: 'Maya Okafor', email: 'maya@northwind.dev', role: 'Owner' },
  { name: 'Daniel Reyes', email: 'daniel@northwind.dev', role: 'Admin' },
  { name: 'Priya Natarajan', email: 'priya@northwind.dev', role: 'Member' },
  { name: 'Tomas Ferreira', email: 'tomas@northwind.dev', role: 'Member' },
  { name: 'Lena Vogel', email: 'lena@northwind.dev', role: 'Member' },
];

const SEAT_PRICE = 12;

const INVOICES = [
  { id: 'INV-0931', date: 'Sep 1, 2026', amount: 60 },
  { id: 'INV-0874', date: 'Aug 1, 2026', amount: 60 },
  { id: 'INV-0812', date: 'Jul 1, 2026', amount: 48 },
] as const;

const ACTIVITY = [
  { who: 'Daniel Reyes', what: 'created the project Checkout redesign', when: '2 hours ago' },
  { who: 'Priya Natarajan', what: 'uploaded 14 files to Brand assets', when: 'Yesterday' },
  { who: 'Maya Okafor', what: 'changed the plan to Team', when: 'Sep 1' },
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const initialsOf = (name: string) =>
  name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const StatLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs text-muted-foreground uppercase">{children}</span>
);

const PageHeader02 = () => {
  const [tab, setTab] = useHashTab(TABS, 'overview');
  const [workspace, setWorkspace] = React.useState('Northwind Labs');
  const [members, setMembers] = React.useState<readonly Member[]>(INITIAL_MEMBERS);
  const [focusInvite, setFocusInvite] = React.useState(false);
  const inviteRef = React.useRef<HTMLInputElement>(null);

  const selectTab = (next: Tab) => {
    setFocusInvite(false);
    setTab(next);
  };

  const startInvite = () => {
    if (tab === 'members') {
      inviteRef.current?.focus();

      return;
    }
    setFocusInvite(true);
    setTab('members');
  };

  const pending = members.filter((member) => member.invited).length;

  return (
    <section data-slot="page-header-02" className="bg-background py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 md:px-10">
        <Tabs value={tab} onValueChange={(value) => selectTab(value as Tab)}>
          <TabbedHeader className="mb-6">
            <TabbedHeaderRow>
              <TabbedHeaderContent>
                <TabbedHeaderTitle className={ENTER}>{workspace}</TabbedHeaderTitle>
                <TabbedHeaderDescription style={stagger(1, 80)} className={ENTER}>
                  Workspace for the design and platform teams. Changes here apply to every project inside it.
                </TabbedHeaderDescription>
              </TabbedHeaderContent>
              <TabbedHeaderActions style={stagger(2, 80)} className={ENTER}>
                <Button type="button" onClick={startInvite}>
                  <UserPlus aria-hidden />
                  Invite people
                </Button>
              </TabbedHeaderActions>
            </TabbedHeaderRow>

            <TabbedHeaderNav style={stagger(3, 80)} className={ENTER}>
              <TabsList variant="line" aria-label="Workspace sections" className="w-max justify-start">
                <TabsTrigger value="overview" className="flex-none">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="members" className="flex-none">
                  Members
                  <TabbedHeaderCount>{members.length}</TabbedHeaderCount>
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex-none">
                  Billing
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-none">
                  Settings
                </TabsTrigger>
              </TabsList>
            </TabbedHeaderNav>
          </TabbedHeader>

          <TabsContent value="overview" className={SWAP}>
            <div data-slot="page-header-02-overview" className="flex flex-col gap-8">
              <dl className="grid grid-cols-3 gap-4 sm:gap-6">
                <div className="flex flex-col gap-1">
                  <dt>
                    <StatLabel>Members</StatLabel>
                  </dt>
                  <dd className="text-2xl font-semibold tabular-nums">{members.length}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt>
                    <StatLabel>Projects</StatLabel>
                  </dt>
                  <dd className="text-2xl font-semibold tabular-nums">8</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt>
                    <StatLabel>Storage</StatLabel>
                  </dt>
                  <dd className="flex flex-wrap items-baseline gap-x-1.5">
                    <span className="text-2xl font-semibold tabular-nums">38.2 GB</span>
                    <span className="text-sm text-muted-foreground tabular-nums">of 100 GB</span>
                  </dd>
                </div>
              </dl>
              <div className="flex flex-col gap-3">
                <h2 className="text-sm font-medium">Recent activity</h2>
                <ul className="flex flex-col divide-y divide-border border-y border-border">
                  {ACTIVITY.map((entry) => (
                    <li key={entry.what} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                      <span>
                        <span className="font-medium">{entry.who}</span>{' '}
                        <span className="text-muted-foreground">{entry.what}</span>
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{entry.when}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className={SWAP}>
            <MembersPanel
              members={members}
              pending={pending}
              inviteRef={inviteRef}
              autoFocus={focusInvite}
              onInvite={(email) =>
                setMembers((current) => [...current, { name: email, email, role: 'Member', invited: true }])
              }
              onRevoke={(email) => setMembers((current) => current.filter((member) => member.email !== email))}
            />
          </TabsContent>

          <TabsContent value="billing" className={SWAP}>
            <BillingPanel seats={members.length} />
          </TabsContent>

          <TabsContent value="settings" className={SWAP}>
            <SettingsPanel name={workspace} onSave={setWorkspace} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

interface MembersPanelProps {
  members: readonly Member[];
  pending: number;
  inviteRef: React.Ref<HTMLInputElement>;
  autoFocus: boolean;
  onInvite: (email: string) => void;
  onRevoke: (email: string) => void;
}

const MembersPanel = ({ members, pending, inviteRef, autoFocus, onInvite, onRevoke }: MembersPanelProps) => {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(value)) {
      setError('Enter an email address like name@company.com.');

      return;
    }
    if (members.some((member) => member.email === value)) {
      setError('That person is already in the workspace.');

      return;
    }
    onInvite(value);
    setEmail('');
    setError(null);
  };

  return (
    <div data-slot="page-header-02-members" className="flex flex-col gap-6">
      <form onSubmit={submit} noValidate className="flex flex-col gap-2">
        <Field data-invalid={Boolean(error) || undefined}>
          <FieldLabel htmlFor="page-header-02-invite">Invite by email</FieldLabel>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              ref={inviteRef}
              id="page-header-02-invite"
              type="email"
              autoComplete="off"
              autoFocus={autoFocus}
              placeholder="name@company.com"
              value={email}
              aria-invalid={Boolean(error) || undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                setError(null);
              }}
              className="sm:max-w-sm"
            />
            <Button type="submit" variant="outline">
              Send invite
            </Button>
          </div>
          {error ? <FieldError>{error}</FieldError> : <FieldDescription>Invites expire after 7 days.</FieldDescription>}
        </Field>
      </form>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-medium">People</h2>
          <span className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
            {members.length - pending} active{pending > 0 ? `, ${pending} invited` : ''}
          </span>
        </div>
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {members.map((member) => (
            <li key={member.email} className={cn(SWAP, 'flex items-center gap-3 py-3')}>
              <Avatar size="sm">
                <AvatarFallback>{initialsOf(member.name)}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{member.invited ? member.email : member.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {member.invited ? 'Invite sent' : member.email}
                </span>
              </div>
              {member.invited ? (
                <Button type="button" variant="ghost" size="sm" onClick={() => onRevoke(member.email)}>
                  Revoke
                </Button>
              ) : (
                <Badge variant={member.role === 'Owner' ? 'secondary' : 'outline'}>{member.role}</Badge>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const BillingPanel = ({ seats }: { seats: number }) => {
  return (
    <div data-slot="page-header-02-billing" className="flex flex-col gap-8">
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <dt>
            <StatLabel>Plan</StatLabel>
          </dt>
          <dd className="text-sm">
            <span className="font-medium">Team</span>
            <span className="text-muted-foreground tabular-nums">, {currency.format(SEAT_PRICE)} per seat</span>
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt>
            <StatLabel>Next invoice</StatLabel>
          </dt>
          <dd className="text-sm">
            <span className="font-medium tabular-nums">{currency.format(seats * SEAT_PRICE)}</span>
            <span className="text-muted-foreground tabular-nums">
              {' '}
              on Oct 1 for {seats} {seats === 1 ? 'seat' : 'seats'}
            </span>
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt>
            <StatLabel>Payment method</StatLabel>
          </dt>
          <dd className="text-sm tabular-nums">Visa ending 4242</dd>
        </div>
      </dl>
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Invoices</h2>
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {INVOICES.map((invoice) => (
            <li key={invoice.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="flex flex-col">
                <span className="font-medium tabular-nums">{invoice.date}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{invoice.id}</span>
              </span>
              <span className="flex items-center gap-4">
                <span className="tabular-nums">{currency.format(invoice.amount)}</span>
                <Button variant="link" size="sm" asChild>
                  <a href="#">Download</a>
                </Button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface SettingsPanelProps {
  name: string;
  onSave: (name: string) => void;
}

const SettingsPanel = ({ name, onSave }: SettingsPanelProps) => {
  const [value, setValue] = React.useState(name);
  const [saved, setSaved] = React.useState(false);

  const trimmed = value.trim();
  const error =
    trimmed === '' ? 'Give the workspace a name.' : trimmed.length > 40 ? 'Keep it under 40 characters.' : null;
  const dirty = trimmed !== name;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error || !dirty) return;
    onSave(trimmed);
    setSaved(true);
  };

  return (
    <form data-slot="page-header-02-settings" onSubmit={submit} noValidate className="flex max-w-md flex-col gap-4">
      <Field data-invalid={Boolean(error) || undefined}>
        <FieldLabel htmlFor="page-header-02-name">Workspace name</FieldLabel>
        <Input
          id="page-header-02-name"
          value={value}
          aria-invalid={Boolean(error) || undefined}
          onChange={(event) => {
            setValue(event.target.value);
            setSaved(false);
          }}
        />
        {error ? (
          <FieldError>{error}</FieldError>
        ) : (
          <FieldDescription>Shown in the header and in invites.</FieldDescription>
        )}
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={Boolean(error) || !dirty}>
          Save
        </Button>
        <span role="status" className="text-sm text-muted-foreground">
          {saved ? 'Saved' : ''}
        </span>
      </div>
    </form>
  );
};

export default PageHeader02;
