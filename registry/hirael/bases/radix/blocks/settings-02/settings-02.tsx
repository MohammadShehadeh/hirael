'use client';

import * as React from 'react';
import { Laptop, MonitorSmartphone, ShieldCheck, Smartphone, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/registry/hirael/bases/radix/ui/field';
import { Switch } from '@/registry/hirael/bases/radix/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/hirael/bases/radix/ui/tabs';
import {
  PasswordInput,
  PasswordInputField,
  PasswordInputStrength,
} from '@/registry/hirael/bases/radix/components/password-input';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

type SettingsPanelProps = React.ComponentProps<'section'>;

const SettingsPanel = ({ className, ...props }: SettingsPanelProps) => {
  return (
    <section
      data-slot="settings-panel"
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground',
        className,
      )}
      {...props}
    />
  );
};

type SettingsPanelHeaderProps = React.ComponentProps<'div'>;

const SettingsPanelHeader = ({ className, ...props }: SettingsPanelHeaderProps) => {
  return (
    <div
      data-slot="settings-panel-header"
      className={cn('flex items-start justify-between gap-4 border-b border-border px-5 py-4', className)}
      {...props}
    />
  );
};

type SettingsPanelTitleProps = React.ComponentProps<'h2'>;

const SettingsPanelTitle = ({ className, ...props }: SettingsPanelTitleProps) => {
  return (
    <h2
      data-slot="settings-panel-title"
      className={cn('text-base font-semibold tracking-[-0.01em] text-foreground', className)}
      {...props}
    />
  );
};

type SettingsPanelDescriptionProps = React.ComponentProps<'p'>;

const SettingsPanelDescription = ({ className, ...props }: SettingsPanelDescriptionProps) => {
  return (
    <p data-slot="settings-panel-description" className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
};

interface SettingsPanelGroupProps extends React.ComponentProps<'div'> {
  /** Uppercase eyebrow above the group. */
  label?: React.ReactNode;
}

const SettingsPanelGroup = ({ label, className, children, ...props }: SettingsPanelGroupProps) => {
  const labelId = React.useId();
  return (
    <div
      data-slot="settings-panel-group"
      role="group"
      aria-labelledby={label ? labelId : undefined}
      className={cn('flex flex-col', className)}
      {...props}
    >
      {label ? (
        <span
          id={labelId}
          className="border-b border-border bg-muted/30 px-5 py-2 text-xs uppercase text-muted-foreground"
        >
          {label}
        </span>
      ) : null}
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
};

interface SettingsPanelItemProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Connects the label to the control (a switch, an input, a button). */
  htmlFor?: string;
  /** Sits next to the label, e.g. a "Recommended" badge. */
  badge?: React.ReactNode;
  /** The control or action on the end side. */
  children?: React.ReactNode;
}

const SettingsPanelItem = ({
  label,
  description,
  htmlFor,
  badge,
  className,
  children,
  ...props
}: SettingsPanelItemProps) => {
  return (
    <Field
      orientation="horizontal"
      data-slot="settings-panel-item"
      className={cn('justify-between gap-6 px-5 py-3.5', className)}
      {...props}
    >
      <FieldContent className="min-w-0 gap-0.5">
        <div className="flex flex-wrap items-center gap-2">
          {htmlFor ? <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel> : <FieldTitle>{label}</FieldTitle>}
          {badge}
        </div>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
      {children ? <div className="flex shrink-0 items-center gap-2 self-center">{children}</div> : null}
    </Field>
  );
};

type SettingsPanelSessionsProps = React.ComponentProps<'ul'>;

const SettingsPanelSessions = ({ className, ...props }: SettingsPanelSessionsProps) => {
  return <ul data-slot="settings-panel-sessions" className={cn('divide-y divide-border', className)} {...props} />;
};

interface SettingsPanelSessionProps extends Omit<React.ComponentProps<'li'>, 'children'> {
  device: React.ReactNode;
  location?: React.ReactNode;
  lastActive?: React.ReactNode;
  /** The session the viewer is using right now; it cannot be revoked. */
  current?: boolean;
  icon?: LucideIcon;
  onRevoke?: () => void;
  revokeLabel?: string;
}

const SettingsPanelSession = ({
  device,
  location,
  lastActive,
  current = false,
  icon: Icon = MonitorSmartphone,
  onRevoke,
  revokeLabel = 'Revoke',
  className,
  ...props
}: SettingsPanelSessionProps) => {
  return (
    <li
      data-slot="settings-panel-session"
      data-current={current || undefined}
      className={cn('flex items-center gap-3 px-5 py-3', className)}
      {...props}
    >
      <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">{device}</span>
          {current ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-cool/40 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-accent-cool">
              <span aria-hidden className="size-1.5 rounded-full bg-accent-cool" />
              This device
            </span>
          ) : null}
        </span>
        <span className="flex min-w-0 items-center gap-2 text-xs uppercase text-muted-foreground">
          {location ? <span className="truncate">{location}</span> : null}
          {location && lastActive ? (
            <span aria-hidden className="text-border">
              |
            </span>
          ) : null}
          {lastActive ? <span className="truncate">{lastActive}</span> : null}
        </span>
      </div>
      {current ? null : (
        <Button type="button" variant="ghost" size="sm" onClick={onRevoke}>
          {revokeLabel}
        </Button>
      )}
    </li>
  );
};

