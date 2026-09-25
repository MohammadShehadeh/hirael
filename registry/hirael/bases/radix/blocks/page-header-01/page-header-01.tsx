'use client';

import * as React from 'react';
import { Archive, ArchiveRestore, Check, ChevronLeft, Copy, Link2, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/registry/hirael/bases/radix/ui/avatar';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/registry/hirael/bases/radix/ui/breadcrumb';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/radix/ui/dropdown-menu';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/registry/hirael/bases/radix/ui/empty';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';

type DetailHeaderProps = React.ComponentProps<'header'>;

const DetailHeader = ({ className, ...props }: DetailHeaderProps) => {
  return <header data-slot="detail-header" className={cn('flex flex-col gap-5', className)} {...props} />;
};

type DetailHeaderBackProps = React.ComponentProps<'a'>;

/** Parent link that stands in for the breadcrumb on small screens. */
const DetailHeaderBack = ({ className, children, ...props }: DetailHeaderBackProps) => {
  return (
    <a
      data-slot="detail-header-back"
      className={cn(
        'inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground',
        className,
      )}
      {...props}
    >
      <ChevronLeft aria-hidden className="size-4 rtl:rotate-180" />
      {children}
    </a>
  );
};

type DetailHeaderRowProps = React.ComponentProps<'div'>;

const DetailHeaderRow = ({ className, ...props }: DetailHeaderRowProps) => {
  return (
    <div
      data-slot="detail-header-row"
      className={cn('flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8', className)}
      {...props}
    />
  );
};

type DetailHeaderContentProps = React.ComponentProps<'div'>;

const DetailHeaderContent = ({ className, ...props }: DetailHeaderContentProps) => {
  return <div data-slot="detail-header-content" className={cn('flex min-w-0 flex-col gap-2', className)} {...props} />;
};

type DetailHeaderTitleProps = React.ComponentProps<'h1'>;

const DetailHeaderTitle = ({ className, ...props }: DetailHeaderTitleProps) => {
  return (
    <h1
      data-slot="detail-header-title"
      className={cn('text-2xl font-semibold tracking-tight text-balance sm:text-3xl', className)}
      {...props}
    />
  );
};

type DetailHeaderStatusTone = 'success' | 'warning' | 'muted';

const STATUS_DOT: Record<DetailHeaderStatusTone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  muted: 'bg-muted-foreground',
};

interface DetailHeaderStatusProps extends React.ComponentProps<typeof Badge> {
  /** Color of the status dot. */
  tone?: DetailHeaderStatusTone;
}

const DetailHeaderStatus = ({ tone = 'success', children, ...props }: DetailHeaderStatusProps) => {
  return (
    <Badge variant="outline" data-slot="detail-header-status" data-tone={tone} {...props}>
      <span aria-hidden className={cn('size-1.5 rounded-full', STATUS_DOT[tone])} />
      {children}
    </Badge>
  );
};

type DetailHeaderDescriptionProps = React.ComponentProps<'p'>;

const DetailHeaderDescription = ({ className, ...props }: DetailHeaderDescriptionProps) => {
  return (
    <p
      data-slot="detail-header-description"
      className={cn('max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base', className)}
      {...props}
    />
  );
};

type DetailHeaderMetaProps = React.ComponentProps<'dl'>;

const DetailHeaderMeta = ({ className, ...props }: DetailHeaderMetaProps) => {
  return (
    <dl
      data-slot="detail-header-meta"
      className={cn('flex flex-wrap items-center gap-x-6 gap-y-3 pt-1 text-sm', className)}
      {...props}
    />
  );
};

interface DetailHeaderMetaItemProps extends React.ComponentProps<'div'> {
  /** Uppercase label shown before the value. */
  label: string;
}

const DetailHeaderMetaItem = ({ label, className, children, ...props }: DetailHeaderMetaItemProps) => {
  return (
    <div data-slot="detail-header-meta-item" className={cn('flex items-center gap-2', className)} {...props}>
      <dt className="text-xs text-muted-foreground uppercase">{label}</dt>
      <dd className="flex items-center gap-2 text-foreground">{children}</dd>
    </div>
  );
};

type DetailHeaderActionsProps = React.ComponentProps<'div'>;

