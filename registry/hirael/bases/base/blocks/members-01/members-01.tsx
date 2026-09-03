'use client';

import * as React from 'react';
import { Check, MailPlus, MoreHorizontal, Search, UserPlus, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/base/ui/avatar';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/hirael/bases/base/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/base/ui/dropdown-menu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/base/ui/input-group';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/base/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/hirael/bases/base/ui/table';
import {
  TagInput,
  TagInputContainer,
  TagInputError,
  TagInputField,
  TagInputTags,
} from '@/registry/hirael/bases/base/components/tag-input';

type MemberRole = 'Owner' | 'Admin' | 'Member' | 'Viewer';
type MemberStatus = 'Active' | 'Pending' | 'Suspended';

interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  /** Display string; the block does not format dates. */
  joined: string;
}

interface PendingInvite {
  id: string;
  email: string;
  role: MemberRole;
  invited: string;
}

const ROLES: readonly MemberRole[] = ['Owner', 'Admin', 'Member', 'Viewer'];

const ROLE_HINT: Record<MemberRole, string> = {
  Owner: 'Full access, including billing and deleting the workspace.',
  Admin: 'Manage members and settings. No billing.',
  Member: 'Create and edit anything. No member management.',
  Viewer: 'Read-only.',
};

const STATUS_TONE: Record<MemberStatus, { dot: string; text: string }> = {
  Active: { dot: 'bg-success', text: 'text-success' },
  Pending: {
    dot: 'border border-warning bg-transparent',
    text: 'text-muted-foreground',
  },
  Suspended: { dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialsOf = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
};

type MembersProps = React.ComponentProps<'div'>;

const Members = ({ className, ...props }: MembersProps) => {
  return <div data-slot="members" className={cn('flex w-full flex-col gap-4', className)} {...props} />;
};

interface MembersHeaderProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: React.ReactNode;
  count?: number;
  description?: React.ReactNode;
  /** Search input, invite button, and anything else on the end side. */
  children?: React.ReactNode;
}

const MembersHeader = ({ title, count, description, className, children, ...props }: MembersHeaderProps) => {
  return (
    <div
      data-slot="members-header"
      className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}
      {...props}
    >
      <div className="flex flex-col gap-0.5">
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-[-0.01em] text-foreground">
          {title}
          {typeof count === 'number' ? (
            <Badge variant="secondary" className="font-mono tabular-nums">
              {count}
            </Badge>
          ) : null}
        </h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  );
};

interface MembersRoleSelectProps {
  value: MemberRole;
  onValueChange?: (role: MemberRole) => void;
  disabled?: boolean;
  /** Roles a user may pick. Defaults to everything but Owner. */
  roles?: readonly MemberRole[];
  size?: 'sm' | 'default';
  className?: string;
  id?: string;
  'aria-label'?: string;
}