type SettingsPanelFooterProps = React.ComponentProps<'div'>;

const SettingsPanelFooter = ({ className, ...props }: SettingsPanelFooterProps) => {
  return (
    <div
      data-slot="settings-panel-footer"
      className={cn('flex items-center justify-end gap-2 border-t border-border bg-muted/30 px-5 py-3', className)}
      {...props}
    />
  );
};

export {
  SettingsPanel,
  SettingsPanelHeader,
  SettingsPanelTitle,
  SettingsPanelDescription,
  SettingsPanelGroup,
  SettingsPanelItem,
  SettingsPanelSessions,
  SettingsPanelSession,
  SettingsPanelFooter,
};

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
  icon: LucideIcon;
}

const SESSIONS: readonly Session[] = [
  {
    id: 's1',
    device: 'Chrome on MacBook Pro',
    location: 'Amman, JO',
    lastActive: 'Active now',
    current: true,
    icon: Laptop,
  },
  {
    id: 's2',
    device: 'Safari on iPhone 15',
    location: 'Amman, JO',
    lastActive: '2 hours ago',
    icon: Smartphone,
  },
  {
    id: 's3',
    device: 'Edge on Windows',
    location: 'Berlin, DE',
    lastActive: '6 days ago',
    icon: Laptop,
  },
];

type NotificationKey = 'digest' | 'mentions' | 'billing' | 'product';

interface NotificationRow {
  key: NotificationKey;
  label: string;
  description: string;
}

const NOTIFICATION_GROUPS: readonly {
  label: string;
  rows: readonly NotificationRow[];
}[] = [
  {
    label: 'Activity',
    rows: [
      {
        key: 'digest',
        label: 'Email digest',
        description: 'A summary of what happened, every weekday morning.',
      },
      {
        key: 'mentions',
        label: 'Mentions',
        description: 'When someone @mentions you in a comment or thread.',
      },
    ],
  },
  {
    label: 'Account',
    rows: [
      {
        key: 'billing',
        label: 'Billing alerts',
        description: 'Failed payments, receipts, and plan changes.',
      },
      {
        key: 'product',
        label: 'Product updates',
        description: 'New features and changelog highlights, about once a month.',
      },
    ],
  },
];

const NOTIFICATION_DEFAULTS: Record<NotificationKey, boolean> = {
  digest: true,
  mentions: true,
  billing: true,
  product: false,
};

