'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight, Check, Plus, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Card } from '@/registry/hirael/bases/base/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/base/ui/input-group';
import { Progress } from '@/registry/hirael/bases/base/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/registry/hirael/bases/base/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/base/ui/select';
import { Switch } from '@/registry/hirael/bases/base/ui/switch';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/registry/hirael/bases/base/components/stepper';

/* -------------------------------------------------------------------------- */
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */

interface OnboardingStepMeta {
  title: string;
  description?: string;
}

interface OnboardingCtx {
  /** Active step, 0-based. */
  step: number;
  total: number;
  steps: readonly OnboardingStepMeta[];
  isFirst: boolean;
  isLast: boolean;
  goTo: (step: number) => void;
  next: () => void;
  back: () => void;
  complete: () => void;
}

const OnboardingContext = React.createContext<OnboardingCtx | null>(null);

const useOnboarding = () => {
  const ctx = React.useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('Onboarding parts must be used inside <Onboarding>');
  }
  return ctx;
};

/* -------------------------------------------------------------------------- */
/*  Parts                                                                     */
/* -------------------------------------------------------------------------- */

interface OnboardingProps extends Omit<React.ComponentProps<'div'>, 'defaultValue'> {
  /** Titles (and optional descriptions) for the indicator, in order. */
  steps: readonly OnboardingStepMeta[];
  /** Active step, 0-based. Controlled when set. */
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  /** Fires when Finish is pressed on the last step. */
  onComplete?: () => void;
}

const Onboarding = ({
  steps,
  step: stepProp,
  defaultStep = 0,
  onStepChange,
  onComplete,
  className,
  children,
  ...props
}: OnboardingProps) => {
  const [internal, setInternal] = React.useState(defaultStep);
  const total = steps.length;
  const step = Math.min(Math.max(stepProp ?? internal, 0), Math.max(total - 1, 0));

  const goTo = React.useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), total - 1);
      if (stepProp === undefined) setInternal(clamped);
      onStepChange?.(clamped);
    },
    [stepProp, onStepChange, total],
  );

  const next = React.useCallback(() => goTo(step + 1), [goTo, step]);
  const back = React.useCallback(() => goTo(step - 1), [goTo, step]);
  const complete = React.useCallback(() => onComplete?.(), [onComplete]);

  const ctx = React.useMemo<OnboardingCtx>(
    () => ({
      step,
      total,
      steps,
      isFirst: step === 0,
      isLast: step === total - 1,
      goTo,
      next,
      back,
      complete,
    }),
    [step, total, steps, goTo, next, back, complete],
  );

  return (
    <OnboardingContext.Provider value={ctx}>
      <div data-slot="onboarding" data-step={step} className={cn('flex w-full flex-col gap-6', className)} {...props}>
        {children}
      </div>
    </OnboardingContext.Provider>
  );
};

interface OnboardingHeaderProps extends React.ComponentProps<'div'> {
  /** Hide the step titles under the indicators (they hide below `sm` anyway). */
  showTitles?: boolean;
}

/** Step count eyebrow plus the stepper. Completed steps can be revisited. */
const OnboardingHeader = ({ showTitles = true, className, children, ...props }: OnboardingHeaderProps) => {
  const { step, total, steps, goTo } = useOnboarding();
  return (
    <div data-slot="onboarding-header" className={cn('flex flex-col gap-4', className)} {...props}>
      <div className="flex items-center justify-between gap-3">
        <span aria-live="polite" className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Step {step + 1} of {total}
        </span>
        {children}
      </div>
      <Stepper value={step + 1} onValueChange={(s) => goTo(s - 1)}>
        {steps.map((meta, i) => (
          <StepperItem key={meta.title} step={i + 1} disabled={i > step}>
            <StepperTrigger aria-label={`Step ${i + 1}: ${meta.title}`} className="gap-2">
              <StepperIndicator className="size-7 text-xs" />
              {showTitles ? <StepperTitle className="hidden sm:block">{meta.title}</StepperTitle> : null}
            </StepperTrigger>
            {i < total - 1 ? <StepperSeparator /> : null}
          </StepperItem>
        ))}
      </Stepper>
    </div>
  );
};

type OnboardingProgressProps = React.ComponentProps<'div'>;

/** Thin bar alternative to the stepper. Fills as steps are completed. */
const OnboardingProgress = ({ className, ...props }: OnboardingProgressProps) => {
  const { step, total } = useOnboarding();
  const value = total > 0 ? Math.round(((step + 1) / total) * 100) : 0;
  return (
    <div data-slot="onboarding-progress" className={cn('flex items-center gap-3', className)} {...props}>
      <Progress value={value} aria-label={`Step ${step + 1} of ${total}`} className="h-1 flex-1 bg-muted" />
      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
        {step + 1}/{total}
      </span>
    </div>
  );
};

