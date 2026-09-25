'use client';

import * as React from 'react';
import { Check, CircleCheck, TriangleAlert } from 'lucide-react';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/hirael/bases/radix/ui/avatar';
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
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/radix/ui/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/radix/ui/select';
import { Textarea } from '@/registry/hirael/bases/radix/ui/textarea';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 60}ms` });

type SettingsProps = React.ComponentProps<'div'>;

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
  /** Shown under the control; also marks the row invalid. Pair it with `errorId` for the control's aria-describedby. */
  error?: React.ReactNode;
  errorId?: string;
  children?: React.ReactNode;
}

const SettingsRow = ({
  label,
  description,
  htmlFor,
  error,
  errorId,
  className,
  children,
  ...props
}: SettingsRowProps) => {
  return (
    <Field
      orientation="responsive"
      data-slot="settings-row"
      data-invalid={error ? true : undefined}
      className={cn('gap-3 px-5 py-4 @md/field-group:justify-between @md/field-group:gap-8', className)}
      {...props}
    >
      <FieldContent className="min-w-0 gap-0.5 @md/field-group:max-w-xs @md/field-group:pt-1.5">
        {htmlFor ? <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel> : <FieldTitle>{label}</FieldTitle>}
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
      <div className="flex w-full flex-col gap-2 @md/field-group:shrink-0 @md/field-group:basis-80">
        {children}
        {error ? <FieldError id={errorId}>{error}</FieldError> : null}
      </div>
    </Field>
  );
};

type SettingsFooterProps = React.ComponentProps<'div'>;

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
  username: 'mohammadshehadeh',
  bio: 'Building Hirael, a registry of the parts shadcn/ui leaves out.',
};

const PREFERENCES = {
  language: 'en',
  timezone: 'Asia/Amman',
  weekStart: 'monday',
};

const BIO_MAX = 160;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ProfileErrors {
  name?: string;
  username?: string;
}

const validateProfile = (profile: typeof PROFILE): ProfileErrors => {
  const errors: ProfileErrors = {};
  if (!profile.name.trim()) errors.name = 'Enter your name.';
  if (!profile.username) errors.username = 'Pick a username.';

  return errors;
};

const validateRecovery = (email: string) => {
  if (email && !EMAIL_PATTERN.test(email)) return "That doesn't look like a valid email.";

  return undefined;
};

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
  const [profileAttempted, setProfileAttempted] = React.useState(false);
  const profileErrors = profileAttempted ? validateProfile(profile) : {};

  const [prefs, setPrefs] = React.useState(PREFERENCES);
  const [savedPrefs, setSavedPrefs] = React.useState(PREFERENCES);
  const prefsDirty =
    prefs.language !== savedPrefs.language ||
    prefs.timezone !== savedPrefs.timezone ||
    prefs.weekStart !== savedPrefs.weekStart;

  const [recovery, setRecovery] = React.useState('');
  const [savedRecovery, setSavedRecovery] = React.useState('');
  const recoveryDirty = recovery !== savedRecovery;
  const [recoveryAttempted, setRecoveryAttempted] = React.useState(false);
  const recoveryError = recoveryAttempted ? validateRecovery(recovery) : undefined;

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deletionScheduled, setDeletionScheduled] = React.useState(false);

  const saveProfile = () => {
    setProfileAttempted(true);
    if (Object.keys(validateProfile(profile)).length > 0) return;
    setSavedProfile(profile);
    setProfileAttempted(false);
  };

  const saveRecovery = () => {
    setRecoveryAttempted(true);
    if (validateRecovery(recovery)) return;
    setSavedRecovery(recovery);
    setRecoveryAttempted(false);
  };

  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
    event.target.value = '';
  };

  return (
    <section data-slot="settings-01-block" className="min-h-svh w-full bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className={cn(ENTER, 'mb-8 flex flex-col gap-1')}>
          <span className="text-xs text-muted-foreground uppercase">Account</span>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Account settings</h1>
          <p className="text-sm text-muted-foreground">Your profile, contact email, and how the app behaves for you.</p>
        </div>

        <Settings>
          <SettingsNav style={stagger(1)} className={ENTER}>
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
            <SettingsSection id="profile" style={stagger(2)} className={ENTER}>
              <SettingsSectionHeader>
                <SettingsSectionTitle>Profile</SettingsSectionTitle>
                <SettingsSectionDescription>
                  How you appear to teammates and in shared links.
                </SettingsSectionDescription>
              </SettingsSectionHeader>
              <FieldGroup className="gap-0">
                <SettingsRow label="Avatar" description="PNG or JPG, at least 256 by 256.">
                  <div className="flex items-center gap-3">
                    <Avatar key={avatarUrl ?? 'initials'} size="lg">
                      {avatarUrl ? <AvatarImage src={avatarUrl} alt="" className="object-cover" /> : null}
                      <AvatarFallback>{initialsOf(profile.name) || '?'}</AvatarFallback>
                    </Avatar>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      className="sr-only"
                      tabIndex={-1}
                      aria-hidden
                      onChange={handleAvatarChange}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => avatarInputRef.current?.click()}>
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={!avatarUrl}
                      onClick={() => setAvatarUrl(null)}
                    >
                      Remove
                    </Button>
                  </div>
                </SettingsRow>
                <SettingsRow
                  label="Full name"
                  htmlFor="settings-name"
                  error={profileErrors.name}
                  errorId="settings-name-error"
                >
                  <Input
                    id="settings-name"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    autoComplete="name"
                    aria-invalid={profileErrors.name ? true : undefined}
                    aria-describedby={profileErrors.name ? 'settings-name-error' : undefined}
                  />
                </SettingsRow>
                <SettingsRow
                  label="Username"
                  description="Letters, numbers, and dashes only."
                  htmlFor="settings-username"
                  error={profileErrors.username}
                  errorId="settings-username-error"
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
                      aria-invalid={profileErrors.username ? true : undefined}
                      aria-describedby={profileErrors.username ? 'settings-username-error' : undefined}
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
                  <span className="self-end text-xs text-muted-foreground tabular-nums">
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
                  onClick={() => {
                    setProfile(savedProfile);
                    setProfileAttempted(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" size="sm" disabled={!profileDirty} onClick={saveProfile}>
                  Save changes
                </Button>
              </SettingsFooter>
            </SettingsSection>

            <SettingsSection id="email" style={stagger(3)} className={ENTER}>
              <SettingsSectionHeader>
                <SettingsSectionTitle>Email</SettingsSectionTitle>
                <SettingsSectionDescription>Where sign-in links, receipts, and alerts go.</SettingsSectionDescription>
              </SettingsSectionHeader>
              <FieldGroup className="gap-0">
                <SettingsRow
                  label="Email address"
                  description="Changing it sends a confirmation to the new address."
                  htmlFor="settings-email"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      id="settings-email"
                      type="email"
                      defaultValue="hello@mohammadshehadeh.com"
                      autoComplete="email"
                      readOnly
                      className="flex-1"
                    />
                    <Badge variant="outline" className="shrink-0">
                      <Check aria-hidden />
                      Verified
                    </Badge>
                  </div>
                  <Button type="button" variant="link" size="sm" className="h-auto self-start">
                    Change email
                  </Button>
                </SettingsRow>
                <SettingsRow
                  label="Recovery email"
                  description="Used only if you lose access to your main address."
                  htmlFor="settings-recovery"
                  error={recoveryError}
                  errorId="settings-recovery-error"
                >
                  <Input
                    id="settings-recovery"
                    type="email"
                    placeholder="you@hirael.com"
                    value={recovery}
                    onChange={(e) => setRecovery(e.target.value)}
                    autoComplete="off"
                    aria-invalid={recoveryError ? true : undefined}
                    aria-describedby={recoveryError ? 'settings-recovery-error' : undefined}
                  />
                </SettingsRow>
              </FieldGroup>
              <SettingsFooter>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!recoveryDirty}
                  onClick={() => {
                    setRecovery(savedRecovery);
                    setRecoveryAttempted(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" size="sm" disabled={!recoveryDirty} onClick={saveRecovery}>
                  Save changes
                </Button>
              </SettingsFooter>
            </SettingsSection>

            <SettingsSection id="preferences" style={stagger(4)} className={ENTER}>
              <SettingsSectionHeader>
                <SettingsSectionTitle>Preferences</SettingsSectionTitle>
                <SettingsSectionDescription>Language, time zone, and calendar defaults.</SettingsSectionDescription>
              </SettingsSectionHeader>
              <FieldGroup className="gap-0">
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
                <Button type="button" size="sm" disabled={!prefsDirty} onClick={() => setSavedPrefs(prefs)}>
                  Save changes
                </Button>
              </SettingsFooter>
            </SettingsSection>

            <SettingsSection id="danger" destructive style={stagger(5)} className={ENTER}>
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
                {deletionScheduled ? (
                  <div className="flex flex-col gap-2 sm:items-end">
                    <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CircleCheck className="size-4 shrink-0 text-destructive" aria-hidden />
                      Deletion scheduled. Your account closes in 30 days.
                    </p>
                    <Button type="button" variant="outline" size="sm" onClick={() => setDeletionScheduled(false)}>
                      Cancel deletion
                    </Button>
                  </div>
                ) : null}
                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  {deletionScheduled ? null : (
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive" size="sm" className="sm:self-end">
                        Delete account
                      </Button>
                    </AlertDialogTrigger>
                  )}
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
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => {
                          setDeleteOpen(false);
                          setDeletionScheduled(true);
                        }}
                      >
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
