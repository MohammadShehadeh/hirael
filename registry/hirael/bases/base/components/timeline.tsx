import * as React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

type TimelineProps = React.ComponentProps<'ol'>;

const Timeline = ({ className, ...props }: TimelineProps) => {
  return <ol data-slot="timeline" className={cn('relative flex flex-col', className)} {...props} />;
};

type TimelineItemProps = React.ComponentProps<'li'>;

const TimelineItem = ({ className, ...props }: TimelineItemProps) => {
  return (
    <li
      data-slot="timeline-item"
      className={cn(
        'group relative flex gap-4 pb-6 last:pb-0',
        'before:absolute before:start-[7px] before:top-4 before:bottom-0 before:w-px before:bg-border',
        'last:before:hidden',
        className,
      )}
      {...props}
    />
  );
};

export type TimelineTone =
  | 'neutral'
  | 'muted'
  | 'info'
  | 'success'
  | 'warning'
  | 'destructive'
  /** @deprecated Use `neutral`. */
  | 'default'
  /** @deprecated Use `destructive`. */
  | 'danger';

type ResolvedTimelineTone = Exclude<TimelineTone, 'default' | 'danger'>;

const timelineDotVariants = cva(
  'relative z-10 mt-1.5 inline-flex size-[15px] shrink-0 items-center justify-center rounded-full ring-2 ring-background',
  {
    variants: {
      tone: {
        neutral: 'bg-foreground',
        muted: 'bg-muted-foreground',
        info: 'bg-info',
        success: 'bg-success',
        warning: 'bg-warning',
        destructive: 'bg-destructive',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
);

const timelineIconDotVariants = cva(
  'relative z-10 mt-0.5 inline-flex size-6 -translate-x-[5px] items-center justify-center rounded-full bg-background ring-1 rtl:translate-x-[5px] [&_svg]:size-3',
  {
    variants: {
      tone: {
        neutral: 'ring-border',
        muted: 'text-muted-foreground ring-border',
        info: 'text-info ring-info/50',
        success: 'text-success ring-success/50',
        warning: 'text-warning ring-warning/50',
        destructive: 'text-destructive ring-destructive/50',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
);

interface TimelineDotProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  tone?: TimelineTone;
  children?: React.ReactNode;
}

const TimelineDot = ({ className, tone = 'neutral', children, ...props }: TimelineDotProps) => {
  const resolvedTone: ResolvedTimelineTone = tone === 'default' ? 'neutral' : tone === 'danger' ? 'destructive' : tone;
  const variants = children ? timelineIconDotVariants : timelineDotVariants;

  return (
    <span
      data-slot="timeline-dot"
      data-tone={resolvedTone}
      className={cn(variants({ tone: resolvedTone }), className)}
      {...props}
    >
      {children}
    </span>
  );
};

type TimelineContentProps = React.ComponentProps<'div'>;

const TimelineContent = ({ className, ...props }: TimelineContentProps) => {
  return (
    <div
      data-slot="timeline-content"
      className={cn('flex min-w-0 flex-1 flex-col gap-1 pt-0.5', className)}
      {...props}
    />
  );
};

type TimelineTitleProps = React.ComponentProps<'p'>;

const TimelineTitle = ({ className, ...props }: TimelineTitleProps) => {
  return <p data-slot="timeline-title" className={cn('text-sm font-medium text-foreground', className)} {...props} />;
};

type TimelineTimeProps = React.ComponentProps<'time'>;

const TimelineTime = ({ className, ...props }: TimelineTimeProps) => {
  return (
    <time data-slot="timeline-time" className={cn('text-xs text-muted-foreground uppercase', className)} {...props} />
  );
};

type TimelineDescriptionProps = React.ComponentProps<'p'>;

const TimelineDescription = ({ className, ...props }: TimelineDescriptionProps) => {
  return <p data-slot="timeline-description" className={cn('text-sm text-muted-foreground', className)} {...props} />;
};

export { Timeline, TimelineItem, TimelineDot, TimelineContent, TimelineTitle, TimelineTime, TimelineDescription };
