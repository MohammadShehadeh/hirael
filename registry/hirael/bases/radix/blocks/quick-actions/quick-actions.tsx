'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ArrowLeftRight, FilePlus2, UserPlus, Wallet } from 'lucide-react';

import { cn } from '@/lib/utils';

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
        'group flex flex-col items-start gap-2.5 rounded-lg border border-border bg-card p-3 text-start transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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
        'inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors group-hover:bg-card [&_svg]:size-4',
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

const QUICK_ACTION_ROWS = [
  { icon: FilePlus2, label: 'New invoice', description: 'Bill a customer' },
  { icon: UserPlus, label: 'Invite', description: 'Add a teammate' },
  { icon: Wallet, label: 'Payout', description: 'Move funds out' },
  { icon: ArrowLeftRight, label: 'Transfer', description: 'Between accounts' },
];

const QuickActionsBlock = () => {
  return (
    <section data-slot="quick-actions-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <QuickActions columns={2} className="w-full max-w-md">
        {QUICK_ACTION_ROWS.map((action) => (
          <QuickAction key={action.label}>
            <QuickActionIcon>
              <action.icon />
            </QuickActionIcon>
            <QuickActionLabel>{action.label}</QuickActionLabel>
            <QuickActionDescription>{action.description}</QuickActionDescription>
          </QuickAction>
        ))}
      </QuickActions>
    </section>
  );
};

export default QuickActionsBlock;