interface OnboardingStepProps extends React.ComponentProps<'div'> {
  /** Which step this is, 0-based. Renders only while active. */
  index: number;
}

const OnboardingStep = ({ index, className, children, ...props }: OnboardingStepProps) => {
  const { step } = useOnboarding();
  if (index !== step) return null;
  return (
    <div
      data-slot="onboarding-step"
      data-index={index}
      className={cn(
        'flex flex-col gap-5',
        'animate-in fade-in-0 slide-in-from-bottom-1 duration-300 ease-out motion-reduce:animate-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type OnboardingStepTitleProps = React.ComponentProps<'h2'>;

const OnboardingStepTitle = ({ className, ...props }: OnboardingStepTitleProps) => {
  return (
    <h2
      data-slot="onboarding-step-title"
      className={cn('text-xl font-semibold tracking-[-0.02em] text-foreground', className)}
      {...props}
    />
  );
};

type OnboardingStepDescriptionProps = React.ComponentProps<'p'>;

const OnboardingStepDescription = ({ className, ...props }: OnboardingStepDescriptionProps) => {
  return (
    <p data-slot="onboarding-step-description" className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
};

type OnboardingBodyProps = React.ComponentProps<'div'>;

const OnboardingBody = ({ className, ...props }: OnboardingBodyProps) => {
  return <div data-slot="onboarding-body" className={cn('flex flex-col gap-5', className)} {...props} />;
};

interface OnboardingFooterProps extends React.ComponentProps<'div'> {
  /** Gate Continue / Finish on the current step being valid. */
  canContinue?: boolean;
  /** Show a Skip button that advances without validating. */
  skippable?: boolean;
  onSkip?: () => void;
  backLabel?: string;
  continueLabel?: string;
  finishLabel?: string;
  skipLabel?: string;
}

const OnboardingFooter = ({
  canContinue = true,
  skippable = false,
  onSkip,
  backLabel = 'Back',
  continueLabel = 'Continue',
  finishLabel = 'Finish',
  skipLabel = 'Skip for now',
  className,
  children,
  ...props
}: OnboardingFooterProps) => {
  const { isFirst, isLast, next, back, complete } = useOnboarding();

  const skip = () => {
    onSkip?.();
    if (isLast) complete();
    else next();
  };

  return (
    <div
      data-slot="onboarding-footer"
      className={cn('flex items-center justify-between gap-2 border-t border-border pt-5', className)}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isFirst}
        onClick={back}
        className="text-muted-foreground"
      >
        <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden />
        {backLabel}
      </Button>
      <div className="flex items-center gap-2">
        {children}
        {skippable ? (
          <Button type="button" variant="ghost" size="sm" onClick={skip} className="text-muted-foreground">
            {skipLabel}
          </Button>
        ) : null}
        <Button type="button" size="sm" disabled={!canContinue} onClick={isLast ? complete : next}>
          {isLast ? finishLabel : continueLabel}
          {isLast ? (
            <Check className="size-3.5" aria-hidden />
          ) : (
            <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
          )}
        </Button>
      </div>
    </div>
  );
};

export {
  Onboarding,
  OnboardingHeader,
  OnboardingProgress,
  OnboardingStep,
  OnboardingStepTitle,
  OnboardingStepDescription,
  OnboardingBody,
  OnboardingFooter,
  useOnboarding,
  type OnboardingStepMeta,
};

/* -------------------------------------------------------------------------- */
/*  Preview                                                                   */
/* -------------------------------------------------------------------------- */

const STEPS: readonly OnboardingStepMeta[] = [
  { title: 'Workspace' },
  { title: 'Profile' },
  { title: 'Team' },
  { title: 'Preferences' },
];

const ROLES = [
  { value: 'founder', label: 'Founder' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'designer', label: 'Designer' },
  { value: 'product', label: 'Product' },
  { value: 'other', label: 'Something else' },
];

const THEMES = [
  {
    value: 'system',
    label: 'System',
    description: 'Follow the operating system.',
  },
  { value: 'dark', label: 'Dark', description: 'Easy on the eyes at night.' },
  { value: 'light', label: 'Light', description: 'Bright and high contrast.' },
];

const MAX_INVITES = 6;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
};

/** Seeded so the first step opens with an enabled primary action. */
const DEMO_WORKSPACE = 'Northwind';

const Onboarding01 = () => {
  const [step, setStep] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const [workspace, setWorkspace] = React.useState(DEMO_WORKSPACE);
  const [slug, setSlug] = React.useState('');
  const [slugTouched, setSlugTouched] = React.useState(false);

  const [fullName, setFullName] = React.useState('');
  const [role, setRole] = React.useState('');

  const [invites, setInvites] = React.useState<string[]>(['', '', '']);

  const [theme, setTheme] = React.useState('system');
  const [notify, setNotify] = React.useState(true);

  const effectiveSlug = slugTouched ? slug : slugify(workspace);
  const invitesValid = invites.every((e) => !e.trim() || EMAIL_RE.test(e));
  const invitedCount = invites.filter((e) => EMAIL_RE.test(e)).length;

  const canContinue = [
    workspace.trim().length > 1 && effectiveSlug.length > 1,
    fullName.trim().length > 1 && role !== '',
    invitesValid,
    true,
  ][step];

  const restart = () => {
    setDone(false);
    setStep(0);
    setWorkspace(DEMO_WORKSPACE);
    setSlug('');
    setSlugTouched(false);
    setFullName('');
    setRole('');
    setInvites(['', '', '']);
    setTheme('system');
    setNotify(true);
  };

  return (
    <section
      data-slot="onboarding-01-block"
      className="flex min-h-svh w-full items-center justify-center bg-background px-4 py-10 sm:px-6"
    >
      <Card className="w-full max-w-xl gap-0 px-6 py-6 sm:px-8 sm:py-8">
        {done ? (
          <div
            data-slot="onboarding-done"
            className="flex flex-col items-center gap-5 py-6 text-center animate-in fade-in-0 zoom-in-95 duration-300 ease-out motion-reduce:animate-none"
          >
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="size-7" strokeWidth={2.5} aria-hidden />
            </span>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                {workspace.trim() || 'Your workspace'} is ready.
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                {invitedCount > 0 ? `We sent ${invitedCount} ${invitedCount === 1 ? 'invite' : 'invites'}. ` : ''}
                You can change any of this later in Settings.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button type="button" size="lg">
                Go to dashboard
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Button>
              <Button type="button" variant="link" size="sm" onClick={restart} className="text-muted-foreground">
                Start over
              </Button>
            </div>
          </div>
        ) : (
          <Onboarding steps={STEPS} step={step} onStepChange={setStep} onComplete={() => setDone(true)}>
            <OnboardingHeader />

            <OnboardingStep index={0}>
              <div className="flex flex-col gap-1">
                <OnboardingStepTitle>Name your workspace</OnboardingStepTitle>
                <OnboardingStepDescription>
                  Usually your company or team name. Teammates will see it.
                </OnboardingStepDescription>
              </div>
              <OnboardingBody>
                <FieldGroup className="gap-5">
                  <Field className="gap-2">
                    <FieldLabel htmlFor="onboarding-workspace">Workspace name</FieldLabel>
                    <Input
                      id="onboarding-workspace"
                      value={workspace}
                      onChange={(e) => setWorkspace(e.target.value)}
                      placeholder="Plinth Labs"
                      autoComplete="organization"
                      autoFocus
                    />
                  </Field>
                  <Field className="gap-2">
                    <FieldLabel htmlFor="onboarding-slug">Workspace URL</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <span className="text-muted-foreground">hirael.app/</span>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="onboarding-slug"
                        value={effectiveSlug}
                        onChange={(e) => {
                          setSlugTouched(true);
                          setSlug(slugify(e.target.value));
                        }}
                        placeholder="plinth-labs"
                        spellCheck={false}
                        autoComplete="off"
                      />
                    </InputGroup>
                    <FieldDescription className="text-xs">
                      {effectiveSlug ? (
                        <>
                          Your team signs in at{' '}
                          <span className="font-mono text-foreground">hirael.app/{effectiveSlug}</span>.
                        </>
                      ) : (
                        'Lowercase letters, numbers, and dashes. Derived from the name until you edit it.'
                      )}
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </OnboardingBody>
              <OnboardingFooter canContinue={canContinue} />
            </OnboardingStep>

            <OnboardingStep index={1}>
              <div className="flex flex-col gap-1">
                <OnboardingStepTitle>Tell us about you</OnboardingStepTitle>
                <OnboardingStepDescription>
                  Shown on comments and activity. Your role tunes the defaults.
                </OnboardingStepDescription>
              </div>
              <OnboardingBody>
                <FieldGroup className="gap-5">
                  <Field className="gap-2">
                    <FieldLabel htmlFor="onboarding-name">Full name</FieldLabel>
                    <Input
                      id="onboarding-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Mohammad Shehadeh"
                      autoComplete="name"
                      autoFocus
                    />
                  </Field>
                  <Field className="gap-2">
                    <FieldLabel htmlFor="onboarding-role">What do you do?</FieldLabel>
                    <Select value={role} onValueChange={(v) => setRole(v ?? '')}>
                      <SelectTrigger id="onboarding-role" className="w-full">
                        <SelectValue placeholder="Pick a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
              </OnboardingBody>
              <OnboardingFooter canContinue={canContinue} />
            </OnboardingStep>

            <OnboardingStep index={2}>
              <div className="flex flex-col gap-1">
                <OnboardingStepTitle>Invite your team</OnboardingStepTitle>
                <OnboardingStepDescription>
                  They join as members. You can change roles once they accept.
                </OnboardingStepDescription>
              </div>
              <OnboardingBody>
                <div className="flex flex-col gap-2">
                  {invites.map((email, i) => {
                    const invalid = email.trim() !== '' && !EMAIL_RE.test(email);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          type="email"
                          value={email}
                          aria-label={`Teammate ${i + 1} email`}
                          aria-invalid={invalid || undefined}
                          onChange={(e) => setInvites((list) => list.map((v, j) => (j === i ? e.target.value : v)))}
                          placeholder={
                            ['lena@company.com', 'omar@company.com', 'priya@company.com'][i] ?? 'name@company.com'
                          }
                          autoComplete="off"
                          autoFocus={i === 0}
                        />
                        {invites.length > 1 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Remove teammate ${i + 1}`}
                            onClick={() => setInvites((list) => list.filter((_, j) => j !== i))}
                            className="size-9 shrink-0 text-muted-foreground hover:text-foreground"
                          >
                            <X className="size-4" aria-hidden />
                          </Button>
                        ) : null}
                      </div>
                    );
                  })}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={invites.length >= MAX_INVITES}
                    onClick={() => setInvites((list) => [...list, ''])}
                    className="self-start text-muted-foreground"
                  >
                    <Plus className="size-3.5" aria-hidden />
                    Add another
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground" aria-live="polite">
                  {invitedCount === 0
                    ? 'Leave these empty to skip. You can invite people any time.'
                    : `${invitedCount} ${invitedCount === 1 ? 'person' : 'people'} will get an invite.`}
                </p>
              </OnboardingBody>
              <OnboardingFooter canContinue={canContinue} skippable onSkip={() => setInvites(['', '', ''])} />
            </OnboardingStep>

            <OnboardingStep index={3}>
              <div className="flex flex-col gap-1">
                <OnboardingStepTitle>A few preferences</OnboardingStepTitle>
                <OnboardingStepDescription>
                  Both of these live in Settings if you change your mind.
                </OnboardingStepDescription>
              </div>
              <OnboardingBody>
                <FieldSet>
                  <FieldLegend variant="label" className="mb-2">
                    Appearance
                  </FieldLegend>
                  <RadioGroup value={theme} onValueChange={setTheme} className="grid gap-2 sm:grid-cols-3">
                    {THEMES.map((t) => {
                      const id = `onboarding-theme-${t.value}`;
                      return (
                        <FieldLabel key={t.value} htmlFor={id}>
                          <Field orientation="horizontal" className="gap-3">
                            <FieldContent className="gap-0.5">
                              <FieldTitle>{t.label}</FieldTitle>
                              <FieldDescription className="text-xs">{t.description}</FieldDescription>
                            </FieldContent>
                            <RadioGroupItem id={id} value={t.value} />
                          </Field>
                        </FieldLabel>
                      );
                    })}
                  </RadioGroup>
                </FieldSet>
                <Field
                  orientation="horizontal"
                  className="items-center justify-between rounded-md border border-border p-3"
                >
                  <FieldContent className="gap-0.5">
                    <FieldLabel htmlFor="onboarding-notify">Email me a weekly digest</FieldLabel>
                    <FieldDescription className="text-xs">
                      What changed, who joined, and what needs a look. Sent Monday mornings.
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="onboarding-notify" checked={notify} onCheckedChange={setNotify} />
                </Field>
              </OnboardingBody>
              <OnboardingFooter canContinue={canContinue} />
            </OnboardingStep>
          </Onboarding>
        )}
      </Card>
    </section>
  );
};

export default Onboarding01;
