import * as React from 'react';
import { AlertCircle, AlertTriangle, Ban, CheckCircle2, Info } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const destructiveClass = 'border-destructive bg-destructive/10 text-destructive';

const calloutVariants = cva(
  'grid grid-cols-[minmax(0,1fr)] items-start gap-x-2 overflow-hidden rounded-md border-s-4 p-4 text-sm has-[>[data-slot=callout-icon]]:grid-cols-[auto_minmax(0,1fr)]',
  {
    // --info / --success / --warning ship in this component's cssVars.
    variants: {
      variant: {
        neutral: 'border-muted-foreground/50 bg-muted/50 text-foreground',
        info: 'border-info bg-info/10 text-info',
        success: 'border-success bg-success/10 text-success',
        warning: 'border-warning bg-warning/10 text-warning',
        destructive: destructiveClass,
        /** @deprecated Use `destructive`. */
        error: destructiveClass,
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

type CalloutVariant = NonNullable<VariantProps<typeof calloutVariants>['variant']>;

const variantIcons: Record<CalloutVariant, React.ElementType> = {
  neutral: AlertCircle,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: Ban,
  error: Ban,
};

export interface CalloutProps extends Omit<React.ComponentProps<'div'>, 'title'>, VariantProps<typeof calloutVariants> {
  /** Shorthand for a leading `<CalloutTitle>`. */
  title?: React.ReactNode;
  icon?: React.ElementType | React.ReactElement | false;
}

const Callout = ({ title, icon, className, variant = 'info', children, ...props }: CalloutProps) => {
  const variantKey: CalloutVariant = variant === 'error' ? 'destructive' : (variant ?? 'info');

  const renderIcon = () => {
    if (icon === false) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent = (icon as React.ElementType | undefined) ?? variantIcons[variantKey];

    return <IconComponent className="size-5" />;
  };

  return (
    <div
      data-slot="callout"
      data-variant={variantKey}
      role={variantKey === 'destructive' ? 'alert' : undefined}
      className={cn(calloutVariants({ variant: variantKey }), className)}
      {...props}
    >
      {icon !== false && (
        <span data-slot="callout-icon" aria-hidden className="flex shrink-0 [&_svg:not([class*='size-'])]:size-5">
          {renderIcon()}
        </span>
      )}
      <div
        data-slot="callout-content"
        className="min-w-0 leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&>[data-slot=callout-title]]:mb-1"
      >
        {title ? <CalloutTitle>{title}</CalloutTitle> : null}
        {children}
      </div>
    </div>
  );
};

const CalloutTitle = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div data-slot="callout-title" className={cn('leading-5 font-semibold', className)} {...props} />;
};

const CalloutDescription = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div data-slot="callout-description" className={cn('text-sm leading-relaxed', className)} {...props} />;
};

export { Callout, CalloutTitle, CalloutDescription, calloutVariants };
