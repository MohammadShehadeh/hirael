'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ArrowLeftRight, Check, FilePlus2, UserPlus, Wallet } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldError, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';

interface QuickActionsProps extends React.ComponentProps<'div'> {
  /** Number of columns in the action grid. */
  columns?: number;
}

const QuickActions = ({ columns = 2, className, style, ...props }: QuickActionsProps) => {
  return (
    <div
      data-slot="quick-actions"
      className={cn('grid gap-2', className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        ...style,
      }}
      {...props}
    />
  );
};

interface QuickActionProps extends React.ComponentProps<'button'> {
  asChild?: boolean;
}

const QuickAction = ({ asChild = false, className, ...props }: QuickActionProps) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="quick-action"
      className={cn(
        'group flex flex-col items-start gap-2.5 rounded-lg border border-border bg-card p-3 text-start transition-colors duration-150 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-[state=open]:bg-accent',
        className,
      )}
      {...(asChild ? {} : { type: 'button' })}
      {...props}
    />
  );
};

type QuickActionIconProps = React.ComponentProps<'span'>;

const QuickActionIcon = ({ className, ...props }: QuickActionIconProps) => {
  return (
    <span
      data-slot="quick-action-icon"
      className={cn(
        'inline-flex items-center text-muted-foreground transition-colors duration-150 group-hover:text-foreground [&_svg]:size-4',
        className,
      )}
      {...props}
    />
  );
};

type QuickActionLabelProps = React.ComponentProps<'span'>;

const QuickActionLabel = ({ className, ...props }: QuickActionLabelProps) => {
  return (
    <span data-slot="quick-action-label" className={cn('text-sm font-medium text-foreground', className)} {...props} />
  );
};

type QuickActionDescriptionProps = React.ComponentProps<'span'>;

const QuickActionDescription = ({ className, ...props }: QuickActionDescriptionProps) => {
  return (
    <span data-slot="quick-action-description" className={cn('text-xs text-muted-foreground', className)} {...props} />
  );
};

export { QuickActions, QuickAction, QuickActionIcon, QuickActionLabel, QuickActionDescription };

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const formatAmount = (value: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateDraft = (type: string, field: string, value: string) => {
  if (!value) return `Enter the ${field.toLowerCase()}.`;
  if (type === 'email' && !EMAIL_PATTERN.test(value)) return "That doesn't look like a valid email.";
  if (type === 'number' && !(Number(value) > 0)) return 'Enter an amount above zero.';

  return null;
};

const QUICK_ACTION_ROWS = [
  {
    id: 'invoice',
    icon: FilePlus2,
    label: 'New invoice',
    description: 'Bill a customer',
    field: 'Customer',
    placeholder: 'Hirael',
    type: 'text',
    submit: 'Create draft',
    result: (value: string) => `Draft for ${value} created`,
  },
  {
    id: 'invite',
    icon: UserPlus,
    label: 'Invite',
    description: 'Add a teammate',
    field: 'Work email',
    placeholder: 'sam@hirael.com',
    type: 'email',
    submit: 'Send invite',
    result: (value: string) => `Invite sent to ${value}`,
  },
  {
    id: 'payout',
    icon: Wallet,
    label: 'Payout',
    description: 'Move funds out',
    field: 'Amount in USD',
    placeholder: '1200',
    type: 'number',
    submit: 'Schedule payout',
    result: (value: string) => `${formatAmount(value)} arrives Thursday`,
  },
  {
    id: 'transfer',
    icon: ArrowLeftRight,
    label: 'Transfer',
    description: 'Between accounts',
    field: 'Amount to savings',
    placeholder: '500',
    type: 'number',
    submit: 'Transfer',
    result: (value: string) => `${formatAmount(value)} moved to savings`,
  },
];

const QuickActionsBlock = () => {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});
  const [results, setResults] = React.useState<Record<string, string>>({});
  const [errors, setErrors] = React.useState<Record<string, string | null>>({});

  return (
    <section data-slot="quick-actions-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <QuickActions columns={2} className={cn(ENTER, 'w-full max-w-md')}>
        {QUICK_ACTION_ROWS.map((action) => {
          const result = results[action.id];
          const draft = drafts[action.id] ?? '';
          const error = errors[action.id];
          const inputId = `quick-action-${action.id}`;
          const errorId = `${inputId}-error`;

          return (
            <Popover
              key={action.id}
              open={openId === action.id}
              onOpenChange={(open) => {
                setOpenId(open ? action.id : null);
                setErrors((current) => ({ ...current, [action.id]: null }));
              }}
            >
              <PopoverTrigger asChild>
                <QuickAction data-done={result ? '' : undefined}>
                  <QuickActionIcon key={result ? 'done' : 'idle'} className={cn(result && 'text-success', SWAP)}>
                    {result ? <Check /> : <action.icon />}
                  </QuickActionIcon>
                  <QuickActionLabel>{action.label}</QuickActionLabel>
                  <QuickActionDescription key={result ?? 'idle'} className={SWAP} aria-live="polite">
                    {result ?? action.description}
                  </QuickActionDescription>
                </QuickAction>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64">
                <form
                  noValidate
                  className="flex flex-col gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const nextError = validateDraft(action.type, action.field, draft.trim());
                    setErrors((current) => ({ ...current, [action.id]: nextError }));
                    if (nextError) return;
                    setResults((current) => ({ ...current, [action.id]: action.result(draft.trim()) }));
                    setDrafts((current) => ({ ...current, [action.id]: '' }));
                    setOpenId(null);
                  }}
                >
                  <Field data-invalid={Boolean(error) || undefined}>
                    <FieldLabel htmlFor={inputId}>{action.field}</FieldLabel>
                    <Input
                      id={inputId}
                      type={action.type}
                      inputMode={action.type === 'number' ? 'decimal' : undefined}
                      min={action.type === 'number' ? 1 : undefined}
                      placeholder={action.placeholder}
                      value={draft}
                      onChange={(event) => setDrafts((current) => ({ ...current, [action.id]: event.target.value }))}
                      aria-invalid={Boolean(error) || undefined}
                      aria-describedby={error ? errorId : undefined}
                    />
                    <FieldError id={errorId}>{error}</FieldError>
                  </Field>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setOpenId(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      {action.submit}
                    </Button>
                  </div>
                </form>
              </PopoverContent>
            </Popover>
          );
        })}
      </QuickActions>
    </section>
  );
};

export default QuickActionsBlock;