const MembersRoleSelect = ({
  value,
  onValueChange,
  disabled,
  roles = ROLES.filter((r) => r !== 'Owner'),
  size = 'sm',
  className,
  id,
  'aria-label': ariaLabel,
}: MembersRoleSelectProps) => {
  const options = roles.includes(value) ? roles : [value, ...roles];
  return (
    <Select value={value} onValueChange={(next) => onValueChange?.(next as MemberRole)} disabled={disabled}>
      <SelectTrigger
        id={id}
        size={size}
        aria-label={ariaLabel}
        data-slot="members-role-select"
        className={cn('w-32', className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((role) => (
          <SelectItem key={role} value={role}>
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface MembersStatusProps extends React.ComponentProps<'span'> {
  status: MemberStatus;
}

const MembersStatus = ({ status, className, ...props }: MembersStatusProps) => {
  const tone = STATUS_TONE[status];
  return (
    <span
      data-slot="members-status"
      data-status={status.toLowerCase()}
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em]',
        tone.text,
        className,
      )}
      {...props}
    >
      <span aria-hidden className={cn('size-1.5 rounded-full', tone.dot)} />
      {status}
    </span>
  );
};

type MembersTableProps = React.ComponentProps<'div'>;

const MembersTable = ({ className, children, ...props }: MembersTableProps) => {
  return (
    <div
      data-slot="members-table"
      className={cn('overflow-hidden rounded-lg border border-border bg-card text-card-foreground', className)}
      {...props}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-auto px-4 py-2 font-mono text-[10px] font-normal uppercase tracking-[0.1em] text-muted-foreground">
              Member
            </TableHead>
            <TableHead className="h-auto px-4 py-2 font-mono text-[10px] font-normal uppercase tracking-[0.1em] text-muted-foreground">
              Role
            </TableHead>
            <TableHead className="hidden h-auto px-4 py-2 font-mono text-[10px] font-normal uppercase tracking-[0.1em] text-muted-foreground sm:table-cell">
              Status
            </TableHead>
            <TableHead className="hidden h-auto px-4 py-2 font-mono text-[10px] font-normal uppercase tracking-[0.1em] text-muted-foreground md:table-cell">
              Joined
            </TableHead>
            <TableHead className="h-auto px-4 py-2">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
};

interface MembersRowProps {
  member: Member;
  /** Marks the row as the signed-in user; they cannot remove themselves. */
  isYou?: boolean;
  onRoleChange?: (role: MemberRole) => void;
  onResend?: () => void;
  onRemove?: () => void;
  className?: string;
}

const MembersRow = ({ member, isYou = false, onRoleChange, onResend, onRemove, className }: MembersRowProps) => {
  const isOwner = member.role === 'Owner';
  const roleLocked = isOwner || isYou;

  return (
    <TableRow
      data-slot="members-row"
      data-status={member.status.toLowerCase()}
      className={cn('text-sm hover:bg-accent/30', className)}
    >
      <TableCell className="px-4 py-2.5">
        <span className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="font-mono text-[10px] font-medium text-foreground">
              {initialsOf(member.name)}
            </AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-col">
            <span className="flex items-center gap-1.5 truncate font-medium text-foreground">
              {member.name}
              {isYou ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">you</span>
              ) : null}
            </span>
            <span className="truncate text-xs text-muted-foreground">{member.email}</span>
          </span>
        </span>
      </TableCell>
      <TableCell className="px-4 py-2.5">
        {roleLocked ? (
          <Badge variant={isOwner ? 'secondary' : 'outline'} className="h-8 px-3 font-mono">
            {member.role}
          </Badge>
        ) : (
          <MembersRoleSelect value={member.role} onValueChange={onRoleChange} aria-label={`Role for ${member.name}`} />
        )}
      </TableCell>
      <TableCell className="hidden px-4 py-2.5 sm:table-cell">
        <MembersStatus status={member.status} />
      </TableCell>
      <TableCell className="hidden px-4 py-2.5 font-mono text-xs tabular-nums text-muted-foreground md:table-cell">
        {member.joined}
      </TableCell>
      <TableCell className="px-4 py-2.5 text-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" className="size-7" aria-label={`Actions for ${member.name}`} />}
          >
            <MoreHorizontal className="size-3.5" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={roleLocked}>Change role</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={member.role}
                  onValueChange={(next) => onRoleChange?.(next as MemberRole)}
                >
                  {ROLES.filter((r) => r !== 'Owner').map((role) => (
                    <DropdownMenuRadioItem key={role} value={role}>
                      {role}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem disabled={member.status !== 'Pending'} onClick={onResend}>
              Resend invite
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" disabled={roleLocked} onClick={onRemove}>
              Remove from team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

interface MembersInviteDialogProps {
  /** Receives the validated emails and the chosen role. */
  onInvite?: (emails: string[], role: MemberRole) => void;
  /** Already-taken addresses, rejected with a hint instead of a duplicate row. */
  existingEmails?: readonly string[];
  defaultRole?: MemberRole;
  /** Replaces the default "Invite" button; rendered as the dialog trigger. */
  trigger?: React.ReactElement;
}

const MembersInviteDialog = ({
  onInvite,
  existingEmails = [],
  defaultRole = 'Member',
  trigger,
}: MembersInviteDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [emails, setEmails] = React.useState<string[]>([]);
  const [role, setRole] = React.useState<MemberRole>(defaultRole);
  const roleId = React.useId();
  const emailsId = React.useId();

  const taken = React.useMemo(() => new Set(existingEmails.map((e) => e.toLowerCase())), [existingEmails]);

  const validate = React.useCallback(
    (candidate: string) => {
      if (!EMAIL_RE.test(candidate)) return 'That is not an email address.';
      if (taken.has(candidate.toLowerCase())) {
        return `${candidate} is already on the team.`;
      }
      return true as const;
    },
    [taken],
  );

  const reset = () => {
    setEmails([]);
    setRole(defaultRole);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emails.length === 0) return;
    onInvite?.(emails, role);
    setOpen(false);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={
          trigger ?? (
            <Button type="button" size="sm">
              <UserPlus className="size-3.5" aria-hidden />
              Invite
            </Button>
          )
        }
      />
      <DialogContent data-slot="members-invite-dialog" className="sm:max-w-md">
        <form onSubmit={submit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Invite people</DialogTitle>
            <DialogDescription>They get an email with a link that works for 7 days.</DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-5">
            <Field className="gap-2">
              <FieldLabel htmlFor={emailsId}>Email addresses</FieldLabel>
              <TagInput
                value={emails}
                onValueChange={setEmails}
                validate={validate}
                commitKeys={['Enter', ',', ' ']}
                splitOn={/[,\s]+/}
              >
                <TagInputContainer>
                  <TagInputTags />
                  <TagInputField id={emailsId} autoComplete="off" placeholder="name@company.com, another@company.com" />
                </TagInputContainer>
                <TagInputError />
              </TagInput>
              <FieldDescription className="text-xs">
                Press Enter, comma, or space after each address. Paste a list to add several at once.
              </FieldDescription>
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor={roleId}>Role</FieldLabel>
              <MembersRoleSelect id={roleId} value={role} onValueChange={setRole} size="default" className="w-full" />
              <FieldDescription className="text-xs">{ROLE_HINT[role]}</FieldDescription>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={emails.length === 0}>
              <MailPlus className="size-3.5" aria-hidden />
              {emails.length > 1 ? `Send ${emails.length} invites` : 'Send invite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface MembersPendingProps extends React.ComponentProps<'section'> {
  count?: number;
}

const MembersPending = ({ count, className, children, ...props }: MembersPendingProps) => {
  return (
    <section
      data-slot="members-pending"
      className={cn('overflow-hidden rounded-lg border border-border bg-card text-card-foreground', className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Pending invites
          {typeof count === 'number' ? <span className="ms-2 text-foreground">({count})</span> : null}
        </span>
      </div>
      <ul className="divide-y divide-border">{children}</ul>
    </section>
  );
};

interface MembersPendingItemProps extends Omit<React.ComponentProps<'li'>, 'children'> {
  invite: PendingInvite;
  onResend?: () => void;
  onRevoke?: () => void;
  /** Shows a "Sent" confirmation in place of the resend button. */
  resent?: boolean;
}

const MembersPendingItem = ({
  invite,
  onResend,
  onRevoke,
  resent = false,
  className,
  ...props
}: MembersPendingItemProps) => {
  return (
    <li
      data-slot="members-pending-item"
      className={cn('flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3', className)}
      {...props}
    >
      <Avatar>
        <AvatarFallback className="text-muted-foreground">
          <MailPlus className="size-3.5" aria-hidden />
        </AvatarFallback>
      </Avatar>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">{invite.email}</span>
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          {invite.role} · Invited {invite.invited}
        </span>
      </span>
      <MembersStatus status="Pending" className="hidden sm:inline-flex" />
      <span className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResend}
          disabled={resent}
          className={cn('min-w-20', resent && 'text-success disabled:opacity-100')}
        >
          {resent ? (
            <>
              <Check className="size-3.5" aria-hidden />
              Sent
            </>
          ) : (
            'Resend'
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRevoke}
          className="text-muted-foreground hover:text-destructive"
        >
          Revoke
        </Button>
      </span>
    </li>
  );
};

interface MembersEmptyProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

const MembersEmpty = ({
  title = 'No members yet',
  description = 'Invite a teammate to get started.',
  action,
  className,
  ...props
}: MembersEmptyProps) => {
  return (
    <div
      data-slot="members-empty"
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground"
      >
        <Users className="size-4" />
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
      {action}
    </div>
  );
};

export {
  Members,
  MembersHeader,
  MembersInviteDialog,
  MembersTable,
  MembersRow,
  MembersRoleSelect,
  MembersStatus,
  MembersPending,
  MembersPendingItem,
  MembersEmpty,
  type Member,
  type MemberRole,
  type MemberStatus,
  type PendingInvite,
};

const MEMBERS: readonly Member[] = [
  {
    id: 'm1',
    name: 'Mohammad Shehadeh',
    email: 'mohammad@plinth.dev',
    role: 'Owner',
    status: 'Active',
    joined: 'Jan 12, 2025',
  },
  {
    id: 'm2',
    name: 'Lena Fischer',
    email: 'lena@plinth.dev',
    role: 'Admin',
    status: 'Active',
    joined: 'Feb 3, 2025',
  },
  {
    id: 'm3',
    name: 'Omar Haddad',
    email: 'omar@plinth.dev',
    role: 'Member',
    status: 'Active',
    joined: 'Mar 19, 2025',
  },
  {
    id: 'm4',
    name: 'Priya Raman',
    email: 'priya@plinth.dev',
    role: 'Member',
    status: 'Active',
    joined: 'May 7, 2025',
  },
  {
    id: 'm5',
    name: 'Tomás Herrera',
    email: 'tomas@plinth.dev',
    role: 'Viewer',
    status: 'Active',
    joined: 'Jun 22, 2025',
  },
  {
    id: 'm6',
    name: 'Sara Nakamura',
    email: 'sara@plinth.dev',
    role: 'Member',
    status: 'Suspended',
    joined: 'Aug 1, 2025',
  },
];

const PENDING: readonly PendingInvite[] = [
  {
    id: 'p1',
    email: 'nadia@plinth.dev',
    role: 'Member',
    invited: '2 days ago',
  },
  { id: 'p2', email: 'jules@acme.co', role: 'Viewer', invited: '6 days ago' },
];

const CURRENT_USER_ID = 'm1';

const Members01 = () => {
  const [members, setMembers] = React.useState<readonly Member[]>(MEMBERS);
  const [pending, setPending] = React.useState<readonly PendingInvite[]>(PENDING);
  const [query, setQuery] = React.useState('');
  const [resent, setResent] = React.useState<ReadonlySet<string>>(new Set());
  const searchRef = React.useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const visible = q
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.role.toLowerCase().includes(q),
      )
    : members;

  const existingEmails = [...members.map((m) => m.email), ...pending.map((p) => p.email)];

  const setRole = (id: string, role: MemberRole) =>
    setMembers((list) => list.map((m) => (m.id === id ? { ...m, role } : m)));

  const remove = (id: string) => setMembers((list) => list.filter((m) => m.id !== id));

  const resend = (id: string) =>
    setResent((set) => {
      const next = new Set(set);
      next.add(id);
      return next;
    });

  const revoke = (id: string) => setPending((list) => list.filter((p) => p.id !== id));

  const invite = (emails: string[], role: MemberRole) =>
    setPending((list) => [
      ...emails.map((email, i) => ({
        id: `p-${Date.now()}-${i}`,
        email,
        role,
        invited: 'just now',
      })),
      ...list,
    ]);

  return (
    <section data-slot="members-01-block" className="min-h-svh w-full bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <Members>
          <MembersHeader
            title="Members"
            count={members.length}
            description="Everyone with access to the Plinth Labs workspace."
          >
            <InputGroup className="h-8 w-full sm:w-56">
              <InputGroupAddon align="inline-start">
                <Search className="size-3.5" aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                ref={searchRef}
                type="search"
                placeholder="Search members…"
                aria-label="Search members"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Escape' || !query) return;
                  e.preventDefault();
                  setQuery('');
                }}
              />
            </InputGroup>
            <MembersInviteDialog onInvite={invite} existingEmails={existingEmails} />
          </MembersHeader>

          {visible.length === 0 ? (
            <MembersEmpty
              title="No matching members"
              description={
                <>
                  Nothing matched <span className="font-mono text-foreground">&ldquo;{query.trim()}&rdquo;</span>. Try a
                  name, an email, or a role.
                </>
              }
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery('');
                    searchRef.current?.focus();
                  }}
                >
                  Clear search
                </Button>
              }
            />
          ) : (
            <MembersTable>
              {visible.map((m) => (
                <MembersRow
                  key={m.id}
                  member={m}
                  isYou={m.id === CURRENT_USER_ID}
                  onRoleChange={(role) => setRole(m.id, role)}
                  onRemove={() => remove(m.id)}
                />
              ))}
            </MembersTable>
          )}

          {pending.length > 0 ? (
            <MembersPending count={pending.length}>
              {pending.map((p) => (
                <MembersPendingItem
                  key={p.id}
                  invite={p}
                  resent={resent.has(p.id)}
                  onResend={() => resend(p.id)}
                  onRevoke={() => revoke(p.id)}
                />
              ))}
            </MembersPending>
          ) : null}
        </Members>
      </div>
    </section>
  );
};

export default Members01;
