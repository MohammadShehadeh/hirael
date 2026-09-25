'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/registry/hirael/bases/radix/ui/dialog';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@/registry/hirael/bases/radix/ui/questionnaire';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 80): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

type Reason = 'too-expensive' | 'missing-feature' | 'switching' | 'not-using' | 'other';

const REASONS: readonly { value: Reason; label: string }[] = [
  { value: 'too-expensive', label: 'It costs too much' },
  { value: 'missing-feature', label: 'It is missing a feature we need' },
  { value: 'switching', label: 'We are switching to another tool' },
  { value: 'not-using', label: 'We are not using it enough' },
  { value: 'other', label: 'Something else' },
];

const PAUSE_OPTIONS = [
  { value: '1', label: '1 month' },
  { value: '2', label: '2 months' },
  { value: '3', label: '3 months' },
] as const;

const PLAN = {
  name: 'Team',
  seats: 5,
  price: 60,
  /** ISO date of the next invoice. */
  renews: '2026-10-14',
};

const DISCOUNT = 0.3;
const DISCOUNT_MONTHS = 3;

type PlanStatus =
  | { kind: 'active' }
  | { kind: 'discounted'; until: string }
  | { kind: 'paused'; until: string }
  | { kind: 'canceling'; on: string };

interface Feedback {
  reason: Reason;
  detail: string;
}

const addMonths = (iso: string, months: number) => {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + months);

  return date.toISOString().slice(0, 10);
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  );

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);

const DISCOUNTED_PRICE = Math.round(PLAN.price * (1 - DISCOUNT) * 100) / 100;

const reasonLabel = (reason: Reason) => REASONS.find((option) => option.value === reason)?.label ?? '';

type FollowUp = 'discount' | 'pause' | 'feature' | 'note';

const FOLLOW_UP: Record<Reason, FollowUp> = {
  'too-expensive': 'discount',
  'not-using': 'pause',
  'missing-feature': 'feature',
  switching: 'note',
  other: 'note',
};

const REASON_CHOICES = REASONS.map((option) => ({ value: option.value }));
const DISCOUNT_CHOICES = [{ value: 'discount' }, { value: 'cancel' }];
const PAUSE_CHOICES = [...PAUSE_OPTIONS.map((option) => ({ value: option.value })), { value: 'cancel' }];

interface CancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscount: (feedback: Feedback) => void;
  onPause: (months: number, feedback: Feedback) => void;
  onCancel: (feedback: Feedback) => void;
}

