'use client';

import * as React from 'react';
import { UserPlus, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/base/ui/avatar';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/hirael/bases/base/ui/empty';
import { Field, FieldDescription, FieldError } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/base/ui/select';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const ROLES = ['Admin', 'Member', 'Viewer'] as const;
type Role = (typeof ROLES)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OWNER_EMAIL = 'maya@harbor-analytics.com';

interface Invite {
  email: string;
  role: Role;
}

const initials = (email: string) =>
  email
    .split('@')[0]
    .replace(/[^a-z]/gi, '')
    .slice(0, 2)
    .toUpperCase() || '?';

const parseEmails = (raw: string, taken: readonly string[]) => {
  const emails = [
    ...new Set(
      raw
        .split(/[\s,;]+/)
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
  if (emails.length === 0) return { error: 'Enter an email address.' };
  const invalid = emails.find((email) => !EMAIL_RE.test(email));
  if (invalid) return { error: `${invalid} is not an email address.` };
  if (emails.includes(OWNER_EMAIL)) return { error: 'That is your own address.' };
  const duplicate = emails.find((email) => taken.includes(email));
  if (duplicate) return { error: `${duplicate} already has an invite.` };

  return { emails };
};

interface InviteFormProps {
  taken: readonly string[];
  onInvite: (emails: string[], role: Role) => void;
  inputRef: React.Ref<HTMLInputElement>;
}

const InviteForm = ({ taken, onInvite, inputRef }: InviteFormProps) => {
  const [value, setValue] = React.useState('');
  const [role, setRole] = React.useState<Role>('Member');
  const [error, setError] = React.useState<string | null>(null);
  const errorId = React.useId();
  const hintId = React.useId();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = parseEmails(value, taken);
    if (result.error !== undefined) {
      setError(result.error);

      return;
    }
    onInvite(result.emails, role);
    setValue('');
    setError(null);
  };

  return (
    <form noValidate onSubmit={submit} data-slot="empty-state-04-form" className="w-full text-start">
      <Field data-invalid={error ? true : undefined} className="gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            ref={inputRef}
            inputMode="email"
            value={value}
            autoComplete="off"
            spellCheck={false}
            placeholder="name@company.com"
            aria-label="Email addresses"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : hintId}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError(null);
            }}
            className="sm:flex-1"
          />
          <div className="flex gap-2">
            <Select value={role} onValueChange={(next) => setRole(next as Role)}>
              <SelectTrigger aria-label="Role" className="flex-1 sm:w-28 sm:flex-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {ROLES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">
              <UserPlus aria-hidden />
              Invite
            </Button>
          </div>
        </div>
        {error ? (
          <FieldError id={errorId}>{error}</FieldError>
        ) : (
          <FieldDescription id={hintId}>Separate several addresses with commas.</FieldDescription>
        )}
      </Field>
    </form>
  );
};

const EmptyState04 = () => {
  const [invites, setInvites] = React.useState<Invite[]>([]);
  const [announcement, setAnnouncement] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const refocus = React.useRef(false);

  const taken = invites.map((invite) => invite.email);
  const isEmpty = invites.length === 0;

  // The form moves between the empty state and the list, so focus follows it to the remounted input.
  React.useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    inputRef.current?.focus();
  }, [isEmpty]);

  const invite = (emails: string[], role: Role) => {
    if (isEmpty) refocus.current = true;
    setInvites((current) => [...emails.map((email) => ({ email, role })), ...current]);
    setAnnouncement(emails.length === 1 ? `Invite sent to ${emails[0]}.` : `${emails.length} invites sent.`);
  };

  const revoke = (email: string) => {
    setInvites((current) => current.filter((i) => i.email !== email));
    setAnnouncement(`Invite for ${email} revoked.`);
    if (invites.length === 1) refocus.current = true;
    else inputRef.current?.focus();
  };

  return (
    <section data-slot="empty-state-04" className="bg-background">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
        <div
          data-slot="empty-state-04-panel"
          className={cn(ENTER, 'overflow-hidden rounded-lg border border-border bg-card text-card-foreground')}
        >
          <header
            data-slot="empty-state-04-header"
            className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5"
          >
            <div className="flex min-w-0 flex-col">
              <h2 className="text-sm font-medium text-foreground">Members</h2>
              <p className="truncate text-xs text-muted-foreground">Harbor Analytics</p>
            </div>
            <p className="text-xs text-muted-foreground tabular-nums">
              1 member
              {invites.length > 0 ? `, ${invites.length} pending` : null}
            </p>
          </header>

          <p aria-live="polite" className="sr-only">
            {announcement}
          </p>

          {isEmpty ? (
            <Empty className={SWAP}>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Users />
                </EmptyMedia>
                <EmptyTitle>No team members yet</EmptyTitle>
                <EmptyDescription>
                  Only you can see Harbor Analytics. Invite teammates to share dashboards and reports. Invites expire
                  after 7 days.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="max-w-lg">
                <InviteForm taken={taken} onInvite={invite} inputRef={inputRef} />
              </EmptyContent>
            </Empty>
          ) : (
            <div className={SWAP}>
              <div data-slot="empty-state-04-invite" className="border-b border-border px-5 py-4">
                <InviteForm taken={taken} onInvite={invite} inputRef={inputRef} />
              </div>

              <div className="px-5 pt-4 pb-2">
                <span className="text-xs text-muted-foreground uppercase">
                  Pending invites <span className="text-foreground tabular-nums">({invites.length})</span>
                </span>
              </div>
              <ul data-slot="empty-state-04-pending" className="divide-y divide-border">
                {invites.map((item) => (
                  <li
                    key={item.email}
                    data-slot="empty-state-04-pending-item"
                    className={cn(SWAP, 'flex items-center gap-3 px-5 py-3')}
                  >
                    <Avatar size="sm">
                      <AvatarFallback>{initials(item.email)}</AvatarFallback>
                    </Avatar>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-foreground">{item.email}</span>
                      <span className="text-xs text-muted-foreground">{item.role}, invited just now</span>
                    </span>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      Pending
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Revoke invite for ${item.email}`}
                      onClick={() => revoke(item.email)}
                    >
                      Revoke
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EmptyState04;
