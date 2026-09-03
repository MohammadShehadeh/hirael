'use client';

import * as React from 'react';
import { Check, TriangleAlert } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/registry/hirael/bases/radix/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/radix/ui/avatar';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/radix/ui/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/radix/ui/select';
import { Textarea } from '@/registry/hirael/bases/radix/ui/textarea';

type SettingsProps = React.ComponentProps<'div'>;

/** Page container: side nav on md+, stacked on mobile. */
const Settings = ({ className, ...props }: SettingsProps) => {
  return (
    <div
      data-slot="settings"
      className={cn('grid w-full gap-6 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10', className)}
      {...props}
    />
  );
};

type SettingsNavProps = React.ComponentProps<'nav'>;

const SettingsNav = ({ className, children, ...props }: SettingsNavProps) => {
  return (
    <nav
      data-slot="settings-nav"
      aria-label="Settings sections"
      className={cn('md:sticky md:top-6 md:self-start', className)}
      {...props}
    >
      <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0">
        {children}
      </ul>
    </nav>
  );
};

interface SettingsNavItemProps extends React.ComponentProps<'a'> {
  active?: boolean;
}

const SettingsNavItem = ({ active = false, className, ...props }: SettingsNavItemProps) => {
  return (
    <li data-slot="settings-nav-item" className="shrink-0">
      <a
        data-active={active || undefined}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex items-center rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          active
            ? 'bg-accent font-medium text-foreground'
            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
          className,
        )}
        {...props}
      />
    </li>
  );
};

interface SettingsSectionProps extends React.ComponentProps<'section'> {
  /** Paints the border in the destructive tone for irreversible actions. */
  destructive?: boolean;
}

const SettingsSection = ({ destructive = false, className, ...props }: SettingsSectionProps) => {
  return (
    <section
      data-slot="settings-section"
      data-destructive={destructive || undefined}
      className={cn(
        'scroll-mt-6 overflow-hidden rounded-lg border bg-card text-card-foreground',
        destructive ? 'border-destructive/40' : 'border-border',
        className,
      )}
      {...props}
    />
  );
};

type SettingsSectionHeaderProps = React.ComponentProps<'div'>;

const SettingsSectionHeader = ({ className, ...props }: SettingsSectionHeaderProps) => {
  return (
    <div
      data-slot="settings-section-header"
      className={cn('flex flex-col gap-1 border-b border-border px-5 py-4', className)}
      {...props}
    />
  );
};

type SettingsSectionTitleProps = React.ComponentProps<'h2'>;

const SettingsSectionTitle = ({ className, ...props }: SettingsSectionTitleProps) => {
  return (
    <h2
      data-slot="settings-section-title"
      className={cn('text-base font-semibold tracking-[-0.01em] text-foreground', className)}
      {...props}
    />
  );
};

type SettingsSectionDescriptionProps = React.ComponentProps<'p'>;

const SettingsSectionDescription = ({ className, ...props }: SettingsSectionDescriptionProps) => {
  return (
    <p data-slot="settings-section-description" className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
};

interface SettingsRowProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Connects the label to the control so clicking it focuses the field. */
  htmlFor?: string;
  children?: React.ReactNode;
}

/**
 * Label and description on the start side, control on the end side.
 * Stacks until the surrounding `FieldGroup` is wide enough for a row.
 */
const SettingsRow = ({ label, description, htmlFor, className, children, ...props }: SettingsRowProps) => {
  return (
    <Field
      orientation="responsive"
      data-slot="settings-row"
      className={cn('gap-3 px-5 py-4 @md/field-group:justify-between @md/field-group:gap-8', className)}
      {...props}
    >
      <FieldContent className="min-w-0 gap-0.5 @md/field-group:max-w-xs @md/field-group:pt-1.5">
        {htmlFor ? <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel> : <FieldTitle>{label}</FieldTitle>}
        {description ? <FieldDescription className="text-xs">{description}</FieldDescription> : null}
      </FieldContent>
      <div className="flex w-full flex-col gap-2 @md/field-group:shrink-0 @md/field-group:basis-80">{children}</div>
    </Field>
  );
};

type SettingsFooterProps = React.ComponentProps<'div'>;

/** Save / Cancel row at the bottom of a section. */
const SettingsFooter = ({ className, ...props }: SettingsFooterProps) => {
  return (
    <div
      data-slot="settings-footer"
      className={cn('flex items-center justify-end gap-2 border-t border-border bg-muted/30 px-5 py-3', className)}
      {...props}
    />
  );
};