const DetailHeaderActions = ({ className, ...props }: DetailHeaderActionsProps) => {
  return (
    <div
      data-slot="detail-header-actions"
      className={cn('flex shrink-0 flex-wrap items-center gap-2', className)}
      {...props}
    />
  );
};

interface DetailHeaderShareProps extends Omit<React.ComponentProps<typeof Button>, 'onClick' | 'children'> {
  /** Link to copy. Defaults to the current page URL. */
  url?: string;
  /** How long the "Copied" label stays, in milliseconds. */
  resetAfter?: number;
}

const DetailHeaderShare = ({ url, resetAfter = 1500, variant = 'outline', ...props }: DetailHeaderShareProps) => {
  const [state, setState] = React.useState<'idle' | 'copied' | 'failed'>('idle');

  React.useEffect(() => {
    if (state === 'idle') return;
    const timer = window.setTimeout(() => setState('idle'), resetAfter);

    return () => window.clearTimeout(timer);
  }, [state, resetAfter]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url ?? window.location.href);
      setState('copied');
    } catch {
      // Clipboard access is blocked in some embeds and insecure origins.
      setState('failed');
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      data-slot="detail-header-share"
      data-state={state}
      onClick={copy}
      {...props}
    >
      {state === 'copied' ? (
        <Check
          key="copied"
          aria-hidden
          className="animate-in duration-150 ease-out zoom-in-50 fade-in motion-reduce:animate-none"
        />
      ) : (
        <Link2 key="share" aria-hidden />
      )}
      <span aria-live="polite">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Share'}</span>
    </Button>
  );
};

interface DetailHeaderNoticeProps extends React.ComponentProps<'div'> {
  /** Button shown at the end of the notice, e.g. Restore or Undo. */
  action?: React.ReactNode;
}

const DetailHeaderNotice = ({ action, className, children, ...props }: DetailHeaderNoticeProps) => {
  return (
    <div
      role="status"
      data-slot="detail-header-notice"
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      {...props}
    >
      <p className="text-foreground">{children}</p>
      {action}
    </div>
  );
};

export {
  DetailHeader,
  DetailHeaderBack,
  DetailHeaderRow,
  DetailHeaderContent,
  DetailHeaderTitle,
  DetailHeaderStatus,
  DetailHeaderDescription,
  DetailHeaderMeta,
  DetailHeaderMetaItem,
  DetailHeaderActions,
  DetailHeaderShare,
  DetailHeaderNotice,
};

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

interface Person {
  name: string;
  initials: string;
  avatar?: string;
}

type MilestoneState = 'done' | 'active' | 'planned';

interface Milestone {
  title: string;
  due: string;
  state: MilestoneState;
  detail: string;
}

const OWNER: Person = { name: 'Mohammad Shehadeh', initials: 'MS' };

// Placeholder photos served from hirael.com. Swap them for your own assets.
const CONTRIBUTORS: readonly Person[] = [
  { name: 'Daniel Reyes', initials: 'DR', avatar: '/media/blocks/team-01/avatar-1.jpg' },
  { name: 'Priya Natarajan', initials: 'PN', avatar: '/media/blocks/team-01/avatar-2.jpg' },
  { name: 'Tomas Ferreira', initials: 'TF', avatar: '/media/blocks/team-01/avatar-3.jpg' },
  { name: 'Lena Vogel', initials: 'LV', avatar: '/media/blocks/team-01/avatar-4.jpg' },
  { name: 'Sam Whitaker', initials: 'SW' },
  { name: 'Aiko Tanaka', initials: 'AT' },
  { name: 'Omar Haddad', initials: 'OH' },
];

const VISIBLE_CONTRIBUTORS = 4;

const MILESTONES: readonly Milestone[] = [
  { title: 'Flows and designs signed off', due: '2026-08-29', state: 'done', detail: '14 screens, 3 reviews' },
  { title: 'Single page payment sheet', due: '2026-09-26', state: 'active', detail: '9 of 12 tasks done' },
  { title: 'Saved cards and Apple Pay', due: '2026-10-10', state: 'active', detail: '3 of 10 tasks done' },
  { title: 'Roll out to 10 percent of traffic', due: '2026-10-24', state: 'planned', detail: 'Not started' },
];