const CancelDialog = ({ open, onOpenChange, onDiscount, onPause, onCancel }: CancelDialogProps) => {
  const [item, setItem] = React.useState('reason');
  const [reason, setReason] = React.useState<Reason | ''>('');
  const [otherText, setOtherText] = React.useState('');
  const [otherError, setOtherError] = React.useState(false);
  const [decision, setDecision] = React.useState<Partial<Record<FollowUp, string>>>({});
  const otherInput = React.useRef<HTMLInputElement>(null);

  // Until a reason is picked the generic note stands in, so progress and Continue already read as two steps.
  const followUp = reason ? FOLLOW_UP[reason] : 'note';

  const items = React.useMemo(
    () => [
      { name: 'reason', required: true, choices: REASON_CHOICES },
      { name: 'discount', required: true, disabled: followUp !== 'discount', choices: DISCOUNT_CHOICES },
      { name: 'pause', required: true, disabled: followUp !== 'pause', choices: PAUSE_CHOICES },
      { name: 'feature', disabled: followUp !== 'feature' },
      { name: 'note', disabled: followUp !== 'note' },
    ],
    [followUp],
  );

  const pickReason = (next: Reason) => {
    setReason(next);
    setOtherError(false);
  };

  // "Something else" counts as an answer by itself, so an empty freeform reason is caught when leaving the step.
  const handleItemChange = (next: string) => {
    if (item === 'reason' && next !== 'reason' && reason === 'other' && !otherText.trim()) {
      setOtherError(true);
      otherInput.current?.focus();

      return;
    }
    setItem(next);
  };

  const pick = (name: FollowUp, value: string) => () => setDecision((current) => ({ ...current, [name]: value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reason) return;
    const answer = String(new FormData(event.currentTarget).get(followUp) ?? '');
    const note = followUp === 'feature' || followUp === 'note' ? answer.trim() : '';
    const feedback: Feedback = {
      reason,
      detail: reason === 'other' ? [otherText.trim(), note].filter(Boolean).join('. ') : note,
    };

    if (followUp === 'discount' && answer === 'discount') {
      onDiscount(feedback);
    } else if (followUp === 'pause' && answer !== 'cancel') {
      onPause(Number(answer), feedback);
    } else {
      onCancel(feedback);
    }
  };

  const chosen = decision[followUp];
  const offer = followUp === 'discount' || followUp === 'pause';
  const submitLabel = !offer
    ? 'Send and cancel'
    : !chosen
      ? 'Confirm'
      : chosen === 'cancel'
        ? 'Cancel plan'
        : followUp === 'discount'
          ? 'Apply 30% off'
          : `Pause for ${PAUSE_OPTIONS.find((option) => option.value === chosen)?.label}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Questionnaire
          items={items}
          item={item}
          shortcuts="numbers"
          onItemChange={handleItemChange}
          onSubmit={handleSubmit}
        >
          <QuestionnaireItem name="reason" required invalid={otherError} className={SWAP}>
            <DialogHeader>
              <QuestionnaireProgress />
              <QuestionnaireTitle render={<DialogTitle />}>Why are you canceling?</QuestionnaireTitle>
              <QuestionnaireDescription render={<DialogDescription />}>
                Your answer goes to the product team and helps us fix what went wrong.
              </QuestionnaireDescription>
            </DialogHeader>
            <QuestionnaireChoices>
              {REASONS.map((option) => (
                <QuestionnaireChoice
                  key={option.value}
                  value={option.value}
                  checked={reason === option.value}
                  onChange={() => pickReason(option.value)}
                >
                  {option.label}
                </QuestionnaireChoice>
              ))}
              {reason === 'other' ? (
                <QuestionnaireInput
                  ref={otherInput}
                  aria-label="What is the reason?"
                  placeholder="Our company is closing the support team"
                  value={otherText}
                  autoFocus
                  className={SWAP}
                  onChange={(event) => {
                    setOtherText(event.target.value);
                    setOtherError(false);
                  }}
                />
              ) : null}
            </QuestionnaireChoices>
            <QuestionnaireError>
              {reason === 'other' ? 'Tell us a bit more about why.' : 'Pick a reason to continue.'}
            </QuestionnaireError>
          </QuestionnaireItem>

          <QuestionnaireItem name="discount" required disabled={followUp !== 'discount'} className={SWAP}>
            <DialogHeader>
              <QuestionnaireProgress />
              <QuestionnaireTitle render={<DialogTitle />}>Stay for 30% less</QuestionnaireTitle>
              <QuestionnaireDescription render={<DialogDescription />}>
                Keep the {PLAN.name} plan at a lower price for your next {DISCOUNT_MONTHS} invoices. After that it goes
                back to {formatPrice(PLAN.price)} a month.
              </QuestionnaireDescription>
            </DialogHeader>
            <div className="flex items-baseline gap-2 rounded-lg border border-border px-4 py-3">
              <span className="text-2xl font-semibold tabular-nums">{formatPrice(DISCOUNTED_PRICE)}</span>
              <span className="text-sm text-muted-foreground">per month</span>
              <s className="ms-auto text-sm text-muted-foreground tabular-nums">{formatPrice(PLAN.price)}</s>
            </div>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="discount" onChange={pick('discount', 'discount')}>
                Apply 30% off
                <QuestionnaireChoiceDescription>
                  Until <span className="tabular-nums">{formatDate(addMonths(PLAN.renews, DISCOUNT_MONTHS))}</span>
                </QuestionnaireChoiceDescription>
              </QuestionnaireChoice>
              <QuestionnaireChoice value="cancel" onChange={pick('discount', 'cancel')}>
                Cancel anyway
                <QuestionnaireChoiceDescription>
                  You keep access until <span className="tabular-nums">{formatDate(PLAN.renews)}</span>
                </QuestionnaireChoiceDescription>
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError>Take the offer or cancel anyway.</QuestionnaireError>
          </QuestionnaireItem>

          <QuestionnaireItem name="pause" required disabled={followUp !== 'pause'} className={SWAP}>
            <DialogHeader>
              <QuestionnaireProgress />
              <QuestionnaireTitle render={<DialogTitle />}>Pause instead of canceling</QuestionnaireTitle>
              <QuestionnaireDescription render={<DialogDescription />}>
                Billing stops at your next renewal and your inboxes stay exactly as they are.
              </QuestionnaireDescription>
            </DialogHeader>
            <QuestionnaireChoices>
              {PAUSE_OPTIONS.map((option) => (
                <QuestionnaireChoice key={option.value} value={option.value} onChange={pick('pause', option.value)}>
                  Pause for {option.label}
                  <QuestionnaireChoiceDescription>
                    Relay resumes on{' '}
                    <span className="tabular-nums">{formatDate(addMonths(PLAN.renews, Number(option.value)))}</span>
                  </QuestionnaireChoiceDescription>
                </QuestionnaireChoice>
              ))}
              <QuestionnaireChoice value="cancel" onChange={pick('pause', 'cancel')}>
                Cancel anyway
                <QuestionnaireChoiceDescription>
                  You keep access until <span className="tabular-nums">{formatDate(PLAN.renews)}</span>
                </QuestionnaireChoiceDescription>
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError>Pick how long to pause, or cancel anyway.</QuestionnaireError>
          </QuestionnaireItem>

          <QuestionnaireItem name="feature" disabled={followUp !== 'feature'} className={SWAP}>
            <DialogHeader>
              <QuestionnaireProgress />
              <QuestionnaireTitle render={<DialogTitle />}>Which feature were you looking for?</QuestionnaireTitle>
              <QuestionnaireDescription render={<DialogDescription />}>
                Optional. We share every request with the team that plans the roadmap.
              </QuestionnaireDescription>
            </DialogHeader>
            <QuestionnaireInput aria-label="Feature" placeholder="Two-way sync with Salesforce" />
            <QuestionnaireError>Name the feature, or skip this question.</QuestionnaireError>
          </QuestionnaireItem>

          <QuestionnaireItem name="note" disabled={followUp !== 'note'} className={SWAP}>
            <DialogHeader>
              <QuestionnaireProgress />
              <QuestionnaireTitle render={<DialogTitle />}>Anything we could have done?</QuestionnaireTitle>
              <QuestionnaireDescription render={<DialogDescription />}>
                Optional. One sentence helps more than you might think.
              </QuestionnaireDescription>
            </DialogHeader>
            <QuestionnaireInput aria-label="What we could have done" placeholder="Better reporting on response times" />
            <QuestionnaireError>Write a short answer, or skip this question.</QuestionnaireError>
          </QuestionnaireItem>

          <DialogFooter>
            {item === 'reason' ? (
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Keep my plan
              </Button>
            ) : null}
            <QuestionnaireActions>
              <QuestionnairePrevious variant="ghost">Back</QuestionnairePrevious>
              <QuestionnaireSkip>Skip and cancel</QuestionnaireSkip>
              <QuestionnaireNext>Continue</QuestionnaireNext>
              <QuestionnaireSubmit variant={offer && chosen !== 'cancel' ? 'default' : 'destructive'}>
                {submitLabel}
              </QuestionnaireSubmit>
            </QuestionnaireActions>
          </DialogFooter>
        </Questionnaire>
      </DialogContent>
    </Dialog>
  );
};

const STATUS_BADGE: Record<PlanStatus['kind'], { label: string; variant: 'secondary' | 'outline' | 'destructive' }> = {
  active: { label: 'Active', variant: 'secondary' },
  discounted: { label: '30% off', variant: 'secondary' },
  paused: { label: 'Paused', variant: 'outline' },
  canceling: { label: 'Canceling', variant: 'destructive' },
};

const Survey03 = () => {
  const [status, setStatus] = React.useState<PlanStatus>({ kind: 'active' });
  const [feedback, setFeedback] = React.useState<Feedback | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  // A fresh key per opening starts the survey over without resetting state during the close animation.
  const [dialogKey, setDialogKey] = React.useState(0);

  const openDialog = () => {
    setDialogKey((key) => key + 1);
    setDialogOpen(true);
  };

  const finish = (next: PlanStatus, note: Feedback) => {
    setStatus(next);
    setFeedback(note);
    setDialogOpen(false);
  };

  const badge = STATUS_BADGE[status.kind];
  const price = status.kind === 'discounted' ? DISCOUNTED_PRICE : PLAN.price;

  const summary =
    status.kind === 'active'
      ? 'Cancel any time. You keep access until the end of the billing period.'
      : status.kind === 'discounted'
        ? `30% off your next ${DISCOUNT_MONTHS} invoices, then ${formatPrice(PLAN.price)} a month again.`
        : status.kind === 'paused'
          ? `No charges while paused. Billing resumes on ${formatDate(status.until)}.`
          : `You keep access until ${formatDate(status.on)}. Nothing else will be charged.`;

  const details: { label: string; value: string }[] =
    status.kind === 'active'
      ? [{ label: 'Renews on', value: formatDate(PLAN.renews) }]
      : status.kind === 'discounted'
        ? [
            { label: 'Renews on', value: formatDate(PLAN.renews) },
            { label: 'Discount ends', value: formatDate(status.until) },
          ]
        : status.kind === 'paused'
          ? [
              { label: 'Pauses on', value: formatDate(PLAN.renews) },
              { label: 'Paused until', value: formatDate(status.until) },
            ]
          : [{ label: 'Cancels on', value: formatDate(status.on) }];

  return (
    <section data-slot="cancel-survey" aria-labelledby="survey-03-heading" className="bg-background py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6">
        <div className="flex flex-col gap-1">
          <h2 id="survey-03-heading" className={cn(ENTER, 'text-xl font-semibold tracking-tight')}>
            Plan
          </h2>
          <p style={stagger(1)} className={cn(ENTER, 'text-sm text-muted-foreground')}>
            Your subscription for the Northwind Support workspace.
          </p>
        </div>

        <div
          data-slot="plan-card"
          data-status={status.kind}
          style={stagger(2)}
          className={cn(ENTER, 'rounded-xl border border-border bg-card text-card-foreground shadow-xs')}
        >
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-medium">{PLAN.name} plan</h3>
                <Badge key={status.kind} variant={badge.variant} className={SWAP}>
                  {badge.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="tabular-nums">{PLAN.seats}</span> seats, billed monthly
              </p>
            </div>
            <div data-slot="plan-card-price" className="flex items-baseline gap-1.5">
              <span
                key={price}
                className={cn(
                  SWAP,
                  'text-2xl font-semibold tabular-nums',
                  (status.kind === 'paused' || status.kind === 'canceling') && 'text-muted-foreground',
                )}
              >
                {formatPrice(price)}
              </span>
              <span className="text-sm text-muted-foreground">per month</span>
              {status.kind === 'discounted' ? (
                <s className="text-sm text-muted-foreground tabular-nums">{formatPrice(PLAN.price)}</s>
              ) : null}
            </div>
          </div>

          <dl key={status.kind} className={cn(SWAP, 'grid gap-4 border-t border-border px-6 py-4 sm:grid-cols-2')}>
            {details.map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground uppercase">{item.label}</dt>
                <dd className="text-sm font-medium tabular-nums">{item.value}</dd>
              </div>
            ))}
            {feedback ? (
              <div className="flex flex-col gap-0.5 sm:col-span-2">
                <dt className="text-xs text-muted-foreground uppercase">Your feedback</dt>
                <dd className="text-sm">
                  {reasonLabel(feedback.reason)}
                  {feedback.detail ? <span className="text-muted-foreground">. {feedback.detail}</span> : null}
                </dd>
              </div>
            ) : null}
          </dl>

          <div
            data-slot="plan-card-footer"
            className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {summary}
            </p>
            {status.kind === 'paused' ? (
              <Button
                type="button"
                variant="outline"
                className="shrink-0"
                onClick={() => setStatus({ kind: 'active' })}
              >
                Resume now
              </Button>
            ) : status.kind === 'canceling' ? (
              <Button type="button" className="shrink-0" onClick={() => setStatus({ kind: 'active' })}>
                Undo cancellation
              </Button>
            ) : (
              <Button type="button" variant="outline" className="shrink-0" onClick={openDialog}>
                Cancel plan
              </Button>
            )}
          </div>
        </div>
      </div>

      <CancelDialog
        key={dialogKey}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onDiscount={(note) => finish({ kind: 'discounted', until: addMonths(PLAN.renews, DISCOUNT_MONTHS) }, note)}
        onPause={(months, note) => finish({ kind: 'paused', until: addMonths(PLAN.renews, months) }, note)}
        onCancel={(note) => finish({ kind: 'canceling', on: PLAN.renews }, note)}
      />
    </section>
  );
};

export default Survey03;
