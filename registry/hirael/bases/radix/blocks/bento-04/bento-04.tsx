'use client';

import * as React from 'react';
import { Check, Loader2, Pause, Play, RefreshCw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/registry/hirael/bases/radix/components/animated-number';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Checkbox } from '@/registry/hirael/bases/radix/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/registry/hirael/bases/radix/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/radix/ui/select';
import { Switch } from '@/registry/hirael/bases/radix/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/hirael/bases/radix/ui/table';
import { Textarea } from '@/registry/hirael/bases/radix/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/radix/ui/toggle-group';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-1 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;
const ARRIVE = `animate-in fade-in slide-in-from-top-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

// Timers started from handlers must not fire after unmount.
const useTimeouts = () => {
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => {
    const pending = timers.current;

    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  return React.useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
};

interface BentoTileProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  title: React.ReactNode;
  description: React.ReactNode;
  /** Rendered at the end of the header row, e.g. a toggle or a counter. */
  action?: React.ReactNode;
}

const BentoTile = ({ title, description, action, className, children, ...props }: BentoTileProps) => {
  return (
    <article
      data-slot="bento-tile"
      className={cn(
        'flex min-w-0 flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground',
        className,
      )}
      {...props}
    >
      <div data-slot="bento-tile-header" className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      <div data-slot="bento-tile-body" className="flex flex-1 flex-col">
        {children}
      </div>
    </article>
  );
};

type TileProps = Omit<BentoTileProps, 'title' | 'description' | 'action' | 'children'>;

type EventKind = 'info' | 'sensitive' | 'blocked';

interface AuditSource {
  actor: string;
  action: string;
  target: string;
  place: string;
  kind: EventKind;
}

interface AuditEvent extends AuditSource {
  seq: number;
  /** Seconds since midnight UTC. */
  at: number;
}

const AUDIT_SOURCES: readonly AuditSource[] = [
  { actor: 'Dana Reyes', action: 'rotated API key', target: 'prod-billing', place: 'Lisbon', kind: 'info' },
  { actor: 'Okta SCIM', action: 'removed', target: 'k.walsh@hirael.com', place: 'Directory sync', kind: 'info' },
  {
    actor: 'Unknown',
    action: 'failed to sign in as',
    target: 'admin@hirael.com',
    place: 'Lagos, 5 tries',
    kind: 'blocked',
  },
  { actor: 'Marcus Lee', action: 'exported', target: 'customers.csv, 2,314 rows', place: 'Toronto', kind: 'sensitive' },
  {
    actor: 'Priya Nair',
    action: 'approved access to',
    target: 'Production database',
    place: 'Bengaluru',
    kind: 'info',
  },
  {
    actor: 'CI deploy bot',
    action: 'read secret',
    target: 'STRIPE_SECRET_KEY',
    place: 'GitHub Actions',
    kind: 'sensitive',
  },
  { actor: 'Tom Becker', action: 'signed in with', target: 'a passkey', place: 'Berlin', kind: 'info' },
  { actor: 'Dana Reyes', action: 'turned on', target: 'SSO enforcement', place: 'Lisbon', kind: 'info' },
  { actor: 'Marcus Lee', action: 'created API key', target: 'analytics-readonly', place: 'Toronto', kind: 'info' },
  {
    actor: 'Priya Nair',
    action: 'made',
    target: 'Tom Becker an admin',
    place: 'Bengaluru',
    kind: 'sensitive',
  },
];

const START_CLOCK = 14 * 3600 + 2 * 60 + 10;
const MAX_EVENTS = 9;

const makeEvent = (seq: number, at: number): AuditEvent => ({
  ...AUDIT_SOURCES[seq % AUDIT_SOURCES.length],
  seq,
  at,
});

const formatClock = (seconds: number) =>
  [Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');

interface Trail {
  events: AuditEvent[];
  queued: AuditEvent[];
  seq: number;
  clock: number;
  today: number;
}

const INITIAL_TRAIL: Trail = {
  events: [7, 6, 5, 4, 3, 2, 1, 0].map((seq) => makeEvent(seq, START_CLOCK + seq * 7)),
  queued: [],
  seq: 8,
  clock: START_CLOCK + 49,
  today: 1284,
};

const arrive = (trail: Trail, paused: boolean): Trail => {
  // Irregular gaps read as real traffic; derived from seq so they are stable.
  const clock = trail.clock + 3 + ((trail.seq * 5) % 9);
  const event = makeEvent(trail.seq, clock);

  return {
    ...trail,
    seq: trail.seq + 1,
    clock,
    today: trail.today + 1,
    events: paused ? trail.events : [event, ...trail.events].slice(0, MAX_EVENTS),
    queued: paused ? [event, ...trail.queued] : trail.queued,
  };
};

const KIND_BADGE: Record<EventKind, { label: string; variant: 'outline' | 'destructive' } | null> = {
  info: null,
  sensitive: { label: 'Sensitive', variant: 'outline' },
  blocked: { label: 'Blocked', variant: 'destructive' },
};

const AuditTrail = (props: TileProps) => {
  const [trail, setTrail] = React.useState<Trail>(INITIAL_TRAIL);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    const id = window.setInterval(() => setTrail((current) => arrive(current, paused)), 2200);

    return () => window.clearInterval(id);
  }, [paused]);

  const togglePause = () => {
    if (paused) {
      setTrail((current) => ({
        ...current,
        events: [...current.queued, ...current.events].slice(0, MAX_EVENTS),
        queued: [],
      }));
    }
    setPaused(!paused);
  };

  return (
    <BentoTile
      data-slot="audit-trail"
      title="Every action, as it happens"
      description="Sign-ins, exports, key rotations and access grants land here within a second. Kept for 7 years."
      action={
        <Button variant="outline" size="sm" aria-pressed={paused} onClick={togglePause}>
          {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
          {paused ? 'Resume' : 'Pause'}
        </Button>
      }
      {...props}
    >
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="relative flex size-2">
              {paused ? null : (
                <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
              )}
              <span className={cn('relative size-2 rounded-full', paused ? 'bg-muted-foreground' : 'bg-success')} />
            </span>
            {paused ? (
              <span key="paused" className={SWAP}>
                Paused, {trail.queued.length} new {trail.queued.length === 1 ? 'event' : 'events'} waiting
              </span>
            ) : (
              <span key="live">Streaming live</span>
            )}
          </span>
          <span className="text-muted-foreground">
            <span className="text-foreground">
              <AnimatedNumber value={trail.today} startValue={INITIAL_TRAIL.today} duration={300} />
            </span>{' '}
            events today
          </span>
        </div>

        <ol
          aria-live="polite"
          aria-label="Audit events"
          className="flex flex-col divide-y divide-border border-y border-border"
        >
          {trail.events.map((event) => {
            const badge = KIND_BADGE[event.kind];

            return (
              <li
                key={event.seq}
                data-slot="audit-trail-event"
                data-kind={event.kind}
                className={cn(event.seq >= INITIAL_TRAIL.seq && ARRIVE, 'flex gap-4 py-3 text-sm')}
              >
                <span className="w-16 shrink-0 pt-px text-xs text-muted-foreground tabular-nums">
                  {formatClock(event.at)}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="min-w-0">
                    <span className="font-medium">{event.actor}</span> {event.action}{' '}
                    <span className="font-medium break-words">{event.target}</span>
                  </p>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    {event.place}
                    {badge ? <Badge variant={badge.variant}>{badge.label}</Badge> : null}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </BentoTile>
  );
};

type Method = 'passkey' | 'app' | 'sms';

const MEMBERS = 50;
const METHODS: readonly { id: Method; label: string; swatch: string }[] = [
  { id: 'passkey', label: 'Passkey', swatch: 'bg-chart-1' },
  { id: 'app', label: 'Authenticator app', swatch: 'bg-chart-2' },
  { id: 'sms', label: 'SMS', swatch: 'bg-chart-3' },
];

const NOT_ENROLLED = [
  'Chris Moreau',
  'Ines Duarte',
  'Yuki Tanaka',
  'Omar Haddad',
  'Lena Vogel',
  'Sam Whitaker',
  'Ravi Iyer',
  'Nora Quinn',
];

const AFTER_REMINDER: readonly { name: string; method: Method; delay: number }[] = [
  { name: 'Chris Moreau', method: 'passkey', delay: 1200 },
  { name: 'Ines Duarte', method: 'app', delay: 2600 },
  { name: 'Yuki Tanaka', method: 'passkey', delay: 4200 },
];

const TwoFactorMeter = (props: TileProps) => {
  const [counts, setCounts] = React.useState<Record<Method, number>>({ passkey: 21, app: 17, sms: 4 });
  const [pending, setPending] = React.useState<readonly string[]>(NOT_ENROLLED);
  const [reminded, setReminded] = React.useState(false);
  const [required, setRequired] = React.useState(false);
  const later = useTimeouts();

  const enrolled = counts.passkey + counts.app + counts.sms;
  const cells = METHODS.flatMap((method) => Array.from({ length: counts[method.id] }, () => method.swatch));

  const remind = () => {
    setReminded(true);
    AFTER_REMINDER.forEach(({ name, method, delay }) =>
      later(() => {
        setPending((list) => list.filter((person) => person !== name));
        setCounts((current) => ({ ...current, [method]: current[method] + 1 }));
      }, delay),
    );
  };

  return (
    <BentoTile
      data-slot="two-factor"
      title="Two-factor adoption"
      description="Who is covered, and how. Remind the rest in one click."
      {...props}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-4xl font-medium tracking-tight">
            <AnimatedNumber value={(enrolled / MEMBERS) * 100} suffix="%" duration={500} />
          </span>
          <span className="text-sm text-muted-foreground tabular-nums">
            {enrolled} of {MEMBERS} members
          </span>
        </div>

        <div
          role="img"
          aria-label={`${enrolled} of ${MEMBERS} members use two-factor authentication`}
          className="grid h-7 grid-cols-[repeat(25,minmax(0,1fr))] gap-0.5 sm:h-8 sm:grid-cols-[repeat(50,minmax(0,1fr))]"
        >
          {Array.from({ length: MEMBERS }, (_, index) => (
            <span
              key={index}
              className={cn('rounded-[2px] transition-colors duration-300', cells[index] ?? 'bg-muted')}
            />
          ))}
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {METHODS.map((method) => (
            <li key={method.id} className="flex items-center gap-1.5">
              <span aria-hidden className={cn('size-2 rounded-[2px]', method.swatch)} />
              {method.label}
              <span className="text-foreground tabular-nums">{counts[method.id]}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            {pending.length === 0 ? (
              'Everyone is enrolled.'
            ) : (
              <>
                Not enrolled: <span className="text-foreground">{pending.slice(0, 2).join(', ')}</span>
                {pending.length > 2 ? ` and ${pending.length - 2} more` : null}.
                {required ? ' They set it up at their next sign-in.' : null}
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label htmlFor="bento-04-require" className="flex cursor-pointer items-center gap-2 text-sm">
              <Switch id="bento-04-require" checked={required} onCheckedChange={(on) => setRequired(on === true)} />
              Require at next sign-in
            </label>
            <Button variant="outline" size="sm" onClick={remind} disabled={reminded || pending.length === 0}>
              {reminded ? <Check aria-hidden /> : null}
              {reminded ? 'Reminder sent' : `Remind ${pending.length}`}
            </Button>
          </div>
        </div>
      </div>
    </BentoTile>
  );
};

interface Certificate {
  domain: string;
  issuer: string;
  /** Seconds from mount until expiry; negative means already expired. */
  expiresIn: number;
}

const DAY = 86_400;

const CERTIFICATES: readonly Certificate[] = [
  { domain: 'hirael.com', issuer: "Let's Encrypt", expiresIn: 61 * DAY + 4 * 3600 + 12 * 60 },
  { domain: 'api.hirael.com', issuer: "Let's Encrypt", expiresIn: 5 * DAY + 3 * 3600 + 41 * 60 + 9 },
  { domain: 'sso.hirael.com', issuer: 'DigiCert', expiresIn: 23 * DAY + 17 * 3600 + 5 * 60 },
  { domain: 'status.hirael.com', issuer: "Let's Encrypt", expiresIn: -2 * DAY - 6 * 3600 },
];

const RENEW_TO = 90 * DAY;

const formatCountdown = (seconds: number) => {
  const days = Math.floor(seconds / DAY);
  const rest = seconds % DAY;
  const clock = [Math.floor(rest / 3600), Math.floor(rest / 60) % 60, rest % 60]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');

  return `${days}d ${clock}`;
};

const CertificateList = (props: TileProps) => {
  const [elapsed, setElapsed] = React.useState(0);
  const [expiry, setExpiry] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(CERTIFICATES.map((cert) => [cert.domain, cert.expiresIn])),
  );
  const [renewing, setRenewing] = React.useState<ReadonlySet<string>>(() => new Set());
  const later = useTimeouts();

  React.useEffect(() => {
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);

    return () => window.clearInterval(id);
  }, []);

  const renew = (domain: string) => {
    const startedAt = elapsed;
    setRenewing((current) => new Set(current).add(domain));
    later(() => {
      setExpiry((current) => ({ ...current, [domain]: startedAt + RENEW_TO }));
      setRenewing((current) => {
        const next = new Set(current);
        next.delete(domain);

        return next;
      });
    }, 1400);
  };

  const attention = CERTIFICATES.filter((cert) => expiry[cert.domain] - elapsed < 14 * DAY).length;

  return (
    <BentoTile
      data-slot="certificates"
      title="Certificates"
      description="Expiry for every domain, counted down to the second."
      action={
        <span className={cn('text-sm tabular-nums', attention ? 'text-warning' : 'text-success')}>
          {attention ? `${attention} need attention` : 'All valid'}
        </span>
      }
      {...props}
    >
      <ul className="flex flex-col divide-y divide-border">
        {CERTIFICATES.map((cert) => {
          const left = expiry[cert.domain] - elapsed;
          const busy = renewing.has(cert.domain);
          const status = left <= 0 ? 'expired' : left < 14 * DAY ? 'soon' : 'valid';

          return (
            <li
              key={cert.domain}
              data-slot="certificate"
              data-status={status}
              className="flex items-center gap-3 py-3 text-sm first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate font-medium">{cert.domain}</span>
                <span className="text-xs text-muted-foreground">{cert.issuer}</span>
              </div>
              <span
                className={cn(
                  'text-end text-xs tabular-nums',
                  status === 'expired'
                    ? 'text-destructive'
                    : status === 'soon'
                      ? 'text-warning'
                      : 'text-muted-foreground',
                )}
              >
                {status === 'expired' ? `Expired ${Math.max(1, Math.floor(-left / DAY))}d ago` : formatCountdown(left)}
              </span>
              {left < 30 * DAY ? (
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={`Renew ${cert.domain}`}
                  disabled={busy}
                  onClick={() => renew(cert.domain)}
                >
                  {busy ? <Loader2 aria-hidden className="animate-spin" /> : <RefreshCw aria-hidden />}
                </Button>
              ) : (
                <span className="flex size-8 shrink-0 items-center justify-center text-success">
                  <Check aria-hidden className="size-4" />
                  <span className="sr-only">Valid</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </BentoTile>
  );
};

const ROLES = ['Owner', 'Admin', 'Engineer', 'Support', 'Auditor'] as const;
const PERMISSIONS = [
  { id: 'audit', label: 'Audit log' },
  { id: 'members', label: 'Members' },
  { id: 'prod', label: 'Prod data' },
  { id: 'export', label: 'Export' },
  { id: 'keys', label: 'API keys' },
] as const;

type Role = (typeof ROLES)[number];
type Permission = (typeof PERMISSIONS)[number]['id'];
type Policy = Record<Role, Record<Permission, boolean>>;

const row = (audit: boolean, members: boolean, prod: boolean, exp: boolean, keys: boolean) => ({
  audit,
  members,
  prod,
  export: exp,
  keys,
});

const INITIAL_POLICY: Policy = {
  Owner: row(true, true, true, true, true),
  Admin: row(true, true, true, false, true),
  Engineer: row(false, false, true, false, true),
  Support: row(false, false, true, true, false),
  Auditor: row(true, false, false, false, false),
};

const diffCount = (a: Policy, b: Policy) =>
  ROLES.reduce(
    (total, role) =>
      total + PERMISSIONS.filter((permission) => a[role][permission.id] !== b[role][permission.id]).length,
    0,
  );

const AccessMatrix = (props: TileProps) => {
  const [saved, setSaved] = React.useState<Policy>(INITIAL_POLICY);
  const [draft, setDraft] = React.useState<Policy>(INITIAL_POLICY);
  const [justSaved, setJustSaved] = React.useState(false);
  const changes = diffCount(saved, draft);
  const risky = ROLES.filter((role) => role !== 'Owner' && draft[role].prod && draft[role].export);

  const set = (role: Role, permission: Permission, value: boolean) => {
    setJustSaved(false);
    setDraft((current) => ({ ...current, [role]: { ...current[role], [permission]: value } }));
  };

  return (
    <BentoTile
      data-slot="access-policy"
      title="Access policy"
      description="Who can do what, by role. Changes apply on save and are written to the audit trail."
      {...props}
    >
      <div className="flex flex-1 flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Role</TableHead>
              {PERMISSIONS.map((permission) => (
                <TableHead key={permission.id} scope="col" className="text-center">
                  {permission.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROLES.map((role) => (
              <TableRow key={role}>
                <TableHead scope="row">{role}</TableHead>
                {PERMISSIONS.map((permission) => {
                  const value = draft[role][permission.id];
                  const changed = value !== saved[role][permission.id];

                  return (
                    <TableCell key={permission.id} className="text-center">
                      <span
                        className={cn(
                          'inline-flex size-8 items-center justify-center rounded-md transition-colors duration-150',
                          changed && 'bg-primary/10',
                        )}
                      >
                        <Checkbox
                          checked={value}
                          disabled={role === 'Owner'}
                          aria-label={`${role}: ${permission.label}`}
                          onCheckedChange={(checked) => set(role, permission.id, checked === true)}
                        />
                      </span>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p aria-live="polite" className="min-h-5 text-sm">
          {risky.length ? (
            <span key={risky.join()} className={cn(SWAP, 'block text-warning')}>
              {risky.join(' and ')} can read and export production data.
            </span>
          ) : (
            <span className="text-muted-foreground">
              No role outside Owner can both read and export production data.
            </span>
          )}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <span aria-live="polite" className="text-sm text-muted-foreground tabular-nums">
            {changes
              ? `${changes} unsaved ${changes === 1 ? 'change' : 'changes'}`
              : justSaved
                ? 'Saved'
                : 'Up to date'}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled={!changes} onClick={() => setDraft(saved)}>
              Discard
            </Button>
            <Button
              size="sm"
              disabled={!changes}
              onClick={() => {
                setSaved(draft);
                setJustSaved(true);
              }}
            >
              Save policy
            </Button>
          </div>
        </div>
      </div>
    </BentoTile>
  );
};

const RESOURCES = [
  { value: 'prod-db', label: 'Production database' },
  { value: 'billing', label: 'Billing dashboard' },
  { value: 'exports', label: 'Customer data exports' },
  { value: 'aws-prod', label: 'AWS production account' },
] as const;

const DURATIONS = ['1h', '4h', '8h'] as const;
type Duration = (typeof DURATIONS)[number];

const TICKET_PATTERN = /\b[A-Z]{2,6}-\d{2,6}\b/;

interface RequestForm {
  resource: string;
  duration: Duration;
  reason: string;
}

type RequestErrors = Partial<Record<'resource' | 'reason', string>>;

const validate = (form: RequestForm): RequestErrors => {
  const errors: RequestErrors = {};
  if (!form.resource) errors.resource = 'Choose what you need access to.';
  if (form.reason.trim().length < 20) errors.reason = 'Add a reason of at least 20 characters.';
  else if (!TICKET_PATTERN.test(form.reason)) errors.reason = 'Include a ticket ID, like SEC-1234.';

  return errors;
};

const EMPTY_REQUEST: RequestForm = { resource: '', duration: '4h', reason: '' };

const RequestAccess = (props: TileProps) => {
  const [form, setForm] = React.useState<RequestForm>(EMPTY_REQUEST);
  const [errors, setErrors] = React.useState<RequestErrors>({});
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent'>('idle');
  const later = useTimeouts();

  const update = <K extends keyof RequestForm>(key: K, value: RequestForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in errors) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length) return;
    setStatus('sending');
    later(() => setStatus('sent'), 800);
  };

  const resourceLabel = RESOURCES.find((resource) => resource.value === form.resource)?.label;
  const ticket = form.reason.match(TICKET_PATTERN)?.[0];

  return (
    <BentoTile
      data-slot="request-access"
      title="Just-in-time access"
      description="Ask for what you need, for as long as you need it. Access ends on its own."
      {...props}
    >
      {status === 'sent' ? (
        <div key="sent" className={cn(SWAP, 'flex flex-1 flex-col items-start gap-4')}>
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-2 font-medium">
              <Check aria-hidden className="size-4 text-success" />
              Request sent to Priya Nair
            </p>
            <p className="text-sm text-muted-foreground">
              She is on call for Security. Once approved, you get {form.duration} of access to {resourceLabel}, linked
              to {ticket}.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setForm(EMPTY_REQUEST);
              setStatus('idle');
            }}
          >
            New request
          </Button>
        </div>
      ) : (
        <form noValidate onSubmit={submit} className="flex flex-1 flex-col">
          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(errors.resource)}>
              <FieldLabel htmlFor="bento-04-resource">Resource</FieldLabel>
              <Select
                name="resource"
                value={form.resource}
                onValueChange={(value) => update('resource', value)}
                disabled={status === 'sending'}
              >
                <SelectTrigger
                  id="bento-04-resource"
                  aria-invalid={Boolean(errors.resource) || undefined}
                  className="w-full"
                >
                  <SelectValue placeholder="Choose a resource" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {RESOURCES.map((resource) => (
                    <SelectItem key={resource.value} value={resource.value}>
                      {resource.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.resource}</FieldError>
            </Field>
            <Field>
              <FieldTitle id="bento-04-duration">Duration</FieldTitle>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={form.duration}
                onValueChange={(next) => {
                  if (next) update('duration', next as Duration);
                }}
                disabled={status === 'sending'}
                aria-labelledby="bento-04-duration"
              >
                {DURATIONS.map((duration) => (
                  <ToggleGroupItem key={duration} value={duration}>
                    {duration}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>
            <Field data-invalid={Boolean(errors.reason)}>
              <FieldLabel htmlFor="bento-04-reason">Reason</FieldLabel>
              <Textarea
                id="bento-04-reason"
                name="reason"
                rows={3}
                value={form.reason}
                disabled={status === 'sending'}
                aria-invalid={Boolean(errors.reason) || undefined}
                onChange={(event) => update('reason', event.target.value)}
                placeholder="Investigating failed payouts for SEC-2291"
              />
              {errors.reason ? (
                <FieldError>{errors.reason}</FieldError>
              ) : (
                <FieldDescription>Include the ticket you are working on.</FieldDescription>
              )}
            </Field>
            <Button type="submit" disabled={status === 'sending'} className="w-full">
              {status === 'sending' ? <Loader2 aria-hidden className="animate-spin" /> : null}
              {status === 'sending' ? 'Sending request' : 'Request access'}
            </Button>
          </FieldGroup>
        </form>
      )}
    </BentoTile>
  );
};

const Bento04 = () => {
  return (
    <section data-slot="bento" className="bg-background px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header data-slot="bento-header" className="flex max-w-2xl flex-col gap-4">
          <h2
            className={cn(ENTER, 'font-serif text-3xl font-medium tracking-tight text-balance md:text-4xl lg:text-5xl')}
          >
            Pass the audit without a spreadsheet
          </h2>
          <p style={stagger(1)} className={cn(ENTER, 'text-base text-pretty text-muted-foreground md:text-lg')}>
            A live record of who did what, access that expires on its own, and the evidence your auditor asks for, kept
            in one place.
          </p>
        </header>

        <div data-slot="bento-grid" className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
          <AuditTrail style={stagger(0, 70, 150)} className={cn(ENTER, 'md:col-span-6 lg:col-span-7 lg:row-span-2')} />
          <TwoFactorMeter style={stagger(1, 70, 150)} className={cn(ENTER, 'md:col-span-3 lg:col-span-5')} />
          <CertificateList style={stagger(2, 70, 150)} className={cn(ENTER, 'md:col-span-3 lg:col-span-5')} />
          <AccessMatrix style={stagger(3, 70, 150)} className={cn(ENTER, 'md:col-span-6 lg:col-span-7')} />
          <RequestAccess style={stagger(4, 70, 150)} className={cn(ENTER, 'md:col-span-6 lg:col-span-5')} />
        </div>
      </div>
    </section>
  );
};

export { BentoTile, AuditTrail, TwoFactorMeter, CertificateList, AccessMatrix, RequestAccess };
export default Bento04;