const MILESTONE_LABEL: Record<MilestoneState, string> = {
  done: 'Done',
  active: 'In progress',
  planned: 'Planned',
};

const CREATED = '2026-08-12';

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(date),
  );

type Notice = { kind: 'duplicated'; name: string } | null;

const PageHeader01 = () => {
  const [name, setName] = React.useState('Checkout redesign');
  const [description, setDescription] = React.useState(
    'Move checkout to a single page with saved cards, Apple Pay, and address lookup.',
  );
  const [archived, setArchived] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);
  const [notice, setNotice] = React.useState<Notice>(null);
  const [draft, setDraft] = React.useState<{ name: string; description: string } | null>(null);
  const [copies, setCopies] = React.useState(0);
  const formId = React.useId();

  React.useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4000);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const editing = draft !== null;
  const draftInvalid = editing && draft.name.trim() === '';

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft || draftInvalid) return;
    setName(draft.name.trim());
    setDescription(draft.description.trim());
    setDraft(null);
  };

  const duplicate = () => {
    const next = copies + 1;
    setCopies(next);
    setNotice({ kind: 'duplicated', name: next === 1 ? `${name} (copy)` : `${name} (copy ${next})` });
  };

  if (deleted) {
    return (
      <section data-slot="page-header-01" className="bg-background py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
          <div className={cn(SWAP, 'rounded-lg border border-dashed border-border')}>
            <Empty data-slot="page-header-01-deleted">
              <EmptyHeader>
                <EmptyTitle>{name} was deleted</EmptyTitle>
                <EmptyDescription>
                  The project and its {MILESTONES.length} milestones are in the trash for 30 days.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button type="button" variant="outline" size="sm" onClick={() => setDeleted(false)}>
                  Undo
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        </div>
      </section>
    );
  }

  const hiddenContributors = CONTRIBUTORS.length - VISIBLE_CONTRIBUTORS;

  return (
    <section data-slot="page-header-01" className="bg-background py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 md:px-10">
        <DetailHeader>
          <div className={cn(ENTER, 'flex flex-col')}>
            <DetailHeaderBack href="#" className="sm:hidden">
              Web platform
            </DetailHeaderBack>
            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Hirael</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center" aria-label="Show full path">
                      <BreadcrumbEllipsis className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem asChild>
                        <a href="#">Projects</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href="#">Web platform</a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
                <BreadcrumbItem className="hidden md:inline-flex">
                  <BreadcrumbLink href="#">Projects</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:inline-flex">
                  <BreadcrumbLink href="#">Web platform</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {editing ? (
            <form onSubmit={save} className={cn(SWAP, 'flex flex-col gap-5')} aria-label="Edit project details">
              <FieldGroup className="max-w-2xl gap-4">
                <Field data-invalid={draftInvalid || undefined}>
                  <FieldLabel htmlFor={`${formId}-name`}>Project name</FieldLabel>
                  <Input
                    id={`${formId}-name`}
                    name="name"
                    aria-invalid={draftInvalid || undefined}
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                    autoFocus
                  />
                  {draftInvalid ? <FieldError>Give the project a name.</FieldError> : null}
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${formId}-description`}>Description</FieldLabel>
                  <Input
                    id={`${formId}-description`}
                    name="description"
                    value={draft.description}
                    onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  />
                </Field>
              </FieldGroup>
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={draftInvalid}>
                  Save
                </Button>
                <Button type="button" variant="ghost" onClick={() => setDraft(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <DetailHeaderRow>
              <DetailHeaderContent>
                <div style={stagger(1, 80)} className={cn(ENTER, 'flex flex-wrap items-center gap-x-3 gap-y-2')}>
                  <DetailHeaderTitle>{name}</DetailHeaderTitle>
                  <DetailHeaderStatus key={archived ? 'archived' : 'active'} tone={archived ? 'muted' : 'success'}>
                    {archived ? 'Archived' : 'Active'}
                  </DetailHeaderStatus>
                </div>
                <DetailHeaderDescription style={stagger(2, 80)} className={ENTER}>
                  {description}
                </DetailHeaderDescription>
                <DetailHeaderMeta style={stagger(3, 80)} className={ENTER}>
                  <DetailHeaderMetaItem label="Owner">
                    <Avatar size="sm">
                      <AvatarFallback>{OWNER.initials}</AvatarFallback>
                    </Avatar>
                    {OWNER.name}
                  </DetailHeaderMetaItem>
                  <DetailHeaderMetaItem label="Created">
                    <time dateTime={CREATED} className="tabular-nums">
                      {formatDate(CREATED)}
                    </time>
                  </DetailHeaderMetaItem>
                  <DetailHeaderMetaItem label="Contributors">
                    <AvatarGroup aria-label={`${CONTRIBUTORS.length} contributors`}>
                      {CONTRIBUTORS.slice(0, VISIBLE_CONTRIBUTORS).map((person) => (
                        <Avatar key={person.name} size="sm" title={person.name}>
                          {person.avatar ? <AvatarImage src={person.avatar} alt={person.name} /> : null}
                          <AvatarFallback>{person.initials}</AvatarFallback>
                        </Avatar>
                      ))}
                      {hiddenContributors > 0 ? (
                        <AvatarGroupCount
                          title={CONTRIBUTORS.slice(VISIBLE_CONTRIBUTORS)
                            .map((person) => person.name)
                            .join(', ')}
                        >
                          <span className="text-xs tabular-nums">+{hiddenContributors}</span>
                        </AvatarGroupCount>
                      ) : null}
                    </AvatarGroup>
                  </DetailHeaderMetaItem>
                </DetailHeaderMeta>
              </DetailHeaderContent>

              <DetailHeaderActions style={stagger(2, 80)} className={ENTER}>
                <DetailHeaderShare />
                <Button
                  type="button"
                  disabled={archived}
                  onClick={() => setDraft({ name, description })}
                  data-slot="detail-header-edit"
                >
                  <Pencil aria-hidden />
                  Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" size="icon" aria-label="More actions">
                      <MoreHorizontal aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onSelect={duplicate}>
                      <Copy aria-hidden />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setArchived(!archived)}>
                      {archived ? <ArchiveRestore aria-hidden /> : <Archive aria-hidden />}
                      {archived ? 'Restore' : 'Archive'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onSelect={() => setDeleted(true)}>
                      <Trash2 aria-hidden />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DetailHeaderActions>
            </DetailHeaderRow>
          )}

          {archived ? (
            <DetailHeaderNotice
              className={SWAP}
              action={
                <Button type="button" variant="outline" size="sm" onClick={() => setArchived(false)}>
                  <ArchiveRestore aria-hidden />
                  Restore
                </Button>
              }
            >
              This project is archived. It is read-only and hidden from search.
            </DetailHeaderNotice>
          ) : null}

          {notice ? (
            <DetailHeaderNotice
              key={notice.name}
              className={SWAP}
              action={
                <Button type="button" variant="ghost" size="sm" onClick={() => setNotice(null)}>
                  Dismiss
                </Button>
              }
            >
              Created {notice.name} with the same milestones and contributors.
            </DetailHeaderNotice>
          ) : null}
        </DetailHeader>

        <div
          data-slot="page-header-01-body"
          style={stagger(4, 80)}
          className={cn(ENTER, 'flex flex-col transition-opacity duration-200', archived && 'opacity-60')}
        >
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <h2 className="text-sm font-medium">Milestones</h2>
            <span className="text-xs text-muted-foreground tabular-nums">
              {MILESTONES.filter((milestone) => milestone.state === 'done').length} of {MILESTONES.length} done
            </span>
          </div>
          <ol className="flex flex-col divide-y divide-border">
            {MILESTONES.map((milestone) => (
              <li
                key={milestone.title}
                data-slot="page-header-01-milestone"
                data-state={milestone.state}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium">{milestone.title}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{milestone.detail}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground sm:gap-4">
                  <span className={cn(milestone.state === 'active' && 'text-foreground')}>
                    {MILESTONE_LABEL[milestone.state]}
                  </span>
                  <time dateTime={milestone.due} className="tabular-nums sm:w-24 sm:text-end">
                    {formatDate(milestone.due)}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default PageHeader01;