const Settings02 = () => {
  const [current, setCurrent] = React.useState('');
  const [next, setNext] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const confirmMismatch = confirm.length > 0 && confirm !== next;
  const canUpdatePassword = current.length > 0 && next.length >= 8 && confirm === next;

  const [twoFactor, setTwoFactor] = React.useState(false);
  const [sessions, setSessions] = React.useState<readonly Session[]>(SESSIONS);
  const others = sessions.filter((s) => !s.current);

  const [paused, setPaused] = React.useState(false);
  const [prefs, setPrefs] = React.useState(NOTIFICATION_DEFAULTS);
  const [saved, setSaved] = React.useState({
    paused: false,
    prefs: NOTIFICATION_DEFAULTS,
  });
  const notificationsDirty =
    paused !== saved.paused || (Object.keys(prefs) as NotificationKey[]).some((k) => prefs[k] !== saved.prefs[k]);

  return (
    <section data-slot="settings-02-block" className="min-h-svh w-full bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className={cn(ENTER, 'mb-6 flex flex-col gap-1')}>
          <span className="text-xs uppercase text-muted-foreground">Account</span>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Security and notifications</h1>
          <p className="text-sm text-muted-foreground">
            Keep your account locked down and decide what reaches your inbox.
          </p>
        </div>

        <Tabs defaultValue="security" style={stagger(1)} className={ENTER}>
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="security" className="flex-none">
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-none">
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security" className={cn(SWAP, 'mt-4')}>
            <div className="flex flex-col gap-6">
              <SettingsPanel>
                <SettingsPanelHeader>
                  <div className="flex flex-col gap-1">
                    <SettingsPanelTitle>Password</SettingsPanelTitle>
                    <SettingsPanelDescription>
                      Use at least 8 characters. A passphrase is easier to remember and harder to guess.
                    </SettingsPanelDescription>
                  </div>
                </SettingsPanelHeader>
                <form
                  id="settings-password-form"
                  className="px-5 py-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCurrent('');
                    setNext('');
                    setConfirm('');
                  }}
                >
                  <FieldGroup className="gap-5">
                    <Field className="gap-2">
                      <FieldLabel htmlFor="settings-current-password">Current password</FieldLabel>
                      <PasswordInput id="settings-current-password" value={current} onValueChange={setCurrent}>
                        <PasswordInputField autoComplete="current-password" />
                      </PasswordInput>
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field className="gap-2">
                        <FieldLabel htmlFor="settings-new-password">New password</FieldLabel>
                        <PasswordInput id="settings-new-password" value={next} onValueChange={setNext}>
                          <PasswordInputField autoComplete="new-password" />
                          <PasswordInputStrength showLabel={next.length > 0} />
                        </PasswordInput>
                      </Field>
                      <Field className="gap-2" data-invalid={confirmMismatch || undefined}>
                        <FieldLabel htmlFor="settings-confirm-password">Confirm new password</FieldLabel>
                        <PasswordInput id="settings-confirm-password" value={confirm} onValueChange={setConfirm}>
                          <PasswordInputField
                            autoComplete="new-password"
                            aria-invalid={confirmMismatch || undefined}
                            aria-describedby={confirmMismatch ? 'settings-confirm-error' : undefined}
                          />
                        </PasswordInput>
                        <FieldError id="settings-confirm-error">
                          {confirmMismatch ? 'Passwords do not match.' : null}
                        </FieldError>
                      </Field>
                    </div>
                  </FieldGroup>
                </form>
                <SettingsPanelFooter>
                  <Button type="button" variant="link" size="sm" className="me-auto h-auto">
                    Forgot your password?
                  </Button>
                  <Button type="submit" form="settings-password-form" size="sm" disabled={!canUpdatePassword}>
                    Update password
                  </Button>
                </SettingsPanelFooter>
              </SettingsPanel>

              <SettingsPanel>
                <SettingsPanelHeader>
                  <div className="flex flex-col gap-1">
                    <SettingsPanelTitle>Two-factor authentication</SettingsPanelTitle>
                    <SettingsPanelDescription>
                      A second step at sign-in, using an authenticator app.
                    </SettingsPanelDescription>
                  </div>
                </SettingsPanelHeader>
                <SettingsPanelGroup>
                  <SettingsPanelItem
                    htmlFor="settings-2fa"
                    label="Authenticator app"
                    description={
                      twoFactor
                        ? 'Enabled. You will be asked for a code on new devices.'
                        : 'Codes from Google Authenticator, 1Password, or similar.'
                    }
                    badge={
                      twoFactor ? (
                        <Badge variant="secondary">
                          <ShieldCheck aria-hidden />
                          On
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Recommended</Badge>
                      )
                    }
                  >
                    <Switch id="settings-2fa" checked={twoFactor} onCheckedChange={setTwoFactor} />
                  </SettingsPanelItem>
                  {twoFactor ? (
                    <div className={SWAP}>
                      <SettingsPanelItem
                        label="Recovery codes"
                        description="Ten one-time codes for when you lose your phone. 10 of 10 left."
                      >
                        <Button type="button" variant="outline" size="sm">
                          View codes
                        </Button>
                      </SettingsPanelItem>
                    </div>
                  ) : null}
                </SettingsPanelGroup>
              </SettingsPanel>

              <SettingsPanel>
                <SettingsPanelHeader>
                  <div className="flex flex-col gap-1">
                    <SettingsPanelTitle>Active sessions</SettingsPanelTitle>
                    <SettingsPanelDescription>
                      Devices signed in to your account. Revoke anything you do not recognise.
                    </SettingsPanelDescription>
                  </div>
                  <span className="shrink-0 text-xs uppercase text-muted-foreground">
                    {sessions.length} {sessions.length === 1 ? 'device' : 'devices'}
                  </span>
                </SettingsPanelHeader>
                <SettingsPanelSessions>
                  {sessions.map((s) => (
                    <SettingsPanelSession
                      key={s.id}
                      device={s.device}
                      location={s.location}
                      lastActive={s.lastActive}
                      current={s.current}
                      icon={s.icon}
                      onRevoke={() => setSessions((list) => list.filter((x) => x.id !== s.id))}
                    />
                  ))}
                </SettingsPanelSessions>
                <SettingsPanelFooter className="justify-between">
                  <span className="text-xs text-muted-foreground">
                    {others.length === 0
                      ? 'Only this device is signed in.'
                      : `${others.length} other ${others.length === 1 ? 'device' : 'devices'} signed in.`}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={others.length === 0}
                    onClick={() => setSessions((list) => list.filter((x) => x.current))}
                  >
                    Sign out all other devices
                  </Button>
                </SettingsPanelFooter>
              </SettingsPanel>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className={cn(SWAP, 'mt-4')}>
            <div className="flex flex-col gap-6">
              <SettingsPanel>
                <SettingsPanelHeader>
                  <div className="flex flex-col gap-1">
                    <SettingsPanelTitle>Email notifications</SettingsPanelTitle>
                    <SettingsPanelDescription>
                      Sent to hello@mohammadshehadeh.com. Pausing keeps your choices for when you come back.
                    </SettingsPanelDescription>
                  </div>
                  <Field orientation="horizontal" className="w-auto shrink-0 gap-2">
                    <FieldLabel htmlFor="settings-pause-all">Pause all</FieldLabel>
                    <Switch id="settings-pause-all" checked={paused} onCheckedChange={setPaused} />
                  </Field>
                </SettingsPanelHeader>
                {NOTIFICATION_GROUPS.map((group) => (
                  <SettingsPanelGroup key={group.label} label={group.label}>
                    {group.rows.map((row) => {
                      const id = `settings-notify-${row.key}`;
                      return (
                        <SettingsPanelItem
                          key={row.key}
                          htmlFor={id}
                          label={row.label}
                          description={row.description}
                          data-disabled={paused || undefined}
                        >
                          <Switch
                            id={id}
                            checked={!paused && prefs[row.key]}
                            disabled={paused}
                            onCheckedChange={(checked) => setPrefs((p) => ({ ...p, [row.key]: checked }))}
                          />
                        </SettingsPanelItem>
                      );
                    })}
                  </SettingsPanelGroup>
                ))}
                <SettingsPanelFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={!notificationsDirty}
                    onClick={() => {
                      setPaused(saved.paused);
                      setPrefs(saved.prefs);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!notificationsDirty}
                    onClick={() => setSaved({ paused, prefs })}
                  >
                    Save changes
                  </Button>
                </SettingsPanelFooter>
              </SettingsPanel>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Settings02;
