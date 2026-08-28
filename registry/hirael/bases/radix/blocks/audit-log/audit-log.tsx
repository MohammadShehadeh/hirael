'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/hirael/bases/radix/ui/collapsible';

type AuditLogProps = React.ComponentProps<'ul'>;

const AuditLog = ({ className, ...props }: AuditLogProps) => {
  return (
    <ul
      data-slot="audit-log"
      className={cn('divide-y divide-border overflow-hidden rounded-md border border-border bg-card', className)}
      {...props}
    />
  );
};

interface AuditLogItemProps extends Omit<React.ComponentProps<'li'>, 'onToggle'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AuditLogItem = ({ open, defaultOpen, onOpenChange, className, children, ...props }: AuditLogItemProps) => {
  return (
    <Collapsible asChild open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <li data-slot="audit-log-item" className={cn('flex flex-col', className)} {...props}>
        {children}
      </li>
    </Collapsible>
  );
};

type AuditLogTriggerProps = React.ComponentProps<typeof CollapsibleTrigger>;

const AuditLogTrigger = ({ className, children, ...props }: AuditLogTriggerProps) => {
  return (
    <CollapsibleTrigger
      data-slot="audit-log-trigger"
      className={cn(
        'group flex w-full items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
        className,
      )}
      {...props}
    >
      <ChevronRight
        aria-hidden
        className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-150 group-data-[state=open]:rotate-90 rtl:group-data-[state=closed]:rotate-180"
      />
      {children}
    </CollapsibleTrigger>
  );
};

type AuditLogActorProps = React.ComponentProps<'span'>;

const AuditLogActor = ({ className, ...props }: AuditLogActorProps) => {
  return (
    <span
      data-slot="audit-log-actor"
      className={cn('shrink-0 text-sm font-medium text-foreground', className)}
      {...props}
    />
  );
};

type AuditLogActionProps = React.ComponentProps<'span'>;

const AuditLogAction = ({ className, ...props }: AuditLogActionProps) => {
  return (
    <span data-slot="audit-log-action" className={cn('truncate text-sm text-muted-foreground', className)} {...props} />
  );
};

type AuditLogTimeProps = React.ComponentProps<'time'>;

const AuditLogTime = ({ className, ...props }: AuditLogTimeProps) => {
  return (
    <time
      data-slot="audit-log-time"
      className={cn(
        'ms-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
};

const auditLogStatusVariants = cva(
  'inline-flex shrink-0 items-center rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none tracking-[0.08em]',
  {
    variants: {
      tone: {
        default: 'border-border text-muted-foreground',
        success: 'border-success/30 text-success',
        warning: 'border-warning/30 text-warning',
        danger: 'border-destructive/30 text-destructive',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

type AuditLogStatusProps = React.ComponentProps<'span'> & VariantProps<typeof auditLogStatusVariants>;

const AuditLogStatus = ({ tone = 'default', className, ...props }: AuditLogStatusProps) => {
  return (
    <span
      data-slot="audit-log-status"
      data-tone={tone}
      className={cn(auditLogStatusVariants({ tone }), className)}
      {...props}
    />
  );
};

type AuditLogDetailProps = React.ComponentProps<'dl'>;

const AuditLogDetail = ({ className, children, ...props }: AuditLogDetailProps) => {
  return (
    <CollapsibleContent asChild>
      <dl
        data-slot="audit-log-detail"
        className={cn(
          'grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1.5 border-t border-border bg-muted/30 px-4 py-3 ps-11',
          className,
        )}
        {...props}
      >
        {children}
      </dl>
    </CollapsibleContent>
  );
};

interface AuditLogFieldProps extends React.ComponentProps<'div'> {
  label: React.ReactNode;
}

const AuditLogField = ({ label, className, children, ...props }: AuditLogFieldProps) => {
  return (
    <div data-slot="audit-log-field" className={cn('contents', className)} {...props}>
      <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words font-mono text-[12px] text-foreground">{children}</dd>
    </div>
  );
};

export {
  AuditLog,
  AuditLogItem,
  AuditLogTrigger,
  AuditLogActor,
  AuditLogAction,
  AuditLogTime,
  AuditLogStatus,
  AuditLogDetail,
  AuditLogField,
};

const AuditLogBlock = () => {
  return (
    <section data-slot="audit-log-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <div className="grid w-full max-w-2xl gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Recent events</p>
        <AuditLog>
          <AuditLogItem defaultOpen>
            <AuditLogTrigger>
              <AuditLogActor>lena.park</AuditLogActor>
              <AuditLogAction>updated billing settings</AuditLogAction>
              <AuditLogStatus tone="success" className="ms-auto">
                200
              </AuditLogStatus>
              <AuditLogTime className="ms-0">14:20 UTC</AuditLogTime>
            </AuditLogTrigger>
            <AuditLogDetail>
              <AuditLogField label="Actor">lena.park@acme.co</AuditLogField>
              <AuditLogField label="IP">192.0.2.51</AuditLogField>
              <AuditLogField label="Location">Lisbon, PT</AuditLogField>
              <AuditLogField label="Changed">plan: pro → scale, seats: 10 → 25</AuditLogField>
            </AuditLogDetail>
          </AuditLogItem>

          <AuditLogItem>
            <AuditLogTrigger>
              <AuditLogActor>api/token</AuditLogActor>
              <AuditLogAction>created a new API key</AuditLogAction>
              <AuditLogStatus tone="success" className="ms-auto">
                201
              </AuditLogStatus>
              <AuditLogTime className="ms-0">13:02 UTC</AuditLogTime>
            </AuditLogTrigger>
            <AuditLogDetail>
              <AuditLogField label="Key">sk_live_••••8f21</AuditLogField>
              <AuditLogField label="Scopes">read, write</AuditLogField>
              <AuditLogField label="IP">203.0.113.9</AuditLogField>
            </AuditLogDetail>
          </AuditLogItem>

          <AuditLogItem>
            <AuditLogTrigger>
              <AuditLogActor>theo.adams</AuditLogActor>
              <AuditLogAction>failed sign-in attempt</AuditLogAction>
              <AuditLogStatus tone="danger" className="ms-auto">
                401
              </AuditLogStatus>
              <AuditLogTime className="ms-0">11:47 UTC</AuditLogTime>
            </AuditLogTrigger>
            <AuditLogDetail>
              <AuditLogField label="Reason">invalid password</AuditLogField>
              <AuditLogField label="IP">198.51.100.7</AuditLogField>
              <AuditLogField label="Attempts">3 in 5 min</AuditLogField>
            </AuditLogDetail>
          </AuditLogItem>
        </AuditLog>
      </div>
    </section>
  );
};

export default AuditLogBlock;