export {
  Settings,
  SettingsNav,
  SettingsNavItem,
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionTitle,
  SettingsSectionDescription,
  SettingsRow,
  SettingsFooter,
};

const SECTIONS = [
  { id: 'profile', label: 'Profile' },
  { id: 'email', label: 'Email' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'danger', label: 'Danger zone' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
  { value: 'ja', label: 'Japanese' },
];

const TIMEZONES = [
  { value: 'Asia/Amman', label: 'Amman (GMT+3)' },
  { value: 'Europe/Berlin', label: 'Berlin (GMT+2)' },
  { value: 'Europe/London', label: 'London (GMT+1)' },
  { value: 'America/New_York', label: 'New York (GMT-4)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-7)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
];

const WEEK_STARTS = [
  { value: 'monday', label: 'Monday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const PROFILE = {
  name: 'Mohammad Shehadeh',
  username: 'mohammad',
  bio: 'Building Hirael, a registry of the parts shadcn/ui leaves out.',
};

const PREFERENCES = {
  language: 'en',
  timezone: 'Asia/Amman',
  weekStart: 'monday',
};

const BIO_MAX = 160;

const initialsOf = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
};

const Settings01 = () => {
  const [active, setActive] = React.useState<SectionId>('profile');

  const [profile, setProfile] = React.useState(PROFILE);
  const [savedProfile, setSavedProfile] = React.useState(PROFILE);
  const profileDirty =
    profile.name !== savedProfile.name ||
    profile.username !== savedProfile.username ||
    profile.bio !== savedProfile.bio;

  const [prefs, setPrefs] = React.useState(PREFERENCES);
  const [savedPrefs, setSavedPrefs] = React.useState(PREFERENCES);
  const prefsDirty =
    prefs.language !== savedPrefs.language ||
    prefs.timezone !== savedPrefs.timezone ||
    prefs.weekStart !== savedPrefs.weekStart;

  const [recovery, setRecovery] = React.useState('');
  const [savedRecovery, setSavedRecovery] = React.useState('');
  const recoveryDirty = recovery !== savedRecovery;

  return (
    <section data-slot="settings-01-block" className="min-h-svh w-full bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Account</span>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Account settings</h1>
          <p className="text-sm text-muted-foreground">Your profile, contact email, and how the app behaves for you.</p>
        </div>

        <Settings>
          <SettingsNav>
            {SECTIONS.map((section) => (
              <SettingsNavItem
                key={section.id}
                href={`#${section.id}`}
                active={active === section.id}
                onClick={() => setActive(section.id)}
                className={
                  section.id === 'danger' && active !== section.id
                    ? 'text-destructive/80 hover:text-destructive'
                    : undefined
                }
              >
                {section.label}
              </SettingsNavItem>
            ))}
          </SettingsNav>

          <div className="flex min-w-0 flex-col gap-6">
            <SettingsSection id="profile">
              <SettingsSectionHeader>
                <SettingsSectionTitle>Profile</SettingsSectionTitle>
                <SettingsSectionDescription>
                  How you appear to teammates and in shared links.
                </SettingsSectionDescription>
              </SettingsSectionHeader>
              <FieldGroup className="gap-0 divide-y divide-border">
                <SettingsRow label="Avatar" description="PNG or JPG, at least 256 by 256.">
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarFallback className="font-mono text-xs font-medium text-foreground">
                        {initialsOf(profile.name) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <Button type="button" variant="outline" size="sm">
                      Upload
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
                      Remove
                    </Button>
                  </div>
                </SettingsRow>
                <SettingsRow label="Full name" htmlFor="settings-name">
                  <Input
                    id="settings-name"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    autoComplete="name"
                  />
                </SettingsRow>
                <SettingsRow
                  label="Username"
                  description="Letters, numbers, and dashes only."
                  htmlFor="settings-username"
                >
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <span className="text-muted-foreground">hirael.com/</span>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="settings-username"
                      value={profile.username}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                        }))
                      }
                      autoComplete="username"
                      spellCheck={false}
                    />
                  </InputGroup>
                </SettingsRow>
                <SettingsRow
                  label="Bio"
                  description="A sentence or two. Shown on your public profile."
                  htmlFor="settings-bio"
                >
                  <Textarea
                    id="settings-bio"
                    value={profile.bio}
                    maxLength={BIO_MAX}
                    rows={3}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  />
                  <span className="self-end font-mono text-[10px] tabular-nums text-muted-foreground">
                    {profile.bio.length} / {BIO_MAX}
                  </span>
                </SettingsRow>
              </FieldGroup>
              <SettingsFooter>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!profileDirty}
                  onClick={() => setProfile(savedProfile)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant={profileDirty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSavedProfile(profile)}
                >
                  Save changes
                </Button>
              </SettingsFooter>
            </SettingsSection>

            <SettingsSection id="email">
              <SettingsSectionHeader>
                <SettingsSectionTitle>Email</SettingsSectionTitle>
                <SettingsSectionDescription>Where sign-in links, receipts, and alerts go.</SettingsSectionDescription>
              </SettingsSectionHeader>
              <FieldGroup className="gap-0 divide-y divide-border">
                <SettingsRow
                  label="Email address"
                  description="Changing it sends a confirmation to the new address."
                  htmlFor="settings-email"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      id="settings-email"
                      type="email"
                      defaultValue="mohammad@plinth.dev"
                      autoComplete="email"
                      readOnly
                      className="flex-1"
                    />
                    <Badge variant="outline" className="shrink-0 gap-1 text-success">
                      <Check aria-hidden />
                      Verified
                    </Badge>
                  </div>
                  <Button type="button" variant="link" size="sm" className="h-auto self-start p-0 text-xs">
                    Change email
                  </Button>
                </SettingsRow>
                <SettingsRow
                  label="Recovery email"
                  description="Used only if you lose access to your main address."
                  htmlFor="settings-recovery"
                >
                  <Input
                    id="settings-recovery"
                    type="email"
                    placeholder="you@personal.com"
                    value={recovery}
                    onChange={(e) => setRecovery(e.target.value)}
                    autoComplete="off"
                  />
                </SettingsRow>
              </FieldGroup>
              <SettingsFooter>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!recoveryDirty}
                  onClick={() => setRecovery(savedRecovery)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant={recoveryDirty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSavedRecovery(recovery)}
                >
                  Save changes
                </Button>
              </SettingsFooter>
            </SettingsSection>

            <SettingsSection id="preferences">
              <SettingsSectionHeader>
                <SettingsSectionTitle>Preferences</SettingsSectionTitle>
                <SettingsSectionDescription>Language, time zone, and calendar defaults.</SettingsSectionDescription>
              </SettingsSectionHeader>
              <FieldGroup className="gap-0 divide-y divide-border">
                <SettingsRow
                  label="Language"
                  description="The interface language. Content is not translated."
                  htmlFor="settings-language"
                >
                  <Select value={prefs.language} onValueChange={(language) => setPrefs((p) => ({ ...p, language }))}>
                    <SelectTrigger id="settings-language" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          {l.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SettingsRow>
                <SettingsRow
                  label="Time zone"
                  description="Times and reminders are shown in this zone."
                  htmlFor="settings-timezone"
                >
                  <Select value={prefs.timezone} onValueChange={(timezone) => setPrefs((p) => ({ ...p, timezone }))}>
                    <SelectTrigger id="settings-timezone" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SettingsRow>
                <SettingsRow label="Week starts on" htmlFor="settings-week">
                  <Select value={prefs.weekStart} onValueChange={(weekStart) => setPrefs((p) => ({ ...p, weekStart }))}>
                    <SelectTrigger id="settings-week" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEK_STARTS.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SettingsRow>
              </FieldGroup>
              <SettingsFooter>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!prefsDirty}
                  onClick={() => setPrefs(savedPrefs)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant={prefsDirty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSavedPrefs(prefs)}
                >
                  Save changes
                </Button>
              </SettingsFooter>
            </SettingsSection>

            <SettingsSection id="danger" destructive>
              <SettingsSectionHeader>
                <SettingsSectionTitle className="flex items-center gap-2">
                  <TriangleAlert className="size-4 text-destructive" aria-hidden />
                  Danger zone
                </SettingsSectionTitle>
                <SettingsSectionDescription>These actions cannot be undone. Take a moment.</SettingsSectionDescription>
              </SettingsSectionHeader>
              <SettingsRow
                label="Delete account"
                description="Removes your profile, workspaces you own, and all data within 30 days."
                className="sm:items-center"
              >
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" size="sm" className="sm:self-end">
                      Delete account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This permanently deletes{' '}
                        <span className="font-medium text-foreground">{savedProfile.name}</span> and every workspace you
                        own. Teammates lose access immediately. There is no way back.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep account</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60">
                        Delete account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SettingsRow>
            </SettingsSection>
          </div>
        </Settings>
      </div>
    </section>
  );
};

export default Settings01;
